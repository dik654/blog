import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import RlpDecodeViz from './viz/RlpDecodeViz';

export default function RlpDecoding({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="rlp-decoding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RLP 디코딩 상세</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          RLP 디코딩은 인코딩의 역과정이다.<br />
          첫 바이트를 읽어 Header를 파싱하고, <code>list</code> 필드로 문자열/리스트를 구분한 뒤 재귀적으로 디코딩한다.
        </p>
        <p className="leading-7">
          디코딩 에러는 4가지 타입으로 분류된다.<br />
          <code>UnexpectedLength</code>는 선언된 길이와 실제 데이터가 불일치할 때, <code>LeadingZero</code>는 정수 앞에 불필요한 0x00이 있을 때 발생한다.<br />
          <code>Overflow</code>는 대상 타입의 크기를 초과할 때, <code>InputTooShort</code>는 버퍼가 부족할 때 발생한다.
        </p>
        <p className="leading-7">
          <code>decode_exact</code>는 보안에 중요한 함수다.<br />
          <code>T::decode()</code> 후 입력 버퍼에 바이트가 남아 있으면 에러를 반환한다.<br />
          트랜잭션 해시 검증에서 여분의 바이트가 무시되면 다른 해시가 같은 트랜잭션으로 취급될 수 있다.
        </p>

        {/* ── 디코딩 state machine ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Header 파싱 — 첫 바이트로 상태 전이</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-sm font-semibold mb-2"><code>decode_header(buf: &amp;mut &amp;[u8]) -&gt; Result&lt;Header, Error&gt;</code></p>
          <p className="text-sm text-muted-foreground mb-3">첫 바이트를 읽고 소비한 뒤, <code>match byte</code>로 4가지 케이스 분기</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-semibold">케이스 1</span> <code>0x00~0x7f</code>: 단일 바이트 문자열 — 바이트 자체가 데이터, header 없음 → <code>{'{ list: false, payload_length: 1 }'}</code>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-semibold">케이스 2</span> <code>0x80~0xb7</code>: 짧은 문자열 — <code>len = byte - 0x80</code> → <code>{'{ list: false, payload_length: len }'}</code>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-semibold">케이스 3</span> <code>0xc0~0xf7</code>: 짧은 리스트 — <code>len = byte - 0xc0</code> → <code>{'{ list: true, payload_length: len }'}</code>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-semibold">케이스 4</span> 나머지: 긴 문자열/리스트 → <code>decode_long_header(buf, byte)</code>
            </div>
          </div>
          <p className="text-sm font-semibold mb-2">긴 형식 (payload &gt; 55바이트)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>0xb8~0xbf</code>: 긴 문자열<br /><span className="text-muted-foreground">len_of_len = byte - 0xb7</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <code>0xf8~0xff</code>: 긴 리스트<br /><span className="text-muted-foreground">len_of_len = byte - 0xf7</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">len_of_len 바이트로 payload 길이를 big-endian으로 읽음</p>
        </div>
        <p className="leading-7">
          Header 파싱은 <strong>단일 바이트 match</strong>로 4가지 케이스 분기.<br />
          match 표현식이 LLVM에 의해 jump table로 컴파일 → O(1) 디스패치.<br />
          모든 RLP 값의 첫 바이트 범위가 서로 겹치지 않아 파싱이 모호하지 않음.
        </p>

        {/* ── 에러 타입별 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">4가지 디코딩 에러 — 공격 차단 지점</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <div className="space-y-2 text-sm mb-4">
            <div className="rounded border border-red-200 dark:border-red-800 bg-background px-3 py-2">
              <span className="font-semibold">UnexpectedLength</span> — 선언된 길이와 실제 데이터 불일치
              <p className="text-xs text-muted-foreground mt-1">공격: payload_length를 과장해 다음 필드 침범 시도</p>
            </div>
            <div className="rounded border border-red-200 dark:border-red-800 bg-background px-3 py-2">
              <span className="font-semibold">LeadingZero</span> — 정수 앞의 불필요한 <code>0x00</code>
              <p className="text-xs text-muted-foreground mt-1">공격: U256(15)를 <code>[0x00, 0x0f]</code>로 인코딩 → 다른 해시 생성 시도</p>
            </div>
            <div className="rounded border border-red-200 dark:border-red-800 bg-background px-3 py-2">
              <span className="font-semibold">Overflow</span> — 대상 타입 크기 초과
              <p className="text-xs text-muted-foreground mt-1">공격: 33바이트 짜리 "U256" 인코딩 (U256은 최대 32B)</p>
            </div>
            <div className="rounded border border-red-200 dark:border-red-800 bg-background px-3 py-2">
              <span className="font-semibold">InputTooShort</span> — 버퍼 부족
              <p className="text-xs text-muted-foreground mt-1">공격: 일부러 짧은 입력 → 디코더가 버퍼 끝에서 무한 루프 시도</p>
            </div>
          </div>
          <p className="text-sm font-semibold mb-2"><code>decode_u64</code> — LeadingZero 검증 예시</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">1.</span>
              <span><code>decode_header(buf)?</code> → header 획득, list이면 에러</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">2.</span>
              <span>payload 추출 후 canonical 검증: <code>payload[0] != 0</code> (leading zero 금지)</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">3.</span>
              <span><code>payload.len() &lt;= 8</code> 검증 (u64 최대 8바이트), 초과 시 Overflow</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">4.</span>
              <span>big-endian 바이트 순회: <code>result = (result &lt;&lt; 8) | b</code></span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          4가지 에러는 <strong>공격 벡터별 방어</strong>:<br />
          - UnexpectedLength: 잘못된 길이 선언으로 메모리 과다 할당 시도 차단<br />
          - LeadingZero: 같은 값의 여러 표현으로 해시 불일치 만드는 공격 차단<br />
          - Overflow: 타입 크기 초과 값으로 panic 유발 차단<br />
          - InputTooShort: 버퍼 경계 넘어 접근 시도 차단
        </p>

        {/* ── decode_exact ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">decode_exact — trailing byte 공격 방어</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2">
              <p className="font-semibold mb-1"><code>decode_exact&lt;T&gt;(buf)</code></p>
              <p className="text-muted-foreground">디코딩 후 남은 바이트가 있으면 <code>UnexpectedLength</code> 에러 → 입력이 정확히 소진되어야 함</p>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <p className="font-semibold mb-1"><code>decode&lt;T&gt;(buf)</code></p>
              <p className="text-muted-foreground">남은 바이트 허용 — stream에서 여러 항목을 순차 읽을 때 사용</p>
            </div>
          </div>
          <div className="rounded border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm mb-4">
            <p className="font-semibold mb-1 text-red-700 dark:text-red-400">공격 시나리오 — decode()만 사용 시</p>
            <p className="text-muted-foreground">공격자가 TX 끝에 garbage 1바이트 추가 → <code>decode()</code>는 통과</p>
            <p className="text-muted-foreground mt-1"><code>keccak256(bad_tx_rlp) != keccak256(canonical_tx_rlp)</code> → 같은 TX인데 다른 해시 → replay 가능</p>
          </div>
          <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-sm">
            <p className="font-semibold mb-1 text-emerald-700 dark:text-emerald-400">방어: decode_exact 사용</p>
            <p className="text-muted-foreground"><code>decode_exact(&amp;bad_tx_rlp)</code> → <code>UnexpectedLength</code> 에러로 거부</p>
            <p className="text-muted-foreground mt-1">Reth TX 파싱은 반드시 <code>decode_exact</code> 사용 — Geth는 역사적으로 이런 검증 누락 버그가 발생</p>
          </div>
        </div>
        <p className="leading-7">
          <code>decode_exact</code>의 "정확히 소진" 요구가 <strong>non-malleability 보장</strong>.<br />
          "A와 같은 TX"를 생성하는 여러 RLP 표현을 모두 거부 → TX 해시가 유일.<br />
          이런 검증이 프로토콜 전체의 재전송(replay) 공격 저항성에 기여.
        </p>

        {/* ── 사용 예 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TX 디코딩 흐름</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-sm font-semibold mb-2"><code>decode_network_tx(bytes: &amp;[u8]) -&gt; Result&lt;TransactionSigned&gt;</code></p>
          <div className="space-y-2 text-sm mb-3">
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">1.</span>
              <div>
                <span className="font-medium">EIP-2718 envelope 검사</span> — 첫 바이트로 TX 타입 판별
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-1.5">
                  <span className="rounded border border-border bg-muted px-2 py-0.5 text-xs"><code>0x01</code> → Eip2930</span>
                  <span className="rounded border border-border bg-muted px-2 py-0.5 text-xs"><code>0x02</code> → Eip1559</span>
                  <span className="rounded border border-border bg-muted px-2 py-0.5 text-xs"><code>0x03</code> → Eip4844</span>
                  <span className="rounded border border-border bg-muted px-2 py-0.5 text-xs"><code>&gt;=0xc0</code> → Legacy</span>
                </div>
              </div>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">2.</span>
              <span><span className="font-medium">타입별 디코딩</span> — 각 TX 타입 struct의 <code>decode_exact</code> 호출 (Legacy는 전체 bytes, 나머지는 <code>bytes[1..]</code>)</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">3.</span>
              <span><span className="font-medium">서명 검증</span> — <code>tx.recover_signer()?</code> (ecrecover)</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">4.</span>
              <span><span className="font-medium">TX 해시 계산</span> — <code>keccak256(bytes)</code> (canonical RLP 기반)</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">결과: <code>TransactionSigned {'{'} transaction, signature, hash {'}'}</code></p>
        </div>
        <p className="leading-7">
          EIP-2718 "TX envelope"로 타입별 구조 구분 — 첫 바이트 &lt; 0xc0이면 타입 prefix.<br />
          각 TX 타입마다 별도 struct + <code>decode_exact</code> 호출 → 잘못된 필드 개수/타입 거부.<br />
          디코딩 성공 후 <strong>서명 검증 + 해시 계산</strong>이 뒤따라 완전한 TX 구조로 전환.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 보안 인사이트: 디코더의 엄격함</p>
          <p className="mt-2">
            암호학 프로토콜에서 <strong>디코더가 가장 민감한 지점</strong>:<br />
            - 외부 입력이 파싱되는 유일한 entry point<br />
            - 잘못된 입력을 관대하게 처리하면 해시 불일치 공격 가능<br />
            - "모든 bytes가 완전히 소비되었는가"가 마지막 방어선
          </p>
          <p className="mt-2">
            alloy-rlp의 방어 설계:<br />
            1. 4가지 에러 타입으로 공격 벡터별 차단<br />
            2. <code>decode_exact</code>로 trailing bytes 검증<br />
            3. <code>LeadingZero</code> 검증으로 canonical 강제<br />
            4. <code>Overflow</code> 검증으로 타입 크기 초과 방지
          </p>
          <p className="mt-2">
            역사적 사례:<br />
            - 2018년 Parity 노드의 RLP 파서 버그 → 합의 분열<br />
            - Ethereum Classic에서 RLP 악용으로 DoS 공격 발생<br />
            - 엄격한 디코더가 보안의 핵심 방어선
          </p>
        </div>
      </div>

      <div className="not-prose">
        <RlpDecodeViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
