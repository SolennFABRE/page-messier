// Règle simple : visible à l'œil nu si mag <= 6
function isVisible(mag) {
  if (mag === null || mag === undefined) return false;
  return Number(mag) <= 6;
}

function createRow(obj) {
  const tr = document.createElement('tr');

  // Messier avec le nom en dessous
  const tdMessier = document.createElement('td');
  const messierNumber = document.createElement('div');
  messierNumber.textContent = obj.messier || '';
  messierNumber.style.fontWeight = 'bold';
  tdMessier.appendChild(messierNumber);
  
  // Ajouter le nom populaire de l'objet s'il existe
  if (messierNames && messierNames[obj.messier]) {
    const name = document.createElement('div');
    name.textContent = messierNames[obj.messier];
    name.style.fontSize = '0.75rem';
    name.style.color = '#a0aec0';
    name.style.marginTop = '4px';
    tdMessier.appendChild(name);
  }
  tr.appendChild(tdMessier);

  // Image
  const tdImage = document.createElement('td');
  if (obj.messier) {
    const img = document.createElement('img');
    // Utiliser le numéro Messier pour construire le nom du fichier
    img.src = 'catalogue_messier/' + obj.messier + '.png';
    img.alt = obj.messier || 'Objet Messier';
    img.className = 'messier-thumb';
    tdImage.appendChild(img);
  } else {
    tdImage.textContent = '—';
  }
  tr.appendChild(tdImage);

  // Objet (on garde la chaîne telle quelle : "Globular Cluster / Amas Globulaire")
  const tdObjet = document.createElement('td');
  tdObjet.textContent = obj.objet || '';
  tr.appendChild(tdObjet);

  // Saison
  const tdSaison = document.createElement('td');
  tdSaison.textContent = obj.saison || '';
  tr.appendChild(tdSaison);

  // Magnitude
  const tdMag = document.createElement('td');
  tdMag.textContent = obj.mag !== null && obj.mag !== undefined ? obj.mag : '?';
  tr.appendChild(tdMag);

  // Constellation (nom français si dispo, sinon latin, sinon code)
  const tdConst = document.createElement('td');
  tdConst.textContent =
    obj.nom_francais ||
    obj.latin_name_nom_latin ||
    obj.const ||
    '';
  tr.appendChild(tdConst);

  // Visible (O / N)
  const tdVisible = document.createElement('td');
  const visible = isVisible(obj.mag);
  const span = document.createElement('span');
  span.className = 'badge-visible ' + (visible ? 'o' : 'n');
  span.textContent = visible ? 'O' : 'N';
  tdVisible.appendChild(span);
  tr.appendChild(tdVisible);

  return tr;
}

async function loadMessier() {
  try {
    // Utiliser les données directement depuis catalogue-data.js
    const data = messierData;
    const rowsPerPage = 10;
    let currentPage = 1;
    const filters = {
      visibleOnly: false,
      season: '',
      constellation: '',
      type: ''
    };
    const sortState = {
      key: 'messier',
      direction: 'asc'
    };

    const tbody = document.querySelector('#messier-table tbody');
    const pagination = document.querySelector('#pagination');
    const filterVisible = document.querySelector('#filter-visible');
    const filterSeason = document.querySelector('#filter-saison');
    const filterConstellation = document.querySelector('#filter-constellation');
    const filterType = document.querySelector('#filter-type');
    const sortHeaders = document.querySelectorAll('#messier-table thead th[data-key]');

    function getConstellationDisplay(obj) {
      return (
        obj.nom_francais ||
        obj.latin_name_nom_latin ||
        obj.const ||
        ''
      );
    }

    function getObjectType(obj) {
      const value = (obj.objet || '').toLowerCase();
      if (value.includes('amas globulaire')) return 'Amas Globulaire';
      if (value.includes('reste de supernova')) return 'Reste de Supernova';
      if (value.includes('supernova remnant')) return 'Reste de Supernova';
      if (value.includes('amas ouvert')) return 'Amas Ouvert';
      if (value.includes('open cluster')) return 'Amas Ouvert';
      if (value.includes('nébuleuse à émission')) return 'Nébuleuse à émission';
      if (value.includes('emission nebula')) return 'Nébuleuse à émission';
      if (value.includes('nébuleuse planétaire')) return 'Nébuleuse Planétaire';
      if (value.includes('planetary nebula')) return 'Nébuleuse Planétaire';
      if (value.includes('galaxie')) return 'Galaxie';
      if (value.includes('galaxy')) return 'Galaxie';
      if (value.includes('étoile double')) return 'Étoile Double';
      if (value.includes('double star')) return 'Étoile Double';
      if (value.includes('nébuleuse à réflexion')) return 'Nébuleuse à réflexion';
      if (value.includes('reflection nebula')) return 'Nébuleuse à réflexion';
      return '';
    }

    function getMessierNumber(value) {
      if (!value) return 0;
      const match = String(value).match(/M-(\d+)/i);
      if (!match) return 0;
      return Number(match[1]);
    }

    function getSortValue(obj, key) {
      switch (key) {
        case 'messier':
          return getMessierNumber(obj.messier);
        case 'image':
          return getMessierNumber(obj.messier);
        case 'objet':
          return obj.objet || '';
        case 'saison':
          return obj.saison || '';
        case 'mag':
          return Number(obj.mag ?? 0);
        case 'constellation':
          return getConstellationDisplay(obj);
        case 'visible':
          return isVisible(obj.mag) ? 1 : 0;
        default:
          return '';
      }
    }

    function applySort(list) {
      if (!sortState.key) return list;
      const dir = sortState.direction === 'asc' ? 1 : -1;
      return [...list].sort((a, b) => {
        const aValue = getSortValue(a, sortState.key);
        const bValue = getSortValue(b, sortState.key);
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * dir;
        }
        return String(aValue).localeCompare(String(bValue), 'fr', { sensitivity: 'base' }) * dir;
      });
    }

    function applyFilters(list) {
      return list.filter(obj => {
        if (filters.visibleOnly && !isVisible(obj.mag)) return false;
        if (filters.season && (obj.saison || '') !== filters.season) return false;
        if (filters.constellation && getConstellationDisplay(obj) !== filters.constellation) return false;
        if (filters.type && getObjectType(obj) !== filters.type) return false;
        return true;
      });
    }

    function renderFilters() {
      const seasons = Array.from(new Set(data.map(obj => obj.saison).filter(Boolean))).sort();
      const constellations = Array.from(
        new Set(data.map(obj => getConstellationDisplay(obj)).filter(Boolean))
      ).sort();

      filterSeason.innerHTML = '<option value="">Toutes</option>';
      seasons.forEach(season => {
        const option = document.createElement('option');
        option.value = season;
        option.textContent = season;
        filterSeason.appendChild(option);
      });

      filterConstellation.innerHTML = '<option value="">Toutes</option>';
      constellations.forEach(constellation => {
        const option = document.createElement('option');
        option.value = constellation;
        option.textContent = constellation;
        filterConstellation.appendChild(option);
      });
    }

    function renderTable(page, filtered) {
      tbody.innerHTML = '';
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      filtered.slice(start, end).forEach(obj => {
        const row = createRow(obj);
        tbody.appendChild(row);
      });
    }

    function renderPagination(filtered) {
      pagination.innerHTML = '';
      const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

      const prevBtn = document.createElement('button');
      prevBtn.textContent = 'Précédent';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
        currentPage -= 1;
        updateView();
      });
      pagination.appendChild(prevBtn);

      for (let i = 1; i <= totalPages; i += 1) {
        const btn = document.createElement('button');
        btn.textContent = String(i);
        if (i === currentPage) {
          btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
          currentPage = i;
          updateView();
        });
        pagination.appendChild(btn);
      }

      const nextBtn = document.createElement('button');
      nextBtn.textContent = 'Suivant';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
        currentPage += 1;
        updateView();
      });
      pagination.appendChild(nextBtn);
    }

    function updateView() {
      const filtered = applyFilters(data);
      const sorted = applySort(filtered);
      const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
      if (currentPage > totalPages) currentPage = totalPages;
      renderTable(currentPage, sorted);
      renderPagination(sorted);
    }

    function updateSortIndicators() {
      sortHeaders.forEach(th => {
        th.classList.remove('sortable', 'asc', 'desc');
        const key = th.getAttribute('data-key');
        th.classList.add('sortable');
        if (key === sortState.key) {
          th.classList.add(sortState.direction);
        }
      });
    }

    function bindSorting() {
      sortHeaders.forEach(th => {
        th.addEventListener('click', () => {
          const key = th.getAttribute('data-key');
          if (sortState.key === key) {
            sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
          } else {
            sortState.key = key;
            sortState.direction = 'asc';
          }
          updateSortIndicators();
          updateView();
        });
      });
    }

    function bindFilters() {
      filterVisible.addEventListener('change', () => {
        filters.visibleOnly = filterVisible.checked;
        currentPage = 1;
        updateView();
      });
      filterSeason.addEventListener('change', () => {
        filters.season = filterSeason.value;
        currentPage = 1;
        updateView();
      });
      filterConstellation.addEventListener('change', () => {
        filters.constellation = filterConstellation.value;
        currentPage = 1;
        updateView();
      });
      filterType.addEventListener('change', () => {
        filters.type = filterType.value;
        currentPage = 1;
        updateView();
      });
    }

    renderFilters();
    bindFilters();
    bindSorting();
    updateSortIndicators();
    updateView();
  } catch (err) {
    console.error('Erreur de chargement du catalogue :', err);
  }
}

document.addEventListener('DOMContentLoaded', loadMessier);