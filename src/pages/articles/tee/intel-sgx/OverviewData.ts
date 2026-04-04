export const repoStructCode = `// linux-sgx 레포 구조
sdk/
  trts/          <- Trusted Runtime System (엔클레이브 내부)
  tseal/         <- 데이터 봉인 (AES-GCM + EGETKEY)
  selib/         <- EGETKEY, EREPORT 래퍼
  edger8r/       <- EDL -> C 바인딩 코드 생성 (OCaml)
  tlibc/         <- 엔클레이브용 libc

psw/
  urts/          <- Untrusted Runtime System (호스트 프로세스)
  ae/            <- Architecture Enclaves
    pce/         <- Provisioning Certificate Enclave
    aesm_service/<- AESM Daemon (원격 증명 조율)`;

export const repoAnnotations = [
  { lines: [2, 7] as [number, number], color: 'sky' as const, note: 'SDK: 엔클레이브 내부 라이브러리' },
  { lines: [9, 13] as [number, number], color: 'emerald' as const, note: 'PSW: 호스트 측 서비스' },
];

export const coreConceptsCode = `// 엔클레이브 측정값 (linux-sgx: sdk/trts/init_enclave.cpp)
MRENCLAVE  // 엔클레이브 코드+데이터의 SHA-256 해시
           // 로드 시 ECREATE -> EADD -> EEXTEND -> EINIT 순서로 계산
MRSIGNER   // 엔클레이브 서명자의 RSA 공개키 해시
           // SGX Sign Tool이 엔클레이브 이미지에 서명

// 봉인 정책 (sgx_get_key.cpp의 key_policy 비트)
SGX_KEYPOLICY_MRENCLAVE  // 동일 코드만 복호화 가능
SGX_KEYPOLICY_MRSIGNER   // 동일 서명자면 업그레이드 후에도 복호화 가능

// 전역 상태 (init_enclave.cpp)
uint32_t g_enclave_state  // ENCLAVE_INIT_NOT_STARTED -> ENCLAVE_INIT_DONE
int EDMM_supported         // Enclave Dynamic Memory Management 지원 여부
uint64_t g_enclave_base    // 엔클레이브 베이스 주소 (RELRO 섹션)`;

export const coreAnnotations = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: '엔클레이브 측정값 (신원 증명)' },
  { lines: [7, 9] as [number, number], color: 'amber' as const, note: '봉인 정책 설정' },
  { lines: [11, 14] as [number, number], color: 'violet' as const, note: '초기화 전역 상태' },
];

export const epcMemoryCode = `// 엔클레이브 페이지 유형
TCS   (Thread Control Structure)   // 스레드 실행 컨텍스트
REG   (Regular)                    // 코드/데이터/힙/스택
VA    (Version Array)              // 페이지 아웃 시 버전 관리

// init_enclave.cpp: g_global_data에서 레이아웃 정보 읽어 힙 초기화
if (heap_init(get_heap_base(), get_heap_size(), get_heap_min_size(),
              EDMM_supported) != SGX_SUCCESS)
    return -1;

// EDMM (Linux SGX 2.0+): 런타임에 EPC 페이지 추가/제거 가능
// 이전: 엔클레이브 생성 시 모든 페이지 정적 할당`;

export const epcAnnotations = [
  { lines: [1, 4] as [number, number], color: 'emerald' as const, note: 'EPC 페이지 유형 분류' },
  { lines: [6, 9] as [number, number], color: 'sky' as const, note: '힙 초기화 로직' },
  { lines: [11, 12] as [number, number], color: 'amber' as const, note: 'EDMM 동적 메모리 관리' },
];
