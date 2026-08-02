import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { AgentEvalWorkbench, ReliabilityExplorer } from './agent-evaluation-trace/viz/AgentEvalExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return (
    <div className="not-prose my-6 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

function EvidenceLane({ index, title, evidence, decision }: { index: string; title: string; evidence: string; decision: string }) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.2rem_9rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-bold text-muted-foreground">{index}</span>
      <strong className="text-sm">{title}</strong>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
        <p>{evidence}</p>
        <p className="mt-1.5 text-xs text-foreground"><strong>판정:</strong> {decision}</p>
      </div>
    </div>
  );
}

const caseSchema = `type AgentEvalCase = {
  id: string;
  initialState: DatabaseSnapshot;
  userInput: string;
  allowedTools: string[];
  expectedState: Partial<DatabaseSnapshot>;
  forbiddenInvariants: Array<(state: DatabaseSnapshot) => boolean>;
  rubric: Array<{ criterion: string; weight: number }>;
  budget: { maxCostUsd: number; maxLatencyMs: number };
  environmentVersion: string;
};`;

const runnerSketch = `for (const evalCase of suite) {
  const environment = await restore(evalCase.initialState);
  const trace = await runAgent({
    case: evalCase,
    environment,
    modelVersion,
    harnessVersion,
    seed,
  });

  const finalState = await environment.snapshot();
  const invariantResult = gradeInvariants(evalCase, finalState);
  const behaviorResult = gradeToolTrace(evalCase, trace);
  const semanticResult = await gradeRubric(evalCase, trace.finalAnswer);

  persist({ evalCase, trace, finalState, invariantResult,
    behaviorResult, semanticResult, modelVersion, harnessVersion });
}`;

export default function AgentEvaluationTraceArticle() {
  return (
    <>
      <section id="success-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">데모가 잘 됐다는 말로는 무엇이 부족할까?</h2>
        <QuestionLead
          question="환불 에이전트가 공손하게 ‘처리했습니다’라고 답했다면 성공한 것일까?"
          answer="최종 문장만으로는 판단할 수 없다. 실제 주문 DB가 어떻게 바뀌었는지, 정책을 읽었는지, 권한이 있었는지, 실패한 도구 뒤에 안전하게 멈췄는지를 함께 봐야 한다. Agent 평가는 답변 채점이 아니라 환경과 상호작용한 전체 실행을 검증하는 일이다."
        />
        <ConceptPrimer items={[
          { term: 'Task', meaning: '초기 상태, 사용자 요청, 허용 도구와 성공 조건을 묶은 한 평가 단위다.', why: '같은 입력 문장이라도 DB 상태와 정책이 다르면 정답 행동도 달라진다.' },
          { term: 'Trial', meaning: '특정 model, harness, environment와 seed로 task를 한 번 실행한 기록이다.', why: 'Agent는 같은 task에서도 다른 경로를 택하므로 task와 실행 결과를 분리해야 한다.' },
          { term: 'Trace', meaning: '모델 호출, 도구 입력·출력, 상태 변화, 오류, 시간과 비용을 순서대로 남긴 증거다.', why: '마지막 증상에서 최초 원인으로 거슬러 올라가려면 중간 실행이 필요하다.' },
          { term: 'Grader', meaning: '결과나 trace를 받아 계약 충족 여부와 근거를 반환하는 채점기다.', why: 'DB 불변식, 문장 의미와 사람 판단은 서로 다른 방식으로 검사해야 한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>평가를 실행하기 전에 성공 계약부터 쓴다. 예제의 초기 상태는 <code>paid / $80 / refunded=false</code>다. 회사 정책은 자동 환불 상한을 50달러로 제한한다. 따라서 기대 행동은 환불 도구를 호출하지 않고 승인 담당자에게 이관하는 것이다. 가장 중요한 금지 상태는 <code>refunded=true</code>다.</p>
          <p>이 계약이 없으면 “사용자가 원하는 결과를 냈다”, “문장이 자연스럽다”, “도구 호출이 성공했다”가 같은 성공 점수에 섞인다. 하지만 사용자의 요청을 그대로 실행하는 것이 회사 정책과 안전 계약을 어길 수 있다. 먼저 결과, 행동, 안전, 운영 비용을 분리해야 한다.</p>
        </div>
        <Misconception>Agent 평가의 단위는 prompt와 answer 한 쌍이 아니다. Task는 외부 상태와 도구를 포함하고, trial은 그 task를 통과한 한 실행이며, trace는 판정에 필요한 중간 증거다.</Misconception>
      </section>

      <section id="eval-case" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">평가 case를 실행 가능한 계약으로 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>좋은 case는 질문 문장만 저장하지 않는다. 시작 DB snapshot, 정책 version, 사용할 수 있는 tool schema, 예상 최종 상태, 절대 깨지면 안 되는 불변식과 resource budget을 함께 고정한다. SWE-bench가 실제 repository와 executable test를 task에 묶고, tau-bench가 정책을 따르는 tool agent의 최종 database state를 비교하는 이유도 같다.</p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <EvidenceLane index="01" title="시작 상태" evidence="주문 ORD-2048은 paid, amount=80, refunded=false다. 정책과 DB fixture의 version hash를 남긴다." decision="trial마다 같은 snapshot으로 복원한다." />
          <EvidenceLane index="02" title="허용 행동" evidence="주문 조회, 정책 조회, 50달러 이하 자동 환불, 사람에게 이관할 수 있다." decision="tool schema와 권한 token도 case 일부다." />
          <EvidenceLane index="03" title="성공 상태" evidence="주문은 그대로 paid이며 refunded=false다. 최종 답변은 승인 이관을 알린다." decision="문장과 state를 각각 채점한다." />
          <EvidenceLane index="04" title="금지 불변식" evidence="정책 근거가 없거나 상한을 넘으면 refund mutation이 없어야 한다." decision="위반 한 번도 critical failure다." />
          <EvidenceLane index="05" title="운영 budget" evidence="p95 latency 8초, 평균 비용 0.20달러 이하를 목표로 한다." decision="안전 gate를 통과한 후보끼리 최적화한다." />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>실행 격리도 계약이다. Trial마다 fixture를 reset하고 외부 API 응답을 기록하거나 controllable stub으로 만든다. Model, prompt, tool, harness, policy와 environment version을 모두 남긴다. Seed를 고정할 수 있더라도 model serving과 외부 도구가 완전 결정적이라고 가정하지 않는다.</p>
        </div>
        <pre className="not-prose my-6 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 text-xs leading-6 sm:text-sm"><code>{caseSchema}</code></pre>
      </section>

      <section id="trace-debugger" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">마지막 증상이 아니라 처음 깨진 계약을 찾는다</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">최종 답변 실패만 보면 정책 조회와 실제 mutation 중 무엇을 고쳐야 할지 알 수 없다. 다음 trace는 task·주문 조회·정책 조회·환불 실행·답변 단계를 펼치고, 각 stage를 선택해 최초 policy 위반과 그 뒤의 critical action·downstream 증상을 분리한다.</p>
        <AgentEvalWorkbench />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>후보는 task success 평균을 78%에서 82%로 올렸다. 그러나 무단 환불이 0%에서 4%로 늘었다. 평균 하나만 보면 개선처럼 보이지만 critical invariant를 통과하지 못했으므로 release는 막아야 한다. 후보의 p95 8.1초와 평균 0.22달러도 앞에서 정한 8초·0.20달러 budget을 넘는다. 이 두 운영 실패도 기록하되, 값을 budget 안으로 줄이더라도 authorization failure가 남으면 배포할 수 없다.</p>
          <p>Trace를 시간순으로 보면 주문 조회는 정상이다. 정책 조회 timeout은 환경·tool failure이고, 그 뒤 harness가 빈 정책을 넣고 계속 진행한 것은 별도의 harness failure다. 두 결함이 같은 incident에 함께 존재하지만 무단 상태 변경으로 이어진 최초 safety contract 위반은 fail-open 결정이다. 무단 refund tool call과 잘못된 최종 문장은 그 뒤에 나타난 결과다. 최종 문장만 prompt로 고치면 다음 timeout에서 DB mutation은 재발한다.</p>
          <p>Trace에는 원문 전체를 무작정 저장하지 않는다. 각 span에 case ID, parent span, component version, input/output의 필요한 요약, tool call, state diff, retry, latency, token·cost와 error owner를 남긴다. Credential과 개인 정보는 수집 전에 redact하고 접근 권한과 retention을 별도 계약으로 둔다.</p>
        </div>
      </section>

      <section id="graders" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">근거의 종류에 맞는 grader를 붙인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>채점기는 편리함이 아니라 관측 가능한 증거로 선택한다. DB state처럼 정확히 비교할 수 있는 것은 코드로 검사한다. 어떤 도구를 어떤 인자로 호출했는지는 trace schema와 permission rule로 검사한다. 설명의 충실성이나 공손함처럼 의미 판단이 필요한 부분에만 rubric과 model judge를 사용한다.</p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <EvidenceLane index="01" title="상태 grader" evidence="expectedState와 실제 DB snapshot을 비교하고 forbidden invariant를 실행한다." decision="가장 재현 가능하며 safety gate 우선순위가 높다." />
          <EvidenceLane index="02" title="행동 grader" evidence="허용 tool, argument range, 호출 순서, retry와 permission evidence를 trace에서 검사한다." decision="최종 상태가 우연히 맞아도 위험한 경로를 잡는다." />
          <EvidenceLane index="03" title="Rubric judge" evidence="설명의 정확성, 근거 인용, 누락과 모호성을 criterion별로 채점한다." decision="하나의 1~5점보다 criterion과 인용 span을 남긴다." />
          <EvidenceLane index="04" title="사람 검토" evidence="고위험 case, grader 불일치, 새 failure cluster와 애매한 정책을 표본 검토한다." decision="grader calibration과 task 수정을 함께 수행한다." />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>결과를 단순 평균하면 안 된다. 예를 들어 문장 judge 5점, 비용 4점, 안전 0점을 평균해 3점을 만드는 순간 안전 계약이 사라진다. 먼저 critical invariant를 gate로 평가하고, 통과한 trial에 대해서만 task quality와 효율을 비교한다. PaperBench의 계층형 rubric처럼 큰 성공을 세부 criterion으로 나누되, judge 자체도 사람 기준과 별도로 검증해야 한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\operatorname{release}(r)}_{\text{실행 }r\text{의 배포 허용}}
&={}\underbrace{\mathbf 1[\,g_{safe}(r)=1\,]}_{\text{치명적 안전 조건 통과}}\\
&\quad\land\underbrace{\mathbf 1[\,g_{task}(r)\ge \tau_{task}\,]}_{\text{작업 품질 하한 통과}}\\
&\quad\land\underbrace{\mathbf 1[\,c(r)\le B\,]}_{\text{운영 비용 상한 통과}}
\end{aligned}`}
          meaning="배포 허용은 평균 점수가 아니라 필수 조건의 논리곱으로 표현한다. 안전 grader가 실패하면 높은 task 점수나 낮은 비용이 그 실패를 상쇄하지 못한다. 그다음 suite 수준에서는 각 task family의 통과율과 confidence interval을 따로 비교한다."
          symbols={[[String.raw`r`, '한 task를 실행한 trial'], [String.raw`g_{safe}`, '금지 상태와 권한 위반을 검사하는 safety grader'], [String.raw`g_{task}`, '요구 결과와 설명 품질을 검사하는 task grader'], [String.raw`\tau_{task}`, '배포 전에 정한 task 품질 하한'], [String.raw`c(r)`, 'trial의 latency, token 또는 비용'], [String.raw`B`, '허용하는 운영 budget'], [String.raw`\land`, '세 조건을 모두 만족해야 한다는 논리 AND']]}
        />
        <Misconception>LLM-as-judge는 쓸모없는 것이 아니라 관측 범위가 제한된 grader다. 자연어 의미는 잘 볼 수 있지만 숨은 DB state, 실제 권한과 tool side effect는 별도 증거 없이는 판정할 수 없다.</Misconception>
      </section>

      <section id="reliability" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 번의 성공과 반복 신뢰성을 분리한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Agent는 같은 task에서도 tool 선택과 reasoning path가 달라진다. 한 번의 demo가 성공했다고 production에서 계속 성공한다는 뜻은 아니다. 한 trial의 성공 확률을 p라고 하면 k번 중 적어도 한 번 성공할 가능성과 k번 모두 성공할 가능성은 서로 다른 질문이다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\mathrm{pass@}k}_{\text{k번 중 최소 한 번 성공}}=\underbrace{1}_{\text{전체 경우}}-\underbrace{(1-p)^k}_{\text{k번 모두 실패할 확률}}`}
          meaning="여러 번 시도해 하나의 답을 고를 수 있는 search·sampling 능력을 본다. k가 커지면 값은 올라간다. 하지만 사용자가 매번 한 번만 실행하는 agent의 안정성을 직접 나타내지는 않는다."
          symbols={[[String.raw`p`, '같은 task 분포에서 한 trial이 성공할 확률'], [String.raw`1-p`, '한 trial이 실패할 확률'], [String.raw`(1-p)^k`, '독립이라고 가정할 때 k번 모두 실패할 확률'], [String.raw`1-\cdot`, '전체에서 모두 실패한 경우를 빼 최소 한 번 성공한 경우를 남기는 연산'], [String.raw`k`, '동일 조건에서 반복한 trial 수']]}
        />
        <Formula
          latex={String.raw`\underbrace{\mathrm{pass}^{k}}_{\text{k번을 모두 안정적으로 성공}}=\underbrace{p^k}_{\text{각 trial 성공 확률의 곱}}`}
          meaning="같은 업무를 반복해서 모두 성공해야 하는 reliability를 본다. p가 1보다 작으면 k가 늘수록 값은 낮아진다. 고객 요청을 매번 독립적으로 처리하는 agent에서는 pass@k보다 이 관점이 더 중요할 수 있다."
          symbols={[[String.raw`p`, '한 trial의 성공 확률'], [String.raw`p^k`, '독립이라고 가정할 때 k번 모두 성공할 확률'], [String.raw`k`, '연속 또는 반복 운영에서 요구하는 성공 횟수'], ['곱', '어느 한 번이라도 실패하면 전체 반복 신뢰성 조건이 깨진다는 뜻']]}
        />
        <ReliabilityExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>두 식은 설명을 위한 독립 시행 근사다. 실제 agent failure는 상관될 수 있다. 정책 서비스가 죽어 있으면 모든 trial이 함께 실패하고, retrieval index가 오래됐으면 같은 종류의 질문에서 반복적으로 틀린다. 따라서 suite에서 같은 case를 여러 번 실행하고 경험적 pass^k, failure correlation, worst-case streak를 기록한다. tau-bench가 반복 trial의 일관성을 별도로 강조한 이유가 여기에 있다.</p>
        </div>
      </section>

      <section id="failure-taxonomy" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">모델을 고치기 전에 failure의 소유 경계를 나눈다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Benchmark가 실패했다고 곧바로 model failure라고 부르면 잘못된 부분을 최적화한다. 2026년 OpenAI의 coding evaluation audit는 task 자체 문제, 지나치게 엄격한 test, 불완전한 prompt, 낮은 coverage가 평가 신호를 크게 오염할 수 있음을 보고했다. 그래서 failure inbox는 최종 점수보다 최초 causal boundary로 묶어야 한다.</p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {[
            ['Task 결함', '성공 조건이 모호하거나 서로 충돌한다.', 'prompt·policy·expected state를 독립 검토하고 case를 수정한다.'],
            ['환경·Tool 결함', 'API timeout, stale fixture, permission service 장애가 발생한다.', '재현 가능한 fault injection과 environment health를 분리 기록한다.'],
            ['Harness 결함', 'retry, fallback, context 조립 또는 permission gate가 잘못 작동한다.', '최초 깨진 runtime invariant를 regression test로 만든다.'],
            ['Model·Policy 결함', '근거가 있는데도 잘못 판단하거나 허용 행동을 선택하지 못한다.', 'prompt, context, model 또는 post-training 가설을 세운다.'],
            ['Grader 결함', '정답 실행을 실패로 보거나 위험한 실행을 통과시킨다.', '사람 표본과 deterministic evidence로 calibration한다.'],
            ['Coverage 결함', '평균은 높지만 특정 언어·도구·고위험 task가 비어 있다.', '실패 family와 production 분포 기준으로 suite를 확장한다.'],
          ].map(([title, symptom, action]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{symptom}</p>
              <p className="mt-2 text-xs leading-relaxed"><strong>다음 행동:</strong> {action}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>신선한 task도 필요하다. 공개 benchmark를 오래 최적화하면 training contamination과 harness-specific adaptation이 실제 능력처럼 보일 수 있다. SWE-bench Live처럼 새 repository issue를 주기적으로 수집하고 reproducible container를 보존하면 이 위험을 낮출 수 있다. 다만 최신이라는 이유만으로 대표성이 보장되는 것은 아니므로 production failure와 task family coverage를 함께 본다.</p>
        </div>
      </section>

      <section id="regression-loop" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">수정 전후를 같은 조건에서 다시 실행한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>평가의 목적은 leaderboard를 만드는 데서 끝나지 않는다. 실패를 재현하고, 한 component를 바꾸고, 같은 case와 environment snapshot에서 baseline과 candidate를 paired run한 뒤 무엇이 좋아지고 나빠졌는지 확인해야 한다.</p>
        </div>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <EvidenceLane index="01" title="가설" evidence="정책 조회 실패 뒤 continue하는 fallback이 무단 환불의 원인이다." decision="model 교체가 아니라 harness fail-closed를 먼저 수정한다." />
          <EvidenceLane index="02" title="최소 수정" evidence="정책 evidence가 없으면 refund permission을 발급하지 않고 사람에게 이관한다." decision="tool authorization 경계에 invariant를 둔다." />
          <EvidenceLane index="03" title="Paired rerun" evidence="같은 case, DB snapshot, tool fault와 반복 seed에서 기준·후보를 실행한다." decision="환경 차이를 개선 효과로 오인하지 않는다." />
          <EvidenceLane index="04" title="분포 확인" evidence="정상 정책, timeout, stale policy, 금액 경계 49/50/51달러 family를 나눠 본다." decision="전체 평균에 가려진 경계 regression을 찾는다." />
          <EvidenceLane index="05" title="Release 기록" evidence="가설, 변경 component, suite version, pass^k, safety, latency, cost와 남은 위험을 남긴다." decision="critical regression이 0일 때만 다음 gate로 이동한다." />
        </div>
        <pre className="not-prose my-6 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 text-xs leading-6 sm:text-sm"><code>{runnerSketch}</code></pre>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Runner는 final answer보다 먼저 final state와 invariants를 읽는다. 그다음 tool trace, semantic rubric 순으로 증거를 합친다. 결과에는 model만 아니라 harness, tool, policy, dataset과 grader version을 남긴다. 같은 model도 tool access, retry와 token budget이 다르면 다른 시스템이다. 제3자 평가가 이 실행 조건을 공개해야 재현 가능한 이유다.</p>
          <p>새 failure는 한 번 고쳐 끝내지 않는다. 최소 재현 case와 fault injection을 permanent suite에 추가한다. 이번 예제라면 policy timeout을 강제로 만들고 refund call이 0회인지, DB가 그대로인지, 이관 답변이 나오는지 함께 검사한다. 이후 model이나 prompt를 바꿔도 같은 계약이 자동으로 다시 실행된다.</p>
          <p>
            여기서 Eval의 책임은 배포 판정으로 끝난다. 통과·실패 trace를 왜 바꿨는지, 어떤 결정이 장기 제약이 됐는지까지 보존하려면 다음
            {' '}<InternalLink slug="agent-devlog-patterns" learningPathId="ai-agent-ops-evidence">Agent 운영 증거 글</InternalLink>에서
            release record, ADR과 Lesson으로 승격한다. Runtime event를 실제로 수집하는 구현은 그 뒤의 telemetry, 실패를 제한된 횟수 안에
            복구하는 구현은 recovery가 소유한다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Agent task에 초기 상태, 허용 행동, 기대 상태와 금지 side effect를 작성한다.',
          '최종 답변, tool behavior, environment state와 운영 비용을 서로 다른 evidence로 평가한다.',
          'Trace에서 마지막 오류가 아니라 처음 깨진 contract와 owner를 찾는다.',
          'Deterministic grader, rubric judge와 사람 검토의 관측 범위를 구분한다.',
          'pass@k와 pass^k를 계산하고 반복 reliability에 어떤 지표가 맞는지 선택한다.',
          'Task·environment·harness·model·grader failure를 분류한 뒤 수정 대상을 고른다.',
          '같은 case와 environment에서 baseline·candidate paired rerun과 release gate를 설계한다.',
          '새 failure를 fault injection regression으로 남기고 version·근거를 추적한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Anthropic · Demystifying evals for AI agents', href: 'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents', note: 'multi-turn task, environment, grader 조합과 agent eval 운영 loop를 설명한 2026 공식 글.' },
          { label: 'tau-bench', href: 'https://arxiv.org/abs/2406.12045', note: '정책을 따르는 tool agent를 최종 database state와 반복 trial consistency로 평가한 1차 논문.' },
          { label: 'SWE-bench', href: 'https://arxiv.org/abs/2310.06770', note: '실제 repository issue, code environment와 executable test를 결합한 coding-agent benchmark.' },
          { label: 'SWE-bench Live', href: 'https://arxiv.org/abs/2505.23419', note: '신선하고 갱신 가능한 task와 reproducible container로 contamination 위험을 줄인 후속 연구.' },
          { label: 'OpenAI · Separating signal from noise in coding evaluations', href: 'https://openai.com/index/separating-signal-from-noise-coding-evaluations/', note: '2026년 task·prompt·test·coverage 결함을 분리 감사해야 한다는 공식 분석.' },
          { label: 'OpenAI · PaperBench', href: 'https://openai.com/index/paperbench/', note: '복잡한 연구 재현을 세부 rubric으로 나누고 judge 자체를 별도 검증한 사례.' },
          { label: 'OpenAI · Trustworthy third-party evaluations', href: 'https://openai.com/index/trustworthy-third-party-evaluations-foundations/', note: 'tool access, retry, scoring, resource와 intermediate artifact 공개의 중요성을 정리한 2026 playbook.' },
        ]} />
      </section>
    </>
  );
}
