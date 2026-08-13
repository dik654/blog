import { ToolFrame, ToolRule, ToolSteps } from "./ToolVizPrimitives";

export default function RegistryLayersViz() {
  return (
    <ToolFrame
      label="UNIFIED REGISTRY"
      title="서로 다른 source를 한 registry entry 계약으로 정규화한다"
      description="built-in·plugin·MCP spec을 host가 검증한 뒤 stable identity, schema digest, effect metadata와 executor를 한 세대로 묶습니다."
      note="이름·schema·generation 충돌을 조용히 덮어쓰지 않습니다. 동일 이름이 필요하면 stable namespace로 구분하고, 재연결된 source는 새 generation을 publish합니다."
    >
      <ToolSteps
        items={[
          {
            label: "SOURCE 01",
            title: "Built-in",
            body: "read·search·edit·test처럼 host가 함께 배포한 구현입니다.",
            tone: "blue",
          },
          {
            label: "SOURCE 02",
            title: "Plugin",
            body: "manifest와 lifecycle owner를 통해 등록되는 확장입니다.",
            tone: "violet",
          },
          {
            label: "SOURCE 03",
            title: "MCP",
            body: "server가 protocol로 노출한 spec과 executor를 adapter가 bridge합니다.",
            tone: "amber",
          },
          {
            label: "OUTPUT",
            title: "Registry entry",
            body: "identity, schema, generation과 executor를 한 계약으로 묶습니다.",
            tone: "emerald",
          },
        ]}
      />
      <ToolRule>
        모델에는 현재 generation에서 실행 가능한 schema만 노출합니다. 이미 생성된
        call은 자신이 본 generation에 고정하고 다른 executor로 갈아타지 않습니다.
      </ToolRule>
    </ToolFrame>
  );
}
