export function useEnterSubmit(handleSubmit: () => void) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      handleSubmit();
    }
  }

  return { onKeyDown: handleKeyDown };
}
