import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import GatingPipelineViz from './viz/GatingPipelineViz';
import ModeLayersViz from './viz/ModeLayersViz';
import PermissionDecisionLab from './viz/PermissionDecisionLab';
import PermissionOperationalStepViz from './viz/PermissionOperationalStepViz';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Permission은 무엇을 결정하는가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          사용자가 “테스트를 고쳐 줘”라고 말했을 때 모델은 파일 읽기, 편집, shell 실행을 차례로 요청할
          수 있다. Permission의 질문은 <strong>이 요청을 현재 주체와 mode에서 승인할 것인가</strong>다.
          승인 뒤 실제 path가 workspace 안에서 열리는지, shell process가 network와 자식 process까지
          격리되는지는 다음 enforcement layer의 질문이다.
        </p>
        <p>
          현재 Rust 소스에는 <code>ReadOnly</code>, <code>WorkspaceWrite</code>,
          <code>DangerFullAccess</code>, <code>Prompt</code>, <code>Allow</code> 다섯 variant가 있다.
          앞의 세 개는 작업 범위에 가깝지만 뒤의 두 개는 판정 흐름을 바꾸는 특수 상태다. 따라서 enum의
          derived order를 곧바로 “안전 등급”으로 설명하면 중요한 branch를 놓친다.
        </p>
        <p>
          그런데 이 revision은 실제로 그 derived order를 <code>current_mode &gt;= required_mode</code>
          비교에 사용한다. 선언 순서상 <code>Prompt</code>는 <code>DangerFullAccess</code>보다 크므로,
          일반 도구 요구는 아래쪽 prompt branch에 도달하기 전에 <code>Allow</code>될 수 있다. 이는
          “Prompt는 항상 묻는다”는 안전 계약이 아니라 <strong>현재 구현의 순서 결함</strong>으로 읽어야
          한다.
        </p>
        <div className="not-prose my-4">
          <CodeViewButton
            onClick={() => onCodeRef('permission-types', codeRefs['permission-types'])}
            label="실제 permission 타입 7-105줄 보기"
          />
        </div>
      </div>

      <PermissionDecisionLab />
      <ModeLayersViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>mode와 tool requirement를 함께 읽는다</h3>
        <p>
          각 tool은 필요한 mode를 등록하고 policy는 현재 active mode와 비교한다. 중요한 기본값은
          <code>required_mode_for()</code>에 있다. 등록되지 않은 tool은
          <code>DangerFullAccess</code>를 요구한다. 새 도구가 registry에 추가됐지만 permission
          requirement가 빠졌을 때 낮은 mode에서 조용히 실행되지 않게 하는 fail-closed 선택이다.
        </p>
        <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
          {[
            ['active mode', '현재 세션이 가진 거친 권한 범위'],
            ['required mode', 'tool이 선언한 최소 권한. 누락 시 DangerFullAccess'],
            ['deny·ask·allow rules', 'tool 이름과 input subject에 맞는 명시적 예외'],
            ['PermissionContext', 'hook이나 상위 orchestration이 이 요청에만 붙인 Allow·Deny·Ask guidance'],
            ['prompter', 'Ask를 최종 Allow 또는 이유 있는 Deny로 닫는 사용자 인터페이스'],
          ].map(([term, meaning]) => (
            <div key={term} className="grid gap-2 px-4 py-3 sm:grid-cols-[150px_minmax(0,1fr)]">
              <code className="text-[13px] font-semibold">{term}</code>
              <p className="m-0 text-sm leading-relaxed text-muted-foreground">{meaning}</p>
            </div>
          ))}
        </div>

        <h3>실제 authorize 순서를 먼저 잡는다</h3>
        <p>
          이 구현은 모든 규칙을 한 배열에 두고 첫 match를 반환하지 않는다. deny, ask, allow를 별도
          목록으로 두고 그 사이에 hook context와 mode comparison을 배치한다. 그래서 같은 입력에
          allow와 deny가 모두 맞을 때, hook이 Allow를 제안할 때, prompter가 없을 때의 결과를 코드 순서로
          추론할 수 있다. 예를 들어 deny rule이 먼저 맞으면 뒤의 Allow guidance나 mode 비교까지 가지 않고
          이유가 있는 Deny로 끝나며 tool 실행 함수는 호출되지 않는다. Ask에 대한 사용자의 응답이 한 번의
          요청에만 적용되는지 세션에 보존되는지는 이 판정 함수 밖의 state owner를 따로 확인해야 한다.
        </p>
        <p>
          이 순서는 의도만 그린 설계도가 아니라 현재 실행 결과를 계산하는 순서다. 따라서 명시적 ask가
          없으면 derived mode comparison이 먼저 실행되고, active mode가 <code>Prompt</code>여도 보통의
          <code>ReadOnly</code>·<code>WorkspaceWrite</code>·<code>DangerFullAccess</code> 요구를
          허용한다. 아래 escalation branch의 <code>Prompt</code> 조건은 그 비교를 통과하지 못한
          requirement에만 도달한다.
        </p>
      </div>

      <GatingPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose my-4">
          <CodeViewButton
            onClick={() => onCodeRef('policy-order', codeRefs['policy-order'])}
            label="required mode·authorize·prompt helper 156-324줄 보기"
          />
        </div>
        <h3>운영 제품으로 갈 때 추가할 축</h3>
        <p>
          작은 core는 판정 원리를 배우기 좋지만 production에서는 정책 출처, 우회 모드, 설명 가능성,
          sandbox availability와 감사 로그까지 함께 닫아야 한다. 아래 비교는 현재 코드에 이미 있다는
          뜻이 아니라 <strong>학습용 core와 운영 hardening의 경계</strong>다.
        </p>
      </div>

      <PermissionOperationalStepViz />
    </section>
  );
}
