export type GeoFeature = {
  geometry?: { x?: number; y?: number };
  attributes: {
    OBJECTID?: number;
    CODUOME?: string;
    NOMEUO?: string;
    CODESCME?: string | number;
    NOME?: string;
    SEDE?: string;
    MORADA?: string;
    LOCALIDADE?: string;
    CONCELHO?: string;
    DISTRITO?: string;
    CODDSR?: string;
    CODQZP?: string;
    CICLO?: string;
    NATUREZAINSTITUCIONAL_DESC?: string;
    FAX?: string;
    URL?: string;
    EMAIL?: string;
    TELEFONE?: string;
  };
};

export type GeoDataset = {
  transportType?: string;
  layers?: Array<{
    id?: number;
    features?: GeoFeature[];
  }>;
};
