import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Play, X, Clock3, User, Check, MapPin } from "lucide-react";
import { FlowerIcon } from "@/components/FlowerIcon";
import { Garden } from "@/components/Garden";
import { Button } from "@/components/ui/button";
import { FinishSessionModal } from "@/components/FinishSessionModal";
import { setState, streak, today, uid, useStore } from "@/lib/store";
import { currentAccount, hasSkippedAuth, onAccountChange, type AuthAccount } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bloom — Your gym garden" },
      { name: "description", content: "Your flower garden, training streak, recent activity and today's workout." },
      { property: "og:title", content: "Bloom — Your gym garden" },
      { property: "og:description", content: "Every workout grows your garden. Resume your session or start a new one." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const nav = useNavigate();
  const [account, setAccount] = useState<AuthAccount | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(() => {
    if (typeof window === "undefined") return false;
    return !hasSkippedAuth();
  });

  useEffect(() => {
    void currentAccount().then((acc) => setAccount(acc));
    const unsub = onAccountChange((acc) => setAccount(acc));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (hasSkippedAuth()) {
      setCheckingAuth(false);
      return;
    }
    let alive = true;
    void currentAccount().then((acc) => {
      if (!alive) return;
      if (!acc && !hasSkippedAuth()) {
        void nav({ to: "/auth", replace: true });
      } else {
        setCheckingAuth(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [nav]);

  const s = useStore();
  const personalSessions = s.sessions.filter((session) => !session.sample);
  const st = streak(personalSessions);
  const [cancel, setCancel] = useState(false);
  const [finishActivityModal, setFinishActivityModal] = useState(false);
  const [now, setNow] = useState(Date.now());
  const last = personalSessions.at(-1);
  const completed = s.active?.reduce((n, e) => n + e.sets.filter((z) => z.done).length, 0) ?? 0;

  // Keep a 1-second ticker for ongoing exercise countdown
  useEffect(() => {
    if (!s.activeStartedAt) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [s.activeStartedAt]);

  // Automated completion for preset Quick Log sessions
  useEffect(() => {
    if (!s.activeStartedAt || !s.activeTargetMinutes || !s.activeActivity) return;
    const startTime = new Date(s.activeStartedAt).getTime();
    const targetMs = s.activeTargetMinutes * 60 * 1000;

    const checkAutoCompletion = () => {
      if (Date.now() >= startTime + targetMs) {
        const flower = s.activeFlower ?? s.flower;
        const completedAt = new Date().toISOString();
        setState((x) => ({
          ...x,
          active: null,
          activeStartedAt: undefined,
          activeFlower: undefined,
          activePlanName: undefined,
          activePlanId: undefined,
          activeActivity: undefined,
          activeLocation: undefined,
          activeTargetMinutes: undefined,
          sessions: [
            ...x.sessions,
            {
              id: uid(),
              date: today(),
              completedAt,
              activity: x.activeActivity ?? "Activity",
              minutes: x.activeTargetMinutes,
              location: x.activeLocation,
              exercises: [],
              flower,
              gardenId: x.mainGarden,
            },
          ],
        }));
      }
    };

    checkAutoCompletion();
    const timer = setInterval(checkAutoCompletion, 1000);
    return () => clearInterval(timer);
  }, [s.activeStartedAt, s.activeTargetMinutes, s.activeActivity, s.activeFlower, s.flower]);

  const isNonWorkoutActive = Boolean(s.activeActivity && s.activeActivity !== "Workout");
  const isWorkoutActive = Boolean(s.active !== null || s.activeActivity === "Workout");
  const hasActiveSession = isNonWorkoutActive || isWorkoutActive;

  const handleFinishNonWorkoutFromHome = (details: { feelingEmoji?: string; notes?: string }) => {
    if (!s.activeActivity) return;
    const completedAt = new Date().toISOString();
    const flower = s.activeFlower ?? s.flower;
    const elapsedMinutes = s.activeStartedAt
      ? Math.max(1, Math.round((Date.now() - new Date(s.activeStartedAt).getTime()) / 60000))
      : s.activeTargetMinutes ?? 30;

    setState((x) => ({
      ...x,
      active: null,
      activeStartedAt: undefined,
      activeFlower: undefined,
      activePlanName: undefined,
      activePlanId: undefined,
      activeActivity: undefined,
      activeLocation: undefined,
      activeTargetMinutes: undefined,
      sessions: [
        ...x.sessions,
        {
          id: uid(),
          date: today(),
          completedAt,
          activity: x.activeActivity ?? "Activity",
          minutes: elapsedMinutes,
          location: x.activeLocation,
          feelingEmoji: details.feelingEmoji,
          notes: details.notes,
          exercises: [],
          flower,
          gardenId: x.mainGarden,
        },
      ],
    }));
    setFinishActivityModal(false);
  };

  const discardActiveSession = () => {
    setState((x) => ({
      ...x,
      active: null,
      activeStartedAt: undefined,
      activeFlower: undefined,
      activePlanId: undefined,
      activePlanName: undefined,
      activeActivity: undefined,
      activeLocation: undefined,
      activeTargetMinutes: undefined,
    }));
    setCancel(false);
  };

  if (checkingAuth) {
    return <div className="min-h-screen" />;
  }

  // Calculate elapsed time for active session
  const elapsedMs = s.activeStartedAt ? Math.max(0, now - new Date(s.activeStartedAt).getTime()) : 0;
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  const remainingMinutes = s.activeTargetMinutes
    ? Math.max(0, s.activeTargetMinutes - elapsedMinutes)
    : null;

  return (
    <div className="space-y-6 px-5 pt-10">
      <header className="flex items-center justify-between gap-2">
        <h1 className="font-display text-4xl">Your garden</h1>
        <div className="flex shrink-0 items-center gap-2">
          {account ? (
            <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 rounded-full px-2.5 text-xs font-medium">
              <Link to="/profile">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="max-w-[120px] truncate">{account.firstName || account.fullName || "Profile"}</span>
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 rounded-full px-2.5 text-xs text-muted-foreground hover:text-foreground">
              <Link to="/auth">
                <User className="h-3.5 w-3.5" />
                <span>Sign in</span>
              </Link>
            </Button>
          )}
        </div>
      </header>

      <Garden
        sessions={personalSessions.filter((sess) => (sess.gardenId ?? "wild-meadow") === s.mainGarden)}
        gardenId={s.mainGarden}
      />

      <Button asChild className="h-16 w-full rounded-2xl text-lg">
        <Link to="/start">
          Start
          <ArrowRight />
        </Link>
      </Button>

      {/* Ongoing Exercises / Workouts */}
      {hasActiveSession && (
        <section className="space-y-3 border-y border-border py-4">
          {isNonWorkoutActive ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold">
                  <span className="text-xl">{s.activeFlower ?? "🌱"}</span>
                  {s.activeActivity} in progress
                </h2>
                {s.activeLocation && (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    📍 {s.activeLocation}
                  </span>
                )}
              </div>

              {s.activeTargetMinutes ? (
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {elapsedMinutes} / {s.activeTargetMinutes} min
                    </span>
                    <span className="font-medium text-foreground">
                      {remainingMinutes === 0 ? "Finishing up…" : `${remainingMinutes}m remaining`}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (elapsedMinutes / s.activeTargetMinutes) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {s.activeStartedAt &&
                    `Started ${new Date(s.activeStartedAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} (${elapsedMinutes} min elapsed)`}
                </p>
              )}

              {cancel ? (
                <>
                  <p className="text-sm">Discard this ongoing {s.activeActivity}?</p>
                  <div className="flex gap-2">
                    <Button className="flex-[2]" variant="outline" onClick={() => setCancel(false)}>
                      Keep it
                    </Button>
                    <Button className="flex-1" variant="destructive" onClick={discardActiveSession}>
                      Discard
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button asChild variant="secondary" className="flex-[2]">
                    <Link to="/activity">
                      <Play className="h-4 w-4" /> Resume
                    </Link>
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 gap-1"
                    onClick={() => setFinishActivityModal(true)}
                  >
                    <Check className="h-4 w-4" /> Finish
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCancel(true)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="font-semibold">Workout in progress</h2>
              <p className="text-sm text-muted-foreground">
                {s.activePlanName ? `${s.activePlanName} · ` : ""}
                {s.activeLocation ? `📍 ${s.activeLocation} · ` : ""}
                {s.active?.length ?? 0} exercises · {completed} sets completed
              </p>
              {s.activeStartedAt && (
                <p className="text-xs text-muted-foreground">
                  Started{" "}
                  {new Date(s.activeStartedAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
              {cancel ? (
                <>
                  <p className="text-sm">Discard this unfinished workout?</p>
                  <div className="flex gap-2">
                    <Button className="flex-[2]" variant="outline" onClick={() => setCancel(false)}>
                      Keep it
                    </Button>
                    <Button className="flex-1" variant="destructive" onClick={discardActiveSession}>
                      Discard
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button asChild variant="secondary" className="flex-[2]">
                    <Link to="/workout">
                      <Play className="h-4 w-4" /> Resume
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setCancel(true)}>
                    <X className="h-4 w-4" /> Cancel
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* Last activity section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Last activity</h2>
          <Link to="/history" className="text-xs font-medium text-primary">
            View history
          </Link>
        </div>
        {last ? (
          <div className="flex gap-3 rounded-2xl bg-card p-4 shadow-soft">
            <FlowerIcon flower={last.flower} className="h-9 w-9 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="break-words font-semibold">{last.activity}</p>
                {last.feelingEmoji && <span className="text-xl shrink-0">{last.feelingEmoji}</span>}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(last.completedAt ?? last.date + "T12:00").toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {last.completedAt
                  ? ` · ${new Date(last.completedAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`
                  : " · Time not recorded"}
              </p>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock3 className="h-3 w-3" />
                {last.minutes !== undefined ? `${last.minutes} min` : "Duration not recorded"}
                {last.exercises.length > 0 && ` · ${last.exercises.length} exercises`}
              </p>
              {last.location && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {last.location}
                </p>
              )}
              {last.notes && (
                <p className="mt-1.5 italic text-xs text-muted-foreground border-l-2 border-primary/40 pl-2">
                  "{last.notes}"
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No activities yet.</p>
        )}
      </section>

      <FinishSessionModal
        isOpen={finishActivityModal}
        flower={s.activeFlower ?? s.flower}
        activityName={s.activeActivity ?? "Activity"}
        durationMinutes={
          s.activeStartedAt
            ? Math.max(1, Math.round((Date.now() - new Date(s.activeStartedAt).getTime()) / 60000))
            : s.activeTargetMinutes ?? 30
        }
        onClose={() => setFinishActivityModal(false)}
        onConfirm={handleFinishNonWorkoutFromHome}
      />
    </div>
  );
}
