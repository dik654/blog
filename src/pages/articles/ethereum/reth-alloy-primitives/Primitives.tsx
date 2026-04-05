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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// alloy-primitives/src/bits/address.rs
#[repr(transparent)]  // 메모리 레이아웃 = B160 (= FixedBytes<20>)
pub struct Address(pub B160);

impl Address {
    pub const ZERO: Self = Self(B160::ZERO);

    /// 공개키에서 주소 유도 — ecrecover 결과의 변환
    pub fn from_public_key(pk: &PublicKey) -> Self {
        let uncompressed = pk.serialize_uncompressed();
        let hash = keccak256(&uncompressed[1..]);  // 0x04 prefix 제외
        Address::from_slice(&hash[12..32])         // 하위 20바이트
    }

    /// EIP-55 checksum 인코딩 (대소문자 혼합 주소)
    pub fn to_checksum(&self, chain_id: Option<u64>) -> String {
        let hex = hex::encode(self.0);
        let hash = keccak256(hex.as_bytes());
        // 각 hex char을 hash의 해당 bit에 따라 대소문자 결정
        ...
    }
}

// Address 리터럴 매크로
let addr: Address = address!("5B38Da6a701c568545dCfcB03FcB875f56beddC4");`}
        </pre>
        <p className="leading-7">
          <code>#[repr(transparent)]</code> — Rust 구조체의 메모리 레이아웃을 내부 필드와 동일하게 보장.<br />
          <code>Address</code>와 <code>B160</code>은 런타임에 바이트 수준에서 같음 → unsafe 변환이 안전.<br />
          <code>to_checksum()</code>은 EIP-55 구현 — keccak256 해시의 비트로 대소문자 결정 (잘못 입력한 주소 탐지).
        </p>

        {/* ── B256 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">B256 — 32바이트 해시 (keccak256 결과)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 32바이트 해시 — TX 해시, 블록 해시, state_root 등
pub type B256 = FixedBytes<32>;

// 사용 패턴:
let tx_hash: B256 = keccak256(&tx_encoded);
let block_hash: B256 = header.hash_slow();
let state_root: B256 = trie.root();

// B256 리터럴
let genesis = b256!("d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3");

// B256 자주 쓰이는 상수
pub const KECCAK_EMPTY: B256 = b256!(
    "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
);  // keccak256("") — 빈 바이트 열의 해시

pub const EMPTY_ROOT_HASH: B256 = b256!(
    "56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"
);  // keccak256(RLP([])) — 빈 trie의 root

// B256은 Copy + Eq + Hash → HashMap<B256, V>로 쉽게 사용 가능`}
        </pre>
        <p className="leading-7">
          B256이 <code>Copy</code> trait을 구현하므로 함수 인자/반환 시 <strong>bitwise 복사</strong>만 발생 (32바이트 memcpy).<br />
          Vec이나 힙 할당 없이 레지스터/스택에서 완료.<br />
          <code>KECCAK_EMPTY</code>, <code>EMPTY_ROOT_HASH</code> 같은 상수는 이더리움 프로토콜 곳곳에서 등장 — 한 번 하드코딩되어 모두 공유.
        </p>

        {/* ── U256 arithmetic ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">U256 — 256비트 정수 연산</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// alloy-primitives가 ruint 크레이트 재export
pub use ruint::aliases::U256;

// 내부 표현: 4개의 u64 (little-endian)
// U256 { limbs: [low, mid_low, mid_high, high] }

// 연산 예시
let a = U256::from(100_u64);
let b = U256::from_str_radix("12345", 10)?;  // 십진 파싱
let c = a + b;              // wrapping_add (오버플로 시 wrap)
let d = a.checked_add(b);   // Option<U256> — 오버플로 검출
let e = a.saturating_mul(b);// 오버플로 시 U256::MAX

// EVM에서 중요한 연산:
// 1. 가스 계산: 보통 u64 범위지만 multiplication 시 U256 필요
let gas_cost = U256::from(gas) * U256::from(gas_price);

// 2. 잔고/value 연산
let new_balance = account.balance.checked_sub(tx_value)
    .ok_or(InsufficientBalance)?;

// 3. 스토리지 슬롯 (32바이트 키/값 모두 U256)
storage.set(slot, value);

// wei 단위 변환
pub const ETHER: U256 = U256::from(1_000_000_000_000_000_000u128);
pub const GWEI: U256 = U256::from(1_000_000_000u64);
let balance_eth = balance / ETHER;  // wei → ETH`}
        </pre>
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
