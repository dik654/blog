import type {FileNode} from "@/components/code/types";
export const fileTrees:Record<string,FileNode>={
  "medusa": {
    "name": "medusa",
    "type": "dir",
    "children": [
      {
        "name": "utils.py",
        "path": "medusa/medusa/model/utils.py",
        "type": "file",
        "codeKey": "buffers"
      },
      {
        "name": "modeling_llama_kv.py",
        "path": "medusa/medusa/model/modeling_llama_kv.py",
        "type": "file",
        "codeKey": "mask-apply"
      }
    ]
  },
  "layerskip": {
    "name": "layerskip",
    "type": "dir",
    "children": [
      {
        "name": "self_speculation_generator.py",
        "path": "layerskip/self_speculation/self_speculation_generator.py",
        "type": "file",
        "codeKey": "self-loop"
      },
      {
        "name": "llama_model_utils.py",
        "path": "layerskip/self_speculation/llama_model_utils.py",
        "type": "file",
        "codeKey": "self-cache"
      }
    ]
  },
  "arctic": {
    "name": "arctic",
    "type": "dir",
    "children": [
      {
        "name": "cache.py",
        "path": "arctic/arctic_inference/suffix_decoding/cache.py",
        "type": "file",
        "codeKey": "suffix-wrapper"
      },
      {
        "name": "suffix_tree.cc",
        "path": "arctic/csrc/suffix_decoding/suffix_tree.cc",
        "type": "file",
        "codeKey": "suffix-lengths"
      }
    ]
  }
};
