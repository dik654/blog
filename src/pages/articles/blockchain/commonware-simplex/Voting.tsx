import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import VotingFlowViz from './viz/VotingFlowViz';
import NullifyTimeoutViz from './viz/NullifyTimeoutViz';

export default function Voting({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (k: string) => onCodeRef(k, codeRefs[k]);
  return (
    <section id="voting" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Propose → Vote → Finalize 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>정상 경로 (2 라운드):</strong>
          <br />
          try_propose → Notarize → Notarization(2f+1) → certify → Finalize → Finalization(2f+1) → 즉시 다음 뷰
        </p>
        <p className="leading-7">
          <strong>구현 인사이트:</strong> Notarization만으로는 다음 뷰 진입 불가 — <code>certified()</code> 성공 후에야 <code>enter_view(next)</code>
          <br />
          이유: notarization은 "투표 모임" 증명이지만, 앱이 블록 유효성을 최종 확인(certify)해야 안전
          <br />
          CometBFT의 Precommit과 달리 Simplex는 notarize(1차) + certify(앱 확인) + finalize(2차) 3단계
        </p>
      </div>
      <div className="not-prose flex flex-wrap gap-2 mb-4">
        <CodeViewButton onClick={() => open('try-propose')} />
        <span className="text-[10px] text-muted-foreground self-center">try_propose()</span>
        <CodeViewButton onClick={() => open('construct-notarize')} />
        <span className="text-[10px] text-muted-foreground self-center">construct_notarize()</span>
        <CodeViewButton onClick={() => open('broadcast-notarization')} />
        <span className="text-[10px] text-muted-foreground self-center">broadcast_notarization()</span>
        <CodeViewButton onClick={() => open('certified')} />
        <span className="text-[10px] text-muted-foreground self-center">certified()</span>
        <CodeViewButton onClick={() => open('add-finalization')} />
        <span className="text-[10px] text-muted-foreground self-center">add_finalization()</span>
      </div>
      <div className="not-prose mb-8">
        <VotingFlowViz onOpenCode={open} />
      </div>

      <h3 className="text-xl font-semibold mb-4">Timeout 경로: construct_nullify</h3>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>leader_timeout</strong> 만료 → <code>construct_nullify()</code> → Nullify 투표 브로드캐스트
          <br />
          <strong>certification_timeout</strong> 만료 → 제안은 받았지만 인증 미진행 → 역시 nullify
          <br />
          2f+1 Nullify → Nullification 인증서 → 해당 뷰 skip 증명 완료
        </p>
        <p className="leading-7">
          <strong>구현 인사이트:</strong> Round의 <code>broadcast_finalize</code> 플래그가 true이면 nullify 생략
          <br />
          이미 finalize 투표를 보냈다면 해당 뷰를 skip할 이유가 없음 — 충돌하는 두 경로를 상호 배제
        </p>
      </div>
      <div className="not-prose flex flex-wrap gap-2 mb-4">
        <CodeViewButton onClick={() => open('construct-nullify')} />
        <span className="text-[10px] text-muted-foreground self-center">construct_nullify()</span>
        <CodeViewButton onClick={() => open('broadcast-nullification')} />
        <span className="text-[10px] text-muted-foreground self-center">broadcast_nullification()</span>
      </div>
      <div className="not-prose mb-8">
        <NullifyTimeoutViz onOpenCode={open} />
      </div>
    </section>
  );
}
