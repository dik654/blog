import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture (#overview·#source 포함) — 계약의 기준자산에서 감독 틀과 확인할 기록으로 내려간다.
 * 일반 스왑(금리·통화·원자재) → CFTC, 단일 증권·좁은 증권지수 → 증권기반스왑 → SEC, 혼합스왑 → 공동 경계,
 * 장내 선물·옵션 → 등록 FCM·계좌 종류·분리 자금 공시. 단일 회사 신용스왑은 8절의 "전형적 사례"이며 최종 분류는 법적 정의로 판단한다.
 */
const BRANCHES = [
  { key: "swap", gate: "금리·통화·원자재 같은 일반 스왑", regulator: "CFTC 스왑 틀", example: "예: 변동→고정 금리스왑", check: "적격계약참가자 여부 · 딜러 등록 · 일일 가격 표시 · 청산 선택 설명" },
  { key: "sbs", gate: "단일 증권·좁은 증권지수에 연결", regulator: "SEC 증권기반스왑 틀", example: "예: 한 회사 신용스왑(전형적 사례)", check: "거래상대 자격 · 중요한 위험·특성 · 이해충돌 공시 · 일일 가격 표시" },
  { key: "mixed", gate: "두 성격이 섞인 혼합스왑", regulator: "CFTC·SEC 공동 경계", example: "공동 경계가 생길 수 있음", check: "두 틀을 함께 확인" },
  { key: "futures", gate: "거래소 선물·옵션", regulator: "등록 FCM (CFTC 안내)", example: "고객 돈은 FCM이 분리 보관", check: "등록 FCM · 계좌 종류 · 분리 자금 공시" },
] as const;

const SCENES = [
  { label: "계약 이름에서 출발합니다", summary: "기준자산이 무엇인가", focus: -1, note: "‘미국 규제’ 한 칸으로 적지 않고, 계약이 무엇에 기초하는지부터 묻습니다. 같은 장외 스왑이어도 기준자산에 따라 갈래가 나뉘고, 거래소 선물·옵션은 고객 돈 보관이 FCM 규칙으로 따로 갑니다." },
  { label: "일반 스왑", summary: "→ CFTC 스왑 틀", focus: 0, note: "금리·통화·원자재 같은 일반 스왑은 CFTC의 스왑 틀을 먼저 봅니다. 스왑 거래상대라면 적격계약참가자 여부, 딜러 등록, 일일 가격 표시와 청산 선택 설명을 별도로 봅니다." },
  { label: "증권기반스왑", summary: "→ SEC 틀", focus: 1, note: "단일 증권이나 좁은 증권지수에 연결된 계약은 SEC 틀을 확인합니다. 한 회사 신용스왑은 경계를 그리기 위한 전형적 사례이고, 실제 분류는 법적 정의·지수 구성·계약 조건을 대입해 판단합니다." },
  { label: "혼합스왑", summary: "→ 공동 경계", focus: 2, note: "두 성격이 섞인 혼합스왑에는 CFTC와 SEC의 공동 경계가 생길 수 있습니다." },
  { label: "장내 선물·옵션", summary: "→ FCM 분리 보관", focus: 3, note: "장내 선물 고객이라면 등록 FCM과 계좌 종류, 분리 자금 공시를 확인합니다. 고객 돈은 FCM의 분리 보관 규칙을 거칩니다." },
] as const;

export default function RegulatorRouteViz() {
  return (
    <SceneShell
      eyebrow="감독 문 찾기"
      title="계약의 기준자산이 감독 틀과 확인할 기록을 고릅니다"
      description="위에서 아래로 내려갑니다. CFTC는 미국 상품선물거래위원회, SEC는 증권거래위원회, FCM은 선물중개회사입니다. 증권기반스왑은 단일 증권이나 좁은 증권지수에 연결된 스왑입니다."
      ariaLabel="계약을 일반 스왑, 증권기반스왑, 혼합스왑, 장내 선물옵션으로 나눠 CFTC, SEC, 공동 경계, FCM 분리 보관으로 보내는 분기도"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <div className={`mx-auto max-w-xs rounded-lg border px-3 py-2 text-center text-xs leading-5 ${scene.focus === -1 ? "border-blue-600" : "border-border"}`}>
              <span className="font-bold">계약</span>
              <span className="text-muted-foreground"> · 무엇에 기초하고 어디서 거래하나?</span>
            </div>
            <p className="hidden text-center text-xs text-muted-foreground sm:block" aria-hidden>▼</p>
            <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
              {BRANCHES.map((branch, index) => {
                const on = scene.focus === -1 || scene.focus === index;
                const current = scene.focus === index;
                return (
                  <li key={branch.key} className={`flex min-w-0 flex-col gap-1 rounded-lg border px-2 py-2 text-xs leading-5 ${current ? "border-blue-600 bg-background" : on ? "border-border bg-background" : "border-dashed border-border/60 opacity-40"}`}>
                    <span className="block text-muted-foreground">{branch.gate}</span>
                    <span className={`block font-bold ${current ? "text-blue-700 dark:text-blue-300" : ""}`}>{branch.regulator}</span>
                    <span className={`text-[11px] text-muted-foreground ${current ? "block" : "hidden sm:block"}`}>{branch.example}</span>
                    <span className={`mt-auto border-t border-border/60 pt-1 text-[11px] ${current ? "block" : "hidden text-transparent sm:block"}`} aria-hidden={!current}>{branch.check}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      }}
    />
  );
}
