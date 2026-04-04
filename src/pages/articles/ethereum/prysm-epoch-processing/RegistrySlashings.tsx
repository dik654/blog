import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function RegistrySlashings({ onCodeRef }: Props) {
  return (
    <section id="registry-slashings" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">레지스트리 & 슬래싱</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-slashings', codeRefs['process-slashings'])} />
          <span className="text-[10px] text-muted-foreground self-center">AttestingBalance()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 churn_limit 제한</strong> — 한 에폭에 활성화/이탈할 수 있는 검증자 수를 제한<br />
          급격한 검증자 집합 변동을 방지하여 네트워크 안정성 확보<br />
          슬래싱 패널티 = slashed_balance * 슬래싱 비율 / total_balance
        </p>
      </div>
    </section>
  );
}
