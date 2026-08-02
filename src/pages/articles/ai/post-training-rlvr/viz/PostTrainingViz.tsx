import { useState } from 'react';
import { ArrowRight, BookOpenText, CheckCircle2, Code2, Database, GitCompareArrows, Search, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

type SignalKey = 'cpt' | 'sft' | 'preference' | 'rlvr';

const signals: Record<SignalKey, {
  short: string;
  title: string;
  question: string;
  row: string;
  target: string;
  producer: string;
  exploration: string;
  boundary: string;
  tone: string;
  soft: string;
}> = {
  cpt: {
    short: 'CPT',
    title: 'Continued pre-training',
    question: '새 domain의 언어·사실 분포가 가중치 안에 부족한가?',
    row: '{ domain_text: "환자에게 ..." }',
    target: '문장의 모든 다음 token',
    producer: 'label 없는 domain corpus',
    exploration: '없음 · 고정 text를 다시 읽음',
    boundary: '최신 출처와 인용이 중요하면 RAG를 먼저 고려한다.',
    tone: 'text-blue-700 dark:text-blue-300',
    soft: 'bg-blue-500/[0.06]',
  },
  sft: {
    short: 'SFT',
    title: 'Supervised fine-tuning',
    question: '원하는 답과 형식을 한 개의 정답 경로로 보여 줄 수 있는가?',
    row: '{ prompt, ideal_answer }',
    target: 'teacher가 쓴 completion token',
    producer: '사람·강한 model·검수 pipeline',
    exploration: '없음 · demonstration을 모방',
    boundary: '보여 주지 않은 전략을 스스로 탐색하는 신호는 아니다.',
    tone: 'text-teal-700 dark:text-teal-300',
    soft: 'bg-teal-500/[0.06]',
  },
  preference: {
    short: 'DPO / RLHF',
    title: 'Preference learning',
    question: '절대 정답은 없지만 두 답 중 더 나은 쪽은 고를 수 있는가?',
    row: '{ prompt, chosen, rejected }',
    target: 'chosen이 rejected보다 높은 상대 순위',
    producer: '평가자·constitution·judge model',
    exploration: 'DPO 학습 중에는 없음 · 고정 pair 사용',
    boundary: '선호를 표시한 평가 집단과 prompt 분포 밖으로 일반화되지 않을 수 있다.',
    tone: 'text-violet-700 dark:text-violet-300',
    soft: 'bg-violet-500/[0.06]',
  },
  rlvr: {
    short: 'RLVR',
    title: 'Online RL with verifier',
    question: '현재 policy의 새 시도를 program으로 자동 검증할 수 있는가?',
    row: '{ prompt } → rollout[] → reward[]',
    target: '실행 검증을 통과한 trajectory의 확률',
    producer: '현재 policy + verifier environment',
    exploration: '있음 · update마다 새 rollout 생성',
    boundary: '검증 가능한 부분에만 적용하고 code는 sandbox에서 실행한다.',
    tone: 'text-amber-700 dark:text-amber-300',
    soft: 'bg-amber-500/[0.07]',
  },
};

export function FeedbackContractViz() {
  const [selected, setSelected] = useState<SignalKey>('sft');
  const signal = signals[selected];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border bg-card" data-feedback-contract>
      <div className="border-b border-border bg-muted/20 px-4 py-5 sm:px-6">
        <p className="text-[10px] font-black uppercase text-muted-foreground">Feedback contract</p>
        <p className="mt-2 text-base font-black">방법 이름보다 먼저 데이터 한 행과 정답 단위를 고른다</p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {(Object.keys(signals) as SignalKey[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={selected === key}
            onClick={() => setSelected(key)}
            className={`relative min-h-14 bg-background px-3 py-3 text-left text-xs font-black transition-colors hover:bg-muted/35 ${selected === key ? signals[key].tone : 'text-muted-foreground'}`}
          >
            {signals[key].short}
            {selected === key && <motion.span layoutId="feedback-contract-tab" className="absolute inset-x-3 bottom-0 h-0.5 bg-current" />}
          </button>
        ))}
      </div>
      <div className={`grid min-h-[28rem] gap-7 p-4 transition-colors sm:p-6 lg:min-h-[22rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] ${signal.soft}`}>
        <div className="min-w-0">
          <p className={`text-xs font-black ${signal.tone}`}>{signal.title}</p>
          <p className="mt-3 text-xl font-black leading-snug">{signal.question}</p>
          <div className="mt-6 border-y border-border/80 py-5">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Dataset row</p>
            <code className="mt-3 block break-words text-sm font-bold [overflow-wrap:anywhere]">{signal.row}</code>
          </div>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">{signal.boundary}</p>
        </div>
        <div className="min-w-0 border-t border-border/80 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          {[
            ['직접 맞히는 것', signal.target],
            ['데이터를 만드는 주체', signal.producer],
            ['현재 policy의 새 탐색', signal.exploration],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 border-b border-border/70 py-4 first:pt-0 last:border-b-0">
              <span className="text-[10px] font-black text-muted-foreground">{label}</span>
              <strong className="text-sm leading-6">{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type ScenarioKey = 'medical' | 'json' | 'tone' | 'code';

const scenarios: Record<ScenarioKey, {
  label: string;
  icon: typeof Database;
  request: string;
  evidence: string;
  first: string;
  why: string;
  then: string;
  reject: string;
  accent: string;
}> = {
  medical: {
    label: '새 의료 지식',
    icon: BookOpenText,
    request: 'Base model이 모르는 한국어 의료 문서 20억 token을 활용해야 한다.',
    evidence: 'Label 없는 domain text와 문서별 출처·날짜',
    first: 'RAG 또는 CPT',
    why: '문제는 답의 말투가 아니라 지식의 부재다. 최신성·인용이 중요하면 RAG, 반복되는 domain 분포를 가중치에 적응시키려면 CPT를 검토한다.',
    then: '그 뒤 실제 상담 답 형식은 별도 SFT로 가르친다.',
    reject: 'DPO pair나 reward만 먼저 주면 model이 보지 못한 사실의 원문을 제공하지 못한다.',
    accent: 'text-blue-700 dark:text-blue-300',
  },
  json: {
    label: '정확한 JSON',
    icon: Code2,
    request: '20,000개의 prompt마다 정답 schema를 만족하는 ideal JSON이 있다.',
    evidence: 'prompt와 검수된 ideal_answer pair',
    first: 'SFT',
    why: '원하는 token sequence가 직접 존재하므로 completion likelihood를 높이는 것이 가장 짧은 경로다.',
    then: 'Schema validator를 만들 수 있다면 이후 제한된 RLVR로 실패 경계를 더 줄일 수 있다.',
    reject: 'Pairwise preference만 만들면 이미 가진 정확한 정답을 간접적인 순위로 약화한다.',
    accent: 'text-teal-700 dark:text-teal-300',
  },
  tone: {
    label: '도움되는 말투',
    icon: GitCompareArrows,
    request: '50,000개의 답 쌍에서 평가자가 더 도움되고 안전한 쪽을 골랐다.',
    evidence: 'prompt, chosen, rejected와 평가 지침',
    first: 'DPO 또는 RLHF',
    why: '하나의 절대 정답보다 같은 prompt 안의 상대 선호가 신뢰할 만한 신호다.',
    then: '고정 pair만 쓸지, reward model을 만들어 online PPO까지 갈지 비용과 distribution shift로 결정한다.',
    reject: '이 선호를 보편적 인간 가치라고 부르면 평가자 집단과 수집 분포의 범위를 숨긴다.',
    accent: 'text-violet-700 dark:text-violet-300',
  },
  code: {
    label: 'Hidden test 코드',
    icon: ShieldCheck,
    request: '10,000개 coding prompt에 hidden unit test가 있고 새 rollout을 생성할 예산이 있다.',
    evidence: 'prompt, sandbox, hidden tests와 current-policy rollout',
    first: 'RLVR',
    why: '현재 policy가 교사가 쓰지 않은 새 solution을 시도하고, 실행 결과를 객관적으로 다시 학습 신호로 쓸 수 있다.',
    then: '초기 형식과 tool protocol이 불안정하면 소량 SFT를 앞에 둘 수 있지만 보편적 필수 단계는 아니다.',
    reject: '공개 test나 host execution은 reward hacking과 보안 사고를 동시에 만든다.',
    accent: 'text-amber-700 dark:text-amber-300',
  },
};

export function SignalDecisionLab() {
  const [selected, setSelected] = useState<ScenarioKey>('medical');
  const scenario = scenarios[selected];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border bg-card" data-signal-decision>
      <div className="grid gap-4 border-b border-border bg-muted/20 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase text-muted-foreground">Decision lab</p>
          <p className="mt-2 text-base font-black">지금 가진 증거를 고르면 첫 학습 신호가 달라진다</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(scenarios) as ScenarioKey[]).map((key) => {
            const item = scenarios[key];
            const Icon = item.icon;
            return (
              <button key={key} type="button" aria-pressed={selected === key} onClick={() => setSelected(key)} className={`grid min-h-16 place-items-center gap-1 rounded-md border px-3 py-2 text-center text-[11px] font-black transition-colors ${selected === key ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-muted-foreground hover:bg-muted'}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid min-h-[34rem] gap-7 p-4 sm:min-h-[29rem] sm:p-6 lg:min-h-[24rem] lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase text-muted-foreground">요청</p>
          <p className="mt-2 text-lg font-black leading-snug">{scenario.request}</p>
          <div className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-y border-border py-5">
            <Search className="mt-0.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-black text-muted-foreground">사용 가능한 증거</p>
              <p className="mt-1 text-sm font-bold leading-6">{scenario.evidence}</p>
            </div>
          </div>
          <div className="mt-6 flex min-w-0 items-center gap-3">
            <span className="shrink-0 rounded-sm border border-border bg-muted/30 px-2 py-1 text-[10px] font-black">FIRST SIGNAL</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <strong className={`min-w-0 text-xl ${scenario.accent}`}>{scenario.first}</strong>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{scenario.why}</p>
        </div>
        <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 pb-6">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
            <div><p className="text-[10px] font-black text-muted-foreground">다음에 조합할 신호</p><p className="mt-1 text-sm font-bold leading-6">{scenario.then}</p></div>
          </div>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-border pt-6">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-rose-700 dark:text-rose-300" aria-hidden="true" />
            <div><p className="text-[10px] font-black text-muted-foreground">잘못 고르면 생기는 일</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{scenario.reject}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const composition = [
  { number: '01', title: 'RAG / CPT', body: '의료 지식의 출처와 domain language를 공급한다.', tone: 'text-blue-700 dark:text-blue-300' },
  { number: '02', title: 'SFT', body: '상담 JSON schema와 tool-call 형식을 직접 보여 준다.', tone: 'text-teal-700 dark:text-teal-300' },
  { number: '03', title: 'Preference', body: '같은 내용 중 더 도움되고 안전한 표현을 고른다.', tone: 'text-violet-700 dark:text-violet-300' },
  { number: '04', title: 'Selective RLVR', body: '계산·schema·실행처럼 검증 가능한 field만 online reward로 다듬는다.', tone: 'text-amber-700 dark:text-amber-300' },
] as const;

export function SignalCompositionViz() {
  return (
    <div className="not-prose my-8 border-y border-border" data-signal-composition>
      <div className="grid gap-px bg-border lg:grid-cols-4">
        {composition.map((step, index) => (
          <div key={step.number} className="relative min-w-0 bg-background px-4 py-5 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-2xl font-black text-muted-foreground/50">{step.number}</span>
              {index < composition.length - 1 && <ArrowRight className="hidden h-4 w-4 text-muted-foreground lg:block" aria-hidden="true" />}
            </div>
            <p className={`mt-5 text-sm font-black ${step.tone}`}>{step.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
