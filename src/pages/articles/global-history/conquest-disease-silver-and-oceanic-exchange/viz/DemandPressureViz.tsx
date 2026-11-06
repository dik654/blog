import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 은은 안데스에서 아시아 쪽으로 가지만 수요의 압력은 반대로 생산지에 닿을 수 있습니다.
 * 그 수요가 미타와 결합해도 생산량과 부담은 여섯 조건이 함께 정합니다. 화살표 굵기나 조건 순서에 크기의 뜻은 없습니다.
 */
const SCENES = [
  { label: "은이 가는 쪽", summary: "안데스 → 유럽 → 아시아", note: "3절의 가정 경로처럼 은의 일부는 안데스에서 유럽 상인을 거쳐 아시아 시장으로 갑니다." },
  { label: "수요가 닿는 쪽", summary: "아시아 → 유럽 → 안데스", note: "유럽 상인은 아시아 상품을 살 결제 수단이 필요했고, 여러 아시아 시장에서 은은 수요가 높았습니다. 멀리 있는 수요가 생산지에 압력을 줄 수 있습니다." },
  { label: "수요를 가진 다른 주체", summary: "왕실 · 광산 사업자", note: "수요는 상인에게만 있지 않았습니다. 왕실은 세입을, 광산 사업자는 안정된 노동력을 원했습니다." },
  { label: "미타와 결합", summary: "수요 + 강제 노동 동원", note: "이 수요가 안데스의 미타 같은 강제 노동 동원과 결합했습니다. 미타는 안데스 원주민을 광산 노동에 강제로 동원한 제도입니다." },
  { label: "자동으로 생긴 결과가 아닙니다", summary: "여섯 조건이 함께", note: "은 수요 하나가 정복과 노동 제도를 자동으로 만들었다고 볼 수 없습니다. 이 조건들이 함께 생산량과 사람의 부담을 정했습니다." },
] as const;

const CONDITIONS = ["식민 법", "현지 권력자", "기술", "수은 공급", "운송로", "저항"] as const;

function Slot({ on, className = "", children }: { on: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-1.5 text-xs leading-5 sm:px-3 sm:py-2 sm:text-sm ${on ? "border-border bg-background" : "border-dashed border-border/60 opacity-30"} ${className}`}>
      {children}
    </div>
  );
}

function Lane({ label, color, reverse, on }: { label: string; color: string; reverse?: boolean; on: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-semibold ${on ? "" : "opacity-25"}`} style={{ color }}>
      <span className="shrink-0">{label}</span>
      <svg aria-hidden="true" className="h-3 min-w-0 flex-1" preserveAspectRatio="none" viewBox="0 0 100 12">
        <line x1="0" y1="6" x2="100" y2="6" stroke={color} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <span aria-hidden="true" className={`shrink-0 ${reverse ? "order-first" : ""}`}>{reverse ? "◀" : "▶"}</span>
    </div>
  );
}

export default function DemandPressureViz() {
  return (
    <SceneShell
      eyebrow="수요와 강제력"
      title="은은 아시아 쪽으로 가도 수요의 압력은 생산지에 닿을 수 있습니다"
      description="위쪽은 같은 길의 두 방향, 아래쪽은 그 수요가 노동 제도와 만나는 자리입니다. 칸 위치는 관계만 나타냅니다."
      ariaLabel="은의 이동 방향과 수요 압력의 반대 방향, 왕실과 광산 사업자의 수요, 미타와의 결합, 여섯 조건을 보여 주는 관계 그림"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-3 gap-2">
            <Slot on><b className="block">안데스 광산</b>은 생산</Slot>
            <Slot on><b className="block">유럽 상인</b>{active >= 1 ? "결제 수단 필요" : "은을 받음"}</Slot>
            <Slot on><b className="block">아시아 시장</b>{active >= 1 ? "은 수요 높음" : "은을 받음"}</Slot>
          </div>
          <div className="mt-2 space-y-1">
            <Lane label="은" color="#475569" on={active === 0 || active === 1} />
            <Lane label="수요" color="#b45309" reverse on={active >= 1} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Slot on={active >= 2}><b className="block">왕실</b>세입을 원함</Slot>
            <Slot on={active >= 2}><b className="block">광산 사업자</b>안정된 노동력을 원함</Slot>
            <Slot on={active >= 3} className="col-span-2 sm:col-span-1"><b className="sm:block"><span aria-hidden="true">↳ </span>미타</b> 같은 강제 노동 동원과 결합</Slot>
          </div>
          <div className={`mt-2 rounded-lg border px-2 py-1.5 sm:px-3 ${active >= 4 ? "border-border bg-background" : "border-dashed border-border/60 opacity-30"}`}>
            <div className="flex flex-wrap gap-1.5">
              {CONDITIONS.map((condition) => (
                <span key={condition} className="rounded-md border border-border px-2 py-0.5 text-xs leading-5">{condition}</span>
              ))}
            </div>
            <p className="mt-1 text-xs font-semibold leading-5 sm:text-sm">→ 함께 정하는 것: 생산량과 사람의 부담</p>
          </div>
        </div>
      )}
    />
  );
}
