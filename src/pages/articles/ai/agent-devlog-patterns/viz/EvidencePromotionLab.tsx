import { useMemo, useState } from 'react';
import {
  Activity,
  BookOpenCheck,
  FileClock,
  GitCommitHorizontal,
  ShieldCheck,
} from 'lucide-react';

type CaseId = 'fail-open' | 'schema' | 'repeat-retry' | 'copy';
type ArtifactState = 'required' | 'conditional' | 'skip';

interface EvidenceCase {
  id: CaseId;
  label: string;
  event: string;
  causalEvidence: string;
  artifacts: Record<'trace' | 'release' | 'adr' | 'lesson', ArtifactState>;
  verdict: string;
}

const cases: EvidenceCase[] = [
  {
    id: 'fail-open',
    label: '정책 Fail-open',
    event: 'Policy timeout 뒤 빈 policy로 mutation capability가 발급되어 무단 환불이 발생했다.',
    causalEvidence: '동일 fixture에서 dispatcher를 fail-closed로 바꾸면 forbidden refund 1→0, handoff 0→1.',
    artifacts: { trace: 'required', release: 'required', adr: 'required', lesson: 'conditional' },
    verdict: '권한 책임이 model/tool에서 dispatcher로 이동하므로 ADR까지 필요하다. Lesson은 독립 사건이 한 번 더 확인된 뒤 승격한다.',
  },
  {
    id: 'schema',
    label: 'Schema 이름 변경',
    event: 'Tool argument의 customerId를 customer_id로 바꾸고 adapter를 함께 배포했다.',
    causalEvidence: 'Compatibility fixture와 consumer contract test가 이전·새 client를 모두 통과했다.',
    artifacts: { trace: 'conditional', release: 'required', adr: 'skip', lesson: 'skip' },
    verdict: '동작과 호환성은 release record가 설명한다. 공개 interface 전략 자체를 바꾸지 않았다면 ADR은 과하다.',
  },
  {
    id: 'repeat-retry',
    label: '반복 Retry 사고',
    event: '결제와 메일 전송에서 timeout 뒤 blind retry가 각각 중복 side effect를 만들었다.',
    causalEvidence: '두 독립 case에서 verify-before-retry와 idempotency key가 duplicate commit을 0으로 만들었다.',
    artifacts: { trace: 'required', release: 'required', adr: 'conditional', lesson: 'required' },
    verdict: '반복 causal pattern과 재사용 범위가 확인됐으므로 Lesson이 필요하다. 공통 commit protocol을 만들면 ADR도 승격한다.',
  },
  {
    id: 'copy',
    label: 'UI 문구 수정',
    event: 'Approval 버튼 문구를 “실행”에서 “80달러 환불 승인”으로 바꿨다.',
    causalEvidence: 'Accessibility snapshot과 UI review에서 action 대상·금액이 명시됐다.',
    artifacts: { trace: 'skip', release: 'required', adr: 'skip', lesson: 'skip' },
    verdict: '사용자-facing 변경 기록이면 충분하다. 구조 결정이나 반복 원칙을 억지로 만들지 않는다.',
  },
];

const artifactRows = [
  { id: 'trace' as const, label: 'Trace · Eval', icon: Activity, question: '무엇이 실제로 일어났나?' },
  { id: 'release' as const, label: 'Release record', icon: GitCommitHorizontal, question: '무엇을 바꾸고 검증했나?' },
  { id: 'adr' as const, label: 'ADR', icon: FileClock, question: '왜 이 책임 경계를 골랐나?' },
  { id: 'lesson' as const, label: 'Lesson', icon: BookOpenCheck, question: '다음에도 적용할 규칙인가?' },
];

const stateLabel: Record<ArtifactState, string> = {
  required: '필수',
  conditional: '조건부',
  skip: '생략',
};

const stateClass: Record<ArtifactState, string> = {
  required: 'border-emerald-600/35 bg-emerald-500/[0.06] text-emerald-800 dark:text-emerald-200',
  conditional: 'border-amber-600/35 bg-amber-500/[0.06] text-amber-800 dark:text-amber-200',
  skip: 'border-border bg-muted/20 text-muted-foreground',
};

export function EvidencePromotionLab() {
  const [selectedId, setSelectedId] = useState<CaseId>('fail-open');
  const selected = useMemo(
    () => cases.find((item) => item.id === selectedId) ?? cases[0],
    [selectedId],
  );

  return (
    <div data-agent-evidence-ledger className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <div className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-[11px] font-black uppercase text-muted-foreground">Evidence promotion lab</p>
        <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-base font-bold">한 사건이 어느 기록까지 올라가야 할까?</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">사건의 크기가 아니라 각 기록이 답할 독립 질문으로 승격 범위를 고릅니다.</p>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">case / {selected.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4" role="group" aria-label="기록 승격 사례">
        {cases.map((item) => {
          const active = item.id === selected.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedId(item.id)}
              className={`min-h-12 min-w-0 bg-background px-3 py-2 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/30 ${active ? 'text-foreground shadow-[inset_0_-2px_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/25 hover:text-foreground'}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <p className="text-xs font-bold text-muted-foreground">관측한 사건</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed">{selected.event}</p>
          <p className="mt-5 text-xs font-bold text-muted-foreground">Causal evidence</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.causalEvidence}</p>
          <div className="mt-5 flex items-start gap-2 border-t border-border pt-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
            <p className="text-xs leading-relaxed">{selected.verdict}</p>
          </div>
        </div>

        <div className="min-w-0">
          {artifactRows.map((artifact, index) => {
            const state = selected.artifacts[artifact.id];
            const Icon = artifact.icon;
            return (
              <div
                key={artifact.id}
                className={`grid min-w-0 grid-cols-[2rem_minmax(0,1fr)_4rem] items-center gap-3 px-4 py-4 sm:grid-cols-[2.25rem_9rem_minmax(0,1fr)_4.5rem] sm:px-6 ${index > 0 ? 'border-t border-border' : ''}`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted/35 text-muted-foreground">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <strong className="text-xs sm:text-sm">{artifact.label}</strong>
                <span className="hidden min-w-0 text-xs leading-relaxed text-muted-foreground sm:block">{artifact.question}</span>
                <span className={`justify-self-end rounded-sm border px-2 py-1 text-[10px] font-black ${stateClass[state]}`}>
                  {stateLabel[state]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
