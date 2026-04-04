import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import VerifyDilithiumViz from './viz/VerifyDilithiumViz';
import { codeRefs } from './codeRefs';

export default function DilithiumVerify({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="dilithium-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Dilithium 검증 (UseHint)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          검증자는 공개키(A, t)와 서명(z, c_tilde, h)만 가지고 있습니다.
          비밀키(s1, s2) 없이도 <code>A*z - c*t</code>를 계산하고,
          힌트 h를 사용하여 w1의 상위 비트를 복원합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('dilithium-verify', codeRefs['dilithium-verify'])} />
          <span className="text-[10px] text-muted-foreground self-center">verify() 내부</span>
        </div>
        <h3>왜 작동하는가</h3>
        <p>
          <code>A*z - c*t = A*(y+c*s1) - c*(A*s1+s2) = A*y - c*s2</code><br />
          c*s2가 작으므로 HighBits(A*y - c*s2) = HighBits(A*y) = w1.
          힌트 h는 라운딩 경계 근처의 미세한 차이를 보정합니다.
        </p>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — 검증이 서명보다 빠른 이유: 서명은 거부 샘플링으로 평균 4-7회 반복하지만,
          검증은 항상 1번의 행렬 곱 + 해시로 완료됩니다.
        </p>
      </div>
      <div className="mt-8"><VerifyDilithiumViz /></div>
    </section>
  );
}
