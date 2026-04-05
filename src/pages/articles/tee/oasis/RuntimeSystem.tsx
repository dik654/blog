import RuntimeSystemViz from './viz/RuntimeSystemViz';
import BundleStructViz from './viz/BundleStructViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function RuntimeSystem({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="runtime-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">런타임 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Bundle Manager</strong>가 .orc 번들을 다운로드·검증<br />
          <strong>Runtime Loader</strong>가 SGX 엔클레이브 또는 네이티브 프로세스로 런타임 로딩<br />
          <strong>Runtime Host</strong>가 실행 환경 관리, <strong>컴퓨트 워커</strong>가 트랜잭션 처리<br />
          <strong>IPC</strong>로 Host ↔ Runtime 통신 — CBOR 직렬화 + Unix socket
        </p>
      </div>

      <RuntimeSystemViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Runtime Host — TEE 프로세스 관리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// go/runtime/host/sgx/sgx.go

// SGX Runtime Host
type sgxProvisioner struct {
    loader      string  // runtime-loader 바이너리 경로
    sandbox     *sandboxProvisioner
    sgxLoader   *aesm.Client  // AESM(Architectural Enclave Svc Manager)
}

// 런타임 바이너리 적재
func (s *sgxProvisioner) NewRuntime(cfg host.Config) (host.Runtime, error) {
    // 1) .orc 번들에서 .sgxs(signed enclave) 추출
    enclaveBinary := cfg.Bundle.Manifest.Components[0].SGX.Executable

    // 2) SIGSTRUCT(서명) 검증
    sig := cfg.Bundle.Manifest.Components[0].SGX.Signature
    if !verifySigstruct(enclaveBinary, sig) {
        return nil, errors.New("invalid sigstruct")
    }

    // 3) MRENCLAVE 계산 및 등록된 값과 대조
    mrenclave := computeMRENCLAVE(enclaveBinary)
    if mrenclave != cfg.Runtime.MRENCLAVE {
        return nil, errors.New("MRENCLAVE mismatch")
    }

    // 4) 별도 프로세스로 runtime-loader 실행
    proc := exec.Command(s.loader, "--runtime", enclaveBinary)
    proc.Start()

    // 5) IPC 채널 설정
    ipc := connectIPC(proc.Stderr)
    return &sgxRuntime{process: proc, ipc: ipc}, nil
}

// 프로세스 격리
// - Runtime은 독립 프로세스
// - Sandbox: seccomp + namespace + cgroup
// - SGX 엔클레이브로 이중 격리`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">IPC 프로토콜 — Host ↔ Runtime</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// go/runtime/host/protocol/

// 메시지 타입
type Body struct {
    // Host → Runtime
    HostPingRequest           *Empty
    HostRPCCallRequest        *HostRPCCallRequest
    HostStorageSyncRequest    *HostStorageSyncRequest
    HostLocalStorageGetRequest *HostLocalStorageGetRequest
    HostRegistryGetRequest    *HostRegistryGetRequest

    // Runtime → Host
    RuntimeInfoRequest        *Empty
    RuntimeExecuteTxBatchRequest *ExecuteTxBatchRequest
    RuntimeAbortRequest       *Empty
    RuntimeKeyManagerStatusUpdateRequest *StatusUpdateRequest
    // ...
}

// 메시지 프레임
struct Frame {
    uint32_t length;     // big-endian, payload length
    uint8_t  payload[];  // CBOR serialized Body
}

// 핫스팟 요청
// 1) ExecuteTxBatch: 트랜잭션 배치 실행
// 2) HostStorageSync: Runtime이 Host에 스토리지 sync 요청
// 3) HostRPCCall: Runtime이 KeyManager 호출 (키 요청)
// 4) RuntimeKeyManagerStatusUpdate: KM 상태 알림`}</pre>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('dispatcher', codeRefs['dispatcher'])} />
            <span className="text-[10px] text-muted-foreground self-center">dispatcher.rs · 런타임 디스패처</span>
            <CodeViewButton onClick={() => onCodeRef('executor-worker', codeRefs['executor-worker'])} />
            <span className="text-[10px] text-muted-foreground self-center">worker.go · Executor</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-3">Executor 워커 — 트랜잭션 배치 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// go/worker/compute/executor/committee/node.go

// Executor는 각 라운드마다 배치 실행
func (n *Node) processBatch(batch *Batch) {
    // 1) Storage에서 state root 가져오기
    stateRoot := n.storage.GetStateRoot(batch.Round - 1)

    // 2) Runtime에 execute 요청 (IPC)
    resp := n.runtime.ExecuteTxBatch(&ExecuteTxBatchRequest{
        BlockInfo:  batch.BlockInfo,
        IORoot:     batch.IORoot,     // 입력 commitment
        StateRoot:  stateRoot,
        Inputs:     batch.Inputs,
    })

    // 3) 결과 commitment 생성 + 서명
    commit := &Commitment{
        Round:      batch.Round,
        PreviousHash: batch.PrevHash,
        IORoot:     resp.IORoot,
        StateRoot:  resp.StateRoot,
        Messages:   resp.Messages,   // Consensus에 전달할 메시지
    }
    commit.Sign(n.identity)

    // 4) P2P로 전파 (위원회 멤버들에게)
    n.p2p.Publish(RoothashCommitmentTopic, commit)

    // 5) 2/3 commit 수집 대기
    // 6) Roothash에 제출 → Consensus 커밋
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">런타임 번들 구조</h3>
      </div>
      <BundleStructViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mt-4">{`// .orc 번들 형식 (Oasis Runtime Container)

sapphire-paratime.orc/
├── manifest.json           # 메타데이터
├── components/
│   ├── ronl/               # Runtime-On-Native-Layer (default)
│   │   ├── runtime         # 네이티브 바이너리 (Linux)
│   │   └── runtime.sgxs    # SGX 엔클레이브 (선택)
│   │   └── runtime.sig     # SIGSTRUCT
│   └── rofl/               # Runtime OFfchain Logic (선택)
│       └── ...

// manifest.json
{
  "name": "sapphire-paratime",
  "id": "0000000000000000000000000000000000000000000000000000000000000000",
  "version": { "major": 1, "minor": 0, "patch": 0 },
  "components": [
    {
      "kind": "ronl",
      "executable": "components/ronl/runtime",
      "sgx": {
        "executable": "components/ronl/runtime.sgxs",
        "signature": "components/ronl/runtime.sig"
      }
    }
  ]
}

// 노드가 번들 수신 시
// 1) 매니페스트 서명 검증
// 2) MRENCLAVE를 Registry 등록값과 대조
// 3) 버전 매치 확인 (Governance가 허용한 버전)
// 4) SGX 로더 또는 네이티브 로더로 로딩`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Runtime 격리의 이중 레이어</p>
          <p>
            <strong>Layer 1: Process isolation</strong><br />
            - Runtime = 별도 OS 프로세스<br />
            - Host 크래시해도 Runtime 독립 운영<br />
            - Sandbox(seccomp/namespace)로 시스템콜 제한
          </p>
          <p className="mt-2">
            <strong>Layer 2: TEE isolation (SGX)</strong><br />
            - Runtime 프로세스가 엔클레이브 진입<br />
            - 모든 민감 로직은 엔클레이브 안에서만<br />
            - Host OS, 루트 사용자도 엔클레이브 내부 관측 불가
          </p>
          <p className="mt-2">
            <strong>왜 이중인가</strong>:<br />
            - Sandbox만: 커널 버그 시 탈출 가능<br />
            - TEE만: 성능·호환성 이슈 (엔클레이브 외 라이브러리 필요)<br />
            - 이중: 일상적 방어 + 극단 공격 대응
          </p>
        </div>

      </div>
    </section>
  );
}
