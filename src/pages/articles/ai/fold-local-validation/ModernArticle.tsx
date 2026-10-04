import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { FoldLocalViz } from "../cross-validation/viz/ModernCrossValidationViz";
export default function Article() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 평균을 미리 구하는 일도 학습에 포함됩니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>평가 자료의 정답만 가렸다고 공정한 시험이 되는 것은 아닙니다. 값의 평균이나 단어 목록을 전체 자료로 만들면 평가 자료의 특징이 이미 모델 앞단에 들어갑니다.</p><p>이 글은 네 숫자 중 두 개만 학습에 쓰는 상황을 따라갑니다. 학습에서 계산한 평균을 평가에는 적용만 해야 하는 이유를 직접 계산합니다.</p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 배울 값과 적용할 값을 먼저 나눕니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>행을 학습과 평가로 나눈 뒤 학습 값에서 중심과 크기를 계산해 저장합니다. 평가 값에는 저장한 수를 그대로 사용합니다. 평가를 보며 중심을 다시 구하면 처음 정한 정보 경계를 바꾼 것입니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>학습 행과 평가 행을 고정한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>학습 값에서 평균과 크기를 구한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>그 상태를 저장한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>평가 값에는 저장 상태만 적용한다</span></li></ol></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 2와 4에서 배운 평균을 8과 10에 적용합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>학습 값은 [2,4], 평가 값은 [8,10]이라고 합시다. 학습 평균은 3이고 평균에서의 차이는 −1과 1입니다. 차이의 제곱 평균이 1이므로 그 제곱근인 표준편차도 1입니다. (가정)</p><p>평가 값에서 3을 빼고 1로 나누면 [5,7]입니다. 평가 값까지 평균에 넣으면 중심이 6으로 바뀝니다. 계산이 가능하다는 것과 공정한 평가라는 것은 별개입니다. (가정)</p></div></section>

<section id="inside-state" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 행 배정과 저장한 계산 상태를 연결합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>먼저 어느 행을 학습에서 빼는지 기록합니다. 그 학습 행으로 평균 3과 크기 1을 만들고 같은 상태를 학습과 평가에 적용합니다. 각 예측이 어느 행 묶음과 어떤 저장 상태에서 나왔는지도 남깁니다.</p><p>다음 묶음을 평가할 때는 새 학습 행에서 상태를 다시 만듭니다. 모든 평가를 하나의 전체 자료 평균으로 처리하면 각 묶음에서 보지 않아야 할 값이 상태에 섞입니다.</p></div></section>

<section id="why-fit" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 정답 없이도 평가 분포를 미리 읽을 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>전체 [2,4,8,10]의 평균은 6입니다. 평가 값이 높다는 정보가 중심을 3에서 6으로 옮겼습니다. 정답 열을 읽지 않았더라도 시험 자료가 표현을 만드는 데 참여했습니다.</p><p>결측값을 채우는 평균, 자주 나온 단어 목록, 선택할 입력 항목도 자료에서 배울 수 있습니다. 모델 가중치만 학습 쪽에 두고 앞단의 이런 계산을 전체 자료로 하면 같은 문제가 남습니다.</p></div></section>

<section id="fold-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 상태를 배우는 fit과 적용하는 transform을 나눕니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>자료에서 상태를 만드는 동작이 fit이며 이미 정한 상태를 적용하는 동작이 transform입니다. 전처리와 모델을 연결해 같은 학습 경계 안에서 실행하는 도구가 Pipeline입니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Fitted state", "description": "학습 자료에서 계산해 저장한 평균·분산·단어장·선택 규칙입니다.", "boundary": "모델 가중치만을 뜻하지 않습니다."}, {"term": "Fold manifest", "description": "행 식별자가 어느 평가 묶음에 들어가는지 저장한 배정 기록입니다.", "boundary": "seed 숫자만으로 자료 순서와 버전까지 고정하지는 못합니다."}, {"term": "Fold-local transform", "description": "현재 평가 묶음을 제외한 학습 행에서만 상태를 만든 전처리입니다.", "boundary": "평가에서는 상태를 갱신하지 않습니다."}]} /><FoldLocalViz /></section>

<section id="pipeline" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 평균 3과 크기 1을 고정한 계산을 추적합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>학습 평균은 (2+4)/2=3입니다. StandardScaler의 기본 계산처럼 제곱 편차를 표본 수 2로 나누면 ((2−3)²+(4−3)²)/2=1이고 표준편차는 1입니다. 평가 결과는 (8−3)/1=5와 (10−3)/1=7입니다. (가정)</p><p>잘못해서 전체 네 값을 fit하면 평균 6, 제곱 편차 평균 (16+4+4+16)/4=10이 됩니다. 평가 변환값은 2/√10≈0.63246과 4/√10≈1.26491로 바뀝니다. 숫자가 작아졌다고 성능이 좋아졌다고 말할 수 없고 평가 자료가 상태에 섞였다는 사실을 먼저 봅니다. (가정)</p></div><ExplainedFormula
          question="왜 scaler 평균을 전체 data가 아니라 train fold에서만 계산하나요?"
          idea={<p>
            평균과 scale도 결국 data distribution을 추정한 값입니다. Validation row를 포함하면 시험 분포의 위치를 미리 fitted state에 넣게
            됩니다.
          </p>}
          formula={String.raw`\mu_{-k}=\frac{1}{|T_k|}\sum_{i\in T_k}x_i,\quad \widetilde x_j=\frac{x_j-\mu_{-k}}{s_{-k}}\;(j\in V_k)`}
          annotatedFormula={String.raw`\begin{aligned}\mu_{-k}&=\underbrace{|T_k|^{-1}\sum_{i\in T_k}x_i}_{\text{train fold에서만 중심을 fit}}\\s_{-k}&=\underbrace{\operatorname{scale}(\{x_i:i\in T_k\})}_{\text{train fold에서만 scale을 fit}}\\\widetilde x_j&=\underbrace{(x_j-\mu_{-k})/s_{-k}}_{\text{validation row에는 저장 state만 적용}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\sum_{i\in T_k}x_i/|T_k|`, annotation: ["validation fold를 제외하고", "training 중심을 추정"] },
            { expression: String.raw`x_j-\mu_{-k}`, annotation: ["validation 값에서", "training 중심을 제거"] },
            { expression: String.raw`(x_j-\mu_{-k})/s_{-k}`, annotation: ["training scale로 나눠", "고정 coordinate에 배치"] },
          ]}
          terms={[
            { symbol: String.raw`T_k`, name: "Training rows for fold k", description: "k번째 validation fold를 제외한 row 집합입니다." },
            { symbol: String.raw`V_k`, name: "Validation rows for fold k", description: "현재 model과 transform을 fit할 때 보이지 않는 row 집합입니다." },
            { symbol: String.raw`\mu_{-k},s_{-k}`, name: "Fold-local state", description: "Training rows에서 추정한 중심과 scale입니다." },
          ]}
          assumptions={["Fold manifest는 model 비교 동안 고정합니다.", "Missing·category fallback도 train fold에서 정의합니다.","이 사례의 StandardScaler는 ddof=0 표준편차를 쓰며 학습 [2,4]의 scale은 1입니다."]}
          interpretation="학습 [2,4]에서 μ=3, s=1을 저장하고 평가 [8,10]에는 빼고 나누기만 하여 [5,7]을 얻습니다."
        /></section>

<section id="paper-fold-local" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 공식 예제의 학습과 적용 호출을 구분합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>scikit-learn 1.7.2 Common pitfalls §11.1은 학습 쪽에서 상태를 만들고 평가 쪽에는 같은 상태를 적용하는 실제 호출을 보여 줍니다. §11.2는 상태를 배울 때 평가 자료를 포함하면 누수가 생긴다고 설명합니다.</p></div><div id="source-scaler-calls" className="mt-8 scroll-mt-20"><CitationBlock source="scikit-learn 1.7.2 — Common pitfalls §11.1" citeKey={1} href="https://scikit-learn.org/1.7/common_pitfalls.html"><q>X_train_transformed = scaler.fit_transform(X_train)</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>공식 호출의 X_train에 [2,4]를 넣으면 저장 평균은 3입니다. 이어 평가에는 scaler.transform(X_test)를 호출하므로 [8,10]이 [5,7]로 바뀝니다. 아래 계산은 이 글의 네 값에 API 규칙을 적용한 것이며 원문 예제의 측정 결과를 바꿔 인용한 것이 아닙니다.</p></div></div><div id="source-scaler-ddof" className="mt-8 scroll-mt-20"><CitationBlock source="scikit-learn 1.7.2 — StandardScaler Notes" citeKey={1} href="https://scikit-learn.org/1.7/modules/generated/sklearn.preprocessing.StandardScaler.html"><q>numpy.std(x, ddof=0)</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>표본 수로 나누는 공식 규칙을 적용하면 [2,4]의 scale은 1입니다. ddof=1인 표본 표준편차 √2와 혼동하면 위의 [5,7]을 재현할 수 없습니다. Pipeline을 CV 안에 넘기면 각 학습 묶음에서 이 fit을 실행하지만 밖에서 전체 단어장을 만든 custom 단계까지 고쳐 주지는 않습니다.</p></div></div></section>

<section id="manifest" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 예측마다 실제 행 배정과 저장 상태를 연결합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>평가 예측에는 행 ID와 fold ID를 붙이고 학습 행 목록의 hash, 전처리 버전, 저장 상태의 checksum, 모델 파일도 연결합니다. 그래야 [8,10]의 결과가 정말 [2,4]에서 만든 상태를 사용했는지 확인할 수 있습니다.</p><p>같은 seed를 써도 자료 순서가 바뀌거나 행이 추가되면 분할이 달라질 수 있습니다. 실제 배정표를 남기면 어떤 행이 어느 학습에 들어갔는지를 직접 대조할 수 있습니다.</p></div></section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 선택 뒤 전체 학습 자료를 다시 쓰는 단계는 구별합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>후보 선택이 끝나고 별도의 최종 평가 자료를 계속 닫아 둔다면 전체 학습 [2,4,8,10]으로 다시 fit해 배포할 수 있습니다. 이때 평균 6은 전체 학습에서 정당하게 배운 상태입니다. 앞서 네 행을 평가하던 단계와 목적이 달라졌으므로 기존 평가 예측을 새 상태의 성능이라고 바꾸어 부르지 않습니다.</p><p>학습 값이 모두 같아 분산이 0이면 StandardScaler는 scale을 1로 두어 0으로 나누지 않습니다. 외부 자료로 미리 학습한 고정 변환은 fold마다 재학습하지 않을 수 있지만 출처 버전·목적·평가 대상과의 중복을 기록해야 정보 사용 범위를 판단할 수 있습니다.</p></div><ContentBoundary article="fold-local-validation" /></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 어떤 자료에서 배운 상태인가요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>학습 [2,4]에서 ddof=0 규칙으로 구한 평균과 표준편차, 평가 [8,10]의 변환값은 무엇인가요? (답: 7절)</p><p>Pipeline 앞에서 전체 자료의 단어장을 만들었다면 Pipeline이 있다는 이유로 누수가 사라질까요? (답: 8절)</p><p>후보를 고른 뒤 전체 학습 자료로 평균 6을 다시 구하는 것은 어떤 조건에서 허용되나요? (답: 10절)</p></div></section></div>; }
