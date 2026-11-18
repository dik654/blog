import SceneShell from "./SceneShell";

/**
 * 본문 대응: #new-payload — Prysm v7.3.1 NewPayload의 method 선택(사이드바 new_payload.go).
 * payload type switch: ExecutionPayload→V1, Capella→V2, Deneb(requests 없음)→V3,
 * Deneb(requests 있음)→V4, Gloas→V5, 그 밖→error. 숫자 하나의 비교가 아니다.
 */
const ROUTES = [
  { type: "ExecutionPayload", check: "", method: "V1", params: ["payload"] },
  { type: "ExecutionPayloadCapella", check: "", method: "V2", params: ["payload"] },
  { type: "ExecutionPayloadDeneb", check: "requests 없음", method: "V3", params: ["payload", "blob versioned hashes", "parent beacon root"] },
  { type: "ExecutionPayloadDeneb", check: "requests 있음", method: "V4", params: ["payload", "blob versioned hashes", "parent beacon root", "execution requests"] },
  { type: "ExecutionPayloadGloas", check: "", method: "V5", params: ["payload", "blob versioned hashes", "parent beacon root", "execution requests"] },
  { type: "그 밖의 type", check: "", method: "error", params: [] },
] as const;

const SCENES = [
  { label: "V1", summary: "ExecutionPayload → newPayloadV1", note: "가장 기본 payload type은 V1으로 갑니다. Payload만 보냅니다." },
  { label: "V2", summary: "Capella type → newPayloadV2", note: "Capella payload type은 V2를 고릅니다. 갈림은 숫자 비교가 아니라 payload의 concrete type으로 정해집니다." },
  { label: "V3", summary: "Deneb type · requests 없음 → V3", note: "Deneb payload는 한 번 더 갈립니다. Execution requests가 없으면 V3이고, Deneb 이후 추가된 blob versioned hashes와 parent beacon block root를 함께 보냅니다." },
  { label: "V4", summary: "Deneb type · requests 있음 → V4", note: "같은 Deneb payload type이라도 Electra 이후 추가된 execution requests가 있으면 V4로 갑니다. Payload type만 보고 V3이라고 단정할 수 없는 이유입니다." },
  { label: "V5", summary: "Gloas type → newPayloadV5", note: "Gloas payload type은 V5로 가며 execution requests까지 함께 보냅니다." },
  { label: "모르는 type", summary: "error · 낮은 version으로 안 보냄", note: "지원하지 않는 data type은 더 낮은 version에 조용히 맞춰 보내지 않고 \"unknown execution data type\" error로 끝냅니다." },
] as const;

export default function NewPayloadMethodViz() {
  return (
    <SceneShell
      eyebrow="newPayload method 선택 · Prysm v7.3.1"
      title="Payload type과 execution requests가 함께 method를 고릅니다"
      description="한 줄이 하나의 갈림길입니다. 왼쪽은 E₁의 Go type 이름, 가운데는 추가 확인, 오른쪽은 고른 engine_newPayloadVn과 함께 보내는 값입니다. 사이드바의 new_payload.go와 같은 순서입니다."
      ariaLabel="payload type과 execution requests 유무에 따라 newPayload V1부터 V5 또는 error로 가는 여섯 갈림"
      scenes={SCENES}
      render={(active) => (
        <ol className="grid gap-1.5">
          {ROUTES.map((route, index) => {
            const on = index === active;
            const isError = route.method === "error";
            return (
              <li
                key={`${route.type}-${route.check}`}
                className={`grid min-w-0 grid-cols-[minmax(0,1fr)_3.25rem] items-center gap-x-2 gap-y-1 rounded-lg border bg-background px-2.5 py-2 text-xs sm:grid-cols-[minmax(0,13rem)_6.5rem_3.5rem_minmax(0,1fr)] ${
                  on ? (isError ? "border-red-600 ring-1 ring-inset ring-red-600" : "border-primary ring-1 ring-inset ring-primary") : "border-border text-muted-foreground"
                }`}
              >
                <span className={`min-w-0 break-all font-mono text-[11px] ${on ? "font-bold text-foreground" : ""}`}>{route.type}</span>
                <strong className={`text-right font-mono sm:order-3 sm:text-left ${on ? (isError ? "text-red-700 dark:text-red-400" : "text-primary") : ""}`}>{route.method}</strong>
                <span className="col-span-2 break-keep text-[11px] sm:order-2 sm:col-span-1">{route.check ? `→ ${route.check}` : ""}</span>
                <span className="col-span-2 flex min-w-0 flex-wrap gap-1 sm:order-4 sm:col-span-1">
                  {route.params.length === 0 ? (
                    <span className="break-keep text-[11px]">호출하지 않음</span>
                  ) : (
                    route.params.map((param) => (
                      <span key={param} className={`rounded border px-1 text-[10px] leading-4 ${on ? "border-primary/60 text-foreground" : "border-border"}`}>{param}</span>
                    ))
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    />
  );
}
