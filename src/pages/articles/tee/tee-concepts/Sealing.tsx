import SealScenariosViz from './viz/SealScenariosViz';
import SealMechViz from './viz/SealMechViz';
import SealKeyDeriveViz from './viz/SealKeyDeriveViz';
import RollbackDefenseViz from './viz/RollbackDefenseViz';

export default function Sealing() {
  return (
    <section id="sealing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터 봉인 (Sealing)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Sealing의 역할</h3>
        <p>
          <strong>TEE 내부 데이터</strong>를 외부(디스크, 네트워크, 다른 컴퓨터)에 저장 필요 시 사용<br />
          <strong>CPU 고유 키</strong>로 암호화 → 해당 CPU/플랫폼에서만 복호화 가능<br />
          <strong>Sealing vs Attestation</strong>: Sealing은 데이터 영속성, Attestation은 원격 검증<br />
          <strong>재부팅</strong> 후에도 동일 enclave/TD에서 복호화 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sealing 사용 시나리오</h3>
      </div>
      <div className="not-prose my-6"><SealScenariosViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE별 Sealing 메커니즘</h3>
      </div>
      <div className="not-prose my-6"><SealMechViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Seal Key 파생 — 결정성</h3>
      </div>
      <div className="not-prose my-6"><SealKeyDeriveViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">봉인 정책 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">정책</th>
                <th className="border border-border px-3 py-2 text-left">결속 대상</th>
                <th className="border border-border px-3 py-2 text-left">업데이트 시</th>
                <th className="border border-border px-3 py-2 text-left">보안</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><strong>MRENCLAVE</strong></td>
                <td className="border border-border px-3 py-2">정확한 바이너리</td>
                <td className="border border-border px-3 py-2">Migration 필요</td>
                <td className="border border-border px-3 py-2">최고</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>MRSIGNER</strong></td>
                <td className="border border-border px-3 py-2">서명자 공개키</td>
                <td className="border border-border px-3 py-2">자동 호환</td>
                <td className="border border-border px-3 py-2">높음</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Combined</td>
                <td className="border border-border px-3 py-2">둘 다</td>
                <td className="border border-border px-3 py-2">MRENCLAVE와 동일</td>
                <td className="border border-border px-3 py-2">최고</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Rollback 방지</h3>
      </div>
      <div className="not-prose my-6"><RollbackDefenseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Sealing의 한계와 대안</p>
          <p>
            <strong>근본 한계</strong>:<br />
            - Seal Key가 CPU에 결속 → 하드웨어 고장 시 데이터 손실<br />
            - 여러 노드 간 공유 불가<br />
            - Backup은 별도 프로토콜 필요
          </p>
          <p className="mt-2">
            <strong>복구 전략</strong>:<br />
            1. <strong>Multi-party sealing</strong>: Threshold SSS로 키 분산<br />
            2. <strong>Distributed key manager</strong>: Oasis KM 같은 복제<br />
            3. <strong>Secret sharing</strong>: M-of-N 조합으로 복구<br />
            4. <strong>Cross-TEE replication</strong>: RA-TLS 기반 복제
          </p>
          <p className="mt-2">
            <strong>실전 권장</strong>:<br />
            - 저가치 데이터: 단일 node sealing<br />
            - 중요 데이터: multi-party + threshold<br />
            - 최중요: HSM backup + attested replication
          </p>
        </div>

      </div>
    </section>
  );
}
