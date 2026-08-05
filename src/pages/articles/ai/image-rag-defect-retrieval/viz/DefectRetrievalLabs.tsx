import { useMemo, useState, type ComponentType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  Camera,
  Database,
  FileCheck2,
  Filter,
  ScanLine,
  Search,
  SlidersHorizontal,
  TriangleAlert,
} from 'lucide-react';

type Stage = {
  label: string;
  short: string;
  title: string;
  body: string;
  artifact: string;
  check: string;
  icon: ComponentType<{ className?: string }>;
};

const stages: Stage[] = [
  {
    label: '01 입력',
    short: '촬영',
    title: '새 결함을 질문으로 고정한다',
    body: '“무엇과 닮았나?”보다 “같은 원인과 조치를 가진 과거 사례가 있나?”를 먼저 정한다.',
    artifact: 'query Q-204 · 미세 선형 흔적',
    check: '카메라, 배율, 조명, 공정 단계를 함께 기록',
    icon: Camera,
  },
  {
    label: '02 좌표',
    short: '전처리',
    title: '과거와 같은 규칙으로 벡터를 만든다',
    body: 'ROI crop, resize, normalization, encoder checkpoint가 index와 같아야 거리의 의미가 유지된다.',
    artifact: 'clip-b16@r18 · roi-v3 · unit norm',
    check: '다른 version의 벡터를 같은 partition에 섞지 않음',
    icon: ScanLine,
  },
  {
    label: '03 검색',
    short: 'Top-K',
    title: '점수가 높은 후보를 넓게 가져온다',
    body: '이 단계의 score는 시각적 가까움이다. 아직 같은 원인이나 같은 조치라는 보장은 없다.',
    artifact: '1,842개 중 상위 10개 후보',
    check: '정확 검색을 baseline으로 고정한 뒤 ANN을 비교',
    icon: Search,
  },
  {
    label: '04 재정렬',
    short: '맥락',
    title: '공정 조건과 원인 확정 여부를 대조한다',
    body: '시각 score와 별도로 공정, 장비, 촬영 조건, root-cause 확정 여부를 보며 false neighbor를 내린다.',
    artifact: '동일 공정 · 동일 장비 · 원인 확정',
    check: '서로 다른 encoder의 raw score를 직접 평균하지 않음',
    icon: Filter,
  },
  {
    label: '05 근거',
    short: '판정',
    title: '이미지가 아니라 추적 가능한 근거 묶음을 반환한다',
    body: '원본 crop, source ID, 유사도, 공정 맥락, 원인과 과거 조치를 한 묶음으로 보여준다.',
    artifact: 'C-118 · 세정 노즐 오염 · 조치 이력 있음',
    check: '판정자가 원본과 version을 다시 열 수 있음',
    icon: FileCheck2,
  },
];

type DefectTileProps = {
  kind: 'scratch' | 'stain' | 'polish' | 'dust';
  label?: string;
  compact?: boolean;
};

function DefectTile({ kind, label, compact = false }: DefectTileProps) {
  return (
    <div className={`relative isolate overflow-hidden border border-border bg-[#d8dadd] dark:bg-[#393c41] ${compact ? 'h-12 w-12 shrink-0 rounded' : 'aspect-square w-full rounded-md'}`}>
      <div className="absolute inset-[10%] rounded-sm border border-black/10 bg-[#eceeef] dark:bg-[#50545a]" />
      {kind === 'scratch' && (
        <>
          <span className="absolute left-[18%] top-[47%] h-[2px] w-[64%] rotate-[-13deg] bg-[#a44242] shadow-[0_1px_0_rgba(255,255,255,0.6)]" />
          <span className="absolute left-[34%] top-[57%] h-px w-[38%] rotate-[-7deg] bg-black/25" />
        </>
      )}
      {kind === 'stain' && (
        <>
          <span className="absolute left-[38%] top-[34%] h-[24%] w-[30%] rounded-full bg-[#8b623e]/70" />
          <span className="absolute left-[29%] top-[52%] h-[10%] w-[13%] rounded-full bg-[#8b623e]/45" />
        </>
      )}
      {kind === 'polish' && (
        <>
          <span className="absolute left-[18%] top-[34%] h-px w-[65%] rotate-[9deg] bg-white/80" />
          <span className="absolute left-[16%] top-[49%] h-px w-[68%] rotate-[9deg] bg-white/70" />
          <span className="absolute left-[20%] top-[64%] h-px w-[60%] rotate-[9deg] bg-white/60" />
        </>
      )}
      {kind === 'dust' && (
        <>
          {[
            ['29%', '33%', 4],
            ['58%', '39%', 3],
            ['43%', '61%', 5],
            ['69%', '68%', 3],
          ].map(([left, top, size]) => (
            <span
              key={`${left}-${top}`}
              className="absolute rounded-full bg-[#4e535a]/75"
              style={{ left, top, width: size, height: size }}
            />
          ))}
        </>
      )}
      {label && <span className="absolute bottom-1 left-1 rounded-sm bg-background/90 px-1.5 py-0.5 text-[10px] font-bold text-foreground">{label}</span>}
    </div>
  );
}

const candidateRows = [
  { id: 'C-118', kind: 'scratch' as const, score: 0.92, context: '동일 공정 · 원인 확정', verdict: '근거 채택' },
  { id: 'C-077', kind: 'polish' as const, score: 0.95, context: '다른 장비 · 연마 무늬', verdict: 'false neighbor' },
  { id: 'C-203', kind: 'scratch' as const, score: 0.88, context: '동일 장비 · 조치 확인', verdict: '보조 근거' },
];

export function DefectEvidenceFlowLab() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  const Icon = stage.icon;

  return (
    <figure data-defect-evidence-lab className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[11px] font-black uppercase text-muted-foreground">Evidence trace · 교육용 합성 사례</p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h3 className="text-base font-bold sm:text-lg">한 장의 결함 사진이 판정 근거가 되기까지</h3>
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">단계를 눌러 각 시점에 무엇이 확정되고, 무엇이 아직 가정인지 확인한다.</p>
        </div>
      </figcaption>

      <div className="grid grid-cols-5 gap-px bg-border" role="tablist" aria-label="검색 근거 생성 단계">
        {stages.map((item, index) => {
          const StageIcon = item.icon;
          const selected = index === active;
          return (
            <button
              key={item.label}
              type="button"
              role="tab"
              id={`defect-stage-tab-${index}`}
              aria-controls="defect-stage-panel"
              aria-label={`${item.label} ${item.short}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                let nextIndex = index;
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % stages.length;
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + stages.length) % stages.length;
                if (event.key === 'Home') nextIndex = 0;
                if (event.key === 'End') nextIndex = stages.length - 1;
                if (nextIndex === index) return;
                event.preventDefault();
                setActive(nextIndex);
                requestAnimationFrame(() => document.getElementById(`defect-stage-tab-${nextIndex}`)?.focus());
              }}
              className={`min-h-16 min-w-0 bg-background px-2 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground ${selected ? 'bg-foreground text-background' : 'hover:bg-muted/45'}`}
            >
              <span className="flex items-center gap-1">
                <StageIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[11px] font-black sm:hidden">{String(index + 1).padStart(2, '0')}</span>
                <span className="hidden text-[11px] font-black sm:inline">{item.label}</span>
              </span>
              <span className={`mt-1 block truncate text-xs ${selected ? 'text-background/70' : 'text-muted-foreground'}`}>{item.short}</span>
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 lg:grid-cols-[minmax(13rem,0.72fr)_minmax(0,1.28fr)]">
        <div className="border-b border-border p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <div className="mx-auto max-w-[15rem]">
            <DefectTile kind="scratch" label="QUERY Q-204" />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded border border-border bg-border text-xs">
            {[
              ['공정', '세정 후 검사'],
              ['장비', 'CAM-07'],
              ['질문', '같은 원인?'],
              ['상태', active < 4 ? '후보 검토 중' : '근거 확정'],
            ].map(([term, value]) => (
              <div key={term} className="min-w-0 bg-background p-3">
                <dt className="text-[11px] font-bold text-muted-foreground">{term}</dt>
                <dd className="mt-1 break-words font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              role="tabpanel"
              id="defect-stage-panel"
              aria-labelledby={`defect-stage-tab-${active}`}
              className="min-w-0 p-4 sm:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded border border-border bg-muted/35">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-muted-foreground">현재 단계 · {stage.label}</p>
                  <h4 className="mt-1 text-base font-bold leading-snug">{stage.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
                </div>
              </div>

              <div className="mt-5 divide-y divide-border border-y border-border">
                {candidateRows.map((candidate, index) => {
                  const resolved = active >= 3;
                  const rejected = candidate.verdict === 'false neighbor' && resolved;
                  return (
                    <div key={candidate.id} className={`flex min-w-0 items-center gap-3 py-3 ${rejected ? 'opacity-50' : ''}`}>
                      <DefectTile kind={candidate.kind} compact />
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="text-xs font-bold">{candidate.id}</span>
                          <span className="text-[11px] text-muted-foreground">시각 점수 {candidate.score.toFixed(2)}</span>
                        </div>
                        <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">{active < 3 ? '시각 후보 · 맥락 미검증' : candidate.context}</p>
                      </div>
                      <span className={`shrink-0 text-[11px] font-bold ${rejected ? 'text-rose-700 dark:text-rose-300' : resolved ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}`}>
                        {active < 3 ? `${index + 1}위` : candidate.verdict}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-2">
                <div className="min-w-0 bg-background p-3">
                  <p className="text-[11px] font-bold text-muted-foreground">남기는 산출물</p>
                  <p className="mt-1 break-words text-xs font-semibold">{stage.artifact}</p>
                </div>
                <div className="min-w-0 bg-background p-3">
                  <p className="text-[11px] font-bold text-muted-foreground">이 단계의 검증</p>
                  <p className="mt-1 break-words text-xs font-semibold">{stage.check}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </figure>
  );
}

type CropPolicy = 'full' | 'roi';
type MetadataPolicy = 'loose' | 'strict';

const policyFixtures: Record<`${CropPolicy}-${MetadataPolicy}`, Array<{
  id: string;
  kind: DefectTileProps['kind'];
  score: number;
  evidence: string;
  relevant: boolean;
}>> = {
  'full-loose': [
    { id: 'C-077', kind: 'polish', score: 0.95, evidence: '형상은 유사 · 원인은 다름', relevant: false },
    { id: 'C-118', kind: 'scratch', score: 0.92, evidence: '같은 원인 · 같은 조치', relevant: true },
    { id: 'C-041', kind: 'stain', score: 0.89, evidence: '배경 지그가 유사', relevant: false },
  ],
  'full-strict': [
    { id: 'C-118', kind: 'scratch', score: 0.92, evidence: '동일 공정 · 원인 확정', relevant: true },
    { id: 'C-203', kind: 'scratch', score: 0.86, evidence: '동일 장비 · 조치 확인', relevant: true },
    { id: 'C-077', kind: 'polish', score: 0.95, evidence: '다른 장비 · 필터 제외', relevant: false },
  ],
  'roi-loose': [
    { id: 'C-118', kind: 'scratch', score: 0.94, evidence: '국소 선형 흔적 일치', relevant: true },
    { id: 'C-203', kind: 'scratch', score: 0.9, evidence: '폭과 방향이 유사', relevant: true },
    { id: 'C-077', kind: 'polish', score: 0.87, evidence: '연마선이 부분 유사', relevant: false },
  ],
  'roi-strict': [
    { id: 'C-118', kind: 'scratch', score: 0.94, evidence: '동일 공정 · 원인 확정', relevant: true },
    { id: 'C-203', kind: 'scratch', score: 0.9, evidence: '동일 장비 · 조치 확인', relevant: true },
    { id: 'C-264', kind: 'scratch', score: 0.84, evidence: '동일 카메라 · 원인 후보', relevant: true },
  ],
};

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[11px] font-black text-muted-foreground">{label}</p>
      <div className="grid grid-cols-2 gap-1 rounded border border-border bg-muted/25 p-1" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`min-h-9 rounded-sm px-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground ${value === option.value ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:text-foreground'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RetrievalPolicyLab() {
  const [crop, setCrop] = useState<CropPolicy>('full');
  const [metadata, setMetadata] = useState<MetadataPolicy>('loose');
  const candidates = policyFixtures[`${crop}-${metadata}`];
  const falseNeighbors = useMemo(() => candidates.filter((candidate) => !candidate.relevant).length, [candidates]);
  const precision = (candidates.filter((candidate) => candidate.relevant).length / candidates.length).toFixed(2);

  return (
    <figure data-retrieval-policy-lab className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[11px] font-black uppercase text-muted-foreground">Retrieval policy lab · 교육용 합성 점수</p>
        <h3 className="mt-1 text-base font-bold sm:text-lg">높은 similarity가 왜 틀린 근거가 될 수 있을까?</h3>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">Crop과 metadata 조건을 바꾸고, 시각적으로 가까운 후보와 실제 조치에 유용한 후보의 차이를 확인한다.</p>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-muted/10 p-4 sm:grid-cols-2 sm:p-5">
        <SegmentedControl
          label="보는 범위"
          value={crop}
          options={[
            { value: 'full', label: '전체 이미지' },
            { value: 'roi', label: '결함 ROI' },
          ]}
          onChange={setCrop}
        />
        <SegmentedControl
          label="후보 조건"
          value={metadata}
          options={[
            { value: 'loose', label: '시각 점수 우선' },
            { value: 'strict', label: '공정 맥락 확인' },
          ]}
          onChange={setMetadata}
        />
      </div>

      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="min-w-0 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-bold">현재 Top-3</p>
            <p className="text-[11px] text-muted-foreground">점수는 같은 encoder partition 안에서만 비교</p>
          </div>
          <div className="overflow-hidden divide-y divide-border border-y border-border">
              {candidates.map((candidate, index) => (
                <motion.div
                  layout
                  key={`${crop}-${metadata}-${candidate.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18, delay: index * 0.035 }}
                  className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3"
                >
                  <DefectTile kind={candidate.kind} compact />
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="text-xs font-bold">{index + 1}. {candidate.id}</span>
                      <span className="text-[11px] text-muted-foreground">{candidate.score.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        layout
                        className={`h-full rounded-full ${candidate.relevant ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-rose-600 dark:bg-rose-400'}`}
                        animate={{ width: `${candidate.score * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 break-words text-[11px] leading-relaxed text-muted-foreground">{candidate.evidence}</p>
                  </div>
                  {candidate.relevant
                    ? <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-label="관련 사례" />
                    : <TriangleAlert className="h-4 w-4 shrink-0 text-rose-700 dark:text-rose-300" aria-label="false neighbor" />}
                </motion.div>
              ))}
          </div>
        </div>

        <div className="border-t border-border p-4 sm:p-5 lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-bold">관찰 결과</p>
          </div>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-[11px] font-bold text-muted-foreground">Precision@3</dt>
              <dd className="mt-1 text-2xl font-black tabular-nums">{precision}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold text-muted-foreground">False neighbor</dt>
              <dd className={`mt-1 text-2xl font-black tabular-nums ${falseNeighbors ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{falseNeighbors}</dd>
            </div>
          </dl>
          <div className="mt-5 flex gap-2 border-t border-border pt-4">
            <Database className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              {crop === 'roi' && metadata === 'strict'
                ? '결함 자체와 현장 조건을 함께 맞추면 상위 결과가 실제 조치 근거에 가까워진다.'
                : '점수만 높다고 채택하지 않는다. 빨간 후보가 왜 들어왔는지 crop과 metadata에서 설명해야 한다.'}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}
