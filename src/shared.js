/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

function MediaLightbox({ file, onClose }) {
  // For Cloudinary images: inject fl_attachment into the URL to force browser download
  const getDownloadUrl = (url) => {
    try {
      // Cloudinary URL pattern: /image/upload/ or /video/upload/
      // Insert fl_attachment transformation before the version/filename
      if (url.includes("cloudinary.com")) {
        return url.replace(/\/(image|video)\/upload\//, "/$1/upload/fl_attachment/");
      }
      return url;
    } catch { return url; }
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const downloadUrl = getDownloadUrl(file.url);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file.name || "reference-image";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      style={{
        position:"fixed", inset:0, zIndex:99999,
        background:"rgba(0,0,0,.95)",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"20px 16px",
      }}>

      {/* Media container — NO overflow:hidden so video controls are fully accessible */}
      <div
        onClick={e=>e.stopPropagation()}
        style={{
          width:"100%", maxWidth:560,
          display:"flex", alignItems:"center", justifyContent:"center",
          borderRadius:18,
          boxShadow:"0 8px 48px rgba(0,0,0,.8)",
        }}>
        {file.type === "video"
          ? <video
              key={file.url}
              src={file.url}
              controls
              playsInline
              style={{
                width:"100%", maxWidth:560,
                maxHeight:"65vh",
                borderRadius:16,
                background:"#000",
                display:"block",
              }}/>
          : <img
              src={file.url}
              alt={file.name || "reference"}
              style={{
                maxWidth:"100%", maxWidth:560,
                maxHeight:"68vh",
                borderRadius:16,
                objectFit:"contain",
                display:"block",
              }}/>}
      </div>

      {/* Filename label */}
      {file.name && (
        <div style={{marginTop:10,fontSize:11,color:"rgba(255,255,255,.45)",
          fontFamily:"'DM Sans',sans-serif",maxWidth:560,
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {file.name}
        </div>
      )}

      {/* Action buttons */}
      <div
        onClick={e=>e.stopPropagation()}
        style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap",justifyContent:"center"}}>
        {file.type === "image" && (
          <button
            onClick={handleDownload}
            style={{padding:"11px 24px",borderRadius:50,border:"none",
              background:"linear-gradient(135deg,#00e5ff,#0090c0)",
              color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              boxShadow:"0 4px 14px rgba(0,229,255,.35)"}}>
            ⬇ Download Image
          </button>
        )}
        {file.type === "video" && (
          <button
            onClick={e=>{e.stopPropagation();window.open(file.url,"_blank");}}
            style={{padding:"11px 24px",borderRadius:50,border:"none",
              background:"linear-gradient(135deg,#9c6af7,#7c4af7)",
              color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              boxShadow:"0 4px 14px rgba(156,106,247,.35)"}}>
            ↗ Open in Browser
          </button>
        )}
        <button
          onClick={e=>{e.stopPropagation();onClose();}}
          style={{padding:"11px 24px",borderRadius:50,
            border:"1.5px solid rgba(255,255,255,.25)",
            background:"rgba(255,255,255,.08)",color:"#fff",
            fontSize:13,fontWeight:700,cursor:"pointer",
            fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
          ✕ Close
        </button>
      </div>
    </div>,
    document.body
  );
}





/* ═══════════════════════════════════════════════════════
   COLLANCER — Where Influence Meets Industry
   India Edition · INR · Real Photos · No Team
═══════════════════════════════════════════════════════ */

// ── Firebase Config & Loader ──────────────────────────
const FIREBASE_CONFIG = {
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
async function writeBookingToFirebase(inf, promoKey, promoPrice, bookingData, bizDisplayName, bizId="", promotionCategory="", bizCampaignId="", bizPfp="", bizIsPro=false) {
  if (!window.__cdb || !window.__cfs) return;
  try {
    const { addDoc, collection, serverTimestamp } = window.__cfs;
    const today = new Date();
    const end = new Date(today); end.setDate(end.getDate() + 7);
    const fmt2 = d => d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"});
    const creatorId = inf.uid || inf.firebaseId || null;
    if (!creatorId) return;
    await addDoc(collection(window.__cdb, "bookings"), {
      creatorId,
      creatorName: inf.name,
      creatorHandle: inf.handle,
      creatorPlatform: inf.platform,
      creatorNiche: inf.niche,
      creatorCity: inf.city,
      bizName: bizDisplayName || "Business on Collancer",
      bizId: bizId || "",
      bizPfp: bizPfp || "",
      bizIsPro: bizIsPro || false,
      bizCampaignId: bizCampaignId || "",
      promoType: promoKey,
      promoLabel: bookingData.promoLabel || promoKey,
      amount: promoPrice,
      brief: bookingData.brief || "",
      duration: bookingData.dur || "7 days",
      targetAudience: bookingData.targetAudience || "",
      productName: bookingData.productName || "",
      hashtags: bookingData.hashtags || "",
      promotionCategory: promotionCategory || "",
      mediaFiles: bookingData.mediaFiles || [],
      status: "Active",
      seenByCreator: true,
      start: fmt2(today),
      end: fmt2(end),
      createdAt: serverTimestamp(),
    });
  } catch(e) { console.error("Firebase booking error:", e); }
}

async function saveReviewToFirebase(creatorId, review) {
  if (!window.__cdb || !window.__cfs || !creatorId) return;
  try {
    const { addDoc, collection, doc, getDoc, updateDoc, serverTimestamp } = window.__cfs;
    // Save review to reviews subcollection
    await addDoc(collection(window.__cdb, "reviews"), {
      creatorId,
      ...review,
      createdAt: serverTimestamp(),
    });
    // Recalculate and update rating on creator doc
    const { getDocs, query, where } = window.__cfs;
    const q = query(collection(window.__cdb, "reviews"), where("creatorId", "==", creatorId));
    const snap = await getDocs(q);
    const allReviews = snap.docs.map(d => d.data());
    const avgRating = allReviews.reduce((s, r) => s + (r.stars||0), 0) / allReviews.length;
    await updateDoc(doc(window.__cdb, "creators", creatorId), {
      rating: Math.round(avgRating * 10) / 10,
    });
  } catch(e) { console.error("Review save error:", e); }
}

// ── Image Compression ─────────────────────────────────
function compressImage(dataUrl, maxSize=400) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(maxSize/img.width, maxSize/img.height, 1);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// ── Cloudinary PFP Upload ─────────────────────────────
const CLOUDINARY_CLOUD = "dd77dqbho";
const CLOUDINARY_PRESET = "collancer";

async function uploadPfpToStorage(uid, base64DataUrl, type="business") {
  try {
    const formData = new FormData();
    formData.append("file", base64DataUrl);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    formData.append("public_id", `pfps_${type}_${uid}_${Date.now()}`);
    formData.append("folder", "collancer_pfps");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: formData }
    );
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url || null;
  } catch(e) { console.error("Cloudinary upload error:", e); return null; }
}


// ── Logo ──────────────────────────────────────────────
function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" fill="none">
      <path d="M250 250 L145 145" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L355 145" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L145 355" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L355 355" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L250 115" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L250 385" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L115 250" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L385 250" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <ellipse cx="250" cy="250" rx="24" ry="24" fill="#ffffff"/>
      <circle cx="250" cy="108" r="34" fill="#00E5FF"/>
      <circle cx="250" cy="392" r="34" fill="#00E5FF"/>
      <circle cx="108" cy="250" r="34" fill="#00E5FF"/>
      <circle cx="392" cy="250" r="34" fill="#00E5FF"/>
    </svg>
  );
}

// ── Global Styles ─────────────────────────────────────
const Styles = () => {
  useEffect(() => {
    // Inject preconnect for faster font loading
    if (!document.getElementById('collancer-preconnect')) {
      const pre1 = document.createElement('link');
      pre1.id = 'collancer-preconnect';
      pre1.rel = 'preconnect';
      pre1.href = 'https://fonts.googleapis.com';
      document.head.insertBefore(pre1, document.head.firstChild);

      const pre2 = document.createElement('link');
      pre2.rel = 'preconnect';
      pre2.href = 'https://fonts.gstatic.com';
      pre2.crossOrigin = 'anonymous';
      document.head.insertBefore(pre2, document.head.firstChild);
    }
    if (!document.getElementById('collancer-fonts')) {
      const link = document.createElement('link');
      link.id = 'collancer-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=DM+Mono:wght@400;500&display=swap';
      document.head.appendChild(link);
    }
  }, []);
  return (
  <style>{`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#070710;--bg2:#0c0c1a;--bg3:#111125;
      --surf:#13132a;
      --b:rgba(0,229,255,.08);--b2:rgba(0,229,255,.16);
      --c:#00E5FF;--c2:#00bcd4;--cdim:rgba(0,229,255,.12);
      --txt:#e8e8f8;--txt2:#8888aa;--txt3:#44445a;
      --grn:#00e676;--amb:#ffab40;--pur:#9c6af7;--red:#f87171;
      --shad:0 32px 80px rgba(0,0,0,.7);

      /* ── Claymorphism tokens ── */
      --clay-r: 24px;
      --clay-r-lg: 32px;
      --clay-r-xl: 40px;
      --clay-r-sm: 16px;
      --clay-surf: linear-gradient(145deg, rgba(25,25,55,.95) 0%, rgba(15,15,35,.98) 100%);
      --clay-surf2: linear-gradient(145deg, rgba(20,20,48,.92) 0%, rgba(12,12,28,.96) 100%);
      --clay-inset: inset 0 2px 4px rgba(255,255,255,.06), inset 0 -2px 4px rgba(0,0,0,.4);
      --clay-shadow: 0 5px 0 rgba(0,0,0,.42), 0 8px 20px rgba(0,0,0,.5), 0 1px 0 rgba(255,255,255,.04) inset;
      --clay-shadow-sm: 0 3px 0 rgba(0,0,0,.38), 0 5px 12px rgba(0,0,0,.42), 0 1px 0 rgba(255,255,255,.04) inset;
      --clay-shadow-lg: 0 7px 0 rgba(0,0,0,.46), 0 12px 30px rgba(0,0,0,.6), 0 2px 0 rgba(255,255,255,.05) inset;
      --clay-cyan-shadow: 0 4px 0 #005a70, 0 6px 14px rgba(0,229,255,.22), 0 1px 0 rgba(255,255,255,.18) inset;
      --clay-pur-shadow: 0 4px 0 #321070, 0 6px 14px rgba(156,106,247,.25), 0 1px 0 rgba(255,255,255,.16) inset;
      --clay-red-shadow: 0 4px 0 #6a0e0e, 0 6px 14px rgba(248,113,113,.2), 0 1px 0 rgba(255,255,255,.16) inset;
      --clay-grn-shadow: 0 4px 0 #005020, 0 6px 14px rgba(0,230,118,.2), 0 1px 0 rgba(255,255,255,.18) inset;
    }
    html{scroll-behavior:smooth}
    body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--txt);min-height:100vh;overflow-x:hidden;display:flex;justify-content:center;align-items:flex-start}
    #root,#app{width:100%;max-width:430px;min-height:100vh;background:var(--bg);overflow-x:hidden;position:relative;box-sizing:border-box}
    h1,h2,h3,h4{font-family:'Plus Jakarta Sans',sans-serif}
    .syne{font-family:'Plus Jakarta Sans',sans-serif!important}
    ::-webkit-scrollbar{width:6px}
    ::-webkit-scrollbar-track{background:var(--bg);border-radius:6px}
    ::-webkit-scrollbar-thumb{background:var(--b2);border-radius:6px;border:1px solid rgba(255,255,255,.04)}
    .nosb::-webkit-scrollbar{display:none}
    .nosb{-ms-overflow-style:none;scrollbar-width:none}

    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes scaleIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.2);opacity:1}}
    @keyframes pring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.6);opacity:0}}
    @keyframes orb1{0%,100%{transform:translate(0,0)}40%{transform:translate(55px,-38px)}70%{transform:translate(-28px,48px)}}
    @keyframes orb2{0%,100%{transform:translate(0,0)}50%{transform:translate(-65px,55px)}}
    @keyframes orb3{0%,100%{transform:translate(0,0)}50%{transform:translate(45px,38px)}}
    @keyframes gridmove{0%{transform:translateY(0)}100%{transform:translateY(50px)}}
    @keyframes gradshift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
    @keyframes bpulse{0%,100%{border-color:rgba(0,229,255,.1)}50%{border-color:rgba(0,229,255,.38)}}
    @keyframes slideleft{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
    @keyframes dotpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.45)}}
    @keyframes msgIn{from{opacity:0;transform:translateY(7px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes loadbar{from{width:0%}to{width:100%}}
    @keyframes imgload{from{opacity:0}to{opacity:1}}
    @keyframes loadshimmer{0%{left:-100%}100%{left:200%}}
    @keyframes dotbounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-8px);opacity:1}}
    @keyframes proGlow{0%,100%{box-shadow:var(--clay-pur-shadow)}50%{box-shadow:0 5px 0 #3a1080, 0 18px 48px rgba(156,106,247,.45), 0 2px 0 rgba(255,255,255,.2) inset}}
    @keyframes proBadge{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
    @keyframes proShimmer{0%{transform:translateX(-200%)}100%{transform:translateX(200%)}}
    @keyframes lockPulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}
    @keyframes confettiFall{from{opacity:0;transform:translateY(-20px) rotate(0deg)}to{opacity:.7;transform:translateY(80vh) rotate(360deg)}}
    @keyframes orbit0{from{transform:rotate(0deg) translateX(54px) translateY(-50%)}to{transform:rotate(360deg) translateX(54px) translateY(-50%)}}
    @keyframes orbit120{from{transform:rotate(120deg) translateX(54px) translateY(-50%)}to{transform:rotate(480deg) translateX(54px) translateY(-50%)}}
    @keyframes orbit240{from{transform:rotate(240deg) translateX(54px) translateY(-50%)}to{transform:rotate(600deg) translateX(54px) translateY(-50%)}}
    @keyframes tabContentIn{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    .tabcontent{animation:tabContentIn .25s cubic-bezier(.22,.68,0,1.2) both;will-change:transform,opacity}
    @keyframes cardIn{from{opacity:0;transform:translateY(22px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes notifSlide{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes goldShimmer{0%{transform:translateX(-150%);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(250%);opacity:0}}
    @keyframes silverShimmer{0%{transform:translateX(-150%);opacity:0}20%{opacity:.65}80%{opacity:.65}100%{transform:translateX(250%);opacity:0}}
    @keyframes categoryScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes searchExpand{from{opacity:0;transform:translateY(-8px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes searchResultsIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes profileSlideIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}
    @keyframes suggChipIn{from{opacity:0;transform:scale(.88) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes searchBtnPop{0%{transform:scale(1)}40%{transform:scale(0.88)}100%{transform:scale(1)}}
    @keyframes inputFocus{from{box-shadow:0 5px 0 rgba(0,0,0,.4),0 8px 20px rgba(0,0,0,.5)}to{box-shadow:0 5px 0 #006678, 0 10px 28px rgba(0,229,255,.3), 0 2px 0 rgba(255,255,255,.1) inset}}
    @keyframes btnGlowPulse{0%,100%{box-shadow:var(--clay-cyan-shadow)}50%{box-shadow:0 5px 0 #006678, 0 18px 40px rgba(0,229,255,.55), 0 2px 0 rgba(255,255,255,.25) inset}}
    @keyframes clayBounce{0%{transform:translateY(0) scale(1)}30%{transform:translateY(-6px) scale(1.04)}60%{transform:translateY(-2px) scale(.98)}100%{transform:translateY(0) scale(1)}}
    *{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
    .fu{animation:fadeUp .4s cubic-bezier(.22,.68,0,1.3) both}
    .fi{animation:fadeIn .3s ease both}
    .si{animation:scaleIn .36s cubic-bezier(.22,.68,0,1.3) both}

    /* ── Clay Card ── */
    .card{
      transition:transform .28s cubic-bezier(.22,.68,0,1.3),box-shadow .28s ease,border-color .28s ease;
      cursor:pointer;will-change:transform;
      border-radius:var(--clay-r-lg)!important;
    }
    .card:hover{
      transform:translateY(-7px) scale(1.01)!important;
      box-shadow:0 5px 0 rgba(0,0,0,.5), 0 28px 60px rgba(0,0,0,.65), 0 2px 0 rgba(255,255,255,.06) inset !important
    }

    .glow{
      font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;
      background:linear-gradient(135deg,var(--c) 0%,#80eeff 50%,var(--c) 100%);
      background-size:200% auto;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      animation:gradshift 4s ease infinite
    }

    @keyframes btnShimmer{0%{left:-80%}100%{left:120%}}

    /* ── Primary Clay Button (cyan) ── */
    .btnp{
      display:inline-flex;align-items:center;justify-content:center;gap:6px;
      background:linear-gradient(180deg,#1aecff 0%,var(--c) 40%,#00b8d4 100%);
      color:#030d12;border:none;padding:12px 26px;border-radius:50px;
      font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:13px;
      cursor:pointer;letter-spacing:.2px;user-select:none;
      position:relative;overflow:hidden;
      box-shadow:var(--clay-cyan-shadow);
      transform:translateY(0) scale(1);
      transition:transform .15s cubic-bezier(.34,1.56,.64,1),box-shadow .15s ease,filter .15s;
    }
    .btnp::before{content:'';position:absolute;top:0;left:0;right:0;height:45%;
      background:linear-gradient(180deg,rgba(255,255,255,.28) 0%,transparent 100%);
      border-radius:50px 50px 0 0;pointer-events:none}
    .btnp::after{
      content:'';position:absolute;
      top:0;left:-80%;width:45%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);
      transform:skewX(-18deg);pointer-events:none;
    }
    .btnp:hover{
      transform:translateY(-2px) scale(1.015);
      box-shadow:0 5px 0 #005a70, 0 8px 18px rgba(0,229,255,.38), 0 1px 0 rgba(255,255,255,.22) inset;
      filter:brightness(1.06);
    }
    .btnp:hover::after{animation:btnShimmer .5s ease forwards}
    .btnp:active{
      transform:translateY(2px) scale(.98);
      box-shadow:0 1px 0 #005a70, 0 2px 6px rgba(0,229,255,.15), 0 1px 0 rgba(255,255,255,.1) inset;
      filter:brightness(.95);
      transition:transform .06s ease,box-shadow .06s ease,filter .06s;
    }
    .btnp:disabled{opacity:.5;cursor:not-allowed;transform:none;filter:none;
      box-shadow:0 2px 0 #005a70,0 3px 8px rgba(0,229,255,.08)}

    /* ── Ghost Clay Button ── */
    .btng{
      display:inline-flex;align-items:center;justify-content:center;gap:6px;
      background:linear-gradient(145deg,rgba(30,30,58,.9),rgba(18,18,38,.95));
      color:var(--txt2);
      border:1.5px solid rgba(255,255,255,.1);padding:11px 22px;border-radius:50px;
      font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;
      cursor:pointer;user-select:none;
      box-shadow:0 3px 0 rgba(0,0,0,.45), 0 5px 12px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.06) inset;
      transform:translateY(0);
      transition:transform .15s cubic-bezier(.34,1.56,.64,1),box-shadow .15s,border-color .15s,color .15s,background .15s;
    }
    .btng::before{content:'';position:absolute;top:0;left:0;right:0;height:40%;
      background:linear-gradient(180deg,rgba(255,255,255,.06) 0%,transparent 100%);
      border-radius:50px 50px 0 0;pointer-events:none}
    .btng:hover{
      color:var(--c);border-color:rgba(0,229,255,.45);
      background:linear-gradient(145deg,rgba(0,229,255,.12),rgba(0,188,212,.06));
      box-shadow:0 4px 0 rgba(0,0,0,.48), 0 6px 14px rgba(0,229,255,.15), 0 1px 0 rgba(255,255,255,.08) inset;
      transform:translateY(-2px);
    }
    .btng:active{transform:translateY(2px);box-shadow:0 1px 0 rgba(0,0,0,.45), 0 1px 0 rgba(255,255,255,.04) inset;transition:transform .06s,box-shadow .06s}

    /* ── Pro Clay Button (purple) ── */
    .pro-btn-3d{
      display:inline-flex;align-items:center;justify-content:center;gap:6px;
      background:linear-gradient(180deg,#b890fa 0%,#9c6af7 45%,#7c4af7 100%);
      border:none;border-radius:20px;color:#fff;
      font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:13px;
      cursor:pointer;user-select:none;
      position:relative;overflow:hidden;
      box-shadow:var(--clay-pur-shadow);
      transform:translateY(0) scale(1);
      transition:transform .15s cubic-bezier(.34,1.56,.64,1),box-shadow .15s,filter .15s;
    }
    .pro-btn-3d::before{content:'';position:absolute;top:0;left:0;right:0;height:45%;
      background:linear-gradient(180deg,rgba(255,255,255,.22) 0%,transparent 100%);
      border-radius:20px 20px 0 0;pointer-events:none}
    .pro-btn-3d::after{content:'';position:absolute;top:0;left:-80%;width:45%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);transform:skewX(-18deg);pointer-events:none}
    .pro-btn-3d:hover{transform:translateY(-2px) scale(1.015);filter:brightness(1.08);box-shadow:0 5px 0 #321070, 0 8px 18px rgba(156,106,247,.4), 0 1px 0 rgba(255,255,255,.2) inset}
    .pro-btn-3d:hover::after{animation:btnShimmer .5s ease forwards}
    .pro-btn-3d:active{transform:translateY(2px) scale(.98);filter:brightness(.95);box-shadow:0 1px 0 #321070,0 2px 6px rgba(156,106,247,.15),0 1px 0 rgba(255,255,255,.1) inset;transition:transform .06s,box-shadow .06s,filter .06s}
    .pro-btn-3d:disabled{opacity:.5;cursor:not-allowed;transform:none;filter:none}

    /* ── Danger Clay Button (red) ── */
    .btnd{
      display:inline-flex;align-items:center;justify-content:center;gap:6px;
      background:linear-gradient(180deg,#ff9898 0%,#f87171 45%,#e53935 100%);color:#fff;
      border:none;padding:11px 22px;border-radius:50px;
      font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;
      cursor:pointer;user-select:none;position:relative;overflow:hidden;
      box-shadow:var(--clay-red-shadow);
      transform:translateY(0);
      transition:transform .15s cubic-bezier(.34,1.56,.64,1),box-shadow .15s,filter .15s;
    }
    .btnd::before{content:'';position:absolute;top:0;left:0;right:0;height:45%;background:linear-gradient(180deg,rgba(255,255,255,.22) 0%,transparent 100%);border-radius:50px 50px 0 0;pointer-events:none}
    .btnd:hover{transform:translateY(-2px);filter:brightness(1.06);box-shadow:0 5px 0 #6a0e0e, 0 8px 16px rgba(248,113,113,.32), 0 1px 0 rgba(255,255,255,.18) inset}
    .btnd:active{transform:translateY(2px);filter:brightness(.95);box-shadow:0 1px 0 #6a0e0e,0 2px 6px rgba(248,113,113,.15),0 1px 0 rgba(255,255,255,.08) inset;transition:transform .06s,box-shadow .06s,filter .06s}
    .btnd:disabled{opacity:.5;cursor:not-allowed;transform:none;filter:none}

    /* ── Success Clay Button (green) ── */
    .btns{
      display:inline-flex;align-items:center;justify-content:center;gap:6px;
      background:linear-gradient(180deg,#4fffaa 0%,#00e676 45%,#00c853 100%);color:#021a0a;
      border:none;padding:11px 22px;border-radius:50px;
      font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;
      cursor:pointer;user-select:none;position:relative;overflow:hidden;
      box-shadow:var(--clay-grn-shadow);
      transform:translateY(0);
      transition:transform .15s cubic-bezier(.34,1.56,.64,1),box-shadow .15s,filter .15s;
    }
    .btns::before{content:'';position:absolute;top:0;left:0;right:0;height:45%;background:linear-gradient(180deg,rgba(255,255,255,.28) 0%,transparent 100%);border-radius:50px 50px 0 0;pointer-events:none}
    .btns:hover{transform:translateY(-2px);filter:brightness(1.06);box-shadow:0 5px 0 #005020, 0 8px 16px rgba(0,230,118,.32), 0 1px 0 rgba(255,255,255,.24) inset}
    .btns:active{transform:translateY(2px);filter:brightness(.95);box-shadow:0 1px 0 #005020,0 2px 6px rgba(0,200,83,.12),0 1px 0 rgba(255,255,255,.1) inset;transition:transform .06s,box-shadow .06s,filter .06s}
    .btns:disabled{opacity:.5;cursor:not-allowed;transform:none;filter:none}

    /* ── Clay surface classes ── */
    .clay-card{
      background:linear-gradient(145deg,rgba(22,22,52,.96) 0%,rgba(14,14,34,.98) 100%);
      border-radius:var(--clay-r-lg);
      box-shadow:var(--clay-shadow);
      border:1.5px solid rgba(255,255,255,.06);
      position:relative;overflow:hidden;
    }
    .clay-card::before{
      content:'';position:absolute;top:0;left:0;right:0;height:1.5px;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);
      pointer-events:none;z-index:1;
    }
    .clay-inner{
      background:linear-gradient(145deg,rgba(18,18,42,.9) 0%,rgba(10,10,26,.95) 100%);
      border-radius:var(--clay-r-sm);
      box-shadow:var(--clay-shadow-sm);
      border:1px solid rgba(255,255,255,.05);
    }

    .card{transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s,border-color .3s;cursor:pointer}
    .card:hover{transform:translateY(-7px) scale(1.01);box-shadow:0 5px 0 rgba(0,0,0,.48), 0 16px 36px rgba(0,0,0,.55), 0 2px 0 rgba(255,255,255,.05) inset !important}

    .tag{
      padding:5px 13px;border-radius:50px;font-size:11px;font-weight:700;
      letter-spacing:.5px;
      background:linear-gradient(145deg,rgba(0,229,255,.15),rgba(0,188,212,.08));
      color:var(--c);
      border:1.5px solid rgba(0,229,255,.22);
      box-shadow:0 3px 0 rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.06) inset;
    }
    .badge{
      display:inline-flex;align-items:center;gap:5px;padding:5px 11px;
      border-radius:50px;font-size:11px;font-weight:700;letter-spacing:.3px;
      box-shadow:0 2px 0 rgba(0,0,0,.3), 0 1px 0 rgba(255,255,255,.05) inset;
    }

    input,select,textarea{font-family:'DM Sans',sans-serif}
    input,select,textarea{
      background:linear-gradient(145deg,rgba(10,10,28,.95),rgba(8,8,22,.98))!important;
      border-radius:var(--clay-r-sm)!important;
      box-shadow:inset 0 3px 8px rgba(0,0,0,.5), inset 0 1px 2px rgba(0,0,0,.3), 0 1px 0 rgba(255,255,255,.04)!important;
      border:1.5px solid rgba(255,255,255,.08)!important;
      transition:border-color .2s, box-shadow .2s!important;
    }
    input:focus,select:focus,textarea:focus{
      outline:none!important;
      border-color:rgba(0,229,255,.4)!important;
      box-shadow:inset 0 3px 8px rgba(0,0,0,.5), 0 0 0 2px rgba(0,229,255,.1)!important;
    }

    .mbg{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.88);
      backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;padding:16px}
    .mbox{
      background:linear-gradient(145deg,rgba(18,18,46,.98) 0%,rgba(10,10,28,.99) 100%);
      border:1.5px solid rgba(255,255,255,.07);
      border-radius:var(--clay-r-xl);
      width:100%;max-width:390px;max-height:92vh;overflow-y:auto;
      box-shadow:0 5px 0 rgba(0,0,0,.48), 0 9px 24px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.06) inset;
      animation:scaleIn .32s cubic-bezier(.16,1,.3,1);
      position:relative;
    }
    .mbox::before{content:'';position:absolute;top:0;left:0;right:0;height:1.5px;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent);
      border-radius:var(--clay-r-xl) var(--clay-r-xl) 0 0;z-index:1;pointer-events:none}

    /* Profile image */
    .avatar-img{width:100%;height:100%;object-fit:cover;border-radius:50%;animation:imgload .4s ease}
    .avatar-wrap{border-radius:50%;overflow:hidden;flex-shrink:0;position:relative}

    .hm{display:none!important}
    .fm{width:100%!important}
    .sm{flex-direction:column!important}
  `}</style>
  );
};

// ── Indian Influencer Data ─────────────────────────────
// Using pravatar.cc for consistent Indian-style portraits

const INFS = [
  {
    id:1, name:"Priya Sharma", handle:"@priya.sharma", platform:"Instagram",
    followers:50000, niche:"Fashion", rating:4.9, engagement:6.4,
    location:"Mumbai", city:"Mumbai",
    bio:"India's leading fashion creator & style curator. Collaborated with 60+ premium Indian & international brands. Vogue India featured.",
    price:1000, verified:true, trending:true, featured:true,
    prices:{story:500, reel:1000, video:0, personalad:2200},
    photo:"https://randomuser.me/api/portraits/women/44.jpg",
    avgViews:4000, avgLikes:600, reach:15000,
    tags:["#fashion","#ootd","#style"],
    reviews:[{user:"Myntra",text:"Incredible campaign — 4× ROI in 7 days.",stars:5},{user:"Nykaa Fashion",text:"Professional, creative, best creator we worked with.",stars:5}]
  },
  {
    id:2, name:"Rohan Mehra", handle:"@techwithrohan", platform:"YouTube",
    followers:100000, niche:"Tech", rating:4.8, engagement:8.3,
    location:"Bengaluru", city:"Bengaluru",
    bio:"In-depth tech reviews, unboxings & startup stories. 7 years building India's most trusted tech audience.",
    price:6000, verified:true, trending:true, featured:false,
    prices:{story:0, reel:0, video:6000, personalad:12000},
    photo:"https://randomuser.me/api/portraits/men/32.jpg",
    avgViews:110000, avgLikes:8500, reach:360000,
    tags:["#tech","#unboxing","#gadgets"],
    reviews:[{user:"OnePlus India",text:"Drove 15k pre-orders from a single video.",stars:5},{user:"boAt",text:"Rohan delivered beyond expectations.",stars:4}]
  },
  {
    id:3, name:"Sneha Kapoor", handle:"@snehalifts", platform:"Instagram",
    followers:200000, niche:"Fitness", rating:4.7, engagement:11.8,
    location:"Delhi", city:"New Delhi",
    bio:"NASM certified trainer & fitness creator. Viral content reaching millions. Brand partnerships since 2020.",
    price:4000, verified:true, trending:false, featured:true,
    prices:{story:2000, reel:4000, video:0, personalad:8800},
    photo:"https://randomuser.me/api/portraits/women/68.jpg",
    avgViews:12000, avgLikes:1500, reach:60000,
    tags:["#fitness","#workout","#wellness"],
    reviews:[{user:"HRX",text:"Our best-performing influencer campaign ever.",stars:5}]
  },
  {
    id:4, name:"Arjun Reddy", handle:"@arjunfinance", platform:"YouTube",
    followers:400000, niche:"Finance", rating:4.6, engagement:7.9,
    location:"Hyderabad", city:"Hyderabad",
    bio:"Simplifying personal finance & investing for young India. Featured in Economic Times and Money Control.",
    price:24000, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:24000, personalad:48000},
    photo:"https://randomuser.me/api/portraits/men/55.jpg",
    avgViews:30000, avgLikes:5600, reach:120000,
    tags:["#investing","#money","#fintech"],
    reviews:[{user:"Zerodha",text:"Authentic voice, great conversion rate.",stars:5}]
  },
  {
    id:5, name:"Ananya Singh", handle:"@ananya.wanders", platform:"Instagram",
    followers:500000, niche:"Travel", rating:4.9, engagement:5.8,
    location:"Jaipur", city:"Jaipur",
    bio:"Documenting India's hidden gems & luxury escapes. 65+ destinations. Condé Nast Traveller India contributor.",
    price:10000, verified:true, trending:true, featured:true,
    prices:{story:5000, reel:10000, video:0, personalad:22000},
    photo:"https://randomuser.me/api/portraits/women/29.jpg",
    avgViews:155000, avgLikes:11000, reach:150000,
    tags:["#travel","#india","#wanderlust"],
    reviews:[{user:"Taj Hotels",text:"Beautiful content, exceptional engagement.",stars:5}]
  },
  {
    id:6, name:"Kabir Khan", handle:"@kabirfoods", platform:"Instagram",
    followers:1000000, niche:"Food", rating:4.8, engagement:13.5,
    location:"Delhi", city:"New Delhi",
    bio:"Street food to fine dining — India's most-watched food creator. Partner chef, 2 Michelin-rated restaurants.",
    price:20000, verified:true, trending:true, featured:false,
    prices:{story:10000, reel:20000, video:0, personalad:44000},
    photo:"https://randomuser.me/api/portraits/men/77.jpg",
    avgViews:620000, avgLikes:83000, reach:300000,
    tags:["#food","#streetfood","#viral"],
    reviews:[{user:"Swiggy",text:"Record-breaking app installs after campaign.",stars:5}]
  },
  {
    id:7, name:"Meera Nair", handle:"@meerabeauty", platform:"Instagram",
    followers:2000000, niche:"Beauty", rating:4.7, engagement:9.5,
    location:"Kochi", city:"Kochi",
    bio:"Skincare specialist, makeup artist & clean beauty advocate. Partner to Lakmé, Kay Beauty, and Dot & Key.",
    price:40000, verified:false, trending:false, featured:true,
    prices:{story:20000, reel:40000, video:0, personalad:88000},
    photo:"https://randomuser.me/api/portraits/women/52.jpg",
    avgViews:8000, avgLikes:9000, reach:600000,
    tags:["#beauty","#skincare","#makeup"],
    reviews:[{user:"Lakmé",text:"Honest reviews that convert consistently.",stars:4}]
  },
  {
    id:8, name:"Vikram Joshi", handle:"@vikramgames", platform:"YouTube",
    followers:4000000, niche:"Gaming", rating:4.9, engagement:10.9,
    location:"Pune", city:"Pune",
    bio:"Pro gamer, BGMI champion & esports commentator. 10M+ total views. Top gaming creator in India.",
    price:240000, verified:true, trending:true, featured:true,
    prices:{story:0, reel:0, video:240000, personalad:480000},
    photo:"https://randomuser.me/api/portraits/men/22.jpg",
    avgViews:290000, avgLikes:31000, reach:1200000,
    tags:["#gaming","#bgmi","#esports"],
    reviews:[{user:"Razer India",text:"Campaign went viral in 24 hours.",stars:5},{user:"Battlegrounds",text:"The go-to creator for gaming in India.",stars:5}]
  },
  {
    id:9, name:"Riya Desai", handle:"@riyadesai", platform:"Both",
    followers:320000, ytSubscribers:180000, niche:"Lifestyle", rating:4.8, engagement:9.2,
    location:"Mumbai", city:"Mumbai",
    bio:"Lifestyle & wellness creator on Instagram & YouTube. 320K Instagram followers + 180K YouTube subscribers. Known for authentic storytelling and viral content.",
    price:15000, verified:true, trending:true, featured:true,
    prices:{story:7500, reel:15000, video:18000, personalad:38000},
    photo:"https://randomuser.me/api/portraits/women/57.jpg",
    avgViews:95000, avgLikes:11000, reach:500000,
    tags:["#lifestyle","#wellness","#vlog"],
    reviews:[{user:"Nykaa",text:"Best cross-platform creator we have worked with.",stars:5},{user:"Mamaearth",text:"Incredible reach on both platforms.",stars:5}]
  },
  // ── Dummy creators — 5 per category ──────────────────
  {
    id:100, name:"Isha Kapoor", handle:"@ishakapoor", platform:"Instagram",
    followers:22000, niche:"Fashion", rating:3.8, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in fashion. Based in Mumbai.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:300, reel:600, video:0, personalad:1320},
    photo:"https://randomuser.me/api/portraits/men/2.jpg",
    avgViews:2200, avgLikes:176, reach:28600,
    tags:["#fashion","#fashion"],
    categories:["fashion"],
    reviews:[]
  },
  {
    id:101, name:"Divya Nair", handle:"@divyanair", platform:"Instagram",
    followers:70000, niche:"Fashion", rating:4.1, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in fashion. Based in Mumbai.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:630, reel:1260, video:0, personalad:2772},
    photo:"https://randomuser.me/api/portraits/women/2.jpg",
    avgViews:9800, avgLikes:784, reach:91000,
    tags:["#fashion","#fashion"],
    categories:["fashion"],
    reviews:[]
  },
  {
    id:102, name:"Sonam Chadha", handle:"@sonamchadha", platform:"Instagram",
    followers:54000, niche:"Fashion", rating:4.4, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in fashion. Based in Mumbai.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:485, reel:971, video:0, personalad:2136},
    photo:"https://randomuser.me/api/portraits/men/3.jpg",
    avgViews:9720, avgLikes:777, reach:70200,
    tags:["#fashion","#fashion"],
    categories:["fashion"],
    reviews:[]
  },
  {
    id:103, name:"Riya Patel", handle:"@riyapatel", platform:"Instagram",
    followers:45000, niche:"Fashion", rating:4.7, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in fashion. Based in Mumbai.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:404, reel:809, video:0, personalad:1779},
    photo:"https://randomuser.me/api/portraits/women/3.jpg",
    avgViews:9900, avgLikes:792, reach:58500,
    tags:["#fashion","#fashion"],
    categories:["fashion"],
    reviews:[]
  },
  {
    id:104, name:"Tanvi Joshi", handle:"@tanvijoshi", platform:"Instagram",
    followers:56000, niche:"Fashion", rating:3.8, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in fashion. Based in Mumbai.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:503, reel:1007, video:0, personalad:2215},
    photo:"https://randomuser.me/api/portraits/men/4.jpg",
    avgViews:14560, avgLikes:1164, reach:72800,
    tags:["#fashion","#fashion"],
    categories:["fashion"],
    reviews:[]
  },
  {
    id:105, name:"Kavya Rao", handle:"@kavyarao", platform:"Instagram",
    followers:80000, niche:"Beauty", rating:4.5, engagement:0,
    city:"Kochi", location:"Kochi",
    bio:"Content creator specialising in beauty. Based in Kochi.",
    price:1440, verified:true, trending:true, featured:false,
    prices:{story:720, reel:1440, video:0, personalad:3168},
    photo:"https://randomuser.me/api/portraits/men/5.jpg",
    avgViews:11200, avgLikes:896, reach:104000,
    tags:["#beauty","#beauty"],
    categories:["beauty"],
    reviews:[]
  },
  {
    id:106, name:"Shruti Menon", handle:"@shrutimenon", platform:"Instagram",
    followers:30000, niche:"Beauty", rating:4.8, engagement:0,
    city:"Kochi", location:"Kochi",
    bio:"Content creator specialising in beauty. Based in Kochi.",
    price:600, verified:true, trending:false, featured:true,
    prices:{story:300, reel:600, video:0, personalad:1320},
    photo:"https://randomuser.me/api/portraits/women/4.jpg",
    avgViews:5400, avgLikes:432, reach:39000,
    tags:["#beauty","#beauty"],
    categories:["beauty"],
    reviews:[]
  },
  {
    id:107, name:"Pallavi Iyer", handle:"@pallaviiyer", platform:"Instagram",
    followers:90000, niche:"Beauty", rating:3.9, engagement:0,
    city:"Kochi", location:"Kochi",
    bio:"Content creator specialising in beauty. Based in Kochi.",
    price:1619, verified:true, trending:false, featured:false,
    prices:{story:809, reel:1619, video:0, personalad:3561},
    photo:"https://randomuser.me/api/portraits/men/6.jpg",
    avgViews:19800, avgLikes:1584, reach:117000,
    tags:["#beauty","#beauty"],
    categories:["beauty"],
    reviews:[]
  },
  {
    id:108, name:"Nisha Verma", handle:"@nishaverma", platform:"Instagram",
    followers:55000, niche:"Beauty", rating:4.2, engagement:0,
    city:"Kochi", location:"Kochi",
    bio:"Content creator specialising in beauty. Based in Kochi.",
    price:989, verified:true, trending:false, featured:false,
    prices:{story:494, reel:989, video:0, personalad:2175},
    photo:"https://randomuser.me/api/portraits/women/5.jpg",
    avgViews:14300, avgLikes:1144, reach:71500,
    tags:["#beauty","#beauty"],
    categories:["beauty"],
    reviews:[]
  },
  {
    id:109, name:"Meghna Pillai", handle:"@meghnapillai", platform:"Instagram",
    followers:80000, niche:"Beauty", rating:4.5, engagement:0,
    city:"Kochi", location:"Kochi",
    bio:"Content creator specialising in beauty. Based in Kochi.",
    price:1440, verified:true, trending:false, featured:false,
    prices:{story:720, reel:1440, video:0, personalad:3168},
    photo:"https://randomuser.me/api/portraits/men/7.jpg",
    avgViews:8000, avgLikes:640, reach:104000,
    tags:["#beauty","#beauty"],
    categories:["beauty"],
    reviews:[]
  },
  {
    id:110, name:"Deepak Sinha", handle:"@deepaksinha", platform:"Instagram",
    followers:22000, niche:"Food", rating:4.0, engagement:0,
    city:"New Delhi", location:"New Delhi",
    bio:"Content creator specialising in food. Based in New Delhi.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:300, reel:600, video:0, personalad:1320},
    photo:"https://randomuser.me/api/portraits/men/8.jpg",
    avgViews:3960, avgLikes:316, reach:28600,
    tags:["#food","#food"],
    categories:["food"],
    reviews:[]
  },
  {
    id:111, name:"Rohan Das", handle:"@rohandas", platform:"Instagram",
    followers:70000, niche:"Food", rating:4.3, engagement:0,
    city:"New Delhi", location:"New Delhi",
    bio:"Content creator specialising in food. Based in New Delhi.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:630, reel:1260, video:0, personalad:2772},
    photo:"https://randomuser.me/api/portraits/women/6.jpg",
    avgViews:15400, avgLikes:1232, reach:91000,
    tags:["#food","#food"],
    categories:["food"],
    reviews:[]
  },
  {
    id:112, name:"Sandeep Bhatt", handle:"@sandeepbhatt", platform:"Instagram",
    followers:54000, niche:"Food", rating:4.6, engagement:0,
    city:"New Delhi", location:"New Delhi",
    bio:"Content creator specialising in food. Based in New Delhi.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:485, reel:971, video:0, personalad:2136},
    photo:"https://randomuser.me/api/portraits/men/9.jpg",
    avgViews:14040, avgLikes:1123, reach:70200,
    tags:["#food","#food"],
    categories:["food"],
    reviews:[]
  },
  {
    id:113, name:"Vikash Yadav", handle:"@vikashyadav", platform:"Instagram",
    followers:45000, niche:"Food", rating:4.9, engagement:0,
    city:"New Delhi", location:"New Delhi",
    bio:"Content creator specialising in food. Based in New Delhi.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:404, reel:809, video:0, personalad:1779},
    photo:"https://randomuser.me/api/portraits/women/7.jpg",
    avgViews:4500, avgLikes:360, reach:58500,
    tags:["#food","#food"],
    categories:["food"],
    reviews:[]
  },
  {
    id:114, name:"Ritesh Nair", handle:"@riteshnair", platform:"Instagram",
    followers:56000, niche:"Food", rating:4.0, engagement:0,
    city:"New Delhi", location:"New Delhi",
    bio:"Content creator specialising in food. Based in New Delhi.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:503, reel:1007, video:0, personalad:2215},
    photo:"https://randomuser.me/api/portraits/men/10.jpg",
    avgViews:7840, avgLikes:627, reach:72800,
    tags:["#food","#food"],
    categories:["food"],
    reviews:[]
  },
  {
    id:115, name:"Karan Mehta", handle:"@karanmehta", platform:"Instagram",
    followers:80000, niche:"Fitness", rating:4.7, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in fitness. Based in Bengaluru.",
    price:1440, verified:true, trending:true, featured:false,
    prices:{story:720, reel:1440, video:0, personalad:3168},
    photo:"https://randomuser.me/api/portraits/men/11.jpg",
    avgViews:17600, avgLikes:1408, reach:104000,
    tags:["#fitness","#fitness"],
    categories:["fitness"],
    reviews:[]
  },
  {
    id:116, name:"Akash Verma", handle:"@akashverma", platform:"Instagram",
    followers:30000, niche:"Fitness", rating:3.8, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in fitness. Based in Bengaluru.",
    price:600, verified:true, trending:false, featured:true,
    prices:{story:300, reel:600, video:0, personalad:1320},
    photo:"https://randomuser.me/api/portraits/women/8.jpg",
    avgViews:7800, avgLikes:624, reach:39000,
    tags:["#fitness","#fitness"],
    categories:["fitness"],
    reviews:[]
  },
  {
    id:117, name:"Raj Thakur", handle:"@rajthakur", platform:"Instagram",
    followers:90000, niche:"Fitness", rating:4.1, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in fitness. Based in Bengaluru.",
    price:1619, verified:true, trending:false, featured:false,
    prices:{story:809, reel:1619, video:0, personalad:3561},
    photo:"https://randomuser.me/api/portraits/men/12.jpg",
    avgViews:9000, avgLikes:720, reach:117000,
    tags:["#fitness","#fitness"],
    categories:["fitness"],
    reviews:[]
  },
  {
    id:118, name:"Nikhil Gupta", handle:"@nikhilgupta", platform:"Instagram",
    followers:55000, niche:"Fitness", rating:4.4, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in fitness. Based in Bengaluru.",
    price:989, verified:true, trending:false, featured:false,
    prices:{story:494, reel:989, video:0, personalad:2175},
    photo:"https://randomuser.me/api/portraits/women/9.jpg",
    avgViews:7700, avgLikes:616, reach:71500,
    tags:["#fitness","#fitness"],
    categories:["fitness"],
    reviews:[]
  },
  {
    id:119, name:"Amit Singh", handle:"@amitsingh", platform:"Instagram",
    followers:80000, niche:"Fitness", rating:4.7, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in fitness. Based in Bengaluru.",
    price:1440, verified:true, trending:false, featured:false,
    prices:{story:720, reel:1440, video:0, personalad:3168},
    photo:"https://randomuser.me/api/portraits/men/13.jpg",
    avgViews:14400, avgLikes:1152, reach:104000,
    tags:["#fitness","#fitness"],
    categories:["fitness"],
    reviews:[]
  },
  {
    id:120, name:"Siddharth Nair", handle:"@siddharthnair", platform:"YouTube",
    followers:22000, ytSubscribers:11000, niche:"Tech", rating:4.2, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in tech. Based in Bengaluru.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:0, reel:0, video:600, personalad:1200},
    photo:"https://randomuser.me/api/portraits/men/14.jpg",
    avgViews:5720, avgLikes:457, reach:28600,
    tags:["#tech","#tech"],
    categories:["tech"],
    reviews:[]
  },
  {
    id:121, name:"Aditya Kumar", handle:"@adityakumar", platform:"YouTube",
    followers:70000, ytSubscribers:35000, niche:"Tech", rating:4.5, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in tech. Based in Bengaluru.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:0, reel:0, video:1260, personalad:2520},
    photo:"https://randomuser.me/api/portraits/women/10.jpg",
    avgViews:7000, avgLikes:560, reach:91000,
    tags:["#tech","#tech"],
    categories:["tech"],
    reviews:[]
  },
  {
    id:122, name:"Harish Reddy", handle:"@harishreddy", platform:"YouTube",
    followers:54000, ytSubscribers:27000, niche:"Tech", rating:4.8, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in tech. Based in Bengaluru.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:971, personalad:1942},
    photo:"https://randomuser.me/api/portraits/men/15.jpg",
    avgViews:7560, avgLikes:604, reach:70200,
    tags:["#tech","#tech"],
    categories:["tech"],
    reviews:[]
  },
  {
    id:123, name:"Manish Tiwari", handle:"@manishtiwari", platform:"YouTube",
    followers:45000, ytSubscribers:22500, niche:"Tech", rating:3.9, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in tech. Based in Bengaluru.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:809, personalad:1618},
    photo:"https://randomuser.me/api/portraits/women/11.jpg",
    avgViews:8100, avgLikes:648, reach:58500,
    tags:["#tech","#tech"],
    categories:["tech"],
    reviews:[]
  },
  {
    id:124, name:"Gaurav Shah", handle:"@gauravshah", platform:"YouTube",
    followers:56000, ytSubscribers:28000, niche:"Tech", rating:4.2, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in tech. Based in Bengaluru.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1007, personalad:2014},
    photo:"https://randomuser.me/api/portraits/men/16.jpg",
    avgViews:12320, avgLikes:985, reach:72800,
    tags:["#tech","#tech"],
    categories:["tech"],
    reviews:[]
  },
  {
    id:125, name:"Varun Soni", handle:"@varunsoni", platform:"YouTube",
    followers:80000, ytSubscribers:40000, niche:"Gaming", rating:4.9, engagement:0,
    city:"Pune", location:"Pune",
    bio:"Content creator specialising in gaming. Based in Pune.",
    price:1440, verified:true, trending:true, featured:false,
    prices:{story:0, reel:0, video:1440, personalad:2880},
    photo:"https://randomuser.me/api/portraits/men/17.jpg",
    avgViews:8000, avgLikes:640, reach:104000,
    tags:["#gaming","#gaming"],
    categories:["gaming"],
    reviews:[]
  },
  {
    id:126, name:"Pranav Jain", handle:"@pranavjain", platform:"YouTube",
    followers:30000, ytSubscribers:15000, niche:"Gaming", rating:4.0, engagement:0,
    city:"Pune", location:"Pune",
    bio:"Content creator specialising in gaming. Based in Pune.",
    price:600, verified:true, trending:false, featured:true,
    prices:{story:0, reel:0, video:600, personalad:1200},
    photo:"https://randomuser.me/api/portraits/women/12.jpg",
    avgViews:4200, avgLikes:336, reach:39000,
    tags:["#gaming","#gaming"],
    categories:["gaming"],
    reviews:[]
  },
  {
    id:127, name:"Kunal Seth", handle:"@kunalseth", platform:"YouTube",
    followers:90000, ytSubscribers:45000, niche:"Gaming", rating:4.3, engagement:0,
    city:"Pune", location:"Pune",
    bio:"Content creator specialising in gaming. Based in Pune.",
    price:1619, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1619, personalad:3238},
    photo:"https://randomuser.me/api/portraits/men/18.jpg",
    avgViews:16200, avgLikes:1296, reach:117000,
    tags:["#gaming","#gaming"],
    categories:["gaming"],
    reviews:[]
  },
  {
    id:128, name:"Aryan Bose", handle:"@aryanbose", platform:"YouTube",
    followers:55000, ytSubscribers:27500, niche:"Gaming", rating:4.6, engagement:0,
    city:"Pune", location:"Pune",
    bio:"Content creator specialising in gaming. Based in Pune.",
    price:989, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:989, personalad:1978},
    photo:"https://randomuser.me/api/portraits/women/13.jpg",
    avgViews:12100, avgLikes:968, reach:71500,
    tags:["#gaming","#gaming"],
    categories:["gaming"],
    reviews:[]
  },
  {
    id:129, name:"Tarun Mishra", handle:"@tarunmishra", platform:"YouTube",
    followers:80000, ytSubscribers:40000, niche:"Gaming", rating:4.9, engagement:0,
    city:"Pune", location:"Pune",
    bio:"Content creator specialising in gaming. Based in Pune.",
    price:1440, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1440, personalad:2880},
    photo:"https://randomuser.me/api/portraits/men/19.jpg",
    avgViews:20800, avgLikes:1664, reach:104000,
    tags:["#gaming","#gaming"],
    categories:["gaming"],
    reviews:[]
  },
  {
    id:130, name:"Prachi Joshi", handle:"@prachijoshi", platform:"Instagram",
    followers:22000, niche:"Travel", rating:4.4, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in travel. Based in Jaipur.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:300, reel:600, video:0, personalad:1320},
    photo:"https://randomuser.me/api/portraits/men/20.jpg",
    avgViews:3080, avgLikes:246, reach:28600,
    tags:["#travel","#travel"],
    categories:["travel"],
    reviews:[]
  },
  {
    id:131, name:"Ishaan Roy", handle:"@ishaanroy", platform:"Instagram",
    followers:70000, niche:"Travel", rating:4.7, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in travel. Based in Jaipur.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:630, reel:1260, video:0, personalad:2772},
    photo:"https://randomuser.me/api/portraits/women/14.jpg",
    avgViews:12600, avgLikes:1008, reach:91000,
    tags:["#travel","#travel"],
    categories:["travel"],
    reviews:[]
  },
  {
    id:132, name:"Ritu Dubey", handle:"@ritudubey", platform:"Instagram",
    followers:54000, niche:"Travel", rating:3.8, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in travel. Based in Jaipur.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:485, reel:971, video:0, personalad:2136},
    photo:"https://randomuser.me/api/portraits/men/21.jpg",
    avgViews:11880, avgLikes:950, reach:70200,
    tags:["#travel","#travel"],
    categories:["travel"],
    reviews:[]
  },
  {
    id:133, name:"Kavita Pandey", handle:"@kavitapandey", platform:"Instagram",
    followers:45000, niche:"Travel", rating:4.1, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in travel. Based in Jaipur.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:404, reel:809, video:0, personalad:1779},
    photo:"https://randomuser.me/api/portraits/women/15.jpg",
    avgViews:11700, avgLikes:936, reach:58500,
    tags:["#travel","#travel"],
    categories:["travel"],
    reviews:[]
  },
  {
    id:134, name:"Sunil Ghosh", handle:"@sunilghosh", platform:"Instagram",
    followers:56000, niche:"Travel", rating:4.4, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in travel. Based in Jaipur.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:503, reel:1007, video:0, personalad:2215},
    photo:"https://randomuser.me/api/portraits/men/22.jpg",
    avgViews:5600, avgLikes:448, reach:72800,
    tags:["#travel","#travel"],
    categories:["travel"],
    reviews:[]
  },
  {
    id:135, name:"Mukesh Bajaj", handle:"@mukeshbajaj", platform:"YouTube",
    followers:80000, ytSubscribers:40000, niche:"Finance", rating:3.9, engagement:0,
    city:"Hyderabad", location:"Hyderabad",
    bio:"Content creator specialising in finance. Based in Hyderabad.",
    price:1440, verified:true, trending:true, featured:false,
    prices:{story:0, reel:0, video:1440, personalad:2880},
    photo:"https://randomuser.me/api/portraits/men/23.jpg",
    avgViews:14400, avgLikes:1152, reach:104000,
    tags:["#finance","#finance"],
    categories:["finance"],
    reviews:[]
  },
  {
    id:136, name:"Suresh Bansal", handle:"@sureshbansal", platform:"YouTube",
    followers:30000, ytSubscribers:15000, niche:"Finance", rating:4.2, engagement:0,
    city:"Hyderabad", location:"Hyderabad",
    bio:"Content creator specialising in finance. Based in Hyderabad.",
    price:600, verified:true, trending:false, featured:true,
    prices:{story:0, reel:0, video:600, personalad:1200},
    photo:"https://randomuser.me/api/portraits/women/16.jpg",
    avgViews:6600, avgLikes:528, reach:39000,
    tags:["#finance","#finance"],
    categories:["finance"],
    reviews:[]
  },
  {
    id:137, name:"Dinesh Aggarwal", handle:"@dineshaggarwa", platform:"YouTube",
    followers:90000, ytSubscribers:45000, niche:"Finance", rating:4.5, engagement:0,
    city:"Hyderabad", location:"Hyderabad",
    bio:"Content creator specialising in finance. Based in Hyderabad.",
    price:1619, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1619, personalad:3238},
    photo:"https://randomuser.me/api/portraits/men/24.jpg",
    avgViews:23400, avgLikes:1872, reach:117000,
    tags:["#finance","#finance"],
    categories:["finance"],
    reviews:[]
  },
  {
    id:138, name:"Hitesh Shah", handle:"@hiteshshah", platform:"YouTube",
    followers:55000, ytSubscribers:27500, niche:"Finance", rating:4.8, engagement:0,
    city:"Hyderabad", location:"Hyderabad",
    bio:"Content creator specialising in finance. Based in Hyderabad.",
    price:989, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:989, personalad:1978},
    photo:"https://randomuser.me/api/portraits/women/17.jpg",
    avgViews:5500, avgLikes:440, reach:71500,
    tags:["#finance","#finance"],
    categories:["finance"],
    reviews:[]
  },
  {
    id:139, name:"Raj Nair", handle:"@rajnair", platform:"YouTube",
    followers:80000, ytSubscribers:40000, niche:"Finance", rating:3.9, engagement:0,
    city:"Hyderabad", location:"Hyderabad",
    bio:"Content creator specialising in finance. Based in Hyderabad.",
    price:1440, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1440, personalad:2880},
    photo:"https://randomuser.me/api/portraits/men/25.jpg",
    avgViews:11200, avgLikes:896, reach:104000,
    tags:["#finance","#finance"],
    categories:["finance"],
    reviews:[]
  },
  {
    id:140, name:"Pooja Mehta", handle:"@poojamehta", platform:"Both",
    followers:22000, ytSubscribers:11000, niche:"Lifestyle", rating:4.6, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in lifestyle. Based in Mumbai.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:200, reel:300, video:600, personalad:1080},
    photo:"https://randomuser.me/api/portraits/men/26.jpg",
    avgViews:4840, avgLikes:387, reach:28600,
    tags:["#lifestyle","#lifestyle"],
    categories:["lifestyle"],
    reviews:[]
  },
  {
    id:141, name:"Sonal Kapoor", handle:"@sonalkapoor", platform:"Both",
    followers:70000, ytSubscribers:35000, niche:"Lifestyle", rating:4.9, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in lifestyle. Based in Mumbai.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:420, reel:630, video:1260, personalad:2268},
    photo:"https://randomuser.me/api/portraits/women/18.jpg",
    avgViews:18200, avgLikes:1456, reach:91000,
    tags:["#lifestyle","#lifestyle"],
    categories:["lifestyle"],
    reviews:[]
  },
  {
    id:142, name:"Bhavna Desai", handle:"@bhavnadesai", platform:"Both",
    followers:54000, ytSubscribers:27000, niche:"Lifestyle", rating:4.0, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in lifestyle. Based in Mumbai.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:323, reel:485, video:971, personalad:1747},
    photo:"https://randomuser.me/api/portraits/men/27.jpg",
    avgViews:5400, avgLikes:432, reach:70200,
    tags:["#lifestyle","#lifestyle"],
    categories:["lifestyle"],
    reviews:[]
  },
  {
    id:143, name:"Nidhi Patel", handle:"@nidhipatel", platform:"Both",
    followers:45000, ytSubscribers:22500, niche:"Lifestyle", rating:4.3, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in lifestyle. Based in Mumbai.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:269, reel:404, video:809, personalad:1456},
    photo:"https://randomuser.me/api/portraits/women/19.jpg",
    avgViews:6300, avgLikes:504, reach:58500,
    tags:["#lifestyle","#lifestyle"],
    categories:["lifestyle"],
    reviews:[]
  },
  {
    id:144, name:"Monika Sethi", handle:"@monikasethi", platform:"Both",
    followers:56000, ytSubscribers:28000, niche:"Lifestyle", rating:4.6, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in lifestyle. Based in Mumbai.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:335, reel:503, video:1007, personalad:1812},
    photo:"https://randomuser.me/api/portraits/men/28.jpg",
    avgViews:10080, avgLikes:806, reach:72800,
    tags:["#lifestyle","#lifestyle"],
    categories:["lifestyle"],
    reviews:[]
  },
  {
    id:145, name:"Rahul Sharma", handle:"@rahulsharma", platform:"YouTube",
    followers:80000, ytSubscribers:40000, niche:"Music", rating:4.1, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in music. Based in Mumbai.",
    price:1440, verified:true, trending:true, featured:false,
    prices:{story:0, reel:0, video:1440, personalad:2880},
    photo:"https://randomuser.me/api/portraits/men/29.jpg",
    avgViews:20800, avgLikes:1664, reach:104000,
    tags:["#music","#music"],
    categories:["music"],
    reviews:[]
  },
  {
    id:146, name:"Dev Mathur", handle:"@devmathur", platform:"YouTube",
    followers:30000, ytSubscribers:15000, niche:"Music", rating:4.4, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in music. Based in Mumbai.",
    price:600, verified:true, trending:false, featured:true,
    prices:{story:0, reel:0, video:600, personalad:1200},
    photo:"https://randomuser.me/api/portraits/women/20.jpg",
    avgViews:3000, avgLikes:240, reach:39000,
    tags:["#music","#music"],
    categories:["music"],
    reviews:[]
  },
  {
    id:147, name:"Akash Sinha", handle:"@akashsinha", platform:"YouTube",
    followers:90000, ytSubscribers:45000, niche:"Music", rating:4.7, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in music. Based in Mumbai.",
    price:1619, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1619, personalad:3238},
    photo:"https://randomuser.me/api/portraits/men/30.jpg",
    avgViews:12600, avgLikes:1008, reach:117000,
    tags:["#music","#music"],
    categories:["music"],
    reviews:[]
  },
  {
    id:148, name:"Rohan Awasthi", handle:"@rohanawasthi", platform:"YouTube",
    followers:55000, ytSubscribers:27500, niche:"Music", rating:3.8, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in music. Based in Mumbai.",
    price:989, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:989, personalad:1978},
    photo:"https://randomuser.me/api/portraits/women/21.jpg",
    avgViews:9900, avgLikes:792, reach:71500,
    tags:["#music","#music"],
    categories:["music"],
    reviews:[]
  },
  {
    id:149, name:"Sahil Khan", handle:"@sahilkhan", platform:"YouTube",
    followers:80000, ytSubscribers:40000, niche:"Music", rating:4.1, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in music. Based in Mumbai.",
    price:1440, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1440, personalad:2880},
    photo:"https://randomuser.me/api/portraits/men/31.jpg",
    avgViews:17600, avgLikes:1408, reach:104000,
    tags:["#music","#music"],
    categories:["music"],
    reviews:[]
  },
  {
    id:150, name:"Richa Verma", handle:"@richaverma", platform:"YouTube",
    followers:22000, ytSubscribers:11000, niche:"Education", rating:4.8, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in education. Based in Bengaluru.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:0, reel:0, video:600, personalad:1200},
    photo:"https://randomuser.me/api/portraits/men/32.jpg",
    avgViews:2200, avgLikes:176, reach:28600,
    tags:["#education","#education"],
    categories:["education"],
    reviews:[]
  },
  {
    id:151, name:"Priya Nair", handle:"@priyanair", platform:"YouTube",
    followers:70000, ytSubscribers:35000, niche:"Education", rating:3.9, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in education. Based in Bengaluru.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:0, reel:0, video:1260, personalad:2520},
    photo:"https://randomuser.me/api/portraits/women/22.jpg",
    avgViews:9800, avgLikes:784, reach:91000,
    tags:["#education","#education"],
    categories:["education"],
    reviews:[]
  },
  {
    id:152, name:"Swati Pandey", handle:"@swatipandey", platform:"YouTube",
    followers:54000, ytSubscribers:27000, niche:"Education", rating:4.2, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in education. Based in Bengaluru.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:971, personalad:1942},
    photo:"https://randomuser.me/api/portraits/men/33.jpg",
    avgViews:9720, avgLikes:777, reach:70200,
    tags:["#education","#education"],
    categories:["education"],
    reviews:[]
  },
  {
    id:153, name:"Neha Joshi", handle:"@nehajoshi", platform:"YouTube",
    followers:45000, ytSubscribers:22500, niche:"Education", rating:4.5, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in education. Based in Bengaluru.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:809, personalad:1618},
    photo:"https://randomuser.me/api/portraits/women/23.jpg",
    avgViews:9900, avgLikes:792, reach:58500,
    tags:["#education","#education"],
    categories:["education"],
    reviews:[]
  },
  {
    id:154, name:"Asha Reddy", handle:"@ashareddy", platform:"YouTube",
    followers:56000, ytSubscribers:28000, niche:"Education", rating:4.8, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in education. Based in Bengaluru.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1007, personalad:2014},
    photo:"https://randomuser.me/api/portraits/men/34.jpg",
    avgViews:14560, avgLikes:1164, reach:72800,
    tags:["#education","#education"],
    categories:["education"],
    reviews:[]
  },
  {
    id:155, name:"Dr Seema Rao", handle:"@drseemarao", platform:"Instagram",
    followers:80000, niche:"Health", rating:4.3, engagement:0,
    city:"Chennai", location:"Chennai",
    bio:"Content creator specialising in health. Based in Chennai.",
    price:1440, verified:true, trending:true, featured:false,
    prices:{story:720, reel:1440, video:0, personalad:3168},
    photo:"https://randomuser.me/api/portraits/men/35.jpg",
    avgViews:11200, avgLikes:896, reach:104000,
    tags:["#health","#health"],
    categories:["health"],
    reviews:[]
  },
  {
    id:156, name:"Kiran Patel", handle:"@kiranpatel", platform:"Instagram",
    followers:30000, niche:"Health", rating:4.6, engagement:0,
    city:"Chennai", location:"Chennai",
    bio:"Content creator specialising in health. Based in Chennai.",
    price:600, verified:true, trending:false, featured:true,
    prices:{story:300, reel:600, video:0, personalad:1320},
    photo:"https://randomuser.me/api/portraits/women/24.jpg",
    avgViews:5400, avgLikes:432, reach:39000,
    tags:["#health","#health"],
    categories:["health"],
    reviews:[]
  },
  {
    id:157, name:"Sunita Bhat", handle:"@sunitabhat", platform:"Instagram",
    followers:90000, niche:"Health", rating:4.9, engagement:0,
    city:"Chennai", location:"Chennai",
    bio:"Content creator specialising in health. Based in Chennai.",
    price:1619, verified:true, trending:false, featured:false,
    prices:{story:809, reel:1619, video:0, personalad:3561},
    photo:"https://randomuser.me/api/portraits/men/36.jpg",
    avgViews:19800, avgLikes:1584, reach:117000,
    tags:["#health","#health"],
    categories:["health"],
    reviews:[]
  },
  {
    id:158, name:"Renu Sharma", handle:"@renusharma", platform:"Instagram",
    followers:55000, niche:"Health", rating:4.0, engagement:0,
    city:"Chennai", location:"Chennai",
    bio:"Content creator specialising in health. Based in Chennai.",
    price:989, verified:true, trending:false, featured:false,
    prices:{story:494, reel:989, video:0, personalad:2175},
    photo:"https://randomuser.me/api/portraits/women/25.jpg",
    avgViews:14300, avgLikes:1144, reach:71500,
    tags:["#health","#health"],
    categories:["health"],
    reviews:[]
  },
  {
    id:159, name:"Alka Singh", handle:"@alkasingh", platform:"Instagram",
    followers:80000, niche:"Health", rating:4.3, engagement:0,
    city:"Chennai", location:"Chennai",
    bio:"Content creator specialising in health. Based in Chennai.",
    price:1440, verified:true, trending:false, featured:false,
    prices:{story:720, reel:1440, video:0, personalad:3168},
    photo:"https://randomuser.me/api/portraits/men/37.jpg",
    avgViews:8000, avgLikes:640, reach:104000,
    tags:["#health","#health"],
    categories:["health"],
    reviews:[]
  },
  {
    id:160, name:"Vikram Tomar", handle:"@vikramtomar", platform:"YouTube",
    followers:22000, ytSubscribers:11000, niche:"Automobile", rating:3.8, engagement:0,
    city:"Pune", location:"Pune",
    bio:"Content creator specialising in automobile. Based in Pune.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:0, reel:0, video:600, personalad:1200},
    photo:"https://randomuser.me/api/portraits/men/38.jpg",
    avgViews:3960, avgLikes:316, reach:28600,
    tags:["#automobile","#automobile"],
    categories:["automobile"],
    reviews:[]
  },
  {
    id:161, name:"Suraj Rawat", handle:"@surajrawat", platform:"YouTube",
    followers:70000, ytSubscribers:35000, niche:"Automobile", rating:4.1, engagement:0,
    city:"Pune", location:"Pune",
    bio:"Content creator specialising in automobile. Based in Pune.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:0, reel:0, video:1260, personalad:2520},
    photo:"https://randomuser.me/api/portraits/women/26.jpg",
    avgViews:15400, avgLikes:1232, reach:91000,
    tags:["#automobile","#automobile"],
    categories:["automobile"],
    reviews:[]
  },
  {
    id:162, name:"Mahesh Patil", handle:"@maheshpatil", platform:"YouTube",
    followers:54000, ytSubscribers:27000, niche:"Automobile", rating:4.4, engagement:0,
    city:"Pune", location:"Pune",
    bio:"Content creator specialising in automobile. Based in Pune.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:971, personalad:1942},
    photo:"https://randomuser.me/api/portraits/men/39.jpg",
    avgViews:14040, avgLikes:1123, reach:70200,
    tags:["#automobile","#automobile"],
    categories:["automobile"],
    reviews:[]
  },
  {
    id:163, name:"Deepak Rawat", handle:"@deepakrawat", platform:"YouTube",
    followers:45000, ytSubscribers:22500, niche:"Automobile", rating:4.7, engagement:0,
    city:"Pune", location:"Pune",
    bio:"Content creator specialising in automobile. Based in Pune.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:809, personalad:1618},
    photo:"https://randomuser.me/api/portraits/women/27.jpg",
    avgViews:4500, avgLikes:360, reach:58500,
    tags:["#automobile","#automobile"],
    categories:["automobile"],
    reviews:[]
  },
  {
    id:164, name:"Ravi Sinha", handle:"@ravisinha", platform:"YouTube",
    followers:56000, ytSubscribers:28000, niche:"Automobile", rating:3.8, engagement:0,
    city:"Pune", location:"Pune",
    bio:"Content creator specialising in automobile. Based in Pune.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1007, personalad:2014},
    photo:"https://randomuser.me/api/portraits/men/40.jpg",
    avgViews:7840, avgLikes:627, reach:72800,
    tags:["#automobile","#automobile"],
    categories:["automobile"],
    reviews:[]
  },
  {
    id:165, name:"Ajay Kapoor", handle:"@ajaykapoor", platform:"YouTube",
    followers:80000, ytSubscribers:40000, niche:"Realestate", rating:4.5, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in realestate. Based in Mumbai.",
    price:1440, verified:true, trending:true, featured:false,
    prices:{story:0, reel:0, video:1440, personalad:2880},
    photo:"https://randomuser.me/api/portraits/men/41.jpg",
    avgViews:17600, avgLikes:1408, reach:104000,
    tags:["#realestate","#realestate"],
    categories:["realestate"],
    reviews:[]
  },
  {
    id:166, name:"Sameer Khan", handle:"@sameerkhan", platform:"YouTube",
    followers:30000, ytSubscribers:15000, niche:"Realestate", rating:4.8, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in realestate. Based in Mumbai.",
    price:600, verified:true, trending:false, featured:true,
    prices:{story:0, reel:0, video:600, personalad:1200},
    photo:"https://randomuser.me/api/portraits/women/28.jpg",
    avgViews:7800, avgLikes:624, reach:39000,
    tags:["#realestate","#realestate"],
    categories:["realestate"],
    reviews:[]
  },
  {
    id:167, name:"Rohit Gupta", handle:"@rohitgupta", platform:"YouTube",
    followers:90000, ytSubscribers:45000, niche:"Realestate", rating:3.9, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in realestate. Based in Mumbai.",
    price:1619, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1619, personalad:3238},
    photo:"https://randomuser.me/api/portraits/men/42.jpg",
    avgViews:9000, avgLikes:720, reach:117000,
    tags:["#realestate","#realestate"],
    categories:["realestate"],
    reviews:[]
  },
  {
    id:168, name:"Deepika Sharma", handle:"@deepikasharma", platform:"YouTube",
    followers:55000, ytSubscribers:27500, niche:"Realestate", rating:4.2, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in realestate. Based in Mumbai.",
    price:989, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:989, personalad:1978},
    photo:"https://randomuser.me/api/portraits/women/29.jpg",
    avgViews:7700, avgLikes:616, reach:71500,
    tags:["#realestate","#realestate"],
    categories:["realestate"],
    reviews:[]
  },
  {
    id:169, name:"Anil Mehta", handle:"@anilmehta", platform:"YouTube",
    followers:80000, ytSubscribers:40000, niche:"Realestate", rating:4.5, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in realestate. Based in Mumbai.",
    price:1440, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1440, personalad:2880},
    photo:"https://randomuser.me/api/portraits/men/43.jpg",
    avgViews:14400, avgLikes:1152, reach:104000,
    tags:["#realestate","#realestate"],
    categories:["realestate"],
    reviews:[]
  },
  {
    id:170, name:"Divya Joshi", handle:"@divyajoshi", platform:"Instagram",
    followers:22000, niche:"Ecommerce", rating:4.0, engagement:0,
    city:"Delhi", location:"Delhi",
    bio:"Content creator specialising in ecommerce. Based in Delhi.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:300, reel:600, video:0, personalad:1320},
    photo:"https://randomuser.me/api/portraits/men/44.jpg",
    avgViews:5720, avgLikes:457, reach:28600,
    tags:["#ecommerce","#ecommerce"],
    categories:["ecommerce"],
    reviews:[]
  },
  {
    id:171, name:"Smita Rao", handle:"@smitarao", platform:"Instagram",
    followers:70000, niche:"Ecommerce", rating:4.3, engagement:0,
    city:"Delhi", location:"Delhi",
    bio:"Content creator specialising in ecommerce. Based in Delhi.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:630, reel:1260, video:0, personalad:2772},
    photo:"https://randomuser.me/api/portraits/women/30.jpg",
    avgViews:7000, avgLikes:560, reach:91000,
    tags:["#ecommerce","#ecommerce"],
    categories:["ecommerce"],
    reviews:[]
  },
  {
    id:172, name:"Kavya Sharma", handle:"@kavyasharma", platform:"Instagram",
    followers:54000, niche:"Ecommerce", rating:4.6, engagement:0,
    city:"Delhi", location:"Delhi",
    bio:"Content creator specialising in ecommerce. Based in Delhi.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:485, reel:971, video:0, personalad:2136},
    photo:"https://randomuser.me/api/portraits/men/45.jpg",
    avgViews:7560, avgLikes:604, reach:70200,
    tags:["#ecommerce","#ecommerce"],
    categories:["ecommerce"],
    reviews:[]
  },
  {
    id:173, name:"Neeta Patel", handle:"@neetapatel", platform:"Instagram",
    followers:45000, niche:"Ecommerce", rating:4.9, engagement:0,
    city:"Delhi", location:"Delhi",
    bio:"Content creator specialising in ecommerce. Based in Delhi.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:404, reel:809, video:0, personalad:1779},
    photo:"https://randomuser.me/api/portraits/women/31.jpg",
    avgViews:8100, avgLikes:648, reach:58500,
    tags:["#ecommerce","#ecommerce"],
    categories:["ecommerce"],
    reviews:[]
  },
  {
    id:174, name:"Rekha Nair", handle:"@rekhanair", platform:"Instagram",
    followers:56000, niche:"Ecommerce", rating:4.0, engagement:0,
    city:"Delhi", location:"Delhi",
    bio:"Content creator specialising in ecommerce. Based in Delhi.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:503, reel:1007, video:0, personalad:2215},
    photo:"https://randomuser.me/api/portraits/men/46.jpg",
    avgViews:12320, avgLikes:985, reach:72800,
    tags:["#ecommerce","#ecommerce"],
    categories:["ecommerce"],
    reviews:[]
  },
  {
    id:175, name:"Sunita Agarwal", handle:"@sunitaagarwal", platform:"Instagram",
    followers:80000, niche:"Jewellery", rating:4.7, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in jewellery. Based in Jaipur.",
    price:1440, verified:true, trending:true, featured:false,
    prices:{story:720, reel:1440, video:0, personalad:3168},
    photo:"https://randomuser.me/api/portraits/men/47.jpg",
    avgViews:8000, avgLikes:640, reach:104000,
    tags:["#jewellery","#jewellery"],
    categories:["jewellery"],
    reviews:[]
  },
  {
    id:176, name:"Shweta Jain", handle:"@shwetajain", platform:"Instagram",
    followers:30000, niche:"Jewellery", rating:3.8, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in jewellery. Based in Jaipur.",
    price:600, verified:true, trending:false, featured:true,
    prices:{story:300, reel:600, video:0, personalad:1320},
    photo:"https://randomuser.me/api/portraits/women/32.jpg",
    avgViews:4200, avgLikes:336, reach:39000,
    tags:["#jewellery","#jewellery"],
    categories:["jewellery"],
    reviews:[]
  },
  {
    id:177, name:"Meena Rao", handle:"@meenarao", platform:"Instagram",
    followers:90000, niche:"Jewellery", rating:4.1, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in jewellery. Based in Jaipur.",
    price:1619, verified:true, trending:false, featured:false,
    prices:{story:809, reel:1619, video:0, personalad:3561},
    photo:"https://randomuser.me/api/portraits/men/48.jpg",
    avgViews:16200, avgLikes:1296, reach:117000,
    tags:["#jewellery","#jewellery"],
    categories:["jewellery"],
    reviews:[]
  },
  {
    id:178, name:"Archana Iyer", handle:"@archanaiyer", platform:"Instagram",
    followers:55000, niche:"Jewellery", rating:4.4, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in jewellery. Based in Jaipur.",
    price:989, verified:true, trending:false, featured:false,
    prices:{story:494, reel:989, video:0, personalad:2175},
    photo:"https://randomuser.me/api/portraits/women/33.jpg",
    avgViews:12100, avgLikes:968, reach:71500,
    tags:["#jewellery","#jewellery"],
    categories:["jewellery"],
    reviews:[]
  },
  {
    id:179, name:"Lalita Singh", handle:"@lalitasingh", platform:"Instagram",
    followers:80000, niche:"Jewellery", rating:4.7, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in jewellery. Based in Jaipur.",
    price:1440, verified:true, trending:false, featured:false,
    prices:{story:720, reel:1440, video:0, personalad:3168},
    photo:"https://randomuser.me/api/portraits/men/49.jpg",
    avgViews:20800, avgLikes:1664, reach:104000,
    tags:["#jewellery","#jewellery"],
    categories:["jewellery"],
    reviews:[]
  },
  {
    id:180, name:"Priti Sharma", handle:"@pritisharma", platform:"Instagram",
    followers:22000, niche:"Kids", rating:4.2, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in kids. Based in Mumbai.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:300, reel:600, video:0, personalad:1320},
    photo:"https://randomuser.me/api/portraits/men/50.jpg",
    avgViews:3080, avgLikes:246, reach:28600,
    tags:["#kids","#kids"],
    categories:["kids"],
    reviews:[]
  },
  {
    id:181, name:"Anita Joshi", handle:"@anitajoshi", platform:"Instagram",
    followers:70000, niche:"Kids", rating:4.5, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in kids. Based in Mumbai.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:630, reel:1260, video:0, personalad:2772},
    photo:"https://randomuser.me/api/portraits/women/34.jpg",
    avgViews:12600, avgLikes:1008, reach:91000,
    tags:["#kids","#kids"],
    categories:["kids"],
    reviews:[]
  },
  {
    id:182, name:"Meenakshi Rao", handle:"@meenakshirao", platform:"Instagram",
    followers:54000, niche:"Kids", rating:4.8, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in kids. Based in Mumbai.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:485, reel:971, video:0, personalad:2136},
    photo:"https://randomuser.me/api/portraits/men/51.jpg",
    avgViews:11880, avgLikes:950, reach:70200,
    tags:["#kids","#kids"],
    categories:["kids"],
    reviews:[]
  },
  {
    id:183, name:"Jyoti Patel", handle:"@jyotipatel", platform:"Instagram",
    followers:45000, niche:"Kids", rating:3.9, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in kids. Based in Mumbai.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:404, reel:809, video:0, personalad:1779},
    photo:"https://randomuser.me/api/portraits/women/35.jpg",
    avgViews:11700, avgLikes:936, reach:58500,
    tags:["#kids","#kids"],
    categories:["kids"],
    reviews:[]
  },
  {
    id:184, name:"Kavita Nair", handle:"@kavitanair", platform:"Instagram",
    followers:56000, niche:"Kids", rating:4.2, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in kids. Based in Mumbai.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:503, reel:1007, video:0, personalad:2215},
    photo:"https://randomuser.me/api/portraits/men/52.jpg",
    avgViews:5600, avgLikes:448, reach:72800,
    tags:["#kids","#kids"],
    categories:["kids"],
    reviews:[]
  },
  {
    id:185, name:"Arun Kumar", handle:"@arunkumar", platform:"YouTube",
    followers:80000, ytSubscribers:40000, niche:"Sports", rating:4.9, engagement:0,
    city:"Delhi", location:"Delhi",
    bio:"Content creator specialising in sports. Based in Delhi.",
    price:1440, verified:true, trending:true, featured:false,
    prices:{story:0, reel:0, video:1440, personalad:2880},
    photo:"https://randomuser.me/api/portraits/men/53.jpg",
    avgViews:14400, avgLikes:1152, reach:104000,
    tags:["#sports","#sports"],
    categories:["sports"],
    reviews:[]
  },
  {
    id:186, name:"Sanjay Yadav", handle:"@sanjayyadav", platform:"YouTube",
    followers:30000, ytSubscribers:15000, niche:"Sports", rating:4.0, engagement:0,
    city:"Delhi", location:"Delhi",
    bio:"Content creator specialising in sports. Based in Delhi.",
    price:600, verified:true, trending:false, featured:true,
    prices:{story:0, reel:0, video:600, personalad:1200},
    photo:"https://randomuser.me/api/portraits/women/36.jpg",
    avgViews:6600, avgLikes:528, reach:39000,
    tags:["#sports","#sports"],
    categories:["sports"],
    reviews:[]
  },
  {
    id:187, name:"Ramesh Bose", handle:"@rameshbose", platform:"YouTube",
    followers:90000, ytSubscribers:45000, niche:"Sports", rating:4.3, engagement:0,
    city:"Delhi", location:"Delhi",
    bio:"Content creator specialising in sports. Based in Delhi.",
    price:1619, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1619, personalad:3238},
    photo:"https://randomuser.me/api/portraits/men/54.jpg",
    avgViews:23400, avgLikes:1872, reach:117000,
    tags:["#sports","#sports"],
    categories:["sports"],
    reviews:[]
  },
  {
    id:188, name:"Ajit Rathore", handle:"@ajitrathore", platform:"YouTube",
    followers:55000, ytSubscribers:27500, niche:"Sports", rating:4.6, engagement:0,
    city:"Delhi", location:"Delhi",
    bio:"Content creator specialising in sports. Based in Delhi.",
    price:989, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:989, personalad:1978},
    photo:"https://randomuser.me/api/portraits/women/37.jpg",
    avgViews:5500, avgLikes:440, reach:71500,
    tags:["#sports","#sports"],
    categories:["sports"],
    reviews:[]
  },
  {
    id:189, name:"Manish Pandey", handle:"@manishpandey", platform:"YouTube",
    followers:80000, ytSubscribers:40000, niche:"Sports", rating:4.9, engagement:0,
    city:"Delhi", location:"Delhi",
    bio:"Content creator specialising in sports. Based in Delhi.",
    price:1440, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1440, personalad:2880},
    photo:"https://randomuser.me/api/portraits/men/55.jpg",
    avgViews:11200, avgLikes:896, reach:104000,
    tags:["#sports","#sports"],
    categories:["sports"],
    reviews:[]
  },
  {
    id:190, name:"Shilpa Kapoor", handle:"@shilpakapoor", platform:"Instagram",
    followers:22000, niche:"Wedding", rating:4.4, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in wedding. Based in Jaipur.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:300, reel:600, video:0, personalad:1320},
    photo:"https://randomuser.me/api/portraits/men/56.jpg",
    avgViews:4840, avgLikes:387, reach:28600,
    tags:["#wedding","#wedding"],
    categories:["wedding"],
    reviews:[]
  },
  {
    id:191, name:"Nisha Joshi", handle:"@nishajoshi", platform:"Instagram",
    followers:70000, niche:"Wedding", rating:4.7, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in wedding. Based in Jaipur.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:630, reel:1260, video:0, personalad:2772},
    photo:"https://randomuser.me/api/portraits/women/38.jpg",
    avgViews:18200, avgLikes:1456, reach:91000,
    tags:["#wedding","#wedding"],
    categories:["wedding"],
    reviews:[]
  },
  {
    id:192, name:"Rekha Sharma", handle:"@rekhasharma", platform:"Instagram",
    followers:54000, niche:"Wedding", rating:3.8, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in wedding. Based in Jaipur.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:485, reel:971, video:0, personalad:2136},
    photo:"https://randomuser.me/api/portraits/men/57.jpg",
    avgViews:5400, avgLikes:432, reach:70200,
    tags:["#wedding","#wedding"],
    categories:["wedding"],
    reviews:[]
  },
  {
    id:193, name:"Kaveri Nair", handle:"@kaverinair", platform:"Instagram",
    followers:45000, niche:"Wedding", rating:4.1, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in wedding. Based in Jaipur.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:404, reel:809, video:0, personalad:1779},
    photo:"https://randomuser.me/api/portraits/women/39.jpg",
    avgViews:6300, avgLikes:504, reach:58500,
    tags:["#wedding","#wedding"],
    categories:["wedding"],
    reviews:[]
  },
  {
    id:194, name:"Vandana Patel", handle:"@vandanapatel", platform:"Instagram",
    followers:56000, niche:"Wedding", rating:4.4, engagement:0,
    city:"Jaipur", location:"Jaipur",
    bio:"Content creator specialising in wedding. Based in Jaipur.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:503, reel:1007, video:0, personalad:2215},
    photo:"https://randomuser.me/api/portraits/men/58.jpg",
    avgViews:10080, avgLikes:806, reach:72800,
    tags:["#wedding","#wedding"],
    categories:["wedding"],
    reviews:[]
  },
  {
    id:195, name:"Anjali Singh", handle:"@anjalisingh", platform:"Instagram",
    followers:80000, niche:"Sustainable", rating:3.9, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in sustainable. Based in Bengaluru.",
    price:1440, verified:true, trending:true, featured:false,
    prices:{story:720, reel:1440, video:0, personalad:3168},
    photo:"https://randomuser.me/api/portraits/men/59.jpg",
    avgViews:20800, avgLikes:1664, reach:104000,
    tags:["#sustainable","#sustainable"],
    categories:["sustainable"],
    reviews:[]
  },
  {
    id:196, name:"Prerna Gupta", handle:"@prernagupta", platform:"Instagram",
    followers:30000, niche:"Sustainable", rating:4.2, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in sustainable. Based in Bengaluru.",
    price:600, verified:true, trending:false, featured:true,
    prices:{story:300, reel:600, video:0, personalad:1320},
    photo:"https://randomuser.me/api/portraits/women/40.jpg",
    avgViews:3000, avgLikes:240, reach:39000,
    tags:["#sustainable","#sustainable"],
    categories:["sustainable"],
    reviews:[]
  },
  {
    id:197, name:"Swati Joshi", handle:"@swatijoshi", platform:"Instagram",
    followers:90000, niche:"Sustainable", rating:4.5, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in sustainable. Based in Bengaluru.",
    price:1619, verified:true, trending:false, featured:false,
    prices:{story:809, reel:1619, video:0, personalad:3561},
    photo:"https://randomuser.me/api/portraits/men/60.jpg",
    avgViews:12600, avgLikes:1008, reach:117000,
    tags:["#sustainable","#sustainable"],
    categories:["sustainable"],
    reviews:[]
  },
  {
    id:198, name:"Meghna Rao", handle:"@meghnarao", platform:"Instagram",
    followers:55000, niche:"Sustainable", rating:4.8, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in sustainable. Based in Bengaluru.",
    price:989, verified:true, trending:false, featured:false,
    prices:{story:494, reel:989, video:0, personalad:2175},
    photo:"https://randomuser.me/api/portraits/women/41.jpg",
    avgViews:9900, avgLikes:792, reach:71500,
    tags:["#sustainable","#sustainable"],
    categories:["sustainable"],
    reviews:[]
  },
  {
    id:199, name:"Komal Sharma", handle:"@komalsharma", platform:"Instagram",
    followers:80000, niche:"Sustainable", rating:3.9, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in sustainable. Based in Bengaluru.",
    price:1440, verified:true, trending:false, featured:false,
    prices:{story:720, reel:1440, video:0, personalad:3168},
    photo:"https://randomuser.me/api/portraits/men/61.jpg",
    avgViews:17600, avgLikes:1408, reach:104000,
    tags:["#sustainable","#sustainable"],
    categories:["sustainable"],
    reviews:[]
  },
  {
    id:200, name:"Suresh Gupta", handle:"@sureshgupta", platform:"YouTube",
    followers:22000, ytSubscribers:11000, niche:"Business", rating:4.6, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in business. Based in Bengaluru.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:0, reel:0, video:600, personalad:1200},
    photo:"https://randomuser.me/api/portraits/men/62.jpg",
    avgViews:2200, avgLikes:176, reach:28600,
    tags:["#business","#business"],
    categories:["business"],
    reviews:[]
  },
  {
    id:201, name:"Ramesh Agarwal", handle:"@rameshagarwal", platform:"YouTube",
    followers:70000, ytSubscribers:35000, niche:"Business", rating:4.9, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in business. Based in Bengaluru.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:0, reel:0, video:1260, personalad:2520},
    photo:"https://randomuser.me/api/portraits/women/42.jpg",
    avgViews:9800, avgLikes:784, reach:91000,
    tags:["#business","#business"],
    categories:["business"],
    reviews:[]
  },
  {
    id:202, name:"Mahesh Sharma", handle:"@maheshsharma", platform:"YouTube",
    followers:54000, ytSubscribers:27000, niche:"Business", rating:4.0, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in business. Based in Bengaluru.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:971, personalad:1942},
    photo:"https://randomuser.me/api/portraits/men/63.jpg",
    avgViews:9720, avgLikes:777, reach:70200,
    tags:["#business","#business"],
    categories:["business"],
    reviews:[]
  },
  {
    id:203, name:"Dinesh Nair", handle:"@dineshnair", platform:"YouTube",
    followers:45000, ytSubscribers:22500, niche:"Business", rating:4.3, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in business. Based in Bengaluru.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:809, personalad:1618},
    photo:"https://randomuser.me/api/portraits/women/43.jpg",
    avgViews:9900, avgLikes:792, reach:58500,
    tags:["#business","#business"],
    categories:["business"],
    reviews:[]
  },
  {
    id:204, name:"Rajesh Iyer", handle:"@rajeshiyer", platform:"YouTube",
    followers:56000, ytSubscribers:28000, niche:"Business", rating:4.6, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in business. Based in Bengaluru.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1007, personalad:2014},
    photo:"https://randomuser.me/api/portraits/men/64.jpg",
    avgViews:14560, avgLikes:1164, reach:72800,
    tags:["#business","#business"],
    categories:["business"],
    reviews:[]
  },
  {
    id:205, name:"Sonal Mehta", handle:"@sonalmehta", platform:"Both",
    followers:80000, ytSubscribers:40000, niche:"Entertainment", rating:4.1, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in entertainment. Based in Mumbai.",
    price:1440, verified:true, trending:true, featured:false,
    prices:{story:480, reel:720, video:1440, personalad:2592},
    photo:"https://randomuser.me/api/portraits/men/65.jpg",
    avgViews:11200, avgLikes:896, reach:104000,
    tags:["#entertainment","#entertainment"],
    categories:["entertainment"],
    reviews:[]
  },
  {
    id:206, name:"Riya Kapoor", handle:"@riyakapoor", platform:"Both",
    followers:30000, ytSubscribers:15000, niche:"Entertainment", rating:4.4, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in entertainment. Based in Mumbai.",
    price:600, verified:true, trending:false, featured:true,
    prices:{story:200, reel:300, video:600, personalad:1080},
    photo:"https://randomuser.me/api/portraits/women/44.jpg",
    avgViews:5400, avgLikes:432, reach:39000,
    tags:["#entertainment","#entertainment"],
    categories:["entertainment"],
    reviews:[]
  },
  {
    id:207, name:"Priya Singh", handle:"@priyasingh", platform:"Both",
    followers:90000, ytSubscribers:45000, niche:"Entertainment", rating:4.7, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in entertainment. Based in Mumbai.",
    price:1619, verified:true, trending:false, featured:false,
    prices:{story:539, reel:809, video:1619, personalad:2914},
    photo:"https://randomuser.me/api/portraits/men/66.jpg",
    avgViews:19800, avgLikes:1584, reach:117000,
    tags:["#entertainment","#entertainment"],
    categories:["entertainment"],
    reviews:[]
  },
  {
    id:208, name:"Kavya Joshi", handle:"@kavyajoshi", platform:"Both",
    followers:55000, ytSubscribers:27500, niche:"Entertainment", rating:3.8, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in entertainment. Based in Mumbai.",
    price:989, verified:true, trending:false, featured:false,
    prices:{story:329, reel:494, video:989, personalad:1780},
    photo:"https://randomuser.me/api/portraits/women/45.jpg",
    avgViews:14300, avgLikes:1144, reach:71500,
    tags:["#entertainment","#entertainment"],
    categories:["entertainment"],
    reviews:[]
  },
  {
    id:209, name:"Neha Nair", handle:"@nehanair", platform:"Both",
    followers:80000, ytSubscribers:40000, niche:"Entertainment", rating:4.1, engagement:0,
    city:"Mumbai", location:"Mumbai",
    bio:"Content creator specialising in entertainment. Based in Mumbai.",
    price:1440, verified:true, trending:false, featured:false,
    prices:{story:480, reel:720, video:1440, personalad:2592},
    photo:"https://randomuser.me/api/portraits/men/67.jpg",
    avgViews:8000, avgLikes:640, reach:104000,
    tags:["#entertainment","#entertainment"],
    categories:["entertainment"],
    reviews:[]
  },
  {
    id:210, name:"Rohit Sharma", handle:"@rohitsharma", platform:"Instagram",
    followers:22000, niche:"Pets", rating:4.8, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in pets. Based in Bengaluru.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:300, reel:600, video:0, personalad:1320},
    photo:"https://randomuser.me/api/portraits/men/68.jpg",
    avgViews:3960, avgLikes:316, reach:28600,
    tags:["#pets","#pets"],
    categories:["pets"],
    reviews:[]
  },
  {
    id:211, name:"Ankita Joshi", handle:"@ankitajoshi", platform:"Instagram",
    followers:70000, niche:"Pets", rating:3.9, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in pets. Based in Bengaluru.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:630, reel:1260, video:0, personalad:2772},
    photo:"https://randomuser.me/api/portraits/women/46.jpg",
    avgViews:15400, avgLikes:1232, reach:91000,
    tags:["#pets","#pets"],
    categories:["pets"],
    reviews:[]
  },
  {
    id:212, name:"Vikram Rao", handle:"@vikramrao", platform:"Instagram",
    followers:54000, niche:"Pets", rating:4.2, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in pets. Based in Bengaluru.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:485, reel:971, video:0, personalad:2136},
    photo:"https://randomuser.me/api/portraits/men/69.jpg",
    avgViews:14040, avgLikes:1123, reach:70200,
    tags:["#pets","#pets"],
    categories:["pets"],
    reviews:[]
  },
  {
    id:213, name:"Sunita Patel", handle:"@sunitapatel", platform:"Instagram",
    followers:45000, niche:"Pets", rating:4.5, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in pets. Based in Bengaluru.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:404, reel:809, video:0, personalad:1779},
    photo:"https://randomuser.me/api/portraits/women/47.jpg",
    avgViews:4500, avgLikes:360, reach:58500,
    tags:["#pets","#pets"],
    categories:["pets"],
    reviews:[]
  },
  {
    id:214, name:"Arun Nair", handle:"@arunnair", platform:"Instagram",
    followers:56000, niche:"Pets", rating:4.8, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in pets. Based in Bengaluru.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:503, reel:1007, video:0, personalad:2215},
    photo:"https://randomuser.me/api/portraits/men/70.jpg",
    avgViews:7840, avgLikes:627, reach:72800,
    tags:["#pets","#pets"],
    categories:["pets"],
    reviews:[]
  },
  {
    id:215, name:"Pandit Mishra", handle:"@panditmishra", platform:"YouTube",
    followers:80000, ytSubscribers:40000, niche:"Astrology", rating:4.3, engagement:0,
    city:"Varanasi", location:"Varanasi",
    bio:"Content creator specialising in astrology. Based in Varanasi.",
    price:1440, verified:true, trending:true, featured:false,
    prices:{story:0, reel:0, video:1440, personalad:2880},
    photo:"https://randomuser.me/api/portraits/men/71.jpg",
    avgViews:17600, avgLikes:1408, reach:104000,
    tags:["#astrology","#astrology"],
    categories:["astrology"],
    reviews:[]
  },
  {
    id:216, name:"Jyotish Rao", handle:"@jyotishrao", platform:"YouTube",
    followers:30000, ytSubscribers:15000, niche:"Astrology", rating:4.6, engagement:0,
    city:"Varanasi", location:"Varanasi",
    bio:"Content creator specialising in astrology. Based in Varanasi.",
    price:600, verified:true, trending:false, featured:true,
    prices:{story:0, reel:0, video:600, personalad:1200},
    photo:"https://randomuser.me/api/portraits/women/48.jpg",
    avgViews:7800, avgLikes:624, reach:39000,
    tags:["#astrology","#astrology"],
    categories:["astrology"],
    reviews:[]
  },
  {
    id:217, name:"Guruji Patel", handle:"@gurujipatel", platform:"YouTube",
    followers:90000, ytSubscribers:45000, niche:"Astrology", rating:4.9, engagement:0,
    city:"Varanasi", location:"Varanasi",
    bio:"Content creator specialising in astrology. Based in Varanasi.",
    price:1619, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1619, personalad:3238},
    photo:"https://randomuser.me/api/portraits/men/72.jpg",
    avgViews:9000, avgLikes:720, reach:117000,
    tags:["#astrology","#astrology"],
    categories:["astrology"],
    reviews:[]
  },
  {
    id:218, name:"Acharya Nair", handle:"@acharyanair", platform:"YouTube",
    followers:55000, ytSubscribers:27500, niche:"Astrology", rating:4.0, engagement:0,
    city:"Varanasi", location:"Varanasi",
    bio:"Content creator specialising in astrology. Based in Varanasi.",
    price:989, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:989, personalad:1978},
    photo:"https://randomuser.me/api/portraits/women/49.jpg",
    avgViews:7700, avgLikes:616, reach:71500,
    tags:["#astrology","#astrology"],
    categories:["astrology"],
    reviews:[]
  },
  {
    id:219, name:"Rishi Joshi", handle:"@rishijoshi", platform:"YouTube",
    followers:80000, ytSubscribers:40000, niche:"Astrology", rating:4.3, engagement:0,
    city:"Varanasi", location:"Varanasi",
    bio:"Content creator specialising in astrology. Based in Varanasi.",
    price:1440, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1440, personalad:2880},
    photo:"https://randomuser.me/api/portraits/men/73.jpg",
    avgViews:14400, avgLikes:1152, reach:104000,
    tags:["#astrology","#astrology"],
    categories:["astrology"],
    reviews:[]
  },
  {
    id:220, name:"Ankit Gupta", handle:"@ankitgupta", platform:"YouTube",
    followers:22000, ytSubscribers:11000, niche:"Crypto", rating:3.8, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in crypto. Based in Bengaluru.",
    price:600, verified:true, trending:true, featured:false,
    prices:{story:0, reel:0, video:600, personalad:1200},
    photo:"https://randomuser.me/api/portraits/men/74.jpg",
    avgViews:5720, avgLikes:457, reach:28600,
    tags:["#crypto","#crypto"],
    categories:["crypto"],
    reviews:[]
  },
  {
    id:221, name:"Dev Sharma", handle:"@devsharma", platform:"YouTube",
    followers:70000, ytSubscribers:35000, niche:"Crypto", rating:4.1, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in crypto. Based in Bengaluru.",
    price:1260, verified:true, trending:false, featured:true,
    prices:{story:0, reel:0, video:1260, personalad:2520},
    photo:"https://randomuser.me/api/portraits/women/50.jpg",
    avgViews:7000, avgLikes:560, reach:91000,
    tags:["#crypto","#crypto"],
    categories:["crypto"],
    reviews:[]
  },
  {
    id:222, name:"Rahul Joshi", handle:"@rahuljoshi", platform:"YouTube",
    followers:54000, ytSubscribers:27000, niche:"Crypto", rating:4.4, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in crypto. Based in Bengaluru.",
    price:971, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:971, personalad:1942},
    photo:"https://randomuser.me/api/portraits/men/75.jpg",
    avgViews:7560, avgLikes:604, reach:70200,
    tags:["#crypto","#crypto"],
    categories:["crypto"],
    reviews:[]
  },
  {
    id:223, name:"Kiran Nair", handle:"@kirannair", platform:"YouTube",
    followers:45000, ytSubscribers:22500, niche:"Crypto", rating:4.7, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in crypto. Based in Bengaluru.",
    price:809, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:809, personalad:1618},
    photo:"https://randomuser.me/api/portraits/women/51.jpg",
    avgViews:8100, avgLikes:648, reach:58500,
    tags:["#crypto","#crypto"],
    categories:["crypto"],
    reviews:[]
  },
  {
    id:224, name:"Rohan Patel", handle:"@rohanpatel", platform:"YouTube",
    followers:56000, ytSubscribers:28000, niche:"Crypto", rating:3.8, engagement:0,
    city:"Bengaluru", location:"Bengaluru",
    bio:"Content creator specialising in crypto. Based in Bengaluru.",
    price:1007, verified:true, trending:false, featured:false,
    prices:{story:0, reel:0, video:1007, personalad:2014},
    photo:"https://randomuser.me/api/portraits/men/76.jpg",
    avgViews:12320, avgLikes:985, reach:72800,
    tags:["#crypto","#crypto"],
    categories:["crypto"],
    reviews:[]
  }
];

const CAMPS = [
  {id:1,influencer:"Priya Sharma",handle:"@priya.sharma",platform:"Instagram",status:"Active",start:"Mar 10",end:"Mar 24",budget:85000,reach:"840K"},
  {id:2,influencer:"Kabir Khan",handle:"@kabirfoods",platform:"Instagram",status:"Completed",start:"Feb 15",end:"Mar 1",budget:90000,reach:"1.4M"},
  {id:3,influencer:"Rohan Mehra",handle:"@techwithrohan",platform:"YouTube",status:"Pending",start:"Mar 20",end:"Apr 3",budget:65000,reach:"360K"},
];

const NOTIFS = [
  {id:1,type:"success",icon:"✓",text:"Booking confirmed with Priya Sharma",time:"2h ago",read:false},
  {id:2,type:"info",icon:"▶",text:"Campaign with Kabir Khan started",time:"1d ago",read:false},
  {id:3,type:"gold",icon:"★",text:"Sneha Kapoor completed your campaign",time:"2d ago",read:true},
];

const NICHES = ["Fashion","Tech","Fitness","Food","Travel","Beauty","Gaming","Finance","Lifestyle","Music"];
const PLATFORMS = ["Instagram","YouTube","Both"];
const CITIES = ["Mumbai","Delhi","Bengaluru","Hyderabad","Chennai","Kolkata","Jaipur","Pune","Kochi","Ahmedabad"];

// ── Promotion Categories ──────────────────────────────
// ── Cleo Professional AI Logo ─────────────────────────────
// Load DotLottie web-component script once globally
(function() {
  const SCRIPT_ID = "__dotlottie_wc__";
  if (typeof document !== "undefined" && !document.getElementById(SCRIPT_ID)) {
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.type = "module";
    s.src = "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";
    document.head.appendChild(s);
  }
})();

function CleoLogo({ size=44, glow=false }) {
  const r = Math.round(size * 14 / 44); // border-radius scaled with size
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: r,
      background: "#000",
      overflow: "hidden",
      flexShrink: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      filter: glow
        ? "drop-shadow(0 0 8px rgba(156,106,247,.8)) drop-shadow(0 0 18px rgba(0,229,255,.35))"
        : "none",
    }}>
      {React.createElement('dotlottie-player', {
        src: "https://lottie.host/52458c56-86ef-47ef-8ea4-9cd9889b5af8/mJGL1G73Mm.lottie",
        autoplay: "",
        loop: "",
        style: { width: "100%", height: "100%", display: "block" }
      })}
    </div>
  );
}

// ── Category 3D Colorful Icons ─────────────────────────────
const CAT_ICONS = {
  fashion: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="fash" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#ff6eb4"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
      <path d="M12 4 C12 4 8 6 6 8 L10 10 L8 28 L24 28 L22 10 L26 8 C24 6 20 4 20 4 C20 4 18 7 16 7 C14 7 12 4 12 4Z" fill="url(#fash)" opacity=".9"/>
      <path d="M12 4 C12 4 8 6 6 8 L10 10 L8 28 L24 28 L22 10 L26 8 C24 6 20 4 20 4 C20 4 18 7 16 7 C14 7 12 4 12 4Z" fill="rgba(255,255,255,.15)"/>
      <path d="M10 10 L8 28" stroke="rgba(255,255,255,.3)" strokeWidth="1"/>
      <path d="M22 10 L24 28" stroke="rgba(255,255,255,.3)" strokeWidth="1"/>
    </svg>
  ),
  beauty: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="beau" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#f9a8d4"/><stop offset="1" stopColor="#ec4899"/></linearGradient></defs>
      <ellipse cx="16" cy="20" rx="9" ry="9" fill="url(#beau)"/>
      <ellipse cx="16" cy="20" rx="9" ry="9" fill="rgba(255,255,255,.2)"/>
      <rect x="14" y="5" width="4" height="13" rx="2" fill="#f472b6"/>
      <rect x="14" y="5" width="4" height="6" rx="2" fill="rgba(255,255,255,.4)"/>
      <circle cx="16" cy="20" r="4" fill="rgba(255,255,255,.35)"/>
    </svg>
  ),
  food: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="food" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#fb923c"/><stop offset="1" stopColor="#dc2626"/></linearGradient></defs>
      <ellipse cx="16" cy="19" rx="12" ry="8" fill="url(#food)"/>
      <ellipse cx="16" cy="17" rx="12" ry="8" fill="#f97316"/>
      <ellipse cx="16" cy="16" rx="12" ry="7" fill="#fb923c"/>
      <ellipse cx="16" cy="15" rx="12" ry="5" fill="#fdba74"/>
      <ellipse cx="16" cy="15" rx="12" ry="5" fill="rgba(255,255,255,.18)"/>
      <rect x="7" y="6" width="2" height="9" rx="1" fill="#22c55e"/>
      <rect x="15" y="4" width="2" height="11" rx="1" fill="#16a34a"/>
      <rect x="23" y="6" width="2" height="9" rx="1" fill="#22c55e"/>
    </svg>
  ),
  fitness: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="fit" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#4ade80"/><stop offset="1" stopColor="#16a34a"/></linearGradient></defs>
      <rect x="13" y="12" width="6" height="8" rx="3" fill="url(#fit)"/>
      <rect x="13" y="12" width="6" height="4" rx="2" fill="rgba(255,255,255,.25)"/>
      <rect x="3" y="13" width="10" height="6" rx="3" fill="#4ade80"/>
      <rect x="19" y="13" width="10" height="6" rx="3" fill="#4ade80"/>
      <rect x="1" y="15" width="4" height="2" rx="1" fill="#22c55e"/>
      <rect x="27" y="15" width="4" height="2" rx="1" fill="#22c55e"/>
    </svg>
  ),
  tech: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="tech" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#1d4ed8"/></linearGradient></defs>
      <rect x="9" y="3" width="14" height="26" rx="4" fill="url(#tech)"/>
      <rect x="9" y="3" width="14" height="14" rx="4" fill="rgba(255,255,255,.18)"/>
      <rect x="11" y="6" width="10" height="14" rx="2" fill="#0f172a"/>
      <rect x="11" y="6" width="10" height="7" rx="2" fill="#1e3a6e"/>
      <circle cx="16" cy="25" r="1.5" fill="rgba(255,255,255,.5)"/>
    </svg>
  ),
  gaming: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="game" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#c084fc"/><stop offset="1" stopColor="#7e22ce"/></linearGradient></defs>
      <rect x="4" y="10" width="24" height="16" rx="6" fill="url(#game)"/>
      <rect x="4" y="10" width="24" height="8" rx="6" fill="rgba(255,255,255,.18)"/>
      <rect x="7" y="15" width="5" height="2" rx="1" fill="rgba(255,255,255,.7)"/>
      <rect x="9" y="13" width="2" height="5" rx="1" fill="rgba(255,255,255,.7)"/>  
      <circle cx="21" cy="15" r="1.5" fill="#f0abfc"/>
      <circle cx="24" cy="17" r="1.5" fill="#a78bfa"/>
      <circle cx="21" cy="19" r="1.5" fill="#60a5fa"/>
      <circle cx="18" cy="17" r="1.5" fill="#4ade80"/>
    </svg>
  ),
  travel: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="trav" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#38bdf8"/><stop offset="1" stopColor="#0369a1"/></linearGradient></defs>
      <ellipse cx="16" cy="16" rx="13" ry="13" fill="url(#trav)"/>
      <ellipse cx="16" cy="16" rx="13" ry="13" fill="rgba(255,255,255,.15)"/>
      <path d="M6 16 Q10 10 16 10 Q22 10 26 16 Q22 22 16 22 Q10 22 6 16Z" fill="rgba(255,255,255,.2)"/>
      <ellipse cx="16" cy="16" rx="5" ry="13" stroke="rgba(255,255,255,.35)" strokeWidth="1" fill="none"/>
      <line x1="3" y1="16" x2="29" y2="16" stroke="rgba(255,255,255,.35)" strokeWidth="1"/>
    </svg>
  ),
  finance: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="fin" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#fbbf24"/><stop offset="1" stopColor="#d97706"/></linearGradient></defs>
      <circle cx="16" cy="16" r="13" fill="url(#fin)"/>
      <circle cx="16" cy="16" r="13" fill="rgba(255,255,255,.15)"/>
      <text x="16" y="22" textAnchor="middle" fontSize="14" fontWeight="900" fill="rgba(0,0,0,.6)" fontFamily="sans-serif">₹</text>
      <path d="M11 10 L21 10 L21 12 L11 12Z" fill="rgba(255,255,255,.4)"/>
    </svg>
  ),
  lifestyle: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="life" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#fde68a"/><stop offset="1" stopColor="#f59e0b"/></linearGradient></defs>
      <polygon points="16,3 19.5,12.5 29,12.5 21.5,18.5 24.5,28 16,22.5 7.5,28 10.5,18.5 3,12.5 12.5,12.5" fill="url(#life)"/>
      <polygon points="16,3 19.5,12.5 29,12.5 21.5,18.5 24.5,28 16,22.5 7.5,28 10.5,18.5 3,12.5 12.5,12.5" fill="rgba(255,255,255,.2)"/>
      <polygon points="16,7 18.5,14 26,14 20,18.5 22,25 16,21 10,25 12,18.5 6,14 13.5,14" fill="rgba(255,220,50,.5)"/>
    </svg>
  ),
  music: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="mus" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#f472b6"/><stop offset="1" stopColor="#9333ea"/></linearGradient></defs>
      <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#mus)"/>
      <rect x="3" y="3" width="26" height="13" rx="8" fill="rgba(255,255,255,.18)"/>
      <path d="M13 22 L13 12 L23 9 L23 19" stroke="rgba(255,255,255,.9)" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="11" cy="22" r="3" fill="rgba(255,255,255,.8)"/>
      <circle cx="21" cy="19" r="3" fill="rgba(255,255,255,.8)"/>
    </svg>
  ),
  education: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="edu" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#6ee7b7"/><stop offset="1" stopColor="#059669"/></linearGradient></defs>
      <polygon points="16,4 30,11 16,18 2,11" fill="url(#edu)"/>
      <polygon points="16,4 30,11 16,18 2,11" fill="rgba(255,255,255,.2)"/>
      <path d="M7 13.5 L7 22 Q16 27 25 22 L25 13.5" fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="30" y1="11" x2="30" y2="20" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="30" cy="21" r="2" fill="#10b981"/>
    </svg>
  ),
  health: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="hea" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#f87171"/><stop offset="1" stopColor="#dc2626"/></linearGradient></defs>
      <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#hea)"/>
      <rect x="3" y="3" width="26" height="13" rx="8" fill="rgba(255,255,255,.18)"/>
      <rect x="13.5" y="8" width="5" height="16" rx="2.5" fill="rgba(255,255,255,.9)"/>
      <rect x="8" y="13.5" width="16" height="5" rx="2.5" fill="rgba(255,255,255,.9)"/>
    </svg>
  ),
  automobile: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="auto" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#94a3b8"/><stop offset="1" stopColor="#334155"/></linearGradient></defs>
      <rect x="2" y="16" width="28" height="9" rx="3" fill="url(#auto)"/>
      <path d="M6 16 L9 9 L23 9 L26 16Z" fill="#60a5fa"/>
      <path d="M9 9 L11 13 L21 13 L23 9Z" fill="#bfdbfe"/>
      <circle cx="9" cy="25" r="3.5" fill="#1e293b"/>
      <circle cx="9" cy="25" r="2" fill="#475569"/>
      <circle cx="23" cy="25" r="3.5" fill="#1e293b"/>
      <circle cx="23" cy="25" r="2" fill="#475569"/>
    </svg>
  ),
  realestate: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="real" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#fb923c"/><stop offset="1" stopColor="#9a3412"/></linearGradient></defs>
      <polygon points="16,3 29,14 29,29 3,29 3,14" fill="url(#real)"/>
      <polygon points="16,3 29,14 3,14" fill="rgba(255,255,255,.25)"/>
      <rect x="12" y="20" width="8" height="9" rx="2" fill="#7c2d12"/>
      <rect x="7" y="17" width="5" height="5" rx="1.5" fill="rgba(255,255,255,.5)"/>
      <rect x="20" y="17" width="5" height="5" rx="1.5" fill="rgba(255,255,255,.5)"/>
    </svg>
  ),
  ecommerce: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="eco" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#34d399"/><stop offset="1" stopColor="#065f46"/></linearGradient></defs>
      <path d="M3 5 L6 5 L9.5 20 L25 20 L28 8 L8 8" stroke="url(#eco)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="25" r="3" fill="#34d399"/>
      <circle cx="22" cy="25" r="3" fill="#34d399"/>
      <path d="M10 14 L26 14" stroke="rgba(52,211,153,.4)" strokeWidth="1.5"/>
      <circle cx="12" cy="25" r="1.5" fill="#d1fae5"/>
      <circle cx="22" cy="25" r="1.5" fill="#d1fae5"/>
    </svg>
  ),
  jewellery: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="jew" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#e0f2fe"/><stop offset="1" stopColor="#0284c7"/></linearGradient><linearGradient id="jew2" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#bae6fd"/><stop offset="1" stopColor="#38bdf8"/></linearGradient></defs>
      <polygon points="16,3 6,12 3,22 16,29 29,22 26,12" fill="url(#jew)"/>
      <polygon points="16,3 6,12 16,15 26,12" fill="#7dd3fc"/>
      <polygon points="6,12 3,22 16,15" fill="#0ea5e9"/>
      <polygon points="26,12 29,22 16,15" fill="#38bdf8"/>
      <polygon points="3,22 16,29 16,15" fill="#0369a1"/>
      <polygon points="16,29 29,22 16,15" fill="#0284c7"/>
    </svg>
  ),
  kids: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="kids" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#fbbf24"/><stop offset="1" stopColor="#f59e0b"/></linearGradient></defs>
      <circle cx="16" cy="11" r="8" fill="url(#kids)"/>
      <circle cx="16" cy="11" r="8" fill="rgba(255,255,255,.2)"/>
      <circle cx="13" cy="10" r="1.5" fill="#92400e"/>
      <circle cx="19" cy="10" r="1.5" fill="#92400e"/>
      <path d="M12 14 Q16 17 20 14" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="16" cy="23" rx="9" ry="6" fill="#fcd34d"/>
      <ellipse cx="16" cy="23" rx="9" ry="6" fill="rgba(255,255,255,.15)"/>
    </svg>
  ),
  sports: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="sport" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#86efac"/><stop offset="1" stopColor="#16a34a"/></linearGradient></defs>
      <circle cx="16" cy="16" r="13" fill="url(#sport)"/>
      <path d="M8 8 Q12 11 12 16 Q12 21 8 24" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" fill="none"/>
      <path d="M24 8 Q20 11 20 16 Q20 21 24 24" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" fill="none"/>
      <line x1="3" y1="16" x2="29" y2="16" stroke="rgba(255,255,255,.5)" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,.3)" strokeWidth="1" fill="none"/>
    </svg>
  ),
  wedding: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="wed" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#fda4af"/><stop offset="1" stopColor="#e11d48"/></linearGradient></defs>
      <path d="M16 28 L6 16 Q2 9 9 6 Q13 4 16 9 Q19 4 23 6 Q30 9 26 16 Z" fill="url(#wed)"/>
      <path d="M16 28 L6 16 Q2 9 9 6 Q13 4 16 9 Q19 4 23 6 Q30 9 26 16 Z" fill="rgba(255,255,255,.2)"/>
      <path d="M16 12 L9 16 Q8 18 9 20 L16 28" fill="rgba(255,255,255,.1)"/>
    </svg>
  ),
  sustainable: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="sus" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#4ade80"/><stop offset="1" stopColor="#166534"/></linearGradient></defs>
      <path d="M16 28 C16 28 4 22 4 12 C4 8 7 5 11 5 C13 5 15 6 16 8 C17 6 19 5 21 5 C25 5 28 8 28 12 C28 22 16 28 16 28Z" fill="url(#sus)"/>
      <path d="M16 8 L16 28" stroke="rgba(255,255,255,.35)" strokeWidth="1.5"/>
      <path d="M7 14 C7 14 12 12 16 14" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 14 C16 14 20 16 25 14" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  business: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="biz" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#818cf8"/><stop offset="1" stopColor="#3730a3"/></linearGradient></defs>
      <rect x="3" y="14" width="26" height="15" rx="3" fill="url(#biz)"/>
      <rect x="3" y="14" width="26" height="8" rx="3" fill="rgba(255,255,255,.18)"/>
      <path d="M11 14 L11 10 Q11 7 14 7 L18 7 Q21 7 21 10 L21 14" stroke="#a5b4fc" strokeWidth="2" fill="none"/>
      <rect x="14.5" y="19" width="3" height="4" rx="1.5" fill="rgba(255,255,255,.6)"/>
    </svg>
  ),
  entertainment: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="ent" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#fb7185"/><stop offset="1" stopColor="#9f1239"/></linearGradient></defs>
      <rect x="3" y="7" width="26" height="18" rx="4" fill="url(#ent)"/>
      <rect x="3" y="7" width="26" height="9" rx="4" fill="rgba(255,255,255,.18)"/>
      <polygon points="13,12 22,16 13,20" fill="rgba(255,255,255,.9)"/>
    </svg>
  ),
  pets: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="pet" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#fdba74"/><stop offset="1" stopColor="#c2410c"/></linearGradient></defs>
      <ellipse cx="16" cy="19" rx="10" ry="8" fill="url(#pet)"/>
      <ellipse cx="16" cy="17" rx="10" ry="8" fill="#fb923c"/>
      <ellipse cx="16" cy="17" rx="10" ry="8" fill="rgba(255,255,255,.15)"/>
      <ellipse cx="9" cy="9" rx="3.5" ry="4" fill="#f97316" transform="rotate(-20 9 9)"/>
      <ellipse cx="23" cy="9" rx="3.5" ry="4" fill="#f97316" transform="rotate(20 23 9)"/>
      <circle cx="13" cy="16" r="1.5" fill="#7c2d12"/>
      <circle cx="19" cy="16" r="1.5" fill="#7c2d12"/>
      <path d="M12 20 Q16 23 20 20" stroke="#7c2d12" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  astrology: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="ast" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#4c1d95"/></linearGradient></defs>
      <circle cx="16" cy="16" r="13" fill="url(#ast)"/>
      <circle cx="16" cy="16" r="13" fill="rgba(255,255,255,.12)"/>
      <path d="M16 3 C16 3 13 12 6 16 C13 20 16 29 16 29 C16 29 19 20 26 16 C19 12 16 3 16 3Z" fill="rgba(255,255,255,.25)"/>
      <circle cx="16" cy="16" r="4" fill="rgba(255,255,255,.35)"/>
      <circle cx="10" cy="8" r="1.5" fill="rgba(255,255,255,.7)"/>
      <circle cx="24" cy="12" r="1" fill="rgba(255,255,255,.7)"/>
      <circle cx="8" cy="22" r="1" fill="rgba(255,255,255,.7)"/>
    </svg>
  ),
  crypto: (s=18) => (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <defs><linearGradient id="cry" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#fbbf24"/><stop offset="1" stopColor="#b45309"/></linearGradient></defs>
      <circle cx="16" cy="16" r="13" fill="url(#cry)"/>
      <circle cx="16" cy="16" r="13" fill="rgba(255,255,255,.15)"/>
      <path d="M13 9 L13 23 M19 9 L19 23" stroke="rgba(255,255,255,.85)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M11 12 L11 12 Q21 11 21 14 Q21 17 11 16 Q21 16 21 19.5 Q21 23 11 22" stroke="rgba(255,255,255,.85)" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  ),
};

// ── Filter SVG Icons (colorful minimal) ──────────────────────
const FILTER_ICONS = {
  platform:  (s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="3" fill="#60a5fa" opacity=".9"/><rect x="5" y="2" width="14" height="10" rx="3" fill="#93c5fd" opacity=".6"/><circle cx="12" cy="18" r="1.5" fill="#fff" opacity=".8"/></svg>,
  followers: (s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" fill="#a78bfa"/><ellipse cx="9" cy="18" rx="6" ry="4" fill="#7c3aed" opacity=".85"/><circle cx="17" cy="9" r="3" fill="#c4b5fd" opacity=".9"/><ellipse cx="17" cy="18" rx="5" ry="3" fill="#8b5cf6" opacity=".7"/></svg>,
  rating:    (s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><polygon points="12,2 14.5,9 22,9.5 16.5,14.5 18.5,22 12,18 5.5,22 7.5,14.5 2,9.5 9.5,9" fill="#fbbf24"/><polygon points="12,5 13.8,10.5 19.5,11 15,15 16.5,21 12,18" fill="#fde68a" opacity=".5"/></svg>,
  city:      (s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2 C8 2 5 5 5 9 C5 15 12 22 12 22 C12 22 19 15 19 9 C19 5 16 2 12 2Z" fill="#f87171"/><path d="M12 2 C8 2 5 5 5 9 C5 12 12 22 12 22" fill="#fca5a5" opacity=".4"/><circle cx="12" cy="9" r="3" fill="#fff" opacity=".85"/></svg>,
  budget:    (s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#4ade80"/><circle cx="12" cy="12" r="10" fill="rgba(255,255,255,.2)"/><text x="12" y="17" textAnchor="middle" fontSize="11" fontWeight="900" fill="rgba(0,80,30,.8)" fontFamily="sans-serif">₹</text></svg>,
  niche:     (s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M20.5 4.5 L13 4.5 L3.5 14 L10 20.5 L19.5 11 Z" fill="#fb923c"/><path d="M13 4.5 L3.5 14 L10 20.5 L13 4.5Z" fill="#fcd34d" opacity=".4"/><circle cx="16" cy="8" r="2.5" fill="#fff" opacity=".9"/></svg>,
};

const PROMOTION_CATEGORIES = [
  { id:"fashion",        label:"Fashion",         icon:"fashion" },
  { id:"beauty",         label:"Beauty",          icon:"beauty" },
  { id:"food",           label:"Food & Drinks",   icon:"food" },
  { id:"fitness",        label:"Fitness",         icon:"fitness" },
  { id:"tech",           label:"Tech",            icon:"tech" },
  { id:"gaming",         label:"Gaming",          icon:"gaming" },
  { id:"travel",         label:"Travel",          icon:"travel" },
  { id:"finance",        label:"Finance",         icon:"finance" },
  { id:"lifestyle",      label:"Lifestyle",       icon:"lifestyle" },
  { id:"music",          label:"Music",           icon:"music" },
  { id:"education",      label:"Education",       icon:"education" },
  { id:"health",         label:"Health",          icon:"health" },
  { id:"automobile",     label:"Auto & Bikes",    icon:"automobile" },
  { id:"realestate",     label:"Real Estate",     icon:"realestate" },
  { id:"ecommerce",      label:"E-Commerce",      icon:"ecommerce" },
  { id:"jewellery",      label:"Jewellery",       icon:"jewellery" },
  { id:"kids",           label:"Kids & Family",   icon:"kids" },
  { id:"sports",         label:"Sports",          icon:"sports" },
  { id:"wedding",        label:"Wedding",         icon:"wedding" },
  { id:"sustainable",    label:"Eco & Organic",   icon:"sustainable" },
  { id:"business",       label:"Business",        icon:"business" },
  { id:"entertainment",  label:"Entertainment",   icon:"entertainment" },
  { id:"pets",           label:"Pets",            icon:"pets" },
  { id:"astrology",      label:"Astrology",       icon:"astrology" },
  { id:"crypto",         label:"Crypto & Web3",   icon:"crypto" },
];

const fmt = n => n >= 1e6 ? (n/1e6).toFixed(1)+"M" : n >= 1000 ? (n/1000).toFixed(0)+"K" : n;
// Floors to 1 decimal — 10150→10.1K, 10200→10.2K (never rounds up)
const fmtK = n => {
  n = Number(n)||0;
  if (n >= 1e6) return (Math.floor(n/1e5)/10).toFixed(1)+"M";
  if (n >= 1000) return (Math.floor(n/100)/10).toFixed(1)+"K";
  return String(n);
};
const fmtKPlus = n => fmtK(n)+"+";
const inr = n => "₹" + n.toLocaleString("en-IN");

// ── Avatar ────────────────────────────────────────────
function Avatar({ inf, size = 48, style = {} }) {
  const [err, setErr] = useState(false);
  const colors = ["#00E5FF","#7c6af7","#00e676","#ffab40","#f06292","#40c4ff","#69f0ae","#ff6e40"];
  const c = colors[inf.id % colors.length];
  const ini = inf.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const photoSrc = inf.pfp || inf.photo;

  if (!photoSrc || err) {
    return (
      <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,
        background:`linear-gradient(135deg,${c},${c}88)`,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontFamily:"system-ui,sans-serif",fontWeight:700,fontSize:size*.32,color:"#fff",lineHeight:1,
        overflow:"visible",
        ...style}}>
        {ini}
      </div>
    );
  }
  return (
    <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,overflow:"hidden",...style}}>
      <img src={photoSrc} alt={inf.name}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        onError={()=>setErr(true)}
        style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
    </div>
  );
}

function PlatIcon({ p, size=26 }) {
  const IGIcon = () => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497"/>
          <stop offset="10%" stopColor="#fdf497"/>
          <stop offset="50%" stopColor="#fd5949"/>
          <stop offset="68%" stopColor="#d6249f"/>
          <stop offset="100%" stopColor="#285AEB"/>
        </radialGradient>
      </defs>
      <rect x="3" y="4" width="18" height="16" rx="5" fill="url(#ig-grad)"/>
      <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.6" fill="none"/>
      <circle cx="16.8" cy="7.2" r="1" fill="white"/>
    </svg>
  );
  const YTIcon = () => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="5" fill="#FF0000"/>
      <polygon points="10,8.5 10,15.5 16,12" fill="white"/>
    </svg>
  );
  if (p === "Both") return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4}}>
      <IGIcon/>
      <YTIcon/>
    </span>
  );
  if (p === "Instagram") return <IGIcon/>;
  if (p === "YouTube") return <YTIcon/>;
  return null;
}

function Stars({ v, onChange, size=17 }) {
  const [h, sh] = useState(0);
  return (
    <div style={{display:"flex",gap:3}}>
      {[1,2,3,4,5].map(s => (
        <span key={s}
          onMouseEnter={()=>onChange&&sh(s)} onMouseLeave={()=>onChange&&sh(0)}
          onClick={()=>onChange&&onChange(s)}
          style={{fontSize:size,cursor:onChange?"pointer":"default",
            color:(h||v)>=s?"var(--c)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
            transition:"color .15s,transform .15s",display:"inline-block",
            transform:(h||v)>=s?"scale(1.2)":"scale(1)"}}>★</span>
      ))}
    </div>
  );
}

function ReviewStars({ v, size=14 }) {
  return (
    <div style={{display:"flex",gap:3}}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{
          fontSize:size,
          color:v>=s?"#00E5FF":"rgba(0,229,255,.2)",
          display:"inline-block"}}>★</span>
      ))}
    </div>
  );
}

// ── Animated BG (no scanline/scroll text) ─────────────
function AnimBg() {
  return (
    <div style={{position:"fixed",top:0,bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
      {/* Moving grid — lightweight, transform only */}
      <div style={{position:"absolute",inset:0,
        backgroundImage:"linear-gradient(rgba(0,229,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.03) 1px,transparent 1px)",
        backgroundSize:"60px 60px",animation:"gridmove 10s linear infinite",willChange:"transform"}}/>
      {/* Orbs — NO filter:blur (too expensive). Use radial-gradient for soft glow instead */}
      <div style={{position:"absolute",top:"5%",left:"5%",width:320,height:320,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(0,229,255,.09) 0%,transparent 70%)",
        animation:"orb1 16s ease-in-out infinite",willChange:"transform"}}/>
      <div style={{position:"absolute",top:"50%",right:"5%",width:280,height:280,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(124,106,247,.07) 0%,transparent 70%)",
        animation:"orb2 20s ease-in-out infinite",willChange:"transform"}}/>
      <div style={{position:"absolute",bottom:"8%",left:"35%",width:240,height:240,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(0,230,118,.05) 0%,transparent 70%)",
        animation:"orb3 13s ease-in-out infinite",willChange:"transform"}}/>
      {/* Corner glows — static, zero animation cost */}
      <div style={{position:"absolute",top:0,left:0,width:300,height:300,
        background:"radial-gradient(circle at 0% 0%,rgba(0,229,255,.06),transparent 70%)"}}/>
      <div style={{position:"absolute",bottom:0,right:0,width:300,height:300,
        background:"radial-gradient(circle at 100% 100%,rgba(124,106,247,.06),transparent 70%)"}}/>
    </div>
  );
}

function Particles() {
  const pts = React.useMemo(()=>Array.from({length:12},(_,i)=>({x:5+Math.random()*90,y:5+Math.random()*90,s:.8+Math.random()*2,d:5+Math.random()*5,dl:Math.random()*6})),[]);
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {pts.map((p,i)=>(
        <div key={i} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,
          width:p.s,height:p.s,borderRadius:"50%",
          background:"var(--c)",opacity:.18,
          animation:`float ${p.d}s ease-in-out ${p.dl}s infinite`,
          willChange:"transform"}}/>
      ))}
    </div>
  );
}

// ── Nav (Mobile) ────────────────────────────────────────
function Nav({ page, setPage, notifCount, setShowNotif, initials="BZ", bizPfp="", isPro=false }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll",h,{passive:true});
    return ()=>window.removeEventListener("scroll",h);
  },[]);

  const tabs = [
    {k:"discover", l:"Discover"},
    {k:"dashboard",l:"Dashboard"},
    {k:"wallet",   l:"Wallet"},
    {k:"referral", l:"Referral"},
    {k:"pro",      l:"Pro ⚡"},
  ];

  // 3D SVG Icons — isometric style, two-tone depth
  const TabSVG = ({k, active}) => {
    const c1 = active ? "#00E5FF"            : "#6666aa";
    const c2 = active ? "rgba(0,229,255,.55)": "rgba(80,80,120,.5)";
    const c3 = active ? "rgba(0,188,212,.7)" : "rgba(60,60,100,.55)";
    const cf = active ? "rgba(0,229,255,.1)" : "rgba(80,80,130,.06)";
    const s  = {display:"block"};
    if (k === "discover") return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={s}>
        <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill={cf} stroke={c1} strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="3"  y1="7"  x2="12" y2="11" stroke={c2} strokeWidth="1"/>
        <line x1="21" y1="7"  x2="12" y2="11" stroke={c2} strokeWidth="1"/>
        <line x1="12" y1="11" x2="12" y2="22" stroke={c3} strokeWidth="1"/>
        <circle cx="12" cy="11" r="1.8" fill={c1}/>
        <line x1="12" y1="8.2" x2="12" y2="6.5" stroke={c1} strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="14.4" y1="10" x2="16" y2="9.2" stroke={c1} strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="9.6"  y1="10" x2="8"  y2="9.2" stroke={c1} strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="12" y1="13.8" x2="12" y2="15.5" stroke={c1} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    );
    if (k === "dashboard") return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={s}>
        <rect x="3"  y="13" width="4.5" height="8"  rx=".6" fill={c3}/>
        <rect x="3"  y="13" width="4.5" height="2.2" rx=".6" fill={c1}/>
        <polygon points="3,13 5.25,10.5 7.5,10.5 7.5,13" fill={c2}/>
        <rect x="9.75" y="7"  width="4.5" height="14" rx=".6" fill={c3}/>
        <rect x="9.75" y="7"  width="4.5" height="2.2" rx=".6" fill={c1}/>
        <polygon points="9.75,7 12,4.5 14.25,4.5 14.25,7" fill={c2}/>
        <rect x="16.5" y="10" width="4.5" height="11" rx=".6" fill={c3}/>
        <rect x="16.5" y="10" width="4.5" height="2.2" rx=".6" fill={c1}/>
        <polygon points="16.5,10 18.75,7.5 21,7.5 21,10" fill={c2}/>
      </svg>
    );
    if (k === "wallet") return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={s}>
        {/* Wallet body — isometric card shape */}
        <rect x="2" y="6" width="20" height="14" rx="2.2" fill={c3}/>
        <rect x="2" y="6" width="20" height="4"  rx="2.2" fill={c2}/>
        {/* Top edge highlight */}
        <rect x="2" y="6" width="20" height="1.4" rx="1" fill={c1} opacity=".7"/>
        {/* Coin pocket */}
        <rect x="13" y="11.5" width="7" height="5" rx="1.2" fill={active?"rgba(0,229,255,.2)":"rgba(80,80,130,.18)"} stroke={c1} strokeWidth="1"/>
        {/* Coin inside pocket */}
        <circle cx="16.5" cy="14" r="1.6" fill={c1}/>
        {/* ₹ symbol on coin */}
        <text x="16.5" y="14.55" textAnchor="middle" fontSize="1.8" fontWeight="700"
          fontFamily="system-ui,sans-serif" fill={active?"var(--bg)":"#13132a"}>₹</text>
        {/* Left stripe lines */}
        <line x1="4" y1="13" x2="10" y2="13" stroke={c2} strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="4" y1="15.5" x2="8" y2="15.5" stroke={c2} strokeWidth="1" strokeLinecap="round" opacity=".6"/>
      </svg>
    );
    if (k === "referral") return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={s}>
        <rect x="3"    y="11.5" width="18" height="9.5" rx="1.2" fill={c3}/>
        <rect x="3"    y="11.5" width="18" height="2.8" rx="1.2" fill={c2}/>
        <rect x="3"    y="8.5"  width="18" height="3"   rx="1.2" fill={c1}/>
        <rect x="10.5" y="8.5"  width="3"  height="12.5"        fill="rgba(0,0,0,.2)"/>
        <rect x="3"    y="10"   width="18" height="2.2"          fill="rgba(0,0,0,.15)"/>
        <ellipse cx="9.5"  cy="8.8" rx="3.2" ry="1.5" fill={c1} transform="rotate(-18,9.5,8.8)"/>
        <ellipse cx="14.5" cy="8.8" rx="3.2" ry="1.5" fill={c1} transform="rotate(18,14.5,8.8)"/>
        <circle cx="12" cy="8.8" r="1.6" fill={active?"var(--bg)":"#13132a"}/>
      </svg>
    );
    if (k === "support") return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={s}>
        <path d="M3 4.5h18a1.8 1.8 0 0 1 1.8 1.8v9a1.8 1.8 0 0 1-1.8 1.8H13l-5 4v-4H3a1.8 1.8 0 0 1-1.8-1.8v-9A1.8 1.8 0 0 1 3 4.5z"
          fill={cf} stroke={c1} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M5.5 6.5h18a1.8 1.8 0 0 1 1.8 1.8v9" stroke={c2} strokeWidth=".9" fill="none" strokeDasharray="2 2"/>
        <circle cx="8.5"  cy="11.5" r="1.4" fill={c1}/>
        <circle cx="12"   cy="11.5" r="1.4" fill={c1}/>
        <circle cx="15.5" cy="11.5" r="1.4" fill={c1}/>
      </svg>
    );
    if (k === "pro") return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={s}>
        {/* Crown shape */}
        <path d="M3 17h18l-2-8-4 4-3-6-3 6-4-4z"
          fill={active?"rgba(255,171,64,.2)":"rgba(156,106,247,.1)"}
          stroke={active?"#ffab40":"#9c6af7"} strokeWidth="1.5"
          strokeLinejoin="round" strokeLinecap="round"/>
        {/* Crown bottom band */}
        <rect x="3" y="17" width="18" height="2.5" rx="1.2"
          fill={active?"rgba(255,171,64,.4)":"rgba(156,106,247,.2)"}
          stroke={active?"#ffab40":"#9c6af7"} strokeWidth="1"/>
        {/* Three jewels on crown points */}
        <circle cx="3" cy="9" r="1.5" fill={active?"#ffab40":"#9c6af7"}/>
        <circle cx="12" cy="3" r="1.5" fill={active?"#ffab40":"#00E5FF"}/>
        <circle cx="21" cy="9" r="1.5" fill={active?"#ffab40":"#9c6af7"}/>
        {/* Center diamond shine */}
        {active && <path d="M12 8l1.5 2-1.5 2-1.5-2z" fill="rgba(255,171,64,.6)"/>}
      </svg>
    );
    return null;
  };

  return (
    <>
      {/* ── Top bar ── */}
      <nav style={{
        position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:430,zIndex:100,
        background:scrolled
          ?"linear-gradient(180deg,rgba(12,12,28,.99) 0%,rgba(8,8,20,.98) 100%)"
          :"linear-gradient(180deg,rgba(10,10,24,.96) 0%,rgba(7,7,16,.94) 100%)",
        borderBottom:`1.5px solid ${scrolled?"rgba(255,255,255,.09)":"rgba(255,255,255,.05)"}`,
        boxShadow:scrolled?"0 3px 0 rgba(0,0,0,.45), 0 5px 14px rgba(0,0,0,.42)":"0 2px 0 rgba(0,0,0,.35), 0 4px 10px rgba(0,0,0,.3)",
        transition:"background .3s,border-color .3s,box-shadow .3s",
        willChange:"auto"
      }}>
        <div style={{display:"flex",alignItems:"center",height:56,padding:"0 16px",gap:12}}>
          {/* Logo */}
          <div onClick={()=>setPage("discover")}
            style={{cursor:"pointer",display:"flex",alignItems:"center",gap:9,flex:1,userSelect:"none"}}>
            <div style={{width:38,height:38,borderRadius:18,flexShrink:0,
              background:"linear-gradient(145deg,rgba(0,229,255,.2),rgba(0,188,212,.08))",
              border:"1.5px solid rgba(0,229,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 3px 0 rgba(0,0,0,.4), 0 5px 12px rgba(0,229,255,.12), 0 1px 0 rgba(255,255,255,.08) inset"}}>              <Logo size={22}/>
            </div>
            <div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,lineHeight:1}}>
                Coll<span className="glow">ancer</span>
              </div>
              <div style={{fontSize:5,color:"var(--txt2)",letterSpacing:1,marginTop:1}}>WHERE INFLUENCE MEETS INDUSTRY</div>
            </div>
          </div>
          {/* Notif */}
          <button onClick={()=>setShowNotif(v=>!v)} style={{
            background:"linear-gradient(145deg,rgba(20,20,48,.95),rgba(12,12,30,.98))",
            border:"1.5px solid rgba(255,255,255,.09)",borderRadius:18,
            width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"pointer",position:"relative",fontSize:14,color:"var(--txt2)",flexShrink:0,
            boxShadow:"0 3px 0 rgba(0,0,0,.4), 0 4px 10px rgba(0,0,0,.32), 0 1px 0 rgba(255,255,255,.05) inset"}}>
            🔔
            {notifCount>0&&<span style={{position:"absolute",top:6,right:6,width:6,height:6,
              borderRadius:"50%",background:"var(--c)",border:"2px solid var(--bg)",
              animation:"pulse 2s ease infinite"}}/>}
          </button>
          {/* Avatar */}
          <div style={{width:36,height:36,borderRadius:16,flexShrink:0,overflow:"hidden",
            background:"linear-gradient(135deg,var(--c),var(--c2))",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:12,fontWeight:700,color:"var(--bg)",fontFamily:"system-ui,sans-serif",
            boxShadow:"0 3px 0 rgba(0,0,0,.4), 0 4px 10px rgba(0,229,255,.15), 0 1px 0 rgba(255,255,255,.2) inset"}}>
            {bizPfp
              ? <img src={bizPfp} alt="pfp" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:9}}/>
              : initials}
          </div>
        </div>
      </nav>

      {/* ── Bottom tab bar ── */}
      <div style={{
        position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:430,zIndex:100,
        background:"linear-gradient(180deg,rgba(10,10,24,.97) 0%,rgba(7,7,16,.99) 100%)",
        borderTop:"1.5px solid rgba(255,255,255,.07)",
        boxShadow:"0 -3px 0 rgba(0,0,0,.38), 0 -5px 14px rgba(0,0,0,.4)",
        paddingBottom:"env(safe-area-inset-bottom)",
        display:"flex"
      }}>
        {tabs.map(tab=>{
          const isProTab = tab.k === "pro";
          const isActive = page === tab.k;
          return (
          <button key={tab.k} onClick={()=>setPage(tab.k)} style={{
            flex:1,display:"flex",flexDirection:"column",alignItems:"center",
            justifyContent:"center",gap:3,border:"none",background:"none",
            cursor:"pointer",padding:"6px 0 5px",position:"relative",
            transition:"all .22s cubic-bezier(.16,1,.3,1)"
          }}>
            <div style={{
              width:44,height:30,display:"flex",alignItems:"center",justifyContent:"center",
              borderRadius:18,
              background:isActive
                ? isProTab ? "linear-gradient(145deg,rgba(255,171,64,.25),rgba(255,100,20,.12))" : "linear-gradient(145deg,rgba(0,229,255,.2),rgba(0,188,212,.1))"
                : isProTab && isPro ? "linear-gradient(145deg,rgba(156,106,247,.15),rgba(156,106,247,.06))" : "transparent",
              boxShadow:isActive
                ? isProTab
                  ? "0 3px 0 rgba(0,0,0,.38), 0 4px 10px rgba(255,171,64,.22), 0 1px 0 rgba(255,255,255,.12) inset"
                  : "0 3px 0 rgba(0,0,0,.38), 0 4px 10px rgba(0,229,255,.18), 0 1px 0 rgba(255,255,255,.12) inset"
                : isProTab && isPro
                  ? "0 2px 0 rgba(0,0,0,.32), 0 3px 8px rgba(156,106,247,.16)"
                  : "none",
              transition:"all .25s cubic-bezier(.16,1,.3,1)",
              transform:isActive?"translateY(-2px) scale(1.06)":"translateY(0) scale(1)",
              position:"relative",
              border:isActive ? `1px solid ${isProTab?"rgba(255,171,64,.25)":"rgba(0,229,255,.22)"}` : "1px solid transparent",
            }}>
              <TabSVG k={tab.k} active={isActive}/>
              {/* Pulsing dot on Pro tab when user has active Pro */}
              {isProTab && isPro && !isActive && (
                <div style={{position:"absolute",top:-2,right:-2,width:7,height:7,borderRadius:"50%",
                  background:"var(--grn)",boxShadow:"0 0 6px var(--grn)",
                  animation:"pulse 1.5s ease infinite"}}/>
              )}
              {/* Lock dot when not Pro */}
              {isProTab && !isPro && !isActive && (
                <div style={{position:"absolute",top:-3,right:-3,width:8,height:8,borderRadius:"50%",
                  background:"linear-gradient(135deg,#9c6af7,#ffab40)",
                  animation:"proBadge 2s ease infinite",
                  boxShadow:"0 0 6px rgba(156,106,247,.6)"}}/>
              )}
            </div>
            <span style={{
              fontSize:9,fontWeight:isActive?700:500,letterSpacing:.4,
              color:isActive
                ? isProTab ? "#ffab40" : "var(--c)"
                : isProTab ? (isPro?"var(--grn)":"#9c6af7") : "var(--txt2)",
              transition:"color .2s"
            }}>{isProTab ? (isPro?"✦ Pro":"Pro") : tab.l}</span>
            {isActive&&<div style={{
              position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",
              width:20,height:2,borderRadius:"1px 1px 0 0",
              background:isProTab?"linear-gradient(90deg,#9c6af7,#ffab40)":"var(--c)",
              boxShadow:isProTab?"0 0 8px rgba(255,171,64,.6)":"0 0 8px var(--c)"
            }}/>}
          </button>
          );
        })}
      </div>
    </>
  );
}

// ── Notif Panel ────────────────────────────────────────
function NotifPanel({ onClose, notifs=NOTIFS }) {
  return (
    <div style={{position:"fixed",top:68,left:"50%",transform:"translateX(-50%)",maxWidth:398,zIndex:200,
      background:"linear-gradient(145deg,rgba(14,20,38,.99) 0%,rgba(8,10,22,.99) 100%)",
      border:"1.5px solid rgba(0,229,255,.2)",
      borderRadius:32,width:"min(320px,94vw)",
      boxShadow:"0 5px 0 rgba(0,0,0,.5), 0 10px 28px rgba(0,0,0,.65), 0 12px 28px rgba(0,229,255,.06), 0 1px 0 rgba(255,255,255,.06) inset",
      overflow:"hidden",
      animation:"slideleft .28s cubic-bezier(.16,1,.3,1)"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,
        background:"linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)",pointerEvents:"none"}}/>
      <div style={{padding:"16px 18px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",
        borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:700,color:"#e8e8f8"}}>Notifications</span>
        <button onClick={onClose} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",
          borderRadius:12,color:"#8888aa",cursor:"pointer",fontSize:14,padding:"4px 8px",lineHeight:1}}>✕</button>
      </div>
      {notifs.map(n=>(
        <div key={n.id} style={{padding:"12px 18px",borderTop:"1px solid rgba(0,229,255,.07)",
          display:"flex",gap:11,alignItems:"flex-start",
          background:n.read?"transparent":"rgba(0,229,255,.06)"}}>
          <div style={{width:34,height:34,borderRadius:14,flexShrink:0,
            background:n.type==="success"?"linear-gradient(135deg,#00e676,#00c853)":n.type==="gold"?"linear-gradient(135deg,#ffab40,#e65100)":"linear-gradient(135deg,#00E5FF,#00bcd4)",
            boxShadow:n.type==="success"?"0 3px 10px rgba(0,230,118,.45)":n.type==="gold"?"0 3px 10px rgba(255,171,64,.45)":"0 3px 10px rgba(0,229,255,.45)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:"#070710"}}>{n.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:"#e8e8f8"}}>{n.text}</div>
            <div style={{fontSize:11,color:"#8888aa",marginTop:3}}>{n.time}</div>
          </div>
          {!n.read&&<div style={{width:7,height:7,borderRadius:"50%",background:"var(--c)",marginTop:6,flexShrink:0,animation:"dotpulse 2s ease infinite"}}/>}
        </div>
      ))}
    </div>
  );
}

// ── Influencer Card ────────────────────────────────────
const InfCard = React.memo(function InfCard({ inf, onClick, boosted=false }) {
  const [hov, setHov] = useState(false);

  // Silver palette for normal cards, Gold palette for sponsored/boosted
  const SILVER = { a:"#b0bec5", b:"#90a4ae", mid:"#cfd8dc" };
  const GOLD   = { a:"#ffd700", b:"#ff8f00", mid:"#ffe57f" };
  const { a: ca, b: cb, mid: cm } = boosted ? GOLD : SILVER;

  return (
    <div className="card" onClick={()=>onClick(inf)}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background:"linear-gradient(145deg,rgba(22,22,52,.97) 0%,rgba(14,14,34,.99) 100%)",
        border: boosted ? "1.5px solid rgba(255,215,0,.45)" : "1.5px solid rgba(255,255,255,.07)",
        borderRadius:32,overflow:"hidden",position:"relative",
        transform: hov ? "translateY(-7px) scale(1.01) translateZ(0)" : "translateY(0) scale(1) translateZ(0)",
        boxShadow: hov
          ? boosted
            ? "0 8px 0 rgba(0,0,0,.5), 0 14px 30px rgba(255,215,0,.18), 0 2px 0 rgba(255,255,255,.05) inset"
            : "0 8px 0 rgba(0,0,0,.48), 0 14px 32px rgba(0,0,0,.55), 0 2px 0 rgba(255,255,255,.05) inset"
          : boosted
            ? "0 8px 0 rgba(0,0,0,.48), 0 14px 32px rgba(255,215,0,.14), 0 1px 0 rgba(255,255,255,.06) inset"
            : "0 4px 0 rgba(0,0,0,.42), 0 6px 16px rgba(0,0,0,.44), 0 1px 0 rgba(255,255,255,.05) inset",
        transition:"transform .28s cubic-bezier(.22,.68,0,1.3),box-shadow .28s ease,border-color .28s ease",
        willChange:"transform"}}>

      {/* ── Banner ── */}
      <div style={{height:80,position:"relative",overflow:"hidden",
        background: boosted
          ? "linear-gradient(135deg,rgba(255,215,0,.22) 0%,rgba(255,143,0,.14) 55%,rgba(255,215,0,.08) 100%)"
          : "linear-gradient(135deg,rgba(176,190,197,.18) 0%,rgba(144,164,174,.1) 55%,rgba(176,190,197,.06) 100%)"}}>

        {/* Dot grid */}
        <div style={{position:"absolute",inset:0,
          backgroundImage:`radial-gradient(circle,${boosted?"rgba(255,215,0,.55)":"rgba(176,190,197,.5)"} 1px,transparent 1px)`,
          backgroundSize:"14px 14px"}}/>

        {/* Moving shimmer sweep — uses transform for glitch-free loop */}
        <div style={{position:"absolute",top:"-40%",left:0,width:"45%",height:"180%",
          background: boosted
            ? "linear-gradient(105deg,transparent 20%,rgba(255,240,120,.55) 50%,transparent 80%)"
            : "linear-gradient(105deg,transparent 20%,rgba(220,235,242,.45) 50%,transparent 80%)",
          animation: boosted ? "goldShimmer 2.4s ease-in-out infinite" : "silverShimmer 4s ease-in-out infinite",
          willChange:"transform",
          pointerEvents:"none"}}/>

        {/* Glowing orb top-left only */}
        <div style={{position:"absolute",top:-14,left:-14,width:64,height:64,borderRadius:"50%",
          background: boosted
            ? "radial-gradient(circle,rgba(255,220,0,.7) 0%,transparent 70%)"
            : "radial-gradient(circle,rgba(192,210,225,.6) 0%,transparent 70%)",
          filter:"blur(8px)",
          transform:hov?"scale(1.35)":"scale(1)",transition:"transform .4s"}}/>

        {/* Glowing top edge line */}
        <div style={{position:"absolute",top:0,left:0,right:0,height: boosted?2.5:1.5,
          background: boosted
            ? "linear-gradient(90deg,transparent,rgba(255,220,0,.9),rgba(255,170,0,.7),rgba(255,220,0,.9),transparent)"
            : "linear-gradient(90deg,transparent,rgba(192,210,225,.8),rgba(160,190,210,.6),rgba(192,210,225,.8),transparent)"}}/>

        {/* Bottom fade */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:24,
          background:"linear-gradient(to top,rgba(14,14,34,.99),transparent)"}}/>

        {/* Boosted card: Sponsored LEFT, Trending RIGHT */}
        {boosted && (
          <>
            <span className="badge" style={{position:"absolute",top:10,left:10,
              background:"rgba(255,215,0,.18)",color:"#ffd700",
              border:"1px solid rgba(255,215,0,.45)",fontSize:10,zIndex:2,
              textShadow:"0 0 8px rgba(255,215,0,.7)",fontWeight:700}}>✦ Sponsored</span>
            <span className="badge" style={{position:"absolute",top:10,right:10,
              background:"linear-gradient(145deg,rgba(255,171,64,.22),rgba(255,120,20,.1))",color:"var(--amb)",
              border:"1px solid rgba(255,171,64,.4)",fontSize:10,zIndex:2,
              fontWeight:700}}>🔥 Trending</span>
          </>
        )}
      </div>

      <div style={{padding:"0 12px 12px"}}>
        {/* Photo */}
        <div style={{marginTop:-24,marginBottom:8,position:"relative",width:"fit-content"}}>
          <Avatar inf={inf} size={50} style={{
            border:"3px solid rgba(14,14,34,.99)",
            transition:"transform .3s, box-shadow .3s",
            transform:hov?"scale(1.06)":"scale(1)",
            boxShadow:hov?"0 0 22px rgba(0,229,255,.3)":"none"
          }}/>
          {inf.verified && (
            <div style={{position:"absolute",bottom:-1,right:-1,width:17,height:17,
              borderRadius:"50%",background:"var(--c)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:9,color:"var(--bg)",fontWeight:700,border:"2px solid rgba(10,10,26,.99)",boxShadow:"0 2px 0 rgba(0,0,0,.4)"}}>✓</div>
          )}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:700}}>{inf.name}</span>
          <PlatIcon p={inf.platform}/>
        </div>
        <div style={{fontSize:11,color:"var(--txt2)",marginBottom:10}}>{inf.handle} · {inf.city}</div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
          {(inf.platform==="Both"
            ? [{l:"Followers",v:fmtKPlus(inf.followers)},{l:"Avg Views",v:fmtK(inf.avgViews||0)},{l:"Rating",v:inf.rating+"★"}]
            : [{l:inf.platform==="YouTube"?"Subscribers":"Followers",v:fmtKPlus(inf.followers)},{l:"Avg Views",v:fmtK(inf.avgViews||0)},{l:"Rating",v:inf.rating+"★"}]
          ).map(s=>(
            <div key={s.l} style={{
              background:hov
                ?"linear-gradient(145deg,rgba(0,229,255,.1),rgba(0,188,212,.05))"
                :"linear-gradient(145deg,rgba(12,12,30,.95),rgba(8,8,22,.98))",
              borderRadius:18,padding:"8px 5px",textAlign:"center",
              border:hov?"1.5px solid rgba(0,229,255,.2)":"1.5px solid rgba(255,255,255,.06)",
              boxShadow:hov
                ?"0 4px 0 rgba(0,0,0,.4), 0 1px 0 rgba(255,255,255,.06) inset"
                :"0 3px 0 rgba(0,0,0,.38), 0 1px 0 rgba(255,255,255,.04) inset",
              transition:"all .28s cubic-bezier(.22,.68,0,1.2)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"var(--c)",fontFamily:"'DM Mono',monospace"}}>{s.v}</div>
              <div style={{fontSize:9,color:"var(--txt2)",marginTop:1,letterSpacing:.3}}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span className="tag" style={{fontSize:10}}>{inf.niche}</span>
          <span style={{fontSize:10,color:"var(--txt2)"}}>📍 {inf.city}</span>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <span style={{fontSize:10,color:"var(--txt2)"}}>From </span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:14,fontWeight:700,color:"var(--c)"}}>{inr(getBasePrice(inf))}</span>
          </div>
          <button className="btnp" style={{padding:"7px 15px",fontSize:11,borderRadius:50}}>View →</button>
        </div>
      </div>
    </div>
  );
});

// ── Rating Box (expanded) ─────────────────────────────
function RatingBox({ inf, style={}, compact=false }) {
  const reviews = inf.reviews || [];
  const avg = reviews.length > 0
    ? (reviews.reduce((s,r)=>s+(r.stars||0),0)/reviews.length).toFixed(1)
    : (inf.rating||0).toFixed(1);
  const dist = [5,4,3,2,1].map(n => ({
    star: n,
    pct: reviews.length ? Math.round(reviews.filter(r=>r.stars===n).length/reviews.length*100) : (n===5?80:n===4?15:n===3?3:1),
  }));
  return (
    <div style={{
      background:"linear-gradient(145deg,rgba(20,20,48,.96),rgba(12,12,30,.98))",
      border:"1.5px solid rgba(255,255,255,.07)",borderRadius:26,
      padding:"14px 16px",position:"relative",overflow:"hidden",transition:"all .28s",
      boxShadow:"0 3px 0 rgba(0,0,0,.4), 0 6px 14px rgba(0,0,0,.42), 0 1px 0 rgba(255,255,255,.05) inset",
      ...style}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,171,64,.35)";e.currentTarget.style.boxShadow="0 4px 0 rgba(0,0,0,.42), 0 7px 16px rgba(255,171,64,.1), 0 1px 0 rgba(255,255,255,.07) inset"}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.boxShadow="0 3px 0 rgba(0,0,0,.4), 0 5px 12px rgba(0,0,0,.4), 0 1px 0 rgba(255,255,255,.05) inset"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,
        background:"linear-gradient(90deg,transparent,var(--amb),transparent)",opacity:.55}}/>
      <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:compact?6:10}}>RATING</div>

      {compact ? (
        // Compact mode (Both platform): score + stars only, no bar chart — same height as StatBox
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,
            color:"var(--amb)",lineHeight:1,marginBottom:5}}>{avg}</div>
          <div style={{display:"flex",gap:2,marginBottom:4}}>
            {[1,2,3,4,5].map(n=>(
              <svg key={n} width="11" height="11" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={n<=Math.round(parseFloat(avg))?"var(--amb)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))"}
                  stroke={n<=Math.round(parseFloat(avg))?"var(--amb)":"var(--b)"} strokeWidth="1.5"/>
              </svg>
            ))}
          </div>
          <div style={{fontSize:10,color:"var(--txt2)"}}>{reviews.length} review{reviews.length!==1?"s":""}</div>
        </div>
      ) : (
        // Full mode (single platform): score left, bar chart right — fills full width
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,minWidth:52}}>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:30,fontWeight:800,
              color:"var(--amb)",lineHeight:1,marginBottom:4}}>{avg}</div>
            <div style={{display:"flex",gap:1.5,marginBottom:3}}>
              {[1,2,3,4,5].map(n=>(
                <svg key={n} width="10" height="10" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={n<=Math.round(parseFloat(avg))?"var(--amb)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))"}
                    stroke={n<=Math.round(parseFloat(avg))?"var(--amb)":"var(--b)"} strokeWidth="1.5"/>
                </svg>
              ))}
            </div>
            <div style={{fontSize:9,color:"var(--txt2)",textAlign:"center"}}>{reviews.length} review{reviews.length!==1?"s":""}</div>
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:4}}>
            {dist.map(({star,pct})=>(
              <div key={star} style={{display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:9,color:"var(--txt2)",width:7,textAlign:"right",flexShrink:0,fontWeight:600}}>{star}</span>
                <div style={{flex:1,height:5,borderRadius:3,background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:3,width:pct+"%",
                    background:star>=4?"linear-gradient(90deg,var(--amb),#ff6f00)":star===3?"rgba(255,171,64,.3)":"var(--b)",
                    transition:"width .7s cubic-bezier(.16,1,.3,1)"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Business Auth Screen ──────────────────────────────
function BusinessAuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ bizName:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const inp = {background:"linear-gradient(145deg,rgba(22,22,50,.7),rgba(14,14,32,.8))",border:"1.5px solid rgba(0,229,255,.18)",borderRadius:16,
    padding:"11px 13px",color:"var(--txt)",fontSize:13,outline:"none",
    fontFamily:"'DM Sans',sans-serif",width:"100%",marginBottom:8,transition:"all .2s"};

  const googleSignIn = async () => {
    setGLoading(true); setError("");
    try {
      const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = window.__cauthOps;
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      let cred;
      try {
        // Try popup first
        cred = await signInWithPopup(window.__cauth, provider);
      } catch(popupErr) {
        // If popup is blocked or unsupported, fall back to redirect
        if (
          popupErr.code === "auth/popup-blocked" ||
          popupErr.code === "auth/popup-closed-by-user" ||
          popupErr.code === "auth/cancelled-popup-request" ||
          popupErr.code === "auth/unauthorized-domain" ||
          popupErr.code === "auth/operation-not-supported-in-this-environment"
        ) {
          if (popupErr.code === "auth/unauthorized-domain") {
            setError("⚠️ Domain not authorized in Firebase Console. Go to Firebase Console → Authentication → Settings → Authorized domains → Add your domain.");
            setGLoading(false);
            return;
          }
          // For popup-closed, just stop silently
          setGLoading(false);
          return;
        }
        throw popupErr;
      }

      const user = cred.user;
      const { doc, getDoc, setDoc, serverTimestamp } = window.__cfs;
      const snap = await getDoc(doc(window.__cdb, "businesses", user.uid));
      if (snap.exists()) {
        onAuth(user, snap.data());
      } else {
        const bizData = {
          uid: user.uid,
          bizName: user.displayName || "My Business",
          email: user.email,
          pfp: user.photoURL || "",
          type: "business",
          createdAt: serverTimestamp(),
        };
        await setDoc(doc(window.__cdb, "businesses", user.uid), bizData);
        onAuth(user, bizData);
      }
    } catch(e) {
      if (e.code === "auth/unauthorized-domain") {
        setError("⚠️ Domain not authorized. In Firebase Console → Authentication → Settings → Authorized domains, add the domain this app is hosted on.");
      } else if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") {
        setError(`Google sign-in failed: ${e.message || e.code}`);
      }
    }
    setGLoading(false);
  };

  const submit = async () => {
    if (!form.email||!form.password) { setError("Email and password required"); return; }
    if (mode==="register"&&!form.bizName) { setError("Business name required"); return; }
    setLoading(true); setError("");
    try {
      const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = window.__cauthOps;
      if (mode==="register") {
        const cred = await createUserWithEmailAndPassword(window.__cauth, form.email, form.password);
        const { doc, setDoc, serverTimestamp } = window.__cfs;
        const bizData = { uid: cred.user.uid, bizName: form.bizName, email: form.email, type:"business", createdAt: serverTimestamp() };
        await setDoc(doc(window.__cdb, "businesses", cred.user.uid), bizData);
        onAuth(cred.user, bizData);
      } else {
        const cred = await signInWithEmailAndPassword(window.__cauth, form.email, form.password);
        const { doc, getDoc } = window.__cfs;
        const snap = await getDoc(doc(window.__cdb, "businesses", cred.user.uid));
        if (snap.exists()) onAuth(cred.user, snap.data());
        else setError("No business account found. Please register.");
      }
    } catch(e) {
      const msgs = {
        "auth/email-already-in-use":"Email already registered.",
        "auth/user-not-found":"No account found. Please register.",
        "auth/wrong-password":"Incorrect password.",
        "auth/invalid-credential":"Invalid email or password.",
        "auth/weak-password":"Password must be 6+ characters.",
      };
      setError(msgs[e.code]||e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:"0 20px",overflow:"hidden",zIndex:1}}>

      {/* Floating orbs */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"8%",left:"10%",width:260,height:260,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(0,229,255,.12) 0%,transparent 70%)",animation:"float 6s ease infinite"}}/>
        <div style={{position:"absolute",bottom:"12%",right:"5%",width:200,height:200,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(124,106,247,.1) 0%,transparent 70%)",animation:"float 8s ease 2s infinite"}}/>
        <div style={{position:"absolute",top:"45%",left:"50%",transform:"translateX(-50%)",
          width:320,height:320,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(0,229,255,.05) 0%,transparent 70%)",animation:"pulse 4s ease infinite"}}/>
      </div>

      {/* Logo */}
      <div style={{textAlign:"center",marginBottom:14,animation:"fadeUp .6s both",position:"relative",zIndex:1}}>
        <div style={{position:"relative",display:"inline-block",marginBottom:10}}>
          <div style={{width:76,height:76,borderRadius:24,
            background:"linear-gradient(135deg,rgba(0,229,255,.18),rgba(124,106,247,.12))",
            border:"1px solid rgba(0,229,255,.35)",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 0 60px rgba(0,229,255,.25),0 0 120px rgba(0,229,255,.1)",
            position:"relative"}}>
            <Logo size={52}/>
            <div style={{position:"absolute",inset:-8,borderRadius:32,
              border:"1.5px solid rgba(0,229,255,.22)",animation:"pulse 2.5s ease infinite"}}/>
            <div style={{position:"absolute",inset:-16,borderRadius:38,
              border:"1px solid rgba(0,229,255,.1)",animation:"pulse 2.5s ease .5s infinite"}}/>
          </div>
        </div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,lineHeight:1,marginBottom:6}}>
          Coll<span className="glow">ancer</span>
        </div>
        <div style={{fontSize:10,color:"var(--txt2)",letterSpacing:3,fontWeight:600}}>BUSINESS PLATFORM</div>
        <div style={{marginTop:10,fontSize:12,color:"var(--txt2)",lineHeight:1.5}}>
          {mode==="login" ? "Welcome back! Sign in to manage your campaigns." : "Join Collancer and start booking India's top creators."}
        </div>
      </div>

      {/* Card */}
      <div style={{width:"100%",maxWidth:380,animation:"fadeUp .6s .12s both",position:"relative",zIndex:1}}>
        <div style={{display:"flex",background:"linear-gradient(145deg,rgba(22,22,50,.7),rgba(14,14,32,.8))",borderRadius:18,padding:4,
          marginBottom:14,gap:4,border:"1px solid rgba(0,229,255,.1)"}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setError("");}}
              style={{flex:1,padding:"9px",border:"none",borderRadius:11,cursor:"pointer",
                fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,transition:"all .25s",
                background:mode===m?"linear-gradient(135deg,var(--c),var(--c2))":"transparent",
                color:mode===m?"#070710":"var(--txt2)",
                boxShadow:mode===m?"0 4px 20px rgba(0,229,255,.3)":"none"}}>
              {m==="login"?"Sign In":"Register"}
            </button>
          ))}
        </div>

        <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(0,229,255,.12)",
          borderRadius:24,padding:"16px 18px",backdropFilter:"blur(20px)"}}>
          {mode==="register" && (
            <>
              <div style={{fontSize:10,color:"var(--c)",fontWeight:700,letterSpacing:1.5,marginBottom:12}}>BUSINESS INFO</div>
              <input style={inp} placeholder="Business Name *" value={form.bizName} onChange={e=>setForm(f=>({...f,bizName:e.target.value}))}/>
              <div style={{borderTop:"1px solid rgba(0,229,255,.1)",margin:"4px 0 14px"}}/>
              <div style={{fontSize:10,color:"var(--c)",fontWeight:700,letterSpacing:1.5,marginBottom:12}}>ACCOUNT</div>
            </>
          )}
          <input style={inp} placeholder="Email address *" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
          <div style={{position:"relative"}}>
            <input style={{...inp,marginBottom:0,paddingRight:42}} placeholder="Password *"
              type={showPass?"text":"password"} value={form.password}
              onChange={e=>setForm(f=>({...f,password:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&submit()}/>
            <button onClick={()=>setShowPass(v=>!v)} style={{position:"absolute",right:12,top:"50%",
              transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",
              fontSize:14,color:"var(--txt2)",padding:4}}>{showPass?"🙈":"👁"}</button>
          </div>
          {error && (
            <div style={{fontSize:12,color:"var(--red)",marginTop:12,padding:"10px 12px",
              background:"rgba(248,113,113,.08)",borderRadius:14,border:"1px solid rgba(248,113,113,.25)",
              display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:14}}>⚠</span>{error}
            </div>
          )}
          <button onClick={submit} disabled={loading} className="btnp"
            style={{width:"100%",justifyContent:"center",marginTop:12,padding:"12px",
              fontSize:14,boxShadow:"0 8px 32px rgba(0,229,255,.3)"}}>
            {loading?<span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>:mode==="login"?"Sign In →":"Create Account →"}
          </button>

          {/* Divider */}
          <div style={{display:"flex",alignItems:"center",gap:10,margin:"14px 0 10px"}}>
            <div style={{flex:1,height:1,background:"linear-gradient(145deg,rgba(0,229,255,.18),rgba(0,188,212,.08))"}}/>
            <span style={{fontSize:11,color:"var(--txt2)",fontWeight:500,whiteSpace:"nowrap"}}>or continue with</span>
            <div style={{flex:1,height:1,background:"linear-gradient(145deg,rgba(0,229,255,.18),rgba(0,188,212,.08))"}}/>
          </div>

          {/* Google Button */}
          <button onClick={googleSignIn} disabled={gLoading} style={{
            width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            padding:"11px",borderRadius:16,cursor:"pointer",
            background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.14)",
            color:"var(--txt)",fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
            transition:"all .2s",opacity:gLoading?0.7:1}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.12)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}>
            {gLoading
              ? <span style={{animation:"spin 1s linear infinite",display:"inline-block",fontSize:16}}>◌</span>
              : <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                  <path d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 6.6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.2-.1-2.4-.4-3.5z" fill="#FFC107"/>
                  <path d="M6.3 14.7l6.6 4.8C14.6 16 19 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 6.6 29.5 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z" fill="#FF3D00"/>
                  <path d="M24 44c5.4 0 10.3-2 14-5.4l-6.5-5.5C29.5 35 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1l-6.6 4.8A20 20 0 0 0 24 44z" fill="#4CAF50"/>
                  <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.3 5.5l6.5 5.5C41.9 35.3 44 30 44 24c0-1.2-.1-2.4-.4-3.5z" fill="#1976D2"/>
                </svg>
            }
            {!gLoading && "Continue with Google"}
          </button>
        </div>

        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:16,marginTop:12}}>
          {["🔒 Secure","⚡ Instant","🇮🇳 India's #1"].map(t=>(
            <div key={t} style={{fontSize:10,color:"var(--txt3)"}}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ── Firebase Config ───────────────────────────────────

// ── Firebase SDK Loader ───────────────────────────────
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
const AD_PLANS = [
  { days:1, price:299,  label:"1 Day",  popular:false },
  { days:2, price:549,  label:"2 Days", popular:false },
  { days:3, price:799,  label:"3 Days", popular:true  },
  { days:4, price:999,  label:"4 Days", popular:false },
  { days:5, price:1249, label:"5 Days", popular:false },
  { days:6, price:1449, label:"6 Days", popular:false },
  { days:7, price:1599, label:"7 Days", popular:false },
];

// ── Promotion Categories (all India-relevant) ─────────
const CREATOR_PROMO_CATEGORIES = [
  { id:"fashion",        label:"Fashion & Clothing",       icon:"👗" },
  { id:"beauty",         label:"Beauty & Skincare",         icon:"💄" },
  { id:"food",           label:"Food & Beverages",          icon:"🍔" },
  { id:"fitness",        label:"Fitness & Wellness",        icon:"💪" },
  { id:"tech",           label:"Tech & Gadgets",            icon:"📱" },
  { id:"gaming",         label:"Gaming & Esports",          icon:"🎮" },
  { id:"travel",         label:"Travel & Tourism",          icon:"✈️" },
  { id:"finance",        label:"Finance & Fintech",         icon:"💰" },
  { id:"lifestyle",      label:"Lifestyle & Vlogs",         icon:"🌟" },
  { id:"music",          label:"Music & Entertainment",     icon:"🎵" },
  { id:"education",      label:"Education & EdTech",        icon:"📚" },
  { id:"health",         label:"Health & Pharma",           icon:"🏥" },
  { id:"automobile",     label:"Automobile & Bikes",        icon:"🚗" },
  { id:"realestate",     label:"Real Estate & Home",        icon:"🏠" },
  { id:"ecommerce",      label:"E-Commerce & Shopping",     icon:"🛒" },
  { id:"jewellery",      label:"Jewellery & Accessories",   icon:"💎" },
  { id:"kids",           label:"Kids & Parenting",          icon:"👶" },
  { id:"sports",         label:"Sports & Athletics",        icon:"⚽" },
  { id:"wedding",        label:"Wedding & Events",          icon:"💍" },
  { id:"sustainable",    label:"Sustainable & Organic",     icon:"🌿" },
  { id:"business",       label:"Business & Startups",       icon:"🏢" },
  { id:"entertainment",  label:"OTT & Entertainment",       icon:"🎬" },
  { id:"pets",           label:"Pets & Animals",            icon:"🐾" },
  { id:"astrology",      label:"Astrology & Spirituality",  icon:"🔮" },
  { id:"crypto",         label:"Crypto & Web3",             icon:"₿"  },
];

// ── Cloudinary PFP Upload ─────────────────────────────

async function uploadCreatorPfp(uid, dataUrl) {
  try {
    const formData = new FormData();
    formData.append("file", dataUrl);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    formData.append("public_id", `pfps_creator_${uid}_${Date.now()}`);
    formData.append("folder", "collancer_pfps");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: "POST", body: formData }
    );
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url || dataUrl;
  } catch(e) { console.error("Cloudinary upload error:", e); return dataUrl; }
}


function HomeLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 500 680" fill="none">
      <path d="M250 250 L145 145" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L355 145" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L145 355" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L355 355" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L250 115" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L250 385" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L115 250" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <path d="M250 250 L385 250" stroke="#ffffff" strokeWidth="42" strokeLinecap="round"/>
      <ellipse cx="250" cy="250" rx="24" ry="24" fill="#ffffff"/>
      <circle cx="250" cy="108" r="34" fill="#00E5FF"/>
      <circle cx="250" cy="392" r="34" fill="#00E5FF"/>
      <circle cx="108" cy="250" r="34" fill="#00E5FF"/>
      <circle cx="392" cy="250" r="34" fill="#00E5FF"/>
      <text x="250" y="640" textAnchor="middle" fontFamily="'Plus Jakarta Sans',sans-serif" fontSize="130" fontWeight="900" fill="#ffffff" stroke="#000000" strokeWidth="12" paintOrder="stroke" letterSpacing="8">HOME</text>
    </svg>
  );
}

function BizSplashScreen({ onDone }) {
  const [phase, setPhase] = useState("show"); // show | fadeout

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fadeout"), 3200); // start fade at 3.2s
    const t2 = setTimeout(() => onDone(), 4000);            // done at 4s
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position:"fixed",
      top:0, bottom:0,
      left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430,
      zIndex:9999,
      background:"var(--bg)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      overflow:"hidden",
      opacity: phase === "fadeout" ? 0 : 1,
      transition:"opacity .8s cubic-bezier(.4,0,.2,1)",
      pointerEvents: phase === "fadeout" ? "none" : "all"
    }}>
      {/* Ambient glow */}
      <div style={{position:"absolute",top:"50%",left:"50%",
        transform:"translate(-50%,-50%)",
        width:320,height:320,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(0,229,255,.1) 0%,transparent 65%)",
        pointerEvents:"none"}}/>

      {/* Logo with pulse rings */}
      <div style={{position:"relative",marginBottom:36,marginTop:-60,animation:"fadeUp .7s cubic-bezier(.16,1,.3,1) both"}}>
        <div style={{position:"absolute",inset:-12,borderRadius:30,
          border:"1px solid rgba(0,229,255,.28)",animation:"pring 2.2s ease-out infinite"}}/>
        <div style={{position:"absolute",inset:-12,borderRadius:30,
          border:"1px solid rgba(0,229,255,.16)",animation:"pring 2.2s ease-out .55s infinite"}}/>
        <div style={{
          width:88,height:88,borderRadius:26,
          background:"linear-gradient(135deg,rgba(0,229,255,.15),rgba(0,229,255,.04))",
          border:"1.5px solid rgba(0,229,255,.28)",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 0 60px rgba(0,229,255,.2)"
        }}>
          <Logo size={52}/>
        </div>
      </div>

      {/* Brand name */}
      <div style={{animation:"fadeUp .6s .2s both",marginBottom:10,textAlign:"center"}}>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:26,fontWeight:800,letterSpacing:"-0.5px",lineHeight:1}}>
          Coll<span className="glow">ancer</span>
        </div>
      </div>

      {/* Tagline */}
      <div style={{animation:"fadeUp .6s .4s both",marginBottom:40,textAlign:"center"}}>
        <div style={{fontSize:8,color:"var(--txt2)",letterSpacing:2,fontWeight:600}}>
          WHERE INFLUENCE MEETS INDUSTRY
        </div>
      </div>

      {/* Description */}
      <div style={{animation:"fadeUp .6s .6s both",textAlign:"center",maxWidth:280,marginBottom:48}}>
        <p style={{fontSize:14,color:"var(--txt2)",lineHeight:1.75,fontWeight:300}}>
          Discover &amp; book India's top creators for your campaigns. AI-powered matching · Instant booking · Real results.
        </p>
      </div>

      {/* Stats */}
      <div style={{animation:"fadeUp .6s .8s both",display:"flex",gap:32}}>
        {[["20,000+","Verified Creators"],["20,000+","Verified Businesses"]].map(([v,l])=>(
          <div key={l} style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:"var(--c)",lineHeight:1}}>{v}</div>
            <div style={{fontSize:9,color:"var(--txt2)",marginTop:4,letterSpacing:.5}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Loading bar */}
      <div style={{
        position:"absolute",bottom:44,left:"50%",transform:"translateX(-50%)",
        width:200,display:"flex",flexDirection:"column",alignItems:"center",gap:10
      }}>
        <div style={{width:"100%",height:3,borderRadius:3,background:"linear-gradient(145deg,rgba(0,229,255,.14),rgba(0,188,212,.07))",overflow:"hidden",position:"relative"}}>
          <div style={{
            position:"absolute",top:0,left:0,height:"100%",borderRadius:3,
            background:"linear-gradient(90deg,transparent,var(--c),#80eeff,var(--c),transparent)",
            backgroundSize:"200% 100%",
            width:"100%",
            animation:"gradshift 1.4s linear infinite, loadbar 3.2s cubic-bezier(.4,0,.2,1) both",
            boxShadow:"0 0 14px rgba(0,229,255,.9),0 0 28px rgba(0,229,255,.4)"
          }}/>
        </div>
      </div>
    </div>
  );
}

// ── Role Selection Page ───────────────────────────────
function RoleSelectPage({ onSelect }) {
  const [selected, setSelected] = useState(null);
  const [leaving, setLeaving] = useState(false);

  const choose = (role) => {
    if (leaving) return;
    setSelected(role);
    setLeaving(true);
    setTimeout(() => onSelect(role), 520);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:100,
      background:"var(--bg)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"24px 20px",
      opacity: leaving ? 0 : 1,
      transform: leaving ? "scale(.96) translateY(8px)" : "scale(1) translateY(0)",
      transition: leaving ? "opacity .5s cubic-bezier(.4,0,.2,1), transform .5s cubic-bezier(.4,0,.2,1)" : "none",
    }}>
      {/* Ambient radial glows */}
      <div style={{position:"absolute",top:"20%",left:"18%",width:260,height:260,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(0,229,255,.07) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"22%",right:"15%",width:220,height:220,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(156,106,247,.08) 0%,transparent 70%)",pointerEvents:"none"}}/>

      {/* Logo + Title */}
      <div style={{textAlign:"center",marginBottom:36,animation:"fadeUp .6s cubic-bezier(.16,1,.3,1) both"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:8}}>
          <div style={{width:36,height:36,borderRadius:12,
            background:"linear-gradient(135deg,rgba(0,229,255,.15),rgba(0,229,255,.04))",
            border:"1.5px solid rgba(0,229,255,.28)",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 0 20px rgba(0,229,255,.15)"}}>
            <Logo size={22}/>
          </div>
          <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,letterSpacing:"-.5px"}}>
            Coll<span className="glow">ancer</span>
          </span>
        </div>
        <p style={{fontSize:13,color:"var(--txt2)",fontWeight:400,letterSpacing:.2}}>
          India's Influencer Marketplace
        </p>
      </div>

      {/* Heading */}
      <div style={{textAlign:"center",marginBottom:28,animation:"fadeUp .6s .1s cubic-bezier(.16,1,.3,1) both"}}>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,marginBottom:6}}>
          Who are you?
        </div>
        <div style={{fontSize:12,color:"var(--txt2)"}}>Choose your role to get started</div>
      </div>

      {/* Role Cards */}
      <div style={{display:"flex",flexDirection:"column",gap:14,width:"100%",maxWidth:360}}>

        {/* Business Card */}
        <div
          onClick={() => choose("business")}
          style={{
            position:"relative",overflow:"hidden",cursor:"pointer",
            borderRadius:26,padding:"22px 20px",
            background: selected==="business"
              ? "linear-gradient(135deg,rgba(0,229,255,.18),rgba(0,188,212,.08))"
              : "linear-gradient(145deg,rgba(18,18,46,.97),rgba(12,12,30,.98))",
            border: selected==="business"
              ? "1.5px solid rgba(0,229,255,.6)"
              : "1.5px solid rgba(0,229,255,.14)",
            boxShadow: selected==="business"
              ? "0 0 0 4px rgba(0,229,255,.08), 0 8px 32px rgba(0,229,255,.15), 0 4px 0 rgba(0,0,0,.4)"
              : "0 4px 0 rgba(0,0,0,.5), 0 8px 24px rgba(0,0,0,.3)",
            transform: selected==="business" ? "scale(1.02) translateY(-2px)" : "scale(1) translateY(0)",
            transition:"all .25s cubic-bezier(.16,1,.3,1)",
            animation:"fadeUp .6s .18s cubic-bezier(.16,1,.3,1) both",
          }}
          onMouseEnter={e=>{if(!selected){e.currentTarget.style.borderColor="rgba(0,229,255,.35)";e.currentTarget.style.transform="translateY(-2px)";}}}
          onMouseLeave={e=>{if(!selected){e.currentTarget.style.borderColor="rgba(0,229,255,.14)";e.currentTarget.style.transform="translateY(0)";}}}
        >
          {/* Top shimmer line */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:"1.5px",
            background:"linear-gradient(90deg,transparent,rgba(0,229,255,.35),transparent)",
            borderRadius:"26px 26px 0 0"}}/>

          <div style={{display:"flex",alignItems:"center",gap:16}}>
            {/* Animated 3D Business Icon */}
            <div style={{flexShrink:0,width:64,height:64,borderRadius:20,
              background:"linear-gradient(135deg,rgba(0,229,255,.12),rgba(0,188,212,.06))",
              border:"1.5px solid rgba(0,229,255,.22)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 4px 0 rgba(0,0,0,.4), 0 0 20px rgba(0,229,255,.1)",
              animation:"float 3.5s ease-in-out infinite",
              position:"relative",overflow:"hidden"}}>
              {/* Inner highlight */}
              <div style={{position:"absolute",top:0,left:0,right:0,height:"45%",
                background:"linear-gradient(180deg,rgba(255,255,255,.08),transparent)",
                borderRadius:"20px 20px 0 0",pointerEvents:"none"}}/>
              <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
                {/* Building base */}
                <rect x="10" y="28" width="44" height="30" rx="4" fill="url(#bizGrad1)"/>
                {/* Building top */}
                <rect x="18" y="16" width="28" height="16" rx="3" fill="url(#bizGrad2)"/>
                {/* Roof peak */}
                <polygon points="32,4 48,16 16,16" fill="url(#bizGrad3)"/>
                {/* Windows row 1 */}
                <rect x="16" y="34" width="8" height="8" rx="2" fill="rgba(0,229,255,.9)"/>
                <rect x="28" y="34" width="8" height="8" rx="2" fill="rgba(0,229,255,.6)"/>
                <rect x="40" y="34" width="8" height="8" rx="2" fill="rgba(0,229,255,.9)"/>
                {/* Door */}
                <rect x="26" y="46" width="12" height="12" rx="2" fill="rgba(0,229,255,.5)"/>
                {/* Door handle */}
                <circle cx="35" cy="52" r="1.2" fill="rgba(255,255,255,.8)"/>
                {/* Flag */}
                <line x1="32" y1="4" x2="32" y2="14" stroke="rgba(255,255,255,.4)" strokeWidth="1.5"/>
                <defs>
                  <linearGradient id="bizGrad1" x1="10" y1="28" x2="54" y2="58" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1a4a6e"/>
                    <stop offset="100%" stopColor="#0d2d44"/>
                  </linearGradient>
                  <linearGradient id="bizGrad2" x1="18" y1="16" x2="46" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1e5a82"/>
                    <stop offset="100%" stopColor="#0f3655"/>
                  </linearGradient>
                  <linearGradient id="bizGrad3" x1="16" y1="4" x2="48" y2="16" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#00bcd4"/>
                    <stop offset="100%" stopColor="#0097a7"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800,
                marginBottom:4,color:"var(--txt)"}}>
                I'm a Business
              </div>
              <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.5}}>
                Book creators · Run campaigns · Grow your brand
              </div>
              <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                {["🔍 Discover","📊 Analytics","⚡ Instant Book"].map(t=>(
                  <span key={t} style={{fontSize:9,fontWeight:700,
                    padding:"3px 8px",borderRadius:20,
                    background:"rgba(0,229,255,.08)",border:"1px solid rgba(0,229,255,.15)",
                    color:"var(--c)",letterSpacing:.3}}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{flexShrink:0,width:28,height:28,borderRadius:10,
              background: selected==="business" ? "var(--c)" : "rgba(0,229,255,.1)",
              border:"1.5px solid rgba(0,229,255,.3)",
              display:"flex",alignItems:"center",justifyContent:"center",
              transition:"all .2s",fontSize:13}}>
              {selected==="business" ? "✓" : "→"}
            </div>
          </div>
        </div>

        {/* Creator Card */}
        <div
          onClick={() => choose("creator")}
          style={{
            position:"relative",overflow:"hidden",cursor:"pointer",
            borderRadius:26,padding:"22px 20px",
            background: selected==="creator"
              ? "linear-gradient(135deg,rgba(156,106,247,.18),rgba(124,74,247,.08))"
              : "linear-gradient(145deg,rgba(18,18,46,.97),rgba(12,12,30,.98))",
            border: selected==="creator"
              ? "1.5px solid rgba(156,106,247,.6)"
              : "1.5px solid rgba(156,106,247,.14)",
            boxShadow: selected==="creator"
              ? "0 0 0 4px rgba(156,106,247,.08), 0 8px 32px rgba(156,106,247,.15), 0 4px 0 rgba(0,0,0,.4)"
              : "0 4px 0 rgba(0,0,0,.5), 0 8px 24px rgba(0,0,0,.3)",
            transform: selected==="creator" ? "scale(1.02) translateY(-2px)" : "scale(1) translateY(0)",
            transition:"all .25s cubic-bezier(.16,1,.3,1)",
            animation:"fadeUp .6s .26s cubic-bezier(.16,1,.3,1) both",
          }}
          onMouseEnter={e=>{if(!selected){e.currentTarget.style.borderColor="rgba(156,106,247,.35)";e.currentTarget.style.transform="translateY(-2px)";}}}
          onMouseLeave={e=>{if(!selected){e.currentTarget.style.borderColor="rgba(156,106,247,.14)";e.currentTarget.style.transform="translateY(0)";}}}
        >
          <div style={{position:"absolute",top:0,left:0,right:0,height:"1.5px",
            background:"linear-gradient(90deg,transparent,rgba(156,106,247,.4),transparent)",
            borderRadius:"26px 26px 0 0"}}/>

          <div style={{display:"flex",alignItems:"center",gap:16}}>
            {/* Animated 3D Creator Icon */}
            <div style={{flexShrink:0,width:64,height:64,borderRadius:20,
              background:"linear-gradient(135deg,rgba(156,106,247,.15),rgba(124,74,247,.07))",
              border:"1.5px solid rgba(156,106,247,.25)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 4px 0 rgba(0,0,0,.4), 0 0 20px rgba(156,106,247,.12)",
              animation:"float 3.5s ease-in-out .8s infinite",
              position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"45%",
                background:"linear-gradient(180deg,rgba(255,255,255,.08),transparent)",
                borderRadius:"20px 20px 0 0",pointerEvents:"none"}}/>
              <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
                {/* Phone body */}
                <rect x="16" y="8" width="32" height="48" rx="7" fill="url(#creGrad1)"/>
                {/* Screen */}
                <rect x="20" y="14" width="24" height="32" rx="3" fill="url(#creGrad2)"/>
                {/* Play button */}
                <polygon points="28,24 28,38 42,31" fill="rgba(255,255,255,.95)"/>
                {/* Record light */}
                <circle cx="32" cy="49" r="3" fill="rgba(156,106,247,.6)"/>
                {/* Camera notch */}
                <rect x="28" y="10" width="8" height="2.5" rx="1.2" fill="rgba(0,0,0,.4)"/>
                {/* Star sparkles */}
                <circle cx="52" cy="12" r="2.5" fill="#ffab40" opacity=".9"/>
                <circle cx="56" cy="20" r="1.5" fill="#ffab40" opacity=".6"/>
                <circle cx="48" cy="8"  r="1.5" fill="#ffab40" opacity=".7"/>
                <defs>
                  <linearGradient id="creGrad1" x1="16" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3d1a7a"/>
                    <stop offset="100%" stopColor="#1e0a42"/>
                  </linearGradient>
                  <linearGradient id="creGrad2" x1="20" y1="14" x2="44" y2="46" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0d0520"/>
                    <stop offset="100%" stopColor="#160830"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800,
                marginBottom:4,color:"var(--txt)"}}>
                I'm a Creator
              </div>
              <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.5}}>
                Get booked · Earn money · Grow your influence
              </div>
              <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                {["💰 Earn 80%","📱 Manage Bookings","⭐ Build Profile"].map(t=>(
                  <span key={t} style={{fontSize:9,fontWeight:700,
                    padding:"3px 8px",borderRadius:20,
                    background:"rgba(156,106,247,.08)",border:"1px solid rgba(156,106,247,.2)",
                    color:"#c4b5fd",letterSpacing:.3}}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{flexShrink:0,width:28,height:28,borderRadius:10,
              background: selected==="creator" ? "#9c6af7" : "rgba(156,106,247,.1)",
              border:"1.5px solid rgba(156,106,247,.3)",
              display:"flex",alignItems:"center",justifyContent:"center",
              transition:"all .2s",fontSize:13,color:"#fff"}}>
              {selected==="creator" ? "✓" : "→"}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div style={{marginTop:24,fontSize:11,color:"var(--txt3)",textAlign:"center",
        animation:"fadeUp .6s .35s cubic-bezier(.16,1,.3,1) both"}}>
        You can switch roles anytime from the login screen
      </div>
    </div>
  );
}


// ── Hero ───────────────────────────────────────────────
const HeroMemo = React.memo(function Hero({ onSearch, onSelect, extraCreators, onProClick, isPro }) {
  const [q, setQ] = useState("");
  const [vis, setVis] = useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVis(true),60);return()=>clearTimeout(t);},[]);

  const handleSearch = React.useCallback(()=>{ if(q.trim()) onSearch(q); },[q,onSearch]);
  const handleCatSearch = React.useCallback((label)=>onSearch(label),[onSearch]);

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",
      position:"relative",width:"100%",maxWidth:430,boxSizing:"border-box"}}>

      {/* Background — clipped, no blur filters */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        <Particles/>
        <div style={{position:"absolute",top:"50%",left:"50%",
          transform:"translate(-50%,-50%)",width:320,height:320,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(0,229,255,.04) 0%,transparent 60%)"}}/>
      </div>

      {/* Padded content */}
      <div style={{position:"relative",width:"100%",padding:"20px 16px 0px",
        opacity:vis?1:0,transition:"opacity .2s",zIndex:1,boxSizing:"border-box"}}>

        {/* Search bar */}
        <div style={{display:"flex",width:"100%",margin:"0 auto 10px",
          background:"linear-gradient(145deg,rgba(20,20,48,.9),rgba(12,12,30,.9))",border:"1.5px solid rgba(0,229,255,.22)",
          borderRadius:28,padding:"7px 8px 7px 20px",
          boxShadow:"0 0 0 1px rgba(0,229,255,.05),0 8px 24px rgba(0,0,0,.4)",
          boxSizing:"border-box",transition:"border-color .18s,box-shadow .18s"}}
          onFocusCapture={e=>{e.currentTarget.style.borderColor="rgba(0,229,255,.45)";e.currentTarget.style.boxShadow="0 6px 0 #006678, 0 10px 28px rgba(0,229,255,.25), 0 2px 0 rgba(255,255,255,.06) inset"}}
          onBlurCapture={e=>{e.currentTarget.style.borderColor="rgba(0,229,255,.18)";e.currentTarget.style.boxShadow="0 6px 0 rgba(0,0,0,.42), 0 10px 24px rgba(0,0,0,.45), 0 1px 0 rgba(255,255,255,.05) inset"}}>
          <input value={q} onChange={e=>setQ(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleSearch()}
            placeholder="Search creator, niche, platform..."
            style={{flex:1,background:"none",border:"none",outline:"none",boxShadow:"none",
              color:"var(--txt)",fontSize:13,minWidth:0}}/>
          <button
            onClick={e=>{
              const btn=e.currentTarget;
              btn.style.transform="scale(0.88)";
              setTimeout(()=>{btn.style.transform="scale(1)";handleSearch();},90);
            }}
            style={{width:40,height:40,borderRadius:14,border:"none",flexShrink:0,
              background:"linear-gradient(135deg,var(--c),var(--c2))",
              display:"flex",alignItems:"center",justifyContent:"center",
              cursor:"pointer",boxShadow:"0 0 12px rgba(0,229,255,.35)",
              transition:"transform .15s cubic-bezier(.22,.68,0,1.2),box-shadow .18s",
              willChange:"transform"}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 0 22px rgba(0,229,255,.6)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="0 0 12px rgba(0,229,255,.35)"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="10.5" cy="10.5" r="6.5" stroke="#070710" strokeWidth="2.3"/>
              <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="#070710" strokeWidth="2.3" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Suggestion train — BELOW search bar, true edge-to-edge ── */}
      <div style={{
        position:"relative",overflow:"hidden",
        width:"100%",height:36,flexShrink:0,
        marginBottom:6,zIndex:1,
        opacity:vis?1:0,transition:"opacity .25s .1s"}}>

        {/* Transparent fade masks — NO solid colour, just alpha fade */}
        <div style={{position:"absolute",left:0,top:0,bottom:0,width:32,zIndex:2,
          background:"linear-gradient(to right,var(--bg),transparent)",
          pointerEvents:"none"}}/>
        <div style={{position:"absolute",right:0,top:0,bottom:0,width:32,zIndex:2,
          background:"linear-gradient(to left,var(--bg),transparent)",
          pointerEvents:"none"}}/>

        {/* Scrolling track */}
        <div style={{
          display:"flex",gap:6,padding:"3px 0",
          animation:"categoryScroll 18s linear infinite",
          willChange:"transform",width:"max-content"}}
          onMouseEnter={e=>e.currentTarget.style.animationPlayState="paused"}
          onMouseLeave={e=>e.currentTarget.style.animationPlayState="running"}>
          {[...PROMOTION_CATEGORIES,...PROMOTION_CATEGORIES].map((cat,i)=>(
            <button key={`${cat.id}-${i}`}
              onClick={()=>handleCatSearch(cat.label)}
              style={{
                flexShrink:0,display:"inline-flex",alignItems:"center",gap:5,
                padding:"6px 13px",borderRadius:20,cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,
                border:"1.5px solid rgba(255,171,64,.22)",
                background:"rgba(255,171,64,.06)",color:"var(--amb)",
                whiteSpace:"nowrap",height:28,
                transition:"background .1s,border-color .1s,transform .1s",
                willChange:"transform"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,171,64,.16)";e.currentTarget.style.borderColor="rgba(255,171,64,.45)";e.currentTarget.style.transform="scale(1.04)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,171,64,.06)";e.currentTarget.style.borderColor="rgba(255,171,64,.2)";e.currentTarget.style.transform="scale(1)"}}>
              <span style={{display:"flex",alignItems:"center",flexShrink:0,opacity:.85}}>{CAT_ICONS[cat.icon]?.(12)}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cleo Voice Bot — below the train */}
      <div style={{position:"relative",width:"100%",padding:"0 16px 12px",
        zIndex:1,boxSizing:"border-box",
        opacity:vis?1:0,transition:"opacity .25s .15s"}}>
        <VoiceBot onSelect={onSelect} extraCreators={extraCreators||[]} onProClick={onProClick} isPro={isPro}/>
      </div>

    </div>
  );
});
// Keep Hero name for backward compat
const Hero = HeroMemo;

// ── Filter Bar ─────────────────────────────────────────
function FilterBar({ filters, setFilters }) {
  const [openSheet, setOpenSheet] = useState(null);

  const activeCount = Object.values(filters).filter(Boolean).length;

  // Filter options only (no category — that's in the horizontal strip)
  const FILTER_DEFS = [
    {
      key:"platform", label:"Platform", icon:"platform",
      options:[{v:"",l:"All Platforms"},{v:"Instagram",l:"Instagram"},{v:"YouTube",l:"YouTube"},{v:"Both",l:"Both"}]
    },
    {
      key:"followers", label:"Size", icon:"followers",
      options:[{v:"",l:"Any Size"},{v:"nano",l:"Nano · 10K–50K"},{v:"micro",l:"Micro · 50K–500K"},{v:"macro",l:"Macro · 500K–2M"},{v:"mega",l:"Mega · 2M+"}]
    },
    {
      key:"rating", label:"Rating", icon:"rating",
      options:[{v:"",l:"Any Rating"},{v:"4.0",l:"4.0+ ★"},{v:"4.5",l:"4.5+ ★"}]
    },
    {
      key:"city", label:"City", icon:"city",
      options:[{v:"",l:"Any City"},...CITIES.map(c=>({v:c,l:c}))]
    },
    {
      key:"budget", label:"Budget", icon:"budget",
      options:[{v:"",l:"Any Budget"},{v:"5000",l:"Under ₹5K"},{v:"10000",l:"Under ₹10K"},{v:"25000",l:"Under ₹25K"},{v:"50000",l:"Under ₹50K"},{v:"100000",l:"Under ₹1L"}]
    },
    {
      key:"niche", label:"Category", icon:"niche",
      options:[{v:"",l:"All Categories"},...NICHES.map(n=>({v:n,l:n}))]
    },
  ];

  const getLabel = (key, val) => {
    const def = FILTER_DEFS.find(d=>d.key===key);
    if (!def || !val) return null;
    const opt = def.options.find(o=>o.v===val);
    return opt?.l || val;
  };

  return (
    <>
      {/* ── Filter bar ── */}
      <div style={{borderBottom:"1px solid var(--b)",background:"linear-gradient(145deg,rgba(16,16,38,.97),rgba(10,10,26,.99))"}}>
        <div style={{maxWidth:430,margin:"0 auto",padding:"8px 14px 10px"}}>

          {/* Row: FILTERS label + clear + refresh */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.8}}>FILTERS</span>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              {activeCount > 0 && (
                <button onClick={()=>setFilters({platform:"",followers:"",rating:"",city:"",budget:"",niche:""})}
                  style={{display:"flex",alignItems:"center",gap:4,
                    padding:"4px 10px",borderRadius:50,cursor:"pointer",
                    background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.25)",
                    color:"var(--red)",fontSize:10,fontWeight:700,
                    fontFamily:"'DM Sans',sans-serif"}}>
                  ✕ Clear all
                </button>
              )}
              <button onClick={()=>window.location.reload()}
                style={{background:"rgba(0,229,255,.08)",border:"1px solid rgba(0,229,255,.18)",
                  borderRadius:50,padding:"4px 11px",color:"var(--c)",cursor:"pointer",
                  fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:4,
                  transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,.18)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(0,229,255,.08)"}>
                ↻ Refresh
              </button>
            </div>
          </div>

          {/* Filter pills — 3 per row using a wrap grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
            {FILTER_DEFS.map(def => {
              const active = !!filters[def.key];
              const label = active ? getLabel(def.key, filters[def.key]) : def.label;
              const shortLabel = label && label.length > 10 ? label.slice(0,10)+"…" : label;
              return (
                <button key={def.key}
                  onClick={()=>setOpenSheet(openSheet===def.key?null:def.key)}
                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                    gap:4,padding:"8px 10px",borderRadius:16,cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:active?700:400,
                    border: active?"2px solid var(--c)":"1px solid var(--b)",
                    background: active?"rgba(0,229,255,.08)":openSheet===def.key?"rgba(0,229,255,.05)":"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
                    color: active?"var(--c)":openSheet===def.key?"var(--c)":"var(--txt2)",
                    transition:"all .18s",minWidth:0,overflow:"hidden"}}>
                  <span style={{display:"flex",alignItems:"center",color:"inherit",flexShrink:0,opacity:.9}}>{FILTER_ICONS[def.icon]?.(12)}</span>
                  <span style={{flex:1,textAlign:"left",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:11}}>
                    {shortLabel}
                  </span>
                  <span style={{fontSize:8,opacity:.6,flexShrink:0}}>{openSheet===def.key?"▲":"▾"}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom sheet popup */}
      {openSheet && (() => {
        const def = FILTER_DEFS.find(d=>d.key===openSheet);
        if (!def) return null;
        return (
          <>
            <div onClick={()=>setOpenSheet(null)}
              style={{position:"fixed",inset:0,zIndex:198,
                background:"rgba(0,0,0,.55)",backdropFilter:"blur(6px)"}}/>
            <div style={{position:"fixed",bottom:0,left:0,right:0,margin:"0 auto",
              width:"100%",maxWidth:430,zIndex:199,
              background:"linear-gradient(145deg,rgba(16,16,38,.97),rgba(10,10,26,.99))",borderRadius:"20px 20px 0 0",
              borderTop:"1px solid var(--b2)",
              boxShadow:"0 -12px 48px rgba(0,0,0,.7)",
              animation:"fadeUp .25s cubic-bezier(.16,1,.3,1) both",
              maxHeight:"72vh",display:"flex",flexDirection:"column"}}>

              {/* Pull handle */}
              <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}>
                <div style={{width:40,height:4,borderRadius:2,background:"var(--b2)"}}/>
              </div>

              {/* Header */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"12px 18px 10px",borderBottom:"1px solid var(--b)"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:34,height:34,borderRadius:14,flexShrink:0,
                    background:"linear-gradient(145deg,rgba(0,229,255,.14),rgba(0,188,212,.07))",border:"1px solid rgba(0,229,255,.18)",
                    display:"flex",alignItems:"center",justifyContent:"center",color:"var(--c)"}}>
                    {FILTER_ICONS[def.icon]?.(18)}
                  </div>
                  <div>
                    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,lineHeight:1.2}}>
                      {def.label}
                    </div>
                    <div style={{fontSize:10,color:"var(--txt2)",marginTop:2}}>
                      {filters[def.key] ? "1 selected" : "Tap to select"}
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  {filters[def.key] && (
                    <button onClick={()=>{setFilters(f=>({...f,[def.key]:""}));setOpenSheet(null);}}
                      style={{padding:"5px 11px",borderRadius:50,border:"1px solid rgba(248,113,113,.3)",
                        background:"rgba(248,113,113,.08)",color:"var(--red)",
                        fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                      Clear
                    </button>
                  )}
                  <button onClick={()=>setOpenSheet(null)}
                    style={{width:28,height:28,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,.07)",
                      background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",cursor:"pointer",color:"var(--txt2)",
                      fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",
                      fontFamily:"system-ui"}}>✕</button>
                </div>
              </div>

              {/* Options list */}
              <div style={{overflowY:"auto",padding:"10px 14px 32px"}} className="nosb">
                {def.options.map((opt,i) => {
                  const selected = filters[def.key] === opt.v;
                  const isEmpty = opt.v === "";
                  return (
                    <button key={opt.v}
                      onClick={()=>{ setFilters(f=>({...f,[def.key]:opt.v})); setOpenSheet(null); }}
                      style={{width:"100%",display:"flex",alignItems:"center",
                        justifyContent:"space-between",gap:10,
                        padding:"12px 14px",borderRadius:16,cursor:"pointer",
                        textAlign:"left",marginBottom:5,
                        border: selected ? "2px solid var(--c)" : isEmpty && i===0 ? "1px solid var(--b)" : "1px solid var(--b)",
                        background: selected ? "rgba(0,229,255,.09)" : "linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                        transition:"background .15s,border-color .15s"}}>
                      <span style={{fontSize:13,fontWeight:selected?700:400,
                        color:selected?"var(--c)":isEmpty?"var(--txt2)":"var(--txt)",
                        fontFamily:"'DM Sans',sans-serif",lineHeight:1.3}}>
                        {opt.l}
                      </span>
                      {selected
                        ? <div style={{width:20,height:20,borderRadius:"50%",background:"var(--c)",flexShrink:0,
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:11,color:"#070710",fontWeight:800}}>✓</div>
                        : <div style={{width:20,height:20,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,.07)",flexShrink:0}}/>
                      }
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        );
      })()}
    </>
  );
}

// ── Section Header ─────────────────────────────────────
function SecHead({ title, sub, icon }) {
  return (
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:4}}>
        {icon && <div style={{width:32,height:32,borderRadius:14,background:"var(--cdim)",
          border:"1.5px solid rgba(0,229,255,.22)",display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:15}}>{icon}</div>}
        <h2 style={{fontSize:"clamp(19px,3vw,27px)",fontWeight:800}}>{title}</h2>
      </div>
      {sub && <p style={{color:"var(--txt2)",fontSize:13,marginLeft:icon?43:0}}>{sub}</p>}
    </div>
  );
}

// ── AI Matching ────────────────────────────────────────
// ── Card Grid ──────────────────────────────────────────
function Grid({ items, onSelect, boostedCreatorIds=[], categoryId=null }) {
  const isItemBoosted = (inf) => {
    // Gold ONLY when viewing a specific category AND the creator's ad covers that category
    if (!categoryId) return false;
    const uid = inf.uid || inf.id?.toString();
    const boostedByCat = window.__boostedByCategory || {};
    return (boostedByCat[categoryId]||[]).includes(uid) ||
           (boostedByCat[categoryId]||[]).includes(inf.id?.toString());
  };
  if (!items.length) return (
    <div style={{textAlign:"center",padding:"70px 20px",color:"var(--txt2)"}}>
      <div style={{fontSize:44,marginBottom:14,opacity:.35}}>🔍</div>
      <div style={{fontSize:17,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700}}>No creators found</div>
      <div style={{fontSize:13,marginTop:7}}>Try adjusting your filters</div>
    </div>
  );
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr",gap:14,contain:"layout"}}>
      {items.map((inf,i)=>(
        <div key={inf.uid||inf.id} style={{animation:`cardIn .38s ${Math.min(i*.055,0.4)}s cubic-bezier(.22,.68,0,1.2) both`,willChange:"transform,opacity"}}>
          <InfCard inf={inf} onClick={onSelect} boosted={isItemBoosted(inf)}/>
        </div>
      ))}
    </div>
  );
}

// ── Discover Page ──────────────────────────────────────
const DiscoverPage = React.memo(function DiscoverPage({ onSelect, searchTerm, setSearchTerm, extraCreators=[], boostedCreatorIds=[], onProClick, isPro=false }) {
  const [filters, setFilters] = useState({platform:"",followers:"",rating:"",city:"",budget:"",niche:""});
  const [activeCategory, setActiveCategory] = useState(""); // category strip filter
  const active = !!(searchTerm);  // Only search term triggers search mode — filters show inline
  // Merge local + Firebase creators
  const ALL_INFS = [...INFS, ...extraCreators];

  const filtered = ALL_INFS.filter(inf => {
    const q = searchTerm.toLowerCase();
    if (q && ![inf.name,inf.niche,inf.platform,inf.handle,inf.city].some(v=>v.toLowerCase().includes(q))) return false;
    if (filters.platform && inf.platform !== filters.platform && !(inf.platform==="Both" && (filters.platform==="Instagram"||filters.platform==="YouTube"))) return false;
    // category filter handled by the horizontal strip (activeCategory), not here
    if (filters.niche && inf.niche !== filters.niche) return false;
    if (filters.city && inf.city !== filters.city) return false;
    if (filters.rating && inf.rating < parseFloat(filters.rating)) return false;
    if (filters.budget && getBasePrice(inf) > parseInt(filters.budget)) return false;
    if (filters.followers) {
      const f = inf.followers;
      if (filters.followers==="nano" && f>=50000) return false;
      if (filters.followers==="micro" && (f<50000||f>=500000)) return false;
      if (filters.followers==="macro" && (f<500000||f>=2000000)) return false;
      if (filters.followers==="mega" && f<2000000) return false;
    }
    // Category strip filter — match against creator's categories array
    if (activeCategory) {
      const cats = inf.categories || [];
      if (!cats.includes(activeCategory)) return false;
    }
    return true;
  });

  // Sort creators — when categoryId given, boosted = has active ad for that category
  // Gold card is ONLY shown in category context (not on global/search view)
  const sortWithBoosted = (list, categoryId=null) => {
    const now = Date.now();
    const boostedByCat = window.__boostedByCategory || {};
    const isBoostedInCat = (i) => {
      if (!categoryId) return false; // no gold on global view
      const uid = i.uid || i.id?.toString();
      if (!uid) return false;
      return (boostedByCat[categoryId] || []).includes(uid) ||
             (boostedByCat[categoryId] || []).includes(i.id?.toString());
    };
    const boosted = list.filter(isBoostedInCat);
    const rest    = list.filter(i => !isBoostedInCat(i));
    return [...boosted, ...rest];
  };

  // Search mode — only triggered by searchTerm
  if (active) {
    return (
      <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 124px)",overflow:"hidden",maxWidth:430,width:"100%",margin:"0 auto",
        animation:"searchExpand .22s cubic-bezier(.22,.68,0,1.2) both",willChange:"transform,opacity"}}>
        <div style={{flexShrink:0,background:"linear-gradient(145deg,rgba(16,16,38,.97),rgba(10,10,26,.99))",borderBottom:"1px solid var(--b2)",padding:"10px 14px 8px"}}>
          <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:6}}>
            <button onClick={()=>setSearchTerm("")} style={{
              width:32,height:32,borderRadius:"50%",border:"1.5px solid rgba(0,229,255,.22)",
              background:"none",cursor:"pointer",flexShrink:0,
              display:"flex",alignItems:"center",justifyContent:"center",
              color:"var(--txt2)",fontSize:15,transition:"all .18s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--c)";e.currentTarget.style.color="var(--c)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b2)";e.currentTarget.style.color="var(--txt2)"}}>
              ←
            </button>
            <div style={{flex:1,display:"flex",alignItems:"center",gap:8,
              background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(0,229,255,.22)",borderRadius:50,padding:"7px 14px",
              transition:"border-color .18s,box-shadow .18s"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,opacity:.5}}>
                <circle cx="10.5" cy="10.5" r="6.5" stroke="var(--txt2)" strokeWidth="2.5"/>
                <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="var(--txt2)" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} autoFocus
                placeholder="Search creator, category, platform..."
                style={{flex:1,background:"none",border:"none",outline:"none",boxShadow:"none",
                  color:"var(--txt)",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}/>
              {searchTerm && <button onClick={()=>setSearchTerm("")} style={{background:"none",border:"none",cursor:"pointer",color:"var(--txt2)",fontSize:15,lineHeight:1,padding:0,flexShrink:0,transition:"color .15s"}}
                onMouseEnter={e=>e.currentTarget.style.color="var(--red)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--txt2)"}>✕</button>}
            </div>
          </div>
          <div style={{fontSize:11,color:"var(--txt2)",paddingLeft:41,animation:"fadeIn .2s both"}}>
            <span style={{color:"var(--c)",fontWeight:700}}>{filtered.length}</span>
            {" "}creator{filtered.length!==1?"s":""} for <span style={{color:"var(--txt)",fontStyle:"italic"}}>"{searchTerm}"</span>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"12px 14px 16px",animation:"searchResultsIn .28s cubic-bezier(.22,.68,0,1.2) both",willChange:"transform,opacity"}} className="nosb">
          <Grid items={sortWithBoosted(filtered)} onSelect={onSelect} boostedCreatorIds={boostedCreatorIds}/>
        </div>
      </div>
    );
  }

  // ── Has filters active — show inline filtered results on the normal page ──
  const filtersActive = Object.values(filters).some(Boolean); // category handled by activeCategory strip

  // Default — show full hero page (with inline filter results when filters active)
  return (
    <div>
      <Hero onSearch={setSearchTerm} onSelect={onSelect} extraCreators={extraCreators} onProClick={onProClick} isPro={isPro}/>
      <FilterBar filters={filters} setFilters={setFilters}/>

      {/* ── Inline filter results — shown directly when any filter is active ── */}
      {filtersActive && (
        <div style={{maxWidth:430,margin:"0 auto",padding:"14px 16px 0"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{fontSize:12,color:"var(--txt2)"}}>
              <span style={{color:"var(--c)",fontWeight:700,fontSize:14}}>{filtered.length}</span>
              {" "}creator{filtered.length!==1?"s":""} matching filters
            </div>
            <button onClick={()=>setFilters({platform:"",followers:"",rating:"",city:"",budget:"",niche:""})}
              style={{background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",
                borderRadius:12,padding:"4px 10px",color:"var(--red)",fontSize:11,
                cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>
              Clear filters ✕
            </button>
          </div>
          <Grid items={sortWithBoosted(filtered)} onSelect={onSelect} boostedCreatorIds={boostedCreatorIds}/>
        </div>
      )}

      {/* ── Category strip + grouped results — only shown when no filter active ── */}
      {!filtersActive && <>

      {/* ── Category horizontal strip ── */}
      <div style={{background:"linear-gradient(145deg,rgba(16,16,38,.97),rgba(10,10,26,.99))",borderBottom:"1px solid var(--b)",
        paddingBottom:10,position:"sticky",top:56,zIndex:10}}>
        {/* Categories heading row */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"10px 14px 8px"}}>
          <span style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.8}}>CATEGORIES</span>
          {activeCategory && (
            <button onClick={()=>setActiveCategory("")}
              style={{fontSize:10,color:"var(--c)",fontWeight:700,background:"none",
                border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",padding:0}}>
              Show all ✕
            </button>
          )}
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",padding:"0 14px 0"}} className="nosb">

          {PROMOTION_CATEGORIES.map(cat=>(
            <button key={cat.id} onClick={()=>setActiveCategory(activeCategory===cat.id?"":cat.id)}
              style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,
                padding:"7px 14px",borderRadius:50,cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:500,
                border: activeCategory===cat.id ? "none" : "1px solid var(--b)",
                background: activeCategory===cat.id ? "var(--c)" : "linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
                color: activeCategory===cat.id ? "#070710" : "var(--txt2)",
                transition:"all .2s",whiteSpace:"nowrap"}}>
              <span style={{display:"flex",alignItems:"center",opacity:.85}}>{CAT_ICONS[cat.icon]?.(13)}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px"}}>
        {activeCategory ? (
          /* Filtered by selected category */
          <section>
            {(() => {
              const cat = PROMOTION_CATEGORIES.find(c=>c.id===activeCategory);
              const boostedByCat = window.__boostedByCategory || {};
              const boostedHere = (boostedByCat[activeCategory]||[]);
              // Show if: profile has this category OR running ad for this category
              const seen = new Set();
              const catCreators = sortWithBoosted(
                ALL_INFS.filter(inf => {
                  const k = inf.uid || inf.id?.toString() || inf.id;
                  if (seen.has(k)) return false;
                  seen.add(k);
                  const inProfile = (inf.categories||[]).includes(activeCategory);
                  const hasAdHere = boostedHere.includes(inf.uid) ||
                                    boostedHere.includes(inf.uid?.toString()) ||
                                    boostedHere.includes(inf.id?.toString());
                  return inProfile || hasAdHere;
                }),
                activeCategory
              );
              return <>
                <SecHead
                  title={`${cat?.icon} ${cat?.label}`}
                  sub={catCreators.length > 0
                    ? `${catCreators.length} creator${catCreators.length!==1?"s":""} for ${cat?.label} campaigns`
                    : "No creators in this category yet"}
                  icon=""/>
                {catCreators.length > 0
                  ? <Grid items={catCreators} onSelect={onSelect} boostedCreatorIds={boostedCreatorIds} categoryId={activeCategory}/>
                  : <div style={{textAlign:"center",padding:"40px 20px",color:"var(--txt2)",fontSize:13}}>
                      No creators have listed this category yet.
                    </div>
                }
              </>;
            })()}
          </section>
        ) : (
          /* Show all — grouped by profile category */
          <>
            {PROMOTION_CATEGORIES.map(cat => {
              const boostedByCat = window.__boostedByCategory || {};
              const boostedHere = (boostedByCat[cat.id]||[]);
              // Show if: profile has this category OR running ad for this category
              const seen = new Set();
              const catCreators = sortWithBoosted(
                ALL_INFS.filter(inf => {
                  const k = inf.uid || inf.id?.toString() || inf.id;
                  if (seen.has(k)) return false;
                  seen.add(k);
                  const inProfile = (inf.categories||[]).includes(cat.id);
                  const hasAdHere = boostedHere.includes(inf.uid) ||
                                    boostedHere.includes(inf.uid?.toString()) ||
                                    boostedHere.includes(inf.id?.toString());
                  return inProfile || hasAdHere;
                }),
                cat.id
              );
              if (catCreators.length === 0) return null;
              return (
                <section key={cat.id} style={{marginBottom:28}}>
                  <SecHead title={`${cat.icon} ${cat.label}`} sub={`${catCreators.length} creator${catCreators.length!==1?"s":""}`} icon=""/>
                  <Grid items={catCreators} onSelect={onSelect} boostedCreatorIds={boostedCreatorIds} categoryId={cat.id}/>
                </section>
              );
            })}
          </>
        )}
      </div>
    </>}
    </div>
  );
});

// ── Stat Box ───────────────────────────────────────────
function StatBox({ label, value, sub, color="var(--c)" }) {
  return (
    <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:22,
      padding:"18px 16px",position:"relative",overflow:"hidden",transition:"all .25s",
      display:"flex",flexDirection:"column",justifyContent:"flex-start"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,229,255,.2)";e.currentTarget.style.boxShadow="0 0 28px rgba(0,229,255,.06)"}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b)";e.currentTarget.style.boxShadow="none"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,
        background:`linear-gradient(90deg,transparent,${color},transparent)`,opacity:.55}}/>
      <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:8,lineHeight:1}}>{label}</div>
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color,lineHeight:1,marginBottom:6}}>{value}</div>
      <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1,minHeight:14}}>{sub||""}</div>
    </div>
  );
}

// ── Booking Modal ──────────────────────────────────────
// Real India 2026 market rates — each creator has exact prices per promo type
// stored in inf.prices object: {story, reel, video, personalad}
// For Instagram creators: story + reel available; video = 0 (YouTube only)
// For YouTube creators: video available; story/reel = 0 (Instagram only)
function getPromoPrice(inf, type) {
  if (inf && inf.prices && inf.prices[type]) return inf.prices[type];
  // Fallback to multiplier if prices not set
  const mult = {story:0.45, reel:1.0, video:1.65, personalad:2.2, personalvideo:1.8};
  return Math.round((inf?.price || 0) * (mult[type] || 1));
}

// Returns the cheapest price across all promotion types the creator offers.
// If creator has set promotionTypes, uses only those. Otherwise falls back to all set prices or inf.price.
function getBasePrice(inf) {
  if (!inf) return 0;
  const allKeys = ["story","reel","video","personalvideo","personalad"];
  const activeKeys = (inf.promotionTypes && inf.promotionTypes.length > 0)
    ? inf.promotionTypes
    : allKeys;
  if (inf.prices) {
    const vals = activeKeys.map(k => inf.prices[k]).filter(v => v && v > 0);
    if (vals.length > 0) return Math.min(...vals);
  }
  // Fallback: use inf.price (base reel price), derive cheapest via multiplier
  if (inf.price) {
    const mult = {story:0.45, reel:1.0, video:1.65, personalvideo:1.8, personalad:2.2};
    const vals = activeKeys.map(k => Math.round(inf.price * (mult[k] || 1))).filter(v => v > 0);
    if (vals.length > 0) return Math.min(...vals);
    return inf.price;
  }
  return 0;
}

const PROMO_TYPES = [
  {
    key:"story",
    label:"Story Promotion",
    icon:"📸",
    tag:"Instagram Only",
    tagColor:"var(--grn)",
    desc:"Your brand featured in a 24-hour Instagram Story with a swipe-up link directly to your product.",
    features:["Instagram Story only","Swipe-up CTA link","24-hr visibility","Quick turnaround"],
  },
  {
    key:"reel",
    label:"Reel Promotion",
    icon:"🎬",
    tag:"Instagram Only",
    tagColor:"var(--c)",
    desc:"Your brand promoted in an Instagram Reel — short vertical video that stays on the creator's profile permanently.",
    features:["Instagram Reel only","Permanent on profile","High organic reach","Caption + hashtags"],
  },
  {
    key:"video",
    label:"Video Promotion",
    icon:"▶",
    tag:"YouTube Only",
    tagColor:"var(--amb)",
    desc:"A 30–60 second brand promotion placed mid-roll inside the creator's YouTube video, reaching their loyal subscriber base.",
    features:["YouTube mid-roll ad","30–60 sec duration","Appears mid-video","Description link included"],
  },
  {
    key:"personalvideo",
    label:"Personal Video Promotion",
    icon:"🎥",
    tag:"Premium",
    tagColor:"var(--pur)",
    desc:"A fully scripted personal video promotion dedicated to your brand, posted on the creator's main profile.",
    features:["Dedicated brand video","Scripted content","Posted on profile","Exclusive for your brand"],
  },
  {
    key:"personalad",
    label:"Personal Ad",
    icon:"👤",
    tag:"Premium",
    tagColor:"var(--pur)",
    desc:"Exclusive scripted brand content across both Instagram and YouTube. Creator becomes the face of your campaign.",
    features:["Instagram + YouTube","Exclusive brand script","Full usage rights","60-day campaign"],
  },
];

function BookModal({ inf, onClose, onSuccess, bizId="", isPro=false }) {
  const [step, setStep] = useState(1);
  const [promoKey, setPromoKey] = useState("reel");
  const [promotionCategory, setPromotionCategory] = useState("");
  const [form, setForm] = useState({
    dur:"7 days", msg:"", card:"", exp:"", cvv:"",
    productName:"", targetAudience:"", hashtags:""
  });
  const [briefErrors, setBriefErrors] = useState({});
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [proc, setProc] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]); // [{name, url, type}]
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileRef = useRef(null);

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files||[]).slice(0,3); // max 3 files
    if (!files.length) return;
    setUploadingMedia(true);
    const uploaded = [];
    for (const file of files) {
      try {
        if (window.__cloudinaryUpload) {
          const url = await window.__cloudinaryUpload(file, "collancer_briefs");
          uploaded.push({ name:file.name, url, type:file.type.startsWith("video")?"video":"image" });
        } else {
          // Fallback: store as object URL for preview (won't persist)
          uploaded.push({ name:file.name, url:URL.createObjectURL(file), type:file.type.startsWith("video")?"video":"image" });
        }
      } catch(err) { console.error("Upload error:", err); }
    }
    setMediaFiles(prev=>[...prev, ...uploaded].slice(0,3));
    setUploadingMedia(false);
  };

  const selectedPromo = PROMO_TYPES.find(p=>p.key===promoKey);
  const basePrice = getPromoPrice(inf, promoKey);
  const promoPrice = isPro ? Math.round(basePrice * 0.9) : basePrice;
  // Only show categories the creator accepts — or all if creator hasn't set any
  const availableCategories = inf.categories && inf.categories.length > 0
    ? PROMOTION_CATEGORIES.filter(c => inf.categories.includes(c.id))
    : PROMOTION_CATEGORIES;

  // Only show promo types the creator has explicitly opted into (via Set Promotions flow).
  // If they haven't set promotionTypes yet, fall back to platform-based filtering.
  const getAvailablePromoTypes = () => {
    if (inf.promotionTypes && inf.promotionTypes.length > 0) {
      // Creator has set their promotion types — only show those
      return PROMO_TYPES.filter(pt => inf.promotionTypes.includes(pt.key));
    }
    // Legacy fallback: filter by platform
    if (inf.platform==="Instagram") return PROMO_TYPES.filter(pt => pt.key!=="video");
    if (inf.platform==="YouTube")   return PROMO_TYPES.filter(pt => pt.key==="video"||pt.key==="personalad"||pt.key==="personalvideo");
    return PROMO_TYPES;
  };
  const availablePromoTypes = getAvailablePromoTypes();

  const inp = {background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:14,
    padding:"11px 13px",color:"var(--txt)",fontSize:13,outline:"none",
    fontFamily:"'DM Sans',sans-serif",width:"100%",transition:"border-color .2s"};

  const pay = async () => {
    setProc(true);
    await new Promise(r=>setTimeout(r,1800));
    setProc(false); setStep(4);
  };

  return (
    <div className="mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mbox">
        <div style={{padding:"16px 16px 0"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:11}}>
              <Avatar inf={inf} size={42}/>
              <div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:700}}>{inf.name}</div>
                <div style={{fontSize:11,color:"var(--txt2)"}}>{inf.handle} · {inf.city}</div>
              </div>
            </div>
            <button onClick={onClose} style={{background:"none",border:"none",color:"var(--txt2)",cursor:"pointer",fontSize:20,lineHeight:1}}>✕</button>
          </div>
          {/* Steps */}
          <div style={{display:"flex",marginBottom:22}}>
            {["Campaign","Confirm","Payment","Done"].map((s,i)=>(
              <div key={s} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:26,height:26,borderRadius:"50%",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",
                  background:step>i+1?"var(--c)":step===i+1?"var(--c)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                  color:step>=i+1?"var(--bg)":"var(--txt2)",
                  border:step>=i+1?"none":"1px solid var(--b)",
                  transition:"all .3s",
                  boxShadow:step===i+1?"0 0 14px rgba(0,229,255,.4)":"none"}}>
                  {step>i+1?"✓":i+1}
                </div>
                <div style={{fontSize:10,color:step===i+1?"var(--c)":"var(--txt2)",
                  fontWeight:step===i+1?700:400}}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{padding:"0 16px 16px"}}>
          {step===1 && (
            <div className="fi">
              <div style={{fontSize:11,color:"var(--txt2)",marginBottom:10,fontWeight:700,letterSpacing:.6}}>CHOOSE PROMOTION TYPE</div>
              <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:14}}>
                {availablePromoTypes.map((pt,i)=>{
                  const price = getPromoPrice(inf, pt.key);
                  const active = promoKey===pt.key;
                  return (
                    <div key={pt.key} onClick={()=>setPromoKey(pt.key)}
                      style={{
                        borderRadius:13,padding:"13px 14px",cursor:"pointer",
                        background:active?"rgba(0,229,255,.07)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                        border:active?"1px solid rgba(0,229,255,.35)":"1px solid var(--b)",
                        transition:"all .22s",position:"relative",overflow:"hidden",
                        animation:`fadeUp .35s ${i*0.07}s both`
                      }}>
                      {/* Active glow top bar */}
                      {active && <div style={{position:"absolute",top:0,left:0,right:0,height:2,
                        background:"linear-gradient(90deg,transparent,var(--c),transparent)"}}/>}
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          {/* Radio */}
                          <div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,
                            border:active?"2px solid var(--c)":"2px solid var(--txt2)",
                            background:active?"var(--c)":"transparent",
                            display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
                            {active&&<div style={{width:7,height:7,borderRadius:"50%",background:"var(--bg)"}}/>}
                          </div>
                          <span style={{fontSize:18}}>{pt.icon}</span>
                          <div>
                            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                              <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,
                                color:active?"var(--c)":"var(--txt)"}}>{pt.label}</span>
                              <span style={{fontSize:9,padding:"2px 7px",borderRadius:50,fontWeight:700,
                                background:pt.tagColor+"18",color:pt.tagColor,border:`1px solid ${pt.tagColor}33`}}>
                                {pt.tag}
                              </span>
                            </div>
                            <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.5}}>{pt.desc}</div>
                          </div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:15,fontWeight:700,
                            color:active?"var(--c)":"var(--txt2)"}}>{inr(price)}</div>
                          <div style={{fontSize:9,color:"var(--txt2)",marginTop:2}}>per post</div>
                        </div>
                      </div>
                      {active && (
                        <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(0,229,255,.15)",
                          display:"flex",gap:6,flexWrap:"wrap"}}>
                          {pt.features.map(f=>(
                            <span key={f} style={{fontSize:10,padding:"3px 8px",borderRadius:50,
                              background:"rgba(0,229,255,.08)",color:"var(--c)",border:"1.5px solid rgba(0,229,255,.18)"}}>
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{marginBottom:13,display:"flex",alignItems:"center",gap:10,
                background:"rgba(0,229,255,.05)",border:"1.5px solid rgba(0,229,255,.18)",
                borderRadius:14,padding:"11px 14px"}}>
                <span style={{fontSize:18}}>⏱</span>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--txt)"}}>Promotion Delivery</div>
                  <div style={{fontSize:11,color:"var(--txt2)",marginTop:2}}>Your promotion will be published within <strong style={{color:"var(--c)"}}>1–3 working days</strong> of booking confirmation.</div>
                </div>
              </div>
              <div style={{marginBottom:15}}>
                <div style={{fontSize:11,color:"var(--txt2)",marginBottom:9,fontWeight:700,letterSpacing:.6}}>
                  PROMOTION CATEGORY <span style={{color:"var(--red)"}}>*</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:8}}>
                  {availableCategories.map(cat=>{
                    const active = promotionCategory===cat.id;
                    return (
                      <button key={cat.id} onClick={()=>setPromotionCategory(cat.id)} style={{
                        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                        gap:5,padding:"10px 6px",borderRadius:18,cursor:"pointer",
                        border:active?"2px solid var(--c)":"1px solid var(--b)",
                        background:active
                          ?"linear-gradient(135deg,rgba(0,229,255,.14),rgba(0,188,212,.06))"
                          :"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                        transition:"all .16s",
                        boxShadow:active?"0 4px 16px rgba(0,229,255,.22)":"none",
                        transform:active?"scale(1.03)":"scale(1)"}}>
                        <span style={{display:"flex",alignItems:"center",
                          color:active?"var(--c)":"var(--txt2)",opacity:active?1:.75,
                          transition:"color .16s,opacity .16s"}}>
                          {CAT_ICONS[cat.icon]?.(18)}
                        </span>
                        <span style={{fontSize:9,fontWeight:active?700:500,lineHeight:1.3,
                          textAlign:"center",color:active?"var(--c)":"var(--txt2)",
                          fontFamily:"'DM Sans',sans-serif",letterSpacing:.2,
                          transition:"color .16s"}}>
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {inf.categories && inf.categories.length > 0 && (
                  <div style={{fontSize:10,color:"var(--txt2)",padding:"7px 11px",
                    background:"rgba(0,229,255,.05)",borderRadius:13,border:"1px solid rgba(0,229,255,.12)",
                    display:"flex",alignItems:"center",gap:7}}>
                    <span style={{fontSize:13}}>ℹ️</span>
                    <span>This creator only accepts bookings in the listed categories</span>
                  </div>
                )}
              </div>
              <div style={{marginBottom:15}}>
                {/* ── Campaign Brief Header + Explanatory Note ── */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:.6}}>
                    CAMPAIGN BRIEF <span style={{color:"var(--red)"}}>*</span>
                  </div>
                  <div style={{fontSize:9,color:"var(--amb)",fontWeight:700,letterSpacing:.4}}>ALL FIELDS REQUIRED</div>
                </div>

                {/* Explanatory note */}
                <div style={{
                  display:"flex",alignItems:"flex-start",gap:10,
                  padding:"11px 13px",marginBottom:12,
                  background:"linear-gradient(135deg,rgba(255,171,64,.07),rgba(255,171,64,.03))",
                  border:"1px solid rgba(255,171,64,.3)",borderRadius:11,
                }}>
                  <span style={{fontSize:16,flexShrink:0,marginTop:1}}>📋</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"var(--amb)",marginBottom:4,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                      Help the creator deliver your best campaign
                    </div>
                    <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.7}}>
                      Fill in all the details below so the creator knows exactly what to promote, who to target, and what message to deliver.
                      The more specific you are — the better the result.
                    </div>
                  </div>
                </div>

                {/* Media attachments — optional images/videos for creator */}
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:.5,marginBottom:5}}>
                    REFERENCE MEDIA <span style={{color:"var(--txt3)",fontWeight:500,fontSize:9}}>— optional</span>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    style={{display:"none"}}
                    onChange={handleMediaUpload}
                  />
                  {/* Upload button */}
                  {mediaFiles.length < 3 && (
                    <button
                      type="button"
                      onClick={()=>fileRef.current?.click()}
                      disabled={uploadingMedia}
                      style={{
                        width:"100%",padding:"11px",borderRadius:16,
                        border:"1.5px dashed rgba(0,229,255,.3)",
                        background:"rgba(0,229,255,.04)",
                        color:"var(--c)",cursor:"pointer",
                        fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,
                        display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                        transition:"all .2s",marginBottom:mediaFiles.length?8:0,
                        opacity:uploadingMedia?.6:1
                      }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,.09)"}
                      onMouseLeave={e=>e.currentTarget.style.background="rgba(0,229,255,.04)"}>
                      {uploadingMedia
                        ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span> Uploading…</>
                        : <><span style={{fontSize:16}}>📎</span> Attach images or videos for reference</>}
                    </button>
                  )}
                  {/* Preview uploaded files */}
                  {mediaFiles.length > 0 && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                      {mediaFiles.map((f,i)=>(
                        <div key={i} style={{
                          position:"relative",
                          width:72,height:72,borderRadius:14,overflow:"hidden",
                          border:"1.5px solid rgba(0,229,255,.28)",
                          background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",flexShrink:0}}>
                          {f.type==="video"
                            ? <video src={f.url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                            : <img src={f.url} alt={f.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={()=>setMediaFiles(prev=>prev.filter((_,j)=>j!==i))}
                            style={{
                              position:"absolute",top:3,right:3,
                              width:18,height:18,borderRadius:"50%",
                              background:"rgba(0,0,0,.7)",border:"none",
                              color:"#fff",cursor:"pointer",fontSize:10,
                              display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,
                              padding:0}}>
                            ✕
                          </button>
                          <div style={{position:"absolute",bottom:0,left:0,right:0,
                            padding:"2px 4px",background:"rgba(0,0,0,.65)",
                            fontSize:8,color:"#fff",
                            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {f.type==="video"?"🎬":"🖼"} {f.name.slice(0,16)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{fontSize:10,color:"var(--txt2)",marginTop:5,lineHeight:1.5}}>
                    Share your brand logo, product images, or reference videos with the creator. Max 3 files.
                  </div>
                </div>
                {/* Product / Service Name — required */}
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:briefErrors.productName?"var(--red)":"var(--txt2)",
                    fontWeight:700,letterSpacing:.5,marginBottom:5,display:"flex",alignItems:"center",gap:4}}>
                    PRODUCT / SERVICE NAME <span style={{color:"var(--red)"}}>*</span>
                    {briefErrors.productName && <span style={{fontSize:10,color:"var(--red)",fontWeight:600,marginLeft:4}}>— required</span>}
                  </div>
                  <input
                    value={form.productName}
                    onChange={e=>{setForm(f=>({...f,productName:e.target.value}));setBriefErrors(ev=>({...ev,productName:false}));}}
                    placeholder="e.g. FitPro Protein Shake, Myntra Fashion App, ZestCafe Pune..."
                    style={{...inp,
                      borderColor:briefErrors.productName?"var(--red)":"var(--b)",
                      boxShadow:briefErrors.productName?"0 0 0 2px rgba(248,113,113,.18)":"none"
                    }}
                    onFocus={e=>{if(!briefErrors.productName)e.target.style.borderColor="var(--c)";}}
                    onBlur={e=>{if(!briefErrors.productName)e.target.style.borderColor="var(--b)";}}
                  />
                </div>

                {/* Target Audience — required */}
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:briefErrors.targetAudience?"var(--red)":"var(--txt2)",
                    fontWeight:700,letterSpacing:.5,marginBottom:5,display:"flex",alignItems:"center",gap:4}}>
                    TARGET AUDIENCE <span style={{color:"var(--red)"}}>*</span>
                    {briefErrors.targetAudience && <span style={{fontSize:10,color:"var(--red)",fontWeight:600,marginLeft:4}}>— required</span>}
                  </div>
                  <input
                    value={form.targetAudience}
                    onChange={e=>{setForm(f=>({...f,targetAudience:e.target.value}));setBriefErrors(ev=>({...ev,targetAudience:false}));}}
                    placeholder="e.g. Men 18–35 interested in fitness, Newlyweds in Mumbai, College students..."
                    style={{...inp,
                      borderColor:briefErrors.targetAudience?"var(--red)":"var(--b)",
                      boxShadow:briefErrors.targetAudience?"0 0 0 2px rgba(248,113,113,.18)":"none"
                    }}
                    onFocus={e=>{if(!briefErrors.targetAudience)e.target.style.borderColor="var(--c)";}}
                    onBlur={e=>{if(!briefErrors.targetAudience)e.target.style.borderColor="var(--b)";}}
                  />
                </div>

                {/* Key Messages — required */}
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:briefErrors.msg?"var(--red)":"var(--txt2)",
                    fontWeight:700,letterSpacing:.5,marginBottom:5,display:"flex",alignItems:"center",gap:4}}>
                    KEY MESSAGES & PROMOTION DETAILS <span style={{color:"var(--red)"}}>*</span>
                    {briefErrors.msg && <span style={{fontSize:10,color:"var(--red)",fontWeight:600,marginLeft:4}}>— required</span>}
                  </div>
                  <textarea
                    value={form.msg}
                    onChange={e=>{setForm(f=>({...f,msg:e.target.value}));setBriefErrors(ev=>({...ev,msg:false}));}}
                    placeholder={`Describe your promotion in detail:\n• What should the creator say about your product?\n• Tone: casual / professional / energetic?\n• Key selling points to highlight\n• Any dos and don'ts\n• Specific links, discount codes, or CTAs to include`}
                    rows={5}
                    style={{...inp,resize:"vertical",
                      borderColor:briefErrors.msg?"var(--red)":"var(--b)",
                      boxShadow:briefErrors.msg?"0 0 0 2px rgba(248,113,113,.18)":"none"
                    }}
                    onFocus={e=>{if(!briefErrors.msg)e.target.style.borderColor="var(--c)";}}
                    onBlur={e=>{if(!briefErrors.msg)e.target.style.borderColor="var(--b)";}}
                  />
                </div>

                {/* Hashtags / Handles — optional */}
                <div>
                  <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:.5,marginBottom:5,
                    display:"flex",alignItems:"center",gap:6}}>
                    HASHTAGS / HANDLES TO TAG
                    <span style={{fontSize:9,padding:"2px 7px",borderRadius:50,
                      background:"rgba(0,229,255,.08)",color:"var(--c)",
                      border:"1px solid rgba(0,229,255,.18)",fontWeight:600,letterSpacing:.3}}>
                      optional
                    </span>
                  </div>
                  <input
                    value={form.hashtags}
                    onChange={e=>setForm(f=>({...f,hashtags:e.target.value}))}
                    placeholder="e.g. #FitPro @fitpro_india #ProteinShake"
                    style={inp}
                    onFocus={e=>e.target.style.borderColor="var(--c)"}
                    onBlur={e=>e.target.style.borderColor="var(--b)"}
                  />
                </div>
              </div>

              {/* Validation summary — only shown after a failed attempt */}
              {Object.values(briefErrors).some(Boolean) && (
                <div style={{
                  display:"flex",alignItems:"center",gap:9,marginBottom:12,
                  padding:"10px 13px",
                  background:"rgba(248,113,113,.07)",
                  border:"1px solid rgba(248,113,113,.3)",
                  borderRadius:14,
                }}>
                  <span style={{fontSize:15,flexShrink:0}}>⚠️</span>
                  <span style={{fontSize:12,color:"var(--red)",lineHeight:1.5}}>
                    Please fill in all required fields above before continuing. The creator needs this information to deliver your promotion.
                  </span>
                </div>
              )}

              <button onClick={()=>{
                // Validate category
                if (!promotionCategory) { alert("Please select a promotion category"); return; }
                // Validate required brief fields
                const errs = {
                  productName: !form.productName.trim(),
                  targetAudience: !form.targetAudience.trim(),
                  msg: !form.msg.trim(),
                };
                if (Object.values(errs).some(Boolean)) {
                  setBriefErrors(errs);
                  return;
                }
                setBriefErrors({});
                setStep(2);
              }} className="btnp" style={{width:"100%",justifyContent:"center"}}>Continue →</button>
            </div>
          )}

          {step===2 && (
            <div className="fi">
              <div style={{background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",borderRadius:18,padding:17,marginBottom:16}}>
                <div style={{fontSize:10,color:"var(--txt2)",marginBottom:13,fontWeight:700,letterSpacing:1}}>ORDER SUMMARY</div>
                {[
                  ["Creator",inf.name],
                  ["City",inf.city],
                  ["Platform",inf.platform],
                  ["Promotion",selectedPromo?.label],
                  ["Category",PROMOTION_CATEGORIES.find(c=>c.id===promotionCategory)?.label||promotionCategory],
                  ["Delivery","1–3 working days"],
                  ["Est. Reach",fmt(inf.reach)],
                ].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
                    <span style={{color:"var(--txt2)",fontSize:13}}>{k}</span>
                    <span style={{fontSize:13,fontWeight:600}}>{v}</span>
                  </div>
                ))}
                <div style={{borderTop:"1px solid var(--b)",marginTop:11,paddingTop:11,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:700}}>Total</span>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {isPro && basePrice !== promoPrice && (
                      <span style={{fontSize:13,color:"var(--txt3)",textDecoration:"line-through",fontFamily:"'DM Mono',monospace"}}>
                        {inr(basePrice)}
                      </span>
                    )}
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:19,color:isPro?"#00e676":"var(--c)",fontWeight:700}}>{inr(promoPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Campaign Brief Summary */}
              <div style={{background:"rgba(0,229,255,.04)",border:"1px solid rgba(0,229,255,.14)",
                borderRadius:22,padding:"14px 16px",marginBottom:16}}>
                <div style={{fontSize:10,color:"var(--c)",fontWeight:700,letterSpacing:1,marginBottom:12}}>CAMPAIGN BRIEF</div>
                {[
                  ["Product / Service", form.productName],
                  ["Target Audience",   form.targetAudience],
                  ...(form.hashtags ? [["Hashtags / Handles", form.hashtags]] : []),
                ].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",
                    alignItems:"flex-start",marginBottom:8,gap:10}}>
                    <span style={{color:"var(--txt2)",fontSize:12,flexShrink:0}}>{k}</span>
                    <span style={{fontSize:12,fontWeight:600,textAlign:"right",wordBreak:"break-word",maxWidth:"60%"}}>{v}</span>
                  </div>
                ))}
                <div style={{marginTop:6,paddingTop:10,borderTop:"1px solid var(--b)"}}>
                  <div style={{fontSize:10,color:"var(--txt2)",marginBottom:5,fontWeight:600}}>Key Messages</div>
                  <div style={{fontSize:12,color:"var(--txt)",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{form.msg}</div>
                </div>
              </div>

              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setStep(1)} className="btng" style={{flex:1,justifyContent:"center"}}>← Back</button>
                <button onClick={()=>setStep(3)} className="btnp" style={{flex:2,justifyContent:"center"}}>Payment →</button>
              </div>
            </div>
          )}

          {step===3 && (
            <div className="fi">
              {/* Pro 10% discount banner */}
              <div style={{marginBottom:12,padding:"12px 14px",
                background:"linear-gradient(135deg,rgba(156,106,247,.1),rgba(255,171,64,.06))",
                border:"1px solid rgba(156,106,247,.3)",borderRadius:16,
                display:"flex",alignItems:"center",gap:10,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,
                  background:"linear-gradient(90deg,transparent,rgba(156,106,247,.5),transparent)"}}/>
                <div style={{width:36,height:36,borderRadius:14,flexShrink:0,
                  background:"linear-gradient(135deg,rgba(156,106,247,.25),rgba(156,106,247,.1))",
                  border:"1px solid rgba(156,106,247,.35)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏷️</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:800,
                    color:"#9c6af7",marginBottom:2}}>
                    Save 10% with Collancer Pro
                  </div>
                  <div style={{fontSize:11,color:"var(--txt2)"}}>
                    Pro members get <strong style={{color:"#ffab40"}}>₹{Math.round(basePrice*0.1).toLocaleString("en-IN")} off</strong> this booking — automatically applied!
                  </div>
                </div>
                <span style={{fontSize:9,background:"linear-gradient(135deg,#9c6af7,#ffab40)",
                  color:"#fff",borderRadius:8,padding:"3px 7px",fontWeight:800,
                  fontFamily:"'Plus Jakarta Sans',sans-serif",flexShrink:0,whiteSpace:"nowrap"}}>PRO</span>
              </div>
              <div style={{marginBottom:12,padding:"10px 14px",background:"rgba(0,230,118,.05)",
                border:"1px solid rgba(0,230,118,.2)",borderRadius:14,display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:"var(--grn)"}}>🔒</span>
                <span style={{fontSize:12,color:"var(--txt2)"}}>Secure payment · Razorpay / UPI supported</span>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"var(--txt2)",marginBottom:6,fontWeight:700,letterSpacing:.6}}>CARD / UPI</div>
                <input value={form.card} onChange={e=>setForm(f=>({...f,card:e.target.value}))}
                  placeholder="Card number or UPI ID" style={inp} maxLength={19}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:17}}>
                <div>
                  <div style={{fontSize:11,color:"var(--txt2)",marginBottom:6,fontWeight:700,letterSpacing:.6}}>EXPIRY</div>
                  <input value={form.exp} onChange={e=>setForm(f=>({...f,exp:e.target.value}))} placeholder="MM/YY" style={inp} maxLength={5}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:"var(--txt2)",marginBottom:6,fontWeight:700,letterSpacing:.6}}>CVV</div>
                  <input value={form.cvv} onChange={e=>setForm(f=>({...f,cvv:e.target.value}))}
                    placeholder="···" style={{...inp,fontFamily:"'DM Mono',monospace"}} maxLength={4}/>
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setStep(2)} className="btng" style={{flex:1,justifyContent:"center"}}>← Back</button>
                <button onClick={pay} className="btnp" style={{flex:2,justifyContent:"center",opacity:proc?0.7:1}}>
                  {proc ? <span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span> : `Pay ${inr(promoPrice)}`}
                </button>
              </div>
            </div>
          )}

          {step===4 && (
            <div className="fi" style={{textAlign:"center",padding:"12px 0"}}>
              <div style={{width:65,height:65,borderRadius:"50%",background:"linear-gradient(145deg,rgba(0,230,118,.18),rgba(0,200,80,.08))",
                border:"2px solid var(--grn)",display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:27,margin:"0 auto 13px",
                animation:"scaleIn .4s cubic-bezier(.16,1,.3,1)"}}>✓</div>
              <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,marginBottom:7,fontWeight:800}}>Booking Confirmed!</h3>
              <p style={{color:"var(--txt2)",fontSize:13,marginBottom:20}}>
                Your campaign with {inf.name} is confirmed.<br/>We'll notify you when it goes live.
              </p>
              <div style={{background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",borderRadius:13,padding:15,marginBottom:17,textAlign:"left"}}>
                <div style={{fontSize:10,color:"var(--txt2)",marginBottom:8,fontWeight:700,letterSpacing:.8}}>RATE YOUR EXPERIENCE</div>
                <Stars value={rating} onChange={setRating} size={22}/>
                <textarea value={review} onChange={e=>setReview(e.target.value)}
                  placeholder="Share your experience with this creator..."
                  rows={3} style={{...inp,marginTop:9,resize:"none"}}/>
              </div>
              <button onClick={()=>{onSuccess(inf, promoKey, promoPrice, { brief:form.msg, dur:form.dur, promoLabel:selectedPromo?.label, productName:form.productName, targetAudience:form.targetAudience, hashtags:form.hashtags, promotionCategory, mediaFiles });onClose();}} className="btnp" style={{width:"100%",justifyContent:"center"}}>
                Done ✦
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Profile Page ───────────────────────────────────────
function ProfilePage({ inf, userReviews, bizName="Your Business", initials="BZ", bizPfp="", onBack, onBook, onProClick, isPro=false }) {
  const [tab, setTab] = useState("overview");
  const PALETTES = [
    { a:"#00E5FF", b:"#0066ff" },
    { a:"#bf5af2", b:"#7c6af7" },
    { a:"#00e676", b:"#00bcd4" },
    { a:"#ffab40", b:"#ff6f00" },
    { a:"#f06292", b:"#e91e8c" },
    { a:"#40c4ff", b:"#0091ea" },
    { a:"#69f0ae", b:"#00bfa5" },
    { a:"#ff6e40", b:"#e64a19" },
  ];
  const { a: bc, b: bc2 } = PALETTES[inf.id % PALETTES.length];

  const [portfolioVideos, setPortfolioVideos] = useState([]);
  useEffect(() => {
    if (!inf.uid || !window.__cfs) return;
    const { collection, query, where, onSnapshot } = window.__cfs;
    const q = query(collection(window.__cdb,"promoDemos"), where("creatorId","==",inf.uid));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d=>({id:d.id,...d.data()}));
      data.sort((a,b)=>(b.addedAt?.seconds||0)-(a.addedAt?.seconds||0));
      setPortfolioVideos(data);
    });
    return ()=>unsub();
  }, [inf.uid]);

  // Fallback demo promos for hardcoded/static creators with no uid
  const promos = [
    {title:"Brand Campaign — "+inf.niche,views:"2.1M",likes:"142K",type:"Reel",c:bc},
    {title:"Unboxing Review",views:"890K",likes:"67K",type:"Story",c:bc2},
    {title:"Sponsored Content",views:"1.4M",likes:"98K",type:"Post",c:bc},
  ];

  return (
    <div style={{maxWidth:430,width:"100%",margin:"0 auto",padding:"16px 16px 24px",overflowX:"hidden",boxSizing:"border-box",
      animation:"profileSlideIn .3s cubic-bezier(.22,.68,0,1.2) both",willChange:"transform,opacity"}}>
      <button onClick={onBack} style={{background:"none",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:14,
        color:"var(--txt2)",padding:"8px 16px",cursor:"pointer",fontSize:13,
        fontFamily:"'DM Sans',sans-serif",marginBottom:20,display:"inline-flex",
        alignItems:"center",gap:7,transition:"border-color .18s,color .18s",willChange:"auto"}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--c)";e.currentTarget.style.color="var(--c)"}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b)";e.currentTarget.style.color="var(--txt2)"}}>
        ← Back
      </button>

      {/* Header */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:26,
        marginBottom:16,animation:"cardIn .3s .05s both",willChange:"transform,opacity"}}>
        {/* Banner — same animated gold/silver as card */}
        {(()=>{
          const isGold = inf.boosted === true && (inf.boostEndsAt||0) > Date.now();
          const bg = isGold
            ? "linear-gradient(135deg,rgba(255,215,0,.22) 0%,rgba(255,143,0,.14) 55%,rgba(255,215,0,.08) 100%)"
            : "linear-gradient(135deg,rgba(176,190,197,.18) 0%,rgba(144,164,174,.1) 55%,rgba(176,190,197,.06) 100%)";
          const dotC = isGold ? "rgba(255,215,0,.55)" : "rgba(176,190,197,.5)";
          const shimC = isGold
            ? "linear-gradient(105deg,transparent 20%,rgba(255,240,120,.55) 50%,transparent 80%)"
            : "linear-gradient(105deg,transparent 20%,rgba(220,235,242,.45) 50%,transparent 80%)";
          const shimAnim = isGold ? "goldShimmer 2.2s ease-in-out infinite" : "silverShimmer 3.8s ease-in-out infinite";
          const orbC = isGold ? "radial-gradient(circle,rgba(255,220,0,.7) 0%,transparent 70%)" : "radial-gradient(circle,rgba(192,210,225,.6) 0%,transparent 70%)";
          const lineC = isGold
            ? "linear-gradient(90deg,transparent,rgba(255,220,0,.9),rgba(255,170,0,.7),rgba(255,220,0,.9),transparent)"
            : "linear-gradient(90deg,transparent,rgba(192,210,225,.8),rgba(160,190,210,.6),rgba(192,210,225,.8),transparent)";
          return (
            <div style={{height:110,background:bg,
              position:"relative",borderRadius:"28px 28px 0 0",overflow:"hidden"}}>
              {/* Dot grid */}
              <div style={{position:"absolute",inset:0,
                backgroundImage:`radial-gradient(circle,${dotC} 1px,transparent 1px)`,
                backgroundSize:"14px 14px"}}/>
              {/* Moving shimmer */}
              <div style={{position:"absolute",top:"-40%",left:0,width:"50%",height:"180%",
                background:shimC,animation:shimAnim,willChange:"transform",pointerEvents:"none"}}/>
              {/* Glowing orb top-left only */}
              <div style={{position:"absolute",top:-18,left:-18,width:80,height:80,borderRadius:"50%",
                background:orbC,filter:"blur(10px)"}}/>
              {/* Top edge line */}
              <div style={{position:"absolute",top:0,left:0,right:0,height: isGold?2.5:1.5,background:lineC}}/>
              {/* Bottom fade */}
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:32,
                background:"linear-gradient(to top,rgba(14,14,34,.99),transparent)"}}/>
              {/* Sponsored LEFT, Trending RIGHT — only when running ad */}
              {isGold && <>
                <span className="badge" style={{position:"absolute",top:12,left:14,
                  background:"rgba(255,215,0,.2)",color:"#ffd700",
                  border:"1px solid rgba(255,215,0,.5)",fontSize:11,zIndex:2,
                  textShadow:"0 0 10px rgba(255,215,0,.8)",fontWeight:700,
                  padding:"4px 12px",borderRadius:50}}>✦ Sponsored</span>
                <span className="badge" style={{position:"absolute",top:12,right:14,
                  background:"rgba(255,171,64,.2)",color:"var(--amb)",
                  border:"1.5px solid rgba(255,171,64,.5)",fontSize:11,zIndex:2,
                  fontWeight:700,padding:"4px 12px",borderRadius:50}}>🔥 Trending</span>
              </>}
            </div>
          );
        })()}
        <div style={{padding:"0 14px 16px"}}>
          {/* Avatar row — sits below banner with negative margin */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
            marginTop:-30,flexWrap:"wrap",gap:8,width:"100%"}}>
            <div style={{position:"relative",flexShrink:0}}>
              <Avatar inf={inf} size={70} style={{border:"4px solid rgba(14,14,34,.99)",boxShadow:"0 0 28px rgba(0,229,255,.2)"}}/>
              {inf.verified && (
                <div style={{position:"absolute",bottom:2,right:2,width:20,height:20,
                  borderRadius:"50%",background:"var(--c)",display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:10,color:"var(--bg)",fontWeight:700,
                  border:"3px solid rgba(14,14,34,.99)"}}>✓</div>
              )}
            </div>
            <button onClick={onBook} className="btnp"
              style={{padding:"10px 18px",fontSize:13,borderRadius:13,flexShrink:0,marginTop:36,
                boxShadow:"0 0 26px rgba(0,229,255,.28)"}}>
              Book Now ✦
            </button>
          </div>
          {/* Name and handle — below avatar */}
          <div style={{marginTop:10}}>
            <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:3}}>
              <h1 style={{fontSize:18,fontWeight:800}}>{inf.name}</h1>
              <PlatIcon p={inf.platform}/>
            </div>
            <div style={{color:"var(--txt2)",fontSize:11,marginBottom:10}}>{inf.handle} · 📍 {inf.city}</div>
            <p style={{color:"var(--txt2)",fontSize:13,lineHeight:1.75,maxWidth:"100%",wordBreak:"break-word"}}>{inf.bio}</p>
            <div style={{display:"flex",gap:7,marginTop:12,flexWrap:"wrap"}}>
              {inf.tags.map(t=><span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:16,animation:"cardIn .3s .1s both",willChange:"transform,opacity"}}>
        {inf.platform==="Both" ? <>
          {/* Both: 4-box grid — Followers | Subscribers / Avg Views | Rating (same size) */}
          <StatBox label="FOLLOWERS (INSTAGRAM)" value={fmtKPlus(inf.followers)} sub="Instagram"/>
          <StatBox label="SUBSCRIBERS (YOUTUBE)" value={fmt(inf.ytSubscribers||0)} sub="YouTube" color="var(--pur)"/>
          <StatBox label="AVG VIEWS" value={fmtK(inf.avgViews||0)} sub="per post" color="var(--grn)"/>
          <RatingBox inf={inf} compact={true}/>
        </> : <>
          {/* Single platform: Followers | Avg Views / RatingBox full width */}
          <StatBox label={inf.platform==="YouTube"?"SUBSCRIBERS":"FOLLOWERS"} value={fmtKPlus(inf.followers)} sub={inf.platform}/>
          <StatBox label="AVG VIEWS" value={fmtK(inf.avgViews||0)} sub="per post" color="var(--grn)"/>
          <RatingBox inf={inf} compact={false} style={{gridColumn:"1 / -1"}}/>
        </>}
      </div>

      {/* Tabs */}
      <div style={{borderBottom:"1px solid var(--b)",marginBottom:22,display:"flex",gap:0}}>
        {["overview","demos","analytics","reviews"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            flex:1,padding:"10px 4px",border:"none",background:"none",
            color:tab===t?"var(--c)":"var(--txt2)",
            borderBottom:tab===t?"2px solid var(--c)":"2px solid transparent",
            cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,
            fontWeight:tab===t?700:500,transition:"all .2s",whiteSpace:"nowrap",
            textAlign:"center",position:"relative"}}>
            {t==="demos"
              ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>
                  Promo Demos <span style={{fontSize:7,background:"linear-gradient(135deg,#9c6af7,#ffab40)",color:"#fff",borderRadius:3,padding:"1px 4px",fontWeight:800}}>PRO</span>
                </span>
              : t==="analytics"
              ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>
                  Analytics <span style={{fontSize:7,background:"linear-gradient(135deg,#9c6af7,#ffab40)",color:"#fff",borderRadius:3,padding:"1px 4px",fontWeight:800}}>PRO</span>
                </span>
              : t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab==="overview" && (
        <div className="tabcontent">
          <div style={{background:"linear-gradient(135deg,rgba(0,229,255,.07),rgba(124,106,247,.05))",
            border:"1px solid rgba(0,229,255,.12)",borderRadius:22,padding:20,marginBottom:16}}>
            <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,marginBottom:16}}>
              Estimated Promotion Results
            </h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:11}}>
              {[
                {l:"Expected Views",v:`${fmt(inf.avgViews*.8)}–${fmt(inf.avgViews*1.4)}`,e:"👁"},
                {l:"Expected Likes",v:`${fmt(inf.avgLikes*.7)}–${fmt(inf.avgLikes*1.3)}`,e:"♥"},
                {l:"Est. Reach",v:fmt(inf.reach),e:"📡"},
                {l:"Est. Conversion",v:"2.1–4.8%",e:"🎯"}
              ].map(s=>(
                <div key={s.l} style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",borderRadius:16,padding:15,border:"1.5px solid rgba(255,255,255,.07)"}}>
                  <div style={{fontSize:19,marginBottom:7}}>{s.e}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:700,color:"var(--c)",marginBottom:3}}>{s.v}</div>
                  <div style={{fontSize:10,color:"var(--txt2)"}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:22,padding:20}}>
            <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,marginBottom:13}}>Pricing (INR)</h3>
            {(inf.prices ? [
              inf.prices.story    ? ["Story Promotion (Instagram)", inr(inf.prices.story)]     : null,
              inf.prices.reel     ? ["Reel Promotion (Instagram)",  inr(inf.prices.reel)]      : null,
              inf.prices.video    ? ["Video Promotion (YouTube)",   inr(inf.prices.video)]     : null,
              inf.prices.personalvideo ? ["Personal Video Promotion", inr(inf.prices.personalvideo)] : null,
              inf.prices.personalad ? ["Personal Ad (Premium)",    inr(inf.prices.personalad)] : null,
            ].filter(Boolean) : [
              ["Story Promotion", inr(Math.round(inf.price*.45))],
              ["Reel Promotion",  inr(inf.price)],
              ["Video Promotion", inr(Math.round(inf.price*1.65))],
              ["Personal Ad",     inr(Math.round(inf.price*2.2))],
            ]).map(([t,p])=>(
              <div key={t} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"11px 0",borderBottom:"1px solid var(--b)"}}>
                <span style={{fontSize:14}}>{t}</span>
                <span style={{fontFamily:"'DM Mono',monospace",color:"var(--c)",fontWeight:700,fontSize:15}}>{p}</span>
              </div>
            ))}
          </div>

          {/* Promotion Categories */}
          {inf.categories && inf.categories.length > 0 && (
            <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1px solid rgba(0,229,255,.18)",borderRadius:22,padding:20,marginTop:16}}>
              <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,marginBottom:6}}>
                ✅ Accepts Promotions For
              </h3>
              <div style={{fontSize:12,color:"var(--txt2)",marginBottom:14,lineHeight:1.6}}>
                This creator only does promotions in these categories. Bookings for other categories will be rejected.
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {inf.categories.map(catId=>{
                  const cat = PROMOTION_CATEGORIES.find(c=>c.id===catId);
                  if (!cat) return null;
                  return (
                    <span key={catId} style={{display:"inline-flex",alignItems:"center",gap:5,
                      padding:"6px 12px",borderRadius:50,fontSize:12,fontWeight:600,
                      background:"linear-gradient(145deg,rgba(0,229,255,.14),rgba(0,188,212,.07))",color:"var(--c)",
                      border:"1.5px solid rgba(0,229,255,.28)"}}>
                      <span style={{fontSize:14}}>{cat.icon}</span>{cat.label}
                    </span>
                  );
                })}
              </div>
              {inf.categories.length < PROMOTION_CATEGORIES.length && (
                <div style={{marginTop:12,padding:"8px 12px",background:"rgba(248,113,113,.06)",
                  border:"1px solid rgba(248,113,113,.2)",borderRadius:14,
                  fontSize:11,color:"var(--red)"}}>
                  ⚠️ This creator will reject bookings that don't match their listed categories.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab==="demos" && (
        <div className="tabcontent">
          {isPro ? (
            // Unlocked — show real promo demos from Firebase
            <div>
              {portfolioVideos.length === 0 ? (
                <div style={{textAlign:"center",padding:"48px 20px",
                  background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:16}}>
                  <div style={{fontSize:40,marginBottom:12,opacity:.3}}>🎬</div>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>No promo demos yet</div>
                  <div style={{fontSize:12,color:"var(--txt2)"}}>This creator hasn't uploaded any promotion demos yet.</div>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {portfolioVideos.map((d,i)=>{
                    const isVertical = d.format==="9:16";
                    return (
                      <div key={d.id||i} style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1px solid rgba(156,106,247,.2)",
                        borderRadius:26,overflow:"hidden",animation:`fadeUp .4s ${i*.08}s both`}}>
                        <div style={{
                          position:"relative",background:"#000",
                          height:isVertical?220:140,
                          display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {d.videoUrl
                            ? <video src={d.videoUrl} controls poster={d.thumbnail||undefined}
                                style={{width:"100%",height:"100%",objectFit:isVertical?"contain":"cover",display:"block"}}/>
                            : <div style={{opacity:.3,fontSize:36}}>🎬</div>
                          }
                          <div style={{position:"absolute",top:8,left:8,display:"flex",gap:5}}>
                            <span style={{background:"rgba(0,0,0,.75)",borderRadius:10,padding:"3px 8px",
                              fontSize:10,color:"#fff",fontWeight:600}}>{d.demoTypeLabel||d.demoType}</span>
                            <span style={{background:"rgba(156,106,247,.8)",borderRadius:10,padding:"3px 8px",
                              fontSize:10,color:"#fff",fontWeight:700}}>{d.format}</span>
                          </div>
                        </div>
                        <div style={{padding:"12px 14px"}}>
                          <div style={{fontWeight:700,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                            {d.title}
                          </div>
                          <div style={{fontSize:11,color:"var(--txt2)",marginTop:3}}>
                            {isVertical?"📱 Vertical":"🖥 Horizontal"} · {d.demoTypeLabel||d.demoType}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            // Locked — Pro required
            <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1px solid rgba(156,106,247,.25)",borderRadius:24,
              padding:0,overflow:"hidden",position:"relative",minHeight:260}}>
              <div style={{filter:"blur(3px)",opacity:.4,padding:20,pointerEvents:"none"}}>
                {[{type:"Story Demo",format:"9:16",dur:"0:15",desc:"Instagram Story Promotion Demo"},
                  {type:"Reel Demo",format:"9:16",dur:"0:30",desc:"Instagram Reel Promotion Demo"},
                  {type:"YouTube Demo",format:"16:9",dur:"1:05",desc:"YouTube Mid-roll Demo"},
                ].map((d,i)=>(
                  <div key={i} style={{background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",borderRadius:16,marginBottom:12,
                    display:"flex",alignItems:"center",gap:12,padding:"12px 14px"}}>
                    <div style={{width:62,height:62,borderRadius:14,background:"rgba(156,106,247,.2)",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>🎬</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>{d.desc}</div>
                      <div style={{fontSize:11,color:"var(--txt2)"}}>{d.type} · {d.format} · {d.dur}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
                alignItems:"center",justifyContent:"center",
                background:"linear-gradient(180deg,rgba(7,7,16,.7) 0%,rgba(7,7,16,.93) 50%,rgba(7,7,16,.98) 100%)",
                borderRadius:24,padding:24,textAlign:"center"}}>
                <div style={{width:60,height:60,borderRadius:22,
                  background:"linear-gradient(135deg,rgba(156,106,247,.25),rgba(255,171,64,.12))",
                  border:"1px solid rgba(156,106,247,.4)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:28,marginBottom:14,animation:"proGlow 2.5s ease infinite",
                  boxShadow:"0 8px 32px rgba(156,106,247,.25),0 0 0 8px rgba(156,106,247,.06)"}}>
                  🎬
                </div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,
                  marginBottom:8,background:"linear-gradient(135deg,#9c6af7,#ffab40)",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  Promo Demos
                </div>
                <p style={{fontSize:12,color:"var(--txt2)",lineHeight:1.7,marginBottom:18,maxWidth:260}}>
                  Watch {inf.name}'s actual promotion demos before you book.
                </p>
                <button onClick={()=>onProClick&&onProClick("demo")} className="pro-btn-3d"
                  style={{padding:"10px 24px",fontSize:13,borderRadius:14}}>
                  See Pro Plans →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab==="analytics" && (
        <div className="tabcontent">
          {isPro ? (
            // Unlocked — show real analytics
            <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16,marginBottom:16}}>
                {[
                  {title:"Monthly Views",data:[62,80,70,92,86,100],color:"var(--c)"},
                  {title:"Avg Views",data:[Math.round((inf.avgViews||0)*.7),Math.round((inf.avgViews||0)*.8),Math.round((inf.avgViews||0)*.85),Math.round((inf.avgViews||0)*.9),Math.round((inf.avgViews||0)*.95),inf.avgViews||0],color:"var(--grn)"}
                ].map(ch=>(
                  <div key={ch.title} style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:22,padding:20}}>
                    <h4 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,marginBottom:16}}>{ch.title}</h4>
                    <div style={{display:"flex",gap:6,alignItems:"flex-end",height:88}}>
                      {ch.data.map((v,i)=>(
                        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                          <div style={{width:"100%",borderRadius:"4px 4px 0 0",
                            background:`linear-gradient(180deg,${ch.color},${ch.color}44)`,
                            height:(v/100)*84,minHeight:4,
                            boxShadow:`0 0 8px ${ch.color}44`}}/>
                          <div style={{fontSize:8,color:"var(--txt2)"}}>{["Oct","Nov","Dec","Jan","Feb","Mar"][i]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:11,marginBottom:16}}>
                {[
                  {l:"Avg Views",v:fmt(inf.avgViews),ch:"+12%",c:"var(--c)"},
                  {l:"Avg Likes",v:fmt(inf.avgLikes),ch:"+8%",c:"var(--grn)"},
                  {l:"Total Reach",v:fmtK(inf.reach||0),ch:"+18%",c:"var(--pur)"},
                  {l:"Est. Conversion",v:"2.1–4.8%",ch:"+5%",c:"var(--amb)"}
                ].map(s=>(
                  <div key={s.l} style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:18,padding:16}}>
                    <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1,marginBottom:7}}>{s.l}</div>
                    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:11,color:"var(--grn)",marginTop:5}}>▲ {s.ch} this month</div>
                  </div>
                ))}
              </div>
              {/* Audience breakdown */}
              <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:18}}>
                <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:1,marginBottom:14}}>AUDIENCE DEMOGRAPHICS</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    {label:"Age 18–24",pct:38,color:"var(--c)"},
                    {label:"Age 25–34",pct:31,color:"var(--pur)"},
                    {label:"Age 35–44",pct:18,color:"var(--amb)"},
                    {label:"Age 45+",pct:13,color:"var(--grn)"},
                  ].map(d=>(
                    <div key={d.label}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:11,color:"var(--txt2)"}}>{d.label}</span>
                        <span style={{fontSize:11,fontWeight:700,color:d.color}}>{d.pct}%</span>
                      </div>
                      <div style={{height:6,background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${d.pct}%`,borderRadius:3,
                          background:`linear-gradient(90deg,${d.color},${d.color}88)`}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Locked
            <div style={{position:"relative",borderRadius:30,overflow:"hidden"}}>
              <div style={{filter:"blur(5px)",opacity:.35,pointerEvents:"none"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16,marginBottom:16}}>
                  {[{title:"Monthly Views",color:"var(--c)"},{title:"Avg Views",color:"var(--grn)"}].map(ch=>(
                    <div key={ch.title} style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:22,padding:20}}>
                      <h4 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,marginBottom:16}}>{ch.title}</h4>
                      <div style={{display:"flex",gap:6,alignItems:"flex-end",height:88}}>
                        {[62,80,70,92,86,100].map((v,i)=>(
                          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                            <div style={{width:"100%",borderRadius:"4px 4px 0 0",
                              background:`linear-gradient(180deg,${ch.color},${ch.color}44)`,height:(v/100)*84,minHeight:4}}/>
                            <div style={{fontSize:8,color:"var(--txt2)"}}>{["Oct","Nov","Dec","Jan","Feb","Mar"][i]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:11}}>
                  {["Avg Views","Avg Likes","Est. Reach","Conversion"].map(s=>(
                    <div key={s} style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:18,padding:16}}>
                      <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1,marginBottom:7}}>{s}</div>
                      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:"var(--c)"}}>—</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
                alignItems:"center",justifyContent:"center",
                background:"linear-gradient(180deg,rgba(7,7,16,.6) 0%,rgba(7,7,16,.9) 60%,rgba(7,7,16,.98) 100%)",
                borderRadius:24,padding:24,textAlign:"center"}}>
                <div style={{width:60,height:60,borderRadius:22,
                  background:"linear-gradient(135deg,rgba(156,106,247,.25),rgba(0,229,255,.1))",
                  border:"1px solid rgba(156,106,247,.4)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:28,marginBottom:14,animation:"proGlow 2.5s ease infinite",
                  boxShadow:"0 8px 32px rgba(156,106,247,.25),0 0 0 8px rgba(156,106,247,.06)"}}>
                  📊
                </div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,
                  marginBottom:8,background:"linear-gradient(135deg,#9c6af7,#00E5FF)",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  Deep Analytics
                </div>
                <p style={{fontSize:12,color:"var(--txt2)",lineHeight:1.7,marginBottom:18,maxWidth:270}}>
                  Unlock detailed audience insights, engagement trends, and ROI forecasts for {inf.name}.
                </p>
                <button onClick={()=>onProClick&&onProClick("analytics")} className="pro-btn-3d"
                  style={{padding:"10px 24px",fontSize:13,borderRadius:14}}>
                  See Pro Plans →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

            {tab==="reviews" && (
        <div className="tabcontent">
          <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap"}}>
            <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:18,
              padding:20,textAlign:"center",flexShrink:0,width:145}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:48,fontWeight:800,
                color:"var(--c)",lineHeight:1}}>{inf.rating}</div>
              <div style={{color:"var(--c)",fontSize:16,marginTop:3}}>
                {Array(Math.round(inf.rating)).fill("★").join("")}
              </div>
              <div style={{color:"var(--txt2)",fontSize:11,marginTop:6}}>{userReviews.length > 0 ? userReviews.length : inf.reviews.length} review{(userReviews.length > 0 ? userReviews.length : inf.reviews.length) !== 1 ? "s" : ""}</div>
            </div>
            <div style={{flex:1,minWidth:175}}>
              {[5,4,3,2,1].map(s=>(
                <div key={s} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:11,color:"var(--txt2)",width:7}}>{s}</span>
                  <span style={{color:"var(--c)",fontSize:10}}>★</span>
                  <div style={{flex:1,height:5,background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",
                      width:s===5?"78%":s===4?"16%":"6%",
                      background:"linear-gradient(90deg,var(--c),var(--c2))",borderRadius:3}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User-added reviews first */}
          {userReviews.length > 0 && (
            <>
              <div style={{fontSize:10,color:"var(--c)",fontWeight:700,letterSpacing:1.2,marginBottom:10}}>YOUR REVIEWS</div>
              {userReviews.map((r,i)=>(
                <div key={"ur"+i} style={{background:"linear-gradient(135deg,rgba(0,229,255,.06),rgba(0,229,255,.02))",
                  border:"1px solid rgba(0,229,255,.22)",
                  borderRadius:13,padding:17,marginBottom:10,
                  animation:`fadeUp .4s ${i*.1}s both`,transition:"border-color .2s",position:"relative"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,229,255,.38)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(0,229,255,.22)"}>

                  <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:6}}>
                    <div style={{width:32,height:32,borderRadius:"50%",overflow:"visible",flexShrink:0,
                      background:"linear-gradient(135deg,var(--c),var(--c2))",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      border:"2px solid rgba(0,229,255,.3)"}}>
                      {r.pfp
                        ? <img src={r.pfp} alt="pfp" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
                        : <span style={{fontSize:11,fontWeight:700,color:"var(--bg)",fontFamily:"system-ui,sans-serif"}}>{initials}</span>
                      }
                    </div>
                    <span style={{fontWeight:700,fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",flex:1}}>{r.user}</span>
                    <ReviewStars v={r.stars} size={13}/>
                  </div>
                  {r.date && <div style={{fontSize:10,color:"var(--txt2)",marginBottom:6,paddingLeft:37}}>{r.date}</div>}
                  {r.text && <p style={{color:"var(--txt2)",fontSize:13,lineHeight:1.7,marginBottom:r.tags?.length?8:0}}>{r.text}</p>}
                  {r.tags?.length > 0 && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:6}}>
                      {r.tags.map(t=>(
                        <span key={t} style={{fontSize:10,padding:"2px 9px",borderRadius:50,
                          background:"rgba(0,229,255,.08)",color:"var(--c)",border:"1.5px solid rgba(0,229,255,.18)"}}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {inf.reviews.length > 0 && userReviews.length === 0 && <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,margin:"14px 0 10px"}}>OTHER REVIEWS</div>}
            </>
          )}

          {/* Only show hardcoded reviews when no real Firebase reviews exist */}
          {userReviews.length === 0 && inf.reviews.map((r,i)=>(
            <div key={i} style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",
              borderRadius:13,padding:17,marginBottom:10,
              animation:`fadeUp .4s ${i*.1}s both`,transition:"border-color .2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,229,255,.15)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b)"}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontWeight:700,fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{r.user}</span>
                <ReviewStars v={r.stars} size={14}/>
              </div>
              <p style={{color:"var(--txt2)",fontSize:13,lineHeight:1.7}}>{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Write Review Modal ─────────────────────────────────
function WriteReviewModal({ camp, onClose, onSubmit, bizName="Your Business", initials="BZ", bizPfp="" }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeTags, setActiveTags] = useState([]);

  const inp = {background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:14,
    padding:"11px 13px",color:"var(--txt)",fontSize:13,outline:"none",
    fontFamily:"'DM Sans',sans-serif",width:"100%",transition:"border-color .2s"};

  const submit = () => {
    if (!rating) return;
    onSubmit({
      user: bizName,
      text: review || activeTags.join(" · ") || "Completed campaign.",
      stars: rating,
      tags: activeTags,
      date: new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}),
      fromBusiness: true,
      pfp: bizPfp,
    });
    setSubmitted(true);
  };

  return (
    <div className="mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mbox">
        <div style={{padding:"20px 18px"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800}}>Write a Review</div>
            <button onClick={onClose} style={{background:"none",border:"none",color:"var(--txt2)",cursor:"pointer",fontSize:20,lineHeight:1}}>✕</button>
          </div>

          {!submitted ? (
            <div className="fi">
              {/* Influencer info */}
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",borderRadius:13,marginBottom:20,border:"1.5px solid rgba(255,255,255,.07)"}}>
                <div style={{width:44,height:44,borderRadius:"50%",flexShrink:0,
                  background:"linear-gradient(135deg,#00E5FF,#00bcd4)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,color:"#070710"}}>
                  {camp.influencer.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14}}>{camp.influencer}</div>
                  <div style={{fontSize:11,color:"var(--txt2)"}}>{camp.handle} · {camp.platform}</div>
                  <div style={{fontSize:10,color:"var(--amb)",marginTop:2}}>✓ Completed · {camp.start} – {camp.end}</div>
                </div>
              </div>

              {/* Star rating */}
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:.6,marginBottom:10}}>YOUR RATING</div>
                <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                  {[1,2,3,4,5].map(s=>(
                    <span key={s} onClick={()=>setRating(s)}
                      style={{fontSize:34,cursor:"pointer",
                        color:rating>=s?"var(--c)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                        transition:"color .15s,transform .15s",display:"inline-block",
                        transform:rating>=s?"scale(1.18)":"scale(1)",
                        filter:rating>=s?"drop-shadow(0 0 6px rgba(0,229,255,.5))":"none"}}>★</span>
                  ))}
                </div>
                {rating>0 && (
                  <div style={{textAlign:"center",marginTop:8,fontSize:12,color:"var(--c)",fontWeight:600,animation:"fadeIn .2s both"}}>
                    {["","Poor","Fair","Good","Great","Excellent!"][rating]}
                  </div>
                )}
              </div>

              {/* Review text */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:.6,marginBottom:7}}>YOUR REVIEW</div>
                <textarea value={review} onChange={e=>setReview(e.target.value)}
                  placeholder="Describe your experience — campaign quality, communication, results..."
                  rows={4} style={{...inp,resize:"none"}}
                  onFocus={e=>e.target.style.borderColor="var(--c)"}
                  onBlur={e=>e.target.style.borderColor="var(--b)"}/>
                <div style={{fontSize:10,color:"var(--txt3)",marginTop:5,textAlign:"right"}}>{review.length}/300</div>
              </div>

              {/* Tags */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:.6,marginBottom:8}}>QUICK TAGS (optional)</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {["Great ROI","Professional","Creative","On-time","High Engagement","Exceeded Expectations"].map(tag=>(
                    <button key={tag} onClick={()=>setActiveTags(t=>t.includes(tag)?t.filter(x=>x!==tag):[...t,tag])} style={{
                      padding:"5px 12px",borderRadius:50,fontSize:11,fontWeight:600,cursor:"pointer",
                      background:activeTags.includes(tag)?"rgba(0,229,255,.15)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                      color:activeTags.includes(tag)?"var(--c)":"var(--txt2)",
                      border:activeTags.includes(tag)?"1px solid rgba(0,229,255,.35)":"1px solid var(--b)",
                      transition:"all .18s",fontFamily:"'DM Sans',sans-serif"
                    }}>{activeTags.includes(tag)?"✓ ":""}{tag}</button>
                  ))}
                </div>
              </div>

              <button onClick={submit} disabled={!rating} className="btnp"
                style={{width:"100%",justifyContent:"center",opacity:rating?1:.5}}>
                Submit Review ★
              </button>
            </div>
          ) : (
            <div className="fi" style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{width:65,height:65,borderRadius:"50%",background:"linear-gradient(145deg,rgba(0,230,118,.18),rgba(0,200,80,.08))",
                border:"2px solid var(--grn)",display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:27,margin:"0 auto 14px",
                animation:"scaleIn .4s cubic-bezier(.16,1,.3,1)"}}>★</div>
              <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,marginBottom:8}}>Review Submitted!</h3>
              <p style={{color:"var(--txt2)",fontSize:13,marginBottom:22,lineHeight:1.7}}>
                Thanks for reviewing <strong style={{color:"var(--txt)"}}>{camp.influencer}</strong>.<br/>
                Your feedback helps other businesses make better decisions.
              </p>
              <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:22}}>
                {[1,2,3,4,5].map(s=>(
                  <span key={s} style={{fontSize:22,color:rating>=s?"var(--c)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))"
                  }}>★</span>
                ))}
              </div>
              <button onClick={onClose} className="btnp" style={{width:"100%",justifyContent:"center"}}>Done ✦</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Logout Confirm Modal ──────────────────────────────
function LogoutConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="mbg" onClick={e=>e.target===e.currentTarget&&onCancel()}>
      <div className="mbox" style={{padding:28,textAlign:"center",maxWidth:320}}>
        <div style={{width:56,height:56,borderRadius:"50%",margin:"0 auto 16px",
          background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.3)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>⎋</div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,marginBottom:8}}>Sign Out?</div>
        <div style={{fontSize:13,color:"var(--txt2)",lineHeight:1.6,marginBottom:24}}>
          You'll need to sign in again to access your dashboard and campaigns.
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} className="btng" style={{flex:1,justifyContent:"center",padding:"12px"}}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            flex:1,padding:"12px",border:"none",borderRadius:50,
            background:"linear-gradient(135deg,#f87171,#dc2626)",
            color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",
            fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"opacity .2s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
            onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  COLLANCER PRO — Feature Lock System
//  Pro features are for BUSINESSES only. Creators stay free.
// ══════════════════════════════════════════════════════

const PRO_FEATURES = [
  { icon:"🤖", title:"Cleo AI Assistant", desc:"Ask Cleo anything — get instant creator recommendations, pricing insights, and campaign guidance powered by AI." },
  { icon:"🏷️", title:"10% Flat Booking Discount", desc:"Save 10% on every single booking you make. The more you book, the more you save — automatically applied at checkout." },
  { icon:"📊", title:"Deep Influencer Analytics", desc:"Unlock detailed analytics for every creator — audience demographics, engagement trends, brand affinity scores, and campaign ROI forecasts." },
  { icon:"🎬", title:"Promotion Demo Videos", desc:"Watch creators' actual promotion demos before booking — story demos, reel demos, YT demos, and personal ad samples." },
];

const PRO_PLANS = [
  {
    id:"monthly", label:"1 Month", duration:"month",
    price:999, originalPrice:999, discount:0,
    tag:null,
    color:"var(--c)", color2:"var(--c2)",
  },
  {
    id:"biannual", label:"6 Months", duration:"6 months",
    price:799, originalPrice:999, discount:20,
    tag:"POPULAR",
    color:"#9c6af7", color2:"#7c4af7",
  },
  {
    id:"annual", label:"12 Months", duration:"year",
    price:599, originalPrice:999, discount:40,
    tag:"BEST VALUE",
    color:"#ffab40", color2:"#ff8f00",
  },
];

// The Pro Feature Popup Modal — compact, scrollable, with back button
function ProFeatureModal({ feature, onClose, onSeePlans }) {
  const icons = { cleo:"🤖", analytics:"📊", demo:"🎬", discount:"🏷️" };
  const titles = { cleo:"Cleo AI", analytics:"Deep Analytics", demo:"Promo Demos", discount:"10% Discount" };
  const descs = {
    cleo: "Your AI-powered creator intelligence. Ask Cleo to find perfect influencers, compare pricing, analyse reach vs budget, and get campaign strategy — all in seconds.",
    analytics: "Unlock deep audience insights: age & gender breakdown, city-level reach, engagement velocity, brand affinity scores, conversion rate forecasts, and 6-month trend graphs.",
    demo: "Watch real promotion demos uploaded by creators before booking — story, reel, YouTube, and personal ad samples — so you know exactly what you're getting.",
    discount: "Every booking gets an automatic 10% off — no codes, no limits. The more you book, the more you save.",
  };
  const icon = icons[feature] || "⚡";
  const title = titles[feature] || "Collancer Pro";
  const desc = descs[feature] || "";

  return (
    <div className="mbg" onClick={e=>e.target===e.currentTarget&&onClose()} style={{zIndex:2000,alignItems:"flex-end",padding:0}}>
      <div style={{
        width:"100%",maxWidth:430,
        background:"linear-gradient(145deg,rgba(16,16,38,.97),rgba(10,10,26,.99))",
        border:"1px solid rgba(156,106,247,.4)",
        borderRadius:"28px 28px 0 0",
        boxShadow:"0 -8px 60px rgba(156,106,247,.2),0 -2px 0 rgba(156,106,247,.3)",
        maxHeight:"88vh",overflowY:"auto",
        animation:"slideUp .35s cubic-bezier(.16,1,.3,1) both"
      }} className="nosb">
        {/* Handle bar */}
        <div style={{display:"flex",justifyContent:"center",paddingTop:12,paddingBottom:4}}>
          <div style={{width:36,height:4,borderRadius:2,background:"rgba(156,106,247,.35)"}}/>
        </div>

        {/* Top line */}
        <div style={{height:2,background:"linear-gradient(90deg,transparent,#9c6af7,#ffab40,#9c6af7,transparent)",margin:"0 0 20px"}}/>

        <div style={{padding:"0 22px 28px"}}>
          {/* Back + close row */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
            <button onClick={onClose}
              style={{display:"flex",alignItems:"center",gap:6,background:"rgba(156,106,247,.1)",
                border:"1px solid rgba(156,106,247,.25)",borderRadius:50,
                padding:"7px 14px",color:"#9c6af7",cursor:"pointer",fontSize:12,fontWeight:700}}>
              ← Back
            </button>
            <span className="pro-badge" style={{fontSize:10}}>✦ COLLANCER PRO</span>
          </div>

          {/* Feature icon + title */}
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <div style={{width:56,height:56,borderRadius:22,flexShrink:0,
              background:"linear-gradient(135deg,rgba(156,106,247,.22),rgba(255,171,64,.1))",
              border:"1px solid rgba(156,106,247,.4)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,
              boxShadow:"0 4px 20px rgba(156,106,247,.25),0 0 0 6px rgba(156,106,247,.06)",
              animation:"proGlow 2.5s ease infinite"}}>
              {icon}
            </div>
            <div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,
                background:"linear-gradient(135deg,#9c6af7,#ffab40)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4}}>
                {title}
              </div>
              <div style={{fontSize:12,color:"var(--txt2)"}}>Collancer Pro exclusive feature</div>
            </div>
          </div>

          {/* Description */}
          <div style={{fontSize:13,color:"var(--txt)",lineHeight:1.8,marginBottom:18,
            padding:"14px 16px",background:"rgba(156,106,247,.06)",borderRadius:18,
            border:"1px solid rgba(156,106,247,.14)"}}>
            {desc}
          </div>

          {/* All features compact list */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:10}}>ALL PRO FEATURES</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {PRO_FEATURES.map(f=>(
                <div key={f.title} style={{display:"flex",alignItems:"center",gap:10,
                  padding:"10px 12px",borderRadius:16,
                  background:f.icon===icon?"rgba(156,106,247,.1)":"rgba(255,255,255,.02)",
                  border:f.icon===icon?"1px solid rgba(156,106,247,.3)":"1px solid var(--b)"}}>
                  <span style={{fontSize:18,flexShrink:0}}>{f.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:f.icon===icon?"#9c6af7":"var(--txt)",
                      fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{f.title}</div>
                  </div>
                  {f.icon===icon && <span style={{fontSize:10,color:"#9c6af7",fontWeight:700,flexShrink:0}}>Active</span>}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button onClick={onSeePlans}
            style={{width:"100%",padding:"15px",border:"none",borderRadius:20,
              background:"linear-gradient(135deg,#9c6af7,#7c4af7)",
              color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              boxShadow:"0 5px 0 #5a2eb5,0 8px 24px rgba(156,106,247,.5)",
              position:"relative",overflow:"hidden",
              transition:"transform .2s,box-shadow .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 0 #5a2eb5,0 12px 32px rgba(156,106,247,.6)"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 6px 0 #5a2eb5,0 8px 24px rgba(156,106,247,.5)"}}>
            <span style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,.15),transparent)",pointerEvents:"none"}}/>
            ✦ See Pro Plans & Pricing →
          </button>
        </div>
      </div>
    </div>
  );
}

// Pro Purchase Success Popup
function ProSuccessPopup({ plan, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{position:"fixed",inset:0,zIndex:5000,
      background:"rgba(0,0,0,.92)",backdropFilter:"blur(16px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:20,
      animation:"fadeIn .4s ease both"}}>
      {/* Confetti-like particles */}
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        {[...Array(18)].map((_,i)=>(
          <div key={i} style={{
            position:"absolute",
            width:i%3===0?8:i%3===1?6:4,
            height:i%3===0?8:i%3===1?6:4,
            borderRadius:i%2===0?"50%":"2px",
            background:["#9c6af7","#ffab40","#00E5FF","#00e676","#f87171"][i%5],
            left:`${10+i*5}%`,
            top:`${Math.random()*80}%`,
            opacity:.7,
            animation:`confettiFall ${1.5+i*.2}s ease ${i*.08}s both`,
          }}/>
        ))}
      </div>

      <div style={{
        maxWidth:360,width:"100%",textAlign:"center",
        background:"linear-gradient(180deg,rgba(156,106,247,.15) 0%,rgba(10,10,26,.98) 40%)",
        border:"1px solid rgba(156,106,247,.5)",borderRadius:32,padding:"32px 24px",
        position:"relative",overflow:"hidden",
        animation:"scaleIn .5s cubic-bezier(.16,1,.3,1) .1s both",
        boxShadow:"0 0 0 1px rgba(156,106,247,.2),0 40px 100px rgba(0,0,0,.9),0 0 80px rgba(156,106,247,.25)"
      }}>
        {/* Top glow line */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,
          background:"linear-gradient(90deg,transparent,#9c6af7,#ffab40,#00E5FF,#9c6af7,transparent)"}}/>
        {/* Radial background glow */}
        <div style={{position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",
          width:200,height:200,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(156,106,247,.25) 0%,transparent 70%)",
          pointerEvents:"none"}}/>

        {/* Animated ⚡ crown */}
        <div style={{position:"relative",marginBottom:20}}>
          <div style={{width:88,height:88,borderRadius:32,margin:"0 auto",
            background:"linear-gradient(135deg,rgba(156,106,247,.3),rgba(255,171,64,.15))",
            border:"2px solid rgba(156,106,247,.6)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,
            boxShadow:"0 0 0 8px rgba(156,106,247,.08),0 0 0 16px rgba(156,106,247,.04),0 16px 48px rgba(156,106,247,.4)",
            animation:"proGlow 1.5s ease infinite"}}>
            ⚡
          </div>
          {/* Orbiting dots */}
          {[0,120,240].map(deg=>(
            <div key={deg} style={{
              position:"absolute",top:"50%",left:"50%",
              width:8,height:8,borderRadius:"50%",
              background:["#9c6af7","#ffab40","#00E5FF"][deg/120],
              transform:`rotate(${deg}deg) translateX(54px) translateY(-50%)`,
              boxShadow:`0 0 8px ${["#9c6af7","#ffab40","#00E5FF"][deg/120]}`,
              animation:`orbit${deg} 2.5s linear infinite`,
            }}/>
          ))}
        </div>

        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:26,fontWeight:800,
          marginBottom:8,
          background:"linear-gradient(135deg,#9c6af7 0%,#ffab40 50%,#00E5FF 100%)",
          backgroundSize:"200% auto",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          animation:"gradshift 2s ease infinite"}}>
          Welcome to Pro!
        </div>
        <div style={{fontSize:13,color:"var(--txt2)",lineHeight:1.7,marginBottom:20}}>
          🎉 Your <strong style={{color:"var(--txt)"}}>{plan.label} Plan</strong> is now active. All Pro features are unlocked!
        </div>

        {/* Unlocked features grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:22}}>
          {PRO_FEATURES.map(f=>(
            <div key={f.title} style={{
              padding:"10px 10px",borderRadius:16,textAlign:"left",
              background:"rgba(156,106,247,.08)",border:"1px solid rgba(156,106,247,.2)"}}>
              <div style={{fontSize:20,marginBottom:4}}>{f.icon}</div>
              <div style={{fontSize:11,fontWeight:700,color:"#9c6af7",
                fontFamily:"'Plus Jakarta Sans',sans-serif",lineHeight:1.3}}>
                {f.title.split(" ").slice(0,2).join(" ")}
              </div>
              <div style={{fontSize:9,color:"var(--grn)",fontWeight:700,marginTop:2}}>✓ UNLOCKED</div>
            </div>
          ))}
        </div>

        <button onClick={onClose}
          style={{width:"100%",padding:"14px",border:"none",borderRadius:18,
            background:"linear-gradient(135deg,#9c6af7,#7c4af7)",color:"#fff",
            fontSize:15,fontWeight:800,cursor:"pointer",
            fontFamily:"'Plus Jakarta Sans',sans-serif",
            boxShadow:"0 5px 0 #5a2eb5,0 8px 24px rgba(156,106,247,.5)",
            position:"relative",overflow:"hidden"}}>
          <span style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,.15),transparent)",pointerEvents:"none"}}/>
          ✦ Start Using Pro →
        </button>
      </div>
    </div>
  );
}

// Collancer Pro Plans Page — full payment flow
// Pro Status Page — mobile-first, shown when business has active Pro
function ProStatusPage({ onBack, bizData }) {
  const planLabel = {monthly:"1 Month",biannual:"6 Months",annual:"12 Months"};
  const planColor = {monthly:"var(--c)",biannual:"#9c6af7",annual:"#ffab40"};
  const planName  = bizData?.proPlan || "monthly";
  const color     = planColor[planName] || "#9c6af7";

  const expiresAt   = bizData?.proExpiresAt ? new Date(bizData.proExpiresAt) : null;
  const now         = new Date();
  const daysLeft    = Math.max(0, Math.ceil((expiresAt ? expiresAt - now : 0) / 86400000));
  const totalDays   = planName==="annual"?365:planName==="biannual"?180:30;
  const pctLeft     = Math.min(100, Math.round((daysLeft/totalDays)*100));
  const purchasedAt = bizData?.proPurchasedAt?.seconds
    ? new Date(bizData.proPurchasedAt.seconds*1000).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})
    : "Active";

  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"12px 14px 100px",animation:"fadeUp .4s both",
      boxSizing:"border-box",width:"100%"}}>

      {/* Back */}
      <button onClick={onBack}
        style={{display:"inline-flex",alignItems:"center",gap:6,
          background:`${color}14`,border:`1px solid ${color}33`,
          borderRadius:50,color,padding:"7px 14px",cursor:"pointer",
          fontSize:12,fontWeight:700,marginBottom:16,transition:"all .2s"}}>
        ← Back
      </button>

      {/* Hero banner — compact mobile card */}
      <div style={{borderRadius:24,padding:"18px 16px",marginBottom:14,
        background:`linear-gradient(135deg,${color}18,${color}06)`,
        border:`1px solid ${color}44`,position:"relative",overflow:"hidden",
        boxShadow:`0 6px 30px ${color}16`}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,
          background:`linear-gradient(90deg,transparent,${color},${color==="var(--c)"?"#ffab40":"var(--c)"},${color},transparent)`}}/>
        <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,
          borderRadius:"50%",background:`radial-gradient(circle,${color}22 0%,transparent 70%)`,
          pointerEvents:"none"}}/>

        {/* Row: icon + title + badge */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{width:52,height:52,borderRadius:20,flexShrink:0,
            background:`linear-gradient(135deg,${color}28,${color}0a)`,
            border:`2px solid ${color}44`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,
            boxShadow:`0 0 0 4px ${color}0d,0 4px 16px ${color}28`,
            animation:"proGlow 2.5s ease infinite"}}>
            ⚡
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,
              background:`linear-gradient(135deg,${color},${color==="var(--c)"?"#ffab40":"var(--c)"})`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
              marginBottom:4,whiteSpace:"nowrap"}}>
              Collancer Pro
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              <span style={{padding:"3px 10px",borderRadius:50,fontSize:10,fontWeight:800,
                background:`linear-gradient(135deg,${color},${color}99)`,color:"#fff",
                fontFamily:"'Plus Jakarta Sans',sans-serif",whiteSpace:"nowrap"}}>
                {planLabel[planName]} Plan
              </span>
              <span style={{fontSize:10,color:"var(--grn)",fontWeight:700,display:"flex",alignItems:"center",gap:3}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"var(--grn)",
                  display:"inline-block",animation:"pulse 1.5s ease infinite"}}/>
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Days remaining */}
        <div style={{background:"rgba(0,0,0,.22)",borderRadius:18,padding:"12px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:8}}>
            <div>
              <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:.8,marginBottom:3}}>
                EXPIRES
              </div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:800,
                color:"var(--txt)",lineHeight:1.2}}>
                {expiresAt ? expiresAt.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:32,fontWeight:800,
                color,lineHeight:1}}>{daysLeft}</div>
              <div style={{fontSize:10,color:"var(--txt2)"}}>days left</div>
            </div>
          </div>
          <div style={{height:7,background:"rgba(255,255,255,.08)",borderRadius:8,overflow:"hidden",marginBottom:5}}>
            <div style={{height:"100%",width:`${pctLeft}%`,borderRadius:8,
              background:`linear-gradient(90deg,${color},${color}88)`,
              transition:"width .8s cubic-bezier(.16,1,.3,1)",
              boxShadow:`0 0 8px ${color}66`}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:9,color:"var(--txt2)"}}>Purchased {purchasedAt}</span>
            <span style={{fontSize:9,color,fontWeight:600}}>{pctLeft}% remaining</span>
          </div>
        </div>
      </div>

      {/* Active features — 2×2 grid for mobile */}
      <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1,marginBottom:10}}>
        YOUR ACTIVE PRO FEATURES
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {PRO_FEATURES.map((f,i)=>(
          <div key={f.title} style={{padding:"12px 12px",borderRadius:18,
            background:`linear-gradient(135deg,${color}0c,rgba(255,255,255,.01))`,
            border:`1px solid ${color}20`,
            animation:`fadeUp .4s ${i*.06}s both`,
            display:"flex",flexDirection:"column",gap:6}}>
            <div style={{fontSize:22}}>{f.icon}</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:700,
              color:"var(--txt)",lineHeight:1.3}}>{f.title}</div>
            <div style={{fontSize:10,color:"var(--txt2)",lineHeight:1.45,
              display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
              {f.desc}
            </div>
            <div style={{display:"inline-flex",alignItems:"center",gap:4,
              padding:"3px 8px",borderRadius:50,alignSelf:"flex-start",
              background:"linear-gradient(145deg,rgba(0,230,118,.15),rgba(0,200,80,.06))",border:"1px solid rgba(0,230,118,.2)"}}>
              <span style={{fontSize:9}}>✓</span>
              <span style={{fontSize:9,fontWeight:700,color:"var(--grn)"}}>Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription info — compact list */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:18,
        padding:"14px 16px"}}>
        <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1,marginBottom:10}}>
          SUBSCRIPTION INFO
        </div>
        {[
          ["Plan", planLabel[planName]||"Monthly"],
          ["Status", "Active ✓"],
          ["Purchased", purchasedAt],
          ["Expires", expiresAt?expiresAt.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—"],
          ["Days Remaining", daysLeft+" days"],
        ].map(([l,v],i,arr)=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:"9px 0",borderBottom:i<arr.length-1?"1px solid var(--b)":"none"}}>
            <span style={{fontSize:12,color:"var(--txt2)"}}>{l}</span>
            <span style={{fontSize:12,fontWeight:700,
              color:l==="Status"?"var(--grn)":l==="Days Remaining"?color:"var(--txt)"}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


function CollancerProPage({ onBack, onProPurchased, authUser }) {
  const [selectedPlan, setSelectedPlan] = useState("biannual");
  const [step, setStep] = useState(1); // 1=plans, 2=payment
  const [payMethod, setPayMethod] = useState("UPI");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [upi, setUpi] = useState("");
  const [processing, setProcessing] = useState(false);

  const plan = PRO_PLANS.find(p=>p.id===selectedPlan);
  const totalPrice = selectedPlan==="biannual" ? plan.price*6 : selectedPlan==="annual" ? plan.price*12 : plan.price;
  const savingsVsMonthly = selectedPlan==="biannual" ? (999-799)*6 : selectedPlan==="annual" ? (999-599)*12 : 0;
  const months = selectedPlan==="biannual" ? 6 : selectedPlan==="annual" ? 12 : 1;

  const canPay = payMethod==="UPI" ? upi.trim().length>4 : card.trim().length>=15 && exp.trim().length===5 && cvv.trim().length>=3;

  const handlePurchase = async () => {
    if (!canPay) return;
    setProcessing(true);
    await new Promise(r=>setTimeout(r,2000));
    // Write isPro to Firebase businesses collection
    if (authUser?.uid && window.__cfs) {
      try {
        const { doc, updateDoc, serverTimestamp } = window.__cfs;
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + months);
        await updateDoc(doc(window.__cdb,"businesses",authUser.uid), {
          isPro: true,
          proActive: true,
          proPlan: selectedPlan,
          proExpiresAt: expiry.toISOString(),
          proPurchasedAt: serverTimestamp(),
        });
      } catch(e) { console.error("Pro purchase write error:", e); }
    }
    setProcessing(false);
    if (onProPurchased) onProPurchased(plan);
  };

  const inp = {
    background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1px solid rgba(156,106,247,.25)",borderRadius:16,
    padding:"12px 14px",color:"var(--txt)",fontSize:13,outline:"none",
    fontFamily:"'DM Sans',sans-serif",width:"100%",marginBottom:10,
    transition:"border-color .2s",
  };

  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 100px",animation:"fadeUp .4s both"}}>
      {/* Back */}
      <button onClick={step===2?()=>setStep(1):onBack}
        style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(156,106,247,.08)",
          border:"1px solid rgba(156,106,247,.25)",borderRadius:50,
          color:"#9c6af7",padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:700,
          marginBottom:20,transition:"all .2s"}}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(156,106,247,.18)"}
        onMouseLeave={e=>e.currentTarget.style.background="rgba(156,106,247,.08)"}>
        ← {step===2?"Choose Plan":"Back"}
      </button>

      {/* Hero */}
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",
          width:72,height:72,borderRadius:26,
          background:"linear-gradient(135deg,rgba(156,106,247,.2),rgba(255,171,64,.1))",
          border:"1px solid rgba(156,106,247,.4)",
          boxShadow:"0 0 0 10px rgba(156,106,247,.06),0 12px 40px rgba(156,106,247,.2)",
          marginBottom:14,fontSize:36}}>
          ⚡
          <div style={{position:"absolute",inset:0,borderRadius:26,
            background:"linear-gradient(135deg,rgba(255,255,255,.08),transparent)",pointerEvents:"none"}}/>
        </div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:24,fontWeight:800,
          background:"linear-gradient(135deg,#9c6af7 0%,#ffab40 50%,#9c6af7 100%)",
          backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          animation:"gradshift 3s ease infinite",marginBottom:6}}>
          {step===1?"Collancer Pro":"Complete Payment"}
        </div>
        <p style={{fontSize:13,color:"var(--txt2)",lineHeight:1.6}}>
          {step===1?"AI insights, deep analytics, promo demos & 10% booking discount":"Secure payment via Razorpay · Instant activation"}
        </p>
      </div>

      {step===1 && (
        <>
          {/* Plan selector */}
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            {PRO_PLANS.map(p=>(
              <button key={p.id} onClick={()=>setSelectedPlan(p.id)}
                style={{flex:1,padding:"12px 6px",borderRadius:20,cursor:"pointer",
                  position:"relative",overflow:"hidden",
                  border:selectedPlan===p.id?`2px solid ${p.color}`:"1px solid var(--b)",
                  background:selectedPlan===p.id?`linear-gradient(135deg,${p.color}18,${p.color2}0a)`:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
                  transition:"all .25s",
                  boxShadow:selectedPlan===p.id?`0 4px 20px ${p.color}33`:"none"}}>
                {p.tag && (
                  <div style={{position:"absolute",top:0,left:0,right:0,
                    background:`linear-gradient(135deg,${p.color},${p.color2})`,
                    fontSize:7,fontWeight:800,color:"#fff",padding:"3px 0",textAlign:"center",
                    letterSpacing:.8,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                    {p.tag}
                  </div>
                )}
                <div style={{paddingTop:p.tag?12:0}}>
                  <div style={{fontSize:10,color:"var(--txt2)",fontWeight:600,marginBottom:3}}>{p.label}</div>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:19,fontWeight:800,
                    color:selectedPlan===p.id?p.color:"var(--txt)"}}>
                    ₹{p.price.toLocaleString("en-IN")}
                  </div>
                  <div style={{fontSize:9,color:"var(--txt2)"}}>per month</div>
                  {p.discount>0 && <div style={{fontSize:9,fontWeight:700,color:"var(--grn)",marginTop:3}}>SAVE {p.discount}%</div>}
                </div>
              </button>
            ))}
          </div>

          {/* Summary box */}
          <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:`1px solid ${plan.color}44`,borderRadius:20,
            padding:18,marginBottom:20,
            boxShadow:`0 4px 20px ${plan.color}18`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800}}>{plan.label} Plan</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:plan.color}}>
                ₹{totalPrice.toLocaleString("en-IN")}
              </div>
            </div>
            {savingsVsMonthly>0 && (
              <div style={{background:"rgba(0,230,118,.08)",border:"1px solid rgba(0,230,118,.2)",
                borderRadius:14,padding:"8px 12px",marginBottom:10,
                display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>🎉</span>
                <div style={{fontSize:12,color:"var(--grn)",fontWeight:600}}>
                  You save ₹{savingsVsMonthly.toLocaleString("en-IN")} vs monthly!
                </div>
              </div>
            )}
            {[["Per month",`₹${plan.price.toLocaleString("en-IN")}`],["Total today",`₹${totalPrice.toLocaleString("en-IN")}`]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:12,color:"var(--txt2)"}}>{l}</span>
                <span style={{fontSize:12,fontWeight:700,color:"var(--txt)"}}>{v}</span>
              </div>
            ))}
          </div>

          {/* Features compact */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
            {PRO_FEATURES.map(f=>(
              <div key={f.title} style={{padding:"12px",borderRadius:18,
                background:"linear-gradient(135deg,rgba(156,106,247,.08),rgba(156,106,247,.03))",
                border:"1px solid rgba(156,106,247,.18)"}}>
                <div style={{fontSize:22,marginBottom:6}}>{f.icon}</div>
                <div style={{fontSize:12,fontWeight:700,color:"var(--txt)",
                  fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:3}}>{f.title}</div>
                <div style={{fontSize:10,color:"var(--txt2)",lineHeight:1.5}}>{f.desc.slice(0,55)}…</div>
              </div>
            ))}
          </div>

          <button onClick={()=>setStep(2)}
            style={{width:"100%",padding:"15px",border:"none",borderRadius:20,
              background:`linear-gradient(135deg,${plan.color},${plan.color2})`,
              color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              boxShadow:`0 6px 0 ${plan.id==="monthly"?"#006080":plan.id==="biannual"?"#5a2eb5":"#b35900"},0 8px 24px ${plan.color}44`,
              position:"relative",overflow:"hidden",transition:"transform .2s,box-shadow .2s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            <span style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,.15),transparent)",pointerEvents:"none"}}/>
            ✦ Continue to Payment — ₹{totalPrice.toLocaleString("en-IN")} →
          </button>
          <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"var(--txt2)"}}>
            🔒 Secure · Cancel anytime · Instant activation
          </div>
        </>
      )}

      {step===2 && (
        <div style={{animation:"fadeUp .35s both"}}>
          {/* Order summary strip */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:"14px 16px",marginBottom:18,
            background:`linear-gradient(135deg,${plan.color}14,${plan.color2}0a)`,
            border:`1px solid ${plan.color}33`,borderRadius:16}}>
            <div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:800}}>{plan.label} Pro Plan</div>
              <div style={{fontSize:11,color:"var(--txt2)"}}>Instant activation after payment</div>
            </div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:plan.color}}>
              ₹{totalPrice.toLocaleString("en-IN")}
            </div>
          </div>

          {/* Secure badge */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,
            padding:"10px 14px",background:"rgba(0,230,118,.05)",
            border:"1px solid rgba(0,230,118,.2)",borderRadius:10}}>
            <span style={{fontSize:16}}>🔒</span>
            <span style={{fontSize:12,color:"var(--txt2)"}}>Secured by Razorpay · All Indian payment methods accepted</span>
          </div>

          {/* Payment method toggle */}
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {[["UPI","📱 UPI"],["Card","💳 Card"],["NetBanking","🏦 Net Banking"]].map(([m,l])=>(
              <button key={m} onClick={()=>setPayMethod(m)}
                style={{flex:1,padding:"9px 4px",borderRadius:16,cursor:"pointer",fontSize:11,fontWeight:700,
                  border:payMethod===m?"2px solid var(--c)":"1px solid var(--b)",
                  background:payMethod===m?"rgba(0,229,255,.1)":"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
                  color:payMethod===m?"var(--c)":"var(--txt2)",transition:"all .2s"}}>
                {l}
              </button>
            ))}
          </div>

          {payMethod==="UPI" && (
            <>
              <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:.5,marginBottom:6}}>UPI ID</div>
              <input value={upi} onChange={e=>setUpi(e.target.value)} placeholder="yourname@upi / GPay / PhonePe" style={inp}/>
              <div style={{display:"flex",gap:8,marginBottom:16}}>
                {["GPay","PhonePe","Paytm","BHIM"].map(app=>(
                  <div key={app} style={{flex:1,padding:"7px 4px",borderRadius:14,textAlign:"center",
                    background:"linear-gradient(145deg,rgba(22,22,50,.7),rgba(14,14,32,.8))",border:"1.5px solid rgba(255,255,255,.07)",cursor:"pointer",
                    fontSize:10,fontWeight:600,color:"var(--txt2)"}}
                    onClick={()=>setUpi("")}>
                    {app}
                  </div>
                ))}
              </div>
            </>
          )}

          {payMethod==="Card" && (
            <>
              <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:.5,marginBottom:6}}>CARD NUMBER</div>
              <input value={card} onChange={e=>setCard(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())}
                placeholder="1234 5678 9012 3456" style={inp} maxLength={19}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div>
                  <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:.5,marginBottom:6}}>EXPIRY</div>
                  <input value={exp} onChange={e=>{
                    let v=e.target.value.replace(/\D/g,"");
                    if(v.length>2)v=v.slice(0,2)+"/"+v.slice(2,4);
                    setExp(v);
                  }} placeholder="MM/YY" style={{...inp,marginBottom:0}} maxLength={5}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:.5,marginBottom:6}}>CVV</div>
                  <input value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,"").slice(0,4))}
                    placeholder="•••" type="password" style={{...inp,marginBottom:0,fontFamily:"'DM Mono',monospace"}}/>
                </div>
              </div>
            </>
          )}

          {payMethod==="NetBanking" && (
            <>
              <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:.5,marginBottom:10}}>SELECT YOUR BANK</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                {["SBI","HDFC","ICICI","Axis","Kotak","Yes Bank"].map(bank=>(
                  <button key={bank} onClick={()=>setUpi(bank)}
                    style={{padding:"10px",borderRadius:16,cursor:"pointer",fontSize:12,fontWeight:700,
                      border:upi===bank?"2px solid var(--c)":"1px solid var(--b)",
                      background:upi===bank?"rgba(0,229,255,.1)":"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
                      color:upi===bank?"var(--c)":"var(--txt)",transition:"all .2s"}}>
                    {bank}
                  </button>
                ))}
              </div>
            </>
          )}

          <button onClick={handlePurchase}
            disabled={processing||!canPay}
            style={{width:"100%",padding:"15px",border:"none",borderRadius:20,
              background:canPay?"linear-gradient(135deg,#9c6af7,#7c4af7)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
              color:canPay?"#fff":"var(--txt3)",
              fontSize:15,fontWeight:800,cursor:canPay?"pointer":"not-allowed",
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              boxShadow:canPay?"0 6px 0 #5a2eb5,0 8px 28px rgba(156,106,247,.5)":"none",
              position:"relative",overflow:"hidden",transition:"all .25s",
              opacity:processing?0.8:1}}
            onMouseEnter={e=>{if(canPay&&!processing){e.currentTarget.style.transform="translateY(-2px)"}}}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            {canPay&&<span style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,.15),transparent)",pointerEvents:"none"}}/>}
            {processing
              ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  <span style={{animation:"spin 1s linear infinite",display:"inline-block",fontSize:18}}>◌</span>
                  Processing Payment…
                </span>
              : `✦ Pay ₹${totalPrice.toLocaleString("en-IN")} & Activate Pro`}
          </button>
          <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"var(--txt2)"}}>
            By purchasing you agree to Collancer Pro Terms · Auto-renews · Cancel anytime
          </div>
        </div>
      )}
    </div>
  );
}



// ── Dashboard ──────────────────────────────────────────
function DashPage({ campaigns, setCampaigns, notifs=NOTIFS, userReviews, onAddReview, bizName, initials, bizPfp, setBizPfp, setBizName, rawBizName, onLogout, extraCreators=[], onPrivacy, onTerms, isPro=false, onGoToPro }) {
  const [reviewCamp, setReviewCamp] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(rawBizName||"");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [drivePopup, setDrivePopup] = useState(null); // { bookingId, link, creatorName }
  const fileInputRef = useRef(null);
  const sc = {Active:"var(--grn)",Completed:"var(--amb)",Pending:"var(--pur)",Cancelled:"var(--red)"};

  // Compute stats dynamically from live campaigns
  const activeCamps = campaigns.filter(c=>c.status==="Active").length;
  const pendingCamps = campaigns.filter(c=>c.status==="Pending").length;
  const completedCamps = campaigns.filter(c=>c.status==="Completed").length;
  const totalSpend = campaigns.reduce((sum,c)=>sum+(c.budget||0),0);
  const spendLabel = totalSpend>=100000 ? "₹"+(totalSpend/100000).toFixed(1)+"L" : totalSpend>=1000 ? "₹"+(totalSpend/1000).toFixed(0)+"K" : "₹"+totalSpend;

  const saveName = () => { setBizName(nameInput); setEditingName(false); };

  const handlePfpChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const compressed = await compressImage(ev.target.result, 300);
      setBizPfp(compressed); // setBizPfp is saveBizPfp from App which persists to Firestore
    };
    reader.readAsDataURL(file);
  };

  // Returns the Firestore uid of the creator for a given campaign
  // Checks: campaign's stored creatorId first, then searches by name in INFS + extraCreators
  const getCreatorUid = (camp) => {
    if (camp.creatorId) return camp.creatorId;
    const allInfs = [...INFS, ...extraCreators];
    return allInfs.find(inf => inf.name === camp.influencer)?.uid || null;
  };
  // Legacy: returns local array id for userReviews key lookup
  const getInfId = (camp) => {
    if (camp.creatorLocalId) return camp.creatorLocalId;
    if (camp.creatorId) {
      // find by uid in extraCreators
      const found = extraCreators.find(inf => inf.uid === camp.creatorId);
      if (found) return found.id;
    }
    return INFS.find(inf => inf.name === camp.influencer)?.id;
  };
  const alreadyReviewed = (camp) => {
    const uid = getCreatorUid(camp);
    const localId = getInfId(camp);
    // Check by uid (covers Firebase creators) OR by local id (covers INFS)
    if (uid && Object.values(userReviews).some(reviews =>
      reviews.some(r => r.creatorId === uid)
    )) return true;
    return localId && userReviews[localId]?.length > 0;
  };
  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px",
      background: isPro ? "linear-gradient(180deg,rgba(156,106,247,.04) 0%,transparent 300px)" : "transparent"}}>

      {/* Drive link popup from creator */}
      {drivePopup && (
        <div className="mbg" style={{zIndex:2000}} onClick={e=>e.target===e.currentTarget&&setDrivePopup(null)}>
          <div className="mbox" style={{padding:0,overflow:"hidden",maxWidth:360,borderRadius:32,
            border:"1px solid rgba(156,106,247,.4)"}}>
            <div style={{padding:"24px 22px 20px",background:"linear-gradient(180deg,rgba(156,106,247,.1),transparent)",
              textAlign:"center",position:"relative"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,
                background:"linear-gradient(90deg,transparent,rgba(156,106,247,.8),transparent)"}}/>
              <div style={{fontSize:40,marginBottom:12}}>📁</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800,marginBottom:8}}>
                Video Delivered!
              </div>
              <p style={{fontSize:13,color:"var(--txt2)",lineHeight:1.7,marginBottom:16}}>
                <strong style={{color:"var(--txt)"}}>{drivePopup.creatorName}</strong> has sent you the Google Drive link for your Personal Ad video.
              </p>
              <div style={{background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1px solid rgba(156,106,247,.25)",
                borderRadius:16,padding:"12px 14px",marginBottom:16,textAlign:"left"}}>
                <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:.8,marginBottom:6}}>GOOGLE DRIVE LINK</div>
                <a href={drivePopup.link} target="_blank" rel="noopener noreferrer"
                  style={{fontSize:12,color:"#9c6af7",wordBreak:"break-all",lineHeight:1.6,textDecoration:"none"}}>
                  🔗 {drivePopup.link}
                </a>
              </div>
              <div style={{display:"flex",gap:8}}>
                <a href={drivePopup.link} target="_blank" rel="noopener noreferrer"
                  style={{flex:2,padding:"12px",border:"none",borderRadius:18,
                    background:"linear-gradient(135deg,#9c6af7,#7c4af7)",color:"#fff",
                    fontSize:13,fontWeight:700,textDecoration:"none",textAlign:"center",
                    fontFamily:"'Plus Jakarta Sans',sans-serif",
                    boxShadow:"0 4px 16px rgba(156,106,247,.4)"}}>
                  Open in Drive →
                </a>
                <button onClick={()=>setDrivePopup(null)}
                  style={{flex:1,padding:"12px",border:"1.5px solid rgba(0,229,255,.22)",borderRadius:18,
                    background:"none",color:"var(--txt2)",cursor:"pointer",fontSize:13,
                    fontFamily:"'DM Sans',sans-serif"}}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{marginBottom:26,animation:"fadeUp .5s both"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <h1 style={{fontSize:"clamp(20px,4vw,32px)",fontWeight:800}}>
              {isPro ? <span style={{background:"linear-gradient(135deg,#9c6af7,#ffab40)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Pro Dashboard</span>
              : "Business Dashboard"}
            </h1>
            {isPro && (
              <div style={{display:"inline-flex",alignItems:"center",gap:4,
                padding:"4px 10px",borderRadius:50,
                background:"linear-gradient(135deg,rgba(156,106,247,.2),rgba(255,171,64,.1))",
                border:"1px solid rgba(156,106,247,.4)",
                animation:"proGlow 2.5s ease infinite"}}>
                <span style={{fontSize:12}}>⚡</span>
                <span style={{fontSize:10,fontWeight:800,
                  background:"linear-gradient(135deg,#9c6af7,#ffab40)",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                  fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:.5}}>PRO</span>
              </div>
            )}
          </div>
          <button onClick={()=>window.location.reload()}
            style={{background:isPro?"rgba(156,106,247,.1)":"rgba(0,229,255,.08)",
              border:isPro?"1px solid rgba(156,106,247,.25)":"1px solid rgba(0,229,255,.18)",
              borderRadius:50,padding:"5px 12px",
              color:isPro?"#9c6af7":"var(--c)",cursor:"pointer",
              fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5,
              flexShrink:0,transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.8"}
            onMouseLeave={e=>e.currentTarget.style.opacity="1"}>↻ Refresh</button>
        </div>
        <p style={{color:"var(--txt2)",fontSize:14}}>
          {isPro ? "✦ Pro member · 10% discount on all bookings · AI insights unlocked"
          : "Track campaigns, manage bookings, analyse performance"}
        </p>
      </div>

      {/* Business Profile Card */}
      <div style={{
        background: isPro
          ? "linear-gradient(135deg,rgba(156,106,247,.1),rgba(255,171,64,.05))"
          : "linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
        border: isPro ? "1px solid rgba(156,106,247,.35)" : "1px solid var(--b)",
        borderRadius:22,padding:"18px 18px",marginBottom:24,
        animation:"fadeUp .5s .05s both",position:"relative",overflow:"hidden",
        boxShadow: isPro ? "0 4px 32px rgba(156,106,247,.12),0 0 0 1px rgba(156,106,247,.08)" : "none"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,
          background: isPro
            ? "linear-gradient(90deg,transparent,#9c6af7,#ffab40,#9c6af7,transparent)"
            : "linear-gradient(90deg,transparent,var(--c),transparent)",
          opacity:.8}}/>
        {isPro && (
          <div style={{position:"absolute",top:0,right:0,bottom:0,left:0,pointerEvents:"none",
            background:"radial-gradient(ellipse at 90% 0%,rgba(255,171,64,.06) 0%,transparent 60%)"}}>
          </div>
        )}
        <div style={{fontSize:10,color: isPro?"#9c6af7":"var(--txt2)",fontWeight:700,
          letterSpacing:1.2,marginBottom:14}}>
          {isPro ? "✦ PRO BUSINESS PROFILE" : "BUSINESS PROFILE"}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>

          {/* Avatar with Pro badge */}
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:56,height:56,borderRadius:"50%",overflow:"visible",
              border: isPro ? "2px solid rgba(156,106,247,.6)" : "2px solid rgba(0,229,255,.35)",
              background:"linear-gradient(135deg,var(--c),var(--c2))",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow: isPro ? "0 0 24px rgba(156,106,247,.4),0 0 0 4px rgba(156,106,247,.1)" : "0 0 18px rgba(0,229,255,.25)"}}>
              {bizPfp
                ? <img src={bizPfp} alt="pfp" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
                : <span style={{fontSize:18,fontWeight:700,color:"var(--bg)",fontFamily:"system-ui,sans-serif"}}>{initials}</span>
              }
            </div>
            {/* Pro animated badge on avatar */}
            {isPro && (
              <div style={{position:"absolute",bottom:-4,right:-4,
                width:22,height:22,borderRadius:"50%",
                background:"linear-gradient(135deg,#9c6af7,#ffab40)",
                border:"2px solid rgba(10,10,26,.99)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,
                boxShadow:"0 0 12px rgba(156,106,247,.7),0 0 24px rgba(255,171,64,.3)",
                animation:"proBadge 1.8s ease infinite",zIndex:2}}>
                ⚡
              </div>
            )}
            {!isPro && (
              <button onClick={()=>fileInputRef.current.click()}
                style={{position:"absolute",bottom:-2,right:-2,width:20,height:20,borderRadius:"50%",
                  background:"linear-gradient(135deg,var(--c),var(--c2))",
                  border:"2px solid rgba(14,14,34,.99)",display:"flex",alignItems:"center",justifyContent:"center",
                  cursor:"pointer",fontSize:10,color:"var(--bg)",fontWeight:700}}>
                +
              </button>
            )}
            {isPro && (
              <button onClick={()=>fileInputRef.current.click()}
                style={{position:"absolute",top:-2,left:-2,width:18,height:18,borderRadius:"50%",
                  background:"rgba(156,106,247,.2)",border:"1px solid rgba(156,106,247,.4)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  cursor:"pointer",fontSize:9,color:"#9c6af7"}}>
                ✎
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*"
              onClick={e=>e.target.value=""}
              onChange={handlePfpChange}
              style={{display:"none"}}/>
          </div>

          <div style={{flex:1,minWidth:0}}>
            {editingName ? (
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input value={nameInput} onChange={e=>setNameInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter")saveName();if(e.key==="Escape")setEditingName(false);}}
                  autoFocus placeholder="Enter your business name..."
                  style={{flex:1,background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1px solid var(--c)",borderRadius:13,
                    padding:"8px 12px",color:"var(--txt)",fontSize:14,outline:"none",
                    fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700}}/>
                <button onClick={saveName} className="btnp" style={{padding:"8px 14px",fontSize:12,borderRadius:13,flexShrink:0}}>Save</button>
                <button onClick={()=>setEditingName(false)} style={{background:"none",border:"1.5px solid rgba(255,255,255,.07)",
                  borderRadius:13,padding:"8px 10px",color:"var(--txt2)",cursor:"pointer",fontSize:13,flexShrink:0}}>✕</button>
              </div>
            ) : (
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <div>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,lineHeight:1.2}}>{bizName}</div>
                  <div style={{fontSize:11,color:"var(--txt2)",marginTop:3}}>Business Account · Collancer</div>
                </div>
                <button onClick={()=>{setNameInput(rawBizName||"");setEditingName(true);}}
                  style={{background:"rgba(0,229,255,.08)",border:"1.5px solid rgba(0,229,255,.22)",
                    borderRadius:12,padding:"5px 10px",color:"var(--c)",cursor:"pointer",
                    fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
                    transition:"all .2s",flexShrink:0}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,.18)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(0,229,255,.08)"}>
                  ✎ Edit
                </button>
              </div>
            )}
          </div>
        </div>
        {!rawBizName && !editingName && (
          <div style={{marginTop:12,padding:"8px 12px",background:"rgba(255,171,64,.06)",
            border:"1.5px solid rgba(255,171,64,.22)",borderRadius:13,fontSize:12,color:"var(--amb)",
            display:"flex",alignItems:"center",gap:7}}>
            <span>💡</span> Set your business name — it will appear on all your reviews.
          </div>
        )}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:34,animation:"fadeUp .5s .1s both"}}>
        <StatBox label="ACTIVE CAMPAIGNS" value={String(activeCamps)} sub={`${pendingCamps} pending`}/>
        <StatBox label="TOTAL SPEND" value={spendLabel} sub="this quarter" color="var(--grn)"/>
        <StatBox label="AVG REACH" value="840K" sub="per campaign" color="var(--pur)"/>
        <StatBox label="COMPLETED" value={String(completedCamps)} sub="campaigns" color="var(--amb)"/>
      </div>

      {reviewCamp && <WriteReviewModal camp={reviewCamp} bizName={bizName} initials={initials} bizPfp={bizPfp} onClose={()=>setReviewCamp(null)}
        onSubmit={(rev)=>{
          const uid = getCreatorUid(reviewCamp);
          const localId = getInfId(reviewCamp);
          // Pass both uid (for Firebase save) and localId (for local state key)
          onAddReview(localId, rev, uid);
        }}/>}

      <div style={{marginBottom:34,animation:"fadeUp .5s .2s both"}}>
        {/* Header row */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800}}>My Campaigns</h2>
          {campaigns.length > 0 && (
            <span style={{fontSize:11,color:"var(--txt2)",fontWeight:500}}>
              {campaigns.length} campaign{campaigns.length!==1?"s":""}
            </span>
          )}
        </div>

        {/* Scrollable box — shows 5, scroll for more */}
        <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:22,overflow:"hidden"}}>
          {campaigns.length===0 ? (
            <div style={{padding:"32px 16px",textAlign:"center",color:"var(--txt2)",fontSize:13}}>
              No campaigns yet. Book a creator to get started!
            </div>
          ) : (
            <>
              {/* Scrollable inner container — ~5 rows visible */}
              <div style={{maxHeight:360,overflowY:"auto"}} className="nosb">
                {campaigns.map((c,i)=>{
                  // Format date/time from createdAt timestamp or fallback to start field
                  const dt = c.createdAt?.seconds
                    ? new Date(c.createdAt.seconds*1000)
                    : c.start ? new Date() : null;
                  const dateStr = dt
                    ? dt.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})
                    : c.start || "—";
                  const timeStr = dt
                    ? dt.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true})
                    : "";
                  return (
                    <div key={c.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",
                      borderBottom:i<campaigns.length-1?"1px solid var(--b)":"none",
                      transition:"background .2s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,.025)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      {/* Avatar */}
                      <div style={{width:38,height:38,borderRadius:"50%",flexShrink:0,
                        background:"linear-gradient(135deg,#00E5FF,#00bcd4)",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,color:"#070710",
                        marginTop:2}}>
                        {c.influencer.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                      </div>

                      <div style={{flex:1,minWidth:0}}>
                        {/* Row 1: name + status */}
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                          <div style={{fontWeight:700,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",
                            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}}>
                            {c.influencer}
                          </div>
                          <span className="badge" style={{background:`${sc[c.status]}18`,color:sc[c.status],
                            border:`1px solid ${sc[c.status]}33`,fontSize:10,flexShrink:0,marginLeft:8}}>
                            {c.status}
                          </span>
                        </div>
                        {/* Row 2: handle + platform */}
                        <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>
                          {c.handle} · {c.platform}
                          {c.promoLabel && <span style={{color:"var(--txt3)"}}> · {c.promoLabel}</span>}
                        </div>
                        {/* Row 3: date/time + budget */}
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{fontSize:10,color:"var(--txt2)"}}>📅</span>
                            <span style={{fontSize:10,color:"var(--txt2)"}}>{dateStr}</span>
                            {timeStr && <span style={{fontSize:10,color:"var(--txt3)"}}>· {timeStr}</span>}
                          </div>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:700,color:"var(--c)",flexShrink:0}}>
                            {inr(c.budget)}
                          </div>
                        </div>
                        {/* Rejection reason */}
                        {c.status==="Cancelled" && c.rejectionReason && (
                          <div style={{marginTop:5,fontSize:10,padding:"3px 9px",borderRadius:10,display:"inline-block",
                            background:"rgba(248,113,113,.1)",color:"var(--red)",
                            border:"1px solid rgba(248,113,113,.2)",fontFamily:"'DM Sans',sans-serif",fontWeight:600,
                            maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}
                            title={c.rejectionReason}>
                            ❌ {c.rejectionReason}
                          </div>
                        )}
                        {/* Review button */}
                        {c.status==="Completed" && (
                          <>
                            {/* Video link for completed promotions (story/reel/yt) */}
                            {(c.videoLink || c.promotedVideoLink) && !c.driveLink && (
                              <a href={c.videoLink||c.promotedVideoLink} target="_blank" rel="noopener noreferrer"
                                style={{marginTop:5,display:"inline-flex",alignItems:"center",gap:5,
                                  fontSize:10,padding:"4px 10px",borderRadius:50,
                                  background:"linear-gradient(145deg,rgba(0,229,255,.14),rgba(0,188,212,.07))",color:"var(--c)",
                                  border:"1px solid rgba(0,229,255,.3)",
                                  fontFamily:"'DM Sans',sans-serif",fontWeight:600,
                                  textDecoration:"none",transition:"all .2s",marginRight:6}}
                                onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,.2)"}
                                onMouseLeave={e=>e.currentTarget.style.background="rgba(0,229,255,.1)"}>
                                🎬 View Promoted Content
                              </a>
                            )}
                            {/* Drive link for personal ad campaigns */}
                            {c.driveLink && (
                              <a href={c.driveLink} target="_blank" rel="noopener noreferrer"
                                style={{marginTop:5,display:"inline-flex",alignItems:"center",gap:5,
                                  fontSize:10,padding:"4px 10px",borderRadius:50,
                                  background:"rgba(156,106,247,.1)",color:"#9c6af7",
                                  border:"1px solid rgba(156,106,247,.3)",
                                  fontFamily:"'DM Sans',sans-serif",fontWeight:600,
                                  textDecoration:"none",transition:"all .2s",marginRight:6}}
                                onMouseEnter={e=>e.currentTarget.style.background="rgba(156,106,247,.2)"}
                                onMouseLeave={e=>e.currentTarget.style.background="rgba(156,106,247,.1)"}>
                                📁 View Personal Ad Video
                              </a>
                            )}
                            {alreadyReviewed(c) ? (
                              <span style={{marginTop:5,display:"inline-block",fontSize:10,padding:"3px 9px",borderRadius:10,
                                background:"linear-gradient(145deg,rgba(0,230,118,.18),rgba(0,200,80,.08))",color:"var(--grn)",
                                border:"1px solid rgba(0,230,118,.25)",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>
                                ✓ Reviewed
                              </span>
                            ) : (
                              <button onClick={()=>setReviewCamp(c)}
                                style={{marginTop:5,fontSize:10,padding:"4px 10px",borderRadius:50,
                                  background:"rgba(0,229,255,.08)",color:"var(--c)",
                                  border:"1.5px solid rgba(0,229,255,.28)",cursor:"pointer",
                                  fontFamily:"'DM Sans',sans-serif",fontWeight:600,transition:"all .2s"}}
                                onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,229,255,.18)";e.currentTarget.style.borderColor="var(--c)"}}
                                onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,229,255,.08)";e.currentTarget.style.borderColor="rgba(0,229,255,.25)"}}>
                                ★ Review
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Scroll hint — only if more than 5 */}
              {campaigns.length > 5 && (
                <div style={{padding:"8px 16px",borderTop:"1px solid var(--b)",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                  background:"rgba(0,229,255,.02)"}}>
                  <span style={{fontSize:10,color:"var(--txt2)"}}>
                    Scroll inside to see all {campaigns.length} campaigns ↕
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Logout button */}
      <div style={{padding:"0 0 8px",animation:"fadeUp .5s .3s both"}}>
        <button onClick={()=>setShowLogoutConfirm(true)} style={{
          width:"100%",padding:"13px",border:"1px solid rgba(248,113,113,.3)",
          borderRadius:50,background:"rgba(248,113,113,.06)",color:"var(--red)",
          fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
          transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(248,113,113,.14)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(248,113,113,.06)"}>
          ⎋ Sign Out
        </button>

        {/* Legal links */}
        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:20,paddingTop:16,borderTop:"1px solid var(--b)"}}>
          {[["🔐 Privacy Policy", onPrivacy], ["📋 Terms of Service", onTerms]].map(([label, fn]) => (
            <button key={label} onClick={fn} style={{background:"none",border:"none",color:"var(--txt2)",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"color .2s",padding:0}}
              onMouseEnter={e=>e.currentTarget.style.color="var(--c)"}
              onMouseLeave={e=>e.currentTarget.style.color="var(--txt2)"}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {showLogoutConfirm && <LogoutConfirmModal onConfirm={()=>{setShowLogoutConfirm(false);onLogout&&onLogout();}} onCancel={()=>setShowLogoutConfirm(false)}/>}
    </div>
  );
}
function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  // Generate a stable referral code based on the business user
  const refCode = "BIZ-COLLANCER-2026";
  const refLink = `https://collancer.in/join?ref=${refCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(refLink).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false), 2500);
  };

  const sendInvite = () => {
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
    setTimeout(()=>setSent(false), 3000);
  };

  const referrals = [
    {biz:"Zara India",status:"Booked",booking:"₹85,000",earned:"₹4,250",date:"Mar 10"},
    {biz:"boAt Lifestyle",status:"Pending",booking:"—",earned:"Pending",date:"Mar 12"},
    {biz:"Mamaearth",status:"Completed",booking:"₹72,000",earned:"₹3,600",date:"Feb 28"},
  ];

  const totalEarned = 4250 + 3600;

  return (
    <div style={{maxWidth:430,width:"100%",margin:"0 auto",padding:"16px 16px 24px",overflowX:"hidden",boxSizing:"border-box"}}>
      <div style={{marginBottom:28,animation:"fadeUp .5s both"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <h1 style={{fontSize:22,fontWeight:800}}>Referral Programme</h1>
          <button onClick={()=>window.location.reload()}
            style={{background:"rgba(0,229,255,.08)",border:"1px solid rgba(0,229,255,.18)",
              borderRadius:50,padding:"5px 12px",color:"var(--c)",cursor:"pointer",
              fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5,
              flexShrink:0,transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,.18)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,229,255,.08)"}>↻ Refresh</button>
        </div>
        <p style={{color:"var(--txt2)",fontSize:14}}>Invite other businesses — earn 5% of every booking they make</p>
      </div>

      {/* How it works */}
      <div style={{
        background:"linear-gradient(135deg,rgba(0,229,255,.06),rgba(124,106,247,.04))",
        border:"1px solid rgba(0,229,255,.14)",borderRadius:26,
        padding:"18px",marginBottom:22,animation:"fadeUp .5s .08s both"}}>
        <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,marginBottom:18}}>How It Works</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
          {[
            {n:"1",icon:"🔗",title:"Share Your Link",desc:"Send your unique referral link to other businesses"},
            {n:"2",icon:"📲",title:"They Sign Up",desc:"The business joins Collancer using your link"},
            {n:"3",icon:"✅",title:"They Book & Pay",desc:"They book a creator and the promotion is completed"},
            {n:"4",icon:"💰",title:"You Earn 5%",desc:"You receive 5% of the booking amount automatically"},
          ].map(s=>(
            <div key={s.n} style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:18,padding:16,position:"relative"}}>
              <div style={{position:"absolute",top:12,right:12,fontFamily:"'DM Mono',monospace",
                fontSize:11,fontWeight:700,color:"var(--c)",opacity:.4}}>0{s.n}</div>
              <div style={{fontSize:24,marginBottom:10}}>{s.icon}</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,marginBottom:5}}>{s.title}</div>
              <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.6}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Your referral link */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:24,
        padding:"16px",marginBottom:18,animation:"fadeUp .5s .16s both"}}>
        <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:700,marginBottom:14}}>Your Referral Link</h3>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:200,background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(0,229,255,.22)",
            borderRadius:11,padding:"11px 14px",fontFamily:"'DM Mono',monospace",
            fontSize:13,color:"var(--c)",wordBreak:"break-all"}}>
            {refLink}
          </div>
          <button onClick={copyLink} className="btnp" style={{flexShrink:0,gap:7,
            background:copied?"linear-gradient(135deg,var(--grn),#009944)":"linear-gradient(135deg,var(--c),var(--c2))"}}>
            {copied ? "✓ Copied!" : "📋 Copy Link"}
          </button>
        </div>
        <div style={{marginTop:12,padding:"12px 14px",
          background:"rgba(0,230,118,.05)",border:"1px solid rgba(0,230,118,.18)",
          borderRadius:10}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8}}>
            <span style={{fontSize:16,flexShrink:0}}>💡</span>
            <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.7}}>
              Your referral code is{" "}
              <strong style={{color:"var(--c)",fontFamily:"'DM Mono',monospace",wordBreak:"break-all"}}>{refCode}</strong>
            </div>
          </div>
          <div style={{display:"flex",gap:16,paddingLeft:24}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:800,color:"var(--grn)"}}>5%</div>
              <div style={{fontSize:9,color:"var(--txt2)"}}>Commission</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:800,color:"var(--c)"}}>Monthly</div>
              <div style={{fontSize:9,color:"var(--txt2)"}}>Payout</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:800,color:"var(--amb)"}}>∞</div>
              <div style={{fontSize:9,color:"var(--txt2)"}}>No Cap</div>
            </div>
          </div>
        </div>
      </div>

      {/* Send invite by email */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:24,
        padding:"16px",marginBottom:18,animation:"fadeUp .5s .22s both"}}>
        <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:700,marginBottom:13}}>Invite by Email</h3>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <input value={email} onChange={e=>setEmail(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&sendInvite()}
            placeholder="Enter business email address..."
            style={{flex:1,minWidth:200,background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(0,229,255,.22)",
              borderRadius:11,padding:"11px 14px",color:"var(--txt)",fontSize:13,outline:"none"}}/>
          <button onClick={sendInvite} className="btnp" style={{flexShrink:0,
            background:sent?"linear-gradient(135deg,var(--grn),#009944)":"linear-gradient(135deg,var(--c),var(--c2))"}}>
            {sent ? "✓ Sent!" : "Send Invite ✉"}
          </button>
        </div>
      </div>

      {/* Earnings summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:20,animation:"fadeUp .5s .28s both"}}>
        <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:18,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,var(--grn),transparent)",opacity:.7}}/>
          <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:8}}>TOTAL EARNED</div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:"var(--grn)"}}>{`₹${totalEarned.toLocaleString("en-IN")}`}</div>
          <div style={{fontSize:11,color:"var(--txt2)",marginTop:5}}>lifetime earnings</div>
        </div>
        <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:18,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,var(--c),transparent)",opacity:.7}}/>
          <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:8}}>REFERRALS</div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:"var(--c)"}}>{referrals.length}</div>
          <div style={{fontSize:11,color:"var(--txt2)",marginTop:5}}>businesses invited</div>
        </div>
        <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:18,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,var(--amb),transparent)",opacity:.7}}/>
          <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:8}}>COMMISSION RATE</div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:"var(--amb)"}}>5%</div>
          <div style={{fontSize:11,color:"var(--txt2)",marginTop:5}}>of each booking</div>
        </div>
      </div>

      {/* Payout section */}
      <div style={{animation:"fadeUp .5s .4s both",marginTop:20}}>
        <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800,marginBottom:14}}>Request Payout</h3>
        <ReferralPayoutSection totalEarned={totalEarned}/>
      </div>
    </div>
  );
}

function ReferralPayoutSection({ totalEarned }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({method:"UPI",upi:"",bank:"",ifsc:"",account:""});
  const [submitted, setSubmitted] = useState(false);

  const inp = {background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:14,
    padding:"11px 13px",color:"var(--txt)",fontSize:13,outline:"none",
    fontFamily:"'DM Sans',sans-serif",width:"100%",marginBottom:10};

  const submit = () => {
    setSubmitted(true);
    setShowModal(false);
    setTimeout(()=>setSubmitted(false),4000);
  };

  return (
    <>
      {submitted && (
        <div style={{background:"linear-gradient(145deg,rgba(0,230,118,.15),rgba(0,200,80,.06))",border:"1px solid rgba(0,230,118,.3)",
          borderRadius:16,padding:"12px 14px",marginBottom:14,
          display:"flex",alignItems:"center",gap:10,animation:"fadeUp .4s both"}}>
          <span style={{fontSize:18}}>✅</span>
          <div style={{fontSize:13,fontWeight:700,color:"var(--grn)"}}>Payout request submitted! Processed within 3–5 business days.</div>
        </div>
      )}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:22,padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:4}}>Available to withdraw</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:"var(--grn)"}}>₹{totalEarned.toLocaleString("en-IN")}</div>
          </div>
          <button onClick={()=>setShowModal(true)} disabled={totalEarned<=0}
            className="btnp" style={{opacity:totalEarned<=0?0.4:1,
              background:"linear-gradient(135deg,#00e676,#00c853)",padding:"10px 18px",fontSize:13}}>
            Withdraw
          </button>
        </div>
        <div style={{fontSize:11,color:"var(--txt2)"}}>Monthly payouts · UPI or Bank Transfer · Min ₹500</div>
      </div>

      {showModal && (
        <div className="mbg" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="mbox" style={{padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800}}>Request Payout</div>
              <button onClick={()=>setShowModal(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--txt2)"}}>✕</button>
            </div>
            <div style={{background:"rgba(0,230,118,.08)",border:"1px solid rgba(0,230,118,.2)",
              borderRadius:16,padding:"12px 14px",marginBottom:14}}>
              <div style={{fontSize:11,color:"var(--txt2)",marginBottom:4}}>Withdrawal amount</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:"var(--grn)"}}>₹{totalEarned.toLocaleString("en-IN")}</div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {["UPI","Bank Transfer"].map(m=>(
                <button key={m} onClick={()=>setForm(f=>({...f,method:m}))} style={{
                  flex:1,padding:"9px",borderRadius:14,cursor:"pointer",fontSize:12,fontWeight:700,
                  border:form.method===m?"2px solid var(--c)":"1px solid var(--b)",
                  background:form.method===m?"rgba(0,229,255,.1)":"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
                  color:form.method===m?"var(--c)":"var(--txt2)"}}>
                  {m==="UPI"?"📱 UPI":"🏦 Bank"}
                </button>
              ))}
            </div>
            {form.method==="UPI" ? (
              <input value={form.upi} onChange={e=>setForm(f=>({...f,upi:e.target.value}))}
                placeholder="Your UPI ID" style={inp}/>
            ) : (
              <>
                <input value={form.bank} onChange={e=>setForm(f=>({...f,bank:e.target.value}))} placeholder="Bank Name" style={inp}/>
                <input value={form.account} onChange={e=>setForm(f=>({...f,account:e.target.value}))} placeholder="Account Number" style={inp}/>
                <input value={form.ifsc} onChange={e=>setForm(f=>({...f,ifsc:e.target.value}))} placeholder="IFSC Code" style={inp}/>
              </>
            )}
            <button onClick={submit}
              disabled={form.method==="UPI"?!form.upi:(!form.account||!form.ifsc)}
              className="btnp" style={{width:"100%",justifyContent:"center",
                background:"linear-gradient(135deg,#00e676,#00c853)",
                opacity:(form.method==="UPI"?!form.upi:(!form.account||!form.ifsc))?0.4:1}}>
              Submit Request
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Footer ─────────────────────────────────────────────
function Footer() { return null; }

// ── Wallet Page ───────────────────────────────────────
function WalletPage({ authUser, bizData, walletBalance=0, onBalanceUpdate }) {
  const [amount, setAmount]     = useState("");
  const [method, setMethod]     = useState("UPI");
  const [upiId,  setUpiId]      = useState("");
  const [processing, setProc]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [txHistory, setTxHistory] = useState([]);

  useEffect(() => {
    if (!authUser?.uid || !window.__cfs) return;
    const { collection, query, where, onSnapshot } = window.__cfs;
    const q = query(collection(window.__cdb,"walletTransactions"), where("bizId","==",authUser.uid));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d=>({id:d.id,...d.data()}));
      data.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
      setTxHistory(data);
    });
    return ()=>unsub();
  }, [authUser?.uid]);

  const deposit = async () => {
    const amt = parseInt(amount);
    if (!amt || amt < 100) { alert("Minimum deposit is ₹100"); return; }
    setProc(true);
    await new Promise(r=>setTimeout(r,1600)); // simulated payment
    try {
      const { doc, updateDoc, addDoc, collection, serverTimestamp } = window.__cfs;
      const newBalance = (walletBalance || 0) + amt;
      await updateDoc(doc(window.__cdb,"businesses",authUser.uid), { walletBalance: newBalance });
      await addDoc(collection(window.__cdb,"walletTransactions"), {
        bizId: authUser.uid,
        type: "deposit",
        amount: amt,
        method,
        upiId: method==="UPI" ? upiId : "",
        balanceAfter: newBalance,
        createdAt: serverTimestamp(),
      });
      onBalanceUpdate(newBalance);
      setSuccess(true);
      setAmount("");
      setUpiId("");
      setTimeout(()=>setSuccess(false),4000);
    } catch(e){ console.error(e); }
    setProc(false);
  };

  const inp = {background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:16,
    padding:"11px 14px",color:"var(--txt)",fontSize:13,outline:"none",
    fontFamily:"'DM Sans',sans-serif",width:"100%",marginBottom:10};

  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px"}}>
      <div style={{marginBottom:20,animation:"fadeUp .5s both"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <h1 style={{fontSize:22,fontWeight:800}}>Wallet</h1>
          <button onClick={()=>window.location.reload()}
            style={{background:"rgba(0,229,255,.08)",border:"1px solid rgba(0,229,255,.18)",
              borderRadius:50,padding:"5px 12px",color:"var(--c)",cursor:"pointer",
              fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5,
              flexShrink:0,transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,.18)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,229,255,.08)"}>↻ Refresh</button>
        </div>
        <p style={{fontSize:13,color:"var(--txt2)"}}>Deposit funds and use them directly for bookings</p>
      </div>

      {/* Balance card */}
      <div style={{background:"linear-gradient(135deg,rgba(0,229,255,.14),rgba(124,106,247,.08))",
        border:"1px solid rgba(0,229,255,.35)",borderRadius:24,padding:"22px 20px",
        marginBottom:20,animation:"fadeUp .5s .04s both",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,
          background:"linear-gradient(90deg,transparent,var(--c),transparent)"}}/>
        <div style={{fontSize:11,color:"var(--c)",fontWeight:700,letterSpacing:1.2,marginBottom:8}}>💳 WALLET BALANCE</div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:36,fontWeight:800,color:"var(--c)",marginBottom:4}}>
          {inr(walletBalance)}
        </div>
        <div style={{fontSize:12,color:"var(--txt2)"}}>Available for instant bookings</div>
      </div>

      {success && (
        <div style={{background:"linear-gradient(135deg,rgba(0,230,118,.12),rgba(0,230,118,.06))",
          border:"1px solid rgba(0,230,118,.3)",borderRadius:18,padding:"12px 16px",marginBottom:16,
          display:"flex",alignItems:"center",gap:10,animation:"fadeUp .4s both"}}>
          <span style={{fontSize:20}}>✅</span>
          <div style={{fontSize:13,fontWeight:700,color:"var(--grn)"}}>Deposit successful! Wallet updated.</div>
        </div>
      )}

      {/* Deposit form */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:22,padding:18,
        marginBottom:20,animation:"fadeUp .5s .08s both"}}>
        <div style={{fontSize:13,fontWeight:800,marginBottom:14}}>Add Money to Wallet</div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:"var(--txt2)",marginBottom:6,fontWeight:700,letterSpacing:.6}}>AMOUNT (₹)</div>
          <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" min="100"
            placeholder="e.g. 5000" style={inp}/>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[500,1000,2000,5000,10000].map(q=>(
              <button key={q} onClick={()=>setAmount(String(q))} style={{
                padding:"6px 13px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:700,
                border:amount===String(q)?"2px solid var(--c)":"1px solid var(--b)",
                background:amount===String(q)?"rgba(0,229,255,.1)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                color:amount===String(q)?"var(--c)":"var(--txt2)",transition:"all .15s"}}>
                +₹{q.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,color:"var(--txt2)",marginBottom:8,fontWeight:700,letterSpacing:.6}}>PAYMENT METHOD</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {["UPI","Card","Net Banking"].map(m=>(
              <button key={m} onClick={()=>setMethod(m)} style={{
                flex:1,padding:"8px 4px",borderRadius:14,cursor:"pointer",fontSize:11,fontWeight:700,
                border:method===m?"2px solid var(--c)":"1px solid var(--b)",
                background:method===m?"rgba(0,229,255,.1)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                color:method===m?"var(--c)":"var(--txt2)"}}>
                {m==="UPI"?"📱":m==="Card"?"💳":"🏦"} {m}
              </button>
            ))}
          </div>
          {method==="UPI" && (
            <input value={upiId} onChange={e=>setUpiId(e.target.value)}
              placeholder="yourname@upi" style={{...inp,marginBottom:0}}/>
          )}
        </div>
        <button onClick={deposit} disabled={processing||!amount} className="btnp"
          style={{width:"100%",justifyContent:"center",opacity:processing||!amount?0.5:1}}>
          {processing ? <span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>
            : `Add ${amount?inr(parseInt(amount)||0):"Money"} to Wallet`}
        </button>
        <div style={{fontSize:10,color:"var(--txt2)",textAlign:"center",marginTop:8}}>
          🔒 Secure · All major UPI, cards, and net banking supported
        </div>
      </div>

      {/* Transaction history */}
      <div style={{animation:"fadeUp .5s .12s both"}}>
        <h3 style={{fontSize:14,fontWeight:700,marginBottom:12,color:"var(--txt2)",letterSpacing:.5}}>TRANSACTION HISTORY</h3>
        {txHistory.length===0 ? (
          <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:18,
            padding:"32px 16px",textAlign:"center",color:"var(--txt2)"}}>
            <div style={{fontSize:32,marginBottom:8,opacity:.3}}>💳</div>
            <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>No transactions yet</div>
            <div style={{fontSize:11}}>Your wallet activity will appear here</div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {txHistory.map((tx,i)=>(
              <div key={tx.id||i} style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",
                borderRadius:16,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:38,height:38,borderRadius:11,flexShrink:0,
                  background:tx.type==="deposit"?"rgba(0,230,118,.12)":"rgba(248,113,113,.1)",
                  border:`1px solid ${tx.type==="deposit"?"rgba(0,230,118,.25)":"rgba(248,113,113,.2)"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
                  {tx.type==="deposit"?"⬆️":"⬇️"}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>
                    {tx.type==="deposit"?"Money Added":tx.type==="booking_deduction"?"Booking Payment":"Refund"}
                  </div>
                  <div style={{fontSize:10,color:"var(--txt2)"}}>
                    {tx.createdAt?.seconds && new Date(tx.createdAt.seconds*1000).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                    {tx.method && ` · ${tx.method}`}
                  </div>
                </div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:800,flexShrink:0,
                  color:tx.type==="deposit"||tx.type==="refund"?"var(--grn)":"var(--red)"}}>
                  {tx.type==="deposit"||tx.type==="refund"?"+":"-"}{inr(tx.amount||0)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── App Root ───────────────────────────────────────────
// ── Ask Cleo (VoiceBot) ────────────────────────────────
function VoiceBot({ onSelect, extraCreators=[], onProClick, isPro=false }) {
  const [open,          setOpen]         = useState(false);
  const [input,         setInput]        = useState("");
  const [loading,       setLoading]      = useState(false);
  const [displayed,     setDisplayed]    = useState("");
  const [response,      setResponse]     = useState("");
  const [mentionedInfs, setMentionedInfs]= useState([]);
  const [chatHistory,   setChatHistory]  = useState([]);
  const [suggestions,   setSuggestions]  = useState(true);
  const inputRef  = useRef(null);
  const chatContainerRef = useRef(null);

  const ALL_INFS = [...INFS, ...extraCreators];

  useEffect(() => {
    const el = chatContainerRef.current; if (el) el.scrollTop = el.scrollHeight;
  }, [chatHistory, loading]);

  useEffect(() => {
    if (!response) { setDisplayed(""); setMentionedInfs([]); return; }
    setDisplayed("");
    const found = ALL_INFS.filter(inf =>
      response.toLowerCase().includes((inf.name||"").toLowerCase()) ||
      response.toLowerCase().includes((inf.handle||"").toLowerCase())
    );
    setMentionedInfs(found);
    let i = 0;
    const speed = Math.max(8, Math.min(22, 2400/response.length));
    const iv = setInterval(() => {
      i++;
      setDisplayed(response.slice(0,i));
      if (i >= response.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [response]);

  const getCleoResponse = (q) => {
    const ql = q.toLowerCase().trim();

    // ── Budget detection ──
    const budgetMatch = ql.match(/(?:budget|under|below|within|upto|up to|less than|max)[^\d]*(\d[\d,]*)/i)
                     || ql.match(/₹\s*(\d[\d,]*)/) || ql.match(/(\d[\d,]*)\s*(?:rupees|rs|inr)/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g,"")) : null;

    // ── Niche detection ──
    const NICHES = {
      fashion:["fashion","clothing","style","outfit","ootd","apparel","wear","dress"],
      beauty:["beauty","skincare","makeup","cosmetic","glow","skin","haircare"],
      food:["food","restaurant","cuisine","recipe","chef","cooking","beverage","drink","cafe"],
      fitness:["fitness","gym","workout","health","yoga","protein","supplement","sports"],
      tech:["tech","gadget","phone","laptop","electronics","unboxing","startup","app"],
      gaming:["gaming","game","esports","bgmi","mobile game","streamer","console"],
      travel:["travel","tourism","destination","trip","hotel","resort","holiday"],
      finance:["finance","invest","stock","mutual fund","fintech","money","wealth","trading"],
      lifestyle:["lifestyle","vlog","daily life","wellness","motivation","productivity"],
      music:["music","song","singer","artist","band","entertainment","dance"],
      education:["education","study","learn","edtech","course","skill","tutor"],
      kids:["kids","parenting","baby","children","toy","mother","family"],
      automobile:["car","bike","automobile","vehicle","motor","drive","auto"],
      wedding:["wedding","bridal","bride","groom","event","ceremony"],
      sustainable:["organic","sustainable","eco","green","environment","natural"],
      jewellery:["jewellery","jewelry","gold","diamond","accessory","watch"],
      crypto:["crypto","bitcoin","web3","nft","blockchain"],
      pets:["pet","dog","cat","animal","puppy"],
    };
    const detectedNiche = Object.entries(NICHES).find(([,kws])=>kws.some(kw=>ql.includes(kw)))?.[0];

    // ── Smart multi-criteria recommendation ──
    if (budget || detectedNiche) {
      let candidates = [...ALL_INFS];
      if (budget)        candidates = candidates.filter(i=>i.price<=budget);
      if (detectedNiche) {
        const byNiche = candidates.filter(i=>
          i.niche.toLowerCase().includes(detectedNiche) ||
          (i.categories||[]).includes(detectedNiche)
        );
        if (byNiche.length) candidates = byNiche;
      }
      if (!candidates.length) candidates = budget ? [...ALL_INFS].filter(i=>i.price<=budget) : ALL_INFS.filter(i=>i.niche.toLowerCase().includes(detectedNiche||""));
      if (candidates.length) {
        const scored = candidates
          .map(i=>({...i,score:((i.followers||1)*(i.rating||4)*(i.avgViews||1000))/(i.price||1)}))
          .sort((a,b)=>b.score-a.score).slice(0,3);
        const t = scored[0];
        return `Top picks${detectedNiche?" for "+detectedNiche:""}${budget?" under ₹"+budget.toLocaleString("en-IN"):""}: ${scored.map((i,n)=>`${n+1}. ${i.name} (${fmtKPlus(i.followers)} ${i.platform==="YouTube"?"subs":"followers"}, ₹${i.price.toLocaleString("en-IN")}, ${i.rating}★ — ${i.niche}, ${i.city})`).join(" | ")}. Best pick: ${t.name} — ${fmtK(t.avgViews||0)} avg views, ${t.engagement||0}% engagement, ${t.rating}★. Reviews: ${t.reviews?.[0]?.user||"top Indian brands"} praised them.`;
      }
    }

    // ── Specific creator ──
    const m = ALL_INFS.find(inf=>ql.includes(inf.name.toLowerCase())||ql.includes((inf.handle||"").toLowerCase().replace("@","")));
    if (m) {
      const promos = [];
      if (m.prices?.story)      promos.push(`Story ₹${m.prices.story.toLocaleString("en-IN")}`);
      if (m.prices?.reel)       promos.push(`Reel ₹${m.prices.reel.toLocaleString("en-IN")}`);
      if (m.prices?.video)      promos.push(`YT Video ₹${m.prices.video.toLocaleString("en-IN")}`);
      if (m.prices?.personalad) promos.push(`Personal Ad ₹${m.prices.personalad.toLocaleString("en-IN")}`);
      return `${m.name} (${m.handle}) — ${m.platform}, ${m.niche}, ${m.city}. ${m.platform==="Both"?`${fmtKPlus(m.followers)} Instagram + ${fmtKPlus(m.ytSubscribers||0)} YouTube subs`:fmtKPlus(m.followers)+" "+(m.platform==="YouTube"?"subscribers":"followers")}. Rating: ${m.rating}★, Avg views: ${fmtK(m.avgViews||0)}. Pricing: ${promos.length?promos.join(", "):"₹"+m.price.toLocaleString("en-IN")+" base"}. ${m.bio||""} ${m.reviews?.length?`Reviews: ${m.reviews.map(r=>`${r.user} "${r.text.slice(0,40)}" (${r.stars}★)`).join("; ")}`:""}.`;
    }

    // ── Comparisons ──
    if (ql.includes(" vs ")||ql.includes("compar")||ql.includes("better between")) {
      const pair = ALL_INFS.filter(i=>ql.includes(i.name.toLowerCase())).slice(0,2);
      if (pair.length===2) {
        const [a,b] = pair;
        const win = (a.rating>=b.rating&&(a.avgViews||0)>=(b.avgViews||0))||a.followers>b.followers ? a : b;
        return `${a.name} vs ${b.name}: ${a.name} — ${fmtKPlus(a.followers)} ${a.platform==="YouTube"?"subs":"followers"}, ${a.rating}★, ${fmtK(a.avgViews||0)} avg views, ₹${a.price.toLocaleString("en-IN")} base. ${b.name} — ${fmtKPlus(b.followers)} ${b.platform==="YouTube"?"subs":"followers"}, ${b.rating}★, ${fmtK(b.avgViews||0)} avg views, ₹${b.price.toLocaleString("en-IN")} base. Recommendation: ${win.name} has a better engagement-to-cost ratio for most campaigns.`;
      }
    }

    // ── Top lists ──
    if (ql.includes("most follow")||ql.includes("most subscrib")||ql.includes("biggest")||ql.includes("largest")) {
      const t3=[...ALL_INFS].sort((a,b)=>b.followers-a.followers).slice(0,3);
      return `Top 3 by followers: ${t3.map((i,n)=>`${n+1}. ${i.name} — ${fmtKPlus(i.followers)} ${i.platform==="YouTube"?"subscribers":"followers"} (${i.niche}, ${i.city})`).join(" | ")}.`;
    }
    if (ql.includes("cheapest")||ql.includes("most affordable")||ql.includes("lowest price")||ql.includes("cheap")) {
      const t4=[...ALL_INFS].sort((a,b)=>a.price-b.price).slice(0,4);
      return `Most affordable: ${t4.map((i,n)=>`${n+1}. ${i.name} — ₹${i.price.toLocaleString("en-IN")} (${i.niche}, ${i.rating}★)`).join(" | ")}.`;
    }
    if (ql.includes("most expensive")||ql.includes("premium")||ql.includes("highest price")||ql.includes("top tier")) {
      const t3=[...ALL_INFS].sort((a,b)=>b.price-a.price).slice(0,3);
      return `Premium creators: ${t3.map((i,n)=>`${n+1}. ${i.name} — ₹${i.price.toLocaleString("en-IN")}, ${fmtKPlus(i.followers)} ${i.platform==="YouTube"?"subs":"followers"}, ${i.engagement||0}% engagement`).join(" | ")}.`;
    }
    if (ql.includes("highest rated")||ql.includes("best rated")||ql.includes("top rated")||ql.includes("best creator")) {
      const t4=[...ALL_INFS].sort((a,b)=>b.rating-a.rating).slice(0,4);
      return `Highest rated creators: ${t4.map((i,n)=>`${n+1}. ${i.name} (${i.rating}★ — ${i.niche}, ${i.city})`).join(" | ")}.`;
    }
    if (ql.includes("most views")||ql.includes("highest views")||ql.includes("best engagement")||ql.includes("most engaging")) {
      const t4=[...ALL_INFS].sort((a,b)=>(b.avgViews||0)-(a.avgViews||0)).slice(0,4);
      return `Highest avg views: ${t4.map((i,n)=>`${n+1}. ${i.name} — ${fmtK(i.avgViews||0)} avg views (${i.niche})`).join(" | ")}.`;
    }
    if (ql.includes("trend")||ql.includes("viral")||ql.includes("hot right now")||ql.includes("popular now")) {
      const trending=ALL_INFS.filter(i=>i.trending);
      const boosted=(window.__boostedCreatorIds||[]);
      const spon=ALL_INFS.filter(i=>boosted.includes(i.uid)||boosted.includes(String(i.id)));
      if (spon.length) return `Currently sponsored/trending: ${spon.map(i=>i.name+" ("+i.niche+")").join(", ")}. These creators appear at top of Discover with gold badges.`;
      if (trending.length) return `Trending creators: ${trending.map(i=>i.name+" ("+i.niche+", "+i.city+")").join(", ")}. Book them before their prices increase!`;
      return "No sponsored creators right now. Browse trending in the Discover category strip!";
    }

    // ── City ──
    const CITY_MAP = {"bangalore":"Bengaluru","bengaluru":"Bengaluru","mumbai":"Mumbai","delhi":"New Delhi","new delhi":"New Delhi","hyderabad":"Hyderabad","chennai":"Chennai","kolkata":"Kolkata","jaipur":"Jaipur","pune":"Pune","kochi":"Kochi","ahmedabad":"Ahmedabad"};
    const detCity = Object.keys(CITY_MAP).find(c=>ql.includes(c));
    if (detCity) {
      const cn=CITY_MAP[detCity];
      const ci=ALL_INFS.filter(i=>i.city===cn||i.city===cn.replace("New ",""));
      if (ci.length) return `${ci.length} creator${ci.length>1?"s":""} from ${cn}: ${ci.map(i=>`${i.name} (${i.niche}, ${fmtKPlus(i.followers)} ${i.platform==="YouTube"?"subs":"followers"}, ${i.rating}★)`).join(" | ")}. Filter by city on Discover!`;
      return `No creators from ${cn} yet. Our creators span Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Jaipur, Pune, Kochi, Ahmedabad. New creators added regularly!`;
    }
    if (ql.includes("city")||ql.includes("location")||ql.includes("local")) {
      const cg = {};
      ALL_INFS.forEach(i=>{cg[i.city]=(cg[i.city]||0)+1;});
      return `Creator spread: ${Object.entries(cg).map(([c,n])=>c+" ("+n+")").join(", ")}. Use city filter on Discover for hyper-targeted local campaigns!`;
    }

    // ── Platform ──
    if (ql.includes("instagram")&&ql.includes("youtube")) { const b=ALL_INFS.filter(i=>i.platform==="Both"); return `${b.length} creators on both platforms: ${b.map(i=>i.name+" ("+fmtKPlus(i.followers)+" Insta + "+fmtKPlus(i.ytSubscribers||0)+" YT subs)").join(" | ")}. Max cross-platform reach!`; }
    if (ql.includes("instagram")||ql.includes("insta")) { const ig=ALL_INFS.filter(i=>i.platform==="Instagram"||i.platform==="Both"); return `${ig.length} Instagram creators: ${ig.map(i=>i.name).join(", ")}. Offer Story (24hr) and Reel (permanent) promotions.`; }
    if (ql.includes("youtube")||ql.includes("youtuber")) { const yt=ALL_INFS.filter(i=>i.platform==="YouTube"||i.platform==="Both"); return `${yt.length} YouTube creators: ${yt.map(i=>i.name).join(", ")}. Mid-roll Video Promotions — great for in-depth product reviews.`; }

    // ── Promo types ──
    if (ql.includes("story")||ql.includes("stories")) return "Story Promotions = 45% of base price, Instagram 24hr with swipe-up link. Cheapest option, great for flash sales. Lowest available: "+[...ALL_INFS].filter(i=>i.prices?.story).sort((a,b)=>(a.prices?.story||0)-(b.prices?.story||0)).slice(0,3).map(i=>i.name+" (₹"+(i.prices?.story||0).toLocaleString("en-IN")+")").join(", ")+".";
    if (ql.includes("reel")) return "Reel Promotions = 100% of base price, permanent on Instagram. Most popular — high organic reach. Top performers by rating: "+[...ALL_INFS].filter(i=>i.prices?.reel).sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,3).map(i=>i.name+" (₹"+(i.prices?.reel||0).toLocaleString("en-IN")+", "+i.rating+"★)").join(", ")+".";
    if (ql.includes("personal ad")||ql.includes("scripted")||ql.includes("exclusive")) return "Personal Ads = 240% of base, exclusive scripted content with 60-day usage rights. After admin review, creator sends you the video via Google Drive. Best for launches. Top picks: "+[...ALL_INFS].filter(i=>i.prices?.personalad).sort((a,b)=>(a.prices?.personalad||0)-(b.prices?.personalad||0)).slice(0,3).map(i=>i.name+" (₹"+(i.prices?.personalad||0).toLocaleString("en-IN")+")").join(", ")+".";
    if (ql.includes("youtube video")||ql.includes("video promotion")||ql.includes("mid-roll")) return "YouTube Video Promotions = 165% of base price, 30-60s mid-roll. Best for detailed product reviews. Top YT creators: "+[...ALL_INFS].filter(i=>i.prices?.video).sort((a,b)=>(b.followers||0)-(a.followers||0)).slice(0,3).map(i=>i.name+" (₹"+(i.prices?.video||0).toLocaleString("en-IN")+", "+fmtKPlus(i.followers)+" subs)").join(", ")+".";
    if (ql.includes("promo type")||ql.includes("promotion type")||ql.includes("what type")||ql.includes("which type")) return "4 types: 1. Story (45%, Instagram 24hr swipe-up) 2. Reel (100%, Instagram permanent — most popular) 3. YouTube Video (165%, 30-60s mid-roll) 4. Personal Ad (240%, exclusive scripted, Drive link delivery). Each creator's profile shows exact prices!";

    // ── App features & booking ──
    if (ql.includes("how to book")||ql.includes("booking process")||ql.includes("how do i book")) return "Booking in under 2 min: Discover → tap creator → Book Now → select promo type → fill brief (product, audience, message) → select category → pay via Razorpay/UPI. Creator delivers in 1-3 working days!";
    if (ql.includes("campaign brief")||ql.includes("what to write")||ql.includes("brief")) return "Perfect brief: product name + key message + tone (fun/professional) + target audience (age/city/interest) + hashtags + any visual style. More detail = better content = higher ROI. Creators reject briefs that are too vague!";
    if (ql.includes("deliver")||ql.includes("how long")||ql.includes("when will")) return "Story/Reel/YouTube: 1-3 working days. Personal Ad: 3-5 days (scripting + production). You get a notification when live. Personal Ad videos come via Google Drive link!";
    if (ql.includes("cancel")||ql.includes("refund")||ql.includes("money back")) return "Cancel within 48hr = full refund. Creator rejects = instant full refund to your Collancer Wallet. After campaign start = 20% fee. Email support@collancer.in with booking details.";
    if (ql.includes("wallet")||ql.includes("deposit")) return "Collancer Wallet: pre-load funds for instant booking. Deposit via UPI/card/netbanking. Auto-used on next booking. Minimum ₹100 deposit. Rejected bookings auto-refund here instantly!";
    if (ql.includes("referral")||ql.includes("earn commission")||ql.includes("refer")) return "Referral tab → copy your unique link → share with businesses. You earn 5% of every booking they make, paid monthly. No cap. Minimum payout: ₹500.";
    if (ql.includes("pro plan")||ql.includes("collancer pro")||ql.includes("pro feature")) return "Collancer Pro: 1. Cleo AI (me!) 2. 10% off all bookings 3. Deep Analytics on every creator profile 4. Promo Demo Videos before booking. Plans: ₹999/month, ₹799/month (6M), ₹599/month (12M). Go to Pro tab!";
    if (ql.includes("wallet")||ql.includes("payment")||ql.includes("pay")||ql.includes("upi")||ql.includes("razorpay")) return "All payments via Razorpay: UPI (GPay/PhonePe/Paytm/BHIM), credit/debit cards, net banking, wallets. 256-bit SSL. GST invoice auto-generated. Pre-load Collancer Wallet for faster bookings!";
    if (ql.includes("dashboard")||ql.includes("track")||ql.includes("my booking")) return "Dashboard shows: Active (in progress), Pending (processing), PendingCompletion (admin review), Completed (leave a review!), Cancelled (+refund). For completed Personal Ads, the Drive link shows in your campaign card!";
    if (ql.includes("support")||ql.includes("help")||ql.includes("contact")||ql.includes("issue")) return "Support tab for instant AI help. Email support@collancer.in (24hr response). Urgent? Write URGENT in subject. Billing: billing@collancer.in. Privacy: privacy@collancer.in.";
    if (ql.includes("cleo")||ql.includes("who are you")||ql.includes("what can you")) return `I'm Cleo, your Collancer Pro AI! I know all ${ALL_INFS.length} creators, all features, pricing, and campaign strategy. I can find best-fit influencers by budget/niche/city, compare creators, explain any feature, and help you write winning campaign briefs. Just ask!`;
    if (ql.includes("analytics")||ql.includes("insights")||ql.includes("deep analytics")) return "Pro Analytics (creator profile > Analytics tab): 6-month view/engagement trends, audience demographics, city-level reach, brand affinity, estimated conversion rates, ROI forecasts. Available on every creator's profile with Collancer Pro!";
    if (ql.includes("promo demo")||ql.includes("demo video")||ql.includes("sample")) return "Promo Demos (creator profile > Promo Demos tab) show actual videos of how each creator promotes products. Available in 9:16 (vertical for Stories/Reels) and 16:9 (horizontal for YouTube). Watch before booking to know exactly what to expect!";
    if (ql.includes("roi")||ql.includes("result")||ql.includes("worth it")||ql.includes("effective")) return "Proven results: Myntra 4× ROI in 7 days (Priya Sharma), OnePlus 15K pre-orders (Rohan Mehra video), Swiggy record installs (Kabir Khan), Razer India viral in 24hr (Vikram Joshi). ROI depends on brief quality + creator-niche match. I can help optimise both!";
    if (ql.includes("price")||ql.includes("cost")||ql.includes("how much")||ql.includes("fee")) {
      const mn=Math.min(...ALL_INFS.map(i=>i.price));
      const mx=Math.max(...ALL_INFS.map(i=>i.price));
      return `Creator pricing: ₹${mn.toLocaleString("en-IN")} to ₹${mx.toLocaleString("en-IN")} base. Story 45%, Reel 100%, YT Video 165%, Personal Ad 240% of base. Tell me your budget and niche for personalised picks!`;
    }
    if (ql.includes("verif")||ql.includes("authentic")||ql.includes("fake")||ql.includes("trust")) {
      const v=ALL_INFS.filter(i=>i.verified).length;
      return `${v}/${ALL_INFS.length} creators are verified (blue checkmark). Verification = manual review of audience authenticity, content quality, follower genuineness using third-party analytics. No fake followers allowed.`;
    }
    if (ql.includes("all creator")||ql.includes("list all")||ql.includes("every creator")) {
      const byNiche = {};
      ALL_INFS.forEach(i=>{(byNiche[i.niche]=byNiche[i.niche]||[]).push(i.name);});
      return `All ${ALL_INFS.length} creators by niche: ${Object.entries(byNiche).map(([n,ns])=>n+": "+ns.join(", ")).join(" | ")}.`;
    }
    if (ql.includes("hello")||ql.includes("hi ")||ql.includes("hey ")||ql.includes("namaste")||ql.includes("good morning")||ql.includes("good evening")) return `Hey! I'm Cleo 🤖 your Collancer Pro AI. I know all ${ALL_INFS.length} creators — niches, pricing, cities, ratings. Ask me: "find fitness creator under ₹3000 in Mumbai", "compare Priya Sharma vs Kabir Khan", "best YouTuber for tech review". What campaign are you planning?`;
    if (ql.includes("thank")||ql.includes("thanks")||ql.includes("great")||ql.includes("awesome")) return "You're welcome! Good luck with your campaign. Ask me anything else — creator picks, pricing, or booking tips. I'm here!";
    if (ql.includes("what is collancer")||ql.includes("about collancer")) return `Collancer is India's #1 influencer marketplace — ${ALL_INFS.length}+ verified Indian creators on Instagram and YouTube. Book in INR, track real-time, earn via referrals. Pro = AI insights, deep analytics, promo demos, 10% off all bookings.`;

    // ── Category ──
    const cat = PROMOTION_CATEGORIES.find(c=>ql.includes(c.id)||ql.includes(c.label.toLowerCase().split(" ")[0]));
    if (cat) {
      const ci=ALL_INFS.filter(i=>(i.categories||[]).includes(cat.id)||i.niche.toLowerCase().includes(cat.id));
      if (ci.length) return `Top ${cat.icon} ${cat.label} creators: ${ci.slice(0,4).map(i=>`${i.name} (${fmtKPlus(i.followers)} ${i.platform==="YouTube"?"subs":"followers"}, ${i.rating}★, ₹${i.price.toLocaleString("en-IN")})`).join(" | ")}.`;
      return `No creators specifically in ${cat.label} yet — browse all ${ALL_INFS.length} creators on Discover for related niches!`;
    }

    // ── Default ──
    const top3=[...ALL_INFS].sort((a,b)=>b.followers-a.followers).slice(0,3);
    return `I'm Cleo, Collancer Pro AI! 🤖 I can help: find creators by budget/niche/city, compare creators head-to-head, get full profile details, or explain any feature. Top creators right now: ${top3.map(i=>i.name+" ("+i.niche+")").join(", ")}. What do you need?`;
  };

  const ask = async () => {
    const q = input.trim();
    if (!q||loading) return;
    setSuggestions(false);
    const userMsg = {role:"user",text:q};
    setChatHistory(prev=>[...prev,userMsg]);
    setInput(""); setResponse(""); setDisplayed(""); setMentionedInfs([]); setLoading(true);
    await new Promise(r=>setTimeout(r,500+Math.random()*300));
    const ans = getCleoResponse(q);
    setResponse(ans);
    setLoading(false);
    setChatHistory(prev=>[...prev,{role:"cleo",text:ans}]);
    return ans;
  };

  const QUICK = [
    "Find fitness creator under ₹3,000",
    "Who has the most followers?",
    "Best food influencer in Mumbai",
    "Compare Priya Sharma vs Kabir Khan",
    "Top YouTubers for tech reviews",
    "Which creator has highest views?",
  ];

  return (
    <div style={{margin:"10px 0 4px",animation:"fadeUp .6s .3s both",width:"100%",boxSizing:"border-box"}}>
      {isPro ? (
        <div style={{borderRadius:22,overflow:"hidden",width:"100%",
          background:"linear-gradient(180deg,rgba(8,4,22,.98),rgba(7,7,16,.99))",
          border:`1px solid ${open?"rgba(0,229,255,.28)":"rgba(156,106,247,.2)"}`,
          boxShadow:open?"0 6px 24px rgba(156,106,247,.1)":"none",
          transition:"border-color .25s,box-shadow .25s"}}>

          {/* Header — compact */}
          <div style={{padding:"11px 13px",cursor:"pointer",userSelect:"none",
            background:open?"linear-gradient(135deg,rgba(156,106,247,.09),rgba(0,229,255,.03))":"transparent",
            borderBottom:open?"1px solid rgba(156,106,247,.1)":"none"}}
            onClick={()=>setOpen(v=>!v)}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{position:"relative",flexShrink:0}}>
                <div style={{width:38,height:38,borderRadius:16,
                  background:"linear-gradient(135deg,rgba(156,106,247,.2),rgba(0,229,255,.07))",
                  border:`1px solid ${open?"rgba(0,229,255,.35)":"rgba(156,106,247,.25)"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  transition:"all .25s",animation:"proGlow 2.5s ease infinite"}}>
                  <CleoLogo size={30} glow={open}/>
                </div>
                <div style={{position:"absolute",top:-4,right:-4,
                  background:"linear-gradient(135deg,#9c6af7,#ffab40)",
                  borderRadius:5,padding:"1px 4px",fontSize:7,fontWeight:800,
                  color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:.3,
                  boxShadow:"0 1px 6px rgba(156,106,247,.5)",
                  animation:"proBadge 2s ease infinite"}}>PRO</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:1}}>
                  <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:800,
                    background:"linear-gradient(135deg,#9c6af7,var(--c))",
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Ask Cleo</span>
                  {!open&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:8,
                    background:"linear-gradient(145deg,rgba(0,229,255,.14),rgba(0,188,212,.07))",color:"var(--c)",fontWeight:700,
                    border:"1.5px solid rgba(0,229,255,.18)"}}>AI</span>}
                </div>
                <div style={{fontSize:10,color:"var(--txt2)",lineHeight:1.3}}>
                  {open?"Knows all creators · powered by Collancer AI":"Find the perfect creator for your campaign"}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:3}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"var(--grn)",
                    boxShadow:"0 0 4px var(--grn)",animation:"pulse 1.5s ease infinite"}}/>
                  <span style={{fontSize:8,color:"var(--grn)",fontWeight:600}}>Live</span>
                </div>
                <span style={{fontSize:12,color:"var(--txt2)",lineHeight:1,
                  display:"inline-block",
                  transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform .25s"}}>▾</span>
              </div>
            </div>
          </div>

          {open && (
            <div style={{display:"flex",flexDirection:"column",maxHeight:320}}>
              <div ref={chatContainerRef} style={{flex:1,overflowY:"auto",padding:"10px 12px 6px"}} className="nosb">
                {/* Welcome */}
                {chatHistory.length===0 && !loading && (
                  <div style={{animation:"fadeUp .4s both"}}>
                    <div style={{display:"flex",gap:8,marginBottom:12}}>
                      <div style={{width:26,height:26,borderRadius:12,flexShrink:0,
                        background:"linear-gradient(135deg,rgba(156,106,247,.22),rgba(0,229,255,.1))",
                        border:"1px solid rgba(156,106,247,.28)",
                        display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <CleoLogo size={22}/>
                      </div>
                      <div style={{background:"linear-gradient(135deg,rgba(156,106,247,.09),rgba(0,229,255,.03))",
                        border:"1px solid rgba(156,106,247,.15)",
                        borderRadius:"4px 12px 12px 12px",padding:"9px 12px",
                        fontSize:12,color:"var(--txt)",lineHeight:1.7,flex:1}}>
                        Hi! I'm Cleo — Collancer Pro AI. I know all {ALL_INFS.length} creators, every feature, and I can help find the perfect influencer for any campaign. What are you promoting?
                      </div>
                    </div>
                    {suggestions && (
                      <div style={{marginBottom:10}}>
                        <div style={{fontSize:9,color:"var(--txt2)",fontWeight:700,letterSpacing:.8,marginBottom:6}}>QUICK QUESTIONS</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                          {QUICK.map(q=>(
                            <button key={q} onClick={()=>setInput(q)}
                              style={{padding:"4px 10px",borderRadius:50,cursor:"pointer",fontSize:10,
                                fontWeight:600,border:"1px solid rgba(156,106,247,.22)",
                                background:"rgba(156,106,247,.06)",color:"#c4a8ff",transition:"all .2s"}}
                              onMouseEnter={e=>{e.currentTarget.style.background="rgba(156,106,247,.18)";e.currentTarget.style.borderColor="rgba(156,106,247,.45)"}}
                              onMouseLeave={e=>{e.currentTarget.style.background="rgba(156,106,247,.06)";e.currentTarget.style.borderColor="rgba(156,106,247,.22)"}}>
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Chat messages */}
                {chatHistory.map((msg,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:10,
                    flexDirection:msg.role==="user"?"row-reverse":"row",
                    animation:"msgIn .3s cubic-bezier(.16,1,.3,1) both"}}>
                    {msg.role==="cleo"&&(
                      <div style={{width:24,height:24,borderRadius:7,flexShrink:0,
                        background:"linear-gradient(135deg,rgba(156,106,247,.22),rgba(0,229,255,.1))",
                        border:"1px solid rgba(156,106,247,.25)",
                        display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <CleoLogo size={20}/>
                      </div>
                    )}
                    <div style={{maxWidth:"80%",
                      background:msg.role==="user"
                        ?"linear-gradient(135deg,rgba(0,229,255,.13),rgba(0,188,212,.06))"
                        :"linear-gradient(135deg,rgba(156,106,247,.08),rgba(0,229,255,.02))",
                      border:msg.role==="user"?"1px solid rgba(0,229,255,.2)":"1px solid rgba(156,106,247,.12)",
                      borderRadius:msg.role==="user"?"12px 3px 12px 12px":"3px 12px 12px 12px",
                      padding:"8px 11px",fontSize:12,color:"var(--txt)",lineHeight:1.7}}>
                      {msg.role==="cleo"&&i===chatHistory.length-1&&displayed&&displayed.length<msg.text.length
                        ?<>{displayed}<span style={{display:"inline-block",width:2,height:12,background:"var(--c)",marginLeft:2,verticalAlign:"text-bottom",animation:"pulse .7s ease infinite",borderRadius:1}}/></>
                        :msg.text}
                    </div>
                  </div>
                ))}

                {/* Loading dots */}
                {loading&&(
                  <div style={{display:"flex",gap:8,marginBottom:10,animation:"fadeUp .3s both"}}>
                    <div style={{width:24,height:24,borderRadius:7,flexShrink:0,
                      background:"linear-gradient(135deg,rgba(156,106,247,.22),rgba(0,229,255,.1))",
                      border:"1px solid rgba(156,106,247,.25)",
                      display:"flex",alignItems:"center",justifyContent:"center"}}><CleoLogo size={20}/></div>
                    <div style={{background:"rgba(156,106,247,.07)",border:"1px solid rgba(156,106,247,.12)",
                      borderRadius:"3px 12px 12px 12px",padding:"9px 13px",
                      display:"flex",gap:4,alignItems:"center"}}>
                      {[0,1,2].map(i=>(
                        <div key={i} style={{width:5,height:5,borderRadius:"50%",background:"#9c6af7",
                          animation:`dotbounce .9s ease ${i*.15}s infinite`}}/>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mentioned creators */}
                {chatHistory.length>0&&mentionedInfs.length>0&&!loading&&(
                  <div style={{marginBottom:8}}>
                    <div style={{fontSize:9,color:"var(--c)",fontWeight:700,letterSpacing:.8,marginBottom:6}}>MENTIONED CREATORS</div>
                    {mentionedInfs.slice(0,3).map(inf=>(
                      <div key={inf.id} onClick={()=>{if(onSelect){onSelect(inf);setOpen(false);}}}
                        style={{display:"flex",alignItems:"center",gap:9,
                          background:"rgba(0,229,255,.03)",border:"1px solid rgba(0,229,255,.12)",
                          borderRadius:14,padding:"8px 10px",cursor:"pointer",marginBottom:5,transition:"all .2s"}}
                        onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,229,255,.09)";e.currentTarget.style.borderColor="rgba(0,229,255,.28)"}}
                        onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,229,255,.03)";e.currentTarget.style.borderColor="rgba(0,229,255,.12)"}}>
                        <Avatar inf={inf} size={32} style={{border:"1.5px solid rgba(0,229,255,.22)",flexShrink:0}}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:700,color:"var(--txt)",marginBottom:1,display:"flex",alignItems:"center",gap:5}}>
                            {inf.name}
                            {inf.verified&&<span style={{fontSize:8,background:"var(--c)",color:"var(--bg)",borderRadius:"50%",width:11,height:11,display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>✓</span>}
                          </div>
                          <div style={{fontSize:10,color:"var(--txt2)"}}>{inf.niche} · {inf.city} · ₹{inf.price.toLocaleString("en-IN")}</div>
                        </div>
                        <span style={{fontSize:10,color:"var(--c)",fontWeight:700,flexShrink:0}}>View →</span>
                      </div>
                    ))}
                  </div>
                )}

                {chatHistory.length>0&&!loading&&(
                  <button onClick={()=>{setChatHistory([]);setResponse("");setDisplayed("");setMentionedInfs([]);setSuggestions(true);}}
                    style={{fontSize:10,color:"var(--txt2)",background:"none",border:"none",cursor:"pointer",padding:"3px 6px"}}>
                    ✕ Clear chat
                  </button>
                )}
              </div>

              {/* Input bar — compact */}
              <div style={{padding:"8px 11px",borderTop:"1px solid rgba(156,106,247,.1)",background:"rgba(7,7,16,.97)"}}>
                <div style={{display:"flex",gap:6,alignItems:"center",
                  background:"rgba(156,106,247,.06)",border:"1px solid rgba(156,106,247,.16)",
                  borderRadius:16,padding:"6px 6px 6px 11px",transition:"border-color .2s"}}>
                  <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&ask()}
                    placeholder="Ask about creators, budget, niche…"
                    style={{flex:1,background:"none",border:"none",outline:"none",boxShadow:"none",
                      color:"var(--txt)",fontSize:12,fontFamily:"'DM Sans',sans-serif",padding:"2px 0"}}
                    onFocus={e=>e.target.parentElement.style.borderColor="rgba(156,106,247,.4)"}
                    onBlur={e=>e.target.parentElement.style.borderColor="rgba(156,106,247,.16)"}/>
                  <button onClick={ask} disabled={!input.trim()||loading}
                    style={{width:28,height:28,borderRadius:12,border:"none",flexShrink:0,
                      background:input.trim()&&!loading?"linear-gradient(135deg,#9c6af7,#7c4af7)":"rgba(255,255,255,.05)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      cursor:input.trim()&&!loading?"pointer":"default",fontSize:12,
                      color:input.trim()&&!loading?"#fff":"var(--txt3)",
                      boxShadow:input.trim()&&!loading?"0 3px 0 #5a2eb5,0 3px 8px rgba(156,106,247,.3)":"none",
                      transition:"all .15s"}}>
                    {loading?<span style={{animation:"spin 1s linear infinite",display:"inline-block",fontSize:10}}>◌</span>:"↑"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── LOCKED CLEO — Premium teaser ── */
        <div style={{borderRadius:26,overflow:"hidden",
          background:"linear-gradient(160deg,rgba(20,8,45,.97) 0%,rgba(8,4,22,.98) 60%)",
          border:"1px solid rgba(156,106,247,.28)",
          boxShadow:"0 8px 40px rgba(156,106,247,.1),0 0 0 1px rgba(156,106,247,.06)"}}>

          {/* Top glow bar */}
          <div style={{height:2,background:"linear-gradient(90deg,transparent,#9c6af7 30%,#00E5FF 50%,#ffab40 70%,transparent)"}}/>

          <div style={{padding:"16px 16px 14px"}}>
            {/* Header row */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              {/* Animated Cleo avatar — purple glow */}
              <div style={{position:"relative",flexShrink:0}}>
                <div style={{width:48,height:48,borderRadius:18,
                  background:"linear-gradient(135deg,rgba(156,106,247,.3),rgba(0,229,255,.1))",
                  border:"1.5px solid rgba(156,106,247,.45)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,
                  boxShadow:"0 0 20px rgba(156,106,247,.3),0 0 0 5px rgba(156,106,247,.07)",
                  animation:"proGlow 2.5s ease infinite"}}>
                  <CleoLogo size={44} glow={open}/>
                </div>
                <div style={{position:"absolute",top:-4,right:-4,width:16,height:16,
                  borderRadius:"50%",background:"linear-gradient(135deg,#9c6af7,#ffab40)",
                  border:"2px solid rgba(8,4,22,.9)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:7,color:"#fff",boxShadow:"0 0 8px rgba(156,106,247,.6)",
                  animation:"proBadge 2s ease infinite"}}>🔒</div>
              </div>

              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,
                    background:"linear-gradient(135deg,#9c6af7,#00E5FF)",
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                    Ask Cleo
                  </span>
                  <span style={{padding:"2px 8px",borderRadius:50,fontSize:9,fontWeight:800,
                    background:"linear-gradient(135deg,#9c6af7,#ffab40)",color:"#fff",
                    fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:.5}}>PRO</span>
                </div>
                <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.5}}>
                  AI-powered creator intelligence for your campaigns
                </div>
              </div>

              <button onClick={()=>onProClick&&onProClick("cleo")}
                className="pro-btn-3d"
                style={{padding:"9px 16px",fontSize:11,fontWeight:800,flexShrink:0,borderRadius:12}}>
                Unlock →
              </button>
            </div>

            {/* 3 benefit pills */}
            <div style={{display:"flex",gap:6,marginBottom:13,flexWrap:"wrap"}}>
              {[
                {icon:"🎯",text:"Smart creator matching"},
                {icon:"💡",text:`Knows all ${ALL_INFS.length} creators`},
                {icon:"📊",text:"Budget + niche AI picks"},
              ].map(b=>(
                <div key={b.text} style={{display:"flex",alignItems:"center",gap:5,
                  padding:"5px 10px",borderRadius:50,
                  background:"rgba(156,106,247,.08)",border:"1px solid rgba(156,106,247,.18)"}}>
                  <span style={{fontSize:11}}>{b.icon}</span>
                  <span style={{fontSize:10,color:"#c4b5fd",fontWeight:600}}>{b.text}</span>
                </div>
              ))}
            </div>

            {/* Blurred fake chat preview */}
            <div style={{position:"relative",borderRadius:18,overflow:"hidden"}}>
              {/* Blur overlay */}
              <div style={{position:"absolute",inset:0,backdropFilter:"blur(4px)",
                background:"linear-gradient(180deg,rgba(20,8,45,.3) 0%,rgba(20,8,45,.75) 100%)",
                zIndex:2,borderRadius:14}}/>
              {/* Fake messages */}
              <div style={{padding:"10px 12px",background:"rgba(156,106,247,.06)",
                border:"1px solid rgba(156,106,247,.14)",borderRadius:18,
                display:"flex",flexDirection:"column",gap:8}}>
                <div style={{display:"flex",gap:7}}>
                  <div style={{width:22,height:22,borderRadius:7,flexShrink:0,
                    background:"rgba(156,106,247,.2)",display:"flex",alignItems:"center",
                    justifyContent:"center"}}><CleoLogo size={20}/></div>
                  <div style={{background:"linear-gradient(145deg,rgba(156,106,247,.18),rgba(124,74,247,.08))",borderRadius:"3px 10px 10px 10px",
                    padding:"6px 10px",fontSize:11,color:"var(--txt)",maxWidth:"90%",lineHeight:1.5}}>
                    Hi! I'm Cleo. What niche or budget are you working with?
                  </div>
                </div>
                <div style={{display:"flex",gap:7,flexDirection:"row-reverse"}}>
                  <div style={{background:"linear-gradient(145deg,rgba(0,229,255,.18),rgba(0,188,212,.08))",borderRadius:"10px 3px 10px 10px",
                    padding:"6px 10px",fontSize:11,color:"var(--txt)",lineHeight:1.5}}>
                    Fitness creator under ₹3,000 in Mumbai
                  </div>
                </div>
                <div style={{display:"flex",gap:7}}>
                  <div style={{width:22,height:22,borderRadius:7,flexShrink:0,
                    background:"rgba(156,106,247,.2)",display:"flex",alignItems:"center",
                    justifyContent:"center"}}><CleoLogo size={20}/></div>
                  <div style={{background:"linear-gradient(145deg,rgba(156,106,247,.18),rgba(124,74,247,.08))",borderRadius:"3px 10px 10px 10px",
                    padding:"6px 10px",fontSize:11,color:"var(--txt)",maxWidth:"90%",lineHeight:1.5}}>
                    Top picks: Sneha Kapoor (200K followers, ₹2,400...
                  </div>
                </div>
              </div>
              {/* Unlock CTA over blur */}
              <div style={{position:"absolute",inset:0,zIndex:3,
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
                <div style={{fontSize:22}}>🔒</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:800,
                  color:"#fff",textAlign:"center"}}>Unlock with Collancer Pro</div>
                <button onClick={()=>onProClick&&onProClick("cleo")}
                  className="pro-btn-3d"
                  style={{padding:"8px 20px",fontSize:12,borderRadius:50}}>
                  See Plans →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LegalPage({ type, onBack }) {
  const data = type==="privacy" ? PRIVACY : TERMS;
  return (
    <div style={{maxWidth:430, margin:"0 auto", padding:"16px 16px 24px"}}>
      <button onClick={onBack} style={{background:"none", border:"1.5px solid rgba(255,255,255,.07)", borderRadius:14, color:"var(--txt2)", padding:"8px 16px", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", marginBottom:22, display:"inline-flex", alignItems:"center", gap:7, transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--c)";e.currentTarget.style.color="var(--c)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b)";e.currentTarget.style.color="var(--txt2)"}}>← Back</button>
      <div style={{animation:"fadeUp .5s both"}}>
        <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:6}}>
          <div style={{width:36, height:36, borderRadius:11, background:"var(--cdim)", border:"1.5px solid rgba(0,229,255,.22)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18}}>{type==="privacy"?"🔐":"📋"}</div>
          <h1 style={{fontSize:"clamp(20px,4vw,28px)", fontWeight:800}}>{data.title}</h1>
        </div>
        <p style={{fontSize:12, color:"var(--txt2)", marginBottom:28, marginLeft:48}}>{data.updated}</p>
        {data.sections.map((s,i) => (
          <div key={i} style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))", border:"1.5px solid rgba(255,255,255,.07)", borderRadius:20, padding:"16px", marginBottom:10, animation:`fadeUp .4s ${i*.04}s both`, transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,229,255,.15)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b)"}>
            <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:700, color:"var(--c)", marginBottom:7}}>{s.h}</h3>
            <p style={{fontSize:12.5, color:"var(--txt2)", lineHeight:1.8}}>{s.p}</p>
          </div>
        ))}
        <div style={{marginTop:20, padding:"14px 18px", background:"rgba(0,229,255,.04)", border:"1px solid rgba(0,229,255,.12)", borderRadius:18, textAlign:"center"}}>
          <p style={{fontSize:12, color:"var(--txt2)"}}>Questions? Email us at <span style={{color:"var(--c)"}}>legal@collancer.in</span></p>
        </div>
      </div>
    </div>
  );
}

// ── Shared Chat Utilities ─────────────────────────────
const CHAT_STORAGE_KEY_BIZ  = "collancer_biz_chats";
const CHAT_STORAGE_KEY_HOME = "collancer_home_chats";

function loadChats(key) {
  try { return JSON.parse(localStorage.getItem(key)||"[]"); } catch{ return []; }
}
function saveChats(key, chats) {
  try { localStorage.setItem(key, JSON.stringify(chats.slice(0,20))); } catch{}
}
function makeWelcome(text) {
  return [{id:0, role:"assistant", text}];
}

// ── Animated Chat Message ──────────────────────────────
function ChatMsg({ msg, isNew }) {
  const [shown, setShown] = useState(isNew && msg.role==="assistant" ? "" : msg.text);
  const [done,  setDone]  = useState(!isNew || msg.role==="user");
  useEffect(() => {
    if (!isNew || msg.role!=="assistant") return;
    let i = 0;
    const speed = Math.max(8, Math.min(22, 2000/msg.text.length));
    const iv = setInterval(() => {
      i++;
      setShown(msg.text.slice(0,i));
      if (i >= msg.text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, []);
  const isBot = msg.role==="assistant";
  return (
    <div style={{display:"flex", justifyContent:isBot?"flex-start":"flex-end", alignItems:"flex-end", gap:8, marginBottom:12, animation:"msgIn .35s cubic-bezier(.16,1,.3,1) both"}}>
      {isBot && <div style={{width:28, height:28, borderRadius:"50%", flexShrink:0, background:"linear-gradient(135deg,var(--c),var(--c2))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, boxShadow:"0 0 12px rgba(0,229,255,.3)"}}>✦</div>}
      <div style={{maxWidth:"80%", padding:"11px 14px", borderRadius:isBot?"4px 18px 18px 18px":"18px 18px 4px 18px", background:isBot?"linear-gradient(135deg,rgba(0,229,255,.08),rgba(124,106,247,.06))":"linear-gradient(135deg,var(--c),var(--c2))", color:isBot?"var(--txt)":"var(--bg)", border:isBot?"1px solid rgba(0,229,255,.16)":"none", fontSize:13, lineHeight:1.7, boxShadow:isBot?"0 2px 16px rgba(0,0,0,.3)":"0 4px 20px rgba(0,229,255,.25)"}}>
        {shown}
        {!done && <span style={{display:"inline-block", width:2, height:13, background:isBot?"var(--c)":"var(--bg)", marginLeft:2, verticalAlign:"text-bottom", animation:"pulse .7s ease infinite", borderRadius:1}}/>}
      </div>
    </div>
  );
}

// ── Support AI Chat Page (Collancer Biz) ───────────────
function SupportPage({ onBack }) {
  const BIZ_WELCOME = "Hi! 👋 I'm your Collancer support assistant. I know everything about the platform — bookings, payments, creators, wallet, categories, referrals, rejection handling, and more. What do you need help with?";

  const [view,       setView]      = useState("chat"); // "chat" | "history"
  const [msgs,       setMsgs]      = useState(makeWelcome(BIZ_WELCOME));
  const [newIds,     setNewIds]    = useState(new Set([0]));
  const [input,      setInput]     = useState("");
  const [loading,    setLoading]   = useState(false);
  const [chatHistory,setChatHistory] = useState(()=>loadChats(CHAT_STORAGE_KEY_BIZ));
  const msgContainerRef = useRef(null);
  const inputRef  = useRef(null);
  const currentChatId = useRef(Date.now().toString());
  const deletedIds    = useRef(new Set()); // track deleted chat IDs so they never get re-persisted

  useEffect(()=>{ const el = msgContainerRef.current; if(el) el.scrollTop = el.scrollHeight; },[msgs,loading]);

  // Save current chat — only if it hasn't been deleted and has real messages
  const persistChat = (messages) => {
    if (messages.length <= 1) return; // only welcome msg — skip
    if (deletedIds.current.has(currentChatId.current)) return; // never re-save a deleted chat
    const hist = loadChats(CHAT_STORAGE_KEY_BIZ);
    const snippet = messages.filter(m=>m.role==="user")[0]?.text || "Chat";
    const existing = hist.findIndex(h=>h.id===currentChatId.current);
    const entry = { id:currentChatId.current, snippet:snippet.slice(0,60), messages, ts:Date.now() };
    if (existing>=0) hist[existing]=entry; else hist.unshift(entry);
    saveChats(CHAT_STORAGE_KEY_BIZ, hist);
    setChatHistory(hist);
  };

  const startNewChat = () => {
    persistChat(msgs); // save current chat before starting new one (only if not deleted)
    currentChatId.current = Date.now().toString();
    const welcome = makeWelcome(BIZ_WELCOME);
    setMsgs(welcome);
    setNewIds(new Set([0]));
    setInput("");
    setView("chat");
  };

  const loadChat = (entry) => {
    currentChatId.current = entry.id;
    setMsgs(entry.messages);
    setNewIds(new Set());
    setView("chat");
  };

  const deleteChat = (id, e) => {
    e.stopPropagation();
    // Mark as deleted so persistChat never re-saves it
    deletedIds.current.add(id);
    const updated = chatHistory.filter(h=>h.id!==id);
    saveChats(CHAT_STORAGE_KEY_BIZ, updated);
    setChatHistory(updated);
    // If the deleted chat is the currently active one, assign a fresh ID
    // so any future messages start a brand-new history entry
    if (currentChatId.current === id) {
      currentChatId.current = Date.now().toString();
    }
  };

  const getSupportResponse = (q, history) => {
    const ql = q.toLowerCase();
    const prev = (history||[]).slice(-4).map(m=>m.text).join(" ").toLowerCase();

    // ── Greetings ──
    if (ql.match(/^(hi|hey|hello|namaste|hii|helo|sup|good morning|good afternoon|good evening)[\s!?]*$/)) return "Hey there! Great to connect with you. I'm your Collancer support assistant — I know everything about the platform. Whether it's booking help, payment questions, creator discovery, wallet, categories, or anything else — I'm here. What can I help with today?";

    // ── About Collancer ──
    if (ql.includes("what is collancer")||ql.includes("about collancer")||ql.includes("tell me about collancer")) return "Collancer is India's premier B2B influencer marketplace. Businesses discover, analyse, and book verified Indian creators on Instagram and YouTube for brand promotions. Features include: AI-powered creator discovery, 25 promotion categories, real-time booking management, a digital wallet, referral commissions, and a full campaign dashboard — all in one app!";

    // ── How to book ──
    if (ql.includes("how do i book")||ql.includes("how to book")||ql.includes("booking process")||ql.includes("steps to book")||ql.includes("how can i book")) return "Booking is simple! Go to the Discover tab → tap a creator card → tap View Profile → tap Book Now → (1) select a promotion type, (2) pick your promotion category from our 25 options, (3) fill in your campaign brief — product name, target audience, hashtags, key messages → (4) review your order summary → (5) pay via Razorpay/UPI or your Collancer wallet. Done in under 2 minutes!";
    if ((ql.includes("book")||ql.includes("booking"))&&!ql.includes("cancel")&&!ql.includes("reject")) return "To book a creator: open the Discover tab → find the right creator → tap Book Now → select promotion type and category → write your brief → pay. The booking is auto-accepted immediately. You can track it live in the Dashboard tab!";

    // ── Promotion types ──
    if (ql.includes("story")||ql.includes("instagram story")) return "Story Promotions are Instagram-only, cost 45% of the creator's base price, and go live for 24 hours with a swipe-up link to your product. Best for time-sensitive offers, flash sales, and event announcements. Fast to produce, usually live within 1 working day!";
    if (ql.includes("reel")&&!ql.includes("real")) return "Reel Promotions cost 100% of the creator's base price and are permanent on their Instagram profile. Short vertical videos with massive organic discovery potential — the most popular promotion type on Collancer. Reels stay on the creator's profile forever and keep generating views over time!";
    if (ql.includes("video promotion")||ql.includes("youtube video")||ql.includes("mid-roll")||ql.includes("midroll")||ql.includes("youtube promo")) return "Video Promotions are YouTube-only and cost 165% of the base price. Your brand gets a 30–60 second mid-roll placement inside the creator's video — reaching their loyal, highly engaged subscriber base. Ideal for detailed product reviews, tech demos, and tutorials!";
    if (ql.includes("personal ad")||ql.includes("personalad")||ql.includes("scripted")||ql.includes("exclusive")) return "Personal Ads are our premium option at 240% of base price. The creator becomes the face of your brand — exclusive scripted content across both Instagram and YouTube, with full usage rights for 60 days. Perfect for product launches, IPOs, or campaigns needing high-end authentic content!";
    if (ql.includes("promo type")||ql.includes("type of promo")||ql.includes("what promotion")||ql.includes("types of promotion")||ql.includes("promotion option")) return "We have 4 promotion types: (1) Story — Instagram 24-hr, 45% of base price. (2) Reel — Instagram permanent, 100% of base price. (3) Video — YouTube mid-roll, 165% of base price. (4) Personal Ad — premium cross-platform scripted, 240% of base price. Each creator's profile shows their exact INR price for every type!";

    // ── Promotion categories ──
    if (ql.includes("categor")||ql.includes("what category")||ql.includes("which category")||ql.includes("category option")||ql.includes("type of category")||ql.includes("category strip")||ql.includes("category list")) return "Collancer has 25 promotion categories shown in a horizontal scrollable CATEGORIES strip on the Discover page. Tap any category pill to instantly filter to only that category's creators. Tap it again to deselect. The categories are: Fashion & Clothing, Beauty & Skincare, Food & Beverages, Fitness & Wellness, Tech & Gadgets, Gaming & Esports, Travel & Tourism, Finance & Fintech, Lifestyle & Vlogs, Music & Entertainment, Education & EdTech, Health & Pharma, Automobile & Bikes, Real Estate & Home, E-Commerce & Shopping, Jewellery & Accessories, Kids & Parenting, Sports & Athletics, Wedding & Events, Sustainable & Organic, Business & Startups, OTT & Entertainment, Pets & Animals, Astrology & Spirituality, and Crypto & Web3. You must select one category per booking!";
    if (ql.includes("wrong category")||ql.includes("mismatch")||ql.includes("wrong categor")) return "If you select a category that doesn't match your actual campaign brief, the creator may reject your booking. For example, if you select 'Fashion' but your brief is about a finance app, the creator has every right to reject. If rejected, you get an instant full refund to your wallet. Always select the category that truly represents your product!";

    // ── Rejection ──
    if (ql.includes("reject")||ql.includes("booking rejected")||ql.includes("creator rejected")||ql.includes("declined")) return "If a creator rejects your booking, you'll receive an instant push notification with the creator's rejection reason. The full booking amount is refunded immediately to your Collancer wallet — no delays. The rejected booking appears in your Dashboard with a red 'Cancelled' tag and the rejection reason clearly shown. You can then book a different creator!";
    if (ql.includes("refund")||ql.includes("money back")||ql.includes("get my money")) return "Refunds for rejected bookings are instant — credited immediately to your Collancer wallet. For business-initiated cancellations: 70% refund if cancelled 72+ hours before campaign start, no refund within 72 hours. If a creator fails to deliver, we arrange a replacement or issue a full wallet refund within 5 working days. Wallet funds can be used for future bookings!";

    // ── Wallet ──
    if (ql.includes("wallet")||ql.includes("deposit")||ql.includes("add money")||ql.includes("top up")||ql.includes("recharge")) return "Your Collancer wallet lets you deposit funds (minimum ₹100) and use them instantly for bookings without re-entering payment details each time. Deposit via UPI, credit/debit card, or net banking from the Wallet tab. When you book a creator, the amount is auto-deducted from your wallet if balance is sufficient. Wallet balance never expires. Refunds from rejected bookings go directly to your wallet!";
    if (ql.includes("wallet balance")||ql.includes("check balance")||ql.includes("my balance")) return "You can see your wallet balance at the top of the Wallet tab (the card showing '💳 WALLET BALANCE'). It updates in real-time whenever money is deposited or a booking deduction/refund occurs. You can also see your full transaction history — deposits, booking payments, and refunds — in the Wallet tab!";
    if (ql.includes("wallet transaction")||ql.includes("transaction history")||ql.includes("payment history")) return "Your complete wallet transaction history is available in the Wallet tab under 'Transaction History'. Each entry shows the transaction type (deposit, booking payment, or refund), amount, payment method, date, and running balance. Tap any entry for details. This data is also available in your GST invoices for accounting purposes!";

    // ── Payment methods ──
    if (ql.includes("upi")||ql.includes("gpay")||ql.includes("phonepe")||ql.includes("paytm")||ql.includes("payment method")||ql.includes("how to pay")||ql.includes("pay how")) return "Collancer supports all major Indian payment methods: UPI (GPay, PhonePe, Paytm, any bank UPI), credit cards (Visa, Mastercard, Amex), debit cards, net banking (all major Indian banks), and your Collancer wallet. All payments are in INR, processed securely via Razorpay with 256-bit SSL encryption. GST invoices are auto-generated for every transaction!";
    if (ql.includes("gst")||ql.includes("invoice")||ql.includes("tax")||ql.includes("receipt")||ql.includes("bill")||ql.includes("accounting")) return "GST-compliant invoices are auto-generated for every booking within 2 business days. GST at 18% applies to Collancer's 20% platform service fee (not the full booking amount). You can download invoices from your Dashboard. All transactions are logged with timestamps for your accounting records. Our GSTIN is available on all invoices!";

    // ── Campaign dashboard ──
    if (ql.includes("dashboard")||ql.includes("my campaign")||ql.includes("track campaign")||ql.includes("campaign status")||ql.includes("my booking")||ql.includes("active campaign")) return "Your Dashboard tab shows all campaigns with real-time status updates: Active (promotion in progress), Pending (being processed), Completed (done — you can write a review), and Cancelled (rejected by creator — reason shown). You can see budget, reach, promotion type, dates, and creator details for each campaign. Stats at the top show total spend, active and completed campaign counts for the quarter!";

    // ── Reviews ──
    if (ql.includes("review")||ql.includes("rate")||ql.includes("feedback")||ql.includes("rating")) return "After a campaign is marked Completed, a 'Review' button appears next to it in your Dashboard. Tap it to give 1–5 stars, write your experience, and add quick tags like 'Great ROI', 'Professional', or 'On Time'. Your review appears on the creator's profile to help other businesses make informed decisions. You can submit one review per booking!";

    // ── Creators — specific ──
    if (ql.includes("priya sharma")||ql.includes("priya.sharma")) return "Priya Sharma (@priya.sharma) is a Fashion creator from Mumbai on Instagram with 50K followers and 3.2K avg views, rated 4.9★. She's worked with Myntra, Nykaa Fashion, and 60+ premium brands. Story: ₹500 · Reel: ₹1,000 · Personal Ad: ₹2,200. Vogue India featured. She's one of Collancer's top-performing creators!";
    if (ql.includes("rohan mehra")||ql.includes("techwithrohan")) return "Rohan Mehra (@techwithrohan) is a Tech creator from Bengaluru on YouTube with 100K subscribers and 8.3K avg views, rated 4.8★. He delivered 15K pre-orders for OnePlus India from one video. Video Promotion: ₹6,000 · Personal Ad: ₹12,000. Perfect for gadget launches, app promotions, and startup stories!";
    if (ql.includes("sneha kapoor")||ql.includes("snehalifts")) return "Sneha Kapoor (@snehalifts) is a Fitness creator from Delhi on Instagram with 200K followers and 23.6K avg views, rated 4.7★. NASM certified trainer and HRX's best-performing campaign creator. Story: ₹2,000 · Reel: ₹4,000 · Personal Ad: ₹8,800. Ideal for fitness brands, wellness products, and athleisure!";
    if (ql.includes("arjun reddy")||ql.includes("arjunfinance")) return "Arjun Reddy (@arjunfinance) is a Finance creator from Hyderabad on YouTube with 400K subscribers and 31.6K avg views, rated 4.6★. Featured in Economic Times. Video Promotion: ₹24,000 · Personal Ad: ₹48,000. Best for fintech apps, investment platforms, and personal finance products!";
    if (ql.includes("ananya singh")||ql.includes("ananya.wanders")) return "Ananya Singh (@ananya.wanders) is a Travel creator from Jaipur on Instagram with 500K followers and 29K avg views, rated 4.9★. Condé Nast Traveller India contributor. Story: ₹5,000 · Reel: ₹10,000 · Personal Ad: ₹22,000. Perfect for hotels, airlines, tourism boards, and travel accessories!";
    if (ql.includes("kabir khan")||ql.includes("kabirfoods")) return "Kabir Khan (@kabirfoods) is a Food creator from Delhi on Instagram with 1M followers and 740K avg views, rated 4.8★. India's most-watched food creator. Swiggy credited him with record-breaking app installs. Story: ₹10,000 · Reel: ₹20,000 · Personal Ad: ₹44,000. Ideal for food brands, restaurants, and delivery apps!";
    if (ql.includes("meera nair")||ql.includes("meerabeauty")) return "Meera Nair (@meerabeauty) is a Beauty creator from Kochi on Instagram with 2M followers and 190K avg views, rated 4.7★. Partner to Lakmé, Kay Beauty, and Dot & Key. Story: ₹20,000 · Reel: ₹40,000 · Personal Ad: ₹88,000. The top choice for beauty, skincare, and personal care brands!";
    if (ql.includes("vikram joshi")||ql.includes("vikramgames")) return "Vikram Joshi (@vikramgames) is a Gaming creator from Pune on YouTube with 4M subscribers and 2.5M avg views, rated 4.9★. BGMI champion and esports commentator with 10M+ total views. Video Promotion: ₹2,40,000 · Personal Ad: ₹4,80,000. The #1 gaming creator in India — ideal for gaming brands, esports events, and tech products targeting Gen Z!";
    if (ql.includes("riya desai")||ql.includes("riyadesai")) return "Riya Desai (@riyadesai) is a Lifestyle creator from Mumbai on both Instagram AND YouTube — 320K Instagram followers + 180K YouTube subscribers, 27.4K avg views, rated 4.8★. Story: ₹7,500 · Reel: ₹15,000 · Video: ₹18,000 · Personal Ad: ₹38,000. Best for cross-platform reach — lifestyle, wellness, beauty, and D2C brands!";

    // ── Creator discovery ──
    if (ql.includes("most follow")||ql.includes("biggest creator")||ql.includes("largest audience")) return "The most followed creator on Collancer is Vikram Joshi with 4 million YouTube subscribers, followed by Meera Nair with 2M Instagram followers and Ananya Singh with 500K Instagram followers. For sheer audience size, these three are your best bet!";
    if (ql.includes("best engagement")||ql.includes("highest engagement")||ql.includes("most engaging")||ql.includes("avg views")||ql.includes("average views")) return "The creators with the highest average views are Vikram Joshi (avg 2.5M), Kabir Khan (avg 740K), and Meera Nair (avg 190K). High average views means every post your brand sponsors gets seen by a large, active audience. Great metric for awareness campaigns!";
    if (ql.includes("cheapest")||ql.includes("affordable")||ql.includes("budget")||ql.includes("low price")||ql.includes("under")) return "Our most affordable creator is Priya Sharma starting at ₹500 for a Story Promotion, followed by Rohan Mehra at ₹6,000 for a Video and Sneha Kapoor at ₹2,000 for a Story. All are verified creators with proven campaign track records. Even a micro-influencer can deliver excellent ROI for the right brand!";
    if (ql.includes("mumbai")||ql.includes("delhi")||ql.includes("bengaluru")||ql.includes("bangalore")||ql.includes("hyderabad")||ql.includes("chennai")||ql.includes("pune")||ql.includes("kochi")||ql.includes("jaipur")) { const city = ql.includes("mumbai")?"Mumbai":ql.includes("delhi")?"Delhi":ql.includes("bengaluru")||ql.includes("bangalore")?"Bengaluru":ql.includes("hyderabad")?"Hyderabad":ql.includes("pune")?"Pune":ql.includes("kochi")?"Kochi":ql.includes("jaipur")?"Jaipur":"your city"; return `We have creators from ${city} on Collancer! You can filter by city on the Discover page using the city filter. Local creators resonate with local audiences and can be very effective for regional campaigns, store launches, or city-specific offers!`; }
    if (ql.includes("instagram")||ql.includes("instagram creator")) return "Our Instagram creators include Priya Sharma (Fashion, Mumbai), Sneha Kapoor (Fitness, Delhi), Ananya Singh (Travel, Jaipur), Kabir Khan (Food, Delhi), Meera Nair (Beauty, Kochi), and Riya Desai (Lifestyle, Mumbai — also on YouTube). Filter by platform on the Discover page to see all Instagram creators!";
    if (ql.includes("youtube")||ql.includes("youtube creator")) return "Our YouTube creators include Rohan Mehra (Tech, Bengaluru), Arjun Reddy (Finance, Hyderabad), Vikram Joshi (Gaming, Pune), and Riya Desai (Lifestyle, Mumbai — also on Instagram). YouTube creators offer mid-roll video placements with deeply engaged subscriber audiences!";
    if (ql.includes("fashion")||ql.includes("clothing")||ql.includes("outfit")) return "For Fashion & Clothing campaigns, Priya Sharma (@priya.sharma) from Mumbai is our top pick — 50K followers, 3.2K avg views, Vogue India featured, worked with Myntra and Nykaa. Story: ₹500 · Reel: ₹1,000 · Personal Ad: ₹2,200. Use the category strip or filters on the Discover page to find Fashion creators!";
    if (ql.includes("fitness")||ql.includes("gym")||ql.includes("workout")||ql.includes("health")||ql.includes("wellness")) return "For Fitness & Wellness campaigns, Sneha Kapoor (@snehalifts) from Delhi is ideal — NASM certified, 200K followers, 23.6K avg views, HRX's best campaign creator. Reel: ₹4,000 · Personal Ad: ₹8,800. Perfect for sportswear, supplements, fitness equipment, and wellness apps!";
    if (ql.includes("food")||ql.includes("restaurant")||ql.includes("beverage")||ql.includes("drink")) return "For Food & Beverages campaigns, Kabir Khan (@kabirfoods) from Delhi is our star — 1M followers, 740K avg views, drove record installs for Swiggy. Reel: ₹20,000. For smaller budgets, tap Food in the category strip on Discover. Perfect for D2C food brands, cloud kitchens, and restaurant chains!";
    if (ql.includes("tech")||ql.includes("gadget")||ql.includes("smartphone")||ql.includes("laptop")) return "For Tech & Gadgets, Rohan Mehra (@techwithrohan) is our go-to — 100K YouTube subscribers, 8.3K avg views, delivered 15K pre-orders for OnePlus India. Video Promotion: ₹6,000. Perfect for smartphone launches, accessory brands, SaaS products, and startup stories!";
    if (ql.includes("gaming")||ql.includes("esport")||ql.includes("game")||ql.includes("bgmi")||ql.includes("free fire")) return "For Gaming & Esports campaigns, Vikram Joshi (@vikramgames) from Pune is unmatched — 4M YouTube subscribers, 2.5M avg views, BGMI champion. Video Promotion: ₹2,40,000. His campaign for Razer India went viral in 24 hours. Ideal for gaming peripherals, esports events, mobile games, and energy drinks!";
    if (ql.includes("finance")||ql.includes("fintech")||ql.includes("investment")||ql.includes("trading")||ql.includes("crypto")||ql.includes("mutual fund")) return "For Finance & Fintech campaigns, Arjun Reddy (@arjunfinance) from Hyderabad is perfect — 400K YouTube subscribers, featured in Economic Times. Video Promotion: ₹24,000 · Personal Ad: ₹48,000. Ideal for trading apps, mutual fund platforms, personal finance tools, and fintech startups. High trust score with his audience!";
    if (ql.includes("beauty")||ql.includes("skincare")||ql.includes("makeup")||ql.includes("cosmetic")) return "For Beauty & Skincare, Meera Nair (@meerabeauty) from Kochi is our top creator — 2M followers, 190K avg views, partner to Lakmé and Dot & Key. Reel: ₹40,000 · Personal Ad: ₹88,000. Also check Priya Sharma for fashion-beauty crossover campaigns. Use the Category strip on Discover for more beauty options!";
    if (ql.includes("travel")||ql.includes("hotel")||ql.includes("tourism")||ql.includes("airlines")||ql.includes("vacation")) return "For Travel & Tourism, Ananya Singh (@ananya.wanders) from Jaipur is perfect — 500K followers, Condé Nast Traveller contributor, covers 65+ destinations. Story: ₹5,000 · Reel: ₹10,000 · Personal Ad: ₹22,000. Ideal for hotels, airlines, tourism boards, travel accessories, and luxury resorts!";
    if (ql.includes("lifestyle")||ql.includes("vlog")||ql.includes("daily life")) return "For Lifestyle & Vlogs, Riya Desai (@riyadesai) from Mumbai is our cross-platform star — 320K Instagram + 180K YouTube, 27.4K avg views. Story: ₹7,500 · Reel: ₹15,000 · Video: ₹18,000 · Personal Ad: ₹38,000. Perfect for D2C brands, lifestyle products, wellness services, and anything that benefits from authentic daily-life storytelling!";

    // ── Discover / filters ──
    if (ql.includes("discover")||ql.includes("find creator")||ql.includes("search creator")||ql.includes("filter")||ql.includes("browse")) return "The Discover tab is your creator marketplace! There are two ways to find creators: (1) CATEGORIES strip — a horizontal scrollable row of all 25 categories. Tap any to instantly see only that category's creators with a CATEGORIES heading. (2) FILTERS bar — 5 filter pills (Platform, Size, Rating, City, Budget) shown in a 3-column grid. Tap any pill to open a bottom sheet and select an option — results appear inline below. You can also search by name or handle using the search bar!";
    if (ql.includes("sponsored")||ql.includes("be on top")||ql.includes("top of discover")||ql.includes("featured creator")||ql.includes("trending badge")||ql.includes("gold card")) return "Creators who run 'Be On Top' ad campaigns appear with a distinctive gold card banner instead of the normal silver one. Their card shows ✦ Sponsored on the left and 🔥 Trending on the right. They appear at the top of every category section they selected for their ad. The same gold banner and badges also show on their full profile page. Normal creators (no active ad) have a silver banner with no badges.";

    // ── Referral ──
    if (ql.includes("referral")||ql.includes("refer")||ql.includes("commission")||ql.includes("invite business")||ql.includes("earn commission")) return "The Referral tab has your unique referral link. Share it with other businesses. When a referred business makes their first booking and it's marked Completed, you earn 5% of that booking's net value (excluding GST) as a commission. Commissions are credited to your Collancer wallet monthly. There's no limit — refer 10 businesses, earn from all 10! No self-referrals or fake accounts allowed.";

    // ── Cleo AI ──
    if (ql.includes("cleo")||ql.includes("ai assistant")||ql.includes("ai chat")||ql.includes("ask cleo")) return "Cleo is Collancer's built-in AI assistant available on the Discover page (scroll down to find the chat widget). Cleo knows every creator on the platform and can recommend the perfect match for your campaign based on niche, budget, city, platform, or target audience. Just describe your brand and campaign goal, and Cleo will suggest 2-3 ideal creators with pricing and reasoning!";

    // ── Cancel booking ──
    if (ql.includes("cancel")||ql.includes("cancellation")) return "To cancel a booking you've made: email support@collancer.in with your booking ID and reason. Cancellations made 72+ hours before campaign start get a 70% wallet refund. Within 72 hours, no refund applies. If the creator rejects the booking themselves, you get an instant 100% wallet refund. We can also arrange a replacement creator if you'd prefer to continue the campaign!";

    // ── Delivery time ──
    if (ql.includes("deliver")||ql.includes("how long")||ql.includes("when will")||ql.includes("how fast")||ql.includes("time to deliver")) return "After booking confirmation, creators typically deliver within 1-3 working days for Stories and Reels, and 2-4 working days for YouTube Videos. Personal Ad campaigns may take 3-5 days due to scripting. If the deadline passes without delivery, email support@collancer.in with your booking ID — we'll follow up and arrange a replacement or refund!";

    // ── Account / profile ──
    if (ql.includes("account")||ql.includes("my account")||ql.includes("business profile")||ql.includes("change name")||ql.includes("change logo")||ql.includes("business name")) return "You can update your business name and logo in the Dashboard tab — tap the edit icon next to your business name. Your profile picture and name appear on all reviews you write and in booking notifications to creators. Changes sync instantly across the platform!";
    if (ql.includes("delete account")||ql.includes("close account")||ql.includes("deactivate")) return "To delete your Collancer business account, email support@collancer.in with the subject 'DELETE ACCOUNT'. We'll process it within 7 working days. Your wallet balance will be refunded after identity verification. Note: booking records required for GST compliance (7 years) cannot be deleted. You'll receive a final invoice for your records!";
    if (ql.includes("forgot password")||ql.includes("reset password")||ql.includes("change password")||ql.includes("login problem")) return "For password issues, use the 'Forgot Password' option on the login screen to receive a reset email. If you don't receive it, check your spam folder. For persistent login issues, email support@collancer.in with your registered business email. For security, we recommend a password with 12+ characters including numbers and symbols!";

    // ── Support ──
    if (ql.includes("support")||ql.includes("contact")||ql.includes("help")||ql.includes("email support")||ql.includes("human support")||ql.includes("talk to someone")) return "For support: this AI chat handles most queries instantly! For complex issues, email support@collancer.in — we respond within 24 hours on business days (Mon-Fri, 9AM-6PM IST). For urgent matters, write URGENT in the subject line. For billing/GST issues: billing@collancer.in. For privacy: privacy@collancer.in. For legal: legal@collancer.in.";

    // ── Privacy / Terms ──
    if (ql.includes("privacy")||ql.includes("data")||ql.includes("my data")||ql.includes("personal info")) return "Collancer's Privacy Policy covers how we collect, use, and protect your data. Key points: we collect booking data, wallet transactions, and usage information; we never sell your data to advertisers; you have rights under India's DPDPA 2023 including access, correction, and deletion. View the full Privacy Policy in the footer of the Discover page or email privacy@collancer.in!";
    if (ql.includes("terms")||ql.includes("terms of service")||ql.includes("terms and condition")||ql.includes("legal")) return "Collancer's Terms of Service cover platform usage, booking rules, cancellation policy, wallet terms, referral programme rules, IP rights, and dispute resolution. Key highlights: you must select accurate promotion categories; creators can reject bookings with instant refunds; Collancer takes 20% platform fee; disputes resolved via arbitration in Bengaluru. View the full Terms in the footer!";

    // ── Recent chats feature ──
    if (ql.includes("recent chat")||ql.includes("chat history")||ql.includes("old chat")||ql.includes("previous chat")||ql.includes("saved chat")) return "Your support chat history is automatically saved! Tap the 📋 History button at the top of this Support page to see all your past chats. You can tap any previous chat to continue it, or tap the 🗑 delete icon to remove it. Each time you start a new chat (via the ✦ New Chat button), the current session is saved to your history. History is stored locally on your device!";

    // ── Thank you ──
    if (ql.includes("thank")||ql.includes("thanks")||ql.includes("great")||ql.includes("awesome")||ql.includes("helpful")||ql.includes("perfect")||ql.includes("ok")||ql.includes("okay")) return "You're welcome! Happy to help anytime. If you have more questions later — about booking, creators, payments, categories, or anything else — just come back to the Support tab. Good luck with your campaign! 🚀";

    // ── Trending / popular ──
    if (ql.includes("trend")||ql.includes("popular")||ql.includes("viral")||ql.includes("hot creator")) return "Our trending creators right now are Priya Sharma (Fashion), Rohan Mehra (Tech), Ananya Singh (Travel), Kabir Khan (Food), Vikram Joshi (Gaming), and Riya Desai (Lifestyle). Trending creators see the fastest engagement growth — book them early before their prices increase!";

    // ── ROI / results ──
    if (ql.includes("roi")||ql.includes("results")||ql.includes("effective")||ql.includes("does it work")||ql.includes("worth it")) return "Collancer creators have delivered proven results: Myntra saw 4× ROI in 7 days with Priya Sharma, OnePlus India got 15K pre-orders from one Rohan Mehra video, Swiggy achieved record app installs through Kabir Khan, and Razer India's campaign with Vikram Joshi went viral in 24 hours. Results vary by niche, brief quality, and timing — a clear, detailed campaign brief significantly improves outcomes!";

    // ── Default ──
    return "I'm your Collancer support assistant and I can help with anything on the platform — bookings, creators, categories, wallet, payments, rejections, dashboard, referrals, privacy, and more. Could you give me a bit more detail about what you need? Or ask me something specific like 'how do I book a creator', 'which creator is best for my fitness brand', or 'how does the wallet work'!";
  };

  const send = async (overrideText) => {
    const text = (overrideText||input).trim();
    if (!text||loading) return;
    setInput("");
    const userMsg = {id:Date.now(), role:"user", text};
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setNewIds(new Set([userMsg.id]));
    setLoading(true);
    await new Promise(r=>setTimeout(r, 600+Math.random()*400));
    const reply = getSupportResponse(text, msgs);
    const botMsg = {id:Date.now()+1, role:"assistant", text:reply};
    const finalMsgs = [...newMsgs, botMsg];
    setMsgs(finalMsgs);
    setNewIds(new Set([botMsg.id]));
    setLoading(false);
    persistChat(finalMsgs);
  };

  const quickQ = ["How do I book a creator?","What are promotion categories?","How does the wallet work?","What if a creator rejects?","Best creator for fashion?","How do I get a refund?","What is the referral commission?"];

  const fmtTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    if (diff < 604800000) return d.toLocaleDateString("en-IN",{weekday:"short"});
    return d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"});
  };

  if (view==="history") return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 124px)",maxWidth:430,width:"100%",margin:"0 auto"}}>
      <div style={{flexShrink:0,background:"linear-gradient(145deg,rgba(16,16,38,.97),rgba(10,10,26,.99))",borderBottom:"1px solid var(--b2)",padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>setView("chat")} style={{background:"rgba(0,229,255,.08)",border:"1px solid rgba(0,229,255,.18)",borderRadius:14,padding:"6px 12px",color:"var(--c)",cursor:"pointer",fontSize:12,fontWeight:700}}>← Back</button>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,flex:1}}>Recent Chats</div>
        <button onClick={startNewChat} style={{background:"linear-gradient(135deg,var(--c),var(--c2))",border:"none",borderRadius:14,padding:"6px 12px",color:"var(--bg)",cursor:"pointer",fontSize:11,fontWeight:800}}>✦ New Chat</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px"}} className="nosb">
        {chatHistory.length===0 ? (
          <div style={{textAlign:"center",padding:"60px 20px",color:"var(--txt2)"}}>
            <div style={{fontSize:40,marginBottom:12,opacity:.3}}>💬</div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>No chat history yet</div>
            <div style={{fontSize:12}}>Your past chats will appear here after you have a conversation</div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {chatHistory.map((chat,i)=>(
              <div key={chat.id} onClick={()=>loadChat(chat)}
                style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:18,
                  padding:"13px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,
                  transition:"all .2s",animation:`fadeUp .3s ${i*.04}s both`}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,229,255,.3)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b)"}>
                <div style={{width:40,height:40,borderRadius:16,flexShrink:0,
                  background:"linear-gradient(135deg,rgba(0,229,255,.15),rgba(124,106,247,.1))",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💬</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:3,
                    whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{chat.snippet}</div>
                  <div style={{fontSize:10,color:"var(--txt2)"}}>{chat.messages.length} messages · {fmtTime(chat.ts)}</div>
                </div>
                <button onClick={(e)=>deleteChat(chat.id,e)}
                  style={{background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.25)",
                    borderRadius:12,padding:"5px 8px",color:"var(--red)",cursor:"pointer",fontSize:12,
                    flexShrink:0,transition:"all .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(248,113,113,.25)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(248,113,113,.1)"}>🗑</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 124px)",maxWidth:430,width:"100%",margin:"0 auto"}}>
      {/* Header */}
      <div style={{flexShrink:0,background:"linear-gradient(145deg,rgba(16,16,38,.97),rgba(10,10,26,.99))",borderBottom:"1px solid var(--b2)",padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:38,height:38,borderRadius:16,background:"linear-gradient(135deg,var(--c),var(--c2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,boxShadow:"0 0 14px rgba(0,229,255,.35)"}}>💬</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:800,lineHeight:1}}>Collancer Support</div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"var(--grn)",animation:"pulse 2s ease infinite",flexShrink:0}}/>
            <span style={{fontSize:10,color:"var(--grn)",fontWeight:600}}>AI Support · Online 24/7</span>
          </div>
        </div>
        <button onClick={()=>{ persistChat(msgs); setView("history"); }}
          style={{background:"rgba(0,229,255,.08)",border:"1px solid rgba(0,229,255,.18)",borderRadius:14,padding:"5px 10px",color:"var(--c)",cursor:"pointer",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
          📋
        </button>
        <button onClick={startNewChat}
          style={{background:"rgba(0,229,255,.08)",border:"1px solid rgba(0,229,255,.18)",borderRadius:14,padding:"5px 10px",color:"var(--c)",cursor:"pointer",fontSize:11,fontWeight:700,flexShrink:0}}>
          ✦ New
        </button>
      </div>

      {/* Messages area */}
      <div ref={msgContainerRef} style={{flex:1,overflowY:"auto",padding:"14px 14px 8px"}} className="nosb">
        {msgs.map(m => <ChatMsg key={m.id} msg={m} isNew={newIds.has(m.id)}/>)}
        {loading && (
          <div style={{display:"flex",alignItems:"flex-end",gap:8,marginBottom:12,animation:"msgIn .3s cubic-bezier(.16,1,.3,1) both"}}>
            <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg,var(--c),var(--c2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>✦</div>
            <div style={{padding:"12px 16px",borderRadius:"4px 18px 18px 18px",background:"linear-gradient(135deg,rgba(0,229,255,.08),rgba(124,106,247,.06))",border:"1px solid rgba(0,229,255,.16)",display:"flex",gap:5,alignItems:"center"}}>
              {[0,1,2].map(i=>(<div key={i} style={{width:7,height:7,borderRadius:"50%",background:"var(--c)",animation:`pulse 1.1s ease ${i*0.22}s infinite`}}/>))}
            </div>
          </div>
        )}
      </div>

      {/* Quick chips */}
      {msgs.length <= 2 && (
        <div style={{padding:"8px 14px",display:"flex",gap:6,flexWrap:"wrap",flexShrink:0,animation:"fadeIn .4s .2s both"}}>
          {quickQ.map(q=>(
            <button key={q} onClick={()=>send(q)} style={{padding:"6px 12px",borderRadius:50,border:"1.5px solid rgba(0,229,255,.22)",background:"rgba(0,229,255,.05)",color:"var(--txt2)",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--c)";e.currentTarget.style.color="var(--c)";e.currentTarget.style.background="var(--cdim)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b2)";e.currentTarget.style.color="var(--txt2)";e.currentTarget.style.background="rgba(0,229,255,.05)"}}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{padding:"10px 14px",borderTop:"1px solid var(--b)",background:"linear-gradient(145deg,rgba(16,16,38,.97),rgba(10,10,26,.99))",flexShrink:0}}>
        <div style={{display:"flex",gap:8,alignItems:"center",background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(0,229,255,.22)",borderRadius:50,padding:"7px 7px 7px 16px"}}>
          <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Ask anything about Collancer…" style={{flex:1,background:"none",border:"none",outline:"none",boxShadow:"none",color:"var(--txt)",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}/>
          <button onClick={()=>send()} disabled={loading||!input.trim()} style={{width:36,height:36,borderRadius:"50%",border:"none",flexShrink:0,background:(!input.trim()||loading)?"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))":"linear-gradient(135deg,var(--c),var(--c2))",display:"flex",alignItems:"center",justifyContent:"center",cursor:(!input.trim()||loading)?"default":"pointer",fontSize:16,color:(!input.trim()||loading)?"var(--txt2)":"var(--bg)",transition:"all .2s",boxShadow:(!input.trim()||loading)?"none":"0 0 12px rgba(0,229,255,.4)"}}>
            {loading?<span style={{fontSize:14,animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>:"↑"}
          </button>
        </div>
      </div>
    </div>
  );
}

  const getSupportResponse = (q, history) => {
    const ql = q.toLowerCase();

    // ── Greetings ──
    if (ql.includes("hello")||ql.includes("hi")||ql.includes("hey")||ql.includes("good morning")||ql.includes("good afternoon")||ql.includes("namaste")) return "Hey there! Great to connect with you. I'm your Collancer support assistant. Whether it's booking help, payment questions, or anything about our creators — I'm here for you. What can I help with today?";

    // ── Booking ──
    if (ql.includes("how do i book")||ql.includes("how to book")||ql.includes("how can i book")||ql.includes("process of book")||ql.includes("booking process")||ql.includes("steps to book")) return "Booking is easy! Go to the Discover page → tap a creator → View Profile → Book Now → choose your promotion type → write your campaign brief → pay via Razorpay or UPI. You'll get an instant confirmation and the creator will deliver within 1-3 working days!";
    if (ql.includes("book")||ql.includes("how do i")||ql.includes("how to")) return "To book a creator, go to the Discover tab, find a creator you like, tap View Profile, then hit the Book Now button. Select your promotion type, add your campaign brief, and complete payment. It takes less than 2 minutes!";

    // ── Cancel / refund ──
    if (ql.includes("cancel")||ql.includes("cancellation")) return "To cancel a booking, please email support@collancer.in with your booking ID and reason. Cancellations made 48+ hours before campaign start get a full refund. Within 48 hours, a 20% cancellation fee applies. We can also arrange a replacement creator if needed!";
    if (ql.includes("refund")||ql.includes("money back")||ql.includes("return money")||ql.includes("get money back")) return "Refunds are processed within 5-7 business days to your original payment method. Full refunds apply for cancellations before campaign start (48+ hours notice). If a creator fails to deliver, you get a 100% refund automatically. Email support@collancer.in with your booking details!";

    // ── Pricing ──
    if (ql.includes("price")||ql.includes("cost")||ql.includes("pricing")||ql.includes("how much")||ql.includes("fee")||ql.includes("charge")||ql.includes("rate")) return "Pricing depends on the creator and promotion type. Story Promotions are cheapest, followed by Reels, YouTube Videos, and Personal Ads (premium). Every creator's profile page shows their exact pricing for each type. You can also filter creators by budget on the Discover page!";

    // ── Payment ──
    if (ql.includes("pay")||ql.includes("payment")||ql.includes("upi")||ql.includes("razorpay")||ql.includes("card")||ql.includes("wallet")||ql.includes("gpay")||ql.includes("phonepe")||ql.includes("paytm")||ql.includes("netbanking")) return "We accept all major Indian payment methods through Razorpay — UPI (GPay, PhonePe, Paytm), credit/debit cards, net banking, and wallets. All transactions are in INR with 256-bit SSL encryption. A GST invoice is auto-generated for every payment!";

    // ── Payment failed ──
    if (ql.includes("payment fail")||ql.includes("payment not")||ql.includes("payment error")||ql.includes("transaction fail")||ql.includes("money deducted")||ql.includes("charged but")) return "Sorry to hear that! If payment failed but money was deducted, it will be automatically refunded within 5-7 business days by Razorpay. If the issue persists, please email support@collancer.in with your transaction ID and we'll resolve it within 24 hours!";

    // ── Invoice / GST ──
    if (ql.includes("invoice")||ql.includes("gst")||ql.includes("receipt")||ql.includes("bill")||ql.includes("tax")) return "A GST-compliant invoice is automatically generated for every booking. You can download it from your Dashboard under the completed campaign. All invoices include GST breakdown and are valid for business expense claims!";

    // ── Referral ──
    if (ql.includes("referral")||ql.includes("earn")||ql.includes("commission")||ql.includes("refer")||ql.includes("invite")||ql.includes("5%")) return "Our referral programme lets you earn 5% of every booking made by businesses you invite. Go to the Referral tab, copy your unique link, and share it. Earnings are paid monthly once campaigns complete — no cap on earnings!";
    if (ql.includes("referral payout")||ql.includes("when do i get paid")||ql.includes("referral earning")||ql.includes("withdraw")) return "Referral earnings are paid out monthly, typically on the 1st of each month, for all completed campaigns from the previous month. Payments go directly to your registered bank account or UPI ID. Minimum payout threshold is ₹500!";

    // ── Creator discovery ──
    if (ql.includes("find creator")||ql.includes("find influencer")||ql.includes("search creator")||ql.includes("which creator")||ql.includes("recommend creator")||ql.includes("suggest")) return `We have ${INFS.length} verified Indian creators across Instagram and YouTube! Use the Discover page filters — niche, platform, city, budget, size, and rating — to find your perfect match. You can also Ask Cleo on the home screen for personalised AI recommendations!`;

    // ── Campaign ──
    if (ql.includes("campaign")||ql.includes("track")||ql.includes("dashboard")||ql.includes("my booking")||ql.includes("status")) return "Track all your campaigns in the Dashboard tab. It shows Active, Pending, and Completed campaigns with reach, spend, and status badges. Click any campaign to see full details. Completed campaigns let you write a review for the creator!";

    // ── Creator not delivering ──
    if (ql.includes("not deliver")||ql.includes("didn't deliver")||ql.includes("creator not")||ql.includes("no response")||ql.includes("missing campaign")||ql.includes("creator late")) return "We're sorry to hear that! If a creator has missed their delivery deadline, please email support@collancer.in immediately with your booking ID. We'll contact the creator within 24 hours and arrange a replacement or issue a full refund if needed!";

    // ── Reviews ──
    if (ql.includes("review")||ql.includes("rating")||ql.includes("feedback")||ql.includes("rate the creator")||ql.includes("write review")) return "After a campaign completes, go to Dashboard and tap the Review button next to it. Give 1-5 stars, write your experience, and select quick tags like Great ROI or On-time. Your review helps other businesses make informed decisions!";

    // ── Account / profile ──
    if (ql.includes("account")||ql.includes("profile")||ql.includes("business name")||ql.includes("change name")||ql.includes("update profile")||ql.includes("edit profile")) return "To update your business profile, go to the Dashboard tab. Tap the Edit button next to your business name to update it, and tap the + button on your avatar to upload a profile photo. Your name and photo appear on all reviews you write!";

    // ── Delete account ──
    if (ql.includes("delete account")||ql.includes("close account")||ql.includes("deactivate")||ql.includes("remove account")) return "To delete your Collancer account, please email support@collancer.in with the subject DELETE ACCOUNT. We'll process it within 7 business days as per the Digital Personal Data Protection Act 2023. Any pending refunds will be processed before deletion!";

    // ── Privacy / data ──
    if (ql.includes("privacy")||ql.includes("data")||ql.includes("personal info")||ql.includes("secure")||ql.includes("gdpr")||ql.includes("dpdp")) return "Collancer takes your data privacy seriously. We comply with India's Digital Personal Data Protection Act 2023. Your data is encrypted, never sold, and used only to facilitate bookings. Read our full Privacy Policy in the app footer, or email privacy@collancer.in for any data requests!";

    // ── Promotion types ──
    if (ql.includes("story")||ql.includes("reel")||ql.includes("video promotion")||ql.includes("personal ad")||ql.includes("promotion type")||ql.includes("promo type")||ql.includes("what type")) return "We offer 4 promotion types: Story (Instagram 24-hr, cheapest), Reel (Instagram permanent, most popular), YouTube Video (mid-roll, 30-60 sec), and Personal Ad (premium cross-platform with full usage rights). Each creator's profile shows their exact price for every type!";

    // ── Delivery time ──
    if (ql.includes("how long")||ql.includes("delivery time")||ql.includes("when will")||ql.includes("how many days")||ql.includes("timeline")||ql.includes("how soon")) return "Creators deliver your promotion within 1-3 working days of booking confirmation. Personal Ad campaigns may take 3-5 days due to scripting and production. You'll receive a notification when your promotion goes live!";

    // ── Multiple bookings ──
    if (ql.includes("multiple")||ql.includes("bulk")||ql.includes("many creator")||ql.includes("several creator")||ql.includes("more than one")) return "You can book multiple creators simultaneously! Just go to each creator's profile and complete separate bookings. All your campaigns will appear in the Dashboard. For bulk campaign packages with special pricing, email sales@collancer.in!";

    // ── Dispute ──
    if (ql.includes("dispute")||ql.includes("complaint")||ql.includes("issue with creator")||ql.includes("bad experience")||ql.includes("poor quality")||ql.includes("not satisfied")) return "We're sorry you had a bad experience! Please email support@collancer.in with your booking ID and a description of the issue. We take all complaints seriously and will investigate within 48 hours. If the content doesn't match the brief, we'll request a revision or issue a refund!";

    // ── How Collancer works ──
    if (ql.includes("how does collancer work")||ql.includes("what is collancer")||ql.includes("about collancer")||ql.includes("explain collancer")) return `Collancer is India's influencer marketplace. Businesses browse ${INFS.length} verified creators, book promotions, pay securely via Razorpay, and track results in the Dashboard. We handle all coordination with creators so you can focus on your campaign. Simple, fast, and results-driven!`;

    // ── Contact ──
    if (ql.includes("contact")||ql.includes("email")||ql.includes("reach")||ql.includes("phone")||ql.includes("number")||ql.includes("whatsapp")) return "You can reach our support team at support@collancer.in — we respond within 24 hours on business days. For urgent issues, add URGENT to your subject line. For sales and bulk enquiries, email sales@collancer.in. We don't have phone support yet but it's coming soon!";

    // ── Thank you ──
    if (ql.includes("thank")||ql.includes("thanks")||ql.includes("great")||ql.includes("awesome")||ql.includes("perfect")||ql.includes("solved")) return "You're very welcome! Happy to help. If you ever have more questions, don't hesitate to reach out. Have a great campaign ahead and may it bring amazing results for your brand! 🚀";

    // ── Default ──
    return "Thanks for reaching out! I didn't quite catch that. Could you rephrase your question? You can ask me about bookings, payments, refunds, creator discovery, campaign tracking, referrals, or account settings. Or email support@collancer.in for anything complex — we respond within 24 hours!";
  };

// ── Toast Notification ─────────────────────────────────
function Toast({ toast }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (toast) { setTimeout(() => setVisible(true), 60); } // 60ms ensures paint before transition starts
    else { setVisible(false); }
  }, [toast]);

  if (!toast) return null;
  return (
    <div style={{
      position:"fixed", top: visible ? 70 : -120,
      left:"50%", transform:"translateX(-50%)",
      width:"calc(100% - 32px)", maxWidth:398,
      zIndex:999,
      transition:"top .45s cubic-bezier(.16,1,.3,1)",
    }}>
      <div style={{
        background:"linear-gradient(180deg,#0d2818 0%,#061510 100%)",
        border:"1px solid #00e676",
        borderRadius:24, padding:"14px 16px",
        display:"flex", alignItems:"center", gap:13,
        position:"relative", overflow:"hidden",
        boxShadow:"0 2px 0 rgba(255,255,255,.08) inset, 0 -2px 0 rgba(0,0,0,.5) inset, 0 20px 60px rgba(0,0,0,.9), 0 4px 16px rgba(0,230,118,.3), 0 1px 0 #00e676",
      }}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:1,
          background:"linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)",pointerEvents:"none"}}/>
        <div style={{
          width:44, height:44, borderRadius:13, flexShrink:0,
          background:"linear-gradient(135deg,#00e676,#00c853)",
          boxShadow:"0 4px 14px rgba(0,230,118,.55), 0 2px 0 rgba(255,255,255,.18) inset",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
        }}>✓</div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:800, color:"#00e676", marginBottom:2}}>Booking Confirmed!</div>
          <div style={{fontSize:12, color:"#9ab8a4", lineHeight:1.4}}>
            Campaign with <span style={{color:"#e8f8ee", fontWeight:600}}>{toast.name}</span> is live.
            {" "}<span style={{color:"#00E5FF", fontFamily:"'DM Mono',monospace"}}>₹{toast.price.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <div style={{position:"absolute", bottom:0, left:0, right:0, height:3,
          borderRadius:"0 0 20px 20px", background:"linear-gradient(145deg,rgba(0,230,118,.18),rgba(0,200,80,.08))", overflow:"hidden"}}>
          <div style={{height:"100%", borderRadius:"0 0 20px 20px",
            background:"linear-gradient(90deg,#00e676,#00c853)",
            animation:"loadbar 4s linear both", boxShadow:"0 0 8px #00e676"}}/>
        </div>
      </div>
    </div>
  );
}

function CreatorLogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="mbg" onClick={e=>e.target===e.currentTarget&&onCancel()}>
      <div className="mbox" style={{padding:28,textAlign:"center",maxWidth:320}}>
        <div style={{width:56,height:56,borderRadius:"50%",margin:"0 auto 16px",
          background:"linear-gradient(145deg,rgba(248,113,113,.16),rgba(220,40,40,.07))",border:"1.5px solid rgba(248,113,113,.32)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>⎋</div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,marginBottom:8}}>Sign Out?</div>
        <div style={{fontSize:13,color:"var(--txt2)",lineHeight:1.6,marginBottom:24}}>
          You'll need to sign in again to access your dashboard and bookings.
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} className="btng"
            style={{flex:1,justifyContent:"center",padding:"12px"}}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            flex:1,padding:"12px",border:"none",borderRadius:50,
            background:"linear-gradient(135deg,#f87171,#dc2626)",
            color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",
            fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
            onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}


// ── Global Styles ─────────────────────────────────────

const MIN_FOLLOWERS = 10000;



function CreatorAuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", handle:"", email:"", password:"", platform:"Instagram", niche:"Fashion", city:"Mumbai" });
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  // NICHES removed — using CREATOR_PROMO_CATEGORIES instead
  const CITIES = ["Mumbai","Delhi","Bengaluru","Hyderabad","Chennai","Kolkata","Jaipur","Pune","Kochi","Ahmedabad"];
  const PLATFORMS = ["Instagram","YouTube","Both"];

  const inp = {background:"rgba(255,255,255,.04)",border:"1px solid rgba(0,229,255,.15)",borderRadius:16,
    padding:"11px 13px",color:"var(--txt)",fontSize:13,outline:"none",
    fontFamily:"'DM Sans',sans-serif",width:"100%",marginBottom:8,transition:"all .2s"};

  const googleSignIn = async () => {
    setGLoading(true); setError("");
    try {
      const { GoogleAuthProvider, signInWithPopup } = window.__authOps;
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      let cred;
      try {
        cred = await signInWithPopup(window.__auth, provider);
      } catch(popupErr) {
        if (popupErr.code === "auth/unauthorized-domain") {
          setError("⚠️ Domain not authorized in Firebase Console. Go to Firebase Console → Authentication → Settings → Authorized domains → Add your domain.");
          setGLoading(false);
          return;
        }
        if (
          popupErr.code === "auth/popup-closed-by-user" ||
          popupErr.code === "auth/cancelled-popup-request" ||
          popupErr.code === "auth/operation-not-supported-in-this-environment"
        ) {
          setGLoading(false);
          return;
        }
        throw popupErr;
      }

      const user = cred.user;
      const { doc, getDoc, setDoc, serverTimestamp } = window.__fsOps;
      const snap = await getDoc(doc(window.__db, "creators", user.uid));
      if (snap.exists()) {
        const safeData = {
          followers:0, ytSubscribers:0, engagement:0, avgViews:0, avgLikes:0,
          reach:0, rating:0, price:0, bio:"", verified:false, trending:false,
          featured:false, tags:[], reviews:[], categories:[],
          prices:{story:0,reel:0,video:0,personalad:0},
          active:false, addedToCollancer:false, verificationStatus:null,
          ytConnected:false, ytTotalViews:0,
          ...snap.data()
        };
        onAuth(user, safeData);
      } else {
        const displayName = user.displayName || "Creator";
        const creatorData = {
          id: user.uid,
          name: displayName,
          handle: "@" + displayName.toLowerCase().replace(/\s+/g,""),
          email: user.email,
          pfp: user.photoURL || "",
          platform: "Instagram", niche: "Fashion", city: "Mumbai",
          followers:0, ytSubscribers:0, engagement:0, rating:0, price:0, bio:"",
          verified:false, trending:false, featured:false, tags:[], reviews:[],
          avgViews:0, avgLikes:0, reach:0, prices:{story:0,reel:0,video:0,personalad:0},
          createdAt: serverTimestamp(), active: false,
          verificationStatus: null, addedToCollancer: false,
        };
        await setDoc(doc(window.__db, "creators", user.uid), creatorData);
        onAuth(user, creatorData);
      }
    } catch(e) {
      if (e.code === "auth/unauthorized-domain") {
        setError("⚠️ Domain not authorized. In Firebase Console → Authentication → Settings → Authorized domains, add the domain this app is hosted on.");
      } else if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") {
        setError(`Google sign-in failed: ${e.message || e.code}`);
      }
    }
    setGLoading(false);
  };

  const submit = async () => {
    if (!form.email||!form.password) { setError("Email and password required"); return; }
    if (mode==="register"&&!form.name) { setError("Full name required"); return; }
    setLoading(true); setError("");
    try {
      const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = window.__authOps;
      if (mode==="register") {
        const cred = await createUserWithEmailAndPassword(window.__auth, form.email, form.password);
        const { doc, setDoc, serverTimestamp } = window.__fsOps;
        const creatorData = {
          id: cred.user.uid, name: form.name,
          handle: form.handle || "@" + form.name.toLowerCase().replace(/\s/g,""),
          email: form.email, platform: form.platform, niche: form.niche, city: form.city,
          followers:0, ytSubscribers:0, engagement:0, rating:0, price:0, bio:"",
          verified:false, trending:false, featured:false, tags:[], reviews:[],
          avgViews:0, avgLikes:0, reach:0, prices:{story:0,reel:0,video:0,personalad:0},
          createdAt: serverTimestamp(), active: false,
          verificationStatus: null, addedToCollancer: false,
        };
        await setDoc(doc(window.__db, "creators", cred.user.uid), creatorData);
        onAuth(cred.user, creatorData);
      } else {
        const cred = await signInWithEmailAndPassword(window.__auth, form.email, form.password);
        const { doc, getDoc } = window.__fsOps;
        const snap = await getDoc(doc(window.__db, "creators", cred.user.uid));
        if (snap.exists()) {
          // Merge with safe defaults so old accounts missing new fields don't crash
          const safeData = {
            followers:0, ytSubscribers:0, engagement:0, avgViews:0, avgLikes:0,
            reach:0, rating:0, price:0, bio:"", verified:false, trending:false,
            featured:false, tags:[], reviews:[], categories:[],
            prices:{story:0,reel:0,video:0,personalad:0},
            active:false, addedToCollancer:false, verificationStatus:null,
            ytConnected:false, ytTotalViews:0,
            ...snap.data()
          };
          onAuth(cred.user, safeData);
        } else {
          setError("No creator account found. Please register.");
        }
      }
    } catch(e) {
      const msgs = {
        "auth/email-already-in-use":"Email already registered.",
        "auth/user-not-found":"No account found. Please register.",
        "auth/wrong-password":"Incorrect password.",
        "auth/invalid-credential":"Invalid email or password.",
        "auth/weak-password":"Password must be 6+ characters.",
      };
      setError(msgs[e.code]||e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:"0 20px",overflow:"hidden",zIndex:1}}>

      {/* Floating orbs */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"8%",left:"10%",width:260,height:260,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(0,229,255,.12) 0%,transparent 70%)",animation:"float 6s ease infinite"}}/>
        <div style={{position:"absolute",bottom:"12%",right:"5%",width:200,height:200,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(124,106,247,.1) 0%,transparent 70%)",animation:"float 8s ease 2s infinite"}}/>
        <div style={{position:"absolute",top:"45%",left:"50%",transform:"translateX(-50%)",
          width:320,height:320,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(0,229,255,.05) 0%,transparent 70%)",animation:"pulse 4s ease infinite"}}/>
      </div>

      {/* Logo */}
      <div style={{textAlign:"center",marginBottom:14,animation:"fadeUp .6s both",position:"relative",zIndex:1}}>
        <div style={{position:"relative",display:"inline-block",marginBottom:10}}>
          <div style={{width:76,height:76,borderRadius:24,
            background:"linear-gradient(135deg,rgba(0,229,255,.18),rgba(124,106,247,.12))",
            border:"1px solid rgba(0,229,255,.35)",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 0 60px rgba(0,229,255,.25),0 0 120px rgba(0,229,255,.1)",
            position:"relative"}}>
            <HomeLogo size={54}/>
            <div style={{position:"absolute",inset:-8,borderRadius:32,
              border:"1.5px solid rgba(0,229,255,.24)",animation:"pulse 2.5s ease infinite"}}/>
            <div style={{position:"absolute",inset:-16,borderRadius:38,
              border:"1px solid rgba(0,229,255,.1)",animation:"pulse 2.5s ease .5s infinite"}}/>
          </div>
        </div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,lineHeight:1,marginBottom:6}}>
          Collancer <span className="glow">Home</span>
        </div>
        <div style={{fontSize:10,color:"var(--txt2)",letterSpacing:3,fontWeight:600}}>CREATOR DASHBOARD</div>
        <div style={{marginTop:10,fontSize:12,color:"var(--txt2)",lineHeight:1.5}}>
          {mode==="login" ? "Welcome back! Sign in to your creator dashboard." : "Join Collancer and get discovered by top Indian brands."}
        </div>
      </div>

      {/* Card */}
      <div style={{width:"100%",maxWidth:380,animation:"fadeUp .6s .12s both",position:"relative",zIndex:1}}>
        <div style={{display:"flex",background:"rgba(255,255,255,.04)",borderRadius:18,padding:4,
          marginBottom:14,gap:4,border:"1px solid rgba(0,229,255,.1)"}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setError("");}}
              style={{flex:1,padding:"9px",border:"none",borderRadius:11,cursor:"pointer",
                fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,transition:"all .25s",
                background:mode===m?"linear-gradient(135deg,var(--c),var(--c2))":"transparent",
                color:mode===m?"#070710":"var(--txt2)",
                boxShadow:mode===m?"0 4px 20px rgba(0,229,255,.3)":"none"}}>
              {m==="login"?"Sign In":"Register"}
            </button>
          ))}
        </div>

        <div style={{background:"rgba(255,255,255,.03)",border:"1.5px solid rgba(0,229,255,.16)",
          borderRadius:24,padding:"16px 18px",backdropFilter:"blur(20px)"}}>
          {mode==="register" && (
            <>
              <div style={{fontSize:10,color:"var(--c)",fontWeight:700,letterSpacing:1.5,marginBottom:12}}>CREATOR INFO</div>
              <input style={inp} placeholder="Full Name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
              <input style={inp} placeholder="@handle (e.g. @priya.sharma)" value={form.handle} onChange={e=>setForm(f=>({...f,handle:e.target.value}))}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                <select style={{...inp,marginBottom:0}} value={form.platform} onChange={e=>setForm(f=>({...f,platform:e.target.value}))}>
                  {PLATFORMS.map(p=><option key={p}>{p}</option>)}
                </select>
                <select style={{...inp,marginBottom:0}} value={form.niche} onChange={e=>setForm(f=>({...f,niche:e.target.value}))}>
                  {CREATOR_PROMO_CATEGORIES.map(c=><option key={c.id} value={c.label}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <select style={inp} value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}>
                {CITIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <div style={{borderTop:"1px solid rgba(0,229,255,.1)",margin:"4px 0 14px"}}/>
              <div style={{fontSize:10,color:"var(--c)",fontWeight:700,letterSpacing:1.5,marginBottom:12}}>ACCOUNT</div>
            </>
          )}
          <input style={inp} placeholder="Email address *" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
          <div style={{position:"relative"}}>
            <input style={{...inp,marginBottom:0,paddingRight:42}} placeholder="Password *"
              type={showPass?"text":"password"} value={form.password}
              onChange={e=>setForm(f=>({...f,password:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&submit()}/>
            <button onClick={()=>setShowPass(v=>!v)} style={{position:"absolute",right:12,top:"50%",
              transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",
              fontSize:14,color:"var(--txt2)",padding:4}}>{showPass?"🙈":"👁"}</button>
          </div>
          {error && (
            <div style={{fontSize:12,color:"var(--red)",marginTop:12,padding:"10px 12px",
              background:"rgba(248,113,113,.08)",borderRadius:14,border:"1px solid rgba(248,113,113,.25)",
              display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:14}}>⚠</span>{error}
            </div>
          )}
          <button onClick={submit} disabled={loading} className="btnp"
            style={{width:"100%",justifyContent:"center",marginTop:12,padding:"12px",
              fontSize:14,boxShadow:"0 8px 32px rgba(0,229,255,.3)"}}>
            {loading?<span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>:mode==="login"?"Sign In →":"Create Account →"}
          </button>

          {/* Divider */}
          <div style={{display:"flex",alignItems:"center",gap:10,margin:"14px 0 10px"}}>
            <div style={{flex:1,height:1,background:"linear-gradient(145deg,rgba(0,229,255,.18),rgba(0,188,212,.08))"}}/>
            <span style={{fontSize:11,color:"var(--txt2)",fontWeight:500,whiteSpace:"nowrap"}}>or continue with</span>
            <div style={{flex:1,height:1,background:"linear-gradient(145deg,rgba(0,229,255,.18),rgba(0,188,212,.08))"}}/>
          </div>

          {/* Google Button */}
          <button onClick={googleSignIn} disabled={gLoading} style={{
            width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            padding:"11px",borderRadius:16,cursor:"pointer",
            background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.14)",
            color:"var(--txt)",fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
            transition:"all .2s",opacity:gLoading?0.7:1}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.12)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}>
            {gLoading
              ? <span style={{animation:"spin 1s linear infinite",display:"inline-block",fontSize:16}}>◌</span>
              : <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                  <path d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 6.6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.2-.1-2.4-.4-3.5z" fill="#FFC107"/>
                  <path d="M6.3 14.7l6.6 4.8C14.6 16 19 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.5 6.6 29.5 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z" fill="#FF3D00"/>
                  <path d="M24 44c5.4 0 10.3-2 14-5.4l-6.5-5.5C29.5 35 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1l-6.6 4.8A20 20 0 0 0 24 44z" fill="#4CAF50"/>
                  <path d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.3 5.5l6.5 5.5C41.9 35.3 44 30 44 24c0-1.2-.1-2.4-.4-3.5z" fill="#1976D2"/>
                </svg>
            }
            {!gLoading && "Continue with Google"}
          </button>
        </div>

        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:16,marginTop:12}}>
          {["🔒 Secure","⚡ Instant","🇮🇳 India's #1"].map(t=>(
            <div key={t} style={{fontSize:10,color:"var(--txt3)"}}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Top Nav ───────────────────────────────────────────
function CreatorNav({ creator, page, setPage, onLogout }) {
  const ini = creator?.name?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() || "CR";
  const colors = ["#00E5FF","#7c6af7","#00e676","#ffab40"];
  const c = colors[(creator?.name?.length||0) % colors.length];

  return (
    <nav style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",
      width:"100%",maxWidth:430,zIndex:100,
      background:"rgba(7,7,16,.97)",backdropFilter:"blur(24px)",
      borderBottom:"1px solid rgba(0,229,255,.1)"}}>
      <div style={{display:"flex",alignItems:"center",height:56,padding:"0 16px",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:9,flex:1}}>
          <div style={{width:30,height:30,borderRadius:13,flexShrink:0,
            background:"linear-gradient(135deg,rgba(0,229,255,.18),rgba(0,229,255,.06))",
            border:"1px solid rgba(0,229,255,.28)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <HomeLogo size={18}/>
          </div>
          <div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:800,lineHeight:1}}>
              Collancer <span className="glow">Home</span>
            </div>
            <div style={{fontSize:7,color:"var(--txt2)",letterSpacing:1.5}}>CREATOR DASHBOARD</div>
          </div>
        </div>
        {/* Creator avatar — no action on click */}
        <div style={{width:32,height:32,borderRadius:13,flexShrink:0,
          background:`linear-gradient(135deg,${c},${c}88)`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:12,fontWeight:700,color:"#fff",fontFamily:"system-ui,sans-serif",
          lineHeight:1,overflow:"visible"}}>
          {creator?.pfp
            ? <img src={creator.pfp} alt="pfp" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:9}}/>
            : ini}
        </div>
      </div>
    </nav>
  );
}

// ── Bottom Tab Bar ────────────────────────────────────
function BottomTabs({ page, setPage, verificationStatus, hasActiveBooking, addedToCollancer }) {
  const verified = verificationStatus === "verified";
  // All tabs except Dashboard + Support are locked until creator is added to Collancer
  const isLive = verified && addedToCollancer;

  // When creator has active booking: only Dashboard + Bookings accessible
  const tabs = [
    { k:"dashboard", l:"Dashboard", locked:false, icon:(a)=>(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="13" width="4" height="8" rx=".6" fill={a?"var(--c)":"#6666aa"}/>
        <rect x="10" y="7" width="4" height="14" rx=".6" fill={a?"var(--c)":"#6666aa"}/>
        <rect x="17" y="10" width="4" height="11" rx=".6" fill={a?"var(--c)":"#6666aa"}/>
      </svg>
    )},
    { k:"bookings", l:"Bookings", locked:!isLive, icon:(a)=>(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="3" stroke={a?"var(--c)":"#6666aa"} strokeWidth="1.8" fill="none"/>
        <path d="M3 9h18" stroke={a?"var(--c)":"#6666aa"} strokeWidth="1.8"/>
        <circle cx="8" cy="14" r="1.5" fill={a?"var(--c)":"#6666aa"}/>
        <circle cx="12" cy="14" r="1.5" fill={a?"var(--c)":"#6666aa"}/>
        <circle cx="16" cy="14" r="1.5" fill={a?"var(--c)":"#6666aa"}/>
      </svg>
    )},
    { k:"profile",  l:"Profile",  locked:!isLive || hasActiveBooking, icon:(a)=>(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={a?"var(--c)":"#6666aa"} strokeWidth="1.8" fill="none"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={a?"var(--c)":"#6666aa"} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </svg>
    )},
    { k:"earnings", l:"Earnings", locked:!isLive || hasActiveBooking, icon:(a)=>(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={a?"var(--c)":"#6666aa"} strokeWidth="1.8" fill="none"/>
        <text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="Arial,sans-serif" fill={a?"var(--c)":"#6666aa"}>₹</text>
      </svg>
    )},
    { k:"support", l:"Support", locked:false, icon:(a)=>(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 4.5h18a1.8 1.8 0 0 1 1.8 1.8v9a1.8 1.8 0 0 1-1.8 1.8H13l-5 4v-4H3a1.8 1.8 0 0 1-1.8-1.8v-9A1.8 1.8 0 0 1 3 4.5z" fill={a?"rgba(0,229,255,.1)":"none"} stroke={a?"var(--c)":"#6666aa"} strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="8.5"  cy="11.5" r="1.3" fill={a?"var(--c)":"#6666aa"}/>
        <circle cx="12"   cy="11.5" r="1.3" fill={a?"var(--c)":"#6666aa"}/>
        <circle cx="15.5" cy="11.5" r="1.3" fill={a?"var(--c)":"#6666aa"}/>
      </svg>
    )},
  ];

  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
      width:"100%",maxWidth:430,zIndex:100,
      background:"rgba(7,7,16,.97)",backdropFilter:"blur(24px)",
      borderTop:"1.5px solid rgba(0,229,255,.18)",
      paddingBottom:"env(safe-area-inset-bottom)",display:"flex"}}>
      {tabs.map(tab=>(
        <button key={tab.k}
          onClick={()=>{ if (!tab.locked) setPage(tab.k); }}
          style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
            justifyContent:"center",gap:4,border:"none",background:"none",
            cursor:tab.locked?"not-allowed":"pointer",padding:"9px 0 7px",position:"relative",
            opacity:tab.locked?0.4:1}}>
          <div style={{width:42,height:32,display:"flex",alignItems:"center",justifyContent:"center",
            borderRadius:14,position:"relative",
            background:page===tab.k?"rgba(0,229,255,.13)":"transparent",
            transform:page===tab.k?"translateY(-2px) scale(1.05)":"scale(1)",
            transition:"all .22s"}}>
            {tab.icon(page===tab.k)}
            {tab.locked && (
              <div style={{position:"absolute",top:2,right:2,fontSize:8,lineHeight:1}}>🔒</div>
            )}
          </div>
          <span style={{fontSize:9,fontWeight:page===tab.k?700:500,letterSpacing:.4,
            color:page===tab.k?"var(--c)":"var(--txt2)"}}>{tab.l}</span>
          {page===tab.k && <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",
            width:18,height:2,borderRadius:"1px 1px 0 0",background:"var(--c)"}}/>}
        </button>
      ))}
    </div>
  );
}

// ── Ad Campaign Page ──────────────────────────────────
function AdCampaignPage({ creator, onBack, onSuccess, withdrawable=0, bookings=[], payouts=[] }) {
  const [selected, setSelected] = useState(2); // default 3 days
  const [step, setStep] = useState(1); // 1=categories, 2=plans, 3=confirm, 4=payment, 5=done
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [form, setForm] = useState({ card:"", exp:"", cvv:"" });
  const [proc, setProc] = useState(false);
  const [activeAd, setActiveAd] = useState(null);

  const inp = {background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:14,
    padding:"11px 13px",color:"var(--txt)",fontSize:13,outline:"none",
    fontFamily:"'DM Sans',sans-serif",width:"100%",transition:"border-color .2s"};

  // Check if creator already has an active ad
  useEffect(() => {
    if (!creator?.id || !window.__fsOps) return;
    const { collection, query, where, onSnapshot } = window.__fsOps;
    const now = Date.now();
    const q = query(collection(window.__db, "adCampaigns"), where("creatorId","==",creator.id));
    const unsub = onSnapshot(q, snap => {
      const ads = snap.docs.map(d=>({id:d.id,...d.data()}));
      const live = ads.find(a => a.status==="active" && a.endsAt > now);
      setActiveAd(live||null);
    }, err => console.error("adCampaigns listener error:", err));
    return () => unsub();
  }, [creator?.id, window.__fsOps ? 1 : 0]);

  const catCount = Math.max(1, selectedCategories.length);
  const basePlan = AD_PLANS[selected];
  const plan = { ...basePlan, price: basePlan.price * catCount };

  const pay = async () => {
    setProc(true);
    await new Promise(r => setTimeout(r, 1800));
    try {
      const { collection, doc, addDoc, updateDoc, serverTimestamp } = window.__fsOps;
      const now = Date.now();
      const endsAt = now + plan.days * 24 * 60 * 60 * 1000;

      // Write ad campaign record (team reads this for adRevenue)
      await addDoc(collection(window.__db, "adCampaigns"), {
        creatorId: creator.id,
        creatorName: creator.name,
        creatorHandle: creator.handle,
        creatorPlatform: creator.platform || "",
        days: plan.days,
        price: plan.price,
        basePricePerCategory: basePlan.price,
        categories: selectedCategories,
        categoryCount: catCount,
        status: "active",
        startedAt: now,
        endsAt,
        createdAt: serverTimestamp(),
      });

      // Also write to adminRevenue so it appears in admin earnings history
      // alongside booking platform fees in a unified feed
      await addDoc(collection(window.__db, "adminRevenue"), {
        type: "ad_revenue",
        creatorId: creator.id,
        creatorName: creator.name,
        creatorHandle: creator.handle,
        days: plan.days,
        price: plan.price,
        categories: selectedCategories,
        categoryCount: catCount,
        platformFee: plan.price,   // full ad price goes to team (not split like bookings)
        totalAmount: plan.price,
        description: `Be On Top — ${creator.name} · ${plan.days} day${plan.days>1?"s":""} · ${catCount} categor${catCount===1?"y":"ies"}`,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(window.__db,"creators",creator.id),{
        boosted: true,
        boostEndsAt: endsAt,
        boostedCategories: selectedCategories,
      });
      await addDoc(collection(window.__db, "creatorNotifs"), {
        creatorId: creator.id,
        type: "ad_success",
        title: "🚀 You're On Top!",
        message: `Your profile is now featured at the top of Collancer for ${plan.days} day${plan.days>1?"s":""}!`,
        days: plan.days,
        endsAt,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch(e) { console.error("Ad save error:", e); }
    setProc(false);
    setStep(5);
  };

  const now = Date.now();
  const remaining = activeAd ? Math.ceil((activeAd.endsAt - now) / (1000*60*60*24)) : 0;

  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px"}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,animation:"fadeUp .5s both"}}>
        <button onClick={step>1&&step<5?()=>setStep(s=>s-1):onBack}
          style={{background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.07)",
            borderRadius:14,width:36,height:36,cursor:"pointer",color:"var(--txt)",fontSize:18,
            display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        <div style={{flex:1,minWidth:0}}>
          <h1 style={{fontSize:22,fontWeight:800,marginBottom:2}}>🚀 Be On Top</h1>
          <p style={{fontSize:12,color:"var(--txt2)"}}>Get discovered first by businesses on Collancer</p>
        </div>
        <button onClick={()=>window.location.reload()}
            style={{background:"rgba(0,229,255,.08)",border:"1.5px solid rgba(0,229,255,.22)",
              borderRadius:50,padding:"5px 12px",color:"var(--c)",cursor:"pointer",
              fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5,
              flexShrink:0,transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,.18)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,229,255,.08)"}>↻ Refresh</button>
      </div>

      {/* Step indicator */}
      <div style={{display:"flex",marginBottom:24,animation:"fadeUp .5s .04s both"}}>
        {["Category","Plans","Confirm","Payment","Done"].map((s,i)=>(
          <div key={s} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{width:26,height:26,borderRadius:"50%",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:11,fontWeight:700,
              background:step>i+1?"var(--c)":step===i+1?"var(--c)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
              color:step>=i+1?"var(--bg)":"var(--txt2)",
              border:step>=i+1?"none":"1px solid var(--b)",
              transition:"all .3s",
              boxShadow:step===i+1?"0 0 14px rgba(0,229,255,.4)":"none"}}>
              {step>i+1?"✓":i+1}
            </div>
            <div style={{fontSize:9,color:step===i+1?"var(--c)":"var(--txt2)",fontWeight:step===i+1?700:400}}>{s}</div>
          </div>
        ))}
      </div>

      {/* Step 1 — Category Selection */}
      {step===1 && (
        <div style={{animation:"fadeIn .3s both"}}>
          <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:22,boxShadow:"0 4px 0 rgba(0,0,0,.42), 0 7px 16px rgba(0,0,0,.46), 0 1px 0 rgba(255,255,255,.05) inset",
            padding:16,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
              <div style={{fontWeight:800,fontSize:13}}>Choose Categories to Be On Top In</div>
              <button
                onClick={()=>setSelectedCategories(
                  selectedCategories.length===CREATOR_PROMO_CATEGORIES.length
                    ? []
                    : CREATOR_PROMO_CATEGORIES.map(c=>c.id)
                )}
                style={{fontSize:11,fontWeight:700,
                  color: selectedCategories.length===CREATOR_PROMO_CATEGORIES.length ? "var(--red)" : "var(--c)",
                  background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif"}}>
                {selectedCategories.length===CREATOR_PROMO_CATEGORIES.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div style={{fontSize:12,color:"var(--txt2)",marginBottom:14,lineHeight:1.6}}>
              Select the categories you want to appear on top in. Each category adds to the price.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {CREATOR_PROMO_CATEGORIES.map(cat => {
                const sel = selectedCategories.includes(cat.id);
                return (
                  <button key={cat.id}
                    onClick={()=>setSelectedCategories(prev=>sel?prev.filter(c=>c!==cat.id):[...prev,cat.id])}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",
                      borderRadius:18,cursor:"pointer",textAlign:"left",
                      border: sel ? "2px solid var(--c)" : "1px solid var(--b)",
                      background: sel ? "rgba(0,229,255,.06)" : "linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                      transition:"all .2s"}}>
                    <div style={{width:34,height:34,borderRadius:14,flexShrink:0,
                      background: sel ? "rgba(0,229,255,.15)" : "rgba(255,255,255,.05)",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>
                      {cat.icon}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:sel?"var(--c)":"var(--txt)"}}>{cat.label}</div>
                    </div>
                    <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,
                      border: sel ? "none" : "2px solid var(--b)",
                      background: sel ? "var(--c)" : "transparent",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:11,color:"#070710",fontWeight:800}}>
                      {sel ? "✓" : ""}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={()=>setStep(2)}
            disabled={selectedCategories.length===0}
            className="btnp"
            style={{width:"100%",justifyContent:"center",fontSize:15,padding:"14px",borderRadius:18,
              opacity:selectedCategories.length===0?0.4:1}}>
            {selectedCategories.length===0 ? "Select at least 1 category" : `Continue with ${selectedCategories.length} categor${selectedCategories.length===1?"y":"ies"} →`}
          </button>
        </div>
      )}

      {/* Step 2 — Plans */}
      {step===2 && (
        <div style={{animation:"fadeIn .3s both"}}>
          {/* Active ad banner */}
          {activeAd && (
            <div style={{background:"linear-gradient(135deg,rgba(0,230,118,.12),rgba(0,230,118,.06))",
              border:"1px solid rgba(0,230,118,.35)",borderRadius:20,padding:"14px 16px",
              marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:24}}>🟢</div>
              <div>
                <div style={{fontWeight:800,fontSize:13,color:"var(--grn)",marginBottom:2}}>Ad Running!</div>
                <div style={{fontSize:11,color:"var(--txt2)"}}>Your profile is on top · {remaining} day{remaining!==1?"s":""} remaining</div>
              </div>
            </div>
          )}

          {/* How it works */}
          <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:22,boxShadow:"0 4px 0 rgba(0,0,0,.42), 0 7px 16px rgba(0,0,0,.46), 0 1px 0 rgba(255,255,255,.05) inset",
            padding:"16px",marginBottom:20}}>
            <div style={{fontWeight:800,fontSize:13,marginBottom:12}}>How it works</div>
            {[
              ["🚀","Instant Visibility","Your profile appears at the very top of Collancer"],
              ["💼","3× More Bookings","Businesses see you first — get more campaign requests"],
              ["⚡","Live Immediately","Goes live the moment payment is confirmed"],
              ["🏷️","Sponsored Badge","Your card shows a Sponsored tag so you stand out"],
            ].map(([icon,title,desc])=>(
              <div key={title} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                <div style={{fontSize:18,flexShrink:0}}>{icon}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:1}}>{title}</div>
                  <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.5}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Duration grid */}
          <div style={{fontWeight:800,fontSize:13,marginBottom:12}}>Choose Duration</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:8}}>
            {AD_PLANS.slice(0,4).map((p,i)=>(
              <button key={i} onClick={()=>setSelected(i)} style={{
                padding:"10px 4px",borderRadius:16,cursor:"pointer",
                border:selected===i?"2px solid var(--c)":"1px solid var(--b)",
                background:selected===i?"rgba(0,229,255,.1)":"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
                position:"relative",transition:"all .2s"}}>
                {p.popular&&<div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",
                  background:"var(--c)",color:"#070710",fontSize:7,fontWeight:800,
                  padding:"2px 6px",borderRadius:50,whiteSpace:"nowrap"}}>POPULAR</div>}
                <div style={{fontSize:13,fontWeight:800,color:selected===i?"var(--c)":"var(--txt)",marginBottom:2}}>{p.label}</div>
                <div style={{fontSize:11,color:"var(--txt2)"}}>₹{p.price}</div>
              </button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
            {AD_PLANS.slice(4).map((p,i)=>(
              <button key={i+4} onClick={()=>setSelected(i+4)} style={{
                padding:"10px 4px",borderRadius:16,cursor:"pointer",
                border:selected===i+4?"2px solid var(--c)":"1px solid var(--b)",
                background:selected===i+4?"rgba(0,229,255,.1)":"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
                transition:"all .2s"}}>
                <div style={{fontSize:13,fontWeight:800,color:selected===i+4?"var(--c)":"var(--txt)",marginBottom:2}}>{p.label}</div>
                <div style={{fontSize:11,color:"var(--txt2)"}}>₹{p.price}</div>
              </button>
            ))}
          </div>

          <button onClick={()=>setStep(3)} className="btnp"
            style={{width:"100%",justifyContent:"center",fontSize:15,padding:"14px",borderRadius:14}}>
            Continue →
          </button>
        </div>
      )}

      {/* Step 3 — Confirm */}
      {step===3 && (
        <div style={{animation:"fadeIn .3s both"}}>
          <div style={{background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",borderRadius:18,padding:17,marginBottom:16}}>
            <div style={{fontSize:10,color:"var(--txt2)",marginBottom:13,fontWeight:700,letterSpacing:1}}>ORDER SUMMARY</div>
            {[
              ["Creator", creator.name],
              ["Handle", creator.handle],
              ["Categories", selectedCategories.length + " categor" + (selectedCategories.length===1?"y":"ies")],
              ["Ad Duration", plan.label],
              ["Daily Rate", `₹${Math.round(plan.price/plan.days)}/day`],
              ["Starts", "Immediately after payment"],
            ].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
                <span style={{color:"var(--txt2)",fontSize:13}}>{k}</span>
                <span style={{fontSize:13,fontWeight:600}}>{v}</span>
              </div>
            ))}
            {selectedCategories.length > 1 && (
              <div style={{fontSize:11,color:"var(--txt2)",marginBottom:8}}>
                {selectedCategories.length} categories × ₹{basePlan.price} = ₹{plan.price}
              </div>
            )}
            <div style={{borderTop:"1.5px solid rgba(255,255,255,.06)",marginTop:11,paddingTop:11,
              display:"flex",justifyContent:"space-between"}}>
              <span style={{fontWeight:700}}>Total</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:19,color:"var(--c)",fontWeight:700}}>₹{plan.price}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep(2)} className="btng" style={{flex:1,justifyContent:"center"}}>← Back</button>
            <button onClick={()=>setStep(4)} className="btnp" style={{flex:2,justifyContent:"center"}}>Payment →</button>
          </div>
        </div>
      )}

      {/* Step 4 — Payment */}
      {step===4 && (
        <div style={{animation:"fadeIn .3s both"}}>

          {/* Withdrawable balance payment option */}
          {(() => {
            const canUseBalance = withdrawable >= plan.price;
            const hasAnyBalance = withdrawable > 0;
            return (
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:.6,marginBottom:8}}>PAY VIA WITHDRAWABLE BALANCE</div>
                <button
                  disabled={!canUseBalance || proc}
                  onClick={canUseBalance ? pay : undefined}
                  style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"14px 16px",borderRadius:18,cursor:canUseBalance?"pointer":"not-allowed",
                    border: canUseBalance
                      ?"2px solid rgba(0,230,118,.5)"
                      :"1px solid rgba(100,100,120,.2)",
                    background: canUseBalance
                      ?"linear-gradient(135deg,rgba(0,230,118,.1),rgba(0,230,118,.04))"
                      :"rgba(40,40,55,.6)",
                    opacity: canUseBalance ? 1 : 0.6,
                    transition:"all .2s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:36,height:36,borderRadius:14,
                      background:canUseBalance?"rgba(0,230,118,.15)":"rgba(80,80,100,.2)",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                      💰
                    </div>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontSize:13,fontWeight:700,
                        color:canUseBalance?"var(--grn)":"var(--txt2)"}}>
                        Withdrawable Balance
                      </div>
                      <div style={{fontSize:11,color:"var(--txt2)",marginTop:1}}>
                        Available: {inr(withdrawable)}
                        {!canUseBalance && hasAnyBalance && (
                          <span style={{color:"var(--red)",marginLeft:6}}>
                            · Insufficient (need {inr(plan.price - withdrawable)} more)
                          </span>
                        )}
                        {!hasAnyBalance && (
                          <span style={{color:"var(--txt3)",marginLeft:6}}>· No balance</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {canUseBalance ? (
                    <span style={{fontSize:12,fontWeight:700,color:"var(--grn)",flexShrink:0}}>
                      {proc
                        ? <span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>
                        : `Pay ${inr(plan.price)}`}
                    </span>
                  ) : (
                    <span style={{fontSize:10,padding:"4px 10px",borderRadius:50,
                      background:"rgba(100,100,120,.2)",color:"var(--txt2)",
                      border:"1px solid rgba(100,100,120,.2)",fontWeight:600,flexShrink:0}}>
                      Insufficient
                    </span>
                  )}
                </button>
              </div>
            );
          })()}

          {/* Divider */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{flex:1,height:1,background:"var(--b)"}}/>
            <span style={{fontSize:10,color:"var(--txt2)",fontWeight:600,letterSpacing:.8}}>OR PAY VIA CARD / UPI</span>
            <div style={{flex:1,height:1,background:"var(--b)"}}/>
          </div>

          <div style={{marginBottom:12,padding:"10px 14px",
            background:"rgba(0,230,118,.05)",border:"1px solid rgba(0,230,118,.2)",
            borderRadius:14,display:"flex",alignItems:"center",gap:8}}>
            <span style={{color:"var(--grn)"}}>🔒</span>
            <span style={{fontSize:12,color:"var(--txt2)"}}>Secure payment · UPI / Cards supported</span>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:6,fontWeight:700,letterSpacing:.6}}>CARD / UPI</div>
            <input value={form.card} onChange={e=>setForm(f=>({...f,card:e.target.value}))}
              placeholder="Card number or UPI ID" style={inp} maxLength={19}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:17}}>
            <div>
              <div style={{fontSize:11,color:"var(--txt2)",marginBottom:6,fontWeight:700,letterSpacing:.6}}>EXPIRY</div>
              <input value={form.exp} onChange={e=>setForm(f=>({...f,exp:e.target.value}))}
                placeholder="MM/YY" style={inp} maxLength={5}/>
            </div>
            <div>
              <div style={{fontSize:11,color:"var(--txt2)",marginBottom:6,fontWeight:700,letterSpacing:.6}}>CVV</div>
              <input value={form.cvv} onChange={e=>setForm(f=>({...f,cvv:e.target.value}))}
                placeholder="···" style={{...inp,fontFamily:"'DM Mono',monospace"}} maxLength={4}/>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setStep(3)} className="btng" style={{flex:1,justifyContent:"center"}}>← Back</button>
            <button onClick={pay} className="btnp"
              style={{flex:2,justifyContent:"center",opacity:proc?0.7:1}}>
              {proc
                ? <span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>
                : `Pay ₹${plan.price}`}
            </button>
          </div>
        </div>
      )}

      {/* Step 5 — Done */}
      {step===5 && (
        <div style={{animation:"fadeIn .3s both",textAlign:"center",padding:"12px 0"}}>
          <div style={{width:70,height:70,borderRadius:"50%",
            background:"linear-gradient(135deg,rgba(124,106,247,.2),rgba(0,229,255,.1))",
            border:"2px solid #7c6af7",display:"flex",alignItems:"center",
            justifyContent:"center",fontSize:30,margin:"0 auto 16px",
            animation:"scaleIn .4s cubic-bezier(.16,1,.3,1)"}}>🚀</div>
          <h3 style={{fontSize:22,fontWeight:800,marginBottom:8}}>You're On Top!</h3>
          <p style={{color:"var(--txt2)",fontSize:13,lineHeight:1.7,marginBottom:24}}>
            Your profile is now live at the very top of Collancer.<br/>
            Businesses will discover you first for the next <strong style={{color:"var(--c)"}}>{plan.days} day{plan.days>1?"s":""}</strong>.
          </p>
          <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1px solid rgba(124,106,247,.3)",
            borderRadius:18,padding:16,marginBottom:20,textAlign:"left"}}>
            {[["Ad Duration",plan.label],["Amount Paid",`₹${plan.price}`],["Status","🟢 Live Now"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:12,color:"var(--txt2)"}}>{k}</span>
                <span style={{fontSize:12,fontWeight:700,color:k==="Status"?"var(--grn)":"var(--txt)"}}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>{ onSuccess({ plan }); }}
            className="btnp" style={{width:"100%",justifyContent:"center",
              background:"linear-gradient(135deg,#7c6af7,#00E5FF)",fontSize:15,padding:"14px",borderRadius:14}}>
            Back to Dashboard ✦
          </button>
        </div>
      )}
    </div>
  );
}

// ── Category Picker ───────────────────────────────────
function CategoryPicker({ selected=[], onChange, max=25 }) {
  return (
    <div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {CREATOR_PROMO_CATEGORIES.map(cat=>{
          const isOn = selected.includes(cat.id);
          return (
            <button key={cat.id} onClick={()=>{
              if (isOn) onChange(selected.filter(c=>c!==cat.id));
              else if (selected.length < max) onChange([...selected, cat.id]);
            }} style={{
              display:"flex",alignItems:"center",gap:5,
              padding:"6px 12px",borderRadius:50,cursor:"pointer",fontSize:12,fontWeight:600,
              border:isOn?"2px solid var(--c)":"1px solid var(--b)",
              background:isOn?"rgba(0,229,255,.12)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
              color:isOn?"var(--c)":"var(--txt2)",
              transition:"all .18s",
              transform:isOn?"scale(1.04)":"scale(1)"}}>
              <span style={{fontSize:14}}>{cat.icon}</span>
              {cat.label}
              {isOn && <span style={{fontSize:10,marginLeft:2}}>✓</span>}
            </button>
          );
        })}
      </div>
      <div style={{fontSize:11,color:"var(--txt2)",marginTop:8}}>
        {selected.length} selected · Select all categories for which you accept promotions
      </div>
    </div>
  );
}

// ── Verification Request Page ─────────────────────────
function VerificationRequestPage({ creator, fbReady, onBack }) {
  const [form, setForm] = useState({
    platform: creator.platform||"Instagram",
    instaHandle: creator.handle||"",
    ytChannel: "",
    followers: "",
    avgViews: "",
    bio: creator.bio||"",
    niche: creator.niche||"Fashion",
    city: creator.city||"Mumbai",
    profileUrl: "",
    categories: Array.isArray(creator.categories) ? creator.categories : [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingStatus, setExistingStatus] = useState(null);
  const [rejectedDoc, setRejectedDoc] = useState(null);   // full rejected request doc
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [resubmitMode, setResubmitMode] = useState(false); // show edit+resubmit form

  // NICHES removed — using CREATOR_PROMO_CATEGORIES instead
  const CITIES = ["Mumbai","Delhi","Bengaluru","Hyderabad","Chennai","Kolkata","Jaipur","Pune","Kochi","Ahmedabad"];
  const PLATFORMS = ["Instagram","YouTube","Both"];

  const inp = {background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:16,
    padding:"11px 14px",color:"var(--txt)",fontSize:13,outline:"none",
    fontFamily:"'DM Sans',sans-serif",width:"100%",transition:"border-color .2s",marginBottom:12};

  useEffect(() => {
    if (!creator?.id || !window.__fsOps || !fbReady) return;
    const { collection, query, where, onSnapshot } = window.__fsOps;
    const q = query(collection(window.__db,"verificationRequests"), where("creatorId","==",creator.id));
    const unsub = onSnapshot(q, snap => {
      if (snap.empty) { setExistingStatus(null); setRejectedDoc(null); return; }
      const docs = snap.docs.map(d=>({id:d.id,...d.data()}));
      if (docs.some(d=>d.status==="verified")) { setExistingStatus("verified"); setRejectedDoc(null); }
      else if (docs.some(d=>d.status==="rejected")) {
        const rdoc = docs.find(d=>d.status==="rejected");
        setExistingStatus("rejected");
        setRejectedDoc(rdoc||null);
      }
      else { setExistingStatus("pending"); setRejectedDoc(null); }
    });
    return () => unsub();
  }, [creator?.id, fbReady]);

  // When entering resubmit mode, pre-fill form from the rejected doc
  const enterResubmitMode = () => {
    if (rejectedDoc) {
      setForm({
        platform:    rejectedDoc.platform    || creator.platform  || "Instagram",
        instaHandle: rejectedDoc.instaHandle || creator.handle    || "",
        ytChannel:   rejectedDoc.ytChannel   || "",
        followers:   rejectedDoc.followers   || "",
        avgViews:    rejectedDoc.avgViews != null ? String(rejectedDoc.avgViews) : "",
        bio:         rejectedDoc.bio         || creator.bio       || "",
        niche:       rejectedDoc.niche       || creator.niche     || "Fashion",
        city:        rejectedDoc.city        || creator.city      || "Mumbai",
        profileUrl:  rejectedDoc.profileUrl  || "",
        categories:  Array.isArray(rejectedDoc.categories) ? rejectedDoc.categories : (Array.isArray(creator.categories) ? creator.categories : []),
      });
    }
    setResubmitMode(true);
  };

  const submit = async () => {
    if (!form.profileUrl.trim()) return;
    if (form.categories.length === 0) { alert("Please select at least one promotion category."); return; }
    if (Number(form.followers) < MIN_FOLLOWERS) { alert("Minimum 10,000 followers required to apply for verification."); return; }
    setSubmitting(true);
    try {
      const { collection, addDoc, doc, updateDoc, serverTimestamp } = window.__fsOps;
      const payload = {
        creatorId: creator.id,
        creatorName: creator.name,
        creatorEmail: creator.email||"",
        platform: form.platform,
        instaHandle: form.instaHandle,
        ytChannel: form.ytChannel,
        followers: form.followers,
        avgViews: Number(form.avgViews) || 0,
        bio: form.bio,
        niche: form.niche,
        city: form.city,
        profileUrl: form.profileUrl,
        categories: form.categories,
        status: "pending",
        submittedAt: serverTimestamp(),
      };
      // If resubmitting, update the existing rejected doc so admin sees it as a fresh pending request
      if (resubmitMode && rejectedDoc?.id) {
        await updateDoc(doc(window.__db,"verificationRequests",rejectedDoc.id), {
          ...payload,
          resubmittedAt: serverTimestamp(),
          previousRejectReason: rejectedDoc.rejectReason || "",
        });
      } else {
        await addDoc(collection(window.__db,"verificationRequests"), payload);
      }
      await updateDoc(doc(window.__db,"creators",creator.id), {
        verificationStatus: "pending",
        platform: form.platform,
        niche: form.niche,
        city: form.city,
        bio: form.bio,
        avgViews: Number(form.avgViews) || 0,
        categories: form.categories,
      });
      setResubmitMode(false);
      setSubmitted(true);
    } catch(e) { console.error(e); }
    setSubmitting(false);
  };

  if (submitted || existingStatus === "pending") {
    return (
      <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.07)",
            borderRadius:14,width:36,height:36,cursor:"pointer",color:"var(--txt)",fontSize:18,
            display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <h1 style={{fontSize:20,fontWeight:800}}>Verification Status</h1>
        </div>
        <div style={{textAlign:"center",padding:"40px 20px",animation:"scaleIn .4s both"}}>
          <div style={{fontSize:60,marginBottom:16}}>⏳</div>
          <div style={{fontWeight:800,fontSize:20,marginBottom:8}}>Under Review</div>
          <div style={{fontSize:13,color:"var(--txt2)",lineHeight:1.8,marginBottom:24}}>
            Your verification request has been submitted.<br/>
            Our team will review your profile and get back to you soon.<br/>
            You'll receive a notification once it's approved.
          </div>
          <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:16,textAlign:"left"}}>
            <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1,marginBottom:12}}>WHAT HAPPENS NEXT</div>
            {[["1","Team reviews your profile details"],["2","Your stats and handle are verified"],["3","You get notified — all features unlock"],["4","You can add yourself to Collancer's creator list"]].map(([n,t])=>(
              <div key={n} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:"var(--cdim)",border:"1.5px solid rgba(0,229,255,.32)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"var(--c)",flexShrink:0}}>{n}</div>
                <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.5,paddingTop:2}}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (existingStatus === "rejected" && !resubmitMode) {
    return (
      <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,animation:"fadeUp .5s both"}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.07)",
            borderRadius:14,width:36,height:36,cursor:"pointer",color:"var(--txt)",fontSize:18,
            display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <h1 style={{fontSize:20,fontWeight:800}}>Verification Rejected</h1>
        </div>

        {/* Big status icon */}
        <div style={{textAlign:"center",marginBottom:24,animation:"scaleIn .4s both"}}>
          <div style={{width:76,height:76,borderRadius:28,margin:"0 auto 14px",
            background:"linear-gradient(135deg,rgba(248,113,113,.2),rgba(248,113,113,.06))",
            border:"2px solid rgba(248,113,113,.4)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>❌</div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,
            color:"var(--red)",marginBottom:6}}>Request Not Approved</div>
          <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.6}}>
            Our team reviewed your profile and could not approve it at this time.
          </div>
        </div>

        {/* Rejection reason box */}
        <div style={{background:"linear-gradient(135deg,rgba(248,113,113,.1),rgba(248,113,113,.04))",
          border:"1px solid rgba(248,113,113,.35)",borderRadius:20,padding:18,marginBottom:20,
          animation:"fadeUp .5s .1s both"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:28,height:28,borderRadius:12,background:"rgba(248,113,113,.2)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>📋</div>
            <div style={{fontSize:12,fontWeight:800,color:"var(--red)",letterSpacing:.4}}>REASON FROM ADMIN</div>
          </div>
          <div style={{fontSize:13,color:"var(--txt)",lineHeight:1.75,
            background:"rgba(0,0,0,.25)",borderRadius:14,padding:"12px 14px",
            border:"1px solid rgba(248,113,113,.2)",fontStyle: rejectedDoc?.rejectReason ? "normal" : "italic"}}>
            {rejectedDoc?.rejectReason || "No specific reason was provided. Please review your details and resubmit."}
          </div>
        </div>

        {/* What to fix tips */}
        <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,
          padding:16,marginBottom:24,animation:"fadeUp .5s .15s both"}}>
          <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1,marginBottom:12}}>COMMON THINGS TO CHECK</div>
          {[
            ["📊","Ensure your follower count is accurate and above 10K"],
            ["🔗","Make sure your profile URL is correct and publicly accessible"],
            ["🎯","Confirm your niche and promotion categories match your content"],
            ["✍️","Update your bio to clearly describe your content and audience"],
          ].map(([icon,text])=>(
            <div key={text} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
              <span style={{fontSize:15,flexShrink:0}}>{icon}</span>
              <span style={{fontSize:12,color:"var(--txt2)",lineHeight:1.5}}>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={enterResubmitMode} className="btnp"
          style={{width:"100%",justifyContent:"center",fontSize:15,padding:"14px",borderRadius:18,
            background:"linear-gradient(135deg,var(--c),var(--c2))",marginBottom:10,animation:"fadeUp .5s .2s both"}}>
          ✏️ Update Details &amp; Resubmit
        </button>
        <button onClick={onBack}
          style={{width:"100%",padding:"13px",background:"none",border:"1.5px solid rgba(255,255,255,.07)",
            borderRadius:18,color:"var(--txt2)",fontSize:13,cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif",transition:"all .2s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor="var(--c)"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b)"}>
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  // ── Resubmit edit form (pre-filled with previous rejected submission) ──
  if (existingStatus === "rejected" && resubmitMode) {
    return (
      <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,animation:"fadeUp .5s both"}}>
          <button onClick={()=>setResubmitMode(false)} style={{background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.07)",
            borderRadius:14,width:36,height:36,cursor:"pointer",color:"var(--txt)",fontSize:18,
            display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <div style={{flex:1,minWidth:0}}>
            <h1 style={{fontSize:20,fontWeight:800,marginBottom:2}}>Update &amp; Resubmit</h1>
            <p style={{fontSize:12,color:"var(--txt2)"}}>Edit your details below and resubmit for review</p>
          </div>
        </div>

        {/* Inline rejection reason reminder */}
        {rejectedDoc?.rejectReason && (
          <div style={{background:"rgba(248,113,113,.07)",border:"1.5px solid rgba(248,113,113,.32)",
            borderRadius:18,padding:"12px 14px",marginBottom:16,animation:"fadeUp .5s .04s both",
            display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:16,flexShrink:0}}>⚠️</span>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"var(--red)",marginBottom:3}}>Admin's reason for rejection:</div>
              <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.6}}>{rejectedDoc.rejectReason}</div>
            </div>
          </div>
        )}

        {/* Platform */}
        <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:16,marginBottom:14,animation:"fadeUp .5s .06s both"}}>
          <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:14}}>YOUR PLATFORM</div>
          <div style={{display:"flex",gap:8}}>
            {PLATFORMS.map(p=>(
              <button key={p} onClick={()=>setForm(f=>({...f,platform:p}))} style={{
                flex:1,padding:"10px 6px",borderRadius:16,cursor:"pointer",fontSize:13,fontWeight:700,
                border:form.platform===p?"2px solid var(--c)":"1px solid var(--b)",
                background:form.platform===p?"rgba(0,229,255,.1)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                color:form.platform===p?"var(--c)":"var(--txt2)",transition:"all .2s"}}>
                {p==="Instagram"?"📸 Insta":p==="YouTube"?"▶ YouTube":"🔗 Both"}
              </button>
            ))}
          </div>
        </div>

        {/* Handle / Channel / URL / Followers / AvgViews */}
        <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:16,marginBottom:14,animation:"fadeUp .5s .09s both"}}>
          <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:14}}>PROFILE DETAILS</div>
          {(form.platform==="Instagram"||form.platform==="Both") && (
            <>
              <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Instagram Handle</div>
              <input value={form.instaHandle} onChange={e=>setForm(f=>({...f,instaHandle:e.target.value}))}
                placeholder="@yourhandle" style={inp}/>
            </>
          )}
          {(form.platform==="YouTube"||form.platform==="Both") && (
            <>
              <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>YouTube Channel Name / URL</div>
              <input value={form.ytChannel} onChange={e=>setForm(f=>({...f,ytChannel:e.target.value}))}
                placeholder="youtube.com/@yourchannel" style={inp}/>
            </>
          )}
          <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Profile / Channel URL *</div>
          <input value={form.profileUrl} onChange={e=>setForm(f=>({...f,profileUrl:e.target.value}))}
            placeholder="https://instagram.com/yourhandle or youtube.com/..." style={inp}/>
          <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>
            Followers / Subscribers Count
            <span style={{color:"var(--amb)",marginLeft:6,fontSize:10,fontWeight:700}}>min. 10K required</span>
          </div>
          <div style={{position:"relative"}}>
            <input value={form.followers} type="number" min="10000"
              onChange={e=>setForm(f=>({...f,followers:e.target.value}))}
              placeholder="e.g. 50000" style={{...inp,paddingRight:80,
                borderColor: form.followers && Number(form.followers) < MIN_FOLLOWERS ? "rgba(248,113,113,.6)" : undefined}}/>
            {form.followers && Number(form.followers) >= 1000 && (
              <div style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",
                fontSize:13,fontWeight:700,pointerEvents:"none",
                color: Number(form.followers) >= MIN_FOLLOWERS ? "var(--grn)" : "var(--red)"}}>
                {fmtK(Number(form.followers))}
              </div>
            )}
          </div>
          {form.followers && Number(form.followers) < MIN_FOLLOWERS && Number(form.followers) > 0 && (
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:-8,marginBottom:12,
              padding:"8px 12px",background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.2)",borderRadius:10}}>
              <span style={{fontSize:12}}>🚫</span>
              <span style={{fontSize:11,color:"var(--red)",lineHeight:1.5}}>
                Minimum 10K followers required. You have {fmtK(Number(form.followers))} — not eligible yet.
              </span>
            </div>
          )}
          <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>Avg Views per Post / Video</span>
            {form.avgViews && Number(form.avgViews) >= 100 && (
              <span style={{fontSize:11,fontWeight:700,color:"var(--c)"}}>{fmtK(Number(form.avgViews))}</span>
            )}
          </div>
          <input value={form.avgViews} type="number" min="0"
            onChange={e=>setForm(f=>({...f,avgViews:e.target.value}))}
            placeholder="e.g. 25000" style={{...inp,marginBottom:0}}/>
          <div style={{fontSize:10,color:"var(--txt2)",marginTop:4,lineHeight:1.5}}>
            Average number of views your posts or videos get
          </div>
        </div>

        {/* About */}
        <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:16,marginBottom:14,animation:"fadeUp .5s .12s both"}}>
          <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:14}}>ABOUT YOU</div>
          <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Bio</div>
          <textarea value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))}
            rows={3} placeholder="Tell businesses about yourself..." style={{...inp,resize:"none"}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div>
              <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Niche / Category</div>
              <select value={form.niche} onChange={e=>setForm(f=>({...f,niche:e.target.value}))}
                style={{...inp,marginBottom:0}}>
                {CREATOR_PROMO_CATEGORIES.map(c=><option key={c.id} value={c.label}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>City</div>
              <select value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}
                style={{...inp,marginBottom:0}}>
                {CITIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Promotion Categories */}
        <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:16,marginBottom:14,animation:"fadeUp .5s .15s both"}}>
          <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:6}}>PROMOTION CATEGORIES *</div>
          <div style={{fontSize:12,color:"var(--txt2)",marginBottom:14,lineHeight:1.6}}>
            Select all categories for which you are willing to do promotions.
          </div>
          <CategoryPicker
            selected={form.categories}
            onChange={cats=>setForm(f=>({...f,categories:cats}))}/>
        </div>

        <button onClick={submit}
          disabled={submitting||!form.profileUrl.trim()||form.categories.length===0||Number(form.followers)<MIN_FOLLOWERS}
          className="btnp"
          style={{width:"100%",justifyContent:"center",fontSize:15,padding:"14px",borderRadius:18,marginBottom:10,
            background:"linear-gradient(135deg,var(--c),var(--c2))",
            opacity:(!form.profileUrl.trim()||submitting||form.categories.length===0||Number(form.followers)<MIN_FOLLOWERS)?0.5:1}}>
          {submitting
            ? <span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>
            : "🚀 Resubmit for Verification"}
        </button>
        <button onClick={()=>setResubmitMode(false)}
          style={{width:"100%",padding:"13px",background:"none",border:"1.5px solid rgba(255,255,255,.07)",
            borderRadius:18,color:"var(--txt2)",fontSize:13,cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif",transition:"all .2s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor="var(--c)"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b)"}>
          Cancel
        </button>
      </div>
    );
  }

  // ── Disclaimer screen ─────────────────────────────────
  if (!disclaimerAccepted) {
    return (
      <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28,animation:"fadeUp .5s both"}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.07)",
            borderRadius:14,width:36,height:36,cursor:"pointer",color:"var(--txt)",fontSize:18,
            display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <h1 style={{fontSize:20,fontWeight:800}}>Before You Apply</h1>
        </div>

        <div style={{animation:"scaleIn .4s both"}}>
          {/* Big icon */}
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{width:80,height:80,borderRadius:28,margin:"0 auto 16px",
              background:"linear-gradient(135deg,rgba(255,171,64,.2),rgba(255,171,64,.06))",
              border:"1px solid rgba(255,171,64,.4)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:38}}>📋</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,marginBottom:6}}>
              Eligibility Requirement
            </div>
            <div style={{fontSize:13,color:"var(--txt2)",lineHeight:1.6}}>
              Read carefully before filling your profile details
            </div>
          </div>

          {/* Main requirement card */}
          <div style={{background:"linear-gradient(135deg,rgba(255,171,64,.12),rgba(255,171,64,.04))",
            border:"2px solid rgba(255,171,64,.5)",borderRadius:24,padding:"22px 20px",
            marginBottom:16,textAlign:"center"}}>
            <div style={{fontSize:11,color:"var(--amb)",fontWeight:700,letterSpacing:2,marginBottom:10}}>
              MINIMUM REQUIREMENT
            </div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:40,fontWeight:800,
              color:"var(--amb)",lineHeight:1,marginBottom:8}}>10K+</div>
            <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>Followers or Subscribers</div>
            <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.7}}>
              Your Instagram followers or YouTube subscribers must be <strong style={{color:"var(--txt)"}}>at least 10,000</strong> to apply for verification and get listed on Collancer.
            </div>
          </div>

          {/* What happens if below 10K */}
          <div style={{background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.2)",
            borderRadius:22,padding:"14px 16px",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:16}}>🚫</span>
              <span style={{fontSize:13,fontWeight:700,color:"var(--red)"}}>Below 10K — Not Eligible</span>
            </div>
            <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.7}}>
              If you enter a follower count below 10,000, your verification request will be <strong style={{color:"var(--red)"}}>automatically denied</strong> and you will not be listed on Collancer.
            </div>
          </div>

          {/* What you get after */}
          <div style={{background:"rgba(0,230,118,.06)",border:"1px solid rgba(0,230,118,.2)",
            borderRadius:22,padding:"14px 16px",marginBottom:28}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{fontSize:16}}>✅</span>
              <span style={{fontSize:13,fontWeight:700,color:"var(--grn)"}}>10K+ — You're Eligible!</span>
            </div>
            {[
              "Get verified and listed on Collancer",
              "Receive bookings from top Indian brands",
              "Earn money from your audience",
              "Access Bookings, Earnings & full dashboard",
            ].map(t => (
              <div key={t} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"var(--grn)",flexShrink:0}}/>
                <span style={{fontSize:12,color:"var(--txt2)"}}>{t}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <button onClick={() => setDisclaimerAccepted(true)} className="btnp"
            style={{width:"100%",justifyContent:"center",fontSize:15,padding:"14px",borderRadius:18,marginBottom:10}}>
            I Have 10K+ Followers — Continue →
          </button>
          <button onClick={onBack}
            style={{width:"100%",padding:"13px",background:"none",border:"1.5px solid rgba(255,255,255,.07)",
              borderRadius:18,color:"var(--txt2)",fontSize:13,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="var(--c)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b)"}>
            I Don't Have 10K Yet — Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,animation:"fadeUp .5s both"}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.07)",
          borderRadius:14,width:36,height:36,cursor:"pointer",color:"var(--txt)",fontSize:18,
          display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        <div style={{flex:1,minWidth:0}}>
          <h1 style={{fontSize:20,fontWeight:800,marginBottom:2}}>Verify Your Profile</h1>
          <p style={{fontSize:12,color:"var(--txt2)"}}>Fill your details — our team will verify and unlock all features</p>
        </div>
        <button onClick={()=>window.location.reload()}
            style={{background:"rgba(0,229,255,.08)",border:"1.5px solid rgba(0,229,255,.22)",
              borderRadius:50,padding:"5px 12px",color:"var(--c)",cursor:"pointer",
              fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5,
              flexShrink:0,transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,.18)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,229,255,.08)"}>↻ Refresh</button>
      </div>

      {/* Platform */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:16,marginBottom:14,animation:"fadeUp .5s .05s both"}}>
        <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:14}}>YOUR PLATFORM</div>
        <div style={{display:"flex",gap:8,marginBottom:0}}>
          {PLATFORMS.map(p=>(
            <button key={p} onClick={()=>setForm(f=>({...f,platform:p}))} style={{
              flex:1,padding:"10px 6px",borderRadius:16,cursor:"pointer",fontSize:13,fontWeight:700,
              border:form.platform===p?"2px solid var(--c)":"1px solid var(--b)",
              background:form.platform===p?"rgba(0,229,255,.1)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
              color:form.platform===p?"var(--c)":"var(--txt2)",transition:"all .2s"}}>
              {p==="Instagram"?"📸 Insta":p==="YouTube"?"▶ YouTube":"🔗 Both"}
            </button>
          ))}
        </div>
      </div>

      {/* Handle / Channel */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:16,marginBottom:14,animation:"fadeUp .5s .08s both"}}>
        <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:14}}>PROFILE DETAILS</div>
        {(form.platform==="Instagram"||form.platform==="Both") && (
          <>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Instagram Handle</div>
            <input value={form.instaHandle} onChange={e=>setForm(f=>({...f,instaHandle:e.target.value}))}
              placeholder="@yourhandle" style={inp}/>
          </>
        )}
        {(form.platform==="YouTube"||form.platform==="Both") && (
          <>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>YouTube Channel Name / URL</div>
            <input value={form.ytChannel} onChange={e=>setForm(f=>({...f,ytChannel:e.target.value}))}
              placeholder="youtube.com/@yourchannel" style={inp}/>
          </>
        )}
        <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Profile / Channel URL *</div>
        <input value={form.profileUrl} onChange={e=>setForm(f=>({...f,profileUrl:e.target.value}))}
          placeholder="https://instagram.com/yourhandle or youtube.com/..." style={inp}/>
        <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>
          Followers / Subscribers Count
          <span style={{color:"var(--amb)",marginLeft:6,fontSize:10,fontWeight:700}}>min. 10K required</span>
        </div>
        <div style={{position:"relative"}}>
          <input value={form.followers} type="number" min="10000"
            onChange={e=>setForm(f=>({...f,followers:e.target.value}))}
            placeholder="e.g. 50000" style={{...inp,paddingRight:80,
              borderColor: form.followers && Number(form.followers) < MIN_FOLLOWERS ? "rgba(248,113,113,.6)" : undefined}}/>
          {form.followers && Number(form.followers) >= 1000 && (
            <div style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",
              fontSize:13,fontWeight:700,pointerEvents:"none",
              color: Number(form.followers) >= MIN_FOLLOWERS ? "var(--grn)" : "var(--red)"}}>
              {fmtK(Number(form.followers))}
            </div>
          )}
        </div>
        {form.followers && Number(form.followers) < MIN_FOLLOWERS && Number(form.followers) > 0 && (
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:-8,marginBottom:12,
            padding:"8px 12px",background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.2)",
            borderRadius:10}}>
            <span style={{fontSize:12}}>🚫</span>
            <span style={{fontSize:11,color:"var(--red)",lineHeight:1.5}}>
              Minimum 10K followers required. You have {fmtK(Number(form.followers))} — not eligible yet.
            </span>
          </div>
        )}

        {/* Avg Views */}
        <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span>Avg Views per Post / Video</span>
          {form.avgViews && Number(form.avgViews) >= 100 && (
            <span style={{fontSize:11,fontWeight:700,color:"var(--c)"}}>{fmtK(Number(form.avgViews))}</span>
          )}
        </div>
        <input value={form.avgViews} type="number" min="0"
          onChange={e=>setForm(f=>({...f,avgViews:e.target.value}))}
          placeholder="e.g. 25000" style={{...inp,marginBottom:0}}/>
        <div style={{fontSize:10,color:"var(--txt2)",marginTop:4,marginBottom:0,lineHeight:1.5}}>
          Average number of views your posts or videos get
        </div>
      </div>

      {/* About */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:16,marginBottom:14,animation:"fadeUp .5s .11s both"}}>
        <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:14}}>ABOUT YOU</div>
        <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Bio</div>
        <textarea value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))}
          rows={3} placeholder="Tell businesses about yourself..." style={{...inp,resize:"none"}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Niche / Category</div>
            <select value={form.niche} onChange={e=>setForm(f=>({...f,niche:e.target.value}))}
              style={{...inp,marginBottom:0}}>
              {CREATOR_PROMO_CATEGORIES.map(c=><option key={c.id} value={c.label}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>City</div>
            <select value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}
              style={{...inp,marginBottom:0}}>
              {CITIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Promotion Categories */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:16,marginBottom:14,animation:"fadeUp .5s .14s both"}}>
        <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:6}}>PROMOTION CATEGORIES *</div>
        <div style={{fontSize:12,color:"var(--txt2)",marginBottom:14,lineHeight:1.6}}>
          Select all categories for which you are willing to do promotions. Businesses can only book you for these categories.
        </div>
        <CategoryPicker
          selected={form.categories}
          onChange={cats=>setForm(f=>({...f,categories:cats}))}/>
      </div>

      <button onClick={submit} disabled={submitting||!form.profileUrl.trim()||form.categories.length===0||Number(form.followers)<MIN_FOLLOWERS} className="btnp"
        style={{width:"100%",justifyContent:"center",fontSize:15,padding:"14px",borderRadius:18,
          opacity:(!form.profileUrl.trim()||submitting||form.categories.length===0||Number(form.followers)<MIN_FOLLOWERS)?0.5:1}}>
        {submitting
          ? <span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>
          : "Submit for Verification →"}
      </button>
      <div style={{fontSize:10,color:"var(--txt2)",textAlign:"center",marginTop:10}}>
        Our team will review your profile within 24 hours
      </div>
    </div>
  );
}

// ── Promotion Types per Platform ──────────────────────
function getPromoTypesForPlatform(platform) {
  if (platform === "Instagram") {
    return [
      { key:"story",     label:"Story Promotion",        icon:"📸", desc:"24-hr Instagram Story with link" },
      { key:"reel",      label:"Reel Promotion",          icon:"🎬", desc:"Permanent Instagram Reel" },
      { key:"personalvideo", label:"Personal Video Promotion", icon:"🎥", desc:"Scripted personal video on your profile" },
    ];
  }
  if (platform === "YouTube") {
    return [
      { key:"video",     label:"YouTube Video Promotion", icon:"▶",  desc:"Mid-roll 30–60 sec ad inside your video" },
      { key:"personalvideo", label:"Personal Video Promotion", icon:"🎥", desc:"Dedicated scripted brand video" },
    ];
  }
  // Both / default
  return [
    { key:"story",     label:"Story Promotion",        icon:"📸", desc:"24-hr Instagram Story with link" },
    { key:"reel",      label:"Reel Promotion",          icon:"🎬", desc:"Permanent Instagram Reel" },
    { key:"video",     label:"YouTube Video Promotion", icon:"▶",  desc:"Mid-roll 30–60 sec ad inside your video" },
    { key:"personalvideo", label:"Personal Video Promotion", icon:"🎥", desc:"Scripted personal video" },
  ];
}

// ── Set Promotions & Prices Modal ─────────────────────
function SetPromotionModal({ creator, onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [prices, setPrices] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const availableTypes = getPromoTypesForPlatform(creator?.platform || "Instagram");

  const toggleType = (key) => {
    setSelectedTypes(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
    setErr("");
  };

  const goStep2 = () => {
    if (selectedTypes.length === 0) { setErr("Please select at least one promotion type."); return; }
    setErr("");
    setStep(2);
  };

  const handleSave = async () => {
    // Validate all selected types have a price > 0
    for (const key of selectedTypes) {
      const val = Number(prices[key] || 0);
      if (!val || val < 1) { setErr(`Please enter a valid price for ${availableTypes.find(t=>t.key===key)?.label}`); return; }
    }
    setSaving(true);
    try {
      // Build prices object — only for selected types
      const finalPrices = {};
      selectedTypes.forEach(key => { finalPrices[key] = Number(prices[key]); });
      await onSave(selectedTypes, finalPrices);
      onClose();
    } catch(e) { setErr("Failed to save. Please try again."); }
    setSaving(false);
  };

  const inp = {
    background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:14,
    padding:"11px 14px",color:"var(--txt)",fontSize:14,outline:"none",
    fontFamily:"'DM Sans',sans-serif",width:"100%",transition:"border-color .2s",
  };

  return (
    <div className="mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mbox" style={{padding:0,overflow:"hidden"}}>
        {/* Header */}
        <div style={{padding:"20px 20px 0",borderBottom:"1px solid var(--b)",paddingBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800}}>
                Set Promotions & Prices
              </div>
              <div style={{fontSize:11,color:"var(--txt2)",marginTop:3}}>
                Configure what you offer before going live on Collancer
              </div>
            </div>
            <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--txt2)",lineHeight:1,padding:4}}>✕</button>
          </div>
          {/* Step indicator */}
          <div style={{display:"flex",gap:0}}>
            {["Select Types","Set Pricing"].map((s,i)=>(
              <div key={s} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:26,height:26,borderRadius:"50%",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:11,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",
                  background:step>i+1?"var(--grn)":step===i+1?"var(--c)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                  color:step>=i+1?"var(--bg)":"var(--txt2)",
                  border:step>=i+1?"none":"1px solid var(--b)",
                  transition:"all .3s",
                  boxShadow:step===i+1?"0 0 14px rgba(0,229,255,.4)":"none"}}>
                  {step>i+1?"✓":i+1}
                </div>
                <div style={{fontSize:10,color:step===i+1?"var(--c)":step>i+1?"var(--grn)":"var(--txt2)",fontWeight:step===i+1?700:400}}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{padding:"18px 20px 20px",overflowY:"auto",maxHeight:"60vh"}} className="nosb">
          {/* ── Step 1: Select Promotion Types ── */}
          {step===1 && (
            <div style={{animation:"fadeUp .35s both"}}>
              <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:4}}>
                PROMOTION TYPES AVAILABLE FOR {(creator?.platform||"INSTAGRAM").toUpperCase()}
              </div>
              <div style={{fontSize:12,color:"var(--txt2)",marginBottom:16,lineHeight:1.6}}>
                Select the types of promotions you want to offer. Only these will be shown to businesses when they book you.
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {availableTypes.map((pt,i)=>{
                  const active = selectedTypes.includes(pt.key);
                  return (
                    <div key={pt.key} onClick={()=>toggleType(pt.key)}
                      style={{
                        borderRadius:22,padding:"14px 16px",cursor:"pointer",
                        background:active?"rgba(0,230,118,.07)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                        border:active?"1px solid rgba(0,230,118,.4)":"1px solid var(--b)",
                        transition:"all .22s",position:"relative",overflow:"hidden",
                        animation:`fadeUp .3s ${i*0.07}s both`,
                        display:"flex",alignItems:"center",gap:14
                      }}>
                      {active && <div style={{position:"absolute",top:0,left:0,right:0,height:2,
                        background:"linear-gradient(90deg,transparent,var(--grn),transparent)"}}/>}
                      {/* Checkbox */}
                      <div style={{width:20,height:20,borderRadius:10,flexShrink:0,
                        background:active?"var(--grn)":"linear-gradient(145deg,rgba(16,16,40,.98),rgba(10,10,26,.99))",
                        border:active?"none":"1px solid var(--b2)",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        transition:"all .2s",fontSize:12,color:"var(--bg)",fontWeight:800}}>
                        {active?"✓":""}
                      </div>
                      <div style={{fontSize:24,flexShrink:0}}>{pt.icon}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,
                          color:active?"var(--grn)":"var(--txt)",marginBottom:2}}>{pt.label}</div>
                        <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.5}}>{pt.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {err && (
                <div style={{marginTop:14,padding:"10px 14px",background:"rgba(248,113,113,.08)",
                  border:"1px solid rgba(248,113,113,.25)",borderRadius:14,fontSize:12,color:"var(--red)",
                  display:"flex",gap:8,alignItems:"center"}}>
                  <span>⚠</span>{err}
                </div>
              )}
              <div style={{marginTop:20}}>
                <button onClick={goStep2} className="btnp" style={{width:"100%",justifyContent:"center",padding:"14px",fontSize:14,
                  background:"linear-gradient(135deg,var(--c),var(--c2))"}}>
                  Next — Set Pricing →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Set Pricing ── */}
          {step===2 && (
            <div style={{animation:"fadeUp .35s both"}}>
              <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:4}}>
                SET YOUR PRICES (INR)
              </div>
              <div style={{fontSize:12,color:"var(--txt2)",marginBottom:18,lineHeight:1.6}}>
                Enter how much you charge per promotion. Businesses will see these when booking you.
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {selectedTypes.map(key=>{
                  const pt = availableTypes.find(t=>t.key===key);
                  if (!pt) return null;
                  return (
                    <div key={key} style={{background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:22,padding:"14px 16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                        <div style={{fontSize:20}}>{pt.icon}</div>
                        <div>
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700}}>{pt.label}</div>
                          <div style={{fontSize:11,color:"var(--txt2)"}}>{pt.desc}</div>
                        </div>
                      </div>
                      <div style={{position:"relative"}}>
                        <div style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",
                          fontSize:16,color:"var(--c)",fontFamily:"'DM Mono',monospace",fontWeight:700,
                          pointerEvents:"none",lineHeight:1}}>₹</div>
                        <input
                          type="number" min="0" placeholder="Enter amount"
                          value={prices[key]||""}
                          onChange={e=>{ setPrices(p=>({...p,[key]:e.target.value})); setErr(""); }}
                          style={{...inp,paddingLeft:32,fontFamily:"'DM Mono',monospace",fontSize:15,fontWeight:700}}
                          onFocus={e=>e.target.style.borderColor="var(--c)"}
                          onBlur={e=>e.target.style.borderColor="var(--b)"}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {err && (
                <div style={{marginTop:14,padding:"10px 14px",background:"rgba(248,113,113,.08)",
                  border:"1px solid rgba(248,113,113,.25)",borderRadius:14,fontSize:12,color:"var(--red)",
                  display:"flex",gap:8,alignItems:"center"}}>
                  <span>⚠</span>{err}
                </div>
              )}
              <div style={{marginTop:20,display:"flex",gap:10}}>
                <button onClick={()=>{setStep(1);setErr("");}} className="btng"
                  style={{flex:1,justifyContent:"center",padding:"13px"}}>
                  ← Back
                </button>
                <button onClick={handleSave} disabled={saving} className="btnp"
                  style={{flex:2,justifyContent:"center",padding:"13px",
                    background:"linear-gradient(135deg,var(--grn),#00c853)",fontSize:14}}>
                  {saving
                    ? <span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>
                    : "💾 Save & Continue"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────
function DashboardPage({ creator, bookings, onOpenBooking, reviews, onBeOnTop, onVerify, onAddToCollancer, onSetPromotions }) {
  const [showSetPromo, setShowSetPromo] = useState(false);
  const [promoSaved, setPromoSaved] = useState(!!(creator.promotionTypes && creator.promotionTypes.length > 0));
  const verificationStatus = creator.verificationStatus || null;
  const addedToCollancer = creator.addedToCollancer || false;
  const pending = bookings.filter(b=>b.status==="Pending").length;
  const active = bookings.filter(b=>b.status==="Active").length;
  const completed = bookings.filter(b=>b.status==="Completed").length;
  const totalEarned = bookings.filter(b=>b.status==="Completed").reduce((s,b)=>s+(b.amount||0),0);
  const recentBookings = bookings.slice(0,3);
  const avgRating = reviews.length>0 ? (reviews.reduce((s,r)=>s+(r.stars||0),0)/reviews.length).toFixed(1) : (creator.rating||0);

  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px"}}>
      <div style={{marginBottom:22,animation:"fadeUp .5s both"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <div style={{fontSize:13,color:"var(--txt2)"}}>Welcome back,</div>
          <button onClick={()=>window.location.reload()}
            style={{background:"rgba(0,229,255,.08)",border:"1.5px solid rgba(0,229,255,.22)",
              borderRadius:50,padding:"5px 12px",color:"var(--c)",cursor:"pointer",
              fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5,
              flexShrink:0,transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,.18)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,229,255,.08)"}>↻ Refresh</button>
        </div>
        <h1 style={{fontSize:24,fontWeight:800,marginBottom:2}}>{creator.name}</h1>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:"var(--txt2)"}}>{creator.handle}</span>
          <span style={{fontSize:11,padding:"2px 8px",borderRadius:50,
            background:"var(--cdim)",color:"var(--c)",border:"1.5px solid rgba(0,229,255,.24)"}}>
            {creator.platform}
          </span>
          {creator.verified && <span style={{fontSize:11,padding:"2px 8px",borderRadius:50,
            background:"rgba(0,230,118,.12)",color:"var(--grn)",border:"1px solid rgba(0,230,118,.2)"}}>✓ Verified</span>}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24,animation:"fadeUp .5s .08s both"}}>
        <StatBox label="TOTAL EARNED" value={totalEarned>0?inr(totalEarned):"₹0"} sub="completed campaigns" color="var(--grn)"/>
        <StatBox label="BOOKINGS" value={String(bookings.length)} sub={`${active} active · ${pending} pending`}/>
        <StatBox label="COMPLETED" value={String(completed)} sub="campaigns done" color="var(--amb)"/>
        <StatBox label="RATING" value={avgRating>0?avgRating+"★":"—"} sub={`${reviews.length} reviews`} color="var(--pur)"/>
      </div>

      {/* Verification status banner */}
      {verificationStatus !== "verified" && (
        <div style={{animation:"fadeUp .5s .1s both",marginBottom:20}}>
          {!verificationStatus && (
            <button onClick={onVerify} style={{
              width:"100%",padding:"16px",borderRadius:22,cursor:"pointer",
              background:"linear-gradient(135deg,rgba(255,171,64,.12),rgba(255,171,64,.05))",
              border:"1px solid rgba(255,171,64,.4)",
              display:"flex",alignItems:"center",gap:14,textAlign:"left",transition:"all .25s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,171,64,.7)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,171,64,.4)"}>
              <div style={{width:46,height:46,borderRadius:18,flexShrink:0,
                background:"linear-gradient(135deg,#ffab40,#ff6f00)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🔒</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,fontSize:15,marginBottom:3,color:"var(--amb)"}}>Verify Your Profile</div>
                <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.5}}>Features are locked until our team verifies your account · Tap to request</div>
              </div>
              <div style={{fontSize:18,color:"rgba(255,171,64,.7)",flexShrink:0}}>›</div>
            </button>
          )}
          {verificationStatus === "pending" && (
            <div style={{background:"linear-gradient(135deg,rgba(0,229,255,.08),rgba(0,229,255,.04))",
              border:"1.5px solid rgba(0,229,255,.28)",borderRadius:22,padding:"16px",
              display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:46,height:46,borderRadius:18,flexShrink:0,
                background:"rgba(0,229,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>⏳</div>
              <div>
                <div style={{fontWeight:800,fontSize:15,marginBottom:3,color:"var(--c)"}}>Verification Pending</div>
                <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.5}}>Our team is reviewing your profile · Features unlock once approved</div>
              </div>
            </div>
          )}
          {verificationStatus === "rejected" && (
            <button onClick={onVerify} style={{
              width:"100%",padding:"16px",borderRadius:22,cursor:"pointer",
              background:"linear-gradient(135deg,rgba(248,113,113,.1),rgba(248,113,113,.04))",
              border:"1px solid rgba(248,113,113,.35)",
              display:"flex",alignItems:"center",gap:14,textAlign:"left",transition:"all .25s"}}>
              <div style={{width:46,height:46,borderRadius:18,flexShrink:0,
                background:"rgba(248,113,113,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>❌</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,fontSize:15,marginBottom:3,color:"var(--red)"}}>Verification Rejected</div>
                <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.5}}>Please update your details and resubmit · Tap to resubmit</div>
              </div>
              <div style={{fontSize:18,color:"rgba(248,113,113,.7)",flexShrink:0}}>›</div>
            </button>
          )}
        </div>
      )}

      {/* ── Verified: Set Promotions & Prices → then Add Me to Collancer ── */}
      {verificationStatus === "verified" && !addedToCollancer && (
        <div style={{animation:"fadeUp .5s .1s both",marginBottom:20}}>
          {/* Step A: Set Promotions & Prices (if not yet saved) */}
          {!promoSaved && (
            <button onClick={()=>setShowSetPromo(true)} style={{
              width:"100%",padding:"16px",borderRadius:22,cursor:"pointer",
              background:"linear-gradient(135deg,rgba(0,229,255,.12),rgba(124,106,247,.06))",
              border:"1px solid rgba(0,229,255,.4)",
              display:"flex",alignItems:"center",gap:14,textAlign:"left",transition:"all .25s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,229,255,.7)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(0,229,255,.4)"}>
              <div style={{width:46,height:46,borderRadius:18,flexShrink:0,
                background:"linear-gradient(135deg,var(--c),var(--c2))",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🏷️</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,fontSize:15,marginBottom:3,color:"var(--c)"}}>Set Promotions & Prices</div>
                <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.5}}>
                  Profile verified ✓ · Set what you offer before going live on Collancer
                </div>
              </div>
              <div style={{fontSize:18,color:"rgba(0,229,255,.7)",flexShrink:0}}>›</div>
            </button>
          )}

          {/* Step B: Add Me to Collancer (after promotions saved) */}
          {promoSaved && (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {/* Promotions saved confirmation chip */}
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                background:"rgba(0,230,118,.06)",border:"1px solid rgba(0,230,118,.2)",
                borderRadius:12}}>
                <span style={{fontSize:16}}>✅</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--grn)"}}>Promotions & Pricing saved!</div>
                  <div style={{fontSize:11,color:"var(--txt2)"}}>
                    {(creator.promotionTypes||[]).length} type{(creator.promotionTypes||[]).length!==1?"s":""} selected ·{" "}
                    <button onClick={()=>setShowSetPromo(true)} style={{background:"none",border:"none",color:"var(--c)",
                      cursor:"pointer",fontSize:11,padding:0,fontFamily:"'DM Sans',sans-serif",textDecoration:"underline"}}>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={onAddToCollancer} style={{
                width:"100%",padding:"16px",borderRadius:22,cursor:"pointer",
                background:"linear-gradient(135deg,rgba(0,230,118,.12),rgba(0,230,118,.05))",
                border:"1px solid rgba(0,230,118,.4)",
                display:"flex",alignItems:"center",gap:14,textAlign:"left",transition:"all .25s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,230,118,.7)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(0,230,118,.4)"}>
                <div style={{width:46,height:46,borderRadius:18,flexShrink:0,
                  background:"linear-gradient(135deg,#00e676,#00c853)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🚀</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:800,fontSize:15,marginBottom:3,color:"var(--grn)"}}>Add Me to Collancer</div>
                  <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.5}}>Tap to go live and appear in the Collancer creators list</div>
                </div>
                <div style={{fontSize:18,color:"rgba(0,230,118,.7)",flexShrink:0}}>›</div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SetPromotionModal */}
      {showSetPromo && (
        <SetPromotionModal
          creator={creator}
          onClose={()=>setShowSetPromo(false)}
          onSave={async(types, priceMap)=>{
            await onSetPromotions(types, priceMap);
            setPromoSaved(true);
          }}
        />
      )}

      {verificationStatus === "verified" && addedToCollancer && (
        <div style={{background:"linear-gradient(135deg,rgba(0,230,118,.08),rgba(0,230,118,.04))",
          border:"1px solid rgba(0,230,118,.25)",borderRadius:22,padding:"14px 16px",
          marginBottom:20,display:"flex",alignItems:"center",gap:12,animation:"fadeUp .5s .1s both"}}>
          <div style={{fontSize:22}}>🌟</div>
          <div>
            <div style={{fontWeight:800,fontSize:13,color:"var(--grn)",marginBottom:2}}>Live on Collancer!</div>
            <div style={{fontSize:11,color:"var(--txt2)"}}>Your profile is visible to businesses on Collancer</div>
          </div>
        </div>
      )}

      {/* Active booking lock banner */}
      {bookings.some(b=>b.status==="Active"||b.status==="PendingCompletion") && (
        <div style={{background:"linear-gradient(135deg,rgba(0,229,255,.1),rgba(0,229,255,.04))",
          border:"1px solid rgba(0,229,255,.35)",borderRadius:22,padding:"16px",
          marginBottom:20,display:"flex",alignItems:"center",gap:14,animation:"fadeUp .5s .1s both"}}>
          <div style={{width:46,height:46,borderRadius:18,flexShrink:0,
            background:"rgba(0,229,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📋</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:3,color:"var(--c)"}}>
              {bookings.some(b=>b.status==="PendingCompletion") ? "⏳ Awaiting Team Verification" : "🔒 Promotion In Progress"}
            </div>
            <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.6}}>
              {bookings.some(b=>b.status==="PendingCompletion")
                ? "Your completion request is under review. Profile & Earnings unlock once our team approves."
                : "Profile & Earnings are locked until you complete the active promotion. Go to Bookings to manage it."}
            </div>
          </div>
        </div>
      )}
      {false && (
        <div style={{background:"linear-gradient(135deg,rgba(255,171,64,.08),rgba(255,171,64,.04))",
          border:"1px solid rgba(255,171,64,.25)",borderRadius:20,padding:16,marginBottom:20,animation:"fadeUp .5s .12s both"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{fontSize:18}}>⚡</span>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,color:"var(--amb)"}}>Complete your profile</div>
          </div>
          <div style={{fontSize:12,color:"var(--txt2)"}}>Businesses can only see and book you once your profile is complete.</div>
        </div>
      )}

      {/* Be On Top CTA — only available when live on Collancer */}
      {verificationStatus === "verified" && addedToCollancer && (
      <div style={{animation:"fadeUp .5s .14s both",marginBottom:20}}>
        <button onClick={onBeOnTop} style={{
          width:"100%",padding:"16px",borderRadius:22,cursor:"pointer",
          background:"linear-gradient(135deg,rgba(124,106,247,.15),rgba(0,229,255,.08))",
          border:"1px solid rgba(124,106,247,.4)",
          display:"flex",alignItems:"center",gap:14,textAlign:"left",
          transition:"all .25s",position:"relative",overflow:"hidden"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(124,106,247,.7)";e.currentTarget.style.transform="translateY(-2px)"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(124,106,247,.4)";e.currentTarget.style.transform="translateY(0)"}}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(124,106,247,.05),transparent)",pointerEvents:"none"}}/>
          <div style={{width:46,height:46,borderRadius:18,flexShrink:0,
            background:"linear-gradient(135deg,#7c6af7,#00E5FF)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🚀</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:800,fontSize:15,marginBottom:3,color:"var(--txt)"}}>Be On Top</div>
            <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.5}}>Appear on top in Collancer · Get 3× more bookings</div>
          </div>
          <div style={{fontSize:18,color:"rgba(124,106,247,.7)",flexShrink:0}}>›</div>
        </button>
      </div>
      )}



      {/* Reviews section */}
      {reviews.length>0 && (
        <div style={{animation:"fadeUp .5s .2s both"}}>
          <h2 style={{fontSize:17,fontWeight:800,marginBottom:14}}>Reviews from Businesses</h2>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {reviews.slice(0,5).map((r,i)=>(
              <div key={i} style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:22,padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700}}>{r.user||"Business"}</div>
                  <div style={{color:"var(--amb)",fontSize:13}}>{"★".repeat(r.stars||0)}</div>
                </div>
                {r.text&&<div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.6}}>{r.text}</div>}
                {r.tags?.length>0&&<div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}>
                  {r.tags.map(t=><span key={t} style={{fontSize:10,padding:"2px 8px",borderRadius:50,
                    background:"var(--cdim)",color:"var(--c)",border:"1px solid rgba(0,229,255,.15)"}}>{t}</span>)}
                </div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Booking Detail Modal ──────────────────────────────
function BookingDetailModal({ booking, onClose, onStatusChange }) {
  const sc = {Active:"var(--grn)",Completed:"var(--amb)",PendingCompletion:"#a78bfa",Pending:"var(--pur)",Cancelled:"var(--red)"};
  const status = booking.status||"Pending";
  const [updating, setUpdating] = React.useState(false);
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState("");
  const [rejecting, setRejecting] = React.useState(false);
  const [driveLink, setDriveLink] = React.useState(booking.promotedVideoLink||"");
  const [sendingLink, setSendingLink] = React.useState(false);
  const [linkSent, setLinkSent] = React.useState(false);
  const [showResubmit, setShowResubmit] = React.useState(!!(booking.adminRejected));
  const [resubmitLink, setResubmitLink] = React.useState(booking.promotedVideoLink||"");
  const [resubmitting, setResubmitting] = React.useState(false);
  const [mediaPreview, setMediaPreview] = React.useState(null); // {url, type, name}
  const hasBusinessMedia = !!(booking.mediaFiles && booking.mediaFiles.length > 0);

  const isPersonalAd = (booking.promoType||booking.promoLabel||"").toLowerCase().includes("personal");
  const isPro = booking.bizIsPro === true;
  const bizInitials = (booking.bizName||"B").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  React.useEffect(() => {
    if (booking.personalAdApproved && !booking.driveLinkSentToBiz) {
      // prompt is handled inline
    }
  }, [booking.personalAdApproved, booking.driveLinkSentToBiz]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const { doc, updateDoc, addDoc, collection, serverTimestamp } = window.__fsOps;
      if (newStatus === "Completed") {
        if (!driveLink.trim()) {
          alert(isPersonalAd ? "Please enter your Google Drive link first." : "Please enter your promoted content link first.");
          setUpdating(false); return;
        }
        await updateDoc(doc(window.__db, "bookings", booking.id), {
          status: "PendingCompletion",
          completionRequestedAt: serverTimestamp(),
          promotedVideoLink: driveLink.trim(),
          ...(hasBusinessMedia ? { referenceMediaFiles: booking.mediaFiles } : {}),
          adminRejected: false,
          adminRejectionReason: null,
        });
        onStatusChange(booking.id, "PendingCompletion");
        await addDoc(collection(window.__db, "adminNotifs"), {
          type: "completion_request",
          bookingId: booking.id,
          creatorId: booking.creatorId,
          creatorName: booking.creatorName,
          bizName: booking.bizName,
          amount: booking.amount || 0,
          promoType: booking.promoLabel || booking.promoType,
          isPersonalAd,
          driveLink: driveLink.trim(),
          ...(hasBusinessMedia ? { referenceMediaFiles: booking.mediaFiles } : {}),
          read: false,
          createdAt: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(window.__db, "bookings", booking.id), { status: newStatus });
        onStatusChange(booking.id, newStatus);
      }
    } catch(e) { console.error(e); }
    setUpdating(false);
  };

  const sendDriveLinkToBusiness = async () => {
    if (!driveLink.trim()) return;
    setSendingLink(true);
    try {
      const { doc, updateDoc, addDoc, collection, serverTimestamp } = window.__fsOps;
      await addDoc(collection(window.__db, "bizNotifs"), {
        bizId: booking.bizId || "",
        type: "drive_link_shared",
        driveLink: driveLink.trim(),
        creatorName: booking.creatorName || "",
        bookingId: booking.id,
        read: false,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(window.__db, "bookings", booking.id), {
        status: "Completed",
        paymentApproved: true,
        driveLink: driveLink.trim(),
        driveLinkSentToBiz: true,
        completionApprovedAt: serverTimestamp(),
      });
      await addDoc(collection(window.__db, "adminRevenue"), {
        type: "platform_fee", bookingId: booking.id,
        creatorName: booking.creatorName, bizName: booking.bizName,
        totalAmount: booking.amount||0, platformFee: Math.round((booking.amount||0)*.2),
        createdAt: serverTimestamp(),
      });
      onStatusChange(booking.id, "Completed");
      setLinkSent(true);
    } catch(e) { console.error("sendDriveLink error:", e); }
    setSendingLink(false);
  };

  const resubmitCompletion = async () => {
    if (!resubmitLink.trim()) return;
    setResubmitting(true);
    try {
      const { doc, updateDoc, addDoc, collection, serverTimestamp } = window.__fsOps;
      await updateDoc(doc(window.__db, "bookings", booking.id), {
        status: "PendingCompletion",
        adminRejected: false,
        adminRejectionReason: null,
        promotedVideoLink: resubmitLink.trim(),
        ...(hasBusinessMedia ? { referenceMediaFiles: booking.mediaFiles } : {}),
        completionRequestedAt: serverTimestamp(),
      });
      onStatusChange(booking.id, "PendingCompletion");
      await addDoc(collection(window.__db, "adminNotifs"), {
        type: "completion_request",
        bookingId: booking.id,
        creatorId: booking.creatorId,
        creatorName: booking.creatorName,
        bizName: booking.bizName,
        amount: booking.amount || 0,
        promoType: booking.promoLabel || booking.promoType,
        isPersonalAd,
        driveLink: resubmitLink.trim(),
        ...(hasBusinessMedia ? { referenceMediaFiles: booking.mediaFiles } : {}),
        isResubmission: true,
        read: false,
        createdAt: serverTimestamp(),
      });
      setShowResubmit(false);
    } catch(e) { console.error("resubmit error:", e); }
    setResubmitting(false);
  };

  const rejectBooking = async () => {
    if (!rejectReason.trim()) return;
    setRejecting(true);
    try {
      const { doc, updateDoc, addDoc, collection, serverTimestamp } = window.__fsOps;
      await updateDoc(doc(window.__db, "bookings", booking.id), {
        status: "Cancelled",
        rejectionReason: rejectReason.trim(),
        rejectedAt: serverTimestamp(),
        rejectedByCreator: true,
      });
      onStatusChange(booking.id, "Cancelled");
      await addDoc(collection(window.__db, "bizNotifs"), {
        bizId: booking.bizId || "",
        type: "booking_rejected",
        icon: "❌",
        title: "Booking Rejected",
        text: `${booking.creatorName} rejected your ${booking.promoLabel||booking.promoType} booking. Reason: ${rejectReason.trim()}. Full refund of ${booking.amount||0} has been initiated.`,
        bookingId: booking.id,
        creatorName: booking.creatorName,
        amount: booking.amount || 0,
        rejectionReason: rejectReason.trim(),
        refundInitiated: true,
        read: false,
        createdAt: serverTimestamp(),
      });
      if (booking.bizId) {
        const bizRef = doc(window.__db, "businesses", booking.bizId);
        const { getDoc } = window.__fsOps;
        const bizSnap = await getDoc(bizRef);
        if (bizSnap.exists()) {
          const currentWallet = bizSnap.data().walletBalance || 0;
          await updateDoc(bizRef, { walletBalance: currentWallet + (booking.amount || 0) });
        }
      }
      setShowRejectModal(false);
      onClose();
    } catch(e) { console.error("rejectBooking error:", e); }
    setRejecting(false);
  };

  const rows = [
    ["Business", booking.bizName],
    ["Promotion Type", booking.promoLabel || booking.promoType],
    ["Promotion Category", booking.promotionCategory || "—"],
    ["Amount", booking.amount ? "₹" + Number(booking.amount).toLocaleString("en-IN") : "—"],
    ["Duration", booking.duration || "7 days"],
    ["Period", `${booking.start||"—"} → ${booking.end||"—"}`],
    ["Platform", booking.creatorPlatform],
    ...(booking.productName?[["Product / Service", booking.productName]]:[]),
    ...(booking.targetAudience?[["Target Audience", booking.targetAudience]]:[]),
    ...(booking.hashtags?[["Hashtags", booking.hashtags]]:[]),
    ...(booking.rejectionReason?[["Rejection Reason", booking.rejectionReason]]:[]),
  ].filter(([,v])=>v && v!=="—");

  return (
    <>
    <div className="mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="mbox" style={{padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800}}>Booking Details</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--txt2)",lineHeight:1}}>✕</button>
        </div>

        {/* Business identity with Pro badge */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,
          padding:"12px 14px",borderRadius:18,
          background:isPro?"linear-gradient(135deg,rgba(156,106,247,.1),rgba(255,171,64,.05))":"rgba(255,255,255,.03)",
          border:isPro?"1px solid rgba(156,106,247,.3)":"1px solid var(--b)",
          position:"relative",overflow:"hidden"}}>
          {isPro && <div style={{position:"absolute",top:0,left:0,right:0,height:2,
            background:"linear-gradient(90deg,transparent,#9c6af7,#ffab40,transparent)"}}/>}
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:44,height:44,borderRadius:13,overflow:"hidden",
              background:"linear-gradient(135deg,var(--c),var(--c2))",
              display:"flex",alignItems:"center",justifyContent:"center",
              border:isPro?"2px solid rgba(156,106,247,.5)":"2px solid rgba(0,229,255,.25)",
              boxShadow:isPro?"0 0 16px rgba(156,106,247,.4)":"0 0 8px rgba(0,229,255,.15)"}}>
              {booking.bizPfp
                ? <img src={booking.bizPfp} alt={booking.bizName} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                : <span style={{fontSize:15,fontWeight:700,color:"var(--bg)",fontFamily:"system-ui"}}>{bizInitials}</span>
              }
            </div>
            {isPro && (
              <div style={{position:"absolute",bottom:-3,right:-3,width:17,height:17,borderRadius:"50%",
                background:"linear-gradient(135deg,#9c6af7,#ffab40)",border:"2px solid rgba(10,10,26,.99)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,
                boxShadow:"0 0 8px rgba(156,106,247,.6)",animation:"proBadge 1.8s ease infinite"}}>⚡</div>
            )}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:800,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {booking.bizName||"Business"}
              </div>
              {isPro && (
                <span style={{flexShrink:0,padding:"2px 8px",borderRadius:50,fontSize:9,fontWeight:800,
                  background:"linear-gradient(135deg,#9c6af7,#ffab40)",color:"#fff",
                  fontFamily:"'Plus Jakarta Sans',sans-serif"}}>⚡ PRO</span>
              )}
            </div>
            <div style={{fontSize:11,color:"var(--txt2)"}}>
              {booking.promoLabel||booking.promoType}
            </div>
          </div>
          <span className="badge" style={{
            background:`${sc[status]||"var(--pur)"}18`,color:sc[status]||"var(--pur)",
            border:`1px solid ${sc[status]||"var(--pur)"}33`,fontSize:10,flexShrink:0}}>
            {status==="PendingCompletion"?"Awaiting":status}
          </span>
        </div>

        {/* Admin rejection + resubmit */}
        {booking.adminRejected && booking.adminRejectionReason && (
          <div style={{marginBottom:14,padding:"14px",borderRadius:18,
            background:"rgba(248,113,113,.08)",border:"1.5px solid rgba(248,113,113,.32)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:18}}>❌</span>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:800,color:"var(--red)"}}>
                Completion Rejected by Team
              </div>
            </div>
            <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.7,marginBottom:12}}>
              <strong style={{color:"var(--txt)"}}>Reason:</strong> {booking.adminRejectionReason}
            </div>
            {!showResubmit ? (
              <button onClick={()=>setShowResubmit(true)}
                style={{width:"100%",padding:"10px",border:"none",borderRadius:16,
                  background:"linear-gradient(135deg,#f87171,#dc2626)",color:"#fff",
                  fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                ↺ Resubmit Completion Request
              </button>
            ) : (
              <div style={{animation:"fadeUp .3s both"}}>
                <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,marginBottom:6}}>
                  {isPersonalAd?"NEW GOOGLE DRIVE LINK":"NEW VIDEO LINK"}<span style={{color:"var(--red)"}}> *</span>
                </div>
                <input value={resubmitLink} onChange={e=>setResubmitLink(e.target.value)}
                  placeholder={isPersonalAd?"https://drive.google.com/...":"Paste valid link..."}
                  style={{width:"100%",background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(248,113,113,.32)",
                    borderRadius:14,padding:"10px 13px",color:"var(--txt)",fontSize:13,
                    outline:"none",fontFamily:"'DM Sans',sans-serif",marginBottom:8}}/>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setShowResubmit(false)}
                    style={{flex:1,padding:"9px",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:14,
                      background:"none",color:"var(--txt2)",cursor:"pointer",fontSize:12}}>Cancel</button>
                  <button onClick={resubmitCompletion} disabled={resubmitting||!resubmitLink.trim()}
                    style={{flex:2,padding:"9px",border:"none",borderRadius:14,
                      background:"linear-gradient(135deg,var(--amb),#e65100)",color:"#fff",
                      fontSize:12,fontWeight:700,cursor:"pointer",
                      opacity:resubmitting||!resubmitLink.trim()?0.5:1,
                      fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                    {resubmitting?"…":"↺ Resubmit →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Details table */}
        <div style={{display:"flex",flexDirection:"column",gap:0,marginBottom:14,
          background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",borderRadius:16,overflow:"hidden",border:"1.5px solid rgba(255,255,255,.07)"}}>
          {rows.map(([k,v],i)=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
              padding:"11px 14px",borderBottom:i<rows.length-1?"1px solid var(--b)":"none",gap:12}}>
              <span style={{fontSize:11,color:"var(--txt2)",flexShrink:0,fontWeight:600}}>{k}</span>
              <span style={{fontSize:12,color:k==="Rejection Reason"?"var(--red)":"var(--txt)",textAlign:"right",lineHeight:1.4,wordBreak:"break-word"}}>{v}</span>
            </div>
          ))}
        </div>

        {/* Campaign Brief */}
        {booking.brief && (
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:8}}>CAMPAIGN BRIEF</div>
            <div style={{background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:14,
              padding:"12px 14px",fontSize:12,color:"var(--txt)",lineHeight:1.7}}>
              {booking.brief}
            </div>
          </div>
        )}

        {/* Reference media from business */}
        {booking.mediaFiles && booking.mediaFiles.length > 0 && (
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:8}}>
              📎 REFERENCE MEDIA FROM BUSINESS
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {booking.mediaFiles.map((f,i)=>(
                <div key={i}
                  style={{position:"relative",width:80,height:80,borderRadius:16,overflow:"hidden",
                    border:"1.5px solid rgba(0,229,255,.28)",background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                    flexShrink:0,cursor:"pointer"}}
                  onClick={()=>setMediaPreview(f)}>
                  {f.type==="video"
                    ? <video src={f.url} style={{width:"100%",height:"100%",objectFit:"cover"}} muted playsInline/>
                    : <img src={f.url} alt={f.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
                    background:"rgba(0,0,0,.38)"}}>
                    <span style={{fontSize:22,filter:"drop-shadow(0 1px 4px #000)"}}>{f.type==="video"?"▶":"🔍"}</span>
                  </div>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"3px 6px",
                    background:"rgba(0,0,0,.7)",fontSize:8,color:"#fff",
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {f.type==="video"?"🎬":"🖼"} {(f.name||"").slice(0,14)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Preview Lightbox — portal renders at document.body to escape overflow:hidden */}
        {mediaPreview && (
          <MediaLightbox file={mediaPreview} onClose={()=>setMediaPreview(null)}/>
        )}

        {/* Personal Ad approved — send drive link */}
        {isPersonalAd && booking.personalAdApproved && !booking.driveLinkSentToBiz && !linkSent && (
          <div style={{marginBottom:14,padding:"16px",borderRadius:18,
            background:"linear-gradient(135deg,rgba(156,106,247,.1),rgba(255,171,64,.05))",
            border:"1px solid rgba(156,106,247,.35)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:22}}>🎯</span>
              <div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:800,
                  background:"linear-gradient(135deg,#9c6af7,#ffab40)",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  Personal Ad Approved!
                </div>
                <div style={{fontSize:11,color:"var(--txt2)"}}>Send Google Drive link to business to release payment</div>
              </div>
            </div>
            <div style={{fontSize:11,color:"var(--txt2)",fontWeight:700,marginBottom:6}}>
              GOOGLE DRIVE VIDEO LINK <span style={{color:"var(--red)"}}>*</span>
            </div>
            <input value={driveLink} onChange={e=>setDriveLink(e.target.value)}
              placeholder="https://drive.google.com/file/..."
              style={{width:"100%",background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1px solid rgba(156,106,247,.3)",
                borderRadius:14,padding:"11px 13px",color:"var(--txt)",fontSize:13,
                outline:"none",fontFamily:"'DM Sans',sans-serif",marginBottom:10}}/>
            <button onClick={sendDriveLinkToBusiness} disabled={sendingLink||!driveLink.trim()}
              style={{width:"100%",padding:"12px",border:"none",borderRadius:16,
                background:driveLink.trim()?"linear-gradient(135deg,#9c6af7,#7c4af7)":"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                color:driveLink.trim()?"#fff":"var(--txt3)",
                fontSize:13,fontWeight:800,cursor:driveLink.trim()?"pointer":"not-allowed",
                fontFamily:"'Plus Jakarta Sans',sans-serif",
                boxShadow:driveLink.trim()?"0 4px 0 #321070, 0 6px 14px rgba(156,106,247,.3)":"none",
                transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {sendingLink
                ? <span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>
                : "📁 Send to Business & Release Payment →"}
            </button>
          </div>
        )}

        {linkSent && (
          <div style={{marginBottom:14,padding:"14px",borderRadius:18,textAlign:"center",
            background:"rgba(0,230,118,.08)",border:"1.5px solid rgba(0,230,118,.32)"}}>
            <div style={{fontSize:28,marginBottom:6}}>✅</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:800,color:"var(--grn)",marginBottom:4}}>
              Drive Link Sent!
            </div>
            <div style={{fontSize:12,color:"var(--txt2)"}}>Business has received your video link and payment is released.</div>
          </div>
        )}

        {/* Actions */}
        {status==="Active" && !booking.adminRejected && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {/* Video link input — required for ALL promo types */}
            <div style={{marginBottom:6}}>
              <div style={{fontSize:11,fontWeight:700,marginBottom:6,
                color:isPersonalAd?"#9c6af7":"var(--c)"}}>
                {isPersonalAd?"GOOGLE DRIVE LINK":"PROMOTED CONTENT LINK"}{" "}
                <span style={{color:"var(--red)"}}>*</span>
                <span style={{marginLeft:6,fontSize:10,color:"var(--txt2)"}}>
                  {isPersonalAd?"Required for Personal Ad":"Paste the link to your promoted content"}
                </span>
              </div>
              <input value={driveLink} onChange={e=>setDriveLink(e.target.value)}
                placeholder={isPersonalAd?"https://drive.google.com/file/...":"https://instagram.com/p/... or YouTube/Drive link"}
                style={{width:"100%",background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                  border:`1px solid ${isPersonalAd?"rgba(156,106,247,.3)":"rgba(0,229,255,.25)"}`,
                  borderRadius:14,padding:"11px 13px",color:"var(--txt)",fontSize:13,
                  outline:"none",fontFamily:"'DM Sans',sans-serif",marginBottom:4}}/>
              <div style={{fontSize:10,color:"var(--txt2)"}}>
                {isPersonalAd
                  ? "Admin will review the video before you share it with the business."
                  : "Share the live post/video link. Admin will verify it before releasing payment."}
              </div>
            </div>
            {/* Auto-attached reference media from business — read-only, non-deletable */}
            {hasBusinessMedia && (
              <div style={{marginBottom:10,padding:"12px 14px",borderRadius:16,
                background:"rgba(0,229,255,.04)",border:"1px solid rgba(0,229,255,.18)"}}>
                <div style={{fontSize:10,color:"rgba(0,229,255,.8)",fontWeight:700,
                  letterSpacing:1.1,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
                  📎 REFERENCE MEDIA FROM BUSINESS
                  <span style={{fontSize:9,color:"var(--txt2)",fontWeight:500,
                    background:"rgba(0,229,255,.1)",padding:"2px 7px",borderRadius:20,
                    letterSpacing:.4}}>AUTO-ATTACHED</span>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {booking.mediaFiles.map((f,i)=>(
                    <div key={i}
                      style={{position:"relative",width:72,height:72,borderRadius:14,overflow:"hidden",
                        border:"1.5px solid rgba(0,229,255,.28)",
                        background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",
                        flexShrink:0,cursor:"pointer"}}
                      onClick={()=>setMediaPreview(f)}>
                      {f.type==="video"
                        ? <video src={f.url} muted playsInline
                            style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        : <img src={f.url} alt={f.name}
                            style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                      <div style={{position:"absolute",inset:0,display:"flex",
                        alignItems:"center",justifyContent:"center",
                        background:"rgba(0,0,0,.32)"}}>
                        <span style={{fontSize:18}}>{f.type==="video"?"▶":"🔍"}</span>
                      </div>
                      <div style={{position:"absolute",bottom:0,left:0,right:0,
                        padding:"2px 5px",background:"rgba(0,0,0,.7)",
                        fontSize:8,color:"#fff",overflow:"hidden",
                        textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {f.type==="video"?"🎬":"🖼"} {(f.name||"").slice(0,14)}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:9,color:"var(--txt2)",marginTop:7,lineHeight:1.5}}>
                  These files will be sent to admin automatically with your verification request.
                </div>
              </div>
            )}
            <button onClick={()=>updateStatus("Completed")} disabled={updating||!driveLink.trim()} className="btnp"
              style={{width:"100%",justifyContent:"center",
                background:driveLink.trim()?"linear-gradient(135deg,var(--amb),#e65100)":"rgba(255,255,255,.06)",
                fontSize:13,opacity:driveLink.trim()?1:0.55,
                cursor:driveLink.trim()?"pointer":"not-allowed"}}>
              {updating?"…":"✓ Mark as Completed — Send for Verification"}
            </button>
            <button onClick={()=>setShowRejectModal(true)} disabled={updating}
              style={{width:"100%",padding:"12px",borderRadius:50,cursor:"pointer",
                border:"1px solid rgba(248,113,113,.4)",background:"rgba(248,113,113,.08)",
                color:"var(--red)",fontSize:13,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:"all .2s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(248,113,113,.18)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(248,113,113,.08)"}>
              ✕ Reject Booking
            </button>
          </div>
        )}
        {status==="Pending" && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{textAlign:"center",padding:"12px 8px",background:"rgba(0,229,255,.05)",
              border:"1.5px solid rgba(0,229,255,.24)",borderRadius:12}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--c)",marginBottom:4}}>🔄 Auto-Accepted</div>
              <div style={{fontSize:11,color:"var(--txt2)"}}>Start working on the promotion.</div>
            </div>
            <button onClick={()=>setShowRejectModal(true)}
              style={{width:"100%",padding:"12px",borderRadius:50,cursor:"pointer",
                border:"1px solid rgba(248,113,113,.4)",background:"rgba(248,113,113,.08)",
                color:"var(--red)",fontSize:13,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              ✕ Reject Booking
            </button>
          </div>
        )}
        {status==="PendingCompletion" && (
          <div style={{textAlign:"center",padding:"12px 8px",background:"rgba(167,139,250,.08)",
            border:"1px solid rgba(167,139,250,.25)",borderRadius:12}}>
            <div style={{fontSize:13,fontWeight:700,color:"#a78bfa",marginBottom:4}}>⏳ Awaiting Team Verification</div>
            <div style={{fontSize:11,color:"var(--txt2)"}}>
              {isPersonalAd
                ? "Admin is reviewing your Personal Ad. Once approved, you can send the Drive link to release payment."
                : "Sent to our team for review. Payment releases once approved."}
            </div>
          </div>
        )}
        {(status==="Completed"||status==="Cancelled") && (
          <div style={{textAlign:"center",padding:"12px 8px",
            background:status==="Cancelled"?"rgba(248,113,113,.06)":"rgba(0,230,118,.05)",
            border:`1px solid ${status==="Cancelled"?"rgba(248,113,113,.25)":"rgba(0,230,118,.2)"}`,borderRadius:12}}>
            <div style={{fontSize:12,color:status==="Completed"?"var(--grn)":"var(--red)"}}>
              {status==="Completed"?"✅ Booking completed & payment released.":"❌ Booking was rejected. Refund sent to business."}
            </div>
          </div>
        )}
      </div>
    </div>

    {showRejectModal && (
      <div className="mbg" style={{zIndex:1100}} onClick={e=>e.target===e.currentTarget&&setShowRejectModal(false)}>
        <div className="mbox" style={{padding:24}}>
          <div style={{textAlign:"center",marginBottom:18}}>
            <div style={{fontSize:36,marginBottom:10}}>⚠️</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800,marginBottom:6}}>Reject This Booking?</div>
            <div style={{fontSize:12,color:"var(--txt2)",lineHeight:1.7}}>
              The business will be notified and <strong style={{color:"var(--grn)"}}>refunded in full</strong> to their wallet.
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:8,fontWeight:700,letterSpacing:.6}}>REASON <span style={{color:"var(--red)"}}>*</span></div>
            <textarea value={rejectReason} onChange={e=>setRejectReason(e.target.value)} rows={4}
              placeholder="e.g. This category doesn't match my niche..."
              style={{background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:16,
                padding:"12px 14px",color:"var(--txt)",fontSize:13,outline:"none",
                width:"100%",resize:"none",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}
              onFocus={e=>e.target.style.borderColor="var(--red)"}
              onBlur={e=>e.target.style.borderColor="var(--b)"}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setShowRejectModal(false);setRejectReason("");}}
              className="btng" style={{flex:1,justifyContent:"center"}}>Cancel</button>
            <button onClick={rejectBooking} disabled={rejecting||!rejectReason.trim()}
              style={{flex:2,padding:"12px",border:"none",borderRadius:50,cursor:"pointer",
                fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,color:"#fff",
                background:"linear-gradient(135deg,#f87171,#dc2626)",
                opacity:rejecting||!rejectReason.trim()?0.5:1}}>
              {rejecting?<span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>:"Reject & Refund →"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

// ── Booking Card ──────────────────────────────────────
function BookingCard({ booking, onOpen, showNew }) {
  const sc = {Active:"var(--grn)",Completed:"var(--amb)",Pending:"var(--pur)",Cancelled:"var(--red)",PendingCompletion:"#a78bfa"};
  const status = booking.status||"Pending";
  const dt = booking.createdAt?.seconds ? new Date(booking.createdAt.seconds*1000) : null;
  const dateStr = dt ? dt.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : booking.start || "—";
  const timeStr = dt ? dt.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}) : "";
  const bizInitials = (booking.bizName||"B").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const isPro = booking.bizIsPro === true;

  return (
    <div onClick={()=>onOpen&&onOpen(booking)}
      style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
        border:`1px solid ${showNew?"rgba(0,229,255,.4)":isPro?"rgba(156,106,247,.25)":"var(--b)"}`,
        borderRadius:22,padding:"14px 16px",transition:"all .2s",cursor:"pointer",
        position:"relative",overflow:"hidden",
        boxShadow:isPro?"0 4px 16px rgba(156,106,247,.08)":"none"}}
      onMouseEnter={e=>e.currentTarget.style.borderColor=isPro?"rgba(156,106,247,.5)":"rgba(0,229,255,.3)"}
      onMouseLeave={e=>e.currentTarget.style.borderColor=showNew?"rgba(0,229,255,.4)":isPro?"rgba(156,106,247,.25)":"var(--b)"}>

      {/* Pro shimmer line */}
      {isPro && (
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,
          background:"linear-gradient(90deg,transparent,#9c6af7,#ffab40,#9c6af7,transparent)"}}/>
      )}

      {showNew && (
        <div style={{position:"absolute",top:10,right:10,width:8,height:8,borderRadius:"50%",
          background:"var(--c)",boxShadow:"0 0 6px var(--c)"}}/>
      )}

      {/* Business identity row */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        {/* Biz avatar */}
        <div style={{position:"relative",flexShrink:0}}>
          <div style={{width:40,height:40,borderRadius:16,overflow:"hidden",
            background:"linear-gradient(135deg,var(--c),var(--c2))",
            display:"flex",alignItems:"center",justifyContent:"center",
            border:isPro?"2px solid rgba(156,106,247,.5)":"2px solid rgba(0,229,255,.25)",
            boxShadow:isPro?"0 0 12px rgba(156,106,247,.35)":"0 0 8px rgba(0,229,255,.15)"}}>
            {booking.bizPfp
              ? <img src={booking.bizPfp} alt={booking.bizName}
                  style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              : <span style={{fontSize:14,fontWeight:700,color:"var(--bg)",fontFamily:"system-ui"}}>{bizInitials}</span>
            }
          </div>
          {/* Pro badge on biz avatar */}
          {isPro && (
            <div style={{position:"absolute",bottom:-3,right:-3,
              width:16,height:16,borderRadius:"50%",
              background:"linear-gradient(135deg,#9c6af7,#ffab40)",
              border:"2px solid rgba(14,14,34,.99)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:8,boxShadow:"0 0 8px rgba(156,106,247,.6)",
              animation:"proBadge 1.8s ease infinite"}}>
              ⚡
            </div>
          )}
        </div>

        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
              color:isPro?"var(--txt)":"var(--txt)"}}>
              {booking.bizName||"Business"}
            </div>
            {isPro && (
              <span style={{flexShrink:0,display:"inline-flex",alignItems:"center",gap:3,
                padding:"2px 7px",borderRadius:50,fontSize:9,fontWeight:800,
                background:"linear-gradient(135deg,rgba(156,106,247,.2),rgba(255,171,64,.1))",
                color:"#ffab40",border:"1px solid rgba(156,106,247,.35)",
                fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:.3}}>
                ⚡ PRO
              </span>
            )}
          </div>
          <div style={{fontSize:11,color:"var(--txt2)"}}>
            {booking.promoLabel||booking.promoType||"Promotion"}
            {booking.creatorPlatform?` · ${booking.creatorPlatform}`:""}
          </div>
        </div>

        <span className="badge" style={{
          background:`${sc[status]||"var(--pur)"}18`,color:sc[status]||"var(--pur)",
          border:`1px solid ${sc[status]||"var(--pur)"}33`,fontSize:10,flexShrink:0}}>
          {status==="PendingCompletion"?"Awaiting Review":status}
        </span>
      </div>

      {/* Row 2: date + amount */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <span style={{fontSize:10,color:"var(--txt2)"}}>📅</span>
          <span style={{fontSize:11,color:"var(--txt2)",fontWeight:500}}>{dateStr}</span>
          {timeStr && <span style={{fontSize:10,color:"var(--txt3)"}}>· {timeStr}</span>}
        </div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:14,fontWeight:700,color:"var(--c)"}}>
          {booking.amount?inr(booking.amount):"—"}
        </div>
      </div>
      {booking.productName && (
        <div style={{marginTop:6,fontSize:11,color:"var(--txt2)"}}>🛍 {booking.productName}</div>
      )}
      {/* Rejection resubmit hint */}
      {booking.adminRejected && booking.adminRejectionReason && (
        <div style={{marginTop:7,fontSize:10,padding:"4px 10px",borderRadius:12,
          background:"linear-gradient(145deg,rgba(248,113,113,.16),rgba(220,40,40,.07))",color:"var(--red)",
          border:"1px solid rgba(248,113,113,.2)",fontWeight:600}}>
          ❌ Rejected: {booking.adminRejectionReason.slice(0,50)}{booking.adminRejectionReason.length>50?"…":""} — Tap to resubmit
        </div>
      )}
    </div>
  );
}

// ── Bookings Page ─────────────────────────────────────
function BookingsPage({ bookings, onStatusChange }) {
  const [filter, setFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const filters = ["All","Pending","Active","Completed"];
  const filtered = filter==="All" ? bookings : bookings.filter(b=>b.status===filter);

  // Mark booking as seen (Active) when opened
  const openBooking = async (booking) => {
    setSelectedBooking(booking);
    if (booking.status==="Pending" && !booking.seenByCreator) {
      try {
        const { doc, updateDoc } = window.__fsOps;
        await updateDoc(doc(window.__db, "bookings", booking.id), { seenByCreator: true });
      } catch(e) {}
    }
  };

  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px"}}>
      <div style={{marginBottom:20,animation:"fadeUp .5s both"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <h1 style={{fontSize:22,fontWeight:800}}>My Bookings</h1>
          <button onClick={()=>window.location.reload()}
            style={{background:"rgba(0,229,255,.08)",border:"1.5px solid rgba(0,229,255,.22)",
              borderRadius:50,padding:"5px 12px",color:"var(--c)",cursor:"pointer",
              fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5,
              flexShrink:0,transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,.18)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,229,255,.08)"}>↻ Refresh</button>
        </div>
        <p style={{fontSize:13,color:"var(--txt2)"}}>Tap any booking to see full details</p>
      </div>

      <div style={{display:"flex",gap:7,marginBottom:18,overflowX:"auto",animation:"fadeUp .5s .05s both"}} className="nosb">
        {filters.map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"7px 14px",borderRadius:50,cursor:"pointer",
            background:filter===f?"linear-gradient(135deg,var(--c),var(--c2))":"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
            color:filter===f?"var(--bg)":"var(--txt2)",
            fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,
            border:filter===f?"none":"1px solid var(--b)",
            flexShrink:0,transition:"all .2s"}}>
            {f} {f!=="All"&&<span style={{opacity:.7}}>({bookings.filter(b=>f==="All"||b.status===f).length})</span>}
          </button>
        ))}
      </div>

      {filtered.length===0 ? (
        <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,
          padding:"40px 16px",textAlign:"center",animation:"fadeUp .5s .1s both"}}>
          <div style={{fontSize:40,marginBottom:12,opacity:.3}}>📭</div>
          <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>No {filter!=="All"?filter.toLowerCase():""} bookings</div>
          <div style={{fontSize:12,color:"var(--txt2)"}}>Bookings from Collancer will appear here automatically.</div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12,animation:"fadeUp .5s .1s both"}}>
          {filtered.map((b,i)=>(
            <BookingCard key={b.id||i} booking={b} onOpen={openBooking}
              showNew={b.status==="Pending"&&!b.seenByCreator}/>
          ))}
        </div>
      )}

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={()=>setSelectedBooking(null)}
          onStatusChange={(id,status)=>{
            onStatusChange(id,status);
            setSelectedBooking(prev=>({...prev,status}));
          }}
        />
      )}
    </div>
  );
}


// ── Upload thumbnail to Cloudinary ──────────────────
async function uploadThumbnail(creatorId, dataUrl) {
  try {
    const formData = new FormData();
    formData.append("file", dataUrl);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    formData.append("public_id", `portfolio_thumb_${creatorId}_${Date.now()}`);
    formData.append("folder", "collancer_portfolio");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method:"POST", body:formData }
    );
    if (!res.ok) throw new Error("Thumb upload failed");
    const data = await res.json();
    return data.secure_url || null;
  } catch(e) { console.error("Thumbnail upload error:", e); return null; }
}

// ── Promotion Demo Section (replaces Portfolio) ────────
const DEMO_TYPES = [
  { id:"story",    label:"Story Promo",   icon:"📸", desc:"Instagram Story — 15s vertical" },
  { id:"reel",     label:"Reel Promo",    icon:"🎬", desc:"Instagram Reel — 30–60s vertical" },
  { id:"youtube",  label:"YT Integration",icon:"▶️",  desc:"YouTube mid-roll — 30–90s" },
  { id:"personalad",label:"Personal Ad",  icon:"⭐",  desc:"Branded scripted content" },
];
const DEMO_FORMATS = [
  { id:"9:16", label:"9:16", desc:"Vertical (Stories & Reels)", icon:"📱" },
  { id:"16:9", label:"16:9", desc:"Horizontal (YouTube)",       icon:"🖥" },
];

function PromoDemoSection({ creatorId, creatorName }) {
  const [demos, setDemos]         = useState([]);
  const [adding, setAdding]       = useState(false);
  const [step, setStep]           = useState(1); // 1=type, 2=format, 3=upload
  const [demoType, setDemoType]   = useState("");
  const [format, setFormat]       = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [title, setTitle]         = useState("");
  const [saving, setSaving]       = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    if (!creatorId || !window.__fsOps) return;
    const { collection, query, where, onSnapshot } = window.__fsOps;
    const q = query(collection(window.__db,"promoDemos"), where("creatorId","==",creatorId));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d=>({id:d.id,...d.data()}));
      data.sort((a,b)=>(b.addedAt?.seconds||0)-(a.addedAt?.seconds||0));
      setDemos(data);
    });
    return ()=>unsub();
  }, [creatorId]);

  const handleVideoSelect = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const resetForm = () => {
    setAdding(false); setStep(1); setDemoType(""); setFormat("");
    setVideoFile(null); setVideoPreview(""); setTitle("");
  };

  const uploadDemo = async () => {
    if (!videoFile || !demoType || !format) return;
    setSaving(true);
    try {
      // Upload video to Cloudinary
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const formData = new FormData();
          formData.append("file", ev.target.result);
          formData.append("upload_preset", CLOUDINARY_PRESET);
          formData.append("public_id", `demo_${creatorId}_${Date.now()}`);
          formData.append("folder", "collancer_demos");
          formData.append("resource_type", "video");
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/video/upload`,
            { method:"POST", body:formData }
          );
          const data = res.ok ? await res.json() : null;
          const videoUrl = data?.secure_url || videoPreview;
          const thumbUrl = data?.eager?.[0]?.secure_url || "";

          const { collection, addDoc, serverTimestamp } = window.__fsOps;
          const demoTypeObj = DEMO_TYPES.find(t=>t.id===demoType);
          await addDoc(collection(window.__db,"promoDemos"), {
            creatorId, creatorName,
            title: title.trim() || `${demoTypeObj?.label} Demo`,
            demoType,
            demoTypeLabel: demoTypeObj?.label || demoType,
            format,
            videoUrl,
            thumbnail: thumbUrl,
            addedAt: serverTimestamp(),
          });
          resetForm();
        } catch(e) {
          console.error("Demo upload error:", e);
          // Fallback: save without Cloudinary
          const { collection, addDoc, serverTimestamp } = window.__fsOps;
          const demoTypeObj = DEMO_TYPES.find(t=>t.id===demoType);
          await addDoc(collection(window.__db,"promoDemos"), {
            creatorId, creatorName,
            title: title.trim() || `${demoTypeObj?.label} Demo`,
            demoType, demoTypeLabel: demoTypeObj?.label || demoType,
            format, videoUrl: "", thumbnail: "",
            addedAt: serverTimestamp(),
          });
          resetForm();
        }
        setSaving(false);
      };
      reader.readAsDataURL(videoFile);
    } catch(e) { console.error(e); setSaving(false); }
  };

  const deleteDemo = async (demo) => {
    try {
      const { doc, deleteDoc } = window.__fsOps;
      await deleteDoc(doc(window.__db,"promoDemos",demo.id));
    } catch(e) { console.error(e); }
    setDeleteModal(null);
  };

  const inp = { background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))", border:"1.5px solid rgba(255,255,255,.07)", borderRadius:16,
    padding:"10px 13px", color:"var(--txt)", fontSize:13, outline:"none",
    fontFamily:"'DM Sans',sans-serif", width:"100%", marginBottom:10 };

  return (
    <div style={{marginBottom:20,animation:"fadeUp .5s .22s both"}}>
      <input ref={videoInputRef} type="file" accept="video/*"
        style={{display:"none"}} onChange={handleVideoSelect} onClick={e=>e.target.value=""}/>

      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1px solid rgba(156,106,247,.2)",borderRadius:20,padding:16,
        boxShadow:"0 4px 20px rgba(156,106,247,.06)"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
              <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2}}>PROMOTION DEMOS</div>
              <span style={{fontSize:9,background:"linear-gradient(135deg,#9c6af7,#ffab40)",color:"#fff",
                borderRadius:8,padding:"2px 6px",fontWeight:800,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>NEW</span>
            </div>
            <div style={{fontSize:12,color:"var(--txt2)"}}>Showcase your promo style — visible to businesses before they book</div>
          </div>
          {!adding && (
            <button onClick={()=>setAdding(true)} className="btnp"
              style={{padding:"8px 14px",fontSize:12,borderRadius:50,flexShrink:0,
                background:"linear-gradient(135deg,#9c6af7,#7c4af7)",
                boxShadow:"0 4px 14px rgba(156,106,247,.35)"}}>
              + Add Demo
            </button>
          )}
        </div>

        {/* Multi-step add form */}
        {adding && (
          <div style={{background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",borderRadius:18,padding:16,marginBottom:14,
            border:"1px solid rgba(156,106,247,.25)",animation:"fadeUp .3s both"}}>

            {/* Step indicator */}
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:16}}>
              {[1,2,3].map(s=>(
                <React.Fragment key={s}>
                  <div style={{width:26,height:26,borderRadius:"50%",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:11,fontWeight:800,flexShrink:0,
                    background:step>=s?"linear-gradient(135deg,#9c6af7,#7c4af7)":"linear-gradient(145deg,rgba(16,16,40,.98),rgba(10,10,26,.99))",
                    color:step>=s?"#fff":"var(--txt3)",
                    border:step===s?"2px solid #9c6af7":"2px solid transparent",
                    boxShadow:step===s?"0 0 12px rgba(156,106,247,.4)":"none",
                    transition:"all .25s"}}>
                    {step>s?"✓":s}
                  </div>
                  {s<3&&<div style={{flex:1,height:2,borderRadius:1,
                    background:step>s?"linear-gradient(90deg,#9c6af7,#7c4af7)":"linear-gradient(145deg,rgba(16,16,40,.98),rgba(10,10,26,.99))",
                    transition:"background .3s"}}/>}
                </React.Fragment>
              ))}
            </div>
            <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:.8,marginBottom:12}}>
              {step===1?"STEP 1 — SELECT DEMO TYPE":step===2?"STEP 2 — CHOOSE DISPLAY FORMAT":"STEP 3 — UPLOAD YOUR DEMO VIDEO"}
            </div>

            {/* Step 1: Demo type */}
            {step===1 && (
              <div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                  {DEMO_TYPES.map(t=>(
                    <button key={t.id} onClick={()=>setDemoType(t.id)}
                      style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                        borderRadius:16,cursor:"pointer",textAlign:"left",width:"100%",
                        border:demoType===t.id?"2px solid #9c6af7":"1px solid var(--b)",
                        background:demoType===t.id?"rgba(156,106,247,.12)":"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
                        transition:"all .2s"}}>
                      <div style={{width:38,height:38,borderRadius:14,flexShrink:0,
                        background:demoType===t.id?"linear-gradient(135deg,rgba(156,106,247,.3),rgba(156,106,247,.1))":"rgba(255,255,255,.04)",
                        border:`1px solid ${demoType===t.id?"rgba(156,106,247,.5)":"var(--b)"}`,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                        {t.icon}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:13,color:demoType===t.id?"#9c6af7":"var(--txt)",
                          fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{t.label}</div>
                        <div style={{fontSize:11,color:"var(--txt2)"}}>{t.desc}</div>
                      </div>
                      {demoType===t.id && <div style={{fontSize:16,color:"#9c6af7",fontWeight:700,flexShrink:0}}>✓</div>}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={resetForm} className="btng"
                    style={{flex:1,justifyContent:"center",fontSize:12}}>Cancel</button>
                  <button onClick={()=>{ if(demoType) setStep(2); }}
                    disabled={!demoType}
                    style={{flex:2,padding:"11px",border:"none",borderRadius:16,cursor:demoType?"pointer":"not-allowed",
                      background:demoType?"linear-gradient(135deg,#9c6af7,#7c4af7)":"linear-gradient(145deg,rgba(16,16,40,.98),rgba(10,10,26,.99))",
                      color:demoType?"#fff":"var(--txt3)",fontSize:13,fontWeight:700,
                      fontFamily:"'Plus Jakarta Sans',sans-serif",
                      boxShadow:demoType?"0 4px 14px rgba(156,106,247,.35)":"none",transition:"all .2s"}}>
                    Next: Choose Format →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Format */}
            {step===2 && (
              <div>
                <div style={{display:"flex",gap:10,marginBottom:16}}>
                  {DEMO_FORMATS.map(f=>(
                    <button key={f.id} onClick={()=>setFormat(f.id)}
                      style={{flex:1,padding:"20px 14px",borderRadius:18,cursor:"pointer",
                        border:format===f.id?"2px solid #9c6af7":"1px solid var(--b)",
                        background:format===f.id?"rgba(156,106,247,.12)":"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
                        transition:"all .2s",textAlign:"center"}}>
                      {/* Format visual */}
                      <div style={{display:"flex",justifyContent:"center",alignItems:"center",
                        marginBottom:8,height:52}}>
                        {f.id==="9:16" ? (
                          <div style={{width:24,height:42,borderRadius:8,
                            background:format===f.id?"linear-gradient(180deg,#9c6af7,#7c4af7)":"rgba(255,255,255,.12)",
                            border:`2px solid ${format===f.id?"#9c6af7":"var(--txt3)"}`,
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:9,color:format===f.id?"#fff":"var(--txt3)",fontWeight:700}}>
                            📱
                          </div>
                        ) : (
                          <div style={{width:52,height:30,borderRadius:8,
                            background:format===f.id?"linear-gradient(135deg,#9c6af7,#7c4af7)":"rgba(255,255,255,.12)",
                            border:`2px solid ${format===f.id?"#9c6af7":"var(--txt3)"}`,
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:11,color:format===f.id?"#fff":"var(--txt3)",fontWeight:700}}>
                            🖥
                          </div>
                        )}
                      </div>
                      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,
                        color:format===f.id?"#9c6af7":"var(--txt)",marginBottom:4}}>{f.label}</div>
                      <div style={{fontSize:10,color:"var(--txt2)",lineHeight:1.5}}>{f.desc}</div>
                    </button>
                  ))}
                </div>
                <div style={{fontSize:11,color:"var(--txt2)",lineHeight:1.6,marginBottom:14,
                  padding:"10px 12px",background:"rgba(156,106,247,.06)",borderRadius:14,
                  border:"1px solid rgba(156,106,247,.15)"}}>
                  💡 <strong style={{color:"var(--txt)"}}>Tip:</strong> Choose the format that matches your demo — Stories & Reels are 9:16 vertical, YouTube integrations are 16:9 horizontal.
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setStep(1)} className="btng"
                    style={{flex:1,justifyContent:"center",fontSize:12}}>← Back</button>
                  <button onClick={()=>{ if(format) setStep(3); }}
                    disabled={!format}
                    style={{flex:2,padding:"11px",border:"none",borderRadius:16,cursor:format?"pointer":"not-allowed",
                      background:format?"linear-gradient(135deg,#9c6af7,#7c4af7)":"linear-gradient(145deg,rgba(16,16,40,.98),rgba(10,10,26,.99))",
                      color:format?"#fff":"var(--txt3)",fontSize:13,fontWeight:700,
                      fontFamily:"'Plus Jakarta Sans',sans-serif",
                      boxShadow:format?"0 4px 14px rgba(156,106,247,.35)":"none",transition:"all .2s"}}>
                    Next: Upload Video →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Upload video */}
            {step===3 && (
              <div>
                {/* Title */}
                <input value={title} onChange={e=>setTitle(e.target.value)}
                  placeholder={`Demo title (e.g. ${DEMO_TYPES.find(t=>t.id===demoType)?.label} — March 2026)`}
                  style={{...inp,borderColor:"rgba(156,106,247,.3)"}}/>

                {/* Video picker */}
                {!videoFile ? (
                  <div onClick={()=>videoInputRef.current.click()}
                    style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,
                      height:140,borderRadius:18,border:"2px dashed rgba(156,106,247,.35)",
                      background:"rgba(156,106,247,.04)",cursor:"pointer",marginBottom:12,
                      transition:"all .2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(156,106,247,.6)";e.currentTarget.style.background="rgba(156,106,247,.08)"}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(156,106,247,.35)";e.currentTarget.style.background="rgba(156,106,247,.04)"}}>
                    <div style={{width:50,height:50,borderRadius:18,
                      background:"linear-gradient(135deg,rgba(156,106,247,.2),rgba(156,106,247,.08))",
                      border:"1px solid rgba(156,106,247,.3)",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🎬</div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#9c6af7",marginBottom:3}}>Tap to select your demo video</div>
                      <div style={{fontSize:11,color:"var(--txt2)"}}>MP4, MOV, WebM · Max 100MB</div>
                    </div>
                  </div>
                ) : (
                  <div style={{position:"relative",borderRadius:18,overflow:"hidden",
                    border:"1px solid rgba(156,106,247,.4)",marginBottom:12,
                    aspectRatio:format==="9:16"?"9/16":"16/9",maxHeight:260,
                    background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <video src={videoPreview} controls
                      style={{width:"100%",height:"100%",objectFit:format==="9:16"?"contain":"cover",display:"block"}}/>
                    <button onClick={()=>{setVideoFile(null);setVideoPreview("");}}
                      style={{position:"absolute",top:8,right:8,
                        background:"rgba(220,38,38,.85)",border:"none",borderRadius:12,
                        padding:"5px 10px",color:"#fff",fontSize:11,cursor:"pointer",fontWeight:700}}>
                      ✕ Remove
                    </button>
                    <div style={{position:"absolute",bottom:8,left:8,
                      background:"rgba(0,0,0,.75)",borderRadius:10,padding:"3px 8px",
                      fontSize:10,color:"#fff",fontWeight:600}}>
                      {format} · {videoFile.name.slice(0,24)}{videoFile.name.length>24?"…":""}
                    </div>
                  </div>
                )}

                {/* Demo type & format summary */}
                <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap"}}>
                  {[
                    {l:DEMO_TYPES.find(t=>t.id===demoType)?.label,icon:DEMO_TYPES.find(t=>t.id===demoType)?.icon},
                    {l:format+" Format",icon:format==="9:16"?"📱":"🖥"},
                  ].map((tag,i)=>(
                    <span key={i} style={{display:"inline-flex",alignItems:"center",gap:5,
                      padding:"5px 12px",borderRadius:50,fontSize:11,fontWeight:600,
                      background:"rgba(156,106,247,.12)",color:"#9c6af7",
                      border:"1px solid rgba(156,106,247,.25)"}}>
                      {tag.icon} {tag.l}
                    </span>
                  ))}
                </div>

                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setStep(2)} className="btng"
                    style={{flex:1,justifyContent:"center",fontSize:12}}>← Back</button>
                  <button onClick={uploadDemo}
                    disabled={saving||!videoFile}
                    style={{flex:2,padding:"11px",border:"none",borderRadius:16,
                      cursor:(saving||!videoFile)?"not-allowed":"pointer",
                      background:(saving||!videoFile)?"linear-gradient(145deg,rgba(16,16,40,.98),rgba(10,10,26,.99))":"linear-gradient(135deg,#9c6af7,#7c4af7)",
                      color:(saving||!videoFile)?"var(--txt3)":"#fff",
                      fontSize:13,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",
                      boxShadow:(saving||!videoFile)?"none":"0 4px 14px rgba(156,106,247,.35)",
                      transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    {saving
                      ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span> Uploading…</>
                      : "✦ Upload Demo"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Demos list */}
        {demos.length===0 && !adding ? (
          <div style={{textAlign:"center",padding:"28px 16px",color:"var(--txt2)"}}>
            <div style={{fontSize:36,marginBottom:8,opacity:.3}}>🎬</div>
            <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>No demos yet</div>
            <div style={{fontSize:12,lineHeight:1.6}}>Upload your first promo demo so businesses can see your style before booking!</div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {demos.map((d,i)=>{
              const typeInfo = DEMO_TYPES.find(t=>t.id===d.demoType)||{icon:"🎬",label:"Demo"};
              const isVertical = d.format==="9:16";
              return (
              <div key={d.id} style={{background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",borderRadius:18,
                border:"1px solid rgba(156,106,247,.15)",overflow:"hidden",
                animation:`fadeUp .3s ${i*.06}s both`}}>
                {/* Video preview */}
                <div style={{
                  position:"relative",overflow:"hidden",background:"#000",
                  height:isVertical?200:140,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {d.videoUrl ? (
                    <video src={d.videoUrl} controls
                      poster={d.thumbnail||undefined}
                      style={{width:"100%",height:"100%",objectFit:isVertical?"contain":"cover",display:"block"}}/>
                  ) : (
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,opacity:.4}}>
                      <div style={{fontSize:32}}>{typeInfo.icon}</div>
                      <div style={{fontSize:11,color:"var(--txt2)"}}>Video processing…</div>
                    </div>
                  )}
                  {/* Badges */}
                  <div style={{position:"absolute",top:8,left:8,display:"flex",gap:5}}>
                    <span style={{background:"rgba(0,0,0,.75)",borderRadius:10,padding:"3px 8px",
                      fontSize:10,color:"#fff",fontWeight:600}}>{typeInfo.icon} {d.demoTypeLabel||d.demoType}</span>
                    <span style={{background:"rgba(156,106,247,.8)",borderRadius:10,padding:"3px 8px",
                      fontSize:10,color:"#fff",fontWeight:700}}>{d.format}</span>
                  </div>
                </div>
                {/* Info row */}
                <div style={{padding:"10px 13px",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,
                      marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                      {d.title}
                    </div>
                    <div style={{fontSize:11,color:"var(--txt2)"}}>
                      {isVertical?"📱 Vertical":"🖥 Horizontal"} · {d.demoTypeLabel||d.demoType}
                    </div>
                  </div>
                  <button onClick={()=>setDeleteModal(d)}
                    style={{background:"linear-gradient(145deg,rgba(248,113,113,.16),rgba(220,40,40,.07))",border:"1px solid rgba(248,113,113,.25)",
                      borderRadius:12,padding:"6px 10px",color:"var(--red)",cursor:"pointer",
                      fontSize:11,fontWeight:700,flexShrink:0,transition:"all .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(248,113,113,.2)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(248,113,113,.1)"}>
                    🗑 Delete
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteModal && (
        <div className="mbg" onClick={e=>e.target===e.currentTarget&&setDeleteModal(null)}>
          <div className="mbox" style={{padding:24,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🗑</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800,marginBottom:8}}>
              Delete Demo?
            </div>
            <p style={{fontSize:12,color:"var(--txt2)",lineHeight:1.7,marginBottom:20}}>
              Permanently delete <strong style={{color:"var(--txt)"}}>{deleteModal.title}</strong>?<br/>
              This removes it from your Collancer profile too.
            </p>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setDeleteModal(null)} className="btng"
                style={{flex:1,justifyContent:"center"}}>Cancel</button>
              <button onClick={()=>deleteDemo(deleteModal)}
                style={{flex:1,padding:"12px",border:"none",borderRadius:50,cursor:"pointer",
                  color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,
                  background:"linear-gradient(135deg,#f87171,#dc2626)"}}>
                Delete Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ── Profile Page ──────────────────────────────────────
function CreatorProfilePage({ creator, onSave, onLogout, onPfpChange, onPrivacy, onTerms }) {
  const safeCreator = {
    followers:0, ytSubscribers:0, engagement:0, avgViews:0, avgLikes:0,
    reach:0, rating:0, price:0, bio:"", tags:[], reviews:[], categories:[],
    prices:{story:0,reel:0,video:0,personalad:0},
    ytConnected:false, ytTotalViews:0, ytChannelTitle:"", ytChannelThumb:"",
    profileLink:"", pfp:"", name:"", handle:"", platform:"Instagram",
    niche:"Fashion", city:"Mumbai",
    ...creator
  };
  const [form, setForm] = useState({...safeCreator});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const pfpRef = useRef(null);

  // Sync ALL form fields whenever creator changes from Firestore
  useEffect(() => {
    setForm(f => ({
      ...f,
      name: creator.name || f.name,
      handle: creator.handle || f.handle,
      bio: creator.bio !== undefined ? creator.bio : f.bio,
      platform: creator.platform || f.platform,
      niche: creator.niche || f.niche,
      city: creator.city || f.city,
      followers: creator.followers !== undefined ? creator.followers : f.followers,
      ytSubscribers: creator.ytSubscribers !== undefined ? creator.ytSubscribers : f.ytSubscribers,
      // engagement removed — no longer used
      avgViews: creator.avgViews !== undefined ? creator.avgViews : f.avgViews,
      reach: creator.reach !== undefined ? creator.reach : f.reach,
      price: creator.price !== undefined ? creator.price : f.price,
      prices: creator.prices || f.prices,
      tags: creator.tags || f.tags,
      categories: creator.categories || f.categories || [],
      profileLink: creator.profileLink !== undefined ? creator.profileLink : f.profileLink,
      pfp: creator.pfp !== undefined ? creator.pfp : f.pfp,
    }));
  }, [creator]);

  // NICHES removed — using CREATOR_PROMO_CATEGORIES instead
  const CITIES = ["Mumbai","Delhi","Bengaluru","Hyderabad","Chennai","Kolkata","Jaipur","Pune","Kochi","Ahmedabad"];
  const PLATFORMS = ["Instagram","YouTube","Both"];

  const inp = {background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:16,
    padding:"11px 14px",color:"var(--txt)",fontSize:13,outline:"none",
    fontFamily:"'DM Sans',sans-serif",width:"100%",transition:"border-color .2s",marginBottom:12};

  const save = async () => {
    if (!creator.id) { console.error("save: creator.id is missing"); return; }
    if (!window.__fsOps || !window.__db) { console.error("save: Firebase not ready"); return; }
    setSaving(true);
    try {
      const { doc, updateDoc, serverTimestamp } = window.__fsOps;
      const updates = {
        name: form.name || "",
        handle: form.handle || "",
        bio: form.bio || "",
        platform: form.platform || "Instagram",
        niche: form.niche || "",
        city: form.city || "",
        followers: Number(form.followers) || 0,
        ytSubscribers: Number(form.ytSubscribers) || 0,
        engagement: Number(form.engagement) || 0,
        avgViews: Number(form.avgViews) || 0,
        reach: Number(form.reach) || 0,
        price: Number(form.price) || 0,
        prices: {
          story:     Number(form.prices?.story)     || 0,
          reel:      Number(form.prices?.reel)      || 0,
          video:     Number(form.prices?.video)     || 0,
          personalad:Number(form.prices?.personalad)|| 0,
        },
        tags: typeof form.tags === "string"
          ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
          : (form.tags || []),
        categories: Array.isArray(form.categories) ? form.categories : [],
        profileLink: form.profileLink || "",
        pfp: form.pfp || "",
        // Preserve the opt-in flag — "Save & Sync" should keep creator visible if they opted in
        ...(creator.addedToCollancer ? { addedToCollancer: true, active: true } : {}),
        updatedAt: serverTimestamp(),
      };
      await updateDoc(doc(window.__db, "creators", creator.id), updates);
      // Preserve critical flags that are NOT in the form (updateDoc doesn't touch them in Firestore,
      // but we need to keep them in local React state until onSnapshot refreshes)
      onSave({
        ...form, ...updates, id: creator.id,
        addedToCollancer: creator.addedToCollancer,
        verified: creator.verified,
        verificationStatus: creator.verificationStatus,
        active: creator.active,
        banned: creator.banned,
        hasActiveBooking: creator.hasActiveBooking,
        rating: creator.rating,
        boosted: creator.boosted,
        boostEndsAt: creator.boostEndsAt,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch(e) {
      console.error("Save failed:", e);
      alert("Save failed: " + (e?.message || "unknown error"));
    }
    setSaving(false);
  };

  const tagsStr = Array.isArray(form.tags) ? form.tags.join(", ") : (form.tags||"");

  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px"}}>
      <div style={{marginBottom:20,animation:"fadeUp .5s both"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <h1 style={{fontSize:22,fontWeight:800}}>My Profile</h1>
          <button onClick={()=>window.location.reload()}
            style={{background:"rgba(0,229,255,.08)",border:"1.5px solid rgba(0,229,255,.22)",
              borderRadius:50,padding:"5px 12px",color:"var(--c)",cursor:"pointer",
              fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5,
              flexShrink:0,transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,229,255,.18)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,229,255,.08)"}>↻ Refresh</button>
        </div>
        <p style={{fontSize:13,color:"var(--txt2)"}}>Update your profile details below</p>
      </div>

      {/* Avatar with pfp upload */}
      <div style={{display:"flex",justifyContent:"center",marginBottom:20,animation:"fadeUp .5s .05s both"}}>
        <div style={{position:"relative",cursor:"pointer"}} onClick={()=>document.getElementById('ch-pfp-input').click()}>
          {(()=>{
            const colors=["#00E5FF","#7c6af7","#00e676","#ffab40"];
            const c=colors[(creator.name?.length||0)%colors.length];
            const ini=(creator.name||"CR").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
            return (
              <div style={{width:80,height:80,borderRadius:"50%",
                background:`linear-gradient(135deg,${c},${c}88)`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontFamily:"system-ui,sans-serif",fontWeight:700,fontSize:24,color:"#fff",lineHeight:1,
                overflow:"visible",
                border:"3px solid rgba(0,229,255,.3)",boxShadow:"0 0 24px rgba(0,229,255,.2)"}}>
                {form.pfp
                  ? <img src={form.pfp} alt="pfp" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
                  : ini}
              </div>
            );
          })()}
          <div style={{position:"absolute",bottom:0,right:0,width:24,height:24,borderRadius:"50%",
            background:"linear-gradient(135deg,var(--c),var(--c2))",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:12,border:"2px solid var(--bg)"}}>📷</div>
          <input id="ch-pfp-input" type="file" accept="image/*" style={{display:"none"}}
            onClick={e=>e.target.value=""}
            onChange={async e=>{
              const file=e.target.files[0]; if(!file) return;
              const reader=new FileReader();
              reader.onload=async ev=>{
                const compressed = await compressImage(ev.target.result, 300);
                setForm(f=>({...f, pfp:compressed}));
                if(onPfpChange) onPfpChange(compressed);
                try{
                  const{doc,updateDoc}=window.__fsOps;
                  await updateDoc(doc(window.__db,"creators",creator.id),{pfp:compressed});
                }catch(e){console.error("pfp save failed",e);}
              };
              reader.readAsDataURL(file);
            }}
          />
        </div>
      </div>

      {/* Stats — editable */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,
        padding:16,marginBottom:14,animation:"fadeUp .5s .1s both"}}>
        <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:14}}>BASIC INFO</div>
        {[{label:"Full Name",key:"name"},{label:"Handle (e.g. @priya.sharma)",key:"handle"}].map((f,i)=>(
          <div key={i}>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>{f.label}</div>
            <input value={form[f.key]||""} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={inp} placeholder={f.label}/>
          </div>
        ))}
        <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Bio</div>
        <textarea value={form.bio||""} onChange={e=>setForm(p=>({...p,bio:e.target.value}))}
          rows={3} style={{...inp,resize:"none"}} placeholder="Tell businesses about yourself..."/>
      </div>

      {/* Platform & Niche */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,
        padding:16,marginBottom:14,animation:"fadeUp .5s .14s both"}}>
        <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:14}}>PLATFORM & NICHE</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:0}}>
          <div>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Platform</div>
            <select style={{...inp,marginBottom:0}} value={form.platform} onChange={e=>setForm(f=>({...f,platform:e.target.value}))}>
              {PLATFORMS.map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Niche / Category</div>
            <select style={{...inp,marginBottom:0}} value={form.niche} onChange={e=>setForm(f=>({...f,niche:e.target.value}))}>
              {CREATOR_PROMO_CATEGORIES.map(c=><option key={c.id} value={c.label}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>City</div>
            <select style={{...inp,marginBottom:0}} value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}>
              {CITIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,
        padding:16,marginBottom:14,animation:"fadeUp .5s .18s both"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2}}>STATS</div>
          <div style={{fontSize:10,color:"var(--c)"}}>Edit if needed</div>
        </div>

        {/* Followers — with 10K live indicator */}
        <div>
          <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>{form.platform==="YouTube"?"Subscribers":"Followers"}</span>
            {form.followers && Number(form.followers) >= 1000 && (
              <span style={{fontSize:11,fontWeight:700,
                color: Number(form.followers) >= MIN_FOLLOWERS ? "var(--grn)" : "var(--red)"}}>
                {fmtK(Number(form.followers))} {Number(form.followers) >= MIN_FOLLOWERS ? "✓" : "— min 10K"}
              </span>
            )}
          </div>
          <input type="number" min="0" value={form.followers||""}
            onChange={e=>setForm(p=>({...p,followers:e.target.value}))}
            style={{...inp, borderColor: form.followers && Number(form.followers) > 0 && Number(form.followers) < MIN_FOLLOWERS
              ? "rgba(248,113,113,.6)" : undefined}}
            placeholder="minimum 10,000"/>
          {form.followers && Number(form.followers) > 0 && Number(form.followers) < MIN_FOLLOWERS && (
            <div style={{marginTop:-8,marginBottom:12,padding:"8px 12px",
              background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.2)",borderRadius:14,
              display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:12}}>🚫</span>
              <span style={{fontSize:11,color:"var(--red)"}}>Below 10K minimum — profile won't qualify for Collancer listing.</span>
            </div>
          )}
        </div>

        {/* YouTube subscribers for Both platform */}
        {form.platform==="Both" && (
          <div>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>YouTube Subscribers</div>
            <input type="number" value={form.ytSubscribers||""} onChange={e=>setForm(p=>({...p,ytSubscribers:e.target.value}))}
              style={inp} placeholder="0"/>
          </div>
        )}

        <div>
          <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Avg Views per Post</div>
          <input type="number" value={form.avgViews||""} onChange={e=>setForm(p=>({...p,avgViews:e.target.value}))}
            style={{...inp,marginBottom:0}} placeholder="0"/>
        </div>
      </div>

      {/* Pricing */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,
        padding:16,marginBottom:14,animation:"fadeUp .5s .22s both"}}>
        <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:14}}>PRICING (₹)</div>
        {[
          {label:"Base Price",key:"price",top:true},
          ...(form.platform!=="YouTube"?[{label:"Story Price",key:"prices.story"},{label:"Reel Price",key:"prices.reel"}]:[]),
          ...(form.platform!=="Instagram"?[{label:"Video Price",key:"prices.video"}]:[]),
          {label:"Personal Ad Price",key:"prices.personalad",last:true},
        ].map((f,i,arr)=>{
          const keys=f.key.split(".");
          const val=keys.length===2?(form[keys[0]]||{})[keys[1]]||"":form[f.key]||"";
          const onChange=e=>{
            if(keys.length===2) setForm(p=>({...p,[keys[0]]:{...p[keys[0]],[keys[1]]:e.target.value}}));
            else setForm(p=>({...p,[f.key]:e.target.value}));
          };
          return (
            <div key={i}>
              <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>{f.label}</div>
              <input type="number" value={val} onChange={onChange}
                style={i===arr.length-1?{...inp,marginBottom:0}:inp} placeholder="0"/>
            </div>
          );
        })}
      </div>

      {/* Tags */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,
        padding:16,marginBottom:14,animation:"fadeUp .5s .26s both"}}>
        <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:14}}>TAGS</div>
        <input value={tagsStr} onChange={e=>setForm(f=>({...f,tags:e.target.value}))}
          style={{...inp,marginBottom:0}} placeholder="#fashion, #ootd, #style"/>
      </div>

      {/* Promotion Categories */}
      <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,
        padding:16,marginBottom:16,animation:"fadeUp .5s .29s both"}}>
        <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1.2,marginBottom:6}}>PROMOTION CATEGORIES</div>
        <div style={{fontSize:12,color:"var(--txt2)",marginBottom:14,lineHeight:1.6}}>
          Select which categories you are open to for promotions. Businesses can only book you within these categories.
        </div>
        <CategoryPicker
          selected={Array.isArray(form.categories)?form.categories:[]}
          onChange={cats=>setForm(f=>({...f,categories:cats}))}/>
      </div>

      {/* Promotion Demos */}
      <PromoDemoSection creatorId={creator.id} creatorName={creator.name}/>

      <button onClick={save} disabled={saving} className="btnp"
        style={{width:"100%",justifyContent:"center",
          background:saved?"linear-gradient(135deg,var(--grn),#009944)":"linear-gradient(135deg,var(--c),var(--c2))"}}>
        {saving?<span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>
          :saved?"✓ Saved & Synced to Collancer!":"Save & Sync to Collancer →"}
      </button>

      {/* Logout button */}
      <button onClick={onLogout} style={{
        width:"100%",marginTop:12,padding:"13px",border:"1.5px solid rgba(248,113,113,.32)",
        borderRadius:50,background:"rgba(248,113,113,.06)",color:"var(--red)",
        fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
        transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(248,113,113,.14)"}
        onMouseLeave={e=>e.currentTarget.style.background="rgba(248,113,113,.06)"}>
        ⎋ Sign Out
      </button>

      {/* Legal links */}
      <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:20,paddingTop:16,borderTop:"1.5px solid rgba(255,255,255,.06)"}}>
        {[["🔐 Privacy Policy",onPrivacy],["📋 Terms of Service",onTerms]].map(([label,fn])=>(
          <button key={label} onClick={fn} style={{background:"none",border:"none",color:"var(--txt2)",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"color .2s",padding:0}}
            onMouseEnter={e=>e.currentTarget.style.color="var(--c)"}
            onMouseLeave={e=>e.currentTarget.style.color="var(--txt2)"}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Earnings Page ─────────────────────────────────────
function EarningsPage({ bookings, creator, payouts=[], adCampaigns=[] }) {
  const SHARE = 0.8;

  const active        = bookings.filter(b => b.status==="Active" || b.status==="Pending");
  const pendingComp   = bookings.filter(b => b.status==="PendingCompletion");
  const completed     = bookings.filter(b => b.status==="Completed");

  // IN PROGRESS — active + awaiting team approval bookings
  const inProgressAmt = [...active, ...pendingComp].reduce((s,b)=>s+(b.amount||0)*SHARE, 0);

  // LOCKED — completed but paymentApproved is false
  const lockedAmt = completed.filter(b=>!b.paymentApproved).reduce((s,b)=>s+(b.amount||0)*SHARE, 0);

  // TOTAL APPROVED EARNINGS — completed + paymentApproved
  const totalApproved = completed.filter(b=>b.paymentApproved).reduce((s,b)=>s+(b.amount||0)*SHARE, 0);

  // ALREADY REQUESTED / PAID — sum of all non-rejected payout requests
  const alreadyRequested = payouts.filter(p=>p.status!=="rejected").reduce((s,p)=>s+(p.amount||0), 0);

  // WITHDRAWABLE = totalApproved minus what's already been requested
  const withdrawable = Math.max(0, totalApproved - alreadyRequested);

  // WITHDRAWN (paid) — for history
  const paidPayouts    = payouts.filter(p=>p.status==="paid");
  const approvedPayouts= payouts.filter(p=>p.status==="approved");
  const pendingPayouts = payouts.filter(p=>p.status==="pending");

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({method:"UPI",upi:"",bank:"",ifsc:"",account:""});
  const [payoutSubmitted, setPayoutSubmitted] = useState(false);
  const [tab, setTab] = useState("overview"); // "overview" | "history"

  const submitPayout = async () => {
    if (withdrawable <= 0) return;
    if (!payoutForm.upi && !payoutForm.account) return;
    try {
      const { collection, addDoc, serverTimestamp } = window.__fsOps;
      await addDoc(collection(window.__db,"payoutRequests"), {
        creatorId: creator.id,
        creatorName: creator.name,
        amount: withdrawable,
        method: payoutForm.method,
        upi: payoutForm.upi||"",
        bank: payoutForm.bank||"",
        ifsc: payoutForm.ifsc||"",
        account: payoutForm.account||"",
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setPayoutSubmitted(true);
      setShowPayoutModal(false);
      setTimeout(()=>setPayoutSubmitted(false), 5000);
    } catch(e){ console.error(e); }
  };

  const inp = {background:"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:16,
    padding:"11px 14px",color:"var(--txt)",fontSize:13,outline:"none",
    fontFamily:"'DM Sans',sans-serif",width:"100%",marginBottom:10};

  const statusColor = {pending:"var(--amb)",approved:"var(--c)",paid:"var(--grn)",rejected:"var(--red)"};
  const statusIcon  = {pending:"⏳",approved:"✓",paid:"✅",rejected:"❌"};
  const statusLabel = {pending:"Pending",approved:"Approved",paid:"Transferred ✅",rejected:"Rejected"};

  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px"}}>

      {/* Header */}
      <div style={{marginBottom:16,animation:"fadeUp .5s both"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <h1 style={{fontSize:22,fontWeight:800}}>Earnings</h1>
          <button onClick={()=>window.location.reload()}
            style={{background:"rgba(0,229,255,.08)",border:"1.5px solid rgba(0,229,255,.22)",
              borderRadius:50,padding:"5px 12px",color:"var(--c)",cursor:"pointer",
              fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5,flexShrink:0}}>↻ Refresh</button>
        </div>
        <p style={{fontSize:13,color:"var(--txt2)"}}>You receive 80% · 20% platform fee to Collancer</p>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:18,animation:"fadeUp .5s .03s both"}}>
        {[["overview","Overview"],["adspend","Ad Spend"],["history","Withdrawals"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{
            flex:1,padding:"9px",borderRadius:16,cursor:"pointer",fontSize:12,fontWeight:700,
            border:tab===k?"2px solid var(--c)":"1px solid var(--b)",
            background:tab===k?"rgba(0,229,255,.1)":"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
            color:tab===k?"var(--c)":"var(--txt2)",transition:"all .18s"}}>
            {l}
          </button>
        ))}
      </div>

      {/* Payout submitted toast */}
      {payoutSubmitted && (
        <div style={{background:"linear-gradient(135deg,rgba(0,230,118,.12),rgba(0,230,118,.06))",
          border:"1.5px solid rgba(0,230,118,.32)",borderRadius:18,padding:"12px 16px",marginBottom:16,
          display:"flex",alignItems:"center",gap:10,animation:"fadeUp .4s both"}}>
          <span style={{fontSize:20}}>✅</span>
          <div style={{fontSize:13,fontWeight:700,color:"var(--grn)"}}>Withdrawal request sent! Our team will process it soon.</div>
        </div>
      )}

      {tab==="overview" && (
        <>
          {/* 1. WITHDRAWABLE — biggest, top */}
          <div style={{background:"linear-gradient(135deg,rgba(0,230,118,.14),rgba(0,230,118,.04))",
            border:"1px solid rgba(0,230,118,.4)",borderRadius:22,padding:"18px 16px",
            marginBottom:12,animation:"fadeUp .5s .05s both"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <div>
                <div style={{fontSize:10,color:"var(--grn)",fontWeight:700,letterSpacing:1.2,marginBottom:6}}>💰 WITHDRAWABLE BALANCE</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:30,fontWeight:800,color:"var(--grn)"}}>
                  {inr(withdrawable)}
                </div>
                <div style={{fontSize:11,color:"var(--txt2)",marginTop:4}}>Team approved · Ready to withdraw</div>
              </div>
              <button onClick={()=>setShowPayoutModal(true)} disabled={withdrawable<=0}
                className="btnp" style={{flexShrink:0,padding:"11px 18px",fontSize:13,
                  opacity:withdrawable<=0?0.35:1,
                  background:"linear-gradient(135deg,#00e676,#00c853)"}}>
                Withdraw
              </button>
            </div>
            {pendingPayouts.length>0 && (
              <div style={{marginTop:10,padding:"8px 12px",background:"rgba(255,171,64,.1)",
                border:"1px solid rgba(255,171,64,.25)",borderRadius:14,
                fontSize:11,color:"var(--amb)",display:"flex",alignItems:"center",gap:7}}>
                <span>⏳</span>
                {inr(pendingPayouts.reduce((s,p)=>s+(p.amount||0),0))} withdrawal pending team approval
              </div>
            )}
            {approvedPayouts.length>0 && (
              <div style={{marginTop:8,padding:"8px 12px",background:"rgba(0,229,255,.08)",
                border:"1.5px solid rgba(0,229,255,.24)",borderRadius:14,
                fontSize:11,color:"var(--c)",display:"flex",alignItems:"center",gap:7}}>
                <span>✓</span>
                {inr(approvedPayouts.reduce((s,p)=>s+(p.amount||0),0))} approved — transfer in progress
              </div>
            )}
          </div>

          {/* 2 & 3 — Locked + In Progress side by side */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20,animation:"fadeUp .5s .1s both"}}>
            <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,171,64,.32)",borderRadius:20,padding:14,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,var(--amb),transparent)",opacity:.7}}/>
              <div style={{fontSize:10,color:"var(--amb)",fontWeight:700,letterSpacing:1,marginBottom:6}}>🔒 LOCKED</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:"var(--amb)"}}>{inr(lockedAmt)}</div>
              <div style={{fontSize:10,color:"var(--txt2)",marginTop:4,lineHeight:1.5}}>Completed · Awaiting team release</div>
            </div>
            <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:14,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,var(--c),transparent)",opacity:.5}}/>
              <div style={{fontSize:10,color:"var(--txt2)",fontWeight:700,letterSpacing:1,marginBottom:6}}>🔄 IN PROGRESS</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:"var(--c)"}}>{inr(inProgressAmt)}</div>
              <div style={{fontSize:10,color:"var(--txt2)",marginTop:4,lineHeight:1.5}}>{active.length+pendingComp.length} active campaign{active.length+pendingComp.length!==1?"s":""}</div>
            </div>
          </div>



          {bookings.length===0 && (
            <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,
              padding:"40px 16px",textAlign:"center",animation:"fadeUp .5s .1s both"}}>
              <div style={{fontSize:40,marginBottom:12,opacity:.3}}>💰</div>
              <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>No earnings yet</div>
              <div style={{fontSize:12,color:"var(--txt2)"}}>Complete your profile and receive bookings to start earning.</div>
            </div>
          )}
        </>
      )}

      {/* ── Ad Spend Tab ── */}
      {tab==="adspend" && (
        <div style={{animation:"fadeUp .4s both"}}>
          {/* Total ad spend summary box */}
          <div style={{background:"linear-gradient(135deg,rgba(124,106,247,.14),rgba(124,106,247,.04))",
            border:"1px solid rgba(124,106,247,.4)",borderRadius:22,padding:"16px 16px",
            marginBottom:14}}>
            <div style={{fontSize:10,color:"#a78bfa",fontWeight:700,letterSpacing:1.2,marginBottom:6}}>🚀 TOTAL AD SPEND</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:28,fontWeight:800,color:"#a78bfa"}}>
              {inr(adCampaigns.reduce((s,a)=>s+(a.price||0),0))}
            </div>
            <div style={{fontSize:11,color:"var(--txt2)",marginTop:4}}>
              {adCampaigns.length} campaign{adCampaigns.length!==1?"s":""} total
            </div>
          </div>

          {/* Scrollable ad history box */}
          {adCampaigns.length===0 ? (
            <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,
              padding:"40px 16px",textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12,opacity:.3}}>🚀</div>
              <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>No ad campaigns yet</div>
              <div style={{fontSize:12,color:"var(--txt2)"}}>Run a "Be On Top" campaign to boost your visibility.</div>
            </div>
          ) : (
            <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,overflow:"hidden"}}>
              <div style={{padding:"12px 16px 8px",borderBottom:"1px solid var(--b)",
                display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:1.5,color:"var(--txt2)"}}>AD HISTORY</span>
                <span style={{fontSize:10,color:"var(--txt2)"}}>{adCampaigns.length} total</span>
              </div>
              {/* Scrollable list — 4 visible, scroll for more */}
              <div style={{maxHeight:320,overflowY:"auto"}} className="nosb">
                {[...adCampaigns].sort((a,b)=>(b.createdAt?.seconds||b.startedAt||0)-(a.createdAt?.seconds||a.startedAt||0)).map((ad,i)=>{
                  const dt = ad.createdAt?.seconds ? new Date(ad.createdAt.seconds*1000)
                           : ad.startedAt ? new Date(ad.startedAt) : null;
                  const dateStr = dt ? dt.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
                  const timeStr = dt ? dt.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}) : "";
                  const expired = ad.endsAt && ad.endsAt < Date.now();
                  const cats = (ad.categories||[]).slice(0,3);
                  return (
                    <div key={ad.id||i} style={{padding:"13px 16px",
                      borderBottom:i<adCampaigns.length-1?"1px solid var(--b)":"none",
                      display:"flex",alignItems:"flex-start",gap:12}}>
                      <div style={{width:38,height:38,borderRadius:11,flexShrink:0,
                        background:"rgba(124,106,247,.15)",border:"1px solid rgba(124,106,247,.3)",
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                        🚀
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700}}>
                            {ad.days} day{ad.days!==1?"s":""} · {ad.categoryCount||cats.length||1} categor{(ad.categoryCount||cats.length||1)===1?"y":"ies"}
                          </div>
                          <span style={{fontSize:10,padding:"2px 8px",borderRadius:50,fontWeight:700,flexShrink:0,marginLeft:8,
                            background:expired?"rgba(100,100,120,.15)":"rgba(0,230,118,.12)",
                            color:expired?"var(--txt2)":"var(--grn)",
                            border:`1px solid ${expired?"rgba(100,100,120,.2)":"rgba(0,230,118,.3)"}`}}>
                            {expired?"Ended":"🟢 Live"}
                          </span>
                        </div>
                        <div style={{fontSize:11,color:"var(--txt2)",marginBottom:4}}>
                          {cats.map(c=>{
                            const cat = CREATOR_PROMO_CATEGORIES.find(p=>p.id===c);
                            return cat ? cat.icon+" "+cat.label : c;
                          }).join(" · ")}{(ad.categories||[]).length>3?" ···":""}
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{fontSize:10,color:"var(--txt2)"}}>
                            📅 {dateStr}{timeStr?" · "+timeStr:""}
                          </div>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:800,color:"#a78bfa"}}>
                            {inr(ad.price||0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Withdrawals Tab ── */}
      {tab==="history" && (
        <div style={{animation:"fadeUp .4s both"}}>
          {payouts.length===0 ? (
            <div style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,
              padding:"40px 16px",textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12,opacity:.3}}>📋</div>
              <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>No withdrawal requests yet</div>
              <div style={{fontSize:12,color:"var(--txt2)"}}>Once you request a withdrawal, it will appear here.</div>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[...payouts].sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)).map((p,i)=>(
                <div key={p.id||i} style={{
                  background:p.status==="paid"
                    ?"linear-gradient(135deg,rgba(0,230,118,.08),rgba(0,230,118,.02))"
                    :"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
                  border:`1px solid ${
                    p.status==="paid"?"rgba(0,230,118,.35)":
                    p.status==="approved"?"rgba(0,229,255,.3)":
                    p.status==="rejected"?"rgba(248,113,113,.3)":
                    "rgba(255,171,64,.25)"}`,
                  borderRadius:22,padding:"14px 16px",
                  position:"relative",overflow:"hidden"}}>
                  {p.status==="paid" && (
                    <div style={{position:"absolute",top:0,left:0,right:0,height:2,
                      background:"linear-gradient(90deg,transparent,var(--grn),transparent)"}}/>
                  )}
                  <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                    <div style={{width:40,height:40,borderRadius:16,flexShrink:0,
                      background:`${statusColor[p.status]||"var(--amb)"}18`,
                      border:`1px solid ${statusColor[p.status]||"var(--amb)"}33`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                      {statusIcon[p.status]||"⏳"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:800}}>
                          {inr(p.amount||0)}
                        </div>
                        <span style={{fontSize:10,padding:"2px 8px",borderRadius:50,fontWeight:700,
                          background:`${statusColor[p.status]||"var(--amb)"}18`,
                          color:statusColor[p.status]||"var(--amb)",
                          border:`1px solid ${statusColor[p.status]||"var(--amb)"}30`}}>
                          {statusLabel[p.status]||"Pending"}
                        </span>
                      </div>
                      <div style={{fontSize:11,color:"var(--txt2)",marginBottom:2}}>
                        {p.method==="UPI"?`📱 ${p.upi}`:p.method==="Bank Transfer"?`🏦 ${p.bank}·${p.account}`:p.method||"—"}
                      </div>
                      <div style={{fontSize:10,color:"var(--txt3)"}}>
                        {p.createdAt?.seconds && new Date(p.createdAt.seconds*1000).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                        {p.status==="paid" && p.paidAt?.seconds && ` · Transferred ${new Date(p.paidAt.seconds*1000).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payout modal */}
      {showPayoutModal && (
        <div className="mbg" onClick={e=>e.target===e.currentTarget&&setShowPayoutModal(false)}>
          <div className="mbox" style={{padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800}}>Request Withdrawal</div>
              <button onClick={()=>setShowPayoutModal(false)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--txt2)"}}>✕</button>
            </div>
            <div style={{background:"rgba(0,230,118,.08)",border:"1px solid rgba(0,230,118,.2)",
              borderRadius:16,padding:"12px 14px",marginBottom:16}}>
              <div style={{fontSize:11,color:"var(--txt2)",marginBottom:4}}>Amount to withdraw</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,color:"var(--grn)"}}>{inr(withdrawable)}</div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {["UPI","Bank Transfer"].map(m=>(
                <button key={m} onClick={()=>setPayoutForm(f=>({...f,method:m}))} style={{
                  flex:1,padding:"9px",borderRadius:14,cursor:"pointer",fontSize:12,fontWeight:700,
                  border:payoutForm.method===m?"2px solid var(--c)":"1px solid var(--b)",
                  background:payoutForm.method===m?"rgba(0,229,255,.1)":"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",
                  color:payoutForm.method===m?"var(--c)":"var(--txt2)"}}>
                  {m==="UPI"?"📱 UPI":"🏦 Bank"}
                </button>
              ))}
            </div>
            {payoutForm.method==="UPI" ? (
              <>
                <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>UPI ID</div>
                <input value={payoutForm.upi} onChange={e=>setPayoutForm(f=>({...f,upi:e.target.value}))}
                  placeholder="yourname@upi" style={inp}/>
              </>
            ) : (
              <>
                <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Bank Name</div>
                <input value={payoutForm.bank} onChange={e=>setPayoutForm(f=>({...f,bank:e.target.value}))}
                  placeholder="e.g. HDFC Bank" style={inp}/>
                <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>Account Number</div>
                <input value={payoutForm.account} onChange={e=>setPayoutForm(f=>({...f,account:e.target.value}))}
                  placeholder="Account number" style={inp}/>
                <div style={{fontSize:11,color:"var(--txt2)",marginBottom:5}}>IFSC Code</div>
                <input value={payoutForm.ifsc} onChange={e=>setPayoutForm(f=>({...f,ifsc:e.target.value}))}
                  placeholder="e.g. HDFC0001234" style={inp}/>
              </>
            )}
            <button onClick={submitPayout}
              disabled={payoutForm.method==="UPI"?!payoutForm.upi:(!payoutForm.account||!payoutForm.ifsc)}
              className="btnp" style={{width:"100%",justifyContent:"center",marginTop:4,
                background:"linear-gradient(135deg,#00e676,#00c853)",
                opacity:(payoutForm.method==="UPI"?!payoutForm.upi:(!payoutForm.account||!payoutForm.ifsc))?0.4:1}}>
              Submit Withdrawal Request
            </button>
            <div style={{fontSize:10,color:"var(--txt2)",textAlign:"center",marginTop:8}}>
              Our team will process your withdrawal within 3–5 business days
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Chat History Utilities ────────────────────────────

// ── Home App Privacy & Terms Data ────────────────────
const HOME_PRIVACY = {
  title:"Privacy Policy", updated:"Last updated: March 2026",
  sections:[
    {h:"1. Information We Collect",p:"Collancer Home collects information you provide when creating your creator account: your name, handle, email address, platform (Instagram/YouTube/Both), city, niche, follower/subscriber count, engagement rate, average views, bio, profile picture, pricing, portfolio videos, tags, and promotion categories you accept. We also collect your booking history, earnings data, payout requests, ad campaign history, verification request details, and notification preferences."},
    {h:"2. Profile Verification Data",p:"When you submit for profile verification, we collect your social media profile URL, Instagram handle, YouTube channel name, follower/subscriber count, bio, niche, city, and the promotion categories you select. This data is reviewed by the Collancer team to verify your identity and stats. Your verification status (pending, verified, rejected) is stored and affects your access to platform features."},
    {h:"3. Promotion Categories",p:"When setting up or updating your profile, you select promotion categories that define which types of brand campaigns you accept. These categories are visible to businesses when they view your profile and are used to filter booking requests. You can update your categories at any time from the Profile tab. Your selected categories are stored in your creator profile on our secure Firestore database."},
    {h:"4. Booking & Earnings Data",p:"All bookings you receive — including business name, promotion type, campaign brief, amount, status, and timestamps — are stored in your account. Your earnings data including completed campaign amounts, your 80% share, locked/withdrawable balances, and payout requests are maintained securely. Rejection reasons you provide when rejecting a booking are stored and shared with the relevant business."},
    {h:"5. Payout & Bank Data",p:"When requesting a withdrawal, you provide your UPI ID or bank account details (bank name, account number, IFSC code). This data is stored securely and used solely to process your payout. We do not share your bank/UPI details with third parties except for payment processing. Payout history including amounts, methods, dates, and statuses is retained in your account."},
    {h:"6. Portfolio & Media",p:"Portfolio videos you add (titles, URLs, thumbnails) are stored in your creator profile and displayed on the Collancer marketplace to businesses. Thumbnails are uploaded via Cloudinary with secure URLs. Profile pictures are stored via Cloudinary. Our team may remove portfolio content that violates community guidelines — you will receive a notification with the reason."},
    {h:"7. Ad Campaigns ('Be On Top')",p:"When you run a 'Be On Top' ad campaign, we store the campaign details including duration, price paid, start/end timestamps, and status. Your profile is boosted to the top of the Collancer Discover page for the campaign duration, marked with a 'Sponsored' badge. Ad campaign data is visible to the Collancer team for management purposes."},
    {h:"8. Notifications & Communications",p:"We send you real-time in-app notifications for: new bookings received, booking completion approvals, payout approvals and transfers, verification status updates, portfolio video removals, and 'Be On Top' campaign updates. Notification history is stored per account. We do not send marketing emails without your consent."},
    {h:"9. Data Sharing",p:"We share your creator profile data (name, handle, bio, platform, followers, prices, categories, ratings, portfolio) with businesses on the Collancer marketplace. Booking details are shared between you and the booking business. Payout data is shared with payment processors. Verification data is reviewed by the Collancer team only. We never sell your personal data to advertisers."},
    {h:"10. Your Rights (DPDPA 2023)",p:"Under India's Digital Personal Data Protection Act 2023, you have the right to access, correct, or delete your personal data. To update your profile data, use the Profile tab. To request account deletion or data access, email privacy@collancer.in. We respond within 30 days. Note: booking and payout records required for GST compliance cannot be deleted for 7 years."},
    {h:"11. Security",p:"Your account is protected by Firebase Authentication with email/password. All data is encrypted in transit using TLS 1.3. Firestore access requires authentication. Profile pictures and portfolio thumbnails are stored on Cloudinary with secure HTTPS URLs. Support chat history is stored locally on your device using browser localStorage — it is not transmitted to our servers."},
    {h:"12. Contact",p:"For privacy questions: privacy@collancer.in. For support: support@collancer.in. Collancer Technologies Pvt Ltd, Bengaluru, Karnataka, India — 560001."},
  ]
};

const HOME_TERMS = {
  title:"Terms of Service", updated:"Last updated: March 2026",
  sections:[
    {h:"1. Acceptance of Terms",p:"By creating a creator account on Collancer Home, you agree to these Terms of Service, our Privacy Policy, and all applicable Indian laws. These terms govern your use of the platform as a content creator. If you do not agree, do not use the platform."},
    {h:"2. Creator Eligibility & Account",p:"You must be at least 18 years old to create a creator account on Collancer Home. You must be the actual owner/operator of the social media profile(s) you register. You are responsible for all activity on your account. Sharing account credentials is prohibited. Report unauthorised access to support@collancer.in immediately."},
    {h:"3. Profile Accuracy & Honesty",p:"All information in your creator profile — follower count, engagement rate, average views, reach, bio, and pricing — must be accurate, current, and honest. A minimum of 10,000 followers or subscribers is required to apply for verification and get listed on Collancer. Creators who do not meet this threshold will be denied verification. Entering false, inflated, or misleading statistics is a strict violation of these Terms and will result in immediate permanent account ban, removal from the Collancer marketplace, and forfeiture of any pending earnings. Collancer verifies stats before approving profiles and may re-verify periodically."},
    {h:"4. Verification Process",p:"Profile verification is required to unlock all platform features including appearing on the Collancer marketplace, accepting bookings, and requesting payouts. Submit your verification request from the Dashboard tab with your profile URL and accurate stats. The Collancer team will review within 24 hours. Verified creators receive a ✓ badge. Rejection reasons are provided and you may resubmit with corrections."},
    {h:"5. Promotion Categories",p:"You must select at least one promotion category during verification and may update your categories in the Profile tab. These categories define what brand campaigns you are willing to accept. You are encouraged to reject bookings that fall outside your categories. However, once you select a category, businesses booking you for that category trust that you will fulfil the brief. Repeatedly accepting and then rejecting bookings in your selected categories may result in account review."},
    {h:"6. Booking Acceptance & Auto-Accept",p:"Bookings from verified businesses on Collancer are automatically accepted the moment they are placed. You will receive an instant notification. You are expected to begin working on the promotion immediately and deliver within 1–3 working days for Stories/Reels, and 2–4 working days for YouTube Videos. Personal Ad campaigns may take up to 5 working days. Consistent non-delivery will result in account suspension."},
    {h:"7. Booking Rejection Policy",p:"You may reject a booking if the campaign brief, product, or promotion does not align with your content standards, values, or selected categories. To reject, open the booking in the Bookings tab, tap 'Reject Booking', and provide an honest reason. The reason is shared with the business. Full payment is instantly refunded to the business wallet. Rejection reasons must be genuine — submitting false reasons to avoid legitimate work is a Terms violation."},
    {h:"8. Earnings, Platform Fee & Payouts",p:"Collancer charges a 20% platform service fee on all bookings. You receive 80% of every booking amount. Earnings move through these stages: (1) In Progress — active/pending campaigns; (2) Locked — completed but awaiting team payment release; (3) Withdrawable — released by our team, ready to withdraw. Request a payout from the Earnings tab. Payouts are processed by our team within 3–5 working days and credited to your UPI or bank account. Once our team marks a payout as 'Transferred', your withdrawal history updates instantly."},
    {h:"9. 'Be On Top' Ad Campaigns",p:"The 'Be On Top' feature allows you to pay for sponsored placement at the top of Collancer's Discover page for 1–7 days. Ad fees are non-refundable once the campaign goes live. Only verified creators may run ad campaigns. Ad campaigns can be stopped by our team for policy violations. Running a 'Be On Top' campaign while having an active booking is permitted."},
    {h:"10. Portfolio & Content Standards",p:"Portfolio videos and thumbnails must be your own work or content you have legal rights to display. Do not upload misleading, inappropriate, or third-party copyrighted content. Our team may remove portfolio items that violate these standards with notification. You will receive a reason for any removals. Repeated violations may result in account suspension."},
    {h:"11. Prohibited Conduct",p:"You must not: provide false stats or misleading profile information; accept bookings with no intention of delivering; contact businesses outside the platform to circumvent Collancer fees; create multiple accounts; manipulate your ratings or reviews; use automated tools to interact with the platform; or engage in any activity that harms other creators, businesses, or Collancer's reputation. Violations result in permanent ban and forfeiture of pending earnings."},
    {h:"12. Account Suspension & Termination",p:"Collancer may suspend or permanently ban your account for: providing false profile information; repeated non-delivery; fraudulent payout requests; violation of any provision of these Terms; or conduct harmful to the platform community. Upon termination, any pending earnings will be reviewed and paid or forfeited based on the nature of the violation. You may appeal a suspension by emailing appeals@collancer.in within 7 days."},
    {h:"13. Intellectual Property",p:"You retain intellectual property rights to content you create for campaigns. By listing on Collancer, you grant Collancer a non-exclusive, royalty-free licence to display your profile, handle, and publicly visible content on the marketplace for promotional purposes. For Personal Ad bookings, you grant the booking business full usage rights for 60 days as specified in the booking."},
    {h:"14. Governing Law",p:"These Terms are governed by the laws of India. Disputes shall be resolved through arbitration under the Arbitration and Conciliation Act 1996, conducted in Bengaluru, Karnataka. For minor disputes, you may also approach the Consumer Forum under the Consumer Protection Act 2019."},
  ]
};

function HomeLegalPage({ type, onBack }) {
  const data = type==="privacy" ? HOME_PRIVACY : HOME_TERMS;
  return (
    <div style={{maxWidth:430,margin:"0 auto",padding:"16px 16px 90px"}}>
      <button onClick={onBack} style={{background:"none",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:14,color:"var(--txt2)",padding:"8px 16px",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",marginBottom:20,display:"inline-flex",alignItems:"center",gap:7,transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--c)";e.currentTarget.style.color="var(--c)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b)";e.currentTarget.style.color="var(--txt2)"}}>← Back</button>
      <div style={{animation:"fadeUp .5s both"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
          <div style={{width:36,height:36,borderRadius:11,background:"var(--cdim)",border:"1.5px solid rgba(0,229,255,.24)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{type==="privacy"?"🔐":"📋"}</div>
          <h1 style={{fontSize:"clamp(20px,4vw,26px)",fontWeight:800}}>{data.title}</h1>
        </div>
        <p style={{fontSize:12,color:"var(--txt2)",marginBottom:24,marginLeft:48}}>{data.updated}</p>
        {data.sections.map((s,i)=>(
          <div key={i} style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:"15px 16px",marginBottom:10,animation:`fadeUp .4s ${i*.04}s both`,transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,229,255,.15)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b)"}>
            <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,color:"var(--c)",marginBottom:7}}>{s.h}</h3>
            <p style={{fontSize:12.5,color:"var(--txt2)",lineHeight:1.8}}>{s.p}</p>
          </div>
        ))}
        <div style={{marginTop:16,padding:"14px 18px",background:"rgba(0,229,255,.04)",border:"1.5px solid rgba(0,229,255,.16)",borderRadius:18,textAlign:"center"}}>
          <p style={{fontSize:12,color:"var(--txt2)"}}>Questions? Email <span style={{color:"var(--c)"}}>legal@collancer.in</span> or <span style={{color:"var(--c)"}}>support@collancer.in</span></p>
        </div>
      </div>
    </div>
  );
}

// ── Home App Support Chat ─────────────────────────────
function HomeSupportPage({ creator }) {
  const HOME_WELCOME = `Hi ${creator?.name?.split(" ")[0]||"there"}! 👋 I'm your Collancer Home support assistant. I know everything about the creator platform — verification, bookings, earnings, payouts, categories, 'Be On Top', and more. What do you need help with?`;

  const [view,       setView]     = useState("chat");
  const [msgs,       setMsgs]     = useState(makeWelcome(HOME_WELCOME));
  const [newIds,     setNewIds]   = useState(new Set([0]));
  const [input,      setInput]    = useState("");
  const [loading,    setLoading]  = useState(false);
  const [chatHistory,setChatHistory] = useState(()=>loadChats(CHAT_STORAGE_KEY_HOME));
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const currentChatId = useRef(Date.now().toString());
  const deletedIds    = useRef(new Set()); // track deleted IDs — never re-persist these

  useEffect(()=>{ setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),60); },[msgs,loading]);

  const persistChat = (messages) => {
    if (messages.length <= 1) return;
    if (deletedIds.current.has(currentChatId.current)) return; // never re-save a deleted chat
    const hist = loadChats(CHAT_STORAGE_KEY_HOME);
    const snippet = messages.filter(m=>m.role==="user")[0]?.text||"Chat";
    const existing = hist.findIndex(h=>h.id===currentChatId.current);
    const entry = { id:currentChatId.current, snippet:snippet.slice(0,60), messages, ts:Date.now() };
    if (existing>=0) hist[existing]=entry; else hist.unshift(entry);
    saveChats(CHAT_STORAGE_KEY_HOME, hist);
    setChatHistory(hist);
  };

  const startNewChat = () => {
    persistChat(msgs); // save current only if not deleted
    currentChatId.current = Date.now().toString();
    const welcome = makeWelcome(HOME_WELCOME);
    setMsgs(welcome);
    setNewIds(new Set([0]));
    setInput("");
    setView("chat");
  };

  const loadChat = (entry) => {
    currentChatId.current = entry.id;
    setMsgs(entry.messages);
    setNewIds(new Set());
    setView("chat");
  };

  const deleteChat = (id, e) => {
    e.stopPropagation();
    // Mark deleted so persistChat never brings it back
    deletedIds.current.add(id);
    const updated = chatHistory.filter(h=>h.id!==id);
    saveChats(CHAT_STORAGE_KEY_HOME, updated);
    setChatHistory(updated);
    // If deleting the currently active chat, give it a fresh ID
    // so future messages create a new history entry instead of re-saving the deleted one
    if (currentChatId.current === id) {
      currentChatId.current = Date.now().toString();
    }
  };

  const getResponse = (q) => {
    const ql = q.toLowerCase();

    // ── Greetings ──
    if (ql.match(/^(hi|hey|hello|namaste|hii|helo|sup|good morning|good afternoon|good evening)[\s!?]*$/)) return `Hey! I'm your Collancer Home support assistant. I'm here to help with anything on the creator platform — verification, bookings, earnings, payouts, categories, ads, profile, and more. What do you need help with today?`;

    // ── What is Collancer Home ──
    if (ql.includes("what is collancer home")||ql.includes("about collancer home")||ql.includes("what is this app")) return "Collancer Home is the creator dashboard for Collancer — India's premier influencer marketplace. As a creator, you use this app to: get your profile verified, receive and manage bookings from businesses, track and withdraw earnings, run 'Be On Top' ad campaigns to get more visibility, manage your portfolio, and control your promotion categories. Businesses discover and book you through the Collancer app!";

    // ── Account creation ──
    if (ql.includes("create account")||ql.includes("sign up")||ql.includes("register")||ql.includes("how to join")||ql.includes("how to start")) return "To join Collancer as a creator: (1) Open the app and tap 'Create Account'. (2) Enter your name, email, and password. (3) Once logged in, go to Dashboard and tap 'Verify Profile'. (4) Read the eligibility disclaimer — you need minimum 10,000 followers or subscribers. (5) Fill in your platform, handle, followers, bio, city, niche, and promotion categories. (6) Submit for verification — our team reviews within 24 hours. Once approved, your profile goes live on Collancer!";
    if (ql.includes("minimum")||ql.includes("10k follower")||ql.includes("10,000 follower")||ql.includes("follower.*require")||ql.includes("eligible")||ql.includes("eligibility")) return "The minimum requirement to join Collancer as a verified creator is 10,000 followers or subscribers. Before filling in your verification details, the app shows an eligibility disclaimer screen. If your follower count is below 10K, the submit button stays disabled and a red warning appears. Your profile categories determine which sections of the Collancer marketplace you appear in — choose them carefully!";
    if (ql.includes("login")||ql.includes("sign in")||ql.includes("log in")) return "To log in, open Collancer Home and enter your registered email and password. If you've forgotten your password, tap 'Forgot Password' on the login screen to receive a reset email. If you're having login issues, email support@collancer.in with your registered email!";

    // ── Verification ──
    if (ql.includes("verif")||ql.includes("get verified")||ql.includes("verification")||ql.includes("how to verify")) return "To get verified you must have a minimum of 10,000 followers or subscribers. The process: go to Dashboard → tap 'Verify Profile' → read the eligibility disclaimer (10K minimum) → fill in your platform, handle, follower count, avg views per post, bio, city, niche, and profile URL → select your promotion categories (25 options available) → tap 'Submit for Verification'. Our team reviews within 24 hours. You'll get a notification when approved or rejected. Verification unlocks: Bookings tab, Earnings tab, Profile editing, 'Add Me to Collancer', and 'Be On Top'!";
    if (ql.includes("verification rejected")||ql.includes("rejected verif")) return "If your verification was rejected, you'll receive a notification with the reason. Common reasons: inaccurate follower count, invalid profile URL, or profile doesn't match the niche you selected. Fix the issues, go back to Dashboard → 'Verify Profile', and resubmit with corrected information. There's no limit on how many times you can resubmit!";
    if (ql.includes("verification pending")||ql.includes("waiting for verif")||ql.includes("how long.*verif")) return "Verification requests are reviewed by the Collancer team. It typically takes up to 24 hours. You can check your status in Dashboard — it will show 'Pending' while under review. You'll receive an in-app notification the moment it's approved or rejected!";

    // ── Promotion categories ──
    if (ql.includes("categor")||ql.includes("promotion category")||ql.includes("which category")||ql.includes("what category")) return "Promotion categories tell businesses what types of brand promotions you accept — and also determine which category sections you appear in on the Collancer marketplace. Collancer has 25 categories: Fashion & Clothing, Beauty & Skincare, Food & Beverages, Fitness & Wellness, Tech & Gadgets, Gaming & Esports, Travel & Tourism, Finance & Fintech, Lifestyle & Vlogs, Music & Entertainment, Education & EdTech, Health & Pharma, Automobile & Bikes, Real Estate & Home, E-Commerce & Shopping, Jewellery & Accessories, Kids & Parenting, Sports & Athletics, Wedding & Events, Sustainable & Organic, Business & Startups, OTT & Entertainment, Pets & Animals, Astrology & Spirituality, and Crypto & Web3. Select only the categories you genuinely want to work in — you only appear in those sections!";
    if (ql.includes("change categor")||ql.includes("update categor")||ql.includes("add categor")||ql.includes("remove categor")) return "You can update your promotion categories anytime! Go to the Profile tab → scroll down to 'PROMOTION CATEGORIES' → tap categories to select or deselect them → scroll to the bottom and tap 'Save & Sync to Collancer'. Changes reflect on the marketplace instantly!";
    if (ql.includes("reject.*categor")||ql.includes("categor.*reject")||ql.includes("wrong categor")) return "If a business books you for a promotion that doesn't match your categories or content values, you can reject the booking. Open the booking → tap 'Reject Booking' → provide your reason. The business gets a full refund instantly. Always select only the categories you're genuinely willing to work in to avoid unnecessary rejections!";

    // ── Bookings ──
    if (ql.includes("how do.*booking")||ql.includes("receive.*booking")||ql.includes("get booking")||ql.includes("new booking")||ql.includes("booking come")) return "Bookings come to you automatically when a verified business on Collancer books your profile! You'll get an in-app notification (toast banner at the top). All bookings are auto-accepted immediately. Go to the Bookings tab to see all your active, pending, and completed bookings. Tap any booking to see the full brief, business details, and promotion type!";
    if (ql.includes("reject booking")||ql.includes("decline booking")||ql.includes("cancel booking")) return "To reject a booking: go to Bookings tab → tap the booking → in the detail modal tap 'Reject Booking' → enter your reason (required) → tap 'Reject & Refund'. The booking is instantly cancelled, the business gets a full refund to their wallet, and they receive your rejection reason. Use this only for genuine reasons — like the brief doesn't match your categories or violates your content standards!";
    if (ql.includes("complete.*booking")||ql.includes("mark.*complete")||ql.includes("finish.*booking")||ql.includes("campaign done")) return "When you've delivered the promotion, go to Bookings tab → tap the booking → tap '✓ Mark as Completed — Send for Verification'. This sends the booking to the Collancer team for payment verification. Our team will review and approve, releasing your 80% earnings to your withdrawable balance. You'll get a notification when payment is released!";
    if (ql.includes("booking status")||ql.includes("active booking")||ql.includes("pending booking")||ql.includes("booking tab")) return "Booking statuses: Active (you're currently working on it), PendingCompletion (you've marked it done — awaiting team approval), Completed (team approved — earnings released), Cancelled (rejected by you or our team). While you have an Active or PendingCompletion booking, your Profile and Earnings tabs are locked to keep your focus on delivering!";

    // ── Earnings ──
    if (ql.includes("earning")||ql.includes("how much.*earn")||ql.includes("my money")||ql.includes("income")) return "You earn 80% of every booking amount — Collancer takes a 20% platform fee. Your earnings are organised into: 🔄 In Progress (active campaigns), 🔒 Locked (completed, awaiting team release), and 💰 Withdrawable (approved, ready to withdraw). Once a campaign is completed and our team releases payment, your 80% moves to Withdrawable balance. Go to the Earnings tab to see the full breakdown!";
    if (ql.includes("withdraw")||ql.includes("payout")||ql.includes("cash out")||ql.includes("get my money")||ql.includes("request payout")) return "To withdraw your earnings: go to Earnings tab → tap 'Withdraw' (available when you have withdrawable balance) → choose UPI or Bank Transfer → enter your details → tap 'Submit Withdrawal Request'. Our team will process within 3–5 working days and mark it as Transferred. You'll see the status update in real-time in your Withdrawal History tab within Earnings!";
    if (ql.includes("locked.*earning")||ql.includes("earning.*locked")||ql.includes("when.*release")||ql.includes("payment.*release")) return "Earnings are 'Locked' after you mark a booking as Completed — this means the booking is under team review. Once our team approves the completion, your 80% is released to your 'Withdrawable' balance and you'll receive a '💰 Payment Released!' notification. This review typically happens within 1–2 working days!";
    if (ql.includes("withdrawal history")||ql.includes("payout history")||ql.includes("past payout")||ql.includes("payout status")) return "Open the Earnings tab and tap the 'Withdrawal History' tab button at the top. You'll see all your withdrawal requests with statuses: Pending (submitted, awaiting team), Approved (team approved — transfer in progress), Transferred ✅ (money sent to your account with the transfer date shown). All history is saved and updates in real-time!";
    if (ql.includes("platform fee")||ql.includes("20%")||ql.includes("collancer fee")||ql.includes("commission")) return "Collancer charges a 20% platform service fee on all bookings. You receive 80%. For example: if a business books you for ₹10,000, you receive ₹8,000 and Collancer receives ₹2,000 as a platform fee. This fee covers: marketplace exposure, verification, booking management, payment processing, team support, and fraud protection.";

    // ── Be On Top ──
    if (ql.includes("be on top")||ql.includes("on top")||ql.includes("sponsored")||ql.includes("ad campaign")||ql.includes("boost")||ql.includes("top of collancer")) return "The 'Be On Top' feature lets you pay to appear at the top of specific categories on Collancer's Discover page — businesses browsing those categories see you first! Only verified creators can use this feature. Go to Dashboard → tap 'Be On Top' → Step 1: select which categories you want to be on top in (you can select multiple — each category multiplies the price) → Step 2: choose duration 1–7 days → Step 3: confirm order → Step 4: complete payment. Your card gets a gold banner with ✦ Sponsored badge on the left and 🔥 Trending badge on the right. You appear at the top of every selected category. Ad goes live the moment payment is confirmed!";
    if (ql.includes("how long.*on top")||ql.includes("duration.*ad")||ql.includes("ad.*price")||ql.includes("cost.*on top")||ql.includes("category.*price")||ql.includes("price.*category")) return "Be On Top base pricing per duration: 1 Day ₹299, 2 Days ₹549, 3 Days ₹799 (most popular), 4 Days ₹999, 5 Days ₹1,249, 6 Days ₹1,449, 7 Days ₹1,599. If you select multiple categories, the price multiplies — e.g. 2 categories × ₹299 = ₹598 for 1 day across both categories. Your ad starts immediately and auto-expires when the duration ends. Our team can stop your ad if it violates guidelines.";

    // ── Profile ──
    if (ql.includes("edit profile")||ql.includes("update profile")||ql.includes("change profile")||ql.includes("profile page")) return "Go to the Profile tab to edit: name, handle, bio, platform, niche/category, city, follower/subscriber counts, avg views per post, reach, pricing (base price + per-format prices for Story/Reel/Video/Personal Ad), tags, promotion categories (25 options), and portfolio videos. Tap 'Save & Sync to Collancer' to update your live listing instantly. Note: Profile is locked while you have an active booking. Stats fields show a warning if followers are below 10K!";
    if (ql.includes("profile picture")||ql.includes("pfp")||ql.includes("photo")||ql.includes("profile photo")||ql.includes("change photo")) return "To update your profile picture: go to Profile tab → tap the circular avatar at the top → select a photo from your device. The image is compressed and uploaded automatically. Your new photo appears on your Collancer marketplace listing immediately!";
    if (ql.includes("pricing")||ql.includes("set price")||ql.includes("my price")||ql.includes("how much.*charge")||ql.includes("charge per")) return "Set your pricing in the Profile tab under 'PRICING (₹)'. You can set: Base Price (for Reel), Story Price (Instagram stories), Reel Price (Instagram reels), Video Price (YouTube videos), and Personal Ad Price (premium cross-platform). Businesses see these exact prices when viewing your profile. Set fair, market-competitive prices to get more bookings!";
    if (ql.includes("portfolio")||ql.includes("demo")||ql.includes("add video")||ql.includes("my work")||ql.includes("sample work")||ql.includes("promo demo")) return "Add Promotion Demos in Profile tab → scroll to 'Promotion Demos' section → tap '+ Add Demo' → select your demo type (Story/Reel/YouTube/Personal Ad) → choose display format (9:16 vertical or 16:9 horizontal) → upload your video file. Demos are instantly visible to businesses on your Collancer profile so they can see your promo style before booking!";
    if (ql.includes("add to collancer")||ql.includes("appear on collancer")||ql.includes("list on collancer")||ql.includes("show on collancer")) return "After getting verified, go to Dashboard and tap 'Add Me to Collancer'. This makes your profile visible to all businesses on the Collancer marketplace. Until you tap this, your profile is verified but not discoverable. You can also remove yourself from the listing if needed by updating your profile settings!";

    // ── Dashboard ──
    if (ql.includes("dashboard")||ql.includes("home screen")||ql.includes("main screen")) return "Your Dashboard shows: your name and verification status at the top; stats (total earned, bookings, completed, rating); verification/action banners; 'Be On Top' and 'Add Me to Collancer' buttons (after verification); active booking lock banner; recent bookings preview; and your business reviews. It's your control centre for everything on Collancer Home!";

    // ── Notifications ──
    if (ql.includes("notif")||ql.includes("alert")||ql.includes("update.*receive")||ql.includes("bell")) return "You receive real-time notifications for: new bookings (toast banner), payment releases, payout approvals, payout transfers, verification approvals/rejections, portfolio video removals, and 'Be On Top' confirmations. Notifications appear as animated banners at the top of the screen. They're triggered by Firestore real-time listeners — no refresh needed!";

    // ── Privacy / Terms ──
    if (ql.includes("privacy")||ql.includes("data policy")||ql.includes("my data")||ql.includes("personal data")) return "Collancer Home's Privacy Policy explains how we handle your creator profile data, booking history, payout details, portfolio media, and verification information. Key points: data is encrypted and secured with Firebase; we never sell your data; you have rights under India's DPDPA 2023. Access the Privacy Policy from Profile tab → scroll to bottom → Privacy link!";
    if (ql.includes("terms")||ql.includes("terms of service")||ql.includes("rules")||ql.includes("policy")) return "Our Terms of Service cover creator account requirements, profile accuracy obligations, verification process, promotion category rules, booking acceptance and rejection policies, earnings and payout terms, 'Be On Top' ad rules, content standards, prohibited conduct, and dispute resolution. Access the Terms from Profile tab → scroll to bottom → Terms link!";

    // ── Recent chats ──
    if (ql.includes("recent chat")||ql.includes("chat history")||ql.includes("old chat")||ql.includes("previous chat")||ql.includes("saved chat")) return "Your support chat history is saved automatically! Tap the 📋 History button at the top of this Support page to see all past chats. Tap any chat to continue it, or the 🗑 button to delete it. Tap '✦ New' to start a fresh chat (your current session is saved). Chat history is stored on your device — it stays even after you close the app!";

    // ── Logout ──
    if (ql.includes("logout")||ql.includes("log out")||ql.includes("sign out")) return "To sign out: go to Profile tab → scroll to the bottom → tap '⎋ Sign Out'. You'll be asked to confirm. After signing out, your bookings and earnings data are safely saved — nothing is lost. Sign back in anytime with your email and password!";

    // ── Contact ──
    if (ql.includes("contact")||ql.includes("support email")||ql.includes("help email")||ql.includes("email support")||ql.includes("human support")) return "For support: support@collancer.in (response within 24 hours on business days). For privacy: privacy@collancer.in. For earnings/payout issues: billing@collancer.in. For appeals: appeals@collancer.in. Add URGENT to your subject line for time-sensitive issues!";

    // ── Thank you ──
    if (ql.includes("thank")||ql.includes("thanks")||ql.includes("helpful")||ql.includes("awesome")||ql.includes("perfect")||ql.includes("ok")||ql.includes("okay")) return "Happy to help! Feel free to come back anytime with questions. Good luck with your bookings and earnings on Collancer! 🚀";

    // ── Default ──
    return "I can help with anything on Collancer Home — account creation, verification, promotion categories, bookings, rejecting bookings, earnings, payouts, 'Be On Top', profile setup, portfolio, and more. Could you give me a bit more detail about what you need? Or try asking something like 'how do I get verified', 'how do I withdraw earnings', or 'how do I reject a booking'!";
  };

  const send = async (overrideText) => {
    const text = (overrideText||input).trim();
    if (!text||loading) return;
    setInput("");
    const userMsg = {id:Date.now(), role:"user", text};
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setNewIds(new Set([userMsg.id]));
    setLoading(true);
    await new Promise(r=>setTimeout(r, 500+Math.random()*400));
    const reply = getResponse(text);
    const botMsg = {id:Date.now()+1, role:"assistant", text:reply};
    const finalMsgs = [...newMsgs, botMsg];
    setMsgs(finalMsgs);
    setNewIds(new Set([botMsg.id]));
    setLoading(false);
    persistChat(finalMsgs);
  };

  const quickQ = ["How do I get verified?","How do I reject a booking?","How do I withdraw earnings?","What are promotion categories?","How does 'Be On Top' work?","How much does Collancer charge?"];

    const d = new Date(ts), now = new Date(), diff = now - d;
    if (diff < 86400000) return d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    if (diff < 604800000) return d.toLocaleDateString("en-IN",{weekday:"short"});
    return d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"});
  };

  if (view==="history") return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 112px)",maxWidth:430,width:"100%",margin:"0 auto"}}>
      <div style={{flexShrink:0,background:"linear-gradient(145deg,rgba(16,16,40,.98),rgba(10,10,26,.99))",borderBottom:"1px solid var(--b2)",padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>setView("chat")} style={{background:"rgba(0,229,255,.08)",border:"1.5px solid rgba(0,229,255,.22)",borderRadius:14,padding:"6px 12px",color:"var(--c)",cursor:"pointer",fontSize:12,fontWeight:700}}>← Back</button>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:800,flex:1}}>Recent Chats</div>
        <button onClick={startNewChat} style={{background:"linear-gradient(135deg,var(--c),var(--c2))",border:"none",borderRadius:14,padding:"6px 12px",color:"var(--bg)",cursor:"pointer",fontSize:11,fontWeight:800}}>✦ New Chat</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px"}} className="nosb">
        {chatHistory.length===0 ? (
          <div style={{textAlign:"center",padding:"60px 20px",color:"var(--txt2)"}}>
            <div style={{fontSize:40,marginBottom:12,opacity:.3}}>💬</div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>No chat history yet</div>
            <div style={{fontSize:12}}>Your past support chats will appear here</div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {chatHistory.map((chat,i)=>(
              <div key={chat.id} onClick={()=>loadChat(chat)}
                style={{background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(255,255,255,.07)",borderRadius:18,padding:"13px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .2s",animation:`fadeUp .3s ${i*.04}s both`}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(0,229,255,.3)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--b)"}>
                <div style={{width:40,height:40,borderRadius:16,flexShrink:0,background:"linear-gradient(135deg,rgba(0,229,255,.15),rgba(124,106,247,.1))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💬</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{chat.snippet}</div>
                  <div style={{fontSize:10,color:"var(--txt2)"}}>{chat.messages.length} messages · {fmtTime(chat.ts)}</div>
                </div>
                <button onClick={(e)=>deleteChat(chat.id,e)} style={{background:"linear-gradient(145deg,rgba(248,113,113,.16),rgba(220,40,40,.07))",border:"1px solid rgba(248,113,113,.25)",borderRadius:12,padding:"5px 8px",color:"var(--red)",cursor:"pointer",fontSize:12,flexShrink:0,transition:"all .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(248,113,113,.25)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(248,113,113,.1)"}>🗑</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 112px)",maxWidth:430,width:"100%",margin:"0 auto"}}>
      {/* Header */}
      <div style={{flexShrink:0,background:"linear-gradient(145deg,rgba(16,16,40,.98),rgba(10,10,26,.99))",borderBottom:"1px solid var(--b2)",padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:38,height:38,borderRadius:16,background:"linear-gradient(135deg,var(--c),var(--c2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,boxShadow:"0 0 14px rgba(0,229,255,.35)"}}>💬</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:800,lineHeight:1}}>Creator Support</div>
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"var(--grn)",animation:"pulse 2s ease infinite",flexShrink:0}}/>
            <span style={{fontSize:10,color:"var(--grn)",fontWeight:600}}>AI Support · Online 24/7</span>
          </div>
        </div>
        <button onClick={()=>{ persistChat(msgs); setView("history"); }} style={{background:"rgba(0,229,255,.08)",border:"1.5px solid rgba(0,229,255,.22)",borderRadius:14,padding:"5px 10px",color:"var(--c)",cursor:"pointer",fontSize:11,fontWeight:700,flexShrink:0}}>📋</button>
        <button onClick={startNewChat} style={{background:"rgba(0,229,255,.08)",border:"1.5px solid rgba(0,229,255,.22)",borderRadius:14,padding:"5px 10px",color:"var(--c)",cursor:"pointer",fontSize:11,fontWeight:700,flexShrink:0}}>✦ New</button>
      </div>
      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 8px"}} className="nosb">
        {msgs.map(m=><HomeChatMsg key={m.id} msg={m} isNew={newIds.has(m.id)}/>)}
        {loading && (
          <div style={{display:"flex",alignItems:"flex-end",gap:8,marginBottom:12,animation:"fadeUp .3s both"}}>
            <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg,var(--c),var(--c2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>✦</div>
            <div style={{padding:"12px 16px",borderRadius:"4px 18px 18px 18px",background:"linear-gradient(135deg,rgba(0,229,255,.08),rgba(124,106,247,.06))",border:"1px solid rgba(0,229,255,.16)",display:"flex",gap:5,alignItems:"center"}}>
              {[0,1,2].map(i=>(<div key={i} style={{width:7,height:7,borderRadius:"50%",background:"var(--c)",animation:`pulse 1.1s ease ${i*0.22}s infinite`}}/>))}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      {/* Quick chips */}
      {msgs.length <= 2 && (
        <div style={{padding:"8px 14px",display:"flex",gap:6,flexWrap:"wrap",flexShrink:0,animation:"fadeIn .4s .2s both"}}>
          {quickQ.map(q=>(
            <button key={q} onClick={()=>send(q)} style={{padding:"6px 12px",borderRadius:50,border:"1.5px solid rgba(0,229,255,.2)",background:"rgba(0,229,255,.05)",color:"var(--txt2)",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--c)";e.currentTarget.style.color="var(--c)";e.currentTarget.style.background="var(--cdim)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b2)";e.currentTarget.style.color="var(--txt2)";e.currentTarget.style.background="rgba(0,229,255,.05)"}}>
              {q}
            </button>
          ))}
        </div>
      )}
      {/* Input */}
      <div style={{padding:"10px 14px",borderTop:"1.5px solid rgba(255,255,255,.06)",background:"linear-gradient(145deg,rgba(16,16,40,.98),rgba(10,10,26,.99))",flexShrink:0}}>
        <div style={{display:"flex",gap:8,alignItems:"center",background:"linear-gradient(145deg,rgba(22,22,52,.97),rgba(14,14,34,.99))",border:"1.5px solid rgba(0,229,255,.2)",borderRadius:50,padding:"7px 7px 7px 16px"}}>
          <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Ask anything about Collancer Home…" style={{flex:1,background:"none",border:"none",outline:"none",boxShadow:"none",color:"var(--txt)",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}/>
          <button onClick={()=>send()} disabled={loading||!input.trim()} style={{width:36,height:36,borderRadius:"50%",border:"none",flexShrink:0,background:(!input.trim()||loading)?"linear-gradient(145deg,rgba(15,15,35,.96),rgba(9,9,22,.98))":"linear-gradient(135deg,var(--c),var(--c2))",display:"flex",alignItems:"center",justifyContent:"center",cursor:(!input.trim()||loading)?"default":"pointer",fontSize:16,color:(!input.trim()||loading)?"var(--txt2)":"var(--bg)",transition:"all .2s",boxShadow:(!input.trim()||loading)?"none":"0 0 12px rgba(0,229,255,.4)"}}>
            {loading?<span style={{fontSize:14,animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>:"↑"}
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeChatMsg({ msg, isNew }) {
  const [shown, setShown] = useState(isNew && msg.role==="assistant" ? "" : msg.text);
  const [done,  setDone]  = useState(!isNew || msg.role==="user");
  useEffect(()=>{
    if (!isNew||msg.role!=="assistant") return;
    let i=0; const speed=Math.max(8,Math.min(20,2000/msg.text.length));
    const iv=setInterval(()=>{ i++; setShown(msg.text.slice(0,i)); if(i>=msg.text.length){clearInterval(iv);setDone(true);} },speed);
    return ()=>clearInterval(iv);
  },[]);
  const isBot = msg.role==="assistant";
  return (
    <div style={{display:"flex",justifyContent:isBot?"flex-start":"flex-end",alignItems:"flex-end",gap:8,marginBottom:12,animation:"fadeUp .35s cubic-bezier(.16,1,.3,1) both"}}>
      {isBot && <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg,var(--c),var(--c2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:"0 0 12px rgba(0,229,255,.3)"}}>✦</div>}
      <div style={{maxWidth:"80%",padding:"11px 14px",borderRadius:isBot?"4px 18px 18px 18px":"18px 18px 4px 18px",background:isBot?"linear-gradient(135deg,rgba(0,229,255,.08),rgba(124,106,247,.06))":"linear-gradient(135deg,var(--c),var(--c2))",color:isBot?"var(--txt)":"var(--bg)",border:isBot?"1px solid rgba(0,229,255,.16)":"none",fontSize:13,lineHeight:1.7,boxShadow:isBot?"0 2px 16px rgba(0,0,0,.3)":"0 4px 20px rgba(0,229,255,.25)"}}>
        {shown}
        {!done&&<span style={{display:"inline-block",width:2,height:13,background:isBot?"var(--c)":"var(--bg)",marginLeft:2,verticalAlign:"text-bottom",animation:"pulse .7s ease infinite",borderRadius:1}}/>}
      </div>
    </div>
  );
}

// ── Loading Screen ────────────────────────────────────

export {
  // Styles
  MediaLightbox, Logo, HomeLogo, CleoLogo, Styles, AnimBg, Particles,
  // Constants
  FIREBASE_CONFIG, INFS, CAMPS, NOTIFS, NICHES, PLATFORMS, CITIES,
  CLOUDINARY_CLOUD, CLOUDINARY_PRESET, CAT_ICONS, FILTER_ICONS,
  PROMOTION_CATEGORIES, CREATOR_PROMO_CATEGORIES, AD_PLANS, PROMO_TYPES,
  PRO_FEATURES, PRO_PLANS, CHAT_STORAGE_KEY_HOME, MIN_FOLLOWERS,
  DEMO_TYPES, DEMO_FORMATS, HOME_PRIVACY, HOME_TERMS,
  // Utils
  inr, fmtK, fmtKPlus, fmt, fmtTime,
  writeBookingToFirebase, saveReviewToFirebase, compressImage,
  uploadPfpToStorage, uploadCreatorPfp, getPromoPrice, getBasePrice,
  loadChats, saveChats, makeWelcome, getPromoTypesForPlatform, uploadThumbnail,
  // Components
  Avatar, PlatIcon, Stars, ReviewStars, StatBox, InfCard, RatingBox,
  SecHead, Grid, Toast, LogoutConfirmModal, CreatorLogoutModal,
  BookModal, WriteReviewModal, BookingDetailModal, BookingCard,
  CategoryPicker, PromoDemoSection,
  Nav, NotifPanel, Footer, CreatorNav, BottomTabs,
  BusinessAuthScreen, CreatorAuthScreen,
  BizSplashScreen, RoleSelectPage,
  DiscoverPage, HeroMemo, Hero, FilterBar,
  ProfilePage, DashPage, WalletPage, ReferralPage, ReferralPayoutSection,
  ProFeatureModal, ProSuccessPopup, ProStatusPage, CollancerProPage,
  LegalPage, ChatMsg, SupportPage, VoiceBot,
  DashboardPage, BookingsPage, CreatorProfilePage, EarningsPage,
  AdCampaignPage, VerificationRequestPage, SetPromotionModal,
  HomeLegalPage, HomeSupportPage, HomeChatMsg,
};
