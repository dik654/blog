import CodePanel from '@/components/ui/code-panel';

export default function ContextManagement() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">컨텍스트 관리</h3>
      <CodePanel title="컨텍스트 윈도우 관리" code={`컨텍스트 윈도우 관리:

문제: 긴 대화에서 컨텍스트 윈도우 초과
해결: 자동 컴팩션 (compaction)

컴팩션 과정:
  1. 토큰 사용량이 ~75-92%에 도달하면 자동 트리거
  2. 대화 히스토리를 핵심 결정/컨텍스트로 요약
  3. 상세 도구 출력 삭제, 요약만 유지
  4. 60-80% 토큰 감소 (150K → 30-50K)

주의: 컴팩션은 손실 있음 (lossy)
  → 특정 파일 경로, 에러 코드, 아키텍처 결정이 소실될 수 있음

→ 무한한 대화가 가능 (컨텍스트 윈도우 제한 없음)

CLAUDE.md (프로젝트 컨텍스트):
  프로젝트 루트에 CLAUDE.md 파일로 영구 컨텍스트 제공
  - 프로젝트 구조 설명
  - 코딩 규칙
  - 빌드/테스트 명령어
  - 커스텀 지시사항
  → 매 대화 시작 시 자동 로드`} annotations={[
        { lines: [6, 10], color: 'sky', note: '자동 컴팩션 과정 4단계' },
        { lines: [12, 13], color: 'rose', note: '손실 있는 압축 — 주의 필요' },
        { lines: [17, 23], color: 'emerald', note: 'CLAUDE.md로 영구 컨텍스트 제공' },
      ]} />
    </>
  );
}
