import VariableViz from './viz/VariableViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Variable & 계산 그래프</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          dezero_rs는 Python DeZero 프레임워크를 Rust로 포팅한 자동 미분 엔진
          <br />
          핵심 아이디어: 순전파 시 연산 이력을 그래프로 기록 → 역전파 시 그 그래프를 역순 추적
          <br />
          모든 값은 <code>Variable</code>로 감싸고, 내부에 data + grad + creator 링크를 보관
        </p>
        <p className="leading-7">
          Rust의 소유권 규칙과 계산 그래프의 다대다 관계가 충돌
          <br />
          → <code>Rc&lt;RefCell&lt;VarInner&gt;&gt;</code>로 해결: 공유 소유권(Rc) + 런타임 대여 검사(RefCell)
        </p>
      </div>
      <div className="not-prose mb-8">
        <VariableViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          grad를 <code>ArrayD</code>가 아닌 <code>Variable</code>로 저장하는 것이 핵심 설계 판단
          <br />
          단순 숫자면 1차 미분만 가능 — Variable이면 creator 체인이 남아 고차 미분을 자동 지원
          <br />
          이 한 가지 결정이 Newton법, Hessian 계산 등 고급 최적화의 기반
        </p>
      </div>
    </section>
  );
}
