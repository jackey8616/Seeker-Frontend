import{d as L,a as R,r as u,c as w,b as i,k as a,h as r,e as l,w as o,f as n,t as g,F as y,l as B,j as C}from"./index-CMx2rZuF.js";const T={class:"d-flex flex-row"},z={style:{"overflow-y":"auto",height:"100%"}},D=["href"],M=L({__name:"MailFittingView",props:{thread_id:{}},setup(U){const c=U,{axios:$}=R(),d=u(0),p=u(!1),m=u(""),_=u(""),b=u();async function F(V){p.value=!0;const e=await $.value.post(`/mails/fitting_by_ai/${V}`,{restriction:m.value,resume:_.value}).then(s=>s).catch(s=>s).finally(()=>p.value=!1);b.value=e.data.result}return(V,e)=>{const s=n("v-chip"),f=n("v-textarea"),k=n("v-btn"),x=n("v-tooltip"),I=n("v-tab"),N=n("v-tabs"),j=n("v-tabs-window-item"),A=n("v-tabs-window"),J=n("v-card");return i(),w("div",null,[e[7]||(e[7]=a("label",null,"Thread",-1)),e[8]||(e[8]=r()),l(s,{size:"small"},{default:o(()=>[r(g(c.thread_id),1)]),_:1}),l(f,{modelValue:m.value,"onUpdate:modelValue":e[0]||(e[0]=t=>m.value=t),label:"Restriction",rows:"5"},null,8,["modelValue"]),l(f,{modelValue:_.value,"onUpdate:modelValue":e[1]||(e[1]=t=>_.value=t),label:"Resume",rows:"15"},null,8,["modelValue"]),l(k,{onClick:e[2]||(e[2]=t=>F(c.thread_id)),"prepend-icon":"$ai",disabled:p.value},{default:o(()=>e[5]||(e[5]=[r("AI Invoke")])),_:1},8,["disabled"]),e[9]||(e[9]=a("br",null,null,-1)),e[10]||(e[10]=a("br",null,null,-1)),e[11]||(e[11]=a("hr",null,null,-1)),l(J,null,{default:o(()=>[l(x,{title:"Jobs"}),a("div",T,[l(N,{modelValue:d.value,"onUpdate:modelValue":e[3]||(e[3]=t=>d.value=t),direction:"vertical"},{default:o(()=>[(i(!0),w(y,null,B(b.value,(t,v)=>(i(),C(I,{"prepend-icon":"$briefcase",value:v},{default:o(()=>[r("Job "+g(v+1),1)]),_:2},1032,["value"]))),256))]),_:1},8,["modelValue"]),l(A,{modelValue:d.value,"onUpdate:modelValue":e[4]||(e[4]=t=>d.value=t),class:"flex-grow-1"},{default:o(()=>[(i(!0),w(y,null,B(b.value,(t,v)=>(i(),C(j,{value:v},{default:o(()=>[a("div",z,[l(k,null,{default:o(()=>[a("a",{href:t.link,target:"_blank"},"Link",8,D),l(x,{activator:"parent",location:"bottom"},{default:o(()=>e[6]||(e[6]=[r("Open job in another tab")])),_:1})]),_:2},1024),l(f,{value:t.response,rows:"15"},null,8,["value"])])]),_:2},1032,["value"]))),256))]),_:1},8,["modelValue"])])]),_:1})])}}});export{M as default};
