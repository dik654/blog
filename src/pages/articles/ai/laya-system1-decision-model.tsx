import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import LayaSystem1DecisionModelViz from "./laya-system1-decision-model/viz/LayaSystem1DecisionModelViz";
import ScoringRuleViz from "./laya-system1-decision-model/viz/ScoringRuleViz";
import { codeRefs } from "./laya-system1-decision-model/codeRefs";
import { layaTrees } from "./laya-system1-decision-model/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function LayaSystem1DecisionModelArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => (
    <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />
  );

  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 고객 문의 하나를 분류하려고 문장을 생성할 필요는 없습니다</h2>
          <div className={prose}>
            <p>
              &quot;3월에 두 번 청구됐어요. 오늘 환불해 주지 않으면 해지하겠습니다.&quot;라는 문의가 왔다고 합시다. 서비스가 알고 싶은 것은 세 가지입니다. 어느 부서로
              보낼지, 얼마나 급한지, 해지하겠다고 말했는지입니다. 이 일을 생성형 LLM에 맡기면 모델이 답을 글로 쓰고, 서비스는 그 글을 다시 파싱해야 합니다. 글이 형식을 벗어나면
              파싱이 실패하고 token을 하나씩 만드는 시간도 듭니다.
            </p>
            <p>
              Laya는 Convai Innovations가 2026년 9월에 Apache 2.0으로 공개한 모델로, 이 일을 생성 없이 처리합니다. 상태 글과 질문·선택지를 한 줄로
              이어 encoder에 넣고 선택지마다 붙인 [MASK] 자리의 점수를 그 질문 안에서 softmax하는 분류기입니다.
            </p>
            <p>
              선택지를 요청할 때 정하므로 다시 학습하지 않고도 새 질문을 받습니다. 학습 보상을 strictly proper scoring rule로 줘서 정직한 확률을 내도록
              만들었지만 출시 상태는 과신하므로 temperature를 다시 맞춰야 합니다. 이것이 이 글의 답입니다.
            </p>
            <p>
              이 글은 청구 문의 하나를 따라 시퀀스 구성, 점수 head, 학습 보상, 확률 보정, 언어별 checkpoint 선택을 차례로 봅니다. 코드는 GitHub 커밋
              432312b와 Hugging Face 리비전 7b928d8의 원문이고 성능 수치는 모두 제작사가 모델 카드에 적은 자기보고입니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 상태와 유형이 붙은 질문을 받아 확률을 돌려줍니다</h2>
          <div className={prose}>
            <p>
              입력은 둘입니다. 하나는 판단할 대상인 상태로, 글이나 이메일이나 JSON입니다. 다른 하나는 질문 묶음이고 질문마다 유형이 있습니다. choice는 정해 준 선택지
              중 하나를, score는 순서가 있는 단계 중 어디쯤인지를, noul은 예·아니오를 묻습니다.
            </p>
            <p>
              출력은 질문마다 확률입니다. choice는 선택지별 확률과 가장 큰 선택지, score는 단계별 확률과 그 기대값, noul은 예일 확률을 돌려줍니다. 글을 만들지 않으므로
              파싱할 문자열이 없고 모든 질문을 한 번의 forward pass로 답합니다. 카드는 T4 GPU에서 질문 하나에 39.5 ms(English)라고 적습니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 청구 문의 하나에 질문 세 개를 붙입니다</h2>
          <div className={prose}>
            <p>
              카드의 예제와 같은 질문 세 개를 씁니다. department는 choice이고 선택지가 billing·technical·other 세 개입니다. urgency는 score이고 단계가 &quot;급하지
              않음&quot;, &quot;곧&quot;, &quot;막힘&quot; 세 개입니다. churn_risk는 noul이고 &quot;해지하겠다고 말했는가&quot;를 묻습니다.
            </p>
            <p>
              모델이 department에서 billing을 0.916, urgency의 세 단계를 0.04·0.08·0.88, churn_risk를 0.73으로 냈다고 둡니다. 이 숫자들은 계산을 따라가기 위한
              가정입니다. urgency는 단계 번호 0·1·2의 기대값으로 답하므로 0.08 + 2 × 0.88 = 1.84가 됩니다. (가정)
            </p>
            <p>
              같은 상태에 질문이 세 개라면 상태 글도 세 번 읽힐까요? 그리고 선택지가 세 개가 아니라 77개라면 어떻게 될까요? 다음 절이 그 구조를 그림으로 봅니다.
            </p>
          </div>
        </section>

        <section id="sequence" data-teach-level="1" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 질문마다 한 줄을 만들고 선택지 앞 [MASK]에서 점수를 읽습니다</h2>
          <div className={prose}>
            <p>
              질문 하나는 encoder에 들어가는 한 줄이 됩니다. 앞에 질문 유형과 지시문이 오고 그 뒤에 선택지마다 [MASK] 하나와 선택지 글이 이어지며 마지막에 상태 글이
              붙습니다. 질문 세 개는 같은 상태 글을 붙인 세 줄이 되어 한 batch로 함께 계산됩니다. 상태 글을 token으로 바꾸는 일은 한 번만 하고 줄마다 다시 씁니다.
            </p>
            <p>
              English checkpoint는 한 줄이 512 token입니다. 질문 부분을 192 token 안에 두므로 상태 글에는 적어도 319 token이 남고 그보다 긴
              상태는 뒤가 잘립니다. 선택지가 많아 질문 부분이 넘칠 때는 선택지 하나에 줄 token 수를 줄입니다. 그림의 마지막 장면이 그 경우입니다.
            </p>
          </div>
          <LayaSystem1DecisionModelViz />
          <CalculationWalkthrough
            title="한 줄의 token 예산"
            question="상태 글에는 몇 token이 남고, 선택지 77개면 이름에 몇 token이 남나요?"
            scope="build_sequence와 build_head의 규칙만 셉니다. 실제 질문 부분 길이는 tokenizer에 따라 192보다 짧을 수 있습니다."
            steps={[
              { label: "English 한 줄", expression: "max_len = 512, head_max_len = 192", result: "질문 부분 ≤ 192", reason: "rl_agent_config.json의 기본값입니다." },
              { label: "상태가 쓸 자리", expression: "512 − 192 − 1", result: "319 token 이상", reason: "끝의 [SEP] 한 칸을 빼고 남는 자리입니다. 질문이 짧으면 더 늘어납니다." },
              { label: "선택지당 상한", expression: "max(4, (256 − 16) ÷ 77)", result: "4 token", reason: "multilingual의 head_max_len 256에서 선택지 합이 넘칠 때 쓰는 식입니다. 240 ÷ 77의 몫 3보다 하한 4가 큽니다." },
              { label: "이름에 남는 token", expression: "4 − 1([MASK])", result: "3 token", reason: "선택지 앞의 [MASK]도 그 4 token 안에 들어갑니다." },
              { label: "선택지 전체", expression: "77 × 4", result: "308 token", reason: "질문 부분 상한 256을 넘으므로 지시문은 8 token까지 줄어듭니다." },
            ]}
            conclusion="상태에는 319 token 이상이 남지만, 선택지 77개는 이름 하나를 3 token으로 줄여 서로 구별하기 어렵게 만듭니다."
            caveats={["카드는 Banking77(77개)에서 0.425를 보고하며 이 예산을 원인으로 듭니다.", "head_max_len과 max_len은 실행 중에 늘릴 수 있습니다."]}
          />
          <div className="flex flex-wrap gap-2">
            {code("build-head", "질문 부분과 선택지 예산")}
            {code("build-sequence", "상태 글을 붙이고 자르는 곳")}
          </div>
        </section>

        <section id="why-markers" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 선택지를 입력에 넣으면 출력 칸을 미리 정해 둘 필요가 없습니다</h2>
          <div className={prose}>
            <p>
              일반적인 BERT 분류기는 마지막에 class 수만큼 출력 칸이 있는 head를 붙입니다. billing·technical·other 세 칸으로 학습하면 sales를 추가할 때 head를 바꾸고
              다시 학습해야 합니다. <Link to="/cs/ai/bert-task-heads#task-head">BERT task head</Link>가 그 구조입니다.
            </p>
            <p>
              Laya는 선택지를 입력 글로 넣고 선택지마다 붙인 [MASK] 자리의 hidden vector를 같은 scorer에 통과시켜 점수 하나씩을 얻습니다. 출력 칸의 수는 그 질문에
              넣은 [MASK]의 수이므로, sales를 추가하려면 선택지 글 하나를 더 넣으면 됩니다. softmax는 그 질문의 [MASK]끼리만 합니다.
            </p>
            <p>
              생성형 LLM과 비교하면 출력이 처음부터 확률 분포라는 점이 다릅니다. LLM에게 JSON으로 답하게 하면 형식을 지키게 하는 별도 장치가 필요한데,{" "}
              <Link to="/cs/ai/structured-generation-serving">구조화 생성</Link>이 그 장치를 다룹니다. Laya는 그 대신 고를 수 있는 답의 모양을 처음부터 질문 유형으로
              제한했습니다. 자유로운 글이 필요한 일은 할 수 없습니다.
            </p>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 선택지 앞 [MASK]와 그 위의 작은 층에 이름을 붙입니다</h2>
          <div className={prose}>
            <p>
              선택지마다 점수를 읽는 자리인 [MASK]를 카드는 option marker라고 부릅니다. encoder 위에 얹어 marker의 점수를 내는 transformer 2층과 scorer를 decision head라고
              부릅니다. encoder는 English가 ModernBERT-large, multilingual이 mmBERT-base입니다.
            </p>
            <p>
              choice·score·noul 세 유형은 카드가 typed question이라고 부르는 단위입니다. 제작사는 이 모델을 사람이 빠르게 직관으로 판단하는
              &quot;System 1&quot;에 빗대어 System 1 decision model이라고 부르지만 이 글은 그 비유를 메커니즘의 근거로 쓰지 않습니다. (가정)
            </p>
          </div>
        </section>

        <section id="trace" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 청구 문의 하나가 checkpoint 선택부터 답까지 지나는 길</h2>
          <div className={prose}>
            <p>
              요청이 오면 Router가 먼저 어느 checkpoint로 보낼지 정합니다. 문의가 영어 라틴 문자이면 English, 다른 문자나 다른 언어이면 multilingual로 보냅니다. 다음에
              질문 세 개를 세 줄로 만들고 encoder와 decision head를 한 번 통과시킵니다.
            </p>
            <p>
              줄마다 marker 위치의 hidden을 모아 scorer로 점수를 내고 그 질문의 marker끼리만 softmax합니다. 이때 (질문 유형, 선택지 수)마다 저장된
              temperature로 점수를 나눕니다. department는 choice:3-5 칸의 1.760, churn_risk는 noul:2 칸의 1.983입니다. 마지막으로
              유형별 답을 만듭니다. urgency는 단계 번호의 기대값 1.84를 돌려줍니다.
            </p>
            <p>
              답에는 confidence가 두 가지 붙습니다. answer_confidence는 가장 큰 확률이고, choice·score의 confidence는 분포가 얼마나 몰렸는지를 엔트로피로 잰 값입니다.
              temperature로 맞추는 것은 앞의 것뿐이라 둘을 같은 문턱으로 비교하지 않습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">{code("decode-answers", "temperature로 나누고 답을 만드는 곳")}</div>
        </section>

        <section id="model-source" data-teach-level="5" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. decision head는 encoder 395M 위의 약 26M입니다</h2>
          <div className={prose}>
            <p>
              common.py 574–658행의 DecisionModel이 구조 전체입니다. encoder의 출력에 질문 유형 embedding을 더하고 PyTorch
              TransformerEncoderLayer 두 층을 통과시킨 뒤, marker 위치의 hidden만 골라 LayerNorm·Linear·GELU·Linear로 점수 하나를
              만듭니다. 다른 질문의 자리는 −1e4로 막아 softmax에서 빠집니다.
            </p>
            <p>
              hidden 크기는 ModernBERT-large의 1024입니다. 카드의 421M은 encoder 395M과 head를 더한 값인데, 아래 장부처럼 head의 크기를 세어 보면 약 26M이 나와 합이
              맞습니다. head는 처음부터 학습했고 encoder도 함께 미세조정했다고 카드는 적습니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="decision head의 parameter 수"
            question="encoder 395M에 무엇을 더해 421M이 되나요?"
            scope="common.py의 층 정의에서 weight와 bias를 근사로 셉니다. LayerNorm 같은 작은 항은 반올림 안에 들어갑니다. 이 글의 계산입니다."
            steps={[
              { label: "attention", expression: "4 × 1024 × 1024", result: "약 4.2M", reason: "query·key·value·출력 투영 네 개가 d×d입니다." },
              { label: "feed-forward", expression: "2 × 1024 × 4096", result: "약 8.4M", reason: "dim_feedforward가 4d이고 들어가고 나오는 두 행렬이 있습니다." },
              { label: "head 한 층", expression: "4.2M + 8.4M + bias·norm", result: "약 12.6M", reason: "transformer 층 하나의 합입니다." },
              { label: "두 층과 scorer", expression: "2 × 12.6M + 1.05M + 0.26M", result: "약 26.5M", reason: "scorer의 d×d Linear와 act head의 (d+4)×256이 더해집니다." },
              { label: "전체", expression: "395M + 26.5M", result: "약 421M", reason: "카드의 421M과 맞습니다." },
            ]}
            conclusion="Laya의 크기는 거의 encoder이고 decision head는 그 위의 6% 정도입니다."
            caveats={["encoder 395M은 카드의 값입니다.", "multilingual은 mmBERT-base 위에 같은 구조의 head를 얹어 전체 322M입니다."]}
          />
          <div className="flex flex-wrap gap-2">{code("decision-model", "DecisionModel 전체")}</div>
        </section>

        <section id="rlcd" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. 확률을 부풀리면 손해가 되는 보상으로 학습합니다</h2>
          <div className={prose}>
            <p>
              확률을 내는 모델에 정답만 맞히면 1점을 주면, 0.6이라고 하든 0.99라고 하든 같은 점수를 받습니다. 그러면 모델이 확률을 정직하게 낼 이유가 없습니다. 실제로
              맞을 확률을 그대로 보고할 때만 기대 점수가 가장 큰 채점 규칙을{" "}
              <Link to="/cs/ai/classification-metrics#proper-score">strictly proper scoring rule</Link>이라고 부릅니다.
            </p>
            <p>
              Laya는 이 규칙을 강화학습의 보상으로 쓰고 이 방식을 RLCD(Reinforcement Learning for Calibrated Decisions)라고 부릅니다. 보상은 log score에 구면 score를
              더하고, 순서가 있는 score 유형에는 누적분포 차이(RPS)를 뺍니다. 참 확률 0.7인 예·아니오 질문에서 0.7을 보고하면 log score의 기대값이 −0.611, 0.9를 보고하면
              −0.765입니다.
            </p>
          </div>
          <ExplainedFormula
            question="보고한 분포 q는 어떤 보상을 받나요?"
            idea={<p>정답 쪽 확률의 log와 정답 쪽 확률을 분포 길이로 나눈 값을 더하고, 순서형 질문이면 누적분포가 얼마나 어긋났는지를 뺍니다.</p>}
            formula={String.raw`r(q,y)=\log q_y+w_{\mathrm{sph}}\frac{q_y}{\lVert q\rVert}-w_{\mathrm{rps}}\frac{\sum_k (Q_k-Y_k)^2}{K-1}`}
            annotatedFormula={String.raw`r(q,y)=\underbrace{\log q_y}_{\text{정답 쪽 확률의 log}}+w_{\mathrm{sph}}\underbrace{\frac{q_y}{\lVert q\rVert}}_{\text{구면 score}}-w_{\mathrm{rps}}\underbrace{\frac{\sum_k (Q_k-Y_k)^2}{K-1}}_{\text{score 유형만: 누적분포 차이}}`}
            operations={[
              { expression: String.raw`\log q_y`, annotation: ["정답에 준 확률이 작을수록", "크게 깎는 log score입니다."] },
              { expression: String.raw`q_y/\lVert q\rVert`, annotation: ["정답 쪽 확률을 분포 길이로 나눠", "완만하게 채점합니다."] },
              { expression: String.raw`\sum_k (Q_k-Y_k)^2/(K-1)`, annotation: ["단계형 질문에서 누적분포 차이를 빼", "가까운 단계를 덜 깎습니다."] },
            ]}
            terms={[
              { symbol: "q", name: "보고 분포", description: "모델이 선택지마다 낸 확률입니다." },
              { symbol: "y", name: "정답", description: "학습 표본의 답입니다. 교사 모델의 부드러운 분포일 수도 있습니다." },
              { symbol: String.raw`w_{\mathrm{sph}}`, name: "구면 가중치", description: "train.py 기본값 0.75, proper_reward 함수의 기본값은 0.5입니다." },
              { symbol: "Q, Y", name: "누적분포", description: "단계 순서대로 확률을 더한 값입니다." },
            ]}
            assumptions={["log와 구면 score는 각각 strictly proper이고 양수 가중합도 그렇습니다.", "정직한 보고가 기대 보상을 최대로 한다는 것은 학습 목표의 성질이지 결과 모델의 보정을 보장하지 않습니다."]}
            interpretation="참 확률 0.7에서 0.7을 보고하면 −0.611 + 0.75 × 0.762 = −0.040, 0.9를 보고하면 −0.765 + 0.75 × 0.729 = −0.218입니다."
          />
          <ScoringRuleViz />
          <div className={prose}>
            <p>
              강화학습 부분은 다음 순서로 돕니다. 현재 logit에 평균 0인 Gaussian noise를 더해 표본 4개를 만들고 표본마다 보상을 매긴 뒤 표본 평균보다 나은 표본
              쪽으로 logit을 옮깁니다. 아래 절차의 note는 표본 2개짜리 작은 예를 따라갑니다. 코드의 기본값은 4개입니다.
            </p>
          </div>
          <AlgorithmBlock
            title="RLCD 한 batch (train.py rlcd_loss)"
            input={["질문 하나의 logit (no 0.0, yes 0.4)", "정답 yes, 표본 수 S, noise 크기 σ = 0.4"]}
            steps={[
              { code: "ε_s ~ N(0, σ²)을 선택지 위에서 평균 0으로 맞춘다", note: "두 선택지면 (−a, +a) 꼴입니다. 예: 표본1 a = +0.3, 표본2 a = −0.3." },
              { code: "z_s = logit + ε_s, q_s = softmax(z_s)", note: "표본1 z = (−0.3, 0.7)로 yes 0.731, 표본2 z = (0.3, 0.1)로 yes 0.450입니다." },
              { code: "r_s = proper_reward(q_s, 정답)", note: "log + 0.75·구면으로 표본1 0.391, 표본2 −0.323입니다." },
              { code: "adv_s = (r_s − mean(r)) / std(r)", note: "평균 0.034를 빼고 표준편차로 나눠 +0.707, −0.707입니다." },
              { code: "loss = −mean(adv_s · log N(z_s; logit, σ²)) + soft CE", note: "좋은 표본1의 방향(yes logit 위로)으로 끌고 나쁜 표본2의 방향에서 밀어내므로 둘 다 yes logit을 올립니다." },
              { code: "epoch마다 σ를 0.4에서 0.1로 줄인다", note: "sigma_at이 선형으로 줄여 뒤로 갈수록 탐색 폭이 좁아집니다." },
            ]}
            output="정답 쪽 logit이 오른 모델. 보상이 proper하므로 확률을 부풀리는 방향의 표본은 평균보다 낮은 보상을 받습니다."
          />
          <div className={prose}>
            <p>
              손실에는 정책 경사 항과 함께 목표 분포에 대한 soft cross-entropy가 더해집니다. cross-entropy도 log score이므로 proper한 목표입니다. train.py 머리말은
              typed-decisions 과제에서 정책 경사 항을 더해도 soft cross-entropy만 쓸 때보다 나아지지 않았다고 적습니다(#741). 그래서 &quot;강화학습이라 보정된다&quot;보다
              &quot;proper한 목표로 학습했다&quot;가 더 정확한 요약입니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("proper-reward", "proper_reward 원문")}
            {code("rlcd-loss", "rlcd_loss 원문")}
            {code("sigma-schedule", "표본 수·σ 기본값")}
          </div>
        </section>

        <section id="calibration" data-teach-level="6" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 출시 상태는 과신하므로 (유형, 선택지 수)마다 temperature를 다시 맞춥니다</h2>
          <div className={prose}>
            <p>
              proper한 목표로 학습했어도 결과 모델이 보정되어 있다는 보장은 없습니다. 카드는 출시 checkpoint가 과신한다고 적고 질문 유형과 선택지 수의 칸마다
              temperature 하나를 다시 맞추면 English의 평균 ECE가 0.466에서 0.081로, multilingual은 0.314에서 0.106으로 내려간다고
              보고합니다.
            </p>
            <p>
              temperature T는 softmax 전에 logit을 T로 나누는 수입니다. noul:2 칸의 T는 1.983이라 logit 차이 2.0이 1.008로 줄고, 예일 확률이 0.881에서 0.733으로
              내려갑니다. calibrate.py는 보정 표본의 음의 log 우도를 최소화하는 T를 LBFGS로 찾고 0.5~5 범위로 자릅니다. 일반적인 temperature scaling은{" "}
              <Link to="/cs/ai/image-probability-decisions#temperature">이미지 확률 판단</Link>에서 다룹니다.
            </p>
            <p>
              출시 설정에는 이상한 칸도 있습니다. choice:11+의 T는 0.1006이라 logit을 오히려 10배 키웁니다. common.py의 주석은 이 값이 0.24인 최고
              확률을 0.9999로 부풀린다고 적고 그래서 0.5보다 작은 T를 쓰지 않고 0.5로 묶습니다. 0.5로 묶어도 같은 0.24가 0.4993이 되므로 선택지가 11개 이상인
              질문의 확률로 문턱을 정하면 안 됩니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="temperature와 ECE"
            question="T = 1.983은 확률을 얼마나 낮추고, 보정이 잘 됐는지는 어떻게 재나요?"
            scope="noul 질문 하나와 답 10개짜리 가상의 묶음입니다. ECE 칸은 코드처럼 15개지만 예에서는 두 칸만 찹니다. (가정)"
            steps={[
              { label: "보정 전", expression: "σ(2.0)", result: "0.881", reason: "yes와 no의 logit 차이 2.0을 sigmoid에 넣은 값입니다." },
              { label: "T로 나누기", expression: "2.0 ÷ 1.983", result: "1.008", reason: "noul:2 칸의 출시 temperature입니다." },
              { label: "보정 후", expression: "σ(1.008)", result: "0.733", reason: "확신이 0.881에서 0.733으로 내려갑니다." },
              { label: "ECE 첫 칸", expression: "0.5 × |0.95 − 0.6|", result: "0.175", reason: "답 10개 중 5개가 평균 확신 0.95인데 3개만 맞았습니다." },
              { label: "ECE 둘째 칸", expression: "0.5 × |0.65 − 0.6|", result: "0.025", reason: "나머지 5개는 평균 확신 0.65에 3개가 맞았습니다." },
              { label: "ECE", expression: "0.175 + 0.025", result: "0.2", reason: "칸의 비중을 곱해 확신과 정답률의 차이를 더합니다." },
            ]}
            conclusion="T가 1보다 크면 확신을 낮추고, ECE는 그 확신이 실제 정답률과 얼마나 어긋나는지를 잽니다."
            caveats={["ECE 0.466→0.081은 제작사가 보고한 값입니다.", "calibrate.py는 표본이 적은 칸은 맞추지 않고 1.0이나 유형 단위 값을 씁니다."]}
          />
          <div className="flex flex-wrap gap-2">
            {code("fit-temperature", "temperature를 맞추는 LBFGS")}
            {code("shipped-temps", "출시된 temperature 표")}
            {code("temp-clamp", "0.5 미만을 거부하는 이유")}
            {code("ece-score", "ECE 계산")}
          </div>
        </section>

        <section id="router" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 영어 checkpoint는 다른 문자에서 틀리면서도 확신하므로 문자로 먼저 고릅니다</h2>
          <div className={prose}>
            <p>
              Hugging Face 저장소에는 checkpoint가 셋 있습니다. English(ModernBERT-large, 421M, 512 token), multilingual(mmBERT-base, 322M, 1024 token, 8,192까지
              확장), typed-decisions(English를 네 가지 업무 흐름으로 미세조정)입니다. Router는 이 중 하나를 요청마다 고릅니다.
            </p>
            <p>
              카드는 English checkpoint가 크메르어에서 정답률 0.000을 내면서 확신은 0.952였다고 적습니다. 틀리면서도 확신하므로 확신도 문턱으로는 걸러지지
              않습니다. 그래서 Router는 forward 전에 문자를 검사합니다. router.py의 _route는 명시한 모델, 명시한 과제, 언어 힌트, 문자·언어 검출 순으로
              확인하고 라틴 문자가 아니거나 영어가 아니면 multilingual로 보냅니다.
            </p>
            <p>
              checkpoint를 새로 올리는 데는 수 초가 걸립니다. 기본 Router는 English와 multilingual 두 개를 메모리에 남기고 오래 안 쓴 것부터 내리며
              하나만 남기면 언어가 바뀔 때마다 CPU 7.4초, T4 10.3초가 걸렸다고 카드는 적습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">{code("route", "checkpoint를 고르는 순서")}</div>
        </section>

        <section id="benchmarks" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 높은 정확도는 미세조정한 checkpoint의 값입니다</h2>
          <div className={prose}>
            <p>
              카드가 앞세우는 0.766은 typed-decisions 과제의 학습 분할로 미세조정한 checkpoint의 정확도입니다. 같은 2,000개 결정에서 기본 English checkpoint는 0.362,
              multilingual은 0.342였습니다. 무작위가 0.318, 질문마다 가장 흔한 답을 고르는 기준이 0.461이므로 기본 checkpoint는 이 과제에서 다수 class보다 낮습니다.
              카드도 Laya를 &quot;미세조정할 빠른 바탕&quot;이라고 적습니다.
            </p>
            <p>
              비교 대상인 TypeSafe Jev의 수치는 제3자가 공개한 값이며 Laya 제작사가 직접 재지 않았고 표본과 prompt도 다르다고 카드가 밝힙니다. 그 표에서 Laya는
              AG News 0.950 대 0.910으로 앞서지만 선택지 77개인 Banking77에서는 0.425 대 0.870으로 뒤집니다. 4절의 선택지당 3 token 예산이 그
              이유입니다.
            </p>
          </div>
          <ProgressiveDetail
            title="카드의 다른 한계는 무엇인가요?"
            preview="noul이 상태 대신 선택지 이름을 따라가는 문제와, 행동 확률에 신호가 없다는 점을 카드가 스스로 적습니다."
          >
            <p>
              noul은 두 선택지를 false:와 true:로 그리는데, English checkpoint에서는 이 이름 쌍이 상태보다 강하게 작용해 분명히 긍정인 입력에도 확신 있는 &quot;아니오&quot;를
              낼 수 있다고 적습니다(#156). 카드는 같은 질문을 중립적인 키의 두 선택지 choice로 바꿔 보라고 권합니다.
            </p>
            <p>
              decision head의 act_probability는 거의 모든 입력에서 1.0이고 정답 여부와 AUROC 0.30으로 오히려 반대로 움직인다고 적습니다(#185). 문턱은 confidence로 걸라고
              하며 그 AUROC는 0.77입니다. 순서형 score 질문이 가장 약해 SST-5에서 0.372였다는 점도 적혀 있습니다.
            </p>
          </ProgressiveDetail>
          <div className="flex flex-wrap gap-2">{code("card-limits", "모델 카드의 Honest Limits")}</div>
          <div className="not-prose my-8">
            <CitationBlock source="Convai Innovations · convaiinnovations/laya model card (Hugging Face rev 7b928d8)" citeKey={1} href="https://huggingface.co/convaiinnovations/laya">
              <q>Laya is a fast base to specialise, not a zero-shot decision engine.</q> 같은 절은 기본 checkpoint가 typed-decisions에서 0.362로 다수 class 0.461보다
              낮고 0.766은 미세조정한 checkpoint의 값이라고 적습니다. 속도·정확도·ECE는 모두 제작사의 T4 측정입니다.
            </CitationBlock>
            <CitationBlock source="NandhaKishorM/laya · GitHub (commit 432312b)" citeKey={2} href="https://github.com/NandhaKishorM/laya/tree/432312b36714d8889eba405507b37eda25257d9c">
              DecisionModel·proper_reward·rlcd_loss·temperature 맞춤·Router의 원문입니다. Apache-2.0이며 저장소는 2026-09-18에 만들어졌습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 생성형 LLM 앞에서 빠르게 거르는 자리에 맞고, 자기 데이터로 맞춘 뒤에 씁니다</h2>
          <div className={prose}>
            <p>
              이 구조가 맞는 자리는 답의 모양이 정해진 반복 판단입니다. 문의를 부서로 나누기, 위험 문구 거르기, 다음 단계로 올릴지 정하기처럼 수십 ms 안에 확률이 필요한
              곳입니다. 생성형 모델을 부르기 전에 요청을 고르는 자리라면{" "}
              <Link to="/cs/ai/llm-gateway-and-model-routing">LLM gateway의 routing</Link>과 함께 놓을 수 있습니다. (가정)
            </p>
            <p>
              쓰기 전에 할 일이 둘 있습니다. 하나는 자기 업무의 결정으로 미세조정하는 것입니다. 카드의 수치가 보여 주듯 기본 checkpoint만으로는 다수 class 기준도 넘지 못할 수
              있습니다. 다른 하나는 자기 데이터로 temperature를 다시 맞추고 ECE를 재는 것입니다. 선택지가 많은 질문은 head 예산을 늘리거나 두 단계로 나눠 묻습니다.
            </p>
            <p>
              긴 설명, 근거 인용, 여러 단계의 추론이 필요한 판단은 이 모델의 일이 아닙니다. 상태 글이 길면 319 token 뒤가 잘리고 multilingual도 8,192
              token까지 늘렸을 때 4,000 token을 넘는 문서에서는 결과가 흔들렸다고 카드가 적습니다.
            </p>
          </div>
          <ContentBoundary article="laya-system1-decision-model" />
        </section>

        <section id="review" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">14. 같은 문의로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>department 질문에 선택지 sales를 하나 더하려면 무엇을 바꿔야 하나요? BERT 분류 head와 비교해 답해 보세요. (답: 5절)</p>
            <p>참 확률 0.7인 질문에서 0.8을 보고하면 log score의 기대값은 0.7을 보고할 때보다 높을까요, 낮을까요? (답: 9절)</p>
            <p>선택지 15개짜리 choice 질문의 확률 0.9를 그대로 문턱으로 쓰면 어떤 위험이 있나요? (답: 10절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={layaTrees}
        projectMetas={{
          laya: { id: "laya", label: "Laya 432312b 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          "laya-hf": { id: "laya-hf", label: "Hugging Face rev 7b928d8", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
