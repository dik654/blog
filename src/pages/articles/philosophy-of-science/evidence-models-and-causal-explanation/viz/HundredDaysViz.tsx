import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 100일 기록(가정). 칸 하나가 하루.
 * 비 40일, 판매 많음 42일 중 비 36일 → 비 36+4, 안 옴 6+54 = 100.
 * 판매 많음 사고 18/42≈43%, 판매 적음 7/58≈12%. 비 사고 20/40=50%, 안 옴 5/60≈8%.
 * 판매·비·사고를 한 칸에 겹친 수는 글에 없으므로 세 값을 겹치지 않는다.
 */
const RAIN = "#bfdbfe";
const SALE = "#fde68a";
const OTHER = "#e2e8f0";
const INK = "#1e293b";
const MARK = "#b91c1c";
const CELL = 18;
const GAP = 2;

type Group = { swatch: string; name: string; count: string; rate?: number; rateText?: string };
type Scene = {
  label: string;
  summary: string;
  note: string;
  tint: string;
  tinted: number;
  dots: (i: number) => boolean;
  crosses: (i: number) => boolean;
  groups: readonly [Group, Group];
};

const none = () => false;

const SCENES: readonly Scene[] = [
  {
    label: "비 온 날",
    summary: "100일 중 40일",
    note: "칸을 세면 비 온 날이 40일입니다. 칸의 자리는 개수만 나타낼 뿐 날짜 순서가 아닙니다.",
    tint: RAIN,
    tinted: 40,
    dots: none,
    crosses: none,
    groups: [
      { swatch: RAIN, name: "비 온 날", count: "40일" },
      { swatch: OTHER, name: "비 안 온 날", count: "60일" },
    ],
  },
  {
    label: "우산이 많이 팔린 날",
    summary: "42일 중 36일이 비",
    note: "점이 우산이 많이 팔린 날입니다. 점 42개 가운데 36개가 파란 칸에 있어 두 기록이 거의 겹칩니다.",
    tint: RAIN,
    tinted: 40,
    dots: (i) => i < 36 || (i >= 40 && i < 46),
    crosses: none,
    groups: [
      { swatch: RAIN, name: "비 온 날 40일", count: "점 36 · 없음 4" },
      { swatch: OTHER, name: "비 안 온 날 60일", count: "점 6 · 없음 54" },
    ],
  },
  {
    label: "판매로 나눈 사고",
    summary: "18/42≈43% · 7/58≈12%",
    note: "칸을 판매 기준으로 다시 묶었습니다. ×가 사고 난 날입니다. 판매가 많은 날 사고 비율이 더 높으므로 두 기록은 강하게 함께 움직입니다.",
    tint: SALE,
    tinted: 42,
    dots: none,
    crosses: (i) => i < 18 || (i >= 42 && i < 49),
    groups: [
      { swatch: SALE, name: "판매 많은 42일", count: "사고 18일", rate: 18 / 42, rateText: "≈43%" },
      { swatch: OTHER, name: "판매 적은 58일", count: "사고 7일", rate: 7 / 58, rateText: "≈12%" },
    ],
  },
  {
    label: "비로 나눈 사고",
    summary: "20/40=50% · 5/60≈8%",
    note: "같은 사고 25일을 비 기준으로 묶어도 크게 갈립니다. 비가 우산 구매와 미끄러운 노면을 동시에 만든 경로가 판매와 사고의 상관을 설명할 수 있습니다.",
    tint: RAIN,
    tinted: 40,
    dots: none,
    crosses: (i) => i < 20 || (i >= 40 && i < 45),
    groups: [
      { swatch: RAIN, name: "비 온 40일", count: "사고 20일", rate: 20 / 40, rateText: "50%" },
      { swatch: OTHER, name: "비 안 온 60일", count: "사고 5일", rate: 5 / 60, rateText: "≈8%" },
    ],
  },
];

function Grid({ scene }: { scene: Scene }) {
  return (
    <svg viewBox="0 0 198 198" className="mx-auto h-auto w-full max-w-[240px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      {Array.from({ length: 100 }, (_, i) => {
        const x = (i % 10) * (CELL + GAP);
        const y = Math.floor(i / 10) * (CELL + GAP);
        const cx = x + CELL / 2;
        const cy = y + CELL / 2;
        return (
          <g key={i}>
            <rect x={x} y={y} width={CELL} height={CELL} rx={2} fill={i < scene.tinted ? scene.tint : OTHER} />
            {scene.dots(i) && <circle cx={cx} cy={cy} r={4} fill={INK} />}
            {scene.crosses(i) && <path d={`M${cx - 5} ${cy - 5} L${cx + 5} ${cy + 5} M${cx + 5} ${cy - 5} L${cx - 5} ${cy + 5}`} stroke={MARK} strokeWidth={1.25} fill="none" />}
          </g>
        );
      })}
    </svg>
  );
}

function GroupRow({ group }: { group: Group }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5 sm:text-sm">
      <div className="flex items-center gap-2 font-semibold">
        <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden className="shrink-0"><rect width={10} height={10} rx={2} fill={group.swatch} stroke="#94a3b8" strokeWidth={0.5} /></svg>
        <span>{group.name}</span>
      </div>
      <p className="mt-0.5 text-muted-foreground">{group.count}</p>
      {group.rate !== undefined && (
        <div className="mt-1 grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-2">
          <div className="h-2.5 rounded-sm bg-muted/50">
            <div className="h-full rounded-sm" style={{ width: `${group.rate * 100}%`, backgroundColor: MARK }} />
          </div>
          <span className="text-right font-mono font-bold">{group.rateText}</span>
        </div>
      )}
    </div>
  );
}

export default function HundredDaysViz() {
  return (
    <SceneShell
      eyebrow="100일 기록 (가정)"
      title="100일을 칸으로 세면 함께 움직이는 모습이 보입니다"
      description="칸 하나가 하루이고 숫자는 설명을 위한 가정입니다. 판매·비·사고가 한 칸에서 어떻게 겹치는지는 글에 없어서, 사고는 판매 기준과 비 기준으로 따로 묶었습니다."
      ariaLabel="100일 격자에서 비, 우산 판매, 사고 일수를 세어 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="grid min-w-0 items-center gap-4 sm:grid-cols-[240px_minmax(0,1fr)] sm:gap-6">
              <Grid scene={scene} />
              <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-1">
                {scene.groups.map((group) => <GroupRow key={group.name} group={group} />)}
              </div>
            </div>
          ))}
        />
      )}
    />
  );
}
