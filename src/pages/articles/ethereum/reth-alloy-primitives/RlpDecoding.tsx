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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub fn decode_header(buf: &mut &[u8]) -> Result<Header, Error> {
    // 빈 버퍼 방어
    if buf.is_empty() { return Err(Error::InputTooShort); }

    let byte = buf[0];
    *buf = &buf[1..];  // 첫 바이트 소비

    match byte {
        // 케이스 1: 단일 바이트 문자열 (0x00 ~ 0x7f)
        //   바이트 자체가 데이터. header 없음.
        0..=0x7f => Ok(Header { list: false, payload_length: 1 }),

        // 케이스 2: 짧은 문자열 (length = byte - 0x80)
        //   0x80 = 빈 문자열, 0xb7 = 55바이트 문자열
        0x80..=0xb7 => {
            let len = (byte - 0x80) as usize;
            if buf.len() < len { return Err(Error::InputTooShort); }
            Ok(Header { list: false, payload_length: len })
        }

        // 케이스 3: 짧은 리스트 (payload length = byte - 0xc0)
        0xc0..=0xf7 => {
            let len = (byte - 0xc0) as usize;
            Ok(Header { list: true, payload_length: len })
        }

        // 케이스 4: 긴 문자열/리스트 (별도 함수)
        _ => decode_long_header(buf, byte),
    }
}

// 긴 형식 (payload > 55바이트):
// byte가 0xb8~0xbf: 긴 문자열, len_of_len = byte - 0xb7
// byte가 0xf8~0xff: 긴 리스트, len_of_len = byte - 0xf7
fn decode_long_header(buf: &mut &[u8], byte: u8) -> Result<Header, Error> {
    let (is_list, len_of_len) = if byte >= 0xf8 {
        (true, (byte - 0xf7) as usize)
    } else {
        (false, (byte - 0xb7) as usize)
    };
    // len_of_len 바이트로 payload 길이 읽기 (big-endian)
    let payload_length = decode_length(buf, len_of_len)?;
    Ok(Header { list: is_list, payload_length })
}`}
        </pre>
        <p className="leading-7">
          Header 파싱은 <strong>단일 바이트 match</strong>로 4가지 케이스 분기.<br />
          match 표현식이 LLVM에 의해 jump table로 컴파일 → O(1) 디스패치.<br />
          모든 RLP 값의 첫 바이트 범위가 서로 겹치지 않아 파싱이 모호하지 않음.
        </p>

        {/* ── 에러 타입별 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">4가지 디코딩 에러 — 공격 차단 지점</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub enum Error {
    /// 선언된 길이 ≠ 실제 데이터
    /// 공격: payload_length를 과장해 다음 필드 침범
    UnexpectedLength,

    /// 정수 앞의 불필요한 0x00
    /// 공격: U256(15)를 [0x00, 0x0f]로 인코딩 → 다른 해시 생성 시도
    LeadingZero,

    /// 대상 타입 크기 초과
    /// 공격: 33바이트 짜리 "U256" 인코딩 (34바이트 이상은 U256 표현 불가)
    Overflow,

    /// 버퍼 부족
    /// 공격: 일부러 짧은 입력 → 디코더가 버퍼 끝에서 무한 루프 시도
    InputTooShort,

    /// 기타
    Custom(&'static str),
}

// 정수 디코딩에서 LeadingZero 검증 예시:
fn decode_u64(buf: &mut &[u8]) -> Result<u64, Error> {
    let header = decode_header(buf)?;
    if header.list { return Err(Error::UnexpectedList); }

    let payload = &buf[..header.payload_length];
    *buf = &buf[header.payload_length..];

    // canonical 검증:
    // 1. payload가 비어 있으면 0
    // 2. payload[0] != 0 (leading zero 금지)
    // 3. payload.len() <= 8 (u64는 8바이트)
    if payload.len() > 1 && payload[0] == 0 {
        return Err(Error::LeadingZero);
    }
    if payload.len() > 8 {
        return Err(Error::Overflow);
    }

    let mut result = 0u64;
    for &b in payload {
        result = (result << 8) | (b as u64);
    }
    Ok(result)
}`}
        </pre>
        <p className="leading-7">
          4가지 에러는 <strong>공격 벡터별 방어</strong>:<br />
          - UnexpectedLength: 잘못된 길이 선언으로 메모리 과다 할당 시도 차단<br />
          - LeadingZero: 같은 값의 여러 표현으로 해시 불일치 만드는 공격 차단<br />
          - Overflow: 타입 크기 초과 값으로 panic 유발 차단<br />
          - InputTooShort: 버퍼 경계 넘어 접근 시도 차단
        </p>

        {/* ── decode_exact ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">decode_exact — trailing byte 공격 방어</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`/// 입력이 정확히 소진되어야 함
pub fn decode_exact<T: Decodable>(buf: &[u8]) -> Result<T, Error> {
    let mut remaining = buf;
    let result = T::decode(&mut remaining)?;

    // 디코딩 후 남은 바이트가 있으면 에러
    if !remaining.is_empty() {
        return Err(Error::UnexpectedLength);
    }
    Ok(result)
}

// vs decode() (일반 버전)
pub fn decode<T: Decodable>(buf: &mut &[u8]) -> Result<T, Error> {
    T::decode(buf)  // 남은 바이트 허용 (stream에서 여러 항목 읽을 때)
}

// 공격 시나리오 — decode()만 사용 시 취약:
// 공격자가 TX 끝에 garbage 1바이트 추가
let bad_tx_rlp = [...canonical_tx..., 0xFF];
let tx: TxLegacy = decode(&bad_tx_rlp)?;  // 통과!

// 문제: keccak256(bad_tx_rlp) ≠ keccak256(canonical_tx_rlp)
// 즉, 같은 내용 TX인데 다른 해시 → replay 공격 가능
//
// 방어: decode_exact 사용
let tx: TxLegacy = decode_exact(&bad_tx_rlp)?;  // UnexpectedLength 에러

// Reth의 TX 파싱은 반드시 decode_exact 사용
// Geth는 역사적으로 이런 검증 누락 버그가 몇 번 있었음`}
        </pre>
        <p className="leading-7">
          <code>decode_exact</code>의 "정확히 소진" 요구가 <strong>non-malleability 보장</strong>.<br />
          "A와 같은 TX"를 생성하는 여러 RLP 표현을 모두 거부 → TX 해시가 유일.<br />
          이런 검증이 프로토콜 전체의 재전송(replay) 공격 저항성에 기여.
        </p>

        {/* ── 사용 예 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TX 디코딩 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 네트워크에서 받은 TX 바이트 디코딩
pub fn decode_network_tx(bytes: &[u8]) -> Result<TransactionSigned> {
    // 1. EIP-2718 envelope 검사 (첫 바이트로 TX 타입 판별)
    let tx_type = match bytes[0] {
        0x01 => TxType::Eip2930,
        0x02 => TxType::Eip1559,
        0x03 => TxType::Eip4844,
        // legacy TX는 RLP list로 시작 (첫 바이트 >= 0xc0)
        b if b >= 0xc0 => TxType::Legacy,
        _ => return Err(InvalidTxType),
    };

    // 2. TX 타입별 디코딩
    let tx = match tx_type {
        TxType::Legacy => TxLegacy::decode_exact(bytes)?,
        TxType::Eip2930 => TxEip2930::decode_exact(&bytes[1..])?,
        TxType::Eip1559 => TxEip1559::decode_exact(&bytes[1..])?,
        TxType::Eip4844 => TxEip4844::decode_exact(&bytes[1..])?,
    };

    // 3. 서명 검증 (ecrecover)
    let sender = tx.recover_signer()?;

    // 4. TX 해시 계산 (canonical RLP의 keccak256)
    let tx_hash = keccak256(bytes);

    Ok(TransactionSigned { transaction: tx, signature, hash: tx_hash })
}`}
        </pre>
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
