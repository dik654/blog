import EVMStackViz from './viz/EVMStackViz';
import GasModelViz from './viz/GasModelViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EVM: 스택 머신 & 가스 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움의 상태 전이 함수(σ' = Υ(σ, T))를 실행하는 스택 기반 가상 머신
          <br />
          모든 노드가 동일한 EVM 실행으로 같은 상태에 도달 — 결정론적 실행이 필수
        </p>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>스택 머신 (Stack Machine)</h3>
        <p className="leading-7">
          레지스터 대신 최대 깊이 1024의 스택 사용 — 각 원소는 256비트(32바이트) 워드
        </p>
      </div>
      <div className="not-prose mb-8"><EVMStackViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>가스 모델 (Gas Model)</h3>
        <p className="leading-7">
          모든 오피코드에 가스 비용 할당 — DoS 방지 + 실행 유한성 보장
        </p>
      </div>
      <div className="not-prose mb-8"><GasModelViz onOpenCode={open} /></div>
    </section>
  );
}
