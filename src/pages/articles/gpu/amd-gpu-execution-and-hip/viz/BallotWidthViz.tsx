import CellRow, { type CellTone } from "./CellRow";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — HIP의 __ballot은 64비트를 돌려주고 CUDA built-in은 32비트를 돌려준다.
 * 37번 lane의 조건은 37번 비트에 들어가므로, 32비트 변수에 받으면 0–31번만 남아 사라진다.
 * 칸 하나 = 비트 하나. 비트 번호 = lane 번호.
 */
interface Row {
  name: string;
  tone: (bit: number) => CellTone;
}

const lit = (bit: number): CellTone => (bit === 37 ? "hot" : "soft");
const low32 = (bit: number): CellTone => (bit >= 32 ? "off" : "soft");
const cut = (bit: number): CellTone => (bit === 37 ? "bad" : bit >= 32 ? "off" : "soft");

const SCENES: readonly { label: string; summary: string; note: string; rows: readonly Row[]; foot: string }[] = [
  {
    label: "조건을 비트로",
    summary: "37번 lane → 37번 비트",
    note: "__ballot은 각 lane의 조건을 비트 하나씩 모은 값을 돌려주는 함수입니다. 37번 lane의 조건은 결과의 37번 비트에 들어갑니다.",
    rows: [{ name: "lane 0–63", tone: lit }, { name: "__ballot 결과", tone: lit }],
    foot: "같은 번호끼리 위아래로 대응합니다.",
  },
  {
    label: "CUDA built-in",
    summary: "32비트 반환",
    note: "CUDA built-in이 돌려주는 값은 32비트입니다. 표현할 수 있는 자리는 0–31번까지이고, 빈 칸은 이 값에 없는 자리입니다.",
    rows: [{ name: "반환값", tone: low32 }, { name: "받는 변수", tone: low32 }],
    foot: "반환값도 32비트, 받는 변수도 32비트입니다.",
  },
  {
    label: "HIP built-in",
    summary: "unsigned long long · 64비트",
    note: "HIP 문서는 __ballot과 __activemask의 반환값이 64비트라고 적습니다. 37번 비트까지 담아서 돌려줍니다.",
    rows: [{ name: "반환값", tone: lit }, { name: "받는 변수", tone: () => "off" }],
    foot: "받는 쪽을 어떻게 적었는지가 다음 질문입니다.",
  },
  {
    label: "32비트 변수에 받으면",
    summary: "0–31번만 남음 → 37번 사라짐",
    note: "CUDA 코드처럼 이 값을 32비트 변수에 받으면 0–31번 비트만 남습니다. 점선으로 표시한 37번 자리에 있던 lane의 참여가 사라집니다.",
    rows: [{ name: "반환값", tone: lit }, { name: "32비트 변수", tone: cut }],
    foot: "함수 이름을 바꿔도 받는 변수의 폭은 그대로입니다.",
  },
  {
    label: "폭이 맞으면",
    summary: "64비트 변수 → 37번 유지",
    note: "받는 쪽도 64비트이면 37번 비트가 남습니다. 그래서 이식할 때 상수 32 대신 target의 warpSize와 지원되는 mask 형식이 필요한 곳을 검사합니다.",
    rows: [{ name: "반환값", tone: lit }, { name: "64비트 변수", tone: lit }],
    foot: "mask: 어느 lane이 참여하는지 비트로 적은 값입니다.",
  },
];

export default function BallotWidthViz() {
  return (
    <SceneShell
      eyebrow="64칸 비트"
      title="이름은 그대로인데 37번 lane의 비트는 어디서 사라질까요"
      description="칸 하나가 비트 하나이고 비트 번호가 곧 lane 번호입니다. 진한 색 칸은 37번입니다. HIP 7.0.0 문서 기준입니다."
      ariaLabel="64비트 ballot 반환값을 32비트 변수에 받을 때 37번 비트가 잘리는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-3">
            {scene.rows.map((row) => (
              <div key={row.name} className="min-w-0">
                <p className="mb-1 text-xs font-semibold">{row.name}</p>
                <CellRow count={64} tone={row.tone} height="h-7" />
              </div>
            ))}
            <div className="relative h-4 font-mono text-xs text-muted-foreground">
              <span className="absolute left-0">0</span>
              <span className="absolute -translate-x-1/2" style={{ left: "50%" }}>32</span>
              <span className="absolute font-bold text-foreground" style={{ left: `${(37.5 / 64) * 100}%` }}>37</span>
              <span className="absolute right-0">63</span>
            </div>
            <p className="text-xs leading-5">{scene.foot}</p>
          </div>
        );
      }}
    />
  );
}
