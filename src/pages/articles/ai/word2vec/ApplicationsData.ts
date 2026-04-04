export const cosineSimilarityCode = `import word2vec
import numpy as np

model = word2vec.load('ko_text8.bin')

# 유사어 검색
indexes, metrics = model.similar('서울', n=5)
# → 부산(0.87), 인천(0.85), 대구(0.83), 광주(0.81), 대전(0.80)

# 코사인 유사도 직접 계산
def cosine_sim(a, b):
    return np.dot(a / np.linalg.norm(a), b / np.linalg.norm(b))

sim = cosine_sim(model['고양이'], model['강아지'])  # → 0.91`;

export const cosineAnnotations = [
  { lines: [6, 8] as [number, number], color: 'sky' as const, note: '유사어 검색 — 코사인 기반' },
  { lines: [10, 12] as [number, number], color: 'emerald' as const, note: 'L2 정규화 후 내적 = 코사인 유사도' },
];

export const analogyCode = `# 왕 - 남자 + 여자 = ?
result_vec = model['왕'] - model['남자'] + model['여자']
nearest = model.closest_to_vector(result_vec, n=3)
# → 왕비, 여왕, 왕녀

# 서울 - 한국 + 일본 = ?
result = model['서울'] - model['한국'] + model['일본']
# → 도쿄, 오사카, 교토`;

export const analogyAnnotations = [
  { lines: [1, 4] as [number, number], color: 'sky' as const, note: '성별 방향 벡터 산술' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: '수도-국가 관계 벡터 산술' },
];

export const doc2vecCode = `# Doc2Vec (PV-DM: Paragraph Vector + Distributed Memory)
# 입력: [문서ID 벡터, w_{t-c}, ..., w_{t-1}] → 예측: w_t
# 문서 벡터 d가 문서 전체의 '주제' 정보를 압축해 담음

model.doc2vec(
    train="corpus.txt",  # 한 줄 = 한 문서
    output="doc_vecs.bin",
    size=300,
    window=10,
)`;

export const doc2vecAnnotations = [
  { lines: [1, 3] as [number, number], color: 'sky' as const, note: 'PV-DM — 문서 벡터가 주제 압축' },
  { lines: [5, 10] as [number, number], color: 'emerald' as const, note: 'Doc2Vec 학습 API' },
];
