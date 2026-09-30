// Provided database viewer. Students write their queries in app.js.
async function browseDatabase() {
  const SQL = await initSqlJs({ locateFile: file => `vendor/${file}` });
  const response = await fetch('movies.db');
  if (!response.ok) throw new Error('Could not load movies.db');
  const db = new SQL.Database(new Uint8Array(await response.arrayBuffer()));
  db.run('PRAGMA query_only = ON');

  const get = id => document.getElementById(id);
  const pageSize = 100;
  const total = db.exec('SELECT COUNT(*) FROM movies')[0].values[0][0];
  let page = 0;
  let search = '';

  function display() {
    // Parameters keep the search text separate from the SQL.
    const count = db.exec(
      'SELECT COUNT(*) FROM movies WHERE instr(lower(title), lower(?)) > 0',
      [search]
    )[0].values[0][0];
    const result = db.exec(
      'SELECT * FROM movies WHERE instr(lower(title), lower(?)) > 0 ORDER BY id LIMIT ? OFFSET ?',
      [search, pageSize, page * pageSize]
    )[0];

    get('rows').replaceChildren();
    if (result) {
      get('columns').replaceChildren();
      for (const name of result.columns) {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = name;
        get('columns').append(th);
      }
      for (const row of result.values) {
        const tr = document.createElement('tr');
        for (const value of row) {
          const td = document.createElement('td');
          td.textContent = value === null ? 'NULL' : String(value);
          if (value === null) td.className = 'text-body-secondary fst-italic';
          tr.append(td);
        }
        get('rows').append(tr);
      }
    }

    const start = count ? page * pageSize + 1 : 0;
    const end = Math.min((page + 1) * pageSize, count);
    get('database-status').textContent = count
      ? `Showing ${start.toLocaleString()}–${end.toLocaleString()} of ${count.toLocaleString()} ${search ? 'matching movies' : 'movies'}${search ? ` (${total.toLocaleString()} in the database)` : ''}.`
      : 'No movies found. Try another title or choose Show all.';
    get('page-number').textContent = `Page ${count ? page + 1 : 0} of ${Math.ceil(count / pageSize)}`;
    get('previous').disabled = page === 0;
    get('next').disabled = end >= count;
  }

  get('search-form').addEventListener('submit', event => {
    event.preventDefault();
    search = get('search').value.trim();
    page = 0;
    display();
  });
  get('clear').onclick = () => {
    search = '';
    get('search').value = '';
    page = 0;
    display();
  };
  get('previous').onclick = () => { page--; display(); };
  get('next').onclick = () => { page++; display(); };
  display();
  for (const id of ['search', 'search-button', 'clear']) get(id).disabled = false;
}

browseDatabase().catch(error => {
  document.getElementById('database-status').textContent =
    error.message + '. Open this page through Live Server.';
});
