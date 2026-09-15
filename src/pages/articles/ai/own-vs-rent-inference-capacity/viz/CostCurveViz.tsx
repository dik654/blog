import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: two-rentals 절 — 상시 임대는 유휴를 청구하고 탄력 임대는 하지 않는다 */
const SCENES = [
  "100퍼센트로 돌린다면",
  "60퍼센트에서 갈립니다",
  "40퍼센트면 더 벌어집니다",
  "손익분기는 탄력 임대와의 사이에만",
] as const;

/** HGX H200 8-GPU 노드 한 대의 월 비용 (달러) */
const OWN_MONTHLY = 14650;
const RESERVED_MONTHLY = 26500;
/** 탄력 임대의 시간당 단가 */
const ELASTIC_HR = 4.6;
const HOURS = 720;
const GPUS = 8;

const own = (u: number) => OWN_MONTHLY / (HOURS * GPUS * u);
const reserved = (u: number) => RESERVED_MONTHLY / (HOURS * GPUS * u);
const elastic = () => ELASTIC_HR;
/** 소유와 탄력 임대가 같아지는 가동률 */
const BREAK_EVEN = OWN_MONTHLY / (ELASTIC_HR * HOURS * GPUS);

const SCENE_U = [1, 0.6, 0.4, BREAK_EVEN] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const usd = (v: number) => "$" + v.toFixed(2);
const pc = (v: number) => `${Math.round(v * 1000) / 10}`;

const X0 = 74;
const XW = 330;
const Y0 = 150;
const YH = 112;
/** 가동률 0.25~1.0을 x로, $0~12를 y로 */
const px = (u: number) => X0 + ((u - 0.25) / 0.75) * XW;
const py = (v: number) => Y0 - (Math.min(v, 12) / 12) * YH;

/** 축 위(12달러)를 넘는 구간은 그리지 않는다. 잘라서 평평하게 그리면 없는 평탄 구간처럼 보인다. */
const curve = (f: (u: number) => number) =>
  Array.from({ length: 76 }, (_, i) => 0.25 + (i / 75) * 0.75)
    .filter((u) => f(u) <= 12)
    .map((u) => `${px(u).toFixed(1)} ${py(f(u)).toFixed(1)}`)
    .join(" L ");

export default function CostCurveViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;
  const u = SCENE_U[s];

  const NOTES = [
    `한 대를 쉬지 않고 돌리면 소유는 ${usd(own(1))}, 상시 임대는 ${usd(reserved(1))}, 탄력 임대도 ${usd(elastic())}입니다. 유휴가 없으므로 두 임대가 같은 값이고, 여기서만 임대 두 종류를 구분하지 않아도 됩니다.`,
    `가동률이 ${pc(0.6)}퍼센트로 내려가면 갈립니다. 소유는 ${usd(own(0.6))}, 상시 임대는 ${usd(reserved(0.6))}이 되는데 탄력 임대는 ${usd(elastic())} 그대로입니다. 상시 임대도 유휴 시간을 청구하므로 같은 페널티를 받기 때문입니다.`,
    `${pc(0.4)}퍼센트에서는 소유 ${usd(own(0.4))}, 상시 임대 ${usd(reserved(0.4))}입니다. 상시 임대와 견주면 소유는 어떤 가동률에서도 쌉니다. 두 선이 만나지 않으므로 여기에는 손익분기라는 것이 없습니다.`,
    `손익분기가 있는 것은 탄력 임대와의 사이뿐이고 그 자리가 ${pc(BREAK_EVEN)}퍼센트입니다. 이 아래면 필요할 때만 빌리는 편이 싸고 위면 사는 편이 쌉니다. 기동 시간과 최소 청구가 붙으면 이 선은 더 올라갑니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="같은 표를 어떤 자로 읽는가"
      title="임대 두 종류 가운데 하나만 가동률에 나뉩니다"
      description="월 단위로 잡아 둔 임대는 유휴 시간도 청구되므로 소유와 같은 페널티를 받고, 필요할 때만 빌리는 임대는 받지 않습니다."
      note="H200 8-GPU 노드 한 대의 공개 시세 기준 예시입니다. 금융비용·설치·유지보수·인건비·예비 용량은 넣지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="가동률에 따른 소유와 두 임대의 단가"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[s]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <line x1={X0} y1={Y0} x2={X0 + XW} y2={Y0} stroke={MUTED} strokeWidth={0.75} />
              <line x1={X0} y1={Y0} x2={X0} y2={Y0 - YH - 6} stroke={MUTED} strokeWidth={0.75} />
              <text x={14} y={Y0 - YH - 8} fontSize={8} fontWeight={700} fill={MUTED}>
                GPU 한 시간당
              </text>
              {[0, 4, 8, 12].map((v) => (
                <g key={v}>
                  <line x1={X0 - 3} y1={py(v)} x2={X0} y2={py(v)} stroke={MUTED} strokeWidth={0.75} />
                  <text x={X0 - 6} y={py(v) + 3} textAnchor="end" fontSize={7.5} fill={MUTED}>
                    ${v}
                  </text>
                </g>
              ))}
              {[0.25, 0.5, 0.75, 1].map((t) => (
                <text key={t} x={px(t)} y={Y0 + 12} textAnchor="middle" fontSize={7.5} fill={MUTED}>
                  {pc(t)}%
                </text>
              ))}
              <text x={X0 + XW + 6} y={Y0 + 3} fontSize={8} fill={MUTED}>
                가동률
              </text>

              <path d={`M ${curve(reserved)}`} fill="none" stroke={WARN} strokeWidth={1.25} />
              <path d={`M ${curve(own)}`} fill="none" stroke={ACCENT} strokeWidth={1.25} />
              <line x1={px(0.25)} y1={py(ELASTIC_HR)} x2={px(1)} y2={py(ELASTIC_HR)} stroke={OK} strokeWidth={1.25} />

              <text x={px(0.72)} y={py(reserved(0.72)) - 5} fontSize={8} fontWeight={700} fill={WARN}>
                상시 임대
              </text>
              <text x={px(0.9)} y={py(own(0.9)) - 6} textAnchor="end" fontSize={8} fontWeight={700} fill={ACCENT}>
                소유
              </text>
              <text x={px(0.3)} y={py(ELASTIC_HR) - 6} fontSize={8} fontWeight={700} fill={OK}>
                탄력 임대
              </text>

              {s === SCENES.length - 1 && (
                <circle cx={px(BREAK_EVEN)} cy={py(own(BREAK_EVEN))} r={4} fill={ACCENT} />
              )}
              <line
                x1={px(u)}
                y1={Y0 - YH - 4}
                x2={px(u)}
                y2={Y0}
                stroke={MUTED}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text x={px(u)} y={Y0 - YH - 8} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                {pc(u)}%
              </text>

              <text x={X0 + XW + 14} y={40} fontSize={8} fontWeight={700} fill={ACCENT}>
                소유
              </text>
              <text x={X0 + XW + 14} y={53} fontSize={10} fontWeight={700} fill={ACCENT}>
                {usd(own(u))}
              </text>
              <text x={X0 + XW + 14} y={74} fontSize={8} fontWeight={700} fill={WARN}>
                상시 임대
              </text>
              <text x={X0 + XW + 14} y={87} fontSize={10} fontWeight={700} fill={WARN}>
                {usd(reserved(u))}
              </text>
              <text x={X0 + XW + 14} y={108} fontSize={8} fontWeight={700} fill={OK}>
                탄력 임대
              </text>
              <text x={X0 + XW + 14} y={121} fontSize={10} fontWeight={700} fill={OK}>
                {usd(elastic())}
              </text>

              <text x={14} y={180} fontSize={9} fontWeight={700} fill={MUTED}>
                {s === SCENES.length - 1
                  ? `소유와 탄력 임대가 만나는 가동률 ${pc(BREAK_EVEN)}퍼센트`
                  : `상시 임대와 소유의 차이 ${usd(reserved(u) - own(u))} · 상시 임대가 ${((reserved(u) / own(u) - 1) * 100).toFixed(0)}퍼센트 비쌈`}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
