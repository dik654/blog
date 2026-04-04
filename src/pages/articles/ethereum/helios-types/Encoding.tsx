import type { CodeRef } from '@/components/code/types';
import EncodingViz from './viz/EncodingViz';

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function Encoding({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="encoding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CL 타입은 SSZ(Simple Serialize)로 직렬화한다.
          서명 검증 시 Fork와 Domain이 결합되어 포크 간 리플레이 공격을 방지한다.
        </p>
      </div>

      {/* Viz: 3 steps — SSZ 인코딩, Fork 타임라인, Domain 합성 */}
      <div className="not-prose my-8">
        <EncodingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} SSZ vs RLP</strong><br />
          Reth(EL)는 RLP — 가변 길이 접두사로 중첩 구조를 표현한다.
          SSZ는 고정 크기 필드를 바로 연결하여 파싱 O(1)을 달성한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Domain이 필요한 이유</strong><br />
          같은 헤더 메시지라도 SYNC_COMMITTEE(0x07)와 BEACON_PROPOSER(0x00)는 다른 도메인을 사용한다.
          용도별 서명 분리로 한 서명을 다른 맥락에서 재사용할 수 없다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} genesis_validators_root의 역할</strong><br />
          메인넷과 테스트넷의 genesis_validators_root가 다르다.
          따라서 같은 포크 버전이라도 네트워크가 다르면 Domain이 달라진다.
        </p>
      </div>
    </section>
  );
}
