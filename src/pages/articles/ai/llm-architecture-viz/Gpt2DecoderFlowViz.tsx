import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  {
    label: '1. 텍스트를 token id로 바꾼다',
    body: 'GPT-2는 문장을 한 번에 “의미”로 읽지 않는다. BPE token id의 행렬을 만들고, 각 id를 embedding table에서 dense vector로 조회한다.',
  },
  {
    label: '2. absolute position을 더한다',
    body: 'Self-attention만 있으면 token 순서를 모른다. GPT-2는 token embedding에 학습된 position embedding을 더해 “몇 번째 token인지”를 벡터 안에 넣는다.',
  },
  {
    label: '3. causal mask가 미래 token을 가린다',
    body: '다음 token 예측 모델이므로 현재 위치는 왼쪽 context만 봐야 한다. 오른쪽 token score를 -inf로 막아 학습과 생성의 조건을 맞춘다.',
  },
  {
    label: '4. masked MHA가 왼쪽 문맥을 섞는다',
    body: '각 token은 Q로 질문하고, 이전 token들의 K/V에서 필요한 정보를 가져온다. 여러 head는 문법, 지시 대상, 문맥 같은 서로 다른 관계를 병렬로 본다.',
  },
  {
    label: '5. MLP가 token별 feature를 변환한다',
    body: 'Attention이 token 간 정보를 섞는다면 MLP는 각 위치 안에서 비선형 변환을 한다. GPT-2식 GELU MLP는 hidden dimension을 크게 확장했다가 다시 줄인다.',
  },
  {
    label: '6. 같은 block을 반복하고 logits로 다음 token을 고른다',
    body: 'Residual path는 원래 정보를 보존하고, LayerNorm은 깊은 stack 학습을 안정화한다. 마지막 hidden state를 vocabulary logits로 투영해 다음 token 분포를 만든다.',
  },
];

const tokens = ['The', 'robot', 'learned', 'to', 'write'];
const tokenColors = ['border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300', 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300', 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300', 'border-violet-500 bg-violet-500/10 text-violet-700 dark:text-violet-300'];

export default function Gpt2DecoderFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full max-w-4xl">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
            <div className="space-y-4">
              <TokenStrip active={step === 0} />
              {step >= 1 && <EmbeddingPanel active={step === 1} />}
              {step >= 2 && <MaskPanel active={step === 2} />}
            </div>
            <div className="space-y-4">
              <DecoderBlock activeAttn={step === 3} activeMlp={step === 4} activeOutput={step === 5} />
              {step >= 5 && <OutputPanel />}
            </div>
          </div>
        </div>
      )}
    </StepViz>
  );
}

function TokenStrip({ active }: { active: boolean }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold text-muted-foreground">input tokens</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {tokens.map((token, i) => (
          <motion.div
            key={token}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`min-h-10 rounded-md border px-2 py-2 text-center text-sm font-semibold ${tokenColors[i]} ${active ? 'ring-2 ring-primary/30' : ''}`}
          >
            {token}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmbeddingPanel({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-3 ${active ? 'border-emerald-500 bg-emerald-500/5' : 'border-border bg-card'}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">embedding lookup + position</span>
        <span className="text-xs text-muted-foreground">E_tok + E_pos</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-5">
        {tokens.map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="rounded border border-blue-500/60 bg-blue-500/10 px-2 py-1 text-center text-[11px] font-medium text-blue-700 dark:text-blue-300">token vec</div>
            <div className="rounded border border-emerald-500/60 bg-emerald-500/10 px-2 py-1 text-center text-[11px] font-medium text-emerald-700 dark:text-emerald-300">pos {i}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MaskPanel({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-3 ${active ? 'border-red-500 bg-red-500/5' : 'border-border bg-card'}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-red-700 dark:text-red-300">causal mask</span>
        <span className="text-xs text-muted-foreground">future = blocked</span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {tokens.flatMap((_, row) =>
          tokens.map((__, col) => {
            const blocked = col > row;
            return (
              <div
                key={`${row}-${col}`}
                className={`flex h-7 items-center justify-center rounded border text-xs font-semibold ${
                  blocked
                    ? 'border-red-500/70 bg-red-500/10 text-red-700 dark:text-red-300'
                    : 'border-violet-500/70 bg-violet-500/10 text-violet-700 dark:text-violet-300'
                }`}
              >
                {blocked ? '×' : '✓'}
              </div>
            );
          }),
        )}
      </div>
    </motion.div>
  );
}

function DecoderBlock({ activeAttn, activeMlp, activeOutput }: { activeAttn: boolean; activeMlp: boolean; activeOutput: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-lg border border-border bg-card p-4"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">GPT-2 decoder block</div>
          <div className="text-xs text-muted-foreground">same block repeated ×48</div>
        </div>
        <span className="rounded border border-teal-500/50 bg-teal-500/10 px-2 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">residual</span>
      </div>
      <div className="space-y-2">
        <BlockStage label="LayerNorm" tone="slate" active={false} />
        <BlockStage label="Masked Multi-Head Attention" tone="violet" active={activeAttn} />
        <BlockStage label="Add residual + LayerNorm" tone="teal" active={activeAttn || activeMlp} />
        <BlockStage label="GELU MLP" tone="amber" active={activeMlp} />
        <BlockStage label="Add residual" tone="teal" active={activeOutput} />
      </div>
    </motion.div>
  );
}

function BlockStage({ label, tone, active }: { label: string; tone: 'slate' | 'violet' | 'teal' | 'amber'; active: boolean }) {
  const tones = {
    slate: 'border-slate-400/70 bg-slate-500/10 text-slate-700 dark:text-slate-300',
    violet: 'border-violet-500/70 bg-violet-500/10 text-violet-700 dark:text-violet-300',
    teal: 'border-teal-500/70 bg-teal-500/10 text-teal-700 dark:text-teal-300',
    amber: 'border-amber-500/70 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  };
  return (
    <motion.div
      animate={{ scale: active ? 1.02 : 1 }}
      className={`rounded-md border px-3 py-2 text-sm font-semibold ${tones[tone]} ${active ? 'ring-2 ring-primary/25' : ''}`}
    >
      {label}
    </motion.div>
  );
}

function OutputPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-teal-500/50 bg-teal-500/5 p-3"
    >
      <div className="mb-3 text-sm font-semibold text-teal-700 dark:text-teal-300">vocabulary logits</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
        {[
          ['the', '0.08'],
          ['a', '0.11'],
          ['code', '0.42'],
          ['story', '0.18'],
        ].map(([token, prob]) => (
          <div key={token} className={`rounded border px-2 py-1.5 text-center text-xs ${token === 'code' ? 'border-teal-500 bg-teal-500/15 font-bold text-teal-700 dark:text-teal-300' : 'border-border bg-card text-muted-foreground'}`}>
            {token} · {prob}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
