import XmlSceneShell from "./XmlSceneShell";

/**
 * 본문 대응: #parsing — entity 치환, XXE(file disclosure·SSRF), Billion Laughs, parser hardening.
 * Billion Laughs 장면의 “단계마다 앞 entity를 10번 참조”는 설명용 가정이다.
 * 단계 k의 entity는 기본 문자열을 10^k번 담는다 → 9단계면 1,000,000,000번.
 */
const LEVELS = Array.from({ length: 9 }, (_, i) => ({
  name: `a${i + 1}`,
  zeros: i + 1,
  copies: (10 ** (i + 1)).toLocaleString("en-US"),
}));

const SCENES = [
  {
    label: "Entity는 이름을 text로 바꿉니다",
    summary: "&team; → 환불팀",
    note: "문서 앞의 선언부인 DTD(Document Type Definition)에서 team이라는 entity를 선언하면 parser는 본문의 &team;을 선언된 text로 바꿔 넣습니다. 여기까지는 단순한 치환입니다.",
  },
  {
    label: "External entity는 바깥을 읽게 합니다",
    summary: "file · URL → 문서 안으로",
    note: "치환할 text 대신 local file이나 URL을 가리키면, untrusted document가 server의 parser에게 그 파일이나 주소를 읽게 만들 수 있습니다. 결과는 file disclosure, SSRF, denial of service가 될 수 있고, 이를 XXE라고 부릅니다.",
  },
  {
    label: "반복 확장은 network 없이도 커집니다",
    summary: "선언 10줄 → ha 10억 번 (가정)",
    note: "각 entity가 앞 entity를 10번 참조한다고 가정하면 한 단계마다 10배가 됩니다. 아홉 단계면 짧은 선언 몇 줄이 ‘ha’ 1,000,000,000번으로 펼쳐집니다. 외부 file이나 network를 쓰지 않으므로 XXE 설정 하나로 끝낼 수 없습니다.",
  },
  {
    label: "선언을 끄고, 남는 자원에 상한을 둡니다",
    summary: "DTD·external·network 끄기 + limit",
    note: "기본 원칙은 DTD와 external entity resolution, external DTD, XInclude, network access를 쓰지 않는 것입니다. 그 위에 size·depth·길이·entity expansion·CPU time·memory limit을 두고, 실제 parser version을 공격 fixture로 시험합니다.",
  },
] as const;

function Code({ lines }: { lines: readonly string[] }) {
  return (
    <pre className="min-w-0 overflow-x-auto whitespace-pre-wrap break-all border border-border bg-muted/20 px-2 py-2 font-mono text-[10px] leading-5 sm:text-[11px]">
      {lines.join("\n")}
    </pre>
  );
}

function Arrow() {
  return <span aria-hidden="true" className="self-center text-center text-sm font-bold text-muted-foreground">↓</span>;
}

function SubstituteScene() {
  return (
    <div className="grid min-w-0 gap-2">
      <p className="text-[10px] font-bold text-muted-foreground">입력 문서</p>
      <Code lines={['<!DOCTYPE r [', '  <!ENTITY team "환불팀">', ']>', '<r>&team;</r>']} />
      <Arrow />
      <p className="text-[10px] font-bold text-muted-foreground">parser가 만든 내용</p>
      <Code lines={["<r>환불팀</r>"]} />
    </div>
  );
}

function ExternalScene() {
  return (
    <div className="grid min-w-0 gap-2">
      <p className="text-[10px] font-bold text-muted-foreground">공격자가 보낸 문서 (설명용 가정)</p>
      <Code lines={['<!DOCTYPE r [', '  <!ENTITY x SYSTEM "file:///…">', ']>', '<r>&x;</r>']} />
      <Arrow />
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="min-w-0 border border-red-600 px-2 py-2">
          <p className="font-mono text-[11px] font-bold">file:///…</p>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">server의 local file 내용이 문서 안으로 들어옴</p>
          <p className="mt-1 text-xs font-bold text-red-700 dark:text-red-400">✕ file disclosure</p>
        </div>
        <div className="min-w-0 border border-red-600 px-2 py-2">
          <p className="font-mono text-[11px] font-bold">http://…</p>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">SYSTEM 값이 URL이면 server가 공격자가 고른 주소로 요청을 보냄</p>
          <p className="mt-1 text-xs font-bold text-red-700 dark:text-red-400">✕ SSRF</p>
        </div>
      </div>
    </div>
  );
}

function ExpansionScene() {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground">입력 · 선언 10줄 (가정)</p>
        <Code
          lines={[
            '<!ENTITY a0 "ha">',
            '<!ENTITY a1 "&a0;×10">',
            '<!ENTITY a2 "&a1;×10">',
            "  …",
            '<!ENTITY a9 "&a8;×10">',
            "<r>&a9;</r>",
          ]}
        />
        <p className="mt-1 text-[10px] leading-4 text-muted-foreground">×10은 같은 참조를 열 번 적었다는 뜻</p>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground">펼친 뒤 ‘ha’ 개수 · 막대 한 칸 = 10배</p>
        <ol className="mt-1 space-y-0.5">
          {LEVELS.map((level) => (
            <li key={level.name} className="grid grid-cols-[1.6rem_minmax(0,1fr)_6.6rem] items-center gap-1.5">
              <span className="font-mono text-[10px] text-muted-foreground">{level.name}</span>
              <span className="grid h-3 grid-cols-9 gap-px">
                {Array.from({ length: 9 }, (_, cell) => (
                  <span
                    key={cell}
                    className={cell < level.zeros ? (level.zeros === 9 ? "bg-red-600" : "bg-amber-600/70") : "bg-muted/40"}
                  />
                ))}
              </span>
              <span className="text-right font-mono text-[10px] font-bold">{level.copies}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const DEFENSES = [
  ["DTD", "끔"],
  ["external entity·external DTD", "끔"],
  ["XInclude·network access", "끔"],
  ["size·depth·attribute·text 길이", "limit"],
  ["entity expansion·CPU time·memory", "limit"],
  ["parser version + 공격 fixture", "기록·시험"],
] as const;

function DefenseScene() {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
      <ul className="min-w-0 space-y-1">
        {DEFENSES.map(([item, action]) => (
          <li key={item} className="grid grid-cols-[minmax(0,1fr)_4.5rem] gap-2 border border-border px-2 py-1.5 text-[11px]">
            <span className="min-w-0 break-keep">{item}</span>
            <strong className="text-right text-blue-700 dark:text-blue-400">{action}</strong>
          </li>
        ))}
      </ul>
      <div className="min-w-0 space-y-2 text-[11px] leading-5">
        <p className="border-l-2 border-green-600 pl-2">
          <strong>2장면 · file·URL</strong>
          <span className="block text-muted-foreground">external entity와 network를 쓰지 않으므로 읽으러 가지 않음</span>
        </p>
        <p className="border-l-2 border-green-600 pl-2">
          <strong>3장면 · 반복 확장</strong>
          <span className="block text-muted-foreground">DTD를 쓰지 않고, expansion·memory·time 상한으로 한 번 더 막음</span>
        </p>
        <p className="border-l-2 border-border pl-2 text-muted-foreground">
          prompt에 태그를 쓰는 일과 server가 untrusted XML을 parse하는 일은 다른 위협면입니다.
        </p>
      </div>
    </div>
  );
}

export default function UntrustedEntityViz() {
  return (
    <XmlSceneShell
      eyebrow="Untrusted XML parsing"
      title="Entity 치환 하나가 파일 읽기와 폭발적 확장으로 이어지는 경로"
      description="untrusted XML을 받은 server의 parser가 DTD를 허용할 때 일어날 수 있는 일을 차례로 봅니다. 문서 내용과 확장 배수는 설명용 가정입니다."
      ariaLabel="entity 치환, external entity, 반복 확장, parser 방어 설정의 네 장면"
      scenes={SCENES}
      render={(index) =>
        index === 0 ? <SubstituteScene /> : index === 1 ? <ExternalScene /> : index === 2 ? <ExpansionScene /> : <DefenseScene />
      }
    />
  );
}
