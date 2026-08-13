import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Subnet({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="subnet" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Subnet을 만드는 상태 전이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("ipc-subnet", codeRefs["ipc-subnet"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            실제 파라미터는 배포된 IPC contracts·CLI 버전에서 확인
          </span>
        </div>
        <p className="leading-7">
          subnet 생성은 “합의 알고리즘 이름 하나를 고르는 호출”이 아니다. 부모의
          Registry에 subnet을 등록하고, Gateway가 사용할 공급원과 collateral
          규칙을 정한 뒤, 충분한 validator가 참여한 genesis를 모든 노드가
          동일하게 시작해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">생성부터 활성화까지</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-5 gap-2 my-4">
          {[
            [
              "1",
              "Create",
              "부모 Registry에 child 구성과 최소 validator 조건을 등록",
            ],
            ["2", "Join", "validator가 collateral과 네트워크 정보를 제출"],
            [
              "3",
              "Power table",
              "부모 상태에서 genesis validator power를 확정",
            ],
            [
              "4",
              "Bootstrap",
              "합의 노드·execution state·Gateway genesis를 시작",
            ],
            [
              "5",
              "Operate",
              "block 실행과 parent finality·checkpoint loop를 함께 수행",
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
          설정에서 분리해 볼 축
        </h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              Consensus &amp; execution
            </h4>
            <p className="text-xs text-muted-foreground">
              로컬 block time·validator quorum과 FVM/EVM 실행 규칙. 지원 옵션은
              현재 IPC 릴리스 기준으로 선택한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Supply source</h4>
            <p className="text-xs text-muted-foreground">
              부모 native asset 또는 지원되는 ERC-20을 child circulating
              supply의 근원으로 연결한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Parent interaction</h4>
            <p className="text-xs text-muted-foreground">
              bottom-up check period, validator change 전파, relayer와 parent
              RPC 운영을 함께 설계한다.
            </p>
          </div>
        </div>

        <p className="leading-7">
          validator의 로컬 block reward, slashing, 최소 stake 같은 값은 IPC
          전체의 고정 상수가 아니다. subnet의 계약 구성과 공급 모델이 정하는
          정책이므로 글에서는 흐름과 책임 경계만 고정한다.
        </p>
      </div>
    </section>
  );
}
