import AutobahnSceneShell from "./AutobahnSceneShell";

/**
 * 본문 대응: #lanes-cut 두 번째 문단 — n=4, f=1에서 Byzantine 차선 소유자가 같은 위치에 car x, y를 내고
 * B+H1이 x에, B+H2가 y에 투표하면 두 car 모두 f+1=2표를 얻어 PoA가 된다.
 * f=1이므로 Byzantine 복제본은 B 한 명뿐이고, 소유자와 투표자 B는 같은 복제본이다.
 */
const SCENES = [
  {
    label: "같은 위치에 두 자동차",
    summary: "n=4 · f=1 · 필요한 표 f+1=2",
    note: "복제본은 넷이고 Byzantine은 최대 한 명(B)입니다. B는 자기 차선의 같은 위치에 내용이 다른 자동차 x를 H1에게, y를 H2에게 보냅니다. H3는 이 예에서 투표하지 않는다고 둡니다(가정).",
  },
  {
    label: "x가 PoA를 얻음",
    summary: "x: B + H1 = 2표 ≥ 2",
    note: "B와 정상 복제본 H1이 x에 투표하면 2표가 모여 x의 PoA가 됩니다. 두 표 중 Byzantine은 많아야 하나이므로 H1이 x의 데이터를 다시 내줄 정상 보유자입니다.",
  },
  {
    label: "y도 PoA를 얻음",
    summary: "y: B + H2 = 2표 ≥ 2",
    note: "B가 y에도 투표하고 다른 정상 복제본 H2가 y에 투표하면 y도 2표로 PoA를 얻습니다. 같은 위치에 PoA가 둘이므로, PoA는 '이 위치에 자동차가 하나뿐'이라는 증명이 아닙니다.",
  },
  {
    label: "합의가 하나를 고름",
    summary: "PoA = 데이터 회수 가능 · 끝점 = 합의",
    note: "각 PoA는 데이터를 내줄 정상 보유자 한 명(x는 H1, y는 H2)을 남길 뿐입니다. 그 차선에서 x와 y 중 어느 끝점을 쓸지는 나중에 cut 합의가 하나로 정합니다. 그림은 어느 쪽이 뽑히는지 정하지 않습니다.",
  },
] as const;

const REPLICAS = [
  { id: "B", role: "Byzantine 소유자" },
  { id: "H1", role: "정상" },
  { id: "H2", role: "정상" },
  { id: "H3", role: "정상" },
] as const;

/** 장면별로 각 복제본이 어느 자동차에 투표했는지 */
const VOTES_X: readonly (readonly string[])[] = [[], ["B", "H1"], ["B", "H1"], ["B", "H1"]];
const VOTES_Y: readonly (readonly string[])[] = [[], [], ["B", "H2"], ["B", "H2"]];

function receives(id: string): string {
  if (id === "H1") return "x 받음";
  if (id === "H2") return "y 받음";
  if (id === "H3") return "투표 없음(가정)";
  return "x·y 둘 다 만듦";
}

function CarColumn({ name, voters, active }: { name: string; voters: readonly string[]; active: number }) {
  const hasPoA = voters.length >= 2;
  const chosenUnknown = active === 3;
  return (
    <div className={`min-w-0 rounded-lg border p-2 sm:p-3 ${hasPoA ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-black">자동차 {name}</p>
        <p className="text-[11px] font-semibold text-muted-foreground">같은 위치</p>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1">
        {[0, 1].map((slot) => {
          const voter = voters[slot];
          return (
            <span
              key={slot}
              className={`rounded border px-1 py-1.5 text-center text-xs font-bold ${
                voter ? (voter === "B" ? "border-red-600 text-red-700 dark:text-red-400" : "border-primary text-primary") : "border-dashed border-border text-muted-foreground/50"
              }`}
            >
              {voter ? `${voter} 표` : "빈 칸"}
            </span>
          );
        })}
      </div>
      <p className={`mt-2 text-xs font-bold ${hasPoA ? "text-primary" : "text-muted-foreground"}`}>
        {hasPoA ? `PoA ✓ · 정상 보유자 ${voters.filter((v) => v !== "B").join(", ")}` : `${voters.length}/2표 · PoA 없음`}
      </p>
      <p className={`mt-1 text-[11px] ${chosenUnknown ? "font-semibold text-foreground" : "text-transparent"}`}>끝점 후보 · 합의가 결정</p>
    </div>
  );
}

export default function EquivocationPoAViz() {
  return (
    <AutobahnSceneShell
      eyebrow="PoA와 같은 위치의 두 자동차 · n=4, f=1"
      title="같은 차선 위치에서 두 자동차가 모두 PoA를 얻는 경우"
      description="PoA(가용성 증명)는 같은 자동차에 대한 서로 다른 복제본의 표 f+1개입니다. 빨간 칸은 Byzantine 복제본 B의 표, 진한 테두리 칸은 정상 복제본의 표, 점선 칸은 아직 빈 표입니다."
      note="PoA가 보장하는 것은 '데이터를 다시 받을 정상 노드가 적어도 하나 있다'까지입니다. 갈라지지 않았다는 증명은 합의 단계가 맡습니다."
      ariaLabel="Byzantine 차선 소유자가 같은 위치에 두 자동차를 내고 두 자동차 모두 PoA를 얻는 네 장면"
      playLabel="두 PoA가 생기는 과정 재생"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-4 gap-1 sm:gap-2">
            {REPLICAS.map((replica) => (
              <div
                key={replica.id}
                className={`min-w-0 rounded-lg border px-1 py-2 text-center ${replica.id === "B" ? "border-red-600" : "border-border"}`}
              >
                <p className={`text-sm font-black ${replica.id === "B" ? "text-red-700 dark:text-red-400" : ""}`}>{replica.id}</p>
                <p className="break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px]">{replica.role}</p>
                <p className="mt-1 break-keep text-[10px] font-semibold leading-4 sm:text-[11px]">{receives(replica.id)}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <CarColumn name="x" voters={VOTES_X[active]} active={active} />
            <CarColumn name="y" voters={VOTES_Y[active]} active={active} />
          </div>
        </div>
      )}
    />
  );
}
