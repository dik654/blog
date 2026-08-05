import {
  AlertTriangle,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileQuestion,
  ListChecks,
  ShieldCheck,
  Target,
} from 'lucide-react';

const trends = [
  {
    year: '2024',
    title: '실무 경로와 명령 중심',
    points: [
      'Windows 그룹, IIS/DHCP 로그, ARP 캐시, IDS 대응처럼 상황을 주고 원인과 대응을 묻는 문제가 강했다.',
      'Linux 비밀번호 정책 파일, DB 암호화 방식, 무선랜 보안, Null Session, CIDR/Subnet처럼 정확한 키워드 암기가 필요했다.',
    ],
  },
  {
    year: '2025',
    title: '복원 기출과 기본서 개념 혼합',
    points: [
      '공개 교재와 후기 기준으로 단답/서술/실무형이 유지됐고, 설정 경로와 보안 통제 설명을 함께 요구하는 흐름이 이어졌다.',
      '개인정보보호법, ISMS-P, 위험관리, 암호/인증, 시스템 보안 도구는 계속 유지되는 고정 축이다.',
    ],
  },
  {
    year: '2026',
    title: '도구·공격·법규를 짧게 맞히는 시험',
    points: [
      '공개 자료 기준 2026년 1회 실기 풀이 영상과 2026 교재가 확인되며, 2025년 전체 기출 복원 반영 교재가 최신 대비 축으로 쓰인다.',
      '/etc/passwd, shadow, iptables, IIS/DHCP/Sendmail, Tripwire, Fcheck, Nessus, Nikto, Nmap, DNS/ARP Spoofing, XSS, SQL Injection, TLS, OTP, ISMS, CISO가 반복 축이다.',
    ],
  },
];

const priority = [
  ['1', 'Linux/Windows 설정 경로와 명령 옵션', 'passwd/shadow, login.defs, sysctl, iptables, IIS/DHCP 로그'],
  ['2', '보안 도구 용도 구분', 'Tripwire/Fcheck, Nessus/Nikto, Nmap/Snort/Wireshark'],
  ['3', '네트워크 공격 식별과 대응', 'DNS Spoofing, ARP Spoofing, MitM, ICMP DoS, SMTP Open Relay'],
  ['4', '웹 취약점 설명형 매칭', 'XSS, SQL Injection, SSRF, Fuzzing, Cookie Secure/HttpOnly'],
  ['5', '암호/인증 정의', 'Hash, TLS, 전자서명, OTP, PGP, 생체정보 보호'],
  ['6', '관리/법규 키워드', 'ISMS 의무 대상, CISO, 위험관리, 개인정보/가명정보/익명정보'],
  ['7', '로그/표/설정 해석', '캐시 표, 정책 파일, 명령 빈칸, 사고 대응 절차'],
];

const drills = [
  {
    group: '시스템 보안',
    items: [
      ['Linux에서 /etc/passwd의 두 번째 필드가 x일 때 의미를 쓰시오.', '실제 암호 해시는 /etc/shadow에 저장된다는 의미.'],
      ['Linux 비밀번호 최소 길이를 설정하는 대표 파일과 설정 키를 쓰시오.', '/etc/login.defs, PASS_MIN_LEN.'],
      ['ICMP Echo 요청에 응답하지 않도록 하는 커널 파라미터를 쓰시오.', 'net.ipv4.icmp_echo_ignore_all=1.'],
      ['파일 무결성 점검 도구 두 가지를 쓰시오.', 'Tripwire, Fcheck.'],
      ['Tenable에서 개발한 취약점 점검 도구를 쓰시오.', 'Nessus.'],
      ['Sendmail에서 릴레이 허용 도메인/호스트를 관리하는 파일명을 쓰시오.', 'access, 일반적으로 /etc/mail/access.'],
    ],
  },
  {
    group: '네트워크 보안',
    items: [
      ['DNS 서버보다 빠르게 위조 응답을 보내 피해자를 잘못된 IP로 유도하는 공격을 쓰시오.', 'DNS Spoofing 또는 DNS Cache Poisoning.'],
      ['ARP 캐시에서 서로 다른 IP가 같은 MAC 주소를 가리킬 때 의심되는 공격을 쓰시오.', 'ARP Spoofing 또는 ARP Cache Poisoning.'],
      ['ARP 캐시를 확인하는 Windows 명령어를 쓰시오.', 'arp -a.'],
      ['Nmap XML 출력 옵션과 grepable 출력 옵션을 쓰시오.', '-oX, -oG.'],
      ['RDP의 기본 포트를 쓰시오.', 'TCP 3389.'],
      ['SMTP 릴레이 설정 오류가 악용될 수 있는 대표 문제를 쓰시오.', '스팸 발송 경유지, 오픈 릴레이.'],
    ],
  },
  {
    group: '웹/애플리케이션',
    items: [
      ['무작위 또는 비정상 입력을 넣어 오류와 취약점을 찾는 기법을 쓰시오.', 'Fuzzing.'],
      ['게시판에 저장된 악성 스크립트가 조회자에게 실행되는 XSS 유형을 쓰시오.', 'Stored XSS.'],
      ['참/거짓 반응 차이로 데이터를 추론하는 SQL Injection 유형을 쓰시오.', 'Blind SQL Injection.'],
      ['쿠키가 HTTPS에서만 전송되도록 하는 속성을 쓰시오.', 'Secure.'],
      ['자바스크립트에서 쿠키 접근을 막는 속성을 쓰시오.', 'HttpOnly.'],
      ['DB 암호화 방식 세 가지를 쓰시오.', 'TDE 방식, API 방식, Plug-in 방식.'],
    ],
  },
  {
    group: '암호/인증',
    items: [
      ['임의 길이 입력을 고정 길이 값으로 만들며 역산이 어려운 함수를 쓰시오.', '해시 함수.'],
      ['전자서명의 보안 효과 세 가지를 쓰시오.', '인증, 무결성, 부인방지.'],
      ['TLS에서 비대칭키와 대칭키가 각각 쓰이는 이유를 설명하시오.', '비대칭키로 인증/키 교환을 수행하고, 이후 대칭키로 빠르게 데이터를 암호화한다.'],
      ['OTP가 재사용 공격에 강한 이유를 쓰시오.', '시간 또는 카운터 기반으로 매번 다른 인증값을 생성하기 때문.'],
      ['생체인증 원본을 그대로 저장하면 위험한 이유를 쓰시오.', '유출 시 변경이 어렵고 영구적 피해가 발생할 수 있다.'],
    ],
  },
  {
    group: '관리/법/ISMS',
    items: [
      ['CISO의 역할 네 가지를 쓰시오.', '정보보호 정책 수립, 위험관리, 보안대책 이행관리, 침해사고 대응/보고.'],
      ['위험관리 절차를 순서대로 쓰시오.', '계획 수립, 위험 식별, 위험 분석, 위험 평가, 대응 계획 수립, 모니터링/통제.'],
      ['잔여위험의 의미를 설명하시오.', '보안 통제를 적용한 뒤에도 남는 위험.'],
      ['가명정보를 동의 없이 처리할 수 있는 대표 목적을 쓰시오.', '통계 작성, 과학적 연구, 공익적 기록보존.'],
      ['개인정보와 익명정보의 차이를 설명하시오.', '개인정보는 식별 가능성이 있고, 익명정보는 합리적 수단으로 더 이상 개인을 알아볼 수 없다.'],
    ],
  },
];

const plan = [
  ['1-2일차', 'Linux/Windows 경로·명령·도구 표 암기'],
  ['3-4일차', '네트워크 공격과 대응 명령 정리'],
  ['5-6일차', '웹 취약점 유형별 정의와 예시 정리'],
  ['7-8일차', '암호/인증/TLS/전자서명/OTP 정리'],
  ['9-10일차', 'ISMS/위험관리/CISO/개인정보 법규 정리'],
  ['11-12일차', '실기 단답형 빈칸 연습'],
  ['13일차', '서술형 8개 주제 손으로 작성'],
  ['14일차', '틀린 경로/도구/법규 키워드만 재암기'],
];

const sources: { name: string; href?: string; note: string }[] = [
  { name: 'KCA 국가기술자격검정 정보보안기사 안내', href: 'https://www.cq.or.kr/qh_quagm01_020.do', note: '필기 과목, 실기 필답형 3시간, 합격 기준 확인' },
  { name: 'KCA 국가기술자격검정 시험일정', href: 'https://www.cq.or.kr/qh_quagm03_001.do', note: '2026년 회차별 필기/실기 시행 형태와 시험 시간 확인' },
  { name: '수제비 2026년 1회 정보보안기사 실기 기출 풀이 영상', href: 'https://www.youtube.com/watch?v=v5MCzyPXr0E', note: '2026년 1회 실기 최신 공개 풀이 자료' },
  { name: '2026 수제비 정보보안기사 실기 기본서 출간 기사', href: 'https://m.boannews.com/html/detail.html?idx=141871', note: '2025년 1회부터 4회까지 기출 복원 반영 및 카페 지원 언급' },
  { name: '2026 이기적 정보보안기사 실기 기출 600제', href: 'https://www.yes24.com/product/goods/181001509', note: '13개년 기출과 2025년 기출 반영 교재 정보' },
  { name: '로컬 정리 문서', note: '/home/heru/code/heru-stack/docs/exam-prep/information-security-engineer-2024-2026.md' },
];

function SectionHeader({
  id,
  icon: Icon,
  eyebrow,
  title,
}: {
  id: string;
  icon: typeof Target;
  eyebrow: string;
  title: string;
}) {
  return (
    <div id={id} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

export default function InformationSecurityEngineer20242026() {
  return (
    <div className="space-y-12">
      <section className="rounded-lg border bg-muted/20 p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">작성 기준: 2026-06-25</p>
            <h2 className="mt-1 text-xl font-semibold">복원 원문이 아니라 시험 대비용 변형 정리</h2>
          </div>
          <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-600" />
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          로컬 문서의 2024-2026 경향 정리와 공개 검색으로 확인 가능한 2026 교재/강의/시험 안내를 합쳐
          다시 체계화했다. 카페 문제 원문은 저작권과 접근 제한이 있으므로 그대로 재배포하지 않고,
          반복 출제 축을 기준으로 변형 문제와 암기 우선순위만 제공한다.
        </p>
      </section>

      <section className="space-y-5">
        <SectionHeader id="trend" icon={CalendarDays} eyebrow="trend" title="최근 출제 경향" />
        <div className="grid gap-3 md:grid-cols-3">
          {trends.map((trend) => (
            <article key={trend.year} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-foreground px-2 py-1 text-xs font-semibold text-background">
                  {trend.year}
                </span>
                <h3 className="text-sm font-semibold">{trend.title}</h3>
              </div>
              <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                {trend.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            2026년 6월 25일 현재 공개 웹에서 직접 확인 가능한 최신 축은 2026년 1회 실기 풀이,
            2025년 전체 기출 반영 교재, KCA 시험 안내다. 카페 내부 게시글은 직접 인용하지 않았다.
          </p>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader id="priority" icon={Target} eyebrow="priority" title="우선순위" />
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="w-16 px-3 py-2 font-medium">순위</th>
                <th className="px-3 py-2 font-medium">학습 축</th>
                <th className="px-3 py-2 font-medium">키워드</th>
              </tr>
            </thead>
            <tbody>
              {priority.map(([rank, title, keywords]) => (
                <tr key={rank} className="border-t">
                  <td className="px-3 py-2 font-semibold">{rank}</td>
                  <td className="px-3 py-2">{title}</td>
                  <td className="px-3 py-2 text-muted-foreground">{keywords}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader id="drill" icon={FileQuestion} eyebrow="drill" title="기출형 변형 문제" />
        <div className="grid gap-4">
          {drills.map((group) => (
            <article key={group.group} className="rounded-lg border">
              <div className="border-b bg-muted/30 px-4 py-3">
                <h3 className="text-base font-semibold">{group.group}</h3>
              </div>
              <div className="divide-y">
                {group.items.map(([question, answer], index) => (
                  <details key={question} className="group px-4 py-3">
                    <summary className="flex cursor-pointer list-none items-start gap-3 text-sm font-medium">
                      <span className="mt-0.5 rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground">
                        {index + 1}
                      </span>
                      <span>{question}</span>
                    </summary>
                    <p className="mt-3 pl-10 text-sm leading-6 text-muted-foreground">
                      <CheckCircle2 className="mr-1 inline h-4 w-4 text-emerald-600" />
                      {answer}
                    </p>
                  </details>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader id="plan" icon={ListChecks} eyebrow="plan" title="2주 압축 학습 순서" />
        <div className="grid gap-3 sm:grid-cols-2">
          {plan.map(([day, task]) => (
            <div key={day} className="rounded-lg border p-4">
              <p className="text-xs font-semibold text-muted-foreground">{day}</p>
              <p className="mt-1 text-sm font-medium">{task}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeader id="sources" icon={BookOpenCheck} eyebrow="sources" title="참고 자료" />
        <div className="space-y-2">
          {sources.map((source) => {
            const body = (
              <>
                <span>
                  <span className="block font-medium">{source.name}</span>
                  <span className="mt-1 block text-muted-foreground">{source.note}</span>
                </span>
                {source.href && <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
              </>
            );

            return source.href ? (
              <a
                key={source.name}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm hover:bg-muted/40"
              >
                {body}
              </a>
            ) : (
              <div
                key={source.name}
                className="flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm"
              >
                {body}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
