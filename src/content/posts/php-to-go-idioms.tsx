import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "php-to-go-idioms",
  title: "From PHP to Go: idioms I had to unlearn, patterns I had to learn",
  description:
    "After seven years of shipping PHP, my first months writing Go in production were a quiet humbling. Here are the patterns that didn't translate, and the ones I wish I'd seen earlier.",
  date: "2026-04-30",
  tags: ["Go", "PHP", "Career"],
  readingMinutes: 6,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        I wrote PHP in production for seven years. Object-oriented domain
        models, dependency-injected services, polymorphic class hierarchies
        — the whole catalog. Then I joined a team writing Go. My first month
        was a quiet humbling: code reviews kept asking me to undo the
        abstractions I&rsquo;d been instinctively building.
      </p>

      <p>
        These are the patterns I had to leave behind, and the ones I had to
        pick up, to write Go that other Gophers could read.
      </p>

      <h2>Unlearn: deep class hierarchies</h2>

      <p>
        In PHP, a typical service layer looked like{" "}
        <code>OrderService extends BaseService implements OrderInterface</code>.
        Inheritance was load-bearing. In Go there is no inheritance — only
        composition and interface satisfaction. My first instinct was to
        emulate inheritance with embedded structs:
      </p>

      <pre>
        <code>{`type BaseService struct {
    Logger  *slog.Logger
    DB      *sql.DB
}

type OrderService struct {
    BaseService    // emulate "extends"
    OrderClient   *clients.OrderAPI
}`}</code>
      </pre>

      <p>
        It looked clever and was a smell. The reviewer asked: what does the
        BaseService actually <em>do</em>? Answer: nothing — it just holds
        dependencies. Embedding it added a layer of indirection for zero
        encapsulation gain.
      </p>

      <p>The idiomatic version is flatter:</p>

      <pre>
        <code>{`type OrderService struct {
    Logger      *slog.Logger
    DB          *sql.DB
    OrderClient *clients.OrderAPI
}`}</code>
      </pre>

      <p>
        Less elegant, more readable. Go rewards being literal about
        dependencies.
      </p>

      <h2>Unlearn: dependency injection containers</h2>

      <p>
        In PHP, every project I touched had a DI container — Symfony&rsquo;s,
        Laravel&rsquo;s, or a hand-rolled one. I tried to introduce one in
        Go and got cheerfully pushed back. The Go answer is: the{" "}
        <code>main</code> function wires things up by hand, top-to-bottom,
        and that&rsquo;s the entire DI story.
      </p>

      <pre>
        <code>{`func main() {
    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    db := mustOpenDB(os.Getenv("DATABASE_URL"))
    orderClient := clients.NewOrderAPI(http.DefaultClient)
    orderSvc := services.NewOrder(logger, db, orderClient)
    handler := handlers.NewOrder(orderSvc)
    http.Handle("/orders", handler)
    log.Fatal(http.ListenAndServe(":8080", nil))
}`}</code>
      </pre>

      <p>
        It scales further than you&rsquo;d think. By the time{" "}
        <code>main</code> is 200 lines, the wiring is so explicit that
        nobody asks "where does this dependency come from?" — a question
        every PHP newcomer has asked of a container-based codebase.
      </p>

      <h2>Learn: errors as values, not exceptions</h2>

      <p>
        PHP&rsquo;s <code>try/catch</code> made me sloppy. Anything could
        throw, and I&rsquo;d catch it three layers up. Go forces every error
        to be explicit:
      </p>

      <pre>
        <code>{`func (s *OrderService) Place(ctx context.Context, o Order) (Receipt, error) {
    if err := s.validate(o); err != nil {
        return Receipt{}, fmt.Errorf("validate: %w", err)
    }
    id, err := s.db.Insert(ctx, o)
    if err != nil {
        return Receipt{}, fmt.Errorf("insert: %w", err)
    }
    if err := s.notify(ctx, id); err != nil {
        s.logger.Warn("notify failed", "err", err, "order", id)
        // intentional: notify failure does not fail the placement
    }
    return Receipt{OrderID: id}, nil
}`}</code>
      </pre>

      <p>
        The verbosity is the point. At every <code>if err != nil</code>, the
        author has to decide: do I propagate, log, retry, or recover? In
        PHP I&rsquo;d catch the exception in the controller and call it a
        day. In Go, the decision is made at the right layer, every time.
      </p>

      <h2>Learn: small interfaces, defined by the consumer</h2>

      <p>
        In PHP, interfaces lived next to the implementation. Go inverts
        this: an interface is defined where it&rsquo;s <em>used</em>, not
        where it&rsquo;s implemented. If my <code>OrderService</code> needs
        a logger and a clock, I define them as small consumer-side
        interfaces:
      </p>

      <pre>
        <code>{`type Logger interface {
    Info(msg string, args ...any)
    Warn(msg string, args ...any)
}

type Clock interface {
    Now() time.Time
}

type OrderService struct {
    log   Logger
    clock Clock
}`}</code>
      </pre>

      <p>
        Now testing the service is trivial — pass a stub logger and a fake
        clock — and my service has no dependency on the concrete{" "}
        <code>slog</code> or <code>time</code> packages at the type level.
      </p>

      <h2>What I&rsquo;d tell my past PHP self</h2>

      <ul>
        <li>
          Stop reaching for inheritance. Composition + small interfaces
          covers 99% of what you used inheritance for, and reads better.
        </li>
        <li>
          Trust the explicit error returns. They feel verbose for two weeks
          and then become the thing you miss most in any other language.
        </li>
        <li>
          Read the standard library. The patterns Go developers reach for
          live in <code>net/http</code>, <code>database/sql</code>,{" "}
          <code>context</code>, and <code>log/slog</code>. None of them
          need a framework.
        </li>
      </ul>

      <p>
        Two years in, I still occasionally write a Go function that feels
        like translated PHP. The smell is usually the same: too many
        abstractions, too few small interfaces. The fix is always the same
        too: flatten it.
      </p>
    </article>
  );
}
