(() => {
  const modal=document.createElement('dialog');
  modal.className='newsletter-modal';modal.setAttribute('aria-labelledby','newsletter-title');
  modal.innerHTML=`<button class="newsletter-close" type="button" aria-label="Close newsletter">×</button><div class="newsletter-invite"><p class="newsletter-kicker">One more thing…</p><h2 id="newsletter-title">Want to join our newsletter?</h2><p>Stay up to date with music and new bars in Thailand.</p><form class="newsletter-form"><label for="newsletter-email">Your email</label><input id="newsletter-email" type="email" name="email" autocomplete="email" placeholder="you@example.com" maxlength="254" required><button class="newsletter-submit" type="submit">Keep me updated</button></form><button class="newsletter-skip" type="button">Not now</button></div><div class="newsletter-thanks" hidden><p class="newsletter-kicker">Night Lights ♥</p><h2 tabindex="-1">Thanks for your interest.</h2><p>Email signup is coming soon.</p><button class="newsletter-done" type="button">Back to tonight</button></div>`;
  document.body.append(modal);
  let offered=false,previousFocus;
  function close(){modal.close();document.body.classList.remove('newsletter-open');previousFocus?.focus({preventScroll:true})}
  document.addEventListener('nightlights-submitted',()=>{
    if(offered)return;offered=true;previousFocus=document.activeElement;
    document.body.classList.add('newsletter-open');modal.showModal();
  });
  for(const selector of ['.newsletter-close','.newsletter-skip','.newsletter-done'])modal.querySelector(selector).addEventListener('click',close);
  modal.addEventListener('cancel',e=>{e.preventDefault();close()});
  modal.querySelector('form').addEventListener('submit',e=>{
    e.preventDefault();if(!e.currentTarget.reportValidity())return;
    // Visual prototype only. Do not transmit or persist the email without a signup backend.
    modal.querySelector('input').value='';
    modal.querySelector('.newsletter-invite').hidden=true;modal.querySelector('.newsletter-thanks').hidden=false;
    modal.querySelector('.newsletter-thanks h2').focus();
  });
})();
