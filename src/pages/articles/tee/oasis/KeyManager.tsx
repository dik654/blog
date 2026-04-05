import KMTrustViz from './viz/KMTrustViz';
import KeyManagerStepsViz from './viz/KeyManagerStepsViz';
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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 키 파생 계층 (HKDF 체인)

// Level 0: Master Secret
//   - KM enclave 내부에서 SGX sealing으로 보관
//   - 주기적 rotation (에포크 경계)
//   - 초기: EGETKEY → enclave-unique sealing
//   - 이후: 새 마스터는 이전 마스터로 파생

master_secret = generate_or_unseal()

// Level 1: Runtime Root Key
//   - 각 Runtime(ParaTime)마다 독립
runtime_root_key[R] = HKDF(master_secret, "runtime:" || R.ID)

// Level 2: Contract Key
//   - 각 컨트랙트 주소마다 독립
contract_key[C] = HKDF(runtime_root_key[R], "contract:" || C.address)

// Level 3: Slot Encryption Key
//   - 각 storage slot
slot_key[S] = HKDF(contract_key[C], "slot:" || S.index)

// 장점
// - 컨트랙트가 유출돼도 해당 컨트랙트만 영향
// - KM 마스터 보호 = 전체 시스템 보호
// - 결정적 파생 → 재계산 가능`}</pre>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('km-secrets-api', codeRefs['km-secrets-api'])} />
            <span className="text-[10px] text-muted-foreground self-center">secrets/api.go · RPC 정의</span>
            <CodeViewButton onClick={() => onCodeRef('km-status', codeRefs['km-status'])} />
            <span className="text-[10px] text-muted-foreground self-center">Status · 시크릿 회전</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-3">Compute Node → KM 키 요청</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// keymanager/api/secrets.go

// Compute 노드가 특정 runtime의 키 받기
type LongTermKeyRequest struct {
    Height     uint64
    RuntimeID  common.Namespace
    KeyPairID  common.Namespace   // 컨트랙트별
    Epoch      beacon.EpochTime
}

// KM 노드 처리
func (kme *KMEnclave) HandleLongTermKey(req LongTermKeyRequest) (*KeyPair, error) {
    // 1) 요청자 Quote 검증 (KM RPC는 RA-TLS로 보호됨)
    quote := getPeerQuote()
    if !verifyQuote(quote) {
        return nil, errors.New("unverified peer")
    }

    // 2) MRENCLAVE가 해당 runtime에 속하는지
    if !isApprovedRuntimeEnclave(quote.MRENCLAVE, req.RuntimeID) {
        return nil, errors.New("wrong runtime enclave")
    }

    // 3) KM 정책 검증
    policy := getPolicyForRuntime(req.RuntimeID)
    if !policy.Allow(quote.MRSIGNER, quote.MRENCLAVE) {
        return nil, errors.New("policy denied")
    }

    // 4) 키 파생 & 반환
    rootKey := deriveRuntimeKey(req.RuntimeID)
    contractKey := deriveContractKey(rootKey, req.KeyPairID)

    // 5) 응답은 peer public key로 암호화
    return encryptResponse(contractKey, quote.publicKey)
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Master Secret Replication</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// KM 위원회는 N개 노드 (일반적으로 3~5)
// 각 노드가 동일한 master_secret 보유 필요
// But: 처음 노드는 어떻게 받을까?

// Solution: TEE-to-TEE 복제
// 1) New KM node가 enclave 시작
// 2) Existing KM node와 RA-TLS handshake
// 3) Existing node가 new node Quote 검증 (MRENCLAVE, policy)
// 4) Master secret을 TLS 채널로 전송
// 5) New node가 SGX sealing으로 저장

// Replication 보안
// - RA-TLS → Host MITM 불가
// - MRENCLAVE 검증 → 악성 바이너리 거부
// - Governance policy → 승인된 MRENCLAVE만 KM 가능

// 회전 (epoch rotation)
// Every epoch boundary:
//   new_master = HKDF(old_master, beacon.entropy)
//   new_master를 위원회에 전파
//   old_master는 일정 기간 유지 (이전 키로 암호화된 상태 복호화용)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">KM Policy — Governance 제어</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// keymanager/api/policy.go

type Policy struct {
    // 허용된 Runtime MRENCLAVE (컴퓨트 노드)
    Enclaves map[MRENCLAVE]EnclavePolicy

    // KM MRENCLAVE (자기 자신 정의)
    MRENCLAVE MRENCLAVE

    // 서명 (governance vote)
    Signatures []Signature
}

type EnclavePolicy struct {
    // MRSIGNER + MRENCLAVE 조합 허용
    MayQuery          map[RuntimeID]bool
    MayReplicate      []MRENCLAVE    // 이 enclave로부터 복제 허용
}

// 업데이트 흐름
// 1) 거버넌스 proposal: PolicyUpdate
// 2) 검증인 voting (2/3 threshold)
// 3) 통과 시 KM 노드들이 새 policy 로드
// 4) 이후 요청은 새 policy로 검증

// 예: 새 Sapphire 버전 배포
// - 새 MRENCLAVE_NEW 계산
// - Governance proposal: Enclaves[MRENCLAVE_NEW] = {MayQuery: Sapphire}
// - 통과 시 새 컴퓨트 노드가 키 받을 수 있음`}</pre>

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
