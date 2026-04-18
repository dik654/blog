import EncodingViz from './viz/EncodingViz';

export default function Encoding() {
  return (
    <section id="encoding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시퀀스 인코딩 전략</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          시퀀스를 모델에 넣으려면 <strong>고정 크기 텐서</strong>로 변환해야 한다.
          유저 A는 이벤트 3개, 유저 B는 이벤트 50개 — 길이가 다른 시퀀스를
          하나의 배치로 묶으려면 패딩(padding)이나 잘라내기(truncation)가 필수.
        </p>
        <p>
          인코딩의 목표: 각 이벤트를 d_model 차원 벡터로 변환하고,
          시퀀스 전체를 (batch, max_len, d_model) 형상의 텐서로 만드는 것.
          이 텐서에는 이벤트의 의미(타입 임베딩), 순서(위치 인코딩), 시간 간격(time delta 인코딩)이 모두 담긴다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">패딩과 트렁케이션</h3>
        <p>
          <strong>패딩(padding)</strong> — 짧은 시퀀스의 뒤에 [PAD] 토큰을 추가하여 max_len에 맞춘다.
          PAD 위치는 어텐션 마스크(attention mask)로 표시하여 모델이 무시하도록 한다.
          마스크 값 0인 위치는 Self-Attention 계산에서 -inf로 처리되어 가중치가 0이 된다.
        </p>
        <p>
          <strong>트렁케이션(truncation)</strong> — 긴 시퀀스는 최근 max_len개만 유지하고 오래된 이벤트를 버린다.
          "최근 이벤트가 더 중요하다"는 가정하에 뒤쪽(최근)을 남기는 것이 일반적.
          max_len은 데이터의 시퀀스 길이 분포를 보고 결정 — 보통 90~95 퍼센타일 값을 사용한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">이벤트 타입 임베딩</h3>
        <p>
          이벤트 유형(패스, 슛, 드리블 등)은 범주형 변수다.
          <strong>nn.Embedding(num_types, d_model)</strong>로 룩업 테이블을 만들면
          각 유형이 d_model 차원 벡터에 매핑된다.
          학습 과정에서 유사한 이벤트(패스와 크로스)는 벡터 공간에서 가까워지고,
          이질적인 이벤트(패스와 태클)는 멀어진다.
        </p>
        <p>
          수치형 필드(x, y 좌표)는 Linear 레이어로 d_model 차원에 프로젝션한다.
          여러 필드가 있으면 각각 프로젝션 후 합산하거나 concat 후 다시 프로젝션.
        </p>
      </div>

      <div className="not-prose my-8">
        <EncodingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">위치 인코딩</h3>
        <p>
          Transformer는 순서를 모른다 — 입력 순서를 바꿔도 출력이 같다(순열 불변).
          <strong>위치 인코딩(positional encoding)</strong>은 각 위치에 고유한 벡터를 더해
          "이 토큰이 시퀀스의 몇 번째인지"를 알려준다.
        </p>
        <p>
          sin/cos 방식: PE(pos, 2i) = sin(pos / 10000^(2i/d_model)),
          PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model)).
          학습 가능한(learnable) 위치 인코딩도 있지만, 이벤트 시퀀스에서는 sin/cos가 충분히 잘 작동한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">시간 간격(Time Delta) 인코딩</h3>
        <p>
          이벤트 시퀀스의 특성 — 이벤트 간 시간 간격이 일정하지 않다.
          패스 사이 2초와 30초는 전혀 다른 맥락을 의미한다.
          짧은 간격은 빠른 빌드업, 긴 간격은 경기 흐름의 끊김이다.
        </p>
        <p>
          Δt(연속 이벤트 간 시간 차이)를 log 변환 후 Linear 레이어로 d_model 차원에 매핑하면,
          모델이 시간적 거리를 학습할 수 있다.
          최종 입력: <strong>EventEmbed(type) + PosEncode(pos) + TimeDeltaEmbed(Δt)</strong>.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">팁: max_len 결정 기준</p>
        <p className="text-sm">
          시퀀스 길이 분포를 히스토그램으로 확인한 뒤, 95 퍼센타일 값을 max_len으로 설정하는 것이 일반적이다.
          너무 크면 패딩이 많아져 메모리 낭비 + 어텐션 연산량 증가, 너무 작으면 정보 손실.
          K리그 패스 데이터의 경우 패스 체인 평균 길이 5~8 → max_len=15 정도가 적절.
        </p>
      </div>
    </section>
  );
}
