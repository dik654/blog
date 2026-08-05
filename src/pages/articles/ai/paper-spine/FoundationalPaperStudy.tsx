import { useState } from 'react';
import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, Misconception, QuestionLead, SourceNotes, SpecialistEntry } from '@/components/learning/ArticleLearning';
import type { SpecialistEntryProps } from '@/components/learning/ArticleLearning';
import { NlpSection, SegmentedControl, Takeaway } from '../nlp-shared';
import { articlePath } from '@/lib/paths';

export interface PaperEvidence {
  label: string;
  question: string;
  intervention: string;
  observation: string;
  supports: string;
  limit: string;
}

export interface PaperStudySpec {
  documentKind?: string;
  shortTitle: string;
  citation: string;
  yearVenue: string;
  sourceUrl: string;
  appendixUrl?: string;
  appendixLabel?: string;
  appendixNote?: string;
  additionalSources?: Array<{ label: string; href: string; note: string }>;
  before: string;
  authorIntent: string;
  thesis: string;
  specialistEntry?: SpecialistEntryProps;
  readerBridge?: Array<{ term: string; latex?: string; plain: string; role: string }>;
  reconstruction: Array<{ label: string; value?: string; latex?: string; note: string }>;
  mechanism: string[];
  equations: Array<{
    latex: string;
    latexCompact?: string;
    provenance?: string;
    meaning: string;
    symbols: Array<[string, string]>;
  }>;
  mechanismViz?: ComponentType;
  evidence: PaperEvidence[];
  workedTransfer?: {
    title: string;
    setup: string;
    steps: Array<{ label: string; reasoning: string; result: string }>;
    decision: string;
    boundary: string;
  };
  implementation: string[];
  assumptions: string[];
  failures: string[];
  legacy: string;
  nextReading: string;
  nextLinks?: Array<{ slug: string; label: string; reason: string }>;
  capabilities: string[];
}

function WorkedTransfer({ transfer }: { transfer: NonNullable<PaperStudySpec['workedTransfer']> }) {
  return (
    <div className="not-prose my-8 min-w-0 border-y border-border">
      <div className="grid min-w-0 gap-2 border-b border-border py-4 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-5">
        <p className="font-mono text-xs font-black uppercase text-blue-700 dark:text-blue-300">낯선 상황에 전이</p>
        <div className="min-w-0">
          <h3 className="text-base font-black leading-snug">{transfer.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{transfer.setup}</p>
        </div>
      </div>
      <ol className="divide-y divide-border">
        {transfer.steps.map((step, index) => (
          <li key={`${step.label}-${index}`} className="grid min-w-0 gap-2 py-4 md:grid-cols-[3rem_8rem_minmax(0,1fr)] md:gap-4">
            <span className="font-mono text-xs font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
            <strong className="text-sm leading-relaxed">{step.label}</strong>
            <div className="min-w-0">
              <p className="text-sm leading-relaxed">{step.reasoning}</p>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-blue-800 dark:text-blue-200">판정: {step.result}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="grid min-w-0 gap-px border-t border-border bg-border md:grid-cols-2">
        <div className="min-w-0 bg-emerald-500/[0.035] p-4">
          <p className="text-xs font-black text-muted-foreground">이 글로 내릴 수 있는 결정</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed">{transfer.decision}</p>
        </div>
        <div className="min-w-0 bg-amber-500/[0.035] p-4">
          <p className="text-xs font-black text-muted-foreground">여기서 멈춰야 하는 경계</p>
          <p className="mt-2 text-sm leading-relaxed">{transfer.boundary}</p>
        </div>
      </div>
    </div>
  );
}

function ReaderBridge({ items }: { items: NonNullable<PaperStudySpec['readerBridge']> }) {
  return (
    <div className="not-prose my-6 border-y border-border py-4">
      <p className="mb-3 text-xs font-bold text-muted-foreground">전문 용어를 만나기 전 잡을 네 가지</p>
      <dl className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        {items.map((item, index) => (
          <div key={item.term} className="min-w-0 bg-background p-4">
            <div className="flex items-start gap-3">
              <span className="font-mono text-xs font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <dt className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold">
                  <span>{item.term}</span>
                  {item.latex && <MathFormula>{item.latex}</MathFormula>}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed">{item.plain}</dd>
                <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">이 글에서의 역할: {item.role}</dd>
              </div>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PaperReconstruction({ items }: { items: PaperStudySpec['reconstruction'] }) {
  return (
    <ol className="not-prose my-6 grid min-w-0 gap-3 md:grid-cols-2">
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] gap-3 rounded-md border border-blue-600/20 bg-blue-500/[0.025] p-4">
          <span className="font-mono text-lg font-black text-blue-700/55 dark:text-blue-300/60">{String(index + 1).padStart(2, '0')}</span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-muted-foreground">{item.label}</p>
            {item.latex ? (
              <div className="mt-2 min-w-0 break-words font-mono text-sm font-bold leading-relaxed [overflow-wrap:anywhere]">
                <MathFormula>{item.latex}</MathFormula>
              </div>
            ) : item.value ? (
              <p className="mt-2 break-words font-mono text-sm font-bold leading-relaxed">{item.value}</p>
            ) : null}
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function EvidenceInspector({ evidence }: { evidence: PaperEvidence[] }) {
  const [selected, setSelected] = useState(evidence[0].label);
  const item = evidence.find((entry) => entry.label === selected) ?? evidence[0];
  return (
    <div className="foundation-viz-explorer not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      {evidence.length > 1 && <SegmentedControl label="Paper evidence slice" options={evidence.map((entry) => ({ value: entry.label, label: entry.label }))} value={selected} onChange={setSelected} />}
      <div className={`${evidence.length > 1 ? 'mt-5 ' : ''}grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-2`}>
        <div className="bg-background p-4"><p className="text-xs font-bold text-muted-foreground">검증 질문</p><p className="mt-2 text-sm font-semibold leading-relaxed">{item.question}</p></div>
        <div className="bg-blue-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">개입·비교</p><p className="mt-2 text-sm leading-relaxed">{item.intervention}</p></div>
        <div className="bg-emerald-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">관찰</p><p className="mt-2 text-sm leading-relaxed">{item.observation}</p></div>
        <div className="bg-amber-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">증거의 경계</p><p className="mt-2 text-sm leading-relaxed"><strong>지지:</strong> {item.supports}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">입증하지 않음:</strong> {item.limit}</p></div>
      </div>
    </div>
  );
}

function OrderedLedger({ title, items, tone }: { title: string; items: string[]; tone: 'blue' | 'amber' | 'green' }) {
  const classes = { blue: 'border-blue-500/30 bg-blue-500/[0.035]', amber: 'border-amber-500/30 bg-amber-500/[0.035]', green: 'border-emerald-500/30 bg-emerald-500/[0.035]' }[tone];
  return <div className="not-prose my-6"><p className="mb-3 text-xs font-bold text-muted-foreground">{title}</p><ol className="grid gap-2">{items.map((item, index) => <li key={item} className={`grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-md border p-3 ${classes}`}><span className="font-mono text-xs font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span><span className="text-sm leading-relaxed">{item}</span></li>)}</ol></div>;
}

export default function FoundationalPaperStudy({ spec }: { spec: PaperStudySpec }) {
  const documentKind = spec.documentKind ?? '논문';
  return (
    <>
      <NlpSection id="context" marker="01" tone="teal" question={`${spec.yearVenue} · ${documentKind} 등장 전의 병목에서 시작한다`} title={`${spec.shortTitle}: ${documentKind}의 질문을 복원한다`}>
        {spec.specialistEntry && <SpecialistEntry {...spec.specialistEntry} />}
        <QuestionLead question={`저자는 ${documentKind}에서 어떤 문제를 풀려 했는가?`} answer={spec.authorIntent} />
        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2"><div className="rounded-md border border-amber-500/30 bg-amber-500/[0.04] p-4"><p className="text-xs font-bold text-muted-foreground">이전 기준선</p><p className="mt-2 text-sm leading-relaxed">{spec.before}</p></div><div className="rounded-md border border-teal-500/30 bg-teal-500/[0.04] p-4"><p className="text-xs font-bold text-muted-foreground">검증하려는 명제</p><p className="mt-2 text-sm font-semibold leading-relaxed">{spec.thesis}</p></div></div>
        <p className="text-sm text-muted-foreground">{spec.citation}</p>
      </NlpSection>

      <NlpSection id="claim" marker="02" tone="blue" question={`${documentKind}의 핵심 문장을 실행 가능한 data flow로 바꾼다`} title="주장을 architecture와 계산 순서로 재구성한다">
        {spec.readerBridge && <ReaderBridge items={spec.readerBridge} />}
        <PaperReconstruction items={spec.reconstruction} />
        <OrderedLedger title="메커니즘을 구현 순서로 읽기" items={spec.mechanism} tone="blue" />
      </NlpSection>

      <NlpSection id="mechanism" marker="03" tone="violet" question="수식을 이름이 아니라 변수와 상태가 실제로 수행하는 연산으로 읽는다" title="핵심 수식과 구현 의미">
        {spec.equations.map((equation) => (
          <div key={equation.latex} className="mb-8">
            <div className="not-prose min-w-0 rounded-md border border-border p-3 sm:p-4">
              <p className="mb-3 text-xs font-black uppercase text-muted-foreground">
                수식 출처 · {equation.provenance ?? '원문 기반 재구성 · 설명을 위해 표기를 정리'}
              </p>
              {equation.latexCompact ? (
                <>
                  <MathFormula display className="my-0 text-[13px] lg:hidden">{equation.latexCompact}</MathFormula>
                  <MathFormula display className="my-0 hidden text-base lg:block">{equation.latex}</MathFormula>
                </>
              ) : (
                <MathFormula display className="my-0 text-[13px] sm:text-base">{equation.latex}</MathFormula>
              )}
            </div>
            <FormulaNote meaning={equation.meaning} symbols={equation.symbols} />
          </div>
        ))}
        {spec.mechanismViz && <spec.mechanismViz />}
      </NlpSection>

      <NlpSection id="evidence" marker="04" tone="amber" question="결과 숫자보다 어떤 비교·시험·사례가 어느 주장을 지지하는지 확인한다" title="표·그림·시험·비교 사례의 증거 범위를 분리한다">
        <EvidenceInspector evidence={spec.evidence} />
        <Misconception>수식의 유도, theorem, simulation, hardware demo와 benchmark는 서로 다른 종류의 증거다. 한 종류가 통과했다고 model error, numerical conditioning, runtime deadline과 deployment safety까지 함께 입증되는 것은 아니다.</Misconception>
      </NlpSection>

      <NlpSection id="reproduction" marker="05" tone="green" question="논문을 읽은 뒤 최소 구현과 실패 진단까지 내려간다" title="재현 체크리스트와 숨은 가정">
        {spec.workedTransfer && <WorkedTransfer transfer={spec.workedTransfer} />}
        <OrderedLedger title="최소 재현 순서" items={spec.implementation} tone="green" />
        <div className="not-prose my-6 grid gap-3 lg:grid-cols-2"><div className="rounded-md border border-border p-4"><p className="text-xs font-bold text-muted-foreground">성립 가정</p><ul className="mt-3 space-y-2">{spec.assumptions.map((item) => <li key={item} className="text-sm leading-relaxed">• {item}</li>)}</ul></div><div className="rounded-md border border-amber-500/30 bg-amber-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">실패·누락 가능성</p><ul className="mt-3 space-y-2">{spec.failures.map((item) => <li key={item} className="text-sm leading-relaxed">• {item}</li>)}</ul></div></div>
      </NlpSection>

      <NlpSection id="legacy" marker="06" tone="teal" question="현재 교과서의 정답으로 보지 않고 다음 논문이 바꾼 지점을 연결한다" title="무엇이 남았고 무엇이 교체되었는가">
        <p>{spec.legacy}</p>
        <Takeaway>{spec.nextReading}</Takeaway>
        {spec.nextLinks && spec.nextLinks.length > 0 && (
          <nav className="not-prose my-6 divide-y divide-border border-y border-border" aria-label="이 보고서에서 내려갈 다음 글">
            {spec.nextLinks.map((item, index) => (
              <Link key={item.slug} to={articlePath('ai', item.slug)} className="group grid min-w-0 gap-2 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
                <span className="font-mono text-xs font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                <span className="min-w-0"><strong className="block text-sm">{item.label}</strong><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.reason}</span></span>
                <ArrowRight aria-hidden className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
              </Link>
            ))}
          </nav>
        )}
        <CapabilityCheck items={spec.capabilities} />
        <SourceNotes sources={[
          { label: spec.citation, href: spec.sourceUrl, note: '본문, 수식, 표, 그림의 1차 출처다.' },
          ...(spec.appendixUrl ? [{
            label: spec.appendixLabel ?? '보조 자료·원문 mirror',
            href: spec.appendixUrl,
            note: spec.appendixNote ?? '원문의 추가 형식이나 출판본을 교차 확인한다.',
          }] : []),
          ...(spec.additionalSources ?? []),
        ]} />
      </NlpSection>
    </>
  );
}
