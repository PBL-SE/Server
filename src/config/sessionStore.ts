// sessionStore.ts
let userIdStore: string | null = null;

export const setUserId = (id: string) => {
  userIdStore = id;
};

export const getUserId = () => userIdStore;
