(this["webpackJsonpbangumi-ratings"]=this["webpackJsonpbangumi-ratings"]||[]).push([[0],{146:function(e,t,a){},148:function(e,t){e.exports={APPLICATION_ID:"54T0X4tWovUBdnRd6EKdW3BrN4WJrpGBEJdwDk9J",JAVASCRIPT_KEY:"WREbi60D2GfVknGhH9Je1GJ931oIhIVkHUXD9u5R",SERVER_URL:"https://parseapi.back4app.com/"}},378:function(e,t,a){e.exports=a(754)},383:function(e,t,a){},384:function(e,t,a){},388:function(e,t,a){},612:function(e,t){},614:function(e,t){},625:function(e,t){},627:function(e,t){},654:function(e,t){},656:function(e,t){},657:function(e,t){},663:function(e,t){},665:function(e,t){},683:function(e,t){},685:function(e,t){},697:function(e,t){},700:function(e,t){},746:function(e,t,a){},747:function(e,t,a){},748:function(e,t,a){},749:function(e,t,a){},750:function(e,t,a){},754:function(e,t,a){"use strict";a.r(t);var n=a(1),l=a.n(n),r=a(118),c=a.n(r),i=(a(383),a(46)),o=a.n(i),u=a(84),s=a(24),m=a(88),d=a(236);a(384);var E=function(){return l.a.createElement(d.a,{sticky:"top",expand:"lg",id:"navbar"},l.a.createElement(d.a.Brand,{href:"/"},"\u8ffd\u756a\u8865\u756a"),l.a.createElement(m.a,{className:"mr-auto",activeKey:window.location.pathname},l.a.createElement(m.a.Item,null,l.a.createElement(m.a.Link,{href:"/today"},"\u4eca\u65e5\u66f4\u65b0")),l.a.createElement(m.a.Item,null,l.a.createElement(m.a.Link,{href:"/list"},"\u6211\u7684\u5217\u8868")),l.a.createElement(m.a.Item,null,l.a.createElement(m.a.Link,{href:"/calendar"},"\u770b\u756a\u65e5\u5386"))))},p=l.a.createContext({ratings:[],descriptions:{}}),f=a(87),b=a(175),v=a(176),g=a(120),h=a(181),y=a(180),_=(a(388),a(45)),O=a.n(_),w=a(756),j=a(757),k=a(32),N=a(10),C=a(103),Y=(l.a.Component,a(746),l.a.Component,a(148)),V=a(372),L=a(64),S=a(368),D=a(177);a(146);function R(e){return l.a.createElement("th",{key:e.header},l.a.createElement("div",{className:"table-header"},l.a.createElement("div",null,e.header),l.a.createElement(D.b,{className:"sort-icon clickable",onClick:e.sort})))}var x=a(367);a(747);function I(e){var t=Object(n.useState)(!1),a=Object(s.a)(t,2),r=a[0],c=a[1];return r?l.a.createElement("div",{className:"filter-box"},l.a.createElement("input",{className:"filter-input-box",placeholder:"\u8f93\u5165......",type:"text",onKeyPress:function(t){"Enter"===t.key&&e.filter(t)}}),l.a.createElement("div",{className:"close-button clickable",onClick:function(){e.clearFilter(),c(!r)}},"\xd7")):l.a.createElement(x.a,{className:"filter-box clickable",onClick:function(){return c(!r)}})}a(748);function M(e){return l.a.createElement("th",{key:e.header},l.a.createElement("div",{className:"table-header"},l.a.createElement("div",null,e.header),l.a.createElement(I,{filter:e.filter,clearFilter:e.clearFilter})))}function A(e){var t=e.description;return void 0===t||null===t?l.a.createElement("p",null,"\u6682\u65e0\u7b80\u4ecb"):l.a.createElement("div",null,l.a.createElement("h1",null,t.name),l.a.createElement("p",null,"\u8c46\u74e3\u8bc4\u5206\uff1a",t.douban),l.a.createElement("p",null,"\u5e74\u4efd\uff1a",t.year),l.a.createElement("p",null,"\u5206\u7c7b\uff1a",t.genre),l.a.createElement("p",null,"\u96c6\u6570\uff1a",t.episodes),l.a.createElement("p",null,"\u5355\u96c6\u7247\u957f\uff1a",t.episode_length),l.a.createElement("p",null,"\u7b80\u4ecb\uff1a",t.description))}a(749);function J(e){var t=void 0===e.oldValue||null===e.oldValue?{}:e.oldValue;return console.log(t),console.log(e.id),l.a.createElement(N.a,{onSubmit:function(t){e.onSubmitOrEdit(t,e.id)}},l.a.createElement(N.a.Group,{controlId:"name"},l.a.createElement(N.a.Label,null,"\u540d\u79f0"),l.a.createElement(N.a.Control,{defaultValue:t.name,type:"input"})),l.a.createElement(N.a.Group,null,l.a.createElement(N.a.Row,{className:"input-row"},l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u8c46\u74e3\u8bc4\u5206"),l.a.createElement(N.a.Control,{defaultValue:t.douban,id:"douban",type:"input"})),l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u5e74\u4efd"),l.a.createElement(N.a.Control,{defaultValue:t.year,id:"year",type:"input"})),l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u72b6\u6001"),l.a.createElement(N.a.Control,{defaultValue:t.status,id:"status",type:"input"}))),l.a.createElement(N.a.Row,{className:"input-row"},l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u5206\u7c7b"),l.a.createElement(N.a.Control,{defaultValue:t.genre,id:"genre",type:"input"})),l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"TV\u96c6\u6570"),l.a.createElement(N.a.Control,{defaultValue:t.tv_episodes,id:"tv_episodes",type:"input"})),l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u5267\u573a\u7248"),l.a.createElement(N.a.Control,{defaultValue:t.movies,id:"movies",type:"input"})),l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u5355\u96c6\u7247\u957f"),l.a.createElement(N.a.Control,{defaultValue:t.episode_length,id:"episode_length",type:"input"})))),l.a.createElement(N.a.Group,null,l.a.createElement(N.a.Label,null,"\u7b80\u4ecb"),l.a.createElement(N.a.Control,{defaultValue:t.description,id:"description",as:"textarea",rows:"3"})),l.a.createElement(N.a.Group,null,l.a.createElement(N.a.Row,{className:"input-row"},l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u5267\u60c5\u8bc4\u5206"),l.a.createElement(N.a.Control,{defaultValue:t.story,id:"story",type:"input"})),l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u4f5c\u753b\u8bc4\u5206"),l.a.createElement(N.a.Control,{defaultValue:t.story,id:"illustration",type:"input"})),l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u97f3\u4e50\u8bc4\u5206"),l.a.createElement(N.a.Control,{defaultValue:t.music,id:"music",type:"input"})),l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u60c5\u6000\u8bc4\u5206"),l.a.createElement(N.a.Control,{defaultValue:t.passion,id:"passion",type:"input"})))),l.a.createElement(N.a.Group,null,l.a.createElement(N.a.Row,{className:"input-row"},l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u5f00\u59cb\u89c2\u770b\u65e5\u671f"),l.a.createElement(N.a.Control,{defaultValue:t.start_date,id:"start_date",type:"input"})),l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u7ed3\u675f\u89c2\u770b\u65e5\u671f"),l.a.createElement(N.a.Control,{defaultValue:t.end_date,id:"end_date",type:"input"})),l.a.createElement(k.a,null,l.a.createElement(N.a.Label,null,"\u89c2\u770b\u6b21\u6570"),l.a.createElement(N.a.Control,{defaultValue:t.times_watched,id:"times_watched",type:"input"})))),l.a.createElement(C.a,{className:"pink-button",type:"submit"},"\u63d0\u4ea4"))}a(750);function P(e){switch(e){case"\u540d\u79f0":return"name";case"\u96c6\u6570":return"tv_episodes";case"\u72b6\u6001":return"status";case"\u5206\u7c7b":return"genre";case"\u5267\u60c5":return"story";case"\u4f5c\u753b":return"illustration";case"\u97f3\u4e50":return"music";case"\u60c5\u6000":return"passion";case"\u8bc4\u5206":return"rating";case"\u9996\u6b21\u89c2\u770b\u65e5\u671f":return"start_date";case"\u89c2\u770b\u6b21\u6570":return"times_watched";default:return"unknown"}}O.a.initialize(Y.APPLICATION_ID,Y.JAVASCRIPT_KEY),O.a.serverURL=Y.SERVER_URL;var B=function(e){var t=l.a.useContext(p),a=t.ratings,r=(t.descriptions,Object(n.useState)(null)),c=Object(s.a)(r,2),i=c[0],o=c[1],u=Object(n.useState)(!1),m=Object(s.a)(u,2),d=m[0],E=m[1],f=Object(n.useState)(!1),b=Object(s.a)(f,2),v=b[0],g=b[1],h=Object(n.useState)(!1),y=Object(s.a)(h,2),_=y[0],O=y[1],w=Object(n.useState)(),j=Object(s.a)(w,2),k=j[0],N=j[1],Y=Object(n.useState)([]),x=Object(s.a)(Y,2),I=x[0],B=x[1],G=Object(n.useState)({}),T=Object(s.a)(G,2),F=T[0],H=T[1],W=Object(n.useState)(),K=Object(s.a)(W,2),U=K[0],z=K[1],Q=Object(n.useState)(null),X=Object(s.a)(Q,2),$=X[0],q=X[1];return Object(n.useEffect)((function(){B(a)}),[e.isLoading,a]),Object(n.useEffect)((function(){null!==U&&(B(a.slice().sort((function(e,t){return console.log(e[U]),e[U]>t[U]?-1:e[U]<t[U]?1:0}))),z(null))}),[U,a]),Object(n.useEffect)((function(){if(0!==F.length){for(var e=function(){var e=Object(s.a)(n[t],2),l=e[0],r=e[1];B(a.filter((function(e){return e[l].includes(r)})))},t=0,n=Object.entries(F);t<n.length;t++)e();H([])}}),[F,a]),e.isLoading?l.a.createElement("div",{className:"loading"},l.a.createElement("div",null,"\u6b63\u5728\u52a0\u8f7d......")):e.loadError?l.a.createElement(S.a,{variant:"danger"},"\u756a\u5267\u8bc4\u5206\u52a0\u8f7d\u5931\u8d25\uff01"):l.a.createElement("div",{id:"table-wrapper"},l.a.createElement(L.a,{centered:!0,size:"lg",show:d,onHide:function(){return E(!1)}},l.a.createElement(L.a.Header,null,l.a.createElement(L.a.Title,null,"\u7b80\u4ecb")),l.a.createElement(L.a.Body,null,l.a.createElement(A,{description:i})),l.a.createElement(L.a.Footer,null,l.a.createElement(C.a,{className:"pink-button"},"\u7f16\u8f91"),l.a.createElement(C.a,{className:"pink-button",onClick:function(){return E(!1)}},"\u5173\u95ed"))),l.a.createElement(L.a,{centered:!0,size:"lg",show:v,onHide:function(){return g(!1)}},l.a.createElement(L.a.Header,{closeButton:!0},l.a.createElement(L.a.Title,null,_?"\u6dfb\u52a0\u65b0\u756a\u5267":"\u7f16\u8f91\u756a\u5267")),l.a.createElement(L.a.Body,null,l.a.createElement(J,{onSubmitOrEdit:function(t,a){_?(t.preventDefault(),e.onAnimeSubmit(t,null,!0),g(!1)):(t.preventDefault(),e.onAnimeSubmit(t,a,!1),g(!1))},oldValue:$,id:k}))),l.a.createElement("div",{className:"button-group"},l.a.createElement(C.a,{className:"pink-button",onClick:function(){q(null),N(null),g(!0),O(!0)}},"\u6dfb\u52a0"),l.a.createElement(C.a,{className:"pink-button",onClick:e.refresh},"\u5237\u65b0")),l.a.createElement("div",null,l.a.createElement(V.a,{striped:!0,borderless:!0,hover:!0,size:"sm",variant:"light",id:"table"},l.a.createElement("thead",null,l.a.createElement("tr",{className:"table-headers"},["\u540d\u79f0","\u96c6\u6570","\u72b6\u6001","\u5206\u7c7b","\u5267\u60c5","\u4f5c\u753b","\u97f3\u4e50","\u60c5\u6000","\u8bc4\u5206","\u9996\u6b21\u89c2\u770b\u65e5\u671f","\u89c2\u770b\u6b21\u6570",""].map((function(e){return"\u540d\u79f0"===e||"\u5206\u7c7b"===e||"\u72b6\u6001"===e?l.a.createElement(M,{header:e,filter:function(t){var a={};for(var n in F)a[n]=F[n];a[P(e)]=t.target.value,H(a)},clearFilter:function(){H({}),B(a)}}):""!==e?l.a.createElement(R,{header:e,sort:function(){return z(P(e))}}):l.a.createElement("th",null)})))),l.a.createElement("tbody",null,I.map((function(e){return l.a.createElement("tr",{key:e.name},l.a.createElement("td",{className:"clickable",onClick:function(t){o({name:e.name,douban:e.douban,year:e.year,genre:e.genre,episodes:e.tv_episodes,episode_length:e.episode_length,description:e.description}),E(!0)}},e.name),l.a.createElement("td",null,(n=e.tv_episodes,r=e.movies,void 0===n||void 0===r?"":0===n?"\u5267\u573a\u7248\xd7".concat(r):0===r?"".concat(n,"\u96c6"):"".concat(n,"\u96c6+\u5267\u573a\u7248\xd7").concat(r))),l.a.createElement("td",null,e.status),l.a.createElement("td",null,e.genre),l.a.createElement("td",null,e.story),l.a.createElement("td",null,e.illustration),l.a.createElement("td",null,e.music),l.a.createElement("td",null,e.passion),l.a.createElement("td",null,e.rating),l.a.createElement("td",null,(t=e.start_date,a=e.end_date,t.isValid()?a.isValid()?"".concat(t.format("YYYY-MM-DD")," \u81f3 ").concat(a.format("YYYY-MM-DD")):"".concat(t.format("YYYY-MM-DD"),"\u81f3\u4eca"):"")),l.a.createElement("td",null,e.times_watched),l.a.createElement("td",{className:"clickable",onClick:function(){N(e.id),q({name:e.name,year:e.year,douban:e.douban,tv_episodes:e.tv_episodes,movies:e.movies,episode_length:e.episode_length,status:e.status,genre:e.genre,story:e.story,illustration:e.illustration,music:e.music,passion:e.passion,start_date:e.start_date.format("YYYY-MM-DD"),end_date:e.end_date.format("YYYY-MM-DD"),times_watched:e.times_watched}),O(!1),g(!0)}},l.a.createElement(D.a,null)));var t,a,n,r}))))))},G=(a(751),a(373)),T=a(85),F=a(233),H=a.n(F);var W=function(){var e=Object(n.useState)(!0),t=Object(s.a)(e,2),a=t[0],r=t[1],c=Object(n.useState)(!1),i=Object(s.a)(c,2),m=i[0],d=i[1],f=Object(n.useState)([]),b=Object(s.a)(f,2),v=b[0],g=b[1],h=Object(n.useState)({"Anime 1":{name:"Anime 1",episodes:42,status:"\u5df2\u770b",genre:"\u604b\u7231",description:"This is a description the anime."}}),y=Object(s.a)(h,2),_=y[0],w=(y[1],function(){var e=Object(u.a)(o.a.mark((function e(){var t,a;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r(!0),t=O.a.Object.extend("Ratings"),(a=new O.a.Query(t)).limit(1e3),a.find().then((function(e){console.log("calling server"),"undefined"!==typeof document&&(g(e.map((function(e){return{id:e.id,name:e.get("name"),year:e.get("year"),douban:e.get("douban"),tv_episodes:e.get("tv_episodes"),movies:e.get("movies"),episode_length:e.get("episode_length"),status:e.get("status"),genre:e.get("genre"),description:e.get("description"),story:e.get("story"),illustration:e.get("illustration"),music:e.get("music"),passion:e.get("passion"),rating:Number((e.get("story")+e.get("illustration")+e.get("music")+e.get("passion")).toFixed(1)),start_date:H()(e.get("start_date"),"YYYY-MM-DD"),end_date:H()(e.get("end_date"),"YYYY-MM-DD"),times_watched:e.get("times_watched")}}))),r(!1))}),(function(e){r(!1),d(!0),"undefined"!==typeof document&&document.write("Error while fetching ParseObjects: ".concat(JSON.stringify(e))),console.error("Error while fetching ParseObjects",e)}));case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()),j=function(){var e=Object(u.a)(o.a.mark((function e(t){var a,n,l,r,c,i,u;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(a=O.a.Object.extend("Ratings"),n=new a,console.log(t),l=0,r=Object.entries(t);l<r.length;l++)c=Object(s.a)(r[l],2),i=c[0],u=c[1],n.set(i,u);n.save().then((function(e){console.log(e),alert("\u5df2\u63d0\u4ea4\u66f4\u65b0\uff01"),w()}),(function(e){console.log(e),alert("\u66f4\u65b0\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")}));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),k=function(){var e=Object(u.a)(o.a.mark((function e(t,a){var n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log(a),console.log(t),n=O.a.Object.extend("Ratings"),new O.a.Query(n).get(t).then((function(e){for(var t=0,n=Object.entries(a);t<n.length;t++){var l=Object(s.a)(n[t],2),r=l[0],c=l[1];console.log("here"),e.set(r,c)}e.save().then((function(e){console.log(e),alert("\u5df2\u63d0\u4ea4\u66f4\u65b0\uff01"),w()}),(function(e){console.log(e),alert("\u66f4\u65b0\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")}))}));case 5:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}();return Object(n.useEffect)((function(){w()}),[]),l.a.createElement("div",null,l.a.createElement("div",{className:"App"},l.a.createElement(E,null),l.a.createElement(G.a,null,l.a.createElement(T.c,null,l.a.createElement(p.Provider,{value:{ratings:v,descriptions:_}},l.a.createElement(T.a,{path:"/list"},l.a.createElement(B,{isLoading:a,loadError:m,refresh:w,onAnimeSubmit:function(e,t,a){e.preventDefault();var n=e.target.elements,l={name:n.name.value,year:n.year.value,douban:Number(n.douban.value),tv_episodes:Number(n.tv_episodes.value),movies:Number(n.movies.value),episode_length:Number(n.episode_length.value),status:n.status.value,genre:n.genre.value,description:n.description.value,story:Number(n.story.value),illustration:Number(n.illustration.value),music:Number(n.music.value),passion:Number(n.passion.value),start_date:n.start_date.value,end_date:n.end_date.value,times_watched:Number(n.times_watched.value)};a?j(l):k(t,l)}})),l.a.createElement(T.a,{path:"/today"}),l.a.createElement(T.a,{path:"/calendar"}))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(W,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[378,1,2]]]);
//# sourceMappingURL=main.23d0f891.chunk.js.map