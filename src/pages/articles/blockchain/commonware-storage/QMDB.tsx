import QMDBViz from './viz/QMDBViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function QMDB({ onCodeRef }: Props) {
  const open = (k: string) => onCodeRef?.(k, codeRefs[k]);
  return (
    <section id="qmdb" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">QMDB: O(1) SSD 인증 데이터베이스</h2>
      <div className="not-prose mb-8">
        <QMDBViz onOpenCode={onCodeRef ? open : undefined} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          QMDB — LayerZero 협력 개발 인증 DB<br />
          MPT의 랜덤 SSD I/O 병목 제거<br />
          읽기·쓰기·Merkleization 모두 <strong>O(1) 또는 0 SSD I/O</strong>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Batch Lifecycle</h3>
        <p>
          new_batch → write(key, value) → merkleize(db) → finalize → apply<br />
          merkleized batch에서 자식 배치 분기 가능 — 투기적 실행<br />
          공통 조상을 공유하며 최종 leaf만 apply
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => open('any-db')} />
            <span className="text-[10px] text-muted-foreground self-center">any/db.rs — Db</span>
            <CodeViewButton onClick={() => open('current-db')} />
            <span className="text-[10px] text-muted-foreground self-center">current/db.rs — Current Db</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 설계: Flat KV + In-Memory Merkle</h3>
        <p>
          Flat Key-Value — 해시 인덱스로 1 SSD read, 트리 순회 없음<br />
          In-Memory Merkleization — 2.3 bytes/entry, SSD I/O 0<br />
          10억 엔트리에서도 ~2.3GB 메모리면 충분
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">모듈 변형</h3>
        <p>
          ordered/unordered × fixed/variable = 4가지 조합<br />
          ordered — 키 정렬 순서 보장 (범위 쿼리 가능)<br />
          fixed — 고정 크기 값 (레이아웃 최적화)<br />
          immutable — 삭제 불가, keyless — 키 없는 순차 DB
        </p>

        <div className="rounded-lg border border-amber-300 bg-amber-50/30 dark:bg-amber-950/10 p-4 mt-4">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">💡 설계 인사이트</p>
          <p className="text-sm">MPT 대비 2.28M ops/sec — O(log n) 랜덤 I/O를 O(1) 순차 쓰기로 전환. SSD의 물리적 특성(순차 우위)을 소프트웨어 설계로 극대화.</p>
        </div>
      </div>
    </section>
  );
}
