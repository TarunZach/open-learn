"use client";

import { useEffect, useState } from "react";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

export function LoadingSpinner() {
  const dotsSequence = ["", ".", "..", "..."];
  const progressMessages = [
    "Preparing your course structure...",
    "Generating topics and lessons...",
    "Creating quizzes...",
    "Finalizing the output...",
  ];

  const [dotIndex, setDotIndex] = useState(0);
  const [progressIndex, setProgressIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % dotsSequence.length);
    }, 450);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rotate progress messages
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressIndex((prev) => (prev + 1) % progressMessages.length);
    }, 2500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem] mt-4">
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">
            Creating Course{dotsSequence[dotIndex]}
          </ItemTitle>

          <div className="text-sm text-muted-foreground mt-1">
            {progressMessages[progressIndex]}
          </div>
        </ItemContent>
      </Item>
    </div>
  );
}
