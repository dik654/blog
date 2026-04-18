export default function CustomTools() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">커스텀 도구 주입</h3>
      <div className="not-prose">
        <p className="text-sm font-semibold mb-3">OpenClaw 도구 구성</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-4">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Pi 내장 도구 (코딩 에이전트)</p>
            <p className="text-sm">Read, Write, Edit, Bash, Glob, Grep 등</p>
            <p className="text-xs text-muted-foreground mt-1">Claude Code와 유사한 파일/셸 도구</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 p-4">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">OpenClaw 전용 도구 (7종)</p>
            <div className="text-sm space-y-0.5 mt-1">
              <p><strong>messaging</strong> — 채널로 메시지 전송</p>
              <p><strong>camera</strong> — 디바이스 카메라 캡처</p>
              <p><strong>canvas</strong> — 라이브 Canvas 렌더링</p>
              <p><strong>subagent</strong> — 서브에이전트 스폰</p>
              <p><strong>session</strong> — 세션 관리</p>
              <p><strong>pdf</strong> — PDF 처리</p>
              <p><strong>media</strong> — 이미지/오디오/비디오</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 p-4">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">도구 정책</p>
          <p className="text-sm">
            <code className="text-xs">createOpenClawCodingTools()</code>로 Pi 도구와 OpenClaw 도구를 결합
          </p>
          <p className="text-xs text-muted-foreground mt-1">채널별 도구 허용/차단 정책 적용 + 샌드박스 환경에 따른 경로 정책</p>
        </div>
      </div>
    </>
  );
}
