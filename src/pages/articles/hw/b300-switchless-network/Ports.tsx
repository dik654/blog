import {
  B300_PORT_MAP,
  B300_SWITCHLESS_SOURCE_LINKS,
} from "@/content/b300-switchless-network";
import { CitationBlock } from "@/components/ui/citation";

export default function Ports() {
  return (
    <section id="ports" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        8 OSFP를 16개의 400GbE/RDMA path로 본다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          DGX B300에는 cluster network용 ConnectX-8 OSFP port가 8개 있고 공식 split configuration을 적용하면 각 800G physical
          module이 두 400GbE logical port와 두 RDMA device로 나타난다. BlueField-3는 별도의 storage·management path다. 이
          compute-fabric mapping에는 섞지 않는다.
        </p>
        <div id="paper-dgx-b300-ports" className="scroll-mt-24">
          <p className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
            <strong className="text-foreground">공식 문서의 핵심:</strong>{" "}
            DGX B300은 compute fabric용 ConnectX-8 800Gb/s OSFP port 여덟 개와
            별도의 BlueField-3 DPU 경로를 제공한다. 여기서 800G는 physical
            port capability이고, split 뒤 OS가 보게 되는 endpoint 수와 같은
            숫자가 아니다.
          </p>
        </div>
        <div
          data-viz="b300-port-identity-ledger"
          className="not-prose my-6 overflow-hidden rounded-lg border border-border/70"
        >
          <div className="hidden grid-cols-[7rem_1fr_1fr] gap-4 border-b bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>physical label</span>
            <span>PCI functions</span>
            <span>RDMA devices</span>
          </div>
          <div className="divide-y divide-border/70">
            {B300_PORT_MAP.map((port) => (
              <article
                key={port.osfp}
                className="grid min-w-0 gap-3 px-4 py-4 md:grid-cols-[7rem_1fr_1fr] md:gap-4"
              >
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground md:hidden">physical label</span>
                  <p className="text-sm font-semibold">OSFP {port.osfp}</p>
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-muted-foreground md:hidden">PCI functions</span>
                  <p className="break-words font-mono text-sm">{port.pci}.0 / {port.pci}.1</p>
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-muted-foreground md:hidden">RDMA devices</span>
                  <p className="break-words font-mono text-sm text-muted-foreground">{port.rdma.join(" / ")}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className="leading-7">
          위 표의 BDF와 mlx5 번호는 프로젝트 장비에서 관측한 inventory다. netdev 이름과 device 번호는 udev·firmware·PCI enumeration에 따라
          달라질 수 있으므로 `eno6np0` 같은 이름을 다른 host에 그대로 복사하면 안 된다. 각 노드에서 OSFP label → PCI BDF → netdev → RDMA
          device를 `mst status -v`, `devlink`, `ibdev2netdev`로 다시 연결해 결과를 topology manifest에 저장한다.
        </p>

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          단순 LINK_TYPE 변경만으로 끝나지 않는다
        </h3>
        <pre className="overflow-x-auto text-xs">
          <code>{`# <device>는 먼저 조회한 ConnectX-8 PCI/MST device
mlxconfig -d <device> set LINK_TYPE_P1=2
mlxconfig -d <device> set NUM_OF_PLANES_P1=0
mlxconfig -d <device> set MODULE_SPLIT_M0[0..3]=1 \\
  MODULE_SPLIT_M0[4..7]=2 MODULE_SPLIT_M0[8..15]=FF
mlxconfig -d <device> set NUM_OF_PF=2
# cold power cycle 뒤 다시 inventory`}</code>
        </pre>
        <p className="leading-7">
          이는 NVIDIA DGX OS 가이드의 split 순서다. `mlxconfig reset`은 해당 device의 다른 설정도 되돌리므로 단순한 복구 명령처럼 실행하면 안 된다.
          Split 설정은 cold power cycle 뒤에 반영되므로 변경 전후 inventory dump와 되돌릴 값을 함께 보관한다.
        </p>
        <div id="paper-dgx-port-split" className="scroll-mt-24">
          <CitationBlock
            source={B300_SWITCHLESS_SOURCE_LINKS.split.label}
            citeKey={1}
            href={B300_SWITCHLESS_SOURCE_LINKS.split.href}
          >
            Port split은 LINK_TYPE 하나만 바꾸는 작업이 아니라 plane·module split
            mapping·PF 수를 함께 설정하고 cold power cycle 뒤 device inventory를
            다시 확인하는 절차다. 이 문서는 지원되는 구성 순서를 설명하지만
            임의의 cable·firmware 조합까지 인증하지는 않는다.
          </CitationBlock>
          <CitationBlock
            source={B300_SWITCHLESS_SOURCE_LINKS.dgx.label}
            citeKey={2}
            href={B300_SWITCHLESS_SOURCE_LINKS.dgx.href}
          >
            여덟 ConnectX-8 OSFP와 두 BlueField-3 DPU의 제품 경계를 확인하는
            정본이다. 본문의 BDF·mlx5 번호는 이 문서의 고정 보장이 아니라
            프로젝트 inventory에 귀속한다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
