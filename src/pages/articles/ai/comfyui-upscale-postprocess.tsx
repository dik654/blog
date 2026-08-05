import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { PostprocessOwnershipViz } from './comfyui-runtime/viz/WorkflowRuntimeViz';

const stages = [
  ['Base output', '첫 sampler와 decode 결과', '구도, 문자 의미, identity와 큰 구조'],
  ['Latent second pass', 'Upscaled latent를 다시 sampling', '새 detail과 구조 재해석, denoise에 따른 drift'],
  ['Pixel upscale', 'Decoded IMAGE를 resize 또는 upscaler model로 확대', '해상도와 국소 texture, 제한적인 enhancement'],
  ['Detailer / inpaint', 'Detector·mask로 선택한 crop을 다시 생성해 paste', '얼굴·손·object 같은 국소 수리'],
  ['Tile processing', '큰 image를 겹치는 patch로 나눠 처리', 'Peak memory와 국소 detail, seam·global consistency 위험'],
] as const;

const releaseRows = [
  ['base.png', '후처리 전 model·condition 결과', 'Base 실패를 숨기지 않는 기준점'],
  ['latent-pass.png', '2차 sampler 직후', 'Denoise가 만든 구조 변화 확인'],
  ['upscaled.png', 'Pixel upscale 직후', 'Scale·texture artifact 확인'],
  ['detailed.png', 'Detector 기반 patch가 합성된 최종', 'Identity drift와 paste seam 확인'],
  ['postprocess.json', '각 stage model, seed, denoise, scale, crop, tile size·overlap과 runtime', 'Earliest failure와 seam을 같은 조건에서 replay'],
] as const;

export default function ComfyUIUpscalePostprocessArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <QuestionLead
          question="최종 얼굴이 좋아졌다면 base model의 얼굴 생성 능력도 좋다고 결론내려도 되는가?"
          answer="아니다. ComfyUI-Impact-Pack의 third-party custom node인 FaceDetailer가 검출·crop·재생성한 결과일 수 있다. Base, latent second pass, pixel upscale와 detailer 출력을 따로 저장해 문제가 처음 생기고 처음 고쳐진 stage를 구분해야 한다."
        />
        <h2 className="mb-6 text-2xl font-bold">후처리는 독립된 생성 단계다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Upscale은 한 종류가 아니다. Latent를 키워 다시 denoise하면 model이 장면을 재해석한다. Pixel image를 upscaler로 키우면 구조는 비교적 보존되지만 새로운 의미를 정확히 복구하지는 못한다. Detailer는 detector가 선택한 영역을 다시 생성해 원본에 붙인다. 이 글의 구체적인 FaceDetailer 예시는 ComfyUI core가 아니라 별도 설치하는 ComfyUI-Impact-Pack 구현이다.</p>
          <p>따라서 최종 한 장만 보면 model과 workflow의 책임이 섞인다. Production에서는 stage마다 output을 저장하고, 비교 목적에 따라 base-only와 full-pipeline score를 따로 보고한다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Latent pass', meaning: 'VAE decode 전 표현을 확대하고 sampler를 다시 실행한다.', why: '고해상도 detail을 새로 만들 수 있지만 identity와 구조도 바뀔 수 있다.' },
          { term: 'Pixel upscale', meaning: 'Decode된 IMAGE의 sample 수를 늘리고 texture를 복원한다.', why: '크기를 키우는 책임과 의미·구조를 다시 그리는 책임을 분리한다.' },
          { term: 'Detailer', meaning: 'Detector가 고른 crop만 mask 기반으로 재생성하고 paste하는 workflow 역할이다. FaceDetailer는 이를 구현한 third-party Impact-Pack node다.', why: '국소 수리에 강하지만 base model 평가를 가릴 수 있고, package version까지 재현 조건에 포함해야 한다.' },
          { term: 'Earliest failure', meaning: '문제가 처음 관찰되는 가장 앞선 stage다.', why: '뒤 stage에서 가려진 증상이 아니라 실제 수정할 owner를 찾는다.' },
        ]} />
        <PostprocessOwnershipViz />
      </section>

      <section id="stage-ownership" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">각 stage가 고칠 수 있는 것</h2>
        <div className="not-prose overflow-hidden border border-border">
          {stages.map(([name, mechanism, owns]) => (
            <div key={name} className="grid min-w-0 border-b border-border last:border-b-0 lg:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)]">
              <strong className="border-b border-border bg-muted/20 px-3 py-3 text-sm lg:border-b-0 lg:border-r">{name}</strong>
              <p className="min-w-0 border-b border-border px-3 py-3 text-sm leading-relaxed lg:border-b-0 lg:border-r">{mechanism}</p>
              <p className="min-w-0 px-3 py-3 text-sm leading-relaxed text-muted-foreground">주요 책임: {owns}</p>
            </div>
          ))}
        </div>
        <Misconception>Upscaler는 작고 잘못 그려진 글자나 손의 “진짜 의미”를 알고 복원하는 장치가 아니다. 구조 오류가 base에 있으면 먼저 prompt·control·edit·inpaint 경계에서 고치고, upscale은 해상도와 enhancement 책임으로 제한한다.</Misconception>
      </section>

      <section id="coordinates" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Crop 좌표를 원본 canvas로 되돌린다</h2>
        <M display>{String.raw`\underbrace{\mathbf p_{\mathrm{canvas}}}_{\text{원본 위치}}=\underbrace{\mathbf o}_{\text{crop 시작점}}+\underbrace{\mathbf S\mathbf p_{\mathrm{local}}}_{\text{크기 변환된 국소 위치}}`}</M>
        <FormulaNote
          meaning={'Detailer가 crop 안에서 찾은 위치를 원본 image에 붙이려면 먼저 local 좌표에 resize scale S를 적용하고, crop이 시작된 offset o를 더한다. 곱셈을 먼저 하는 이유는 crop 내부 거리부터 원본 pixel 간격으로 바꿔야 하기 때문이다. Offset을 빠뜨리면 모양은 맞아도 전혀 다른 위치에 paste된다.'}
          symbols={[
            [String.raw`\mathbf p_{\mathrm{local}}`, 'Resize된 crop 내부의 local 좌표'],
            [String.raw`\mathbf S`, 'Crop 처리 해상도와 원본 crop 크기 사이의 scale 변환'],
            [String.raw`\mathbf o`, '원본 canvas에서 crop의 왼쪽 위 시작 offset'],
            [String.raw`\mathbf p_{\mathrm{canvas}}`, '최종 paste에 사용할 원본 canvas 좌표'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>ControlNet 좌표와 detailer 좌표가 어긋나는 문제도 같은 계열이다. Generation 전에 resize·crop·pad를 했으면 control image, detector bbox, mask와 output canvas가 어느 coordinate system에 있는지 기록한다. 단순 width·height만 같아도 aspect-ratio padding offset이 다르면 위치는 어긋난다.</p>
          <p>Feather와 dilation은 paste 경계의 역할을 맡는다. Dilation은 수리 영역을 얼마나 넓힐지, feather는 경계를 어느 폭으로 섞을지 정한다. 너무 작으면 seam이 남고, 너무 크면 원본의 좋은 영역까지 새 generation이 덮는다.</p>
        </div>
      </section>

      <section id="tiling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Tiling은 memory와 전역 일관성을 교환한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Tile 크기를 줄이면 한 번에 처리하는 activation이 줄어 peak VRAM을 낮출 수 있다. 하지만 각 tile이 제한된 문맥만 보면 긴 선, 글자, 얼굴 identity와 반복 pattern이 경계에서 달라질 수 있다. Overlap은 인접 tile이 공유하는 문맥을 늘려 seam을 줄이지만 계산량과 blend 복잡도를 높인다.</p>
          <p>ComfyUI-TiledDiffusion이나 Ultimate SD Upscale 같은 tiled processing도 core 기능이 아니라 서로 다른 third-party custom-node 구현이다. 전자는 tiled diffusion·VAE와 overlap 같은 계약을, 후자는 Ultimate Stable Diffusion Upscale script의 ComfyUI node 계약을 가진다. 이름이 비슷하다고 parameter·seed·Control 처리까지 같다고 가정하지 않는다.</p>
          <p>먼저 작은 full-frame output으로 구조를 확정하고, tile은 surface detail 단계에 제한하는 편이 원인 추적에 유리하다. Tile마다 prompt·Control·seed handling이 같은지도 선택한 node package 문서와 version으로 확인한다.</p>
        </div>
      </section>

      <section id="release-evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Before와 after를 함께 release한다</h2>
        <div className="not-prose overflow-hidden border border-border">
          {releaseRows.map(([artifact, content, reason]) => (
            <div key={artifact} className="grid min-w-0 border-b border-border last:border-b-0 md:grid-cols-[9rem_minmax(0,1fr)]">
              <code className="border-b border-border bg-muted/20 px-3 py-3 text-xs font-bold md:border-b-0 md:border-r">{artifact}</code>
              <div className="min-w-0 px-3 py-3"><p className="text-sm">{content}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">왜 남기나: {reason}</p></div>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이 글이 마지막 운영 단계에 넘기는 것은 <strong>stage별 output과 earliest-failure report</strong>다. <InternalLink slug="comfyui-custom-nodes-ops">custom-node 운영과 replay bundle</InternalLink>에서 이 산출물을 실행 환경·version과 묶어 팀원이 다시 재생할 수 있게 만든다.</p>
        </div>
        <CapabilityCheck items={[
          'Latent second pass, pixel upscale, detailer와 tiling이 서로 다른 실패를 소유한다는 점을 설명할 수 있다.',
          'Crop-local 좌표를 canvas-global 좌표로 되돌리고 stage별 before/after에서 earliest failure를 찾을 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'ComfyUI · Image upscale', href: 'https://docs.comfy.org/tutorials/utility/image-upscale', note: 'Upscaling과 creative enhancement의 구분, source artifact 경계.' },
          { label: 'ComfyUI · Basic upscale', href: 'https://docs.comfy.org/tutorials/basic/upscale', note: 'Load Upscale Model과 decoded IMAGE의 pixel-stage 연결.' },
          { label: 'ComfyUI-Impact-Pack · FaceDetailer', href: 'https://github.com/ltdrdata/ComfyUI-Impact-Pack', note: 'FaceDetailer가 detector와 detailer를 결합한 third-party custom node라는 구현 경계.' },
          { label: 'ComfyUI-TiledDiffusion', href: 'https://github.com/shiimizu/ComfyUI-TiledDiffusion', note: 'Tiled diffusion·VAE, tile 크기와 overlap을 제공하는 별도 custom-node 구현.' },
          { label: 'ComfyUI Ultimate SD Upscale', href: 'https://github.com/ssitu/ComfyUI_UltimateSDUpscale', note: 'Ultimate Stable Diffusion Upscale script를 연결하는 별도 ComfyUI node package.' },
        ]} />
      </section>
    </div>
  );
}
