import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function SubAgentSandbox({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">서브에이전트 & 샌드박스</h3>
      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('oc-sandbox', codeRefs['oc-sandbox'])} />
          <span className="text-[10px] text-muted-foreground self-center">sandbox-manager.ts</span>
        </div>
      )}

      <div className="not-prose rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-5 mb-4">
        <h4 className="text-sm font-bold mb-3">서브에이전트 시스템</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">깊이 기반 권한 제어</span>
            <ul className="text-sm mt-2 space-y-1">
              <li><strong>Depth 0 (메인)</strong> — 전체 도구 접근, 서브에이전트 스폰 가능</li>
              <li><strong>Depth 1 (오케스트레이터)</strong> — maxSpawnDepth≥2 시 sessions_spawn 접근</li>
              <li><strong>Depth 1 (리프)</strong> — maxSpawnDepth=1, 세션 도구 없음</li>
              <li><strong>Depth 2 (리프 워커)</strong> — sessions_spawn 항상 거부</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">안전 제어</span>
            <ul className="text-sm mt-2 space-y-1">
              <li><strong>maxChildrenPerAgent: 5</strong> — 에이전트당 활성 자식 수 제한</li>
              <li><strong>캐스케이드 중단</strong> — 부모 중단 시 모든 자손 자동 중단</li>
              <li><strong>자동 아카이브</strong> — archiveAfterMinutes (기본: 60)</li>
              <li><strong>세션 키</strong> — subagent:&lt;parentId&gt;:d&lt;depth&gt;</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">비용 최적화</span>
            <p className="text-sm mt-1">agents.defaults.subagents.model로 서브에이전트에 저가 모델 지정</p>
            <p className="text-xs text-muted-foreground mt-1">메인은 고품질, 서브에이전트는 효율적 모델</p>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3">
            <span className="text-xs font-semibold">사용 사례</span>
            <p className="text-sm mt-1">"이 PR을 리뷰하고 테스트도 실행해줘"</p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
              <li>→ Subagent 1: PR 코드 리뷰</li>
              <li>→ Subagent 2: 테스트 실행</li>
              <li>→ 결과 종합하여 응답</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="not-prose rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-5 mb-4">
        <h4 className="text-sm font-bold mb-3">샌드박스 아키텍처</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">모드: "all"</span>
            <p className="text-sm mt-1">모든 세션을 Docker 컨테이너에서 실행</p>
          </div>
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">모드: "non-main"</span>
            <p className="text-sm mt-1">그룹/채널 세션만 샌드박스, 메인은 호스트</p>
          </div>
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">모드: off (기본)</span>
            <p className="text-sm mt-1">도구를 호스트에서 직접 실행</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-3">
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">Fail-closed 설계</span>
            <p className="text-sm mt-1">sandbox 설정인데 런타임 없으면 → 호스트 실행 대신 에러 발생</p>
            <p className="text-xs text-muted-foreground mt-1">tools.elevated로 특정 도구만 호스트 실행 허용 (escape hatch)</p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">컨테이너 자동 관리</span>
            <p className="text-sm mt-1">24시간 유휴 또는 7일 경과 시 자동 제거</p>
            <p className="text-xs text-muted-foreground mt-1">설정 변경 시 자동 재생성 (5분 내 사용 중이면 유지)</p>
          </div>
        </div>
      </div>

      <CitationBlock source="Docker Blog — Run OpenClaw Securely in Docker Sandboxes" citeKey={5} type="paper"
        href="https://docker.com/blog/run-openclaw-securely-in-docker-sandboxes">
        <p className="italic">
          "Fail-closed design: sandbox 설정인데 Docker 런타임이 없으면 호스트에서 실행하는 대신 에러를 발생시킨다.<br />
          컨테이너는 network:none 기본값으로 생성되며, non-root 사용자로 실행된다."
        </p>
        <p className="mt-2 text-xs">
          OpenClaw 샌드박스 — fail-closed 원칙. Docker 런타임 부재 시 호스트 폴백 없이
          명시적 에러 발생. 컨테이너는 24시간 유휴 또는 7일 경과 시 자동 제거,
          tools.elevated로 특정 도구만 호스트 실행을 허용하는 escape hatch 제공
        </p>
      </CitationBlock>
    </>
  );
}
