import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — SP 800-90A Rev.1 HMAC_DRBG, 교육용 seed_material=0x03.
 * K,V 두 칸이 번갈아 바뀌는 순서. 초기 갱신 뒤 K=1d6c5843…c4264db, V=7b8ea210…a984918.
 * 첫 출력 323e…afe5, 출력 뒤 Update(빈 자료), 다음 요청 dbf1…ea03.
 * 중간 K·V 값은 본문에 없어서 K₁·V₁처럼 이름만 붙임.
 */
type Slot = { value: string; changed: boolean };

const SCENES = [
  { label: "시작 상태", summary: "K=00×32 · V=01×32", op: "초기화 시작", k: { value: "00 00 … 00", changed: false }, v: { value: "01 01 … 01", changed: false }, out: "", note: "원문 초기화의 시작값입니다. HMAC(키, 자료)는 비밀 키와 자료로 정해진 길이의 값을 계산합니다." },
  { label: "K를 먼저 바꿉니다", summary: "K₁ = HMAC(K, V‖00‖03)", op: "K ← HMAC(K, V ‖ 0x00 ‖ 0x03)", k: { value: "K₁", changed: true }, v: { value: "01 01 … 01", changed: false }, out: "", note: "옛 K를 키로, V와 0x00과 교육용 seed_material 0x03을 이은 자료를 넣습니다. ‖는 바이트 연결입니다." },
  { label: "새 K로 V를 바꿉니다", summary: "V₁ = HMAC(K₁, V)", op: "V ← HMAC(K₁, V)", k: { value: "K₁", changed: false }, v: { value: "V₁", changed: true }, out: "", note: "방금 바뀐 K₁을 키로 씁니다. 옛 K는 더 이상 쓰지 않습니다." },
  { label: "0x01로 한 번 더", summary: "초기 갱신 완료", op: "K ← HMAC(K₁, V₁ ‖ 0x01 ‖ 0x03); V ← HMAC(K, V₁)", k: { value: "1d6c5843…c4264db", changed: true }, v: { value: "7b8ea210…a984918", changed: true }, out: "", note: "입력 자료가 있으므로 0x01을 쓰는 두 번째 부분도 수행합니다. 이렇게 나온 K와 V가 본문의 초기 갱신 결과입니다." },
  { label: "첫 generate", summary: "출력 = 새 V = 323e…", op: "V ← HMAC(K, V); 출력 = V", k: { value: "1d6c5843…c4264db", changed: false }, v: { value: "323e…afe5", changed: true }, out: "323e…afe5", note: "32바이트 요청 한 번은 V를 한 번 더 HMAC해 그 값을 내보냅니다. 3절의 첫 출력입니다." },
  { label: "출력 뒤 갱신", summary: "다음 요청은 dbf1…", op: "(K, V) ← Update(빈 자료, K, V)", k: { value: "K′", changed: true }, v: { value: "V′", changed: true }, out: "dbf1…ea03", outLabel: "다음 요청이 돌려줄 값", note: "출력 뒤 빈 자료로 Update해 K와 V를 다시 바꿉니다(0x01 부분은 생략). 이 상태로 다음 요청을 처리하면 두 번째 출력이 나옵니다." },
  { label: "상태를 복사하면", summary: "두 사본 → 같은 다음 출력", op: "사본 A와 사본 B가 같은 K′, V′를 가짐", k: { value: "K′ (A·B 같음)", changed: false }, v: { value: "V′ (A·B 같음)", changed: false }, out: "A와 B가 같은 값", outLabel: "다음 요청이 돌려줄 값", note: "첫 요청 직후의 상태를 복사한 두 객체는 다음 출력이 정확히 같았습니다. 같은 상태에서 같은 결정적 계산을 따라가기 때문입니다." },
] as const;

function Register({ name, slot }: { name: string; slot: Slot }) {
  return (
    <div className="min-w-0 rounded-md border px-2 py-2 sm:px-3" style={{ borderColor: slot.changed ? "#2563eb" : "#94a3b8", backgroundColor: slot.changed ? "#2563eb14" : "transparent" }}>
      <span className="block text-xs font-bold text-muted-foreground">{name} · {slot.changed ? "이번에 바뀜" : "그대로"}</span>
      <span className={`block break-all font-mono text-xs sm:text-sm ${slot.changed ? "font-bold text-[#2563eb]" : ""}`}>{slot.value}</span>
    </div>
  );
}

export default function DrbgStateViz() {
  return (
    <SceneShell
      eyebrow="HMAC_DRBG 상태"
      title="K와 V가 번갈아 바뀌고 출력은 V에서 나옵니다"
      description="두 칸(각 32바이트)이 생성기의 비밀 상태입니다. 파란 칸이 그 단계에서 바뀐 값입니다. seed_material 0x03은 갱신 계산만 보려는 교육용 입력이며 승인된 생성기로 쓸 수 없습니다. 본문에 없는 중간값은 K₁·V₁처럼 이름만 붙였습니다."
      ariaLabel="HMAC_DRBG의 K와 V가 초기화, 생성, 출력 뒤 갱신에서 바뀌는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <p className="rounded-md border border-dashed border-border px-3 py-2 font-mono text-xs leading-5 sm:text-sm">{scene.op}</p>
            <div className="grid grid-cols-2 gap-2">
              <Register name="K" slot={scene.k} />
              <Register name="V" slot={scene.v} />
            </div>
            <p className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: scene.out ? "#16a34a" : "#cbd5e1", borderStyle: scene.out ? "solid" : "dashed" }}>
              <span className="text-xs text-muted-foreground">{"outLabel" in scene ? scene.outLabel : "돌려준 값"} </span>
              <span className={`font-mono font-semibold ${scene.out ? "text-[#16a34a]" : "text-muted-foreground/60"}`}>{scene.out || "아직 없음"}</span>
            </p>
          </div>
        );
      }}
    />
  );
}
