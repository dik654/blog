import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #timing — e_i = max(r_i, e_{i-1}) + E에서 어느 조건이 늦은 쪽인지가 완료를 정한다.
 * L=3,E=2: r=3,6,9,12 → e=5,8,11,14. L=2,E=3: r=2,4,6,8 → e=5,8,11,14. G=2,E=3: 2+4×3=14.
 * N=200,L=5,E=2: 비동기 200×5+2=1,002, 매 작업 동기화 200×7=1,400, G=10 재생 10+400=410.
 */
interface Timeline {
  label: string;
  summary: string;
  note: string;
  submit: readonly (readonly [number, number])[];
  run: readonly (readonly [number, number])[];
  /** 각 작업의 [r_i, e_{i-1}, E, e_i] */
  rows: readonly (readonly [number, number, number, number])[] | null;
}

const SCENES: readonly Timeline[] = [
  {
    label: "L=3, E=2 · 도착이 늦습니다",
    summary: "완료 14 μs · 빈틈 있음",
    note: "max에서 작업 도착 r이 매번 늦은 쪽입니다. 계산 장치가 다음 작업이 오기를 1 μs씩 기다리므로 제출이 빨라지면 완료도 앞당겨질 수 있습니다.",
    submit: [[0, 3], [3, 6], [6, 9], [9, 12]],
    run: [[3, 5], [6, 8], [9, 11], [12, 14]],
    rows: [[3, 0, 2, 5], [6, 5, 2, 8], [9, 8, 2, 11], [12, 11, 2, 14]],
  },
  {
    label: "L=2, E=3 · 앞 계산이 늦습니다",
    summary: "완료 14 μs · 빈틈 없음",
    note: "첫 작업 뒤에는 앞 계산의 완료 e가 늦은 쪽입니다. 작업이 먼저 도착해 줄을 서고 계산 장치는 쉬지 않습니다. 제출 시간 8 μs 중 뒤쪽 제출은 계산과 겹칩니다.",
    submit: [[0, 2], [2, 4], [4, 6], [6, 8]],
    run: [[2, 5], [5, 8], [8, 11], [11, 14]],
    rows: [[2, 0, 3, 5], [4, 5, 3, 8], [6, 8, 3, 11], [8, 11, 3, 14]],
  },
  {
    label: "L=2, E=3을 G=2로 재생",
    summary: "CPU 제출 8 → 2 μs · 완료 14 μs",
    note: "graph 제출 G=2 μs 한 번이면 첫 계산은 똑같이 2 μs에 시작하고 G + NE = 2 + 4×3 = 14 μs에 끝납니다. CPU는 덜 바빠졌지만 GPU 계산이 이미 빈틈없이 이어져서 완료는 그대로입니다.",
    submit: [[0, 2]],
    run: [[2, 5], [5, 8], [8, 11], [11, 14]],
    rows: null,
  },
];

const BIG = [
  { name: "재생 (G=10)", formula: "10 + 200×2", value: 410 },
  { name: "일반 제출", formula: "200×5 + 2", value: 1002 },
  { name: "매 작업 동기화", formula: "200×(5+2)", value: 1400 },
] as const;

const W = 340;
const LEFT = 40;
const x = (time: number) => LEFT + time * ((W - LEFT - 10) / 15);

function Chart({ scene }: { scene: Timeline }) {
  return (
    <svg viewBox={`0 0 ${W} 118`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      {[0, 5, 10, 15].map((time) => (
        <g key={time}>
          <line x1={x(time)} x2={x(time)} y1={4} y2={88} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
          <text x={x(time)} y={102} textAnchor="middle" fontSize={11} className="fill-muted-foreground">{time}</text>
        </g>
      ))}
      <text x={0} y={27} fontSize={11} fontWeight={700} className="fill-foreground">제출</text>
      <text x={0} y={69} fontSize={11} fontWeight={700} className="fill-foreground">계산</text>
      {scene.submit.map(([from, to], index) => (
        <g key={from}>
          <rect x={x(from)} y={12} width={x(to) - x(from)} height={24} rx={2} fill="#64748b" opacity={0.25} stroke="#64748b" strokeWidth={1} />
          <text x={(x(from) + x(to)) / 2} y={28} textAnchor="middle" fontSize={11} className="fill-foreground">{scene.submit.length === 1 ? "G" : index + 1}</text>
        </g>
      ))}
      {scene.run.map(([from, to], index) => (
        <g key={from}>
          <rect x={x(from)} y={54} width={x(to) - x(from)} height={24} rx={2} fill="#2563eb" opacity={0.25} stroke="#2563eb" strokeWidth={1} />
          <text x={(x(from) + x(to)) / 2} y={70} textAnchor="middle" fontSize={11} className="fill-foreground">{index + 1}</text>
        </g>
      ))}
      <text x={W - 10} y={112} textAnchor="end" fontSize={11} className="fill-muted-foreground">μs</text>
    </svg>
  );
}

function MaxRows({ scene }: { scene: Timeline }) {
  if (!scene.rows) {
    return <p className="rounded-md border border-border bg-background px-3 py-2 font-mono text-xs">G + NE = 2 + 4 × 3 = 14</p>;
  }
  return (
    <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
      {scene.rows.map(([arrive, previous, compute, done]) => (
        <li key={done} className="rounded-md border border-border bg-background px-2 py-1 text-center font-mono text-[11px] leading-5 sm:text-xs">
          max(<span className={arrive >= previous ? "font-bold text-primary underline" : ""}>{arrive}</span>,<span className={previous > arrive ? "font-bold text-primary underline" : ""}>{previous}</span>)+{compute}={done}
        </li>
      ))}
    </ul>
  );
}

function BigCase() {
  return (
    <div className="space-y-3">
      {BIG.map((row) => (
        <div key={row.name} className="text-xs">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2">
            <span className="font-semibold">{row.name}</span>
            <span className="font-mono">{row.formula} = {row.value.toLocaleString("en-US")}</span>
          </div>
          <div className="mt-1 h-3 rounded-sm bg-muted/40">
            <div className="h-full rounded-sm bg-[#2563eb]" style={{ width: `${(row.value / 1400) * 100}%` }} />
          </div>
        </div>
      ))}
      <p className="text-xs leading-5 text-muted-foreground">막대 길이는 단순 모형의 계산값입니다(가정, μs).</p>
    </div>
  );
}

const ALL = [
  ...SCENES,
  {
    label: "큰 사례 N=200, L=5, E=2",
    summary: "410 · 1,002 · 1,400 μs",
    note: "같은 단순 모형을 늘린 계산입니다. 이 비율을 실제 GPU에서 측정한 가속비로 사용할 수 없습니다.",
  },
] as const;

export default function SubmitOverlapViz() {
  return (
    <SceneShell
      eyebrow="max의 두 조건"
      title="늦은 조건이 무엇이냐에 따라 제출을 줄여도 완료가 그대로일 수 있습니다"
      description="L은 작업 하나의 제출 시간, E는 계산 시간, G는 graph 제출 시간입니다. 아래 식에서 밑줄 친 값이 max에서 고른 늦은 쪽입니다. 모두 가정한 값입니다."
      ariaLabel="제출과 계산 시간표에서 max의 두 조건 비교"
      scenes={ALL}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            ...SCENES.map((scene) => (
              <div key={scene.label} className="space-y-2">
                <Chart scene={scene} />
                <MaxRows scene={scene} />
              </div>
            )),
            <BigCase key="big" />,
          ]}
        />
      )}
    />
  );
}
