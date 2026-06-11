type Props = {
  group: string;
  items: readonly string[];
};

export function SkillGroup({ group, items }: Props) {
  return (
    <div className="group grid grid-cols-1 gap-2 border-b border-[var(--rule)] py-4 transition sm:grid-cols-[180px_1fr]">
      <div className="font-display text-base text-[var(--accent)]">
        {group}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[15px] text-ink/85">
        {items.map((item, i) => (
          <span key={item} className="flex items-center gap-3">
            <span>{item}</span>
            {i < items.length - 1 && (
              <span aria-hidden className="text-[var(--rule)]">•</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
