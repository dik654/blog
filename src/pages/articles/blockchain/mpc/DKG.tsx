import CodePanel from '@/components/ui/code-panel';
import DKGRoundsViz from '../components/DKGRoundsViz';
import DKGProtocolViz from './viz/DKGProtocolViz';
import { INIT_CODE, PRIME_CODE, MODULUS_CODE, THRESHOLD_SIGN_CODE } from './DKGData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function DKG({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="dkg" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '분산 키 생성 (DKG)'}</h2>
      <div className="not-prose mb-8"><DKGRoundsViz /></div>
      <div className="not-prose mb-8"><DKGProtocolViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          DKG(Distributed Key Generation, 분산 키 생성)는 신뢰할 수 있는 딜러(trusted dealer) 없이 여러 참가자가 협력해 Paillier 키 쌍을 생성하는 프로토콜입니다.
          <br />
          어떤 t개의 참가자가 협력해도 비밀키를 복원할 수 없습니다.
        </p>

        <h3>프로토콜 초기화</h3>
        <CodePanel
          title="DKG 초기화 (Python)"
          code={INIT_CODE}
          annotations={[
            { lines: [2, 5], color: 'sky', note: '보안 파라미터 설정' },
            { lines: [7, 8], color: 'emerald', note: '두 가지 Shamir 스킴' },
            { lines: [10, 14], color: 'amber', note: '공정한 인덱스 할당' },
          ]}
        />

        <h3>소수 생성 단계</h3>
        <CodePanel
          title="분산 소수 생성"
          code={PRIME_CODE}
          annotations={[
            { lines: [4, 5], color: 'sky', note: '독립적 소수 후보 생성' },
            { lines: [7, 11], color: 'emerald', note: '소수성 필터링 (빠른 테스트 + Miller-Rabin)' },
            { lines: [13, 17], color: 'amber', note: '분산 Jacobi 기호 검증' },
          ]}
        />

        <h3>분산 곱셈으로 N 계산</h3>
        <CodePanel
          title="분산 곱셈으로 N = p*q 계산"
          code={MODULUS_CODE}
          annotations={[
            { lines: [5, 8], color: 'sky', note: 'Shamir 공유 곱셈 (차수 2t)' },
            { lines: [10, 12], color: 'emerald', note: '2t+1개로 N 재구성' },
            { lines: [15, 16], color: 'amber', note: 'p, q 비밀 유지' },
          ]}
        />

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('keygen-round1', codeRefs['keygen-round1'])} />
            <span className="text-[10px] text-muted-foreground self-center">keygen/round_1.go</span>
            <CodeViewButton onClick={() => onCodeRef('mta-protocol', codeRefs['mta-protocol'])} />
            <span className="text-[10px] text-muted-foreground self-center">MtA 프로토콜</span>
            <CodeViewButton onClick={() => onCodeRef('signing-round1', codeRefs['signing-round1'])} />
            <span className="text-[10px] text-muted-foreground self-center">signing/round_1.go</span>
          </div>
        )}

        <h3>임계값 서명 (Threshold ECDSA)</h3>
        <CodePanel
          title="Threshold ECDSA 서명"
          code={THRESHOLD_SIGN_CODE}
          annotations={[
            { lines: [3, 4], color: 'sky', note: '분산 개인키와 공개키' },
            { lines: [7, 11], color: 'emerald', note: '부분 서명 생성 및 결합' },
          ]}
        />
      </div>
    </section>
  );
}
