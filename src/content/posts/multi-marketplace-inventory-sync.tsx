import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "multi-marketplace-inventory-sync",
  title: "Inventory sync across three marketplaces: event-driven vs polling",
  description:
    "Keeping a single source of truth in sync with Rakuten, Yahoo Shopping, and Amazon is a deceptively hard problem. Here are the two architectures we tried, and why we ended up with a hybrid.",
  date: "2026-05-14",
  tags: ["System Design", "E-commerce", "Distributed Systems"],
  readingMinutes: 7,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        A retailer with 5,000 SKUs listed on three marketplaces has 15,000
        inventory rows that all need to agree. Sell one unit on Rakuten and
        the stock count on Amazon and Yahoo needs to drop within seconds —
        otherwise you oversell, and oversold orders are the worst kind of
        customer support ticket.
      </p>

      <p>
        At Smaregi we shipped two generations of inventory sync. The first
        was a polling loop that ran every two minutes. The second was an
        event-driven pipeline. Neither was the right answer alone.
      </p>

      <h2>Architecture 1: the polling loop</h2>

      <p>
        Every two minutes, a worker queried each marketplace for "what
        inventory have you changed since I last asked," diffed it against
        our internal stock table, and pushed updates outbound to the other
        two marketplaces. The architecture diagram:
      </p>

      <pre>
        <code>{`         ┌────────────────────┐
         │  Smaregi stock DB  │
         └─────────┬──────────┘
                   │ poll every 2 min
        ┌──────────┴──────────┐
        ▼          ▼          ▼
   Rakuten     Yahoo!      Amazon
       │           │           │
       │ "any changes since X" │
       └─────────────────────┘
                  │
                  ▼
         apply diff to DB
                  │
                  ▼
         push outbound updates
         (to the other two)`}</code>
      </pre>

      <p>
        It was simple and easy to reason about. We also accidentally
        overlooked three things:
      </p>

      <ol>
        <li>
          <strong>The 2-minute window is enough time to oversell.</strong>{" "}
          A flash-sale SKU can disappear in 30 seconds. Buyers on the slowest
          marketplace see stale stock.
        </li>
        <li>
          <strong>Polling load grew quadratically.</strong> Three marketplaces
          times N retailers times every-2-minutes meant our outbound API
          calls became the bottleneck, not the marketplaces.
        </li>
        <li>
          <strong>Race conditions in the diff.</strong> If a sale and an
          inbound restock landed in the same polling window, our diff logic
          would occasionally apply them in the wrong order.
        </li>
      </ol>

      <h2>Architecture 2: event-driven</h2>

      <p>
        We rewrote the sync as an event-driven pipeline. Every change —
        whether from a marketplace webhook, a POS terminal, or a manual
        inventory adjustment — became an event on a queue. A single
        consumer applied the event to the canonical stock state and fanned
        out updates.
      </p>

      <pre>
        <code>{`sale on Rakuten ──webhook──┐
sale on Amazon  ──webhook──┤
restock on POS  ──event───┤
manual edit     ──event───┤
                           ▼
                  ┌──────────────────┐
                  │   Stock topic    │
                  │  (ordered queue) │
                  └────────┬─────────┘
                           ▼
                  ┌──────────────────┐
                  │  Stock applier   │
                  │  (single worker) │
                  └────────┬─────────┘
                           │ apply + emit
                           ▼
                  ┌──────────────────┐
                  │  Fanout worker   │
                  └────────┬─────────┘
                  ┌────────┴────────┐
                  ▼                 ▼
              Rakuten, Yahoo!, Amazon
              (only the ones NOT the source)`}</code>
      </pre>

      <p>
        Latency went from "up to 2 minutes" to "sub-second on the happy
        path." But we hit new problems:
      </p>

      <ul>
        <li>
          <strong>Webhooks aren&rsquo;t reliable.</strong> Marketplaces miss
          delivery, retry inconsistently, and sometimes deliver out of
          order. We couldn&rsquo;t fully trust them.
        </li>
        <li>
          <strong>Initial state and recovery.</strong> When a SKU was added
          mid-day or after a deployment, there was no event for the current
          stock count — we had to reconcile from the marketplace&rsquo;s
          point-in-time view.
        </li>
      </ul>

      <h2>The hybrid that actually worked</h2>

      <p>
        We kept the event-driven hot path for the fast majority of changes,
        but layered a slow reconciliation poll on top of it:
      </p>

      <ul>
        <li>
          Event pipeline handles 99% of changes in real time.
        </li>
        <li>
          A reconciliation poll runs every 15 minutes, asking each
          marketplace for current inventory and diffing against our state.
          Any drift triggers a correction event onto the same queue.
        </li>
        <li>
          The reconciler also acts as a deployment-time safety net: if the
          event consumer was offline for any reason, the next reconciler
          run catches up.
        </li>
      </ul>

      <p>
        Once we accepted that the event stream would have gaps and that the
        polling reconciler would have latency, the system became
        predictable. Hot path: events. Cold path: polling. Both feeding the
        same single source of truth.
      </p>

      <h2>What I&rsquo;d tell my past self</h2>

      <ul>
        <li>
          Event-driven is faster, but events alone are not enough. You
          always need a periodic reconciliation against the source of
          truth — webhooks miss, queues fail, deploys happen.
        </li>
        <li>
          Make the same code path serve real-time changes and reconciliation
          deltas. Two parallel pipelines is twice the bugs.
        </li>
        <li>
          Inventory bugs are silent at first. Spend the engineering hours
          on observability and alerting before you spend them on features.
        </li>
      </ul>
    </article>
  );
}
