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
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-xs text-muted-foreground mb-2">alloy-primitives/src/bits/fixed.rs</p>
          <div className="rounded border border-border bg-background px-3 py-2 text-sm mb-3">
            <code>{'#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]'}</code><br />
            <code>{'#[repr(transparent)]'}</code>{' '}<span className="text-muted-foreground">// memory layout == [u8; N]</span><br />
            <code>{'pub struct FixedBytes<const N: usize>(pub [u8; N]);'}</code>
          </div>
          <p className="text-sm font-semibold mb-2">주요 메서드</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>const ZERO: Self</code> — <code>Self([0u8; N])</code> — 모든 바이트 0
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>const fn new(bytes: [u8; N]) -&gt; Self</code> — const context에서 리터럴 생성
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>fn from_slice(src: &amp;[u8]) -&gt; Self</code> — 슬라이스에서 생성 (<code>assert_eq!(src.len(), N)</code>으로 길이 검증)
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>fn to_hex(&amp;self) -&gt; String</code> — <code>"0x" + hex::encode</code> 형식
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>#[repr(transparent)]</code>이 핵심 — Rust가 <code>FixedBytes&lt;N&gt;</code>과 <code>[u8; N]</code>을 같은 레이아웃으로 강제.<br />
          덕분에 <code>{'unsafe { std::mem::transmute::<FixedBytes<20>, [u8; 20]>(x) }'}</code> 같은 변환이 안전.<br />
          <code>derive(Copy)</code> — 32바이트까지는 함수 인자로 <strong>값 복사</strong>가 참조보다 빠름 (캐시 라인 1개 안에 들어감).
        </p>

        {/* ── Deref 자동 위임 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Deref — 슬라이스 메서드 자동 위임</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-sm font-semibold mb-2">Deref / DerefMut trait 구현</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>{'Deref<Target=[u8; N]>'}</code> — <code>&amp;self.0</code> 반환
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>DerefMut</code> — <code>&amp;mut self.0</code> 반환
            </div>
          </div>
          <p className="text-sm font-semibold mb-2">자동 위임되는 메서드 (deref coercion)</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>hash.len()</code> → 32</div>
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>hash.iter()</code> → 바이트 이터레이터</div>
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>hash.chunks(4)</code> → 청크 이터</div>
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>hash[0..4]</code> → 슬라이싱</div>
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>hash.contains(&amp;0xFF)</code> → 검색</div>
          </div>
          <div className="rounded border border-border bg-background px-3 py-2 text-sm">
            <code>AsRef</code> / <code>Borrow</code> trait도 구현 → <code>&amp;B256</code> → <code>&amp;[u8; 32]</code> → <code>&amp;[u8]</code> 자동 변환으로 슬라이스 받는 함수에 직접 전달 가능
          </div>
        </div>
        <p className="leading-7">
          <code>Deref coercion</code>은 Rust의 핵심 기능 — <code>&amp;FixedBytes&lt;N&gt;</code>이 필요한 곳에 슬라이스 메서드를 직접 호출 가능.<br />
          <code>FixedBytes</code>는 <strong>사용자 관점에서 &#91;u8; N&#93;과 구분되지 않음</strong> — 타입 안전성만 추가.<br />
          Geth의 <code>[32]byte</code>를 사용하는 것과 동일한 편의성을 제공하면서도 컴파일 타임 타입 검증.
        </p>

        {/* ── newtype 래핑 이유 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Newtype 패턴 — Address와 B256의 타입 분리</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-sm font-semibold mb-2">뉴타입 래퍼 정의</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>#[repr(transparent)]</code><br /><code>pub struct Address(pub B160);</code>{' '}<span className="text-muted-foreground">// 20B</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>#[repr(transparent)]</code><br /><code>{'pub struct B256(pub FixedBytes<32>);'}</code>{' '}<span className="text-muted-foreground">// 32B</span>
            </div>
          </div>
          <p className="text-sm mb-3">메모리 레이아웃은 각각 20/32바이트 배열이지만, Rust 타입 시스템에서는 <strong>완전히 별개 타입</strong></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3">
              <p className="font-semibold mb-1 text-emerald-700 dark:text-emerald-400">Rust — 컴파일 에러</p>
              <p className="leading-6"><code>let tx_hash: B256 = get_tx_hash();</code></p>
              <p className="leading-6"><code>send_to(tx_hash);</code></p>
              <p className="text-xs text-red-500 mt-1">error[E0308]: expected Address, found B256</p>
            </div>
            <div className="rounded border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3">
              <p className="font-semibold mb-1 text-red-700 dark:text-red-400">Go — 컴파일 통과 (버그)</p>
              <p className="leading-6"><code>sendTo(hash[:20])</code></p>
              <p className="text-xs text-red-500 mt-1">의도한 주소가 아닌데도 실행됨</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">20바이트 해시의 하위를 주소로 착각하는 실수가 실제로 자주 발생</p>
        </div>
        <p className="leading-7">
          Newtype 패턴의 본질: <strong>같은 메모리 표현, 다른 타입</strong>.<br />
          성능 비용은 0 (&#91;u8; 20&#93;과 <code>Address</code>는 런타임에 구분 불가).<br />
          하지만 컴파일러가 두 타입의 혼용을 차단 — 블록체인 코드의 흔한 버그(해시/주소 혼동) 방지.
        </p>

        {/* ── 매크로 지원 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">리터럴 매크로 — 컴파일 타임 파싱</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-sm font-semibold mb-2">사용 예시</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>{'address!("d8dA6BF26964aF9D7eEd9e03E53415D37aA96045")'}</code> → <code>Address</code>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>{'b256!("d4e56740f876aef8c010b86a40d5f56745a118d0...")'}</code> → <code>B256</code>
            </div>
          </div>
          <p className="text-sm font-semibold mb-2">매크로 동작 (4단계)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-1.5">1. 컴파일 타임에 hex 문자열 파싱</div>
            <div className="rounded border border-border bg-background px-3 py-1.5">2. <code>[u8; N]</code> 배열 생성</div>
            <div className="rounded border border-border bg-background px-3 py-1.5">3. <code>FixedBytes::new(arr)</code> const constructor</div>
            <div className="rounded border border-border bg-background px-3 py-1.5">4. 길이 불일치 시 컴파일 에러</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-red-200 dark:border-red-800 bg-background px-3 py-2">
              <p className="font-medium mb-1">런타임 파싱 (실패 가능)</p>
              <code>"0xd8dA...".parse::&lt;Address&gt;()?</code>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-background px-3 py-2">
              <p className="font-medium mb-1">매크로 파싱 (런타임 실패 불가능)</p>
              <code>{'address!("d8dA...")'}</code> — 잘못된 hex는 컴파일 에러
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">EIP-55 체크섬 검증도 매크로에서 수행 — 대문자가 엉뚱한 자리에 있으면 compile warning</p>
        </div>
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
