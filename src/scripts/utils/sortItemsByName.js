const sortItemsByName = items => {
  return Object.keys(items)
    .map(id => items[id])
    .sort((a, b) => {
      const firstTitle = a.name.toUpperCase();
      const secondTitle = b.name.toUpperCase();

      if (firstTitle < secondTitle) {
        return -1;
      }

      if (firstTitle > secondTitle) {
        return 1;
      }

      return 0;
    });
};

export default sortItemsByName;
