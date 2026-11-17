import SceneShell from "./SceneShell";

/**
 * 본문 대응: #build-deploy-gate 첫 문단 "Staging에서 다시 빌드한 뒤 production에서 또 빌드하면 검증 대상이 달라집니다.
 * 같은 digest를 environment-specific configuration과 secret으로 실행하고 deploy principal의 권한을 source author와 분리합니다."
 * 환경 순서 staging → canary → production은 글의 RELEASE 단계에서 가져왔습니다. digest 이름 X·Y는 설명용 표시입니다(가정).
 */
type Env = { name: string; digest: string; tested: boolean; config: string };

type Scene = {
  label: string;
  summary: string;
  note: string;
  builds: number;
  envs: readonly Env[];
  verdict: string;
  bad: boolean;
  showInputs: boolean;
  showPrincipal: boolean;
};

const ONE_BUILD: readonly Env[] = [
  { name: "Staging", digest: "X", tested: true, config: "staging config·secret" },
  { name: "Canary", digest: "X", tested: true, config: "canary config·secret" },
  { name: "Production", digest: "X", tested: true, config: "production config·secret" },
];

const SCENES: readonly Scene[] = [
  {
    label: "환경마다 다시 빌드",
    summary: "검사한 X ≠ 배포한 Y",
    note: "Staging에서 빌드한 artifact X를 검사한 뒤 production에서 다시 빌드하면 production이 실행하는 것은 검사하지 않은 다른 artifact Y가 됩니다. Test·scan을 통과한 것과 배포한 것이 일치한다고 말할 수 없습니다.",
    builds: 2,
    envs: [
      { name: "Staging", digest: "X", tested: true, config: "staging config·secret" },
      { name: "Production", digest: "Y", tested: false, config: "production config·secret" },
    ],
    verdict: "검증 대상과 배포 대상이 다름",
    bad: true,
    showInputs: false,
    showPrincipal: false,
  },
  {
    label: "한 번 빌드",
    summary: "입력 → digest X + SBOM",
    note: "Build는 source commit, lockfile, build image, toolchain과 test·scan receipt를 입력으로 immutable artifact 하나를 만들고 그 digest(내용에서 계산한 고유 식별값)와 SBOM(들어간 구성요소 목록)을 남깁니다.",
    builds: 1,
    envs: [],
    verdict: "artifact X 하나와 그 provenance",
    bad: false,
    showInputs: true,
    showPrincipal: false,
  },
  {
    label: "같은 X를 승격",
    summary: "환경마다 바뀌는 것은 설정뿐",
    note: "Staging·canary·production은 모두 같은 digest X를 실행합니다. 환경마다 달라지는 것은 environment-specific configuration과 secret이며, artifact는 다시 만들지 않습니다.",
    builds: 1,
    envs: ONE_BUILD,
    verdict: "검사한 X = 배포한 X",
    bad: false,
    showInputs: false,
    showPrincipal: false,
  },
  {
    label: "배포 권한 분리",
    summary: "deploy principal ≠ source author",
    note: "X를 환경에 올리는 deploy principal(배포를 실행하는 계정)의 권한을 code를 쓴 source author와 분리합니다.",
    builds: 1,
    envs: ONE_BUILD,
    verdict: "작성 권한과 배포 권한이 다른 주체",
    bad: false,
    showInputs: false,
    showPrincipal: true,
  },
];

const INPUTS = ["Source commit", "Lockfile", "Build image", "Toolchain", "Test·scan receipt"] as const;

function Artifact({ digest, tested }: { digest: string; tested: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[11px] font-bold ${
        tested ? "border-[#2563eb] text-[#2563eb] dark:text-[#60a5fa]" : "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]"
      }`}
    >
      digest {digest}
      <span className="font-sans text-[10px] font-semibold">{tested ? "검사함" : "검사 안 함"}</span>
    </span>
  );
}

export default function SameArtifactViz() {
  return (
    <SceneShell
      eyebrow="Artifact provenance"
      title="환경마다 다시 빌드하면 검사한 것과 배포한 것이 달라집니다"
      description="파란 테두리는 test·scan을 통과한 artifact, 빨간 테두리는 검사하지 않은 artifact입니다. digest 이름 X·Y는 설명용 표시입니다(가정)."
      ariaLabel="환경별 재빌드와 같은 artifact 승격 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="min-h-[7.5rem] rounded-lg border border-border bg-background p-3">
              <p className="text-[10px] font-black text-muted-foreground">Build 횟수 · {scene.builds}번</p>
              {scene.showInputs ? (
                <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5">
                  {INPUTS.map((item) => (
                    <span key={item} className="rounded border border-border px-1.5 py-0.5 text-[11px]">
                      {item}
                    </span>
                  ))}
                  <span className="px-1 text-xs text-muted-foreground" aria-hidden="true">→</span>
                  <Artifact digest="X" tested />
                  <span className="rounded border border-border px-1.5 py-0.5 text-[11px]">SBOM</span>
                </div>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {scene.envs.map((env) => (
                    <div key={env.name} className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[6.5rem_auto_minmax(0,1fr)]">
                      <span className="text-xs font-bold">{env.name}</span>
                      <Artifact digest={env.digest} tested={env.tested} />
                      <span className="col-start-2 break-keep text-[11px] text-muted-foreground sm:col-start-auto">+ {env.config}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-2 text-[11px]">
              <div className={`rounded-lg border px-2 py-1.5 ${scene.showPrincipal ? "border-[#2563eb]" : "border-border text-muted-foreground/60"}`}>
                <p className="font-bold">Source author</p>
                <p>code를 쓰고 pull request를 엶</p>
              </div>
              <div className={`rounded-lg border px-2 py-1.5 ${scene.showPrincipal ? "border-[#2563eb]" : "border-border text-muted-foreground/60"}`}>
                <p className="font-bold">Deploy principal</p>
                <p>digest X를 환경에 올림</p>
              </div>
            </div>
            <div
              className={`rounded-lg border px-3 py-2 text-sm font-bold ${scene.bad ? "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]" : "border-border"}`}
            >
              {scene.verdict}
            </div>
          </div>
        );
      }}
    />
  );
}
