import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MoeRoutingAndLoadBalancingViz from "./moe-routing-and-load-balancing/viz/MoeRoutingAndLoadBalancingViz";

/**
 * Load balancing loss는 router의 하드 배정을 미분 가능한 확률과 곱해 쏠림을 벌점으로 바꿉니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * 이 글은 "router가 이미 고른 top-k를 어떻게 고르게 유지하는가" 하나만 소유한다.
 * Router logit·probability·top-k 선택 자체와 capacity factor·overflow policy·load
 * imbalance 진단은 mixture-of-experts 글이 정본이며, 이 글은 그 위에서 load balancing
 * loss 식, bias만으로 균형을 잡는 auxiliary-loss-free 갱신, expert collapse의 동역학,
 * sparsity ratio 넷만 새로 소유한다.
 */
export default function MoeRoutingAndLoadBalancingArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          아무 개입 없이 두면 top-k router는 몇 개 expert만 계속 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Router가 처음 학습을 시작할 때는 어느 expert도 똑같이 유망합니다. 그런데 초기
            weight의 작은 편차만으로 특정 expert가 조금 더 자주 뽑히면, 그 expert는 더 많은
            gradient를 받아 더 빨리 좋아지고 다음 batch에서 다시 더 자주 뽑힙니다. 이 되먹임을
            그대로 두면 몇 expert만 일하고 나머지는 한 번도 선택되지 않는 상태로 수렴합니다.
          </p>
          <p>
            이 글은 그 되먹임을 누르는 두 장치를 다룹니다. Load balancing loss는 학습 신호에
            벌점을 더해 쏠림을 누르고, auxiliary-loss-free 방식은 loss 대신 선택 점수에
            bias를 더해 같은 일을 합니다.
          </p>
          <p>
            두 장치가 늦거나 약하면 expert collapse가 일어나고, capacity factor가 정한 상한을
            넘은 token은 버려집니다. 마지막으로 sparsity ratio로 이 model이 저장 parameter
            대비 얼마나 좁은 경로만 쓰는지를 봅니다.
          </p>
          <p>
            Router가 logit을 만들고 top-k를 고르는 계산, capacity factor와 overflow policy의
            정의는{" "}
            <Link to="/ai/mixture-of-experts#routing">MoE 글의 routing 절</Link>과{" "}
            <Link to="/ai/mixture-of-experts#load-balancing">load-balancing 절</Link>이
            다룹니다. 이 글은 그 위에서 균형을 유지하는 두 장치와 실패했을 때의 동역학만
            봅니다.
          </p>
        </div>
        <MoeRoutingAndLoadBalancingViz />
        <ContentBoundary article="moe-routing-and-load-balancing" />
      </section>

      <section id="loss" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Load balancing loss는 실제 배정 비율과 평균 확률을 곱해 쏠림을 벌점으로 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            문제는 실제 배정이 argmax나 top-k로 정해져 미분할 수 없다는 점입니다. Load
            balancing loss는 그 배정 비율 f_i를 router의 softmax 확률 P_i와 곱해 더한 값을
            language-model loss에 더합니다. f_i가 큰 expert는 P_i도 함께 낮아지는 방향으로
            gradient가 흐르므로, 미분 불가능한 배정을 미분 가능한 확률을 통해 간접적으로
            누릅니다.
          </p>
          <p>
            Top-1만 고르던 GShard·Switch와 달리 top-k(k≥2)에서는 f_i를 argmax 하나가 아니라
            token마다 만들어지는 k개 슬롯 전체에서 셉니다. Expert 수 n, token 수 T이면 슬롯은
            kT개이고, f_i는 그 가운데 expert i가 차지한 비율, P_i는 전체 T개 token에 대한
            평균 softmax 확률입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Router가 expert 하나에 쏠릴 때 load balancing loss는 그 쏠림을 어떻게 수치로 벌점화하나요?"
          idea="배정 비율 f_i는 하드 카운트라 미분할 수 없지만 평균 확률 P_i는 미분 가능합니다. 두 값을 곱해 더하면 완전히 균등할 때 최솟값을 가지므로, 이 항을 language-model loss에 더하면 쏠린 expert의 확률을 낮추는 gradient가 생깁니다."
          formula={String.raw`f_i=\frac{1}{kT}\sum_{x}\mathbf{1}[i\in T_k(x)],\quad P_i=\frac{1}{T}\sum_x p_i(x),\quad L_{\mathrm{aux}}=\alpha N\sum_{i=1}^{N}f_iP_i`}
          annotatedFormula={String.raw`\begin{aligned}
f_i&=\underbrace{\frac{1}{kT}\sum_{x}\mathbf{1}[i\in T_k(x)]}_{\text{expert }i\text{가 차지한 slot 비율(hard, 미분 불가)}}\\
P_i&=\underbrace{\frac{1}{T}\sum_x p_i(x)}_{\text{전체 token 평균 softmax 확률(soft, 미분 가능)}}\\
L_{\mathrm{aux}}&=\underbrace{\alpha N\sum_{i=1}^{N}f_iP_i}_{\text{완전히 균등할 때 }\alpha\text{로 최소가 되는 벌점}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\frac{1}{kT}\sum_x\mathbf{1}[i\in T_k(x)]`, annotation: ["token마다 만들어지는 kT개 slot 가운데", "expert i가 받은 slot 비율 계산"] },
            { expression: String.raw`\frac{1}{T}\sum_x p_i(x)`, annotation: ["전체 T개 token의 softmax 확률을 평균해", "expert i가 받은 soft weight 계산"] },
            { expression: String.raw`\alpha N\sum_i f_iP_i`, annotation: ["hard 비율과 soft 확률을 곱해 더한 뒤", "language-model loss에 더할 벌점 확정"] },
          ]}
          terms={[
            { symbol: "N", name: "Expert 수", description: "예시에서는 8입니다." },
            { symbol: "k", name: "Top-k", description: "예시에서는 2입니다." },
            { symbol: "T", name: "Batch token 수", description: "예시에서는 1,024입니다." },
            { symbol: "f_i", name: "Slot 배정 비율", description: "Expert i가 받은 slot 수를 kT로 나눈 값입니다." },
            { symbol: "P_i", name: "평균 routing 확률", description: "Top-k 여부와 무관하게 전체 token에 대해 평균한 softmax 확률입니다." },
            { symbol: String.raw`\alpha`, name: "Loss 강도", description: "Switch Transformer는 0.01을 씁니다." },
          ]}
          assumptions={["Top-k가 hard 연산이라 f_i에는 gradient가 흐르지 않고 P_i를 통해서만 학습 신호가 전달됩니다.", "N개 expert가 완전히 균등하면 f_i=P_i=1/N이고 Σf_iP_i=1/N이라 L_aux=α로 최솟값입니다."]}
          interpretation="N=8, k=2, T=1,024이면 slot은 2,048개입니다. 한 expert가 그 30%(614 slot, 이상적 비율의 2.4배)를 받고 그 expert의 평균 확률이 0.22면 Σf_iP_i≈0.144이고 L_aux≈0.0115로, 균등 상태의 최솟값 0.01보다 약 15% 큽니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 항의 한계는 두 가지입니다. α를 키우면 균형은 좋아지지만 language-model loss와
            경쟁해 token 내용보다 균등 배정을 우선하게 되고, α가 작으면 벌점이 약해 앞 절의
            되먹임을 못 누릅니다. 또 이 항은 batch 단위 평균이라 batch 하나 안에서는 균형이어도
            시간에 따라 특정 expert가 반복해 몰리는 것은 잡지 못합니다.
          </p>
        </div>
      </section>

      <section id="bias" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Bias 갱신은 loss 대신 top-k 선택 점수만 조정해 같은 균형을 잡습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Load balancing loss는 language-model loss에 항을 더하므로 그 gradient가 원래
            objective와 섞입니다. Auxiliary-loss-free balancing은 loss를 건드리지 않고, top-k
            선택에만 쓰는 점수에 expert별 bias를 더합니다. 과부하 expert는 bias를 내려 다음
            step에 덜 뽑히게 하고, 부족한 expert는 bias를 올립니다.
          </p>
          <p>
            핵심은 이 bias가 combine 단계의 가중치에는 들어가지 않는다는 점입니다. Top-k를
            고를 때만 점수에 더해지고, 선택된 expert의 출력을 합칠 때는 원래 확률을 씁니다.
            그래서 bias를 아무리 키워도 model이 실제로 배우는 mixture weight는 왜곡되지
            않습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Bias는 매 step 과부하·부족 expert를 보고 어떻게 갱신되나요?"
          idea="이번 step의 실제 부하 c_i를 평균 부하와 비교해, 평균보다 많이 받았으면 bias를 γ만큼 내리고 적게 받았으면 γ만큼 올립니다. Loss나 gradient 없이 이번 step이 관측한 부하만으로 다음 step의 선택 점수를 조정합니다."
          formula={String.raw`b_i^{(t+1)}=b_i^{(t)}+\gamma\cdot\operatorname{sign}\!\left(\bar{c}^{(t)}-c_i^{(t)}\right)`}
          annotatedFormula={String.raw`b_i^{(t+1)}=\underbrace{b_i^{(t)}}_{\text{이전 step bias}}+\underbrace{\gamma}_{\text{고정 step 크기}}\cdot\underbrace{\operatorname{sign}\!\left(\bar{c}^{(t)}-c_i^{(t)}\right)}_{\text{과부하면 }-1\text{, 부족하면 }+1}`}
          operations={[
            { expression: String.raw`\bar{c}^{(t)}-c_i^{(t)}`, annotation: ["평균 부하에서 expert i의 실제 부하를 빼", "과부하·부족 방향 확인"] },
            { expression: String.raw`\gamma\cdot\operatorname{sign}(\cdot)`, annotation: ["방향에 고정 step 크기를 곱해", "이번 step의 bias 변화량 계산"] },
            { expression: String.raw`b_i^{(t)}+\gamma\cdot\operatorname{sign}(\cdot)`, annotation: ["이전 bias에 변화량을 더해", "다음 step 선택 점수에 쓸 bias 확정"] },
          ]}
          terms={[
            { symbol: "b_i", name: "Expert i의 bias", description: "Top-k 선택 점수에만 더하고 combine weight에는 쓰지 않습니다." },
            { symbol: String.raw`\gamma`, name: "Step 크기", description: "DeepSeek-V3는 초기 14.3T token 동안 0.001을 쓰고 이후 0으로 내렸습니다." },
            { symbol: String.raw`c_i^{(t)}`, name: "이번 step 실제 부하", description: "이번 step에서 expert i가 받은 token 수입니다." },
            { symbol: String.raw`\bar{c}^{(t)}`, name: "평균 부하", description: "이번 step 전체 배정을 expert 수로 나눈 값입니다." },
          ]}
          assumptions={["Combine 단계의 가중치는 bias 없는 원래 확률을 쓰므로 bias를 키워도 mixture weight 자체는 바뀌지 않습니다.", "매 step 관측한 부하만 보는 갱신이라 이전 step의 gradient 계산과 독립적입니다."]}
          interpretation="γ=0.001일 때 과부하 expert 0은 0 → −0.001 → −0.002로 두 step 내려가다가, 세 번째 step에 부하가 평균 아래로 떨어지면 그 step은 갱신을 멈춥니다. 부족한 expert 5는 0 → 0.001 → 0.002 → 0.003으로 세 step 모두 오릅니다."
        />
        <TermBreakdown
          title="Load balancing loss와 auxiliary-loss-free bias가 개입하는 지점"
          items={[
            { term: "Load balancing loss", description: "Language-model loss에 벌점 항을 더해 router의 gradient 자체를 바꿉니다.", example: "α=0.01, N=8이면 균등 상태의 최솟값은 0.01이고 쏠릴수록 커집니다.", boundary: "원래 objective와 섞이므로 α가 크면 token 내용보다 균등을 우선하게 됩니다." },
            { term: "Auxiliary-loss-free bias", description: "Loss는 그대로 두고 top-k 선택 점수에만 bias를 더해 배정만 조정합니다.", example: "γ=0.001이면 bias는 step마다 0.001씩만 움직여 천천히 수렴합니다.", boundary: "선택은 바뀌어도 combine weight는 원래 확률을 쓰므로 bias 자체가 model이 배운 표현은 아닙니다." },
          ]}
        />
      </section>

      <section id="collapse" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Expert collapse는 쏠림이 스스로를 강화해 일부 expert가 멈출 때 일어납니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Expert collapse는 문제 절에서 말한 되먹임이 끝까지 간 상태입니다. 자주 뽑히는
            expert는 더 많은 gradient로 더 빨리 좋아지고, router는 이미 잘하는 expert를 다시
            고르는 것이 loss를 더 줄이므로 그 expert를 더 선호하게 됩니다. 반대로 거의 뽑히지
            않는 expert는 gradient를 받지 못해 초기화 상태에 가깝게 멈추고, 멈춰 있으니 router
            입장에서는 고를 이유가 더 줄어듭니다.
          </p>
          <p>
            Load balancing loss와 bias 갱신은 이 되먹임이 커지기 전에 누르는 장치입니다. α나
            γ가 너무 작거나 학습 초반 몇 step 사이에 이미 큰 격차가 생기면, 두 장치가 있어도
            일부 expert는 사실상 죽은 채로 남습니다. ST-MoE는 이런 학습 불안정을 router
            z-loss로 따로 눌러야 했다고 보고했습니다.
          </p>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Collapse의 직접적인 결과가 token dropping입니다. Capacity factor φ는 expert당
            받을 token 상한을 정하고, 균형이 깨진 채로 그 상한을 넘으면 초과분은 계산되지
            않고 버려지거나 다음 layer로 residual만 전달됩니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Token 하나의 routing forward: logit → 확률 → top-k → capacity 확인 → combine 준비"
          input={["Token hidden state x", "Router weight W_r", "이번 batch의 expert별 누적 부하 c[]", "Capacity C = ceil(φ · kT / N)"]}
          steps={[
            { code: "z ← W_r · x", note: "Router logit을 계산합니다. Expert별 정규화 전 점수입니다." },
            { code: "p ← softmax(z)", note: "Routing probability입니다. 합이 1인 값으로 정규화합니다." },
            { code: "T_k(x) ← top-k index of (p + b)", note: "Top-k routing입니다. Auxiliary-loss-free bias를 쓰면 선택은 p+b로, 이후 가중치는 p로 합니다." },
            { code: "for i in T_k(x): if c[i] < C: assign(x, i); c[i] += 1", note: "Capacity를 확인합니다. 여유가 있으면 배정하고 부하를 늘립니다." },
            { code: "else: drop(x, i)  # token dropping", note: "Capacity를 넘으면 이 slot은 계산하지 않고 버립니다. Expert collapse가 심할수록 이 분기가 잦아집니다." },
            { code: "y ← Σ_{i∈assigned} p_i · E_i(x)", note: "Combine입니다. 배정된 expert의 출력만 원래 확률로 합칩니다. 실제 GPU 간 이동은 expert parallelism 글이 다룹니다." },
          ]}
          output="Token의 MoE 출력 y, 갱신된 c[], 각 slot의 drop 여부"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            숫자로 보면 이렇습니다. N=8, k=2, T=1,024이면 slot 2,048개의 이상적 평균은 expert당
            256입니다. φ=1.25면 capacity는 ceil(1.25 × 256) = 320입니다. 앞 절의 collapse
            예시처럼 expert 0이 614 slot을 받으면 320을 넘는 294 slot, 그 expert 수요의 약
            48%가 계산되지 않고 버려집니다.
          </p>
        </div>
        <ProgressiveDetail
          title="φ를 키우면 drop은 줄지만 padding과 GEMM 낭비가 늘어납니다"
          preview="φ=1.0은 평균만큼만 받아 초과 전부를 버리고, φ=2.0은 거의 안 버리지만 buffer 절반이 빈 자리로 GEMM을 함께 태웁니다. Drop과 padding 사이에 공짜 지점은 없습니다."
        >
          <p>
            같은 예시에서 φ=1.0이면 capacity는 256이라 614 가운데 358이 drop되고, φ=2.0이면
            capacity가 512라 drop은 102로 줄지만 다른 여섯 expert는 각각 256 안팎만 받아 512
            buffer의 절반 가까이가 빈 slot으로 GEMM에 그대로 들어갑니다. DeepSeek-V3는 학습에서
            token을 아예 버리지 않는 대신 bias 갱신만으로 균형을 잡아 이 맞바꿈 자체를
            피했습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="sparsity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Sparsity ratio는 저장한 parameter 가운데 token 하나가 실제로 쓰는 몫입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Sparsity ratio는 active parameter를 total parameter로 나눈 값입니다. 이 숫자가
            작을수록 checkpoint는 크지만 token 하나가 지나는 경로는 좁다는 뜻입니다. 두
            parameter의 정의와 memory·FLOPs로 나누면 안 되는 이유는{" "}
            <Link to="/ai/mixture-of-experts#system-cost">MoE 글의 system cost 절</Link>이
            맡고, 이 절은 그 비율 하나만 봅니다.
          </p>
          <p>
            공유 parameter가 무시할 만큼 작으면 이 비율은 대략 top-k를 expert 수로 나눈
            값에 가까워집니다. 앞의 예시처럼 N=8, k=2이면 25%이고, expert 수를 늘리면서 k를
            그대로 두면 비율은 계속 낮아집니다. DeepSeek-V3는 total 671B, active 37B로 이
            비율이 약 5.5%라고 보고했습니다.
          </p>
        </div>
        <TermBreakdown
          title="Sparsity ratio를 읽을 때와 읽으면 안 되는 때"
          items={[
            { term: "읽을 수 있는 것", description: "저장 parameter 대비 token별 경로가 얼마나 좁은지, 같은 계열 안에서 expert 수를 늘렸을 때 그 좁아짐이 어떻게 변하는지입니다.", example: "N=8→64로 늘리고 k=2를 유지하면 25%에서 3.1%로 낮아집니다.", boundary: "Shared parameter가 크면 이 근사는 깨지므로 실제 비율은 P_active/P_total로 다시 계산해야 합니다." },
            { term: "읽으면 안 되는 것", description: "FLOPs·memory bandwidth·통신량·latency를 이 한 숫자로 대신하는 것입니다.", example: "비율이 같은 두 model도 expert GEMM 크기와 all-to-all topology가 다르면 실제 속도가 다릅니다.", boundary: "Sparsity ratio는 구조적 지표이며 배포 환경의 성능 숫자가 아닙니다." },
          ]}
        />
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 GShard, Switch, ST-MoE, Mixtral, DeepSeek-V3 다섯 논문입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            GShard와 Switch Transformer가 load balancing loss의 형태를 정했고, top-k
            일반화는 Mixtral의 정의를 따릅니다. ST-MoE는 collapse에 가까운 학습 불안정과
            그것을 누르는 추가 loss를, DeepSeek-V3는 auxiliary-loss-free bias 갱신과
            sparsity ratio 수치를 보고했습니다.
          </p>
          <p>
            이 글의 2,048 slot, 614 slot, L_aux≈0.0115, capacity 320, drop 294 같은 수치는
            논문 값이 아니라 본문이 정한 예시 구성으로 직접 계산한 것입니다.
          </p>
        </div>
        <div id="paper-gshard" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Lepikhin et al. · GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding (ICLR 2021)"
            citeKey={1}
            href="https://arxiv.org/abs/2006.16668"
          >
            Random second-expert routing과 함께 auxiliary balance loss를 처음 Transformer
            MoE에 도입해, 여러 device에 흩어진 expert가 학습 초반부터 고르게 쓰이도록
            만들었습니다. 2,048 TPU v3에서 600B parameter를 학습한 결과이며 이 loss 형태가
            모든 router 설계에 최적이라는 주장은 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-switch" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Fedus, Zoph, Shazeer · Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity (JMLR 2022)"
            citeKey={2}
            href="https://arxiv.org/abs/2101.03961"
          >
            Top-1 routing에서 f_i·P_i를 곱해 더하는 지금 형태의 load balancing loss를 α=0.01로
            정리하고, capacity factor 1.0·1.25·2.0의 drop-quality 맞바꿈을 비교했습니다. T5
            계열과 TPU 환경의 결과이며 top-1 특유의 단순화가 포함돼 있습니다.
          </CitationBlock>
        </div>
        <div id="paper-st-moe" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zoph et al. · ST-MoE: Designing Stable and Transferable Sparse Expert Models (2022)"
            citeKey={3}
            href="https://arxiv.org/abs/2202.08906"
          >
            Load balancing loss만으로는 막지 못하는 학습 불안정을 관찰하고, router logit
            크기를 누르는 router z-loss와 capacity factor를 fine-tuning 때 키우는 방안을
            제안했습니다. 저자들의 encoder-decoder 계열 실험 범위의 결과이며 모든 collapse
            사례를 z-loss 하나로 설명하지는 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-mixtral" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Jiang et al. · Mixtral of Experts (2024)"
            citeKey={4}
            href="https://arxiv.org/abs/2401.04088"
          >
            Top-2·8 expert 구성에서 f_i·P_i를 kT개 slot 기준으로 일반화한 load balancing
            loss를 쓰고, 학습된 router의 expert 선택이 사람이 기대하는 주제별 specialization과
            뚜렷이 일치하지 않는다는 분석을 보였습니다. 이 글의 slot 기준 f_i 정의가 이
            논문을 따릅니다.
          </CitationBlock>
        </div>
        <div id="paper-deepseek-v3" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="DeepSeek-AI · DeepSeek-V3 Technical Report §2.1.2 (2024)"
            citeKey={5}
            href="https://arxiv.org/abs/2412.19437"
          >
            Loss 항 없이 expert별 bias를 부하에 따라 γ=0.001씩 갱신하는 auxiliary-loss-free
            balancing을 도입해 학습에서 token을 버리지 않고도 균형을 유지했다고 보고했고,
            total 671B·active 37B parameter로 sparsity ratio 약 5.5%를 명시했습니다. 수치는
            저자들의 hardware·학습 범위 안의 자기보고입니다.
          </CitationBlock>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 읽기는 배정된 token이 실제 GPU 사이를 오가는 비용을 계산하는{" "}
            <Link to="/ai/expert-parallelism-moe-systems#all-to-all">expert parallelism 글</Link>과,
            total·active parameter를 memory·compute 장부로 나누는{" "}
            <Link to="/ai/model-vram-budgeting#moe-serving-boundary">VRAM budgeting 글</Link>입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
