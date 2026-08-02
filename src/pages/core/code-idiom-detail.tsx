import { useParams } from 'react-router-dom';

type IdiomRule = {
  title: string;
  why: string;
  bad: string;
  good: string;
  review: string[];
};

const idioms: Record<string, { title: string; summary: string; rules: IdiomRule[] }> = {
  'go-service-idioms': {
    title: 'Go Service Idioms',
    summary: 'Go 서비스 코드는 context, error, goroutine, channel, table test의 소유 경계가 보여야 재사용하기 쉽습니다.',
    rules: [
      {
        title: 'context는 request boundary에서 받아서 전파한다',
        why: '새 root context를 내부에서 만들면 timeout, cancel, trace가 끊깁니다.',
        bad: `func LoadUser(id string) (*User, error) {
  ctx := context.Background()
  return repo.Find(ctx, id)
}`,
        good: `func LoadUser(ctx context.Context, id string) (*User, error) {
  return repo.Find(ctx, id)
}`,
        review: ['함수 인자에 context.Context가 있는가?', 'timeout/cancel을 호출자가 제어할 수 있는가?', 'Background/TODO가 library 내부에 숨어 있지 않은가?'],
      },
      {
        title: 'goroutine은 종료 신호와 wait 경계를 같이 둔다',
        why: 'spawn만 있고 종료 계약이 없으면 테스트와 배포에서 leak가 됩니다.',
        bad: `go func() {
  for event := range events {
    handle(event)
  }
}()`,
        good: `g.Go(func() error {
  for {
    select {
    case <-ctx.Done():
      return ctx.Err()
    case event := <-events:
      handle(event)
    }
  }
})`,
        review: ['ctx.Done 또는 close 신호가 있는가?', 'errgroup/Wait로 종료를 기다리는가?', 'channel owner가 명확한가?'],
      },
    ],
  },
  'rust-api-idioms': {
    title: 'Rust API Idioms',
    summary: 'Rust API는 ownership, typed error, trait boundary, clone 비용이 public surface에서 드러나야 합니다.',
    rules: [
      {
        title: '도메인 오류는 문자열 대신 타입으로 구분한다',
        why: '문자열 오류는 caller가 복구 가능한 실패와 fatal 실패를 구분하기 어렵습니다.',
        bad: `fn parse_header(input: &[u8]) -> Result<Header, String> {
  if input.is_empty() {
    return Err("empty".to_string());
  }
  Ok(Header::decode(input)?)
}`,
        good: `#[derive(thiserror::Error, Debug)]
pub enum HeaderError {
  #[error("empty header")]
  Empty,
  #[error("decode failed")]
  Decode(#[from] DecodeError),
}

fn parse_header(input: &[u8]) -> Result<Header, HeaderError> {
  if input.is_empty() {
    return Err(HeaderError::Empty);
  }
  Ok(Header::decode(input)?)
}`,
        review: ['복구 가능한 오류가 enum variant로 분리됐는가?', 'source error가 #[from]으로 보존되는가?', 'Display 문자열에 의존한 분기가 없는가?'],
      },
      {
        title: 'clone은 비용과 의미가 보일 때만 허용한다',
        why: '무의식적인 clone은 ownership 설계를 숨기고 큰 buffer 복사를 만듭니다.',
        bad: `fn submit(tx: Transaction) {
  pool.insert(tx.clone());
  broadcast(tx.clone());
}`,
        good: `fn submit(tx: Arc<Transaction>) {
  pool.insert(Arc::clone(&tx));
  broadcast(tx);
}`,
        review: ['clone 대상이 작거나 Arc처럼 공유 의미가 명확한가?', 'borrow로 충분한 곳에서 소유권을 넘기지 않았는가?', 'hot path clone이 benchmark 없이 들어가지 않았는가?'],
      },
    ],
  },
  'python-llm-idioms': {
    title: 'Python LLM Code Idioms',
    summary: 'LLM Python 코드는 structured parsing, explicit error, deterministic fixture, 모델 호출 격리가 핵심입니다.',
    rules: [
      {
        title: 'JSON/YAML/CSV는 문자열 split이 아니라 parser로 읽는다',
        why: '모델 출력이나 설정 파일은 escaping, newline, nested structure가 자주 섞입니다.',
        bad: `provider, model = row.split(",")[:2]
config[provider] = model`,
        good: `import csv

with path.open(newline="") as f:
    for row in csv.DictReader(f):
        config[row["provider"]] = row["model"]`,
        review: ['표준 parser 또는 schema validator를 쓰는가?', '필수 field 누락을 별도 오류로 처리하는가?', '테스트 fixture에 escaping/newline 케이스가 있는가?'],
      },
      {
        title: 'broad except는 재시도/로그/실패 반환을 분리한다',
        why: 'except Exception: pass는 모델 장애와 데이터 오류를 모두 숨깁니다.',
        bad: `try:
    return client.chat(messages)
except Exception:
    return None`,
        good: `try:
    return client.chat(messages)
except RateLimitError as exc:
    raise RetryableModelError(provider=provider) from exc
except ValidationError as exc:
    raise BadFixtureError(fixture_id=fixture_id) from exc`,
        review: ['재시도 가능한 오류와 fixture 오류가 분리됐는가?', '원본 exception chain을 보존하는가?', 'None 반환으로 실패 의미를 지우지 않는가?'],
      },
    ],
  },
  'typescript-ui-idioms': {
    title: 'TypeScript UI Idioms',
    summary: 'TypeScript UI는 상태 모델, type narrowing, async error, responsive text boundary가 명확해야 합니다.',
    rules: [
      {
        title: 'loading/error/empty/success 상태는 discriminated union으로 둔다',
        why: 'boolean 여러 개는 동시에 true가 될 수 있어 UI가 겹치거나 빠집니다.',
        bad: `const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<Item[]>([]);`,
        good: `type LoadState =
  | { tag: 'loading' }
  | { tag: 'error'; message: string }
  | { tag: 'empty' }
  | { tag: 'success'; data: Item[] };`,
        review: ['상태가 서로 배타적인가?', 'empty와 error를 구분하는가?', 'render switch에서 default로 삼키지 않는가?'],
      },
      {
        title: '긴 텍스트는 모바일 overflow 정책을 가진다',
        why: 'URL, hash, 함수명, 파일 경로는 카드와 표를 쉽게 깨뜨립니다.',
        bad: `<td>{commitHash}</td>`,
        good: `<td className="min-w-0 max-w-[280px] truncate font-mono" title={commitHash}>
  {commitHash}
</td>`,
        review: ['truncate/wrap/break-all 중 의도한 정책이 있는가?', 'title 또는 상세 진입으로 전체 값을 볼 수 있는가?', '모바일 table min-width가 정해져 있는가?'],
      },
    ],
  },
  'rust-concurrency-idioms': {
    title: 'Rust Concurrency Idioms',
    summary: 'Rust 동시성 코드는 task ownership, cancellation, channel backpressure, shared state 비용이 드러나야 합니다.',
    rules: [
      {
        title: 'tokio task는 JoinHandle과 cancel 경계를 가진다',
        why: 'spawn 결과를 버리면 panic, 종료 실패, background loop leak를 호출자가 알 수 없습니다.',
        bad: `tokio::spawn(async move {
  loop {
    worker.tick().await;
  }
});`,
        good: `let handle = tokio::spawn(async move {
  loop {
    tokio::select! {
      _ = cancel.cancelled() => return Ok(()),
      result = worker.tick() => result?,
    }
  }
});
handles.push(handle);`,
        review: ['JoinHandle을 저장하거나 await하는가?', 'CancellationToken 또는 shutdown channel이 있는가?', 'task panic이 상위 error로 전달되는가?'],
      },
      {
        title: 'channel capacity는 backpressure contract로 문서화한다',
        why: 'unbounded channel은 producer 속도가 consumer보다 빠를 때 메모리 장애를 숨깁니다.',
        bad: `let (tx, mut rx) = mpsc::unbounded_channel();`,
        good: `let (tx, mut rx) = mpsc::channel::<Job>(1024);
tx.send(job).await.map_err(|_| QueueClosed)?;`,
        review: ['bounded capacity가 처리량 근거와 연결되는가?', 'send 실패가 종료 신호로 처리되는가?', 'drop 정책이 명시됐는가?'],
      },
    ],
  },
  'go-testing-idioms': {
    title: 'Go Testing Idioms',
    summary: 'Go 테스트는 table case, subtest isolation, race/leak check, fake clock으로 재현성을 확보해야 합니다.',
    rules: [
      {
        title: 'table test는 케이스 이름과 실패 이유를 분리한다',
        why: '입력만 나열하면 어떤 contract가 깨졌는지 리뷰에서 바로 보이지 않습니다.',
        bad: `for _, tc := range cases {
  got := Parse(tc.input)
  if got != tc.want { t.Fatal(got) }
}`,
        good: `for _, tc := range cases {
  t.Run(tc.name, func(t *testing.T) {
    got, err := Parse(tc.input)
    require.NoError(t, err)
    assert.Equal(t, tc.want, got, tc.reason)
  })
}`,
        review: ['case name이 contract를 설명하는가?', 'err path와 success path가 분리됐는가?', 'failure message가 원인을 말하는가?'],
      },
      {
        title: '시간 의존 테스트는 fake clock을 먼저 둔다',
        why: 'sleep 기반 테스트는 CI 부하와 scheduler에 따라 불안정해집니다.',
        bad: `time.Sleep(100 * time.Millisecond)
assert.True(t, cache.Expired(key))`,
        good: `clock.Advance(100 * time.Millisecond)
assert.True(t, cache.Expired(key))`,
        review: ['time.Now/Sleep이 추상화됐는가?', 'timeout은 테스트 전체 hang 방지용인가?', 'race test에서도 결정적인가?'],
      },
    ],
  },
  'typescript-async-idioms': {
    title: 'TypeScript Async Pattern Idioms',
    summary: 'TypeScript 비동기 코드는 abort, stale response, retry, optimistic update 경계가 상태 모델에 포함돼야 합니다.',
    rules: [
      {
        title: 'fetch는 AbortSignal과 stale response 방어를 같이 둔다',
        why: '느린 응답이 최신 상태를 덮으면 UI가 과거 데이터를 보여줍니다.',
        bad: `useEffect(() => {
  fetch(url).then((res) => res.json()).then(setData);
}, [url]);`,
        good: `useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then((res) => res.json())
    .then((data) => setState({ tag: 'success', data }))
    .catch((error) => {
      if (error.name !== 'AbortError') setState({ tag: 'error', error });
    });
  return () => controller.abort();
}, [url]);`,
        review: ['AbortSignal을 전달하는가?', 'cleanup에서 abort하는가?', 'abort와 실제 error를 구분하는가?'],
      },
      {
        title: 'retry는 idempotency와 backoff가 있을 때만 둔다',
        why: '무조건 재시도는 결제, mutation, quota 소비를 중복 실행할 수 있습니다.',
        bad: `while (true) {
  try { return await mutate(input); } catch {}
}`,
        good: `await retry(() => query(input), {
  retries: 2,
  backoffMs: 250,
  retryIf: isTransientNetworkError,
});`,
        review: ['operation이 idempotent한가?', '재시도 가능한 오류만 골랐는가?', '최대 횟수와 backoff가 있는가?'],
      },
    ],
  },
  'design-pattern-idioms': {
    title: 'Design Pattern Idioms',
    summary: '디자인 패턴은 이름보다 dependency direction, lifecycle, test seam이 실제 복잡도를 줄일 때만 사용합니다.',
    rules: [
      {
        title: 'strategy는 분기 폭이 외부 정책으로 바뀔 때만 둔다',
        why: '고정된 두 분기를 interface로 감싸면 코드 탐색 비용만 늘어납니다.',
        bad: `interface Formatter { format(x: Item): string }
class JsonFormatter implements Formatter { /* one caller only */ }`,
        good: `const formatterByKind: Record<ExportKind, Formatter> = {
  json: jsonFormatter,
  csv: csvFormatter,
  parquet: parquetFormatter,
};`,
        review: ['새 variant가 호출자 수정 없이 추가되는가?', '테스트 fixture가 strategy별로 분리되는가?', 'interface 구현이 한 개뿐이지 않은가?'],
      },
      {
        title: 'adapter는 외부 API shape를 내부 도메인에서 격리한다',
        why: '외부 DTO가 내부 전체로 퍼지면 provider 교체와 테스트가 어려워집니다.',
        bad: `function render(user: GithubUserResponse) {
  return user.avatar_url;
}`,
        good: `function toProfile(response: GithubUserResponse): Profile {
  return { avatarUrl: response.avatar_url, name: response.login };
}`,
        review: ['외부 타입이 boundary 밖으로 새지 않는가?', 'adapter failure가 도메인 오류로 변환되는가?', 'provider fixture가 adapter 테스트에 고정되는가?'],
      },
    ],
  },
  'api-design-idioms': {
    title: 'API Design Idioms',
    summary: 'API는 request contract, pagination, idempotency, error envelope, versioning이 호출자에게 예측 가능해야 합니다.',
    rules: [
      {
        title: 'mutation API는 idempotency key를 먼저 설계한다',
        why: '네트워크 재시도에서 같은 요청이 두 번 적용되면 데이터와 결제가 깨집니다.',
        bad: `POST /orders
{ "sku": "pro", "qty": 1 }`,
        good: `POST /orders
Idempotency-Key: order_20260526_001
{ "sku": "pro", "qty": 1 }`,
        review: ['중복 요청 결과가 같은 response인가?', 'key 보존 기간이 정해졌는가?', 'conflict와 retryable failure가 구분되는가?'],
      },
      {
        title: 'list API는 cursor와 stable ordering을 같이 둔다',
        why: 'offset pagination은 중간 insert/delete에서 누락과 중복을 만듭니다.',
        bad: `GET /events?page=3&limit=50`,
        good: `GET /events?after=evt_01HX...&limit=50&order=created_at_desc`,
        review: ['정렬 기준이 immutable한가?', 'cursor가 필터 조건과 묶이는가?', 'next cursor가 response에 포함되는가?'],
      },
    ],
  },
  'transformer-architecture-idioms': {
    title: 'Transformer Architecture Idioms',
    summary: 'Transformer 구현은 shape contract, mask semantics, KV cache, normalization 위치를 함수 경계에 명시해야 합니다.',
    rules: [
      {
        title: 'attention 함수는 q/k/v shape와 mask 의미를 주석이 아니라 타입/검증으로 고정한다',
        why: 'head dimension이나 causal mask가 틀리면 loss는 나빠지지만 오류가 바로 나지 않습니다.',
        bad: `scores = q @ k.transpose(-2, -1)
scores = scores + mask
return scores @ v`,
        good: `assert q.shape == (batch, heads, q_len, head_dim)
assert k.shape == (batch, heads, kv_len, head_dim)
scores = apply_causal_mask(q @ k.transpose(-2, -1), mask, q_len, kv_len)`,
        review: ['q_len과 kv_len이 분리되는가?', 'mask dtype과 broadcast 축이 검증되는가?', 'cache path와 prefill path가 같은 contract를 쓰는가?'],
      },
      {
        title: 'KV cache update는 position source와 eviction 정책을 같이 가진다',
        why: 'position이 밀리면 long context에서 답변 품질이 급격히 깨지고 디버깅이 어렵습니다.',
        bad: `cache = torch.cat([cache, new_kv], dim=2)`,
        good: `cache.write(layer=layer, positions=positions, key=new_k, value=new_v)
cache.evict(policy=sliding_window, upto=window_start)`,
        review: ['position source가 input ids와 일치하는가?', 'eviction이 attention mask와 동기화되는가?', 'prefill/decode benchmark가 분리되는가?'],
      },
    ],
  },
  'mlops-idioms': {
    title: 'ML Ops Idioms',
    summary: 'ML Ops 코드는 dataset version, model artifact, evaluation metric, rollout guard가 같은 run id로 묶여야 합니다.',
    rules: [
      {
        title: 'dataset과 metric은 run id에 고정한다',
        why: '모델만 저장하고 데이터 snapshot을 잃으면 성능 회귀를 재현할 수 없습니다.',
        bad: `model.save("latest.pt")
print(eval(model, validation_loader))`,
        good: `run = Run(dataset_sha=dataset.sha, code_sha=git.sha, model_sha=model.sha)
metrics = evaluator.evaluate(model, dataset)
registry.publish(run, metrics)`,
        review: ['dataset sha가 저장되는가?', 'metric script version이 남는가?', 'model artifact가 immutable한가?'],
      },
      {
        title: 'online rollout은 offline metric과 guardrail을 둘 다 본다',
        why: 'offline 점수만으로 배포하면 latency, safety, cost 회귀를 놓칩니다.',
        bad: `if accuracy > baseline:
  deploy(model)`,
        good: `if offline.pass_all() and canary.guardrails_ok():
  promote(model, traffic=0.1)`,
        review: ['latency/cost/safety guardrail이 있는가?', 'canary rollback trigger가 정해졌는가?', '모델과 prompt/config가 같이 버전 관리되는가?'],
      },
    ],
  },
  'solidity-gas-idioms': {
    title: 'Gas Optimization Idioms',
    summary: 'Solidity gas 최적화는 storage write, calldata/memory, unchecked scope, event 설계를 의미 보존 기준으로 관리해야 합니다.',
    rules: [
      {
        title: 'storage write는 상태 전이 의미가 있을 때만 수행한다',
        why: '같은 값을 다시 쓰는 SSTORE는 비용만 들고 이벤트/상태 해석을 흐립니다.',
        bad: `function setOwner(address next) external {
  owner = next;
}`,
        good: `function setOwner(address next) external {
  if (next == address(0) || next == owner) revert InvalidOwner();
  owner = next;
  emit OwnerChanged(next);
}`,
        review: ['동일 값 write를 막는가?', 'zero address와 권한 조건이 먼저 검증되는가?', 'event가 상태 전이를 설명하는가?'],
      },
      {
        title: 'unchecked는 overflow 불변조건이 증명된 작은 범위에만 둔다',
        why: 'gas를 줄이려고 unchecked를 넓게 두면 future change에서 안전장치가 사라집니다.',
        bad: `unchecked {
  balance[msg.sender] -= amount;
  total += fee;
}`,
        good: `if (balance[msg.sender] < amount) revert InsufficientBalance();
unchecked {
  balance[msg.sender] -= amount;
}`,
        review: ['unchecked 직전에 bound check가 있는가?', '블록 안에 하나의 산술 의도만 있는가?', 'property test가 overflow 경계를 포함하는가?'],
      },
    ],
  },
  'solidity-reentrancy-idioms': {
    title: 'Reentrancy Guard Idioms',
    summary: 'Reentrancy 방어는 checks-effects-interactions, pull payment, state lock, cross-function 재진입 경계를 같이 봐야 합니다.',
    rules: [
      {
        title: '외부 call 전에 effect를 먼저 반영한다',
        why: '송금이나 hook 호출 전에 잔액을 줄이지 않으면 fallback에서 같은 권리를 다시 사용할 수 있습니다.',
        bad: `function withdraw(uint256 amount) external {
  (bool ok,) = msg.sender.call{value: amount}("");
  require(ok);
  balance[msg.sender] -= amount;
}`,
        good: `function withdraw(uint256 amount) external nonReentrant {
  if (balance[msg.sender] < amount) revert InsufficientBalance();
  balance[msg.sender] -= amount;
  (bool ok,) = msg.sender.call{value: amount}("");
  require(ok);
}`,
        review: ['checks-effects-interactions 순서인가?', 'external call target이 제한되는가?', 'reentrant test contract가 있는가?'],
      },
      {
        title: 'guard는 함수 하나가 아니라 공유 상태 단위로 판단한다',
        why: 'withdraw만 막아도 claim, transfer, hook이 같은 상태를 건드리면 cross-function 재진입이 남습니다.',
        bad: `function withdraw() external nonReentrant { ... }
function claimReward() external { ... }`,
        good: `modifier lockedAccount(address account) {
  if (locked[account]) revert Reentrant();
  locked[account] = true;
  _;
  locked[account] = false;
}`,
        review: ['같은 storage를 만지는 함수들이 같은 lock 정책을 쓰는가?', 'read-only reentrancy 영향이 검토됐는가?', 'hook/callback path가 테스트되는가?'],
      },
    ],
  },
};

export default function CodeIdiomDetail() {
  const { item } = useParams<{ item: string }>();
  const doc = idioms[item ?? ''] ?? idioms['go-service-idioms'];

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-2 text-xs text-muted-foreground">idiom detail</p>
        <h1 className="text-2xl font-bold tracking-tight">{doc.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{doc.summary}</p>
      </section>

      {doc.rules.map((rule) => (
        <section key={rule.title} className="rounded-lg border bg-card p-4">
          <h2 className="text-base font-semibold">{rule.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rule.why}</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Bad</p>
              <pre className="overflow-auto rounded-md border bg-background p-3 text-xs leading-relaxed"><code>{rule.bad}</code></pre>
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Good</p>
              <pre className="overflow-auto rounded-md border bg-background p-3 text-xs leading-relaxed"><code>{rule.good}</code></pre>
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Review Questions</p>
            <div className="grid gap-2 md:grid-cols-3">
              {rule.review.map((question) => (
                <p key={question} className="rounded-md border bg-background px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                  {question}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
