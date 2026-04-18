import DatasetViz from './viz/DatasetViz';

export default function Dataset() {
  return (
    <section id="dataset" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Dataset & DataLoader 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>torch.utils.data.Dataset</strong> — 데이터 하나를 꺼내는 인터페이스<br />
          상속 후 <code>__len__</code>과 <code>__getitem__</code> 두 메서드만 구현하면 된다<br />
          <code>__getitem__(idx)</code>가 핵심 — 여기서 파일 로드 + 전처리 + 텐서 변환을 수행
        </p>
        <p>
          <strong>DataLoader</strong>는 Dataset을 감싸서 미니배치 이터레이터를 생성<br />
          4가지 핵심 인자: <code>batch_size</code>(배치 크기), <code>shuffle</code>(셔플 여부),
          <code>num_workers</code>(병렬 로드 프로세스), <code>pin_memory</code>(GPU 전송 최적화)
        </p>
      </div>
      <div className="not-prose my-8">
        <DatasetViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">num_workers & pin_memory 최적화</h3>
        <p>
          <strong>num_workers</strong> — 데이터 로드에 사용할 CPU 프로세스 수<br />
          0이면 메인 프로세스가 직접 로드 (GPU가 데이터 대기 중 유휴 상태)<br />
          보통 CPU 코어 수의 2~4배를 설정 — 너무 크면 메모리 초과, 너무 작으면 병목
        </p>
        <p>
          <strong>pin_memory=True</strong> — CPU 메모리를 페이지 잠금(pinned) 상태로 할당<br />
          GPU로의 DMA(Direct Memory Access) 전송이 가능해져 복사 속도 향상<br />
          GPU 학습 시 거의 항상 True 설정 — CPU 전용 학습에서는 불필요
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">도메인별 Dataset 패턴</h3>
        <p>
          <strong>이미지</strong> — PIL.Image.open() → transforms.Compose([Resize, Augmentation, ToTensor, Normalize])<br />
          전처리를 __getitem__에서 실행하므로 augmentation이 매 epoch 다르게 적용 (확률적)
        </p>
        <p>
          <strong>테이블</strong> — DataFrame.iloc[idx] → float32 텐서로 변환<br />
          __init__에서 DataFrame 전체를 로드하고 __getitem__은 행 인덱싱만 수행<br />
          메모리에 다 올라가므로 num_workers=0이 오히려 빠른 경우도 있음
        </p>
        <p>
          <strong>텍스트</strong> — tokenizer(text, max_length=512, padding, truncation) → input_ids + attention_mask<br />
          __getitem__에서 토큰화하면 매번 연산 비용 발생 — 미리 토큰화 후 캐시하는 패턴도 사용
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">collate_fn 커스텀</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          배치 내 샘플 크기가 다를 때 (가변 길이 텍스트, 다른 크기 이미지) collate_fn을 직접 구현.
          padding, 크기 통일, 마스크 생성 등 배치 조합 로직을 여기서 처리한다.
        </p>
      </div>
    </section>
  );
}
