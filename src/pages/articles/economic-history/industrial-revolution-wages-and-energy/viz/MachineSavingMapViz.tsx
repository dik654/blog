import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 임금과 에너지 가격이라는 두 값이 함께 기계의 손익을 정한다.
 * 가로 = 주급 w, 세로 = 석탄비 c, 칸의 값 = 기계가 주당 아끼는 돈. 기계의 절감액 S(w,c)=10w−(35+c+4w)=6w−35−c.
 * S가 일차식이라 면으로 세우지 않고, 같은 손익을 잇는 곧은 선의 지도로 그립니다.
 * 7절의 값: S(6,15)=−14, S(10,15)=+10, S(10,35)=−10, 문턱 w=(35+c)/6 → 8.33, 11.67.
 */
const saving = (w: number, c: number) => 6 * w - 35 - c;

const W_MIN = 5;
const W_MAX = 13;
const C_MIN = 10;
const C_MAX = 40;

const W = 340;
const H = 268;
const LEFT = 36;
const RIGHT = 34;
const TOP = 22;
const BOTTOM = 42;
const x = (w: number) => LEFT + ((w - W_MIN) / (W_MAX - W_MIN)) * (W - LEFT - RIGHT);
const y = (c: number) => H - BOTTOM - ((c - C_MIN) / (C_MAX - C_MIN)) * (H - TOP - BOTTOM);

const UP = "#2563eb";
const DOWN = "#d97706";
const FAINT = "#94a3b8";
const GRAY = "#64748b";
const PATH = "#475569";

type Anchor = "start" | "end";

interface Pin {
  w: number;
  c: number;
  text: string;
  anchor: Anchor;
  dy: number;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  pins: readonly Pin[];
  path?: readonly [readonly [number, number], readonly [number, number]];
}

const THRESHOLD_15 = 50 / 6;
const THRESHOLD_35 = 70 / 6;

const SCENES: readonly Scene[] = [
  {
    label: "주급만 올림",
    summary: "석탄 15: 주급 1당 +6",
    note: "석탄 15에 머문 채 오른쪽으로 갑니다. 주급 6은 −14, 주급 10은 +10입니다. 주급 1당 10명분과 4명분의 차이 6씩 오릅니다.",
    pins: [
      { w: 6, c: 15, text: "주급 6: −14", anchor: "start", dy: -9 },
      { w: 10, c: 15, text: "주급 10: +10", anchor: "start", dy: -9 },
    ],
    path: [[6, 15], [10, 15]],
  },
  {
    label: "석탄비만 올림",
    summary: "주급 10: 석탄 1당 −1",
    note: "주급 10에 머문 채 위로 갑니다. 같은 주급도 석탄비가 35로 오르면 +10에서 −10으로, 손익 0 선을 넘어 사람이 싼 쪽으로 갑니다.",
    pins: [
      { w: 10, c: 15, text: "석탄 15: +10", anchor: "start", dy: 4 },
      { w: 10, c: 35, text: "석탄 35: −10", anchor: "end", dy: 4 },
    ],
    path: [[10, 15], [10, 35]],
  },
  {
    label: "손익이 0인 선",
    summary: "(35 + 석탄비) ÷ 6",
    note: "굵은 선 위에서 두 방식의 비용이 같고, 이 선이 문턱입니다. 주급이 높고 석탄이 쌀수록 오른쪽 아래, 곧 기계가 싼 쪽으로 갑니다.",
    pins: [
      { w: THRESHOLD_15, c: 15, text: "문턱 8.33", anchor: "start", dy: 4 },
      { w: THRESHOLD_35, c: 35, text: "문턱 11.67", anchor: "end", dy: 4 },
    ],
  },
];

/** 판의 네 모서리를 손익 0을 기준으로 잘라 양수·음수 다각형으로 나눕니다. */
function clipBySign(sign: 1 | -1) {
  const corners: [number, number][] = [
    [W_MIN, C_MIN],
    [W_MAX, C_MIN],
    [W_MAX, C_MAX],
    [W_MIN, C_MAX],
  ];
  const result: [number, number][] = [];
  corners.forEach((point, index) => {
    const next = corners[(index + 1) % corners.length];
    const a = sign * saving(point[0], point[1]);
    const b = sign * saving(next[0], next[1]);
    if (a >= 0) result.push(point);
    if (a >= 0 !== b >= 0) {
      const t = a / (a - b);
      result.push([point[0] + (next[0] - point[0]) * t, point[1] + (next[1] - point[1]) * t]);
    }
  });
  return result.map(([w, c]) => `${x(w).toFixed(1)},${y(c).toFixed(1)}`).join(" ");
}

/** 손익이 value인 곧은 선을 틀 안으로 자른 양 끝입니다. c = 6w − 35 − value. */
function isoEnds(value: number) {
  const cAt = (w: number) => 6 * w - 35 - value;
  const wAt = (c: number) => (35 + c + value) / 6;
  const start = wAt(C_MIN) < W_MIN ? [W_MIN, cAt(W_MIN)] : [wAt(C_MIN), C_MIN];
  const end = wAt(C_MAX) > W_MAX ? [W_MAX, cAt(W_MAX)] : [wAt(C_MAX), C_MAX];
  return { start, end };
}

const fmt = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `−${-value}` : "0");

function SavingMap({ scene, zeroBold }: { scene: Scene; zeroBold: boolean }) {
  const halo = { className: "stroke-background", strokeWidth: 3, style: { paintOrder: "stroke" as const } };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      <polygon points={clipBySign(1)} fill={UP} fillOpacity={0.1} />
      <polygon points={clipBySign(-1)} fill={DOWN} fillOpacity={0.1} />
      <rect x={x(W_MIN)} y={y(C_MAX)} width={x(W_MAX) - x(W_MIN)} height={y(C_MIN) - y(C_MAX)} fill="none" stroke={FAINT} strokeWidth={1} />

      {[-20, -10, 0, 10, 20].map((value) => {
        const { start, end } = isoEnds(value);
        const onRight = end[0] === W_MAX;
        return (
          <g key={value}>
            <line x1={x(start[0])} y1={y(start[1])} x2={x(end[0])} y2={y(end[1])} stroke={value === 0 ? PATH : FAINT} strokeWidth={value === 0 ? (zeroBold ? 1.25 : 1) : 0.75} />
            <text x={x(end[0]) + (onRight ? 4 : 0)} y={y(end[1]) + (onRight ? 4 : -6)} textAnchor={onRight ? "start" : "middle"} fontSize={12} fontWeight={value === 0 ? 700 : 400} fill={value === 0 ? PATH : GRAY}>{fmt(value)}</text>
          </g>
        );
      })}

      {[6, 8, 10, 12].map((w) => (
        <g key={w}>
          <line x1={x(w)} x2={x(w)} y1={y(C_MIN)} y2={y(C_MIN) + 4} stroke={FAINT} strokeWidth={1} />
          <text x={x(w)} y={y(C_MIN) + 18} textAnchor="middle" fontSize={12} fill={GRAY}>{w}</text>
        </g>
      ))}
      {[10, 20, 30, 40].map((c) => (
        <g key={c}>
          <line x1={x(W_MIN) - 4} x2={x(W_MIN)} y1={y(c)} y2={y(c)} stroke={FAINT} strokeWidth={1} />
          <text x={x(W_MIN) - 7} y={y(c) + 4} textAnchor="end" fontSize={12} fill={GRAY}>{c}</text>
        </g>
      ))}
      <text x={(x(W_MIN) + x(W_MAX)) / 2} y={H - 6} textAnchor="middle" fontSize={12} fill={GRAY}>주급 w →</text>
      <text x={x(W_MIN) - 7} y={12} textAnchor="start" fontSize={12} fill={GRAY}>↑ 석탄비</text>

      <text x={x(W_MAX) - 6} y={y(C_MIN) - 8} textAnchor="end" fontSize={13} fontWeight={700} fill={UP}>기계가 쌈</text>
      <text x={x(W_MIN) + 6} y={y(C_MAX) + 18} fontSize={13} fontWeight={700} fill={DOWN}>사람이 쌈</text>

      {scene.path && <line x1={x(scene.path[0][0])} y1={y(scene.path[0][1])} x2={x(scene.path[1][0])} y2={y(scene.path[1][1])} stroke={PATH} strokeWidth={1.25} strokeDasharray="4 3" />}
      {scene.pins.map((pin) => {
        const value = saving(pin.w, pin.c);
        const zero = Math.abs(value) < 0.01;
        const color = zero ? PATH : value > 0 ? UP : DOWN;
        return (
          <g key={pin.text}>
            <circle cx={x(pin.w)} cy={y(pin.c)} r={4.5} fill={color} />
            <text x={x(pin.w) + (pin.anchor === "start" ? 8 : -8)} y={y(pin.c) + pin.dy} textAnchor={pin.anchor} fontSize={12} fontWeight={700} fill={color} {...halo}>{pin.text}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function MachineSavingMapViz() {
  return (
    <SceneShell
      eyebrow="두 값이 만드는 지도"
      title="주급과 석탄비가 함께 기계의 손익을 가릅니다"
      description="임금과 에너지는 왜 함께 말할까요? 가로는 주급, 세로는 석탄비입니다. 곧은 선의 숫자는 그 선 위에서 기계가 주당 아끼는 돈이고, 0 선이 손익 문턱입니다."
      note="7절의 설명용 모델을 편 그림이며 영국의 실측값이 아닙니다."
      ariaLabel="주급과 석탄비에 따른 기계의 주당 손익 지도"
      scenes={SCENES}
      render={(index) => <SavingMap scene={SCENES[index]} zeroBold={index === 2} />}
    />
  );
}
