import BackwardViz from './viz/BackwardViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Backward({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="backward" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">역전파 & 그래디언트 누적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <code>backward()</code>: 출력에서 입력까지 계산 그래프를 역순 추적
          <br />
          generation으로 정렬 → 높은 세대부터 pop → 각 함수의 backward 호출
          <br />
          같은 변수가 여러 번 사용된 경우 그래디언트를 누적 (<code>&prev + &gx</code>)
        </p>
        <p className="leading-7">
          <code>create_graph</code> 플래그가 핵심 — true면 역전파 과정 자체도 그래프에 기록
          <br />
          <code>using_backprop(create_graph)</code>로 ENABLE_BACKPROP을 임시 설정
        </p>
      </div>
      <div className="not-prose mb-8">
        <BackwardViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          그래디언트 누적을 <code>&prev + &gx</code>로 새 Variable 생성하여 처리
          <br />
          in-place 변경이 아닌 새 노드 생성 — create_graph=true일 때 이 덧셈도 그래프에 기록
          <br />
          단순한 코드 한 줄이지만 고차 미분의 정확성을 보장하는 설계
        </p>
      </div>
    </section>
  );
}
