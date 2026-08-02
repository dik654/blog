import type { ReactNode } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  ComputerUseEvaluationStrip,
  ComputerUseLoopLab,
  EffectContractStrip,
  RetrySafetyLab,
} from './agent-current-first/viz/AgentCurrentLabs';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: Array<[string, string]>;
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-[13px] sm:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

function EvidenceRow({
  index,
  name,
  owns,
  reject,
}: {
  index: string;
  name: string;
  owns: ReactNode;
  reject: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.25rem_8.5rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-xs font-black text-muted-foreground">{index}</span>
      <strong className="text-sm">{name}</strong>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
        <p>{owns}</p>
        <p className="mt-1.5 text-xs text-rose-700 dark:text-rose-300"><strong>거부:</strong> {reject}</p>
      </div>
    </div>
  );
}

const observationContract = `type GuiObservation = {
  revision: string;
  capturedAt: string;
  url: string;
  viewport: { width: number; height: number; scale: number };
  activeWindow: string;
  screenshot: ArtifactRef;
  domSnapshot?: ArtifactRef;
  accessibilityTree?: ArtifactRef;
  sessionRevision: string;
};

type GuiActionProposal = {
  observationRevision: string;
  target: {
    meaning: string;
    stableAttributes: Record<string, string>;
    geometry: { x: number; y: number; width: number; height: number };
  };
  action: "click" | "type" | "select" | "submit";
  expectedChange: string;
  risk: "read" | "reversible-write" | "irreversible-write";
  actionHash: string;
};`;

export default function ComputerUseAgentRuntimeArticle() {
  return (
    <>
      <NlpSection
        id="observation"
        marker="01"
        tone="teal"
        question="Pixel 한 장을 환경의 영구 상태로 착각하지 않는다"
        title="Screenshot은 state가 아니라 특정 시점의 observation이다"
      >
        <QuestionLead
          question="Agent가 12초 전에 본 화면에서 ‘지급 확정’ 버튼 좌표를 기억한다. 지금 그 좌표를 클릭해도 될까?"
          answer="안 된다. 목록 정렬, viewport, scroll, modal과 session이 바뀌면 같은 좌표가 다른 업무 객체를 가리킨다. Screenshot은 revision과 capture 조건을 가진 관찰 자료다. 행동 직전에 새 observation을 받고, 목표의 의미와 identity를 다시 연결해야 한다."
        />
        <ConceptPrimer items={[
          { term: 'Observation revision', meaning: 'Screenshot, URL, viewport, active window와 DOM snapshot을 한 묶음으로 식별하는 버전이다.', why: 'Action이 어떤 화면을 근거로 만들어졌는지 추적한다.' },
          { term: 'Grounding', meaning: '“고객 A의 상태 변경” 같은 의미를 현재 화면의 실제 element와 연결하는 과정이다.', why: '좌표와 업무 객체를 같은 것으로 취급하지 않는다.' },
          { term: 'Target identity', meaning: 'Label, role, stable attribute, 주변 문맥과 geometry로 표현한 대상의 신원이다.', why: '화면이 조금 움직여도 같은 대상을 다시 찾고 ambiguity를 탐지한다.' },
          { term: 'Action proposal', meaning: '대상, 행동, 예상 변화, 위험도와 observation revision을 담은 실행 전 요청이다.', why: 'Model의 선택을 policy와 approval이 검사할 수 있게 한다.' },
          { term: 'Effect proof', meaning: '행동 뒤의 fresh observation, backend state 또는 audit record가 목표 상태와 일치한다는 증거다.', why: '마우스 event 전송과 업무 완료를 분리한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>사람은 화면의 글자, 그룹, 업무 맥락과 이전 경험을 함께 사용한다. Computer-use agent가 screenshot만 받으면 이 구조를 pixel에서 복원해야 한다. 가능하다면 DOM, accessibility tree, URL, network/API state를 함께 제공한다. 이 자료들은 완벽하지 않지만 “오른쪽 아래의 파란 버튼”보다 <code>role=button</code>, accessible name, customer ID와 form state가 훨씬 안정적인 target identity를 만든다.</p>
          <p>Screenshot과 DOM이 서로 다르면 어느 하나를 조용히 믿지 않는다. Capture 시각과 revision을 맞추고, disabled·visible 상태를 확인한다. <strong>Occluded</strong>는 다른 창이나 modal이 목표를 가린 상태이고, <strong>hit-test</strong>는 그 좌표의 입력을 실제로 어느 element가 받는지 확인하는 검사다. 민감한 값은 model context에 그대로 노출하지 않고 executor가 secret reference를 실제 입력으로 치환할 수 있다.</p>
          <p><code>revision</code>은 screenshot·DOM·viewport를 함께 찍은 한 관찰 묶음의 버전이라 화면을 다시 capture할 때마다 바뀐다. <code>sessionRevision</code>은 login, tab과 browser session의 연속성을 나타내므로 새 session으로 교체될 때 바뀐다. 화면 revision만 새로워진 경우 target을 다시 찾고, session revision까지 달라졌다면 인증과 이전 action의 effect부터 다시 확인한다.</p>
        </div>
        <pre className="not-prose my-7 min-w-0 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 font-mono text-xs leading-6 sm:text-sm"><code>{observationContract}</code></pre>
        <Misconception>
          최신 vision model의 grounding score가 높아도 좌표가 권한이 되지는 않는다. Grounding confidence는 target 후보의 불확실성이고, policy decision과 사용자 approval은 별도의 runtime 판단이다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="grounding"
        marker="02"
        tone="blue"
        question="관찰에서 곧바로 클릭하지 않고 proposal과 gate를 거친다"
        title="Observe, ground, propose, gate, act, verify를 한 loop로 닫는다"
      >
        <ComputerUseLoopLab />
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <EvidenceRow index="01" name="Observe" owns="Screenshot revision, URL, viewport, scroll, active window와 session을 원자적으로 캡처한다." reject="Capture 조건이 빠졌거나 frame이 action 전에 바뀌었다." />
          <EvidenceRow index="02" name="Ground" owns="업무 의미를 label·role·stable attribute·geometry가 있는 element 후보와 연결한다." reject="후보가 여러 개이거나 target이 가려지고 disabled 상태다." />
          <EvidenceRow index="03" name="Propose" owns="Target identity, action, expected change, risk와 observation revision을 고정한다." reject="“적당한 버튼 클릭”처럼 대상과 기대 변화가 모호하다." />
          <EvidenceRow index="04" name="Gate" owns="Policy가 user·task·resource scope를 확인하고 irreversible action이면 fresh approval을 요구한다." reject="Model confidence나 과거 approval을 현재 권한으로 사용한다." />
          <EvidenceRow index="05" name="Act" owns="격리된 browser가 승인된 proposal을 한 번 수행하고 low-level receipt를 남긴다." reject="Action hash 또는 current frame이 승인 시점과 다르다." />
          <EvidenceRow index="06" name="Verify" owns="새 화면과 가능한 backend state를 읽어 expected change와 금지된 side effect를 함께 검사한다." reject="Cursor event가 전송됐다는 사실만으로 completed 처리한다." />
        </div>
        <Takeaway>
          Computer use의 핵심은 더 정확한 좌표 예측 하나가 아니다. 오래된 관찰을 폐기하고, target ambiguity를 드러내며, 승인된 proposal과 실제 effect 사이를 evidence로 연결하는 runtime이다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="commit"
        marker="03"
        tone="violet"
        question="Reversible interaction과 irreversible business effect를 나눈다"
        title="Click은 입력 사건이고 commit은 업무 상태 전이다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Tab 이동이나 검색 필터 변경은 되돌리기 쉽다. 반면 지급, 계정 삭제, 공개 게시와 외부 전송은 되돌리기 어렵다. 두 행동을 같은 “click”으로 분류하면 approval과 retry가 잘못된다. Runtime은 action을 read, reversible write, irreversible write로 분류하고 위험이 커질수록 더 구체적인 commit gate를 둔다.</p>
          <p>Approval 화면에는 “허용할까요?”만 보여 주지 않는다. 대상 고객, 금액, destination, 현재 observation revision, 예상 변화와 action hash를 함께 제시한다. 승인 뒤 화면이 바뀌거나 proposal이 수정되면 hash가 달라지므로 다시 확인한다. 사용자 의도를 오래된 session의 포괄 승인으로 재사용하지 않는다.</p>
        </div>
        <EffectContractStrip />
        <Formula
          latex={String.raw`\underbrace{h}_{\text{승인 hash}}=\underbrace{H}_{\text{내용 고정}}\!\left(\underbrace{i}_{\text{대상}},\underbrace{a}_{\text{행동}},\underbrace{v}_{\text{화면 버전}},\underbrace{c}_{\text{commit 범위}}\right)`}
          meaning="승인은 막연한 의도가 아니라 특정 화면에서 특정 대상에게 수행할 특정 행동을 묶는다. 대상, action, 화면 revision, 금액이나 destination 중 하나라도 달라지면 hash가 바뀌므로 executor는 과거 승인을 재사용할 수 없다."
          symbols={[
            [String.raw`i`, '고객 ID, accessible name 등 target의 안정적인 identity'],
            [String.raw`a`, '그 target에 실제로 수행할 click, type 또는 submit 행동'],
            [String.raw`v`, '승인할 때의 observation을 식별하는 화면 revision'],
            [String.raw`c`, '금액, 계정, 공개 범위와 destination 같은 commit 범위'],
            [String.raw`h`, '대상·행동·화면 버전·commit 범위를 함께 고정한 승인 hash'],
            [String.raw`H`, '승인 내용이 실행 전에 바뀌지 않았음을 검사하는 cryptographic hash 연산'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Executor는 승인 hash와 현재 proposal hash가 같을 때만 commit한다. 실행 뒤에는 새 screenshot만 보지 말고 가능한 경우 backend record, transaction history와 audit log를 읽는다. UI toast는 사라지거나 거짓 양성이 될 수 있고, 반대로 timeout이 나도 backend commit은 성공했을 수 있다.</p>
        </div>
        <StopRule>
          대상, 금액, destination 또는 화면 revision이 승인 뒤 달라졌다면 자동 실행을 멈추고 새 proposal과 approval을 만든다. “비슷한 작업”이라는 이유로 기존 승인을 재사용하지 않는다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="retry"
        marker="04"
        tone="amber"
        question="응답 실패와 업무 effect 실패를 같은 사건으로 보지 않는다"
        title="Ambiguous timeout 뒤에는 재클릭보다 effect 확인이 먼저다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Timeout은 client가 정해진 시간 안에 응답을 받지 못했다는 뜻이다. Server나 GUI backend가 일을 하지 않았다는 뜻은 아니다. 조회는 다시 실행해도 상태를 바꾸지 않지만, 결제 버튼을 다시 누르면 두 번째 지급이 생길 수 있다. 따라서 retry policy는 action의 의미와 effect proof를 함께 본다.</p>
          <p>Typed API가 idempotency key를 지원하면 같은 logical request는 같은 key로 조회·재호출한다. 새 key를 만들면 중복 작업이 된다. GUI에는 이 보장이 대개 없으므로 transaction history나 업무 객체의 새 상태를 read-after-write로 확인한다. Effect가 없다는 증거가 없으면 “실패했을 것”이라는 추측으로 재클릭하지 않는다.</p>
        </div>
        <RetrySafetyLab />
        <Formula
          latex={String.raw`\underbrace{\operatorname{retry}(a)}_{\text{재시도 허용}}=\underbrace{\mathbf 1[\neg E(a)]}_{\text{effect 없음이 확인됨}}\land\underbrace{\mathbf 1[P(a)]}_{\text{권한이 아직 유효함}}\land\underbrace{\mathbf 1[B>0]}_{\text{재시도 budget이 남음}}`}
          meaning="Side effect를 만들 수 있는 action은 세 조건을 모두 만족할 때만 다시 실행한다. Timeout 자체는 effect 없음의 증거가 아니다. 새 관찰, transaction 조회 또는 idempotency record로 effect가 없음을 확인하고, 현재 권한과 budget도 다시 검사한다."
          symbols={[
            [String.raw`a`, '재시도를 검토하는 API·shell·GUI action'],
            [String.raw`E(a)`, '그 logical action의 effect가 이미 환경에 존재한다는 판정'],
            [String.raw`P(a)`, '현재 user·task·resource에 대한 permission과 approval이 유효하다는 판정'],
            [String.raw`B`, '무한 반복을 막는 남은 retry·시간·비용 budget'],
            [String.raw`\land`, '세 조건 중 하나라도 거짓이면 retry를 금지하는 논리 AND'],
          ]}
        />
        <Misconception>
          “최대 세 번 retry”는 안전 규칙이 아니다. Pure read에는 적절할 수 있지만 non-idempotent write에는 같은 행동을 세 번 실행하라는 위험한 규칙이 된다. 먼저 action class와 effect verification 방법을 정해야 한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="evaluation"
        marker="05"
        tone="green"
        question="한 번의 자연스러운 데모가 아니라 반복 가능한 end state를 잰다"
        title="Computer-use 평가는 화면 성공률과 안전 invariant를 따로 본다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>OSWorld와 WebArena 같은 benchmark는 실제 OS·웹 작업에서 model과 agent scaffold를 비교하는 중요한 기준이다. 그러나 한 시점의 benchmark 점수는 특정 environment version, task set, observation과 action interface의 결과다. 우리 제품의 로그인, 권한, 지연, overlay와 업무 손실 비용을 자동으로 대표하지 않는다.</p>
          <p>평가는 같은 initial state를 reset한 뒤 hidden end-state checker로 실제 결과를 검사한다. Layout, latency, popup, locale와 data ordering을 바꿔 반복 trial을 수행하고 평균뿐 아니라 실패 분포를 본다. Task success와 별도로 forbidden click, 승인 없는 외부 전송, credential 노출과 중복 commit은 safety invariant로 0을 요구한다.</p>
        </div>
        <ComputerUseEvaluationStrip />
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <EvidenceRow index="01" name="Task success" owns="DB, file, URL 또는 업무 객체의 최종 상태가 목표 predicate를 만족한다." reject="Agent의 마지막 답변이나 success toast만 채점한다." />
          <EvidenceRow index="02" name="Grounding" owns="Target identity가 맞고 stale·overlay·disabled 상태에서 실행이 차단된다." reject="정상 layout의 좌표 정확도만 측정한다." />
          <EvidenceRow index="03" name="Commit safety" owns="Approval hash와 effect receipt가 연결되고 duplicate effect가 없다." reject="업무는 끝났으니 중간의 무단 클릭을 무시한다." />
          <EvidenceRow index="04" name="Recovery" owns="Timeout, browser restart와 session loss 뒤 checkpoint에서 안전하게 재개한다." reject="깨끗한 한 session의 best case만 시연한다." />
          <EvidenceRow index="05" name="Release gate" owns="여러 seed와 perturbation의 paired result, trace와 실패 artifact를 보존한다." reject="한 번 성공한 녹화 영상으로 배포한다." />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>앞에서 읽은 <InternalLink slug="mcp-protocol" learningPathId="ai-agent-system-core">MCP Protocol</InternalLink>은 tool discovery와 typed capability의 배경이고, <InternalLink slug="llm-harness" learningPathId="ai-agent-system-core">LLM Harness</InternalLink>는 장기 session과 checkpoint의 배경이다. 여기서 확인한 웹 문서가 instruction으로 위장하는 위험은 다음 <InternalLink slug="prompt-injection-defense" learningPathId="ai-agent-system-core">Prompt Injection 방어</InternalLink>로, 반복 trial과 trace 비교는 <InternalLink slug="agent-evaluation-trace" learningPathId="ai-agent-system-core">Agent Evaluation</InternalLink>로 이어진다.</p>
        </div>
        <CapabilityCheck items={[
          'Screenshot을 capture 조건과 revision을 가진 observation으로 기록한다.',
          'Pixel 좌표와 업무 객체의 target identity를 구분한다.',
          'DOM·접근성 tree·URL·backend state로 screenshot grounding을 보강한다.',
          'Observe에서 verify까지 각 단계의 owner와 거부 조건을 설계한다.',
          'Read, reversible write와 irreversible commit에 다른 gate를 적용한다.',
          'Target, action, observation revision과 commit 범위를 approval hash로 고정한다.',
          'Timeout을 effect 실패로 단정하지 않고 read-after-write나 receipt를 확인한다.',
          'Pure read, keyed API와 non-idempotent GUI action의 retry 규칙을 구분한다.',
          'End-state success와 forbidden side effect safety invariant를 별도로 평가한다.',
          'Layout·latency·session perturbation과 반복 trial을 release evidence에 포함한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'OpenAI · Computer-Using Agent', href: 'https://openai.com/index/computer-using-agent/', note: 'Screenshot을 보고 virtual mouse·keyboard로 행동하는 perception-reasoning-action loop와 benchmark 범위의 공식 설명.' },
          { label: 'OpenAI · Responses API computer environment', href: 'https://openai.com/index/equip-responses-api-computer-environment/', note: 'Model proposal과 실제 shell·workspace execution을 분리하는 2026 공식 runtime 설계.' },
          { label: 'OSWorld', href: 'https://arxiv.org/abs/2404.07972', note: '실제 computer environment에서 open-ended task를 평가하고 execution-based result를 검사하는 1차 benchmark 논문.' },
          { label: 'WebArena', href: 'https://arxiv.org/abs/2307.13854', note: '재현 가능한 self-hosted web environment와 functional correctness 중심 평가의 1차 논문.' },
          { label: 'MCP Specification · Security best practices', href: 'https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices', note: 'Confused deputy, token handling, session과 권한 경계를 다루는 공식 보안 근거.' },
          { label: 'Anthropic · Mitigating prompt injections in browser use', href: 'https://www.anthropic.com/research/prompt-injection-defenses', note: 'Browser agent가 신뢰할 수 없는 페이지 content를 만날 때의 방어와 평가를 다루는 연구 자료.' },
        ]} />
      </NlpSection>
    </>
  );
}
