import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #shutdown 첫 두 문단 — payload를 먼저 쓰고 flag를 release로 공개하며,
 * 받는 쪽은 같은 scope의 acquire로 flag를 관측한 뒤 payload를 읽는다.
 * 줄 = 위에서 아래로 시간 순서, 열 = 누가 그 일을 하는가.
 * 마지막 장면은 본문 둘째 문단의 scope 선택 세 갈래다.
 */
const LANES = ["Producer", "Worker", "Consumer"] as const;

type Row = { lane: 0 | 1 | 2; text: string; from: number; wrong?: string };

const ROWS: readonly Row[] = [
  { lane: 0, text: "① descriptor 쓰기", from: 0 },
  { lane: 0, text: "② ready.store(true, release)", from: 1, wrong: "② release 없이 ready 공개" },
  { lane: 1, text: "③ ready.load(acquire) = true", from: 2, wrong: "③ ready = true 관측 (acquire 없음)" },
  { lane: 1, text: "④ descriptor 읽기 → ①의 값", from: 2, wrong: "④ descriptor 읽기 → ①이 아직 안 보일 수 있음" },
  { lane: 1, text: "⑤ run · output 쓰기", from: 4 },
  { lane: 1, text: "⑥ completion.store(status, release)", from: 4 },
  { lane: 2, text: "⑦ completion.load(acquire) → output 읽기", from: 4 },
];

const SCENES = [
  { label: "① payload 먼저", summary: "① descriptor", note: "Producer가 task descriptor(연산 종류, tensor pointer, shape, completion slot)를 slot에 씁니다. 아직 어떤 worker에게도 준비됐다고 알리지 않았습니다." },
  { label: "② release로 공개", summary: "쓰기 다음 공개", note: "Release store는 그 앞에서 한 쓰기가 이 flag와 함께 공개되게 하는 저장입니다. 같은 scope(이 순서 약속이 통하는 thread 범위, 마지막 장면)에서 이 flag를 acquire로 읽은 쪽은 ①도 함께 봅니다." },
  { label: "③④ acquire 뒤 읽기", summary: "공개 → 관측 → 읽기", note: "Acquire load로 ready=true를 본 worker는 ①에서 쓴 descriptor를 읽습니다. 소유권은 이와 별개로 queue ticket이 정합니다." },
  { label: "짝이 빠지면", summary: "flag가 payload보다 먼저 보일 수 있음", note: "Atomic ticket만으로는 보이는 순서가 보장되지 않습니다. Release·acquire 짝이 없으면 worker가 ready를 보고도 아직 안 보이는 descriptor를 읽을 수 있습니다." },
  { label: "⑤⑥⑦ 결과도 같은 순서", summary: "output → completion → 읽기", note: "Worker는 output을 다 쓴 뒤 completion을 release로 공개하고, Consumer는 completion을 acquire로 읽은 뒤에 output을 읽습니다." },
  { label: "scope 고르기", summary: "device · system · API 경계", note: "본문 둘째 문단의 세 갈래입니다. CPU가 같은 atomic object를 직접 읽고 쓸 때는 system scope뿐 아니라 memory 종류와 device capability 조건까지 맞아야 합니다." },
] as const;

const BRANCHES = [
  { who: "GPU block끼리만", then: "device scope 후보" },
  { who: "CPU도 같은 atomic을 직접", then: "system scope + unified·mapped memory + device capability" },
  { who: "위 조건을 못 맞춤", then: "CUDA stream/event·copy 같은 API 경계로 host 관측 설계" },
] as const;

const LANE_COL = ["sm:col-start-1", "sm:col-start-2", "sm:col-start-3"] as const;
const LANE_INDENT = ["ml-0", "ml-5", "ml-10"] as const;

function Lanes({ scene }: { scene: number }) {
  const wrongScene = scene === 3;
  return (
    <div className="min-w-0">
      <div className="hidden grid-cols-3 gap-1 border-b border-border pb-1 text-center text-xs font-bold sm:grid">
        {LANES.map((lane) => (
          <span key={lane}>{lane}</span>
        ))}
      </div>
      <div className="relative mt-1">
        <div className="pointer-events-none absolute inset-0 hidden grid-cols-3 sm:grid" aria-hidden="true">
          {LANES.map((lane) => (
            <span key={lane} className="mx-auto h-full w-px bg-border" />
          ))}
        </div>
        <ol className="relative space-y-1">
          {ROWS.map((row, index) => {
            const shown = scene >= row.from && !(wrongScene && row.from > 2);
            const bad = wrongScene && row.wrong !== undefined;
            const current = !bad && scene === row.from;
            return (
              <li key={index} className="grid min-h-8 grid-cols-1 gap-1 sm:grid-cols-3">
                <span
                  className={`${LANE_COL[row.lane]} ${LANE_INDENT[row.lane]} flex min-w-0 flex-col justify-center rounded-sm border px-2 py-1 font-mono sm:py-0.5 text-[10px] leading-4 [overflow-wrap:anywhere] sm:ml-0 sm:text-[11px] ${
                    !shown
                      ? "invisible"
                      : bad
                        ? "border-[#dc2626] bg-[#dc2626]/10 text-[#b91c1c] dark:text-[#f87171]"
                        : current
                          ? "border-[#2563eb] bg-[#2563eb]/10 text-foreground"
                          : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  <span className="font-sans text-[9px] font-bold text-muted-foreground sm:hidden">{LANES[row.lane]}</span>
                  {bad ? row.wrong : row.text}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function ScopeBranch() {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold">ready·completion atomic을 누가 읽고 쓰나</p>
      <div className="mt-3 grid gap-2">
        {BRANCHES.map((branch) => (
          <div key={branch.who} className="min-w-0 rounded-sm border border-[#0f766e] bg-[#0f766e]/10 px-3 py-2 text-xs leading-5 sm:text-sm sm:leading-6">
            <span className="block font-bold">{branch.who}</span>
            <span className="block text-muted-foreground">→ {branch.then}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PublicationOrderViz() {
  return (
    <SceneShell
      eyebrow="Publication order"
      title="Payload를 먼저 쓰고 flag를 공개해야 받는 쪽이 같은 값을 봅니다"
      description="열은 Producer·Worker·Consumer, 줄은 위에서 아래로 흐르는 시간입니다. Release는 앞선 쓰기를 flag와 함께 공개하는 저장, acquire는 그 flag를 본 뒤에야 다음 읽기를 하는 load입니다."
      ariaLabel="persistent queue에서 descriptor와 completion을 release acquire로 공개하는 순서"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0" role="img" aria-label={SCENES[active].note}>
          <StableSceneStack active={active === 5 ? 1 : 0} scenes={[<Lanes key="lanes" scene={Math.min(active, 4)} />, <ScopeBranch key="scope" />]} />
        </div>
      )}
    />
  );
}
