import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 국민 주권·시민권·세금과 징병·제국 팽창이 같은 지도에서 다른 곳을 움직입니다.
 * 안쪽 상자는 본국(독립국)의 명부 안과 밖, 오른쪽은 식민지입니다. 상자 크기는 인구 비율이 아닙니다.
 */
const SCENES = [
  { label: "국민 주권", summary: "권한의 근거: 왕 → 국민", note: "국민 주권은 정부 권한의 근거를 바꿉니다. 왕이 아니라 국민과 시민이 주권의 근원이라는 선언입니다." },
  { label: "시민권", summary: "명부 안과 밖을 가르는 선", note: "시민권은 누가 투표·소유·이동·재판의 권리를 갖는지 정합니다. 그 권리를 가진 쪽으로 적힌 목록이 명부입니다." },
  { label: "세금과 징병", summary: "주민 → 국가", note: "세금과 징병은 국가가 주민에게 요구하는 몫을 늘립니다." },
  { label: "제국 팽창", summary: "본국 → 식민지", note: "제국 팽창은 본국의 시민 규칙과 다른 통치를 식민지에 적용합니다." },
  { label: "같은 방향이 아닙니다", summary: "넓어짐 · 밖 · 신민", note: "참정권이 본국 남성에게 넓어지는 동안 식민지 주민은 신민으로 남을 수 있었고, 독립국 안에서도 여성·노예·토착민·무산자는 명부 밖에 놓였습니다." },
] as const;

function Part({ on, tone = "#2563eb", className = "", children }: { on: boolean; tone?: string; className?: string; children: ReactNode }) {
  return (
    <div
      className={`min-w-0 rounded-lg px-2 py-1.5 text-xs leading-5 sm:px-3 sm:py-2 sm:text-sm ${on ? "bg-background" : "opacity-40"} ${className}`}
      style={{ border: `1px ${on ? "solid" : "dashed"} ${on ? tone : "#94a3b8"}` }}
    >
      {children}
    </div>
  );
}

export default function FourFlowsViz() {
  return (
    <SceneShell
      eyebrow="네 흐름의 지도"
      title="네 흐름은 함께 움직여도 같은 곳을 같은 쪽으로 밀지 않았습니다"
      description="왼쪽이 본국·독립국 안, 오른쪽이 식민지이고 상자 크기는 인구 비율이 아닙니다. 참정권 = 정치에 참여할 권리, 신민 = 통치를 받되 시민의 권리가 없는 주민, 무산자 = 재산 없는 사람."
      ariaLabel="국민 주권, 시민권, 세금과 징병, 제국 팽창이 본국과 식민지의 어디에 작용하는지 보여 주는 지도"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,7rem)] gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,12rem)] sm:gap-4">
            <div className="min-w-0 space-y-1.5 rounded-lg border border-border p-2">
              <p className="text-xs font-bold leading-5">본국 · 독립국</p>
              <Part on={active === 0}><b>정부 권한의 근거</b> 왕 → 국민·시민</Part>
              <Part on={active === 2} tone="#b45309"><b>국가</b> ↑ 세금·징병: 주민에게 요구하는 몫이 늘어남</Part>
              <Part on={active === 1 || active === 4}>
                <b>명부 안</b> {active === 4 ? "↑ 참정권이 본국 남성에게 넓어짐" : "투표·소유·이동·재판의 권리"}
              </Part>
              <div className={`flex items-center gap-2 text-xs font-semibold ${active === 1 ? "" : "opacity-40"}`} style={{ color: "#2563eb" }}>
                <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: "#2563eb" }} />
                <span className="shrink-0">시민권 경계</span>
                <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: "#2563eb" }} />
              </div>
              <Part on={active === 1 || active === 4} tone="#dc2626">
                <b>명부 밖</b> 여성·노예·토착민·무산자
              </Part>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5 rounded-lg border border-border p-2">
              <p className="text-xs font-bold leading-5">식민지</p>
              <Part on={active === 3} tone="#b45309"><b>→ 본국에서</b> 시민 규칙과 다른 통치</Part>
              <Part on={active === 4} tone="#dc2626" className="flex-1"><b>주민</b> 신민으로 남을 수 있음</Part>
            </div>
          </div>
        </div>
      )}
    />
  );
}
