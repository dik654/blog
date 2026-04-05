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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">산업별 혁신 사례</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. 의료 & 생명과학
//    - AlphaFold (2020): 단백질 3D 구조 예측
//      20년 풀리지 않던 문제 해결
//      200M+ 단백질 구조 공개
//    - Pathology AI: 암 진단, H&E 슬라이드 분석
//    - Drug Discovery: 분자 생성, 화합물 screening
//    - Medical Imaging: X-ray, MRI, CT 병변 검출
//
// 2. 자율주행
//    - Tesla FSD: camera-only vision
//    - Waymo: LiDAR + camera fusion
//    - 객체 탐지, depth estimation, path planning
//    - Simulation (GTA-style 학습 데이터)
//
// 3. 금융
//    - 이상 거래 탐지 (사기)
//    - 신용 평가
//    - 알고리즘 트레이딩
//    - 문서 이해 (contracts, filings)
//
// 4. 제조 & 물류
//    - Quality Inspection (결함 탐지)
//    - Predictive Maintenance
//    - 로봇 pick-and-place
//    - Supply chain 최적화
//
// 5. 소매 & E-commerce
//    - Visual Search
//    - Recommendation (Netflix, Amazon)
//    - Virtual try-on
//    - Demand forecasting

// AI 안전과 정렬:
//   - AI 규제 (EU AI Act, US Executive Order)
//   - Alignment research (Anthropic, OpenAI)
//   - Interpretability (BlueTeam)
//   - Safety red-teaming`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">2024 LLM 주요 모델</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Frontier Models (2024)
//
// Closed Source:
//   GPT-4, GPT-4o (OpenAI)
//     - 추정 1.7T params
//     - Multi-modal (vision, voice)
//     - Tool use, code interpreter
//
//   Claude 3.5 Sonnet (Anthropic)
//     - 200K context window
//     - Artifacts, computer use
//     - XML-tagged prompts
//
//   Gemini 1.5 Pro (Google)
//     - 1M+ context window
//     - Multi-modal
//     - Code generation
//
// Open Source:
//   LLaMA-3 (Meta): 8B, 70B, 405B
//   Mistral Large: ~120B
//   Mixtral 8×22B: MoE, 140B total
//   Qwen-2 (Alibaba): 0.5B~72B
//   Gemma-2 (Google): 9B, 27B
//   DeepSeek-V2: MoE 236B
//
// Specialized:
//   Codex, CodeLLaMA: 코드 생성
//   Whisper: 음성 인식
//   DALL-E 3, Midjourney, SD3: 이미지 생성
//   Sora, Runway: 비디오 생성

// 성능 벤치마크:
//   MMLU (지식): GPT-4 86%, Human 89%
//   HumanEval (코딩): GPT-4 90%
//   GSM8K (수학): Claude 3.5 Opus 95%
//   MT-Bench: 다중 턴 대화

// 트렌드:
//   - 긴 문맥 (1M+ tokens)
//   - Multi-modal 통합
//   - Agent (tool use, planning)
//   - Efficient inference (smaller, faster)
//   - Open source 경쟁 가속`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>의료·자율주행·금융·제조</strong> 등 전 산업 변혁 중.<br />
          요약 2: <strong>GPT-4·Claude·Gemini·LLaMA</strong>가 2024 frontier.<br />
          요약 3: <strong>긴 문맥·멀티모달·agent</strong>가 최신 트렌드.
        </p>
      </div>
    </section>
  );
}
