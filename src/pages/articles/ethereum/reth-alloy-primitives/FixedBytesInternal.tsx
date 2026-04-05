import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import FixedBytesViz from './viz/FixedBytesViz';

export default function FixedBytesInternal({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="fixed-bytes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FixedBytes&lt;N&gt; 내부 구현</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          alloy-primitives의 핵심은 <code>{'FixedBytes<N>'}</code>이다.<br />
          N은 const 제네릭 파라미터로, 컴파일 타임에 크기가 결정된다.<br />
          <code>#[repr(transparent)]</code> 어트리뷰트가 메모리 레이아웃을 내부 <code>[u8; N]</code>과 동일하게 보장한다.
        </p>
        <p className="leading-7">
          <code>{'Deref<Target=[u8;N]>'}</code>를 구현해서 슬라이스의 모든 메서드를 자동으로 위임받는다.<br />
          <code>len()</code>, <code>iter()</code>, <code>contains()</code> 같은 메서드를 FixedBytes에서 직접 호출할 수 있는 이유다.
        </p>
        <p className="leading-7">
          Address와 B256은 이 FixedBytes의 뉴타입(newtype) 래퍼다.<br />
          <code>Address(FixedBytes&lt;20&gt;)</code>과 <code>B256(FixedBytes&lt;32&gt;)</code>는 타입이 다르므로 실수로 혼용하면 컴파일 에러가 발생한다.<br />
          Geth의 <code>[20]byte</code>와 <code>[32]byte</code>는 바이트 배열 앨리어스라 혼용이 가능하다.
        </p>

        {/* ── 전체 struct 정의 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">FixedBytes 구조체 전체</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// alloy-primitives/src/bits/fixed.rs
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(transparent)]  // memory layout == [u8; N]
pub struct FixedBytes<const N: usize>(pub [u8; N]);

// 상수 constructor
impl<const N: usize> FixedBytes<N> {
    pub const ZERO: Self = Self([0u8; N]);

    /// 리터럴 생성 (const context)
    pub const fn new(bytes: [u8; N]) -> Self {
        Self(bytes)
    }

    /// 슬라이스 → FixedBytes (길이 검증)
    pub fn from_slice(src: &[u8]) -> Self {
        assert_eq!(src.len(), N);
        let mut arr = [0u8; N];
        arr.copy_from_slice(src);
        Self(arr)
    }

    /// FixedBytes → hex 문자열
    pub fn to_hex(&self) -> String {
        format!("0x{}", hex::encode(self.0))
    }
}`}
        </pre>
        <p className="leading-7">
          <code>#[repr(transparent)]</code>이 핵심 — Rust가 <code>FixedBytes&lt;N&gt;</code>과 <code>[u8; N]</code>을 같은 레이아웃으로 강제.<br />
          덕분에 <code>{'unsafe { std::mem::transmute::<FixedBytes<20>, [u8; 20]>(x) }'}</code> 같은 변환이 안전.<br />
          <code>derive(Copy)</code> — 32바이트까지는 함수 인자로 <strong>값 복사</strong>가 참조보다 빠름 (캐시 라인 1개 안에 들어감).
        </p>

        {/* ── Deref 자동 위임 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Deref — 슬라이스 메서드 자동 위임</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Deref trait 구현
impl<const N: usize> Deref for FixedBytes<N> {
    type Target = [u8; N];
    fn deref(&self) -> &[u8; N] { &self.0 }
}

impl<const N: usize> DerefMut for FixedBytes<N> {
    fn deref_mut(&mut self) -> &mut [u8; N] { &mut self.0 }
}

// 사용 시 자동 deref coercion:
let hash: B256 = keccak256(&data);

// 아래 모든 메서드가 [u8; 32]에서 자동 위임됨
hash.len()            // 32
hash.iter()           // 바이트 이터레이터
hash.chunks(4)        // 4바이트 청크 이터레이터
hash[0..4]            // 슬라이싱
hash.contains(&0xFF)  // 바이트 검색

// AsRef / Borrow trait도 구현되어 슬라이스 받는 함수에 직접 전달 가능
fn process(data: &[u8]) { ... }
process(&hash);  // &B256 → &[u8; 32] → &[u8] 자동 변환`}
        </pre>
        <p className="leading-7">
          <code>Deref coercion</code>은 Rust의 핵심 기능 — <code>&amp;FixedBytes&lt;N&gt;</code>이 필요한 곳에 슬라이스 메서드를 직접 호출 가능.<br />
          <code>FixedBytes</code>는 <strong>사용자 관점에서 &#91;u8; N&#93;과 구분되지 않음</strong> — 타입 안전성만 추가.<br />
          Geth의 <code>[32]byte</code>를 사용하는 것과 동일한 편의성을 제공하면서도 컴파일 타임 타입 검증.
        </p>

        {/* ── newtype 래핑 이유 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Newtype 패턴 — Address와 B256의 타입 분리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 뉴타입 래퍼 정의
#[repr(transparent)]
pub struct Address(pub B160);  // B160 = FixedBytes<20>

#[repr(transparent)]
pub struct B256(pub FixedBytes<32>);

// 이 두 타입은 메모리 레이아웃은 각각 20바이트/32바이트 배열이지만
// Rust 타입 시스템에서는 완전히 별개 타입

// 컴파일 에러 시나리오:
fn send_to(recipient: Address) { /* ... */ }

let tx_hash: B256 = get_tx_hash();
send_to(tx_hash);
// ❌ error[E0308]: mismatched types
//   expected struct \`Address\`, found struct \`B256\`

// Geth에서 동일한 실수:
type Address [20]byte
type Hash [32]byte

func sendTo(r Address) { }
var hash Hash
sendTo(hash[:20])  // ✓ 컴파일 통과 (Go는 슬라이스 변환 허용)
                   // 의도한 주소가 아닌데도 실행됨 → 버그

// 20바이트 해시의 하위를 주소로 착각하는 실수가 실제로 자주 발생`}
        </pre>
        <p className="leading-7">
          Newtype 패턴의 본질: <strong>같은 메모리 표현, 다른 타입</strong>.<br />
          성능 비용은 0 (&#91;u8; 20&#93;과 <code>Address</code>는 런타임에 구분 불가).<br />
          하지만 컴파일러가 두 타입의 혼용을 차단 — 블록체인 코드의 흔한 버그(해시/주소 혼동) 방지.
        </p>

        {/* ── 매크로 지원 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">리터럴 매크로 — 컴파일 타임 파싱</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// address!, b256!, fixed_bytes! 매크로
let vitalik: Address = address!("d8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
let genesis: B256 = b256!("d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3");

// 매크로 동작:
// 1. 컴파일 타임에 hex 문자열 파싱
// 2. [u8; N] 배열 생성
// 3. FixedBytes::new(arr)로 const constructor 호출
// 4. 길이 불일치 시 컴파일 에러

// 런타임 파싱(런타임 실패 가능):
let addr: Address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045".parse()?;

// 매크로 파싱(컴파일 실패 가능):
let addr: Address = address!("d8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
// ← 잘못된 hex는 컴파일 에러로 드러남 → 런타임 실패 불가능

// 체크섬 검증도 매크로에서 수행 가능 (EIP-55)
// 대문자가 엉뚱한 자리에 있으면 compile warning`}
        </pre>
        <p className="leading-7">
          <code>address!()</code>, <code>b256!()</code> 매크로가 리터럴 상수의 타입 안전 버전.<br />
          런타임 문자열 파싱 실패가 불가능 → 테스트 픽스처, 상수 정의에 이상적.<br />
          Rust의 const function + 프로시저 매크로 조합으로 구현.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: Newtype의 zero-cost 안전</p>
          <p className="mt-2">
            Newtype 패턴은 <strong>zero-cost 추상화</strong>의 대표 사례:<br />
            1. 메모리: <code>#[repr(transparent)]</code>로 0 비용<br />
            2. 성능: Deref로 내부 메서드 직접 접근<br />
            3. 안전: 컴파일러가 타입 혼용 차단
          </p>
          <p className="mt-2">
            비용 없이 얻는 것:<br />
            - Address를 기대한 함수에 B256을 넘기는 실수 방지<br />
            - HashMap&lt;Address, V&gt; vs HashMap&lt;B256, V&gt; 구분<br />
            - Serde 직렬화 시 타입별 다른 인코딩 (Address는 checksum, B256은 raw hex)
          </p>
          <p className="mt-2">
            Go의 type alias vs Rust의 newtype:<br />
            - Go: 같은 메모리, 유연한 변환 (안전성 부족)<br />
            - Rust: 같은 메모리, 엄격한 타입 (안전성 보장)
          </p>
        </div>
      </div>

      <div className="not-prose">
        <FixedBytesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
