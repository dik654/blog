import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import PresenceViz from "./viz/PresenceViz";

export default function PresenceHead({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="presence-head" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">있는지 묻는 일과 어디냐고 묻는 일을 나눕니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          질의 하나가 "이 개념이 사진에 있는가"와 "이 자리가 그 개념인가"를 동시에 판단하면 두 판단이 서로를
          끌어내립니다. SAM 3는 질의와 별개로 학습되는 토큰을 하나 더 두고, 존재 여부는 그 토큰만 책임지게
          합니다. 질의는 존재를 전제한 상태에서 자리만 고릅니다.
        </p>

        <p className="leading-7">
          왜 끌어내리는지는 학습 신호를 보면 드러납니다. 개념이 없는 사진에서는 모든 질의가 낮은 점수를 내야
          하므로, 질의는 "웬만하면 낮게"라는 방향으로 학습됩니다. 그런데 개념이 있는 사진에서는 같은 질의가
          자리를 정확히 구분해야 합니다. 한 출력으로 두 요구를 맞추면 어느 쪽도 날카로워지지 않습니다.
        </p>

        <p className="leading-7">
          분리하면 각 출력의 학습 목표가 단순해집니다. 존재 토큰은 사진 전체를 보고 있음·없음만 맞히면 되고,
          질의는 "있다고 치고 어디인가"만 맞히면 됩니다. 최종 점수는 두 확률의 곱으로 만들어 원래 하나였던
          판단을 복원합니다.
        </p>
      </div>

      <ExplainedFormula
        question="두 판단을 나눈 뒤 어떻게 다시 합칩니까"
        idea="원래 구하려던 확률을 존재 확률과 조건부 매칭 확률의 곱으로 분해하고, 각각을 다른 출력이 맡게 합니다."
        formula={String.raw`p(q_i \text{ 가 } \mathrm{NP}) = p(\mathrm{NP} \in I)\cdot p(q_i \mid \mathrm{NP} \in I)`}
        annotatedFormula={String.raw`\underbrace{p(q_i \text{ 가 } \mathrm{NP})}_{\text{최종 점수}} = \underbrace{p(\mathrm{NP} \in I)}_{\text{존재 토큰}}\cdot \underbrace{p(q_i \mid \mathrm{NP} \in I)}_{\text{질의 }i}`}
        operations={[
          {
            expression: String.raw`p(\mathrm{NP} \in I)`,
            annotation: [
              "존재 토큰이 이미지 전체를 보고 내는 하나의 확률입니다",
              "질의 개수와 무관하게 문항당 하나만 계산됩니다",
            ],
          },
          {
            expression: String.raw`p(q_i \mid \mathrm{NP} \in I)`,
            annotation: "개념이 있다는 전제에서 질의 i가 그 인스턴스를 가리키는지에 대한 확률입니다",
          },
          {
            expression: String.raw`p(\mathrm{NP} \in I)\cdot p(q_i \mid \mathrm{NP} \in I)`,
            annotation: "존재 확률이 낮으면 모든 질의 점수가 함께 내려가 빈 결과가 나옵니다",
          },
        ]}
        terms={[
          { symbol: String.raw`\mathrm{NP}`, name: "명사구 프롬프트", description: "찾으려는 개념을 가리키는 짧은 구입니다." },
          { symbol: "I", name: "입력 이미지 또는 프레임", description: "존재 판단의 범위가 되는 한 장입니다." },
          { symbol: String.raw`q_i`, name: "i번째 객체 질의", description: "디코더의 학습된 질의 하나이며 후보 하나에 대응합니다." },
        ]}
        assumptions={[
          "예시 상자로 특정 인스턴스를 지목한 경로에서는 존재 판단이 필요 없어 이 토큰을 쓰지 않습니다.",
          "두 확률이 독립이라는 가정이 아니라 조건부 분해이므로 곱이 성립합니다.",
        ]}
        interpretation="분해 자체가 정확도를 올린다는 보장은 없습니다. 보고된 이득은 해당 학습 설정에서 종합 점수 1.5점, 존재 판정 상관계수 0.05 상승이며, 다른 구조에서도 같은 크기로 재현된다는 근거는 아닙니다."
      />

      <PresenceViz />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("presence-token", codeRefs["presence-token"])} />
        <span className="text-xs text-muted-foreground">토큰 정의부터 레이어별 logit까지</span>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          구현은 이 분리를 배선으로 보여 줍니다. 존재 토큰은 크기 1짜리 임베딩 하나로 시작해 디코더 레이어마다
          질의들 앞에 이어 붙어 self-attention을 함께 받습니다. 반면 cross-attention에서는 특정 영역에 묶이지
          않도록 마스크를 열어 두어 이미지 전체를 보게 합니다.
        </p>

        <p className="leading-7">
          레이어마다 이 토큰에서 logit을 하나씩 뽑아 쌓고, 수치가 튀지 않도록 범위를 제한합니다. 깊이마다 같은
          감독을 받으므로 마지막 레이어에만 의존하지 않는 구조입니다.
        </p>
      </div>
    </section>
  );
}
