import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "mentoring-pr-reviews",
  title: "Mentoring through code review: what I emphasize, what I let go",
  description:
    "Code review is the highest-leverage mentoring touchpoint you have with junior engineers. A short list of the things I keep insisting on, and the things I've learned to stop arguing about.",
  date: "2026-02-01",
  tags: ["Mentoring", "Code Review", "Engineering Culture"],
  readingMinutes: 5,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        Code review is the highest-leverage mentoring touchpoint a senior
        engineer gets. It&rsquo;s also the easiest place to do harm — to
        come across as nitpicky, to slow down work for style preferences,
        to teach the wrong lesson by being right about the wrong thing.
      </p>

      <p>
        After years of reviewing PRs from engineers earlier in their
        careers, here&rsquo;s what I keep emphasizing and what I&rsquo;ve
        learned to let go.
      </p>

      <h2>What I emphasize</h2>

      <h3>Naming</h3>

      <p>
        The single highest-leverage thing in a code review. A function
        named <code>handleData</code> is invisible debt. A function named{" "}
        <code>parseSurveyResponseFromExternalProvider</code> tells the
        next reader what to expect before they read a line of the body.
      </p>

      <p>
        I&rsquo;ll send a PR back over a name. I won&rsquo;t send one
        back over a missing blank line.
      </p>

      <h3>Error paths</h3>

      <p>
        Most junior PRs implement the happy path beautifully and treat
        the error path as an afterthought. I always ask: what happens
        when this returns an error? What does the caller do? Is the
        error wrapped with context? Is it logged where it&rsquo;s
        ignored?
      </p>

      <p>
        Half the production bugs I&rsquo;ve seen come from error paths
        that no one thought about during review.
      </p>

      <h3>The size of the abstraction</h3>

      <p>
        Junior engineers often build for a problem they don&rsquo;t have
        yet. A common pattern: a one-method interface, a base class, and
        a factory — for a piece of code with one caller.
      </p>

      <p>
        I&rsquo;ll ask: who else uses this? If the answer is &ldquo;nobody
        yet,&rdquo; we&rsquo;re paying the cost of the abstraction
        without the benefit. The right shape is usually the boring one:
        a plain function. The abstraction can come the second time
        we need it.
      </p>

      <h3>Comments that explain the WHY</h3>

      <p>
        Reviews are an opportunity to teach the difference between
        comments that say what the code does (low value, because the
        code already says it) and comments that say <em>why</em> (high
        value, because the next reader cannot recover the why from the
        diff).
      </p>

      <pre>
        <code>{`// LOW VALUE — restates the code
// increment counter
counter++

// HIGH VALUE — explains the why
// Don't use atomic.Add: this counter is only touched
// from the single dispatcher goroutine, and benchmarks
// showed Add was 3x slower under contention.
counter++`}</code>
      </pre>

      <h3>Tests that document intent</h3>

      <p>
        I&rsquo;m more interested in the <em>name</em> of a test than the
        body. A test called <code>TestParse</code> is doing nothing for
        anyone six months from now. A test called{" "}
        <code>TestParse_acceptsTrailingComma_whenStrictDisabled</code>{" "}
        tells the next reader what behavior is contracted, before they
        even read the assertions.
      </p>

      <h2>What I&rsquo;ve learned to let go</h2>

      <h3>Style preferences</h3>

      <p>
        Tabs vs spaces, single vs double quotes, where to put braces.
        Run a formatter, set it in CI, and never discuss it in PR
        comments. Every comment about style is a comment not about
        substance.
      </p>

      <h3>The order of arguments</h3>

      <p>
        Whether <code>func transfer(from, to)</code> reads better than{" "}
        <code>func transfer(to, from)</code> matters for an API; it
        doesn&rsquo;t matter for an internal helper used in one place.
        Don&rsquo;t spend the team&rsquo;s time on it.
      </p>

      <h3>Premature performance</h3>

      <p>
        &ldquo;You could use a map here instead of a slice for O(1)
        lookup&rdquo; — on a code path that runs once with 12 items, this
        is true and irrelevant. I&rsquo;ll mention it as &ldquo;noting
        for later if this list grows&rdquo; and move on.
      </p>

      <h3>Solutions I would have written differently</h3>

      <p>
        This is the trap. A review is not an opportunity to make the
        code look like the code I would have written. As long as the
        author&rsquo;s solution is correct, maintainable, and follows
        the conventions of the codebase, my preferred shape is not a
        review comment.
      </p>

      <p>
        The reviewer&rsquo;s job is to spot bugs, ambiguity, and missed
        context — not to rewrite the PR in my own voice.
      </p>

      <h2>The mentoring frame</h2>

      <p>
        Two practices that I try to keep in every review:
      </p>

      <ul>
        <li>
          Explain the <em>why</em> behind every change request. &ldquo;Can
          you rename this?&rdquo; is a chore. &ldquo;Can you rename this?
          The current name reads like a getter, but it has side effects
          — readers will skim past it and miss what it does&rdquo; is a
          lesson.
        </li>
        <li>
          Flag the things they did <em>well</em>. A junior engineer who
          gets back twenty review comments and no acknowledgment that
          the structure was thoughtful is going to leave the review
          worse than when they entered it. A two-line "by the way, the
          way you broke this into three small functions made the diff
          a pleasure to read" costs me nothing and changes how they
          think about the next PR.
        </li>
      </ul>

      <p>
        I keep coming back to the same idea: every PR comment is also a
        message about how we work together. Pick the comments that
        matter, write them like the next reader will learn something,
        and let the rest go.
      </p>
    </article>
  );
}
