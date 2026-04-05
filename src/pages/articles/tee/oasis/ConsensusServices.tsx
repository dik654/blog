import ConsensusServicesViz from './viz/ConsensusServicesViz';
import ConsensusServicesStepViz from './viz/ConsensusServicesStepViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ConsensusServices({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="consensus-services" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 서비스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Oasis 합의는 <strong>CometBFT</strong>(구 Tendermint Core) 엔진 기반<br />
          <strong>Propose → Prevote → Precommit → Commit</strong> 4단계 BFT 합의<br />
          <strong>ABCI</strong>(Application Blockchain Interface)로 합의 로직과 애플리케이션 로직 분리<br />
          <strong>즉시 확정성</strong> — 2/3 precommit 도달 시 최종 확정 (reorg 불가)
        </p>
      </div>

      <ConsensusServicesViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">BFT 라운드 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// CometBFT 합의 라운드 (1 블록 생성)

Round 0:
  1. PROPOSE        // Proposer가 블록 제안 (제안자는 VRF로 선출)
     - 제안자가 블록 헤더 + tx 전파
     - 타임아웃: 3초

  2. PREVOTE        // 검증인이 제안 블록에 투표
     - 유효한 블록이면 PREVOTE for block_hash
     - 유효하지 않으면 PREVOTE for nil
     - 2/3 도달 → polka 형성

  3. PRECOMMIT      // polka 확인 후 precommit
     - polka 보면 PRECOMMIT for block_hash
     - 2/3 precommit → commit 준비
     - 실패 시 round++, 재시도

  4. COMMIT         // 최종 확정
     - 2/3 precommit 수집
     - 블록 애플리케이션에 deliver
     - 다음 블록으로 진행

// 검증인 투표 가중치 = 스테이킹 양
// 2/3 = voting_power 기준 (head-count 아님)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">VRF 기반 제안자 선출</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// go/beacon/api/beacon.go

// 각 에포크(600 블록)마다 VRF로 무작위 beacon 생성
// Proposer는 beacon + validator set에서 결정적으로 계산

type Beacon struct {
    Epoch  EpochTime
    Entropy []byte    // VRF output (32B)
}

// Proposer 선출
func SelectProposer(beacon *Beacon, validators []*Validator,
                     height int64, round int32) *Validator {
    // 가중치 스케일링: 스테이킹 많을수록 선출 확률 ↑
    totalPower := sumPower(validators)

    // Deterministic PRNG seed
    seed := hash(beacon.Entropy, height, round)
    r := rand.NewSource(seed).Intn(totalPower)

    // Weighted selection
    cumulative := 0
    for _, v := range validators {
        cumulative += v.Power
        if r < cumulative {
            return v
        }
    }
    return nil
}

// VRF 선출로 proposer manipulation 방지
// - VRF output은 미리 예측 불가
// - 충분한 분산성 보장`}</pre>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('full-service', codeRefs['full-service'])} />
            <span className="text-[10px] text-muted-foreground self-center">full.go · 풀 노드</span>
            <CodeViewButton onClick={() => onCodeRef('abci-mux', codeRefs['abci-mux'])} />
            <span className="text-[10px] text-muted-foreground self-center">ABCI 앱 서버</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-3">합의 서비스 카탈로그</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">서비스</th>
                <th className="border border-border px-3 py-2 text-left">책임</th>
                <th className="border border-border px-3 py-2 text-left">이벤트</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>Staking</code></td>
                <td className="border border-border px-3 py-2">위임·언본딩·보상·슬래싱</td>
                <td className="border border-border px-3 py-2">AddEscrow, Transfer, Burn</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Registry</code></td>
                <td className="border border-border px-3 py-2">노드/엔티티/런타임 등록</td>
                <td className="border border-border px-3 py-2">NodeReg, EntityReg, RuntimeReg</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Scheduler</code></td>
                <td className="border border-border px-3 py-2">컴퓨트·스토리지 위원회 구성</td>
                <td className="border border-border px-3 py-2">Election (에포크마다)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Roothash</code></td>
                <td className="border border-border px-3 py-2">Runtime 블록 커밋 검증</td>
                <td className="border border-border px-3 py-2">Finalized, Discrepancy</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Beacon</code></td>
                <td className="border border-border px-3 py-2">VRF 무작위성 생성</td>
                <td className="border border-border px-3 py-2">NewEpoch, NewBeacon</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Governance</code></td>
                <td className="border border-border px-3 py-2">프로토콜 업그레이드 투표</td>
                <td className="border border-border px-3 py-2">ProposalSubmit, Vote, Executed</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>KeyManager</code></td>
                <td className="border border-border px-3 py-2">키 매니저 등록·권한 정책</td>
                <td className="border border-border px-3 py-2">StatusUpdate, PolicyUpdate</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 서비스 구성</h3>
      </div>
      <ConsensusServicesStepViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">에포크 전이</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 에포크 = 600 블록 (약 1시간)
// 에포크 경계에서 위원회 재구성

EndBlock(height):
    if height % EPOCH_LENGTH == 0:
        // 1) 새 beacon 생성
        beacon := VRF(prevBeacon, height)

        // 2) Scheduler가 새 위원회 선출
        compute_committees := scheduler.SelectCompute(beacon, runtimes)
        storage_committees := scheduler.SelectStorage(beacon, runtimes)

        // 3) Registry 갱신 (현재 활성 노드 집합)
        registry.UpdateEpoch(epoch)

        // 4) Staking 보상 분배
        staking.DistributeRewards(validators, prev_votes)

        // 5) Governance 제안 투표 종료 처리
        governance.ProcessExpiredProposals()

        emit NewEpoch(epoch)

// Runtime 노드들은 NewEpoch 이벤트 구독
// - 자신이 새 위원회에 포함됐는지 확인
// - 포함 시 다음 라운드 참여 준비`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: CometBFT 선택 이유</p>
          <p>
            <strong>대안 비교</strong>:<br />
            - <strong>Ethereum Gasper</strong>: Probabilistic finality, slow (~15 min)<br />
            - <strong>HotStuff</strong>: 3-chain commit, linear view change<br />
            - <strong>CometBFT</strong>: 즉시 확정, 6초 블록타임, mature
          </p>
          <p className="mt-2">
            <strong>Oasis 요구사항</strong>:<br />
            ✓ 금융 앱 — 즉시 확정 필수 (reorg 절대 불가)<br />
            ✓ TEE commitment 검증 — fast finality로 slashing 신속<br />
            ✓ 작은 검증인 집합 (120) — CometBFT 통신 복잡도 감당 가능
          </p>
          <p className="mt-2">
            <strong>단점 수용</strong>:<br />
            ✗ 검증인 수 확장 한계 (~300이 실용적 최대)<br />
            ✗ Liveness 요구 — 1/3 오프라인 시 정지<br />
            ✗ 라이트 클라이언트 복잡 — committee rotation 추적 필요
          </p>
        </div>

      </div>
    </section>
  );
}
