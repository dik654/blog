# B1-global-history-and-sources 감사 원장
확인일: 2026-10-09. 글 21편(global-history 12 · testimony 3 · record-numbers 3 · inference-from-sources 3). 열어 본 URL 38개(직접 성공 23 / 직접 실패 15 — 실패 15 중 13개는 web.archive.org·Met Collection API·UNESCO 대체 페이지·Crossref·도서관 카탈로그로 2차 확인, 2개는 끝내 미확인).

감사 범위: 조립 tsx 21개 + `global-history-foundations-expansion-data.ts`(6편 본문) + 6편 인라인 본문 + 9편 방법론 글 본문 전체, `src/content/<cat>/index.ts`·`articles.ts`, `article-evidence.ts`의 21개 키, `article-learning.ts` 21개 항목(coreIdea·conceptExplanations·papers), `knowledge-graph.ts`의 testimony/record-numbers/inference-from-sources 개념 정의 40개. 방법론 9편의 1차 사료 4종(Gutenberg eBook 7142·2456·2850·17150)은 전문을 내려받아 인용문을 문자열 대조했다. 모든 `(가정)` 수치 사례는 덧셈·나눗셈을 검산했다(전부 일치, 아래 글별 기록 참조).

## 요약
- 발견: WRONG 0 · OUTDATED 1 · MISLEADING 3 · CALC 0 · LINK 7 · MISSING 2 · UNVERIFIED 3
- 가장 중요한 발견
  1. `article-evidence.ts` `global-history/cities-writing-rations-and-early-law`의 메트로폴리탄 링크(objectID 322609)는 배급 점토판이 아니라 **신아시리아 라마수(인면 유익 사자상, 883–859 BCE)** 이다. 본문 `sources[]`의 327069가 맞다. (LINK, 심각)
  2. 냉전 글의 WTO 인용 발췌 "more viable and durable"은 링크된 **마라케시 선언**에 없고, 별개 문서인 **WTO 설립 마라케시 협정 전문(preamble)** 의 문장이다. (LINK)
  3. 냉전 글의 반둥 공동성명 링크(`1955-E.pdf`)는 공동성명 원문이 아니라 **UN『Yearbook on Human Rights for 1955』(1957년 간행)** 전체(34MB)이며 공동성명은 그 339쪽에 "Extracts"로만 수록돼 있다. citation·note가 이를 "1차 문서"로 적어 오도. (LINK/MISLEADING)
  4. 제국 글의 UNESCO "The Maintenance of Empire" PDF는 현재 `unesco.org/en/silkroads` 홈으로 301 리다이렉트되어 **문서가 사라졌다**(Wayback 2024-10-02 사본에서만 내용 확인). (OUTDATED)
  5. 혁명 글의 LoC 인용 발췌 "free and equal in their rights"는 링크된 LoC 페이지 어디에도 없고 표준 영역(1조 "free and equal in rights")과도 다르다. (LINK)
  6. 방법론 9편의 1차 사료 인용 15개(투키디데스 1.10·1.22, 헤로도토스 7.60·7.148–152·7.184–187과 역자 주 53·173·175·177·178·184·185·188·190, 요세푸스 서문 1·4·8·12, 함무라비 196–204·209–225·268–277조·65조 뒤 주·머리말·말미 문장)는 **전부 Gutenberg 전사본과 문자 그대로 일치**했고, 48로 나눈 검산·끝자리 3220 유도·85명 평균도 재계산에서 맞았다.

## 발견 (심각도 순)
| # | route | 위치(file:line) | 주장(원문 인용) | 판정 | 근거(URL + 인용문) | 제안 수정 |
|---|---|---|---|---|---|---|
| 1 | global-history/cities-writing-rations-and-early-law | src/content/article-evidence.ts:13368 (article-learning.ts:153089 papers도 동일 href) | `label: "The Met · Cuneiform tablet: record of rations", href: ".../search/322609", note: "기원전 2028년 무렵 전령의 맥주·빵·기름·양파 배급 점토판을 확인합니다."` | LINK | Met Collection API `https://collectionapi.metmuseum.org/public/collection/v1/objects/322609` → `"title": "Human-headed winged lion (lamassu)", "objectDate": "ca. 883–859 BCE", "period": "Neo-Assyrian", "accessionNumber": "32.143.2"`. 올바른 객체는 `.../objects/327069` → `"title": "Cuneiform tablet: record of rations of beer, bread, oil, and onions for messengers", "objectDate": "ca. 2028 BCE", "period": "Ur III", "culture": "Neo-Sumerian", "accessionNumber": "1985.180.2"` | evidence·learning href를 `https://www.metmuseum.org/art/collection/search/327069`로 교체(본문 sources와 일치시킴) |
| 2 | global-history/cold-war-decolonization-and-globalization | src/pages/articles/global-history/cold-war-decolonization-and-globalization.tsx:65 | `source: "World Trade Organization · Marrakesh Declaration", excerpt: "more viable and durable", ... href: ".../marrakesh_decl_e.htm"` | LINK | 마라케시 선언 전문(`https://www.wto.org/English/docs_e/legal_e/marrakesh_decl_e.htm`, curl 200)에는 "viable"·"durable"이 없음. 해당 구절은 WTO 설립 협정 전문: `https://www.wto.org/english/docs_e/legal_e/04-wto_e.htm` — "Resolved, therefore, to develop an integrated, more viable and durable multilateral trading system encompassing the General Agreement on Tariffs and Trade, the results of past trade liberalization efforts, and all of the results of the Uruguay Round" | 발췌를 선언의 실제 문장(예: "initiates the transition from the GATT to the WTO" 또는 "will lead to a progressively more open world trading environment")으로 바꾸거나, href·citation을 "Marrakesh Agreement Establishing the WTO, Preamble"(04-wto_e.htm)으로 교체 |
| 3 | global-history/cold-war-decolonization-and-globalization | 같은 파일:64; article-evidence.ts:12156; article-learning.ts:134406 | `citation: "Final Communiqué of the Asian-African Conference, Bandung, 24 April 1955", href: "https://digitallibrary.un.org/record/860963/files/1955-E.pdf", note: "29개 아시아·아프리카 국가가 합의한 … 1차 문서입니다."` | MISLEADING (LINK) | 직접 접속은 봇 차단(curl 202·본문 0바이트, WebFetch 403). Wayback 사본(2025-03-29, 34,171,467바이트) 표지: "YEARBOOK ON HUMAN RIGHTS FOR 1955 / UNITED NATIONS, NEW YORK, 1957 / Sales No.: 1958. XIV. 1". 목차: "Final Communique of the Asian-African Conference, Bandung, 18-24 April 1955 (Extracts) … 339". 본문: "The Asian-African conference, convened by the Governments of Burma, Ceylon, India, Indonesia and Pakistan, met in Bandung from 18 to 24 April 1955. In addition to the sponsoring countries, the following twenty-four countries participated". "economic co-operation" 문구와 B. Cultural Co-operation, C. Human Rights and Self-determination, F. Problems of Dependent Peoples, G. Promotion of World Peace and Co-operation 항목은 발췌에 있음 → 본문 서술(29개국, 경제·문화 협력, 인권·자결, 식민주의, 평화)은 OK | citation을 "UN, Yearbook on Human Rights for 1955 (1957), pp. 339– , 'Final Communiqué of the Asian-African Conference, Bandung, 18–24 April 1955 (Extracts)'"로 바로잡고 note의 "1차 문서"를 "UN 연감 수록 발췌"로 수정. 가능하면 전문이 실린 다른 공식 소장처를 병기 |
| 4 | global-history/empires-roads-taxes-and-law | empires-roads-taxes-and-law.tsx:63; article-evidence.ts:12137; article-learning.ts:134219 | `href: "https://en.unesco.org/silkroad/sites/default/files/knowledge-bank-article/the%20maintenance%20of%20empire.pdf"` | OUTDATED | 2026-10-09 직접 요청: `301 Moved Permanently → https://www.unesco.org/en/silkroads`(HTML 홈, PDF 아님). Wayback `https://web.archive.org/web/20241002144309id_/…` (200, PDF 498,644바이트)에서만 내용 확인: "chapter three The Maintenance of Empire … The formidable empire of Cyrus the Great of Persia (559-530 bce) had the earliest network of highways. The so-called Royal Road ran 2,700 kilometres … These roads were not really designed for merchants and travellers but were mainly military and administrative highways. However, their existence inevitably helped the growth of trade." "The Chinese built an elaborate system of highways and canals", "The highway system constructed by the Romans across their vast empire was so well made…" → 발췌·본문 비교 내용은 정확 | href를 Wayback 사본으로 바꾸거나 UNESCO Silk Roads 지식은행에서 새 위치를 찾아 교체. 교체 전까지 note에 "원 URL 소실, 2024-10-02 아카이브" 명기 |
| 5 | global-history/revolutions-citizenship-and-industrial-empires | revolutions-citizenship-and-industrial-empires.tsx:62 | `source: "Library of Congress · 1789 Declaration of Rights", excerpt: "free and equal in their rights"` | LINK | LoC 페이지 Wayback 사본(2026-01-21, 원 URL은 403)의 전체 텍스트에 "free and equal" 없음. 페이지 설명은 "Declaration of the Rights of Man and of the Citizen Adopted by the National Assembly during its Sessions on August 20, 21, 25 and 26, 1789, and Approved by the King … A document comprised of 19 articles was presented on August 17 and discussed during parliamentary sessions on August 20, 21, 25 and 26." 선언 1조 표준 영역은 "Men are born and remain free and equal in rights"(their 없음) | 발췌를 LoC 페이지 실제 문장(예: "Adopted by the National Assembly during its Sessions on August 20, 21, 25 and 26, 1789")으로 바꾸거나, 1조를 인용하려면 원문 이미지/프랑스어("Les hommes naissent et demeurent libres et égaux en droits")를 별도 출처로 명시 |
| 6 | global-history/agriculture-settlement-and-neolithic-tradeoffs | src/content/article-evidence.ts:13365; article-learning.ts:153052 | `href: "https://ocw.mit.edu/courses/sts-007-technology-in-history-fall-2010/resources/mitsts_007f10_lec02/"` (label "MIT OpenCourseWare · The Neolithic Revolution") | LINK | `curl -I` → `HTTP/2 301, location: …/resources/mitsts_007f10_lec02/index.html`, WebFetch "Too many redirects (exceeded 10)". 강의노트 목록 페이지(`…/pages/lecture-notes/`, 200)에서 신석기 노트는 `resources/mitsts_007f10_lec06_notes/`이고 lec02는 다른 강의. 본문 sources의 PDF 링크(`…_MITSTS_007F10_lec06_notes.pdf`, 200)는 정상이며 20행에 "Agriculture is both: food production and shaping the world" 그대로 있음(문서 머리글은 "STS.007 / Notes for class 7 / Neolithic Revolution") | evidence·learning href를 본문 sources와 같은 lec06 노트 PDF 또는 `…/resources/mitsts_007f10_lec06_notes/`로 교체 |
| 7 | inference-from-sources/naming-the-past | naming-the-past.tsx:121-122; article-learning.ts(해당 항목 papers.assumptions "존스가 기원전 3천년으로 잡은 제작 연대") | "존스는 같은 머리말에서 함무라비를 기원전 3천년에 두었지만" | MISLEADING | Gutenberg 17150 머리말: "the laws which were enacted by a king of Babylonia in the third millennium B.C."; 표제지: "THE CODE OF LAWS PROMULGATED BY HAMMURABI, KING OF BABYLON B.C. 2285-2242". "third millennium"은 기원전 3000~2001년의 천년기이지 "기원전 3천년"이라는 연도가 아니며, 존스의 구체적 연대는 B.C. 2285-2242 | "기원전 3천년기(제3천년기)에 두었고 표제지에는 B.C. 2285-2242로 적었지만"으로 수정 |
| 8 | record-numbers/numbers-that-command | numbers-that-command.tsx:171-172 (TermBreakdown boundary) | "같은 조항 묶음에서 그 여자가 죽으면 답이 금액에서 다른 종류로 바뀝니다." | MISLEADING | Johns 영역 §210 "If that woman has died, one shall put to death his daughter."(되갚기) 이지만 §212 "If that woman has died, he shall pay half a mina of silver.", §214 "If that maidservant has died, he shall pay one-third of a mina of silver." → 세 칸 중 신사의 딸 칸만 종류가 바뀌고 나머지 두 칸은 여전히 금액. 본문 94-96행은 이를 정확히 적고 있어 boundary 문장만 과일반화 | "신사의 딸 칸에서는 답이 금액에서 되갚기로 바뀌지만(210조), 가난한 사람의 딸·여종 칸은 금액이 커질 뿐입니다(212·214조)"로 수정 |
| 9 | global-history/agriculture-settlement-and-neolithic-tradeoffs | global-history-foundations-expansion-data.ts:131 | `excerpt: "adapted to a sedentary life and agriculture"` | LINK(경미) | UNESCO 1405 Wayback 사본(2026-01-07): "Together they testify to the evolution of social organization and cultural practices as humans adapted to a sedentary life." 와 "… illuminating the early adaptation of humans to sedentary life and agriculture." 두 문장을 이어 붙인 꼴이며 발췌 문자열 그대로는 없음 | 발췌를 둘 중 하나의 실제 문장으로 교체 |
| 10 | global-history/cities-writing-rations-and-early-law | article-evidence.ts:13369; article-learning.ts:153090 | `label: "Musée du Louvre · The Code of Hammurabi", href: "https://collections.louvre.fr/en/ark:/53355/cl010174436", note: "282개 판단과 왕권 표현이 새겨진 함무라비 비문의 성격을 확인합니다."` / learning contribution "기원전 1750년 무렵 282개 판단…" | LINK(경미) | collections.louvre.fr 항목(200): 제목 "Code de Hammurabi (Stèle)", 연대 "-1792 / -1750", 발견지 "Suse", 설명에 "décisions de justice gravées sur la stèle" — "282"·"legal code in the modern sense" 문구는 없음. 그 문구는 본문 sources가 쓴 `https://www.louvre.fr/en/the-code-of-hammurabi`(200)에 있음: "The text, engraved around 1750 BC, is not a 'legal code' in the modern sense of the term", "It contains 282 legal judgements handed down by Hammurabi, king of Babylon" | evidence·learning href를 louvre.fr 해설 페이지로 통일하거나 note를 collections 페이지 내용에 맞게 조정 |
| 11 | global-history/conquest-disease-silver-and-oceanic-exchange | conquest-disease-silver-and-oceanic-exchange.tsx:63 | `citation: "Cambridge University Press, Journal of Economic History 77(1)"` (저자·연도·DOI 없음) | MISSING(서지) | Crossref `https://api.crossref.org/works/10.1017/S0022050717000092`: title "Plague and Lethal Epidemics in the Pre-Industrial World", container "The Journal of Economic History", volume 77, issue 1, issued 2017-02-21, authors Alfani, Murphy. 본문 발췌 "did not affect all American regions"는 페이지 본문 "Finally, epidemics did not affect all American regions in the same way." 와 일치 | citation을 "Guido Alfani & Tommy E. Murphy (2017), 'Plague and Lethal Epidemics in the Pre-Industrial World', JEH 77(1), doi:10.1017/S0022050717000092"로 보강 |
| 12 | record-numbers/what-the-total-cannot-tell | what-the-total-cannot-tell.tsx:150-152; article-learning.ts(해당 항목 papers.assumptions "배의 수 1,207척과 기병 8만의 출처는 적혀 있지 않습니다") | "배 1,207척처럼 세어졌다고 전제되는 수입니다. 어떻게 세었는지는 적혀 있지 않습니다." | MISSING | Gutenberg 2456, 7권 89절: "Of the triremes the number proved to be one thousand two hundred and seven" 뒤에 민족별 척수(페니키아 300 등)가 열거됨; 7권 87절: "the number of the cavalry proved to be eight myriads". 즉 세는 절차는 없어도 두 수가 본문 어디서 처음 제시되고 1,207이 민족별 합계로 구성된다는 사실은 적혀 있음 | "세는 절차는 적혀 있지 않지만 1,207은 7권 89절의 민족별 척수 목록의 합이고 기병 8만은 7권 87절에 먼저 나온다"고 한 줄 보강 |
| 13 | global-history/open-web-platform-curation-and-digital-divides | global-history-foundations-expansion-data.ts:408 | `excerpt: "content moderation, and content curation"` | UNVERIFIED | `https://unesdoc.unesco.org/ark:/48223/pf0000387339` 직접 403, Wayback 사본은 JS 셸(1,262바이트)이라 본문 추출 불가. 대체로 `https://www.unesco.org/en/internet-trust/guidelines`(200)에서 문서 식별자 pf0000387339·2023-11 간행과 "content moderation and curation policies and practices", "Platforms' content curation and moderation policies and processes should be transparent" 확인 → 제목·연도·취지는 OK, 쉼표가 들어간 정확한 발췌 문자열만 미확인 | PDF 직접 열람 후 발췌를 실제 문장으로 맞출 것 |
| 14 | global-history/conquest-disease-silver-and-oceanic-exchange | 같은 파일:62; article-evidence.ts:12144 | `href: "https://www.si.edu/object/potosi-mita-1573-1700-…%3Asiris_sil_707155"` | UNVERIFIED(링크) | 직접 403(봇 차단), `https://www.si.edu/object/siris_sil_707155` 403, siris-libraries 403, Wayback 404(아카이브 없음). 책 자체는 확인: Cambridge Annales 서평 URL "jeffrey-a-cole-the-potosi-mita-15731700-compulsory-indian-labor-in-the-andes-stanford-stanford-university-press-1985-206-p", UNSAM·ECU 도서관 카탈로그 "The Potosí mita, 1573-1700 : compulsory indian labor in the Andes" | 봇 차단 페이지이므로 사람이 브라우저로 1회 확인해 두고, citation에 "Jeffrey A. Cole, Stanford University Press, 1985"를 병기 |
| 15 | global-history/agriculture-settlement-and-neolithic-tradeoffs | global-history-foundations-expansion-data.ts:132 | `citation: "MIT OpenCourseWare, STS.007 Technology in History, Neolithic Revolution"` | UNVERIFIED(경미) | PDF 머리글은 "Notes for class 7"인데 파일명은 lec06. 강의 번호 표기 불일치는 MIT 측 자료 문제로 보이며 글의 주장에는 영향 없음 | citation에 "lecture notes (file lec06_notes; header 'Notes for class 7')" 정도로 적어 두면 추적 가능 |
| 16 | global-history/* (12편) | src/content/global-history/articles.ts 섹션 제목 vs data 파일 섹션 제목 | 예: 농경 글 names 제목 catalog "가축화 과정·정착 의존…" vs data "작물화·가축화 과정, 정착 의존…"; 인류 이동 need "물건보다 관계와 기억도" vs data "물건만이 아니라 관계와 기억도"; 수도원 limits "정전을" vs data "권위 있는 문헌을" | (내부 일관성, 사실 오류 아님) | 파일 직접 대조 | 목차 제목을 data와 동기화 |

## 글별 검증 기록

### global-history/human-dispersal-foraging-and-social-networks
- 추출한 고유 사실 주장 수: 6, 검증 6, 미검증 0
- 연 자료:
  - https://humanorigins.si.edu/human-characteristics/social-life — 200(curl, UA 필요; WebFetch 실패) — "Building Social Networks Beginning 130,000 years ago … By 130,000 years ago, groups who lived 300 km (186 mi) apart were exchanging resources." "Expanding social networks led, eventually, to the complex social lives of modern humans." "By 40,000 years ago, humans were transporting decorative shells—and perhaps trading them—over areas of more than 500 km (310 mi)." → 본문 34행(13만 년 전·300km·더 뒤의 장거리 조개 이동)과 발췌 일치
  - https://whc.unesco.org/en/list/167/ — 직접 403 → Wayback 2025-12-23 200 — "traces of complex plant-food gathering systems that date back before 18,000 years BP associated with grindstones to produce flour from wild grass seeds" → 본문 38행·발췌 일치
- 빠진 내용: 없음(글의 범위 안에서 주장은 전부 출처 범위 안에 머묾)
- 계산: 60+25+15=100, 30+35+20=85, 100−85=15 ✓ (본문·numericCase·review 일치)

### global-history/agriculture-settlement-and-neolithic-tradeoffs
- 추출한 고유 사실 주장 수: 5, 검증 5, 미검증 0
- 연 자료:
  - https://whc.unesco.org/en/list/1405 — 403 → Wayback 2026-01-07 200 — "The taller eastern mound contains eighteen levels of Neolithic occupation between 7400 bc and 6200 bc", "a unique streetless settlement of houses clustered back to back with roof access into the buildings" → 본문 103행(18개 층·BC 7400~6200·지붕 출입) OK. 발췌 문자열은 두 문장 접합(발견 #9)
  - https://ocw.mit.edu/…/MITSTS_007F10_lec06_notes.pdf — 200 — pdftotext 20행 "Agriculture is both: food production and shaping the world" ✓; 같은 노트 "Basic questions: how revolutionary was it? Certainly in results, but how sudden?" → 본문 107행("결과가 컸다는 사실과 갑작스러웠다는 주장은 다른 질문") OK
  - https://ocw.mit.edu/…/resources/mitsts_007f10_lec02/ (evidence) — 301 루프, 미도달 (발견 #6)
- 빠진 내용: 없음
- 계산: 15+65+20=100, 50+20=70, 70−15=55, 65−55=10 ✓

### global-history/cities-writing-rations-and-early-law
- 추출한 고유 사실 주장 수: 6, 검증 6, 미검증 0
- 연 자료:
  - https://www.metmuseum.org/art/collection/search/327069 — 웹 429 → Collection API 200 — 제목 "Cuneiform tablet: record of rations of beer, bread, oil, and onions for messengers", "ca. 2028 BCE", Ur III, Neo-Sumerian → 본문 172행·발췌·note 일치
  - https://www.metmuseum.org/art/collection/search/322609 (evidence) — API 200 — 라마수(발견 #1)
  - https://www.louvre.fr/en/the-code-of-hammurabi — 200 — "The text, engraved around 1750 BC, is not a 'legal code' in the modern sense of the term", "It contains 282 legal judgements handed down by Hammurabi" → 본문 176-177행·발췌 일치
  - https://collections.louvre.fr/en/ark:/53355/cl010174436 (evidence) — 200 — 발견 #10
- 빠진 내용: 없음
- 계산: 40+20+15+10+15=100, 20+15+10=45 ✓

### global-history/empires-roads-taxes-and-law
- 추출한 고유 사실 주장 수: 5, 검증 5, 미검증 0
- 연 자료:
  - https://www.britishmuseum.org/collection/object/A_1880-21 — 직접 403 → Wayback 2024-07-09 200 — "Museum number 1880.21 … Curved horizontal fragment of a burnished sandstone pillar engraved with part of Major Pillar Edict VI of the Mauryan king Aśoka. … Production date 3rdC BC (mid) … Materials sandstone … The pillar was originally erected at Meerut in the 3rd century BCE and removed to Delhi in the mid-fourteenth century by Fīrūz Shāh Tughluq" → 본문 34행·발췌 일치
  - UNESCO Maintenance of Empire PDF — 301 소실 → Wayback 2024-10-02 200 (발견 #4) — 발췌 "military and administrative highways" 일치; 페르시아 왕도·중국 도로·운하·로마 도로 비교 ✓
- 빠진 내용: 없음
- 계산: 30+25+20+15+10=100, 25+20+15=60 ✓

### global-history/trade-religion-and-translation-networks
- 추출한 고유 사실 주장 수: 5, 검증 5, 미검증 0
- 연 자료:
  - https://www.unesco.org/en/silk-roads/about-silk-roads?hub=196704 — 200 — "These trade routes did not follow a single itinerary: merchants had a wide range of routes at their disposal, crossing Eastern Europe, the Middle East, Central Asia and the Far East, as well as maritime routes linking China and Southeast Asia with Africa, India and the Near East via the Indian Ocean." "In the mid-nineteenth century, the German geologist Baron Ferdinand von Richthofen designated this network … as Die Seidenstrasse" → 본문 34행(여러 육상·해상로, 후대 명칭) 일치
  - https://www.loc.gov/resource/gdcwdl.wdl_14300/?st=gallery — 직접 403 → Wayback 2026-02-10 200 — "This manuscript from about 1350 is one of the oldest extant copies of Les voyages de Marco Polo … a mixture of a travel report, legend, hearsay, and practical information." LCCN 2021668052 → 본문 38행·발췌 일치
- 빠진 내용: 없음
- 계산: 100−20=80, 80−30=50 ✓

### global-history/conquest-disease-silver-and-oceanic-exchange
- 추출한 고유 사실 주장 수: 6, 검증 5, 미검증 1(si.edu 페이지 자체)
- 연 자료:
  - si.edu Potosí mita 서지 — 403/Wayback 404 (발견 #14); 책 존재·제목·"1573–1700"·"compulsory Indian labor in the Andes"는 Cambridge Annales 서평 URL·UNSAM/ECU 카탈로그로 확인
  - https://www.cambridge.org/core/…/1D2D564AD8560ABACAF9D81A65F27CED — 200 — Alfani & Murphy, JEH 77(1), 2017; "Finally, epidemics did not affect all American regions in the same way." "Other major epidemics are associated with the Columbian exchange" → 본문 38행·발췌 일치; Crossref로 서지 재확인 (발견 #11)
- 빠진 내용: citation 저자·연도 (발견 #11)
- 계산: 100−15−25=60, 40 ✓

### global-history/revolutions-citizenship-and-industrial-empires
- 추출한 고유 사실 주장 수: 5, 검증 5, 미검증 0
- 연 자료:
  - https://www.loc.gov/resource/gdcwdl.wdl_14430/ — 직접 403 → Wayback 2026-01-21 200 — "Adopted by the National Assembly during its Sessions on August 20, 21, 25 and 26, 1789, and Approved by the King", LCCN 2021668069 → citation의 item 번호 OK, 발췌는 불일치(발견 #5). 본문 34행 "사람이 자유롭고 권리에서 평등하게 태어난다 … 법을 일반 의지의 표현"은 선언 1조·6조 내용과 부합
  - https://history.state.gov/historicaldocuments/frus1885/d228 — 200 — Tisdel → Bayard, 1885-06-29, FRUS 1885: "both France and Portugal secured all that they wished for and much more than they had expected" → 본문 38행·발췌 일치
- 빠진 내용: 없음
- 계산: 30+40+30=100 ✓

### global-history/world-wars-depression-and-mass-states
- 추출한 고유 사실 주장 수: 6, 검증 6, 미검증 0
- 연 자료:
  - https://www.un.org/unispal/document/auto-insert-199451/ — 200(curl; WebFetch는 잘림) — Art. 10 "The Members of the League undertake to respect and preserve as against external aggression the territorial integrity and existing political independence of all Members of the League." Art. 11 "Any war or threat of war … is hereby declared a matter of concern to the whole League" Art. 22 "inhabited by peoples not yet able to stand by themselves under the strenuous conditions of the modern world … the well-being and development of such peoples form a sacred trust of civilisation" → 본문 34행·발췌 일치
  - https://www.archives.gov/education/lessons/depression-wwii.html — 200 — "The Great Depression and World War II (1929-1945)"; FDR 취임사·진주만·D-Day 등 → 본문 38행 OK(발췌 "1929–1945"는 페이지 표기 "1929-1945"와 대시만 다름)
- 빠진 내용: 없음
- 계산: 25+35+25+15=100 ✓

### global-history/cold-war-decolonization-and-globalization
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료:
  - 반둥 1955-E.pdf — 직접 202(빈 본문)/403 → Wayback 2025-03-29 200 — UN Yearbook on Human Rights 1955 (발견 #3); 29개국(5+24)·경제·문화 협력·인권과 자결·종속민 문제·세계 평화 항목 확인 → 본문 7·34행 OK
  - https://www.wto.org/English/docs_e/legal_e/marrakesh_decl_e.htm — WebFetch 402 → curl 200 — "Ministers declare that their signature of the Final Act … initiates the transition from the GATT to the WTO", "the negotiations were substantially concluded on 15 December 1993"; 발췌 불일치(발견 #2)
  - https://www.wto.org/english/docs_e/legal_e/04-wto_e.htm — 200 — "more viable and durable" 원출처
  - https://www.wto.org/english/thewto_e/whatis_e/tif_e/fact4_e.htm — 200 — "The WTO's creation on 1 January 1995" → 본문 11행 "1995년 출범한 WTO" OK
- 빠진 내용: 없음
- 계산: 30+25+20+15+10=100 ✓

### global-history/monasteries-schools-manuscripts-and-knowledge-transmission
- 추출한 고유 사실 주장 수: 6, 검증 6, 미검증 0
- 연 자료:
  - https://whc.unesco.org/en/list/1502/ — 403 → Wayback 2026-01-04 200 — "a monastic and scholastic institution dating from the 3rd century BCE to the 13th century CE. … It engaged in the organized transmission of knowledge over an uninterrupted period of 800 years." → 본문 241행·발췌 일치
  - https://whc.unesco.org/en/list/119/ — 403 → Wayback 2025-12-28 200 — "Home of the prestigious Koranic Sankore University and other madrasas … in the 15th and 16th centuries", "180 Koranic schools and 25,000 students", "an important market place where the trading of manuscripts was negotiated, and salt from Teghaza in the north, gold was sold, and cattle and grain from the south" → 본문 245행·발췌 일치
- 빠진 내용: 없음
- 계산: 45+20+15+15+5=100, 100−30=70, 70−45=25, 30−(15+5)=10 ✓

### global-history/pastoral-mobility-steppe-empires-and-settled-frontiers
- 추출한 고유 사실 주장 수: 6, 검증 6, 미검증 0
- 연 자료:
  - https://whc.unesco.org/en/list/1081 — 403 → Wayback 2026-01-01 200 — "the symbiotic links between nomadic, pastoral societies and their administrative and religious centres", "Turkish memorial sites of the 6th-7th centuries, the 8th-9th centuries' Uighur capital of Khar Balgas as well as the 13th-14th centuries' ancient Mongol imperial capital of Kharakhorum", "the Erdene Zuu monastery" → 본문 310행·발췌 일치
  - https://whc.unesco.org/en/list/1382 — 403 → Wayback 2025-12-24 200 — "development of culture in Mongolia over a period of 12,000 years … Later images show the transition to herding … The most recent images show the transition to a horse-dependent nomadic lifestyle during the early 1st millennium BC" → 본문 314행("기원전 1000년 무렵")·발췌·note(1만2천 년) 일치
- 빠진 내용: 없음
- 계산: 100−15=85, 85+25=110, 110−20=90 ✓

### global-history/open-web-platform-curation-and-digital-divides
- 추출한 고유 사실 주장 수: 6, 검증 5, 미검증 1(UNESCO 발췌 정확 문자열)
- 연 자료:
  - https://home.cern/science/computing/the-birth-of-the-web/where-web-was-born/ — 200 — "Tim Berners-Lee, a British scientist at CERN, invented the World Wide Web (WWW) in 1989", "On 30 April 1993, CERN put the World Wide Web software in the public domain." → 본문 379행·발췌 일치
  - https://unesdoc.unesco.org/ark:/48223/pf0000387339 — 403/JS 셸 → 대체 https://www.unesco.org/en/internet-trust/guidelines 200 (발견 #13)
  - https://www.itu.int/en/ITU-D/Statistics/Pages/facts/default.aspx — 200 — "Measuring digital development: Facts and Figures 2025 … almost three-quarters of the world's population are now online … 2.2 billion people remain offline – most of them in low and middle income countries. Gender and urban-rural divides continue to narrow but endure"; 보도자료 https://www.itu.int/en/mediacentre/Pages/PR-2025-11-17-facts-and-figures.aspx 200 — "an estimated 6 billion people – about three-quarters of the world's population – are using the Internet in 2025", "77 per cent of men are online compared to 71 per cent of women", "85 per cent in urban areas are online versus 58 per cent in rural areas" → 본문 387행(약 60억·22억·소득·성별·도농) 일치
- 빠진 내용: 없음
- 계산: 100→20→5, 40 vs 20 ✓

### testimony/speeches-were-reconstructed
- 추출한 고유 사실 주장 수: 5, 검증 5, 미검증 0
- 연 자료: https://www.gutenberg.org/cache/epub/7142/pg7142.txt — 200 — 1권 22절: "With reference to the speeches in this history, some were delivered before the war began, others while it was going on; some I heard myself, others I got from various quarters; it was in all cases difficult to carry them word for word in one's memory, so my habit has been to make the speakers say what was in my opinion demanded of them by the various occasions, of course adhering as closely as possible to the general sense of what they really said. And with reference to the narrative of events, far from permitting myself to derive it from the first source that came to hand, I did not even trust my own impressions, but it rests partly on what I saw myself, partly on what others saw for me, the accuracy of the report being always tried by the most severe and detailed tests possible. My conclusions have cost me some labour from the want of coincidence between accounts of the same occurrences by different eye-witnesses, arising sometimes from imperfect memory, sometimes from undue partiality for one side or the other." → 157-173행 CitationBlock 발췌 문자 그대로 일치; 부품 3·4의 요약(첫 출처 거부·자기 인상 불신·두 출처 시험·기억/편파 두 원인)도 일치
- 빠진 내용: 없음. "흩어짐/쏠림" 그림이 글의 추가라는 점은 learning.boundary에 명시됨
- OK: "2,400년 전" (기원전 5세기 말 저술) ✓

### testimony/told-but-not-believed
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: https://www.gutenberg.org/cache/epub/2456/pg2456.txt — 200 (eBook 2456 = Macaulay 영역 2권, 5~9권 수록 — 7권 포함 ✓) — 7.148 "they had sent messengers to inquire of the god at Delphi … 'Keep thou thy spear within bounds, and sit well-guarded behind it' … on condition that they got peace made with the Lacedemonians for thirty years and that they had half the leadership"; 7.149 "they had two kings, while the Argives had one … gave notice to the envoys to depart out of the territory of the Argives before sunset"; 7.150 "Xerxes sent a herald to Argos … Perses, from whom we are descended, was the son of Perseus … they asked for this merely in order that they might have a pretext for remaining still"; 7.152 "I am not able to say for certain; nor do I declare any opinion about the matters in question other than that which the Argives themselves report … Thus it is not the Argives who have acted most basely of all. I however am bound to report that which is reported, though I am not bound altogether to believe it; and let this saying be considered to hold good as regards every narrative in the history: for I must add that this also is reported, namely that the Argives were actually those who invited the Persian to invade Hellas, because their war with the Lacedemonians had had an evil issue, being willing to suffer anything whatever rather than the trouble which was then upon them." → 203-216행 발췌와 부품 1~4 요약 전부 일치
- 빠진 내용: 없음(7.148의 "6천 명이 클레오메네스에게 살해된 직후"라는 신탁 문의 동기는 생략됐지만 글의 논지에 필요한 부품은 아님)

### testimony/the-writer-was-there
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: https://www.gutenberg.org/cache/epub/2850/pg2850.txt — 200 — 서문 1 "while those that were there present have given false accounts of things, and this either out of a humor of flattery to the Romans, or of hatred towards the Jews; and while their writings contain sometimes accusations, and sometimes encomiums, but no where the accurate truth of the facts … Joseph, the son of Matthias, by birth a Hebrew, a priest also, and one who at first fought against the Romans myself, and was forced to be present at what was done afterwards, [am the author of this work]."; 서문 4 "it was a seditious temper of our own that destroyed it, and that they were the tyrants among the Jews who brought the Roman power upon us, who unwillingly attacked us, and occasioned the burning of our holy temple, Titus Caesar, who destroyed it, is himself a witness, who, during the entire war, pitied the people who were kept under by the seditious, and did often voluntarily delay the taking of the city … let him attribute the facts themselves to the historical part, and the lamentations to the writer himself only."; 서문 8 "as I saw the things done, or suffered in them. For I shall not conceal any of the calamities I myself endured, since I shall relate them to such as know the truth of them."; 서문 12 "I have comprehended all these things in seven books, and have left no occasion for complaint or accusation to such as have been acquainted with this war" → 165-180행 발췌와 부품 1~5 요약 전부 일치(대괄호 보충도 전사본 그대로)
- 빠진 내용: 없음

### record-numbers/how-the-army-was-counted
- 추출한 고유 사실 주장 수: 6, 검증 6, 미검증 0
- 연 자료: pg2456.txt — 7.60 "Now of the number which each separate nation supplied I am not able to give certain information, for this is not reported by any persons; but of the whole land-army taken together the number proved to be one hundred and seventy myriads: 53 and they numbered them throughout in the following manner:--they gathered together in one place a body of ten thousand men, and packing them together as closely as they could, they drew a circle round outside: and thus having drawn a circle round and having let the ten thousand men go from it, they built a wall of rough stones round the circumference of the circle, rising to the height of a man's navel. Having made this, they caused others to go into the space which had been built round, until they had in this manner numbered them all throughout: and after they had numbered them, they ordered them separately by nations." 역자 주 53 "[ i.e. 1,700,000.]" → 175-191행 발췌·AlgorithmBlock 5단계(세고 난 뒤 민족별 편성 포함)·"영역자가 1,700,000으로 풀어 둠" 전부 일치
- 계산: 100명×170회=17,000 ✓
- 빠진 내용: 없음

### record-numbers/what-the-total-cannot-tell
- 추출한 고유 사실 주장 수: 14, 검증 14, 미검증 0
- 연 자료: pg2456.txt — 7.184 "one thousand two hundred and seven … if one reckons at the rate of two hundred men to each ship … thirty men who were Persians, Medes, or Sacans … assuming that there were eighty men, more or less, in each one … three thousand … a hundred and seventy myriads, and of the horsemen eight myriads … Arabian camel-drivers and the Libyan drivers of chariots, assuming them to amount to twenty thousand men"; 7.185 "of this we must give a probable estimate … a hundred and twenty ships; from which ships there results a sum of twenty-four thousand men … I estimate that there were thirty myriads"; 7.186 "I assume them to be equal in number with these, and neither at all more nor less; and so, being supposed equal in number with the fighting body, they make up the same number of myriads as they. Thus five hundred and twenty-eight myriads three thousand two hundred and twenty"; 7.187 "of the women who made bread for it, and of the concubines and eunuchs no man can state any exact number, nor again of the draught-animals … or of the Indian hounds … if each man received a quart of wheat every day and nothing more, there would be expended every day eleven myriads of medimnoi and three hundred and forty medimnoi besides". 역자 주 173 "[ i.e. 241,400.]", 175 "[ 36,210.]", 177 "[ 240,000.]", 178 "[ 517,610.]", 184 "[ 300,000.]", 185 "[ 2,641,610.]", 188 "[ 5,283,220.]", 189 "[ {khoinika}, the usual daily allowance.]", 190 "[ The {medimnos} is about a bushel and a half, and is equal to 48 {khoinikes}. The reckoning here of 110,340 {medimnoi} is wrong, owing apparently to the setting down of some numbers in the quotient which were in fact part of the dividend.]" → 99-114행 발췌·부품 1~4 전부 일치
- 계산(재검산): 1,207×200=241,400 ✓; 1,207×30=36,210 ✓; 3,000×80=240,000 ✓; 합 517,610 ✓; +1,700,000+80,000+20,000=2,317,610 ✓; +24,000+300,000=2,641,610 ✓; ×2=5,283,220 ✓; 끝 네 자리 1400+6210+4000=11,610 → ×2=23,220 → 3220 ✓; 5,283,220÷48=110,067 나머지 4 ✓(110,067×48=5,283,216)
- 빠진 내용: 발견 #12(1,207·8만의 등장 위치 7.89·7.87)

### record-numbers/numbers-that-command
- 추출한 고유 사실 주장 수: 20, 검증 20, 미검증 0
- 연 자료: https://www.gutenberg.org/cache/epub/17150/pg17150.txt — 200 — §196 "If a man has caused the loss of a gentleman's eye, his eye one shall cause to be lost." §198 "…he shall pay one mina of silver." §199 "…he shall pay half his price." §200 "If a man has made the tooth of a man that is his equal to fall out, one shall make his tooth fall out." §201 "one-third of a mina" §202 "struck in the assembly with sixty strokes of a cow-hide whip" §209 "ten shekels" §210 "one shall put to death his daughter" §211 "five shekels" §212 "half a mina" §213 "two shekels" §214 "one-third of a mina" §215 "severe wound with a bronze lancet … abscess of the eye … ten shekels" §216 "five shekels" §217 "the master of the servant shall give two shekels" §220 "half his price" §221 "shattered limb … diseased bowel … five shekels" §222 "three shekels" §223 "two shekels" §224 "cow doctor or a sheep doctor … one-sixth of a shekel" §225 "a quarter of its price" §268 "ox, for threshing, twenty KA" §269 "ass … ten KA" §271 "oxen, a wagon, and its driver … one hundred and eighty KA" §272 "wagon by itself … forty KA" §273 "from the beginning of the year till the fifth month … six SE … from the sixth month to the end of the year … five SE"; 색인 "(N.B.--Fines reckoned in silver, 60 shekels to the mina.)" → 108-123행 발췌·본문 모든 금액·비율·횟수 일치
- 빠진 내용: 발견 #8(boundary 과일반화)
- OK: "3,700년쯤 전"(루브르 "around 1750 BC" 기준 약 3,776년) ✓

### inference-from-sources/ruins-mislead
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: pg7142.txt — 1권 10절 "For I suppose if Lacedaemon were to become desolate, and the temples and the foundations of the public buildings were left, that as time went on there would be a strong disposition with posterity to refuse to accept her fame as a true exponent of her power. And yet they occupy two-fifths of Peloponnese and lead the whole, not to speak of their numerous allies without. Still, as the city is neither built in a compact form nor adorned with magnificent temples and public edifices, but composed of villages after the old fashion of Hellas … Whereas, if Athens were to suffer the same misfortune, I suppose that any inference from the appearance presented to the eye would make her power to have been twice as great as it is. We have therefore no right to be sceptical, nor to content ourselves with an inspection of a town to the exclusion of a consideration of its power … He has represented it as consisting of twelve hundred vessels; the Boeotian complement of each ship being a hundred and twenty men, that of the ships of Philoctetes fifty. By this, I conceive, he meant to convey the maximum and the minimum complement: at any rate, he does not specify the amount of any others in his catalogue of the ships … So that if we strike the average of the largest and smallest ships, the number of those who sailed will appear inconsiderable"; 앞 문장 "Now Mycenæ may have been a small place … no exact observer would therefore feel justified in rejecting the estimate given by the poets and by tradition of the magnitude of the armament"; "if we can here also accept the testimony of Homer's poems, in which, without allowing for the exaggeration which a poet would feel himself licensed to employ" → 172-189행 발췌·부품 1~4·ProgressiveDetail의 세 조건 전부 일치
- 계산: (120+50)/2=85, 85×1,200=102,000 (learning 명시) ✓
- 빠진 내용: 없음

### inference-from-sources/the-gap-was-made
- 추출한 고유 사실 주장 수: 11, 검증 11, 미검증 0
- 연 자료: pg17150.txt — 65조 뒤 "NOTE.--Here five columns of the monument have been erased, only the commencing characters of column xvii. being visible. The subjects of this last part included the further enactments concerning the rights and duties of gardeners, the whole of the regulations concerning houses let to tenants, and the relationships of the merchant to his agents, which continue on the obverse of the monument. [See page 58.] Scheil estimates the lost portion at 35 sections, and following him we recommence with section 100."; 머리말 "a block of black diorite, nearly eight feet high, found in pieces, but readily rejoined … sixteen columns of writing with 1114 lines. There were five more columns on this side, but they have been erased and the stone repolished, doubtless by the Elamite conqueror, who meant to inscribe his name and titles there. As we have lost those five columns we may regret that he did not actually do this, but there is now no trace of any hint as to who carried off the stone." "A great space, some 700 lines, is devoted by the king to setting out his titles … A translation of this portion is not given, as it is unintelligible without copious comment and is quite foreign to the purpose of this book"; 본문 끝 "The following three sections, which are known to belong to the Code from copies made for an Assyrian king in the seventh century B.C., are given here for the sake of completeness. They obviously come within the space once occupied by the five erased columns." → 155-173행 발췌·부품 1~4 전부 일치. https://www.louvre.fr/en/the-code-of-hammurabi 200 — "It had been brought there as a spoil of war by the Elamite king Shutruk-Nahhunte" → 95-99행 일치
- 계산: 66~99 = 34개, 100−65 = 35 ✓
- 빠진 내용: 없음

### inference-from-sources/naming-the-past
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- 연 자료: pg17150.txt — 표제 "The Oldest Code of Laws in the World"; 본문 끝 "The judgements of righteousness which Hammurabi the mighty king confirmed and caused the land to take a sure guidance and a gracious rule."; 머리말 "two thousand years and more later it was made a text-book for study in the schools of Babylonia, being divided for that purpose into some twelve chapters, and entitled, after the Semitic custom, _Ninu ilu sirum_, from its opening words. In Assyria also, in the seventh century B.C., it was studied in a different edition, apparently under the name of 'The Judgments of Righteousness which Hammurabi, the great king, set up.'"; 마지막 조항 "section 282." → 99-116행 발췌·네 이름·1~282조 일치. 루브르 200 — "282 legal judgements", "around 1750 BC", "not a 'legal code' in the modern sense" → 122-125·153-155행 일치
- 빠진 내용: 발견 #7("기원전 3천년" 표기)

## 열지 못한 자료
| URL | 상태 | 대체 확인 |
|---|---|---|
| https://whc.unesco.org/en/list/167/ , /1405 , /1502/ , /119/ , /1081 , /1382 | 403 (UA 바꿔도 동일) | web.archive.org 2025-12~2026-01 사본 6건 모두 200, 발췌 전부 확인 |
| https://www.britishmuseum.org/collection/object/A_1880-21 | 403 | Wayback 2024-07-09 200, "part of Major Pillar Edict VI" 확인 |
| https://www.loc.gov/resource/gdcwdl.wdl_14300/?st=gallery , https://www.loc.gov/resource/gdcwdl.wdl_14430/ | 403 | Wayback 2026-02-10 / 2026-01-21 200 |
| https://www.metmuseum.org/art/collection/search/327069 , /322609 | 429 | Met Collection API 200 (327069 = 배급 점토판, 322609 = 라마수) |
| https://en.unesco.org/silkroad/…/the%20maintenance%20of%20empire.pdf | 301 → unesco.org/en/silkroads (문서 소실) | Wayback 2024-10-02 PDF 200 |
| https://unesdoc.unesco.org/ark:/48223/pf0000387339 (및 /PDF/387339eng.pdf.multi) | 403 | Wayback 사본은 JS 셸; https://www.unesco.org/en/internet-trust/guidelines 200으로 제목·연도·취지 확인. 발췌 정확 문자열은 미확인 |
| https://digitallibrary.un.org/record/860963/files/1955-E.pdf | 202(빈 본문)/403 | Wayback 2025-03-29 200 — UN Yearbook on Human Rights 1955 (공동성명은 발췌 수록) |
| https://www.si.edu/object/potosi-mita-1573-1700-…%3Asiris_sil_707155 (및 siris_sil_707155, siris-libraries) | 403 | Wayback 없음(404). 책 서지는 Cambridge Annales 서평·UNSAM·ECU 카탈로그로 확인 |
| https://ocw.mit.edu/…/resources/mitsts_007f10_lec02/ | 301 루프(…/index.html로 재귀) | 강의노트 목록 페이지 200; 본문 sources의 lec06_notes PDF 200으로 대체 |
| https://www.wto.org/English/docs_e/legal_e/marrakesh_decl_e.htm (WebFetch) | 402 | curl 200으로 전문 확인 |
| https://www.un.org/unispal/document/auto-insert-199451/ (WebFetch) | 본문 잘림 | curl 200 (1.6MB)에서 10·11·22조 확인 |
