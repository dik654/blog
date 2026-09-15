import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: two-costs 절 — 장부에 적히는 값과 실제로 드는 값이 갈라진다 */
const SCENES = [
  "장부에는 이만큼 적힙니다",
  "실제로는 이만큼 듭니다",
  "값은 장부만 보고 정해집니다",
  "그래서 하나가 더 만들어집니다",
] as const;

const WTP = [10, 9, 8, 7, 6, 5] as const;
const MC = [4, 5, 6, 7, 8, 9] as const;
/** 만든 사람 장부에 적히지 않고 제삼자가 지는 값 */
const EXTERNAL = 2;
const PRICE = 7;

const socialCost = (i: number) => MC[i] + EXTERNAL;
const socialGain = (i: number) => WTP[i] - socialCost(i);
const cumSocial = (n: number) =>
  Array.from({ length: n }, (_, i) => socialGain(i)).reduce((a, b) => a + b, 0);

const Q_MARKET = WTP.filter((w) => w >= PRICE).length;
const Q_SOCIAL = WTP.filter((_, i) => socialGain(i) >= 0).length;
const LOSS = cumSocial(Q_SOCIAL) - cumSocial(Q_MARKET);

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const COL = 56;
const X0 = 108;

export default function SocialCostViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;

  const NOTES = [
    `만드는 쪽의 장부에는 재료와 시간과 전기만 적힙니다. 여섯 사람의 드는 값이 ${MC.join(", ")}입니다. 앞 두 글에서 팔려는 줄을 만든 것이 이 숫자들입니다.`,
    `그런데 만들 때마다 ${EXTERNAL}만큼이 제삼자에게 갑니다. 매연이든 소음이든 물이든, 만든 사람이 내지 않고 옆 사람이 집니다. 실제로 드는 값은 ${MC.map((m) => m + EXTERNAL).join(", ")}입니다.`,
    `값은 장부만 보고 정해집니다. 제삼자는 이 시장에 참여하지 않으므로 그의 ${EXTERNAL}은 어느 줄에도 들어가지 않습니다. 그래서 앞 글과 똑같이 값 ${PRICE}에 ${Q_MARKET}개가 거래됩니다.`,
    `실제로 드는 값으로 쌍별 차이를 다시 재면 ${socialGain(0)}, ${socialGain(1)}, ${socialGain(2)}, ${socialGain(3)}입니다. 넷째부터 음수라 ${Q_SOCIAL}개까지가 맞는데 시장은 ${Q_MARKET}개를 만듭니다. 한 개가 더 만들어지고 그만큼인 ${-LOSS}이 사라집니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="값이 무엇을 놓치는가"
      title="장부에 적히지 않은 값은 어느 줄에도 들어가지 않습니다"
      description="제삼자가 지는 값은 사는 쪽에도 파는 쪽에도 없어서, 값이 실제 사정을 잘못 말합니다."
      note="앞 세 글과 같은 시장에 만들 때마다 제삼자가 지는 값을 하나 더한 것입니다. 그 값을 정확히 안다고 둔 계산입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="사적 비용과 사회적 비용의 차이"
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
              <text x={14} y={26} fontSize={8} fontWeight={700} fill={MUTED}>
                장부에 적히는
              </text>
              {MC.map((m, i) => (
                <text key={`m${i}`} x={X0 + i * COL} y={26} fontSize={10} fontWeight={700} fill={ACCENT}>
                  {m}
                </text>
              ))}

              <g opacity={s >= 1 ? 1 : 0.2}>
                <text x={14} y={48} fontSize={8} fontWeight={700} fill={WARN}>
                  제삼자가 지는
                </text>
                {MC.map((_, i) => (
                  <text key={`e${i}`} x={X0 + i * COL} y={48} fontSize={10} fontWeight={700} fill={WARN}>
                    +{EXTERNAL}
                  </text>
                ))}
              </g>

              <g opacity={s >= 1 ? 1 : 0.2}>
                <text x={14} y={70} fontSize={8} fontWeight={700} fill={MUTED}>
                  실제로 드는
                </text>
                {MC.map((_, i) => (
                  <text key={`s${i}`} x={X0 + i * COL} y={70} fontSize={10} fontWeight={700} fill={MUTED}>
                    {socialCost(i)}
                  </text>
                ))}
              </g>

              <line x1={14} y1={82} x2={456} y2={82} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />

              <text x={14} y={102} fontSize={8} fontWeight={700} fill={MUTED}>
                낼 수 있는
              </text>
              {WTP.map((w, i) => {
                const bought = s >= 2 && w >= PRICE;
                return (
                  <text
                    key={`w${i}`}
                    x={X0 + i * COL}
                    y={102}
                    fontSize={10}
                    fontWeight={700}
                    fill={bought ? OK : MUTED}
                    fillOpacity={s >= 2 && !bought ? 0.35 : 1}
                  >
                    {w}
                  </text>
                );
              })}

              {s >= 2 && (
                <>
                  <text x={14} y={124} fontSize={8} fontWeight={700} fill={MUTED}>
                    시장 결과
                  </text>
                  <text x={X0} y={124} fontSize={10} fontWeight={700} fill={ACCENT}>
                    값 {PRICE} · {Q_MARKET}개
                  </text>
                  <text x={X0 + 110} y={124} fontSize={8.5} fill={MUTED}>
                    장부 줄만 보고 정해진 값입니다
                  </text>
                </>
              )}

              {s >= 3 && (
                <>
                  <text x={14} y={148} fontSize={8} fontWeight={700} fill={MUTED}>
                    실제 차이
                  </text>
                  {WTP.map((_, i) => {
                    const g = socialGain(i);
                    return (
                      <text
                        key={`g${i}`}
                        x={X0 + i * COL}
                        y={148}
                        fontSize={9.5}
                        fontWeight={700}
                        fill={g > 0 ? OK : g === 0 ? MUTED : WARN}
                      >
                        {g > 0 ? "+" : ""}
                        {g}
                      </text>
                    );
                  })}
                  <text x={14} y={170} fontSize={9} fontWeight={700} fill={WARN}>
                    맞는 수량은 {Q_SOCIAL}개인데 시장은 {Q_MARKET}개를 만듭니다
                  </text>
                </>
              )}

              <text x={14} y={190} fontSize={9} fontWeight={700} fill={s === 3 ? WARN : MUTED}>
                {s === 3
                  ? `넷째 한 개가 ${-LOSS}만큼 깎아먹습니다 · 값이 그 사실을 말해 주지 않았습니다`
                  : s === 2
                    ? "제삼자는 이 시장에 참여하지 않아 어느 줄에도 없습니다"
                    : s === 1
                      ? "두 줄의 차이가 만들 때마다 누군가에게 갑니다"
                      : "여기까지는 앞 글과 같은 숫자입니다"}
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
