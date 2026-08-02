import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import Overview from './claw-mcp/Overview';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

export default function ClawMcpArticle() {
  return (
    <>
      <QuestionLead
        question="Claw는 외부 MCP 도구를 쓰는 클라이언트인가, 다른 프로그램에 도구를 내주는 서버인가?"
        answer={<>둘 다 가능하다. 평소 CLI는 설정된 외부 서버를 자식 프로세스로 띄워 도구를 소비한다. 반대로 <code>claw mcp serve</code>는 Claw의 기본 도구를 stdio MCP 서버로 노출한다. 같은 JSON-RPC 계약에서 화살표의 방향과 책임만 바뀐다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'transport descriptor', meaning: '설정에 적힌 stdio·SSE·HTTP·WebSocket·SDK·managed proxy 연결 정보.', why: '설정이 표현할 수 있는 범위와 현재 runtime이 실제 실행하는 범위를 구분한다.' },
          { term: 'JSON Schema', meaning: 'tool argument object에 어떤 field가 있고 각 값의 type·필수 여부가 무엇인지 적는 기계 판독 규칙이다.', why: '모델과 runtime이 도구 이름뿐 아니라 호출할 입력 모양도 같은 계약으로 공유한다.' },
          { term: 'discovery', meaning: 'initialize 뒤 tools/list를 호출해 서버가 제공하는 도구 이름과 JSON Schema를 가져오는 단계.', why: '모델에게 존재하지 않는 도구를 보여 주거나 잘못된 입력 형식을 보내지 않게 한다.' },
          { term: 'qualified name', meaning: '서버 이름과 도구 이름을 mcp__server__tool 형태로 합친 전역 이름.', why: '여러 서버가 같은 echo 도구를 제공해도 호출 대상을 잃지 않는다.' },
          { term: 'degraded startup', meaning: '일부 서버가 실패해도 정상 서버의 도구는 남기는 시작 상태.', why: '한 통합의 장애가 전체 에이전트의 도구 표면을 모두 지우지 않게 한다.' },
        ]}
      />
      <Misconception>
        <code>McpLifecycleValidator</code>가 실제 subprocess를 순서대로 구동하는 엔진은 아니다.
        이 타입은 허용된 phase 전이와 오류 기록을 검증하는 별도 상태 기록기다. 실제 CLI 실행은
        <code> RuntimeMcpState</code>와 <code>McpServerManager</code>가 담당한다.
      </Misconception>
      <Overview />
      <StopRule>
        MCP 전체 규격의 elicitation·sampling·prompt까지 넓히지 않는다. 이 revision에서 설정이
        표현하는 transport와 stdio manager가 실행하는 transport를 구분하고, 외부 도구 소비 경로와
        <code> claw mcp serve</code>의 반대 방향을 소스에서 추적할 수 있으면 멈춘다.
      </StopRule>
      <CapabilityCheck
        items={[
          'HTTP 서버 설정이 파싱돼도 현재 McpServerManager가 실행하지 않는 이유를 설명한다.',
          'tools/list의 raw name이 mcp__server__tool 이름과 route index로 바뀌는 과정을 추적한다.',
          '서버 하나가 실패해도 다른 서버의 도구가 남는 조건을 degraded report로 설명한다.',
          'Content-Length frame과 JSON-RPC id 검사가 각각 어떤 경계 오류를 막는지 설명한다.',
          '응답 id 검증이 여러 in-flight request를 병렬 demux하는 reader 구현을 뜻하지 않는 이유를 설명한다.',
          'tools/call timeout이 같은 호출을 자동 재실행한다는 주장이 왜 틀렸는지 설명한다.',
          '11개 lifecycle phase 중 ResourceDiscovery를 건너뛸 수 있는 경로와 복구 불가능 오류 뒤의 제한을 찾는다.',
          '외부 MCP 서버를 소비하는 경로와 Claw 자체를 MCP 서버로 노출하는 경로를 반대로 그린다.',
          'claw mcp serve가 resources·prompts·sampling까지 제공한다는 주장을 source dispatch 범위로 반박한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="claw-config" learningPathId="ai-claw-infra">MCP 설정의 출처와 병합</InternalLink></span>
        <span>실행 경계: <InternalLink slug="claw-tool-system" learningPathId="ai-claw-core">도구 definition · permission · executor</InternalLink></span>
        <span>연결: <InternalLink slug="claw-api-client" learningPathId="ai-claw-infra">모델 요청과 tool call wire</InternalLink></span>
        <span>다음: <InternalLink slug="claw-cli" learningPathId="ai-claw-infra">CLI에서 turn runtime을 다시 조립하는 경계</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw runtime/mcp_client.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/mcp_client.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. 6개 transport descriptor와 OAuth 표현, stdio 기본 timeout 원문.` },
          { label: 'Claw runtime/mcp_stdio.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/mcp_stdio.rs`, note: '실제 stdio manager의 discovery, qualified route, frame, timeout, reset과 best-effort 동작.' },
          { label: 'Claw runtime/mcp_lifecycle_hardened.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/mcp_lifecycle_hardened.rs`, note: '11개 phase, 허용 전이와 structured failure 기록의 독립 검증 계약.' },
          { label: 'Claw runtime/mcp_server.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/mcp_server.rs`, note: 'Claw가 서버가 될 때의 initialize·tools/list·tools/call과 Content-Length framing.' },
          { label: 'Claw CLI main.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/rusty-claude-cli/src/main.rs`, note: 'RuntimeMcpState startup, runtime tool 등록·권한, dispatch, shutdown과 claw mcp serve 진입점.' },
          { label: 'Claw runtime/mcp_tool_bridge.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/mcp_tool_bridge.rs`, note: '별도 registry bridge의 실제 상태·manager 연결. CLI 직접 경로와 혼동하지 않기 위한 보조 근거.' },
        ]}
      />
    </>
  );
}
