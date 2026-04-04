import AdbAnyViz from './viz/AdbAnyViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function AdbAny({ onCodeRef }: Props) {
  const open = (k: string) => onCodeRef?.(k, codeRefs[k]);
  return (
    <section id="adb-any" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">qmdb::any — 이력 값 증명</h2>
      <div className="not-prose mb-8">
        <AdbAnyViz onOpenCode={onCodeRef ? open : undefined} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          qmdb::any — <strong>"키가 특정 값을 가졌음"</strong>을 증명하는 DB<br />
          AuthenticatedLog(Journal + MMR) 위에 snapshot 인덱스를 결합<br />
          모든 쓰기를 append-only 로그에 기록, 포함 증명으로 이력 검증
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => open('any-db')} />
            <span className="text-[10px] text-muted-foreground self-center">any/db.rs — Db 구조체</span>
            <CodeViewButton onClick={() => open('any-get')} />
            <span className="text-[10px] text-muted-foreground self-center">any/db.rs — get()</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-6 mb-3">Inactivity Floor 기반 Pruning</h3>
        <p>
          inactivity_floor_loc — 이 위치 이전 연산은 전부 비활성<br />
          prune(loc) — floor 이전만 삭제 가능, 초과 시 에러 반환<br />
          활성 연산은 raise_floor()로 tip에 재기록 후 floor 이동
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Rewind 메커니즘</h3>
        <p>
          rewind(size) — DB를 과거 상태로 되돌리기<br />
          SnapshotUndo(Replace / Remove / Insert)로 역순 적용<br />
          rewind 후 commit/sync 전까지 재시작 불안정
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => open('any-proof')} />
            <span className="text-[10px] text-muted-foreground self-center">any/db.rs — proof()</span>
          </div>
        )}

        <div className="rounded-lg border border-amber-300 bg-amber-50/30 dark:bg-amber-950/10 p-4 mt-4">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">💡 설계 인사이트</p>
          <p className="text-sm">snapshot이 해시 인덱스 역할 — O(1) 키 조회 + 1회 순차 읽기로 값 반환. 트리 순회 완전 제거.</p>
        </div>
      </div>
    </section>
  );
}
