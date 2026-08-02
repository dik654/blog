import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlert, CircleCheck, CircleHelp, CircleX, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';

type ScenarioId = 'unknown' | 'deny-override' | 'headless-ask' | 'allow-ask' | 'prompt-policy' | 'prompt-handoff';
type Tone = 'ok' | 'warn' | 'stop' | 'muted';

const scenarios = [
  { id: 'unknown', label: '미등록 도구' },
  { id: 'deny-override', label: 'Deny + Hook Allow' },
  { id: 'headless-ask', label: 'Ask + UI 없음' },
  { id: 'allow-ask', label: 'Hook Allow + Ask' },
  { id: 'prompt-policy', label: 'Prompt policy' },
  { id: 'prompt-handoff', label: 'Prompt enforcer' },
] as const;

const scenarioData: Record<ScenarioId, {
  result: 'DENY' | 'PROMPT' | 'ALLOW' | 'HANDOFF';
  resultTone: 'deny' | 'prompt' | 'implicit' | 'handoff';
  summary: string;
  stages: Array<{ label: string; value: string; tone: Tone }>;
  lesson: string;
}> = {
  unknown: {
    result: 'DENY',
    resultTone: 'deny',
    summary: '등록되지 않은 tool은 required mode가 DangerFullAccess로 닫힌다.',
    stages: [
      { label: 'REQUEST', value: 'mystery_tool · ReadOnly', tone: 'muted' },
      { label: 'DENY RULE', value: 'match 없음', tone: 'ok' },
      { label: 'REQUIREMENT', value: '기본값 DangerFullAccess', tone: 'warn' },
      { label: 'OUTCOME', value: 'mode 부족 → Deny', tone: 'stop' },
    ],
    lesson: '도구 등록 누락이 낮은 권한의 묵시적 허용으로 바뀌지 않는다.',
  },
  'deny-override': {
    result: 'DENY',
    resultTone: 'deny',
    summary: 'static deny는 request context보다 먼저 평가된다.',
    stages: [
      { label: 'REQUEST', value: 'Bash(rm -rf build)', tone: 'muted' },
      { label: 'DENY RULE', value: 'Bash(rm:*) match', tone: 'stop' },
      { label: 'HOOK', value: 'Allow는 평가되지 않음', tone: 'muted' },
      { label: 'OUTCOME', value: '즉시 Deny', tone: 'stop' },
    ],
    lesson: 'hook guidance는 이미 이긴 static deny를 뒤집는 최상위 우회권이 아니다.',
  },
  'headless-ask': {
    result: 'DENY',
    resultTone: 'deny',
    summary: 'Ask가 필요하지만 prompter가 없으면 unattended 실행을 거부한다.',
    stages: [
      { label: 'REQUEST', value: 'Bash(git push)', tone: 'muted' },
      { label: 'ASK RULE', value: '명시적 Ask match', tone: 'warn' },
      { label: 'PROMPTER', value: 'None', tone: 'stop' },
      { label: 'OUTCOME', value: 'fail-closed Deny', tone: 'stop' },
    ],
    lesson: '질문을 표시할 수 없는 환경을 자동 허용으로 바꾸지 않는다.',
  },
  'allow-ask': {
    result: 'PROMPT',
    resultTone: 'prompt',
    summary: 'hook Allow가 있어도 ask rule이 맞으면 사용자 결정이 먼저다.',
    stages: [
      { label: 'REQUEST', value: 'Bash(git push)', tone: 'muted' },
      { label: 'HOOK', value: 'Allow guidance', tone: 'ok' },
      { label: 'ASK RULE', value: '우선 적용', tone: 'warn' },
      { label: 'OUTCOME', value: '사용자에게 질문', tone: 'warn' },
    ],
    lesson: 'Allow라는 이름만 보고 ask보다 강하다고 가정하면 우선순위를 거꾸로 읽게 된다.',
  },
  'prompt-policy': {
    result: 'ALLOW',
    resultTone: 'implicit',
    summary: '현재 PermissionPolicy는 Prompt mode도 derived enum order로 일반 requirement와 비교한다.',
    stages: [
      { label: 'ENTRY', value: 'authorize_with_context', tone: 'muted' },
      { label: 'ACTIVE MODE', value: 'Prompt · rank 4', tone: 'warn' },
      { label: 'REQUIREMENT', value: 'DangerFullAccess · rank 3', tone: 'warn' },
      { label: 'OUTCOME', value: 'mode comparison → Allow', tone: 'stop' },
    ],
    lesson: '사용자 승인이 아니라 현재 revision의 enum-order 결함이다. special mode를 범위 비교에서 분리해야 한다.',
  },
  'prompt-handoff': {
    result: 'HANDOFF',
    resultTone: 'handoff',
    summary: '얇은 PermissionEnforcer::check()는 Prompt mode에서 policy 호출 전 Allowed를 반환한다.',
    stages: [
      { label: 'ENTRY', value: 'PermissionEnforcer::check', tone: 'muted' },
      { label: 'ACTIVE MODE', value: 'Prompt', tone: 'warn' },
      { label: 'RETURN', value: 'Allowed handoff', tone: 'ok' },
      { label: 'CALLER DUTY', value: '별도 interactive 승인', tone: 'warn' },
    ],
    lesson: '이 Allowed는 최종 사용자 승인 증거가 아니다. caller가 prompt를 닫아야 한다.',
  },
};

const resultClass = {
  deny: 'border-rose-600/30 bg-rose-500/[0.06] text-rose-800 dark:text-rose-200',
  prompt: 'border-amber-600/30 bg-amber-500/[0.06] text-amber-800 dark:text-amber-200',
  implicit: 'border-rose-600/30 bg-rose-500/[0.06] text-rose-800 dark:text-rose-200',
  handoff: 'border-sky-600/30 bg-sky-500/[0.06] text-sky-800 dark:text-sky-200',
} as const;

const railClass: Record<Tone, string> = {
  ok: 'border-teal-600/55',
  warn: 'border-amber-600/55',
  stop: 'border-rose-600/55',
  muted: 'border-border',
};

export default function PermissionDecisionLab() {
  const [scenario, setScenario] = useState<ScenarioId>('unknown');
  const selected = useMemo(() => scenarioData[scenario], [scenario]);

  return (
    <div
      data-permission-decision-lab
      className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background"
    >
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-sky-700 dark:text-sky-300" aria-hidden="true" />
          <p className="text-[10px] font-bold text-muted-foreground">PERMISSION CONFLICT LAB</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="권한 충돌 시나리오">
          {scenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={scenario === item.id}
              onClick={() => setScenario(item.id)}
              className={`rounded border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                scenario === item.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={scenario}
          data-permission-scenario={scenario}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="min-w-0"
        >
          <div className="grid border-b border-border lg:grid-cols-[minmax(0,1fr)_11rem]">
            <p className="min-w-0 break-words px-4 py-4 text-sm leading-relaxed sm:px-5">
              {selected.summary}
            </p>
            <div className="flex items-center border-t border-border px-4 py-3 lg:border-l lg:border-t-0 sm:px-5">
              <span className={`inline-flex items-center gap-2 rounded border px-2.5 py-1.5 font-mono text-[10px] font-bold ${resultClass[selected.resultTone]}`}>
                {selected.result === 'DENY' ? <CircleX className="h-3.5 w-3.5" /> : selected.result === 'PROMPT' ? <CircleHelp className="h-3.5 w-3.5" /> : selected.result === 'ALLOW' ? <CircleAlert className="h-3.5 w-3.5" /> : <CircleCheck className="h-3.5 w-3.5" />}
                {selected.result}
              </span>
            </div>
          </div>

          <div className="grid min-w-0 px-4 py-5 sm:grid-cols-4 sm:px-5">
            {selected.stages.map((stage, index) => (
              <div key={`${scenario}-${stage.label}`} className={`min-w-0 border-l-2 py-2 pl-3 sm:border-l-0 sm:border-t-2 sm:pb-0 sm:pl-0 sm:pr-3 sm:pt-3 ${railClass[stage.tone]}`}>
                <p className="font-mono text-[9px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')} · {stage.label}</p>
                <p className="mt-1 break-words text-xs font-semibold leading-relaxed [overflow-wrap:anywhere]">{stage.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-border bg-muted/15 px-4 py-3 sm:px-5">
            <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">판정 핵심.</strong> {selected.lesson}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
