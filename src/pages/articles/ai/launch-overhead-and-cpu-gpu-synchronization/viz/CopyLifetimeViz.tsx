import SceneShell from "./SceneShell";

/**
 * 본문 대응: #copy-overlap — CPU→GPU pinned 원본은 복사 완료 전에 덮어쓰면 GPU가 잘못된 값을 받을 수 있고,
 * GPU→CPU 비동기 결과는 완료 확인 전에 CPU 계산에 쓰면 안 된다. 구간 길이는 본문이 정하지 않아 같은 폭으로 그린다.
 */
const SCENES = [
  { label: "CPU → GPU · 원본 쓰기", summary: "복사 완료 전에 덮어쓰지 않음", dir: "→", from: "pinned 원본 (CPU)", to: "입력 (GPU)", danger: "덮어쓰면 GPU가 잘못된 값을 받을 수 있음", safe: "복사 완료 뒤", note: "CPU가 호출에서 돌아온 시각은 복사 예약이 끝난 시각일 수 있습니다. 가운데 구간에서 원본을 덮어쓰면 GPU가 잘못된 값을 받을 수 있습니다." },
  { label: "GPU → CPU · 결과 읽기", summary: "완료 확인 전에 쓰지 않음", dir: "←", from: "결과 받을 곳 (CPU)", to: "결과 (GPU)", danger: "CPU 계산에 쓰면 안 됨", safe: "완료를 확인한 뒤", note: "반대 방향도 같습니다. 비동기로 복사한 결과는 완료를 확인하기 전에 CPU 계산에 사용하면 안 됩니다. 호출 반환이 버퍼를 안전하게 읽고 쓰는 시각을 대신하지 않습니다." },
] as const;

export default function CopyLifetimeViz() {
  return (
    <SceneShell
      eyebrow="버퍼의 수명"
      title="호출이 돌아온 뒤에도 복사는 진행 중일 수 있습니다"
      description="아래 띠는 사건의 순서만 보입니다. 구간 길이는 본문이 정하지 않았으므로 같은 폭으로 그렸습니다."
      ariaLabel="비동기 복사의 호출 반환과 복사 완료 사이의 위험 구간"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] items-center gap-1 text-center">
              <div className="rounded-lg border border-border bg-background p-3 text-sm font-bold">{scene.from}</div>
              <span aria-hidden="true" className="font-mono text-xl text-[#2563eb]">{scene.dir}</span>
              <div className="rounded-lg border border-border bg-background p-3 text-sm font-bold">{scene.to}</div>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center text-xs leading-5">
              <div className="rounded-sm bg-[#e2e8f0] px-1 py-2 text-[#0f172a]">
                <span className="block font-bold">호출 중</span>
                복사 예약
              </div>
              <div className="rounded-sm border border-dashed border-[#dc2626] px-1 py-2 text-[#dc2626]">
                <span className="block font-bold">복사 진행</span>
                {scene.danger}
              </div>
              <div className="rounded-sm bg-[#dcfce7] px-1 py-2 text-[#14532d]">
                <span className="block font-bold">{scene.safe}</span>
                {index === 0 ? "원본을 써도 됨" : "값을 써도 됨"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 text-xs font-bold">
              <span className="col-start-1 text-right">CPU로 호출 반환 ↑</span>
              <span className="col-start-2 text-right">복사 완료 ↑</span>
            </div>
          </div>
        );
      }}
    />
  );
}
