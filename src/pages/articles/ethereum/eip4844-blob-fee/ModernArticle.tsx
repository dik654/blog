import { Link } from "react-router-dom";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ContentBoundary from "@/components/articles/content-boundary";
import FlowRail from "../../world-systems/FlowRail";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import BlobFeeCurveChart from "./BlobFeeCurveChart";
import { codeRefs } from "./codeRefs";
import { eip4844BlobFeeTree } from "./fileTree";

export default function ModernBlobFee() {
 const sidebar = useCodeSidebar();
 const code = (key: string, label: string) => <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open(key, codeRefs[key])} /><span className="text-sm text-muted-foreground">{label}</span></div>;
 return <article className="space-y-14">
  <section id="overview" data-teach-level="S" className="space-y-5">
   <h2 className="text-2xl font-bold">1. 자료를 많이 올리면 다음 가격은 어떻게 달라질까</h2>
   <p>여러 서비스가 거래 기록을 같은 네트워크에 올립니다. 모두가 한꺼번에 많은 자료를 보내면 이를 받아 보관하고 전달하는 컴퓨터의 부담이 커집니다. 블록마다 허용량만 제한하면 남은 자리를 두고 경쟁하는 정도를 다음 가격에 반영하기 어렵습니다.</p>
   <p>이더리움은 자료 사용량을 기록하고 목표보다 많이 쓴 양을 다음 블록으로 넘겨 가격을 조절합니다. 이 글에서는 이전에 남은 양 2에 새 사용량 5를 더하고 목표 3을 빼는 작은 사례부터 읽습니다. 이후 실제 단위와 정수 가격 계산, 2026-10-04에 확인한 추가 규칙을 연결합니다.</p>
   <ContentBoundary article="eip4844-blob-fee" />
  </section>
  <section id="black-box" data-teach-level="B" className="space-y-5">
   <h2 className="text-2xl font-bold">2. 보내는 사람, 사용량 기록, 가격 계산을 나눕니다</h2>
   <p>자료를 보내는 서비스는 감당할 수 있는 가격 상한과 자료를 제출합니다. 블록을 만드는 쪽은 허용량 안에서 거래를 선택합니다. 다른 노드는 사용량과 다음 가격의 근거가 규칙대로 계산됐는지 다시 확인합니다.</p>
   <p>지금은 가격 계산 안을 열지 않고 입력과 출력만 봅니다. 이전 블록의 사용 기록과 적용 중인 설정이 입력이고 다음 블록의 가격이 출력입니다. 특정 서비스가 지불하겠다고 한 상한은 이 계산 결과와 다른 값입니다.</p>
  </section>
  <section id="case" data-teach-level="0" className="space-y-5">
   <h2 className="text-2xl font-bold">3. 남은 2에 사용 5를 더하고 목표 3을 뺍니다</h2>
   <p>처음 도입된 EIP-4844 규칙을 읽기 위한 사례입니다(가정). 자료 한 묶음을 1로 세고 이전 초과분이 2, 이전 블록의 사용량이 5, 목표가 3이라고 합시다. 합계 7에서 목표 3을 빼면 다음 초과분은 4입니다. 이 4는 실제로 전송을 기다리는 파일 개수가 아니라 가격 계산을 위해 저장하는 수치입니다.</p>
   <p>다음 블록에서 사용량이 0이면 4+0−3=1이 남습니다. 그다음도 0이면 1+0−3=−2지만 저장할 초과분은 0에서 멈춥니다. 한가한 기간을 음수 할인 쿠폰처럼 계속 쌓아 두지는 않습니다.</p>
   <p>당시 목표 3과 최대 6은 서로 다른 설정입니다. 5개는 목표보다 많지만 최대 이내이므로 이 사용량 자체로 블록이 잘못된 것은 아닙니다. 현재 목표 수치를 3으로 고정하지는 않습니다.</p>
  </section>
  <section id="picture" data-teach-level="1" className="space-y-5">
   <h2 className="text-2xl font-bold">4. 사용량은 한 단계를 거쳐 다음 가격으로 갑니다</h2>
   <FlowRail title="같은 2·5·3을 다음 블록으로 전달하기" steps={[
    {actor:"이전 기록",movement:"남은 양 2와 실제 사용 5를 읽습니다.",receives:"합계 7"},
    {actor:"초과분 계산",movement:"목표 3을 빼고 음수이면 0으로 만듭니다.",receives:"다음 초과분 4"},
    {actor:"가격 계산",movement:"4를 정해진 정수 계산에 넣습니다. 현재 거래가 낼 가격의 근거가 됩니다.",receives:"자료 사용 한 단위의 가격"},
   ]} />
   <p>현재 블록의 사용량은 그 블록 자신의 기본 가격을 바꾸지 않습니다. 현재 가격은 이미 이전 기록에서 정해졌으며 이번 사용량은 다음 계산으로 넘어갑니다.</p>
  </section>
  <section id="need" data-teach-level="2" className="space-y-5">
   <h2 className="text-2xl font-bold">5. 왜 실행 비용과 자료 비용을 따로 기록할까</h2>
   <p>계산을 많이 하는 거래와 큰 자료를 올리는 거래가 쓰는 자원은 다릅니다. 두 사용량을 같은 숫자로 더하면 자료 전송이 혼잡한지 프로그램 실행이 혼잡한지 구별하기 어렵습니다. 별도의 사용량과 가격을 두면 각 자원의 수요에 대응할 수 있습니다.</p>
   <p>목표는 장기적으로 맞추려는 사용량이고 최대는 한 블록이 넘을 수 없는 한도입니다. 최대를 목표와 같게 두면 잠깐 몰린 수요를 처리할 여유가 줄어듭니다. 초과분을 저장하면 여러 블록에 걸친 수요도 다음 가격에 남습니다.</p>
  </section>
  <section id="names" data-teach-level="3" className="space-y-5">
   <h2 className="text-2xl font-bold">6. 자료 묶음은 blob, 가격용 기록은 excess입니다</h2>
   <p>앞에서 본 자료 묶음은 <strong className="whitespace-nowrap">자료 묶음(blob)</strong>입니다. 그 묶음의 사용량은 <strong className="whitespace-nowrap">자료 가스(blob gas)</strong>로 셉니다. blob 하나는 131,072 blob gas를 사용합니다. 이름에 gas가 들어가도 프로그램 실행에 사용하는 execution gas와 별도 장부입니다.</p>
   <p><code>blob_gas_used</code>는 블록이 사용한 양입니다. <code>excess_blob_gas</code>는 다음 가격으로 넘기는 누적 초과분입니다. 장기적으로 맞출 사용량은 <strong className="whitespace-nowrap">목표(target)</strong>입니다. 한 블록이 넘을 수 없는 한도는 <strong className="whitespace-nowrap">최대(max)</strong>입니다. blob gas 한 단위의 기본 가격은 <strong className="whitespace-nowrap">자료 기본료(blob base fee)</strong>이며 ETH 최소 단위인 wei로 표현합니다.</p>
   <p>따라서 사례의 2·5·3·4를 실제 입력으로 쓰려면 모두 131,072를 곱합니다. 262,144+655,360−393,216=524,288 blob gas입니다. 일부 숫자만 개수로 남겨 두면 서로 다른 단위를 더하게 됩니다.</p>
  </section>
  <section id="excess-update" data-teach-level="4" className="space-y-5">
   <h2 className="text-2xl font-bold">7. 524,288이라는 기록이 곧 524,288 wei는 아닙니다</h2>
   <ExplainedFormula question="2+5−3을 실제 blob gas로 옮기면 무엇을 저장하나요?" idea="이전 초과분과 사용량을 더하고 같은 단위의 목표를 뺍니다. 음수인 결과는 저장하지 않습니다." formula={String.raw`E'=\max(0,E+U-T)`} annotatedFormula={String.raw`E'=\underbrace{\max(0,\underbrace{E+U}_{\text{이전 초과분과 사용량}}-T)}_{\text{목표를 빼고 0에서 멈춤}}`} operations={[{expression:"E+U",annotation:["262,144와 655,360을 더해","917,504 blob gas를 얻습니다."]},{expression:String.raw`\max(0,E+U-T)`,annotation:["393,216을 빼면 양수이므로","524,288을 다음 기록으로 저장합니다."]}]} terms={[{symbol:"E",name:"이전 초과분",description:"가격 조절을 위해 이전 헤더에 저장된 blob gas입니다."},{symbol:"U",name:"이전 사용량",description:"이전 블록이 실제로 사용한 blob gas입니다."},{symbol:"T",name:"적용 목표",description:"계산 대상 블록에 적용되는 목표 blob gas입니다."}]} assumptions={["이 식은 원래 EIP-4844 규칙 또는 EIP-7918의 추가 가격 분기가 선택되지 않은 경우입니다.","모든 수치는 같은 blob gas 단위입니다. 적용 fork의 설정을 먼저 확인합니다."]} interpretation="초과분 524,288은 다음 가격 계산의 입력입니다. 당시 update fraction 3,338,477과 최소 가격 1을 사용하면 다음 가격은 정수 계산 결과 1 wei/blob gas입니다." />
   <p>초과분이 늘어도 최소 가격 근처에서는 정수 반올림 방식 때문에 기본 가격이 그대로일 수 있습니다. 사례에서 다음 블록이 blob 하나를 올리면 자료 기본 요금은 131,072×1=131,072 wei입니다. 실행 요금은 여기에 따로 더합니다.</p>
  </section>
  <section id="integer-fee" data-teach-level="5" className="space-y-5">
   <h2 className="text-2xl font-bold">8. 정수 계산은 매 단계의 나머지를 버립니다</h2>
   <p>이상적인 가격 곡선은 초과분이 늘수록 지수 함수처럼 올라갑니다. 실제 노드는 같은 입력에서 정확히 같은 정수를 얻어야 하므로 부동소수점 대신 곱셈과 정수 나눗셈을 반복합니다. 규격의 이름은 <code>fake_exponential</code>이며 가짜 가격을 뜻하지 않습니다.</p>
   <p>실수 지수 함수의 항은 1, x, x²/2!, x³/3! 순서입니다. 앞 항에 x/i를 곱하면 다음 항이 되므로 x=n/d를 대입하면 곱할 비율은 n/(di)입니다. 여기에 f를 곱하고 계산 중 크기를 d배로 유지한 뒤 마지막에 d로 나눕니다. 실제 규칙은 각 단계에서 내림을 추가합니다.</p>
   <ExplainedFormula question="가격 계산에서 어느 단계에 정수 나눗셈이 들어가나요?" idea="첫 항을 크게 만든 다음 앞 항에서 다음 항을 계산합니다. 각 항의 나눗셈과 마지막 나눗셈에서 소수 부분을 버립니다." formula={String.raw`a_0=fd,\quad a_i=\left\lfloor\frac{a_{i-1}n}{di}\right\rfloor,\quad P=\left\lfloor\frac{\sum_{i=0}^{k}a_i}{d}\right\rfloor`} annotatedFormula={String.raw`a_i=\underbrace{\left\lfloor\frac{a_{i-1}n}{di}\right\rfloor}_{\text{매 항에서 정수 나눗셈}},\quad P=\underbrace{\left\lfloor\frac{\sum a_i}{d}\right\rfloor}_{\text{마지막에도 정수 나눗셈}}`} operations={[{expression:"a_0=fd",annotation:["최소 가격에 분모를 곱해","나눗셈 전 계산 크기를 확보합니다."]},{expression:String.raw`\left\lfloor a_{i-1}n/(di)\right\rfloor`,annotation:["이전 항에 초과분을 곱하고","분모와 항 번호로 나눠 나머지를 버립니다."]},{expression:String.raw`\left\lfloor\sum a_i/d\right\rfloor`,annotation:["0이 되기 전 항들을 더한 뒤","분모로 나눠 정수 가격을 얻습니다."]}]} terms={[{symbol:"f",name:"최소 가격",description:"이 사례에서는 1 wei/blob gas입니다."},{symbol:"n",name:"가격 입력",description:"앞에서 계산한 새 초과분입니다."},{symbol:"d",name:"update fraction",description:"가격 변화 속도를 정하는 양수 설정입니다."},{symbol:"i",name:"항 번호",description:"1부터 한 단계씩 증가합니다."},{symbol:"k",name:"마지막 양수 항",description:"다음 항이 0이 되면 반복을 끝냅니다."}]} assumptions={["음수가 아닌 정수 입력과 양수 d를 사용합니다.","floor 표시는 소수 부분을 버린다는 뜻입니다. 실수 급수와 정확히 같다고 두지 않습니다."]} interpretation="작동만 보기 위한 작은 설정 f=1,n=4,d=2에서는 항이 2→4→4→2→1→0입니다. 합계 13을 2로 나눈 정수값은 6입니다. e²≈7.389를 한 번만 내림한 7과도 다릅니다." />
   <AlgorithmBlock title="정수 가격 함수 계산하기" input={["f ≥ 0, n ≥ 0인 정수와 d > 0인 정수"]} steps={[{code:"합계 ← 0; 항 ← f × d; i ← 1",note:"작은 사례에서는 항이 2로 시작합니다."},{code:"항 > 0인 동안: 합계 ← 합계 + 항",note:"이번 항을 다음 항으로 덮어쓰기 전에 더합니다."},{code:"항 ← floor(항 × n / (d × i)); i ← i + 1",note:"2·4·4·2·1 다음에 0이 나오면 반복을 끝냅니다."},{code:"반환 floor(합계 / d)",note:"13을 2로 나눈 정수값 6입니다."}]} repeatUntil="2·3단계를 항이 0이 될 때까지 반복합니다." output="정수 blob base fee" />
   <p>이 작은 4/2 설정은 나눗셈을 손으로 추적하기 위한 별도 가정입니다. 실제 사례의 n=524,288·d=3,338,477과 섞지 않습니다. 두 입력을 실제 Go 함수로 각각 계산하면 6과 1을 얻습니다.</p>
   <BlobFeeCurveChart />
  </section>
  <section id="source" data-teach-level="6" className="space-y-5">
   <h2 className="text-2xl font-bold">9. 실제 코드에서 입력 시각과 세 갈래를 읽습니다</h2>
   <p>보존한 원문은 go-ethereum commit <code>c9a2bc73c847319a8faa57de59e42c0efc420682</code>의 Go 파일입니다. <code>CalcExcessBlobGas</code>는 이전 헤더에서 E와 U를 읽지만 설정은 새 블록의 <code>headTimestamp</code>로 선택합니다. 업그레이드 첫 블록에서 이전 시각의 목표를 쓰면 잘못된 값을 계산할 수 있습니다.</p>
   {code("calc-excess-blob-gas","공식 Go · 설정 선택과 초과분의 세 분기")}
   <p>먼저 E+U가 목표보다 작은지 확인합니다. 작으면 0입니다. 다음으로 Osaka 이후의 EIP-7918 가격 조건을 확인하고 해당하면 별도 식을 씁니다. 두 조건에 해당하지 않으면 마지막 줄이 원래 E+U−T를 반환합니다. 앞의 역사적 2·5·3 사례는 이 마지막 경로에 대응합니다.</p>
   <p>EIP-7918은 <code>8192 × 이전 실행 base fee</code>가 <code>131072 × 이전 excess로 계산한 blob base fee</code>보다 큰 경우를 다룹니다. 이때 초과분은 <code>E + floor(U × (max−target) / max)</code>입니다. 다만 E+U가 목표보다 작은 첫 분기는 여전히 먼저 적용합니다.</p>
   <p>현재 설정을 읽는 비교 사례(가정)로 목표 14·최대 21, 이전 초과분 2묶음·사용 18묶음을 가정합시다. 추가 가격 조건이 거짓이면 다음 초과분은 2+18−14=6묶음 상당입니다. 조건이 참이면 2+18×7/21=8묶음 상당입니다. 실제 계산은 먼저 blob gas로 바꿔 정수 나눗셈합니다. 이번 수치는 나누어떨어집니다.</p>
   <p>확인한 메인넷 설정은 BPO2의 목표 14·최대 21·update fraction 11,684,671입니다. 이 설정에서 이전 실행 base fee를 1 wei로 가정하면 8,192&lt;131,072이므로 보통 분기, 1 Gwei로 가정하면 8,192,000,000,000&gt;131,072이므로 추가 분기입니다. 설정의 존재와 네트워크 활성화는 <Link to="/cs/blockchain/robinhood-chain-blob-demand#source">일정과 연결된 원문</Link>에서 함께 확인합니다.</p>
   {code("calc-blob-fee","공식 Go · 양의 정수 나눗셈과 반복 종료")}
   <p>Go 함수는 항을 누적한 뒤 n을 곱하고 d, i로 차례로 정수 나눗셈합니다. 음수가 아닌 정수에서는 이 두 나눗셈이 d×i로 나눈 내림과 같습니다. 마지막에도 d로 나눕니다. 이 함수 원문을 별도 작은 실행 틀에서 계산해 본 것이며 전체 노드나 메인넷 거래를 실행한 검증은 아닙니다.</p>
   <p>가격 함수의 <code>big.Int</code>는 고정 폭 정수의 넘침을 피합니다. 반면 헤더의 blob gas 필드는 64비트이므로 단위와 최대값 검사가 필요합니다. 다른 언어로 옮길 때에는 큰 정수나 검사된 곱셈을 사용하고 매 항의 내림 순서를 보존해야 합니다. 최소값·최대값·업그레이드 첫 블록을 같은 입력으로 비교해야 하며 넘쳤다고 실수 계산으로 바꾸면 안 됩니다.</p>
   {code("verify-header","공식 Go · 새 헤더에 적힌 결과를 다시 검산")}
   <p>검증 함수는 새 블록의 사용량이 최대 이내인지, blob 한 개의 단위로 나누어떨어지는지, 헤더의 초과분이 재계산 결과와 같은지 확인합니다. 기대값 6묶음인 조건에서 제작자가 8묶음을 적으면 가격에 유리한지와 무관하게 거절합니다.</p>
  </section>
  <section id="paper-eip4844-fee" className="space-y-5">
   <h2 className="text-2xl font-bold">10. 규격의 가격과 사용자가 내는 총비용을 구분합니다</h2>
   <p>EIP-4844의 <code>calc_blob_fee</code>는 거래가 쓰는 blob gas에 기본 가격을 곱합니다. 이 비용은 실행 전에 차감해 소각하며 실행 실패로 환급하지 않습니다. 사례의 131,072 wei는 자료 요금 한 부분이고 실행 gas, 서비스의 증명 생성·압축·운영 비용을 포함한 최종 청구액은 별도로 계산합니다.</p>
   <p>사용자가 적은 <code>max_fee_per_blob_gas</code>는 지불 상한입니다. 현재 기본 가격보다 낮으면 유효한 blob 거래로 포함할 수 없습니다. 상한이 충분해도 선택·전파·검증까지 보장하는 것은 아닙니다. 기본 가격이 싸졌다는 사실만으로 모든 서비스 요금이 같은 비율로 줄었다고 계산할 수도 없습니다.</p>
   <CitationBlock source="EIP-4844 · Helpers, Header extension, Gas accounting" citeKey={1} href="https://eips.ethereum.org/EIPS/eip-4844">초기 목표 3·최대 6, 131,072 단위, 정수 가격 함수와 실행 실패 시 blob 요금 규칙의 근거입니다.</CitationBlock>
   <CitationBlock source="EIP-7918 · Functions" citeKey={2} href="https://eips.ethereum.org/EIPS/eip-7918">새 블록의 설정을 사용하는 조건과 실행 가격에 연결된 추가 분기를 대조했습니다. 2026-10-04 확인.</CitationBlock>
   <CitationBlock source="go-ethereum · c9a2bc7 · eip4844.go" citeKey={3} href="https://github.com/ethereum/go-ethereum/blob/c9a2bc73c847319a8faa57de59e42c0efc420682/consensus/misc/eip4844/eip4844.go">수정하지 않은 원본 228줄과 LGPL 고지를 보존했습니다. 설정 선택·초과분·정수 가격·헤더 검증을 같은 사례에 적용합니다.</CitationBlock>
  </section>
  <section id="limits" data-teach-level="7" className="space-y-5">
   <h2 className="text-2xl font-bold">11. 수요 기록, 가격, 혼잡을 하나의 숫자로 읽지 않습니다</h2>
   <p>초과분 4는 가격을 정하는 기록이지 미처리 거래 네 개를 뜻하지 않습니다. 기본 가격 1이 유지돼도 사용량 기록은 달라질 수 있습니다. 같은 평균 사용량이라도 특정 블록에 수요가 몰리면 포함 대기와 최대 한도의 영향은 다르게 나타납니다.</p>
   <p>원래의 3묶음 목표 사례와 BPO2의 14묶음 목표 사례는 적용 버전이 다릅니다. 실제 블록을 분석할 때는 이전 헤더, 새 블록 시각, 활성 설정, 실행 base fee를 함께 읽어야 합니다. 여기의 가정 계산으로 실제 서비스 수요나 향후 가격을 측정했다고 할 수는 없습니다.</p>
   <ReviewPrompts questions={["원래 규칙에서 다음 초과분이 4이고 이후 사용량이 두 번 연속 0이면 기록은 어떻게 바뀔까요? (답: 3절)","f=1,n=4,d=2를 계산할 때 왜 e²를 내림한 7 대신 6이 나올까요? (답: 8절)","BPO2 사례에서 이전 초과분 2·사용 18이 같아도 6과 8이 갈리는 이유는 무엇일까요? (답: 9절)"]} />
  </section>
  <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={{"go-ethereum":eip4844BlobFeeTree}} />
 </article>;
}
