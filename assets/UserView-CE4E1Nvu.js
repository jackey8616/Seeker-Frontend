import{d as n,u as r,b as u,r as l,e as c,c as i,f as p,a as d,t as m,o as f}from"./index-izN2lRrk.js";const x=n({__name:"UserView",setup(_){const t=r(),{axios:o}=u(),e=l("");return c(async()=>{const a=await o.value.get(`/users/info/${t.userId}`);e.value=a.data.name}),(a,s)=>(f(),i("div",null,[s[0]||(s[0]=p("Hello ")),d("b",null,m(e.value),1)]))}});export{x as default};
