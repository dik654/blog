import { codeRefs } from './codeRefs';
import HamtDetailViz from './viz/HamtDetailViz';
import type { CodeRef } from '@/components/code/types';

export default function HamtAmt({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="hamt-amt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HAMT & AMT 자료구조</h2>
      <div className="not-prose mb-8">
        <HamtDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 비트폭 5가 최적인 이유</strong> — 2^5=32 슬롯/노드
          <br />
          IPLD 블록 크기(~256KB)와 I/O 깊이의 균형점
          <br />
          버킷 크기 3은 해시 충돌 시 리프 분할 빈도를 최소화
        </p>

        {/* ── HAMT & AMT ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HAMT (Hash Array Mapped Trie)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HAMT 구조 (Filecoin):

// Node structure:
// type Node struct {
//     Bitfield: bigint    // indicates used slots
//     Pointers: [Pointer] // up to 32 entries
// }
//
// type Pointer struct {
//     KVs: []*KV          // bucket (leaf)
//     Link: *cid.Cid      // child node (internal)
// }

// Parameters:
// - Bit width: 5 (2^5 = 32 slots per node)
// - Bucket size: 3 (max entries per leaf)
// - Hash: SHA-256

// Lookup algorithm:
// 1. compute hash(key)
// 2. extract 5-bit chunks from hash
// 3. for each chunk:
//    a. check bitfield
//    b. if empty: key not found
//    c. if bucket: linear search
//    d. if link: recurse with next chunk

// Insert algorithm:
// 1. compute hash(key)
// 2. traverse to leaf
// 3. if bucket has space: add
// 4. if bucket full: split into child node
// 5. update bitfield + parents
// 6. recompute CIDs bottom-up

// 왜 bit width 5?
// - 2^5 = 32 slots
// - enough branching for depth control
// - IPLD block size fit (~256KB)
// - typical depth: 5-6 for 1M entries

// Structural sharing:
// - immutable nodes
// - path copying on update
// - unchanged branches shared with previous state
// - memory + IPLD dedup

// AMT (Array Mapped Trie):
// - similar to HAMT but indexed by integer
// - used for sector arrays, deal arrays
// - more compact for sequential keys

// Use cases in Filecoin:
// HAMT:
// - StateTree (address → actor)
// - miner's PendingSectors
// - market's DealProposals
// - power actor's Claims
//
// AMT:
// - miner's Sectors array
// - miner's PreCommitted sectors
// - deal IDs
// - sector numbers

// Performance:
// - lookup: O(log_32(n))
// - insert: O(log_32(n)) + path copy
// - million entries: ~6 level depth
// - per-level IPLD block load`}
        </pre>
        <p className="leading-7">
          HAMT: <strong>32-ary Patricia trie + content addressing</strong>.<br />
          bit width 5, bucket 3, SHA-256 hashing.<br />
          structural sharing으로 state snapshot 효율.
        </p>
      </div>
    </section>
  );
}
