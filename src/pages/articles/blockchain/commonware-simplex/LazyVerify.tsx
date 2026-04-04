import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import LazyVerifyViz from './viz/LazyVerifyViz';

export default function LazyVerify({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (k: string) => onCodeRef(k, codeRefs[k]);
  return (
    <section id="lazy-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Lazy Verification & Batcher</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          기존 합의 — 모든 수신 메시지를 즉시 서명 검증. 메시지 N개 x 검증 비용 = 높은 CPU 부하
          <br />
          Simplex Batcher의 Lazy Verification — <strong>쿼럼 도달 시에만 배치 검증</strong>
        </p>
        <p className="leading-7">
          <code>VoteTracker</code> — notarizes/nullifies/finalizes 3종 <code>AttributableMap</code>으로 투표 수집
          <br />
          검증자당 1표만 허용 (signer 인덱스 키). 쿼럼 도달 전까지는 저장만 수행
          <br />
          <code>Scheme::is_batchable()</code>이 true인 서명 스킴(ed25519 등)에서만 활성화
        </p>
        <p className="leading-7">
          <strong>구현 인사이트:</strong> Batcher가 별도 actor — 투표 수집·검증을 Voter에서 분리
          <br />
          Voter는 검증된 인증서만 수신 → 합의 로직이 서명 검증 복잡도에서 완전 격리
          <br />
          3개 네트워크 채널(vote/certificate/resolver) 분리로 인증서가 투표보다 먼저 도착하면 short-circuit
        </p>
      </div>
      <div className="not-prose flex flex-wrap gap-2 mb-4">
        <CodeViewButton onClick={() => open('vote-tracker')} />
        <span className="text-[10px] text-muted-foreground self-center">VoteTracker</span>
        <CodeViewButton onClick={() => open('notarization-type')} />
        <span className="text-[10px] text-muted-foreground self-center">Notarization (N3f1)</span>
      </div>
      <div className="not-prose mb-8">
        <LazyVerifyViz onOpenCode={open} />
      </div>
    </section>
  );
}
