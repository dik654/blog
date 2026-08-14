import FailureModesViz from "./viz/FailureModesViz";

export default function Limitations() {
  return (
    <section id="limitations" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">SAE는 유용한 microscope지만 완성된 모델 설명서는 아니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          해석 가능한 사례 몇 개와 높은 FVE만으로 SAE 품질을 확정할 수 없습니다. Reconstruction residual에는 크기가 작아도 behavior에 중요한 성분이 남을 수 있고, dictionary width·seed·training corpus를 바꾸면 feature가 갈라지거나 합쳐집니다. 특정 feature를 찾지 못한 것이 LLM에 그 개념이 없다는 뜻인지 SAE가 놓쳤다는 뜻인지도 구분하기 어렵습니다.
        </p>
      </div>
      <FailureModesViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Claim을 model·hook·dataset·intervention 범위로 제한한다</h3>
        <p>
          “모델이 기만을 생각했다”보다 “이 model checkpoint의 특정 hook에서 SAE feature j가 이 prompt set에 활성화됐고, 정해진 α의 intervention에서 rubric score가 변했다”라고 기록하는 편이 검증 가능합니다. SAE checkpoint, feature index, activation threshold, prompt sampling, control direction, effect size와 부작용을 함께 남깁니다.
        </p>

        <h3>Feature stability는 번호가 아니라 direction과 activation으로 비교한다</h3>
        <p>
          같은 held-out activation corpus에서 width와 random seed만 바꾼 SAE를 여러 개 학습한 뒤, decoder direction의 cosine similarity와 example별 activation overlap을 함께 비교합니다. 한 feature가 두 directions로 갈라졌다면 index 일치율을 낮은 안정성으로만 기록하지 않고 split으로, 여러 feature가 하나로 모였다면 merge로 분류해야 합니다. 이 비교에서도 model·hook·normalization과 sparsity 또는 LM loss recovery 조건을 같게 맞춰야 합니다.
        </p>

        <h3>Feature에서 circuit으로 가려면 연결 증거가 더 필요하다</h3>
        <p>
          Crosscoder와 transcoder는 여러 layer 또는 block 입출력 사이의 feature를 연결하려 하지만 ground-truth circuit을 자동으로 제공하지 않습니다. SAE로 candidate를 찾고 activation patching·attribution·targeted task evaluation으로 계산 경로를 좁히는 순서가 안전합니다. 최종 결론은 reconstruction, interpretability와 causal behavior라는 서로 다른 축에서 각각 통과해야 합니다.
        </p>
      </div>

      <aside className="not-prose mt-7 rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
        <strong className="text-foreground">SAE release gate:</strong> 같은 model·hook·activation corpus와 compute budget에서 width·seed·sparsity가 다른 후보를 비교합니다. FVE와 LM loss recovery, dead latent, held-out label consistency, split·merge stability, controlled steering의 target effect와 unrelated capability side effect를 각각 기록하며, proxy 하나가 좋아졌다는 이유로 나머지 축의 regression을 숨기지 않습니다.
      </aside>
    </section>
  );
}
