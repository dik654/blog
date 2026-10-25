import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";
import { BASIS_K4, MAGNITUDE_K4, PRODUCT_K4, SPECTRUM_ROW } from "../trace";

const SCENES = [
  "여덟 밝기 값을 읽음",
  "k=4 기준을 같은 위치에 놓음",
  "밝기와 기준을 위치별로 곱함",
  "곱의 합을 막대 높이로 기록",
] as const;

const NOTES = [
  "설명용 한 행은 +1과 −1이 번갈아 나타납니다. 실제 crop의 한 행을 그대로 측정한 값이 아니라 좌표 변환을 세기 위한 가정입니다.",
  "여덟 칸 안에서 방향이 네 번 바뀌는 k=4 기준은 이 행과 같은 +1, −1 배열입니다.",
  "각 위치의 부호가 같으므로 여덟 곱이 모두 +1입니다. 서로 반대였다면 음수가 되어 합에서 상쇄됩니다.",
  "여덟 값을 더한 |X₄|는 8입니다. 큰 막대는 반복이 강하다는 뜻이지 딥페이크라는 정답표가 아닙니다.",
] as const;

const STAGES = [
  { title: "밝기", detail: "+1·−1 여덟 칸" },
  { title: "기준", detail: "k=4 반복" },
  { title: "곱", detail: "+1 여덟 개" },
  { title: "크기", detail: "|X₄|=8" },
] as const;

function NumberRow({ label, values, visible }: { label: string; values: readonly number[]; visible: boolean }) {
  return (
    <div className={`grid grid-cols-[5rem_repeat(8,minmax(0,1fr))] gap-px bg-border p-px transition-opacity ${visible ? "opacity-100" : "opacity-20"}`}>
      <strong className="flex items-center bg-background px-2 text-[10px] leading-4">{label}</strong>
      {values.map((value, index) => (
        <span key={`${label}-${index}`} className={`flex min-h-10 items-center justify-center bg-background font-mono text-xs font-bold ${value > 0 ? "text-primary" : "text-muted-foreground"}`}>
          {value > 0 ? "+1" : "−1"}
        </span>
      ))}
    </div>
  );
}

export default function SpectrumTraceViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-spectrum-trace"
      eyebrow="주파수 계산"
      title="공간의 여덟 칸을 k=4 막대 하나로 모읍니다"
      description="한 행과 주파수 기준을 같은 위치끼리 곱하고 합하는 과정을 순서대로 따라갑니다."
      note="1차원 여덟 칸으로 단순화한 설명용 계산입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <div className="space-y-3">
          <NumberRow label="밝기 xₙ" values={SPECTRUM_ROW} visible={active >= 0} />
          <NumberRow label="기준 b₄,ₙ" values={BASIS_K4} visible={active >= 1} />
          <NumberRow label="곱" values={PRODUCT_K4} visible={active >= 2} />
          <div className={`grid grid-cols-[5rem_minmax(0,1fr)] gap-px bg-border p-px transition-opacity ${active >= 3 ? "opacity-100" : "opacity-20"}`}>
            <strong className="flex items-center bg-background px-2 text-[10px]">합</strong>
            <div className="bg-background px-3 py-3">
              <div className="h-3 bg-muted">
                <div className="h-3 bg-primary transition-[width]" style={{ width: active >= 3 ? "100%" : "0%" }} />
              </div>
              <p className="mt-2 font-mono text-xs font-bold">|X₄| = {active >= 3 ? MAGNITUDE_K4 : "—"}</p>
            </div>
          </div>
        </div>
      )}
    </DeepfakeStageViz>
  );
}
