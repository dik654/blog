import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import StorageEngineLocator, { StorageEngineMapReturn } from "../lsm-tree/StorageEngineLocator";
import BplusLifecycleViz from "./viz/BplusLifecycleViz";

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <StorageEngineLocator current="bplus-tree" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">큰 fanout의 page는 어떻게 짧은 조회 경로와 순서 탐색을 만들까요?</h2>
        </div>
        <BplusLifecycleViz />
        <p className="text-lg leading-8">100만 개의 정렬된 key를 저장한다고 하겠습니다. B+ tree는 key마다 새 디스크 위치를 찾지 않고, 고정 크기 page 하나에 많은 separator와 child pointer를 넣습니다. Internal page는 다음 page를 고르고, 같은 깊이에 놓인 leaf가 실제 key 또는 record pointer를 순서대로 보관합니다.</p>
        <p>이 구조 덕분에 point lookup은 짧은 root-to-leaf 경로가 되고, range scan은 첫 leaf를 찾은 뒤 옆 leaf로 이어집니다. 대신 삽입과 삭제는 page를 나누거나 합칠 때 정렬 순서, parent 연결과 모든 leaf의 같은 깊이를 함께 지켜야 합니다.</p>
      </section>

      <section id="page-layout" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Page byte 예산이 fanout과 높이를 정합니다</h2>
        <p>Internal page에는 header, slot directory, separator key와 child page 번호가 들어갑니다. Leaf에는 ordered key와 value 또는 record pointer, 옆 leaf로 가는 연결이 들어갑니다. “Key가 16바이트이므로 4KiB에 256개”라고 나누면 header·pointer·slot·빈 공간을 빠뜨립니다.</p>
        <ExplainedFormula
          question="Page layout에서 point lookup의 최대 page 수를 어떻게 추정할까요?"
          idea="Page에서 metadata를 뺀 공간을 routing entry 크기로 나눠 fanout을 구하고, leaf 수를 fanout으로 반복해서 접습니다."
          formula={String.raw`F=\left\lfloor\frac{P-H}{K+C}\right\rfloor,\qquad L=\left\lceil\frac{N}{E}\right\rceil,\qquad \text{page reads}\approx 1+\left\lceil\log_F L\right\rceil`}
          annotatedFormula={String.raw`F=\biggl\lfloor\frac{\underbrace{P-H}_{\text{routing에 쓸 수 있는 bytes}}}{\underbrace{K+C}_{\text{separator와 child pointer}}}\biggr\rfloor,\qquad L=\underbrace{\left\lceil\frac{N}{E}\right\rceil}_{\text{leaf page 수}},\qquad \text{page reads}\approx \underbrace{1}_{\text{leaf}}+\underbrace{\left\lceil\log_F L\right\rceil}_{\text{internal 층 수}}`}
          operations={[
            { expression: String.raw`\left\lfloor\frac{4096-96}{24}\right\rfloor=166`, annotation: ["Page 4,096바이트에서 header 96바이트를 뺌", "routing entry를 24바이트로 가정", "최대 166개라는 설명용 상한"] },
            { expression: String.raw`\left\lceil\frac{1{,}000{,}000}{200}\right\rceil=5{,}000`, annotation: ["leaf 하나에 평균 200개", "100만 entries는 5,000 leaves"] },
            { expression: String.raw`5{,}000\rightarrow 32\rightarrow 1`, annotation: ["보수적 fanout 160", "5,000 leaves를 32 parents가 가리킴", "root 1장까지 합쳐 cold path는 3장"] },
          ]}
          terms={[
            { symbol: "P", name: "Page bytes", description: "한 index page의 고정 크기입니다." },
            { symbol: "H", name: "Page overhead", description: "Header·slot directory·연결 정보가 쓰는 공간입니다." },
            { symbol: "K+C", name: "Routing entry bytes", description: "Separator key와 child pointer 한 쌍의 크기입니다." },
            { symbol: "E", name: "Leaf capacity", description: "Leaf page 하나가 담는 평균 entry 수입니다." },
            { symbol: "N", name: "Entry count", description: "색인할 전체 entry 수입니다." },
          ]}
          assumptions={["Key 길이와 page 형식, prefix compression과 fill factor가 고정되어 있습니다.", "Root도 cold page라고 세며 cache hit는 별도로 다룹니다.", "설명용 용량 계산이며 실제 latency 측정값이 아닙니다."]}
          interpretation="보수적으로 fanout 160과 leaf 용량 200을 쓰면 100만 entries는 5,000 leaves, 32 parent pages, 1 root로 접힙니다. Root·parent·leaf가 모두 cold라면 point lookup 경로는 3 pages입니다."
        />
        <p>최소 fanout이 <code>m</code>이고 root를 제외한 page가 그 조건을 지킨다면, 깊이가 하나 늘 때 가리킬 수 있는 leaf 수가 <code>m</code>배가 됩니다. 그래서 높이는 entry 수가 아니라 그 수의 로그에 비례합니다. Variable-length key나 낮은 fill factor는 실제 fanout을 낮춥니다.</p>
      </section>

      <section id="search-range" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Separator는 길을 고르고 leaf 연결은 범위를 잇습니다</h2>
        <p>Root의 separator가 <code>[20, 40]</code>이라면 key 35는 가운데 child로 내려갑니다. 도착한 leaf에서 lower bound를 찾고 key와 duplicate 정책을 확인합니다. Separator는 탐색 경계이지 그 자체가 사용자가 찾는 record라고 단정할 수 없습니다.</p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <div className="bg-background p-4"><strong className="text-sm">Point 35</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Root [20│40] → 가운데 child → leaf [21,35,39] → 35 확인</p></div>
          <div className="bg-background p-4"><strong className="text-sm">Range [35,62]</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">35가 있는 leaf까지 한 번 내려간 뒤 right sibling을 따라 62에서 멈춤</p></div>
        </div>
        <p>Range 비용은 대략 tree 높이와 결과가 걸친 leaf page 수의 합입니다. Build와 lookup이 comparator·collation·null·duplicate 순서, inclusive·exclusive endpoint를 똑같이 해석해야 합니다. 두 경로의 순서가 다르면 존재하는 key가 다른 child에 놓여 도달할 수 없거나 range 결과가 뒤섞입니다.</p>
      </section>

      <section id="updates" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Split은 새 page와 parent 경계를 함께 공개해야 합니다</h2>
        <p>Leaf 용량이 4일 때 <code>[10,20,30,40]</code>에 25를 넣으면 먼저 <code>[10,20,25,30,40]</code>이 됩니다. 이를 <code>[10,20]</code>과 <code>[25,30,40]</code>으로 나누고 parent에 새 right leaf의 경계 25와 downlink를 올립니다. Parent도 넘치면 같은 변화가 위로 전파되고, root가 나뉠 때만 모든 leaf 경로가 함께 한 단계 길어집니다.</p>
        <p>교과서적인 삭제 모형에서는 minimum occupancy 아래로 내려간 page가 sibling에서 entry를 빌리고 parent 경계를 고치거나, 빌릴 수 없으면 합쳐서 parent edge를 줄입니다. Root child가 하나만 남으면 높이를 줄일 수 있습니다. 이때 보존할 핵심은 전체 key 순서, 정한 점유율 경계와 모든 leaf의 같은 깊이입니다.</p>
        <p>실제 제품의 삭제 정책은 다를 수 있습니다. PostgreSQL nbtree는 high key와 right link를 쓰는 Lehman–Yao 계열이며, VACUUM에서 부분적으로 찬 두 page를 일반적인 교과서식으로 합치지 않고 완전히 빈 page를 삭제합니다. 따라서 generic merge 그림과 특정 제품의 구현을 구분해야 합니다.</p>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패는 page가 아니라 도달 경로와 순서가 깨질 때 드러납니다</h2>
        <div className="not-prose grid gap-px bg-border p-px md:grid-cols-2">
          {[
            ["Parent downlink 누락", "새 leaf가 파일에 있어도 root에서 내려가는 경로가 없어 해당 key를 찾지 못합니다."],
            ["Separator 갱신 누락", "Lookup이 이전 경계를 따라 잘못된 child로 내려갑니다."],
            ["Comparator 불일치", "Build와 lookup이 같은 bytes의 순서를 다르게 해석해 point·range 결과가 달라집니다."],
            ["Sibling 연결 손상", "첫 leaf는 찾더라도 range scan이 일부 leaf를 건너뛰거나 순환할 수 있습니다."],
            ["깊이 불일치", "일부 path만 짧아져 탐색 규칙이 leaf 여부를 일관되게 판단하지 못합니다."],
            ["일반 알고리즘과 제품 혼동", "교과서식 merge를 제품이 반드시 수행한다고 가정하면 장애 진단과 시험 지점이 어긋납니다."],
          ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="break-keep text-sm">{title}</strong><p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{body}</p></div>)}
        </div>
        <p>이 글은 page index의 동작 원리를 설명합니다. Source와 page format을 고정하고 boundary 입력·중간 종료·reopen을 어떻게 검증할지는 다음 실무 글에서 이 글의 세 개념 anchor를 가져와 다룹니다.</p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">원 논문, B+ tree 개관, 안정 release 구현을 나눠 확인합니다</h2>
        <div id="paper-bayer-mccreight"><CitationBlock source="Bayer & McCreight · Organization and Maintenance of Large Ordered Indices" citeKey={1} href="https://doi.org/10.1007/BF00288683"><p><b>확인한 범위:</b> Fixed-size page를 쓰는 balanced multiway search tree의 fanout·높이·삽입·삭제 분석입니다.</p><p><b>확대하지 않은 범위:</b> 현대 B+ leaf 연결, MVCC, WAL과 특정 제품의 삭제 정책까지 이 논문이 정한다고 보지 않습니다.</p></CitationBlock></div>
        <div id="paper-comer-btree"><CitationBlock source="Comer · The Ubiquitous B-Tree" citeKey={2} href="https://doi.org/10.1145/356770.356776"><p><b>확인한 범위:</b> B-tree 계열과 B+ tree 변형의 구조·사용 맥락을 정리한 고전적 개관입니다.</p><p><b>확대하지 않은 범위:</b> 현재 데이터베이스 구현의 page format이나 crash 원자성을 대신하지 않습니다.</p></CitationBlock></div>
        <div id="paper-postgres-btree"><CitationBlock source="PostgreSQL 18 · B-Tree Indexes" citeKey={3} href="https://www.postgresql.org/docs/18/btree.html"><p><b>확인한 범위:</b> Multi-level page 구조, leaf tuple과 internal downlink, level별 page 연결, split과 root growth를 공식 문서에서 확인했습니다.</p><p><b>확대하지 않은 범위:</b> PostgreSQL의 구조를 모든 B+ tree 구현의 고정 형식으로 일반화하지 않습니다.</p></CitationBlock></div>
        <div id="paper-postgres-nbtree"><CitationBlock source="PostgreSQL 18.6 · nbtree README @ 724edf9" citeKey={4} href="https://github.com/postgres/postgres/blob/724edf9bde9d356724ad384a2e196edc3c9f80f7/src/backend/access/nbtree/README"><p><b>확인한 범위:</b> 안정 minor release의 high key·right link·동시 split과 page deletion 정책을 exact source snapshot에서 확인했습니다.</p><p><b>확대하지 않은 범위:</b> 선택 source가 다른 engine의 layout·성능·내구성을 증명하지 않습니다.</p></CitationBlock></div>
      </section>

      <section className="not-prose border-y border-border py-5" aria-labelledby="bplus-review-title">
        <p className="text-[10px] font-bold text-primary">그림 없이 다시 설명하기</p>
        <h2 id="bplus-review-title" className="mt-2 text-xl font-bold">세 질문으로 page graph를 다시 추적해 보세요</h2>
        <ol className="mt-4 grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-3">
          <li className="bg-background p-4"><strong className="block text-xs text-primary">01 · Page</strong><span className="mt-2 block">4KiB page의 usable bytes와 routing entry 크기가 fanout과 높이를 어떻게 바꿀까요?</span></li>
          <li className="bg-background p-4"><strong className="block text-xs text-primary">02 · 조회</strong><span className="mt-2 block">35의 point lookup과 [35,62] range scan은 어디까지 같은 경로를 사용할까요?</span></li>
          <li className="bg-background p-4"><strong className="block text-xs text-primary">03 · 갱신</strong><span className="mt-2 block">25를 넣어 leaf를 나눌 때 새 page 외에 parent와 sibling에서 무엇을 고쳐야 할까요?</span></li>
        </ol>
      </section>

      <StorageEngineMapReturn current="bplus-tree" />
    </article>
  );
}
