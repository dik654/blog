import { useMemo, useState } from 'react';
import { BellRing, Brackets, CircleAlert, Clock3, Gauge, Waves } from 'lucide-react';

const anomalyCases = [
  {
    id: 'point',
    label: '점 이상',
    icon: CircleAlert,
    question: '이 값 하나가 전체 분포에서도 드문가?',
    explanation: '정상 범위가 10~65인 센서에서 96이 한 번 튄다. 주변 시점이나 달력 맥락을 몰라도 값 자체가 극단적이다.',
    values: [18, 22, 28, 35, 42, 48, 51, 55, 50, 46, 96, 38, 31, 26, 22, 20],
    expected: [20, 22, 27, 34, 41, 47, 52, 55, 52, 47, 43, 38, 32, 27, 23, 20],
    flagged: [10],
    verdict: '전역 tail baseline으로도 찾을 수 있다.',
  },
  {
    id: 'context',
    label: '맥락 이상',
    icon: Clock3,
    question: '평범한 값이 잘못된 시간·상태에 나타났는가?',
    explanation: '62는 낮 시간에는 흔하지만 새벽 기대값 20 근처에서는 이상하다. 값의 전역 순위만 보면 놓치고 시간대 조건이 필요하다.',
    values: [20, 21, 62, 28, 39, 47, 54, 59, 61, 58, 51, 43, 35, 29, 24, 21],
    expected: [20, 21, 23, 28, 38, 47, 54, 59, 61, 58, 51, 43, 35, 29, 24, 21],
    flagged: [2],
    verdict: '시간대·운영 상태를 조건으로 한 residual이 필요하다.',
  },
  {
    id: 'collective',
    label: '구간 이상',
    icon: Waves,
    question: '점 하나는 정상이어도 이어진 모양이 비정상인가?',
    explanation: '각 값은 허용 범위 안이지만 여섯 시점 동안 기대값보다 계속 높다. 개별 threshold 대신 run·change·shape를 사건으로 봐야 한다.',
    values: [19, 22, 27, 34, 41, 55, 62, 67, 67, 63, 58, 43, 35, 28, 23, 20],
    expected: [20, 22, 27, 34, 41, 47, 52, 55, 52, 47, 42, 38, 33, 28, 23, 20],
    flagged: [5, 6, 7, 8, 9, 10],
    verdict: '점 알람을 연속 사건으로 묶고 지속시간을 평가해야 한다.',
  },
] as const;

const maxValue = 100;

export function AnomalyTypeLab() {
  const [activeId, setActiveId] = useState<(typeof anomalyCases)[number]['id']>('context');
  const active = anomalyCases.find((item) => item.id === activeId) ?? anomalyCases[0];
  const ActiveIcon = active.icon;

  return (
    <figure data-anomaly-type-lab className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase text-muted-foreground">Anomaly is a question, not a shape</p>
        <h3 className="mt-1 text-base font-bold sm:text-lg">같은 값도 무엇과 비교하느냐에 따라 판정이 달라진다</h3>
      </figcaption>

      <div className="grid grid-cols-3 gap-px bg-border" aria-label="이상 유형 선택">
        {anomalyCases.map((item) => {
          const Icon = item.icon;
          const selected = item.id === active.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveId(item.id)}
              className={`min-w-0 bg-background px-2 py-3 text-left transition-colors sm:px-4 ${selected ? 'bg-blue-500/[0.08]' : 'hover:bg-muted/45'}`}
            >
              <Icon className={`h-4 w-4 ${selected ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`} aria-hidden="true" />
              <strong className="mt-2 block break-keep text-xs leading-snug sm:text-sm">{item.label}</strong>
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-5">
        <div
          className="grid h-44 grid-cols-[repeat(16,minmax(0,1fr))] items-end gap-1 border-b border-border px-1"
          role="img"
          aria-label={`${active.label} 예시. ${active.explanation}`}
        >
          {active.values.map((value, index) => {
            const flagged = active.flagged.includes(index as never);
            const expected = active.expected[index];
            return (
              <div key={`${active.id}-${index}`} className="relative flex h-full min-w-0 items-end justify-center">
                <span
                  className="absolute bottom-0 w-[72%] rounded-t-sm bg-muted-foreground/15"
                  style={{ height: `${(expected / maxValue) * 100}%` }}
                  aria-hidden="true"
                />
                <span
                  className={`relative w-[45%] rounded-t-sm transition-[height,background-color] duration-300 ${flagged ? 'bg-rose-600 dark:bg-rose-400' : 'bg-blue-600/65 dark:bg-blue-400/60'}`}
                  style={{ height: `${(value / maxValue) * 100}%` }}
                  aria-hidden="true"
                />
                {flagged && <span className="absolute top-1 h-2 w-2 rounded-full bg-rose-600 dark:bg-rose-400" aria-hidden="true" />}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>과거</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-muted-foreground/15" />정상 기대값</span>
          <span>현재</span>
        </div>

        <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold"><ActiveIcon className="h-4 w-4" aria-hidden="true" />{active.question}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{active.explanation}</p>
          </div>
          <div className="border-l-2 border-emerald-600/45 pl-3 text-xs leading-relaxed text-muted-foreground">
            <strong className="block text-foreground">판정 경계</strong>
            <span className="mt-1 block">{active.verdict}</span>
          </div>
        </div>
      </div>
    </figure>
  );
}

const scores = [0.4, 0.7, 2.8, 3.1, 1.2, 2.9, 0.8, 0.5, 2.6, 2.8, 3.0, 0.4];

type EventRange = { start: number; end: number; alerts: number; accepted: boolean };

function buildEvents(alerts: boolean[], allowedGap: number, minimumAlerts: number): EventRange[] {
  const indexes = alerts.flatMap((alert, index) => alert ? [index] : []);
  if (indexes.length === 0) return [];
  const events: EventRange[] = [];
  let start = indexes[0];
  let end = indexes[0];
  let count = 1;

  for (const index of indexes.slice(1)) {
    if (index - end - 1 <= allowedGap) {
      end = index;
      count += 1;
    } else {
      events.push({ start, end, alerts: count, accepted: count >= minimumAlerts });
      start = index;
      end = index;
      count = 1;
    }
  }
  events.push({ start, end, alerts: count, accepted: count >= minimumAlerts });
  return events;
}

export function AlertEventLab() {
  const [threshold, setThreshold] = useState(2.5);
  const [allowedGap, setAllowedGap] = useState(0);
  const minimumAlerts = 2;
  const alerts = useMemo(() => scores.map((score) => score >= threshold), [threshold]);
  const candidates = useMemo(
    () => buildEvents(alerts, allowedGap, minimumAlerts),
    [alerts, allowedGap],
  );
  const events = useMemo(() => candidates.filter((candidate) => candidate.accepted), [candidates]);
  const rejectedIndexes = useMemo(() => new Set(candidates
    .filter((candidate) => !candidate.accepted)
    .flatMap((candidate) => Array.from(
      { length: candidate.end - candidate.start + 1 },
      (_, offset) => candidate.start + offset,
    ).filter((index) => alerts[index]))), [alerts, candidates]);
  const eventByIndex = useMemo(() => {
    const result = new Map<number, { id: number; start: number }>();
    events.forEach((event, eventIndex) => {
      for (let index = event.start; index <= event.end; index += 1) {
        result.set(index, { id: eventIndex + 1, start: event.start });
      }
    });
    return result;
  }, [events]);
  const alertCount = alerts.filter(Boolean).length;

  return (
    <figure data-alert-event-lab className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase text-muted-foreground">Score → point alert → incident</p>
        <h3 className="mt-1 text-base font-bold sm:text-lg">Threshold를 넘은 점을 그대로 티켓 수로 세지 않는다</h3>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[minmax(0,1fr)_13rem_10rem] sm:p-5">
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          점수 threshold · {threshold.toFixed(1)}
          <input
            aria-label="이상 점수 threshold"
            className="mt-1 block h-11 w-full cursor-pointer accent-blue-700"
            type="range"
            min="1.5"
            max="3.2"
            step="0.1"
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
          />
        </label>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">허용할 정상 gap</p>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-md border border-border p-1">
            {[0, 1].map((gap) => (
              <button
                key={gap}
                type="button"
                aria-pressed={allowedGap === gap}
                onClick={() => setAllowedGap(gap)}
                className={`min-h-11 rounded-sm px-2 text-xs font-bold ${allowedGap === gap ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'}`}
              >
                {gap === 0 ? '연속만' : '1칸 허용'}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 border-l-2 border-amber-600/50 pl-3 text-xs leading-relaxed text-muted-foreground">
          <span className="block font-semibold">최소 지속시간 k</span>
          <strong className="mt-1 block text-sm text-foreground">{minimumAlerts}개 point alert</strong>
          <span className="mt-1 block">k 미만 후보는 사건으로 올리지 않는다.</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-12" aria-label="시점별 이상 점수와 사건 묶음">
          {scores.map((score, index) => {
            const alert = alerts[index];
            const event = eventByIndex.get(index);
            const rejected = rejectedIndexes.has(index);
            return (
              <div key={index} className="min-w-0 text-center" data-point-state={event ? 'incident' : rejected ? 'rejected' : alert ? 'alert' : 'normal'}>
                <div className={`relative flex h-24 items-end justify-center overflow-hidden rounded-sm border bg-muted/15 ${event ? 'border-rose-600/55' : rejected ? 'border-amber-600/60' : 'border-border'}`}>
                  <span
                    className={`w-[45%] rounded-t-sm transition-[height,background-color] duration-200 ${event && alert ? 'bg-rose-600 dark:bg-rose-400' : rejected ? 'bg-amber-600 dark:bg-amber-400' : alert ? 'bg-rose-600/65 dark:bg-rose-400/65' : 'bg-blue-600/55 dark:bg-blue-400/50'}`}
                    style={{ height: `${Math.min(100, (score / 3.2) * 100)}%` }}
                    aria-hidden="true"
                  />
                  {event && event.start === index && <span className="absolute left-1 top-1 rounded-sm bg-foreground px-1 font-mono text-xs font-bold text-background">E{event.id}</span>}
                  {rejected && <span className="absolute left-1 top-1 rounded-sm bg-amber-700 px-1 text-xs font-bold text-white">기각</span>}
                </div>
                <span className="mt-1 block font-mono text-xs text-muted-foreground">t{index + 1}</span>
                <span className="block font-mono text-xs font-bold">{score.toFixed(1)}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground" aria-label="사건화 상태 범례">
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-rose-600" />k를 충족한 incident</span>
          <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-amber-600" />k 미만이라 기각된 point alert</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {[
            ['점 알람', `${alertCount}개`, 'threshold 초과 수'],
            ['기각 후보', `${candidates.length - events.length}건`, `최소 ${minimumAlerts}점 미만`],
            ['운영 사건', `${events.length}건`, `gap + k=${minimumAlerts} 규칙 통과`],
            ['정상 gap', `${allowedGap}칸`, 'incident merge 허용치'],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-3 sm:p-4">
              <span className="block text-xs font-semibold text-muted-foreground">{label}</span>
              <strong className="mt-1 block font-mono text-lg">{value}</strong>
              <span className="mt-1 block text-xs leading-snug text-muted-foreground">{detail}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted-foreground">
          <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
          같은 실제 장애에서 5개 점이 threshold를 넘었다면 모델 성능은 “5건 탐지”가 아니다. 하나의 사건을 찾았는지, 첫 알람까지 얼마나 걸렸는지, 정상 기간에 몇 건을 울렸는지를 따로 센다.
        </p>
      </div>
    </figure>
  );
}

export function AlertContractStrip() {
  const items = [
    { icon: Brackets, label: 'Incident', value: '어디서 시작·끝나는가?' },
    { icon: Gauge, label: 'Severity', value: '점수와 업무 피해가 같은가?' },
    { icon: Clock3, label: 'Delay', value: '몇 step 안에 알려야 하는가?' },
    { icon: BellRing, label: 'Budget', value: '하루 몇 번까지 울릴 수 있는가?' },
  ];
  return (
    <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="min-w-0 bg-background p-4">
          <div className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" /><strong className="text-sm">{label}</strong></div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}
