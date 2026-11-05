import { useSyncExternalStore } from "react";
import squat from "@/assets/ex-squat.jpg";
import deadlift from "@/assets/ex-deadlift.jpg";
import lunge from "@/assets/ex-lunge.jpg";
import press from "@/assets/ex-press.jpg";
import row from "@/assets/ex-row.jpg";
import bridge from "@/assets/ex-bridge.jpg";
import bench from "@/assets/ex-bench.jpg";
import legPress from "@/assets/ex-leg-press.jpg";
import lat from "@/assets/ex-lat-pulldown.jpg";
import extension from "@/assets/ex-leg-extension.jpg";
import chest from "@/assets/ex-chest-press.jpg";
import adduction from "@/assets/ex-adduction.jpg";
import abduction from "@/assets/ex-abduction.jpg";
import back from "@/assets/ex-back-extension.jpg";
import stairs from "@/assets/ex-stairs.jpg";
import elliptical from "@/assets/ex-elliptical.jpg";
import cableRow from "@/assets/ex-cable-row.jpg";
import legCurl from "@/assets/ex-leg-curl.jpg";
import pushup from "@/assets/ex-pushup.jpg";
import bicep from "@/assets/ex-bicep-curl.jpg";
import tricep from "@/assets/ex-tricep.jpg";
import lateralRaise from "@/assets/ex-lateral-raise.jpg";
import calfRaise from "@/assets/ex-calf-raise.jpg";
import plank from "@/assets/ex-plank.jpg";
import crunch from "@/assets/ex-crunch.jpg";
import bike from "@/assets/ex-bike.jpg";
import treadmill from "@/assets/ex-treadmill.jpg";
import rowing from "@/assets/ex-rowing.jpg";

export type ExerciseCategory = "Chest" | "Back" | "Shoulders" | "Legs" | "Arms" | "Core" | "Cardio";
export type TrackingType = "weight" | "duration";
export type TimeUnit = "sec" | "min";
export type WeightUnit = "lb" | "kg";
export type ExternalGuideLink = { name: string; url: string };

export type CardioSettingKey = "speed" | "incline" | "resistance" | "level" | "cadence";

export type CardioSettingConfig = {
  key: CardioSettingKey;
  label: string;
  suffix: string;
  step: number;
  defaultVal: number;
  presets: number[];
  min?: number;
  max?: number;
};

export type ExerciseInfo = {
  name: string;
  image?: string;
  tip: string;
  avoid?: string;
  category?: ExerciseCategory;
  trackingType?: TrackingType;
  timeUnit?: TimeUnit;
  myoAtlasLinks?: ExternalGuideLink[];
};

export const EXERCISE_LIBRARY: ExerciseInfo[] = [
  // Legs
  {
    name: "Back Squat",
    image: squat,
    category: "Legs",
    tip: "Chest up, knees track over toes, sit back and down.",
    avoid: "Don't let your knees cave inward or let your heels lift off the floor.",
    myoAtlasLinks: [
      { name: "Barbell Full Squat", url: "https://myoatlas.com/exercises/barbell-full-squat-60n" },
      { name: "Barbell Front Squat", url: "https://myoatlas.com/exercises/barbell-front-squat-60m" }
    ],
  },
  {
    name: "Front Squat",
    image: squat,
    category: "Legs",
    tip: "Keep elbows high and torso upright, drive out of the bottom with quads.",
    avoid: "Don't drop your elbows or round your upper back forward.",
    myoAtlasLinks: [
      { name: "Barbell Front Squat", url: "https://myoatlas.com/exercises/barbell-front-squat-60m" },
      { name: "Barbell Clean Grip Front Squat", url: "https://myoatlas.com/exercises/barbell-clean-grip-front-squat-609" }
    ],
  },
  {
    name: "Goblet Squat",
    image: squat,
    category: "Legs",
    tip: "Hold weight tight against your chest, keep knees out and back flat.",
    avoid: "Don't let the weight pull your chest down or round your spine.",
    myoAtlasLinks: [
      { name: "Dumbbell Goblet Squat", url: "https://myoatlas.com/exercises/dumbbell-goblet-squat-7ux" },
      { name: "Kettlebell Goblet Squat", url: "https://myoatlas.com/exercises/kettlebell-goblet-squat-6o0" }
    ],
  },
  // Back
  {
    name: "Deadlift",
    image: deadlift,
    category: "Back",
    tip: "Flat back, push the floor away, squeeze glutes at the top.",
    avoid: "Never round your lower back or jerk the bar off the floor with your arms.",
    myoAtlasLinks: [
      { name: "Barbell Deadlift", url: "https://myoatlas.com/exercises/barbell-deadlift-602" },
      { name: "Barbell Clean Deadlift", url: "https://myoatlas.com/exercises/barbell-clean-deadlift-72h" }
    ],
  },
  // Legs
  {
    name: "Romanian Deadlift (RDL)",
    image: deadlift,
    category: "Legs",
    tip: "Hinge hips back with a slight knee bend until hamstrings are fully stretched.",
    avoid: "Don't bend your knees into a squat or allow the barbell to drift away from your legs.",
    myoAtlasLinks: [
      { name: "Barbell Romanian Deadlift", url: "https://myoatlas.com/exercises/barbell-romanian-deadlift-61t" },
      { name: "Dumbbell Romanian Deadlift", url: "https://myoatlas.com/exercises/dumbbell-romanian-deadlift-7t1" }
    ],
  },
  {
    name: "Sumo Deadlift",
    image: deadlift,
    category: "Legs",
    tip: "Wide stance, toes flared, drive hips forward to lockout.",
    avoid: "Don't let your knees collapse inward or shoot your hips up before your chest.",
    myoAtlasLinks: [
      { name: "Barbell Sumo Deadlift", url: "https://myoatlas.com/exercises/barbell-sumo-deadlift-62p" },
      { name: "Barbell Deadlift", url: "https://myoatlas.com/exercises/barbell-deadlift-602" }
    ],
  },
  {
    name: "Walking Lunge",
    image: lunge,
    category: "Legs",
    tip: "Long step, back knee hovers above the floor, keep torso tall.",
    avoid: "Don't slam your back knee into the ground or let your front knee wobble inward.",
    myoAtlasLinks: [
      { name: "Dumbbell Walking Lunge", url: "https://myoatlas.com/exercises/dumbbell-walking-lunge-93q" },
      { name: "Dumbbell Walking Lunges", url: "https://myoatlas.com/exercises/dumbbell-walking-lunges-73j" }
    ],
  },
  {
    name: "Bulgarian Split Squat",
    image: lunge,
    category: "Legs",
    tip: "Rear foot on bench, lower straight down until back knee hovers.",
    avoid: "Don't lean excessively forward or push off your back foot.",
    myoAtlasLinks: [
      { name: "Dumbbell Single Leg Split Squat", url: "https://myoatlas.com/exercises/dumbbell-single-leg-split-squat-6ku" },
      { name: "Barbell Single Leg Split Squat", url: "https://myoatlas.com/exercises/barbell-single-leg-split-squat-627" }
    ],
  },
  {
    name: "Incline Leg Press",
    image: legPress,
    category: "Legs",
    tip: "Keep your back against the pad; avoid locking knees.",
    avoid: "Never lock out your knees at the top or let your lower back peel off the pad.",
    myoAtlasLinks: [
      { name: "Sled 45 Degrees Leg Press", url: "https://myoatlas.com/exercises/sled-45-degrees-leg-press-7t3" },
      { name: "Assisted Single Leg Press", url: "https://myoatlas.com/exercises/assisted-single-leg-press-6by" }
    ],
  },
  {
    name: "Hack Squat",
    image: legPress,
    category: "Legs",
    tip: "Feet shoulder-width on platform, keep back flush against pad.",
    avoid: "Don't lift your heels off the footplate or bounce out of the bottom.",
    myoAtlasLinks: [
      { name: "Sled Hack Squat", url: "https://myoatlas.com/exercises/sled-hack-squat-1r" },
      { name: "Barbell Hack Squat", url: "https://myoatlas.com/exercises/barbell-hack-squat-60q" }
    ],
  },
  {
    name: "Leg Extension",
    image: extension,
    category: "Legs",
    tip: "Extend smoothly without swinging; pause at the top.",
    avoid: "Don't kick or swing the weight with momentum; avoid hyper-extending knees.",
    myoAtlasLinks: [
      { name: "Lever Leg Extension", url: "https://myoatlas.com/exercises/lever-leg-extension-0b" }
    ],
  },
  {
    name: "Leg Curl",
    image: legCurl,
    category: "Legs",
    tip: "Keep hips against the pad and curl slowly toward glutes.",
    avoid: "Don't lift your hips off the pad or use lower-back hyperextension.",
    myoAtlasLinks: [
      { name: "Lever Seated Leg Curl", url: "https://myoatlas.com/exercises/lever-seated-leg-curl-11" },
      { name: "Lever Lying Leg Curl", url: "https://myoatlas.com/exercises/lever-lying-leg-curl-0c" }
    ],
  },
  {
    name: "Lying Leg Curl",
    image: legCurl,
    category: "Legs",
    tip: "Pin hips to bench, flex hamstrings to draw heels in.",
    avoid: "Don't arch your lower back off the bench to pull the pads.",
    myoAtlasLinks: [
      { name: "Lever Lying Leg Curl", url: "https://myoatlas.com/exercises/lever-lying-leg-curl-0c" }
    ],
  },
  {
    name: "Glute Bridge",
    image: bridge,
    category: "Legs",
    tip: "Drive through heels, pause and squeeze at the top.",
    avoid: "Don't arch your lower back instead of driving through your glutes.",
    myoAtlasLinks: [
      { name: "Barbell Glute Bridge", url: "https://myoatlas.com/exercises/barbell-glute-bridge-83v" },
      { name: "Barbell Hip Thrust", url: "https://myoatlas.com/exercises/barbell-hip-thrust-7t5" }
    ],
  },
  {
    name: "Hip Thrust",
    image: bridge,
    category: "Legs",
    tip: "Upper back on bench, drive hips straight up and hold for 1s.",
    avoid: "Don't crane your neck backward or hyperextend your lumbar spine at lockout.",
    myoAtlasLinks: [
      { name: "Barbell Hip Thrust", url: "https://myoatlas.com/exercises/barbell-hip-thrust-7t5" },
      { name: "Lever Hip Thrust", url: "https://myoatlas.com/exercises/lever-hip-thrust-7ru" }
    ],
  },
  {
    name: "Hip Adduction",
    image: adduction,
    category: "Legs",
    tip: "Bring knees inward slowly, without momentum.",
    avoid: "Don't let the weight stack slam or use jerky momentum.",
    myoAtlasLinks: [
      { name: "Lever Seated Hip Adduction", url: "https://myoatlas.com/exercises/lever-seated-hip-adduction-10" },
      { name: "Cable Hip Adduction", url: "https://myoatlas.com/exercises/cable-hip-adduction-63e" }
    ],
  },
  {
    name: "Hip Abduction",
    image: abduction,
    category: "Legs",
    tip: "Push knees outward with a steady torso.",
    avoid: "Don't lean forward or use your torso to heave the weight.",
    myoAtlasLinks: [
      { name: "Lever Seated Hip Abduction", url: "https://myoatlas.com/exercises/lever-seated-hip-abduction-19" },
      { name: "Cable Hip Abduction", url: "https://myoatlas.com/exercises/cable-hip-abduction-6xv" }
    ],
  },
  {
    name: "Standing Calf Raise",
    image: calfRaise,
    category: "Legs",
    tip: "Deep stretch at bottom, push high onto big toes.",
    avoid: "Don't bounce at the bottom; pause to avoid Achilles recoil.",
    myoAtlasLinks: [
      { name: "Barbell Standing Calf Raise", url: "https://myoatlas.com/exercises/barbell-standing-calf-raise-790" },
      { name: "Lever Standing Calf Raise", url: "https://myoatlas.com/exercises/lever-standing-calf-raise-14" }
    ],
  },
  {
    name: "Seated Calf Raise",
    image: calfRaise,
    category: "Legs",
    tip: "Lower heels down deep, then press up high for soleus isolation.",
    avoid: "Don't rush the reps; avoid cutting the bottom stretch.",
    myoAtlasLinks: [
      { name: "Lever Seated Calf Raise", url: "https://myoatlas.com/exercises/lever-seated-calf-raise-17" },
      { name: "Dumbbell Seated Calf Raise", url: "https://myoatlas.com/exercises/dumbbell-seated-calf-raise-79f" }
    ],
  },
  // Chest
  {
    name: "Bench Press",
    image: bench,
    category: "Chest",
    tip: "Keep feet planted, retract shoulder blades, lower bar with control.",
    avoid: "Don't flare your elbows out at 90 degrees or bounce the bar off your sternum.",
    myoAtlasLinks: [
      { name: "Barbell Bench Press", url: "https://myoatlas.com/exercises/barbell-bench-press-605" },
      { name: "Dumbbell Bench Press", url: "https://myoatlas.com/exercises/dumbbell-bench-press-6hh" }
    ],
  },
  {
    name: "Incline Bench Press",
    image: bench,
    category: "Chest",
    tip: "Arch slightly, plant feet firmly, press bar over upper chest.",
    avoid: "Don't arch your lower back excessively to turn it into a flat press.",
    myoAtlasLinks: [
      { name: "Barbell Incline Bench Press", url: "https://myoatlas.com/exercises/barbell-incline-bench-press-60r" },
      { name: "Dumbbell Incline Bench Press", url: "https://myoatlas.com/exercises/dumbbell-incline-bench-press-6i6" }
    ],
  },
  {
    name: "Decline Bench Press",
    image: bench,
    category: "Chest",
    tip: "Focus on lower chest, keep shoulders tucked.",
    avoid: "Don't drop the bar toward your neck or lift your hips off the bench.",
    myoAtlasLinks: [
      { name: "Barbell Decline Bench Press", url: "https://myoatlas.com/exercises/barbell-decline-bench-press-603" },
      { name: "Dumbbell Decline Bench Press", url: "https://myoatlas.com/exercises/dumbbell-decline-bench-press-6ht" }
    ],
  },
  {
    name: "Dumbbell Bench Press",
    image: bench,
    category: "Chest",
    tip: "Press upward in an arc, squeezing your pecs at the top.",
    avoid: "Don't bang the dumbbells together at the top or let elbows drop too low.",
    myoAtlasLinks: [
      { name: "Dumbbell Bench Press", url: "https://myoatlas.com/exercises/dumbbell-bench-press-6hh" },
      { name: "Dumbbell Decline Bench Press", url: "https://myoatlas.com/exercises/dumbbell-decline-bench-press-6ht" }
    ],
  },
  {
    name: "Incline Dumbbell Press",
    image: bench,
    category: "Chest",
    tip: "Set bench at 30-45 degrees, lower dumbbells slowly to outer chest.",
    avoid: "Don't set the incline too steep (over 45°) or tuck elbows too close to sides.",
    myoAtlasLinks: [
      { name: "Dumbbell Incline Bench Press", url: "https://myoatlas.com/exercises/dumbbell-incline-bench-press-6i6" },
      { name: "Dumbbell Incline One Arm Press", url: "https://myoatlas.com/exercises/dumbbell-incline-one-arm-press-77i" }
    ],
  },
  {
    name: "Chest Press Machine",
    image: chest,
    category: "Chest",
    tip: "Keep shoulders down and press with control.",
    avoid: "Don't let your shoulders roll forward or shrug up toward your ears.",
    myoAtlasLinks: [
      { name: "Lever Chest Press", url: "https://myoatlas.com/exercises/lever-chest-press-0t" },
      { name: "Lever Incline Chest Press", url: "https://myoatlas.com/exercises/lever-incline-chest-press-47" }
    ],
  },
  {
    name: "Cable Crossover",
    image: chest,
    category: "Chest",
    tip: "Keep a soft bend in elbows, hug inward in an arc.",
    avoid: "Don't bend your elbows like a press or lean too far forward with your hips.",
    myoAtlasLinks: [
      { name: "Cable Upper Chest Crossovers", url: "https://myoatlas.com/exercises/cable-upper-chest-crossovers-7z3" },
      { name: "Cable Rope Crossover Seated Row", url: "https://myoatlas.com/exercises/cable-rope-crossover-seated-row-782" }
    ],
  },
  {
    name: "Pec Deck Fly",
    image: chest,
    category: "Chest",
    tip: "Keep elbows slightly bent and squeeze your chest together.",
    avoid: "Don't let the arms travel too far back behind your shoulder plane.",
    myoAtlasLinks: [
      { name: "Lever Pec Deck Fly", url: "https://myoatlas.com/exercises/lever-pec-deck-fly-2s" },
      { name: "Dumbbell Reverse Fly", url: "https://myoatlas.com/exercises/dumbbell-reverse-fly-6jd" }
    ],
  },
  {
    name: "Push-Up",
    image: pushup,
    category: "Chest",
    tip: "Keep core braced and lower chest until an inch above the floor.",
    avoid: "Don't let your lower back sag or flare your elbows straight out.",
    myoAtlasLinks: [
      { name: "Archer Push Up", url: "https://myoatlas.com/exercises/archer-push-up-8mu" },
      { name: "Incline Push Up", url: "https://myoatlas.com/exercises/incline-push-up-6n5" }
    ],
  },
  {
    name: "Chest Dips",
    image: tricep,
    category: "Chest",
    tip: "Lean forward slightly to target chest, lower to 90 degrees.",
    avoid: "Don't stay completely upright (which targets triceps) or dip below shoulder comfort.",
    myoAtlasLinks: [
      { name: "Chest Dip", url: "https://myoatlas.com/exercises/chest-dip-6gf" },
      { name: "Assisted Triceps Dip", url: "https://myoatlas.com/exercises/assisted-triceps-dip-7cc" }
    ],
  },
  // Back
  {
    name: "Lat Pulldown",
    image: lat,
    category: "Back",
    tip: "Pull toward your upper chest with a wide grip.",
    avoid: "Don't lean far back or use swinging body momentum to heave the bar down.",
    myoAtlasLinks: [
      { name: "Cable Lateral Pulldown", url: "https://myoatlas.com/exercises/cable-lateral-pulldown-643" },
      { name: "Cable Close Grip Front Lat Pulldown", url: "https://myoatlas.com/exercises/cable-close-grip-front-lat-pulldown-8zk" }
    ],
  },
  {
    name: "Dumbbell Row",
    image: row,
    category: "Back",
    tip: "Hinge forward, pull elbows toward your hips.",
    avoid: "Don't twist your torso or jerk your shoulder upward to hoist the dumbbell.",
    myoAtlasLinks: [
      { name: "Dumbbell Bent Over Row", url: "https://myoatlas.com/exercises/dumbbell-bent-over-row-6hl" },
      { name: "Dumbbell One Arm Bent Over Row", url: "https://myoatlas.com/exercises/dumbbell-one-arm-bent-over-row-6hk" }
    ],
  },
  {
    name: "Seated Cable Row",
    image: cableRow,
    category: "Back",
    tip: "Pull elbows back without rocking your torso.",
    avoid: "Don't round your lower back forward or violently rock back and forth.",
    myoAtlasLinks: [
      { name: "Cable Seated Row", url: "https://myoatlas.com/exercises/cable-seated-row-6x3" },
      { name: "Cable Seated High Row", url: "https://myoatlas.com/exercises/cable-seated-high-row-6f3" }
    ],
  },
  {
    name: "Barbell Bent-Over Row",
    image: row,
    category: "Back",
    tip: "Hinge at hips, keep flat back, pull bar to lower ribcage.",
    avoid: "Don't stand too upright or let your lumbar spine round under load.",
    myoAtlasLinks: [
      { name: "Barbell Bent Over Row", url: "https://myoatlas.com/exercises/barbell-bent-over-row-607" },
      { name: "Barbell Reverse Grip Bent Over Row", url: "https://myoatlas.com/exercises/barbell-reverse-grip-bent-over-row-62q" }
    ],
  },
  {
    name: "Pull-Up",
    image: lat,
    category: "Back",
    tip: "Grip wide with overhand grip, pull elbows down to ribs.",
    avoid: "Don't kick your legs (kipping) or pull with rounded shoulders.",
    myoAtlasLinks: [
      { name: "Archer Pull Up", url: "https://myoatlas.com/exercises/archer-pull-up-8mt" },
      { name: "Wide Grip Pull Up", url: "https://myoatlas.com/exercises/wide-grip-pull-up-8vc" }
    ],
  },
  {
    name: "Chin-Up",
    image: lat,
    category: "Back",
    tip: "Underhand grip, pull chin over bar, engage biceps and lats.",
    avoid: "Don't swing your legs or stop before achieving full arm extension at the bottom.",
    myoAtlasLinks: [
      { name: "Assisted Close Grip Underhand Chin Up", url: "https://myoatlas.com/exercises/assisted-close-grip-underhand-chin-up-7c6" },
      { name: "Archer Pull Up", url: "https://myoatlas.com/exercises/archer-pull-up-8mt" }
    ],
  },
  {
    name: "T-Bar Row",
    image: row,
    category: "Back",
    tip: "Keep spine neutral, pull handles tight to upper abdomen.",
    avoid: "Don't use momentum from your hips and lower back to jerk the weight.",
    myoAtlasLinks: [
      { name: "Lever T Bar Row", url: "https://myoatlas.com/exercises/lever-t-bar-row-1f" }
    ],
  },
  {
    name: "Single-Arm Cable Row",
    image: cableRow,
    category: "Back",
    tip: "Rotate torso slightly into stretch, drive elbow back.",
    avoid: "Don't twist your spine excessively; keep your core braced.",
    myoAtlasLinks: [
      { name: "Cable One Arm Twisting Seated Row", url: "https://myoatlas.com/exercises/cable-one-arm-twisting-seated-row-75a" },
      { name: "Cable Seated Row", url: "https://myoatlas.com/exercises/cable-seated-row-6x3" }
    ],
  },
  {
    name: "Face Pull",
    image: lateralRaise,
    category: "Back",
    tip: "Pull rope towards eyes while externally rotating shoulders.",
    avoid: "Don't pull downward to your neck; pull high toward forehead and rotate hands back.",
    myoAtlasLinks: [
      { name: "Band Face Pull", url: "https://myoatlas.com/exercises/band-face-pull-6y2" },
      { name: "Cable Rear Delt Row", url: "https://myoatlas.com/exercises/cable-rear-delt-row-64d" }
    ],
  },
  {
    name: "Straight Arm Lat Pulldown",
    image: lat,
    category: "Back",
    tip: "Soft elbows, sweep bar downward in an arc to thighs.",
    avoid: "Don't bend your elbows into a tricep pushdown; keep arms extended.",
    myoAtlasLinks: [
      { name: "Cable Straight Arm Pulldown", url: "https://myoatlas.com/exercises/cable-straight-arm-pulldown-6cj" },
      { name: "Cable Lateral Pulldown", url: "https://myoatlas.com/exercises/cable-lateral-pulldown-643" }
    ],
  },
  {
    name: "Back Extension",
    image: back,
    category: "Back",
    tip: "Hinge at hips; stop when body forms a straight line.",
    avoid: "Don't hyperextend your spine beyond a straight neutral line.",
    myoAtlasLinks: [
      { name: "45 Degree Hyperextension", url: "https://myoatlas.com/exercises/45-degree-hyperextension-6xt" },
      { name: "45 Degree Hyperextension", url: "https://myoatlas.com/exercises/45-degree-hyperextension-716" }
    ],
  },
  {
    name: "Shrugs",
    image: lateralRaise,
    category: "Back",
    tip: "Elevate shoulders straight up to ears without rolling.",
    avoid: "Don't roll your shoulders in circles; move straight up and down to protect joints.",
    myoAtlasLinks: [
      { name: "Barbell Shrug", url: "https://myoatlas.com/exercises/barbell-shrug-61d" },
      { name: "Dumbbell Shrug", url: "https://myoatlas.com/exercises/dumbbell-shrug-6kq" }
    ],
  },
  // Shoulders
  {
    name: "Shoulder Press",
    image: press,
    category: "Shoulders",
    tip: "Ribs down, press straight up, don't arch your back.",
    avoid: "Don't arch your lower back into an awkward curve or tilt your head down.",
    myoAtlasLinks: [
      { name: "Dumbbell Standing Overhead Press", url: "https://myoatlas.com/exercises/dumbbell-standing-overhead-press-6l0" },
      { name: "Barbell Seated Overhead Press", url: "https://myoatlas.com/exercises/barbell-seated-overhead-press-61z" }
    ],
  },
  {
    name: "Overhead Press",
    image: press,
    category: "Shoulders",
    tip: "Barbell on front delts, press vertically and lock out overhead.",
    avoid: "Don't lean back to turn it into an incline press; brace abs and glutes.",
    myoAtlasLinks: [
      { name: "Barbell Seated Overhead Press", url: "https://myoatlas.com/exercises/barbell-seated-overhead-press-61z" },
      { name: "Dumbbell Standing Overhead Press", url: "https://myoatlas.com/exercises/dumbbell-standing-overhead-press-6l0" }
    ],
  },
  {
    name: "Dumbbell Shoulder Press",
    image: press,
    category: "Shoulders",
    tip: "Keep palms facing forward or neutral, press up smoothly.",
    avoid: "Don't let the dumbbells flare too far back behind your ears.",
    myoAtlasLinks: [
      { name: "Dumbbell Standing Overhead Press", url: "https://myoatlas.com/exercises/dumbbell-standing-overhead-press-6l0" },
      { name: "Dumbbell Seated Shoulder Press", url: "https://myoatlas.com/exercises/dumbbell-seated-shoulder-press-6ko" }
    ],
  },
  {
    name: "Arnold Press",
    image: press,
    category: "Shoulders",
    tip: "Rotate palms from facing you to facing away as you press.",
    avoid: "Don't rush the rotation; rotate smoothly throughout the pressing path.",
    myoAtlasLinks: [
      { name: "Dumbbell Arnold Press", url: "https://myoatlas.com/exercises/dumbbell-arnold-press-6hf" },
      { name: "Dumbbell Standing Overhead Press", url: "https://myoatlas.com/exercises/dumbbell-standing-overhead-press-6l0" }
    ],
  },
  {
    name: "Dumbbell Lateral Raise",
    image: lateralRaise,
    category: "Shoulders",
    tip: "Lead with elbows, raise to parallel, control the lowering.",
    avoid: "Don't shrug with your traps or swing the weights up with your hips.",
    myoAtlasLinks: [
      { name: "Dumbbell Lateral Raise", url: "https://myoatlas.com/exercises/dumbbell-lateral-raise-6iq" },
      { name: "Dumbbell Seated Lateral Raise", url: "https://myoatlas.com/exercises/dumbbell-seated-lateral-raise-6kg" }
    ],
  },
  {
    name: "Cable Lateral Raise",
    image: lateralRaise,
    category: "Shoulders",
    tip: "Cable behind or in front of hips, lift smoothly for constant tension.",
    avoid: "Don't yank the cable with body swing; lift with deltoid control.",
    myoAtlasLinks: [
      { name: "Cable One Arm Lateral Raise", url: "https://myoatlas.com/exercises/cable-one-arm-lateral-raise-64s" },
      { name: "Cable Lateral Raise", url: "https://myoatlas.com/exercises/cable-lateral-raise-644" }
    ],
  },
  {
    name: "Front Raise",
    image: lateralRaise,
    category: "Shoulders",
    tip: "Lift dumbbells in front to shoulder height without swinging.",
    avoid: "Don't rock your torso backward to generate momentum.",
    myoAtlasLinks: [
      { name: "Dumbbell Front Raise", url: "https://myoatlas.com/exercises/dumbbell-front-raise-6hb" },
      { name: "Barbell Front Raise", url: "https://myoatlas.com/exercises/barbell-front-raise-60l" }
    ],
  },
  {
    name: "Reverse Pec Deck",
    image: lateralRaise,
    category: "Shoulders",
    tip: "Squeeze rear deltoids to pull arms back and out.",
    avoid: "Don't shrug your shoulders or bend elbows excessively.",
    myoAtlasLinks: [
      { name: "Lever Seated Reverse Fly", url: "https://myoatlas.com/exercises/lever-seated-reverse-fly-12" },
      { name: "Cable Standing Cross Over High Reverse Fly", url: "https://myoatlas.com/exercises/cable-standing-cross-over-high-reverse-fly-6fp" }
    ],
  },
  {
    name: "Upright Row",
    image: lateralRaise,
    category: "Shoulders",
    tip: "Pull elbows up high, keep bar close to your body.",
    avoid: "Don't pull wrists higher than elbows; avoid narrow grip if shoulders feel pinched.",
    myoAtlasLinks: [
      { name: "Barbell Upright Row", url: "https://myoatlas.com/exercises/barbell-upright-row-62s" },
      { name: "Cable Upright Row", url: "https://myoatlas.com/exercises/cable-upright-row-6g0" }
    ],
  },
  // Arms
  {
    name: "Barbell Bicep Curl",
    image: bicep,
    category: "Arms",
    tip: "Keep elbows glued to ribs, curl bar up with zero swing.",
    avoid: "Don't swing your hips or let your elbows drift forward away from your ribs.",
    myoAtlasLinks: [
      { name: "Barbell Alternate Biceps Curl", url: "https://myoatlas.com/exercises/barbell-alternate-biceps-curl-69d" },
      { name: "Barbell Preacher Curl", url: "https://myoatlas.com/exercises/barbell-preacher-curl-614" }
    ],
  },
  {
    name: "Dumbbell Bicep Curl",
    image: bicep,
    category: "Arms",
    tip: "Supinate wrists on way up, squeeze bicep at peak.",
    avoid: "Don't swing your torso or cut the bottom extension short.",
    myoAtlasLinks: [
      { name: "Dumbbell Biceps Curl", url: "https://myoatlas.com/exercises/dumbbell-biceps-curl-6hm" },
      { name: "Dumbbell Alternate Biceps Curl", url: "https://myoatlas.com/exercises/dumbbell-alternate-biceps-curl-6h3" }
    ],
  },
  {
    name: "Hammer Curl",
    image: bicep,
    category: "Arms",
    tip: "Keep palms facing inward to target brachialis and forearm.",
    avoid: "Don't twist your wrists; keep palms strictly facing each other.",
    myoAtlasLinks: [
      { name: "Dumbbell Hammer Curl", url: "https://myoatlas.com/exercises/dumbbell-hammer-curl-6he" },
      { name: "Cable Hammer Curl", url: "https://myoatlas.com/exercises/cable-hammer-curl-63b" }
    ],
  },
  {
    name: "Preacher Curl",
    image: bicep,
    category: "Arms",
    tip: "Lock triceps on pad, isolate biceps completely.",
    avoid: "Don't lift your armpits off the pad or bounce weight at the bottom.",
    myoAtlasLinks: [
      { name: "Barbell Preacher Curl", url: "https://myoatlas.com/exercises/barbell-preacher-curl-614" },
      { name: "Dumbbell Preacher Curl", url: "https://myoatlas.com/exercises/dumbbell-preacher-curl-6js" }
    ],
  },
  {
    name: "Incline Dumbbell Curl",
    image: bicep,
    category: "Arms",
    tip: "Lean back on incline bench for a full bicep stretch.",
    avoid: "Don't lift your shoulders off the back pad or bring elbows forward.",
    myoAtlasLinks: [
      { name: "Dumbbell Incline Biceps Curl", url: "https://myoatlas.com/exercises/dumbbell-incline-biceps-curl-6i7" },
      { name: "Dumbbell Incline Inner Biceps Curl", url: "https://myoatlas.com/exercises/dumbbell-incline-inner-biceps-curl-6i4" }
    ],
  },
  {
    name: "Cable Bicep Curl",
    image: bicep,
    category: "Arms",
    tip: "Maintain constant tension throughout range of motion.",
    avoid: "Don't allow the cable to pull your elbows forward; isolate the bicep.",
    myoAtlasLinks: [
      { name: "Cable Lying Biceps Curl", url: "https://myoatlas.com/exercises/cable-lying-biceps-curl-7xd" },
      { name: "Cable Preacher Curl", url: "https://myoatlas.com/exercises/cable-preacher-curl-64v" }
    ],
  },
  {
    name: "Tricep Pushdown",
    image: tricep,
    category: "Arms",
    tip: "Pin elbows by your sides, extend arms downward fully.",
    avoid: "Don't flare your elbows outward or use your bodyweight to press down.",
    myoAtlasLinks: [
      { name: "Cable Triceps Pushdown", url: "https://myoatlas.com/exercises/cable-triceps-pushdown-6g5" },
      { name: "Cable One Arm Tricep Pushdown", url: "https://myoatlas.com/exercises/cable-one-arm-tricep-pushdown-7ga" }
    ],
  },
  {
    name: "Skull Crusher",
    image: tricep,
    category: "Arms",
    tip: "Lower bar toward forehead, keep upper arms stationary.",
    avoid: "Don't let your upper arms sway back and forth; keep elbows locked in position.",
    myoAtlasLinks: [
      { name: "Barbell Lying Triceps Extension", url: "https://myoatlas.com/exercises/barbell-lying-triceps-extension-861" },
      { name: "Dumbbell Lying Triceps Extension", url: "https://myoatlas.com/exercises/dumbbell-lying-triceps-extension-6j7" }
    ],
  },
  {
    name: "Overhead Tricep Extension",
    image: tricep,
    category: "Arms",
    tip: "Lower weight behind head, press up to full arm extension.",
    avoid: "Don't let elbows flare out wide; keep them tucked close to ears.",
    myoAtlasLinks: [
      { name: "Cable Overhead Triceps Extension", url: "https://myoatlas.com/exercises/cable-overhead-triceps-extension-64u" }
    ],
  },
  {
    name: "Close-Grip Bench Press",
    image: bench,
    category: "Arms",
    tip: "Hands shoulder-width, tuck elbows tight to ribs.",
    avoid: "Don't place hands too close together (under 6 inches) to prevent wrist strain.",
    myoAtlasLinks: [
      { name: "Barbell Close Grip Bench Press", url: "https://myoatlas.com/exercises/barbell-close-grip-bench-press-600" },
      { name: "Barbell Bench Press", url: "https://myoatlas.com/exercises/barbell-bench-press-605" }
    ],
  },
  {
    name: "Tricep Dips",
    image: tricep,
    category: "Arms",
    tip: "Keep torso upright to focus load directly on triceps.",
    avoid: "Don't lean forward (targets chest) or let shoulders shrug upward.",
    myoAtlasLinks: [
      { name: "Bench Dip", url: "https://myoatlas.com/exercises/bench-dip-7xj" },
      { name: "Assisted Triceps Dip", url: "https://myoatlas.com/exercises/assisted-triceps-dip-7cc" }
    ],
  },
  // Core
  {
    name: "Plank",
    image: plank,
    category: "Core",
    tip: "Forearms down, straight line from head to heels, brace abs.",
    avoid: "Don't let your hips sag toward the floor or hike your glutes high up.",
    trackingType: "duration",
    timeUnit: "sec",
    myoAtlasLinks: [
      { name: "Front Plank", url: "https://myoatlas.com/exercises/front-plank-6m1" },
      { name: "Elbow To Knee Side Plank Crunch", url: "https://myoatlas.com/exercises/elbow-to-knee-side-plank-crunch-8e9" }
    ],
  },
  {
    name: "Hanging Leg Raise",
    image: crunch,
    category: "Core",
    tip: "Curl pelvis upward, lift knees or toes without swinging.",
    avoid: "Don't swing your legs with hip momentum; curl your pelvis to engage abs.",
    myoAtlasLinks: [
      { name: "Hanging Straight Leg Raise", url: "https://myoatlas.com/exercises/hanging-straight-leg-raise-6mn" },
      { name: "Hanging Leg Hip Raise", url: "https://myoatlas.com/exercises/hanging-leg-hip-raise-7c4" }
    ],
  },
  {
    name: "Cable Crunch",
    image: crunch,
    category: "Core",
    tip: "Kneel, hold rope by ears, curl spine down toward knees.",
    avoid: "Don't sit back onto your heels; flex your spine downward using abs.",
    myoAtlasLinks: [
      { name: "Cable Kneeling Crunch", url: "https://myoatlas.com/exercises/cable-kneeling-crunch-641" },
      { name: "Cable Standing Crunch", url: "https://myoatlas.com/exercises/cable-standing-crunch-6xq" }
    ],
  },
  {
    name: "Ab Wheel Rollout",
    image: plank,
    category: "Core",
    tip: "Brace core, roll forward within control, pull back with abs.",
    avoid: "Never let your lower back sag into hyperextension; keep ribs tucked.",
    myoAtlasLinks: [
      { name: "Ab Roller Crunch", url: "https://myoatlas.com/exercises/ab-roller-crunch-7um" },
      { name: "Front Plank", url: "https://myoatlas.com/exercises/front-plank-6m1" }
    ],
  },
  {
    name: "Russian Twist",
    image: crunch,
    category: "Core",
    tip: "Elevate feet slightly, rotate shoulders side to side.",
    avoid: "Don't just move your hands; rotate your entire ribcage and shoulders.",
    myoAtlasLinks: [
      { name: "Dumbbell Straight Leg Russian Twist", url: "https://myoatlas.com/exercises/dumbbell-straight-leg-russian-twist-92q" },
      { name: "Weighted Russian Twist", url: "https://myoatlas.com/exercises/weighted-russian-twist-6wx" }
    ],
  },
  {
    name: "Side Plank",
    image: plank,
    category: "Core",
    tip: "Body in rigid diagonal line, lift hips high and hold.",
    avoid: "Don't let your top hip roll forward or your bottom hip drop toward the floor.",
    trackingType: "duration",
    timeUnit: "sec",
    myoAtlasLinks: [
      { name: "Elbow To Knee Side Plank Crunch", url: "https://myoatlas.com/exercises/elbow-to-knee-side-plank-crunch-8e9" },
      { name: "Side Plank Leg Raise", url: "https://myoatlas.com/exercises/side-plank-leg-raise-8la" }
    ],
  },
  // Cardio
  {
    name: "Treadmill",
    image: treadmill,
    category: "Cardio",
    tip: "Stay upright, land softly, maintain consistent cadence.",
    avoid: "Don't hold onto the front or side handrails while running.",
    trackingType: "duration",
    timeUnit: "min",
    myoAtlasLinks: [
      { name: "Run On Treadmill", url: "https://myoatlas.com/exercises/run-on-treadmill-7so" },
      { name: "Walking On Incline Treadmill", url: "https://myoatlas.com/exercises/walking-on-incline-treadmill-8x5" }
    ],
  },
  {
    name: "StairMaster",
    image: stairs,
    category: "Cardio",
    tip: "Stay upright, avoid leaning heavily on rails, step steady.",
    avoid: "Don't lean your upper body heavily onto the handles or hunch your back.",
    trackingType: "duration",
    timeUnit: "min",
    myoAtlasLinks: [
      { name: "Walking On Incline Treadmill", url: "https://myoatlas.com/exercises/walking-on-incline-treadmill-8x5" },
      { name: "Run On Treadmill", url: "https://myoatlas.com/exercises/run-on-treadmill-7so" }
    ],
  },
  {
    name: "Elliptical",
    image: elliptical,
    category: "Cardio",
    tip: "Smooth gliding rhythm with relaxed shoulders.",
    avoid: "Don't push only through your toes; maintain contact through whole foot.",
    trackingType: "duration",
    timeUnit: "min",
    myoAtlasLinks: [
      { name: "Run On Treadmill", url: "https://myoatlas.com/exercises/run-on-treadmill-7so" },
      { name: "Walking On Treadmill", url: "https://myoatlas.com/exercises/walking-on-treadmill-7u2" }
    ],
  },
  {
    name: "Stationary Bike",
    image: bike,
    category: "Cardio",
    tip: "Slight knee bend at bottom of pedal stroke, steady RPM.",
    avoid: "Don't set the seat too low causing knee strain or hunch your shoulders.",
    trackingType: "duration",
    timeUnit: "min",
    myoAtlasLinks: [
      { name: "Stationary Bike Run", url: "https://myoatlas.com/exercises/stationary-bike-run-7uh" },
      { name: "Run On Treadmill", url: "https://myoatlas.com/exercises/run-on-treadmill-7so" }
    ],
  },
  {
    name: "Rowing Machine",
    image: rowing,
    category: "Cardio",
    tip: "Drive with legs first, lean back, then pull handle to chest.",
    avoid: "Don't bend your knees before your hands clear them on the return stroke.",
    trackingType: "duration",
    timeUnit: "min",
    myoAtlasLinks: [
      { name: "Rowing", url: "https://myoatlas.com/exercises/rowing-6ee" },
      { name: "Cable Seated Row", url: "https://myoatlas.com/exercises/cable-seated-row-6x3" }
    ],
  },
  {
    name: "Jump Rope",
    image: treadmill,
    category: "Cardio",
    tip: "Stay on balls of feet, spin rope with wrist flicks.",
    avoid: "Don't jump high or kick your heels back; keep jumps small on balls of feet.",
    trackingType: "duration",
    timeUnit: "sec",
    myoAtlasLinks: [
      { name: "Jump Rope", url: "https://myoatlas.com/exercises/jump-rope-6nn" },
      { name: "Run On Treadmill", url: "https://myoatlas.com/exercises/run-on-treadmill-7so" }
    ],
  },
  // User-added exercises
  {
    name: "Captain's Chair",
    image: crunch,
    category: "Core",
    tip: "Place forearms on pads, grip handles firmly, and raise knees or straight legs up towards your chest with core control.",
    avoid: "Don't swing your legs with momentum or let your lower back peel completely away from the back pad.",
    myoAtlasLinks: [
      { name: "Hanging Leg Hip Raise", url: "https://myoatlas.com/exercises/hanging-leg-hip-raise-7c4" },
      { name: "Hanging Straight Leg Raise", url: "https://myoatlas.com/exercises/hanging-straight-leg-raise-6mn" }
    ],
  },
  {
    name: "Captains Chair",
    image: crunch,
    category: "Core",
    tip: "Place forearms on pads, grip handles firmly, and raise knees or straight legs up towards your chest with core control.",
    avoid: "Don't swing your legs with momentum or let your lower back peel completely away from the back pad.",
    myoAtlasLinks: [
      { name: "Hanging Leg Hip Raise", url: "https://myoatlas.com/exercises/hanging-leg-hip-raise-7c4" },
      { name: "Hanging Straight Leg Raise", url: "https://myoatlas.com/exercises/hanging-straight-leg-raise-6mn" }
    ],
  },
  {
    name: "Seated Curl",
    image: bicep,
    category: "Arms",
    tip: "Sit tall with chest proud, curl weights upward while keeping elbows stationary by your sides.",
    avoid: "Don't rock your torso backward or swing elbows forward to gain momentum.",
    myoAtlasLinks: [
      { name: "Dumbbell Seated Biceps Curl", url: "https://myoatlas.com/exercises/dumbbell-biceps-curl-6hm" },
      { name: "Dumbbell Incline Biceps Curl", url: "https://myoatlas.com/exercises/dumbbell-incline-biceps-curl-6i7" }
    ],
  },
  {
    name: "Seated curl",
    image: bicep,
    category: "Arms",
    tip: "Sit tall with chest proud, curl weights upward while keeping elbows stationary by your sides.",
    avoid: "Don't rock your torso backward or swing elbows forward to gain momentum.",
    myoAtlasLinks: [
      { name: "Dumbbell Seated Biceps Curl", url: "https://myoatlas.com/exercises/dumbbell-biceps-curl-6hm" },
      { name: "Dumbbell Incline Biceps Curl", url: "https://myoatlas.com/exercises/dumbbell-incline-biceps-curl-6i7" }
    ],
  },
  {
    name: "Lat Pulldown Machine",
    image: lat,
    category: "Back",
    tip: "Adjust thigh pads securely, grip wide handles, and pull smoothly down to upper chest while depressing shoulder blades.",
    avoid: "Don't lean excessively backward or use swinging body momentum to pull the handles down.",
    myoAtlasLinks: [
      { name: "Cable Lateral Pulldown", url: "https://myoatlas.com/exercises/cable-lateral-pulldown-643" },
      { name: "Cable Close Grip Front Lat Pulldown", url: "https://myoatlas.com/exercises/cable-close-grip-front-lat-pulldown-8zk" }
    ],
  },
  {
    name: "Cable Tricep Pushdown",
    image: tricep,
    category: "Arms",
    tip: "Tuck elbows by your ribs, press bar or rope downward until arms are fully extended, flexing triceps.",
    avoid: "Don't flare elbows outward or lean over the cable to push down with body weight.",
    myoAtlasLinks: [
      { name: "Cable Triceps Pushdown", url: "https://myoatlas.com/exercises/cable-triceps-pushdown-6g5" },
      { name: "Cable One Arm Tricep Pushdown", url: "https://myoatlas.com/exercises/cable-one-arm-tricep-pushdown-7ga" }
    ],
  },
];


export const FLOWERS = [
  "tulip",
  "sakura",
  "sunflower",
  "rose",
  "daisy",
  "lavender",
  "hibiscus",
  "orchid",
  "lotus",
  "hyacinth",
  "poppy",
  "daffodil",
  "peony",
  "iris",
  "marigold",
];
export const CLASSES = ["Workout", "Yoga", "Pilates", "Spin", "Cardio", "Dance", "Stretching", "Swimming"];
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type SetEntry = {
  weight: number;
  reps: number;
  time?: number | undefined;
  done: boolean;
  speed?: number | undefined;
  incline?: number | undefined;
  resistance?: number | undefined;
  level?: number | undefined;
  cadence?: number | undefined;
};
export type Exercise = { id: string; name: string; sets: SetEntry[]; weightUnit?: WeightUnit | undefined };
export type Session = {
  id: string;
  date: string; // YYYY-MM-DD
  activity: string;
  minutes?: number | undefined;
  completedAt?: string;
  exercises: Exercise[];
  flower: string;
  sample?: boolean;
  planId?: string | undefined;
  planName?: string | undefined;
  location?: string | undefined;
  feelingEmoji?: string | undefined;
  notes?: string | undefined;
  intensity?: "Gentle" | "Moderate" | "Intense" | undefined;
  gardenId?: GardenId | undefined;
};
export type PlanItem = { name: string; sets: number; reps: number; weight: number; time?: number | undefined };
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type WorkoutPlan = { id: string; name: string; items: PlanItem[]; difficulty?: Difficulty };
export type GardenId = "wild-meadow" | "moon-orchard" | "glasshouse";
export type State = {
  flower: string;
  mainGarden: GardenId;
  sessions: Session[];
  plan: Record<number, PlanItem[]>;
  plans: WorkoutPlan[];
  active: Exercise[] | null;
  activeStartedAt?: string | undefined;
  activeFlower?: string | undefined;
  activePlanName?: string | undefined;
  activePlanId?: string | undefined;
  activeActivity?: string | undefined;
  activeLocation?: string | undefined;
  activeIntensity?: "Gentle" | "Moderate" | "Intense" | undefined;
  activeTargetMinutes?: number | undefined;
  starterPlansVersion?: number;
};

const p = (name: string, sets = 3, reps = 10, weight = 10, time?: number): PlanItem => ({
  name,
  sets,
  reps,
  weight,
  ...(time !== undefined ? { time } : {}),
});

export const DEFAULT_PLANS: WorkoutPlan[] = [
  {
    id: "plan-full-body",
    name: "Full Body",
    difficulty: "Intermediate",
    items: [
      p("Back Squat", 3, 10, 20),
      p("Bench Press", 3, 8, 15),
      p("Lat Pulldown", 3, 10, 25),
      p("Shoulder Press", 3, 10, 8),
      p("Glute Bridge", 3, 12, 15),
      p("Plank", 3, 1, 0, 45),
    ],
  },
  {
    id: "plan-lower-body",
    name: "Lower Body",
    difficulty: "Beginner",
    items: [
      p("Back Squat", 3, 10, 25),
      p("Incline Leg Press", 3, 10, 30),
      p("Walking Lunge", 3, 12, 8),
      p("Glute Bridge", 3, 12, 20),
      p("Leg Curl", 3, 10, 15),
      p("Standing Calf Raise", 3, 15, 10),
    ],
  },
  {
    id: "plan-upper-body",
    name: "Upper Body",
    difficulty: "Intermediate",
    items: [
      p("Bench Press", 3, 8, 20),
      p("Lat Pulldown", 3, 10, 30),
      p("Seated Cable Row", 3, 10, 25),
      p("Shoulder Press", 3, 8, 10),
      p("Dumbbell Bicep Curl", 3, 10, 8),
      p("Cable Tricep Pushdown", 3, 12, 15),
      p("Dumbbell Lateral Raise", 3, 12, 6),
    ],
  },
];

export function ensureDefaultPlans(plans?: WorkoutPlan[] | null): WorkoutPlan[] {
  const existing = Array.isArray(plans) ? plans : [];
  const result: WorkoutPlan[] = [];

  // 1. Ensure the 3 standard starter plans are present, preserving any user customizations
  for (const def of DEFAULT_PLANS) {
    const found = existing.find(
      (p) => p.id === def.id || p.name.trim().toLowerCase() === def.name.trim().toLowerCase()
    );
    result.push(found ? { ...found, id: def.id } : def);
  }

  // 2. Append any custom plans created by the user
  for (const p of existing) {
    const isDefault = DEFAULT_PLANS.some(
      (def) => def.id === p.id || def.name.trim().toLowerCase() === p.name.trim().toLowerCase()
    );
    if (!isDefault) {
      result.push(p);
    }
  }

  return result;
}

const STARTER_PLAN: WorkoutPlan = DEFAULT_PLANS[0]!;
const EXTRA_PLANS: WorkoutPlan[] = DEFAULT_PLANS.slice(1);
const SAMPLE_SESSIONS: Session[] = [
  {
    id: "sample-session-1", date: "2026-09-28", completedAt: "2026-09-28T17:45:00", activity: "Workout", minutes: 52, flower: "tulip", sample: true,
    exercises: [
      { id:"sample-squat-1", name:"Back Squat", sets:[{weight:20,reps:10,done:true},{weight:25,reps:8,done:true},{weight:25,reps:8,done:true}] },
      { id:"sample-bench-1", name:"Bench Press", sets:[{weight:15,reps:8,done:true},{weight:17.5,reps:7,done:true},{weight:17.5,reps:7,done:true}] },
    ],
  },
  {
    id: "sample-session-2", date: "2026-10-03", completedAt: "2026-10-03T10:20:00", activity: "Workout", minutes: 48, flower: "sakura", sample: true,
    exercises: [
      { id:"sample-squat-2", name:"Back Squat", sets:[{weight:25,reps:10,done:true},{weight:30,reps:8,done:true},{weight:30,reps:8,done:true}] },
      { id:"sample-bench-2", name:"Bench Press", sets:[{weight:17.5,reps:8,done:true},{weight:20,reps:7,done:true},{weight:20,reps:6,done:true}] },
    ],
  },
];
const DEFAULT: State = {
  flower: "tulip",
  mainGarden: "wild-meadow",
  sessions: SAMPLE_SESSIONS,
  active: null,
  plans: DEFAULT_PLANS,
  starterPlansVersion: 2,
  plan: {
    0: [],
    1: [p("Back Squat", 4, 8, 30), p("Walking Lunge", 3, 12, 6), p("Glute Bridge", 3, 15, 20)],
    2: [p("Shoulder Press", 3, 10, 6), p("Dumbbell Row", 3, 10, 8)],
    3: [],
    4: [p("Deadlift", 4, 6, 40), p("Glute Bridge", 3, 12, 25)],
    5: [p("Shoulder Press", 3, 10, 6), p("Dumbbell Row", 3, 12, 8), p("Walking Lunge", 3, 10, 6)],
    6: [],
  },
};

const KEY = "bloomfit-v1";
let state: State = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<State>;
      state = { ...DEFAULT, ...saved };
      if (!localStorage.getItem("bloomfit_cleaned_2026_10_24")) {
        state.sessions = state.sessions.filter((s) => s.date !== "2026-10-24" || s.sample);
        localStorage.setItem("bloomfit_cleaned_2026_10_24", "1");
      }
      state.plans = ensureDefaultPlans(saved.plans);
      state.starterPlansVersion = 2;
      localStorage.setItem(KEY, JSON.stringify(state));
    } else {
      state.plans = DEFAULT_PLANS;
    }
  } catch {}
}
export function setState(fn: (s: State) => State) {
  load();
  const next = fn(state);
  if (next.plans) {
    next.plans = ensureDefaultPlans(next.plans);
  }
  state = next;
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}
export function deleteSession(id: string) {
  setState((s) => ({
    ...s,
    sessions: s.sessions.filter((sess) => sess.id !== id),
  }));
}
export function useStore() {
  return useSyncExternalStore(
    (l) => {
      load();
      listeners.add(l);
      queueMicrotask(l);
      return () => listeners.delete(l);
    },
    () => (load(), state),
    () => DEFAULT,
  );
}

/** Read the current state outside React (used by the backup sync layer). */
export function readState(): State {
  load();
  return state;
}

/** Subscribe to state changes without React. */
export function subscribeStore(listener: () => void) {
  load();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Replace local state with a copy that came from the server, without marking it as a local edit. */
export function applyRemoteState(next: State) {
  load();
  next.plans = ensureDefaultPlans(next.plans);
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
}

export const uid = () => Math.random().toString(36).slice(2, 10);
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const normalizeExerciseName = (name: string): string =>
  name.trim().toLowerCase().replace(/['’]/g, "");

export const imageFor = (name: string): ExerciseInfo | undefined => {
  const norm = normalizeExerciseName(name);
  return EXERCISE_LIBRARY.find((e) => normalizeExerciseName(e.name) === norm);
};

export function getCardioSettings(name: string): CardioSettingConfig[] {
  const norm = normalizeExerciseName(name);
  if (norm.includes("treadmill")) {
    return [
      {
        key: "speed",
        label: "Speed",
        suffix: "mph",
        step: 0.5,
        defaultVal: 5.0,
        presets: [2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 10.0],
      },
      {
        key: "incline",
        label: "Incline",
        suffix: "%",
        step: 1,
        defaultVal: 1,
        presets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15],
      },
    ];
  }
  if (norm.includes("stair") || norm.includes("step")) {
    return [
      {
        key: "level",
        label: "Level",
        suffix: "lvl",
        step: 1,
        defaultVal: 5,
        presets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16],
      },
    ];
  }
  if (norm.includes("bike") || norm.includes("cycle") || norm.includes("spin")) {
    return [
      {
        key: "resistance",
        label: "Resistance",
        suffix: "lvl",
        step: 1,
        defaultVal: 5,
        presets: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 18, 20],
      },
      {
        key: "cadence",
        label: "Cadence",
        suffix: "rpm",
        step: 5,
        defaultVal: 70,
        presets: [50, 60, 65, 70, 75, 80, 85, 90, 100],
      },
    ];
  }
  if (norm.includes("elliptical")) {
    return [
      {
        key: "resistance",
        label: "Resistance",
        suffix: "lvl",
        step: 1,
        defaultVal: 5,
        presets: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15],
      },
      {
        key: "incline",
        label: "Incline",
        suffix: "%",
        step: 1,
        defaultVal: 1,
        presets: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12],
      },
    ];
  }
  if (norm.includes("row") || norm.includes("rowing")) {
    return [
      {
        key: "resistance",
        label: "Damper",
        suffix: "lvl",
        step: 1,
        defaultVal: 5,
        presets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    ];
  }
  if (norm.includes("jump rope") || norm.includes("rope")) {
    return [];
  }
  return [
    {
      key: "level",
      label: "Level",
      suffix: "lvl",
      step: 1,
      defaultVal: 1,
      presets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
  ];
}

export function lastUsedFor(sessions: Session[], plan: WorkoutPlan) {
  return sessions.filter(session => !session.sample && (session.planId === plan.id || (!session.planId && session.planName === plan.name)))
    .map(session => session.completedAt ?? `${session.date}T12:00:00`).sort().at(-1);
}

export function lastLoggedSetsFor(sessions: Session[], name: string): SetEntry[] | null {
  const norm = normalizeExerciseName(name);
  for (let i = sessions.length - 1; i >= 0; i--) {
    const sess = sessions[i];
    if (!sess) continue;
    const ex = sess.exercises.find((e) => normalizeExerciseName(e.name) === norm);
    if (ex && ex.sets.length > 0) {
      return ex.sets;
    }
  }
  return null;
}

export function planToExercises(items: PlanItem[], sessions?: Session[]): Exercise[] {
  return items.map((i) => {
    const info = imageFor(i.name);
    const isCardio = info?.category === "Cardio";
    const targetSetCount = isCardio ? 1 : i.sets;
    const prevSets = sessions ? lastLoggedSetsFor(sessions, i.name) : null;
    const cardioConfigs = isCardio ? getCardioSettings(i.name) : [];
    const cardioDefaults: Record<string, number> = {};
    for (const c of cardioConfigs) {
      cardioDefaults[c.key] = c.defaultVal;
    }

    return {
      id: uid(),
      name: i.name,
      weightUnit: "lb",
      sets: Array.from({ length: targetSetCount }, (_, setIndex) => {
        const prevSet = prevSets ? (prevSets[setIndex] ?? prevSets[prevSets.length - 1]) : null;
        return {
          weight: prevSet ? prevSet.weight : i.weight,
          reps: prevSet ? prevSet.reps : i.reps,
          time: prevSet?.time ?? i.time,
          speed: prevSet?.speed ?? cardioDefaults.speed,
          incline: prevSet?.incline ?? cardioDefaults.incline,
          resistance: prevSet?.resistance ?? cardioDefaults.resistance,
          level: prevSet?.level ?? cardioDefaults.level,
          cadence: prevSet?.cadence ?? cardioDefaults.cadence,
          done: false,
        };
      }),
    };
  });
}

export function streak(sessions: Session[]) {
  const dates = new Set(sessions.map((s) => s.date));
  const d = new Date();
  const fmt = (x: Date) =>
    `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  if (!dates.has(fmt(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (dates.has(fmt(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function lastFor(sessions: Session[], name: string): { date: string; best: number; unit?: string } | null {
  const norm = normalizeExerciseName(name);
  const info = imageFor(name);
  const isDuration = info?.trackingType === "duration";
  const unit = info?.timeUnit ?? "sec";
  for (let i = sessions.length - 1; i >= 0; i--) {
    const sess = sessions[i];
    if (!sess) continue;
    const ex = sess.exercises.find((e) => normalizeExerciseName(e.name) === norm);
    if (ex?.sets.length) {
      if (isDuration) {
        const best = Math.max(...ex.sets.map((s) => s.time ?? s.reps ?? s.weight));
        return { date: sess.date, best, unit };
      }
      return { date: sess.date, best: Math.max(...ex.sets.map((s) => s.weight)), unit: ex.weightUnit ?? "lb" };
    }
  }
  return null;
}
