import{d as F,a as B,r as s,c as d,b as v,k as n,h as p,e as o,w as V,f as m,F as N,l as _,t as w}from"./index-B2uvkbkY.js";const $=["href"],I=F({__name:"MailFittingView",props:{thread_id:{}},setup(x){const b=x,{axios:g}=B(),a=s(!1),i=s(""),u=s(""),f=s();async function y(k){a.value=!0;const e=await g.value.post(`/mails/fitting_by_ai/${k}`,{restriction:i.value,resume:u.value}).then(t=>t).catch(t=>t).finally(()=>a.value=!1);f.value=e.data.result}return(k,e)=>{const t=m("v-chip"),r=m("v-textarea"),C=m("v-btn");return v(),d("div",null,[e[7]||(e[7]=n("label",null,"Thread",-1)),e[8]||(e[8]=p()),o(t,{size:"small"},{default:V(()=>[p(w(b.thread_id),1)]),_:1}),o(r,{modelValue:i.value,"onUpdate:modelValue":e[0]||(e[0]=l=>i.value=l),label:"Restriction",rows:"5"},null,8,["modelValue"]),o(r,{modelValue:u.value,"onUpdate:modelValue":e[1]||(e[1]=l=>u.value=l),label:"Resume",rows:"15"},null,8,["modelValue"]),o(C,{onClick:e[2]||(e[2]=l=>y(b.thread_id)),"prepend-icon":"$ai",disabled:a.value},{default:V(()=>e[3]||(e[3]=[p("AI Invoke")])),_:1},8,["disabled"]),e[9]||(e[9]=n("br",null,null,-1)),e[10]||(e[10]=n("br",null,null,-1)),e[11]||(e[11]=n("hr",null,null,-1)),(v(!0),d(N,null,_(f.value,l=>(v(),d("div",{key:l.link},[e[4]||(e[4]=n("label",null,"Link",-1)),n("a",{href:l.link},w(l.link),9,$),e[5]||(e[5]=n("br",null,null,-1)),e[6]||(e[6]=n("label",null,"Fitting",-1)),o(r,{value:l.response,style:{width:"100%",height:"15vh"}},null,8,["value"])]))),128))])}}});export{I as default};
