async function start() {
  // 1. Load SQLite so the browser can read our database.
  const SQL = await initSqlJs({
    locateFile: file => `vendor/${file}`
  });

  // 2. Open the movies.db file.
  const response = await fetch('movies.db');
  if (!response.ok) throw new Error('Could not load movies.db');
  const bytes = await response.arrayBuffer();
  const db = new SQL.Database(new Uint8Array(bytes));

  // 3. Write our SQL query. This is the part students change.
  addPage('Problem 1', db.exec(`
  SELECT title, year
  FROM movies
  WHERE year = 2000
  LIMIT 12;
`));

  addPage('Problem 2', db.exec(`
  SELECT title, rating
  FROM movies
  WHERE genres LIKE '%Comedy%'
  ORDER BY rating DESC
  LIMIT 5;
`));

  db.close()

}

start().catch(showError);
