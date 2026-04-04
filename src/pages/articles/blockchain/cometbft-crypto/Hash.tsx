import { codeRefs } from './codeRefs';
import TMHASHViz from './viz/TMHASHViz';
import type { CodeRef } from '@/components/code/types';

export default function Hash({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="hash" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TMHASH & 해시 체인</h2>
      <div className="not-prose mb-8">
        <TMHASHViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 SHA256 전체가 아닌 20바이트</strong> — Tendermint 초기 설계에서 BTC의 RIPEMD160(SHA256(x)) 패턴을 참고.<br />
          ETH 주소 길이(20B)와 호환, 네트워크 대역폭 37% 절약. 충돌 저항성 2^80으로 충분.
        </p>
      </div>
    </section>
  );
}
