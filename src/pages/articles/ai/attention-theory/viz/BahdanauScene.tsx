/**
 * Bahdanau (Additive) Attention 의 4 단계 전체 파이프라인 Scene.
 * primitives-first 패턴 (SPEC_WRITING.md 참조).
 *
 * 인덱스 표기: i = 디코더 step, j = 인코더 위치 — 본문 산식과 일치
 */

import { Scene } from '@/components/scene/Scene';
import type { Scene as SceneSpec } from '@/components/scene/types';

const SPEC: SceneSpec = {
  id: 'bahdanau-attention',
  title: 'Bahdanau Attention — 정렬 점수 → 가중합',
  caption: '디코더 상태 $s$ 와 각 인코더 위치 $h_j$ 의 유사도를 MLP 로 계산해 가중합으로 컨텍스트 생성',

  objects: [
    { id: 's', kind: 'vector', shape: [4], label: 's', role: 'input',
      description: '현재 디코더 단계의 hidden state',
      why: '디코더는 한 토큰씩 출력.\n$s$ 는 지금까지 출력한 내용의 요약 벡터.\n이 요약을 인코더 출력들과 비교해 다음 출력 결정 시 어디를 볼지 정함' },
    { id: 'W', kind: 'matrix', shape: [4, 4], label: 'W', role: 'param',
      description: '디코더 측 변환 매트릭스 (학습)',
      why: '$s$ 를 점수 계산용 공간으로 변환.\n원본 $s$ 표현이 그대로 점수 계산에 적합하지 않을 수 있어서, 적합한 변환을 모델이 학습' },
    { id: 'U', kind: 'matrix', shape: [4, 4], label: 'U', role: 'param',
      description: '인코더 측 변환 매트릭스 (학습)',
      why: '$h_j$ 를 점수 계산용 공간으로 변환.\n$W$ 와 결과 차원이 같아야 합산 가능. 학습은 따로 — 디코더 측과 인코더 측이 다른 방식으로 점수에 기여' },
    { id: 'v', kind: 'vector', shape: [4], label: 'v', role: 'param',
      description: '점수 합산용 학습 가중치',
      why: '비선형 후의 hidden 벡터를 1 개 스칼라 점수로 줄이는 학습 벡터.\nhidden 의 어느 차원이 점수에 얼마나 영향 주는지 학습' },

    { id: 'H', kind: 'group', label: 'H', children: ['h1', 'h2', 'h3', 'h4'] },
    { id: 'h1', kind: 'vector', shape: [4], label: 'h_1',
      description: '인코더 위치 1 의 hidden state' },
    { id: 'h2', kind: 'vector', shape: [4], label: 'h_2',
      description: '인코더 위치 2 의 hidden state' },
    { id: 'h3', kind: 'vector', shape: [4], label: 'h_3',
      description: '인코더 위치 3 의 hidden state' },
    { id: 'h4', kind: 'vector', shape: [4], label: 'h_4',
      description: '인코더 위치 4 의 hidden state' },

    { id: 'Ws', kind: 'vector', shape: [4], label: 'W·s', role: 'intermediate' },
    { id: 'e', kind: 'vector', shape: [4], label: 'e', role: 'intermediate',
      description: '4 인코더 위치 각각에 대한 정렬 점수' },
    { id: 'α', kind: 'distribution', shape: [4], label: 'α', role: 'intermediate',
      description: '합 1 인 attention 가중치 분포' },
    { id: 'c', kind: 'vector', shape: [4], label: 'c', role: 'output',
      description: '컨텍스트 벡터 — 인코더 출력들의 가중합' },
  ],

  transitions: [
    { t: 0, op: 'project', inputs: ['s', 'W'], produces: 'Ws',
      caption: '$W \\cdot s$',
      why: '디코더 상태 $s$ 를 비교 가능한 표현으로 변환.\nBahdanau 의 MLP 는 디코더 쪽과 인코더 쪽을 따로 변환 후 합산하는 구조 — 양쪽 변환을 분리해야 각자 적합한 표현 학습 가능' },

    { t: 1, op: 'project', inputs: ['Ws', 'H', 'U', 'v'], produces: 'e',
      caption: '$e_j = v^T \\tanh(W s + U h_j)$',
      why: '가장 단순한 유사도는 $s \\cdot h_j$ — 두 벡터의 같은 위치끼리 곱하고 합한 값.\n그 한 가지 모양만으론 모든 종류의 유사도 패턴을 못 표현.\n이 식의 각 조각이 단계적으로 자유도를 추가해서, $s \\cdot h_j$ 보다 다양한 유사도 함수를 학습 가능하게 만듦',
      notes: [
        { target: 'Ws', tex: '$W s,\\ U h_j$', note: '$s$ 와 $h_j$ 를 각자 다른 매트릭스로 변환한 뒤 더함.\n변환 매트릭스 $W$, $U$ 가 학습되므로, "두 벡터의 어느 부분을 비교할지" 자체를 모델이 결정' },
        { target: 'v', tex: '$v^T \\cdot (\\cdots)$', note: '휜 벡터의 각 차원에 학습 가중치 $v$ 곱하고 합 → 스칼라 점수.\n$v$ 가 "어느 차원의 패턴이 점수에 중요한지" 학습' },
        { tex: '$\\tanh(\\cdot)$', note: 'S 자 모양으로 휘는 함수.\n왜 필요? 휘지 않으면 (선형) 매트릭스 두 층은 결국 한 매트릭스와 같아짐 — 두 층 쌓은 의미가 사라짐.\ntanh 가 한 번 들어가야 두 층의 효과가 살아남' },
        { tex: 'vs $s \\cdot h_j$', note: 'dot product 는 위 식에서 $W = U = I$, tanh 빼고, $v$ 가 전부 1 인 특수 케이스.\n이 식이 그보다 일반적이라 dot product 가 못 잡는 유사도도 학습 가능' },
      ],
    },

    { t: 2, op: 'softmax', inputs: ['e'], produces: 'α',
      caption: '$\\alpha_j = \\mathrm{softmax}(e_j)$',
      why: '4 개 점수를 합 1 인 양수 분포로.\n양수: 음수 점수도 양수 가중치로 변환.\n합 1: 다음 가중합이 "어느 인코더 위치에 얼마나 비중" 의 의미를 가짐',
      notes: [
        { tex: '$e_j$', note: '인코더 위치 $j$ 의 정렬 점수 (이전 단계 결과)' },
        { tex: '$\\mathrm{softmax}$', note: '$\\frac{\\exp(e_j)}{\\sum_k \\exp(e_k)}$.\n분자가 exp 라 음수 점수도 양수로, 큰 점수일수록 훨씬 큰 가중치 (지수 비율).\n분모는 정규화 — 합이 1 이 되게' },
      ],
    },

    { t: 3, op: 'weighted-sum', inputs: ['α', 'H'], produces: 'c',
      caption: '$c = \\sum_j \\alpha_j \\cdot h_j$',
      why: '$\\alpha_j$ 가중치로 $h_j$ 들을 평균.\n결과 $c$ 는 "이 디코더 step 에서 인코더 출력들을 어떤 비중으로 본 결과" — 다음 출력 예측에 쓰임.\n매 디코더 step 마다 $\\alpha$ 가 다시 계산 → 매번 다른 위치에 집중 가능 (= 동적 정렬)',
      notes: [
        { tex: '$\\alpha_j$', note: '$j$-위치에 주는 가중치 (이 디코더 step 에서). 합 1' },
        { tex: '$h_j$', note: '$j$-위치 인코더 출력 (전달할 정보)' },
        { tex: '$\\sum_j$', note: '모든 인코더 위치 합산.\n수식적으로는 가중치 합 1 인 평균과 같음 — 다만 가중치가 학습 가능한 분포' },
      ],
    },
  ],
};

export default function BahdanauScene() {
  return <Scene spec={SPEC} />;
}
