const o={RESUME_EXTRACTION:`你是一位资深的猎头顾问助手。请从以下简历内容中提取候选人的结构化信息。

要求：
1. 提取所有能找到的字段，找不到的留空不要编造
2. 技能请分类并评估熟练度（1-5）
3. 行业和细分岗位请使用标准行业术语
4. 对候选人的核心竞争力和擅长领域给出总结

返回 JSON 格式，严格遵循以下结构（找不到的字段用空字符串/空数组/null）：

{
  "name": "姓名（字符串）",
  "gender": "male 或 female 或 other（字符串）",
  "birthYear": 1990,
  "phone": "手机号（字符串）",
  "email": "邮箱（字符串）",
  "wechat": "微信号（字符串）",
  "otherContact": "其他联系方式（字符串）",
  "industry": ["行业1", "行业2"],
  "currentPosition": "当前职位（字符串）",
  "subPositions": ["细分岗位1", "细分岗位2"],
  "yearsOfExperience": 5,
  "currentCompany": "当前公司（字符串）",
  "currentLocation": "现居城市（字符串）",
  "willingToRelocate": true,
  "preferredLocations": ["期望城市1", "期望城市2"],
  "skills": [
    {"name": "React", "level": 5, "category": "framework"},
    {"name": "TypeScript", "level": 4, "category": "programming_language"}
  ],
  "autoTags": ["标签1", "标签2"],
  "previousCompanies": [
    {"name": "公司名", "position": "职位", "startYear": 2020, "endYear": 2023, "description": "工作描述"}
  ],
  "education": [
    {"school": "学校名", "degree": "bachelor", "major": "专业", "startYear": 2014, "endYear": 2018}
  ],
  "keyProjects": [
    {"name": "项目名", "role": "担任角色", "description": "项目描述", "highlights": ["亮点1", "亮点2"], "startDate": "2023-01", "endDate": "2024-06"}
  ],
  "expectedSalary": {"amount": 50000, "months": 14, "type": "monthly"},
  "currentSalary": {"amount": 35000, "months": 13, "type": "monthly"},
  "salaryNegotiable": true,
  "generalNotes": "综合备注（字符串）"
}

注意：
- skills.category 可选值：programming_language, framework, tool, domain_knowledge, soft_skill, other
- skills.level 是数字 1-5，表示熟练度
- education.degree 可选值：associate, bachelor, master, phd, other
- salary.type 可选值：monthly, annual, hourly
- salary.amount 是月薪金额（数字，单位：元）
- previousCompanies 和 education 中的年份是数字
- 所有数组字段至少返回空数组 []，不要返回 null

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

返回 JSON。`};function n(e,a){return e.replace(/\{\{(\w+)\}\}/g,(r,t)=>a[t]??"")}export{o as P,n as f};
