import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";
import { STAGE_COUNTS } from "../trace";

const SCENES = [
  "평가할 시각을 먼저 고정",
  "영상에서 frame을 읽음",
  "얼굴 위치를 찾음",
  "같은 인물인지 이어 봄",
  "유효한 입력과 실패 기록을 남김",
] as const;

const NOTES = [
  "clip-042의 00:00부터 00:09까지 열 개 시각을 평가 분모로 먼저 고정합니다. 뒤 단계가 실패해도 이 시각을 목록에서 지우지 않습니다.",
  "설명용 사례에서는 열 개 시각을 모두 decode했습니다. Decoder revision과 원본 checksum을 함께 남겨 같은 frame을 다시 만들 수 있게 합니다.",
  "얼굴을 찾지 못한 00:02와 00:07은 NO_FACE로 남습니다. 성공한 여덟 장만 평가 분모로 다시 세지 않습니다.",
  "00:05의 box가 다른 인물로 이어져 TRACK_SWITCH가 됩니다. 얼굴이 있다는 사실과 person-C가 맞다는 사실은 서로 다른 판정입니다.",
  "00:08은 얼굴이 너무 작아 TOO_SMALL이 되고, 여섯 crop만 detector 입력이 됩니다. 최종 coverage는 6/10=0.60이며 나머지 네 시각도 실패 기록으로 보존합니다.",
] as const;

const STAGES = [
  { title: "평가 시각", detail: "clip-042 · 10개" },
  { title: "Decode", detail: "성공 10 · 실패 0" },
  { title: "얼굴 위치", detail: "성공 8 · NO_FACE 2" },
  { title: "인물 추적", detail: "성공 7 · TRACK_SWITCH 1" },
  { title: "Detector 입력", detail: "유효 6 · TOO_SMALL 1" },
] as const;

const COUNTS = [
  STAGE_COUNTS.eligible,
  STAGE_COUNTS.decoded,
  STAGE_COUNTS.detected,
  STAGE_COUNTS.tracked,
  STAGE_COUNTS.cropped,
] as const;

export default function PreprocessingMapViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-preprocessing-map"
      eyebrow="전처리 지도"
      title="열 개 평가 시각이 여섯 detector 입력으로 바뀝니다"
      description="원본 시각을 먼저 고정하고 decode·얼굴 위치·인물 추적·crop을 지나며 성공과 실패가 어디서 생기는지 따라갑니다."
      note="시각·식별자·실패 상태는 계산 구조를 보여 주기 위한 가정입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <ol className="grid grid-cols-5 gap-px bg-border p-px" aria-label="원본 시각에서 detector 입력까지의 다섯 단계">
          {STAGES.map((stage, index) => {
            const current = active === index;
            const reached = active >= index;
            return (
              <li
                key={stage.title}
                aria-current={current ? "step" : undefined}
                className={`min-w-0 border-t-2 px-3 py-4 ${
                  current
                    ? "border-primary bg-primary/8 text-foreground"
                    : reached
                      ? "border-primary/40 bg-background text-foreground"
                      : "border-border bg-background text-muted-foreground"
                }`}
              >
                <span className="font-mono text-[10px] font-black text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong className="mt-1 block break-keep text-xs leading-5">{stage.title}</strong>
                <span className="mt-4 block font-mono text-2xl font-black">
                  {reached ? COUNTS[index] : "—"}
                </span>
                <span className="mt-1 block break-keep text-[11px] leading-4 text-muted-foreground">
                  남은 시각
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </DeepfakeStageViz>
  );
}
