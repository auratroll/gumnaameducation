import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8-II4YOIt1ZGk6x4VhOMvAIr7xazjhPY",
  authDomain: "gumnaam-education.firebaseapp.com",
  projectId: "gumnaam-education",
  storageBucket: "gumnaam-education.firebasestorage.app",
  messagingSenderId: "680513198806",
  appId: "1:680513198806:web:5a96acd811b6ec4b7b8777"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// DOM Elements
const authModal = document.getElementById('auth-modal');
const ctaBtn = document.getElementById('cta-signup-btn');
const authActionBtn = document.getElementById('auth-action-btn');
const closeModalBtn = document.getElementById('close-modal');
const googleBtn = document.getElementById('google-btn');
const authForm = document.getElementById('auth-form');
const landingSection = document.getElementById('landing-section');
const dashboardSection = document.getElementById('dashboard-section');
const userDisplay = document.getElementById('user-display');
const materialsGrid = document.getElementById('materials-grid');

// Study Material Data (Drive Links Yahan Add Karein)
const studyData = {
  "9th": [
    { title: "Physics", icon: "fa-atom", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "Chemistry", icon: "fa-flask", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "Biology", icon: "fa-dna", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "Mathematics", icon: "fa-calculator", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "Computer Science", icon: "fa-laptop-code", notes: "#", target: "#", tenYears: "#", books: "#" }
  ],
  "10th": [
    { title: "Physics", icon: "fa-atom", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "Chemistry", icon: "fa-flask", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "Mathematics", icon: "fa-calculator", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "English", icon: "fa-book-open", notes: "#", target: "#", tenYears: "#", books: "#" }
  ],
  "11th": [
    { title: "Physics (Part 1)", icon: "fa-atom", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "Chemistry (Part 1)", icon: "fa-flask", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "Mathematics (Part 1)", icon: "fa-calculator", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "Biology (Part 1)", icon: "fa-dna", notes: "#", target: "#", tenYears: "#", books: "#" }
  ],
  "12th": [
    { title: "Physics (Part 2)", icon: "fa-atom", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "Chemistry (Part 2)", icon: "fa-flask", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "Mathematics (Part 2)", icon: "fa-calculator", notes: "#", target: "#", tenYears: "#", books: "#" },
    { title: "Biology (Part 2)", icon: "fa-dna", notes: "#", target: "#", tenYears: "#", books: "#" }
  ]
};

// Render Cards Function
function renderMaterials(selectedClass) {
  materialsGrid.innerHTML = '';
  const subjects = studyData[selectedClass] || [];

  subjects.forEach(sub => {
    const card = document.createElement('div');
    card.className = "bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-emerald-100 transition-all flex flex-col justify-between";
    card.innerHTML = `
      <div>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center text-xl shadow-sm">
            <i class="fa-solid ${sub.icon}"></i>
          </div>
          <div>
            <h4 class="font-bold text-lg text-slate-800">${sub.title}</h4>
            <span class="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">Updated Material</span>
          </div>
        </div>
      </div>
      
      <!-- 4 Action Buttons -->
      <div class="grid grid-cols-2 gap-2 mt-4">
        <a href="${sub.notes}" target="_blank" class="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-sm">
          <i class="fa-solid fa-file-lines"></i> Notes
        </a>
        <a href="${sub.target}" target="_blank" class="bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold py-2 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-sm">
          <i class="fa-solid fa-bullseye"></i> Target Paper
        </a>
        <a href="${sub.tenYears}" target="_blank" class="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-2 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-sm">
          <i class="fa-solid fa-clock-rotate-left"></i> 10 Years
        </a>
        <a href="${sub.books}" target="_blank" class="bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-sm">
          <i class="fa-solid fa-book"></i> Books
        </a>
      </div>
    `;
    materialsGrid.appendChild(card);
  });
}

// Tab Switching (Only 9th, 10th, 11th, 12th)
document.querySelectorAll('.class-tab').forEach(tab => {
  tab.addEventListener('click', (e) => {
    document.querySelectorAll('.class-tab').forEach(t => {
      t.className = "class-tab bg-white text-slate-700 font-semibold px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-emerald-50 transition-all";
    });
    e.target.className = "class-tab active-tab bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl border border-emerald-700 shadow-md transition-all";
    renderMaterials(e.target.dataset.class);
  });
});

// Auth Handlers
ctaBtn?.addEventListener('click', () => authModal.classList.remove('hidden'));
closeModalBtn?.addEventListener('click', () => authModal.classList.add('hidden'));

authActionBtn?.addEventListener('click', () => {
  if (auth.currentUser) {
    signOut(auth);
  } else {
    authModal.classList.remove('hidden');
  }
});

googleBtn?.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    authModal.classList.add('hidden');
  } catch (error) {
    alert("Google Error: " + error.message);
  }
});

authForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    authModal.classList.add('hidden');
  } catch (error) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      authModal.classList.add('hidden');
    } catch (signUpErr) {
      alert(signUpErr.message);
    }
  }
});

// Auth State Check
onAuthStateChanged(auth, (user) => {
  if (user) {
    landingSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    userDisplay.classList.remove('hidden');
    userDisplay.innerText = user.displayName || user.email.split('@')[0];
    authActionBtn.innerText = "Sign Out";
    renderMaterials("9th");
  } else {
    landingSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    userDisplay.classList.add('hidden');
    authActionBtn.innerText = "Sign In";
  }
});
