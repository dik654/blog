import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function SnappyEncoding({ onCodeRef: _ }: Props) {
  return (
    <section id="snappy-encoding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SSZ-Snappy 인코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          비콘 체인 메시지는 <strong>SSZ 직렬화 + Snappy 프레임 압축</strong>을 거친다.<br />
          RLP(EL)와 달리 SSZ는 고정 크기 필드 오프셋으로 부분 디코딩이 가능하다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">인코딩 파이프라인</h3>
        <ul>
          <li><strong>SSZ 직렬화</strong> — 구조체를 고정 오프셋 바이트로 변환</li>
          <li><strong>Snappy 압축</strong> — LZ77 기반 빠른 압축 (CPU 부담 최소)</li>
          <li><strong>길이 프리픽스</strong> — varint로 압축 전 크기를 명시</li>
        </ul>

        {/* ── Snappy 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Snappy — Google의 빠른 압축 알고리즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Snappy (Google, 2011)
// LZ77 기반 non-stream compression
// 설계 목표: 압축률보다 속도 우선

// vs 다른 알고리즘 비교:
//                압축률    압축 속도      해제 속도
// Snappy:        2~2.5x    ~500 MB/s     ~2000 MB/s
// LZ4:           2~2.5x    ~400 MB/s     ~3000 MB/s
// gzip(-6):      3~4x      ~30 MB/s      ~300 MB/s
// zstd(-3):      3~4x      ~300 MB/s     ~1000 MB/s

// 알고리즘:
// 1. 32-bit rolling hash로 중복 패턴 탐색
// 2. 매치 발견 → (distance, length) tag 인코딩
// 3. literal byte → literal tag 인코딩
// 4. 64-byte sliding window (작음)

// 출력 형식:
// [length_prefix varint][compressed_data]
// - length_prefix: 원본 크기 (decoder가 미리 버퍼 할당)
// - compressed_data: snappy-encoded bytes

// 이더리움 사용 사례:
// - beacon_block (~100KB): ~50KB로 압축 (50%)
// - attestation (~500 bytes): ~400 bytes (20% reduction)
// - blob_sidecar (~128KB): ~90KB (30% reduction)

// 왜 Snappy를 Ethereum 2.0이 채택?
// 1. 속도: 30K attestation/slot 처리 가능
// 2. 구현 단순: 기존 libsnappy 재사용
// 3. 언어별 구현체 풍부: Go/Rust/Java/JS 모두 최적화된 라이브러리`}
        </pre>
        <p className="leading-7">
          Snappy는 <strong>속도 우선</strong> 압축 알고리즘.<br />
          gzip보다 10~15배 빠른 압축/해제 → consensus 타이밍 제약 대응.<br />
          압축률 2~2.5배로도 대역폭 절약에 충분.
        </p>

        {/* ── Ethereum 사용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Ethereum 2.0의 SSZ-Snappy 사용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 인코딩 흐름:
func EncodeMessage(msg any) ([]byte, error) {
    // 1. SSZ 직렬화
    ssz_bytes, err := msg.MarshalSSZ()
    if err != nil { return nil, err }

    // 2. Snappy 압축
    snappy_bytes := snappy.Encode(nil, ssz_bytes)

    // 3. 길이 prefix (stream의 경우)
    // GossipSub은 message-per-payload라 prefix 불필요
    return snappy_bytes, nil
}

// 디코딩 흐름:
func DecodeMessage(data []byte) (any, error) {
    // 1. Snappy 해제
    ssz_bytes, err := snappy.Decode(nil, data)
    if err != nil { return nil, err }

    // 2. 크기 검증 (DoS 방어)
    if len(ssz_bytes) > MAX_CHUNK_SIZE { // 10 MB
        return nil, ErrMessageTooLarge
    }

    // 3. SSZ 역직렬화
    msg := &BeaconBlock{}
    if err := msg.UnmarshalSSZ(ssz_bytes); err != nil {
        return nil, err
    }
    return msg, nil
}

// 프로토콜 이름에 인코딩 명시:
// /eth2/<fork_digest>/beacon_block/ssz_snappy
//                                    ↑ 인코딩 버전

// 미래 대체:
// ssz_snappy → ssz_zstd (향후 고려)
// 현재: snappy 안정, 변경 계획 없음`}
        </pre>
        <p className="leading-7">
          모든 P2P 메시지가 <strong>SSZ → Snappy → 전송</strong> 파이프라인.<br />
          토픽 이름에 <code>/ssz_snappy</code> suffix로 인코딩 명시.<br />
          크기 검증(10MB 상한)으로 DoS 공격 방어.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Snappy vs gzip</strong> — gzip 대비 압축률은 낮지만 속도가 10배 이상 빠름.<br />
          12초 슬롯마다 수천 개 어테스테이션을 처리해야 하므로 CPU 오버헤드 최소화가 압축률보다 우선.
        </p>
      </div>
    </section>
  );
}
