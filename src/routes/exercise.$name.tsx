import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExerciseTrend } from "@/components/ExerciseTrend";
import { imageFor } from "@/lib/store";
export const Route = createFileRoute("/exercise/$name")({head:({params})=>({meta:[
 {title:`${params.name} progress — Bloom`},{name:"description",content:`Your recorded sets and weight trend for ${params.name}.`},
 {property:"og:title",content:`${params.name} progress — Bloom`},{property:"og:description",content:`Track your ${params.name} lifting history.`},
 {property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"},
]}),component:ExerciseDetail});
function ExerciseDetail() {
  const { name } = Route.useParams();
  const info = imageFor(name);
  return (
    <div className="space-y-5 px-5 pt-8">
      <Button asChild variant="ghost">
        <Link to="/exercises">
          <ArrowLeft /> Exercises
        </Link>
      </Button>

      <h1 className="break-words font-display text-3xl">{name}</h1>

      {info?.image && (
        <div className="overflow-hidden rounded-3xl bg-[#FAF7F2] p-4 shadow-soft dark:bg-card">
          <img
            src={info.image}
            alt={name}
            width={384}
            height={384}
            className="mx-auto h-56 w-56 object-contain"
          />
        </div>
      )}

      {info?.tip && (
        <p className="text-sm text-muted-foreground">{info.tip}</p>
      )}

      {info?.avoid && (
        <div className="rounded-2xl border border-border bg-card p-3.5 text-xs text-foreground shadow-sm">
          <p className="font-semibold text-foreground mb-0.5">Common mistake to avoid:</p>
          <p className="text-muted-foreground leading-relaxed">{info.avoid}</p>
        </div>
      )}

      {info?.myoAtlasLinks && info.myoAtlasLinks.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">MyoAtlas Guides & Anatomy</h2>
            <span className="text-[10px] text-primary font-medium">Video & Muscles</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {info.myoAtlasLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted hover:border-primary/40 transition-colors"
              >
                <span>{link.name}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>
      )}

      <ExerciseTrend name={name} />
    </div>
  );
}
