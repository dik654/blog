/**
 * Self-attention detail Scene.
 * BERT-base dimensions, multi-head, complexity, causal mask 를 Scene spec 으로 정리.
 */

import { Scene } from '@/components/scene/Scene';
import type { Scene as SceneSpec } from '@/components/scene/types';

const SPEC: SceneSpec = {
  id: 'self-attention-detail',
  title: 'Self-Attention 상세 — 행렬 계산과 Multi-Head',
  caption: 'Q/K/V 투영, attention 행렬, multi-head 병렬화, causal mask 의 역할',

  objects: [
    { id: 'X', kind: 'matrix', shape: [4, 768], label: 'X (n×768)', role: 'input',
      description: 'BERT-base 크기의 입력 시퀀스 행렬',
      why: '각 토큰을 768 차원 벡터로 표현.\nself-attention 은 이 행렬에서 Q, K, V 를 모두 만들기 때문에 시퀀스 내부 관계를 학습' },
    { id: 'Wqkv', kind: 'group', label: 'W_Q,W_K,W_V', children: ['Wq', 'Wk', 'Wv'] },
    { id: 'Wq', kind: 'matrix', shape: [768, 64], label: 'W_Q', role: 'param',
      description: '한 head 의 query 가중치' },
    { id: 'Wk', kind: 'matrix', shape: [768, 64], label: 'W_K', role: 'param',
      description: '한 head 의 key 가중치' },
    { id: 'Wv', kind: 'matrix', shape: [768, 64], label: 'W_V', role: 'param',
      description: '한 head 의 value 가중치' },
    { id: 'sqrt64', kind: 'scalar', values: 8, label: '√64', role: 'input',
      description: 'BERT-base head 차원 $d_k=64$ 의 스케일' },
    { id: 'heads', kind: 'group', label: 'heads', children: ['h0', 'h1', 'h2', 'h3'] },
    { id: 'h0', kind: 'matrix', shape: [4, 64], label: 'head_0', role: 'intermediate',
      description: '구문 관계를 맡을 수 있는 head' },
    { id: 'h1', kind: 'matrix', shape: [4, 64], label: 'head_1', role: 'intermediate',
      description: '의미 관계를 맡을 수 있는 head' },
    { id: 'h2', kind: 'matrix', shape: [4, 64], label: 'head_2', role: 'intermediate',
      description: '위치 관계를 맡을 수 있는 head' },
    { id: 'h3', kind: 'matrix', shape: [4, 64], label: '...', role: 'intermediate',
      description: '나머지 head 들' },
    { id: 'WO', kind: 'matrix', shape: [768, 768], label: 'W_O', role: 'param',
      description: 'concat 된 head 결과를 원래 차원으로 되돌리는 출력 투영' },
    { id: 'mask', kind: 'matrix', shape: [4, 4], label: 'causal mask', role: 'param',
      description: 'decoder 에서 미래 위치를 막는 하삼각 mask' },

    { id: 'QKV', kind: 'group', label: 'Q,K,V', children: ['Q', 'K', 'V'] },
    { id: 'Q', kind: 'matrix', shape: [4, 64], label: 'Q', role: 'intermediate',
      description: '한 head 의 query 행렬' },
    { id: 'K', kind: 'matrix', shape: [4, 64], label: 'K', role: 'intermediate',
      description: '한 head 의 key 행렬' },
    { id: 'V', kind: 'matrix', shape: [4, 64], label: 'V', role: 'intermediate',
      description: '한 head 의 value 행렬' },
    { id: 'scores', kind: 'matrix', shape: [4, 4], label: 'QK^T/√64', role: 'intermediate',
      description: '모든 위치 쌍의 scaled score 행렬' },
    { id: 'A', kind: 'matrix', shape: [4, 4], label: 'A', role: 'intermediate',
      description: '행별 attention 분포' },
    { id: 'headOut', kind: 'matrix', shape: [4, 64], label: 'head_i', role: 'intermediate',
      description: '한 head 의 attention 출력' },
    { id: 'concat', kind: 'matrix', shape: [4, 768], label: 'Concat(heads)', role: 'intermediate',
      description: '12개 head 출력을 이어 붙인 행렬' },
    { id: 'Y', kind: 'matrix', shape: [4, 768], label: 'Y', role: 'output',
      description: 'multi-head attention 최종 출력' },
    { id: 'masked', kind: 'matrix', shape: [4, 4], label: 'masked S', role: 'output',
      description: '미래 위치가 차단된 decoder score 행렬' },
  ],

  transitions: [
    { t: 0, op: 'project', inputs: ['X', 'Wqkv'], produces: ['Q', 'K', 'V'],
      caption: '$Q=XW_Q,\\ K=XW_K,\\ V=XW_V$',
      why: '가장 단순한 방식은 같은 $X$ 를 그대로 score 와 value 에 모두 쓰는 것.\n세 가중치를 분리하면 같은 토큰도 찾는 역할, 비교되는 역할, 전달하는 역할로 다르게 보임.\n$W_Q,W_K,W_V \\in \\mathbb{R}^{768\\times64}$ 이라 한 head 의 출력은 $n\\times64$',
      notes: [
        { target: 'Wqkv', tex: '$768\\times64$', note: '12개 head 이므로 $768/12=64$.\n각 head 가 전체 표현 중 일부 차원 폭에서 관계를 본다' },
      ] },
    { t: 1, op: 'scale', inputs: ['Q', 'K', 'sqrt64'], produces: 'scores',
      caption: '$S = \\frac{QK^T}{\\sqrt{64}}$',
      why: '$QK^T$ 는 모든 토큰 쌍을 한 번에 비교해 $n\\times n$ 행렬을 만듦.\n$n^2$ 메모리가 필요하지만 각 쌍 계산은 병렬 가능.\n$\\sqrt{64}=8$ 로 나눠 softmax 포화를 줄임',
      notes: [
        { tex: '$n\\times n$', note: '행은 query 위치, 열은 key 위치.\n각 행이 한 토큰의 참조 후보 전체' },
        { target: 'sqrt64', tex: '$\\sqrt{64}$', note: '한 head 의 key 차원이 64.\n표준편차 스케일을 맞춰 점수를 안정화' },
      ] },
    { t: 2, op: 'softmax', inputs: ['scores'], produces: 'A',
      caption: '$A = \\mathrm{softmax}(\\mathrm{scores})$',
      why: '각 행을 확률 분포로 바꿈.\n토큰마다 어떤 위치를 볼지 독립적으로 정해지므로 전체 계산은 행 단위 병렬 처리 가능' },
    { t: 3, op: 'matmul', inputs: ['A', 'V'], produces: 'headOut',
      caption: '$\\mathrm{head}_i = A V$',
      why: '한 head 는 특정 부분공간에서 value 를 가중합.\n단일 head 는 한 종류의 관계에 치우칠 수 있음.\n여러 head 를 병렬로 두면 구문, 의미, 위치 같은 서로 다른 관계를 각자 학습할 여지가 생김' },
    { t: 4, op: 'concat', inputs: ['heads'], produces: 'concat',
      caption: '$H = \\mathrm{Concat}(\\mathrm{head}_0,\\ldots,\\mathrm{head}_{11})$',
      why: '각 head 출력은 $n\\times64$.\n12개를 이어 붙이면 다시 $n\\times768$ 이 됨.\n단일 큰 head 의 특수 케이스는 모든 head 가 같은 관계를 보도록 묶인 형태라고 볼 수 있고, multi-head 는 그 묶음을 풀어 병렬 역할 분담을 허용' },
    { t: 5, op: 'project', inputs: ['concat', 'WO'], produces: 'Y',
      caption: '$Y = \\mathrm{Concat}(\\mathrm{heads}) W_O$',
      why: 'concat 만 하면 head 결과가 단순히 옆으로 붙어 있음.\n$W_O$ 는 어느 head 의 어느 차원을 다음 layer 에 어떻게 섞어 보낼지 학습.\nBERT-base 한 블록의 attention 파라미터는 QKV 약 177만 + $W_O$ 약 59만, 총 약 236만' },
    { t: 6, op: 'mask', inputs: ['scores', 'mask'], produces: 'masked',
      caption: '$S_{ij}=-\\infty\\ \\mathrm{if}\\ j>i$',
      why: 'BERT encoder 는 양방향이라 보통 causal mask 가 없음.\nGPT decoder 는 다음 토큰을 맞히는 학습이므로 미래 토큰을 보면 정답 유출.\n미래 점수를 $-\\infty$ 로 바꾸면 softmax 후 0 이 되어 위치 $i$ 는 $0..i$ 만 참조',
      notes: [
        { target: 'mask', tex: '$j>i$', note: '현재보다 오른쪽 위치.\n하삼각만 남기는 이유는 자기회귀 순서를 보존하기 위해서' },
      ] },
  ],
};

export default function SelfAttnDetailScene() {
  return <Scene spec={SPEC} />;
}
