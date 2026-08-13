import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function PeerScoring({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="peer-scoring" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Peer score는 과거 행동을 감쇠해 다음 resource 결정을 돕는 운영 상태다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("peer-score", codeRefs["peer-score"])} />
        <CodeViewButton onClick={() => onCodeRef("peer-decay", codeRefs["peer-decay"])} />
      </div>
      <ExplainedFormula
        question="오래된 peer 행동이 현재 연결 판단을 영원히 지배하지 않게 하려면 어떻게 점수를 갱신할까요?"
        idea="직전 점수에 0과 1 사이의 감쇠율을 곱한 뒤 이번 관찰의 가중합을 더합니다. Hard protocol violation은 이 soft score와 별도 ban·close gate로 둘 수 있습니다."
        formula={String.raw`S_{t+1}=\lambda S_t+\sum_k w_kx_{k,t}`}
        terms={[
          { symbol: "S_t", name: "현재 피어 점수", description: "시각 t까지 누적·감쇠된 운영 점수" },
          { symbol: "\\lambda", name: "감쇠율", description: "0≤λ<1인 이전 evidence 보존 비율" },
          { symbol: "x_{k,t}", name: "행동 관찰값", description: "유효 response·invalid message·timeout처럼 축 k에서 관찰한 값" },
          { symbol: "w_k", name: "행동 가중치", description: "관찰 축 k가 resource decision에 미치는 크기" },
        ]}
        assumptions={["Score update interval과 event deduplication이 고정돼 있습니다.", "가중치·threshold는 분석한 Prysm/libp2p release와 workload에 귀속합니다.", "Cryptographic invalidity·identity mismatch처럼 즉시 거절할 사건을 평균 점수로 상쇄하지 않습니다."]}
        interpretation="λ=0.8, 기존 10, 이번 유효 응답 +3이면 새 점수는 11입니다. 같은 +3도 update 주기가 다르면 의미가 달라지므로 숫자 하나를 release 사이에서 직접 비교하지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>하나의 score보다 원인별 ledger를 남깁니다</h3>
        <p>
          Gossip delivery, valid/invalid message, Req/Resp success·timeout, head/finalized usefulness와 resource abuse를 별도 counter와
          timestamp로 보존합니다. 최종 score만 저장하면 “느리지만 정직한 peer”와 “빠르게 invalid data를 주는 peer”가 같은
          숫자가 되는 반례를 설명할 수 없습니다. Close·prune 결정에는 score snapshot, threshold, contributing events와 rule
          version을 함께 기록합니다.
        </p>
        <p>
          Peer score는 reputation의 완전한 진실이 아닙니다. Local overload가 만든 timeout을 remote 악의로 오판할 수 있고 새
          peer에는 history가 없습니다. Local queue saturation·deadline miss와 protocol-invalid response를 서로 다른 reason으로
          유지하고 decay·graylist·disconnect threshold는 shadow evaluation 뒤 적용합니다.
        </p>
      </div>
    </section>
  );
}
