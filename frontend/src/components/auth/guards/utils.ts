import { Role } from "utils/types";

export function getRedirectPath(role: Role) {
  switch (role) {
    case Role.STUDENT:
      return "/student";
    case Role.TEACHER:
      return "/teacher";
    default:
      return "/";
  }
}
