// https://github.com/livekit/agents-playground/blob/57b66f3f586f59392d2337fd4923a198000df9d4/src/hooks/useTrackVolume.tsx

import { useEffect, useState } from "react";

/**
 * @param {React.MutableRefObject<((localVolume: number) => void) | undefined>} onVolumeRef
 * @param {import("livekit-client").Track | null} [track]
 */
export function useTrackVolume(onVolumeRef, track) {
    const mediaStream = track?.mediaStream;

    useEffect(() => {
        if (!mediaStream || !onVolumeRef.current) {
            return;
        }

        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(mediaStream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 32;
        analyser.smoothingTimeConstant = 0;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                const a = dataArray[i];
                sum += a * a;
            }

            if (onVolumeRef.current) {
                onVolumeRef.current(Math.sqrt(sum / dataArray.length) / 255)
            }
        };

        const interval = setInterval(updateVolume, 1000 / 30);

        return () => {
            source.disconnect();
            clearInterval(interval);
        };
    }, [mediaStream, onVolumeRef]);
}

/** @param {Float32Array} frequencies */
function normalizeFrequencies(frequencies) {
    /** @param {number} value */
    function normalizeDb(value) {
        const minDb = -100;
        const maxDb = -10;
        let db = 1 - (Math.max(minDb, Math.min(maxDb, value)) * -1) / 100;
        db = Math.sqrt(db);

        return db;
    }

    // Normalize all frequency values
    return frequencies.map((value) => {
        if (value === -Infinity) {
            return 0;
        }
        return normalizeDb(value);
    });
}


/**
 * @param {import("livekit-client").Track | null} [track]
 * @param {number} bands
 * @param {number} loPass
 * @param {number} hiPass
 */
export function useMultibandTrackVolume(
    track,
    bands = 5,
    loPass = 100,
    hiPass = 600
) {
    const [frequencyBands, setFrequencyBands] = useState( /** @type {Float32Array[]} */([]));

    useEffect(() => {
        if (!track || !track.mediaStream) {
            return;
        }

        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(track.mediaStream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);

        const updateVolume = () => {
            analyser.getFloatFrequencyData(dataArray);
            let frequencies = new Float32Array(dataArray.length);
            for (let i = 0; i < dataArray.length; i++) {
                frequencies[i] = dataArray[i];
            }
            frequencies = frequencies.slice(loPass, hiPass);

            const normalizedFrequencies = normalizeFrequencies(frequencies);
            const chunkSize = Math.ceil(normalizedFrequencies.length / bands);
            /** @type {Float32Array[]}  */
            const chunks = [];
            for (let i = 0; i < bands; i++) {
                chunks.push(
                    normalizedFrequencies.slice(i * chunkSize, (i + 1) * chunkSize)
                );
            }

            setFrequencyBands(chunks);
        };

        const interval = setInterval(updateVolume, 10);

        return () => {
            source.disconnect();
            clearInterval(interval);
        };
    }, [track, track?.mediaStream, loPass, hiPass, bands]);

    return frequencyBands;
}