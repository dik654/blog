import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function GraffitiRandao({ onCodeRef: _ }: Props) {
  return (
    <section id="graffiti-randao" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RANDAO Reveal & Graffiti</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── RANDAO Reveal ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">RANDAO Reveal — proposer의 암호학적 기여</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RANDAO Reveal: proposer가 생성하는 verifiable random value
// BLS 서명의 결정성 덕분에 가능

// 생성:
func generateRandaoReveal(
    validator *Validator,
    epoch Epoch,
    fork Fork,
    genesisValidatorsRoot Root,
) BLSSignature {
    // 1. Signing root 계산
    domain := computeDomain(DOMAIN_RANDAO, fork, genesisValidatorsRoot)
    signingRoot := computeSigningRoot(epoch, domain)

    // 2. BLS 서명 (deterministic)
    //    같은 (validator, epoch)에 대해 항상 같은 서명
    reveal := validator.sign(signingRoot)

    return reveal
}

// 결정성의 의미:
// - validator의 정체 = stake = 고정
// - epoch = 고정
// - 따라서 reveal도 고정 (유일)
// - 하지만 "이 validator가 어느 epoch에 뽑힐지"는 예측 불가
//   → 효과적 랜덤성

// Beacon chain의 RANDAO 사용:
// 1. processRandao에서 reveal 검증
// 2. hash(reveal)을 randao_mix에 XOR
// 3. 다음 epoch proposer/committee 선정에 사용

// Bias resistance:
// - proposer가 "나쁜" reveal을 만들 수 있나? → No (결정적)
// - proposer가 블록 제안 skip해서 편향 가능?
//   → 가능하지만 미미 (skip = reward loss)
//   → 공격자가 1/2 bit 편향 → 1 bit 편향 시 1 slot 수입 포기
//   → 경제적으로 비효율적

// secret sharing과의 관계:
// RANDAO는 "commit-reveal" 스킴의 simple form
// 각 proposer가 epoch당 1 bit 기여
// 256 slot × 1 = 256 bits of entropy per epoch`}
        </pre>
        <p className="leading-7">
          <strong>RANDAO Reveal</strong>은 BLS 서명의 결정성 활용.<br />
          같은 (validator, epoch)에 유일한 reveal → verifiable random.<br />
          proposer skip 가능하지만 경제적으로 비효율 → bias resistance.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 RANDAO Reveal</strong> — 제안자가 domain_randao + 에폭을 BLS로 서명한 값.<br />
          검증 가능하면서도 예측 불가능한 랜덤 소스로 활용.<br />
          reveal을 XOR하여 randaoMixes를 갱신, 다음 에폭 위원회 배정에 사용.
        </p>

        {/* ── Graffiti ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Graffiti — 32 bytes 자유 공간</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BeaconBlockBody.graffiti: 32 bytes 자유 메시지
// proposer가 임의 데이터 포함 가능

// 사용 예:
// - 노드 소프트웨어 식별: "Prysm/v5.0.0"
// - 노드 운영자 표시: "MyValidator123"
// - 유머/메시지: "WAGMI", "GM", etc.
// - 긴급 정보: 버전 알림 등

// 기본값:
// Prysm: "Prysm" + version bytes
// Lighthouse: "Lighthouse" + version
// Teku: "teku" + version

// 커스텀 설정:
// validator --graffiti "My custom message"
// REST API:
// POST /eth/v1/validator/beacon_committee_subscriptions
// { "graffiti": "..." }

// 분석 도구:
// - beaconcha.in: proposer별 graffiti 집계
// - 네트워크 클라이언트 점유율 측정
// - 메시지 발견 (easter eggs)

// 제약:
// - 정확히 32 bytes (padding 또는 truncation)
// - 무의미한 이점 외에는 영향 없음
// - consensus에 반영 안 됨 (순수 metadata)

// EIP-7688 (미래):
// - Graffiti를 별도 rotating "block extra data"로 확장 논의
// - 현재는 32 bytes 고정`}
        </pre>
        <p className="leading-7">
          <strong>Graffiti</strong>는 32 bytes 자유 메시지.<br />
          Node software 식별, 운영자 표시, 메시지 삽입 등 활용.<br />
          consensus에 영향 없음 — 순수 metadata.
        </p>

        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-4">
          <strong>💡 BLS 서명 & 브로드캐스트</strong> — 완성된 블록을 제안자의 BLS 개인키로 서명.<br />
          SignedBeaconBlock을 gossipsub beacon_block 토픽에 게시.<br />
          다른 노드는 수신 후 onBlock()으로 검증 처리.
        </p>
      </div>
    </section>
  );
}
