import RecoveryViz from './viz/RecoveryViz';

export default function Recovery() {
  return (
    <section id="recovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프루닝 후 Fine-tuning 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          프루닝만으로는 정확도 하락이 불가피 — 특히 높은 프루닝 비율에서<br />
          <strong>Post-pruning Fine-tuning</strong>: 남은 가중치를 소량의 데이터로 재조정<br />
          일반적으로 원래 학습 에폭의 10~30%만 추가 학습하면 대부분 복구 가능
        </p>
      </div>
      <div className="not-prose my-8">
        <RecoveryViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">학습률 설정이 핵심</h3>
        <p>
          프루닝 후 가중치는 이미 좋은 위치(local minimum 근처) — 큰 LR은 이 위치를 벗어나게 만듦<br />
          원래 학습의 peak LR 대비 1/10 ~ 1/100이 최적<br />
          Cosine Annealing + warmup 5%: 안정적인 복구를 위한 표준 스케줄
        </p>
        <p>
          학습률이 너무 크면 → 남은 가중치까지 발산, 프루닝 전보다 나빠질 수 있음<br />
          학습률이 너무 작으면 → 복구가 너무 느림, 원래 정확도에 도달 못함<br />
          실전 팁: 원래 LR의 1/10에서 시작, validation loss 보고 조정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Knowledge Distillation과 결합</h3>
        <p>
          원본 모델(Teacher)의 soft label로 프루닝 모델(Student)을 학습<br />
          Loss = α · CE(y, ŷ) + (1-α) · KL(teacher_soft, student_soft)<br />
          α = 0.5, Temperature T = 4가 일반적 시작점
        </p>
        <p>
          Teacher의 soft label에는 "어두운 지식"(dark knowledge)이 담겨 있음<br />
          예: 고양이 이미지 → [고양이: 0.9, 호랑이: 0.07, 개: 0.02] — 클래스 간 유사도 정보<br />
          이 정보가 프루닝된 모델의 정확도 복구를 1~3% 추가 향상시킴
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">최적 경량화 파이프라인</h3>
        <p>
          <strong>1단계 프루닝</strong>: 불필요한 연결 제거 — 구조 최적화<br />
          <strong>2단계 Fine-tuning</strong>: 남은 가중치 재조정 — 정확도 복구<br />
          <strong>3단계 양자화</strong>: FP16 → INT4 비트 축소 — 메모리 최적화
        </p>
        <p>
          순서가 중요한 이유 — 프루닝이 가중치 분포를 바꿈<br />
          양자화를 먼저 하면 → 프루닝 후 분포가 달라져 양자화 테이블 무효화<br />
          프루닝을 먼저 하면 → 남은 가중치의 분포에 맞춰 양자화 가능<br />
          최종 효과: 4~8배 모델 크기 축소 + 2~4배 추론 속도 향상
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Iterative Pruning</h3>
        <p>
          한 번에 높은 비율로 프루닝하면 정확도 급락 — 점진적으로 프루닝하면 복구 용이<br />
          일반적 전략: 10% 프루닝 → fine-tuning → 10% 추가 프루닝 → fine-tuning → ...<br />
          시간은 더 걸리지만 동일 최종 희소성에서 정확도가 2~5% 높음
        </p>

        <div className="bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">실전 체크리스트</p>
          <p>
            1. 프루닝 비율 50%로 시작 → validation 확인 후 점진적으로 높이기<br />
            2. Fine-tuning LR = 원래의 1/10, Cosine Annealing 사용<br />
            3. 가능하면 Knowledge Distillation 결합 (1~3% 추가 향상)<br />
            4. 프루닝 → fine-tuning → 양자화 순서 유지<br />
            5. Layer별 sensitivity 분석 — 모든 layer를 동일 비율로 프루닝하지 않기<br />
            6. 배포 환경 고려 — GPU면 N:M 희소성, CPU면 Structured 프루닝 우선
          </p>
        </div>
      </div>
    </section>
  );
}
