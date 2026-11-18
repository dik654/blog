import SceneShell from "./SceneShell";

/**
 * 본문 대응: #batch-aggregation — AggCircuit은 child EXE·VM commitment, 공개 32 bytes와
 * H(ChunkInfo) 대조, 인접 ChunkInfo의 chain·state root·message queue 연결을 차례로 본다.
 * chunk 3개, chain X/Y, S₀…S₃, Q₀…Q₃ 기호는 설명용 가정이다.
 */
type Chunk = {
  name: string;
  commit: string;
  pi: string;
  chain: string;
  state: [string, string];
  queue: [string, string];
};

type Status = "ok" | "fail" | "skip";

const C1: Chunk = { name: "P₁ · I₁", commit: "chunk guest", pi: "H(I₁) = 공개값", chain: "X", state: ["S₀", "S₁"], queue: ["Q₀", "Q₁"] };
const C2: Chunk = { name: "P₂ · I₂", commit: "chunk guest", pi: "H(I₂) = 공개값", chain: "X", state: ["S₁", "S₂"], queue: ["Q₁", "Q₂"] };
const C3: Chunk = { name: "P₃ · I₃", commit: "chunk guest", pi: "H(I₃) = 공개값", chain: "X", state: ["S₂", "S₃"], queue: ["Q₂", "Q₃"] };

const CHECKS = ["① child EXE·VM commitment", "② 공개 32 bytes = H(ChunkInfo)", "③ 인접 chain·state·queue 연결"] as const;

const SCENES = [
  {
    label: "정상 batch",
    summary: "세 검사 통과 → 다음 단계(blob·header)",
    chunks: [C1, C2, C3],
    bad: "" as string,
    status: ["ok", "ok", "ok"] as Status[],
    note: "세 검사를 모두 통과해도 바로 끝나지 않습니다. 이어 DA blob과 batch header 관계까지 검사해야 parent→current batch statement가 됩니다.",
  },
  {
    label: "다른 guest의 proof",
    summary: "① 에서 거절",
    chunks: [C1, { ...C2, commit: "다른 program" }, C3],
    bad: "commit",
    status: ["fail", "skip", "skip"] as Status[],
    note: "P₂가 STARK로서 유효해도 고정한 chunk EXE·VM commitment와 다르면 다른 guest나 VM이 만든 proof입니다. 같은 공개값을 내더라도 받아들이지 않습니다.",
  },
  {
    label: "witness와 proof 불일치",
    summary: "② 에서 거절",
    chunks: [C1, { ...C2, pi: "H(I₂) ≠ 공개값" }, C3],
    bad: "pi",
    status: ["ok", "fail", "skip"] as Status[],
    note: "witness로 넘긴 ChunkInfo I₂가 P₂가 실제로 공개한 32 bytes와 맞지 않으면, I₂의 설명은 그 proof가 인증한 실행이 아닙니다.",
  },
  {
    label: "다른 chain의 chunk",
    summary: "③ chain X ≠ Y",
    chunks: [C1, { ...C2, chain: "Y" }, C3],
    bad: "chain",
    status: ["ok", "ok", "fail"] as Status[],
    note: "P₂가 chain Y의 진짜 chunk proof여도 chain X의 chunk 사이에 섞을 수 없습니다.",
  },
  {
    label: "state root가 끊김",
    summary: "③ S₁ ≠ S₁′",
    chunks: [C1, { ...C2, state: ["S₁′", "S₂"] as [string, string] }, C3],
    bad: "state",
    status: ["ok", "ok", "fail"] as Status[],
    note: "I₁은 S₁에서 끝났는데 I₂는 S₁′에서 시작합니다. 두 proof가 각각 진짜여도 중간 상태를 건너뛴 두 개의 따로 유효한 증명일 뿐입니다.",
  },
  {
    label: "message queue가 끊김",
    summary: "③ Q₁ ≠ Q₁′",
    chunks: [C1, { ...C2, queue: ["Q₁′", "Q₂"] as [string, string] }, C3],
    bad: "queue",
    status: ["ok", "ok", "fail"] as Status[],
    note: "state가 이어져도 L1 message queue가 이어지지 않으면 L1 message를 건너뛰거나 중복하지 않았다는 연결이 깨지므로 거절합니다.",
  },
] as const;

const RED = "font-bold text-red-700 dark:text-red-400";

function ChunkCard({ chunk, bad }: { chunk: Chunk; bad: string }) {
  const changed = bad !== "" && chunk.name.startsWith("P₂");
  const mark = (key: string) => (changed && bad === key ? RED : "");
  return (
    <div className={`grid min-w-0 grid-cols-2 gap-x-2 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] leading-5 sm:grid-cols-1 sm:py-2 sm:text-xs ${changed ? "border-red-600 bg-red-500/10" : "border-border bg-background"}`}>
      <p className="col-span-2 font-sans font-bold sm:col-span-1">{chunk.name}</p>
      <p className={`col-span-2 sm:col-span-1 ${mark("commit")}`}>commit: {chunk.commit}</p>
      <p className={`col-span-2 sm:col-span-1 ${mark("pi")}`}>{chunk.pi}</p>
      <p className={mark("chain")}>chain {chunk.chain}</p>
      <p className={mark("state")}>S {chunk.state[0]}→{chunk.state[1]}</p>
      <p className={mark("queue")}>Q {chunk.queue[0]}→{chunk.queue[1]}</p>
    </div>
  );
}

const STATUS_TEXT: Record<Status, string> = { ok: "통과", fail: "거절", skip: "앞에서 멈춤" };
const STATUS_CLASS: Record<Status, string> = {
  ok: "border-emerald-600 text-emerald-700 dark:text-emerald-400",
  fail: "border-red-600 text-red-700 dark:text-red-400",
  skip: "border-dashed border-border text-muted-foreground",
};

export default function BatchChecksViz() {
  return (
    <SceneShell
      eyebrow="batch aggregation 세 검사"
      title="유효한 chunk proof 셋이 하나의 batch가 되려면"
      description="카드 하나가 chunk proof Pᵢ와 그 proof에 대응하는 ChunkInfo Iᵢ입니다. commit은 proof를 만든 program·VM, S는 실행 전→후 state root, Q는 실행 전→후 L1 message queue hash입니다. 아래 세 줄은 AggCircuit이 차례로 하는 검사입니다."
      note="chunk 3개와 chain X·Y, S₀…S₃, Q₀…Q₃ 기호는 설명용 가정입니다. 각 사례에서 P₂ 하나만 바꿨습니다. 앞 검사에서 거절되면 뒤 검사 칸은 '앞에서 멈춤'으로 둡니다."
      ariaLabel="정상, 다른 guest, PI 불일치, 다른 chain, state 끊김, queue 끊김 여섯 경우의 batch 검사"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {scene.chunks.map((chunk) => (
                <ChunkCard key={chunk.name} chunk={chunk} bad={scene.bad} />
              ))}
            </div>
            <div className="space-y-1.5">
              {CHECKS.map((check, index) => {
                const status = scene.status[index];
                return (
                  <div key={check} className="grid grid-cols-[minmax(0,1fr)_6.5rem] items-center gap-2 text-xs sm:text-sm">
                    <span className="min-w-0 break-keep">{check}</span>
                    <span className={`rounded-md border px-2 py-1 text-center text-xs font-bold ${STATUS_CLASS[status]}`}>{STATUS_TEXT[status]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
