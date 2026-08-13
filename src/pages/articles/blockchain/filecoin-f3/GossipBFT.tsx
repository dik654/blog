import GossipBFTDetailViz from "./viz/GossipBFTDetailViz";
import type { CodeRef } from "@/components/code/types";

export default function GossipBFT({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="gossipbft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">GPBFT: 후보 수렴에서 결정까지</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        GPBFT는 participant 수가 아니라 storage power table로 vote weight를
        계산한다. phase 이름만 외우기보다 어떤 value가 어느 quorum certificate를
        거쳐 다음 phase의 유일한 안전 후보가 되는지 추적한다.
      </p>
      <div className="not-prose mb-8">
        <GossipBFTDetailViz onOpenCode={onCodeRef} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Candidate phase</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <strong>QUALITY</strong> — 각 participant가 인정하는 EC chain
                후보를 알림
              </li>
              <li>
                <strong>CONVERGE</strong> — round마다 제안된 후보 집합을 하나의
                진행 가능한 value로 좁힘
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Decision phase</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <strong>PREPARE</strong> — conflicting decision을 막는 quorum
                문맥을 형성
              </li>
              <li>
                <strong>COMMIT·DECIDE</strong> — 충분한 power의 결정을
                certificate로 확정·전파
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          안전성과 liveness를 같은 문장으로 뭉개지 않는다
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Safety</h4>
            <p className="text-sm text-muted-foreground">
              2/3를 넘는 power quorum 두 개는 1/3를 넘게 교차한다. Byzantine
              power가 허용 범위 아래라면 서로 충돌하는 valid decision을 동시에
              만들 수 없다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Liveness</h4>
            <p className="text-sm text-muted-foreground">
              충분한 honest power와 eventual message delivery가 있어야 round가
              전진한다. timeout과 rebroadcast 값은 manifest/configuration이지
              protocol 설명의 고정 초 단위 상수가 아니다.
            </p>
          </div>
        </div>

        <p className="leading-7">
          gossipsub은 message dissemination을 담당하고 GPBFT state machine은
          vote의 instance·round·phase·power와 certificate를 검증한다.
          “gossip이면 메시지 복잡도가 항상 O(n)” 또는 “모든 phase가 같은
          시간”으로 단정하지 않는다.
        </p>
      </div>
    </section>
  );
}
