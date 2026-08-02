import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PolicyViz from './viz/PolicyViz';

export default function Policy({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="policy" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">PermissionPolicy: 규칙이 충돌할 때</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          mode만으로는 “bash는 대체로 묻되 <code>git status</code>는 허용” 같은 예외를 표현하기 어렵다.
          현재 <code>PermissionPolicy</code>는 tool requirement와 <code>deny_rules</code>,
          <code>ask_rules</code>, <code>allow_rules</code>를 따로 가진다. 이 분리는 충돌 우선순위를 코드
          구조에 드러낸다.
        </p>
        <p>
          가장 먼저 deny 목록을 찾는다. 그 뒤 request context, ask 목록, allow 목록과 mode를 평가한다.
          따라서 “allow가 더 구체적이면 deny를 이긴다”거나 “마지막 rule이 이긴다”는 일반적인 방화벽
          직관을 그대로 적용하면 안 된다.
        </p>
      </div>

      <PolicyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>규칙 DSL은 일반 glob이 아니다</h3>
        <p>
          실제 matcher는 <code>Any</code>, <code>Exact</code>, <code>Prefix</code> 세 종류다.
          <code>tool</code>은 그 tool의 모든 input에 맞고, <code>tool(*)</code>도 Any다.
          <code>tool(subject)</code>은 exact, <code>tool(prefix:*)</code>는 prefix match다. 임의의
          <code>**/*.pem</code> glob이나 custom closure를 지원한다고 가정하면 정책 검토 결과가 달라진다.
        </p>
        <div className="not-prose my-5 grid gap-3 sm:grid-cols-3">
          {[
            ['Bash', 'Any', '모든 Bash input'],
            ['Bash(git status)', 'Exact', 'subject가 정확히 git status'],
            ['Bash(git:*)', 'Prefix', 'subject가 git으로 시작'],
          ].map(([rule, matcher, meaning]) => (
            <div key={rule} className="rounded-md border border-border p-4">
              <code className="break-words text-[13px] font-semibold">{rule}</code>
              <p className="mt-3 text-xs font-semibold text-sky-700 dark:text-sky-300">{matcher}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{meaning}</p>
            </div>
          ))}
        </div>
        <p>
          matcher의 subject는 JSON input 전체가 아니다. parser가 <code>command</code>, <code>path</code>,
          <code>file_path</code>, <code>url</code>, <code>pattern</code> 등 정해진 key를 순서대로 찾아 첫
          문자열을 꺼낸다. 해당 key가 여러 개면 어느 값이 정책 대상이 되는지까지 테스트해야 한다.
        </p>
        <div className="not-prose my-4 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() => onCodeRef('rule-matcher', codeRefs['rule-matcher'])}
            label="규칙 parser와 subject 추출 326-469줄 보기"
          />
          <CodeViewButton
            onClick={() => onCodeRef('policy-order', codeRefs['policy-order'])}
            label="정책 우선순위 소스 보기"
          />
        </div>

        <h3>충돌을 표가 아니라 반례로 검증한다</h3>
        <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
          {[
            ['deny + allow 동시 match', 'Deny', 'deny search가 함수 첫 branch다.'],
            ['deny + hook Allow', 'Deny', 'static deny가 context override보다 먼저다.'],
            ['ask + hook Allow', 'Ask → Allow/Deny', 'ask rule이 먼저 prompter로 넘기고 최종 outcome을 닫는다.'],
            ['ask + prompter 없음', 'Deny', 'prompt_or_deny가 unattended 실행을 fail-closed로 닫는다.'],
            ['unknown tool + ReadOnly', 'Deny', 'required mode 기본값이 DangerFullAccess다.'],
            ['Prompt mode + 일반 bash', 'Allow (현재 결함)', 'Prompt가 DangerFullAccess보다 뒤에 선언되어 mode 비교가 prompt branch보다 먼저 성공한다.'],
          ].map(([caseName, result, reason]) => (
            <div key={caseName} className="grid gap-2 px-4 py-3 sm:grid-cols-[190px_100px_minmax(0,1fr)]">
              <strong className="text-sm">{caseName}</strong>
              <span className="text-sm font-semibold">{result}</span>
              <span className="text-sm leading-relaxed text-muted-foreground">{reason}</span>
            </div>
          ))}
        </div>
        <p>
          마지막 반례는 권장 동작이 아니다. <code>Prompt</code>와 <code>Allow</code>를 작업 범위의
          순서와 분리하거나, mode 비교 전에 special mode를 처리해야 “Prompt는 사용자에게 묻는다”는
          계약이 성립한다. 현재 글은 이 수정이 이미 적용됐다고 주장하지 않는다.
        </p>
      </div>
    </section>
  );
}
