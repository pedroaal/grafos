import { account, makeId } from "~/lib/appwrite";

export const createAccount = async (email: string, password: string) => {
  const user = await account.create({
    userId: makeId(),
    email,
    password,
  });

  return user.$id;
};