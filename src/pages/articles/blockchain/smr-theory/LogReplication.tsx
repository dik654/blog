import ExplainedFormula from "@/components/ui/explained-formula";
import LogReplicationViz from "./viz/LogReplicationViz";

export default function LogReplication() {
  return (
    <section id="log-replication" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Raft는 log prefix와 leader epoch를 함께 지킨다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Raft의 term은 leader epoch를 나타내는 logical number입니다. Candidate는
          majority vote를 얻어 leader가 되고, leader는 AppendEntries에 이전
          entry의 index·term을 담아 follower prefix가 맞는지 확인합니다. Follower가
          다른 term의 conflicting suffix를 갖고 있으면 그 지점부터 고쳐 같은
          prefix를 만듭니다.
        </p>
      </div>
      <LogReplicationViz />
      <ExplainedFormula
        question="n개 replica에서 crash f개 뒤에도 majority quorum을 만들고 두 quorum을 겹치게 하려면?"
        idea="Majority q=floor(n/2)+1은 두 집합이 반드시 겹치며, n=2f+1이면 f개 crash 뒤에도 q개가 남습니다."
        formula={String.raw`q=\left\lfloor\frac n2\right\rfloor+1,\qquad |Q_1\cap Q_2|\ge 2q-n`}
        terms={[
          { symbol: "n", name: "replica count", description: "고정 membership의 전체 voting replica 수입니다." },
          { symbol: "q", name: "majority", description: "Election·replication에 필요한 vote 또는 ACK 수입니다." },
          { symbol: "Q_1,Q_2", name: "quorums", description: "서로 다른 두 election·replication certificate 집합입니다." },
        ]}
        assumptions={["Crash-fault fixed membership을 가정합니다.", "교집합 process의 protocol state와 Raft election restriction이 safety에 추가로 필요합니다."]}
        interpretation="n=5이면 q=3, 최소 교집합은 1입니다. Replica 2개가 멈춰도 3개로 진행할 수 있지만 network partition 배치에 따라 liveness는 멈출 수 있습니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Commit rule을 ‘과반 복제’ 한 문장으로 줄이면 안 됩니다</h3>
        <p>
          Leader는 current term의 entry가 majority에 저장됐음을 확인해 commit index를
          전진합니다. 이전 term entry는 current-term entry가 commit되면서 함께
          committed prefix가 됩니다. Candidate의 log가 voter보다 덜 up-to-date하면
          vote를 얻지 못하는 election restriction이 committed entry를 잃는 leader의
          당선을 막습니다.
        </p>
        <p>
          Crash test는 follower append 전·후, majority ACK 전·후, leader commit 전·후,
          state-machine apply와 client reply 사이를 나눕니다. Recovery 뒤 committed
          prefix와 state digest가 같고 uncommitted suffix만 rollback되는지 확인합니다.
        </p>
      </div>
      <div id="paper-raft" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Raft</p>
        <p className="mt-2 text-sm font-semibold">In Search of an Understandable Consensus Algorithm</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Consensus를 leader election·log replication·safety·membership change로 분해하고 replicated state machine 구현과 평가를 제시합니다. 단순 majority ACK만으로 모든 durability·client exactly-once·Byzantine safety가 생긴다는 논문은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://raft.github.io/raft.pdf" target="_blank" rel="noreferrer">Raft extended paper 보기</a>
      </div>
    </section>
  );
}
