import CodePanel from '@/components/ui/code-panel';
import MPCThresholdViz from '../components/MPCThresholdViz';
import MPCArchViz from './viz/MPCArchViz';
import { THRESHOLD_CODE } from './OverviewData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { Link } from 'react-router-dom';
import { QuestionLead } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '구현 범위 & 보안 모델'}</h2>
      <QuestionLead
        question="이 글의 2t+1 조건과 Paillier round를 모든 MPC wallet에 그대로 적용해도 될까?"
        answer={<>아니다. 이 글은 특정 threshold ECDSA 구현에서 쓰는 Shamir 곱셈, Paillier와 MtA 코드 경로를 읽는 심화 글이다. 개념 경계와 제품 trust model은 먼저 <Link to={articlePath('crypto', 'wallet-key-management-map')}>지갑 키 관리 지도</Link>와 <Link to={articlePath('crypto', 'threshold-wallet-signing')}>SSS → MPC/TSS</Link>에서 고정한다.</>}
      />
      <div className="not-prose mb-8"><MPCThresholdViz /></div>
      <div className="not-prose mb-8"><MPCArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MPC(Multi-Party Computation, 다자간 계산)는 여러 참가자가 <strong>서로의 비밀 입력을 공개하지 않고</strong> 함께 함수를 계산하는 암호학의 넓은 분야입니다.
          <br />
          이 글은 그 전체를 일반화하지 않고, tss-lib 계열에서 볼 수 있는 Shamir·Paillier·MtA와 threshold ECDSA 코드 경로를 구현 사례로 읽습니다.
        </p>

        <h3>보안 모델을 먼저 고정하기</h3>
        <p>
          <strong>Semi-honest</strong>는 참가자가 protocol을 따르면서 transcript에서 정보를 더 얻으려는 모델입니다. 지갑 signing에서는 잘못된 message를 보내거나
          중간에 abort하는 <strong>malicious</strong> 참가자, signing 사이에 침해 대상이 바뀌는 adaptive corruption까지 고려할 수 있습니다. 어떤 모델을
          만족하는지는 protocol, proof, channel과 구현 버전에 따라 다릅니다.
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {[
            { name: '정확성', desc: '허용된 실패 안에서 생성한 signature가 검증됨' },
            { name: '비밀성', desc: 'threshold 미만의 침해로 공동 secret을 학습하지 못함' },
            { name: '강건성', desc: '악성 message·abort를 탐지하고 실패 주체를 다룰 수 있음' },
          ].map(p => (
            <div key={p.name} className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
              <p className="font-semibold text-sm text-indigo-400">{p.name}</p>
              <p className="text-sm mt-1 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>

        <h3>이 예제의 2t+1 조건</h3>
        <p>
          아래 <code>n ≥ 2t+1</code>은 이 글의 Shamir share 곱셈에서 다항식 차수가 <code>2t</code>로 증가하는 특정 계산을 복원하기 위한 조건입니다.
          모든 MPC와 모든 threshold signature에 공통인 법칙이 아닙니다. 제품 문서에서는 signing threshold와 corruption threshold의 표기부터 확인해야 합니다.
        </p>
        <CodePanel
          title="임계값 보안 조건"
          code={THRESHOLD_CODE}
          annotations={[
            { lines: [2, 4], color: 'sky', note: '기본 조건과 파라미터' },
            { lines: [6, 9], color: 'emerald', note: '2t+1이 필요한 이유' },
            { lines: [11, 13], color: 'amber', note: '통계적 보안 파라미터' },
          ]}
        />

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('keygen-round1', codeRefs['keygen-round1'])} />
            <span className="text-[10px] text-muted-foreground self-center">keygen/round_1.go</span>
            <CodeViewButton onClick={() => onCodeRef('signing-round1', codeRefs['signing-round1'])} />
            <span className="text-[10px] text-muted-foreground self-center">signing/round_1.go</span>
          </div>
        )}

        <h3>주요 응용</h3>
        <ul>
          <li><strong>임계값 ECDSA/Schnorr 계열</strong>: 원본 개인키를 복원하지 않고 공동 서명</li>
          <li><strong>분산 키 생성(DKG)</strong>: 신뢰할 수 있는 딜러 없이 key share와 public key 생성</li>
          <li><strong>프라이버시 보존 ML</strong>: 데이터 공개 없이 모델 학습</li>
          <li><strong>비공개 집합 교차(PSI)</strong>: 두 집합의 공통 원소만 확인</li>
        </ul>
      </div>
    </section>
  );
}
