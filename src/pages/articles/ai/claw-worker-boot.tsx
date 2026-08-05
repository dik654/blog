import { CodeSidebar, useCodeSidebar } from '@/components/code';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SpecialistEntry,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import Rebuilt from './claw-worker-boot/Rebuilt';
import { codeRefs } from './claw-worker-boot/codeRefs';

export default function ClawWorkerBootArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <SpecialistEntry
        eyebrow="코드베이스 원문 경로 · Worker lifecycle"
        title="상태 이름을 읽기 전에 session, process와 transport의 실제 소유자를 구분한다"
        description="이 글은 worker 사용법이 아니라 Claw Code의 registry 상태가 실제 process spawn, terminal write와 acknowledgement 중 무엇을 보장하지 않는지 읽는 코드 감사다. Session 상태와 tool adapter를 먼저 본 뒤, 상태 전이마다 어떤 외부 evidence가 필요한지 추적한다."
        prerequisites={[
          'Session에 기록된 상태와 운영체제 process의 실제 생명주기는 다르다는 점',
          '도구 실행 요청, transport 전송과 상대의 수신 확인은 서로 다른 사건이라는 점',
        ]}
        links={[
          { slug: 'claw-session', learningPathId: 'ai-claw-core', title: '선행 · Session lifecycle과 한 Turn', reason: '메시지 state와 외부 side effect가 갈리는 기준점을 먼저 본다.' },
          { slug: 'claw-tool-system', learningPathId: 'ai-claw-core', title: '선행 · Worker tool의 schema와 dispatch', reason: 'Registry method가 어떤 adapter를 통해 호출되는지 확인한다.' },
        ]}
      />
      <QuestionLead
        question="WorkerSendPrompt가 Running을 반환하면 실제 프롬프트가 상대 터미널에 도착했는가?"
        answer={<>아니다. 현재 Rust에서 <code>Running</code>은 registry가 attempt, in-flight와 last prompt를 기록했다는 <strong>control-plane 상태</strong>다. Caller가 <code>task_receipt</code>를 <code>Some</code>으로 넘긴 경우에만 그 입력값을 함께 복사하며, <code>send_prompt</code>가 receipt를 만들지는 않는다. 실제 terminal write와 수신 acknowledgement도 이 모듈의 보장이 아니다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'control plane', meaning: '작업의 상태, 정책, 명령 의도와 관찰 evidence를 관리하는 계층.', why: '실제 prompt bytes를 운반하는 data plane 또는 transport와 구분해야 Running의 의미를 과장하지 않는다.' },
          { term: 'evidence', meaning: 'screen cue, task receipt, completion input처럼 상태 판단에 사용한 관찰값.', why: '상태 이름보다 어떤 evidence로 그 상태를 확정했는지가 신뢰 수준을 결정한다.' },
          { term: 'acknowledgement', meaning: '수신 측이 특정 delivery id를 실제로 받아들였다고 되돌려 주는 확인.', why: 'send 함수를 호출했다는 사실과 상대가 prompt를 받았다는 사실 사이의 빈칸을 닫는다.' },
          { term: 'lifecycle owner', meaning: 'process spawn, transport, timeout, cancellation과 child reap을 끝까지 책임지는 주체.', why: 'state만 Finished로 바꾸는 것과 실제 process를 종료하는 것을 분리한다.' },
        ]}
      />
      <Misconception>
        Worker Boot라는 이름 때문에 이 모듈이 process spawn, PTY 연결과 prompt 전송까지 수행한다고 생각하기 쉽다. 실제 구조체와 tool adapter에는 그 소유권이 없으며, 외부 실행을 문자열 evidence로 추적하는 registry가 중심이다.
      </Misconception>
      <Rebuilt onCodeRef={sidebar.open} />
      <CapabilityCheck
        items={[
          '현재 WorkerStatus 7개를 말하고, enum 목록과 강제된 전이 그래프의 차이를 설명한다.',
          'WorkerSendPrompt가 Running으로 바꾸는 코드에서 transport write가 없다는 사실을 찾는다.',
          'WorkerObserve가 terminal을 직접 캡처하지 않고 screen_text를 입력으로 받는 이유를 설명한다.',
          'WorkerRegistry의 trust auto-resolve와 별도 TrustResolver가 현재 어떻게 분리되어 있는지 추적한다.',
          'restart, terminate, completion, timeout API의 이름과 실제 side effect 차이를 설명한다.',
          'delivery ack, lifecycle owner, fail-closed persistence를 사용해 production 계약을 설계한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-3 text-sm">
        <span>선행 권장: <InternalLink slug="claw-tool-system" learningPathId="ai-claw-core">Tool schema와 dispatch</InternalLink></span>
        <span>다음: <InternalLink slug="claw-hooks" learningPathId="ai-claw-lifecycle">Worker 밖의 lifecycle middleware</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw worker_boot.rs', href: 'https://github.com/ultraworkers/claw-code/blob/main/rust/crates/runtime/src/worker_boot.rs', note: '7개 상태, registry method, screen evidence, completion·timeout과 state file의 실제 구현. 본문 코드 패널은 2026-07-26 local snapshot이다.' },
          { label: 'Claw trust_resolver.rs', href: 'https://github.com/ultraworkers/claw-code/blob/main/rust/crates/runtime/src/trust_resolver.rs', note: 'denylist, allowlist와 manual approval을 판정하는 별도 resolver. Worker tool adapter와 분리되어 있음을 비교한다.' },
          { label: 'Claw tools/src/lib.rs', href: 'https://github.com/ultraworkers/claw-code/blob/main/rust/crates/tools/src/lib.rs', note: 'Worker ToolSpec, permission mode, ConfigLoader merge와 registry adapter의 실제 배선.' },
          { label: 'Rust std::path::Path::starts_with', href: 'https://doc.rust-lang.org/std/path/struct.Path.html#method.starts_with', note: '문자열 prefix와 달리 path component 단위로 prefix를 비교한다는 기준.' },
        ]}
      />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{}}
        projectMetas={{
          'claw-code': {
            id: 'claw-code',
            label: 'Claw Code · Rust',
            badgeClass: 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
          },
        }}
      />
    </>
  );
}
