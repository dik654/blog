import MathText from '@/components/ui/math-text';
import DataPrepScene from './viz/DataPrepScene';
import DataPrepDetailScene from './viz/DataPrepDetailScene';
import M from '@/components/ui/math';

export default function DataPrep() {
  return (
    <MathText id="data-prep" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터 준비</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          원문 문자열은 행렬 곱의 입력이 될 수 없다<br />
          먼저 문장을 token으로 자르고, 각 token을 vocabulary 안의 id로 바꾼다<br />
          id는 embedding table $E$ 의 행 주소가 되고, 그 행이 모델이 실제로 읽는 밀집 벡터다
        </p>
      </div>

      <DataPrepScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>변환 과정</h3>
        <p>
          token → id → one-hot은 “어느 행을 고를지”를 점점 숫자로 만든 표현이다<br />
          one-hot은 vocabulary 크기만큼 길고 대부분 0이라 비효율적이다<br />
          그래서 실무에서는 같은 의미로 $E[id]$ 행을 바로 가져와 <strong>d_model=6</strong> 벡터를 만든다
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Vocabulary 구축 과정</h3>
        <M display>
          {`\\underbrace{\\text{텍스트} \\;\\to\\; \\text{토큰} \\;\\to\\; \\text{ID}}_{\\text{word2idx 매핑}} \\;\\to\\; \\underbrace{\\text{One-hot} \\times E}_{\\text{임베딩 (vocab} \\times d_{\\text{model}}\\text{)}}`}
        </M>
      </div>
      <DataPrepDetailScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: 텍스트는 token, id, embedding을 거쳐 행렬 $X$ 가 된다.<br />
          요약 2: PAD, UNK, BOS, EOS는 길이와 경계를 알려주는 별도 token이다.<br />
          요약 3: vocabulary 크기가 $E$ 의 행 수와 embedding 파라미터를 결정한다.
        </p>
      </div>
    </MathText>
  );
}
