export const moduleCode = `dYdX 커스텀 모듈 구조 (protocol/x/):

Trading Modules:
  clob/         → 중앙 지정가 주문서 (CLOB)
  subaccounts/  → 서브계정 관리 (잔고/포지션)
  feetiers/     → 수수료 등급
  perpetuals/   → 영구 선물 계약 (펀딩 레이트)

Core Modules:
  assets/       → 자산 관리
  prices/       → 가격 피드 (오라클)
  epochs/       → 에포크 관리
  blocktime/    → 블록 시간

Support Modules:
  bridge/       → 이더리움 크로스체인 브릿지
  rewards/      → 보상 시스템
  delaymsg/     → 지연 메시지 처리
  stats/        → 통계 수집
  sending/      → 전송 관리`;

export const moduleAnnotations = [
  { lines: [3, 7] as [number, number], color: 'sky' as const, note: '거래 핵심 모듈' },
  { lines: [9, 13] as [number, number], color: 'emerald' as const, note: '인프라 모듈' },
  { lines: [15, 20] as [number, number], color: 'amber' as const, note: '지원 모듈' },
];

export const lifecycleCode = `블록 생명주기 (BeginBlocker → EndBlocker):

BeginBlocker 순서:
  1. blocktime  → 블록 시간 업데이트 (최우선)
  2. authz      → 만료된 권한 삭제
  3. epochs     → 에포크 업데이트
  4. prices     → 가격 업데이트
  5. assets     → 자산 상태 업데이트

EndBlocker 순서:
  1. clob        → 만료 주문 정리, 조건부 주문 트리거
  2. perpetuals  → 펀딩 레이트 업데이트
  3. blocktime   → 블록 시간 마무리 (최후)

Genesis 초기화 순서:
  epochs → capability → auth → bank → ... (의존성 순서)
  → prices → assets → perpetuals → subaccounts
  → clob (마지막: 가장 많은 의존성)`;

export const lifecycleAnnotations = [
  { lines: [3, 8] as [number, number], color: 'sky' as const, note: 'BeginBlocker: 상태 초기화' },
  { lines: [10, 13] as [number, number], color: 'emerald' as const, note: 'EndBlocker: 정리 작업' },
  { lines: [15, 18] as [number, number], color: 'amber' as const, note: 'Genesis: 의존성 순서 초기화' },
];
