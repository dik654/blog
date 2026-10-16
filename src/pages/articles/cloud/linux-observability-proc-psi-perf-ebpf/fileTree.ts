import type { FileNode } from "@/components/code/types";

export const linuxObservabilityTrees: Record<string, FileNode> = {
  linux: {
    name: "linux",
    type: "dir",
    children: [
      { name: "fs/proc/stat.c", path: "linux/fs/proc/stat.c", type: "file", codeKey: "proc-stat-source" },
      { name: "kernel/sched/psi.c", path: "linux/kernel/sched/psi.c", type: "file", codeKey: "psi-formula" },
      { name: "Documentation/filesystems/proc.rst", path: "linux/Documentation/filesystems/proc.rst", type: "file", codeKey: "proc-stat-doc" },
      { name: "Documentation/accounting/psi.rst", path: "linux/Documentation/accounting/psi.rst", type: "file", codeKey: "psi-doc" },
      { name: "Documentation/scheduler/sched-stats.rst", path: "linux/Documentation/scheduler/sched-stats.rst", type: "file", codeKey: "pid-schedstat" },
      { name: "tools/perf/Documentation/perf-top.txt", path: "linux/tools/perf/Documentation/perf-top.txt", type: "file", codeKey: "perf-top-doc" },
      { name: "tools/perf/Documentation/perf-record.txt", path: "linux/tools/perf/Documentation/perf-record.txt", type: "file", codeKey: "perf-record-doc" },
    ],
  },
  bpftrace: {
    name: "bpftrace",
    type: "dir",
    children: [{ name: "man/adoc/bpftrace.adoc", path: "bpftrace/man/adoc/bpftrace.adoc", type: "file", codeKey: "bpftrace-open" }],
  },
  node_exporter: {
    name: "node_exporter",
    type: "dir",
    children: [
      { name: "README.md", path: "node_exporter/README.md", type: "file", codeKey: "node-exporter-collectors" },
      { name: "collector/cpu_linux.go", path: "node_exporter/collector/cpu_linux.go", type: "file", codeKey: "node-exporter-cpu" },
      { name: "collector/pressure_linux.go", path: "node_exporter/collector/pressure_linux.go", type: "file", codeKey: "node-exporter-pressure" },
    ],
  },
};
