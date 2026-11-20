import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names(6절)와 #comparison(9절), #picture(4절).
 * AWS: CLF-C02 입구 → SAA-C03(설계)·DVA-C02(개발, 2026-11-30까지, 그 뒤 DVA-C03)·SOA-C03(운영).
 * Azure: AZ-900 입구 → AZ-104(관리) / AI-200(AI 백엔드 개발) / AZ-104 자격 + AZ-305 = Solutions Architect Expert / AZ-400(DevOps, Expert 자격은 Associate 선행).
 * 9절: AZ-204는 2026년 10월 기준 폐지, AZ-305만으로는 Expert가 아님. 4절: 경험이 있으면 관리·설계 시험으로 바로 갈 수 있음.
 */
type Focus = "aws" | "azure" | "expert" | "dates";

const SCENES = [
  {
    label: "AWS: 입구 하나, 역할 세 갈래",
    summary: "CLF-C02 → SAA · DVA · SOA",
    focus: "aws",
    note: "기초 입구는 CLF-C02입니다. 그 뒤 맡을 결정에 따라 설계는 SAA-C03, 개발은 DVA-C02, 운영은 SOA-C03으로 갈립니다. 점선은 ‘이어진다’는 뜻이지 반드시 거쳐야 한다는 뜻이 아닙니다. 4절처럼 서버·네트워크를 운영해 봤다면 입구를 건너뛰고 관리·설계 시험으로 바로 갈 수 있습니다.",
  },
  {
    label: "Azure: 입구 하나, 역할 네 갈래",
    summary: "AZ-900 → AZ-104 · AI-200 · Expert · AZ-400",
    focus: "azure",
    note: "Azure의 기초 입구는 AZ-900, 관리 실무는 AZ-104입니다. AI 백엔드 개발은 AI-200, 설계는 Solutions Architect Expert, DevOps는 AZ-400으로 이어집니다.",
  },
  {
    label: "설계 Expert에는 시험 두 개가 필요합니다",
    summary: "AZ-104 자격 + AZ-305",
    focus: "expert",
    note: "AZ-305에 합격해도 그것만으로 Solutions Architect Expert가 되지 않습니다. 공식 자격 페이지는 Azure Administrator Associate(AZ-104로 얻는 자격)를 선행 자격, 즉 먼저 갖고 있어야 하는 자격으로 요구합니다. DevOps Engineer Expert도 AZ-400만으로는 나오지 않고 Associate 자격(현재는 AZ-104가 현실적)이 선행 자격입니다. 시험 코드와 자격 취득 조건을 따로 확인해야 하는 이유입니다.",
  },
  {
    label: "날짜에 따라 바뀌는 칸",
    summary: "DVA-C02 → DVA-C03 · AZ-204 폐지",
    focus: "dates",
    note: "DVA-C02는 2026년 11월 30일까지 응시할 수 있고 그 뒤는 DVA-C03입니다. AZ-204는 2026년 10월 기준 이미 폐지됐고, AI-200은 그 이름만 바꾼 시험이 아니라 컨테이너·벡터 데이터·메시징·보안·관측을 잇는 AI 백엔드 범위입니다. 접수 전에 시험 코드와 변경 날짜를 다시 확인합니다.",
  },
] as const satisfies readonly { label: string; summary: string; focus: Focus; note: string }[];

function Exam({
  role,
  code,
  lit,
  tone = "base",
  extra,
}: {
  role: string;
  code: string;
  lit: boolean;
  tone?: "base" | "warn" | "ok";
  extra?: string;
}) {
  const border = !lit ? "border-border/50" : tone === "warn" ? "border-amber-600" : tone === "ok" ? "border-emerald-600" : "border-primary";
  return (
    <div className={`min-w-0 rounded-lg border bg-background px-1 py-1.5 text-center transition-opacity sm:px-2 duration-300 motion-reduce:transition-none ${border} ${lit ? "opacity-100" : "opacity-40"}`}>
      <span className="block break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px]">{role}</span>
      <span className="mt-0.5 block break-words font-mono text-[11px] font-bold leading-4 sm:text-sm sm:leading-5">{code}</span>
      {extra ? (
        <span className={`mt-0.5 block break-keep text-[10px] leading-4 sm:text-[11px] ${tone === "warn" ? "text-amber-700 dark:text-amber-400" : tone === "ok" ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}`}>
          {extra}
        </span>
      ) : null}
    </div>
  );
}

function Link({ text, lit }: { text: string; lit: boolean }) {
  return (
    <div className={`my-1 flex items-center justify-center gap-2 text-[11px] text-muted-foreground transition-opacity duration-300 motion-reduce:transition-none ${lit ? "opacity-100" : "opacity-40"}`}>
      <span className="h-4 border-l border-dashed border-muted-foreground" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}

export default function ExamPathViz() {
  return (
    <SceneShell
      eyebrow="시험 경로 지도"
      title="기초 입구에서 역할별 시험으로 갈라지는 길"
      description="6절과 9절의 시험 이름을 맡을 결정(설계·개발·운영)에 붙인 지도입니다. 2026년 10월 기준이며, 응시 가능 날짜와 시험 코드는 바뀔 수 있습니다."
      ariaLabel="AWS와 Azure의 기초 시험에서 역할별 시험으로 이어지는 경로, 선행 자격과 날짜 변경"
      scenes={SCENES}
      render={(active) => {
        const focus: Focus = SCENES[active].focus;
        const aws = focus === "aws" || focus === "dates";
        const azure = focus === "azure";
        const expert = focus === "expert";
        const dates = focus === "dates";
        return (
          <div className="grid min-w-0 gap-4 md:grid-cols-2 md:gap-6">
            <div className="min-w-0">
              <div className="mb-1.5 flex items-center gap-3">
                <p className="w-12 shrink-0 text-xs font-bold text-foreground">AWS</p>
                <div className="min-w-0 flex-1">
                  <Exam role="기초 입구" code="CLF-C02" lit={focus === "aws"} />
                </div>
              </div>
              <Link text={focus === "aws" ? "이어짐 · 경험이 있으면 바로 시작" : "이어짐"} lit={focus === "aws"} />
              <div className="grid grid-cols-3 gap-1.5">
                <Exam role="설계" code="SAA-C03" lit={focus === "aws"} />
                <Exam
                  role="개발"
                  code={dates ? "DVA-C02 → C03" : "DVA-C02"}
                  lit={aws}
                  tone={dates ? "warn" : "base"}
                  extra={dates ? "2026-11-30까지 C02, 그 뒤 C03" : undefined}
                />
                <Exam role="운영" code="SOA-C03" lit={focus === "aws"} />
              </div>
            </div>
            <div className="min-w-0 border-t border-border/60 pt-4 md:border-t-0 md:pt-0">
              <div className="mb-1.5 flex items-center gap-3">
                <p className="w-12 shrink-0 text-xs font-bold text-foreground">Azure</p>
                <div className="min-w-0 flex-1">
                  <Exam role="기초 입구" code="AZ-900" lit={azure} />
                </div>
              </div>
              <Link text="이어짐" lit={azure} />
              <div className="grid grid-cols-4 gap-1 md:grid-cols-2 md:gap-1.5">
                <Exam
                  role="관리 실무"
                  code="AZ-104"
                  lit={azure || expert}
                  tone={expert ? "ok" : "base"}
                  extra={expert ? "Expert의 선행 자격" : undefined}
                />
                <Exam
                  role="AI 백엔드 개발"
                  code="AI-200"
                  lit={azure || dates}
                  tone={dates ? "warn" : "base"}
                  extra={dates ? "AZ-204 개명판 아님" : undefined}
                />
                <Exam
                  role="설계 Expert"
                  code="AZ-104 + AZ-305"
                  lit={azure || expert}
                  tone={expert ? "ok" : "base"}
                  extra={expert ? "AZ-305만으론 안 됨" : undefined}
                />
                <Exam
                  role="DevOps"
                  code="AZ-400"
                  lit={azure || expert}
                  tone={expert ? "ok" : "base"}
                  extra={expert ? "Expert엔 선행 자격 필요" : undefined}
                />
              </div>
              <div
                className={`mt-2 rounded-lg border border-dashed px-2 py-1 text-center text-[11px] leading-4 transition-opacity duration-300 motion-reduce:transition-none ${dates ? "border-amber-600 opacity-100" : "border-border/50 opacity-40"}`}
              >
                <span className="font-mono font-bold line-through">AZ-204</span>
                <span className="ml-2 text-muted-foreground">2026년 10월 기준 폐지</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
