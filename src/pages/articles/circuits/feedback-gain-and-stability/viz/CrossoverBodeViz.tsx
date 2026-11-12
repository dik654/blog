import SceneShell from "./SceneShell";

/**
 * 본문 대응: #delay ~ #margin — 가상 2극 A(s)=100/[(1+s/10)(1+s/100)]의 |A| 곡선이
 * 1/β 선과 만나는 속도(|Aβ|=1)를 찾고, 같은 속도에서 위상을 읽어 −180°까지 남은 각도를 셉니다.
 * β=0.1 → 1/β=10배(20 dB), ω≈78.15 rad/s, 위상 ≈ −120.7°, 여유 ≈ 59.3°.
 * β=0.5 → 1/β=2배(≈6.02 dB), ω≈212.59 rad/s, 위상 ≈ −152.1°, 여유 ≈ 27.9°.
 */

const MAG_TOP = 24;
const MAG_H = 110;
const PH_TOP = 182;
const PH_H = 110;
const VIEW_H = 316;

const magDb = (w: number) => 40 - 10 * Math.log10(1 + (w / 10) ** 2) - 10 * Math.log10(1 + (w / 100) ** 2);
const phaseDeg = (w: number) => -((Math.atan(w / 10) + Math.atan(w / 100)) * 180) / Math.PI;
const yMag = (db: number) => MAG_TOP + ((45 - db) / 65) * MAG_H;
const yPh = (deg: number) => PH_TOP + (-deg / 180) * PH_H;
const OMEGAS = Array.from({ length: 121 }, (_, i) => 10 ** (i / 40));

const CASES = [
  { beta: "0.1", inv: "10배", invDb: 20, w: 78.15, phase: "−120.7°", margin: "59.3°", color: "#2563eb" },
  { beta: "0.5", inv: "2배", invDb: 20 * Math.log10(2), w: 212.59, phase: "−152.1°", margin: "27.9°", color: "#d97706" },
] as const;

const SCENES = [
  {
    label: "증폭기 |A|가 두 경계에서 꺾입니다",
    summary: "40 dB = 100배에서 출발",
    show: [] as number[],
    phase: false,
    note: "가로축은 각주파수 ω(rad/s)이고 한 칸마다 10배씩 커지는 로그 눈금입니다. 세로축 dB는 배율을 20·log10(배율)로 바꾼 값이라 40 dB는 100배, 20 dB는 10배입니다. 10 rad/s를 지나며 줄기 시작하고 100 rad/s를 지나면 더 가파르게 줄어듭니다. 두 경계는 교육용 가정입니다.",
  },
  {
    label: "β=0.1: |A|가 1/β=10배 선과 만납니다",
    summary: "ω ≈ 78.2 rad/s",
    show: [0],
    phase: false,
    note: "|A|=1/β는 |Aβ|=1, 즉 한 바퀴 돈 루프 크기가 1(0 dB)이라는 조건과 같습니다. 1/β=10배는 20 dB이므로 |A| 곡선이 20 dB 선을 지나는 곳을 읽습니다. 본문의 식으로 구한 값은 약 78.2 rad/s입니다.",
  },
  {
    label: "같은 속도에서 각도를 읽습니다",
    summary: "−120.7° → −180°까지 59.3°",
    show: [0],
    phase: true,
    note: "아래 그래프는 두 지연을 더한 루프 위상 −arctan(ω/10)−arctan(ω/100)입니다. 크기가 1인 78.2 rad/s에서 위상은 약 −120.7°이고, −180°까지 남은 약 59.3°를 위상 여유라고 부릅니다(10절에서 정의).",
  },
  {
    label: "β=0.5: 교차점이 오른쪽으로 갑니다",
    summary: "212.6 rad/s · −152.1° · 여유 27.9°",
    show: [0, 1],
    phase: true,
    note: "1/β가 2배(약 6 dB)로 낮아지면 |A| 곡선과 더 오른쪽에서 만납니다. 그 속도에서는 두 번째 지연까지 더 쌓여 위상이 약 −152.1°이고 여유는 약 27.9°로 줄어듭니다. 이 가상 2극 선형 모델에서는 두 경우 모두 안정한 극을 갖지만, 여유가 작은 쪽은 변화 뒤 더 오래 흔들릴 수 있습니다.",
  },
] as const;

const DECADES = [1, 10, 100, 1000] as const;
const MAG_TICKS = [40, 20, 0, -20] as const;
const PH_TICKS = [0, -90, -180] as const;

function Chart({ active, width, x0, className }: { active: number; width: number; x0: number; className: string }) {
  const scene = SCENES[active];
  const x1 = width - 16;
  const xOf = (w: number) => x0 + (Math.log10(w) / 3) * (x1 - x0);
  const magPath = OMEGAS.map((w, i) => `${i === 0 ? "M" : "L"}${xOf(w).toFixed(1)},${yMag(magDb(w)).toFixed(1)}`).join(" ");
  const phPath = OMEGAS.map((w, i) => `${i === 0 ? "M" : "L"}${xOf(w).toFixed(1)},${yPh(phaseDeg(w)).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${VIEW_H}`} className={className} role="img" aria-label={scene.label}>
      <text x={x0} y={14} fontSize={12} fill="#64748b">크기 |A| (dB)</text>
      {MAG_TICKS.map((db) => (
        <g key={`m${db}`}>
          <line x1={x0} x2={x1} y1={yMag(db)} y2={yMag(db)} stroke="#cbd5e1" strokeWidth={0.75} />
          <text x={x0 - 6} y={yMag(db) + 4} fontSize={11} textAnchor="end" fill="#64748b">{db < 0 ? `−${-db}` : db}</text>
        </g>
      ))}
      {scene.phase ? (
        <>
          <text x={x0} y={PH_TOP - 10} fontSize={12} fill="#64748b">루프 위상 (°)</text>
          {PH_TICKS.map((deg) => (
            <g key={`p${deg}`}>
              <line x1={x0} x2={x1} y1={yPh(deg)} y2={yPh(deg)} stroke={deg === -180 ? "#dc2626" : "#cbd5e1"} strokeWidth={deg === -180 ? 1 : 0.75} strokeDasharray={deg === -180 ? "4 3" : undefined} />
              <text x={x0 - 6} y={yPh(deg) + 4} fontSize={11} textAnchor="end" fill={deg === -180 ? "#dc2626" : "#64748b"}>{deg === 0 ? "0" : `−${-deg}`}</text>
            </g>
          ))}
          <path d={phPath} fill="none" stroke="#64748b" strokeWidth={1.25} />
        </>
      ) : (
        <text x={(x0 + x1) / 2} y={PH_TOP + PH_H / 2} fontSize={12} textAnchor="middle" fill="#94a3b8">위상은 크기 1인 속도를 찾은 뒤 읽습니다</text>
      )}
      {DECADES.map((w) => (
        <text key={`x${w}`} x={xOf(w)} y={310} fontSize={11} textAnchor="middle" fill="#64748b">{w}</text>
      ))}
      <text x={x1} y={14} fontSize={11} textAnchor="end" fill="#64748b">가로: ω (rad/s, 로그)</text>
      {active === 0 &&
        [10, 100].map((w) => (
          <g key={`c${w}`}>
            <line x1={xOf(w)} x2={xOf(w)} y1={MAG_TOP} y2={MAG_TOP + MAG_H} stroke="#94a3b8" strokeDasharray="3 3" strokeWidth={1} />
            <text x={xOf(w) + 4} y={MAG_TOP + MAG_H - 6} fontSize={11} fill="#64748b">{w === 10 ? "첫 경계" : "둘째 경계"}</text>
          </g>
        ))}
      <path d={magPath} fill="none" className="stroke-foreground" strokeWidth={1.25} />
      <text x={xOf(1.4)} y={yMag(40) - 5} fontSize={11} className="fill-foreground">|A|</text>
      {scene.show.map((index) => {
        const c = CASES[index];
        const x = xOf(c.w);
        const ph = phaseDeg(c.w);
        const left = index === 0;
        return (
          <g key={c.beta}>
            <line x1={x0} x2={x1} y1={yMag(c.invDb)} y2={yMag(c.invDb)} stroke={c.color} strokeWidth={1} />
            {/* β=0.5 교차점은 오른쪽(약 213 rad/s)에 있어 오른쪽 끝 라벨이 점을 덮으므로 왼쪽 끝에 둡니다. */}
            <text x={left ? x1 - 2 : x0 + 4} y={yMag(c.invDb) - 4} fontSize={11} textAnchor={left ? "end" : "start"} fill={c.color}>{`β=${c.beta}: 1/β=${c.inv}`}</text>
            <line x1={x} x2={x} y1={yMag(c.invDb)} y2={scene.phase ? yPh(ph) : MAG_TOP + MAG_H} stroke={c.color} strokeDasharray="3 3" strokeWidth={1} />
            <circle cx={x} cy={yMag(c.invDb)} r={3.5} fill={c.color} />
            {scene.phase && (
              <>
                <circle cx={x} cy={yPh(ph)} r={3.5} fill={c.color} />
                <rect x={x - 2} y={yPh(ph)} width={4} height={yPh(-180) - yPh(ph)} fill={c.color} opacity={0.35} />
                <text x={left ? x - 6 : x + 6} y={left ? yPh(ph) - 6 : yPh(ph) - 20} fontSize={11} textAnchor={left ? "end" : "start"} fill={c.color}>{c.phase}</text>
                <text x={left ? x - 6 : x + 6} y={left ? (yPh(ph) + yPh(-180)) / 2 + 8 : yPh(ph) - 6} fontSize={11} textAnchor={left ? "end" : "start"} fill={c.color}>{`여유 ${c.margin}`}</text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function CrossoverBodeViz() {
  return (
    <SceneShell
      eyebrow="가상 2극 증폭기 · A(0)=100"
      title="|A|와 1/β가 만나는 속도에서 각도를 읽습니다"
      description="위는 증폭기 이득의 크기, 아래는 루프 위상입니다. 두 극 10·100 rad/s와 β 값은 본문의 교육용 가정입니다."
      note="곡선은 본문의 A(s)=100/[(1+s/10)(1+s/100)]에서 직접 계산했습니다. 포화·부하·기생 성분은 넣지 않았습니다."
      ariaLabel="가상 2극 증폭기의 크기 곡선과 1/β 선의 교차점, 그 속도에서의 위상과 위상 여유"
      scenes={SCENES}
      render={(active) => (
        <>
          <Chart active={active} width={480} x0={56} className="hidden h-auto w-full sm:block" />
          <Chart active={active} width={330} x0={40} className="block h-auto w-full sm:hidden" />
        </>
      )}
    />
  );
}
