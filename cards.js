// Provided display code. Students only need to edit app.js.
// Accepts plain objects OR the result of db.exec(sql).
function renderMovies(data) {
  let movies = data;
  if (data[0] && Array.isArray(data[0].columns) && Array.isArray(data[0].values)) {
    const { columns, values } = data[0];
    movies = values.map(row => Object.fromEntries(columns.map((name, i) => [name, row[i]])));
  }

  const container = document.getElementById('movies');
  container.replaceChildren();
  document.getElementById('status').textContent = movies.length
    ? `${movies.length} ${movies.length === 1 ? 'card' : 'cards'}`
    : 'No movies found. Try changing your query.';

  for (const movie of movies) {
    const column = document.createElement('div');
    column.className = 'col';
    const card = document.createElement('article');
    card.className = 'card h-100 shadow-sm';
    const body = document.createElement('div');
    body.className = 'card-body p-4';
    const fields = document.createElement('dl');
    fields.className = 'mb-0';

    for (const [name, value] of Object.entries(movie)) {
      if (name === 'title') {
        const title = document.createElement('h2');
        title.className = 'card-title h4 mb-4';
        title.textContent = value ?? 'Not available';
        body.prepend(title);
        continue;
      }
      const field = document.createElement('div');
      field.className = 'mb-3';
      const label = document.createElement('dt');
      label.className = 'small text-body-secondary text-capitalize fw-normal';
      label.textContent = name.replaceAll('_', ' ');
      const content = document.createElement('dd');
      content.className = 'mb-0 text-break';
      if (value === null) {
        content.textContent = 'Not available';
      } else if (name === 'genres') {
        for (const genre of String(value).split('|')) {
          const tag = document.createElement('span');
          tag.className = 'badge text-bg-primary me-1';
          tag.textContent = genre;
          content.append(tag);
        }
      } else {
        content.textContent = String(value);
        if (name === 'rating') content.append(' / 5');
      }
      field.append(label, content);
      fields.append(field);
    }
    if (fields.children.length) body.append(fields);
    card.append(body);
    column.append(card);
    container.append(column);
  }
}

function setPageTitle(page) {
  document.getElementById('page-title').textContent = page;
}

function showError(error) {
  document.getElementById('movies').replaceChildren();
  document.getElementById('status').textContent = 'Something went wrong: ' + error.message;
}

const pages = {};

function addPage(name, results) {
  // "Problem 1" becomes "problem-1".
  const id = name.toLowerCase().trim().replace(/\s+/g, '-');

  // Remember this page and its query results.
  pages[id] = { name, results };

  // Create its navigation link.
  const link = document.createElement('a');
  link.href = `#${id}`;
  link.textContent = name;
  link.className = 'nav-link';
  document.querySelector('nav').append(link);

  showCurrentPage();
}

function showCurrentPage() {
  // Use the URL's page, or the first page if none is selected.
  const id = location.hash.slice(1);
  const page = pages[id] || Object.values(pages)[0];

  if (!page) return;

  setPageTitle(page.name);
  renderMovies(page.results);
}

window.addEventListener('hashchange', showCurrentPage);
window.addEventListener('error', event => showError(event.error || new Error(event.message)));
