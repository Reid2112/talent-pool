import{c as o,r as h,j as e,Z as i,L as d,$ as m,o as x}from"./index-D4qMn36F.js";/**
 * @license lucide-react v0.439.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=o("Delete",[["path",{d:"M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z",key:"1yo7s0"}],["path",{d:"m12 9 6 6",key:"anjzzh"}],["path",{d:"m18 9-6 6",key:"1fp51s"}]]);/**
 * @license lucide-react v0.439.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=o("Fingerprint",[["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M2 12a10 10 0 0 1 18-6",key:"ydlgp0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",key:"1tidbn"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2",key:"1fr1j5"}]]);/**
 * @license lucide-react v0.439.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=o("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);function g({onSubmit:r}){const[a,n]=h.useState(""),c=s=>{if(a.length>=i.pinLength)return;const t=a+s;n(t),t.length===i.pinLength&&(r(t),setTimeout(()=>n(""),200))},l=()=>n(s=>s.slice(0,-1));return e.jsxs("div",{className:"flex flex-col items-center gap-8",children:[e.jsx("div",{className:"flex gap-3.5",children:Array.from({length:i.pinLength}).map((s,t)=>e.jsx("span",{className:`h-3.5 w-3.5 rounded-full border ${t<a.length?"border-blue-600 bg-blue-600":"border-slate-300 bg-white"}`},t))}),e.jsxs("div",{className:"grid grid-cols-3 gap-3",children:[["1","2","3","4","5","6","7","8","9","","0"].map((s,t)=>s===""?e.jsx("span",{},t):e.jsx("button",{onClick:()=>c(s),className:"flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl font-medium text-slate-900 active:bg-slate-200",children:s},t)),e.jsx("button",{onClick:l,className:"flex h-14 w-14 items-center justify-center rounded-full text-slate-500 active:bg-slate-100",children:e.jsx(u,{size:22})})]})]})}function k(){const r=d(t=>t.unlock),a=d(t=>t.unlockWithBiometric),[n,c]=h.useState(""),l=async t=>{c(""),await r(t)||c("PIN 码错误，请重试")},s=async()=>{await a()||x.error("指纹验证失败")};return e.jsxs("div",{className:"flex h-screen flex-col items-center justify-center gap-7 bg-slate-50 px-6",children:[e.jsx("div",{className:"flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50",children:e.jsx(f,{size:32,className:"text-blue-600"})}),e.jsxs("div",{className:"space-y-1 text-center",children:[e.jsx("h1",{className:"text-xl font-bold text-slate-900",children:"已锁定"}),e.jsx("p",{className:"text-sm text-slate-500",children:"请输入 6 位 PIN 码解锁"}),n&&e.jsx("p",{className:"text-sm text-red-600",children:n})]}),e.jsx(g,{onSubmit:l}),m()&&e.jsxs("button",{onClick:s,className:"flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-blue-600",children:[e.jsx(p,{size:20}),"使用指纹解锁"]}),e.jsx("button",{onClick:()=>{confirm(`本应用数据仅存储在您的设备上，无服务端可重置密码。

如需清除 PIN 码，请在浏览器设置中清除本站点数据（localStorage + IndexedDB）。

注意：这将同时删除所有候选人数据。`)&&x.error("请在浏览器设置 → 隐私与安全 → 站点数据中清除本应用数据")},className:"text-xs text-slate-400 underline",children:"忘记密码？"})]})}function b(){return e.jsx(k,{})}export{b as LockPage};
