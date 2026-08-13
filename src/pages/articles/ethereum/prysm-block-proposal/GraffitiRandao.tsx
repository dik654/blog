import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function GraffitiRandao({ onCodeRef: _ }: Props) {
  return (
    <section id="graffiti-randao" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RANDAO Reveal & Graffiti</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── RANDAO Reveal ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          RANDAO Reveal — proposer의 암호학적 기여
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Reveal 생성
            </div>
            <p className="text-sm">
              <code>
                computeDomain(DOMAIN_RANDAO, fork, genesisValidatorsRoot)
              </code>{" "}
              → signing root 계산 → <code>validator.sign(signingRoot)</code>으로
              BLS 서명. 같은 (validator, epoch) 조합에 대해 항상 동일한 서명 —
              BLS의 결정성.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              결정성의 의미
            </div>
            <ul className="text-sm space-y-1 mt-1">
              <li>
                같은 key·epoch·domain이면 같은 검증 가능한 reveal 생성
              </li>
              <li>
                여러 proposer의 reveal hash를 누적해 이후 selection seed에 사용
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Beacon Chain RANDAO 사용
            </div>
            <ol className="text-sm space-y-1 mt-1 list-decimal list-inside">
              <li>
                <code>processRandao</code>에서 reveal 검증
              </li>
              <li>
                <code>hash(reveal)</code>을 <code>randao_mix</code>에 XOR
              </li>
              <li>다음 epoch proposer/committee 선정에 사용</li>
            </ol>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">
              Bias Resistance
            </div>
            <ul className="text-sm space-y-1 mt-1">
              <li>같은 signing root에서 다른 유효 reveal을 골라낼 수는 없음</li>
              <li>
                블록 제안 skip으로 편향? → 가능하지만 1 slot 수입 포기 필요 →
                경제적 비효율
              </li>
              <li>
                다만 proposer는 block 자체를 내지 않아 contribution을 생략하는
                선택을 할 수 있음
              </li>
            </ul>
          </div>
        </div>
        <p>
          <strong>RANDAO reveal</strong>은 proposer가 epoch와 RANDAO domain에 BLS signature를 만들어 이전 mix에 결합하는 공개 randomness contribution입니다. 같은 key와 signing root에서는 검증 가능한 하나의 signature가 나오지만 proposer는 자신의 reveal을 보고 block을 내지 않을 선택권이 있으므로 완전한 unbiased randomness는 아닙니다. 여러 epoch의 contribution과 proposer reward loss가 이 last-revealer bias를 제한합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 RANDAO Reveal</strong> — 제안자가 domain_randao + 에폭을
          BLS로 서명한 값입니다. State transition은 reveal hash를 현재 <code>randao_mixes</code>에 XOR하고, 누적된 mix는 이후 committee와 proposer selection randomness에 사용됩니다.
        </p>

        {/* ── Graffiti ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Graffiti — 32 bytes 자유 공간
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              사용 예
            </div>
            <ul className="text-sm space-y-1 mt-1">
              <li>노드 소프트웨어나 운영자 식별 문자열</li>
              <li>
                유머/메시지 — <code>"WAGMI"</code>, <code>"GM"</code>
              </li>
              <li>긴급 정보 — 버전 알림 등</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              커스텀 설정
            </div>
            <p className="text-sm">
              CLI: <code>validator --graffiti "My custom message"</code>
            </p>
            <p className="text-sm mt-1">설정이 32 bytes를 넘거나 짧을 때의 padding·truncation은 사용 중인 client 버전을 확인합니다.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              제약 사항
            </div>
            <ul className="text-sm space-y-1 mt-1">
              <li>정확히 32 bytes (padding 또는 truncation)</li>
              <li>consensus에 반영 안 됨 — 순수 metadata</li>
              <li>Block body 일부이므로 block root와 서명에는 반영됨</li>
            </ul>
          </div>
        </div>
        <p>
          <strong>Graffiti</strong>는 proposer가 선택하는 32-byte field로 client·pool 식별이나 짧은 message에 사용됩니다. Consensus state transition의 경제적 의미를 바꾸지는 않지만 beacon block body의 일부이므로 block root와 proposer signature에 commit되는 opaque metadata입니다.
        </p>

        <p className="mt-4 border-l-2 border-violet-500/50 pl-3 text-sm">
          <strong>💡 BLS 서명 & 브로드캐스트</strong> — 완성된 블록을 제안자의
          BLS key로 서명하고 <code>SignedBeaconBlock</code>을 beacon-block GossipSub topic에 publish합니다. 다른 node는 proposer signature, slot·parent, state transition과 execution payload status를 검증한 뒤 fork choice에 반영합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">서명은 재시도 가능한 작업이 아니라 commit 경계다</h3>
        <p>
          Candidate A의 <code>state_root</code>까지 채운 뒤 proposer signing
          intent와 signed block root·bytes를 durable storage에 남기고
          publish합니다. 서명 직후 process가 죽거나 gossip timeout이 나더라도
          같은 slot의 candidate B를 새로 서명하지 않습니다. 재시도가
          허용되는 것은 이미 저장한 A의 동일 bytes를 publish하는 단계입니다.
        </p>
        <p>
          Release 전에는 고정한 spec·Prysm SHA·fork에서 duty reorg, local/builder
          timeout, stale payload id, operation limit, post-state-root mismatch,
          crash-before-sign과 crash-after-sign을 baseline과 paired 실행합니다.
          Root·signed bytes·restart 결과가 같아야 그다음에 proposal latency를
          비교합니다.
        </p>
      </div>
    </section>
  );
}
