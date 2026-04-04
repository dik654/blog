import CodePanel from '@/components/ui/code-panel';
import CommitFlowViz from './viz/CommitFlowViz';
import { COMMIT_CODE, COMMIT_ANNOTATIONS, COMMIT_SCHEMES } from './DoryCommitmentData';

export default function DoryCommitment() {
  return (
    <section id="dory-commitment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Dory Commitment</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Proof of SQL의 commitment 시스템은 데이터베이스 컬럼과 테이블에 대한
          <strong>암호학적 commitment</strong>을 생성하고 관리합니다.<br />
          데이터의 무결성을 보장하면서도 실제 데이터를 노출하지 않는 방식으로 증명을 가능하게 합니다.
        </p>
        <h3>Commitment 스킴 비교</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">스킴</th>
                <th className="text-left p-2">셋업</th>
                <th className="text-left p-2">증명 크기</th>
                <th className="text-left p-2">검증</th>
                <th className="text-left p-2">곡선</th>
              </tr>
            </thead>
            <tbody>
              {COMMIT_SCHEMES.map((s) => (
                <tr key={s.name} className="border-b border-muted">
                  <td className="p-2 font-mono text-xs">{s.name}</td>
                  <td className="p-2">{s.setup}</td>
                  <td className="p-2">{s.proof}</td>
                  <td className="p-2">{s.verify}</td>
                  <td className="p-2 font-mono text-xs">{s.curve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>핵심 특성</h3>
        <ul>
          <li><strong>Binding</strong> -- commitment 생성 후 데이터 변경 불가</li>
          <li><strong>Hiding</strong> -- commitment만으로 원본 데이터 추론 불가</li>
          <li><strong>Homomorphic</strong> -- commitment 간 연산이 원본 값 연산과 대응</li>
        </ul>
        <CodePanel title="CommittableColumn & CommitmentScheme" code={COMMIT_CODE} annotations={COMMIT_ANNOTATIONS} />
      </div>
      <div className="mt-8"><CommitFlowViz /></div>
    </section>
  );
}
