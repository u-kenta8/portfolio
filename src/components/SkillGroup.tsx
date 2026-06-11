type Props = {
  group: string;
  items: readonly string[];
};

export function SkillGroup({ group, items }: Props) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-zinc-100 py-3 sm:grid-cols-[160px_1fr] dark:border-zinc-800/60">
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {group}
      </div>
      <div className="text-sm text-zinc-700 dark:text-zinc-300">
        {items.join(" · ")}
      </div>
    </div>
  );
}
