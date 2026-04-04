import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function GraffitiRandao({ onCodeRef: _ }: Props) {
  return (
    <section id="graffiti-randao" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RANDAO Reveal & Graffiti</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 RANDAO Reveal</strong> — 제안자가 domain_randao + 에폭을 BLS로 서명한 값<br />
          검증 가능하면서도 예측 불가능한 랜덤 소스로 활용<br />
          reveal을 XOR하여 randaoMixes를 갱신, 다음 에폭 위원회 배정에 사용
        </p>
        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-4">
          <strong>💡 BLS 서명 & 브로드캐스트</strong> — 완성된 블록을 제안자의 BLS 개인키로 서명<br />
          SignedBeaconBlock을 gossipsub beacon_block 토픽에 게시<br />
          다른 노드는 수신 후 onBlock()으로 검증 처리
        </p>
      </div>
    </section>
  );
}
