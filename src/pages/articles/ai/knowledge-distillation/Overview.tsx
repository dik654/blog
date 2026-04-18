import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">지식 증류란</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>지식 증류(Knowledge Distillation)</strong> — 큰 Teacher 모델이 학습한 "지식"을 작은 Student 모델로 전달하는 기법.<br />
          핵심 아이디어: Teacher의 <strong>soft target</strong>(소프트 확률 분포)에는 hard label(정답 라벨)보다 풍부한 정보가 담겨 있다.
        </p>

        <h3>왜 지식 증류가 필요한가</h3>
        <p>
          대규모 모델은 높은 정확도를 달성하지만, 추론 비용이 크다 — 메모리, 지연시간, 에너지 소비 모두.<br />
          모바일 배포, 실시간 서빙, 엣지 디바이스에서는 경량 모델이 필수.<br />
          단순히 작은 모델을 학습하면 성능이 크게 떨어지지만, Teacher의 지식을 전달받으면 격차를 줄일 수 있다.
        </p>

        <h3>Dark Knowledge — Hinton(2015)</h3>
        <p>
          Hinton et al.의 "Distilling the Knowledge in a Neural Network"가 지식 증류의 기반 논문.<br />
          핵심 개념은 <strong>dark knowledge</strong>: 오답 클래스의 확률 분포 속에 숨겨진 정보.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>예시</strong>: 고양이 사진을 분류할 때 Teacher의 출력이 [고양이: 0.85, 호랑이: 0.10, 강아지: 0.04, 자동차: 0.01]이라면 —<br />
            "고양이와 호랑이는 비슷하고, 자동차와는 전혀 다르다"는 구조적 관계가 담겨 있다.<br />
            Hard label [0, 1, 0, 0]에는 이 관계 정보가 전혀 없다.
          </p>
        </div>

        <h3>Temperature Scaling</h3>
        <p>
          일반 softmax는 가장 큰 logit에 확률이 집중된다 — 정보가 희소해짐.<br />
          <strong>Temperature T</strong>로 logit을 나눈 뒤 softmax를 적용하면 분포가 부드러워진다: <code>softmax(zᵢ / T)</code>.<br />
          T=1은 원래 softmax, T가 클수록(5~20) 클래스 간 확률 차이가 줄어들어 dark knowledge가 더 잘 드러난다.
        </p>

        <h3>지식 증류의 3대 축</h3>
        <p>
          <strong>Logit Distillation</strong> — Teacher의 최종 확률 분포를 Student가 모방.<br />
          <strong>Feature Distillation</strong> — Teacher의 중간 레이어 표현을 Student에 전달.<br />
          <strong>Data Distillation</strong> — Teacher가 생성한 데이터로 Student를 학습.
        </p>
      </div>

      <div className="not-prose mt-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: 지식 증류는 <strong>모델 압축</strong>의 핵심 기법 — Teacher의 dark knowledge를 Student에 전달.<br />
          요약 2: Temperature scaling으로 soft target의 정보량을 조절.<br />
          요약 3: Logit, Feature, Data 세 축으로 발전 — LLM 시대에도 핵심 역할.
        </p>
      </div>
    </section>
  );
}
