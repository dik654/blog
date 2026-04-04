import { CodeViewButton } from '@/components/code';
import { specDecodeCodeRefs } from '../vllm-serving/codeRefsSpecDecode';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Speculative Decoding 개요</h2>
        <CodeViewButton
          onClick={() => onCodeRef('spec-eagle-proposer', specDecodeCodeRefs['spec-eagle-proposer'])}
          label="SpecDecodeBaseProposer"
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Speculative Decoding(투기적 추론)은 LLM 추론의 <strong>지연 시간</strong>을 줄이는 기법입니다.<br />
          소형 Draft 모델이 K개 토큰을 빠르게 생성하고, 대형 Target 모델이 한 번에 검증합니다.<br />
          Draft가 정확하면 K개 토큰을 한 스텝에 확정 — 최대 2~3배 가속 가능합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">vLLM의 3가지 Draft 방식</h3>
        <ul>
          <li>
            <strong>EAGLE 1/3</strong> — Target의 hidden states를 입력으로 경량 모델이 feature-level draft.
            가장 높은 수락률 (2.5~3x 가속)
          </li>
          <li>
            <strong>독립 Draft 모델</strong> — Llama-70B + Llama-7B 같은 별도 소형 모델.
            DraftModelProposer 클래스로 구현
          </li>
          <li>
            <strong>n-gram</strong> — 모델 없이 입력 패턴 기반으로 추측.
            추가 GPU 메모리 불필요
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">스케줄러 통합</h3>
        <p>
          스케줄러는 <code>spec_token_ids</code>를 통해 Draft 토큰을 관리합니다.
          schedule()에서 <code>num_tokens_with_spec</code>으로 Draft 토큰 포함 전체 길이를 추적하고,
          update_from_output()에서 거부된 토큰만큼 <code>num_computed_tokens</code>를 롤백합니다.
        </p>
      </div>
    </section>
  );
}
