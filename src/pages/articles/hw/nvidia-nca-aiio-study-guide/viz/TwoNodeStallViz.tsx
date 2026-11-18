import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — (가정) 8-GPU node 두 대, 장치 16개가 모두 보이고 단일 GPU test도 통과.
 * 두 node가 함께하는 학습 작업은 연결을 만드는 단계에서 멈추고, 대기열은 GPU가 남아 있다고 표시.
 * 면접 질문의 네 구간: 연산 장치, node 사이 연결, 작업 배치, 전력·냉각. 원인은 단정하지 않는다.
 */
const NODES = ["node 1", "node 2"] as const;
const GPUS_PER_NODE = 8;
const OK = "#16a34a";
const STALL = "#dc2626";
const ZONE = "#2563eb";

const SCENES = [
  { label: "장치 16개가 모두 보인다", summary: "8 × 2 = 16", note: "두 node에서 GPU를 열거하면 8개씩, 모두 16개가 나타납니다. 장치 목록만 보면 빠진 것이 없습니다." },
  { label: "단일 GPU test도 통과", summary: "GPU 하나씩은 정상", note: "GPU 하나만 쓰는 test는 통과했습니다. 다만 GPU 하나로 끝나는 test는 node 사이 연결을 지나가지 않습니다." },
  { label: "두 node 작업은 연결 단계에서 멈춤", summary: "대기열: GPU 남아 있음", note: "두 node가 함께하는 학습 작업은 서로 연결을 만드는 단계에서 더 나가지 못합니다. 그런데 대기열에는 사용 가능한 GPU가 남아 있다고 표시됩니다." },
  { label: "어디부터 확인할까", summary: "네 구간 · 아직 원인 미정", note: "면접 질문은 이 네 구간 가운데 첫 확인 지점을 고르라는 것입니다. 그림은 구간 위치만 보여 주며 어느 쪽이 원인인지는 정하지 않습니다. 증상별 첫 문은 4절에서 고릅니다." },
] as const;

function ZoneTag({ show, children }: { show: boolean; children: string }) {
  return (
    <span
      className={`inline-block rounded-md border px-2 py-0.5 text-center text-[11px] font-bold leading-4 ${show ? "" : "invisible"}`}
      style={{ borderColor: ZONE, color: ZONE }}
    >
      {children}
    </span>
  );
}

export default function TwoNodeStallViz() {
  return (
    <SceneShell
      eyebrow="16-GPU 사건"
      title="GPU는 모두 보이는데 두 node 작업만 시작하지 못합니다"
      description="node는 GPU 여러 개가 들어 있는 서버 한 대입니다. 8-GPU node 두 대(가정)에서 칸 하나가 GPU 하나이고, 가운데 선이 node 사이 연결입니다. 빨간 점선은 멈춘 작업이며, 연결 자체가 고장 났다는 표시는 아닙니다."
      ariaLabel="두 대의 8-GPU node에서 16개 GPU가 보이지만 두 node 작업이 연결 단계에서 멈추는 장면과 확인할 네 구간"
      scenes={SCENES}
      render={(active) => {
        const zones = active === 3;
        const stalled = active >= 2;
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">대기열(작업 배치)</p>
                <p className={`text-xs font-bold ${active >= 2 ? "" : "text-muted-foreground"}`}>
                  {active >= 2 ? "사용 가능한 GPU가 남아 있다고 표시" : "—"}
                </p>
              </div>
              <ZoneTag show={zones}>작업 배치</ZoneTag>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] items-stretch gap-1 sm:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)]">
              {NODES.map((node, ni) => (
                <div key={node} className={`min-w-0 rounded-lg border border-border bg-background p-2 ${ni === 1 ? "col-start-3" : ""}`}>
                  <p className="mb-1 text-center text-[11px] font-semibold text-muted-foreground">{node}</p>
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: GPUS_PER_NODE }, (_, g) => (
                      <span
                        key={g}
                        className="grid h-7 place-items-center rounded-sm border text-[10px] font-bold"
                        style={{ borderColor: OK, color: OK }}
                      >
                        {active === 1 ? "✓" : ni * GPUS_PER_NODE + g}
                      </span>
                    ))}
                  </div>
                  <p className={`mt-1 text-center text-[11px] ${active === 1 ? "font-bold" : "invisible"}`} style={{ color: OK }}>
                    단일 GPU test 통과
                  </p>
                </div>
              ))}
              <div className="col-start-2 row-start-1 flex flex-col items-center justify-center gap-1">
                <svg viewBox="0 0 60 20" className="h-5 w-full" aria-hidden="true">
                  <line x1={2} x2={58} y1={10} y2={10} stroke="#94a3b8" strokeWidth={1.25} />
                </svg>
                <ZoneTag show={zones}>node 사이 연결</ZoneTag>
              </div>
            </div>

            <div
              className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 ${stalled ? "border-dashed" : "border-border"}`}
              style={stalled ? { borderColor: STALL } : undefined}
            >
              <span className="text-[11px] text-muted-foreground">두 node 학습 작업</span>
              <span className={`text-[11px] font-bold ${stalled ? "" : "text-muted-foreground"}`} style={stalled ? { color: STALL } : undefined}>
                {stalled ? "■ 연결을 만드는 단계에서 멈춤" : "—"}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <ZoneTag show={zones}>연산 장치 (GPU 칸)</ZoneTag>
              <ZoneTag show={zones}>전력·냉각</ZoneTag>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-border px-3 py-2">
              <span className="text-[11px] text-muted-foreground">전기 공급 · 열 제거</span>
              <span className="text-[11px] text-muted-foreground">{zones ? "확인 후보" : "—"}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
