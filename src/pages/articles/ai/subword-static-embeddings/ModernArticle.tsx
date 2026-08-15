import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { SubwordArtifactViz } from "../word2vec/viz/ModernWord2VecViz";

export default function SubwordStaticEmbeddingsArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Subword static embedding은 처음 보는 word를 character 조각의 이미 학습된 rows로 조립합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">일반 Word2Vec table은 vocabulary에 없는 word ID를 읽을 수 없습니다. fastText 방식은 word boundary를 표시한 문자열에서 character n-grams를 만들고, 각 n-gram을 bucket row에 대응시킨 뒤 rows를 합합니다. 그래서 OOV도 vector를 만들 수 있지만 같은 철자의 word가 문장마다 다른 sense vector를 얻는 contextual model은 아닙니다.</p></div>
      <TermBreakdown title="OOV word를 vector로 만들 때 필요한 용어" items={[
        { term: "OOV · out of vocabulary", description: "Release vocabulary에 독립 word row가 없는 입력 문자열입니다." },
        { term: "Character n-gram", description: "Word boundary를 포함한 연속 n-character 조각입니다.", example: "‘run’에서 <ru, run, un> 같은 조각을 만듭니다." },
        { term: "Hash bucket", description: "많은 가능한 n-gram을 고정 수의 trainable row ID로 대응시키는 공간입니다.", boundary: "서로 다른 n-gram이 같은 bucket에 충돌할 수 있습니다." },
        { term: "Static representation", description: "같은 artifact와 문자열이면 주변 문장과 무관하게 같은 vector를 반환합니다." },
      ]} />
      <SubwordArtifactViz />
      <ContentBoundary article="subword-static-embeddings" />
    </section>

    <section id="ngrams" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Word vector는 word row와 그 word가 가진 n-gram rows의 합으로 구성됩니다</h2>
      <ExplainedFormula question="Vocabulary word와 OOV word는 어떤 rows를 더해 하나의 vector가 되나요?" idea={<p>Vocabulary word는 전용 word row를 쓸 수 있고, 모든 word는 추출된 n-gram bucket rows를 공유합니다. OOV이면 전용 row 항을 빼고 subword rows만 합성합니다.</p>} formula={String.raw`\mathbf z_w=\mathbf v_w+\sum_{g\in G(w)}\mathbf z_g`} annotatedFormula={String.raw`\begin{aligned}\widetilde w&=\underbrace{\langle w\rangle}_{\text{word boundary 추가}}\\G(w)&=\underbrace{\operatorname{ngrams}(\widetilde w)}_{\text{character 조각 추출}}\\h_g&=\underbrace{\operatorname{hash}(g)}_{\text{조각을 정수로 변환}}\\b(g)&=\underbrace{h_g\bmod B}_{\text{bucket row ID 선택}}\\\mathbf s_w&=\underbrace{\sum_{g\in G(w)}\mathbf z_{b(g)}}_{\text{subword rows 합산}}\\i_w&=\underbrace{\mathbf 1[w\in V]}_{\text{전용 word row 존재 여부}}\\\mathbf z_w&=\underbrace{i_w\mathbf v_w}_{\text{있으면 word row 추가}}+\underbrace{\mathbf s_w}_{\text{subword 합 유지}}\end{aligned}`} operations={[
        { expression: String.raw`\operatorname{ngrams}(\langle w\rangle)`, annotation: ["word boundary를 문자열에 붙이고", "지정 길이의 연속 character 조각을 생성"] },
        { expression: String.raw`\operatorname{hash}(g)\bmod B`, annotation: ["각 조각을 hash한 뒤 bucket 수로 나눠", "읽을 trainable row ID를 고정"] },
        { expression: String.raw`\sum_{g\in G(w)}\mathbf z_{b(g)}`, annotation: ["모든 조각 rows를 성분별로 더해", "공유 형태 정보를 하나의 vector로 합성"] },
        { expression: String.raw`\mathbf 1[w\in V]\mathbf v_w`, annotation: ["word가 vocabulary에 있을 때만", "전용 word row contribution을 포함"] },
      ]} terms={[
        { symbol: String.raw`G(w)`, name: "N-gram set", description: "Boundary가 붙은 word w에서 추출한 character n-grams입니다." },
        { symbol: "B", name: "Bucket count", description: "Subword hash table의 row 수입니다." },
        { symbol: String.raw`\mathbf z_{b(g)}`, name: "Subword row", description: "N-gram g가 대응된 bucket의 trainable vector입니다." },
        { symbol: String.raw`\mathbf v_w`, name: "Word row", description: "Vocabulary word w에만 있는 전용 static vector입니다." },
      ]} assumptions={["Character normalization과 boundary symbol을 artifact에 고정합니다.", "N-gram min/max length와 hash function·bucket 수가 고정되어 있습니다.", "Collision은 허용되며 서로 다른 n-gram이 parameter를 공유할 수 있습니다."]} interpretation="‘running’이 vocabulary에 없어도 <ru, run, unn, …, ng> bucket rows가 학습돼 있으면 그 합으로 vector를 만듭니다. 하지만 문장 속 ‘running’의 의미별 state는 만들지 않습니다." />
    </section>

    <section id="static-contextual" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Subword를 쓴다고 static embedding이 contextual embedding이 되지는 않습니다</h2>
      <TermBreakdown title="세 representation 경계를 한 줄씩 비교" items={[
        { term: "Word lookup", description: "Vocabulary ID마다 항상 같은 전용 row를 반환합니다.", boundary: "OOV row가 없으면 unknown 처리 정책이 필요합니다." },
        { term: "Subword static embedding", description: "문자열의 n-gram rows를 합쳐 같은 문자열에 같은 vector를 반환합니다.", boundary: "형태는 공유하지만 문장별 sense를 직접 구분하지 않습니다." },
        { term: "Contextual embedding", description: "문장의 다른 tokens와 함께 model forward를 실행해 token instance마다 hidden state를 만듭니다.", boundary: "Artifact lookup만으로 얻을 수 없고 sequence compute가 필요합니다." },
      ]} />
    </section>

    <section id="release" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Matrix 파일 하나가 아니라 문자열→row→vector 전 경로를 같은 revision으로 배포합니다</h2>
      <TermBreakdown title="Static embedding release manifest" items={[
        { term: "Text normalization", description: "Unicode·case·word boundary와 tokenizer revision입니다." },
        { term: "Row identity", description: "Vocabulary index, n-gram length range, hash function과 bucket count입니다." },
        { term: "Training recipe", description: "Corpus cutoff, window, objective, subsampling, noise distribution, seed입니다." },
        { term: "Vector payload", description: "Word·bucket matrices의 dtype, dimension, normalization과 checksum입니다." },
        { term: "Release evidence", description: "OOV coverage·neighbor stability·downstream·subgroup metrics와 rollback artifact입니다." },
      ]} />
      <div id="paper-fasttext" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Bojanowski et al. — Enriching Word Vectors with Subword Information" href="https://aclanthology.org/Q17-1010/">Character n-gram vectors의 합으로 morphology와 OOV 표현을 보강한 fastText 연구입니다. 특정 n-gram 범위와 benchmark 결과가 모든 문자 체계·언어에 그대로 최적이라는 뜻은 아닙니다.</CitationBlock></div>
    </section>
  </div>;
}
