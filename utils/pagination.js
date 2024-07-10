export const pagination = (page, limit) => {
  if (!page || page <= 0) {
    page = 1;
  }

  if (!limit || limit <= 0) {
    limit = 8;
  }

  const skip = (Number(page) - 1) * Number(limit);

  return { skip, limit };
};
