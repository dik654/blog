import SceneShell from "./SceneShell";

/**
 * 본문 대응: #interactions — A: 관계 계산 40→20, B: 값 변환 35→21(설명용 가정).
 * 15+20+35+10 = 80, 15+20+21+10 = 66, +표현 변경 8 = 74. B의 비율 35/100 → 35/80 = 43.75%.
 */
const NAMES = ["확인", "관계", "변환", "전송", "표현 변경"] as const;
const BASE = [15, 40, 35, 10, 0];

const SCENES = [
  { label: "A만 적용", summary: "15 + 20 + 35 + 10 = 80 ms", values: [15, 20, 35, 10, 0], hot: [1], note: "관계 계산이 40→20 ms로 줄어 80 ms입니다. 아직 값 변환은 그대로입니다." },
  { label: "B도 적용", summary: "15 + 20 + 21 + 10 = 66 ms", values: [15, 20, 21, 10, 0], hot: [1, 2], note: "값 변환 35→21 ms를 더합니다. 두 변경이 서로 영향을 주지 않을 때에만 66 ms입니다." },
  { label: "함께 쓰는 비용", summary: "66 + 8 = 74 ms", values: [15, 20, 21, 10, 8], hot: [4], note: "둘을 함께 쓰려고 데이터 표현을 바꾸는 작업 8 ms가 새로 필요하다면 74 ms입니다. 따로 잰 숫자를 더한 66 ms는 이 비용을 빠뜨립니다." },
  { label: "B의 출발점", summary: "35/100 → 35/80 = 43.75%", values: [15, 20, 35, 10, 0], hot: [2], note: "A를 적용한 뒤 B의 대상 비율은 35/100이 아니라 35/80입니다. 같은 35 ms라도 두 번째 변경의 출발점은 새 시간표입니다." },
] as const;

function Row({ title, values, hot }: { title: string; values: readonly number[]; hot: readonly number[] }) {
  return (
    <div>
      <p className="text-xs font-bold">{title}</p>
      <div className="mt-1.5 flex h-9 w-full gap-px rounded-sm bg-muted/40" role="img" aria-label={`${title}: ${values.filter(Boolean).join(", ")} 밀리초`}>
        {values.map((value, index) =>
          value ? (
            <div key={NAMES[index]} className={`flex items-center justify-center overflow-hidden font-mono text-xs font-bold ${hot.includes(index) ? "bg-[#2563eb] text-white" : "bg-[#cbd5e1] text-[#0f172a]"}`} style={{ width: `${value}%` }}>
              {value}
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

export default function CombinedChangeViz() {
  return (
    <SceneShell
      eyebrow="두 변경의 합"
      title="두 개선을 합칠 때는 새 비용과 새 비율까지 다시 셉니다"
      description="칸 순서는 확인·관계 계산·값 변환·전송(ms)이고 파란 칸이 이번 장면에서 짚는 칸입니다. 모두 설명용 가정입니다."
      note="표현 변경 8 ms가 어느 순서에 끼는지는 글이 정하지 않았습니다. 합계만 비교하려고 끝에 붙였습니다."
      ariaLabel="기준 100밀리초와 변경 A, B, 추가 비용의 시간표"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <Row title="기준 100 ms" values={BASE} hot={active === 3 ? [2] : []} />
            <Row title={active === 3 ? "A 적용 뒤의 새 시간표 80 ms" : `변경 뒤 ${scene.values.reduce<number>((sum, value) => sum + value, 0)} ms`} values={scene.values} hot={scene.hot} />
            <div className="relative h-5 font-mono text-xs text-muted-foreground">
              <span className="absolute left-0">0</span>
              <span className="absolute right-0">100 ms</span>
            </div>
          </div>
        );
      }}
    />
  );
}
