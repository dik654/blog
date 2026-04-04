import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import KeygenViz from './viz/KeygenViz';
import { codeRefs } from './codeRefs';

export default function DilithiumKeygen({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="dilithium-keygen" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Dilithium 키 생성 (Module-LWE)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CRYSTALS-Dilithium은 Module-LWE(Learning With Errors) 문제에 기반합니다.
          공개키 <code>t = A*s1 + s2</code>에서 비밀 벡터 s1, s2를 복원하는 것이
          격자 위의 최단 벡터 문제(SVP)로 환원되며, 양자 컴퓨터로도 효율적으로 풀 수 없습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('dilithium-keygen', codeRefs['dilithium-keygen'])} />
          <span className="text-[10px] text-muted-foreground self-center">keygen() 내부</span>
        </div>
        <h3>파라미터 (Dilithium2, NIST Level 2)</h3>
        <ul>
          <li><code>q = 8,380,417</code> — 소수 모듈러스</li>
          <li><code>n = 256</code> — 다항식 차수</li>
          <li><code>k = l = 4</code> — 행렬/벡터 차원</li>
          <li><code>eta = 2</code> — 비밀 벡터 범위 &#123;-2..2&#125;</li>
        </ul>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — ECDSA 키 크기: 공개키 33B, 비밀키 32B.
          Dilithium: 공개키 1312B, 비밀키 2528B. 40배 크지만 양자 내성이라는 근본적 보안 향상.
        </p>
      </div>
      <div className="mt-8"><KeygenViz /></div>
    </section>
  );
}
