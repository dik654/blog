import type { CodeRef } from '@/components/code/types';

import sftPy from './codebase/open-r1/src/open_r1/sft.py?raw';
import grpoPy from './codebase/open-r1/src/open_r1/grpo.py?raw';
import rewardsPy from './codebase/open-r1/src/open_r1/rewards.py?raw';
import generatePy from './codebase/open-r1/src/open_r1/generate.py?raw';

export const codeRefs: Record<string, CodeRef> = {
  'r1-sft-main': {
    path: 'open-r1/src/open_r1/sft.py',
    code: sftPy,
    lang: 'python',
    highlight: [15, 50],
    desc: '교육용 excerpt · 공식 sft.py의 config, checkpoint, tokenizer/template, trainer, EOS 저장 순서를 보존한다.',
    annotations: [
      { lines: [15, 21], color: 'sky', note: 'Checkpoint를 먼저 찾는 이유: model weight뿐 아니라 optimizer·scheduler state까지 같은 run으로 이어야 한다.' },
      { lines: [23, 30], color: 'emerald', note: 'Dataset보다 tokenizer/template을 함께 읽는 이유: 실제 loss target은 직렬화된 token sequence이기 때문이다.' },
      { lines: [32, 42], color: 'amber', note: 'Trainer 연결부가 train/eval split과 processing contract를 소유한다.' },
      { lines: [44, 50], color: 'violet', note: '저장 때 EOS를 맞추는 이유: 낮은 SFT loss와 올바른 generation stop은 자동으로 같은 조건이 아니다.' },
    ],
  },

  'r1-grpo-main': {
    path: 'open-r1/src/open_r1/grpo.py',
    code: grpoPy,
    lang: 'python',
    highlight: [16, 61],
    desc: '교육용 excerpt · 공식 grpo.py의 conversation, reward registry, GRPOTrainer와 checkpoint lifecycle을 보존한다.',
    annotations: [
      { lines: [23, 28], color: 'violet', note: 'Reward registry를 config에서 고르는 이유: 코드에 존재하는 함수와 이번 run에 연결된 신호를 분리한다.' },
      { lines: [30, 41], color: 'sky', note: 'Prompt column만 conversation으로 만드는 이유: gold solution이 model input으로 새는 leakage를 막는다.' },
      { lines: [43, 55], color: 'emerald', note: 'G개 generation, verifier, group advantage와 policy update의 ownership이 trainer에 모인다.' },
      { lines: [57, 61], color: 'amber', note: 'Online RL도 resume 가능한 state와 generation EOS를 함께 저장해야 재현 가능하다.' },
    ],
  },

  'r1-rewards-accuracy': {
    path: 'open-r1/src/open_r1/rewards.py',
    code: rewardsPy,
    lang: 'python',
    highlight: [9, 24],
    desc: '교육용 excerpt · 수학 parser와 verifier가 성공·실패를 scalar reward로 바꾸는 최소 경계.',
    annotations: [
      { lines: [9, 18], color: 'sky', note: 'Parse exception을 잡는 이유: malformed output 하나가 distributed training process를 중단하지 않게 한다.' },
      { lines: [20, 24], color: 'emerald', note: '검증 불가와 verified wrong은 둘 다 0점일 수 있지만 운영 metric에서는 별도 상태로 기록해야 한다.' },
      { lines: [47, 55], color: 'amber', note: 'Code reward가 외부 sandbox를 쓰는 이유: model output에 trainer host 권한을 주지 않는다.' },
    ],
  },

  'r1-rewards-format': {
    path: 'open-r1/src/open_r1/rewards.py',
    code: rewardsPy,
    lang: 'python',
    highlight: [27, 44],
    desc: '교육용 excerpt · format/tag contract와 config-selected registry를 분리한다.',
    annotations: [
      { lines: [27, 36], color: 'sky', note: '구현 함정: ^/$에 MULTILINE과 search를 함께 쓰면 별도 줄의 앞뒤 garbage를 남긴 채 내부 한 줄 구간만 통과할 수 있다. 전체 completion 계약에는 fullmatch 또는 \\A…\\Z가 필요하다.' },
      { lines: [39, 44], color: 'emerald', note: 'Tag count는 parser 안정성의 보조 신호일 뿐 reasoning 사실성의 증거가 아니다.' },
      { lines: [58, 68], color: 'violet', note: 'Config가 이름을 선택해야 실제 policy update에 연결된다.' },
    ],
  },

  'r1-generate-pipeline': {
    path: 'open-r1/src/open_r1/generate.py',
    code: generatePy,
    lang: 'python',
    highlight: [9, 40],
    desc: '교육용 excerpt · Distilabel client, vLLM endpoint, grouped generation과 versioned output의 경계.',
    annotations: [
      { lines: [17, 25], color: 'sky', note: 'Generation endpoint를 분리하면 teacher serving resource와 dataset client resource를 따로 확장할 수 있다.' },
      { lines: [26, 30], color: 'emerald', note: '같은 prompt의 여러 answer를 묶는 이유: group provenance와 sampling configuration을 보존한다.' },
      { lines: [35, 40], color: 'amber', note: 'Cache 정책과 output repository를 run manifest에 남겨 재생성 여부를 설명한다.' },
    ],
  },
};
