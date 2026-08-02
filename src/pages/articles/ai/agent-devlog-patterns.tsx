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
import { EvidencePromotionLab } from './agent-devlog-patterns/viz/EvidencePromotionLab';

const raw = String.raw;

function EvidenceLane({
  index,
  title,
  evidence,
  owner,
}: {
  index: string;
  title: string;
  evidence: string;
  owner: string;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.25rem_9rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-bold text-muted-foreground">{index}</span>
      <strong className="text-sm">{title}</strong>
      <div className="min-w-0">
        <p className="text-sm leading-relaxed text-muted-foreground">{evidence}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-foreground"><strong>진실의 소유자:</strong> {owner}</p>
      </div>
    </div>
  );
}

function FormulaBlock({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div className="not-prose my-6 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-3 py-4 sm:px-5">
        <MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const releaseRecord = `release: 2026.07.27-agent-policy-17
claim: 정책 조회 실패는 refund capability를 닫는다
baseline:
  trace: trace_8fe1
  result: forbidden_refund=1
candidate:
  trace: trace_ba42
  result: forbidden_refund=0, handoff=1
versions:
  model: gpt-5.5-2026-07-15
  harness: 4f92c8e
  policy: refund-v17
owner: agent-runtime
rollback: harness@4d83aa1
open_risk: policy service 전체 장애 시 handoff queue 지연`;

const adrRecord = `# ADR-017: authority evidence가 없으면 capability를 발급하지 않는다

Status: Accepted
Context:
- policy lookup timeout 뒤 빈 policy로 계속 실행해 무단 환불이 발생했다.
- prompt 경고만으로는 다른 tool path의 fail-open을 막지 못했다.

Options:
1. model에게 "확실하지 않으면 묻기"를 더 강하게 지시
2. refund tool 내부에서 금액만 다시 검사
3. dispatcher가 signed policy evidence 없이는 capability를 발급하지 않음

Decision:
- 3을 선택한다. authorization 책임을 model text 밖의 공통 경계에 둔다.

Consequences:
- policy service 장애 시 자동 환불 가용성은 낮아진다.
- 모든 mutation tool이 같은 fail-closed contract를 재사용한다.

Supersedes: none
Revisit when: offline policy snapshot을 검증 가능하게 배포할 때`;

export default function AgentDevlogPatternsArticle() {
  return (
    <>
      <section id="boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Trace를 저장했는데도 왜 같은 논쟁과 실패가 반복될까?</h2>
        <QuestionLead
          question="정책 조회 timeout 뒤 agent가 무단 환불을 했고, 수정 후 평가도 통과했다. 세 달 뒤 다른 팀이 같은 fail-open 경로를 다시 만들지 않게 하려면 무엇을 남겨야 할까?"
          answer={<>Trace는 <strong>무슨 일이 일어났는지</strong> 보여주고 eval은 <strong>수정이 통과했는지</strong> 증명한다. 그러나 왜 authorization을 model 밖으로 옮겼는지, 어떤 대안을 버렸는지, 어느 조건에서 다시 검토할지는 자동으로 남지 않는다. 실행 증거를 변경 기록, ADR, 재사용 원칙으로 승격하는 별도 운영 계약이 필요하다.</>}
        />
        <ConceptPrimer items={[
          { term: 'Run evidence', meaning: '한 trial의 trace, 초기·최종 state, version과 grader 결과다.', why: '사람의 회고가 아니라 재실행 가능한 사실에서 기록을 시작한다.' },
          { term: 'Change record', meaning: '무엇을 바꾸고 어떤 before/after evidence로 출시했는지 남기는 release 단위 기록이다.', why: 'Commit diff만으로는 행동 변화와 배포 판정을 복원할 수 없다.' },
          { term: 'ADR', meaning: '되돌리기 어렵거나 여러 component의 책임을 바꾸는 선택의 context, 대안, 결정과 결과다.', why: '미래 팀이 과거 제약을 모른 채 같은 논쟁을 반복하거나 안전 경계를 되돌리지 않게 한다.' },
          { term: 'Lesson', meaning: '서로 다른 사건에서 반복 확인된 판단 규칙과 적용 범위, 반례다.', why: '한 사건의 우연을 보편 원칙으로 과장하지 않고 다음 설계에 재사용한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><InternalLink slug="agent-evaluation-trace" learningPathId="ai-agent-ops-evidence">Agent Evaluation & Trace</InternalLink>의 책임은 실패한 최초 span과 수정 전후 결과를 증명하는 데서 끝난다. 이 글은 그 증거를 팀이 오래 사용할 수 있는 결정 기억으로 바꾸는 다음 단계다.</p>
          <p>모든 자료를 한 문서에 복사하면 오히려 진실이 갈라진다. Raw tool payload와 state diff는 trace가 소유한다. Release record는 trace ID와 결과만 연결한다. ADR은 선택의 이유를 소유하고, Lesson은 반복 확인된 적용 규칙만 소유한다. 같은 사실을 복제하지 않고 ID와 version으로 이어야 한다.</p>
        </div>
        <Misconception>문서를 많이 남기는 것이 목표가 아니다. 하나의 사건이 반드시 Changelog, ADR, Lesson을 모두 만들어야 하는 것도 아니다. 각 기록이 답할 독립 질문이 있을 때만 승격한다.</Misconception>
      </section>

      <section id="evidence-ledger" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">실행 사실에서 결정 기억으로 올라가는 한 방향 흐름</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>기록은 회의실의 기억에서 시작하지 않는다. Version이 고정된 eval case와 trace에서 시작한다. 먼저 incident의 최초 causal boundary를 찾고 최소 수정을 paired rerun한다. 그다음 실제로 출시한 변경은 release record에 남긴다. 책임 경계가 바뀌면 ADR로, 다른 사건에서도 같은 규칙이 반복되면 Lesson으로 승격한다.</p>
        </div>
        <EvidencePromotionLab />
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <EvidenceLane index="01" title="Trace" evidence="Model turn, tool call, guardrail, handoff, state diff와 오류를 parent span과 version으로 연결한다." owner="관측 backend와 eval artifact" />
          <EvidenceLane index="02" title="Eval case" evidence="초기 상태, 허용 행동, 금지 side effect, fault fixture와 grader를 고정한다." owner="Versioned evaluation suite" />
          <EvidenceLane index="03" title="Release record" evidence="바꾼 component, baseline/candidate trace, gate 결과, owner, rollback과 남은 위험을 한 배포 단위로 묶는다." owner="Release ledger 또는 Changelog" />
          <EvidenceLane index="04" title="ADR" evidence="구조·권한·interface·dependency처럼 되돌리기 어려운 선택의 context, 검토 대안과 consequences를 보존한다." owner="Append-only decision repository" />
          <EvidenceLane index="05" title="Lesson" evidence="둘 이상의 독립 사건에서 재현된 causal rule, 적용 범위, 반례와 confidence를 갱신한다." owner="주제별 learning repository" />
        </div>
      </section>

      <section id="promotion-rules" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">무엇을 ADR과 Lesson으로 승격할지 계산한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>ADR은 “큰 작업”의 동의어가 아니다. 시스템 구조, 품질 속성, dependency, 공개 interface 또는 보안 책임을 바꾸고 되돌리기 어려울 때 쓴다. Accepted ADR은 과거를 고쳐 쓰지 않는다. 결정이 바뀌면 새 ADR이 이전 ADR을 supersede한다.</p>
        </div>
        <FormulaBlock
          latex={raw`\begin{aligned}
P_{\mathrm{ADR}}&=I_{\text{비가역}}\lor X_{\text{경계}}\lor S_{\text{안전·품질}}\\
Q_{\text{반복}}&=[n_{\mathrm{similar}}\ge2]\\
P_{\mathrm{lesson}}&=Q_{\text{반복}}\land C_{\text{원인}}\land R_{\text{재사용}}
\end{aligned}`}
          meaning="이 식은 표준이나 출처의 보편 법칙이 아니라 이 글이 제안하는 운영 휴리스틱이다. 문서 수를 늘리는 대신 승격을 막는 gate로 사용한다. ADR은 세 조건 중 하나만 참이어도 장기 결정 기억이 필요하고, Lesson은 반복·causal evidence·재사용 범위를 모두 만족해야 하므로 한 번의 인상적인 사건을 곧바로 일반 법칙으로 만들지 않는다."
          symbols={[[raw`I`, '되돌릴 때 migration·호환성·운영 위험이 큰 선택'], [raw`X`, '두 component나 팀 사이의 ownership·interface가 달라지는 선택'], [raw`S`, 'Security, availability, latency와 같은 중요한 quality attribute'], [raw`n_{\mathrm{similar}}`, '같은 causal pattern을 보인 독립 사건 수'], [raw`C`, 'Trace와 controlled rerun으로 원인을 지지하는 증거'], [raw`R`, '다른 task나 component에서도 판단에 사용할 수 있는 범위']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>문구 수정, dependency patch와 단순 schema rename은 보통 release record로 충분하다. 반대로 “모든 mutation capability는 dispatcher가 발급한다”는 변경은 authorization ownership을 옮기므로 ADR 대상이다. “Authority evidence가 없으면 side effect를 닫는다”는 원칙은 policy lookup, payment approval, external upload처럼 독립된 실패에서 반복 확인된 뒤 Lesson이 된다.</p>
          <p>Lesson에는 반례도 적는다. 예를 들어 read-only 검색은 authority evidence가 일부 없어도 degraded result를 반환할 수 있다. 이 반례를 빼면 fail-closed라는 안전 원칙이 모든 기능에 무차별 적용되어 가용성을 해친다.</p>
        </div>
      </section>

      <section id="worked-incident" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">하나의 fail-open 사건을 끝까지 기록해 본다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>환불 agent의 초기 상태는 <code>paid / amount=80 / refunded=false</code>다. 자동 환불 상한은 50달러다. Policy service timeout 뒤 harness가 빈 policy를 “제약 없음”으로 해석했고, agent는 refund tool을 호출했다. Trace <code>trace_8fe1</code>에서 최초 위반은 최종 답변이 아니라 <strong>authority evidence가 없는데 capability를 발급한 dispatcher</strong>다.</p>
          <p>수정은 prompt에 경고 한 줄을 더하는 것이 아니다. Dispatcher가 signed policy evidence 없이는 mutation capability를 만들지 않게 한다. 같은 DB snapshot과 timeout fixture에서 candidate를 다시 실행하면 refund call은 0회, DB는 그대로이며 human handoff가 1회여야 한다. 이 before/after가 아래 release record의 핵심이다.</p>
        </div>
        <pre className="not-prose my-6 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 text-xs leading-6 sm:text-sm"><code>{releaseRecord}</code></pre>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이 기록은 “수정함”보다 강하다. 어떤 case와 fault를 사용했는지, 금지 상태가 1에서 0으로 바뀌었는지, 누가 소유하고 어떻게 rollback할지를 다시 찾을 수 있다. 하지만 authorization 책임을 왜 dispatcher에 두었는지는 아직 설명하지 않는다. 그 결정은 아래 ADR이 소유한다.</p>
        </div>
        <pre className="not-prose my-6 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 text-xs leading-6 sm:text-sm"><code>{adrRecord}</code></pre>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Accepted ADR은 구현 문서가 아니다. 어느 함수에 if문을 넣었는지는 code가 소유한다. ADR은 왜 model prompt나 개별 tool check가 아니라 공통 dispatcher를 선택했는지, 그 결과 availability가 어떻게 낮아지는지, 어떤 조건에서 다시 검토할지만 남긴다.</p>
        </div>
      </section>

      <section id="release-gate" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">문서가 아니라 끊기지 않은 evidence chain을 출시한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>잘 쓴 ADR이 실패한 regression을 상쇄할 수는 없다. 먼저 deterministic safety gate와 task gate가 통과해야 한다. 기록 gate는 그 판정의 근거를 미래 실행까지 추적할 수 있는지 검사한다. 다섯 필드 중 하나라도 없으면 release note는 주장이지만 재현 가능한 증거는 아니다.</p>
        </div>
        <FormulaBlock
          latex={raw`\begin{aligned}\underbrace{G_{\mathrm{evidence}}}_{\text{검증 근거}}&=\underbrace{E_{\mathrm{trace}}}_{\text{원인 실행}}\land\underbrace{E_{\mathrm{case}}}_{\text{재현 fixture}}\land\underbrace{E_{\mathrm{pair}}}_{\text{전후 비교}}\\\underbrace{G_{\mathrm{operation}}}_{\text{운영 책임}}&=\underbrace{E_{\mathrm{owner}}}_{\text{책임자}}\land\underbrace{E_{\mathrm{rollback}}}_{\text{복구 경로}}\\\underbrace{G_{\mathrm{record}}}_{\text{기록 완결}}&=\underbrace{G_{\mathrm{evidence}}\land G_{\mathrm{operation}}}_{\text{두 gate 모두 통과}}\end{aligned}`}
          meaning="이 식은 기록이 존재하는지가 아니라 release claim을 다시 검증할 수 있는지를 묻는다. 논리 AND를 쓰므로 근사한 설명이나 ADR이 누락된 trace, 재현 case, paired result, owner 또는 rollback을 대신하지 못한다."
          symbols={[[raw`E_{\mathrm{trace}}`, '최초 causal boundary와 version을 가진 source trace'], [raw`E_{\mathrm{case}}`, '초기 state와 fault를 다시 만들 수 있는 eval case'], [raw`E_{\mathrm{pair}}`, '같은 조건에서 baseline과 candidate를 비교한 결과'], [raw`E_{\mathrm{owner}}`, '다음 failure와 문서 갱신을 책임질 component·team'], [raw`E_{\mathrm{rollback}}`, '회귀 시 되돌릴 artifact와 안전한 전환 절차'], [raw`\land`, '모든 근거가 동시에 있어야 한다는 논리 AND']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Raw trace에는 prompt, tool payload와 개인정보가 들어갈 수 있다. 수집 전에 redact하고 접근권한과 보존기간을 둔다. Changelog와 ADR에는 민감 원문을 복사하지 않고 trace ID, case ID, hash와 요약 판정만 남긴다. Trace retention이 끝나도 장기 결정의 이유는 남지만, 그 기록으로 민감 원문을 복원할 수 없어야 한다.</p>
          <p>Runtime signal을 수집하는 구체 구현은 <InternalLink slug="claw-telemetry" learningPathId="ai-agent-ops-evidence">Claw Telemetry</InternalLink>가 맡고, fault 뒤 자동 retry·escalation의 한계는 <InternalLink slug="claw-recovery" learningPathId="ai-agent-ops-evidence">Bounded Recovery</InternalLink>에서 이어진다. 이 글은 두 구현을 복사하지 않고 그 evidence가 어떤 장기 기록으로 승격되는지만 소유한다.</p>
        </div>
        <CapabilityCheck title="이 글만으로 통과해야 하는 판단" items={[
          'Trace, eval case, release record, ADR와 Lesson이 각각 답하는 질문을 구분한다.',
          '한 사건을 모든 문서에 복사하지 않고 ID와 version으로 연결한다.',
          '되돌리기 어려움, 책임 경계와 품질 속성으로 ADR 승격 여부를 판단한다.',
          '둘 이상의 독립 사건, causal evidence와 재사용 범위로 Lesson 승격을 제한한다.',
          'Fail-open incident에서 최초 causal boundary와 수정 owner를 찾는다.',
          '같은 fixture의 baseline/candidate 결과를 release claim에 연결한다.',
          'Accepted ADR을 고쳐 쓰지 않고 새 ADR로 supersede한다.',
          'Trace·case·before/after·owner·rollback의 AND gate로 기록 완결성을 검사한다.',
          '민감 raw trace와 장기 decision memory의 보존·접근 경계를 분리한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'OpenAI Agents SDK · Tracing', href: 'https://openai.github.io/openai-agents-python/tracing/', note: 'Agent run의 generation, tool, guardrail, handoff와 custom span을 trace로 묶는 현재 공식 구현 경계.' },
          { label: 'OpenTelemetry · Traces and context propagation', href: 'https://opentelemetry.io/docs/concepts/context-propagation/', note: 'Process·network 경계를 건너 signal을 같은 causal operation으로 연결하는 표준 관점.' },
          { label: 'AWS · Architectural decision records', href: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html', note: 'Context·decision·consequence, owner, Accepted 이후 immutable과 supersede lifecycle의 실무 기준.' },
          { label: 'Microsoft · Maintain an architecture decision record', href: 'https://learn.microsoft.com/azure/well-architected/architect-role/architecture-decision-record', note: '구조·품질 속성·되돌리기 어려운 선택만 ADR로 남기고 status·confidence·trade-off를 보존하는 기준.' },
          { label: 'Anthropic · Demystifying evals for AI agents', href: 'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents', note: 'Environment, task, trial, grader와 trace를 수정·재실행 loop로 닫는 현재 agent evaluation 관점.' },
        ]} />
      </section>
    </>
  );
}
