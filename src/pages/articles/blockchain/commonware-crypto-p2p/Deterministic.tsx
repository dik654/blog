import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import DeterministicViz from './viz/DeterministicViz';

interface Props {
  onCodeRef: (k: string, r: CodeRef) => void;
}

export default function Deterministic({ onCodeRef }: Props) {
  return (
    <section id="deterministic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">결정론적 시뮬레이션 & 테스트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>p2p::simulated</strong> — 실제 네트워크 없이 가상 환경에서 전체 프로토콜 테스트
          <br />
          Link { latency, jitter, success_rate }로 현실적 네트워크 모델링
          <br />
          progressive filling — max-min 공정 대역폭 할당
        </p>
        <p className="leading-7">
          <strong>deterministic::Runner::seeded(seed)</strong> — 동일 시드 → 동일 결과
          <br />
          매 커밋마다 CI에서 4가지 장애 시나리오 자동 실행
          <br />
          시드 기록만으로 모든 엣지 케이스 정확히 재현 가능
        </p>
      </div>
      <div className="not-prose mb-8">
        <DeterministicViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
