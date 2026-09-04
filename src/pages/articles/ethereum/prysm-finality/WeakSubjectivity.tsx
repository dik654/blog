import type { CodeRef } from "@/components/code/types";

export default function WeakSubjectivity({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="weak-subjectivity" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">오래 offline이던 node는 recent trusted checkpoint에서 다시 시작한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Proof-of-work node는 가장 많은 누적 work를 가진 history를 genesis부터 독립 비교할 수 있지만 Proof-of-Stake에서는 이미 exit한
          validator의 오래된 key가 장거리 대체 history에 사용될 수 있습니다. 오랫동안 network를 보지 못한 새 node는 현재 validator set의
          사회적·경제적 맥락을 chain data만으로 완전히 복원할 수 없으므로 recent checkpoint root와 state를 신뢰 anchor로 받아야 합니다. 이를 weak
          subjectivity라고 합니다.
        </p>

        <h3>Checkpoint sync의 최소 검증 경로</h3>
        <ol>
          <li>신뢰할 수 있는 독립 경로에서 checkpoint epoch·block root와 network identity를 얻습니다.</li>
          <li>다운로드한 state의 SSZ hash-tree-root가 약속한 state root와 맞는지 확인합니다.</li>
          <li>Checkpoint block과 state의 slot·fork·genesis validators root가 대상 network와 맞는지 검사합니다.</li>
          <li>이를 fork-choice anchor로 초기화하고 이후 block·attestation을 현재 규격으로 검증합니다.</li>
          <li>Source URL만이 아니라 checkpoint tuple, 확인 시각, spec fork와 client version을 receipt로 보존합니다.</li>
        </ol>

        <h3>숫자 예와 경계</h3>
        <p>
          운영 정책이 “신뢰 checkpoint를 10일보다 오래 쓰지 않는다”고 정했고 마지막 확인이 8월 1일 12:00였다면 8월 11일 12:00 이전에 새 checkpoint로
          갱신해야 합니다. 실제 protocol weak-subjectivity period는 validator churn·withdrawal과 network parameter에 따라
          계산됩니다. 이 10일은 설명용 정책 예시일 뿐 Ethereum의 고정 상수가 아닙니다. Client가 출력하는 최신 기준과 current consensus spec을 확인해야
          합니다.
        </p>
        <p>
          Checkpoint provider 한 곳의 HTTPS 응답만 믿으면 그 provider가 새로운 trust root가 됩니다. 서로 독립적인 source, 운영자가 검증한
          published checkpoint, genesis/network identity 일치 여부를 교차 확인합니다. Weak subjectivity는 trust를 어느 recent
          root에 두었는지 명시하는 방법이고 아무 snapshot이나 받아도 된다는 허가가 아닙니다.
        </p>

        <h3>실패·rollback 시나리오</h3>
        <p>
          잘못된 network checkpoint, expired checkpoint, state-root mismatch, download truncation, future fork
          state는 각각 fail-closed로 처리합니다. 기존 DB를 곧바로 덮어쓰지 않고 별도 directory에서 anchor 검증과 forward sync를 끝낸 뒤
          atomic하게 service를 전환해야 rollback이 가능합니다. 전환 뒤에는 finalized checkpoint가 단조롭게 진전하는지와 execution client
          handoff가 같은 chain identity를 보는지도 확인합니다.
        </p>
      </div>
    </section>
  );
}
