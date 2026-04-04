export default function Applications() {
  const rows = [
    { field: '컴퓨터 비전', tech: '이미지 분류 · 객체 탐지 · 자율주행', models: 'ResNet · YOLO · ViT' },
    { field: '자연어 처리', tech: '번역 · 요약 · 챗봇 · 코딩', models: 'BERT · GPT · Claude' },
    { field: '음성', tech: '음성 인식(STT) · 음성 합성(TTS)', models: 'Whisper · WaveNet' },
    { field: '생성 AI', tech: '이미지 · 텍스트 · 비디오 생성', models: 'Stable Diffusion · Sora' },
    { field: '과학', tech: '단백질 구조 예측 · 신약 개발', models: 'AlphaFold · AlphaFold3' },
    { field: '게임', tech: '전략 게임 · 보드 게임', models: 'AlphaGo · AlphaStar' },
  ];

  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딥러닝의 활용</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        대규모 데이터 + 깊은 네트워크 + GPU 가속 — 거의 모든 산업 분야에 침투.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-4 py-2 text-left">분야</th>
              <th className="border border-border px-4 py-2 text-left">주요 기술</th>
              <th className="border border-border px-4 py-2 text-left">대표 모델</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.field}>
                <td className="border border-border px-4 py-2 font-medium">{r.field}</td>
                <td className="border border-border px-4 py-2">{r.tech}</td>
                <td className="border border-border px-4 py-2">{r.models}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
