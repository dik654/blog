import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: shift-vs-move 절 — 곡선이 옮겨 간 것과 곡선 위에서 움직인 것은 다르다 */
const SCENES = [
  "기준 · 값 7에 네 개가 거래됩니다",
  "값만 8로 올리면 둘이 남습니다",
  "사려는 마음이 커지면 값 8에 다섯 개",
  "만드는 값이 싸지면 값 6에 다섯 개",
] as const;

const BASE_WTP = [10, 9, 8, 7, 6, 5] as const;
const BASE_MC = [4, 5, 6, 7, 8, 9] as const;

/** 장면마다의 수요·공급 사정과, 그 사정에서 실제로 성립하는 값 */
const CASES = [
  { wtpShift: 0, mcShift: 0, price: 7, moved: "none" },
  { wtpShift: 0, mcShift: 0, price: 8, moved: "none" },
  { wtpShift: 2, mcShift: 0, price: 8, moved: "demand" },
  { wtpShift: 0, mcShift: -2, price: 6, moved: "supply" },
] as const;

const qd = (p: number, shift: number) =>
  BASE_WTP.filter((w) => w + shift >= p).length;
const qs = (p: number, shift: number) =>
  BASE_MC.filter((c) => c + shift <= p).length;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

/** 수량 0~6과 값 2~12를 좌표로 — 파는 계단이 내려가면 2까지 내려간다 */
const V_MIN = 2;
const V_MAX = 12;
const X0 = 78;
const XW = 300;
const Y0 = 160;
const YH = 120;
const px = (q: number) => X0 + (q / 6) * XW;
const py = (v: number) => Y0 - ((v - V_MIN) / (V_MAX - V_MIN)) * YH;

export default function ShiftVsMoveViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const s = scenes.active;
  const c = CASES[s];
  const d = qd(c.price, c.wtpShift);
  const sup = qs(c.price, c.mcShift);
  const cleared = d === sup;

  const demandPts = BASE_WTP.map((w, i) => ({ q: i + 1, v: w + c.wtpShift }));
  const supplyPts = BASE_MC.map((m, i) => ({ q: i + 1, v: m + c.mcShift }));

  const NOTES = [
    `사는 쪽 여섯과 파는 쪽 여섯을 값 순서로 세우면 두 계단이 값 ${CASES[0].price}, 수량 ${qd(CASES[0].price, 0)}에서 만납니다. 앞 그림에서 두 줄의 길이가 같아졌던 그 자리입니다.`,
    `사정은 그대로 두고 값만 ${CASES[1].price}으로 올려 보겠습니다. 점은 같은 계단 위를 미끄러져 사려는 쪽이 ${qd(CASES[1].price, 0)}명으로 줄고 팔려는 쪽은 ${qs(CASES[1].price, 0)}명으로 늡니다. ${qs(CASES[1].price, 0) - qd(CASES[1].price, 0)}명이 못 팔아 값이 다시 내려오므로 이 값은 유지되지 않습니다.`,
    `이번에는 모두가 ${CASES[2].wtpShift}씩 더 낼 뜻이 생겼다고 하겠습니다. 계단 자체가 위로 옮겨 가고 새 만남은 값 ${CASES[2].price}, 수량 ${qd(CASES[2].price, CASES[2].wtpShift)}입니다. 값도 양도 올랐습니다.`,
    `반대로 만드는 값이 ${-CASES[3].mcShift}씩 싸지면 파는 계단이 내려가 값 ${CASES[3].price}, 수량 ${qd(CASES[3].price, 0)}이 됩니다. 앞 장면과 수량은 ${qd(CASES[2].price, CASES[2].wtpShift)}으로 같은데 값은 ${CASES[2].price}과 ${CASES[3].price}으로 반대입니다. 그래서 거래량만 보고는 무엇이 움직였는지 알 수 없습니다.`,
  ] as const;

  const steps = (pts: { q: number; v: number }[], color: string) =>
    pts.map((pt, i) => {
      const prev = pts[i - 1];
      return (
        <g key={`${color}-${pt.q}`}>
          {prev && (
            <path
              d={`M ${px(prev.q)} ${py(prev.v)} L ${px(pt.q)} ${py(prev.v)} L ${px(pt.q)} ${py(pt.v)}`}
              fill="none"
              stroke={color}
              strokeWidth={1.25}
              strokeOpacity={0.55}
            />
          )}
          <circle cx={px(pt.q)} cy={py(pt.v)} r={2.6} fill={color} />
        </g>
      );
    });

  return (
    <VizFrame
      eyebrow="무엇이 움직였는가"
      title="계단 위를 미끄러지는 것과 계단 자체가 옮겨 가는 것은 다릅니다"
      description="값만 바꾸면 같은 계단 위를 움직이고, 사정이 바뀌면 계단이 통째로 옮겨 갑니다."
      note="사는 쪽과 파는 쪽이 여섯씩인 같은 예를 계단으로 옮긴 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="곡선 이동과 곡선 위 이동"
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
              <line x1={X0} y1={Y0} x2={X0} y2={Y0 - YH - 8} stroke={MUTED} strokeWidth={0.75} />
              <text x={X0 - 6} y={Y0 - YH - 10} textAnchor="end" fontSize={8} fill={MUTED}>
                값
              </text>
              <text x={X0 + XW + 6} y={Y0 + 3} fontSize={8} fill={MUTED}>
                수량
              </text>
              {[2, 5, 8, 11].map((v) => (
                <g key={v}>
                  <line x1={X0 - 3} y1={py(v)} x2={X0} y2={py(v)} stroke={MUTED} strokeWidth={0.75} />
                  <text x={X0 - 6} y={py(v) + 3} textAnchor="end" fontSize={7.5} fill={MUTED}>
                    {v}
                  </text>
                </g>
              ))}
              {[2, 4, 6].map((q) => (
                <text key={q} x={px(q)} y={Y0 + 12} textAnchor="middle" fontSize={7.5} fill={MUTED}>
                  {q}
                </text>
              ))}

              {steps(supplyPts, OK)}
              {steps(demandPts, ACCENT)}

              <line
                x1={X0}
                y1={py(c.price)}
                x2={X0 + XW}
                y2={py(c.price)}
                stroke={cleared ? OK : WARN}
                strokeWidth={1.25}
                strokeDasharray={cleared ? undefined : "4 3"}
              />
              <text
                x={X0 + XW + 6}
                y={py(c.price) + 3}
                fontSize={9}
                fontWeight={700}
                fill={cleared ? OK : WARN}
              >
                값 {c.price}
              </text>

              <text x={X0 + 8} y={Y0 - YH - 10} fontSize={8} fontWeight={700} fill={ACCENT}>
                사려는 계단{c.moved === "demand" ? " · 옮겨 감" : ""}
              </text>
              <text x={X0 + 96} y={Y0 - YH - 10} fontSize={8} fontWeight={700} fill={OK}>
                팔려는 계단{c.moved === "supply" ? " · 옮겨 감" : ""}
              </text>

              <text x={X0 + XW + 40} y={52} fontSize={8.5} fontWeight={700} fill={ACCENT}>
                사려는 쪽 {d}
              </text>
              <text x={X0 + XW + 40} y={68} fontSize={8.5} fontWeight={700} fill={OK}>
                팔려는 쪽 {sup}
              </text>
              <text
                x={X0 + XW + 40}
                y={88}
                fontSize={8.5}
                fontWeight={700}
                fill={cleared ? OK : WARN}
              >
                {cleared ? "만납니다" : "어긋납니다"}
              </text>
              {cleared && (
                <text x={X0 + XW + 40} y={104} fontSize={8.5} fontWeight={700} fill={MUTED}>
                  수량 {d}
                </text>
              )}
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
