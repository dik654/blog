import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { Misconception } from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { codeRefs } from './codeRefs';
import SFTFlowViz from './viz/SFTFlowViz';

const recipe = [
  ['Model', 'Qwen2.5-Math-7B-RoPE-300k', '출발 policy의 vocabulary·tokenizer·context 능력을 고정한다.'],
  ['Dataset', 'Mixture-of-Thoughts · all', '검증된 수학·코드·과학 reasoning trace를 completion target으로 쓴다.'],
  ['Sequence', 'max_length 32,768', '긴 trace를 보존하지만 padding·activation memory와 step 시간을 크게 만든다.'],
  ['Local batch', '2 × accumulation 8', '한 device의 microbatch와 update 전 누적 횟수다. 전체 global batch는 world size까지 곱해야 한다.'],
  ['Runtime', 'bf16 · ZeRO-3 · Liger', '정밀도, parameter state 분산, kernel memory 경로를 함께 고정한다.'],
  ['Schedule', '5 epochs · LR 4e-5', '이 dataset/model snapshot의 재현값이다. 새 data와 topology의 기본값이 아니다.'],
] as const;

export default function SFTProcess({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="sft-process" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">SFT는 문장을 외우는 단계가 아니라 token 계약을 맞추는 단계다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Dataset의 한 행은 바로 loss가 되지 않는다. System·user·assistant message를 chat template로 직렬화하고 tokenizer로 쪼갠 뒤,
          어느 token을 정답 label로 볼지 mask를 만든다. SFT는 정답 completion token의 조건부 확률을 올린다. 따라서
          “reasoning을 배웠다”는 말은 내부 알고리즘을 복사했다는 뜻이 아니라 <strong>그 data 분포의 다음 token 행동을 더 자주 재현한다</strong>는 뜻이다.
        </p>
        <M display>{String.raw`\begin{aligned}
\underbrace{q_t}_{\text{정답 log 확률}}
&=\log p_\theta(y_t\mid y_{<t})\\
\underbrace{N}_{\text{학습 token 수}}
&=\sum_{t=1}^{T}\underbrace{m_t}_{\text{completion mask}}\\
\mathcal L_{\mathrm{SFT}}
&=-\frac{1}{N}\sum_{t=1}^{T}m_tq_t
\end{aligned}`}</M>
        <FormulaNote
          meaning="왜 mask를 곱하나: prompt는 model이 조건으로 읽어야 하지만 일반적인 assistant-only SFT에서는 user 문장 자체를 따라 쓰도록 보상하지 않는다. Completion token의 log 확률만 모아 loss를 줄이면 같은 문맥에서 teacher trace가 나올 가능성이 커진다."
          symbols={[
            ['L_SFT', '한 batch에서 최소화하는 supervised next-token loss'],
            ['T', '직렬화된 전체 sequence 길이'],
            ['m_t', '현재 위치가 학습할 completion이면 1, 문맥이면 0인 mask'],
            ['q_t', '정답 token에 부여한 log probability'],
            ['p_θ', '현재 policy가 정답 token y_t에 부여한 조건부 확률'],
            ['N', 'mask가 1인 token 수. 길이가 다른 sample의 scale을 맞춘다.'],
          ]}
        />
      </div>

      <SFTFlowViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Chat template와 EOS는 왜 하나의 계약인가?</h3>
        <p>
          Official <code>sft.py</code>는 tokenizer에 chat template이 없으면 ChatML을 설정한다. 저장 직전에는 model generation config의
          EOS ID를 tokenizer EOS와 맞춘다. Template가 assistant 답 끝에 <code>&lt;|im_end|&gt;</code>를 붙였는데 runtime은 다른 EOS를 기다리면,
          학습 loss가 낮아도 답이 끝나지 않거나 다음 role까지 생성할 수 있다. 반대로 잘못된 EOS를 너무 일찍 만나면 reasoning이 잘린다.
        </p>
        <p>
          Distilled DeepSeek model로 GRPO를 할 때는 더 미묘하다. 기본 template가 assistant prefix에 <code>&lt;think&gt;</code>를 미리 넣고
          반환 completion에서 reasoning block을 감추면, model이 올바른 답을 내도 “completion 전체가 <code>&lt;think&gt;…</code>로 시작한다”는
          format verifier는 실패한다. 이것은 model capacity 문제가 아니라 serialization interface mismatch다.
        </p>
        <p>
          <code>max_length</code>에서 긴 trace가 잘리면 정답이나 EOS가 사라질 수 있으므로, truncation 비율과 잘린 위치를 먼저 기록한다.
          여러 example을 한 sequence에 이어 붙이는 sequence packing을 쓸 때도 attention·position·loss mask가 example 경계를 지켜야 한다.
          경계를 넘은 token까지 completion loss에 들어가면 다른 예제의 prompt를 답으로 학습하는 조용한 누수가 생긴다.
        </p>
      </div>

      {onCodeRef && (
        <div className="not-prose my-6 flex flex-wrap items-center gap-3 border-y border-border py-4">
          <CodeViewButton onClick={() => onCodeRef('r1-sft-main', codeRefs['r1-sft-main'])} />
          <p className="text-xs leading-5 text-muted-foreground">Config parsing → checkpoint resume → dataset/tokenizer/model → trainer → save/eval의 공식 순서를 보존한 교육용 excerpt</p>
        </div>
      )}

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>공식 recipe 숫자를 실행 비용으로 읽는다</h3>
        <p>
          아래 값은 8×H100 80GB 환경을 전제로 공개된 OpenR1-Distill-7B recipe다. GPU 수가 달라지면 per-device batch 또는 gradient accumulation을
          조정해 global batch를 유지하라는 것이 공식 안내다. 숫자만 복사하면 같은 optimization trajectory가 되지 않는다.
        </p>
      </div>
      <div className="not-prose mt-6 border-y border-border">
        {recipe.map(([label, value, consequence]) => (
          <div key={label} className="grid gap-2 border-b border-border py-4 last:border-b-0 sm:grid-cols-[7rem_14rem_minmax(0,1fr)] sm:gap-4">
            <span className="text-xs font-black text-muted-foreground">{label}</span>
            <code className="break-words text-xs font-bold [overflow-wrap:anywhere]">{value}</code>
            <p className="text-sm leading-6 text-muted-foreground">{consequence}</p>
          </div>
        ))}
      </div>

      <Misconception>
        SFT를 먼저 해야 GRPO가 가능하다는 법칙은 없다. Pure RL은 base model에서 시작할 수 있다. SFT는 초기 성공률과 출력 계약을 안정시키는 선택지이며,
        teacher trace를 너무 좁게 모방하면 오히려 exploration 다양성을 줄일 수도 있다.
      </Misconception>
    </section>
  );
}
