// Noms populaires des objets Messier
const messierNames = {
  "M-001": "Nébuleuse du Crabe",
  "M-006": "Amas du Papillon",
  "M-007": "Amas de Ptolémée",
  "M-008": "Nébuleuse de la Lagune",
  "M-011": "Amas du Canard Sauvage",
  "M-012": "Gumball Globular Cluster",
  "M-013": "Grand Amas d'Hercule",
  "M-015": "Nuage de Pégase",
  "M-016": "Nébuleuse de l'Aigle",
  "M-017": "Nébuleuse Oméga",
  "M-018": "Amas du Cygne Noir",
  "M-020": "Nébuleuse Trifide",
  "M-021": "Croix de Web",
  "M-022": "Amas du Sagittaire",
  "M-024": "Nuage Stellaire du Sagittaire",
  "M-027": "Nébuleuse de l'Haltère",
  "M-030": "Amas de la Méduse",
  "M-031": "Galaxie d'Andromède",
  "M-032": "Galaxie Satellite d'Andromède",
  "M-033": "Galaxie du Triangle",
  "M-040": "Winnecke 4",
  "M-042": "Grande Nébuleuse d'Orion",
  "M-043": "Nébuleuse de Mairan",
  "M-044": "Amas de la Ruche",
  "M-045": "Pléiades",
  "M-051": "Galaxie du Tourbillon",
  "M-057": "Nébuleuse de l'Anneau",
  "M-063": "Galaxie du Tournesol",
  "M-064": "Galaxie de l'Œil Noir",
  "M-076": "Petite Nébuleuse de l'Haltère",
  "M-077": "Galaxie de Baleine",
  "M-078": "Nébuleuse par Réflexion",
  "M-081": "Galaxie de Bode",
  "M-082": "Galaxie du Cigare",
  "M-083": "Moulinet de Sud",
  "M-097": "Nébuleuse du Hibou",
  "M-099": "Galaxie Pinwheel",
  "M-100": "Galaxie du Sèchecheveux",
  "M-101": "Galaxie du Moulinet",
  "M-102": "Galaxie du Fuseau",
  "M-104": "Galaxie du Sombrero",
  "M-108": "Galaxie de la Planche de Surf",
  "M-109": "Galaxie de l'Asirateur",
  "M-110": "Galaxie Satellite d'Andromède"
};

// Remplir les entrées manquantes de M-002 à M-110
for (let i = 2; i <= 110; i += 1) {
  const key = `M-${String(i).padStart(3, '0')}`;
  if (!messierNames[key]) {
    messierNames[key] = 'sans nom';
  }
}
