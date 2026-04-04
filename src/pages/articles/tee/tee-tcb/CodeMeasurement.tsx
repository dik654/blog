import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function CodeMeasurement({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="code-measurement" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">코드: EINIT & LAUNCH_MEASURE</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">SGX MRENCLAVE 계산 과정</h3>
        <p>
          Enclave 생성 시 CPU가 SHA-256 해시 체인을 단계별로 구성합니다<br />
          <strong>ECREATE</strong>(초기화) → <strong>EADD</strong>(페이지 추가) → <strong>EEXTEND</strong>(256B씩 해시 확장) → <strong>EINIT</strong>(최종 측정값 잠금)
        </p>
        <p>
          EEXTEND는 4KB 페이지를 256바이트씩 16회 나눠 해시에 포함합니다<br />
          코드 <strong>한 바이트</strong>만 변경되어도 MRENCLAVE 값이 완전히 달라집니다
        </p>
        <div className="flex gap-2 mt-2 mb-6">
          <CodeViewButton onClick={() => onCodeRef('mrenclave-measurement', codeRefs['mrenclave-measurement'])} />
          <span className="text-[10px] text-muted-foreground self-center">measurement.c — ECREATE · EADD · EEXTEND · EINIT 전체 흐름</span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">AMD SEV LAUNCH_MEASURE</h3>
        <p>
          AMD SEV는 <strong>펌웨어(AMD SP)</strong>가 게스트 VM의 초기 메모리 해시를 계산합니다<br />
          호스트 OS는 측정 과정에 개입할 수 없어, 게스트 무결성을 보장합니다
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">TPM PCR Extend</h3>
        <p>
          PCR 확장은 단방향 연산입니다 — 이전 값을 복원할 수 없습니다<br />
          부팅 체인의 각 단계가 PCR을 확장하면, 최종 PCR 값이 전체 부팅 경로를 요약합니다
        </p>
        <div className="flex gap-2 mt-2">
          <CodeViewButton onClick={() => onCodeRef('tpm-pcr-extend', codeRefs['tpm-pcr-extend'])} />
          <span className="text-[10px] text-muted-foreground self-center">measurement.c — TPM PCR extend 연산</span>
        </div>
      </div>
    </section>
  );
}
