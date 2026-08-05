import { Link, useNavigate, useParams } from 'react-router-dom';
import { workspaceProjects, type WorkspaceProject, type WorkspaceStatus, type WorkspaceUnit } from '@/content/core-workspace';
import { CORE_ROOT } from '@/lib/paths';

const registrySlugs = new Set([
  'ai-llm-ops-codebase',
  'cnn-deep-learning-codebase',
  'gpt2-codebase',
  'vlm-codebase',
  'stable-diffusion-codebase',
  'reth-codebase',
  'prysm-codebase',
  'helios-codebase',
  'lighthouse-codebase',
  'intel-sgx-codebase',
  'sev-snp-codebase',
  'optee-codebase',
  'dstack-codebase',
  'oasis-core-codebase',
  'sp1-codebase',
  'risc0-codebase',
  'jolt-codebase',
]);

const prefixBySlug: Record<string, string> = {
  'ai-llm-ops-codebase': 'LLMOPS',
  'cnn-deep-learning-codebase': 'CNN',
  'gpt2-codebase': 'GPT2',
  'vlm-codebase': 'VLM',
  'stable-diffusion-codebase': 'SD',
  'reth-codebase': 'RETH',
  'prysm-codebase': 'PRYSM',
  'helios-codebase': 'HELIOS',
  'lighthouse-codebase': 'LH',
  'intel-sgx-codebase': 'SGX',
  'sev-snp-codebase': 'SEV',
  'optee-codebase': 'OPTEE',
  'dstack-codebase': 'DSTACK',
  'oasis-core-codebase': 'OASIS',
  'sp1-codebase': 'SP1',
  'risc0-codebase': 'RISC0',
  'jolt-codebase': 'JOLT',
};

const commandBySlug: Record<string, string[]> = {
  'ai-llm-ops-codebase': [
    "pytest tests -k 'router or fallback or cooldown or budget' -q",
    "pytest tests -k 'sft or grpo or reward or eval' -q",
  ],
  'cnn-deep-learning-codebase': [
    "pytest tests -k 'conv or residual or forward' -q",
    "pytest tests -k 'train_step or eval_loop' -q",
  ],
  'gpt2-codebase': [
    "pytest tests -k 'attention or block or generate' -q",
    "pytest tests -k 'loss or logits' -q",
  ],
  'vlm-codebase': [
    "pytest tests -k 'vision or projector or multimodal' -q",
    "pytest tests -k 'image_token or generate' -q",
  ],
  'stable-diffusion-codebase': [
    "pytest tests -k 'vae or unet or scheduler' -q",
    "pytest tests -k 'cfg or sample_loop' -q",
  ],
  'reth-codebase': [
    "cargo test -p reth-node -p reth-provider -p reth-transaction-pool --all-features",
    "cargo test -p reth-stages -p reth-network -p reth-rpc --all-features",
  ],
  'prysm-codebase': [
    "go test ./beacon-chain/blockchain ./beacon-chain/core/blocks",
    "go test ./beacon-chain/core/epoch ./beacon-chain/sync ./beacon-chain/db/kv",
  ],
  'helios-codebase': [
    "cargo test -p helios-consensus -p helios-ethereum --all-features",
    "cargo test -p client -p common --all-features",
  ],
  'lighthouse-codebase': [
    "cargo test -p beacon_chain -p network -p store --all-features",
    "cargo test -p validator_client -p execution_layer --all-features",
  ],
  'intel-sgx-codebase': ['make test SGX_MODE=SIM', 'ctest -R sgx'],
  'sev-snp-codebase': ['make kselftest TARGETS=x86', 'cargo test --features sev-snp'],
  'optee-codebase': ['xtest regression_1000', 'make CFG_TEE_CORE_LOG_LEVEL=2'],
  'dstack-codebase': ['cargo test --workspace --features tdx,attestation', 'cargo test -p kms -p guest-agent'],
  'oasis-core-codebase': ['go test ./go/...', 'cargo test -p oasis-runtime-sdk'],
  'sp1-codebase': ['cargo test -p sp1-core --all-features', "cargo test --workspace -k 'executor or prover or recursion'"],
  'risc0-codebase': ['cargo test -p risc0-zkvm --all-features', "cargo test --workspace -k 'session or receipt or recursion'"],
  'jolt-codebase': ['cargo test -p jolt-core --all-features', "cargo test --workspace -k 'instruction or prover or sumcheck'"],
};

function statusLabel(status: WorkspaceStatus) {
  if (status === 'done') return '작성됨';
  if (status === 'doing') return '확장 중';
  if (status === 'review') return '검토';
  return '대기';
}

function unitId(project: WorkspaceProject, index: number) {
  const prefix = prefixBySlug[project.slug] ?? 'CORE';
  return `${prefix}-${String(index + 1).padStart(3, '0')}`;
}

function commandFor(project: WorkspaceProject, index: number) {
  const commands = commandBySlug[project.slug] ?? ['프로젝트 테스트 명령 확정 필요'];
  return commands[index % commands.length];
}

function invariantFor(unit: WorkspaceUnit) {
  const evidence = unit.evidence ? ` 근거: ${unit.evidence}.` : '';
  return `${unit.title} 범위가 입력, 상태 전이, 실패 응답을 서로 섞지 않고 유지되는지 확인한다.${evidence}`;
}

function findRegistryProject(slug?: string) {
  if (!slug || !registrySlugs.has(slug)) return undefined;
  return workspaceProjects.find((project) => project.slug === slug);
}

function detailPath(section: string | undefined, project: WorkspaceProject, index: number) {
  return `${CORE_ROOT}/${section ?? project.track}/${project.slug}/unit-${index + 1}`;
}

export default function CodebaseRegistry() {
  const { section, item } = useParams<{ section: string; item: string }>();
  const navigate = useNavigate();
  const project = findRegistryProject(item);

  if (!project) {
    return (
      <div className="max-w-4xl">
        <Link to={CORE_ROOT} className="text-xs text-muted-foreground hover:text-foreground">← 코어</Link>
        <p className="mt-6 text-sm text-muted-foreground">코드베이스 레지스트리를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section id="overview">
        <p className="text-sm leading-relaxed text-muted-foreground">
          이 페이지는 블로그 아티클을 다시 보여주는 화면이 아니라, 블로그에 이미 정리된 코드베이스 범위를
          geth/vLLM과 같은 코어 검증 단위 형식으로 다시 배치한 레지스트리입니다.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['코드베이스', project.codebase ?? project.title],
            ['영역', project.area],
            ['트랙', project.track],
            ['관리 단위', `${project.units.length}개`],
            ['함수 커버리지', '각 상세 글의 소스별 함수 목록'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border bg-card p-4">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="mt-1 text-sm font-medium">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="function-coverage">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">함수 커버리지 기준</h2>
        <div className="rounded-lg border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
          표의 각 행은 별도 상세 글로 이동합니다. 상세 글 안의 <span className="font-medium text-foreground">함수 전체 커버리지</span>에서
          연결된 코드 소스의 함수 심볼을 전부 추출해 보여주고, 같은 화면의 코드 보기, 불변조건, 테스트 매트릭스로 추적합니다.
        </div>
      </section>

      <section id="units">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">검증 단위</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">ID</th>
                <th className="px-3 py-2 font-medium">범위</th>
                <th className="px-3 py-2 font-medium">검증 단위</th>
                <th className="px-3 py-2 font-medium">근거</th>
                <th className="px-3 py-2 font-medium">확인 명령</th>
                <th className="px-3 py-2 font-medium">상태</th>
                <th className="px-3 py-2 font-medium">코드</th>
                <th className="px-3 py-2 font-medium">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {project.units.map((unit, index) => (
                <tr
                  key={unit.title}
                  id={`unit-${index + 1}`}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(detailPath(section, project, index))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') navigate(detailPath(section, project, index));
                  }}
                  className="cursor-pointer scroll-mt-24 align-top transition-colors hover:bg-muted/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-foreground/30"
                >
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-muted-foreground">{unitId(project, index)}</td>
                  <td className="px-3 py-3 font-medium text-foreground">
                    <Link to={detailPath(section, project, index)} className="underline-offset-4 hover:underline">
                      {unit.title}
                    </Link>
                  </td>
                  <td className="px-3 py-3 leading-relaxed text-foreground/90">
                    <Link to={detailPath(section, project, index)} className="underline-offset-4 hover:underline">
                      {invariantFor(unit)}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{unit.evidence ?? '블로그 코드베이스 소스 보기에서 추출'}</td>
                  <td className="px-3 py-3">
                    <code className="block rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{commandFor(project, index)}</code>
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">{statusLabel(unit.status)}</span>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      to={`${detailPath(section, project, index)}#sources`}
                      onClick={(event) => event.stopPropagation()}
                      className="whitespace-nowrap rounded-md border px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
                    >
                      코드 보기
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      to={detailPath(section, project, index)}
                      onClick={(event) => event.stopPropagation()}
                      className="text-left text-xs font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
                    >
                      상세 보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="commands">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">확인 명령</h2>
        <div className="space-y-2">
          {(commandBySlug[project.slug] ?? ['프로젝트 테스트 명령 확정 필요']).map((command) => (
            <code key={command} className="block overflow-x-auto rounded-md border bg-card px-3 py-2 text-xs text-muted-foreground">
              {command}
            </code>
          ))}
        </div>
      </section>

      <section id="next">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">확장 상태</h2>
        <div className="rounded-lg border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
          {project.next}
        </div>
      </section>
    </div>
  );
}
