import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import SessionDetailViz from "./viz/SessionDetailViz";
import { SESSION_STATES } from "./SessionData";

export default function Session({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="session" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Session lifecycle: transport와 protocol readiness 분리
      </h2>
      <div className="not-prose mb-8">
        <SessionDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <div className="not-prose mb-4 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() => onCodeRef("net-session", codeRefs["net-session"])}
          />
          <span className="self-center text-xs text-muted-foreground">
            세션 책임을 보는 축약 코드
          </span>
        </div>
        <h3>배경</h3>
        <p>
          TCP 연결 하나에는 handshake, capability 협상, ETH Status 교환, active
          message 처리와 종료가 순서대로 존재한다. socket이 열렸다는
          사실만으로는 chain data를 보낼 준비가 된 것이 아니다.
        </p>
        <h3>문제</h3>
        <p>
          pending 연결을 active peer처럼 세거나 handshake 실패와 protocol 위반을
          같은 오류로 다루면 slot이 고갈되고 재시도·평판 정책도 왜곡된다. 비동기
          런타임을 쓴다는 사실만으로 특정 스레드 수나 다른 클라이언트 대비 고정
          메모리 배율을 보장할 수도 없다.
        </p>
        <h3>아이디어</h3>
        <p>
          연결을 명시적 상태 기계로 관리하고, 각 단계가 성공했을 때만 다음
          단계의 권한을 연다. session task는 transport event를 상위 network
          manager에 전달하고, manager는 peer policy와 protocol handler의 결정을
          다시 session lifecycle에 반영한다.
        </p>
        <h3>구현</h3>
        <p>
          auth/ack에서 session secrets를 만든 뒤 Hello로 capability 교집합을
          계산한다. 협상된 ETH protocol의 Status가 chain과 fork compatibility를
          만족하면 active로 승격한다. EOF, timeout, 명시적 Disconnect와 protocol
          error는 각 원인을 보존한 채 정리·평판·재시도 정책으로 전달한다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-3">
        {SESSION_STATES.map((state) => (
          <article
            key={state.id}
            className="rounded-xl border border-border/70 bg-card p-4"
          >
            <p
              className="font-mono text-sm font-bold"
              style={{ color: state.color }}
            >
              {state.label}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/65">
              {state.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
