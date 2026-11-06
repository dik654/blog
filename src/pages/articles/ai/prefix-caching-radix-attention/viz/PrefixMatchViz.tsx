import SceneShell from "./SceneShell";
import { TokenRow, type CellTone } from "./TokenCell";

/**
 * 본문 대응: #small-case — 재사용은 처음부터 연속으로 같은 구간에서만 성립한다.
 * R2는 앞 6, [0,2,…,8]은 뒤 일곱 번호가 같아도 0. 장부에 넣는 요청에 따라 6/8=75%와 12/24=50%로 갈린다.
 */
const R1 = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const R2 = [1, 2, 3, 4, 5, 6, 9, 10] as const;
const R3 = [1, 2, 3, 4, 5, 6, 11, 12] as const;
const R0 = [0, 2, 3, 4, 5, 6, 7, 8] as const;

const tones = (hit: number, length = 8): CellTone[] => Array.from({ length }, (_, i) => (i < hit ? "hit" : "calc"));
const STORED: readonly CellTone[] = Array.from({ length: 8 }, () => "stored");

const SCENES = [
  { label: "앞에서부터 비교", summary: "R2: 재사용 6 · 계산 2", note: "일곱째의 7과 9에서 비교가 멈춥니다. 앞 여섯 칸의 기록을 가져오고 뒤 두 칸을 새로 계산합니다. R3도 같은 자리에서 멈춥니다." },
  { label: "첫 칸이 다르면", summary: "재사용 0 · 계산 8", note: "뒤의 일곱 번호는 R1과 같지만 비교는 첫 칸에서 끝납니다. 앞을 읽으며 생긴 기록이 뒤 계산에도 영향을 주므로 뒤 번호가 같아도 그 기록을 가져올 수 없습니다." },
  { label: "장부에 무엇을 넣는가", summary: "6/8 = 75% · 12/24 = 50%", note: "R2만 보면 8칸 중 6칸, 처음 준비한 R1과 R3까지 넣으면 24칸 중 12칸입니다. 어떤 요청을 세느냐에 따라 비율이 달라집니다." },
];

const COMPARE = (a: readonly number[], b: readonly number[]) => a.map((value, i) => (value === b[i] ? "=" : "≠"));

function Marks({ marks, stopAt }: { marks: readonly string[]; stopAt: number }) {
  return (
    <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-2">
      <span />
      <div className="grid grid-cols-8 gap-1 text-center font-mono text-xs leading-5">
        {marks.map((mark, i) => (
          <span key={i} className={i === stopAt ? "font-bold text-[#dc2626]" : i > stopAt ? "text-muted-foreground/50" : "text-[#15803d] dark:text-[#86efac]"}>
            {i > stopAt ? "·" : mark}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PrefixMatchViz() {
  return (
    <SceneShell
      eyebrow="(가정) 입력 번호 비교"
      title="재사용은 첫 칸부터 이어진 구간에서만 셉니다"
      description="칸 하나가 입력 한 자리입니다. 회색은 저장된 기록, 초록은 재사용, 주황은 새로 계산, 빨강은 첫 차이입니다."
      ariaLabel="요청의 앞부분을 저장된 기록과 비교해 재사용 길이를 정하는 과정"
      scenes={SCENES}
      render={(index) => {
        if (index === 2) {
          return (
            <div className="space-y-1.5">
              <TokenRow name="R1" values={R1} tones={tones(0)} />
              <TokenRow name="R2" values={R2} tones={tones(6)} />
              <TokenRow name="R3" values={R3} tones={tones(6)} />
              <dl className="grid grid-cols-2 gap-3 pt-3 font-mono text-xs">
                <div className="rounded-lg border border-border p-3">
                  <dt className="text-muted-foreground">R2만 세면</dt>
                  <dd className="mt-1 text-sm font-bold">6 / 8 = 75%</dd>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <dt className="text-muted-foreground">R1·R2·R3 전부</dt>
                  <dd className="mt-1 text-sm font-bold">(0+6+6) / 24 = 50%</dd>
                </div>
              </dl>
            </div>
          );
        }
        const subject = index === 0 ? R2 : R0;
        const hit = index === 0 ? 6 : 0;
        const subjectTones: CellTone[] = subject.map((_, i) => (i < hit ? "hit" : i === hit ? "miss" : "calc"));
        const stopAt = hit;
        return (
          <div className="space-y-1">
            <TokenRow name="R1 기록" values={R1} tones={STORED} />
            <Marks marks={COMPARE(R1, subject)} stopAt={stopAt} />
            <TokenRow name={index === 0 ? "R2" : "새 입력"} values={subject} tones={subjectTones} />
            {index === 1 && (
              <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-2 pt-2">
                <span />
                <p className="text-xs leading-5 text-muted-foreground">둘째 칸부터 번호는 R1과 같아도 비교하지 않습니다.</p>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
