if (answers.length <= 0) {
    const openai = new OpenAI({
        apiKey: this.configservice.get<string>('OPENAI_API_KEY')
    })
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: "answer within 200 words without using coding terms."}, 
            {role: "user", content: question.defaultQuestion}
        ],
            temperature: 0.8,
            max_tokens: 64,
            top_p: 1,
    });
    return this.answerReposiotry.save({
        questionId: questionId,
        defaultAnswer: completion.choices[0].message.content,
        userId: 1
    })
}