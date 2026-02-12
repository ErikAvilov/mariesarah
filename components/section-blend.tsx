/**
 * Bande de dégradé entre deux sections pour un crossfade fluide des fonds.
 * Pure CSS, pas d’animation au scroll — le dégradé est la transition visuelle.
 */
type ThemeBg = "background" | "card" | "secondary";

interface SectionBlendProps {
  /** Couleur de fond de la section précédente (thème) */
  from: ThemeBg;
  /** Couleur de fond de la section suivante (thème) */
  to: ThemeBg;
}

const themeVar = (name: ThemeBg) => `var(--${name})`;

export function SectionBlend({ from, to }: SectionBlendProps) {
  const fromColor = themeVar(from);
  const toColor = themeVar(to);

  return (
    <div
      className="section-blend"
      style={{
        background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
      }}
      aria-hidden
    />
  );
}
