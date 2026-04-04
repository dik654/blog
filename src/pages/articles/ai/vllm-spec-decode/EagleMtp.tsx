import { CodeViewButton } from '@/components/code';
import { specDecodeCodeRefs } from '../vllm-serving/codeRefsSpecDecode';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function EagleMtp({ onCodeRef }: Props) {
  return (
    <section id="eagle-mtp" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">EAGLE vs Draft Model vs MTP</h2>
        <CodeViewButton
          onClick={() => onCodeRef('spec-draft-model', specDecodeCodeRefs['spec-draft-model'])}
          label="DraftModelProposer"
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">EAGLE: Feature-Level Draft</h3>
        <p>
          EAGLE은 Target의 hidden states를 입력으로 받습니다.<br />
          토큰 수준이 아닌 feature 수준에서 draft하므로 수락률이 높습니다.
          <code>pass_hidden_states_to_model = True</code>로 Target → Draft 데이터 흐름이 발생합니다.
        </p>
        <p>
          EAGLE3은 <code>combine_hidden_states()</code>로 멀티 레이어 feature를 결합합니다.<br />
          이전 단계의 hidden states를 활용하여 더 정확한 예측이 가능합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">독립 Draft 모델</h3>
        <p>
          DraftModelProposer는 Target과 완전히 별개인 소형 모델을 사용합니다.
          <code>_maybe_share_embeddings()</code>와 <code>_maybe_share_lm_head()</code>가 모두
          no-op인 점이 핵심 — EAGLE과 달리 파라미터를 공유하지 않습니다.
        </p>
        <p>
          <strong>제약사항</strong>: vocab_size가 Target과 동일해야 하고,
          tensor_parallel_size도 같아야 합니다.<br />
          다른 TP 크기를 사용하면 torch compile 캐시가 충돌합니다 (소스 주석 L37-51).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Parallel Drafting</h3>
        <p>
          기존 auto-regressive draft는 K개 토큰을 순차 생성합니다.
          <code>parallel_drafting = True</code>이면 K개 슬롯을 동시에 할당하여
          한 번의 forward pass로 K개를 생성합니다.<br />
          DFlash(Qwen3 전용)가 이 방식을 사용합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">KV 캐시 슬롯 관리</h3>
        <p>
          Speculative Decoding은 추가 KV 캐시 슬롯이 필요합니다.
          <code>extra_slots_per_request</code>는 EAGLE에서 1(다음 토큰),
          parallel drafting에서 <code>num_speculative_tokens</code>입니다.<br />
          스케줄러의 <code>allocate_slots(num_lookahead_tokens=...)</code>와 연동되어
          미리 여분의 블록을 할당합니다.
        </p>
      </div>
    </section>
  );
}
