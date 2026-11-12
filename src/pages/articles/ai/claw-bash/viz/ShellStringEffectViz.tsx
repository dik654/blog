import BashSceneShell from "./BashSceneShell";

/**
 * 본문 대응: #overview "argv 실행과 shell string 실행은 서로 다른 API입니다".
 * 같은 첫 token rg에서 출발해도 shell이 만드는 process와 effect가 달라지는 과정을 다섯 장면으로 나눕니다.
 * 명령 문자열은 모두 본문에 나온 것이고, 각 장면의 effect 문구도 본문 표현을 그대로 씁니다.
 */

type Seg = { text: string; mark?: "shell" | "risk" };
type Proc = { name: string; sub: string; kind: "proc" | "file" | "code" };
type Effect = { label: string; color: string };

const READ = "#2563eb";
const WRITE = "#d97706";
const RISK = "#dc2626";
const SECRET = "#7c3aed";

interface SceneData {
  label: string;
  summary: string;
  note: string;
  mode: string;
  command: Seg[];
  argv: string[] | null;
  procs: Proc[];
  effects: Effect[];
}

const SCENES: readonly SceneData[] = [
  {
    label: "직접 argv 실행",
    summary: "process 1개 · 읽기",
    note: "Host가 executable rg와 argument 배열을 나눠 process API에 넘깁니다. 이때 401|Unauthorized 안의 | 는 shell 문법이 아니라 argument 글자 하나입니다.",
    mode: "직접 argv · hardening 선택 (pinned 경로 아님)",
    command: [{ text: 'rg -n "401|Unauthorized" src tests' }],
    argv: ["-n", "401|Unauthorized", "src", "tests"],
    procs: [{ name: "rg", sub: "argument 4개 그대로", kind: "proc" }],
    effects: [{ label: "src · tests 읽기", color: READ }],
  },
  {
    label: "sh -lc 문자열 실행",
    summary: "sh → rg · 같은 읽기",
    note: "Pinned 경로는 같은 text 전체를 sh -lc의 command string 한 개로 넘깁니다. 따옴표 제거와 expansion은 shell이 맡고, host cwd와 물려받은 environment가 그 의미에 영향을 줍니다.",
    mode: "sh -lc에 command string 한 개로 전달",
    command: [{ text: 'rg -n "401|Unauthorized" src tests' }],
    argv: null,
    procs: [
      { name: "sh -lc", sub: "따옴표 제거 · expansion", kind: "proc" },
      { name: "rg", sub: "argument 4개", kind: "proc" },
    ],
    effects: [{ label: "src · tests 읽기", color: READ }],
  },
  {
    label: "> report.txt가 붙으면",
    summary: "읽기 + file 쓰기",
    note: "첫 executable은 여전히 rg입니다. 그러나 shell이 redirection을 처리하면서 rg의 출력이 report.txt에 기록되므로 file write가 생깁니다.",
    mode: "shell string · redirection",
    command: [{ text: 'rg -n "401|Unauthorized" src tests ' }, { text: "> report.txt", mark: "shell" }],
    argv: null,
    procs: [
      { name: "sh -lc", sub: "redirection 처리", kind: "proc" },
      { name: "rg", sub: "검색", kind: "proc" },
      { name: "report.txt", sub: "출력이 기록됨", kind: "file" },
    ],
    effects: [
      { label: "src · tests 읽기", color: READ },
      { label: "report.txt 쓰기", color: WRITE },
    ],
  },
  {
    label: "| sh가 붙으면",
    summary: "검색 결과가 code가 됨",
    note: "Pipeline 뒤쪽의 sh는 rg가 내보낸 search 결과를 입력으로 받아 코드로 해석합니다. 그 코드가 무엇을 할지는 문자열만 봐서는 알 수 없으므로 effect는 Unknown입니다.",
    mode: "shell string · pipeline",
    command: [{ text: 'rg -n "401|Unauthorized" src tests ' }, { text: "| sh", mark: "risk" }],
    argv: null,
    procs: [
      { name: "sh -lc", sub: "pipeline 구성", kind: "proc" },
      { name: "rg", sub: "검색 결과 출력", kind: "proc" },
      { name: "sh", sub: "입력을 code로 실행", kind: "code" },
    ],
    effects: [
      { label: "src · tests 읽기", color: READ },
      { label: "뒤쪽 process effect Unknown", color: RISK },
    ],
  },
  {
    label: "$(…) expansion이 있으면",
    summary: "rg보다 먼저 file 읽기",
    note: "Command substitution은 rg가 시작되기 전에 안쪽 cat을 먼저 실행하고 그 출력을 rg의 argument로 끼워 넣습니다. 그래서 $HOME/.token 같은 민감한 file을 읽을 수 있습니다.",
    mode: "shell string · command substitution",
    command: [{ text: 'rg "' }, { text: '$(cat "$HOME/.token")', mark: "risk" }, { text: '" .' }],
    argv: null,
    procs: [
      { name: "sh -lc", sub: "expansion 먼저", kind: "proc" },
      { name: "cat", sub: "$HOME/.token 읽기", kind: "code" },
      { name: "rg", sub: "읽은 값이 argument", kind: "proc" },
    ],
    effects: [
      { label: "$HOME/.token 읽기", color: SECRET },
      { label: "cwd(.) 읽기", color: READ },
    ],
  },
];

function ProcBox({ proc }: { proc: Proc }) {
  const border = proc.kind === "file" ? WRITE : proc.kind === "code" ? RISK : "#64748b";
  return (
    <div
      className={`min-w-0 rounded-lg border bg-background px-3 py-2 ${proc.kind === "file" ? "border-dashed" : ""}`}
      style={{ borderColor: border }}
    >
      <p className="break-all font-mono text-xs font-bold text-foreground">{proc.name}</p>
      <p className="mt-0.5 break-keep text-[11px] leading-4 text-muted-foreground">{proc.sub}</p>
    </div>
  );
}

export default function ShellStringEffectViz() {
  return (
    <BashSceneShell
      eyebrow="SHELL · ARGV"
      title="첫 token이 같은 rg여도 shell이 만드는 process와 effect는 다릅니다"
      description="위 칸은 실행할 문자열, 가운데는 그 문자열로 생기는 process와 file, 아래는 첫 token과 실제 effect입니다. 명령은 모두 본문의 로그인 401 조사 사례입니다."
      note="argv 배열 실행에서는 |, >, $VAR가 shell 문법이 되지 않습니다. 셋째~다섯째 장면은 shell string 실행일 때의 구조입니다."
      ariaLabel="같은 rg로 시작하는 다섯 명령의 process 구조와 effect 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="grid min-w-0 gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground">입력 · {scene.mode}</p>
              <p className="mt-1 break-all rounded-lg border border-border bg-muted/20 px-3 py-2 font-mono text-xs leading-6">
                {scene.command.map((seg, segIndex) => (
                  <span
                    key={segIndex}
                    className={seg.mark ? "font-bold" : "text-foreground"}
                    style={seg.mark ? { color: seg.mark === "risk" ? RISK : WRITE } : undefined}
                  >
                    {seg.text}
                  </span>
                ))}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground">만들어지는 process · 대상</p>
              <div className="mt-1 grid min-w-0 gap-1 sm:grid-cols-[repeat(3,minmax(0,1fr))] sm:items-stretch sm:gap-0">
                {scene.procs.map((proc, procIndex) => (
                  <div key={proc.name} className="flex min-w-0 flex-col sm:flex-row sm:items-center">
                    {procIndex > 0 && (
                      <span aria-hidden className="px-3 text-center text-sm text-muted-foreground sm:px-1">
                        <span className="sm:hidden">↓</span>
                        <span className="hidden sm:inline">→</span>
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <ProcBox proc={proc} />
                    </div>
                  </div>
                ))}
              </div>
              {scene.argv && (
                <div className="mt-2 flex flex-wrap gap-1.5" aria-label="rg가 받는 argument">
                  {scene.argv.map((arg) => (
                    <span key={arg} className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px]">
                      {arg}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 border-t border-border pt-3 text-xs">
              <span className="font-bold text-muted-foreground">첫 token</span>
              <span className="font-mono font-bold">rg</span>
              <span className="font-bold text-muted-foreground">실제 effect</span>
              <span className="flex min-w-0 flex-wrap gap-1.5">
                {scene.effects.map((effect) => (
                  <span
                    key={effect.label}
                    className="rounded border px-1.5 py-0.5 font-semibold"
                    style={{ borderColor: effect.color, color: effect.color }}
                  >
                    {effect.label}
                  </span>
                ))}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
