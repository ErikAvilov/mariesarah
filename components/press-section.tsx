import { getPressLinks } from "@/lib/press";
import type { Lang } from "@/lib/translations";
import { PressInteractive } from "@/components/press-interactive";

export async function PressSection({ lang }: { lang: Lang }) {
  let links: Awaited<ReturnType<typeof getPressLinks>> = [];
  try {
    links = await getPressLinks();
  } catch {
    links = [];
  }
  return <PressInteractive lang={lang} links={links} />;
}
