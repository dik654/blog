import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import StorageEngineLocator, { StorageEngineMapReturn } from "./StorageEngineLocator";
import LsmLifecycleViz from "./viz/LsmLifecycleViz";

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <StorageEngineLocator current="lsm-tree" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            같은 키를 여러 번 바꾸고 삭제해도 시점별 결과는 어떻게 남을까요?
          </h2>
        </div>
        <LsmLifecycleViz />
        <p className="text-lg leading-8">
          키 A에 7을 쓰고, 9로 바꾸고, 마지막에 삭제했다고 하겠습니다. LSM tree는 디스크의 한 위치를 세 번 고쳐 쓰지 않습니다. 각 변경에 증가하는 sequence와 값 종류를 붙여 WAL과 memtable에 먼저 기록한 뒤, 정렬된 immutable 파일로 내립니다.
        </p>
        <p>
          빠른 foreground write는 일을 없앤 것이 아니라 뒤로 미룬 것입니다. 읽기는 여러 위치의 후보에서 한 시점에 보이는 최신 항목을 골라야 하고, compaction은 그 결과를 보존하면서 오래된 항목을 합쳐야 합니다. 이 세 경계를 함께 봐야 LSM의 장점과 비용을 같은 그림에서 이해할 수 있습니다.
        </p>
      </section>

      <section id="write-path" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">성공 응답, 복구 기록, 검색 구조는 서로 다른 책임입니다</h2>
        <p>
          첫 요청 <code>Put(A, 7)</code>은 설명용 sequence 41을 받습니다. WAL은 아직 SSTable에 들어가지 않은 변경을 재시작 뒤 다시 적용할 수 있게 남깁니다. Memtable은 같은 항목을 메모리의 정렬 구조에 넣어 다음 write와 read가 즉시 사용할 수 있게 합니다. Memtable이 기준에 닿으면 immutable 상태로 동결되고, 새 memtable이 후속 쓰기를 받는 동안 백그라운드 작업이 기존 내용을 SSTable로 flush합니다.
        </p>
        <p>
          여기서 “WAL에 썼다”와 “전원 손실 뒤에도 남는다”는 같은 말이 아닙니다. RocksDB의 non-sync write는 운영체제 버퍼에 WAL을 넘긴 뒤 반환할 수 있어 프로세스만 죽는 경우에는 복구할 수 있지만, 장비 전원 손실에서는 최근 변경이 사라질 수 있습니다. <code>sync=true</code>는 반환 전 persistent storage까지 밀어내는 경계를 요청합니다. WAL을 끈 write는 memtable이 flush되기 전에 프로세스가 죽어도 잃을 수 있습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="쓰기 경계의 세 책임">
          <div className="bg-background p-4">
            <strong className="text-sm">WAL</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">아직 flush되지 않은 변경을 재생합니다. 성공 응답의 내구성은 sync 정책까지 봐야 합니다.</p>
          </div>
          <div className="bg-background p-4">
            <strong className="text-sm">Memtable</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">새 항목을 정렬된 메모리 구조에서 즉시 읽고 갱신하게 합니다.</p>
          </div>
          <div className="bg-background p-4">
            <strong className="text-sm">SSTable</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">동결한 항목을 정렬된 immutable 파일로 보관합니다. 후속 변경은 새 항목이 됩니다.</p>
          </div>
        </div>
      </section>

      <section id="read-path" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">읽기는 키가 아니라 키·sequence·값 종류를 함께 비교합니다</h2>
        <p>
          같은 사용자 키 A라도 내부에는 <code>A@41=7</code>, <code>A@52=9</code>, <code>A@60=tombstone</code>처럼 여러 항목이 남습니다. RocksDB의 internal key는 사용자 키 뒤에 sequence와 값 종류를 붙이며, 같은 사용자 키에서는 큰 sequence가 먼저 오도록 비교합니다. 조회는 현재 memtable과 immutable memtable, SSTable 후보를 합쳐 snapshot sequence 이하에서 가장 큰 항목을 선택합니다.
        </p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[38rem] border-collapse text-left text-xs leading-5">
            <thead className="text-muted-foreground">
              <tr>
                <th className="px-3 py-3">조회 시점</th>
                <th className="px-3 py-3">제외되는 항목</th>
                <th className="px-3 py-3">선택되는 항목</th>
                <th className="px-3 py-3">사용자가 보는 결과</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-3 py-3 font-mono">snapshot 55</td>
                <td className="px-3 py-3">A@60은 미래</td>
                <td className="px-3 py-3 font-mono">A@52=value 9</td>
                <td className="px-3 py-3 font-bold">A = 9</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-3 py-3 font-mono">snapshot 61</td>
                <td className="px-3 py-3">없음</td>
                <td className="px-3 py-3 font-mono">A@60=tombstone</td>
                <td className="px-3 py-3 font-bold">없음</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Tombstone은 빈 값이 아니라 “이 시점부터 이전 값을 보이지 않게 하라”는 항목입니다. Tombstone을 확인하고도 더 오래된 파일의 A=7을 반환하면 삭제한 값이 되살아납니다. 반대로 활성 snapshot에 A@52가 필요한 동안 compaction이 그 항목을 지우면 snapshot 55의 결과가 바뀝니다.
        </p>
        <p>
          각 SSTable의 Bloom filter는 유효한 negative일 때 그 파일에 키가 없다고 판단해 data block 읽기를 건너뛰게 합니다. Positive는 “있을 수도 있음”이므로 index와 data를 계속 확인해야 합니다. Bloom filter는 어느 version이 보이는지나 tombstone 의미를 대신 결정하지 않습니다.
        </p>
      </section>

      <section id="compaction" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Compaction은 읽기 결과를 보존하면서 미뤄 둔 정리를 수행합니다</h2>
        <p>
          Flush가 반복되면 같은 키 범위의 sorted run이 늘어납니다. Compaction은 여러 run을 key와 sequence 순서로 병합해 새 SSTable을 만들고, 활성 snapshot이나 더 낮은 level의 값에 필요하지 않은 version과 tombstone만 제거합니다. 새 파일을 manifest에 안전하게 설치하기 전에는 기존 입력 파일을 없앨 수 없습니다.
        </p>
        <p>
          Leveled compaction은 level 내부의 키 범위 겹침을 강하게 제한해 한 번의 point read가 확인할 파일과 중복 공간을 줄이는 대신, 큰 다음 level과 겹치는 바이트를 반복해 다시 쓸 수 있습니다. Tiered 계열은 비슷한 크기의 run을 늦게 합쳐 쓰기 증폭을 줄일 수 있지만 읽을 run 수와 임시 공간이 늘어날 수 있습니다. 어느 쪽이 낫다는 답은 입력 분포와 read/write 비율 없이 정해지지 않습니다.
        </p>
        <ExplainedFormula
          question="사용자가 쓴 양보다 저장 장치에 실제로 몇 배를 썼을까요?"
          idea="같은 관측 구간에서 포함할 물리 쓰기 범위를 먼저 선언하고, 그 합을 성공한 사용자 write 바이트로 나눕니다."
          formula={String.raw`WA=\frac{B_{\mathrm{WAL}}+B_{\mathrm{flush}}+B_{\mathrm{compaction}}}{B_{\mathrm{user}}}`}
          annotatedFormula={String.raw`WA=\frac{\underbrace{B_{\mathrm{WAL}}+B_{\mathrm{flush}}+B_{\mathrm{compaction}}}_{\text{저장 계층이 실제로 쓴 바이트}}}{\underbrace{B_{\mathrm{user}}}_{\text{성공한 사용자 쓰기 바이트}}}`}
          operations={[
            { expression: String.raw`20+20+60=100\ \mathrm{MB}`, annotation: ["WAL 20MB", "flush 20MB", "compaction 결과 60MB"] },
            { expression: String.raw`100/20=5`, annotation: ["같은 구간의 사용자 write 20MB로 나눔", "이 설명 범위의 WA는 5"] },
          ]}
          terms={[
            { symbol: "WA", name: "쓰기 증폭", description: "사용자 바이트 하나당 선언한 저장 계층이 쓴 바이트 비율입니다." },
            { symbol: "B_user", name: "사용자 쓰기", description: "같은 관측 구간에서 성공한 논리 write 바이트입니다." },
            { symbol: "B_WAL", name: "WAL 쓰기", description: "로그 record와 framing을 포함한다고 선언한 실제 바이트입니다." },
            { symbol: "B_flush", name: "Flush 쓰기", description: "Memtable이 SSTable로 내려갈 때 쓴 바이트입니다." },
            { symbol: "B_compaction", name: "Compaction 쓰기", description: "병합 결과를 새 파일로 다시 쓴 바이트입니다." },
          ]}
          assumptions={["모든 항은 같은 관측 구간과 계측 계층을 사용합니다.", "압축 전후, metadata와 임시 파일 포함 여부를 함께 기록합니다.", "이 값은 설명용 계산이며 특정 엔진의 측정 결과가 아닙니다."]}
          interpretation="사용자 write 20MB를 처리하며 WAL 20MB, flush 20MB, compaction 결과 60MB를 썼다면 선언한 범위의 물리 쓰기는 100MB이고 쓰기 증폭은 5입니다."
        />
      </section>

      <section id="stall" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정리 속도가 입력보다 느리면 debt가 foreground write로 돌아옵니다</h2>
        <p>
          백그라운드 flush와 compaction이 새 work를 만드는 속도를 따라가지 못하면 immutable memtable, L0 파일, 처리 예정 바이트가 계속 늘어납니다. 이를 제한하지 않으면 읽을 파일과 임시 공간이 증가해 결국 더 큰 장애가 됩니다. RocksDB는 memtable 수, L0 파일 수, pending compaction bytes가 설정한 경계에 닿을 때 write를 늦추거나 멈춥니다.
        </p>
        <ExplainedFormula
          question="일이 밀리는 평균 속도로 한도 도달 시간을 어떻게 구할까요?"
          idea="입력 속도에서 background 처리 속도를 뺀 값만큼 debt가 늘어난다는 작은 유체 모형입니다."
          formula={String.raw`t_{\mathrm{limit}}=\frac{D_{\mathrm{limit}}-D_0}{\max(\lambda_{\mathrm{ingest}}-\mu_{\mathrm{compact}},0)}`}
          annotatedFormula={String.raw`t_{\mathrm{limit}}=\frac{\underbrace{D_{\mathrm{limit}}-D_0}_{\text{한도까지 남은 일}}}{\underbrace{\max(\lambda_{\mathrm{ingest}}-\mu_{\mathrm{compact}},0)}_{\text{초마다 늘어나는 일}}}`}
          operations={[
            { expression: String.raw`80-60=20\ \mathrm{MB/s}`, annotation: ["입력 80MB/s", "처리 60MB/s", "debt는 초당 20MB 증가"] },
            { expression: String.raw`1000/20=50\ \mathrm{s}`, annotation: ["한도까지 1,000MB", "평균이 유지되면 약 50초"] },
          ]}
          terms={[
            { symbol: "D", name: "처리 예정량", description: "아직 flush·compaction해야 하는 바이트나 이에 대응하는 backlog입니다." },
            { symbol: "λ_ingest", name: "입력 속도", description: "Foreground write가 새 일을 만드는 속도입니다." },
            { symbol: "μ_compact", name: "처리 속도", description: "Background 작업이 밀린 일을 줄이는 속도입니다." },
          ]}
          assumptions={["짧은 구간에서 두 속도와 한도가 일정하다고 봅니다.", "실제 엔진의 L0 파일 수와 discrete trigger는 별도로 관측합니다.", "1GB를 1,000MB로 둔 설명용 계산입니다."]}
          interpretation="입력 80MB/s와 처리 60MB/s가 유지되면 debt가 초당 20MB 늘어납니다. 남은 한도가 1,000MB라면 약 50초 뒤 제한에 닿습니다. 평균이 낮아도 짧은 burst는 파일 수 경계를 먼저 넘을 수 있습니다."
        />
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패는 어느 단계가 사라지거나 너무 빨리 지워졌는지로 나눕니다</h2>
        <div className="not-prose grid gap-px bg-border p-px md:grid-cols-2">
          {[
            ["WAL 전에 성공 응답", "재시작 뒤 memtable 값을 복구할 근거가 없어집니다."],
            ["sync 없는 장비 전원 손실", "운영체제 버퍼에만 있던 최근 WAL 변경이 사라질 수 있습니다."],
            ["tombstone 조기 제거", "아래 level의 오래된 값이 다시 보일 수 있습니다."],
            ["snapshot-visible version 제거", "같은 snapshot을 다시 읽어도 결과가 달라집니다."],
            ["compaction debt 방치", "L0·임시 공간·read amplification이 커져 foreground 지연으로 전파됩니다."],
            ["write stall 무시", "호출 스레드가 오래 막히거나 no-slowdown write가 불완전 상태로 반환될 수 있습니다."],
          ].map(([title, description]) => (
            <div key={title} className="bg-background p-4">
              <strong className="break-keep text-sm">{title}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <p>
          이 글은 위 동작 원리를 설명합니다. 어떤 설정을 선택하고 crash·증폭·stall을 어떤 순서로 시험할지는 다음 실무 글에서 같은 세 개의 개념 anchor로 시작합니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">논문의 구조와 고정 구현의 경계를 나눠 확인합니다</h2>
        <div id="paper-lsm-1996">
          <CitationBlock source="O’Neil et al. · The Log-Structured Merge-Tree" citeKey={1} href="https://doi.org/10.1007/s002360050048">
            <p><b>확인한 범위:</b> 메모리와 디스크 구성요소, rolling merge, 높은 insert rate에서의 비용 구조를 설명하는 원 논문입니다.</p>
            <p><b>확대하지 않은 범위:</b> 현대 RocksDB의 WAL sync, Bloom filter, snapshot, write stall 설정 전체를 이 논문이 정한다고 보지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-rocksdb-source">
          <CitationBlock source="facebook/rocksdb · commit 2dc6bc5" citeKey={2} href="https://github.com/facebook/rocksdb/tree/2dc6bc51b498c7fcae16e78a54de9058181c8b75">
            <p><b>확인한 범위:</b> internal key의 sequence·type, WAL 뒤 memtable 삽입, snapshot-aware compaction, memtable·L0·pending bytes에 따른 write stall 분기를 고정 소스에서 대조했습니다.</p>
            <p><b>확대하지 않은 범위:</b> 이 소스가 특정 장비와 설정에서 성능·내구성을 자동으로 보장한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-rocksdb-operations">
          <CitationBlock source="RocksDB 공식 Wiki · WAL·Snapshot·Write Stalls" citeKey={3} href="https://github.com/facebook/rocksdb/wiki/Write-Stalls">
            <p><b>확인한 범위:</b> WAL의 복구 역할, sync 경계, snapshot sequence 보존과 write stall의 세 원인을 공식 운영 문서에서 교차 확인했습니다.</p>
            <p><b>주의:</b> Wiki의 기본값과 설명은 이동할 수 있으므로 실제 적용은 사용할 릴리스와 options dump를 기준으로 다시 확인합니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section className="not-prose border-y border-border py-5" aria-labelledby="lsm-review-title">
        <p className="text-[10px] font-bold text-primary">그림 없이 다시 설명하기</p>
        <h2 id="lsm-review-title" className="mt-2 text-xl font-bold">세 질문으로 한 키의 수명을 다시 추적해 보세요</h2>
        <ol className="mt-4 grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-3">
          <li className="bg-background p-4"><strong className="block text-xs text-primary">01 · 쓰기</strong><span className="mt-2 block">WAL, memtable, SSTable은 각각 어떤 실패와 비용을 맡을까요?</span></li>
          <li className="bg-background p-4"><strong className="block text-xs text-primary">02 · 읽기</strong><span className="mt-2 block">snapshot 55와 61이 같은 키 A에서 다른 답을 고르는 규칙은 무엇일까요?</span></li>
          <li className="bg-background p-4"><strong className="block text-xs text-primary">03 · 합치기</strong><span className="mt-2 block">어떤 version과 tombstone을 제거할 수 있으며, 왜 debt가 write stall로 돌아올까요?</span></li>
        </ol>
      </section>

      <StorageEngineMapReturn current="lsm-tree" />
    </article>
  );
}
