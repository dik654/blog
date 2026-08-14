import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import RepresentationDepthViz from "./viz/RepresentationDepthViz";

const DEEP_LEARNING_REVIEW = "https://www.nature.com/articles/nature14539";
const DEPTH_PAPER = "https://arxiv.org/abs/1602.04485";

export default function DeepLearningOverviewArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">00 · 먼저 한 용어</p>
          <h2 className="mt-2 text-2xl font-bold">Representation은 입력을 다음 계산이 쓰기 좋은 숫자로 다시 나타낸 것이다</h2>
        </header>
        <p className="text-lg leading-8">
          사진은 처음에는 pixel 숫자 묶음입니다. 모델의 한 층을 지나면 같은 사진이
          edge에 반응하는 숫자, texture를 구분하는 숫자처럼 다른 좌표로 표현될 수
          있습니다. 이 <strong>중간 숫자 묶음</strong>을 representation이라고
          부릅니다.
        </p>
        <Definition
          term="Representation learning"
          idea="어떤 중간 표현을 만들지 사람이 전부 고정하지 않고, 최종 목표의 오차를 줄이는 과정에서 model parameter와 함께 배우는 방법입니다."
          example="고양이 분류에서 pixel→edge→부분 모양→class score로 이어지는 중간 좌표가 같은 classification objective로 조정됩니다."
          boundary="Hidden coordinate 하나가 ‘귀’ 같은 사람 개념 하나와 반드시 일치한다는 뜻은 아닙니다."
        />
        <Definition
          term="Objective가 만드는 편향"
          idea="모델은 입력의 모든 정보를 보존하지 않고 loss를 낮추는 데 유용한 차이를 우선 보존합니다."
          example="고양이·개 분류 objective는 털 색보다 얼굴 윤곽을 더 유용하게 만들 수 있지만, 촬영 위치를 맞히는 objective라면 배경을 더 보존할 수 있습니다."
          boundary="Representation의 품질은 model 모양만이 아니라 data·target·loss와 함께 판단해야 합니다."
        />
      </section>

      <section id="shape" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 형태를 눈으로 보기</p>
          <h2 className="mt-2 text-2xl font-bold">같은 입력이 층마다 다른 좌표가 된다</h2>
        </header>
        <p>
          아래 Viz는 새 용어를 한 번에 쏟지 않습니다. 먼저 pixel 묶음을 보고,
          오른쪽 화살표를 누를 때마다 다음 층이 무엇을 재사용하는지 하나씩
          드러냅니다.
        </p>
        <RepresentationDepthViz />
      </section>

      <section id="depth" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 두 번째 용어</p>
          <h2 className="mt-2 text-2xl font-bold">Depth는 작은 변환을 합성하고 중간 결과를 재사용하는 구조다</h2>
        </header>
        <Definition
          term="Depth efficiency"
          idea="한 층에서 모든 경우를 펼치는 대신 앞 층이 만든 중간 계산을 뒤 층이 재사용해 특정 compositional function을 더 적은 unit으로 나타내는 성질입니다."
          example="Edge 검출 결과를 여러 texture가 공유하고, 그 texture를 여러 object part가 다시 공유합니다."
          boundary="깊으면 무조건 정확하거나 학습하기 쉽다는 뜻이 아닙니다. 표현 가능성, optimization, generalization은 다른 주장입니다."
        />
        <ExplainedFormula
          question="여러 층은 입력을 어떻게 재사용 가능한 중간 표현으로 바꿀까요?"
          idea={<>각 층은 앞 단계의 결과만 입력으로 받아 작은 변환을 하나 수행합니다. 마지막 층은 누적된 표현을 task output으로 바꿉니다.</>}
          formula={String.raw`h_1=\phi_1(x),\quad h_2=\phi_2(h_1),\quad \hat y=\phi_3(h_2)`}
          annotatedFormula={String.raw`\begin{aligned}h_1&=\underbrace{\phi_1(x)}_{\substack{\text{입력을 첫 표현으로}\text{변환}}}\\[4pt]h_2&=\underbrace{\phi_2(h_1)}_{\substack{\text{앞 표현을 재사용해}\text{더 큰 구조로 조합}}}\\[4pt]\hat y&=\underbrace{\phi_3(h_2)}_{\substack{\text{task가 요구한}\text{출력으로 변환}}}\end{aligned}`}
          operations={[
            { expression: String.raw`\phi_1(x)`, annotation: ["원시 입력을", "첫 중간 좌표로 변환"] },
            { expression: String.raw`\phi_2(h_1)`, annotation: ["이미 만든 특징을", "다음 구조에 재사용"] },
            { expression: String.raw`\phi_3(h_2)`, annotation: ["누적 표현을", "task output으로 읽음"] },
          ]}
          terms={[
            { symbol: "x", name: "입력", description: "아직 task용 표현으로 바뀌지 않은 pixel·token 같은 관측값입니다." },
            { symbol: "h_1,h_2", name: "중간 표현", description: "앞 층의 출력을 다음 층이 다시 사용하는 좌표입니다." },
            { symbol: String.raw`\phi_1,\phi_2,\phi_3`, name: "층별 변환", description: "학습되는 parameter를 가진 작은 함수들입니다." },
            { symbol: String.raw`\hat y`, name: "Prediction", description: "마지막 표현에서 읽은 task output입니다." },
          ]}
          assumptions={[
            "각 층의 출력 shape가 다음 층의 입력 계약과 맞습니다.",
            "이 식은 함수 합성을 보일 뿐, gradient가 안정적으로 흐르거나 좋은 representation을 찾는다고 보장하지 않습니다.",
          ]}
          interpretation="깊이의 핵심은 층 수를 세는 일이 아니라, 앞에서 만든 중간 계산을 뒤에서 다시 쓰는 합성 구조입니다."
        />
      </section>

      <section id="boundaries" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 조합하기 전 경계</p>
          <h2 className="mt-2 text-2xl font-bold">표현 가능성·학습 가능성·새 데이터 성능은 따로 확인한다</h2>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          <BoundaryCard title="표현" question="이 구조가 함수를 나타낼 수 있는가?" answer="Depth·width와 함수족의 문제" />
          <BoundaryCard title="Optimization" question="유한한 compute로 parameter를 찾을 수 있는가?" answer="Gradient·initialization·optimizer의 문제" />
          <BoundaryCard title="Generalization" question="처음 보는 data에도 유지되는가?" answer="Split·distribution·regularization의 문제" />
        </div>
        <p>
          다음에는 <a className="font-semibold text-primary underline" href="/ai/supervised-learning-loop">지도학습 한 바퀴</a>에서
          input과 target이 실제 parameter update로 이어지는 순서를 봅니다. 평가 data의 역할은
          <a className="ml-1 font-semibold text-primary underline" href="/ai/train-validation-test">Train·validation·test</a>에서 별도로 다룹니다.
        </p>
        <div id="paper-deep-learning">
          <CitationBlock source="Deep Learning · LeCun, Bengio, Hinton (2015)" citeKey={1} href={DEEP_LEARNING_REVIEW}>
            <Evidence problem="여러 task의 deep learning 성과를 공통된 representation learning 관점으로 설명할 필요" contribution="여러 층의 representation과 backpropagation을 vision·speech·language 사례에 연결" assumptions="미분 가능한 model, task objective와 당시의 data·compute 조건" scope="2015년까지의 review와 인용된 실험 범위" notClaim="특정 hidden unit의 의미나 모든 deep architecture의 우월성을 증명하지 않음" />
          </CitationBlock>
        </div>
        <div id="paper-depth-benefit">
          <CitationBlock source="Benefits of Depth in Neural Networks · Telgarsky (2016)" citeKey={2} href={DEPTH_PAPER}>
            <Evidence problem="Depth가 width와 다른 표현 자원인지 이론적으로 구분" contribution="특정 함수족에서 깊고 작은 network와 얕고 큰 network의 separation 구성" assumptions="논문이 정한 semi-algebraic gate·근사 조건" scope="구성된 함수족의 representation complexity" notClaim="현실의 모든 dataset에서 더 깊은 model이 더 잘 학습되거나 일반화한다는 결론이 아님" />
          </CitationBlock>
        </div>
        <ContentBoundary article="deep-learning-overview" />
      </section>
    </article>
  );
}

function Definition({ term, idea, example, boundary }: { term: string; idea: string; example: string; boundary: string }) {
  return <div className="border-l border-primary/70 pl-5"><p className="text-xs font-bold text-primary">용어</p><h3 className="mt-1 text-lg font-bold">{term}</h3><p className="mt-3 leading-7">{idea}</p><p className="mt-3 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">작은 예:</strong> {example}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">경계:</strong> {boundary}</p></div>;
}
function BoundaryCard({ title, question, answer }: { title: string; question: string; answer: string }) { return <div className="border border-border p-5"><p className="text-xs font-bold text-primary">{title}</p><p className="mt-3 text-sm font-bold leading-6">{question}</p><p className="mt-3 text-xs leading-5 text-muted-foreground">{answer}</p></div>; }
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }
