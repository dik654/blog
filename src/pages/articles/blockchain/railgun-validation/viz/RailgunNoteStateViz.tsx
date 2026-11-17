import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #baseline — Tree 0 leaf 23의 값 10 note(C₁₀, root R100)를 6(수신)+4(거스름)으로 나누는 기준선 송금.
 * 같은 장면에서 #experiment의 Replay(N₂₃ 재제출)와 Sync restart(Nullified·Transact 사이 종료)를 이어서 본다.
 * 산술: 10 = 6 + 4, 잘못된 witness 6 + 5 = 11 ≠ 10, 보낸 쪽 wallet 잔액 10 → 4(거스름).
 * 새 leaf의 위치와 새 root 값은 글이 정하지 않아 이름만 쓴다.
 */
const SCENES = [
  {
    label: "시작 상태",
    summary: "leaf 23 = C₁₀ · root R100",
    note: "Commitment(C)는 note 내용을 숨긴 채 tree에 올린 값이고, root는 그 tree 전체를 한 값으로 요약한 것입니다. Nullifier(N)는 note를 쓸 때 공개되어 계약이 '이미 사용됨'으로 기록하는 값입니다. Tree 0의 leaf 23에 값 10인 C₁₀이 있고 root R100을 고정합니다. 계약의 used nullifier 목록에는 N₂₃이 아직 없습니다.",
  },
  {
    label: "proof 생성",
    summary: "10 = 6 + 4 → verify PASS",
    note: "Circuit은 C₁₀이 R100 tree에 있고, N₂₃이 그 note에서 나왔고, 입력 10이 출력 6 + 4와 같다는 관계를 증명합니다. 같은 note에서 6 + 5를 만들려고 넣은 witness(proof 생성에 넣는 비공개 입력값)는 합이 11이라 proof 생성이나 verify에서 실패해야 합니다. 아직 계약 상태는 그대로입니다.",
  },
  {
    label: "계약 반영",
    summary: "N₂₃ used · C₆·C₄ 추가 · 새 root",
    note: "계약이 proof를 검증한 뒤 N₂₃을 used로 기록하고 C₆·C₄를 tree에 더해 root가 바뀝니다. Contract receipt에는 tx hash, Nullified, Transact, 새 root가 남습니다. 새 leaf의 위치와 새 root 값은 이 글이 정하지 않았습니다.",
  },
  {
    label: "wallet 반영",
    summary: "보낸 쪽 잔액 10 → 4",
    note: "Wallet은 on-chain event를 순서대로 읽어 자기 view를 다시 계산합니다. 보낸 쪽은 C₁₀을 spent로 표시하고 거스름 C₄만 남아 잔액 4, 받는 쪽은 C₆을 해독해 6을 봅니다. 이 세 receipt를 같은 run ID로 묶은 것이 기준선입니다.",
  },
  {
    label: "replay",
    summary: "N₂₃ 재제출 → revert",
    note: "이미 쓴 N₂₃을 다시 제출합니다. Proof만 보고 통과시키면 안 되고, 계약은 used 목록에서 N₂₃을 찾아 revert해야 합니다. 새 commitment가 생기거나 보낸 쪽 잔액이 4보다 늘면 기각입니다.",
  },
  {
    label: "sync 중단",
    summary: "Nullified만 반영 → 4가 빠짐",
    note: "Wallet이 Nullified event를 처리한 뒤 Transact event를 처리하기 전에 종료된 경우입니다. C₁₀은 spent로 바뀌었지만 거스름 C₄는 아직 반영되지 않아 화면 잔액은 0입니다. 이대로 굳으면 output 누락입니다. On-chain 상태는 이미 3단계 그대로입니다.",
  },
  {
    label: "재시작",
    summary: "event 순서대로 재생 → 다시 4",
    note: "재시작한 wallet이 sync cursor부터 event를 순서대로 다시 읽어 Transact까지 반영합니다. 잔액이 4로 돌아오고 기준선 receipt와 같아야 통과입니다. Local cache를 기준으로 nullifier를 되살리면 이 비교가 깨집니다.",
  },
] as const;

type Mark = "off" | "on" | "focus" | "bad";

const tone: Record<Mark, string> = {
  off: "border-dashed border-border/60 text-muted-foreground/60",
  on: "border-border text-foreground",
  focus: "border-primary text-primary font-semibold",
  bad: "border-amber-600 text-amber-700 dark:text-amber-300 font-semibold",
};

function Chip({ mark, children }: { mark: Mark; children: string }) {
  return <span className={`inline-flex min-h-6 items-center whitespace-nowrap rounded border px-1.5 text-[11px] leading-4 ${tone[mark]}`}>{children}</span>;
}

function Line({ children }: { children: ReactNode }) {
  return <div className="flex min-h-6 min-w-0 flex-wrap items-center gap-1 border-t border-border/60 py-0.5 sm:min-h-7 sm:py-1 text-[11px] leading-4 first:border-0">{children}</div>;
}

function Panel({ title, active, children }: { title: string; active: boolean; children: ReactNode }) {
  return (
    <section className={`grid min-w-0 grid-cols-[3.5rem_minmax(0,1fr)] gap-x-1 rounded-lg border px-2 py-1 sm:block sm:p-3 ${active ? "border-primary" : "border-border"}`}>
      <h5 className={`pt-1.5 text-[11px] font-bold leading-4 sm:pt-0 sm:text-xs ${active ? "text-primary" : "text-muted-foreground"}`}>{title}</h5>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function RailgunNoteStateViz() {
  return (
    <SceneShell
      eyebrow="기준선 fixture"
      title="값 10 note 하나가 6과 4로 나뉠 때 세 곳의 상태가 바뀌는 순서"
      description="세 칸은 계약 state, proof, wallet view입니다. 같은 송금을 정상 실행한 뒤 replay와 sync 중단을 같은 그림에서 이어 봅니다. 6은 받는 사람, 4는 보낸 사람의 거스름입니다."
      note="격리한 test chain 기준 계획입니다. 새 leaf 위치와 새 root 값은 글이 정하지 않아 이름만 적었습니다."
      ariaLabel="RAILGUN 기준선 송금에서 계약, proof, wallet 상태가 바뀌는 일곱 장면"
      scenes={SCENES}
      render={(active) => {
        const onChain = active >= 2;
        const leafNew: Mark = !onChain ? "off" : active === 2 ? "focus" : "on";
        const txLine = active < 2 ? "아직 제출 전" : active === 4 ? "N₂₃ 재제출 → revert" : active === 2 ? "Transact 성공" : "Transact 성공 (그대로)";
        const proofText = active === 0 ? "아직 없음" : active === 4 ? "proof만으로는 못 막음" : "verify PASS";
        const nullifiedDone = active === 3 || active === 4 || active >= 5;
        const transactDone = active === 3 || active === 4 || active === 6;
        const balance = active < 3 ? "10" : active === 5 ? "0 (C₄ 누락)" : "4";
        return (
          <div className="grid min-w-0 gap-2 sm:grid-cols-3 sm:gap-3">
            <Panel title="계약" active={active === 2 || active === 4}>
              <Line>
                <Chip mark={onChain ? "on" : "focus"}>{onChain ? "leaf 23 · C₁₀" : "leaf 23 · C₁₀ = 10"}</Chip>
                <Chip mark={leafNew}>+ C₆</Chip>
                <Chip mark={leafNew}>+ C₄</Chip>
              </Line>
              <Line>
                <Chip mark={onChain ? (active === 2 ? "focus" : "on") : "on"}>{onChain ? "root: 새 root" : "root: R100"}</Chip>
                <Chip mark={!onChain ? "off" : active === 2 || active === 4 ? "focus" : "on"}>{onChain ? "N₂₃ used" : "N₂₃ 미기록"}</Chip>
              </Line>
              <Line>
                <span className={active === 4 ? "font-semibold text-amber-700 dark:text-amber-300" : "text-foreground"}>{`tx: ${txLine}`}</span>
              </Line>
            </Panel>

            <Panel title="proof" active={active === 1}>
              <Line>
                <Chip mark={active === 1 ? "focus" : active === 0 ? "off" : "on"}>C₁₀ ∈ R100 · N₂₃</Chip>
                <Chip mark={active === 1 ? "focus" : active === 0 ? "off" : "on"}>10 = 6 + 4</Chip>
              </Line>
              <Line>
                <Chip mark={active === 1 ? "bad" : "off"}>틀린 witness 6 + 5 = 11 → 실패</Chip>
              </Line>
              <Line>
                <span className={active === 4 ? "font-semibold text-amber-700 dark:text-amber-300" : active === 0 ? "text-muted-foreground" : "text-foreground"}>{`판정: ${proofText}`}</span>
              </Line>
            </Panel>

            <Panel title="wallet" active={active === 3 || active >= 5}>
              <Line>
                <Chip mark={!nullifiedDone ? "off" : active >= 5 ? "focus" : "on"}>{nullifiedDone ? "Nullified ✓" : "Nullified"}</Chip>
                <Chip mark={transactDone ? (active === 6 ? "focus" : "on") : active === 5 ? "bad" : "off"}>{transactDone ? "Transact ✓" : active === 5 ? "Transact ✗ 중단" : "Transact"}</Chip>
              </Line>
              <Line>
                <Chip mark={active === 5 ? "bad" : active === 3 || active === 6 ? "focus" : "on"}>{`보낸 쪽 잔액 ${balance}`}</Chip>
                <Chip mark={transactDone ? (active === 3 ? "focus" : "on") : "off"}>{transactDone ? "받는 쪽 C₆ = 6" : active === 5 ? "받는 쪽: 별도 wallet" : "받는 쪽 없음"}</Chip>
              </Line>
              <Line>
                <span className="text-foreground">{nullifiedDone ? "C₁₀: spent" : "C₁₀: 미사용"}</span>
              </Line>
            </Panel>
          </div>
        );
      }}
    />
  );
}
