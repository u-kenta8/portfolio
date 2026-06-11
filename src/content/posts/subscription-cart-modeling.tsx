import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "subscription-cart-modeling",
  title: "Subscription cart modeling: layering recurring purchases on a one-off catalog",
  description:
    "Subscription commerce is a graph problem hiding in a relational schema. Here's the data model that finally let us layer recurring orders onto a catalog designed for one-shot purchases.",
  date: "2026-02-15",
  tags: ["Data Modeling", "E-commerce", "MySQL"],
  readingMinutes: 6,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        Subscription commerce looks simple from the outside. A customer
        signs up for &ldquo;a bag of coffee every month,&rdquo; we charge
        them on a cadence, and we ship. Under the hood, every assumption
        baked into a one-off-purchase catalog starts to break.
      </p>

      <p>
        We had a catalog built for one-shot orders — products, variants,
        prices, carts, orders. Subscriptions had to fit on top without
        rewriting any of it. This is the model we landed on.
      </p>

      <h2>The questions that broke the existing model</h2>

      <p>
        A few that showed up immediately:
      </p>

      <ul>
        <li>
          What does <em>price</em> mean for a subscription? The price at
          signup? The price at each renewal? A discounted recurring price
          that&rsquo;s separate from the catalog price?
        </li>
        <li>
          What happens when a product variant gets discontinued
          mid-subscription? Does the next shipment fail, switch to a
          successor product, or pause?
        </li>
        <li>
          Where does &ldquo;skip this month&rdquo; live? On the
          subscription? As a separate object? In a customer-managed
          schedule?
        </li>
        <li>
          What about a subscription that contains <em>two</em> products,
          one shipped monthly and one shipped quarterly?
        </li>
      </ul>

      <p>
        Each question pulled the model in a different direction. The
        original catalog was a one-level structure;{" "}
        <code>cart_items</code> were leaves of a <code>cart</code>.
        Subscriptions are a graph: a subscription contains items, items
        contain a cadence, cadences produce shipments, shipments resolve
        to a one-off order.
      </p>

      <h2>The shape we landed on</h2>

      <pre>
        <code>{`subscriptions
├── id
├── customer_id
├── status (active | paused | cancelled)
├── created_at
├── next_renewal_at
└── (no price, no items here)

subscription_items                  -- 1:N from subscription
├── id
├── subscription_id  (FK)
├── product_variant_id (FK)
├── quantity
├── cadence (every_2_weeks | monthly | quarterly)
├── price_cents       -- locked at signup, may differ from catalog
├── next_ship_at
└── status

subscription_events                 -- append-only log
├── id
├── subscription_id  (FK)
├── type (signup | renewal | skip | pause | resume | cancel)
├── payload (JSON: who did it, why, what changed)
└── created_at

shipments                            -- 1 per cadence cycle per item
├── id
├── subscription_item_id (FK)
├── scheduled_for
├── status (planned | placed | fulfilled | failed | skipped)
├── order_id (FK, nullable)         -- once it becomes a real order
└── ...`}</code>
      </pre>

      <p>
        Three design choices worth calling out.
      </p>

      <h2>Items, not the subscription, hold price and cadence</h2>

      <p>
        The original instinct was to put cadence on the subscription —
        &ldquo;monthly&rdquo; or &ldquo;every two weeks&rdquo;. That broke
        the moment a subscription mixed cadences (monthly coffee +
        quarterly mug). Moving cadence to the item meant each item could
        renew independently, and the subscription became a logical
        container, not a billing unit.
      </p>

      <p>
        Same for price: locking it at the item level let us honor a
        signup discount for the lifetime of that subscription, even if
        the catalog price changed. New items added to an existing
        subscription got the current price; existing items kept theirs.
      </p>

      <h2>Shipments are pre-computed, not derived</h2>

      <p>
        A naive design computes &ldquo;next shipment&rdquo; on demand from
        the subscription state. A better design materializes the next 1–3
        shipments as actual rows in a <code>shipments</code> table.
      </p>

      <p>
        Why: a customer skipping next month should mutate a real, visible
        row — not adjust a flag that&rsquo;ll be interpreted by future
        code. Customer service can SELECT the upcoming shipment, mark it
        skipped, and trust that the next renewal will produce the one
        after it. The schedule becomes inspectable.
      </p>

      <h2>An append-only event log alongside the state</h2>

      <p>
        Every meaningful transition — signup, renewal, skip, pause, cancel
        — writes a row to <code>subscription_events</code>. We never
        update or delete a row in this table. Customer service questions
        like &ldquo;when did they pause this?&rdquo; or &ldquo;why did
        the price change?&rdquo; resolve to a SELECT, not a
        reconstruction.
      </p>

      <p>
        It&rsquo;s the same idea as event sourcing, but without the full
        commitment. Current state lives in the normalized tables;
        history lives in the event log. Neither owns the truth alone,
        and we&rsquo;ve crashed every customer-service question into a
        single query against the event log.
      </p>

      <h2>What I&rsquo;d change</h2>

      <ul>
        <li>
          The original catalog still uses <code>product_variant_id</code>{" "}
          as the leaf. A subscription that lasts years can outlive a
          product. We added a <code>product_variant_succession</code>{" "}
          table to map &ldquo;variant A was replaced by variant B in 2024&rdquo;
          but the cleaner answer would have been to introduce a
          subscription-scoped product abstraction at the start.
        </li>
        <li>
          The cadence column is a string. It should have been a structured
          object — <code>&#123; interval: 'month', count: 1 &#125;</code>{" "}
          — to support &ldquo;every 6 weeks&rdquo; without piling on enum
          cases.
        </li>
        <li>
          Shipments and orders share a lot of columns. We kept them
          separate for clarity but ended up duplicating logic in two
          places. A future redesign would model an order as the
          materialized form of a shipment.
        </li>
      </ul>

      <h2>The lesson worth keeping</h2>

      <p>
        Subscriptions look like a feature you tack onto a one-off
        catalog. They&rsquo;re actually a graph problem hiding in a
        relational schema. Take the time to model the items, cadences,
        and shipments as first-class entities, and your customer
        service team will quietly thank you for years.
      </p>
    </article>
  );
}
