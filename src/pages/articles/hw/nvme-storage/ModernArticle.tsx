import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { NvmeBoundaryViz, NvmePathViz } from "./viz/ModernNvmeViz";
const NVME="https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-Revision-2.4-Ratified-2026.07.31.pdf";
const E1S="https://members.snia.org/document/dl/26956";
export default function ModernArticle(){return <article className="space-y-14">
<section id="overview" className="space-y-6"><header className="space-y-3"><p className="text-sm font-semibold text-primary">M.2·U.2/U.3·E1.S를 고르는 순서</p><h2 className="text-3xl font-bold tracking-tight">NVMe protocol과 form factor는 서로 다른 계약이다</h2></header><p className="text-lg leading-8 text-foreground/90">
            “NVMe SSD”라는 이름만으로는 서버에 들어가는지 알 수 없습니다. 예제 24시간 작업은 8 TiB active data, 2 TiB scratch와 metadata
            random I/O를 함께 사용합니다. 먼저 protocol과 transport를 확인하고 controller에서 CPU root까지 lane budget을 그린 뒤 실제
            SKU의 power·airflow·hot-plug 조건을 검사합니다.
          </p><p>PCIe lane의 bit/byte 환산과 goodput은 <a href="/cs/gpu/gpu-interconnects#pcie-transaction-bandwidth-latency" className="text-primary hover:underline">PCIe 정본</a>을 재사용합니다. 여기서는 M.2, U.2/U.3, E1.S가 그 경로를 chassis 안에서 어떻게 구현하고 정비하게 하는지만 소유합니다.</p><NvmeBoundaryViz/><ContentBoundary article="hw-nvme-storage"/></section>
<section id="protocol-form-factor" className="space-y-6"><header><p className="text-sm font-semibold text-primary">01 · Protocol과 form factor</p><h2 className="mt-2 text-2xl font-bold">같은 NVMe command도 서로 다른 기구·connector에 실릴 수 있다</h2></header><p>
            NVMe Base Specification은 host software와 NVM subsystem 사이의 queue,
            command, completion과 controller semantics를 정의합니다. PCIe·TCP·RDMA
            같은 transport binding은 별도 규격입니다.
          </p><p>
            M.2는 작은 내부 module에 유리하지만 교체와 airflow 경로를 chassis가
            책임집니다. U.2/U.3와 EDSFF 계열은 전면 bay, hot-plug와 열 제거를
            통합하기 쉽습니다. 그래도 실제 지원 여부는 drive·backplane·firmware
            조합으로 확인해야 합니다.
          </p><div id="paper-nvme-base"><CitationBlock type="paper" citeKey={1} source="NVM Express Base Specification 2.4 · 2026-07-31" href={NVME}><p><strong>문제:</strong> Host가 다양한 transport 위의 NVM subsystem과 통신하는 공통 protocol을 정의합니다.</p><p><strong>핵심 기여:</strong> Controller, submission/completion queue, command·status의 protocol semantics를 transport와 구분합니다.</p><p><strong>중요 가정:</strong> Base 2.4와 실제 구현이 쓰는 command-set·transport revision을 함께 pin합니다.</p><p><strong>근거 범위:</strong> 2026-11-02 현재 NVMe protocol family의 current normative base semantics입니다.</p><p><strong>일반화 금지:</strong> NVMe 준수만으로 특정 form factor, latency, endurance나 hot-plug가 보장되지는 않습니다.</p></CitationBlock></div></section>
<section id="path-budget" className="space-y-6"><header><p className="text-sm font-semibold text-primary">02 · Lane과 shared path</p><h2 className="mt-2 text-2xl font-bold">Drive peak보다 controller에서 root까지 가장 좁은 구간을 본다</h2></header><NvmePathViz/><ExplainedFormula question="여러 NVMe drive의 aggregate throughput 상한은 어디에서 정해질까?" idea={<>각 I/O가 지나가는 device, negotiated link, backplane, switch uplink와 root의 실측 capacity 중 가장 작은 값을 취합니다.</>} formula={String.raw`B_{end\text{-}to\text{-}end}\le\min(B_{device},B_{link},B_{backplane},B_{switch},B_{root})`}
annotatedFormula={String.raw`B_{end\text{-}to\text{-}end}\le\underbrace{\min(B_{device},B_{link},B_{backplane},B_{switch},B_{root})}_{\text{경로 중 가장 좁은 구간}}`}
operations={[
          { expression: String.raw`\min(B_{device},B_{link},B_{backplane},B_{switch},B_{root})`, annotation: ["I/O 경로 각 구간의 실측 capacity 중", "가장 작은 값이 aggregate 상한", "x4 drive 4개가 x8 uplink 공유 → uplink"] },
        ]} terms={[{symbol:"B_{end-to-end}",name:"End-to-end goodput",description:"Application payload 기준 완료 byte/s입니다."},{symbol:"B_{device}",name:"Device 처리량",description:"고정 queue·block·read/write mix에서 drive가 지속한 값입니다."},{symbol:"B_{link}",name:"Negotiated link",description:"실제 generation·width와 protocol overhead를 반영한 값입니다."},{symbol:"B_{backplane}",name:"Backplane 경로",description:"Connector·retimer·cable이 허용하는 경로입니다."},{symbol:"B_{switch}",name:"Switch uplink",description:"여러 drive가 공유하는 uplink capacity입니다."},{symbol:"B_{root}",name:"Root 경로",description:"CPU root complex·NUMA memory로 이어지는 achieved capacity입니다."}]} assumptions={["같은 direction과 동시 workload phase를 비교합니다.","Peak 표기가 아니라 지속 workload의 실측값을 사용합니다."]} interpretation="4개 x4 drive가 x8 uplink를 공유하면 합계는 uplink를 넘지 못합니다. 이 상한은 작은 random I/O의 p99 latency를 말하지 않습니다."/></section>
<section id="thermal-serviceability" className="space-y-6"><header><p className="text-sm font-semibold text-primary">03 · Thermal·serviceability</p><h2 className="mt-2 text-2xl font-bold">두께와 bay는 airflow·surface area·교체 절차를 바꾼다</h2></header><p>
            Drive가 benchmark 초반에는 빠르다가 controller 온도나 NAND state 때문에
            throttle하면 그 peak는 운영값이 아닙니다. 실제 chassis의 inlet, fan
            curve, heatsink와 인접 slot 점유 상태에서 temperature·power·throughput을
            함께 기록합니다.
          </p><p>
            Hot-plug도 connector만의 특성이 아닙니다. OS namespace, LED/slot
            identity, backplane과 replacement runbook까지 이어져야 정비 가능한
            경로가 됩니다.
          </p><div id="paper-e1s"><CitationBlock type="paper" citeKey={2} source="SNIA SFF-TA-1006 Rev 2.0 · E1.S · 2025-12-19" href={E1S}><p><strong>문제:</strong> 1U system에서 쓰는 short device의 공통 mechanical attributes를 정의합니다.</p><p><strong>핵심 기여:</strong> E1.S의 multiple thickness와 host/device mechanical reference를 고정합니다.</p><p><strong>중요 가정:</strong> Rev 2.0과 정확한 thickness·connector·host 설계를 확인합니다.</p><p><strong>근거 범위:</strong> E1.S mechanical interoperability specification입니다.</p><p><strong>일반화 금지:</strong> 규격은 특정 부품의 공급, 성능·전력·endurance나 chassis airflow를 보장하지 않습니다.</p></CitationBlock></div></section>
<section id="release-gate" className="space-y-6"><header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">호환성 확인 뒤 steady state와 장애 경로를 재생한다</h2></header><p>Drive firmware, namespace/LBA format, slot·backplane·retimer·BIOS와 OS driver를 pin합니다.</p><ol className="list-decimal space-y-2 pl-5"><li>Secure erase 또는 규격에 맞는 초기 상태를 만듭니다.</li><li>목표 read/write·block·queue trace로 precondition합니다.</li><li>Steady state의 IOPS, GB/s, median/p99, 온도, 전력과 host error를 함께 측정합니다.</li><li>Hot-remove, surprise loss, full-drive, thermal soak와 재부팅을 재생합니다.</li></ol><p>데이터와 filesystem oracle이 모두 맞을 때만 채택합니다. 실패하면 firmware와 drive BOM을 이전 검증 세대로 되돌립니다.</p><ExplainedFormula question="Queue depth와 평균 latency가 처리량과 어떻게 연결될까?" idea={<>안정된 closed-loop에서 동시에 처리 중인 평균 I/O 수는 완료율과 평균 체류 시간의 곱이라는 Little의 법칙을 적용합니다.</>} formula={String.raw`N=\lambda W`}
annotatedFormula={String.raw`\underbrace{N}_{\text{평균 in-flight I/O}}=\underbrace{\lambda}_{\text{완료율(IOPS)}}\underbrace{W}_{\text{평균 체류 시간}}`}
operations={[
  { expression: String.raw`\lambda W`, annotation: ["안정된 closed loop에서 동시에 처리 중인","I/O 수 = 완료율 × 평균 latency","32 = 128k IOPS × 250µs"] },
]} terms={[{symbol:"N",name:"평균 in-flight I/O",description:"관찰 경계 안에서 동시에 대기·실행 중인 요청 수입니다."},{symbol:String.raw`\lambda`,name:"완료율",description:"초당 완료한 유효 I/O 수입니다."},{symbol:"W",name:"평균 latency",description:"Submit부터 completion까지 I/O 하나의 평균 초입니다."}]} assumptions={["Queue가 장기적으로 안정되고 같은 관찰 경계를 사용합니다.","평균 관계이며 p99나 burst를 직접 예측하지 않습니다."]} interpretation="평균 32개가 250µs 머물면 약 128k IOPS와 일치합니다. Queue를 더 늘린다고 device service rate가 자동으로 늘지는 않습니다."/></section>
</article>}
