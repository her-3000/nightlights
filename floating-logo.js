(() => {
  const home = document.querySelector('header .glass-logo');
  if (!home) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const float = document.createElement('div');
  float.className = 'floating-logo glass-logo';
  float.setAttribute('aria-hidden', 'true');
  float.innerHTML = home.innerHTML;
  document.body.append(float);
  // A converging displacement field bends the backdrop slightly toward its centre.
  const map = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><defs><linearGradient id="x"><stop stop-color="#ff0000"/><stop offset="1" stop-color="#000000"/></linearGradient><linearGradient id="y" x2="0" y2="1"><stop stop-color="#00ff00"/><stop offset="1" stop-color="#000000"/></linearGradient></defs><rect width="200" height="100" fill="#000080"/><rect width="200" height="100" fill="url(#x)" style="mix-blend-mode:screen"/><rect width="200" height="100" fill="url(#y)" style="mix-blend-mode:screen"/></svg>`;
  const defs = document.createElement('div');
  defs.setAttribute('aria-hidden', 'true');
  defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  defs.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="floating-glass-lens" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage href="data:image/svg+xml,${encodeURIComponent(map)}" result="lens" preserveAspectRatio="none"/><feDisplacementMap in="SourceGraphic" in2="lens" scale="14" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".35"/></filter></defs></svg>`;
  document.body.append(defs);
  let x = 0, y = 0, vx = 22, vy = 16, angle = 0, targetAngle = 0;
  let frame = 0, last = 0, editing = false, maxX = 0, maxY = 0;
  let scrollDrift = 0, previousScroll = window.scrollY;
  const edge = 14;
  function bounds(reset = false) {
    maxX = Math.max(edge, innerWidth - float.offsetWidth - edge);
    maxY = Math.max(edge, (visualViewport?.height || innerHeight) - float.offsetHeight - edge);
    if (reset) { x = (innerWidth - float.offsetWidth) / 2; y = 18; }
    x = Math.max(edge, Math.min(x, maxX)); y = Math.max(edge, Math.min(y, maxY));
    paint();
  }
  function paint() {
    float.style.transform = `translate3d(${x}px,${y}px,0) rotate(${angle}deg)`;
    float.style.setProperty('--rim-angle', `${angle * 3}deg`);
  }
  function tick(time) {
    frame = 0;
    const dt = last ? Math.min((time - last) / 1000, .05) : 0;
    last = time;
    if (!editing) {
      const drift = scrollDrift * (1 - Math.exp(-dt * 3));
      scrollDrift -= drift;
      x += vx * dt; y += vy * dt + drift;
      let hit = false;
      if (x <= edge || x >= maxX) { x = Math.max(edge, Math.min(x, maxX)); vx *= -1; hit = true; }
      if (y <= edge || y >= maxY) { y = Math.max(edge, Math.min(y, maxY)); vy *= -1; hit = true; }
      if (hit) targetAngle = (Math.random() - .5) * 12;
      angle += (targetAngle - angle) * Math.min(1, dt * .6);
      paint();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    float.hidden = false;
    document.documentElement.classList.toggle('has-floating-logo', !motion.matches);
    if (!motion.matches && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function focusState() {
    editing = !!document.activeElement?.matches('input,textarea,select,[contenteditable="true"]');
    float.classList.toggle('is-editing', editing);
  }
  window.addEventListener('scroll', () => {
    const delta = window.scrollY - previousScroll;
    previousScroll = window.scrollY;
    if (!motion.matches && !editing) scrollDrift = Math.max(-100, Math.min(100, scrollDrift - delta * .3));
  }, { passive: true });
  document.addEventListener('focusin', focusState);
  document.addEventListener('focusout', () => queueMicrotask(focusState));
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  addEventListener('resize', () => bounds());
  visualViewport?.addEventListener('resize', () => bounds());
  bounds(true); sync();
})();
