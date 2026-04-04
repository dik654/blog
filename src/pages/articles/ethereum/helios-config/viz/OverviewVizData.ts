/** OverviewViz — 색상 + step 정의 */

export const C = {
  reth: '#f59e0b',     // Reth CLI (앰버)
  helios: '#6366f1',   // Helios Builder (인디고)
  chain: '#10b981',    // 체이닝 흐름 (에메랄드)
  accent: '#8b5cf6',   // 강조 (보라)
};

export const STEPS = [
  {
    label: 'Reth CLI 터미널 vs Helios 코드 빌더',
    body: 'Reth는 독립 프로세스 — CLI 플래그 + TOML 파일로 설정.\nHelios는 라이브러리 — 코드 안에서 Builder 패턴으로 설정을 조합한다.\n모바일·WASM 임베딩을 위해 프로그래밍 방식 설정이 필수.',
  },
  {
    label: 'ClientBuilder 메서드 체이닝 — 3가지 핵심 설정',
    body: '.network() → 어떤 체인에 연결할 것인가\n.consensus_rpc() / .execution_rpc() → 데이터를 어디서 가져올 것인가\n.checkpoint() → 어떤 시점부터 동기화할 것인가\n최종 .build()로 Client 인스턴스 생성.',
  },
];
