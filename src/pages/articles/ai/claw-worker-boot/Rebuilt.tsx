import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import WorkerControlPathViz from './viz/WorkerControlPathViz';
import WorkerEvidenceBoundaryViz from './viz/WorkerEvidenceBoundaryViz';
import WorkerFailureBoundaryViz from './viz/WorkerFailureBoundaryViz';

type Props = {
  onCodeRef: (key: string, ref: CodeRef) => void;
};

const codeButton = (
  key: string,
  label: string,
  onCodeRef: Props['onCodeRef'],
) => (
  <CodeViewButton onClick={() => onCodeRef(key, codeRefs[key])} label={label} />
);

export default function Rebuilt({ onCodeRef }: Props) {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Running은 전달 완료가 아니다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>WorkerSendPrompt</code>가 성공하고 반환된 <code>status</code>가
            <code>Running</code>이라고 하자. 이름만 읽으면 “상대 coding agent가 prompt를 받아
            실행 중”이라고 결론 내리기 쉽다. 실제 Rust가 보장하는 것은 훨씬 좁다.
            <code>send_prompt</code>는 prompt 시도 횟수, 마지막 prompt와
            <code>prompt_in_flight</code>를 registry에 기록한다. <code>task_receipt</code>가
            <code>Some</code>이면 caller가 넘긴 문자열을 복사하고, <code>None</code>이면 receipt를
            생성하거나 기록하지 않는다. 그 뒤 상태를 <code>Running</code>으로 바꾼다.
          </p>
          <p>
            그 함수에는 PTY write, child stdin, flush, socket send가 없다. <code>Worker</code>
            구조체에도 PID, process handle, terminal session이나 transport가 없다. 따라서
            <strong>이 모듈은 worker process를 부팅하는 실행 plane이 아니라, 외부 실행을 추적하는
            상태·증거 control plane</strong>으로 읽어야 한다. “dispatched”라는 event 문구도
            transport acknowledgement가 아니라 상태 변경의 설명이다.
          </p>
        </div>

        <div className="not-prose my-4 flex flex-wrap gap-2">
          {codeButton('worker-model', '7-state Worker 모델', onCodeRef)}
          {codeButton('send-lifecycle', 'send_prompt 실제 코드', onCodeRef)}
          {codeButton('tools-adapter', 'tool adapter 배선', onCodeRef)}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            아래 흐름에서 가장 중요한 빈칸은 2번과 4번 사이에 있다. registry가
            <code>Running</code>을 기록한 뒤 실제 터미널에 쓰는 주체는 이 코드에 없고, 이후
            <code>observe</code>에 screen snapshot을 넣는 주체도 이 코드 밖에 있다. 두 경계를
            표시하지 않으면 상태 이름이 실제 I/O 보장으로 과장된다.
          </p>
        </div>

        <WorkerControlPathViz />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>현재 7개 상태를 읽는 법</h3>
          <p>
            현재 enum은 <code>Spawning</code>, <code>TrustRequired</code>,
            <code>ToolPermissionRequired</code>, <code>ReadyForPrompt</code>,
            <code>Running</code>, <code>Finished</code>, <code>Failed</code>다. 이 목록은
            관찰 결과를 공통 어휘로 만드는 데 유용하다. 그러나 “허용된 edge만 통과시킨다”는
            transition validator는 없다. 각 method가 조건을 일부 검사한 뒤
            <code>worker.status = ...</code> 또는 <code>push_event(..., status, ...)</code>로
            직접 대입한다.
          </p>
          <p>
            예를 들어 <code>send_prompt</code>는 <code>ReadyForPrompt</code>에서만 실행되지만,
            <code>restart</code>는 이전 상태와 무관하게 <code>Spawning</code>으로 돌리고
            <code>terminate</code>는 이전 상태와 무관하게 <code>Finished</code>로 만든다. 따라서
            이 구현을 엄격한 finite-state machine이라고 부르려면, 최소한 허용 전이표와 단일
            transition 함수가 추가로 필요하다.
          </p>
        </div>
      </section>

      <section id="trust-resolver" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">신뢰 판정에는 두 코드 경로가 있다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Worker tool의 실제 시작점은 <code>run_worker_create</code>다. 이 adapter는
            <code>ConfigLoader::default_for(cwd)</code>에서 읽은 <code>trustedRoots</code>와
            호출자가 넘긴 root를 합친 뒤 <code>WorkerRegistry::create</code>로 전달한다.
            <code>create</code>는 cwd가 root에 맞으면 <code>trust_auto_resolve</code>만
            미리 켜고 <code>Spawning</code> record를 만든다. 여기서 subprocess는 생성되지 않는다.
          </p>
          <p>
            화면에서 trust prompt가 관찰되면 <code>observe</code>는 먼저
            <code>TrustRequired</code>를 기록한다. auto-resolve가 켜져 있으면 gate를 지우고
            다시 <code>Spawning</code>으로 되돌린다. 그렇지 않으면
            <code>WorkerResolveTrust</code>가 상태를 확인한 뒤 같은 변경을 수동 승인 event로
            기록한다. 실제 prompt에서 버튼을 누르거나 키를 전송하는 동작은 여전히 외부 책임이다.
          </p>
          <p>
            같은 runtime crate에는 더 풍부한 <code>TrustResolver</code>도 있다. 이 코드는 trust
            prompt일 때 denylist, allowlist, manual approval, <code>RequireApproval</code> 순으로
            정책을 계산한다. 하지만 현재 Worker tool adapter는 이 resolver를 호출하지 않는다.
            이름이 비슷하다는 이유로 두 경로의 보장을 합치면 deny 정책과 event가 Worker boot에
            자동 적용된다고 잘못 이해하게 된다.
          </p>
        </div>

        <div className="not-prose my-4 flex flex-wrap gap-2">
          {codeButton('tools-adapter', 'WorkerCreate adapter', onCodeRef)}
          {codeButton('trusted-roots-config', 'trustedRoots parsing', onCodeRef)}
          {codeButton('create-observe', 'create와 trust 관찰', onCodeRef)}
          {codeButton('trust-resolver', '별도 TrustResolver', onCodeRef)}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>allowlist의 경로 경계</h3>
          <p>
            <code>path_matches_allowlist</code>는 가능하면 cwd와 trusted root를 canonicalize하고,
            실패하면 입력 <code>PathBuf</code>를 그대로 사용한다. 마지막
            <code>cwd.starts_with(trusted_root)</code>는 문자열 prefix가 아니라 path component
            단위 비교다. 따라서 <code>/repo</code>가 <code>/repo-evil</code>과 일치하는 문제는 없다.
          </p>
          <p>
            더 현실적인 경계 위험은 canonicalize 실패 fallback이다. 존재하지 않는 상대 경로,
            <code>..</code>, 이후 생성될 symlink의 의미가 정규화되지 않은 채 비교될 수 있다.
            신뢰 자동 승인은 side effect가 큰 결정이므로, production에서는 workspace root와 cwd를
            모두 존재하는 절대 canonical path로 만든 뒤 실패를 자동 허용이 아닌 승인 요구로 닫는
            편이 안전하다.
          </p>
        </div>

        <div className="not-prose my-4 flex flex-wrap gap-2">
          {codeButton('allowlist-boundary', 'allowlist 경계 코드', onCodeRef)}
          {codeButton('tools-specs', 'Worker ToolSpec 권한', onCodeRef)}
        </div>
      </section>

      <section id="observe" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">observe는 화면을 받는 함수이지 화면을 읽는 함수가 아니다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>WorkerObserve</code> 입력에는 <code>worker_id</code>와
            <code>screen_text</code>가 들어간다. 즉 이 함수는 terminal capture를 실행하지 않는다.
            외부 orchestrator가 어떤 pane을 언제 캡처할지, capture가 같은 worker의 것인지, 중간
            출력이 잘리지 않았는지 보장한 뒤 문자열을 넘겨야 한다. Worker Boot는 그 snapshot 안의
            cue만 분류한다.
          </p>
          <p>
            판별 순서도 의미가 있다. tool permission prompt가 가장 먼저 발견되면
            <code>ToolPermissionRequired</code>로 즉시 반환한다. 그다음 trust prompt를 처리하고,
            prompt가 비행 중인 조건에서는 misdelivery를 찾는다. 이후 “thinking”, “working” 같은
            running cue를 찾으면 <code>prompt_in_flight</code>를 내리고, ready cue가 보이면
            <code>ReadyForPrompt</code>로 바꾼다. 이 순서는 한 snapshot에 여러 문자열이 섞였을 때
            어떤 상태가 우선하는지 결정한다.
          </p>
          <p>
            문자열 cue는 실용적인 adapter지만 강한 프로토콜은 아니다. 모델 출력에 “running tests”가
            설명으로 등장해도 running cue가 될 수 있고, UI 문구가 바뀌면 탐지가 누락될 수 있다.
            <code>prompt_in_flight = false</code> 역시 상대가 receipt를 보냈다는 뜻이 아니라
            screen text에서 진행 cue를 봤다는 뜻이다.
          </p>
        </div>

        <div className="not-prose my-4 flex flex-wrap gap-2">
          {codeButton('create-observe', 'observe 판별 순서', onCodeRef)}
          {codeButton('worker-model', 'event와 receipt 모델', onCodeRef)}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            아래 그림은 상태를 직선적인 “정상 부팅 순서”로 외우기 위한 것이 아니다. 각 상태가 어떤
            외부 증거로 만들어지고, 그 증거만으로는 무엇을 말할 수 없는지 함께 읽기 위한 지도다.
          </p>
        </div>

        <WorkerEvidenceBoundaryViz />
      </section>

      <section id="misdelivery" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">오배송 복구도 재전송 자체는 수행하지 않는다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>detect_prompt_misdelivery</code>는 마지막 prompt의 첫 non-empty line, 화면에서
            찾은 prompt echo, 관찰된 shell cwd와 기대 task receipt를 비교한다. prompt가 shell에
            보이거나 다른 cwd에 보이거나 receipt가 맞지 않는 정황이 있으면
            <code>PromptDelivery</code> failure event를 남긴다. 이것은 잘못된 대상에 보인
            <strong>증거를 분류</strong>하는 기능이다. prompt가 화면에 전혀 나타나지 않은 상황을
            곧바로 “전달 실패”로 확정하는 end-to-end acknowledgement는 아니다.
          </p>
          <p>
            auto recovery가 켜져 있으면 현재 prompt를 <code>replay_prompt</code>에 복사하고 상태를
            <code>ReadyForPrompt</code>로 만든다. “replay armed”는 재전송 대기 데이터가 생겼다는
            뜻이다. 외부 호출자가 다시 <code>WorkerSendPrompt</code>를 호출해야 replay prompt가
            다음 attempt로 이동한다. 그 호출도 registry 상태만 갱신하므로 실제 terminal write는
            별도 transport가 수행해야 한다.
          </p>
          <h3>restart, terminate, completion, timeout의 이름을 그대로 믿지 않는다</h3>
          <p>
            lifecycle API도 같은 원칙으로 읽는다. 현재 구현의 side effect와 production에서 흔히
            기대하는 process side effect를 분리하면, “상태상 종료됐지만 child는 살아 있는” 종류의
            오류를 일찍 발견할 수 있다.
          </p>
        </div>

        <WorkerFailureBoundaryViz />

        <div className="not-prose my-4 flex flex-wrap gap-2">
          {codeButton('send-lifecycle', 'send·restart·terminate', onCodeRef)}
          {codeButton('failure-evidence', 'completion·timeout·state file', onCodeRef)}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>observe_completion</code>은 <code>finish_reason</code>과 출력 token 수를 받아
            provider failure 또는 terminal state를 기록한다. 프로세스를 wait하거나 exit status를
            읽는 함수는 아니다. <code>observe_startup_timeout</code>도 자체 timer가 deadline을
            감시하는 loop가 아니라, 외부 호출자가 timeout 시점에 호출하는 분류 함수다. 전달받은
            pane command, transport/MCP health와 누적 event를 evidence bundle로 묶는다.
          </p>
          <p>
            분류 순서는 transport dead, 미해결 trust, 미해결 tool permission, Running 상태의 prompt
            acceptance timeout, 30초를 넘긴 prompt misdelivery, MCP unhealthy에 따른 worker crash,
            unknown이다. 따라서 <code>transport_healthy=true</code>는 첫 분류만 제외할 뿐 성공을
            뜻하지 않는다. 현재 Rust tree에서 이 timeout 함수는 테스트 외 ToolSpec이나 adapter에
            연결되어 있지 않으므로, 실제 runtime timeout으로 노출하려면 호출 경로부터 추가해야 한다.
          </p>
          <p>
            event가 추가될 때마다 <code>.claw/worker-state.json</code>을 temp file로 쓴 뒤 rename해
            외부 poller가 읽을 surface를 만든다. 하지만 directory 생성, write, rename 오류는
            반환되지 않는다. in-memory 상태가 성공했어도 파일 관찰자는 오래된 상태를 볼 수 있다.
            또한 registry는 재시작 때 이 파일에서 state를 복구하지 않는다.
          </p>
          <p>
            비슷한 공백이 두 곳 더 있다. tool permission에는 trust의
            <code>resolve_trust</code>처럼 명시적으로 gate를 해제하는 API가 없고, 이후 screen cue가
            다른 상태로 옮기는 데 의존한다. 또 running cue는 <code>prompt_in_flight</code>를
            false로 내리지만 event를 push하지 않아 그 acceptance heuristic만으로 state file이
            새로 기록되지는 않는다.
          </p>
        </div>
      </section>

      <section id="original-diff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Production에서 필요한 end-to-end 계약</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            다음 항목은 현재 구현 설명이 아니라, 이 control plane을 실제 worker runtime으로
            확장할 때 필요한 설계 기준이다. 핵심은 상태를 더 많이 추가하는 것이 아니라
            <strong>각 상태를 누가 어떤 증거로 확정하는지</strong>를 명시하는 것이다.
          </p>
          <h3>1. transport owner와 receipt protocol</h3>
          <p>
            transport가 worker session, process handle과 write queue를 소유해야 한다. prompt마다
            유일한 delivery id를 붙이고 <code>queued → written → flushed → accepted</code>를
            구분한다. <code>Running</code>은 상대 agent가 delivery id를 echo하거나 구조화된
            acknowledgement를 보낸 뒤에만 확정한다. screen heuristic은 보조 evidence로 남긴다.
          </p>
          <h3>2. 단일 transition gate와 불변식</h3>
          <p>
            모든 상태 변경을 한 함수로 통과시키고 허용 edge, 요구 evidence와 event emission을
            함께 검증한다. <code>Finished</code>를 기록하기 전에는 child 종료 또는 명시적인 detached
            상태가 필요하고, <code>ReadyForPrompt</code>에서는 trust와 tool permission gate가 모두
            해제됐다는 불변식을 검사한다.
          </p>
          <h3>3. 취소와 timeout의 소유권</h3>
          <p>
            restart와 terminate는 cancellation token, process group signal, grace period,
            강제 종료, child reap 순서를 가져야 한다. startup deadline은 transport owner와 같은
            lifecycle supervisor가 monotonic clock으로 집행하고, timeout API는 사후 수동 호출이
            아니라 supervisor event가 되어야 한다.
          </p>
          <h3>4. trust와 persistence는 fail-closed</h3>
          <p>
            trust root는 존재하는 절대 canonical path로만 저장하고 canonicalization 실패를 수동
            승인으로 돌린다. Worker adapter가 사용할 policy engine을 하나로 정해 deny/allow/manual
            event를 동일한 audit trail에 남긴다. state file은 write·sync·rename 실패를 health
            상태에 반영하고, 재시작 복원이 목적이라면 schema version과 crash recovery 규칙도
            추가한다.
          </p>
          <p>
            이 계약을 적용하면 처음 질문에 대한 답도 기계적으로 정해진다. 현재
            <code>WorkerSendPrompt → Running</code>만으로는 전달을 증명할 수 없다. production
            버전에서는 transport의 accepted receipt가 있어야만 같은 결론을 내려야 한다.
          </p>
        </div>
      </section>
    </>
  );
}
