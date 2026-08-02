import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import OverrideViz from './viz/OverrideViz';

export default function ContextOverride({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="context-override" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Hook context: override가 할 수 있는 것</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          현재 <code>PermissionContext</code>는 optional <code>PermissionOverride</code>와 reason을
          가진 작은 context parameter다. authorization 요청에 전달되지만 타입 자체가 1회 사용을
          강제하지 않으며, 같은 값을 다시 넘길 수도 있다. Once, Session, Persistent lifetime이나
          override stack은 이 타입에 없다. 그런 운영 기능을 제품이 제공하려면 별도의 저장·만료·감사
          모델을 설계해야 한다.
        </p>
        <p>
          override decision은 <code>Allow</code>, <code>Deny</code>, <code>Ask</code> 세 가지다. 하지만
          단어만 보고 최상위 권한이라고 생각하면 안 된다. static deny가 먼저 적용되고, hook Allow도
          ask rule이 맞으면 사용자 확인을 거친다.
        </p>
      </div>

      <OverrideViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>우선순위를 코드에서 다시 읽는다</h3>
        <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
          {[
            ['1. static deny', '요청을 즉시 Deny. hook context는 평가하지 않는다.'],
            ['2. hook Deny', 'context reason을 사용해 Deny.'],
            ['3. hook Ask', 'prompter가 있으면 묻고 없으면 Deny.'],
            ['4. hook Allow', 'ask rule을 우선 확인한 뒤 allow rule 또는 mode가 충분할 때 Allow.'],
            ['5. base policy', 'ask → allow/derived mode 비교 → 제한적인 escalation prompt → final deny. Prompt도 비교에서 먼저 Allow될 수 있다.'],
          ].map(([step, text]) => (
            <div key={step} className="grid gap-2 px-4 py-3 sm:grid-cols-[150px_minmax(0,1fr)]">
              <strong className="text-sm">{step}</strong>
              <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
        <p>
          특히 마지막 줄을 이상적인 흐름으로 읽으면 안 된다. 현재 derived enum order에서는
          <code>Prompt &gt; DangerFullAccess</code>이므로 일반 requirement가 mode 비교에서 먼저
          허용된다. hook override의 precedence와 별개로 남아 있는 policy 구현 결함이다.
        </p>
        <div className="not-prose my-4 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() => onCodeRef('permission-types', codeRefs['permission-types'])}
            label="PermissionContext 타입 보기"
          />
          <CodeViewButton
            onClick={() => onCodeRef('policy-order', codeRefs['policy-order'])}
            label="override 적용 branch 보기"
          />
        </div>

        <h3>production override에 필요한 추가 계약</h3>
        <p>
          세션 전체 허용이나 “항상 허용”을 추가한다면 단순 bool로 저장하지 않는다. 누가 승인했는지,
          어떤 tool과 subject에 적용되는지, 언제 만료되는지, 더 강한 managed deny가 무엇인지, 현재
          활성화됐음을 UI와 audit에 어떻게 표시할지 정의해야 한다. 영구 override는 새 정책 source이므로
          precedence와 rollback도 필요하다.
        </p>
        <div className="not-prose my-5 grid gap-3 sm:grid-cols-2">
          {[
            ['scope', 'tool 전체가 아니라 exact/prefix subject까지 최소 범위로 제한'],
            ['lifetime', 'once·session·timestamp expiry를 명시하고 자동 만료'],
            ['provenance', 'user·project·managed·hook 중 누가 만든 rule인지 기록'],
            ['visibility', 'bypass/override 활성 상태를 UI와 audit log에 지속 표시'],
            ['revocation', '즉시 철회와 stale session 전파 방법 정의'],
            ['fail-closed', '저장 오류·서명 검증 실패·알 수 없는 source는 허용하지 않음'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-md border border-border p-4">
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
