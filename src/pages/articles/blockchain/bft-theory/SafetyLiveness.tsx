import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import SafetyLivenessViz from "./viz/SafetyLivenessViz";
export default function SafetyLiveness(){return <div className="space-y-12 [&_section]:space-y-5 [&_p]:leading-8">
<section id="timing-source" data-teach-level="6"><h2 className="text-2xl font-bold">9. 통신이 늦어져도 안전성 조건은 지워지지 않습니다</h2>
<p>A·B와 C·D 사이의 메시지가 오래 막혔다고 놓습니다. A·B만으로는 필요한 세 표를 모을 수 없습니다. 이때 새 주문이 확정되지 않는 것과 서로 다른 주문 상태가 동시에 확정되는 것은 다른 사건입니다. 첫 번째를 피하려고 두 표만으로 확정하면 3절의 반례를 다시 만들 수 있습니다.</p>
<CitationBlock source="Dwork–Lynch–Stockmeyer (1988), §1.2, p.290" citeKey={2} href="https://groups.csail.mit.edu/tds/papers/Lynch/jacm88.pdf"><p>원문 안전 조건은 “no two correct processors should ever reach disagreement”입니다. 같은 페이지는 메시지 지연 조건이 결국 회복될 때 결정 종료를 요구하는 조건과 이를 구분합니다.</p></CitationBlock>
<p>이를 주문 7에 적용하면 A가 X를 확정한 뒤 C가 Y를 확정하는 일은 통신이 얼마나 늦었는지와 관계없이 금지됩니다. 반면 네트워크가 계속 끊겨 A·B·C가 서로 세 표를 모으지 못하면 진행을 보장할 시간 조건이 아직 성립하지 않은 것입니다. 안정화 시점은 검증자가 임의로 선언해 다른 사람의 과거 서명을 무시할 수 있는 값이 아닙니다.</p>
<AlgorithmBlock title="한 단계의 동의 묶음 검사 (의사코드)" input={["명단 {A,B,C,D}, 필요한 수 q=3 (가정)","기대한 문맥 = (프로토콜, 주문7, 진행차수, 단계, 후보X)","도착한 서명 메시지 목록"]} steps={[{code:"seen ← 빈 집합"},{code:"각 메시지 m의 정확한 바이트 인코딩과 서명을 검사한다"},{code:"발신자가 명단에 없거나 m의 문맥이 기대한 문맥과 다르면 거절한다"},{code:"seen에 이미 있는 발신자는 표 수에 다시 더하지 않는다"},{code:"검증한 발신자를 seen에 추가한다"},{code:"|seen| ≥ 3이면 해당 단계의 동의 근거를 반환한다"}]} output="검증된 서명자 집합. 이것만으로 어떤 단계에서나 최종 확정해도 된다는 뜻은 아닙니다." />
<p>입력이 A·B·D라면 크기는 3입니다. A의 표를 세 번 받아도 크기는 1입니다. 같은 D가 X와 Y에 서명하면 위반 증거로 보존하지만 D의 존재를 없었던 것으로 지우고 장애 허용 수를 임의로 다시 계산하지 않습니다.</p>
<p>이 단계에서 확인한 것은 올바른 동의 묶음입니다. 그 묶음이 잠금이나 확정에 어떤 영향을 미치는지는 선택한 프로토콜의 상태 전이 규칙으로 이어집니다.</p></section>
<section id="safety-liveness" data-teach-level="7"><h2 className="text-2xl font-bold">10. 대표를 바꿀 때도 이전 결정 근거를 이어받습니다</h2>
<p>현재 대표 D가 침묵하면 A·B·C는 기다린 시간이 지났다는 메시지를 모아 새 진행 차수로 넘어갈 수 있습니다. 그때 이전에 확보한 동의 근거와 각자의 잠금을 함께 보냅니다. 새 대표가 이 정보를 무시하고 아무 후보나 다시 제안하면 같은 세 표 규칙을 써도 과거 결정과 충돌할 수 있습니다.</p>
<SafetyLivenessViz />
<p>잠금은 그 값에 영원히 갇힌다는 뜻이 아닙니다. 더 높은 차수의 어떤 증거가 있으면 다른 후보를 받아들일 수 있는지 각 프로토콜이 정합니다. 너무 쉽게 풀면 안전성이 깨지고 절대로 풀지 않으면 진행을 회복하지 못할 수 있습니다. 안전성과 진행을 모두 증명하려면 이 전환 규칙까지 검토해야 합니다.</p>
<div id="paper-byzantine-generals"><CitationBlock source="The Byzantine Generals Problem, §2·§4" citeKey={1} href="https://www.microsoft.com/en-us/research/wp-content/uploads/2016/12/The-Byzantine-Generals-Problem.pdf"><p>원 논문은 말로 전하는 메시지와 위조할 수 없는 서명을 구분합니다. 서명과 동기 시간 가정을 바꾸면 견딜 수 있는 장애의 수가 달라집니다. 이 글의 부분 동기·고정 명단 설정에서 얻은 3f+1을 모든 서명 기반 합의의 보편적인 하한으로 읽지 않습니다.</p></CitationBlock></div>
<div id="paper-pbft"><p><Link to="/cs/blockchain/pbft-deep">PBFT의 실제 단계와 대표 교체</Link>에서는 제안·준비·확정 메시지가 서로 다른 증거를 만드는 과정을 구체적으로 다룹니다. <a href="https://pmg.csail.mit.edu/papers/osdi99.pdf" className="underline">Practical Byzantine Fault Tolerance 원문</a>은 그 알고리즘과 당시 구현 실험의 출처입니다. 해당 서버의 원문은 이번 재접속에서 열리지 않아 여기의 새 원문 인용은 위 DLS·Byzantine Generals 자료에서 확인했습니다.</p></div>
<div id="paper-hotstuff"><p><Link to="/cs/blockchain/hotstuff-deep">HotStuff의 연속된 동의 근거</Link>는 다른 단계 구성으로 같은 안전성 질문을 풉니다. <a href="https://arxiv.org/abs/1803.05069" className="underline">HotStuff 논문</a>의 통신량과 반응성 주장은 해당 모델과 단계 규칙 안에서 읽어야 합니다. 서명 세 개라는 숫자만 보고 PBFT와 같은 시점에 확정한다고 취급하지 않습니다.</p></div>
<p>구현을 검사할 때에는 D의 모순된 제안, 표 누락, 늦게 도착한 근거, 네트워크 분리, 동시에 끝난 대기 시간, 재시작 뒤 오래된 메시지를 넣어 봅니다. 주문 7에서 모순된 두 확정이 없었는지 먼저 확인합니다. 진행 시간은 통신이 회복된 뒤부터 따로 측정하며 어떤 장애를 넣었는지 함께 남깁니다. 이 글은 실제 장애 주입 실험의 성공 보고가 아닙니다.</p>
<ul className="list-disc space-y-3 pl-6"><li>네 명 중 한 명이 악의적일 때 두 표만 요구하면 X와 Y를 동시에 통과시킬 수 있을까요? (답: 3절)</li><li>세 표씩 모인 두 집합은 최소 몇 명이 겹치며 그중 정직한 사람은 왜 남을까요? (답: 8절)</li><li>대표의 응답이 늦어졌다는 이유로 이전 잠금을 모두 지워도 될까요? (답: 10절)</li></ul>
</section></div>}
