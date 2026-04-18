import ReproducibilityViz from './viz/ReproducibilityViz';

export default function Reproducibility() {
  return (
    <section id="reproducibility" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">재현성: 시드, 환경, 버전 관리</h2>
      <div className="not-prose mb-8"><ReproducibilityViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">시드 고정 — 랜덤 요소 통제</h3>
        <p>
          ML 학습에서 랜덤 요소는 4곳에서 발생 — <strong>torch, numpy, random, CUDA</strong><br />
          4곳 모두 같은 시드(예: 42)로 고정해야 동일한 가중치 초기화, 데이터 셔플, 드롭아웃 패턴이 재현된다
        </p>
        <p>
          <code>torch.manual_seed(42)</code> — PyTorch CPU 연산의 시드<br />
          <code>torch.cuda.manual_seed_all(42)</code> — 모든 GPU의 시드 고정<br />
          <code>np.random.seed(42)</code> — NumPy 랜덤 연산(데이터 분할, 셔플)<br />
          <code>random.seed(42)</code> — Python 내장 random 모듈
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">CUDA 비결정성 주의</h3>
        <p>
          GPU 연산은 기본적으로 <strong>비결정적</strong>(non-deterministic) — 같은 시드라도 결과가 미세하게 다를 수 있다<br />
          <code>torch.backends.cudnn.deterministic = True</code> — cuDNN 알고리즘을 결정적으로 강제<br />
          <code>torch.backends.cudnn.benchmark = False</code> — 자동 알고리즘 선택을 비활성화<br />
          결정적 모드는 속도가 10-20% 느려질 수 있으므로, 최종 재현 확인 시에만 활성화하고 탐색 단계에서는 해제 권장
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">환경 기록 — 라이브러리 버전</h3>
        <p>
          PyTorch 2.0과 2.1에서 같은 코드가 다른 결과를 낼 수 있다 — 내부 구현 변경 때문<br />
          <code>pip freeze &gt; requirements.txt</code> — 현재 환경의 모든 패키지를 정확한 버전으로 고정<br />
          <code>conda env export &gt; environment.yml</code> — CUDA 버전, Python 버전까지 포함하는 완전한 스냅샷<br />
          새 환경에서 <code>pip install -r requirements.txt</code> 또는 <code>conda env create -f environment.yml</code>로 동일 환경 복원
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">코드 버전 — git commit 연결</h3>
        <p>
          실험 시점의 <strong>git commit hash</strong>를 기록하면 "어떤 코드로 학습했는가"를 정확히 추적 가능<br />
          W&B는 <code>wandb.init()</code> 시 자동으로 git 정보를 수집하지만, 명시적으로도 기록 권장<br />
          <code>{'git_hash = subprocess.check_output(["git", "rev-parse", "HEAD"]).strip()'}</code><br />
          uncommitted 변경이 있으면 재현이 불가능하므로, 실험 전 반드시 <strong>commit 후 실행</strong>을 습관화
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Docker — 완전한 환경 캡슐화</h3>
        <p>
          "내 컴퓨터에서는 되는데?" — OS, CUDA 드라이버, 시스템 라이브러리 차이가 원인<br />
          <strong>Docker</strong>로 전체 환경을 이미지화하면 어디서든 동일한 실행 환경을 보장<br />
          <code>nvidia/cuda:12.1</code> 베이스 이미지 위에 Python, 의존성, 코드를 레이어링<br />
          <code>docker run --gpus all my-experiment:v3</code> — GPU 포함 컨테이너 실행<br />
          Kubernetes 클러스터에서 동일 이미지로 분산 학습도 가능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">데이터 버전 관리</h3>
        <p>
          코드와 환경이 동일해도 <strong>데이터가 다르면</strong> 결과가 달라진다<br />
          <strong>DVC</strong>(Data Version Control) — git과 유사한 인터페이스로 대용량 데이터 버전 관리<br />
          데이터 파일의 해시값을 git에 커밋하고, 실제 파일은 S3/GCS에 저장<br />
          최소한 학습 데이터의 <strong>MD5 해시</strong>를 실험 메타데이터에 기록하면 데이터 변경 여부를 감지 가능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">하드웨어 기록</h3>
        <p>
          같은 시드, 같은 코드라도 <strong>GPU 모델</strong>이 다르면 부동소수점 연산 순서 차이로 결과가 미세하게 달라질 수 있다<br />
          GPU 모델명, VRAM 크기, CPU 코어 수, RAM 용량을 실험 메타데이터에 기록<br />
          완전한 재현이 필요하면 동일 하드웨어에서 실행하거나, Docker + 특정 GPU 지정으로 환경을 고정
        </p>
      </div>
    </section>
  );
}
