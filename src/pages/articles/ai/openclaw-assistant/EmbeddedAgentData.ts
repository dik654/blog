export const embeddedAgentCode = `OpenClaw의 Pi 임베딩 방식:

일반적 접근 (subprocess):
  OpenClaw → spawn("pi-agent") → stdin/stdout → 결과 파싱
  → 프로세스 간 통신 오버헤드, 제한된 제어

OpenClaw 접근 (embedded):
  OpenClaw → import { createAgentSession } from 'pi-coding-agent'
           → 직접 인스턴스화 & 이벤트 구독
  → 완전한 라이프사이클 제어

세션 라이프사이클:
  1. createAgentSession(config)
     → 모델 선택, 시스템 프롬프트, 도구 설정

  2. 메시지 수신 시:
     runEmbeddedPiAgent({
       message,
       sessionManager,
       tools: [...builtInTools, ...openClawTools],
       systemPrompt: buildSystemPrompt(channel, context)
     })

  3. 이벤트 구독 (subscribeEmbeddedPiSession):
     → onBlockReply: 텍스트 스트리밍 → 채널에 전달
     → onToolCall: 도구 실행 상태 표시
     → onComplete: 최종 응답 전송

  4. 세션 영속성:
     → SessionManager가 대화 히스토리 파일로 관리
     → ~/.openclaw/sessions/{sessionId}.jsonl (JSONL 형식)
     → 브랜칭 & 컴팩션 지원
     → 채널/DM별 독립 세션

이벤트 스트림 흐름:
  agent_start → turn_start → message_start
    → text_delta... (스트리밍)
    → tool_execution_start → update → end
  → message_end → turn_end → agent_end

에이전트 루프 (pi-agent-core):
  의도적으로 최소화된 설계:
  LLM 스트리밍 → 도구 호출 확인 (없으면 중단)
    → 도구 순차 실행 → 결과를 컨텍스트에 추가 → 반복
  → 명시적 태스크 플래너나 DAG 없음 — LLM이 워크플로우 주도`;

export const embeddedAgentAnnotations = [
  { lines: [3, 5] as [number, number], color: 'rose' as const, note: '일반적 방식 — subprocess 오버헤드' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: '임베디드 방식 — 완전한 제어' },
  { lines: [12, 33] as [number, number], color: 'sky' as const, note: '세션 라이프사이클 4단계' },
  { lines: [40, 44] as [number, number], color: 'amber' as const, note: '최소 설계 에이전트 루프' },
];
