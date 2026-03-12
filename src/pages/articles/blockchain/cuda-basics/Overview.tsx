export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CUDA 기초 & 블록체인 활용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CUDA(Compute Unified Device Architecture)는 NVIDIA GPU에서
          범용 병렬 연산을 실행하기 위한 플랫폼입니다.
          블록체인에서 GPU 가속은 <strong>마이닝(PoW)</strong>,
          <strong>ZK 증명 생성</strong>, <strong>서명 검증</strong>,
          <strong>Filecoin Sealing</strong> 등에 필수적입니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">CUDA 프로그래밍 모델</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`CUDA 실행 계층:

Grid (전체 작업)
├── Block (0,0)          Block (1,0)          Block (2,0)
│   ├── Thread (0,0)     ├── Thread (0,0)     ├── ...
│   ├── Thread (1,0)     ├── Thread (1,0)
│   ├── Thread (0,1)     ├── Thread (0,1)
│   └── ...              └── ...
│
└── 블록체인 비유:
    Grid    = 전체 블록 검증 작업
    Block   = 개별 트랜잭션 그룹
    Thread  = 개별 연산 (해시, 서명 검증 등)

// 커널 호출 예시
kernel<<<numBlocks, threadsPerBlock>>>(args);

// 블록체인 예시: 1024개 트랜잭션 서명을 256개씩 4블록으로 병렬 검증
verify_signatures<<<4, 256>>>(transactions, signatures, results);`}</code>
        </pre>
      </div>
    </section>
  );
}
