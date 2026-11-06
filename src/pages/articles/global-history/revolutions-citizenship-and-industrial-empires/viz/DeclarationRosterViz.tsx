import PeopleGrid, { type PeopleCell } from "./PeopleGrid";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 선언의 "모든 사람" 100칸과 실제 명부 30칸. 30 + 40 + 30 = 100, 100 − 30 = 70.
 * 모든 수는 본문이 정한 가정이며 특정 나라의 비율이 아닙니다. 어떤 법이 어느 칸을 만들었는지는 본문에 없어 짝짓지 않습니다.
 */
const GROUPS = [
  { key: "시", name: "정치 시민", count: 30, detail: "재산·성별·신분 조건 통과, 투표", color: "#2563eb" },
  { key: "의", name: "의무만 큰 주민", count: 40, detail: "세금·노동 의무, 투표권 없음", color: "#b45309" },
  { key: "비", name: "법적 비시민", count: 30, detail: "노예·식민지 신민·비시민", color: "#dc2626" },
] as const;

const SCENES = [
  { label: "선언문이 가리키는 범위", summary: "모든 사람 = 100칸", note: "자유롭고 평등한 시민을 선언한 공화국에 주민 100명이 있다고 가정합니다. 선언문의 문장만 보면 네모 100개가 모두 들어옵니다." },
  { label: "실제로 투표하는 사람", summary: "30칸", note: "재산·성별·신분 조건을 통과한 30명만 투표합니다." },
  { label: "의무는 있고 투표권은 없는 사람", summary: "40칸 더", note: "40명은 세금과 노동 의무를 지지만 투표권이 없습니다." },
  { label: "법적으로 시민이 아닌 사람", summary: "30칸 더 (30 + 40 + 30 = 100)", note: "30명은 노예·식민지 신민·비시민으로 분류됩니다. 신민은 통치를 받되 시민의 권리를 갖지 못한 주민을 가리킵니다." },
  { label: "두 장을 겹치면", summary: "100 − 30 = 70칸(40 + 30)이 명부 밖", note: "선언문에 ‘모든 사람’이 있어도 선거법·노예법·국적법·식민 법령이 실제 참여자를 다시 좁힐 수 있습니다. 이 수치는 특정 나라의 실제 비율이 아닙니다." },
] as const;

function cellsFor(active: number): PeopleCell[] {
  return GROUPS.flatMap((group, groupIndex) =>
    Array.from({ length: group.count }, (): PeopleCell => {
      if (active === 0) return { letter: "", color: "#475569", strong: true };
      if (active === 4) return groupIndex === 0 ? { letter: group.key, color: group.color, strong: true } : { letter: "", color: null };
      return groupIndex < active ? { letter: group.key, color: group.color, strong: true } : { letter: "", color: null };
    }),
  );
}

function Span({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <p className="flex justify-between gap-2 text-xs leading-5"><span>{label}</span><b className="font-mono">{value}칸</b></p>
      <div className="h-3 rounded-sm border border-border"><div className="h-full rounded-sm" style={{ width: `${value}%`, backgroundColor: color }} /></div>
    </div>
  );
}

export default function DeclarationRosterViz() {
  return (
    <SceneShell
      eyebrow="주민 100명의 두 장부"
      title="선언문은 100칸을 가리켜도 투표 명부는 30칸일 수 있습니다"
      description="작은 네모 하나가 주민 한 사람이고, 글자는 분류입니다. 시 = 정치 시민, 의 = 의무만 큰 주민, 비 = 법적 비시민. 모든 수는 권리의 층을 보이기 위한 가정입니다."
      ariaLabel="가정한 주민 100명을 선언문의 범위와 실제 투표 명부로 나눠 보여 주는 칸 그림"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 grid-cols-[minmax(0,9.75rem)_minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:gap-6">
          <PeopleGrid cells={cellsFor(active)} label={`${SCENES[active].label}: ${SCENES[active].summary}`} />
          {active === 4 ? (
            <div className="min-w-0 space-y-3">
              <Span label="선언문의 범위" value={100} color="#475569" />
              <Span label="실제 투표 명부" value={30} color="#2563eb" />
            </div>
          ) : (
            <ul className="min-w-0 space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
              {GROUPS.map((group, index) => {
                const on = index < active;
                return (
                  <li key={group.key} className={`flex items-baseline justify-between gap-2 rounded-lg border px-2 py-1 leading-5 sm:gap-3 sm:px-3 sm:py-1.5 ${on ? "border-border bg-background" : "border-dashed border-border/60 text-muted-foreground/70"}`}>
                    <span className="min-w-0 leading-4"><b style={on ? { color: group.color } : undefined}>{group.key}</b> {group.name}<span className="hidden text-xs text-muted-foreground sm:block">{group.detail}</span></span>
                    <span className="shrink-0 font-mono font-bold">{on ? group.count : ""}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    />
  );
}
