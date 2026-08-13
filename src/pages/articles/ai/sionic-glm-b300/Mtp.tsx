import { GLM_B300_PROJECT_MEASUREMENTS as M } from "@/content/sionic-glm-b300";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Mtp() {
  const a = M.acceptanceRegression;
  return (
    <section id="mtp" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        MTP: forward를 없애지 않고 여러 token에 나눠 쓴다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          일반 decode는 main model forward마다 다음 token 하나를 확정한다. MTP
          기반 speculative decoding은 model-native draft path가 future token
          후보를 만들고, main model이 여러 위치를 한 번에 검증한다. 앞에서부터
          일치한 token을 받아들여 한 verification iteration에서 하나보다 많은
          token을 확정한다. GLM-5.2 공식 config에는 next-token-prediction
          layer가 1개이며, 별도 독립 draft model이 반드시 있다는 뜻은 아니다.
        </p>
        <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">일반 decode</p>
            <p className="mt-3 text-sm font-semibold">
              main weight stream 1회 → token 1개
            </p>
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <p className="text-xs text-muted-foreground">MTP verify</p>
            <p className="mt-3 text-sm font-semibold">
              main weight stream 1회 → accepted token 여러 개
            </p>
          </div>
        </div>
        <p className="leading-7">
          직관적으로 effective weight traffic/token은 “iteration의 main-model
          traffic ÷ acceptance length”로 줄지만, draft·verification·KV·sampling
          비용이 0이 아니므로 정확한 속도 향상은 acceptance length와 iteration
          latency를 함께 측정해야 한다. batch가 여러 request가 weight를
          공유한다면 MTP는 한 request의 future positions가 같은 효과를 일부
          만든다는 비유는 가능하지만, scheduling과 attention shape가 같으므로
          진짜 batch와 동일하다고 말할 수는 없다.
        </p>
        <ExplainedFormula
          question="Acceptance length가 늘면 왜 tok/s가 증가하며, 그 값만으로 speedup을 확정할 수 없는가?"
          idea={
            <p>
              한 verification cycle이 끝날 때 실제로 확정한 token 수를 그 cycle의
              전체 시간으로 나눕니다. 후보를 많이 내더라도 검증 시간이 크게
              늘거나 앞쪽에서 불일치하면 처리량은 기대만큼 오르지 않습니다.
            </p>
          }
          formula={String.raw`\mathrm{throughput}=\frac{\mathbb{E}[L_{\mathrm{commit}}]}{T_{\mathrm{draft}}+T_{\mathrm{verify}}+T_{\mathrm{sample}}}`}
          terms={[
            { symbol: "L_{\\mathrm{commit}}", name: "committed length", description: "한 cycle에서 앞에서부터 실제 sequence에 확정한 token 수입니다." },
            { symbol: "T_{\\mathrm{draft}}", name: "draft 시간", description: "Future-token candidate를 만드는 데 걸린 cycle당 시간입니다." },
            { symbol: "T_{\\mathrm{verify}}", name: "verify 시간", description: "Main model이 후보 위치를 검증하는 데 걸린 cycle당 시간입니다." },
            { symbol: "T_{\\mathrm{sample}}", name: "runtime 후처리 시간", description: "Acceptance·sampling·state commit에 걸린 cycle당 시간입니다." },
          ]}
          assumptions={[
            "같은 prompt/output 분포와 decoding quality 설정을 비교합니다.",
            "Warm-up 이후 cycle 전체 시간을 재며 CPU sync와 collective도 포함합니다.",
            "평균 acceptance뿐 아니라 분포와 짧은 output에서의 tail 효과도 확인합니다.",
          ]}
          interpretation="Acceptance가 2배여도 cycle 시간이 2배보다 더 늘면 tok/s는 떨어집니다. 반대로 main weight read를 여러 확정 token이 공유하고 추가 비용이 작을 때 처리량이 증가합니다."
        />
        <ExplainedFormula
          question="한 번의 main-model weight read를 여러 token이 공유한다는 말을 byte 관점에서 어떻게 표현하는가?"
          idea={
            <p>
              Cycle마다 main weight를 한 번 읽는다고 단순화하면, 그 traffic을
              확정 token 수로 나눈 값이 token당 부담입니다. 이는 직관을 위한
              근사이며 KV·activation·draft traffic은 따로 남습니다.
            </p>
          }
          formula={String.raw`Q_{\mathrm{weight/token}}\approx\frac{Q_{\mathrm{main/cycle}}}{\mathbb{E}[L_{\mathrm{commit}}]}`}
          terms={[
            { symbol: "Q_{\\mathrm{main/cycle}}", name: "cycle당 main traffic", description: "한 verification cycle의 main-model weight traffic이며 단위는 byte/cycle입니다." },
            { symbol: "Q_{\\mathrm{weight/token}}", name: "token당 main weight 항", description: "확정 token 하나에 배분한 main weight traffic이며 단위는 byte/token입니다." },
            { symbol: "\\mathbb{E}[L_{\\mathrm{commit}}]", name: "평균 committed length", description: "Cycle마다 확정한 token 수의 workload 평균입니다." },
          ]}
          assumptions={[
            "Main-model traffic이 cycle마다 비슷하다는 1차 근사입니다.",
            "Draft·KV cache·attention·sampling traffic은 분자에 포함하지 않습니다.",
            "Acceptance가 바뀌면 같은 설정으로 다시 계산합니다.",
          ]}
          interpretation="예를 들어 main traffic이 6.65GB/cycle이고 평균 3.5 token을 확정한다면 main weight 항은 약 1.9GB/token입니다. 전체 memory traffic이 그 값이라는 뜻은 아닙니다."
        />

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          수치 오차가 throughput을 뒤집는다
        </h3>
        <p className="leading-7">
          프로젝트에서는 activation quantization 경로 변경 뒤 acceptance
          length가 {a.before}에서 {a.after}로 떨어진 사례를 관측했다. kernel은
          빨라져도
          accepted token/iteration이 더 크게 줄면 end-to-end tok/s는 낮아진다.
          그래서 quantization 오차는 perplexity만이 아니라 logits agreement와
          acceptance distribution으로도 검증한다.
        </p>
        <div className="not-prose my-5 rounded-xl border-l-4 border-amber-400 bg-amber-500/5 p-4 text-sm">
          bytes/token을 줄이는 양자화 × weight stream당 token 수를 늘리는 MTP.
          두 효과는 곱해질 수 있지만, acceptance가 유지된다는 조건이 붙는다.
        </div>
      </div>
    </section>
  );
}
