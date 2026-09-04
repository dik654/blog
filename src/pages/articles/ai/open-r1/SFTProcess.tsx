import ExplainedFormula from "@/components/ui/explained-formula";
import SFTBoundaryViz from "./viz/SFTBoundaryViz";

const decisions = [
  ["Checkpoint", "base · instruct · distilled 중 어느 policy에서 시작하는가"],
  ["Template", "role marker · reasoning block · assistant prefill은 무엇인가"],
  ["Termination", "chat template의 turn end와 trainer EOS가 일치하는가"],
  ["Sequence", "truncation · packing · loss mask가 trace 경계를 보존하는가"],
] as const;

export default function SFTProcess() {
  return (
    <section id="sft-process" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        SFT는 정답 규칙보다 teacher trace의 token distribution을 학습한다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Supervised fine-tuning은 problem과 검증된 solution trace를 한 sequence로 만들고 정답 token의 다음-token likelihood를
          높입니다. Distillation에서는 작은 model이 teacher의 답변 형식과 문제 풀이 패턴을 빠르게 습득합니다. Multi-stage recipe에서는 이후 RL이
          유효한 reward를 받을 cold-start policy를 만듭니다.
        </p>
        <p className="leading-8">
          그렇다고 SFT trace가 faithful한 내부 추론을 증명하지는 않습니다. Final answer가 맞다는 verifier 판정은 중간 설명의 모든 문장이 옳다는 보증이
          아닙니다. Student는 teacher가 자주 쓰는 표현·길이·형식 shortcut까지 함께 배울 수 있습니다.
        </p>
        <p className="leading-8">
          일반 SFT의 response-only loss·teacher forcing·packing 경계는
          <a href="/ai/supervised-fine-tuning"> SFT 정본 글</a>이 소유하고,
          teacher가 생성한 문자열을 student tokenizer로 다시 encode하는 일반
          원리는 <a href="/ai/knowledge-distillation">지식 증류 글</a>에서
          다룹니다. 이 절은 그 두 원리를 Open-R1 reasoning trace에 적용할 때
          chat template·EOS·길이 budget이 어떻게 재현 조건이 되는지에
          집중합니다.
        </p>
      </div>

      <SFTBoundaryViz />

      <ExplainedFormula
        question="Reasoning SFT는 한 completion의 어느 token에서 무엇을 최소화하는가?"
        idea={
          <>
            Teacher forcing으로 이전 정답 token을 context에 넣고 다음 정답
            token의 negative log-likelihood를 합합니다. Prompt를 condition으로만
            쓸 때는 prompt 위치의 loss mask를 0으로 둡니다.
          </>
        }
        formula={String.raw`\begin{aligned}
Z&=\sum_{t=1}^{T}m_t\\
\mathcal L_{\mathrm{SFT}}&=-\frac1Z\sum_{t=1}^{T}m_t\log p_\theta(y_t\mid x,y_{<t})
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
Z&=\underbrace{\sum_{t=1}^{T}m_t}_{\text{loss mask 계산}}\\
\mathcal L_{\mathrm{SFT}}&=\underbrace{-\frac1Z\sum_{t=1}^{T}m_t\log p_\theta(y_t\mid x,y_{<t})}_{\text{로그 비용 변환}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{t=1}^{T}m_t`, annotation: ["loss mask이(가) 식의 결과에 기여하는 방식을","계산합니다.","Teacher forcing으로 이전 정답 token을","context에 넣고 다음 정답 token의 negative"] },
          { expression: String.raw`-\frac1Z\sum_{t=1}^{T}m_t\log p_\theta(y_t\mid x,y_{<t})`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","Teacher forcing으로 이전 정답 token을","context에 넣고 다음 정답 token의 negative","log-likelihood를 합합니다."] },
        ]}
        terms={[
          {
            symbol: "x",
            name: "prompt",
            description:
              "Problem, system message와 user turn을 포함한 condition입니다.",
          },
          {
            symbol: "y_t",
            name: "target token",
            description:
              "Reasoning trace, final answer와 종료 token에 속한 t번째 정답 token입니다.",
          },
          {
            symbol: "m_t",
            name: "loss mask",
            description:
              "학습할 assistant token이면 1, prompt·padding처럼 제외할 위치면 0입니다.",
          },
          {
            symbol: "Z",
            name: "supervised token 수",
            description: "Mask가 1인 token 개수로 loss scale을 정규화합니다.",
          },
          {
            symbol: "p_\\theta",
            name: "student policy",
            description:
              "이전 정답 prefix가 주어졌을 때 다음 token에 둔 확률입니다.",
          },
        ]}
        assumptions={[
          "Completion-only loss를 예로 들었으며 실제 trainer의 masking·packing 설정을 확인해야 합니다.",
          "Teacher forcing loss가 낮아도 free-running generation에서 같은 trajectory가 보장되지는 않습니다.",
        ]}
        interpretation="SFT는 verifier의 정답 함수를 직접 학습하지 않고 선택된 teacher trace를 token 단위로 모사합니다. 따라서 dataset selection과 loss mask가 곧 behavior contract입니다."
      />

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        {decisions.map(([title, body]) => (
          <div key={title} className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-sm font-bold text-foreground">{title}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Cold start는 필수가 아니라 reward accessibility 선택이다</h3>
        <p className="leading-8">
          R1-Zero의 특징은 SFT 없이 base model에 RL을 적용한 데 있습니다. 다만 초기 policy가 parser가 읽을 만한 답이나 code를 거의 만들지 못하면
          reward는 대부분 0입니다.
        </p>
        <p className="leading-8">
          이때 작은 cold-start SFT는 “정답을 가르친다”기보다 verifier가 구분할 수 있는 output 영역으로 policy를 옮깁니다. 이미 verifiable
          output을 충분히 만드는 base model이라면 SFT 없이 RL의 변화를 관찰하기도 합니다.
        </p>

        <h3>YAML 숫자를 복사하기 전에 token budget을 다시 계산한다</h3>
        <p className="leading-8">
          Open-R1 recipe는 특정 checkpoint와 GPU topology의 실행 예시입니다. GPU 수를 바꾸면 per-device batch와 gradient
          accumulation을 조정해 global batch를 유지합니다.
        </p>
        <p className="leading-8">
          Max sequence length, packing과 truncation을 적용한 뒤 실제 supervised token 수도 기록합니다. Reasoning trace는 길이
          분포가 넓습니다. Sample 수가 같아도 update당 token budget은 크게 달라집니다.
        </p>
      </div>

      <div
        id="standard-open-r1-sft"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 구현 · Open-R1 SFT recipe
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          현재 공개 저장소는 distilled reasoning trace를 이용한 SFT 명령과
          recipe를 제공합니다. GPU 수가 달라지면 per-device batch나 gradient
          accumulation을 조정해 global batch를 유지하라고 안내합니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Tokenizer의 chat template와 EOS가 맞지 않으면 종료와 format 학습도 달라집니다. 예시 YAML 숫자보다 실제 serialization을 먼저 봅니다.
          여기서 확인되는 것은 현재 저장소의 동작이지, 모든 base model에 같은 learning rate와 epoch가 최적이라는 주장이 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/huggingface/open-r1#training-models"
          target="_blank"
          rel="noreferrer"
        >
          공식 SFT 명령과 template 주의사항 보기
        </a>
      </div>
    </section>
  );
}
