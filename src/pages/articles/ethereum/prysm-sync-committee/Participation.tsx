import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Participation({ onCodeRef }: Props) {
  return (
    <section id="participation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">위원회 참여 & 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('submit-sync-msg', codeRefs['submit-sync-msg'])} />
          <span className="text-[10px] text-muted-foreground self-center">SubmitSyncCommitteeMessage()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 서명 도메인 분리</strong> — DomainSyncCommittee는 어테스테이션(DOMAIN_BEACON_ATTESTER)과 다른 도메인<br />
          같은 블록 루트에 대해 두 가지 서명이 생성되지만 도메인이 달라 충돌하지 않음<br />
          256에폭(~27시간) 주기로 위원회 교체 — 중복 선정 허용
        </p>
      </div>
    </section>
  );
}
