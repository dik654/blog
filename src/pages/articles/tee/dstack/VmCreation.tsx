import VmFlowViz from './viz/VmFlowViz';
import TDXProvisionFlowViz from './viz/TDXProvisionFlowViz';
import VmCreationStepViz from './viz/VmCreationStepViz';
import ComposeToVmViz from './viz/ComposeToVmViz';
import DstackArchViz from './viz/DstackArchViz';
import MeasurementCalcViz from './viz/MeasurementCalcViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function VmCreation({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="vm-creation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'VM 생성 & 프로비저닝'}</h2>
      <div className="not-prose mb-8"><VmFlowViz /></div>
      <div className="not-prose mb-8">
        <h3 className="text-lg font-semibold mb-3">TDX VM 프로비저닝 시퀀스</h3>
        <TDXProvisionFlowViz />
      </div>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mb-6">
          <CodeViewButton onClick={() => onCodeRef('td-create', codeRefs['td-create'])} />
          <span className="text-[10px] text-muted-foreground self-center">TdVm::new()</span>
          <CodeViewButton onClick={() => onCodeRef('manifest-flow', codeRefs['manifest-flow'])} />
          <span className="text-[10px] text-muted-foreground self-center">create_vm() 흐름</span>
        </div>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">dstack VM 생성 흐름</h3>
        <p>
          <strong>사용자 입력</strong>: Docker Compose 파일 + 간단한 manifest<br />
          <strong>VMM 자동화</strong>: TDX 활성화, 포트 매핑, attestation, 키 발급<br />
          <strong>핵심 혁신</strong>: 개발자가 TEE 디테일 몰라도 기밀 VM 배포 가능<br />
          <strong>바탕</strong>: dstack-tdx (Phala Network) — Kata Containers + Intel TDX
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Docker Compose → Confidential VM</h3>
      </div>
      <div className="not-prose mb-6"><ComposeToVmViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">dstack 아키텍처</h3>
      </div>
      <div className="not-prose mb-6"><DstackArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">TD Measurement 계산</h3>
      </div>
      <div className="not-prose mb-6"><MeasurementCalcViz /></div>
      <div className="not-prose mt-6">
        <VmCreationStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: dstack의 혁신점</p>
          <p>
            <strong>UX 혁신</strong>:<br />
            - Docker Compose 표준 사용 (새 개념 없음)<br />
            - 개발자가 TEE 몰라도 사용 가능<br />
            - CI/CD 통합 간단
          </p>
          <p className="mt-2">
            <strong>기술적 기여</strong>:<br />
            - Reproducible TDX image builds<br />
            - KMS 자동 통합 (attestation → secrets)<br />
            - Kata Containers 기반 (검증된 프레임워크)
          </p>
          <p className="mt-2">
            <strong>생태계</strong>:<br />
            - Phala Network 주도 개발<br />
            - Confidential Containers 프로젝트와 협력<br />
            - 오픈소스 (github.com/Dstack-TEE)
          </p>
        </div>

      </div>
    </section>
  );
}
