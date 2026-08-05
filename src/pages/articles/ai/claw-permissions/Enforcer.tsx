import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import EnforcerViz from './viz/EnforcerViz';

export default function Enforcer({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="enforcer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Runtime enforcer: 얇은 gate의 책임</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          현재 <code>PermissionEnforcer</code>는 policy를 보관하고 일반 <code>check()</code>, 동적
          required mode 비교, file write와 bash용 보조 check를 제공한다. 그 목적은 runtime caller가
          <code>Allowed</code> 또는 이유를 가진 <code>Denied</code>를 같은 형식으로 받게 하는 것이다.
        </p>
        <p>
          다만 현재 repository에서 이 enforcer는 보편적인 중앙 gate가 아니다.
          <code>ConversationRuntime</code>은 <code>PermissionPolicy::authorize_with_context()</code>를
          직접 호출하고, global registry의 enforcer는 <code>Option</code>이다. 공개
          <code>execute_tool()</code>도 <code>None</code>을 넘겨 이 경로를 건너뛴다. 따라서 “모든
          dispatch가 하나의 enforcer를 통과한다”는 말은 현재 사실이 아니라 hardening 목표다. 더구나
          authorization 결과는 filesystem handle이나 process namespace를 고정하지 않는다.
        </p>
      </div>

      <EnforcerViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Prompt mode의 Allowed는 최종 허용이 아니다</h3>
        <p>
          일반 <code>check()</code>는 active mode가 <code>Prompt</code>면 곧바로
          <code>Allowed</code>를 반환한다. 주석의 의도는 enforcer 자체에 prompter가 없으므로 상위의
          interactive flow에 판정을 넘기는 것이다. caller가 이 값을 “사용자 승인이 끝났다”고 해석하면
          prompt가 통째로 우회된다.
        </p>
        <div className="not-prose my-4 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() => onCodeRef('permission-wiring', codeRefs['permission-wiring'])}
            label="permission 호출 그래프 보기"
          />
          <CodeViewButton
            onClick={() => onCodeRef('runtime-enforcer', codeRefs['runtime-enforcer'])}
            label="runtime enforcer 26-173줄 보기"
          />
        </div>

        <h3>전용 helper가 containment는 아니다</h3>
        <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
          {[
            ['check_with_required_mode', 'Prompt면 Allowed handoff, 그 외 mode 비교', '동적 required mode만 보며 policy rule·context는 거치지 않는다.'],
            ['check_file_write', '문자열 prefix로 workspace 여부 확인', 'canonical path나 open-time handle 경계가 아니다.'],
            ['check_bash', '첫 token이 read-only 목록인지 확인', 'redirect, substitution, shell grammar와 OS 격리를 보장하지 않는다.'],
          ].map(([name, behavior, limit]) => (
            <div key={name} className="grid gap-2 px-4 py-3 md:grid-cols-[190px_220px_minmax(0,1fr)]">
              <code className="break-words text-[13px] font-semibold">{name}</code>
              <span className="text-sm">{behavior}</span>
              <span className="text-sm leading-relaxed text-muted-foreground">{limit}</span>
            </div>
          ))}
        </div>
        <p>
          특히 공백 없는 <code>echo ok&gt;file</code>처럼 단순 문자열 검사에서 놓치는 redirect가 쓰기를 만들 수 있고,
          <code>find</code>는 <code>-exec</code>로 process를 실행할 수 있다. 분류기는 prompt와 logging의
          신호로 쓸 수 있지만 root of trust로 두지 않는다.
        </p>

        <h3>prompter 실패 계약은 이 trait 밖에 있다</h3>
        <p>
          현재 <code>PermissionPrompter::decide(&amp;mut self)</code>는 동기 호출이며 반환형도
          Allow 또는 Deny뿐이다. timeout, error, panic, 취소와 감사 evidence를 표현하지 않는다.
          production caller는 이 실패들을 별도 경계에서 포착해 Deny로 닫고, 요청·결정·실패 이유를
          trace로 남겨야 한다. 이는 현재 core에 이미 있다는 설명이 아니라 필요한 운영 hardening이다.
        </p>

        <h3>보안 invariant는 호출 그래프로 증명한다</h3>
        <p>
          새 tool, plugin, hook, background worker가 생길 때마다 “어느 permission entry point를
          거치는가”, “Prompt 신호를 누가 사용자 decision으로 닫는가”, “Allowed 뒤 어떤 file/shell
          containment를 거치는가”를 테스트한다. 현재처럼 policy 직접 호출, optional enforcer,
          enforcer 없는 public helper가 함께 있으면 각각을 호출 그래프에 표시해야 한다. unit test에서
          함수 하나의 반환값만 확인해서는 bypass path를 찾을 수 없다.
        </p>
      </div>
    </section>
  );
}
