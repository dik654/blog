import BridgeAssemblyViz from './viz/BridgeAssemblyViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function BridgeAssembly({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="bridge-assembly" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bridge 예제: 프리미티브 조립 실전</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <code>examples/bridge</code> — Commonware 프리미티브를 모두 조합한 실전 예제
          <br />
          두 네트워크 간 합의 인증서를 교환하는 브릿지 밸리데이터
        </p>
        <p className="leading-7">
          사용 프리미티브: <strong>simplex</strong>(합의) + <strong>authenticated</strong>(P2P)
          + <strong>bls12381</strong>(임계 서명) + <strong>ed25519</strong>(피어 인증)
          <br />
          Anti-Framework 패턴 핵심 — 필요한 것만 선택, 나머지는 직접 구현
        </p>
        <p className="leading-7">
          아래 StepViz가 <code>validator.rs</code>의 조립 과정을 단계별로 추적
        </p>
      </div>
      <div className="not-prose mb-8">
        <BridgeAssemblyViz onOpenCode={open} />
      </div>
    </section>
  );
}
