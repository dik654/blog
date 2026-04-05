import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import PipelineViz from './viz/PipelineViz';
import { PIPELINE_STAGES } from './OverviewData';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = PIPELINE_STAGES.find(s => s.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pipeline & Stages 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">

        {/* ── 왜 파이프라인인가 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">왜 파이프라인인가 — Geth와의 근본 차이</h3>
        <p className="leading-7">
          Geth는 블록 단위로 동기화를 수행한다.<br />
          한 블록을 받으면 헤더 검증 → 바디 검증 → TX 실행 → 상태 루트 계산 → DB 커밋을 그 블록 안에서 전부 처리한다.<br />
          블록마다 <code>stateDB.Commit()</code>을 호출해 변경분을 LevelDB에 기록한다.
        </p>
        <p className="leading-7">
          이 방식은 단순하지만 초기 동기화 시 심각한 I/O 병목을 만든다.<br />
          블록마다 DB 트랜잭션이 열리고 닫힌다. 1,800만 블록을 따라잡으려면 1,800만 번의 커밋이 발생한다.<br />
          디스크 쓰기 증폭(write amplification)이 누적되어 SSD 수명을 빠르게 소모한다.
        </p>
        <p className="leading-7">
          Reth는 동기화를 <strong>작업 종류별로 수평 분할</strong>한다. 이것이 파이프라인 모델의 핵심이다.<br />
          "블록 0~100만의 헤더만 먼저 전부 받는다 → 그다음 블록 0~100만의 바디를 전부 받는다 → 그다음 sender 복구"의 순서로 진행한다.<br />
          같은 종류의 작업을 연속 배치 처리하면 DB 접근 패턴이 순차(sequential)가 되어 I/O 효율이 극대화된다.
        </p>

        <div className="overflow-x-auto my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">항목</th>
                <th className="border border-border px-3 py-2 text-left">Geth (순차)</th>
                <th className="border border-border px-3 py-2 text-left">Reth (파이프라인)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">처리 단위</td>
                <td className="border border-border px-3 py-2">블록 1개</td>
                <td className="border border-border px-3 py-2">Stage당 수천~수만 블록 배치</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">DB 커밋 빈도</td>
                <td className="border border-border px-3 py-2">블록마다</td>
                <td className="border border-border px-3 py-2">commit_threshold(10K) 단위</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">I/O 패턴</td>
                <td className="border border-border px-3 py-2">랜덤(random)</td>
                <td className="border border-border px-3 py-2">순차(sequential) 대량 쓰기</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">병렬화</td>
                <td className="border border-border px-3 py-2">제한적(블록 내 TX 일부만)</td>
                <td className="border border-border px-3 py-2">Stage 내부 작업 전체 병렬</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">DB 엔진</td>
                <td className="border border-border px-3 py-2">LevelDB (LSM-tree)</td>
                <td className="border border-border px-3 py-2">MDBX (B+tree, mmap)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          모든 Stage는 <code>Stage</code> trait을 구현한다.<br />
          <code>execute()</code>로 정방향 실행, <code>unwind()</code>로 역방향 롤백을 수행한다.<br />
          이 trait 경계 덕분에 Stage를 추가하거나 교체할 때 파이프라인 루프 코드를 수정할 필요가 없다.
        </p>
      </div>

      <div className="not-prose mb-8"><ContextViz /></div>

      {/* Interactive stage cards */}
      <h3 className="text-lg font-semibold mb-3">5개 Stage 한눈에 보기</h3>
      <div className="not-prose grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {PIPELINE_STAGES.map(s => (
          <button key={s.id}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === s.id ? s.color : 'var(--color-border)',
              background: selected === s.id ? `${s.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: s.color }}>{s.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{s.role}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{sel.detail}</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
              {sel.why}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-4"><PipelineViz /></div>

      {/* ── Pipeline::run() 메인 루프 ── */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3 className="text-xl font-semibold mt-6 mb-3">Pipeline::run() 메인 루프</h3>
        <p className="leading-7">
          <code>Pipeline</code> 구조체는 실행할 Stage 목록과 CL tip, 체크포인트 추적기를 소유한다.<br />
          <code>stages</code> 필드는 <code>Vec&lt;Box&lt;dyn Stage&gt;&gt;</code> — 트레이트 객체 벡터로 동적 디스패치를 허용한다.<br />
          PipelineBuilder가 조립 시점에 순서를 고정하므로 런타임 변경은 불가능하다.
        </p>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct Pipeline<N: NodeTypesWithDB> {
    stages: Vec<Box<dyn Stage<N::DB>>>,  // Headers→Bodies→Senders→Execution→Merkle 순서
    tip: Option<B256>,                   // CL(Lighthouse 등)이 FCU로 알려준 목표 블록 해시
    max_block: Option<BlockNumber>,      // 디버그/테스트용 최대 블록 제한
    progress: PipelineProgress,          // 각 Stage별 체크포인트(마지막 처리 블록) 추적
}

pub async fn run(&mut self) -> Result<ControlFlow> {
    loop {
        for stage in &mut self.stages {
            let input = ExecInput {
                target: self.tip,                              // "여기까지 처리하라"
                checkpoint: self.progress.checkpoint(stage.id()), // 이 Stage의 마지막 완료 블록
            };
            let output = stage.execute(&self.provider, input)?;
            self.progress.update(stage.id(), output.checkpoint); // DB에 체크포인트 기록

            if !output.done {
                break; // 아직 target 미도달 → 이번 루프 중단, 다음 루프에서 이어서
            }
        }
        if self.progress.all_done() { return Ok(ControlFlow::NoProgress); }
    }
}`}
        </pre>
        <p className="leading-7">
          바깥 <code>loop</code>는 모든 Stage가 CL tip까지 도달할 때까지 반복한다.<br />
          안쪽 <code>for</code>는 Stage 목록을 순회한다. 각 Stage는 <code>ExecInput</code>을 받아 <code>ExecOutput</code>을 반환한다.<br />
          <code>target</code>(CL tip)과 <code>checkpoint</code>(이전 완료 블록)의 차이가 이번 호출에서 처리할 범위다.
        </p>

        {/* ── 체크포인트 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">체크포인트 & 크래시 복구</h3>
        <p className="leading-7">
          각 Stage는 작업을 마치면 <code>StageCheckpoint::new(end)</code>를 반환한다.<br />
          파이프라인은 이 체크포인트를 MDBX <code>StageCheckpoints</code> 테이블에 기록한다.<br />
          크래시 후 재시작하면 동일 DB에서 체크포인트를 로드해 <strong>중단 지점부터 이어서 실행</strong>한다.
        </p>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 체크포인트 테이블 (MDBX StageCheckpoints)
// Key: StageId (Headers, Bodies, Senders, Execution, MerkleExecute)
// Val: u64 (마지막으로 처리 완료한 블록 번호)

Headers        → 18,400,000
Bodies         → 18,399,800  ← HeadersStage보다 뒤처져 있음
SenderRecovery → 18,399,500  ← BodiesStage보다 뒤처져 있음
Execution      → 18,399,000
MerkleExecute  → 18,399,000

// 다음 루프에서:
//  HeadersStage: 18,400,001부터 시작 (target=18,400,500일 때)
//  BodiesStage:  18,399,801부터 시작 (HeadersStage가 저장한 범위까지만)
//  SendersStage: 18,399,501부터 시작
//  ...`}
        </pre>
        <p className="leading-7">
          체크포인트는 각 Stage마다 <strong>독립적</strong>이다.<br />
          HeadersStage가 100만 블록 앞서 있어도 BodiesStage는 자기 속도로 따라간다.<br />
          이 디커플링 덕분에 Stage별로 처리량이 달라도 파이프라인 전체는 순조롭게 진행된다.
        </p>

        {/* ── ControlFlow ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ControlFlow & Unwind 시그널</h3>
        <p className="leading-7">
          Stage 실행 결과는 <code>ControlFlow</code> enum으로 파이프라인에 보고된다.<br />
          단순 정상 종료가 아니라, 체인 재조직(reorg)이나 검증 실패 시 <strong>되감기(unwind)</strong>를 요청할 수도 있다.
        </p>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub enum ControlFlow {
    NoProgress,                          // 모든 Stage가 CL tip에 도달, 대기 모드 진입
    Continue { block_number: u64 },      // 진행 중, 다음 루프 실행
    Unwind {                             // 되감기 필요 — reorg 감지 or 검증 실패
        target: u64,                     //   어느 블록까지 되감을지
        bad_block: BlockWithSenders,     //   문제가 된 블록 (디버깅/로깅용)
    },
}

// 되감기 절차 (Pipeline::unwind_stages):
// 1. 역순 순회: MerkleExecute → Execution → SenderRecovery → Bodies → Headers
// 2. 각 Stage의 unwind()를 호출해서 target 블록까지 DB 상태를 롤백
// 3. 체크포인트를 target으로 덮어씀
// 4. 다시 run()을 호출하면 target+1부터 재실행`}
        </pre>
        <p className="leading-7">
          Unwind는 reorg(체인 재조직) 상황에서 필수다.<br />
          CL이 새로운 tip을 알려줬는데 기존 체인과 분기점이 뒤에 있으면, 분기점까지 상태를 되돌려야 한다.<br />
          <code>unwind()</code>는 <code>execute()</code>의 반대 방향 — DB에 기록했던 변경분을 역으로 제거한다.
        </p>

        {/* ── MDBX 배치 I/O ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">배치 기반 I/O 전략 — MDBX</h3>
        <p className="leading-7">
          Reth는 <strong>MDBX</strong>(Lightning Memory-Mapped Database X)를 사용한다.<br />
          MDBX는 B+tree 기반 임베디드 DB로, mmap(메모리 맵)을 통해 DB 파일을 프로세스 주소 공간에 매핑한다.<br />
          읽기는 mmap 덕분에 시스템 콜 없이 거의 무료다. 쓰기는 트랜잭션으로 묶어서 커밋한다.
        </p>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 각 Stage의 내부 패턴
let mut batch = Vec::new();
while let Some(item) = stream.next().await? {
    batch.push(item);
    if batch.len() >= self.commit_threshold { // 기본 10,000
        provider.insert_all(batch.drain(..))?;  // MDBX 트랜잭션 1회
    }
}
provider.insert_all(batch)?;                    // 잔여분 마지막 커밋

// commit_threshold=10K일 때:
//   100만 블록 동기화 → 100회 트랜잭션 (Geth는 100만 회)
//   I/O 감소율 ≈ 10,000배`}
        </pre>
        <p className="leading-7">
          <code>commit_threshold</code>가 배치 크기를 결정한다. 기본값 10,000은 메모리 사용량과 크래시 복구 비용의 타협점이다.<br />
          값을 키우면 트랜잭션이 줄어 I/O가 효율화되지만, 크래시 시 재처리 범위가 커진다.<br />
          값을 줄이면 커밋이 잦아져 I/O 부담이 늘지만, 크래시 복구가 빨라진다.
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 파이프라인이 빠른가</p>
          <p className="mt-2">
            동일 메인넷(블록 ~1,800만)을 라이브 동기화할 때 경험적으로 관측되는 패턴:<br />
            1. <strong>Geth 초기 동기화</strong> — 수 일~수 주. 블록별 I/O로 SSD 쓰기가 병목<br />
            2. <strong>Reth 초기 동기화</strong> — 수 시간~하루. Stage별 배치로 I/O가 순차 처리됨
          </p>
          <p className="mt-2">
            성능 차이의 근본 원인:<br />
            1. <strong>I/O 증폭 제거</strong> — 10K 블록당 1회 커밋으로 랜덤 쓰기가 순차 쓰기로 바뀜<br />
            2. <strong>CPU 병렬화</strong> — SendersStage의 rayon par_iter, revm의 동시 평가<br />
            3. <strong>캐시 지역성</strong> — 같은 종류 데이터를 연속 처리하면 CPU 캐시 적중률 상승<br />
            4. <strong>MDBX mmap 읽기</strong> — read syscall 없음, 페이지 캐시 직접 접근
          </p>
          <p className="mt-2">
            결론: 파이프라인은 <strong>"같은 작업을 모아서"</strong>가 전부다.<br />
            블록 순서를 유지하면서 작업 종류로 한 번 더 분할하면, 하드웨어 특성(순차 I/O, CPU 캐시, 병렬 코어)이 모두 협력한다.
          </p>
        </div>
      </div>
    </section>
  );
}
