import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: adjustment 절 — 남는 쪽이 값을 밀어 두 줄의 길이가 같아진다 */
const SCENES = [
  "값 5 · 사려는 쪽이 넘칩니다",
  "값 6 · 아직 모자랍니다",
  "값 7 · 두 줄이 같아집니다",
  "값 9였다면 반대로 내려옵니다",
] as const;

/** 사려는 여섯 사람이 낼 수 있는 최대 금액 (천원) */
const BUYERS = [10, 9, 8, 7, 6, 5] as const;
/** 팔려는 여섯 사람이 한 개를 더 만드는 데 드는 값 (천원) */
const SELLERS = [4, 5, 6, 7, 8, 9] as const;

const PRICES = [5, 6, 7, 9] as const;

const qd = (p: number) => BUYERS.filter((w) => w >= p).length;
const qs = (p: number) => SELLERS.filter((c) => c <= p).length;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const L_X = 112;
const R_X = 300;
const ROW_H = 21;

export default function MarketLadderViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const s = scenes.active;
  const p = PRICES[s];
  const d = qd(p);
  const sup = qs(p);
  const gap = d - sup;

  const NOTES = [
    `값이 ${PRICES[0]}이면 여섯 명 모두 살 뜻이 있는데 팔 뜻이 있는 사람은 ${qs(PRICES[0])}명뿐입니다. ${qd(PRICES[0]) - qs(PRICES[0])}명이 못 삽니다. 못 산 사람 중에는 더 낼 뜻이 있는 사람이 있으므로 값이 올라갑니다.`,
    `값이 ${PRICES[1]}이 되면 ${PRICES[1]}을 못 내는 한 명이 줄을 떠나고 팔려는 사람은 ${qs(PRICES[1])}명으로 늘어 차이가 ${qd(PRICES[1]) - qs(PRICES[1])}명으로 줄어듭니다. 아직 못 사는 사람이 있으니 값은 더 올라갑니다.`,
    `값이 ${PRICES[2]}이면 양쪽이 ${qd(PRICES[2])}명으로 같아집니다. 못 사서 값을 올릴 사람도, 못 팔아서 값을 내릴 사람도 없습니다. 아무도 이 숫자를 정하지 않았는데 더 움직일 이유가 사라졌습니다.`,
    `반대쪽에서 시작해도 같은 자리로 옵니다. 값이 ${PRICES[3]}이면 팔려는 사람이 ${qs(PRICES[3])}명인데 살 사람은 ${qd(PRICES[3])}명뿐이라 ${qs(PRICES[3]) - qd(PRICES[3])}명이 못 팝니다. 못 판 사람이 값을 깎으면서 다시 ${PRICES[2]}으로 내려옵니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="아무도 정하지 않는데 하나로 정해진다"
      title="남는 쪽이 값을 밀어서 두 줄의 길이가 같아집니다"
      description="사려는 사람은 낼 수 있는 금액 순으로, 팔려는 사람은 드는 값 순으로 줄을 섭니다."
      note="사는 사람과 파는 사람이 여섯씩이고 각자 한 개만 거래하는 경우로 줄인 예입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="값에 따라 남는 쪽이 갈리는 모습"
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
              <text x={L_X} y={20} fontSize={8.5} fontWeight={700} fill={MUTED}>
                사려는 사람 · 낼 수 있는 값
              </text>
              <text x={R_X} y={20} fontSize={8.5} fontWeight={700} fill={MUTED}>
                팔려는 사람 · 드는 값
              </text>

              {BUYERS.map((w, i) => {
                const y = 32 + i * ROW_H;
                const active = w >= p;
                return (
                  <g key={`b${i}`}>
                    <rect
                      x={L_X}
                      y={y}
                      width={110}
                      height={15}
                      fill={active ? ACCENT : MUTED}
                      fillOpacity={active ? 0.32 : 0.1}
                      stroke={active ? ACCENT : MUTED}
                      strokeWidth={1}
                      strokeOpacity={active ? 1 : 0.35}
                    />
                    <text
                      x={L_X + 8}
                      y={y + 11}
                      fontSize={9}
                      fontWeight={700}
                      fill={active ? ACCENT : MUTED}
                      fillOpacity={active ? 1 : 0.5}
                    >
                      {w}까지 낼 수 있음
                    </text>
                    {!active && (
                      <text
                        x={L_X + 104}
                        y={y + 11}
                        textAnchor="end"
                        fontSize={8}
                        fill={MUTED}
                        fillOpacity={0.7}
                      >
                        떠남
                      </text>
                    )}
                  </g>
                );
              })}

              {SELLERS.map((c, i) => {
                const y = 32 + i * ROW_H;
                const active = c <= p;
                return (
                  <g key={`s${i}`}>
                    <rect
                      x={R_X}
                      y={y}
                      width={110}
                      height={15}
                      fill={active ? OK : MUTED}
                      fillOpacity={active ? 0.3 : 0.1}
                      stroke={active ? OK : MUTED}
                      strokeWidth={1}
                      strokeOpacity={active ? 1 : 0.35}
                    />
                    <text
                      x={R_X + 8}
                      y={y + 11}
                      fontSize={9}
                      fontWeight={700}
                      fill={active ? OK : MUTED}
                      fillOpacity={active ? 1 : 0.5}
                    >
                      {c}이 듦
                    </text>
                    {!active && (
                      <text
                        x={R_X + 104}
                        y={y + 11}
                        textAnchor="end"
                        fontSize={8}
                        fill={MUTED}
                        fillOpacity={0.7}
                      >
                        안 팖
                      </text>
                    )}
                  </g>
                );
              })}

              <text x={240} y={20} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                값 {p}
              </text>
              <line x1={240} y1={26} x2={240} y2={158} stroke={MUTED} strokeWidth={0.75} strokeDasharray="3 3" />

              <text x={L_X} y={178} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                사려는 쪽 {d}명
              </text>
              <text x={R_X} y={178} fontSize={9.5} fontWeight={700} fill={OK}>
                팔려는 쪽 {sup}명
              </text>
              <text
                x={L_X}
                y={194}
                fontSize={9.5}
                fontWeight={700}
                fill={gap === 0 ? OK : WARN}
              >
                {gap === 0
                  ? "차이 0 · 값이 더 움직일 이유가 없습니다"
                  : gap > 0
                    ? `${gap}명이 못 삽니다 · 값이 올라갑니다`
                    : `${-gap}명이 못 팝니다 · 값이 내려갑니다`}
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
