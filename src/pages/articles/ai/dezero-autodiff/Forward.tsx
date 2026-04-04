import ForwardViz from './viz/ForwardViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Forward({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="forward" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">순전파 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <code>Func::call()</code>이 순전파 실행 + 계산 그래프 구성을 동시에 처리
          <br />
          Function trait으로 forward/backward 쌍을 정의 — AddFn, MulFn 등이 구현
          <br />
          FuncState가 inputs(강한 참조)와 outputs(약한 참조)를 캡처
        </p>
      </div>
      <div className="not-prose mb-8">
        <ForwardViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          generation(세대 번호)으로 위상 정렬 — 출력의 gen = max(입력 gen) + 1
          <br />
          backward에서 높은 gen부터 처리하면 자연스럽게 올바른 역순
          <br />
          별도의 토폴로지 정렬 알고리즘 없이 정수 하나로 해결하는 우아한 설계
        </p>
      </div>
    </section>
  );
}
