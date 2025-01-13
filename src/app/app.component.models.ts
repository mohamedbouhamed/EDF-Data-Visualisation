export interface DateLimits {
  total_count: number;
  results: {
    'min(date_et_heure_fuseau_horaire_europe_paris)': string;
    'max(date_et_heure_fuseau_horaire_europe_paris)': string;
  }[];
}
export interface DataSetsTranche {
  total_count: number;
  results: DonneeTranche;
}
export interface DonneeTranche {
  map(arg0: (item: DonneeTranche) => number[]): [number, number][];
  date_et_heure_fuseau_horaire_europe_paris: string;
  puissance_disponible: number;
}

export interface ICourse {
  id: number;
  description: string;
  imageUrl: string;
  longDescription: string;
  category: CategoryType;
}
export interface Dispo {
  date_et_heure_fuseau_horaire_europe_paris: string; // Format ISO 8601 (e.g., "2024-12-02T11:00:00+00:00")
  heure_fuseau_horaire_europe_paris: number; // Heure locale en heures (e.g., 12)
  perimetre_juridique: string; // Ex: "EDF SA"
  perimetre_spatial: string; // Ex: "France métropolitaine, sans la Corse ni les iles du ponant"
  spatial_perimeter: string; // Traduction en anglais du périmètre spatial
  centrale: string; // Nom de la centrale (e.g., "BELLEVILLE")
  tranche: string; // Tranche de la centrale (e.g., "BELLEVILLE 2")
  puissance_disponible: number; // Puissance disponible en MW
  unite: string; // Unité de puissance (e.g., "MW")
  lien_de_publication_de_l_indisponibilite: string | null; // URL ou null si non disponible
  point_gps_modifie_pour_afficher_la_carte_opendata: {
    lon: number; // Longitude GPS (e.g., 3.275676)
    lat: number; // Latitude GPS (e.g., 47.308946)
  };
  derniere_actualisation_opendataedf_fuseau_horaire_europe_paris: string; // Format ISO 8601
};

export interface DataSets {
  total_count: number;
  results: Dispo[];
}
export interface DataSetResult {
  visibility: string;
  dataset_id: string;
  dataset_uid: string;
  has_records: boolean;
  features: string[];
  attachments: any[]; // Ajuste le type si tu as une structure spécifique
  alternative_exports: any[]; // Idem
  data_visible: boolean;
  fields: any[]; // Idem
  metas: any[];
}

export enum CategoryType {
  beginners = 1,
  intermediate = 2,
  advanced = 3,
  other,
}
export const courses: Array<ICourse> = [
  {
    id: 1,
    description: 'angular for beginners',
    imageUrl: 'Angular_gradient.png',
    longDescription: '',
    category: CategoryType.beginners,
  },
  {
    id: 2,
    description: 'box',
    imageUrl: 'angularForBeginners.png',
    longDescription: '',
    category: CategoryType.intermediate,
  },
  {
    id: 3,
    description: 'Rxjs',
    imageUrl: 'Angular_gradient.png',
    longDescription: 'Secrétaire géneral',
    category: CategoryType.advanced,
  },
];
export interface Plant {
  name: string;
  lat: number;
  lng: number;
  power: number; // Puissance en MW
  link: string;
  lastUpdated: string;
}

// Déclaration du tableau de plantes
export const plants: Plant[] = [
  {
    name: 'GRAVELINES 1',
    lat: 51.021,
    lng: 2.123,
    power: 900, // Puissance en MW
    link: 'https://doaat.edf.fr/indisponibilite/05470-edf-t-00058481',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'GRAVELINES 2',
    lat: 51.02,
    lng: 2.124,
    power: 900,
    link: 'https://doaat.edf.fr/indisponibilite/05470-edf-t-00058482',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'GRAVELINES 3',
    lat: 51.015,
    lng: 2.125,
    power: 0, // Puissance en MW
    link: 'https://doaat.edf.fr/indisponibilite/05470-edf-t-00058484',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'GRAVELINES 4',
    lat: 51.015,
    lng: 2.126,
    power: 900,
    link: 'https://doaat.edf.fr/indisponibilite/05470-edf-t-00058485',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'DUNKERQUE',
    lat: 51.033,
    lng: 2.569,
    power: 1200,
    link: 'https://doaat.edf.fr/indisponibilite/05473-edf-t-00058633',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'CHOOZ A',
    lat: 50.298,
    lng: 4.957,
    power: 1450,
    link: 'https://doaat.edf.fr/indisponibilite/05476-edf-t-00058487',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'CHOOZ B',
    lat: 50.298,
    lng: 4.957,
    power: 1450,
    link: 'https://doaat.edf.fr/indisponibilite/05476-edf-t-00058488',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'BELLEVILLE',
    lat: 47.694,
    lng: 2.547,
    power: 1300,
    link: 'https://doaat.edf.fr/indisponibilite/05474-edf-t-00058489',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'CIVaux',
    lat: 46.586,
    lng: 0.455,
    power: 1450,
    link: 'https://doaat.edf.fr/indisponibilite/05471-edf-t-00058490',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'BUGEY 1',
    lat: 45.594,
    lng: 5.326,
    power: 900,
    link: 'https://doaat.edf.fr/indisponibilite/05475-edf-t-00058491',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'BUGEY 2',
    lat: 45.594,
    lng: 5.327,
    power: 900,
    link: 'https://doaat.edf.fr/indisponibilite/05475-edf-t-00058492',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'BUGEY 3',
    lat: 45.593,
    lng: 5.325,
    power: 900,
    link: 'https://doaat.edf.fr/indisponibilite/05475-edf-t-00058493',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'BUGEY 4',
    lat: 45.593,
    lng: 5.327,
    power: 900,
    link: 'https://doaat.edf.fr/indisponibilite/05475-edf-t-00058494',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'TRICASTIN',
    lat: 44.347,
    lng: 4.885,
    power: 1500,
    link: 'https://doaat.edf.fr/indisponibilite/05472-edf-t-00058495',
    lastUpdated: '15 octobre 2024 10:00',
  },
  {
    name: 'GRAVELINES 5',
    lat: 51.02,
    lng: 2.128,
    power: 0, // Puissance en MW
    link: 'https://doaat.edf.fr/indisponibilite/05470-edf-t-00058496',
    lastUpdated: '15 octobre 2024 10:00',
  },
];

export const centrale = [
  {"nom":"BLAYAIS (LE)","tranche":"BLAYAIS 4","coordonnees":{"lon":-0.690606,"lat":45.257605},"puissance_installee":850,"puissance_disponible":0},
  {"nom":"DAMPIERRE-EN-BURLY","tranche":"DAMPIERRE 3","coordonnees":{"lon":2.517824,"lat":47.732638},"puissance_installee":780,"puissance_disponible":0},
  {"nom":"GOLFECH","tranche":"GOLFECH 1","coordonnees":{"lon":0.84572,"lat":44.105751},"puissance_installee":1200,"puissance_disponible":0},
  {"nom":"GOLFECH","tranche":"GOLFECH 2","coordonnees":{"lon":0.84572,"lat":44.105751},"puissance_installee":1200,"puissance_disponible":0},
  {"nom":"GRAVELINES","tranche":"GRAVELINES 5","coordonnees":{"lon":2.139287,"lat":51.012846},"puissance_installee":860,"puissance_disponible":0},
  {"nom":"BLAYAIS (LE)","tranche":"BLAYAIS 3","coordonnees":{"lon":-0.690606,"lat":45.257605},"puissance_installee":870,"puissance_disponible":0},
  {"nom":"BUGEY (LE)","tranche":"BUGEY 2","coordonnees":{"lon":5.266072,"lat":45.801148},"puissance_installee":850,"puissance_disponible":0},
  {"nom":"NOGENT-SUR-SEINE","tranche":"NOGENT 1","coordonnees":{"lon":3.524182,"lat":48.514581},"puissance_installee":1100,"puissance_disponible":1000},
  {"nom":"PALUEL","tranche":"PALUEL 1","coordonnees":{"lon":0.634759,"lat":49.858754},"puissance_installee":1280,"puissance_disponible":1200},
  {"nom":"PALUEL","tranche":"PALUEL 2","coordonnees":{"lon":0.634759,"lat":49.858754},"puissance_installee":1280,"puissance_disponible":1200},
  {"nom":"PALUEL","tranche":"PALUEL 3","coordonnees":{"lon":0.634759,"lat":49.858754},"puissance_installee":1280,"puissance_disponible":1200},
  {"nom":"ST-ALBAN-ST-MAURICE","tranche":"ST-ALBAN 1","coordonnees":{"lon":4.755573,"lat":45.405445},"puissance_installee":1300,"puissance_disponible":1250},
  {"nom":"ST-ALBAN-ST-MAURICE","tranche":"ST-ALBAN 2","coordonnees":{"lon":4.755573,"lat":45.405445},"puissance_installee":1300,"puissance_disponible":1260},
  {"nom":"GRAVELINES","tranche":"GRAVELINES 1","coordonnees":{"lon":2.139287,"lat":51.012846},"puissance_installee":880,"puissance_disponible":840},
  {"nom":"GRAVELINES","tranche":"GRAVELINES 2","coordonnees":{"lon":2.139287,"lat":51.012846},"puissance_installee":880,"puissance_disponible":850},
  {"nom":"NOGENT-SUR-SEINE","tranche":"NOGENT 2","coordonnees":{"lon":3.524182,"lat":48.514581},"puissance_installee":1100,"puissance_disponible":1050},
  {"nom":"TRICASTIN (LE)","tranche":"TRICASTIN 1","coordonnees":{"lon":4.731541,"lat":44.326355},"puissance_installee":900,"puissance_disponible":850},
  {"nom":"CHINON B","tranche":"CHINON B 1","coordonnees":{"lon":0.168307,"lat":47.228727},"puissance_installee":800,"puissance_disponible":750},
  {"nom":"CHINON B","tranche":"CHINON B 2","coordonnees":{"lon":0.168307,"lat":47.228727},"puissance_installee":800,"puissance_disponible":780},
  {"nom":"CATTENOM","tranche":"CATTENOM 1","coordonnees":{"lon":6.218271,"lat":49.415953},"puissance_installee":1200,"puissance_disponible":1100},
  {"nom":"CATTENOM","tranche":"CATTENOM 2","coordonnees":{"lon":6.218271,"lat":49.415953},"puissance_installee":1200,"puissance_disponible":1150},
  {"nom":"CIVAUX","tranche":"CIVAUX 1","coordonnees":{"lon":0.648879,"lat":46.46218},"puissance_installee":1400,"puissance_disponible":1300},
  {"nom":"CIVAUX","tranche":"CIVAUX 2","coordonnees":{"lon":0.648879,"lat":46.46218},"puissance_installee":1400,"puissance_disponible":1350},
  {"nom":"FLAMANVILLE","tranche":"FLAMANVILLE 1","coordonnees":{"lon":-1.883342,"lat":49.535986},"puissance_installee":1200,"puissance_disponible":1150},
  {"nom":"FLAMANVILLE","tranche":"FLAMANVILLE 2","coordonnees":{"lon":-1.883342,"lat":49.535986},"puissance_installee":1200,"puissance_disponible":1180},
  {"nom":"ST-LAURENT-DES-EAUX B","tranche":"ST-LAURENT B 1","coordonnees":{"lon":1.580217,"lat":47.720248},"puissance_installee":915,"puissance_disponible":900},
  {"nom":"ST-LAURENT-DES-EAUX B","tranche":"ST-LAURENT B 2","coordonnees":{"lon":1.580217,"lat":47.720248},"puissance_installee":915,"puissance_disponible":895},
  {"nom":"TRICASTIN (LE)","tranche":"TRICASTIN 2","coordonnees":{"lon":4.731541,"lat":44.326355},"puissance_installee":915,"puissance_disponible":890},
  {"nom":"TRICASTIN (LE)","tranche":"TRICASTIN 3","coordonnees":{"lon":4.731541,"lat":44.326355},"puissance_installee":915,"puissance_disponible":885},
  {"nom":"TRICASTIN (LE)","tranche":"TRICASTIN 4","coordonnees":{"lon":4.731541,"lat":44.326355},"puissance_installee":915,"puissance_disponible":870},
  {"nom":"CATTENOM","tranche":"CATTENOM 3","coordonnees":{"lon":6.218271,"lat":49.415953},"puissance_installee":1200,"puissance_disponible":1150},
  {"nom":"CATTENOM","tranche":"CATTENOM 4","coordonnees":{"lon":6.218271,"lat":49.415953},"puissance_installee":1200,"puissance_disponible":1100},
  {"nom":"GRAVELINES","tranche":"GRAVELINES 6","coordonnees":{"lon":2.139287,"lat":51.012846},"puissance_installee":860,"puissance_disponible":840},
  {"nom":"DAMPIERRE-EN-BURLY","tranche":"DAMPIERRE 1","coordonnees":{"lon":2.517824,"lat":47.732638},"puissance_installee":870,"puissance_disponible":850},
  {"nom":"DAMPIERRE-EN-BURLY","tranche":"DAMPIERRE 2","coordonnees":{"lon":2.517824,"lat":47.732638},"puissance_installee":870,"puissance_disponible":840},
  {"nom":"DAMPIERRE-EN-BURLY","tranche":"DAMPIERRE 4","coordonnees":{"lon":2.517824,"lat":47.732638},"puissance_installee":870,"puissance_disponible":830},
  {"nom":"GOLFECH","tranche":"GOLFECH 3","coordonnees":{"lon":0.84572,"lat":44.105751},"puissance_installee":1000,"puissance_disponible":950},
  {"nom":"BUGEY (LE)","tranche":"BUGEY 3","coordonnees":{"lon":5.266072,"lat":45.801148},"puissance_installee":850, "puissance_disponible":0},
  {"nom":"BUGEY (LE)","tranche":"BUGEY 4","coordonnees":{"lon":5.266072,"lat":45.801148},"puissance_installee":830, "puissance_disponible": 100},
  {"nom":"NOGENT-SUR-SEINE","tranche":"NOGENT 3","coordonnees":{"lon":3.524182,"lat":48.514581},"puissance_installee":1150, "puissance_disponible": 100}
]


export const centraleDecale =[
    {
      "centrale": "BELLEVILLE",
      "tranche": "BELLEVILLE 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 2.875676,
        "lat": 47.308946
      },
      "puissance_disponible": 1310
    },
    {
      "centrale": "BELLEVILLE",
      "tranche": "BELLEVILLE 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 3.275676,
        "lat": 47.308946
      },
      "puissance_disponible": 1310
    },
    {
      "centrale": "BLAYAIS (LE)",
      "tranche": "BLAYAIS 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": -0.690606,
        "lat": 45.257605
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "BLAYAIS (LE)",
      "tranche": "BLAYAIS 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": -0.290606,
        "lat": 45.257605
      },
      "puissance_disponible": 910
    },
    {
      "centrale": "BLAYAIS (LE)",
      "tranche": "BLAYAIS 3",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 0.109394,
        "lat": 45.257605
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "BLAYAIS (LE)",
      "tranche": "BLAYAIS 4",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 0.509394,
        "lat": 45.257605
      },
      "puissance_disponible": 910
    },
    {
      "centrale": "BUGEY (LE)",
      "tranche": "BUGEY 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 5.266072,
        "lat": 45.801148
      },
      "puissance_disponible": 910
    },
    {
      "centrale": "BUGEY (LE)",
      "tranche": "BUGEY 3",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 5.666072,
        "lat": 45.801148
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "BUGEY (LE)",
      "tranche": "BUGEY 4",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 6.066072,
        "lat": 45.801148
      },
      "puissance_disponible": 880
    },
    {
      "centrale": "BUGEY (LE)",
      "tranche": "BUGEY 5",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 6.466072,
        "lat": 45.801148
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "CATTENOM",
      "tranche": "CATTENOM 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 6.218271,
        "lat": 49.415953
      },
      "puissance_disponible": 1300
    },
    {
      "centrale": "CATTENOM",
      "tranche": "CATTENOM 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 6.618271,
        "lat": 49.415953
      },
      "puissance_disponible": 1300
    },
    {
      "centrale": "CATTENOM",
      "tranche": "CATTENOM 3",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 6.218271,
        "lat": 49.205953
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "CATTENOM",
      "tranche": "CATTENOM 4",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 6.618271,
        "lat": 49.205953
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "CHINON B",
      "tranche": "CHINON B 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 0.168307,
        "lat": 47.228727
      },
      "puissance_disponible": 905
    },
    {
      "centrale": "CHINON B",
      "tranche": "CHINON B 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 0.568307,
        "lat": 47.228727
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "CHINON B",
      "tranche": "CHINON B 3",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 0.968307,
        "lat": 47.228727
      },
      "puissance_disponible": 905
    },
    {
      "centrale": "CHINON B",
      "tranche": "CHINON B 4",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 1.368307,
        "lat": 47.228727
      },
      "puissance_disponible": 905
    },
    {
      "centrale": "CHOOZ B",
      "tranche": "CHOOZ B 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 4.789588,
        "lat": 49.990344
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "CHOOZ B",
      "tranche": "CHOOZ B 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 4.789588,
        "lat": 49.790344
      },
      "puissance_disponible": 1390
    },
    {
      "centrale": "CIVAUX",
      "tranche": "CIVAUX 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 0.648879,
        "lat": 46.46218
      },
      "puissance_disponible": 1495
    },
    {
      "centrale": "CIVAUX",
      "tranche": "CIVAUX 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 1.048879,
        "lat": 46.46218
      },
      "puissance_disponible": 1495
    },
    {
      "centrale": "CRUAS",
      "tranche": "CRUAS 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 4.750824,
        "lat": 44.63283
      },
      "puissance_disponible": 915
    },
    {
      "centrale": "CRUAS",
      "tranche": "CRUAS 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 5.150824,
        "lat": 44.63283
      },
      "puissance_disponible": 915
    },
    {
      "centrale": "CRUAS",
      "tranche": "CRUAS 3",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 5.550824,
        "lat": 44.63283
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "CRUAS",
      "tranche": "CRUAS 4",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 5.950824,
        "lat": 44.63283
      },
      "puissance_disponible": 915
    },
    {
      "centrale": "DAMPIERRE-EN-BURLY",
      "tranche": "DAMPIERRE 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 2.517824,
        "lat": 47.732638
      },
      "puissance_disponible": 275
    },
    {
      "centrale": "DAMPIERRE-EN-BURLY",
      "tranche": "DAMPIERRE 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 2.917824,
        "lat": 47.732638
      },
      "puissance_disponible": 890
    },
    {
      "centrale": "DAMPIERRE-EN-BURLY",
      "tranche": "DAMPIERRE 3",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 3.317824,
        "lat": 47.732638
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "DAMPIERRE-EN-BURLY",
      "tranche": "DAMPIERRE 4",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 3.717824,
        "lat": 47.732638
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "FLAMANVILLE",
      "tranche": "FLAMANVILLE 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": -1.883342,
        "lat": 49.535986
      },
      "puissance_disponible": 1330
    },
    {
      "centrale": "FLAMANVILLE",
      "tranche": "FLAMANVILLE 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": -1.483342,
        "lat": 49.535986
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "GOLFECH",
      "tranche": "GOLFECH 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 0.84572,
        "lat": 44.105751
      },
      "puissance_disponible": 1310
    },
    {
      "centrale": "GOLFECH",
      "tranche": "GOLFECH 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 1.24572,
        "lat": 44.105751
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "GRAVELINES",
      "tranche": "GRAVELINES 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 2.139287,
        "lat": 51.012846
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "GRAVELINES",
      "tranche": "GRAVELINES 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 2.539287,
        "lat": 51.012846
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "GRAVELINES",
      "tranche": "GRAVELINES 3",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 2.939287,
        "lat": 51.012846
      },
      "puissance_disponible": 910
    },
    {
      "centrale": "GRAVELINES",
      "tranche": "GRAVELINES 4",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 2.139287,
        "lat": 50.802846
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "GRAVELINES",
      "tranche": "GRAVELINES 5",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 2.539287,
        "lat": 50.802846
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "GRAVELINES",
      "tranche": "GRAVELINES 6",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 2.939287,
        "lat": 50.802846
      },
      "puissance_disponible": 910
    },
    {
      "centrale": "NOGENT-SUR-SEINE",
      "tranche": "NOGENT 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 3.524182,
        "lat": 48.514581
      },
      "puissance_disponible": 1310
    },
    {
      "centrale": "NOGENT-SUR-SEINE",
      "tranche": "NOGENT 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 3.924182,
        "lat": 48.514581
      },
      "puissance_disponible": 1310
    },
    {
      "centrale": "PALUEL",
      "tranche": "PALUEL 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 0.634759,
        "lat": 49.558754
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "PALUEL",
      "tranche": "PALUEL 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 1.034759,
        "lat": 49.558754
      },
      "puissance_disponible": 1330
    },
    {
      "centrale": "PALUEL",
      "tranche": "PALUEL 3",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 1.434759,
        "lat": 49.558754
      },
      "puissance_disponible": 1330
    },
    {
      "centrale": "PALUEL",
      "tranche": "PALUEL 4",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 1.834759,
        "lat": 49.558754
      },
      "puissance_disponible": 1230
    },
    {
      "centrale": "PENLY",
      "tranche": "PENLY 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 1.210236,
        "lat": 49.976144
      },
      "puissance_disponible": 1330
    },
    {
      "centrale": "PENLY",
      "tranche": "PENLY 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 1.610236,
        "lat": 49.976144
      },
      "puissance_disponible": 1040
    },
    {
      "centrale": "ST-ALBAN-ST-MAURICE",
      "tranche": "ST-ALBAN 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 4.755573,
        "lat": 45.405445
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "ST-ALBAN-ST-MAURICE",
      "tranche": "ST-ALBAN 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 5.155573,
        "lat": 45.405445
      },
      "puissance_disponible": 1335
    },
    {
      "centrale": "ST-LAURENT-DES-EAUX B",
      "tranche": "ST-LAURENT B 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 1.380217,
        "lat": 47.720248
      },
      "puissance_disponible": 915
    },
    {
      "centrale": "ST-LAURENT-DES-EAUX B",
      "tranche": "ST-LAURENT B 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 1.780217,
        "lat": 47.720248
      },
      "puissance_disponible": 0
    },
    {
      "centrale": "TRICASTIN (LE)",
      "tranche": "TRICASTIN 1",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 4.731541,
        "lat": 44.126355
      },
      "puissance_disponible": 915
    },
    {
      "centrale": "TRICASTIN (LE)",
      "tranche": "TRICASTIN 2",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 5.131541,
        "lat": 44.126355
      },
      "puissance_disponible": 915
    },
    {
      "centrale": "TRICASTIN (LE)",
      "tranche": "TRICASTIN 3",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 5.531541,
        "lat": 44.126355
      },
      "puissance_disponible": 915
    },
    {
      "centrale": "TRICASTIN (LE)",
      "tranche": "TRICASTIN 4",
      "point_gps_modifie_pour_afficher_la_carte_opendata": {
        "lon": 5.931541,
        "lat": 44.126355
      },
      "puissance_disponible": 915
    }
  ]
