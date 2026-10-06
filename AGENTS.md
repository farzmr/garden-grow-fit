<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep session completion timestamps and pending-workout start/flower metadata in the existing versioned store, with optional fields for older saved sessions; this preserves personal logs during upgrades.
- Exercise catalogue and weight trends share EXERCISE_LIBRARY and recorded session sets; this keeps plan, workout, and history names consistent.
- New interactive controls use the shared Button component and global semantic color tokens; this preserves consistent styling.
- Workout planning uses reusable named routines rather than weekday assignments; this matches how users select a workout when starting.
