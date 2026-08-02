import { CitationBlock } from '@/components/ui/citation';
import {
  ConceptPrimer,
  InternalLink,
  QuestionLead,
} from '@/components/learning/ArticleLearning';
import ECODPipelineViz from './viz/ECODPipelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ECOD 개요</h2>
      <QuestionLead
        question="온도 94가 이상한 이유를 평균과 표준편차 없이 설명할 수 있을까?"
        answer="기준 데이터 13개를 정렬했을 때 94 이상은 1개뿐이다. 오른쪽 꼬리확률 1/13은 작고, -log를 적용하면 큰 양수 점수가 된다. ECOD는 이 순위 기반 증거를 피처별로 계산해 합친다."
      />
      <ConceptPrimer
        items={[
          {
            term: 'ECDF',
            meaning: '관측값 x 이하인 sample의 비율을 실제 데이터 순위로 세는 계단 함수다.',
            why: '정규분포 같은 모양을 먼저 가정하지 않고 데이터 자체의 상대 위치를 사용한다.',
          },
          {
            term: 'Left·right tail',
            meaning: '아주 작은 값과 아주 큰 값이 각각 얼마나 드문지 보는 양쪽 꼬리확률이다.',
            why: '낮은 극단과 높은 극단을 모두 이상 후보로 남기기 위해 필요하다.',
          },
          {
            term: '-log score',
            meaning: '0에 가까운 작은 확률을 큰 양수 증거로 바꾸는 변환이다.',
            why: '희귀할수록 점수가 커지고 여러 피처의 증거를 더하기 쉬워진다.',
          },
          {
            term: 'Contamination',
            meaning: '연속 점수 중 상위 몇 퍼센트를 이진 이상으로 자를지 정하는 규칙이다.',
            why: 'ECOD raw score 계산과 실제 검토·알람 예산을 분리하기 위해 필요하다.',
          },
        ]}
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ECOD</strong>는 반복 최적화로 모델을 학습하는 대신, 각 피처의 관측값을 정렬해
          경험적 누적 분포 함수(ECDF)를 만든다. 새 점이 한쪽 끝에서 드물수록 꼬리확률이 작아지고,
          <strong>-log 변환으로 작은 확률을 큰 이상 점수로 바꾼다.</strong> 먼저 “데이터에서 몇 번째인가”를 세는 알고리즘이라고 이해하면 된다.
        </p>
      </div>
      <div className="not-prose my-8"><ECODPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CitationBlock
          source="Li et al. · arXiv 2022 / IEEE TKDE · ECOD"
          citeKey={1} type="paper"
          href="https://arxiv.org/abs/2201.00382"
        >
          <p>
            원문 초록의 주장 요약: ECOD는 차원별 경험적 누적분포로 꼬리 확률을 계산하는 비지도 이상치 탐지법이며,
            모델 학습용 hyperparameter가 없고 해석과 확장성이 좋다.
          </p>
          <p className="mt-2 text-xs">
            ECOD — 하이퍼파라미터 없이 해석이 쉬우며 대규모 데이터에 확장 가능
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">이 장면에서 반드시 분리할 것</h3>
        <ul>
          <li><strong>비지도 학습</strong> — 라벨 없이 데이터 분포만으로 이상치를 탐지</li>
          <li><strong>차원별 독립 분석</strong> — 각 피처의 ECDF를 개별 계산</li>
          <li><strong>꼬리 확률 기반</strong> — 분포의 극단에 위치할수록 높은 이상치 점수</li>
          <li><strong>raw score는 모델 튜닝이 없음</strong> — k나 tree 수는 없지만, 이진 라벨에는 별도 threshold 또는 contamination이 필요</li>
        </ul>
        <p className="leading-7">
          요약 1: ECOD의 <strong>순위 점수</strong>는 반복 학습 없이 바로 계산한다. 이진 판정 규칙은 별도다.<br />
          요약 2: <strong>ECDF 꼬리 확률 + -log 변환</strong>으로 이상 점수 생성.<br />
          요약 3: 거리 행렬은 피하지만, 실제 구현은 열별 정렬과 피처 독립 근사를 사용한다.
        </p>
        <p>
          ECOD는 행의 시간 순서를 지운 tabular 분포 기준선이다. 점·맥락·구간 이상과 incident merge가
          필요한 운영 알람은{' '}
          <InternalLink slug="time-series-anomaly-detection" learningPathId="ai-timeseries-anomaly">
            시계열 이상 탐지: 점 하나에서 운영 가능한 사건까지
          </InternalLink>
          에서 먼저 정의한다.
        </p>
      </div>
    </section>
  );
}
