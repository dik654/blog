import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  FileStack,
  GitBranch,
  Grid3X3,
  Search,
  ShieldCheck,
  TriangleAlert,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

type ReleaseScenario = 'verified' | 'tableMismatch' | 'missingSource';

type Scenario = {
  label: string;
  checks: readonly [boolean, boolean, boolean, boolean];
  message: string;
};

const scenarios: Record<ReleaseScenario, Scenario> = {
  verified: {
    label: '검증 완료',
    checks: [true, true, true, true],
    message: '네 gate가 모두 통과했다. 검색 결과에서 원본 근거까지 되돌아갈 수 있으므로 공개한다.',
  },
  tableMismatch: {
    label: '표 합계 불일치',
    checks: [true, true, false, true],
    message: '출처는 남아 있지만 subtotal 42 + tax 5와 total 48이 맞지 않는다. 자동 공개하지 않고 검토 queue로 보낸다.',
  },
  missingSource: {
    label: '출처 좌표 누락',
    checks: [false, true, true, false],
    message: 'Page와 bbox가 없어 답변에서 원문으로 돌아갈 수 없다. 검색 색인에 넣지 않고 차단한다.',
  },
};

const steps = [
  {
    label: 'Page packet은 문장뿐 아니라 출처 좌표를 운반한다.',
    body: 'Text·table·formula block마다 page, bbox, crop reference와 parser revision을 묶는다. 이 provenance가 없으면 뒤 단계에서 맞는 문장처럼 보여도 검증할 수 없다.',
  },
  {
    label: 'Page 사이의 관계를 document tree로 복원한다.',
    body: 'Contains, continues, describes 관계로 heading·문단·표·caption을 연결한다. OCR 순서와 문서 의미 구조는 같은 문제가 아니다.',
  },
  {
    label: '표는 문자열이 아니라 점유 격자와 업무 규칙으로 검증한다.',
    body: 'Rowspan·colspan 충돌, header lineage와 subtotal·tax·total 관계를 분리해 검사한다. 숫자를 모두 읽어도 관계가 틀리면 실패다.',
  },
  {
    label: 'RAG node에는 원문으로 돌아가는 citation path가 필요하다.',
    body: 'Heading path와 source span을 함께 저장해 검색된 chunk에서 block, page, bbox와 crop까지 역추적한다.',
  },
  {
    label: '네 gate를 AND로 묶어 공개·검토·차단을 결정한다.',
    body: '좋은 점수가 나쁜 근거를 평균으로 숨기지 못하게 한다. 하나라도 실패하면 이유와 source identity를 receipt로 남긴다.',
  },
] as const;

const gateLabels = ['원문 추적', '문서 관계', '표 규칙', '인용 경로'] as const;

function getVerdict(current: Scenario) {
  if (!current.checks[0]) return 'blocked' as const;
  if (current.checks.every(Boolean)) return 'release' as const;
  return 'review' as const;
}

function SectionTitle({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 border-b border-border pb-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-background">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase text-muted-foreground">{eyebrow}</p>
        <p className="mt-1 text-sm font-bold leading-5">{title}</p>
      </div>
    </div>
  );
}

function ScenarioControl({
  selected,
  onChange,
}: {
  selected: ReleaseScenario;
  onChange: (next: ReleaseScenario) => void;
}) {
  return (
    <div className="mb-6 flex min-w-0 flex-wrap gap-2" role="group" aria-label="문서 검증 상태 선택">
      {(Object.keys(scenarios) as ReleaseScenario[]).map((id) => (
        <button
          aria-pressed={selected === id}
          className={`min-h-11 min-w-0 flex-1 basis-32 rounded-md border px-3 py-2 text-xs font-bold leading-5 transition-colors ${
            selected === id
              ? 'border-foreground bg-foreground text-background'
              : 'border-border bg-background hover:bg-muted/30'
          }`}
          key={id}
          onClick={() => onChange(id)}
          type="button"
        >
          {scenarios[id].label}
        </button>
      ))}
    </div>
  );
}

function ProvenancePacket({ scenario }: { scenario: ReleaseScenario }) {
  const missing = scenario === 'missingSource';
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.72fr)]">
      <div className="min-w-0">
        <SectionTitle icon={FileStack} eyebrow="Artifact 01" title="Page 47의 typed block 세 개" />
        <div className="mt-4 divide-y divide-border border-y border-border">
          {[
            ['b-01', 'heading', '문서 구조 평가'],
            ['b-02', 'table', '분기 · 매출 · 합계'],
            ['b-03', 'formula', 'E = mc²'],
          ].map(([id, type, value]) => (
            <div className="grid min-w-0 gap-2 py-3 sm:grid-cols-[3rem_4.5rem_minmax(0,1fr)]" key={id}>
              <span className="font-mono text-xs font-black">{id}</span>
              <span className="text-xs font-bold">{type}</span>
              <span className="min-w-0 text-xs leading-5 text-muted-foreground">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="min-w-0">
        <SectionTitle
          icon={missing ? TriangleAlert : Check}
          eyebrow="Provenance"
          title={missing ? 'Source identity가 끊겼다' : '원문으로 돌아가는 주소가 있다'}
        />
        <dl className="mt-4 divide-y divide-border border-y border-border">
          {[
            ['page', missing ? '누락' : '47'],
            ['bbox', missing ? '누락' : '[18, 31, 91, 72]'],
            ['crop_ref', missing ? '누락' : 'crop://page-47/b-02'],
            ['revision', 'paddleocr-vl-1.6 / schema-4'],
          ].map(([term, value]) => (
            <div className="grid min-w-0 gap-1 py-3 sm:grid-cols-[5rem_minmax(0,1fr)]" key={term}>
              <dt className="font-mono text-xs font-bold text-muted-foreground">{term}</dt>
              <dd
                className={`min-w-0 break-words text-xs font-semibold leading-5 ${
                  value === '누락' ? 'text-rose-700 dark:text-rose-300' : ''
                }`}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function DocumentTree() {
  const relations = [
    ['section-3', '포함', 'paragraph-18'],
    ['table-7a', '계속', 'table-7b'],
    ['caption-4', '설명', 'figure-4'],
  ];
  return (
    <div className="min-w-0">
      <SectionTitle icon={GitBranch} eyebrow="Artifact 02" title="Page 47과 48 사이의 의미 관계" />
      <div className="mt-6 grid min-w-0 gap-3">
        {relations.map(([from, relation, to], index) => (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -8 }}
            transition={{ delay: index * 0.08 }}
            className="grid min-w-0 grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] items-center gap-2"
            key={from}
          >
            <span className="min-w-0 border border-border bg-background px-3 py-3 font-mono text-xs font-bold">
              {from}
            </span>
            <span className="text-center text-xs font-black text-teal-700 dark:text-teal-300">{relation}</span>
            <span className="min-w-0 border border-border bg-background px-3 py-3 font-mono text-xs font-bold">
              {to}
            </span>
          </motion.div>
        ))}
      </div>
      <p className="mt-5 border-l-2 border-teal-600 pl-3 text-xs leading-5 text-muted-foreground">
        Reading order는 page 안의 순서다. “표가 다음 page에서 계속된다”는 별도의 document relation이다.
      </p>
    </div>
  );
}

function VerifiedGrid({ scenario }: { scenario: ReleaseScenario }) {
  const mismatch = scenario === 'tableMismatch';
  const subtotal = 42;
  const tax = 5;
  const total = mismatch ? 48 : 47;
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(16rem,0.82fr)_minmax(0,1fr)] lg:items-center">
      <div className="min-w-0">
        <SectionTitle icon={Grid3X3} eyebrow="Artifact 03" title="표 점유 격자" />
        <div className="mt-4 grid grid-cols-3 border border-border bg-background">
          {['항목', '값', '검산', 'Subtotal', String(subtotal), '입력', 'Tax', String(tax), '입력', 'Total', String(total), mismatch ? '42 + 5 ≠ 48' : '42 + 5 = 47'].map(
            (cell, index) => {
              const failed = mismatch && index >= 9;
              return (
                <span
                  className={`min-w-0 px-2 py-3 text-center text-xs ${
                    index < 3 ? 'font-black' : ''
                  } ${index % 3 ? 'border-l border-border' : ''} ${
                    index >= 3 ? 'border-t border-border' : ''
                  } ${failed ? 'bg-rose-500/[0.06] text-rose-700 dark:text-rose-300' : ''}`}
                  key={`${cell}-${index}`}
                >
                  {cell}
                </span>
              );
            },
          )}
        </div>
      </div>
      <div className="min-w-0">
        <SectionTitle
          icon={mismatch ? TriangleAlert : Check}
          eyebrow="업무 규칙"
          title={mismatch ? '문자는 맞지만 관계가 틀렸다' : '구조와 합계가 함께 통과했다'}
        />
        <div className="mt-4 space-y-3">
          {[
            ['slot collision', true],
            ['header lineage', true],
            ['subtotal + tax = total', !mismatch],
          ].map(([label, pass]) => (
            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border pb-3" key={String(label)}>
              <span className="text-xs font-bold">{label}</span>
              {pass ? (
                <Check className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-label="통과" />
              ) : (
                <X className="h-4 w-4 shrink-0 text-rose-700 dark:text-rose-300" aria-label="실패" />
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          OCR exact match만으로는 이 실패를 찾을 수 없다. Cell의 관계와 업무 제약을 실행해야 한다.
        </p>
      </div>
    </div>
  );
}

function RagNode({ scenario }: { scenario: ReleaseScenario }) {
  const missing = scenario === 'missingSource';
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.72fr)]">
      <div className="min-w-0">
        <SectionTitle icon={Search} eyebrow="Artifact 04" title="검색 가능한 지식 node" />
        <div className="mt-4 border border-border bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">heading path</p>
          <p className="mt-1 text-sm font-black">연구 보고서 / 실행 결과 / 문서 구조 평가</p>
          <p className="mt-4 text-xs font-bold text-muted-foreground">chunk</p>
          <p className="mt-1 text-xs leading-5">
            Page parser는 원문 위치를 잃지 않은 구조 블록을 만든다.
          </p>
        </div>
      </div>
      <div className="min-w-0">
        <SectionTitle
          icon={missing ? TriangleAlert : GitBranch}
          eyebrow="Citation path"
          title={missing ? 'Chunk에서 원문으로 갈 수 없다' : 'Chunk에서 원본 crop까지 이어진다'}
        />
        <div className="mt-4 space-y-2">
          {(missing
            ? ['rag-node-28', 'block b-01', 'source span: 누락']
            : ['rag-node-28', 'block b-01', 'page 47 · bbox', 'crop://page-47/b-01']
          ).map((value, index) => (
            <div
              className={`flex min-h-11 items-center border px-3 text-xs font-bold ${
                missing && index === 2
                  ? 'border-rose-600/45 bg-rose-500/[0.05] text-rose-700 dark:text-rose-300'
                  : 'border-border bg-background'
              }`}
              key={value}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReleaseDecision({ scenario }: { scenario: ReleaseScenario }) {
  const current = scenarios[scenario];
  const verdict = getVerdict(current);
  const verdictLabel = verdict === 'release' ? '공개' : verdict === 'review' ? '검토' : '차단';
  const tone =
    verdict === 'release'
      ? 'border-emerald-600/50 bg-emerald-500/[0.05] text-emerald-800 dark:text-emerald-300'
      : verdict === 'review'
        ? 'border-amber-600/50 bg-amber-500/[0.06] text-amber-900 dark:text-amber-300'
        : 'border-rose-600/50 bg-rose-500/[0.05] text-rose-800 dark:text-rose-300';
  return (
    <div className="min-w-0">
      <SectionTitle icon={ShieldCheck} eyebrow="Artifact 05" title="Fail-closed release gate" />
      <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {gateLabels.map((label, index) => {
          const pass = current.checks[index];
          return (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 6 }}
              transition={{ delay: index * 0.07 }}
              className={`min-w-0 border p-4 ${
                pass
                  ? 'border-emerald-600/35 bg-emerald-500/[0.04]'
                  : 'border-rose-600/45 bg-rose-500/[0.05]'
              }`}
              key={label}
            >
              {pass ? (
                <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
              ) : (
                <TriangleAlert className="h-4 w-4 text-rose-700 dark:text-rose-300" aria-hidden="true" />
              )}
              <p className="mt-4 text-sm font-black">{label}</p>
              <p className="mt-2 text-xs font-semibold text-muted-foreground">{pass ? '통과' : '실패'}</p>
            </motion.div>
          );
        })}
      </div>
      <div className={`mt-5 border-l-4 px-4 py-4 ${tone}`}>
        <div className="flex min-w-0 items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase">최종 판정</p>
          <span className="font-mono text-base font-black">{verdictLabel}</span>
        </div>
        <p className="mt-3 text-xs font-semibold leading-5">{current.message}</p>
      </div>
    </div>
  );
}

function ReleaseScene({
  step,
  scenario,
  onScenarioChange,
}: {
  step: number;
  scenario: ReleaseScenario;
  onScenarioChange: (next: ReleaseScenario) => void;
}) {
  return (
    <div className="w-full min-w-0">
      <ScenarioControl onChange={onScenarioChange} selected={scenario} />
      <div data-ocr-release-lab data-scenario={scenario} data-step={step}>
        {step === 0 ? <ProvenancePacket scenario={scenario} /> : null}
        {step === 1 ? <DocumentTree /> : null}
        {step === 2 ? <VerifiedGrid scenario={scenario} /> : null}
        {step === 3 ? <RagNode scenario={scenario} /> : null}
        {step === 4 ? <ReleaseDecision scenario={scenario} /> : null}
      </div>
    </div>
  );
}

export default function OCRReleaseGateViz() {
  const [scenario, setScenario] = useState<ReleaseScenario>('tableMismatch');
  return (
    <div data-controlled-viz>
      <StepViz steps={[...steps]} stageClassName="!items-stretch bg-[hsl(var(--muted)/0.08)]">
        {(step) => (
          <ReleaseScene
            onScenarioChange={setScenario}
            scenario={scenario}
            step={step}
          />
        )}
      </StepViz>
    </div>
  );
}
