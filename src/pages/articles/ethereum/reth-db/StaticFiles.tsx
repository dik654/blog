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
        <div className="my-4 not-prose space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="font-semibold text-sm text-sky-400 mb-2">StaticFileProvider</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <p><code>path: PathBuf</code> — <code>static_files/</code> 디렉토리</p>
                <p><code>highest_block: DashMap&lt;StaticFileSegment, BlockNumber&gt;</code></p>
                <p className="text-muted-foreground">lock-free 동시성 맵으로 세그먼트별 최신 블록 관리</p>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm text-emerald-400 mb-2">StaticFileSegment (3종)</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <p><code>Headers</code> — <code>headers/</code> 디렉토리</p>
                <p><code>Transactions</code> — <code>transactions/</code></p>
                <p><code>Receipts</code> — <code>receipts/</code></p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">파일 명명 규칙</p>
            <p className="text-xs font-mono text-foreground/60 mb-2">static_files/&#123;segment&#125;/&#123;start_block&#125;-&#123;end_block&#125;.jar</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-foreground/60 font-mono">
              <p>headers/0-499999.jar</p>
              <p>headers/500000-999999.jar</p>
              <p>headers/18500000-18999999.jar</p>
            </div>
            <div className="mt-3 border-t border-border pt-2">
              <p className="text-xs font-semibold text-muted-foreground mb-1">각 .jar 내부 구조</p>
              <div className="space-y-0.5 text-xs text-foreground/70">
                <p>고정 크기 오프셋 테이블 (블록 번호 → 파일 오프셋)</p>
                <p>압축된 RLP 데이터 (Zstd 또는 LZ4)</p>
                <p>체크섬 (xxHash)</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>DashMap</code>은 lock-free 동시성 해시맵 — 여러 스레드가 세그먼트 경계를 동시에 조회 가능.<br />
          세그먼트를 50만 블록 단위로 쪼개는 이유: 파일 1개가 너무 커지면 open/close 오버헤드 증가.<br />
          파일명에 범위가 들어가 있어 <strong>블록 번호 → 파일 선택</strong>이 O(1) 계산으로 결정.
        </p>

        {/* ── 오프셋 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 번호 → 파일 오프셋 O(1) 변환</h3>
        <div className="my-4 not-prose">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3"><code>header_by_number(num)</code> — O(1) 접근 경로</p>
            <div className="space-y-3">
              {[
                { step: '1', title: '세그먼트 파일 결정', detail: '(num / 500,000) * 500,000으로 파일 선택', complexity: 'O(1) 계산', color: 'text-sky-400' },
                { step: '2', title: 'mmap 파일 열기', detail: 'open_mmap()으로 메모리 매핑 (캐시됨)', complexity: 'OS 페이지 캐시', color: 'text-emerald-400' },
                { step: '3', title: '오프셋 테이블 조회', detail: '블록 상대 번호 x 8바이트 = 오프셋 위치', complexity: 'O(1) 곱셈', color: 'text-amber-400' },
                { step: '4', title: '압축 해제 + RLP 디코딩', detail: 'zstd::decode() → alloy_rlp::decode()', complexity: '~마이크로초', color: 'text-violet-400' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted shrink-0 ${s.color}`}>{s.step}</span>
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="text-xs text-foreground/60">{s.detail}</p>
                    <p className="text-xs text-muted-foreground">{s.complexity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-border text-center">
              <p className="text-xs text-foreground/70">O(1) 파일 선택 + O(1) 오프셋 조회 + 압축 해제 → <strong>어느 블록이든 동일 접근 시간</strong></p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          핵심 설계: <strong>블록 번호가 곧 배열 인덱스</strong>.<br />
          MDBX B+tree는 키 탐색에 log(n) 필요하지만, flat file은 곱셈 1회로 오프셋 결정.<br />
          압축 해제 비용(마이크로초 단위)이 추가되지만 디스크 I/O는 순차 읽기로 최적화.
        </p>

        {/* ── 압축 이득 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Zstd 압축 — 디스크 공간 절약</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">메인넷 Zstd 압축 효과 (2026년 초)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border">
                  <th className="text-left py-1 pr-3 font-semibold">세그먼트</th>
                  <th className="text-right py-1 px-3 font-semibold">원본</th>
                  <th className="text-right py-1 px-3 font-semibold text-emerald-400">압축</th>
                  <th className="text-right py-1 pl-3 font-semibold">비율</th>
                </tr></thead>
                <tbody className="text-foreground/70">
                  <tr className="border-b border-border/50"><td className="py-1 pr-3">Headers</td><td className="text-right px-3">~9 GB</td><td className="text-right px-3 text-emerald-400">~3 GB</td><td className="text-right pl-3">33%</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1 pr-3">Transactions</td><td className="text-right px-3">~180 GB</td><td className="text-right px-3 text-emerald-400">~80 GB</td><td className="text-right pl-3">44%</td></tr>
                  <tr className="border-b border-border/50"><td className="py-1 pr-3">Receipts</td><td className="text-right px-3">~120 GB</td><td className="text-right px-3 text-emerald-400">~40 GB</td><td className="text-right pl-3">33%</td></tr>
                  <tr className="font-semibold"><td className="py-1 pr-3">합계</td><td className="text-right px-3">~309 GB</td><td className="text-right px-3 text-emerald-400">~123 GB</td><td className="text-right pl-3">40%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: '압축률', detail: 'gzip 대비 20% 우수' },
              { label: '해제 속도', detail: '~500 MB/s per core' },
              { label: '랜덤 접근', detail: '블록 단위 독립 압축' },
              { label: '사전 공유', detail: '작은 블록도 효과적 압축' },
            ].map(r => (
              <div key={r.label} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p className="text-xs font-semibold text-emerald-400">{r.label}</p>
                <p className="text-xs text-foreground/60 mt-0.5">{r.detail}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-emerald-400">+ 디스크 180GB 절약</div>
              <div className="text-emerald-400">+ SSD 수명 연장</div>
              <div className="text-amber-400">- CPU 사용 증가 (읽기마다 해제)</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">→ 대부분 노드에서 net win</p>
          </div>
        </div>
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
