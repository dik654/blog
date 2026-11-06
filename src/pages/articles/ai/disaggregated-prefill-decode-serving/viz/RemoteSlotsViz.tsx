import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-allocation — D의 네 자리가 빈칸 → 배정 → 읽는 중 → 준비 → 마지막 재계산으로 바뀐다.
 * 원격 4 − 로컬 0 = 4, num_computed_tokens 4 → 3.
 */
type Slot = "empty" | "held" | "reading" | "ready" | "redo";

const STYLE: Record<Slot, { fill: string; stroke: string; text: string; color: string; dash?: string }> = {
  empty: { fill: "none", stroke: "#94a3b8", text: "빈칸", color: "#64748b", dash: "3 3" },
  held: { fill: "none", stroke: "#2563eb", text: "배정", color: "#2563eb" },
  reading: { fill: "none", stroke: "#d97706", text: "읽는 중", color: "#d97706", dash: "3 3" },
  ready: { fill: "#2563eb", stroke: "#2563eb", text: "KV", color: "#ffffff" },
  redo: { fill: "#16a34a", stroke: "#16a34a", text: "재계산", color: "#ffffff" },
};

const SCENES = [
  { label: "받을 위치를 셉니다", summary: "원격 4 − 로컬 0 = 4", slots: ["empty", "empty", "empty", "empty"], counter: null, note: "NixlPullConnectorScheduler는 원격 입력 위치 수에서 이미 로컬에 있는 수를 뺍니다. R은 일반 attention 모델 사례입니다." },
  { label: "공간을 배정합니다", summary: "update_state_after_alloc", slots: ["held", "held", "held", "held"], counter: null, note: "공간 배정 뒤 원격 정보와 로컬 블록을 연결합니다. 값은 아직 한 자리도 오지 않았습니다." },
  { label: "READ를 시작합니다", summary: "_read_blocks → handle", slots: ["reading", "reading", "reading", "reading"], counter: null, note: "함수는 전송을 시작하고 handle을 완료 확인 목록에 남긴 채 돌아옵니다. 돌아왔다는 사실만으로 D의 값이 준비된 것은 아닙니다." },
  { label: "완료를 확인합니다", summary: "(가정) 6 ms", slots: ["ready", "ready", "ready", "ready"], counter: 4, note: "네 위치의 KV가 모두 왔습니다. 그래도 다음 출력의 점수를 얻는 마지막 입력 계산은 남을 수 있습니다." },
  { label: "마지막 자리를 다시 계산합니다", summary: "4 → 3 · (가정) 8 ms", slots: ["ready", "ready", "ready", "redo"], counter: 3, note: "입력 전체가 맞은 경우 num_computed_tokens를 num_tokens−1로 낮춰 마지막 한 위치를 다시 계산합니다. 이 2 ms가 8 ms 경로의 마지막 구간입니다." },
] as const;

const X0 = 66;
const W = 66;
const G = 6;
const sx = (index: number) => X0 + index * (W + G);

export default function RemoteSlotsViz() {
  return (
    <SceneShell
      eyebrow="vLLM v0.27.1 · D의 네 자리"
      title="받을 자리가 값으로 채워지기까지의 상태"
      description="아랫줄이 D의 입력 네 자리입니다. num_computed_tokens는 이미 계산된 것으로 치는 위치 수입니다."
      ariaLabel="D의 입력 네 자리가 배정, 읽기, 준비, 재계산으로 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const pointerX = scene.counter === null ? null : sx(scene.counter) - G / 2;
        return (
          <svg key={scene.label} viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0 - 8} y={32} textAnchor="end" fontSize={12} fill="currentColor">P 원본</text>
            <text x={X0 - 8} y={96} textAnchor="end" fontSize={12} fill="currentColor">D 자리</text>
            {[0, 1, 2, 3].map((index) => {
              const style = STYLE[scene.slots[index] as Slot];
              return (
                <g key={index}>
                  <rect x={sx(index)} y={14} width={W} height={28} rx={3} fill="#64748b" />
                  <text x={sx(index) + W / 2} y={32} textAnchor="middle" fontSize={12} fill="#ffffff">KV</text>
                  <rect x={sx(index)} y={78} width={W} height={28} rx={3} fill={style.fill} stroke={style.stroke} strokeWidth={1} strokeDasharray={style.dash} />
                  <text x={sx(index) + W / 2} y={96} textAnchor="middle" fontSize={12} fontWeight={600} fill={style.color}>{style.text}</text>
                </g>
              );
            })}
            {active === 2 && (
              <>
                <path d="M204 44 V74 m-4 -6 l4 6 l4 -6" fill="none" stroke="#d97706" strokeWidth={1.25} />
                <text x={212} y={63} fontSize={12} fontWeight={700} fill="#d97706">READ</text>
              </>
            )}
            {pointerX !== null && (
              <>
                <path d={`M${pointerX} 108 V126`} fill="none" stroke="currentColor" strokeWidth={1.25} />
                <text x={sx(3) + W} y={141} textAnchor="end" fontSize={11.5} fontWeight={700} fontFamily="monospace" fill="currentColor">num_computed_tokens = {scene.counter}</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
