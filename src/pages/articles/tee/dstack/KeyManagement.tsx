import KMSKeyViz from './viz/KMSKeyViz';
import KeyMgmtStepViz from './viz/KeyMgmtStepViz';
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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// dstack KMS 키 계층

// Level 0: Root Key
// - KMS TEE가 생성 (TDX Root Seal)
// - 다른 곳에 절대 노출 안 됨
// - HUK에서 파생 또는 랜덤 생성

// Level 1: Cluster Key
// - 동일 deployment cluster 공유
// - 여러 VM이 같은 cluster 안에서 협력
cluster_key = HKDF(root_key, "cluster:" + cluster_id)

// Level 2: App Key
// - 같은 app image + manifest
// - VM 재시작 후에도 동일
app_key = HKDF(cluster_key, "app:" + app_id)

// Level 3: Instance Key
// - 각 VM instance마다 고유
// - VM 생성 시 새 nonce 포함
instance_key = HKDF(app_key, "instance:" + instance_nonce)

// Level 4: Session Key
// - 일회용 세션 키
session_key = HKDF(instance_key, "session:" + session_id)

// 장점
// ✓ App 재시작 후 동일 key 복구 (persistent storage)
// ✓ Instance 간 격리 (같은 app이라도)
// ✓ Cluster 멤버 간 협력 가능
// ✓ Minimal root key exposure`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">App ID 계산</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// app_id는 배포된 앱의 "identity"
// 결정론적 → 같은 배포는 항상 같은 app_id

app_id = SHA256(
    manifest.compose_yaml ||       // Docker compose 내용
    manifest.mrtd ||                // TD 이미지 해시
    manifest.policy_hash ||         // KMS 정책
    manifest.owner_pubkey ||        // 소유자 공개키
)

// Docker Compose 파일 변경 시
// - manifest.compose_yaml 변경
// - → app_id 변경
// - → 새 app_key 파생
// - 이전 데이터에 접근 불가 (migration 필요)

// 같은 compose, 같은 이미지, 같은 정책
// - 동일 app_id 유지
// - 재배포 시 데이터 보존
// - 복구 가능한 key store

// 업그레이드 전략
// Option A: 새 compose yaml → 새 app_id (격리)
// Option B: Policy-based key sharing
//   - 같은 owner의 여러 app_id가 공유 key
//   - 주요 key를 owner_pubkey 기반 파생
//   - App 변경해도 root data 접근 유지`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">KMS API 엔드포인트</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// dstack-kms HTTP API

// 1) 앱 등록 (owner가 수행, RA-TLS 필수)
POST /api/v1/apps/register
{
  "app_id": "...",
  "policy": { "allowed_mrtd": [...], "allowed_rtmr": {...} },
  "owner_pubkey": "..."
}

// 2) Attestation + 키 요청 (guest agent가 수행)
POST /api/v1/attest
{
  "quote": "<base64 TDX quote>",
  "app_id": "...",
  "requested_keys": ["db_password", "api_token"]
}
// Response (attestation 통과 시):
{
  "status": "ok",
  "keys": {
    "db_password": "<encrypted>",
    "api_token": "<encrypted>"
  }
}

// 3) Secret 업데이트 (owner가 수행)
POST /api/v1/apps/{app_id}/secrets
Headers: Authorization: Signed-Request
{
  "name": "db_password",
  "value": "<encrypted with app_key>"
}

// 4) Cluster 정보 조회
GET /api/v1/clusters/{cluster_id}/members
// List of active TDX VMs in cluster

// 5) Key rotation
POST /api/v1/apps/{app_id}/rotate
// 새 epoch 시작, 이전 key는 grace period 동안 유효`}</pre>

      </div>
      <div className="not-prose mt-6">
        <KeyMgmtStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Persistent Storage 암호화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// VM volume 암호화 (dstack 기본 활성화)

// 1) VM 생성 시 volume 마운트
volumes:
  data:
    driver: dstack-encrypted  # dstack이 제공하는 volume driver

// 2) Guest agent가 key 요청
volume_key = kms_client.get_volume_key("data")

// 3) LUKS 또는 dm-crypt로 암호화
cryptsetup luksFormat /dev/sdb
cryptsetup luksOpen /dev/sdb encrypted_data \\
    --key-file <(echo "$volume_key")
mkfs.ext4 /dev/mapper/encrypted_data
mount /dev/mapper/encrypted_data /data

// 4) VM 종료 시 key는 메모리에서만 사라짐
// → Host가 disk 훔쳐도 평문 접근 불가

// 5) VM 재시작 시
// - Guest agent가 attestation
// - 같은 app_id → 같은 volume_key
// - 기존 데이터 복호화 성공

// 영속성 보장
// - Host 시스템 재부팅 OK
// - VM migration 시 TEK로 재암호화
// - Disk hardware 교체 시 복구 불가 (다른 VM 호스트)`}</pre>

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
