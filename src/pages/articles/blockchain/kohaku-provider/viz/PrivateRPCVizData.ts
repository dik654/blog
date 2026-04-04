export const C = {
  real: '#6366f1', dummy: '#94a3b8', shuffle: '#10b981', server: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Line 1: 실제 쿼리 생성',
    body: 'let real_query = Query { address: 0x1234.., method: "getBalance" }\n사용자가 실제로 조회하려는 쿼리.',
  },
  {
    label: 'Line 2~3: 더미 쿼리 K개 생성',
    body: 'let dummies = (0..K).map(|_| Query::random())\nlet mut batch = vec![real_query, ...dummies]\n랜덤 주소/메서드로 더미 쿼리를 생성한다.',
  },
  {
    label: 'Line 4: 무작위 셔플',
    body: 'batch.shuffle(&mut thread_rng())\n실제 쿼리의 위치를 무작위로 섞는다.\n서버가 순서로 추측하는 것도 차단.',
  },
  {
    label: 'Line 5~6: 배치 전송 & 결과 추출',
    body: 'let responses = oram_proxy.batch_query(&batch)\nlet real_response = responses.find(r.id == real_query.id)\n서버 시점: Pr(식별) = 1/(K+1).',
  },
];
