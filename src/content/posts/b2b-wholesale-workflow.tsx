import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "b2b-wholesale-workflow",
  title: "B2B wholesale: replacing 30 emails per order with a self-service workflow",
  description:
    "The old wholesale process took a back-office team an hour per order. After redesigning it as a self-service web flow with the right escape hatches, it dropped to minutes — and the team thanked us.",
  date: "2026-03-01",
  tags: ["Product Engineering", "B2B", "E-commerce"],
  readingMinutes: 5,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        The wholesale ordering process I inherited at Smaregi was a
        masterpiece of accumulated entropy. A typical order took 30+
        emails — buyer to back office, back office to inventory, inventory
        to fulfilment, fulfilment back to back office, back office to
        buyer — and an average of an hour of someone&rsquo;s time.
        It worked. It was nobody&rsquo;s fault. It also could not scale.
      </p>

      <p>
        Here&rsquo;s how we replaced it, what we kept the same on purpose,
        and what nearly broke the rollout.
      </p>

      <h2>The old flow, mapped</h2>

      <p>
        Before writing any code, I sat with the back-office team for
        three days and mapped the actual flow. The result was a sticky-note
        wall covered in arrows. Roughly:
      </p>

      <pre>
        <code>{`buyer ───email "I want X units of SKU-123"───► sales rep
sales rep ──email "is this in stock?"────────► inventory
inventory ──email "we have 47, ship by Thu"──► sales rep
sales rep ──email "$X total, terms net-30"───► buyer
buyer ───email "confirmed, send invoice"────► sales rep
sales rep ──Excel sheet attached────────────► fulfilment
fulfilment ──email "shipped, tracking #"────► sales rep
sales rep ──email "shipped, here's tracking"─► buyer
... and so on through invoicing and reconciliation`}</code>
      </pre>

      <p>
        The pattern: every state transition was a human writing the same
        information into the next email. The whole flow was an unwritten
        state machine implemented in Outlook.
      </p>

      <h2>The new flow, written down</h2>

      <p>
        We took the state machine that had been implicit and made it
        explicit:
      </p>

      <pre>
        <code>{`DRAFT ──submit──► QUOTED ──accept──► CONFIRMED
                    │                      │
                    │                      ├──hold──► AWAITING_STOCK
                    │                      │
                    └─reject──► CANCELLED   └─ship──► SHIPPED ──invoice──► PAID`}</code>
      </pre>

      <p>
        Each state had:
      </p>

      <ul>
        <li>A single canonical record in the database.</li>
        <li>An explicit set of allowed transitions.</li>
        <li>
          A list of who can do what (buyer can submit; sales rep can
          quote; inventory can hold; fulfilment can ship).
        </li>
        <li>An immutable audit log of every transition.</li>
      </ul>

      <p>
        The web UI rendered the right buttons for the right user based on
        the order&rsquo;s current state. The back office no longer typed
        the same information twice; they confirmed a transition with a
        click, and the system did the rest.
      </p>

      <h2>What we kept the same on purpose</h2>

      <p>
        Two things, against my initial instinct.
      </p>

      <p>
        <strong>The buyer&rsquo;s ability to free-text a special
        request.</strong> Wholesale relationships have personality. Buyer A
        always wants their pallets stacked a particular way; buyer B
        always wants the invoice cc&rsquo;d to their accountant. We left
        a notes field on every order. The sales rep still got to see
        their context. The system gave structure without taking away
        relationship.
      </p>

      <p>
        <strong>The escape hatch of email.</strong> Every state transition
        triggered a structured email to the buyer with the new state and
        a link back to the portal. Buyers who hated the portal could
        still reply to the email, and the back office would handle the
        transition on their behalf. The portal didn&rsquo;t require
        learning a new tool; it just made the tool faster for the people
        who used it.
      </p>

      <h2>What nearly broke the rollout</h2>

      <p>
        Two things, both organizational not technical.
      </p>

      <p>
        <strong>The back-office team felt threatened.</strong> Their daily
        work was being replaced by software. They&rsquo;d been the ones
        we sat with to design it. Halfway through development, the
        framing flipped from &ldquo;we&rsquo;re building this for you&rdquo;
        to &ldquo;we&rsquo;re building this <em>without</em> you.&rdquo;
        We fixed it by making them the rollout owners: they trained the
        early-adopter buyers, they wrote the FAQ, and their names were
        on the launch email. Within two months they were our biggest
        advocates.
      </p>

      <p>
        <strong>The buyers didn&rsquo;t want a portal.</strong> Some of
        them genuinely preferred email. We didn&rsquo;t fight it — we
        let them opt out. The portal was for the buyers placing weekly
        orders; the email flow was for the buyers placing one order a
        quarter. Both got faster service from the same back office.
      </p>

      <h2>What changed by the numbers</h2>

      <p>
        I don&rsquo;t have permission to publish the exact figures, but
        directionally:
      </p>

      <ul>
        <li>
          Time-per-order dropped from roughly an hour to under fifteen
          minutes for the back office.
        </li>
        <li>
          Errors traceable to "miscommunication in email" dropped
          substantially — the audit log made them visible and the
          structured form made them rarer.
        </li>
        <li>
          Buyer self-service ordering grew quarter over quarter, freeing
          the back office for the actually-hard cases.
        </li>
      </ul>

      <h2>The lesson I carry forward</h2>

      <p>
        Most legacy workflows aren&rsquo;t arbitrary. They&rsquo;re an
        implicit state machine with deep institutional knowledge baked
        into every step. The job isn&rsquo;t to delete the workflow.
        It&rsquo;s to make the state machine explicit, give every state
        an unambiguous owner, and leave the personality intact. The back
        office isn&rsquo;t your customer&rsquo;s enemy; they&rsquo;re your
        co-author.
      </p>
    </article>
  );
}
