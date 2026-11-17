import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./MysticetiSceneShell";

/**
 * 본문 대응: #uncertified-votes — Byzantine 지도자가 같은 자리에 L과 L′을 만들 때
 * 다음 블록 하나를 두 후보의 투표로 모두 세면 지분이 재사용되고,
 * 인과 과거를 정해진 순서로 훑어 처음 지지한 블록 하나만 세면 그렇지 않다.
 * n=4, f=1, Q=2f+1=3. 각 작성자의 인과 과거 내용과 훑는 순서는 설명용 가정이다.
 * 둘 다 세기: L={A,B,C}=3, L′={B,C,D}=3 → 3+3=6표인데 작성자는 4명.
 * 첫 지지만: L={A,B}=2, L′={C,D}=2 → 2+2=4표, 각 작성자 한 번.
 */
const Q = 3;

type Candidate = "L" | "L′";

const AUTHORS: readonly { name: string; past: readonly Candidate[] }[] = [
  { name: "A", past: ["L"] },
  { name: "B", past: ["L", "L′"] },
  { name: "C", past: ["L′", "L"] },
  { name: "D", past: ["L′"] },
];

const SCENES = [
  { label: "같은 자리에 두 후보", summary: "L과 L′ · Q=3", note: "Byzantine(규칙을 어기는) 지도자가 라운드 r의 같은 자리에 서로 충돌하는 L과 L′을 만들었습니다. r+1의 B·C 블록은 인과 과거(그 블록이 직접·간접으로 참조하는 이전 블록 전체)에 두 후보를 모두 담고 있다고 가정합니다." },
  { label: "둘 다 투표로 세면", summary: "L 3표 · L′ 3표", note: "B와 C의 블록을 L과 L′ 양쪽의 투표로 세면 두 후보가 모두 3표를 얻어 같은 자리에 인증된 블록이 둘이 됩니다. 필요한 표는 3+3=6인데 작성자는 4명이므로 B·C의 지분이 두 번 쓰인 것입니다." },
  { label: "처음 지지한 하나만", summary: "L 2표 · L′ 2표", note: "각 블록의 인과 과거를 정해진 순서로 훑어 그 작성자가 이 자리에서 처음 지지한 블록 하나만 표로 셉니다. 표는 2+2=4로 작성자 수와 같고, 이 예에서는 어느 후보도 3표에 닿지 않습니다. 두 후보가 함께 3표를 얻으려면 6표가 필요하므로 한 사람 한 표에서는 둘이 동시에 인증될 수 없습니다." },
  { label: "도착 순서는 쓰지 않음", summary: "노드마다 같은 결론", note: "노드 X와 Y가 L과 L′을 서로 다른 순서로 받았다고 해 봅니다. 도착 순서로 세면 두 노드가 B의 표를 다르게 셀 수 있습니다. 대신 B 블록 자체의 인과 과거를 같은 규칙으로 훑으므로 두 노드 모두 B의 첫 지지를 L로 셉니다." },
] as const;

const COUNT_LINES = [
  "작성자 4명 · 한 명까지 Byzantine(f=1) · 인증 문턱 Q=2f+1=3",
  "3 + 3 = 6표 > 작성자 4명 → B·C가 두 번 셈",
  "2 + 2 = 4표 = 작성자 4명 → 모두 한 번씩",
  "노드 X는 L′을, 노드 Y는 L을 먼저 받음 · 두 노드 모두 B의 표 = L",
] as const;

function votesOf(past: readonly Candidate[], active: number): readonly Candidate[] {
  if (active === 0) return [];
  if (active === 1) return past;
  return past.slice(0, 1);
}

export default function FirstSupportVoteViz() {
  return (
    <SceneShell
      eyebrow="설명용 동일 투표권 · n=4 · f=1"
      title="한 작성자의 표를 두 후보에 나눠 쓰지 않습니다"
      description="칸 하나가 r+1의 작성자 블록입니다. 각 블록의 인과 과거에 무엇이 들어 있고 어떤 순서로 훑히는지는 설명을 위한 가정입니다."
      ariaLabel="충돌하는 지도자 블록 L과 L′에 대해 투표를 이중으로 셀 때와 첫 지지 하나만 셀 때의 비교"
      scenes={SCENES}
      render={(active) => {
        const tally = (candidate: Candidate) =>
          AUTHORS.reduce<number>((sum, author) => sum + (votesOf(author.past, active).includes(candidate) ? 1 : 0), 0);
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(["L", "L′"] as const).map((candidate) => {
                const count = tally(candidate);
                const reached = active > 0 && count >= Q;
                return (
                  <div key={candidate} className={`rounded-lg border px-3 py-2 ${reached ? "border-red-600 bg-red-600/10" : "border-border bg-background"}`}>
                    <p className="text-[10px] font-semibold text-muted-foreground">라운드 r · 같은 자리</p>
                    <p className="mt-1 text-base font-black">{candidate}</p>
                    <p className="mt-1 font-mono text-xs font-bold">
                      {active === 0 ? "표 —" : `표 ${count}/${Q}`}
                      <span className="ml-2 font-sans font-semibold">{active === 0 ? "" : reached ? "인증" : "미달"}</span>
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {AUTHORS.map((author) => {
                const votes = votesOf(author.past, active);
                const doubled = votes.length > 1;
                const highlight = active === 3 && author.name === "B";
                return (
                  <div key={author.name} className={`min-w-0 rounded-lg border px-2 py-2 text-xs leading-5 ${doubled ? "border-red-600" : highlight ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                    <p className="font-black">r+1 · {author.name} 블록</p>
                    <p className="text-muted-foreground">인과 과거(훑는 순서): {author.past.join(", ")}</p>
                    <p className={`font-semibold ${doubled ? "text-red-700 dark:text-red-400" : ""}`}>
                      {active === 0 ? "표: 아직 안 셈" : `표: ${votes.join(" · ")}${doubled ? " (중복)" : ""}`}
                    </p>
                  </div>
                );
              })}
            </div>
            <StableSceneStack
              active={active}
              scenes={COUNT_LINES.map((line) => (
                <p key={line} className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-semibold leading-5">{line}</p>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
