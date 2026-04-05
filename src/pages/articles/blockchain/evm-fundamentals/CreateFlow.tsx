import CreateFlowViz from './viz/CreateFlowViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function CreateFlow({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="create-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨트랙트 생성: CREATE & CREATE2</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          msg.To == nil이면 Call() 대신 Create()가 호출됨
          <br />
          init code를 실행하여 런타임 바이트코드를 배포하는 과정
        </p>
      </div>
      <div className="not-prose">
        <CreateFlowViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">CREATE vs CREATE2</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// CREATE (opcode 0xF0, original)
// Address = keccak256(rlp([sender, nonce]))[12:]
// - sender: 생성자 주소
// - nonce: sender의 현재 nonce
// - 주소 예측 가능 but nonce dependency

// CREATE2 (opcode 0xF5, Constantinople 2019)
// Address = keccak256(0xFF || sender || salt || keccak256(init_code))[12:]
// - salt: 32-byte 선택값
// - init_code: 배포할 코드
// - 미리 주소 계산 가능 (counterfactual deployment)

// Use cases for CREATE2
// 1) State channels: 배포 전 주소 알 수 있음
// 2) Factory patterns: deterministic addresses
// 3) Meta-transactions: pre-fund 가능
// 4) Upgrade: 같은 주소 재사용 (CREATE2 + SELFDESTRUCT)

// Example: Factory Pattern
contract Factory {
    event Deployed(address addr, uint salt);

    function deploy(bytes memory init, uint salt) external {
        address addr;
        assembly {
            addr := create2(0, add(init, 0x20), mload(init), salt)
        }
        require(addr != address(0), "Deploy failed");
        emit Deployed(addr, salt);
    }

    function computeAddress(bytes memory init, uint salt)
        external view returns (address)
    {
        bytes32 hash = keccak256(abi.encodePacked(
            bytes1(0xff), address(this), salt, keccak256(init)
        ));
        return address(uint160(uint256(hash)));
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Init Code 실행 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Contract 배포 3단계

// 1) Tx arrives: { to: nil, data: init_code + constructor_args }

// 2) EVM interprets init_code
// - 일반 opcode 실행
// - Constructor logic 수행
// - 최종적으로 RETURN으로 runtime code 반환

// 3) Runtime code 저장
// - RETURN으로 반환된 bytes = deployed code
// - address.code = runtime_code
// - address.codeHash = keccak256(runtime_code)

// Example bytecode
// Init code: 608060405234801561001057600080fd5b50...
// └─ Constructor 로직
// └─ PUSH32 runtime_code_offset
// └─ PUSH1 runtime_code_length
// └─ PUSH1 destination
// └─ CODECOPY
// └─ PUSH1 length
// └─ PUSH1 offset
// └─ RETURN

// Init code는 실행 후 discard
// Runtime code만 chain에 영구 저장

// Gas 비용
// CREATE base: 32,000
// Code deposit: 200 gas per byte
// Init code execution: 일반 gas`}</pre>

      </div>
    </section>
  );
}
