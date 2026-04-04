import MemoryViz from './viz/MemoryViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Memory({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="memory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Rc/RefCell 메모리 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Rust의 소유권 시스템에서 계산 그래프의 다대다 관계를 표현하는 방법
          <br />
          <code>Rc</code>로 참조 카운팅 공유, <code>RefCell</code>로 런타임 대여 검사
          <br />
          outputs를 <code>Weak</code>으로 저장하여 순환 참조 방지
        </p>
        <p className="leading-7">
          전역 상태(<code>ENABLE_BACKPROP</code>, <code>TRAINING</code>)는 <code>thread_local!</code>로 관리
          <br />
          <code>no_grad()</code>는 RAII 가드 패턴 — Drop에서 자동 복원, panic에도 안전
        </p>
      </div>
      <div className="not-prose mb-8">
        <MemoryViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Python DeZero는 with문으로 컨텍스트 매니저를 구현 — Rust는 RAII로 더 안전하게 대체
          <br />
          <code>let _guard = no_grad();</code> — 변수 이름이 _로 시작해도 스코프 끝까지 유지
          <br />
          Python의 GC와 달리 참조 카운팅으로 결정론적 해제 — 메모리 사용량 예측 가능
        </p>
      </div>
    </section>
  );
}
