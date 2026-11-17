import CryptoSceneShell from "./CryptoSceneShell";

/**
 * 본문 대응: #hash "검증 실패도 멈춘 경계에 따라 의미가 다릅니다" 목록 여섯 항목.
 * 검사 순서는 sidebar 원문 순서입니다.
 * Vote.verify: address 비교 → signature 검증.
 * TxProof.Validate: proof root = Header.DataHash → (Proof.Verify) LeafHash 재계산 → aunts로 root 복원.
 */

type StepState = "ok" | "stop" | "skip" | "idle";

const VOTE_STEPS = ["① SHA256(pubA)[:20] = vote address?", "② 같은 canonical bytes로 64-byte signature 검증"] as const;
const TX_STEPS = [
  "① proof root = Header.DataHash?",
  "② T1 bytes로 다시 만든 LeafHash = proof LeafHash?",
  "③ index·total·aunts로 복원한 root = D41?",
] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  vote: readonly [StepState, StepState];
  tx: readonly [StepState, StepState, StepState];
  app: StepState;
  stopText: string;
}[] = [
  {
    label: "Vote address가 public key와 다를 때",
    summary: "vote ① 에서 중단",
    note: "Signer lookup 경계에서 ErrVoteInvalidValidatorAddress로 멈춥니다. Public key를 잘못 찾은 상태이므로 signature 검증까지 가지 않습니다.",
    vote: ["stop", "skip"],
    tx: ["idle", "idle", "idle"],
    app: "idle",
    stopText: "ErrVoteInvalidValidatorAddress",
  },
  {
    label: "Address는 같지만 signature가 다를 때",
    summary: "vote ② 에서 중단",
    note: "Public key는 맞게 찾았지만, A가 이 exact canonical vote bytes를 승인했다는 확인에는 실패합니다.",
    vote: ["ok", "stop"],
    tx: ["idle", "idle", "idle"],
    app: "idle",
    stopText: "exact canonical vote 승인 실패",
  },
  {
    label: "Proof root가 다른 block의 root일 때",
    summary: "tx ① 에서 중단",
    note: "TxProof.Validate(header.DataHash)의 첫 비교에서 멈춥니다. Proof 안쪽 hash가 서로 맞더라도 신뢰할 Header의 D41과 연결되지 않으므로 더 계산하지 않습니다.",
    vote: ["idle", "idle"],
    tx: ["stop", "skip", "skip"],
    app: "idle",
    stopText: "Header.DataHash와 다른 root",
  },
  {
    label: "T1 bytes가 바뀌었을 때",
    summary: "tx ② 에서 중단",
    note: "Proof root는 D41이라고 둔 경우입니다(가정). 바뀐 bytes로 다시 계산한 LeafHash가 proof의 LeafHash와 달라 여기서 멈춥니다.",
    vote: ["idle", "idle"],
    tx: ["ok", "stop", "skip"],
    app: "idle",
    stopText: "LeafHash 불일치",
  },
  {
    label: "Index·Total·Aunts가 맞지 않을 때",
    summary: "tx ③ 에서 중단",
    note: "T1 bytes와 hashes는 그대로여도 좌우 순서나 aunt 순서가 어긋나면 expected D41을 복원하지 못합니다.",
    vote: ["idle", "idle"],
    tx: ["ok", "ok", "stop"],
    app: "idle",
    stopText: "복원한 root ≠ D41",
  },
  {
    label: "모든 crypto 검증이 성공했을 때",
    summary: "application 경계가 남음",
    note: "Commit과 T1 proof가 모두 성공해도 application은 T1을 invalid로 처리할 수 있습니다. Alice의 서명·잔액·nonce와 실행 결과는 FinalizeBlock response와 다음 State·AppHash 경계에서 확인합니다.",
    vote: ["ok", "ok"],
    tx: ["ok", "ok", "ok"],
    app: "stop",
    stopText: "실행 성공은 별도 판단",
  },
];

const tone: Record<StepState, string> = {
  ok: "border-border bg-background text-foreground",
  stop: "border-primary bg-primary/10 text-foreground",
  skip: "border-dashed border-border/70 bg-background text-muted-foreground/70",
  idle: "border-border/60 bg-background text-muted-foreground/60",
};

const mark: Record<StepState, string> = {
  ok: "통과",
  stop: "■ 여기서 결정",
  skip: "– 실행 안 됨",
  idle: "이 장면과 무관",
};

function Step({ text, state }: { text: string; state: StepState }) {
  return (
    <li className={`min-w-0 rounded-lg border px-3 py-2 ${tone[state]}`}>
      <span className="block break-keep text-xs font-semibold leading-5 sm:text-sm">{text}</span>
      <span className={`mt-0.5 block text-[11px] font-bold ${state === "stop" ? "text-primary" : ""}`}>{mark[state]}</span>
    </li>
  );
}

function Lane({ title, steps, states }: { title: string; steps: readonly string[]; states: readonly StepState[] }) {
  return (
    <section className="min-w-0">
      <h5 className="text-[11px] font-black tracking-wide text-muted-foreground">{title}</h5>
      <ol className="mt-2 grid gap-2">
        {steps.map((text, index) => (
          <Step key={text} text={text} state={states[index]} />
        ))}
      </ol>
    </section>
  );
}

function StopScene({ index }: { index: number }) {
  const scene = SCENES[index];
  return (
    <div className="min-w-0">
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Lane title="VALIDATOR VOTE 경로 · Vote.Verify" steps={VOTE_STEPS} states={scene.vote} />
        <Lane title="T1 포함 경로 · TxProof.Validate" steps={TX_STEPS} states={scene.tx} />
      </div>
      <ol className="mt-3 grid">
        <Step text="Application · Alice의 서명·잔액·nonce와 실제 상태 변경" state={scene.app} />
      </ol>
      <p className="mt-3 rounded-lg border border-border px-3 py-2 text-sm leading-6">
        <span className="font-bold text-primary">멈춘 경계 · </span>
        {scene.stopText}
      </p>
    </div>
  );
}

export function VerifyStopViz() {
  return (
    <CryptoSceneShell
      eyebrow="실패가 멈추는 자리"
      title="같은 ‘검증 실패’라도 멈추는 칸이 다릅니다"
      description="VALIDATOR VOTE 경로는 validator A의 vote 검증, T1 포함 경로는 T1 proof 검증입니다. 각 경로는 번호 순서대로 검사하며, 앞 칸에서 멈추면 뒤 칸은 실행되지 않습니다."
      ariaLabel="vote 검증과 T1 proof 검증에서 실패 여섯 가지가 각각 멈추는 단계"
      scenes={SCENES}
      render={(index) => <StopScene index={index} />}
    />
  );
}
