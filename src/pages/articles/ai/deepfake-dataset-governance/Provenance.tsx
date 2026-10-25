import { CitationBlock } from "@/components/ui/citation";
import ProvenanceChainViz from "./viz/ProvenanceChainViz";

const MANIFEST = `# 원본을 식별하고 현재 사용 범위 revision을 연결합니다.
source_id: clip-042
person_id: person-C
permission_revision: permission-C-r3

# 각 파생본이 바로 앞의 입력과 생성 과정을 가리킵니다.
artifact_id: crop-04-a1
parent_id: frame-120
source_group: 042-C

# 조작·유통·전처리 조건을 서로 다른 필드로 보존합니다.
generator: generator-Z@recipe-z7
codec: social-codec@revision-s2
crop: track-A@revision-c3
split: test`;

export default function Provenance() {
  return (
    <section id="provenance" data-teach-level="5" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">crop 하나를 원본과 사용 범위로 되짚습니다</h2>
      <ProvenanceChainViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>crop-04-a1</code>에서 parent ID를 한 단계씩 따라갑니다. 같은 시각의 프레임,
          social codec 재인코딩, generator-Z의 조작 영상과 원본 <code>clip-042</code>에
          차례로 도달합니다. 이 사슬의 모든 파일은 <code>group 042-C</code>를 공유합니다. crop만
          남고 parent가 끊기면 어느 원본과 생성 조건에서 왔는지, 어느 split에 함께 있어야
          하는지 확인할 수 없습니다.
        </p>
        <p>
          사용 범위 기록은 파생 파일의 속성으로 복사해 굳히지 않고 revision ID로
          연결합니다. 그래야 범위가 바뀌었을 때 어느 파생본이 영향을 받는지 같은 사슬에서
          다시 찾을 수 있습니다. 아래 YAML은 구현 제품의 고정 schema가 아니라 이 사례에서
          필요한 최소 관계를 보이는 설명용 manifest입니다.
        </p>
      </div>
      <div className="not-prose my-8 border-y border-border bg-muted/15">
        <p className="border-b border-border px-4 py-3 text-xs font-bold text-muted-foreground">
          manifest.yaml · 설명용 필드
        </p>
        <pre className="overflow-x-auto px-4 py-5 font-mono text-[13px] font-normal leading-6 text-foreground"><code>{MANIFEST}</code></pre>
      </div>
      <div id="standard-prov" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">표준 읽기 · 파생 관계</p>
        <CitationBlock type="paper" citeKey={1} source="W3C PROV-O · Recommendation" href="https://www.w3.org/TR/2013/REC-prov-o-20130430/">
          <p className="text-sm leading-6 text-muted-foreground">
            PROV-O는 자료 같은 Entity, 자료를 바꾸는 Activity, 책임을 지는 Agent와
            <code>wasDerivedFrom</code> 관계로 출처 사슬을 표현합니다. 이 글은 그 구분을
            원본·생성·재인코딩·crop 관계에 적용합니다. 위 YAML이 PROV-O 전체를 구현하거나
            상호운용성을 검증했다는 뜻은 아닙니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
