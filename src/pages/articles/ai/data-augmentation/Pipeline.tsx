import PipelineViz from "./viz/PipelineViz";

export default function Pipeline() {
  return (
    <section id="pipeline" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Pipeline은 transform 목록이 아니라 재현 가능한 data contract입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Albumentations 같은 library는 image와 bounding box, mask, keypoint에 같은
          spatial transform을 적용하는 실행 도구입니다. Library를 쓴다고 설정이
          자동으로 올바르지는 않습니다. Compose 순서, transform probability와
          range, interpolation, border mode, box format, minimum visible area,
          input dtype와 normalization을 versioned config에 고정해야 합니다.
        </p>
        <p>
          Training pipeline에는 검증한 stochastic transform을 넣되 validation과
          test에는 resize·center crop·normalization 같은 deterministic preprocessing만
          둡니다. Pretrained weight를 사용한다면 weight metadata가 요구하는 resize와
          normalization을 출발점으로 삼고, 변경했을 때는 별도 ablation으로 확인합니다.
        </p>
      </div>

      <div
        id="paper-albumentations"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">도구 읽기 · Multi-target image transform</p>
        <p className="mt-2 text-sm font-semibold">Albumentations: Fast and Flexible Image Augmentations</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 논문은 다양한 image transform을 빠르고 조합 가능한 library로 구현한
          설계와 benchmark를 설명합니다. Library 제공 여부는 각 transform의
          label-preservation이나 현재 task의 최적 policy를 보장하지 않으므로,
          annotation fixture와 model ablation은 별도로 필요합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.3390/info11020125" target="_blank" rel="noreferrer">원 논문의 library scope와 benchmark 보기</a>
      </div>

      <div className="not-prose my-8"><PipelineViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>시각 fixture와 metric gate를 모두 둡니다</h3>
        <p>
          여러 seed의 transform 결과를 image와 annotation이 겹쳐 보이는 형태로
          저장하면 object 소실, box drift, mask interpolation 오류를 먼저 잡을 수
          있습니다. 그다음 transform family별 ablation에서 원본 validation,
          robustness slice, calibration, class별 metric을 비교합니다. 실패 sample은
          transform parameter와 seed를 함께 저장해야 다시 실행할 수 있습니다.
        </p>
        <p>
          TTA는 training augmentation이 아니라 inference ensemble입니다. 같은
          label-preserving view에서 prediction을 얻고 spatial output을 원래 좌표로
          되돌린 뒤 결합합니다. Accuracy 이득뿐 아니라 추가 latency와 memory까지
          production SLA에 포함해야 합니다.
        </p>
      </div>
    </section>
  );
}
