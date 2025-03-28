import{d as z,u as C,a as B,r as s,o as U,c as V,b as _,e as l,w as t,f as d,k as c,h as i,j as y,t as r,i as k,m as E}from"./index-CMx2rZuF.js";const J={class:"font-weight-medium"},L={class:"text-caption text-truncate",style:{"max-width":"300px"}},M={class:"d-flex flex-column align-center pa-4"},P=z({__name:"JobListView",setup(I){const v=C(),{axios:w}=B();E();const T=s([{title:"Action",text:"Action",value:"action",sortable:!1,width:"60px"},{title:"Domain",text:"Domain",value:"domain",width:"120px"},{title:"Title",text:"Title",value:"title"},{title:"CreatedAt",text:"CreateTime",value:"created_at",sortable:!0,width:"180px"},{title:"UpdatedAt",text:"UpdateTime",value:"updated_at",sortable:!0,width:"180px"}]);s([{key:"updated_at",order:"desc"}]);const u=s([]),m=s(1),f=s(),x=s(),p=s(!0),g=s(100);async function b(n=1){p.value=!0;const a=n==1?{}:{page_token:n>m.value?x.value:f.value};try{const{data:o}=await w.value.post("/jobs",a);u.value=o.data.jobs,f.value=o.data.cursor.previous_page_token,x.value=o.data.cursor.next_page_token,m.value=n,g.value=Math.max(100,u.value.length*5)}catch(o){console.error("Error fetching jobs:",o)}finally{p.value=!1}}async function j(n){console.log("Options updated:",n);const a=n.page||1;await b(a)}return U(async()=>{await b(1)}),(n,a)=>{const o=d("v-chip"),h=d("v-tooltip"),A=d("v-icon"),D=d("v-skeleton-loader"),N=d("v-data-table-server");return _(),V("div",null,[l(N,{headers:T.value,items:u.value,"items-length":g.value,loading:p.value,"items-per-page":"20","onUpdate:options":j,class:"elevation-1"},{"item.domain":t(({item:e})=>[l(o,{size:"small"},{default:t(()=>[i(r(e.domain),1)]),_:2},1024)]),"item.title":t(({item:e})=>[c("div",J,r(e.title),1),c("div",L,r(e.description||"No description"),1)]),"item.created_at":t(({item:e})=>[l(o,{size:"small",variant:"outlined",class:"text-caption"},{default:t(()=>[i(r(k(v).format(e.created_at,"keyboardDateTime24h"))+" ",1),l(h,{activator:"parent",location:"bottom"},{default:t(()=>[i(r(e.created_at),1)]),_:2},1024)]),_:2},1024)]),"item.updated_at":t(({item:e})=>[e.updated_at?(_(),y(o,{key:0,size:"small",variant:"outlined",class:"text-caption"},{default:t(()=>[i(r(k(v).format(e.updated_at,"keyboardDateTime24h"))+" ",1),l(h,{activator:"parent",location:"bottom"},{default:t(()=>[i(r(e.updated_at),1)]),_:2},1024)]),_:2},1024)):(_(),y(o,{key:1,size:"small",variant:"outlined",color:"grey"},{default:t(()=>a[0]||(a[0]=[i("N/A")])),_:1}))]),"no-data":t(()=>[c("div",M,[l(A,{size:"large",color:"grey",class:"mb-2"},{default:t(()=>a[1]||(a[1]=[i("mdi-alert-circle-outline")])),_:1}),a[2]||(a[2]=c("span",{class:"text-grey"},"No jobs found",-1))])]),loading:t(()=>[l(D,{type:"table-row@6"})]),_:1},8,["headers","items","items-length","loading"])])}}});export{P as default};
