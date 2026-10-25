import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";
import { STAGE_COUNTS } from "../trace";

const SCENES = [
  "분모 열 개 고정",
  "얼굴 위치 coverage 계산",
  "인물 추적 coverage 계산",
  "최종 입력 coverage 계산",
] as const;

const NOTES = [
  "분모 T=10은 뒤 단계의 성공 수가 아니라 처음 선언한 평가 시각 수입니다. 같은 원본 시각을 모든 후보 전처리에 재사용합니다.",
  "얼굴 위치를 찾은 시각은 8개이므로 C_detect=8/10=0.80입니다. NO_FACE 두 건도 분모에 남습니다.",
  "Person-C로 일관된 track은 7개이므로 C_track=7/10=0.70입니다. Track switch를 얼굴 찾기 실패와 별도 원인으로 봅니다.",
  "유효 crop은 6개이므로 C_input=6/10=0.60입니다. Detector의 정확도는 이 여섯 입력의 성능이고, 원본 전체 coverage와 함께 보고해야 합니다.",
] as const;

const STAGES = [
  { title: "평가 분모", detail: "T = 10" },
  { title: "얼굴 위치", detail: "8 / 10 = 0.80" },
  { title: "인물 추적", detail: "7 / 10 = 0.70" },
  { title: "Detector 입력", detail: "6 / 10 = 0.60" },
] as const;

const ROWS = [
  { label: "평가 시각", count: STAGE_COUNTS.eligible, value: 1 },
  { label: "얼굴 위치", count: STAGE_COUNTS.detected, value: 0.8 },
  { label: "인물 추적", count: STAGE_COUNTS.tracked, value: 0.7 },
  { label: "Detector 입력", count: STAGE_COUNTS.cropped, value: 0.6 },
] as const;

export default function CoverageViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-preprocessing-coverage"
      eyebrow="관측 범위"
      title="분모를 바꾸지 않아야 0.60이 보입니다"
      description="각 단계의 성공 수를 처음 고정한 평가 시각 열 개로 나눠, 조용히 사라진 입력을 비율로 드러냅니다."
      note="표본 수와 실패 위치는 계산을 보여 주기 위한 가정입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <div className="space-y-4">
          {ROWS.map((row, index) => {
            const visible = index <= active;
            return (
              <div key={row.label} className="grid grid-cols-[7rem_minmax(0,1fr)_4.5rem] items-center gap-3 text-xs">
                <strong className="break-keep">{row.label}</strong>
                <span className="grid grid-cols-10 gap-1" aria-label={`${row.label} ${row.count}개`}>
                  {Array.from({ length: 10 }, (_, cell) => (
                    <span
                      key={cell}
                      className={`h-5 border ${visible && cell < row.count ? "border-primary bg-primary/70" : "border-border bg-background"}`}
                    />
                  ))}
                </span>
                <span className={`text-right font-mono text-sm font-bold ${visible ? "text-foreground" : "text-muted-foreground"}`}>
                  {visible ? row.value.toFixed(2) : "—"}
                </span>
              </div>
            );
          })}
          <p className="border-t border-border pt-4 text-right font-mono text-sm font-bold">
            C_input = {active >= 3 ? "6 / 10 = 0.60" : "—"}
          </p>
        </div>
      )}
    </DeepfakeStageViz>
  );
}
