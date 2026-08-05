import { useState } from 'react';
import {
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  CircleX,
  FileCode2,
  FlaskConical,
} from 'lucide-react';

const metricScenarios = [
  {
    id: 'tie',
    tab: '같은 정답 두 개',
    title: '떠 있는 캡션은 앞·뒤 어느 쪽도 맞을 수 있다',
    rule: '본문 A 다음에 본문 B가 끊기지 않고 이어져야 한다.',
    reference: ['캡션', '본문 A', '본문 B'],
    candidate: ['본문 A', '본문 B', '캡션'],
    distance: '문자 위치가 크게 달라 불리할 수 있음',
    verifier: 'PASS',
    reason: '캡션 위치보다 본문 A → B의 자연스러운 순서를 검사하므로 동률 정답을 허용한다.',
  },
  {
    id: 'interrupt',
    tab: '가까워도 오답',
    title: '캡션이 본문 사이에 끼면 읽는 흐름이 끊긴다',
    rule: '본문 A 다음에 본문 B가 끊기지 않고 이어져야 한다.',
    reference: ['캡션', '본문 A', '본문 B'],
    candidate: ['본문 A', '캡션', '본문 B'],
    distance: '일부 문자가 가까워 부분 점수를 받을 수 있음',
    verifier: 'FAIL',
    reason: '문자 상당수가 맞아도 캡션이 의존 관계를 끊었으므로 reading-order 검사는 실패한다.',
  },
  {
    id: 'math',
    tab: '수식 렌더링',
    title: 'LaTeX 문자열보다 화면에 그려진 수학 구조가 중요하다',
    rule: '기호와 위·아래 첨자의 상대 위치가 기준 수식과 같아야 한다.',
    reference: ['기준 LaTeX', 'KaTeX 렌더링', '수학 구조'],
    candidate: ['다른 LaTeX 표기', '같은 렌더링', '같은 수학 구조'],
    distance: '문자열은 더 멀어도 정답일 수 있음',
    verifier: 'PASS',
    reason: '논문의 검사는 KaTeX DOM 요소의 상대 위치를 비교해 문자열 표기가 달라도 같은 수식을 인정한다.',
  },
] as const;

export function CorrectnessMetricLab() {
  const [scenarioId, setScenarioId] = useState<(typeof metricScenarios)[number]['id']>('tie');
  const scenario = metricScenarios.find((item) => item.id === scenarioId) ?? metricScenarios[0];

  return (
    <div data-olmocr-overview data-correctness-metric-lab className="not-prose my-8 min-w-0 border-y border-border py-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground">CORRECTNESS METRIC LAB</p>
          <h3 className="mt-1 text-lg font-black leading-snug">문자열이 가까운 것과 문서가 맞는 것은 다르다</h3>
        </div>
        <FlaskConical className="h-5 w-5 shrink-0 text-violet-600 dark:text-violet-300" aria-hidden="true" />
      </div>

      <div role="group" aria-label="정확도 반례 선택" className="grid grid-cols-3 gap-1 rounded-md bg-muted p-1">
        {metricScenarios.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={scenario.id === item.id}
            onClick={() => setScenarioId(item.id)}
            className={`min-h-11 rounded px-2 py-2 text-xs font-bold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              scenario.id === item.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.78fr)]">
        <div className="min-w-0">
          <p className="text-base font-black leading-snug">{scenario.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{scenario.rule}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ['기준 직렬화', scenario.reference, 'border-blue-500/50'],
              ['후보 출력', scenario.candidate, 'border-amber-500/60'],
            ].map(([label, sequence, accent]) => (
              <div key={label as string} className={`min-w-0 border-l-2 ${accent as string} pl-3`}>
                <p className="text-[11px] font-semibold text-muted-foreground">{label as string}</p>
                <div className="mt-3 flex min-w-0 flex-wrap items-center gap-1.5">
                  {(sequence as readonly string[]).map((token, index) => (
                    <div key={`${token}-${index}`} className="contents">
                      <span className="max-w-full rounded border border-border bg-background px-2.5 py-2 text-xs font-bold">
                        {token}
                      </span>
                      {index < sequence.length - 1 ? <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid min-w-0 gap-px overflow-hidden rounded-md border border-border bg-border">
          <div className="bg-background p-4">
            <p className="text-[11px] font-semibold text-muted-foreground">편집거리 관점 · 교육용 정성 비교</p>
            <p className="mt-2 text-sm font-bold leading-relaxed">{scenario.distance}</p>
          </div>
          <div className="bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold text-muted-foreground">문서 단위 검증기</p>
              <span className={`inline-flex items-center gap-1 text-xs font-black ${scenario.verifier === 'PASS' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                {scenario.verifier === 'PASS' ? <CircleCheck className="h-4 w-4" aria-hidden="true" /> : <CircleX className="h-4 w-4" aria-hidden="true" />}
                {scenario.verifier}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed">{scenario.reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const verifierDefinitions = [
  ['presence', '본문 존재', '필수 구절이 정확히 있는가'],
  ['absence', '머리말 제거', '머리말·꼬리말·쪽 번호가 없는가'],
  ['order', '읽기 순서', '문장 관계가 자연스러운가'],
  ['table', '표 관계', '특정 셀의 상대 위치가 맞는가'],
  ['math', '수식 렌더링', 'KaTeX로 그린 구조가 같은가'],
  ['robustness', '기본 안정성', '긴 반복·비대상 문자가 없는가'],
] as const;

export function RewardLedgerLab() {
  const [passes, setPasses] = useState<Record<string, boolean>>({
    presence: true,
    absence: true,
    order: true,
    table: false,
    math: true,
    robustness: false,
  });
  const [eos, setEos] = useState(true);
  const [metadata, setMetadata] = useState(false);
  const passCount = verifierDefinitions.filter(([id]) => passes[id]).length;
  const reward = passCount / verifierDefinitions.length;

  return (
    <div data-olmocr-verifier data-reward-ledger-lab className="not-prose my-8 min-w-0 border-y border-border py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">REWARD LEDGER</p>
          <h3 className="mt-1 text-lg font-black">여섯 검사의 통과율만 page test reward가 된다</h3>
        </div>
        <div data-page-reward className="text-right">
          <p className="font-mono text-2xl font-black tabular-nums">{passCount} / 6 = {reward.toFixed(2)}</p>
          <p className="text-[11px] text-muted-foreground">unit-test pass fraction</p>
        </div>
      </div>

      <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {verifierDefinitions.map(([id, label, description]) => {
          const checked = passes[id];
          return (
            <button
              key={id}
              type="button"
              role="switch"
              aria-checked={checked}
              onClick={() => setPasses((current) => ({ ...current, [id]: !current[id] }))}
              className="group min-h-[5.25rem] min-w-0 bg-background p-4 text-left transition-colors hover:bg-muted/30 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[6.25rem]"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block text-sm font-black">{label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{description}</span>
                </span>
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${checked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-border text-muted-foreground'}`}>
                  {checked ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          ['EOS 종료', '무한 반복 없이 종료 token을 냈는가', eos, () => setEos((value) => !value)],
          ['상단 metadata', '언어·회전 보정 정보를 냈는가', metadata, () => setMetadata((value) => !value)],
        ].map(([label, description, checked, onToggle]) => (
          <button
            key={label as string}
            type="button"
            role="switch"
            aria-checked={checked as boolean}
            onClick={onToggle as () => void}
            className="flex min-h-16 min-w-0 items-center justify-between gap-3 rounded-md border border-dashed border-border px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="min-w-0">
              <span className="block text-xs font-black">{label as string}</span>
              <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{description as string}</span>
            </span>
            <span className={`shrink-0 text-xs font-black ${(checked as boolean) ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`}>
              {(checked as boolean) ? 'PASS' : 'FAIL'}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted-foreground">
        <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        EOS와 metadata는 논문이 별도로 추가한 출력 형식 보상이다. 이 화면은 공개되지 않은 결합 가중치를 만들어 합산하지 않는다.
      </p>
    </div>
  );
}

const developmentMilestones = [
  {
    score: 68.2,
    short: '첫 릴리스',
    title: '초기 olmOCR 기준점',
    intervention: 'Qwen2-VL 기반 초기 학습·추론 구성',
    evidence: '이 점수에서 시작해야 마지막 +14.2를 여러 변경의 합으로 읽을 수 있다.',
  },
  {
    score: 72.8,
    short: '동적 온도',
    title: '낮은 온도로 시작하고 반복 때만 올렸다',
    intervention: '0.1에서 시작해 EOS 실패가 나면 0.2, 0.3, …, 최대 0.8로 증가',
    evidence: '정확한 샘플링과 반복 회피를 함께 잡아 +4.6점이 관찰됐다.',
  },
  {
    score: 75.8,
    short: 'Prompt 수정',
    title: '학습·추론의 image/text 순서 불일치를 고쳤다',
    intervention: '모든 경로에서 고정 text를 image보다 먼저 배치',
    evidence: '단순 prompt-order bug도 +3.0점 규모였다. 모델 구조만 봐서는 이 개선을 설명할 수 없다.',
  },
  {
    score: 78.5,
    short: '기반 교체',
    title: 'Trainer·YAML·1288px·Qwen2.5-VL을 함께 바꿨다',
    intervention: '새 trainer, JSON→YAML, image resize, base VLM 교체',
    evidence: '여러 변경이 묶인 단계라 개별 기여를 이 표만으로 분해할 수 없다.',
  },
  {
    score: 78.5,
    short: '빈 페이지',
    title: '점수는 그대로여도 실제 hallucination 버그를 막았다',
    intervention: 'loader가 blank page를 건너뛰던 오류를 수정하고 재학습',
    evidence: '평균 benchmark가 움직이지 않아도 배포 correctness는 나아질 수 있음을 보여 준다.',
  },
  {
    score: 82.4,
    short: 'RLVR',
    title: '합성 data·RLVR·여섯 checkpoint soup을 더했다',
    intervention: '한 epoch RL, seed 6개, token/sequence importance sampling, weight averaging',
    evidence: '마지막 +3.9점의 묶음이다. RLVR 하나의 고립된 효과로 읽으면 안 된다.',
  },
] as const;

export function DevelopmentLadderLab() {
  const [index, setIndex] = useState(developmentMilestones.length - 1);
  const milestone = developmentMilestones[index];
  const range = 84 - 66;
  const width = `${Math.max(6, ((milestone.score - 66) / range) * 100)}%`;

  return (
    <div data-olmocr-development data-development-ladder-lab className="not-prose my-8 min-w-0 border-y border-border py-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">FIRST RELEASE → OLMOCR 2</p>
          <h3 className="mt-1 text-lg font-black">한 번의 비법이 아니라 오류·runtime·학습을 차례로 고쳤다</h3>
        </div>
        <FileCode2 className="h-5 w-5 shrink-0 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
      </div>

      <div role="group" aria-label="개발 이정표 선택" className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">
        {developmentMilestones.map((item, milestoneIndex) => (
          <button
            key={`${item.short}-${milestoneIndex}`}
            type="button"
            aria-pressed={index === milestoneIndex}
            onClick={() => setIndex(milestoneIndex)}
            className={`min-h-[4.5rem] rounded-md border px-2 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              index === milestoneIndex ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:bg-muted/35'
            }`}
          >
            <span className="block font-mono text-base font-black tabular-nums">{item.score.toFixed(1)}</span>
            <span className={`mt-1 block text-[11px] font-bold ${index === milestoneIndex ? 'text-background/75' : 'text-muted-foreground'}`}>{item.short}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid min-w-0 gap-5">
        <div className="min-w-0">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-cyan-700 transition-[width] duration-300 dark:bg-cyan-300" style={{ width }} />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>66</span>
            <span>overall · {milestone.score.toFixed(1)}</span>
            <span>84</span>
          </div>
          <p className="mt-4 text-base font-black leading-snug">{milestone.title}</p>
          <p className="mt-2 text-sm leading-relaxed">{milestone.intervention}</p>
        </div>
        <div className="min-w-0 border-l-2 border-amber-500/70 pl-4">
          <p className="text-[11px] font-semibold text-muted-foreground">이 단계가 말해 주는 것</p>
          <p className="mt-2 text-sm leading-relaxed">{milestone.evidence}</p>
        </div>
      </div>
    </div>
  );
}
