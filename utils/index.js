// Get book by key & value
const searchBookByKeyAndValue = (books, key, value) => {
  // Get books' isbn
  const isbn = Object.keys(books);

  // Get books contain key = value
  const result = [];
  isbn.forEach(i => {
    if (books[i][key] == value) {
      result.push(books[i]);
    }
  })

  return result;
}

module.exports = {
    searchBookByKeyAndValue,
}