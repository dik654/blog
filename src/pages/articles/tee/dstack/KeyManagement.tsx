import KMSKeyViz from './viz/KMSKeyViz';
import KeyMgmtStepViz from './viz/KeyMgmtStepViz';
import KeyHierarchyDstackViz from './viz/KeyHierarchyDstackViz';
import AppIdCalcViz from './viz/AppIdCalcViz';
import KmsApiViz from './viz/KmsApiViz';
import VolumeEncryptViz from './viz/VolumeEncryptViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function KeyManagement({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="key-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '계층적 키 관리 시스템'}</h2>
      <div className="not-prose mb-8"><KMSKeyViz /></div>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mb-6">
          <CodeViewButton onClick={() => onCodeRef('key-derive', codeRefs['key-derive'])} />
          <span className="text-[10px] text-muted-foreground self-center">HKDF 키 유도</span>
          <CodeViewButton onClick={() => onCodeRef('ra-tls', codeRefs['ra-tls'])} />
          <span className="text-[10px] text-muted-foreground self-center">RA-TLS 인증서</span>
        </div>
      )}
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">KMS 핵심 — 결정론적 키 파생</h3>
        <p>
          <strong>HKDF-SHA256</strong>: HMAC 기반 Key Derivation Function<br />
          <strong>계층적 구조</strong>: Root → Cluster → App → Instance 키<br />
          <strong>결정론성</strong>: 같은 App ID → VM 재시작 후에도 동일 키<br />
          <strong>안전성</strong>: Root 키는 KMS 내부 TEE에만 존재
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">키 계층 구조</h3>
      </div>
      <div className="not-prose mb-6"><KeyHierarchyDstackViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">App ID 계산</h3>
      </div>
      <div className="not-prose mb-6"><AppIdCalcViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">KMS API 엔드포인트</h3>
      </div>
      <div className="not-prose mb-6"><KmsApiViz /></div>
      <div className="not-prose mt-6">
        <KeyMgmtStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Persistent Storage 암호화</h3>
      </div>
      <div className="not-prose mb-6"><VolumeEncryptViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 결정론적 vs 랜덤 key</p>
          <p>
            <strong>랜덤 key (전통 방식)</strong>:<br />
            - VM 시작 시 새 key 생성<br />
            - Key 분실 시 데이터 손실<br />
            - Backup·escrow 인프라 필요<br />
            - 더 안전하지만 운영 복잡
          </p>
          <p className="mt-2">
            <strong>결정론적 key (dstack)</strong>:<br />
            ✓ 같은 app ID → 같은 key<br />
            ✓ Backup 자동 (app_id만 보존)<br />
            ✓ Stateless recovery<br />
            ✓ Key escrow는 app_id derivation<br />
            ✗ Root key 유출 시 모든 하위 key 노출
          </p>
          <p className="mt-2">
            <strong>dstack의 완화</strong>:<br />
            - Root key는 KMS TEE 내부에만<br />
            - KMS TEE 자체가 attestation 대상<br />
            - Multi-tenant 격리는 HKDF로<br />
            - Emergency rotation 지원
          </p>
        </div>

      </div>
    </section>
  );
}
