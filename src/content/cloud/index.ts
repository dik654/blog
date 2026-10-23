import type { Category } from "../types";
import { cloudArticles } from "./articles";

const cloud: Category = {
  slug: "cloud",
  name: "Cloud / Certification",
  description:
    "AWS·Azure 공통 원리부터 현행 자격증 범위, 실습과 면접 설명까지 한 요청의 경로로 공부합니다.",
  subcategories: [
    {
      slug: "cloud-roadmap",
      name: "취업·이직 로드맵",
      description: "목표 직무에서 시험·실습·공부 순서를 거꾸로 고릅니다.",
      icon: "🧭",
    },
    {
      slug: "cloud-foundations",
      name: "공통 필수 개념",
      description: "책임·권한·망·실행·저장·복구를 AWS와 Azure에 함께 적용합니다.",
      icon: "☁️",
    },
    {
      slug: "cloud-linux",
      name: "Linux 서버 운영",
      description: "시스템 콜·cgroup·VFS·네트워크·관측·SRE 기초 여섯 편을 쌓은 뒤, 대기업 SRE·인프라 면접이 묻는 장애 한 건씩을 명령과 커널 코드로 확인합니다.",
      icon: "🐧",
    },
    {
      slug: "cloud-kubernetes",
      name: "Kubernetes 운영",
      description: "Pod 하나가 API에 저장되어 사용자 요청을 받는 전체 경로를 먼저 보고, 배치·자원·상태·스토리지·패킷·변경·운영을 v1.37.1 원문으로 확대합니다.",
      icon: "☸️",
    },
    {
      slug: "cloud-aws",
      name: "AWS Certification",
      description: "CLF-C02·SAA-C03·DVA-C02·SOA-C03의 공식 범위와 선택 기준입니다.",
      icon: "🟧",
    },
    {
      slug: "cloud-azure",
      name: "Azure Certification",
      description: "AZ-900·AZ-104·AI-200·AZ-305·AZ-400의 현행 범위와 실습 경로입니다.",
      icon: "🟦",
    },
  ],
  articles: cloudArticles,
};

export default cloud;
