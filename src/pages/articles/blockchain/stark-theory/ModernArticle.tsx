import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ZkCaseDiagram from "../ZkCaseDiagram";

/** 원문 확인: 2026-10-04. 작은 수치는 별도 가정입니다. */
export default function Article() { return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">1. 실행의 중간 상태를 검사 가능한 표로 바꿉니다</h2>
<p className="leading-8">다른 컴퓨터가 프로그램을 실행했다고 할 때 마지막 숫자만으로는 과정이 맞았는지 알기 어렵습니다. 중간 상태가 이전 상태의 규칙을 따랐는지 확인하고 그 확인을 짧은 증거로 전달하고 싶습니다.</p>
<p className="leading-8">이 글은 세 상태의 작은 계산을 표로 기록한 뒤, 이웃한 상태와 공개된 답이 맞는지 검사합니다. 마지막에는 긴 표를 조금만 읽는 암호 검사로 이어지는 경로를 보여 줍니다.</p>

<p data-stage-bridge="overview" className="text-sm leading-7 text-muted-foreground">실행 의미를 중간 상태로 잡았습니다. 기록과 검사를 나누어 봅니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">2. 상태표·규칙·표의 진위를 따로 확인합니다</h2>
<p className="leading-8">만드는 쪽은 실행한 상태를 표에 적고 표가 지켜야 할 규칙을 적용합니다. 그 표를 고정한 뒤, 일부만 열어도 일관성을 검사할 수 있는 자료를 추가합니다.</p>
<p className="leading-8">확인하는 쪽은 공개 입력과 출력에 맞는 규칙인지, 열린 값이 처음 표에 있던 것인지, 표를 줄이는 계산이 맞는지를 순서대로 검사합니다. 이 중 어느 하나가 빠지면 다른 검사가 대신해 주지 못합니다.</p>

<p data-stage-bridge="black-box" className="text-sm leading-7 text-muted-foreground">세 검사 역할을 나눴습니다. 같은 다항식의 실제 계산 상태를 적습니다.</p>
</section>
<section id="case" data-teach-level="0" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">3. 1에서 6을 거쳐 10에 도착합니다</h2>
<p className="leading-8">17로 나눈 나머지에서 X²+2X+3을 X=4에 계산합니다. 제일 높은 계수 1에서 시작해 4를 곱하고 2를 더하면 6, 다시 4를 곱하고 3을 더하면 27의 나머지 10입니다. 숫자는 설명용 가정입니다.</p>
<p className="leading-8">시간 0,1,2의 상태는(1,6,10)입니다. 첫 상태 1, 입력 4, 단계별 더하는 수 2와 3, 최종 공개값 10을 모두 고정해야 합니다. 마지막 연결을 빼면 내부에서 10을 계산하고도 공개 답을 11이라고 주장할 수 있습니다.</p>

<p data-stage-bridge="case" className="text-sm leading-7 text-muted-foreground">세 상태와 공개 끝점을 고정했습니다. 이웃 상태의 차이를 0으로 만드는 그림을 봅니다.</p>
</section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">4. 다음 상태에서 계산 규칙을 빼면 0이어야 합니다</h2>
<p className="leading-8">첫 전이에서는 6−4×1−2=0입니다. 둘째 전이에서는 10−4×6−3=−17이므로 나머지가 0입니다. 각각의 차이가 0이라는 조건이 실행 규칙을 나타냅니다.</p>
<p className="leading-8">이웃 상태가 모두 맞아도 시작점과 끝점은 따로 연결합니다. 첫 값이 1인지, 끝 값이 공개 답 10인지 확인해야 이 실행이 의도한 계산이라는 뜻이 됩니다.</p>
<ZkCaseDiagram title="같은 입력 4를 사용하는 두 단계" steps={["v₀=1", "v₁=4×1+2=6", "v₂=4×6+3=10"]} arrows={["첫 단계", "mod17"]} />
<p data-stage-bridge="picture" className="text-sm leading-7 text-muted-foreground">전이와 시작·끝의 역할을 분리했습니다. 긴 표에서 이 조건을 묶는 이유를 봅니다.</p>
</section>
<section id="need" data-teach-level="2" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">5. 모든 줄을 다시 읽지 않도록 규칙을 넓혀 적습니다</h2>
<p className="leading-8">실행이 길어지면 모든 이웃 행을 직접 읽는 일이 비싸집니다. 표의 값들을 다항식으로 표현하면 행마다 맞아야 할 조건을 다항식 관계로 옮길 수 있습니다. 다만 행 수만큼 자유로운 다항식은 아무 표나 표현하므로 여분의 평가 위치가 필요합니다.</p>
<p className="leading-8">조건들을 합칠 때도 오류가 서로 지워질 수 있습니다. 차이가 1인 조건과−1인 조건을 그냥 더하면 0입니다. 표를 고정한 뒤 예측하기 어려운 가중치를 주는 이유가 여기에 있습니다.</p>

<p data-stage-bridge="need" className="text-sm leading-7 text-muted-foreground">다항식 표현과 무작위 결합이 필요한 이유를 잡았습니다. 각 단계의 이름을 붙입니다.</p>
</section>
<section id="names" data-teach-level="3" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">6. 실행표·대수 조건·차수 검사를 잇습니다</h2>
<p className="leading-8">중간 상태표는 execution trace입니다. 인접 행과 공개 끝점에 적용할 대수 조건은 AIR, Algebraic Intermediate Representation입니다. 이웃 행의 조건은 전이 조건(transition)입니다. 시작·끝의 조건은 경계 조건(boundary constraint)입니다.</p>
<p className="leading-8">각 조건을 다항식의 정확한 나눗셈으로 바꾸고 가중치를 줘 합친 것은 composition polynomial입니다. 같은 낮은 차수 함수를 더 많은 점에서 계산하는 과정은 LDE, low-degree extension입니다.</p>
<p className="leading-8">Merkle commitment는 표를 고정하고 FRI는 그 표가 정한 차수의 함수에 가까운지 검사합니다. 이 조합이 STARK 계열 증명에 사용됩니다. transparent는 비밀 준비값을 가진 의식이 필요 없다는 뜻이며 암호 가정이 없다는 뜻은 아닙니다.</p>

<p data-stage-bridge="names" className="text-sm leading-7 text-muted-foreground">실행 의미와 차수 검사에 이름을 붙였습니다. 세 상태를 다항식으로 실제 옮깁니다.</p>
</section>
<section id="trace-air" data-teach-level="4" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">7. 세 상태를 잇는 다항식에서 전이 몫 10이 나옵니다</h2>
<p className="leading-8">시간을 T로 적으면 상태(1,6,10)을 잇는 다항식은 v(T)=8T²+14T+1입니다. T=0,1,2를 넣어 1,23≡6,61≡10을 확인합니다. 각 단계에서 더할 수는 a(T)=T+2로 표현할 수 있습니다.</p>
<p className="leading-8">전이 차이 N(T)=v(T+1)−4v(T)−(T+2)를 전개하면 10T²+7T=10T(T−1)입니다. 실제 전이가 적용되는 시간 0과 1에서 0이어야 하므로 T(T−1)로 나누며 몫은 10입니다. 마지막 행 2에는 다음 실행이 없으므로 전이 조건을 무조건 적용하지 않습니다.</p>
<p className="leading-8">첫 경계의 몫은(v(T)−1)/T=8T+14, 마지막 경계의 몫은(v(T)−10)/(T−2)=8T+13입니다. 세 몫에 가정한 가중치 1,2,3을 주면 10+2(8T+14)+3(8T+13)=6T+9가 됩니다. 실제 가중치는 표 고정 뒤 정합니다.</p>
<ExplainedFormula question="전이 조건을 왜 다항식의 정확한 나눗셈으로 쓰나요?" idea="전이가 필요한 T=0,1에서 차이가 0이면 T와 T−1이 모두 인수입니다." formula={String.raw`Q(T)=\frac{v(T+1)-4v(T)-(T+2)}{T(T-1)}=10`} annotatedFormula={String.raw`Q(T)=\frac{v(T+1)-4v(T)-(T+2)}{T(T-1)}=10`} operations={[{"expression": "v(T+1)-4v(T)-(T+2)", "annotation": ["다음 상태에서 규칙대로 계산한 값을 뺍니다."]}, {"expression": "T(T-1)", "annotation": ["전이가 실제로 필요한 두 행에서 0인 인수입니다."]}]} terms={[{"symbol": "T", "name": "시간 좌표", "description": "다항식을 평가하는 변수입니다."}, {"symbol": "v", "name": "상태 다항식", "description": "세 행을 보간한 8T²+14T+1입니다."}, {"symbol": "Q", "name": "전이 몫", "description": "분수의 비율이 아니라 정확한 다항식 몫입니다."}]} interpretation="분자가 10T(T−1)이므로 몫 10이 존재합니다." assumptions={["17로 나눈 나머지에서 계산합니다.", "이 장난감 예는 연속 시간좌표를 사용하며 실제 곱셈 부분군 기반 구현의 인덱스와 구별합니다."]} /><AlgorithmBlock title="작은 실행의 AIR 검사 (의사코드)" input={["상태[1,6,10], 입력 4, 단계계수[2,3], 공개답 10"]} steps={[{"code": "state[0]=1, state[2]=10인지 확인", "note": "시작과 공개 끝점을 묶습니다."}, {"code": "t=0,1 각각에서 (state[t+1]−4×state[t]−coeff[t]) mod17=0 확인", "note": "마지막 행 이후에는 전이를 만들지 않습니다."}, {"code": "실패가 있으면 거절; 통과한 표를 약정한 보간 형식으로 변환", "note": "이 계산은 전체 암호 프로토콜의 입력 조건입니다."}]} output="경계 2개와 전이 2개를 만족한 실행표" />
<p data-stage-bridge="trace-air" className="text-sm leading-7 text-muted-foreground">실제 표에서 전이·경계 몫을 모두 계산했습니다. 원문의 행 조건과 대응시킵니다.</p>
</section>
<section id="lde-fri" data-teach-level="5" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">8. 원문은 이웃 행과 지정된 끝점을 따로 적습니다</h2>
<p className="leading-8">STARK 원문의 AIR 관계는 지정한 행·열의 값과 인접 시간의 조건을 따로 둡니다. 원문의 wⱼ(i)=α에 처음 행의 1과 마지막 행의 10을 넣으면 경계 조건입니다. P(w[t],w[t+1])=0에는 앞 절의 두 전이 차이를 넣습니다.</p>
<p className="leading-8">이 표를 세 점에서만 보간하면 어떤 세 값에도 차수 2 이하 다항식이 존재합니다. 같은 함수를 8개의 다른 점에서 다시 평가하면 허용된 함수들이 임의의 8칸 표보다 적어집니다. 예를 들어 T=3에서 v(3)=115≡13입니다. 단순히 기존 세 값을 복사해 길이만 늘리는 것이 아닙니다.</p>
<p className="leading-8">평가표의 고정값과 필요한 위치의 값을 연결하고 조건의 몫과 FRI 검사를 함께 확인해야 합니다. FRI만 통과했다고 특정 공개 출력 10까지 확인한 것은 아닙니다.</p>
<div id="source-air"><CitationBlock source="Scalable, transparent, and post-quantum secure computational integrity · AIR 정의, PDF p.36" citeKey={1} href="https://eprint.iacr.org/2018/046.pdf"><p className="leading-8">원문: <q>wj(i) = α</q></p><p className="leading-8">시간 0의 상태를 1, 시간 2의 상태를 10에 묶습니다. 전이 조건 두 개와 별도인 경계입니다.</p></CitationBlock></div>
<p data-stage-bridge="lde-fri" className="text-sm leading-7 text-muted-foreground">원문의 조건과 더 넓은 평가표를 연결했습니다. 영지식에 필요한 별도 가리기를 봅니다.</p>
</section>
<section id="source" data-teach-level="6" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">9. 표를 열어 주면 감춘 값도 새로 드러날 수 있습니다</h2>
<p className="leading-8">원 논문은 계산 무결성 증명과 영지식 구성을 구분해서 다룹니다. 작은 예의 표를 그대로 열면 상태 1·6·10을 보게 됩니다. 이 값들이 공개 정보로부터 이미 결정된다면 새로운 비밀은 없지만 비공개 계수가 포함된 실제 작업에서는 열어 준 값이 추가 정보를 줄 수 있습니다.</p>
<p className="leading-8">상태를 숨겨야 하는 경우에는 원래 행에서 0이 되는 다항식 Z(T)=T(T−1)(T−2)에 무작위 다항식 r(T)를 곱해 v(T)+Z(T)r(T)로 가리는 아이디어를 사용할 수 있습니다. 원래 0·1·2행의 값은 보존됩니다. 예제로 r=1이면 T=3의 값은 13+6=19≡2로 바뀝니다.</p>
<p className="leading-8">무작위 상수 하나가 전체 영지식을 보장한다는 뜻은 아닙니다. 열어 주는 평가 수와 결합 관계에 비해 충분한 무작위 자유도가 남아야 하고 증가한 차수와 모든 검증 조건을 함께 바꿔야 합니다. 원문의 영지식 분석이 필요한 이유입니다.</p>
<div id="source-stark-zk"><CitationBlock source="STARK 원 논문 · Abstract, zero-knowledge 구성" citeKey={1} href="https://eprint.iacr.org/2018/046.pdf"><p className="leading-8">원문: <q>zero knowledge</q></p><p className="leading-8">v+Zr에서 r=1인 작은 계산은 원래(1,6,10)을 보존하고 T=3의 13을 2로 바꿉니다. 이 한 번의 가리기는 전체 영지식 증명이 아닙니다.</p></CitationBlock></div><div id="paper-stark"><CitationBlock source="Scalable, transparent, and post-quantum secure computational integrity (2018)" citeKey={2} href="https://eprint.iacr.org/2018/046.pdf"><p className="leading-8"><strong>문제:</strong> 비밀 준비값 없이 큰 계산의 정확성을 효율적으로 확인합니다.</p><p className="leading-8"><strong>기여:</strong> 실행 관계·대수 검사·표의 고정과 근접성 검사를 연결합니다.</p><p className="leading-8"><strong>전제:</strong> 논문이 지정한 체·해시·무작위 오라클과 오류 분석을 사용합니다.</p><p className="leading-8"><strong>근거 범위:</strong> 원 논문의 구성과 저자 구현 평가입니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 모든 STARK 매개변수나 하위 암호를 포함한 전체 서비스의 영지식·양자 안전성을 보장하지 않습니다.</p></CitationBlock></div>
<p data-stage-bridge="source" className="text-sm leading-7 text-muted-foreground">원래 행 보존과 바깥 값 가리기를 수치로 구별했습니다. 마지막으로 보안과 비용의 경계를 확인합니다.</p>
</section>
<section id="security-cost" data-teach-level="7" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">10. 표현이 정확해야 빠른 검증도 의미가 있습니다</h2>
<p className="leading-8">마지막 경계를 빼면 공개 답 11에도 내부 표(1,6,10)가 남을 수 있습니다. 잘못된 계수 순서, 누락된 전이와 잘못된 범위도 같은 종류의 문제입니다. 해시 경로와 차수 검사는 이런 의미상의 누락을 대신 고치지 않습니다.</p>
<p className="leading-8">해시 기반 구성은 이산로그 기반 KZG·IPA와 다른 보안 가정을 사용합니다. 양자 공격에 대해 어떤 해시와 출력 길이, 변환의 모델을 사용했는지 따로 보아야 합니다. 투명성은 준비 과정의 성질이며 안전성 전체의 이름이 아닙니다.</p>
<p className="leading-8">더 넓은 평가표는 읽고 쓰는 메모리와 해시 작업을 늘립니다. 생성기의 작업 메모리, 증거 바이트, 검증 시간은 따로 셉니다. <a href="/cs/crypto/prover-memory-and-verifier-cost">증명기 메모리와 검증 비용</a>에서 행·열·바이트와 온체인 연산으로 이 비용을 계산합니다.</p>

<p data-stage-bridge="security-cost" className="text-sm leading-7 text-muted-foreground">1→6→10의 실행을 다항식과 검사로 연결했고 남는 비밀성·메모리 조건도 확인했습니다.</p>
<ReviewPrompts questions={["왜 마지막 행 2에는 앞 행과 같은 전이 조건을 적용하지 않나요? (답: 7절)", "마지막 공개 답과의 연결을 빼면 11이라는 주장을 무엇이 막지 못하나요? (답: 10절)", "v에T(T−1)(T−2)를 더하면 어떤 세 값이 보존되고 T=3에서는 무엇이 바뀌나요? (답: 9절)"]} />
</section>
</article>; }
