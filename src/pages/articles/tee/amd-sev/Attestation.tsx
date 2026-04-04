import AttestationViz from './viz/AttestationViz';
import SNPAttestFlowViz from './viz/SNPAttestFlowViz';
import ReportStructViz from './viz/ReportStructViz';
import VerifyFlowViz from './viz/VerifyFlowViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Attestation({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '원격 증명 (Remote Attestation)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          원격 증명(Remote Attestation) — 신뢰할 수 없는 클라우드에서
          게스트 VM의 <strong>신원과 무결성</strong>을 원격 검증하는 메커니즘<br />
          "이 코드가 정말 SEV-SNP 보호 하에 변조 없이 실행 중인가?"를 수학적으로 증명
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('attest-report', codeRefs['attest-report'])} />
            <span className="text-[10px] text-muted-foreground self-center">AttestationReport 구조체</span>
            <CodeViewButton onClick={() => onCodeRef('guest-request', codeRefs['guest-request'])} />
            <span className="text-[10px] text-muted-foreground self-center">get_report() 드라이버</span>
          </div>
        )}

        <h3>SNP Attestation Report 구조</h3>
      </div>
      <ReportStructViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>증명 흐름</h3>
        <p>
          테넌트 애플리케이션이 클라우드의 게스트를 검증하는 전체 과정
        </p>
      </div>
      <VerifyFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>AMD KDS (Key Distribution Service)</h3>
        <p>
          AMD 운영 공개 서비스 — 칩 ID + TCB 버전 입력 → 해당 칩의 VCEK 인증서 반환<br />
          오프라인 환경에서는 인증서 사전 캐싱 필요
        </p>
      </div>
      <div className="mt-8">
        <AttestationViz />
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">SNP 증명 시퀀스</h3>
        <SNPAttestFlowViz />
      </div>
    </section>
  );
}
