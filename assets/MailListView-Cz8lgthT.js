import{d as N,u as q,g as E,w as e,r as i,f as t,b as s,t as b,h as R,e as m,i as F,j as H,o as $,_ as I,k as g,l as O,m as S,c as z}from"./index-DszUUmPU.js";const G={class:"d-flex gap-2"},J={class:"mb-4"},K={class:"mb-4"},Q={class:"mail-content"},W=["src"],X=N({__name:"MailDetailDialog",props:{modelValue:{type:Boolean},mail:{}},emits:["update:modelValue","update:read"],setup(T,{emit:B}){const U=H("apiClient"),A=q(),w=T,x=B;async function y(){var o,a;if((a=(o=w.mail)==null?void 0:o.detailMail)!=null&&a.id)try{await U.client.post(`/mails/${w.mail.detailMail.id}/read`),x("update:read",!0)}catch(_){console.error("Error marking mail as read:",_)}}function p(o){const a=new Blob([o],{type:"text/html"});return URL.createObjectURL(a)}function C(){x("update:modelValue",!1)}return(o,a)=>{const _=i("v-icon"),M=i("v-tooltip"),V=i("v-btn"),L=i("router-link"),P=i("v-card-title"),D=i("v-expansion-panel-title"),j=i("v-expansion-panel-text"),r=i("v-expansion-panel"),n=i("v-expansion-panels"),u=i("v-card-text"),v=i("v-card"),k=i("v-dialog");return $(),E(k,{"model-value":o.modelValue,"onUpdate:modelValue":a[0]||(a[0]=d=>x("update:modelValue",d)),"max-width":"800px",persistent:""},{default:e(()=>[t(v,null,{default:e(()=>[t(P,{class:"d-flex justify-space-between align-center"},{default:e(()=>{var d,f;return[s("span",null,b((d=o.mail)==null?void 0:d.title),1),s("div",G,[t(V,{icon:"",onClick:y},{default:e(()=>[t(_,null,{default:e(()=>a[1]||(a[1]=[m("mdi-email-outline")])),_:1}),t(M,{activator:"parent",location:"bottom"},{default:e(()=>a[2]||(a[2]=[m("Mark as read")])),_:1})]),_:1}),(f=o.mail)!=null&&f.detailMail?($(),E(L,{key:0,to:{name:"mail-fitting",params:{thread_id:o.mail.detailMail.id}},custom:""},{default:e(({navigate:c})=>[t(V,{icon:"",onClick:c},{default:e(()=>[t(_,{icon:"mdi-brain"}),t(M,{activator:"parent",location:"bottom"},{default:e(()=>a[3]||(a[3]=[m("Fitting By AI")])),_:1})]),_:2},1032,["onClick"])]),_:1},8,["to"])):R("",!0),t(V,{icon:"",onClick:C},{default:e(()=>[t(_,null,{default:e(()=>a[4]||(a[4]=[m("mdi-close")])),_:1})]),_:1})])]}),_:1}),t(u,null,{default:e(()=>{var d,f,c,l;return[s("div",J,[a[5]||(a[5]=s("strong",null,"From:",-1)),m(" "+b((d=o.mail)==null?void 0:d.sender),1)]),s("div",K,[a[6]||(a[6]=s("strong",null,"Date:",-1)),m(" "+b(F(A).format((f=o.mail)==null?void 0:f.date,"keyboardDateTime24h")),1)]),(l=(c=o.mail)==null?void 0:c.detailMail)!=null&&l.extracted_data?($(),E(n,{key:0},{default:e(()=>[t(r,null,{default:e(()=>[t(D,null,{default:e(()=>a[7]||(a[7]=[m(" Mail Content ")])),_:1}),t(j,null,{default:e(()=>[s("div",Q,[s("iframe",{src:p(o.mail.detailMail.extracted_data),width:"100%",height:"500px",frameborder:"0"},null,8,W)])]),_:1})]),_:1})]),_:1})):R("",!0)]}),_:1})]),_:1})]),_:1},8,["model-value"])}}}),Y=I(X,[["__scopeId","data-v-2acdae7b"]]),Z={class:"mail"},ee={class:"d-flex gap-2"},te=["src"],ae={class:"d-flex align-center justify-space-between pa-4"},le={class:"d-flex align-center gap-2"},oe={class:"text-caption"},ne={class:"text-caption"},ie={class:"d-flex align-center gap-1"},re=N({__name:"MailListView",setup(T){const B=H("apiClient"),U=q(),A=[{title:"Action",key:"action",sortable:!1},{title:"Sender",key:"sender",sortable:!1},{title:"Title",key:"title",sortable:!1},{title:"Date",key:"date",sortable:!1}],w=g([]),x=g(null),y=g(0),p=g(1),C=g(!1),o=g(null),a=g(10),_=g(!1),M=g(null);async function V(r){var n;try{return(await B.client.get(`/mails/${r}`,{signal:(n=o.value)==null?void 0:n.signal})).data.data.mail}catch(u){if(u.name==="AbortError")return console.log("Request was aborted"),null;throw u}}function L(r){const n=new Blob([r],{type:"text/html"});return URL.createObjectURL(n)}async function P(r=1){var n,u;C.value=!0;try{const v=r===1?{}:{next_page_token:x.value},k=await B.client.post("/mails/list",v,{signal:(n=o.value)==null?void 0:n.signal}),{data:d}=k.data;if(w.value=d.mail_infos,x.value=d.next_page_token,y.value=d.total_count,p.value=r,!((u=o.value)!=null&&u.signal.aborted)){const f=w.value.map(c=>V(c.id).then(l=>{var h;l&&!((h=o.value)!=null&&h.signal.aborted)&&(c.sender=l.sender,c.title=l.title,c.date=l.date,c.detailMail=l)}).catch(l=>{l.name!=="AbortError"&&console.error(`Download mail id ${c.id} cause error`,l)}));await Promise.all(f)}}catch(v){if(v.name==="AbortError"){console.log("List request was aborted");return}console.error("Error fetching mail list:",v)}finally{C.value=!1}}function D(r){P(r)}function j(r){M.value=r,_.value=!0}return O(()=>{o.value=new AbortController,P()}),S(()=>{o.value&&(o.value.abort(),o.value=null)}),(r,n)=>{const u=i("v-icon"),v=i("v-tooltip"),k=i("v-btn"),d=i("v-chip"),f=i("v-divider"),c=i("v-data-table-server");return $(),z("div",Z,[t(c,{headers:A,items:w.value,loading:C.value,"items-length":y.value,page:p.value,"items-per-page":a.value,"onUpdate:page":D,"hide-default-footer":"",hover:""},{"item.action":e(({item:l})=>[s("div",ee,[t(k,{icon:"",size:"x-small",onClick:h=>j(l)},{default:e(()=>[t(u,{icon:"mdi-email-open"}),t(v,{activator:"parent",location:"bottom"},{default:e(()=>n[3]||(n[3]=[m("View Mail")])),_:1})]),_:2},1032,["onClick"])])]),"item.date":e(({item:l})=>[t(d,{size:"x-small"},{default:e(()=>[m(b(F(U).format(l.date,"keyboardDateTime24h"))+" ",1),t(v,{activator:"parent",location:"bottom"},{default:e(()=>[m(b(l.date),1)]),_:2},1024)]),_:2},1024)]),"expanded-row":e(({item:l})=>{var h;return[(h=l.detailMail)!=null&&h.extracted_data?($(),z("iframe",{key:0,src:L(l.detailMail.extracted_data),width:"100%"},null,8,te)):R("",!0)]}),bottom:e(()=>[s("div",ae,[s("div",le,[s("div",oe,b((p.value-1)*a.value+1)+"-"+b(Math.min(p.value*a.value,y.value))+" of "+b(y.value),1),t(f,{vertical:"",class:"mx-2"}),s("div",ne," Page "+b(p.value),1)]),s("div",ie,[t(k,{icon:"",size:"small",variant:"text",disabled:p.value===1,onClick:n[0]||(n[0]=l=>D(p.value-1))},{default:e(()=>[t(u,null,{default:e(()=>n[4]||(n[4]=[m("mdi-chevron-left")])),_:1})]),_:1},8,["disabled"]),t(k,{icon:"",size:"small",variant:"text",disabled:!x.value,onClick:n[1]||(n[1]=l=>D(p.value+1))},{default:e(()=>[t(u,null,{default:e(()=>n[5]||(n[5]=[m("mdi-chevron-right")])),_:1})]),_:1},8,["disabled"])])])]),_:1},8,["items","loading","items-length","page","items-per-page"]),t(Y,{modelValue:_.value,"onUpdate:modelValue":n[2]||(n[2]=l=>_.value=l),mail:M.value},null,8,["modelValue","mail"])])}}});export{re as default};
