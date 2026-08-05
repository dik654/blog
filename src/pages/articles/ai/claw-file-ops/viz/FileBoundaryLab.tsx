import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlert, CircleCheck, FileLock2, ShieldAlert } from 'lucide-react';
import { useMemo, useState } from 'react';

type ScenarioId = 'read' | 'direct-write' | 'symlink' | 'swap-race' | 'open-time';
type Tone = 'ok' | 'warn' | 'stop' | 'muted';

const scenarios = [
  { id: 'read', label: '텍스트 읽기' },
  { id: 'direct-write', label: '직접 쓰기' },
  { id: 'symlink', label: '외부 심링크' },
  { id: 'swap-race', label: '검사 후 교체' },
  { id: 'open-time', label: '강한 목표 설계' },
] as const;

const scenarioData: Record<ScenarioId, {
  state: string;
  stateTone: 'current' | 'risk' | 'target';
  summary: string;
  stages: Array<{ label: string; value: string; tone: Tone }>;
  holds: string;
  missing: string;
}> = {
  read: {
    state: 'CURRENT TEXT CONTRACT',
    stateTone: 'current',
    summary: '현재 read_file은 크기, NUL probe, UTF-8, 줄 창을 순서대로 확인한다.',
    stages: [
      { label: 'PATH', value: 'canonicalize', tone: 'ok' },
      { label: 'SIZE', value: 'metadata 상한', tone: 'ok' },
      { label: 'TEXT', value: 'NUL probe → UTF-8', tone: 'ok' },
      { label: 'WINDOW', value: 'offset / limit', tone: 'ok' },
    ],
    holds: '텍스트 출력과 context 크기는 제한된다.',
    missing: 'canonical path가 workspace 안인지 production dispatcher에서 비교하지 않는다.',
  },
  'direct-write': {
    state: 'NON-ATOMIC',
    stateTone: 'risk',
    summary: '현재 write_file은 이전 내용을 결과용으로 읽은 뒤 대상 파일에 직접 쓴다.',
    stages: [
      { label: 'LIMIT', value: 'content size 확인', tone: 'ok' },
      { label: 'PATH', value: 'missing path 정규화', tone: 'warn' },
      { label: 'PARENT', value: 'create_dir_all', tone: 'warn' },
      { label: 'WRITE', value: 'fs::write(target)', tone: 'stop' },
    ],
    holds: '입력 상한과 사후 structured patch가 있다.',
    missing: 'temp+rename, 권한 보존, fsync, rollback backup은 없다.',
  },
  symlink: {
    state: 'BOUNDARY UNWIRED',
    stateTone: 'risk',
    summary: 'workspace 안의 link가 외부를 가리켜도 일반 read_file은 root membership을 검사하지 않는다.',
    stages: [
      { label: 'INPUT', value: 'workspace/link', tone: 'muted' },
      { label: 'RESOLVE', value: '/etc/secret', tone: 'warn' },
      { label: 'ROOT CHECK', value: 'production 경로에 없음', tone: 'stop' },
      { label: 'READ', value: '외부 target 가능', tone: 'stop' },
    ],
    holds: '별도 dead-code wrapper에는 canonical root 비교가 있다.',
    missing: '실제 tools dispatcher는 일반 read/write/edit 함수를 호출한다.',
  },
  'swap-race': {
    state: 'TOCTOU',
    stateTone: 'risk',
    summary: 'workspace wrapper를 단순 배선해도 검사한 handle을 이어 쓰지 않아 race가 남는다.',
    stages: [
      { label: 'CHECK', value: 'parent canonicalize', tone: 'ok' },
      { label: 'COMPARE', value: 'starts_with(root)', tone: 'ok' },
      { label: 'SWAP', value: 'ancestor symlink 교체', tone: 'stop' },
      { label: 'USE', value: '일반 I/O가 다시 해석', tone: 'stop' },
    ],
    holds: '검사 시점의 resolved path는 root 내부였다.',
    missing: '검사와 open이 분리되어 대상 동일성이 보장되지 않는다.',
  },
  'open-time': {
    state: 'TARGET DESIGN',
    stateTone: 'target',
    summary: '권장 설계는 신뢰한 workspace dirfd에 상대적으로 path를 열면서 kernel 제약을 건다.',
    stages: [
      { label: 'ANCHOR', value: 'workspace dirfd 유지', tone: 'ok' },
      { label: 'RESOLVE', value: 'relative path only', tone: 'ok' },
      { label: 'OPEN', value: 'openat2 RESOLVE_*', tone: 'ok' },
      { label: 'I/O', value: '검증된 fd를 계속 사용', tone: 'ok' },
    ],
    holds: '검사와 사용을 같은 open operation에 묶을 수 있다.',
    missing: '현재 Claw 구현이 아니라 production hardening 목표다.',
  },
};

const stateClass = {
  current: 'border-teal-600/30 bg-teal-500/[0.06] text-teal-800 dark:text-teal-200',
  risk: 'border-rose-600/30 bg-rose-500/[0.06] text-rose-800 dark:text-rose-200',
  target: 'border-sky-600/30 bg-sky-500/[0.06] text-sky-800 dark:text-sky-200',
} as const;

const railClass: Record<Tone, string> = {
  ok: 'border-teal-600/55',
  warn: 'border-amber-600/55',
  stop: 'border-rose-600/55',
  muted: 'border-border',
};

export default function FileBoundaryLab() {
  const [scenario, setScenario] = useState<ScenarioId>('read');
  const selected = useMemo(() => scenarioData[scenario], [scenario]);

  return (
    <div data-file-boundary-lab className="not-prose my-7 overflow-hidden rounded-md border border-border bg-background">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2">
          <FileLock2 className="h-4 w-4 text-sky-700 dark:text-sky-300" aria-hidden="true" />
          <p className="text-[10px] font-bold text-muted-foreground">FILE HANDLE BOUNDARY LAB</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="파일 경계 시나리오">
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
          data-file-scenario={scenario}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="min-w-0"
        >
          <div className="grid border-b border-border lg:grid-cols-[minmax(0,1fr)_13rem]">
            <p className="min-w-0 break-words px-4 py-4 text-sm leading-relaxed sm:px-5">{selected.summary}</p>
            <div className="flex items-center border-t border-border px-4 py-3 lg:border-l lg:border-t-0 sm:px-5">
              <span className={`inline-flex items-center gap-2 rounded border px-2.5 py-1.5 font-mono text-[10px] font-bold ${stateClass[selected.stateTone]}`}>
                {selected.stateTone === 'risk' ? <ShieldAlert className="h-3.5 w-3.5" /> : <CircleCheck className="h-3.5 w-3.5" />}
                {selected.state}
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

          <div className="grid border-t border-border sm:grid-cols-2">
            <div className="min-w-0 px-4 py-3 sm:px-5">
              <p className="text-[9px] font-bold text-teal-700 dark:text-teal-300">지금 성립</p>
              <p className="mt-1 text-xs leading-relaxed">{selected.holds}</p>
            </div>
            <div className="min-w-0 border-t border-border px-4 py-3 sm:border-l sm:border-t-0 sm:px-5">
              <div className="flex gap-2">
                <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-amber-700 dark:text-amber-300">아직 성립하지 않음</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{selected.missing}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
