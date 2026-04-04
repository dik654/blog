import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import P2PAuthViz from './viz/P2PAuthViz';

interface Props {
  onCodeRef: (k: string, r: CodeRef) => void;
}

export default function P2PAuth({ onCodeRef }: Props) {
  return (
    <section id="p2p-auth" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">p2p::authenticated 코드 분석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>X25519 ECDH</strong> → 임시 키 교환 → HKDF → ChaCha20-Poly1305 암호화
          <br />
          non-contributory 검사로 약한 키 거부 — exchange() 실패 시 연결 중단
          <br />
          Signer 기반 피어 인증 후 Channel(u64)로 다중화
        </p>
        <p className="leading-7">
          Sender trait 4단계 계층 — 프로토콜별 적절한 전송 제어 수준 선택
          <br />
          <strong>block!</strong> 매크로로 악성 피어 즉시 격리
        </p>
      </div>
      <div className="not-prose mb-8">
        <P2PAuthViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
