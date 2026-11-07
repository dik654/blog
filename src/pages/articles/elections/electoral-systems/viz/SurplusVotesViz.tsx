import SceneShell from "./SceneShell";
import { MUTED_COLOR, PARTY_COLORS, PARTY_NAMES } from "./parties";

/**
 * 본문 대응: #districting — 90 대 5도 59 대 21도 한 석이다. 앞 그림의 지도 B를 가당·나당 표로 다시 센다.
 * 이기는 데 필요한 표 = 2등 + 1 (90 대 5 → 6, 남는 84 / 59 대 21 → 22, 남는 37).
 * 가당 90×3 + 21×6 = 396표 → 3석, 나당 5×3 + 59×6 = 369표 → 6석.
 */
const DISTRICTS: readonly { ga: number; na: number; da: number; winner: number; kind: "packed" | "cracked" }[] = [
  ...Array.from({ length: 3 }, () => ({ ga: 90, na: 5, da: 5, winner: 0, kind: "packed" as const })),
  ...Array.from({ length: 6 }, () => ({ ga: 21, na: 59, da: 20, winner: 1, kind: "cracked" as const })),
];

const SCENES = [
  {
    label: "90 대 5로 이겨도 한 석",
    summary: "6표 필요 · 84표 남음",
    note: "2등이 5표면 6표로 1등이 됩니다. 나머지 84표가 더 있어도 의석은 그대로 한 석입니다. 필요한 표를 2등보다 한 표 많은 수로 세었습니다.",
  },
  {
    label: "59 대 21로 이겨도 한 석",
    summary: "22표 필요 · 37표 남음",
    note: "같은 한 석인데 남는 표는 37표입니다. 90 대 5로 이긴 선거구에서 이기는 데 쓰고 남은 표가 더 많으니, 표가 한곳에 몰린 쪽이 손해를 봅니다.",
  },
  {
    label: "몇 곳에 몰아넣으면",
    summary: "가당 90×3 = 270표 → 3석",
    note: "가당 표 270표가 세 선거구에 몰려 있습니다. 세 곳 모두 이기지만 얻는 의석은 세 석입니다.",
  },
  {
    label: "여러 곳에 잘게 흩으면",
    summary: "가당 21×6 = 126표 → 0석",
    note: "남은 가당 표 126표는 여섯 곳에 21표씩 흩어져 어디서도 1등을 하지 못합니다. 이 표는 한 석도 만들지 못합니다.",
  },
  {
    label: "더 적은 표로 더 많은 의석",
    summary: "396표 3석 · 369표 6석",
    note: "전국 득표가 더 많은 가당이 더 적은 의석을 얻습니다. 득표수는 그대로이고 경계만 다릅니다. 이 지도가 의도로 그어졌는지는 숫자만으로 알 수 없습니다.",
  },
] as const;

function Bar({ name, color, needed, surplus, rest }: { name: string; color: string; needed: number; surplus: number; rest: number }) {
  return (
    <div>
      <p className="text-xs font-bold" style={{ color }}>
        {name} · 1등 {needed + surplus}표, 나머지 {rest}표
      </p>
      <div className="mt-1 flex h-7 w-full overflow-hidden rounded-sm border border-border text-[11px] font-bold leading-7">
        <div className="min-w-0 text-center text-white" style={{ width: `${needed}%`, backgroundColor: color }}>
          {needed}
        </div>
        <div className="min-w-0 border-l border-dashed text-center" style={{ width: `${surplus}%`, backgroundColor: `${color}26`, color, borderColor: color }}>
          남는 표 {surplus}
        </div>
        <div className="min-w-0" style={{ width: `${rest}%`, backgroundColor: `${MUTED_COLOR}26` }} />
      </div>
    </div>
  );
}

function Grid({ active }: { active: number }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {DISTRICTS.map((d, i) => {
        const lit = active === 4 || (active === 2 && d.kind === "packed") || (active === 3 && d.kind === "cracked");
        const color = PARTY_COLORS[d.winner];
        return (
          <div key={i} className={`min-w-0 rounded-sm border px-1.5 py-1 ${lit ? "" : "opacity-35"}`} style={{ borderColor: color }}>
            <p className="flex justify-between gap-1 text-[11px] font-bold leading-4">
              <span style={{ color: PARTY_COLORS[0] }}>가 {d.ga}</span>
              <span style={{ color: PARTY_COLORS[1] }}>나 {d.na}</span>
            </p>
            <div className="mt-0.5 h-2 w-full rounded-sm" style={{ backgroundColor: `${MUTED_COLOR}26` }}>
              <div className="h-full rounded-sm" style={{ width: `${d.ga}%`, backgroundColor: PARTY_COLORS[0] }} />
            </div>
            <p className="mt-0.5 text-[11px] font-bold leading-4" style={{ color }}>
              1등 {PARTY_NAMES[d.winner]}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function SurplusVotesViz() {
  return (
    <SceneShell
      eyebrow="선거구 경계"
      title="이기고 남은 표와 지고 흩어진 표는 의석이 되지 않습니다"
      description="앞 그림의 지도 B입니다. 선거구마다 100표이고, 다당의 표는 막대의 나머지에 포함했습니다(가정)."
      ariaLabel="선거구별 필요한 표와 남는 표, 몰아넣기와 흩기의 결과"
      scenes={SCENES}
      render={(active) =>
        active <= 1 ? (
          <div className="min-w-0 space-y-3">
            <Bar name="가당" color={PARTY_COLORS[0]} needed={6} surplus={84} rest={10} />
            <div className={active === 1 ? "" : "invisible"} aria-hidden={active !== 1}>
              <Bar name="나당" color={PARTY_COLORS[1]} needed={22} surplus={37} rest={41} />
            </div>
            <p className="text-xs leading-5 text-muted-foreground">진한 칸은 이기는 데 필요한 표, 옅은 칸은 그 위에 더 있는 표입니다.</p>
          </div>
        ) : (
          <Grid active={active} />
        )
      }
    />
  );
}
