import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { CapabilityCheck, Misconception, SourceNotes } from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { articlePath } from '@/lib/paths';
import { codeRefs } from './codeRefs';
import DataFlowViz from './viz/DataFlowViz';

const evaluationAxes = [
  ['Capability', 'AIME·MATH·GPQA·LiveCodeBench', '정답률이 실제 task 분포에서 올랐는지 본다.'],
  ['Contract', 'format pass · invalid parse', '정답이 아니라 interface가 깨져 실패한 비율을 분리한다.'],
  ['Exploration', 'reward variance · entropy · unique answer', '높은 점수가 한 경로 반복으로 얻어진 것은 아닌지 본다.'],
  ['Cost', 'generated token · latency · verifier call', '같은 점수를 얻는 데 사용한 test-time/rollout compute를 함께 본다.'],
  ['Reliability', 'timeout · sandbox error · retry', 'Infrastructure failure를 model 오답으로 덮지 않는다.'],
] as const;

const runtimeModes = [
  ['Colocate · 1 node', 'Trainer와 vLLM이 같은 node/GPU 자원을 공유한다.', '설정이 단순하고 작은 model 실험에 적합하지만 generation과 backward가 memory·compute를 다툰다.'],
  ['Server · N+1 nodes', '1개 node가 vLLM rollout server, N개 node가 training을 맡는다.', 'Resource ownership이 명확하고 scale-out하기 쉽지만 network queue, server liveness와 version skew를 운영해야 한다.'],
] as const;

export default function DataPipeline({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="data-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">데이터·평가·runtime이 닫혀야 한 번의 학습이 된다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          합성 data generation은 teacher에게 답을 많이 받아 저장하는 작업이 아니다. Prompt source, teacher checkpoint, sampling parameter,
          verifier version과 accept/reject 이유를 묶어야 나중에 어떤 행동을 SFT가 배웠는지 설명할 수 있다. Official <code>generate.py</code>는
          Distilabel pipeline이 OpenAI-compatible vLLM endpoint를 호출하고, 같은 prompt의 여러 generation을 한 행으로 묶는 실행 뼈대를 제공한다.
        </p>
      </div>
      <DataFlowViz />

      {onCodeRef && (
        <div className="not-prose my-6 flex flex-wrap items-center gap-3 border-y border-border py-4">
          <CodeViewButton onClick={() => onCodeRef('r1-generate-pipeline', codeRefs['r1-generate-pipeline'])} />
          <p className="text-xs leading-5 text-muted-foreground">vLLM endpoint → grouped generations → immutable output dataset 경계를 보여 주는 교육용 excerpt</p>
        </div>
      )}

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>생성 뒤에 세 개의 gate가 필요하다</h3>
        <p>
          첫째, deterministic verifier 또는 sandbox test로 정답을 확인한다. 둘째, pass rate를 계산해 너무 쉽거나 현재 policy가 전혀 풀지 못하는 prompt만
          몰리지 않게 한다. 셋째, benchmark prompt와 8-gram 수준으로 겹치는 학습 문제를 제거해 evaluation contamination을 낮춘다.
          Accepted trace와 rejected trace를 모두 source ID와 함께 남기면 verifier가 바뀌었을 때 전체를 다시 생성하지 않고 재판정할 수 있다.
        </p>
      </div>

      <div id="evaluation" className="scroll-mt-20 pt-8">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Held-out 평가는 reward 상승과 능력 상승을 분리한다</h3>
          <p>
            Official evaluation은 LightEval과 vLLM을 사용하고 AIME처럼 문항이 30개뿐인 benchmark는 prompt당 여러 response를 sample해 변동성을 줄인다.
            README의 재현 설정은 AIME 64, MATH-500 4, GPQA Diamond 8, LiveCodeBench 16 responses다. Response 수가 다르면 pass@1 추정의 분산과 비용도 달라져
            단일 score만 직접 비교하기 어렵다.
          </p>
          <p>
            Held-out set은 training prompt와 문자열만 다르면 되는 것이 아니다. 공개 reward 함수가 보지 못한 hidden test와 format perturbation,
            timeout·빈 출력·과도한 길이처럼 verifier shortcut이 드러나는 adversarial case를 함께 둔다. Training reward가 오르는데 이 묶음의 성공률이
            오르지 않으면 model 능력보다 checker 빈틈을 학습했을 수 있다. 이 판정 절차는
            <Link to={articlePath('ai', 'reasoning-post-training-frontier')}> reasoning frontier의 reward hacking·monitorability 계약</Link>으로
            이어진다.
          </p>
          <p>
            Verifier 오판과 model 오답도 분리한다. Reward 0 표본을 독립 oracle이나 사람이 다시 채점해 정답인데 거절된 경우를
            <strong> false negative</strong>, 오답인데 통과한 경우를 <strong>false positive</strong>로 기록한다. Sandbox timeout은 같은 출력과
            고정 image에서 재실행해 infrastructure failure로 분리한다. 이 세 bucket을 model failure 하나로 합치면 policy를 고쳐야 할지,
            checker·runtime을 고쳐야 할지 결정할 수 없다.
          </p>
          <M display>{String.raw`\widehat p_{\mathrm{success}}=\frac{1}{\underbrace{n}_{\text{고정한 평가 sample 수}}}\sum_{j=1}^{n}\underbrace{\mathbf{1}[\text{verifier}(o_j)=\text{성공}]}_{\text{j번째 response가 통과하면 1}}`}</M>
          <FormulaNote
            meaning="왜 여러 response의 성공을 평균내나: sampling model은 같은 prompt에도 다른 답을 내므로 한 번의 성공·실패만으로 policy의 성공 확률을 안정적으로 추정하기 어렵다. 특히 문제 수가 적으면 prompt당 sample 수와 random seed가 결과 변동에 큰 영향을 준다."
            symbols={[
              ['p̂_success', '현재 model과 generation setting에서 추정한 성공 확률'],
              ['n', '평가에 실제 사용한 response 수'],
              ['1[·]', 'verifier가 성공이면 1, 아니면 0인 indicator'],
              ['o_j', '고정한 sampling 설정에서 얻은 j번째 response'],
            ]}
          />
        </div>
        <div className="not-prose mt-5 border-l-2 border-blue-600/45 pl-4">
          <p className="text-sm font-bold">Checkpoint 비교는 같은 held-out manifest로 반복한다</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Baseline과 각 checkpoint에 같은 prompt ID, verifier version, response 수와 seed 묶음을 적용한다. Training reward, held-out capability,
            entropy·unique answer, generated token·latency, timeout·sandbox error를 한 행씩 나란히 기록해 어느 축이 먼저 악화되는지 본다.
          </p>
        </div>
        <div className="not-prose mt-6 border-y border-border">
          {evaluationAxes.map(([axis, signal, decision]) => (
            <div key={axis} className="grid gap-2 border-b border-border py-4 last:border-b-0 md:grid-cols-[7rem_17rem_minmax(0,1fr)] md:gap-4">
              <span className="text-xs font-black text-muted-foreground">{axis}</span>
              <code className="break-words text-xs font-bold [overflow-wrap:anywhere]">{signal}</code>
              <p className="text-sm leading-6 text-muted-foreground">{decision}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="runtime-boundary" className="scroll-mt-20 pt-12">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Open-R1의 runtime 경계는 serving 제품 아키텍처와 다르다</h3>
          <p>
            GRPO에서 vLLM은 사용자 traffic을 받는 production API라기보다 rollout을 빠르게 생성하는 training dependency다. Official README는 작은 single-node run에
            <code>vllm_mode=colocate</code>, multi-node run에는 전용 vLLM server를 둔 N+1 구성을 안내한다. “SGLang+vLLM+router가 곧 Open-R1 배포 구조”라고 일반화하지 않는다.
          </p>
        </div>
        <div className="not-prose mt-6 grid gap-px border border-border bg-border md:grid-cols-2">
          {runtimeModes.map(([title, ownership, tradeoff], index) => (
            <div key={title} className="min-w-0 bg-background p-5 sm:p-6">
              <p className="font-mono text-[10px] font-black uppercase text-blue-700 dark:text-blue-300">MODE {String(index + 1).padStart(2, '0')}</p>
              <p className="mt-3 text-base font-black">{title}</p>
              <p className="mt-3 text-sm font-bold leading-6">{ownership}</p>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">{tradeoff}</p>
            </div>
          ))}
        </div>
      </div>

      <Misconception>
        Training reward와 held-out benchmark가 함께 올라도 바로 ship할 수 있는 것은 아니다. Policy entropy가 급락하거나 token 비용이 폭증하거나 sandbox timeout이 늘면,
        model 능력 대신 좁은 답 패턴·길이·infrastructure 우연을 최적화했을 수 있다.
      </Misconception>

      <div className="not-prose my-8 border-y border-border">
        <a href="#grpo-process" className="group grid gap-2 border-b border-border py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:px-2">
          <span className="text-sm font-black">GRPO 계산으로 돌아가기</span>
          <span className="text-sm leading-6 text-muted-foreground">아래 검산 항목의 group reward, advantage와 rollout token 상한은 앞의 GRPO batch 장부에서 직접 계산한다.</span>
          <ArrowRight className="hidden h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1 sm:block" aria-hidden="true" />
        </a>
        <Link to={articlePath('ai', 'rl-ppo-continuous-control')} className="group grid gap-2 border-b border-border py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:px-2">
          <span className="text-sm font-black">PPO 수학으로 내려가기</span>
          <span className="text-sm leading-6 text-muted-foreground">Policy ratio, clipping, KL과 advantage의 update 의미가 막힐 때만 내려간다.</span>
          <ArrowRight className="hidden h-4 w-4 transition-transform group-hover:translate-x-1 sm:block" aria-hidden="true" />
        </Link>
        <Link to={articlePath('ai', 'llm-serving-ops')} className="group grid gap-2 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:px-2">
          <span className="text-sm font-black">Serving으로 올라가기</span>
          <span className="text-sm leading-6 text-muted-foreground">Checkpoint를 multi-tenant API로 운영하는 batching, KV cache, routing과 SLO는 별도 경로에서 다룬다.</span>
          <ArrowRight className="hidden h-4 w-4 transition-transform group-hover:translate-x-1 sm:block" aria-hidden="true" />
        </Link>
      </div>

      <CapabilityCheck items={[
        '한 dataset row가 conversation과 token sequence를 거쳐 SFT loss가 되는 과정을 설명한다.',
        'Reward [1,1,0,0]과 all-equal group의 평균·표준편차·advantage를 계산한다.',
        'P×G×C를 rollout token 상한으로 계산하고 optimizer batch와 구분한다.',
        'Chat template와 EOS mismatch가 format reward와 generation stop을 깨뜨리는 이유를 진단한다.',
        'Accuracy·format·length·code reward의 검증 범위와 실패 owner를 구분한다.',
        'Trainer host에서 code를 실행하지 않고 sandbox provider를 두어야 하는 이유를 설명한다.',
        'Reward·held-out capability·entropy·token cost·infrastructure error를 함께 보고 continue/stop을 결정한다.',
        '공개 verifier와 hidden·adversarial verifier의 간극으로 shortcut 최적화를 진단한다.',
      ]} />

      <SourceNotes sources={[
        { label: 'Hugging Face · open-r1 repository', href: 'https://github.com/huggingface/open-r1', note: 'Project scope, SFT/GRPO/data/evaluation scripts, runtime modes와 8×H100 recipe의 1차 출처. 본문 snapshot은 2026-04-02 commit 1416fa0.' },
        { label: 'Open-R1 · sft.py', href: 'https://github.com/huggingface/open-r1/blob/main/src/open_r1/sft.py', note: 'Config parsing, dataset/tokenizer/model loading, ChatML fallback, checkpoint resume, save/eval lifecycle.' },
        { label: 'Open-R1 · grpo.py', href: 'https://github.com/huggingface/open-r1/blob/main/src/open_r1/grpo.py', note: 'Prompt conversation construction, registry-selected reward functions와 GRPOTrainer lifecycle.' },
        { label: 'Open-R1 · rewards.py', href: 'https://github.com/huggingface/open-r1/blob/main/src/open_r1/rewards.py', note: 'Accuracy·format·regularization·code reward registry와 sandbox-backed execution 경로.' },
        { label: 'Open-R1 official project post', href: 'https://huggingface.co/blog/open-r1', note: 'DeepSeek-R1 공개 재현의 목표, 단계별 계획과 초기 pipeline 공개 기록.' },
        { label: 'DeepSeek-R1 technical report', href: 'https://arxiv.org/abs/2501.12948', note: 'R1-Zero pure RL, cold-start data와 multi-stage post-training을 구분하는 canonical source.' },
      ]} />
    </section>
  );
}
