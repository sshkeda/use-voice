# use-voice

[use-voice](https://use-voice.com) is a developer-oriented open-source platform for building voice AI chatbots. It abstracts away the complexities of creating speech-to-speech pipelines, allowing you to focus on building the best voice AI applications.

## Features

- **No-Code Provider Swapping**: Easily switch between different STT, LLM, and TTS providers without writing any code.
- **Built-in Testing Environment**: Test your voice chatbot directly within the platform.
- **Rapid Deployment**: Add your chatbot to your website with just an access token and three lines of code.
- **Usage Analytics**: Access usage history and track chatbot and user interactions.
- **Optimized Performance**: Leverages streaming and [LiveKit WebRTC](https://docs.livekit.io/agents/overview/) to minimize latency.

## Getting started

First, create a [chatbot](https://use-voice.com/chatbots). You will need an account to do this. Sign up [here](https://use-voice.com/signup).

In the chatbot dashboard, complete all the required **config** fields. This is where you define your chatbot's pipeline and behavior. Then, generate a public access token in the **deploy** tab.

Next, add the [use-voice NPM package](https://www.npmjs.com/package/use-voice) to your project.

```bash
pnpm add use-voice
```

Finally, import use-voice and run `start`. Done!

```tsx
import { useVoice } from "use-voice";

export default function Example() {
  const { start } = useVoice({
    accessToken: "INSERT CHATBOT PUBLIC ACCESS TOKEN HERE",
  });

  return <button onClick={start}>start</button>;
}
```

## Providers

use-voice chatbots operate as speech-to-speech pipelines:

1. **Speech-to-Text (STT)**: Converts user's speech input into text.
2. **Large-Language-Model (LLM)**: Uses the transcription as input for a large language model to generate the chatbot's response.
3. **Text-to-Speech (TTS)**: Transforms the generated text response back into audio for the user.

use-voice currently supports 10 providers:

| Type | Company    | Model                                                                                      |
| ---- | ---------- | ------------------------------------------------------------------------------------------ |
| STT  | Deepgram   | [Nova-2](https://deepgram.com/learn/nova-2-speech-to-text-api)                             |
| LLM  | OpenAI     | [GPT-4o](https://openai.com/index/hello-gpt-4o/)                                           |
| LLM  | OpenAI     | [GPT-4o mini](https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/) |
| LLM  | Anthropic  | [Claude 3.5 Sonnet](https://www.anthropic.com/news/claude-3-5-sonnet)                      |
| LLM  | Anthropic  | [Claude 3 Haiku](https://www.anthropic.com/news/claude-3-haiku)                            |
| TTS  | ElevenLabs | [Turbo v2.5](https://elevenlabs.io/blog/introducing-turbo-v2-5)                            |
| TTS  | ElevenLabs | [Multilingual v2](https://elevenlabs.io/blog/multilingualv2)                               |
| TTS  | OpenAI     | [tts-1](https://platform.openai.com/docs/models/tts)                                       |
| TTS  | OpenAI     | [tts-1-hd](https://platform.openai.com/docs/models/tts)                                    |
| TTS  | Cartesia   | [Sonic English](https://cartesia.ai/blog/sonic)                                            |
