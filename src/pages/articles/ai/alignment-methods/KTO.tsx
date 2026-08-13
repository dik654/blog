import ExplainedFormula from "@/components/ui/explained-formula";
import MethodChoiceViz from "../rlhf/viz/MethodChoiceViz";

export default function KTO() {
  return (
    <section id="kto" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        KTO는 paired ranking 없이 binary feedback을 사용한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          실제 제품 log에는 같은 prompt에 대한 두 응답의 ranking보다 개별 응답의
          thumbs-up/down이 더 많이 쌓일 수 있다. Kahneman–Tversky
          Optimization(KTO)은 response마다 desirable 또는 undesirable label만
          있어도 학습할 수 있도록, policy와 reference의 log-ratio를 KL reference
          point와 비교한다. Prospect theory는 이름의 배경이지만, 핵심 구현 계약은
          gain과 loss를 기준점 양쪽에서 비대칭적으로 다루는 binary objective다.
        </p>
      </div>

      <ExplainedFormula
        question="Pair가 없는 desirable·undesirable label을 reference 대비 policy update로 어떻게 바꿀까?"
        idea={<>Response의 policy/reference log-ratio를 암묵적 reward로 보고, batch에서 추정한 KL을 reference point z0로 둡니다. Desirable이면 그 기준보다 높아질수록 utility가 커지고, undesirable이면 기준보다 낮아질수록 utility가 커지도록 sigmoid 방향을 반대로 둡니다.</>}
        formula={String.raw`\begin{aligned}r_\theta&=\log\pi_\theta(y\mid x)-\log\pi_{ref}(y\mid x)\\z_0&=D_{KL}(\pi_\theta\|\pi_{ref})\\z&=r_\theta-z_0\\v_D&=\lambda_D\sigma(\beta z),\quad v_U=\lambda_U\sigma(-\beta z)\\\mathcal L_{KTO}&=\mathbb E_{\mathcal D}[\lambda_y-v_y]\end{aligned}`}
        terms={[
          { symbol: "r_\theta", name: "implicit reward", description: "현재 policy가 reference보다 response y를 얼마나 더 선호하는지 나타내는 log-ratio입니다." },
          { symbol: "z_0", name: "reference point", description: "Policy와 reference의 KL을 batch에서 추정해 gain·loss 기준으로 사용합니다." },
          { symbol: "\lambda_D,\lambda_U", name: "class weights", description: "Desirable·undesirable feedback의 비대칭과 class imbalance를 조절합니다." },
          { symbol: "\beta", name: "utility scale", description: "Reference point 주변 sigmoid의 민감도를 정합니다." },
        ]}
        assumptions={["각 example에는 binary label이 있지만 같은 prompt의 짝이 반드시 필요하지는 않습니다.", "표준 KTO는 reference model과 KL estimate를 사용하며 z0를 통한 gradient는 stop-gradient로 다룹니다."]}
        interpretation="KTO는 pair collection 비용을 줄일 수 있지만 binary log가 자동으로 깨끗해지는 것은 아닙니다. 노출되지 않은 응답, 무응답과 실제 dislike를 구분하고 사용자별 feedback propensity를 점검해야 합니다."
      />

      <MethodChoiceViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>방법 선택은 확보 가능한 feedback에서 시작한다</h3>
        <p>
          Online exploration과 새 response scoring이 필요하면 PPO 계열, 정제된
          pairwise preference가 있으면 DPO, SFT와 preference를 한 stage로 묶으려면
          ORPO, 독립적인 binary feedback이 중심이면 KTO를 후보로 둔다. 다만 이
          분류는 첫 필터일 뿐이며, 최종 선택은 같은 base checkpoint와 data budget,
          decoding·judge 조건에서 capability·preference·safety regression을 함께
          비교해 결정한다.
        </p>
        <p>
          <a href="https://arxiv.org/abs/2402.01306" target="_blank" rel="noreferrer">KTO 논문</a>은
          1B~30B 실험에서 DPO와 경쟁하는 결과와 심한 class imbalance 조건을
          보고했지만, 동시에 어떤 human-aware loss도 보편적으로 우월하지 않으며
          setting에 맞는 inductive bias를 선택해야 한다고 명시한다. 이 제한을 빼고
          “binary feedback이 pair보다 항상 낫다”로 요약하면 논문의 결론보다 강한
          주장이 된다.
        </p>
      </div>

      <div
        id="paper-kto"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · KTO</p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          핵심 기여는 pair를 복원하지 않고 binary label을 기준점 양쪽에서 학습한 것이다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Policy/reference log-ratio를 implicit reward로 보고 batch KL을 reference
          point로 사용해 desirable과 undesirable example의 utility 방향을 나눕니다.
          Prospect theory는 이 비대칭 utility의 동기이며, 실제 제품 log에서는
          exposure bias·class imbalance·사용자별 click propensity를 별도로 다뤄야
          논문의 clean label 가정을 운영 환경에 옮길 수 있습니다.
        </p>
      </div>
    </section>
  );
}
