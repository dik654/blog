import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: congestion 절 — 줄어드는 것을 빼놓을 수 없으면 너무 빨리 쓴다 */
const SCENES = [
  "배가 늘면 한 척의 몫이 줄어듭니다",
  "전체로 보면 네 척에서 가장 큽니다",
  "각자 보면 여덟 척까지 들어옵니다",
  "다섯째 배가 남에게 물리는 값",
] as const;

const MAX_B = 8;
/** 배가 B척일 때 한 척이 건지는 값 */
const perBoat = (b: number) => 12 - b;
/** 배가 B척일 때 호수 전체가 건지는 값 */
const total = (b: number) => b * perBoat(b);
/** 배 한 척을 띄우는 데 드는 값 */
const COST = 4;

const BS = Array.from({ length: MAX_B }, (_, i) => i + 1);
const NET = BS.map((b) => total(b) - COST * b);
const B_BEST = BS[NET.indexOf(Math.max(...NET))];
const B_ENTRY = BS.filter((b) => perBoat(b) >= COST).length;
const FIFTH = B_BEST + 1;
const FIFTH_OWN = perBoat(FIFTH) - COST;
const FIFTH_HARM = B_BEST * (perBoat(B_BEST) - perBoat(FIFTH));

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const COL = 44;
const X0 = 116;

export default function CommonsEntryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;

  const NOTES = [
    `호수에 배가 많아질수록 한 척이 건지는 값이 줄어듭니다. 한 척이면 ${perBoat(1)}이고 여덟 척이면 ${perBoat(MAX_B)}입니다. 가로등과 달리 한 사람이 더 쓰면 남의 몫이 실제로 줄어듭니다.`,
    `호수 전체로 보면 건진 것에서 배 값 ${COST}씩을 뺀 나머지가 ${NET.join(", ")}입니다. ${B_BEST}척에서 ${Math.max(...NET)}으로 가장 크고 그 뒤로는 줄어듭니다. 이것이 맞는 척수입니다.`,
    `그런데 들어오는 사람은 전체를 보지 않고 자기 몫만 봅니다. 한 척이 ${COST} 이상을 건지는 한 들어올 이유가 있으므로 ${B_ENTRY}척까지 들어옵니다. 그 자리에서 호수 전체가 남기는 것은 ${NET[B_ENTRY - 1]}입니다.`,
    `${FIFTH}번째 배 하나만 떼어 보겠습니다. 자기는 ${perBoat(FIFTH)}을 건지고 ${COST}를 썼으니 ${FIFTH_OWN}이 남습니다. 그런데 먼저 있던 ${B_BEST}척이 각각 1씩 줄어 ${FIFTH_HARM}을 잃습니다. 그 ${FIFTH_HARM}은 들어온 사람의 장부에 없습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="줄어드는데 빼놓을 수 없을 때"
      title="들어오는 사람은 자기 몫을 보고 남의 몫이 준 것은 보지 않습니다"
      description="한 사람이 더 쓰면 남의 몫이 주는데 아무도 막을 수 없으면, 전체가 가장 많이 남기는 자리를 지나 계속 들어옵니다."
      note="호수와 배 여덟 척으로 줄인 예입니다. 배마다 실력이 같고 한 척이 건지는 값이 척수에 따라서만 정해진다고 둔 계산입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="공유자원의 진입과 지대 소멸"
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
                배가 몇 척
              </text>
              {BS.map((b) => (
                <text
                  key={`b${b}`}
                  x={X0 + (b - 1) * COL}
                  y={26}
                  fontSize={8}
                  fontWeight={700}
                  fill={MUTED}
                >
                  {b}척
                </text>
              ))}

              <text x={14} y={50} fontSize={8.5} fontWeight={700} fill={ACCENT}>
                한 척이 건지는
              </text>
              {BS.map((b) => (
                <text
                  key={`p${b}`}
                  x={X0 + (b - 1) * COL}
                  y={50}
                  fontSize={10}
                  fontWeight={700}
                  fill={s === 3 && (b === B_BEST || b === FIFTH) ? WARN : ACCENT}
                  fillOpacity={s === 3 && b !== B_BEST && b !== FIFTH ? 0.25 : 1}
                >
                  {perBoat(b)}
                </text>
              ))}

              <line
                x1={14}
                y1={62}
                x2={456}
                y2={62}
                stroke={MUTED}
                strokeWidth={0.75}
                strokeOpacity={0.4}
              />

              <g opacity={s === 1 ? 1 : 0.2} display={s === 3 ? "none" : undefined}>
                <text x={14} y={84} fontSize={8.5} fontWeight={700} fill={OK}>
                  호수 전체가 남기는
                </text>
                {NET.map((n, i) => (
                  <text
                    key={`n${i}`}
                    x={X0 + i * COL}
                    y={84}
                    fontSize={10.5}
                    fontWeight={700}
                    fill={s === 1 && BS[i] === B_BEST ? OK : MUTED}
                  >
                    {n}
                  </text>
                ))}
              </g>

              <g opacity={s === 2 ? 1 : 0.2} display={s === 3 ? "none" : undefined}>
                <text x={14} y={108} fontSize={8.5} fontWeight={700} fill={MUTED}>
                  들어올 이유
                </text>
                {BS.map((b) => {
                  const gain = perBoat(b) - COST;
                  return (
                    <text
                      key={`e${b}`}
                      x={X0 + (b - 1) * COL}
                      y={108}
                      fontSize={10}
                      fontWeight={700}
                      fill={gain > 0 ? WARN : MUTED}
                    >
                      {gain > 0 ? "+" : ""}
                      {gain}
                    </text>
                  );
                })}
              </g>

              {s === 2 && (
                <text x={14} y={130} fontSize={9} fontWeight={700} fill={WARN}>
                  맞는 척수는 {B_BEST}척인데 {B_ENTRY}척까지 들어와 남는 것이 {NET[B_ENTRY - 1]}이 됩니다
                </text>
              )}

              {s === 1 && (
                <text x={14} y={130} fontSize={9} fontWeight={700} fill={OK}>
                  {B_BEST}척에서 {Math.max(...NET)}으로 가장 크고 {B_ENTRY}척에서 {NET[B_ENTRY - 1]}이 됩니다
                </text>
              )}

              {s === 3 && (
                <>
                  <text x={14} y={88} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    자기 장부
                  </text>
                  <text x={X0} y={88} fontSize={10} fontWeight={700} fill={OK}>
                    {perBoat(FIFTH)} &minus; {COST} = +{FIFTH_OWN}
                  </text>
                  <text x={14} y={112} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    남의 장부
                  </text>
                  <text x={X0} y={112} fontSize={10} fontWeight={700} fill={WARN}>
                    {B_BEST}척 &times; 1 = &minus;{FIFTH_HARM}
                  </text>
                  <text x={14} y={136} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    합치면
                  </text>
                  <text x={X0} y={136} fontSize={10} fontWeight={700} fill={WARN}>
                    +{FIFTH_OWN} &minus; {FIFTH_HARM} = &minus;{FIFTH_HARM - FIFTH_OWN}
                  </text>
                  <text x={X0 + 120} y={136} fontSize={8.5} fill={MUTED}>
                    전체가 남기는 것이 {Math.max(...NET)}에서 {NET[FIFTH - 1]}로 줄어든 만큼입니다
                  </text>
                </>
              )}

              <text
                x={14}
                y={186}
                fontSize={9}
                fontWeight={700}
                fill={s === 2 || s === 3 ? WARN : s === 1 ? OK : MUTED}
              >
                {s === 3
                  ? `들어온 사람의 장부에는 +${FIFTH_OWN}만 적히고 ${FIFTH_HARM}은 어디에도 적히지 않습니다`
                  : s === 2
                    ? "자기 몫만 보면 들어오는 것이 맞고, 전체로 보면 틀립니다"
                    : s === 1
                      ? "건진 것에서 배 값을 뺀 나머지입니다"
                      : "한 사람이 더 쓰면 남의 몫이 실제로 줄어듭니다"}
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
