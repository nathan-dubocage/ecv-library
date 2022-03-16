const booksElement = document.querySelector(".books");
const searchElement = document.querySelector(".search__field");
const loader = document.querySelector(".loader");

getBooks = async () => {
	try {
		const response = await fetch("https://ecv-library.herokuapp.com/books/");
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
		return;
	}
};

getAuthors = async () => {
	try {
		const response = await fetch("https://ecv-library.herokuapp.com/authors/");
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
		return;
	}
};

getAuthor = async (id) => {
	try {
		const response = await fetch(`https://ecv-library.herokuapp.com/authors/${id}`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
		return;
	}
};

const mergeBooksAndAuthors = (books, authors) => {
	let filteredData = [];

	books.forEach((book) => {
		authors.forEach((author) => {
			if (book.authors) {
				book.authors.forEach((authorId) => {
					if (authorId == author.id) {
						filteredData.push({
							title: book.title,
							author: [author.name],
							cover: book.cover,
							category: book.category,
						});
					}
				});
			}
		});
	});

	return filteredData;
};

const launchApplication = async () => {
	const books = await getBooks();
	const authors = await getAuthors();
	const mergedData = mergeBooksAndAuthors(books, authors);

	loader.style.display = "none";

	mergedData.forEach((book) => {
		booksElement.innerHTML += `
			<div class="book">
				<img class="book__cover" src="${
					book?.cover[0]?.url
						? book.cover[0].url
						: "https://www.i4ce.org/wp-core/wp-content/uploads/2015/09/noimgavailable.jpg"
				}" />
				<div class="book__title">${book.title.substring(0, 20)}...</div>
				<div class="book__author">by ${book.author}</div>
			</div>
		`;
	});

	const allBooks = document.querySelectorAll(".book");
	searchElement.addEventListener("input", (event) => {
		const searchValue = event.target.value.toUpperCase();

		mergedData.forEach((book, index) => {
			if (book.title.toUpperCase().includes(searchValue)) allBooks[index].style.display = "flex";
			else allBooks[index].style.display = "none";
		});
	});
};

launchApplication();
