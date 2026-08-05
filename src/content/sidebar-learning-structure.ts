import type { Category, Subcategory } from './types';

export interface SidebarLearningStage {
  id: string;
  order: string;
  role: 'orient' | 'map' | 'target' | 'foundation' | 'build';
  label: string;
  description: string;
  subcategories: Subcategory[];
  clusters: SidebarLearningCluster[];
}

export interface SidebarLearningCluster {
  id: string;
  label: string;
  description?: string;
  subcategories: Subcategory[];
}

interface ClusterDefinition extends Omit<SidebarLearningCluster, 'subcategories'> {
  slugs: string[];
}

interface StageDefinition extends Omit<SidebarLearningStage, 'subcategories' | 'clusters'> {
  slugs: string[];
  clusters?: ClusterDefinition[];
}

const stageDefinitions: Record<string, StageDefinition[]> = {
  ai: [
    {
      id: 'target',
      order: '01',
      role: 'target',
      label: '목표 분야',
      description: '지금 이해하거나 만들고 싶은 시스템에서 시작한다.',
      slugs: [
        'ai-llm',
        'ai-multimodal',
        'ai-generative',
        'ai-open-models',
        'ai-vision',
        'ai-ocr',
        'ai-nlp',
        'ai-speech-audio',
        'ai-agents',
        'ai-knowledge-systems',
        'ai-reinforcement-learning',
        'ai-world-models',
        'ai-robotics',
        'ai-timeseries',
      ],
      clusters: [
        {
          id: 'language-knowledge',
          label: '언어 · 지식',
          description: '언어를 표현하고 기억하며 추론 가능한 시스템으로 연결한다.',
          slugs: ['ai-llm', 'ai-nlp', 'ai-speech-audio', 'ai-knowledge-systems'],
        },
        {
          id: 'multimodal-integration',
          label: '멀티모달 통합',
          description: '언어와 시각·음향 입력을 한 문맥에서 결합하고 이해와 생성을 연결한다.',
          slugs: ['ai-multimodal'],
        },
        {
          id: 'perception-generation',
          label: '인식 · 생성',
          description: '이미지와 문서를 이해하고 새로운 미디어를 생성한다.',
          slugs: ['ai-generative', 'ai-open-models', 'ai-vision', 'ai-ocr'],
        },
        {
          id: 'action-prediction',
          label: '행동 · 예측',
          description: '환경을 예측하고 도구나 물리 시스템의 행동으로 닫는다.',
          slugs: ['ai-agents', 'ai-reinforcement-learning', 'ai-world-models', 'ai-robotics', 'ai-timeseries'],
        },
      ],
    },
    {
      id: 'foundation',
      order: '02',
      role: 'foundation',
      label: '공통 보강 자료',
      description: '전부 읽는 선행과목이 아니다. 각 목표 경로가 지정한 유한한 수학·과학 항목만 여기서 보강한다.',
      slugs: ['ai-foundations', 'ai-math-foundations'],
    },
    {
      id: 'build',
      order: '03',
      role: 'build',
      label: '공통 구현 허브',
      description: '각 목표 경로에서 선택한 구현 링크를 코드, 실험, 운영 시스템으로 이어가는 작업 공간이다.',
      slugs: ['ai-practical', 'ai-from-scratch', 'ai-agents-ops', 'ai-agents-claw'],
    },
    {
      id: 'method',
      order: 'GUIDE',
      role: 'orient',
      label: '처음 보는 기술 읽기 도구',
      description: '필수 선행 단계가 아니다. 낯선 시스템에서 어디가 막혔는지 찾기 어려울 때만 입력·상태·계산·전달·검증으로 분해한다.',
      slugs: ['ai-systems-foundation'],
    },
  ],
  systems: [
    {
      id: 'runtime', order: '01', role: 'target', label: '소프트웨어 실행',
      description: '소스코드가 실행되는 목표 경로부터 본다.',
      slugs: ['systems-language-engines'],
    },
    {
      id: 'foundation', order: '02', role: 'foundation', label: '운영체제 기반',
      description: '프로세스, 메모리, 파일과 I/O로 내려간다.',
      slugs: ['systems-linux-kernel'],
    },
  ],
  blockchain: [
    {
      id: 'map', order: '00', role: 'map', label: '전체 지도',
      description: '블록, 상태, 합의와 실행의 공통 구조를 잡는다.',
      slugs: ['fundamentals'],
    },
    {
      id: 'target', order: '01', role: 'target', label: '목표 프로토콜',
      description: '관심 있는 체인과 응용에서 시작한다.',
      slugs: ['ethereum', 'cosmos', 'filecoin', 'defi'],
    },
    {
      id: 'foundation', order: '02', role: 'foundation', label: '합의 기반',
      description: '프로토콜이 기대는 분산 합의로 내려간다.',
      slugs: ['bft-consensus'],
    },
    {
      id: 'build', order: '03', role: 'build', label: '직접 구현',
      description: '공통 프레임워크와 ZK 구현으로 검증한다.',
      slugs: ['commonware', 'zk-from-scratch'],
    },
  ],
  crypto: [
    {
      id: 'target', order: '01', role: 'target', label: '목표 기술',
      description: '증명과 다자간 계산의 사용 목적에서 시작한다.',
      slugs: ['wallet-key-management', 'zkp'],
    },
    {
      id: 'foundation', order: '02', role: 'foundation', label: '암호 기반',
      description: '필요한 공개키 암호와 수학으로 내려간다.',
      slugs: ['classical'],
    },
  ],
  p2p: [
    {
      id: 'map', order: '00', role: 'map', label: '전체 지도',
      description: '피어, 메시지, 실패 모델의 공통 구조를 잡는다.',
      slugs: ['p2p-fundamentals'],
    },
    {
      id: 'target', order: '01', role: 'target', label: '전송 시스템',
      description: '실제 프로토콜과 연결 경로를 따라간다.',
      slugs: ['p2p-transport'],
    },
    {
      id: 'foundation', order: '02', role: 'foundation', label: '발견 기반',
      description: '주소와 피어를 찾는 DHT 원리로 내려간다.',
      slugs: ['p2p-discovery'],
    },
  ],
  gpu: [
    {
      id: 'target', order: '01', role: 'target', label: '목표 시스템',
      description: 'HPC 클러스터나 가속 워크로드에서 시작한다.',
      slugs: ['gpu-cluster-hpc', 'zk-acceleration'],
    },
    {
      id: 'foundation', order: '02', role: 'foundation', label: '하드웨어 · CUDA 기반',
      description: '부품, SIMT와 메모리 계층으로 내려간다.',
      slugs: ['hw-basics', 'gpu-fundamentals'],
    },
    {
      id: 'deep', order: '03', role: 'build', label: '하드웨어 심화',
      description: '대역폭, 세대 변화와 인프라 선택을 확장한다.',
      slugs: ['hw-deep'],
    },
  ],
  tee: [
    {
      id: 'map', order: '00', role: 'map', label: '전체 지도',
      description: '신뢰 경계와 위협 모델을 먼저 정한다.',
      slugs: ['tee-fundamentals'],
    },
    {
      id: 'target', order: '01', role: 'target', label: '구현체',
      description: 'Intel, ARM, AMD의 격리 방식을 비교한다.',
      slugs: ['tee-intel', 'tee-arm', 'amd-sev'],
    },
    {
      id: 'system', order: '02', role: 'build', label: '시스템 연결',
      description: '인프라와 네트워크의 신뢰 체인으로 확장한다.',
      slugs: ['tee-infra', 'tee-net'],
    },
  ],
  'isms-aml': [
    {
      id: 'map', order: '00', role: 'map', label: '관리체계',
      description: '통제 목적과 책임 구조를 먼저 잡는다.',
      slugs: ['isms-management'],
    },
    {
      id: 'control', order: '01', role: 'target', label: '보호 · 개인정보',
      description: '기술·관리 보호대책과 정보 생명주기를 연결한다.',
      slugs: ['isms-protection', 'isms-privacy'],
    },
    {
      id: 'finance', order: '02', role: 'target', label: '금융 범죄 대응',
      description: 'AML/CFT와 가상자산 사업자 통제로 확장한다.',
      slugs: ['aml-cft', 'vasp-compliance'],
    },
    {
      id: 'exam', order: '03', role: 'build', label: '시험 대비',
      description: '정리된 체계를 자격 시험 범위로 복습한다.',
      slugs: ['security-engineer-exam'],
    },
  ],
  ops: [
    {
      id: 'delivery', order: '01', role: 'build', label: '배포 기반',
      description: '변경을 빌드하고 클러스터에 전달한다.',
      slugs: ['ops-cicd', 'ops-k8s'],
    },
    {
      id: 'loop', order: '02', role: 'build', label: '운영 루프',
      description: '관찰, 이상 탐지와 노드 대응을 닫는다.',
      slugs: ['ops-observability', 'ops-nodes'],
    },
    {
      id: 'domain', order: '03', role: 'build', label: '도메인 운영',
      description: '결제처럼 별도 상태와 실패 규칙을 가진 시스템을 다룬다.',
      slugs: ['ops-payment'],
    },
  ],
};

export function getSidebarLearningStages(category: Category): SidebarLearningStage[] {
  const definitions = stageDefinitions[category.slug];
  if (!definitions) {
    return [{
      id: 'topics',
      order: '01',
      role: 'target',
      label: '주제',
      description: category.description,
      subcategories: category.subcategories,
      clusters: [],
    }];
  }

  const collectSubcategories = (subcategories: Subcategory[]): Subcategory[] => subcategories.flatMap(
    (subcategory) => [subcategory, ...collectSubcategories(subcategory.children ?? [])],
  );
  const allSubcategories = collectSubcategories(category.subcategories);
  const allSlugs = allSubcategories.map((subcategory) => subcategory.slug);
  const duplicateTreeSlugs = allSlugs.filter((slug, index) => allSlugs.indexOf(slug) !== index);
  if (duplicateTreeSlugs.length > 0) {
    throw new Error(`[sidebar-learning-structure] ${category.slug}: duplicate recursive subcategory slugs: ${[...new Set(duplicateTreeSlugs)].join(', ')}`);
  }

  const bySlug = new Map(category.subcategories.map((subcategory) => [subcategory.slug, subcategory]));
  const declaredSlugs = definitions.flatMap((definition) => definition.slugs);
  const duplicateSlugs = declaredSlugs.filter((slug, index) => declaredSlugs.indexOf(slug) !== index);
  if (duplicateSlugs.length > 0) {
    throw new Error(`[sidebar-learning-structure] ${category.slug}: duplicate stage slugs: ${[...new Set(duplicateSlugs)].join(', ')}`);
  }

  const missingSlugs = declaredSlugs.filter((slug) => !bySlug.has(slug));
  if (missingSlugs.length > 0) {
    throw new Error(`[sidebar-learning-structure] ${category.slug}: unknown stage slugs: ${missingSlugs.join(', ')}`);
  }

  for (const definition of definitions) {
    if (!definition.clusters?.length) continue;
    const clusterSlugs = definition.clusters.flatMap((cluster) => cluster.slugs);
    const duplicateClusterSlugs = clusterSlugs.filter((slug, index) => clusterSlugs.indexOf(slug) !== index);
    const stageSlugSet = new Set(definition.slugs);
    const unknownClusterSlugs = clusterSlugs.filter((slug) => !stageSlugSet.has(slug));
    const unclusteredSlugs = definition.slugs.filter((slug) => !clusterSlugs.includes(slug));
    if (duplicateClusterSlugs.length > 0 || unknownClusterSlugs.length > 0 || unclusteredSlugs.length > 0) {
      throw new Error(
        `[sidebar-learning-structure] ${category.slug}/${definition.id}: invalid cluster partition`
        + ` duplicate=[${[...new Set(duplicateClusterSlugs)].join(', ')}]`
        + ` unknown=[${unknownClusterSlugs.join(', ')}]`
        + ` unclustered=[${unclusteredSlugs.join(', ')}]`,
      );
    }
  }

  const claimed = new Set(declaredSlugs);
  const unclaimed = category.subcategories.filter((subcategory) => !claimed.has(subcategory.slug));
  if (unclaimed.length > 0) {
    throw new Error(`[sidebar-learning-structure] ${category.slug}: unclaimed top-level slugs: ${unclaimed.map((subcategory) => subcategory.slug).join(', ')}`);
  }

  const stages = definitions
    .map(({ slugs, clusters = [], ...definition }) => ({
      ...definition,
      subcategories: slugs.flatMap((slug) => {
        const subcategory = bySlug.get(slug);
        return subcategory ? [subcategory] : [];
      }),
      clusters: clusters
        .map(({ slugs: clusterSlugs, ...cluster }) => ({
          ...cluster,
          subcategories: clusterSlugs.flatMap((slug) => {
            const subcategory = bySlug.get(slug);
            return subcategory ? [subcategory] : [];
          }),
        }))
        .filter((cluster) => cluster.subcategories.length > 0),
    }))
    .filter((stage) => stage.subcategories.length > 0);

  return stages;
}
