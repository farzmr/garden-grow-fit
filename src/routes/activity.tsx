import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { ArrowLeft, Check, Pause, Play, Sparkles, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinishSessionModal } from "@/components/FinishSessionModal";
import { FlowerIcon } from "@/components/FlowerIcon";
import { InspirationalBanner } from "@/components/InspirationalBanner";
import { setState, today, uid, useStore } from "@/lib/store";
import { getRandomQuote } from "@/lib/quotes";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Active Activity — Bloom" },
      { name: "description", content: "Track your active session in real-time." },
    ],
  }),
  component: ActivityTrackerPage,
});

function ActivityTrackerPage() {
  const s = useStore();
  const nav = useNavigate();
  const posthog = usePostHog();
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [planted, setPlanted] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [quote] = useState(() => getRandomQuote());

  // If there's no active activity, redirect to home
  useEffect(() => {
    if (!s.activeStartedAt || !s.activeActivity || s.activeActivity === "Workout") {
      void nav({ to: "/" });
    }
  }, [s.activeStartedAt, s.activeActivity, nav]);

  // Track live elapsed time
  useEffect(() => {
    if (!s.activeStartedAt) return;
    const startTime = new Date(s.activeStartedAt).getTime();

    const updateTimer = () => {
      if (!isPaused) {
        const diff = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
        setSeconds(diff);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [s.activeStartedAt, isPaused]);

  if (!s.activeStartedAt || !s.activeActivity) {
    return <div className="min-h-screen" />;
  }

  const flower = s.activeFlower ?? s.flower;
  const activityName = s.activeActivity;
  const elapsedMinutes = Math.max(1, Math.round(seconds / 60));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const h = Math.floor(m / 60);
    if (h > 0) {
      const remM = m % 60;
      return `${h}:${String(remM).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleFinish = (details: { feelingEmoji?: string; notes?: string }) => {
    const completedAt = new Date().toISOString();
    posthog.capture("activity_completed", {
      duration_minutes: elapsedMinutes,
      tracking_mode: "live",
    });
    setState((x) => ({
      ...x,
      active: null,
      activeStartedAt: undefined,
      activeFlower: undefined,
      activePlanName: undefined,
      activePlanId: undefined,
      activeActivity: undefined,
      activeLocation: undefined,
      activeIntensity: undefined,
      sessions: [
        ...x.sessions,
        {
          id: uid(),
          date: today(),
          completedAt,
          activity: activityName,
          minutes: elapsedMinutes,
          location: x.activeLocation,
          feelingEmoji: details.feelingEmoji,
          notes: details.notes,
          intensity: x.activeIntensity,
          exercises: [],
          flower,
          gardenId: x.mainGarden,
        },
      ],
    }));
    setShowFinish(false);
    setPlanted(true);
    setTimeout(() => nav({ to: "/" }), 1600);
  };

  const handleDiscard = () => {
    posthog.capture("activity_discarded", {
      duration_minutes: elapsedMinutes,
      tracking_mode: "live",
    });
    setState((x) => ({
      ...x,
      active: null,
      activeStartedAt: undefined,
      activeFlower: undefined,
      activePlanName: undefined,
      activePlanId: undefined,
      activeActivity: undefined,
      activeLocation: undefined,
      activeIntensity: undefined,
    }));
    void nav({ to: "/" });
  };

  if (planted) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <FlowerIcon flower={flower} className="animate-bloom h-24 w-24" />
        <p className="font-display text-2xl">Session complete! Flower planted.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 px-5 pt-8">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="icon" className="h-9 w-9">
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live Session
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-destructive"
          onClick={() => setShowDiscard(true)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {showDiscard && (
        <div className="space-y-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-center">
          <p className="text-sm font-medium">Discard this {activityName} session?</p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowDiscard(false)}>
              Keep going
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleDiscard}>
              Discard
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-garden/40 shadow-inner">
          <div className={`${isPaused ? "opacity-60" : "animate-pulse"}`}>
            <FlowerIcon flower={flower} className="h-20 w-20" />
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl font-semibold">{activityName}</h1>
          {s.activeLocation && (
            <div className="mt-1 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                📍 {s.activeLocation}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3">
          <span className="font-mono text-5xl font-bold tracking-tight text-foreground">
            {formatTime(seconds)}
          </span>
          <p className="mt-1 text-xs text-muted-foreground">
            {isPaused ? "Session paused" : "Session in progress"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-14 flex-1 gap-2 rounded-2xl text-base font-semibold"
          onClick={() => setIsPaused((p) => !p)}
        >
          {isPaused ? (
            <>
              <Play className="h-5 w-5 text-primary" /> Resume
            </>
          ) : (
            <>
              <Pause className="h-5 w-5" /> Pause
            </>
          )}
        </Button>
        <Button
          type="button"
          className="h-14 flex-[2] gap-2 rounded-2xl text-base font-semibold shadow-soft"
          onClick={() => setShowFinish(true)}
        >
          <Check className="h-5 w-5" /> Finish & Plant
        </Button>
      </div>

      <InspirationalBanner quote={quote} />

      <FinishSessionModal
        isOpen={showFinish}
        flower={flower}
        activityName={activityName}
        durationMinutes={elapsedMinutes}
        onClose={() => setShowFinish(false)}
        onConfirm={handleFinish}
      />
    </div>
  );
}
