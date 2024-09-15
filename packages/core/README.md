# use-voice

[use-voice](https://github.com/sshkeda/use-voice) is a developer-oriented open-source platform for building voice AI chatbots. It abstracts away the complexities of creating speech-to-speech pipelines, allowing you to focus on building the best voice AI applications.

With the use-voice react npm package, you can add a voice chatbot to your website in < 10 lines of code.

## Getting started

First, create a [chatbot](https://use-voice.com/chatbots). You will need an account to do this. Sign up [here](https://use-voice.com/signup).

In the chatbot dashboard, complete all the required **config** fields. This is where you define your chatbot's pipeline and behavior. Then, generate a public access token in the **deploy** tab.

Next, add the use-voice npm package to your project.

```bash
pnpm add use-voice
```

Finally, import use-voice and call `start`. Done!

```tsx
import { useVoice } from "use-voice";

export default function Example() {
  const { start } = useVoice({
    accessToken: "INSERT CHATBOT PUBLIC ACCESS TOKEN HERE",
  });

  return <button onClick={start}>start</button>;
}
```

## Supported Providers

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
