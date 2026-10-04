import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { ceCodeRefs } from "./codeRefs";
import CodeCostViz from "./viz/CodeCostViz";
const SHANNON="https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf";
const SOURCE="https://github.com/pytorch/pytorch/blob/2b3ec34829036a65cd9d1398ea72a0167dc37470/aten/src/ATen/native/LossNLL.cpp";
export default function CrossEntropyArticle(){const sidebar=useCodeSidebar();return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="space-y-6">
<h2 className="text-2xl font-bold">1 · 같은 네 기록을 설명하는 데 왜 더 긴 코드가 필요할까</h2>
<p className="text-lg leading-8">A가 두 번, B와 C가 한 번씩 나온 기록이 있습니다. 자주 나오는 A에 짧은 표시를 붙이면 네 기록을 짧게 적을 수 있습니다. 그런데 C가 더 자주 나올 것이라고 예상해 C의 표시를 짧게 만들었다면 같은 기록도 더 길어집니다. 이 추가 길이를 계산하면 예측이 어디서 어긋났는지 숫자로 비교할 수 있습니다.</p>
<p>이 글은 네 기록을 두 가지 코드로 적는 데서 출발합니다. 실제로 쓴 길이와 평균 길이를 계산하고, 예측 확률을 고치면 어느 부분이 줄어드는지 확인합니다. 끝에서는 같은 네 기록을 학습 함수에 넣었을 때 실제 코드가 어떤 값을 더하고 무엇으로 나누는지 따라갑니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="space-y-6">
<h2 className="text-2xl font-bold">2 · 실제로 나온 글자와 미리 정한 예측표를 함께 받는다</h2>
<p>
            입력은 두 가지입니다. 하나는 실제로 나온 글자의 순서이고 다른 하나는 각 글자가 나올 가능성을 미리 적은 표입니다. 표에 크게 적힌 글자가 실제로 나오면 적은 비용을, 작게
            적힌 글자가 나오면 큰 비용을 매깁니다. 마지막에는 기록마다 얻은 비용을 더하거나 평균냅니다.
          </p>
<p>가능성을 적은 표는 한 글자의 비용을 정합니다. 실제 기록은 어떤 비용을 몇 번 셀지 정합니다. 예측표가 C를 좋아한다고 해서 관측되지 않은 C를 추가로 세지 않습니다. 두 입력의 역할을 바꾸면 다른 질문에 답하게 됩니다.</p>
<p>
            출력은 이번 기록을 설명한 비용 하나입니다. 가장 가능성이 크다고 고른 글자가 맞았는지만 세는 점수와는 다릅니다. 같은 오답이어도 실제 글자에 0.4를 준 예측과 0.001을
            준 예측을 구별합니다. 다만 비용 하나만으로 앞으로 나올 기록의 비용이나 실제 업무의 성공까지 알 수는 없습니다.
          </p>
<p>계산에 쓸 표와 관측을 고정한 뒤 비교해야 합니다. 두 예측을 비교하면서 관측 횟수나 단위를 바꾸면 합계가 달라진 이유를 분리하기 어렵습니다. 지금은 세 종류의 글자만 있고, 네 관측의 순서와 단위를 두 표에 똑같이 적용합니다.</p>
</section>
<section id="case" data-teach-level="0" className="space-y-6">
<h2 className="text-2xl font-bold">3 · A, A, B, C를 두 가지 이진 코드로 적는다</h2>
<p>글자를 뽑는 규칙에서 A의 확률은 1/2이고 B와 C는 각각 1/4이라고 합시다(가정). 관측한 네 글자는 A, A, B, C입니다. 이 네 관측의 비중은 우연히 원래 확률과 같습니다. 네 글자를 봤다는 사실만으로 원래 확률을 정확히 알게 되는 것은 아닙니다. 여기서는 원래 규칙도 따로 알려 줬습니다.</p>
<p>첫 번째 표는 A를 0, B를 10, C를 11로 적습니다. 네 기록은 0·0·10·11이므로 총 6자리이고 한 글자당 평균은 6/4=1.5자리입니다. 구분점을 없애 001011로 이어 적어도 앞에서부터 0, 0, 10, 11로 되찾을 수 있습니다.</p>
<p>두 번째 표는 A를 10, B를 11, C를 0으로 적습니다. C가 자주 나올 것이라는 예상에 짧은 표시를 준 표입니다. 같은 네 기록은 10·10·11·0이 되어 총 7자리, 평균 7/4=1.75자리입니다. 달라진 것은 기록이 아니라 사용하는 표입니다.</p>
<p>차이가 생긴 곳을 따로 세어 보겠습니다. 두 번 나온 A는 각각 한 자리씩 길어져 2자리를 더 씁니다. 한 번 나온 C는 한 자리 짧아져 1자리를 아낍니다. B는 길이가 같습니다. 합하면 1자리를 더 쓰며 글자 하나당 추가 비용은 1/4자리입니다.</p>
<p>두 번째 표가 모든 기록에서 항상 길지는 않습니다. 이번 기록이 C 네 개였다면 두 번째 표는 4자리이고 첫 번째 표는 8자리입니다. 어느 표가 평균적으로 유리한지는 실제로 글자가 나오는 비중과 함께 계산해야 합니다.</p>
<p>짧은 코드를 아무 글자에나 동시에 줄 수도 없습니다. A에 0, B에 1, C에 01을 주면 01이 C 하나인지 A 다음 B인지 구별하지 못합니다. 앞의 두 표는 어느 글자의 코드도 다른 글자의 코드 앞부분이 되지 않아 그런 모호함이 없습니다. 코드 표를 아는 수신자는 왼쪽부터 읽어 원래 글자를 복원합니다.</p>
<p>평균 1.5자리는 한 글자의 코드를 반 자리까지 잘라 보낸다는 뜻이 아닙니다. 실제 한 글자의 길이는 1자리 또는 2자리입니다. 여러 글자에 쓴 정수 길이를 모아 나눴기 때문에 평균에 소수가 생깁니다.</p>
</section>
<section id="picture" data-teach-level="1" className="space-y-6">
<h2 className="text-2xl font-bold">4 · 글자는 그대로 두고 길이를 정하는 표만 바꾼다</h2>
<p>그림의 네 줄은 같은 관측입니다. 첫 장면과 둘째 장면을 넘기면 A 두 줄이 길어지고 C 한 줄이 짧아지는 위치가 보입니다. 마지막 장면은 네 줄의 총길이를 글자 수 4로 나누어 비교합니다.</p>
<CodeCostViz />
<p>네 줄을 평균내는 방법과 글자 종류별 비중을 쓰는 방법은 같습니다. 두 번째 표에서는 A의 길이 2에 비중 1/2를 곱하고, B의 길이 2와 C의 길이 1에 각각 1/4를 곱합니다. 합은 1+1/2+1/4=1.75입니다.</p>
<p>그림에서 길이가 늘어난 A만 보고 결론을 내리지 않는 이유도 보입니다. C에서 아낀 길이도 같은 장부에 넣어야 합니다. 각 글자의 차이는 음수일 수 있지만 전체 평균의 차이는 실제 비중으로 합해서 판단합니다.</p>
</section>
<section id="why" data-teach-level="2" className="space-y-6">
<h2 className="text-2xl font-bold">5 · 확률을 곱할 때 비용은 더해지게 만든다</h2>
<p>앞의 길이는 확률과도 맞아떨어집니다. 확률 1/2인 글자는 1자리, 확률 1/4인 글자는 2자리를 썼습니다. 1을 절반으로 몇 번 줄이면 그 확률이 되는지 세는 계산입니다. 확률 1/8이라면 세 번 줄여야 하므로 비용 3이 됩니다.</p>
<p>이 규칙은 독립으로 얻은 여러 글자의 비용을 합할 수 있게 합니다. 두 번째 예측표에서 A 다음 C가 나올 확률은 1/4×1/2=1/8입니다. 따로 매긴 비용 2+1과 함께 계산한 비용 3이 같습니다. 더 긴 기록의 작은 확률을 직접 곱하는 대신 각 글자의 비용을 더할 수 있습니다.</p>
<p>독립이 아니면 앞선 글자를 보고 정한 다음 확률을 사용해야 합니다. A 다음에 C가 자주 나오는 규칙이라면 처음부터 정해 둔 C의 확률 1/2를 그대로 곱할 수 없습니다. 곱을 합으로 바꾸는 계산은 유지되지만 곱 안에 들어갈 확률이 달라집니다.</p>
<p>가능성을 절반으로 줄일 때마다 같은 비용 1을 더하는 규칙은 맞히기 어려운 사건을 더 크게 평가합니다. 확률이 1이면 비용은 0이고, 양수 확률을 계속 작게 만들면 비용은 끝없이 커집니다. 이 비용은 예측표와 관측의 불일치를 재며 그 글자의 의미가 얼마나 중요한지를 재지는 않습니다.</p>
<p>
            확률이 0.3처럼 절반의 거듭제곱이 아닐 때도 같은 계산을 이어 쓸 수 있습니다. 그 결과를 한 글자에 붙일 정수 길이와 곧바로 같다고 할 수는 없습니다. 여러 글자를 묶어
            부호화할 때의 평균 길이와 연결해야 합니다. 앞의 세 확률은 실제 짧은 코드와 숫자가 정확히 일치하도록 골랐습니다.
          </p>
<p>이제 역할이 드러났습니다. 한 글자에 매기는 비용, 실제 비중으로 평균낸 비용, 표를 바꾸며 늘어난 비용을 따로 부를 수 있습니다. 그 이름을 붙인 뒤 같은 네 기록을 다시 계산하겠습니다.</p>
</section>
<section id="names" data-teach-level="3" className="space-y-6">
<h2 className="text-2xl font-bold">6 · 한 사건의 비용과 평균 비용에 이름을 붙인다</h2>
<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">지금까지 본 역할</th><th className="p-3">이름과 표기</th></tr></thead><tbody>{[
["실제로 글자가 나오는 비중 / 예측표의 비중","실제 분포 P / 모델 분포 Q"],
["확률을 더할 수 있는 비용으로 바꾸기","정보량 또는 surprisal, −log Q(x)"],
["원래 확률에 맞춘 비용의 평균","엔트로피(entropy), H(P)"],
["모델 확률로 매긴 비용을 실제 비중으로 평균","교차 엔트로피(cross-entropy), H(P,Q)"],
["모델 분포를 사용하며 추가된 평균 비용","KL 발산(divergence), D_KL(P‖Q)"],
["관측 자료가 나올 가능성 / 그 음의 로그","우도(likelihood) / NLL"],
["관측 자료의 평균 비용 / 실제 환경의 평균 비용","경험 위험(empirical risk) / 모집단 위험(population risk)"],
["확률을 만들기 전의 실수 점수","로짓(logit), z"],
].map((r,i)=><tr key={i} className="border-t border-border">{r.map((v,j)=><td key={j} className="p-3 align-top">{v}</td>)}</tr>)}</tbody></table></div>
<p>로그의 밑 2를 사용하면 비용 단위가 bit입니다. 자연로그 ln을 쓰면 nat이며 1 bit=ln2 nat입니다. 이 글은 코드 길이를 bit로, 실제 학습 함수의 값을 nat으로 표시하고 전환할 때 ln2를 곱합니다.</p>
</section>
<section id="log-cost" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">7 · 한 글자의 확률을 비용으로 바꾼다</h2>
<p>두 번째 표 Q=(1/4,1/4,1/2)에서 A와 B의 정보량은 2 bit, C는 1 bit입니다. 독립인 A·C의 정보량은 3 bit입니다. 일반적인 순서 자료에서는 Q(앞부분)와 Q(다음 글자|앞부분)를 곱한 뒤 로그를 취합니다.</p>
<ExplainedFormula question="한 사건과 두 사건의 비용은 어떻게 연결되나요?" idea="확률에 음의 로그를 취하면 곱은 합으로 바뀝니다. 독립이 없으면 두 번째 확률을 조건부 확률로 적습니다." formula={String.raw`I_Q(x)=-\log_b Q(x)`}
annotatedFormula={String.raw`\begin{gathered}I_Q(x)=-\log_b Q(x),\quad b>1\\I_Q(x_1,x_2)=-\log_b Q(x_1)-\log_b Q(x_2\mid x_1)\\I_Q(A,C)=-\log_2(1/8)=2+1=3\ \mathrm{bit}\end{gathered}`}
operations={[{expression:String.raw`-\log_2(1/4)=2`,annotation:["1/4는 2의 −2제곱입니다. 음의 부호를 붙이면 비용 2가 됩니다."]}]}
terms={[{symbol:"b",name:"로그의 밑",description:"1보다 큰 고정 밑입니다. 밑 2와 자연로그는 단위가 다릅니다."}]}
assumptions={["관측한 사건의 Q가 양수일 때 유한한 한 사건 비용입니다.","우리 A·C 계산은 두 글자를 독립으로 뽑는 가정입니다."]} interpretation="Q가 0에 가까울수록 비용은 커집니다. 이 사실만으로 모든 매개변수의 기울기가 무한히 커진다고 결론낼 수는 없습니다." />
<p>세 확률을 더 계산해 보겠습니다. 정답 확률 0.9, 0.5, 0.01의 비용은 각각 약 0.105, 0.693, 4.605 nat입니다. 비용이 얼마나 달라지는지와 로짓을 얼마나 고칠지는 12절에서 구별합니다.</p>
</section>
<section id="expectation" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">8 · 실제 비중의 평균과 관측한 네 값의 평균을 구별한다</h2>
<p>알고 있는 P로 비용을 평균내면 실제 규칙에서의 기댓값입니다. 이번 네 기록으로 평균내면 관측 자료의 경험 위험입니다. 주 사례에서는 관측 비중이 P와 같아 두 값이 일치합니다. 다른 네 기록을 얻으면 경험 위험은 달라질 수 있습니다.</p>
<ExplainedFormula question="같은 비용을 모집단과 자료에서 어떻게 평균내나요?" idea="모집단은 각 사건의 확률로 가중하고, 자료에서는 실제로 관측한 비용을 횟수로 나눕니다." formula={String.raw`R(\theta)=\mathbb E_P[\ell_\theta],\quad\widehat R_n(\theta)=\frac1n\sum_{i=1}^n\ell_\theta(x_i,y_i)`}
annotatedFormula={String.raw`\begin{gathered}R(\theta)=\mathbb E_P[\ell_\theta],\quad \widehat R_n(\theta)=\frac1n\sum_{i=1}^n\ell_\theta(x_i,y_i)\\R=\tfrac12\cdot2+\tfrac14\cdot2+\tfrac14\cdot1=1.75\ \mathrm{bit}\\\widehat R_4=\underbrace{(2+2+2+1)/4}_{\text{이번 네 관측}}=1.75\ \mathrm{bit}\end{gathered}`}
operations={[{expression:String.raw`(0.2+0.5+0.8)/3=0.5`,annotation:["별도의 세 관측 비용이 이 값들이라면 그 자료의 평균은 0.5입니다. 환경 전체의 평균과 같다는 뜻은 아닙니다."]}]}
terms={[{symbol:"θ",name:"매개변수",description:"예측 확률과 각 관측의 비용을 정하는 모델의 값입니다."}]}
assumptions={["자료 평균을 같은 모집단의 추정값으로 읽으려면 표집 방법을 밝혀야 합니다.","독립이고 같은 분포인 표본도 이번 평균이 정확한 모집단 평균임을 보장하지 않습니다."]} interpretation="자료 선택의 편향, 과적합, 배포 환경 변화가 있으면 학습 자료의 낮은 평균 비용이 새 자료의 낮은 비용으로 이어지지 않을 수 있습니다." />
<p>분류 입력마다 예측표가 달라지면 Qθ(y|x)를 사용합니다. 같은 사진 x에 어떤 정답 y가 나오는지의 조건부 비용을 전체 자료 분포로 평균냅니다. 지금의 고정 세 글자 표는 그 구조를 손으로 계산하기 위한 작은 경우입니다.</p>
</section>
<section id="entropy" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">9 · 원래 규칙에 맞춘 평균 길이는 1.5 bit다</h2>
<p>P에 맞춘 첫 번째 표의 길이는 1, 2, 2입니다. 실제 비중으로 평균하면 1.5 bit입니다. 이것이 이 분포의 엔트로피입니다. 완벽하게 P를 알고 있어도 다음 글자가 반드시 A라고 정해지는 것은 아니므로 평균 비용이 0이 되지 않습니다.</p>
<ExplainedFormula question="분포 자체의 불확실성은 어떻게 계산하나요?" idea="평균을 내는 비중과 로그 안의 확률을 모두 실제 분포 P에서 가져옵니다." formula={String.raw`H(P)=-\sum_x P(x)\log_b P(x)`}
annotatedFormula={String.raw`\begin{gathered}H(P)=\mathbb E_P[-\log_b P(X)]=-\sum_x P(x)\log_b P(x)\\H(P)=\tfrac12\cdot1+\tfrac14\cdot2+\tfrac14\cdot2=1.5\ \mathrm{bit}\\=1.5\ln2\approx1.039721\ \mathrm{nat}\end{gathered}`}
operations={[{expression:String.raw`0\log 0:=0`,annotation:["발생 확률이 0인 사건의 항은 극한값 0으로 정합니다."]}]}
terms={[{symbol:"H(P)",name:"이산 엔트로피",description:"정해진 글자 집합과 확률에 대한 평균 정보량입니다."}]}
assumptions={["유한한 글자 집합을 다룹니다.","연속 확률밀도의 미분 엔트로피는 같은 성질을 모두 갖지 않습니다."]} interpretation="공정한 두 사건은 ln2≈0.693 nat이고 한 사건의 확률이 1이면 0 nat입니다. K개 사건에서 최대는 균등 분포의 lnK입니다." />
<p>이 값은 글자의 사실성이나 인간에게 주는 중요도를 재지 않습니다. 문장의 비용을 말하려면 어떤 단위로 글자를 나누고 앞 문맥에 따라 어떤 분포를 쓰는지부터 고정해야 합니다.</p>
</section>
<section id="cross-entropy" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">10 · 예측표 Q를 쓰면 평균 비용이 1.75 bit다</h2>
<p>교차 엔트로피는 실제 비중 P를 그대로 두고 비용만 Q에서 가져옵니다. 두 번째 코드 표의 평균 1.75 bit가 그 값입니다. 분류의 한 정답만 관측하면 해당 정답 확률의 음의 로그 하나가 남습니다.</p>
<ExplainedFormula question="같은 네 관측의 평균 비용과 우도는 어떻게 이어지나요?" idea="각 글자 확률의 곱에 음의 로그를 취하면 비용의 합입니다. 평균을 원하면 고정 관측 수로 한 번 더 나눕니다." formula={String.raw`H(P,Q)=-\sum_xP(x)\log_bQ(x)`}
annotatedFormula={String.raw`\begin{gathered}H(P,Q)=\mathbb E_P[-\log_bQ(X)]\\Q(A)Q(A)Q(B)Q(C)=\tfrac14\tfrac14\tfrac14\tfrac12=\tfrac1{128}\\-\log_2(1/128)=7,\qquad H(P,Q)=7/4=1.75\ \mathrm{bit}\\H(P,Q)=\tfrac74\ln2\approx1.213008\ \mathrm{nat}\end{gathered}`}
operations={[{expression:String.raw`-\log \prod_i Q_\theta(y_i\mid x_i)=-\sum_i\log Q_\theta(y_i\mid x_i)`,annotation:["모델이 정한 조건부 표본 분해를 적용합니다. 자기회귀 자료라면 앞 문맥에 조건부인 확률들의 곱을 사용합니다."]}]}
terms={[{symbol:"NLL",name:"음의 로그 우도",description:"이 자료의 합계는 7ln2 nat이며 평균과 구별합니다."}]}
assumptions={["고정 자료와 같은 모델군, 같은 우도 분해를 비교합니다.","로그의 밑은 1보다 크고 평균의 분모 n은 양수로 고정됩니다."]} interpretation="이 조건에서 우도 최대화와 평균 NLL 최소화는 같은 최적 매개변수를 고릅니다. 로그 밑이나 합계·평균 변경은 기울기 크기까지 같게 만들지는 않습니다." />
<p>다른 두 관측의 정답 확률 0.8과 0.5도 곱은 0.4, 합계 NLL은 −ln0.4≈0.916291 nat, 평균은 약 0.458145 nat입니다. 정규화 벌점 등을 별도로 더했다면 손실의 단위만 바꾸면서 벌점 계수를 그대로 둘 때 전체 최적점은 달라질 수 있습니다.</p>
</section>
<section id="kl-divergence" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">11 · 추가된 0.25 bit는 어느 방향의 차이인가</h2>
<p>우리 P에서 Q를 사용한 추가 비용은 1.75−1.5=0.25 bit입니다. A는 실제보다 낮은 확률을 받아 양의 추가 비용을 만들고 C는 높은 확률을 받아 음의 추가 비용을 만듭니다. P로 평균한 합이 KL 발산입니다.</p>
<ExplainedFormula question="교차 엔트로피에서 원래 불확실성을 빼면 무엇이 남나요?" idea="두 로그의 차이를 확률 비율의 로그로 합칩니다. 평균을 내는 분포 P는 유지합니다." formula={String.raw`D_{\mathrm{KL}}(P\Vert Q)=\sum_x P(x)\log_b\frac{P(x)}{Q(x)}=H(P,Q)-H(P)`}
annotatedFormula={String.raw`\begin{gathered}D_{\mathrm{KL}}(P\Vert Q)=\sum_xP(x)\log_b\frac{P(x)}{Q(x)}=H(P,Q)-H(P)\ge0\\D_{\mathrm{KL}}=\tfrac12\cdot1+\tfrac14\cdot0+\tfrac14\cdot(-1)=\tfrac14\ \mathrm{bit}\\=\tfrac14\ln2\approx0.173287\ \mathrm{nat}\end{gathered}`}
operations={[{expression:String.raw`H(P,Q)=H(P)+D_{\mathrm{KL}}(P\Vert Q)`,annotation:["고정 P에 대해 Q를 바꾸면 H(P)는 그대로입니다. 이때 CE 최소화와 이 방향의 KL 최소화가 같습니다."]}]}
terms={[{symbol:String.raw`P\Vert Q`,name:"평가 방향",description:"P에서 나온 사건을 Q로 평가합니다. 두 역할을 교환하면 일반적으로 값이 달라집니다."}]}
assumptions={["여기서는 유한 집합이며 P가 양수인 곳에 Q도 양수입니다.","가산무한 집합에서 무한대 두 개를 빼는 식으로 KL을 정의하면 안 됩니다."]} interpretation="KL은 P=Q일 때만 0입니다. 대칭성과 삼각부등식을 갖는 거리 함수는 아닙니다." />
<ProgressiveDetail title="왜 전체 추가 비용은 음수가 될 수 없을까" preview="자연로그의 −lnu≥1−u를 각 사건에 적용합니다."><p>P(x)&gt;0인 곳에서 u=Q(x)/P(x)를 대입하고 P(x)를 곱해 합하면 D_KL≥ΣP−ΣQ≥0입니다. 두 번째 합은 P가 양수인 영역의 Q만 세므로 1 이하입니다. 모든 항에서 등호가 되려면 그 영역에서 Q=P이고 바깥에 남은 질량도 없어야 합니다. 다른 밑의 로그는 양의 상수로 나눈 결과입니다.</p></ProgressiveDetail>
<p>방향 차이는 별도 두 사건으로 확인합니다. P=(0.5,0.5), Q=(0.9,0.1)이면 H(P)≈0.693147, H(P,Q)≈1.203973, D_KL(P‖Q)≈0.510826 nat입니다. 반대 방향은 약 0.368064 nat로 다릅니다. 앞의 세 글자 사례는 우연히 반대 방향도 같은 값이므로 그 예 하나로 대칭이라고 결론내리면 안 됩니다.</p>
<p>다른 세 사건 P=(0.7,0.2,0.1), Q=(0.6,0.3,0.1)도 계산하면 H(P)≈0.801819, H(P,Q)≈0.828631, KL≈0.026812 nat입니다. 각 기여를 계산한 뒤 합해야 하며 첫 A의 교차 비용 기여는 −0.7ln0.6≈0.357578입니다.</p>
</section>
<section id="softmax-ce-gradient" data-teach-level="4" className="space-y-6">
<h2 className="text-2xl font-bold">12 · 같은 비용을 줄일 로짓의 방향을 구한다</h2>
<p>확률을 만들기 전의 로짓을 z=(0,0,ln2)로 놓으면 지수는 1,1,2이고 합 4로 나눈 확률은 Q=(1/4,1/4,1/2)입니다. 이 정규화가 softmax입니다. 자연로그 CE에서 정답 A 하나의 기울기는 Q−(1,0,0)=(−3/4,1/4,1/2)입니다.</p>
<ExplainedFormula question="서로 연결된 세 확률을 미분하면 왜 Q−y가 남나요?" idea="softmax의 각 확률은 모든 로짓에 의존합니다. 그 미분에 CE의 −yᵢ/Qᵢ를 곱해 합하고 정답 비중의 합 1을 사용합니다." formula={String.raw`\frac{\partial L}{\partial z_j}=Q_j-y_j`}
annotatedFormula={String.raw`\begin{gathered}Q_i=\frac{e^{z_i}}{\sum_k e^{z_k}},\quad L=-\sum_i y_i\ln Q_i\\\frac{\partial Q_i}{\partial z_j}=Q_i(\delta_{ij}-Q_j)\\\frac{\partial L}{\partial z_j}=-\sum_i y_i(\delta_{ij}-Q_j)=Q_j-y_j\\\text{정답 A}:\quad \nabla_zL=(-3/4,1/4,1/2)\end{gathered}`}
operations={[{expression:String.raw`\tfrac14\sum_{t=1}^4(Q-y^{(t)})=Q-P=(-1/4,0,1/4)`,annotation:["네 관측에 같은 로짓을 공유한다는 가정입니다. 각 행의 로짓이 별도 변수라면 행별 기울기에 1/4가 붙습니다."]}]}
terms={[{symbol:"δᵢⱼ",name:"같은 좌표 표시",description:"i=j이면 1, 다르면 0입니다."},{symbol:"y",name:"정답 비중",description:"한 정답만 1인 one-hot 또는 합이 1인 확률 배열입니다."}]}
assumptions={["자연로그, 클래스 가중치 없음, 정답 비중의 합 1입니다.","로짓을 직접 갱신할 때의 방향과 실제 모델 매개변수의 갱신을 구별합니다."]} interpretation="로짓을 직접 경사하강하면 A의 음수 기울기는 A 로짓을 올립니다. 공유 신경망 가중치를 바꿀 때는 그 가중치에서 로짓으로 이어지는 미분도 곱해야 합니다." />
<p>다른 예측 Q=(0.7,0.2,0.1), 정답 A의 기울기는 (−0.3,0.2,0.1)입니다. 모든 좌표의 합은 0이며 모든 로짓에 같은 상수를 더해도 확률이 같다는 성질과 맞습니다. 계산 그래프의 역방향 추적은 <a className="underline" href="/cs/ai/backprop-optimization#tensor-backward">역전파 글의 유도</a>에서 이어집니다.</p>
<p>정답 확률이 0.01이면 NLL은 약 4.605지만 정답 로짓 기울기는 −0.99입니다. 확률에 대한 미분 −1/Q는 커지더라도 softmax와 합성한 로짓 기울기 Q−y의 각 좌표는 −1과 1 사이입니다. 큰 손실을 모든 변수에 대한 무한한 교정으로 해석하지 않습니다.</p>
</section>
<section id="paper-shannon" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">13 · Shannon의 원래 식에 같은 세 확률을 넣는다</h2>
<p>Shannon의 1948년 논문 재현 PDF 11쪽 정리 2에는 H=−KΣpᵢlogpᵢ가 실제로 적혀 있습니다. 앞쪽의 연속성, 같은 확률인 선택 수가 늘 때의 증가, 순차 선택의 가중 합이라는 조건에서 이 형태를 얻습니다. 여기의 K는 양의 단위 상수이며 클래스 수를 뜻하지 않습니다.</p>
<p>
            밑 2와 단위 상수 1을 선택하고 우리 pᵢ=(1/2,1/4,1/4)를 대입하면 H=1.5 bit입니다. 16쪽 정리 9는 잡음 없는 통신로의 용량 C와 정보원의 H를
            연결합니다. 용량을 초당 6 bit라고 둔 별도 가정에서는 한계 비율 C/H=4글자/초가 됩니다. 우리 첫 코드도 평균 1.5 bit이므로 이 작은 독립 정보원에서 같은 평균
            전송률을 얻습니다.
          </p>
<CitationBlock source="Shannon · 재현 PDF 11쪽 정리 2, 16쪽 정리 9" citeKey={1} href={SHANNON}><p>정리 2의 원식은 H=−KΣpᵢlogpᵢ이며 K&gt;0입니다. 정리 9는 주어진 정보원과 잡음 없는 통신로에서 효율적인 부호화의 평균 전송률을 다룹니다. 고정 길이의 모든 개별 메시지가 정확히 H자리로 표현된다는 주장은 아닙니다.</p></CitationBlock>
<p>일반 확률에서는 여러 기호를 묶는 길이와 부호화 규칙을 함께 보아야 합니다. 앞의 dyadic 확률은 정수 코드 길이와 정확히 맞는 특별한 예입니다. 이 통신 정리가 현대 분류 학습 함수 전체나 문장의 의미를 정의한 것으로 확대하지 않습니다.</p>
</section>
<section id="implementation" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">14 · 실제 PyTorch는 네 행의 정답 열을 고른다</h2>
<p>PyTorch v2.14.0의 고정 commit 2b3ec348을 읽습니다. LossNLL.cpp의 cross_entropy_loss_symint는 입력과 정답의 shape를 비교합니다. 우리 입력은 같은 z를 네 행에 반복한 4×3 배열이고, 정답은 클래스 번호 [0,0,1,2]인 길이 4 배열입니다. label_smoothing=0, 가중치 없음, 제외 정답 없음, mean을 가정합니다.</p>
<p>632–668행의 이 분기는 class_dim=1에서 log_softmax를 구해 nll_loss_nd_symint에 넘깁니다. CPU NLL의 265행은 각 행의 정답 열을 읽고, 273행은 그 로그값을 빼서 비용을 더합니다. 네 비용은 ln4, ln4, ln4, ln2입니다. 288–299행에서 유효 관측 수 4로 나누면 7ln2/4≈1.213008 nat입니다.</p>
<div className="flex flex-wrap gap-2"><CodeViewButton onClick={()=>sidebar.open("entry",ceCodeRefs.entry)} label="실제 입력 분기"/><CodeViewButton onClick={()=>sidebar.open("reduce",ceCodeRefs.reduce)} label="정답 선택과 평균 분모"/></div>
<CitationBlock source="PyTorch v2.14.0 · LossNLL.cpp" citeKey={2} type="code" href={SOURCE}><p>원문의 입력 분기와 CPU NLL 누적 경로에 같은 가정 데이터를 손으로 대입했습니다. 원문 전체와 고정 revision을 코드 패널에 보존했습니다. 이 글에서 PyTorch 바이너리나 GPU 커널을 실행한 결과라고 주장하지 않습니다.</p></CitationBlock>
<p>이 API는 이미 정규화한 Q가 아니라 로짓 z를 받습니다. Q를 먼저 넣으면 함수 안에서 다시 softmax를 적용한 다른 분포를 평가합니다. 또한 이 원문은 log_softmax와 NLL을 연결합니다. API 한 번을 호출했다는 이유로 모든 장치와 실행 모드에서 단일 커널이거나 중간 메모리가 없다고 단정할 수 없습니다.</p>
</section>
<section id="stable-log-softmax" data-teach-level="5" className="space-y-6">
<h2 className="text-2xl font-bold">15 · 큰 수를 먼저 빼야 작은 차이가 남는다</h2>
<p>같은 commit의 CPU LogSoftmaxKernelImpl.h는 각 행의 최댓값을 찾고, 이를 뺀 값의 지수를 합한 뒤 로그를 취합니다. 83–95행의 주석과 실제 식은 x−max−log(sum) 순서를 유지하라고 말합니다. 큰 max에 작은 log(sum)을 먼저 더하면 작은 차이가 사라질 수 있기 때문입니다.</p>
<ExplainedFormula question="정답 확률을 먼저 만들지 않고 비용을 어떻게 계산하나요?" idea="최댓값을 먼저 빼 지수의 입력을 0 이하로 만들고, 작은 값들의 로그 합에서 정답의 이동된 로짓을 뺍니다." formula={String.raw`L=\log\sum_j e^{z_j-m}-(z_y-m),\quad m=\max_j z_j`}
annotatedFormula={String.raw`\begin{gathered}m=\max_j z_j,\quad S=\sum_j e^{z_j-m}\\\log Q_j=(z_j-m)-\log S,\qquad L=\log S-(z_y-m)\\z=(0,0,\ln2):\quad S=\tfrac12+\tfrac12+1=2\\L_A=\ln2-(-\ln2)=\ln4\end{gathered}`}
operations={[{expression:String.raw`z=(1000,999),\ y=1:\quad L=\ln(1+e^{-1})\approx0.313262`,annotation:["첫 클래스를 정답으로 두는 별도 예입니다. 최댓값을 빼면 0과 −1이 되어 직접 exp(1000)을 계산하지 않습니다."]}]}
terms={[{symbol:"S",name:"이동한 지수의 합",description:"우리 세 글자에서는 2이며 단위가 없습니다."}]}
assumptions={["유한한 로짓과 명시한 계산 형식을 가정합니다.","NaN, 무한대 입력이나 합산 자체의 범위·반올림 문제까지 모두 해결하는 보장은 아닙니다."]} interpretation="실수 수학에서는 LSE(z)−z_y와 같지만 유한 정밀도에서는 큰 LSE를 먼저 조립한 뒤 빼는 순서가 다른 결과를 낼 수 있습니다." />
<p>
            모든 로짓이 100,000,000인 세 클래스도 확률은 각각 1/3입니다(가정). 각 연산 뒤 binary32로 반올림하면 큰 수에 ln3을 먼저 더한 값은 다시
            100,000,000이 되어 정답 로짓을 빼면 0이 됩니다. 먼저 같은 큰 수끼리 빼고 ln3을 남기면 약 1.0986123 nat입니다. 글의 산술 예제는 Python에서 이
            반올림을 실제 실행했으며 PyTorch의 실행 결과와 구별합니다.
          </p>
<div className="flex flex-wrap gap-2"><CodeViewButton onClick={()=>sidebar.open("stable",ceCodeRefs.stable)} label="CPU의 실제 계산 순서"/><CodeViewButton onClick={()=>sidebar.open("arithmetic",ceCodeRefs.arithmetic)} label="실행한 binary32 산술 예제"/></div>
</section>
<section id="reduction" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">16 · 정답 형식과 가중치가 같아 보여도 분모를 확인한다</h2>
<p>실제 분기는 같은 shape의 정답을 확률 배열로 처리합니다. 한 행의 정답에 P=(1/2,1/4,1/4)를 주면 각 logQ와 P를 곱해 합하므로 동일한 1.75ln2가 나옵니다. 이 경우 정답 하나만 고르는 코드와 달리 세 열 모두를 사용합니다.</p>
<p>클래스 가중치를 w=(2,1,1)로 바꿉시다(가정). 네 클래스 번호 정답의 가중 비용 합은 (2×2+2×2+1×2+1×1)ln2=11ln2입니다. CPU NLL mean은 정답 가중치 합 2+2+1+1=6으로 나누어 11ln2/6을 냅니다.</p>
<p>같은 네 정답을 4×3 one-hot 확률 배열로 바꾸면 이 버전의 확률 정답 경로는 가중 합을 관측 수 4로 나눕니다. 따라서 11ln2/4입니다. 가중치가 없는 두 형식은 여기서 같지만 가중 mean의 분모까지 같다고 가정해서는 안 됩니다. 제외할 정답의 처리도 클래스 번호 경로와 확률 정답 경로의 지원 범위가 다릅니다.</p>
<CodeViewButton onClick={()=>sidebar.open("softTarget",ceCodeRefs.softTarget)} label="확률 정답 경로의 분모"/>
<ProgressiveDetail title="가중치나 합이 1이 아닌 정답이면 기울기는 어떻게 달라질까" preview="Q−y의 약분에 쓴 조건을 다시 드러냅니다."><p>가중 자연로그 손실 L=−ΣwᵢyᵢlnQᵢ의 한 행 로짓 미분은 (Σwᵢyᵢ)Qⱼ−wⱼyⱼ입니다. w=(2,1,1), y=P를 넣으면 (−0.625,0.125,0.5)입니다. 뒤에 mean을 적용한다면 해당 경로의 분모도 곱해집니다.</p><p>가중치가 없어도 y=(2,0,0)처럼 합이 2이면 미분은 2Q−y=(−1.5,0.5,1)입니다. 원문의 shape·dtype 검사를 통과했다고 올바른 확률 정답이 되는 것은 아닙니다. 실제 확률 배열이라면 음수가 없고 행 합이 1인지 호출자가 확인해야 합니다.</p></ProgressiveDetail>
<p>이 분기와 분모는 <a className="underline" href="https://docs.pytorch.org/docs/2.14/generated/torch.nn.CrossEntropyLoss.html">같은 2.14 API 문서</a>의 클래스 번호·확률 정답 수식과 함께 읽어야 합니다. 최신 버전이라는 이름만으로 다른 버전의 구현이나 학습 설정에 그대로 대입하지 않습니다.</p>
</section>
<section id="ce-vs-mse" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">17 · 관측값의 모양을 정한 뒤 손실을 고른다</h2>
<p>세 글자 중 하나를 관측하는 우리 문제는 categorical 분포입니다. 각 정답의 확률을 읽으면 CE가 나옵니다. 연속 측정값을 예측 평균 주변의 Gaussian 분포로 모델링한다면 같은 음의 로그 원칙에서 제곱 오차가 나옵니다.</p>
<ExplainedFormula question="CE와 MSE는 어떤 관측 가정에서 나오나요?" idea="관측 분포의 확률 또는 밀도를 먼저 쓰고 음의 로그를 취합니다. Gaussian에서는 제곱 잔차와 분산 항이 남습니다." formula={String.raw`-\ln p(y\mid\mu,\sigma^2)=\frac{(y-\mu)^2}{2\sigma^2}+\frac12\ln(2\pi\sigma^2)`}
annotatedFormula={String.raw`\begin{gathered}L_{\rm Gaussian}=\frac{(y-\mu)^2}{2\sigma^2}+\frac12\ln(2\pi\sigma^2)\\\sigma^2\text{ 고정}:\quad L=\frac{\mathrm{squared\ error}}{2\sigma^2}+\text{상수}\\L_{\rm categorical}=-\ln Q_y,\qquad L_A=\ln4\end{gathered}`}
operations={[{expression:String.raw`\sigma^2\text{ 학습}\ \Rightarrow\ \tfrac12\ln\sigma^2\text{ 항 유지}`,annotation:["분산이 매개변수라면 이 항은 더 이상 상수가 아닙니다."]}]}
terms={[{symbol:"μ",name:"예측 평균",description:"연속 관측값의 중심입니다."},{symbol:"σ²",name:"관측 분산",description:"양수이며 고정인지 학습하는지 명시해야 합니다."}]}
assumptions={["연속값 식은 Gaussian 관측 모형입니다.","우리 세 글자는 서로 배타적인 한 정답입니다. 여러 정답이 동시에 가능하면 출력과 우도 가정부터 바뀝니다."]} interpretation="분류·회귀라는 이름만으로 손실이 결정되지는 않습니다. 관측값의 범위와 조건부 분포를 먼저 정합니다." />
<p>분류 확률에 제곱 오차를 쓰는 Brier 점수도 가능합니다. 실제 분포 P에서 one-hot 정답을 평균한 제곱 오차는 Σ(Qᵢ−Pᵢ)²에 Q와 무관한 상수를 더한 꼴이므로 Q=P에서 최소입니다. 따라서 분류에서 MSE가 금지되는 것은 아닙니다. 다만 softmax 뒤에 붙이면 로짓 미분에 softmax의 미분이 곱해져 CE와 학습 방향의 크기가 달라집니다.</p>
</section>
<section id="support" data-teach-level="6" className="space-y-6">
<h2 className="text-2xl font-bold">18 · 실제로 나오는 글자에 확률 0을 주면 어떻게 될까</h2>
<p>주 사례의 Q를 (0,1/2,1/2)로 바꾸면 P가 A에 1/2를 주므로 −P(A)logQ(A)는 무한대입니다. CE와 이 방향의 KL이 발산합니다. 유한한 글자 집합에서는 P가 양수인 모든 곳에 Q도 양수인 조건으로 이 문제를 피할 수 있습니다.</p>
<p>반대 방향은 다릅니다. Q가 A에 0을 줬다면 Q를 기준으로 평균할 때 그 A 항은 세지 않습니다. 예를 들어 P=(1/2,1/2), Q=(1,0)이면 D_KL(P‖Q)는 무한대지만 D_KL(Q‖P)=ln2입니다. 어느 분포에서 사건을 뽑아 평가하는지 생략하면 이 차이를 놓칩니다.</p>
<ProgressiveDetail title="가능한 사건이 무한히 많을 때는 양수 조건만으로 충분할까" preview="모든 항이 유한해도 무한합은 발산할 수 있습니다."><p>n≥1에서 Pₙ=2⁻ⁿ, Qₙ=c exp(−2ⁿ)라고 합시다. c는 Q의 합을 1로 만드는 유한한 양의 상수입니다. 모든 Qₙ은 양수지만 −ΣPₙlnQₙ에는 Σ2⁻ⁿ2ⁿ=Σ1이 들어가 무한대입니다. 반면 H(P)=2ln2는 유한합니다. 가산무한의 유한 CE에는 로그 비용의 적분 가능성까지 확인해야 합니다.</p></ProgressiveDetail>
<p>Forward KL이 실제 분포의 여러 봉우리를 덮거나 reverse KL이 한 봉우리에 집중하는 경향은 제한된 모델군과 최적화 조건에 따라 나타납니다. 방향의 수식만으로 모든 학습의 모양을 보장하지 않습니다. 다른 비교가 필요하면 혼합 분포를 쓰는 Jensen–Shannon 발산이나 질량 이동 비용을 쓰는 Wasserstein 거리도 검토할 수 있지만 같은 목적 함수는 아닙니다.</p>
</section>
<section id="limits" data-teach-level="7" className="space-y-6">
<h2 className="text-2xl font-bold">19 · 낮은 비용이 무엇을 보장하는지 범위를 남긴다</h2>
<p>같은 P에서 CE를 줄이면 이 방향의 KL도 줄어듭니다. 그래도 제한된 모델군에 P가 들어 있지 않다면 최소 KL이 0일 필요는 없습니다. 학습 자료의 경험 위험을 줄이는 일과 새로운 환경의 위험을 줄이는 일도 구별해야 합니다.</p>
<p>라벨 오류, 드문 클래스의 비용, 확률 보정, 실제 의사결정 임계값에 따라 업무 지표의 최적점은 달라질 수 있습니다. 어떤 표집을 했고 어떤 가중치와 정답 형식, 로그 단위, 합계·평균 규칙을 썼는지 함께 기록해야 손실 숫자를 비교할 수 있습니다.</p>
<p>코드에서는 입력 shape와 클래스 차원, 제외 정답, 분모, 내부 계산 형식을 확인합니다. API 경로를 읽은 근거와 실제 장치에서의 속도·메모리 관측은 별도로 남깁니다. 이 글은 고정 CPU 원문의 산술 경로를 설명하며 모든 GPU 실행의 융합 여부나 성능을 보장하지 않습니다.</p>
<ContentBoundary article="cross-entropy"/>
</section>
<section id="review" data-teach-level="8" className="space-y-6">
<h2 className="text-2xl font-bold">20 · 표와 분모를 바꾸기 전에 결과를 예측한다</h2>
<ul className="list-disc space-y-4 pl-5"><li>같은 P에서 Q=P로 바꾸면 평균 비용과 추가 비용은 각각 몇 bit가 될까요? (답: 9·11절)</li><li>네 정답과 가중치 (2,1,1)는 그대로 두고 클래스 번호를 one-hot 배열로 바꾸면 mean의 분모와 결과가 같을까요? (답: 16절)</li><li>세 로짓이 모두 100,000,000일 때 큰 LSE를 먼저 조립한 뒤 빼는 계산과 먼저 차를 구하는 계산은 binary32에서 같을까요? (답: 15절)</li></ul>
</section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={ceCodeRefs} fileTrees={{pytorch:{name:"pytorch",type:"dir",children:[{name:"LossNLL.cpp",type:"file",path:"pytorch/aten/src/ATen/native/LossNLL.cpp",codeKey:"entry"},{name:"LogSoftmaxKernelImpl.h",type:"file",path:"pytorch/aten/src/ATen/native/cpu/LogSoftmaxKernelImpl.h",codeKey:"stable"}]},article:{name:"article",type:"dir",children:[{name:"ce_arithmetic.py",type:"file",path:"article/ce_arithmetic.py",codeKey:"arithmetic"}]}}} projectMetas={{pytorch:{id:"pytorch",label:"PyTorch v2.14.0",badgeClass:"border-border"},article:{id:"article",label:"글의 산술 예제",badgeClass:"border-border"}}}/>
</article>;}
