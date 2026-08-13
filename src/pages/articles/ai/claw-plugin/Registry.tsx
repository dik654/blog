import RegistryViz from "./viz/RegistryViz";

const validationRows = [
  ["Path", "manifest와 entrypoint의 canonical path가 plugin root 안에 있음"],
  ["Schema", "manifest·tool schema·protocol version이 지원 범위와 맞음"],
  ["Artifact", "digest와 선택적 signature가 설치 기록과 일치함"],
  ["Capability", "요청한 effect와 resource가 host policy 안에 있음"],
  ["Collision", "plugin·tool·hook namespace 충돌이 명시적으로 해결됨"],
];

export default function Registry() {
  return (
    <section id="registry" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        발견·검증·활성화를 서로 다른 단계로 둔다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          검색 경로에서 manifest를 찾았다는 사실은 실행 자격이 생겼다는 뜻이
          아닙니다. Discovery는 후보와 출처를 수집하는 read-only 단계이고,
          verification은 artifact와 호환성을 검사하며, activation은 사용자가
          승인한 exact artifact를 runtime registry에 공개하는 단계입니다.
        </p>

        <RegistryViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          검색 우선순위보다 출처를 보존한다
        </h3>
        <p>
          system·user·workspace 경로를 둘 수는 있지만 같은 이름이 나오면 높은
          우선순위가 조용히 덮어쓰게 해서는 안 됩니다. 특히 clone한 저장소의
          plugin이 사용자 plugin을 shadow하면 공급망 공격으로 이어질 수
          있습니다. registry key에는 canonical plugin ID와 publisher를 사용하고,
          여러 후보가 충돌하면 경로·version·digest를 보여준 뒤 하나를 명시적으로
          선택합니다.
        </p>
        <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
          {[
            [
              "System",
              "관리자가 배포한 후보이며 signer와 정책으로 신뢰를 표현합니다.",
            ],
            [
              "User",
              "사용자가 설치한 후보지만 이름만으로 자동 활성화하지 않습니다.",
            ],
            [
              "Workspace",
              "팀과 공유할 수 있어도 checkout만으로 실행 권한은 얻지 않습니다.",
            ],
          ].map(([title, description]) => (
            <section key={title} className="rounded-2xl border bg-card p-4">
              <h4 className="text-sm font-bold">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </section>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          코드를 실행하기 전에 정적으로 검증한다
        </h3>
        <p>
          verification은 plugin을 실행해 “정상인지 물어보는” 단계가 아닙니다.
          manifest parsing, symlink를 해소한 path boundary, digest, signature,
          API compatibility와 namespace collision을 부수 효과 없이 확인해야
          합니다. 지원하지 않는 필드는 무시하기보다 version 정책에 따라
          거부하거나 명시적인 warning을 남깁니다.
        </p>
        <div className="not-prose my-6 overflow-hidden rounded-2xl border border-border/70">
          <div className="divide-y divide-border/70">
            {validationRows.map(([name, rule]) => (
              <div
                key={name}
                className="grid gap-1 p-4 sm:grid-cols-[120px_1fr] sm:gap-4"
              >
                <code className="text-xs font-bold text-primary">{name}</code>
                <p className="text-sm leading-6 text-muted-foreground">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          신뢰는 이름이 아니라 artifact와 capability에 묶는다
        </h3>
        <p>
          <code>trusted_plugins = ["company-linter"]</code>처럼 이름만 저장하면
          같은 이름의 다른 binary나 업데이트된 버전이 승인을 상속합니다. 승인
          record에는 digest 또는 signer, plugin API version, 허용한 capability,
          scope와 만료를 포함해야 합니다. update가 새 capability를 요청하거나
          signer가 바뀌면 다시 승인받습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          registry는 완성된 snapshot만 공개한다
        </h3>
        <p>
          plugin 하나를 enable하면서 tool은 등록됐지만 hook 등록이 실패하면
          runtime이 반쪽 상태가 됩니다. 새 registry generation을 별도로 만들고
          모든 schema·collision·permission 검사를 통과한 뒤 pointer를 원자적으로
          교체해야 합니다. 진행 중 호출은 자신이 시작한 generation을 계속
          사용하고, 이전 generation은 reference가 사라질 때까지 draining합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          disable·update·remove는 서로 다른 동작이다
        </h3>
        <p>
          disable은 새 호출만 막고 설치 artifact와 승인 기록은 유지합니다.
          update는 새 artifact를 검증해 별도 generation으로 올린 뒤 실패하면
          이전 generation으로 rollback합니다. remove는 호출이 모두 끝난 뒤
          registry와 artifact를 제거하되, 감사 기록과 사용자가 만든 데이터까지
          임의로 지우지 않습니다. 이 구분이 있어야 운영 중 교체와 문제 조사 모두
          가능합니다.
        </p>
      </div>
    </section>
  );
}
