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

        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">CreateSubnetParams</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="rounded bg-muted p-2"><code>Parent</code> — <span className="text-muted-foreground">SubnetID</span></div>
            <div className="rounded bg-muted p-2"><code>Name</code> — <span className="text-muted-foreground">string</span></div>
            <div className="rounded bg-muted p-2"><code>MinValidators</code> — <span className="text-muted-foreground">uint64</span></div>
            <div className="rounded bg-muted p-2"><code>MinValidatorStake</code> — <span className="text-muted-foreground">TokenAmount</span></div>
            <div className="rounded bg-muted p-2"><code>BottomupCheckPeriod</code> — <span className="text-muted-foreground">ChainEpoch</span></div>
            <div className="rounded bg-muted p-2"><code>TopdownCheckPeriod</code> — <span className="text-muted-foreground">ChainEpoch</span></div>
            <div className="rounded bg-muted p-2"><code>Consensus</code> — <span className="text-muted-foreground">ConsensusType</span></div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-xs font-semibold mb-1">1. Deploy</div>
            <p className="text-[11px] text-muted-foreground">부모 체인에 <code>SubnetActor</code> 배포. 합의 타입, 경제 파라미터, 최소 스테이크 설정</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-xs font-semibold mb-1">2. Register</div>
            <p className="text-[11px] text-muted-foreground">Gateway에 등록, 고유 Subnet ID 부여, 검증자 모집 시작</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-xs font-semibold mb-1">3. Join</div>
            <p className="text-[11px] text-muted-foreground"><code>JoinSubnet()</code> — 검증자가 FIL 스테이크, 검증자 세트 등록, 제네시스 파라미터 배포</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-xs font-semibold mb-1">4. Bootstrap</div>
            <p className="text-[11px] text-muted-foreground">검증자 노드 시작, P2P 네트워크 구성, 합의 활성화, 블록 생산 개시</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-xs font-semibold mb-1">5. Active</div>
            <p className="text-[11px] text-muted-foreground">합의 + 체크포인트 운영. Kill → Liquidate로 종료 가능</p>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">합의 옵션</h4>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li><strong>Tendermint/CometBFT</strong> — fast finality</li>
              <li><strong>Mir</strong> — high throughput BFT</li>
              <li><strong>Narwhal/Bullshark</strong> — DAG-based</li>
              <li><strong>Custom</strong> — 임의 합의 모듈</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">검증자 경제</h4>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>검증자당 최소 스테이크</li>
              <li>서브넷 블록 보상 수령</li>
              <li>로컬 가스 수수료 수입</li>
              <li>부정행위 시 슬래싱</li>
              <li>부모 체인으로 인출</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">서브넷 파라미터</h4>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>블록 타임: <code>1s ~ 60s</code></li>
              <li>최대 블록 크기</li>
              <li>가스 한도</li>
              <li>finality 기간</li>
              <li>슬래싱 조건</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Subnet 생성: <strong>CreateSubnet → validators join → bootstrap → active</strong>.<br />
          consensus 선택 자유 (Tendermint, Mir, Narwhal+Bullshark, custom).<br />
          validator stake + slashing economics.
        </p>
      </div>
    </section>
  );
}
