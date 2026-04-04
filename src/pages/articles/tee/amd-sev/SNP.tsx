import RMPViz from './viz/RMPViz';
import RMPEntryViz from './viz/RMPEntryViz';
import VMPLPermsViz from './viz/VMPLPermsViz';
import MeasurementChainViz from './viz/MeasurementChainViz';
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
        <h3>RMP (Reverse Map Table)</h3>
        <p>
          RMP — 모든 물리 메모리 페이지의 메타데이터 테이블<br />
          각 엔트리 — 페이지 소유자(하이퍼바이저 vs 게스트),
          유효 GPA 매핑, VMPL 권한 기록
        </p>
      </div>
      <RMPEntryViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>VMPL (VM Permission Level)</h3>
        <p>
          게스트 VM 내부를 0~3 단계 권한으로 계층화<br />
          VMPL 0 — 최고 권한(게스트 내 신뢰 환경), VMPL 3 — 최저
        </p>
      </div>
      <VMPLPermsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>측정 체인 (Measurement Chain)</h3>
        <p>
          SEV-SNP — 게스트 런치 각 단계를 측정(hash)하여 누적<br />
          펌웨어 → BIOS → 부트로더 → 커널 이미지까지 전체 부트 체인 반영
        </p>
      </div>
      <MeasurementChainViz />
    </section>
  );
}
