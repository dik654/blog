#define main upstream_word2vec_main
#include "observed-word2vec.c"
#undef main
int main(int argc, char **argv) {
  if(argc!=2)return 2;
  if(sizeof(unsigned long long)!=8)return 3;
  strcpy(train_file,argv[1]);
  layer1_size=3;window=2;sample=0;hs=0;negative=0;cbow=0;iter=1;num_threads=1;debug_mode=0;
  vocab=(struct vocab_word*)calloc(vocab_max_size,sizeof(struct vocab_word));
  vocab_hash=(int*)malloc(vocab_hash_size*sizeof(int));
  if(!vocab||!vocab_hash)return 4;
  for(int k=0;k<vocab_hash_size;k++)vocab_hash[k]=-1;
  char *words[]={"</s>","red","cat","saw","dog"};
  for(int k=0;k<5;k++){int n=AddWordToVocab(words[k]);vocab[n].cn=(k==3?2:1);}
  train_words=6;syn0=(real*)calloc(15,sizeof(real));
  real fixed[]={0,0,0,1,0,0,1,2,0,0,1,1,0,0,1};memcpy(syn0,fixed,sizeof(fixed));
  FILE *f=fopen(train_file,"rb");fseek(f,0,SEEK_END);file_size=ftell(f);rewind(f);
  char wordbuf[MAX_STRING],eof=0;
  while(1){ReadWord(wordbuf,f,&eof);if(eof)break;printf("READ %s\n",wordbuf);}fclose(f);
  pthread_t th;if(pthread_create(&th,NULL,TrainModelThread,(void*)0))return 5;
  pthread_join(th,NULL);
  if(memcmp(syn0,fixed,sizeof(fixed)))return 6;
  printf("ROW2 %.0f %.0f %.0f unchanged=yes\n",syn0[6],syn0[7],syn0[8]);
  free(syn0);free(vocab_hash);for(int k=0;k<5;k++)free(vocab[k].word);free(vocab);
  return 0;
}
