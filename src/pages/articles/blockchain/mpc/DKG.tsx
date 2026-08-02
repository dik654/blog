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
          DKG(Distributed Key Generation, 분산 키 생성)는 신뢰할 수 있는 딜러(trusted dealer) 없이 여러 참가자가 협력해 공동 public key와 각자의 key share를 생성하는 protocol family입니다.
          <br />
          아래 분산 소수 생성과 Paillier modulus는 특정 threshold ECDSA 구현에서 쓰는 보조 키 생성 경로입니다. 공동 ECDSA key의 DKG와 Paillier 보조 키 생성은 같은 단계가 아닙니다.
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

        <h3>보조 Paillier modulus의 분산 생성</h3>
        <CodePanel
          title="분산 modulus 생성 · 개념 흐름"
          code={PRIME_CODE}
          annotations={[
            { lines: [5, 9], color: 'sky', note: '비밀 contribution으로 후보 share 구성' },
            { lines: [11, 12], color: 'emerald', note: 'p와 q가 아닌 N만 공개' },
            { lines: [14, 17], color: 'amber', note: 'Protocol-specific biprimality test' },
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

        <h3>임계값 서명 (Threshold ECDSA · 개념 흐름)</h3>
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
