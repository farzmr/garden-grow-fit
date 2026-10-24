import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { imageFor, useStore } from "@/lib/store";

export function ExerciseTrend({ name }: { name: string }) {
  const s = useStore();
  const info = imageFor(name);
  const isDuration = info?.trackingType === "duration";
  const unit = info?.timeUnit ?? "sec";

  const records = s.sessions.flatMap(session => {
    const sets = session.exercises.filter(e => e.name === name).flatMap(e => e.sets);
    if (!sets.length) return [];
    const metric = isDuration
      ? Math.max(...sets.map(z => z.time ?? z.reps ?? z.weight))
      : Math.max(...sets.map(z => z.weight));
    return [{ id: session.id, date: session.date, time: session.completedAt, value: metric, sets }];
  }).sort((a, b) => (a.time ?? a.date).localeCompare(b.time ?? b.date));

  const last = records.at(-1);
  const data = records.map(r => ({
    date: new Date(r.date + "T12:00").toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    value: r.value,
  }));

  if (!last) return <p className="py-8 text-center text-sm text-muted-foreground">No recorded sets for {name} yet.</p>;

  return (
    <div className="space-y-6">
      <section className="flex items-end justify-between border-y border-border py-4">
        <div>
          <p className="text-xs text-muted-foreground">Last trained</p>
          <p className="mt-1 font-semibold">
            {new Date(last.date + "T12:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <p className="font-display text-3xl">
          {last.value}
          <span className="ml-1 font-sans text-sm text-muted-foreground">{unit}</span>
        </p>
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl">{isDuration ? "Duration over time" : "Weight over time"}</h2>
        <div className="h-56 w-full text-xs" role="img" aria-label={`${name} best by session: ${data.map(d => `${d.date}, ${d.value} ${unit}`).join('; ')}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 12, right: 18, bottom: 8, left: -18 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 'auto']} tick={{ fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: 8, color: "var(--foreground)" }}
                formatter={value => [`${value} ${unit}`, isDuration ? "Longest hold / set" : "Heaviest set"]}
              />
              <Line type="linear" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4, fill: "var(--primary)" }} activeDot={{ r: 6 }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground">{isDuration ? `Longest set · ${unit}` : "Heaviest set · kg"}</p>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl">Recorded sessions</h2>
        <div className="divide-y divide-border">
          {[...records].reverse().map(r => (
            <article key={r.id} className="py-3">
              <p className="text-sm font-semibold">{r.date}{r.time && ` · ${new Date(r.time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {isDuration
                  ? r.sets.map(z => `${z.time ?? z.reps ?? z.weight} ${unit}`).join(' · ')
                  : r.sets.map(z => `${z.weight} kg × ${z.reps}`).join(' · ')}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
