import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import HeliosContractViz from "../helios-contract-viz";
import { codeRefsReal } from "./codeRefsReal";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function NetworkConfig({ title, onCodeRef }: Props) {
  return (
    <section id="network-config" className="mb-16 scroll-mt-20">
      <h2 className="mb-3 text-2xl font-bold">{title}</h2>
      <p className="mb-6 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
        설정 후보, network identity, endpoint와 readiness는 서로 다른 상태이며 한 actor가 전부 소유하지 않습니다.
      </p>

      <HeliosContractViz mode="network-bundle" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <strong>[O]</strong> 0.12.0의 <code>Network</code> profile은 chain ID, genesis time/root, consensus fork
          epoch/version, execution fork schedule, default checkpoint와 maximum checkpoint age를 묶습니다.{" "}
          <CodeViewButton
            label="Network profile — 0.12.0"
            onClick={() => onCodeRef("helios-network", codeRefsReal["helios-network"])}
          />
        </p>
        <p>
          Network 이름은 chain ID 한 숫자의 별칭이 아닙니다. 일부 field만 다른 network에서 가져오면 update와 execution block을 같은
          chain으로 검증할 수 없습니다.
        </p>
        <p>
          Consensus RPC는 light-client bootstrap·update·finality 자료를 가져옵니다. Execution RPC는 block·receipt·account proof와
          transaction 전송에 사용됩니다. Builder는 두 URL을 서로 다른 provider에 넣습니다.
        </p>
        <p>
          다만 시작 전에 <code>eth_chainId</code>와 capability를 모두 probe하는 별도 단계를 구현하지는 않습니다. 따라서 기존 글의
          “Builder가 endpoint identity를 먼저 확인한다”는 설명을 구현 사실에서 제외했습니다.
        </p>
      </div>

      <div className="not-prose my-8 overflow-x-auto border-y border-border py-3">
        <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="px-3 py-2">상태</th>
              <th className="px-3 py-2">현재 writer</th>
              <th className="px-3 py-2">reader</th>
              <th className="px-3 py-2">실패 시 보이는 결과</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-3 py-3 font-bold">최종 Config</td>
              <td className="px-3 py-3">Figment merge · CLI 경로</td>
              <td className="px-3 py-3">EthereumClientBuilder</td>
              <td className="px-3 py-3">Parse error 또는 잘못된 값으로 construction</td>
            </tr>
            <tr>
              <td className="px-3 py-3 font-bold">초기 checkpoint</td>
              <td className="px-3 py-3">Config 또는 FileDB</td>
              <td className="px-3 py-3">ConsensusClient</td>
              <td className="px-3 py-3">Bootstrap 실패·경고·fallback 분기</td>
            </tr>
            <tr>
              <td className="px-3 py-3 font-bold">Sync status</td>
              <td className="px-3 py-3">ConsensusClient</td>
              <td className="px-3 py-3">wait_synced · eth_syncing</td>
              <td className="px-3 py-3">Syncing 또는 Error</td>
            </tr>
            <tr>
              <td className="px-3 py-3 font-bold">Service readiness</td>
              <td className="px-3 py-3">[A] 배포 플랫폼</td>
              <td className="px-3 py-3">Gateway · Service endpoint</td>
              <td className="px-3 py-3">트래픽 미편입·이전 revision 유지</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>가장 작은 운영 기준선</h3>
        <p>
          <strong>[A]</strong> 첫 기준선은 network profile과 두 endpoint를 한 release의 설정으로 고정하고, secret을 지운 config digest와
          선택된 source를 기록하는 것입니다. Consensus·execution endpoint의 identity와 필요한 method는 별도 preflight에서 확인합니다.
          이 preflight가 실패하면 candidate Pod를 Service endpoint에 넣지 않습니다.
        </p>
        <p>
          Endpoint가 HTTP 200을 반환하거나 낮은 지연을 보였다는 사실은 proof 검증과 sync 완료를 대신하지 않습니다. 반대로 검증 경로가
          맞더라도 endpoint 장애가 계속되면 가용한 서비스가 되지 않습니다. 신뢰와 가용성을 한 health flag로 합치지 않습니다.
        </p>
      </div>
    </section>
  );
}
