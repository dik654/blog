import { Fragment } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Blocks,
  Braces,
  Check,
  Crop,
  FileImage,
  FileOutput,
  GitBranch,
  ScanLine,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

const ACCENTS = {
  source: '#2563eb',
  layout: '#0f766e',
  crop: '#a16207',
  model: '#7c3aed',
  packet: '#047857',
  boundary: '#be123c',
} as const;

const steps = [
  {
    label: '먼저 모델 밖의 입력 상태를 고정한다.',
    body: '같은 PDF도 render DPI, 회전, crop과 text layer에 따라 다른 이미지가 된다. 원본 hash와 변환 기록을 page packet의 시작점으로 남긴다.',
  },
  {
    label: 'Layout model은 위치와 읽는 순서를 만든다.',
    body: 'PP-DocLayoutV2가 text·table·formula 영역을 찾고 pointer network가 순서를 정한다. 여기서 빠진 요소는 뒤 VLM이 복구할 수 없다.',
  },
  {
    label: '좌표를 보존한 채 요소별 crop으로 나눈다.',
    body: 'Page 전체를 막연히 읽히지 않고 각 영역을 독립 요청으로 만든다. Crop에는 원래 page와 bbox를 연결하는 identity가 따라가야 한다.',
  },
  {
    label: '0.9B VLM은 crop의 내용과 구조를 읽는다.',
    body: 'NaViT-style visual encoder가 해상도가 다른 crop을 표현하고 ERNIE side가 text·HTML·LaTeX를 생성한다. Layout 탐지는 이 단계의 책임이 아니다.',
  },
  {
    label: '사람용 Markdown과 검증용 typed block을 함께 만든다.',
    body: '출력 형식만 예쁘게 만드는 것이 아니라 block id, bbox, class, reading order와 parser revision을 같은 artifact에 묶는다.',
  },
  {
    label: 'Page parser의 경계에서 멈추고 document assembler로 넘긴다.',
    body: '한 page가 검증돼도 다음 page의 표·문단·caption 관계는 아직 모른다. Page packet과 cross-page relation을 서로 다른 책임으로 유지한다.',
  },
] as const;

const crops = [
  { id: 'b-01', type: '본문', value: '2026 연구 보고서', color: ACCENTS.source },
  { id: 'b-02', type: '표', value: '분기 · 매출 · 합계', color: ACCENTS.layout },
  { id: 'b-03', type: '수식', value: 'E = mc²', color: ACCENTS.model },
] as const;

function FlowArrow() {
  return (
    <div className="flex min-h-8 shrink-0 items-center justify-center text-muted-foreground" aria-hidden="true">
      <ArrowDown className="h-4 w-4 lg:hidden" />
      <ArrowRight className="hidden h-4 w-4 lg:block" />
    </div>
  );
}

function StageTitle({
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

function SourcePage({ annotated = false }: { annotated?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[19rem] border border-border bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-muted-foreground">연구 보고서 · 47쪽</p>
          <p className="mt-1 text-base font-black">문서 구조 평가</p>
        </div>
        <FileImage className="h-5 w-5 text-blue-700 dark:text-blue-300" aria-hidden="true" />
      </div>
      <div className="relative mt-5 space-y-4">
        <div
          className={`relative border-l-2 pl-3 ${annotated ? 'border-blue-600 bg-blue-500/[0.05] py-2 pr-2' : 'border-border'}`}
        >
          {annotated ? (
            <span className="absolute -right-1 -top-3 rounded-sm bg-blue-700 px-1.5 py-0.5 font-mono text-xs font-bold text-white">
              01 · text
            </span>
          ) : null}
          <p className="text-xs font-bold">1. 실행 결과</p>
          <p className="mt-1 text-xs leading-5 text-foreground/75">
            Page parser는 원문 위치를 잃지 않은 구조 블록을 만든다.
          </p>
        </div>
        <div
          className={`relative grid grid-cols-3 border ${annotated ? 'border-teal-600 bg-teal-500/[0.05]' : 'border-border'}`}
        >
          {annotated ? (
            <span className="absolute -right-1 -top-3 rounded-sm bg-teal-700 px-1.5 py-0.5 font-mono text-xs font-bold text-white">
              02 · table
            </span>
          ) : null}
          {['분기', '매출', '합계', 'Q1', '42', '42'].map((cell, index) => (
            <span
              className={`px-2 py-2 text-center text-xs ${
                index < 3 ? 'font-bold' : ''
              } ${index % 3 ? 'border-l border-border' : ''} ${
                index >= 3 ? 'border-t border-border' : ''
              }`}
              key={`${cell}-${index}`}
            >
              {cell}
            </span>
          ))}
        </div>
        <div
          className={`relative px-3 py-2 font-serif text-sm ${annotated ? 'border border-violet-600 bg-violet-500/[0.05]' : 'border border-border'}`}
        >
          {annotated ? (
            <span className="absolute -right-1 -top-3 rounded-sm bg-violet-700 px-1.5 py-0.5 font-mono text-xs font-bold text-white">
              03 · formula
            </span>
          ) : null}
          E = mc²
        </div>
      </div>
    </div>
  );
}

function InputAudit() {
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(15rem,0.82fr)_minmax(0,1fr)] lg:items-center">
      <SourcePage />
      <div className="min-w-0">
        <StageTitle icon={FileImage} eyebrow="입력 계약" title="모델 호출 전에 page가 어떻게 만들어졌는지 기록한다" />
        <dl className="mt-4 divide-y divide-border border-y border-border">
          {[
            ['source', 'report-2026.pdf · sha256: 8f2…'],
            ['render', '200 DPI · page 47 · rotation 0°'],
            ['condition', 'born-digital + embedded figure'],
            ['trace', 'page-47 / parser-run-1042'],
          ].map(([term, value]) => (
            <div className="grid min-w-0 gap-1 py-3 sm:grid-cols-[5rem_minmax(0,1fr)]" key={term}>
              <dt className="font-mono text-xs font-bold text-muted-foreground">{term}</dt>
              <dd className="min-w-0 break-words text-xs font-semibold leading-5">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function LayoutAnalysis() {
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(15rem,0.82fr)_minmax(0,1fr)] lg:items-center">
      <SourcePage annotated />
      <div className="min-w-0">
        <StageTitle icon={ScanLine} eyebrow="PP-DocLayoutV2" title="영역 검출과 reading order가 뒤 단계의 시야를 결정한다" />
        <div className="mt-4 space-y-3">
          {[
            ['01', 'text', '본문 bbox와 첫 읽기 순서'],
            ['02', 'table', '6개 cell이 있는 표 영역'],
            ['03', 'formula', '독립 수식 영역'],
          ].map(([order, type, detail], index) => (
            <motion.div
              animate={{ x: 0, opacity: 1 }}
              initial={{ x: 8, opacity: 0 }}
              transition={{ delay: index * 0.08 }}
              className="grid min-w-0 grid-cols-[2.25rem_4.5rem_minmax(0,1fr)] items-center gap-3 border-b border-border pb-3"
              key={order}
            >
              <span className="font-mono text-sm font-black">{order}</span>
              <span className="text-xs font-bold">{type}</span>
              <span className="min-w-0 text-xs leading-5 text-muted-foreground">{detail}</span>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 border-l-2 border-rose-600 pl-3 text-xs font-semibold leading-5 text-rose-700 dark:text-rose-300">
          검출되지 않은 각주는 다음 VLM 단계의 입력 자체에 존재하지 않는다.
        </p>
      </div>
    </div>
  );
}

function CropQueue() {
  return (
    <div className="min-w-0">
      <StageTitle icon={Crop} eyebrow="좌표 보존 분할" title="큰 page를 작은 crop으로 나누되 출처 identity는 끊지 않는다" />
      <div className="mt-6 grid min-w-0 gap-3 md:grid-cols-3">
        {crops.map((crop, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ delay: index * 0.1 }}
            className="relative min-w-0 overflow-hidden border border-border bg-background p-4"
            key={crop.id}
          >
            <div className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: crop.color }} />
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs font-black">{crop.id}</span>
              <span className="text-xs font-bold text-muted-foreground">{crop.type}</span>
            </div>
            <p className="mt-6 min-h-12 text-sm font-bold leading-6">{crop.value}</p>
            <p className="mt-4 border-t border-border pt-3 font-mono text-xs leading-5 text-muted-foreground">
              page 47 · bbox [{18 + index * 7}, {12 + index * 19}, {91 - index * 5}, {29 + index * 22}]
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <span className="w-fit rounded-sm bg-amber-700 px-2 py-1 text-xs font-bold text-white">불변식</span>
        <p className="text-xs font-semibold leading-5">
          Crop을 다시 보더라도 항상 원본 page와 정확한 bbox로 돌아갈 수 있어야 한다.
        </p>
      </div>
    </div>
  );
}

function RecognitionFlow() {
  const nodes = [
    { label: 'Ordered crops', detail: 'text · table · formula', icon: Crop, color: ACCENTS.crop },
    { label: 'NaViT encoder', detail: 'crop별 동적 해상도', icon: Blocks, color: ACCENTS.model },
    { label: 'ERNIE side', detail: '내용·구조 token 생성', icon: Braces, color: ACCENTS.source },
    { label: 'Element output', detail: 'text · HTML · LaTeX', icon: FileOutput, color: ACCENTS.packet },
  ] as const;
  return (
    <div className="min-w-0">
      <StageTitle icon={Blocks} eyebrow="0.9B element recognizer" title="Layout을 다시 찾지 않고 받은 crop의 내용과 구조를 생성한다" />
      <div className="mt-7 grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-stretch">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <Fragment key={node.label}>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 6 }}
                transition={{ delay: index * 0.08 }}
                className="min-w-0 border border-border bg-background p-4"
              >
                <Icon className="h-5 w-5" style={{ color: node.color }} aria-hidden="true" />
                <p className="mt-5 text-sm font-black leading-5">{node.label}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{node.detail}</p>
              </motion.div>
              {index < nodes.length - 1 ? <FlowArrow /> : null}
            </Fragment>
          );
        })}
      </div>
      <p className="mt-5 border-l-2 border-violet-600 pl-3 text-xs leading-5 text-muted-foreground">
        “0.9B가 page 전체 관계를 이해했다”가 아니라 “layout model이 지정한 요소를 특화 VLM이 읽었다”가 정확한 실행 설명이다.
      </p>
    </div>
  );
}

function TypedPacket() {
  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.72fr)]">
      <div className="min-w-0">
        <StageTitle icon={FileOutput} eyebrow="사람용 보기" title="Reading order를 반영한 Markdown" />
        <div className="mt-4 border border-border bg-background p-4">
          <p className="text-sm font-black"># 문서 구조 평가</p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Page parser는 원문 위치를 잃지 않은 구조 블록을 만든다.
          </p>
          <div className="mt-4 border-y border-border py-3 font-mono text-xs leading-6">
            | 분기 | 매출 | 합계 |
            <br />| Q1 | 42 | 42 |
          </div>
          <p className="mt-3 font-serif text-sm">E = mc²</p>
        </div>
      </div>
      <div className="min-w-0">
        <StageTitle icon={Braces} eyebrow="기계용 증거" title="Typed page block" />
        <div className="mt-4 divide-y divide-border border-y border-border">
          {crops.map((crop, index) => (
            <div className="grid min-w-0 gap-2 py-3 sm:grid-cols-[3rem_5rem_minmax(0,1fr)]" key={crop.id}>
              <span className="font-mono text-xs font-black">{crop.id}</span>
              <span className="text-xs font-bold">{crop.type}</span>
              <span className="min-w-0 text-xs leading-5 text-muted-foreground">
                order {index + 1} · bbox 보존 · parser 1.6
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 text-xs font-semibold leading-5 text-emerald-700 dark:text-emerald-300">
          <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Markdown을 고쳐도 원문 좌표와 parser revision이 남는다.
        </div>
      </div>
    </div>
  );
}

function BoundaryHandoff() {
  return (
    <div className="min-w-0">
      <StageTitle icon={GitBranch} eyebrow="책임 경계" title="Page 안의 사실과 page 사이의 관계를 다른 artifact로 둔다" />
      <div className="mt-6 grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-stretch">
        <div className="min-w-0 border border-emerald-600/45 bg-emerald-500/[0.04] p-4">
          <p className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300">Verified page packet</p>
          <p className="mt-2 text-base font-black">Page 47</p>
          <ul className="mt-4 space-y-2 text-xs leading-5 text-muted-foreground">
            <li>3 typed blocks · reading order 확정</li>
            <li>각 block의 bbox와 source crop 보존</li>
            <li>parser revision과 render 설정 보존</li>
          </ul>
        </div>
        <FlowArrow />
        <div className="min-w-0 border border-rose-600/45 bg-rose-500/[0.04] p-4">
          <p className="text-xs font-bold uppercase text-rose-800 dark:text-rose-300">Document assembler</p>
          <p className="mt-2 text-base font-black">Page 47 ↔ 48</p>
          <ul className="mt-4 space-y-2 text-xs leading-5 text-muted-foreground">
            <li>47쪽 표가 48쪽에서 계속되는가?</li>
            <li>그림 caption이 어느 figure를 설명하는가?</li>
            <li>다음 heading 전까지 어떤 문단이 포함되는가?</li>
          </ul>
        </div>
      </div>
      <p className="mt-5 border-l-2 border-rose-600 pl-3 text-xs font-semibold leading-5">
        Page benchmark가 높아도 오른쪽 질문은 아직 답하지 않았다. 이것이 document assembly를 별도 단계로 두는 이유다.
      </p>
    </div>
  );
}

function ParserScene({ step }: { step: number }) {
  return (
    <div className="w-full min-w-0" data-paddle-page-parser data-step={step}>
      {step === 0 ? <InputAudit /> : null}
      {step === 1 ? <LayoutAnalysis /> : null}
      {step === 2 ? <CropQueue /> : null}
      {step === 3 ? <RecognitionFlow /> : null}
      {step === 4 ? <TypedPacket /> : null}
      {step === 5 ? <BoundaryHandoff /> : null}
    </div>
  );
}

export default function PaddlePageParserViz() {
  return (
    <StepViz steps={[...steps]} stageClassName="!items-stretch bg-[hsl(var(--muted)/0.08)]">
      {(step) => <ParserScene step={step} />}
    </StepViz>
  );
}
