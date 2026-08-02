import { BLOG_ROOT, CORE_ROOT, LAB_ROOT } from '@/lib/paths';

export type LabDocStatus = 'living' | 'active' | 'draft';
export type LabOperationStatus = 'running' | 'build' | 'review' | 'paused';

export interface LabDocCard {
  title: string;
  body: string;
  meta?: string;
}

export interface LabDocSection {
  title: string;
  body?: string;
  items: LabDocCard[];
}

export interface LabDoc {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  summary: string;
  status: LabDocStatus;
  sections: LabDocSection[];
  checklist: string[];
}

export interface LabOperation {
  title: string;
  area: string;
  href: string;
  status: LabOperationStatus;
  current: string;
  next: string;
  evidence: string;
}

export function labDocPath(slug: string) {
  return `${LAB_ROOT}/${slug}`;
}

export const labOperations: LabOperation[] = [
  {
    title: 'Blog/Lab',
    area: 'Publishing',
    href: BLOG_ROOT,
    status: 'build',
    current: '조사 글과 공개 랩 화면을 운영 화면으로 분리합니다.',
    next: '설명용 문서 위에 실제 운영 항목을 먼저 노출합니다.',
    evidence: '/lab, /lab/blog, /lab/core',
  },
  {
    title: 'Core Registry',
    area: 'Verification',
    href: CORE_ROOT,
    status: 'review',
    current: '코드 위치, 불변조건, 테스트 명령이 있는 검증 단위만 공개합니다.',
    next: '작업 결과가 재사용 가능한 검증 단위인지 선별해 연결합니다.',
    evidence: 'core tracks, unit commands, source anchors',
  },
  {
    title: 'CI/CD Pipeline',
    area: 'Delivery design',
    href: `${LAB_ROOT}/cicd`,
    status: 'running',
    current: '변경 접수부터 security/cost/compliance gate와 자동 rollback까지 gate matrix, workflow snippet, 산출물 기준으로 관리합니다.',
    next: '대기 중인 다음 확장 없음. 새 프로젝트가 추가되면 gate matrix에 적용 범위와 예산/정책만 추가합니다.',
    evidence: 'run plan, CI run, preview evidence, release evidence, security/cost/compliance evidence, rollback evidence',
  },
  {
    title: 'Code Idioms',
    area: 'Coding patterns',
    href: `${CORE_ROOT}/code-idioms`,
    status: 'running',
    current: 'Go/Rust/Python/TypeScript 기본 관용구와 concurrency, testing, async, API, design pattern, ML Ops, Transformer, Solidity 보안 관용구를 bad/good 예시와 리뷰 질문으로 관리합니다.',
    next: '대기 중인 다음 확장 없음. 새 반복 실수가 나오면 해당 idiom 상세에 규칙으로 추가합니다.',
    evidence: 'core/code-idioms, bad/good examples, review questions, API/ML/Solidity idioms',
  },
  {
    title: 'Project Board',
    area: 'Work planning',
    href: `${LAB_ROOT}/projects`,
    status: 'build',
    current: '공개 랩에서 다룰 프로젝트와 코드베이스 작업 단위를 별도 화면으로 분리합니다.',
    next: '내부 도구가 아닌 공개 가능한 산출물 중심으로 목록을 정리합니다.',
    evidence: '/lab/projects, work units, next actions',
  },
];

export const labDocs: LabDoc[] = [
  {
    slug: 'operations',
    label: '실제 운영',
    eyebrow: 'Operations board',
    title: '지금 실제로 굴리는 운영 항목을 설명 문서와 분리합니다.',
    summary:
      '랩 첫 화면의 실제 운영 보드에 노출되는 항목입니다. 각 항목은 현재 상태, 다음 액션, 확인 증거를 가져야 하며 단순 설명 문서로 끝나지 않습니다.',
    status: 'active',
    sections: [
      {
        title: '운영 대상',
        body: '이 목록은 “어떻게 할 것인가”가 아니라 지금 어디를 보고 무엇을 처리할지 정하는 실제 운영판입니다.',
        items: labOperations.map((item) => ({
          title: item.title,
          body: `${item.current} 다음 액션: ${item.next}`,
          meta: `${item.area} · ${item.evidence}`,
        })),
      },
      {
        title: '운영 규칙',
        items: [
          {
            title: '상단 보드는 실제 링크만 둡니다.',
            body: '프로젝트, 오케스트레이션, 코어, CI/CD처럼 바로 들어가서 처리할 수 있는 대상만 올립니다.',
          },
          {
            title: '다음 액션 없는 항목은 운영 항목이 아닙니다.',
            body: '설명만 있는 항목은 관리 문서로 내리고, 실제 보드에는 현재 상태와 다음 액션이 있는 항목만 둡니다.',
          },
          {
            title: '완료 증거가 있어야 닫습니다.',
            body: '빌드, 테스트, 스크린샷, 배포 URL, 트레이스, 수동 확인 중 하나를 완료 근거로 연결합니다.',
          },
        ],
      },
    ],
    checklist: [
      '각 운영 항목은 실제 이동 가능한 링크를 가진다.',
      '현재 상태와 다음 액션이 없으면 운영 보드에서 제외한다.',
      '완료 판단에는 evidence를 붙인다.',
      '설명 문서는 아래 관리 문서로 내리고, 첫 화면 상단은 실행 대상 중심으로 유지한다.',
    ],
  },
  {
    slug: 'overview',
    label: '운영 개요',
    eyebrow: 'Operating model',
    title: '랩은 콘텐츠 저장소가 아니라 작업 운영판입니다.',
    summary:
      '읽은 것, 만든 것, 검증한 것을 한 화면에서 다시 찾을 수 있게 묶고, 에이전트가 만든 결과도 사람이 판단 가능한 단위로 남깁니다.',
    status: 'active',
    sections: [
      {
        title: '무엇을 관리하는가',
        body: '관리 대상은 글의 양이 아니라 재사용 가능한 판단과 구현 단위입니다.',
        items: [
          {
            title: '조사 기록',
            body: '외부 자료, 코드 리딩, 실험 메모를 출처와 판단 근거가 남는 형태로 정리합니다.',
            meta: '블로그',
          },
          {
            title: '구현 단위',
            body: '작은 기능, 버그 수정, 검증 스크립트처럼 다시 쓸 수 있는 결과를 프로젝트 아래에 둡니다.',
            meta: '코어',
          },
          {
            title: '결정 기록',
            body: '왜 이 구조를 택했는지, 대안은 무엇이었는지, 나중에 바꿀 조건은 무엇인지 남깁니다.',
            meta: 'ADR',
          },
        ],
      },
      {
        title: '성공 기준',
        items: [
          {
            title: '다시 설명할 수 있어야 합니다.',
            body: '면접, 리뷰, 후속 구현에서 같은 내용을 다시 찾고 설명할 수 있어야 합니다.',
          },
          {
            title: '검증 결과가 붙어야 합니다.',
            body: '테스트, 스크린샷, 실패 사례, 수동 확인 중 하나 이상이 작업 단위에 연결되어야 합니다.',
          },
          {
            title: '분류가 흔들리지 않아야 합니다.',
            body: '한 프로젝트의 주 소속은 하나로 두고, 언어와 보안 같은 축은 태그/필터로 관리합니다.',
          },
        ],
      },
    ],
    checklist: [
      '새 작업은 Area, Track, Project, Work Unit 중 어디에 놓일지 먼저 정한다.',
      '블로그에는 읽고 판단한 흐름을 남기고, 코어에는 다시 쓸 구현 단위를 남긴다.',
      '에이전트 산출물은 그대로 쌓지 않고 사람이 읽은 결과만 남긴다.',
      '완료 판단에는 테스트 또는 검증 메모를 붙인다.',
    ],
  },
  {
    slug: 'workflow',
    label: '작업 흐름',
    eyebrow: 'Delivery flow',
    title: '조사에서 구현까지 한 방향으로 흐르게 만듭니다.',
    summary:
      '작업은 읽고 정리하기, 작게 만들기, 검토와 보강, 다시 쓰기의 네 단계로 이동합니다. 각 단계는 다음 단계에서 쓸 수 있는 산출물을 남겨야 합니다.',
    status: 'active',
    sections: [
      {
        title: '단계',
        items: [
          {
            title: '1. 읽고 정리',
            body: '코드, 문서, 레퍼런스를 읽고 핵심 주장과 출처를 남깁니다. 아직 구현하지 않는 내용도 판단 근거를 분리합니다.',
            meta: 'Research',
          },
          {
            title: '2. 작게 만들기',
            body: '기능을 작은 변경으로 자릅니다. 한 Work Unit은 설명, 코드 변경, 검증 결과를 함께 담을 수 있어야 합니다.',
            meta: 'Build',
          },
          {
            title: '3. 검토와 보강',
            body: 'AI가 만든 의미 없는 테스트, 과한 예외 삼키기, 너무 넓은 통과 조건을 사람이 다시 확인합니다.',
            meta: 'Review',
          },
          {
            title: '4. 다시 쓰기',
            body: '반복될 판단, 패턴, 체크리스트는 코어와 운영 문서로 승격해 다음 작업의 기준으로 씁니다.',
            meta: 'Reuse',
          },
        ],
      },
      {
        title: '상태 관리',
        items: [
          {
            title: 'Todo',
            body: '할 일은 문제 정의와 완료 기준이 있을 때만 등록합니다.',
          },
          {
            title: 'Doing',
            body: '진행 중 항목은 한 번에 너무 많이 열지 않고, 현재 막힌 이유를 기록합니다.',
          },
          {
            title: 'Review',
            body: '테스트, 빌드, 수동 검증, 코드 리뷰 중 필요한 확인을 끝냅니다.',
          },
          {
            title: 'Done',
            body: '다음 사람이 읽어도 무엇을 바꿨고 왜 바꿨는지 알 수 있을 때 닫습니다.',
          },
        ],
      },
    ],
    checklist: [
      '작업을 시작하기 전에 완료 기준을 한 줄로 쓴다.',
      '구현 중 발견한 부채는 현재 작업과 분리해 새 항목으로 남긴다.',
      '검토 단계에서 AI가 만든 테스트가 실제 실패를 잡는지 확인한다.',
      '완료 후 코어나 블로그 중 어디에 축적할지 정한다.',
    ],
  },
  {
    slug: 'management',
    label: '관리 방식',
    eyebrow: 'Information split',
    title: '블로그, 코어, 운영 문서를 역할별로 나누어 관리합니다.',
    summary:
      '블로그는 생각과 조사 과정을 보관하고, 코어는 코드베이스 검증 단위를 보관합니다. 언어 idiom, CI/CD, 실제 프로젝트 관리는 운영 문서로 분리합니다.',
    status: 'active',
    sections: [
      {
        title: '공간의 역할',
        items: [
          {
            title: '블로그',
            body: '넓게 읽고 정리하는 곳입니다. 글의 목적은 결론보다 사고 과정과 출처를 남기는 것입니다.',
            meta: 'Research log',
          },
          {
            title: '코어',
            body: '코드베이스에서 실제로 자른 검증 단위를 모읍니다. go-ethereum처럼 코드 위치, 불변조건, 테스트 명령이 있는 항목만 둡니다.',
            meta: 'Verification registry',
          },
          {
            title: '패턴 라이브러리',
            body: 'Go, Rust, Python, JS/TS idiom을 모아 AI 코드 작성 시 불필요한 추상화와 관용구 위반을 줄입니다.',
            meta: 'Idioms',
          },
          {
            title: '운영 보드',
            body: 'CI/CD 구조와 실제 진행 중인 프로젝트 관리는 검증 레지스트리와 분리해 상태, 다음 액션, 배포 기준 중심으로 봅니다.',
            meta: 'Delivery',
          },
          {
            title: '랩 개요',
            body: '콘텐츠 목록이 아니라 관리 방식, 분류 원칙, 운영 기준을 설명하는 문서 허브입니다.',
            meta: 'Operating manual',
          },
        ],
      },
      {
        title: '운영 규칙',
        items: [
          {
            title: '긴 글과 작업 단위를 섞지 않습니다.',
            body: '조사 글은 블로그에 두고, 실제 구현/검증 가능한 단위는 코어에 둡니다.',
          },
          {
            title: '언어 idiom은 코어 검증 단위가 아닙니다.',
            body: '관용구와 코드 작성 원칙은 AI 작업자가 참조하는 패턴 라이브러리에 두고, 검증 레지스트리와 섞지 않습니다.',
          },
          {
            title: '자동 생성물은 바로 노출하지 않습니다.',
            body: '에이전트가 만든 노트는 사람이 정리한 뒤 주제나 작업 단위에 붙입니다.',
          },
          {
            title: '중복 분류를 만들지 않습니다.',
            body: 'AI, 보안, CI/CD, 테스트가 동시에 걸리더라도 주 분류는 하나만 선택합니다.',
          },
        ],
      },
    ],
    checklist: [
      '새 글은 블로그에 둘지 코어에 둘지 먼저 판단한다.',
      '작업 결과가 코드베이스 검증 단위이면 코어에 연결한다.',
      '언어 관용구, CI/CD, 프로젝트 상태는 운영 문서로 분리한다.',
      '조사 글이 구현으로 이어지면 해당 Work Unit을 연결한다.',
      '목록을 늘리기보다 읽고 행동할 수 있는 상태를 유지한다.',
    ],
  },
  {
    slug: 'taxonomy',
    label: '분류 원칙',
    eyebrow: 'Taxonomy',
    title: 'Area, Track, Project, Work Unit 순서로만 쌓습니다.',
    summary:
      '언어, 보안, CI/CD, 테스트는 독립된 큰 트리가 아니라 필터와 태그입니다. 주 분류를 하나로 고정해야 작업이 섞이지 않습니다.',
    status: 'active',
    sections: [
      {
        title: '주 분류',
        items: [
          {
            title: 'Area',
            body: 'AI, Blockchain, Documents, DevOps처럼 큰 책임 영역입니다. 프로젝트의 최상위 소속은 하나만 둡니다.',
            meta: 'Level 1',
          },
          {
            title: 'Track',
            body: 'LLM Runtime, Agent Harness, zkVM, CI/CD처럼 같은 성격의 프로젝트를 묶는 흐름입니다.',
            meta: 'Level 2',
          },
          {
            title: 'Project',
            body: 'Blog/Lab, 문서 저장소, 검증 레지스트리처럼 공개 랩에서 다룰 산출물을 기준으로 관리하는 단위입니다.',
            meta: 'Level 3',
          },
          {
            title: 'Work Unit',
            body: 'paste fix, quality gate, article return path처럼 구현과 검증 결과를 남길 수 있는 작은 단위입니다.',
            meta: 'Level 4',
          },
        ],
      },
      {
        title: '보조 축',
        items: [
          {
            title: 'Language',
            body: 'Rust, Go, TypeScript는 프로젝트를 가르는 주 분류가 아니라 구현 언어 필터입니다.',
          },
          {
            title: 'Risk',
            body: '보안, 권한, 데이터 손실 위험은 리뷰 우선순위를 정하는 태그로 둡니다.',
          },
          {
            title: 'Verification',
            body: 'unit, e2e, smoke, manual, screenshot 같은 검증 방식은 상태 판단에 붙입니다.',
          },
        ],
      },
    ],
    checklist: [
      '한 프로젝트가 여러 Area에 걸쳐 보이면 주 사용자와 산출물을 기준으로 하나만 고른다.',
      '언어별 페이지를 만들기보다 언어 필터를 붙인다.',
      'CI/CD와 테스트는 별도 세계가 아니라 모든 Project에 붙는 운영 축으로 둔다.',
      'Work Unit은 완료 여부와 검증 결과를 기록할 수 있는 크기로 자른다.',
    ],
  },
  {
    slug: 'code-idioms',
    label: '코드 Idiom',
    eyebrow: 'AI coding patterns',
    title: '언어별 idiom은 AI 코드 작성의 낭비를 줄이는 패턴 라이브러리로 둡니다.',
    summary:
      'Go, Rust, Python, JS/TS에서 반복되는 관용구와 금지 패턴을 모아 에이전트가 불필요한 추상화, 넓은 예외 처리, 의미 없는 테스트를 만들지 않게 합니다.',
    status: 'living',
    sections: [
      {
        title: '관리 단위',
        body: '언어별 문법 사전이 아니라 실제 코드 리뷰에서 반복해서 고치는 패턴만 남깁니다.',
        items: [
          {
            title: 'Go idiom',
            body: 'context 전파, error wrapping, goroutine lifecycle, channel close ownership, table test 구조를 우선 관리합니다.',
            meta: 'Go',
          },
          {
            title: 'Rust idiom',
            body: '소유권 경계, Result/thiserror 사용, trait 남용 방지, clone 최소화, 테스트 fixture와 property test 경계를 남깁니다.',
            meta: 'Rust',
          },
          {
            title: 'Python idiom',
            body: 'typing, pathlib, context manager, pytest fixture, broad except 금지, 데이터 파싱은 구조화 parser 우선을 관리합니다.',
            meta: 'Python',
          },
          {
            title: 'JS/TS idiom',
            body: '타입 좁히기, async error 처리, React state 분리, fetch 상태 모델, 불필요한 wrapper hook 생성을 줄이는 기준을 둡니다.',
            meta: 'JS/TS',
          },
        ],
      },
      {
        title: '완료 기준',
        items: [
          {
            title: '나쁜 예와 좋은 예가 함께 있어야 합니다.',
            body: '“이렇게 하라”보다 AI가 자주 만드는 나쁜 코드와 수정된 형태를 같이 보관해야 재사용성이 생깁니다.',
          },
          {
            title: '프로젝트별 예외를 분리합니다.',
            body: '언어 일반 규칙과 blog, gateway, document tool 같은 프로젝트 특화 규칙을 같은 항목에 섞지 않습니다.',
          },
          {
            title: '프롬프트/리뷰 체크에 연결합니다.',
            body: '패턴은 읽는 문서로 끝나지 않고 에이전트 작업 지시나 리뷰 체크리스트에서 실제로 참조되어야 합니다.',
          },
        ],
      },
    ],
    checklist: [
      '최근 리뷰에서 실제로 반복된 실수만 추가한다.',
      '각 idiom은 bad/good 예시 또는 검토 질문을 가진다.',
      '언어 일반 규칙과 프로젝트 특화 규칙을 분리한다.',
      '에이전트 prompt, review checklist, CI gate 중 하나와 연결한다.',
    ],
  },
  {
    slug: 'delivery-system',
    label: 'CI/CD 구조',
    eyebrow: 'Delivery system',
    title: 'CI/CD는 모든 프로젝트에 붙는 운영 레이어로 따로 관리합니다.',
    summary:
      '빌드, 테스트, 정적 검사, 배포, 롤백, 운영 확인을 프로젝트 검증 단위와 분리해 한눈에 보이게 관리합니다.',
    status: 'active',
    sections: [
      {
        title: '파이프라인 축',
        items: [
          {
            title: 'Local gate',
            body: '작업 전후에 돌리는 build, typecheck, unit test, AI quality gate를 프로젝트별로 고정합니다.',
            meta: 'Pre-PR',
          },
          {
            title: 'CI gate',
            body: 'GitHub Actions나 서버 빌드에서 반드시 막아야 할 실패와 경고만 별도 정책으로 둡니다.',
            meta: 'CI',
          },
          {
            title: 'Deploy/Rollback',
            body: '서비스별 배포 명령, health check, rollback 조건, 로그 확인 위치를 한 곳에 둡니다.',
            meta: 'Ops',
          },
          {
            title: 'Release evidence',
            body: '배포 후 확인한 URL, smoke 결과, 수동 확인 기록을 프로젝트 상태와 연결합니다.',
            meta: 'Evidence',
          },
        ],
      },
      {
        title: '분리 원칙',
        items: [
          {
            title: 'CI/CD는 코어 검증 레지스트리가 아닙니다.',
            body: '코어는 코드베이스 기능 검증 단위, CI/CD는 그 작업을 안전하게 통과시키는 운영 장치입니다.',
          },
          {
            title: '프로젝트별로 적용 범위를 둡니다.',
            body: 'blog, gateway, document tool, model serving은 빌드와 배포 방식이 다르므로 공통 규칙과 프로젝트 규칙을 나눕니다.',
          },
          {
            title: '자동화는 사람 판단을 보조합니다.',
            body: 'CI가 통과해도 변경 의도, 위험, 사용자 확인은 별도 완료 조건으로 남깁니다.',
          },
        ],
      },
    ],
    checklist: [
      '프로젝트별 local gate 명령을 한 줄로 고정한다.',
      'CI에서 실패시킬 조건과 경고로 둘 조건을 분리한다.',
      '배포 후 확인 URL과 health check를 기록한다.',
      '롤백 조건과 담당 판단 기준을 문서화한다.',
    ],
  },
  {
    slug: 'project-board',
    label: '프로젝트 관리',
    eyebrow: 'Project board',
    title: '실제 작업 프로젝트는 상태와 다음 액션 중심으로 별도 관리합니다.',
    summary:
      'blog, 문서 저장소, 검증 레지스트리처럼 공개 랩에서 다룰 제품/도구는 코어 검증 레지스트리와 분리해 Project > Work Unit으로 봅니다.',
    status: 'active',
    sections: [
      {
        title: '프로젝트 보드 구조',
        items: [
          {
            title: 'Project',
            body: '실제 산출물 기준입니다. blog, document vault, ai-quality-gates처럼 배포나 사용 경계가 있는 단위입니다.',
            meta: 'Level 1',
          },
          {
            title: 'Work Unit',
            body: '한 번에 끝낼 수 있고 검증 결과를 남길 수 있는 변경입니다. 기능, 버그, 문서, 배포 작업을 모두 포함합니다.',
            meta: 'Level 2',
          },
          {
            title: 'State',
            body: 'todo, doing, review, done은 현재 행동을 결정하기 위한 상태입니다. 설명 글 목록과 섞지 않습니다.',
            meta: 'Status',
          },
          {
            title: 'Evidence',
            body: '테스트, 빌드, 스크린샷, 배포 URL, 수동 확인을 완료 조건과 함께 붙입니다.',
            meta: 'Proof',
          },
        ],
      },
      {
        title: '코어와의 관계',
        items: [
          {
            title: '코어는 검증된 코드베이스 절단입니다.',
            body: 'go-ethereum 같은 외부 코드베이스에서 최소 기능 검증 단위를 만들면 코어에 둡니다.',
          },
          {
            title: '프로젝트 보드는 내가 실제로 굴리는 작업입니다.',
            body: 'blog, document vault, quality gate의 진행률, 다음 액션, CI/CD 상태는 프로젝트 보드에서 봅니다.',
          },
          {
            title: '블로그는 조사와 설명입니다.',
            body: '읽고 정리한 긴 글은 프로젝트 상태가 아니라 참조 자료입니다.',
          },
        ],
      },
    ],
    checklist: [
      '각 프로젝트는 현재 다음 액션 하나를 가진다.',
      'Work Unit은 완료 기준과 검증 방법을 가진다.',
      '블로그 링크는 참고 자료로만 붙이고 상태 보드 항목으로 세지 않는다.',
      '끝난 작업은 코어, idiom, CI/CD 문서 중 재사용될 곳으로 승격할지 판단한다.',
    ],
  },
  {
    slug: 'principles',
    label: '운영 원칙',
    eyebrow: 'Principles',
    title: 'AI가 만든 결과를 사람이 운영 가능한 형태로 바꿉니다.',
    summary:
      '빠르게 만드는 것보다 중요한 기준은 나중에 읽고, 검증하고, 다시 쓸 수 있는 상태로 남기는 것입니다.',
    status: 'living',
    sections: [
      {
        title: '기본 원칙',
        items: [
          {
            title: 'AI는 작성자가 아니라 작업자입니다.',
            body: '에이전트가 만든 결과는 사람이 검토하고, 판단과 책임은 사람이 남깁니다.',
            meta: 'Review first',
          },
          {
            title: '테스트는 통과용이 아니라 실패 감지용입니다.',
            body: '의미 없는 테스트, 너무 넓은 mock, 에러를 삼키는 처리는 완료 조건을 만족하지 못합니다.',
            meta: 'Signal',
          },
          {
            title: '작은 단위로 끝냅니다.',
            body: '큰 리팩터링보다 좁은 변경, 명확한 검증, 남길 수 있는 기록을 우선합니다.',
            meta: 'Scope',
          },
          {
            title: '출처와 근거를 남깁니다.',
            body: '외부 정보, 코드 판단, 설계 선택은 나중에 추적할 수 있어야 합니다.',
            meta: 'Trace',
          },
        ],
      },
      {
        title: '완료 기준',
        items: [
          {
            title: '동작 확인',
            body: '빌드, 테스트, 스크린샷, curl, 수동 확인 중 작업에 맞는 확인을 수행합니다.',
          },
          {
            title: '변경 이유',
            body: '무엇을 고쳤는지보다 왜 그렇게 고쳤는지를 한 줄이라도 남깁니다.',
          },
          {
            title: '다음 작업 연결',
            body: '남은 문제는 현재 완료를 흐리지 않게 별도 항목으로 분리합니다.',
          },
        ],
      },
    ],
    checklist: [
      'AI가 만든 예외 처리나 테스트가 너무 넓게 통과시키지 않는지 본다.',
      '권한, 파일 삭제, 외부 호출처럼 위험한 작업은 사람 검토 포인트를 둔다.',
      'CI/CD 자동화는 사람의 판단을 대체하지 않고 누락을 줄이는 역할로 둔다.',
      '운영 문서는 실제 작업에서 쓰이지 않으면 줄이거나 합친다.',
    ],
  },
];

export function getLabDoc(slug?: string) {
  return labDocs.find((doc) => doc.slug === slug);
}
