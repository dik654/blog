import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface NoteFrontmatter {
  source_video?: string;
  source_channel?: string;
  source_url?: string;
  source_title?: string;
  generated?: string;
  status?: string;
}

function parseFrontmatter(md: string): { fm: NoteFrontmatter; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(md);
  if (!m) return { fm: {}, body: md };
  const fm: NoteFrontmatter = {};
  for (const line of m[1].split('\n')) {
    const kv = /^([a-z_]+):\s*(.*)$/.exec(line.trim());
    if (!kv) continue;
    let v: string = kv[2];
    if (v.startsWith('"') && v.endsWith('"')) {
      try { v = JSON.parse(v); } catch { /* keep raw */ }
    }
    (fm as Record<string, string>)[kv[1]] = v;
  }
  return { fm, body: md.slice(m[0].length) };
}

export default function MarkdownNote({ raw }: { raw: string }) {
  const { fm, body } = parseFrontmatter(raw);
  return (
    <article className="mx-auto max-w-3xl py-6">
      {/* 자동 생성 배너 — 본인 정식 글과 시각 분리 */}
      <div className="mb-5 px-3 py-2 rounded text-xs border border-dashed border-indigo-400/40 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-200">
        🤖 <b>자동 생성 노트</b> — AI 가 영상·아티클 자막에서 정리한 초안. 사람 손이 안 닿은 거친 글. 정식 분석은 다른 카테고리 참조.
        {fm.source_url && (
          <>
            {' · '}
            <a href={fm.source_url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
              원본 ↗
            </a>
            {fm.source_channel && <span> ({fm.source_channel})</span>}
          </>
        )}
        {fm.generated && <span className="ml-2 opacity-60">{new Date(fm.generated).toISOString().slice(0, 10)} 생성</span>}
      </div>
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
          {body}
        </ReactMarkdown>
      </div>
    </article>
  );
}
