import type { CodeRef } from '@/components/code/types';
import eaglePy from './codebase/vllm/v1/spec_decode/eagle.py?raw';
import draftModelPy from './codebase/vllm/v1/spec_decode/draft_model.py?raw';
import rejectionSamplerPy from './codebase/vllm/v1/sample/rejection_sampler.py?raw';

export const specDecodeCodeRefs: Record<string, CodeRef> = {
  'spec-eagle-proposer': {
    path: 'vllm/v1/spec_decode/eagle.py',
    code: eaglePy,
    lang: 'python',
    highlight: [60, 118],
    annotations: [
      { lines: [60, 79], color: 'sky',     note: 'SpecDecodeBaseProposer.__init__ — draft 모델 설정, 토큰 수 결정' },
      { lines: [81, 96], color: 'emerald', note: 'hidden_size + parallel_drafting + extra_slots 계산' },
      { lines: [107, 112], color: 'amber',  note: 'max_batch_size, max_num_tokens 제한 — 스케줄러와 동기화' },
    ],
    desc:
`문제: Draft 모델의 설정은 Target 모델과 어떻게 다를까요?

해결: SpecDecodeBaseProposer는 Target과 별개의 hidden_size를 가집니다.
EAGLE 3은 feature-level draft로, Target의 hidden states를 입력받아
경량 모델이 K개 토큰을 한 번에 예측합니다.
parallel_drafting 모드에서는 K개 슬롯을 동시에 사용합니다.`,
  },

  'spec-eagle-propose': {
    path: 'vllm/v1/spec_decode/eagle.py',
    code: eaglePy,
    lang: 'python',
    highlight: [400, 480],
    annotations: [
      { lines: [400, 418], color: 'sky',     note: 'propose() — target hidden states를 받아 draft 토큰 생성' },
      { lines: [421, 433], color: 'emerald', note: 'EAGLE3: combine_hidden_states로 feature 변환' },
      { lines: [435, 445], color: 'amber',   note: 'set_inputs_first_pass — 입력 준비 + 어텐션 메타데이터' },
      { lines: [459, 474], color: 'violet',  note: 'forward_context + 모델 실행 → last_hidden_states 추출' },
    ],
    desc:
`문제: EAGLE은 어떻게 target 모델의 feature를 활용해 draft할까요?

해결: propose()는 target의 hidden_states를 입력으로 받습니다.
① EAGLE3의 combine_hidden_states()로 feature 차원 변환
② set_inputs_first_pass()로 어텐션 메타데이터 구성
③ 경량 드래프트 모델의 forward pass → 다음 토큰 확률 추출
④ 이를 num_speculative_tokens 횟수만큼 자기회귀 반복`,
  },

  'spec-draft-model': {
    path: 'vllm/v1/spec_decode/draft_model.py',
    code: draftModelPy,
    lang: 'python',
    highlight: [17, 88],
    annotations: [
      { lines: [17, 31], color: 'sky',     note: 'DraftModelProposer — 독립 소형 모델 기반 draft' },
      { lines: [33, 51], color: 'emerald', note: 'vocab_size 일치 + TP 일치 검증 (불일치 시 에러)' },
      { lines: [68, 78], color: 'amber',   note: '_get_model — "draft_model" 태그로 별도 컴파일 캐시' },
      { lines: [80, 88], color: 'violet',  note: '임베딩/lm_head 공유 안 함 — 독립 모델의 특성' },
    ],
    desc:
`문제: EAGLE 말고 독립 소형 모델로 draft하는 방식은?

해결: DraftModelProposer는 Llama-7B 같은 별도 모델을 로드합니다.
vocab_size와 TP(텐서 병렬) 크기가 target과 동일해야 합니다.
EAGLE과 달리 임베딩/lm_head를 공유하지 않아 메모리를 더 사용하지만,
별도 아키텍처를 사용할 수 있는 유연성이 있습니다.`,
  },

  'spec-rejection-sampler': {
    path: 'vllm/v1/sample/rejection_sampler.py',
    code: rejectionSamplerPy,
    lang: 'python',
    highlight: [30, 100],
    annotations: [
      { lines: [30, 51], color: 'sky',     note: 'RejectionSampler — 수용/복원/보너스 토큰 3종류' },
      { lines: [60, 68], color: 'emerald', note: 'forward() 시그니처 — draft_probs + target logits 입력' },
      { lines: [69, 90], color: 'amber',   note: '알고리즘 출처: Leviathan et al. 2022 (Speculative Decoding 원논문)' },
    ],
    desc:
`문제: Draft 토큰을 어떤 기준으로 수용/거부할까요?

해결: RejectionSampler는 세 종류의 토큰을 생성합니다.
① accepted — draft_prob / target_prob 비율로 확률적 수용
② recovered — 거부된 위치에서 (target - draft) 분포로 재샘플링
③ bonus — 모든 draft가 수용되면 target만으로 추가 토큰 생성
최종 출력 = accepted + recovered + bonus (원논문 알고리즘 정확 구현)`,
  },
};
