import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "multi-tenant-postgres",
  title: "Multi-tenant data in PostgreSQL: row-level security or schema-per-tenant?",
  description:
    "Two valid answers, very different operational characteristics. Here's how we chose, what we'd revisit, and the specific trade-offs that drove the decision.",
  date: "2026-04-01",
  tags: ["PostgreSQL", "Architecture", "SaaS"],
  readingMinutes: 6,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        Every B2B SaaS team eventually gets asked the same question:
        &ldquo;how do we keep one customer&rsquo;s data from leaking into
        another customer&rsquo;s view?&rdquo; PostgreSQL gives you two clean
        answers, and a wrong third one. This is how we picked.
      </p>

      <h2>The two clean answers</h2>

      <p>
        <strong>Schema-per-tenant</strong> — each customer gets a dedicated
        schema. Queries reference <code>customer_a.users</code> or{" "}
        <code>customer_b.users</code>. Isolation is enforced at the
        connection level: each tenant&rsquo;s connection uses{" "}
        <code>SET search_path</code> to point at their schema.
      </p>

      <p>
        <strong>Row-level security (RLS)</strong> — every table has a{" "}
        <code>tenant_id</code> column and a policy that filters rows by
        the current session&rsquo;s <code>tenant_id</code> setting.
        Isolation is enforced inside the database, transparently to the
        application.
      </p>

      <p>
        The wrong third answer: rely on <code>WHERE tenant_id = ?</code>{" "}
        in application code without RLS. Works until the day someone
        writes a query that forgets the clause, and then it doesn&rsquo;t.
      </p>

      <h2>Schema-per-tenant: the case for</h2>

      <pre>
        <code>{`CREATE SCHEMA customer_acme;
SET search_path TO customer_acme;
CREATE TABLE users (id BIGSERIAL PRIMARY KEY, ...);`}</code>
      </pre>

      <ul>
        <li>
          <strong>Hard isolation.</strong> Bug-free by construction: a
          query in one schema cannot accidentally read another.
        </li>
        <li>
          <strong>Per-tenant migrations possible.</strong> Power users on
          a paid tier can be on a different schema version. (You probably
          shouldn&rsquo;t, but you <em>can</em>.)
        </li>
        <li>
          <strong>Backup and restore per tenant.</strong>{" "}
          <code>pg_dump --schema=customer_acme</code> gives one
          customer&rsquo;s data without touching anyone else&rsquo;s.
        </li>
      </ul>

      <h2>Schema-per-tenant: the case against</h2>

      <ul>
        <li>
          <strong>Migrations scale with tenant count.</strong> A schema
          change has to run N times. At 50 tenants it&rsquo;s fine. At
          5,000 it&rsquo;s a problem.
        </li>
        <li>
          <strong>Cross-tenant analytics are painful.</strong> Answering
          &ldquo;total active users across all tenants&rdquo; means
          UNION-ing across N schemas.
        </li>
        <li>
          <strong>Connection management is harder.</strong> Each tenant
          conceptually has its own connection pool; PgBouncer and friends
          don&rsquo;t love this.
        </li>
      </ul>

      <h2>Row-level security: the case for</h2>

      <pre>
        <code>{`CREATE TABLE users (
  id          BIGSERIAL PRIMARY KEY,
  tenant_id   BIGINT NOT NULL,
  email       TEXT NOT NULL
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.tenant_id')::BIGINT);`}</code>
      </pre>

      <p>
        At the start of every request, the application sets a session
        variable:
      </p>

      <pre>
        <code>{`SET LOCAL app.tenant_id = 12345;`}</code>
      </pre>

      <p>From then on, every query is silently filtered.</p>

      <ul>
        <li>
          <strong>Single migration path.</strong> One ALTER TABLE runs
          once, applies everywhere.
        </li>
        <li>
          <strong>Cross-tenant analytics are trivial.</strong> Drop the
          session variable in an analytics role and you can query across
          all tenants directly.
        </li>
        <li>
          <strong>Connection pooling stays normal.</strong> PgBouncer
          doesn&rsquo;t care about schemas; it just pools.
        </li>
      </ul>

      <h2>RLS: the case against</h2>

      <ul>
        <li>
          <strong>Application bugs become security bugs.</strong> Forget
          to call <code>SET LOCAL app.tenant_id</code> and your queries
          either fail or — worse — return zero rows silently. The fix is
          to make the policy fail closed (require the setting), but every
          team will discover this for themselves.
        </li>
        <li>
          <strong>Query plans get more complex.</strong> RLS adds a
          predicate to every query. Postgres handles it well, but you
          need an index on <code>tenant_id</code> on every table to make
          it fast.
        </li>
        <li>
          <strong>Backup and restore per tenant is harder.</strong>{" "}
          <code>pg_dump --where=&quot;tenant_id=12345&quot;</code> works,
          but it&rsquo;s less ergonomic than the schema version.
        </li>
      </ul>

      <h2>What we chose</h2>

      <p>
        We picked RLS, for three concrete reasons specific to our
        situation: the customer count was high and growing fast, the
        analytics side wanted cross-tenant queries to be cheap, and the
        team was small enough that maintaining N schemas would have
        eaten engineering time.
      </p>

      <p>
        The thing I underestimated was the operational discipline RLS
        demands. Every code path that opens a database connection needs
        to set the tenant ID first. We codified that in a connection
        wrapper:
      </p>

      <pre>
        <code>{`func (p *Pool) ForTenant(ctx context.Context, tid int64) (*sql.Conn, error) {
    conn, err := p.db.Conn(ctx)
    if err != nil {
        return nil, err
    }
    if _, err := conn.ExecContext(ctx, "SET LOCAL app.tenant_id = $1", tid); err != nil {
        conn.Close()
        return nil, fmt.Errorf("set tenant: %w", err)
    }
    return conn, nil
}`}</code>
      </pre>

      <p>
        Once that wrapper was the only way to get a connection, "did the
        developer remember to set the tenant" stopped being a question.
      </p>

      <h2>When I&rsquo;d pick schema-per-tenant instead</h2>

      <ul>
        <li>
          Hard regulatory isolation (HIPAA, certain GDPR profiles) where
          provable data separation matters at audit time.
        </li>
        <li>
          A small fixed number of large tenants — say, 20 enterprise
          customers each with millions of rows.
        </li>
        <li>
          A team comfortable enough with database migrations to script
          the N-schema apply.
        </li>
      </ul>

      <p>
        Both are valid answers. The wrong move is to skip the choice and
        rely on application-level filtering alone. That&rsquo;s the only
        path that leads to a Sunday-night incident.
      </p>
    </article>
  );
}
