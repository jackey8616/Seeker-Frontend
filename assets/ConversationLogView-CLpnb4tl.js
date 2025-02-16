import{d as T,u as B,a as O,r as g,o as A,c,g as F,b as d,e,w as l,f as o,k as m,h as b,F as w,m as k,j as h,t as J,i as x}from"./index-CvGtmCrt.js";const U={key:0},E={class:"d-flex flex-row",style:{height:"100vh"}},M=["href"],q=T({__name:"ConversationLogView",props:{conversation_log_id:{}},setup(V){const j=V,f=B(),{axios:$}=O(),i=g(-1),u=g();A(async()=>{u.value=await $.value.get(`/conversation_logs/${j.conversation_log_id}`).then(({data:s})=>{if(s.data.log==null)return null;const n={...s.data.log};for(let r of n.chats){const v=r.input.substring(17,r.input.length-17-1);r.json_input=JSON.parse(v)}return n})});function C(s){return s.system_instruction.join(`
`)}return(s,n)=>{const r=o("v-toolbar"),v=o("v-tab"),I=o("v-tabs"),p=o("v-textarea"),y=o("v-tabs-window-item"),D=o("v-tooltip"),L=o("v-btn"),a=o("v-text-field"),N=o("v-tabs-window"),S=o("v-card");return u.value?(d(),c("div",U,[e(S,null,{default:l(()=>[e(r,{title:"ConversationLog"}),m("div",E,[e(I,{modelValue:i.value,"onUpdate:modelValue":n[0]||(n[0]=t=>i.value=t),direction:"vertical"},{default:l(()=>[e(v,{value:"-1","prepend-icon":"$gear"},{default:l(()=>n[2]||(n[2]=[b("Setup")])),_:1}),(d(!0),c(w,null,k(u.value.chats,(t,_)=>(d(),h(v,{"prepend-icon":"$briefcase",value:_},{default:l(()=>[b("Job "+J(_+1),1)]),_:2},1032,["value"]))),256))]),_:1},8,["modelValue"]),e(N,{modelValue:i.value,"onUpdate:modelValue":n[1]||(n[1]=t=>i.value=t),class:"flex-grow-1"},{default:l(()=>[e(y,{value:"-1"},{default:l(()=>[n[3]||(n[3]=m("h3",null,"System Instruction",-1)),e(p,{value:C(u.value),style:{width:"100%",height:"80vh"}},null,8,["value"])]),_:1}),(d(!0),c(w,null,k(u.value.chats,(t,_)=>(d(),h(y,{value:_},{default:l(()=>[e(a,{readonly:"","model-value":t.json_input.title,label:"Title",variant:"underlined"},{append:l(()=>[e(L,null,{default:l(()=>[m("a",{href:t.json_input.link,target:"_blank"},"Link",8,M),e(D,{activator:"parent",location:"bottom"},{default:l(()=>n[4]||(n[4]=[b("Open job in another tab")])),_:1})]),_:2},1024)]),_:2},1032,["model-value"]),e(a,{readonly:"","model-value":t.json_input.location,label:"Location",variant:"underlined"},null,8,["model-value"]),e(a,{readonly:"","model-value":t.json_input.salary,label:"Salary",variant:"underlined"},null,8,["model-value"]),e(a,{readonly:"","model-value":t.json_input.work_type,label:"WorkType",variant:"underlined"},null,8,["model-value"]),e(p,{readonly:"","model-value":t.json_input.details,label:"Details",style:{width:"100%",height:"20vh"}},null,8,["model-value"]),n[5]||(n[5]=m("br",null,null,-1)),e(a,{readonly:"","model-value":`${x(f).format(t.start_datetime,"keyboardDateTime24h")}  ~  ${x(f).format(t.end_datetime,"keyboardDateTime24h")}`,label:"AI runs / ends @",variant:"underlined"},null,8,["model-value"]),e(a,{readonly:"","model-value":`${t.input_token}  /  ${t.output_token}`,label:"Input / Output tokens",variant:"underlined"},null,8,["model-value"]),e(p,{readonly:"","model-value":t.output,label:"AI Output",style:{width:"100%",height:"40vh"}},null,8,["model-value"])]),_:2},1032,["value"]))),256))]),_:1},8,["modelValue"])])]),_:1})])):F("",!0)}}});export{q as default};
