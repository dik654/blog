import SceneShell from "./SceneShell";

/**
 * 본문 대응: BatchAndNegatives.tsx ProgressiveDetail "조각 단위 계산이 정확히 무엇을 바꾸나요".
 * 장치 3개(가정)가 각자 이미지 b개와 문장 b개를 갖는다. 칸마다 독립인 손실은 자기 조각(b×b)을 계산해
 * 더한 뒤 문장 표현을 다음 장치로 넘기기를 반복하면 3번 만에 9개 조각을 모두 덮는다.
 * 넘기는 방향: A→B→C→A. 장치 k가 i번째 차례에 갖는 문장 = 장치 (k − i) mod 3의 문장.
 */
const DEVICES = ["A", "B", "C"] as const;
const DEVICE_LIST: readonly string[] = DEVICES;

const SCENES = [
  { label: "1차 · 자기 조각", summary: "조각 3개 / 9개", round: 0, note: "장치마다 자기 이미지와 자기 문장으로 b×b 조각 하나를 계산해 부분 합을 냅니다." },
  { label: "2차 · 문장을 다음 장치로", summary: "조각 6개 / 9개", round: 1, note: "문장 표현을 다음 장치로 넘깁니다. B는 A의 문장으로 (B 이미지 × A 문장) 조각을 계산해 더합니다." },
  { label: "3차 · 한 번 더", summary: "조각 9개 / 9개", round: 2, note: "한 번 더 넘기면 모든 이미지가 모든 문장을 만났습니다. N×N 행렬 전체는 어느 장치에도 한꺼번에 없었습니다." },
  { label: "부분 합의 합 = 전체 손실", summary: "A + B + C 부분 합", round: 3, note: "칸마다 독립이면 전체 손실이 부분 합의 합입니다. 손실 값은 같고 메모리 상한만 달라집니다." },
  { label: "정규화가 있으면", summary: "행 A가 세 조각을 다 기다림", round: 4, note: "정규화가 있으면 이미지 A의 행 확률에 세 조각의 값이 모두 필요해 부분 합만으로는 만들 수 없습니다. 우회법은 통신이 추가됩니다." },
] as const;

const DONE = "#6366f1";
const NOW = "#10b981";
const WAIT = "#ef4444";

/** 장치 k(행)가 r번째 차례에 계산하는 문장 장치(열) index */
const colAt = (k: number, r: number) => (k - r + 3) % 3;

export default function ChunkRingViz() {
  return (
    <SceneShell
      eyebrow="조각 단위 계산"
      title="문장 표현을 돌려 가며 자기 조각만 계산해 더합니다"
      description="장치 하나가 이미지·캡션 쌍 b개를 가지며, 큰 칸 하나가 b×b 유사도 조각입니다. 행은 각 장치의 이미지, 열은 각 장치의 문장입니다. 장치 3개는 설명용 가정이며, 표현을 A→B→C→A 방향으로 넘깁니다."
      note="실제 구현의 통신 순서와 겹침은 이 개념도와 다를 수 있습니다."
      ariaLabel="세 장치가 문장 표현을 돌려 가며 유사도 행렬 조각을 계산하는 과정"
      scenes={SCENES}
      render={(active) => {
        const round = SCENES[active].round;
        const normalized = round === 4;
        const status = (row: number, col: number) => {
          if (normalized) return row === 0 ? "wait" : "idle";
          const r = (row - col + 3) % 3;
          if (round >= 3 || r < round) return "done";
          if (r === round) return "now";
          return "idle";
        };
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[3.5rem_repeat(3,minmax(0,1fr))] gap-1.5 text-xs sm:text-sm">
              <span />
              {DEVICES.map((d) => (
                <span key={d} className="text-center text-muted-foreground">
                  문장 {d}
                </span>
              ))}
              {DEVICES.map((rowDev, row) => (
                <div key={rowDev} className="contents">
                  <span className="self-center text-muted-foreground">이미지 {rowDev}</span>
                  {DEVICES.map((colDev, col) => {
                    const s = status(row, col);
                    const color = s === "now" ? NOW : s === "done" ? DONE : s === "wait" ? WAIT : "#94a3b8";
                    return (
                      <div
                        key={colDev}
                        className="flex h-11 items-center justify-center rounded-md border text-center font-mono text-[11px] leading-4"
                        style={{
                          borderColor: color,
                          borderStyle: s === "idle" ? "dashed" : "solid",
                          backgroundColor: s === "idle" ? "transparent" : `${color}1f`,
                          color: s === "idle" ? "#94a3b8" : color,
                        }}
                      >
                        {s === "now" ? "계산 중" : s === "done" ? "더함" : s === "wait" ? "필요" : normalized ? "—" : "아직"}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] leading-5 sm:text-xs">
              {DEVICES.map((d, k) => (
                <div key={d} className="min-w-0 rounded-md border border-border px-2 py-1.5">
                  <span className="block font-bold">장치 {d}</span>
                  <span className="block text-muted-foreground">
                    {normalized
                      ? k === 0
                        ? "행 합 전체 필요"
                        : "—"
                      : round >= 3
                        ? `부분 합 ${d}`
                        : `문장 ${DEVICE_LIST[colAt(k, round)]} 보유`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
