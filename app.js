const airtable = require("airtable");
const base = new airtable({ apiKey: "key0NMaOSgOw7SREu" }).base("appfVO5dKeS4dg3aR");

const express = require("express");
const app = express();

app.use(express.static("public"));
app.get("/authors/", (request, response) => {
	response.setHeader("Access-Control-Allow-Origin", "*");

	const authors = [];

	base("Authors")
		.select({
			view: "Table des auteurs",
		})
		.eachPage(
			(page = (records, nextPage) => {
				records.forEach(async (record) => {
					try {
						authors.push({
							id: record.id,
							name: record.get("Name"),
						});
					} catch (error) {
						console.log(error);
					}
				});
				nextPage();
			}),
			(error) => {
				if (error) {
					console.error(error);
					return;
				}

				response.json(authors);
			}
		);
});

app.get("/books/", async (request, response) => {
	response.setHeader("Access-Control-Allow-Origin", "*");

	const books = [];

	base("Books")
		.select({
			view: "Galerie – Tous les livres",
		})
		.eachPage(
			(page = (records, nextPage) => {
				records.forEach(async (record) => {
					try {
						books.push({
							title: record.get("Titre"),
							category: record.get("Topic"),
							authors: record.get("Auteur(s)"),
							cover: record.get("Cover") ? record.get("Cover") : "",
						});
					} catch (error) {
						console.log(error);
					}
				});
				nextPage();
			}),
			(error) => {
				if (error) {
					console.error(error);
					return;
				}
				response.json(books);
			}
		);
});

app.listen(process.env.PORT || 3000, (error) => {
	if (!error) console.log("Server is now available on port", 3000);
});
