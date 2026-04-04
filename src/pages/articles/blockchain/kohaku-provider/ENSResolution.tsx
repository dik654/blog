import type { CodeRef } from '@/components/code/types';
import ENSResolutionViz from './viz/ENSResolutionViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ENSResolution({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="ens-resolution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ENS 경량 해석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          ENS(Ethereum Name Service) — <code>vitalik.eth</code> → <code>0xd8dA..6045</code> 변환.
          <br />
          일반 지갑은 RPC 서버에 ENS 해석을 위임한다. 서버가 가짜 주소를 반환할 수 있다.
        </p>
        <p className="leading-7">
          Kohaku — Helios 경량 클라이언트로 ENS 레지스트리와 리졸버를 직접 조회한다.
          <br />
          모든 응답이 Merkle 증명으로 검증되므로 위변조가 불가능하다.
        </p>
        <p className="leading-7">
          namehash는 도메인 라벨을 <strong>오른쪽부터 재귀적으로</strong> keccak256 해싱한다.
          <br />
          <code>keccak256(keccak256(0x0 || keccak256("eth")) || keccak256("vitalik"))</code>.
        </p>
      </div>
      <div className="not-prose"><ENSResolutionViz /></div>
    </section>
  );
}
