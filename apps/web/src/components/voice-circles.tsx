"use client";

import { useEffect, useRef } from "react";
import { useVoice } from "use-voice";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

export default function VoiceCircles({
  largeRef,
  largeClassname,
  smallRef,
  smallClassname,
  state,
}: {
  largeRef: React.RefObject<SVGCircleElement>;
  largeClassname?: string;
  smallRef: React.RefObject<SVGCircleElement>;
  smallClassname?: string;
  state: ReturnType<typeof useVoice>["state"];
}) {
  const controls = useAnimationControls();
  const spinningRef = useRef(false);
  const prevStateRef = useRef(state);

  useEffect(() => {
    const updateAnimation = async () => {
      const shouldSpin = [
        "requestingMicrophone",
        "creatingRoom",
        "joiningRoom",
      ].includes(state);

      if (shouldSpin && !spinningRef.current) {
        spinningRef.current = true;
        await controls.start({
          rotate: 360,
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          },
        });
      } else if (!shouldSpin && spinningRef.current) {
        spinningRef.current = false;
        controls.stop();
        controls.start({
          rotate: 0,
          transition: {
            duration: 1,
            ease: "easeOut",
          },
        });
      }
    };

    if (state !== prevStateRef.current) {
      updateAnimation();
      prevStateRef.current = state;
    }
  }, [state, controls]);

  return (
    <svg
      width="242"
      height="242"
      viewBox="0 0 242 242"
      xmlns="http://www.w3.org/2000/svg"
      className="h-48 w-48 overflow-visible md:h-[242px] md:w-[242px]"
    >
      <circle
        cx="121"
        cy="121"
        r="59"
        fill="white"
        className={cn(
          "origin-center transition-transform duration-100 ease-in",
          largeClassname,
        )}
        ref={largeRef}
      />
      <motion.g
        animate={controls}
        style={{
          originX: "121px",
          originY: "121px",
        }}
      >
        <circle
          cx="228"
          cy="121"
          r="14"
          style={{
            transformOrigin: "228px 121px",
          }}
          className={cn(
            "fill-muted-foreground transition-transform duration-100 ease-in",
            smallClassname,
          )}
          ref={smallRef}
        />
      </motion.g>
    </svg>
  );
}
