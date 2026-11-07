import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism HIP-3 문단 — 운영자 DEX별 분리와, cross margin을 켠 뒤 이어질 수 있는 위험.
 */
const SCENES = [
  { label: "기본: 운영자 DEX별로 나눔", summary: "담보 계산·주문장·설정 분리", linked: false, note: "운영자 DEX마다 기본 담보 계산과 주문장, 설정을 나눕니다. 여기까지 보면 한쪽 시장의 문제가 다른 쪽과 무관해 보입니다." },
  { label: "자격 자산에 cross margin", summary: "한 번 켜면 되돌릴 수 없음", linked: true, note: "자격을 갖춘 자산은 운영자가 cross margin을 한 번 켜면 되돌릴 수 없습니다. 이 경우 서로 다른 운영자의 DEX 사이에도 위험이 이어질 수 있어, 독립 담보라는 단순 가정을 그대로 적용하면 안 됩니다." },
] as const;

function DexBox({ name }: { name: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 text-center text-xs leading-6">
      <p className="text-sm font-bold">{name}</p>
      <p className="text-muted-foreground">기본 담보 계산</p>
      <p className="text-muted-foreground">주문장</p>
      <p className="text-muted-foreground">설정</p>
    </div>
  );
}

export default function Hip3BoundaryViz() {
  return (
    <SceneShell
      eyebrow="HIP-3 시장의 담보 경계"
      title="운영자가 다른 DEX면 위험도 항상 나뉠까요"
      description="HIP-3 시장은 외부 운영자가 가격 자료·계약조건·레버리지 한도와 종료를 정합니다. DEX는 그 운영자가 연 거래 시장 묶음입니다. 2026-10-18 확인한 문서 기준의 구조도이며 금액을 나타내지 않습니다."
      ariaLabel="운영자 DEX별 분리와 cross margin을 켠 뒤의 위험 연결 비교"
      scenes={SCENES}
      render={(active) => {
        const { linked } = SCENES[active];
        return (
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] items-center gap-1 sm:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)] sm:gap-2">
            <DexBox name="운영자 A DEX" />
            <div className="text-center text-xs font-semibold leading-5" style={{ color: linked ? "#dc2626" : "#94a3b8" }}>
              <svg viewBox="0 0 60 12" className="mx-auto h-3 w-full" aria-hidden="true">
                <line x1="2" x2="58" y1="6" y2="6" stroke={linked ? "#dc2626" : "#94a3b8"} strokeWidth={1.25} strokeDasharray={linked ? undefined : "4 6"} />
              </svg>
              {linked ? "위험이 이어질 수 있음" : "기본은 분리"}
            </div>
            <DexBox name="운영자 B DEX" />
          </div>
        );
      }}
    />
  );
}
