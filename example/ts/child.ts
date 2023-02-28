import { getUserAge } from "./child2.ts";

export function getUserName(): string {
  return "aa " + getUserAge();
}
