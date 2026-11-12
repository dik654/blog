import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names 마지막 문단 — in-flight batching의 입력 tensor에서 context token이 생성 token보다 앞에 온다.
 * 장면 1~2: S0·S2는 context(프롬프트 처리), S1은 생성. 프롬프트 길이 4·3은 설명용 가정.
 * 장면 3: 공식 문서의 장난감 예제 — max num tokens 12에 프롬프트 5 token 요청 둘 → 10칸, 남은 2칸에 셋째 요청이 못 들어감.
 */
const SLOTS = 12;

type Kind = "ctx" | "gen" | "left";
interface Token {
  owner: string;
  kind: Kind;
}

const run = (owner: string, kind: Kind, count: number): Token[] => Array.from({ length: count }, () => ({ owner, kind }));

const SCENES = [
  {
    label: "요청 순서 그대로 놓으면",
    summary: "S0 · S1 · S2 → 규칙에 어긋남",
    tokens: [...run("S0", "ctx", 4), ...run("S1", "gen", 1), ...run("S2", "ctx", 3)],
    budget: false,
    third: false,
    note: "context 단계는 프롬프트 token을 처리하는 단계이고, 생성 단계는 요청마다 새 token 하나를 만드는 단계입니다. 요청 번호 순서대로 놓으면 생성 단계인 S1의 token이 두 context 사이에 끼어, TensorRT-LLM이 요구하는 배치가 아닙니다.",
  },
  {
    label: "context를 앞에 모읍니다",
    summary: "S0 · S2 (context) → S1 (생성)",
    tokens: [...run("S0", "ctx", 4), ...run("S2", "ctx", 3), ...run("S1", "gen", 1)],
    budget: false,
    third: false,
    note: "S0과 S2의 프롬프트 token을 먼저 놓고 S1의 생성 token을 뒤에 붙입니다. 이 step의 token 합 8은 max_num_tokens(기본 8,192) 안에 있어야 하며, 여기서는 한참 아래입니다.",
  },
  {
    label: "token 예산이 12라면",
    summary: "5 + 5 = 10 → 남은 2칸",
    tokens: [...run("R1", "ctx", 5), ...run("R2", "ctx", 5), ...run("", "left", 2)],
    budget: true,
    third: true,
    note: "공식 문서의 장난감 예제입니다. max batch size 4, max num tokens 12에서 프롬프트 5 token 요청 둘을 받으면 10칸을 쓰고 2칸이 남습니다. 문서는 이 2칸으로 셋째 요청을 받지 못한다고 설명합니다. 자리가 batch 수가 아니라 token 수에서 먼저 바닥납니다.",
  },
] as const;

const COLOR: Record<string, string> = { S0: "#2563eb", S2: "#0d9488", S1: "#d97706", R1: "#2563eb", R2: "#0d9488" };

export default function IfbTensorOrderViz() {
  return (
    <SceneShell
      eyebrow="in-flight batching 입력"
      title="한 step의 입력 tensor 안에서 context token이 먼저 옵니다"
      description="칸 하나가 이번 step 입력 tensor의 token 한 자리입니다. 채운 칸은 context(프롬프트) token, 테두리만 굵은 칸은 생성 token입니다."
      note="장면 1·2의 프롬프트 길이 4·3은 설명용 가정입니다. 장면 3은 TensorRT-LLM 문서의 장난감 예제 숫자입니다."
      ariaLabel="in-flight batching 입력 tensor에서 context와 생성 token의 배치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const tokens: readonly Token[] = scene.tokens;
        return (
          <div className="min-w-0">
            <div className="mb-1 flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>입력 tensor 앞</span>
              <span>{scene.budget ? "max num tokens 12" : "뒤"}</span>
            </div>
            <div className={`grid grid-cols-12 gap-1 rounded-md p-1 ${scene.budget ? "border border-foreground/60" : "border border-transparent"}`}>
              {Array.from({ length: SLOTS }, (_, index) => {
                const token = tokens[index];
                if (!token) {
                  return <div key={index} className="h-9 rounded-sm" aria-hidden />;
                }
                if (token.kind === "left") {
                  return (
                    <div key={index} className="flex h-9 items-center justify-center rounded-sm border border-dashed border-muted-foreground/60 text-[10px] text-muted-foreground">
                      빈칸
                    </div>
                  );
                }
                const color = COLOR[token.owner];
                const gen = token.kind === "gen";
                return (
                  <div
                    key={index}
                    className="flex h-9 items-center justify-center rounded-sm font-mono text-[10px] font-bold sm:text-xs"
                    style={gen ? { border: `1.25px solid ${color}`, color } : { backgroundColor: color, color: "#ffffff" }}
                  >
                    {token.owner}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid min-h-[3.5rem] grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              {scene.third ? (
                <>
                  <p className="leading-5 text-muted-foreground">R1·R2: 프롬프트 5 token씩, context 단계</p>
                  <p className="rounded-sm border border-dashed border-red-600 px-2 py-1 leading-5 text-red-700 dark:text-red-400">셋째 요청: 남은 2칸에 들어가지 못해 이번 step에서 빠짐</p>
                </>
              ) : (
                <>
                  <p className="leading-5 text-muted-foreground">S0·S2: context 단계 (프롬프트 4·3 token, 가정)</p>
                  <p className="leading-5 text-muted-foreground">S1: 생성 단계 (이번 step 새 token 1개)</p>
                </>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
