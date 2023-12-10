export const formatDate = (dateString) => {

  const dateUTC = new Date(dateString);

  dateUTC.setUTCHours(dateUTC.getUTCHours() - 3);

  const day = dateUTC.getUTCDate().toString().padStart(2, '0');
  const month = (dateUTC.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = dateUTC.getUTCFullYear();
  const hours = dateUTC.getUTCHours().toString().padStart(2, '0');
  const minutes = dateUTC.getUTCMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};
