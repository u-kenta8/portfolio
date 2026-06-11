import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "async-collaboration-japan",
  title: "Async-first written collaboration: notes from a Japanese engineer",
  description:
    "Working with global remote teams from Japan stretched my writing more than my engineering. A practical playbook for the patterns that earned me trust on async-first teams.",
  date: "2025-12-01",
  tags: ["Remote Work", "Communication", "Career"],
  readingMinutes: 5,
};

export default function Post() {
  return (
    <article className="prose-post">
      <p className="lede">
        Most of my career has been in Japanese tech companies, where the
        default mode of work is in-person, real-time, and high-context.
        Moving toward global remote work stretched my writing more than
        my engineering — and in the end, it changed how I think about
        engineering itself.
      </p>

      <p>
        These are the patterns I rely on now. Some are universal to good
        async work. A few are specific to a non-native English speaker
        from a high-context culture, learning to write for an
        async-first global team.
      </p>

      <h2>Write the decision, not the conversation</h2>

      <p>
        Early in my remote work, my messages read like meeting notes:
        every option discussed, every concern raised, every tangent
        explored. Readers had to do the work of figuring out what we
        actually decided.
      </p>

      <p>
        I rewrote my Slack and PR comments around a simple template:
      </p>

      <pre>
        <code>{`Decision: we'll use approach A.
Why: it removes a class of bug we're seeing in approach B.
Tradeoff: A is 10% slower under load, which we can live with.
Open question: should we add the migration in this PR or a follow-up?`}</code>
      </pre>

      <p>
        Four lines. A reader who skims the first line knows the
        decision. A reader who reads to the end knows the reasoning. A
        reader who needs to push back has a clearly labeled open
        question to address.
      </p>

      <h2>Bury the lede only when you mean it</h2>

      <p>
        Japanese written communication often opens with context and
        builds to the conclusion. It&rsquo;s polite, it&rsquo;s correct,
        and on async-first teams it loses readers in the first paragraph.
        Most English-language readers want the conclusion in line one
        and the context in line three.
      </p>

      <p>
        I had to retrain myself: open with what I want from the reader,
        then explain why. &ldquo;I&rsquo;d like to merge this PR by
        Friday — here&rsquo;s what it changes, and the one risk I want
        a second opinion on.&rdquo; The reader knows the ask before they
        decide how much attention to give the rest.
      </p>

      <h2>Use the right channel for the right urgency</h2>

      <p>
        A common new-to-remote mistake: treating every message as if it
        needs a reply within minutes. Async-first teams have multiple
        channels and you have to pick deliberately.
      </p>

      <ul>
        <li>
          <strong>Docs / PRs</strong> for decisions and proposals. Reply
          window: 1–3 days.
        </li>
        <li>
          <strong>Threaded comments</strong> for discussion. Reply window:
          same day.
        </li>
        <li>
          <strong>DMs</strong> for personal questions or coordination.
          Reply window: when convenient.
        </li>
        <li>
          <strong>@-mentions in channels</strong> for time-sensitive work.
          Reply window: hours.
        </li>
        <li>
          <strong>Pages / incidents</strong> for true urgency. Reply
          window: minutes.
        </li>
      </ul>

      <p>
        The rule I follow: never use a higher-urgency channel for a
        lower-urgency message. A timezone gap is not an excuse to page
        someone &mdash; it&rsquo;s a reason to write the decision down
        well enough that they can act on it when they wake up.
      </p>

      <h2>Be explicit about expectations and times</h2>

      <p>
        When you work across timezones, &ldquo;by tomorrow&rdquo; is
        ambiguous. &ldquo;By the end of my working day on Friday, 18:00
        JST (09:00 UTC)&rdquo; is not. Get in the habit of writing
        absolute times with explicit timezones, and writing your
        expectation of when a reply is needed.
      </p>

      <p>
        For me as someone in JST (UTC+9), this looks like opening
        messages with the recipient&rsquo;s timezone in mind:
        &ldquo;Heading offline soon, but happy to pick this up when
        you&rsquo;re back in CET tomorrow.&rdquo; It signals: I&rsquo;m
        not waiting, you&rsquo;re not blocked, the work moves on.
      </p>

      <h2>Don&rsquo;t apologize for your English</h2>

      <p>
        This is the one I had to actively unlearn. When my English felt
        clumsy, I&rsquo;d hedge: &ldquo;sorry for my poor English, please
        let me know if this is unclear.&rdquo; It came across as
        uncertain rather than humble.
      </p>

      <p>
        I dropped the apology. If my writing is unclear, the reader can
        ask. If it&rsquo;s clear enough, the apology was wasted words.
        Confidence in writing is not about vocabulary; it&rsquo;s about
        making the decision clear and trusting the reader to follow.
      </p>

      <h2>Document the why, not the what</h2>

      <p>
        Asynchronous work falls apart when context is missing. Every
        commit message, PR description, and design doc has to assume the
        reader doesn&rsquo;t share your working memory of the last
        meeting — because they probably weren&rsquo;t in it, or it
        happened while they were asleep.
      </p>

      <p>
        Instead of "fix bug in order processing," write:
      </p>

      <pre>
        <code>{`fix(orders): retry without rebuilding the cart on transient 5xx

A customer-reported edge case where a 502 from the payment
processor would cause our retry loop to rebuild the cart from
scratch, occasionally losing items that had been removed during
checkout.

The fix is to scope the retry to the payment call, not the whole
checkout. The cart is now built once per checkout session.

Tested manually + added integration coverage for the 502 case.`}</code>
      </pre>

      <p>
        The next engineer who looks at this commit — and there&rsquo;s
        always a next engineer — does not need to message you on Slack
        to find out what it does.
      </p>

      <h2>The pattern that ties it together</h2>

      <p>
        Async-first writing is not about writing more. It&rsquo;s about
        writing in a way that does not require the reader to ask a
        follow-up. Every sentence you write should aim to make one
        future Slack DM unnecessary. Do that consistently and your
        timezone stops being a disadvantage — it becomes a reason your
        teammates trust you with the harder work.
      </p>
    </article>
  );
}
