import RegistryViz from "./viz/RegistryViz";

export default function Registry() {
  return (
    <section id="registry" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Codex는 작업 위치에서 repository root까지 찾고, 배포는 Plugin으로 분리한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Codex의 현재 local discovery는 repository·user·admin·system scope로
          나뉩니다. Repository에서는 실행한 current working directory부터
          repository root까지 각 <code>.agents/skills</code>를 스캔합니다. 따라서
          monorepo root에는 공통 workflow를, 하위 service에는 그 module 전용
          workflow를 둘 수 있습니다. 개인 Skill은
          <code>$HOME/.agents/skills</code>, machine·container의 admin Skill은
          <code>/etc/codex/skills</code>, system Skill은 OpenAI가 함께 제공합니다.
        </p>
        <p>
          같은 name이 여러 위치에 있어도 자동으로 합치거나 가까운 하나로 override하지 않습니다. 둘 다 selector에 나타날 수 있습니다. discovery 문제를 조사할 때
          file이 존재하는지만 확인하면 부족합니다. 실제 launch directory, repository root, symlink target, selector의 path와
          description까지 펼쳐 놓고 대조해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <RegistryViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 directory들은 local authoring과 repository 공유에 적합합니다. 다른 사용자가 설치하게 하거나 여러 Skill, registered 또는
          bundled MCP server, presentation asset을 묶어 내려면 Plugin으로 package합니다. Local Skill과 Plugin 사이에 우열은
          없습니다. 배포 범위와 update 책임이 다른 선택일 뿐입니다.
        </p>
        <p>
          실제 운영에서는 “어디에 둘까?”보다 owner·version·dependency·rollback을
          먼저 정합니다. Repository 변경과 함께 움직여야 하는 절차는 project
          scope에, 여러 repository에서 같은 개인 workflow는 user scope에, 조직이
          강제 배포하는 automation은 admin scope에 두는 식입니다. 외부 배포가
          필요해지는 순간에는 해당 Plugin registry의 현재 보안·심사·update 규약을
          별도로 확인합니다.
        </p>
      </div>
    </section>
  );
}
