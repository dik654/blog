import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Topics({ onCodeRef }: Props) {
  return (
    <section id="topics" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">토픽 & 포크 다이제스트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Prysm은 토픽 이름에 <strong>포크 다이제스트</strong>를 프리픽스로 붙인다.<br />
          포크 다이제스트 = SHA256(제네시스 검증자 루트 + 포크 버전)[:4]
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('message-handler', codeRefs['message-handler'])} />
          <span className="text-[10px] text-muted-foreground self-center">subscribe()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">주요 토픽</h3>
        <ul>
          <li><code>/eth2/{'{digest}'}/beacon_block/ssz_snappy</code> — 블록 전파</li>
          <li><code>/eth2/{'{digest}'}/beacon_attestation_{'{subnet}'}/ssz_snappy</code> — 어테스테이션</li>
          <li><code>/eth2/{'{digest}'}/sync_committee_{'{subnet}'}/ssz_snappy</code> — 싱크 커미티</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 포크 자동 격리</strong> — 하드포크 시 포크 다이제스트가 변경되어<br />
          이전 포크 토픽의 메시지가 자연스럽게 무시됨<br />
          수동 버전 체크 없이 네트워크 분리가 보장되는 설계
        </p>
      </div>
    </section>
  );
}
