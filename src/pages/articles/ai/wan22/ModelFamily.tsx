export default function ModelFamily() {
  return (
    <section id="model-family" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1단계: 모델 패밀리부터 분리하기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Wan2.2는 하나의 checkpoint만 가리키는 이름이 아니다. 공개 저장소 기준으로 T2V-A14B는 text-to-video,
          I2V-A14B는 image-to-video, TI2V-5B는 text-image-to-video hybrid 모델이다. 이후 S2V-14B와 Animate-14B도
          공개 라인업에 포함된다. 내부 구조를 설명할 때는 “어떤 task checkpoint를 말하는가”를 먼저 고정해야 한다.
        </p>
        <p>
          A14B 계열은 MoE video diffusion 모델로 설명되고, 480p와 720p 생성을 지원한다.
          TI2V-5B는 더 작은 dense/hybrid 계열로, Wan2.2-VAE의 높은 압축률을 이용해 720p 24fps를
          소비자급 GPU에서도 다룰 수 있게 하는 쪽에 초점이 있다.
        </p>
        <p>
          따라서 블로그의 기본 해석은 두 층으로 나누면 명확하다. “A14B = MoE로 capacity를 키운 고성능 경로”,
          “TI2V-5B = VAE 압축과 작은 모델 크기로 접근성을 높인 경로”다.
        </p>
      </div>
    </section>
  );
}
