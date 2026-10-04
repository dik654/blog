import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ValidationRiskViz } from "./viz/ModernCrossValidationViz";
export default function Article() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 새 대상을 잘 맞히는지부터 물어야 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>과거 자료를 잘 맞혔다는 점수만으로 처음 만나는 대상에도 잘 작동한다고 말할 수는 없습니다. 한 사람의 비슷한 기록을 양쪽에 나누면 이미 익숙한 사람을 다시 알아본 성과가 섞일 수 있습니다.</p><p>이 글은 처음 보는 사람에게 쓸 예측기를 평가하는 상황을 따라갑니다. 무엇을 새로 만나며 누구의 실패를 같은 무게로 셀지 정한 뒤 자료를 나누는 이유를 살펴봅니다.</p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 사용할 장면을 정하고 작은 예행연습을 만듭니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>먼저 실제 사용에서 새로 나타날 대상과 틀림을 세는 방식을 정합니다. 그 대상의 기록을 학습에서 빼 두고 예측한 뒤 정답과 비교합니다. 마지막으로 처음 정한 단위와 무게대로 결과를 평균냅니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>실제 사용에서 새로 만날 대상을 정한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>그 대상의 기록을 학습에서 빼 둔다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>처음 보는 기록을 예측한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>정해 둔 단위별로 실패를 평균낸다</span></li></ol></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 기록 4개와 사람 2명은 다른 평균을 만듭니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>환자 A·B·C·D에게서 각각 2·2·3·1개 기록을 얻었다고 합시다. A·B의 4개로 학습하고 처음 보는 C·D의 4개로 평가합니다. 질병의 실제 진단 성능을 주장하는 자료가 아닌 계산용 사례입니다. (가정)</p><p>
            틀리면 1, 맞으면 0을 매깁니다. C의 세 기록은 모두 맞고 D의 한 기록은 틀려 손실은 [0,0,0,1]입니다. 기록마다 같은 무게를 주면 1/4=0.25이고 사람마다 같은
            무게를 주면 (0+1)/2=0.50입니다. 같은 예측에서도 질문에 따라 평균이 달라집니다. (가정)
          </p></div></section>

<section id="inside-evaluation" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 학습 대상과 평가 대상과 평균의 단위를 연결합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>A·B로 만든 예측기는 C·D의 어떤 기록도 배우지 않았습니다. 예측 결과마다 누구의 기록인지 남겨야 C의 세 결과를 먼저 묶을 수 있습니다. 정답과 비교한 뒤 사람별 평균을 구하고 두 사람을 같은 무게로 합칩니다.</p><p>이 순서에서 자료를 나누는 부분과 결과를 합치는 부분은 별개의 일을 합니다. 사람을 분리해 놓고도 마지막에 모든 행을 단순 평균하면 기록이 많은 C에게 더 큰 무게를 준 셈입니다.</p></div></section>

<section id="why-unit" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 좋아 보이는 평균을 나중에 고르면 질문이 바뀝니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>새로 온 사람 한 명의 평균적인 실패를 알고 싶다면 C와 D를 같은 무게로 세는 0.50이 이 사례의 목표와 맞습니다. 반대로 실제 업무 비용이 기록 하나마다 생긴다면 기록 비중을 반영한 0.25가 목적에 맞을 수 있습니다.</p><p>
            어느 쪽이 항상 옳은 것은 아닙니다. 평가 결과를 보기 전에 대상이 나타나는 빈도와 실패 비용을 정해야 합니다. 점수를 낮추려고 0.50 대신 0.25를 골라 보고하면 같은
            질문에 답한 것이 아닙니다.
          </p></div></section>

<section id="validation-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 예행연습의 대상과 목표에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>배포에서 새로 만날 것을 deployment unit이라고 하고 실패의 크기를 숫자로 바꾸는 규칙을 loss라고 합니다. 무엇을 어떤 분포와 무게로 평균낼지까지 정한 목표가 estimand입니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Deployment distribution", "description": "실제 사용에서 대상과 조건이 나타나는 빈도입니다.", "boundary": "과거 자료의 빈도와 자동으로 같지 않습니다."}, {"term": "Cross-validation", "description": "자료 일부를 평가용으로 남기는 일을 바꾸어 반복해 학습 절차를 평가합니다.", "boundary": "분할 방식과 집계 단위는 목적에 맞춰 따로 정합니다."}, {"term": "Validation risk", "description": "정한 배포 단위의 손실을 평균내려는 위험 값입니다.", "boundary": "한 번 관측한 점수는 미지의 기대값에 대한 추정입니다."}]} /><ValidationRiskViz /></section>

<section id="risk" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. C와 D를 평균내는 계산을 학습 절차의 식으로 씁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>우리 사례의 학습 자료 D에는 A·B가 들어갑니다. 절차 A가 전처리와 학습을 실행해 모델 f_D를 만들고 새 대상 Z인 C와 D를 예측합니다. 환자 D라는 이름과 식의 학습 자료 기호 D는 구별합니다.</p><p>C의 평균 손실은 (0+0+0)/3=0이고 D의 평균 손실은 1입니다. 두 사람을 같은 확률로 뽑는 평가에서는 (0+1)/2=0.50입니다. 행을 균등하게 뽑으면 C의 비중이 3/4여서 0.25가 됩니다. (가정)</p><p>아래 식은 학습 자료도 다시 얻어 절차를 재실행하는 평균입니다. 이미 고정한 모델 하나를 평가한다면 그 모델을 고정한 채 새 대상만 평균냅니다. 작은 자료로 학습한 여러 모델의 점수가 전체 자료로 다시 학습한 최종 모델의 정확한 위험과 같다고 보장하지 않습니다.</p></div><ExplainedFormula
          question="왜 validation risk 식에는 training data와 새 배포 단위가 모두 들어가나요?"
          idea={<p>
            학습 절차 A는 training sample D를 model로 바꿉니다. 그 model을 배포 분포에서 새로 뽑은 Z에 적용해 loss를 계산한 뒤 D와 Z가 달라질 때의
            평균을 냅니다.
          </p>}
          formula={String.raw`R_{\mathrm{deploy}}(A)=\mathbb E_{D,Z}[\ell(A(D),Z)]`}
          annotatedFormula={String.raw`\begin{aligned}f_D&=\underbrace{A(D)}_{\text{training data로 model을 학습}}\\e_{D,Z}&=\underbrace{\ell(f_D,Z)}_{\text{새 배포 단위에서 실패를 측정}}\\R_{\mathrm{deploy}}(A)&=\underbrace{\mathbb E_{D,Z}[e_{D,Z}]}_{\text{D와 Z의 변동을 평균}}
\end{aligned}`}
          operations={[
            { expression: String.raw`A(D)`, annotation: ["training sample을 입력해", "평가할 model을 생성"] },
            { expression: String.raw`\ell(f_D,Z)`, annotation: ["새 배포 단위의 prediction을", "업무 loss로 변환"] },
            { expression: String.raw`\mathbb E_{D,Z}`, annotation: ["가능한 학습 data와 배포 단위에 걸쳐", "절차의 평균 risk를 정의"] },
          ]}
          terms={[
            { symbol: "A", name: "Learning procedure", description: "전처리·학습·선택 규칙을 포함한 재실행 가능한 절차입니다." },
            { symbol: "D", name: "Training sample", description: "과거 분포에서 관측한 학습 data입니다." },
            { symbol: "Z", name: "Deployment unit", description: "운영에서 새로 예측할 row·entity·period·site입니다." },
          ]}
          assumptions={["Loss와 averaging unit을 split 전에 고정합니다.","D를 뽑는 학습 표본의 분포·크기와 Z를 뽑는 배포 분포를 명시한 절차 평균입니다.", "Historical data가 미래 배포 분포를 어느 정도 재현할 수 있어야 합니다."]}
          interpretation="새 환자에게 같은 가중치를 주는 목표에서는 C의 평균 0과 D의 평균 1을 평균해 0.50을 얻습니다. 이는 이번 평가의 추정값이며 미지의 기대 위험 자체를 알아낸 것은 아닙니다."
        /></section>

<section id="paper-cv-foundation" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 공식 문서의 보지 못한 그룹 조건을 적용합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>scikit-learn 1.7.2 문서 §3.1.2.4는 같은 대상에서 나온 반복 기록을 분리하지 않으면 관측 사이의 독립 가정이 깨질 수 있다고 설명합니다. 새 대상에 대한 평가라면 평가 대상이 대응하는 학습 집합에 나타나지 않도록 요구합니다.</p></div><div id="source-unseen-groups" className="mt-8 scroll-mt-20"><CitationBlock source="scikit-learn 1.7.2 — grouped data" citeKey={1} href="https://scikit-learn.org/1.7/modules/cross_validation.html#cross-validation-iterators-for-grouped-data"><q>unseen groups</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>C·D를 처음 보는 대상으로 삼았으므로 C의 기록 하나라도 A·B 쪽에 섞이면 이 요구를 어깁니다. GroupKFold는 주어진 대상 식별자를 함께 옮기는 도구입니다. 최종 집계까지 환자별 같은 무게로 바꾸지는 않으므로 0.50 계산은 별도로 구현합니다.</p></div></div></section>

<section id="split-family" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 다음 달과 새 병원은 다른 예행연습이 필요합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>행들이 서로 독립이며 같은 분포에서 왔다고 볼 수 있으면 일반 K-fold가 출발점입니다. 새 대상이면 그룹을 통째로 격리하고 미래 기간이면 과거로 학습해 이후를 평가하는 walk-forward를 씁니다. 새 병원의 미래가 질문이면 대상과 시간 조건을 함께 지킵니다.</p><p>행 순서를 바꿔도 분포가 같다는 교환가능성만으로 독립성이 자동 성립하지는 않습니다. 어떤 의존성이 남는지 확인해야 합니다. 대상 분리와 시간 방향 중 하나만 잘 지켰다고 모든 누수가 사라지지도 않습니다.</p></div></section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 과거에 맞춘 질문도 새 환경에서는 다시 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>새 국가, 새로운 센서, 기록 정책의 변화가 생기면 과거 자료가 새 사용 장면을 대표하지 못할 수 있습니다. 새 기간과 장소의 자료에서 다시 평가하고 운영 중 실패도 확인합니다.</p><p>지금 계산한 0.50은 C·D 두 명의 결과입니다. 두 명만으로 모든 새 환자의 위험을 정밀하게 알아냈다고 말할 수는 없습니다. 대상 수와 기록 수를 함께 보고해야 근거의 크기가 드러납니다.</p></div><ContentBoundary article="cross-validation" /></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 평균을 바꾸면 어떤 질문이 바뀌나요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>C의 세 손실이 0이고 D의 한 손실이 1일 때 행 평균과 사람 평균은 각각 얼마인가요? (답: 7절)</p><p>GroupKFold로 사람을 분리했다면 최종 점수도 자동으로 사람별 같은 무게가 될까요? (답: 8절)</p><p>다음 달의 기존 환자와 새 병원의 미래 환자는 어떤 다른 분할 조건이 필요한가요? (답: 9절)</p></div></section></div>; }
