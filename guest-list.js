(() => {
  const lens = document.createElement('div');
  lens.setAttribute('aria-hidden', 'true');
  lens.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  lens.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="nightlights-lens" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".012 .025" numOctaves="1" seed="8" result="bend"/><feGaussianBlur in="bend" stdDeviation="2" result="smooth"/><feDisplacementMap in="SourceGraphic" in2="smooth" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>';
  document.body.append(lens);
  const platforms = [{key:'line',name:'LINE',label:'LINE ID',placeholder:'Your LINE ID'}, {key:'instagram',name:'Instagram',label:'Instagram',placeholder:'@yourname'}, {key:'tiktok',name:'TikTok',label:'TikTok',placeholder:'@yourname'}];
  const reuseTargets = [];
  document.querySelectorAll('.venue').forEach(article => {
    const join = article.querySelector('.availability > .request');
    join.innerHTML = '<span>Join guest list</span><svg class="join-orbit" viewBox="0 0 144 44" aria-hidden="true" focusable="false"><rect class="orbit-track" x="1.5" y="1.5" width="141" height="41" rx="20.5"/><rect class="orbit-tail" pathLength="100" x="1.5" y="1.5" width="141" height="41" rx="20.5"/><rect class="orbit-mid" pathLength="100" x="1.5" y="1.5" width="141" height="41" rx="20.5"/><rect class="orbit-head" pathLength="100" x="1.5" y="1.5" width="141" height="41" rx="20.5"/></svg>';
    const availability = article.querySelector('.availability');
    const apply = article.querySelector('.back-join');
    apply.setAttribute('aria-controls', `guest-${article.id}`);
    apply.setAttribute('aria-expanded','false');
    const arrival = document.createElement('div');
    arrival.className = 'application-arrival'; arrival.hidden = true;
    arrival.setAttribute('role','status'); arrival.setAttribute('aria-label','Opening guest list');
    arrival.innerHTML = '<span></span>'.repeat(6);
    availability.append(arrival);
    const result=document.createElement('section');result.className='application-result';result.hidden=true;result.tabIndex=-1;result.setAttribute('aria-live','polite');
    const venueName=article.querySelector('.front h2').textContent;
    result.innerHTML='<span class="joined-badge">On the waitlist</span><h3></h3><p>Updates via LINE.</p>';
    result.querySelector('h3').textContent=venueName+' application';availability.append(result);
    const form = document.createElement('form');
    form.id = `guest-${article.id}`; form.className = 'guest-sheet'; form.hidden = true; form.noValidate = true;
    const prefix = `guest-${article.id}`;
    form.setAttribute('aria-label', `${article.querySelector('.front h2').textContent} guest list`);
    form.innerHTML = `<button class="sheet-close" type="button" aria-label="Close guest form">×</button><h3><button class="title-button" type="button">Start here</button></h3><div class="social-switch" role="tablist" aria-label="Social accounts">${platforms.map((p,i)=>`<button type="button" role="tab" id="${prefix}-${p.key}-tab" aria-controls="${prefix}-${p.key}-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-index="${i}">${p.name}</button>`).join('')}</div>${platforms.map((p,i)=>`<div class="social-field" role="tabpanel" id="${prefix}-${p.key}-panel" aria-labelledby="${prefix}-${p.key}-tab" ${i?'hidden':''}><label for="${prefix}-${p.key}">${p.label}</label><input id="${prefix}-${p.key}" name="${p.key}" placeholder="${p.placeholder}" maxlength="64" autocomplete="off" autocapitalize="none" spellcheck="false" required></div>`).join('')}<div class="visit-dates"></div><p class="field-help" aria-live="polite">Add your three accounts. Tap or slide to switch.</p><button class="submit-guest" type="submit" hidden><span aria-live="polite">Submit</span></button>`;
    const formFigures=article.querySelector('.meter').cloneNode(true);formFigures.className='form-figures';form.prepend(formFigures);
    article.querySelector('.availability').append(form);
    form.querySelector('.title-button').insertAdjacentHTML('beforeend', join.querySelector('svg').outerHTML);
    const titleOrbit=form.querySelector('.title-button svg');titleOrbit.setAttribute('viewBox','0 0 116 34');titleOrbit.setAttribute('preserveAspectRatio','none');titleOrbit.querySelectorAll('rect').forEach(rect=>{rect.setAttribute('width','113');rect.setAttribute('height','31');rect.setAttribute('rx','15.5')});
    form.querySelector('.title-button').addEventListener('click',()=>form.querySelectorAll('.social-field input')[selected].focus({preventScroll:true}));
    const tabs = [...form.querySelectorAll('[role=tab]')], panels = [...form.querySelectorAll('[role=tabpanel]')], inputs = [...form.querySelectorAll('.social-field input')];
    const toggle = form.querySelector('.social-switch'), submit = form.querySelector('.submit-guest'), status = form.querySelector('.field-help');
    let selected = 0, openingTimer, submitting = false, complete = false, opener = join;
    const dates = createNightDates(form.querySelector('.visit-dates'), prefix);
    const reuse = document.createElement('section');
    reuse.className='reuse-details';reuse.hidden=true;
    reuse.innerHTML='<p class="reuse-heading"></p><p class="reuse-question">Join this venue as well?</p><p class="reuse-summary"></p><button type="button">Start here</button><small>Complete your three accounts first</small>';
    reuse.querySelector('.reuse-heading').textContent=venueName;
    availability.append(reuse);
    let suggested = null;
    reuseTargets.push({article, offer(details) {
      if(complete || submitting || inputs.some(input=>input.value.trim()))return;
      suggested={...details};
      const ready=platforms.every(p=>details[p.key]&&details[p.key]!=='@');
      reuse.querySelector('button').disabled=!ready;
      reuse.querySelector('small').textContent=ready?'Use these details · choose your dates':'Complete your three accounts first';
      reuse.querySelector('.reuse-summary').textContent=platforms.map(p=>p.name+': '+(details[p.key]||'—')).join(' · ');
      const any=platforms.some(p=>details[p.key]);reuse.hidden=!any;availability.classList.toggle('has-suggestion',any);
    }});
    reuse.querySelector('button').addEventListener('click',()=>{
      if(!suggested||!platforms.every(p=>suggested[p.key]&&suggested[p.key]!=='@'))return;
      inputs.forEach((input,i)=>{if(!input.value.trim()){input.value=suggested[platforms[i].key];tabs[i].classList.add('is-filled')}});
      reuse.hidden=true;availability.classList.remove('has-suggestion');openForm(apply);
      dates.focus();
    });

    function select(index, focusTab=false) {
      selected = index; toggle.style.setProperty('--selected',index);
      tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index});
      if(focusTab) tabs[index].focus({preventScroll:true});
    }
    tabs.forEach((tab,i)=>tab.addEventListener('click',()=>select(i)));
    toggle.addEventListener('keydown',event=>{
      let next = selected;
      if(event.key==='ArrowRight') next=(selected+1)%3;
      else if(event.key==='ArrowLeft') next=(selected+2)%3;
      else if(event.key==='Home') next=0;
      else if(event.key==='End') next=2;
      else return;
      event.preventDefault();select(next,true);
    });
    let dragStart = null;
    toggle.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragStart={x:e.clientX,id:e.pointerId};e.stopPropagation()});
    toggle.addEventListener('pointermove',e=>{if(!dragStart||e.pointerId!==dragStart.id||Math.abs(e.clientX-dragStart.x)<8)return;toggle.setPointerCapture(e.pointerId);const box=toggle.getBoundingClientRect();select(Math.max(0,Math.min(2,Math.floor((e.clientX-box.left)/box.width*3))))});
    for(const event of ['pointerup','pointercancel']) toggle.addEventListener(event,()=>{dragStart=null});
    inputs.forEach((input,i)=>input.addEventListener('input',()=>{tabs[i].classList.toggle('is-filled',!!input.value.trim());input.removeAttribute('aria-invalid');status.textContent='Add your three accounts. Tap or slide to switch.';
      const details=Object.fromEntries(inputs.map((field,j)=>[platforms[j].key,field.value.trim()]));
      reuseTargets.forEach(target=>{if(target.article!==article)target.offer(details)});
    }));
    function openForm(source){
      if(complete||availability.classList.contains('application-open'))return;
      opener=source;availability.classList.add('application-open');
      article.classList.add('eyes-open');join.hidden=true;arrival.hidden=true;
      form.hidden=false;submit.hidden=false;select(selected);apply.setAttribute('aria-expanded','true');
    }
    apply.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openForm(apply)});
    join.addEventListener('click',()=>openForm(join));
    function close(){if(submitting)return;dates.close();clearTimeout(openingTimer);form.hidden=true;arrival.hidden=true;article.classList.remove('eyes-open');availability.classList.remove('application-open');apply.setAttribute('aria-expanded','false');join.hidden=false;join.classList.remove('join-opening');join.disabled=false;opener.focus({preventScroll:true})}
    form.querySelector('.sheet-close').addEventListener('click',close);
    form.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
    form.addEventListener('submit',event=>{
      event.preventDefault();if(submitting||complete)return;
      const missing=inputs.findIndex(input=>!input.value.trim()||input.value.trim()==='@');
      if(missing!==-1){select(missing);inputs[missing].setAttribute('aria-invalid','true');inputs[missing].focus({preventScroll:true});status.textContent=`Add your ${platforms[missing].label} to continue.`;return}
      const chosenDates=dates.values();
      if(!chosenDates.length){dates.focus();status.textContent='Choose at least one date within the next nine days.';return}
      reuse.hidden=true;availability.classList.remove('has-suggestion');dates.lock();
      submitting=true;submit.disabled=true;form.setAttribute('aria-busy','true');form.querySelector('.sheet-close').disabled=true;
      inputs.forEach(input=>input.readOnly=true);submit.classList.add('is-loading');status.textContent='Submitting…';
      setTimeout(()=>{submitting=false;complete=true;submit.classList.remove('is-loading');submit.classList.add('is-complete');submit.querySelector('span').textContent='Submitted';form.removeAttribute('aria-busy');form.querySelector('.sheet-close').disabled=false;status.textContent='Submitted.';
        form.hidden=true;arrival.hidden=true;article.classList.add('is-submitted');result.hidden=false;
        apply.textContent='Waitlisted';apply.disabled=true;apply.classList.add('is-confirmed');join.hidden=true;
        result.querySelector('h3').textContent=venueName+' · '+chosenDates.map(dates.format).join(', ');
        const details=Object.fromEntries(inputs.map((input,i)=>[platforms[i].key,input.value.trim()]));
        reuseTargets.forEach(target=>{if(target.article!==article)target.offer(details)});
        result.focus({preventScroll:true});
        setTimeout(()=>{if(matchMedia('(max-width:699px)').matches)document.querySelector('.steps').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'end'})},1000)},2800);
    });
  });
  startFigureColours();
  const glassSurfaces=[...document.querySelectorAll('.glass-logo,.guest-sheet')];
  glassSurfaces.forEach(surface=>{
    surface.addEventListener('pointermove',e=>{const box=surface.getBoundingClientRect();surface.style.setProperty('--light-x',`${76+(e.clientX-box.left)/box.width*12}%`);surface.style.setProperty('--light-y',`${2+(e.clientY-box.top)/box.height*10}%`)},{passive:true});
    surface.addEventListener('pointerleave',()=>{surface.style.removeProperty('--light-x');surface.style.removeProperty('--light-y')});
  });
  let reflectionFrame=0;
  function reflectScroll(){reflectionFrame=0;const angle=Math.sin(window.scrollY/280)*16;glassSurfaces.forEach(surface=>{surface.style.setProperty('--rim-angle',`${angle}deg`);surface.style.setProperty('--light-x',`${84+Math.sin(window.scrollY/350)*5}%`)})}
  window.addEventListener('scroll',()=>{if(!reflectionFrame)reflectionFrame=requestAnimationFrame(reflectScroll)},{passive:true});
  reflectScroll();
  // Reveal only after the reader spends two seconds in the bottom section.
  const steps=document.querySelector('.steps');
  const eyes=document.createElement('img');eyes.className='footer-eyes';eyes.src='assets/sailor-moon-eyes.jpg';eyes.alt='';eyes.setAttribute('aria-hidden','true');steps.prepend(eyes);
  let dwellTimer=0, inView=false;
  function updateEyes(){clearTimeout(dwellTimer);if(inView&&!document.hidden){dwellTimer=setTimeout(()=>steps.classList.add('eyes-visible'),2000)}else steps.classList.remove('eyes-visible')}
  const observer=new IntersectionObserver(entries=>{inView=entries[0].intersectionRatio>=.6;updateEyes()},{threshold:[0,.6]});
  observer.observe(steps);document.addEventListener('visibilitychange',updateEyes);
})();
