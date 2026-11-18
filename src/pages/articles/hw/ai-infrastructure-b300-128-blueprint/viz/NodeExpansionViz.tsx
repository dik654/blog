import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source 첫 문단 — HGX B300 한 노드 사양(GPU 8, 동서 ConnectX-8 8, 북남 BlueField-3 1, 시스템 메모리 최소 2TB)을 16배로 펼친다.
 * 3절의 GPU당 288GB: 노드 8×288=2,304GB(약 2.3TB), 전체 128×288=36,864GB는 128개 장치에 나뉜 총량.
 * DGX B300 완제품은 dual-port BlueField-3 2장 → 16×2=32개. 스위치·광모듈·케이블은 토폴로지가 정해질 때까지 미확정.
 */
const NODES = 16;
const GPU_PER_NODE = 8;
const HBM_PER_GPU = 288;
const NODE_HBM = GPU_PER_NODE * HBM_PER_GPU;
const TOTAL_HBM = NODES * NODE_HBM;

const SCENES = [
  {
    label: "HGX 기준 노드 한 대",
    summary: "GPU 8 · ConnectX-8 8 · DPU 1",
    note: "공개 HGX 기준 구성의 한 노드입니다. ConnectX-8은 노드 사이(동서) 통신용 어댑터이고, BlueField-3는 저장·서비스 요청이 드나드는 북남 트래픽용 DPU입니다. 시스템 메모리는 최소 2TB입니다.",
  },
  {
    label: "같은 노드를 16대로",
    summary: "128 · 128 · 16 · 최소 32TB",
    note: "한 노드의 수량에 16을 곱하면 GPU 128개, 동서 어댑터 128개, DPU 16개, 시스템 메모리 최소 32TB가 기준선입니다.",
  },
  {
    label: "HBM은 나뉜 총량입니다",
    summary: `128 × 288GB = ${TOTAL_HBM.toLocaleString("en-US")}GB`,
    note: `GPU마다 288GB이므로 노드 한 대는 ${NODE_HBM.toLocaleString("en-US")}GB(약 2.3TB), 전체는 ${TOTAL_HBM.toLocaleString("en-US")}GB입니다. 이 값은 모델 하나가 쓸 수 있는 연속 메모리가 아니라 칸 128개에 나뉘어 있는 총량입니다.`,
  },
  {
    label: "DGX 완제품으로 사면",
    summary: "DPU 노드당 2장 → 32개",
    note: "DGX B300 완제품은 user guide 기준 dual-port BlueField-3 DPU를 2장(2×400Gb/s) 싣습니다. 16대면 DPU가 32개가 되어 HGX 권장안의 16개와 달라지므로, 선택한 구성의 BOM으로 다시 셉니다.",
  },
  {
    label: "아직 셀 수 없는 행",
    summary: "switch · optic · cable = 미확정",
    note: "서버 포트 수만으로 스위치 수는 정해지지 않습니다. 32·64·128노드용 공식 스위치 표도 16노드에 단순히 절반 내지 않고, 선택한 토폴로지와 포트 분할 방식으로 다시 확정합니다.",
  },
] as const;

const GPU_FILL = "#2563eb";
const NIC_FILL = "#0d9488";
const DPU_FILL = "#d97706";

function Cell({ color, label, strong = true }: { color: string; label?: string; strong?: boolean }) {
  return (
    <span
      className="flex h-7 min-w-0 items-center justify-center rounded-sm border text-[10px] font-semibold leading-none sm:text-[11px]"
      style={{ borderColor: color, color, opacity: strong ? 1 : 0.35 }}
    >
      {label}
    </span>
  );
}

function SingleNode() {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-border bg-background p-3 sm:p-4">
      <p className="text-xs font-bold text-muted-foreground">8-GPU 노드 1대 (HGX 기준)</p>
      <div className="mt-2 space-y-2">
        <div>
          <p className="text-xs font-semibold" style={{ color: GPU_FILL }}>B300 GPU × 8 · 칸마다 HBM 288GB</p>
          <div className="mt-1 grid grid-cols-8 gap-1">
            {Array.from({ length: GPU_PER_NODE }, (_, index) => (
              <Cell key={index} color={GPU_FILL} label="288" />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: NIC_FILL }}>동서 ConnectX-8 × 8</p>
          <div className="mt-1 grid grid-cols-8 gap-1">
            {Array.from({ length: GPU_PER_NODE }, (_, index) => (
              <Cell key={index} color={NIC_FILL} label="CX8" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold" style={{ color: DPU_FILL }}>북남 BlueField-3 × 1</p>
            <div className="mt-1 grid grid-cols-2 gap-1">
              <Cell color={DPU_FILL} label="DPU" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">시스템 메모리</p>
            <p className="mt-1 flex h-7 items-center rounded-sm border border-border px-2 font-mono text-xs font-bold">최소 2TB</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold" style={{ color: GPU_FILL }}>노드 HBM 합</p>
            <p className="mt-1 flex h-7 items-center rounded-sm border px-2 font-mono text-xs font-bold" style={{ borderColor: GPU_FILL, color: GPU_FILL }}>
              8 × 288 = {NODE_HBM.toLocaleString("en-US")}GB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniNode({ dpu, mode, index }: { dpu: 1 | 2; mode: "count" | "hbm" | "dgx" | "muted"; index: number }) {
  const muted = mode === "muted";
  return (
    <div className={`min-w-0 rounded-md border border-border bg-background p-1 sm:p-1.5 ${muted ? "opacity-45" : ""}`}>
      <p className="hidden text-[10px] leading-4 text-muted-foreground sm:block">노드 {index + 1}</p>
      <div className="mt-0.5 grid grid-cols-4 gap-0.5">
        {Array.from({ length: GPU_PER_NODE }, (_, gpu) => (
          <span
            key={gpu}
            className={`block h-3 rounded-[2px] sm:h-4 ${mode === "hbm" ? "border" : ""}`}
            style={mode === "hbm" ? { borderColor: GPU_FILL } : { backgroundColor: GPU_FILL, opacity: muted ? 0.5 : 0.85 }}
          />
        ))}
      </div>
      <div className="mt-0.5 grid grid-cols-2 gap-0.5">
        {Array.from({ length: 2 }, (_, slot) => (
          <span
            key={slot}
            className="block h-1.5 rounded-[2px]"
            style={slot < dpu ? { backgroundColor: DPU_FILL, opacity: mode === "dgx" || slot === 0 ? 1 : 0.5 } : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function Totals({ values, hbm, dpuNote }: { values: readonly [string, string, string, string]; hbm: string; dpuNote?: string }) {
  const labels = ["GPU", "동서 어댑터", "북남 DPU", "시스템 메모리"] as const;
  const colors = [GPU_FILL, NIC_FILL, DPU_FILL, "#475569"] as const;
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
      {values.map((value, index) => (
        <div key={labels[index]} className="min-w-0 rounded-md border border-border bg-background px-2 py-1.5">
          <p className="text-[11px] text-muted-foreground">{labels[index]}</p>
          <p className="font-mono text-sm font-bold" style={{ color: colors[index] }}>{value}</p>
          {index === 2 && dpuNote ? <p className="text-[10px] leading-4 text-muted-foreground">{dpuNote}</p> : null}
        </div>
      ))}
      <div className="col-span-2 min-w-0 rounded-md border border-border bg-background px-2 py-1.5 sm:col-span-1">
        <p className="text-[11px] text-muted-foreground">HBM 합</p>
        <p className="font-mono text-sm font-bold" style={{ color: GPU_FILL }}>{hbm}</p>
      </div>
    </div>
  );
}

function Grid({ dpu, mode }: { dpu: 1 | 2; mode: "count" | "hbm" | "dgx" | "muted" }) {
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8 sm:gap-2">
      {Array.from({ length: NODES }, (_, index) => (
        <MiniNode key={index} index={index} dpu={dpu} mode={mode} />
      ))}
    </div>
  );
}

const HGX_TOTALS = ["128개", "128개", "16개", "최소 32TB"] as const;
const TOTAL_HBM_TEXT = `${TOTAL_HBM.toLocaleString("en-US")}GB`;

export default function NodeExpansionViz() {
  return (
    <SceneShell
      eyebrow="기준 구성 × 16"
      title="노드 한 대의 사양을 16배로 펼치면 무엇이 정해지고 무엇이 남는가"
      description="파란 칸이 GPU 한 장, 주황 띠가 북남 DPU 한 장입니다. 수량은 본문의 공개 HGX 기준과 DGX user guide 값을 곱한 것이며 실제 견적이 아닙니다."
      ariaLabel="HGX B300 한 노드 사양을 16노드로 펼친 수량, 분산 HBM, DGX와 HGX의 DPU 차이, 미확정 행"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return <SingleNode />;
        }
        if (active === 1) {
          return (
            <div>
              <Grid dpu={1} mode="count" />
              <Totals values={HGX_TOTALS} hbm={TOTAL_HBM_TEXT} />
            </div>
          );
        }
        if (active === 2) {
          return (
            <div>
              <Grid dpu={1} mode="hbm" />
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p className="rounded-md border px-2 py-1.5 text-xs leading-5" style={{ borderColor: GPU_FILL }}>
                  빈 칸 하나 = GPU 한 장의 HBM 288GB. 128칸을 모두 더하면 <b className="font-mono">{TOTAL_HBM_TEXT}</b>
                </p>
                <p className="rounded-md border border-dashed border-red-600 px-2 py-1.5 text-xs leading-5 text-red-700 dark:text-red-400">
                  {TOTAL_HBM_TEXT}짜리 연속 메모리 한 덩어리가 아닙니다
                </p>
              </div>
            </div>
          );
        }
        if (active === 3) {
          return (
            <div>
              <Grid dpu={2} mode="dgx" />
              <Totals values={["128개", "128개", "32개", "BOM 확인"]} hbm={TOTAL_HBM_TEXT} dpuNote="HGX 권장안은 16개" />
            </div>
          );
        }
        return (
          <div>
            <Grid dpu={1} mode="muted" />
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {["compute fabric switch", "광모듈 양 끝", "케이블 길이·포트 분할"].map((item) => (
                <div key={item} className="flex min-w-0 items-center justify-between gap-2 rounded-md border border-dashed border-border px-2 py-1.5 text-xs">
                  <span className="min-w-0 break-words font-semibold">{item}</span>
                  <span className="shrink-0 font-mono font-bold text-muted-foreground">미확정</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
