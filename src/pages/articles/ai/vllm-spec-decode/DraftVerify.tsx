import { CodeViewButton } from '@/components/code';
import { specDecodeCodeRefs } from '../vllm-serving/codeRefsSpecDecode';
import type { CodeRef } from '@/components/code/types';
import SpecDraftPipelineViz from './viz/SpecDraftPipelineViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function DraftVerify({ onCodeRef }: Props) {
  return (
    <section id="draft-verify" className="mb-16 scroll-mt-20">
      <div className="mb-6 grid min-w-0 gap-3 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Draft-Verify 파이프라인</h2>
        <div className="flex min-w-0 flex-wrap gap-2">
          <CodeViewButton
            onClick={() => onCodeRef('spec-eagle-propose', specDecodeCodeRefs['spec-eagle-propose'])}
            label="propose()"
          />
          <CodeViewButton
            onClick={() => onCodeRef('spec-eagle-proposer', specDecodeCodeRefs['spec-eagle-proposer'])}
            label="Proposer init"
          />
          <CodeViewButton
            onClick={() => onCodeRef('spec-rejection-sampler', specDecodeCodeRefs['spec-rejection-sampler'])}
            label="RejectionSampler"
          />
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Proposer를 고르고도 scheduler 장부가 남는다</h3>
        <p>
          후보를 만드는 방법은 하나가 아닙니다. EAGLE은 target의 hidden state를 재사용하고,
          독립 draft model은 더 작은 언어 모델을 별도로 실행합니다. <strong>n-gram proposer</strong>는
          추가 모델 없이 현재 prompt와 최근 token에서 같은 문자열 패턴을 찾아 다음 token을 제안하므로
          GPU model memory를 더 쓰지 않지만, 반복 패턴이 적은 요청에서는 제안 품질이 낮아질 수 있습니다.
        </p>
        <p>
          어느 proposer를 쓰든 scheduler는 후보를 <code>spec_token_ids</code>로 들고 있고,
          이번 step의 계산량에는 <code>num_tokens_with_spec</code>를 반영합니다. 검증이 끝나면
          <code>update_from_output()</code>이 거부된 suffix만큼 <code>num_computed_tokens</code>를 되돌립니다.
          즉 속도 기법도 KV state와 token 장부의 commit 규칙을 건너뛸 수 없습니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Draft 단계: propose()</h3>
        <p>
          EAGLE의 <code>propose()</code>는 Target 모델의 hidden_states를 입력받습니다.<br />
          여러 target layer의 hidden state를 함께 쓰도록 확장한 <strong>EAGLE3</strong>의 경우
          <code>combine_hidden_states()</code>로 feature 차원을 변환한 뒤,
          경량 드래프트 모델의 forward pass를 실행합니다.
        </p>
        <SpecDraftPipelineViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Verify 단계: RejectionSampler</h3>
        <p>
          Target 모델이 Draft 토큰 전체를 한 번에 forward하여 각 위치의 확률을 계산합니다.<br />
          RejectionSampler가 Draft와 Target의 확률을 비교하여 수용/거부를 결정합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3종류의 출력 토큰</h3>
        <ul>
          <li>
            <strong>Accepted</strong> — <code>min(1, target_prob[t] / draft_prob[t])</code> 비율로 확률적 수용.
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
          이 acceptance와 recovery 규칙은 Leviathan et al.의 분포 보존 알고리즘을 따릅니다.
          수학적으로는 target distribution을 복원하지만, 실제 runtime에서는 hardware precision,
          batch 순서와 logprob 구현 차이 때문에 bitwise 동일성까지 보장한다고 읽어서는 안 됩니다.
        </p>
      </div>
    </section>
  );
}
