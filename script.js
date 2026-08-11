/* ==========================================================================
   CampusBot — script.js
   A rule-based FAQ chatbot. No external AI API is used: all answers come
   from the local knowledge base below, matched using keyword scoring.
   ========================================================================== */

// -----------------------------------------------------------------------
// 1. FAQ KNOWLEDGE BASE
//    Each entry has: id, category, question, answer, and keywords used
//    for matching the user's free-text input to the closest FAQ.
// -----------------------------------------------------------------------
const FAQ_DATABASE = [
  // ---------------- College / University ----------------
  {
    id: "col1",
    category: "college",
    question: "What is the college name and location?",
    answer: "We are Greenfield Institute of Technology, located in the city campus at MG Road. You can find directions on our official website's 'Contact Us' page.",
    keywords: ["college name", "university name", "where is college", "college location", "address", "campus location", "institute name"]
  },
  {
    id: "col2",
    category: "college",
    question: "Is the college affiliated or accredited?",
    answer: "Yes, our college is affiliated with the State University and holds NAAC 'A' accreditation along with NBA-accredited engineering programs.",
    keywords: ["accredited", "accreditation", "affiliated", "affiliation", "naac", "nba", "recognized", "approved"]
  },
  {
    id: "col3",
    category: "college",
    question: "Does the college have hostel facilities?",
    answer: "Yes, separate hostel facilities are available for boys and girls with mess, Wi-Fi, and 24/7 security. You can apply for hostel allotment through the student portal after admission.",
    keywords: ["hostel", "accommodation", "residence", "boys hostel", "girls hostel", "stay", "dormitory"]
  },
  {
    id: "col4",
    category: "college",
    question: "What facilities does the campus offer?",
    answer: "Our campus offers a central library, computer labs, sports complex, cafeteria, Wi-Fi campus-wide, an auditorium, and dedicated placement cell.",
    keywords: ["facilities", "campus facilities", "library", "sports", "infrastructure", "amenities", "cafeteria", "wifi"]
  },

  // ---------------- Courses ----------------
  {
    id: "cr1",
    category: "courses",
    question: "What courses/programs are offered?",
    answer: "We offer undergraduate programs (B.Tech in CSE, ECE, Mechanical, Civil), postgraduate programs (M.Tech, MBA, MCA), and diploma courses. Check the 'Academics' page for the full list.",
    keywords: ["courses offered", "programs", "branches", "streams", "degree", "b.tech", "btech", "mba", "mca", "what courses"]
  },
  {
    id: "cr2",
    category: "courses",
    question: "What is the duration of the B.Tech course?",
    answer: "The B.Tech program is a 4-year full-time course divided into 8 semesters. Lateral entry students join directly in the 2nd year.",
    keywords: ["duration", "how long", "years", "semesters", "b.tech duration", "course length"]
  },
  {
    id: "cr3",
    category: "courses",
    question: "Are there any online or distance learning courses?",
    answer: "Currently we offer select certificate and postgraduate diploma courses in online mode. Regular UG/PG degree programs are offered only in on-campus mode.",
    keywords: ["online course", "distance learning", "remote course", "online degree", "e-learning"]
  },
  {
    id: "cr4",
    category: "courses",
    question: "Can I switch my branch after 1st year?",
    answer: "Branch change requests are considered after the 1st year based on your CGPA and seat availability in the desired branch, subject to department approval.",
    keywords: ["switch branch", "change branch", "branch change", "transfer branch"]
  },

  // ---------------- Admission ----------------
  {
    id: "ad1",
    category: "admission",
    question: "What is the admission process?",
    answer: "Admissions are based on entrance exam rank (or qualifying exam marks for lateral entry), followed by online counseling, document verification, and fee payment. Apply via the 'Admissions' portal on our website.",
    keywords: ["admission process", "how to apply", "apply admission", "admission procedure", "how to get admission"]
  },
  {
    id: "ad2",
    category: "admission",
    question: "What are the eligibility criteria for admission?",
    answer: "For B.Tech, candidates must have passed 10+2 with Physics, Chemistry, and Mathematics, scoring at least 50% aggregate (45% for reserved categories), along with a valid entrance exam score.",
    keywords: ["eligibility", "eligibility criteria", "minimum marks", "qualification required", "who can apply"]
  },
  {
    id: "ad3",
    category: "admission",
    question: "What documents are required for admission?",
    answer: "You'll need your 10th & 12th mark sheets, entrance exam scorecard, transfer certificate, migration certificate, category certificate (if applicable), passport photos, and Aadhaar card.",
    keywords: ["documents required", "documents needed", "what documents", "papers required for admission"]
  },
  {
    id: "ad4",
    category: "admission",
    question: "When does the admission process start?",
    answer: "Admissions typically open in May and close by the end of August, depending on entrance exam counseling schedules. Check the 'Admissions' page for the current academic year's exact dates.",
    keywords: ["admission dates", "when does admission start", "admission open", "admission deadline", "last date admission"]
  },
  {
    id: "ad5",
    category: "admission",
    question: "Is there a management quota?",
    answer: "Yes, a limited number of management quota seats are available in each branch. Interested candidates can contact the admissions office directly for details and fee structure.",
    keywords: ["management quota", "management seat", "quota admission", "direct admission"]
  },

  // ---------------- Fees ----------------
  {
    id: "fe1",
    category: "fees",
    question: "What is the fee structure?",
    answer: "Annual tuition fees range from ₹80,000 to ₹1,20,000 depending on the branch, plus hostel and mess fees if applicable. A detailed fee structure is available on the 'Fees' page.",
    keywords: ["fee structure", "fees", "tuition fee", "how much fees", "course fee", "cost of course"]
  },
  {
    id: "fe2",
    category: "fees",
    question: "Are scholarships available?",
    answer: "Yes, merit-based, government (SC/ST/OBC/EWS), and sports scholarships are available. You can apply through the National Scholarship Portal or the college scholarship cell.",
    keywords: ["scholarship", "scholarships", "financial aid", "fee waiver", "concession"]
  },
  {
    id: "fe3",
    category: "fees",
    question: "Can I pay fees in installments?",
    answer: "Yes, tuition fees can be paid in two installments per semester. Please contact the accounts office to set up an installment plan before the semester deadline.",
    keywords: ["installments", "installment", "emi", "pay in parts", "partial payment"]
  },
  {
    id: "fe4",
    category: "fees",
    question: "What is the refund policy for fees?",
    answer: "Fee refunds follow UGC/AICTE guidelines: full refund (minus processing charges) if you withdraw before classes begin, with a reducing refund percentage as the semester progresses.",
    keywords: ["refund", "fee refund", "cancel admission", "withdraw admission", "money back"]
  },

  // ---------------- Exams ----------------
  {
    id: "ex1",
    category: "exams",
    question: "How are internal exams conducted?",
    answer: "Internal assessments include 2 mid-semester tests and continuous assignments/quizzes, contributing 30% to your final grade. End-semester exams contribute the remaining 70%.",
    keywords: ["internal exam", "internal assessment", "mid semester", "cie", "continuous assessment"]
  },
  {
    id: "ex2",
    category: "exams",
    question: "What is the minimum attendance required to sit for exams?",
    answer: "A minimum of 75% attendance is mandatory to be eligible to appear for end-semester exams, as per university regulations. Medical condonation may be granted in genuine cases.",
    keywords: ["attendance", "minimum attendance", "75%", "attendance requirement", "condonation"]
  },
  {
    id: "ex3",
    category: "exams",
    question: "How can I check my exam results?",
    answer: "Results are published on the university's official results portal and also linked from our college website under 'Examinations > Results'. You'll also get an SMS/email notification.",
    keywords: ["result", "results", "check result", "exam result", "marksheet", "grade card"]
  },
  {
    id: "ex4",
    category: "exams",
    question: "What if I fail a subject / have a backlog?",
    answer: "You can appear for the backlog/supplementary exam conducted after each semester's regular exams. Register for the backlog exam through the student portal before the deadline.",
    keywords: ["backlog", "fail subject", "supplementary exam", "reappear exam", "arrears"]
  },

  // ---------------- Timetable ----------------
  {
    id: "tt1",
    category: "timetable",
    question: "Where can I find the class timetable?",
    answer: "The current semester's class timetable is published on the student portal under 'Academics > Timetable', and is also displayed on the department notice board.",
    keywords: ["timetable", "class schedule", "class timing", "schedule", "period timing"]
  },
  {
    id: "tt2",
    category: "timetable",
    question: "What are the college working hours?",
    answer: "Classes run Monday to Saturday, 9:00 AM to 4:00 PM, with a lunch break from 12:30 PM to 1:15 PM. Saturdays may have shorter hours depending on the semester schedule.",
    keywords: ["working hours", "college timing", "college hours", "class hours", "opening time", "closing time"]
  },
  {
    id: "tt3",
    category: "timetable",
    question: "When is the exam timetable released?",
    answer: "The exam timetable is usually released 2-3 weeks before exams begin, on the 'Examinations' section of the student portal and college notice boards.",
    keywords: ["exam timetable", "exam schedule", "exam date sheet", "when are exams"]
  },
  {
    id: "tt4",
    category: "timetable",
    question: "Are there semester breaks / holidays?",
    answer: "Yes, we have a winter break in December-January and a summer break in May-June, along with national and festival holidays as per the academic calendar.",
    keywords: ["holidays", "semester break", "vacation", "academic calendar", "break dates"]
  },

  // ---------------- General Information ----------------
  {
    id: "ge1",
    category: "general",
    question: "How do I contact the college administration?",
    answer: "You can reach us at info@campusbot-college.edu or call +91-98765-43210 (Mon-Sat, 9 AM - 5 PM). You can also visit the admin block on campus.",
    keywords: ["contact", "phone number", "email", "contact number", "reach out", "helpline"]
  },
  {
    id: "ge2",
    category: "general",
    question: "Does the college provide placement assistance?",
    answer: "Yes, our dedicated Training & Placement Cell organizes on-campus drives, resume workshops, and mock interviews. Over 85% of eligible students were placed last year.",
    keywords: ["placement", "placements", "job", "career", "recruitment", "companies visit", "package"]
  },
  {
    id: "ge3",
    category: "general",
    question: "Is transportation/bus facility available?",
    answer: "Yes, college buses cover major routes across the city. Route details and bus fees are available at the transport office or on the 'Transport' page of our website.",
    keywords: ["bus", "transport", "transportation", "bus facility", "bus route", "shuttle"]
  },
  {
    id: "ge4",
    category: "general",
    question: "What clubs or extracurricular activities are available?",
    answer: "We have technical clubs (coding, robotics), cultural clubs (music, dance, drama), NSS/NCC, and sports teams. Students can join during the orientation week club fair.",
    keywords: ["clubs", "extracurricular", "activities", "sports team", "nss", "ncc", "cultural"]
  },
  {
    id: "ge5",
    category: "general",
    question: "Who do I talk to if I have a complaint or grievance?",
    answer: "You can submit a grievance through the online Student Grievance Redressal portal, or contact the Dean of Student Affairs directly for urgent matters.",
    keywords: ["complaint", "grievance", "problem", "issue", "redressal", "dean"]
  }
];

// A curated short list shown as clickable "suggested question" chips
const SUGGESTED_QUESTIONS = [
  "What is the admission process?",
  "What is the fee structure?",
  "Where can I find the class timetable?",
  "What courses are offered?",
  "Does the college provide placement assistance?",
  "What is the minimum attendance required to sit for exams?"
];

// -----------------------------------------------------------------------
// 2. DOM REFERENCES
// -----------------------------------------------------------------------
const chatArea = document.getElementById("chatArea");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const typingIndicator = document.getElementById("typingIndicator");
const clearChatBtn = document.getElementById("clearChatBtn");
const suggestedList = document.getElementById("suggestedList");
const categoryChips = document.querySelectorAll(".category-chip");

// -----------------------------------------------------------------------
// 3. INITIALIZATION
// -----------------------------------------------------------------------
function init() {
  renderSuggestedQuestions(SUGGESTED_QUESTIONS);
  renderWelcomeMessage();

  chatForm.addEventListener("submit", handleFormSubmit);
  clearChatBtn.addEventListener("click", handleClearChat);
  categoryChips.forEach((chip) => chip.addEventListener("click", handleCategoryClick));
}

// Greets the user with an opening bot message when the page loads
function renderWelcomeMessage() {
  addBotMessage(
    "Hi there! 👋 I'm CampusBot, your college FAQ assistant. Ask me anything about admissions, courses, fees, exams, timetables, or campus life — or tap a suggestion below to get started."
  );
}

// -----------------------------------------------------------------------
// 4. FORM SUBMISSION / SENDING MESSAGES
// -----------------------------------------------------------------------
function handleFormSubmit(event) {
  event.preventDefault();
  const question = userInput.value.trim();

  // Handle empty messages gracefully: shake the input, don't send anything
  if (question === "") {
    userInput.classList.add("shake");
    userInput.placeholder = "Please type a question first!";
    setTimeout(() => userInput.classList.remove("shake"), 350);
    return;
  }

  addUserMessage(question);
  userInput.value = "";
  respondToUser(question);
}

// Simulates the bot "thinking" before showing the matched answer
function respondToUser(question) {
  showTypingIndicator();

  // Small artificial delay makes the interaction feel more natural
  const thinkTime = 600 + Math.random() * 500;
  setTimeout(() => {
    hideTypingIndicator();
    const answer = findBestAnswer(question);
    addBotMessage(answer);
  }, thinkTime);
}

// -----------------------------------------------------------------------
// 5. FAQ MATCHING LOGIC (keyword scoring, no external API required)
// -----------------------------------------------------------------------
function findBestAnswer(userQuestion) {
  const normalized = normalizeText(userQuestion);
  const userWords = normalized.split(" ").filter((w) => w.length > 2);

  let bestMatch = null;
  let bestScore = 0;

  FAQ_DATABASE.forEach((entry) => {
    let score = 0;

    // Score against each keyword phrase associated with this FAQ entry
    entry.keywords.forEach((keyword) => {
      const normalizedKeyword = normalizeText(keyword);

      // Strong signal: the whole keyword phrase appears in the user's text
      if (normalized.includes(normalizedKeyword)) {
        score += 5;
      }

      // Weaker signal: individual keyword words overlap with user's words
      const keywordWords = normalizedKeyword.split(" ");
      keywordWords.forEach((kw) => {
        if (kw.length > 2 && userWords.includes(kw)) {
          score += 1;
        }
      });
    });

    // Also compare directly against the FAQ's own question text
    const normalizedQuestion = normalizeText(entry.question);
    userWords.forEach((word) => {
      if (normalizedQuestion.includes(word)) {
        score += 1;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  });

  // A minimum score threshold avoids answering with an unrelated FAQ
  if (bestMatch && bestScore >= 3) {
    return bestMatch.answer;
  }

  return getFallbackResponse();
}

// Lowercases text and strips punctuation for cleaner matching
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Friendly fallback shown when no FAQ scores highly enough
function getFallbackResponse() {
  const fallbacks = [
    "Hmm, I don't have an answer for that just yet. Could you try rephrasing, or ask about admissions, courses, fees, exams, timetables, or general campus info?",
    "I'm not quite sure about that one. Try one of the suggested questions below, or contact the admin office at info@campusbot-college.edu for more specific help.",
    "That's outside what I currently know! I'm best at answering questions about admissions, fees, courses, exams, and campus facilities — feel free to try one of those topics."
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// -----------------------------------------------------------------------
// 6. MESSAGE RENDERING
// -----------------------------------------------------------------------
function addUserMessage(text) {
  const row = document.createElement("div");
  row.className = "msg-row user";
  row.innerHTML = `
    <div class="msg-avatar user-avatar" aria-hidden="true">You</div>
    <div class="msg-bubble-wrap">
      <div class="msg-bubble">${escapeHTML(text)}</div>
      <span class="msg-time">${getTimestamp()}</span>
    </div>
  `;
  chatArea.appendChild(row);
  scrollToBottom();
}

function addBotMessage(text) {
  const row = document.createElement("div");
  row.className = "msg-row bot";
  row.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#1B2A4A"/>
        <rect x="14" y="17" width="20" height="15" rx="4" fill="#F4B942"/>
        <circle cx="19.5" cy="24.5" r="2.2" fill="#1B2A4A"/>
        <circle cx="28.5" cy="24.5" r="2.2" fill="#1B2A4A"/>
      </svg>
    </div>
    <div class="msg-bubble-wrap">
      <div class="msg-bubble">${escapeHTML(text)}</div>
      <span class="msg-time">${getTimestamp()}</span>
    </div>
  `;
  chatArea.appendChild(row);
  scrollToBottom();
}

// Prevents any HTML/script injection from user input being rendered as markup
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function getTimestamp() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function scrollToBottom() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

// -----------------------------------------------------------------------
// 7. TYPING INDICATOR
// -----------------------------------------------------------------------
function showTypingIndicator() {
  typingIndicator.classList.remove("hidden");
  scrollToBottom();
}

function hideTypingIndicator() {
  typingIndicator.classList.add("hidden");
}

// -----------------------------------------------------------------------
// 8. SUGGESTED QUESTIONS
// -----------------------------------------------------------------------
function renderSuggestedQuestions(questions) {
  suggestedList.innerHTML = "";
  questions.forEach((q) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "suggested-chip";
    chip.textContent = q;
    chip.addEventListener("click", () => {
      addUserMessage(q);
      respondToUser(q);
    });
    suggestedList.appendChild(chip);
  });
}

// -----------------------------------------------------------------------
// 9. CATEGORY FILTER — updates the suggested-question chips
// -----------------------------------------------------------------------
function handleCategoryClick(event) {
  const category = event.currentTarget.dataset.category;

  categoryChips.forEach((chip) => chip.classList.remove("active"));
  event.currentTarget.classList.add("active");

  if (category === "all") {
    renderSuggestedQuestions(SUGGESTED_QUESTIONS);
    return;
  }

  const filtered = FAQ_DATABASE.filter((entry) => entry.category === category).map(
    (entry) => entry.question
  );
  renderSuggestedQuestions(filtered.length ? filtered : SUGGESTED_QUESTIONS);
}

// -----------------------------------------------------------------------
// 10. CLEAR CHAT
// -----------------------------------------------------------------------
function handleClearChat() {
  chatArea.innerHTML = "";
  renderWelcomeMessage();
  categoryChips.forEach((chip) => chip.classList.remove("active"));
  document.querySelector('[data-category="all"]').classList.add("active");
  renderSuggestedQuestions(SUGGESTED_QUESTIONS);
}

// -----------------------------------------------------------------------
// START
// -----------------------------------------------------------------------
init();
