import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ArchSteps from './ArchSteps';

const STEPS = [
  { label: 'Cosmos 상태와 EVM 상태 매핑 전체', body: 'MiniEVM은 Ethereum의 StateDB를 Cosmos KVStore로 대체.\n같은 상태 공간에서 IBC와 EVM이 공존.' },
  { label: '상태 저장소: MPT → IAVL Tree', body: 'Ethereum: Patricia Merkle Trie + LevelDB.\nMiniEVM: Cosmos KVStore + IAVL Tree. Merkle 증명 방식은 다르지만 동일한 상태 무결성 보장.' },
  { label: '계정: Account → x/auth + x/bank', body: 'EVM address(20byte) ↔ Cosmos address(bech32) 매핑.\nnonce → x/auth sequence number, balance → x/bank 잔액.' },
  { label: 'Storage: KVStore 직접 저장', body: 'key = address + slot, value = bytes32.\nEthereum의 storageRoot 트리 구조 대신 플랫 KV 매핑.' },
  { label: 'Code: KVStore에 저장', body: 'key = codeHash, value = bytecode.\n동일한 Solidity 바이트코드를 그대로 실행 가능.' },
];

const CODE_MAP = ['mini-statedb', 'mini-statedb', 'mini-statedb', 'mini-statedb', 'mini-statedb'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Architecture({ onCodeRef }: Props) {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 매핑 & 실행 흐름</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        이더리움 EVM 상태를 Cosmos KVStore로 어댑팅하는 핵심 메커니즘.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <ArchSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">statedb.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>

      <div className="mt-6 space-y-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">상태 매핑 상세 구현</h3>

        {/* Ethereum vs Cosmos 상태 모델 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">Ethereum vs Cosmos 상태 모델</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">Ethereum</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li>Trie: Merkle Patricia Trie (MPT)</li>
                <li>Root: 32바이트 state root (각 블록 헤더)</li>
                <li>계정: <code className="text-xs">{'{nonce, balance, codeHash, storageRoot}'}</code></li>
                <li>Storage: 계정별 MPT (<code className="text-xs">slot → value</code>)</li>
                <li>Backend: LevelDB / PebbleDB</li>
              </ul>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">Cosmos</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li>Trie: IAVL+ Tree (균형 이진 트리 + Merkle)</li>
                <li>Root: <code className="text-xs">app_hash</code> (각 블록)</li>
                <li>Multistore: 여러 이름 기반 KVStore</li>
                <li>Backend: goleveldb, rocksdb, tm-db</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 매핑 선택지 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">매핑 접근법 선택</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">접근법 1: KVStore 위에 MPT 에뮬레이션</span>
              <p className="mt-1">Cosmos KVStore를 리프 저장소로 사용, 필요 시 MPT 재구성</p>
              <p className="mt-1 text-green-600 dark:text-green-400">장점: Ethereum state root 계산 가능</p>
              <p className="text-red-600 dark:text-red-400">단점: 비용 높은 재계산</p>
            </div>
            <div className="rounded border-l-2 border-emerald-500 bg-muted/50 p-3">
              <span className="font-medium text-foreground">접근법 2: 플랫 KV 매핑 (MiniEVM 선택)</span>
              <p className="mt-1">각 storage slot → KVStore 엔트리 직접 매핑. Ethereum state root 형식 포기</p>
              <p className="mt-1 text-green-600 dark:text-green-400">장점: 빠르고 단순</p>
              <p className="text-red-600 dark:text-red-400">단점: 메인넷 EVM과 state root 형식 상이</p>
            </div>
          </div>
        </div>

        {/* StateDB 구현 */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">MiniEVM StateDB 구현</h4>
          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">StateDB 구조체</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li><code className="text-xs">ctx sdk.Context</code> — Cosmos 컨텍스트</li>
                <li><code className="text-xs">kvStore storetypes.KVStore</code> — 상태 저장소</li>
                <li><code className="text-xs">accounts map[common.Address]*StateObject</code> — 계정 캐시</li>
                <li><code className="text-xs">snapshots []*Snapshot</code> — 스냅샷 스택</li>
                <li><code className="text-xs">logs []*ethtypes.Log</code> — EVM 로그</li>
              </ul>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">vm.StateDB 인터페이스 구현</span>
              <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-1">
                <span><code className="text-xs">GetBalance</code>, <code className="text-xs">AddBalance</code>, <code className="text-xs">SubBalance</code></span>
                <span><code className="text-xs">GetNonce</code>, <code className="text-xs">SetNonce</code></span>
                <span><code className="text-xs">GetCode</code>, <code className="text-xs">SetCode</code></span>
                <span><code className="text-xs">GetCommittedState</code>, <code className="text-xs">GetState</code>, <code className="text-xs">SetState</code></span>
                <span><code className="text-xs">CreateAccount</code>, <code className="text-xs">HasSuicided</code></span>
                <span><code className="text-xs">Snapshot</code>, <code className="text-xs">RevertToSnapshot</code></span>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Key Layout */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">스토리지 키 레이아웃</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">Storage</span>
              <p className="mt-1">key: <code className="text-xs">"s" || address(20B) || slot(32B)</code></p>
              <p>value: <code className="text-xs">word(32B)</code></p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">Code</span>
              <p className="mt-1">key: <code className="text-xs">"c" || codeHash(32B)</code></p>
              <p>value: <code className="text-xs">bytecode</code> (가변 길이)</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">Code Hash</span>
              <p className="mt-1">key: <code className="text-xs">"h" || address(20B)</code></p>
              <p>value: <code className="text-xs">codeHash(32B)</code></p>
            </div>
          </div>
        </div>

        {/* Balance & Nonce */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">잔액 & 논스 위임</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">잔액 → x/bank</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li><code className="text-xs">GetBalance(addr)</code> → <code className="text-xs">bank.GetBalance(addr, "uinit")</code></li>
                <li><code className="text-xs">AddBalance(addr, amount)</code> → <code className="text-xs">bank.MintCoins</code> + <code className="text-xs">bank.SendCoins</code></li>
              </ul>
              <p className="mt-1">EVM value 전송과 IBC 전송 모두 bank 잔액을 갱신 — 동일 인터페이스로 일관성 유지</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">논스 → x/auth</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li><code className="text-xs">GetNonce(addr)</code> → <code className="text-xs">auth.GetAccount(addr).GetSequence()</code></li>
                <li><code className="text-xs">SetNonce(addr, n)</code> → <code className="text-xs">acc.SetSequence(n)</code> + <code className="text-xs">auth.SetAccount(acc)</code></li>
              </ul>
              <p className="mt-1">Cosmos SDK sequence number가 곧 EVM nonce</p>
            </div>
          </div>
        </div>

        {/* Snapshot & Determinism */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">스냅샷 & 결정론적 접근</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">스냅샷 메커니즘</span>
              <p className="mt-1">EVM 롤백을 위해 Cosmos의 <code className="text-xs">CacheContext</code> 활용. 성공 시 <code className="text-xs">writeCache()</code> 호출로 커밋, 실패 시 폐기. 중첩 <code className="text-xs">CacheContext</code>로 다단계 스냅샷 구현 — 각 <code className="text-xs">Snapshot()</code> 호출이 새 레이어 생성</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">결정론적 상태 접근</span>
              <p className="mt-1">EVM 실행은 검증자 간 결정론적이어야 함. 키 순서가 가스 계산에 영향</p>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li>KVStore 내장 순서 활용</li>
                <li>사전식(lexicographic) 키 정렬</li>
                <li>map 순회 금지 (정의되지 않은 순서)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Commit & Performance */}
        <div className="rounded-lg border bg-card p-4">
          <h4 className="text-sm font-semibold mb-3">커밋 & 성능</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">커밋 단계</span>
              <ol className="mt-1 list-decimal list-inside space-y-0.5">
                <li>스테이징된 StateDB 변경 적용</li>
                <li>Cosmos KVStore에 기록</li>
                <li>EVM 로그 → Cosmos 이벤트 변환</li>
                <li>IAVL 트리 갱신</li>
              </ol>
              <p className="mt-1">최종 state root는 Ethereum MPT가 아닌 IAVL에서 계산 — Cosmos 라이트 클라이언트로 검증 가능</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <span className="font-medium text-foreground">성능</span>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li>IAVL: O(log n) 읽기/쓰기 (MPT와 유사)</li>
                <li>플랫 스토리지 키: 슬롯당 단일 조회</li>
                <li>캐시 컨텍스트: 최소 오버헤드</li>
              </ul>
              <p className="mt-2 font-medium text-foreground">일반적 성능 수치</p>
              <ul className="mt-1 list-disc list-inside space-y-0.5">
                <li>단순 EVM 전송: ~50K gas, ~1ms</li>
                <li>복잡한 DeFi 컨트랙트: ~500K gas, ~10ms</li>
                <li>geth와 대등한 수준</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
