import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import OverviewSteps from './OverviewSteps';

const STEPS = [
  { label: 'EVM 통합 3가지 접근법 비교', body: '이더리움 네이티브 / Octane(외부 geth 연결) / MiniEVM(Cosmos 모듈 내부 임베딩).\nInitia는 세 번째 방식 — EVM을 x/evm 모듈로 직접 임베딩.' },
  { label: '이더리움 네이티브: CL + Engine API + EL', body: 'Beacon Chain이 Engine API로 geth와 통신.\n가장 표준적인 구조이지만 Cosmos 생태계와 호환 불가.' },
  { label: 'Octane: CometBFT → Engine API → geth', body: 'ABCI 콜백을 Engine API로 변환하여 외부 geth를 연결.\n장점: EL 클라이언트 재활용 / 단점: IPC 통신 오버헤드.' },
  { label: 'MiniEVM: Cosmos 모듈 안에 EVM 임베딩', body: 'go-ethereum의 EVM을 x/evm Keeper 내부에서 직접 실행.\nCosmos IBC와 EVM이 같은 상태 공간 공유 — 네이티브 상호운용.' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Initia MiniEVM 개요</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Initia의 MiniEVM — Cosmos SDK 모듈로 구현된 경량 EVM.<br />
        EVM을 Cosmos 모듈 내부에 직접 임베딩하여 IBC + EVM 네이티브 통합.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <OverviewSteps step={step} />
            {onCodeRef && step === 3 && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('mini-keeper', codeRefs['mini-keeper'])} />
                <span className="text-[10px] text-muted-foreground">keeper.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="mt-6 space-y-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Initia MiniEVM 아키텍처</h3>

        {/* Initia 개요 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Initia 개요</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">Initia</span> — 롤업 상호운용을 위한 L1 블록체인. InitiaOS = Cosmos SDK + 커스터마이징
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">지원 VM</span> — MoveVM, MiniWasm, MiniEVM 세 가지 VM을 하나의 체인에서 지원
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">MiniEVM 철학</span> — "EVM as a Cosmos module". 별도 체인이나 Engine API 없이 모듈 수준 직접 통합
            </div>
          </div>
        </div>

        {/* EVM 통합 3가지 접근법 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">EVM 통합 3가지 접근법</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="rounded border-l-2 border-blue-500 bg-muted/50 p-3">
              <span className="font-medium text-foreground">1) Native Ethereum</span>
              <p className="mt-1">Beacon Chain(CL) + Engine API + geth(EL). 두 프로세스 분리 + Engine API 브릿지</p>
              <p className="mt-1 text-green-600 dark:text-green-400">장점: 최대 호환성</p>
              <p className="text-red-600 dark:text-red-400">단점: 복잡, IBC 네이티브 불가</p>
              <p className="mt-1 italic">사용: Ethereum, Berachain BeaconKit</p>
            </div>
            <div className="rounded border-l-2 border-amber-500 bg-muted/50 p-3">
              <span className="font-medium text-foreground">2) Octane / Decoupled</span>
              <p className="mt-1">CometBFT → Engine API → 외부 geth. ABCI를 EL 프로토콜로 변환</p>
              <p className="mt-1 text-green-600 dark:text-green-400">장점: geth 클라이언트 재활용</p>
              <p className="text-red-600 dark:text-red-400">단점: IPC 오버헤드, 상태 동기화 복잡</p>
            </div>
            <div className="rounded border-l-2 border-emerald-500 bg-muted/50 p-3">
              <span className="font-medium text-foreground">3) MiniEVM / Embedded</span>
              <p className="mt-1">EVM을 Cosmos SDK 모듈 <em>내부</em>에서 실행. go-ethereum을 라이브러리로 임포트, Keeper가 <code className="text-xs">evm.Call()</code> 직접 호출</p>
              <p className="mt-1 text-green-600 dark:text-green-400">장점: 네이티브 IBC 통합, 단일 상태 트리</p>
              <p className="text-red-600 dark:text-red-400">단점: 호환성 표면 축소</p>
            </div>
          </div>
        </div>

        {/* MiniEVM vs 다른 Cosmos EVM */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">MiniEVM vs 다른 Cosmos EVM</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">Evmos / Cosmos EVM</span>
              <p className="mt-1">유사한 모듈 접근법이지만 <code className="text-xs">x/vm</code>, <code className="text-xs">x/erc20</code>, <code className="text-xs">x/feemarket</code>, <code className="text-xs">x/precisebank</code> 등 4개 모듈 필요. 상대적으로 무거움</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">MiniEVM</span>
              <p className="mt-1">단일 <code className="text-xs">x/evm</code> 모듈. 기존 Cosmos 모듈(<code className="text-xs">x/auth</code>, <code className="text-xs">x/bank</code>) 재활용. 미니멀 설계 — "EVM precompile" 스타일에 가까움</p>
            </div>
          </div>
        </div>

        {/* 핵심 컴포넌트 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">핵심 컴포넌트</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">x/evm 모듈</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li><code className="text-xs">Keeper</code> — EVM 상태 관리</li>
                <li><code className="text-xs">MsgServer</code> — EVM 호출 처리</li>
                <li>StateDB 어댑터 — Cosmos KVStore → EVM StateDB</li>
                <li>Precompiles — Cosmos 기능 노출</li>
              </ul>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">Cosmos 표준 모듈 활용</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li><code className="text-xs">x/auth</code> — 계정 시퀀스(nonce)</li>
                <li><code className="text-xs">x/bank</code> — 토큰 잔액</li>
                <li><code className="text-xs">x/ibc</code> — 크로스체인 메시징</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 상태 매핑 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">상태 매핑 상세</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">주소 매핑</span>
              <p className="mt-1">EVM <code className="text-xs">hex(20 bytes)</code> ↔ Cosmos <code className="text-xs">bech32</code>(체인 접두사 포함). <code className="text-xs">x/auth</code> 통한 전단사(bijection) 수립</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">잔액</span>
              <p className="mt-1"><code className="text-xs">balance[addr] = bank.GetBalance(addr, denom)</code>. Cosmos 토큰과 공유 풀</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">논스</span>
              <p className="mt-1"><code className="text-xs">nonce[addr] = auth.GetSequence(addr)</code>. 각 EVM tx마다 증가</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">스토리지</span>
              <p className="mt-1">KVStore key = <code className="text-xs">address || slot</code>, value = 32바이트 워드. 플랫 구조 (MPT 트리 없음)</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">코드</span>
              <p className="mt-1">KVStore key = <code className="text-xs">codeHash</code>, value = 바이트코드. 내용 기반 주소 지정으로 중복 제거</p>
            </div>
          </div>
        </div>

        {/* 단일 상태 트리 이점 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">단일 상태 트리의 이점</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">EL/CL 상태 간 불일치 문제 없음</div>
            <div className="rounded bg-muted/50 p-3">IBC 토큰이 EVM에서 네이티브로 가시</div>
            <div className="rounded bg-muted/50 p-3">스테이킹 보상이 EVM 주소에 자동 반영</div>
            <div className="rounded bg-muted/50 p-3">원자적 크로스 오퍼레이션 (예: IBC + ERC20를 단일 tx에서)</div>
          </div>
        </div>

        {/* 프리컴파일 기반 Cosmos 접근 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">프리컴파일 기반 Cosmos 접근</h4>
          <div className="rounded bg-muted/50 p-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">ICosmos 인터페이스 (Solidity)</span>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><code className="text-xs">execute_cosmos(string memory msg) external</code> — Cosmos 메시지 실행</li>
              <li><code className="text-xs">query_cosmos(string memory req) external view returns (string memory)</code> — Cosmos 상태 쿼리</li>
              <li><code className="text-xs">to_denom(address token) external view returns (string memory)</code> — ERC20 → denom 변환</li>
              <li><code className="text-xs">to_erc20(string memory denom) external view returns (address)</code> — denom → ERC20 변환</li>
            </ul>
            <p className="mt-2">고정 주소의 ICosmos 프리컴파일로 IBC 전송, 스테이킹 등을 컨트랙트에서 직접 호출</p>
          </div>
        </div>

        {/* 유스케이스 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">유스케이스</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">Initia 기반 롤업 (MiniEVM 활용)</div>
            <div className="rounded bg-muted/50 p-3">네이티브 IBC를 갖춘 EVM dApp</div>
            <div className="rounded bg-muted/50 p-3">크로스 VM 합성 (EVM + Move)</div>
            <div className="rounded bg-muted/50 p-3">상호운용 가능한 스테이블 스왑</div>
          </div>
        </div>

        {/* 비교표 */}
        <div className="rounded-lg border bg-card p-4 overflow-x-auto">
          <h4 className="text-sm font-semibold mb-3">비교</h4>
          <table className="w-full text-xs text-muted-foreground">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1.5 pr-4 font-medium text-foreground"></th>
                <th className="text-left py-1.5 pr-4 font-medium text-foreground">MiniEVM</th>
                <th className="text-left py-1.5 pr-4 font-medium text-foreground">Evmos</th>
                <th className="text-left py-1.5 font-medium text-foreground">Berachain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="py-1.5 pr-4 font-medium text-foreground">아키텍처</td><td className="py-1.5 pr-4">Module</td><td className="py-1.5 pr-4">Module</td><td className="py-1.5">Engine API</td></tr>
              <tr><td className="py-1.5 pr-4 font-medium text-foreground">EVM 소스</td><td className="py-1.5 pr-4">go-ethereum</td><td className="py-1.5 pr-4">go-ethereum</td><td className="py-1.5">reth / geth</td></tr>
              <tr><td className="py-1.5 pr-4 font-medium text-foreground">CL 엔진</td><td className="py-1.5 pr-4">CometBFT</td><td className="py-1.5 pr-4">CometBFT</td><td className="py-1.5">BeaconKit</td></tr>
              <tr><td className="py-1.5 pr-4 font-medium text-foreground">IBC 네이티브</td><td className="py-1.5 pr-4">Yes</td><td className="py-1.5 pr-4">Yes</td><td className="py-1.5">No (브릿지 필요)</td></tr>
              <tr><td className="py-1.5 pr-4 font-medium text-foreground">상태 트리</td><td className="py-1.5 pr-4">Shared</td><td className="py-1.5 pr-4">Shared</td><td className="py-1.5">Separate</td></tr>
              <tr><td className="py-1.5 pr-4 font-medium text-foreground">가스 모델</td><td className="py-1.5 pr-4">Cosmos + EVM</td><td className="py-1.5 pr-4">EIP-1559</td><td className="py-1.5">Hybrid</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
