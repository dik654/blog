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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// reth-db/src/tables/mod.rs
tables! {
    /// 블록 헤더
    table Headers { BlockNumber => Header }

    /// 트랜잭션 (글로벌 TxNumber로 인덱싱)
    table Transactions { TxNumber => TransactionSigned }

    /// 계정 최신 상태
    table PlainAccountState { Address => Account }

    /// 스토리지 최신 상태 — DupSort: 같은 Address 아래 여러 슬롯 정렬 저장
    dupsort table PlainStorageState {
        Address => (StorageKey, StorageValue)
    }

    /// 계정 변경 이력 — unwind 시 원상복구용
    table AccountChangeSets { BlockNumber => AccountBeforeTx }

    // ... 총 ~30개 테이블
}

// 매크로 전개 결과:
// - 각 테이블이 별도 struct로 확장됨
// - Table trait 구현 (Key/Value 타입 바인딩)
// - MDBX dbi 생성 자동화 (init 시점)
// - 컴파일 타임 키/값 타입 체크`}
        </pre>
        <p className="leading-7">
          <code>tables!</code> 매크로는 <strong>DSL(Domain-Specific Language)</strong> 역할.<br />
          선언 1줄 → struct 정의 + Table trait 구현 + dbi 등록이 자동.<br />
          새 테이블 추가 시 이 매크로 내부에 한 줄만 추가하면 됨.
        </p>

        {/* ── DupSort 활용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DupSort — MDBX의 멀티맵</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 일반 테이블 (unique key)
// Headers: BlockNumber → Header
//   key=18_000_000  val=Header{..}
//   key=18_000_001  val=Header{..}

// DupSort 테이블 (key 중복 허용, 값은 정렬)
// PlainStorageState: Address → (StorageKey, StorageValue)
//   key=0xAAAA...   val=(0x01, 100)
//   key=0xAAAA...   val=(0x02, 200)  ← 같은 key, 다른 value
//   key=0xAAAA...   val=(0x03, 300)
//   key=0xBBBB...   val=(0x01, 500)

// 장점:
// 1. 계정당 스토리지를 한 번의 커서 이동으로 모두 순회
// 2. Address 앞부분만으로 prefix seek 가능
// 3. 각 (key, sub_key) 쌍을 개별 삭제 가능 (delete_current)

// 커서 사용:
let mut cur = tx.cursor_dup_read::<PlainStorageState>()?;
cur.seek_exact(Address::from([0xAA; 20]))?;  // 0xAAAA... 계정
while let Some((addr, (slot_key, slot_val))) = cur.next_dup()? {
    // 이 계정의 모든 스토리지 슬롯 순회 (정렬된 순서로)
}`}
        </pre>
        <p className="leading-7">
          DupSort는 <strong>"같은 키에 여러 값"</strong>을 허용하면서 값들을 정렬 저장하는 MDBX 기능.<br />
          컨트랙트 스토리지(한 계정 = 많은 슬롯) 표현에 최적 — Address 키 아래 슬롯들을 정렬 보관.<br />
          <code>next_dup()</code>로 같은 key의 다음 값 이동, <code>next_no_dup()</code>로 다음 key로 이동.
        </p>

        {/* ── 30개 테이블 요약 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">전체 테이블 카테고리 — ~30개 분산</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 카테고리별 테이블 분포
//
// [블록 데이터]                  [상태 데이터]
// Headers                        PlainAccountState
// BlockBodies                    PlainStorageState (DupSort)
// BlockBodyIndices               Bytecodes
// CanonicalHeaders               AccountsHistory
// HeaderNumbers                  StoragesHistory
//
// [트랜잭션 데이터]              [변경 이력 (unwind 용)]
// Transactions                   AccountChangeSets
// TransactionHashNumbers         StorageChangeSets (DupSort)
// TransactionBlocks              BlockBodyIndices
// TxSenders                      StageCheckpoints
// Receipts
//
// [Trie 데이터]                  [기타]
// AccountsTrie                   PruneCheckpoints
// StoragesTrie (DupSort)         Genesis
// HashedAccounts                 StageProgress
// HashedStorages (DupSort)       VersionHistory
//                                BlockWithdrawals`}
        </pre>
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
