import MrenclaveSealViz from './viz/MrenclaveSealViz';
import MrsignerSealViz from './viz/MrsignerSealViz';
import MigrationStepsViz from './viz/MigrationStepsViz';
import PolicyDecisionViz from './viz/PolicyDecisionViz';

export default function Policy() {
  return (
    <section id="policy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MRENCLAVE vs MRSIGNER 정책</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">정책 선택의 의미</h3>
        <p>
          <strong>KEYPOLICY</strong>: Seal Key 파생 시 어떤 측정값 포함하는지 결정<br />
          <strong>MRENCLAVE</strong>: 정확한 바이너리 고정 (엄격)<br />
          <strong>MRSIGNER</strong>: 서명자 기준 (유연)<br />
          <strong>선택이 유지보수·보안 모두 결정</strong> — 사후 변경 불가 (이미 봉인된 데이터)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MRENCLAVE 봉인</h3>
        <div className="not-prose mb-6"><MrenclaveSealViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">MRSIGNER 봉인</h3>
        <div className="not-prose mb-6"><MrsignerSealViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">정책 비교 매트릭스</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">시나리오</th>
                <th className="border border-border px-3 py-2 text-left">MRENCLAVE</th>
                <th className="border border-border px-3 py-2 text-left">MRSIGNER</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">v1.0 코드 업데이트 → v1.1</td>
                <td className="border border-border px-3 py-2">❌ 마이그레이션 필요</td>
                <td className="border border-border px-3 py-2">✅ 자동 호환</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">같은 서명자의 다른 enclave</td>
                <td className="border border-border px-3 py-2">❌ 데이터 공유 불가</td>
                <td className="border border-border px-3 py-2">✅ 공유 가능</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">서명 키 유출 시</td>
                <td className="border border-border px-3 py-2">✅ 영향 없음</td>
                <td className="border border-border px-3 py-2">❌ 공격자가 unseal 가능</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">컴파일러 변경</td>
                <td className="border border-border px-3 py-2">❌ 마이그레이션 필요</td>
                <td className="border border-border px-3 py-2">✅ 영향 없음</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Downgrade 공격</td>
                <td className="border border-border px-3 py-2">✅ 자연 방어</td>
                <td className="border border-border px-3 py-2">⚠️ SVN 체크 필요</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Migration 패턴 (MRENCLAVE 사용 시)</h3>
        <div className="not-prose mb-6"><MigrationStepsViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">선택 기준 — 의사결정 플로우</h3>
        <div className="not-prose mb-6"><PolicyDecisionViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Hybrid 정책</p>
          <p>
            <strong>다층 sealing 전략</strong>:<br />
            - <strong>Level 1 (MRENCLAVE)</strong>: 최상위 마스터 키 (32B)<br />
            - <strong>Level 2 (MRSIGNER)</strong>: 업데이트 가능한 데이터 키들<br />
            - 마스터 키로 데이터 키 암호화 → 이중 보호
          </p>
          <p className="mt-2">
            <strong>이점</strong>:<br />
            ✓ 마스터는 불변 (강한 root of trust)<br />
            ✓ 데이터 키는 자유롭게 rotate<br />
            ✓ 공격자가 서명 키만 얻어도 마스터 못 얻음
          </p>
          <p className="mt-2">
            <strong>실전 사용</strong>:<br />
            - Hyperledger Fabric/Avalon<br />
            - Oasis Network Key Manager<br />
            - Confidential Computing Consortium 권장 패턴
          </p>
        </div>

      </div>
    </section>
  );
}
