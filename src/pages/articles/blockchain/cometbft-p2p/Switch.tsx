import SwitchViz from './viz/SwitchViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Switch({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="switch" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Switch & Peer 관리</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Switch — Reactor 등록, 피어 연결 수락/다이얼, 메시지 브로드캐스트를 총괄하는 허브.<br />
        각 step에서 AddReactor → OnStart → DialPeersAsync 순서로 초기화 과정을 추적한다.
      </p>
      <div className="not-prose"><SwitchViz onOpenCode={open} /></div>
      <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
        <strong>💡</strong> AddReactor()에서 이미 등록된 channelID를 다시 등록하면 panic.
        채널 ID 충돌을 프로토콜 레벨에서 강제하여 라우팅 오류를 원천 차단한다.
      </p>
    </section>
  );
}
