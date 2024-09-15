import os
import dataclasses
from dataclasses import dataclass, fields
from dotenv import load_dotenv


@dataclass
class ENV_VARS:
    LIVEKIT_URL: str
    LIVEKIT_API_KEY: str
    LIVEKIT_API_SECRET: str
    USE_VOICE_SECRET: str


def load_env() -> ENV_VARS:
    load_dotenv()

    dict = {}

    for env in fields(ENV_VARS):
        if env.name in os.environ:
            if env.type is bool:
                dict[env.name] = os.environ[env.name] == "True"
            elif env.type is int:
                dict[env.name] = int(os.environ[env.name])
            else:
                dict[env.name] = os.environ[env.name]
        else:
            if isinstance(env.default, dataclasses._MISSING_TYPE):
                raise Exception(f"Missing environment variable: {env.name}.")

    return ENV_VARS(**dict)
