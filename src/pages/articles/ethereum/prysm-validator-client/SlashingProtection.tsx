import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function SlashingProtection({ onCodeRef }: Props) {
  return (
    <section id="slashing-protection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">슬래싱 방지 DB</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('validator-loop', codeRefs['validator-loop'])} />
          <span className="text-[10px] text-muted-foreground self-center">Run() — 슬래싱 체크 포함</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 서라운드 투표 방지</strong> — source/target 범위가 이전 투표를 감싸거나 감싸이면 슬래싱 대상<br />
          서명 전에 SlashingProtectionDB 조회로 이중 투표 + 범위 교차 확인<br />
          EIP-3076 교환 형식으로 검증자 이전 시 슬래싱 이력 JSON 이동
        </p>
      </div>
    </section>
  );
}
