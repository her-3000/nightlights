/* Bangkok calendar dates, independent of the visitor's timezone. */
window.createNightDates = function(host, id) {
  const today = () => new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const parse = key => new Date(key+'T12:00:00Z');
  const key = date => date.toISOString().slice(0,10);
  const add = (value,n) => {const d=parse(value);d.setUTCDate(d.getUTCDate()+n);return key(d)};
  const month = value => value.slice(0,7)+'-01';
  const format = value => new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',timeZone:'UTC'}).format(parse(value));
  let shown=month(today()), selected=new Set(), locked=false;
  host.innerHTML=`<button class="dates-toggle" type="button" aria-expanded="false" aria-controls="${id}-calendar"><span>Your dates</span><span class="dates-summary">Choose dates ＋</span></button><section id="${id}-calendar" class="glass-calendar" aria-label="Choose available dates" hidden><div class="calendar-header"><button type="button" class="month-prev" aria-label="Previous month">‹</button><strong></strong><button type="button" class="month-next" aria-label="Next month">›</button><button type="button" class="calendar-done">Done</button></div><p class="calendar-help">Choose any dates · up to 9 days ahead</p><div class="calendar-week" aria-hidden="true"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div><div class="calendar-days" role="group" aria-label="Available dates"></div><p class="calendar-legend">Grey: past · Crossed: not yet available</p></section>`;
  const toggle=host.querySelector('.dates-toggle'), panel=host.querySelector('.glass-calendar'), days=host.querySelector('.calendar-days');
  function bounds(){const min=today();return {min,max:add(min,9)}}
  function sync(){const {min,max}=bounds();selected=new Set([...selected].filter(d=>d>=min&&d<=max));host.querySelector('.dates-summary').textContent=selected.size?[...selected].sort().map(format).join(', '):'Choose dates ＋';}
  function render(){
    const {min,max}=bounds();sync();
    if(shown<month(min)||shown>month(max))shown=month(min);
    host.querySelector('strong').textContent=new Intl.DateTimeFormat('en-GB',{month:'long',year:'numeric',timeZone:'UTC'}).format(parse(shown));
    host.querySelector('.month-prev').disabled=shown<=month(min);host.querySelector('.month-next').disabled=shown>=month(max);
    days.replaceChildren();const first=parse(shown);const offset=(first.getUTCDay()+6)%7;
    const last=new Date(first);last.setUTCMonth(last.getUTCMonth()+1);last.setUTCDate(0);
    const cells=Math.ceil((offset+last.getUTCDate())/7)*7;
    for(let i=0;i<cells;i++){
      const value=add(shown,i-offset), date=parse(value), button=document.createElement('button');
      const past=value<min, future=value>max;
      button.type='button';button.textContent=date.getUTCDate();button.dataset.date=value;
      button.className='calendar-day'+(past?' is-past':future?' is-unavailable':'')+(value===min?' is-today':'');
      button.disabled=locked||past||future;button.setAttribute('aria-pressed',String(selected.has(value)));
      button.setAttribute('aria-label',new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date)+(past?', past':future?', unavailable':''));
      button.addEventListener('click',()=>{const range=bounds();if(locked||value<range.min||value>range.max){render();return}selected.has(value)?selected.delete(value):selected.add(value);sync();button.setAttribute('aria-pressed',String(selected.has(value)));});
      days.append(button);
    }
  }
  function open(){if(locked)return;render();panel.hidden=false;toggle.setAttribute('aria-expanded','true');}
  function close(){if(host.classList.contains('reuse-dates'))return;panel.hidden=true;toggle.setAttribute('aria-expanded','false');}
  toggle.addEventListener('click',()=>{if(panel.hidden)open();else close()});
  host.querySelector('.calendar-done').addEventListener('click',()=>{close();toggle.focus({preventScroll:true})});
  host.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.stopPropagation();close();toggle.focus({preventScroll:true})}});
  for(const [selector,delta] of [['.month-prev',-1],['.month-next',1]])host.querySelector(selector).addEventListener('click',()=>{const d=parse(shown);d.setUTCMonth(d.getUTCMonth()+delta);shown=key(d);render()});
  return {open,setValues(values){selected=new Set(values);sync();},values(){sync();return [...selected].sort()},focus(){open();(days.querySelector('button:not(:disabled)')||toggle).focus({preventScroll:true})},lock(){locked=true;close();toggle.disabled=true},close,format};
};
