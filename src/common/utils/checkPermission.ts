export function checkPermission(user, role) {
  return user?.role === role;
}
