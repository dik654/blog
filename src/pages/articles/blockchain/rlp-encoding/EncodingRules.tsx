import { CitationBlock } from '../../../../components/ui/citation';

export default function EncodingRules() {
  return (
    <section id="encoding-rules" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인코딩 규칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          RLP 인코딩은 5가지 규칙으로 정의됩니다. 데이터의 타입(문자열 vs 리스트)과
          길이에 따라 적절한 접두사를 선택합니다.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">규칙 1: 단일 바이트 (0x00~0x7f)</h3>
        <p>
          값이 0x00에서 0x7f 사이인 단일 바이트는 접두사 없이 그대로 출력됩니다.
          이는 ASCII 문자 범위와 일치합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`RLP("a") = [0x61]           // 'a'의 ASCII = 0x61, 0x7f 이하이므로 그대로
RLP(0x00) = [0x00]           // 0x00도 그대로
RLP(0x7f) = [0x7f]           // 최대 단일 바이트 값
RLP(15)   = [0x0f]           // 정수 15 = 0x0f`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">규칙 2: 0-55 바이트 문자열</h3>
        <p>
          길이가 0-55 바이트인 문자열은 <code>0x80 + length</code>를 접두사로 사용합니다.
          따라서 접두사 범위는 <code>[0x80, 0xb7]</code>입니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`RLP("") = [0x80]             // 빈 문자열: 0x80 + 0 = 0x80
RLP("dog") = [0x83, 'd', 'o', 'g']
  // 길이 3: 0x80 + 3 = 0x83

RLP("Lorem ipsum dolor sit amet")
  = [0x9a, 'L', 'o', 'r', ...]
  // 길이 26: 0x80 + 26 = 0x9a`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">규칙 3: 55 바이트 초과 문자열</h3>
        <p>
          길이가 55 바이트를 초과하는 문자열은 <code>0xb7 + length-of-length</code>를 접두사로 사용하고,
          그 뒤에 길이를 big-endian으로 인코딩합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`예: 1024 바이트 문자열
  길이 = 1024 = 0x0400 (2 bytes로 표현)
  length-of-length = 2

  RLP = [0xb9, 0x04, 0x00, ...1024 bytes...]
  // 0xb7 + 2 = 0xb9, 이후 2-byte 길이, 이후 데이터

접두사 범위: [0xb8, 0xbf]
  0xb8 = 길이가 1 byte로 표현 (56~255 bytes)
  0xb9 = 길이가 2 bytes로 표현 (256~65535 bytes)
  ...`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">규칙 4: 0-55 바이트 리스트</h3>
        <p>
          총 페이로드(모든 항목의 RLP 인코딩 합)가 0-55 바이트인 리스트는
          <code>0xc0 + total_length</code>를 접두사로 사용합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`RLP(["cat", "dog"])
  = [0xc8, 0x83, 'c', 'a', 't', 0x83, 'd', 'o', 'g']

  분해:
    RLP("cat") = [0x83, 'c', 'a', 't']  → 4 bytes
    RLP("dog") = [0x83, 'd', 'o', 'g']  → 4 bytes
    총 페이로드 = 8 bytes
    접두사 = 0xc0 + 8 = 0xc8

RLP([]) = [0xc0]             // 빈 리스트: 0xc0 + 0 = 0xc0

RLP([[]]) = [0xc1, 0xc0]    // 중첩 빈 리스트
  RLP([]) = [0xc0] → 1 byte
  접두사 = 0xc0 + 1 = 0xc1`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">규칙 5: 55 바이트 초과 리스트</h3>
        <p>
          총 페이로드가 55 바이트를 초과하는 리스트는 <code>0xf7 + length-of-length</code>를
          접두사로 사용하고, 그 뒤에 총 길이를 big-endian으로 인코딩합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`예: 총 페이로드가 256 바이트인 리스트
  길이 = 256 = 0x0100 (2 bytes로 표현)
  length-of-length = 2

  RLP = [0xf9, 0x01, 0x00, ...페이로드...]
  // 0xf7 + 2 = 0xf9

접두사 범위: [0xf8, 0xff]`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">빈 문자열 vs 빈 리스트</h3>
        <p>
          RLP에서 빈 문자열과 빈 리스트는 서로 다른 인코딩을 가집니다.
          이 구분은 디코딩 시 정확한 타입 복원을 가능하게 합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`RLP("") = [0x80]    // 빈 문자열
RLP([]) = [0xc0]    // 빈 리스트

RLP(0)  = [0x80]    // 정수 0은 빈 바이트 문자열로 인코딩

구분 기준:
  첫 바이트 < 0xc0  → 문자열 (string)
  첫 바이트 >= 0xc0 → 리스트 (list)

전체 접두사 맵:
  [0x00, 0x7f] → 단일 바이트 (그대로)
  [0x80, 0xb7] → 짧은 문자열 (0-55 bytes)
  [0xb8, 0xbf] → 긴 문자열 (55+ bytes)
  [0xc0, 0xf7] → 짧은 리스트 (0-55 bytes 페이로드)
  [0xf8, 0xff] → 긴 리스트 (55+ bytes 페이로드)`}</code></pre>

        <h3 className="text-lg font-semibold mt-6 mb-3">종합 예시</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// 복잡한 중첩 구조
RLP(["zw", [4], 1])

1단계: 각 항목 인코딩
  RLP("zw") = [0x82, 'z', 'w']         → 3 bytes
  RLP([4])  = [0xc1, 0x04]             → 2 bytes
  RLP(1)    = [0x01]                    → 1 byte

2단계: 총 페이로드 = 3 + 2 + 1 = 6 bytes
  접두사 = 0xc0 + 6 = 0xc6

결과: [0xc6, 0x82, 'z', 'w', 0xc1, 0x04, 0x01]`}</code></pre>

        <CitationBlock source="Ethereum Yellow Paper, Appendix B — Recursive Length Prefix" citeKey={1} type="paper" href="https://ethereum.github.io/yellowpaper/paper.pdf">
          <p className="italic text-foreground/80">
            &quot;We define the RLP function as injecting into the set of all possible byte arrays.
            We require that the byte-length of the serialised integer is minimal, with no leading zeroes.&quot;
          </p>
          <p className="mt-2 text-xs">
            Yellow Paper의 Appendix B는 RLP의 수학적 정의를 제공합니다. R_b(문자열 인코딩)와
            R_l(리스트 인코딩) 함수가 재귀적으로 정의되며, BE(x) 함수로 big-endian 변환을 설명합니다.
          </p>
        </CitationBlock>

        <CitationBlock source="EIP-2718: Typed Transaction Envelope" citeKey={2} type="paper" href="https://eips.ethereum.org/EIPS/eip-2718">
          <p className="italic text-foreground/80">
            &quot;TransactionType || TransactionPayload — where TransactionType is a positive unsigned
            8-bit number and TransactionPayload is an opaque byte array whose interpretation is
            dependent on the TransactionType.&quot;
          </p>
          <p className="mt-2 text-xs">
            EIP-2718은 트랜잭션 타입 접두사를 도입하여 RLP 기반 레거시 트랜잭션과
            새로운 타입의 트랜잭션을 구분합니다. Type 0은 기존 RLP 인코딩,
            Type 1(EIP-2930)과 Type 2(EIP-1559)는 타입 바이트 + RLP 형식을 사용합니다.
          </p>
        </CitationBlock>

      </div>
    </section>
  );
}
