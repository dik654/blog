import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import TokenPipelineViz from "./viz/TokenPipelineViz";
import TextContractViz from "./viz/TextContractViz";
import CompatibilityViz from "./viz/CompatibilityViz";
export default function Overview(){return <section id="overview" className="mb-16 scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">Tokenizer는 raw text와 model checkpoint 사이의 interface다</h2><div className="prose prose-neutral dark:prose-invert max-w-none"><p className="text-lg leading-8">
            Language model은 화면에 보이는 문자열을 직접 읽지 않는다. Tokenizer가 문자열을 정규화하고 경계를 만들고 vocabulary token을 선택한 뒤
            integer ID로 바꾸면 model은 그 ID가 가리키는 embedding row부터 계산한다. tokenizer file과 model weight는 따로 교체할 수 있는
            부품처럼 보이지만 실제로는 하나의 versioned contract다.
          </p><p>먼저 text의 단위를 구분해야 한다. 사람이 한 글자로 보는 grapheme, Unicode code point, UTF-8 byte는 수가 다를 수 있으며 같은 글자가 NFC와 NFD에서 서로 다른 code-point sequence로 표현되기도 한다. 이 차이가 낯설다면 <Link to="/ai/text-unicode-encoding">문자·Unicode·UTF-8 정본 글</Link>에서 bit와 byte부터 먼저 확인할 수 있다. NFKC는 폭·위첨자 같은 compatibility 차이를 합칠 수 있어 검색에는 유용하지만 code·식별자·원문 복원이 필요한 작업에서는 의미 있는 차이를 지울 수 있다.</p></div><TextContractViz/><TokenPipelineViz/><div className="prose prose-neutral dark:prose-invert max-w-none"><p><a href="https://www.unicode.org/reports/tr15/" target="_blank" rel="noreferrer">Unicode normalization 규격</a>은 canonical equivalence와 compatibility equivalence를 구분한다. Tokenizer의 normalizer를 바꾸면 token count만 달라지는 것이 아니라 원문 offset, span label과 exact round-trip도 달라질 수 있으므로 목적에 맞는 보존 계약을 먼저 정한다.</p></div><CompatibilityViz/><div className="prose prose-neutral dark:prose-invert max-w-none"><h3 id="token-id-embedding-matrix" className="scroll-mt-20">Token ID는 vocabulary 색인이고 embedding matrix는 그 표다</h3><p className="leading-7">
            Tokenizer는 고정한 vocabulary 안에서 token마다 정수 색인을 매긴다. 이것이 token ID다. Vocabulary가 128,000개 항목이면 ID는 0부터
            127,999까지이며, 같은 문자열이라도 tokenizer 버전이 바뀌면 다른 ID를 받을 수 있다.
          </p><p className="leading-7">
            Model은 이 ID를 lookup으로 바꾼다. V×d 크기의 학습 가능한 표인 embedding matrix에서 행(row)을 하나 꺼내는 일이다.
          </p><p className="leading-7">Vocabulary 128,000, d_model 4096, FP16(원소당 2 byte)이면 embedding matrix 하나의 크기는 128,000×4,096×2byte=10억 4,857만6천 byte, 약 0.98 GiB다. Input embedding과 output head weight를 공유하지 않으면(untied) 이 크기가 그대로 한 번 더 필요하다.</p><p className="leading-7">
            그래서 같은 ID 42107이 tokenizer A에서는 &quot;▁안녕하세요&quot;를, tokenizer B에서는 다른 token을 가리킬 수 있다. ID는 특정
            embedding matrix의 특정 row를 가리키는 주소다. 숫자 자체에 의미가 실려 있지 않으므로 tokenizer와 model checkpoint는 버전까지 정확히
            맞아야 같은 의미로 계산된다.
          </p></div><ExplainedFormula question="Tokenizer 효율을 길이가 다른 corpus와 언어 사이에서 어떻게 비교할까?" idea={<>생성된 token 수를 원문 byte 수로 나누면 별도 word segmenter 없이 여러 script·code·URL을 같은 분모에서 비교할 수 있습니다. 반대로 bytes per token을 쓰면 값이 클수록 더 압축된 것입니다.</>} formula={String.raw`\begin{aligned}\operatorname{TPB}&=N_{\mathrm{tok}}/N_{\mathrm{byte}}\\\operatorname{BPT}&=N_{\mathrm{byte}}/N_{\mathrm{tok}}\end{aligned}`}
annotatedFormula={String.raw`\begin{aligned}\operatorname{TPB}&=\underbrace{N_{\mathrm{tok}}/N_{\mathrm{byte}}}_{\text{기준량당 비율}}\\\operatorname{BPT}&=\underbrace{N_{\mathrm{byte}}/N_{\mathrm{tok}}}_{\text{기준량당 비율}}\end{aligned}`}
operations={[
  { expression: String.raw`N_{\mathrm{tok}}/N_{\mathrm{byte}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","생성된 token 수를 원문 byte 수로 나누면 별도","word segmenter 없이 여러","script·code·URL을 같은 분모에서 비교할 수"] },
  { expression: String.raw`N_{\mathrm{byte}}/N_{\mathrm{tok}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","생성된 token 수를 원문 byte 수로 나누면 별도","word segmenter 없이 여러","script·code·URL을 같은 분모에서 비교할 수"] },
]} terms={[{symbol:"N_{\\mathrm{tok}}",name:"encoded length",description:"Special token을 포함할지 제외할지 사전에 고정한 token 수입니다."},{symbol:"N_{\\mathrm{byte}}",name:"raw byte length",description:"Normalizer 적용 전 또는 후 중 어느 text를 분모로 썼는지 명시합니다."}]} assumptions={["같은 production corpus slice와 truncation·special-token 규칙으로 비교합니다.","평균뿐 아니라 언어·domain별 p50/p95와 최악 사례를 봅니다."]} interpretation="Token 수가 적으면 context와 attention 비용에는 유리할 수 있지만 의미 단위가 더 좋다는 보장은 없습니다. Downstream 품질, fallback과 vocabulary parameter 비용을 별도로 평가해야 합니다."/></section>}
