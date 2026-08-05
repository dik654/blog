/**
 * Luong dot/general/scaled score Scene.
 */

import { Scene } from '@/components/scene/Scene';
import type { Scene as SceneSpec } from '@/components/scene/types';

const SPEC: SceneSpec = {
  id: 'dot-product-attention',
  title: 'Dot-Product 계열 Score 함수',
  caption: '가장 단순한 내적에서 시작해 general 과 scaled dot-product 로 확장',

  objects: [
    { id: 's', kind: 'vector', shape: [2], values: [0.7, 0.3], label: 's_t', role: 'input',
      description: '디코더 현재 상태',
      why: '다음 토큰을 만들기 위해 입력의 어느 위치를 봐야 하는지 담은 벡터' },
    { id: 'h', kind: 'vector', shape: [2], values: [0.8, 0.2], label: 'h_s', role: 'input',
      description: '비교 대상 인코더 상태',
      why: '입력 위치 하나의 의미 요약.\nLuong attention 은 이 벡터와 디코더 상태를 직접 비교' },
    { id: 'W', kind: 'matrix', shape: [2, 2], label: 'W_a', role: 'param',
      description: 'general score 의 학습 행렬',
      why: '같은 위치끼리만 곱하는 dot product 의 한계를 줄임.\n$s$ 의 어느 차원과 $h$ 의 어느 차원을 연결해 비교할지 학습' },
    { id: 'dk', kind: 'scalar', values: 64, label: 'd_k', role: 'input',
      description: 'key/query 차원 수' },

    { id: 'dotScore', kind: 'scalar', values: 0.62, label: 'score', role: 'intermediate',
      description: '파라미터 없는 dot-product 점수' },
    { id: 'generalScore', kind: 'scalar', label: 'score', role: 'intermediate',
      description: '학습 행렬을 거친 general 점수' },
    { id: 'scaledScore', kind: 'scalar', values: 0.62, label: 'scaled', role: 'output',
      description: '$\\sqrt{d_k}$ 로 나눈 scaled dot-product 점수' },
  ],

  transitions: [
    { t: 0, op: 'dot', inputs: ['s', 'h'], produces: 'dotScore',
      caption: '$s_t^T h_s = 0.7\\times0.8 + 0.3\\times0.2 = 0.62$',
      why: '가장 단순한 유사도는 두 벡터의 같은 차원끼리 곱하고 더하는 것.\n추가 파라미터가 없어서 빠르지만 $s_t$ 와 $h_s$ 차원이 같아야 함.\n같은 차원의 같은 위치가 서로 대응한다는 가정이 깔림',
      notes: [
        { tex: '$s_t^T h_s$', note: 'transpose 는 내적 표기.\n결과는 벡터가 아니라 스칼라 점수 하나' },
        { tex: '$0.62$', note: '값이 클수록 현재 디코더 상태와 이 인코더 위치가 더 잘 맞는다고 봄' },
      ] },
    { t: 1, op: 'matmul', inputs: ['s', 'W', 'h'], produces: 'generalScore',
      caption: '$\\mathrm{score}(s_t,h_s)=s_t^T W_a h_s$',
      why: 'dot product 는 $s$ 의 1번 차원과 $h$ 의 1번 차원만 직접 묶음.\n$W_a$ 를 넣으면 $s$ 의 한 차원이 $h$ 의 여러 차원과 어떻게 연결될지 학습.\n$W_a=I$ 이면 다시 dot product 로 돌아가므로 general 은 dot 을 포함하는 일반화',
      notes: [
        { target: 'W', tex: '$W_a$', note: '차원 간 연결표.\n어떤 차원 조합이 유사도에 중요한지 학습' },
        { tex: '$W_a=I$', note: '항등행렬이면 $s_t^T I h_s = s_t^T h_s$.\n즉 dot product 가 general 의 특수 케이스' },
      ] },
    { t: 2, op: 'scale', inputs: ['dotScore', 'dk'], produces: 'scaledScore',
      payload: { by: '1/sqrt(d_k)' },
      caption: '$\\frac{\\mathrm{score}}{\\sqrt{d_k}}$',
      why: '차원이 커지면 내적은 더 많은 항을 더하므로 값의 분산이 커짐.\n큰 점수는 softmax 를 거의 one-hot 으로 만들어 학습 신호를 약하게 함.\n$\\sqrt{d_k}$ 로 나누면 분산이 1 근처로 돌아와 softmax 가 덜 포화됨',
      notes: [
        { target: 'dk', tex: '$d_k$', note: 'query/key 벡터 길이.\n독립 성분을 더하면 분산이 성분 수만큼 커짐' },
        { tex: '$\\sqrt{d_k}$', note: '$\\mathrm{Var}(Q\\cdot K)=d_k$ 이므로 표준편차가 $\\sqrt{d_k}$.\n표준편차로 나눠 점수 스케일을 맞춤' },
      ] },
  ],
};

export default function DotProductScene() {
  return <Scene spec={SPEC} />;
}
