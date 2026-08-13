import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function SnappyEncoding({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="snappy-encoding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SSZ-Snappy 인코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Ethereum consensus gossip topic은 포크에 맞는 SSZ 객체를 Snappy로
          압축한 <code>ssz_snappy</code> payload를 운반한다. SSZ가 타입과
          canonical bytes를 결정하고 Snappy는 그 바이트열의 전송량을 줄이는 별도
          계층이다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">수신 파이프라인</h3>
        <div className="not-prose grid gap-2 my-4 text-xs">
          {[
            [
              "1",
              "Topic 확인",
              "fork digest와 message type이 현재 validation 문맥에 맞는지 확인",
            ],
            [
              "2",
              "크기 제한",
              "압축 입력과 해제 후 예상 길이에 한도를 적용해 allocation 폭증을 방지",
            ],
            [
              "3",
              "Snappy 해제",
              "지원하는 framing·encoding 규칙에 따라 bytes 복원",
            ],
            [
              "4",
              "SSZ decode",
              "포크별 concrete type으로 canonical 구조를 역직렬화",
            ],
            [
              "5",
              "Gossip validation",
              "시기·서명·부모·중복 등 객체별 규칙을 적용",
            ],
          ].map(([n, title, body]) => (
            <div
              key={n}
              className="flex items-start gap-3 rounded-lg border bg-card p-3"
            >
              <span className="font-mono font-semibold">{n}</span>
              <div>
                <strong>{title}</strong>
                <p className="text-muted-foreground mt-1">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          왜 압축 benchmark를 본문 상수로 두지 않는가
        </h3>
        <ul>
          <li>
            압축률은 beacon block, attestation, blob sidecar처럼 입력 분포가
            다른 객체마다 달라진다.
          </li>
          <li>
            처리량은 CPU, library 버전, framing 방식과 buffer 재사용 여부에
            좌우된다.
          </li>
          <li>
            DoS 안전성은 평균 속도보다 해제 전 길이 확인, 최대 크기, 실패 시
            allocation 경로에 달려 있다.
          </li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          “gzip보다 몇 배 빠르다” 같은 수치는 특정 benchmark의 결과일 뿐
          프로토콜 보장이 아니다. 운영에서는 실제 gossip corpus로 encode·decode
          latency, 압축률, allocation을 함께 측정한다.
        </p>
      </div>
    </section>
  );
}
