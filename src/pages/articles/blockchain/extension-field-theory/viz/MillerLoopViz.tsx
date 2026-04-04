import StepViz from '@/components/ui/step-viz';
import StepWhy from './pairing/Step5bWhyMiller';
import StepWhyLine from './pairing/Step5cWhyLine';
import Step6 from './pairing/Step6MillerIdea';
import Step6b from './pairing/Step6bIterAnimate';
import Step7b from './pairing/Step7bLineEval';
import Step7d from './pairing/Step7dWhyP';
import Step7d2 from './pairing/Step7d2Measure';
import Step7d3 from './pairing/Step7d3Accumulate';
import Step7e from './pairing/Step7eWhatIsF';
import Step7f from './pairing/Step7fWhyMultiply';
import Step7c from './pairing/Step7cSparse';

const STEPS = [
  { label: 'Miller Loop = 스칼라 곱 rQ + f 누적',
    body: '실제로 같은 루프. r의 비트 순회, T←2T, T←T+Q — 전부 동일.\n추가된 것: 접선을 P에서 평가해서 f에 곱한다.' },
  { label: 'f ← f² · ℓ(P) — 각 부분의 의미',
    body: 'f²: 비트 이동(제곱). T←2T: 스칼라 곱과 동일.\nℓ(P): 접선을 P에서 평가 — Miller Loop만의 추가분.' },
  { label: '전체 흐름: 곡선 위 더블링 + 파이프라인',
    body: '왼쪽: T 더블링 → 접선 → P에서 평가.\n오른쪽: 3개 대표 iteration의 파이프라인.' },
  { label: '① 점 더블링: 곡선 위에서 일어나는 일',
    body: 'T에서 접선 → 곡선과 다시 만남 → x축 반사 → 2T.\n부산물: 접선의 방정식 ℓ(x,y).' },
  { label: '② 접선은 T에서 만들고, P에서 평가한다',
    body: 'ℓ(T)=0 (접선 위). ℓ(P)≠0 (접선 밖).\n이 값 = P가 T의 접선에서 얼마나 떨어져 있는가.' },
  { label: 'T는 Q의 분신 — 곡선 위를 이동한다',
    body: 'T = Q → 2Q → 4Q → 8Q → …\nP는 고정. T가 이동할 때마다 P와의 관계를 측정.' },
  { label: '접선으로 T-P 관계를 측정하는 원리',
    body: 'T에서 넣으면 0(쓸모없음). P에서 넣으면 ≠0.\n이 ≠0 값 = "현재 T 위치에서 P까지의 관계".' },
  { label: '254번 측정을 곱으로 누적 → f',
    body: '각 ℓ(P) = 한 스냅샷. 전부 곱하면 P-Q 전체 관계.\n254개의 곱 → 페어링 원재료.' },
  { label: 'f의 구체적인 모습',
    body: 'f=1 시작. 매 step: f² × ℓ(P).\n254번 후 f = 모든 ℓ(P)의 가중 곱.' },
  { label: '왜 곱셈인가 — 페어링의 정의',
    body: '페어링 = "모든 접선 평가값의 곱"으로 정의됨.\n스칼라 곱 = 덧셈 반복. 페어링 = 곱셈 반복.' },
  { label: '③ sparse 곱셈으로 비용 1/3',
    body: 'ℓ(P)의 12슬롯 중 3개만 ≠0 (twist 구조).\nfull 54곱 → sparse 18곱. 254번 → 큰 절감.' },
];

const COMPONENTS = [
  StepWhy, StepWhyLine, Step6, Step6b, Step7b,
  Step7d, Step7d2, Step7d3, Step7e, Step7f, Step7c,
];

export default function MillerLoopViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Comp = COMPONENTS[step];
        return Comp ? <Comp /> : null;
      }}
    </StepViz>
  );
}
