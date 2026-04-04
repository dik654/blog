import type { CodeRef } from '@/components/code/types';
import OverviewViz from './viz/OverviewViz';

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          Helios가 다루는 타입은 두 세계로 나뉜다.<br />
          CL(합의 레이어) 타입: SSZ 인코딩, slot 기반, BeaconBlockHeader 5필드(112B 고정).<br />
          EL(실행 레이어) 타입: RLP 인코딩, block number 기반, Header 15필드(가변 크기).<br />
          Helios는 CL 타입을 직접 정의하고, EL 타입은 alloy 라이브러리에 위임한다.
        </p>
      </div>

      {/* Viz: CL vs EL 비교 + 데이터 흐름 */}
      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-indigo-500/50 pl-3">
          <strong>핵심 구분</strong><br />
          CL 타입의 state_root가 EL 상태 전체의 앵커.<br />
          Helios는 이 32바이트 해시 하나로 EL의 account, storage를 Merkle 증명한다.
        </p>
      </div>
    </section>
  );
}
