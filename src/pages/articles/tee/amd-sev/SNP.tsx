import RMPViz from './viz/RMPViz';
import RMPEntryViz from './viz/RMPEntryViz';
import VMPLPermsViz from './viz/VMPLPermsViz';
import MeasurementChainViz from './viz/MeasurementChainViz';
import RMPEntryStructViz from './viz/RMPEntryStructViz';
import PvalidateFlowViz from './viz/PvalidateFlowViz';
import VMPLHierarchyViz from './viz/VMPLHierarchyViz';
import MeasurementAccumViz from './viz/MeasurementAccumViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function SNP({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="snp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'SEV-SNP 핵심 메커니즘'}</h2>
      <div className="not-prose mb-8">
        <RMPViz />
      </div>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mb-6">
          <CodeViewButton onClick={() => onCodeRef('rmp-entry', codeRefs['rmp-entry'])} />
          <span className="text-[10px] text-muted-foreground self-center">RMP 엔트리 구조</span>
          <CodeViewButton onClick={() => onCodeRef('vmpl-perms', codeRefs['vmpl-perms'])} />
          <span className="text-[10px] text-muted-foreground self-center">VMPL 권한 마스크</span>
          <CodeViewButton onClick={() => onCodeRef('pvalidate', codeRefs['pvalidate'])} />
          <span className="text-[10px] text-muted-foreground self-center">PVALIDATE 구현</span>
        </div>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">RMP (Reverse Map Table)</h3>
        <p>
          <strong>RMP</strong>: 모든 물리 메모리 페이지의 메타데이터 테이블 (BIOS가 할당)<br />
          각 엔트리가 <strong>페이지 소유자</strong>(hypervisor/guest), <strong>유효 GPA</strong>, <strong>VMPL 권한</strong> 기록<br />
          메모리 접근마다 CPU가 RMP 조회 → 위반 시 <strong>RMP Fault</strong><br />
          <strong>크기</strong>: 4KB 페이지당 16B → 1TB 메모리 = 4GB RMP
        </p>

      </div>
      <div className="not-prose mb-4"><RMPEntryStructViz /></div>
      <RMPEntryViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">PVALIDATE — Guest가 페이지 검증</h3>
      </div>
      <div className="not-prose mb-4"><PvalidateFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">VMPL (VM Permission Level)</h3>
        <p>
          게스트 VM 내부를 <strong>0~3 단계</strong>로 권한 계층화<br />
          VMPL 0 = 최고 권한 (guest 내 신뢰 서비스), VMPL 3 = 최저 (일반 앱)<br />
          <strong>페이지별 VMPL 권한 설정</strong> → 특정 레벨만 접근 가능
        </p>

      </div>
      <div className="not-prose mb-4"><VMPLHierarchyViz /></div>
      <VMPLPermsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">측정 체인 (Measurement Chain)</h3>
        <p>
          <strong>SEV-SNP</strong>: 게스트 런치 각 단계를 측정(hash)하여 누적<br />
          펌웨어 → BIOS → 부트로더 → 커널 이미지 → 초기 데이터 전체 부트 체인 반영<br />
          <strong>Attestation Report</strong>에 포함되어 원격 검증 가능
        </p>

      </div>
      <div className="not-prose mb-4"><MeasurementAccumViz /></div>
      <MeasurementChainViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: RMP vs Intel S-EPT</p>
          <p>
            <strong>Intel TDX S-EPT</strong>:<br />
            - Extended Page Table 기반 (MMU walk)<br />
            - Stage 2 번역 + 권한<br />
            - TD Module이 관리
          </p>
          <p className="mt-2">
            <strong>AMD SEV-SNP RMP</strong>:<br />
            - 별도 flat table (PA indexed)<br />
            - MMU walk 후 추가 검사<br />
            - ASP firmware가 관리
          </p>
          <p className="mt-2">
            <strong>trade-off</strong>:<br />
            - RMP: 단순, 큰 메모리 → 큰 table (4GB/TB)<br />
            - S-EPT: 계층적, 희소 메모리 효율적<br />
            - 둘 다 hypervisor 재매핑 공격 방어<br />
            - SNP가 PVALIDATE로 guest-side validation 추가 (TDX의 ACCEPT와 유사)
          </p>
        </div>

      </div>
    </section>
  );
}
