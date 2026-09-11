import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import SoftmaxViz from "./viz/SoftmaxViz";

export default function SoftmaxLoss({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="softmax-loss" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">배치 안에서 자기 짝을 골라내게 만듭니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          배치에 이미지와 캡션 쌍이 N개 있으면 유사도 행렬이 N×N으로 만들어집니다. 대각선이 진짜 짝이고
          나머지는 아닙니다. 학습 목표는 각 행에서 대각선 칸이 가장 높은 확률을 갖게 만드는 것이라, 정답
          index가 0부터 N-1인 분류 문제로 그대로 바뀝니다.
        </p>

        <p className="leading-7">
          구현이 짧은 이유가 여기 있습니다. 유사도 행렬을 로짓으로 보고 정답 라벨을 순서대로 매기면 교차
          엔트로피 한 줄이면 됩니다. 이미지에서 문장을 찾는 방향과 문장에서 이미지를 찾는 방향 두 개를 계산해
          평균 내면 대칭이 됩니다.
        </p>

        <p className="leading-7">
          이 손실의 성질이 중요합니다. 한 행의 확률은 그 행의 모든 칸을 더해 1이 되도록 정규화되므로, 어떤
          칸의 손실도 같은 행의 다른 칸에 의존합니다. 배치에 무엇이 함께 들어왔는지가 곧 학습 신호의 일부라는
          뜻이고, 이 의존성이 뒤에서 볼 배치 크기 문제의 출발점입니다.
        </p>
      </div>

      <ExplainedFormula
        question="배치 안에서 짝을 맞힌다는 목표를 어떻게 손실로 씁니까"
        idea="정규화된 유사도를 확률로 보고 대각선이 정답인 분류 문제로 바꾼 뒤, 두 방향의 교차 엔트로피를 평균합니다."
        formula={String.raw`\mathcal{L} = -\frac{1}{2N}\sum_{i=1}^{N}\left[\log\frac{e^{t\,s_{ii}}}{\sum_{j} e^{t\,s_{ij}}} + \log\frac{e^{t\,s_{ii}}}{\sum_{j} e^{t\,s_{ji}}}\right]`}
        annotatedFormula={String.raw`\mathcal{L} = -\frac{1}{2N}\sum_{i=1}^{N}\Big[\underbrace{\log\frac{e^{t\,s_{ii}}}{\sum_{j} e^{t\,s_{ij}}}}_{\text{이미지}\to\text{문장}} + \underbrace{\log\frac{e^{t\,s_{ii}}}{\sum_{j} e^{t\,s_{ji}}}}_{\text{문장}\to\text{이미지}}\Big]`}
        operations={[
          {
            expression: String.raw`s_{ij}`,
            annotation: [
              "i번째 이미지 벡터와 j번째 문장 벡터의 코사인 유사도입니다",
              "두 벡터 모두 L2 정규화돼 있어 내적이 곧 코사인입니다",
            ],
          },
          {
            expression: String.raw`t\,s_{ij}`,
            annotation: "학습되는 온도의 지수를 곱해 분포의 날카로움을 조절합니다",
          },
          {
            expression: String.raw`\sum_{j} e^{t\,s_{ij}}`,
            annotation: "같은 행의 모든 칸을 더한 정규화 상수입니다. 배치에 함께 들어온 것들이 여기 전부 들어갑니다",
          },
          {
            expression: String.raw`\frac{1}{2N}`,
            annotation: "두 방향을 평균하고 배치 크기로 나눕니다. 방향 하나만 쓰면 비대칭 해가 생깁니다",
          },
        ]}
        terms={[
          { symbol: "N", name: "배치 크기", description: "한 번에 처리하는 이미지·캡션 쌍의 수이며 음성 쌍 수를 함께 정합니다." },
          { symbol: String.raw`s_{ij}`, name: "유사도", description: "이미지 i와 문장 j의 코사인 유사도입니다. 대각선이 양성 쌍입니다." },
          { symbol: "t", name: "학습되는 온도 계수", description: "로짓 스케일의 지수이며 학습 중 함께 갱신됩니다." },
        ]}
        assumptions={[
          "배치 안의 비대각 쌍이 모두 진짜 음성이라고 가정합니다. 같은 내용의 다른 캡션이 한 배치에 들어오면 이 가정이 깨집니다.",
          "두 인코더의 출력이 L2 정규화됐다고 가정합니다.",
        ]}
        interpretation="정규화 상수가 행 전체에 걸려 있으므로 한 쌍의 손실이 배치 구성에 의존합니다. 배치를 키우면 음성이 늘어 신호가 세지지만, 모든 유사도를 한곳에 모아야 한다는 제약도 함께 커집니다."
      />

      <SoftmaxViz />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("clip-loss", codeRefs["clip-loss"])} />
        <span className="text-xs text-muted-foreground">정답 라벨이 arange인 교차 엔트로피와 온도 적용</span>
      </div>

      <h3 id="temperature-scale" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        온도를 학습시키는 이유
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          코사인 유사도는 -1에서 1 사이입니다. 이 값을 그대로 소프트맥스에 넣으면 분포가 거의 평평해서 양성과
          음성의 차이가 손실에 잘 반영되지 않습니다. 그래서 큰 수를 곱해 차이를 벌리는데, 그 배율을 고정값으로
          두는 대신 학습 대상으로 둡니다.
        </p>

        <p className="leading-7">
          학습 초반에는 낮은 배율이 안전합니다. 표현이 아직 엉켜 있는데 분포를 날카롭게 만들면 잘못된 쌍에
          강한 기울기가 갑니다. 학습이 진행되면 배율이 올라가며 미세한 차이까지 구분하도록 밀어붙입니다. 이
          궤적을 사람이 일정으로 정하지 않고 데이터가 정하게 하는 것이 학습되는 온도의 요점입니다.
        </p>

        <p className="leading-7">
          구현은 배율 자체가 아니라 그 로그를 파라미터로 두고 지수를 취합니다. 양수 제약을 자연스럽게 만족하고
          곱셈 스케일을 덧셈 공간에서 학습하게 되므로 안정적입니다. 값이 무한정 커지지 않도록 상한을 두는
          구현도 흔합니다.
        </p>
      </div>
    </section>
  );
}
