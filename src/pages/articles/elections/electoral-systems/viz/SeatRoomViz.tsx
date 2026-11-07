import SceneShell from "./SceneShell";
import { PARTY_COLORS, PARTY_NAMES, PARTY_SHORT } from "./parties";

/**
 * 본문 대응: #district-magnitude — 선거구 크기는 나눌 자리를, 배분 규칙은 실제 결과를 정한다.
 * 득표 46·44·10은 설명용(가정). 열 석 비례는 몫 460·440·230·220·153.3·146.7·115·110·100·92 → 5·4·1.
 */
const VOTES: readonly number[] = [46, 44, 10];

const SCENES: readonly { label: string; summary: string; note: string; slots: number; seats: readonly number[] }[] = [
  {
    label: "한 명만 뽑으면",
    summary: "1자리 → 1 · 0 · 0",
    slots: 1,
    seats: [1, 0, 0],
    note: "한 자리는 여러 정당에 나눠 줄 수 없습니다. 어느 규칙을 쓰든 한 정당만 그 자리를 얻습니다. 여기서는 1등에게 준다고 두었습니다(가정).",
  },
  {
    label: "열 명을 비례로 나누면",
    summary: "10자리 → 5 · 4 · 1",
    slots: 10,
    seats: [5, 4, 1],
    note: "자리가 많아지면 나눌 여지가 생깁니다. 이 예에서는 표를 1·2·3…으로 나눈 몫을 큰 순서로 고르는 방식(뒤 절에서 다룹니다)으로 나눴고, 10퍼센트를 받은 다당도 한 석을 얻습니다.",
  },
  {
    label: "열 명을 1등에게 모두 주면",
    summary: "10자리 → 10 · 0 · 0",
    slots: 10,
    seats: [10, 0, 0],
    note: "자리 수는 앞 장면과 같습니다. 그런데 열 석을 모두 1등 정당에 주는 정당 블록 투표에서는 선거구가 커져도 결과가 비례에 가까워지지 않습니다.",
  },
];

export default function SeatRoomViz() {
  return (
    <SceneShell
      eyebrow="선거구 크기 × 배분 규칙"
      title="자리 수는 나눌 여지를, 배분 규칙은 실제 결과를 정합니다"
      description="한 선거구의 득표를 46·44·10퍼센트로 고정하고(가정) 뽑는 수(선거구 크기)와 배분 규칙만 바꿉니다."
      ariaLabel="선거구 크기와 배분 규칙에 따른 의석 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const sequence = scene.seats.flatMap((count, party) => Array.from({ length: count }, () => party));
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground">득표율 · 세 장면 모두 고정</p>
              <div className="mt-1 flex h-6 w-full overflow-hidden rounded-sm border border-border">
                {VOTES.map((v, p) => (
                  <div key={PARTY_NAMES[p]} style={{ width: `${v}%`, backgroundColor: `${PARTY_COLORS[p]}66` }} />
                ))}
              </div>
              <p className="mt-1 flex flex-wrap gap-x-3 text-xs font-bold">
                {VOTES.map((v, p) => (
                  <span key={PARTY_NAMES[p]} style={{ color: PARTY_COLORS[p] }}>
                    {PARTY_NAMES[p]} {v}%
                  </span>
                ))}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground">선거구의 자리 · {scene.slots}석</p>
              <div className="mt-1 grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }, (_, slot) => {
                  const party = sequence[slot];
                  const exists = slot < scene.slots;
                  return (
                    <div
                      key={slot}
                      className={`flex h-9 min-w-0 items-center justify-center rounded-sm border text-xs font-bold ${exists ? "" : "border-dashed border-border/40"}`}
                      style={exists ? { borderColor: PARTY_COLORS[party], backgroundColor: `${PARTY_COLORS[party]}26`, color: PARTY_COLORS[party] } : undefined}
                    >
                      {exists ? PARTY_SHORT[party] : ""}
                    </div>
                  );
                })}
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                의석률 {scene.seats.map((count, p) => `${PARTY_NAMES[p]} ${Math.round((count / scene.slots) * 100)}%`).join(" · ")}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
