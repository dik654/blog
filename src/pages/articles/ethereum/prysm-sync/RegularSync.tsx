import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function RegularSync({ onCodeRef }: Props) {
  return (
    <section id="regular-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Regular Sync</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          초기 동기화가 완료되면 Regular Sync 모드로 전환한다.<br />
          GossipSub를 통해 새 블록을 실시간으로 수신하고 처리한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('save-received-block', codeRefs['save-received-block'])} />
          <span className="text-[10px] text-muted-foreground self-center">processBlock()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">실시간 처리 흐름</h3>
        <ul>
          <li><strong>GossipSub 수신</strong> — beacon_block 토픽에서 블록 도착</li>
          <li><strong>검증</strong> — 서명, 제안자, 부모 존재 여부 확인</li>
          <li><strong>상태 전환</strong> — 슬롯 처리 + 블록 처리 실행</li>
          <li><strong>Fork Choice 갱신</strong> — OnBlock() 호출로 헤드 재계산</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 BlocksByRoot 폴백</strong> — GossipSub 전파 지연이나 네트워크 분할 시<br />
          누락된 블록을 BlocksByRoot RPC로 개별 요청<br />
          가십 실패에 대한 안전망 역할
        </p>
      </div>
    </section>
  );
}
