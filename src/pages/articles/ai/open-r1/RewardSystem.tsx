import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { Misconception } from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { codeRefs } from './codeRefs';
import RewardPipelineViz from './viz/RewardPipelineViz';

const registryGroups = [
  ['정답 계약', 'accuracy', 'Gold와 completion의 수학적 동치처럼 최종 task 성공을 본다.'],
  ['구조 계약', 'format · tag_count · code_format', 'Downstream parser가 읽을 수 있는 출력 구조를 본다. 내용의 진실성은 별개다.'],
  ['과정 proxy', 'reasoning_steps', '표현상 step 패턴을 세는 약한 proxy다. 실제 reasoning quality와 동일하지 않다.'],
  ['탐색 규제', 'cosine · repetition · length · soft_overlong', '정답 여부와 길이·반복을 함께 보되, coefficient가 행동을 어떻게 왜곡하는지 관찰한다.'],
  ['실행 검증', 'code · binary_code · ioi_code · cf_code', '격리된 sandbox에서 test를 실행해 프로그램 행동을 채점한다.'],
] as const;

export default function RewardSystem({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="reward-system" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Reward registry는 목표 함수가 아니라 검증 계약의 조립판이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Official <code>rewards.py</code>는 하나의 고정 reward를 강제하지 않는다. Config의 <code>reward_funcs</code>가 registry에서 함수를 고르고,
          trainer config의 <code>reward_weights</code>가 그 결과를 결합한다. 1.5B demo recipe는 accuracy·format·tag_count에 각각 1.0을 주지만,
          이것은 해당 recipe의 선택이지 Open-R1 전체의 보편 공식이 아니다.
        </p>
        <M display>{String.raw`R_i=\sum_{k\in\underbrace{\mathcal K}_{\text{config가 고른 verifier 집합}}}\underbrace{w_k}_{\text{k번째 신호의 가중치}}\underbrace{r_k(o_i)}_{\text{completion }o_i\text{의 검증 결과}}`}</M>
        <FormulaNote
          meaning="왜 여러 verifier를 하나의 수로 합치나: GRPO advantage는 completion마다 비교 가능한 scalar가 필요하기 때문이다. 그러나 합산하면 어느 verifier가 상승을 만들었는지 가려질 수 있으므로 raw signal과 weighted total을 모두 log해야 한다."
          symbols={[
            ['R_i', 'i번째 completion이 GRPO group 비교에 넘기는 최종 reward'],
            ['K', '이번 run의 config에서 실제 선택한 verifier 이름 집합'],
            ['w_k', 'k번째 verifier가 최종 reward에 미치는 상대적 비중'],
            ['r_k(o_i)', 'k번째 verifier가 completion o_i를 검사한 원시 결과'],
          ]}
        />
      </div>

      <RewardPipelineViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Registry에 함수가 있다는 것과 이번 run에 연결됐다는 것은 다르다</h3>
        <p>
          새 reward 이름을 코드에 추가해도 config의 <code>reward_funcs</code>에 넣지 않으면 policy를 움직이지 않는다. 반대로 함수 순서와
          <code>reward_weights</code> 순서가 어긋나면 의도하지 않은 신호가 큰 weight를 받는다. Run manifest에는 이름·version·weight·parser setting과
          sandbox provider까지 남겨야 한다.
        </p>
      </div>
      <div className="not-prose mt-6 border-y border-border">
        {registryGroups.map(([category, names, meaning]) => (
          <div key={category} className="grid gap-2 border-b border-border py-4 last:border-b-0 md:grid-cols-[8rem_17rem_minmax(0,1fr)] md:gap-4">
            <span className="text-xs font-black text-muted-foreground">{category}</span>
            <code className="break-words text-xs font-bold [overflow-wrap:anywhere]">{names}</code>
            <p className="text-sm leading-6 text-muted-foreground">{meaning}</p>
          </div>
        ))}
      </div>

      {onCodeRef && (
        <div className="not-prose my-6 flex flex-wrap items-center gap-3 border-y border-border py-4">
          <CodeViewButton onClick={() => onCodeRef('r1-rewards-accuracy', codeRefs['r1-rewards-accuracy'])} />
          <CodeViewButton onClick={() => onCodeRef('r1-rewards-format', codeRefs['r1-rewards-format'])} />
          <p className="basis-full text-xs leading-5 text-muted-foreground">
            교육용 excerpt는 parser 실패를 별도 상태로 보이게 하고, format 계약과 sandbox 실행 경계를 분리한다.
            <strong className="ml-1 text-foreground">구현 함정:</strong> <code>^/$</code>에 <code>MULTILINE</code>과 <code>search</code>를 함께 쓰면
            별도 줄의 앞뒤 garbage를 남긴 응답도 내부 구간만 일치해 통과할 수 있다. 전체 completion을 강제하려면 입력 정규화 뒤
            <code>fullmatch</code> 또는 <code>\A…\Z</code> 경계를 사용하고 adversarial fixture로 검증한다.
          </p>
        </div>
      )}

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>검증 실패와 오답을 관측 단계에서 분리한다</h3>
        <p>
          Gold LaTeX를 parse하지 못한 sample과 model이 실제로 틀린 sample은 학습 점수로는 모두 0이 될 수 있다. 하지만 운영 log에서는
          <strong> invalid_gold, invalid_completion, verified_wrong</strong>을 분리해야 한다. 그렇지 않으면 dataset 파서가 망가져도 “어려운 문제라 reward가 낮다”고 오판한다.
          Invalid gold는 학습 queue에서 격리해 사람이 원문을 확인하고 dataset version을 새로 만든다.
        </p>
        <h3>Code reward는 model output을 실행하는 보안 경계다</h3>
        <p>
          Candidate program을 trainer process나 shared filesystem에서 직접 실행하면 network credential, dataset, checkpoint와 cluster 권한이 공격 표면이 된다.
          Official Open-R1은 E2B·Morph·Piston 계열 sandbox provider를 통해 실행하는 경로를 제공한다. Sandbox에는 CPU·memory·wall time·network·filesystem 제한과
          test isolation을 두고, timeout과 infrastructure error를 wrong answer와 별도 metric으로 남겨야 한다.
        </p>
      </div>

      <Misconception>
        Reward 함수를 더 많이 더하면 실제 목표에 자동으로 가까워지지 않는다. Format과 tag count처럼 상관된 신호는 같은 표면 행동을 두 번 셀 수 있고,
        reasoning step 수나 길이를 직접 보상하면 정답보다 장황함을 최적화할 수 있다.
      </Misconception>
    </section>
  );
}
