import LtxGuidanceViz from './viz/LtxGuidanceViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function DualStream() {
  return (
    <section id="dual-stream-dit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2단계: 영상과 오디오를 따로 처리하고 중간에서 맞추는 DiT</h2>
      <div className="not-prose mb-8"><LtxGuidanceViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LTX-2의 핵심은 하나의 거대한 “비디오 전용 모델”이 아니라,
          <strong> 영상 흐름</strong>과 <strong>오디오 흐름</strong>을 따로 두는 dual-stream DiT다.
          논문 기준으로 영상 흐름은 14B, 오디오 흐름은 5B 규모로 설명된다. “비대칭”이라는 말은 두 흐름이
          같은 크기와 같은 역할을 갖지 않는다는 뜻이다. 비디오는 공간 구조와 움직임을 더 많이 담당하고,
          오디오는 시간적으로 정렬된 음향 정보를 담당한다.
        </p>
        <p>
          두 흐름은 완전히 독립적으로 노이즈를 제거하지 않는다. 중간 레이어에서 양방향 cross-attention이 들어가
          영상 토큰이 오디오 토큰을 보고, 오디오 토큰도 영상 토큰을 본다. 이 구조 덕분에 입 모양, 충돌음,
          카메라 움직임에 따른 환경음 같은 동기화 문제가 “마지막 합성 단계”가 아니라 생성 과정 내부에서 다뤄진다.
        </p>
        <M display>{'\\begin{aligned} h_v^{\\ell+1} &= \\mathrm{Block}_v(\\underbrace{h_v^\\ell}_{\\text{영상}},\\underbrace{c_{text}}_{\\text{문장}},\\underbrace{h_a^\\ell}_{\\text{오디오}},t) \\\\ h_a^{\\ell+1} &= \\mathrm{Block}_a(\\underbrace{h_a^\\ell}_{\\text{오디오}},\\underbrace{c_{text}}_{\\text{문장}},\\underbrace{h_v^\\ell}_{\\text{영상}},t) \\end{aligned}'}</M>
        <FormulaNote
          meaning="한 layer에서 영상 stream은 자신의 영상 토큰뿐 아니라 문장과 현재 오디오 토큰을 조건으로 다음 상태를 만들고, 오디오 stream도 반대 방향으로 같은 교환을 한다. 두 식이 서로의 이전 상태를 읽기 때문에 화면과 소리의 동기화가 denoising 내부에서 학습된다."
          symbols={[
            ['h_v^\\ell,h_a^\\ell', 'l번째 layer에 들어오는 영상·오디오 hidden token'],
            ['c_{text}', '두 stream 모두가 공유하는 text condition'],
            ['t', '현재 denoising noise level을 알리는 시간 조건'],
            ['\\mathrm{Block}_v,\\mathrm{Block}_a', '모달리티별 self-attention과 교차 조건화를 수행하는 서로 다른 block'],
          ]}
        />
        <p>
          여기서 <M>{'h_v^\\ell'}</M>는 <M>{'\\ell'}</M>번째 layer의 video hidden tokens,
          <M>{'h_a^\\ell'}</M>는 audio hidden tokens, <M>{'c_{text}'}</M>는 text condition,
          <M>{'t'}</M>는 diffusion noise level이다. 중요한 점은 video와 audio가 서로를 조건으로 본다는 것이다.
          그래서 lip-sync나 충돌음 같은 현상은 후처리로 붙는 것이 아니라 denoising hidden state 안에서 조정된다.
        </p>
        <p>
          block 하나를 학습용으로 풀어 쓰면 다음 순서다. 먼저 영상 token은 영상 token끼리 self-attention을 하고,
          오디오 token은 오디오 token끼리 self-attention을 한다. 그 다음 text embedding이 각 흐름에 cross-attention으로 들어가
          “무엇을 만들지”를 알려준다. 이후 audio-video cross-attention이 들어가 “소리와 화면이 서로 맞는지”를 조정한다.
          마지막으로 FFN과 normalization이 다음 layer로 넘길 hidden state를 만든다.
        </p>
        <p>
          여기서 비대칭성이 중요하다. 영상은 공간 구조, 객체 관계, 카메라 움직임까지 표현해야 하므로 더 큰 stream이 필요하고,
          오디오는 시간 정렬과 음향 이벤트가 핵심이므로 다른 크기와 위치 인코딩을 쓴다. 두 흐름을 억지로 같은 크기의 token 묶음으로
          합치면 attention은 단순해 보이지만, 영상의 3D 위치와 오디오의 시간 위치를 같은 규칙으로 처리해야 하는 부담이 생긴다.
        </p>
        <p>
          또 하나의 핵심은 시간 단계 조건화다. 디퓨전은 현재 노이즈 레벨이 어디인지 알아야 하므로,
          모델은 시간 단계 정보를 layer normalization이나 조건 경로로 계속 받는다. LTX-2는 오디오와 영상이
          같은 시간 축에서 노이즈 제거를 진행하도록 설계하고, 모달리티별 guidance scale을 통해 소리와 화면 조건의 강도를 조절한다.
        </p>
        <h3>실패 사례로 이해하기</h3>
        <ul>
          <li>영상 stream만 강하면 화면은 그럴듯하지만 말소리, 충돌음, 배경음이 장면과 어긋날 수 있다.</li>
          <li>오디오 stream만 강하면 소리는 prompt에 맞지만 입 모양이나 물체 움직임과 맞지 않을 수 있다.</li>
          <li>cross-attention이 약하면 두 결과가 각각 맞아 보여도 함께 보면 동기화가 깨진다.</li>
          <li>guidance scale이 과하면 prompt 충실도는 올라가지만 움직임이 뻣뻣해지거나 audio artifact가 늘 수 있다.</li>
        </ul>
        <p>
          공개 파이프라인의 guider는 CFG 하나로 끝나지 않는다. CFG는 프롬프트 방향성을 올리고, STG는 특정 transformer block을
          교란해 시간 구조를 안정화하며, modality CFG는 오디오와 영상이 따로 맞는 것처럼 보이는 실패를 줄인다.
          즉 LTX-2의 추론 품질은 체크포인트만이 아니라 <strong>guider 설정</strong>에도 크게 의존한다.
        </p>
      </div>
    </section>
  );
}
