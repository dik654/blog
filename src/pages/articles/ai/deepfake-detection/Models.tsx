import ExplainedFormula from "@/components/ui/explained-formula";
import ModelsViz from "./viz/ModelsViz";

export default function Models() {
  return (
    <section id="models" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Detector는 backbone보다 입력 신호와 평가 축으로 비교합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Xception과 EfficientNet 같은 CNN은 face texture와 blending artifact를
          학습하는 강한 frame-level baseline입니다. ViT·CLIP 계열 encoder도
          pretrained representation으로 사용할 수 있지만 “real”과 “deepfake”라는
          prompt만으로 신뢰할 수 있는 forensic detector가 된다고 가정해서는 안
          됩니다.
        </p>
        <p>
          먼저 같은 crop, frame budget과 split에서 small CNN, modern pretrained
          encoder와 temporal aggregator를 비교합니다. Model family별 강점을
          texture·semantic 같은 서사로 추정하기보다 generator, codec, identity와
          quality slice의 실제 error로 확인합니다.
        </p>
      </div>
      <ExplainedFormula
        question="조작 흔적이 일부 frame에만 있을 때 mean·max·top-k pooling은 무엇을 다르게 가정할까?"
        idea={<>Frame score를 정렬하고 가장 큰 k개만 평균하면 전체 평균의 희석과 단일 max의 불안정을 절충합니다. k는 validation에서 고르되 video 길이에 따른 의미를 고정해야 합니다.</>}
        formula={String.raw`s_{\mathrm{video}}^{(k)}=\frac1k\sum_{j=1}^{k}s_{(j)},\qquad s_{(1)}\ge\cdots\ge s_{(T)}`}
        terms={[
          { symbol: "sₜ", name: "frame or clip score", description: "t번째 valid temporal unit에서 model이 낸 manipulation score입니다." },
          { symbol: "s(j)", name: "ordered score", description: "한 video 안에서 큰 값부터 정렬했을 때 j번째 score입니다." },
          { symbol: "k", name: "top-k budget", description: "Video prediction에 반영할 high-score temporal unit 수입니다." },
          { symbol: "svideo", name: "video-level score", description: "Calibration과 decision threshold가 읽는 aggregation 결과입니다." },
        ]}
        assumptions={["각 score는 같은 track·preprocessing·class 방향을 사용합니다.", "Video 길이가 다를 때 fixed k인지 비율 k/T인지 선언합니다.", "Max-like pooling이 detection artifact 한 frame에 민감할 수 있어 negative video의 tail distribution을 검사합니다."]}
        interpretation="k=T이면 mean, k=1이면 max입니다. Top-k가 좋아 보여도 face coverage가 낮거나 한 track에만 score가 몰리면 video 전체의 증거로 과장하지 않습니다."
      />
      <div className="not-prose my-8"><ModelsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Video prediction은 frame score의 평균보다 더 많은 선택을 포함합니다</h3>
        <p>
          Mean·max·top-k pooling은 서로 다른 위험 가정을 가집니다. 조작이 일부
          frame에만 나타나면 mean이 희석할 수 있고, max는 단일 detector failure에
          민감합니다. Track별 coverage와 score distribution을 보존한 aggregator를
          validation에서 선택합니다.
        </p>
        <p>
          Ensemble은 model 수를 고정하지 않고 OOD error diversity와 marginal
          gain으로 구성합니다. 최종 출력은 calibrated probability와 uncertainty,
          face detection coverage를 함께 제공해 사람이 score의 한계를 판단할 수
          있게 합니다.
        </p>
      </div>
      <div id="paper-deepfakebench" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · DeepfakeBench</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Yan 등은 detector마다 달랐던 data management·implementation·metric을 통일한 benchmark를 제안했습니다. 이 논문의 핵심은 특정 backbone의 영구적 순위가 아니라 같은 input과 protocol에서 재현 가능한 비교 기반을 만든 데 있습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://papers.nips.cc/paper/2023/hash/0e735e4b4f07de483cbe250130992726-Abstract-Datasets_and_Benchmarks.html" target="_blank" rel="noreferrer">통일된 pipeline과 evaluation protocol 보기</a>
      </div>
    </section>
  );
}
