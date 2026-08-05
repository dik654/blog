import KMTrustViz from './viz/KMTrustViz';
import KeyManagerStepsViz from './viz/KeyManagerStepsViz';
import KeyHierarchyViz from './viz/KeyHierarchyViz';
import KeyRequestViz from './viz/KeyRequestViz';
import MasterReplicationViz from './viz/MasterReplicationViz';
import KmPolicyViz from './viz/KmPolicyViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function KeyManager({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="key-manager" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '키 매니저 & 런타임 보안'}</h2>
      <div className="not-prose mb-8"><KMTrustViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Key Manager 역할</h3>
        <p>
          <strong>Key Manager(KM)</strong>: 기밀 ParaTime의 마스터 키를 관리하는 특수 런타임<br />
          <strong>SGX 안에서 실행</strong> — 키는 엔클레이브 내부에서만 평문<br />
          <strong>인증된 컴퓨트 노드</strong>에만 파생 키 제공 — Quote 검증 필수<br />
          <strong>Oasis Core와 별개 바이너리</strong> — 독립 번들, 독립 위원회
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">키 계층 구조</h3>
      </div>
      <div className="not-prose mb-4"><KeyHierarchyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('km-secrets-api', codeRefs['km-secrets-api'])} />
            <span className="text-[10px] text-muted-foreground self-center">secrets/api.go · RPC 정의</span>
            <CodeViewButton onClick={() => onCodeRef('km-status', codeRefs['km-status'])} />
            <span className="text-[10px] text-muted-foreground self-center">Status · 시크릿 회전</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-3">Compute Node → KM 키 요청</h3>
      </div>
      <div className="not-prose mb-4"><KeyRequestViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Master Secret Replication</h3>
      </div>
      <div className="not-prose mb-4"><MasterReplicationViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">KM Policy — Governance 제어</h3>
      </div>
      <div className="not-prose mb-4"><KmPolicyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">신뢰 체인 · 키 파생 · 키 요청 · dm-verity</h3>
      </div>
      <KeyManagerStepsViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: KM의 현실적 제약</p>
          <p>
            <strong>마스터 키 손실 시나리오</strong>:<br />
            - KM 위원회 전원 동시 하드웨어 고장<br />
            - SGX sealing 키 손상<br />
            - Quote 실패로 전원 복제 불가<br />
            → 모든 기밀 상태 복호화 불가능 → 시스템 dead
          </p>
          <p className="mt-2">
            <strong>현실적 완화</strong>:<br />
            ✓ 지리적 분산 KM 노드 (동시 고장 확률 최소화)<br />
            ✓ 주기적 health check + alerting<br />
            ✓ 다양한 하드웨어 벤더 조합 (Dell, HPE, Supermicro)<br />
            ✓ 비상시 emergency proposal 경로
          </p>
          <p className="mt-2">
            <strong>근본적 한계</strong>:<br />
            ✗ "TEE 기반 분산 키 관리"는 전통 HSM 대비 복잡<br />
            ✗ Quote 검증 인프라 의존 (Intel PCS)<br />
            ✗ MPC 기반 KM 검토 중 (tKMS 프로젝트)
          </p>
        </div>

      </div>
    </section>
  );
}
