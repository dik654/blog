import SceneShell from "./SceneShell";

/**
 * 본문 대응: #paired-source — differences = model_1_scores − model_2_scores는 같은 인덱스가 같은 fold일 때만 짝 비교다.
 * 두 번째 장면은 10절 질문처럼 새 배열의 fold 순서가 뒤집혔다고 가정한 경우다.
 * 뒤집힌 채 빼면 −0.007·−0.005·−0.001·+0.014·+0.016, fold ID로 맞추면 0.006·0.004·−0.001·0.005·0.003.
 */
const BASE: readonly number[] = [700, 720, 680, 710, 690];
const NEW: readonly number[] = [706, 724, 679, 715, 693];
const REVERSED_IDS: readonly number[] = [4, 3, 2, 1, 0];

const fmt = (thousandths: number) => (thousandths / 1000).toFixed(3);
const signed = (thousandths: number) => `${thousandths > 0 ? "+" : thousandths < 0 ? "−" : ""}${fmt(Math.abs(thousandths))}`;

const SCENES = [
  {
    label: "같은 인덱스 = 같은 fold",
    summary: "첫 차이 0.706 − 0.700 = +0.006",
    order: [0, 1, 2, 3, 4],
    note: "두 배열의 i번째 칸이 같은 fold ID를 가리키므로 칸끼리 빼면 같은 묶음의 짝 비교가 됩니다. 세 번째 차이는 0.679 − 0.680 = −0.001입니다.",
  },
  {
    label: "새 배열 순서가 뒤집혔다면",
    summary: "첫 칸 0.693 − 0.700 = −0.007",
    order: REVERSED_IDS,
    note: "새 배열이 fold 5부터 들어 있다고 가정합니다. 칸끼리 빼면 첫 칸은 fold 5의 새 점수에서 fold 1의 기존 점수를 뺀 값이 됩니다. 합은 그대로 0.017이라 평균으로는 드러나지 않지만 묶음별 차이는 틀립니다.",
  },
  {
    label: "fold ID로 먼저 맞춤",
    summary: "join by fold_id → 원래 다섯 차이",
    order: [0, 1, 2, 3, 4],
    note: "뒤집힌 새 배열을 fold ID로 다시 찾아 붙입니다(새 값 옆 ←행 번호가 뒤집힌 배열에서 원래 있던 칸). 뺄셈 전에 fold ID로 두 실행을 맞추면 행 순서와 상관없이 원래 차이 0.006·0.004·−0.001·0.005·0.003이 돌아옵니다. 의사코드의 첫 줄이 이 단계입니다.",
  },
] as const;

export default function FoldAlignViz() {
  return (
    <SceneShell
      eyebrow="뺄셈 전 정렬"
      title="같은 인덱스가 같은 fold를 가리켜야 차이가 맞습니다"
      description="한 줄이 배열의 한 칸입니다. 회색 꼬리표는 그 칸 점수가 실제로 나온 fold ID입니다. 점수는 3절의 가정 사례입니다."
      ariaLabel="fold 순서가 맞을 때, 뒤집혔을 때, fold ID로 맞췄을 때의 차이 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const order = scene.order as readonly number[];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-2 border-b border-border pb-1 text-xs font-semibold text-muted-foreground">
              <span>칸</span>
              <span>기존</span>
              <span>새</span>
              <span className="text-right">새 − 기존</span>
            </div>
            <ul>
              {BASE.map((base, index) => {
                const newId = order[index];
                const matched = newId === index;
                const delta = NEW[newId] - base;
                return (
                  <li key={index} className="grid grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-2 border-b border-border/50 py-1.5 font-mono text-xs sm:text-sm">
                    <span className="text-muted-foreground">{index}</span>
                    <span>
                      {fmt(base)} <span className="rounded border border-border px-1 text-[10px] text-muted-foreground">f{index + 1}</span>
                    </span>
                    <span className={matched ? "" : "text-red-700 dark:text-red-400"}>
                      {fmt(NEW[newId])} <span className={`rounded border px-1 text-[10px] ${matched ? "border-border text-muted-foreground" : "border-red-600"}`}>f{newId + 1}</span>
                      {active === 2 && <span className="ml-1 font-sans text-[10px] text-muted-foreground">←행 {REVERSED_IDS.indexOf(index)}</span>}
                    </span>
                    <span className={`text-right font-bold ${matched ? (delta < 0 ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400") : "text-red-700 line-through decoration-1 dark:text-red-400"}`}>
                      {signed(delta)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-right font-mono text-xs text-muted-foreground">합계 +0.017 · 평균 +0.0034</p>
          </div>
        );
      }}
    />
  );
}
