import PeopleGrid, { type PeopleCell } from "./PeopleGrid";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 명부 30이 유지되거나 50·70으로 늘 수 있고(30 + 20, 30 + 40), 식민지의 30은 다른 길에 있습니다.
 * 어느 20명이 먼저 들어오는지는 본문에 없어 칸 위치는 예시입니다. 위 7줄은 본국 쪽 70칸, 아래 3줄은 식민지의 30칸입니다.
 */
const SCENES = [
  { label: "명부가 유지되는 길", summary: "30칸 그대로", cit: 30, note: "처음 투표권이 있는 30명이 법을 만들면 자신들의 재산과 신분을 기준으로 명부를 유지할 수 있습니다." },
  { label: "명부 밖의 요구", summary: "40칸이 요구하고 조직", cit: 30, note: "명부 밖 40명이 납세와 병역을 근거로 권리를 요구하고 조직합니다. 아직 명부 숫자는 바뀌지 않았습니다." },
  { label: "늘어날 수 있는 길 ①", summary: "30 + 20 = 50칸", cit: 50, note: "요구와 조직으로 30이 50으로 늘 수 있습니다. 40 중 20이 들어온 셈이며, 어느 20명인지는 정해지지 않았습니다(칸 위치는 예시)." },
  { label: "늘어날 수 있는 길 ②", summary: "30 + 40 = 70칸", cit: 70, note: "30이 70까지 늘 수도 있습니다. 명부 밖 40명 전부가 들어온 경우입니다. 50과 70은 일어날 수 있는 경우이지 정해진 순서가 아닙니다." },
  { label: "식민지에서 닫히는 길", summary: "대표 없이 자원·노동 제공", cit: 30, note: "반면 식민지의 30명은 본국 의회에 대표 없이 자원과 노동을 제공할 수 있습니다. 명부 칸은 처음의 30으로 돌려 놓았습니다." },
  { label: "철도·학교와 자치", summary: "있음 ≠ 결정권", cit: 30, note: "철도와 학교가 생겨도 최종 예산과 토지 결정권이 외부에 있으면 기반 시설의 존재와 자치를 같은 것으로 볼 수 없습니다." },
] as const;

const CITIZEN = "#2563eb";
const CLAIM = "#b45309";
const COLONY = "#dc2626";

function homeCells(active: number): PeopleCell[] {
  const citizens = SCENES[active].cit;
  return Array.from({ length: 70 }, (_, index): PeopleCell => {
    if (index < citizens) return { letter: "시", color: CITIZEN, strong: true };
    return active === 1 || active === 2 ? { letter: "요", color: CLAIM } : { letter: "", color: null };
  });
}

function colonyCells(active: number): PeopleCell[] {
  return Array.from({ length: 30 }, (): PeopleCell => (active >= 4 ? { letter: "식", color: COLONY, strong: true } : { letter: "", color: null }));
}

function Card({ on, title, children }: { on: boolean; title: string; children: string }) {
  return (
    <div className={`rounded-lg border px-2 py-1.5 sm:px-3 sm:py-2 ${on ? "border-border bg-background" : "border-dashed border-border/60 opacity-40"}`}>
      <p className="font-semibold leading-5">{title}</p>
      <p className="leading-5 text-muted-foreground">{children}</p>
    </div>
  );
}

export default function RosterChangeViz() {
  return (
    <SceneShell
      eyebrow="30명의 명부"
      title="명부는 유지되거나 넓어질 수 있고, 식민지에서는 다른 길로 닫힐 수 있습니다"
      description="네모 하나가 주민 한 사람입니다(가정). 시 = 투표 명부 안, 요 = 납세·병역을 근거로 요구하는 명부 밖 주민, 식 = 식민지의 30명(3절의 노예·식민지 신민·비시민 30칸 자리), 빈칸 = 그 장면에서 보지 않는 주민."
      ariaLabel="시민 명부 30칸이 유지되거나 50칸, 70칸으로 늘어나는 경우와 식민지의 30칸이 대표 없이 남는 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 grid-cols-[minmax(0,9.75rem)_minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:gap-6">
            <div className="min-w-0 space-y-2">
              <PeopleGrid cells={homeCells(active)} label={`${scene.label}: ${scene.summary}`} />
              <div className="space-y-1.5 border-t border-dashed border-border pt-1.5">
                <p className="flex justify-between gap-1 whitespace-nowrap text-xs leading-4 text-muted-foreground"><span>↑ 본국 70칸</span><span>↓ 식민지 30칸</span></p>
                <PeopleGrid cells={colonyCells(active)} label="식민지의 30칸" />
              </div>
            </div>
            <div className="min-w-0 space-y-2 text-xs sm:text-sm">
              <div className="rounded-lg border border-border bg-background px-2 py-1.5 sm:px-3 sm:py-2">
                <p className="leading-5 text-muted-foreground">투표 명부</p>
                <p className="font-mono text-lg font-bold leading-6" style={{ color: CITIZEN }}>{scene.cit}칸</p>
              </div>
              {active === 4 ? (
                <>
                  <Card on title="본국 의회에">대표 없음</Card>
                  <Card on title="제공할 수 있는 것">자원 · 노동</Card>
                </>
              ) : active === 5 ? (
                <>
                  <Card on title="생겨도">철도 · 학교</Card>
                  <Card on title="외부에 있으면">최종 예산 · 토지 결정권</Card>
                </>
              ) : (
                <Card on={active >= 1} title="요구의 근거">납세 · 병역</Card>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
