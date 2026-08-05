import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { ConceptPrimer, QuestionLead } from '@/components/learning/ArticleLearning';
import { codeRefs } from './codeRefs';
import E2EPipelineViz from './viz/E2EPipelineViz';

const goals = [
  ['01', 'Reasoning trace 증류', '강한 teacher가 만든 풀이를 검증·정제해 SFT로 전달한다. Open-R1의 350K Mixture-of-Thoughts와 OpenR1-Distill-7B가 이 단계의 공개 결과다.'],
  ['02', 'Pure RL 재현', 'Base model에서 정답 검증 보상만으로 reasoning 행동이 생기는지 본다. SFT를 반드시 거쳐야 한다는 주장이 아니라 별도 실험 축이다.'],
  ['03', '다단계 학습', 'Base → cold-start 또는 distillation SFT → GRPO → held-out evaluation을 하나의 재현 가능한 실행 계약으로 닫는다.'],
] as const;

const evidence = [
  ['AIME 2024', '52.7 vs 51.3', 'OpenR1-Distill-7B가 비교 대상보다 높았다. Competition math에서 증류된 풀이가 전달됐다는 근거다.'],
  ['MATH-500', '89.0 vs 93.5', '반대로 더 낮았다. “동등한 모델”이라는 말이 모든 분포에서 우위라는 뜻은 아니다.'],
  ['GPQA Diamond', '52.8 vs 52.4', '과학 추론은 거의 같은 수준이었다. 한 벤치마크의 상승을 일반 reasoning 향상으로 확대하지 않는다.'],
  ['LiveCodeBench v5', '39.4 vs 37.4', '코드 문제에서는 높았다. 하지만 학습 시점 이후 오염 여부와 generation 설정을 함께 고정해야 비교가 성립한다.'],
] as const;

export default function Overview({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <div className="mb-8 border-l-2 border-blue-600 pl-4 sm:pl-6">
        <p className="font-mono text-[11px] font-black uppercase text-blue-700 dark:text-blue-300">SOURCE SNAPSHOT · 2026-04-02</p>
        <h2 className="mt-3 text-2xl font-bold">한 문제 행이 policy update가 되기까지</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          이 글은 Hugging Face Open-R1 저장소의 commit <code>1416fa0</code>을 기준으로 읽는다. 이후 설정과 reward registry가 바뀌더라도
          dataset·serialization·rollout·verifier·update·evaluation이라는 실행 경계는 따로 추적할 수 있게 한다.
        </p>
      </div>

      <QuestionLead
        question="Open-R1은 DeepSeek-R1 논문을 다시 설명하는 프로젝트일까, 실제로 재현 가능한 학습 시스템일까?"
        answer="후자에 가깝다. 논문의 아이디어를 그대로 복사하는 대신 SFT·GRPO·합성 데이터·평가에 필요한 공개 script와 recipe를 제공한다. 다만 공식 저장소도 계속 변하는 연구 코드이므로, 한 실행의 model·dataset·chat template·reward list·commit을 함께 고정해야 재현이라고 부를 수 있다."
      />

      <ConceptPrimer items={[
        { term: 'Policy', meaning: '현재 prompt와 이미 생성한 token에서 다음 token 확률을 내는 model이다.', why: 'GRPO가 바꾸는 대상이 reward model이 아니라 생성 policy임을 고정한다.' },
        { term: 'Rollout', meaning: '한 prompt에서 실제로 sample한 completion 한 개다.', why: '학습 예제 수와 생성 token 비용을 구분한다.' },
        { term: 'Verifier', meaning: '정답·형식·실행 결과처럼 completion을 채점하는 함수다.', why: '좋은 문장과 검증 가능한 성공을 혼동하지 않는다.' },
        { term: 'Recipe snapshot', meaning: 'model, data, tokenizer, reward와 hardware 설정을 묶은 실행 시점의 계약이다.', why: '설정 숫자를 보편 권장값으로 외우지 않는다.' },
      ]} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 프로젝트의 세 목표를 분리한다</h3>
        <p>
          “Open-R1을 재현한다”는 말에는 서로 다른 실험이 섞여 있다. 증류는 teacher의 성공한 trace를 모방하는 문제이고,
          pure RL은 model이 verifier feedback으로 전략을 탐색할 수 있는지 보는 문제다. 다단계 학습은 둘을 연결해 안정성과 탐색을 함께 다룬다.
          DeepSeek-R1-Zero가 SFT 없이 시작했다는 사실 때문에 <strong>SFT는 GRPO의 논리적 선행 조건이 아니다.</strong> 다만 읽기 쉬운 형식,
          초기 성공률, 특정 domain 행동을 먼저 주입할 때 cold-start 또는 distillation SFT가 유용하다.
        </p>
      </div>

      <div className="not-prose my-8 border-y border-border">
        {goals.map(([index, title, body]) => (
          <div key={index} className="grid gap-2 border-b border-border py-5 last:border-b-0 sm:grid-cols-[4rem_11rem_minmax(0,1fr)] sm:gap-5">
            <span className="font-mono text-xl font-black text-blue-700 dark:text-blue-300">{index}</span>
            <p className="text-sm font-black">{title}</p>
            <p className="text-sm leading-7 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>End-to-end 실행 흐름</h3>
        <p>
          각 칸은 라이브러리 이름이 아니라 <strong>실패를 소유하는 경계</strong>다. Format reward가 계속 0이면 model부터 키우는 것이 아니라
          tokenizer와 chat template 경계를 본다. Reward는 오르는데 held-out 성능이 떨어지면 trainer보다 verifier와 data split을 의심한다.
        </p>
      </div>
      <E2EPipelineViz />

      {onCodeRef && (
        <div className="not-prose my-6 flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => onCodeRef('r1-sft-main', codeRefs['r1-sft-main'])} />
          <CodeViewButton onClick={() => onCodeRef('r1-grpo-main', codeRefs['r1-grpo-main'])} />
          <p className="basis-full text-xs leading-5 text-muted-foreground sm:basis-auto sm:pl-2">
            코드 창은 공식 control flow를 읽기 쉽게 줄인 교육용 excerpt다. 원문 commit과 같은 파일이라고 가정하지 않는다.
          </p>
        </div>
      )}

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>공개 결과는 한 줄 순위가 아니라 네 개의 관측이다</h3>
        <p>
          공식 README는 OpenR1-Distill-7B와 DeepSeek-R1-Distill-Qwen-7B를 네 benchmark로 비교한다. 결과는 “복제 성공”을 뒷받침하지만,
          어느 분포에서도 더 좋다는 증거는 아니다. 같은 숫자를 학습 data 선택과 evaluation setting을 검토하는 출발점으로 읽는다.
        </p>
      </div>
      <div className="not-prose mt-6 grid gap-px border border-border bg-border md:grid-cols-2">
        {evidence.map(([name, score, meaning]) => (
          <div key={name} className="min-w-0 bg-background p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-black">{name}</p>
              <p className="font-mono text-sm font-black tabular-nums text-blue-700 dark:text-blue-300">{score}</p>
            </div>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">{meaning}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
