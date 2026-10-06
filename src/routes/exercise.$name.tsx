import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExerciseTrend } from "@/components/ExerciseTrend";
import { imageFor } from "@/lib/store";
export const Route = createFileRoute("/exercise/$name")({head:({params})=>({meta:[
 {title:`${params.name} progress — Bloom`},{name:"description",content:`Your recorded sets and weight trend for ${params.name}.`},
 {property:"og:title",content:`${params.name} progress — Bloom`},{property:"og:description",content:`Track your ${params.name} lifting history.`},
 {property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"},
]}),component:ExerciseDetail});
function ExerciseDetail(){const {name}=Route.useParams();const info=imageFor(name);return <div className="space-y-5 px-5 pt-8"><Button asChild variant="ghost"><Link to="/exercises"><ArrowLeft /> Exercises</Link></Button><h1 className="break-words font-display text-3xl">{name}</h1>{info?.image && <img src={info.image} alt={name} width={384} height={384} className="mx-auto h-48 w-48 rounded-2xl object-contain" />}{info && <p className="text-sm text-muted-foreground">{info.tip}</p>}<ExerciseTrend name={name} /></div>}
