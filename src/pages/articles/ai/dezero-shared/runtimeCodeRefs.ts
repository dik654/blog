import type { CodeRef, FileNode } from '@/components/code/types';
import autodiffSource from '../../../../../examples/dezero-rs/src/autodiff.rs?raw';
import nnSource from '../../../../../examples/dezero-rs/src/nn.rs?raw';
import sequenceSource from '../../../../../examples/dezero-rs/src/sequence.rs?raw';
import autodiffTestSource from '../../../../../examples/dezero-rs/tests/autodiff_contract.rs?raw';
import nnTestSource from '../../../../../examples/dezero-rs/tests/nn_contract.rs?raw';
import sequenceTestSource from '../../../../../examples/dezero-rs/tests/sequence_contract.rs?raw';

function highlight(source: string, needle: string, length = 10): [number, number] {
  const index = source.split('\n').findIndex((line) => line.includes(needle));
  const start = index < 0 ? 1 : index + 1;
  return [start, Math.min(source.split('\n').length, start + length - 1)];
}

function ref(
  path: string,
  source: string,
  needle: string,
  length: number,
  desc: string,
): CodeRef {
  return {
    path,
    code: source,
    highlight: highlight(source, needle, length),
    lang: 'rust',
    desc,
  };
}

export const runtimeCodeRefs: Record<string, CodeRef> = {
  'autodiff-value': ref(
    'dezero-rs/src/autodiff.rs',
    autodiffSource,
    'pub struct Value',
    22,
    'Value handle은 Rc<RefCell<Node>>를 공유한다. 데이터, gradient, creator와 generation이 같은 allocation에 남아 공유 subgraph에서도 identity가 유지된다.',
  ),
  'autodiff-apply': ref(
    'dezero-rs/src/autodiff.rs',
    autodiffSource,
    'fn apply(',
    25,
    'Operation generation은 입력 중 최댓값이고 출력 generation은 거기에 1을 더한다. 출력만 creator를 강하게 소유하며 operation은 output을 Weak로 보관한다.',
  ),
  'autodiff-backward': ref(
    'dezero-rs/src/autodiff.rs',
    autodiffSource,
    'pub fn backward(',
    48,
    '높은 generation부터 operation을 꺼내 local backward를 실행한다. 기울기를 더한 뒤 각 입력 creator를 다시 enqueue하므로 한 층에서 멈추지 않는다.',
  ),
  'autodiff-no-grad': ref(
    'dezero-rs/src/autodiff.rs',
    autodiffSource,
    'pub fn no_grad',
    8,
    'RAII guard가 이전 recording 상태를 기억했다가 scope 종료 시 복원한다. 중첩되거나 panic unwind가 일어나도 전역 상태를 그대로 남기지 않는다.',
  ),
  'autodiff-tests': ref(
    'dezero-rs/tests/autodiff_contract.rs',
    autodiffTestSource,
    'fn shared_multilevel',
    31,
    '공유 DAG의 누적값 60, x³의 이차 미분 12, no_grad 복원과 Weak output 수명까지 실행 결과로 닫는다.',
  ),
  'nn-linear': ref(
    'dezero-rs/src/nn.rs',
    nnSource,
    'impl Layer for Linear',
    38,
    'Linear는 입력 feature 수를 먼저 검사하고, 같은 Parameter handle로 xW+b graph를 만든다. parameters()는 optimizer가 갱신할 실제 소유 대상을 노출한다.',
  ),
  'nn-unique': ref(
    'dezero-rs/src/nn.rs',
    nnSource,
    'pub fn unique_parameters',
    24,
    'Parameter 값이 아니라 Rc pointer identity로 중복을 제거한다. 같은 parameter가 두 layer 경로에서 발견돼도 zero_grad와 update는 한 번만 실행한다.',
  ),
  'nn-step': ref(
    'dezero-rs/src/nn.rs',
    nnSource,
    'impl Sgd',
    18,
    'SGD는 deduplicate된 parameter의 현재 gradient만 읽어 data를 갱신한다. Forward graph 구성과 optimizer state 변경의 책임을 분리한다.',
  ),
  'nn-mse': ref(
    'dezero-rs/src/nn.rs',
    nnSource,
    'pub fn mean_squared_error',
    14,
    'MSE는 새 backward 함수를 손으로 만들지 않고 기존 sub, pow, add, div operation을 합성한다.',
  ),
  'nn-tests': ref(
    'dezero-rs/tests/nn_contract.rs',
    nnTestSource,
    'fn a_full_step',
    39,
    '2→3→2→1 모델의 한 SGD step이 손실을 낮추는지, 중복 handle을 한 번만 갱신하는지, 잘못된 shape가 즉시 실패하는지 검증한다.',
  ),
  'sequence-lstm': ref(
    'dezero-rs/src/sequence.rs',
    sequenceSource,
    'pub struct LstmCell',
    48,
    'LSTM step은 hidden과 cell을 명시적 입력·출력으로 다룬다. Cell path에는 forget gate가 곱해지고 새 candidate가 input gate를 거쳐 더해진다.',
  ),
  'sequence-state': ref(
    'dezero-rs/src/sequence.rs',
    sequenceSource,
    'pub fn detach_state',
    18,
    'detach는 숫자를 유지한 새 leaf로 graph만 끊고, reset은 숫자 자체를 0으로 바꾼다. 두 경계는 서로 대체할 수 없다.',
  ),
  'sequence-layernorm': ref(
    'dezero-rs/src/sequence.rs',
    sequenceSource,
    'pub struct LayerNorm',
    55,
    '한 sample 위치의 마지막 feature slice에서 mean과 variance를 구한 뒤 normalize하고 feature별 gamma와 beta를 적용한다.',
  ),
  'sequence-dropout': ref(
    'dezero-rs/src/sequence.rs',
    sequenceSource,
    'pub fn inverted_dropout',
    20,
    '보존된 원소는 1/(1-p)로 scale하고 제거된 원소는 0 graph를 만든다. Inverted dropout이 보존하는 것은 mask 평균에 대한 기댓값이다.',
  ),
  'sequence-embedding': ref(
    'dezero-rs/src/sequence.rs',
    sequenceSource,
    'pub struct Embedding',
    43,
    'Lookup은 선택한 row의 Value handle을 clone한다. 같은 token id가 반복되면 동일한 leaf에 여러 경로가 도착해 autodiff의 누적 규칙이 scatter-add를 만든다.',
  ),
  'sequence-tests': ref(
    'dezero-rs/tests/sequence_contract.rs',
    sequenceTestSource,
    'fn reset_changes',
    65,
    'detach/reset, forget-gate 곱, LayerNorm 축, dropout 기댓값과 반복 token gradient를 각각 독립 contract로 검증한다.',
  ),
};

export const runtimeFileTree: FileNode = {
  name: 'dezero-rs',
  type: 'dir',
  children: [
    {
      name: 'src',
      type: 'dir',
      children: [
        { name: 'autodiff.rs', type: 'file', path: 'dezero-rs/src/autodiff.rs', codeKey: 'autodiff-value' },
        { name: 'nn.rs', type: 'file', path: 'dezero-rs/src/nn.rs', codeKey: 'nn-linear' },
        { name: 'sequence.rs', type: 'file', path: 'dezero-rs/src/sequence.rs', codeKey: 'sequence-lstm' },
      ],
    },
    {
      name: 'tests',
      type: 'dir',
      children: [
        { name: 'autodiff_contract.rs', type: 'file', path: 'dezero-rs/tests/autodiff_contract.rs', codeKey: 'autodiff-tests' },
        { name: 'nn_contract.rs', type: 'file', path: 'dezero-rs/tests/nn_contract.rs', codeKey: 'nn-tests' },
        { name: 'sequence_contract.rs', type: 'file', path: 'dezero-rs/tests/sequence_contract.rs', codeKey: 'sequence-tests' },
      ],
    },
  ],
};
