import SceneShell from "./SceneShell";

/**
 * 본문 대응: #artifact-lifecycle — CUDA는 build 때 fatbin, OpenCL은 runtime compile.
 * Rust binary 기록으로 재현 못 하는 것: OpenCL driver가 만든 binary, 선택된 device, runtime options.
 * 기록 항목은 Build log·Runtime log 두 문단 그대로.
 */
const SCENES = [
  { label: "CUDA 경로", summary: "compile은 build 때", note: "build 과정에서 nvcc가 fatbin을 만듭니다. runtime에는 program! macro가 이 결과물로 device별 program을 만듭니다." },
  { label: "OpenCL 경로", summary: "compile은 runtime 때", note: "build에서는 source를 생성하기만 합니다. runtime에 선택된 device에서 driver가 compile하므로 binary는 그때 생깁니다." },
  { label: "Rust binary만 기록하면", summary: "빠지는 항목 3개", note: "“같은 Rust binary”만 기록하면 점선으로 표시한 세 항목을 재현할 수 없습니다. 세 항목은 모두 runtime에 정해지므로 build가 끝난 binary에는 담기지 않습니다." },
  { label: "기록은 시점별로 둘로 나눕니다", summary: "Build log · Runtime log", note: "두 기록을 시점에 맞춰 남깁니다. Build 실패는 빈 source나 오래된 cache로 숨기지 않고, 실패시키거나 승인된 CPU 경로로 전환합니다." },
] as const;

const BUILD_LOG = ["field/curve type", "ec-gpu commit", "Cargo feature set", "source digest", "compiler command·stderr", "artifact digest"];
const RUNTIME_LOG = ["backend", "device UUID/name", "driver", "loaded artifact key", "kernel entry", "fallback 이유"];

function Step({ text, on, missing = false }: { text: string; on: boolean; missing?: boolean }) {
  return (
    <li className={`rounded border px-1.5 py-0.5 text-xs leading-5 sm:text-sm ${missing ? "border-dashed border-red-600 font-semibold text-red-700 dark:text-red-400" : on ? "border-primary bg-background font-semibold" : "border-border/50 text-muted-foreground/70"}`}>
      {text}
    </li>
  );
}

function Lane({ title, on, build, runtime }: { title: string; on: boolean; build: readonly string[]; runtime: readonly { text: string; missing?: boolean }[]; }) {
  return (
    <div className="space-y-1.5">
      <p className={`text-sm font-semibold ${on ? "" : "text-muted-foreground"}`}>{title}</p>
      <div className="grid grid-cols-2 gap-2">
        <ol className="space-y-1">{build.map((text) => <Step key={text} text={text} on={on} />)}</ol>
        <ol className="grid gap-1 sm:grid-cols-2">{runtime.map((item) => <Step key={item.text} text={item.text} on={on} missing={item.missing} />)}</ol>
      </div>
    </div>
  );
}

function Log({ title, items, on }: { title: string; items: readonly string[]; on: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 ${on ? "border-primary bg-background" : "border-dashed border-border/50"}`}>
      <p className={`text-xs font-bold sm:text-sm ${on ? "text-primary" : "text-muted-foreground/60"}`}>{title}</p>
      <p className={`mt-1 text-xs leading-5 sm:text-sm ${on ? "" : "text-muted-foreground/50"}`}>{items.join(" · ")}</p>
    </div>
  );
}

export default function ArtifactLifecycleViz() {
  return (
    <SceneShell
      eyebrow="build와 runtime"
      title="OpenCL의 compile 결과는 프로그램이 실행될 때 비로소 생깁니다"
      description="왼쪽 칸이 build 시점, 오른쪽 칸이 runtime 시점입니다. fatbin은 CUDA compiler인 nvcc가 만드는 컴파일 결과 파일입니다."
      ariaLabel="CUDA와 OpenCL의 compile 시점 차이와 시점별 기록 항목"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-2 gap-2 border-b border-border pb-1 text-xs font-bold text-muted-foreground sm:text-sm">
            <span>build 시점</span>
            <span>runtime 시점</span>
          </div>
          <Lane
            title="CUDA"
            on={active === 0}
            build={["CUDA source 생성", "nvcc가 fatbin 생성"]}
            runtime={[{ text: "fatbin으로 device별 program" }]}
          />
          <Lane
            title="OpenCL"
            on={active === 1 || active === 2}
            build={["OpenCL source 생성"]}
            runtime={[
              { text: "선택된 device", missing: active === 2 },
              { text: "runtime options", missing: active === 2 },
              { text: "driver가 만든 binary", missing: active === 2 },
              { text: "device별 program" },
            ]}
          />
          <div className="grid grid-cols-2 gap-2">
            <Log title="Build log" items={BUILD_LOG} on={active === 3} />
            <Log title="Runtime log" items={RUNTIME_LOG} on={active === 3} />
          </div>
        </div>
      )}
    />
  );
}
