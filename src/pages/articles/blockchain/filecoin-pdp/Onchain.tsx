import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Onchain({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="onchain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">온체인 검증 &amp; 스케줄링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PDP Actor가 DRAND 비콘으로 챌린지 에폭을 결정. SP가 SubmitProof 메시지로 제출.<br />
          SHA256 재계산 → 머클 루트 복원 → 등록 루트와 대조. 가스 비용이 낮음
        </p>
        <div className="not-prose flex flex-wrap gap-2 mt-4">
          <CodeViewButton onClick={() => onCodeRef('pdp-main', codeRefs['pdp-main'])} />
          <span className="text-[10px] text-muted-foreground self-center">VerifyOnChain()</span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">PDP Actor 상세</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">State (온체인 상태)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs bg-background px-1 rounded">datasets</code>: dataset_id → Merkle root</li>
              <li><code className="text-xs bg-background px-1 rounded">proving_obligations</code>: SP → datasets</li>
              <li><code className="text-xs bg-background px-1 rounded">penalty_accumulators</code>: 누적 패널티</li>
              <li><code className="text-xs bg-background px-1 rounded">challenge_schedules</code>: 챌린지 일정</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Methods</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs bg-background px-1 rounded">RegisterDataset(root, sla)</code> — SP가 데이터 증명 약속 + 담보 예치</li>
              <li><code className="text-xs bg-background px-1 rounded">SubmitProof(dataset_id, proof)</code> — 온체인 검증 후 보상/슬래싱</li>
              <li><code className="text-xs bg-background px-1 rounded">Challenge(dataset_id)</code> — SP에게 증명 강제</li>
              <li><code className="text-xs bg-background px-1 rounded">Terminate(dataset_id)</code> — 의무 종료 + 잔여 담보 반환</li>
            </ul>
          </div>
        </div>
        <div className="bg-muted rounded-lg p-4 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-2">Verification 로직 (Solidity/FVM)</h4>
          <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
            <li><code className="text-xs bg-background px-1 rounded">leafHash = sha256(proof.leafData)</code> 계산 후 <code className="text-xs bg-background px-1 rounded">proof.leafHash</code>와 비교</li>
            <li>Merkle path를 순회하며 <code className="text-xs bg-background px-1 rounded">sha256(computed, proof.path[i])</code> 또는 역순 결합</li>
            <li>최종 computed가 <code className="text-xs bg-background px-1 rounded">datasets[id].root</code>와 일치하는지 확인</li>
          </ol>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Economic</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>SP stake: N FIL per TiB</li>
              <li>reward: <code className="text-xs bg-background px-1 rounded">price x time</code></li>
              <li>실패 시 slash</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Batching</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>한 tx에 다수 proof 포함</li>
              <li>gas amortization</li>
              <li>SP 효율성 극대화</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Integration</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Storacha: first user</li>
              <li>Onchain Cloud: platform</li>
              <li>2024 launch</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          PDP Actor: <strong>FVM smart contract + reward/slash</strong>.<br />
          on-chain verify (Solidity/FVM), DRAND challenges.<br />
          Storacha first adopter, Onchain Cloud integrated.
        </p>
      </div>
    </section>
  );
}
