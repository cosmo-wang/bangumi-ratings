(this["webpackJsonpbangumi-ratings"]=this["webpackJsonpbangumi-ratings"]||[]).push([[0],{174:function(e,t){e.exports={APPLICATION_ID:"54T0X4tWovUBdnRd6EKdW3BrN4WJrpGBEJdwDk9J",JAVASCRIPT_KEY:"WREbi60D2GfVknGhH9Je1GJ931oIhIVkHUXD9u5R",SERVER_URL:"https://parseapi.back4app.com/"}},359:function(e,t,a){},360:function(e,t,a){},364:function(e,t,a){},365:function(e,t,a){},366:function(e,t,a){},367:function(e,t,a){},368:function(e,t,a){},369:function(e,t,a){},370:function(e,t,a){},371:function(e,t,a){},596:function(e,t){},598:function(e,t){},609:function(e,t){},611:function(e,t){},638:function(e,t){},640:function(e,t){},641:function(e,t){},646:function(e,t){},648:function(e,t){},667:function(e,t){},679:function(e,t){},682:function(e,t){},728:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),l=a(116),c=a.n(l),u=(a(359),a(35)),o=a.n(u),i=a(73),s=a(11),m=a(174),d=a(121),f=a(225),E=Object(n.createContext)(null);function p(){return Object(n.useContext)(E)}a(360),a(74);function b(){var e=p(),t=e.authenticated,a=e.setAuthenticating,n=e.handleSignOut;return t?r.a.createElement("div",{id:"user-management"},r.a.createElement("div",{className:"text-button clickable",onClick:n},"\u6ce8\u9500")):r.a.createElement("div",{className:"text-button clickable",onClick:function(){return a(!0)}},"\u767b\u9646")}var v=function(e){return r.a.createElement(f.a,{sticky:"top",expand:"lg",id:"navbar"},r.a.createElement(f.a.Brand,{href:"/"},"\u8ffd\u756a\u8865\u756a"),r.a.createElement(d.a,{className:"mr-auto",activeKey:window.location.pathname},r.a.createElement(d.a.Item,null,r.a.createElement(d.a.Link,{onClick:function(){return e.switchPage("AnimeList")}},"\u6211\u7684\u5217\u8868")),r.a.createElement(d.a.Item,null,r.a.createElement(d.a.Link,{onClick:function(){return e.switchPage("MonthlySummary")}},"\u6bcf\u6708\u603b\u7ed3"))),r.a.createElement(b,null))},g={ratings:[],summaries:{}},h=r.a.createContext(g),y=a(353),O=a(14),j=a(23),_=a(4),w=a(352),N=a(86);function k(e){return r.a.createElement("th",{key:e.header},r.a.createElement("div",{className:"table-header"},r.a.createElement("div",null,e.header),r.a.createElement(N.b,{className:"icon clickable",onClick:e.sort})))}var S=a(118);a(364);function C(e){var t=Object(n.useState)(!1),a=Object(s.a)(t,2),l=a[0],c=a[1];return l?r.a.createElement("div",{className:"filter-box"},r.a.createElement("input",{className:"filter-input-box",placeholder:"\u8f93\u5165......",type:"text",onKeyPress:function(t){"Enter"===t.key&&e.filter(t)}}),r.a.createElement("div",{className:"close-button clickable",onClick:function(){e.clearFilter(),c(!l)}},"\xd7")):r.a.createElement(S.a,{className:"filter-box icon clickable",onClick:function(){return c(!l)}})}a(365);function L(e){return r.a.createElement("th",{key:e.header},r.a.createElement("div",{className:"table-header"},r.a.createElement("div",null,e.header),r.a.createElement(C,{filter:e.filter,clearFilter:e.clearFilter})))}a(366);function x(e){return r.a.createElement("th",{key:e.header},r.a.createElement("select",{id:"status",className:"dropdown-header",name:"status",onChange:function(t){return e.filterStatus(t)}},r.a.createElement("option",{value:"",selected:!0},"\u72b6\u6001"),r.a.createElement("option",{value:"\u60f3\u770b"},"\u60f3\u770b"),r.a.createElement("option",{value:"\u5728\u770b"},"\u5728\u770b"),r.a.createElement("option",{value:"\u5df2\u770b"},"\u5df2\u770b")))}a(367);function Y(e){var t=e.description;return void 0===t||null===t?r.a.createElement("p",null,"\u6682\u65e0\u7b80\u4ecb"):r.a.createElement("div",{className:"description"},r.a.createElement("div",null,r.a.createElement("h1",null,t.name,r.a.createElement("a",{href:"https://www.douban.com/search?q="+t.name,target:"_blank",rel:"noopener noreferrer"},r.a.createElement(S.a,{className:"icon clickable"}))),r.a.createElement("p",null,"\u8c46\u74e3\u8bc4\u5206\uff1a",t.douban),r.a.createElement("p",null,"\u5e74\u4efd\uff1a",t.year),r.a.createElement("p",null,"\u5206\u7c7b\uff1a",t.genre),r.a.createElement("p",null,"\u96c6\u6570\uff1a",t.episodes),r.a.createElement("p",null,"\u5355\u96c6\u7247\u957f\uff1a",t.episode_length),r.a.createElement("p",null,"\u7b80\u4ecb\uff1a",t.description)))}var I=a(26);a(368);function V(e){var t=void 0===e.oldValue||null===e.oldValue?{}:e.oldValue;return r.a.createElement(_.a,{onSubmit:function(t){e.onSubmitOrEdit(t,e.id)}},r.a.createElement(_.a.Group,{controlId:"name"},r.a.createElement(_.a.Label,null,"\u540d\u79f0"),r.a.createElement(_.a.Control,{defaultValue:t.name,type:"input"})),r.a.createElement(_.a.Group,null,r.a.createElement(_.a.Row,{className:"input-row"},r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u8c46\u74e3\u8bc4\u5206",r.a.createElement("a",{href:"https://www.douban.com",target:"_blank",rel:"noopener noreferrer"},r.a.createElement(S.a,{className:"icon clickable"}))),r.a.createElement(_.a.Control,{defaultValue:t.douban,id:"douban",type:"input"})),r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u5e74\u4efd"),r.a.createElement(_.a.Control,{defaultValue:t.year,id:"year",type:"input"})),r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u72b6\u6001"),r.a.createElement(_.a.Control,{defaultValue:t.status,id:"status",type:"input"}))),r.a.createElement(_.a.Row,{className:"input-row"},r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u5206\u7c7b"),r.a.createElement(_.a.Control,{defaultValue:t.genre,id:"genre",type:"input"})),r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"TV\u96c6\u6570"),r.a.createElement(_.a.Control,{defaultValue:t.tv_episodes,id:"tv_episodes",type:"input"})),r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u5267\u573a\u7248"),r.a.createElement(_.a.Control,{defaultValue:t.movies,id:"movies",type:"input"})),r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u5355\u96c6\u7247\u957f"),r.a.createElement(_.a.Control,{defaultValue:t.episode_length,id:"episode_length",type:"input"})))),r.a.createElement(_.a.Group,null,r.a.createElement(_.a.Label,null,"\u7b80\u4ecb"),r.a.createElement(_.a.Control,{defaultValue:t.description,id:"description",as:"textarea",rows:"3"})),r.a.createElement(_.a.Group,null,r.a.createElement(_.a.Row,{className:"input-row"},r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u5267\u60c5\u8bc4\u5206"),r.a.createElement(_.a.Control,{defaultValue:t.story,id:"story",type:"input"})),r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u4f5c\u753b\u8bc4\u5206"),r.a.createElement(_.a.Control,{defaultValue:t.story,id:"illustration",type:"input"})),r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u97f3\u4e50\u8bc4\u5206"),r.a.createElement(_.a.Control,{defaultValue:t.music,id:"music",type:"input"})),r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u60c5\u6000\u8bc4\u5206"),r.a.createElement(_.a.Control,{defaultValue:t.passion,id:"passion",type:"input"})))),r.a.createElement(_.a.Group,null,r.a.createElement(_.a.Row,{className:"input-row"},r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u5f00\u59cb\u89c2\u770b\u65e5\u671f"),r.a.createElement(_.a.Control,{defaultValue:t.start_date,id:"start_date",type:"input"})),r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u7ed3\u675f\u89c2\u770b\u65e5\u671f"),r.a.createElement(_.a.Control,{defaultValue:t.end_date,id:"end_date",type:"input"})),r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u89c2\u770b\u6b21\u6570"),r.a.createElement(_.a.Control,{defaultValue:t.times_watched,id:"times_watched",type:"input"})))),r.a.createElement(j.a,{className:"pink-button",type:"submit"},"\u63d0\u4ea4"))}function M(e){return isNaN(e)?"-":e>=60?Math.round(e/60*10)/10+" \u5c0f\u65f6":Math.round(10*e)/10+" \u5206\u949f"}function Q(e){var t=e.end_date.diff(e.start_date,"days")+1,a=void 0===e.episode_length||0===e.episode_length?24:e.episode_length;return(e.tv_episodes*a+90*e.movies)/t}function D(e){switch(e){case"\u540d\u79f0":return"name";case"\u96c6\u6570":return"tv_episodes";case"\u72b6\u6001":return"status";case"\u5206\u7c7b":return"genre";case"\u5267\u60c5":return"story";case"\u4f5c\u753b":return"illustration";case"\u97f3\u4e50":return"music";case"\u60c5\u6000":return"passion";case"\u8bc4\u5206":return"rating";case"\u9996\u6b21\u89c2\u770b\u65e5\u671f":return"end_date";case"\u89c2\u770b\u6b21\u6570":return"times_watched";case"\u5e74\u4efd":return"year";case"\u8c46\u74e3\u8bc4\u5206":return"douban";case"\u65e5\u5747\u65f6\u957f":return"daily_time";default:return"unknown"}}function A(e,t){return e.slice().sort((function(e,a){var n="daily_time"===t?Q(e):e[t],r="daily_time"===t?Q(a):a[t];return"start_date"===t?n.isValid()?r.isValid()?q(n,r):-1:1:q(n,r)}))}function q(e,t){return e>t?-1:e<t?1:0}a(369);var R=function(e){var t=p().authenticated,a=r.a.useContext(h).ratings,l=["\u5e8f\u53f7","\u540d\u79f0","\u96c6\u6570","\u5206\u7c7b","\u5267\u60c5","\u4f5c\u753b","\u97f3\u4e50","\u60c5\u6000","\u8bc4\u5206","\u9996\u6b21\u89c2\u770b\u65e5\u671f","\u65e5\u5747\u65f6\u957f",""],c=["\u5e8f\u53f7","\u540d\u79f0","\u96c6\u6570","\u5206\u7c7b","\u5e74\u4efd","\u8c46\u74e3\u8bc4\u5206","\u7b80\u4ecb",""],u=Object(n.useState)(null),o=Object(s.a)(u,2),i=o[0],m=o[1],d=Object(n.useState)(!1),f=Object(s.a)(d,2),E=f[0],b=f[1],v=Object(n.useState)(!1),g=Object(s.a)(v,2),S=g[0],C=g[1],I=Object(n.useState)(!1),q=Object(s.a)(I,2),R=q[0],B=q[1],F=Object(n.useState)(!1),T=Object(s.a)(F,2),H=T[0],P=T[1],G=Object(n.useState)(!1),z=Object(s.a)(G,2),J=z[0],U=z[1],W=Object(n.useState)(!1),K=Object(s.a)(W,2),X=K[0],$=K[1],Z=Object(n.useState)({}),ee=Object(s.a)(Z,2),te=ee[0],ae=ee[1],ne=Object(n.useState)(),re=Object(s.a)(ne,2),le=re[0],ce=re[1],ue=Object(n.useState)("\u5df2\u770b"),oe=Object(s.a)(ue,2),ie=oe[0],se=oe[1],me=Object(n.useState)(a),de=Object(s.a)(me,2),fe=de[0],Ee=de[1],pe=Object(n.useState)(l),be=Object(s.a)(pe,2),ve=be[0],ge=be[1],he=Object(n.useState)({}),ye=Object(s.a)(he,2),Oe=ye[0],je=ye[1],_e=Object(n.useState)(),we=Object(s.a)(_e,2),Ne=we[0],ke=we[1],Se=Object(n.useState)(null),Ce=Object(s.a)(Se,2),Le=Ce[0],xe=Ce[1];Object(n.useEffect)((function(){ke("end_date")}),[]),Object(n.useEffect)((function(){je([]),Ee(A(a.filter((function(e){return e.status===ie})),"end_date"))}),[e.isLoading,a,ie]),Object(n.useEffect)((function(){null!==Ne&&(Ee(A(a.filter((function(e){return e.status===ie})),Ne)),ke(null))}),[Ne,a,ie]),Object(n.useEffect)((function(){if(0!==Oe.length){for(var e=function(){var e=Object(s.a)(n[t],2),r=e[0],l=e[1];Ee(a.filter((function(e){return e[r].includes(l)&&e.status===ie})))},t=0,n=Object.entries(Oe);t<n.length;t++)e();je([])}}),[a,Oe,ie]);var Ye=function(e){var t=e.target.innerHTML;ge("\u60f3\u770b"===t?c:l),se(t)};return e.isLoading?r.a.createElement("div",{className:"loading"},r.a.createElement("div",null,"\u6b63\u5728\u52a0\u8f7d......")):e.loadError?r.a.createElement(w.a,{variant:"danger"},"\u756a\u5267\u8bc4\u5206\u52a0\u8f7d\u5931\u8d25\uff01"):r.a.createElement("div",{className:"main-element"},r.a.createElement(O.a,{centered:!0,size:"lg",show:E,onHide:function(){return b(!1)}},r.a.createElement(O.a.Header,null,r.a.createElement(O.a.Title,null,"\u7b80\u4ecb")),r.a.createElement(O.a.Body,null,r.a.createElement(Y,{description:i})),r.a.createElement(O.a.Footer,null,r.a.createElement(j.a,{className:"pink-button",onClick:function(){return b(!1)}},"\u5173\u95ed"))),r.a.createElement(O.a,{centered:!0,size:"lg",show:S,onHide:function(){return C(!1)}},r.a.createElement(O.a.Header,{closeButton:!0},r.a.createElement(O.a.Title,null,J?"\u6dfb\u52a0\u65b0\u756a\u5267":"\u7f16\u8f91\u756a\u5267")),r.a.createElement(O.a.Body,null,r.a.createElement(V,{onSubmitOrEdit:function(t,a){t.preventDefault(),J||X?e.onAnimeSubmit(t,null,!0):e.onAnimeSubmit(t,a,!1),C(!1)},oldValue:Le,id:le}))),r.a.createElement(O.a,{centered:!0,size:"lg",show:R,onHide:function(){return B(!1)}},r.a.createElement(O.a.Header,{closeButton:!0},r.a.createElement(O.a.Title,null,"\u6dfb\u52a0\u65b0\u756a\u5267")),r.a.createElement(O.a.Body,null,r.a.createElement(_.a,{onSubmit:function(e){e.preventDefault();var t=function(e){var t=e.split("\n")[5].split(" ")[0],a=e.split("\u9996\u64ad: ")[1].split("-")[0],n=e.split("\u8c46\u74e3\u8bc4\u5206")[1].split("\n")[1],r=12;try{r=parseInt(e.split("\u96c6\u6570: ")[1].split("-")[0])}catch(u){console.error(u)}var l=24;try{l=parseInt(e.split("\u5355\u96c6\u7247\u957f: ")[1].split("-")[0])}catch(u){console.error(u)}var c=e.split("\u7684\u5267\u60c5\u7b80\u4ecb \xb7 \xb7 \xb7 \xb7 \xb7 \xb7")[1].split("\n\n")[1].trim();return{name:t,year:a,douban:n,tv_episodes:isNaN(r)?0:r,episode_length:isNaN(l)?12:l,description:c}}(e.target.elements.html.value);xe({name:t.name,year:t.year,douban:t.douban,tv_episodes:t.tv_episodes,movies:0,episode_length:t.episode_length,status:"\u60f3\u770b",genre:"",description:t.description,story:0,illustration:0,music:0,passion:0,start_date:null,end_date:null,times_watched:0}),$(!0),B(!1),ce(null),C(!0)}},r.a.createElement(_.a.Group,null,r.a.createElement(_.a.Label,null,"\u8c46\u74e3\u9875\u9762\u6e90"),r.a.createElement(_.a.Control,{id:"html",as:"textarea",rows:"10"})),r.a.createElement(j.a,{className:"pink-button",type:"submit"},"\u63d0\u4ea4")))),r.a.createElement(O.a,{centered:!0,size:"sm",show:H,onHide:function(){return P(!1)}},r.a.createElement(O.a.Header,{closeButton:!0},r.a.createElement(O.a.Title,null,"\u5220\u9664\u756a\u5267")),r.a.createElement(O.a.Body,null,r.a.createElement("p",null,"\u786e\u5b9a\u8981\u5220\u9664\u756a\u5267\u201c".concat(te.name,"\u201d\u5417"))),r.a.createElement(O.a.Footer,null,r.a.createElement(j.a,{variant:"primary",onClick:function(){ae({}),P(!1)}},"\u53d6\u6d88"),r.a.createElement(j.a,{variant:"danger",onClick:function(){e.deleteAnime(te.id),ae({}),P(!1)}},"\u786e\u5b9a"))),r.a.createElement("div",{className:"button-group"},r.a.createElement("div",null,r.a.createElement(j.a,{className:"pink-button",onClick:Ye},"\u5df2\u770b"),r.a.createElement(j.a,{className:"pink-button",onClick:Ye},"\u5728\u770b"),r.a.createElement(j.a,{className:"pink-button",onClick:Ye},"\u60f3\u770b")),r.a.createElement("div",null,t?r.a.createElement(j.a,{className:"pink-button",onClick:function(){xe(null),ce(null),C(!0),U(!0)}},"\u624b\u52a8\u6dfb\u52a0"):r.a.createElement(r.a.Fragment,null),t?r.a.createElement(j.a,{className:"pink-button",onClick:function(){xe(null),ce(null),B(!0),U(!0)}},"\u81ea\u52a8\u6dfb\u52a0"):r.a.createElement(r.a.Fragment,null),r.a.createElement(j.a,{className:"pink-button",onClick:e.refresh},"\u5237\u65b0"))),r.a.createElement("div",null,r.a.createElement(y.a,{striped:!0,borderless:!0,hover:!0,size:"sm",variant:"light",id:"table"},r.a.createElement("thead",null,r.a.createElement("tr",{className:"table-headers"},ve.map((function(e){return"\u540d\u79f0"===e||"\u5206\u7c7b"===e?r.a.createElement(L,{key:e,header:e,filter:function(t){var a={};for(var n in Oe)a[n]=Oe[n];a[D(e)]=t.target.value,je(a)},clearFilter:function(){je([]),Ee(A(a.filter((function(e){return e.status===ie})),"end_date"))}}):"\u72b6\u6001"===e?r.a.createElement(x,{key:e,header:e,filterStatus:function(e){je({status:e.target.value})}}):""!==e?r.a.createElement(k,{key:e,header:e,sort:function(){return ke(D(e))}}):r.a.createElement("th",{key:e})})))),r.a.createElement("tbody",null,fe.map((function(e,a){return r.a.createElement("tr",{key:e.name},r.a.createElement("td",null,a+1),r.a.createElement("td",{className:"anime-name clickable",onClick:function(t){m({name:e.name,douban:e.douban,year:e.year,genre:e.genre,episodes:e.tv_episodes,episode_length:e.episode_length,description:e.description}),b(!0)}},e.name),r.a.createElement("td",null,(c=e.tv_episodes,u=e.movies,void 0===c||void 0===u?"":0===c?"\u5267\u573a\u7248\xd7".concat(u):0===u?"".concat(c,"\u96c6"):"".concat(c,"\u96c6+\u5267\u573a\u7248\xd7").concat(u))),r.a.createElement("td",null,e.genre),r.a.createElement("td",null,"\u60f3\u770b"===ie?e.year:e.story),r.a.createElement("td",null,"\u60f3\u770b"===ie?e.douban:e.illustration),r.a.createElement("td",null,"\u60f3\u770b"===ie?function(e){if(null!==e&&void 0!==e)return e.substring(0,20)+"......"}(e.description):e.music),"\u60f3\u770b"===ie?"":r.a.createElement("td",null,e.passion),"\u60f3\u770b"===ie?"":r.a.createElement("td",null,e.rating),"\u60f3\u770b"===ie?"":r.a.createElement("td",null,(n=e.start_date,l=e.end_date,n.isValid()?l.isValid()?"".concat(n.format("MM/DD/YY")," \u81f3 ").concat(l.format("MM/DD/YY")):"".concat(n.format("MM/DD/YY"),"\u81f3\u4eca"):"")),"\u60f3\u770b"===ie?"":r.a.createElement("td",null,M(Q(e))),r.a.createElement("td",null," ",t?r.a.createElement(r.a.Fragment,null,r.a.createElement(N.a,{className:"clickable",onClick:function(){ce(e.id),xe({name:e.name,year:e.year,douban:e.douban,tv_episodes:e.tv_episodes,movies:e.movies,episode_length:e.episode_length,status:e.status,genre:e.genre,description:e.description,story:e.story,illustration:e.illustration,music:e.music,passion:e.passion,start_date:e.start_date.format("YYYY-MM-DD"),end_date:e.end_date.format("YYYY-MM-DD"),times_watched:e.times_watched}),U(!1),C(!0)}}),r.a.createElement(N.c,{className:"icon clickable",onClick:function(){ae({name:e.name,id:e.id}),P(!0)}})):r.a.createElement(r.a.Fragment,null)));var n,l,c,u}))))))},B=a(72),F=a.n(B),T=a(354),H=(a(370),Object(n.createContext)(null));function P(){return Object(n.useContext)(H)}function G(e){var t=p().authenticated,a=P(),n=a.setQuoteToEdit,l=a.setShowQuoteModal,c=a.setIsNewQuote,u=a.setActiveQuoteId,o=a.setShowDeleteConfirmation;return r.a.createElement("blockquote",null,r.a.createElement("div",{className:"quote-content"},e.quote.content),r.a.createElement("div",{className:"quote-translation"},e.quote.translation),r.a.createElement("cite",null,e.quote.person+"\u300a"+e.quote.bangumi+"\u300b",t?r.a.createElement(N.a,{className:"icon clickable",onClick:function(){c(!1),n(e.quote),l(!0)}}):r.a.createElement(r.a.Fragment,null),t?r.a.createElement(N.c,{className:"icon clickable",onClick:function(){u(e.quote.id),o(!0)}}):r.a.createElement(r.a.Fragment,null)))}function z(e){var t=p().authenticated,a=P(),n=a.setIsNewQuote,l=a.setQuoteToEdit,c=a.addNewQuote;return r.a.createElement("div",{className:"summary"},r.a.createElement("div",{className:"summary-title"},r.a.createElement("div",{className:"summary-info"},r.a.createElement("div",{className:"year-month"},r.a.createElement("div",{className:"month"},F()(e.month).format("MM")),r.a.createElement("div",{className:"year"},F()(e.month).format("YYYY")),r.a.createElement("div",{className:"yue"},"\u6708")),r.a.createElement("div",{className:"summary-info-pieces"},r.a.createElement("div",{className:"summary-info-piece"},"\u756a\u5267\u603b\u6570\uff1a"+e.summary.bangumi_num),r.a.createElement("div",{className:"summary-info-piece"},"\u603b\u96c6\u6570\uff1a"+e.summary.tv_episode_num),r.a.createElement("div",{className:"summary-info-piece"},"\u603b\u65f6\u957f\uff1a"+M(e.summary.total_time)),r.a.createElement("div",{className:"summary-info-piece"},"\u6bcf\u65e5\u65f6\u957f\uff1a"+M(e.summary.total_time/F()(e.month).daysInMonth())))),r.a.createElement("div",{className:"summary-quotes"},0!==e.summary.quotes.length?r.a.createElement(r.a.Fragment,null,e.summary.quotes.map((function(t){return r.a.createElement(G,{quote:t,setActiveQuoteId:e.setActiveQuoteId})})),t?r.a.createElement(T.a,{className:"clickable add-more-quote-button",onClick:function(){c(e.month),n(!0),l({})}}):r.a.createElement(r.a.Fragment,null)):t?r.a.createElement(j.a,{className:"pink-button add-quote-button",onClick:function(){c(e.month),l({})}},"\u6dfb\u52a0\u8bed\u5f55"):r.a.createElement("div",{className:"add-quote-button"},"\u6682\u65e0\u8bed\u5f55"))),r.a.createElement("div",{className:"summary-names"},e.summary.bangumis.map((function(e){return r.a.createElement("div",{className:"bangumi-name"},"\u2022 "+e)}))))}var J=function(e){var t=Object(n.useContext)(h).summaries,a=Object(n.useState)(!0),l=Object(s.a)(a,2),c=l[0],u=l[1],o=Object(n.useState)(!1),i=Object(s.a)(o,2),m=i[0],d=i[1],f=Object(n.useState)(!1),E=Object(s.a)(f,2),p=E[0],b=E[1],v=Object(n.useState)(),g=Object(s.a)(v,2),y=g[0],w=g[1],N=Object(n.useState)({}),k=Object(s.a)(N,2),S=k[0],C=k[1],L=Object(n.useState)(""),x=Object(s.a)(L,2),Y=x[0],V=x[1],M=function(e){d(!0),V(e)};return r.a.createElement("div",{className:"monthly-summary"},r.a.createElement(O.a,{centered:!0,size:"lg",show:m,onHide:function(){return d(!1)}},r.a.createElement(O.a.Header,{closeButton:!0},r.a.createElement(O.a.Title,null,c?"\u6dfb\u52a0\u65b0\u8bed\u5f55":"\u7f16\u8f91\u8bed\u5f55")),r.a.createElement(O.a.Body,null,r.a.createElement(_.a,{onSubmit:function(t){c?(t.preventDefault(),e.onQuoteSubmit(t,Y,S.id,!0)):(t.preventDefault(),e.onQuoteSubmit(t,S.month,S.id,!1)),d(!1)}},r.a.createElement(_.a.Group,{controlId:"content"},r.a.createElement(_.a.Label,null,"\u8bed\u5f55\u539f\u6587"),r.a.createElement(_.a.Control,{defaultValue:S.content,type:"input",as:"textarea",rows:"3"})),r.a.createElement(_.a.Group,{controlId:"translation"},r.a.createElement(_.a.Label,null,"\u4e2d\u6587\u7ffb\u8bd1"),r.a.createElement(_.a.Control,{defaultValue:S.translation,type:"input",as:"textarea",rows:"3"})),r.a.createElement(_.a.Row,{className:"input-row"},r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u4eba\u7269"),r.a.createElement(_.a.Control,{defaultValue:S.person,id:"person",type:"input"})),r.a.createElement(I.a,null,r.a.createElement(_.a.Label,null,"\u4f5c\u54c1"),r.a.createElement(_.a.Control,{defaultValue:S.bangumi,id:"bangumi",type:"input"}))),r.a.createElement(j.a,{className:"pink-button",type:"submit"},"\u63d0\u4ea4")))),r.a.createElement(O.a,{centered:!0,size:"sm",show:p,onHide:function(){return b(!1)}},r.a.createElement(O.a.Header,{closeButton:!0},r.a.createElement(O.a.Title,null,"\u5220\u9664\u8bed\u5f55")),r.a.createElement(O.a.Body,null,r.a.createElement("p",null,"\u786e\u5b9a\u8981\u5220\u9664\u6b64\u8bed\u5f55\u5417")),r.a.createElement(O.a.Footer,null,r.a.createElement(j.a,{variant:"primary",onClick:function(){w(null),b(!1)}},"\u53d6\u6d88"),r.a.createElement(j.a,{variant:"danger",onClick:function(){e.deleteQuote(y),w(null),b(!1)}},"\u786e\u5b9a"))),Object.keys(t).map((function(e){return r.a.createElement(H.Provider,{value:{setIsNewQuote:u,setShowQuoteModal:d,addNewQuote:M,setQuoteToEdit:C,setActiveQuoteId:w,setShowDeleteConfirmation:b}},r.a.createElement(z,{month:e,summary:t[e]}))})))};a(371);function U(){var e=p(),t=e.username,a=e.password,n=e.setAuthenticating,l=e.setUsername,c=e.setPassword,u=e.handleLogin;return r.a.createElement("div",{className:"Login"},r.a.createElement(_.a,{onSubmit:u},r.a.createElement(_.a.Group,{size:"lg",controlId:"username"},r.a.createElement(_.a.Label,null,"\u7528\u6237\u540d"),r.a.createElement(_.a.Control,{autoFocus:!0,type:"username",value:t,onChange:function(e){return l(e.target.value)}})),r.a.createElement(_.a.Group,{size:"lg",controlId:"password"},r.a.createElement(_.a.Label,null,"\u5bc6\u7801"),r.a.createElement(_.a.Control,{type:"password",value:a,onChange:function(e){return c(e.target.value)}})),r.a.createElement("div",{className:"button-group"},r.a.createElement(j.a,{className:"pink-button",size:"lg",type:"submit",disabled:!(t.length>0&&a.length>0)},"\u767b\u9646"),r.a.createElement(j.a,{className:"pink-button",size:"lg",type:"submit",onClick:function(){return n(!1)}},"\u53d6\u6d88"))))}a(372);var W=a(31),K=a.n(W);K.a.initialize(m.APPLICATION_ID,m.JAVASCRIPT_KEY),K.a.serverURL=m.SERVER_URL;var X=function(){var e=Object(n.useState)(!1),t=Object(s.a)(e,2),a=t[0],l=t[1],c=Object(n.useState)(!1),u=Object(s.a)(c,2),m=u[0],d=u[1],f=Object(n.useState)(""),p=Object(s.a)(f,2),b=p[0],g=p[1],y=Object(n.useState)(""),O=Object(s.a)(y,2),j=O[0],_=O[1],w=Object(n.useState)(function(){var e=sessionStorage.getItem("user");return e?JSON.parse(e):null}()),N=Object(s.a)(w,2),k=N[0],S=N[1],C=Object(n.useState)(sessionStorage.getItem("token")||null),L=Object(s.a)(C,2),x=L[0],Y=L[1],I=Object(n.useState)(!0),V=Object(s.a)(I,2),M=V[0],Q=V[1],D=Object(n.useState)(!1),q=Object(s.a)(D,2),B=q[0],T=q[1],H=Object(n.useState)("AnimeList"),P=Object(s.a)(H,2),G=P[0],z=P[1],W=Object(n.useState)([]),X=Object(s.a)(W,2),$=X[0],Z=X[1],ee=Object(n.useState)({}),te=Object(s.a)(ee,2),ae=te[0],ne=te[1],re=Object(n.useState)([]),le=Object(s.a)(re,2),ce=le[0],ue=le[1],oe=function(){var e=Object(i.a)(o.a.mark((function e(){var t,a;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Q(!0),t=K.a.Object.extend("Ratings"),(a=new K.a.Query(t)).limit(1e3),a.find().then((function(e){if(console.log("calling server for ratings"),"undefined"!==typeof document){var t=e.map((function(e){return{id:e.id,name:e.get("name"),year:e.get("year"),douban:e.get("douban"),tv_episodes:e.get("tv_episodes"),movies:e.get("movies"),episode_length:e.get("episode_length"),status:e.get("status"),genre:e.get("genre"),description:e.get("description"),story:e.get("story"),illustration:e.get("illustration"),music:e.get("music"),passion:e.get("passion"),rating:Number((e.get("story")+e.get("illustration")+e.get("music")+e.get("passion")).toFixed(1)),start_date:F()(e.get("start_date"),"YYYY-MM-DD"),end_date:F()(e.get("end_date"),"YYYY-MM-DD"),times_watched:e.get("times_watched")}}));Z(A(t,"start_date")),Q(!1)}}),(function(e){Q(!1),T(!0),console.error("Error while fetching ratings",e)}));case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),ie=function(){var e=Object(i.a)(o.a.mark((function e(){var t,a;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=K.a.Object.extend("Quotes"),(a=new K.a.Query(t)).limit(1e3),a.find().then((function(e){if(console.log("calling server for quotes"),"undefined"!==typeof document){var t=e.map((function(e){return{id:e.id,month:e.get("month"),content:e.get("content"),translation:e.get("translation"),person:e.get("person"),bangumi:e.get("bangumi")}}));ue(t)}}),(function(e){T(!0),console.error("Error while fetching quotes",e)}));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),se=function(){var e=Object(i.a)(o.a.mark((function e(t){var a,n,r,l,c,u,i;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(a=K.a.Object.extend("Ratings"),n=new a,r=0,l=Object.entries(t);r<l.length;r++)c=Object(s.a)(l[r],2),u=c[0],i=c[1],n.set(u,i);n.save().then((function(e){alert("\u5df2\u63d0\u4ea4\u66f4\u65b0\uff01"),oe()}),(function(e){alert("\u66f4\u65b0\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")}));case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),me=function(){var e=Object(i.a)(o.a.mark((function e(t){var a,n,r,l,c,u,i;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(a=K.a.Object.extend("Quotes"),n=new a,r=0,l=Object.entries(t);r<l.length;r++)c=Object(s.a)(l[r],2),u=c[0],i=c[1],n.set(u,i);n.save().then((function(e){alert("\u5df2\u6dfb\u52a0\u8bed\u5f55\uff01"),ie()}),(function(e){alert("\u6dfb\u52a0\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")}));case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),de=function(){var e=Object(i.a)(o.a.mark((function e(t,a){var n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=K.a.Object.extend("Ratings"),new K.a.Query(n).get(t).then((function(e){for(var t=0,n=Object.entries(a);t<n.length;t++){var r=Object(s.a)(n[t],2),l=r[0],c=r[1];e.set(l,c)}e.save().then((function(e){alert("\u5df2\u63d0\u4ea4\u66f4\u65b0\uff01"),oe()}),(function(e){alert("\u66f4\u65b0\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")}))}));case 3:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),fe=function(){var e=Object(i.a)(o.a.mark((function e(t,a){var n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log(a),n=K.a.Object.extend("Quotes"),new K.a.Query(n).get(t).then((function(e){for(var t=0,n=Object.entries(a);t<n.length;t++){var r=Object(s.a)(n[t],2),l=r[0],c=r[1];e.set(l,c)}e.save().then((function(e){alert("\u5df2\u63d0\u4ea4\u66f4\u65b0\uff01"),ie()}),(function(e){alert("\u66f4\u65b0\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")}))}));case 4:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),Ee=function(){var e=Object(i.a)(o.a.mark((function e(t){var a;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=K.a.Object.extend("Ratings"),new K.a.Query(a).get(t).then((function(e){e.destroy().then((function(e){alert("\u5df2\u5220\u9664\u756a\u5267\uff01"),oe()}),(function(e){alert("\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")}))}));case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),pe=function(){var e=Object(i.a)(o.a.mark((function e(t){var a;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=K.a.Object.extend("Quotes"),new K.a.Query(a).get(t).then((function(e){e.destroy().then((function(e){alert("\u5df2\u5220\u9664\u8bed\u5f55\uff01"),ie()}),(function(e){alert("\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")}))}));case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();Object(n.useEffect)((function(){oe(),ie()}),[]),Object(n.useEffect)((function(){var e={};$.filter((function(e){return"\u5df2\u770b"===e.status})).forEach((function(t){var a=F()(t.end_date).format("YYYY-MM");a in e||(e[a]={bangumi_num:0,tv_episode_num:0,movie_num:0,total_time:0,daily_time:0,bangumis:[],quotes:[]}),e[a].bangumi_num+=1,e[a].bangumis.push(t.name),e[a].tv_episode_num+=t.tv_episodes,e[a].movie_num+=t.movies,e[a].total_time+=t.tv_episodes*t.episode_length+90*t.movies})),ce.forEach((function(t){var a=F()(t.month).format("YYYY-MM");a in e&&e[a].quotes.push(t)})),ne(e)}),[$,ce]),Object(n.useEffect)((function(){null!=k&&null!=x&&l(!0)}),[k,x]);var be=function(e,t,a){e.preventDefault();var n=e.target.elements,r={name:n.name.value,year:n.year.value,douban:Number(n.douban.value),tv_episodes:Number(n.tv_episodes.value),movies:Number(n.movies.value),episode_length:Number(n.episode_length.value),status:n.status.value,genre:n.genre.value,description:n.description.value,story:Number(n.story.value),illustration:Number(n.illustration.value),music:Number(n.music.value),passion:Number(n.passion.value),start_date:n.start_date.value,end_date:n.end_date.value,times_watched:Number(n.times_watched.value)};a?se(r):de(t,r)},ve=function(e,t,a,n){e.preventDefault();var r=e.target.elements,l={month:t,content:r.content.value,translation:r.translation.value,person:r.person.value,bangumi:r.bangumi.value};n?me(l):(console.log("here"),fe(a,l))};return r.a.createElement("div",null,r.a.createElement("div",{className:"App"},r.a.createElement(E.Provider,{value:{username:b,password:j,authenticated:a,setAuthenticating:d,handleLogin:function(e){e.preventDefault(),K.a.User.logIn(b,j).then((function(e){!function(e,t){sessionStorage.setItem("token",t),sessionStorage.setItem("user",JSON.stringify(e))}(e,e.getSessionToken()),alert("\u6b22\u8fce\uff0c"+e.getUsername()),d(!1),l(!0)})).catch((function(e){alert(e.message)}))},handleSignOut:function(){S(null),Y(null),sessionStorage.removeItem("token"),sessionStorage.removeItem("user"),l(!1)},setUsername:g,setPassword:_}},r.a.createElement(v,{switchPage:z}),m?r.a.createElement(U,null):r.a.createElement(h.Provider,{value:{ratings:$,summaries:ae}},function(e){switch(e){case"AnimeList":return r.a.createElement(R,{isLoading:M,loadError:B,refresh:oe,onAnimeSubmit:be,deleteAnime:Ee});case"MonthlySummary":return r.a.createElement(J,{onQuoteSubmit:ve,deleteQuote:pe});default:return r.a.createElement(R,{isLoading:M,loadError:B,refresh:oe,onAnimeSubmit:be,deleteAnime:Ee})}}(G)))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(X,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},74:function(e,t,a){}},[[728,1,2]]]);
//# sourceMappingURL=main.4daea48b.chunk.js.map