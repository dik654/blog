import AttacksViz from './viz/AttacksViz';
import L1dFlushViz from './viz/L1dFlushViz';
import SpecCtrlViz from './viz/SpecCtrlViz';
import ReplayDefenseViz from './viz/ReplayDefenseViz';
import AcademicAttacksViz from './viz/AcademicAttacksViz';

export default function Attacks() {
  return (
    <section id="attacks" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">공격 모델 &amp; 알려진 취약점</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">위협 모델 4분류</h3>

        <AttacksViz />

        <p>
          TDX 위협 모델: <strong>Host(VMM), BIOS, 관리자, 물리적 공격자</strong> 전부 untrusted<br />
          Trusted: <strong>CPU, TDX Module(SEAM), 메모리 컨트롤러 내부 로직</strong><br />
          범위 밖: DoS, 사이드채널 일부(power), TD 내부 악성 코드
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">공개된 주요 취약점</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">CVE / Name</th>
                <th className="border border-border px-3 py-2 text-left">설명</th>
                <th className="border border-border px-3 py-2 text-left">해결</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">INTEL-SA-01103</td>
                <td className="border border-border px-3 py-2">TDX Module 1.5.05 이하 로직 버그</td>
                <td className="border border-border px-3 py-2">1.5.06 업데이트</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">GhostRace (2024)</td>
                <td className="border border-border px-3 py-2">TDX speculative race — SEAMCALL 경합</td>
                <td className="border border-border px-3 py-2">ucode 패치</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TDXDown (USENIX 2024)</td>
                <td className="border border-border px-3 py-2">타이머 기반 SEAMCALL 프로파일링</td>
                <td className="border border-border px-3 py-2">연구 수준 (low impact)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Downfall (GDS)</td>
                <td className="border border-border px-3 py-2">GATHER 명령 투기 누출</td>
                <td className="border border-border px-3 py-2">ucode + AVX2 gather disable</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">INTEL-SA-00960</td>
                <td className="border border-border px-3 py-2">Reptar — xsave prefix 버그</td>
                <td className="border border-border px-3 py-2">ucode 패치</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Side-Channel 완화 — L1D Flush</h3>
        <L1dFlushViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">Transient Execution — IBRS/STIBP</h3>
        <SpecCtrlViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">Replay Attack — TDX 1.5 방어</h3>
        <ReplayDefenseViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">연구 계층 공격 분석</h3>
        <AcademicAttacksViz />

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: TDX와 SGX의 위협 모델 비교</p>
          <p>
            <strong>SGX (SGX1)</strong>:<br />
            - 앱 단위 격리 (Enclave)<br />
            - 메모리 128MB 제한 (EPC)<br />
            - 페이지 swap 시 암호화·무결성·replay 완전 방어 (MEE)<br />
            - 작은 TCB → 검증 용이
          </p>
          <p className="mt-2">
            <strong>TDX</strong>:<br />
            - VM 단위 격리 (TD)<br />
            - 전체 물리 메모리 사용 가능<br />
            - TDX 1.0 — replay 취약, 1.5 — 무결성 추가<br />
            - 큰 TCB (Guest OS 포함) → 공격 표면 넓음
          </p>
          <p className="mt-2">
            <strong>선택 기준</strong>:<br />
            - 작은 기밀 코드 + 최고 보안 → SGX<br />
            - 기존 VM 마이그레이션 + 편의성 → TDX<br />
            - SGX는 EOL 진행 중 (클라이언트 CPU) → TDX가 서버 표준
          </p>
          <p className="mt-2">
            <strong>AMD SEV-SNP와 비교</strong>:<br />
            - SEV-SNP도 VM 단위, 무결성 기본 (RMP)<br />
            - TDX는 TDX Module이 추가 TCB → 공격 표면<br />
            - 성능·생태계는 비슷한 수준
          </p>
        </div>

      </div>
    </section>
  );
}
