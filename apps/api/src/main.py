import asyncio
import json
import time
import requests
from livekit import rtc
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli
from utils import accumulate
from assistant import create_assistant

from env import load_env

env = load_env()


async def entrypoint(ctx: JobContext):
    async def start_chatbot(p: rtc.RemoteParticipant):
        start = time.time()  # TODO: More accurate durations.
        metadata = json.loads(p.metadata)
        assistant = create_assistant(metadata)
        assistant.start(ctx.room)

        greeting = metadata["config"]["tts/greeting"]
        if greeting != "":
            await assistant.say(greeting, allow_interruptions=True)

        chat = rtc.ChatManager(ctx.room)

        def messages():
            return list(
                map(
                    lambda m: {"role": m.role, "content": m.content},
                    filter(lambda m: m.role != "system", assistant.chat_ctx.messages),
                )
            )

        async def send_context():
            await chat.send_message(
                json.dumps({"type": "set-messages", "data": messages()})
            )

        def on_speech_commit(_msg):
            asyncio.create_task(send_context())

        assistant.on("agent_speech_committed", on_speech_commit)
        assistant.on("user_speech_committed", on_speech_commit)

        async def answer_from_text(txt: str):
            assistant.chat_ctx.append(role="user", text=txt)
            stream = assistant.llm.chat(chat_ctx=assistant.chat_ctx)
            response = await accumulate(stream)
            assistant.chat_ctx.append(role="assistant", text=response)
            await send_context()

        @chat.on("message_received")
        def on_chat_received(msg: rtc.ChatMessage):
            if msg.message:
                asyncio.create_task(answer_from_text(msg.message))

        async def keep_alive():
            while True:
                await chat.send_message(json.dumps({"type": "keep-alive"}))
                await asyncio.sleep(2.5)

        keep_alive_task = asyncio.create_task(keep_alive())

        def on_shutdown(*_):
            keep_alive_task.cancel()

            # TODO: Save session in bot.py, not api/save-session.
            requests.post(
                "https://ai-voice-two.vercel.app/api/save-session",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": env.USE_VOICE_SECRET,
                },
                json={
                    "messages": json.dumps(messages()),
                    "accessToken": metadata["accessToken"],
                    "duration": time.time() - start,
                    # TODO: Add a start time.
                },
            )

        ctx.add_shutdown_callback(on_shutdown)
        ctx.room.on("participant_disconnected", on_shutdown)

    ctx.add_participant_entrypoint(entrypoint_fnc=start_chatbot)

    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
