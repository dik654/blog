import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증강이 왜 필요한가</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          딥러닝 모델의 성능은 데이터 양에 비례한다 — 그러나 데이터 수집은 비싸고 느리다<br />
          의료 영상(CT, MRI)은 촬영 비용이 높고, 위성 이미지는 촬영 주기가 제한되며,
          결함 탐지 데이터는 결함 자체가 드물어 불균형이 심하다
        </p>
        <p>
          <strong>데이터 증강</strong>(Data Augmentation) — 기존 학습 데이터를 변형하여 양과 다양성을 확보하는 기법<br />
          라벨은 유지한 채 입력만 변형하므로 "공짜 데이터"를 얻는 셈<br />
          오버피팅(과적합)을 줄이고 일반화 성능을 높이는 가장 실용적인 방법
        </p>
      </div>

      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">증강의 핵심 원칙</h3>
        <p>
          모든 변형이 허용되는 것은 아니다 — <strong>라벨 의미를 보존하는 변형만 유효</strong><br />
          숫자 6을 180° 회전하면 9가 된다. 좌우 대칭이 중요한 의료 영상에서 Flip은 금지<br />
          도메인 지식 없이 무작위 증강을 적용하면 오히려 모델 성능을 떨어뜨린다
        </p>
        <p>
          이미지·테이블·텍스트 각 도메인마다 적합한 증강 기법이 다르다<br />
          이미지: 기하학적 변환 + 색상 변환 + 혼합(Mixup/CutMix)<br />
          테이블: SMOTE + 노이즈 주입 + 피처 셔플<br />
          텍스트: 동의어 치환 + 역번역 + 문장 순서 변경
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 대회에서의 증강 전략</p>
        <p className="text-sm">
          Kaggle/Dacon 상위권은 증강을 "하이퍼파라미터"로 취급한다 — 모델 아키텍처만큼 중요하게 튜닝<br />
          시작은 가벼운 증강(Flip + Crop)으로, 오버피팅이 보이면 점진적으로 강도를 높이는 것이 정석<br />
          강한 증강부터 시작하면 학습 자체가 불안정해질 수 있다
        </p>
      </div>
    </section>
  );
}
