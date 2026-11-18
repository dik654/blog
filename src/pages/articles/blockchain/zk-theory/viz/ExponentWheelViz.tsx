import { useId } from "react";
import SceneShell from "./SceneShell";
import { POW, Q } from "./zkNumbers";

/**
 * 본문 대응: #case, #picture — 2의 거듭제곱을 23으로 나눈 나머지는 11칸 원을 돕니다.
 * 비밀 4 → 공개 16, 고른 10 → 12, 답 10+2×4=18≡7 → 2⁷≡13.
 * 검증자는 지수를 모른 채 값만 곱합니다: 12×16=192≡8, 8×16=128≡13.
 * 마지막 장면은 #picture 둘째 문단의 "후보가 11개뿐" 경우.
 */
const W = 320;
const H = 300;
const CX = 160;
const CY = 150;
const R = 104;
const NODE = 17;

const angle = (k: number) => ((-90 + (k * 360) / Q) * Math.PI) / 180;
const pos = (k: number, radius = R) => ({ x: CX + radius * Math.cos(angle(k)), y: CY + radius * Math.sin(angle(k)) });

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREEN = "#059669";
const GRAY = "#94a3b8";
const INK = "#475569";

interface Scene {
  label: string;
  summary: string;
  note: string;
  lines: readonly [string, string];
  marks: Readonly<Record<number, string>>;
  hops: readonly (readonly [number, number])[];
}

const SCENES: readonly Scene[] = [
  {
    label: "11칸을 돌고 제자리로",
    summary: "2¹¹ ≡ 1 (mod 23)",
    note: "칸 k에는 2를 k번 곱해 23으로 나눈 나머지를 적었습니다. 열 번째 칸 12에 2를 한 번 더 곱하면 24, 나머지 1로 처음 칸에 돌아옵니다. 그래서 지수는 11로 나눈 나머지만 보면 됩니다.",
    lines: ["지수 k: 0 → 1 → … → 10 → 11 ≡ 0", "값: 1 → 2 → … → 12 → 24 ≡ 1"],
    marks: { 0: GRAY, 10: GRAY },
    hops: [[10, 0]],
  },
  {
    label: "비밀 4 → 공개 16",
    summary: "2⁴ = 16",
    note: "비밀은 지수 4이고, 상대에게 공개하는 것은 칸 4의 값 16뿐입니다. 숫자는 모두 설명용 가정입니다.",
    lines: ["비밀 지수: 4 (보내지 않음)", "공개값: 2⁴ = 16"],
    marks: { 4: BLUE },
    hops: [],
  },
  {
    label: "이번에 고른 10 → 먼저 12",
    summary: "2¹⁰ ≡ 12 전송",
    note: "이번 대화에만 쓸 수 10을 고르고, 칸 10의 값 12를 질문보다 먼저 보냅니다.",
    lines: ["이번 대화용 지수: 10 (보내지 않음)", "먼저 보내는 값: 2¹⁰ ≡ 12"],
    marks: { 4: BLUE, 10: AMBER },
    hops: [],
  },
  {
    label: "질문 2에 답 7",
    summary: "10 + 2×4 = 18 ≡ 7",
    note: "질문 2를 받으면 10에서 비밀 4칸만큼 두 번 갑니다. 10 → 14≡3 → 7, 즉 18을 11로 나눈 나머지 7을 답합니다.",
    lines: ["지수: 10 + 4 + 4 = 18 ≡ 7 (mod 11)", "답으로 보내는 수: 7"],
    marks: { 4: BLUE, 10: AMBER, 7: GREEN },
    hops: [[10, 3], [3, 7]],
  },
  {
    label: "검사: 두 길이 같은 칸",
    summary: "2⁷ ≡ 13 ≡ 12×16²",
    note: "검증자는 지수 10과 4를 모릅니다. 받은 12에 공개 16을 질문 수 2만큼 곱해 12 → 8 → 13으로 가고, 따로 2⁷을 계산해 13을 얻습니다. 두 결과가 같은 칸에서 만납니다.",
    lines: ["값으로: 12 × 16 ≡ 8,  8 × 16 ≡ 13", "답으로: 2⁷ ≡ 13 → 같음"],
    marks: { 10: AMBER, 3: GRAY, 7: GREEN },
    hops: [[10, 3], [3, 7]],
  },
  {
    label: "후보가 11개뿐이면",
    summary: "16을 찾을 때까지 11칸 이하",
    note: "이 장난감 숫자에서는 공개 16만 보고 칸을 하나씩 계산해도 다섯 번째 칸(지수 4)에서 16을 찾습니다. 실제 보안에는 훨씬 큰 수가 필요합니다(4절).",
    lines: ["2⁰, 2¹, 2², 2³, 2⁴ = 16 → 지수 4", "후보 수: 11"],
    marks: { 0: GRAY, 1: GRAY, 2: GRAY, 3: GRAY, 4: BLUE },
    hops: [],
  },
];

export default function ExponentWheelViz() {
  const marker = useId().replace(/:/g, "");
  return (
    <SceneShell
      eyebrow="23으로 나눈 나머지"
      title="2의 거듭제곱은 11칸을 돌고 제자리로 옵니다"
      description="원의 칸 k(바깥 작은 숫자)에 2를 k번 곱해 23으로 나눈 나머지(원 안 숫자)를 적었습니다. 지수를 더하는 일은 원을 따라 칸을 옮기는 일이고, 값을 곱하는 일과 같은 칸에 도착합니다. 숫자는 모두 설명용 가정입니다."
      ariaLabel="2의 거듭제곱을 23으로 나눈 나머지가 이루는 11칸 원 위에서 Schnorr 대화의 수를 따라가기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[380px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <defs>
                <marker id={marker} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0 0 L7 4 L0 8" fill="none" stroke={INK} strokeWidth={1.25} />
                </marker>
              </defs>
              <circle cx={CX} cy={CY} r={R} fill="none" stroke={GRAY} strokeWidth={1} opacity={0.5} />
              {scene.hops.map(([from, to]) => {
                const a = pos(from);
                const b = pos(to);
                const len = Math.hypot(b.x - a.x, b.y - a.y);
                const ux = (b.x - a.x) / len;
                const uy = (b.y - a.y) / len;
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={a.x + ux * (NODE + 2)}
                    y1={a.y + uy * (NODE + 2)}
                    x2={b.x - ux * (NODE + 4)}
                    y2={b.y - uy * (NODE + 4)}
                    stroke={INK}
                    strokeWidth={1.25}
                    markerEnd={`url(#${marker})`}
                  />
                );
              })}
              {POW.map((value, k) => {
                const p = pos(k);
                const tag = pos(k, R + NODE + 13);
                const color = scene.marks[k];
                return (
                  <g key={k}>
                    <circle cx={p.x} cy={p.y} r={NODE} fill={color ? color : "none"} fillOpacity={color ? 0.16 : 0} stroke={color ?? GRAY} strokeWidth={color ? 1.25 : 1} />
                    <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={14} fontWeight={color ? 700 : 400} fill={color && color !== GRAY ? color : INK}>
                      {value}
                    </text>
                    <text x={tag.x} y={tag.y + 4} textAnchor="middle" fontSize={10} fill="#64748b">{k}</text>
                  </g>
                );
              })}
              <text x={CX} y={CY - 4} textAnchor="middle" fontSize={11} fill="#64748b">바깥 숫자 = 지수 k</text>
              <text x={CX} y={CY + 13} textAnchor="middle" fontSize={11} fill="#64748b">원 안 = 2ᵏ mod 23</text>
            </svg>
            <div className="mt-2 grid gap-1 rounded-lg border border-border px-3 py-2 text-center font-mono text-xs sm:text-sm">
              <span>{scene.lines[0]}</span>
              <span className="font-semibold text-primary">{scene.lines[1]}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
