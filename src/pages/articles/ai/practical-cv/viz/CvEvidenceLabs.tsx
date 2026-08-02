import { useMemo, useState, type ReactNode } from 'react';
import {
  Aperture,
  Check,
  CircleAlert,
  Eye,
  Film,
  Layers3,
  ShieldCheck,
} from 'lucide-react';
import { SegmentedControl } from '../../nlp-shared';

function LabShell({
  lab,
  eyebrow,
  title,
  children,
  footer,
}: {
  lab: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section
      data-lab={lab}
      className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background shadow-sm"
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[11px] font-semibold uppercase text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{title}</h3>
      </header>
      <div className="min-w-0 space-y-5 p-4 sm:p-5">{children}</div>
      <footer className="border-t border-border bg-muted/15 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5">
        {footer}
      </footer>
    </section>
  );
}

function Verdict({
  good,
  title,
  description,
}: {
  good: boolean;
  title: string;
  description: string;
}) {
  return (
    <div className={`flex min-w-0 items-start gap-3 border-y py-4 ${good ? 'border-emerald-600/30' : 'border-amber-600/30'}`}>
      {good
        ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" />
        : <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />}
      <div className="min-w-0">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

type SplitKey = 'file' | 'entity' | 'site';

export function SplitContractLab() {
  const [key, setKey] = useState<SplitKey>('file');
  const result = {
    file: {
      good: false,
      train: ['A-앞', 'A-옆', 'B-앞'],
      valid: ['A-뒤', 'C-앞'],
      title: '점수는 높아도 새 대상을 평가한 것이 아니다',
      description: '같은 대상 A의 촬영 흔적이 양쪽에 남는다. 파일 이름만 다른 near-duplicate도 같은 누수다.',
    },
    entity: {
      good: true,
      train: ['A 전체', 'B 전체'],
      valid: ['C 전체'],
      title: '새 대상을 만나는 질문과 split이 맞았다',
      description: '한 entity의 모든 이미지·뷰·클립이 한쪽에만 있다. 실제 배포가 새 장소라면 아직 충분하지 않다.',
    },
    site: {
      good: true,
      train: ['공장 1·2'],
      valid: ['공장 3'],
      title: '새 촬영 환경까지 포함한 더 강한 시험이다',
      description: '배경·조명·카메라가 바뀌는 배포라면 site 또는 time을 가장 바깥 split key로 둔다.',
    },
  }[key];

  return (
    <LabShell
      lab="split-contract"
      eyebrow="Split contract lab"
      title="같은 이미지를 나눈 것이 아니라 같은 원인을 격리했는가?"
      footer="Split key는 데이터 포맷이 아니라 배포 질문에서 정한다. 새 환자, 새 제품, 새 영상, 새 공장 중 무엇을 일반화해야 하는지 먼저 적는다."
    >
      <SegmentedControl
        label="검증 분할 기준"
        value={key}
        onChange={setKey}
        options={[
          { value: 'file', label: '파일별' },
          { value: 'entity', label: '대상별' },
          { value: 'site', label: '장소별' },
        ]}
      />
      <div className="grid min-w-0 grid-cols-2 gap-3">
        {[
          ['Train', result.train, 'border-blue-600/30'],
          ['Validation', result.valid, 'border-teal-600/30'],
        ].map(([label, values, color]) => (
          <div key={label as string} className={`min-w-0 border-t-2 ${color as string} bg-muted/10 px-3 py-3`}>
            <p className="text-[11px] font-semibold text-muted-foreground">{label as string}</p>
            <div className="mt-2 space-y-1">
              {(values as string[]).map((value) => (
                <p key={value} className="break-words text-xs font-medium">{value}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Verdict good={result.good} title={result.title} description={result.description} />
    </LabShell>
  );
}

type Transform = 'flip' | 'crop' | 'color';
type Task = 'species' | 'laterality' | 'defect';

export function AugmentationContractLab() {
  const [transform, setTransform] = useState<Transform>('flip');
  const [task, setTask] = useState<Task>('laterality');
  const preserves = useMemo(() => {
    if (task === 'laterality') return transform !== 'flip';
    if (task === 'defect') return transform !== 'crop';
    return true;
  }, [task, transform]);

  const explanation = preserves
    ? '변환 뒤에도 target의 뜻이 유지된다. 강도별 slice metric으로 실제 강건성을 확인한다.'
    : task === 'laterality'
      ? '좌우 반전이 left/right label을 바꾼다. 이 변환은 label도 함께 바꾸지 않으면 잘못된 감독 신호다.'
      : '작은 결함을 crop이 지우면 입력과 label이 모순된다. 결함 보존 crop 또는 위치 mask가 필요하다.';

  return (
    <LabShell
      lab="augmentation-contract"
      eyebrow="Transformation lab"
      title="증강은 기법 목록이 아니라 label이 보존된다는 가설이다"
      footer="증강을 추가할 때마다 불변이어야 하는 것과 변해야 하는 것을 적는다. Validation에도 같은 무작위 변환을 넣어 성능을 흐리지 않는다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="예측 과제"
          value={task}
          onChange={setTask}
          options={[
            { value: 'species', label: '종 분류' },
            { value: 'laterality', label: '좌·우 판정' },
            { value: 'defect', label: '작은 결함' },
          ]}
        />
        <SegmentedControl
          label="후보 변환"
          value={transform}
          onChange={setTransform}
          options={[
            { value: 'flip', label: '좌우 반전' },
            { value: 'crop', label: '강한 crop' },
            { value: 'color', label: '색 변화' },
          ]}
        />
      </div>
      <div className="grid min-h-28 min-w-0 grid-cols-[1fr_2.5rem_1fr] items-center gap-2 border-y border-border py-4">
        <div className="flex min-h-20 items-center justify-center bg-blue-500/[0.06]">
          <Aperture className="h-9 w-9 text-blue-700 dark:text-blue-300" />
        </div>
        <p className="text-center text-lg text-muted-foreground">→</p>
        <div className={`flex min-h-20 items-center justify-center ${preserves ? 'bg-emerald-500/[0.06]' : 'bg-amber-500/[0.08]'}`}>
          {preserves
            ? <Check className="h-9 w-9 text-emerald-700 dark:text-emerald-300" />
            : <CircleAlert className="h-9 w-9 text-amber-700 dark:text-amber-300" />}
        </div>
      </div>
      <Verdict
        good={preserves}
        title={preserves ? 'Label-preserving 후보' : '현재 계약에서는 금지'}
        description={explanation}
      />
    </LabShell>
  );
}

type ViewMeaning = 'set' | 'camera';
type MissingViews = 'none' | 'one' | 'many';

export function ViewSetLab() {
  const [meaning, setMeaning] = useState<ViewMeaning>('set');
  const [missing, setMissing] = useState<MissingViews>('one');

  const decision = useMemo(() => {
    if (meaning === 'set' && missing !== 'none') {
      return {
        method: 'Shared encoder + masked set pooling',
        reason: '순서에는 뜻이 없고 view 수가 변한다. Validity mask와 view dropout이 먼저다.',
      };
    }
    if (meaning === 'camera' && missing === 'none') {
      return {
        method: 'Camera token + cross-view interaction 후보',
        reason: '각 위치가 고정 센서 의미를 가지며 모든 뷰가 있다. 단순 pooling 대비 gain을 확인한다.',
      };
    }
    if (meaning === 'camera') {
      return {
        method: 'Camera token + missing-view mask',
        reason: '고정 위치 의미와 센서 실패를 함께 표현해야 한다. 빈 이미지를 실제 뷰처럼 넣지 않는다.',
      };
    }
    return {
      method: 'Mean/max pooling baseline',
      reason: '순서 불변 집합이며 모든 뷰가 있다. Attention 전에 가장 싼 충분한 집계를 측정한다.',
    };
  }, [meaning, missing]);

  const activeViews = missing === 'none' ? 4 : missing === 'one' ? 3 : 2;

  return (
    <LabShell
      lab="view-set"
      eyebrow="View-set contract lab"
      title="뷰는 순서 없는 집합인가, 위치가 고정된 센서 배열인가?"
      footer="Early·late·attention은 난이도 순서가 아니다. View 의미, 누락 정책, alignment와 interaction evidence가 선택을 결정한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="뷰 순서의 의미"
          value={meaning}
          onChange={setMeaning}
          options={[
            { value: 'set', label: '순서 없음' },
            { value: 'camera', label: '카메라 고정' },
          ]}
        />
        <SegmentedControl
          label="누락 뷰"
          value={missing}
          onChange={setMissing}
          options={[
            { value: 'none', label: '없음' },
            { value: 'one', label: '1개' },
            { value: 'many', label: '2개' },
          ]}
        />
      </div>
      <div className="grid grid-cols-4 gap-2" aria-label={`${activeViews}개 유효 뷰`}>
        {[0, 1, 2, 3].map((index) => {
          const active = index < activeViews;
          return (
            <div
              key={index}
              className={`flex aspect-[4/3] min-w-0 items-center justify-center border-t-2 ${
                active ? 'border-violet-600 bg-violet-500/[0.06]' : 'border-border bg-muted/20'
              }`}
            >
              {active
                ? <Eye className="h-5 w-5 text-violet-700 dark:text-violet-300" />
                : <span className="text-[10px] text-muted-foreground">mask</span>}
            </div>
          );
        })}
      </div>
      <div className="border-y border-border py-4">
        <p className="text-sm font-bold">{decision.method}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{decision.reason}</p>
      </div>
    </LabShell>
  );
}

type Horizon = 'short' | 'medium' | 'long';
type Stride = 'dense' | 'balanced' | 'sparse';

export function TemporalSamplingLab() {
  const [horizon, setHorizon] = useState<Horizon>('medium');
  const [stride, setStride] = useState<Stride>('sparse');
  const frames = stride === 'dense' ? 16 : stride === 'balanced' ? 8 : 4;
  const eventSpan = horizon === 'short' ? 2 : horizon === 'medium' ? 6 : 12;
  const covered = frames >= eventSpan;

  return (
    <LabShell
      lab="temporal-sampling"
      eyebrow="Temporal sampling lab"
      title="모델보다 먼저 사건의 길이와 관측 간격을 맞춘다"
      footer="같은 16 frame이라도 0.5초를 촘촘히 보는 것과 30초를 드문드문 보는 것은 다른 입력이다. Frame 수만으로 temporal coverage를 설명할 수 없다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="사건 길이"
          value={horizon}
          onChange={setHorizon}
          options={[
            { value: 'short', label: '짧음' },
            { value: 'medium', label: '중간' },
            { value: 'long', label: '김' },
          ]}
        />
        <SegmentedControl
          label="표본 밀도"
          value={stride}
          onChange={setStride}
          options={[
            { value: 'dense', label: '촘촘' },
            { value: 'balanced', label: '중간' },
            { value: 'sparse', label: '드문드문' },
          ]}
        />
      </div>
      <div className="relative h-20 overflow-hidden border-y border-border">
        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        <div className="absolute left-[18%] top-4 h-12 w-[42%] bg-teal-500/10" />
        <div className="absolute left-[18%] top-3 text-[10px] font-semibold text-teal-800 dark:text-teal-200">목표 사건</div>
        <div
          className="absolute inset-x-3 bottom-3 grid"
          style={{ gridTemplateColumns: `repeat(${frames}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: frames }, (_, index) => (
            <span key={index} className="mx-auto h-4 w-1 bg-blue-600" />
          ))}
        </div>
      </div>
      <Verdict
        good={covered}
        title={covered ? '사건을 구분할 표본 후보' : '중요 전환을 놓칠 가능성'}
        description={covered
          ? '이제 같은 coverage에서 single-frame·shuffled·ordered baseline을 비교한다.'
          : '모델을 키우기 전에 sampling density, event-centered clip 또는 multi-scale window를 바꾼다.'}
      />
    </LabShell>
  );
}

type TemporalProbe = 'frame' | 'shuffle' | 'ordered';

export function TemporalEvidenceLab() {
  const [probe, setProbe] = useState<TemporalProbe>('frame');
  const result = {
    frame: { score: '0.81', label: '한 장만 봄', note: '배경·물체만으로도 높은 점수라면 shortcut 가능성을 먼저 본다.' },
    shuffle: { score: '0.80', label: '순서를 섞음', note: 'Ordered와 차이가 거의 없으면 시간 순서를 쓰지 않는 모델일 수 있다.' },
    ordered: { score: '0.82', label: '원래 순서', note: '작은 차이는 seed·slice·비용과 함께 봐야 temporal 모델의 이득이라고 말할 수 있다.' },
  }[probe];

  return (
    <LabShell
      lab="temporal-evidence"
      eyebrow="Temporal evidence lab"
      title="비디오 점수가 높다는 사실만으로 시간을 이해한 것은 아니다"
      footer="실제 실험에서는 세 probe를 같은 split, encoder budget, clip coverage와 seed에서 비교한다. 숫자는 개념 예시이며 벤치마크 결과가 아니다."
    >
      <SegmentedControl
        label="반증 probe"
        value={probe}
        onChange={setProbe}
        options={[
          { value: 'frame', label: 'Single frame' },
          { value: 'shuffle', label: 'Frame shuffle' },
          { value: 'ordered', label: 'Ordered clip' },
        ]}
      />
      <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_4rem] items-center gap-3 border-y border-border py-4">
        <Film className="h-7 w-7 text-blue-700 dark:text-blue-300" />
        <div className="min-w-0">
          <p className="text-xs font-semibold">{result.label}</p>
          <div className="mt-2 h-2 overflow-hidden bg-muted">
            <div className="h-full bg-blue-600 transition-[width]" style={{ width: `${Number(result.score) * 100}%` }} />
          </div>
        </div>
        <p className="text-right text-xl font-black tabular-nums">{result.score}</p>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{result.note}</p>
    </LabShell>
  );
}

type Holdout = 'none' | 'generator' | 'pipeline';

export function ForensicGeneralizationLab() {
  const [holdout, setHoldout] = useState<Holdout>('none');
  const result = {
    none: {
      score: '0.96',
      good: false,
      title: 'In-domain 점수만으로 출시할 수 없다',
      note: '같은 생성기·코덱·원본 계보를 다시 본 결과다. 아티팩트를 외웠는지 구분하지 못한다.',
    },
    generator: {
      score: '0.68',
      good: false,
      title: '미지 생성기에서 탐지 규칙이 무너졌다',
      note: '주파수나 경계 패턴이 생성기 fingerprint였을 수 있다. Leave-one-generator-out 학습과 오류 slice가 필요하다.',
    },
    pipeline: {
      score: '0.57',
      good: false,
      title: '실제 유통 파이프라인은 더 강한 이동이다',
      note: '재인코딩·crop·화면 녹화·메신저 압축이 흔적을 바꾼다. Detector 단독 verdict 대신 provenance와 사람 검토를 결합한다.',
    },
  }[holdout];

  return (
    <LabShell
      lab="forensic-generalization"
      eyebrow="Open-world forensic lab"
      title="같은 fake를 다시 찾는가, 보지 못한 생성 과정을 견디는가?"
      footer="예시 수치는 일반 성능 주장이 아니다. 실제 release matrix에는 generator, pristine source, identity, codec, resolution, capture와 post-processing 축을 명시한다."
    >
      <SegmentedControl
        label="검증에서 감춘 축"
        value={holdout}
        onChange={setHoldout}
        options={[
          { value: 'none', label: '없음' },
          { value: 'generator', label: '생성기' },
          { value: 'pipeline', label: '유통 과정' },
        ]}
      />
      <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_4rem] items-center gap-3 border-y border-border py-4">
        {holdout === 'none'
          ? <Layers3 className="h-7 w-7 text-violet-700 dark:text-violet-300" />
          : <ShieldCheck className="h-7 w-7 text-teal-700 dark:text-teal-300" />}
        <div className="min-w-0">
          <p className="text-xs font-semibold">예시 AUROC</p>
          <div className="mt-2 h-2 overflow-hidden bg-muted">
            <div
              className={`h-full transition-[width] ${holdout === 'none' ? 'bg-violet-600' : 'bg-teal-600'}`}
              style={{ width: `${Number(result.score) * 100}%` }}
            />
          </div>
        </div>
        <p className="text-right text-xl font-black tabular-nums">{result.score}</p>
      </div>
      <Verdict good={result.good} title={result.title} description={result.note} />
    </LabShell>
  );
}
