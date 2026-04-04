export const cliCode = `// Oasis CLI 계층적 명령어 구조 (Go / Cobra)
// main.go -> cmd.Execute() -> initConfig()

// 핵심 명령어 모듈
oasis
+-- network       // 네트워크 설정 관리
|   +-- add       // 네트워크 추가
|   +-- remove    // 네트워크 제거
|   +-- set-rpc   // RPC 엔드포인트 설정
+-- wallet        // 지갑 생성 & 관리
|   +-- create    // 새 지갑 생성
|   +-- import    // 키 가져오기
|   +-- export    // 키 내보내기
+-- account       // 계정 & 트랜잭션
|   +-- show      // 잔액 조회
|   +-- transfer  // 토큰 전송
|   +-- delegate  // 스테이킹 위임
+-- contract      // 스마트 컨트랙트 관리
|   +-- upload    // 컨트랙트 업로드
|   +-- call      // 컨트랙트 호출
+-- paratime      // ParaTime 관리`;

export const cliAnnotations = [
  { lines: [4, 9] as [number, number], color: 'sky' as const, note: '네트워크 설정 명령어' },
  { lines: [10, 14] as [number, number], color: 'emerald' as const, note: '지갑 관리 명령어' },
  { lines: [15, 21] as [number, number], color: 'amber' as const, note: '계정 & 컨트랙트 명령어' },
];

export const configCode = `// 설정 시스템: Viper + TOML
// 설정 파일 위치: ~/.config/oasis/cli.toml

[networks.mainnet]
  rpc = "https://grpc.oasis.io"
  chain_context = "bb3..."
  denomination = "ROSE"

[networks.testnet]
  rpc = "https://testnet.grpc.oasis.io"

[wallet.default]
  kind = "file"           // file | ledger
  address = "oasis1..."

// 개발 워크플로우
// 1. oasis network add mainnet --rpc https://...
// 2. oasis wallet create myWallet
// 3. oasis contract upload myContract.wasm
// 4. oasis contract call myContract --method transfer`;

export const configAnnotations = [
  { lines: [3, 7] as [number, number], color: 'sky' as const, note: '네트워크 설정' },
  { lines: [9, 10] as [number, number], color: 'emerald' as const, note: '테스트넷 설정' },
  { lines: [12, 14] as [number, number], color: 'amber' as const, note: '지갑 설정' },
  { lines: [16, 21] as [number, number], color: 'violet' as const, note: '개발 워크플로우' },
];
