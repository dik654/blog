import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PrefixSetDetailViz from './viz/PrefixSetDetailViz';
import { PREFIX_OPERATIONS, BTREE_VS_HASH } from './PrefixSetData';

export default function PrefixSet({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeOp, setActiveOp] = useState(0);

  return (
    <section id="prefix-set" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PrefixSet & 변경 추적</h2>
      <div className="not-prose mb-8"><PrefixSetDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>PrefixSet</code>은 "어떤 키가 변경되었는가?"를 추적하는 자료구조다.<br />
          블록 실행 중 상태가 변경될 때마다 해당 키를 <code>BTreeSet</code>에 삽입한다.<br />
          trie 재계산 시 이 집합을 참조하여 변경된 서브트리만 골라 재해시한다.
        </p>
        <p className="leading-7">
          <strong>왜 BTreeSet인가?</strong>{' '}
          핵심 연산은 "이 prefix로 시작하는 키가 있는가?"다.<br />
          <code>HashSet</code>은 O(1) lookup이 가능하지만 range 쿼리를 지원하지 않는다.<br />
          <code>BTreeSet</code>은 정렬된 상태를 유지하므로 <code>range(prefix..)</code>로 prefix 매칭을 O(log n)에 수행할 수 있다.
        </p>

        {/* ── PrefixSet 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PrefixSet 구현 — contains() 알고리즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct PrefixSet {
    keys: BTreeSet<Nibbles>,
    sorted: bool,
}

impl PrefixSet {
    /// 주어진 prefix로 시작하는 key가 있는지 확인
    /// 핵심 연산: trie 순회 중 "이 서브트리 재계산 필요?"
    pub fn contains(&self, prefix: &Nibbles) -> bool {
        // 1. prefix 이상인 첫 key 찾기 (lower_bound)
        //    BTreeSet range는 O(log n)
        let next_key = self.keys.range(prefix..).next();

        // 2. 그 key가 실제로 prefix로 시작하는지 확인
        next_key.map_or(false, |k| k.starts_with(prefix))
    }
}

// 동작 예시:
// keys = {[0x2], [0x5, 0x1], [0x5, 0x9], [0xa, 0x3]}
// prefix = [0x5]
//
// range([0x5]..) → [0x5, 0x1] (first match)
// starts_with([0x5]) → true ✓
// → 서브트리 재계산 필요

// prefix = [0x7]
// range([0x7]..) → [0xa, 0x3]
// starts_with([0x7]) → false
// → 서브트리 재계산 불필요`}
        </pre>
        <p className="leading-7">
          <code>contains()</code>는 trie 순회의 <strong>core primitive</strong>.<br />
          매 branch 노드 방문 시 호출 → 이 branch 아래 변경 있는지 O(log n)에 판단.<br />
          range 쿼리 + starts_with 체크의 조합이 BTreeSet의 능력.
        </p>

        {/* ── Nibbles 표현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Nibbles — 4비트 단위 키 표현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct Nibbles {
    /// 각 바이트가 하나의 nibble (0x0 ~ 0xf)
    data: SmallVec<[u8; 64]>,
}

// Address → Nibbles 변환
impl From<B256> for Nibbles {
    fn from(hash: B256) -> Self {
        let mut nibbles = Nibbles::with_capacity(64);
        for byte in hash.0.iter() {
            nibbles.push(byte >> 4);   // 상위 4비트
            nibbles.push(byte & 0x0f); // 하위 4비트
        }
        nibbles
    }
}

// 예시:
// keccak256(addr) = 0xa7b3c5d9...
// → Nibbles: [0xa, 0x7, 0xb, 0x3, 0xc, 0x5, 0xd, 0x9, ...]
//   (64개 nibble)

// Nibbles 연산:
impl Nibbles {
    pub fn starts_with(&self, prefix: &Nibbles) -> bool {
        // prefix가 self의 앞부분과 일치?
        self.data.starts_with(&prefix.data)
    }

    pub fn common_prefix_length(&self, other: &Nibbles) -> usize {
        // 공통 prefix 길이 (Patricia 압축용)
        self.data.iter().zip(other.data.iter())
            .take_while(|(a, b)| a == b)
            .count()
    }
}`}
        </pre>
        <p className="leading-7">
          <code>Nibbles</code>가 <strong>트리 탐색의 기본 단위</strong>.<br />
          keccak256 해시 32바이트 → 64 nibble → 최대 trie 깊이 64.<br />
          <code>SmallVec&lt;[u8; 64]&gt;</code>로 64 이하는 스택, 초과 시 힙 — 대부분 스택 할당.
        </p>

        {/* ── freeze 최적화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">freeze() — 불변화 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`impl PrefixSet {
    /// 모든 삽입 완료 후 불변 버전으로 변환
    /// 이후 contains() 호출이 더 빠름
    pub fn freeze(self) -> FrozenPrefixSet {
        FrozenPrefixSet {
            keys: self.keys.into_iter().collect::<Vec<_>>(),
        }
    }
}

pub struct FrozenPrefixSet {
    keys: Vec<Nibbles>,  // 정렬된 Vec
}

impl FrozenPrefixSet {
    pub fn contains(&self, prefix: &Nibbles) -> bool {
        // binary_search로 O(log n) 확인
        // BTreeSet보다 캐시 효율 높음 (연속 메모리)
        match self.keys.binary_search_by(|k| k.as_slice().cmp(prefix)) {
            Ok(_) => true,
            Err(i) => {
                // i = prefix보다 크거나 같은 첫 위치
                self.keys.get(i).map_or(false, |k| k.starts_with(prefix))
            }
        }
    }
}

// 성능 차이:
// BTreeSet: 노드 간 pointer chase → 캐시 miss 빈번
// Vec + binary_search: 연속 메모리 → 캐시 효율 ~3배
//
// trie 순회는 contains() 수천~수만 회 호출
// → freeze() 최적화가 유의미`}
        </pre>
        <p className="leading-7">
          <code>freeze()</code>로 BTreeSet → Vec 변환 — <strong>메모리 지역성 개선</strong>.<br />
          BTreeSet은 트리 노드가 힙 곳곳에 분산, Vec은 연속 메모리.<br />
          trie 순회는 contains() 반복 호출이므로 캐시 효율이 중요.
        </p>

        {/* ── 병합 연산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PrefixSet 병합 — 배치 블록 누적</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 여러 블록의 PrefixSet 병합 (ExecutionStage의 배치 누적)
impl PrefixSet {
    pub fn extend(&mut self, other: PrefixSet) {
        self.keys.extend(other.keys);
        // BTreeSet이 자동으로 정렬 유지 + 중복 제거
    }
}

// MerkleStage의 동작:
// provider.changed_prefix_sets(checkpoint, target) 호출
// → checkpoint+1 ~ target 범위 ChangeSets 전체 조회
// → 모든 변경 address를 하나의 PrefixSet으로 통합

fn changed_prefix_sets(
    &self,
    from_block: u64,
    to_block: u64,
) -> Result<PrefixSets> {
    let mut account_prefix_set = PrefixSet::new();
    let mut storage_prefix_sets = HashMap::new();

    // AccountChangeSets 테이블 스캔
    for (block, entries) in self.account_history_range(from_block..=to_block)? {
        for (address, _) in entries {
            account_prefix_set.insert(keccak256(address).into());
        }
    }

    // StorageChangeSets 테이블 스캔
    for (block, addr, slot, _) in self.storage_history_range(from_block..=to_block)? {
        storage_prefix_sets
            .entry(keccak256(addr))
            .or_insert_with(PrefixSet::new)
            .insert(keccak256(slot).into());
    }

    Ok(PrefixSets { account: account_prefix_set, storage: storage_prefix_sets })
}`}
        </pre>
        <p className="leading-7">
          MerkleStage는 <strong>여러 블록의 변경을 통합</strong>해 한 번에 증분 계산.<br />
          10K 블록 배치 → 총 변경 계정 수만 개 → PrefixSet 1개로 통합.<br />
          중복 address 자동 제거 (BTreeSet) → MerkleStage 호출 1회에 모든 변경 처리.
        </p>
      </div>

      {/* PrefixSet 핵심 연산 */}
      <h3 className="text-lg font-semibold mb-3">핵심 3개 연산</h3>
      <div className="space-y-2 mb-8">
        {PREFIX_OPERATIONS.map((op, i) => (
          <motion.div key={i} onClick={() => setActiveOp(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeOp ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeOp ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <code className="text-sm font-mono font-semibold" style={{ color: op.color }}>{op.name}</code>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{op.phase}</span>
            </div>
            <AnimatePresence>
              {i === activeOp && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{op.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* BTreeSet vs HashSet 비교 */}
      <div className="rounded-lg border border-border p-4 mb-8">
        <h4 className="text-sm font-semibold mb-3">BTreeSet vs HashSet</h4>
        <div className="grid grid-cols-3 gap-2 text-xs mb-3">
          <div />
          <div className="font-semibold text-center text-emerald-400">BTreeSet</div>
          <div className="font-semibold text-center text-muted-foreground">HashSet</div>
          <div className="text-muted-foreground">Lookup</div>
          <div className="text-center">{BTREE_VS_HASH.btree.lookup}</div>
          <div className="text-center">{BTREE_VS_HASH.hash.lookup}</div>
          <div className="text-muted-foreground">Range 쿼리</div>
          <div className="text-center text-emerald-400">{BTREE_VS_HASH.btree.range}</div>
          <div className="text-center text-red-400">{BTREE_VS_HASH.hash.range}</div>
        </div>
        <p className="text-xs text-foreground/60">{BTREE_VS_HASH.reason}</p>
      </div>

      <div className="not-prose flex flex-wrap gap-2 mb-4">
        <CodeViewButton onClick={() => onCodeRef('prefix-set', codeRefs['prefix-set'])} />
        <span className="text-[10px] text-muted-foreground self-center">PrefixSet 전체</span>
      </div>
    </section>
  );
}
