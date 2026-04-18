import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import MerkleDetailViz from './viz/MerkleDetailViz';
import { MERKLE_STEPS } from './MerkleStageData';

export default function MerkleStage({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);

  return (
    <section id="merkle-stage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MerkleStage 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          MerkleStage는 파이프라인의 마지막 검증 관문이다.<br />
          ExecutionStage가 생성한 상태 변경이 올바른지, 상태 루트(state root)를 계산해 블록 헤더와 대조한다.<br />
          불일치하면 TX 실행 결과가 잘못된 것이므로 동기화가 중단된다.
        </p>

        {/* ── MPT 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">World State Trie — MPT(Merkle Patricia Trie) 구조</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-pink-500 mb-2">World State 2-tier MPT 구조</p>
            <div className="text-sm text-foreground/70 space-y-1.5">
              <p><strong>계정 트라이</strong>: <code>keccak256(address)</code> &rarr; <code>AccountTrieNode</code></p>
              <p><strong>스토리지 트라이</strong>: <code>keccak256(slot_key)</code> &rarr; value (각 계정마다 1개)</p>
              <p><strong>StateRoot</strong> = header.state_root = "2-tier 트리의 루트의 루트"</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">AccountTrieNode</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">nonce</code>
                <span className="text-foreground/60 text-xs">u64</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">balance</code>
                <span className="text-foreground/60 text-xs">U256</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">storage_root</code>
                <span className="text-foreground/60 text-xs">B256 -- 이 계정의 스토리지 트라이 루트</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">code_hash</code>
                <span className="text-foreground/60 text-xs">B256 -- 컨트랙트 바이트코드 해시</span>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          이더리움 State는 약 <strong>2억 5천만 계정</strong>을 포함하고, 각 컨트랙트는 수천~수백만 스토리지 슬롯을 가질 수 있다.<br />
          매 블록마다 전체 MPT를 재해싱하는 것은 경제적으로 불가능 — 수 기가바이트 크기의 트리.<br />
          그래서 <strong>변경된 경로만 재해싱</strong>하는 증분 알고리즘이 필수다.
        </p>

        {/* ── PrefixSet ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PrefixSet — 변경된 트리 경로 인덱스</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">PrefixSet — 변경된 키 접두사의 정렬된 집합</p>
            <div className="text-sm text-foreground/70 space-y-1">
              <p><code>keys: Vec&lt;Nibbles&gt;</code> — Nibbles = 4비트 단위 키 표현 (MPT 기본 단위)</p>
            </div>
          </div>
          <div className="rounded-lg border border-amber-400/40 bg-amber-50/50 dark:bg-amber-950/20 p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">예시: 블록 N에서 변경이 있는 경우</p>
            <div className="text-xs text-foreground/60 space-y-1.5">
              <p>계정 0xAAAA... 잔고 변경, 계정 0xBBBC... 스토리지 슬롯 0x01/0x05 변경</p>
              <p>계정 트라이 PrefixSet: <code>[0xAAAA..., 0xBBBC...]</code></p>
              <p>0xBBBC 스토리지 트라이 PrefixSet: <code>[0x01, 0x05]</code></p>
            </div>
            <div className="mt-2 pt-2 border-t border-border/30 text-xs text-foreground/50">
              <code>provider.changed_prefix_sets(checkpoint, target)</code> &rarr; 범위 내 모든 변경을 통합한 PrefixSet 반환
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Geth와의 결정적 차이: 증분 계산.</strong><br />
          Geth는 매 블록마다 dirty 노드(변경된 트라이 노드)를 전부 재해싱한다.<br />
          Reth는 <code>PrefixSet</code>에 기록된 변경 경로만 재해싱한다.<br />
          예를 들어 100만 계정 중 1,000개만 변경되면, 1,000개 경로의 서브트리만 재계산한다. 전체 재계산 대비 10~100배 빠르다.
        </p>

        {/* ── overlay_root ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateRoot::overlay_root() — 2-tier 증분 계산</h3>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-indigo-500 mb-3">overlay_root() — 2-tier 증분 계산</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span className="text-foreground/70">변경된 계정 경로를 <code>TrieWalker</code>로 순회 (PrefixSet 정렬 &rarr; 순차 스캔)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="text-foreground/70">스토리지 변경이 있으면 <code>compute_storage_root_incremental()</code> 병렬 호출, 없으면 기존 루트 재사용</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span className="text-foreground/70">업데이트된 <code>AccountTrieNode {'{'} storage_root, ... {'}'}</code> 구성</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">4</span>
              <span className="text-foreground/70">계정 트라이의 해당 경로만 <code>account_walker.update()</code>로 재해싱</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">5</span>
              <span className="text-foreground/70"><code>finalize_root()</code> — 변경된 경로를 따라 상위 노드까지 재해싱 &rarr; 최종 StateRoot 반환</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>rayon</code>으로 계정별 <code>StorageRoot</code>(각 계정의 스토리지 트라이 루트)를 병렬 계산한다.<br />
          계정 A의 스토리지와 계정 B의 스토리지는 독립적이므로 완벽한 병렬화가 가능하다.<br />
          변경된 계정이 1만 개여도 16코어에서 수 초 내에 모든 StorageRoot를 재계산 완료.
        </p>

        {/* ── 검증 & 실패 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">최종 검증 — state_root 불일치 시</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-pink-400/40 bg-pink-50/30 dark:bg-pink-950/10 p-4">
            <p className="text-xs font-semibold text-pink-500 mb-2">최종 검증: state_root 대조</p>
            <p className="text-sm text-foreground/70 mb-2">
              <code>state_root != target_header.state_root</code> &rarr; <code>StageError::Validation</code> + <code>ConsensusError::BodyStateRootDiff</code>
            </p>
            <p className="text-xs font-semibold text-foreground/60 mb-1.5">불일치 시 Pipeline 대응:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-foreground/60">
              <li><code>StageError::Validation</code> 감지 &rarr; Unwind 시그널 전환</li>
              <li>역순 unwind: Merkle &rarr; Execution &rarr; Senders &rarr; Bodies &rarr; Headers</li>
              <li><code>unwind_to = target - 1</code> (문제 블록 직전까지)</li>
              <li>문제 블록을 <code>bad_block</code>으로 기록, 해당 피어 ban</li>
              <li>Pipeline 재시작 &rarr; 다른 피어에게 같은 범위 재요청</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <p className="text-xs font-semibold text-foreground/60 mb-1">불일치 가능 원인</p>
            <div className="text-xs text-foreground/50 space-y-0.5">
              <p>- 피어가 보낸 TX가 잘못됨 (tx_root 검증 통과 후에도 이론적 가능)</p>
              <p>- revm과 Geth EVM의 구현 차이 (합의 버그)</p>
              <p>- 하드포크 활성화 블록 번호 오류 (chain_spec 설정 실수)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          state_root 불일치는 <strong>전체 동기화를 중단시키는 심각한 오류</strong>다.<br />
          여기까지 오면 이전 3개 Stage(Headers, Bodies, Senders)는 이미 "정답"을 저장한 상태다.<br />
          따라서 실행 결과(ExecutionStage의 BundleState)나 트라이 계산(MerkleStage 자체) 중 하나가 틀렸다는 뜻.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 증분 재계산 이론: 10~100배 가속의 근거</p>
          <p className="mt-2">
            한 블록의 평균 변경 통계 (메인넷 측정):<br />
            - 변경된 계정: ~500~2,000개 (전체 2억 5천만 중)<br />
            - 변경된 스토리지 슬롯: ~1,000~5,000개<br />
            - 생성된 컨트랙트: ~10~50개
          </p>
          <p className="mt-2">
            증분 계산 비용 분석:<br />
            - 전체 재계산: 2억 5천만 × keccak256 호출 ≈ 수백 초<br />
            - 증분 재계산: 약 2천 경로 × 평균 트라이 깊이(~7) × keccak256 ≈ 1만 5천 해시 ≈ 수 ms<br />
            - 가속비 ≈ 약 10,000~100,000배 (이론치), 실제로는 DB 읽기 오버헤드로 10~100배
          </p>
          <p className="mt-2">
            <strong>파이프라인 검증의 마무리:</strong><br />
            MerkleStage 통과 = 블록의 모든 TX가 올바르게 실행되었음을 암호학적으로 증명.<br />
            state_root = 과거 모든 블록의 상태 변경이 누적된 결과. 한 번의 검증으로 전체 역사가 검증됨.<br />
            이것이 머클 트리가 블록체인의 심장인 이유.
          </p>
        </div>
      </div>

      <div className="not-prose mb-6"><MerkleDetailViz /></div>

      {/* Step-by-step interactive cards */}
      <h3 className="text-lg font-semibold mb-3">검증 3단계</h3>
      <div className="not-prose space-y-2 mb-6">
        {MERKLE_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-pink-500/50 bg-pink-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-pink-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10 leading-relaxed">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('merkle-stage', codeRefs['merkle-stage'])} />
        <span className="text-[10px] text-muted-foreground self-center">MerkleStage::execute()</span>
      </div>
    </section>
  );
}
