import ExplainedFormula from "@/components/ui/explained-formula";
import ReproducibilityViz from "./viz/ReproducibilityViz";

export default function Reproducibility() {
  return (
    <section id="reproducibility" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">재현성은 seed 하나가 아니라, 어떤 수준의 같음을 요구하는지 정하고 깨끗한 환경에서 검사하는 계약입니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          같은 seed라도 library release, GPU architecture, nondeterministic kernel, distributed reduction order와 data-loader concurrency가
          달라지면 bit가 같지 않을 수 있습니다. 반대로 bit가 달라도 prediction과 metric이 허용 범위 안에서 같으면 운영 목적의 재현으로
          충분할 수 있습니다. 따라서 bitwise·numerical·statistical·behavioral 중 필요한 수준을 먼저 선언합니다.
        </p>
      </div>

      <ExplainedFormula
        question="두 reproduction 결과가 ‘같다’는 말을 어떤 수준별 검사로 바꿀 수 있을까요?"
        idea={<>가장 강한 bitwise equality부터 tensor 허용 오차, 여러 seed의 통계량과 최종 behavior guardrail까지 단계별로 정의합니다.</>}
        formula={String.raw`H(A')=H(A),\qquad |x_i'-x_i|\le \varepsilon_{\mathrm{abs}}+\varepsilon_{\mathrm{rel}}|x_i|,\qquad |\bar m'-\bar m|\le \delta_m`}
        terms={[
          { symbol: "A, A'", name: "reference · reproduced artifacts", description: "원 실행과 깨끗한 환경의 재실행이 만든 checkpoint·prediction·report입니다." },
          { symbol: "epsilon_abs, epsilon_rel", name: "numeric tolerances", description: "0 근처 절대 차이와 값 크기에 비례한 상대 차이를 허용하는 기준입니다." },
          { symbol: "m bar", name: "repeated-run statistic", description: "고정 seed set 또는 사전 정의 repetition에서 얻은 metric 평균·분산·quantile입니다." },
          { symbol: "delta_m", name: "metric acceptance bound", description: "운영 또는 연구 claim을 유지한다고 볼 최대 허용 metric 차이입니다." },
        ]}
        assumptions={[
          "비교 artifact·row order·dtype·metric reducer와 seed set이 같습니다.",
          "Tolerance는 reference 결과를 본 뒤 편의상 넓히지 않고 수치 precision과 업무 영향에서 정합니다.",
          "Statistical equality는 평균 하나가 아니라 dispersion·failure rate·critical slice를 함께 봅니다.",
        ]}
        interpretation="Audit용 CPU pipeline은 bitwise를 요구할 수 있고, 대규모 GPU training은 prediction/metric tolerance와 seed distribution을 요구할 수 있습니다. 요구 수준이 다르면 실패의 의미도 다릅니다."
      />

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Randomness를 통제할 때는 global seed 하나를 모든 worker가 그대로 공유하지 않습니다. Root seed에서 run·rank·worker·epoch별 child
          seed를 결정적으로 파생하면 병렬 worker가 같은 augmentation stream을 복제하는 일을 막고 어느 stream이 어떤 sample을 만들었는지
          추적할 수 있습니다. Resume에는 RNG state와 sampler cursor도 포함해야 연속 실행과 같은 다음 batch를 만듭니다.
        </p>
      </div>

      <ExplainedFormula
        question="분산 worker마다 독립적이면서 다시 만들 수 있는 random stream을 어떻게 지정할까요?"
        idea={<>Root seed와 stable coordinates를 hash해 child seed를 만듭니다. Process 시작 순서나 우연한 PID를 seed source로 사용하지 않습니다.</>}
        formula={String.raw`s_{r,w,e}=H(s_0,\operatorname{runID},r,w,e)\bmod 2^{32}`}
        terms={[
          { symbol: "s0", name: "root seed", description: "Experiment spec에 기록한 최상위 random seed입니다." },
          { symbol: "r,w,e", name: "rank · worker · epoch", description: "분산 rank, data-loader worker와 epoch를 구분하는 stable coordinates입니다." },
          { symbol: "H", name: "deterministic mixing", description: "입력 tuple을 충분히 섞어 child stream 충돌을 줄이는 결정적 함수입니다." },
          { symbol: "2^32", name: "generator seed range", description: "사용 중인 RNG API가 받는 정수 범위에 맞춘 예시 modulus입니다." },
        ]}
        assumptions={[
          "실제 RNG library·algorithm·version과 generator state serialization을 함께 기록합니다.",
          "Worker 수가 바뀌면 sample-to-stream mapping도 달라질 수 있으므로 같은 execution contract로 보지 않습니다.",
          "Seed 고정은 nondeterministic GPU operator나 race condition을 deterministic하게 만들지 않습니다.",
        ]}
        interpretation="모든 worker에 seed 42를 주면 같은 transform sequence를 반복할 수 있습니다. Rank와 worker 좌표를 섞으면 stream은 나뉘고 같은 topology에서는 다시 계산할 수 있습니다."
      />

      <div className="not-prose my-8"><ReproducibilityViz /></div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Reproduction test는 기존 개발 machine이 아니라 빈 environment에서 data·image·command를 받아 실행합니다. 먼저 input digest와
          resolved config가 같은지 확인하고, exit·required artifacts·schema·checksum 또는 numeric diff·metric/slice tolerance를 순서대로
          검사합니다. 실패하면 “seed가 달라서”라고 끝내지 않고 최초 divergence step, operator, environment diff와 data order를 기록합니다.
        </p>
      </div>

      <div id="paper-ml-reproducibility" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 연구 · Improving Reproducibility in Machine Learning Research</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Pineau 등은 NeurIPS 2019 reproducibility program의 code submission policy, community challenge와 checklist 도입 과정 및 관찰을
          보고했습니다. 핵심은 결과만 공개하는 대신 model·theory·dataset·code·experimental detail을 체계적으로 드러내는 것입니다.
          한 conference program의 관찰을 모든 조직의 재현 성공률이나 특정 tracker의 효과로 확대하지 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.jmlr.org/papers/v22/20-303.html" target="_blank" rel="noreferrer">JMLR 논문 보기</a>
      </div>

      <div id="standard-pytorch-reproducibility" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 · PyTorch Reproducibility</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          PyTorch 공식 문서는 release·platform·CPU/GPU 사이에서 완전한 재현이 보장되지 않을 수 있음을 먼저 밝히고 random source 통제와
          deterministic algorithm 선택, 성능 trade-off를 설명합니다. 설치한 version·operator·hardware에서 fixture를 확인해야 하며
          <code>deterministic=True</code> 하나가 data·environment·artifact lineage까지 보장하는 것은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/docs/stable/notes/randomness.html" target="_blank" rel="noreferrer">공식 문서 보기</a>
      </div>
    </section>
  );
}
