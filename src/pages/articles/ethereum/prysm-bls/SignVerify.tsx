import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function SignVerify({ onCodeRef }: Props) {
  return (
    <section id="sign-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">서명 &middot; 검증 &middot; 집계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">Sign(sk, msg)</h3>
        <p>
          메시지를 G2 포인트로 해시 매핑(<code>hash-to-curve</code>) 후,<br />
          비밀키 스칼라와 곱한다. 결과: 96바이트 G2 포인트 = 서명.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Verify(pk, msg, sig)</h3>
        <p>
          패어링 등식 <code>e(sig, G2_gen) == e(H(msg), pk)</code>를 검증한다.<br />
          G2 위의 서명과 G1 위의 공개키 사이 패어링 2회 연산.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('bls-verify', codeRefs['bls-verify'])} />
          <span className="text-[10px] text-muted-foreground self-center">Verify()</span>
          <CodeViewButton onClick={() => onCodeRef('bls-fast-agg-verify', codeRefs['bls-fast-agg-verify'])} />
          <span className="text-[10px] text-muted-foreground self-center">FastAggregateVerify()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 FastAggregateVerify 핵심</strong> — 동일 메시지에 대한 다수 서명자 검증 최적화<br />
          pk를 모두 합산한 뒤 패어링 1회만 수행<br />
          O(n) 포인트 덧셈 + O(1) 패어링 = 수천 서명을 밀리초 단위로 검증
        </p>
      </div>
    </section>
  );
}
