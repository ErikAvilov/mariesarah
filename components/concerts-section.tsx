import { getConcerts } from "@/lib/concerts";
import type { Lang } from "@/lib/data";
import { ConcertsInteractive } from "@/components/concerts-interactive";

export async function ConcertsSection({ lang }: { lang: Lang }) {
  const { upcoming, past } = await getConcerts();
  return (
    <ConcertsInteractive lang={lang} upcoming={upcoming} past={past} />
  );
}
