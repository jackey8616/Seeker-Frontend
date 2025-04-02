import{_ as O}from"./ChatLogDetail.vue_vue_type_script_setup_true_lang-zuyMhcR0.js";import{d as j,u as E,g as u,j as q,k as f,w as t,r as n,l as G,f as o,b as _,e as i,c as N,m as I,F as h,o as c,t as d,h as H,i as J,n as M}from"./index-CGjNS5Fa.js";const K={class:"d-flex flex-row"},Q=j({__name:"ConversationLogDetailDialog",props:{modelValue:{type:Boolean},log:{}},emits:["update:modelValue"],setup(P,{emit:w}){const V=P,$=w;E();const m=u(-1),p=q({get:()=>V.modelValue,set:r=>$("update:modelValue",r)});return(r,a)=>{const C=n("v-icon"),g=n("v-btn"),D=n("v-toolbar"),b=n("v-tab"),k=n("v-tabs"),T=n("v-textarea"),y=n("v-tabs-window-item"),x=n("v-tabs-window"),U=n("v-card"),v=n("v-dialog");return c(),f(v,{modelValue:p.value,"onUpdate:modelValue":a[3]||(a[3]=e=>p.value=e),"max-width":"1200",persistent:""},{default:t(()=>[r.log?(c(),f(U,{key:0},{default:t(()=>[o(D,{title:"ConversationLog"},{default:t(()=>[o(g,{icon:"",onClick:a[0]||(a[0]=e=>p.value=!1)},{default:t(()=>[o(C,null,{default:t(()=>a[4]||(a[4]=[i("mdi-close")])),_:1})]),_:1})]),_:1}),_("div",K,[o(k,{modelValue:m.value,"onUpdate:modelValue":a[1]||(a[1]=e=>m.value=e),direction:"vertical"},{default:t(()=>[o(b,{value:"-1","prepend-icon":"mdi-cog"},{default:t(()=>a[5]||(a[5]=[i("Setup")])),_:1}),(c(!0),N(h,null,I(r.log.chats,(e,s)=>(c(),f(b,{"prepend-icon":"mdi-briefcase",value:s},{default:t(()=>[i("Chat "+d(s+1),1)]),_:2},1032,["value"]))),256))]),_:1},8,["modelValue"]),o(x,{modelValue:m.value,"onUpdate:modelValue":a[2]||(a[2]=e=>m.value=e),class:"flex-grow-1"},{default:t(()=>[o(y,{value:"-1"},{default:t(()=>[o(T,{readonly:"",label:"System Instruction","model-value":r.log.system_instruction,rows:"40"},null,8,["model-value"])]),_:1}),(c(!0),N(h,null,I(r.log.chats,(e,s)=>(c(),f(y,{value:s},{default:t(()=>[o(O,{chat:e},null,8,["chat"])]),_:2},1032,["value"]))),256))]),_:1},8,["modelValue"])])]),_:1})):G("",!0)]),_:1},8,["modelValue"])}}}),R={class:"d-flex flex-column align-center pa-4"},W={class:"d-flex align-center justify-space-between pa-4"},X={class:"d-flex align-center gap-2"},Y={class:"text-caption"},Z={class:"text-caption"},ee={class:"d-flex align-center gap-1"},le=j({__name:"ConversationLogListView",setup(P){const w=J("apiClient"),V=E(),$=[{title:"Action",key:"action",sortable:!1},{title:"Model",key:"model_name",sortable:!1},{title:"TotalToken(Input/Output)",key:"total_token",sortable:!1},{title:"CreateTime",key:"created_at",sortable:!0},{title:"UpdateTime",key:"updated_at",sortable:!0}],m=u([]),p=u(!1),r=u(100),a=u(1),C=u(),g=u(),D=u(20),b=u({page:1,itemsPerPage:20,sortBy:[{key:"updated_at",order:"desc"}]}),k=u(!1),T=u();H(async()=>{await y(1)});const y=async v=>{p.value=!0;const e=v===1?{}:{page_token:v>a.value?g.value:C.value};try{const s=await w.client.post("/conversation_logs",e);m.value=s.data.data.logs,C.value=s.data.data.cursor.previous_page_token,g.value=s.data.data.cursor.next_page_token,a.value=v,r.value=Math.max(100,m.value.length*5)}catch(s){console.error("Error fetching conversation logs:",s)}finally{p.value=!1}},x=async v=>{const e=v.page||1;await y(e)},U=async v=>{try{const e=await w.client.get(`/conversation_logs/${v}`);T.value=e.data.data.log,k.value=!0}catch(e){console.error("Error fetching conversation log detail:",e)}};return(v,e)=>{const s=n("v-icon"),B=n("v-tooltip"),L=n("v-btn"),z=n("v-chip"),S=n("v-skeleton-loader"),A=n("v-divider"),F=n("v-data-table-server");return c(),N("div",null,[o(F,{options:b.value,"onUpdate:options":[e[2]||(e[2]=l=>b.value=l),x],headers:$,items:m.value,loading:p.value,"items-length":r.value,"items-per-page":"20",class:"elevation-1","hide-default-footer":""},{"item.action":t(({item:l})=>[o(L,{icon:"",size:"x-small",onClick:te=>U(l._id)},{default:t(()=>[o(s,{icon:"mdi-information-outline"}),o(B,{activator:"parent",location:"bottom"},{default:t(()=>e[4]||(e[4]=[i("Detail")])),_:1})]),_:2},1032,["onClick"])]),"item.model_name":t(({item:l})=>[o(z,{size:"x-small"},{default:t(()=>[i(d(l.model_name),1)]),_:2},1024)]),"item.total_token":t(({item:l})=>[i(d(l.total_input_token)+"/"+d(l.total_output_token),1)]),"item.created_at":t(({item:l})=>[o(z,{size:"x-small"},{default:t(()=>[i(d(M(V).format(l.created_at,"keyboardDateTime24h"))+" ",1),o(B,{activator:"parent",location:"bottom"},{default:t(()=>[i(d(l.created_at),1)]),_:2},1024)]),_:2},1024)]),"item.updated_at":t(({item:l})=>[l.updated_at!==null?(c(),f(z,{key:0,size:"x-small"},{default:t(()=>[i(d(M(V).format(l.updated_at,"keyboardDateTime24h"))+" ",1),o(B,{activator:"parent",location:"bottom"},{default:t(()=>[i(d(l.updated_at),1)]),_:2},1024)]),_:2},1024)):(c(),f(z,{key:1,size:"x-small"},{default:t(()=>e[5]||(e[5]=[i("N/A")])),_:1}))]),"no-data":t(()=>[_("div",R,[o(s,{size:"large",color:"grey",class:"mb-2"},{default:t(()=>e[6]||(e[6]=[i("mdi-alert-circle-outline")])),_:1}),e[7]||(e[7]=_("span",{class:"text-grey"},"No conversation logs found",-1))])]),loading:t(()=>[o(S,{type:"table-row@6"})]),bottom:t(()=>[_("div",W,[_("div",X,[_("div",Y,d((a.value-1)*D.value+1)+"-"+d(Math.min(a.value*D.value,r.value))+" of "+d(r.value),1),o(A,{vertical:"",class:"mx-2"}),_("div",Z," Page "+d(a.value),1)]),_("div",ee,[o(L,{icon:"",size:"small",variant:"text",disabled:a.value===1,onClick:e[0]||(e[0]=l=>x({page:a.value-1}))},{default:t(()=>[o(s,null,{default:t(()=>e[8]||(e[8]=[i("mdi-chevron-left")])),_:1})]),_:1},8,["disabled"]),o(L,{icon:"",size:"small",variant:"text",disabled:!g.value,onClick:e[1]||(e[1]=l=>x({page:a.value+1}))},{default:t(()=>[o(s,null,{default:t(()=>e[9]||(e[9]=[i("mdi-chevron-right")])),_:1})]),_:1},8,["disabled"])])])]),_:1},8,["options","items","loading","items-length"]),o(Q,{modelValue:k.value,"onUpdate:modelValue":e[3]||(e[3]=l=>k.value=l),log:T.value},null,8,["modelValue","log"])])}}});export{le as default};
