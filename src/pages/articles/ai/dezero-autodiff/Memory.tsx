import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import MemoryViz from "./viz/MemoryViz";

export default function Memory({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="memory" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Rust에서는 계산 그래프의 소유권 방향까지 설계해야 합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          계산 그래프는 한 Variable이 여러 Function에 입력되고 한 Function이 여러 출력을 만드는 다대다 구조입니다. <code>Rc</code>는 노드를 여러 위치에서 공유하게 하고, <code>RefCell</code>은 gradient와 creator처럼 실행 중 바뀌는 필드를 내부 가변성으로 관리합니다.
        </p>
        <p>
          모든 연결을 강한 참조로 두면 Variable과 Function이 서로를 붙잡아 참조 카운트가 0이 되지 않습니다. 입력은 backward에 필요하므로 강한 참조로 보관하되 출력은 <code>Weak</code>으로 두면, 사용자가 출력 Variable을 버렸을 때 계산 그래프도 함께 해제될 수 있습니다.
        </p>
      </div>
      <div className="not-prose my-8"><MemoryViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>실행 모드는 RAII guard로 원래 값까지 복원합니다</h3>
        <p>
          <code>no_grad()</code>는 backpropagation 기록을 잠시 끄고, guard가 스코프를 벗어날 때 이전 설정을 되돌립니다. 단순히 false로 바꿨다가 true로 고정하는 방식과 달리 중첩 호출과 panic에서도 원래 상태를 보존할 수 있습니다. 다만 <code>thread_local!</code>은 같은 스레드 안의 전역 상태이므로, 라이브러리가 커지면 명시적인 execution context로 옮기는 선택지도 검토해야 합니다.
        </p>
      </div>
    </section>
  );
}
