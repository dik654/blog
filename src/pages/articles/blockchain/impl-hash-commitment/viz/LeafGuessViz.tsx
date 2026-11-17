import SceneShell from "./SceneShell";

/**
 * 본문 대응: #commitment-meaning — 후보가 작으면 후보마다 leaf hash와 path를 계산해 내용을 맞힌다.
 * 후보 집합 {a,b,c,d}는 설명용 가정. sibling H(d)=dd761f8d…, H(a,b)=c91d8084…, index 2, expected root 004b7b71…
 * 후보별 SHA-256(tree v1 schema) 재계산:
 *  a: leaf 5ce0c367… → root b20bbeab…  b: leaf 4af98d9d… → root aee677f5…
 *  c: leaf aa8d78cb… → root 004b7b71… (일치)  d: leaf dd761f8d… → root 706b1df1…
 */
const ROWS = [
  { cand: "a", leaf: "5ce0c367…", root: "b20bbeab…", hit: false },
  { cand: "b", leaf: "4af98d9d…", root: "aee677f5…", hit: false },
  { cand: "c", leaf: "aa8d78cb…", root: "004b7b71…", hit: true },
  { cand: "d", leaf: "dd761f8d…", root: "706b1df1…", hit: false },
] as const;

const SCENES = [
  {
    label: "공개된 값",
    summary: "leaf 값만 모름",
    note: "공격자가 expected root 004b7b71…, index 2, sibling H(d)와 H(a,b)를 봤고 leaf 값만 모른다고 해 봅니다. 그 값이 a·b·c·d 네 글자 중 하나라는 것까지 안다고 가정합니다.",
  },
  {
    label: "후보 a를 넣어 봅니다",
    summary: "root b20bbeab… ≠ 004b7b71…",
    note: "후보 a를 같은 leaf 입력 형식으로 hash하고, 같은 index bit와 sibling으로 root까지 올라갑니다. 나온 root가 expected와 다르므로 a는 아닙니다.",
  },
  {
    label: "후보 b도 같은 계산",
    summary: "root aee677f5… ≠ 004b7b71…",
    note: "b도 다릅니다. 검증자가 쓰는 공개 계산을 그대로 반복할 뿐이라 별도 비밀이 필요하지 않습니다.",
  },
  {
    label: "후보 c에서 root가 맞습니다",
    summary: "root 004b7b71… = expected",
    note: "c에서 expected root가 나와 leaf 내용이 c임을 맞혔습니다. Root가 inclusion을 묶어도 작은 후보 집합의 내용은 숨기지 못한다는 뜻입니다. Hiding이 필요하면 본문대로 salt, blinding 또는 별도 commitment scheme이 필요합니다.",
  },
] as const;

export default function LeafGuessViz() {
  return (
    <SceneShell
      eyebrow="inclusion ≠ hiding"
      title="후보가 네 개뿐이면 하나씩 root를 계산해 leaf 내용을 맞힐 수 있습니다"
      description="앞 절의 tree v1과 같은 sibling·index를 씁니다. 후보 집합이 a·b·c·d 네 글자라는 것은 설명용 가정입니다. 값은 SHA-256으로 다시 계산한 앞 8자리입니다."
      ariaLabel="공개된 root, index, sibling으로 후보 a, b, c를 차례로 계산해 c에서 expected root가 나오는 네 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-3 gap-px bg-border p-px text-center text-[11px] sm:text-xs">
            {[
              ["expected root", "004b7b71…"],
              ["index", "2 (10₂)"],
              ["sibling", "dd761f8d…\nc91d8084…"],
            ].map(([name, value]) => (
              <div key={name} className="min-w-0 bg-background px-1.5 py-2">
                <span className="block text-muted-foreground">{name}</span>
                <strong className="mt-0.5 block whitespace-pre-line font-mono">{value}</strong>
              </div>
            ))}
          </div>
          <div className="grid gap-px bg-border p-px font-mono text-[11px] sm:text-xs">
            <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)_3.5rem] gap-2 bg-background px-2 py-1.5 font-sans text-muted-foreground">
              <span>후보</span>
              <span>leaf hash</span>
              <span>계산한 root</span>
              <span className="text-right">판정</span>
            </div>
            {ROWS.map((row, index) => {
              const tried = index < active;
              const skipped = active === 3 && index === 3;
              return (
                <div
                  key={row.cand}
                  className={`grid grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)_3.5rem] items-center gap-2 bg-background px-2 py-2 ${
                    tried ? "" : "text-muted-foreground/50"
                  }`}
                >
                  <strong className={tried ? (row.hit ? "text-[#16a34a]" : "") : ""}>{row.cand}</strong>
                  <span className="truncate">{tried ? row.leaf : "—"}</span>
                  <span className="truncate">{tried ? row.root : "—"}</span>
                  <span
                    className={`text-right font-sans font-semibold ${tried ? (row.hit ? "text-[#16a34a]" : "text-[#dc2626]") : ""}`}
                  >
                    {tried ? (row.hit ? "일치" : "다름") : skipped ? "불필요" : "대기"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
