/**
 * Attention framework overview Scene.
 * Score -> Weight -> Aggregate 를 primitives-first 패턴으로 설명.
 */

import { Scene } from '@/components/scene/Scene';
import type { Scene as SceneSpec } from '@/components/scene/types';

const SPEC: SceneSpec = {
  id: 'attention-overview-detail',
  title: 'Attention 프레임워크 — Score → Weight → Aggregate',
  caption: 'Query 와 Key 의 유사도를 분포로 바꾼 뒤 Value 를 가중합해 동적 context 생성',

  objects: [
    { id: 'Q', kind: 'vector', shape: [4], label: 'Q', role: 'input',
      description: '현재 디코더 step 의 query',
      why: '가장 단순한 검색은 하나의 질문으로 여러 후보를 비교하는 것.\n$Q$ 는 지금 출력하려는 토큰이 입력에서 무엇을 찾는지 담은 벡터' },
    { id: 'K', kind: 'group', label: 'K', children: ['k1', 'k2', 'k3', 'k4'] },
    { id: 'k1', kind: 'vector', shape: [4], label: 'k_1', role: 'input',
      description: '입력 위치 1 의 key' },
    { id: 'k2', kind: 'vector', shape: [4], label: 'k_2', role: 'input',
      description: '입력 위치 2 의 key' },
    { id: 'k3', kind: 'vector', shape: [4], label: 'k_3', role: 'input',
      description: '입력 위치 3 의 key' },
    { id: 'k4', kind: 'vector', shape: [4], label: 'k_4', role: 'input',
      description: '입력 위치 4 의 key' },
    { id: 'V', kind: 'group', label: 'V', children: ['v1', 'v2', 'v3', 'v4'] },
    { id: 'v1', kind: 'vector', shape: [4], label: 'V_1', role: 'input',
      description: '입력 위치 1 이 전달할 value' },
    { id: 'v2', kind: 'vector', shape: [4], label: 'V_2', role: 'input',
      description: '입력 위치 2 가 전달할 value' },
    { id: 'v3', kind: 'vector', shape: [4], label: 'V_3', role: 'input',
      description: '입력 위치 3 이 전달할 value' },
    { id: 'v4', kind: 'vector', shape: [4], label: 'V_4', role: 'input',
      description: '입력 위치 4 가 전달할 value' },

    { id: 'e', kind: 'vector', shape: [4], label: 'e', role: 'intermediate',
      description: '각 key 에 대한 유사도 점수' },
    { id: 'α', kind: 'distribution', shape: [4], label: 'α', role: 'intermediate',
      description: 'softmax 로 만든 attention 가중치' },
    { id: 'c', kind: 'vector', shape: [4], label: 'c_t', role: 'output',
      description: 'value 들의 가중합으로 만든 동적 context',
      why: '고정 context $c=h_T$ 는 마지막 인코더 상태 하나만 보는 특수 케이스.\nAttention 은 모든 $V_i$ 에 가중치 $\\alpha_i$ 를 주므로, 매 디코더 step 마다 다른 입력 위치 조합을 직접 참조' },
  ],

  transitions: [
    { t: 0, op: 'dot', inputs: ['Q', 'K'], produces: 'e',
      caption: '$e_i = \\mathrm{score}(Q, K_i)$',
      why: '가장 단순한 score 는 $Q \\cdot K_i$ — 같은 위치끼리 곱하고 합한 값.\n점수가 크면 현재 query 와 그 key 가 같은 방향의 정보를 많이 갖는다는 뜻.\nscore 함수만 바꾸면 Bahdanau, Luong, scaled dot-product 로 이어짐',
      notes: [
        { tex: '$Q$', target: 'Q', note: '검색어 역할.\n현재 step 이 입력에서 찾고 싶은 정보의 모양' },
        { tex: '$K_i$', target: 'K', note: '인덱스 역할.\n각 입력 위치가 어떤 비교 표식을 내놓는지' },
        { tex: '$\\mathrm{score}$', note: 'dot 은 파라미터 없는 특수 케이스.\nGeneral 은 $W$, additive 는 $W,U,v$ 를 넣어 비교 방식을 학습' },
      ] },
    { t: 1, op: 'softmax', inputs: ['e'], produces: 'α',
      caption: '$\\alpha_i = \\frac{\\exp(e_i)}{\\sum_j \\exp(e_j)}$',
      why: '점수는 크기 제한도 합 제한도 없음.\nsoftmax 는 모든 점수를 양수로 만들고 합을 1 로 맞춤.\n그래야 다음 단계의 가중합이 "각 위치를 몇 퍼센트 볼지" 로 해석됨',
      notes: [
        { tex: '$\\exp(e_i)$', note: '큰 점수를 더 크게 벌림.\n가장 관련 있는 위치가 더 큰 비중을 받음' },
        { tex: '$\\sum_j \\exp(e_j)$', note: '전체 합으로 나눠 합 1 분포를 만듦.\n단일 선택이 아니라 soft retrieval 이 됨' },
      ] },
    { t: 2, op: 'weighted-sum', inputs: ['α', 'V'], produces: 'c',
      caption: '$c_t = \\sum_i \\alpha_i \\cdot V_i$',
      why: '가장 단순한 retrieval 은 한 문서만 고르는 것.\nAttention 은 여러 value 를 가중 평균해서 필요한 정보를 섞음.\n$\\alpha=(0,0,0,1)$ 이면 마지막 value 하나만 보는 고정 context 와 같은 모양이므로, 동적 가중합이 그 특수 케이스를 포함' },
  ],
};

export default function AttnOverviewDetailScene() {
  return <Scene spec={SPEC} />;
}
