import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrimitivesDetailViz from './viz/PrimitivesDetailViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { TYPE_CARDS, GETH_VS_ALLOY } from './PrimitivesData';

const CELL = 'border border-border px-4 py-2';
const COLOR_MAP: Record<string, string> = {
  indigo: 'border-indigo-500/50 bg-indigo-500/5',
  emerald: 'border-emerald-500/50 bg-emerald-500/5',
  amber: 'border-amber-500/50 bg-amber-500/5',
};
const BADGE_MAP: Record<string, string> = {
  indigo: 'bg-indigo-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  amber: 'bg-amber-500 text-white',
};

export default function Primitives({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  const [active, setActive] = useState(0);

  return (
    <section id="primitives" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Address, B256, U256 타입</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움 EVM은 256비트 워드 머신이다.<br />
          스택의 모든 슬롯이 32바이트(U256)이고, 주소는 그 중 하위 20바이트(Address)를 사용한다.<br />
          이 두 타입은 노드 전체에서 가장 빈번하게 생성되고 복사되는 타입이다.
        </p>
        <p className="leading-7">
          alloy-primitives는 <code>{'FixedBytes<N>'}</code>이라는 하나의 const 제네릭 구조체(컴파일 타임에 N이 결정되는 바이트 배열 래퍼)로 Address와 B256을 모두 표현한다.<br />
          Geth는 <code>common.Address</code>와 <code>common.Hash</code>가 완전히 별도 타입이라 동일한 유틸리티 함수를 중복 구현해야 한다.
        </p>

        {/* ── Address 구조체 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Address — 20바이트 이더리움 주소</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <div className="rounded border border-border bg-background px-3 py-2 text-sm mb-3">
            <code>#[repr(transparent)]</code>{' '}<span className="text-muted-foreground">// 메모리 레이아웃 = B160 = <code>{'FixedBytes<20>'}</code></span><br />
            <code>pub struct Address(pub B160);</code>
          </div>
          <p className="text-sm font-semibold mb-2">주요 메서드</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>from_public_key(pk: &amp;PublicKey) -&gt; Self</code>
              <p className="text-muted-foreground mt-1">공개키에서 주소 유도 — uncompressed 직렬화 후 <code>keccak256(&amp;uncompressed[1..])</code>의 하위 20바이트</p>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>to_checksum(&amp;self, chain_id: Option&lt;u64&gt;) -&gt; String</code>
              <p className="text-muted-foreground mt-1">EIP-55 checksum 인코딩 — keccak256 해시의 비트에 따라 각 hex 문자를 대/소문자 결정</p>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>{'address!("5B38Da6a701c568545dCfcB03FcB875f56beddC4")'}</code>
              <p className="text-muted-foreground mt-1">컴파일 타임 리터럴 매크로 — 잘못된 hex는 컴파일 에러</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>#[repr(transparent)]</code> — Rust 구조체의 메모리 레이아웃을 내부 필드와 동일하게 보장.<br />
          <code>Address</code>와 <code>B160</code>은 런타임에 바이트 수준에서 같음 → unsafe 변환이 안전.<br />
          <code>to_checksum()</code>은 EIP-55 구현 — keccak256 해시의 비트로 대소문자 결정 (잘못 입력한 주소 탐지).
        </p>

        {/* ── B256 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">B256 — 32바이트 해시 (keccak256 결과)</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <div className="rounded border border-border bg-background px-3 py-2 text-sm mb-3">
            <code>{'pub type B256 = FixedBytes<32>;'}</code>{' '}<span className="text-muted-foreground">// TX 해시, 블록 해시, state_root 등</span>
          </div>
          <p className="text-sm font-semibold mb-2">사용 패턴</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2"><code>keccak256(&amp;tx_encoded)</code> — TX 해시</div>
            <div className="rounded border border-border bg-background px-3 py-2"><code>header.hash_slow()</code> — 블록 해시</div>
            <div className="rounded border border-border bg-background px-3 py-2"><code>trie.root()</code> — state root</div>
          </div>
          <p className="text-sm font-semibold mb-2">주요 상수</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>KECCAK_EMPTY</code> — <code>keccak256("")</code> — 빈 바이트 열의 해시
              <p className="text-xs text-muted-foreground mt-1 break-all">0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470</p>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>EMPTY_ROOT_HASH</code> — <code>keccak256(RLP([]))</code> — 빈 trie의 root
              <p className="text-xs text-muted-foreground mt-1 break-all">0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3"><code>B256</code>은 <code>Copy + Eq + Hash</code> → <code>{'HashMap<B256, V>'}</code>로 직접 사용 가능</p>
        </div>
        <p className="leading-7">
          B256이 <code>Copy</code> trait을 구현하므로 함수 인자/반환 시 <strong>bitwise 복사</strong>만 발생 (32바이트 memcpy).<br />
          Vec이나 힙 할당 없이 레지스터/스택에서 완료.<br />
          <code>KECCAK_EMPTY</code>, <code>EMPTY_ROOT_HASH</code> 같은 상수는 이더리움 프로토콜 곳곳에서 등장 — 한 번 하드코딩되어 모두 공유.
        </p>

        {/* ── U256 arithmetic ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">U256 — 256비트 정수 연산</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <div className="rounded border border-border bg-background px-3 py-2 text-sm mb-3">
            <code>pub use ruint::aliases::U256;</code>{' '}<span className="text-muted-foreground">// 내부 표현: <code>[u64; 4]</code> little-endian [low, mid_low, mid_high, high]</span>
          </div>
          <p className="text-sm font-semibold mb-2">연산 예시</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2"><code>a + b</code> — wrapping_add (오버플로 시 wrap)</div>
            <div className="rounded border border-border bg-background px-3 py-2"><code>a.checked_add(b)</code> — <code>Option&lt;U256&gt;</code>, 오버플로 검출</div>
            <div className="rounded border border-border bg-background px-3 py-2"><code>a.saturating_mul(b)</code> — 오버플로 시 <code>U256::MAX</code></div>
            <div className="rounded border border-border bg-background px-3 py-2"><code>U256::from_str_radix("12345", 10)</code> — 십진 파싱</div>
          </div>
          <p className="text-sm font-semibold mb-2">EVM에서 중요한 연산</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">가스 계산</span> — <code>U256::from(gas) * U256::from(gas_price)</code>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">잔고/value</span> — <code>account.balance.checked_sub(tx_value).ok_or(InsufficientBalance)?</code>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">스토리지 슬롯</span> — 32바이트 키/값 모두 U256: <code>storage.set(slot, value)</code>
            </div>
          </div>
          <p className="text-sm font-semibold mb-2">wei 단위 변환</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>ETHER</code> = 10^18 wei</div>
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>GWEI</code> = 10^9 wei</div>
          </div>
        </div>
        <p className="leading-7">
          <code>U256</code>은 alloy가 <code>ruint</code> 크레이트를 재export.<br />
          <code>ruint::Uint&lt;256, 4&gt;</code> — 256비트, 4개 u64 limb로 표현 (little-endian).<br />
          Rust의 <code>u64</code> wrapping/carry 연산 덕분에 어셈블리 수준 최적화 가능.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">핵심 타입 상세</h3>
      <div className="space-y-2 mb-8">
        {TYPE_CARDS.map((c, i) => (
          <motion.div key={i} onClick={() => setActive(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === active ? COLOR_MAP[c.color] : 'border-border'}`}
            animate={{ opacity: i === active ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${i === active ? BADGE_MAP[c.color] : 'bg-muted text-muted-foreground'}`}>{c.size}</span>
              <span className="font-semibold text-sm">{c.title}</span>
            </div>
            <AnimatePresence>
              {i === active && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-16">{c.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1 ml-16">vs Geth: {c.versus}</p>
                  <div className="ml-16 mt-2">
                    <CodeViewButton onClick={() => open(c.codeKey)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">Geth vs alloy 비교</h3>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full text-sm border border-border">
          <thead>
            <tr className="bg-muted">
              <th className={`${CELL} text-left`}>속성</th>
              <th className={`${CELL} text-left`}>Geth (Go)</th>
              <th className={`${CELL} text-left`}>alloy (Rust)</th>
            </tr>
          </thead>
          <tbody>
            {GETH_VS_ALLOY.map(r => (
              <tr key={r.attr}>
                <td className={`${CELL} font-medium`}>{r.attr}</td>
                <td className={CELL}>{r.geth}</td>
                <td className={CELL}>{r.alloy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose">
        <PrimitivesDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
