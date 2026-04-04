import CodePanel from '@/components/ui/code-panel';
import MPCThresholdViz from '../components/MPCThresholdViz';
import MPCArchViz from './viz/MPCArchViz';
import { THRESHOLD_CODE } from './OverviewData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 보안 모델'}</h2>
      <div className="not-prose mb-8"><MPCThresholdViz /></div>
      <div className="not-prose mb-8"><MPCArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MPC(Multi-Party Computation, 다자간 계산)는 여러 참가자가 <strong>서로의 비밀 입력을 공개하지 않고</strong> 함께 함수를 계산하는 암호학 프로토콜입니다.
          <br />
          분산 키 생성(DKG), 임계값 서명(Threshold Signature), 프라이버시 보존 분석 등에 사용됩니다.
        </p>

        <h3>반정직 보안 모델 (Semi-Honest)</h3>
        <p>
          대부분의 실용적 MPC 프로토콜은 <strong>반정직(semi-honest)</strong> 적대자를 가정합니다.
          <br />
          적대자는 프로토콜을 정직하게 따르되, 수신한 메시지로 추가 정보를 얻으려 합니다.
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {[
            { name: '정확성', desc: '정직한 참가자들은 올바른 결과를 얻음' },
            { name: '프라이버시', desc: '적대자는 정직한 참가자의 비밀을 학습할 수 없음' },
            { name: '임계값', desc: 'n ≥ 2t+1 조건 (t: 최대 악의적 참가자 수)' },
          ].map(p => (
            <div key={p.name} className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
              <p className="font-semibold text-sm text-indigo-400">{p.name}</p>
              <p className="text-sm mt-1 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>

        <h3>임계값 조건</h3>
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
          <li><strong>임계값 ECDSA/EdDSA</strong>: 개인키를 분산 보관, n-of-m 서명</li>
          <li><strong>분산 키 생성(DKG)</strong>: 신뢰할 수 있는 딜러 없이 Paillier 키 생성</li>
          <li><strong>프라이버시 보존 ML</strong>: 데이터 공개 없이 모델 학습</li>
          <li><strong>비공개 집합 교차(PSI)</strong>: 두 집합의 공통 원소만 확인</li>
        </ul>
      </div>
    </section>
  );
}
