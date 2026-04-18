import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function GraffitiRandao({ onCodeRef: _ }: Props) {
  return (
    <section id="graffiti-randao" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RANDAO Reveal & Graffiti</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── RANDAO Reveal ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">RANDAO Reveal — proposer의 암호학적 기여</h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Reveal 생성</div>
            <p className="text-sm">
              <code>computeDomain(DOMAIN_RANDAO, fork, genesisValidatorsRoot)</code> → signing root 계산 → <code>validator.sign(signingRoot)</code>으로 BLS 서명.
              같은 (validator, epoch) 조합에 대해 항상 동일한 서명 — BLS의 결정성.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">결정성의 의미</div>
            <ul className="text-sm space-y-1 mt-1">
              <li>validator 정체(stake) = 고정, epoch = 고정 → reveal도 유일</li>
              <li>"이 validator가 어느 epoch에 뽑힐지"는 예측 불가 → 효과적 랜덤성</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Beacon Chain RANDAO 사용</div>
            <ol className="text-sm space-y-1 mt-1 list-decimal list-inside">
              <li><code>processRandao</code>에서 reveal 검증</li>
              <li><code>hash(reveal)</code>을 <code>randao_mix</code>에 XOR</li>
              <li>다음 epoch proposer/committee 선정에 사용</li>
            </ol>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">Bias Resistance</div>
            <ul className="text-sm space-y-1 mt-1">
              <li>proposer가 "나쁜" reveal 생성? → 불가능 (결정적 서명)</li>
              <li>블록 제안 skip으로 편향? → 가능하지만 1 slot 수입 포기 필요 → 경제적 비효율</li>
              <li>RANDAO는 commit-reveal 스킴의 simple form — 각 proposer가 epoch당 1 bit 기여 (256 bits/epoch)</li>
            </ul>
          </div>
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">사용 예</div>
            <ul className="text-sm space-y-1 mt-1">
              <li>노드 소프트웨어 식별 — <code>"Prysm/v5.0.0"</code></li>
              <li>노드 운영자 표시 — <code>"MyValidator123"</code></li>
              <li>유머/메시지 — <code>"WAGMI"</code>, <code>"GM"</code></li>
              <li>긴급 정보 — 버전 알림 등</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">클라이언트별 기본값</div>
            <ul className="text-sm space-y-1 mt-1">
              <li><strong>Prysm</strong> — <code>"Prysm"</code> + version bytes</li>
              <li><strong>Lighthouse</strong> — <code>"Lighthouse"</code> + version</li>
              <li><strong>Teku</strong> — <code>"teku"</code> + version</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">커스텀 설정</div>
            <p className="text-sm">CLI: <code>validator --graffiti "My custom message"</code></p>
            <p className="text-sm mt-1">REST API: <code>POST /eth/v1/validator/beacon_committee_subscriptions</code></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">제약 사항</div>
            <ul className="text-sm space-y-1 mt-1">
              <li>정확히 32 bytes (padding 또는 truncation)</li>
              <li>consensus에 반영 안 됨 — 순수 metadata</li>
              <li>EIP-7688: 향후 확장 논의 진행 중</li>
            </ul>
          </div>
        </div>
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
