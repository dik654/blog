import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function EncodeDecode({ onCodeRef }: Props) {
  return (
    <section id="encode-decode" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인코딩 & 디코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── fixed vs variable ── */}
        <h3 className="text-xl font-semibold mt-2 mb-3">Fixed vs Variable 구분 — 컴파일 타임 결정</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 각 SSZ 타입이 fixed-size인지 판별하는 규칙

// Fixed-size인 경우:
// - basic types (uint8~uint256, bool, byte)
// - Vector[T, N]: T가 fixed + N 고정 → fixed
// - Container: 모든 필드가 fixed → fixed
// - Bitvector[N]: 항상 fixed

// Variable-size인 경우:
// - List[T, N]: 원소 개수가 런타임 결정
// - Bitlist[N]: 비트 개수가 런타임 결정
// - Vector/Container 중 하나라도 variable 필드 포함
// - Union: tagged union

// 예시:
struct Validator {
    pubkey: Vector[byte, 48],              // fixed (48)
    withdrawal_credentials: B256,          // fixed (32)
    effective_balance: Gwei,               // fixed (8)
    slashed: bool,                         // fixed (1)
    activation_eligibility_epoch: Epoch,   // fixed (8)
    activation_epoch: Epoch,               // fixed (8)
    exit_epoch: Epoch,                     // fixed (8)
    withdrawable_epoch: Epoch,             // fixed (8)
}
// Validator는 fixed-size: 48+32+8+1+8+8+8+8 = 121 bytes

struct Attestation {
    aggregation_bits: Bitlist[MAX_VALIDATORS_PER_COMMITTEE],  // variable
    data: AttestationData,                                    // fixed
    signature: BLSSignature,                                  // fixed
}
// Attestation은 variable-size (Bitlist 때문)`}
        </pre>
        <p className="leading-7">
          SSZ 타입은 <strong>구조적으로</strong> fixed/variable 결정.<br />
          한 필드라도 variable이면 전체 Container가 variable.<br />
          컴파일 타임 분석으로 인코딩 전략 결정 가능.
        </p>

        {/* ── Container 인코딩 레이아웃 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Container 인코딩 — 2-part 레이아웃</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 일반 Container 인코딩 알고리즘:
// 1. 각 필드 크기 계산
// 2. fixed part 생성:
//    - fixed 필드: 실제 값
//    - variable 필드: offset (4-byte LE, 전체 인코딩 내 절대 위치)
// 3. variable part: 실제 variable 데이터 concat

// 예시: Attestation 직렬화
struct Attestation {
    aggregation_bits: Bitlist[2048],  // variable (max 2048 bits = 256 bytes + 1 sentinel)
    data: AttestationData (128 bytes), // fixed
    signature: BLSSignature (96 bytes), // fixed
}

// encoded layout:
// [0..4]     aggregation_bits offset (4 bytes LE)
// [4..132]   data (128 bytes)
// [132..228] signature (96 bytes)
// [228..?]   aggregation_bits data (variable)

// 고정 part 크기 = 4 + 128 + 96 = 228 bytes
// 첫 번째 variable 필드 offset = 228

func EncodeAttestation(a *Attestation) []byte {
    buf := bytes.Buffer{}

    // 1. aggregation_bits offset
    fixedPartSize := uint32(4 + 128 + 96)  // 228
    binary.LittleEndian.PutUint32(buf[0:4], fixedPartSize)

    // 2. data (fixed)
    buf.Write(a.data.Marshal())

    // 3. signature (fixed)
    buf.Write(a.signature.Marshal())

    // 4. aggregation_bits data (variable)
    buf.Write(a.aggregation_bits.Bytes())

    return buf.Bytes()
}

// 디코딩:
// 1. 처음 4바이트로 aggregation_bits offset 파악
// 2. 128 bytes data, 96 bytes signature 파싱
// 3. offset부터 끝까지 = aggregation_bits`}
        </pre>
        <p className="leading-7">
          Container는 <strong>2-part 레이아웃</strong>: fixed part + variable part.<br />
          variable 필드는 offset으로만 표시, 실제 데이터는 끝에.<br />
          random access 가능 — 원하는 필드의 offset만 읽어서 바로 점프.
        </p>

        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('ssz-pack', codeRefs['ssz-pack'])} />
          <span className="text-[10px] text-muted-foreground self-center">PackByChunk()</span>
        </div>

        {/* ── 디코딩 validation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">디코딩 검증 — SSZ 공격 방어</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SSZ 디코더의 검증 규칙 (Prysm 구현)

func UnmarshalAttestation(data []byte) (*Attestation, error) {
    // 1. 최소 크기 체크 (fixed part만큼은 있어야 함)
    if len(data) < 228 { return nil, ErrTooShort }

    // 2. offset 파싱
    offset := binary.LittleEndian.Uint32(data[0:4])

    // 3. offset 검증
    //    - offset >= fixed part size
    //    - offset < 전체 크기
    //    - 4-byte aligned (권장)
    if offset < 228 || offset > uint32(len(data)) {
        return nil, ErrInvalidOffset
    }

    // 4. 다음 offset 또는 끝까지가 현재 필드 크기
    //    (Attestation은 variable 1개뿐이므로 끝까지)
    variable_data := data[offset:]

    // 5. Bitlist 크기 검증 (max 2048 bits = 257 bytes)
    if len(variable_data) > 257 {
        return nil, ErrListTooLarge
    }

    // 6. Bitlist sentinel bit 검증
    //    Bitlist는 마지막 바이트의 MSB=1로 길이 encoding
    //    → 정확한 비트 수 역산 가능
    bitCount, err := DeriveBitlistLength(variable_data)
    if err != nil { return nil, err }
    if bitCount > 2048 { return nil, ErrTooManyBits }

    // 7. 일반 fixed 필드 파싱
    data_obj := DecodeAttestationData(data[4:132])
    signature := DecodeBLS(data[132:228])

    return &Attestation{
        aggregation_bits: variable_data,
        data: data_obj,
        signature: signature,
    }, nil
}

// 공격 벡터:
// - offset 조작: 메모리 밖 읽기 시도
// - 잘못된 sentinel bit: Bitlist 크기 조작
// - overflow: list max size 초과
// → 모두 validation으로 거부`}
        </pre>
        <p className="leading-7">
          SSZ 디코더의 <strong>엄격한 검증</strong>이 보안 핵심.<br />
          offset 범위, list max size, bit sentinel 등 모든 bound 검사.<br />
          잘못된 SSZ 데이터로 노드 crash 방지.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 오프셋 기반 부분 디코딩</strong> — Unmarshal 시 고정부를 순차 읽으며 오프셋을 수집.<br />
          오프셋 구간 [offset_i, offset_i+1)에서 가변 데이터를 역직렬화.<br />
          전체를 읽지 않고 특정 필드만 빠르게 접근 가능.
        </p>
      </div>
    </section>
  );
}
