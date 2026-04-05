import RuntimeTraitViz from './viz/RuntimeTraitViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function RuntimeFoundation({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="runtime-foundation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Runtime: 모든 모듈의 기반</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Commonware의 모든 프리미티브는 <strong>Runtime trait 집합</strong> 위에서 동작
          <br />
          Runner → Context 주입 → Context가 Clock + Network + Storage + Spawner + Metrics 제공
        </p>
        <p className="leading-7">
          핵심 설계: <strong>구현체를 교체하면 동일 코드가 다른 환경에서 실행</strong>
          <br />
          <code>tokio::Runner</code> — 프로덕션 (실제 TCP, 파일시스템, SystemTime)
          <br />
          <code>deterministic::Runner</code> — 테스트 (가상 네트워크, 메모리, 시뮬레이션 시간)
        </p>
      </div>
      <div className="not-prose mb-8">
        <RuntimeTraitViz onOpenCode={open} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Runtime Trait 집합</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Commonware Runtime abstractions

// Clock: Time provider
#[async_trait]
pub trait Clock: Clone + Send + Sync {
    fn current(&self) -> SystemTime;
    async fn sleep(&self, duration: Duration);
    async fn sleep_until(&self, deadline: SystemTime);
}

// Network: P2P communication
#[async_trait]
pub trait Network: Clone + Send + Sync {
    type Listener;
    type Connection;

    async fn bind(&self, addr: SocketAddr) -> Result<Self::Listener>;
    async fn connect(&self, addr: SocketAddr) -> Result<Self::Connection>;
}

// Storage: Persistent data
#[async_trait]
pub trait Storage: Clone + Send + Sync {
    type Blob;
    async fn open(&self, path: &str) -> Result<Self::Blob>;
    async fn remove(&self, path: &str) -> Result<()>;
}

// Spawner: Task spawning
pub trait Spawner: Clone + Send + Sync {
    fn spawn<F>(&self, f: F) -> JoinHandle<F::Output>
    where F: Future + Send + 'static;
}

// Metrics: Observability
pub trait Metrics: Clone + Send + Sync {
    fn register_counter(&self, name: &str) -> Counter;
    fn register_gauge(&self, name: &str) -> Gauge;
    fn register_histogram(&self, name: &str) -> Histogram;
}

// Context: 모든 trait 번들
pub trait Context:
    Clock + Network + Storage + Spawner + Metrics
    + Clone + Send + Sync + 'static
{}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Deterministic Testing</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Deterministic simulation framework

pub struct DeterministicRunner {
    seed: u64,
    clock: SimClock,
    network: VirtualNetwork,
    storage: MemStorage,
}

impl DeterministicRunner {
    pub fn start<F, Fut>(self, f: F) -> Fut::Output
    where
        F: FnOnce(DeterministicContext) -> Fut,
        Fut: Future,
    {
        let ctx = self.build_context();
        executor::block_on(f(ctx))
    }
}

// Virtual network: message-passing simulation
// - No real TCP
// - Configurable delay/drop
// - Reproducible failures

// SimClock: virtual time
// - Can fast-forward
// - Controlled concurrency
// - Deterministic ordering

// Test example
#[test]
fn test_consensus_safety() {
    let mut runner = DeterministicRunner::new(seed: 42);

    // Inject byzantine behaviors
    runner.network().partition(|peers| peers.id < 2);
    runner.clock().advance(Duration::from_secs(60));

    // Assert safety property
    let outcomes = runner.start(|ctx| async {
        simplex::run(ctx, validators).await
    });

    assert_no_double_commit(outcomes);
}

// 장점
// ✓ 100% 재현 가능
// ✓ 실시간보다 1000x+ 빠름
// ✓ Byzantine 시나리오 주입 쉬움
// ✓ CI에서 검증 가능`}</pre>

      </div>
    </section>
  );
}
