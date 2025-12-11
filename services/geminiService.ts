import { JobFormData, AnalysisResult } from "../types";

// 这是一个通用的 AI 调用服务，目前针对 Kimi (Moonshot AI) 进行了优化
// 文档: https://platform.moonshot.cn/docs/api/chat-completion

export const analyzeJob = async (data: JobFormData): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  const baseUrl = process.env.API_BASE_URL || "https://api.moonshot.cn/v1";
  const model = process.env.API_MODEL || "moonshot-v1-8k";

  if (!apiKey) {
    return createErrorResult("系统未检测到 API Key。请在 .env 文件中配置 API_KEY (推荐使用 Kimi API)。");
  }

  const systemPrompt = `你是一位资深职业规划师和犀利的互联网嘴替。请根据用户提供的工作详情和个人背景，计算其"工作性价比"。
  
  必须严格以纯 JSON 格式返回，不要包含 markdown 代码块标记（如 \`\`\`json），不要包含其他废话。
  
  JSON 数据结构要求如下：
  {
    "score": number, // 0-100, 结合各项指标打分
    "tier": string, // 例如：青铜搬砖工, 钻石打工人, 王者合伙人
    "rankTitle": string, // 例如：也就是个混口饭吃, 简直是神仙工作，当然，不只局限于这两个，你可以再细化一下
    "percentile": number, // 0-99, 击败了多少人
    "analysis": string, // 客观理性的评价，400字左右
    "sharpAnalysis": string, // 毒舌、幽默、一针见血的吐槽，像脱口秀演员一样，不要顾及我的面子，使劲骂，狠狠的骂，也要幽默一点
    "pros": string[], // 3-4个核心优势
    "cons": string[], // 3-4个主要劣势
    "radarData": [ // 必须包含以下5个维度的具体数值(0-100)
      { "subject": "薪资待遇", "value": number, "fullMark": 100 },
      { "subject": "工作时长", "value": number, "fullMark": 100 },
      { "subject": "通勤体验", "value": number, "fullMark": 100 },
      { "subject": "城市潜力", "value": number, "fullMark": 100 },
      { "subject": "职业发展", "value": number, "fullMark": 100 }
    ],
    "suggestions": string[] // 3-4条具体建议
  }`;

  const userPrompt = `
    请根据以下信息进行评估：

    【个人画像】
    - 性别: ${data.gender}
    - 年龄: ${data.age} 岁
    - 家庭: ${data.familyStatus}, ${data.spouseStatus}
    - 学历: ${data.education}
    - 工龄: ${data.experience} 年

    【工作背景】
    - 公司: ${data.companyName || "未填写"} (${data.companyType})
    - 岗位: ${data.position}
    - 城市: ${data.city} (${data.areaType})
    
    【薪酬待遇】
    - 月薪: ${data.salary} 元 (${data.months}薪)
    - 福利: ${data.benefits || "普通"}
    - 年假: ${data.vacationDays} 天/年

    【工作强度与环境】
    - 工作时间: 每周 ${data.workDaysPerWeek} 天, 每天 ${data.workHoursPerDay} 小时
    - 通勤(往返): ${data.commuteTime} 分钟
    - 压力指数: ${data.stress}/10
    - 团队氛围: ${data.colleagueEnvironment}
    
    【用户自述槽点/缺点】
    - ${data.jobDrawbacks || "无"} (请重点参考此项进行扣分和吐槽)
  `;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3, // 降低随机性，保证 JSON 格式稳定
        // response_format: { type: "json_object" } // Kimi 部分模型支持，为了兼容性暂不强制开启，靠 Prompt 约束
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from AI");
    }

    // 清理可能存在的 Markdown 代码块标记
    const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
    
    return JSON.parse(cleanContent) as AnalysisResult;

  } catch (error) {
    console.error("AI Service Error:", error);
    return createErrorResult("AI 连接失败或解析错误。请检查 API Key 额度或网络设置。");
  }
};

function createErrorResult(message: string): AnalysisResult {
  return {
    score: 0,
    tier: "系统故障",
    rankTitle: "暂停营业",
    percentile: 0,
    analysis: message,
    sharpAnalysis: "AI 罢工了，可能是被你的工作吓到了（其实是网络问题）。",
    pros: [],
    cons: [],
    suggestions: ["检查 API 配置", "刷新页面重试"],
    radarData: [
      { subject: "薪资待遇", value: 0, fullMark: 100 },
      { subject: "工作时长", value: 0, fullMark: 100 },
      { subject: "通勤体验", value: 0, fullMark: 100 },
      { subject: "城市潜力", value: 0, fullMark: 100 },
      { subject: "职业发展", value: 0, fullMark: 100 },
    ],
  };
}
