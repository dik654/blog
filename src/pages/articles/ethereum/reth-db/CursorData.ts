export const CURSOR_OPS = [
  {
    title: "seek_exact(key)",
    desc: "typed key와 정확히 일치하는 entry를 찾는다. 결과와 비용 특성은 선택된 backend implementation에 따른다.",
    useCase: "특정 canonical mapping이나 V1 table row 조회",
  },
  {
    title: "seek(key)",
    desc: "정렬 순서에서 key 이상인 첫 entry를 찾아 range scan의 시작점을 만든다.",
    useCase: "block·transaction number 범위의 시작점",
  },
  {
    title: "walk_range(range)",
    desc: "transaction snapshot 안에서 정렬된 범위를 iterator로 노출하고 caller가 upper bound를 반복 구현하지 않게 한다.",
    useCase: "pipeline batch와 history scan",
  },
  {
    title: "upsert / append",
    desc: "쓰기 cursor는 일반 삽입과 정렬 입력 전용 append를 구분한다. append의 precondition을 위반하면 안 된다.",
    useCase: "V1 MDBX table의 ordered batch write",
  },
] as const;
