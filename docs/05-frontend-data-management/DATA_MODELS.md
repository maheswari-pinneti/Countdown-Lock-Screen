# Domain Data Models & Schema

Defined in [`src/types/index.ts`](file:///f:/Countdown-Lock-Screen/src/types/index.ts):
- `CareerExperience`: Contains track ID, name, deadline, milestones array, daily goals, interview pipeline, compensation targets, and theme colors.
- `MilestoneItem`: ID, title, deadline, completed flag, optional category, notes.
- `HabitItem`: ID, title, category, streakCount, longestStreak, completedDates, recoveryGraceDays, restDays.
- `JournalEntry`: ID, date, title, content, mood score (1-5), gratitudes, winOfTheDay, tags.
- `PlannerTask`: ID, title, priority, dueDate, timeEstimate, completed, trackId, subtasks.
- `SecondBrainNote`: ID, title, folder (P.A.R.A.), tags, content, isPinned, isFavorite.
