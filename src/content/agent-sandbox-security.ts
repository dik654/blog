export const AGENT_SECURITY_SOURCES = {
  linuxNamespaces: {
    label: "Linux namespaces manual",
    href: "https://man7.org/linux/man-pages/man7/namespaces.7.html",
  },
  linuxCgroupV2: {
    label: "Linux kernel — Control Group v2",
    href: "https://docs.kernel.org/admin-guide/cgroup-v2.html",
  },
  linuxCapabilities: {
    label: "Linux capabilities manual",
    href: "https://man7.org/linux/man-pages/man7/capabilities.7.html",
  },
  gvisorSecurity: {
    label: "gVisor Security Model",
    href: "https://gvisor.dev/docs/architecture_guide/security/",
  },
  gvisorGpu: {
    label: "gVisor GPU Support",
    href: "https://gvisor.dev/docs/user_guide/gpu/",
  },
  kataVirtualization: {
    label: "Kata Containers virtualization design",
    href: "https://github.com/kata-containers/kata-containers/blob/main/docs/design/virtualization.md",
  },
  kataGpu: {
    label: "Kata NVIDIA GPU passthrough",
    href: "https://github.com/kata-containers/kata-containers/blob/main/docs/use-cases/NVIDIA-GPU-passthrough-and-Kata-QEMU.md",
  },
  networkPolicy: {
    label: "Kubernetes NetworkPolicy",
    href: "https://kubernetes.io/docs/concepts/services-networking/network-policies/",
  },
  serviceAccounts: {
    label: "Kubernetes ServiceAccounts",
    href: "https://kubernetes.io/docs/concepts/security/service-accounts/",
  },
  podSecurity: {
    label: "Kubernetes Pod Security Standards",
    href: "https://kubernetes.io/docs/concepts/security/pod-security-standards/",
  },
  seccomp: {
    label: "Kubernetes seccomp tutorial",
    href: "https://kubernetes.io/docs/tutorials/security/seccomp/",
  },
  ciliumDns: {
    label: "Cilium DNS and FQDN policies",
    href: "https://docs.cilium.io/en/stable/security/dns/",
  },
} as const;
