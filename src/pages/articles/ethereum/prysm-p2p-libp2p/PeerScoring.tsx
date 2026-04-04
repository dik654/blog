import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PeerScoring({ onCodeRef }: Props) {
  return (
    <section id="peer-scoring" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">피어 스코어링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Prysm은 4가지 스코어러를 합산해 피어 품질을 평가한다.<br />
          점수가 임계값 이하로 떨어지면 연결을 끊고 IP를 블랙리스트에 추가한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('peer-score', codeRefs['peer-score'])} />
          <span className="text-[10px] text-muted-foreground self-center">Score()</span>
          <CodeViewButton onClick={() => onCodeRef('peer-decay', codeRefs['peer-decay'])} />
          <span className="text-[10px] text-muted-foreground self-center">Decay()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">스코어 구성</h3>
        <ul>
          <li><strong>Gossip Score</strong> — 토픽별 메시지 전달 품질</li>
          <li><strong>Block Provider</strong> — 블록 응답 속도 및 정확도</li>
          <li><strong>Peer Status</strong> — 체인 헤드·Finalized 에폭 일치도</li>
          <li><strong>Bad Response</strong> — 잘못된 응답 횟수 기반 감점</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 지수 감쇠 설계</strong> — Decay()가 주기적으로 호출되어 오래된 점수를 지수적으로 감쇠<br />
          일시적 장애(네트워크 불안정 등)로 인한 영구 불이익을 방지<br />
          정상 복귀한 피어가 자연스럽게 점수를 회복하는 자가 치유 메커니즘
        </p>
      </div>
    </section>
  );
}
