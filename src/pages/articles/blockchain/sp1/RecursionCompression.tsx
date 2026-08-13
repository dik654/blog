import RecursionViz from "./viz/RecursionViz";
import CodePanel from "@/components/ui/code-panel";
import {
  COMPRESS_CODE,
  compressAnnotations,
  STAGES,
} from "./RecursionCompressionData";

export default function RecursionCompression() {
  return (
    <section id="recursion-compression" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">재귀적 압축</h2>
      <div className="not-prose mb-8">
        <RecursionViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Core 증명(N개 ShardProof)은 <strong>4단계 재귀 압축</strong>을 거쳐
          최종 검증 가능한 형태로 변환됩니다. Plonky3 프레임워크의 재귀 회로를
          사용하여, 각 단계에서 이전 증명의 유효성을 새 AIR 프로그램 안에서
          검증합니다.
        </p>
        <h3>4단계 파이프라인</h3>
      </div>
      <div className="space-y-2 mt-4 mb-6">
        {STAGES.map((s) => (
          <div
            key={s.name}
            className="grid min-w-0 grid-cols-1 gap-1 rounded-lg border border-border/60 p-3 sm:grid-cols-[6rem_5rem_6rem_minmax(0,1fr)] sm:gap-4"
          >
            <span className="min-w-0 font-mono text-xs font-bold text-indigo-400">
              {s.name}
            </span>
            <span className="min-w-0 font-mono text-[11px] text-foreground/45">
              {s.field}
            </span>
            <span className="min-w-0 font-mono text-[11px] text-foreground/45">
              {s.size}
            </span>
            <span className="min-w-0 text-sm text-foreground/75">{s.desc}</span>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CodePanel
          title="compress() 구현"
          code={COMPRESS_CODE}
          annotations={compressAnnotations}
        />
      </div>
    </section>
  );
}
