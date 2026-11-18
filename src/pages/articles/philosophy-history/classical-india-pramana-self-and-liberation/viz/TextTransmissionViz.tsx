import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 두 숫자(나이야 넷, 불교 둘)가 어떤 문헌 경로로 확인되는가.
 * 나이야: 『니야야 수트라』 1.1.3 → 비댜부샤나 1913년 영역본, 그리고 현존 최고 주석가 바츠야야나(4세기)의 문장 → Stanford 인용.
 * 불교: 디그나가 『프라마나사뭇차야』 1.2ab(540년 직전 마지막 저작). 산스크리트 원본은 2005년 기준 미발견 →
 * 슈타인켈너가 같은 해 티베트어 번역 두 종·산스크리트 단편·지넨드라부디 주석으로 재구성한 본문에서 확인.
 */
const SCENES = [
  { label: "나이야의 넷: 경전 한 조목에서 두 길로", summary: "1.1.3 → 영역본 · 주석", note: "네 프라마나 목록은 『니야야 수트라』 1권 1장 3번째 수트라(1.1.3)에 있습니다. 비댜부샤나의 1913년 영역본이 이 조목을 옮겼고, Stanford 철학백과는 현존하는 가장 오래된 주석가 바츠야야나(4세기)의 문장에서 이 넷을 인용합니다." },
  { label: "불교의 둘: 원본이 비어 있습니다", summary: "산스크리트 원본 · 2005년 기준 미발견", note: "두 통로라는 숫자는 디그나가가 540년 직전에 쓴 마지막 저작 『프라마나사뭇차야』 1장 둘째 게송 앞부분(1.2ab)에서 나옵니다. 그런데 이 책의 산스크리트 원본은 2005년 기준 발견되지 않았습니다." },
  { label: "남은 자료 셋으로 본문을 다시 세웁니다", summary: "3 갈래 → 재구성본 → 1.2ab", note: "슈타인켈너가 같은 해 티베트어 번역 두 종, 남은 산스크리트 단편, 지넨드라부디의 주석을 모아 본문을 재구성했습니다. 이 글은 “지각과 추론이 두 프라마나” 구절을 그 재구성본에서 확인했습니다." },
] as const;

function Box({ title, children, tone = "plain" }: { title: string; children: ReactNode; tone?: "plain" | "missing" | "accent" }) {
  const border = tone === "missing" ? "border-dashed border-red-600/70 text-muted-foreground" : tone === "accent" ? "border-primary bg-primary/10" : "border-border";
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 sm:px-3 ${border}`}>
      <span className="block text-xs text-muted-foreground">{title}</span>
      <div className="text-xs font-semibold leading-5 [overflow-wrap:anywhere] [word-break:keep-all] sm:text-sm sm:leading-6">{children}</div>
    </div>
  );
}

function Down() {
  return (
    <p aria-hidden className="text-center text-sm leading-4 text-primary">
      ↓
    </p>
  );
}

function Nyaya() {
  return (
    <div className="min-w-0 space-y-2">
      <Box title="경전 · 『니야야 수트라』 1.1.3" tone="accent">지각 · 추론 · 비교 · 증언</Box>
      <Down />
      <div className="grid gap-2 sm:grid-cols-2">
        <Box title="길 1 · 비댜부샤나 1913년 영역본">“Perception, inference, comparison and word (verbal testimony)”</Box>
        <div className="min-w-0 space-y-2">
          <Box title="길 2 · 바츠야야나(4세기)">현존하는 가장 오래된 주석</Box>
          <Down />
          <Box title="Stanford 철학백과">바츠야야나의 문장에서 넷을 인용</Box>
        </div>
      </div>
    </div>
  );
}

function Buddhist({ rebuilt }: { rebuilt: boolean }) {
  return (
    <div className="min-w-0 space-y-2">
      <Box title="디그나가 · 『프라마나사뭇차야』(540년 직전, 마지막 저작)">1장(지각 장) 1.2ab</Box>
      <Down />
      <Box title="산스크리트 원본" tone="missing">
        2005년 기준 발견되지 않음
      </Box>
      <div className={`space-y-2 ${rebuilt ? "" : "opacity-30"}`}>
        <div className="grid grid-cols-3 gap-2">
          <Box title="자료 1">티베트어 번역 두 종</Box>
          <Box title="자료 2">산스크리트 단편</Box>
          <Box title="자료 3">지넨드라부디 주석</Box>
        </div>
        <Down />
        <Box title="슈타인켈너 재구성본(2005)" tone={rebuilt ? "accent" : "plain"}>
          pratyakṣam anumānaṃ ca pramāṇe
          <span className="block text-xs font-normal text-muted-foreground">지각과 추론이 두 프라마나</span>
        </Box>
      </div>
    </div>
  );
}

export default function TextTransmissionViz() {
  return (
    <SceneShell
      eyebrow="숫자의 문헌 경로"
      title="‘넷’과 ‘둘’은 어떤 문헌을 거쳐 확인되나"
      description="위에서 아래로 내려갈수록 이 글이 실제로 확인한 자료에 가까워집니다. 점선 빨간 칸은 2005년 기준 발견되지 않은 자료입니다. 프라마나는 참된 인식을 낳는 지식 통로를 뜻합니다."
      ariaLabel="나이야의 네 프라마나와 디그나가의 두 프라마나가 경전, 번역, 주석, 재구성본을 거쳐 확인되는 경로를 보이는 세 장면"
      scenes={SCENES}
      render={(active) => (active === 0 ? <Nyaya /> : <Buddhist rebuilt={active === 2} />)}
    />
  );
}
