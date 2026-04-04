import type { CodeRef } from '@/components/code/types';

import embeddedRunnerTs from './codebase/openclaw/src/agents/pi-embedded-runner.ts?raw';
import modelAuthTs from './codebase/openclaw/src/agents/model-auth.ts?raw';
import channelRouterTs from './codebase/openclaw/src/channels/channel-router.ts?raw';
import skillEngineTs from './codebase/openclaw/src/skills/skill-engine.ts?raw';
import sandboxManagerTs from './codebase/openclaw/src/sandbox/sandbox-manager.ts?raw';

export const codeRefs: Record<string, CodeRef> = {
  'oc-embedded-runner': {
    path: 'openclaw/src/agents/pi-embedded-runner.ts',
    code: embeddedRunnerTs,
    lang: 'typescript',
    highlight: [22, 55],
    desc: 'runEmbeddedPiAgent는 Pi 에이전트를 인-프로세스로 실행합니다. subprocess 방식과 달리 직접 인스턴스화하여 완전한 라이프사이클 제어를 제공하며, 이벤트 스트림으로 텍스트/도구 상태를 채널에 전달합니다.',
    annotations: [
      { lines: [22, 30], color: 'sky', note: 'runEmbeddedPiAgent 시그니처 — 메시지, 세션, 도구, 프롬프트' },
      { lines: [31, 37], color: 'emerald', note: 'createAgentSession으로 세션 초기화' },
      { lines: [40, 54], color: 'amber', note: '이벤트 루프 — text_delta, tool_execution 등 처리' },
    ],
  },

  'oc-model-auth': {
    path: 'openclaw/src/agents/model-auth.ts',
    code: modelAuthTs,
    lang: 'typescript',
    highlight: [25, 55],
    desc: 'AuthProfileManager는 여러 AI 프로바이더를 동시 관리합니다. primary/fallbacks 순서로 페일오버하며, 실패한 프로파일은 쿨다운 후 자동 재활성화됩니다.',
    annotations: [
      { lines: [25, 26], color: 'sky', note: 'profiles + cooldowns 맵' },
      { lines: [30, 40], color: 'emerald', note: 'getAvailableProfiles — 쿨다운 만료 시 자동 재활성화' },
      { lines: [43, 49], color: 'amber', note: 'resolveModel — 첫 번째 사용 가능한 프로파일 선택' },
    ],
  },

  'oc-channel-router': {
    path: 'openclaw/src/channels/channel-router.ts',
    code: channelRouterTs,
    lang: 'typescript',
    highlight: [36, 60],
    desc: 'ChannelRouter는 6단계 메시지 처리 파이프라인을 구현합니다. Ingress → 정규화 → 접근 제어 → 세션 해석 → 에이전트 처리 → 응답 전달 순서로 메시지를 처리합니다.',
    annotations: [
      { lines: [36, 38], color: 'sky', note: 'handleMessage — 6단계 파이프라인 진입점' },
      { lines: [43, 45], color: 'emerald', note: '접근 제어: DM vs 그룹 정책' },
      { lines: [48, 55], color: 'amber', note: '세션 해석 + 에이전트 실행 (인-프로세스)' },
    ],
  },

  'oc-skill-engine': {
    path: 'openclaw/src/skills/skill-engine.ts',
    code: skillEngineTs,
    lang: 'typescript',
    highlight: [46, 62],
    desc: 'SkillEngine은 SKILL.md 기반 플러그인 시스템을 관리합니다. YAML frontmatter를 파싱하고, 적격 스킬을 XML 목록으로 시스템 프롬프트에 주입합니다 (스킬당 ~24 토큰).',
    annotations: [
      { lines: [46, 52], color: 'sky', note: 'loadSkill — SKILL.md YAML frontmatter 파싱' },
      { lines: [55, 61], color: 'emerald', note: 'buildSkillPromptBlock — 시스템 프롬프트 XML 주입' },
    ],
  },

  'oc-sandbox': {
    path: 'openclaw/src/sandbox/sandbox-manager.ts',
    code: sandboxManagerTs,
    lang: 'typescript',
    highlight: [37, 60],
    desc: 'SandboxManager는 Docker 기반 격리 실행을 관리합니다. Fail-closed 설계로 런타임 없으면 에러를 발생시키며, 24시간 유휴 또는 7일 경과 시 컨테이너를 자동 제거합니다.',
    annotations: [
      { lines: [37, 44], color: 'sky', note: 'ensureRuntime — Fail-closed: 런타임 없으면 에러' },
      { lines: [47, 50], color: 'emerald', note: 'needsSandbox — all/non-main/off 모드 판단' },
      { lines: [58, 67], color: 'amber', note: 'cleanup — 유휴/만료 컨테이너 자동 정리' },
    ],
  },
};
