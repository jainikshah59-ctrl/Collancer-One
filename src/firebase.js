/* eslint-disable */

// These functions are called by BizApp and CreatorApp on mount.
// They inject Firebase SDK via dynamic <script> and set window.__ globals.

const FIREBASE_CONFIG = const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCfjNkaC2pAePgroS-ginbOy_wRsS2sNw8",
  authDomain: "collancer-8fd62.firebaseapp.com",
  projectId: "collancer-8fd62",
  storageBucket: "collancer-8fd62.firebasestorage.app",
  messagingSenderId: "154521281878",
  appId: "1:154521281878:web:ae6439817888eedd6ce2f7"
};

let fbReady = false;
const fbCbs = [];
let fbLoadError = false;

let fbReady = false;
const fbCbs = [];
let fbLoadError = false;

function onFbReady(cb) { if (fbReady || fbLoadError) { cb(); return; } fbCbs.push(cb); }

function loadFirebase() {
  if (window.__collancerFbLoaded) return;
  window.__collancerFbLoaded = true;
  const s = document.createElement('script');
  s.type = 'module';
  s.textContent = `
    import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
    import { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
    try {
      const cfg = ${JSON.stringify(FIREBASE_CONFIG)};
      const app = getApps().find(a => a.name === 'collancer-biz') || initializeApp(cfg, 'collancer-biz');
      window.__cdb = getFirestore(app);
      try { window.__cdb._settings = { ...window.__cdb._settings, experimentalAutoDetectLongPolling: true, merge: true }; } catch(_){}
      window.__cauth = getAuth(app);
      window.__cfs = { collection, doc, setDoc, getDoc, getDocs, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp };
      window.__cauthOps = { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult };
      window.dispatchEvent(new Event('collancerFbReady'));
    } catch(e) {
      console.error('Firebase biz init error:', e);
      window.dispatchEvent(new Event('collancerFbError'));
    }
  `;
  s.onerror = () => {
    console.error('Firebase biz script load failed');
    window.dispatchEvent(new Event('collancerFbError'));
  };
  document.head.appendChild(s);
  window.addEventListener('collancerFbReady', () => {
    fbReady = true;
    fbCbs.forEach(cb => cb());
  }, { once: true });
  window.addEventListener('collancerFbError', () => {
    fbLoadError = true;
    fbCbs.forEach(cb => cb()); // unblock UI so it can show the error screen
  }, { once: true });
  // Safety timeout — unblock UI after 12s regardless
  setTimeout(() => {
    if (!fbReady && !fbLoadError) {
      fbLoadError = true;
      fbCbs.forEach(cb => cb());
    }
  }, 12000);
}

// ── Firebase Helpers ──────────────────────────────────

let db = null, auth = null, firebaseReady = false;
const fbCallbacks = [];
let fbError = false;

function onCreatorFirebaseReady(cb) {
  if (firebaseReady) { cb(); return; }
  fbCallbacks.push(cb);
}

function loadCreatorFirebase() {
  if (window.__creatorFirebaseLoaded) return;
  window.__creatorFirebaseLoaded = true;

  const s = document.createElement('script');
  s.type = 'module';
  s.textContent = `
    import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
    import { getFirestore, collection, doc, setDoc, getDoc, getDocs, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

    try {
      const cfg = ${JSON.stringify(FIREBASE_CONFIG)};
      const app = getApps().find(a => a.name === 'collancer-home') || initializeApp(cfg, 'collancer-home');
      window.__db = getFirestore(app);
      // Force long-polling fallback so WebSocket issues in restricted envs don't slow sync
      try { window.__db._settings = { ...window.__db._settings, experimentalAutoDetectLongPolling: true, merge: true }; } catch(_){}
      window.__auth = getAuth(app);
      window.__fsOps = { collection, doc, setDoc, getDoc, getDocs, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp };
      window.__authOps = { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult };
      window.dispatchEvent(new Event('creatorFirebaseReady'));
    } catch(e) {
      console.error('Firebase init error:', e);
      window.dispatchEvent(new CustomEvent('creatorFirebaseError', { detail: e }));
    }
  `;
  s.onerror = (e) => {
    console.error('Firebase script load error:', e);
    window.dispatchEvent(new CustomEvent('creatorFirebaseError', { detail: e }));
  };
  document.head.appendChild(s);

  window.addEventListener('creatorFirebaseReady', () => {
    db = window.__db;
    auth = window.__auth;
    firebaseReady = true;
    fbCallbacks.forEach(cb => cb());
  }, { once: true });

  window.addEventListener('creatorFirebaseError', () => {
    fbError = true;
    fbCallbacks.forEach(cb => cb()); // still call so UI can unblock
  }, { once: true });

  // Safety timeout — if Firebase hasn't loaded in 12s, unblock the UI
  setTimeout(() => {
    if (!firebaseReady && !fbError) {
      fbError = true;
      fbCallbacks.forEach(cb => cb());
    }
  }, 12000);
}

// ── Ad Pricing ────────────────────────────────────────

// ── Promotion Categories (all India-relevant) ─────────

// ── Cloudinary PFP Upload ─────────────────────────────




// ── Logout Confirm Modal ───────────────────────────────


// ── Ad Pricing ────────────────────────────────────────

export { onFbReady, loadFirebase, onCreatorFirebaseReady, loadCreatorFirebase };
