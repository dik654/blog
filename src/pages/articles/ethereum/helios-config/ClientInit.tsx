import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import HeliosContractViz from "../helios-contract-viz";
import { codeRefsReal } from "./codeRefsReal";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ClientInit({ title, onCodeRef }: Props) {
  return (
    <section id="client-init" className="mb-16 scroll-mt-20">
      <h2 className="mb-3 text-2xl font-bold">{title}</h2>
      <p className="mb-6 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
        Port가 열렸다는 상태, consensus가 synced라는 상태, 검증된 block으로 대표 요청에 답했다는 상태를 따로 봅니다.
      </p>

      <HeliosContractViz mode="client-startup" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <strong>[O]</strong> <code>EthereumClientBuilder::build()</code>는 Config와 explicit builder 값을 합쳐
          <code>ConsensusClient</code>와 execution provider를 만듭니다. Native target에서 <code>rpc_address</code>가 있으면
          <code>HeliosClient::new()</code>가 JSON-RPC server task를 바로 spawn합니다. Consensus sync task도
          <code>ConsensusClient::new()</code>에서 시작됩니다.{" "}
          <CodeViewButton
            label="Builder와 JSON-RPC spawn"
            onClick={() => onCodeRef("helios-client-new", codeRefsReal["helios-client-new"])}
          />
        </p>
        <p>
          따라서 socket과 sync는 순차 단계가 아니라 겹쳐 진행됩니다. Port가 먼저 열릴 수 있다는 점이 이 글의 운영 경계입니다.
        </p>
        <p>
          0.12.0에는 <code>wait_synced()</code>가 있습니다. 이 메서드는 consensus status가 <code>Synced</code>가 될 때까지 기다리고,
          initial latest block과 available한 finalized block이 node cache에 들어왔는지도 확인합니다.{" "}
          <CodeViewButton
            label="Node::wait_synced()"
            onClick={() => onCodeRef("helios-wait-synced", codeRefsReal["helios-wait-synced"])}
          />
        </p>
        <p>
          하지만 CLI의 기본 실행 경로는 client를 만든 뒤 <code>wait_synced()</code>를 호출하지 않고 프로세스를 유지합니다. “RPC port가
          열렸으니 ready”라고 판단하면 아직 sync 중인 replica에 요청을 보낼 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-8 grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Helios 시작 상태와 운영 판정">
        <div className="bg-background px-4 py-4">
          <p className="font-mono text-[10px] font-black text-primary">S1 · PROCESS</p>
          <p className="mt-2 text-sm font-bold">프로세스 생존</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Config와 builder construction을 통과했습니다.</p>
        </div>
        <div className="bg-background px-4 py-4">
          <p className="font-mono text-[10px] font-black text-primary">S2 · SOCKET</p>
          <p className="mt-2 text-sm font-bold">JSON-RPC listening</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">연결은 받지만 아직 sync 중일 수 있습니다.</p>
        </div>
        <div className="bg-background px-4 py-4">
          <p className="font-mono text-[10px] font-black text-primary">S3 · READY</p>
          <p className="mt-2 text-sm font-bold">[A] Service 편입</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Sync 완료와 대표 proof-backed read를 확인했습니다.</p>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>배포 플랫폼의 readiness</h3>
        <p>
          <strong>[A]</strong> Kubernetes나 다른 process manager에서는 process liveness와 traffic readiness를 분리합니다. Liveness는
          event loop가 멈추지 않았는지 확인합니다.
        </p>
        <p>
          Readiness는 <code>eth_syncing=false</code>, 예상 chain ID, 최신 block age와 대표 proof-backed read를 같은 generation에서
          확인합니다. 하나라도 실패하면 Pod는 살아 있어도 Service endpoint에서 뺍니다.
        </p>
        <p>
          Candidate revision이 ready가 되기 전에는 이전 revision을 유지합니다. Config digest와 checkpoint source가 바뀌었는데 sync가 실패하면
          새 Pod만 제거하고 이전 binary·config·checkpoint backup 조합으로 돌아갑니다. DB schema migration은 없지만 checkpoint cache가
          손상됐을 가능성은 별도로 판정합니다.
        </p>
      </div>
    </section>
  );
}
