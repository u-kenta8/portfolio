import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "idempotency-marketplace-orders",
  title: "Idempotency keys: how we stopped duplicating orders on flaky marketplace APIs",
  description:
    "Years of integrating with Rakuten, Yahoo Shopping, and Amazon taught us that the most expensive bug in e-commerce is the silent retry. Here's the idempotency pattern that finally fixed it.",
  date: "2026-05-28",
  tags: ["Distributed Systems", "E-commerce", "PHP", "API Integration"],
  readingMinutes: 6,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        At Smaregi, the most expensive bug we ever shipped was invisible. A
        single order created twice when a marketplace API responded slowly,
        our retry kicked in, and the customer ended up charged twice. The
        operations team caught it days later. The dev team that wrote it had
        no idea anything was wrong.
      </p>

      <p>
        Integrating with Rakuten, Yahoo Shopping, and Amazon over seven years
        taught us this lesson the hard way. Public marketplace APIs are
        flaky. They time out. They return 200 OK with an empty body. They
        succeed on the server but the response never makes it back. Our
        first generation of integration code treated those failures as
        retry-and-hope. Our second generation treated them as the default
        case.
      </p>

      <h2>The shape of the problem</h2>

      <p>
        A typical order-creation flow looks like:
      </p>

      <pre>
        <code>{`POST /v1/orders            ──► marketplace
       (timeout)
                            (order created on their side)
       (retry)
POST /v1/orders            ──► marketplace
                            (order created AGAIN on their side)
       200 OK`}</code>
      </pre>

      <p>
        At low volume this happens once a month and gets buried in support
        tickets. At Smaregi's scale, it was happening dozens of times a day,
        every day, across three marketplaces.
      </p>

      <h2>The pattern that finally worked</h2>

      <p>
        Every outbound mutation got an <code>Idempotency-Key</code> header,
        a UUID derived from the originating order in our system — not a
        random per-request value. The same logical operation always sent the
        same key, even across retries, even across process restarts, even
        across days.
      </p>

      <pre>
        <code>{`function postOrder(Order $order, MarketplaceClient $client): Result
{
    $key = $order->idempotencyKey(); // stable per-order
    $payload = $this->payloadFor($order);

    return $client->post('/v1/orders', $payload, [
        'Idempotency-Key' => $key,
        'X-Retry-Of' => $order->lastSentAt(),
    ]);
}`}</code>
      </pre>

      <p>
        On the marketplace side, the key acts as a de-dupe primary key:
        first request creates the order, subsequent requests with the same
        key return the existing order's response. Our retry loop becomes
        safe to run as many times as the network demands.
      </p>

      <h2>Two details that matter</h2>

      <p>
        <strong>The key must be derived, not generated.</strong> If we
        generated a UUID at the call site, a process restart between the
        first attempt and the retry would produce a new key — and a
        duplicate order. The key has to be reproducible from the originating
        record: <code>uuidv5(namespace, orderId + targetMarketplace)</code>{" "}
        works well.
      </p>

      <p>
        <strong>Not every marketplace honors the header consistently.</strong>{" "}
        Amazon&rsquo;s MWS had reliable idempotency. One of the others (I
        won&rsquo;t name names) silently ignored unknown headers and would
        cheerfully create duplicates anyway. For those, we layered an
        application-level idempotency table:
      </p>

      <pre>
        <code>{`CREATE TABLE outbound_calls (
  idempotency_key VARCHAR(64) PRIMARY KEY,
  target VARCHAR(32) NOT NULL,
  status VARCHAR(16) NOT NULL,
  response_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ
);`}</code>
      </pre>

      <p>
        Before each outbound call, we insert a row with{" "}
        <code>status = &lsquo;in_flight&rsquo;</code>. If the insert fails on
        the primary key, another worker is already handling it — we don&rsquo;t
        retry. If the call succeeds, we update the row with the response ID
        and <code>status = &lsquo;done&rsquo;</code>. Retries within a TTL
        window check this table first.
      </p>

      <h2>What I&rsquo;d tell my past self</h2>

      <ul>
        <li>
          Treat every outbound mutation as potentially happening twice.
          That assumption costs nothing to design around and saves entire
          weekends of incident response.
        </li>
        <li>
          Idempotency keys are easy to add later, but a pain to add to
          long-running production flows that already assume at-most-once
          semantics. Add them on day one.
        </li>
        <li>
          Don&rsquo;t trust upstream APIs to dedupe — even when their docs
          promise it. Layer your own table.
        </li>
      </ul>

      <p>
        Seven years of marketplace integration code, and this is still the
        single most valuable pattern I carry into every new integration.
      </p>
    </article>
  );
}
