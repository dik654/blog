import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { OVERLAY_STEPS, STATE_ROOT_FIELDS } from './StateRootData';

export default function StateRoot({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="state-root" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StateRoot 계산 흐름</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>StateRoot</code>는 DB의 기존 trie 위에 BundleState 변경사항을 overlay로 적용하여 새 상태 루트를 계산하는 구조체다.<br />
          핵심 메서드인 <code>overlay_root()</code>는 변경된 서브트리만 선택적으로 재해시한다.
        </p>
        <p className="leading-7">
          <strong>overlay 방식의 핵심 아이디어</strong> — 기존 trie를 수정하지 않는다.<br />
          DB에서 기존 해시를 읽고, 변경된 부분만 새로 계산하여 "겹쳐 놓는다(overlay)."<br />
          변경 없는 서브트리의 해시는 DB에서 읽기만 하면 된다.<br />
          재해시 비용은 전체 상태 크기가 아니라 변경된 키 수에 비례한다.
        </p>

        {/* ── StateRoot 구조체 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateRoot 구조체 필드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct StateRoot<TX, H> {
    /// DB 읽기 트랜잭션 (기존 trie 노드 접근)
    tx: TX,

    /// 변경된 account 주소의 prefix 집합
    /// 이 집합에 속한 경로만 재계산
    changed_account_prefixes: PrefixSet,

    /// 변경된 storage slot의 prefix 집합 (account별)
    /// key: keccak256(address), value: 해당 계정의 변경된 slot prefix
    changed_storage_prefixes: HashMap<B256, PrefixSet>,

    /// HashedPostState — BundleState를 hashed key로 변환
    /// keccak256(address) → account, keccak256(slot_key) → value
    hashed_state: H,
}

// HashedPostState 구조:
pub struct HashedPostState {
    pub accounts: HashMap<B256, Option<Account>>,  // hashed addr → account
    pub storages: HashMap<B256, HashedStorage>,    // hashed addr → storage
}

pub struct HashedStorage {
    pub wiped: bool,  // selfdestruct로 초기화 여부
    pub storage: HashMap<B256, U256>,  // hashed slot → value
}`}
        </pre>
        <p className="leading-7">
          <code>HashedPostState</code>가 주소/키를 이미 <strong>keccak256 해시</strong>로 변환한 상태.<br />
          Trie는 해시를 키로 사용하므로, 매번 해싱하지 않고 사전 계산된 값 재사용.<br />
          BundleState → HashedPostState 변환은 별도 Stage(Hashing)에서 수행.
        </p>

        {/* ── TrieWalker ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TrieWalker — PrefixSet 기반 순회</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// TrieWalker: account trie를 PrefixSet에 따라 순회
pub struct TrieWalker<'a, TX> {
    tx: &'a TX,
    /// 현재 순회 중인 스택
    stack: Vec<TrieNodeEntry>,
    /// 재해시할 prefix 집합
    prefix_set: PrefixSet,
}

impl<'a, TX: DbTx> TrieWalker<'a, TX> {
    /// 다음 변경 지점으로 이동
    pub fn next(&mut self) -> Option<(Nibbles, B256)> {
        loop {
            let entry = self.stack.pop()?;

            // PrefixSet에 있는지 확인
            if !self.prefix_set.contains(&entry.nibbles) {
                // 변경 없음 → DB에서 기존 해시 읽기
                let cached_hash = self.tx.get::<AccountsTrie>(entry.nibbles)?;
                continue;  // skip (재해시 불필요)
            }

            // 변경 있음 → 자식 노드 탐색
            match entry.node {
                TrieNode::Branch { children, .. } => {
                    // 각 자식을 스택에 추가
                    for (i, child) in children.iter().enumerate() {
                        if child.is_some() {
                            self.stack.push(child_entry(i));
                        }
                    }
                }
                TrieNode::Leaf { key, .. } => {
                    return Some((entry.nibbles.join(&key), entry.hash));
                }
                _ => continue,
            }
        }
    }
}`}
        </pre>
        <p className="leading-7">
          <code>TrieWalker</code>가 <strong>PrefixSet 필터링</strong>으로 탐색 범위 축소.<br />
          변경 없는 서브트리 → DB의 기존 해시 재사용 (읽기만).<br />
          변경 있는 서브트리 → 자식 재귀 탐색 → 리프에서 새 값으로 해시 재계산.
        </p>

        {/* ── 증분 계산 비용 분석 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">증분 계산 비용 — 실제 수치</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 메인넷 블록 평균 변경 통계:
// - 변경 계정: ~500 ~ 2,000개
// - 변경 스토리지 slot: ~1,000 ~ 5,000개
// - 새 컨트랙트: ~10 ~ 50개

// 전체 재계산 시나리오:
// 2.5억 계정 × keccak256 호출 = 수억 해시 계산
// 각 해시 ~1 microsecond → 수 분 소요

// 증분 계산 시나리오:
// 1. 변경 계정 경로만 탐색
//    - 각 경로 평균 깊이: ~6 nibbles
//    - 방문 노드: ~6 × 1,000 = 6,000
// 2. 각 노드에서 keccak256
//    - ~6,000 × 1 us = 6 ms
// 3. storage trie도 동일 패턴
//    - 변경 슬롯 × 깊이 = ~3만 해시 = 30 ms

// 총: ~40 ms per block
// 가속비: 수 분 / 40 ms = 수천배

// 실제 메인넷 측정 (reth archive 노드):
// - 블록당 MerkleStage 평균: ~50 ms
// - 이 중 증분 재해시: ~40 ms
// - PrefixSet 순회 + DB read: ~10 ms`}
        </pre>
        <p className="leading-7">
          증분 재계산의 <strong>실질 가속비는 1000배 이상</strong>.<br />
          전체 재계산은 블록 시간 12초 내 불가능 → 증분 계산이 필수.<br />
          PrefixSet + TrieWalker 조합이 이 가속의 핵심.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: overlay vs 직접 수정</p>
          <p className="mt-2">
            Geth는 trie를 <strong>직접 수정</strong>:<br />
            - 변경마다 trie 노드 dirty 표시<br />
            - 블록 종료 시 dirty 노드 전부 재해시<br />
            - trie를 stateful하게 유지
          </p>
          <p className="mt-2">
            Reth는 <strong>overlay 방식</strong>:<br />
            - 기존 trie 읽기만 함 (stateless)<br />
            - BundleState + PrefixSet으로 "겹쳐" 계산<br />
            - 원본 trie 변경 없이 새 루트 도출
          </p>
          <p className="mt-2">
            overlay의 이점:<br />
            1. <strong>reorg 안전</strong> — 원본 유지 → 롤백 쉬움<br />
            2. <strong>병렬 가능</strong> — 여러 overlay가 동일 원본 공유<br />
            3. <strong>메모리 효율</strong> — 변경분만 메모리에<br />
            4. <strong>증분 검증</strong> — 상태 전이를 명시적 표현
          </p>
        </div>
      </div>

      {/* StateRoot 필드 목록 */}
      <h3 className="text-lg font-semibold mb-3">StateRoot 구조체</h3>
      <div className="grid grid-cols-2 gap-2 mb-8">
        {STATE_ROOT_FIELDS.map((f) => (
          <div key={f.name} className="rounded-lg border border-border p-3">
            <code className="text-sm font-mono font-semibold text-indigo-400">{f.name}</code>
            <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* overlay_root 4단계 */}
      <h3 className="text-lg font-semibold mb-3">overlay_root() 4단계</h3>
      <div className="space-y-2 mb-8">
        {OVERLAY_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setActiveStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeStep ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeStep ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeStep ? s.color : 'var(--muted)', color: i === activeStep ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === activeStep && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>기존 해시 재사용이 핵심이다.</strong>{' '}
          100만 계정 중 1개만 변경되면, Root → Branch → Leaf 경로의 3개 노드만 재해시한다.
          <br />
          나머지 999,999개 계정의 해시는 DB에서 읽기만 하면 된다.<br />
          재해시 비용은 trie 깊이(약 60~64 nibbles)에 비례하며, 전체 상태 크기와 무관하다.
        </p>
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('state-root', codeRefs['state-root'])} />
        <span className="text-[10px] text-muted-foreground self-center">StateRoot 전체</span>
      </div>
    </section>
  );
}
