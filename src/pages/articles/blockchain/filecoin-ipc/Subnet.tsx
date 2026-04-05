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

        <h3 className="text-xl font-semibold mt-6 mb-3">Subnet 생성 &amp; 관리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Subnet Creation Process:

// 1. Deploy SubnetActor (on parent chain):
//    - specify parent subnet
//    - set consensus type
//    - define economic parameters
//    - stake minimum

// 2. CreateSubnet() method:
//    type CreateSubnetParams struct {
//        Parent: SubnetID
//        Name: string
//        MinValidators: uint64
//        MinValidatorStake: TokenAmount
//        BottomupCheckPeriod: ChainEpoch
//        TopdownCheckPeriod: ChainEpoch
//        Consensus: ConsensusType
//    }

// 3. SubnetActor deployed:
//    - registered with Gateway
//    - unique subnet ID
//    - accepting validators

// 4. JoinSubnet():
//    - validators stake FIL
//    - registered to validator set
//    - genesis params distributed
//    - launch subnet

// 5. Bootstrap:
//    - validators start nodes
//    - P2P network
//    - consensus activated
//    - block production begins

// Consensus Options:
// - Tendermint/CometBFT: fast finality
// - Mir: high throughput BFT
// - Narwhal/Bullshark: DAG-based
// - Custom: any consensus module

// Validator Economics:
// - minimum stake per validator
// - rewards from subnet block rewards
// - gas fees earned locally
// - slash on misbehavior
// - withdrawals to parent

// Subnet Parameters:
// - block time (1s - 60s)
// - max block size
// - gas limit
// - finality period
// - slashing conditions

// Examples deployed:
// - Mir BFT subnet
// - EVM subnet (Solidity contracts)
// - AI inference subnet
// - game subnet (low latency)

// Lifecycle:
// 1. Create: parent deploys SubnetActor
// 2. Bootstrap: validators join
// 3. Active: consensus + checkpoints
// 4. Kill: shut down (optional)
// 5. Liquidate: return funds to parent`}
        </pre>
        <p className="leading-7">
          Subnet 생성: <strong>CreateSubnet → validators join → bootstrap → active</strong>.<br />
          consensus 선택 자유 (Tendermint, Mir, Narwhal+Bullshark, custom).<br />
          validator stake + slashing economics.
        </p>
      </div>
    </section>
  );
}
