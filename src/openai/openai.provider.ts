//인스턴스 생성
const openai = new OpenAI({
    apiKey: this.configservice.get<string>('OPENAI_API_KEY'),
});

//completion 챗 생성
const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'system', content: '요구사항' },
        { role: 'user', content: '질문' },
    ],
    //세부사항, 정밀도, 토큰 제한, 등등
    temperature: 0.8,
    max_tokens: 64,
    top_p: 1,
});
