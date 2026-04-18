import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Checkpointing({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="checkpointing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인팅 & 크로스 서브넷 메시지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('ipc-subnet', codeRefs['ipc-subnet'])} />
          <span className="text-[10px] text-muted-foreground self-center">SubmitCheckpoint()</span>
        </div>
        <p>
          서브넷 상태 해시를 주기적으로 메인넷에 커밋 → 보안 앵커 역할.<br />
          체크포인트 = (서브넷ID, 에폭, 상태루트, 크로스메시지 머클루트)
        </p>
        <p>
          검증자 2/3 이상 서명이 있어야 체크포인트가 수락됨.<br />
          크로스 서브넷 메시지: 서브넷 간 FIL 이동이나 메시지 전달이 가능
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 계층적 보안 모델</strong> — 서브넷이 서브넷을 생성할 수도 있음(재귀적).<br />
          최종 보안 앵커는 항상 Filecoin 메인넷. 계층 깊이에 상관없이 메인넷의 finality를 상속
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Checkpointing &amp; Cross-Subnet Messages</h3>

        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">BottomUpCheckpoint 구조체</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <div className="rounded bg-muted p-2"><code>SubnetID</code> — <span className="text-muted-foreground">서브넷 식별자</span></div>
            <div className="rounded bg-muted p-2"><code>Epoch</code> — <span className="text-muted-foreground">ChainEpoch</span></div>
            <div className="rounded bg-muted p-2"><code>StateRoot</code> — <span className="text-muted-foreground">cid.Cid</span></div>
            <div className="rounded bg-muted p-2"><code>CrossMessagesRoot</code> — <span className="text-muted-foreground">cid.Cid</span></div>
            <div className="rounded bg-muted p-2"><code>Proofs</code> — <span className="text-muted-foreground">MultiSignature</span></div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Bottom-up Checkpoint</h4>
            <p className="text-xs text-muted-foreground mb-2">child → parent 제출. 서브넷 상태 앵커링</p>
            <ul className="text-xs space-y-0.5 list-disc list-inside">
              <li>주기적 제출 (예: 매 100 에폭)</li>
              <li>검증자 2/3+ 서명 필수</li>
              <li>상태 루트 + 크로스 메시지 루트 포함</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Top-down Messages</h4>
            <p className="text-xs text-muted-foreground mb-2">parent → child 전달</p>
            <ul className="text-xs space-y-0.5 list-disc list-inside">
              <li>서브넷이 부모 메시지 수신</li>
              <li>자금 이체 (FIL transfer)</li>
              <li>크로스 체인 호출</li>
            </ul>
          </div>
        </div>

        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">Cross-Subnet 메시지 흐름 (A → B, 동일 부모)</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
            <div className="rounded bg-muted p-2 text-center"><strong>1.</strong> subnet_A에서 <code>Release()</code> 호출, FIL 락</div>
            <div className="rounded bg-muted p-2 text-center"><strong>2.</strong> 체크포인트로 메인넷에 제출</div>
            <div className="rounded bg-muted p-2 text-center"><strong>3.</strong> 메인넷 Gateway가 라우팅</div>
            <div className="rounded bg-muted p-2 text-center"><strong>4.</strong> subnet_B Gateway 수신</div>
            <div className="rounded bg-muted p-2 text-center"><strong>5.</strong> subnet_B에서 <code>Release()</code>, FIL 릴리스. 소요: ~2 체크포인트 주기</div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Finality 상속 &amp; 보안</h4>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li><strong>서브넷 로컬</strong> — 예: Tendermint 1s finality</li>
              <li><strong>부모 체크포인트 후</strong> — 부모의 finality 상속</li>
              <li><strong>메인넷 앵커</strong> — EC 7.5h 또는 F3 2~5min</li>
              <li>보안 = <code>min(child, parent)</code> 합성</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">장단점</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="font-medium mb-1">장점</p>
                <ul className="space-y-0.5 list-disc list-inside text-muted-foreground">
                  <li>특화 체인 구성</li>
                  <li>합성 보안</li>
                  <li>계층적 확장</li>
                  <li>합의 유연성</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">단점</p>
                <ul className="space-y-0.5 list-disc list-inside text-muted-foreground">
                  <li>체크포인트 지연</li>
                  <li>검증자 조율 비용</li>
                  <li>설계 복잡도</li>
                  <li>크로스 서브넷 레이턴시</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Checkpointing: <strong>subnet state → parent anchor + cross-messages</strong>.<br />
          bottom-up (commit) + top-down (command) messages.<br />
          hierarchical security: local + parent + mainnet anchor.
        </p>
      </div>
    </section>
  );
}
