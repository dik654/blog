import CodePanel from '@/components/ui/code-panel';
import ShamirShareViz from '../components/ShamirShareViz';
import { MATH_CODE, PYTHON_CODE, INTEGER_CODE } from './ShamirData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Shamir({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="shamir" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Shamir 비밀 분산'}</h2>
      <div className="not-prose mb-8"><ShamirShareViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Shamir 비밀 분산(SSS, Secret Sharing Scheme)은 비밀 s를 n개의 "공유(share)"로 나눕니다.
          <br />
          t+1개 이상의 공유가 있어야만 복원할 수 있습니다.
          <br />
          t개 이하의 공유로는 s에 대해 어떤 정보도 얻을 수 없습니다 (정보이론적 보안).
        </p>

        <h3>수학적 기초</h3>
        <CodePanel
          title="Shamir 비밀 분산 수학적 구조"
          code={MATH_CODE}
          annotations={[
            { lines: [3, 5], color: 'sky', note: '비밀을 다항식 상수항으로 설정' },
            { lines: [8, 8], color: 'emerald', note: '각 참가자에게 f(i) 배포' },
            { lines: [11, 11], color: 'amber', note: '라그랑주 보간으로 복원' },
            { lines: [17, 19], color: 'violet', note: '정보이론적 보안 보장' },
          ]}
        />

        <h3>Python 구현 예시</h3>
        <CodePanel
          title="Shamir SSS Python 구현"
          code={PYTHON_CODE}
          annotations={[
            { lines: [3, 8], color: 'sky', note: '비밀 분산 함수' },
            { lines: [10, 19], color: 'emerald', note: '라그랑주 보간 복원' },
          ]}
        />

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('vss-create', codeRefs['vss-create'])} />
            <span className="text-[10px] text-muted-foreground self-center">feldman_vss.go · Create</span>
            <CodeViewButton onClick={() => onCodeRef('vss-verify', codeRefs['vss-verify'])} />
            <span className="text-[10px] text-muted-foreground self-center">Verify</span>
            <CodeViewButton onClick={() => onCodeRef('vss-reconstruct', codeRefs['vss-reconstruct'])} />
            <span className="text-[10px] text-muted-foreground self-center">ReConstruct</span>
          </div>
        )}

        <h3>정수 위의 Shamir (MPC용)</h3>
        <p>
          표준 Shamir는 유한체 위에서 동작합니다.
          <br />
          MPC에서는 정수 위의 Shamir를 사용합니다.
          <br />
          마스킹 범위를 넓혀 통계적 보안을 보장합니다.
        </p>
        <CodePanel
          title="정수 위 Shamir (MPC용)"
          code={INTEGER_CODE}
          annotations={[
            { lines: [2, 3], color: 'sky', note: 'Shamir 소수 계산' },
            { lines: [5, 7], color: 'amber', note: '통계적 보안 마스킹 범위' },
          ]}
        />
      </div>
    </section>
  );
}
