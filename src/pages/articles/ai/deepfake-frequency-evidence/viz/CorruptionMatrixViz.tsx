import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";
import { CORRUPTION_MATRIX } from "../trace";

const SCENES = CORRUPTION_MATRIX.map((cell) => `${cell.condition} cell을 측정`);
const NOTES = [
  "같은 source 묶음의 원본에서 생성기 A peak는 0.84, 생성기 B는 0.22입니다. 이미 생성기마다 출발값이 다르므로 한 값을 보편 서명으로 부르지 않습니다.",
  "같은 원본을 JPEG quality 70으로 저장한 설명용 cell에서 A는 0.46, B는 0.20입니다. 얼굴과 배경을 바꾸지 않고 codec만 바꿉니다.",
  "256→128→256 크기 변경 cell에서 A는 0.28, B는 0.17입니다. resize 구현과 보간법도 함께 기록해야 재현할 수 있습니다.",
  "평균 반경 1 흐림 cell에서 A는 0.11, B는 0.09입니다. A의 원본 peak가 거의 사라졌으므로 주장은 A·원본 조건 밖으로 확장할 수 없습니다.",
] as const;

const STAGES = CORRUPTION_MATRIX.map((cell) => ({ title: cell.condition, detail: cell.revision }));

export default function CorruptionMatrixViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-corruption-matrix"
      eyebrow="손상 행렬"
      title="같은 source를 네 조건에 넣어 peak 변화를 비교합니다"
      description="열은 유통 변환, 행은 생성기 묶음입니다. 선택한 열만 바뀌고 source ID와 측정식은 그대로 유지합니다."
      note="표의 정규화 peak는 실측 결과가 아니라 행렬을 읽는 법을 설명하기 위한 가정입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <div className="overflow-hidden border border-border">
          <div className="grid grid-cols-[6.5rem_repeat(4,minmax(0,1fr))] gap-px bg-border">
            <div className="bg-muted/50 px-3 py-3 text-[10px] font-bold text-muted-foreground">정규화 peak</div>
            {CORRUPTION_MATRIX.map((cell, index) => (
              <div key={cell.condition} className={`bg-background px-2 py-3 text-center text-[10px] font-bold ${active === index ? "text-primary" : "text-muted-foreground"}`}>
                {cell.condition}
              </div>
            ))}
            {["생성기 A", "생성기 B"].map((label, rowIndex) => (
              <div key={label} className="contents">
                <strong className="flex items-center bg-background px-3 text-xs">{label}</strong>
                {CORRUPTION_MATRIX.map((cell, index) => {
                  const value = rowIndex === 0 ? cell.generatorA : cell.generatorB;
                  return (
                    <div key={`${label}-${cell.condition}`} className={`bg-background px-3 py-4 text-center transition-colors ${active === index ? "!bg-primary/8" : ""}`}>
                      <span className="font-mono text-xl font-black">{value.toFixed(2)}</span>
                      <span className="mt-1 block text-[9px] text-muted-foreground">설명용 값</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </DeepfakeStageViz>
  );
}
