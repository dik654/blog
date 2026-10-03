import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import NumericPath from "@/pages/articles/world-systems/NumericPath";
import SourceApplication from "@/pages/articles/world-systems/SourceApplication";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import PaperReading from "./research-audit-sources/PaperReading";
import { codeRefs, fileTrees, projectMetas } from "./research-audit-sources/codeRefs";

export default function Article(){
  const sidebar=useCodeSidebar();
  return <div className="space-y-16">
    <section id="overview" data-teach-level="S" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">1 · 채점기가 통과시킨 답과 실제 정답을 나눠 센다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">정답 여부를 별도로 확인한 답 100개가 있습니다. 실제 정답 40개 중 채점기는 38개를 통과시켰고 오답 60개 중에서도 12개를 통과시켰습니다. 점수 1인 답은 50개이지만 모두 정답은 아닙니다.</p>
        <p className="leading-8">이 글은 이 채점 결과가 학습 신호로 바뀌는 길을 추적합니다. 최종 답과 중간 과정을 어디서 확인하는지, 보상을 자주 주는 선택이 왜 도움이 되거나 실패하는지, 2026년 과정 검증 논문이 어떤 범위에서 성립하는지 살펴봅니다.</p>
      </div>

      <ContentBoundary article="reward-design-for-verifiable-rl" />
      <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">점수와 정답의 차이를 고정했습니다. 먼저 채점기의 입출력을 봅니다.</p>
    </section>
    <section id="black-box" data-teach-level="B" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2 · 문제·응답·환경 증거를 받아 점수를 만든다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">입력은 문제와 모델 응답뿐 아니라 정답 규칙, test, parser와 환경 실행 결과입니다. 출력은 reward와 채점 실패 여부입니다. 학습기는 이 점수가 높아지는 방향을 찾으므로 점수가 실제 목표를 얼마나 잘 측정하는지가 중요합니다.</p>
        <p className="leading-8">자동 프로그램을 쓰는 RLVR도 parser 오류, 불완전한 test, 정답 데이터 오류에서 자유롭지 않습니다. 또한 형식 통과는 정답 통과와 다릅니다. 무엇을 확인했고 무엇을 보지 못했는지 채점 결과에 함께 남겨야 합니다.</p>
      </div>

      <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">채점기의 권한을 제한했습니다. 100개 결과의 분모를 직접 셉니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3 · 통과 50개 중 정답은 38개다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">정답 40개에서 통과 38개·탈락 2개, 오답 60개에서 통과 12개·탈락 48개입니다. 통과율은 50/100=50%이고 실제 정답률은 40/100=40%입니다. 두 비율은 다른 질문에 답합니다.</p>
        <p className="leading-8">통과한 답의 정답 비율은 38/50=76%입니다. 반면 실제 정답을 놓치지 않는 비율은 38/40=95%입니다. 보상 평균만 보고 모델이 50%를 해결한다고 주장하면 잘못 통과한 12개를 성공으로 세게 됩니다.</p>
      </div>
<NumericPath title="응답이 학습 신호가 되는 길" steps={[{"label": "모델 응답", "value": "100개", "detail": "정답 여부는 별도 검수"}, {"label": "자동 채점", "value": "50개 통과", "detail": "정답 38 + 오답 12"}, {"label": "학습 신호", "value": "통과 답을 강화", "detail": "틀린 통과도 함께 강화될 수 있음"}, {"label": "독립 평가", "value": "정답률 40%", "detail": "채점기의 통과율과 별도 기록"}]} />
      <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">reward와 성공률의 차이를 셌습니다. 그 차이가 학습으로 들어가는 경로를 그립니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">4 · 보상 오류도 최적화 경로를 따라 확대될 수 있다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">문제→응답 생성→채점→유리한 응답의 확률 증가→새 응답 생성의 고리가 반복됩니다. 틀린 답 12개가 우연한 오류라면 노이즈가 되고 특정 형식이나 행동으로 반복 재현할 수 있으면 모델이 그 경로를 학습할 수 있습니다.</p>
        <p className="leading-8">학습용 verifier와 같은 parser·test를 평가에도 그대로 쓰면 이 오류가 두 곳에서 함께 숨을 수 있습니다. 독립된 정답 검수와 새로운 test, 실패 사례의 분류를 두어 최적화한 지표와 실제 작업 성공을 다시 비교합니다.</p>
      </div>

      <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">점수 오류가 왜 위험한지 보았습니다. 이제 보상을 나누는 이름을 붙일 준비를 합니다.</p>
    </section>
    <section id="need" data-teach-level="2" className="scroll-mt-20">
      <span id="problem" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">5 · 마지막 0점만으로 어느 행동이 틀렸는지 알기 어렵다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">여섯 번의 행동 끝에 작업이 실패했다고 합시다. 마지막 reward 0만으로는 첫 다섯 행동이 옳았는지, 중간에 잘못된 행동이 있었는지 알 수 없습니다. 올바른 중간 행동을 확인할 수 있다면 더 가까운 학습 신호를 줄 수 있습니다.</p>
        <p className="leading-8">그러나 단지 중간 점수를 많이 주는 것은 해결책이 아닙니다. 예를 들어 같은 칸을 방문할 때마다 점수를 주면 목표에 가지 않고 순환할 수 있습니다. 중간 점수가 최종 목표와 어떤 관계를 갖는지 먼저 정의해야 합니다.</p>
      </div>

      <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">희소 신호의 문제와 잘못된 중간 신호의 대가를 함께 확인했습니다. 용어를 구분합니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="scroll-mt-20">
      <span id="rlvr" className="scroll-mt-20" />
      <span id="sparse-vs-dense" className="scroll-mt-20" />
      <span id="outcome-vs-process" className="scroll-mt-20" />
      <span id="reward-shape-and-calibration" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">6 · 언제 점수를 주는지와 무엇을 채점하는지는 다른 축이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">Sparse/dense는 점수의 빈도이고 outcome/process는 채점 대상입니다. 최종 결과를 한 번 채점하면 sparse outcome이고 중간 행동을 자주 검사하면 dense process입니다. 중간 검사는 일부 단계에만 둘 수도 있어 두 분류가 완전히 같은 것은 아닙니다.</p>
        <p className="leading-8">Binary reward는 0/1이고 continuous reward는 정도를 표현합니다. 연속 점수라고 자동으로 더 정확하거나 더 보정된 것은 아닙니다. Calibration은 점수와 관측 성공률의 관계를 별도 표본에서 확인하는 작업입니다.</p>
        <p className="leading-8">RLVR은 자동으로 검증 가능한 규칙을 보상에 사용하는 방식입니다. 사람 선호 모델을 쓰지 않아도 검증기 자체의 범위와 오류를 확인해야 합니다. <Link to="/cs/ai/open-r1#reward-system">Open-R1의 reward 구성 정본</Link>과 이어집니다.</p>
        <p className="leading-8">같은 100개 응답에서 형식 통과에 10점, 정답에 1점을 준다고 가정해 봅시다. 형식만 맞는 오답의 10점이 형식을 어긴 정답의 1점보다 높습니다. 서로 다른 reward를 합칠 때는 척도와 가중치를 맞춰야 합니다. 이 조정과 점수가 실제 성공을 얼마나 잘 반영하는지의 검사는 별도로 수행합니다.</p>
      </div>

      <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">빈도·대상·점수 형태를 구분했습니다. 같은 채점 결과가 학습 신호가 되는 계산을 봅니다.</p>
    </section>
    <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
      <span id="hacking" className="scroll-mt-20" />
      <span id="shaping" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">7 · 그룹의 점수가 모두 같으면 상대 신호가 사라진다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">네 응답의 reward가 [0,0,0,0]이면 평균을 뺀 값은 모두 0입니다. [1,1,1,1]도 같습니다. 순수한 group-relative advantage는 서로 무엇을 더 강화할지 구별하지 못합니다. KL 같은 별도 loss가 없다는 뜻은 아닙니다.</p>
        <p className="leading-8">[0,0,1,1]이면 평균 0.5를 빼 [−0.5,−0.5,0.5,0.5]가 됩니다. 표준편차로 나누는지와 어떤 추정량을 쓰는지는 trainer 설정에 따릅니다. 보상을 나누는 규칙과 실제 loss를 같은 버전으로 확인해야 합니다.</p>
        <p className="leading-8">Reward shaping의 한 방법은 γΦ(s′)−Φ(s)를 기존 reward에 더하는 것입니다. 경로를 따라 할인합을 구하면 중간 potential이 상쇄됩니다. γ=1, potential이 0→0.5→0.2→0이면 변화량 0.5−0.3−0.2=0입니다. 반면 방문마다 +0.5를 주면 순환만으로 양의 점수가 생깁니다.</p>
        <p className="leading-8">이 정책 보존 설명은 같은 할인율과 적절한 종료 상태 조건을 둔 이론입니다. 임의의 과정 점수나 LLM judge의 선호를 더하는 것까지 자동으로 보존하지 않습니다.</p>
      </div>
<ExplainedFormula question={"검증기를 통과한 답 가운데 실제로 맞은 비율은 얼마인가?"} idea={"검증기의 점수와 정답 라벨을 따로 모으면 잘못 통과한 답을 셀 수 있습니다. 통과 집합의 분모는 모든 답의 개수와 다릅니다."} formula={"\\mathrm{precision}=\\frac{TP}{TP+FP}=\\frac{38}{38+12}=0.76"} annotatedFormula={"\\frac{\\underbrace{38}_{\\text{맞고 통과}}}{\\underbrace{38+12}_{\\text{통과한 답 전부}}}=76\\%"} operations={[{"expression": "TP+FP", "annotation": ["통과 50개에는 정답 38개와 오답 12개가 함께 있습니다."]}, {"expression": "38/50", "annotation": ["점수 1을 받은 답 가운데 실제 정답의 비율입니다."]}]} terms={[{"symbol": "TP", "name": "옳게 통과", "description": "정답이며 verifier도 통과시킨 38개입니다."}, {"symbol": "FP", "name": "잘못 통과", "description": "오답인데 verifier가 통과시킨 12개입니다."}]} assumptions={["정답 라벨을 별도 검수한 100개 평가 표본의 가정입니다.", "학습 데이터와 독립된 평가, 오류의 종류와 표본 불확실성을 함께 봐야 합니다."]} interpretation={"reward 평균은 50%이지만 실제 정답률은 40%입니다. 정답 중 통과 비율은 38/40=95%로, 통과 답의 정답 비율 76%와 다른 지표입니다."} /><PaperReading id="paper-shaping-theorem" title={"Policy invariance under reward transformations · 1999"} href={"https://people.eecs.berkeley.edu/~russell/papers/icml99-shaping.pdf"} problem={"중간 보상을 더했을 때 원래 최적 정책이 달라지는 문제"} idea={"같은 할인율의 potential 차이로 보상 변환을 제한"} assumption={"논문의 MDP 조건과 할인율, 종료 상태의 potential 조건"} experiment={"정책 보존 정리와 논문이 보고한 제한된 환경 실험"} boundary={"추가 보상의 합이 언제나 0이라는 주장이 아니다. 적절한 경계 조건에서 행동 선택에 무관한 항으로 남아 정책을 보존한다."} />
<AlgorithmBlock title={"검증 점수와 실제 정답을 따로 집계합니다 (의사코드)"} input={["정답을 아는 응답 100개: 실제 정답 40개, 오답 60개", "검증기 통과: 정답 38개와 오답 12개; 미채점 응답은 이번 사례에 없습니다."]} steps={[{"code": "TP=FP=FN=TN=0; unscored=[]", "note": "참값과 검증 점수의 두 축을 유지합니다."}, {"code": "for response in responses: score = verifier(response)", "note": "검증기가 1, 0 또는 None을 반환할 수 있다고 둡니다."}, {"code": "  if score is None: unscored.append(response); continue", "note": "미채점은 오답 0으로 바꾸지 않고 따로 기록합니다."}, {"code": "  increment cell[gold_correct(response), score == 1]", "note": "정답·통과 38, 오답·통과 12, 정답·실패 2, 오답·실패 48입니다."}, {"code": "precision = TP/(TP+FP); recall = TP/(TP+FN)", "note": "분모가 0이면 정의할 수 없다고 기록합니다. 이번에는 모두 양수입니다."}, {"code": "r=[0,0,1,1]; centered_advantage = r − mean(r)", "note": "별도 네 응답 group의 평균 제거 예입니다. 구현별 표준화·KL 항은 이 식에 포함하지 않습니다."}]} output={"통과율 50%, 정답률 40%, precision 76%, recall 95%; 네 응답의 평균 제거 신호는 [−.5,−.5,.5,.5]입니다."} />
      <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">학습 신호가 생기고 사라지는 조건을 봤습니다. 실제 채점 함수의 두 종류를 대조합니다.</p>
    </section>
    <section id="source" data-teach-level="5" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">8 · 공식 코드도 정답 검사와 형식 검사를 따로 둔다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">Open-R1 commit 5b6ff22의 accuracy_reward는 정답과 응답을 파싱해 verify를 호출합니다. 정답 파싱 실패나 검증 예외에서는 None을 돌려주는 경로가 있습니다. 이 값은 오답 0과 다르며 실제 trainer가 어떻게 제외하는지 함께 확인해야 합니다.</p>
        <p className="leading-8">format_reward는 think·answer 태그의 정규식만 확인합니다. 앞의 오답 60개 중 하나가 그 형식을 지키면 형식 점수는 1일 수 있습니다. 그 점수를 정확성 점수와 합산하더라도 이 오답이 실제 정답으로 바뀌지는 않습니다.</p>
        <p className="leading-8">사이드바의 원문 전체와 100개 평가 표를 함께 봅니다. 코드가 무엇을 검사하는지는 원문으로 확인하고 false acceptance가 12개인지 같은 값은 독립된 실행·평가 데이터로 측정해야 합니다. 이 글의 100개는 설명용 가정입니다.</p>
      </div>
<CodeViewButton label="공식 소스 · accuracy_reward와 format_reward" onClick={() => sidebar.open("rewards", codeRefs.rewards)} /><SourceApplication source={"Open-R1의 동치 검사"} excerpt={"reward = float(verify(gold_parsed, answer_parsed))"} application={"이 함수의 통과 50개가 실제 정답 40개와 같은 집합인지 독립 검수합니다. 형식 검사는 별도 함수입니다."} /><CitationBlock source={"Open-R1의 동치 검사"} citeKey={2} href={"https://github.com/huggingface/open-r1/blob/5b6ff22b3fb7aa069c54866e517f39dfc3160e09/src/open_r1/rewards.py"}>2026-10-04에 고정한 공식 원문입니다.</CitationBlock><PaperReading id="paper-verifier-code" title={"Open-R1 rewards.py · 5b6ff22"} href={"https://github.com/huggingface/open-r1/blob/5b6ff22b3fb7aa069c54866e517f39dfc3160e09/src/open_r1/rewards.py"} problem={"학습에 사용할 correctness와 format 점수를 구현"} idea={"parser·symbolic verifier와 형식 함수를 분리"} assumption={"의존성·정답 표현·예외 처리와 trainer의 None 처리"} experiment={"이 글은 공식 코드 경로를 대조했으며 모델 학습을 재현하지 않음"} boundary={"자동 실행된다는 사실은 verifier가 정답을 완벽하게 판정한다는 보장이 아니다."} />
      <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">함수 이름 대신 실제 검사 범위를 확인했습니다. 과정 검증과 judge 비교를 봅니다.</p>
    </section>
    <section id="comparison" data-teach-level="6" className="scroll-mt-20">
      <span id="paper-prm" className="scroll-mt-20" />
      <span id="paper-reward-hacking" className="scroll-mt-20" />
      <span id="paper-concrete-problems" className="scroll-mt-20" />
      <span id="paper-reward-shaping" className="scroll-mt-20" />
      <h2 className="mb-6 text-2xl font-bold">9 · 과정 oracle과 learned judge는 다른 증거를 준다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">VPR의 식 (2)는 각 상태·행동에 verifier V(sₜ,aₜ)를 적용해 그 결과를 과정 reward로 둡니다. 여섯 행동의 검사 결과가 [1,1,0,1,1,0]이면 어느 시점이 통과하지 못했는지 여섯 값으로 보존됩니다. 단순 합계 4만 남기면 위치 정보가 다시 사라집니다.</p>
        <p className="leading-8">논문의 Sudoku 사례는 유일한 정답 격자와 현재 칸의 값을 비교합니다. 이는 형식만 맞는 풀이 설명이나 임의의 실제 업무 행동을 모두 판정할 수 있다는 뜻이 아닙니다. Tic-Tac-Toe·Minesweeper도 각 환경의 검색·제약·belief 조건에 의존합니다.</p>
        <p className="leading-8">Reasoning Arena는 그룹의 outcome reward가 전부 같을 때 trace끼리 비교하는 judge를 활용하는 다른 접근입니다. 상대 점수는 생기지만 학습된 판정자의 오류·순서 효과·편향이 새로 들어옵니다. 첫 100개 사례의 잘못 통과 12개 같은 검사를 과정 점수에도 반복해야 합니다.</p>
      </div>
<SourceApplication source={"VPR 식 (2)"} excerpt={"rₜ = V(sₜ, aₜ)"} application={"여섯 행동에 [1,1,0,1,1,0]을 보존하면 마지막 실패 0만 주는 경우보다 오류 위치를 구별할 수 있습니다."} /><CitationBlock source={"VPR 식 (2)"} citeKey={2} href={"https://arxiv.org/html/2605.10325v1"}>2026-10-04에 고정한 공식 원문입니다.</CitationBlock><PaperReading id="paper-vpr" title={"Verifiable Process Rewards · arXiv 2605.10325v1"} href={"https://arxiv.org/html/2605.10325v1"} problem={"긴 경로에서 마지막 결과만 주는 credit assignment 문제"} idea={"환경별 oracle로 행동 단계마다 검증 신호를 생성"} assumption={"중간 행동을 신뢰성 있게 검사할 구조가 존재해야 함"} experiment={"Tic-Tac-Toe·Sudoku·Minesweeper와 전이 benchmark의 저자 실험"} boundary={"과정 verifier의 품질에 의존한다. 열린 환경에서 범용적으로 정확한 oracle을 제공하는 결과는 아니다."} /><PaperReading id="paper-reasoning-arena" title={"Reasoning Arena · arXiv 2606.09380v1"} href={"https://arxiv.org/html/2606.09380v1"} problem={"reward가 모두 같은 그룹의 상대 신호 부재"} idea={"trace 비교를 통한 상대 학습 신호"} assumption={"judge가 비교해야 할 이유와 평가 기준이 타당해야 함"} experiment={"논문의 수학·코드 benchmark 비교에 대한 저자 자기보고"} boundary={"판정자 점수를 객관적인 정답 증명으로 바꿔 읽지 않는다."} />
      <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">더 촘촘한 점수와 더 정확한 증거가 별개임을 확인했습니다. 마지막으로 평가 경계를 고정합니다.</p>
    </section>
    <section id="limits" data-teach-level="7" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">10 · 좋은 점수가 실제 성공을 뜻하는지 계속 검증한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">평가에는 문제 출처·중복·정답 라벨, parser와 test 버전, 실패·시간초과·채점 불가의 분모를 기록합니다. 학습용 reward가 개선되어도 독립 held-out 성공과 실제 효과가 개선되는지 따로 확인합니다. <Link to="/cs/ai/agent-verification">에이전트 결과 검증</Link>은 최종 artifact와 외부 효과까지 이어집니다.</p>
        <p className="leading-8">100개 표본의 76% precision을 모든 분포의 고정 상수로 쓰지 않습니다. 모델이 최적화되면서 새로운 오류를 찾아낼 수 있고 문제 종류나 출력 형식도 바뀝니다. 같은 verifier를 쓰더라도 주기적으로 오류 집합을 다시 읽어야 합니다.</p>
        <p className="leading-8">예측해 보세요. 점수 1인 답이 50개에서 70개로 늘면 정답률도 20%p 올랐을까요? 추가 통과 20개 가운데 실제 정답 수를 모르면 알 수 없습니다. 3절의 정답·통과 교차표를 다시 만들어 답할 수 있습니다.</p>
      </div>

      <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보상의 계산, 검사 범위와 독립 성공률을 함께 확인하면 추적이 끝납니다.</p>
    </section>
    <ReviewPrompts questions={["통과 답이 50개에서 70개로 늘면 정답률도 20%p 올랐을까요? (답: 3절)", "reward가 모두 1이면 group-relative 학습 신호는 어떻게 될까요? (답: 7절)", "과정 oracle과 learned judge가 제공하는 증거는 어떻게 다를까요? (답: 9절)"]} />
    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas} />
  </div>;
}
