import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ConnectionGating({ onCodeRef: _ }: Props) {
  return (
    <section id="connection-gating" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">연결 게이팅</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>ConnectionGater</code>는 libp2p의 인터페이스로,<br />
          연결 수립 전·후에 필터링 로직을 삽입한다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">게이팅 규칙</h3>
        <ul>
          <li><strong>InterceptPeerDial</strong> — 아웃바운드 연결 시 밴 리스트 확인</li>
          <li><strong>InterceptAccept</strong> — 인바운드 연결 속도 제한 (IP당 N/분)</li>
          <li><strong>InterceptSecured</strong> — 핸드셰이크 후 피어 ID 밴 확인</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Eclipse 공격 방어</strong> — 같은 /16 서브넷에서 3개 이상 연결 시 점수를 대폭 감점<br />
          아웃바운드 연결을 일정 비율 이상 유지해 공격자가 피어 테이블을 장악하기 어렵게 함<br />
          IP Colocation 패널티가 핵심 방어 메커니즘
        </p>
      </div>
    </section>
  );
}
