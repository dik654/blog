import type { ReactNode } from "react";
import { CitationBlock } from "@/components/ui/citation-block";
import StorageEngineLocator, { StorageEngineMapReturn } from "../lsm-tree/StorageEngineLocator";
import MdbxValidationViz from "./viz/MdbxValidationViz";

const LABEL = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-block border border-primary/40 px-1.5 py-0.5 align-middle text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <StorageEngineLocator current="mdbx-validation" />
        <div>
          <p className="text-xs font-bold text-primary">실무 글 · 개념을 운영 판단으로 연결하기</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">다시 연 generation과 논리 rows가 일치한 뒤에만 성능을 비교합니다</h2>
        </div>
        <MdbxValidationViz />
        <p className="text-lg leading-8"><LABEL>A</LABEL>이 글은 MDBX v0.14.3의 운영 승인안이 아닙니다. 격리된 시험 환경에서 release, build와 sync mode를 비교할 때 필요한 실험과 증거의 출발점입니다. 대상 서비스의 RPO와 RTO, 자료 크기, 장치, filesystem과 commit SLO가 정해지지 않았으므로 복구와 성능 결과는 미측정으로 남깁니다.</p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Release, sync 계약, 장비를 한 run manifest에 고정합니다</h2>
        <p><LABEL>O</LABEL>시험 기준선은 2026년 8월 9일 공개된 libmdbx v0.14.3, commit <code>f7a3a93</code>입니다. 이 release의 <code>mdbx.h</code>에는 기본 durable sync, <code>MDBX_SAFE_NOSYNC</code>, <code>MDBX_UTTERLY_NOSYNC</code> 등 서로 다른 내구성 경계가 정의되어 있습니다. Flag 이름이 비슷해도 손실·무결성 계약은 같지 않습니다.</p>
        <p><LABEL>A</LABEL>Manifest에는 source SHA, compiler와 build options, <code>mdbx_chk -V</code> 출력, page와 map geometry, 모든 environment와 transaction flag를 기록합니다.</p>
        <p>Process와 container model, filesystem과 mount, storage model과 firmware, write cache, operation trace와 seed, oracle digest도 같은 기록에 넣습니다. 따라서 하나라도 달라지면 같은 실험 결과로 합치지 않습니다.</p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-xs leading-5">
            <thead className="text-muted-foreground"><tr><th className="px-3 py-3">경계</th><th className="px-3 py-3">반드시 고정할 값</th><th className="px-3 py-3">달라졌을 때 생기는 혼동</th></tr></thead>
            <tbody>
              {[
                ["Library", "release·SHA·compiler·build options", "API·lock format·commit 구현 차이"],
                ["MDBX", "sync flags·page size·map lower/now/upper", "손실 경계·page 수·map-full 차이"],
                ["OS", "kernel·filesystem·mount·container/PID model", "mmap·locking·flush·liveness 차이"],
                ["Storage", "device·firmware·cache·virtualization power model", "flush 완료와 stable media 차이"],
                ["Workload", "data digest·key/value 분포·trace·seed", "split·DUPSORT·locality·latency 차이"],
              ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력, DB state, 기대 결과, 결정을 서로 다른 소유자로 둡니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-xs leading-5">
            <thead className="text-muted-foreground"><tr><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 기록</th><th className="px-3 py-3">유일한 writer</th><th className="px-3 py-3">읽는 구성요소</th></tr></thead>
            <tbody>
              {[
                ["실험 입력", "manifest·operation trace", "harness", "candidate·oracle"],
                ["DB state", "datafile·lockfile·meta·page graph", "libmdbx", "mdbx_chk·read-only verifier"],
                ["기대 rows", "독립 ordered multimap", "oracle runner", "diff verifier"],
                ["중단 지점", "fault schedule·process receipt", "fault harness", "result collector"],
                ["관측값", "run ID가 붙은 raw metrics", "읽기 전용 collector", "analysis job"],
                ["채택 상태", "ADR·artifact·rollback receipt", "서비스 소유 팀", "배포 파이프라인"],
              ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
        <p><LABEL>A</LABEL>Fault harness는 candidate process를 중단할 수 있지만 DB file이나 oracle을 고쳐 쓰지 않습니다. Collector는 meta·reader·latency를 읽을 뿐 transaction을 commit하거나 map geometry를 바꾸지 않습니다. 두 도구가 같은 DB state를 수정하면 crash 뒤 발견한 generation이 MDBX의 결과인지 시험 도구의 결과인지 판별할 수 없습니다.</p>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">가장 작은 durable 기준선에서 정상 commit receipt를 만듭니다</h2>
        <p><LABEL>A</LABEL>Baseline은 한 process, 한 writer, 고정 수의 readers와 기본 durable sync mode입니다. Candidate는 sync mode나 release, geometry 중 한 축만 바꿉니다. 처음부터 release·sync·filesystem을 동시에 바꾸면 acknowledged write 손실이나 p99 변화의 원인을 분리할 수 없습니다.</p>
        <div className="not-prose grid gap-px bg-border p-px md:grid-cols-3">
          <div className="bg-background p-4"><strong className="text-sm">Candidate</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">MDBX가 datafile·lockfile과 transaction generation을 씁니다.</p></div>
          <div className="bg-background p-4"><strong className="text-sm">Oracle</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">같은 key·value·DUPSORT 연산의 기대 결과만 소유합니다.</p></div>
          <div className="bg-background p-4"><strong className="text-sm">Receipt</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Commit return, txid, trace offset와 digest를 연결합니다.</p></div>
        </div>
        <p><LABEL>O</LABEL>v0.14.3의 공개 API는 commit latency 통계, reader lag, map-full과 reader-full 같은 상태를 노출합니다. API가 있다는 사실은 대상 장비의 안전한 임계값이나 복구 시간을 뜻하지 않습니다. 먼저 정상 commit·abort·reopen에서 candidate rows와 oracle rows가 일치하는 기준선을 만듭니다.</p>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Process 중단과 power-loss 시험을 구분해 순서대로 검증합니다</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-2">
          {[
            ["01 · 정상 재생", "Put·update·delete·abort·commit과 DUPSORT insert/delete/cursor를 고정 trace로 candidate와 oracle에 넣습니다."],
            ["02 · Process kill", "Data page 생성, meta 공개와 sync 호출 전후의 계측 지점에서 격리된 candidate process를 종료합니다."],
            ["03 · Reopen 대조", "재시작이 고른 txid·root와 모든 rows·duplicate 순서를 receipt·oracle에 대조하고 mixed generation을 거부합니다."],
            ["04 · Power-loss model", "Process kill과 별도로 안전한 VM 또는 전용 test node에서 flush·device cache를 포함한 전원 모델을 검증합니다."],
            ["05 · 수명 경계", "Long reader, stale reader 처리, reader slots, writer contention, map growth와 map-full을 의도적으로 만듭니다."],
            ["06 · 반복과 비용", "동일 seed와 fault schedule을 반복하고 correctness를 통과한 run만 latency·RSS·fault·writeback 비교에 포함합니다."],
          ].map(([title, body]) => <li key={title} className="bg-background p-4"><strong>{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></li>)}
        </ol>
        <p><LABEL>?</LABEL>실제 kill instrumentation, VM flush 보장, 반복 횟수, 허용 손실과 RTO는 대상 시험 환경에서 정해야 합니다. <code>SIGKILL</code>로 process를 끝낸 결과를 정전이나 kernel panic까지 견딘 증거로 확대하지 않습니다.</p>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">오류 발견부터 재진입까지 data generation을 보존합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">
          {[
            ["발견", "reopen·oracle·mdbx_chk 차이"],
            ["격리", "candidate write 중지·사본 보존"],
            ["우회", "검증된 이전 binary·DB generation"],
            ["복구", "backup·copy·rebuild 뒤 rows 대조"],
            ["재진입", "새 receipt와 ADR 승인"],
          ].map(([title, body]) => <div key={title} className="bg-background p-3"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}
        </div>
        <p><LABEL>A</LABEL>Rollback은 binary만 이전 release로 바꾸는 작업이 아닐 수 있습니다. Candidate가 database format이나 build·locking 조건을 바꿨다면 이전 binary가 같은 datafile과 lockfile을 안전하게 열 수 있는지 확인해야 합니다. 호환이 증명되지 않으면 보존한 이전 DB generation 또는 검증된 backup에서 복구하고, 전체 rows와 DUPSORT ordering을 다시 대조합니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정확성 통과 run에서만 commit과 page 수명 비용을 잽니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["정확성", "txid·root·rows·DUPSORT·reopen parity"],
            ["내구성", "acknowledged writes·RPO·RTO·sync latency"],
            ["Page 수명", "oldest reader·retired pages·map growth·RSS"],
            ["고객 영향", "commit/read p50·p95·p99·timeout·error"],
          ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}
        </div>
        <p><LABEL>A</LABEL>Page fault는 major와 minor를 나누고, dirty·writeback bytes와 device latency를 같은 시간축에 둡니다. Commit 평균만 보면서 sync tail을 숨기거나, map size를 RSS로 해석하거나, long reader가 있는 run과 없는 run을 같은 표본으로 합치지 않습니다.</p>
        <p><LABEL>M</LABEL>현재 대상 환경에서 얻은 수치는 없습니다. 어떤 sync mode가 더 빠르거나, 어느 장치에서 RPO 0을 만족한다는 결론도 아직 없습니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 전 상태는 proposed이며 결론을 바꿀 조건을 함께 둡니다</h2>
        <div className="not-prose border-y border-border py-4 text-sm leading-6">
          <p><strong>Status:</strong> proposed</p>
          <p className="mt-2"><strong>현재 출발점:</strong> v0.14.3 기본 durable sync와 가장 작은 single-writer 기준선으로 correctness·reopen receipt를 만듭니다.</p>
          <p className="mt-2"><strong>채택 조건:</strong> 대상 RPO·RTO와 모든 crash·boundary gate를 통과하고, 반복 run이 commit·read SLO와 공간 한도를 만족합니다.</p>
          <p className="mt-2"><strong>기각 조건:</strong> Mixed generation, oracle 차이, 계약 밖 acknowledged write 손실, DUPSORT 순서 변화, 안전한 복구·rollback 부재가 하나라도 나타납니다.</p>
          <p className="mt-2"><strong>다시 검토할 조건:</strong> Release와 build, sync mode, filesystem, 장치, container model, 자료 분포 또는 RPO와 RTO가 바뀝니다.</p>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공식 계약과 대상 환경의 측정값을 구분합니다</h2>
        <CitationBlock source="Mithril-mine/libmdbx v0.14.3 · f7a3a93" citeKey={1} href="https://github.com/Mithril-mine/libmdbx/tree/f7a3a9323cacacfa9dc6137ae7a7252a67744ff0"><p><LABEL>O</LABEL>시험 대상으로 고정한 release, source와 tests·change log의 정확한 snapshot입니다.</p><p><b>범위:</b> v0.14.3 구현과 공개된 변경이며 대상 환경에서의 복구·성능 결과는 아닙니다.</p></CitationBlock>
        <CitationBlock source="libmdbx v0.14.3 · mdbx.h sync modes와 transaction API" citeKey={2} href="https://github.com/Mithril-mine/libmdbx/blob/f7a3a9323cacacfa9dc6137ae7a7252a67744ff0/mdbx.h"><p><LABEL>O</LABEL>Durable·safe-nosync·utterly-nosync 경계, transaction commit, reader lag·map-full·DUPSORT API를 확인했습니다.</p><p><b>범위:</b> 기능과 계약의 존재를 보여 주며 filesystem·device가 이를 실제로 지킨다는 측정은 별도입니다.</p></CitationBlock>
        <CitationBlock source="libmdbx v0.14.3 · README" citeKey={3} href="https://github.com/Mithril-mine/libmdbx/blob/f7a3a9323cacacfa9dc6137ae7a7252a67744ff0/README.md"><p><LABEL>O</LABEL>Single writer, concurrent readers, shadow paging, long-lived reader와 page 재사용 제한, process/container 조건을 확인했습니다.</p><p><LABEL>M</LABEL>이 release를 대상 서비스 장비에 설치하거나 fault injection한 결과는 아직 없습니다.</p></CitationBlock>
      </section>

      <StorageEngineMapReturn current="mdbx-validation" />
    </article>
  );
}
