import { CitationBlock } from "@/components/ui/citation-block";
export default function Comparison(){return <section id="comparison" data-teach-level="7" className="space-y-6 [&_p]:leading-8">
<h2 className="text-2xl font-bold">10. 자원 비용만으로 안전성과 속도를 함께 결론내릴 수 없습니다</h2>
<p>10·20·30·40은 계산 자원일 때와 묶인 자원일 때 각각 다른 공격 비용을 뜻합니다. 계산 자원에는 장비와 에너지 가격, 전파 지연이 영향을 줍니다. 묶인 자원에는 지분 집중과 키 보관 방식, 함께 사용하는 클라이언트의 오류가 영향을 줍니다. 같은 숫자 비율이라고 장애나 공격의 결과가 같지는 않습니다.</p>
<p>PoW에서 X 뒤에 증거가 더 쌓이는 경우에는 가정한 공격자가 이를 따라잡을 위험을 봅니다. PoS의 충분한 표로 확정하는 경우에는 어떤 서명이 모순되는 확정을 가능하게 하는지와 그 위반에 책임을 물을 수 있는지 봅니다. 잠시 head가 바뀌는 사건과 이미 확정한 기록이 서로 충돌하는 사건을 한 실패로 합치면 안전성을 잘못 평가합니다.</p>
<dl className="space-y-5"><div><dt className="font-semibold">내용 검사</dt><dd className="mt-2 leading-7">두 방식 모두 100−10=90을 독립적으로 확인합니다. 자원이 큰 참여자도 잔액 120이라는 거짓 기록을 유효하게 만들 수 없습니다.</dd></div><div><dt className="font-semibold">현재 선택</dt><dd className="mt-2 leading-7">PoW의 누적 작업량과 PoS 프로토콜별 지분 투표 규칙은 유효한 경쟁 가지 중 head를 고릅니다.</dd></div><div><dt className="font-semibold">확정 근거</dt><dd className="mt-2 leading-7">추가 작업으로 낮아지는 재조직 위험과 체크포인트 사이의 충분한 표를 구분합니다. 이름이 같은 확정이라도 전제는 다릅니다.</dd></div></dl>
<p>처리량은 명령 실행 비용, 게시할 데이터, 블록 크기, 장비와 네트워크가 함께 만듭니다. 서로 다른 체인의 초당 거래 수를 그대로 PoW 대 PoS의 고정 성능표로 쓰지 않습니다. 위의 0.16초는 작은 계산 모형의 평균일 뿐입니다.</p>
<h3 className="text-xl font-semibold">같은 송금과 같은 장애에서 비교합니다</h3>
<p>후보 프로토콜을 비교할 때 거래 종류와 수, 참여자 배치, 프로그램 버전과 설정을 맞춥니다. 네트워크가 나뉜 상황, 늦은 X와 Y, 서로 모순된 투표, D의 중단과 재시작을 각각 넣어 봅니다. 그 뒤 서로 다른 확정 기록이 생겼는지, head가 얼마나 되돌아갔는지, 정상 통신 뒤 얼마나 빨리 복구되는지 기록합니다. 이 글은 그러한 장애 실험을 실행한 측정 보고서가 아닙니다.</p>
<p>공유한 키를 훔친 공격자, 한 회사에 집중된 자원, 같은 소프트웨어 버그를 가진 참여자가 많다는 상황도 포함해야 합니다. 이름의 분산만 보고 실제 통제권이 분산됐다고 결론내릴 수 없습니다. 소프트웨어를 교체한 뒤에도 같은 유효성·확정 조건을 지키는지 먼저 확인하고 그 다음 비용과 속도를 비교합니다.</p>
<div id="paper-eip-3675"><CitationBlock source="EIP-3675 · Upgrade consensus to Proof-of-Stake" citeKey={4} href="https://eips.ethereum.org/EIPS/eip-3675"><p>Ethereum 실행 계층을 Beacon Chain의 합의와 연결한 실제 전환 규격입니다. 마지막 작업 증명 블록 이후의 유효성·가지 선택 경계를 정합니다. 두 방식 전체를 동일 환경에서 성능 측정한 보고서는 아닙니다.</p></CitationBlock></div>
<ul className="list-disc space-y-3 pl-6"><li>A가 이름을 100개로 늘리면 계산 몫 10%도 커질까요? (답: 8절)</li><li>합계 지분 100 중 유효한 대상 투표가 60이면 2/3 판정을 통과할까요? 70이면 곧바로 모든 블록이 확정될까요? (답: 9절)</li><li>D의 작업량이나 지분이 커지면 잔액 100을 120으로 바꾼 후보도 유효해질까요? (답: 10절)</li></ul>
</section>}
