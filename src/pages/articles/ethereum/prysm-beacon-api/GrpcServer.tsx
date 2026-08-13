import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

export default function GrpcServer({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="grpc-server" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">서버 초기화보다 먼저 exposure와 authority를 정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Listener를 열고 service를 등록하는 것만으로 API가 안전해지지는 않습니다. Health read, debug state dump, validator duty read와 signed-object publish는 data sensitivity와 side effect가 다르므로 bind network·authentication·authorization·rate/body budget을 endpoint family별로 정해야 합니다.</p>
        <div className="not-prose my-4 flex flex-wrap gap-2">
          {codeRefs["service-start"] && <CodeViewButton onClick={() => onCodeRef("service-start", codeRefs["service-start"])} />}
        </div>
        <h3>Request가 effect에 닿기 전 순서</h3>
        <ol>
          <li>Listener·TLS/network boundary와 enabled service 목록을 고정합니다.</li>
          <li>Message/header size, deadline와 concurrency budget을 먼저 적용합니다.</li>
          <li>Caller identity와 endpoint별 action 권한을 확인합니다.</li>
          <li>Logging·metrics에는 request digest와 decision을 남기되 key·token·full sensitive body는 남기지 않습니다.</li>
          <li>Typed request를 common service에 넘기고 panic/error를 transport status로 일관되게 매핑합니다.</li>
        </ol>
        <h3>인증과 protocol validity는 다릅니다</h3>
        <p>올바른 TLS certificate나 token은 caller identity evidence일 뿐 submitted block·attestation이 valid하다는 뜻은 아닙니다. 반대로 valid SSZ·BLS object도 그 caller가 publish endpoint를 호출할 권한이 있음을 증명하지 않습니다. Authorization은 effect 전에 fail closed하고 consensus validation은 handler 안에서 별도로 수행합니다.</p>
        <h3>Negative fixture가 exposure를 검증합니다</h3>
        <p>Untrusted network caller의 debug dump, unauthorized publish, oversized body, slow stream, deadline 초과와 invalid protobuf를 주입합니다. 기대 결과는 handler effect 0, bounded resource use, secret-free audit receipt와 typed deny/error입니다. Public bind 한 번이나 happy-path health check만으로 이 경계를 입증할 수 없습니다.</p>
      </div>
    </section>
  );
}
