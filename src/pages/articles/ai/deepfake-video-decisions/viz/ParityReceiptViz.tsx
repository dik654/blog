import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";
import { PARITY_RECEIPT } from "../trace";

const SCENES = [
  "두 후보에 같은 원본 묶음과 시각을 전달",
  "같은 전처리 영수증과 입력 크기를 사용",
  "같은 집계 절차와 검증 자료로 보정",
  "같은 장비에서 같은 지표를 기록",
] as const;

const NOTES = [
  "공간 모델과 시간 모델이 같은 source split과 열 개 timestamp를 받습니다. 입력 자료가 다르면 모델 구조의 효과를 분리할 수 없습니다.",
  "두 후보가 같은 여섯 crop ID와 해상도를 봅니다. 한 후보만 얼굴 검출이나 frame budget을 바꾸지 않습니다.",
  "두 후보 모두 상위 두 개 평균을 사용합니다. 보정 함수의 계수는 모델마다 따로 맞추되 같은 검증 split과 방법을 씁니다.",
  "같은 장비에서 오류율·coverage·지연·메모리를 기록합니다. 한 숫자가 아니라 같은 측정 영수증으로 비교합니다.",
] as const;

const STAGES = [
  { title: "자료", detail: "같은 split·10개 시각" },
  { title: "입력", detail: "같은 crop 6개" },
  { title: "판정", detail: "같은 집계·검증 방법" },
  { title: "측정", detail: "같은 장비·지표" },
] as const;

export default function ParityReceiptViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-video-parity"
      eyebrow="후보 비교"
      title="두 모델의 차이만 남기는 비교 영수증"
      description="자료·입력·판정·측정 조건을 같은 순서로 맞춰 모델 구조가 아닌 차이가 결과를 바꾸지 못하게 합니다."
      note="보정 함수는 같은 검증 자료와 방법으로 모델별로 따로 학습합니다. 같은 계수를 강제로 공유한다는 뜻은 아닙니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <div className="overflow-hidden border border-border/70">
          <div className="grid grid-cols-[6.5rem_repeat(2,minmax(0,1fr))] gap-px bg-border text-[10px] font-bold">
            <span className="bg-muted/40 px-3 py-2">조건</span>
            <span className="bg-muted/40 px-3 py-2">공간 모델</span>
            <span className="bg-muted/40 px-3 py-2">시간 모델</span>
          </div>
          {PARITY_RECEIPT.map((row, index) => {
            const group = index < 2 ? 0 : index < 3 ? 1 : index < 5 ? 2 : 3;
            const visible = active >= group;
            return (
              <div
                key={row.label}
                className={`grid grid-cols-[6.5rem_repeat(2,minmax(0,1fr))] gap-px bg-border text-[10px] leading-4 transition-opacity ${visible ? "opacity-100" : "opacity-20"}`}
              >
                <strong className="bg-background px-3 py-2">{row.label}</strong>
                <span className="break-keep bg-background px-3 py-2 text-muted-foreground">{row.spatial}</span>
                <span className="break-keep bg-background px-3 py-2 text-muted-foreground">{row.temporal}</span>
              </div>
            );
          })}
        </div>
      )}
    </DeepfakeStageViz>
  );
}
