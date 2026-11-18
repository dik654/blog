import SceneShell from "./SceneShell";

/**
 * 본문 대응: #restart-state — t_i=T_i이면 t_{i+1}=0, T_{i+1}=mT_i.
 * 본문 값: T₀=900, m=2 → T₁=1,800, ηmax=.1, ηmin=.001.
 * 두 번째 cycle은 global update 900에서 시작해 900+1,800=2,700에서 끝납니다(산술).
 * run이 두 cycle만 돈다는 것은 global 비율을 보이려는 가정입니다.
 */
const ETA_MAX = 0.1;
const ETA_MIN = 0.001;
const T0 = 900;
const M = 2;
const T1 = M * T0;
const END = T0 + T1;

const X0 = 50;
const X1 = 340;
const Y_TOP = 26;
const Y_BOTTOM = 118;

const x = (t: number) => X0 + ((X1 - X0) * t) / END;
const y = (eta: number) => Y_BOTTOM - ((Y_BOTTOM - Y_TOP) * (eta - ETA_MIN)) / (ETA_MAX - ETA_MIN);
const cosineEta = (r: number) => ETA_MIN + ((ETA_MAX - ETA_MIN) * (1 + Math.cos(Math.PI * r))) / 2;

const cyclePath = (start: number, length: number) =>
  Array.from({ length: 61 }, (_, i) => {
    const r = i / 60;
    return `${i === 0 ? "M" : "L"}${x(start + r * length).toFixed(1)} ${y(cosineEta(r)).toFixed(1)}`;
  }).join(" ");

const SCENES = [
  {
    label: "global 450 = cycle 0의 중간",
    summary: "local r = 450/900 = .5",
    at: 450,
    cells: ["450", "450 / T₀=900", ".5", ".0505", "450/2,700 ≈ .167"],
    note: "첫 cycle에서는 global t와 local t가 같고 r=.5라 η=.0505입니다. global t÷2,700(가정)은 .167로 r과 다릅니다.",
  },
  {
    label: "global 900 = 경계",
    summary: "t₀=T₀ ⇒ t₁=0, T₁=2×900",
    at: 900,
    cells: ["900", "900→0 (T₁=1,800)", "1 → 0", ".001 → .1", "900/2,700 ≈ .333"],
    note: "local cursor가 T₀=900에 닿으면 0으로 돌아가고 다음 길이는 m=2를 곱한 1,800입니다. global t는 계속 셉니다.",
  },
  {
    label: "global 1,800 = cycle 1의 중간",
    summary: "local r = 900/1,800 = .5",
    at: 1800,
    cells: ["1,800", "900 / T₁=1,800", ".5", ".0505", "1,800/2,700 ≈ .667"],
    note: "global 1,800은 cycle 1의 local t=900입니다. r=.5라 η는 다시 .0505입니다. cosine에 들어가는 값은 global 비율 .667이 아니라 local r입니다.",
  },
] as const;

const CELL_NAMES = ["global t", "local t / Tᵢ", "local r", "η", "global t ÷ 2,700 (가정)"] as const;

export default function GlobalLocalClockViz() {
  return (
    <SceneShell
      eyebrow="두 개의 시계"
      title="global update는 계속 세고, cycle cursor만 0으로 돌아갑니다"
      description="곡선은 본문의 ηmax=.1·ηmin=.001·T₀=900·m=2로 그린 LR입니다. 가로축은 global update이며 run이 두 cycle(2,700 update)에서 끝난다고 가정했습니다."
      ariaLabel="warm restart에서 global update와 cycle-local cursor가 어떻게 다르게 움직이는지"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const mx = x(scene.at);
        return (
          <div className="min-w-0">
            <svg
              viewBox="0 0 360 202"
              role="img"
              aria-label={`${scene.label}: ${scene.summary}`}
              className="mx-auto block h-auto w-full max-w-[460px] text-foreground"
            >
              <text x={X0 - 6} y={Y_TOP + 4} textAnchor="end" className="text-[14px] sm:text-[9px]" fill="#64748b">.1</text>
              <text x={X0 - 6} y={Y_BOTTOM + 4} textAnchor="end" className="text-[14px] sm:text-[9px]" fill="#64748b">.001</text>
              <line x1={X0} x2={X1} y1={Y_BOTTOM} y2={Y_BOTTOM} stroke="#94a3b8" strokeWidth={1} />
              <line x1={X0} x2={X0} y1={Y_TOP} y2={Y_BOTTOM} stroke="#94a3b8" strokeWidth={1} />
              <line x1={x(T0)} x2={x(T0)} y1={Y_TOP} y2={Y_BOTTOM} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <path d={cyclePath(0, T0)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <path d={cyclePath(T0, T1)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <line x1={mx} x2={mx} y1={Y_TOP - 6} y2={Y_BOTTOM} stroke="#d97706" strokeWidth={1} />
              {active === 1 ? (
                <>
                  <circle cx={mx} cy={y(ETA_MIN)} r={4} fill="#2563eb" />
                  <circle cx={mx} cy={y(ETA_MAX)} r={4} fill="#2563eb" />
                </>
              ) : (
                <circle cx={mx} cy={y(cosineEta(0.5))} r={4} fill="#2563eb" />
              )}
              {[0, 900, 1800, 2700].map((t) => (
                <text key={t} x={x(t)} y={Y_BOTTOM + 13} textAnchor="middle" className="text-[14px] sm:text-[9px]" fill="#64748b">
                  {t.toLocaleString("en-US")}
                </text>
              ))}
              <text x={X0 - 4} y={156} textAnchor="end" className="text-[14px] sm:text-[9px]" fill="#64748b">global</text>
              <rect x={X0} y={150} width={X1 - X0} height={6} fill="#e2e8f0" />
              <rect x={X0} y={150} width={mx - X0} height={6} fill="#64748b" />
              <text x={X0 - 4} y={180} textAnchor="end" className="text-[14px] sm:text-[9px]" fill="#64748b">local</text>
              <rect x={x(0)} y={174} width={x(T0) - x(0) - 1} height={6} fill="#dbeafe" stroke="#2563eb" strokeWidth={0.5} />
              <rect x={x(T0) + 1} y={174} width={x(END) - x(T0) - 1} height={6} fill="#dbeafe" stroke="#2563eb" strokeWidth={0.5} />
              <rect
                x={active === 2 ? x(T0) + 1 : x(0)}
                y={174}
                width={active === 2 ? mx - x(T0) - 1 : mx - x(0) - 1}
                height={6}
                fill="#2563eb"
              />
              <text x={x(T0 / 2)} y={196} textAnchor="middle" className="text-[14px] sm:text-[9px]" fill="#2563eb">cycle 0 · T₀=900</text>
              <text x={x(T0 + T1 / 2)} y={196} textAnchor="middle" className="text-[14px] sm:text-[9px]" fill="#2563eb">cycle 1 · T₁=1,800</text>
            </svg>
            <dl className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs sm:grid-cols-5">
              {CELL_NAMES.map((name, index) => (
                <div key={name} className={`min-w-0 rounded-md border border-border px-2 py-1 ${index === 4 ? "col-span-2 sm:col-span-1" : ""}`}>
                  <dt className="leading-4 text-muted-foreground">{name}</dt>
                  <dd className="mt-0.5 break-keep font-mono font-bold leading-5">{scene.cells[index]}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      }}
    />
  );
}
