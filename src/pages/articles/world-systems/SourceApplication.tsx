interface SourceApplicationProps {
  source: string;
  excerpt: string;
  application: string;
}

/** 원문에서 확인한 짧은 문구와 이 글의 가정 사례를 나란히 읽는다. */
export default function SourceApplication({ source, excerpt, application }: SourceApplicationProps) {
  return (
    <div className="my-6 rounded-2xl border-l-4 border-sky-600 bg-sky-50 p-5 dark:border-sky-400 dark:bg-sky-950/30">
      <p className="text-sm font-semibold text-sky-900 dark:text-sky-200">원문 실물 · {source}</p>
      <blockquote className="mt-2 border-0 pl-0 text-base leading-7 text-neutral-900 dark:text-neutral-100">“{excerpt}”</blockquote>
      <p className="mt-3 text-sm leading-7 text-neutral-700 dark:text-neutral-300">사례에 적용하면 {application}</p>
    </div>
  );
}
