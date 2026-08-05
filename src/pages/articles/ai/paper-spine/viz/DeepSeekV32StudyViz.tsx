import { useState } from 'react';
import { ArrowDown, ArrowRight, Braces, Database, Gauge, Search, ShieldCheck, Wrench } from 'lucide-react';
import { SegmentedControl } from '../../nlp-shared';

const views = {
  sparse: {
    label: 'Sparse Attention',
    question: '128K 문맥에서 모든 과거 token을 매번 정밀 비교해야 할까?',
    stages: [
      { icon: Database, title: '과거 KV', value: 'L개', note: 'MLA latent entry', detail: '현재 query 앞의 모든 latent KV 위치가 후보 집합이다.', handoff: '후보 latent와 현재 query를 작은 indexer에 넘긴다.' },
      { icon: Search, title: '가벼운 indexer', value: 'L개 점수', note: 'FP8·적은 head', detail: '저차원 query-key 내적과 ReLU로 모든 후보의 중요도를 싸게 근사한다.', handoff: '최종 attention 확률이 아니라 후보 순위 I(t,:)를 넘긴다.' },
      { icon: Gauge, title: 'Top-k 선택', value: 'k=2,048', note: 'k ≪ L', detail: '교육적 해설: discrete gate가 importance 상위 k개 위치와 latent entry만 gather한다고 읽는다.', handoff: '선택된 위치 집합 S_t와 latent KV를 core attention에 넘긴다.' },
      { icon: Braces, title: '정밀 attention', value: '선택 KV만', note: 'O(Lk) core', detail: '원래 MLA의 정밀 score와 value aggregation을 선택된 후보에만 수행한다.', handoff: 'Attention output을 residual stream에 돌려준다.' },
    ],
    metrics: [['후보 문맥 L', '131,072'], ['선택 k', '2,048'], ['Core 정밀 비교', '1 / 64']],
    invariant: 'Indexer는 “답”을 만들지 않는다. 비싼 core attention이 읽을 후보를 고른다.',
    failure: 'Indexer가 중요한 token을 놓치면 뒤의 attention은 그 정보를 복구할 수 없다.',
  },
  rl: {
    label: 'Stable RL',
    question: 'rollout을 여러 mini-batch에서 재사용할 때 policy mismatch를 어떻게 제한할까?',
    stages: [
      { icon: Database, title: 'Sampling policy', value: 'πold', note: 'rollout·route·mask 기록', detail: '응답 token뿐 아니라 log-probability, MoE route와 top-p support를 rollout state로 저장한다.', handoff: 'Sampling 당시 조건을 mismatch 검사와 replay에 넘긴다.' },
      { icon: ShieldCheck, title: 'Sequence gate', value: 'KL > δ?', note: '해로운 negative만 mask', detail: 'Current policy가 old policy에서 지나치게 멀어진 negative sequence의 gradient만 제한한다.', handoff: '학습 가능한 sequence와 제외할 token mask를 만든다.' },
      { icon: Braces, title: 'Keep routing', value: '같은 expert', note: 'active subspace 고정', detail: 'Sampling 때 선택한 expert route와 top-p mask를 training forward에서도 재사용한다.', handoff: '같은 conditional action path 위의 current log-probability를 계산한다.' },
      { icon: Gauge, title: 'Policy update', value: 'GRPO', note: 'clip·KL·reward', detail: 'Group-relative advantage와 importance ratio로 bounded policy update를 만든다.', handoff: '업데이트 뒤 새 policy가 다음 rollout의 πold가 된다.' },
    ],
    metrics: [['Replay state', 'log p · route · mask'], ['Mismatch gate', 'negative sequence'], ['Update', 'GRPO']],
    invariant: '같은 token이라도 sampling과 training에서 expert·action space가 달라지면 importance ratio의 전제가 깨진다.',
    failure: 'mask가 너무 강하면 실패 사례에서 배우는 신호까지 버리고 exploration이 줄어든다.',
  },
  agent: {
    label: 'Agent Synthesis',
    question: '실제 사용자 로그 없이도 어렵지만 자동 검증 가능한 tool task를 만들 수 있을까?',
    stages: [
      { icon: Wrench, title: '환경·도구', value: '1,827 env', note: 'real 또는 synthetic', detail: 'Database state와 model이 호출할 수 있는 제한된 tool interface를 분리해 만든다.', handoff: 'Environment schema와 허용 tool 목록을 task generator에 넘긴다.' },
      { icon: Braces, title: '문제·solution', value: '4,417 tasks', note: 'tool로만 해결', detail: 'Gold solution은 tool을 사용해야만 목표 state에 도달하도록 구성한다.', handoff: 'Task, hidden solution과 expected state를 verifier에 넘긴다.' },
      { icon: ShieldCheck, title: 'Verifier', value: '자동 판정', note: 'hard to solve, easy to check', detail: '최종 답 모양이 아니라 environment state와 constraint를 검사해 outcome reward를 만든다.', handoff: 'Pass/fail과 실패 원인을 rollout record에 붙인다.' },
      { icon: Gauge, title: 'Agent RL', value: 'outcome reward', note: 'unseen env 일반화', detail: '검증된 성공 신호로 thinking 중 tool call과 multi-step action을 강화한다.', handoff: '학습에 쓰지 않은 environment에서 전이를 다시 평가한다.' },
    ],
    metrics: [['Environment', '1,827'], ['Task', '4,417'], ['평균 task / env', '2.42']],
    invariant: 'Solution이 database를 직접 읽지 못하게 하고 공개된 tool interface로만 풀게 해야 task가 agent 능력을 측정한다.',
    failure: '합성기와 verifier가 같은 shortcut을 공유하면 높은 reward가 실제 tool-use 일반화를 뜻하지 않는다.',
  },
  context: {
    label: 'Context Runtime',
    question: '128K를 넘는 agent trajectory는 무엇을 보존하고 무엇을 버려야 할까?',
    stages: [
      { icon: Database, title: 'Trajectory', value: '80% 도달', note: 'reason·call·result 누적', detail: 'Reasoning, tool call과 result가 쌓여 context budget의 임계점에 도달한다.', handoff: '현재 trajectory와 반드시 보존할 state를 관리 전략에 넘긴다.' },
      { icon: Search, title: '관리 전략', value: 'summary/discard', note: 'serial compute 확장', detail: '오래된 reasoning을 요약하거나 버리되 tool interaction state는 별도 취급한다.', handoff: '축약한 prompt와 보존한 tool history를 validation에 넘긴다.' },
      { icon: ShieldCheck, title: '보존 계약', value: 'tool history', note: '새 user message 경계', detail: '새 user message 경계에서 과거 thinking은 제거해도 call/result와 제약이 남는지 확인한다.', handoff: '다음 action에 필요한 최소 runtime state를 다시 prompt에 넣는다.' },
      { icon: Gauge, title: '다시 실행', value: '추가 step', note: '비용과 정확도 측정', detail: '확보한 context budget으로 serial search step을 늘리고 outcome을 다시 측정한다.', handoff: 'Score뿐 아니라 token, wall time, tool cost와 state-loss failure를 기록한다.' },
    ],
    metrics: [['평균 step', '140 → 364'], ['BrowseComp', '53.4 → 60.2'], ['Score 변화', '+6.8 point']],
    invariant: 'Context를 줄일 때 답에 필요한 state와 tool result를 잃지 않는지가 단순 token 절감보다 먼저다.',
    failure: '보고서의 BrowseComp 향상은 특정 검색 agent 설정의 결과이며 모든 agent에서 discard-all이 최선이라는 뜻이 아니다.',
  },
} as const;

type View = keyof typeof views;

export default function DeepSeekV32StudyViz() {
  const [view, setView] = useState<View>('sparse');
  const [selectedStage, setSelectedStage] = useState(0);
  const active = views[view];
  const selected = active.stages[selectedStage];

  const handleViewChange = (value: View) => {
    setView(value);
    setSelectedStage(0);
  };

  return (
    <figure data-deepseek-study-viz className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="font-mono text-[10px] font-black text-blue-700 dark:text-blue-300">MECHANISM INSPECTOR</p>
        <h3 className="mt-1 text-sm font-bold">V3.2의 네 기여를 하나의 주장으로 섞지 않고 따로 검산하기</h3>
      </figcaption>
      <div className="p-4 sm:p-6">
        <SegmentedControl
          label="검산할 메커니즘"
          value={view}
          onChange={(value) => handleViewChange(value as View)}
          options={Object.entries(views).map(([value, item]) => ({ value, label: item.label }))}
        />
        <p className="mt-5 max-w-3xl text-sm font-semibold leading-relaxed">{active.question}</p>

        <ol className="mt-5 grid gap-2 lg:grid-cols-4 lg:gap-8">
          {active.stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <li key={stage.title} className="relative min-w-0">
                <button
                  type="button"
                  data-study-stage
                  aria-label={`${active.label} 단계 ${index + 1}: ${stage.title}`}
                  aria-pressed={selectedStage === index}
                  onClick={() => setSelectedStage(index)}
                  className={`h-full min-h-[6.75rem] w-full min-w-0 rounded-md border p-3.5 text-left transition-[border-color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[7.5rem] lg:min-h-[8.5rem] ${selectedStage === index ? 'border-blue-600/45 bg-blue-500/[0.045] shadow-[inset_3px_0_0_rgb(37_99_235)] dark:border-blue-400/45 dark:shadow-[inset_3px_0_0_rgb(96_165_250)]' : 'border-border bg-muted/[0.08] hover:border-foreground/25 hover:bg-muted/20'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Icon className={`h-4 w-4 ${selectedStage === index ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`} aria-hidden="true" />
                    <span className="font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="mt-3 text-xs font-bold">{stage.title}</p>
                  <p className="mt-1 font-mono text-sm font-black">{stage.value}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{stage.note}</p>
                </button>
                {index < active.stages.length - 1 && (
                  <>
                    <ArrowDown className="mx-auto mt-2 h-4 w-4 text-muted-foreground lg:hidden" aria-hidden="true" />
                    <ArrowRight className="absolute -right-6 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground lg:block" aria-hidden="true" />
                  </>
                )}
              </li>
            );
          })}
        </ol>

        <div data-study-stage-detail aria-live="polite" className="mt-3 border-l-2 border-blue-600/50 bg-muted/[0.08] px-4 py-3.5 dark:border-blue-400/50">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="font-mono text-[10px] font-black text-blue-700 dark:text-blue-300">선택한 단계 · {String(selectedStage + 1).padStart(2, '0')}</p>
            <p className="text-xs font-bold">{selected.title}</p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-foreground/90">{selected.detail}</p>
          <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2 border-t border-border/70 pt-3">
            <ArrowRight className="mt-0.5 h-3.5 w-3.5 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed text-muted-foreground"><strong className="text-foreground">다음 handoff</strong> · {selected.handoff}</p>
          </div>
        </div>

        <dl data-study-metrics className="mt-5 grid grid-cols-3 overflow-hidden rounded-md border border-border bg-border">
          {active.metrics.map(([label, value]) => (
            <div key={label} className="min-w-0 bg-background px-2.5 py-3 sm:px-4">
              <dt className="break-words text-[10px] font-semibold leading-snug text-muted-foreground">{label}</dt>
              <dd className="mt-1 break-words font-mono text-xs font-black leading-snug sm:text-sm">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-emerald-500/25 bg-emerald-500/[0.035] p-3.5">
            <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-300">반드시 유지할 계약</p>
            <p className="mt-2 text-xs leading-relaxed">{active.invariant}</p>
          </div>
          <div className="rounded-md border border-amber-500/25 bg-amber-500/[0.035] p-3.5">
            <p className="text-[10px] font-black text-amber-700 dark:text-amber-300">이 지점에서 생기는 실패</p>
            <p className="mt-2 text-xs leading-relaxed">{active.failure}</p>
          </div>
        </div>
      </div>
    </figure>
  );
}
