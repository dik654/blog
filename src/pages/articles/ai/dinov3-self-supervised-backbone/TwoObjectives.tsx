import { Link } from "react-router-dom";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import ObjectivesViz from "./viz/ObjectivesViz";

export default function TwoObjectives({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="two-objectives" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">정답은 이전 시점의 자기 자신이 만듭니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          라벨이 없으니 정답도 스스로 만들어야 합니다. DINOv3는 현재 학습 중인 모델(student) 옆에 그 가중치의
          이동평균으로 따라오는 복사본(teacher)을 두고, teacher가 낸 분포를 student가 맞추게 합니다. 목표는 두
          층위입니다. 이미지 한 장 전체에 하나, 그리고 패치마다 하나입니다.
        </p>

        <p className="leading-7">
          teacher는 별도로 학습되지 않습니다. 매 스텝 student 가중치를 조금씩 섞어 받을 뿐입니다. 그래서 정답은
          몇 스텝 전의 자기 자신이고, 학습이 진행되면 정답도 함께 좋아집니다. 이 구조에는 함정이 하나 있습니다.
          student가 모든 입력에 같은 답을 내면 손실이 0이 되어 버립니다.
        </p>
      </div>

      <h3 id="view-objective" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        이미지 수준 목표는 크롭 쌍의 분포를 맞춥니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          한 이미지에서 넓게 자른 장면과 좁게 자른 장면을 여러 개 만듭니다. teacher는 넓은 크롭을, student는 좁은
          크롭까지 봅니다. 두 모델의 출력을 K개 prototype에 대한 확률 분포로 바꾼 뒤, 모든 크롭 쌍에 대해 student
          분포가 teacher 분포를 따르도록 교차 엔트로피를 최소화합니다.
        </p>

        <p className="leading-7">
          분포로 바꾸는 자리가 head입니다. backbone 출력을 MLP와 정규화된 선형층에 통과시켜 prototype별 점수를
          만듭니다. 이 head는 학습에만 쓰고 평가할 때는 버립니다. 그래서 "무엇을 학습했는가"는 head가 아니라
          backbone의 출력으로 판단합니다.
        </p>

        <p className="leading-7">
          모든 입력이 같은 답으로 몰리는 붕괴는 teacher 쪽에서 막습니다. teacher 출력에서 배치 평균을 뺀 뒤 낮은
          온도로 나눠 뾰족하게 만들거나, 배치 안에서 prototype 사용량이 고르게 되도록 행과 열을 번갈아 정규화하는
          경로를 씁니다. student 쪽 온도는 0.1로 고정입니다.
        </p>

        <p className="leading-7">
          여기서 쓰는 자기증류는 언어모델이 자기 생성물을 다시 학습 데이터로 쓰는{" "}
          <Link to="/cs/ai/self-distillation#generation-contract">자기증류</Link>와 이름만 같습니다. 저쪽은 생성한
          텍스트를 데이터로 승격하는 절차의 문제이고, 여기서는 같은 배치 안에서 teacher의 출력 분포를 목표로 쓰는
          손실 항입니다.
        </p>
      </div>

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("dino-clstoken-loss", codeRefs["dino-clstoken-loss"])} />
        <span className="text-xs text-muted-foreground">centering·Sinkhorn과 크롭 쌍 교차 엔트로피</span>
        <CodeViewButton onClick={() => onCodeRef("dino-head", codeRefs["dino-head"])} />
        <span className="text-xs text-muted-foreground">prototype logit을 만드는 head</span>
      </div>

      <h3 id="patch-objective" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        패치 수준 목표는 가린 자리의 분포를 맞춥니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          이미지 하나에 벡터 하나만 맞추면 패치마다 다른 정보는 학습 신호를 받지 못합니다. 그래서 student 입력에서
          일부 패치를 가리고, 가려진 자리마다 teacher가 같은 위치에서 낸 분포를 맞추게 하는 목표를 하나 더 겁니다.
          손실은 가려진 패치에만 걸리고 가려진 개수로 나눕니다.
        </p>

        <p className="leading-7">
          목표가 픽셀이 아니라는 점이 중요합니다.{" "}
          <Link to="/cs/ai/vision-transformer#architecture">마스킹 사전학습</Link>의 한 갈래는 가린 자리의 픽셀을
          복원하게 합니다. 그 경우 모델은 질감과 색을 되살리는 데 용량을 씁니다. 여기서는 teacher가 낸 분포를
          맞추므로 복원해야 할 대상이 이미 의미 쪽으로 한 번 접힌 표현입니다.
        </p>

        <p className="leading-7">
          세 번째 항은 퍼뜨리기입니다. 배치 안에서 각 표현의 가장 가까운 이웃까지 거리를 재고 그 로그의 음수를
          더합니다. 두 표현이 겹칠수록 손실이 급격히 커지므로 서로 다른 이미지가 한 점으로 뭉치지 않습니다. 이
          항은 배치 전체가 아니라 16개짜리 작은 묶음 안에서 계산합니다.
        </p>
      </div>

      <ExplainedFormula
        question="사전학습 단계의 손실은 무엇으로 이루어져 있나요"
        idea="이미지 수준 목표와 패치 수준 목표를 같은 비중으로 두고, 표현이 뭉치지 않게 하는 정규화 항을 작게 더합니다."
        formula={String.raw`\mathcal{L}_{\text{Pre}} = \mathcal{L}_{\text{DINO}} + \mathcal{L}_{\text{iBOT}} + 0.1\,\mathcal{L}_{\text{DKoleo}}`}
        annotatedFormula={String.raw`\mathcal{L}_{\text{Pre}} = \underbrace{\mathcal{L}_{\text{DINO}}}_{\text{이미지 수준}} + \underbrace{\mathcal{L}_{\text{iBOT}}}_{\text{패치 수준}} + \underbrace{0.1\,\mathcal{L}_{\text{DKoleo}}}_{\text{퍼뜨리기}}`}
        operations={[
          {
            expression: String.raw`\mathcal{L}_{\text{DINO}}`,
            annotation: [
              "student 크롭과 teacher 크롭의 모든 쌍에서 prototype 분포의 교차 엔트로피를 평균합니다",
              "teacher 쪽 centering과 낮은 온도가 한 prototype 쏠림을 막습니다",
            ],
          },
          {
            expression: String.raw`\mathcal{L}_{\text{iBOT}}`,
            annotation: "가려진 패치 자리에서만 teacher 분포와의 교차 엔트로피를 계산하고 가려진 개수로 나눕니다",
          },
          {
            expression: String.raw`0.1\,\mathcal{L}_{\text{DKoleo}}`,
            annotation: "최근접 이웃 거리의 음의 로그입니다. 계수 0.1로 작게 들어가 보조 정규화 역할만 합니다",
          },
        ]}
        terms={[
          { symbol: String.raw`\mathcal{L}_{\text{DINO}}`, name: "이미지 수준 손실", description: "크롭 쌍 사이에서 이미지 전체 표현의 분포를 맞춥니다." },
          { symbol: String.raw`\mathcal{L}_{\text{iBOT}}`, name: "패치 수준 손실", description: "가려진 패치의 teacher 분포를 맞춥니다. 픽셀 복원이 아닙니다." },
          { symbol: String.raw`\mathcal{L}_{\text{DKoleo}}`, name: "분산 Koleo 정규화", description: "작은 묶음 안에서 최근접 이웃 거리를 키워 표현이 겹치지 않게 합니다." },
        ]}
        assumptions={[
          "teacher는 별도 학습 없이 student 가중치의 이동평균으로만 갱신됩니다.",
          "계수 0.1과 student 온도 0.1은 공개된 설정값이며 다른 데이터에서의 최적값이 아닙니다.",
        ]}
        interpretation="세 항은 서로 다른 실패를 막습니다. 앞의 둘은 무엇을 표현할지 정하고 마지막은 표현이 한 점으로 무너지는 것을 막습니다. 이 조합이 dense feature의 품질까지 보장하지는 않으며, 그 문제가 다음 절의 주제입니다."
      />

      <ObjectivesViz />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("ibot-patch-loss", codeRefs["ibot-patch-loss"])} />
        <span className="text-xs text-muted-foreground">가려진 패치에만 걸리는 손실</span>
        <CodeViewButton onClick={() => onCodeRef("koleo-loss", codeRefs["koleo-loss"])} />
        <span className="text-xs text-muted-foreground">최근접 이웃 거리로 퍼뜨리는 항</span>
      </div>
    </section>
  );
}
