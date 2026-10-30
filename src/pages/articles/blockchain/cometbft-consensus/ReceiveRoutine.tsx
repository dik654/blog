import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function ReceiveRoutine({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="receive-routine" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Peer message와 local vote와 timeout은 한 loop에서 차례로 상태를 바꿉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Round 0의 proposal timeout과 뒤늦게 도착한 block part가 서로 다른 goroutine에서 곧바로 RoundState를 바꾼다면 결과가
          처리 순서에 따라 달라질 수 있습니다. <code>receiveRoutine</code>은 peer queue, internal queue, timeout ticker에서 입력 하나를
          고른 뒤 <code>handleMsg</code> 또는 <code>handleTimeout</code>으로 보냅니다. 합의 상태를 실제로 갱신하는 경로를 한곳에 모으는 것입니다.
        </p>
        <p>
          내 node가 만든 Proposal과 Vote는 처리 전에 WAL에 동기 기록합니다. 재시작 뒤 같은 key가 다른 내용에 서명되는 일을 막으려면
          “서명했다”와 “디스크에 남겼다”의 순서도 합의 안전성의 일부이기 때문입니다. Peer message와 timeout도 WAL에 기록되지만
          기록 방식과 실패 처리는 message 종류마다 다릅니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="receiveRoutine()" onClick={() => onCodeRef("receive-routine", codeRefs["receive-routine"])} />
        <CodeViewButton label="handleTimeout()" onClick={() => onCodeRef("handle-timeout", codeRefs["handle-timeout"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Queue에 들어왔다는 사실만으로 현재 round의 표가 되지는 않습니다</h3>
        <p>
          Vote가 도착해도 height·round·type·validator와 signature를 확인하고 해당 VoteSet에 실제로 추가돼야 power가 늘어납니다.
          Timeout도 예약된 H/R/S와 처리 시점의 H/R/S를 다시 비교합니다. 이미 round 1로 간 node가 round 0의 늦은 timer를 받더라도
          <code>handleTimeout</code>의 앞부분에서 버리므로 상태가 뒤로 가지 않습니다.
        </p>
        <h3>관측할 때도 수신과 적용을 나눠 봅니다</h3>
        <p>
          하나의 trace에는 수신 시각, peer, message의 H/R/S, queue 대기시간, validation 결과, 적용 전후 RoundState, WAL 위치를 연결해야
          합니다. 그래야 “75 power가 네트워크에 보였다”와 “내 VoteSet에 75가 반영돼 transition이 실행됐다”를 구분할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
