import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import InputContractViz from "./viz/InputContractViz";
export default function SelfAttention() {
  return <section id="input-format" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">입력은 token·position·segment를 더하고 padding을 가린다</h2>
    <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-7">원 BERT의 각 위치는 WordPiece token embedding, learned absolute position embedding과 token-type embedding을 더한 뒤 encoder로 들어갑니다. 단일 문장은 <code>[CLS] X [SEP]</code>, 문장 쌍은 <code>[CLS] A [SEP] B [SEP]</code> 형식이며 token type 0과 1로 두 segment를 구분합니다. Token string과 ID의 정확한 계약은 <Link to="/ai/tokenizer">Tokenizer 글</Link>에서 이어집니다.</p></div>
    <InputContractViz/>
    <ExplainedFormula question="BERT의 한 입력 위치에 서로 다른 정보 채널을 어떻게 합칠까?" idea={<>같은 hidden width의 token·position·segment embedding을 element-wise로 더합니다. 이 합은 어느 token인지, sequence의 몇 번째인지, 어느 segment인지 동시에 전달합니다.</>} formula={String.raw`\mathbf e_i=E_{\mathrm{tok}}[x_i]+E_{\mathrm{pos}}[i]+E_{\mathrm{seg}}[s_i]`} terms={[{symbol:"x_i",name:"token ID",description:"WordPiece tokenizer와 special-token 규칙이 만든 vocabulary index입니다."},{symbol:"i",name:"position ID",description:"원 BERT에서는 maximum position 범위 안의 learned absolute index입니다."},{symbol:"s_i",name:"segment ID",description:"문장 pair의 A/B를 나타내며 단일 segment에서는 보통 0입니다."}]} assumptions={["세 embedding의 hidden dimension이 같아 element-wise sum이 가능합니다.","Checkpoint와 tokenizer의 special-token ID·position limit·type vocabulary가 일치해야 합니다."]} interpretation="세 정보를 이어 붙이는 것이 아니라 같은 좌표에 더하므로 encoder가 학습 과정에서 필요한 성분을 분리해 사용합니다. Segment embedding이 문장 의미를 자동으로 완성하거나 [CLS]가 본질적인 sentence embedding이 되는 것은 아닙니다."/>
    <ExplainedFormula question="양쪽 문맥을 허용하면서 [PAD]가 다른 token의 representation을 오염시키지 않게 하려면?" idea={<>실제 token pair의 attention score는 그대로 두고 key 위치가 padding이면 softmax 전에 −∞를 더해 weight를 0으로 만듭니다. MLM의 [MASK] token과 padding attention mask는 전혀 다른 장치입니다.</>} formula={String.raw`A_{ij}=\begin{cases}0,&j\ \text{is real token}\\-\infty,&j\ \text{is padding}\end{cases}`} terms={[{symbol:"A_{ij}",name:"additive attention mask",description:"Query i가 key j를 볼 수 있는지 attention logit에 더하는 값입니다."},{symbol:"j",name:"key position",description:"BERT encoder에서는 실제 token이면 i보다 왼쪽·오른쪽 모두 허용됩니다."}]} assumptions={["Library에 따라 1/0 attention_mask를 내부에서 additive mask로 변환합니다.","Loss에서도 padding과 task 무관 위치를 별도로 제외합니다."]} interpretation="Padding mask는 batch 길이 맞춤용 [PAD]를 무시하게 하고, MLM mask는 선택된 원 token을 오염시키는 vocabulary token입니다. 둘을 혼동하면 attention 또는 loss 대상이 잘못됩니다."/>
    <div id="paper-bert-api" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
      <p className="text-xs font-bold text-primary">공식 문서 · Runtime input 계약</p>
      <p className="mt-2 text-sm font-semibold">Hugging Face Transformers — BERT</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground"><code>input_ids</code>, <code>attention_mask</code>, <code>token_type_ids</code>, <code>position_ids</code>가 별도 tensor라는 사실과 각 shape를 확인할 수 있습니다. 문서는 원 논문의 역사적 recipe가 아니라 현재 library 구현의 API 계약으로 사용합니다.</p>
      <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://huggingface.co/docs/transformers/model_doc/bert" target="_blank" rel="noreferrer">현재 BERT input·output API 보기</a>
    </div>
  </section>;
}
