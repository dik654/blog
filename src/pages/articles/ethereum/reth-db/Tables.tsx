import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TablesViz from './viz/TablesViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { TABLE_GROUPS, WHY_SEPARATE_TABLES } from './TablesData';

const COLOR_MAP: Record<string, string> = {
  sky: 'border-sky-500/50 bg-sky-500/5',
  emerald: 'border-emerald-500/50 bg-emerald-500/5',
  amber: 'border-amber-500/50 bg-amber-500/5',
};
const BADGE_MAP: Record<string, string> = {
  sky: 'bg-sky-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  amber: 'bg-amber-500 text-white',
};

export default function Tables({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  const [group, setGroup] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="tables" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tables 매크로 & 스키마</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Reth는 <code>tables!</code> 매크로로 모든 DB 테이블을 선언한다.<br />
          각 테이블의 Key/Value 타입이 컴파일 타임에 결정되므로 잘못된 타입으로 읽기/쓰기를 시도하면 컴파일 에러가 발생한다.<br />
          Geth는 <code>[]byte</code>로 직렬화하므로 타입 오류가 런타임에만 드러난다.{' '}
          <CodeViewButton onClick={() => open('db-tables')} />
        </p>
        <p className="leading-7">
          각 테이블은 MDBX의 named database(dbi, 하나의 DB 파일 안에서 독립적으로 관리되는 B+tree)로 생성된다.<br />
          테이블을 분리하면 각 B+tree가 작아지고, 캐시 효율이 높아진다.<br />
          아래에서 테이블 그룹별 구조를 확인할 수 있다.
        </p>

        {/* ── tables! 매크로 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">tables! 매크로 — 선언적 스키마</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">reth-db/src/tables/mod.rs — <code>tables!</code> 매크로 선언</p>
            <div className="space-y-2">
              {[
                { name: 'Headers', key: 'BlockNumber', val: 'Header', note: '블록 헤더' },
                { name: 'Transactions', key: 'TxNumber', val: 'TransactionSigned', note: '글로벌 TxNumber로 인덱싱' },
                { name: 'PlainAccountState', key: 'Address', val: 'Account', note: '계정 최신 상태' },
                { name: 'PlainStorageState', key: 'Address', val: '(StorageKey, StorageValue)', note: 'DupSort — 같은 Address 아래 여러 슬롯 정렬 저장', dup: true },
                { name: 'AccountChangeSets', key: 'BlockNumber', val: 'AccountBeforeTx', note: 'unwind 시 원상복구용' },
              ].map(t => (
                <div key={t.name} className="flex items-baseline gap-2 text-sm">
                  <code className="font-semibold text-indigo-400 shrink-0">{t.name}</code>
                  {t.dup && <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">DupSort</span>}
                  <span className="text-xs text-muted-foreground"><code>{t.key}</code> → <code>{t.val}</code></span>
                  <span className="text-xs text-foreground/50">— {t.note}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-1">... 총 ~30개 테이블</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              '각 테이블 → 별도 struct 확장',
              'Table trait (Key/Value 바인딩)',
              'MDBX dbi 생성 자동화',
              '컴파일 타임 키/값 타입 체크',
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-3 text-center">
                <p className="text-xs text-foreground/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="leading-7">
          <code>tables!</code> 매크로는 <strong>DSL(Domain-Specific Language)</strong> 역할.<br />
          선언 1줄 → struct 정의 + Table trait 구현 + dbi 등록이 자동.<br />
          새 테이블 추가 시 이 매크로 내부에 한 줄만 추가하면 됨.
        </p>

        {/* ── DupSort 활용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DupSort — MDBX의 멀티맵</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4 not-prose">
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold text-sm mb-2">일반 테이블 (unique key)</p>
            <p className="text-xs text-muted-foreground mb-2"><code>Headers</code>: <code>BlockNumber</code> → <code>Header</code></p>
            <div className="space-y-0.5 text-xs font-mono text-foreground/60">
              <p>key=18_000_000 val=Header&#123;..&#125;</p>
              <p>key=18_000_001 val=Header&#123;..&#125;</p>
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">DupSort 테이블 (key 중복, 값 정렬)</p>
            <p className="text-xs text-muted-foreground mb-2"><code>PlainStorageState</code>: <code>Address</code> → <code>(StorageKey, StorageValue)</code></p>
            <div className="space-y-0.5 text-xs font-mono text-foreground/60">
              <p>key=0xAAAA... val=(0x01, 100)</p>
              <p>key=0xAAAA... val=(0x02, 200) <span className="text-amber-400">← 같은 key</span></p>
              <p>key=0xAAAA... val=(0x03, 300)</p>
              <p>key=0xBBBB... val=(0x01, 500)</p>
            </div>
          </div>
        </div>
        <div className="my-3 not-prose">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">DupSort 장점</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-foreground/70">
              <p>한 번의 커서 이동으로 계정별 전체 스토리지 순회</p>
              <p>Address 앞부분만으로 prefix seek</p>
              <p>각 <code>(key, sub_key)</code> 쌍을 개별 삭제 (<code>delete_current</code>)</p>
            </div>
            <div className="mt-3 text-xs font-mono text-foreground/50 border-t border-border pt-2">
              <p>cur = tx.cursor_dup_read::&lt;PlainStorageState&gt;()?;</p>
              <p>cur.seek_exact(addr)?; // 특정 계정으로 이동</p>
              <p>cur.next_dup()? // 같은 key의 다음 슬롯 (정렬 순서)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          DupSort는 <strong>"같은 키에 여러 값"</strong>을 허용하면서 값들을 정렬 저장하는 MDBX 기능.<br />
          컨트랙트 스토리지(한 계정 = 많은 슬롯) 표현에 최적 — Address 키 아래 슬롯들을 정렬 보관.<br />
          <code>next_dup()</code>로 같은 key의 다음 값 이동, <code>next_no_dup()</code>로 다음 key로 이동.
        </p>

        {/* ── 30개 테이블 요약 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">전체 테이블 카테고리 — ~30개 분산</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-4 not-prose">
          {[
            { title: '블록 데이터', color: 'border-sky-500/20 bg-sky-500/5', titleColor: 'text-sky-400', tables: ['Headers', 'BlockBodies', 'BlockBodyIndices', 'CanonicalHeaders', 'HeaderNumbers'] },
            { title: '상태 데이터', color: 'border-emerald-500/20 bg-emerald-500/5', titleColor: 'text-emerald-400', tables: ['PlainAccountState', 'PlainStorageState (DupSort)', 'Bytecodes', 'AccountsHistory', 'StoragesHistory'] },
            { title: '트랜잭션 데이터', color: 'border-indigo-500/20 bg-indigo-500/5', titleColor: 'text-indigo-400', tables: ['Transactions', 'TransactionHashNumbers', 'TransactionBlocks', 'TxSenders', 'Receipts'] },
            { title: '변경 이력 (unwind)', color: 'border-amber-500/20 bg-amber-500/5', titleColor: 'text-amber-400', tables: ['AccountChangeSets', 'StorageChangeSets (DupSort)', 'BlockBodyIndices', 'StageCheckpoints'] },
            { title: 'Trie 데이터', color: 'border-violet-500/20 bg-violet-500/5', titleColor: 'text-violet-400', tables: ['AccountsTrie', 'StoragesTrie (DupSort)', 'HashedAccounts', 'HashedStorages (DupSort)'] },
            { title: '기타', color: 'border-border bg-muted/30', titleColor: 'text-muted-foreground', tables: ['PruneCheckpoints', 'Genesis', 'StageProgress', 'VersionHistory', 'BlockWithdrawals'] },
          ].map(g => (
            <div key={g.title} className={`rounded-lg border p-3 ${g.color}`}>
              <p className={`font-semibold text-xs mb-2 ${g.titleColor}`}>{g.title}</p>
              <div className="space-y-0.5">
                {g.tables.map(t => (
                  <p key={t} className="text-xs font-mono text-foreground/70">{t}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="leading-7">
          테이블 분리 원칙: <strong>쿼리 패턴별 분리</strong>.<br />
          "블록 해시로 번호 조회" vs "블록 번호로 해시 조회"는 별도 테이블 — 양방향 인덱스.<br />
          "최신 상태" vs "히스토리 인덱스"도 분리 — 각 테이블이 자기 쿼리 패턴에 최적화.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: 타입 안전성이 주는 것</p>
          <p className="mt-2">
            Geth의 DB 접근:<br />
            <code>data, err := db.Get([]byte("h" + num.Bytes()))</code><br />
            - key는 수동 바이트 조합 → 프리픽스 실수 가능<br />
            - value는 <code>[]byte</code> → 런타임 RLP 디코딩<br />
            - 타입 오류: 런타임 panic
          </p>
          <p className="mt-2">
            Reth의 DB 접근:<br />
            <code>let header: Header = tx.get::&lt;Headers&gt;(block_num)?;</code><br />
            - key는 <code>BlockNumber</code> 타입 → 컴파일러가 타입 검증<br />
            - value는 <code>Header</code> 자동 디코딩 → zero-copy 변환<br />
            - 타입 오류: 컴파일 에러
          </p>
          <p className="mt-2">
            약 30개 테이블 × 수천 DB 접근 지점 × "컴파일러가 잡는 모든 실수" = 큰 품질 이득.
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">테이블 그룹</h3>
      <div className="space-y-2 mb-8">
        {TABLE_GROUPS.map((g, gi) => (
          <motion.div key={gi} onClick={() => setGroup(gi)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${gi === group ? COLOR_MAP[g.color] : 'border-border'}`}
            animate={{ opacity: gi === group ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${gi === group ? BADGE_MAP[g.color] : 'bg-muted text-muted-foreground'}`}>{g.tables.length}</span>
              <span className="font-semibold text-sm">{g.title}</span>
            </div>
            <AnimatePresence>
              {gi === group && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div className="mt-3 ml-10 space-y-2">
                    {g.tables.map(t => (
                      <div key={t.name} className="text-sm">
                        <span className="font-mono font-semibold text-foreground">{t.name}</span>
                        <span className="text-muted-foreground ml-2">{t.key} → {t.value}</span>
                        <p className="text-xs text-foreground/60 mt-0.5">{t.note}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">설계 판단 Q&A</h3>
      <div className="space-y-2 mb-8">
        {WHY_SEPARATE_TABLES.map((q, i) => (
          <motion.div key={i} onClick={() => setFaq(faq === i ? null : i)}
            className={`rounded-lg border p-3 cursor-pointer transition-colors ${faq === i ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'}`}>
            <p className="text-sm font-semibold">{q.question}</p>
            <AnimatePresence>
              {faq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{q.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <TablesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
