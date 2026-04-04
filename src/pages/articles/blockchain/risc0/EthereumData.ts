export const VERIFIER_CODE = `// Solidity: Groth16 증명 온체인 검증
interface IRiscZeroVerifier {
    function verify(
        bytes calldata seal,   // Groth16 증명 (~260바이트, 4바이트 selector + 256바이트 EC점)
        bytes32 imageId,       // 실행한 Guest 프로그램 해시
        bytes32 journalDigest  // Journal 내용의 SHA256
    ) external view;
}

// VerifierRouter: 버전별 검증자 라우팅
contract RiscZeroVerifierRouter is IRiscZeroVerifier {
    mapping(bytes4 => IRiscZeroVerifier) public verifiers;

    function verify(bytes calldata seal, bytes32 imageId, bytes32 journalDigest)
        external view
    {
        // seal의 첫 4바이트가 verifier 버전 식별자
        bytes4 selector = bytes4(seal[:4]);
        verifiers[selector].verify(seal, imageId, journalDigest);
    }
}

// Emergency Stop: 취약점 발견 시 즉시 중단
contract RiscZeroVerifierEmergencyStop is IRiscZeroVerifier {
    // 관리자 호출: 즉시 일시 정지
    function estop() external onlyOwner { _pause(); }

    // 누구든 취약점 증명 제시 시 자동 정지 (circuit breaker)
    function estop(Receipt calldata receipt) external {
        if (receipt.claimDigest != bytes32(0)) revert InvalidProofOfExploit();
        verifyIntegrity(receipt);  // 취약점 증명 검증
        _pause();
    }
}`;

export const APP_CODE = `// 애플리케이션 컨트랙트 예시
contract MyApp {
    IRiscZeroVerifier public immutable verifier;
    bytes32 public immutable imageId; // 허가된 Guest 프로그램

    constructor(IRiscZeroVerifier _verifier, bytes32 _imageId) {
        verifier = _verifier;
        imageId = _imageId;
    }

    function submitProof(
        bytes calldata seal,
        bytes calldata journal
    ) external {
        // 1. 증명 검증 (가스 ~280,000)
        verifier.verify(seal, imageId, sha256(journal));

        // 2. Journal 파싱 (공개 출력)
        (uint256 result, address user) = abi.decode(journal, (uint256, address));

        // 3. 검증된 결과로 상태 업데이트
        results[user] = result;
    }
}`;

export const STEEL_CODE = `// Guest 코드: 이더리움 상태를 읽고 계산
use risc0_steel::ethereum::EthEvmEnv;

fn main() {
    // Host가 제공한 이더리움 상태 환경 읽기
    let env = EthEvmEnv::from_slice(&env::read_vec());

    // ERC-20 balanceOf() 뷰 콜 실행
    let balance = IERC20::balanceOfCall::new((USER_ADDRESS,))
        .call(&env, TOKEN_ADDRESS)?
        .balance;

    // 잔액 > 1000 검증 결과를 Journal에 기록
    env::commit(&(balance >= U256::from(1000u64)));
}

// 결과: "이 블록에서 USER_ADDRESS의 잔액이 1000 이상"을
//       오프체인에서 증명 → 온체인에서 검증`;

export const AGGREGATION_CODE = `// 여러 사용자의 증명을 하나로 집계
// 각 증명을 개별 검증하면: N × 280,000 gas
// 집계 후 검증하면: 1 × 280,000 gas + O(N log N) 오프체인

// MMR (Merkle Mountain Range) 기반 집계
fn aggregate_proofs(proofs: Vec<Receipt>) -> AggregatedReceipt {
    // 각 증명을 MMR leaf로 추가
    let mmr = proofs.iter().fold(MMR::new(), |mut mmr, p| {
        mmr.push(p.journal.digest());
        mmr
    });
    // 전체 MMR 루트에 대한 단일 증명 생성
    prover.prove_aggregation(mmr_root, proofs)
}`;
