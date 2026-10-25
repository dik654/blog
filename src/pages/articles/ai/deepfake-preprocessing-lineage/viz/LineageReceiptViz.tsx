import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";

const SCENES = [
  "원본 주소 기록",
  "Decode 구현 기록",
  "얼굴 위치 기록",
  "인물 추적 기록",
  "변환과 출력 기록",
] as const;

const NOTES = [
  "Crop을 clip-042의 00:04로 되돌릴 수 있도록 영상 checksum과 timestamp를 먼저 기록합니다.",
  "같은 source라도 decoder revision과 frame index 계산이 달라질 수 있어 실행 구현을 영수증에 포함합니다.",
  "Face detector revision, box 좌표와 confidence를 남기면 다른 crop이 나온 원인을 얼굴 위치 단계까지 되짚을 수 있습니다.",
  "Track ID와 identity 상태를 남겨 얼굴 box가 person-C의 연속 관측인지 확인합니다. 실패한 00:05는 여기서 TRACK_SWITCH로 끝납니다.",
  "Alignment matrix·margin·resize·interpolation과 crop checksum을 남깁니다. 이 기록은 강건성을 보장하지 않지만 같은 입력을 재생하고 변경을 비교하게 합니다.",
] as const;

const STAGES = [
  { title: "Source", detail: "clip-042 · 00:04" },
  { title: "Decode", detail: "decoder-r2 · frame 4" },
  { title: "Face", detail: "face-r4 · box · 0.97" },
  { title: "Track", detail: "person-C#1 · consistent" },
  { title: "Output", detail: "align-r3 · 256² · crop-04-a1" },
] as const;

const RECEIPT = [
  ["source", "clip-042 · sha256:8c1f… · 00:04"],
  ["decode", "decoder-r2 · frame_index=4"],
  ["face", "face-r4 · box=[314,122,286,286] · conf=.97"],
  ["track", "person-C#1 · identity=consistent"],
  ["transform", "align-r3 · margin=.18 · bilinear · 256×256"],
] as const;

export default function LineageReceiptViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-preprocessing-lineage"
      eyebrow="입력 영수증"
      title="Crop 하나를 원본 시각까지 되짚습니다"
      description="완성 이미지만 저장하지 않고 원본 주소·실행 revision·좌표·인물 추적·변환 값을 한 기록으로 연결합니다."
      note="식별자·revision·좌표는 기록 구조를 보여 주기 위한 가정입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <dl className="border-y border-border text-xs">
          {RECEIPT.map(([key, value], index) => (
            <div key={key} className={`grid grid-cols-[6rem_minmax(0,1fr)] gap-4 border-b border-border px-3 py-3 last:border-b-0 ${index === active ? "bg-primary/8" : ""}`}>
              <dt className="font-mono font-bold text-primary">{key}</dt>
              <dd className={`min-w-0 break-words font-mono ${index <= active ? "text-foreground" : "text-muted-foreground"}`}>
                {index <= active ? value : "기록 대기"}
              </dd>
            </div>
          ))}
          <div className={`grid grid-cols-[6rem_minmax(0,1fr)] gap-4 px-3 py-3 ${active >= 4 ? "bg-primary/8" : ""}`}>
            <dt className="font-mono font-bold text-primary">output</dt>
            <dd className="min-w-0 break-words font-mono">{active >= 4 ? "crop-04-a1 · status=VALID" : "기록 대기"}</dd>
          </div>
        </dl>
      )}
    </DeepfakeStageViz>
  );
}
