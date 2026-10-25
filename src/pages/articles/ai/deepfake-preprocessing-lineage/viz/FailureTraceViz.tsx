import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";
import { FRAME_TRACE, type TraceStatus } from "../trace";

const SCENES = [
  "Decode 결과 기록",
  "얼굴 찾기 실패 기록",
  "인물 전환 기록",
  "Crop 유효성 기록",
] as const;

const NOTES = [
  "열 개 시각 모두 frame을 읽었습니다. Decode가 실패했다면 뒤 단계를 실행하지 않고 그 시각에 typed failure를 남겨야 합니다.",
  "00:02와 00:07은 얼굴을 찾지 못했습니다. 두 시각을 삭제하면 얼굴 찾기 성공률이 보이지 않고 쉬운 frame만 다음 단계로 넘어갑니다.",
  "00:05는 얼굴 box가 있지만 person-C가 아닌 track으로 바뀌었습니다. Face detection 성공을 identity tracking 성공으로 세지 않습니다.",
  "00:08은 동일 인물까지 확인했지만 crop이 너무 작습니다. 최종 여섯 입력과 네 실패가 같은 원본 시간축에 함께 남습니다.",
] as const;

const STAGES = [
  { title: "Decode", detail: "10개 frame 읽기" },
  { title: "얼굴 위치", detail: "NO_FACE · 00:02, 00:07" },
  { title: "인물 추적", detail: "TRACK_SWITCH · 00:05" },
  { title: "Crop", detail: "TOO_SMALL · 00:08" },
] as const;

const COLUMNS = ["decode", "face", "track", "crop"] as const;

function Status({ value }: { value: TraceStatus }) {
  if (value === "ok") return <span className="font-bold text-emerald-700 dark:text-emerald-300">OK</span>;
  if (value === "not-run") return <span className="text-muted-foreground">—</span>;
  return <span className="break-keep font-bold text-rose-700 dark:text-rose-300">{value}</span>;
}

export default function FailureTraceViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-preprocessing-failures"
      eyebrow="실패 추적"
      title="사라진 네 시각을 실패 상태로 되돌려 놓습니다"
      description="같은 열 개 시각을 단계별 표에 고정하고, 성공한 입력뿐 아니라 실행되지 않은 뒤 단계까지 구분합니다."
      note="상태와 시각은 설명용 가정입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <div className="text-[11px] leading-4">
          <div className="grid grid-cols-[3.5rem_repeat(4,minmax(0,1fr))] gap-px bg-border p-px font-bold text-muted-foreground">
            <span className="bg-background px-2 py-2">시각</span>
            {STAGES.map((stage) => (
              <span key={stage.title} className="bg-background px-2 py-2 text-center">{stage.title}</span>
            ))}
          </div>
          {FRAME_TRACE.map((row) => (
            <div key={row.timestamp} className="grid grid-cols-[3.5rem_repeat(4,minmax(0,1fr))] gap-px bg-border px-px">
              <strong className="bg-background px-2 py-1.5 font-mono">{row.timestamp.slice(-2)}</strong>
              {COLUMNS.map((column, index) => (
                <span key={column} className={`min-w-0 bg-background px-1 py-1.5 text-center ${index === active ? "bg-primary/8" : ""}`}>
                  {index <= active ? <Status value={row[column]} /> : <span className="text-muted-foreground">·</span>}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </DeepfakeStageViz>
  );
}
