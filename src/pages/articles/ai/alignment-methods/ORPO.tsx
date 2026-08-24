import ExplainedFormula from "@/components/ui/explained-formula";

export default function ORPO() {
  return (
    <section id="orpo" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ORPO는 chosen likelihood와 preference separation을 한 단계에서 학습한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Odds Ratio Preference Optimization(ORPO)은 SFT가 chosen response를
          모방하는 동안 rejected response를 명시적으로 낮추지 않는다는 관찰에서
          출발한다. Chosen의 negative log-likelihood에 chosen·rejected generation
          odds를 벌리는 term을 더해, 별도의 reference model과 후속 preference
          stage 없이 domain adaptation과 preference separation을 함께 수행한다.
        </p>
      </div>

      <ExplainedFormula
        question="Chosen likelihood를 높이는 SFT와 rejected 대비 preference margin을 한 objective에 어떻게 넣을까?"
        idea={<>Sequence probability pθ(y|x)를 odds p/(1−p)로 바꾸고 chosen odds와 rejected odds의 비를 log-sigmoid loss로 학습합니다. 동시에 SFT term이 chosen token likelihood를 직접 높여 domain adaptation의 기준축을 유지합니다.</>}
        formula={String.raw`\begin{aligned}p_\pm&=p_\theta(y_\pm\mid x)\\o_\pm&=\frac{p_\pm}{1-p_\pm}\\\Delta&=\log o_+-\log o_-\\L_O&=-\log\sigma(\Delta)\\L&=L_S+\lambda L_O\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
o_+(x)
 &=\underbrace{\frac{p_\theta(y_+\mid x)}{1-p_\theta(y_+\mid x)}}_{\text{chosen odds}}\\
o_-(x)
 &=\underbrace{\frac{p_\theta(y_-\mid x)}{1-p_\theta(y_-\mid x)}}_{\text{rejected odds}}\\
\Delta_{OR}
 &=\underbrace{\log o_+(x)-\log o_-(x)}_{\text{preference gap}}\\
\mathcal L_{ORPO}
 &=\underbrace{\mathcal L_{SFT}}_{\text{chosen 모방}}
  +\underbrace{\lambda[-\log\sigma(\Delta_{OR})]}_{\text{pair 분리}}
\end{aligned}`}
        operations={[
          { expression: String.raw`p/(1-p)`, annotation: ["해당 response와 그 밖의 outcome을", "상대 odds로 비교"] },
          { expression: String.raw`\log o_+-\log o_-`, annotation: ["Odds의 비를 차이로 바꿔", "chosen/rejected margin을 계산"] },
          { expression: String.raw`-\log\sigma(\Delta_{OR})`, annotation: ["Chosen odds가 낮은 pair에", "더 큰 preference 벌점을 부여"] },
          { expression: String.raw`\mathcal L_{SFT}+\lambda\mathcal L_{OR}`, annotation: ["Chosen imitation을 유지하면서", "pair separation을 같은 stage에 추가"] },
        ]}
        terms={[
          { symbol: "p_\\theta(y\\mid x)", name: "sequence likelihood", description: "Token log-probability를 sequence 단위로 모은 값이며 length 처리 방식을 명시해야 합니다." },
          { symbol: String.raw`\operatorname{odds}`, name: "generation odds", description: "해당 response 확률과 그 외 response 확률의 비입니다." },
          { symbol: String.raw`\mathcal L_{SFT}`, name: "chosen NLL", description: "Chosen response 자체를 모방하는 supervised objective입니다." },
          { symbol: String.raw`\lambda`, name: "preference weight", description: "Data fit과 chosen–rejected separation 사이의 scale을 정합니다." },
        ]}
        assumptions={["같은 prompt의 chosen·rejected pair가 필요하며 ORPO는 pair-free method가 아닙니다.", "극도로 작은 sequence probability에서 odds 계산은 log-space로 안정적으로 구현해야 합니다."]}
        interpretation="ORPO의 ‘한 단계’는 SFT와 preference optimization을 같은 training stage에서 수행한다는 뜻입니다. Data preparation, pair audit와 evaluation이 사라진다는 뜻은 아닙니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Reference forward를 제거하면 memory와 FLOP을 줄일 수 있지만 전체
          memory가 정확히 절반으로 줄어드는 것은 아니다. Optimizer state와
          activation은 trainable policy에 남고, packing·checkpointing·sharding에
          따라 실제 절감률이 달라진다. <a href="https://arxiv.org/abs/2403.07691" target="_blank" rel="noreferrer">ORPO 논문</a>의
          주된 실험 범위도 125M~7B와 특정 preference dataset이므로 더 큰 model에서
          같은 우위를 가정하기보다 동일한 base·data·evaluation으로 검증한다.
        </p>
      </div>

      <div
        id="paper-orpo"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · ORPO</p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          핵심 기여는 chosen imitation과 rejected separation을 한 stage에 둔 것이다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          SFT term이 chosen response의 token likelihood를 유지하고 odds-ratio term이
          rejected와의 상대 margin을 만듭니다. “Monolithic”은 data collection과
          evaluation이 하나가 된다는 뜻이 아니라, 별도의 SFT checkpoint와 후속
          reference-based preference stage를 요구하지 않는다는 뜻입니다.
        </p>
      </div>
    </section>
  );
}
