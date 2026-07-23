import{c as i}from"./index-B-8A41T6.js";/**
 * @license lucide-react v0.439.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const r=i("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]),n={RESUME_EXTRACTION:`你是一位资深的猎头顾问助手。请从以下简历内容中提取候选人的结构化信息。

要求：
1. 提取所有能找到的字段，找不到的留空不要编造
2. 技能请分类并评估熟练度（1-5）
3. 行业和细分岗位请使用标准行业术语
4. 对候选人的核心竞争力和擅长领域给出总结

返回 JSON 格式，严格遵循以下结构：
{...Candidate JSON Schema...}

简历内容：
{{resumeText}}`,JD_PARSING:`你是一位资深的猎头顾问。请分析以下岗位 JD，提取关键信息。

要求：
1. 区分必须技能和加分技能
2. 识别隐含的技能需求（例如"高性能计算"可能意味着需要编译优化、系统编程能力）
3. 提取所有关键词用于候选人匹配

返回 JSON 格式。

JD 内容：
{{jdText}}`,SKILL_TRANSFER:`你是技术领域的专家。请分析以下技能之间的关联性和可迁移性。

候选人技能：{{candidateSkill}}
JD 需求技能：{{jdSkill}}

请判断：掌握前者的候选人，是否具备学习或胜任后者的底层能力？关联程度如何？

返回 JSON：
{
  "isTransferable": boolean,
  "weight": 0-1,
  "relationship": "一句话说明关联逻辑",
  "explanation": "详细说明技术上的共通性"
}`,VOICE_TO_CANDIDATE:`你是一位猎头顾问助手。以下是从语音转换来的文本，内容是猎头与候选人或关于候选人的口述记录。

请提取候选人相关信息，以 JSON 格式返回。找不到的字段留空。

语音内容：
{{voiceText}}`,IMAGE_EXTRACTION:`请从这张图片中提取所有可见的文字信息，并识别：
- 如果是名片：提取姓名、职位、公司、联系方式
- 如果是简历照片：提取可见的所有结构化信息
- 如果是活动照片：提取场景、人物、行业线索

返回 JSON。`};function S(e,l){return e.replace(/\{\{(\w+)\}\}/g,(t,a)=>l[a]??"")}export{r as C,n as P,S as f};
