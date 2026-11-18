import SceneShell from "./SceneShell";

/**
 * 본문 대응: #state-lifecycle — 상태 유출 전후로 과거 보호와 미래 회복이 갈린다.
 * 요청 1~6, 3번 출력 뒤 유출, 5번 앞에 재료 추가는 설명용 배치(가정).
 * 과거: 거꾸로 찾기 어렵게 + 이전 값 삭제일 때 보호를 "기대"할 수 있음.
 * 미래: 모르는 새 재료로 안전하게 reseed해야 다시 보호. 알려진 값 추가·갱신 반복으로는 회복 안 됨.
 */
type Mark = "normal" | "past" | "followed" | "recovered";

const REQUESTS = [1, 2, 3, 4, 5, 6] as const;

const SCENES = [
  { label: "정상 운행", summary: "요청마다 상태 갱신", leak: false, mix: null, marks: ["normal", "normal", "normal", "normal", "normal", "normal"], note: "요청마다 출력을 만든 뒤 상태를 갱신합니다. 공격자는 상태를 모르고 출력만 봅니다." },
  { label: "3번 뒤 상태 유출", summary: "4번부터 그대로 따라감", leak: true, mix: null, marks: ["past", "past", "past", "followed", "followed", "followed"], note: "현재 K·V를 읽은 공격자는 이후의 결정적 계산을 그대로 따라갑니다. 1~3번은 옛 상태를 거꾸로 찾기 어렵고 이전 값을 지웠다면 보호를 기대할 수 있습니다(backtracking resistance)." },
  { label: "알려진 값만 섞으면", summary: "출력은 바뀌어도 계속 따라감", leak: true, mix: "known", marks: ["past", "past", "past", "followed", "followed", "followed"], note: "시각·프로세스 번호·컨테이너 이름 같은 알려진 값을 넣으면 출력은 달라질 수 있지만, 상태를 아는 공격자에게 비밀이 생긴 것은 아닙니다. 갱신 연산만 반복해도 자동 회복되지 않습니다." },
  { label: "모르는 재료로 reseed", summary: "5번부터 다시 보호할 수 있음", leak: true, mix: "secret", marks: ["past", "past", "past", "followed", "recovered", "recovered"], note: "공격자가 모르는 새 재료를 받아 안전하게 reseed해야 그 뒤의 출력을 다시 보호할 수 있습니다. 4번처럼 reseed 전에 나온 출력은 이미 따라간 뒤입니다." },
] as const;

const STYLE: Record<Mark, { text: string; color: string; dashed: boolean }> = {
  normal: { text: "출력만 봄", color: "#64748b", dashed: false },
  past: { text: "보호 기대", color: "#16a34a", dashed: true },
  followed: { text: "따라 계산", color: "#dc2626", dashed: false },
  recovered: { text: "다시 보호 가능", color: "#2563eb", dashed: false },
};

export default function StateCompromiseViz() {
  return (
    <SceneShell
      eyebrow="과거 보호와 미래 회복"
      title="상태를 읽힌 시점의 앞과 뒤는 다른 질문입니다"
      description="칸 하나가 출력 요청 한 번입니다. 유출 시점과 재료를 섞는 시점은 설명을 위한 배치입니다(가정)."
      ariaLabel="상태 유출 전후 출력의 보호 여부와 reseed의 효과"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-6 gap-1 sm:gap-2">
              {REQUESTS.map((n, i) => {
                const s = STYLE[scene.marks[i] as Mark];
                return (
                  <div key={n} className="rounded-md border px-0.5 py-1.5 text-center sm:py-2" style={{ borderColor: s.color, borderStyle: s.dashed ? "dashed" : "solid", backgroundColor: scene.marks[i] === "followed" ? "#dc262614" : scene.marks[i] === "recovered" ? "#2563eb14" : "transparent" }}>
                    <span className="block text-[10px] text-muted-foreground sm:text-xs">요청</span><span className="block font-mono text-base font-bold leading-5">{n}</span>
                    <span className="block text-[10px] leading-3 sm:text-[11px] sm:leading-4" style={{ color: s.color }}>{s.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <p className="rounded-md border px-2 py-2 sm:px-3" style={{ borderColor: scene.leak ? "#dc2626" : "#cbd5e1", borderStyle: scene.leak ? "solid" : "dashed" }}>
                <span className="font-bold" style={{ color: scene.leak ? "#dc2626" : "#94a3b8" }}>3번 뒤 상태 유출</span>
                <span className="block text-muted-foreground">{scene.leak ? "현재 K·V가 공격자에게 복사됨" : "아직 없음"}</span>
              </p>
              <p className="rounded-md border px-2 py-2 sm:px-3" style={{ borderColor: scene.mix === "secret" ? "#2563eb" : scene.mix === "known" ? "#d97706" : "#cbd5e1", borderStyle: scene.mix ? "solid" : "dashed" }}>
                <span className="font-bold" style={{ color: scene.mix === "secret" ? "#2563eb" : scene.mix === "known" ? "#d97706" : "#94a3b8" }}>5번 앞에 넣는 재료</span>
                <span className="block text-muted-foreground">{scene.mix === "secret" ? "공격자가 모르는 새 재료로 reseed" : scene.mix === "known" ? "시각·프로세스 번호 같은 알려진 값" : "없음"}</span>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
