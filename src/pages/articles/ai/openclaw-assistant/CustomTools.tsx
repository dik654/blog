import CodePanel from '@/components/ui/code-panel';

export default function CustomTools() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">커스텀 도구 주입</h3>
      <CodePanel title="OpenClaw 도구 구성" code={`OpenClaw이 Pi 에이전트에 추가하는 도구:

Pi 내장 도구 (코딩 에이전트):
  Read, Write, Edit, Bash, Glob, Grep 등
  → Claude Code와 유사한 파일/셸 도구

OpenClaw 전용 도구:
  messaging  — 채널로 메시지 전송
  camera     — 디바이스 카메라 캡처 (macOS/iOS)
  canvas     — 라이브 Canvas 렌더링
  subagent   — 서브에이전트 스폰
  session    — 세션 관리 (목록, 전환, 종료)
  pdf        — PDF 처리
  media      — 이미지/오디오/비디오 처리

도구 정책:
  createOpenClawCodingTools()로 통합
  → Pi 도구와 OpenClaw 도구를 결합
  → 채널별 도구 허용/차단 정책 적용
  → 샌드박스 환경에 따른 경로 정책`} annotations={[
        { lines: [3, 5], color: 'sky', note: 'Pi 내장 코딩 도구' },
        { lines: [7, 14], color: 'emerald', note: 'OpenClaw 전용 도구 7종' },
        { lines: [16, 20], color: 'amber', note: '도구 정책 — 채널별 필터링' },
      ]} />
    </>
  );
}
