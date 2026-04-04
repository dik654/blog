import CodePanel from '@/components/ui/code-panel';
import PaillierHomViz from '../components/PaillierHomViz';
import { MATH_CODE, HOMOMORPHIC_CODE, DISTRIBUTED_CODE } from './PaillierData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Paillier({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="paillier" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Paillier 동형 암호화'}</h2>
      <div className="not-prose mb-8"><PaillierHomViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Paillier 암호화 시스템은 <strong>덧셈 동형성(Additive Homomorphism)</strong>을 가진 공개키 암호 시스템입니다.
          <br />
          암호문 상태에서 덧셈과 스칼라 곱셈을 수행할 수 있습니다.
          <br />
          MPC의 분산 키 생성과 비공개 계산에 핵심적으로 사용됩니다.
        </p>

        <h3>수학적 구조</h3>
        <CodePanel
          title="Paillier 키 생성 / 암호화 / 복호화"
          code={MATH_CODE}
          annotations={[
            { lines: [2, 6], color: 'sky', note: '키 생성 (RSA 모듈러스)' },
            { lines: [10, 16], color: 'emerald', note: '암호화 (g^m * r^N mod N²)' },
            { lines: [18, 21], color: 'amber', note: '복호화 (L 함수 적용)' },
          ]}
        />

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('paillier-keygen', codeRefs['paillier-keygen'])} />
            <span className="text-[10px] text-muted-foreground self-center">GenerateKeyPair</span>
            <CodeViewButton onClick={() => onCodeRef('paillier-encrypt', codeRefs['paillier-encrypt'])} />
            <span className="text-[10px] text-muted-foreground self-center">Encrypt / HomoAdd</span>
            <CodeViewButton onClick={() => onCodeRef('paillier-decrypt', codeRefs['paillier-decrypt'])} />
            <span className="text-[10px] text-muted-foreground self-center">Decrypt</span>
          </div>
        )}

        <h3>동형 연산</h3>
        <CodePanel
          title="Paillier 동형 연산"
          code={HOMOMORPHIC_CODE}
          annotations={[
            { lines: [1, 9], color: 'sky', note: '덧셈 동형성 증명' },
            { lines: [14, 18], color: 'emerald', note: '스칼라 곱셈' },
            { lines: [20, 26], color: 'violet', note: '가중합 (내적) 응용' },
          ]}
        />

        <h3>분산 복호화</h3>
        <CodePanel
          title="분산 Paillier 복호화"
          code={DISTRIBUTED_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: 'Shamir 분산 비밀키' },
            { lines: [5, 9], color: 'emerald', note: '부분 복호화' },
            { lines: [11, 14], color: 'amber', note: 't+1개로 최종 복호화' },
          ]}
        />
      </div>
    </section>
  );
}
