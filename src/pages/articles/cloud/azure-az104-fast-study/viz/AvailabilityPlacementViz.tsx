import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 둘째 문단 — Availability Set은 한 데이터센터 안의 장애·업데이트 도메인 분산,
 * Availability Zone은 리전 안의 물리적으로 분리된 위치.
 * VM 2대, 장애 도메인 2개는 설명을 위한 가정이고, 영역 2개는 3절 "웹 앱은 두 영역에 배치"에서 가져왔다.
 * 장애·업데이트 도메인의 뜻은 용어의 짧은 정의다.
 */
type Down = "none" | "rack" | "site";

const SCENES = [
  {
    label: "Availability Set",
    summary: "한 데이터센터 안에서 나눔",
    focus: "set" as const,
    down: "none" as Down,
    note: "장애 도메인은 전원과 네트워크 스위치를 함께 쓰는 하드웨어 묶음이고, 업데이트 도메인은 계획된 유지 관리 때 함께 재시작되는 묶음입니다. Availability Set은 VM을 이 묶음들에 나눠 놓지만 모두 한 데이터센터 안에 있습니다.",
  },
  {
    label: "Set · 장애 도메인 하나가 멈추면",
    summary: "VM 1대 멈춤 · 1대 남음",
    focus: "set" as const,
    down: "rack" as Down,
    note: "같은 하드웨어 묶음을 쓰는 VM만 멈추고, 다른 장애 도메인의 VM은 계속 돕니다. 이것이 Availability Set이 막는 범위입니다.",
  },
  {
    label: "Availability Zone",
    summary: "리전 안의 떨어진 위치에 나눔",
    focus: "zone" as const,
    down: "none" as Down,
    note: "Availability Zone은 같은 리전 안에서 물리적으로 분리된 위치입니다. 3절 사례가 웹 앱을 두 영역에 배치한 것이 이 방식입니다.",
  },
  {
    label: "위치 하나가 통째로 멈추면",
    summary: "Set 2대 모두 영향 · Zone 1대 남음",
    focus: "both" as const,
    down: "site" as Down,
    note: "Set의 VM은 모두 한 데이터센터 안에 있으므로 그 데이터센터 전체가 멈추는 사건은 Set의 분산 범위 밖입니다. 영역에 나눈 VM은 다른 위치에 있어 한 영역이 멈춰도 다른 영역의 VM이 남습니다.",
  },
] as const;

const UP = "#16a34a";
const OFF = "#dc2626";
const ACCENT = "#2563eb";

function Vm({ name, down }: { name: string; down: boolean }) {
  return (
    <div
      className={`min-w-0 rounded-md border px-2 py-1.5 text-center ${down ? "border-dashed" : ""}`}
      style={{ borderColor: down ? OFF : UP }}
    >
      <p className="text-xs font-bold leading-5 text-foreground">{name}</p>
      <p className="text-[11px] font-semibold leading-4" style={{ color: down ? OFF : UP }}>
        {down ? "✕ 멈춤" : "✓ 동작"}
      </p>
    </div>
  );
}

function Slot({ title, sub, down, children }: { title: string; sub: string; down: boolean; children: ReactNode }) {
  return (
    <div className={`min-w-0 rounded-md border p-2 ${down ? "border-dashed" : ""}`} style={{ borderColor: down ? OFF : "#94a3b8" }}>
      <p className="break-words text-xs font-semibold leading-5 text-foreground">{title}</p>
      <p className="break-words text-[11px] leading-4 text-muted-foreground">{sub}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export default function AvailabilityPlacementViz() {
  return (
    <SceneShell
      eyebrow="가용성 배치"
      title="Availability Set과 Zone은 나누는 범위가 다릅니다"
      description="Set 쪽은 VM 2대를 한 데이터센터 안 두 장애 도메인에, Zone 쪽은 리전 안 두 영역에 나눈 그림입니다. VM과 장애 도메인 수는 가정이고, 영역 2개는 3절 사례를 따랐습니다."
      ariaLabel="Availability Set과 Availability Zone에 VM을 나눴을 때 장애 범위별로 남는 VM"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const setOn = scene.focus !== "zone";
        const zoneOn = scene.focus !== "set";
        const rackDown = scene.down === "rack" && setOn;
        const siteDown = scene.down === "site";
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <div className="min-w-0 rounded-lg border p-2.5" style={{ borderColor: setOn ? ACCENT : "#94a3b8", opacity: setOn ? 1 : 0.55 }}>
              <p className="text-sm font-bold text-foreground">Availability Set</p>
              <p className="text-xs leading-5 text-muted-foreground">리전 안 데이터센터 1곳</p>
              <div className={`mt-2 rounded-md border p-2 ${siteDown ? "border-dashed" : ""}`} style={{ borderColor: siteDown ? OFF : "#94a3b8" }}>
                <p className="text-xs font-semibold leading-5 text-foreground">데이터센터 {siteDown ? "· ✕ 전체 멈춤" : ""}</p>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <Slot title="장애 도메인 1" sub="업데이트 도메인 1" down={rackDown || siteDown}>
                    <Vm name="VM A" down={rackDown || siteDown} />
                  </Slot>
                  <Slot title="장애 도메인 2" sub="업데이트 도메인 2" down={siteDown}>
                    <Vm name="VM B" down={siteDown} />
                  </Slot>
                </div>
              </div>
            </div>
            <div className="min-w-0 rounded-lg border p-2.5" style={{ borderColor: zoneOn ? ACCENT : "#94a3b8", opacity: zoneOn ? 1 : 0.55 }}>
              <p className="text-sm font-bold text-foreground">Availability Zone</p>
              <p className="text-xs leading-5 text-muted-foreground">리전 안 물리적으로 떨어진 위치 2곳</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Slot title="영역 1" sub={siteDown ? "✕ 통째로 멈춤" : "떨어진 위치"} down={siteDown}>
                  <Vm name="VM A" down={siteDown} />
                </Slot>
                <Slot title="영역 2" sub="떨어진 위치" down={false}>
                  <Vm name="VM B" down={false} />
                </Slot>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
