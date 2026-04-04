export const TIERS = [
  { label: 'CanonicalInMemoryState', sub: 'RAM · ~64 블록 · O(1)', active: 'border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' },
  { label: 'DatabaseProvider (MDBX)', sub: '디스크 B+Tree', active: 'border-blue-400 bg-blue-50/60 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400' },
  { label: 'StaticFileProvider', sub: '불변 mmap 아카이브', active: 'border-purple-400 bg-purple-50/60 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400' },
];
