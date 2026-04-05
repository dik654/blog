import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import TrieCalculationViz from './viz/TrieCalculationViz';
import type { CodeRef } from '@/components/code/types';
import { TRIE_CHALLENGES, PERF_COMPARISON } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeChallenge, setActiveChallenge] = useState(0);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">트라이 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          이더리움의 블록 유효성은 상태 루트(state root)의 일치 여부로 결정된다.<br />
          상태 루트는 모든 계정과 스토리지를 포함하는 Merkle-Patricia Trie의 루트 해시다.<br />
          블록을 실행한 뒤 계산한 상태 루트가 블록 헤더의 값과 다르면, 그 블록은 무효다.
        </p>
        <p className="leading-7">
          문제는 <strong>성능</strong>이다.<br />
          메인넷에 약 2.5억 개 계정이 존재하고, 각 계정은 스토리지 trie를 가질 수 있다.<br />
          매 블록마다 이 거대한 trie 전체를 재계산하면 블록 시간(12초)을 초과한다.<br />
          핵심은 "변경된 부분만 재해시"하는 것이다.
        </p>

        {/* ── MPT 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle Patricia Trie 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MPT = Merkle + Patricia + Trie
// - Merkle: 각 노드에 자식의 해시 포함 → 변경 감지 가능
// - Patricia: 경로 압축 (공통 prefix 1개 노드로)
// - Trie: prefix-tree 탐색

// 이더리움 MPT의 3가지 노드 타입:
pub enum TrieNode {
    /// Leaf 노드 — 실제 값 저장
    Leaf {
        key: Nibbles,     // 남은 경로
        value: Bytes,     // RLP 인코딩된 값
    },
    /// Extension 노드 — 경로 압축 (여러 키 공유)
    Extension {
        key: Nibbles,           // 공유 prefix
        child: B256,            // 자식 노드 해시
    },
    /// Branch 노드 — 16진수 트리 (2^4 = 16 갈래)
    Branch {
        children: [Option<B256>; 16],  // 0x0 ~ 0xf 자식
        value: Option<Bytes>,           // terminal 값 (드물게)
    },
}

// Nibbles: 4비트 단위 키 표현
// keccak256(address) = 32바이트 → 64 nibbles
// 각 nibble(0x0~0xf)이 Branch 노드의 자식 인덱스

// 예시: keccak256(0xAbCd...) = 0xa7b3...
// 경로: a → 7 → b → 3 → ... → leaf`}
        </pre>
        <p className="leading-7">
          MPT는 <strong>3가지 노드 타입</strong>으로 키-값 매핑 표현.<br />
          Nibble(4비트)이 기본 단위 — 16진수 keccak256 해시가 자연스럽게 fit.<br />
          Patricia 압축으로 "같은 prefix 공유하는 여러 키"가 1개 Extension 노드로 표현.
        </p>

        {/* ── 2-tier 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">이더리움 State Trie — 2-tier 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 최상위: Account Trie
//   keccak256(address) → TrieAccount
//
//                   state_root
//                        │
//           ┌────────────┼────────────┐
//        Account      Account      Account
//         (A)          (B)          (C)
//          │
//    ┌─────┴─────┐
//    │  nonce    │
//    │  balance  │
//    │  code_hash│
//    │  storage_root ← 계정마다 별도 storage trie 루트
//    └───────────┘
//          │
//      Storage Trie
//      keccak256(slot_key) → value
//          │
//      ┌───┴───┐
//     Slot   Slot
//
// 특징:
// 1. Account Trie는 전역 1개 — 모든 계정을 포함
// 2. Storage Trie는 계정당 1개 — EOA는 비어있음
// 3. 컨트랙트는 storage trie root가 포함되어 account 해시에 영향

// 크기:
// - Account Trie: ~2.5억 계정 × ~70바이트 = ~17GB
// - Storage Trie: 수천만 계정 × 가변 크기 = ~200GB 이상
// - 총 state size: 압축 없이 ~250GB`}
        </pre>
        <p className="leading-7">
          2-tier 구조의 핵심: <strong>storage_root가 account 노드에 포함</strong>.<br />
          컨트랙트 스토리지 변경 → storage_root 변경 → account 해시 변경 → state_root 변경.<br />
          이 해시 체인 덕분에 state_root 하나로 전체 상태 무결성 검증 가능.
        </p>

        {/* ── HashBuilder ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HashBuilder — Trie 구축 엔진</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 정렬된 key 순서로 trie 구성
pub struct HashBuilder {
    /// 현재 처리 중인 스택 (부모에서 자식으로)
    stack: Vec<HashBuilderValue>,
    /// 그룹 마스크 — 어느 nibble에 자식이 있는지
    groups: Vec<TrieMask>,
    /// 트리 마스크 — 어느 자식이 branch/leaf인지
    tree_masks: Vec<TrieMask>,
    /// 해시 마스크 — 어느 자식이 해시 저장 가능한지
    hash_masks: Vec<TrieMask>,
}

impl HashBuilder {
    /// 새 leaf 추가 (key는 정렬 순서로 입력되어야 함)
    pub fn add_leaf(&mut self, key: Nibbles, value: &[u8]) {
        // 1. 이전 key와의 공통 prefix 찾기
        // 2. 공통 prefix 이후 diverge 지점에서 branch 생성
        // 3. stack을 정리하며 hash 계산
        self.update_from(key);
        self.push_leaf(key, value);
    }

    /// 최종 root 해시 반환 (stack 정리)
    pub fn root(mut self) -> B256 {
        self.finalize();
        self.stack[0].hash()
    }
}

// key 정렬의 이유:
// - 정렬된 입력 → 순차적 trie 구성 가능
// - backtrack 없음 → O(N) 시간 복잡도
// - 메모리 사용 최소 (스택에 현재 경로만)`}
        </pre>
        <p className="leading-7">
          <code>HashBuilder</code>는 <strong>정렬된 leaf 입력</strong>을 받아 순차적으로 trie 구성.<br />
          각 leaf 추가 시 이전 key와의 공통 prefix 비교 → branch 노드 자동 생성.<br />
          O(N) 시간 복잡도 — N개 leaf 처리에 N번의 hash 계산.
        </p>
      </div>

      {/* 도전과제 인터랙티브 카드 */}
      <h3 className="text-lg font-semibold mb-3">전체 재계산 vs 증분 계산</h3>
      <div className="space-y-2 mb-8">
        {TRIE_CHALLENGES.map((c, i) => (
          <motion.div key={i} onClick={() => setActiveChallenge(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeChallenge ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeChallenge ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeChallenge ? c.color : 'var(--muted)', color: i === activeChallenge ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{c.title}</span>
            </div>
            <AnimatePresence>
              {i === activeChallenge && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{c.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 성능 비교 테이블 */}
      <h3 className="text-lg font-semibold mb-3">Geth vs Reth 성능 비교</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">시나리오</th>
              <th className="text-left p-3 font-semibold">Geth</th>
              <th className="text-left p-3 font-semibold">Reth</th>
              <th className="text-left p-3 font-semibold">개선</th>
            </tr>
          </thead>
          <tbody>
            {PERF_COMPARISON.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{r.scenario}</td>
                <td className="p-3 text-red-400">{r.geth}</td>
                <td className="p-3 text-emerald-400">{r.reth}</td>
                <td className="p-3 font-semibold">{r.speedup}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth의 trie 아키텍처는 세 단계로 구성된다.
          <strong>PrefixSet</strong>이 변경된 키를 수집하고,
          <strong>overlay_root</strong>가 변경된 서브트리만 선택적으로 재해시하며,
          <strong>overlay_root_parallel</strong>이 storage trie를 병렬로 계산한다.
        </p>
      </div>

      <div className="not-prose mt-6"><TrieCalculationViz /></div>
    </section>
  );
}
