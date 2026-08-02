import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4176';

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`systems entry defines its reading frame before asking an abstract question on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/systems-foundation-map`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '낯선 AI 기술을 처음 만나면 어디서부터 볼까?' })).toBeVisible();
    const section = page.locator('#why-common-lens');
    const opening = section.locator('[data-beginner-opening]');
    await expect(opening).toContainText('택배 하나를 보낸다고 생각해 보자');
    expect(await opening.innerText()).not.toMatch(/GPU HPC|Knowledge Compiler|Robot AI|RLVR|MoE/);

    const order = await section.evaluate((element) => {
      const beginner = element.querySelector('[data-beginner-opening]');
      const primer = element.querySelector('[data-concept-primer]');
      const viz = element.querySelector('[data-step-viz]');
      const question = element.querySelector('[data-learning-question]');
      const children = [...element.children];
      return [beginner, primer, viz, question].map((node) => (node ? children.indexOf(node) : -1));
    });
    expect(order.every((index) => index >= 0)).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}

test('pre-training entry introduces the learning loop before 4B and 9B choice', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/llm-pretraining-scaling`, { waitUntil: 'networkidle' });

  const section = page.locator('#deployment-first');
  const opening = section.locator('[data-beginner-opening]');
  const question = section.locator('[data-learning-question]');
  await expect(opening).toContainText('Pre-training은 아주 많은 문장');
  await expect(opening).toContainText('다음 조각을 예측한다');
  await expect(question).toContainText('약 40억 개의 조절 숫자');

  const relation = await section.evaluate((element) => {
    const openingNode = element.querySelector('[data-beginner-opening]');
    const questionNode = element.querySelector('[data-learning-question]');
    return openingNode && questionNode
      ? Boolean(openingNode.compareDocumentPosition(questionNode) & Node.DOCUMENT_POSITION_FOLLOWING)
      : false;
  });
  expect(relation).toBe(true);
});

const frontierEntries = [
  {
    slug: 'animation-production-workflow',
    section: '#overview',
    openingText: '장면(shot)은 카메라가 이어서 보여 주는 짧은 영상 단위',
    questionText: '가장 좋은 결과 하나를 고르면 제작이 끝날까',
  },
  {
    slug: 'moe-ssd-streaming',
    section: '#three-numbers',
    openingText: '744B는 그 숫자가 약 7,440억 개라는 뜻',
    questionText: '모델 전체가 RAM에 들어간 것일까',
  },
  {
    slug: 'reasoning-post-training-frontier',
    section: '#current-problem',
    openingText: '추론 모델은 수학·코딩처럼 여러 단계를 거치는 문제',
    questionText: '추론 성능은 계속 오를까',
  },
  {
    slug: 'robot-ai-top-down',
    section: '#execution-contract',
    openingText: 'VLA는 영상(vision)과 언어(language)',
    questionText: '행동 후보를 곧바로 모터에 보내면 끝일까',
  },
  {
    slug: 'dit-flow-matching-evaluation',
    section: '#design-space',
    openingText: 'DiT는 그 방향을 계산하는 신경망의 구조',
    questionText: '서로 바꿔 조합할 수 있는 두 선택일까',
  },
  {
    slug: 'knowledge-compiler',
    section: '#why-contracts',
    openingText: '자료를 답으로 바꾸는 반복 가능한 제작 과정',
    questionText: '리뷰 하나를 만들면 충분하지 않을까',
  },
  {
    slug: 'agent-runtime-current-first',
    section: '#runtime-stack',
    openingText: 'AI 에이전트는 답만 쓰는 모델에 작업 도구와 실행 기록을 붙인 시스템',
    questionText: '도구 오류 한 번에 무너질까',
  },
  {
    slug: 'agent-frameworks',
    section: '#ownership',
    openingText: '프레임워크는 반복 작업의 틀을 빌려주지만 업무 책임까지 대신 알지는 못한다',
    questionText: '어떤 프레임워크를 쓰면 안전할까',
  },
  {
    slug: 'compression-pipeline',
    section: '#deployment-contract',
    openingText: '모델 파일을 작게 만드는 것과 실제 서비스를 가볍게 만드는 것은 다르다',
    questionText: '경량화에 성공한 것일까',
  },
  {
    slug: 'llm-disaggregated-serving',
    section: '#slo-first',
    openingText: '언어 모델의 한 요청에는 성격이 다른 두 계산 단계',
    questionText: '답이 중간중간 끊길까',
  },
  {
    slug: 'llm-serving-ops',
    section: '#overview',
    openingText: 'Pod 여덟 개를 원한다고 선언해도 GPU를 배정받고',
    questionText: '가장 먼저 GPU를 더 사야 할까',
  },
  {
    slug: 'on-device-llm-runtime',
    section: '#release-not-demo',
    openingText: '학습된 모델 파일은 아직 휴대폰이 실행할 프로그램이 아니다',
    questionText: '이제 앱에 배포해도 될까',
  },
  {
    slug: 'llm-interpretability-frontier',
    section: '#current-question',
    openingText: '언어 모델은 문장을 처리할 때 층마다 아주 긴 숫자 묶음을 남긴다',
    questionText: '어디까지 실제 추론에 쓰인 개념이라고 말할 수 있을까',
  },
  {
    slug: 'qwen-korean-consistency',
    section: '#overview',
    openingText: '모델은 문장을 통째로 쓰지 않고 작은 글자 조각인',
    questionText: '바로 모델 전체를 다시 학습해야 할까',
  },
  {
    slug: 'rl-decision-system-contracts',
    section: '#decision-entry',
    openingText: '강화학습에서는 agent가 현재 보이는 정보를 받고 행동을 고른다',
    questionText: '학습 알고리즘 이름부터 골라도 될까',
  },
  {
    slug: 'rl-mdp-bellman',
    section: '#interaction',
    openingText: '사진 분류는 사진과 정답 이름을 비교하면 한 문제가 끝난다',
    questionText: '입력과 정답 한 쌍만 모아 학습할 수 있을까',
  },
  {
    slug: 'rl-pomdp-state-estimation',
    section: '#observation-state',
    openingText: '로봇이 실제로 놓인 위치·속도·주변 물체를',
    questionText: '현재 frame만 보는 policy가 해결할 수 있을까',
  },
  {
    slug: 'rl-ppo-continuous-control',
    section: '#policy-shift',
    openingText: 'Agent가 실제로 움직이며 모은 한 묶음의 경험을',
    questionText: '선택 확률을 크게 올리면 성능도 같은 방향으로 크게 좋아질까',
  },
  {
    slug: 'vision-representation-encoders-current',
    section: '#current-question',
    openingText: '이미지를 숫자로 바꾸는 모델을',
    questionText: '같은 마지막 embedding을 써도 될까',
  },
  {
    slug: 'audio-representation-neural-codecs',
    section: '#representation-contract',
    openingText: 'Sample rate는 1초 동안 소리를 몇 번',
    questionText: '8 kHz 전화 음성을',
  },
  {
    slug: 'competition-workflow',
    section: '#overview',
    openingText: 'Public leaderboard는',
    questionText: 'Public leaderboard가',
  },
  {
    slug: 'eda-workflow',
    section: '#overview',
    openingText: 'Window는 긴 시간 기록',
    questionText: '겹치는 10분',
  },
  {
    slug: 'llm-architecture-gallery',
    section: '#foundation-contract',
    openingText: 'Transformer도 먼저 문맥을',
    questionText: '새 모델 이름',
  },
  {
    slug: 'lora-finetuning',
    section: '#behavior-contract',
    openingText: 'LoRA는 원래 모델',
    questionText: '둘 다 LoRA',
  },
  {
    slug: 'native-speech-generation',
    section: '#two-system-contracts',
    openingText: 'Cascade는 음성을 글로',
    questionText: 'Native speech-to-speech',
  },
  {
    slug: 'object-detection-systems',
    section: '#decision',
    openingText: 'Object detector는',
    questionText: '창고 A는',
  },
  {
    slug: 'ocr-document-ai-map',
    section: '#document-contract',
    openingText: 'OCR은 사진 속 글자',
    questionText: 'OCR의 목표',
  },
  {
    slug: 'open-image-video-models',
    section: '#overview',
    openingText: '생성 모델의 ‘최고’',
    questionText: 'Ideogram',
  },
  {
    slug: 'optimization-geometry',
    section: '#objective',
    openingText: 'Loss 또는 objective',
    questionText: 'Loss 하나',
  },
  {
    slug: 'speech-audio-models',
    section: '#why-split',
    openingText: '음성 AI에는',
    questionText: 'sampling부터',
  },
  {
    slug: 'speech-recognition-objectives',
    section: '#alignment-problem',
    openingText: 'Audio frame은',
    questionText: '1초에 약',
  },
  {
    slug: 'stable-diffusion-open-models',
    section: '#overview',
    openingText: 'Checkpoint는',
    questionText: '최신 이미지',
  },
  {
    slug: 'tokenizer',
    section: '#overview',
    openingText: 'Tokenizer는 문자열',
    questionText: '좋은 tokenizer',
  },
  {
    slug: 'training-pipeline',
    section: '#overview',
    openingText: '모델 weight도',
    questionText: '모델 가중치를',
  },
  {
    slug: 'vision-promptable-segmentation-tracking',
    section: '#task-contract',
    openingText: 'Segmentation은',
    questionText: '빨간 안전 캡',
  },
  {
    slug: 'world-model-physical-ai',
    section: '#why-split',
    openingText: 'World model은 현재 관측',
    questionText: '그럴듯한 다음 영상',
  },
] as const;

for (const entry of frontierEntries) {
  test(`${entry.slug} defines its entry vocabulary before the first question`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${entry.slug}`, { waitUntil: 'networkidle' });

    const section = page.locator(entry.section);
    const opening = section.locator('[data-beginner-opening]');
    const question = section.locator('[data-learning-question]').first();
    await expect(opening).toContainText(entry.openingText);
    await expect(question).toContainText(entry.questionText);

    const openingComesFirst = await section.evaluate((element) => {
      const openingNode = element.querySelector('[data-beginner-opening]');
      const questionNode = element.querySelector('[data-learning-question]');
      return openingNode && questionNode
        ? Boolean(openingNode.compareDocumentPosition(questionNode) & Node.DOCUMENT_POSITION_FOLLOWING)
        : false;
    });
    expect(openingComesFirst).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}
