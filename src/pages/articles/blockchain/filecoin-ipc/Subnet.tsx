import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Subnet({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="subnet" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">서브넷 생성 & 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('ipc-subnet', codeRefs['ipc-subnet'])} />
          <span className="text-[10px] text-muted-foreground self-center">CreateSubnet() / JoinSubnet()</span>
        </div>
        <p>
          서브넷 생성: 최소 FIL 스테이크 + 합의 타입(Tendermint, Mir 등) 선택.<br />
          FVM에 SubnetActor가 배포되어 검증자 관리와 체크포인트 수집을 담당
        </p>
        <p>
          검증자 참여: FIL을 Gateway Actor에 스테이크 → 검증자 세트에 등록.<br />
          스테이크 양에 비례해 검증자 파워가 결정되고, 다음 에폭부터 블록 생산 참여
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 합의 선택의 자유</strong> — 서브넷마다 다른 합의 알고리즘을 사용 가능.<br />
          빠른 finality가 필요하면 Tendermint, 높은 처리량이 필요하면 Mir 선택
        </p>
      </div>
    </section>
  );
}
