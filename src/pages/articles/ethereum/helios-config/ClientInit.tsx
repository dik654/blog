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
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>EthereumClientBuilder::build()</code>는 network 또는 custom config에서 base fields를 정하고, explicit builder 값이 있으면 endpoint,
          checkpoint, data directory와 bind address를 덮어쓴 뒤 consensus client와 execution provider를 조립합니다. 여기까지는
          <strong> construction</strong>이며 verified head를 확보했다는 뜻이 아닙니다.
        </p>
      </div>
      <div className="not-prose my-4">
        <CodeViewButton
          label="EthereumClientBuilder::build()"
          onClick={() => onCodeRef("helios-builder", codeRefsReal["helios-builder"])}
        />
      </div>
      <HeliosContractViz mode="client-startup" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>부분 초기화를 readiness로 내보내지 않는 순서</h3>
        <ol>
          <li>최종 config와 source provenance를 만들고 secret URL은 redacted digest로 기록합니다.</li>
          <li>Checkpoint 후보의 source·network·age policy를 확정합니다.</li>
          <li>CL/EL endpoint의 chain identity와 필요한 method capability를 probe합니다.</li>
          <li>Bootstrap/update 검증으로 Store를 만들고 verified execution head를 확보합니다.</li>
          <li>그 뒤에만 local RPC readiness generation을 공개합니다.</li>
        </ol>
        <p>
          Wrong chain, malformed local checkpoint, expired anchor, CL/EL head mismatch에서는 fail closed합니다. 이미 socket을 bind했다면 not-ready
          response만 반환하고, 이전 ready generation이 있다면 명시적인 rollback policy 없이는 새 config와 섞지 않습니다.
        </p>
      </div>
    </section>
  );
}
