import{n as j,c as M,l as r,g as c,q as P,i,S as N,r as O,t as u,a as ae,k as re,b as C,w as L,F as W,D as ce,x as ie}from"./web.58b2c6e3.js";import{d as z,s as ue,y as F,c as de}from"./alert.13fa34b1.js";import{B,P as pe,j as H,g as me,H as fe,k as ge,l as he,h as be,I as T,c as $e,i as _e,a as xe,b as ve,m as ye}from"./marked.esm.8e30c4d6.js";/* empty css                       */const Se=u('<div class="flex flex-col mb-2"><label for="header-button--action-payload" class="text-xs">Column type</label><select id="header-button--action-payload" name="actionPayload" class="text-xs"><option class="text-xs" value="ordered-number">Ordered number</option><option class="text-xs" value="add-column-before">String</option></select></div>'),we=u('<div class="flex flex-col mb-2"><label for="header-button--swap-payload" class="text-xs">Column to swap</label><select id="header-button--swap-payload" class="text-xs" name="actionPayload"></select></div>'),ke=u('<form><div class="flex flex-col mb-2"><label for="header-button--action" class="text-xs">Select column action</label><select class="text-xs" name="type" id="header-button--action"><option class="text-xs" value="add-column-before">Add column before</option><option class="text-xs" value="add-column-after">Add column after</option><option class="text-xs" value="fill-column">Fill column</option><option class="text-xs" value="swap-column">Swap column</option><option class="text-xs" value="delete-column">Delete column</option></select></div><!#><!/><!#><!/><!#><!/></form>'),Ee=u('<option class="text-xs"></option>');function Ce({columnIndex:t,headers:e}){const[o,d]=M({left:"0px",top:"0px"}),[p,_]=M(!1),[m,n]=M("add-column-after"),b=e.length,f=a=>{a.preventDefault();const s=new FormData(a.currentTarget),l=s.get("type"),$=s.get("actionPayload");switch(l){case"add-column-after":case"add-column-before":case"fill-column":{H({type:l,payload:{columnIndex:t,columnContentType:$}});break}case"swap-column":{H({type:l,payload:{columnIndex:t,targetColumnIndex:Number($)}});break}case"delete-column":H({type:l,payload:{columnIndex:t}})}_(!1)};return[r(B,{variant:"secondary",size:"sm",onClick:a=>{const s=a.currentTarget.getBoundingClientRect();d({left:`${s.left}px`,top:`${s.top+s.height}px`}),_(!0)},children:"Actions"}),r(pe,{isVisible:p,onClose:()=>{_(!1)},popoverStyle:o,get children(){const a=c(ke),s=a.firstChild,l=s.firstChild,$=l.nextSibling,k=$.firstChild,D=k.nextSibling,E=D.nextSibling,g=E.nextSibling,x=g.nextSibling,h=s.nextSibling,[S,y]=P(h.nextSibling),v=S.nextSibling,[R,Z]=P(v.nextSibling),ee=R.nextSibling,[te,ne]=P(ee.nextSibling);return a.addEventListener("submit",f),$.$$input=A=>{n(A.currentTarget.value)},g.disabled=b===1,x.disabled=b===1,i(a,r(N,{get when(){return m()==="add-column-after"||m()==="add-column-before"||m()==="fill-column"},get children(){return c(Se)}}),S,y),i(a,r(N,{get when(){return m()==="swap-column"},get children(){const A=c(we),oe=A.firstChild,se=oe.nextSibling;return i(se,()=>e.map((le,Y)=>Y===t?null:(()=>{const K=c(Ee);return K.value=Y,i(K,()=>le.content.trim()),K})())),A}}),R,Z),i(a,r(B,{type:"submit",variant:"secondary",class:"text-xs",size:"sm",children:"Submit"}),te,ne),O(),a}})]}j(["input"]);const Te=u('<div><!#><!/><table class="sidebar-table"><thead><tr></tr><tr></tr></thead><tbody></tbody></table></div>'),Re=u('<th class="action-header-column"></th>'),Ae=u("<th><input></th>"),G=u("<div>Loading...</div>"),Pe=u("<td><input></td>"),Ie=u("<tr></tr>"),q="ArrowUp",V="ArrowDown",J="ArrowLeft",Q="ArrowRight",Ne="Backspace",De="Enter";function Ke({result:t}){if(t===void 0)return null;const[e,o]=z(t.content.headers),[d,p]=z(t.content.rows);ae(()=>{t&&(o(t.content.headers),p(t.content.rows))}),re(()=>{I(w(0,0))});const _=()=>{const n={rows:d,headers:e,separators:t.content.separators};ge({content:n,rawContent:he(n)}),be(T.PreviewingMarkdown),ue({message:"Successfully applied changes.",type:"info"})},m=n=>{const{colIdx:b,rowIdx:f}=Oe(n.currentTarget.id);if(n.currentTarget.selectionStart===0&&(n.key===q||n.key===J)||n.currentTarget.selectionStart===n.currentTarget.value.length&&(n.key===V||n.key===Q))n.preventDefault(),He({rowIdx:f,colIdx:b,key:n.key});else if(n.key===Ne){const{shouldPreventEvent:a,deletedRowIdx:s,nextFocusedElementId:l}=Me({rows:d,rowIdx:f,colIdx:b});a&&n.preventDefault(),s&&p($=>{const k=[...$];return k.splice(s,1),k}),l&&I(l)}else if(n.key===De)if($e(n))_();else{const s=f+1;p(l=>l.slice(0,s).concat([Array.from(new Array(l[f].length),()=>({content:"",post:l[f][b].post,pre:l[f][b].pre}))]).concat(l.slice(s))),I(w(s,b))}};return(()=>{const n=c(Te),b=n.firstChild,[f,a]=P(b.nextSibling),s=f.nextSibling,l=s.firstChild,$=l.firstChild,k=$.nextSibling,D=l.nextSibling;return i(n,r(B,{variant:"primary",size:"sm",onClick:_,get title(){return me(fe.FinishInspect)},children:"Save changes"}),f,a),i($,()=>e.map((E,g)=>(()=>{const x=c(Re);return i(x,r(Ce,{columnIndex:g,headers:e})),x})())),i(k,()=>e.map((E,g)=>(()=>{const x=c(Ae),h=x.firstChild;return h.$$input=S=>{o(y=>{const v=[...y];return v[g]={...y[g],content:S.currentTarget.value},{...y,headers:v}})},h.$$keydown=m,C(()=>L(h,"id",w(-1,g))),C(()=>h.value=E.content),O(),x})())),i(D,r(W,{each:d,get fallback(){return c(G)},children:(E,g)=>{const x=r(W,{each:E,get fallback(){return c(G)},children:(h,S)=>(()=>{const y=c(Pe),v=y.firstChild;return v.$$input=R=>{p(g(),S(),"content",R.currentTarget.value)},v.$$keydown=m,C(()=>L(v,"id",w(g(),S()))),C(()=>v.value=h.content),O(),y})()});return(()=>{const h=c(Ie);return i(h,x),h})()}})),n})()}function Me({rows:t,rowIdx:e,colIdx:o}){if(e===-1||t.length===1)return{shouldPreventEvent:!1};if(o>0&&t[e][o].content==="")return{shouldPreventEvent:!0,nextFocusedElementId:w(e,o-1)};const d=t[e].every(m=>m.content==="");let p,_;if(d){_=e;const m=e-1;p=w(m,t[m].length-1)}return{shouldPreventEvent:d,nextFocusedElementId:p,deletedRowIdx:_}}function He({key:t,rowIdx:e,colIdx:o}){switch(t){case q:{e--;break}case V:{e++;break}case J:{o--;break}case Q:{o++;break}}I(w(e,o))}const X="--";function Oe(t){const[e,o,d]=t.split(X);return{rowIdx:Number(o),colIdx:Number(d)}}function w(t,e){return["cell",t,e].join(X)}function I(t){const e=document.getElementById(t);e&&e.focus()}j(["keydown","input"]);const Fe=u('<div class="markdown-inspector"></div>');function Be(){const t=F(_e);return(()=>{const e=c(Fe);return i(e,r(Ke,{get result(){return t()}})),e})()}const Ye=u('<p class="segment-subtext"></p>');function Le({children:t,title:e,as:o="h2",class:d}){return[r(ce,{component:o,get class(){return de("segment-heading",d)},children:e}),t&&(()=>{const p=c(Ye);return i(p,t),p})()]}const We=u('<div class="markdown-result"></div>'),U={[T.PreviewingMarkdown]:{title:"Markdown preview",content:'To inspect and edit, select text on the inputs on the left, then choose "Inspect Element".'},[T.InspectingSnippet]:{title:"Snippet inspection",content:'Click the "Save Changes" button to update the Markdown on the left pane based on the updates.'}};function qe(){const t=F(xe),e=F(ve);return[r(Le,{get title(){return U[e()].title},get children(){return U[e()].content}}),r(N,{get when(){return e()===T.PreviewingMarkdown},get children(){const o=c(We);return C(()=>ie(o,ye(t()))),o}}),r(N,{get when(){return e()===T.InspectingSnippet},get children(){return r(Be,{})}})]}export{qe as RightContent};