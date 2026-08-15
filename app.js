import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged 
} from './firebase-config.js';

// DOM Elements
const authModal = document.getElementById('auth-modal');
const openModalBtns = [document.getElementById('cta-signup-btn'), document.getElementById('nav-login-btn')];
const closeModalBtn = document.getElementById('close-modal');
const googleBtn = document.getElementById('google-btn');
const authForm = document.getElementById('auth-form');

// Open Modal
openModalBtns.forEach(btn => {
  btn?.addEventListener('click', () => authModal.classList.remove('hidden'));
});

// Close Modal
closeModalBtn?.addEventListener('click', () => authModal.classList.add('hidden'));

// Google Sign In
googleBtn.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    alert(`Welcome ${result.user.displayName}!`);
    authModal.classList.add('hidden');
  } catch (error) {
    alert(error.message);
  }
});

// Email/Password Auth
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;

  try {
    // Attempt Login First
    await signInWithEmailAndPassword(auth, email, password);
    alert('Logged in successfully!');
    authModal.classList.add('hidden');
  } catch (error) {
    // If user not found, create new account
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Account created successfully!');
        authModal.classList.add('hidden');
      } catch (signupError) {
        alert(signupError.message);
      }
    } else {
      alert(error.message);
    }
  }
});

// Check Auth State
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is signed in:', user.email);
    // Agle step mein yahan Dashboard show karwayenge
  }
});
