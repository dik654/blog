import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs, fileTree } from "./codeRefsPinned";
import { CitationBlock } from "@/components/ui/citation-block";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ZkCaseDiagram from "../ZkCaseDiagram";

/** 원문 확인: 2026-10-04. 작은 수치는 별도 가정입니다. */
export default function Article() { const sidebar = useCodeSidebar(); return <><article className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">1. 프로그램의 계산과 메모리 읽기를 함께 증명합니다</h2>
<p className="leading-8">프로그램이 올바른 답을 냈다는 주장은 덧셈이 맞았다는 말보다 넓습니다. 어떤 명령을 실행했고 어느 저장 위치에서 값을 읽었으며 결과를 어디에 썼는지도 맞아야 합니다.</p>
<p className="leading-8">이 글은 두 수의 덧셈 하나를 실행 기록과 메모리 검사에 연결합니다. 실제 구현은 2026-10-02의 특정 소스 버전으로 고정하고 원 논문과 이후 바뀐 부분을 구별합니다.</p>

<p data-stage-bridge="overview" className="text-sm leading-7 text-muted-foreground">명령 계산과 저장 위치를 함께 확인할 필요를 잡았습니다. 큰 흐름을 봅니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">2. 실행 기록을 만들고 각 기록의 약속을 검사합니다</h2>
<p className="leading-8">프로그램을 실행하면 읽은 값과 쓴 값, 명령 위치가 기록됩니다. 증거를 만드는 쪽은 이 기록이 허용된 명령의 계산과 맞는지, 저장한 값이 다음 읽기까지 이어지는지를 확인할 자료를 만듭니다.</p>
<p className="leading-8">받는 쪽은 프로그램과 공개 입출력을 정한 뒤 증거를 검사합니다. 프로그램의 이름만 같거나 화면에 같은 답이 표시된다는 사실로 이 연결을 대신할 수는 없습니다.</p>

<p data-stage-bridge="black-box" className="text-sm leading-7 text-muted-foreground">실행 기록과 공개 결과의 연결을 정했습니다. 한 명령을 숫자로 채웁니다.</p>
</section>
<section id="case" data-teach-level="0" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">3. 두 저장 위치의 3과 4를 더해 7을 씁니다</h2>
<p className="leading-8">작업용 저장 위치 1에 3, 위치 2에 4, 위치 3에 0이 있다고 합시다. 명령은 위치 1과 2를 읽어 합을 위치 3에 쓰는 덧셈입니다. 결과는 7이고 위치 3의 변화량도 7입니다. 숫자와 저장 위치는 설명용 가정입니다.</p>
<p className="leading-8">네 위치만 그린 축약 메모리는[0,3,4,0]에서[0,3,4,7]로 바뀝니다. 이 네 칸은 실제 전체 레지스터 수를 뜻하지 않습니다. 읽은 3과 4가 맞더라도 결과를 8로 쓰면 계산 검사가, 다른 위치에 7을 쓰면 주소 검사가 잡아야 합니다.</p>

<p data-stage-bridge="case" className="text-sm leading-7 text-muted-foreground">값과 주소의 두 오류를 나눴습니다. 한 칸만 선택하는 모양을 봅니다.</p>
</section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">4. 주소는 한 칸만 1인 선택 벡터로 표현할 수 있습니다</h2>
<p className="leading-8">위치 1을 읽는 선택은 [0,1,0,0]입니다. 메모리 [0,3,4,0]와 자리별로 곱해 더하면 3만 남습니다. 위치 2의 [0,0,1,0]은 4를 남기고 위치 3의 [0,0,0,1]은 변화량 7을 그 칸에만 더합니다.</p>
<p className="leading-8">선택 벡터를 임의로 두면 두 칸을 한꺼번에 선택하거나 분수처럼 섞을 수 있습니다. 각 값이 0 또는 1이고 합이 1이라는 조건까지 검사해야 주소 하나를 뜻합니다.</p>
<ZkCaseDiagram title="같은레지스터읽기와쓰기" steps={["[0,3,4,0]", "위치 1→3 · 위치 2→4", "위치 3에 7 → [0,3,4,7]"]} arrows={["선택벡터", "변화량 7"]} />
<p data-stage-bridge="picture" className="text-sm leading-7 text-muted-foreground">선택과 갱신을 같은 벡터로 표현했습니다. 큰 표를 실제로 전부 만들지 않는 이유를 봅니다.</p>
</section>
<section id="need" data-teach-level="2" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">5. 큰 명령표를 전부 저장하지 않고 구조를 이용합니다</h2>
<p className="leading-8">64비트 값들의 모든 입력 조합을 표로 실제 저장하는 것은 불가능합니다. 명령의 계산을 작은 구조로 나누거나, 표의 특정 위치를 계산하는 규칙을 이용해 같은 질문에 답해야 합니다.</p>
<p className="leading-8">메모리를 매 순간 통째로 복사하는 것도 비쌉니다. 이전 값에 해당 주소의 변화량만 더해 현재 값을 복원하면 변경된 부분을 중심으로 검사할 수 있습니다. 이때 값과 주소의 연결을 빠뜨리면 잘못된 메모리도 허용할 수 있습니다.</p>

<p data-stage-bridge="need" className="text-sm leading-7 text-muted-foreground">큰 표의 구조와 희소한 변경을 이용하는 이유를 잡았습니다. 구현의 이름을 붙입니다.</p>
</section>
<section id="names" data-teach-level="3" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">6. 명령 lookup과 읽기·쓰기 검사를 나눕니다</h2>
<p className="leading-8">정해진 표의 값을 읽었다는 주장은 lookup입니다. 한 자리만 1인 주소 표현은 one-hot이고 저장값의 변화량은 increment입니다. 읽기 전용 표를 다루는 Shout과 읽기·쓰기를 다루는 Twist는 이 표현을 사용하는 증명 방식입니다.</p>
<p className="leading-8">Sumcheck는 많은 항의 합이라는 주장을 한 변수씩 줄여 임의 점에서의 평가로 연결합니다. 그 평가가 원래 정한 자료와 같은지는 commitment opening이 확인합니다. <a href="/cs/crypto/hyperplonk#sumcheck">sumcheck 정본</a>과 <a href="/cs/crypto/polycommit">다항식 커밋먼트</a>가 이 두 역할을 설명합니다.</p>
<p className="leading-8">Jolt는 이런 검사를 조합한 RISC-V zkVM입니다. 현재 확인한 소스는 RV64IMAC를 표방하며 공식 README는 alpha 상태를 명시합니다. 2023 원 논문의 구성과 2025 Twist and Shout 도입, 64비트 전환을 같은 버전처럼 섞지 않습니다.</p>

<p data-stage-bridge="names" className="text-sm leading-7 text-muted-foreground">각 검사의 이름과 버전을 연결했습니다. 실제 ADD 실행부터 추적합니다.</p>
</section>
<section id="lookup-sumcheck" data-teach-level="4" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">7. 덧셈 7과 메모리 변화 7을 서로 다른 조건으로 묶습니다</h2>
<p className="leading-8">고정한 tracer의 ADD.exec는 두 레지스터 값을 wrapping_add로 더하고 목적 레지스터에 씁니다. 3과 4이면 7입니다. 64비트 최댓값에 1을 더하면 0으로 되돌아오므로 일반 정수 덧셈과 기계 명령의 결과를 구분해야 합니다.</p>
<p className="leading-8">lookup 변환도 입력에 XLEN 비트 마스크를 씌우며 ADD의 결과는 같은 wrapping_add와 마스크로 계산합니다. 입력은 더 넓은 u128 합으로 lookup 위치를 만들 수 있으므로 결과 7과 테이블 주소의 표현이 같은 타입이라고 가정하지 않습니다.</p>
<p className="leading-8">메모리에서는 목적 위치 3의 이전 값 0에 변화량 7을 더해 결과 7을 얻습니다. Twist 검사에서는 읽기·쓰기 주장들을 질문 γ의 거듭제곱으로 묶습니다. 작은 가정 γ=2에서 목적 결과 7, 첫 읽기 3, 둘째 읽기 4를 합치면 7+2×3+4×4=29입니다. 주소별 선택과 이전 값·변화량으로 계산한 쪽도 29여야 합니다.</p>
<CodeViewButton label="ADD.exec · 실제 레지스터 실행" onClick={() => sidebar.open("jolt-exec", codeRefs["jolt-exec"])} />
<p data-stage-bridge="lookup-sumcheck" className="text-sm leading-7 text-muted-foreground">명령의 7과 메모리의 29가 맡는 역할을 구분했습니다. 코드의 원문 연산에 사례를 넣습니다.</p>
</section>
<section id="source" data-teach-level="5" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">8. 코드에서 입력 마스크와 되돌아오는 덧셈을 확인합니다</h2>
<p className="leading-8">crates/jolt-lookup-tables의 ADD 구현에서 to_instruction_inputs는 두 레지스터 값을 마스크와 AND합니다. to_lookup_output은x.wrapping_add(y as u64) &amp; mask를 반환합니다. XLEN=64와 입력 3,4에서는 두 마스크 후 값이 그대로이고 결과 7입니다.</p>
<p className="leading-8">같은 파일의 to_lookup_operands는 0과 u128 합을 반환합니다. 첫 성분 0을 레지스터 0을 읽는 주소라고 해석하면 안 됩니다. 이 함수가 만드는 것은 lookup 검사의 입력 표현이며 실제 레지스터 주소는 별도 기록에서 연결합니다.</p>
<p className="leading-8">이 글의 소스 스냅샷은 47130f3dc9a51a7ac2754a98ff0aa31981a6b810입니다. 원본 파일 전체를 보관하고 아래 버튼에서 함수와 실제 줄 번호를 열 수 있습니다. 여기서 수행한 것은 소스와 수치의 대조이며 이 머신에서 Jolt 전체 증명기를 실행한 벤치마크는 아닙니다.</p>
<CodeViewButton label="ADD lookup · 8–30행" onClick={() => sidebar.open("jolt-lookup", codeRefs["jolt-lookup"])} /><div id="paper-jolt-source"><CitationBlock source="a16z/jolt · ADD LookupQuery, commit47130f3" citeKey={1} href="https://github.com/a16z/jolt/blob/47130f3dc9a51a7ac2754a98ff0aa31981a6b810/crates/jolt-lookup-tables/src/instructions/riscv/add.rs"><p className="leading-8">원문: <q>x.wrapping_add(y as u64) &amp; mask</q></p><p className="leading-8">x=3,y=4,XLEN=64이면 결과는 7입니다. 주소·메모리 일관성은 이 함수 하나로 검증되지 않습니다.</p></CitationBlock></div>
<p data-stage-bridge="source" className="text-sm leading-7 text-muted-foreground">입력 표현과 실행 결과가 코드에서 같은 7로 연결됐습니다. 다음에는 메모리와 공개값의 결속을 봅니다.</p>
</section>
<section id="artifact" data-teach-level="6" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">9. 읽기·쓰기 식과 공개 출력이 같은 증거에 묶입니다</h2>
<p className="leading-8">고정한 memory_checking.rs의 read_write_checking_input은 rd+γ·rs1+γ²·rs2를 만듭니다. 사례에서 γ=2이면 29입니다. 출력 쪽은 목적 주소의 이전 값과 변화량, 두 읽기 주소가 고른 값을 시간 선택과 함께 더합니다. 네 칸의 one-hot 예에서는 7+6+16으로 같은 29가 나옵니다.</p>
<p className="leading-8">실제 sumcheck는 모든 칸을 이런 방식으로 직접 공개하지 않고 다항식을 임의 점에서 평가합니다. 임의 점에서 one-hot의 연장값은 0이나 1이 아닐 수 있습니다. 정수 주소의 선택 그림을 그 점의 값과 혼동하지 않도록 원래 격자에서의 제약과 최종 opening을 함께 확인합니다.</p>
<p className="leading-8">verifier의 absorb_transcript_preamble은 준비 자료 digest와 inputs, outputs, trace_length 등을 해시에 흡수합니다. 공개 출력의 바이트를 7에서 8로 바꾸면 입력 기록도 달라집니다. 같은 질문과 검증 경로를 재사용할 수 없는 이유입니다. 애플리케이션도 확인하려던 프로그램과 공개값을 정확히 넘겨야 합니다.</p>
<CodeViewButton label="Twist 읽기·쓰기 식 · 36–54행" onClick={() => sidebar.open("jolt-memory", codeRefs["jolt-memory"])} /><CodeViewButton label="공개 입출력 흡수 · 916–949행" onClick={() => sidebar.open("jolt-transcript", codeRefs["jolt-transcript"])} /><div id="source-jolt-memory"><CitationBlock source="a16z/jolt · read_write_checking_input, commit47130f3" citeKey={1} href="https://github.com/a16z/jolt/blob/47130f3dc9a51a7ac2754a98ff0aa31981a6b810/crates/jolt-claims/src/twist/memory_checking.rs"><p className="leading-8">원문: <q>rd + γ·rs1 + γ²·rs2</q></p><p className="leading-8">rd=7,rs1=3,rs2=4,γ=2이면 29이며 올바른 주소 선택과 변화량으로 구성한 출력도 29입니다.</p></CitationBlock></div><div id="paper-twist-shout"><CitationBlock source="Twist and Shout: Faster memory checking arguments via one-hot addressing and increments" citeKey={2} href="https://eprint.iacr.org/2025/105.pdf"><p className="leading-8"><strong>문제:</strong> 메모리 읽기·쓰기 증명의 생성 비용을 줄입니다.</p><p className="leading-8"><strong>기여:</strong> one-hot 주소와 변화량을 사용해 읽기 전용·읽기 쓰기 검사를 구성합니다.</p><p className="leading-8"><strong>전제:</strong> 주소의 유효성, 다항식 검사와 commitment 가정을 사용합니다.</p><p className="leading-8"><strong>근거 범위:</strong> 2025-02-27 개정 논문과 그 비용 분석입니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 논문에서 보고한 배수를 현재 모든 Jolt 실행의 실측 속도로 해석하지 않습니다.</p></CitationBlock></div>
<p data-stage-bridge="artifact" className="text-sm leading-7 text-muted-foreground">명령·메모리·공개 입출력의 연결을 소스에서 확인했습니다. 마지막으로 보장과 성능의 범위를 정합니다.</p>
</section>
<section id="release" data-teach-level="7" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">10. 올바른 7의 증명과 원하는 프로그램의 증명을 구분합니다</h2>
<p className="leading-8">ADD 계산 하나가 7인 것만으로 전체 프로그램이 맞는 것은 아닙니다. 명령 위치와 코드, 초기 메모리, 읽기·쓰기 순서, 공개 입출력, 사용한 명령 집합을 함께 묶어야 합니다. 결과를 8로 바꾸는 경우와 주소를 바꾸는 경우는 서로 다른 실패 검사입니다.</p>
<p className="leading-8">현재 소스의 기능 분기와 증명 구성은 버전별로 달라집니다. 어떤 commitment와 영지식 설정을 썼는지 확인해야 합니다. zkVM이라는 이름만으로 모든 구성이 비밀을 숨기거나 양자 내성을 가진다고 말할 수는 없습니다.</p>
<p className="leading-8">성능은 프로그램·입력·실행 길이·명령 집합·보안 매개변수·하드웨어를 같게 놓고 측정해야 합니다. 소스의 빠른 산술 함수 하나에서 전체 증명 시간을 추정할 수는 없습니다. <a href="/cs/crypto/prover-memory-and-verifier-cost">증명기 메모리와 검증 비용</a>은 같은 작업을 다른 단위로 계산하는 방법을 이어 설명합니다.</p>
<div id="paper-jolt"><CitationBlock source="Jolt: SNARKs for Virtual Machines via Lookups" citeKey={2} href="https://eprint.iacr.org/2023/1217.pdf"><p className="leading-8"><strong>문제:</strong> VM 명령 검사의 반복 비용을 줄이는 문제입니다.</p><p className="leading-8"><strong>기여:</strong> 명령의 계산을 lookup 구조로 연결합니다.</p><p className="leading-8"><strong>전제:</strong> 논문의 명령표·lookup·commitment 가정을 사용합니다.</p><p className="leading-8"><strong>근거 범위:</strong> 2023 논문의 구성과 비용 설계입니다.</p><p className="leading-8"><strong>일반화할 수 없는 결론:</strong> 이후 Twist/Shout 및 RV64 구현을 모두 그대로 기술한 논문은 아닙니다.</p></CitationBlock></div>
<p data-stage-bridge="release" className="text-sm leading-7 text-muted-foreground">3+4=7의 실행에서 전체 공개 주장의 검증까지 연결했습니다.</p>
<ReviewPrompts questions={["3과 4의 덧셈 결과 7을 8로 바꾸는 것과 다른 주소에 7을 쓰는 것은 어떤 검사를 요구하나요? (답: 10절)", "γ=2에서 세 레지스터 값의 결합 29는 어떻게 나오나요? (답: 9절)", "공개 출력 바이트를 7에서 8로 바꾸면 어느 실제 함수의 입력이 바뀌나요? (답: 9절)"]} />
</section>
</article><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={{ jolt: fileTree }} projectMetas={{ jolt: { id: "jolt", label: "a16z/jolt · 47130f3", badgeClass: "border-primary text-primary" } }} /></>; }
