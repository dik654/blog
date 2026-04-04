import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'Runner: 실행의 진입점', body: 'Runner::start(|context|) — context가 Clock + Network + Storage + Spawner를 모두 제공. tokio::Runner는 프로덕션, deterministic::Runner는 테스트용.' },
  { label: 'Spawner: 계층적 태스크 감독', body: 'spawn()이 자식 Context를 넘겨 감독 트리 구성. 부모 종료 → 자식 자동 abort. shared(blocking) vs dedicated() 두 모드.' },
  { label: 'Clock: 시간 추상화', body: 'current() / sleep() / timeout() — deterministic에서는 가상 시간. 동일 시드 → 동일 실행 순서. rate limiter도 Clock 참조.' },
  { label: 'Network + Storage: I/O 추상화', body: 'Network: bind() → Listener → accept() → (Sink, Stream). Storage: open() → Blob → read_at/write_at. 모두 런타임별 교체 가능.' },
  { label: 'Metrics: 계층적 관측', body: 'with_label()로 네임스페이스 중첩, with_attribute()로 동적 차원, with_scope()로 에폭 기반 자동 정리.' },
];

export const STEP_REFS = [
  'runner-trait', 'spawner-trait', 'clock-trait',
  'network-trait', 'metrics-trait',
];

export const STEP_LABELS = [
  'lib.rs — Runner trait', 'lib.rs — Spawner trait', 'lib.rs — Clock trait',
  'lib.rs — Network / Storage trait', 'lib.rs — Metrics trait',
];
