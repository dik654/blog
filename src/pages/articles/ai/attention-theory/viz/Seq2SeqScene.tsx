/**
 * Seq2Seq → Attention 의 전환 Scene.
 * primitives-first 패턴 (SPEC_WRITING.md):
 *   1) 단순 케이스 (Seq2Seq 의 fixed context)
 *   2) 새 조각 (attention 의 동적 context)
 *   3) 일반화 관계
 */

import { Scene } from '@/components/scene/Scene';
import type { Scene as SceneSpec } from '@/components/scene/types';

const SPEC: SceneSpec = {
  id: 'seq2seq-to-attention',
  title: 'Seq2Seq 의 정보 병목과 Attention 의 등장',
  caption: '인코더 hidden state 들이 어떻게 디코더로 전달되는지 — Seq2Seq 의 압축 vs Attention 의 가중합',

  objects: [
    { id: 'H', kind: 'group', label: 'H', children: ['h1', 'h2', 'h3', 'h4'] },
    { id: 'h1', kind: 'vector', shape: [4], label: 'h_1',
      description: '입력 토큰 1 의 인코더 hidden state' },
    { id: 'h2', kind: 'vector', shape: [4], label: 'h_2',
      description: '입력 토큰 2 의 인코더 hidden state' },
    { id: 'h3', kind: 'vector', shape: [4], label: 'h_3',
      description: '입력 토큰 3 의 인코더 hidden state' },
    { id: 'h4', kind: 'vector', shape: [4], label: 'h_4',
      description: '입력 토큰 4 의 인코더 hidden state' },
    { id: 's_t', kind: 'vector', shape: [4], label: 's_t', role: 'input',
      description: '현재 디코더 step 의 hidden state',
      why: '디코더가 지금 만들 토큰의 문맥.\n각 인코더 위치 $h_j$ 와 비교해 어디를 볼지 정함' },

    { id: 'c_fixed', kind: 'vector', shape: [4], label: 'c (fixed)', role: 'intermediate',
      description: 'Seq2Seq 의 단일 context 벡터',
      why: '인코더의 마지막 hidden state $h_T$ 하나를 디코더에 전달.\n모든 디코더 step 이 같은 $c$ 를 봄 — 입력 토큰 별 정보가 한 벡터에 압축됨.\n문장 길어지면 앞 토큰 정보 손실 (정보 병목)' },

    { id: 'α', kind: 'distribution', shape: [4], label: 'α_t', role: 'intermediate',
      description: '디코더 step $t$ 의 attention 가중치 (합 1)',
      why: '디코더 step 마다 새로 계산되는 분포.\n각 인코더 위치에 얼마나 비중을 둘지 결정' },

    { id: 'c_dyn', kind: 'vector', shape: [4], label: 'c_t', role: 'output',
      description: '디코더 step $t$ 의 동적 context — attention 가중합',
      why: '$c_t = \\sum_j \\alpha_{tj} \\cdot h_j$.\nseq2seq 의 fixed $c$ 는 $\\alpha = (0,0,...,1)$ (마지막 $h$ 만 보는) 특수 케이스.\n동적 $\\alpha$ 가 일반화 — 모든 step 이 모든 $h$ 를 가중치로 참조' },
  ],

  transitions: [
    { t: 0, op: 'project', inputs: ['H'], produces: 'c_fixed',
      caption: '$c = h_T$',
      why: '인코더 마지막 hidden state 만 가져옴.\n앞 토큰의 정보는 RNN 의 hidden state chain 으로 누적되었지만, $h_T$ 한 벡터에 모두 압축됨.\n긴 문장에서 손실 큼 — BLEU score 가 30 단어 이상에서 급락 (Cho 2014)' },

    { t: 1, op: 'softmax', inputs: ['s_t', 'H'], produces: 'α',
      caption: '$\\alpha_{tj} = \\mathrm{softmax}_j(\\mathrm{score}(s_t, h_j))$',
      why: '각 $h_j$ 와 디코더 상태 $s_t$ 의 유사도 점수를 softmax 로 분포화.\n매 디코더 step 마다 다시 계산되어 매번 다른 위치에 집중 가능.\nscore 함수 선택이 Bahdanau (MLP) / Luong (dot) 등 attention 변형들을 구분' },

    { t: 2, op: 'weighted-sum', inputs: ['α', 'H'], produces: 'c_dyn',
      caption: '$c_t = \\sum_j \\alpha_{tj} \\cdot h_j$',
      why: '$\\alpha_t$ 가중치로 인코더 출력들을 평균.\n결과 $c_t$ 는 "이 디코더 step 이 인코더 어디를 본 결과" — fixed $c$ 와 달리 매 step 다른 값.\n정보 병목 해소: 모든 $h_j$ 가 직접 접근 가능' },
  ],
};

export default function Seq2SeqScene() {
  return <Scene spec={SPEC} />;
}
