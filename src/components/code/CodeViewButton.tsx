export default function CodeViewButton({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-1 rounded border border-amber-300 bg-amber-50/60 px-3 py-2 text-xs text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-950/40 cursor-pointer"
    >
      {'{ }'} {label || '코드 보기'}
    </button>
  );
}
