import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #token-cashflow-control — 담보 경로. 100개 × 1.02 = 102, 20% 할인 → 81.60.
 * 청산 때 이전 제한으로 팔 수 없다면 81.60 평가만으로 회수 가능성을 설명할 수 없다.
 */
const CHECKS = [
  { name: "가격", detail: "1.02의 출처와 최신성" },
  { name: "할인", detail: "102 × 0.8 = 81.60" },
  { name: "주소", detail: "담보 계약이 허용 주소인가" },
  { name: "청산", detail: "인수할 상대방이 있는가" },
] as const;

const SCENES = [
  { label: "담보 평가", summary: "100개 → 102 → 81.60", upto: 2, branch: null, note: "담보 계약에 100개를 넣으면 1.02 가격의 출처와 최신성을 보고, 20% 할인(haircut)을 적용해 81.60으로 평가합니다. 이 숫자는 평가입니다." },
  { label: "넣을 수 있는 주소", summary: "허용 주소 확인", upto: 3, branch: null, note: "보유 자격이 필요한 지분이면 담보 계약의 주소도 허용되어야 합니다. 평가가 끝났다고 넣을 수 있다는 뜻은 아닙니다." },
  { label: "청산: 팔 수 있을 때", summary: "압류 → 상대방에게 매도", upto: 4, branch: "ok", note: "대출 계약이 토큰을 압류하고 이전이 허용되며 인수할 상대방이 있으면 매도 경로가 열립니다. 받을 금액은 그 상대방과의 조건으로 정해지며 81.60이 보장되는 것은 아닙니다." },
  { label: "청산: 팔 수 없을 때", summary: "압류는 됐지만 매도 막힘", upto: 4, branch: "blocked", note: "대출 계약이 토큰을 압류할 수 있어도 발행자의 이전 제한 때문에 팔 수 없다면 81.60 평가만으로 회수 가능성을 설명할 수 없습니다." },
] as const;

export default function CollateralPathViz() {
  return (
    <SceneShell
      eyebrow="담보로 넣는 경로"
      title="담보 평가 81.60과 실제로 회수하는 일은 다른 단계입니다"
      description="3절의 가상 펀드 100개를 담보 계약에 넣는 경로입니다. 위에서 아래로 차례로 확인하고, 마지막 칸에서 갈라집니다."
      ariaLabel="담보 평가와 청산 시 매도 가능 여부의 분기"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="min-w-0">
              <ol className="space-y-1">
                {CHECKS.map((check, index) => {
                  const done = index < scene.upto;
                  const current = index === scene.upto - 1;
                  return (
                    <li key={check.name} className={`grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-2 rounded-lg border px-3 py-1 text-sm ${current ? "border-primary bg-primary/5" : done ? "border-border bg-background" : "border-border/40"}`}>
                      <span className={`font-bold ${done ? "" : "text-muted-foreground/50"}`}>{check.name}</span>
                      <span className={`min-w-0 text-xs leading-5 sm:text-sm ${done ? "text-muted-foreground" : "text-muted-foreground/50"}`}>{check.detail}</span>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                <div className={`min-w-0 rounded-lg border px-3 py-2 ${scene.branch === "ok" ? "border-green-600 bg-green-600/10" : "border-border/40"}`}>
                  <p className={`text-sm font-bold ${scene.branch === "ok" ? "" : "text-muted-foreground/50"}`}>{scene.branch === "ok" ? "▶ " : ""}이전 가능</p>
                  <p className={`text-xs leading-5 ${scene.branch === "ok" ? "text-muted-foreground" : "text-muted-foreground/50"}`}>매도 경로가 열림, 금액은 상대방 조건</p>
                </div>
                <div className={`min-w-0 rounded-lg border px-3 py-2 ${scene.branch === "blocked" ? "border-red-600 bg-red-600/10" : "border-border/40"}`}>
                  <p className={`text-sm font-bold ${scene.branch === "blocked" ? "" : "text-muted-foreground/50"}`}>{scene.branch === "blocked" ? "▶ " : ""}이전 제한</p>
                  <p className={`text-xs leading-5 ${scene.branch === "blocked" ? "text-muted-foreground" : "text-muted-foreground/50"}`}>압류해도 팔 수 없음, 평가 숫자만 남음</p>
                </div>
              </div>
            </div>
          ))}
        />
      )}
    />
  );
}
