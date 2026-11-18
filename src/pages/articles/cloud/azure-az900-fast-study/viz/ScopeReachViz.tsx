import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 테넌트에서 자원까지 내려가는 상자, 상위 범위에 붙인 규칙이 아래 자원에 닿는 범위.
 * 자원 칸 수는 3절 사례(개발팀 10개 · 운영팀 10개, 리소스 그룹 2개)에서 가져왔다.
 * 마지막 장면은 1절 사고(자원이 개인 구독에 놓였고 예산 경보·삭제 잠금은 다른 범위에 있음)다.
 * 두 리소스 그룹을 한 팀 구독에 둔 것, 개인 구독을 관리 그룹 밖에 둔 것, 규칙을 붙인 자리는 그림을 위한 가정이다.
 */
type Scope = "none" | "mg" | "dev" | "sub";

const SCENES = [
  {
    label: "상자는 위에서 아래로 겹칩니다",
    summary: "테넌트 → 관리 그룹 → 구독 → 리소스 그룹 → 자원",
    scope: "none" as Scope,
    rule: "",
    stray: false,
    note: "신원(사용자와 그룹)은 Entra 테넌트에 있습니다. 관리 그룹은 여러 구독을 묶고, 구독은 청구와 할당량의 경계이며, 그 안의 리소스 그룹에 개별 자원이 놓입니다. 칸 하나가 3절 사례의 자원 하나입니다.",
  },
  {
    label: "관리 그룹에 Policy를 붙이면",
    summary: "아래 20개 자원 전체에 닿을 수 있음",
    scope: "mg" as Scope,
    rule: "Policy · 허용 리전 밖 배포 거부",
    stray: false,
    note: "상위 범위에 붙인 규칙은 그 아래 구독·리소스 그룹·자원에 영향을 줄 수 있습니다. 7절에서 여러 구독의 잘못된 리전 배포를 막을 때 관리 그룹에 Azure Policy를 두는 이유입니다. 편리한 만큼 실수가 퍼지는 범위도 넓습니다.",
  },
  {
    label: "리소스 그룹에 역할을 붙이면",
    summary: "dev 리소스 그룹의 10개에만 닿음",
    scope: "dev" as Scope,
    rule: "역할 할당 · 개발팀 (가정)",
    stray: false,
    note: "범위를 낮추면 영향도 그 상자 안으로 줄어듭니다. 그래서 개발·운영과 민감도에 맞춰 경계를 나눕니다. 운영팀의 prod 리소스 그룹에는 이 역할이 닿지 않습니다.",
  },
  {
    label: "1절 사고: 자원이 다른 구독에 놓이면",
    summary: "경보·잠금이 닿지 않는 칸 1개",
    scope: "sub" as Scope,
    rule: "예산 경보 · 삭제 잠금",
    stray: true,
    note: "예산 경보와 삭제 잠금을 팀 구독에 붙였다고 가정한 그림입니다. 실습 자원이 개인 구독에 놓이면 이 규칙들의 범위 밖입니다. 1절처럼 기능은 정상이라 며칠 동안 눈치채지 못한 채 비용이 계속 늘 수 있습니다.",
  },
] as const;

const ACCENT = "#2563eb";
const STRAY = "#d97706";

function Badge({ text }: { text: string }) {
  if (!text) return null;
  return (
    <span className="mt-1 block text-xs font-semibold leading-5" style={{ color: ACCENT }}>
      ↓ {text}
    </span>
  );
}

function Cells({ count, lit }: { count: number; lit: boolean }) {
  return (
    <div className="mt-1.5 grid grid-cols-5 gap-1">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="block h-4 rounded-sm border"
          style={{ borderColor: lit ? ACCENT : "#94a3b8", backgroundColor: lit ? ACCENT : "transparent" }}
        />
      ))}
    </div>
  );
}

function Box({
  title,
  sub,
  lit,
  badge,
  children,
  dashed = false,
}: {
  title: string;
  sub: string;
  lit: boolean;
  badge: string;
  children?: ReactNode;
  dashed?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-lg border bg-background/60 p-2 ${dashed ? "border-dashed" : ""}`}
      style={{ borderColor: lit ? ACCENT : "#94a3b8" }}
    >
      <p className="break-words text-xs leading-5 text-muted-foreground sm:text-sm">
        <span className="font-bold text-foreground">{title}</span> · {sub}
      </p>
      <Badge text={badge} />
      {children}
    </div>
  );
}

export default function ScopeReachViz() {
  return (
    <SceneShell
      eyebrow="관리 범위"
      title="규칙을 붙인 상자 아래만 영향을 받습니다"
      description="파란 테두리와 칸이 규칙이 닿는 범위입니다. 칸 하나는 자원 하나이며, 3절의 두 팀 자원 20개를 썼습니다. 어느 구독에 무엇을 붙였는지는 설명을 위한 가정입니다."
      ariaLabel="테넌트, 관리 그룹, 구독, 리소스 그룹, 자원의 포함 관계와 규칙이 닿는 범위"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const s = scene.scope;
        const mgLit = s === "mg";
        const subLit = s === "mg" || s === "sub";
        const devLit = subLit || s === "dev";
        const prodLit = subLit;
        return (
          <div className="min-w-0 rounded-lg border border-dashed border-[#94a3b8] p-2">
            <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
              <span className="font-bold text-foreground">Entra 테넌트</span> · 사용자·그룹 같은 신원의 디렉터리
            </p>
            <div className="mt-2 grid min-w-0 gap-2.5 sm:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
              <Box title="관리 그룹" sub="여러 구독을 묶는 상자" lit={mgLit} badge={s === "mg" ? scene.rule : ""}>
                <div className="mt-2">
                  <Box title="팀 구독 (가정)" sub="청구·할당량의 경계" lit={subLit} badge={s === "sub" ? scene.rule : ""}>
                    <div className="mt-2 grid min-w-0 grid-cols-2 gap-2">
                      <Box title="dev" sub="리소스 그룹 · 개발팀 10개" lit={devLit} badge={s === "dev" ? scene.rule : ""}>
                        <Cells count={10} lit={devLit} />
                      </Box>
                      <Box title="prod" sub="리소스 그룹 · 운영팀 10개" lit={prodLit} badge="">
                        <Cells count={10} lit={prodLit} />
                      </Box>
                    </div>
                  </Box>
                </div>
              </Box>
              <Box title="개인 구독" sub="관리 그룹 밖에 둔 그림 (가정)" lit={false} badge="" dashed>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="block h-4 w-8 shrink-0 rounded-sm border border-dashed"
                    style={{
                      borderColor: scene.stray ? STRAY : "#94a3b8",
                      backgroundColor: scene.stray ? STRAY : "transparent",
                      opacity: scene.stray ? 1 : 0.4,
                    }}
                  />
                  <span className={`text-xs font-semibold leading-5 ${scene.stray ? "" : "invisible"}`} style={{ color: STRAY }}>
                    실습 자원 · 규칙이 닿지 않음
                  </span>
                </div>
              </Box>
            </div>
          </div>
        );
      }}
    />
  );
}
