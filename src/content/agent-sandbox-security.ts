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
    label: "Kubernetes v1.37 NetworkPolicy",
    href: "https://github.com/kubernetes/website/blob/snapshot-initial-v1.37/content/en/docs/concepts/services-networking/network-policies.md",
  },
  serviceAccounts: {
    label: "Kubernetes v1.37 ServiceAccounts",
    href: "https://github.com/kubernetes/website/blob/snapshot-initial-v1.37/content/en/docs/concepts/security/service-accounts.md",
  },
  rbac: {
    label: "Kubernetes v1.37 RBAC Authorization",
    href: "https://github.com/kubernetes/website/blob/snapshot-initial-v1.37/content/en/docs/reference/access-authn-authz/rbac.md",
  },
  emptyDir: {
    label: "Kubernetes v1.37 Volumes / emptyDir",
    href: "https://github.com/kubernetes/website/blob/snapshot-initial-v1.37/content/en/docs/concepts/storage/volumes.md",
  },
  securityContext: {
    label: "Kubernetes v1.37 Security Context",
    href: "https://github.com/kubernetes/website/blob/snapshot-initial-v1.37/content/en/docs/tasks/configure-pod-container/security-context.md",
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
    label: "Cilium v1.20.4 DNS and FQDN policies",
    href: "https://github.com/cilium/cilium/blob/v1.20.4/Documentation/security/dns.rst",
  },
} as const;
