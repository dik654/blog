import { CodeViewButton } from '@/components/code';
import { specDecodeCodeRefs } from '../vllm-serving/codeRefsSpecDecode';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function DraftVerify({ onCodeRef }: Props) {
  return (
    <section id="draft-verify" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Draft-Verify 파이프라인</h2>
        <div className="flex gap-2">
          <CodeViewButton
            onClick={() => onCodeRef('spec-eagle-propose', specDecodeCodeRefs['spec-eagle-propose'])}
            label="propose()"
          />
          <CodeViewButton
            onClick={() => onCodeRef('spec-rejection-sampler', specDecodeCodeRefs['spec-rejection-sampler'])}
            label="RejectionSampler"
          />
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Draft 단계: propose()</h3>
        <p>
          EAGLE의 <code>propose()</code>는 Target 모델의 hidden_states를 입력받습니다.<br />
          EAGLE3의 경우 <code>combine_hidden_states()</code>로 feature 차원을 변환한 뒤,
          경량 드래프트 모델의 forward pass를 실행합니다.
        </p>
        <ol>
          <li><code>set_inputs_first_pass()</code> — 입력 텐서 + 어텐션 메타데이터 준비</li>
          <li><code>build_per_layer_attn_metadata()</code> — 레이어별 어텐션 설정</li>
          <li>CUDAGraph 배치 결정 + 모델 실행</li>
          <li><code>token_indices_to_sample</code> 위치에서 hidden states 추출</li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">Verify 단계: RejectionSampler</h3>
        <p>
          Target 모델이 Draft 토큰 전체를 한 번에 forward하여 각 위치의 확률을 계산합니다.<br />
          RejectionSampler가 Draft와 Target의 확률을 비교하여 수용/거부를 결정합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3종류의 출력 토큰</h3>
        <ul>
          <li>
            <strong>Accepted</strong> — <code>draft_prob[t] / target_prob[t]</code> 비율로 확률적 수용.
            Greedy 모드에서는 target argmax와 일치하면 무조건 수용
          </li>
          <li>
            <strong>Recovered</strong> — 거부된 위치에서 <code>max(0, target_prob - draft_prob)</code>을
            정규화한 분포로 재샘플링
          </li>
          <li>
            <strong>Bonus</strong> — 모든 K개가 수용되면 K+1번째 토큰을 target만으로 생성
          </li>
        </ul>

        <p>
          이 알고리즘은 Leviathan et al. 2022 논문을 정확히 구현하며,
          <strong>출력 분포가 target 모델과 수학적으로 동일</strong>함이 보장됩니다.
        </p>
      </div>
    </section>
  );
}
