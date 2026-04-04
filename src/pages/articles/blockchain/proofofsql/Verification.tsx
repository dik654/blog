import CodePanel from '@/components/ui/code-panel';
import VerifyFlowViz from './viz/VerifyFlowViz';
import { VERIFY_CODE, VERIFY_ANNOTATIONS, GAS_TABLE } from './VerificationData';

export default function Verification() {
  return (
    <section id="verification" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Verification</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          검증자는 증명자와 <strong>정확히 동일한 순서</strong>로 transcript를 재구성합니다.<br />
          Fiat-Shamir 변환을 통해 대화형 프로토콜을 비대화형으로 변환하므로,
          검증자는 증명 데이터만으로 독립적으로 검증할 수 있습니다.
        </p>
        <h3>검증 단계</h3>
        <ol>
          <li><strong>초기화 & 유효성 검사</strong> -- 비트 분포, 범위 길이 등 기본 검사</li>
          <li><strong>Transcript 재구성</strong> -- 동일한 Keccak256 해시 체인 구축</li>
          <li><strong>Commitment 검증</strong> -- 미리 계산된 commitment과 비교</li>
          <li><strong>Sumcheck 검증</strong> -- 다항식 합 일치 확인</li>
          <li><strong>MLE 평가 검증</strong> -- 결과 MLE과 검증자 평가 비교</li>
          <li><strong>Inner Product 검증</strong> -- commitment과 실제 값의 일관성</li>
        </ol>
        <h3>EVM 가스 비용</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">연산</th>
                <th className="text-left p-2">가스 비용</th>
                <th className="text-left p-2">설명</th>
              </tr>
            </thead>
            <tbody>
              {GAS_TABLE.map((g) => (
                <tr key={g.op} className="border-b border-muted">
                  <td className="p-2 font-mono text-xs">{g.op}</td>
                  <td className="p-2">{g.gas}</td>
                  <td className="p-2">{g.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodePanel title="EVM Verifier (Yul)" code={VERIFY_CODE} annotations={VERIFY_ANNOTATIONS} />
      </div>
      <div className="mt-8"><VerifyFlowViz /></div>
    </section>
  );
}
