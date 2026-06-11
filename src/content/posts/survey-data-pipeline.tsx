import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "survey-data-pipeline",
  title: "Designing a data pipeline for millions of survey records",
  description:
    "Throughput, correctness, observability — the three forces that pull a data pipeline in different directions. Here's how we balanced them while processing millions of consumer-research records.",
  date: "2026-04-15",
  tags: ["Data Engineering", "Go", "PostgreSQL"],
  readingMinutes: 7,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        The consumer-research platform I work on processes millions of
        survey responses and consumer-behavior records. At that volume, the
        three forces every data pipeline engineer eventually has to
        balance — throughput, correctness, and observability — start
        actively pulling against each other.
      </p>

      <p>
        This is the architecture we landed on after two iterations, what we
        traded away to get there, and what I&rsquo;d change next.
      </p>

      <h2>The three pressures</h2>

      <p>
        Every record that lands in the pipeline carries three implicit
        requirements:
      </p>

      <ul>
        <li>
          <strong>Throughput.</strong> Surveys close on a schedule;
          stragglers arrive in bursts. The pipeline has to absorb the
          burst without falling behind.
        </li>
        <li>
          <strong>Correctness.</strong> Brand decisions are made on the
          aggregated output. A dropped or duplicated record changes the
          answer to the question a marketing team is paying for.
        </li>
        <li>
          <strong>Observability.</strong> When the aggregate looks wrong,
          we need to trace it back to the input within minutes, not hours.
        </li>
      </ul>

      <p>
        Build for throughput alone and you sacrifice correctness on edge
        cases. Build for correctness alone and you can&rsquo;t absorb
        bursts. Build for observability alone and you slow the hot path
        with metrics overhead. The interesting work is finding the seams.
      </p>

      <h2>The architecture</h2>

      <pre>
        <code>{`incoming records ──► ingest API (Go) ──► raw_records table
                          │                       │
                          │                       │ batch read
                          │                       ▼
                          │              ┌────────────────┐
                          │              │  Validator     │
                          │              │  + Enricher    │
                          │              └───────┬────────┘
                          │                      │
                          │                      ▼
                          │           validated_records table
                          │                      │
                          │                      ▼
                          │              ┌────────────────┐
                          │              │  Aggregator    │
                          │              └───────┬────────┘
                          │                      ▼
                          │              materialized views
                          │                      │
                          └──────────────────────┴── replica for reads`}</code>
      </pre>

      <p>Three named layers, each with one job:</p>

      <ul>
        <li>
          The <strong>ingest API</strong> writes raw records into a single
          append-only table. No validation, no enrichment — just persist
          and acknowledge. This is the throughput layer.
        </li>
        <li>
          The <strong>validator/enricher</strong> reads raw records in
          batches, applies the slow work (deduplication, schema validation,
          PII redaction, demographic enrichment), and writes to a second
          table. This is the correctness layer.
        </li>
        <li>
          The <strong>aggregator</strong> refreshes materialized views on
          a schedule. This is the read-path layer.
        </li>
      </ul>

      <p>
        Separating ingestion from validation was the single most valuable
        decision we made. It meant we could absorb a burst at line rate
        even when validation slowed down — the raw table acted as a
        buffer, not a bottleneck.
      </p>

      <h2>What we did for correctness</h2>

      <p>
        Every record gets an idempotency token derived from the survey ID
        and the respondent ID. A second submission with the same token is
        rejected at the ingest layer:
      </p>

      <pre>
        <code>{`CREATE TABLE raw_records (
  id          BIGSERIAL PRIMARY KEY,
  token       VARCHAR(64) NOT NULL UNIQUE,
  survey_id   BIGINT NOT NULL,
  respondent  VARCHAR(64) NOT NULL,
  payload     JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  state       VARCHAR(16) NOT NULL DEFAULT 'raw'
);

CREATE INDEX ON raw_records (state) WHERE state = 'raw';`}</code>
      </pre>

      <p>
        The state column lets us track each record through the pipeline.
        The partial index on <code>state = &lsquo;raw&rsquo;</code> means
        the validator can find unprocessed records in O(1) regardless of
        table size — important once the table grows into the millions.
      </p>

      <h2>What we did for observability</h2>

      <p>
        Three things, in order of usefulness:
      </p>

      <ol>
        <li>
          <strong>A per-state count, refreshed every 30 seconds.</strong>{" "}
          If the <code>raw</code> count grows faster than the{" "}
          <code>validated</code> count, the validator has fallen behind.
          One query, one alert, one dashboard panel.
        </li>
        <li>
          <strong>A reason column on rejected records.</strong> When a
          batch fails validation, the row gets{" "}
          <code>state = &lsquo;rejected&rsquo;</code> and a structured
          rejection reason. Engineers can <code>SELECT</code> by reason
          and find the long tail of edge cases.
        </li>
        <li>
          <strong>An end-to-end latency metric.</strong> Time from{" "}
          <code>received_at</code> to materialized-view freshness, sampled
          every minute. When the marketing team asks "is the dashboard
          up to date?" the answer is a single number.
        </li>
      </ol>

      <h2>What I&rsquo;d change next</h2>

      <ul>
        <li>
          Move from per-record validation to micro-batched validation.
          Validating one record at a time leaves a lot of throughput on
          the table when each validation involves a database lookup.
        </li>
        <li>
          Introduce a streaming aggregator for the hottest views, so
          freshness drops from minutes to seconds. The current materialized
          view refresh works but is the slowest link.
        </li>
        <li>
          Replace the partial index on <code>state</code> with a logical
          replication slot to a downstream consumer. Polling the partial
          index is fine; subscribing to changes is better.
        </li>
      </ul>

      <p>
        The lesson I keep returning to: each layer of the pipeline should
        be optimizable independently. As soon as ingest and validation
        share a transaction, every optimization to one constrains the
        other. The append-only buffer is what gives you room to move.
      </p>
    </article>
  );
}
