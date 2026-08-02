/**
 * Self-attention Q/K/V and mask Scene.
 */

import { Scene } from '@/components/scene/Scene';
import type { Scene as SceneSpec } from '@/components/scene/types';

const SPEC: SceneSpec = {
  id: 'self-attention-qkv',
  title: 'Self-Attention — 같은 입력에서 Q, K, V 생성',
  caption: '입력 X 하나를 세 역할의 표현으로 투영한 뒤 자기 시퀀스 내부를 참조',

  objects: [
    { id: 'X', kind: 'matrix', shape: [4, 4], label: 'X', role: 'input',
      description: '입력 시퀀스 임베딩 행렬',
      why: '각 행이 한 토큰의 벡터.\nSelf-attention 은 외부 memory 가 아니라 같은 $X$ 안의 토큰끼리 서로를 참조' },
    { id: 'Wq', kind: 'matrix', shape: [4, 2], label: 'W_Q', role: 'param',
      description: 'query 투영 가중치',
      why: '$X$ 의 어느 차원을 "찾고 싶은 정보" 로 합칠지 학습.\n결과 $Q$ 의 각 차원은 검색 질문의 한 측면' },
    { id: 'Wk', kind: 'matrix', shape: [4, 2], label: 'W_K', role: 'param',
      description: 'key 투영 가중치',
      why: '같은 입력이라도 비교될 때의 표식은 query 와 다를 수 있음.\n$W_Q$ 와 분리해야 찾는 모양과 내보이는 모양을 따로 학습' },
    { id: 'Wv', kind: 'matrix', shape: [4, 2], label: 'W_V', role: 'param',
      description: 'value 투영 가중치',
      why: '비교 기준과 전달 정보는 같은 것이 아님.\n한 토큰이 "어떻게 찾아질지" 와 "무엇을 보낼지" 를 분리' },
    { id: 'mask', kind: 'matrix', shape: [4, 4], label: 'causal mask', role: 'param',
      description: '미래 위치를 차단하는 하삼각 mask' },

    { id: 'Q', kind: 'matrix', shape: [4, 2], label: 'Q', role: 'intermediate',
      description: '각 토큰이 찾는 정보' },
    { id: 'K', kind: 'matrix', shape: [4, 2], label: 'K', role: 'intermediate',
      description: '각 토큰이 비교될 때의 표식' },
    { id: 'V', kind: 'matrix', shape: [4, 2], label: 'V', role: 'intermediate',
      description: '각 토큰이 전달할 정보' },
    { id: 'scores', kind: 'matrix', shape: [4, 4], label: 'QK^T', role: 'intermediate',
      description: '자기 시퀀스 모든 위치 쌍의 점수' },
    { id: 'maskedScores', kind: 'matrix', shape: [4, 4], label: 'masked scores', role: 'intermediate',
      description: '미래 위치 점수를 $-\\infty$ 로 바꾼 행렬' },
    { id: 'A', kind: 'matrix', shape: [4, 4], label: 'A', role: 'intermediate',
      description: '각 토큰이 다른 토큰을 보는 분포' },
    { id: 'Y', kind: 'matrix', shape: [4, 2], label: 'Y', role: 'output',
      description: 'self-attention 출력' },
  ],

  transitions: [
    { t: 0, op: 'project', inputs: ['X', 'Wq'], produces: 'Q',
      caption: '$Q = XW_Q$',
      why: '가장 단순한 self-attention 은 같은 입력을 그대로 비교할 수 있음.\n하지만 원본 임베딩의 모든 차원이 "찾을 것" 에 적합하진 않음.\n$W_Q$ 가 입력 차원을 새로 합쳐 query 역할의 표현을 만듦' },
    { t: 0, op: 'project', inputs: ['X', 'Wk'], produces: 'K',
      caption: '$K = XW_K$',
      why: '$K$ 는 다른 토큰의 query 와 비교될 표식.\n$W_K$ 가 따로 있어야 같은 토큰도 "질문하는 모습" 과 "비교되는 모습" 이 달라질 수 있음' },
    { t: 0, op: 'project', inputs: ['X', 'Wv'], produces: 'V',
      caption: '$V = XW_V$',
      why: '$V$ 는 실제로 가중합되어 전달될 정보.\n비교에 쓰인 차원이 그대로 전달 정보일 필요가 없어서 별도 투영을 둠' },
    { t: 1, op: 'matmul', inputs: ['Q', 'K'], produces: 'scores',
      caption: '$S = QK^T$',
      why: '각 query 행과 각 key 행을 모두 내적.\n결과 $S_{ij}$ 는 토큰 $i$ 가 토큰 $j$ 를 얼마나 볼지의 raw 점수.\n같은 $X$ 에서 나온 $Q,K$ 를 비교하므로 "self" attention' },
    { t: 2, op: 'mask', inputs: ['scores', 'mask'], produces: 'maskedScores',
      caption: '$S_{ij}=-\\infty\\ \\mathrm{if}\\ j>i$',
      why: 'encoder self-attention 은 보통 모든 위치를 볼 수 있음.\n디코더 자기회귀에서는 미래 정답 토큰을 미리 보면 안 됨.\n미래 위치 점수를 $-\\infty$ 로 바꾸면 softmax 후 가중치가 0 이 됨',
      notes: [
        { target: 'mask', tex: '$j>i$', note: '현재 위치보다 오른쪽인 미래 토큰.\nGPT 계열 디코더에서 차단 대상' },
      ] },
    { t: 3, op: 'softmax', inputs: ['maskedScores'], produces: 'A',
      caption: '$A = \\mathrm{softmax}(S_{masked})$',
      why: '각 행의 점수를 합 1 분포로 변환.\n토큰마다 "시퀀스 안 어느 위치를 몇 퍼센트 볼지" 가 생김' },
    { t: 4, op: 'matmul', inputs: ['A', 'V'], produces: 'Y',
      caption: '$Y = A V$',
      why: 'attention 분포로 value 를 가중합.\n출력의 각 행은 해당 토큰이 자기 시퀀스 안에서 필요한 정보를 모은 결과' },
  ],
};

export default function SelfAttnScene() {
  return <Scene spec={SPEC} />;
}
