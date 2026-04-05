import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import RLPEncodingViz from './viz/RLPEncodingViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { WHY_ALLOY } from './OverviewData';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">alloy 생태계 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움 노드는 Address, Hash, U256 같은 기본 타입을 블록 실행 중 수천 번 생성한다.<br />
          Geth는 Go의 <code>big.Int</code>(임의 정밀도 정수)를 사용하는데, 내부적으로 힙 슬라이스를 할당하므로 GC(Garbage Collection, 사용하지 않는 메모리를 자동 회수하는 메커니즘) 압박이 누적된다.
        </p>
        <p className="leading-7">
          <strong>alloy-primitives</strong>는 Rust의 const 제네릭(컴파일 타임에 크기가 결정되는 제네릭 파라미터)으로 고정 크기 타입을 스택에 할당한다.<br />
          <code>{'FixedBytes<20>'}</code>이 Address, <code>{'FixedBytes<32>'}</code>가 B256이 된다.<br />
          하나의 구조체로 모든 고정 크기 바이트 타입을 표현하므로 코드 중복이 사라진다.
        </p>
        <p className="leading-7">
          직렬화도 마찬가지다.<br />
          Geth의 RLP 패키지는 리플렉션(런타임에 타입 정보를 조회하는 기법) 기반이라 컴파일러가 최적화할 수 없다.<br />
          alloy-rlp의 derive 매크로는 컴파일 타임에 인코더 코드를 생성하므로 LLVM이 함수를 인라인할 수 있다.
        </p>

        {/* ── alloy 크레이트 계보 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">alloy 크레이트 계보 — ethers-rs 후계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ethers-rs (2021~2023) → alloy (2023~)
//
// ethers-rs의 교훈:
// - ABI 코드 생성(Abigen)이 유용 → 유지
// - 하지만 Types/Providers/Signers가 하나의 거대 크레이트 → 분할 필요
// - alloy는 이것을 ~40개 크레이트로 분할

// alloy 주요 크레이트 (reth가 사용하는 것):
alloy-primitives      // Address, B256, U256, Bytes, Bloom
alloy-rlp             // RLP 인코딩/디코딩 (derive 매크로)
alloy-rlp-derive      // #[derive(RlpEncodable)] 프로시저 매크로
alloy-trie            // MPT 헬퍼 (HashBuilder, Nibbles)
alloy-eips            // EIP-1559/2930/4844 타입 정의
alloy-consensus       // TxEnvelope, Header, Receipt 타입
alloy-genesis         // Genesis 구조체 파싱
alloy-signer          // ECDSA 서명 (Ledger/AWS KMS 등)

// Reth는 ~30개 alloy 크레이트를 직접 의존 → 공유 타입 기반 구축`}
        </pre>
        <p className="leading-7">
          alloy의 가치: <strong>이더리움 Rust 생태계의 공통 타입</strong>.<br />
          Reth, Foundry, ethers-rs 후속 도구, 개인 프로젝트 모두 같은 Address/B256/U256 타입 공유.<br />
          Geth의 go-ethereum common 패키지와 유사한 역할이지만 스택 할당 중심 설계.
        </p>

        {/* ── const 제네릭 설계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">const 제네릭 — FixedBytes&lt;N&gt; 통합 설계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 하나의 구조체로 모든 고정 크기 타입 표현
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
pub struct FixedBytes<const N: usize>(pub [u8; N]);

// 타입 별칭으로 의미 부여
pub type B8    = FixedBytes<1>;   // 1바이트
pub type B16   = FixedBytes<2>;   // 2바이트
pub type B32   = FixedBytes<4>;   // 4바이트 (function selector)
pub type B64   = FixedBytes<8>;   // 8바이트 (nonce)
pub type B128  = FixedBytes<16>;  // 16바이트 (IPv6)
pub type B160  = FixedBytes<20>;  // 20바이트 (Address)
pub type B256  = FixedBytes<32>;  // 32바이트 (keccak256)
pub type B512  = FixedBytes<64>;  // 64바이트 (공개키)
pub type B1024 = FixedBytes<128>; // 128바이트
pub type B2048 = FixedBytes<256>; // 256바이트 (Bloom filter)

// Address는 B160의 newtype
pub struct Address(pub B160);

// 장점:
// 1. 코드 중복 0 — trait impl 한 번으로 모든 크기 지원
// 2. 스택 할당 — [u8; N]은 Copy, 힙 없음
// 3. 컴파일 타임 크기 검증 — keccak256()이 B256 반환 보장`}
        </pre>
        <p className="leading-7">
          <code>const N: usize</code>는 Rust 1.51부터 안정화된 기능 — 컴파일 타임에 결정되는 정수 제네릭.<br />
          Geth에서 <code>Hash [32]byte</code>와 <code>Address [20]byte</code>를 각각 선언하고 각각 메서드 구현하는 것과 대조.<br />
          Rust는 <code>impl&lt;const N: usize&gt; ... for FixedBytes&lt;N&gt;</code> 한 번으로 모든 크기에 공통 동작 제공.
        </p>

        {/* ── 성능 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">스택 vs 힙 — 할당 비용 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Geth: big.Int 사용
balance := new(big.Int).Add(oldBalance, tx.Value())
// 내부적으로:
// 1. big.Int 구조체 힙 할당 (~48 bytes)
// 2. 가변 []Word 슬라이스 할당 (~32 bytes for U256)
// 3. 연산 결과로 새 슬라이스 할당 가능
// 4. GC가 나중에 추적 + 회수

// Reth: U256 사용
let balance = old_balance + tx.value;
// 내부적으로:
// 1. U256 = [u64; 4] = 32 bytes → 스택에 배치
// 2. 덧셈은 wrapping_add + carry → 명령어 수 개
// 3. 결과도 스택 변수로 저장
// 4. 함수 종료 시 스택 포인터만 감소 (GC 없음)

// 블록 실행 1회에 발생하는 U256 연산:
// - 가스 계산: ~1000회
// - 잔고 변경: ~500회
// - 스토리지 값: ~5000회
// - 합계: ~10K+ U256 연산
//
// Geth: GC 압박 누적 → 간헐적 GC 휴지(~100ms)
// Reth: 스택 할당만 → 일정한 응답 시간`}
        </pre>
        <p className="leading-7">
          블록체인 실행은 <strong>짧은 생존 객체 수천 개</strong>를 빠르게 생성/소멸하는 워크로드.<br />
          Go의 GC는 이런 패턴에서 간헐적 휴지(pause)를 발생시킴 — RPC p99 latency에 반영.<br />
          Rust의 스택 할당 + 명시적 lifetime은 이 문제를 근본적으로 제거.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">왜 alloy인가?</h3>
      <div className="space-y-2 mb-8">
        {WHY_ALLOY.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose mt-6">
        <RLPEncodingViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: 작은 타입의 큰 차이</p>
          <p className="mt-2">
            Address는 20바이트, B256은 32바이트 — 작은 타입이지만 블록 실행에서 수만 번 사용.<br />
            이 타입의 할당 방식이 전체 성능 특성을 결정.
          </p>
          <p className="mt-2">
            const 제네릭의 다른 이점:<br />
            1. <strong>메서드 공유</strong> — from_slice, to_vec 등이 모든 N에 자동 적용<br />
            2. <strong>trait impl 한 번</strong> — Debug, Hash, Serialize 등 1회 구현<br />
            3. <strong>타입 안전</strong> — 잘못된 크기 혼합 방지 (B256 자리에 Address 넣으면 컴파일 에러)
          </p>
          <p className="mt-2">
            결론: 언어 기능(const generics)이 도메인 설계(이더리움 primitives)와 깔끔히 맞물림.
          </p>
        </div>
      </div>
    </section>
  );
}
