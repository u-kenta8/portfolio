import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "freshness-architecture",
  title: "Server components, ISR, and client polling: choosing freshness per layer",
  description:
    "Building a job board that feels live without hammering upstream APIs — a layered freshness model with Next.js 16 server components, ISR, and a small client poller.",
  date: "2026-06-12",
  tags: ["Next.js", "React", "Architecture", "Caching"],
  readingMinutes: 7,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        I recently shipped{" "}
        <a href="https://remote-compass-beta.vercel.app/">Remote Compass</a>, a
        job-board aggregator that pulls listings from seven public APIs and
        ranks them for a candidate in Japan. One requirement kept the
        architecture interesting: the page had to <em>feel</em> live — visibly
        fresh data, an &ldquo;updated 14s ago&rdquo; indicator, a working
        refresh button — without my Vercel free tier melting under load or me
        getting rate-limited by the upstream APIs that don&rsquo;t actually
        change minute-to-minute.
      </p>

      <p>
        The answer was three caching layers, each with its own freshness
        contract, plus a single user-controlled bypass. Here&rsquo;s how that
        breaks down, and why each layer earns its place.
      </p>

      <h2>The three layers</h2>

      <p>The freshness model looks like this:</p>

      <pre>
        <code>{`Upstream APIs (RemoteOK, WWR, Hacker News, ...)
  │
  │  Layer 1 — Source adapter fetch cache
  │  revalidate: 1h via next: { revalidate: 3600 }
  ▼
Aggregator (Promise.allSettled, dedupe, filter, score)
  │
  │  Layer 2 — Route handler / ISR
  │  /api/jobs revalidate: 1h + s-maxage: 3600
  ▼
Browser
  │
  │  Layer 3 — Client polling
  │  setInterval(refresh, 60 * 60 * 1000)
  │
  │  + Manual bypass: cache: "no-store"
  ▼
UI re-renders only if data changed`}</code>
      </pre>

      <p>
        Three layers, three different freshness windows, three different
        actors deciding when to refresh. The temptation is to pick one number
        — &ldquo;refresh every hour&rdquo; — and apply it everywhere. That
        looks tidy on a slide but fails the moment a real user clicks the
        Refresh button, because each layer is doing different work for
        different reasons.
      </p>

      <h2>Layer 1: Source adapter caches</h2>

      <p>
        Each source adapter (one per upstream API — RemoteOK, Remotive,
        WeWorkRemotely, etc.) is a single async function that returns a
        normalized <code>Job[]</code>. The fetch inside each adapter sets a
        Next.js cache window:
      </p>

      <pre>
        <code>{`// web/src/lib/sources/remoteok.ts
export async function fetchRemoteOkJobs(): Promise<Job[]> {
  const res = await fetch("https://remoteok.com/api", {
    headers: {
      "User-Agent": "remote-compass/0.1",
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });
  // ...normalize and return
}`}</code>
      </pre>

      <p>
        The <code>next: &#123; revalidate: 3600 &#125;</code> tells Next.js to
        treat this URL as cacheable at the data layer for one hour. The same
        URL hit twice within that window comes from cache the second time —
        even from a different page, even from the API route, even from a
        background revalidation. This is what keeps me well clear of rate
        limits even when traffic spikes.
      </p>

      <p>Two design notes here:</p>

      <ul>
        <li>
          <strong>Cache lives at the URL.</strong> If two layers above
          happen to call <code>fetchRemoteOkJobs()</code> within the hour,
          neither makes a real network request after the first one.
        </li>
        <li>
          <strong>One source failure doesn&rsquo;t cascade.</strong> The
          aggregator wraps the seven sources in{" "}
          <code>Promise.allSettled</code>, so if Arbeitnow is down, the
          other six still serve. The failing source just shows up as a row
          in the errors banner.
        </li>
      </ul>

      <h2>Layer 2: ISR on the page and the API route</h2>

      <p>
        The page is a server component. The first paint contains the actual
        job list, server-rendered, with no client-side loading state:
      </p>

      <pre>
        <code>{`// web/src/app/page.tsx
export const revalidate = 3600;

export default async function Home() {
  const { jobs, errors } = await loadScoredJobs(DEFAULT_CANDIDATE);
  const fetchedAt = new Date().toISOString();
  return (
    <main>
      {/* hero copy */}
      <JobList
        initialJobs={jobs}
        initialErrors={errors}
        initialFetchedAt={fetchedAt}
      />
    </main>
  );
}`}</code>
      </pre>

      <p>
        And there&rsquo;s a parallel API route at <code>/api/jobs</code> that
        returns the same shape as JSON, with both Next.js ISR{" "}
        <em>and</em> an explicit <code>Cache-Control</code> header so any
        CDN in front (Vercel&rsquo;s edge, plus a hypothetical Cloudflare
        proxy) also caches:
      </p>

      <pre>
        <code>{`// web/src/app/api/jobs/route.ts
export const revalidate = 3600;

export async function GET() {
  const { jobs, errors } = await loadScoredJobs(DEFAULT_CANDIDATE);
  return NextResponse.json(
    { jobs, errors, fetchedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    },
  );
}`}</code>
      </pre>

      <p>
        The <code>stale-while-revalidate</code> directive is the unsung hero:
        after an hour, the cached response is still served immediately, and a
        background revalidation kicks off. The user sees old-but-not-very-old
        data instantly; the next user, a few seconds later, sees fresh data.
        No visible spinner, no waterfall.
      </p>

      <h2>Layer 3: Client polling</h2>

      <p>
        With Layers 1 and 2 in place, why bother polling at all? Two reasons:
      </p>

      <ol>
        <li>
          <strong>Long sessions.</strong> Someone leaves the tab open for
          two hours while job hunting. Without client polling, they keep
          looking at the snapshot from when they first opened the page.
          The &ldquo;updated 2h ago&rdquo; counter would also lie.
        </li>
        <li>
          <strong>Visible activity.</strong> A live timestamp and a refresh
          button make the page feel alive. That&rsquo;s a UX choice, not a
          technical one — but for a job board, &ldquo;is this stale?&rdquo;
          is the only question that matters.
        </li>
      </ol>

      <p>
        The client component takes the initial server-rendered data, then
        sets up a polling interval and a per-second ticker for the
        &ldquo;ago&rdquo; label:
      </p>

      <pre>
        <code>{`// web/src/components/JobList.tsx
"use client";

const POLL_INTERVAL_MS = 3_600_000; // 1 hour

export function JobList({ initialJobs, initialErrors, initialFetchedAt }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [fetchedAt, setFetchedAt] = useState(initialFetchedAt);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/jobs", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setJobs(data.jobs);
    setFetchedAt(data.fetchedAt);
  }, []);

  // background poll
  useEffect(() => {
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <>
      <span>Updated {formatAge(fetchedAt)}</span>
      <button onClick={refresh}>Refresh</button>
      <ul>{jobs.map(j => <JobCard key={j.id} job={j} />)}</ul>
    </>
  );
}`}</code>
      </pre>

      <p>
        Two details worth highlighting:
      </p>

      <ul>
        <li>
          <strong>
            <code>cache: &quot;no-store&quot;</code> bypasses every layer.
          </strong>{" "}
          When the user clicks Refresh, they expect the freshest possible
          data — even if Layer 2&rsquo;s ISR cache is still warm. Setting{" "}
          <code>cache: &quot;no-store&quot;</code> on the fetch tells the
          browser, the CDN, and Next.js to skip the cache and re-execute the
          handler. The handler then calls the aggregator, which still
          benefits from Layer 1 source caches — so we get fresh aggregation,
          not fresh upstream calls.
        </li>
        <li>
          <strong>The initial data is server-rendered.</strong> No flicker,
          no loading spinner on first paint. The client takes over silently.
        </li>
      </ul>

      <h2>What I learned</h2>

      <p>
        The pattern I keep coming back to: pick a freshness number per layer,
        not per system. Most architectures fail at the boundaries between
        cache layers — a CDN that&rsquo;s fresher than the origin, a client
        that thinks it has fresher data than the server, a manual refresh
        that doesn&rsquo;t actually refresh because some intermediate cache
        won. The fix is always the same: make each layer&rsquo;s freshness
        explicit and make sure the user-facing &ldquo;refresh&rdquo; action
        bypasses every one of them.
      </p>

      <p>
        Things I&rsquo;d change next if I had a second day:
      </p>

      <ul>
        <li>
          Replace the polling with Server-Sent Events for true push updates.
          The current poll is wasted bandwidth when no new jobs have
          arrived.
        </li>
        <li>
          Diff old and new job lists and animate just the new ones in,
          instead of replacing the whole grid. Better visible UX.
        </li>
        <li>
          Add a <code>?since=&lt;timestamp&gt;</code> query parameter so the
          refresh fetches only the delta, not the full 100 jobs.
        </li>
      </ul>

      <p>
        Live demo:{" "}
        <a href="https://remote-compass-beta.vercel.app/">
          remote-compass-beta.vercel.app
        </a>{" "}
        · Source:{" "}
        <a href="https://github.com/u-kenta8/remote-compass">
          github.com/u-kenta8/remote-compass
        </a>
      </p>
    </article>
  );
}
