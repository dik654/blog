import ConsensusServicesViz from './viz/ConsensusServicesViz';
import ConsensusServicesStepViz from './viz/ConsensusServicesStepViz';
import BftRoundViz from './viz/BftRoundViz';
import VrfProposerViz from './viz/VrfProposerViz';
import EpochTransitionViz from './viz/EpochTransitionViz';
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
      </div>
      <div className="not-prose mb-4"><BftRoundViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">VRF 기반 제안자 선출</h3>
      </div>
      <div className="not-prose mb-4"><VrfProposerViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

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
      </div>
      <div className="not-prose mb-4"><EpochTransitionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

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
