import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import HeliosContractViz from "../helios-contract-viz";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Persistence({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="persistence" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          현재 <code>FileDB</code>는 network data directory의 <code>checkpoint</code> 파일에 32-byte root 하나를 저장합니다. Load 때 파일을
          전부 읽어 정확히 32 bytes이면 사용하고, 그렇지 않거나 read가 실패하면 network default checkpoint로 돌아갑니다. 이것은 빠른 재시작을
          위한 cache 동작이지, source authority와 freshness를 증명하는 database는 아닙니다.
        </p>
        <p>
          또한 pinned source의 save는 파일을 <code>truncate</code>한 뒤 바로 씁니다. Temp file, fsync, atomic rename과 directory sync가
          보이지 않으므로 crash-safe atomicity를 구현 사실로 주장할 수 없습니다. 그런 보장은 아래 release gate의 hardening 요구입니다.
        </p>
      </div>
      <HeliosContractViz mode="checkpoint-storage" />
      <ExplainedFormula
        question="Checkpoint가 age policy 안에 있는지 어떤 단위로 판단하는가?"
        idea="검사 시각과 checkpoint가 대표하는 finalized 시각의 차이를 같은 초 단위로 계산한 뒤 configured maximum과 비교합니다. Root의 수학적 유효성과 source trust는 별도 조건입니다."
        formula={String.raw`a=t_{\text{check}}-t_{\text{finalized}},\qquad \operatorname{fresh}=\bigl(0\le a\le A_{\max}\bigr)`}
        terms={[
          { symbol: "t_{\\text{check}}", name: "검사 시각", description: "이번 startup receipt에 기록한 wall-clock seconds입니다." },
          { symbol: "t_{\\text{finalized}}", name: "Checkpoint 시각", description: "Checkpoint epoch/slot과 network genesis·slot duration으로 연결한 finalized 시각입니다." },
          { symbol: "A_{\\max}", name: "Maximum age", description: "Pinned config에서 읽은 허용 checkpoint age seconds입니다." },
        ]}
        assumptions={[
          "Network·genesis·slot duration과 local clock provenance를 확인합니다.",
          "Freshness 통과와 trusted source·root/branch verification을 모두 요구합니다.",
        ]}
        interpretation="Age가 작다는 사실만으로 checkpoint가 올바른 chain의 trusted root라는 뜻은 아닙니다. 반대로 strict policy에서 age를 넘으면 URL 다수결만으로 자동 승인하지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Fallback은 두 종류를 구분합니다</h3>
        <p>
          <code>fallback</code>과 <code>load_external_fallback</code>은 여러 execution RPC를 순회하는 기능이 아니라 오래되거나 없는
          <strong> checkpoint를 가져올 source</strong>입니다. 공식 config 문서도 external list 사용을 insecure feature로 경고합니다. 받은
          root는 source policy·network·age를 확인한 뒤 bootstrap 검증을 통과해야 하며, 다수 endpoint가 같은 값을 반환했다는 이유만으로 trusted가
          되지는 않습니다.
        </p>
        <h3>Release gate</h3>
        <p>
          Base와 candidate에 valid 32-byte file, 31/33-byte file, truncated write, permission error, wrong-network root, expired checkpoint,
          unavailable fallback과 conflicting fallback을 재생합니다. 같은 accept/reject reason과 resulting Store를 먼저 확인한 뒤 startup p95와 network
          request 수를 비교합니다. Production hardening 후보는 temp-write→file fsync→atomic rename→directory fsync와 crash injection을 통과하고,
          rollback에는 이전 binary·config digest·checkpoint backup을 묶습니다.
        </p>
      </div>
    </section>
  );
}
