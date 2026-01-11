export const NotificationPlugin = async ({ client, directory, $ }) => {
  return {
    event: async ({ event }) => {
      // Send notification on session completion
      if (event.type === "session.idle") {
        const lastFolder = directory.split("/").pop() || "unknown";
        await $`afplay /System/Library/Sounds/Funk.aiff && say "${lastFolder}"`;
      }
    },
  };
};
