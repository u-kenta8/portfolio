import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "rest-api-enterprise-patterns",
  title: "REST API design for enterprise integrations: 6 patterns I keep reaching for",
  description:
    "Enterprise customers don't read your changelog. Their integrations have to keep working anyway. Here are the API design patterns that earn their keep when partners depend on your endpoints.",
  date: "2026-03-15",
  tags: ["API Design", "Go", "REST"],
  readingMinutes: 6,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        When the consumer of your API is an enterprise team, your API is no
        longer just a contract — it&rsquo;s a dependency they&rsquo;ve
        already wired into a workflow that runs their business. They
        won&rsquo;t read your changelog. They won&rsquo;t notice your
        warning email. Their code will keep calling your endpoint at 3am
        on a holiday, and it had better still work.
      </p>

      <p>
        Six patterns I find myself reaching for, every time, when
        designing an API that an enterprise partner is going to depend on.
      </p>

      <h2>1. Version in the URL, not the header</h2>

      <p>
        Header versioning is elegant. URL versioning is debuggable. When
        a partner&rsquo;s integration breaks at midnight, the first thing
        they paste into a support ticket is the URL. If the version is
        in the URL, the diagnosis is instant. If it&rsquo;s in a header,
        you spend twenty minutes asking them to capture their headers.
      </p>

      <pre>
        <code>{`GET /v1/companies/12345
GET /v2/companies/12345`}</code>
      </pre>

      <h2>2. Explicit pagination, always</h2>

      <p>
        Never return an unbounded list. Even if today&rsquo;s response
        contains 12 items, design for tomorrow when it has 12,000. Use
        cursor-based pagination over offset-based for any endpoint that
        sorts by a timestamp:
      </p>

      <pre>
        <code>{`GET /v1/companies?limit=100&after=cursor_xyz

200 OK
{
  "data": [ { ... }, { ... } ],
  "next_cursor": "cursor_abc",
  "has_more": true
}`}</code>
      </pre>

      <p>
        Cursors don&rsquo;t suffer from the classic offset bug: pages
        that shift when items are added mid-scroll. They&rsquo;re harder
        to implement but cheaper to support.
      </p>

      <h2>3. Idempotency keys on every mutation</h2>

      <p>
        I&rsquo;ve written enough about idempotency to know the bug it
        prevents. Let your enterprise partners send an{" "}
        <code>Idempotency-Key</code> header on every <code>POST</code>{" "}
        and <code>PUT</code>:
      </p>

      <pre>
        <code>{`POST /v1/companies
Idempotency-Key: 8c5a-3b7d-1f2e

201 Created
{ "id": 12345, ... }`}</code>
      </pre>

      <p>
        A second call with the same key returns the same response. The
        partner&rsquo;s retry logic gets to be naïve. Yours does the
        clever work, exactly once.
      </p>

      <h2>4. Errors with a code, not just a message</h2>

      <p>
        Human-readable error messages drift. The text you ship today
        gets translated, reformatted, or "improved" by next quarter, and
        a partner&rsquo;s integration matching on the string breaks.
        Give them a stable machine-readable code:
      </p>

      <pre>
        <code>{`422 Unprocessable Entity
{
  "error": {
    "code": "company.duplicate_domain",
    "message": "A company with this domain already exists.",
    "field": "domain",
    "details": { "existing_company_id": 8901 }
  }
}`}</code>
      </pre>

      <p>
        The <code>code</code> is your stable contract. Partners pattern-match
        on it; the <code>message</code> is for humans reading logs.
      </p>

      <h2>5. Rate limit headers on every response</h2>

      <p>
        Don&rsquo;t make partners discover your rate limit by hitting it.
        Surface it on every response:
      </p>

      <pre>
        <code>{`200 OK
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 587
X-RateLimit-Reset: 1718412345`}</code>
      </pre>

      <p>
        A polite integration backs off when{" "}
        <code>Remaining</code> drops below some threshold. An impolite
        one keeps slamming until it hits 429. Either way, you&rsquo;ve
        documented your contract on every response — no docs needed.
      </p>

      <h2>6. Deprecation headers as an out-of-band notice</h2>

      <p>
        When you&rsquo;re ready to retire an endpoint, you can&rsquo;t
        just email partners. Half won&rsquo;t see it. Add a header on
        every response from the deprecated path:
      </p>

      <pre>
        <code>{`200 OK
Deprecation: true
Sunset: Fri, 30 Sep 2026 23:59:59 GMT
Link: <https://docs.example.com/migrating-to-v2>; rel="successor-version"`}</code>
      </pre>

      <p>
        The partner&rsquo;s logs now have a permanent record. Their next
        engineer to look at the integration sees it instantly. You&rsquo;ve
        given yourself a defensible answer when, six months later, the
        endpoint is gone and somebody asks &ldquo;why didn&rsquo;t anyone
        tell us?&rdquo;
      </p>

      <h2>What ties them together</h2>

      <p>
        Every pattern above is built around the same assumption: the
        partner is not paying attention. They&rsquo;re busy. They built
        the integration months or years ago and they&rsquo;ll only look
        at it when it breaks. Every design decision should either prevent
        the break or make the diagnosis trivial.
      </p>

      <p>
        Six patterns won&rsquo;t make your API perfect. They will make
        the difference between a partner who logs a support ticket and a
        partner who silently moves to your competitor.
      </p>
    </article>
  );
}
