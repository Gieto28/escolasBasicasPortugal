import type { GeoDataset } from "./types";

import alentejo from "../data/alentejo.json";
import algarve from "../data/algarve.json";
import centro from "../data/centro.json";
import lisboa from "../data/lisboa_e_vale_do_tejo.json";
import norte from "../data/norte.json";

const FILES: { regionLabel: string; data: GeoDataset }[] = [
  { regionLabel: "Alentejo", data: alentejo as GeoDataset },
  { regionLabel: "Algarve", data: algarve as GeoDataset },
  { regionLabel: "Centro", data: centro as GeoDataset },
  { regionLabel: "Lisboa e Vale do Tejo", data: lisboa as GeoDataset },
  { regionLabel: "Norte", data: norte as GeoDataset },
];

export type School = {
  regionFile: string;
  schoolName: string;
  groupingName: string;
  municipality: string;
  district: string;
  locality: string;
  address: string;
  institutionalNature: string;
  cycles: string;
  email: string;
  phone: string;
  schoolCode: string;
};

function normalizeSchool(regionLabel: string, raw: GeoDataset): School[] {
  const layer = raw.layers?.[0];
  if (!layer?.features?.length) return [];

  return layer.features.map((f) => {
    const a = f.attributes;
    return {
      regionFile: regionLabel,
      schoolName: a.NOME ?? "",
      groupingName: a.NOMEUO ?? "",
      schoolCode: String(a.CODESCME ?? ""),
      address: a.MORADA ?? "",
      locality: a.LOCALIDADE ?? "",
      municipality: a.CONCELHO ?? "",
      district: a.DISTRITO ?? "",
      cycles: a.CICLO ?? "",
      institutionalNature: a.NATUREZAINSTITUCIONAL_DESC ?? "",
      email: a.EMAIL ?? "",
      phone: a.TELEFONE ?? "",
    };
  });
}

export function loadAllSchools(): School[] {
  return FILES.flatMap(({ regionLabel, data }) =>
    normalizeSchool(regionLabel, data),
  );
}
