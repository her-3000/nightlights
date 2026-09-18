(() => {
  const lens = document.createElement('div');
  lens.setAttribute('aria-hidden', 'true');
  lens.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  lens.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="nightlights-lens" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".012 .025" numOctaves="1" seed="8" result="bend"/><feGaussianBlur in="bend" stdDeviation="2" result="smooth"/><feDisplacementMap in="SourceGraphic" in2="smooth" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>';
  document.body.append(lens);
  const platforms = [{key:'line',name:'LINE',label:'LINE ID',placeholder:'Your LINE ID'}, {key:'instagram',name:'Instagram',label:'Instagram',placeholder:'@yourname'}, {key:'tiktok',name:'TikTok',label:'TikTok',placeholder:'@yourname'}];
  document.querySelectorAll('.venue').forEach(article => {
    const join = article.querySelector('.availability > .request');
    const form = document.createElement('form');
    form.className = 'guest-sheet'; form.hidden = true; form.noValidate = true;
    const prefix = `guest-${article.id}`;
    form.setAttribute('aria-label', `${article.querySelector('.front h2').textContent} guest list`);
    form.innerHTML = `<button class="sheet-close" type="button" aria-label="Close guest form">×</button><h3>Your night starts here</h3><div class="social-switch" role="tablist" aria-label="Social accounts">${platforms.map((p,i)=>`<button type="button" role="tab" id="${prefix}-${p.key}-tab" aria-controls="${prefix}-${p.key}-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-index="${i}">${p.name}</button>`).join('')}</div>${platforms.map((p,i)=>`<div class="social-field" role="tabpanel" id="${prefix}-${p.key}-panel" aria-labelledby="${prefix}-${p.key}-tab" ${i?'hidden':''}><label for="${prefix}-${p.key}">${p.label}</label><input id="${prefix}-${p.key}" name="${p.key}" placeholder="${p.placeholder}" maxlength="64" autocomplete="off" autocapitalize="none" spellcheck="false" required></div>`).join('')}<p class="field-help" aria-live="polite">Add your three accounts. Tap or slide to switch.</p><button class="submit-guest" type="submit" hidden><span aria-live="polite">Submit</span></button>`;
    article.querySelector('.availability').append(form);
    const tabs = [...form.querySelectorAll('[role=tab]')], panels = [...form.querySelectorAll('[role=tabpanel]')], inputs = [...form.querySelectorAll('input')];
    const toggle = form.querySelector('.social-switch'), submit = form.querySelector('.submit-guest'), status = form.querySelector('.field-help');
    let selected = 0, openingTimer, submitting = false, complete = false;
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
    inputs.forEach((input,i)=>input.addEventListener('input',()=>{tabs[i].classList.toggle('is-filled',!!input.value.trim());input.removeAttribute('aria-invalid');status.textContent='Add your three accounts. Tap or slide to switch.'}));
    join.addEventListener('click',()=>{
      form.hidden=false;join.disabled=true;select(selected);
      clearTimeout(openingTimer);
      openingTimer=setTimeout(()=>{join.classList.add('join-opening');join.hidden=true;submit.hidden=false},1500);
    });
    function close(){if(submitting)return;clearTimeout(openingTimer);form.hidden=true;join.hidden=false;join.classList.remove('join-opening');join.disabled=false;join.focus({preventScroll:true})}
    form.querySelector('.sheet-close').addEventListener('click',close);
    form.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
    form.addEventListener('submit',event=>{
      event.preventDefault();if(submitting||complete)return;
      const missing=inputs.findIndex(input=>!input.value.trim()||input.value.trim()==='@');
      if(missing!==-1){select(missing);inputs[missing].setAttribute('aria-invalid','true');inputs[missing].focus({preventScroll:true});status.textContent=`Add your ${platforms[missing].label} to continue.`;return}
      submitting=true;submit.disabled=true;form.setAttribute('aria-busy','true');form.querySelector('.sheet-close').disabled=true;
      inputs.forEach(input=>input.readOnly=true);submit.classList.add('is-loading');status.textContent='Previewing submission…';
      setTimeout(()=>{submitting=false;complete=true;submit.classList.remove('is-loading');submit.classList.add('is-complete');submit.querySelector('span').textContent='Submission submitted';form.removeAttribute('aria-busy');form.querySelector('.sheet-close').disabled=false;status.textContent='Demo complete — nothing was sent.'},2800);
    });
  });
  const glassSurfaces=[...document.querySelectorAll('.glass-logo,.guest-sheet')];
  glassSurfaces.forEach(surface=>{
    surface.addEventListener('pointermove',e=>{const box=surface.getBoundingClientRect();surface.style.setProperty('--light-x',`${76+(e.clientX-box.left)/box.width*12}%`);surface.style.setProperty('--light-y',`${2+(e.clientY-box.top)/box.height*10}%`)},{passive:true});
    surface.addEventListener('pointerleave',()=>{surface.style.removeProperty('--light-x');surface.style.removeProperty('--light-y')});
  });
  let reflectionFrame=0;
  function reflectScroll(){reflectionFrame=0;const angle=Math.sin(window.scrollY/280)*16;glassSurfaces.forEach(surface=>{surface.style.setProperty('--rim-angle',`${angle}deg`);surface.style.setProperty('--light-x',`${84+Math.sin(window.scrollY/350)*5}%`)})}
  window.addEventListener('scroll',()=>{if(!reflectionFrame)reflectionFrame=requestAnimationFrame(reflectScroll)},{passive:true});
  reflectScroll();
})();
