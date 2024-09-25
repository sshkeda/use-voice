"use client";

import { useState, useRef, useCallback } from "react";
import { Track, Room, RoomEvent } from "livekit-client";
import { useTrackVolume } from "./lib/useTrackVolume";

/**
 * @param {Object} [options]
 * @param {string} [options.accessToken]
 * @param {boolean} [options.joinMuted]
 * @param {number} [options.keepAliveTimeout]
 * @param {(localVolume: number) => void} [options.onLocalAudio]
 * @param {(chatbotVolume: number) => void} [options.onChatbotAudio]
 */

export function useVoice(options = undefined) {
  const cleanup = useCallback(() => {
    roomRef.current?.disconnect();
    roomRef.current?.removeAllListeners();

    setInput("");
    setMessages([]);
    setLocalTrack(null);
    setChatbotTrack(null);
    setIsLoading(false);
    if (keepAliveTimeoutRef.current) {
      clearTimeout(keepAliveTimeoutRef.current);
      keepAliveTimeoutRef.current = null;
    }
    microphoneRef.current?.stop();
    microphoneRef.current = null;
    setMuted(true);
  }, []);

  const err = useCallback(
    (/** @type {string} */ message) => {
      errorRef.current = new Error(message);
      setState("error");
      cleanup();
    },
    [cleanup]
  );

  const onLocalAudioRef = useRef(options?.onLocalAudio);
  const onChatbotAudioRef = useRef(options?.onChatbotAudio);
  onLocalAudioRef.current = options?.onLocalAudio;
  onChatbotAudioRef.current = options?.onChatbotAudio;

  const [messages, setMessages] = useState(
    /** @type {{ role: "assistant" | "user", content: string }[]} */([])
  );
  const [input, setInput] = useState("");

  /** @type {React.MutableRefObject<Room | null>} */
  const roomRef = useRef(null);
  /** @type {React.MutableRefObject<Error | null>} */
  const errorRef = useRef(null);

  const [localTrack, setLocalTrack] = useState(
    /** @type {import("livekit-client").Track | null} */(null)
  );
  const [chatbotTrack, setChatbotTrack] = useState(
    /** @type {import("livekit-client").Track | null} */(null)
  );
  useTrackVolume(onLocalAudioRef, localTrack);
  useTrackVolume(onChatbotAudioRef, chatbotTrack);

  const [isLoading, setIsLoading] = useState(false);

  /** @type {React.MutableRefObject<MediaStreamTrack | null>} */
  const microphoneRef = useRef(null);

  const [state, setState] = useState(
    /** @type {"idle" | "requestingMicrophone" | "creatingRoom" |"joiningRoom" |"connected" | "error"} */(
      "idle"
    )
  );
  const [muted, setMuted] = useState(true);

  const stop = useCallback(() => {
    setState((state) => {
      if (state === "idle") return state;
      cleanup();

      return "idle";
    });
  }, [cleanup]);

  /** @type {React.MutableRefObject<ReturnType<typeof setTimeout> | null>} */
  const keepAliveTimeoutRef = useRef(null);
  const resetKeepAliveTimeout = useCallback(
    (message = "Keep-alive timeout. Connection lost.") => {
      if (keepAliveTimeoutRef.current) {
        clearTimeout(keepAliveTimeoutRef.current);
      }

      keepAliveTimeoutRef.current = setTimeout(
        () => err(message),
        options?.keepAliveTimeout || 5000
      );
    },
    [err, options?.keepAliveTimeout]
  );

  const start = useCallback(async () => {
    const accessToken =
      options?.accessToken || process.env.NEXT_PUBLIC_USE_VOICE_ACCESS_TOKEN;
    if (!accessToken) return err("No access token.");

    errorRef.current = null;
    const joinMuted = options?.joinMuted || false;

    const permission = await navigator.permissions.query({
      name: /** @type {PermissionName} */ ("microphone"),
    });
    if (permission.state !== "granted") {
      setState("requestingMicrophone");
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          autoGainControl: true,
          noiseSuppression: true,
          echoCancellation: true,
        },
      });
      const tracks = mediaStream.getAudioTracks();
      microphoneRef.current = tracks[0];
      microphoneRef.current.enabled = false;
    } catch (error) {
      return err("Microphone error.");
    }

    setState("creatingRoom");
    const response = await fetch("/api/init-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }),
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 400) {
        return err("Missing required config fields.");
      } else if (response.status === 401) {
        return err("Invalid access token.");
      } else if (response.status === 403) {
        return err("Invalid access token.");
      } else {
        return err("Failed to initiate chatbot.");
      }
    }

    const { token, url } = /** @type {{
      token: string;
      url: string;
    }} */ (await response.json());

    const room = new Room();
    roomRef.current = room;
    room
      .on(RoomEvent.DataReceived, (data) => {
        try {
          const message = JSON.parse(
            JSON.parse(new TextDecoder().decode(data)).message
          );

          if (message.type === "set-messages") {
            setIsLoading(false);
            setMessages(message.data);
          } else if (message.type === "keep-alive") {
            resetKeepAliveTimeout();
          }
        } catch (error) {
          err("Failed to parse message.");
        }
      })
      .on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind !== Track.Kind.Audio) return;
        const element = track.attach();
        setChatbotTrack(track);
        document.body.appendChild(element);
      })
      .on(RoomEvent.TrackUnsubscribed, (track) => track.detach())
      .on(RoomEvent.LocalTrackUnpublished, (pub) => pub.track?.detach())
      .on(RoomEvent.LocalTrackPublished, (track) => {
        if (!track.track || track.kind != Track.Kind.Audio) return;
        setLocalTrack(track.track);
      })
      .on(RoomEvent.ParticipantConnected, async () => {
        resetKeepAliveTimeout();
        await room.localParticipant.setMicrophoneEnabled(!joinMuted);
        setState("connected");

        if (!joinMuted) setMuted(false);
      });

    setState("joiningRoom");
    resetKeepAliveTimeout("Join room timeout. Connection lost.");

    await room.connect(url + `?accessToken=${accessToken}`, token);
  }, [err, options?.joinMuted, resetKeepAliveTimeout, options?.accessToken]);

  return {
    start,
    stop,
    state,
    muted,
    /** Toggle microphone mute */
    toggleMute: useCallback(async () => {
      const audioOn = roomRef.current?.localParticipant.isMicrophoneEnabled;
      if (audioOn === undefined) return;
      setMuted(audioOn);
      await roomRef.current?.localParticipant.setMicrophoneEnabled(!audioOn);
    }, []),
    messages,
    setMessages,
    error: errorRef.current,
    input,
    isLoading,
    handleSubmit: useCallback(
      async (
        /** @type {{preventDefault?: () => void } | null} */ event = null
      ) => {
        if (input === "") return;
        setIsLoading(true);
        if (event?.preventDefault) event.preventDefault();
        setInput("");

        setMessages((messages) => {
          // TODO: Code some different behavior so that I don't have to wait for the chatbot greet message.

          return [
            ...messages,
            {
              role: "user",
              content: input,
            },
          ];
        });

        const data = new TextEncoder().encode(
          JSON.stringify({
            id: crypto.randomUUID(),
            message: input,
            timestamp: Date.now(),
          })
        );
        await roomRef.current?.localParticipant.publishData(data, {
          reliable: true,
          topic: "lk-chat-topic",
        });
      },
      [input]
    ),
    handleInputChange: useCallback(
      (/** @type {import("react").ChangeEvent<HTMLInputElement>} */ e) =>
        setInput(e.target.value),
      []
    ),
  };
}
