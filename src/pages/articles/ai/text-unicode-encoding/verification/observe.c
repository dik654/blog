#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "utf8proc.h"

static void hex(const utf8proc_uint8_t *s, size_t n) {
  for (size_t i=0;i<n;i++) printf("%s%02X",i?" ":"",s[i]);
}
static void inspect(const char *label, const utf8proc_uint8_t *s, size_t n) {
  size_t pos=0; int count=0, units16=0, clusters=0;
  utf8proc_int32_t prev=0,state=0,cp=0;
  printf("%s bytes=%zu hex=",label,n);hex(s,n);puts("");
  while(pos<n) {
    utf8proc_ssize_t step=utf8proc_iterate(s+pos,(utf8proc_ssize_t)(n-pos),&cp);
    if(step<1){printf("  error=%td at=%zu\n",step,pos);return;}
    int boundary=count==0 || utf8proc_grapheme_break_stateful(prev,cp,&state);
    printf("  cp=%04X index=%d byte=[%zu,%zu) utf16=[%d,%d) break=%d\n",
           cp,count,pos,pos+(size_t)step,units16,units16+(cp>0xffff?2:1),boundary);
    clusters+=boundary;units16+=cp>0xffff?2:1;count++;prev=cp;pos+=(size_t)step;
  }
  printf("  totals cp=%d utf16=%d grapheme=%d\n",count,units16,clusters);
}
static void transform(const char *label,const utf8proc_uint8_t *s,size_t n,utf8proc_option_t flags){
  utf8proc_uint8_t *out=NULL;
  utf8proc_ssize_t size=utf8proc_map(s,(utf8proc_ssize_t)n,&out,flags);
  if(size<0){printf("%s error=%td\n",label,size);return;}
  inspect(label,out,(size_t)size);free(out);
}
int main(void){
  const utf8proc_uint8_t raw[]={0x41,0x65,0xcc,0x81,0xea,0xb0,0x80,0xf0,0x9f,0x98,0x80};
  const utf8proc_uint8_t family[]={0xf0,0x9f,0x91,0xa8,0xe2,0x80,0x8d,0xf0,0x9f,0x91,0xa9,0xe2,0x80,0x8d,0xf0,0x9f,0x91,0xa7,0xe2,0x80,0x8d,0xf0,0x9f,0x91,0xa6};
  const utf8proc_uint8_t circled[]={0xe2,0x91,0xa0};
  const utf8proc_uint8_t invalid[][4]={{0xc0,0x80,0,0},{0xed,0xa0,0x80,0},{0xf4,0x90,0x80,0x80}};
  const size_t sizes[]={2,3,4};
  printf("utf8proc=%s unicode=%s\n",utf8proc_version(),utf8proc_unicode_version());
  inspect("raw",raw,sizeof raw);
  transform("NFC",raw,sizeof raw,UTF8PROC_STABLE|UTF8PROC_COMPOSE);
  transform("NFD",raw,sizeof raw,UTF8PROC_STABLE|UTF8PROC_DECOMPOSE);
  inspect("family",family,sizeof family);
  transform("NFC-circle",circled,sizeof circled,UTF8PROC_STABLE|UTF8PROC_COMPOSE);
  transform("NFKC-circle",circled,sizeof circled,UTF8PROC_STABLE|UTF8PROC_COMPOSE|UTF8PROC_COMPAT);
  for(size_t i=0;i<3;i++){
    utf8proc_int32_t cp=0;utf8proc_ssize_t n=utf8proc_iterate(invalid[i],sizes[i],&cp);
    printf("invalid%zu result=%td cp=%d hex=",i,n,cp);hex(invalid[i],sizes[i]);puts("");
  }
  utf8proc_uint8_t out[4];utf8proc_int32_t cp=0;
  utf8proc_ssize_t n=utf8proc_encode_char(0xd800,out);
  printf("surrogate valid=%d encoder-size=%td hex=",utf8proc_codepoint_valid(0xd800),n);hex(out,(size_t)n);
  printf(" decoder=%td\n",utf8proc_iterate(out,n,&cp));
  const utf8proc_uint8_t nulltext[]={0x41,0,0x42};
  transform("explicit-null",nulltext,sizeof nulltext,UTF8PROC_STABLE|UTF8PROC_COMPOSE);
  transform("nullterm-null",nulltext,sizeof nulltext,UTF8PROC_STABLE|UTF8PROC_COMPOSE|UTF8PROC_NULLTERM);
  return 0;
}
