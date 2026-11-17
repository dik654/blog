import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #data-password-boundary — 계좌번호는 다시 읽어야 하므로 AEAD encryption,
 * 비밀번호는 원문 복원이 필요 없으므로 salt가 있는 password hash.
 * 저장 → 다시 쓸 때 → DB·hash dump 실패 재생(기대 oracle: plaintext 0).
 */
type Lane = readonly [string, string, string];

const SCENES = [
  {
    label: "저장할 때",
    summary: "계좌번호 → AEAD · 비밀번호 → hash",
    account: ["계좌번호 원문", "data key(DEK)로 AEAD 암호화", "ciphertext·nonce·tag·key ID·schema 저장"] as Lane,
    password: ["비밀번호 원문 + 계정별 salt", "Argon2id 등 password hash", "hash·salt·parameter·algorithm/version 저장"] as Lane,
    note: "같은 '저장'이지만 결과물이 다릅니다. 계좌번호는 key가 있으면 되돌릴 수 있는 ciphertext로, 비밀번호는 되돌리는 절차가 없는 hash로 남습니다. AEAD는 암호화와 함께 변조를 확인하는 tag를 만드는 방식이고, DEK(data-encryption key)는 data를 직접 암호화하는 key입니다.",
  },
  {
    label: "다시 쓸 때",
    summary: "복호화 vs 재계산·비교",
    account: ["업무 조회 요청", "복호화 호출을 따로 authorize·audit", "원문 계좌번호로 업무 처리"] as Lane,
    password: ["login 때 입력한 비밀번호", "저장된 salt·parameter로 다시 hash", "저장된 hash와 비교 → 같으면 통과"] as Lane,
    note: "계좌번호는 업무상 원문이 다시 필요하므로 복호화합니다. 비밀번호는 원문을 꺼내지 않고, 입력값을 같은 방식으로 다시 계산해 저장된 hash와 같은지만 봅니다.",
  },
  {
    label: "DB·hash dump 유출 재생",
    summary: "기대 oracle: plaintext 0",
    account: ["dump에 든 것: ciphertext 등", "복호화는 KMS·업무 authorize를 모두 통과해야 함", "기대 결과: plaintext 0"] as Lane,
    password: ["dump에 든 것: hash·salt·parameter", "공격자가 추측값을 넣어 offline guess", "plaintext 0 · guess 비용과 breached-password policy 측정"] as Lane,
    note: "본문 release gate의 첫 실패 주입입니다. 기대 결과는 두 경로 모두 plaintext 0이고, 비밀번호 쪽은 추측해 다시 계산하는 offline guess의 비용을 따로 측정합니다. 결과가 아니라 검사해야 할 기준입니다.",
  },
] as const;

function Row({ title, tone, steps }: { title: string; tone: "blue" | "amber"; steps: Lane }) {
  const border = tone === "blue" ? "border-[#2563eb]" : "border-[#b45309]";
  const text = tone === "blue" ? "text-[#1d4ed8] dark:text-[#93c5fd]" : "text-[#92400e] dark:text-[#fcd34d]";
  return (
    <div className="min-w-0">
      <p className={`text-xs font-bold ${text}`}>{title}</p>
      <ol className="mt-2 grid min-w-0 gap-2 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step} className={`flex min-w-0 items-start gap-2 rounded-lg border bg-background px-3 py-2 text-xs leading-5 ${i === 2 ? border : "border-border"}`}>
            <span className={`font-mono font-bold ${text}`}>{i + 1}</span>
            <span className="min-w-0 break-words">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function RestoreOrVerifyViz() {
  return (
    <SceneShell
      eyebrow="복원 vs 검증"
      title="다시 읽어야 하는 계좌번호와 맞는지만 보면 되는 비밀번호는 다른 길을 갑니다"
      description="위 줄은 급여 계좌번호, 아래 줄은 로그인 비밀번호입니다. 칸은 번호 순서대로 일어나고, 테두리 색이 있는 칸이 그 장면의 결과입니다."
      ariaLabel="계좌번호 암호화와 비밀번호 hash가 저장, 재사용, 유출 재생에서 어떻게 다른지 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="space-y-4">
              <Row title="급여 계좌번호 · 복원이 필요함" tone="blue" steps={scene.account} />
              <Row title="로그인 비밀번호 · 검증만 필요함" tone="amber" steps={scene.password} />
            </div>
          ))}
        />
      )}
    />
  );
}
