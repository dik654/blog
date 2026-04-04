export const trustChainCode = `// Oasis Sapphire 신뢰 체인 (Intel SGX 기반)
Intel SGX 하드웨어
  -> MRENCLAVE: 엔클레이브 코드 + 초기 데이터 해시
               (런타임 바이너리 전체 무결성)
  -> MRSIGNER:  엔클레이브 서명 키 해시 (개발자 신원)

// 키 매니저가 컴퓨트 노드를 인증하는 과정:
// 1. 컴퓨트 노드가 SGX Report/Quote 생성
// 2. 키 매니저가 Quote의 MRENCLAVE 검증
//    (허가된 Oasis 런타임과 동일한 코드인지 확인)
// 3. 허가된 런타임만 키 획득 가능`;

export const trustChainAnnotations = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: 'SGX 하드웨어 측정값' },
  { lines: [7, 11] as [number, number], color: 'emerald' as const, note: '컴퓨트 노드 인증 과정' },
];

export const keyDerivationCode = `// 계층적 키 파생 (HKDF-SHA512 기반)
KM Root Secret (SGX EGETKEY로 봉인 -- 재부팅 후 동일값)
    | HKDF(runtime_id)
Runtime Secret (런타임별 고유)
    | HKDF(contract_address)
Contract Secret (컨트랙트별 고유)
    |
    +-- State Encryption Key   -> AES-256-GCM (스토리지 암호화)
    +-- Tx Decryption Key      -> X25519 (트랜잭션 복호화)
    +-- Signing Key            -> Ed25519 (기밀 서명)

// 재부팅 후에도 동일한 키 유도 (SGX 봉인 기반)
// KM 마이그레이션 시 비밀 안전하게 이전 (복제 채널)`;

export const keyDerivationAnnotations = [
  { lines: [1, 6] as [number, number], color: 'sky' as const, note: 'HKDF 키 계층 트리' },
  { lines: [8, 10] as [number, number], color: 'emerald' as const, note: '파생 키 용도별 분류' },
];

export const nodeCommCode = `// 컨트랙트 실행 전 키 요청 흐름
// 1. 컴퓨트 워커 -> 키 매니저: CallGetOrCreateKey 요청
//    (runtime_id, contract_address, nonce)
// 2. 키 매니저: 컴퓨트 노드의 SGX Quote 검증
// 3. 키 매니저: 컨트랙트 키 파생 후 안전하게 전달
//    (SGX 로컬 증명 채널, AEAD 암호화)
// 4. 컴퓨트 워커: 받은 키로 트랜잭션 복호화 + EVM 실행

// 보안 속성:
// - 키 매니저 자체도 SGX에서 실행 -> 운영자 접근 불가
// - 컴퓨트 노드가 악의적이면 키 요청 거부
// - 다중 키 매니저 복제본으로 가용성 보장`;

export const nodeCommAnnotations = [
  { lines: [1, 7] as [number, number], color: 'sky' as const, note: '키 요청-발급 흐름' },
  { lines: [9, 12] as [number, number], color: 'amber' as const, note: '보안 속성' },
];

export const dmVerityCode = `# Oasis VM은 읽기 전용 루트 파일시스템 사용
# dm-verity: 블록 레벨 해시 검증

dm-verity 구조:
  루트 블록 해시 -> SGX MRENCLAVE에 포함
  각 블록 읽기 시 해시 검증 -> 변조 즉시 감지

# 쓰기 가능 공간: 임시 메모리 (재부팅 시 소멸)
# 영구 상태: 합의 체인에 암호화 커밋

# 결과:
# - 파일시스템 변조 불가
# - 운영체제 이미지가 MRENCLAVE와 일치해야 실행
# - 소프트웨어 무결성 보장`;

export const dmVerityAnnotations = [
  { lines: [4, 6] as [number, number], color: 'sky' as const, note: 'dm-verity 해시 검증 구조' },
  { lines: [8, 9] as [number, number], color: 'emerald' as const, note: '쓰기/읽기 정책' },
  { lines: [11, 14] as [number, number], color: 'amber' as const, note: '무결성 보장 결과' },
];
