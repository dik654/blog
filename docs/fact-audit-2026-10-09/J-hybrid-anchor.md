# J. hybrid-kv-cache-allocation 깨진 anchor (2026-10-14)

`/cs/ai/hybrid-kv-cache-allocation`의 본문에는 `id="overview"` 절 하나뿐인데 카탈로그와 공용 파일 두 곳이 `#kv-cache`를 가리켜 링크가 페이지 맨 위로만 갔다. 추론 엔진 시리즈를 쓰며 내부 링크 전수 검사로 발견했다. 실제로 있는 `#overview`로 바꾼다.

## 공용 파일 수정 목록
old는 2026-10-14 현재 각 파일에서 한 번만 나온다.

### `src/content/editorial-ownership.ts`
```old
      { label: "Hybrid KV block 회수", href: "/cs/ai/hybrid-kv-cache-allocation#kv-cache" },
```
```new
      { label: "Hybrid KV block 회수", href: "/cs/ai/hybrid-kv-cache-allocation#overview" },
```

### `src/content/knowledge-graph.ts`
```old
    canonicalHref: "/cs/ai/hybrid-kv-cache-allocation#kv-cache",
```
```new
    canonicalHref: "/cs/ai/hybrid-kv-cache-allocation#overview",
```
