import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function PeerScoring({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="peer-scoring" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        Active가 된 뒤에도 네 종류의 행동 기록으로 유지·퇴출을 다시 판단합니다
      </h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("score-weights", codeRefs["score-weights"])}
        />
        <CodeViewButton
          onClick={() => onCodeRef("peer-score", codeRefs["peer-score"])}
        />
        <CodeViewButton
          onClick={() => onCodeRef("score-decay", codeRefs["score-decay"])}
        />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          N42가 Status를 통과했다면 이제 실제 행동을 볼 수 있습니다. Prysm
          v7.3.1은{" "}
          <strong>bad response, block provider, peer status, gossip</strong> 네
          하위 점수를 계산합니다. 다만 네 값을 같은 비중으로 더하지 않습니다.
          기본 가중치는 각각
          <strong> 0.3, 0.0, 0.3, 0.4</strong>입니다. block provider 기록은 별도
          피어 선택에 쓰이지만 이 aggregate score에는 기본 가중치 0이라 더해지지
          않습니다.
        </p>
      </div>
      <ExplainedFormula
        question="N42의 네 하위 점수가 최종 peer score 하나로 어떻게 합쳐집니까?"
        idea="각 하위 점수에 현재 source가 정한 가중치를 곱한 뒤 더하고, 소수 넷째 자리까지 반올림합니다. 차단은 이 합계 하나가 아니라 terminal 상태를 가진 하위 scorer도 따로 확인합니다."
        formula={String.raw`S=\operatorname{round}_4(0.3s_{bad}+0.0s_{block}+0.3s_{status}+0.4s_{gossip})`}
        annotatedFormula={String.raw`S=\operatorname{round}_4(\underbrace{0.3s_{bad}}_{\text{잘못된 응답}}+\underbrace{0.0s_{block}}_{\text{블록 제공}}+\underbrace{0.3s_{status}}_{\text{체인 상태}}+\underbrace{0.4s_{gossip}}_{\text{GossipSub 행동}})`}
        operations={[
          {
            expression: String.raw`0.3\times(-3.3333)=-1.0000`,
            annotation: [
              "bad response 2회, threshold 6이면 하위 점수는 -(2/6)×10=-3.3333",
              "가중치 0.3을 곱하면 -1.0000",
            ],
          },
          {
            expression: String.raw`0.3\times0.9=0.27`,
            annotation: ["예시 status 점수 0.9", "가중치 0.3을 곱하면 +0.27"],
          },
          {
            expression: String.raw`0.4\times(-2)=-0.8`,
            annotation: ["예시 GossipSub 점수 -2", "가중치 0.4를 곱하면 -0.8"],
          },
          {
            expression: String.raw`S=-1+0+0.27-0.8=-1.53`,
            annotation: [
              "block provider는 예시 점수가 있어도 기본 가중치 0",
              "합계를 소수 넷째 자리까지 반올림",
            ],
          },
        ]}
        terms={[
          {
            symbol: "s_{bad}",
            name: "잘못된 응답 점수",
            description: "bad response 횟수와 threshold로 만든 음수 penalty",
          },
          {
            symbol: "s_{block}",
            name: "블록 제공 점수",
            description:
              "처리한 block batch 이력. 현재 aggregate 기본 가중치는 0",
          },
          {
            symbol: "s_{status}",
            name: "체인 상태 점수",
            description: "알고 있는 최고 head slot에 대한 상대 head 비율",
          },
          {
            symbol: "s_{gossip}",
            name: "gossip 점수",
            description: "libp2p GossipSub가 계산해 peer store에 넣은 점수",
          },
        ]}
        assumptions={[
          "Prysm v7.3.1 commit 96d418cd의 기본 가중치를 사용합니다.",
          "status 0.9와 gossip -2는 계산 흐름을 보여 주기 위한 예시 값입니다.",
          "wrong fork·invalid finalized root 같은 terminal 오류는 aggregate가 좋아도 IsBadPeer에서 별도로 거절됩니다.",
        ]}
        interpretation="예시 N42의 aggregate score는 -1.53입니다. 이 숫자는 합의 투표 가중치가 아니라 피어 운영 판단용 신호이며, 어떤 하위 원인이 만들었는지 함께 봐야 합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>감쇠도 하나의 λ 공식이 아닙니다</h3>
        <p>
          현재 Prysm 구현은 모든 점수에 같은 지수 감쇠를 적용하지 않습니다. bad
          response count는 기본적으로 한 시간마다 1씩 줄입니다. block provider의
          processed block count는 30초마다 기본 64개씩 빼고 0 아래로 내려가지
          않게 합니다. gossip 점수는 libp2p pubsub의 별도 규칙에서 계산됩니다.
          그래서 “λ=0.8로 전체 score를 감쇠한다”는 식은 이 source의 동작을
          설명하지 못합니다.
        </p>

        <h3>합계와 bad 판정이 따로 있는 이유</h3>
        <p>
          평균만 보면 치명적 오류가 다른 좋은 행동에 가려질 수 있습니다. Prysm의{" "}
          <code>IsBadPeer</code>는 bad response threshold, wrong fork·invalid
          finalized root·invalid request 같은 peer status 오류, 그리고 기능이
          켜졌을 때 gossip threshold를 따로 확인합니다. terminal 오류는 좋은
          aggregate score로 상쇄되지 않습니다.
        </p>
        <p>
          운영에서 볼 때도 최종 숫자 하나만 저장하면 부족합니다. N42를 끊었다면
          bad response count, 마지막 Status 오류, GossipSub score, 판단한
          release와 시각을 함께 남겨야 “상대가 잘못했는지, local overload로
          timeout이 났는지”를 다시 구분할 수 있습니다.
        </p>

        <h3>이 흐름을 읽은 뒤 답할 수 있어야 하는 질문</h3>
        <ul>
          <li>
            Discv5에서 보인 노드 수와 실제 Connected peer 수가 왜 다릅니까?
          </li>
          <li>
            Noise가 성공했는데도 Status에서 연결이 끊길 수 있는 이유는
            무엇입니까?
          </li>
          <li>
            aggregate score가 괜찮아도 즉시 bad peer가 될 수 있는 사건은
            무엇입니까?
          </li>
          <li>
            연결 오류가 늘었을 때 discovery, transport, Status 중 어느
            receipt부터 비교해야 합니까?
          </li>
        </ul>
      </div>
    </section>
  );
}
