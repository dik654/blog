import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import BytesBloomViz from './viz/BytesBloomViz';

export default function BytesAndBloom({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="bytes-bloom" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bytes, Bloom Filter</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          FixedBytes는 고정 크기 데이터용이다.<br />
          calldata, 로그 데이터, 컨트랙트 바이트코드처럼 크기가 런타임에 결정되는 데이터는 <code>Bytes</code>(bytes crate)를 사용한다.<br />
          Arc 기반 참조 카운팅으로 clone 시 데이터 복사 없이 포인터만 공유한다.
        </p>
        <p className="leading-7">
          Bloom 필터는 2048비트(256바이트) 고정 크기 비트맵이다.<br />
          각 로그 토픽을 Keccak256으로 해시한 뒤, 처음 6바이트를 2바이트씩 쌍으로 사용해 3개의 비트 위치(mod 2048)를 결정하고 해당 비트를 1로 설정한다.
        </p>
        <p className="leading-7">
          <code>eth_getLogs</code> RPC 호출 시 블룸 필터로 O(1) 사전 필터링을 수행한다.<br />
          블룸 검사를 통과한 블록만 실제 로그를 확인하므로 검색 범위가 크게 줄어든다.<br />
          false positive(실제로는 없는데 있다고 판정)은 가능하지만, false negative(있는데 없다고 판정)은 불가능하다.
        </p>

        {/* ── Bytes 구조체 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bytes — Arc 기반 zero-copy 공유</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <div className="rounded border border-border bg-background px-3 py-2 text-sm mb-3">
            <code>pub use bytes::Bytes;</code>{' '}<span className="text-muted-foreground">// alloy-primitives가 bytes crate 재export</span>
          </div>
          <p className="text-sm font-semibold mb-2">내부 구조 (단순화)</p>
          <div className="grid grid-cols-3 gap-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>ptr: *const u8</code> — 데이터 시작</div>
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>len: usize</code> — 길이</div>
            <div className="rounded border border-border bg-background px-3 py-1.5"><code>{'data: AtomicPtr<Shared>'}</code> — 참조 카운터</div>
          </div>
          <p className="text-sm font-semibold mb-2">주요 메서드</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2"><code>tx.input.clone()</code> — Arc::clone, 데이터 복사 없음</div>
            <div className="rounded border border-border bg-background px-3 py-2"><code>calldata.slice(4..)</code> — [4..] 뷰, 복사 없음</div>
          </div>
          <p className="text-sm font-semibold mb-2">사용처: calldata, logs, bytecode, RLP payload, RPC 응답, TX input</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-border bg-background px-3 py-2">
              <p className="font-medium mb-1"><code>{'Vec<u8>'}</code> — 언제?</p>
              <p className="text-muted-foreground">가변, 소유권 고유, clone 시 전체 복사 → 수정 가능한 버퍼 (RLP 인코딩 중)</p>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <p className="font-medium mb-1"><code>Bytes</code> — 언제?</p>
              <p className="text-muted-foreground">불변, 참조 카운트, clone 시 포인터 복사 (1ns) → 여러 곳에서 공유할 불변 데이터</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>bytes::Bytes</code>는 Tokio 생태계의 핵심 타입 — Arc로 참조 카운트되는 불변 바이트 슬라이스.<br />
          clone 비용이 O(1) (참조 카운터 증가만) → 여러 스레드 간 공유에 이상적.<br />
          RPC 응답 본문, calldata 캐싱 등 "읽기만 자주 하는" 데이터에 적합.
        </p>

        {/* ── Bloom 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bloom — 2048비트 확률 필터</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <div className="rounded border border-border bg-background px-3 py-2 text-sm mb-3">
            <code>{'pub struct Bloom(pub FixedBytes<256>);'}</code>{' '}<span className="text-muted-foreground">// 256바이트 = 2048비트</span>
          </div>
          <p className="text-sm font-semibold mb-2"><code>accrue(input)</code> — 입력을 블룸 필터에 추가</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-violet-500 shrink-0">1.</span>
              <span><code>keccak256(input)</code> → 32바이트 해시</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-violet-500 shrink-0">2.</span>
              <span>처음 6바이트를 2바이트씩 3쌍으로 분할</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-violet-500 shrink-0">3.</span>
              <span>각 쌍: <code>(hash[i] * 256 + hash[i+1]) % 2048</code> → 비트 인덱스 (0~2047)</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-violet-500 shrink-0">4.</span>
              <span><code>byte_idx = 255 - bit_pos / 8</code> (역순 엔디안) → 해당 비트 켜기</span>
            </div>
          </div>
          <p className="text-sm font-semibold mb-2">입력별 3개 비트 켜짐</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-2">
            <div className="rounded border border-border bg-background px-3 py-1.5">토픽 A → 비트 123, 567, 1890</div>
            <div className="rounded border border-border bg-background px-3 py-1.5">토픽 B → 비트 234, 789, 1456</div>
            <div className="rounded border border-border bg-background px-3 py-1.5">주소 C → 비트 100, 200, 1000</div>
          </div>
          <p className="text-xs text-muted-foreground">블록 블룸 = 모든 로그 항목의 블룸 OR</p>
        </div>
        <p className="leading-7">
          2048비트(256바이트)는 이더리움 스펙 고정 — 헤더의 <code>logs_bloom</code> 필드.<br />
          해시 hash&#91;0..6&#93;을 3쌍으로 쪼개어 3개 비트 설정 = 각 입력당 3비트.<br />
          <code>byte_idx = 255 - bit_pos / 8</code>의 역순은 big-endian 바이트 순서를 맞추기 위함.
        </p>

        {/* ── false positive 수학 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">false positive 확률 — 수학적 분석</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-sm font-semibold mb-2">Bloom filter 파라미터</p>
          <div className="grid grid-cols-3 gap-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2 text-center"><span className="font-semibold">m</span> = 2048 비트</div>
            <div className="rounded border border-border bg-background px-3 py-2 text-center"><span className="font-semibold">k</span> = 3 해시 함수</div>
            <div className="rounded border border-border bg-background px-3 py-2 text-center"><span className="font-semibold">n</span> = 블록 내 로그 항목 수</div>
          </div>
          <p className="text-sm font-semibold mb-2">확률 공식</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2">단일 비트가 0일 확률: <code>P(bit=0) = (1 - 1/m)^(k*n)</code></div>
            <div className="rounded border border-border bg-background px-3 py-2">false positive 확률: <code>P(FP) = (1 - (1-1/m)^(k*n))^k</code></div>
          </div>
          <div className="rounded border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-sm mb-4">
            메인넷 평균: n ~ 500 (블록당 로그 항목) → <strong>P(FP) ~ 0.18% = 1/550</strong>
          </div>
          <p className="text-sm font-semibold mb-2"><code>eth_getLogs</code> 사용 흐름</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-violet-500 shrink-0">1.</span>
              <span>요청 토픽의 블룸 비트 3개 계산</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-violet-500 shrink-0">2.</span>
              <span>모든 블록 헤더 순회 (수천만)</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-violet-500 shrink-0">3.</span>
              <span><code>logs_bloom &amp; query_bloom == query_bloom</code> 검사</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-violet-500 shrink-0">4.</span>
              <span>통과한 블록만 실제 로그 조회 → 10만 블록 중 수천 블록만</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Bloom filter의 본질: <strong>공간 효율과 정확도의 trade-off</strong>.<br />
          2048비트 = 256바이트로 블록당 수백 로그 항목 요약 → 압축률 매우 높음.<br />
          false positive ~0.2%는 실용적 — 대부분의 false는 걸러지므로 eth_getLogs 대역폭 크게 감소.
        </p>

        {/* ── contains 검사 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">블룸 검사 — contains_bloom</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-sm font-semibold mb-2">주요 메서드</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>contains_input(&amp;self, input: BloomInput) -&gt; bool</code>
              <p className="text-muted-foreground mt-1">단일 입력 포함 여부 — query 블룸 생성 후 <code>contains_bloom</code> 호출</p>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>contains_bloom(&amp;self, other: &amp;Bloom) -&gt; bool</code>
              <p className="text-muted-foreground mt-1">superset 검사: <code>self &amp; other == other</code> (bitwise AND)</p>
            </div>
          </div>
          <div className="rounded border border-border bg-background px-3 py-2 text-sm mb-4">
            256바이트 비교 → SIMD 최적화 가능 (x86 AVX2: 32B씩 8번 비교 = 수 나노초)
          </div>
          <p className="text-sm font-semibold mb-2"><code>eth_getLogs</code> 필터 매칭 로직</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">주소 필터</span> — <code>filter.addresses</code> 중 하나라도 블룸 포함이면 통과, 모두 불포함이면 skip
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">토픽 필터</span> — 각 <code>topic_set</code>에서 하나 이상 포함이면 통과, 아니면 skip
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">결과</span> — 모든 필터 블룸 통과 → 실제 로그 조회 필요
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>contains_bloom</code>은 <strong>subset 검사</strong> — query의 켜진 비트가 전부 block_bloom에도 켜졌는지.<br />
          256바이트 iteration에 SIMD 최적화 적용 가능 — 수 나노초에 완료.<br />
          eth_getLogs는 블록 수천만 순회 × 블룸 검사 × 0.1초 이내 = 블룸이 효과적이어야만 현실적.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: Bloom 파라미터 선택의 합리성</p>
          <p className="mt-2">
            이더리움 블룸의 2048비트 / k=3는 임의 선택이 아님:<br />
            - m=2048, k=3으로 선택한 이유: 블록당 평균 500개 항목에서 FP ~0.2% 유지<br />
            - 비트가 더 많으면 (4096) → FP는 낮지만 헤더 크기 증가<br />
            - 해시 함수 더 많으면 (k=5) → FP는 낮지만 계산 증가 + 비트 과포화 위험
          </p>
          <p className="mt-2">
            Keccak256 재활용:<br />
            - 3개의 독립 해시 함수가 필요하지만, Keccak256 1번 호출로 32바이트 해시 생성<br />
            - 하위 6바이트를 2바이트씩 3쌍으로 쪼개 3개 비트 위치 도출<br />
            - 호출 1회 = 3개 해시 함수 효과
          </p>
          <p className="mt-2">
            실제 가치 판단:<br />
            - light client, archive 노드, indexer 전부 블룸 의존<br />
            - 블룸 없으면 eth_getLogs가 전체 블록 스캔 필요 → 수 분<br />
            - 블룸 덕분에 eth_getLogs 응답 &lt; 1초 가능
          </p>
        </div>
      </div>

      <div className="not-prose">
        <BytesBloomViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
