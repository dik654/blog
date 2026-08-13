import ExplainedFormula from "@/components/ui/explained-formula";
import FaceExtractionViz from "./viz/FaceExtractionViz";

export default function FaceExtraction() {
  return (
    <section id="face-extraction" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Face extraction은 중립적인 전처리가 아니라, detector가 볼 수 있는 evidence를 선택하는 첫 번째 model입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Face crop은 background shortcut을 줄이고 조작 영역을 크게 보여주지만,
          검출기가 실패한 frame을 조용히 제거하면 쉬운 sample만 남습니다.
          Detector 이름을 정확도 순위로 고르기보다 target의 face size·pose·occlusion과
          hardware에서 recall, latency와 track continuity를 비교합니다.
        </p>
        <p>
          Video에서는 frame별 box를 독립적으로 자르기보다 identity track으로
          연결해 crop jitter를 줄입니다. Landmark alignment는 pose variation을
          줄일 수 있지만 resampling artifact를 새로 만들 수 있으므로 aligned와
          unaligned baseline을 같은 compression 조건에서 비교합니다.
        </p>
      </div>
      <ExplainedFormula
        question="얼굴을 찾지 못한 frame을 조용히 버리지 않고 coverage로 어떻게 남길까?"
        idea={<>평가 가능한 전체 frame 수를 분모에 두고, 유효한 identity track과 crop이 만들어진 frame만 분자에 둡니다. Model score와 coverage를 함께 보고해야 쉬운 frame만 남기는 selection을 확인할 수 있습니다.</>}
        formula={String.raw`C_{\mathrm{track}}=\frac{\sum_{t=1}^{T}I(\text{valid track at }t)}{T}`}
        terms={[
          { symbol: "T", name: "eligible frames", description: "Decode에 성공하고 평가 시간 구간에 속하는 전체 frame 수입니다." },
          { symbol: "I(·)", name: "indicator", description: "해당 frame에서 요구한 identity의 valid detection·track·crop이 있으면 1, 아니면 0입니다." },
          { symbol: "Ctrack", name: "track coverage", description: "원본 video 시간축 가운데 detector input까지 도달한 비율입니다." },
        ]}
        assumptions={["Frame sampling policy와 denominator T를 모든 model에서 동일하게 유지합니다.", "Track switch·중복 face·작은 face의 validity rule을 사전에 정합니다.", "Coverage가 낮은 video를 삭제하지 않고 failure 또는 abstention으로 별도 보고합니다."]}
        interpretation="100 frame 중 62 frame만 유효한 crop을 만들었다면 coverage는 .62입니다. 남은 62 frame에서 분류가 정확해도 전체 video를 안정적으로 판정했다고 볼 수 없습니다."
      />
      <div className="not-prose my-8"><FaceExtractionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Crop margin과 sampling은 model hyperparameter입니다</h3>
        <p>
          얼굴만 너무 타이트하게 자르면 blending boundary와 hair·ear 주변 신호를
          잃고, 넓게 자르면 background와 dataset shortcut이 들어옵니다. 고정된
          배수를 표준으로 두지 않고 margin별 OOD 성능과 detector failure rate를
          기록합니다.
        </p>
        <p>
          Frame 수는 임의의 범위로 정하지 않고 짧은 artifact와 긴 temporal
          inconsistency 중 무엇을 잡아야 하는지에 맞춥니다. Uniform clip baseline에
          quality-aware sampling을 추가하되, blur frame을 모두 버리면 실제
          유통 영상의 성능을 과대평가할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
