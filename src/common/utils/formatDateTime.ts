export function formatDateTime(dateTime?: Date) {
  if (!dateTime) return "";
  const options: any = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat("pt-BR", options).format(dateTime);
}
