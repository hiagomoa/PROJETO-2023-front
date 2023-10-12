export function getRedirectUrl(role) {
  switch (role) {
    case "ADMIN":
      return "/adm";
    case "STUDENT":
      return "/aluno";
    case "PROFESSOR":
      return "/professor";
    default:
      return "/";
  }
}
