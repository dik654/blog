import type { ReactNode } from "react";
import { CitationBlock } from "@/components/ui/citation-block";
import StorageEngineLocator, { StorageEngineMapReturn } from "../lsm-tree/StorageEngineLocator";
import BplusValidationViz from "./viz/BplusValidationViz";

const LABEL = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-block border border-primary/40 px-1.5 py-0.5 align-middle text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <StorageEngineLocator current="bplus-index-validation" />
        <div>
          <p className="text-xs font-bold text-primary">실무 글 · 개념을 검증 가능한 변경으로 연결하기</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">Page graph와 조회 결과가 복구된 뒤에만 성능을 비교합니다</h2>
        </div>
        <BplusValidationViz />
        <p className="text-lg leading-8"><LABEL>A</LABEL>이 글은 특정 B+ tree 구현의 채택안이 아닙니다. 격리된 시험 환경에서 page 형식이나 comparator, split·delete 구현을 바꿀 때 무엇을 먼저 증명해야 하는지 정리한 실험 출발점입니다. 대상 엔진과 자료, 장비, SLO가 정해지지 않았으므로 성능과 복구 결과는 미측정으로 남깁니다.</p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">비교 조건과 상태의 작성자를 먼저 고정합니다</h2>
        <p><LABEL>A</LABEL>한 run manifest에 구현체의 release·source SHA와 build flag, page format version, page size, comparator·collation, duplicate·null ordering, 최소 점유율과 split 규칙을 기록합니다. Filesystem·mount·sync 정책, CPU·메모리·저장 장치, 자료 digest, operation trace와 seed도 같은 기록에 들어가야 합니다.</p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[42rem] border-collapse text-left text-xs leading-5">
            <thead className="text-muted-foreground"><tr><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 기록</th><th className="px-3 py-3">유일한 writer</th><th className="px-3 py-3">실패 증거</th></tr></thead>
            <tbody>
              {[
                ["입력", "manifest·operation trace", "실험 harness", "digest·순서·seed 불일치"],
                ["색인 상태", "page graph·meta·free list", "candidate engine", "reopen 오류·불변식 위반"],
                ["기대 결과", "독립 ordered map", "oracle runner", "point·range 결과 차이"],
                ["측정값", "run ID가 붙은 raw metrics", "읽기 전용 collector", "누락 구간·counter reset"],
                ["채택 상태", "ADR·artifact·rollback receipt", "서비스 소유 팀", "승인 근거 누락"],
              ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
        <p><LABEL>A</LABEL>Fault injector는 격리된 candidate 프로세스를 종료할 수 있을 뿐 page나 oracle을 고쳐 쓰지 않습니다. Collector도 관측만 합니다. 두 프로그램이 root pointer나 free list 같은 동일 상태를 동시에 바꾸면 어느 결과가 구현체의 동작인지 판별할 수 없습니다.</p>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">가장 작은 구현과 독립 ordered map에서 시작합니다</h2>
        <p><LABEL>A</LABEL>Baseline은 한 page format과 한 comparator를 쓰는 가장 작은 candidate입니다. 복잡한 압축·동시성·prefetch·cache 조정은 끄거나 고정하고, 같은 operation trace를 독립 ordered map에도 적용합니다. 한 번에 한 책임만 바꾸면 lookup 차이가 comparator 때문인지 split 때문인지 분리할 수 있습니다.</p>
        <div className="not-prose grid gap-px bg-border p-px md:grid-cols-3">
          <div className="bg-background p-4"><strong className="text-sm">Candidate</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Page graph와 파일을 쓰는 시험 대상입니다.</p></div>
          <div className="bg-background p-4"><strong className="text-sm">Oracle</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">논리적인 key 순서와 point·range 결과만 소유합니다.</p></div>
          <div className="bg-background p-4"><strong className="text-sm">Harness</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">입력 순서와 중단 지점, 결과 receipt를 남깁니다.</p></div>
        </div>
        <p><LABEL>O</LABEL>PostgreSQL 18.6의 nbtree는 Lehman–Yao 계열의 high key와 right link를 사용합니다. VACUUM 중 부분적으로 찬 page를 일반적인 교과서식으로 merge하지 않고, 완전히 빈 page를 삭제하는 정책을 씁니다. 따라서 일반 B+ tree의 redistribution·merge fixture를 PostgreSQL의 실제 삭제 동작이라고 그대로 부르면 안 됩니다.</p>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">경계 입력, 중간 종료, 재시작 대조 순서로 검사합니다</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-2">
          {[
            ["01 · 작은 경계", "Empty·root-only, capacity−1·capacity·capacity+1과 ascending·descending·random·duplicate 입력을 재생합니다."],
            ["02 · 구조 변화", "Split cascade와 root growth를 검사하고, 구현이 지원하는 delete redistribution·merge·root shrink를 별도 profile로 검사합니다."],
            ["03 · 조회 대조", "각 단계의 모든 key와 missing key, inclusive·exclusive range, duplicate 순서를 oracle과 비교합니다."],
            ["04 · 중간 종료", "Page write, parent downlink, root·meta·free-list 공개 전후에서 실험 프로세스만 종료합니다."],
            ["05 · 다시 열기", "재시작 뒤 root에서 모든 leaf가 도달 가능한지, separator와 leaf 순서·깊이·점유율이 맞는지 확인합니다."],
            ["06 · 제품 검사", "대상 제품이 제공하는 무결성 검사기를 추가로 실행하되, 그 도구가 검사하지 않는 범위를 따로 기록합니다."],
          ].map(([title, body]) => <li key={title} className="bg-background p-4"><strong>{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></li>)}
        </ol>
        <p><LABEL>O</LABEL>PostgreSQL의 <code>bt_index_check</code>와 <code>bt_index_parent_check</code>는 B-tree 불변식과 parent·child 관계를 검사할 수 있습니다. 그러나 공식 문서는 amcheck가 손상의 존재를 입증할 수는 있어도 손상이 없음을 완전히 입증하지는 못한다고 명시합니다. 검사 결과 하나를 독립 oracle과 crash fixture 대신 사용하지 않습니다.</p>
        <p><LABEL>?</LABEL>실제 연산 수, 자료 크기, kill point 구현, 허용 오류율과 반복 횟수는 대상 엔진의 transaction·WAL·meta 공개 계약을 확인한 뒤 정해야 합니다. 일반 B+ tree 그림만으로 crash 원자성을 추측하지 않습니다.</p>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">오류를 보존하고 이전 색인 세대로 우회합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">
          {[
            ["발견", "oracle·reopen·불변식 차이"],
            ["격리", "candidate write 중지"],
            ["보존", "깨진 artifact·trace 복사"],
            ["우회", "이전 index 또는 원본 table"],
            ["재진입", "재구축·대조 receipt 승인"],
          ].map(([title, body]) => <div key={title} className="bg-background p-3"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}
        </div>
        <p><LABEL>A</LABEL>Rollback은 binary만 되돌리는 작업이 아닐 수 있습니다. Candidate가 만든 page format과 comparator, collation, duplicate encoding을 이전 세대가 읽을 수 있는지 먼저 확인합니다. 호환되지 않으면 authoritative table이나 이전 snapshot에서 새 index generation을 만들고, 새 generation의 point·range 결과를 대조한 뒤 traffic을 옮깁니다.</p>
        <p><LABEL>O</LABEL>PostgreSQL 공식 amcheck 문서도 손상된 자료를 일반적으로 고치는 방법은 없다고 경고합니다. 제품별 <code>REINDEX</code> 가능 여부를 모든 B+ tree 손상의 공통 복구법으로 확대하지 않습니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정확성 통과 run에서만 page 비용을 잽니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["구조", "height·allocated/live pages·fill ratio"],
            ["읽기", "point·range page reads·cache 상태"],
            ["쓰기", "split·page deletion·WAL·sync bytes"],
            ["고객 영향", "p50·p95·p99·reopen·rebuild 시간"],
          ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}
        </div>
        <p><LABEL>M</LABEL>현재 대상 환경에서 얻은 측정값은 없습니다. Cache warm 여부, read-ahead, page compression, sync 경계와 동시성을 고정하지 않은 p99를 구조적 우위의 증거로 쓰지 않습니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 전 상태는 proposed이며 반증 조건을 함께 둡니다</h2>
        <div className="not-prose border-y border-border py-4 text-sm leading-6">
          <p><strong>Status:</strong> proposed</p>
          <p className="mt-2"><strong>현재 선택:</strong> 고정한 page format과 comparator의 작은 candidate, 독립 ordered-map oracle로 correctness 기준선을 만듭니다.</p>
          <p className="mt-2"><strong>채택 조건:</strong> 모든 boundary·reopen·crash 대조를 통과하고 대상 SLO와 용량 안에서 반복 run의 page 비용과 tail latency가 개선됩니다.</p>
          <p className="mt-2"><strong>기각 조건:</strong> 도달 불가능한 page, point·range 결과 차이, 안전한 재구축·우회 부재, format 비호환이나 운영자가 재현할 수 없는 복구가 하나라도 나타납니다.</p>
          <p className="mt-2"><strong>결론을 다시 검토할 조건:</strong> 자료 분포·comparator·page format·장치·sync 정책·엔진 release가 바뀌거나 새 장애 시험이 기존 가정을 깨뜨립니다.</p>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">일반 알고리즘과 제품 구현을 나눠 확인합니다</h2>
        <CitationBlock source="PostgreSQL 18.6 · nbtree README @ 724edf9" citeKey={1} href="https://github.com/postgres/postgres/blob/724edf9bde9d356724ad384a2e196edc3c9f80f7/src/backend/access/nbtree/README"><p><LABEL>O</LABEL>PostgreSQL의 high key·right link와 동시 page split, 빈 page 삭제 정책을 고정된 안정 release의 소스 문서에서 확인했습니다.</p><p><b>범위:</b> PostgreSQL nbtree 구현의 동시성·삭제 정책이며 일반 B+ tree 전체의 유일한 구현법은 아닙니다.</p></CitationBlock>
        <CitationBlock source="PostgreSQL 18 · amcheck" citeKey={2} href="https://www.postgresql.org/docs/18/amcheck.html"><p><LABEL>O</LABEL>B-tree 불변식과 parent·child 관계, heapallindexed 검사의 기능과 lock·비용·검증 한계를 확인했습니다.</p><p><b>범위:</b> 검사 가능한 손상과 도구의 한계를 보여 주며 대상 실험의 무결성이나 복구 가능성을 자동으로 증명하지 않습니다.</p></CitationBlock>
        <CitationBlock source="PostgreSQL 18.6 Release" citeKey={3} href="https://www.postgresql.org/docs/18/release-18-6.html"><p><LABEL>O</LABEL>고정 소스 SHA가 대응하는 안정 minor release의 공개 시점과 수정 범위를 확인하는 출발점입니다.</p><p><LABEL>M</LABEL>이 release를 대상 환경에 설치하거나 벤치마크한 결과는 아직 없습니다.</p></CitationBlock>
      </section>

      <StorageEngineMapReturn current="bplus-index-validation" />
    </article>
  );
}
