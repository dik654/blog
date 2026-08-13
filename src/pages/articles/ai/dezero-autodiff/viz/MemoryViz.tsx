import DezeroConceptViz from "../../DezeroConceptViz";

export default function MemoryViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <DezeroConceptViz
      eyebrow="RUST OWNERSHIP"
      title="공유 소유권은 허용하되 순환 참조는 끊는다"
      summary="계산 그래프는 여러 노드가 서로 연결되므로 Rc와 RefCell이 필요합니다. 출력 방향은 Weak으로 저장해 참조 사이클을 피합니다."
      stages={[
        { tag: "SHARE", title: "Rc로 노드 공유", description: "여러 Function이 같은 Variable을 안전하게 참조합니다." },
        { tag: "MUTATE", title: "RefCell로 내부 변경", description: "gradient와 creator를 런타임 대여 검사 아래 갱신합니다." },
        { tag: "BREAK", title: "Weak으로 사이클 차단", description: "Function의 output 참조가 노드 생명주기를 붙잡지 않게 합니다." },
        { tag: "SCOPE", title: "RAII로 모드 복원", description: "no_grad 가드가 스코프 종료 시 이전 설정을 자동 복원합니다." },
      ]}
      codeKey="no-grad"
      codeLabel="메모리·가드 구현 보기"
      onOpenCode={onOpenCode}
    />
  );
}
