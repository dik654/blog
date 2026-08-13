import TeacherForcingGapViz from "./viz/TeacherForcingGapViz";

export default function TeacherForcing() {
  return (
    <section id="teacher-forcing" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Teacher forcing은 정답 prefix에서 학습하지만 inference는 model이 만든 prefix에서 진행된다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Training의 position t에서는 이전에 model이 틀렸더라도 dataset의 정답 token y&lt;t를 조건으로 y_t를 예측합니다. 각 position을 병렬로 계산할 수 있고 안정적인 supervised signal을 얻지만, inference에서는 한번 생성한 오답이 다음 prefix에 남습니다. 이 train–inference prefix 차이를 exposure bias라고 부릅니다.</p>
        <p>그렇다고 teacher forcing을 없애면 자동으로 좋아지는 것은 아닙니다. On-policy sampling은 비용과 variance가 커지고 학습 target도 달라집니다. SFT에서는 held-out response NLL뿐 아니라 실제 autoregressive generation의 task success와 error recovery를 따로 평가합니다.</p>
      </div>
      <TeacherForcingGapViz />
    </section>
  );
}
