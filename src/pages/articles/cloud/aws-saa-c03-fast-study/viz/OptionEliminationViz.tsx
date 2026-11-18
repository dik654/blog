import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 명시·숨은 요구를 하나라도 어기면 먼저 탈락, 남은 보기는 관리 범위·전체 비용으로 비교,
 * 마지막에 단일 장애점·데이터 복구·최소 권한 재확인.
 * 보기 셋은 글에 나온 구조다: A = 3절 한 대의 큰 서버, B = 1절 두 지역 분산 + 여러 데이터 계층, C = 4절 구조.
 * C의 재확인 결과는 글이 정하지 않으므로 표시하지 않는다.
 */
type Status = "idle" | "out" | "pass" | "lose" | "pick" | "check";

const OPTIONS = [
  { key: "A", name: "큰 서버 1대 + 로컬 DB", from: "3절" },
  { key: "B", name: "두 지역 분산 + 여러 데이터 계층", from: "1절" },
  { key: "C", name: "두 장애 단위의 앱 + 관리형 다중 장소 DB + 큐", from: "4절" },
] as const;

const SCENES = [
  {
    label: "보기 세 개를 나란히 놓습니다",
    summary: "아직 탈락 없음",
    note: "글에 나온 세 구조를 한 문제의 보기로 놓았습니다(가정). 먼저 문장에서 ‘건물 장애만 견딘다’, ‘운영 인원 두 명’, ‘행사 뒤 축소’, ‘최소 운영·비용’을 표시합니다.",
    status: ["idle", "idle", "idle"] as Status[],
    reason: ["", "", ""],
  },
  {
    label: "1단계: 필수 조건을 어기면 탈락",
    summary: "A 탈락 · B·C 남음",
    note: "A는 서버나 장소 하나의 장애가 전체 중단이 되고, 행사 뒤에도 큰 용량 비용이 남습니다. B와 C는 건물 장애를 견디므로 남습니다. 남았다는 것은 아직 선택됐다는 뜻이 아닙니다.",
    status: ["out", "pass", "pass"] as Status[],
    reason: ["장소 장애 = 전체 중단 · 행사 뒤 큰 용량 비용", "건물 장애 견딤", "건물 장애 견딤"],
  },
  {
    label: "2단계: 남은 보기의 운영 부담과 비용 비교",
    summary: "C 선택 · B 비교에서 밀림",
    note: "문제는 운영 인력과 비용을 최소화하라고 했습니다. B는 장애에 강해 보이지만 서비스가 더 많아 이 수식어에서 밀립니다. 1절의 오답이 바로 이 단계에서 생겼습니다.",
    status: ["out", "lose", "pick"] as Status[],
    reason: ["1단계에서 탈락", "더 많은 서비스 → 운영·비용 부담", "관리형 부품을 장애 단위에 나눔"],
  },
  {
    label: "3단계: 고른 뒤 숨은 실패를 다시 봅니다",
    summary: "단일 장애점 · 데이터 복구 · 최소 권한",
    note: "선택한 C에서도 단일 장애점, 데이터 복구 경로, 최소 권한을 마지막으로 확인합니다. 이 세 항목의 결과는 글이 정하지 않았으므로 빈칸으로 둡니다.",
    status: ["out", "lose", "check"] as Status[],
    reason: ["1단계에서 탈락", "2단계에서 밀림", "□ 단일 장애점  □ 데이터 복구  □ 최소 권한"],
  },
] as const;

const STYLE: Record<Status, { box: string; pill: string; word: string }> = {
  idle: { box: "border-border", pill: "border-border text-muted-foreground", word: "검토 전" },
  out: { box: "border-dashed border-[#dc2626]/70 opacity-70", pill: "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]", word: "탈락" },
  pass: { box: "border-[#64748b]", pill: "border-[#64748b] text-foreground", word: "조건 통과" },
  lose: { box: "border-[#64748b] opacity-70", pill: "border-[#d97706] text-[#b45309] dark:text-[#fbbf24]", word: "비교에서 밀림" },
  pick: { box: "border-[#2563eb] bg-[#2563eb]/5", pill: "border-[#2563eb] bg-[#2563eb] text-white", word: "선택" },
  check: { box: "border-[#2563eb] bg-[#2563eb]/5", pill: "border-[#2563eb] text-[#2563eb] dark:text-[#93c5fd]", word: "선택 · 재확인 중" },
};

export default function OptionEliminationViz() {
  return (
    <SceneShell
      eyebrow="제약표와 탈락표"
      title="필수 조건으로 지우고, 남은 것끼리 비용으로 고릅니다"
      description="빨간 점선은 필수 조건 위반으로 먼저 지운 보기, 회색은 조건은 통과했지만 아직 고르지 않은 보기, 파란색은 비교 끝에 고른 보기입니다. 세 보기의 출처는 각 카드에 적었습니다."
      ariaLabel="세 설계 보기를 필수 조건, 운영 부담과 비용 비교, 재확인 순서로 좁히는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <ol className="grid min-w-0 gap-2 sm:grid-cols-3 sm:gap-3" aria-label={scene.label}>
            {OPTIONS.map((option, index) => {
              const status = scene.status[index];
              const style = STYLE[status];
              return (
                <li key={option.key} className={`min-w-0 rounded-lg border px-3 py-2 ${style.box}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold">보기 {option.key}</span>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${style.pill}`}>{style.word}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6">
                    <span className={status === "out" ? "line-through decoration-[#dc2626]" : ""}>{option.name}</span>
                    <span className="ml-1 text-xs text-muted-foreground">({option.from})</span>
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground sm:min-h-[2.5rem]">{(scene.reason as readonly string[])[index]}</p>
                </li>
              );
            })}
          </ol>
        );
      }}
    />
  );
}
