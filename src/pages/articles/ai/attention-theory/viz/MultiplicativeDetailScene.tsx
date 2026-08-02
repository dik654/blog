/**
 * Multiplicative attention detail Scene.
 * Scaled dot-product 의 분산, softmax, Luong 변형을 한 흐름으로 정리.
 */

import { Scene } from '@/components/scene/Scene';
import type { Scene as SceneSpec } from '@/components/scene/types';

const SPEC: SceneSpec = {
  id: 'multiplicative-detail',
  title: 'Luong → Scaled Dot-Product 전체 흐름',
  caption: '내적 점수의 스케일을 맞추고 softmax 후 value 를 가중합',

  objects: [
    { id: 'Q', kind: 'matrix', shape: [4, 64], label: 'Q', role: 'input',
      description: '디코더 또는 현재 토큰들의 query 행렬',
      why: '각 행이 한 위치의 query.\n한 번의 행렬 곱으로 모든 query-key 쌍 점수를 계산하기 위해 행렬로 묶음' },
    { id: 'K', kind: 'matrix', shape: [4, 64], label: 'K', role: 'input',
      description: '비교 대상 key 행렬' },
    { id: 'V', kind: 'matrix', shape: [4, 64], label: 'V', role: 'input',
      description: '가중합으로 전달될 value 행렬' },
    { id: 'sqrtDk', kind: 'scalar', values: 8, label: '√d_k', role: 'input',
      description: '$d_k=64$ 일 때의 스케일 값',
      why: '내적 값의 표준편차가 대략 $\\sqrt{d_k}$ 로 커짐.\n이 값으로 나누면 softmax 입력 폭이 안정됨' },
    { id: 'Wlocal', kind: 'matrix', shape: [4, 4], label: 'local window', role: 'param',
      description: 'Luong local attention 의 참조 윈도우',
      why: 'global 은 모든 위치를 봄.\nlocal 은 예측한 중심 근처만 보도록 제한해 긴 시퀀스 비용을 줄임' },
    { id: 'prevC', kind: 'vector', shape: [4], label: 'c_{t-1}', role: 'input',
      description: '이전 step 의 context',
      why: 'input-feeding 은 이전 attention 결정 결과를 다음 디코더 입력에 다시 넣음.\n정렬이 어디까지 진행됐는지 기억하는 단서가 됨' },
    { id: 'yt', kind: 'vector', shape: [4], label: 'y_t', role: 'input',
      description: '현재 디코더 입력 토큰 표현' },

    { id: 'rawScores', kind: 'matrix', shape: [4, 4], label: 'QK^T', role: 'intermediate',
      description: '모든 query-key 쌍의 raw 점수' },
    { id: 'scaledScores', kind: 'matrix', shape: [4, 4], label: 'S/√d_k', role: 'intermediate',
      description: '분산을 낮춘 score 행렬' },
    { id: 'A', kind: 'matrix', shape: [4, 4], label: 'A', role: 'intermediate',
      description: '각 행이 합 1 인 attention 분포' },
    { id: 'C', kind: 'matrix', shape: [4, 64], label: 'A·V', role: 'output',
      description: '각 query 위치별 context 출력' },
    { id: 'localScores', kind: 'matrix', shape: [4, 4], label: 'local(A)', role: 'intermediate',
      description: '윈도우 밖을 제한한 attention 분포' },
    { id: 'fedInput', kind: 'vector', shape: [8], label: '[y_t; c_{t-1}]', role: 'output',
      description: '이전 context 를 붙인 다음 디코더 입력' },
  ],

  transitions: [
    { t: 0, op: 'matmul', inputs: ['Q', 'K'], produces: 'rawScores',
      caption: '$\\mathrm{rawScores} = QK^T$',
      why: '가장 단순한 multiplicative score 는 query 하나와 key 하나의 내적.\n행렬로 묶으면 모든 위치 쌍의 내적을 한 번에 계산.\n그래서 Luong 방식은 MLP 점수보다 GPU 병렬화에 잘 맞음',
      notes: [
        { tex: '$QK^T$', note: '$Q$ 의 각 행과 $K$ 의 각 행을 모두 비교해 $n\\times n$ 점수표를 만듦' },
      ] },
    { t: 1, op: 'scale', inputs: ['rawScores', 'sqrtDk'], produces: 'scaledScores',
      payload: { by: '1/sqrt(d_k)' },
      caption: '$\\mathrm{scaledScores} = \\frac{\\mathrm{rawScores}}{\\sqrt{d_k}}$',
      why: '가장 단순한 내적은 차원이 커질수록 더 큰 값으로 퍼짐.\n$d_k=64$ 면 표준편차가 약 8 이라 softmax 입력이 쉽게 커짐.\n8 로 나누면 [10,1,1] 같은 포화 입력이 [1,0.1,0.1] 처럼 부드러운 범위로 돌아옴',
      notes: [
        { target: 'sqrtDk', tex: '$\\sqrt{d_k}$', note: '$\\mathrm{Var}(Q\\cdot K)=d_k$.\n분산 폭증의 원인이 차원 수라서 그 표준편차로 나눔' },
      ] },
    { t: 2, op: 'softmax', inputs: ['scaledScores'], produces: 'A',
      caption: '$A = \\mathrm{softmax}(\\mathrm{scaledScores})$',
      why: '점수 행렬만으로는 어느 value 를 얼마나 섞을지 정할 수 없음.\nsoftmax 를 행별로 적용하면 각 query 위치마다 합 1 인 선택 분포가 생김.\n스케일링 덕분에 거의 one-hot 으로 굳기 전에 학습 가능' },
    { t: 3, op: 'matmul', inputs: ['A', 'V'], produces: 'C',
      caption: '$C = A V$',
      why: '분포 $A$ 로 value 행렬을 평균.\n각 출력 행은 해당 query 가 모든 value 를 어떤 비율로 읽은 결과.\n한 value 만 고르면 hard retrieval 이고, attention 은 여러 value 를 섞는 soft retrieval' },
    { t: 4, op: 'mask', inputs: ['A', 'Wlocal'], produces: 'localScores',
      caption: '$A_{local} = \\mathrm{mask}(A,\\ \\mathrm{window})$',
      why: 'global attention 은 모든 위치를 참조하는 기본형.\nLuong local attention 은 중심 주변 윈도우만 남겨 긴 입력에서 계산과 노이즈를 줄임.\n윈도우가 전체 길이면 다시 global 로 돌아감',
      notes: [
        { target: 'Wlocal', tex: '$\\mathrm{window}$', note: '참조 가능한 위치 제한.\n밖의 점수는 제외하거나 매우 작은 값으로 바꿔 softmax 후 거의 0 이 되게 함' },
      ] },
    { t: 5, op: 'concat', inputs: ['yt', 'prevC'], produces: 'fedInput',
      caption: '$\\tilde y_t = [y_t; c_{t-1}]$',
      why: 'Luong input-feeding 은 이전 context 를 다음 입력에 붙임.\n가장 단순한 decoder 는 현재 토큰 입력만 보지만, 이 방식은 직전 attention 결정도 함께 봄.\n그래서 정렬이 반복되거나 건너뛰는 문제를 줄이는 단서가 됨',
      notes: [
        { target: 'prevC', tex: '$c_{t-1}$', note: '직전 step 이 입력 어디를 봤는지 압축한 벡터' },
      ] },
  ],
};

export default function MultiplicativeDetailScene() {
  return <Scene spec={SPEC} />;
}
