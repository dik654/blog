import { useState } from "react";
import { API_SURFACES } from "./FlashbotsData";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

export default function Flashbots({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  const surface = API_SURFACES[active];

  return (
    <section id="flashbots" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Builder API와 private bundle API를 구분하기
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          “Flashbots API”라는 이름 아래에는 서로 다른 caller가 있습니다.
          Validator registration, bid header 요청과 blinded block 제출은
          proposer-side Builder API입니다. <code>eth_sendBundle</code> 계열은
          searcher가 builder 또는 relay service에 private orderflow를 전달하는
          JSON-RPC surface입니다. 둘을 Reth의 RelayClient 하나로 합치면 호출
          주체와 trust boundary가 사라집니다.
        </p>
        <p className="leading-7">
          Blinded block exchange는 proposer가 payload body를 받기 전에 header commitment에 서명하는 흐름입니다. Relay는 builder
          submission과 payload delivery를 중개하지만 neutral하거나 always available하다고 가정할 수 없습니다. 운영자는 여러 relay의
          latency뿐 아니라 censorship policy와 payload non-delivery, fallback readiness까지 함께 관측합니다.
        </p>
        <p className="leading-7">
          Bid 검증은 relay 이름 확인으로 끝나지 않습니다. 응답의 slot·parent hash·proposer pubkey가 요청과 일치하는지, fork version에 맞는
          header인지, builder signature와 block hash/value encoding이 유효한지를 먼저 확인합니다. 이 검사를 통과한 후보만 arrival
          time·검증 시간·delivery reserve가 남은 집합에 넣고 value를 비교합니다. 선택 receipt에는 relay와 builder, block hash,
          advertised value, 도착 시각, 제외 이유를 남깁니다. 그래야 사후에 “높은 bid를 놓친 것”과 “invalid bid를 거른 것”을 구분할 수 있습니다.
        </p>
        <div className="not-prose">
          <CodeViewButton
            label="mev-boost getPayload timeout · verifyPayload"
            onClick={() =>
              onCodeRef("get-payload-timeout", codeRefs["get-payload-timeout"])
            }
          />
        </div>
      </div>

      <div className="not-prose grid grid-cols-2 gap-2 sm:grid-cols-4 mb-4">
        {API_SURFACES.map((item, index) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setActive(index)}
            className={`cursor-pointer rounded-xl border p-3 text-left ${active === index ? "bg-muted/50" : "border-border"}`}
            style={{ borderColor: active === index ? item.color : undefined }}
          >
            <p className="text-xs font-bold" style={{ color: item.color }}>
              {item.name}
            </p>
            <p className="mt-1 text-[11px] text-foreground/45">{item.method}</p>
          </button>
        ))}
      </div>
      <div className="not-prose mb-8 rounded-xl border border-border/60 p-4">
        <code className="text-xs text-indigo-400">{surface.endpoint}</code>
        <p className="mt-2 text-xs text-foreground/50">
          caller: {surface.caller}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/75">
          {surface.desc}
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">
        운영 실패를 같은 timeout으로 뭉치지 않기
      </h3>
      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 p-4">
          <p className="text-sm font-semibold">No bid</p>
          <p className="mt-2 text-xs leading-5 text-foreground/60">
            유효한 external bid가 없는 정상 결과일 수 있습니다. Local payload 선택
            가능성을 확인합니다.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 p-4">
          <p className="text-sm font-semibold">Invalid bid</p>
          <p className="mt-2 text-xs leading-5 text-foreground/60">
            signature, parent, fork fields와 value constraints를 통과하지 못한
            후보입니다.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 p-4">
          <p className="text-sm font-semibold">Payload non-delivery</p>
          <p className="mt-2 text-xs leading-5 text-foreground/60">
            blinded block 서명 뒤 body를 받지 못한 별도 failure로 proposer
            timing과 liveness에 직접 영향을 줍니다.
          </p>
        </div>
      </div>
    </section>
  );
}
