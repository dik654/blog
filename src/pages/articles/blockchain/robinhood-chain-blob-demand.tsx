import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import FlowRail from "../world-systems/FlowRail";
import SourceApplication from "../world-systems/SourceApplication";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import { codeRefs } from "./robinhood-chain-blob-demand/codeRefs";
export default function RobinhoodChainBlobDemandArticle(){
 const sidebar=useCodeSidebar();
 return <><article className="space-y-14">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">1. 블롭 수요에서 가격 압력과 특정 체인의 기여를 구분한다</h2>
<p>롤업이 거래 자료를 Ethereum에 올리면 다른 롤업과 같은 저장 공간을 나누어 씁니다. 어느 체인의 사용자가 늘어도 처리 요청 수와 게시 데이터의 크기는 압축·묶음 주기에 따라 다르게 변합니다. 수요를 읽으려면 실제 게시한 자료와 그때의 공급 설정을 함께 봐야 합니다.</p>
<p>Robinhood Chain 공식 문서는 2026-10-04 현재 메인넷과 Ethereum blobs 사용을 명시합니다. 이 사실만으로 최근 Ethereum 전체 사용량 증가의 원인을 Robinhood로 정할 수는 없습니다. 이 글은 네 블록의 작은 가정 사례로 필요한 회계를 설명합니다.</p>
<p data-stage-bridge="overview" className="text-sm text-muted-foreground">전체 사용량과 원인을 따로 확인한다는 목표를 세웠습니다. 먼저 누가 어떤 수를 만드는지 나눕니다.</p></section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">2. 게시하는 곳, 담는 곳, 합계를 읽는 곳</h2>
<p>롤업은 거래 여러 개를 묶어 데이터를 게시합니다. 블록을 만드는 참여자는 허용량과 비용 조건 안에서 게시 요청을 담습니다. 분석자는 블록별 양을 합하고 게시자를 분류합니다. 마지막 분석이 앞 두 단계의 실제 거래를 재현할 수 있어야 원인까지 말할 수 있습니다.</p>
<FlowRail title="자료가 게시되고 집계되는 역할" steps={[{actor:"얼마를 게시하나",movement:"거래를 묶어 데이터를 올립니다.",receives:"게시 요청"},{actor:"얼마를 담았나",movement:"허용량 안에서 블록을 만듭니다.",receives:"블록별 개수"},{actor:"누구의 자료인가",movement:"같은 기간의 게시자를 분류합니다.",receives:"전체와 기여분"}]} />
<p data-stage-bridge="black-box" className="text-sm text-muted-foreground">자료 게시와 집계의 역할에 네 블록을 넣어 봅니다.</p></section>
<section id="case" data-teach-level="0" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">3. 18개가 들어간 블록과 평균 10개는 동시에 성립한다</h2>
<p>연속 네 블록에 18·10·6·6개의 blob이 들어갔다고 합시다. 총 40개를 4로 나누면 평균 10개입니다. 해당 기간 목표량 14개, 최대량 21개를 적용하면 첫 18개는 목표를 넘지만 허용 최대에는 못 미칩니다. 블록별 사용량은 모두 (가정)이며 실제 관측값과 구분합니다.</p>
<p>같은 네 블록 중 특정 롤업 A가 14·2·2·2개를 게시했다면 A의 총 20개는 전체 40개의 50%입니다. 이 분류도 (가정)입니다. 첫 블록만 보면 14/18로 약 77.8%이므로 전체 기간의 50%와 다른 질문에 답합니다.</p>
<p data-stage-bridge="case" className="text-sm text-muted-foreground">피크 18, 평균 10, 기간 기여 50%가 서로 다른 수라는 것을 같은 그림으로 확인합니다.</p></section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">4. 네 블록을 같은 시간 창으로 묶는다</h2>
<p>각 블록의 전체 개수와 A의 개수를 같은 행에 둡니다. A와 나머지를 더한 값이 전체와 같아야 하며, 네 행을 합친 분모 40을 유지해야 합니다. 한 블록의 비율과 네 블록 합계의 비율을 섞으면 기여가 과장됩니다.</p>
<div className="overflow-x-auto"><table className="w-full min-w-[480px] text-sm"><caption className="mb-3 text-left">(가정) 전체 40개 중 A20개, 목표는 블록당 14</caption><thead><tr><th className="p-3 text-left">블록</th><th className="p-3">전체</th><th className="p-3">A</th><th className="p-3">나머지</th></tr></thead><tbody>{[[1,18,14,4],[2,10,2,8],[3,6,2,4],[4,6,2,4]].map(row=><tr key={row[0]} className="border-t">{row.map((n,j)=><td key={j} className="p-3 text-center">{n}</td>)}</tr>)}</tbody></table></div>
<p data-stage-bridge="picture" className="text-sm text-muted-foreground">개수와 분모가 보였습니다. 이제 순간 최고치가 왜 지속적인 부족을 뜻하지 않는지 살펴봅니다.</p></section>
<section id="need" data-teach-level="2" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">5. 많이 사용한 순간만으로 공급 부족을 판단할 수 없다</h2>
<p>18개가 든 뒤 10개가 든 블록에서는 목표보다 4개 적게 사용합니다. 일반적인 목표 차감 계산에서는 앞 블록의 초과 4개가 뒤 블록의 부족 4개로 상쇄됩니다. 네 블록의 평균 10은 목표 14보다 낮으므로 이 사례를 지속적인 초과 사용이라고 설명할 수 없습니다. 실제 비용이 떨어지는지는 실행 비용에 연동된 하한 조건까지 봐야 합니다.</p>
<p>특정 롤업의 거래 수가 늘어도 압축이 좋아지거나 자료를 더 오래 모으면 blob 사용량은 같은 비율로 늘지 않습니다. 주소 이름표가 틀리거나 게시자를 다른 체인과 함께 쓰는 경우도 있어, 브랜드 이름과 전체 그래프만으로 50% 기여를 확인할 수 없습니다.</p>
<p data-stage-bridge="need" className="text-sm text-muted-foreground">숫자마다 답하는 질문이 생겼으니 분석에 쓰는 이름을 붙입니다.</p></section>
<section id="target-vs-average" data-teach-level="3" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">6. 목표·상한·평균·초과분에 이름을 붙인다</h2>
<p>Target은 비용 조정이 기준으로 삼는 목표량, max는 한 블록에 담을 수 있는 상한입니다. 평균은 특정 기간의 실제 사용 합계를 블록 수로 나눈 값입니다. 목표 14와 상한 21은 프로토콜 설정이고 평균 10은 이 글이 가정한 사용 결과입니다.</p>
<p>Excess blob gas는 앞선 사용이 목표보다 많았던 부담을 다음 블록으로 넘기는 상태입니다. 실제 단위는 gas지만 각 blob의 gas가 같으므로 여기서는 blob 개수에 해당하는 단위로 환산해 봅니다. 정확한 정수 가격 계산은 기존 EIP-4844 정본을 사용합니다.</p>
<p>BPO는 blob 관련 파라미터만 별도 일정으로 바꾸는 포크입니다. Sparse blobpool은 아직 블록에 들지 않은 자료를 모든 노드가 전부 받는 비용을 줄이려는 네트워크 제안입니다. 공급 숫자를 정하는 작업과 전송 방식을 바꾸는 작업은 구별됩니다.</p>
<p><Link className="underline" to="/cs/blockchain/eip4844-blob-fee">초과 blob gas와 실제 비용 함수</Link>에서 가격 계산을 이어 읽을 수 있습니다.</p>
<p data-stage-bridge="target-vs-average" className="text-sm text-muted-foreground">용어를 알았으니 18·10·6·6이 초과분과 분석 결과를 어떻게 바꾸는지 추적합니다.</p></section>
<section id="robinhood-chain-concentration" data-teach-level="4" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">7. 같은 블록 범위에서 사용량과 게시자를 다시 계산한다</h2>
<p>시작 초과분을 0으로 두고 실행 비용에 연동된 하한 분기가 작동하지 않는다고 가정합니다. 18개 블록 뒤 초과분은 max(0,0+18−14)=4입니다. 이어 10개 뒤에는 max(0,4+10−14)=0, 이후 6개와 6개 뒤에도 0입니다. 이는 초과량의 교육용 환산 계산입니다. 실제 blob 최소가격은 gas 단위 정수 함수와 활성 포크의 update fraction으로 계산하므로 4를 곧바로 가격 4배라고 읽지 않습니다.</p>
<p>EIP-7918은 실행 base fee에 비해 blob 가격이 낮으면 다른 증가식을 적용합니다. 같은 첫 18개에 그 조건이 성립하면 환산 초과분은 18×(21−14)/21=6입니다. 따라서 사용량 18·10·6·6만으로 실제 초과분 경로를 확정할 수 없습니다. 부모 블록의 실행·blob base fee와 활성 규칙도 필요합니다.</p>
<CitationBlock source="EIP-7918 · Blob base fee bounded by execution cost" citeKey={6} href="https://eips.ethereum.org/EIPS/eip-7918">Final 원문의 calc_excess_blob_gas 분기를 대조했습니다. 일반 목표 차감 경로와 실행 비용에 연동된 하한 경로를 구분합니다.</CitationBlock>
<p>
            실제 연구에서는 체인 ID, 시작·끝 블록과 hash, timestamp, 재조직 처리 기준을 먼저 고정합니다. blob 거래의 versioned hash 수를 블록별로 합하고
            공식 배포 정보와 게시 주소·inbox 경로로 롤업을 분류합니다. 미분류 자료도 전체 분모에 남깁니다. A의 20과 나머지 20이 전체 40과 맞는지 확인한 뒤 비율을
            계산합니다.
          </p>
<p>Robinhood 공식 연결 문서는 mainnet 4663, testnet 46630을 구분하고 Ethereum blobs를 데이터 가용성 수단으로 명시합니다. 하지만 그 문서는 이 사례의 20개나 과거 3일 평균을 증명하지 않습니다. 예전 본문의 6.4 및 특정 체인이 증가를 만들었다는 서술은 재현 가능한 쿼리·블록 범위를 확보하지 못했으므로 관측값으로 유지하지 않습니다.</p>
<CitationBlock source="Robinhood Chain · Connecting" citeKey={1} href="https://docs.robinhood.com/chain/connecting/">2026-10-04 공식 네트워크와 DA 설명. 사용량 기여 비율의 관측 근거와 구분합니다.</CitationBlock>
<p data-stage-bridge="robinhood-chain-concentration" className="text-sm text-muted-foreground">네 블록의 계산과 실제 자료에 필요한 항목을 연결했습니다. 다음은 목표 14를 어떤 원문에서 읽는지 확인합니다.</p></section>
<section id="source" data-teach-level="5" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">8. 기본값이 아니라 메인넷 일정에 연결된 값을 읽는다</h2>
<p>go-ethereum commit c9a2bc73c847319a8faa57de59e42c0efc420682의 메인넷 설정은 BPO2 활성화 timestamp 1767747671과 BPO2 설정을 연결합니다. BPO2의 target 14·max 21·update fraction 11684671을 함께 읽습니다. 이 값의 유효 시점은 2026-01-07 01:01:11 UTC 이후이며 후속 활성화 여부도 계속 확인해야 합니다.</p>
<p>같은 파일에는 BPO3·BPO4 기본값도 있습니다. 이름이 코드에 존재한다는 사실과 MainnetChainConfig에서 해당 시각·설정을 연결했다는 사실은 다릅니다. 이 snapshot에는 메인넷 BPO3 활성화가 연결돼 있지 않습니다.</p>
<SourceApplication source="go-ethereum · DefaultBPO2BlobConfig" excerpt="Target:         14," application="18개는 14보다 4 크고 21보다 3 작습니다. 평균 10은 이 설정과 별도로 집계한 결과이므로 목표를 실제 사용량이라고 바꾸어 읽지 않습니다. 원본에는 각 필드가 별도 행에 놓입니다." />
<div className="flex flex-wrap gap-3"><CodeViewButton label="메인넷 일정과 설정 연결" onClick={()=>sidebar.open("mainnet",codeRefs.mainnet)}/><CodeViewButton label="BPO2·3·4 기본값 비교" onClick={()=>sidebar.open("params",codeRefs.params)}/></div>
<CitationBlock source="go-ethereum · pinned c9a2bc7 config.go" citeKey={2} href="https://github.com/ethereum/go-ethereum/blob/c9a2bc73c847319a8faa57de59e42c0efc420682/params/config.go">정확한 commit과 원본 파일을 보존했습니다. 클라이언트 설정은 사용량 측정의 대체물이 아닙니다.</CitationBlock>
<CitationBlock source="EIP-7892 · BPO" citeKey={3} href="https://eips.ethereum.org/EIPS/eip-7892">BPO 메커니즘. EIP의 예시 timestamp는 실제 메인넷 일정으로 쓰지 않습니다.</CitationBlock>
<p data-stage-bridge="source" className="text-sm text-muted-foreground">실제 설정과 활성화 조건을 확인했습니다. 같은 18개를 노드가 받는 비용은 어떻게 줄이려는지 비교합니다.</p></section>
<section id="bpo-sparse-blobpool" data-teach-level="6" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">9. 목표 상향과 전송 절감은 서로 다른 계산이다</h2>
<p>EIP-8070은 2026-10-04 Review 상태입니다. Glamsterdam의 meta EIP에서는 별도 Networking 목록에 있고 메인넷 적용 시각은 확정돼 있지 않습니다. 이 제안은 블록에 들어가기 전 자료를 모두 복제하던 부담을 일부 전체 제공자와 샘플을 받는 노드로 나눕니다.</p>
<p>제안의 단순 모델에서 15% 확률로 전체를 받고 나머지 85%에서는 1/8을 받으면 평균은 0.15+0.85/8=0.25625입니다. 같은 18개 분량을 전체 수신 18 단위로 놓으면 평균 4.6125 단위입니다. 이는 확률적 payload 모델의 약 74.4% 감소이며, 개별 노드가 매번 그 양만 받거나 실제 전체 대역폭이 정확히 그만큼 감소한다는 측정 결과가 아닙니다.</p>
<p>전체 제공자가 부족하거나 이웃 선택이 편향되면 자료를 얻는 가정이 깨집니다. 추가 표본·재요청·메시지·증명과 공격 방어 비용도 있습니다. BPO로max를 높여도 이 전송 최적화가 저절로 생기지 않고, 전송이 줄어도 target 상향 일정이 자동으로 결정되지는 않습니다.</p>
<SourceApplication source="EIP-8070 · Abstract" excerpt="0.15 + 0.85/8 ~ 0.25" application="가정한 18개 분량에 0.25625를 곱해 4.6125를 얻습니다. 제안 모델의 평균 전송량이며 네 블록의 사용 개수 18·10·6·6 자체나 target14를 줄이는 식은 아닙니다." />
<CitationBlock source="EIP-8070 · Sparse Blobpool" citeKey={4} href="https://eips.ethereum.org/EIPS/eip-8070">Review 상태·전체 제공 확률·custody 표본·공격 가정의 원문입니다.</CitationBlock>
<CitationBlock source="EIP-7773 · Glamsterdam meta" citeKey={5} href="https://eips.ethereum.org/EIPS/eip-7773">2026-10-04 Networking 목록과 메인넷 activation 미정 상태를 확인했습니다.</CitationBlock>
<p data-stage-bridge="bpo-sparse-blobpool" className="text-sm text-muted-foreground">18개 게시와 18개 분량의 전송 비용을 나눴습니다. 마지막으로 성장률과 시장 해석의 한계를 확인합니다.</p></section>
<section id="reading-checklist" data-teach-level="7" className="scroll-mt-20 space-y-5"><h2 className="text-2xl font-bold">10. 측정한 범위보다 큰 결론을 내리지 않는다</h2>
<p>평균을 올린 체인이 확인돼도 그 수요가 유료 사용자·경제적 거래·지속 가능한 수익에서 나왔는지는 추가 자료가 필요합니다. 작은blob을 자주 올리는 방식과 충분히 채운blob을 드물게 올리는 방식도 개수만으로 같다고 평가할 수 없습니다.</p>
<p>시작 평균 5에서 다섯 달 뒤 10이 됐다고 가정하면 월평균 복리 변화는 2의 5제곱근−1, 약 14.9%입니다. 이것은 가정한 두 끝점의 환산값입니다. 중간 변동이나 다음 다섯 달의 수요를 예측하지 않습니다.</p>
<p>실제 사용량·활성 공급 설정·게시자 분류·측정 기간을 함께 제시해야 기여와 가격 압력을 검증할 수 있습니다. 본문 네 블록은 그 검증법을 익히는 예제이며 특정 날짜의 시장 기록을 대신하지 않습니다.</p>
<div id="growth-rate" className="scroll-mt-20"><p>성장률은 같은 정의와 시간 간격의 두 집계값에만 적용합니다. 날짜별 원자료가 없으면 14.9%도 관측 결과로 인용하지 않습니다.</p></div>
<p data-stage-bridge="reading-checklist" className="text-sm text-muted-foreground">피크·평균·기여를 같은 원자료에 묶어야 수요 변화와 일시적 변동을 구분할 수 있습니다.</p>
<ReviewPrompts questions={["18·10·6·6의 평균은 얼마이며, 첫 블록 뒤 초과분4에는 어떤 하한 조건이 붙나요? (답: 3절·7절)","A가 14·2·2·2개를 올렸을 때 첫 블록의 비율과 기간 전체 비율이 다른 이유는 무엇인가요? (답: 3절·4절)"]}/>
</section>
</article><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={{}} projectMetas={{"go-ethereum":{id:"go-ethereum",label:"go-ethereum · c9a2bc7",badgeClass:"border-sky-500 bg-sky-500/10 text-sky-700"}}}/></>;
}
