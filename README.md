# Movie shelf

A small site for learning SQL. Each `addPage(name, results)` call in `app.js` creates a problem page and navigation link. The current examples display movies from 2000 and highly rated comedies. Students edit only `app.js`.

Choose **Browse database** to open `database.html` and inspect every field in the real `movies.db` file. The viewer shows 100 rows at a time, with Previous/Next buttons and title search. It does not modify the database.

## Fork and open your own copy

1. Sign in to GitHub and open [the class repository](https://github.com/avilabeto50/databases).
2. Click **Fork**, choose your own account as the owner, and click **Create fork**.
3. In **your fork** (your username should appear above the files), choose **Code → Codespaces → Create codespace on main**.
4. Wait for setup to finish. The project configuration installs Live Server for you.
5. Open `index.html`, then click **Go Live** in the bottom status bar. If it is not visible, open the command palette and run **Live Server: Open with Live Server**.
6. Open the **Ports** panel. Find **5500** and choose **Open in Browser**. Keep the port private; you can view it while signed in.
7. Keep the preview open beside `app.js`. Save the file and refresh the preview after changing a query.

No database account, API key, package installation, or GitHub Pages deployment is needed. If your account cannot create a codespace, ask your instructor before proceeding.

If you already had a codespace before the configuration was added, run **Codespaces: Rebuild Container** first.

## Work on the problems

Edit only `app.js`. Keep the connection code at the top, add each `addPage(...)` block before `db.close()`, and use unique page names. Problem 1 and Problem 2 are worked examples; follow your instructor's prompts for the remaining pages.

Use **Browse database** when you want to inspect the complete records. The card pages show only the fields selected by their query.

## Save your work to your fork

Saving a file updates the codespace; committing and pushing also saves the change to your GitHub fork.

1. Save `app.js`.
2. Open **Source Control** in the left sidebar.
3. Stage `app.js` with the **+** beside it.
4. Enter a short message such as `Complete movie query problems`, then choose **Commit**.
5. Choose **Sync Changes** or **Push**.
6. Visit your fork on GitHub and check that `app.js` contains your latest queries.

Submit the work requested by your instructor. You do not need to open a pull request to the class repository. When finished, use **Codespaces: Stop Current Codespace** from the command palette.

## The files we use

- `index.html` — the page and automatically generated problem links.
- `database.html` and `database.js` — the provided database table viewer; no student edits needed.
- `app.js` — the only file students edit; contains the database connection and worked example queries.
- `cards.js` — provided card renderer. Shows the fields you return, including aliases and aggregate results.
- `vendor/bootstrap.min.css` — Bootstrap 5.3.3 styles the entire page and cards; there is no custom CSS.
- `movies.db` — a SQLite database with one table named `movies`.
- `vendor/` — bundled SQLite browser library (sql.js); no installation needed by students.

## Database fields

| Field | Meaning |
|---|---|
| id | Unique movie ID |
| title | Movie title |
| year | Release year |
| genres | Genre names separated by `\|`, such as `Comedy\|Romance` |
| rating | Average MovieLens rating out of **5**, rounded to three decimals |
| rating_count | Number of ratings |

The database contains 9,742 movies from a fixed 2018 snapshot. Some years and ratings are missing (`NULL`). It does not include current releases. Source: [MovieLens small dataset](https://grouplens.org/datasets/movielens/latest/).

## How cards work

`renderMovies(...)` accepts an array of objects or the output of `db.exec(...)`. Each row becomes one card. Every returned field is displayed: `title` becomes a heading, `genres` become labels, and other columns become labeled values. If you leave out a column, it is omitted from the card. Aliased columns use their alias as the label. Missing database values show “Not available.”

`SELECT *` asks for every field; `SELECT title, rating` asks for only two. The renderer never fills in fields that a query left out.

## Add a problem page

Inside `start()`, after opening the database and before `db.close()`, add:

```js
addPage('My example', db.exec(`
  SELECT title, year
  FROM movies
  WHERE year = 1999
  ORDER BY title, id
  LIMIT 6;
`));
```

Use a unique name for every page. The helper makes a `#my-example` link, sets the heading, and displays its query results. All queries run on page load; clicking a link switches between their saved results. No separate HTML file is needed for each problem. Save and refresh after editing.

MovieLens terms are included in `vendor/MOVIELENS-README.txt`; sql.js terms are in `vendor/LICENSE-sql.js`, and Bootstrap terms are in `vendor/LICENSE-bootstrap`.

## Dataset preparation

This database retains all 9,742 movies from MovieLens `ml-latest-small`, generated September 26, 2018. Release years were extracted from the end of movie titles; original genre labels were retained. Individual ratings were averaged per movie and rounded to three decimal places. Movies without ratings have NULL rating and a rating count of 0. User IDs and individual rating records are not included.

Citation: F. Maxwell Harper and Joseph A. Konstan. 2015. *The MovieLens Datasets: History and Context*. ACM Transactions on Interactive Intelligent Systems 5, 4, Article 19. https://doi.org/10.1145/2827872

Keep the MovieLens terms with any redistributed copy or transformation of the data.
