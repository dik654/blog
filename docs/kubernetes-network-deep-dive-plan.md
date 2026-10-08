# Kubernetes 네트워크 심화 보강 계획

## 카드

- 독자: Kubernetes를 사용해 보았지만 `veth`, CNI, Calico, Service 변환, Gateway, eBPF가 한 패킷 안에서 어떻게 이어지는지는 아직 설명하기 어려운 인프라 엔지니어
- 문서 유형: 설명형 튜토리얼 + 장애 분석 실습
- 약속: 글을 읽고 나면 `10.244.1.12`의 Pod가 `10.96.20.15:8080` Service를 거쳐 다른 노드의 `10.244.2.34:8080` Pod에 도착하는 패킷을 주소·인터페이스·캡슐화·정책·증거 명령과 함께 설명할 수 있다.
- 다루지 않는 범위: 특정 배포판의 모든 chain 이름, 모든 CNI 설치 옵션, Istio·Database Operator의 전체 운용법. 이 셋은 경계를 분명히 한 뒤 후속 정본으로 분리한다.

## 소스 재배치

`hackjsp.tistory.com/category/Kubernetes`의 33편은 다음 네 갈래로 검토한다.

1. Network 10편: Linux namespace·veth·bridge, pause container·Flannel, Calico, Service·NodePort, MetalLB, IPVS, Ingress·Gateway API, Istio 입문, eBPF·Cilium, AWS VPC CNI
2. Security 2편: CoreDNS 조회와 API Server 인증서 SAN
3. Database Operator 8편: StatefulSet, Operator pattern, MySQL·PostgreSQL·MongoDB·Kafka·Stackable, 학습 회고
4. Istio 13편: 설치·Envoy·Gateway·traffic control·resilience·observability·security·troubleshooting·tuning·multi-cluster·EnvoyFilter·VM·ambient

이번 정본은 1번을 한 패킷 경로로 통합하고, 나머지 세 갈래가 패킷 경로의 어느 경계에서 시작하는지 보여 준다. 실습 아이디어는 해당 글에서 찾되, 현재 동작과 권장 사항은 Kubernetes·Calico·Cilium·Gateway API 공식 문서로 다시 확인한다.

## 계층형 개요

1. `overview`: 404가 애플리케이션 문제인지 네트워크 문제인지 한 문장으로 답한다.
2. `case`: 가정한 두 노드와 세 IP, MTU 1500에서 한 요청을 고정한다.
3. `map`: Pod socket에서 server socket까지 여섯 경계만 먼저 본다.
4. `pod-boundary`: network namespace, pause container, veth가 왜 필요한지 만든 순서로 본다.
5. `service-path`: Service VIP가 주소가 붙은 server가 아니라 변환 규칙이라는 사실을 한 연결로 확인한다.
6. `calico-path`: 같은 노드, direct route, IP-in-IP, VXLAN 경로를 비교하고 Felix·BGP의 책임을 나눈다.
7. `mtu-egress`: 1500에서 1450·1480이 되는 계산과 조건부 SNAT를 재현한다.
8. `policy-dataplane`: NetworkPolicy의 선언과 iptables·nftables·eBPF 집행 위치를 분리한다.
9. `edge-mesh`: NodePort·LoadBalancer·Ingress·Gateway API·service mesh의 책임 경계를 한 요청에 덧붙인다.
10. `evidence`: route, link, capture, Service, conntrack, Calico 상태를 정상/실패 증거로 읽는다.
11. `source-map`: 33편을 어떤 후속 정본과 실습으로 이어 갈지 지도화하고 2024년 글의 현재 변경점을 표시한다.
12. `limits`: 환경별 차이와 검증하지 않은 값을 밝히고 예측 질문으로 닫는다.

연결 문장: Pod가 별도 주소 공간을 가져야 하므로 namespace와 veth가 필요하다. 그 때문에 Service가 고른 실제 Pod IP까지 가는 라우팅이 필요하다. 그 때문에 다른 노드에서는 direct route나 캡슐화 방식을 골라야 한다. 그 때문에 MTU와 egress NAT, 정책 집행 위치가 달라진다. 그 때문에 edge와 service mesh는 CNI를 대체하지 않고 새 경계를 더한다.

