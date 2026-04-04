import type { CodeRef } from '@/components/code/types';
import KeyDerivationViz from './viz/KeyDerivationViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function KeyDerivation({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="key-derivation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BIP-44 키 파생 & 로컬 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          니모닉(12/24단어) → PBKDF2(2048라운드) → 64바이트 시드.
          <br />
          키 스트레칭으로 브루트포스 공격을 억제한다.
        </p>
        <p className="leading-7">
          시드를 HMAC-SHA512에 넣으면 <strong>마스터 키</strong>와 <strong>체인 코드</strong>가 나온다.
          <br />
          BIP-44 경로 <code>m/44'/60'/0'/0/0</code>으로 이더리움 자식 키를 파생한다.
        </p>
        <p className="leading-7">
          모든 키 파생과 서명이 로컬에서 수행된다.
          <br />
          비밀키가 RPC 서버에 전송되지 않는다. 프라이버시의 기본 전제다.
        </p>
      </div>
      <div className="not-prose"><KeyDerivationViz /></div>
    </section>
  );
}
