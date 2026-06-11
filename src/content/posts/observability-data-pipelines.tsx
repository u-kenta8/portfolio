import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "observability-data-pipelines",
  title: "Observability for data pipelines: what I monitor at 3am",
  description:
    "A data pipeline that is silent is not the same as a data pipeline that is healthy. Three categories of metric that turned our on-call from reactive to predictive.",
  date: "2026-01-15",
  tags: ["Observability", "Data Engineering", "On-call"],
  readingMinutes: 6,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        A data pipeline that is silent is not the same as a data pipeline
        that is healthy. The most painful incidents I&rsquo;ve been
        on-call for were the ones where the pipeline was happily running
        — and the data on the other end was already wrong.
      </p>

      <p>
        After enough 3am pages, three categories of metric earn their
        place on the dashboard. Skip any one and the system becomes the
        kind that breaks silently.
      </p>

      <h2>Category 1: pipeline liveness</h2>

      <p>
        The cheapest, dumbest, most necessary metric: did the pipeline
        process anything in the last N minutes? You&rsquo;d think this
        was free — but plenty of teams discover at 9am Monday that no
        records arrived since Friday afternoon, and they discover it
        because a stakeholder noticed, not because their dashboard did.
      </p>

      <p>
        At minimum, alert when:
      </p>

      <ul>
        <li>
          Input rate drops to zero for longer than a normal lull.
        </li>
        <li>
          Output rate drops to zero while input is still arriving.
        </li>
        <li>
          The lag between input timestamp and processing timestamp grows
          past your SLA.
        </li>
      </ul>

      <p>
        These are the &ldquo;is anything happening&rdquo; alerts. They
        fire when the pipeline is silent. They do not catch a pipeline
        that is loudly producing wrong answers.
      </p>

      <h2>Category 2: shape invariants</h2>

      <p>
        Some properties of your output should never change, regardless of
        what happens upstream. If the number of distinct customer IDs in
        the materialized view drops by half overnight, something is
        broken — even if no error was thrown anywhere.
      </p>

      <pre>
        <code>{`-- Hourly check, alert if any are violated
SELECT
  COUNT(DISTINCT customer_id)                            AS distinct_customers,
  COUNT(*) FILTER (WHERE status = 'active')              AS active_count,
  AVG(EXTRACT(EPOCH FROM (now() - last_event_at)))       AS avg_event_age,
  MAX(EXTRACT(EPOCH FROM (now() - last_event_at)))       AS max_event_age
FROM customer_summary;`}</code>
      </pre>

      <p>
        For each of these, define what &ldquo;normal&rdquo; looks like
        and alert on deviation:
      </p>

      <ul>
        <li>
          Distinct count drops more than X% from yesterday: alert.
        </li>
        <li>
          Mean of a continuous metric moves more than Y standard
          deviations: alert.
        </li>
        <li>
          A field that&rsquo;s supposed to be present in 100% of records
          drops below 99.9%: alert.
        </li>
      </ul>

      <p>
        These are the &ldquo;the answer is wrong&rdquo; alerts. They fire
        when the pipeline is running, no exceptions are thrown, and the
        output is still subtly broken.
      </p>

      <h2>Category 3: per-stage failure attribution</h2>

      <p>
        A monolithic &ldquo;pipeline error rate&rdquo; tells you nothing
        actionable at 3am. A per-stage error rate tells you which step
        broke, which is most of the diagnosis.
      </p>

      <p>
        I instrument every stage of the pipeline with three numbers,
        always:
      </p>

      <pre>
        <code>{`stage_in_total{stage="validator"}          // how many records entered
stage_out_total{stage="validator"}         // how many came out cleanly
stage_failed_total{stage="validator",
                   reason="schema_mismatch"} // how many failed, by reason`}</code>
      </pre>

      <p>
        On the dashboard, this becomes one row per stage with three
        numbers. When something breaks, the eye lands on the row where{" "}
        <code>in</code> and <code>out</code> diverge. Within a minute of
        the alert, you know which stage and why.
      </p>

      <h2>The metric I wish I&rsquo;d added earlier</h2>

      <p>
        Time from the source event happening (a customer answering a
        survey question) to the moment it&rsquo;s visible in the
        downstream view that someone is looking at. End-to-end latency,
        in seconds, sampled.
      </p>

      <p>
        Every per-stage metric tells you about a stage. The end-to-end
        metric tells you whether <em>the system</em> is doing its job.
        The first time you set it up, you discover that a step you
        thought ran in seconds actually runs in minutes; the first time
        you graph it, you discover a daily spike that nobody had noticed.
        It&rsquo;s the single most informative number on the dashboard.
      </p>

      <h2>What not to alert on</h2>

      <p>
        Three classes of metric that look useful and aren&rsquo;t worth
        paging on:
      </p>

      <ul>
        <li>
          <strong>CPU and memory usage.</strong> Pipelines are bursty by
          nature. CPU at 90% is fine when there&rsquo;s work to do; CPU
          at 5% is fine when there isn&rsquo;t. Save these for capacity
          planning, not on-call.
        </li>
        <li>
          <strong>Absolute counts.</strong> &ldquo;Alert when records
          fall below 10,000/hour&rdquo; breaks on a quiet Sunday. Alert
          on shape (deviation from a baseline) instead.
        </li>
        <li>
          <strong>Anything you can&rsquo;t act on at 3am.</strong> If the
          on-call engineer can&rsquo;t do anything useful with the alert,
          it shouldn&rsquo;t wake them up. Move it to a daily report.
        </li>
      </ul>

      <h2>The shape of a good runbook</h2>

      <p>
        Every alert links to a one-page runbook with four sections, in
        order:
      </p>

      <ol>
        <li>
          <strong>What does this mean?</strong> Plain English description
          of what the alert is detecting.
        </li>
        <li>
          <strong>Diagnose.</strong> Two or three commands or queries
          that narrow down the cause.
        </li>
        <li>
          <strong>Mitigate.</strong> Steps to reduce impact while you
          investigate (e.g. &ldquo;pause downstream consumers,&rdquo;{" "}
          &ldquo;rate-limit ingest&rdquo;).
        </li>
        <li>
          <strong>Fix.</strong> Steps to restore normal operation.
        </li>
      </ol>

      <p>
        The runbook&rsquo;s job is to take an on-call engineer who
        didn&rsquo;t build this pipeline and give them ninety percent
        of what the original author would have done. Without it, every
        alert is an interrupt for the team lead.
      </p>

      <h2>The pattern that ties it together</h2>

      <p>
        Every metric and alert should answer one of three questions:
      </p>

      <ul>
        <li>Is the pipeline alive? (liveness)</li>
        <li>Is the output right? (shape invariants)</li>
        <li>Where exactly did it break? (per-stage attribution)</li>
      </ul>

      <p>
        Drop any one and you have a system that surprises you. Cover all
        three and the surprises move from the on-call queue into the
        daily standup, where they belong.
      </p>
    </article>
  );
}
