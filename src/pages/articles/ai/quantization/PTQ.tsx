import PTQProcessViz from './viz/PTQProcessViz';

export default function PTQ() {
  return (
    <section id="ptq" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PTQ: 학습 없이 양자화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>Post-Training Quantization</strong> — 이미 학습된 모델을 추가 학습 없이 양자화.
          가장 간단하고 빠른 방법으로, 대부분의 LLM 양자화가 PTQ 기반
        </p>
        <p>
          두 가지 방식: <strong>동적 양자화</strong>(추론 시 매 배치마다 scale 계산)와
          <strong>정적 양자화</strong>(calibration 데이터로 미리 scale 고정).
          LLM 서빙에서는 정적 양자화가 표준 — 한번 calibration 후 반복 사용하므로 오버헤드 없음
        </p>
        <p>
          calibration은 소량의 대표 데이터(100~1000개)로 각 레이어의 활성값 분포를 수집하는 과정.
          이 분포에서 scale과 zero_point를 결정하는 방법이 MinMax, Percentile, Entropy(KL) 3가지.
          TensorRT와 ONNX Runtime은 Entropy 방식을 기본으로 채택 — 원본 분포와의 KL 발산을 최소화하는 범위를 탐색
        </p>
      </div>

      <PTQProcessViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 PTQ가 작동하는가</h3>
        <p>
          신경망은 과잉 파라미터(over-parameterized) 상태 — 7B 모델의 70억 파라미터 중 대부분은 중복.
          양자화로 인한 약간의 노이즈는 이 중복성에 흡수됨.
          INT8(256단계)이면 가중치 분포의 99%를 충분히 표현 가능하고,
          양자화 오차는 여러 레이어를 통과하며 랜덤 노이즈처럼 평균화
        </p>
        <p>
          단, <strong>INT4(16단계)에서는 정보 손실이 급격히 증가</strong>.
          일반 PTQ로는 INT4 양자화 시 5~15% 정확도 저하가 발생할 수 있음.
          이 한계를 극복하기 위해 GPTQ/AWQ 같은 레이어별 보정 기법이 필요 — 다음 섹션에서 상세히 다룸
        </p>
        <p className="leading-7">
          요약 1: PTQ는 <strong>학습 없이 분 단위</strong>로 완료 — LLM에 가장 실용적<br />
          요약 2: calibration 데이터 100~1000개면 충분 — 전체 학습 데이터 불필요<br />
          요약 3: INT8은 일반 PTQ로 충분, <strong>INT4는 GPTQ/AWQ 보정이 필수</strong>
        </p>
      </div>
    </section>
  );
}
