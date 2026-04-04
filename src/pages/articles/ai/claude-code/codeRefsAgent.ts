import type { CodeRef } from '@/components/code/types';
import sweepTs from './codebase/claude-code/scripts/sweep.ts?raw';

export const agentCodeRefs: Record<string, CodeRef> = {
  'agent-0': {
    path: 'claude-code/scripts/sweep.ts',
    code: sweepTs,
    lang: 'typescript',
    highlight: [15, 41],
    annotations: [
      { lines: [15, 21], color: 'sky',     note: 'githubRequest — 제네릭 타입의 GitHub API 래퍼 함수' },
      { lines: [22, 32], color: 'emerald', note: 'fetch 호출 — Bearer 토큰 인증, JSON 바디 직렬화' },
      { lines: [34, 41], color: 'amber',   note: '응답 처리 — 404는 빈 객체 반환, 기타 오류는 예외 발생' },
    ],
    desc:
`문제: Claude Code의 GitHub Actions 워크플로우에서 이슈를 자동으로 관리해야 합니다.

해결: sweep.ts는 Bun 런타임으로 실행되는 이슈 관리 스크립트입니다.
githubRequest()는 GitHub REST API를 래핑하며, Bearer 토큰 인증과 JSON 직렬화를 처리합니다.
이 패턴이 에이전트 루프에서 외부 API와 상호작용하는 기본 구조입니다.

하이라이트 구간: API 래퍼 함수 — 인증 → 요청 → 응답 처리`,
  },

  'agent-1': {
    path: 'claude-code/scripts/sweep.ts',
    code: sweepTs,
    lang: 'typescript',
    highlight: [45, 80],
    annotations: [
      { lines: [45, 52], color: 'sky',     note: 'markStale — 비활성 이슈 탐색 시작, 날짜 기준 계산' },
      { lines: [54, 60], color: 'emerald', note: '페이지네이션 루프 — 최대 10페이지, 100개씩 조회' },
    ],
    desc:
`문제: 수백 개의 GitHub 이슈 중 오래된 비활성 이슈를 자동으로 식별해야 합니다.

해결: markStale()는 lifecycle 설정에서 stale 기준일을 가져와 cutoff 날짜를 계산하고,
페이지네이션으로 모든 오픈 이슈를 순회하며 기준일 이전에 마지막 업데이트된 이슈에 stale 라벨을 추가합니다.

하이라이트 구간: 비활성 기준 계산 → 페이지네이션 조회`,
  },
};
