import json
from livekit.agents import llm
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import deepgram, openai, silero, elevenlabs, cartesia, anthropic
from livekit.plugins.elevenlabs import Voice, VoiceSettings
from env import load_env

env = load_env()


def get_stt(config, secrets):
    provider = config["stt/provider"]
    company = provider.split("/")[0]
    model = provider.split("/")[1]

    if company == "Deepgram":
        return deepgram.STT(
            model=model,
            api_key=secrets["stt/Deepgram"],
        )

    else:
        exit(0)


def get_llm(config, secrets):
    provider = config["llm/provider"]
    company = provider.split("/")[0]
    model = provider.split("/")[1]

    if company == "OpenAI":
        return openai.LLM(
            model=model,
            api_key=secrets["llm/OpenAI"],
        )

    elif company == "Anthropic":
        return anthropic.LLM(
            model=model,
            api_key=secrets["llm/Anthropic"],
        )
    elif company == "Custom":
        custom_config = json.loads(secrets[f"llm/{model}"])
        print(custom_config)
        return openai.LLM(
            model=model,
            base_url=custom_config["baseURL"],
            api_key=custom_config["apiKey"],
        )
    else:
        exit(0)


def get_tts(config, secrets):
    provider = config["tts/provider"]
    voice_id = config["tts/voice_id"]
    company = provider.split("/")[0]
    model = provider.split("/")[1]

    if company == "OpenAI":
        return openai.TTS(
            model=model,
            voice=voice_id,
            api_key=secrets["tts/OpenAI"],
        )

    elif company == "ElevenLabs":
        return elevenlabs.TTS(
            model_id=model,
            voice=Voice(
                id=voice_id,
                name="",
                category="",
                settings=VoiceSettings(
                    stability=0.50,
                    similarity_boost=0.75,
                    use_speaker_boost=True,
                ),
            ),
            api_key=secrets["tts/ElevenLabs"],
        )

    elif company == "Cartesia":
        return cartesia.TTS(
            model=model,
            voice=voice_id,
            api_key=secrets["tts/Cartesia"],
        )
    else:
        exit(0)


def get_initial_ctx(config):

    system_message = config["llm/system_message"]

    if system_message == "":
        return llm.ChatContext()
    else:
        return llm.ChatContext().append(
            role="system",
            text=system_message,
        )


def create_assistant(metadata):
    config = metadata["config"]
    secrets = metadata["secrets"]

    stt = get_stt(config, secrets)
    llm = get_llm(config, secrets)
    tts = get_tts(config, secrets)

    initial_ctx = get_initial_ctx(config)

    return VoiceAssistant(
        vad=silero.VAD.load(),
        stt=stt,
        llm=llm,
        tts=tts,
        chat_ctx=initial_ctx,
    )
