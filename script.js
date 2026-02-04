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

    const tbody = document.querySelector('#messier-table tbody');
    tbody.innerHTML = '';

    data.forEach(obj => {
      const row = createRow(obj);
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Erreur de chargement du catalogue :', err);
  }
}

document.addEventListener('DOMContentLoaded', loadMessier);