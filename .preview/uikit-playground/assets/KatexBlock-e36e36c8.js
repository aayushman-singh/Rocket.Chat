import{r as e,j as o}from"./index-a9d45b7b.js";import{k as a}from"./katex-c2839aef.js";const m=({code:r})=>{const t=e.useMemo(()=>a.renderToString(r,{displayMode:!0,macros:{"\\href":"\\@secondoftwo"}}),[r]);return o.jsx("div",{role:"math",style:{overflowX:"auto"},"aria-label":r,dangerouslySetInnerHTML:{__html:t}})};export{m as default};