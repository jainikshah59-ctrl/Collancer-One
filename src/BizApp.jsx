/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import {
  // Styles & layout
  Styles, AnimBg, Logo, CleoLogo,
  // Constants
  INFS, CAMPS, NOTIFS, PROMOTION_CATEGORIES, CAT_ICONS, FILTER_ICONS,
  PRO_FEATURES, PRO_PLANS, PROMO_TYPES, PLATFORMS, CITIES, NICHES,
  CLOUDINARY_CLOUD, CLOUDINARY_PRESET,
  CHAT_STORAGE_KEY_HOME,
  // Utils
  inr, fmtK, fmtKPlus, fmt, fmtTime,
  writeBookingToFirebase, saveReviewToFirebase, compressImage, uploadPfpToStorage,
  loadChats, saveChats, makeWelcome, getPromoPrice, getBasePrice,
  // Components
  Nav, NotifPanel, Footer, BusinessAuthScreen,
  Avatar, PlatIcon, Stars, ReviewStars, StatBox, InfCard, RatingBox,
  SecHead, Grid, Toast, LogoutConfirmModal, BookModal, WriteReviewModal,
  // Pages
  DiscoverPage, HeroMemo, Hero, FilterBar,
  ProfilePage, DashPage, WalletPage, ReferralPage, ReferralPayoutSection,
  ProFeatureModal, ProSuccessPopup, ProStatusPage, CollancerProPage,
  LegalPage, ChatMsg, SupportPage, VoiceBot,
} from './shared';

function BizApp() {
  const [page, setPage] = useState("discover");
  const [selInf, setSelInf] = useState(null);
  const [bookInf, setBookInf] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [userReviews, setUserReviews] = useState({});
  const [bizName, setBizName] = useState("");
  const [bizPfp, setBizPfp] = useState("");
  const [campaigns, setCampaigns] = useState([...CAMPS]);
  const [notifs, setNotifs] = useState([...NOTIFS]);
  const [toast, setToast] = useState(null);
  const [extraCreators, setExtraCreators] = useState([]);
  const [boostedCreatorIds, setBoostedCreatorIds] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [bizData, setBizData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [fbNetworkError, setFbNetworkError] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [rejectionToast, setRejectionToast] = useState(null);
  const [proModal, setProModal] = useState(null);
  const [showProPage, setShowProPage] = useState(false);
  const [isPro, setIsPro] = useState(false); // true when business has active Pro plan
  const [proSuccessPlan, setProSuccessPlan] = useState(null); // holds plan object after purchase — shows popup
  const [driveNotif, setDriveNotif] = useState(null); // drive link popup for business
  // Stable refs — survive auth state changes without triggering re-renders
  const shownBizNotifIds = useRef(new Set()); // prevents re-toasting notifs on reconnect
  const notifCount = notifs.filter(n=>!n.read).length;

  useEffect(() => {
    loadFirebase();
    onFbReady(() => {
      // If Firebase failed to load (network blocked / sandbox / timeout), show error screen
      if (!window.__cauthOps || !window.__cfs || !window.__cdb || !window.__cauth) {
        setFbNetworkError(true);
        setAuthChecked(true);
        return;
      }

      const { onAuthStateChanged } = window.__cauthOps;
      // Track all active listeners so we can clean them up on auth change
      const activeUnsubs = [];

      try {
        onAuthStateChanged(window.__cauth, async (user) => {
          // Clean up any previously attached listeners before setting up new ones
          activeUnsubs.forEach(fn => fn());
          activeUnsubs.length = 0;

          if (user) {
            const { doc, collection, onSnapshot, query, where } = window.__cfs;

            try {
              // Real-time listener on business doc — always stays in sync incl. pfp and wallet changes
              activeUnsubs.push(onSnapshot(doc(window.__cdb, "businesses", user.uid), snap => {
                if (!snap.exists()) { setAuthChecked(true); return; }
                const data = snap.data();
                setAuthUser(user);
                setBizData(data);
                setBizName(n => n || data.bizName || "");
                const snapshotPfp = data.pfp || "";
                setBizPfp(snapshotPfp);
                setWalletBalance(data.walletBalance || 0);
                setIsPro(data.isPro === true || data.proActive === true);
              }, (err) => { console.error('businesses snapshot error:', err); setAuthChecked(true); }));

              // Listen for drive link + promotion_completed notifications from creators/admin
              const driveNotifQ = query(collection(window.__cdb,"bizNotifs"), where("bizId","==",user.uid), where("type","in",["drive_link_shared","promotion_completed"]));
              activeUnsubs.push(onSnapshot(driveNotifQ, driveSnap => {
                const unread = driveSnap.docs.filter(d=>!d.data().read).map(d=>({id:d.id,...d.data()}));
                if (unread.length > 0) {
                  const n = unread[0];
                  if (n.type === "drive_link_shared") {
                    setDriveNotif({ type:"drive", bookingId:n.bookingId, link:n.driveLink, creatorName:n.creatorName });
                  } else if (n.type === "promotion_completed") {
                    setDriveNotif({ type:"completed", bookingId:n.bookingId, link:n.videoLink, creatorName:n.creatorName, promoType:n.promoType });
                  }
                  // Mark as read
                  try { const {doc,updateDoc}=window.__cfs; updateDoc(doc(window.__cdb,"bizNotifs",n.id),{read:true}); } catch(e){}
                }
              }));

              const campQ = query(collection(window.__cdb, "bizCampaigns"), where("bizId", "==", user.uid));
              activeUnsubs.push(onSnapshot(campQ, snap2 => {
                // Cache display metadata only — status comes from bookings collection below
                const data2 = snap2.docs.map(d => ({ ...d.data(), _campId: d.id, id: d.id }));
                data2.sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
                // Store in window cache so bookings merger can access it
                window.__bizCampaignsCache = {};
                data2.forEach(c => { window.__bizCampaignsCache[c._campId] = c; });
              }, (err) => console.error('bizCampaigns snapshot error:', err)));

              const notifQ = query(collection(window.__cdb, "bizNotifs"), where("bizId", "==", user.uid));
              let firstNotifLoad = true;
              // Use stable ref (shownBizNotifIds) so notif IDs persist across auth state changes
              // — prevents re-toasting the same rejection when user logs in/out/in
              activeUnsubs.push(onSnapshot(notifQ, snap3 => {
                const data3 = snap3.docs.map(d => ({ ...d.data(), id: d.id }));
                data3.sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
                if (data3.length) setNotifs(data3);
                // On first load — seed the stable ref so pre-existing notifs never toast
                if (firstNotifLoad) {
                  data3.forEach(n => shownBizNotifIds.current.add(n.id));
                  firstNotifLoad = false;
                  return;
                }
                // Only fire live-alert for brand new, unread, booking_rejected notifs
                const brandNew = data3.filter(n =>
                  !shownBizNotifIds.current.has(n.id) &&
                  !n.read &&
                  n.type === "booking_rejected"
                );
                if (brandNew.length > 0) {
                  setRejectionToast(brandNew[0]);
                  setTimeout(()=>setRejectionToast(null), 7000);
                }
                // Seed all current IDs so they never re-trigger
                data3.forEach(n => shownBizNotifIds.current.add(n.id));
              }, (err) => console.error('bizNotifs snapshot error:', err)));
            } catch(e) {
              console.error('Firestore listener setup error:', e);
            }
          }
          setAuthChecked(true);
        });
      } catch(e) {
        console.error('onAuthStateChanged error:', e);
        setFbNetworkError(true);
        setAuthChecked(true);
      }

      try {
        const { collection, onSnapshot } = window.__cfs;
      onSnapshot(collection(window.__cdb, "creators"), snap => {
        const fbCreators = snap.docs.map(d => ({ ...d.data(), id: d.id, uid: d.id }));
        // Stable numeric id from uid so profile updates don't shift indices
        const uidToStableId = (uid) => {
          let h = 0;
          for (let c of uid) h = (h * 31 + c.charCodeAt(0)) >>> 0;
          return 10000 + (h % 90000);
        };
        const newOnes = fbCreators
          .filter(fc => !!fc.addedToCollancer)      // only show creators who opted in
          .filter(fc => !fc.banned)                  // never show banned creators
          .filter(fc => !fc.hasActiveBooking)        // hide while booking is active
          // Don't de-dup against hardcoded INFS — real creators should always show
          .map((fc) => ({
            ...fc,                                    // ALL fields pass through for instant sync
            id: uidToStableId(fc.id),
            uid: fc.id,                               // raw Firestore ID — used for boosted lookup
            price:      fc.price      || 0,
            followers:  fc.followers  || 0,
            engagement: fc.engagement || 0,
            rating:     fc.rating     || 0,
            avgViews:   fc.avgViews   || 0,
            reach:      fc.reach      || 0,
            reviews:    fc.reviews    || [],
            tags:       fc.tags       || [],
            verified:   fc.verified   || false,
            trending:   fc.trending   || false,
            featured:   fc.featured   || false,
            prices:     fc.prices     || { story:0, reel:0, video:0, personalad:0 },
            promotionTypes: fc.promotionTypes || [],
            pfp:        fc.pfp        || "",
            boosted:    fc.boosted    || false,
            boostEndsAt:fc.boostEndsAt|| 0,
            updatedAt:  fc.updatedAt  || null,       // keep so React sees object as changed
          }));
        setExtraCreators(newOnes);
      });

      onSnapshot(collection(window.__cdb, "reviews"), snap => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const byCreatorId = {};
        all.forEach(r => {
          if (!byCreatorId[r.creatorId]) byCreatorId[r.creatorId] = [];
          byCreatorId[r.creatorId].push(r);
        });
        // Sort each creator's reviews newest first
        Object.keys(byCreatorId).forEach(k => {
          byCreatorId[k].sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
        });
        setUserReviews(prev => {
          const mapped = { ...prev };
          // Map reviews for hardcoded INFS (uid stored on the object)
          INFS.forEach(inf => {
            if (inf.uid && byCreatorId[inf.uid]) mapped[inf.id] = byCreatorId[inf.uid];
          });
          // Also map reviews for Firebase creators (extraCreators) —
          // their inf.uid === Firestore doc ID === creatorId used when saving reviews
          // We store them in a ref so the snapshot closure can access updated extraCreators
          if (window.__collancerExtraCreators) {
            window.__collancerExtraCreators.forEach(inf => {
              if (inf.uid && byCreatorId[inf.uid]) mapped[inf.id] = byCreatorId[inf.uid];
            });
          }
          return mapped;
        });
      });

      // Listen for ALL ad campaigns — store per-creator boosted categories
      onSnapshot(collection(window.__cdb, "adCampaigns"), snap => {
        const now = Date.now();
        const activeAds = snap.docs
          .map(d => ({ ...d.data(), _docId: d.id }))
          .filter(a => a.status === "active" && a.endsAt > now);
        // boostedCreatorIds: simple list for backward compat (used for gold card styling)
        const activeIds = activeAds.map(a => a.creatorId).filter(Boolean);
        setBoostedCreatorIds(activeIds);
        // Store per-creator ad categories globally so DiscoverPage can use them
        const byCat = {};
        activeAds.forEach(a => {
          if (!a.creatorId) return;
          (a.categories || []).forEach(catId => {
            if (!byCat[catId]) byCat[catId] = [];
            if (!byCat[catId].includes(a.creatorId)) byCat[catId].push(a.creatorId);
          });
        });
        window.__boostedByCategory = byCat;
        window.__boostedCreatorIds = activeIds;
      });
      } catch(e) { console.error('Global Firestore listeners error:', e); }
    });
  }, []);

  // ── Keep selInf live: if viewing a Firebase creator's profile and their data changes, refresh it ──
  useEffect(() => {
    if (!selInf || !selInf.uid) return; // only for Firebase creators
    const updated = extraCreators.find(c => c.uid === selInf.uid);
    if (updated && JSON.stringify(updated) !== JSON.stringify(selInf)) {
      setSelInf(updated);
    }
  }, [extraCreators]);

  useEffect(() => {
    // Keep window ref in sync so the reviews onSnapshot closure can access latest extraCreators
    window.__collancerExtraCreators = extraCreators;
    if (!extraCreators.length || !window.__cfs) return;
    const { collection, getDocs } = window.__cfs;
    getDocs(collection(window.__cdb, "reviews")).then(snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const byCreatorId = {};
      all.forEach(r => {
        if (!byCreatorId[r.creatorId]) byCreatorId[r.creatorId]=[];
        byCreatorId[r.creatorId].push(r);
      });
      Object.keys(byCreatorId).forEach(k => {
        byCreatorId[k].sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
      });
      setUserReviews(prev => {
        const mapped = { ...prev };
        extraCreators.forEach(inf => {
          if (inf.uid && byCreatorId[inf.uid]) mapped[inf.id] = byCreatorId[inf.uid];
        });
        return mapped;
      });
    }).catch(()=>{});
  }, [extraCreators]);

  // ── CAMPAIGNS — bookings collection is the single source of truth for status ──
  // All status changes (Active→Completed, Cancelled, PendingCompletion) happen in
  // `bookings`. We listen to bookings by bizId and merge with bizCampaigns display
  // metadata (brief, productName etc) which is cached in window.__bizCampaignsCache.
  // This ensures every status change from admin/creator reflects in <1 second.
  useEffect(() => {
    if (!authUser?.uid || !window.__cfs) return;
    const { collection, query, where, onSnapshot } = window.__cfs;
    const bookQ = query(collection(window.__cdb, "bookings"), where("bizId", "==", authUser.uid));
    const unsub = onSnapshot(bookQ, snap => {
      const bookingDocs = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      bookingDocs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      if (!bookingDocs.length) return;

      const merged = bookingDocs.map(b => {
        // Find matching bizCampaigns display record — linked by bizCampaignId or by creatorId+promoType
        const cache = window.__bizCampaignsCache || {};
        let display = (b.bizCampaignId && cache[b.bizCampaignId]) ||
          Object.values(cache).find(c => c.creatorId === b.creatorId && c.promoType === b.promoType) || {};

        // PendingCompletion shows as "Active" to the business (they just see "in progress")
        const displayStatus = b.status === "PendingCompletion" ? "Active" : (b.status || "Active");

        return {
          ...display,                             // display metadata (brief, productName, reach…)
          id: b.id,                               // booking doc ID as the canonical id
          bizId: b.bizId,
          influencer: b.creatorName || display.influencer || "",
          handle: b.creatorHandle || display.handle || "",
          platform: b.creatorPlatform || display.platform || "",
          promoType: b.promoType,
          promoLabel: b.promoLabel || display.promoLabel || b.promoType,
          amount: b.amount || display.budget || 0,
          budget: b.amount || display.budget || 0,
          status: displayStatus,                  // authoritative from bookings
          rejectionReason: b.rejectionReason || "",
          start: b.start || display.start || "",
          end: b.end || display.end || "",
          reach: display.reach || "",
          productName: b.productName || display.productName || "",
          brief: b.brief || display.brief || "",
          promotionCategory: b.promotionCategory || display.promotionCategory || "",
          targetAudience: b.targetAudience || display.targetAudience || "",
          hashtags: b.hashtags || display.hashtags || "",
          creatorId: b.creatorId || display.creatorId || null,
          creatorLocalId: display.creatorLocalId || null,
        };
      });

      setCampaigns(merged);
    }, err => console.error("bookings source-of-truth error:", err));
    return () => unsub();
  }, [authUser?.uid]);

  const persistBiz = async (uid, updates) => {
    if (!window.__cfs || !uid) return;
    const { doc, updateDoc } = window.__cfs;
    try { await updateDoc(doc(window.__cdb, "businesses", uid), updates); } catch(e){}
  };

  const handleBizAuth = (user, data) => {
    setAuthUser(user); setBizData(data);
    setBizName(data.bizName || ""); setBizPfp(data.pfp || "");
  };

  const handleBizLogout = async () => {
    const { signOut } = window.__cauthOps;
    await signOut(window.__cauth);
    setAuthUser(null); setBizData(null);
    setBizName(""); setBizPfp("");
    setCampaigns([...CAMPS]); setNotifs([...NOTIFS]);
  };

  const saveBizPfp = async (pfpDataUrl) => {
    // Update local state immediately so UI reflects the change right away
    setBizPfp(pfpDataUrl);
    // Persist base64 directly to Firestore — no Cloudinary, no race condition
    if (authUser) {
      await persistBiz(authUser.uid, { pfp: pfpDataUrl });
    }
  };

  const saveBizName = async (name) => {
    setBizName(name);
    if (authUser) persistBiz(authUser.uid, { bizName: name });
  };

  const addReview = async (infId, review, creatorUid) => {
    // Optimistically add to local state for instant UI feedback
    if (infId) setUserReviews(prev => ({ ...prev, [infId]: [review, ...(prev[infId]||[])] }));
    // Resolve uid: use directly passed uid, or look up from INFS/extraCreators
    const inf = [...INFS, ...extraCreators].find(i => i.id === infId);
    const uid = creatorUid || inf?.uid || null;
    if (!uid) {
      console.warn("addReview: no creatorUid found for infId", infId);
      return;
    }
    await saveReviewToFirebase(uid, { ...review, bizPfp, bizName: displayName });
    // Re-read from Firestore so local state always reflects what's actually stored
    if (window.__cfs) {
      try {
        const { collection, query, where, getDocs } = window.__cfs;
        const q = query(collection(window.__cdb,"reviews"), where("creatorId","==",uid));
        const snap = await getDocs(q);
        const fresh = snap.docs.map(d=>({id:d.id,...d.data()}));
        fresh.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
        // Update by both infId (local key) and uid (for real-time sync)
        if (infId) setUserReviews(prev => ({ ...prev, [infId]: fresh }));
        // Also update extraCreators entry keyed by uid for onSnapshot to pick up
        if (window.__collancerExtraCreators) {
          const ecInf = window.__collancerExtraCreators.find(i => i.uid === uid);
          if (ecInf) setUserReviews(prev => ({ ...prev, [ecInf.id]: fresh }));
        }
      } catch(e) { console.error("Re-read reviews error:", e); }
    }
  };

  const addCampaign = async (inf, promoKey, promoPrice, bookingData={}) => {
    const today = new Date();
    const end = new Date(today); end.setDate(end.getDate()+7);
    const fmt2 = d => d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"});
    const bizUid = authUser?.uid || "guest";
    const camp = {
      bizId: bizUid,
      id: Date.now().toString(),
      influencer: inf.name, handle: inf.handle,
      platform: inf.platform, status: "Pending",
      start: fmt2(today), end: fmt2(end),
      budget: promoPrice, reach: fmtKPlus(inf.reach||inf.followers),
      promoType: promoKey, promoLabel: bookingData.promoLabel||promoKey,
      productName: bookingData.productName||"", brief: bookingData.brief||"",
      promotionCategory: bookingData.promotionCategory||"",
      rejectionReason: "",
      creatorId: inf.uid || null,
      creatorLocalId: inf.id,
    };
    if (authUser && window.__cfs) {
      try {
        const { addDoc: addD, collection: col, doc: docRef, updateDoc: updD, serverTimestamp: sTs } = window.__cfs;
        // Write bizCampaigns doc for display metadata, get its ID to link with bookings
        const campRef = await addD(col(window.__cdb, "bizCampaigns"), { ...camp, createdAt: sTs() });
        const bizCampaignId = campRef.id;
        // Deduct from wallet if enough balance
        if (walletBalance >= promoPrice && bizUid !== "guest") {
          const newBal = walletBalance - promoPrice;
          await updD(docRef(window.__cdb,"businesses",bizUid), { walletBalance: newBal });
          await addD(col(window.__cdb,"walletTransactions"), {
            bizId: bizUid, type:"booking_deduction",
            amount: promoPrice, method:"Wallet",
            creatorName: inf.name, promoType: promoKey,
            balanceAfter: newBal,
            createdAt: sTs(),
          });
          setWalletBalance(newBal);
        }
        // Pass bizCampaignId to writeBookingToFirebase so bookings doc links back
        writeBookingToFirebase(inf, promoKey, promoPrice, bookingData, displayName, bizUid, bookingData.promotionCategory||"", bizCampaignId, bizPfp||"", isPro||false);
      } catch(e) {
        console.error("addCampaign write error:", e);
        // Optimistic fallback — bookings listener will correct this when it fires
        setCampaigns(prev => [{ ...camp, status:"Active" }, ...prev]);
        writeBookingToFirebase(inf, promoKey, promoPrice, bookingData, displayName, bizUid, bookingData.promotionCategory||"", "", bizPfp||"", isPro||false);
      }
    } else {
      setCampaigns(prev => [camp, ...prev]);
      writeBookingToFirebase(inf, promoKey, promoPrice, bookingData, displayName, bizUid, bookingData.promotionCategory||"", "", bizPfp||"", isPro||false);
    }
    const notif = { bizId: bizUid, type:"success", icon:"✓", text:`Booking confirmed with ${inf.name}`, time:"Just now", read:false };
    if (authUser && window.__cfs) {
      try {
        const { addDoc, collection, serverTimestamp } = window.__cfs;
        await addDoc(collection(window.__cdb, "bizNotifs"), { ...notif, createdAt: serverTimestamp() });
      } catch(e) { setNotifs(prev => [{ ...notif, id: Date.now() }, ...prev]); }
    } else {
      setNotifs(prev => [{ ...notif, id: Date.now() }, ...prev]);
    }
    setToast({ name: inf.name, promo: promoKey, price: promoPrice });
    setTimeout(() => setToast(null), 4000);
  };

  const selectInf = React.useCallback(inf => { window.scrollTo({top:0,behavior:"instant"}); setSelInf(inf); }, []);
  const goPage = React.useCallback(p => { setPage(p); setSelInf(null); }, []);

  const displayName = bizName.trim() || bizData?.bizName || "Your Business";
  const initials = displayName !== "Your Business"
    ? displayName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() : "BZ";

  const handleProClick = React.useCallback((feature) => { setProModal(feature); }, []);
  const handleSeePlans = React.useCallback(() => { setProModal(null); setShowProPage(true); }, []);

  const pageContent = React.useMemo(() => {
    if (!authUser || !bizData) return null;
    if (showProPage) return isPro
      ? <ProStatusPage onBack={()=>setShowProPage(false)} bizData={bizData}/>
      : <CollancerProPage onBack={()=>setShowProPage(false)} authUser={authUser} onProPurchased={(plan)=>{ setIsPro(true); setShowProPage(false); setProSuccessPlan(plan); }}/>;
    if (selInf) return <ProfilePage inf={selInf} userReviews={userReviews[selInf.id]||[]} bizName={displayName} initials={initials} bizPfp={bizPfp} onBack={()=>setSelInf(null)} onBook={()=>setBookInf(selInf)} onProClick={handleProClick} isPro={isPro}/>;
    if (page==="discover") return <DiscoverPage onSelect={selectInf} searchTerm={searchTerm} setSearchTerm={setSearchTerm} extraCreators={extraCreators} boostedCreatorIds={boostedCreatorIds} onProClick={handleProClick} isPro={isPro}/>;
    if (page==="dashboard") return <DashPage campaigns={campaigns} setCampaigns={setCampaigns} notifs={notifs} userReviews={userReviews} onAddReview={addReview} bizName={displayName} initials={initials} bizPfp={bizPfp} setBizPfp={saveBizPfp} setBizName={saveBizName} rawBizName={bizName} onLogout={handleBizLogout} extraCreators={extraCreators} onPrivacy={()=>goPage("privacy")} onTerms={()=>goPage("terms")} isPro={isPro} onGoToPro={()=>goPage("pro")}/>;
    if (page==="wallet") return <WalletPage authUser={authUser} bizData={bizData} walletBalance={walletBalance} onBalanceUpdate={setWalletBalance}/>;
    if (page==="referral") return <ReferralPage/>;
    if (page==="pro") return isPro
      ? <ProStatusPage onBack={()=>goPage("discover")} bizData={bizData}/>
      : <CollancerProPage onBack={()=>goPage("discover")} authUser={authUser} onProPurchased={(plan)=>{ setIsPro(true); setProSuccessPlan(plan); goPage("discover"); }}/>;
    if (page==="privacy") return <LegalPage type="privacy" onBack={()=>goPage("dashboard")}/>;
    if (page==="terms") return <LegalPage type="terms" onBack={()=>goPage("dashboard")}/>;
    if (page==="support") return <SupportPage onBack={()=>goPage("discover")}/>;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showProPage, isPro, selInf, page, searchTerm, extraCreators, boostedCreatorIds, campaigns, notifs, userReviews, displayName, initials, bizPfp, walletBalance, bizData, authUser]);


  // Network / Firebase error screen — Firebase SDK blocked or timed out
  if (fbNetworkError) return (
    <><Styles/><AnimBg/>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",gap:20,padding:"0 28px",position:"relative",zIndex:1,textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:24,
          background:"linear-gradient(135deg,rgba(255,171,64,.18),rgba(255,171,64,.06))",
          border:"1px solid rgba(255,171,64,.4)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>
          📡
        </div>
        <div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,marginBottom:8}}>
            Can't connect to Collancer
          </div>
          <div style={{fontSize:13,color:"var(--txt2)",lineHeight:1.8,maxWidth:310}}>
            The app couldn't reach Firebase services. This usually happens in a restricted preview environment.
            <br/><br/>
            <strong style={{color:"var(--txt)"}}>To use the app:</strong> open it directly at your hosted URL or in a browser where network access is unrestricted.
          </div>
        </div>
        <button onClick={()=>window.location.reload()}
          style={{background:"linear-gradient(135deg,var(--c),var(--c2))",border:"none",
            borderRadius:50,padding:"12px 28px",color:"var(--bg)",fontSize:14,fontWeight:700,
            cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
          ↻ Retry Connection
        </button>
        <div style={{fontSize:11,color:"var(--txt2)"}}>
          Need help? <strong style={{color:"var(--c)"}}>support@collancer.in</strong>
        </div>
      </div>
    </>
  );

  if (!authChecked) return (
    <><Styles/><AnimBg/>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,zIndex:1,position:"relative"}}>
        <Logo size={48}/>
        <div style={{display:"flex",gap:6}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"var(--c)",animation:`pulse 1.2s ease ${i*.2}s infinite`}}/>)}</div>
      </div>
    </>
  );

  if (!authUser || !bizData) return (<><Styles/><AnimBg/><BusinessAuthScreen onAuth={handleBizAuth}/></>);

  return (
    <><Styles/><AnimBg/>
      <div style={{position:"relative",zIndex:1,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <Nav page={selInf?"discover":page} setPage={goPage} notifCount={notifCount} setShowNotif={setShowNotif} initials={initials} bizPfp={bizPfp} isPro={isPro}/>
        {showNotif && <NotifPanel notifs={notifs} onClose={()=>setShowNotif(false)}/>}
        <main style={{flex:1,paddingTop:56,paddingBottom:page==="support"?0:68,display:"flex",flexDirection:"column"}}>{pageContent}</main>
        {page !== "support" && <Footer onNav={goPage}/>}
      </div>
      <Toast toast={toast}/>

      {/* Global Promotion Completed / Drive Link Popup */}
      {driveNotif && (
        <div className="mbg" style={{zIndex:3000}} onClick={e=>e.target===e.currentTarget&&setDriveNotif(null)}>
          <div className="mbox" style={{padding:0,overflow:"hidden",maxWidth:360,borderRadius:32,
            border:`1px solid ${driveNotif.type==="completed"?"rgba(0,230,118,.5)":"rgba(156,106,247,.5)"}`,
            boxShadow:`0 0 0 1px ${driveNotif.type==="completed"?"rgba(0,230,118,.15)":"rgba(156,106,247,.15)"},0 40px 100px rgba(0,0,0,.9),0 0 60px ${driveNotif.type==="completed"?"rgba(0,230,118,.2)":"rgba(156,106,247,.2)"}`}}>
            <div style={{padding:"28px 22px 24px",position:"relative",textAlign:"center",
              background:`linear-gradient(180deg,${driveNotif.type==="completed"?"rgba(0,230,118,.1)":"rgba(156,106,247,.12)"} 0%,transparent 100%)`}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,
                background:driveNotif.type==="completed"
                  ?"linear-gradient(90deg,transparent,#00e676,#00bcd4,#00e676,transparent)"
                  :"linear-gradient(90deg,transparent,#9c6af7,#ffab40,#9c6af7,transparent)"}}/>

              <div style={{width:68,height:68,borderRadius:24,margin:"0 auto 16px",
                background:driveNotif.type==="completed"
                  ?"linear-gradient(135deg,rgba(0,230,118,.2),rgba(0,188,212,.1))"
                  :"linear-gradient(135deg,rgba(156,106,247,.25),rgba(156,106,247,.08))",
                border:driveNotif.type==="completed"?"1px solid rgba(0,230,118,.4)":"1px solid rgba(156,106,247,.4)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,
                boxShadow:driveNotif.type==="completed"?"0 8px 32px rgba(0,230,118,.25)":"0 8px 32px rgba(156,106,247,.25)"}}>
                {driveNotif.type==="completed"?"🎉":"📁"}
              </div>

              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,
                marginBottom:8,
                background:driveNotif.type==="completed"
                  ?"linear-gradient(135deg,#00e676,#00bcd4)"
                  :"linear-gradient(135deg,#9c6af7,#ffab40)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                {driveNotif.type==="completed"?"Promotion Complete!":"Personal Ad Delivered!"}
              </div>

              <p style={{fontSize:13,color:"var(--txt2)",lineHeight:1.75,marginBottom:16}}>
                <strong style={{color:"var(--txt)"}}>{driveNotif.creatorName}</strong>{" "}
                {driveNotif.type==="completed"
                  ? `has completed your ${driveNotif.promoType||"promotion"}. View the content below.`
                  : "has delivered your Personal Ad video via Google Drive."}
              </p>

              {driveNotif.link && (
                <div style={{background:driveNotif.type==="completed"?"rgba(0,230,118,.08)":"rgba(156,106,247,.08)",
                  border:driveNotif.type==="completed"?"1px solid rgba(0,230,118,.25)":"1px solid rgba(156,106,247,.25)",
                  borderRadius:16,padding:"12px 14px",marginBottom:16,textAlign:"left"}}>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:.8,marginBottom:6,
                    color:driveNotif.type==="completed"?"var(--grn)":"#9c6af7"}}>
                    {driveNotif.type==="completed"?"🎬 PROMOTED CONTENT LINK":"📁 GOOGLE DRIVE LINK"}
                  </div>
                  <a href={driveNotif.link} target="_blank" rel="noopener noreferrer"
                    style={{fontSize:12,color:driveNotif.type==="completed"?"var(--c)":"#9c6af7",
                      wordBreak:"break-all",lineHeight:1.6}}>
                    🔗 {driveNotif.link}
                  </a>
                </div>
              )}

              <div style={{display:"flex",gap:8}}>
                {driveNotif.link && (
                  <a href={driveNotif.link} target="_blank" rel="noopener noreferrer"
                    style={{flex:2,padding:"13px",border:"none",borderRadius:18,
                      background:driveNotif.type==="completed"
                        ?"linear-gradient(135deg,#00e676,#00c853)"
                        :"linear-gradient(135deg,#9c6af7,#7c4af7)",
                      color:"#fff",fontSize:13,fontWeight:800,textDecoration:"none",textAlign:"center",
                      fontFamily:"'Plus Jakarta Sans',sans-serif",
                      boxShadow:driveNotif.type==="completed"
                        ?"0 6px 0 #00813a,0 8px 20px rgba(0,230,118,.4)"
                        :"0 6px 0 #5a2eb5,0 8px 20px rgba(156,106,247,.4)",
                      display:"block"}}>
                    {driveNotif.type==="completed"?"View Content →":"Open in Drive →"}
                  </a>
                )}
                <button onClick={()=>setDriveNotif(null)}
                  style={{flex:1,padding:"13px",border:"1.5px solid rgba(0,229,255,.22)",borderRadius:18,
                    background:"transparent",color:"var(--txt2)",cursor:"pointer",fontSize:12,
                    fontFamily:"'DM Sans',sans-serif"}}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pro Feature Modal */}
      {proModal && (
        <ProFeatureModal
          feature={proModal}
          onClose={()=>setProModal(null)}
          onSeePlans={handleSeePlans}
        />
      )}

      {/* Pro Purchase Success Popup — rendered at app level so it survives page unmount */}
      {proSuccessPlan && (
        <ProSuccessPopup
          plan={proSuccessPlan}
          onClose={()=>setProSuccessPlan(null)}
        />
      )}

      {/* Live Rejection / Completion Toast */}
      {rejectionToast && (
        <div style={{position:"fixed",top:66,left:0,right:0,zIndex:9999,
          display:"flex",justifyContent:"center",padding:"0 16px",pointerEvents:"none"}}>
          <div style={{width:"100%",maxWidth:398,pointerEvents:"all",
            background:rejectionToast.type==="booking_rejected"
              ?"linear-gradient(180deg,#2a0e0e 0%,#100707 100%)"
              :"linear-gradient(180deg,#0e2a1a 0%,#071810 100%)",
            border:`1px solid ${rejectionToast.type==="booking_rejected"?"#f87171":"#00e676"}`,
            borderRadius:22,padding:"14px 16px",
            boxShadow:`0 16px 48px rgba(0,0,0,.85),0 4px 12px ${rejectionToast.type==="booking_rejected"?"rgba(248,113,113,.25)":"rgba(0,230,118,.25)"}`,
            display:"flex",alignItems:"center",gap:12,position:"relative",overflow:"hidden",
            animation:"fadeUp .4s cubic-bezier(.16,1,.3,1) both"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:1,
              background:`linear-gradient(90deg,transparent,${rejectionToast.type==="booking_rejected"?"rgba(248,113,113,.4)":"rgba(0,230,118,.4)"},transparent)`}}/>
            <div style={{width:42,height:42,borderRadius:16,flexShrink:0,
              background:rejectionToast.type==="booking_rejected"?"rgba(248,113,113,.2)":"rgba(0,230,118,.2)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
              {rejectionToast.type==="booking_rejected"?"❌":"✅"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:800,
                color:rejectionToast.type==="booking_rejected"?"var(--red)":"var(--grn)",marginBottom:2}}>
                {rejectionToast.title||"Booking Update"}
              </div>
              <div style={{fontSize:11,color:"#a0a8b8",lineHeight:1.5,
                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{rejectionToast.text}</div>
            </div>
            <button onClick={()=>setRejectionToast(null)}
              style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",
                borderRadius:12,color:"#8888aa",cursor:"pointer",fontSize:14,
                padding:"4px 7px",lineHeight:1,flexShrink:0}}>✕</button>
          </div>
        </div>
      )}

      {bookInf && <BookModal inf={bookInf} bizId={authUser?.uid||""} isPro={isPro||false} onClose={()=>setBookInf(null)} onSuccess={(inf,promoKey,promoPrice,bookingData)=>{ addCampaign(inf,promoKey,promoPrice,bookingData); setBookInf(null); }}/>}
    </>
  );
}

export { BizApp };
