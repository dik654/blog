import CodePanel from '@/components/ui/code-panel';
import FFLONKViz from './viz/FFLONKViz';
import { COMPARISON_CODE, HOMOMORPHISM_CODE, COMBINED_CODE } from './FFLONKData';

export default function FFLONK() {
  return (
    <section id="fflonk" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FFLONK 최적화</h2>
      <div className="not-prose mb-8"><FFLONKViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">PLONK Round 5의 비효율</h3>
        <p>PLONK의 Round 5는 6개 다항식을 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ζ</code>에서, 1개를 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ζω</code>에서 열어야 한다.
        <br />
          서로 다른 2개의 evaluation point에 대해 2개의 quotient polynomial과 custom pairing 등식이 필요하다.</p>
        <CodePanel
          title="PLONK vs FFLONK Round 5 비교"
          code={COMPARISON_CODE}
          annotations={[
            { lines: [1, 4], color: 'rose', note: 'PLONK: 2개 opening proof' },
            { lines: [6, 9], color: 'emerald', note: 'FFLONK: 1개로 통합' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">KZG의 가법 동형성 (Additive Homomorphism)</h3>
        <p>KZG commitment은 선형 연산이므로 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">commit(f + g) = commit(f) + commit(g)</code>가 성립한다.</p>
        <CodePanel
          title="KZG 가법 동형성"
          code={HOMOMORPHISM_CODE}
          annotations={[
            { lines: [3, 3], color: 'sky', note: 'commitment 선형 결합' },
            { lines: [5, 6], color: 'emerald', note: 'Verifier 재구성 가능' },
            { lines: [8, 9], color: 'amber', note: '곱셈 동형은 불가' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">Combined Polynomial 구성</h3>
        <p>FFLONK은 서로 다른 점에서 열리는 다항식들을 <strong>하나의 combined polynomial</strong>로 합친다.</p>
        <CodePanel
          title="Combined Polynomial"
          code={COMBINED_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: '서로 다른 evaluation point의 다항식' },
            { lines: [6, 7], color: 'emerald', note: 'ν로 선형 결합' },
            { lines: [12, 12], color: 'violet', note: 'batch_open 한 번으로 완료' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">장점 정리</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Opening proof 감소:</strong> 2개 → 1개</li>
          <li><strong>코드 재사용:</strong> 기존 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">kzg::batch_open</code> / <code className="bg-accent px-1.5 py-0.5 rounded text-sm">batch_verify</code> 그대로 사용</li>
          <li><strong>검증 단순화:</strong> custom pairing 등식 대신 표준 KZG batch verify</li>
          <li><strong>가스 절감:</strong> on-chain 검증 시 pairing 연산 감소</li>
        </ul>
      </div>
    </section>
  );
}
