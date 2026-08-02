import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  AudioLines,
  CircleAlert,
  Clock3,
  Layers3,
  MessageSquareText,
  Mic2,
  Radio,
  Volume2,
} from 'lucide-react';

type DuplexScene = 'listen' | 'overlap' | 'interrupt' | 'respond';

const duplexScenes: Record<DuplexScene, {
  label: string;
  user: boolean[];
  model: boolean[];
  event: string;
  boundary: string;
}> = {
  listen: {
    label: '사용자 발화',
    user: [true, true, true, true, false, false, false, false],
    model: [false, false, false, false, false, false, false, false],
    event: '사용자 stream은 계속 들어오고, 모델 stream에는 아직 출력 audio가 없다.',
    boundary: '두 stream을 같은 시간축에 올리는 것과 언제 답할지 결정하는 interaction policy는 다른 책임이다.',
  },
  overlap: {
    label: '겹쳐 말하기',
    user: [true, true, true, true, true, true, false, false],
    model: [false, false, true, true, true, true, true, false],
    event: '같은 codec frame에서 사용자 token과 모델 token이 동시에 존재한다.',
    boundary: 'Full duplex의 핵심은 한쪽이 끝나야 다른 쪽을 encode하는 직렬 endpoint를 강제하지 않는 것이다.',
  },
  interrupt: {
    label: '중간 끼어들기',
    user: [false, false, false, true, true, true, true, false],
    model: [true, true, true, true, true, false, false, false],
    event: '사용자가 다시 말하기 시작해도 입력 stream은 닫히지 않는다.',
    boundary: 'Moshi의 병렬 modeling은 barge-in을 표현할 수 있지만, 이미 queued된 playback을 취소하는 제품 보장까지 증명하지 않는다.',
  },
  respond: {
    label: '응답 계속',
    user: [false, false, false, false, false, false, false, false],
    model: [false, true, true, true, true, true, true, true],
    event: '모델 stream의 다음 audio token을 만들면서 사용자 stream도 계속 관찰한다.',
    boundary: 'Silence도 시간축의 상태다. 입력을 완전히 끊지 않아야 새 발화와 overlap을 다음 frame에서 반영할 수 있다.',
  },
};

export function DuplexStreamLab() {
  const [scene, setScene] = useState<DuplexScene>('overlap');
  const selected = duplexScenes[scene];

  return (
    <figure data-moshi-duplex-lab className="not-prose my-8 border-y border-border">
      <header className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Two-stream trace · 교육용 fixture</p>
          <p className="mt-1 text-sm font-black">한 시간축에서 누가 말하고 있는지 바꿔 본다</p>
        </div>
        <div role="tablist" aria-label="대화 장면" className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {(Object.keys(duplexScenes) as DuplexScene[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={scene === key}
              onClick={() => setScene(key)}
              className={`min-h-10 rounded-md border px-2 text-xs font-bold ${
                scene === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'
              }`}
            >
              {duplexScenes[key].label}
            </button>
          ))}
        </div>
      </header>

      <div className="border border-border">
        {[
          { label: '사용자 입력', icon: Mic2, values: selected.user, color: 'bg-emerald-500/75' },
          { label: '모델 출력', icon: Volume2, values: selected.model, color: 'bg-blue-600/75' },
        ].map(({ label, icon: Icon, values, color }) => (
          <div
            key={label}
            className="grid gap-3 border-b border-border p-4 last:border-b-0 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center"
          >
            <p className="flex items-center gap-2 text-xs font-black">
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </p>
            <div className="grid grid-cols-8 gap-1" aria-label={`${label} 시간 frame`}>
              {values.map((active, index) => (
                <div key={`${label}-${index}`} className="min-w-0">
                  <div className={`h-9 rounded-sm border border-border ${active ? color : 'bg-muted/30'}`} />
                  <p className="mt-1 text-center font-mono text-xs text-muted-foreground">{index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2">
        <div className="bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">이 장면에서 일어나는 일</p>
          <p className="mt-2 text-xs leading-relaxed">{selected.event}</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-semibold text-red-700 dark:text-red-300">논문이 보장하지 않는 것</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{selected.boundary}</p>
        </div>
      </div>
    </figure>
  );
}

type HierarchyMode = 'flat' | 'hierarchical';

export function HierarchyLab() {
  const [mode, setMode] = useState<HierarchyMode>('hierarchical');
  const [frame, setFrame] = useState(1);
  const [depth, setDepth] = useState(0);

  return (
    <figure data-moshi-hierarchy-lab className="not-prose my-8 border-y border-border">
      <header className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Generation axes · 교육용 4-frame trace</p>
          <p className="mt-1 text-sm font-black">큰 모델이 시간과 codebook을 모두 길게 읽는 일을 나눈다</p>
        </div>
        <div role="tablist" aria-label="생성 구조" className="grid grid-cols-2 gap-1">
          {([
            ['flat', 'Flat K×S'],
            ['hierarchical', 'Temporal + Depth'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={mode === key}
              onClick={() => setMode(key)}
              className={`min-h-10 rounded-md border px-3 text-xs font-bold ${
                mode === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1.25fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="flex items-center gap-2 text-xs font-black">
            <Clock3 className="size-4 text-blue-600" aria-hidden="true" />
            Temporal axis · frame {frame}/4
          </p>
          <div className="mt-4 grid grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={frame === value}
                onClick={() => setFrame(value)}
                className={`min-h-12 rounded-sm border font-mono text-xs font-black ${
                  frame === value ? 'border-blue-600 bg-blue-500/[0.10] text-blue-800 dark:text-blue-200' : 'border-border'
                }`}
              >
                s{value}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {mode === 'hierarchical'
              ? '큰 Temporal Transformer는 frame마다 한 번 호출되어 긴 대화 history와 두 stream의 현재 state를 읽는다.'
              : 'Flat 구조라면 큰 model의 sequence에 frame마다 K개 acoustic token 위치가 모두 늘어난다.'}
          </p>
        </div>

        <div className="flex min-h-12 items-center justify-center bg-background text-muted-foreground">
          <ArrowDown className="size-4 lg:hidden" aria-hidden="true" />
          <ArrowRight className="hidden size-4 lg:block" aria-hidden="true" />
        </div>

        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="flex items-center gap-2 text-xs font-black">
            <Layers3 className="size-4 text-emerald-600" aria-hidden="true" />
            {mode === 'hierarchical' ? 'Depth axis · 현재 frame 안 8개 codebook' : '한 줄로 펼친 8개 acoustic 위치'}
          </p>
          <div className="mt-4 grid grid-cols-4 gap-1 sm:grid-cols-8">
            {Array.from({ length: 8 }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-pressed={depth === index}
                onClick={() => setDepth(index)}
                className={`min-h-12 rounded-sm border text-xs font-black ${
                  depth === index
                    ? 'border-emerald-600 bg-emerald-500/[0.10] text-emerald-800 dark:text-emerald-200'
                    : 'border-border'
                }`}
              >
                q{index + 1}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed">
            선택한 위치: frame <strong>{frame}</strong>, codebook <strong>{depth + 1}</strong>.
            {mode === 'hierarchical'
              ? ' 작은 Depth Transformer가 같은 frame 안에서 이전 codebook token을 조건으로 다음 token을 만든다.'
              : ' 이 위치까지 모두 큰 시간축 sequence에 포함되어 K·S 길이 부담이 생긴다.'}
          </p>
        </div>
      </div>

      <figcaption className="flex gap-2 py-4 text-xs leading-relaxed text-muted-foreground">
        <AudioLines className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden="true" />
        Hierarchy는 acoustic token 수를 없애지 않는다. 긴 S축을 처리하는 큰 Temporal Transformer에서 K배 sequence 압력을 빼고,
        짧은 K축 생성은 frame-local Depth Transformer에 맡긴다.
      </figcaption>
    </figure>
  );
}

type DelayKey = 'frame' | 'final' | 'reduced' | 'diagonal';

const delayCases: Record<DelayKey, {
  label: string;
  delays: number[];
  latency: number;
  source: string;
  reading: string;
}> = {
  frame: {
    label: '동시 80ms',
    delays: [0, 0, 0, 0, 0, 0, 0, 0],
    latency: 80,
    source: 'Table 6의 zero-delay 비교 조건',
    reading: '모든 codebook이 현재 frame에 붙는다. 가장 짧은 schedule이지만 acoustic hierarchy를 예측할 여유가 가장 적다.',
  },
  final: {
    label: '최종 160ms',
    delays: [0, 1, 1, 1, 1, 1, 1, 1],
    latency: 160,
    source: 'Moshi fine-tuning의 최종 acoustic delay 1',
    reading: '첫 semantic level은 현재 frame, 나머지 acoustic level은 한 frame 뒤에 생성한다.',
  },
  reduced: {
    label: '비교 240ms',
    delays: [0, 2, 2, 2, 2, 2, 2, 2],
    latency: 240,
    source: 'Table 5의 reduced-delay pattern',
    reading: 'Acoustic level에 두 frame의 look-ahead를 주는 비교 조건이다.',
  },
  diagonal: {
    label: '대각 640ms',
    delays: [0, 1, 2, 3, 4, 5, 6, 7],
    latency: 640,
    source: 'Table 5의 diagonal-delay pattern',
    reading: '뒤 codebook일수록 한 frame씩 더 늦춘다. Quality가 쉬운 대신 streaming latency가 커지는 기준선이다.',
  },
};

export function DelayLab() {
  const [delay, setDelay] = useState<DelayKey>('final');
  const selected = delayCases[delay];

  return (
    <figure data-moshi-delay-lab className="not-prose my-8 border-y border-border">
      <header className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Delay schedule · 논문 조건</p>
          <p className="mt-1 text-sm font-black">Codebook을 몇 frame 늦출지 바꿔 품질과 지연을 읽는다</p>
        </div>
        <div role="tablist" aria-label="Moshi delay pattern" className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {(Object.keys(delayCases) as DelayKey[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={delay === key}
              onClick={() => setDelay(key)}
              className={`min-h-10 rounded-md border px-2 text-xs font-bold ${
                delay === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'
              }`}
            >
              {delayCases[key].label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-px border border-border bg-border lg:grid-cols-[minmax(0,1.25fr)_minmax(15rem,0.75fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {selected.delays.map((value, index) => (
              <div key={`${delay}-${index}`} className="min-w-0">
                <p className="text-center font-mono text-xs font-black">q{index + 1}</p>
                <div className="mt-2 flex h-24 items-end rounded-sm border border-border bg-muted/20 p-1">
                  <div
                    className="w-full rounded-sm transition-[height]"
                    style={{
                      height: `${Math.max(12, ((value + 1) / 8) * 80)}px`,
                      backgroundColor: 'rgb(245 158 11)',
                    }}
                  />
                </div>
                <p className="mt-1 text-center font-mono text-xs text-muted-foreground">+{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Clock3 className="size-4 text-amber-600" aria-hidden="true" />
            이론 schedule
          </p>
          <p className="mt-3 font-mono text-3xl font-black">{selected.latency} ms</p>
          <p className="mt-3 text-xs font-bold">{selected.source}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{selected.reading}</p>
        </div>
      </div>

      <figcaption className="flex gap-2 py-4 text-xs leading-relaxed text-muted-foreground">
        <CircleAlert className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden="true" />
        이 숫자는 codec frame과 acoustic delay가 만든 이론 schedule이다. Capture, network, queue, model runtime, packet,
        jitter buffer와 speaker 재생을 더한 microphone-to-playback p95가 아니다.
      </figcaption>
    </figure>
  );
}

type EvidenceKey = 'codec' | 'hierarchy' | 'monologue' | 'qa' | 'dialogue' | 'derived';

const evidenceCases: Record<EvidenceKey, {
  label: string;
  address: string;
  question: string;
  rows: [string, string, string][];
  conclusion: string;
}> = {
  codec: {
    label: 'Codec 평가',
    address: 'Table 4 · Mimi ablation',
    question: '객관 metric 하나만 좋아지면 사람이 듣는 품질도 좋아졌다고 말할 수 있을까?',
    rows: [
      ['Adversarial only', 'VisQOL 1.84 · MOSNet 3.10', 'MUSHRA 81.0 ± 1.3'],
      ['Non-adversarial only', 'VisQOL 2.82 · MOSNet 2.89', 'MUSHRA 58.8 ± 1.8'],
    ],
    conclusion: 'VisQOL 순위와 MUSHRA 순위가 뒤집힌다. Codec release는 객관 metric과 청취 평가를 함께 봐야 한다.',
  },
  hierarchy: {
    label: 'RQ-Transformer',
    address: 'Table 5 · acoustic delay',
    question: 'Depth model은 모든 delay 조건에서 같은 정도로 중요한가?',
    rows: [
      ['Diagonal · 640ms', 'RQ 없음 42.2 PPL', 'RQ 있음 40.3 PPL'],
      ['Reduced · 240ms', 'RQ 없음 135.4 PPL', 'RQ 있음 36.8 PPL'],
    ],
    conclusion: '긴 diagonal delay에서는 차이가 작지만 low-latency 조건에서는 frame-local acoustic modeling이 무너지지 않게 하는 핵심이다.',
  },
  monologue: {
    label: 'Inner Monologue',
    address: 'Table 6 · matched setting',
    question: '시간축 text stream이 audio generation 학습에 실제로 신호를 더했는가?',
    rows: [
      ['Inner Monologue 없음', 'NLL 3.65', '생성 transcript 602 chars'],
      ['Inner Monologue 있음', 'NLL 2.77', '생성 transcript 1,920 chars'],
    ],
    conclusion: '같은 depthwise·semantic-weight 조건에서 text stream을 넣은 행이 더 낮은 NLL과 더 긴 coherent transcript를 보였다.',
  },
  qa: {
    label: 'Spoken QA',
    address: 'Table 8 · Moshi benchmark scope',
    question: 'Inner Monologue가 질문 내용에 답하는 능력에도 연결되었는가?',
    rows: [
      ['Moshi without IM', 'Web 9.2 · LLaMA 21.0', 'Audio TriviaQA 7.3'],
      ['Moshi', 'Web 26.6 · LLaMA 62.3', 'Audio TriviaQA 22.8'],
    ],
    conclusion: '세 benchmark에서 모두 차이가 났다. 다만 이 표는 해당 spoken QA setup의 결과이지 모든 대화 능력의 보편 점수가 아니다.',
  },
  dialogue: {
    label: '대화 동역학',
    address: 'Table 9 · generated dialogue statistics',
    question: '두 stream 생성이 silence와 overlap을 실제 sequence에 남겼는가?',
    rows: [
      ['Cascaded baseline', 'Pause 0.0s · Gap 5.3s', 'Overlap 0.0s'],
      ['Moshi · temp 1.0', 'Pause 7.0s · Gap 4.5s', 'Overlap 4.1s'],
      ['Ground truth · 1,000', 'Pause 6.4s · Gap 4.2s', 'Overlap 3.3s'],
    ],
    conclusion: 'Moshi 생성 대화에는 pause와 overlap이 나타났다. 그러나 이는 Fisher prompt에서 생성한 continuation 통계이며 실제 사용자의 barge-in 성공률이나 playback 취소 증거가 아니다.',
  },
  derived: {
    label: '파생 ASR·TTS',
    address: 'Section 5.7 · capability demonstration',
    question: '같은 architecture에서 ASR·TTS가 나온다는 사실은 무엇을 증명하는가?',
    rows: [
      ['Streaming TTS', 'LibriSpeech test-clean', 'WER 4.7%'],
      ['Streaming ASR', 'LibriSpeech test-clean', 'WER 5.7%'],
    ],
    conclusion: '원문은 state of the art 경쟁이 아니라 Inner Monologue의 유연성을 보이는 실험이라고 한정한다.',
  },
};

export function MoshiEvidenceLab() {
  const [evidence, setEvidence] = useState<EvidenceKey>('codec');
  const selected = evidenceCases[evidence];

  return (
    <figure data-moshi-evidence-lab className="not-prose my-8 border-y border-border">
      <header className="py-4">
        <p className="text-xs font-semibold text-muted-foreground">Source receipt · 원문 수치</p>
        <p className="mt-1 text-sm font-black">표 하나가 답하는 질문과 답하지 않는 질문을 분리한다</p>
      </header>

      <div role="tablist" aria-label="Moshi source evidence" className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(evidenceCases) as EvidenceKey[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={evidence === key}
            onClick={() => setEvidence(key)}
            className={`min-h-11 rounded-md border px-2 text-xs font-bold ${
              evidence === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'
            }`}
          >
            {evidenceCases[key].label}
          </button>
        ))}
      </div>

      <div className="mt-4 border border-border">
        <div className="border-b border-border p-4 sm:p-5">
          <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <Radio className="size-4" aria-hidden="true" />
            {selected.address}
          </p>
          <p className="mt-2 text-sm font-black">{selected.question}</p>
        </div>
        <div className="divide-y divide-border">
          {selected.rows.map(([condition, metric, outcome]) => (
            <div key={condition} className="grid gap-2 p-4 sm:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-4">
              <p className="text-xs font-black">{condition}</p>
              <p className="font-mono text-xs leading-relaxed text-muted-foreground">{metric}</p>
              <p className="font-mono text-xs leading-relaxed">{outcome}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-border bg-emerald-500/[0.05] p-4 sm:p-5">
          <p className="flex items-start gap-2 text-xs leading-relaxed">
            <MessageSquareText className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
            {selected.conclusion}
          </p>
        </div>
      </div>
    </figure>
  );
}
