import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SessionKeyViz from './viz/SessionKeyViz';

export default function Session({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="session" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">세션 키 도출과 암호화</h2>

      <div className="not-prose mb-8"><SessionKeyViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          핸드셰이크 완료 후 양측은 동일한 세션 키를 도출한다.<br />
          이후 모든 메시지는 AES-128-GCM으로 암호화된다.
        </p>

        <h3>ECDH 공유 비밀</h3>
        <p>
          임시(ephemeral) 개인키와 수신자 정적 공개키로 스칼라 곱셈을 수행한다.<br />
          결과는 33바이트 compressed point.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('ecdh', codeRefs['ecdh'])} />
          <span className="text-[10px] text-muted-foreground self-center">ecdh() — 공유 비밀 생성</span>
        </div>

        <h3>HKDF-SHA256 키 도출</h3>
        <p>
          공유 비밀을 HKDF에 입력하여 writeKey(16B) + readKey(16B)를 추출한다.
          info에 양측 nodeID를 포함하여 방향성을 부여한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('derive-keys', codeRefs['derive-keys'])} />
          <span className="text-[10px] text-muted-foreground self-center">deriveKeys() — HKDF 세션 키 도출</span>
        </div>

        <h3>키 방향: keysFlipped</h3>
        <p>
          발신자의 <code>writeKey</code>는 수신자의 <code>readKey</code>다.<br />
          수신자는 <code>session.keysFlipped()</code>로 키를 뒤집어 저장한다.
        </p>

        <h3>AES-GCM 암호화</h3>
        <p>
          세션 키 확립 후 모든 메시지는 AES-128-GCM으로 암호화된다.
          nonce 12바이트, AAD로 패킷 헤더를 사용하여 헤더 변조도 감지한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('encrypt-gcm', codeRefs['encrypt-gcm'])} />
          <span className="text-[10px] text-muted-foreground self-center">encryptGCM() — AES-GCM 암호화</span>
        </div>

        <div className="not-prose rounded-lg border border-violet-500/20 bg-violet-500/5 p-4 my-6">
          <p className="font-semibold text-sm text-violet-400">SessionCache</p>
          <p className="text-sm mt-1">
            확립된 세션은 <code>(srcID, addr)</code> 키로 LRU(용량 1024)에 저장된다.<br />
            이후 같은 노드와는 핸드셰이크 없이 즉시 암호화 메시지를 교환한다.
          </p>
        </div>
      </div>
    </section>
  );
}
