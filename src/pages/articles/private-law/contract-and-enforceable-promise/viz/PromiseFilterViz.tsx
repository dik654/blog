import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·which-promises — 어떤 약속이 법의 힘을 얻는가 */
const SCENES = [
  "약속은 많고 대부분은 그냥 약속이다",
  "먼저 서로 같은 것을 말했는지 본다",
  "다음은 진지하게 묶일 뜻이 있었는지다",
  "마지막으로 내용이 정해지고 허용되는지 본다",
] as const;

const NOTES = [
  "사람들은 하루에도 여러 번 약속합니다. 그 가운데 어긴다고 법원에 갈 수 있는 것은 아주 일부입니다. 걸러 내는 체가 몇 개 있다는 뜻입니다.",
  "첫째 체는 합의입니다. 한쪽이 판 것과 다른 쪽이 산 것이 다르면 애초에 같은 약속이 아닙니다. 값을 말하지 않았거나 서로 다른 물건을 떠올렸다면 여기서 걸립니다.",
  "둘째 체는 묶일 뜻입니다. 저녁을 사겠다는 말과 물건을 대겠다는 계약은 말의 형태가 같아도 법에 기대겠다는 뜻이 다릅니다. 대가가 오갔는지와 형식을 갖췄는지가 그 뜻을 보여 주는 표지로 쓰입니다.",
  "셋째와 넷째 체는 내용입니다. 무엇을 언제 얼마에 할지가 정해져야 어겼는지를 판정할 수 있고, 금지된 것을 하기로 한 약속은 지켜 줄 수 없습니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const FILTERS = [
  { label: "합의", detail: "서로 같은 것을 말했는가" },
  { label: "묶일 뜻", detail: "법에 기대겠다는 뜻이 있었는가" },
  { label: "확정성", detail: "무엇을 언제 얼마에 하는가" },
  { label: "적법성", detail: "금지된 것을 하기로 하지 않았는가" },
] as const;

/** 각 약속이 몇 번째 체에서 걸리는지. 4면 전부 통과 */
const PROMISES = [
  { label: "물건을 대기로 함", passes: 4 },
  { label: "값을 안 정하고 사기로 함", passes: 2 },
  { label: "저녁을 사겠다는 말", passes: 1 },
  { label: "서로 다른 물건을 떠올림", passes: 0 },
  { label: "금지된 것을 하기로 함", passes: 3 },
] as const;

const FX = 150;
const FW = 72;
const FGAP = 8;

export default function PromiseFilterViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const active = step === 0 ? 0 : step === 1 ? 1 : step === 2 ? 2 : 4;

  return (
    <VizFrame
      eyebrow="걸러지는 약속"
      title="법이 지켜 주는 약속은 전체 가운데 일부입니다"
      description="체를 몇 개 두고 통과한 것만 어겼을 때 물릴 수 있게 합니다."
      note="체를 넷으로 줄인 그림이며 순서도 설명을 위한 것입니다. 실제로는 어느 요건이 먼저 다투어지는지가 사건마다 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="약속이 법의 힘을 얻기까지 거치는 체"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text x={20} y={26} fontSize={9} fontWeight={700} fill={MUTED}>
                약속
              </text>
              {PROMISES.map((p, i) => {
                const y = 40 + i * 24;
                const blocked = p.passes < active;
                const passed = active > 0 && p.passes >= active;
                const color = active === 0 ? MUTED : blocked ? WARN : passed ? OK : MUTED;
                return (
                  <g key={p.label}>
                    <circle cx={26} cy={y} r={4} fill={color} fillOpacity={0.8} />
                    <text x={36} y={y + 4} fontSize={8.5} fontWeight={blocked || passed ? 700 : 400} fill={color}>
                      {p.label}
                    </text>
                  </g>
                );
              })}

              {FILTERS.map((f, i) => {
                const shown = i < active;
                const x = FX + i * (FW + FGAP);
                return (
                  <g key={f.label}>
                    <rect
                      x={x}
                      y={36}
                      width={FW}
                      height={96}
                      rx={4}
                      fill={shown ? ACCENT : MUTED}
                      fillOpacity={shown ? 0.12 : 0.04}
                      stroke={shown ? ACCENT : MUTED}
                      strokeWidth={1}
                      strokeDasharray={shown ? undefined : "3 3"}
                    />
                    <text x={x + FW / 2} y={58} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={shown ? ACCENT : MUTED}>
                      {f.label}
                    </text>
                    <text x={x + FW / 2} y={74} textAnchor="middle" fontSize={7} fill={MUTED}>
                      {f.detail.slice(0, 11)}
                    </text>
                    <text x={x + FW / 2} y={85} textAnchor="middle" fontSize={7} fill={MUTED}>
                      {f.detail.slice(11)}
                    </text>
                    {shown && (
                      <text x={x + FW / 2} y={114} textAnchor="middle" fontSize={8} fontWeight={700} fill={WARN}>
                        {PROMISES.filter((p) => p.passes === i).length}개 걸림
                      </text>
                    )}
                  </g>
                );
              })}

              {active === 4 && (
                <g>
                  <text x={FX} y={152} fontSize={9.5} fontWeight={700} fill={OK}>
                    통과 · {PROMISES.filter((p) => p.passes >= 4).length}개
                  </text>
                  <text x={FX} y={170} fontSize={9} fill={MUTED}>
                    이것만 어겼을 때 법원에 가서 물릴 수 있습니다
                  </text>
                </g>
              )}

              {active === 0 && (
                <text x={FX} y={90} fontSize={9.5} fill={MUTED}>
                  아직 아무것도 걸러지지 않았습니다
                </text>
              )}

              {active > 0 && active < 4 && (
                <text x={FX} y={152} fontSize={9} fill={MUTED}>
                  여기까지 통과 · {PROMISES.filter((p) => p.passes >= active).length}개
                </text>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
