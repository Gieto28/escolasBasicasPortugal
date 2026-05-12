import { useCallback, useMemo, useRef, useState } from "react";

import type { School } from "./loadSchools";
import { loadAllSchools } from "./loadSchools";

import "./App.css";

function pickRandom<T>(items: T[]): T {
  const i = Math.floor(Math.random() * items.length);
  return items[i]!;
}

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
}

export default function App() {
  const schools = useMemo(() => loadAllSchools(), []);
  const [winner, setWinner] = useState<School | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tickName, setTickName] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const draw = useCallback(() => {
    if (schools.length === 0) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setWinner(null);
    setIsDrawing(true);

    const pool = schools.slice();
    shuffleInPlace(pool);
    const flashes = Math.min(28, Math.max(12, Math.floor(Math.log10(pool.length) * 10)));
    let step = 0;

    timerRef.current = setInterval(() => {
      const preview = pool[step % pool.length];
      setTickName(preview?.schoolName ?? "…");
      step++;
      if (step >= flashes) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        const chosen = pickRandom(schools);
        setWinner(chosen);
        setTickName(null);
        setIsDrawing(false);
      }
    }, 55);
  }, [schools]);

  return (
    <div className="shell">
      <header className="hero">
        <p className="eyebrow">Mestrado · sorteio único</p>
        <h1 className="title">Loteria de escola básica</h1>
        <p className="lede">
          Escolhe uma escola ao acaso entre todas as fichas em{" "}
          <code className="mono">data/</code> (Norte, Centro, Lisboa e Vale do Tejo,
          Alentejo e Algarve). Cada clique é um novo sorteio uniforme.
        </p>
        <p className="stats">
          <strong>{schools.length.toLocaleString("pt-PT")}</strong> escolas carregadas
        </p>
      </header>

      <section className="panel">
        <button
          type="button"
          className="cta"
          onClick={draw}
          disabled={isDrawing || schools.length === 0}
        >
          {isDrawing ? "A sortear…" : "Sortear escola"}
        </button>

        {tickName && (
          <p className="tick" aria-live="polite">
            {tickName}
          </p>
        )}

        {winner && !isDrawing && <WinnerCard school={winner} />}
      </section>

      <footer className="foot">
        <p>
          Para gerar um único ficheiro HTML com dados incluídos:{" "}
          <code className="mono">npm install</code>, depois{" "}
          <code className="mono">npm run export-html</code> (cria{" "}
          <code className="mono">loteria-escolas-basicas.html</code>
          na raiz do projeto) ou <code className="mono">npm run build</code> e use{" "}
          <code className="mono">dist/index.html</code>.
        </p>
      </footer>
    </div>
  );
}

function WinnerCard({ school }: { school: School }) {
  const rows: { label: string; value: string }[] = [
    { label: "Nome da escola", value: school.schoolName },
    { label: "Agrupamento / UO", value: school.groupingName },
    { label: "Código", value: school.schoolCode },
    { label: "Região (ficheiro)", value: school.regionFile },
    { label: "Distrito", value: school.district },
    { label: "Concelho", value: school.municipality },
    { label: "Localidade", value: school.locality },
    { label: "Morada", value: school.address },
    { label: "Ciclos", value: school.cycles },
    { label: "Natureza institucional", value: school.institutionalNature },
    { label: "Email", value: school.email },
    { label: "Telefone", value: school.phone },
  ].filter((r) => r.value.trim().length > 0);

  return (
    <article className="winner">
      <h2 className="winner-title">Escola sorteada</h2>
      <dl className="grid">
        {rows.map((r) => (
          <div key={r.label} className="row">
            <dt>{r.label}</dt>
            <dd>{r.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
