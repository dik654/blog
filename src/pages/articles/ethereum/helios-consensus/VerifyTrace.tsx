import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import VerifyTraceViz from './viz/VerifyTraceViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function VerifyTrace({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="verify-trace" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          verify_sync_committee_sig()는 5단계로 구성된다.<br />
          비트맵 필터링 → 정족수 확인 → 공개키 합산 → signing_root → 페어링 비교.
        </p>
      </div>

      {/* Viz: 6 step — 각 단계를 시각적으로 추적 */}
      <div className="not-prose my-8">
        <VerifyTraceViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} BLS 선형성이 핵심</strong><br />
          개별 서명: sig_i = sk_i · H(m). 집계 서명: sig = (Σ sk_i) · H(m).<br />
          따라서 개별 검증 480회 = 집계 검증 1회. 이 선형성 덕분에 경량 클라이언트가 가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 도메인 분리</strong><br />
          DOMAIN_SYNC_COMMITTEE(0x07) + fork_version + genesis_validators_root → 3중 보호.<br />
          없으면 Beacon proposer용 서명을 Sync Committee 서명으로 재사용 가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Reth 비교</strong><br />
          Reth도 attestation 검증에 동일한 BLS 페어링을 사용한다.
          차이: Reth는 수만 건 attestation, Helios는 슬롯당 1건.
        </p>
      </div>

      {/* 소스 보기 */}
      <div className="not-prose mt-4">
        <div className="flex items-center gap-2 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-verify-filter', codeRefs['hl-verify-filter'])} />
          <span className="text-[10px] text-muted-foreground">verify.rs — 비트맵 필터링 + 정족수</span>
        </div>
        <div className="flex items-center gap-2 mt-1 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-verify-bls', codeRefs['hl-verify-bls'])} />
          <span className="text-[10px] text-muted-foreground">verify.rs — BLS 합산 + 페어링</span>
        </div>
        <div className="flex items-center gap-2 mt-1 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-verify-root', codeRefs['hl-verify-root'])} />
          <span className="text-[10px] text-muted-foreground">verify.rs — signing_root 도메인 분리</span>
        </div>
      </div>
    </section>
  );
}
