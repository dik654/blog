import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StaticFilesViz from './viz/StaticFilesViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { ARCHIVE_STEPS, GETH_FREEZER_COMPARISON } from './StaticFilesData';

const CELL = 'border border-border px-4 py-2';

export default function StaticFiles({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  const [step, setStep] = useState(0);

  return (
    <section id="static-files" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StaticFiles (고대 데이터)</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움 메인넷은 2015년부터 2,100만 개 이상의 블록을 생성했다.<br />
          이 모든 데이터를 하나의 MDBX에 저장하면 B+tree 깊이가 증가하고 최신 데이터 조회도 느려진다.<br />
          제네시스 블록 데이터와 최신 블록 데이터가 같은 트리에 섞여 있기 때문이다.
        </p>
        <p className="leading-7">
          <strong>핵심 관찰:</strong> finalized(확정, 되돌릴 수 없는) 블록 이전의 데이터는 더 이상 변경되지 않는다.<br />
          변경 불가능한 데이터를 B+tree에 계속 보관할 이유가 없다.<br />
          Reth는 이 데이터를 flat file(단순 연속 바이트 파일)로 아카이브하여 MDBX에는 최신 데이터만 유지한다.{' '}
          <CodeViewButton onClick={() => open('db-static-file')} />
        </p>
        <p className="leading-7">
          Geth도 동일한 아이디어를 <strong>Freezer</strong>(ancient store)로 구현한다.<br />
          차이점은 Reth가 <code>DashMap</code>(lock-free 동시성 해시맵)으로 세그먼트 경계를 관리하여 읽기 경로에서 락(lock) 경합이 없다는 점이다.
        </p>

        {/* ── StaticFileProvider 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StaticFileProvider 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct StaticFileProvider {
    path: PathBuf,                    // static_files/ 디렉토리
    highest_block: DashMap<           // 세그먼트별 최신 블록
        StaticFileSegment, BlockNumber
    >,
}

pub enum StaticFileSegment {
    Headers,        // headers/ 디렉토리
    Transactions,   // transactions/
    Receipts,       // receipts/
}

// 파일 명명 규칙: static_files/{segment}/{start_block}-{end_block}.jar
// 예시:
// static_files/headers/0-499999.jar       (첫 50만 블록)
// static_files/headers/500000-999999.jar  (다음 50만 블록)
// ...
// static_files/headers/18500000-18999999.jar

// 각 .jar 파일 내부:
// - 고정 크기 오프셋 테이블 (블록 번호 → 파일 오프셋)
// - 압축된 RLP 데이터 (Zstd 또는 LZ4)
// - 체크섬 (xxHash)`}
        </pre>
        <p className="leading-7">
          <code>DashMap</code>은 lock-free 동시성 해시맵 — 여러 스레드가 세그먼트 경계를 동시에 조회 가능.<br />
          세그먼트를 50만 블록 단위로 쪼개는 이유: 파일 1개가 너무 커지면 open/close 오버헤드 증가.<br />
          파일명에 범위가 들어가 있어 <strong>블록 번호 → 파일 선택</strong>이 O(1) 계산으로 결정.
        </p>

        {/* ── 오프셋 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 번호 → 파일 오프셋 O(1) 변환</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`impl StaticFileProvider {
    pub fn header_by_number(&self, num: BlockNumber) -> Result<Option<Header>> {
        // 1. 세그먼트 파일 결정 (500,000 단위)
        let segment_start = (num / 500_000) * 500_000;
        let segment_end = segment_start + 499_999;
        let file_path = self.path
            .join("headers")
            .join(format!("{segment_start}-{segment_end}.jar"));

        // 2. 파일 열기 (mmap, 캐시됨)
        let file = self.open_mmap(&file_path)?;

        // 3. 오프셋 테이블에서 오프셋 조회
        //    각 엔트리는 8바이트(u64) 고정 → 블록 상대 번호 × 8로 접근
        let rel_num = num - segment_start;
        let offset_table_entry = rel_num as usize * 8;
        let data_offset = u64::from_le_bytes(
            file[offset_table_entry..offset_table_entry + 8].try_into()?
        );

        // 4. 압축 데이터 읽기 → 압축 해제 → RLP 디코딩
        let compressed = &file[data_offset as usize..];
        let decompressed = zstd::decode(compressed)?;
        let header: Header = alloy_rlp::decode(&decompressed)?;

        Ok(Some(header))
    }
}

// 전체 경로: O(1) 파일 선택 + O(1) 오프셋 조회 + 압축 해제
// → 결과: 어느 블록이든 동일한 접근 시간`}
        </pre>
        <p className="leading-7">
          핵심 설계: <strong>블록 번호가 곧 배열 인덱스</strong>.<br />
          MDBX B+tree는 키 탐색에 log(n) 필요하지만, flat file은 곱셈 1회로 오프셋 결정.<br />
          압축 해제 비용(마이크로초 단위)이 추가되지만 디스크 I/O는 순차 읽기로 최적화.
        </p>

        {/* ── 압축 이득 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Zstd 압축 — 디스크 공간 절약</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 메인넷 데이터 크기 (2026년 초 기준)
//
//                         원본        Zstd 압축       비율
// Headers                ~9 GB       ~3 GB          33%
// Transactions          ~180 GB      ~80 GB         44%
// Receipts              ~120 GB      ~40 GB         33%
// ──────────────────────────────────
// 합계                  ~309 GB      ~123 GB        40%

// Zstd 선택 이유:
// 1. 압축률: gzip 대비 20% 우수
// 2. 압축 해제 속도: ~500 MB/s per core (읽기 병목 아님)
// 3. 블록 단위 독립 압축 가능 (random access)
// 4. 사전(dictionary) 공유로 작은 블록도 효과적 압축

// 트레이드오프:
// + 디스크 180 GB 절약
// + SSD 수명 연장 (쓰기량 감소)
// - CPU 사용 증가 (읽기마다 압축 해제)
// → 대부분의 노드에서 net win`}
        </pre>
        <p className="leading-7">
          Zstd 사전(dictionary)은 반복 패턴을 별도 저장 — 작은 청크도 효율적 압축.<br />
          Transaction 데이터는 서명/주소 패턴이 반복되므로 사전 압축과 궁합이 좋음.<br />
          디스크 60% 절약 = 노드 운영 비용 직접 감소.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: Hot/Cold 분리의 본질</p>
          <p className="mt-2">
            데이터의 접근 패턴은 시간에 따라 바뀐다:<br />
            - 방금 생성된 블록: 수백 RPC 요청, reorg 가능성<br />
            - 1주 전 블록: 가끔 조회<br />
            - 1년 전 블록: 극히 드문 조회 (아카이브용)
          </p>
          <p className="mt-2">
            단일 저장소에 모두 담으면:<br />
            - B+tree 깊이가 1년치 + 1주치 + 방금 = 통합 크기로 결정<br />
            - 최신 블록 조회도 오래된 데이터 때문에 느려짐<br />
            - 캐시 효율도 나쁨 (콜드 데이터가 페이지 캐시 점유)
          </p>
          <p className="mt-2">
            Hot/Cold 분리의 효과:<br />
            - MDBX는 최신 ~10만 블록만 → B+tree 깊이 낮음<br />
            - StaticFiles는 cold 데이터 → 순차 접근 최적화, 압축 가능<br />
            - 각 저장소가 자기 워크로드에 맞춰 튜닝
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">아카이브 흐름</h3>
      <div className="space-y-2 mb-8">
        {ARCHIVE_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">Reth StaticFiles vs Geth Freezer</h3>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full text-sm border border-border">
          <thead>
            <tr className="bg-muted">
              <th className={`${CELL} text-left`}>속성</th>
              <th className={`${CELL} text-left`}>Reth</th>
              <th className={`${CELL} text-left`}>Geth</th>
            </tr>
          </thead>
          <tbody>
            {GETH_FREEZER_COMPARISON.map(r => (
              <tr key={r.attr}>
                <td className={`${CELL} font-medium`}>{r.attr}</td>
                <td className={CELL}>{r.reth}</td>
                <td className={CELL}>{r.geth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose">
        <StaticFilesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
