import{d as E,u as O,k as _,p as R,g as b,w as e,r as s,h as j,f as o,b as a,e as r,c as $,n as M,F as A,o as m,t as i,i as B,l as q,j as G}from"./index-DszUUmPU.js";const H={class:"d-flex flex-row"},J={style:{"overflow-y":"auto",height:"100%"}},K=E({__name:"ConversationLogDetailDialog",props:{modelValue:{type:Boolean},log:{}},emits:["update:modelValue"],setup(S,{emit:T}){const N=S,F=T,y=O(),f=_(-1),g=R({get:()=>N.modelValue,set:u=>F("update:modelValue",u)});return(u,d)=>{const w=s("v-icon"),z=s("v-btn"),I=s("v-toolbar"),k=s("v-tab"),P=s("v-tabs"),V=s("v-textarea"),x=s("v-tabs-window-item"),U=s("v-text-field"),c=s("v-table"),t=s("v-tabs-window"),v=s("v-card"),C=s("v-dialog");return m(),b(C,{modelValue:g.value,"onUpdate:modelValue":d[3]||(d[3]=l=>g.value=l),"max-width":"1200",persistent:""},{default:e(()=>[u.log?(m(),b(v,{key:0},{default:e(()=>[o(I,{title:"ConversationLog"},{default:e(()=>[o(z,{icon:"",onClick:d[0]||(d[0]=l=>g.value=!1)},{default:e(()=>[o(w,null,{default:e(()=>d[4]||(d[4]=[r("mdi-close")])),_:1})]),_:1})]),_:1}),a("div",H,[o(P,{modelValue:f.value,"onUpdate:modelValue":d[1]||(d[1]=l=>f.value=l),direction:"vertical"},{default:e(()=>[o(k,{value:"-1","prepend-icon":"mdi-cog"},{default:e(()=>d[5]||(d[5]=[r("Setup")])),_:1}),(m(!0),$(A,null,M(u.log.chats,(l,p)=>(m(),b(k,{"prepend-icon":"mdi-briefcase",value:p},{default:e(()=>[r("Chat "+i(p+1),1)]),_:2},1032,["value"]))),256))]),_:1},8,["modelValue"]),o(t,{modelValue:f.value,"onUpdate:modelValue":d[2]||(d[2]=l=>f.value=l),class:"flex-grow-1"},{default:e(()=>[o(x,{value:"-1"},{default:e(()=>[o(V,{readonly:"",label:"System Instruction","model-value":u.log.system_instruction,rows:"40"},null,8,["model-value"])]),_:1}),(m(!0),$(A,null,M(u.log.chats,(l,p)=>(m(),b(x,{value:p},{default:e(()=>[a("div",J,[o(U,{readonly:"",label:"AI runs / ends @","model-value":`${B(y).format(l.start_datetime,"keyboardDateTime24h")}  ~  ${B(y).format(l.end_datetime,"keyboardDateTime24h")}`,variant:"underlined"},null,8,["model-value"]),o(U,{readonly:"",label:"Input / Output tokens","model-value":`${l.input_token}  /  ${l.output_token}`,variant:"underlined"},null,8,["model-value"]),o(V,{readonly:"",label:"AI Output","model-value":l.output,rows:"30"},null,8,["model-value"]),l.metrics?(m(),b(c,{key:0,density:"compact"},{default:e(()=>[d[6]||(d[6]=a("thead",null,[a("tr",null,[a("td",null,"Metric Name"),a("td",null,"F1 Score"),a("td",null,"Precision"),a("td",null,"Recall")])],-1)),a("tbody",null,[(m(!0),$(A,null,M(l.metrics.rouge,(D,L)=>(m(),$("tr",null,[a("td",null,i(L),1),a("td",null,i(Number(D.f).toFixed(4)),1),a("td",null,i(Number(D.p).toFixed(4)),1),a("td",null,i(Number(D.r).toFixed(4)),1)]))),256))])]),_:2},1024)):j("",!0)])]),_:2},1032,["value"]))),256))]),_:1},8,["modelValue"])])]),_:1})):j("",!0)]),_:1},8,["modelValue"])}}}),Q={class:"d-flex flex-column align-center pa-4"},W={class:"d-flex align-center justify-space-between pa-4"},X={class:"d-flex align-center gap-2"},Y={class:"text-caption"},Z={class:"text-caption"},ee={class:"d-flex align-center gap-1"},ae=E({__name:"ConversationLogListView",setup(S){const T=G("apiClient"),N=O(),F=[{title:"Action",key:"action",sortable:!1},{title:"Model",key:"model_name",sortable:!1},{title:"TotalToken(Input/Output)",key:"total_token",sortable:!1},{title:"CreateTime",key:"created_at",sortable:!0},{title:"UpdateTime",key:"updated_at",sortable:!0}],y=_([]),f=_(!1),g=_(100),u=_(1),d=_(),w=_(),z=_(20),I=_({page:1,itemsPerPage:20,sortBy:[{key:"updated_at",order:"desc"}]}),k=_(!1),P=_();q(async()=>{await V(1)});const V=async c=>{f.value=!0;const t=c===1?{}:{page_token:c>u.value?w.value:d.value};try{const v=await T.client.post("/conversation_logs",t);y.value=v.data.data.logs,d.value=v.data.data.cursor.previous_page_token,w.value=v.data.data.cursor.next_page_token,u.value=c,g.value=Math.max(100,y.value.length*5)}catch(v){console.error("Error fetching conversation logs:",v)}finally{f.value=!1}},x=async c=>{const t=c.page||1;await V(t)},U=async c=>{try{const t=await T.client.get(`/conversation_logs/${c}`);P.value=t.data.data.log,k.value=!0}catch(t){console.error("Error fetching conversation log detail:",t)}};return(c,t)=>{const v=s("v-icon"),C=s("v-tooltip"),l=s("v-btn"),p=s("v-chip"),D=s("v-skeleton-loader"),L=s("v-divider"),h=s("v-data-table-server");return m(),$("div",null,[o(h,{options:I.value,"onUpdate:options":[t[2]||(t[2]=n=>I.value=n),x],headers:F,items:y.value,loading:f.value,"items-length":g.value,"items-per-page":"20",class:"elevation-1","hide-default-footer":""},{"item.action":e(({item:n})=>[o(l,{icon:"",size:"x-small",onClick:te=>U(n._id)},{default:e(()=>[o(v,{icon:"mdi-information-outline"}),o(C,{activator:"parent",location:"bottom"},{default:e(()=>t[4]||(t[4]=[r("Detail")])),_:1})]),_:2},1032,["onClick"])]),"item.model_name":e(({item:n})=>[o(p,{size:"x-small"},{default:e(()=>[r(i(n.model_name),1)]),_:2},1024)]),"item.total_token":e(({item:n})=>[r(i(n.total_input_token)+"/"+i(n.total_output_token),1)]),"item.created_at":e(({item:n})=>[o(p,{size:"x-small"},{default:e(()=>[r(i(B(N).format(n.created_at,"keyboardDateTime24h"))+" ",1),o(C,{activator:"parent",location:"bottom"},{default:e(()=>[r(i(n.created_at),1)]),_:2},1024)]),_:2},1024)]),"item.updated_at":e(({item:n})=>[n.updated_at!==null?(m(),b(p,{key:0,size:"x-small"},{default:e(()=>[r(i(B(N).format(n.updated_at,"keyboardDateTime24h"))+" ",1),o(C,{activator:"parent",location:"bottom"},{default:e(()=>[r(i(n.updated_at),1)]),_:2},1024)]),_:2},1024)):(m(),b(p,{key:1,size:"x-small"},{default:e(()=>t[5]||(t[5]=[r("N/A")])),_:1}))]),"no-data":e(()=>[a("div",Q,[o(v,{size:"large",color:"grey",class:"mb-2"},{default:e(()=>t[6]||(t[6]=[r("mdi-alert-circle-outline")])),_:1}),t[7]||(t[7]=a("span",{class:"text-grey"},"No conversation logs found",-1))])]),loading:e(()=>[o(D,{type:"table-row@6"})]),bottom:e(()=>[a("div",W,[a("div",X,[a("div",Y,i((u.value-1)*z.value+1)+"-"+i(Math.min(u.value*z.value,g.value))+" of "+i(g.value),1),o(L,{vertical:"",class:"mx-2"}),a("div",Z," Page "+i(u.value),1)]),a("div",ee,[o(l,{icon:"",size:"small",variant:"text",disabled:u.value===1,onClick:t[0]||(t[0]=n=>x({page:u.value-1}))},{default:e(()=>[o(v,null,{default:e(()=>t[8]||(t[8]=[r("mdi-chevron-left")])),_:1})]),_:1},8,["disabled"]),o(l,{icon:"",size:"small",variant:"text",disabled:!w.value,onClick:t[1]||(t[1]=n=>x({page:u.value+1}))},{default:e(()=>[o(v,null,{default:e(()=>t[9]||(t[9]=[r("mdi-chevron-right")])),_:1})]),_:1},8,["disabled"])])])]),_:1},8,["options","items","loading","items-length"]),o(K,{modelValue:k.value,"onUpdate:modelValue":t[3]||(t[3]=n=>k.value=n),log:P.value},null,8,["modelValue","log"])])}}});export{ae as default};
