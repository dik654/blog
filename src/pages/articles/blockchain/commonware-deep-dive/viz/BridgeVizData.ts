import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: '1. Runtime 초기화', body: 'tokio::Config::new().with_storage_directory() → tokio::Runner::new(). 스레드 수, 버퍼 풀, 네트워크 설정 주입.' },
  { label: '2. executor.start(|context|)', body: 'Runner::start가 context를 제공. context 하나로 Clock + Network + Storage + Spawner + Metrics 전부 사용 가능.' },
  { label: '3. P2P + 채널 등록', body: 'authenticated::discovery::Network::new(context.with_label("network")). register()로 채널별 rate limit + backpressure 설정.' },
  { label: '4. Application + Consensus 조립', body: 'Application::new(context.with_label("app")), Engine::new(context.with_label("engine")). 각 모듈이 자체 메트릭 네임스페이스 소유.' },
  { label: '5. 동시 실행', body: 'network.start() + engine.start() + application.run().await. Spawner가 감독 트리로 관리 — 한 모듈 실패 시 전체 정리 종료.' },
];

export const STEP_REFS = [
  'bridge-main', 'bridge-main', 'bridge-main',
  'bridge-main', 'bridge-main',
];

export const STEP_LABELS = [
  'validator.rs — Runtime 초기화',
  'validator.rs — context 주입',
  'validator.rs — P2P 채널',
  'validator.rs — 모듈 조립',
  'validator.rs — 동시 실행',
];
