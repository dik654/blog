import SceneShell from "./SceneShell";

/**
 * 본문 대응: #state-authority 접힌 상세 — 합의 저장소는 과반이 살아야 쓴다.
 * (가정) 멤버 3개, 과반 2. 두 사이트 2 + 1: 1쪽 상실 → 2/3 계속, 2쪽 상실 → 1/3 멈춤. 세 사이트 1 + 1 + 1: 어느 쪽이든 2/3.
 */
interface Site {
  name: string;
  members: number;
  lost: boolean;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  sites: readonly [Site, Site, Site | null];
}

const SCENES: readonly Scene[] = [
  {
    label: "두 사이트에 나눕니다",
    summary: "2 + 1 · 과반은 2",
    sites: [{ name: "사이트 1", members: 2, lost: false }, { name: "사이트 2", members: 1, lost: false }, null],
    note: "(가정) 멤버 3개를 두 사이트에 나누면 한쪽에 둘이 몰립니다. 합의 저장소는 과반, 곧 셋 중 둘이 살아 있어야 씁니다.",
  },
  {
    label: "과반이 없는 쪽이 사라지면",
    summary: "2 / 3 살아 있음 → 쓰기 계속",
    sites: [{ name: "사이트 1", members: 2, lost: false }, { name: "사이트 2", members: 1, lost: true }, null],
    note: "남은 둘이 과반이라 쓰기가 이어집니다. 이 경우만 보면 두 사이트가 장애를 견디는 것처럼 보입니다.",
  },
  {
    label: "과반이 있는 쪽이 사라지면",
    summary: "1 / 3 살아 있음 → 쓰기 멈춤",
    sites: [{ name: "사이트 1", members: 2, lost: true }, { name: "사이트 2", members: 1, lost: false }, null],
    note: "남은 하나는 과반이 아니라 쓰기가 멈춥니다. 두 리전을 두었다고 두 리전 장애를 모두 견디게 되지는 않습니다.",
  },
  {
    label: "세 번째 사이트를 두면",
    summary: "1 + 1 + 1 · 한 곳 상실 → 2 / 3",
    sites: [{ name: "사이트 1", members: 1, lost: true }, { name: "사이트 2", members: 1, lost: false }, { name: "사이트 3", members: 1, lost: false }],
    note: "과반이 한쪽에 몰리지 않으므로 어느 한 사이트가 사라져도 둘이 남습니다. 그림은 사이트 1이 사라진 경우이고 2나 3이 사라져도 수는 같습니다.",
  },
];

function SiteBox({ site }: { site: Site | null }) {
  if (!site) {
    return (
      <div className="flex min-h-[6.5rem] min-w-0 items-center justify-center rounded-lg border border-dashed border-border/60 p-2 text-center text-[11px] leading-4 text-muted-foreground">
        세 번째 사이트 없음
      </div>
    );
  }
  return (
    <div className={`min-h-[6.5rem] min-w-0 rounded-lg border p-2.5 ${site.lost ? "border-dashed border-red-600" : "border-border bg-background"}`}>
      <p className="text-xs font-bold leading-5">{site.name}</p>
      <div className="mt-2 flex h-5 gap-1.5">
        {Array.from({ length: site.members }, (_, index) => (
          <span
            key={index}
            className="size-5 rounded-full border"
            style={{ backgroundColor: site.lost ? "transparent" : "#2563eb", borderColor: site.lost ? "#dc2626" : "#2563eb" }}
          />
        ))}
      </div>
      <p className={`mt-2 text-[11px] font-bold leading-4 ${site.lost ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>{site.lost ? "사라짐" : "살아 있음"}</p>
    </div>
  );
}

export default function QuorumSiteViz() {
  return (
    <SceneShell
      eyebrow="과반과 사이트 배치"
      title="두 사이트에 나누면 과반이 있는 쪽을 잃을 때 쓰기가 멈춥니다"
      description="동그라미 하나가 합의 저장소의 멤버입니다. 멤버 3개는 설명용 가정입니다(가정)."
      ariaLabel="합의 저장소 멤버를 두 사이트와 세 사이트에 나눴을 때 사이트 상실의 결과"
      scenes={SCENES}
      render={(active) => {
        const sites = SCENES[active].sites;
        return (
          <div className="grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
            <SiteBox site={sites[0]} />
            <SiteBox site={sites[1]} />
            <SiteBox site={sites[2]} />
          </div>
        );
      }}
    />
  );
}
