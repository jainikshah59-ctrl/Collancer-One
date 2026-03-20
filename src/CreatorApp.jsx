/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import {
  // Styles
  Styles, AnimBg, HomeLogo,
  // Constants
  CREATOR_PROMO_CATEGORIES, AD_PLANS, CHAT_STORAGE_KEY_HOME,
  CLOUDINARY_CLOUD, CLOUDINARY_PRESET,
  // Utils
  inr, fmtK, fmtKPlus, fmt, fmtTime,
  compressImage, uploadCreatorPfp, loadChats, saveChats,
  // Components
  CreatorNav, BottomTabs, CreatorAuthScreen, CreatorLogoutModal,
  Toast, BookingDetailModal, BookingCard, CategoryPicker, PromoDemoSection,
  // Pages
  DashboardPage, BookingsPage, CreatorProfilePage, EarningsPage,
  AdCampaignPage, VerificationRequestPage, SetPromotionModal,
  HomeLegalPage, HomeSupportPage, HomeChatMsg,
} from './shared';

function CreatorApp() {
  const [fbReady, setFbReady] = useState(false);
  const [fbNetworkError, setFbNetworkError] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [creator, setCreator] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [adPage, setAdPage] = useState(false);
  const [verifyPage, setVerifyPage] = useState(false);
  const [adToast, setAdToast] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showProfileWarning, setShowProfileWarning] = useState(false);
  const prevBookingCount = useRef(0);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    loadCreatorFirebase();
    onCreatorFirebaseReady(() => {
      // If Firebase failed to load (network blocked / timeout), show error
      if (!window.__authOps || !window.__fsOps || !window.__db || !window.__auth) {
        setFbNetworkError(true);
        setAuthChecked(true);
        return;
      }
      setFbReady(true);
      const { onAuthStateChanged } = window.__authOps;
      try {
        onAuthStateChanged(window.__auth, (user) => {
          if (user) {
            const { doc, onSnapshot } = window.__fsOps;
            let firstSnap = true;
            try {
              onSnapshot(doc(window.__db, "creators", user.uid), snap => {
                if (!snap.exists()) {
                  if (firstSnap) { firstSnap = false; setAuthChecked(true); }
                  return;
                }
                setAuthUser(user);
                setCreator(prev => {
                  const raw = snap.data();
                  const data = {
                    followers:0, ytSubscribers:0, engagement:0, avgViews:0, avgLikes:0,
                    reach:0, rating:0, price:0, bio:"", verified:false, trending:false,
                    featured:false, tags:[], reviews:[], categories:[],
                    prices:{story:0,reel:0,video:0,personalad:0},
                    active:false, addedToCollancer:false, verificationStatus:null,
                    ytConnected:false, ytTotalViews:0,
                    ...raw
                  };
                  return { ...data, id: user.uid };
                });
                if (firstSnap) { firstSnap = false; setAuthChecked(true); }
              }, (err) => {
                console.error('Firestore onSnapshot error:', err);
                if (firstSnap) { firstSnap = false; setAuthChecked(true); }
              });
            } catch(e) {
              console.error('Firestore listener setup error:', e);
              setAuthChecked(true);
            }
          } else {
            setAuthUser(null);
            setCreator(null);
            setAuthChecked(true);
          }
        });
      } catch(e) {
        console.error('onAuthStateChanged error:', e);
        setFbNetworkError(true);
        setAuthChecked(true);
      }
    });
  }, []);

  // Listen for bookings in real-time — auto-accept any Pending ones
  useEffect(() => {
    if (!creator?.id || !fbReady) return;
    const { collection, query, where, onSnapshot, doc, updateDoc } = window.__fsOps;
    const q = query(collection(window.__db, "bookings"), where("creatorId", "==", creator.id));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));

      // Auto-accept Pending bookings — but NEVER touch Completed/Cancelled/PendingCompletion
      data.forEach(b => {
        if (b.status === "Pending") {
          updateDoc(doc(window.__db,"bookings",b.id), {
            status:"Active", seenByCreator:true,
            autoAcceptedAt: new Date().toISOString()
          }).catch(()=>{});
        }
      });

      // Sync hasActiveBooking to creator doc so biz app hides/shows creator correctly
      const hasActive = data.some(b => b.status === "Active" || b.status === "PendingCompletion");
      updateDoc(doc(window.__db, "creators", creator.id), { hasActiveBooking: hasActive }).catch(()=>{});

      // Toast for genuinely new bookings — detect by count increase AND find the newest Active/Pending
      if (!isFirstLoad.current && data.length > prevBookingCount.current) {
        // Find the newest booking that just arrived (highest createdAt, Active or Pending)
        const newest = data.slice(0, data.length - prevBookingCount.current)
          .find(d => d.status === "Active" || d.status === "Pending");
        if (newest) {
          setToast({
            bizName: newest.bizName || "A business",
            promoType: newest.promoLabel || newest.promoType || "promotion",
            amount: newest.amount || 0
          });
          setTimeout(() => setToast(null), 5000);
        }
      }
      isFirstLoad.current = false;
      prevBookingCount.current = data.length;
      setBookings(data);
    }, err => console.error("bookings listener error:", err));
    return () => unsub();
  }, [creator?.id, fbReady]);

  // Listen for reviews in real-time
  useEffect(() => {
    if (!creator?.id || !fbReady) return;
    const { collection, query, where, onSnapshot } = window.__fsOps;
    const q = query(collection(window.__db, "reviews"), where("creatorId", "==", creator.id));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
      setReviews(data);
    });
    return () => unsub();
  }, [creator?.id, fbReady]);

  // Stable ref so shownNotifIds persists across re-renders without triggering effect re-run
  const shownCreatorNotifIds = useRef(new Set());

  // ── creatorNotifs real-time listener ──────────────────────────────────────────
  // Query ALL notifs for this creator (NOT filtered by read==false).
  // Filtering by read==false caused a Firestore timing bug: when the app marks a notif
  // as read immediately, the document disappears from the result set before the next
  // new notif arrives, so the listener re-fires but the new notif isn't in the "unread"
  // set yet — creating a gap window where new notifs are silently missed.
  // Instead: listen to all notifs, track which ones we've processed in a ref, and only
  // show a toast for truly new ones (not in shownCreatorNotifIds). Mark read after toast.
  useEffect(() => {
    if (!creator?.id || !fbReady) return;
    shownCreatorNotifIds.current = new Set();
    const { collection, query, where, onSnapshot, doc, updateDoc } = window.__fsOps;
    let firstNotifSnap = true;
    // No orderBy — avoids requiring a Firestore composite index.
    // Sorting is done client-side after receiving the snapshot.
    const q = query(
      collection(window.__db, "creatorNotifs"),
      where("creatorId","==",creator.id)
    );
    const unsub = onSnapshot(q, snap => {
      // Sort newest-first client-side
      const sorted = snap.docs.slice().sort((a,b) =>
        (b.data().createdAt?.seconds||0) - (a.data().createdAt?.seconds||0)
      );
      // On first snap — seed the seen set so we never re-toast history
      if (firstNotifSnap) {
        firstNotifSnap = false;
        sorted.forEach(d => shownCreatorNotifIds.current.add(d.id));
        return;
      }
      // Only process docs not yet seen — genuinely new notifications
      const fresh = sorted.filter(d => !shownCreatorNotifIds.current.has(d.id));
      fresh.forEach(d => {
        shownCreatorNotifIds.current.add(d.id);
        const n = d.data();
        updateDoc(doc(window.__db,"creatorNotifs",d.id),{read:true}).catch(()=>{});

        if (n.type === "payment_approved") {
          setAdToast({ title:"💰 Payment Released!", message: n.message || "Your payment has been approved and released!", icon:"💰" });
          setTimeout(() => setAdToast(null), 7000);
          if (n.bookingId) {
            setBookings(prev => prev.map(b => b.id===n.bookingId ? {...b, status:"Completed", paymentApproved:true} : b));
          }
        } else if (n.type === "verification_approved") {
          setAdToast({ title:"✅ Profile Verified!", message:"Your profile has been verified. Complete the setup on your dashboard!", icon:"✅" });
          setTimeout(() => setAdToast(null), 8000);
        } else if (n.type === "verification_rejected") {
          setAdToast({ title:"❌ Verification Rejected", message: n.message || "Please update your details and resubmit.", icon:"❌" });
          setTimeout(() => setAdToast(null), 8000);
        } else if (n.type === "video_removed") {
          setAdToast({ title:"📹 Video Removed", message: n.reason || "A video was removed from your portfolio by our team.", icon:"📹" });
          setTimeout(() => setAdToast(null), 10000);
        } else if (n.type === "payout_approved") {
          setAdToast({ title:"💸 Withdrawal Approved!", message: n.message || "Your withdrawal has been approved and is being processed!", icon:"💸" });
          setTimeout(() => setAdToast(null), 8000);
        } else if (n.type === "payout_paid") {
          setAdToast({ title:"🏦 Money Transferred!", message: n.message || "Your payout has been sent to your bank account!", icon:"🏦" });
          setTimeout(() => setAdToast(null), 8000);
        } else if (n.type === "ad_success") {
          setAdToast({ title: n.title || "🚀 You're On Top!", message: n.message || "Your profile is now featured at the top of Collancer!", icon:"🚀" });
          setTimeout(() => setAdToast(null), 6000);
        } else {
          setAdToast({ title: n.title || "📣 New Update", message: n.message || "You have a new notification.", icon: n.icon || "📣" });
          setTimeout(() => setAdToast(null), 6000);
        }
      });
    }, err => console.error("creatorNotifs listener error:", err));
    return () => unsub();
  }, [creator?.id, fbReady]);

  // Listen to payoutRequests — live status updates on EarningsPage
  const [payouts, setPayouts] = useState([]);
  useEffect(() => {
    if (!creator?.id || !fbReady) return;
    const { collection, query, where, onSnapshot } = window.__fsOps;
    const q = query(collection(window.__db,"payoutRequests"), where("creatorId","==",creator.id));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d=>({id:d.id,...d.data()}));
      data.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
      setPayouts(data);
    });
    return () => unsub();
  }, [creator?.id, fbReady]);

  // Listen to adCampaigns — for EarningsPage ad spend section
  const [creatorAdCampaigns, setCreatorAdCampaigns] = useState([]);
  useEffect(() => {
    if (!creator?.id || !fbReady) return;
    const { collection, query, where, onSnapshot } = window.__fsOps;
    const q = query(collection(window.__db,"adCampaigns"), where("creatorId","==",creator.id));
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d=>({id:d.id,...d.data()}));
      data.sort((a,b)=>(b.createdAt?.seconds||b.startedAt||0)-(a.createdAt?.seconds||a.startedAt||0));
      setCreatorAdCampaigns(data);
    });
    return () => unsub();
  }, [creator?.id, fbReady]);

  const handleAuth = (user, creatorData) => {
    setAuthUser(user);
    setCreator({ ...creatorData, id: user.uid });
  };

  const handleLogout = async () => {
    const { signOut } = window.__authOps;
    await signOut(window.__auth);
    setAuthUser(null); setCreator(null);
    setBookings([]); setReviews([]);
    prevBookingCount.current = 0;
    isFirstLoad.current = true;
    shownCreatorNotifIds.current = new Set(); // clear so next login starts fresh
  };

  const handleSave = (updated) => {
    // Merge update into creator state, always preserving the id (= user.uid)
    setCreator(prev => ({ ...prev, ...updated, id: creator.id }));
  };

  const handlePfpChange = (url) => {
    setCreator(prev => ({ ...prev, pfp: url }));
  };

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(prev => prev.map(b => b.id===bookingId ? {...b,status:newStatus} : b));
  };

  const openBooking = async (booking) => {
    setSelectedBooking(booking);
    // Mark as seen (already Active via auto-accept)
    if (!booking.seenByCreator) {
      try {
        const { doc, updateDoc } = window.__fsOps;
        await updateDoc(doc(window.__db, "bookings", booking.id), { seenByCreator: true });
      } catch(e) {}
    }
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const confirmLogout = () => setShowLogoutConfirm(true);
  const doLogout = () => { setShowLogoutConfirm(false); handleLogout(); };


  // Banned screen
  if (authUser && creator?.banned) return (
    <><Styles/><AnimBg/>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",padding:"0 24px",zIndex:1,position:"relative",textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:20}}>🚫</div>
        <h1 style={{fontSize:24,fontWeight:800,marginBottom:10,color:"var(--red)"}}>Account Banned</h1>
        <p style={{fontSize:14,color:"var(--txt2)",lineHeight:1.8,marginBottom:24,maxWidth:320}}>
          Your Collancer account has been banned by our team due to a violation of our terms. 
          Your profile has been removed from the Collancer creator list.
        </p>
        <div style={{background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.25)",
          borderRadius:18,padding:"14px 18px",marginBottom:24,maxWidth:320,width:"100%"}}>
          <div style={{fontSize:12,color:"var(--txt2)"}}>If you believe this is a mistake, contact us at <strong style={{color:"var(--c)"}}>support@collancer.in</strong></div>
        </div>
        <button onClick={async()=>{const{signOut}=window.__authOps;await signOut(window.__auth);setAuthUser(null);setCreator(null);}}
          style={{background:"rgba(248,113,113,.15)",border:"1.5px solid rgba(248,113,113,.32)",
            borderRadius:50,padding:"12px 28px",color:"var(--red)",fontSize:14,fontWeight:700,cursor:"pointer"}}>
          Sign Out
        </button>
      </div>
    </>
  );

  // Network / Firebase error screen — shown when Firebase SDK can't load (e.g. network blocked in sandbox)
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

  if (!fbReady || !authChecked) return (
    <><Styles/><AnimBg/>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",gap:16,position:"relative",zIndex:1}}>
        <div style={{width:60,height:60,borderRadius:22,
          background:"linear-gradient(135deg,rgba(0,229,255,.15),rgba(0,229,255,.04))",
          border:"1.5px solid rgba(0,229,255,.32)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <HomeLogo size={36}/>
        </div>
        <div style={{display:"flex",gap:6}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{width:8,height:8,borderRadius:"50%",background:"var(--c)",
              animation:`pulse 1.2s ease ${i*.2}s infinite`}}/>
          ))}
        </div>
        <div style={{fontSize:12,color:"var(--txt2)"}}>Connecting to Collancer...</div>
      </div>
    </>
  );
  if (!authUser || !creator) return (<><Styles/><AnimBg/><CreatorAuthScreen onAuth={handleAuth}/></>);

  const handleSetPromotions = async (types, priceMap) => {
    try {
      const { doc, updateDoc, serverTimestamp } = window.__fsOps;
      // Build a unified prices object (keeps old keys too for backwards compat)
      const mergedPrices = { ...(creator.prices || {}), ...priceMap };
      await updateDoc(doc(window.__db,"creators",creator.id), {
        promotionTypes: types,
        prices: mergedPrices,
        updatedAt: serverTimestamp(),
      });
      setCreator(prev => ({ ...prev, promotionTypes: types, prices: mergedPrices }));
    } catch(e) { console.error("handleSetPromotions error:", e); }
  };

  const handleAddToCollancer = async () => {
    try {
      const { doc, updateDoc, serverTimestamp } = window.__fsOps;
      await updateDoc(doc(window.__db,"creators",creator.id), {
        addedToCollancer: true,
        active: true,
        // Sync all current profile fields so business app shows complete profile
        name: creator.name || "",
        handle: creator.handle || "",
        bio: creator.bio || "",
        platform: creator.platform || "Instagram",
        niche: creator.niche || "",
        city: creator.city || "",
        followers: Number(creator.followers) || 0,
        ytSubscribers: Number(creator.ytSubscribers) || 0,
        engagement: Number(creator.engagement) || 0,
        avgViews: Number(creator.avgViews) || 0,
        reach: Number(creator.reach) || 0,
        price: Number(creator.price) || 0,
        prices: creator.prices || {},
        promotionTypes: creator.promotionTypes || [],
        tags: creator.tags || [],
        pfp: creator.pfp || "",
        profileLink: creator.profileLink || "",
        verified: creator.verified || false,
        verificationStatus: creator.verificationStatus || "verified",
        updatedAt: serverTimestamp(),
      });
      setCreator(prev => ({...prev, addedToCollancer: true, active: true}));
    } catch(e) { console.error("handleAddToCollancer error:", e); }
  };

  const verified = creator?.verificationStatus === "verified";
  const addedToCollancer = creator?.addedToCollancer || false;
  const isLive = verified && addedToCollancer; // fully unlocked — verified + added to Collancer
  const hasActiveBooking = bookings.some(b => b.status === "Active" || b.status === "PendingCompletion");

  const content = () => {
    if (verifyPage) return <VerificationRequestPage creator={creator} fbReady={fbReady} onBack={()=>setVerifyPage(false)}/>;
    if (adPage) {
    // Compute withdrawable at app level so AdCampaignPage can offer pay-via-balance
    const _completed = bookings.filter(b=>b.status==="Completed");
    const _totalApproved = _completed.filter(b=>b.paymentApproved).reduce((s,b)=>s+(b.amount||0)*0.8,0);
    const _alreadyReq = payouts.filter(p=>p.status!=="rejected").reduce((s,p)=>s+(p.amount||0),0);
    const _withdrawable = Math.max(0, _totalApproved - _alreadyReq);
    return <AdCampaignPage creator={creator} withdrawable={_withdrawable} bookings={bookings} payouts={payouts} onBack={()=>setAdPage(false)} onSuccess={({plan,paidViaBalance})=>{ setAdPage(false); setAdToast({title:"🚀 You're On Top!", message:`Your profile is live at the top of Collancer for ${plan.days} day${plan.days>1?"s":""}!`}); setTimeout(()=>setAdToast(null),6000); }}/>;
  }
    // Always accessible pages — regardless of verification or active booking
    if (page==="support") return <HomeSupportPage creator={creator}/>;
    if (page==="privacy") return <HomeLegalPage type="privacy" onBack={()=>setPage("profile")}/>;
    if (page==="terms")   return <HomeLegalPage type="terms"   onBack={()=>setPage("profile")}/>;
    if (page==="dashboard") return <DashboardPage creator={creator} bookings={bookings} onOpenBooking={openBooking} reviews={reviews} onBeOnTop={()=>setAdPage(true)} onVerify={()=>setVerifyPage(true)} onAddToCollancer={handleAddToCollancer} onSetPromotions={handleSetPromotions}/>;
    // Not fully live (not verified OR not added to Collancer) → always show dashboard
    if (!isLive) return <DashboardPage creator={creator} bookings={bookings} onOpenBooking={openBooking} reviews={reviews} onBeOnTop={()=>setAdPage(true)} onVerify={()=>setVerifyPage(true)} onAddToCollancer={handleAddToCollancer} onSetPromotions={handleSetPromotions}/>;
    // Has active booking → only bookings tab allowed, redirect everything else to dashboard
    if (hasActiveBooking && page !== "bookings") return <DashboardPage creator={creator} bookings={bookings} onOpenBooking={openBooking} reviews={reviews} onBeOnTop={()=>setAdPage(true)} onVerify={()=>setVerifyPage(true)} onAddToCollancer={handleAddToCollancer} onSetPromotions={handleSetPromotions}/>;
    if (page==="bookings") return <BookingsPage bookings={bookings} onStatusChange={handleStatusChange}/>;
    if (page==="profile") return <CreatorProfilePage creator={creator} onSave={handleSave} onPfpChange={handlePfpChange} onLogout={confirmLogout} onPrivacy={()=>setPage("privacy")} onTerms={()=>setPage("terms")}/>;
    if (page==="earnings") return <EarningsPage bookings={bookings} creator={creator} payouts={payouts} adCampaigns={creatorAdCampaigns}/>;
  };

  return (
    <>
      <Styles/><AnimBg/>
      {showLogoutConfirm && <CreatorLogoutModal onConfirm={doLogout} onCancel={()=>setShowLogoutConfirm(false)}/>}

      {/* Profile warning modal */}
      {showProfileWarning && (
        <div className="mbg" onClick={e=>e.target===e.currentTarget&&setShowProfileWarning(false)}>
          <div className="mbox" style={{padding:24,textAlign:"center",maxWidth:340}}>
            <div style={{fontSize:44,marginBottom:14}}>⚠️</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,marginBottom:10}}>Important Notice</div>
            <p style={{fontSize:13,color:"var(--txt2)",lineHeight:1.8,marginBottom:20}}>
              Please ensure all profile information is <strong style={{color:"var(--txt)"}}>accurate and honest</strong>. 
              A <strong style={{color:"var(--amb)"}}>minimum of 10,000 followers</strong> is required to be listed on Collancer.
              Entering <strong style={{color:"var(--red)"}}>false or misleading</strong> details about your follower count, 
              engagement, or any other stats is a strict violation of our terms and will result in a <strong style={{color:"var(--red)"}}>permanent ban</strong>.
            </p>
            <button onClick={()=>{setShowProfileWarning(false);setPage("profile");}} className="btnp"
              style={{width:"100%",justifyContent:"center",padding:"13px"}}>
              I Understand — Go to Profile
            </button>
            <button onClick={()=>setShowProfileWarning(false)}
              style={{width:"100%",marginTop:8,background:"none",border:"none",color:"var(--txt2)",
                fontSize:13,cursor:"pointer",padding:"8px"}}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Booking toast — new booking received */}
      {toast && (
        <div style={{position:"fixed",top:66,left:0,right:0,zIndex:9999,
          display:"flex",justifyContent:"center",padding:"0 16px",pointerEvents:"none"}}>
          <div style={{width:"100%",maxWidth:398,pointerEvents:"all",
            background:"linear-gradient(180deg,#0e2a1a 0%,#071810 100%)",
            border:"1px solid #00e676",borderRadius:22,padding:"14px 16px",
            boxShadow:"0 2px 0 rgba(255,255,255,.07) inset,0 -2px 0 rgba(0,0,0,.4) inset,0 16px 48px rgba(0,0,0,.85),0 4px 12px rgba(0,230,118,.25),0 1px 0 #00e676",
            display:"flex",alignItems:"center",gap:12,position:"relative",overflow:"hidden",
            animation:"fadeUp .4s cubic-bezier(.16,1,.3,1) both"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)",pointerEvents:"none"}}/>
            <div style={{width:42,height:42,borderRadius:16,flexShrink:0,
              background:"linear-gradient(135deg,#00e676,#00c853)",
              boxShadow:"0 4px 12px rgba(0,230,118,.5),0 2px 0 rgba(255,255,255,.15) inset",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🎉</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:800,color:"#00e676",marginBottom:2}}>New Booking!</div>
              <div style={{fontSize:11,color:"#a0b8a8",lineHeight:1.5}}>
                <strong style={{color:"#e8f8ee"}}>{toast.bizName}</strong> booked a {toast.promoType}
                {toast.amount>0&&<> — <strong style={{color:"#00E5FF"}}>{inr(toast.amount)}</strong></>}
              </div>
            </div>
            <button onClick={()=>setToast(null)} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",borderRadius:12,color:"#a0b8a8",cursor:"pointer",fontSize:15,padding:"4px 7px",flexShrink:0,lineHeight:1}}>✕</button>
          </div>
        </div>
      )}
      {/* System / notif toast — stacked below booking toast if both visible */}
      {adToast && (
        <div style={{position:"fixed",top: toast ? 148 : 66,left:0,right:0,zIndex:9998,
          display:"flex",justifyContent:"center",padding:"0 16px",pointerEvents:"none",
          transition:"top .3s cubic-bezier(.16,1,.3,1)"}}>
          <div style={{width:"100%",maxWidth:398,pointerEvents:"all",
            background:"linear-gradient(180deg,#0e2a1a 0%,#071810 100%)",
            border:"1px solid #00e676",borderRadius:22,padding:"14px 16px",
            boxShadow:"0 2px 0 rgba(255,255,255,.07) inset,0 -2px 0 rgba(0,0,0,.4) inset,0 16px 48px rgba(0,0,0,.85),0 4px 12px rgba(0,230,118,.25),0 1px 0 #00e676",
            display:"flex",alignItems:"center",gap:12,position:"relative",overflow:"hidden",
            animation:"fadeUp .4s cubic-bezier(.16,1,.3,1) both"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)",pointerEvents:"none"}}/>
            <div style={{width:42,height:42,borderRadius:16,flexShrink:0,
              background:"linear-gradient(135deg,#00e676,#00c853)",
              boxShadow:"0 4px 12px rgba(0,230,118,.5),0 2px 0 rgba(255,255,255,.15) inset",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
              {adToast.icon || "🚀"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:800,color:"#00e676",marginBottom:2}}>{adToast.title}</div>
              <div style={{fontSize:11,color:"#a0b8a8",lineHeight:1.5}}>{adToast.message}</div>
            </div>
            <button onClick={()=>setAdToast(null)} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",borderRadius:12,color:"#a0b8a8",cursor:"pointer",fontSize:15,padding:"4px 7px",flexShrink:0,lineHeight:1}}>✕</button>
          </div>
        </div>
      )}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={()=>setSelectedBooking(null)}
          onStatusChange={(id,status)=>{ handleStatusChange(id,status); setSelectedBooking(prev=>({...prev,status})); }}
        />
      )}
      <div style={{position:"relative",zIndex:1,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <CreatorNav creator={creator} page={page} setPage={setPage} onLogout={handleLogout}/>
        <main style={{flex:1,paddingTop:56}}>{content()}</main>
        <BottomTabs page={page} setPage={(p)=>{
          if (p==="profile" && isLive && !hasActiveBooking) { setShowProfileWarning(true); return; }
          setPage(p);
        }} verificationStatus={creator?.verificationStatus} hasActiveBooking={hasActiveBooking} addedToCollancer={creator?.addedToCollancer||false}/>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════
//  UNIFIED APP — Role Router
// ══════════════════════════════════════════════════════

export { CreatorApp };
