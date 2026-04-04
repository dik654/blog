import OverviewViz from './viz/OverviewViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  const open = (k: string) => onCodeRef?.(k, codeRefs[k]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">저장소 설계 철학 & Persistable</h2>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={onCodeRef ? open : undefined} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Commonware 저장소 — <strong>append-only</strong> 원칙<br />
          SSD 순차 쓰기에 최적화, 랜덤 쓰기와 GC를 제거<br />
          삭제 대신 비활성 마킹으로 처리
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Persistable trait</h3>
        <p>
          <strong>commit</strong> — 메모리 → OS 페이지 캐시 플러시<br />
          <strong>sync</strong> — 페이지 캐시 → SSD (fsync), 복구 불필요 보장<br />
          <strong>destroy</strong> — 파일 삭제 + 메모리 해제
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => open('persistable-trait')} />
            <span className="text-[10px] text-muted-foreground self-center">lib.rs — Persistable trait</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-6 mb-3">Context = Storage + Clock + Metrics</h3>
        <p>
          모든 프리미티브 초기화 시 Context를 수신<br />
          결정론적 시뮬레이션 — Clock을 가짜 시계로 교체 가능
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => open('context-trait')} />
            <span className="text-[10px] text-muted-foreground self-center">lib.rs — Context trait</span>
          </div>
        )}

        <div className="rounded-lg border border-amber-300 bg-amber-50/30 dark:bg-amber-950/10 p-4 mt-4">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">💡 설계 인사이트</p>
          <p className="text-sm">commit의 기본 구현이 sync를 호출 — "안전 우선" 기본값. 성능이 필요한 구현체만 commit을 오버라이드하여 약한 보장 선택 가능.</p>
        </div>
      </div>
    </section>
  );
}
