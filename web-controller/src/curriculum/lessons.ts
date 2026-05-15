export type LessonPhase = {
  label: "Spark" | "Explore" | "Build" | "Reflect";
  minutes: number;
  title: string;
  body: string;
};

export type Lesson = {
  slug: string;
  number: number;
  title: string;
  tagline: string;
  grades: string;
  duration: string;
  concepts: string[];
  overview: string;
  objectives: string[];
  vocabulary: { term: string; def: string }[];
  materials: string[];
  flow: LessonPhase[];
  teacherTips: string[];
  extensions: string[];
};

export const LESSONS: Lesson[] = [
  {
    slug: "meet-the-robot",
    number: 1,
    title: "Meet the robot",
    tagline: "First connection. First moves. First safety check.",
    grades: "Grades 3–6",
    duration: "30–40 min",
    concepts: ["Commands", "Safe mode", "Simulator"],
    overview:
      "Students get their first look at the robot — what it is, what its parts do, and how a few drag-and-drop blocks can make it move. The lesson stays in **Simulator** mode so every student can practice without needing a robot in front of them. Real hardware can come in next time.",
    objectives: [
      "Identify the main parts of the robot (microcontroller, motors, battery).",
      "Send a first command using the Blockly studio.",
      "Explain what 'safe mode' means and why robots boot disarmed.",
    ],
    vocabulary: [
      {
        term: "command",
        def: "An instruction sent to the robot, like 'move forward' or 'stop'.",
      },
      {
        term: "safe mode",
        def: "The robot's protected starting state. Motors are off and won't move until a student turns driving on.",
      },
      {
        term: "simulator",
        def: "An on-screen robot students can program when there isn't real hardware available.",
      },
      {
        term: "speed",
        def: "A number from 0 to 255 that controls how fast the robot moves. 80 is a comfortable starting value.",
      },
    ],
    materials: [
      "Computer with Chrome or Edge for each student or pair",
      "Internet connection to load the studio",
      "Optional: one real robot for the teacher to demo",
    ],
    flow: [
      {
        label: "Spark",
        minutes: 5,
        title: "What can a robot do?",
        body: "Show the class a picture or short video of the kit's robot. Ask: *What parts can you see? What do you think each part does?* Don't correct answers yet — collect them on the board.\n\nThen introduce the three parts students will care about today: the **microcontroller** (the brain), the **motors** (how it moves), and the **battery** (where the energy comes from).",
      },
      {
        label: "Explore",
        minutes: 15,
        title: "Open the studio, meet the simulator",
        body: "Have students open the Blockly Studio. No robot needed.\n\n1. Make sure **Simulator** mode is selected at the top.\n2. Click **Connect**. The status should say *Connected (simulator)*.\n3. Look at the grid on the right — that's the on-screen robot.\n\nGive students 5 minutes to drag blocks around and just see what happens. They won't break anything.",
      },
      {
        label: "Build",
        minutes: 15,
        title: "First program: move and stop",
        body: "Now build a real program together:\n\n1. Drag a **robot action** block, set it to *enable driving*. This tells the robot it's safe to move.\n2. Drag a **move forward** block, set speed to **80**.\n3. Drag a **wait 800 ms** block.\n4. Drag another **robot action**, set it to *stop*.\n\nClick **Run Blocks**. Watch the simulator robot move forward, pause, and stop.\n\nAsk: *What happened on the grid? What would happen if we removed the* enable driving *block?*",
      },
      {
        label: "Reflect",
        minutes: 5,
        title: "Why does it boot in safe mode?",
        body: "Discuss as a class: *Why do you think the robot starts with driving turned off?*\n\nHelp students arrive at the safety reason: a robot that moves the moment you turn it on could surprise people or roll off a table. **Safe mode** keeps everyone in control.\n\nAdd one more idea: there's also a **watchdog** in the robot's brain that automatically stops the motors if the connection drops.",
      },
    ],
    teacherTips: [
      "Stay in simulator mode the entire first lesson. Real hardware can wait.",
      "If a student's program 'doesn't work', check that the *enable driving* block comes first.",
      "Younger students will want to stack lots of blocks at once. Encourage them to run their program after every change so they see what each block does.",
    ],
    extensions: [
      "Have students predict where the robot will end up before they hit Run.",
      "Try changing the speed from 80 to 40. Does the simulator move differently?",
      "Add a second move-forward block. Where does the robot stop now?",
    ],
  },
  {
    slug: "draw-a-square",
    number: 2,
    title: "Draw a square",
    tagline: "Sequencing motion: forward, turn, forward, turn.",
    grades: "Grades 3–6",
    duration: "35–45 min",
    concepts: ["Sequences", "Turning in place", "Wait blocks"],
    overview:
      "Students plan and program a square path using only basic blocks — no repeat block yet. They'll discover the value of repeated patterns, which sets up the next lesson on loops.",
    objectives: [
      "Plan a path on paper before programming it.",
      "Build a multi-step program using move, turn, and wait blocks.",
      "Predict how changing one block changes the whole path.",
    ],
    vocabulary: [
      {
        term: "sequence",
        def: "A list of steps that run one after another, in order.",
      },
      {
        term: "turn in place",
        def: "Spinning without moving forward or backward. The robot does this by running one motor forward and one backward.",
      },
    ],
    materials: [
      "Computer per student or pair, in Studio (Simulator mode is fine)",
      "Paper and pencil for planning the path",
    ],
    flow: [
      {
        label: "Spark",
        minutes: 5,
        title: "Draw a square in the air",
        body: "Ask students to trace a square in the air with one finger. Notice that drawing a square is really just four actions repeated: *go straight, turn, go straight, turn, go straight, turn, go straight, turn.*\n\nToday the class will program the robot to do exactly that — in the simulator.",
      },
      {
        label: "Explore",
        minutes: 10,
        title: "Plan it on paper first",
        body: "Before opening Blockly, sketch the path on paper. Number the steps:\n\n1. Move forward\n2. Turn (left or right — pick one and stick with it)\n3. Move forward\n4. Turn\n\n…and so on, four sides total. Ask: *How long should the robot move forward each time? How long should it turn?* There's no perfect answer yet — students will tune the numbers in the next phase.",
      },
      {
        label: "Build",
        minutes: 20,
        title: "Program the square",
        body: "Open Blockly. Start with **enable driving**, then stack the pattern four times:\n\n- move forward, speed 80\n- wait 800 ms\n- turn left, speed 80\n- wait 500 ms\n\nYes — that's a lot of blocks. That's the point. Finish with a **stop** action.\n\nRun it and watch the path trace on the simulator grid. If the square doesn't close, adjust the wait times. Most groups will need a few tries.",
      },
      {
        label: "Reflect",
        minutes: 5,
        title: "What if we wanted a triangle?",
        body: "Look at how long the program got. Ask: *What did we keep doing over and over? What if we wanted a triangle next, or a hexagon? Would the program get even longer?*\n\nPlant the idea that there has to be a better way. That's the next lesson.",
      },
    ],
    teacherTips: [
      "If the path drifts off the grid, the turn wait is probably wrong. Have students tune the wait after the turn first.",
      "Encourage groups to compare squares with their neighbors. Whose closed cleanest? Why?",
      "Stress that the *plan on paper* step matters — programming is easier when you know what you want first.",
    ],
    extensions: [
      "Program a triangle. (Hint: three sides, but each turn needs to be bigger than the square's.)",
      "Make the square bigger by changing only the move-forward wait.",
      "Make the square go backward.",
    ],
  },
  {
    slug: "make-it-repeat",
    number: 3,
    title: "Make it repeat",
    tagline: "Loops, patterns, and much shorter programs.",
    grades: "Grades 4–7",
    duration: "40–50 min",
    concepts: ["Loops", "Patterns", "Predicting paths"],
    overview:
      "Students replace the long square program from last lesson with a four-block loop. Once they see how powerful repeat is, they design new shapes — triangles, hexagons, even flower patterns — by changing one number.",
    objectives: [
      "Use the repeat block to shorten a program without changing what it does.",
      "Identify the repeating pattern in a motion sequence.",
      "Design and test a new shape by adjusting a single number in a loop.",
    ],
    vocabulary: [
      {
        term: "repeat (loop)",
        def: "A block that runs the same actions over and over a chosen number of times.",
      },
      {
        term: "pattern",
        def: "The repeating part of a sequence. In a square path, the pattern is *forward, turn*.",
      },
    ],
    materials: [
      "Computer per student or pair, in Studio",
      "Optional: a real robot once the squares are working in the simulator",
    ],
    flow: [
      {
        label: "Spark",
        minutes: 5,
        title: "Find the pattern",
        body: "Pull up last lesson's square program — the long one. Ask: *Which blocks do we use over and over? Circle the pattern.*\n\nThe answer: **move forward → wait → turn → wait**. Four blocks, repeated four times. Today's goal: replace sixteen blocks with five.",
      },
      {
        label: "Explore",
        minutes: 10,
        title: "Meet the repeat block",
        body: "Introduce the **repeat N times** block. Show how other blocks nest *inside* it. Build:\n\n- enable driving\n- **repeat 4 times**:\n  - move forward, speed 80\n  - wait 800 ms\n  - turn left, speed 80\n  - wait 500 ms\n- stop\n\nRun it. The square should draw exactly like before. If a student says *that's the same program but shorter*, they've got the idea.",
      },
      {
        label: "Build",
        minutes: 20,
        title: "Design a new shape",
        body: "Now change the **number of times** to draw different shapes:\n\n- 3 → triangle (you'll need a longer turn)\n- 6 → hexagon (shorter turn)\n- 8 → octagon\n\nStudents try at least two new shapes. Encourage tuning the turn time until the shape closes cleanly. Compare results across groups.",
      },
      {
        label: "Reflect",
        minutes: 10,
        title: "When does repeat help?",
        body: "Lead a class discussion:\n\n- *When is repeat helpful?* When the same pattern shows up over and over.\n- *When does it not help?* When every step is different.\n- *Could we put a repeat **inside** another repeat?* Yes — that's a nested loop. It lets us draw flower patterns or grids. Save that for next time.",
      },
    ],
    teacherTips: [
      "Some students will want to change every number at once. Encourage *change one thing, run, watch* — that's how real debugging works.",
      "If a shape doesn't close, that's a discovery moment. Ask: *Did the turn happen for too long, or not long enough?*",
      "Pairs work well: one student drags blocks, the other watches the simulator and calls out adjustments. Swap roles halfway.",
    ],
    extensions: [
      "Nest a repeat inside another repeat. Try repeat 6 times → triangle (repeat 3 times). What pattern shows up?",
      "Move the program onto a real robot. Does it draw the same square on the floor that it drew on screen? Why or why not?",
      "Ask: *What's the smallest number of blocks needed to draw a circle?* (Trick question — but it leads to good discussion about polygons.)",
    ],
  },
];

export const LESSONS_BY_SLUG: Record<string, Lesson> = Object.fromEntries(
  LESSONS.map((l) => [l.slug, l])
);

export function isLessonSlug(s: string | undefined): s is string {
  return s !== undefined && s in LESSONS_BY_SLUG;
}
