import WanVaeCompressionViz from './viz/WanVaeCompressionViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function VaeAndConditioning() {
  return (
    <section id="vae-conditioning" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3단계: VAE, 조건 입력, prompt extension</h2>
      <div className="not-prose mb-8"><WanVaeCompressionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Wan2.2도 비디오를 픽셀 공간에서 직접 노이즈 제거하지 않는다. VAE가 비디오를 압축된 latent grid로 바꾸고,
          DiT denoiser는 그 latent 위에서 노이즈를 제거한다. TI2V-5B 설명에 등장하는 16×16×4 압축률은
          공간과 시간 축을 함께 줄여 720p/24fps 생성을 현실적인 비용으로 만들려는 설계다.
        </p>
        <p>
          여기서 <code>4×16×16</code>은 “시간 4배, 높이 16배, 너비 16배”로 줄인다는 뜻으로 읽으면 된다.
          예를 들어 원본 비디오가 긴 프레임 격자라면, VAE를 지난 뒤 DiT는 훨씬 작은 시공간 격자만 본다.
          이 압축이 없으면 720p 비디오의 모든 픽셀을 transformer token으로 다뤄야 하므로 attention 비용이 감당하기 어렵다.
          반대로 압축률이 너무 공격적이면 작은 글자, 손가락, 빠른 움직임, 미세 질감이 decoder에서 흐려질 수 있다.
        </p>
        <M display>{'\\begin{aligned}T_z&=\\left\\lfloor\\frac{T-1}{4}\\right\\rfloor+1\\\\x&\\in \\mathbb{R}^{3\\times T\\times H\\times W}\\rightarrow z\\in\\mathbb{R}^{C\\times T_z\\times H/16\\times W/16}\\end{aligned}'}</M>
        <FormulaNote
          meaning="VAE는 RGB video의 시간과 공간 격자를 더 작은 latent tensor로 압축한다. 이 식의 4·16·16은 TI2V-5B 공개 경로의 압축 계약이며 모든 Wan variant나 모든 VAE에 그대로 적용하는 상수가 아니다."
          symbols={[
            ['x', 'VAE에 들어가는 RGB video tensor'],
            ['3', '입력의 RGB channel 수'],
            ['T,H,W', '입력 frame 수, 높이, 너비'],
            ['z', 'DiT denoiser가 처리하는 압축 latent tensor'],
            ['C', 'VAE가 만든 latent feature channel 수'],
          ]}
        />
        <p>
          <M>{'x'}</M>는 RGB video tensor, <M>{'z'}</M>는 Wan VAE가 만든 latent tensor다.
          시간축은 첫 frame을 보존한 뒤 나머지를 stride 4로 줄이고, 공간축은 각각 <M>{'16'}</M>배 줄어든다.
          예를 들어 121 frames는 30.25가 아니라 31개의 latent time positions가 된다. Transformer가 보는 token 수는 대략
          <M>{'T_zH^{\\prime}W^{\\prime}'}</M>에 비례하므로, 이 압축은 품질을 조금 희생하더라도 720p/24fps 추론을 가능하게 만드는 핵심이다.
        </p>
        <p>
          조건 입력은 task마다 다르다. T2V는 텍스트 조건이 중심이고, I2V는 입력 이미지를 기준 frame 또는 visual condition으로 사용한다.
          TI2V는 둘을 통합해 텍스트만으로도, 이미지+텍스트로도 동작한다. S2V나 Animate는 audio, character reference,
          pose/motion 같은 조건이 추가되는 확장 모델로 보면 된다.
        </p>
        <h3>조건 입력을 구조적으로 보면</h3>
        <ul>
          <li><strong>T2V</strong>: 텍스트 embedding이 장면, 피사체, 스타일, 카메라 움직임의 조건이 된다.</li>
          <li><strong>I2V</strong>: 입력 이미지가 첫 프레임 또는 visual anchor 역할을 하며, 모델은 그 anchor에서 시간 방향으로 확장한다.</li>
          <li><strong>TI2V</strong>: 텍스트와 이미지 조건을 같은 파이프라인에서 처리해, 텍스트만 또는 이미지+텍스트 입력을 모두 받을 수 있다.</li>
          <li><strong>S2V/Animate</strong>: 음성, 캐릭터 reference, pose/motion 조건이 추가되어 생성 자유도보다 제어성이 더 중요해진다.</li>
        </ul>
        <p>
          저장소가 prompt extension을 별도 기능으로 제공하는 점도 실전에서 중요하다. 짧은 프롬프트를 Qwen이나 Dashscope API로
          더 구체적인 장면 설명으로 확장하면, 모델이 조명, 구도, 움직임 단서를 더 명확히 받는다.
          이는 모델 구조 자체는 아니지만, 공개 inference pipeline에서 품질을 좌우하는 전처리 단계다.
        </p>
        <p>
          TI2V-5B의 핵심은 “작은 모델”만이 아니라 <strong>압축 설계</strong>다. 공개 설명은 Wan2.2-VAE가
          <code>4×16×16</code>의 시간/공간 압축을 수행하고, patchification까지 포함하면 transformer가 보는 token 규모가
          더 줄어든다고 설명한다. 이 덕분에 720p 24fps가 5B 경로에서도 가능해진다.
        </p>
        <M display>{'N_{tokens}\\propto T_z\\cdot\\frac{H}{16}\\cdot\\frac{W}{16}\\cdot\\frac{1}{p_t p_h p_w},\\qquad T_z=\\left\\lfloor\\frac{T-1}{4}\\right\\rfloor+1'}</M>
        <FormulaNote
          meaning="DiT가 처리할 token 수는 VAE 압축 뒤 시공간 격자를 patch 크기로 다시 나눈 값에 비례한다. Frame·해상도를 올리거나 patch를 작게 하면 작은 변화는 더 보존하지만 attention과 activation memory가 함께 증가한다."
          symbols={[
            ['N_{tokens}', 'Transformer에 실제로 들어가는 대략적인 video token 수'],
            ['T_z', '첫 frame을 보존한 VAE 압축 뒤 시간 위치 수'],
            ['H/16,W/16', 'VAE 압축 뒤 공간 grid 크기'],
            ['p_t,p_h,p_w', '여러 latent 위치를 token 하나로 묶는 patch 크기'],
          ]}
        />
        <p>
          <M>{'p_t,p_h,p_w'}</M>는 patchification이 추가로 묶는 시간/공간 patch 크기다.
          이 값이 커질수록 DiT token 수는 줄지만, 너무 크게 묶으면 작은 움직임과 국소 디테일이 token 안에서 평균화된다.
          그래서 Wan 워크플로우의 해상도와 frame 수는 “출력 크기”가 아니라 denoiser가 처리할 token budget을 정하는 값이다.
        </p>
        <p>
          따라서 Wan2.2를 튜닝하거나 비교할 때는 “모델 파라미터 수”만 보면 안 된다. VAE가 얼마나 잘 복원하는지,
          prompt extension이 얼마나 구체적인 조건을 주는지, 이미지 조건을 넣는 모델인지, 그리고 sampler가 몇 step 동안
          어떤 expert를 호출하는지가 함께 결과를 만든다. 같은 prompt라도 이 네 요소가 달라지면 움직임, 질감, 피사체 보존이
          서로 다르게 나온다.
        </p>
      </div>
    </section>
  );
}
