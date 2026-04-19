import ContextViz from './viz/ContextViz';
import TrustChainViz from './viz/TrustChainViz';
import ThreatModelViz from './viz/ThreatModelViz';
import DeploymentMatrixViz from './viz/DeploymentMatrixViz';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'AMD SEV 개요'}</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">AMD SEV 등장 배경</h3>
        <p>
          <strong>AMD SEV(Secure Encrypted Virtualization)</strong>: EPYC 서버 CPU의 하드웨어 기반 VM 격리<br />
          <strong>첫 도입</strong>: 2016 Naples(1세대 EPYC) — SEV 1.0<br />
          <strong>현재</strong>: 2024 Turin(5세대 EPYC) — SEV-SNP with Ciphertext Hiding<br />
          <strong>목표</strong>: 클라우드 사업자도 게스트 VM 내부를 못 보는 환경 제공
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">보안 목표 4대 요소</h3>
        <ul>
          <li><strong>기밀성(Confidentiality)</strong> — 메모리 암호화로 평문 노출 차단</li>
          <li><strong>무결성(Integrity)</strong> — SEV-SNP부터 메모리 변조 탐지 (RMP)</li>
          <li><strong>격리(Isolation)</strong> — VM마다 독립 암호 키 (ASID 기반)</li>
          <li><strong>원격 증명(Attestation)</strong> — 게스트 측정값을 외부에 증명</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">위협 모델</h3>
      </div>
      <div className="not-prose mb-4"><ThreatModelViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">진화 단계 요약</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">세대</th>
                <th className="border border-border px-3 py-2 text-left">년도</th>
                <th className="border border-border px-3 py-2 text-left">주요 기능</th>
                <th className="border border-border px-3 py-2 text-left">한계</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><strong>SEV 1.0</strong></td>
                <td className="border border-border px-3 py-2">2016</td>
                <td className="border border-border px-3 py-2">메모리 암호화 (AES-128)</td>
                <td className="border border-border px-3 py-2">레지스터 보호 없음</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>SEV-ES</strong></td>
                <td className="border border-border px-3 py-2">2017</td>
                <td className="border border-border px-3 py-2">레지스터 상태 암호화</td>
                <td className="border border-border px-3 py-2">무결성 없음, replay 취약</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>SEV-SNP</strong></td>
                <td className="border border-border px-3 py-2">2021</td>
                <td className="border border-border px-3 py-2">RMP로 무결성·IVRS</td>
                <td className="border border-border px-3 py-2">Host 메모리 매핑 공격 가능 (완화 중)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>SEV-SNP + CH</strong></td>
                <td className="border border-border px-3 py-2">2024</td>
                <td className="border border-border px-3 py-2">Ciphertext Hiding</td>
                <td className="border border-border px-3 py-2">Turin 세대 필수</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">배포 현황</h3>
      </div>
      <div className="not-prose mb-4"><DeploymentMatrixViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mt-8">
        <TrustChainViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: AMD SEV vs Intel TDX</p>
          <p>
            <strong>공통점</strong>:<br />
            - VM 단위 격리 (TD/Realm과 같은 단위)<br />
            - AES 메모리 암호화<br />
            - 원격 증명 지원<br />
            - Hypervisor untrusted
          </p>
          <p className="mt-2">
            <strong>차이점</strong>:<br />
            - <strong>추가 TCB</strong>: TDX는 TDX Module(SEAM) / SEV는 ASP firmware<br />
            - <strong>무결성</strong>: TDX 1.5만 MAC 옵션 / SEV-SNP는 RMP 기본<br />
            - <strong>격리 단위</strong>: TDX는 KeyID 별도 / SEV는 ASID 기반 per-VM key<br />
            - <strong>Attestation</strong>: TDX는 DCAP / SEV는 VCEK per-CPU 인증
          </p>
          <p className="mt-2">
            <strong>실무 선택</strong>:<br />
            - 기존 Intel 인프라 → TDX<br />
            - AMD EPYC 기반 클라우드 → SEV-SNP<br />
            - Linux 생태계는 양쪽 다 성숙 (6.5+)
          </p>
        </div>

      </div>
    </section>
  );
}
