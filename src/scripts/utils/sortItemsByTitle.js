const sortItemsByTitle = items => {
  return Object.keys(items)
    .map(id => items[id])
    .sort((a, b) => {
      const firstTitle = a.title.rendered.toUpperCase();
      const secondTitle = b.title.rendered.toUpperCase();

      if (firstTitle < secondTitle) {
        return -1;
      }

      if (firstTitle > secondTitle) {
        return 1;
      }

      return 0;
    });
};

export default sortItemsByTitle;
