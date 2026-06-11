import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "webhook-reliability",
  title: "Webhook reliability: the retry patterns that finally worked",
  description:
    "Webhooks look simple — POST a payload, get a 200 back. Production teaches you that every assumption in that sentence is wrong. The retry strategy I keep coming back to.",
  date: "2025-12-15",
  tags: ["Distributed Systems", "Webhooks", "API Integration"],
  readingMinutes: 6,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        Webhooks are seductive. POST a payload to a partner&rsquo;s URL,
        get a 200 back, move on. The first integration takes an
        afternoon. The first production incident teaches you that every
        assumption in that sentence is wrong.
      </p>

      <p>
        Years of running webhooks in production has refined my pattern to
        five rules. They&rsquo;re not innovative; they&rsquo;re the rules
        I wish someone had taped to my monitor on day one.
      </p>

      <h2>Rule 1: design for the partner being down</h2>

      <p>
        The most common cause of a failed webhook isn&rsquo;t our code or
        the network — it&rsquo;s the partner&rsquo;s endpoint being
        unavailable. They deploy, they have an incident, they rate-limit
        us by accident, their TLS cert expires. We have to assume their
        URL will be unreachable for hours at a time and design the system
        to absorb it.
      </p>

      <p>
        The architecture this produces:
      </p>

      <pre>
        <code>{`event happens ──► outbox table ──► worker ──► partner URL
                                       │
                                       │ retry on failure
                                       └─► backoff queue`}</code>
      </pre>

      <p>
        We never call the partner&rsquo;s URL inline with the event that
        triggered it. The event writes a row to an{" "}
        <code>outbox</code> table; a worker picks it up; the worker
        handles delivery and retries. If the partner is down for an hour,
        we have an hour of pending rows. If they come back up, we drain.
      </p>

      <h2>Rule 2: exponential backoff with jitter</h2>

      <p>
        The naive retry strategy — retry every minute, then every two
        minutes, then every five — fails the moment a partner is down
        with N of our other customers also pointing at them. They come
        back up; everyone retries at the same moment; they fall over
        again.
      </p>

      <p>The pattern that works:</p>

      <pre>
        <code>{`func nextRetryAt(attempt int) time.Time {
    base := time.Duration(math.Pow(2, float64(attempt))) * time.Second
    if base > 8*time.Hour {
        base = 8 * time.Hour
    }
    // Add up to 25% jitter
    jitter := time.Duration(rand.Int63n(int64(base) / 4))
    return time.Now().Add(base + jitter)
}`}</code>
      </pre>

      <p>
        The exponential part keeps the retry rate manageable when an
        outage is long. The jitter prevents a thundering herd when the
        partner comes back. Cap at 8 hours so the integration eventually
        gives up loudly rather than retrying forever silently.
      </p>

      <h2>Rule 3: signed payloads, always</h2>

      <p>
        Two reasons. First, partners (correctly) want to know our
        webhooks came from us, not someone replaying a captured request.
        Second, you want to be able to support the partner without
        opening a security hole — &ldquo;is this request legitimate&rdquo;
        is a question you can answer with a signature, not with an IP
        whitelist that breaks the moment Vercel rotates a region.
      </p>

      <p>The minimum: HMAC-SHA256 of the body, with a shared secret:</p>

      <pre>
        <code>{`headers := http.Header{
    "Content-Type":      []string{"application/json"},
    "X-Webhook-Timestamp": []string{fmt.Sprint(time.Now().Unix())},
    "X-Webhook-Id":        []string{event.ID},
    "X-Webhook-Signature": []string{signWebhook(secret, body, timestamp)},
}`}</code>
      </pre>

      <p>
        The signature covers the body <em>and</em> the timestamp so
        replays past a short window are rejected. Document this in your
        partner-facing docs so they can verify on their end with three
        lines of code.
      </p>

      <h2>Rule 4: give partners a way to replay</h2>

      <p>
        Even with retries, sometimes a partner&rsquo;s endpoint
        successfully ate a webhook and then their database lost the row
        before they finished processing it. They&rsquo;ll ask for the
        last 24 hours of events. A first-class &ldquo;replay events
        from <em>T</em> to <em>T+24h</em>&rdquo; API saves the support
        ticket.
      </p>

      <p>
        I usually implement this as a one-line: the same outbox-and-worker
        pipeline that handles new events, but seeded from a backfill
        query. The replay queue runs at lower priority than fresh events
        and surfaces in the partner&rsquo;s dashboard.
      </p>

      <h2>Rule 5: a status page just for webhooks</h2>

      <p>
        Partners can&rsquo;t tell whether their integration is broken or
        ours is. Give them a page that shows, for their account:
      </p>

      <ul>
        <li>The last 100 events we tried to send.</li>
        <li>Whether each succeeded or failed.</li>
        <li>If failed, the HTTP status and a snippet of the response.</li>
        <li>The current retry queue length.</li>
        <li>A &ldquo;test webhook&rdquo; button.</li>
      </ul>

      <p>
        Every line on the support team&rsquo;s queue that says &ldquo;your
        webhooks aren&rsquo;t working&rdquo; can now be answered with
        &ldquo;please check the status page first.&rdquo; Half the
        tickets resolve themselves; the rest land on engineering with
        the diagnosis already done.
      </p>

      <h2>What I&rsquo;d add next</h2>

      <ul>
        <li>
          <strong>Per-partner circuit breakers.</strong> If a partner is
          returning 500s on every request for 10 minutes, stop sending
          and start queueing for a half-hour. Cheaper than a thousand
          retries and easier on their incident-response team.
        </li>
        <li>
          <strong>Delivery acknowledgement endpoints.</strong> Pull-based
          for partners that don&rsquo;t want push. Same outbox table,
          different consumer.
        </li>
        <li>
          <strong>Multi-region delivery workers.</strong> Send from the
          region closest to the partner. Small latency win for the happy
          path; bigger reliability win when one of our regions has an
          issue.
        </li>
      </ul>

      <h2>The single most important rule</h2>

      <p>
        Make the failure path visible. Hide a failed webhook in a log
        file and you have a silent bug. Surface it on a partner
        dashboard, an internal metric, and a runbook entry, and you have
        a self-healing integration. Every one of the rules above is
        ultimately about that one principle.
      </p>
    </article>
  );
}
