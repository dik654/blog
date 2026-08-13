import SamplingViz from "./viz/SamplingViz";

export default function Sampling() {
  return (
    <section id="sampling" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Sampling은 관측 범위와 시간 해상도를 같은 frame budget에서 맞바꾸는 설계입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          영상 전체를 균등한 구간으로 나누고 각 구간에서 frame이나 짧은 clip을 고르면 전체 사건을 저렴하게 훑을 수 있습니다. 반면 짧고 빠른 동작이 핵심이라면 한 구간을 촘촘하게 읽는 dense clip이 필요합니다. Event-aware sampling은 scene change나 motion score를 활용하지만, 정적인 전조나 결과 장면을 놓칠 수 있으므로 uniform baseline과 함께 비교합니다.
        </p>
        <p>
          고정된 frame 수를 보편적인 sweet spot으로 두기는 어렵습니다. 같은 frame budget이라도 긴 영상에서는 coverage가 낮아지고, 높은 frame rate 영상에서는 인접 frame의 중복이 커지기 때문입니다. 그래서 clip duration, temporal stride, 영상당 clip 수와 실제로 덮은 시간 비율을 하나의 계약으로 기록합니다.
        </p>
      </div>
      <ExplainedFormula
        question="여러 clip이 영상 전체 중 실제로 얼마나 많은 시간을 덮었을까?"
        idea={<>각 clip이 덮는 시간 interval의 길이를 단순히 더하면 겹친 구간을 중복 계산합니다. Interval union의 길이를 video duration으로 나누어 coverage를 구합니다.</>}
        formula={String.raw`C_{\mathrm{time}}=\frac{\left|\bigcup_{j=1}^{K}[a_j,b_j]\right|}{D_{\mathrm{video}}}`}
        terms={[
          { symbol: "[aⱼ,bⱼ]", name: "clip interval", description: "j번째 sampled clip의 실제 start·end timestamp 구간입니다." },
          { symbol: "K", name: "clips per video", description: "한 video에서 평가하거나 학습에 사용하는 clip 수입니다." },
          { symbol: "|∪ intervals|", name: "covered time", description: "겹치는 부분을 한 번만 센 interval union의 총 길이입니다." },
          { symbol: "Dvideo", name: "video duration", description: "평가 대상 video의 전체 시간 길이입니다." },
        ]}
        assumptions={["Timestamp 단위를 second로 통일합니다.", "Clip 밖의 frame은 관측하지 않은 것으로 세며 overlap은 중복 계산하지 않습니다.", "Coverage는 사건을 실제로 포함했는지나 frame 품질을 보장하지 않습니다."]}
        interpretation="10초 video에서 [0,2], [1,3], [8,10]을 보면 합은 6초처럼 보이지만 union은 [0,3]과 [8,10]의 5초이므로 coverage는 .5입니다."
      />
      <div className="not-prose my-8"><SamplingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>학습은 다양성을, 평가는 재현성을 확보합니다</h3>
        <p>
          학습할 때는 segment 안에서 시작점과 frame을 무작위로 뽑아 같은 영상의 여러 시간 위치를 보게 할 수 있습니다. 평가는 deterministic multi-clip sampling으로 고정하고 clip score를 영상 단위로 집계해야 재실행할 때 같은 결과가 나옵니다. Mean, max, top-k pooling은 각각 다른 사건 지속 시간을 가정하므로 validation에서 선택합니다.
        </p>
        <p>
          Split은 frame이나 clip이 아니라 원본 video, 촬영 세션 또는 인물 단위로 만듭니다. 같은 영상에서 나온 인접 clip이 train과 validation에 나뉘면 배경과 compression을 기억하는 것만으로도 높은 점수가 나올 수 있습니다.
        </p>
      </div>
    </section>
  );
}
import ExplainedFormula from "@/components/ui/explained-formula";
