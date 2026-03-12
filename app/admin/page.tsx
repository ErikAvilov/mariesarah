import Link from "next/link";
import { Music2, Radio } from "lucide-react";
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
          Gérez les concerts et les liens presse / TV / radio.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="border-border bg-background">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Music2 className="h-5 w-5 text-primary" />
                Concerts
              </CardTitle>
              <CardDescription>
                Ajoutez et modifiez les dates de concert.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/concerts/new">Ajouter un concert</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/admin/concerts">Voir la liste des concerts</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-background">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Radio className="h-5 w-5 text-primary" />
                Presse / TV / Radio
              </CardTitle>
              <CardDescription>
                Gérez les liens vers articles et émissions.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/press/new">Ajouter un lien presse</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/admin/press">Voir la liste des liens</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
