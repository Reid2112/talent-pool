import{c as o,r as x,j as e,Z as i,L as d,m as u,o as m}from"./index-D8HK_Bee.js";/**
 * @license lucide-react v0.439.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=o("Delete",[["path",{d:"M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z",key:"1yo7s0"}],["path",{d:"m12 9 6 6",key:"anjzzh"}],["path",{d:"m18 9-6 6",key:"1fp51s"}]]);/**
 * @license lucide-react v0.439.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=o("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);function p({onSubmit:c}){const[a,n]=x.useState(""),l=t=>{if(a.length>=i.pinLength)return;const s=a+t;n(s),s.length===i.pinLength&&(c(s),setTimeout(()=>n(""),200))},r=()=>n(t=>t.slice(0,-1));return e.jsxs("div",{className:"flex flex-col items-center gap-8",children:[e.jsx("div",{className:"flex gap-3.5",children:Array.from({length:i.pinLength}).map((t,s)=>e.jsx("span",{className:`h-3.5 w-3.5 rounded-full border ${s<a.length?"border-blue-600 bg-blue-600":"border-slate-300 bg-white"}`},s))}),e.jsxs("div",{className:"grid grid-cols-3 gap-3",children:[["1","2","3","4","5","6","7","8","9","","0"].map((t,s)=>t===""?e.jsx("span",{},s):e.jsx("button",{onClick:()=>l(t),className:"flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl font-medium text-slate-900 active:bg-slate-200",children:t},s)),e.jsx("button",{onClick:r,className:"flex h-14 w-14 items-center justify-center rounded-full text-slate-500 active:bg-slate-100",children:e.jsx(h,{size:22})})]})]})}function g(){const c=d(t=>t.unlock),a=u(),[n,l]=x.useState(""),r=async t=>{l(""),await c(t)?a("/",{replace:!0}):l("PIN 码错误，请重试")};return e.jsxs("div",{className:"flex h-screen flex-col items-center justify-center gap-7 bg-slate-50 px-6",children:[e.jsx("div",{className:"flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50",children:e.jsx(f,{size:32,className:"text-blue-600"})}),e.jsxs("div",{className:"space-y-1 text-center",children:[e.jsx("h1",{className:"text-xl font-bold text-slate-900",children:"已锁定"}),e.jsx("p",{className:"text-sm text-slate-500",children:"请输入 6 位 PIN 码解锁"}),n&&e.jsx("p",{className:"text-sm text-red-600",children:n})]}),e.jsx(p,{onSubmit:r}),e.jsx("button",{onClick:()=>{confirm(`本应用数据仅存储在您的设备上，无服务端可重置密码。

如需清除 PIN 码，请在浏览器设置中清除本站点数据（localStorage + IndexedDB）。

注意：这将同时删除所有候选人数据。`)&&m.error("请在浏览器设置 → 隐私与安全 → 站点数据中清除本应用数据")},className:"text-xs text-slate-400 underline",children:"忘记密码？"})]})}function b(){return e.jsx(g,{})}export{b as LockPage};
