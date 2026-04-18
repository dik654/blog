export default function ContextManagement() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">컨텍스트 관리</h3>
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-5 mb-4">
        <h4 className="text-sm font-bold mb-3">컨텍스트 윈도우 관리</h4>

        <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3 mb-3">
          <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">자동 컴팩션 과정</span>
          <p className="text-sm mt-1 mb-2">문제: 긴 대화에서 컨텍스트 윈도우 초과 → 해결: 자동 컴팩션(compaction)</p>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>토큰 사용량이 ~75-92%에 도달하면 자동 트리거</li>
            <li>대화 히스토리를 핵심 결정/컨텍스트로 요약</li>
            <li>상세 도구 출력 삭제, 요약만 유지</li>
            <li>60-80% 토큰 감소 (150K → 30-50K)</li>
          </ol>
        </div>

        <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-3 mb-3">
          <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">손실 있는 압축 — 주의 필요</span>
          <p className="text-sm mt-1">컴팩션은 손실 있음(lossy) → 특정 파일 경로, 에러 코드, 아키텍처 결정이 소실될 수 있음</p>
          <p className="text-xs text-muted-foreground mt-1">그럼에도 무한한 대화가 가능 (컨텍스트 윈도우 제한 없음)</p>
        </div>

        <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">CLAUDE.md — 영구 컨텍스트</span>
          <p className="text-sm mt-1 mb-1">프로젝트 루트에 CLAUDE.md 파일로 영구 컨텍스트 제공</p>
          <ul className="text-sm space-y-0.5 list-disc list-inside">
            <li>프로젝트 구조 설명</li>
            <li>코딩 규칙</li>
            <li>빌드/테스트 명령어</li>
            <li>커스텀 지시사항</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2">매 대화 시작 시 자동 로드</p>
        </div>
      </div>
    </>
  );
}
