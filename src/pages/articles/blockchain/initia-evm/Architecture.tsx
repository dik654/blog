import { CitationBlock } from '../../../../components/ui/citation';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MiniEVM 내부 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Cosmos 상태와 EVM 상태 매핑</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움의 EVM 상태 vs MiniEVM의 Cosmos 상태 매핑:

이더리움 EVM:
  StateDB → MPT → LevelDB
  │
  ├── Account: {nonce, balance, storageRoot, codeHash}
  ├── Storage: mapping(bytes32 → bytes32)
  └── Code:    bytecode

MiniEVM (Cosmos KVStore 위에 구현):
  x/evm Keeper → Cosmos KVStore → IAVL Tree
  │
  ├── Account: Cosmos x/auth 계정과 매핑
  │   - EVM address(20byte) ↔ Cosmos address(bech32)
  │   - nonce → x/auth sequence number
  │   - balance → x/bank 잔액
  │
  ├── Storage: KVStore에 직접 저장
  │   - key: address + slot → value: bytes32
  │
  └── Code: KVStore에 저장
      - key: codeHash → value: bytecode

장점:
  - Cosmos의 IBC와 EVM이 같은 상태 공간 공유
  - EVM 컨트랙트가 Cosmos 네이티브 토큰에 직접 접근
  - 트랜잭션이 EVM 호출과 Cosmos 메시지를 혼합 가능

이중 상태 동기화 문제:
  Cosmos 네이티브 모듈의 상태 변경은 EVM에 자동 반영 안 됨
  → Precompile + 저널링으로 해결:
    1. Precompile이 Cosmos 상태 변경 시 journal entry 기록
    2. EVM TX revert 시 journal로 Cosmos 상태도 롤백
    3. RunAtomic 패턴: 에러 감지 시 StateDB 스냅샷으로 복귀

ERC20 이중 표현:
  ERC20Factory로 생성된 토큰은 동시에 두 형태로 존재:
  - EVM: ERC20 컨트랙트 상태
  - Cosmos: 네이티브 denom ("evm/ADDRESS" 형식)
  → 두 세계를 연결하는 브릿지 역할`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">EVM 실행 흐름</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`MiniEVM 트랜잭션 처리:

1. Cosmos TX 수신 → MsgEVMCall / MsgEVMCreate 디코딩
2. AnteHandler: 가스 검증, 서명 확인 (Cosmos 방식)
3. x/evm MsgServer:
   a. StateDB 어댑터 생성 (Cosmos KVStore → StateDB 인터페이스)
   b. go-ethereum의 EVM 인스턴스 생성
   c. evm.Call() / evm.Create() 실행
   d. 상태 변경을 Cosmos KVStore에 반영
   e. 이벤트를 Cosmos 이벤트로 변환
4. 가스 소비 기록 → Cosmos gas meter

이더리움 비교:
  이더리움: StateDB → EVM → StateDB (직접)
  MiniEVM:  KVStore → StateDB 어댑터 → EVM → 어댑터 → KVStore
  → 어댑터 레이어가 추가되지만, 동일한 EVM 바이트코드 실행

가스 처리:
  SDK의 GasKVStore 메커니즘을 우회
  → EVM 자체의 opcode 가스 비용으로 추적
  → 실행 결과에서 가스 소비량 반환

Precompile 카테고리:
  1. EVM 레거시 (Berlin hardfork 세트)
  2. Stateless (p256 검증, bech32 주소 변환)
  3. Stateful (Cosmos bank/staking/governance 접근)

ICosmos 인터페이스:
  Solidity에서 Cosmos 메시지 실행 가능
  → IBC 전송, 스테이킹, 거버넌스 투표를 EVM 컨트랙트에서 호출
  → cross-VM 메시징의 핵심`}</code>
        </pre>

        <CitationBlock source="Initia OPinit Stack — Optimistic Bridge" citeKey={2} type="paper" href="https://docs.initia.xyz">
          <p className="italic text-foreground/80">"OPinit implements an optimistic bridge between L1 and Minitia L2s. The bridge operator submits output proposals to L1, and a challenge period allows any party to dispute invalid state transitions. After the challenge period, the output is finalized and cross-chain messages are executed."</p>
          <p className="mt-2 text-xs">OPinit은 Optimistic Rollup 방식으로 L1-L2 간 통신을 처리합니다. 출력 제안(output proposal) → 이의 제기 기간(challenge period) → 최종 확정(finalization) 순서로 진행되며, IBC 채널을 통해 메시지를 전달합니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">코드 구조 (minievm 레포)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`minievm/
├── x/evm/                    # EVM 모듈
│   ├── keeper/               # Keeper (상태 관리)
│   │   ├── keeper.go         # EVM Keeper 정의
│   │   ├── msg_server.go     # MsgEVMCall, MsgEVMCreate 처리
│   │   └── statedb.go        # Cosmos KVStore → StateDB 어댑터
│   ├── types/                # 타입 정의
│   │   ├── msg.go            # Cosmos Msg 타입
│   │   └── params.go         # EVM 파라미터 (ChainID 등)
│   └── module.go             # Cosmos 모듈 등록
├── app/                      # Cosmos App 구성
│   └── app.go                # 모듈 통합
├── indexer/                   # 이더리움 호환 인덱서
│   └── eth_indexer.go        # eth_getLogs 등 지원
└── jsonrpc/                   # 이더리움 JSON-RPC 호환
    ├── eth.go                # eth_* 메서드
    └── web3.go               # web3_* 메서드`}</code>
        </pre>

        <CitationBlock source="MiniEVM — ICosmos Interface & Cross-VM Interop" citeKey={3} type="code" href="https://github.com/initia-labs/minievm">
          <pre className="text-xs overflow-x-auto"><code>{`// ICosmos 인터페이스: Solidity에서 Cosmos 메시지 실행
interface ICosmos {
    // IBC 전송 실행
    function execute_cosmos(string calldata msg) external returns (bool);
    // Cosmos 쿼리 실행
    function query_cosmos(string calldata path, string calldata req)
        external returns (string memory);
    // bech32 주소 변환
    function to_cosmos_address(address evm_addr)
        external returns (string memory);
}

// EVM 컨트랙트에서 Cosmos 스테이킹 호출 예시
ICosmos(COSMOS_PRECOMPILE).execute_cosmos(
    '{"@type":"/cosmos.staking.v1beta1.MsgDelegate",...}'
);`}</code></pre>
          <p className="mt-2 text-xs">ICosmos 프리컴파일을 통해 EVM 컨트랙트가 Cosmos 네이티브 기능(IBC, 스테이킹, 거버넌스)에 직접 접근할 수 있습니다. 이는 MoveVM과 EVM 간 상호운용성의 핵심 메커니즘입니다.</p>
        </CitationBlock>
      </div>
    </section>
  );
}
