import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tensor-backward — p=(2/3,1/3), y=(0,1).
 * pᵢ(δᵢⱼ−pⱼ) = [[2/9,−2/9],[−2/9,2/9]], −yᵢ/pᵢ = (0,−3).
 * 곱: [[0,0],[2/3,−2/3]]. 열 합 = (2/3,−2/3) = p−y.
 */
const CELLS: readonly (readonly (readonly string[])[])[] = [
  [["2/9", "−2/9"], ["−2/9", "2/9"]],
  [["2/9", "−2/9"], ["−2/9", "2/9"]],
  [["0", "0"], ["2/3", "−2/3"]],
  [["0", "0"], ["2/3", "−2/3"]],
];

const SCENES = [
  { label: "확률이 점수에 반응하는 표", summary: "pᵢ(δᵢⱼ − pⱼ)", note: "행 i는 선택지의 확률, 열 j는 올리는 점수입니다. δᵢⱼ는 두 번호가 같으면 1, 다르면 0입니다. 정답 확률 p₂의 행을 보면 z₁에 −p₁p₂ = −2/9, z₂에 p₂(1−p₂) = 2/9입니다." },
  { label: "손실이 확률에 반응하는 값", summary: "−yᵢ/pᵢ = (0, −3)", note: "행마다 곱할 값입니다. 정답이 아닌 첫 행은 y₁=0이라 0이고, 정답인 둘째 행은 −1/(1/3) = −3입니다." },
  { label: "행마다 곱함", summary: "첫 행은 사라짐", note: "둘째 행만 남습니다. (−3)×(−2/9) = 2/3, (−3)×(2/9) = −2/3입니다. 본문의 p₁과 p₂−1이 이 두 칸입니다." },
  { label: "열마다 더함", summary: "(2/3, −2/3) = p − y", note: "p−y로 쓰면 (2/3−0, 1/3−1)과 같습니다. 이 단순화는 target의 합이 1이고 class 가중치를 따로 주지 않을 때의 결과입니다. softmax만의 표가 항등행렬이라는 뜻이 아닙니다." },
];

export default function SoftmaxJacobianViz() {
  return (
    <SceneShell
      eyebrow="chain rule을 칸으로"
      title="두 표를 곱하고 열마다 더하면 p − y가 남습니다"
      description="이번 사례의 p=(2/3, 1/3), target y=(0, 1)을 그대로 넣었습니다(가정). 왼쪽 값이 행마다 곱해지고, 맨 아래 줄이 열의 합입니다."
      ariaLabel="softmax 미분표와 손실 변화율을 곱해 p 빼기 y가 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const cells = CELLS[active];
        return (
          <div className="mx-auto grid max-w-md grid-cols-[4.25rem_3rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-1.5 text-xs">
            <span />
            <span className="text-center text-muted-foreground">곱할 값</span>
            <span className="text-center text-muted-foreground">z₁ 올림</span>
            <span className="text-center text-muted-foreground">z₂ 올림</span>
            {cells.map((row, rowIndex) => (
              <div key={rowIndex} className="contents">
                <span className="font-bold">p{rowIndex === 0 ? "₁ (오답)" : "₂ (정답)"}</span>
                <span className="text-center font-mono font-bold" style={{ color: active >= 1 ? "#dc2626" : "#94a3b8" }}>{active >= 1 ? (rowIndex === 0 ? "0" : "−3") : "·"}</span>
                {row.map((value, colIndex) => (
                  <span key={colIndex} className={`flex h-10 items-center justify-center rounded-sm border font-mono text-sm ${active >= 2 && rowIndex === 0 ? "text-muted-foreground/60" : "font-bold"}`} style={{ borderColor: active === 2 && rowIndex === 1 ? "#dc2626" : "#94a3b8" }}>
                    {value}
                  </span>
                ))}
              </div>
            ))}
            <span className="font-bold">열 합</span>
            <span />
            {["2/3", "−2/3"].map((value) => (
              <span key={value} className={`flex h-10 items-center justify-center rounded-sm border font-mono text-sm ${active === 3 ? "font-bold" : "border-dashed text-muted-foreground/60"}`} style={{ borderColor: active === 3 ? "#dc2626" : "#94a3b8", backgroundColor: active === 3 ? "#dc262618" : "transparent" }}>
                {active === 3 ? value : "?"}
              </span>
            ))}
          </div>
        );
      }}
    />
  );
}
