import TASessionViz from './viz/TASessionViz';
import TATypesViz from './viz/TATypesViz';
import OpenSessionViz from './viz/OpenSessionViz';
import InvokeCommandViz from './viz/InvokeCommandViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function TASession({
  title,
  onCodeRef,
}: {
  title?: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="ta-session" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'TA 세션 관리 (tee_ta_manager.c)'}</h2>
      <div className="not-prose mb-8">
        <TASessionViz />
      </div>
      <div className="not-prose mb-4 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('entry-open-session', codeRefs['entry-open-session'])} />
        <span className="text-[10px] text-muted-foreground self-center">세션 열기 (entry_std.c)</span>
        <CodeViewButton onClick={() => onCodeRef('entry-invoke-command', codeRefs['entry-invoke-command'])} />
        <span className="text-[10px] text-muted-foreground self-center">명령 실행</span>
        <CodeViewButton onClick={() => onCodeRef('entry-close-session', codeRefs['entry-close-session'])} />
        <span className="text-[10px] text-muted-foreground self-center">세션 닫기</span>
        <CodeViewButton onClick={() => onCodeRef('entry-std-dispatch', codeRefs['entry-std-dispatch'])} />
        <span className="text-[10px] text-muted-foreground self-center">STD 디스패치</span>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TA(Trusted Application)는 UUID로 식별되며, 세션 모델로 관리됩니다.<br />
          클라이언트 앱이 <code>TEEC_OpenSession</code>을 호출하면
          Normal World 드라이버 → SMC → OP-TEE OS가 TA를 로드하고 세션을 생성합니다.
        </p>
        <h3>TA 유형</h3>
      </div>
      <div className="not-prose mb-6"><TATypesViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>세션 열기: tee_ta_open_session (실제 코드)</h3>
      </div>
      <div className="not-prose mb-6"><OpenSessionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>명령 실행: tee_ta_invoke_command</h3>
      </div>
      <div className="not-prose mb-6"><InvokeCommandViz /></div>
    </section>
  );
}
