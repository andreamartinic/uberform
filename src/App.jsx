import { useEffect, useState } from "react";

import {
  Activity,
  CalendarDays,
  ChartNoAxesCombined,
  CircleUserRound,
  Dumbbell,
  Flame,
  LayoutDashboard,
  Plus,
  Settings as SettingsIcon,
  Target,
  Timer,
  Trophy,
  Zap,
  Trash2,
  Search,
  Bell,
  BellRing,
  Palette,
  ShieldCheck,
} from "lucide-react";
import "./App.css";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Training planner", icon: CalendarDays },
  { label: "My Workouts", icon: Dumbbell },
  { label: "Exercise Library", icon: Search },
  { label: "Progress", icon: ChartNoAxesCombined },
  { label: "Achievements", icon: Trophy },
];

const activities = [
  {
    name: "Strength training",
    category: "STRENGTH",
    duration: "55 min",
    calories: 320,
    color: "red",
    icon: Dumbbell,
  },
  {
    name: "Pole dance",
    category: "SKILL & CONDITIONING",
    duration: "60 min",
    calories: 350,
    color: "purple",
    icon: Activity,
  },
  {
    name: "Running",
    category: "CARDIO",
    duration: "30 min",
    calories: 280,
    color: "orange",
    icon: Zap,
  },
];


function Sidebar({ currentPage, onNavigate, workouts }) {
  const today = new Date();
  const startOfWeek = new Date(today);
  const dayOfWeek = (today.getDay() + 6) % 7;

  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const completedThisWeek = workouts.filter((workout) => {
    if (!workout.completed || !workout.completedAt) return false;

    const completedDate = new Date(workout.completedAt);
    return completedDate >= startOfWeek && completedDate <= today;
  }).length;

  const weeklyGoal = 5;
  const weeklyProgress = Math.min(
    Math.round((completedThisWeek / weeklyGoal) * 100),
    100
  );

  return (
    <aside className="sidebar">
      <a
        className="brand"
        href="#dashboard"
        onClick={() => onNavigate("Dashboard")}
      >
        <span className="brand-icon">
          <Activity size={23} />
        </span>
        <span>
          ÜBER<span className="brand-light">FORM</span>
        </span>
      </a>

      <p className="nav-label">WORKSPACE</p>

      <nav className="navigation">
        {navigation.map(({ label, icon: Icon }) => (
          <a
            key={label}
            href={`#${label.toLowerCase().replaceAll(" ", "-")}`}
            onClick={() => onNavigate(label)}
            className={`nav-link ${currentPage === label ? "active" : ""}`}
          >
            <Icon size={19} />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-message">
          <Target size={22} />
          <h3>Consistency wins.</h3>
          <p>Small steps. Stronger you.</p>

          <div className="mini-progress">
            <span style={{ width: `${weeklyProgress}%` }} />
          </div>

          <small>
            Weekly goal · {completedThisWeek}/{weeklyGoal} ({weeklyProgress}%)
          </small>
        </div>

        <a
          className={`nav-link ${currentPage === "Settings" ? "active" : ""}`}
          href="#settings"
          onClick={(event) => {
           event.preventDefault();
           onNavigate("Settings");
          }}
        >
          <SettingsIcon size={19} />
          <span>Settings</span>
        </a>

       </div>
    </aside>
  );
}


function StatCard({ icon: Icon, label, value, unit, note }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span className="stat-icon">
          <Icon size={20} />
        </span>
        <span className="stat-note">{note}</span>
      </div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">
        {value} <span>{unit}</span>
      </p>
    </article>
  );
}


function MyWorkouts({
  workouts,
  onDeleteWorkout,
  onCompleteWorkout,
}) {
  return (
    <main className="main-content">
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-divider">/</span>
          <strong>My Workouts</strong>
        </div>
        <button className="profile-button" aria-label="User profile">
          <CircleUserRound size={21} />
        </button>
      </header>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR TRAINING</p>
            <h2>My Workouts</h2>
            <p>All your saved workouts in one place.</p>
          </div>
        </div>

        {workouts.length === 0 ? (
          <p className="demo-note">
            No saved workouts yet. Create your first workout from the Dashboard.
          </p>
        ) : (
          <div className="activity-list">
            {workouts.map((workout) => (
              <div className="activity-row" key={workout.id}>
                <div className="activity-icon">
                  <Dumbbell size={21} />
                </div>
                <div className="activity-name">
                  <strong>{workout.name}</strong>
                  <span>{workout.category}</span>
                </div>
                
<button
  type="button"
  className={`text-button ${workout.completed ? "completed" : ""}`}
  onClick={() => onCompleteWorkout(workout.id)}
>
  {workout.completed ? "✓ Completed" : "Mark as completed"}
</button>

                <div className="activity-duration">
                  <span>Duration</span>
                  <strong>{workout.duration}</strong>
                </div>
                <div className="activity-calories">
                  <span>Estimated burn</span>
                  <strong>{workout.calories} kcal</strong>
                </div>
                <button
                  type="button"
                  className="delete-workout-button"
                  onClick={() => onDeleteWorkout(workout.id)}
                  aria-label={`Delete ${workout.name}`}
                  title="Delete workout"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}


function AchievementCelebration({ achievement, onClose }) {
  const confettiColors = [
  "var(--red)",
  "#ffcc33",
  "#ffffff",
  "#22c55e",
  "var(--red)",
];

const confettiPieces = Array.from({ length: 100 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  delay: `${(index % 20) * 0.04}s`,
  duration: `${2 + (index % 15) * 0.12}s`,
  color: confettiColors[index % confettiColors.length],
  rotation: `${index * 47}deg`,
}));

  return (
    <div className="celebration-overlay" onClick={onClose}>
      <div className="confetti-layer" aria-hidden="true">
        {confettiPieces.map((piece) => (
          <span
            key={piece.id}
            className="confetti-piece"
            style={{
              left: piece.left,
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              transform: `rotate(${piece.rotation})`,
            }}
          />
        ))}
      </div>

      <div className="celebration-message">
        <span className="celebration-eyebrow">ACHIEVEMENT UNLOCKED</span>
        <div className="celebration-trophy">🏆</div>
        <h2>{achievement}</h2>
        <p>You're getting stronger. Keep going!</p>
        <button type="button" onClick={onClose}>
          Awesome!
        </button>
      </div>
    </div>
  );
}


function Achievements({ workouts }) {
  const completedDates = workouts
    .filter((workout) => workout.completed && workout.completedAt)
    .map((workout) => new Date(workout.completedAt))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a - b);

  const totalCompleted = completedDates.length;

  function getWeekStart(date) {
    const monday = new Date(date);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return monday;
  }

  const weeklyCounts = new Map();

  completedDates.forEach((date) => {
    const weekKey = getWeekStart(date).getTime();
    weeklyCounts.set(weekKey, (weeklyCounts.get(weekKey) || 0) + 1);
  });

  let onARoll = false;
  let dedicated = false;
  let noExcuses = false;

  if (weeklyCounts.size > 0) {
    const weekStarts = [...weeklyCounts.keys()].sort((a, b) => a - b);
    const firstWeek = new Date(weekStarts[0]);
    const lastWeek = getWeekStart(new Date());

    let consecutiveWeeks = 0;
    let consecutiveDedicatedWeeks = 0;

    for (
      let week = new Date(firstWeek);
      week <= lastWeek;
      week.setDate(week.getDate() + 7)
    ) {
      const count = weeklyCounts.get(week.getTime()) || 0;

      consecutiveWeeks = count >= 1 ? consecutiveWeeks + 1 : 0;
      consecutiveDedicatedWeeks =
        count >= 2 ? consecutiveDedicatedWeeks + 1 : 0;

      if (consecutiveWeeks >= 3) onARoll = true;
      if (consecutiveDedicatedWeeks >= 4) dedicated = true;
      if (count >= 4) noExcuses = true;
    }
  }

  const milestones = [
    { name: "First Blood", target: 1 },
    { name: "Getting Serious", target: 10 },
    { name: "Iron Will", target: 25 },
    { name: "Unstoppable", target: 100 },
  ];

  const consistency = [
    {
      name: "On a Roll",
      description: "Complete at least one workout per week for 3 consecutive weeks.",
      unlocked: onARoll,
    },
    {
      name: "No Excuses",
      description: "Complete 4 workouts in one calendar week.",
      unlocked: noExcuses,
    },
    {
      name: "Dedicated",
      description: "Complete at least 2 workouts per week for 4 consecutive weeks.",
      unlocked: dedicated,
    },
  ];

  function AchievementCard({ name, description, unlocked, progress }) {
    return (
      <div className={`achievement-card ${unlocked ? "unlocked" : ""}`}>
        <div className="achievement-icon">
          
          {!unlocked ? "🔒" :
            name === "First Blood" ? "🏅" :
            name === "Getting Serious" ? "🥉" :
            name === "Iron Will" ? "💪" :
            name === "Unstoppable" ? "🏆" :
            name === "On a Roll" ? "🔥" :
            name === "No Excuses" ? "⚡" :
            name === "Dedicated" ? "👑" : "⭐"}

        </div>
        <div className="achievement-info">
          <h3>{name}</h3>
          <p>{description}</p>
          <span className="achievement-status">
            {unlocked ? "UNLOCKED" : progress || "LOCKED"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <main className="main-content">
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-divider">/</span>
          <strong>Achievements</strong>
        </div>
      </header>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR REWARDS</p>
            <h2>Achievements</h2>
            <p>
              Every completed workout takes you one step further.
            </p>
          </div>
        </div>

        <div className="achievement-summary">
          <span>COMPLETED WORKOUTS</span>
          <strong>{totalCompleted}</strong>
        </div>

        <div className="achievement-section">
          <h2>Workout Milestones</h2>
          <p>Earn rewards as your total number of completed workouts grows.</p>

          <div className="achievements-grid">
            {milestones.map((item) => {
              const unlocked = totalCompleted >= item.target;

              return (
                <AchievementCard
                  key={item.name}
                  name={item.name}
                  description={`${item.target} completed ${
                    item.target === 1 ? "workout" : "workouts"
                  }`}
                  unlocked={unlocked}
                  progress={`${Math.min(totalCompleted, item.target)} / ${item.target}`}
                />
              );
            })}
          </div>
        </div>

        <div className="achievement-section">
          <h2>Consistency</h2>
          <p>Build a routine and keep showing up.</p>

          <div className="achievements-grid">
            {consistency.map((item) => (
              <AchievementCard
                key={item.name}
                name={item.name}
                description={item.description}
                unlocked={item.unlocked}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}


function Progress({ workouts }) {
  const currentYear = new Date().getFullYear();
  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  
const monthlyCounts = monthLabels.map((month, index) => ({
  month,
  count: workouts.filter((workout) => {
    if (!workout.completedAt || !workout.completed) return false;

    const date = new Date(workout.completedAt);

    return (
      !Number.isNaN(date.getTime()) &&
      date.getFullYear() === currentYear &&
      date.getMonth() === index
    );
  }).length,
}));


  const maxCount = Math.max(...monthlyCounts.map((item) => item.count), 1);

  const thisMonth = monthlyCounts[new Date().getMonth()].count;

  const datedWorkouts = workouts.filter((workout) => workout.createdAt);

  return (
    <main className="main-content">
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-divider">/</span>
          <strong>Progress</strong>
        </div>
        <button className="profile-button" aria-label="User profile">
          <CircleUserRound size={21} />
        </button>
      </header>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR JOURNEY</p>
            <h2>Training Progress</h2>
            <p>Your workout consistency throughout {currentYear}.</p>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard
            icon={Dumbbell}
            label="Workouts this year"
            value={workouts.filter((workout) => {
            if (!workout.completed || !workout.completedAt) return false;

              const date = new Date(workout.completedAt);

            return (
           !Number.isNaN(date.getTime()) &&
           date.getFullYear() === currentYear
         );
          }).length}
            unit=""
            note="This year"
          />
          <StatCard
            icon={CalendarDays}
            label="This month"
            value={thisMonth}
            unit="workouts"
            note="Monthly"
          />
        </div>

        <div className="activity-section">
          <div className="section-heading">
            <div>
              <h2>Monthly activity</h2>
              <p>Number of saved workouts created each month.</p>
            </div>
          </div>

          <div className="monthly-chart">
            {monthlyCounts.map(({ month, count }) => (
              <div className="chart-column" key={month}>
                <span className="chart-value">{count || ""}</span>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${Math.min((count / 15) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="chart-month">{month}</span>
              </div>
            ))}
          </div>

          {datedWorkouts.length === 0 && (
            <p className="demo-note">
              Your monthly chart will grow as you save new workouts with dates.
              Older workouts without dates are not included.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}


function WorkoutModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Strength training");
  const [duration, setDuration] = useState("45");
  const [calories, setCalories] = useState("250");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || Number(duration) <= 0 || Number(calories) < 0) {
      return;
    }

    onSave({
      id: Date.now(),
      name: name.trim(),
      category,
      duration: `${duration} min`,
      calories: Number(calories),
      date,
      color: "red",
    });

    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="workout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workout-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="panel-heading">
          <div>
            <p className="eyebrow">YOUR FITNESS JOURNEY</p>
            <h2 id="workout-modal-title">Create workout</h2>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form className="workout-form" onSubmit={handleSubmit}>
          <label>
            Workout name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Upper body"
              required
              maxLength={80}
            />
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Strength training</option>
              <option>Pole dance</option>
              <option>Cardio</option>
              <option>Mobility</option>
              <option>Other</option>
            </select>
          </label>

          <div className="form-two-columns">
            <label>
              Duration (min)
              <input
                type="number"
                min="1"
                max="1440"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </label>

            <label>
              Calories (kcal)
              <input
                type="number"
                min="0"
                max="20000"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
              />
            </label>
          </div>

          <label>
            Workout date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button">
              <Plus size={18} />
              Save workout
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}


function Dashboard({
  workouts,
  onSaveWorkout,
  onDeleteWorkout,
  onNavigate,
  profile,
  weeklyTarget,
}) {

  const [modalOpen, setModalOpen] = useState(false);

  
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  const weekDays = (() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const day = (today.getDay() + 6) % 7;
    today.setDate(today.getDate() - day + weekOffset * 7);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const dayOfMonth = String(date.getDate()).padStart(2, "0");

      return {
        date,
        key: `${year}-${month}-${dayOfMonth}`,
        label: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        number: date.getDate(),
      };
    });
  })();

  const weekTitle = `${weekDays[0].date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })} – ${weekDays[6].date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })}`;

  const selectedWorkouts = workouts.filter(
    (workout) => workout.date === selectedDate
  );

  
const completedWorkouts = workouts.filter(
  (workout) =>
    workout.completed &&
    workout.completedAt &&
    !Number.isNaN(new Date(workout.completedAt).getTime())
);

const completedDateKeys = new Set(
  completedWorkouts.map((workout) => {
    const date = new Date(workout.completedAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  })
);

const dateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

let activeStreak = 0;
let streakDate = new Date(today);

if (!completedDateKeys.has(dateKey(streakDate))) {
  streakDate = yesterday;
}

if (completedDateKeys.has(dateKey(streakDate))) {
  while (completedDateKeys.has(dateKey(streakDate))) {
    activeStreak++;
    streakDate.setDate(streakDate.getDate() - 1);
  }
}

const totalXP = completedWorkouts.length * 20;


const currentWeekStart = new Date();
currentWeekStart.setHours(0, 0, 0, 0);
currentWeekStart.setDate(
  currentWeekStart.getDate() -
    ((currentWeekStart.getDay() + 6) % 7)
);

const nextWeekStart = new Date(currentWeekStart);
nextWeekStart.setDate(nextWeekStart.getDate() + 7);

const completedThisWeek = completedWorkouts.filter((workout) => {
  const completedAt = new Date(workout.completedAt);

  return (
    completedAt >= currentWeekStart &&
    completedAt < nextWeekStart
  );
}).length;

const weeklyProgress = Math.min(
  (completedThisWeek / weeklyTarget) * 100,
  100
);


  
  return (
    <main className="main-content" id="dashboard">
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-divider">/</span>
          <strong>Dashboard</strong>
        </div>
        
      <button
        type="button"
        className="profile-button"
        aria-label="Open profile settings"
        onClick={() => {
        onNavigate("Settings");
        }}
      >
      <CircleUserRound size={21} />
      <span>{profile.fullName.trim() || "Your profile"}</span>
      </button>

      </header>

      <section className="welcome-section">
        <div>
          <p className="eyebrow">
            <span className="status-dot" />
            YOUR PERSONAL FITNESS SPACE
          </p>
          <h1>Let's get <span>moving.</span></h1>
          <p className="welcome-description">
            Every rep, every step, every move counts.
          </p>
        </div>

        <button
         className="primary-button"
          onClick={() => {
  setModalOpen(true);
  console.log("Create workout clicked");
}}
          >
         <Plus size={19} />
         Create workout
        </button>
      </section>

      <section className="stats-grid" aria-label="Activity overview">
        <StatCard
          icon={Flame}
          label="Calories burned"
          value={workouts.reduce((total, workout) => total + Number(workout.calories || 0), 0).toLocaleString("en-US")}
          unit="kcal"
          note="TOTAL LOGGED"
        />
        <StatCard
          icon={Timer}
          label="Active time"
          value={(workouts.reduce((total, workout) => total + Number.parseInt(workout.duration, 10) || total, 0) / 60).toFixed(1)}
          unit="hours"
          note="TOTAL LOGGED"
        />
        <StatCard
          icon={Dumbbell}
          label="Workouts"
          value={String(workouts.length)}
          unit="/ 5"
          note="TOTAL LOGGED"
        />
        <StatCard
          icon={Trophy}
           label="Personal records"
          value={String(
           workouts.filter(
          (workout) =>
           workout.completed &&
            Number(workout.duration) > 0
           ).length
           )}
         unit="records"
          note="COMPLETED WORKOUTS"
        />
      </section>

      <section className="content-grid">
        <article className="panel schedule-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">YOUR SCHEDULE</p>
              <h2>This week's movement</h2>
            </div>
            <button className="text-button">View planner ↗</button>
          </div>

          
<div className="calendar-navigation">
  <button
    className="calendar-arrow"
    onClick={() => setWeekOffset((offset) => offset - 1)}
    aria-label="Previous week"
  >
    ‹
  </button>
  <strong>{weekTitle}</strong>
  <button
    className="calendar-arrow"
    onClick={() => setWeekOffset((offset) => offset + 1)}
    aria-label="Next week"
  >
    ›
  </button>
</div>

<div className="week-days">
  {weekDays.map((day) => {
    const hasWorkout = workouts.some(
      (workout) => workout.date === day.key
    );

    return (
      <button
        type="button"
        className={`day-item ${selectedDate === day.key ? "selected" : ""}`}
        key={day.key}
        onClick={() => setSelectedDate(day.key)}
      >
        <span>{day.label}</span>
        <strong>{day.number}</strong>
        <i className={hasWorkout ? "has-workout" : ""} />
      </button>
    );
  })}
</div>

          
<div className="selected-day-workouts">
  <p className="eyebrow">
    {new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
    }).toUpperCase()}
  </p>

  {selectedWorkouts.length > 0 ? (
    selectedWorkouts.map((workout) => (
      <div className="today-workout" key={workout.id}>
        <div className="workout-symbol">
          <Dumbbell size={24} />
        </div>

        <div className="workout-info">
          <span className="workout-category">{workout.category}</span>
          <h3>{workout.name}</h3>
          <p>
            {workout.duration} · {workout.calories} kcal
          </p>
        </div>

        <span className="planned-badge">Saved</span>
      </div>
    ))
  ) : (
    <div className="today-workout">
      <div className="workout-symbol">
        <Activity size={24} />
      </div>

      <div className="workout-info">
        <span className="workout-category">NO ACTIVITY</span>
        <h3>No workouts logged</h3>
        <p>Nothing recorded for this day yet.</p>
      </div>
    </div>
  )}
</div>

          
<div className="goal-box">
  <div className="goal-heading">
    <span>Weekly movement goal</span>
    <strong>
      {completedThisWeek} of {weeklyTarget} sessions
    </strong>
  </div>

  <div className="goal-track">
    <span style={{ width: `${weeklyProgress}%` }} />
  </div>

  <p>
    {completedThisWeek >= weeklyTarget
      ? "Weekly target reached. Great work!"
      : `${weeklyTarget - completedThisWeek} more ${
          weeklyTarget - completedThisWeek === 1
            ? "workout"
            : "workouts"
        } to reach your weekly target.`}
  </p>
</div>

        </article>

        <article className="panel achievement-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">KEEP IT UP</p>
              <h2>Your momentum</h2>
            </div>
            <Trophy size={21} className="heading-icon" />
          </div>

          
        <div className="achievement-circle"
          style={{
           background: `conic-gradient(
           var(--red) 0deg ${(Math.min(activeStreak, 7) / 7) * 360}deg,
        #34343a ${(Math.min(activeStreak, 7) / 7) * 360}deg 360deg
           )`,
           }}
        >

            <div className="circle-inner">
              <Zap size={27} />
              <strong>{activeStreak} {activeStreak === 1 ? "day" : "days"}</strong>
              <span>ACTIVE STREAK</span>
            </div>
          </div>

          <h3 className="achievement-title">
             {activeStreak >= 7
            ? "Unstoppable momentum!"
             : activeStreak >= 3
            ? "You're building a habit."
              : activeStreak >= 1
            ? "Great start. Keep going!"
            : "Ready to get moving?"}
          </h3>
          <p className="achievement-description">
            Every session brings you closer to your goals. Keep your momentum
            going.
          </p>

          <div className="achievement-footer">
            <span className="achievement-badge">
              <Trophy size={16} /> Consistency
            </span>
            <span className="achievement-points">+{totalXP} XP</span>
          </div>
        </article>
      </section>

      <section className="panel activity-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">YOUR MOVEMENT HISTORY</p>
            <h2>Recent activities</h2>
          </div>
          <button
             className="text-button"
              onClick={() => onNavigate("My Workouts")}
              >
               View all ↗
          </button>
        </div>

        <div className="activity-list">
          
{[...workouts.map((workout) => ({ ...workout, icon: Dumbbell })), ...activities].slice(0, 3).map(({ id, name, category, duration, calories, color, icon: Icon }) => (
            <div className="activity-row" key={id ?? name}>
              <div className={`activity-icon ${color}`}>
                <Icon size={21} />
              </div>
              <div className="activity-name">
                <strong>{name}</strong>
                <span>{category}</span>

                
              </div>
              <div className="activity-duration">
                <span>Duration</span>
                <strong>{duration}</strong>
              </div>
              <div className="activity-calories">
                <span>Estimated burn</span>
                <strong>{calories} kcal</strong>
              </div>
              <span className="completed-label">Completed</span>
              
                { id != null && (
                  <button
                    type="button"
                    className="delete-workout-button"
                    onClick={() => onDeleteWorkout(id)}
                    aria-label={`Delete ${name}`}
                    title="Delete workout"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
            </div>
          ))}
        </div>
        <p className="demo-note">
          Demo content · Activity and calorie values are illustrative.
        </p>
      </section>

      <footer className="footer">
        <span>ÜBERFORM © 2026</span>
        <span>MOVE WITH PURPOSE.</span>
      </footer>
      {modalOpen && (
        <WorkoutModal
          onClose={() => setModalOpen(false)}
          onSave={onSaveWorkout}
        />
      )}
    </main>
  );
}


const defaultExercises = [
  // STRENGTH
  { id: 1, name: "Barbell Squat", muscle: "Legs", type: "Strength", equipment: "Barbell", sets: "3", reps: "8–12" },
  { id: 2, name: "Romanian Deadlift", muscle: "Legs", type: "Strength", equipment: "Barbell", sets: "3", reps: "8–12" },
  { id: 3, name: "Hip Thrust", muscle: "Glutes", type: "Strength", equipment: "Barbell", sets: "4", reps: "8–12" },
  { id: 4, name: "Bulgarian Split Squat", muscle: "Glutes", type: "Strength", equipment: "Dumbbells", sets: "3", reps: "10–12" },
  { id: 5, name: "Lat Pulldown", muscle: "Back", type: "Strength", equipment: "Machine", sets: "3", reps: "10–12" },
  { id: 6, name: "Seated Cable Row", muscle: "Back", type: "Strength", equipment: "Cable", sets: "3", reps: "10–12" },
  { id: 7, name: "Bench Press", muscle: "Chest", type: "Strength", equipment: "Barbell", sets: "3", reps: "8–12" },
  { id: 8, name: "Dumbbell Shoulder Press", muscle: "Shoulders", type: "Strength", equipment: "Dumbbells", sets: "3", reps: "8–12" },
  { id: 9, name: "Lateral Raises", muscle: "Shoulders", type: "Strength", equipment: "Dumbbells", sets: "3", reps: "12–15" },
  { id: 10, name: "Biceps Curl", muscle: "Arms", type: "Strength", equipment: "Dumbbells", sets: "3", reps: "10–15" },
  { id: 11, name: "Triceps Pushdown", muscle: "Arms", type: "Strength", equipment: "Cable", sets: "3", reps: "10–15" },
  { id: 12, name: "Plank", muscle: "Core", type: "Strength", equipment: "Bodyweight", sets: "3", reps: "30–60 sec" },

  // POLE DANCE
  { id: 13, name: "Pole Walk", muscle: "Full Body", type: "Pole Dance", equipment: "Pole", sets: "3", reps: "Practice both sides", difficulty: "Beginner", prerequisites: "None", mastery: "Not started", notes: "" },
  { id: 14, name: "Fireman Spin", muscle: "Full Body", type: "Pole Dance", equipment: "Pole", sets: "3", reps: "Practice both sides", difficulty: "Beginner", prerequisites: "Basic pole grip", mastery: "Not started", notes: "" },
  { id: 15, name: "Chair Spin", muscle: "Full Body", type: "Pole Dance", equipment: "Pole", sets: "3", reps: "Practice both sides", difficulty: "Beginner", prerequisites: "Basic spin technique", mastery: "Not started", notes: "" },
  { id: 16, name: "Pole Sit", muscle: "Core", type: "Pole Dance", equipment: "Pole", sets: "3", reps: "Hold with control", difficulty: "Beginner", prerequisites: "Grip strength and basic climb", mastery: "Not started", notes: "" },
  { id: 17, name: "Basic Climb", muscle: "Full Body", type: "Pole Dance", equipment: "Pole", sets: "3", reps: "Controlled climbs", difficulty: "Beginner", prerequisites: "Pole grip and knee hold", mastery: "Not started", notes: "" },
  { id: 18, name: "Invert", muscle: "Core", type: "Pole Dance", equipment: "Pole", sets: "3", reps: "Controlled attempts", difficulty: "Intermediate", prerequisites: "Strong core, grip and shoulder control", mastery: "Not started", notes: "" },
  { id: 19, name: "Butterfly", muscle: "Full Body", type: "Pole Dance", equipment: "Pole", sets: "3", reps: "Controlled holds", difficulty: "Intermediate", prerequisites: "Inversion and secure pole grip", mastery: "Not started", notes: "" },

  // CARDIO
  { id: 20, name: "Treadmill Walk", muscle: "Full Body", type: "Cardio", equipment: "Treadmill", sets: "1", reps: "20–40 min" },
  { id: 21, name: "Treadmill Run", muscle: "Full Body", type: "Cardio", equipment: "Treadmill", sets: "1", reps: "15–30 min" },
  { id: 22, name: "Stationary Bike", muscle: "Legs", type: "Cardio", equipment: "Bike", sets: "1", reps: "20–30 min" },
  { id: 23, name: "Rowing Machine", muscle: "Full Body", type: "Cardio", equipment: "Rower", sets: "1", reps: "10–20 min" },
  { id: 24, name: "Jump Rope", muscle: "Full Body", type: "Cardio", equipment: "Jump rope", sets: "3", reps: "1–3 min" },

  // MOBILITY
  { id: 25, name: "Shoulder Mobility", muscle: "Shoulders", type: "Mobility", equipment: "Mat or band", sets: "2", reps: "8–12 reps" },
  { id: 26, name: "Hip Openers", muscle: "Hips", type: "Mobility", equipment: "Mat", sets: "2", reps: "8–10 each side" },
  { id: 27, name: "Thoracic Rotations", muscle: "Back", type: "Mobility", equipment: "Mat", sets: "2", reps: "8 each side" },
  { id: 28, name: "Ankle Mobility", muscle: "Legs", type: "Mobility", equipment: "Mat", sets: "2", reps: "10 each side" },

  // BODYWEIGHT
  { id: 29, name: "Push-ups", muscle: "Chest", type: "Bodyweight", equipment: "Bodyweight", sets: "3", reps: "6–15" },
  { id: 30, name: "Pull-ups", muscle: "Back", type: "Bodyweight", equipment: "Pull-up bar", sets: "3", reps: "As many controlled reps as possible" },
  { id: 31, name: "Bodyweight Squat", muscle: "Legs", type: "Bodyweight", equipment: "Bodyweight", sets: "3", reps: "12–20" },

  // RECOVERY
  { id: 32, name: "Full Body Stretch", muscle: "Full Body", type: "Recovery", equipment: "Mat", sets: "1", reps: "5–15 min" },
  { id: 33, name: "Breathing Exercise", muscle: "Full Body", type: "Recovery", equipment: "None", sets: "1", reps: "3–5 min" },
];

function ExerciseLibrary() {

  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("All");
  
  const [selectedType, setSelectedType] = useState("All");

  const trainingTypes = [
  "All",
  "Strength",
  "Pole Dance",
  "Cardio",
  "Mobility",
  "Bodyweight",
  "Recovery",
  ];

  const [customExercises, setCustomExercises] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("uberform-custom-exercises")) || [];
    } catch {
      return [];
    }
  });
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Strength");
  const [newDifficulty, setNewDifficulty] = useState("Beginner");
  const [showForm, setShowForm] = useState(false);

  
const [poleProgress, setPoleProgress] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("uberform-pole-progress")) || {};
  } catch {
    return {};
  }
});

useEffect(() => {
  localStorage.setItem(
    "uberform-pole-progress",
    JSON.stringify(poleProgress)
  );
}, [poleProgress]);

const updatePoleProgress = (exerciseId, field, value) => {
  setPoleProgress((previous) => ({
    ...previous,
    [exerciseId]: {
      ...previous[exerciseId],
      [field]: value,
    },
  }));
};

  
useEffect(() => {
  localStorage.setItem(
    "uberform-custom-exercises",
    JSON.stringify(customExercises)
  );

  window.dispatchEvent(new Event("uberform-exercises-updated"));
}, [customExercises]);

  const allExercises = [...defaultExercises, ...customExercises];
  const muscleGroups = [
    "All", "Legs", "Glutes", "Back", "Chest",
    "Shoulders", "Arms", "Core",
  ];


const poleExercises = allExercises.filter(
  (exercise) => exercise.type === "Pole Dance"
);

const poleStats = {
  total: poleExercises.length,
  notStarted: poleExercises.filter(
    (exercise) =>
      (poleProgress[exercise.id]?.mastery ||
        exercise.mastery ||
        "Not started") === "Not started"
  ).length,
  learning: poleExercises.filter(
    (exercise) =>
      (poleProgress[exercise.id]?.mastery ||
        exercise.mastery ||
        "Not started") === "Learning"
  ).length,
  inProgress: poleExercises.filter(
    (exercise) =>
      (poleProgress[exercise.id]?.mastery ||
        exercise.mastery ||
        "Not started") === "In progress"
  ).length,
  mastered: poleExercises.filter(
    (exercise) =>
      (poleProgress[exercise.id]?.mastery ||
        exercise.mastery ||
        "Not started") === "Mastered"
  ).length,
};
  
const filteredExercises = allExercises.filter((exercise) => {
  const matchesSearch =
    exercise.name.toLowerCase().includes(search.toLowerCase()) ||
    exercise.muscle.toLowerCase().includes(search.toLowerCase()) ||
    exercise.type.toLowerCase().includes(search.toLowerCase());

  const matchesMuscle =
    selectedMuscle === "All" || exercise.muscle === selectedMuscle;

  const matchesType =
    selectedType === "All" || exercise.type === selectedType;

  return matchesSearch && matchesMuscle && matchesType;
});

  
function addExercise(event) {
  event.preventDefault();

  if (!newName.trim()) return;

  const exercise = {
    id: Date.now(),
    name: newName.trim(),
    type: newType,
    muscle: newType === "Pole Dance" ? "Full Body" : "Full Body",
    equipment: "Custom",
    sets: "3",
    reps: newType === "Cardio" ? "20–30 min" : "8–12",
    ...(newType === "Pole Dance" && {
      difficulty: newDifficulty,
      prerequisites: "None",
      mastery: "Not started",
    }),
  };

  setCustomExercises((previous) => [...previous, exercise]);
  setNewName("");
  setNewType("Strength");
  setNewDifficulty("Beginner");
  setShowForm(false);
  }

  return (
    <section className="exercise-library">
      <div className="library-heading">
        <div>
          <p className="library-eyebrow">YOUR TRAINING DATABASE</p>
          <h1>Exercise Library</h1>
          <p className="library-description">
            Find your next move. Build your strength.
          </p>
        </div>

        <button
          type="button"
          className="library-add-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Add exercise
        </button>
      </div>

      {showForm && (
        <form className="library-add-form" onSubmit={addExercise}>
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Exercise name"
            required
          />

          
<select
  value={newType}
  onChange={(event) => setNewType(event.target.value)}
>
  {trainingTypes.filter((type) => type !== "All").map((type) => (
    <option key={type} value={type}>{type}</option>
  ))}
</select>


{newType === "Pole Dance" && (
  <select
    value={newDifficulty}
    onChange={(event) => setNewDifficulty(event.target.value)}
    aria-label="Pole dance difficulty"
  >
    <option value="Beginner">Beginner</option>
    <option value="Intermediate">Intermediate</option>
    <option value="Advanced">Advanced</option>
  </select>
)}

          <button type="submit">Save exercise</button>
        </form>
      )}

      <div className="library-search">
        <Search size={19} />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search exercises or muscle groups..."
        />
      </div>

      <div className="library-filter-section">
  <p className="filter-label">TRAINING TYPE</p>

  <div className="muscle-filters">
    {trainingTypes.map((type) => (
      <button
        type="button"
        key={type}
        className={`muscle-filter ${
          selectedType === type ? "selected" : ""
        }`}
        onClick={() => {
          setSelectedType(type);
          setSelectedMuscle("All");
        }}
      >
        {type}
      </button>
    ))}
  </div>
</div>

{(selectedType === "All" || selectedType === "Strength") && (
<div className="library-filter-section">
  <p className="filter-label">MUSCLE GROUP</p>

      <div className="muscle-filters">
        {muscleGroups.map((group) => (
          <button
            type="button"
            key={group}
            className={`muscle-filter ${selectedMuscle === group ? "selected" : ""}`}
            onClick={() => setSelectedMuscle(group)}
          >
            {group}
          </button>
        ))}
      </div>
</div>   
)}

{selectedType === "Pole Dance" && (
  <div className="pole-stats-grid">
    <div className="pole-stat-card">
      <span>Total elements</span>
      <strong>{poleStats.total}</strong>
    </div>

    <div className="pole-stat-card">
      <span>Not started</span>
      <strong>{poleStats.notStarted}</strong>
    </div>

    <div className="pole-stat-card">
      <span>In progress</span>
      <strong>{poleStats.learning + poleStats.inProgress}</strong>
    </div>

    <div className="pole-stat-card">
      <span>Mastered</span>
      <strong>{poleStats.mastered}</strong>
    </div>
  </div>
)}

      <div className="library-results">
        <div className="library-results-heading">
          <h2>All exercises</h2>
          <span>{filteredExercises.length} exercises</span>
        </div>

        {filteredExercises.length > 0 ? (
          <div className="exercise-grid">
            {filteredExercises.map((exercise) => (
              <article className="exercise-card" key={exercise.id}>
                <div className="exercise-card-top">
                  <span className="exercise-icon">
                    <Dumbbell size={22} />
                  </span>
                  <span className="exercise-muscle">{exercise.muscle}</span>
                </div>

                
<h3>{exercise.name}</h3>
<p className="exercise-equipment">{exercise.equipment}</p>

{exercise.type === "Pole Dance" && (
  <div className="pole-exercise-info">
    <span className={`pole-difficulty ${(exercise.difficulty || "Beginner").toLowerCase()}`}>
      {exercise.difficulty || "Beginner"}
    </span>

        
<label className="pole-status-label">
  Mastery status
  <select
    className="pole-status-select"
    value={
      poleProgress[exercise.id]?.mastery ||
      exercise.mastery ||
      "Not started"
    }
    onChange={(event) =>
      updatePoleProgress(
        exercise.id,
        "mastery",
        event.target.value
      )
    }
  >
    <option value="Not started">Not started</option>
    <option value="Learning">Learning</option>
    <option value="In progress">In progress</option>
    <option value="Mastered">Mastered</option>
  </select>
</label>

  </div>
)}

                
{exercise.type !== "Pole Dance" && (
  <div className="exercise-details">
    <div>
      <span>SETS</span>
      <strong>{exercise.sets}</strong>
    </div>
    <div>
      <span>REPS</span>
      <strong>{exercise.reps}</strong>
    </div>
  </div>
)}
              </article>
            ))}
          </div>
        ) : (
          <p className="library-empty">
            No exercises found. Try another search.
          </p>
        )}
      </div>
    </section>
  );
}


function TrainingPlanner() {

const [availableExercises, setAvailableExercises] = useState(() => {
  try {
    const customExercises = JSON.parse(
      localStorage.getItem("uberform-custom-exercises")
    ) || [];

    return [...defaultExercises, ...customExercises];
  } catch {
    return defaultExercises;
  }
});


  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [plannedWorkouts, setPlannedWorkouts] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("uberform-planner") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutType, setWorkoutType] = useState("Strength");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "uberform-planner",
      JSON.stringify(plannedWorkouts)
    );
  }, [plannedWorkouts]);

  function addPlannedWorkout(event) {
    event.preventDefault();

    if (!workoutName.trim() && selectedExercises.length === 0) {
  alert("Upiši naziv treninga ili odaberi barem jednu vježbu.");
  return;
    }

    setPlannedWorkouts((previous) => [
      ...previous,
      {
        id: Date.now(),
        day: selectedDay,
        name: workoutName.trim() || `${workoutType} Workout`,
        type: workoutType,
        exercises: selectedExercises,
      },
    ]);

    setWorkoutName("");
    setSelectedExercises([]);
  }

  function removePlannedWorkout(id) {
    setPlannedWorkouts((previous) =>
      previous.filter((workout) => workout.id !== id)
    );
  }

  return (
    <main className="main-content">
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-divider">/</span>
          <strong>Training planner</strong>
        </div>
      </header>

      <section className="exercise-library">
        <div className="library-heading">
          <div>
            <p className="library-eyebrow">YOUR WEEKLY ROUTINE</p>
            <h1>Training planner</h1>
            <p className="library-description">
              Build your week. Find your rhythm.
            </p>
          </div>
        </div>

        <form
          className="library-add-form"
          onSubmit={addPlannedWorkout}
        >
          <input
            value={workoutName}
            onChange={(event) => setWorkoutName(event.target.value)}
            placeholder="Workout name"
            />

          <select
            value={workoutType}
            onChange={(event) => setWorkoutType(event.target.value)}
          >
            <option>Strength</option>
            <option>Pole Dance</option>
            <option>Cardio</option>
            <option>Mobility</option>
            <option>Bodyweight</option>
            <option>Recovery</option>
          </select>

          <select
            value={selectedDay}
            onChange={(event) => setSelectedDay(event.target.value)}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

           
<div className="planner-exercise-picker">
  <button
    type="button"
    className="planner-exercise-toggle"
    onClick={() => setShowExercisePicker((previous) => !previous)}
  >
    <span>
      Choose exercises
      <small>
        {selectedExercises.length > 0
          ? `${selectedExercises.length} selected`
          : "Select exercises for your workout"}
      </small>
    </span>
    <span>{showExercisePicker ? "−" : "+"}</span>
  </button>

  {showExercisePicker && (
    <div className="planner-exercise-grid">
      {availableExercises
        .filter(
          (exercise) =>
            workoutType === "All" || exercise.type === workoutType
        )
        .map((exercise) => (
          <label className="planner-exercise-option" key={exercise.id}>
            <input
              type="checkbox"
              checked={selectedExercises.some(
                (selected) => selected.id === exercise.id
              )}
              onChange={(event) => {
                if (event.target.checked) {
                  setSelectedExercises((previous) => [
                    ...previous,
                    exercise,
                  ]);
                } else {
                  setSelectedExercises((previous) =>
                    previous.filter(
                      (selected) => selected.id !== exercise.id
                    )
                  );
                }
              }}
            />

            <span>{exercise.name}</span>
            <small>{exercise.muscle}</small>
          </label>
        ))}
    </div>
  )}
</div>

<button type="submit">Add to week</button>
</form>
        <div className="planner-week">
          {days.map((day) => {
            const dayWorkouts = plannedWorkouts.filter(
              (workout) => workout.day === day
            );

            return (
              <section className="planner-day" key={day}>
                <h2>{day}</h2>

                {dayWorkouts.length === 0 ? (
                  <p className="planner-rest">No workouts planned</p>
                ) : (
                  dayWorkouts.map((workout) => (
                    
  <article className="planner-workout" key={workout.id}>
  <span>{workout.type}</span>
  <h3>{workout.name}</h3>

  {workout.exercises && workout.exercises.length > 0 && (
    <ul className="planner-workout-exercises">
      {workout.exercises.map((exercise) => (
        <li key={exercise.id}>{exercise.name}</li>
      ))}
    </ul>
  )}

  <button
    type="button"
    onClick={() => removePlannedWorkout(workout.id)}
    aria-label={`Remove ${workout.name}`}
  >
    Remove
  </button>
</article>
                  ))
                )}
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  
const [weeklyTarget, setWeeklyTarget] = useState(() => {
  try {
    const saved = Number(localStorage.getItem("uberform-weekly-target"));
    return saved >= 1 && saved <= 7 ? saved : 5;
  } catch {
    return 5;
  }
});


const [workoutReminders, setWorkoutReminders] = useState(() => {
  try {
    const saved = localStorage.getItem("uberform-workout-reminders");
    return saved === null ? true : saved === "true";
  } catch {
    return true;
  }
});

const [achievementNotifications, setAchievementNotifications] = useState(() => {
  try {
    const saved = localStorage.getItem("uberform-achievement-notifications");
    return saved === null ? true : saved === "true";
  } catch {
    return true;
  }
});

const [accentColor, setAccentColor] = useState(() => {
  try {
    const saved = localStorage.getItem("uberform-accent-color");
    return ["red", "purple", "blue"].includes(saved) ? saved : "red";
  } catch {
    return "red";
  }
});

useEffect(() => {
  try {
    localStorage.setItem("uberform-accent-color", accentColor);
  } catch {
    // Settings can still work if localStorage is unavailable.
  }
}, [accentColor]);

  
const [profile, setProfile] = useState(() => {
  try {
    return {
      fullName: "",
      username: "",
      email: "",
      experience: "Intermediate",
      goal: "Build muscle",
      ...JSON.parse(localStorage.getItem("uberform-profile") || "{}"),
    };
  } catch {
    return {
      fullName: "",
      username: "",
      email: "",
      experience: "Intermediate",
      goal: "Build muscle",
    };
  }
});


  const [workouts, setWorkouts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("uberform-workouts") || "[]");
    } catch {
      return [];
    }
  });
  const [newAchievement, setNewAchievement] = useState(null);

  useEffect(() => {
    localStorage.setItem("uberform-workouts", JSON.stringify(workouts));
  }, [workouts]);

  
  useEffect(() => {
    localStorage.setItem("uberform-profile", JSON.stringify(profile));
  }, [profile]);

  
useEffect(() => {
  localStorage.setItem("uberform-weekly-target", String(weeklyTarget));
}, [weeklyTarget]);


useEffect(() => {
  localStorage.setItem(
    "uberform-workout-reminders",
    String(workoutReminders)
  );
}, [workoutReminders]);

useEffect(() => {
  localStorage.setItem(
    "uberform-achievement-notifications",
    String(achievementNotifications)
  );
}, [achievementNotifications]);




  
function saveWorkout(workout) {
  const workoutWithDate = {
    ...workout,
    createdAt: workout.createdAt || new Date().toISOString(),
  };

  setWorkouts((previous) => [workoutWithDate, ...previous]);
}

  
function deleteWorkout(workoutId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this workout?"
  );

  if (!confirmed) return;

  setWorkouts((previous) =>
    previous.filter((workout) => workout.id !== workoutId)
  );
}


function getUnlockedAchievementNames(workoutList) {
  const completed = workoutList.filter(
    (workout) =>
      workout.completed &&
      workout.completedAt &&
      !Number.isNaN(new Date(workout.completedAt).getTime())
  );

  const names = [];

  if (completed.length >= 1) names.push("First Blood");
  if (completed.length >= 10) names.push("Getting Serious");
  if (completed.length >= 25) names.push("Iron Will");
  if (completed.length >= 100) names.push("Unstoppable");

  const weeklyCounts = new Map();

  completed.forEach((workout) => {
    const date = new Date(workout.completedAt);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));

    const weekKey = date.getTime();
    weeklyCounts.set(weekKey, (weeklyCounts.get(weekKey) || 0) + 1);
  });

  const weeks = [...weeklyCounts.keys()].sort((a, b) => a - b);

  if (weeks.length > 0) {
    const lastWeek = new Date();
    lastWeek.setHours(0, 0, 0, 0);
    lastWeek.setDate(lastWeek.getDate() - ((lastWeek.getDay() + 6) % 7));

    let streakOne = 0;
    let streakTwo = 0;

    for (
      let week = new Date(weeks[0]);
      week <= lastWeek;
      week.setDate(week.getDate() + 7)
    ) {
      const count = weeklyCounts.get(week.getTime()) || 0;

      streakOne = count >= 1 ? streakOne + 1 : 0;
      streakTwo = count >= 2 ? streakTwo + 1 : 0;

      if (count >= 4 && !names.includes("No Excuses")) {
        names.push("No Excuses");
      }

      if (streakOne >= 3 && !names.includes("On a Roll")) {
        names.push("On a Roll");
      }

      if (streakTwo >= 4 && !names.includes("Dedicated")) {
        names.push("Dedicated");
      }
    }
  }

  return names;
}




function completeWorkout(workoutId) {
  const workout = workouts.find((item) => item.id === workoutId);

  if (!workout) return;

  const updatedWorkout = {
    ...workout,
    completed: !workout.completed,
    completedAt: workout.completed
      ? null
      : new Date().toISOString(),
  };

  const updatedWorkouts = workouts.map((item) =>
    item.id === workoutId ? updatedWorkout : item
  );

  if (updatedWorkout.completed) {
    const previousAchievements = getUnlockedAchievementNames(workouts);
    const newAchievements = getUnlockedAchievementNames(updatedWorkouts);
    const newlyUnlocked = newAchievements.filter(
      (name) => !previousAchievements.includes(name)
    );

    if (newlyUnlocked.length > 0) {
      setNewAchievement(newlyUnlocked[0]);
    }
  }

  setWorkouts(updatedWorkouts);
}


function exportAppData() {
  const exportData = {
    app: "Überform",
    exportedAt: new Date().toISOString(),
    workouts,
    profile,
    weeklyTarget,
    workoutReminders,
    achievementNotifications,
    accentColor,
  };

  const file = new Blob(
    [JSON.stringify(exportData, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = "uberform-data.json";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

    window.alert("Your Überform data export has started.");
}


  return (
    <div className="app-shell" data-accent={accentColor}>
      
        {newAchievement && (
      <AchievementCelebration
         achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
  )}

      <Sidebar
       currentPage={currentPage}
       onNavigate={setCurrentPage}
       workouts={workouts}
      />
      
    
{currentPage === "Dashboard" ? (
  
<Dashboard
  workouts={workouts}
  onSaveWorkout={saveWorkout}
  onDeleteWorkout={deleteWorkout}
  onNavigate={setCurrentPage}
  profile={profile}
  weeklyTarget={weeklyTarget}
/>


) : currentPage === "Exercise Library" ? (
  <main className="main-content">
    <header className="topbar">
      <div className="breadcrumb">
        <span>Workspace</span>
        <span className="breadcrumb-divider">/</span>
        <strong>Exercise Library</strong>
      </div>
      <button className="profile-button" aria-label="User profile">
        <CircleUserRound size={21} />
      </button>
    </header>

    <ExerciseLibrary />
  </main>


) : currentPage === "Training planner" ? (
  <TrainingPlanner />

  
) : currentPage === "Progress" ? (
  <Progress workouts={workouts} />

) : currentPage === "My Workouts" ? (
  <MyWorkouts
  workouts={workouts}
  onDeleteWorkout={deleteWorkout}
  onCompleteWorkout={completeWorkout}
/>

) : currentPage === "Achievements" ? (
  <Achievements workouts={workouts} />

) : currentPage === "Settings" ? (
  
<Settings
  profile={profile}
  setProfile={setProfile}
  weeklyTarget={weeklyTarget}
  setWeeklyTarget={setWeeklyTarget}
  workoutReminders={workoutReminders}
  setWorkoutReminders={setWorkoutReminders}
  achievementNotifications={achievementNotifications}
  setAchievementNotifications={setAchievementNotifications}
  accentColor={accentColor}
  setAccentColor={setAccentColor}
  onExportData={exportAppData}
  setWorkouts={setWorkouts}
/>

) : (

  
<Dashboard
  workouts={workouts}
  onSaveWorkout={saveWorkout}
  onDeleteWorkout={deleteWorkout}
  onNavigate={setCurrentPage}
  profile={profile}
  weeklyTarget={weeklyTarget}
/>

)}


    </div>
  );
}




function Settings({
  profile,
  setProfile,
  weeklyTarget,
  setWeeklyTarget,
  workoutReminders,
  setWorkoutReminders,
  achievementNotifications,
  setAchievementNotifications,
  accentColor,
  setAccentColor,
  onExportData,
  setWorkouts,
}) {


  const [activeSection, setActiveSection] = useState("Profile");

  const sections = [
    { name: "Profile", icon: CircleUserRound },
    { name: "Training", icon: Dumbbell },
    { name: "Notifications", icon: Bell },
    { name: "Appearance", icon: Palette },
    { name: "Data & privacy", icon: ShieldCheck },
  ];

  return (
    <main className="main-content">
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-divider">/</span>
          <strong>Settings</strong>
        </div>
        <button className="profile-button" aria-label="User profile">
          <CircleUserRound size={21} />
        </button>
      </header>

      <section className="page-content">
        <div className="page-heading">
          <p className="eyebrow">PREFERENCES</p>
          <h1>Settings</h1>
          <p>Customize your Überform experience.</p>
        </div>

        <div className="settings-layout">
          <nav className="settings-nav">
            {sections.map(({ name, icon: Icon }) => (
              <button
                key={name}
                className={`settings-nav-item ${
                  activeSection === name ? "active" : ""
                }`}
                onClick={() => setActiveSection(name)}
              >
                <Icon size={19} />
                <span>{name}</span>
              </button>
            ))}
          </nav>

          
<section className="settings-panel">
  <h2>{activeSection}</h2>
  <p className="settings-description">
    {activeSection === "Profile"
      ? "Manage your personal information."
      : activeSection === "Training"
      ? "Set your weekly workout target."
      : activeSection === "Notifications"
      ? "Manage your reminders and notifications."
      : activeSection === "Appearance"
      ? "Personalize the look of Überform."
      : "Manage your data and privacy preferences."}
  </p>

  {activeSection === "Profile" ? (
    <ProfileSettings profile={profile} setProfile={setProfile} />
  ) : activeSection === "Training" ? (
    <div className="training-settings">
      <div className="training-setting-heading">
        <div>
          <h3>Weekly workout target</h3>
          <p>How many workouts do you want to complete each week?</p>
        </div>
        <span className="training-target-value">
          {weeklyTarget} <small>/ 7</small>
        </span>
      </div>

      <div className="training-target-options">
        {[1, 2, 3, 4, 5, 6, 7].map((target) => (
          <button
            key={target}
            type="button"
            className={`training-target-option ${
              weeklyTarget === target ? "active" : ""
            }`}
            onClick={() => setWeeklyTarget(target)}
            aria-pressed={weeklyTarget === target}
          >
            {target}
          </button>
        ))}
      </div>

      <p className="training-target-note">
        Your target is saved automatically.
      </p>
    </div>
 
) : activeSection === "Notifications" ? (
  <div className="notification-settings">
    <div className="notification-setting">
      <div className="notification-setting-icon">
        <BellRing size={20} />
      </div>

      <div className="notification-setting-info">
        <h3>Workout reminders</h3>
        <p>Get reminders for your planned workouts.</p>
      </div>

      <button
        type="button"
        className={`notification-toggle ${
          workoutReminders ? "active" : ""
        }`}
        role="switch"
        aria-checked={workoutReminders}
        aria-label="Workout reminders"
        onClick={() => setWorkoutReminders((previous) => !previous)}
      >
        <span />
      </button>
    </div>

    <div className="notification-setting">
      <div className="notification-setting-icon">
        <Trophy size={20} />
      </div>

      <div className="notification-setting-info">
        <h3>Achievement notifications</h3>
        <p>Get notified when you unlock achievements.</p>
      </div>

      <button
        type="button"
        className={`notification-toggle ${
          achievementNotifications ? "active" : ""
        }`}
        role="switch"
        aria-checked={achievementNotifications}
        aria-label="Achievement notifications"
        onClick={() =>
          setAchievementNotifications((previous) => !previous)
        }
      >
        <span />
      </button>
    </div>
  </div>
) : activeSection === "Appearance" ? (

  <div className="appearance-settings">
    <div className="appearance-setting">
      <div className="appearance-setting-info">
        <h3>Accent color</h3>
        <p>Choose the accent color used throughout Überform.</p>
      </div>

  <div className="appearance-color-options">
  <button
    type="button"
    className={`appearance-color-option ${
      accentColor === "red" ? "active" : ""
    }`}
    aria-label="Red accent color"
    aria-pressed={accentColor === "red"}
    onClick={() => setAccentColor("red")}
  >
    <span className="appearance-color-swatch red" />
  </button>

  <button
    type="button"
    className={`appearance-color-option ${
      accentColor === "purple" ? "active" : ""
    }`}
    aria-label="Purple accent color"
    aria-pressed={accentColor === "purple"}
    onClick={() => setAccentColor("purple")}
  >
    <span className="appearance-color-swatch purple" />
  </button>

  <button
    type="button"
    className={`appearance-color-option ${
      accentColor === "blue" ? "active" : ""
    }`}
    aria-label="Blue accent color"
    aria-pressed={accentColor === "blue"}
    onClick={() => setAccentColor("blue")}
  >
    <span className="appearance-color-swatch blue" />
  </button>
</div>
</div>

  </div>

) : activeSection === "Data & privacy" ? (
  <div className="data-privacy-settings">
    <div className="privacy-setting">
      <div>
        <h3>Export my data</h3>
        <p>Download a copy of your workouts and app settings.</p>
      </div>
      <button
         type="button"
          className="privacy-action-button"
          onClick={onExportData}
      >
         Export data
      </button>
    </div>

    
<div className="privacy-setting">
  <div>
    <h3>Clear workout history</h3>
    <p>Remove your recorded workouts from the app.</p>
  </div>
  <button
    type="button"
    className="privacy-action-button danger"
    onClick={() => {
      const confirmed = window.confirm(
        "Are you sure you want to clear your entire workout history? This cannot be undone."
      );

      if (confirmed) {
        setWorkouts([]);
        window.alert("Workout history cleared successfully.");
      }
    }}
  >
    Clear history
  </button>
</div>


    
<div className="privacy-setting">
  <div>
    <h3>Delete all data</h3>
    <p>Remove your saved app data and start fresh.</p>
  </div>
  <button
    type="button"
    className="privacy-action-button danger"
    onClick={() => {
      const confirmed = window.confirm(
        "Delete all Überform data? This will remove your workouts, profile, settings, custom exercises and planned workouts. This cannot be undone."
      );

      if (!confirmed) return;

      [
        "uberform-workouts",
        "uberform-profile",
        "uberform-weekly-target",
        "uberform-workout-reminders",
        "uberform-achievement-notifications",
        "uberform-custom-exercises",
        "uberform-planner",
        "uberform-pole-progress",
        "uberform-accent-color",
      ].forEach((key) => localStorage.removeItem(key));

      window.alert("All Überform data has been deleted successfully.");
      window.location.reload();
    }}
  >
    Delete all data
  </button>
</div>

    <div className="privacy-information">
      <h3>Your privacy</h3>
      <p>
        Überform stores your saved information in this browser.
        Your data may be lost if browser storage is cleared.
      </p>
    </div>
  </div>
) : (
  <div className="settings-placeholder">
    <SettingsIcon size={28} />
    <p>
      We’ll configure your {activeSection.toLowerCase()} settings here.
    </p>
  </div>
)}


</section>

        </div>
      </section>
    </main>
  );
}



function ProfileSettings({ profile, setProfile }) {
  
  const [saved, setSaved] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
    setSaved(false);
  }

  
function handleSave(event) {
  event.preventDefault();

  setProfile((previous) => ({
    ...previous,
    fullName: profile.fullName.trim(),
    username: profile.username.trim(),
    email: profile.email.trim(),
  }));

  setSaved(true);
}


  return (
    <form className="profile-settings-form" onSubmit={handleSave}>
      <div className="profile-section-heading">
        <div>
          <h3>Personal information</h3>
          <p>Update the details associated with your account.</p>
        </div>
        <div className="profile-avatar">
          <CircleUserRound size={30} />
        </div>
      </div>

      <div className="profile-fields">
        <label>
          Full name
          <input
            name="fullName"
            value={profile.fullName}
            onChange={updateField}
            placeholder="Enter your name"
          />
        </label>

        <label>
          Username
          <input
            name="username"
            value={profile.username}
            onChange={updateField}
            placeholder="Choose a username"
          />
        </label>

        <label className="profile-field-full">
          Email address
          <input
            name="email"
            type="email"
            value={profile.email}
            onChange={updateField}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <div className="profile-divider" />

      <div className="profile-section-heading">
        <div>
          <h3>Training profile</h3>
          <p>Personalize your experience around your goals.</p>
        </div>
      </div>

      <div className="profile-fields">
        <label>
          Experience level
          <select
            name="experience"
            value={profile.experience}
            onChange={updateField}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>

        <label>
          Primary goal
          <select
            name="goal"
            value={profile.goal}
            onChange={updateField}
          >
            <option>Build muscle</option>
            <option>Lose body fat</option>
            <option>Improve strength</option>
            <option>Improve endurance</option>
            <option>Maintain fitness</option>
            <option>Improve flexibility</option>
          </select>
        </label>
      </div>

      <div className="profile-form-footer">
        <span className={saved ? "profile-save-status success" : "profile-save-status"}>
          {saved ? "Changes saved for this session" : "Changes are not saved yet"}
        </span>
        <button className="primary-button" type="submit">
          Save changes
        </button>
      </div>
    </form>
  );
}
