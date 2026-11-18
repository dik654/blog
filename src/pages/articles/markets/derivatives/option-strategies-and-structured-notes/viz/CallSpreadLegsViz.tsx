import SceneShell from "./SceneShell";
import type { ShellScene } from "./SceneShell";

/**
 * 본문 대응: #mechanism — 100 콜 매수 + 120 콜 매도의 만기 지급(옵션값 지불 전).
 * 산 콜 max(S−100,0), 판 콜 −max(S−120,0), 합 0 / S−100 / 20.
 * 검산: 90 → 0, 110 → 10, 130 → 30 − 10 = 20. 가로축 80~140은 그리기 범위(가정).
 */
const S_MIN = 80;
const S_MAX = 140;
const V_MIN = -25;
const V_MAX = 45;
const W = 360;
const H = 236;
const LEFT = 40;
const RIGHT = 344;
const TOP = 30;
const BOTTOM = 200;
const sx = (s: number) => LEFT + ((s - S_MIN) / (S_MAX - S_MIN)) * (RIGHT - LEFT);
const vy = (v: number) => TOP + ((V_MAX - v) / (V_MAX - V_MIN)) * (BOTTOM - TOP);

const longCall = (s: number) => Math.max(s - 100, 0);
const shortCall = (s: number) => -Math.max(s - 120, 0);
const spread = (s: number) => longCall(s) + shortCall(s);
const KINKS = [S_MIN, 100, 120, S_MAX] as const;
const line = (f: (s: number) => number) => KINKS.map((s) => `${sx(s)},${vy(f(s))}`).join(" ");

const CHECKS = [90, 110, 130] as const;

const SCENES: readonly ShellScene[] = [
  { label: "100 콜을 삽니다", summary: "지수가 100을 넘은 만큼 받음", note: "100에 살 권리이므로 지수가 100 이하이면 0이고, 그 위로는 오른 만큼 받습니다. 혼자서는 위쪽에 끝이 없습니다." },
  { label: "120 콜을 팝니다", summary: "120을 넘은 만큼 내줌", note: "판 콜은 반대 방향입니다. 지수가 120 이하이면 내줄 돈이 없고, 120을 넘으면 넘은 만큼 산 사람에게 내줍니다." },
  { label: "둘을 더하면 세 구간", summary: "0 → 상승분 → 20 고정", note: "100 이하에서는 두 콜이 모두 0입니다. 100과 120 사이에서는 낮은 행사가 콜만 가치가 생겨 상승분을 받습니다. 120 위에서는 산 콜의 이익과 판 콜의 손실이 함께 늘어 순지급이 20에 고정됩니다." },
  { label: "검산: 90 · 110 · 130", summary: "0 · 10 · 30−10=20", note: "복습 질문의 세 지수를 넣으면 90은 0, 110은 10, 130은 산 콜 30에서 판 콜 10을 빼 20입니다. 여기에 채권의 100과 수수료, 참여율을 더하면 구조화채권의 만기 지급이 됩니다." },
];

function SpreadPlot({ scene }: { scene: number }) {
  const showLong = scene === 0 || scene === 2;
  const showShort = scene === 1 || scene === 2;
  const showSum = scene >= 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
      {scene === 2 && (
        <g fontSize={10} fill="#475569">
          <rect x={LEFT} y={TOP} width={sx(100) - LEFT} height={BOTTOM - TOP} fill="#94a3b8" opacity={0.08} />
          <rect x={sx(120)} y={TOP} width={RIGHT - sx(120)} height={BOTTOM - TOP} fill="#94a3b8" opacity={0.08} />
          <text x={(LEFT + sx(100)) / 2} y={TOP + 12} textAnchor="middle">0</text>
          <text x={(sx(100) + sx(120)) / 2} y={TOP + 12} textAnchor="middle">상승분</text>
          <text x={(sx(120) + RIGHT) / 2} y={TOP + 12} textAnchor="middle">20 고정</text>
        </g>
      )}
      <line x1={LEFT} x2={RIGHT} y1={vy(0)} y2={vy(0)} stroke="#94a3b8" strokeWidth={1} />
      <line x1={LEFT} x2={LEFT} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
      {[-20, 0, 20, 40].map((v) => (
        <text key={v} x={LEFT - 6} y={vy(v) + 4} textAnchor="end" fontSize={10} fill="#64748b">{v > 0 ? `+${v}` : v < 0 ? `−${Math.abs(v)}` : "0"}</text>
      ))}
      {[80, 100, 120, 140].map((s) => (
        <text key={s} x={sx(s)} y={BOTTOM + 14} textAnchor="middle" fontSize={10} fill="#64748b">{s}</text>
      ))}
      <text x={RIGHT} y={BOTTOM + 30} textAnchor="end" fontSize={11} fill="#475569">만기 지수 →</text>
      <text x={LEFT} y={TOP - 12} fontSize={11} fill="#475569">만기 지급</text>
      {showLong && <polyline points={line(longCall)} fill="none" stroke="#16a34a" strokeWidth={scene === 0 ? 1.25 : 1} strokeDasharray={scene === 0 ? undefined : "4 3"} />}
      {showShort && <polyline points={line(shortCall)} fill="none" stroke="#dc2626" strokeWidth={scene === 1 ? 1.25 : 1} strokeDasharray={scene === 1 ? undefined : "4 3"} />}
      {showSum && <polyline points={line(spread)} fill="none" stroke="#2563eb" strokeWidth={1.25} />}
      {showLong && (scene as number) !== 3 && <text x={sx(138)} y={vy(longCall(138)) + 14} textAnchor="end" fontSize={11} fill="#15803d">산 100 콜</text>}
      {showShort && (scene as number) !== 3 && <text x={sx(138)} y={vy(shortCall(138)) - 8} textAnchor="end" fontSize={11} fill="#b91c1c">판 120 콜</text>}
      {showSum && scene !== 3 && <text x={sx(132)} y={vy(20) - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">합</text>}
      {scene === 3 &&
        CHECKS.map((s) => (
          <g key={s}>
            <line x1={sx(s)} x2={sx(s)} y1={vy(0)} y2={vy(spread(s))} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 2" />
            <circle cx={sx(s)} cy={vy(spread(s))} r={4} fill="#2563eb" />
            <text x={sx(s)} y={vy(spread(s)) - 9} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f172a">{`${s} → ${spread(s)}`}</text>
          </g>
        ))}
      <g fontSize={10} fill="#475569">
        <line x1={150} x2={164} y1={14} y2={14} stroke="#16a34a" strokeWidth={1.25} />
        <text x={168} y={18}>산 콜</text>
        <line x1={206} x2={220} y1={14} y2={14} stroke="#dc2626" strokeWidth={1.25} />
        <text x={224} y={18}>판 콜</text>
        <line x1={262} x2={276} y1={14} y2={14} stroke="#2563eb" strokeWidth={1.25} />
        <text x={280} y={18}>합</text>
      </g>
    </svg>
  );
}

export default function CallSpreadLegsViz() {
  return (
    <SceneShell
      eyebrow="콜스프레드의 세 구간"
      title="산 콜과 판 콜을 더하면 지급이 20에서 멈춥니다"
      description="콜은 정한 가격(행사가격)에 살 권리이고, 그림은 옵션값을 내기 전의 만기 지급입니다. 가로축 80~140은 그리기 범위(가정)이며 숫자는 본문의 100·120 사례입니다."
      ariaLabel="100 콜 매수와 120 콜 매도의 만기 지급과 그 합"
      scenes={SCENES}
      render={(index) => <SpreadPlot scene={index} />}
    />
  );
}
