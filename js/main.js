/**
 * SkillNest V4 — Main App Logic
 * All original functionality preserved
 */
(function () {
  'use strict';

  /* LOADER */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const app    = document.getElementById('app');
    setTimeout(() => {
      if (loader) { loader.style.opacity='0'; loader.style.visibility='hidden'; }
      if (app) app.style.opacity = '1';
    }, 1100);
    setTimeout(() => speakText('Welcome to SkillNest English Learning Platform.', true), 1500);
  });

  /* THEME */
  const applyTheme = light => {
    document.body.classList.toggle('light', light);
    localStorage.setItem('sn_theme', light ? 'light' : 'dark');
    document.querySelectorAll('.theme-icon').forEach(i => {
      i.className = `fas fa-${light?'sun':'moon'} theme-icon`;
    });
  };
  applyTheme(localStorage.getItem('sn_theme') === 'light');
  document.querySelectorAll('[data-theme-toggle]').forEach(el =>
    el.addEventListener('click', () => applyTheme(!document.body.classList.contains('light')))
  );

  /* NAVBAR SCROLL */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', scrollY > 50), { passive:true });

  /* SLIDER */
  const track = document.getElementById('sliderTrack');
  if (track) {
    const imgs = ['image/img1.png','image/img2.png','image/img3.png','image/img4.png',
                  'image/img5.png','image/img6.png','image/img7.png','image/img8.png','image/img9.png'];
    [...imgs,...imgs].forEach(src => {
      const img = document.createElement('img');
      img.src=src; img.alt='Classroom'; img.loading='lazy';
      track.appendChild(img);
    });
    const wrap = document.querySelector('.slider-wrap');
    wrap?.addEventListener('mouseenter', () => track.style.animationPlayState='paused');
    wrap?.addEventListener('mouseleave', () => track.style.animationPlayState='running');
  }

  /* COUNTERS */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.target, suffix = el.dataset.suffix||'';
      const dur = 1600, t0 = performance.now();
      const tick = now => {
        const p = Math.min((now-t0)/dur,1);
        el.textContent = Math.floor((1-Math.pow(1-p,3))*target) + (p===1?suffix:'');
        if (p<1) requestAnimationFrame(tick); else el.textContent = target+suffix;
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, {threshold:.5});
  document.querySelectorAll('.sb-num[data-target]').forEach(el => obs.observe(el));

  /* SCROLL REVEAL */
  const rObs = new IntersectionObserver(entries =>
    entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('in');rObs.unobserve(e.target);} }),
    {threshold:.1,rootMargin:'0px 0px -40px 0px'}
  );
  document.querySelectorAll('.reveal').forEach(el => rObs.observe(el));

  /* CARD TILT */
  if (!matchMedia('(pointer:coarse)').matches) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(800px) rotateX(${-y*6}deg) rotateY(${x*6}deg) translateY(-5px)`;
      });
      card.addEventListener('mouseleave',()=>card.style.transform='');
    });
  }

  /* CUSTOM CURSOR */
  if (!matchMedia('(pointer:coarse)').matches) {
    const dot=document.createElement('div'), ring=document.createElement('div');
    const s=document.createElement('style');
    s.textContent=`.c-dot{position:fixed;width:5px;height:5px;background:#38BDF8;border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);}.c-ring{position:fixed;width:30px;height:30px;border:1.5px solid rgba(56,189,248,.5);border-radius:50%;pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:width .18s,height .18s,border-color .18s;}.c-ring.h{width:50px;height:50px;border-color:rgba(34,211,238,.7);}`;
    document.head.appendChild(s);
    dot.className='c-dot'; ring.className='c-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    let rx=0,ry=0,cx=0,cy=0;
    document.addEventListener('mousemove',e=>{cx=e.clientX;cy=e.clientY;dot.style.left=cx+'px';dot.style.top=cy+'px';});
    (function raf(){requestAnimationFrame(raf);rx+=(cx-rx)*.12;ry+=(cy-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';})();
    document.addEventListener('mouseover',e=>{if(e.target.closest('a,button,.card'))ring.classList.add('h');});
    document.addEventListener('mouseout',e=>{if(e.target.closest('a,button,.card'))ring.classList.remove('h');});
  }

  /* MOBILE MENU */
  const mNav=document.getElementById('mobileNav'), ov=document.getElementById('overlay');
  const openM=()=>{mNav?.classList.add('open');ov?.classList.add('active');};
  const closeM=()=>{mNav?.classList.remove('open');ov?.classList.remove('active');};
  document.getElementById('hamburgerBtn')?.addEventListener('click',openM);
  document.getElementById('closeMenuBtn')?.addEventListener('click',closeM);
  ov?.addEventListener('click',closeM);

  const go = sel => { closeM(); (typeof sel==='string'?document.querySelector(sel):sel)?.scrollIntoView({behavior:'smooth',block:'start'}); };

  document.getElementById('mHome')?.addEventListener('click',     e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'});closeM();});
  document.getElementById('mTeacher')?.addEventListener('click',  e=>{e.preventDefault();go('#teacherSection');});
  document.getElementById('mCourses')?.addEventListener('click',  e=>{e.preventDefault();go('#coursesSection');});
  document.getElementById('mResources')?.addEventListener('click',e=>{e.preventDefault();go('#downloadSection');});
  document.getElementById('mApp')?.addEventListener('click',     e=>{e.preventDefault();go('#appSection');});
  document.getElementById('mContact')?.addEventListener('click',  e=>{e.preventDefault();go('.cta-band');});
  document.getElementById('navHome')?.addEventListener('click',    e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'});});
  document.getElementById('navCourses')?.addEventListener('click', e=>{e.preventDefault();go('#coursesSection');});
  document.getElementById('navTeacher')?.addEventListener('click', e=>{e.preventDefault();go('#teacherSection');});
  document.getElementById('navApp')?.addEventListener('click',     e=>{e.preventDefault();go('#appSection');});
  document.getElementById('navContact')?.addEventListener('click', e=>{e.preventDefault();go('footer');});
  document.getElementById('footerTeacher')?.addEventListener('click',   e=>{e.preventDefault();go('#teacherSection');});
  document.getElementById('footerResources')?.addEventListener('click', e=>{e.preventDefault();go('#downloadSection');});
  document.getElementById('footerApp')?.addEventListener('click',       e=>{e.preventDefault();go('#appSection');});

  /* HERO BTNS */
  document.getElementById('heroJoinBtn')?.addEventListener('click',    ()=>open('https://wa.me/94767899845','_blank'));
  document.getElementById('heroCoursesBtn')?.addEventListener('click', ()=>go('#coursesSection'));
  document.getElementById('floatWa')?.addEventListener('click',        ()=>open('https://wa.me/94767899845','_blank'));

  /* BOTTOM NAV */
  document.querySelectorAll('.bn-item').forEach(item=>{
    item.addEventListener('click',()=>{
      const n=item.dataset.nav;
      if(n==='home')scrollTo({top:0,behavior:'smooth'});
      else if(n==='teacher')go('#teacherSection');
      else if(n==='courses')go('#coursesSection');
      else if(n==='timetable')document.getElementById('timetableModal').style.display='flex';
    });
  });

  /* ENROLL BUTTONS */
  document.querySelectorAll('.enrollBtn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const c=btn.closest('.course-card');
      const course=c?.dataset.course||'English Course', schedule=c?.dataset.schedule||'Weekend', price=c?.dataset.price||'Contact';
      if(btn.disabled)return;
      open(`https://wa.me/94767899845?text=Hello%20Ms.%20Madhavi,%0A*Enrollment%20Request*%0ACourse:%20${encodeURIComponent(course)}%0ASchedule:%20${schedule}%0APrice:%20${price}%0APlease%20contact%20me.`,'_blank');
    });
  });

  /* REGISTRATION FORM */
  document.getElementById('whatsappRegForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('regName')?.value.trim();
    const wa=document.getElementById('regWhatsapp')?.value.trim();
    const grade=document.getElementById('regGrade')?.value;
    const st=document.getElementById('regStatus');
    if(!name||!wa||!grade){if(st)st.innerHTML='<span style="color:#F472B6;">⚠️ Please fill all fields</span>';return;}
    open(`https://wa.me/94767899845?text=Hello%20Ms.%20Madhavi,%0A*New%20Student%20Registration*%0AName:%20${encodeURIComponent(name)}%0AGrade:%20${encodeURIComponent(grade)}%0AWhatsApp:%20${wa}`,'_blank');
    if(st)st.innerHTML='<span style="color:#2DD4BF;">✅ Registration sent!</span>';
    document.getElementById('whatsappRegForm').reset();
    setTimeout(()=>{if(st)st.innerHTML='';},3500);
  });

  /* TIMETABLE */
  window.closeTimetable=()=>{document.getElementById('timetableModal').style.display='none';};
  document.getElementById('timetableModal')?.addEventListener('click',e=>{if(e.target===document.getElementById('timetableModal'))closeTimetable();});

  /* SECRET ADMIN */
  let clicks=0,ct;
  document.getElementById('logoClick')?.addEventListener('click',()=>{
    if(++clicks>=5){document.getElementById('secretModal').style.display='flex';clicks=0;}
    clearTimeout(ct);ct=setTimeout(()=>clicks=0,2000);
  });
  window.verifySecret=function(){
    const pass=document.getElementById('secretPass')?.value.trim();
    const msg=document.getElementById('secretMsg');
    if(pass==='001@Thuli_$Deshan:T1-M:T'||pass==='E001@U_M_R:Admin-M/T'){
      if(msg)msg.innerHTML='<span style="color:#2DD4BF;">✅ Access Granted! Redirecting…</span>';
      speakText('Access Granted. Welcome to Admin Console.',true);
      setTimeout(()=>{window.location.href='My english Admin.html';},1000);
    }else{
      if(msg)msg.innerHTML='<span style="color:#F472B6;">❌ Invalid passkey</span>';
      speakText('Wrong password. Access denied.',false);
      const inp=document.getElementById('secretPass');
      if(inp){inp.value='';inp.style.animation='shake .35s ease';setTimeout(()=>inp.style.animation='',400);}
    }
  };
  window.closeSecret=function(){
    document.getElementById('secretModal').style.display='none';
    const i=document.getElementById('secretPass'),m=document.getElementById('secretMsg');
    if(i)i.value='';if(m)m.innerHTML='';
  };
  document.getElementById('secretModal')?.addEventListener('click',e=>{if(e.target===document.getElementById('secretModal'))closeSecret();});
  document.getElementById('secretPass')?.addEventListener('keydown',e=>{if(e.key==='Enter')verifySecret();});
  document.addEventListener('keydown',e=>{
    if(e.ctrlKey&&e.shiftKey&&e.key==='A'){e.preventDefault();document.getElementById('secretModal').style.display='flex';}
    if(e.key==='Escape'){closeSecret();closeTimetable();}
  });

  /* O/L PAPER CLASS */
  (function(){
    const card=document.getElementById('olPaperClassCard');
    const btn=document.getElementById('olPaperEnrollBtn');
    const cd=document.getElementById('olPaperCountdown');
    if(!card||!btn)return;
    function upd(){
      const now=new Date(),m=now.getMonth(),d=now.getDate();
      const on=(m===8&&d>=1)||(m>8&&m<=11);
      card.classList.toggle('course-locked',!on);
      card.style.opacity=on?'1':'0.6';
      btn.disabled=!on;
      if(on){
        btn.innerHTML='<i class="fab fa-whatsapp"></i> Enroll Now';
        if(cd){cd.textContent='✅ Enrollment Open!';cd.style.color='#2DD4BF';}
        const nb=btn.cloneNode(true);btn.parentNode.replaceChild(nb,btn);
        nb.addEventListener('click',()=>open(`https://wa.me/94767899845?text=Hello%20Ms.%20Madhavi,%0A*Enrollment%20Request*%0ACourse:%20O/L%20Paper%20Class%20(December%20Start)%0APrice:%20LKR%201500/mo`,'_blank'));
      }else{
        btn.innerHTML='<i class="fas fa-lock"></i> Opens Sep 1';
        const next=new Date(now.getFullYear()+(m>=8?1:0),8,1);
        const days=Math.ceil((next-now)/86400000);
        if(cd){cd.textContent=`🔒 Opens Sep 1 (in ${days} days)`;cd.style.color='#F472B6';}
      }
    }
    upd();setInterval(upd,3600000);
  })();

  /* DATE BLOCK */
  (function(){
    const S=new Date('2026-05-12T00:00:00'),E=new Date('2026-05-17T09:50:59');
    const PW='skill2024',now=new Date();
    if(now<S||now>E||sessionStorage.getItem('blk')==='1')return;
    const app=document.getElementById('app');
    if(app)app.style.display='none';
    const el=document.createElement('div');
    el.id='dateBlock';
    el.style.cssText='position:fixed;inset:0;background:#060B14;z-index:99999;display:flex;justify-content:center;align-items:center;padding:20px;font-family:"Space Grotesk",sans-serif;';
    const tick=()=>{
      const r=E-new Date();if(r<=0){sessionStorage.setItem('blk','1');location.reload();return;}
      const h=Math.floor(r/3600000),m=Math.floor((r%3600000)/60000);
      const el2=document.getElementById('blkCd');if(el2)el2.textContent=`${h}h ${m}m`;
    };
    el.innerHTML=`<div style="text-align:center;max-width:420px;width:100%;">
      <div style="font-size:3rem;margin-bottom:16px;">🔧</div>
      <h2 style="color:#EAF3FF;margin-bottom:8px;font-size:1.7rem;font-weight:700;">Under Maintenance</h2>
      <p style="color:#8CA3C7;margin-bottom:8px;">We're making improvements!</p>
      <div style="background:rgba(255,255,255,0.04);border-radius:16px;padding:18px;margin:16px 0;border:1px solid rgba(255,255,255,0.07);">
        <p style="color:#8CA3C7;font-size:0.76rem;margin-bottom:6px;">Remaining:</p>
        <span id="blkCd" style="font-size:2rem;font-weight:700;color:#FCD34D;">--</span>
      </div>
      <input type="password" id="blkPw" placeholder="Access code…" style="width:100%;padding:12px 18px;border-radius:11px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);color:#EAF3FF;font-size:.88rem;margin-bottom:10px;outline:none;font-family:inherit;">
      <button onclick="blkVerify()" style="width:100%;padding:12px;border-radius:11px;border:none;background:linear-gradient(135deg,#FCD34D,#F59E0B);color:#060B14;font-weight:700;cursor:pointer;font-size:.9rem;font-family:inherit;">Access Early</button>
      <p id="blkMsg" style="margin-top:10px;font-size:.78rem;min-height:18px;color:#F472B6;"></p>
    </div>`;
    document.body.insertBefore(el,document.body.firstChild);
    tick();setInterval(tick,60000);
    window.blkVerify=function(){
      const p=document.getElementById('blkPw')?.value.trim();
      if(p===PW){sessionStorage.setItem('blk','1');el.style.display='none';if(app){app.style.display='block';}}
      else{const m=document.getElementById('blkMsg');if(m)m.textContent='❌ Invalid code';const i=document.getElementById('blkPw');if(i)i.value='';}
    };
    document.getElementById('blkPw')?.addEventListener('keydown',e=>{if(e.key==='Enter')blkVerify();});
  })();

  /* TTS */
  function speakText(msg,ok){
    if(!('speechSynthesis'in window))return;
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(msg);
    u.lang='en-US';u.rate=ok?1:.9;u.pitch=ok?1.1:.8;
    speechSynthesis.speak(u);
  }
  window.speakText=speakText;
})();