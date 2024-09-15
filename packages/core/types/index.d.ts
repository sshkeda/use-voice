/**
 * @param {Object} [options]
 * @param {string} [options.accessToken]
 * @param {boolean} [options.joinMuted]
 * @param {number} [options.keepAliveTimeout]
 * @param {(localVolume: number) => void} [options.onLocalAudio]
 * @param {(chatbotVolume: number) => void} [options.onChatbotAudio]
 */
export function useVoice(options?: {
    accessToken?: string | undefined;
    joinMuted?: boolean | undefined;
    keepAliveTimeout?: number | undefined;
    onLocalAudio?: ((localVolume: number) => void) | undefined;
    onChatbotAudio?: ((chatbotVolume: number) => void) | undefined;
} | undefined): {
    start: () => Promise<void>;
    stop: () => void;
    state: "idle" | "requestingMicrophone" | "creatingRoom" | "joiningRoom" | "connected" | "error";
    muted: boolean;
    /** Toggle microphone mute */
    toggleMute: () => Promise<void>;
    messages: {
        role: "assistant" | "user";
        content: string;
    }[];
    setMessages: import("react").Dispatch<import("react").SetStateAction<{
        role: "assistant" | "user";
        content: string;
    }[]>>;
    error: Error | null;
    input: string;
    isLoading: boolean;
    handleSubmit: (event?: {
        preventDefault?: () => void;
    } | null) => Promise<void>;
    handleInputChange: (e: import("react").ChangeEvent<HTMLInputElement>) => void;
};
//# sourceMappingURL=index.d.ts.map