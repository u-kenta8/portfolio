import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "dashboards-server-vs-client",
  title: "Building dashboards: what goes on the server, what stays on the client",
  description:
    "Next.js gives you a useful set of knobs for splitting work between server and client. Here's the rule of thumb I use when building data dashboards, and the three categories that the rule keeps producing.",
  date: "2026-01-01",
  tags: ["Next.js", "React", "Frontend Architecture"],
  readingMinutes: 5,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        Dashboards have an awkward shape for modern React. Half of what
        they do is server-shaped: fetch a big chunk of data, transform
        it, render it once. The other half is client-shaped: filter the
        view, sort a column, drill into a row without a page reload.
      </p>

      <p>
        Next.js gives you a clean set of tools to split this — server
        components, client components, server actions, suspense. Here&rsquo;s
        the rule of thumb I keep ending up with.
      </p>

      <h2>The rule of thumb</h2>

      <p>
        Anything that
      </p>

      <ul>
        <li>doesn&rsquo;t change in response to a user click,</li>
        <li>requires database access or a credential,</li>
        <li>or is expensive to send over the wire raw,</li>
      </ul>

      <p>belongs on the server. Everything else stays on the client.</p>

      <p>
        Applied to a dashboard, this produces three categories of code
        very consistently.
      </p>

      <h2>Category 1: the shell and the data</h2>

      <p>
        The page itself, the layout, the initial data fetch — all server
        component. The user never clicks anything to get here, the data
        is the result of an authenticated query, and we don&rsquo;t want
        the raw query payload landing in the browser.
      </p>

      <pre>
        <code>{`// app/dashboard/page.tsx — server component
export default async function Dashboard() {
  const session = await requireSession();
  const summary = await db.summary.forTenant(session.tenantId);
  const series = await db.timeSeries.forTenant(session.tenantId, {
    from: startOfMonth(),
    to: now(),
  });

  return (
    <main>
      <SummaryCards data={summary} />
      <ChartPanel initialSeries={series} />
    </main>
  );
}`}</code>
      </pre>

      <p>
        The dashboard renders on the server, the user sees the data on
        first paint, and the database credentials never reach the
        browser.
      </p>

      <h2>Category 2: the interactive view</h2>

      <p>
        The chart panel itself — filtering by date range, switching
        between aggregations, hovering for tooltips — is a client
        component. It takes the initial series as a prop, manages its
        own state, and re-renders on user interaction without any
        network round-trip.
      </p>

      <pre>
        <code>{`// components/ChartPanel.tsx
"use client";

export function ChartPanel({ initialSeries }: { initialSeries: Series }) {
  const [range, setRange] = useState<Range>("last_7_days");
  const filtered = useMemo(() => filterByRange(initialSeries, range), [initialSeries, range]);
  return (
    <>
      <RangeSelector value={range} onChange={setRange} />
      <Chart data={filtered} />
    </>
  );
}`}</code>
      </pre>

      <p>
        Note what isn&rsquo;t in here: no <code>fetch</code>, no auth, no
        SQL. The component does what client components are good at:
        responding to clicks, managing transient state, animating
        transitions.
      </p>

      <h2>Category 3: the &ldquo;needs server data but triggered by a click&rdquo;</h2>

      <p>
        The trickiest category. The user clicks a row and wants a
        drill-down view that needs fresh data. We can&rsquo;t pre-fetch
        everything, but we don&rsquo;t want to expose a public API just
        for the dashboard.
      </p>

      <p>This is where server actions earn their keep:</p>

      <pre>
        <code>{`// actions/drillDown.ts
"use server";

export async function getDrillDown(rowId: string) {
  const session = await requireSession();
  return db.details.forTenantAndRow(session.tenantId, rowId);
}

// components/Row.tsx
"use client";

export function Row({ id }: { id: string }) {
  const [details, setDetails] = useState<Details | null>(null);
  return (
    <tr onClick={async () => setDetails(await getDrillDown(id))}>
      ...
    </tr>
  );
}`}</code>
      </pre>

      <p>
        From the client&rsquo;s perspective, calling{" "}
        <code>getDrillDown</code> looks like calling a function. Under
        the hood, Next.js handles the request, the session check happens
        on the server, the database query runs there too, and only the
        result crosses the wire.
      </p>

      <h2>What I learned the hard way</h2>

      <p>
        <strong>Don&rsquo;t fetch in the client component if you can fetch
        on the server.</strong> A client component that hits an API route
        on mount is paying a triple cost: extra round-trip, loading
        state, and a credential surface in the browser. Most of those
        fetches are actually server work that got pushed to the client by
        accident.
      </p>

      <p>
        <strong>Server components don&rsquo;t mean you can&rsquo;t
        suspend.</strong> A dashboard that has one slow query is much
        better with a streamed{" "}
        <code>&lt;Suspense&gt;</code> boundary than with a full-page
        wait. The slow chart lazy-loads while the rest of the dashboard
        renders.
      </p>

      <p>
        <strong>Resist the urge to move things back to the client &ldquo;for
        interactivity.&rdquo;</strong> A button is not interactivity. A
        chart that animates on hover is not interactivity. Only treat
        something as needing a client component if it has React state
        that survives renders. Everything else can stay on the server.
      </p>

      <h2>The pattern in one sentence</h2>

      <p>
        Server components own the data and the auth boundary, client
        components own the user&rsquo;s state, and server actions
        bridge the two when interactivity needs fresh data. That
        decomposition matches how dashboards actually want to be
        written.
      </p>
    </article>
  );
}
