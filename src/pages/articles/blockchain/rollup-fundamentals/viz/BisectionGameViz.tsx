import StepViz from '@/components/ui/step-viz';
import { TREE_NODES } from '../BisectionGameData';
import { TreeEdges, TreeNode, NarrowingAnimation } from './BisectionGameVizParts';

const STEPS = [
  {
    label: '이진 트리 구조: Attack = 왼쪽, Defend = 오른쪽',
    body: 'Root Claim(깊이 0)에서 시작. Attack은 왼쪽 자식(범위의 앞 절반), Defend는 오른쪽 자식(뒤 절반).\n깊이가 깊어질수록 분쟁 범위가 절반씩 좁아진다.',
  },
  {
    label: 'Position 인코딩: depth + indexAtDepth',
    body: '각 노드의 위치는 (depth, indexAtDepth) 쌍으로 표현된다.\nTraceIndex()로 이 위치가 가리키는 실행 트레이스 인덱스를 계산한다.',
  },
  {
    label: '짝수 깊이 = 방어자(D), 홀수 깊이 = 도전자(C)',
    body: '체스처럼 번갈아 둔다. 체스 클럭(Chess Clock)이 각 팀의 남은 응답 시간을 추적한다.',
  },
  {
    label: '최대 깊이 도달 → 단일 명령어 실행',
    body: '100K 명령어 → 50K → 25K → ... → 1개 명령어까지 좁힌다.\nlog₂(100K) ≈ 17단계. MIPS VM이 온체인에서 실행하여 판정.',
  },
];

export default function BisectionGameViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="bs-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.4} />
            </marker>
          </defs>
          <TreeEdges step={step} />
          {TREE_NODES.map((n, i) => (
            <TreeNode key={i} n={n} i={i} step={step} />
          ))}
          {step === 3 && <NarrowingAnimation />}
        </svg>
      )}
    </StepViz>
  );
}
