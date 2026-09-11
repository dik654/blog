import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import FailViz from "./viz/FailViz";

export default function AbsenceNotDrawable() {
  return (
    <section id="absence-not-drawable" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">디노이저에게 마스크를 채우라고 하면 채웁니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          포기하기 전에 디퓨전에 최대한 유리한 조건을 줬습니다. 먼저 띠 뒤에 무엇이 있는지 프롬프트로 알려
          줬습니다. "허리를 가로질러 평범한 튜닉이 매끄럽게 이어지고, 맨 천이며, 띠도 벨트도 없다"는 식으로요.
        </p>

        <p className="leading-7">
          그리고 네거티브에 물건 이름을 전부 넣었습니다. 띠, 벨트, 끈, 밴드, 리본, 코드, 로프, 버클, 장신구.
          만들면 안 되는 것을 이름으로 나열해 준 셈입니다.
        </p>

        <p className="leading-7">
          그래도 흰 띠를 그렸습니다. 네 그림체 전부에서입니다. 마스크 안 변화량은 44.9에서 93.7까지 크게 나옵니다. 그 큰 값이 "많이 지웠다"가 아니라 "다른 띠를 크게
          그렸다"였습니다.
        </p>

        <p className="leading-7">
          이 시점에서 결론은 "더 나은 디퓨전 모델"이 아니라 다른 종류의 모델이라는 쪽으로 굳었습니다. 디노이저는 노이즈에서 무언가를 만들어 내도록 학습된 도구입니다. 없음은 만들어 낼
          수 있는 대상이 아닙니다.
        </p>
      </div>

      <FailViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          나중에 이 실험의 네거티브가 애초에 꺼져 있었다는 것을 알았습니다. 샘플러의 안내 계수가 1.0이었기 때문입니다. 이 값에서는 조건부 예측과 무조건부 예측을 섞는 식이 조건부 예측
          그 자체로 줄어들어 네거티브 프롬프트가 계산에서 통째로 빠집니다.
        </p>

        <p className="leading-7">
          숨기지 않고 통제 실패로 기록합니다. 다만 결론은 바뀌지 않습니다. 네거티브가 살아 있었던 다른 회차에서도 일곱 모델이 같은 방식으로 실패했습니다. 무엇보다 배경을 설명하는 양의
          프롬프트는 정상적으로 들어갔는데도 띠가 그려졌습니다.
        </p>
      </div>

      <ExplainedFormula
        question="안내 계수가 1이면 왜 네거티브가 사라집니까"
        idea="안내는 조건부 예측과 무조건부 예측의 차이를 계수만큼 증폭해 더하는 연산입니다. 계수가 1이면 그 증폭이 사라져 조건부 예측만 남고, 무조건부 자리에 넣은 네거티브는 계산에서 상쇄됩니다."
        formula={String.raw`\hat{\epsilon} = \epsilon_{\text{neg}} + w\,(\epsilon_{\text{pos}} - \epsilon_{\text{neg}})`}
        annotatedFormula={String.raw`\hat{\epsilon} = \underbrace{\epsilon_{\text{neg}}}_{\text{네거티브 조건 예측}} + \underbrace{w}_{\text{안내 계수}}\,(\underbrace{\epsilon_{\text{pos}} - \epsilon_{\text{neg}}}_{\text{두 예측의 차이}})`}
        operations={[
          {
            expression: String.raw`w = 1`,
            annotation: [
              "식이 ε_neg + (ε_pos − ε_neg) 로 줄어듭니다",
              "정리하면 ε_pos 하나만 남습니다",
            ],
          },
          {
            expression: String.raw`\hat{\epsilon} = \epsilon_{\text{pos}}`,
            annotation: "네거티브 프롬프트가 결과에 전혀 반영되지 않습니다",
          },
          {
            expression: String.raw`w > 1`,
            annotation: "차이가 증폭되면서 네거티브가 반대 방향으로 밀어내는 힘이 생깁니다",
          },
        ]}
        terms={[
          { symbol: String.raw`\epsilon_{\text{pos}}`, name: "양의 조건 예측", description: "프롬프트를 조건으로 준 예측입니다." },
          { symbol: String.raw`\epsilon_{\text{neg}}`, name: "네거티브 조건 예측", description: "네거티브를 조건으로 준 예측이며 비워 두면 무조건부가 됩니다." },
          { symbol: "w", name: "안내 계수", description: "두 예측의 차이를 얼마나 증폭할지 정합니다." },
        ]}
        assumptions={[
          "안내를 이 선형 결합 형태로 구현한 샘플러를 가정합니다. 증류된 모델은 이 연산을 학습에 흡수해 계수 1로 도는 경우가 많습니다.",
          "계수를 올리면 네거티브가 살아나지만 증류 모델에서는 결과가 함께 무너질 수 있어 그냥 올릴 수 없습니다.",
        ]}
        interpretation="식이 말하는 것은 네거티브 프롬프트가 설정 파일에 적혀 있다고 작동하는 것이 아니라는 점입니다. 안내 계수 1로 도는 빠른 모델에서는 아무 효과가 없고, 그것을 모르면 효과 없는 문구를 근거로 결론을 쓰게 됩니다."
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          클라우드 API로 제공되는 전용 제거 모델들도 후보에 있었습니다. 다만 설치된 것들이 전부 외부 엔드포인트
          호출이라 남의 유료 키 뒤에 있었습니다. 로컬에서 도는 도구의 의존성으로 삼을 수 없어 제외했습니다.
        </p>

        <p className="leading-7">
          안내 계수와 조건부·무조건부 예측의 정의는{" "}
          <Link to="/ai/latent-diffusion-guidance#guidance">잠재 확산과 안내</Link>가 소유합니다. 이 절은 그
          계수가 1일 때 네거티브가 무효가 된다는 실무적 결과만 다뤘습니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 지우기 요청에 대한 확산 모델 응답 (2026-09-11, RTX 4090 48GB)"
        citeKey={1}
        href="https://github.com/dik654/blog"
      >
        배경을 설명하는 프롬프트와 물건 이름 네거티브를 함께 준 확산 실행이 네 그림체 모두에서 띠를 다시
        그렸습니다. 마스크 안 변화량 44.9~93.7, 마스크 밖 2.85~3.51. 이 실행의 네거티브는 안내 계수 1.0 탓에
        무효였으며 통제 실패로 기록합니다. 양의 배경 프롬프트는 정상 적용됐습니다.
      </CitationBlock>
    </section>
  );
}
