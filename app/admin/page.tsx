import Link from "next/link";
import { Music2, Radio, Disc3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-bebas text-3xl uppercase text-foreground">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez les concerts, les singles et les liens presse / TV / radio.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="border-border bg-background">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Music2 className="h-6 w-6 text-primary" />
                Concerts
              </CardTitle>
              <CardDescription>
                Ajoutez et modifiez les dates de concert.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
              <Link href="/admin/concerts/new">
                <Plus className="h-5 w-5" />
                Ajouter un concert
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/admin/concerts">Voir la liste des concerts</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-background">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Disc3 className="h-6 w-6 text-primary" />
                Singles
              </CardTitle>
              <CardDescription>
                Gérez les singles (cover, YouTube, ordre d&apos;affichage).
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
              <Link href="/admin/singles/new">
                <Plus className="h-5 w-5" />
                Ajouter un single
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/admin/singles">Voir la liste des singles</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-background">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Radio className="h-6 w-6 text-primary" />
                Presse / TV / Radio
              </CardTitle>
              <CardDescription>
                Gérez les liens vers articles et émissions.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
              <Link href="/admin/press/new">
                <Plus className="h-5 w-5" />
                Ajouter un lien presse
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/admin/press">Voir la liste des liens</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
