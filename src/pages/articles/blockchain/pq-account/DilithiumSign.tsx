import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import SignViz from './viz/SignViz';
import { codeRefs } from './codeRefs';

export default function DilithiumSign({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="dilithium-sign" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Dilithium 서명 (NTT + 거부 샘플링)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서명 과정의 핵심은 <strong>거부 샘플링</strong>입니다.
          마스킹 벡터 y로 <code>z = y + c*s1</code>을 계산하되,
          z가 너무 크면 s1 정보가 노출될 수 있어 재시작합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('dilithium-sign', codeRefs['dilithium-sign'])} />
          <span className="text-[10px] text-muted-foreground self-center">sign() 내부</span>
        </div>
        <p>
          도전 다항식 <code>c</code>는 256개 계수 중 정확히 39개만 +1 또는 -1이고 나머지는 0입니다.
          이 희소성 덕분에 c*s1의 노름이 작게 유지되어, z가 s1을 숨길 수 있습니다.
        </p>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — 거부 샘플링의 직관: y 없이 z = c*s1만 공개하면 s1이 바로 드러납니다.
          y를 더해 z를 균일 분포처럼 만들되, z가 "너무 한쪽으로 치우치면"(= s1 방향) 재시도합니다.
        </p>
      </div>
      <div className="mt-8"><SignViz /></div>
    </section>
  );
}
