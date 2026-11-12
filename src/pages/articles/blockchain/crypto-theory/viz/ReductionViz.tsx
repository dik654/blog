import SceneShell from "./SceneShell";

/**
 * 본문 대응: #assumption-composition 첫 문단 — 환원 증명은 암호 공격자를 부품으로 써서 어렵다고 가정한
 * 문제를 푸는 프로그램을 만듭니다. 성공확률이 100분의 1로 줄어드는 환원(가정)이면 격차 0.01의 기여는
 * 0.01 × 1/100 = 0.0001입니다. 늘어나는 계산 시간은 본문이 수치를 주지 않으므로 크기를 그리지 않습니다.
 */
const ADV = 0.01;
const LOSS = 100;
const PASSED = (ADV / LOSS).toFixed(4);

const SCENES = [
  {
    label: "부품: 암호 공격자",
    summary: "격차 0.01 (9절 가정)",
    note: "9절에서 가정한 공격자는 30원·90원 게임에서 기준보다 0.01 더 잘 맞힙니다. 환원은 이 공격자의 내부를 몰라도 되고, 입력을 주고 답을 받는 부품으로만 씁니다.",
  },
  {
    label: "공격자를 감싼 풀이 프로그램",
    summary: "어려운 문제 → 게임으로 변환 → 답 되돌림",
    note: "환원은 어렵다고 가정한 수학 문제를 받아 공격자가 치를 게임으로 바꿔 넘기고, 공격자의 답을 원래 문제의 답으로 되돌립니다. 공격자가 있으면 그 문제도 풀린다는 연결입니다.",
  },
  {
    label: "확률이 줄어드는 몫",
    summary: "0.01 × 1/100 = 0.0001",
    note: "성공확률이 100분의 1로 줄어드는 환원이라면(가정), 공격자의 격차 0.01 가운데 문제 풀이 성공으로 이어지는 기여는 0.0001 수준입니다. 위 100칸 중 한 칸이 그 몫입니다.",
  },
  {
    label: "시간도 늘어남",
    summary: "손실과 추가 시간을 함께 셈",
    note: "공격자를 부르는 앞뒤로 변환 계산이 붙어 풀이 시간도 늘어납니다. 이 확률 손실과 늘어난 시간을 빼고 보안 강도를 말할 수는 없습니다.",
  },
] as const;

const CELLS = Array.from({ length: LOSS }, (_, i) => i);

export default function ReductionViz() {
  return (
    <SceneShell
      eyebrow="환원 증명"
      title="공격자를 부품으로 감싸면 격차가 작아진 채 전해집니다"
      description="안쪽 상자가 암호를 깨는 공격자, 바깥 상자가 그 공격자로 어려운 문제를 푸는 프로그램입니다. 격차 0.01과 100분의 1 손실은 본문의 가정이며, 늘어나는 시간은 수치 없이 표시합니다."
      ariaLabel="환원 증명에서 공격자를 감싼 문제 풀이 프로그램과 확률 손실"
      scenes={SCENES}
      render={(active) => {
        const wrap = active >= 1;
        return (
          <div className="min-w-0 space-y-3">
            <div className={`rounded-lg border px-3 py-3 text-xs ${wrap ? "border-indigo-600" : "border-dashed border-border/50"}`}>
              <p className={`font-bold ${wrap ? "text-indigo-700 dark:text-indigo-300" : "text-muted-foreground/50"}`}>문제 풀이 프로그램 (환원)</p>
              <div className="mt-2 grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
                <div className={`rounded-md border px-2 py-1.5 text-center ${wrap ? "border-border" : "border-dashed border-border/40 text-muted-foreground/50"}`}>
                  어려운 문제 입력 → 게임으로 변환{active >= 3 && <span className="block font-semibold text-amber-700 dark:text-amber-400">+ 변환 시간</span>}
                </div>
                <div className="rounded-md border border-amber-600 px-2 py-2 text-center">
                  <span className="block font-bold">암호 공격자</span>
                  <span className="block font-mono">격차 {ADV}</span>
                </div>
                <div className={`rounded-md border px-2 py-1.5 text-center ${wrap ? "border-border" : "border-dashed border-border/40 text-muted-foreground/50"}`}>
                  공격자의 답 → 문제의 답으로{active >= 3 && <span className="block font-semibold text-amber-700 dark:text-amber-400">+ 되돌림 시간</span>}
                </div>
              </div>
            </div>
            <div className={active >= 2 ? "" : "invisible"} aria-hidden={active < 2}>
              <p className="text-xs text-muted-foreground">격차 0.01을 100칸으로 나눔 → 문제 풀이까지 전해지는 몫 1칸 = {PASSED}</p>
              <svg viewBox="0 0 400 46" className="mt-1 h-auto w-full max-w-[480px]" role="img" aria-label="100칸 중 1칸만 전해짐">
                {CELLS.map((i) => (
                  <rect key={i} x={(i % 50) * 8} y={Math.floor(i / 50) * 23} width={7} height={21} rx={1} fill={i === 0 ? "#d97706" : "#e2e8f0"} stroke={i === 0 ? "#d97706" : "#94a3b8"} strokeWidth={0.75} />
                ))}
              </svg>
            </div>
          </div>
        );
      }}
    />
  );
}
