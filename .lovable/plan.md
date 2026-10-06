# Reusable plans and calendar history

## What will change

- Simplify Home: the main button always says “Start”; unfinished workouts show a wider Resume button beside a smaller Cancel button; remove the daily workout preview.
- Replace weekday planning with reusable named plans. Seed a ready-to-use plan from the uploaded workout note, show plan details, and support creating, editing, and deleting plans and exercises.
- Update the Start flow so choosing Workout opens plan selection before the workout begins.
- Seed two sample completed exercise records so the Exercises section demonstrates trends immediately without treating the uploaded note as a completed session.
- Replace History’s list with a month calendar. Completed workouts and sports appear as events; selecting an event opens its date, time, duration, and full workout details including sets, maximum weight, and maximum reps.

## Data preservation

- Upgrade the existing saved data in place so current sessions and unfinished workouts remain intact.
- Convert an existing weekday plan into reusable plans only when needed, while keeping older saved data compatible.

## Technical details

- Extend the versioned local store with named workout plans and optional sample-record handling.
- Use the existing exercise library, shared controls, floral tokens, and phone-first layout.
- Keep the workout editor and completion behavior, changing only how a plan is selected and loaded.

## Verification

- Test creating/editing/removing plans, starting a workout from a selected plan, resuming/cancelling it, opening calendar events, and viewing seeded exercise trends.
- Check the key screens at iPhone size and confirm there is no horizontal overflow.