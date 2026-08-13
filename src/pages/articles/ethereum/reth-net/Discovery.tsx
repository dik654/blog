import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import { DISC_MESSAGES, LOOKUP_STEPS } from "./DiscoveryData";

export default function Discovery({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="discovery" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Discovery: 주소 목록을 살아 있는 dial 후보로 바꾸기
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <div className="not-prose mb-4 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() =>
              onCodeRef("net-discovery", codeRefs["net-discovery"])
            }
          />
          <span className="self-center text-xs text-muted-foreground">
            discovery 책임을 보는 축약 코드
          </span>
        </div>
        <h3>배경</h3>
        <p>
          새 노드는 아직 연결할 피어를 모른다. bootnode와 DNS 목록은 첫 접점을
          제공하지만, 장기간 살아 있는 전체 peer set을 중앙 목록 하나에 의존할
          수는 없다.
        </p>
        <h3>문제</h3>
        <p>
          endpoint는 이동하고 응답하지 않을 수 있으며, node identity와 IP·port
          정보도 갱신된다. 발견된 주소를 곧바로 active peer로 취급하면 stale
          record와 악성 응답이 connection slot을 차지한다.
        </p>
        <h3>아이디어</h3>
        <p>
          discovery table은 “연결 후보”만 유지한다. discv4의 거리 기반 table과
          discv5의 서명된 ENR·lookup은 서로 다른 wire details를 가지지만, 반복
          질의로 더 적합한 후보를 찾고 liveness와 record freshness를 갱신한다는
          역할은 같다.
        </p>
        <h3>구현</h3>
        <p>
          Reth는 discv4·discv5와 DNS discovery를 조합할 수 있다. lookup 응답을
          local table에 병합하고, connection manager가 그중 일부를 dial한다.
          실제 연결 성공, handshake와 protocol behavior는 discovery score와
          별개의 피드백으로 관리한다.
        </p>
      </div>

      <h3 className="mb-3 text-lg font-semibold">
        반복 lookup의 안정적인 흐름
      </h3>
      <div className="not-prose mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {LOOKUP_STEPS.map((step) => (
          <article
            key={step.step}
            className="rounded-xl border border-border/70 bg-card p-4"
          >
            <p
              className="font-mono text-xs font-bold"
              style={{ color: step.color }}
            >
              Step {step.step}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground/75">
              {step.title}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/55">
              {step.desc}
            </p>
          </article>
        ))}
      </div>

      <h3 className="mb-3 text-lg font-semibold">discv4 message 역할</h3>
      <div className="not-prose overflow-x-auto">
        <table className="min-w-full border border-border text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-4 py-2 text-left">
                메시지
              </th>
              <th className="border border-border px-4 py-2 text-left">역할</th>
            </tr>
          </thead>
          <tbody>
            {DISC_MESSAGES.map((message) => (
              <tr key={message.name}>
                <td className="border border-border px-4 py-2 font-mono text-xs">
                  {message.name}
                </td>
                <td className="border border-border px-4 py-2 text-foreground/70">
                  {message.purpose}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        discv5는 동일한 표를 그대로 재사용하지 않는다. ENR, session
        establishment와 request/response semantics는 discv5 규격을 별도로 따라야
        한다.
      </p>
    </section>
  );
}
