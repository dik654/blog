import AttestationViz from './viz/AttestationViz';
import SNPAttestFlowViz from './viz/SNPAttestFlowViz';
import ReportStructViz from './viz/ReportStructViz';
import VerifyFlowViz from './viz/VerifyFlowViz';
import AttestReportFieldsViz from './viz/AttestReportFieldsViz';
import GuestReportRequestViz from './viz/GuestReportRequestViz';
import VerifierFullFlowViz from './viz/VerifierFullFlowViz';
import SnpguestToolViz from './viz/SnpguestToolViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Attestation({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '원격 증명 (Remote Attestation)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>원격 증명</strong>: untrusted 클라우드에서 게스트 VM의 <strong>신원·무결성</strong> 검증<br />
          "이 코드가 정말 SEV-SNP 보호하에 변조 없이 실행 중인가?"를 수학적 증명<br />
          <strong>3계층 인증서</strong>: AMD Root → ARK → ASK → VCEK → Report<br />
          <strong>VCEK</strong>: Versioned Chip Endorsement Key — 각 CPU + TCB 조합마다 고유
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('attest-report', codeRefs['attest-report'])} />
            <span className="text-[10px] text-muted-foreground self-center">AttestationReport 구조체</span>
            <CodeViewButton onClick={() => onCodeRef('guest-request', codeRefs['guest-request'])} />
            <span className="text-[10px] text-muted-foreground self-center">get_report() 드라이버</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-3">SNP Attestation Report 구조</h3>
      </div>
      <ReportStructViz />

      <div className="not-prose mb-4 mt-6"><AttestReportFieldsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Guest에서 Report 요청</h3>
      </div>
      <div className="not-prose mb-4"><GuestReportRequestViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">증명 흐름</h3>
        <p>
          테넌트 애플리케이션이 클라우드의 게스트 VM을 검증하는 전체 과정
        </p>
      </div>
      <VerifyFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">AMD KDS (Key Distribution Service)</h3>
        <p>
          <strong>AMD 운영 공개 서비스</strong>: 칩 ID + TCB 버전 입력 → 해당 칩의 VCEK 인증서 반환<br />
          URL: <code>https://kdsintf.amd.com/vcek/v1/{'{processor}'}/{'{hwId}'}</code><br />
          오프라인 환경에선 인증서 사전 캐싱 필요 — AMD SEV snp-provision 도구 사용
        </p>

      </div>
      <div className="not-prose mb-4"><VerifierFullFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">인증서 체인 상세</h3>
      </div>
      <div className="mt-8">
        <AttestationViz />
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">SNP 증명 시퀀스</h3>
        <SNPAttestFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 통합 — snpguest 도구</h3>
      </div>
      <div className="not-prose mb-4"><SnpguestToolViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: VCEK의 보안 속성</p>
          <p>
            <strong>VCEK 특성</strong>:<br />
            - 칩 ID (chip_id) + TCB 버전에 결속<br />
            - TCB 업데이트 시 새 VCEK 발급 → 자동 invalidation<br />
            - Old TCB VCEK는 AMD KDS가 반환 거부 (정책 따라)
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            ✓ TCB 강제 — 최신 microcode 없으면 증명 실패<br />
            ✓ vulnerability 패치 시 강제 업그레이드 가능<br />
            ✓ 칩별 고유 → 칩 도난 시 추적
          </p>
          <p className="mt-2">
            <strong>단점</strong>:<br />
            ✗ AMD KDS 서비스 의존<br />
            ✗ 오프라인 환경은 사전 캐싱 필요<br />
            ✗ TCB 변경 시 verifier 정책도 업데이트 필요
          </p>
        </div>

      </div>
    </section>
  );
}
