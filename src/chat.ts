import { ChatGPTAPI } from 'chatgpt';
export class Chat {
  private chatAPI: ChatGPTAPI;

  constructor(apikey: string) {
    this.chatAPI = new ChatGPTAPI({
      apiKey: apikey,
      completionParams: {
        model: process.env.MODEL || 'gpt-3.5-turbo',
        temperature: +(process.env.temperature || 0) || 1,
        top_p: +(process.env.top_p || 0) || 1,
      },
    });
  }

  private generatePrompt = (patch: string) => {
	  const lang = process.env.LANGUAGE ? process.env.LANGUAGE.charAt(0).toUpperCase() + process.env.LANGUAGE.slice(1) : '';
	  const answerLanguage = lang === 'English' ? '' : `Answer me in ${lang},`;

    return `Bellow is the code patch, please help me do a brief code review,${answerLanguage} if any bug risk and improvement suggestion are welcome
    ${patch}
    `;
  };

  public codeReview = async (patch: string) => {
    if (!patch) {
      return '';
    }

    console.time('code-review cost');
    const prompt = this.generatePrompt(patch);

    const res = await this.chatAPI.sendMessage(prompt);

    console.timeEnd('code-review cost');
    return res.text;
  };
}
