import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BlstBinding({ onCodeRef }: Props) {
  return (
    <section id="blst-binding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BLST CGo 바인딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Prysm은 <strong>supranational/blst</strong> C 라이브러리를 CGo로 래핑한다.<br />
          Go → C → x86-64 어셈블리 체인으로, 순수 Go 구현 대비 약 10배 빠르다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">호출 체인</h3>
        <ul>
          <li><strong>Go 레이어</strong> — <code>secretKey.Sign(msg)</code> 인터페이스</li>
          <li><strong>CGo 레이어</strong> — <code>blst_sign_pk_in_g1()</code> C 함수 호출</li>
          <li><strong>어셈블리</strong> — AVX-512/ADX 명령어로 필드 연산 가속</li>
        </ul>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('bls-sign', codeRefs['bls-sign'])} />
          <span className="text-[10px] text-muted-foreground self-center">Sign() CGo 체인</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 DST (Domain Separation Tag)</strong> — BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_<br />
          용도별 서명 분리: 어테스테이션, 블록 제안, 동기 위원회가 같은 키를 써도<br />
          교차 사용이 불가능하도록 도메인을 분리하는 보안 메커니즘
        </p>
      </div>
    </section>
  );
}
