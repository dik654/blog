import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import HandshakeFlowViz from './viz/HandshakeFlowViz';

export default function Handshake({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="handshake" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WHOAREYOU 핸드셰이크</h2>

      <div className="not-prose mb-8"><HandshakeFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          discv5 패킷 헤더의 <code>Flag</code> 필드가 핸드셰이크 상태를 결정한다.
        </p>
        <div className="not-prose grid grid-cols-3 gap-3 my-6">
          {[
            { flag: '0 (flagMessage)', desc: '세션 키로 암호화된 일반 메시지' },
            { flag: '1 (flagWhoareyou)', desc: 'WHOAREYOU 챌린지 패킷' },
            { flag: '2 (flagHandshake)', desc: '핸드셰이크 응답 + 암호화 메시지' },
          ].map(f => (
            <div key={f.flag} className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
              <p className="font-mono text-xs font-bold text-sky-400">{f.flag}</p>
              <p className="text-sm mt-1">{f.desc}</p>
            </div>
          ))}
        </div>

        <h3>핸드셰이크 트리거</h3>
        <p>
          세션 없는 노드의 패킷은 복호화 불가. <code>handleUnknown</code>이 WHOAREYOU 챌린지를 전송한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('handle-unknown', codeRefs['handle-unknown'])} />
          <span className="text-[10px] text-muted-foreground self-center">handleUnknown() — WHOAREYOU 챌린지 생성</span>
        </div>

        <h3>ID 서명 생성</h3>
        <p>
          챌린지를 받은 발신자는 정적 키로 서명을 생성한다.
          <br />
          입력: <code>SHA256("discovery v5 identity proof" | challengeData | ephPubkey | destID)</code>.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('id-nonce-hash', codeRefs['id-nonce-hash'])} />
          <span className="text-[10px] text-muted-foreground self-center">idNonceHash() — 서명 해시 계산</span>
        </div>

        <h3>핸드셰이크 응답 재전송</h3>
        <p>
          WHOAREYOU를 받으면 <code>handleWhoareyou</code>가 원래 호출을 핸드셰이크 패킷(flag=2)으로 재전송한다.
          <br />
          서명, 임시 공개키, 새 ENR이 포함된다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('handle-whoareyou', codeRefs['handle-whoareyou'])} />
          <span className="text-[10px] text-muted-foreground self-center">handleWhoareyou() — 핸드셰이크 재전송</span>
        </div>
      </div>
    </section>
  );
}
