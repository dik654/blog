import type { ReactNode } from "react";
import { CitationBlock } from "@/components/ui/citation-block";
import StorageEngineLocator, { StorageEngineMapReturn } from "../lsm-tree/StorageEngineLocator";
import LsmValidationViz from "./viz/LsmValidationViz";

const LABEL = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-block border border-primary/40 px-1.5 py-0.5 align-middle text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <StorageEngineLocator current="lsm-engine-validation" />
        <div>
          <p className="text-xs font-bold text-primary">실무 글 · 개념을 운영 판단으로 연결하기</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">정확한 복구를 확인한 뒤에만 증폭과 지연을 비교합니다</h2>
        </div>
        <LsmValidationViz />
        <p className="text-lg leading-8"><LABEL>A</LABEL>이 글은 운영 승인안이 아니라 격리된 시험 환경에서 LSM 설정을 비교하기 위한 출발점입니다. 대상 환경의 자료 크기, write 분포, sync 정책, 장치와 SLO가 아직 주어지지 않았으므로 어느 설정이 더 빠르거나 안전하다는 결론은 미측정으로 남깁니다.</p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">환경과 요구사항을 한 run manifest에 먼저 고정합니다</h2>
        <p><LABEL>O</LABEL>RocksDB commit <code>2dc6bc5</code>의 소스 기본값은 write buffer 64MiB, write buffer 최대 2개, L0 slowdown 20개, stop 36개, pending compaction soft 64GiB, hard 256GiB입니다. 이 값의 존재는 대상 workload에 적합하다는 증거가 아닙니다.</p>
        <p><LABEL>A</LABEL>각 run은 engine commit과 build flags, 모든 DB·column-family options, filesystem과 mount option, 장치 모델·firmware, CPU·메모리, 자료 digest, operation trace와 seed를 기록합니다. Cache warm 상태와 compression 전후 byte 계층도 고정하지 않으면 두 결과를 같은 실험으로 비교할 수 없습니다.</p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[42rem] border-collapse text-left text-xs leading-5">
            <thead className="text-muted-foreground"><tr><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 기록</th><th className="px-3 py-3">유일한 writer</th><th className="px-3 py-3">실패 시 증거</th></tr></thead>
            <tbody>
              {[
                ["실험 입력", "manifest + operation trace", "실험 harness", "digest·seed 불일치"],
                ["DB 내부 상태", "WAL·MANIFEST·SST", "RocksDB", "reopen·checksum·LOG"],
                ["기대 결과", "독립 ordered-map oracle", "reference runner", "key·snapshot diff"],
                ["성능 지표", "run ID가 붙은 raw metrics", "collector", "누락 구간·counter reset"],
                ["채택 상태", "ADR와 profile pointer", "서비스 소유 팀", "rollback receipt"],
              ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">가장 작은 기본 구성과 변경 후보를 한 번에 하나씩 비교합니다</h2>
        <p><LABEL>A</LABEL>Baseline은 고정 commit의 기본 leveled compaction과 options dump입니다. Candidate는 한 번에 한 책임만 바꿉니다. 예를 들어 write buffer 크기·개수 조정과 compaction style 변경을 같은 candidate에 넣으면 stall 변화의 원인을 분리하기 어렵습니다.</p>
        <div className="not-prose grid gap-px bg-border p-px md:grid-cols-3">
          <div className="bg-background p-4"><strong className="text-sm">A · Baseline</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">고정 commit의 기본값. 먼저 correctness·crash 기준선을 만듭니다.</p></div>
          <div className="bg-background p-4"><strong className="text-sm">B · Buffer 변화</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">write buffer 한 축만 바꿉니다. 메모리·recovery·flush·stall을 함께 봅니다.</p></div>
          <div className="bg-background p-4"><strong className="text-sm">C · Compaction 변화</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">leveled와 tiered 계열을 같은 data·cache 조건에서 별도로 비교합니다.</p></div>
        </div>
        <p><LABEL>A</LABEL>기능이 겹치는 두 조정기가 같은 write rate나 compaction thread 수를 동시에 바꾸지 않게 합니다. 애플리케이션 rate limiter, RocksDB write controller, 외부 cgroup I/O 제한이 모두 개입한다면 실제 authoritative limiter와 적용 순서를 run manifest에 명시합니다.</p>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정확성, 장애 복구, 비용 순서로 실험합니다</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-2">
          {[
            ["01 · 입력 재생", "Overwrite·delete·point/range read·skew·burst를 고정 seed와 순서로 baseline·candidate에 넣습니다."],
            ["02 · 중간 종료", "WAL sync 전후, memtable freeze, flush 파일 생성, MANIFEST 설치, compaction install 경계에서 실험 프로세스를 종료합니다."],
            ["03 · 복구 대조", "재시작 뒤 모든 key, tombstone, snapshot result를 독립 oracle과 비교합니다. 한 건이라도 다르면 중단합니다."],
            ["04 · 비용 측정", "정확성을 통과한 run에서만 WAL·flush·compaction read/write, L0 파일, pending bytes, stall, p50·p99, recovery를 기록합니다."],
          ].map(([title, body]) => <li key={title} className="bg-background p-4"><strong>{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></li>)}
        </ol>
        <p><LABEL>?</LABEL>실제 operation 수, 자료 크기, burst 길이, 허용 p99, 장치 endurance와 복구 목표는 대상 서비스가 정해야 합니다. 값이 없는 상태에서 임의의 통과 기준을 측정 결과처럼 쓰지 않습니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">평균 처리량과 함께 세 종류의 증폭과 stall을 봅니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["정확성", "value·tombstone·snapshot parity, checksum, reopen"],
            ["증폭", "read·write·space amplification을 같은 구간으로 분리"],
            ["압력", "immutable memtable, L0 files, pending bytes, stall micros"],
            ["고객 영향", "write/read p50·p95·p99, timeout, recovery time"],
          ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}
        </div>
        <p><LABEL>A</LABEL>Counter는 누적값 자체보다 run 시작과 끝의 차이를 사용하고, LOG의 stall 원인과 같은 시간축에 둡니다. Compaction output만 세면서 WAL과 flush를 빼거나, compressed file bytes와 uncompressed user bytes를 섞으면 쓰기 증폭의 분자가 바뀝니다.</p>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">오류 발견부터 재진입까지 중단 조건을 먼저 적습니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">
          {[
            ["발견", "parity·checksum·stall 경보"],
            ["격리", "candidate write 중지"],
            ["우회", "baseline profile 사용"],
            ["복구", "원본 trace로 reopen 대조"],
            ["재진입", "새 run receipt 승인"],
          ].map(([title, body]) => <div key={title} className="bg-background p-3"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}
        </div>
        <p><LABEL>A</LABEL>Rollback은 options 파일만 되돌리는 것으로 끝나지 않을 수 있습니다. Candidate가 만든 SST format, compression, comparator, merge operator, column-family schema가 baseline과 읽기 호환인지 먼저 확인합니다. 호환되지 않으면 사본에서 export·rebuild하거나 이전 snapshot으로 복구하는 경로가 필요합니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 전 결론은 proposed이며 뒤집히는 조건을 함께 남깁니다</h2>
        <div className="not-prose border-y border-border py-4 text-sm leading-6">
          <p><strong>Status:</strong> proposed</p>
          <p className="mt-2"><strong>현재 선택:</strong> 고정 commit의 baseline profile로 먼저 crash·oracle 기준선을 만듭니다.</p>
          <p className="mt-2"><strong>채택 조건:</strong> candidate가 모든 correctness·recovery gate를 통과하고, 대상 SLO·용량·endurance 안에서 반복 run의 tail과 stall을 개선합니다.</p>
          <p className="mt-2"><strong>기각 조건:</strong> snapshot 결과 차이, acknowledged write 손실, format 비호환, 안전한 rollback 부재, 운영자가 재현할 수 없는 복구가 하나라도 나타납니다.</p>
          <p className="mt-2"><strong>결론이 뒤집히는 조건:</strong> workload 분포·장치·자료 크기·sync 정책·RocksDB release가 바뀌거나 새 장애 시험에서 기존 가정이 깨집니다.</p>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공식 기능과 대상 환경의 측정값을 구분합니다</h2>
        <CitationBlock source="RocksDB 공식 Wiki · Write Stalls" citeKey={1} href="https://github.com/facebook/rocksdb/wiki/Write-Stalls"><p><LABEL>O</LABEL>Memtable, L0 file, pending compaction bytes로 write를 늦추거나 멈추는 원인과 관련 관측 지점을 확인했습니다.</p><p><b>범위:</b> 기능과 진단 경로의 존재를 보여 주며 대상 서비스에서의 적정 임계값을 말하지 않습니다.</p></CitationBlock>
        <CitationBlock source="RocksDB 공식 Wiki · Basic Operations" citeKey={2} href="https://github.com/facebook/rocksdb/wiki/Basic-Operations"><p><LABEL>O</LABEL>Non-sync·sync·disableWAL write의 process crash와 machine crash 경계를 확인했습니다.</p><p><b>범위:</b> 운영체제·파일시스템·장치가 실제로 약속을 지키는지는 격리된 crash 시험으로 확인해야 합니다.</p></CitationBlock>
        <CitationBlock source="facebook/rocksdb · commit 2dc6bc5" citeKey={3} href="https://github.com/facebook/rocksdb/tree/2dc6bc51b498c7fcae16e78a54de9058181c8b75"><p><LABEL>O</LABEL>options 기본값과 write-stall 분기, WAL·memtable write 순서, snapshot-aware compaction 경계를 고정 소스에서 확인했습니다.</p><p><LABEL>M</LABEL>대상 환경에서 실행한 결과는 아직 없습니다. 모든 성능·복구 결과는 미측정입니다.</p></CitationBlock>
      </section>

      <StorageEngineMapReturn current="lsm-engine-validation" />
    </article>
  );
}
