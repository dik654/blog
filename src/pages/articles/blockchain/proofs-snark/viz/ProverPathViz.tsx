import SceneShell from "./SceneShell";

/**
 * 본문 대응: #prover-dispatch 두 문단과 P 식.
 * cuda-supraseal feature를 켜고 빌드하면 SupraSeal module, 끄면 native module이 연결된다(요청마다 고르지 않음).
 * SupraSeal 경로는 E(동일 크기)와 S(SRS 확인)가 모두 1일 때만 batch, 아니면 fail-closed.
 * Native 안의 CUDA·OpenCL·장치에 따른 FFT·MSM helper 선택은 다른 층이다.
 * SupraSeal 실패 뒤 native는 별도 binary와 새 job으로 드러낸다.
 */
type Box = "build" | "ss" | "ssOk" | "ssFail" | "native" | "helper";

const SCENES = [
  {
    label: "빌드 때 이미 갈림",
    summary: "f_ss = 1 → SupraSeal · 0 → native",
    lit: ["build", "ss", "native"] as readonly Box[],
    note: "cuda-supraseal feature를 켜서 빌드한 binary에는 SupraSeal module이, 끄고 빌드한 binary에는 native module이 연결됩니다. 요청이 들어온 뒤 두 구현의 속도를 비교해 고르지 않습니다.",
  },
  {
    label: "SupraSeal 쪽 조건",
    summary: "E = 1 ∧ S = 1 → batch",
    lit: ["ss", "ssOk"] as readonly Box[],
    note: "SupraSeal로 빌드했어도 batch 안 assignment의 길이가 모두 같고(E=1), pinned SRS를 확인했을 때(S=1)만 batch 증명으로 갑니다. SRS는 proving에 쓰는 고정 공개 parameter입니다.",
  },
  {
    label: "조건이 깨지면",
    summary: "중단 · native로 몰래 바꾸지 않음",
    lit: ["ss", "ssFail"] as readonly Box[],
    note: "길이가 다른 assignment가 하나라도 섞이면 batch가 중단됩니다. 같은 프로세스에서 native로 바꾸지 않으며, native로 다시 하려면 별도 binary와 새 job으로 드러냅니다.",
  },
  {
    label: "Native 안의 다른 층",
    summary: "FFT·MSM helper는 CPU 또는 GPU",
    lit: ["native", "helper"] as readonly Box[],
    note: "Native 경로 안에서는 CUDA·OpenCL feature와 실행 장치에 따라 FFT·MSM helper가 달라질 수 있습니다. 이 내부 가속기 선택은 위의 SupraSeal/native 선택과 다른 층입니다. 영수증에는 binary revision, feature manifest와 실제 장치를 남깁니다.",
  },
] as const;

function Node({ id, lit, title, body, tone = "plain" }: { id: Box; lit: readonly Box[]; title: string; body: string; tone?: "plain" | "fail" }) {
  const on = lit.includes(id);
  const border = on ? (tone === "fail" ? "border-red-600" : "border-primary") : "border-border";
  return (
    <div className={`min-w-0 rounded-md border bg-background px-3 py-2 ${border} ${on ? "" : "opacity-40"}`}>
      <p className={`text-xs font-bold ${on && tone === "fail" ? "text-red-700 dark:text-red-400" : ""}`}>{title}</p>
      <p className="mt-1 break-keep text-[11px] leading-4 text-muted-foreground">{body}</p>
    </div>
  );
}

function Stem({ on }: { on: boolean }) {
  return <div className={`mx-auto h-3 w-px ${on ? "bg-primary" : "bg-border"}`} aria-hidden="true" />;
}

export default function ProverPathViz() {
  return (
    <SceneShell
      eyebrow="Prover 경로"
      title="구현은 빌드 때 한 번 갈리고, 그 아래 가속기 선택은 다른 층입니다"
      description="위에서 아래로 내려가는 선택입니다. 맨 위 선택은 binary를 만들 때 끝나고, 요청이 들어온 뒤에는 바뀌지 않습니다."
      ariaLabel="cuda-supraseal feature에 따른 SupraSeal과 native 경로, batch 조건과 fail-closed, native 내부 helper 선택"
      scenes={SCENES}
      render={(active) => {
        const lit = SCENES[active].lit;
        return (
          <div className="min-w-0">
            <div className="mx-auto max-w-[22rem]">
              <Node id="build" lit={lit} title="빌드 시점 · cuda-supraseal feature" body="binary 하나에 경로 하나" />
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-3">
              <div className="min-w-0">
                <Stem on={lit.includes("ss")} />
                <Node id="ss" lit={lit} title="켬 · SupraSeal module" body="FFI로 C++ GPU batch 호출" />
                <Stem on={lit.includes("ssOk") || lit.includes("ssFail")} />
                <div className="grid gap-2">
                  <Node id="ssOk" lit={lit} title="E = 1 ∧ S = 1" body="같은 길이 + SRS 확인 → batch 증명" />
                  <Node id="ssFail" lit={lit} tone="fail" title="E 또는 S 실패" body="batch 중단 · native 자동 전환 없음" />
                </div>
              </div>
              <div className="min-w-0">
                <Stem on={lit.includes("native")} />
                <Node id="native" lit={lit} title="끔 · native module" body="Bellperson 기본 prover" />
                <Stem on={lit.includes("helper")} />
                <Node id="helper" lit={lit} title="FFT·MSM helper" body="CUDA·OpenCL feature와 장치에 따라 CPU 또는 GPU" />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
