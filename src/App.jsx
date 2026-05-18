import { useState, useEffect } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const TARGETS = { calories: 3000, protein: 140, water: 3.5, sleep: 7 };
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const WEEK_GYM = ["Push","Pull","Legs","Rest","Push","Pull","Rest"];
const GYM_COLORS = { Push:"#f97316", Pull:"#1d4ed8", Legs:"#4f46e5", Rest:"#5f7392" };

const INITIAL_LIFTS = [
  { name:"Bench Press", current:20, target:40, unit:"kg" },
  { name:"Overhead Press", current:15, target:30, unit:"kg" },
  { name:"Squat", current:30, target:60, unit:"kg" },
  { name:"Deadlift", current:40, target:70, unit:"kg" },
  { name:"Pull-ups", current:3, target:12, unit:"reps" },
  { name:"Dumbbell Row", current:12, target:25, unit:"kg" },
];

const WORKOUT_PLANS = {
  Push: [
    { name:"Barbell Bench Press", sets:3, reps:"8-10", rest:"90s", notes:"Chest focus, controlled descent" },
    { name:"Overhead Press", sets:3, reps:"8-10", rest:"90s", notes:"Full extension overhead" },
    { name:"Incline DB Press", sets:3, reps:"10-12", rest:"60s", notes:"30-45 degree angle" },
    { name:"Lateral Raises", sets:3, reps:"12-15", rest:"45s", notes:"Light weight, squeeze at top" },
    { name:"Tricep Pushdowns", sets:3, reps:"12-15", rest:"45s", notes:"Elbows tucked to sides" },
    { name:"Push-ups Burnout", sets:2, reps:"failure", rest:"60s", notes:"Last exercise, full range" },
  ],
  Pull: [
    { name:"Pull-ups / Lat Pulldown", sets:3, reps:"6-10", rest:"90s", notes:"Full stretch at bottom" },
    { name:"Barbell Row", sets:3, reps:"8-10", rest:"90s", notes:"Chest to bench for support" },
    { name:"Cable Row", sets:3, reps:"10-12", rest:"60s", notes:"Squeeze shoulder blades together" },
    { name:"Face Pulls", sets:3, reps:"15-20", rest:"45s", notes:"Rear delt health, external rotation" },
    { name:"Dumbbell Curl", sets:3, reps:"10-12", rest:"45s", notes:"Supinate at top" },
    { name:"Hammer Curl", sets:2, reps:"12", rest:"45s", notes:"Brachialis focus" },
  ],
  Legs: [
    { name:"Squat", sets:4, reps:"8-10", rest:"2min", notes:"Break parallel, back straight" },
    { name:"Romanian Deadlift", sets:3, reps:"10-12", rest:"90s", notes:"Hamstring stretch focus" },
    { name:"Leg Press", sets:3, reps:"12-15", rest:"60s", notes:"Full range, don't lock knees" },
    { name:"Leg Extension", sets:3, reps:"15", rest:"45s", notes:"Quad isolation" },
    { name:"Calf Raises", sets:4, reps:"20", rest:"30s", notes:"Full stretch and squeeze" },
    { name:"Plank", sets:3, reps:"45s", rest:"30s", notes:"Core bracing, breathe normally" },
  ],
  Rest: [],
};

const RECIPES = [
  { id:1, name:"Night Shift Survival Pasta", cal:620, protein:22, prep:12, diff:"Easy", timing:"Night Shift", tags:["night shift friendly","lazy meal","high calorie"], ingredients:["80g pasta","2 tbsp butter","3 cheese cubes","1 tsp garlic powder","salt + pepper","corn (optional)"], steps:"Boil pasta al dente. Drain. Immediately add butter + grated cheese — heat melts everything. Season generously. Done.", notes:"Add paneer cubes for +15g protein. Best eaten fresh." },
  { id:2, name:"Peanut Butter Banana Sandwich", cal:520, protein:18, prep:5, diff:"Very Easy", timing:"Pre-Workout / Breakfast", tags:["quick snack","high calorie","budget friendly"], ingredients:["2 bread slices","2 tbsp peanut butter","1 banana","honey"], steps:"Spread PB generously. Layer banana slices. Drizzle honey. Press and eat.", notes:"Use 3 slices for +80 kcal. Works with any bread." },
  { id:3, name:"Paneer Pasta", cal:680, protein:34, prep:15, diff:"Easy", timing:"Lunch / Dinner", tags:["high protein","high calorie","office tiffin"], ingredients:["80g pasta","100g paneer","2 tbsp pasta sauce","1 tbsp olive oil","mixed veggies","chili flakes"], steps:"Boil pasta. Cube paneer, pan-fry golden in oil. Mix with sauce + pasta. Season with chili flakes.", notes:"Packs well as tiffin. Tastes great cold too." },
  { id:4, name:"Oats Power Bowl", cal:480, protein:20, prep:7, diff:"Very Easy", timing:"Breakfast", tags:["lazy meal","budget friendly","high protein"], ingredients:["80g rolled oats","300ml whole milk","1 banana","1 tbsp peanut butter","1 tbsp honey","dry fruits handful"], steps:"Cook oats in milk 5 min. Transfer to bowl. Top with sliced banana, PB, honey, dry fruits.", notes:"Overnight soak in milk = zero morning effort. Just top and eat." },
  { id:5, name:"Potato Cheese Sandwich", cal:500, protein:14, prep:10, diff:"Easy", timing:"Breakfast / Snack", tags:["budget friendly","high calorie","office tiffin"], ingredients:["3 bread slices","1 boiled potato","2 cheese cubes","2 tsp butter","green chutney","salt"], steps:"Mash potato + grated cheese + salt. Spread chutney on bread. Fill. Butter outside. Grill 3 min.", notes:"Boil potatoes in bulk weekly. Morning prep = 3 min." },
  { id:6, name:"Soya Chunk Pasta", cal:640, protein:38, prep:15, diff:"Medium", timing:"Lunch / Dinner", tags:["high protein","high calorie"], ingredients:["80g pasta","50g soya chunks","3 tbsp pasta sauce","onion","garlic","cumin","spices"], steps:"Soak soya 10 min in hot salted water. Drain + squeeze. Saute onion+garlic, add soya+sauce, cook 5 min. Mix with boiled pasta.", notes:"Highest protein in the list. Meal prep-friendly." },
  { id:7, name:"Cheese Butter Pasta", cal:700, protein:20, prep:10, diff:"Easy", timing:"Night Shift / Late Dinner", tags:["lazy meal","high calorie","night shift friendly"], ingredients:["100g pasta","3 tbsp butter","4 cheese cubes","3 garlic cloves","mixed herbs","black pepper"], steps:"Cook pasta. Melt butter in hot pan, add minced garlic 30s. Pour over pasta, grate cheese on top. Toss well.", notes:"Indulgent. Best for high-calorie days or after heavy gym session." },
  { id:8, name:"Banana Mass Shake", cal:560, protein:28, prep:3, diff:"Very Easy", timing:"Post-Workout / Pre-Sleep", tags:["high calorie","high protein","quick snack"], ingredients:["2 bananas","300ml whole milk","1 scoop whey protein","1 tbsp peanut butter","1 tsp honey","4 ice cubes"], steps:"Add everything to blender. Blend 60 seconds. Drink immediately.", notes:"Add 2 tbsp oats for extra 80 kcal and slower absorption." },
  { id:9, name:"Bread Butter Cheese Meal", cal:420, protein:12, prep:3, diff:"Very Easy", timing:"Quick Snack / Night Shift", tags:["lazy meal","budget friendly","night shift friendly"], ingredients:["3 bread slices","3 tbsp butter","3 cheese cubes"], steps:"Butter bread generously. Slice cheese on top. Optional: 2 min in microwave to melt.", notes:"Zero-energy go-to. Always stock bread + cheese cubes." },
  { id:10, name:"Curd Rice Bowl", cal:400, protein:14, prep:5, diff:"Very Easy", timing:"Lunch / Light Dinner", tags:["budget friendly","lazy meal","office tiffin"], ingredients:["1 cup cooked rice","200g curd","salt","cumin seeds","curry leaves","1 tsp ghee"], steps:"Mix curd into cooked rice. Temper cumin + curry leaves in ghee. Pour over. Season.", notes:"Cooling meal. Good on rest days or when gut needs a break." },
  { id:11, name:"Ghee Roti + Peanut Chutney", cal:460, protein:16, prep:8, diff:"Easy", timing:"Dinner / Night Snack", tags:["budget friendly","high calorie"], ingredients:["3 rotis","1 tbsp ghee each","3 tbsp peanut chutney"], steps:"Apply generous ghee on hot rotis. Pair with peanut chutney for dipping.", notes:"Simple home meal. Ghee = healthy fats + good calories." },
];

const INIT_GROCERY = [
  { item:"Oats (500g)", cost:65, qty:100 },
  { item:"Whole Milk (1L)", cost:60, qty:70 },
  { item:"Peanut Butter (500g)", cost:250, qty:50 },
  { item:"Paneer (200g)", cost:80, qty:20 },
  { item:"Pasta (500g)", cost:55, qty:100 },
  { item:"Pasta Sauce", cost:70, qty:50 },
  { item:"Cheese Cubes (12pk)", cost:120, qty:25 },
  { item:"Bread (loaf)", cost:45, qty:60 },
  { item:"Bananas (dozen)", cost:50, qty:20 },
  { item:"Soya Chunks (500g)", cost:80, qty:90 },
  { item:"Whey Protein (1kg)", cost:1800, qty:55 },
  { item:"Creatine (300g)", cost:900, qty:80 },
  { item:"Dry Fruits Mix (200g)", cost:180, qty:25 },
  { item:"Curd (500g)", cost:50, qty:100 },
  { item:"Butter / Ghee (500g)", cost:90, qty:40 },
  { item:"Rice (1kg)", cost:60, qty:70 },
];

const MEAL_SLOTS = [
  { key:"breakfast", label:"Breakfast", emoji:"🌅", time:"7-9 AM", suggestions:["Oats Power Bowl","Bread Butter Cheese Meal","Curd Rice Bowl"] },
  { key:"preWorkout", label:"Pre-Workout", emoji:"💪", time:"-60 min", suggestions:["Peanut Butter Banana Sandwich","Ghee Roti + Peanut Chutney"] },
  { key:"postWorkout", label:"Post-Workout", emoji:"🥤", time:"+30 min", suggestions:["Banana Mass Shake","Paneer Pasta","Oats Power Bowl"] },
  { key:"lunch", label:"Lunch / Tiffin", emoji:"🍱", time:"1-3 PM", suggestions:["Paneer Pasta","Soya Chunk Pasta","Curd Rice Bowl"] },
  { key:"dinner", label:"Dinner", emoji:"🌙", time:"7-9 PM", suggestions:["Night Shift Survival Pasta","Cheese Butter Pasta","Soya Chunk Pasta"] },
  { key:"nightSnack", label:"Night Snack", emoji:"🌃", time:"1-2 AM", suggestions:["Bread Butter Cheese Meal","Potato Cheese Sandwich","Peanut Butter Banana Sandwich"] },
  { key:"preSleep", label:"Pre-Sleep", emoji:"😴", time:"4-5 AM", suggestions:["Banana Mass Shake","Curd + Dry Fruits","Warm Milk"] },
];

// ─── PERSISTENCE ─────────────────────────────────────────────────────────────
function usePersist(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem("gainos_"+key); return s ? JSON.parse(s) : (typeof init === "function" ? init() : init); }
    catch { return typeof init === "function" ? init() : init; }
  });
  useEffect(() => {
    try { localStorage.setItem("gainos_"+key, JSON.stringify(val)); }
    catch { /* Ignore storage write errors so the tracker still works in private mode. */ }
  }, [val, key]);
  return [val, setVal];
}

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
const GTag = ({ t }) => {
  const C = { "lazy meal":"#16a34a","high calorie":"#f97316","high protein":"#1d4ed8","night shift friendly":"#4f46e5","office tiffin":"#0f9f7a","quick snack":"#ea580c","budget friendly":"#db2777" };
  const c = C[t]||"#4a6182";
  return <span style={{ background:c+"18", color:c, border:`1px solid ${c}40`, borderRadius:20, padding:"2px 9px", fontSize:10, fontWeight:700 }}>{t}</span>;
};

const Ring = ({ value, max, color, label, unit, size=90 }) => {
  const r = (size-12)/2, circ = 2*Math.PI*r, dash = Math.min(value/max,1)*circ;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
      <div style={{ position:"relative", width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#dbe8ff" strokeWidth={9}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={9}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition:"stroke-dasharray .7s cubic-bezier(.4,0,.2,1)" }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color, letterSpacing:1, lineHeight:1 }}>{value}</span>
          <span style={{ fontSize:9, color:"#4a6182", letterSpacing:.4 }}>{unit}</span>
        </div>
      </div>
      <span style={{ fontSize:10, color:"#4a6182", textTransform:"uppercase", letterSpacing:1 }}>{label}</span>
    </div>
  );
};

const Slider = ({ label, value, max, unit, color, step=1, onChange }) => (
  <div style={{ marginBottom:16 }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
      <span style={{ fontSize:12, color:"#526b8f" }}>{label}</span>
      <span style={{ fontSize:12, fontWeight:700, color, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1, whiteSpace:"nowrap", flexShrink:0 }}>{value}{unit} <span style={{color:"#7a8aaa",fontSize:10}}>/ {max}</span></span>
    </div>
    <div style={{ position:"relative", height:6, background:"#dbe8ff", borderRadius:6, cursor:"pointer" }}>
      <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${Math.min(value/max,1)*100}%`, background:color, borderRadius:6, transition:"width .25s", opacity:.85 }}/>
    </div>
    <input type="range" min={0} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}
      style={{ width:"100%", marginTop:-12, height:18, accentColor:color, cursor:"pointer", opacity:0, position:"relative", zIndex:2 }}/>
  </div>
);

const StatBox = ({ label, val, color, sub }) => (
  <div style={{ background:"#eef5ff", borderRadius:12, padding:"12px 14px" }}>
    <div style={{ fontSize:10, color:"#4a6182", marginBottom:4, textTransform:"uppercase", letterSpacing:.8 }}>{label}</div>
    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color, letterSpacing:1, lineHeight:1 }}>{val}</div>
    {sub && <div style={{ fontSize:10, color:"#5f7392", marginTop:3 }}>{sub}</div>}
  </div>
);

const Toggle = ({ label, emoji, on, onToggle, color="#16a34a" }) => (
  <button onClick={onToggle} style={{ flex:1, minWidth:100, padding:"11px 12px", borderRadius:12, border:`1px solid ${on?color+"50":"#b9cdf2"}`, background:on?color+"12":"#eef5ff", color:on?color:"#5f7392", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit", transition:"all .2s" }}>
    <span style={{ marginRight:5 }}>{emoji}</span>{on?"✓ ":""}{label}
  </button>
);

const WeightChart = ({ history }) => {
  if (!history || history.length < 2) return <div style={{ height:80, display:"flex", alignItems:"center", justifyContent:"center", color:"#7a8aaa", fontSize:12 }}>Log more days to see chart</div>;
  const vals = history.map(h=>h.w);
  const mn = Math.min(...vals)-0.5, mx = Math.max(...vals)+0.5;
  const W=280, H=70, p=8;
  const x = i => p + (i/(vals.length-1))*(W-p*2);
  const y = v => H-p - ((v-mn)/(mx-mn||1))*(H-p*2);
  const pts = vals.map((v,i)=>`${x(i)},${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:70 }}>
      <polyline points={pts} fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {vals.map((v,i)=><circle key={i} cx={x(i)} cy={y(v)} r="3" fill="#1d4ed8"/>)}
      <text x={x(vals.length-1)} y={y(vals[vals.length-1])-7} textAnchor="middle" fill="#1d4ed8" fontSize="9">{vals[vals.length-1]}kg</text>
    </svg>
  );
};

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function GainOS() {
  const today = new Date();
  const dayIdx = (today.getDay()+6)%7;
  const todayKey = today.toISOString().slice(0,10);

  const [tab, setTab] = useState("dashboard");
  const [weight, setWeight] = usePersist("weight", 58.5);
  const [weightHistory, setWeightHistory] = usePersist("wh", [
    {d:"2025-06-01",w:58.0},{d:"2025-06-08",w:58.3},{d:"2025-06-15",w:58.5},
  ]);
  const [log, setLog] = usePersist("log_"+todayKey, { calories:0, protein:0, water:0, sleep:0, creatine:false, whey:0, mood:3, gym:false });
  const [lifts, setLifts] = usePersist("lifts", INITIAL_LIFTS);
  const [grocery, setGrocery] = usePersist("grocery", INIT_GROCERY);
  const [meas, setMeas] = usePersist("meas", { chest:82, waist:70, arms:28, shoulders:98, thigh:48 });
  const [streak, setStreak] = usePersist("streak", 12);
  const [gymSchedule, setGymSchedule] = usePersist("gymSchedule", WEEK_GYM);
  const [workoutPlans, setWorkoutPlans] = usePersist("workoutPlans", WORKOUT_PLANS);
  const [weekMeals, setWeekMeals] = usePersist("wm", () => Object.fromEntries(DAYS.map(d=>[d, Object.fromEntries(MEAL_SLOTS.map(s=>[s.key,""]))])));
  const [doneSets, setDoneSets] = usePersist("sets_"+todayKey, {});
  const [dailyNotes, setDailyNotes] = usePersist("notes_"+todayKey, "");

  const [recipeOpen, setRecipeOpen] = useState(null);
  const [tagFilter, setTagFilter] = useState("all");
  const [liftEdit, setLiftEdit] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(false);
  const [showWt, setShowWt] = useState(false);
  const [newWt, setNewWt] = useState(weight);

  const upd = (k,v) => setLog(l=>({...l,[k]:v}));
  const gymOptions = Object.keys(workoutPlans);
  const gymDay = gymSchedule[dayIdx] || WEEK_GYM[dayIdx];
  const gymColor = GYM_COLORS[gymDay]||"#5f7392";
  const calLeft = TARGETS.calories - log.calories;
  const allTags = [...new Set(RECIPES.flatMap(r=>r.tags))];
  const shownRecipes = tagFilter==="all" ? RECIPES : RECIPES.filter(r=>r.tags.includes(tagFilter));

  const smartTip = () => {
    if (calLeft > 800) return { msg:`${calLeft} kcal behind. Big push needed!`, meals:["Cheese Butter Pasta (+700 kcal)","Banana Mass Shake (+560 kcal)"], color:"#dc2626" };
    if (calLeft > 400) return { msg:`${calLeft} kcal to go. One solid meal left.`, meals:["Paneer Pasta (+680 kcal)","Soya Chunk Pasta (+640 kcal)"], color:"#f97316" };
    if (calLeft > 0)   return { msg:`Almost there! ${calLeft} kcal remaining.`, meals:["Bread Butter Cheese (+420 kcal)"], color:"#1d4ed8" };
    return { msg:`Target smashed! ${Math.abs(calLeft)} kcal surplus!`, meals:[], color:"#16a34a" };
  };
  const tip = smartTip();

  const logWeight = () => {
    setWeight(newWt);
    setWeightHistory(h=>[...h.filter(e=>e.d!==todayKey), {d:todayKey,w:newWt}].sort((a,b)=>a.d.localeCompare(b.d)).slice(-30));
    setShowWt(false);
  };

  const updateExercise = (plan, index, patch) => {
    setWorkoutPlans(plans => ({
      ...plans,
      [plan]: (plans[plan] || []).map((ex, i) => i === index ? { ...ex, ...patch } : ex)
    }));
  };

  const addExercise = (plan) => {
    setWorkoutPlans(plans => ({
      ...plans,
      [plan]: [...(plans[plan] || []), { name:"New Exercise", sets:3, reps:"10-12", rest:"60s", notes:"Add your form cue or target here" }]
    }));
  };

  const removeExercise = (plan, index, name) => {
    setWorkoutPlans(plans => ({
      ...plans,
      [plan]: (plans[plan] || []).filter((_, i) => i !== index)
    }));
    setDoneSets(ds => {
      const next = { ...ds };
      delete next[name];
      return next;
    });
  };

  // STYLES
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:
      radial-gradient(circle at 15% -10%, #fed7aa 0, transparent 28%),
      radial-gradient(circle at 90% 8%, #bfdbfe 0, transparent 30%),
      linear-gradient(180deg,#f8fbff 0%,#edf5ff 42%,#fff7ed 100%);
      color:#17233f;font-family:'Outfit',sans-serif;}
    ::-webkit-scrollbar{width:3px;height:3px;}
    ::-webkit-scrollbar-thumb{background:#b9cdf2;border-radius:4px;}
    input[type=range]{-webkit-appearance:none;width:100%;height:18px;background:transparent;cursor:pointer;}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:currentColor;cursor:pointer;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
    .fade{animation:fadeUp .3s ease both;}
    textarea{background:#eef5ff;border:1px solid #b9cdf2;color:#17233f;padding:10px 12px;border-radius:10px;resize:vertical;width:100%;font-size:13px;line-height:1.7;font-family:'Outfit',sans-serif;}
    textarea:focus{outline:none;border-color:#1d4ed8;}
    select{background:#eef5ff;border:1px solid #b9cdf2;color:#17233f;padding:5px 8px;border-radius:8px;font-size:12px;cursor:pointer;font-family:'Outfit',sans-serif;}
    select:focus{outline:none;border-color:#1d4ed8;}
    input[type=number]{background:#eef5ff;border:1px solid #b9cdf2;color:#17233f;padding:8px 10px;border-radius:8px;font-family:'Outfit',sans-serif;font-size:14px;}
    input[type=number]:focus{outline:none;border-color:#1d4ed8;}
    .app-shell{position:relative;isolation:isolate;overflow:hidden;}
    .app-shell:before,.app-shell:after{content:"";position:fixed;z-index:-1;pointer-events:none;opacity:.16;background-repeat:no-repeat;background-size:contain;}
    .app-shell:before{width:260px;height:260px;right:-55px;top:110px;background-image:url("data:image/svg+xml,%3Csvg width='260' height='260' viewBox='0 0 260 260' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231d4ed8' stroke-width='10' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M70 130h120'/%3E%3Cpath d='M42 95v70M62 82v96M198 82v96M218 95v70'/%3E%3Ccircle cx='130' cy='130' r='78' stroke-width='4' stroke-dasharray='12 18'/%3E%3C/g%3E%3C/svg%3E");}
    .app-shell:after{width:220px;height:220px;left:-70px;bottom:80px;background-image:url("data:image/svg+xml,%3Csvg width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23f97316' stroke-width='8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M62 150c20-24 35-58 43-98 5 35 22 68 54 99'/%3E%3Cpath d='M78 122h62M88 96h42'/%3E%3Cpath d='M47 162h126'/%3E%3C/g%3E%3C/svg%3E");}
  `;

  const card = (ch, xtra={}) => <div className="fade" style={{ background:"#ffffff", border:"1px solid #c7d8f6", borderRadius:18, padding:20, boxShadow:"0 18px 45px rgba(29,78,216,.08)", ...xtra }}>{ch}</div>;
  const sec = (t, s) => <div style={{ marginBottom:16 }}><div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:2.5, color:"#0f1f3d" }}>{t}</div>{s&&<div style={{ fontSize:12, color:"#5f7392", marginTop:1 }}>{s}</div>}</div>;

  const NAV = [{id:"dashboard",icon:"⚡",label:"Home"},{id:"meals",icon:"🍽",label:"Meals"},{id:"recipes",icon:"📖",label:"Recipes"},{id:"gym",icon:"🏋️",label:"Gym"},{id:"schedule",icon:"📅",label:"Week"},{id:"grocery",icon:"🛒",label:"Grocery"},{id:"progress",icon:"📈",label:"Progress"}];

  // ── DASHBOARD ─────────────────────────────────────────────────────
  const tabDashboard = () => (
    <div style={{ display:"grid", gap:14 }}>
      {/* Hero */}
      <div className="fade" style={{ background:"linear-gradient(135deg,#dbeafe,#ffffff 54%,#fff7ed)", border:"1px solid #8fb4f4", borderRadius:20, padding:"22px 20px", position:"relative", overflow:"hidden", boxShadow:"0 22px 60px rgba(29,78,216,.16)" }}>
        <div style={{ position:"absolute", right:-40, top:-40, width:180, height:180, borderRadius:"50%", border:"1px solid #1d4ed815", background:"radial-gradient(circle,#1d4ed808,transparent)" }}/>
        <svg viewBox="0 0 180 120" aria-hidden="true" style={{ position:"absolute", right:14, bottom:8, width:128, opacity:.18 }}>
          <g fill="none" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M38 60h104"/>
            <path d="M18 39v42M32 30v60M148 30v60M162 39v42"/>
          </g>
          <path d="M76 92c7-13 10-26 12-41 4 17 12 31 23 42" fill="none" stroke="#f97316" strokeWidth="7" strokeLinecap="round"/>
        </svg>
        <div style={{ fontSize:11, color:"#1d4ed8", letterSpacing:3, textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>{DAYS[dayIdx]} · {gymDay} Day · {today.toLocaleDateString("en-IN",{month:"short",day:"numeric"})}</div>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:40, letterSpacing:4, lineHeight:1 }}>GAIN<span style={{color:"#1d4ed8"}}>OS</span></div>
        <div style={{ fontSize:13, color:"#5f7392", marginTop:4 }}>Night Shift Fitness System · {weight} kg → 68 kg goal</div>
        <div style={{ display:"flex", gap:8, marginTop:14, flexWrap:"wrap" }}>
          {[{l:"Streak",v:`${streak}d 🔥`,c:"#f97316"},{l:"Gym",v:log.gym?`✅ ${gymDay}`:`${gymDay} Pending`,c:log.gym?"#16a34a":"#dc2626"},{l:"Creatine",v:log.creatine?"✅ Done":"❌ Missed",c:log.creatine?"#16a34a":"#dc2626"},{l:"Whey",v:`${log.whey} scoop${log.whey!==1?"s":""}`,c:"#4f46e5"}].map(b=>(
            <div key={b.l} style={{ background:"#eef5ff90", border:"1px solid #b9cdf2", borderRadius:10, padding:"7px 13px" }}>
              <div style={{ fontSize:10, color:"#5f7392", marginBottom:1 }}>{b.l}</div>
              <div style={{ fontSize:13, fontWeight:700, color:b.c }}>{b.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rings + Sliders */}
      {card(<div>
        {sec("TODAY'S TARGETS","Drag sliders to log")}
        <div style={{ display:"flex", justifyContent:"space-around", flexWrap:"wrap", gap:10, marginBottom:20 }}>
          <Ring value={log.calories} max={TARGETS.calories} color="#f97316" label="Calories" unit="kcal"/>
          <Ring value={log.protein} max={TARGETS.protein} color="#1d4ed8" label="Protein" unit="g"/>
          <Ring value={log.water} max={TARGETS.water} color="#0f9f7a" label="Water" unit="L"/>
          <Ring value={log.sleep} max={TARGETS.sleep} color="#4f46e5" label="Sleep" unit="h"/>
        </div>
        <Slider label="Calories Eaten" value={log.calories} max={3000} unit=" kcal" color="#f97316" step={50} onChange={v=>upd("calories",v)}/>
        <Slider label="Protein" value={log.protein} max={140} unit="g" color="#1d4ed8" onChange={v=>upd("protein",v)}/>
        <Slider label="Water" value={log.water} max={3.5} unit="L" color="#0f9f7a" step={0.25} onChange={v=>upd("water",v)}/>
        <Slider label="Sleep" value={log.sleep} max={10} unit="h" color="#4f46e5" step={0.5} onChange={v=>upd("sleep",v)}/>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
          <Toggle label="Gym Done" emoji="🏋️" on={log.gym} onToggle={()=>upd("gym",!log.gym)} color="#16a34a"/>
          <Toggle label="Creatine 5g" emoji="💊" on={log.creatine} onToggle={()=>upd("creatine",!log.creatine)} color="#16a34a"/>
        </div>
        <div>
          <div style={{ fontSize:12, color:"#4a6182", marginBottom:7 }}>Whey Scoops Today</div>
          <div style={{ display:"flex", gap:8 }}>
            {[0,1,2,3].map(n=>(
              <button key={n} onClick={()=>upd("whey",n)} style={{ width:44, height:44, borderRadius:10, border:`2px solid ${log.whey===n?"#4f46e560":"#b9cdf2"}`, background:log.whey===n?"#4f46e518":"#eef5ff", color:log.whey===n?"#4f46e5":"#5f7392", cursor:"pointer", fontWeight:700, fontFamily:"inherit", fontSize:15, transition:"all .2s" }}>{n}</button>
            ))}
          </div>
        </div>
      </div>)}

      {/* Mood + Tip */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {card(<div>
          {sec("ENERGY")}
          <div style={{ display:"flex", justifyContent:"space-around", marginTop:2 }}>
            {["😫","😔","😐","😊","🔥"].map((e,i)=>(
              <button key={i} onClick={()=>upd("mood",i+1)} style={{ fontSize:21, background:"none", border:`2px solid ${log.mood===i+1?"#f9731650":"transparent"}`, borderRadius:10, padding:"5px 6px", cursor:"pointer", transform:log.mood===i+1?"scale(1.25)":"scale(1)", transition:"all .2s" }}>{e}</button>
            ))}
          </div>
          <div style={{ marginTop:10, fontSize:12, color:"#4a6182", textAlign:"center" }}>
            {["Rest day — light meals","Low energy — easy meals","Moderate — stay consistent","Good energy — push it","BEAST MODE 🔥"][log.mood-1]}
          </div>
        </div>)}
        {card(<div>
          {sec("SMART TIP")}
          <div style={{ fontSize:12, color:tip.color, fontWeight:600, marginBottom:7 }}>{tip.msg}</div>
          {tip.meals.map(m=><div key={m} style={{ fontSize:12, color:"#4a6182", lineHeight:2 }}>→ {m}</div>)}
          {calLeft<=0 && <div style={{ fontSize:24, textAlign:"center", marginTop:8 }}>🏆</div>}
        </div>)}
      </div>

      {/* Weight */}
      {card(<div>
        {sec("BODYWEIGHT","Tap + to log today")}
        <div style={{ display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"#1d4ed8", letterSpacing:2, lineHeight:1 }}>{weight}<span style={{fontSize:18,color:"#5f7392"}}> kg</span></div>
            <div style={{ fontSize:12, color:"#5f7392", marginTop:4 }}>Target 68 kg · {(68-weight).toFixed(1)} kg to go</div>
          </div>
          <button onClick={()=>{setNewWt(weight);setShowWt(true);}} style={{ width:42, height:42, borderRadius:21, border:"1px solid #1d4ed850", background:"#1d4ed815", color:"#1d4ed8", fontSize:22, cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>+</button>
        </div>
        {showWt && <div style={{ marginTop:14, background:"#eef5ff", borderRadius:12, padding:14, border:"1px solid #b9cdf2" }}>
          <div style={{ fontSize:12, color:"#4a6182", marginBottom:8 }}>Today's weight (kg)</div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input type="number" step="0.1" value={newWt} onChange={e=>setNewWt(+e.target.value)} style={{ width:90 }}/>
            <button onClick={logWeight} style={{ padding:"7px 16px", borderRadius:8, border:"none", background:"#1d4ed8", color:"#f4f8ff", cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>Save</button>
            <button onClick={()=>setShowWt(false)} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #b9cdf2", background:"transparent", color:"#4a6182", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          </div>
        </div>}
        <div style={{ marginTop:14, height:6, background:"#dbe8ff", borderRadius:6 }}>
          <div style={{ height:"100%", width:`${Math.max(0,Math.min(((weight-58)/(68-58))*100,100))}%`, background:"linear-gradient(90deg,#1d4ed8,#4f46e5)", borderRadius:6, transition:"width .6s" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#5f7392", marginTop:3 }}><span>Start 58 kg</span><span>Goal 68 kg</span></div>
        <div style={{ marginTop:12 }}><WeightChart history={weightHistory}/></div>
      </div>)}

      {/* Daily Notes */}
      {card(<div>
        {sec("DAILY NOTES","Anything worth logging today")}
        <textarea rows={3} placeholder="e.g. felt strong, skipped dinner, slept well..." value={dailyNotes} onChange={e=>setDailyNotes(e.target.value)}/>
      </div>)}
    </div>
  );

  // ── MEALS ─────────────────────────────────────────────────────────
  const tabMeals = () => {
    const dm = weekMeals[DAYS[dayIdx]] || {};
    let tc=0, tp=0;
    Object.values(dm).forEach(n=>{ const r=RECIPES.find(x=>x.name===n); if(r){tc+=r.cal;tp+=r.protein;} });
    return (
      <div style={{ display:"grid", gap:14 }}>
        {card(<div>
          {sec("TODAY'S MEAL PLAN", `${DAYS[dayIdx]} · ${gymDay} Day`)}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            <StatBox label="Planned Cals" val={`${tc}`} color="#f97316" sub={tc<TARGETS.calories?`${TARGETS.calories-tc} short`:"✅ Hit"}/>
            <StatBox label="Protein" val={`${tp}g`} color="#1d4ed8" sub={tp<TARGETS.protein?`${TARGETS.protein-tp}g short`:"✅ Met"}/>
            <StatBox label="Meals Set" val={`${Object.values(dm).filter(Boolean).length}/7`} color="#16a34a"/>
          </div>
        </div>)}

        {MEAL_SLOTS.map(slot => {
          const chosen = dm[slot.key] || "";
          const recipe = RECIPES.find(r=>r.name===chosen);
          return (
            <div key={slot.key} className="fade" style={{ background:"#ffffff", border:`1px solid ${recipe?"#8fb4f4":"#c7d8f6"}`, borderRadius:16, padding:18 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:"#5f7392", letterSpacing:.8, textTransform:"uppercase", marginBottom:3 }}>{slot.time}</div>
                  <div style={{ fontSize:15, fontWeight:700 }}>{slot.emoji} {slot.label}</div>
                  {recipe && <div style={{ marginTop:5, display:"flex", gap:10 }}>
                    <span style={{ fontSize:13, color:"#f97316", fontWeight:600 }}>{recipe.cal} kcal</span>
                    <span style={{ fontSize:13, color:"#1d4ed8", fontWeight:600 }}>{recipe.protein}g protein</span>
                  </div>}
                </div>
                <select value={chosen} onChange={e=>{ const d=DAYS[dayIdx]; setWeekMeals(wm=>({...wm,[d]:{...wm[d],[slot.key]:e.target.value}})); }}>
                  <option value="">— Choose —</option>
                  <optgroup label="Suggestions">
                    {slot.suggestions.map(s=><option key={s} value={s}>{s}</option>)}
                  </optgroup>
                  <optgroup label="All Recipes">
                    {RECIPES.filter(r=>!slot.suggestions.includes(r.name)).map(r=><option key={r.id} value={r.name}>{r.name}</option>)}
                  </optgroup>
                </select>
              </div>
              {recipe && <div style={{ marginTop:10, display:"flex", gap:5, flexWrap:"wrap" }}>
                {recipe.tags.map(t=><GTag key={t} t={t}/>)}
              </div>}
            </div>
          );
        })}
      </div>
    );
  };

  // ── RECIPES ───────────────────────────────────────────────────────
  const tabRecipes = () => (
    <div style={{ display:"grid", gap:14 }}>
      {card(<div>
        {sec("RECIPE DATABASE",`${RECIPES.length} meals · tap to expand`)}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {["all",...allTags].map(t=>(
            <button key={t} onClick={()=>setTagFilter(t)} style={{ padding:"5px 12px", borderRadius:20, border:`1px solid ${tagFilter===t?"#1d4ed860":"#b9cdf2"}`, background:tagFilter===t?"#1d4ed818":"transparent", color:tagFilter===t?"#1d4ed8":"#4a6182", cursor:"pointer", fontSize:12, fontFamily:"inherit", fontWeight:600, transition:"all .2s" }}>
              {t==="all"?`All (${RECIPES.length})`:t}
            </button>
          ))}
        </div>
      </div>)}
      {shownRecipes.map(r=>(
        <div key={r.id} className="fade" style={{ background:"#ffffff", border:`1px solid ${recipeOpen===r.id?"#1d4ed850":"#c7d8f6"}`, borderRadius:16, overflow:"hidden", cursor:"pointer", transition:"border-color .2s" }} onClick={()=>setRecipeOpen(recipeOpen===r.id?null:r.id)}>
          <div style={{ padding:"16px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:6 }}>{r.name}</div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{r.tags.map(t=><GTag key={t} t={t}/>)}</div>
            </div>
            <div style={{ display:"flex", gap:14, alignItems:"center" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:"#f97316", lineHeight:1 }}>{r.cal}</div>
                <div style={{ fontSize:9, color:"#5f7392" }}>KCAL</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:"#1d4ed8", lineHeight:1 }}>{r.protein}g</div>
                <div style={{ fontSize:9, color:"#5f7392" }}>PROTEIN</div>
              </div>
              <span style={{ color:"#7a8aaa", fontSize:16 }}>{recipeOpen===r.id?"▲":"▼"}</span>
            </div>
          </div>
          {recipeOpen===r.id && (
            <div style={{ padding:"0 18px 18px", borderTop:"1px solid #c7d8f6" }}>
              <div style={{ display:"flex", gap:8, margin:"12px 0", flexWrap:"wrap" }}>
                {[{l:"Prep",v:`${r.prep} min`},{l:"Level",v:r.diff},{l:"Timing",v:r.timing}].map(i=>(
                  <div key={i.l} style={{ background:"#eef5ff", borderRadius:8, padding:"6px 12px" }}>
                    <div style={{ fontSize:9, color:"#5f7392", textTransform:"uppercase", letterSpacing:.8 }}>{i.l}</div>
                    <div style={{ fontSize:13, fontWeight:600, marginTop:2 }}>{i.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, color:"#5f7392", textTransform:"uppercase", letterSpacing:1, marginBottom:7 }}>Ingredients</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {r.ingredients.map(ing=><span key={ing} style={{ background:"#dbe8ff", borderRadius:6, padding:"4px 10px", fontSize:12, color:"#48617f" }}>{ing}</span>)}
                </div>
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, color:"#5f7392", textTransform:"uppercase", letterSpacing:1, marginBottom:7 }}>Method</div>
                <div style={{ fontSize:13, color:"#48617f", lineHeight:1.8 }}>{r.steps}</div>
              </div>
              {r.notes && <div style={{ background:"#f973160e", border:"1px solid #f9731630", borderRadius:10, padding:"10px 14px", fontSize:12, color:"#c2410c", lineHeight:1.6 }}>💡 {r.notes}</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ── GYM ───────────────────────────────────────────────────────────
  const tabGym = () => {
    const exercises = workoutPlans[gymDay] || [];
    const completed = exercises.filter(ex=>(doneSets[ex.name]||0)>=ex.sets).length;
    const completedPct = exercises.length ? Math.round((completed/exercises.length)*100) : 0;
    return (
      <div style={{ display:"grid", gap:14 }}>
        {card(<div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
          <div>
            {sec(`${gymDay} DAY`, gymDay==="Rest"?"Recovery day":"Track sets as you go")}
            <div style={{ fontSize:12, color:"#5f7392" }}>
              {gymDay==="Push"?"Chest · Shoulders · Triceps":gymDay==="Pull"?"Back · Biceps · Rear Delts":gymDay==="Legs"?"Quads · Hamstrings · Glutes · Core":"Rest · Stretch · Recover"}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", justifyContent:"flex-end" }}>
            {gymDay!=="Rest" && <button onClick={()=>setEditingWorkout(v=>!v)} style={{ padding:"8px 12px", borderRadius:9, border:`1px solid ${editingWorkout?"#f9731650":"#1d4ed830"}`, background:editingWorkout?"#fff7ed":"#1d4ed812", color:editingWorkout?"#f97316":"#1d4ed8", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:800 }}>{editingWorkout?"Done Editing":"Edit Exercises"}</button>}
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:gymColor, letterSpacing:2 }}>{gymDay}</div>
          </div>
        </div>)}

        {gymDay==="Rest" ? card(<div>
          {sec("REST DAY PROTOCOL")}
          {["🧘 10 min stretch or light yoga","🚶 20 min walk outside if possible","💧 Hit full water target (3.5L)","😴 Prioritise 7+ hours sleep","🍗 Still hit protein target on rest days","💊 Take creatine — timing irrelevant, consistency matters"].map((t,i)=>(
            <div key={i} style={{ padding:"10px 0", borderBottom:i<5?"1px solid #c7d8f6":"none", fontSize:13, color:"#48617f" }}>{t}</div>
          ))}
        </div>) : (
          <>
            {editingWorkout && card(<div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap", marginBottom:16 }}>
                {sec("EDIT EXERCISES",`Customize your ${gymDay} workout`)}
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <button onClick={()=>addExercise(gymDay)} style={{ padding:"8px 12px", borderRadius:8, border:"none", background:"#1d4ed8", color:"#ffffff", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:800 }}>+ Exercise</button>
                  <button onClick={()=>setWorkoutPlans(p=>({...p,[gymDay]:WORKOUT_PLANS[gymDay]||[]}))} style={{ padding:"8px 12px", borderRadius:8, border:"1px solid #f9731640", background:"#fff7ed", color:"#f97316", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:800 }}>Reset {gymDay}</button>
                </div>
              </div>
              <div style={{ display:"grid", gap:12 }}>
                {exercises.map((ex,i)=>(
                  <div key={`${ex.name}-${i}`} style={{ border:"1px solid #c7d8f6", borderRadius:14, padding:14, background:"#f8fbff" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:8, alignItems:"center" }}>
                      <input type="text" value={ex.name} onChange={e=>updateExercise(gymDay,i,{name:e.target.value})} style={{ gridColumn:"1 / -1", minWidth:0, background:"#ffffff", border:"1px solid #b9cdf2", color:"#17233f", padding:"8px 10px", borderRadius:8, fontFamily:"inherit", fontSize:13, fontWeight:700 }}/>
                      <input type="number" min="1" value={ex.sets} onChange={e=>updateExercise(gymDay,i,{sets:Math.max(1,+e.target.value||1)})} title="Sets"/>
                      <input type="text" value={ex.reps} onChange={e=>updateExercise(gymDay,i,{reps:e.target.value})} title="Reps" style={{ minWidth:0, background:"#ffffff", border:"1px solid #b9cdf2", color:"#17233f", padding:"8px 10px", borderRadius:8, fontFamily:"inherit", fontSize:13 }}/>
                      <input type="text" value={ex.rest} onChange={e=>updateExercise(gymDay,i,{rest:e.target.value})} title="Rest" style={{ minWidth:0, background:"#ffffff", border:"1px solid #b9cdf2", color:"#17233f", padding:"8px 10px", borderRadius:8, fontFamily:"inherit", fontSize:13 }}/>
                    </div>
                    <textarea rows={2} value={ex.notes} onChange={e=>updateExercise(gymDay,i,{notes:e.target.value})} style={{ marginTop:8, background:"#ffffff" }}/>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, marginTop:8 }}>
                      <div style={{ fontSize:10, color:"#5f7392", textTransform:"uppercase", letterSpacing:1 }}>Name · Sets · Reps · Rest · Notes</div>
                      <button onClick={()=>removeExercise(gymDay,i,ex.name)} style={{ padding:"6px 10px", borderRadius:8, border:"1px solid #dc262630", background:"#fff1f2", color:"#dc2626", cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:800 }}>Delete</button>
                    </div>
                  </div>
                ))}
                {exercises.length===0 && <div style={{ padding:"18px", textAlign:"center", color:"#5f7392", background:"#f8fbff", border:"1px dashed #b9cdf2", borderRadius:14 }}>No exercises yet. Add one to build this workout.</div>}
              </div>
            </div>)}
            {card(<div>
              {sec("SESSION STATS")}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                <StatBox label="Total Exercises" val={exercises.length} color="#1d4ed8"/>
                <StatBox label="Completed" val={completed} color="#16a34a" sub={`${completedPct}%`}/>
                <StatBox label="Total Sets" val={exercises.reduce((a,e)=>a+e.sets,0)} color="#f97316"/>
              </div>
            </div>)}
            {exercises.map((ex,i)=>{
              const done = doneSets[ex.name]||0;
              const allDone = done>=ex.sets;
              return (
                <div key={i} className="fade" style={{ background:"#ffffff", border:`1px solid ${allDone?"#16a34a30":"#c7d8f6"}`, borderRadius:16, padding:18 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:15, color:allDone?"#16a34a":"#0f1f3d" }}>{allDone?"✅ ":""}{ex.name}</div>
                      <div style={{ fontSize:12, color:"#5f7392", marginTop:3 }}>{ex.sets} sets × {ex.reps} · Rest {ex.rest}</div>
                      <div style={{ fontSize:11, color:"#7a8aaa", marginTop:2 }}>{ex.notes}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                      <span style={{ fontSize:11, color:"#4a6182" }}>{done}/{ex.sets} sets</span>
                      <div style={{ display:"flex", gap:5 }}>
                        {Array.from({length:ex.sets}).map((_,s)=>(
                          <button key={s} onClick={e=>{ e.stopPropagation(); setDoneSets(ds=>({...ds,[ex.name]:s<done?s:s+1})); }}
                            style={{ width:28, height:28, borderRadius:7, border:"none", background:s<done?"#16a34a":"#dbe8ff", color:s<done?"#f4f8ff":"#7a8aaa", cursor:"pointer", fontSize:13, fontWeight:700, transition:"all .2s" }}>{s<done?"✓":"·"}</button>
                        ))}
                        {done>0 && <button onClick={()=>setDoneSets(ds=>({...ds,[ex.name]:0}))} style={{ width:28, height:28, borderRadius:7, border:"1px solid #dc262630", background:"transparent", color:"#dc2626", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>↺</button>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Strength Tracker */}
        {card(<div>
          {sec("STRENGTH PROGRESSION","Tap current weight to edit")}
          {lifts.map((lift,i)=>(
            <div key={lift.name} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                <span style={{ fontSize:13, fontWeight:500 }}>{lift.name}</span>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  {liftEdit===i ? (
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      <input type="number" value={lift.current} style={{ width:70 }}
                        onChange={e=>setLifts(ls=>{ const n=[...ls]; n[i]={...n[i],current:+e.target.value}; return n; })}/>
                      <button onClick={()=>setLiftEdit(null)} style={{ padding:"4px 10px", borderRadius:6, border:"none", background:"#16a34a", color:"#f4f8ff", cursor:"pointer", fontWeight:700, fontSize:12, fontFamily:"inherit" }}>✓</button>
                    </div>
                  ) : (
                    <button onClick={()=>setLiftEdit(i)} style={{ fontSize:12, color:"#1d4ed8", background:"#1d4ed815", border:"1px solid #1d4ed830", borderRadius:6, padding:"3px 10px", cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>{lift.current} {lift.unit}</button>
                  )}
                  <span style={{ fontSize:11, color:"#5f7392" }}>/ {lift.target} {lift.unit}</span>
                </div>
              </div>
              <div style={{ height:5, background:"#dbe8ff", borderRadius:5 }}>
                <div style={{ height:"100%", width:`${Math.min((lift.current/lift.target)*100,100)}%`, background:"linear-gradient(90deg,#16a34a,#1d4ed8)", borderRadius:5, transition:"width .5s" }}/>
              </div>
              <div style={{ fontSize:10, color:"#7a8aaa", marginTop:2 }}>{Math.round((lift.current/lift.target)*100)}% to goal</div>
            </div>
          ))}
        </div>)}
      </div>
    );
  };

  // ── SCHEDULE ──────────────────────────────────────────────────────
  const tabSchedule = () => (
    <div style={{ display:"grid", gap:14 }}>
      {card(<div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap", marginBottom:16 }}>
          {sec("WEEKLY GYM PLAN","Change any day here. Saved automatically.")}
          <button onClick={()=>setGymSchedule(WEEK_GYM)} style={{ padding:"7px 12px", borderRadius:8, border:"1px solid #b9cdf2", background:"#eef5ff", color:"#4a6182", cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:700 }}>Reset Split</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:5 }}>
          {DAYS.map((d,i)=>{
            const isToday = i===dayIdx;
            const gd = gymSchedule[i] || WEEK_GYM[i];
            const gc = GYM_COLORS[gd] || "#7a8aaa";
            return (
              <div key={d} style={{ background:isToday?"#1a3050":"#eef5ff", border:`1px solid ${isToday?"#1d4ed860":gc+"40"}`, borderRadius:10, padding:"8px 4px", textAlign:"center" }}>
                <div style={{ fontSize:10, color:isToday?"#1d4ed8":"#5f7392", fontWeight:isToday?700:400 }}>{d}</div>
                <select value={gd} onChange={e=>setGymSchedule(s=>{ const next=[...(Array.isArray(s)?s:WEEK_GYM)]; next[i]=e.target.value; return next; })} style={{ width:"100%", marginTop:5, padding:"4px 3px", fontSize:10, color:gc, fontWeight:700, textAlign:"center" }}>
                  {gymOptions.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                </select>
                {isToday && <div style={{ fontSize:9, color:"#1d4ed8", marginTop:2 }}>●</div>}
              </div>
            );
          })}
        </div>
      </div>)}

      {/* Weekly meal grid */}
      {card(<div>
        {sec("WEEKLY MEAL SCHEDULE","Set meals for each day")}
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
            <thead>
              <tr>
                <td style={{ padding:"5px 6px", color:"#5f7392", fontSize:10, fontWeight:700 }}>SLOT</td>
                {DAYS.map(d=><td key={d} style={{ padding:"5px 6px", textAlign:"center", color:DAYS[dayIdx]===d?"#1d4ed8":"#5f7392", fontWeight:DAYS[dayIdx]===d?700:400, fontSize:10 }}>{d}</td>)}
              </tr>
            </thead>
            <tbody>
              {MEAL_SLOTS.map(slot=>(
                <tr key={slot.key}>
                  <td style={{ padding:"4px 6px", color:"#4a6182", whiteSpace:"nowrap", fontSize:10 }}>{slot.emoji} {slot.label.split(" ")[0]}</td>
                  {DAYS.map(d=>(
                    <td key={d} style={{ padding:"3px 3px" }}>
                      <select value={weekMeals[d]?.[slot.key]||""} onChange={e=>setWeekMeals(wm=>({...wm,[d]:{...wm[d],[slot.key]:e.target.value}}))} style={{ fontSize:10, padding:"2px 4px", maxWidth:88, width:"100%" }}>
                        <option value="">—</option>
                        {RECIPES.map(r=><option key={r.id} value={r.name}>{r.name.split(" ").slice(0,3).join(" ")}</option>)}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>)}

      {card(<div>
        {sec("ROTATION + TIPS","Pasta every other day strategy")}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
          {[["🍝 Pasta Day","NS Pasta / Paneer Pasta / Soya Pasta"],["🥣 Non-Pasta","Oats Bowl + Rice + Sandwich"],["💰 High Cal","Cheese Butter Pasta + Mass Shake"],["😴 Rest Day","Light meals, focus on protein"],["⚡ Pre-Gym","PB Banana Sandwich 60 min before"],["🥤 Post-Gym","Mass Shake within 30 min"]].map(([t,d])=>(
            <div key={t} style={{ background:"#eef5ff", borderRadius:10, padding:"10px 12px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#1d4ed8", marginBottom:3 }}>{t}</div>
              <div style={{ fontSize:11, color:"#4a6182", lineHeight:1.6 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"#4f46e510", border:"1px solid #4f46e530", borderRadius:12, padding:"12px 14px" }}>
          <div style={{ fontSize:12, color:"#4f46e5", fontWeight:700, marginBottom:5 }}>💊 Daily Supplement Reminders</div>
          <div style={{ fontSize:12, color:"#4a6182", lineHeight:1.9 }}>
            <div>→ Creatine 5g: any time — same time daily (consistency beats timing)</div>
            <div>→ Whey: post-workout within 30 min, or pre-sleep if missed</div>
            <div>→ Both work on rest days too</div>
          </div>
        </div>
      </div>)}
    </div>
  );

  // ── GROCERY ───────────────────────────────────────────────────────
  const tabGrocery = () => {
    const refill = grocery.filter(g=>g.qty<=30);
    return (
      <div style={{ display:"grid", gap:14 }}>
        {card(<div>
          {sec("GROCERY TRACKER","Stock levels + refill alerts")}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <StatBox label="Monthly Est." val={`₹${grocery.reduce((a,g)=>a+g.cost,0).toLocaleString()}`} color="#16a34a"/>
            <StatBox label="Needs Refill" val={refill.length} color={refill.length?"#dc2626":"#16a34a"} sub={refill.length?refill.slice(0,2).map(g=>g.item.split("(")[0].trim()).join(", "):"All stocked!"}/>
          </div>
        </div>)}

        {grocery.map((g,i)=>{
          const low=g.qty<=30, mid=g.qty<=60&&g.qty>30;
          const bc = low?"#dc2626":mid?"#f97316":"#16a34a";
          return (
            <div key={g.item} className="fade" style={{ background:"#ffffff", border:`1px solid ${low?"#dc262628":"#c7d8f6"}`, borderRadius:14, padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:low?"#dc2626":"#17233f" }}>{low?"🔴 ":""}{g.item}</div>
                  <div style={{ fontSize:11, color:"#5f7392", marginTop:1 }}>~₹{g.cost} per unit</div>
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <button onClick={()=>setGrocery(d=>{const n=[...d];n[i]={...n[i],qty:Math.max(0,n[i].qty-10)};return n;})} style={{ width:30,height:30,borderRadius:8,border:"1px solid #b9cdf2",background:"#eef5ff",color:"#4a6182",cursor:"pointer",fontSize:18,fontFamily:"inherit" }}>−</button>
                  <span style={{ fontSize:14, fontWeight:700, color:bc, minWidth:34, textAlign:"center" }}>{g.qty}%</span>
                  <button onClick={()=>setGrocery(d=>{const n=[...d];n[i]={...n[i],qty:Math.min(100,n[i].qty+10)};return n;})} style={{ width:30,height:30,borderRadius:8,border:"1px solid #b9cdf2",background:"#eef5ff",color:"#4a6182",cursor:"pointer",fontSize:18,fontFamily:"inherit" }}>+</button>
                  <button onClick={()=>setGrocery(d=>{const n=[...d];n[i]={...n[i],qty:100};return n;})} style={{ padding:"5px 11px",borderRadius:8,border:"1px solid #16a34a30",background:"#16a34a10",color:"#16a34a",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700 }}>Restocked</button>
                </div>
              </div>
              <div style={{ height:5, background:"#dbe8ff", borderRadius:5 }}>
                <div style={{ height:"100%", width:`${g.qty}%`, background:bc, borderRadius:5, transition:"width .4s" }}/>
              </div>
            </div>
          );
        })}

        {refill.length>0 && card(<div>
          {sec("SHOPPING LIST",`${refill.length} items below 30%`)}
          {refill.map(g=>(
            <div key={g.item} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #c7d8f6" }}>
              <span style={{ fontSize:13 }}>☐ {g.item}</span>
              <span style={{ fontSize:12, color:"#f97316" }}>~₹{g.cost}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", fontWeight:700 }}>
            <span style={{ fontSize:13, color:"#16a34a" }}>Total Estimate</span>
            <span style={{ color:"#16a34a" }}>₹{refill.reduce((a,g)=>a+g.cost,0).toLocaleString()}</span>
          </div>
        </div>)}
      </div>
    );
  };

  // ── PROGRESS ──────────────────────────────────────────────────────
  const tabProgress = () => (
    <div style={{ display:"grid", gap:14 }}>
      {card(<div>
        {sec("TRANSFORMATION","Journey to 68 kg")}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          <StatBox label="Current" val={`${weight} kg`} color="#1d4ed8"/>
          <StatBox label="Target" val="68 kg" color="#16a34a"/>
          <StatBox label="To Gain" val={`${(68-weight).toFixed(1)} kg`} color="#f97316"/>
          <StatBox label="Streak" val={`${streak}d`} color="#4f46e5" sub="consecutive days"/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ fontSize:12, color:"#5f7392" }}>Journey Progress</span>
          <span style={{ fontSize:12, color:"#1d4ed8", fontWeight:700 }}>{Math.max(0,Math.round(((weight-58)/(68-58))*100))}%</span>
        </div>
        <div style={{ height:10, background:"#dbe8ff", borderRadius:10 }}>
          <div style={{ height:"100%", width:`${Math.max(0,Math.min(((weight-58)/(68-58))*100,100))}%`, background:"linear-gradient(90deg,#1d4ed8,#4f46e5,#f97316)", borderRadius:10, transition:"width .7s" }}/>
        </div>
        <div style={{ marginTop:12 }}>
          <div style={{ fontSize:10, color:"#5f7392", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Weight History (last 30 days)</div>
          <WeightChart history={weightHistory}/>
        </div>
      </div>)}

      {card(<div>
        {sec("BODY MEASUREMENTS","Update monthly")}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[["Chest","chest"],["Waist","waist"],["Arms","arms"],["Shoulders","shoulders"],["Thigh","thigh"]].map(([l,k])=>(
            <div key={k} style={{ background:"#eef5ff", borderRadius:12, padding:14 }}>
              <div style={{ fontSize:10, color:"#5f7392", textTransform:"uppercase", letterSpacing:.8, marginBottom:5 }}>{l} (cm)</div>
              <input type="number" value={meas[k]} onChange={e=>setMeas(m=>({...m,[k]:+e.target.value}))}
                style={{ width:"100%", background:"transparent", border:"none", color:"#1d4ed8", fontFamily:"'Bebas Neue',sans-serif", fontSize:28, letterSpacing:1, outline:"none" }}/>
            </div>
          ))}
        </div>
      </div>)}

      {card(<div>
        {sec("MILESTONE ROADMAP","4-month plan")}
        {[["M1","59–60 kg","Gym 3x/week, learn form, build habit","✅","#16a34a"],["M2","61–62 kg","Add compound lifts, increase calories","🔄","#1d4ed8"],["M3","63–65 kg","Visible size change, fuller face","⏳","#4f46e5"],["M4","66–68 kg","Real muscle mass, transformed physique","⏳","#f97316"]].map(([m,wt,d,icon,c])=>(
          <div key={m} style={{ display:"flex", gap:14, padding:"12px 0", borderBottom:"1px solid #c7d8f6", alignItems:"flex-start" }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:c, minWidth:36, lineHeight:1 }}>{m}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontWeight:600, fontSize:14 }}>{wt}</span>
                <span style={{ fontSize:18 }}>{icon}</span>
              </div>
              <div style={{ fontSize:12, color:"#5f7392", marginTop:2, lineHeight:1.6 }}>{d}</div>
            </div>
          </div>
        ))}
      </div>)}

      {card(<div>
        {sec("CONSISTENCY STREAK")}
        <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap", marginBottom:14 }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:64, color:"#f97316", lineHeight:1 }}>{streak}</div>
          <div>
            <div style={{ fontSize:14, fontWeight:600 }}>days in a row 🔥</div>
            <div style={{ fontSize:12, color:"#5f7392", marginTop:3 }}>Don't break the chain.</div>
          </div>
          <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
            <button onClick={()=>setStreak(s=>Math.max(0,s-1))} style={{ padding:"8px 14px", borderRadius:8, border:"1px solid #b9cdf2", background:"transparent", color:"#4a6182", cursor:"pointer", fontFamily:"inherit" }}>−</button>
            <button onClick={()=>setStreak(s=>s+1)} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid #16a34a40", background:"#16a34a15", color:"#16a34a", cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>+ Day</button>
          </div>
        </div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {Array.from({length:Math.min(streak,35)}).map((_,i)=>(
            <div key={i} style={{ width:18, height:18, borderRadius:4, background:`hsl(${130+i*3},55%,${32+i*0.5}%)` }} title={`Day ${i+1}`}/>
          ))}
        </div>
      </div>)}
    </div>
  );

  // ── RENDER ────────────────────────────────────────────────────────
  const TABS = { dashboard:tabDashboard, meals:tabMeals, recipes:tabRecipes, gym:tabGym, schedule:tabSchedule, grocery:tabGrocery, progress:tabProgress };

  return (
    <div className="app-shell" style={{ minHeight:"100vh", background:"transparent" }}>
      <style>{css}</style>
      <div style={{ position:"sticky", top:0, zIndex:100, background:"#f8fbffee", backdropFilter:"blur(16px)", borderBottom:"1px solid #c7d8f6", boxShadow:"0 10px 30px rgba(29,78,216,.06)" }}>
        <div style={{ maxWidth:720, margin:"0 auto", padding:"0 10px", display:"flex", overflowX:"auto" }}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ flex:"0 0 auto", padding:"12px 8px", background:"none", border:"none", cursor:"pointer", color:tab===n.id?"#1d4ed8":"#5f7392", fontFamily:"inherit", fontSize:10, fontWeight:700, letterSpacing:.3, borderBottom:`2px solid ${tab===n.id?"#1d4ed8":"transparent"}`, transition:"all .2s", display:"flex", flexDirection:"column", alignItems:"center", gap:3, minWidth:56 }}>
              <span style={{ fontSize:18 }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth:720, margin:"0 auto", padding:"18px 14px 80px" }}>
        {TABS[tab]?.()}
      </div>
    </div>
  );
}
