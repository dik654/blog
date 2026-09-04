import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function WasmRuntime({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="wasm-runtime" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메시지 실행과 상태 커밋</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("fvm-machine", codeRefs["fvm-machine"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            구체 타입·syscall 이름은 ref-fvm 버전에 따라 달라질 수 있음
          </span>
        </div>
        <p className="leading-7">
          실행기는 메시지의 송신자와 수신 Actor를 찾고 적용 가능한 네트워크 버전의 Actor code를 로드한 뒤 메서드를 호출한다. Actor는 blockstore나 시스템 자원에
          직접 접근하지 않고 runtime이 노출한 syscall을 통해서만 상태와 체인 컨텍스트를 사용한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          실패해도 일관성이 깨지지 않는 순서
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-5 gap-2 my-4">
          {[
            ["1", "Resolve", "주소를 Actor ID와 현재 code·state에 연결"],
            ["2", "Prepare", "gas tracker와 제한된 runtime context를 구성"],
            ["3", "Invoke", "method number와 CBOR parameters로 Actor를 호출"],
            [
              "4",
              "Nested calls",
              "send syscall로 다른 Actor를 같은 call stack에서 실행",
            ],
            [
              "5",
              "Finalize",
              "성공한 state tree와 receipt를 반환하고 abort는 변경을 되돌림",
            ],
          ].map(([n, title, text]) => (
            <div key={n} className="rounded-lg border bg-card p-3">
              <div className="text-xs font-semibold text-muted-foreground mb-1">
                {n}
              </div>
              <div className="text-xs font-semibold mb-1">{title}</div>
              <p className="text-[11px] text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Runtime이 제공하는 능력
        </h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              State &amp; messaging
            </h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>IPLD block read/write와 Actor state root 갱신</li>
              <li>다른 Actor로 value·method·params 전송</li>
              <li>caller와 주소·Actor type 검증</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Chain services</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>현재 epoch과 네트워크 정보</li>
              <li>chain randomness와 암호학적 검증</li>
              <li>proof verification 같은 프로토콜 호스트 기능</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          “WASM opcode마다 고정 가스”, “모든 언어가 즉시 지원”, “결정론이면
          exploit이 차단” 같은 표현은 과도하다. 실제 안전성은 네트워크 버전별
          gas schedule, syscall 검증, Actor 코드와 노드 구현이 함께 만든다.
        </p>
      </div>
    </section>
  );
}
