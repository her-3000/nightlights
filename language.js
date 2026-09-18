/* Translate presentation only: never rebuild forms or modify entered account values. */
(() => {
  const pairs = {
    'One more thing…':'อีกนิดหนึ่ง…', 'Want to join our newsletter?':'อยากรับข่าวสารจากเราไหม?', 'Stay up to date with music and new bars in Thailand.':'อัปเดตเรื่องดนตรีและบาร์เปิดใหม่ในไทย', 'Your email':'อีเมลของคุณ', 'Keep me updated':'รับข่าวสาร', 'Not now':'ไว้ก่อน', 'Close newsletter':'ปิดหน้ารับข่าวสาร', 'Thanks for your interest.':'ขอบคุณที่สนใจ', 'Email signup is coming soon.':'เปิดรับอีเมลเร็ว ๆ นี้',

    'Your night in':'ค่ำคืนของคุณใน', 'three steps.':'3 ขั้นตอน', 'Pick a place.':'เลือกที่เที่ยว.', 'Bring your friends.':'ชวนเพื่อนมา.',
    'Soi 11 · Hip-hop':'ซอย 11 · ฮิปฮอป', 'Soi 11 · Nightclub':'ซอย 11 · ไนต์คลับ', 'Sukhumvit 40 · Rooftop':'สุขุมวิท 40 · รูฟท็อป',
    'Entry + shared drinks':'สิทธิ์เข้างาน + เครื่องดื่มร่วมกัน', 'Entry + shared table':'สิทธิ์เข้างาน + โต๊ะร่วม', 'A rooftop night + welcome drink':'ค่ำคืนบนรูฟท็อป + เครื่องดื่มต้อนรับ',
    'TAP TO TURN ↗':'แตะเพื่อพลิก ↗', 'Your invitation':'คำเชิญของคุณ', 'You + your friends':'คุณและเพื่อน ๆ', 'Included':'สิ่งที่ได้รับ', 'Tonight’s plan':'แผนคืนนี้', 'Dress code / theme':'การแต่งกาย / ธีม', 'To be confirmed':'รอยืนยัน',
    'Join guest list':'ลงชื่อเข้าร่วม', 'GOOD NIGHTS. GREAT PHOTOS.':'ค่ำคืนดี ๆ ภาพสวย ๆ', 'TAG VENUES. ENJOY.':'แท็กสถานที่ แล้วสนุกได้เลย', 'Your night in three steps.':'ค่ำคืนของคุณใน 3 ขั้นตอน', 'Pick a spot.':'เลือกสถานที่', 'Request the guest list.':'ลงชื่อเข้าร่วม', 'Scan in.':'สแกนเข้างาน', 'No later than 45 minutes after start.':'ภายใน 45 นาทีหลังเริ่มงาน', 'Stay three hours.':'อยู่ร่วมงาน 3 ชั่วโมง', 'Scan your QR in and out.':'สแกนคิวอาร์ตอนเข้าและออก', 'Paid booking? Both scans are required for payment.':'งานมีค่าตอบแทน? ต้องสแกนทั้งเข้าและออกเพื่อรับเงิน', 'Back to tonight':'กลับไปดูคืนนี้',
    'LINE':'ไลน์', 'LINE ID':'ไอดีไลน์', 'Instagram':'อินสตาแกรม', 'TikTok':'ติ๊กต็อก', 'Your LINE ID':'ไอดีไลน์ของคุณ', '@yourname':'@ชื่อผู้ใช้ของคุณ',
    'Add your three accounts. Tap or slide to switch.':'กรอกทั้ง 3 บัญชี แตะหรือเลื่อนเพื่อสลับ', 'Submit':'ส่งข้อมูล', 'Submitting…':'กำลังส่ง…', 'Submitted ♥':'ส่งแล้ว ♥', 'Submitted.':'ส่งข้อมูลแล้ว', 'Updates via LINE.':'แจ้งผลทางไลน์',
    'Join this venue as well?':'สนใจเข้าร่วมที่นี่ด้วยไหม?', 'Finish your three accounts first':'กรอกทั้ง 3 บัญชีให้ครบก่อน', 'Choose your dates':'เลือกวันที่ของคุณ', 'Choose at least one date':'เลือกอย่างน้อย 1 วัน', 'Choose at least one date within the next nine days.':'เลือกอย่างน้อย 1 วัน ภายใน 9 วันข้างหน้า',
    'Your dates':'วันที่สะดวก', 'Choose dates ＋':'เลือกวันที่ ＋', 'Done':'เสร็จ', 'Choose any dates · up to 9 days ahead':'เลือกได้หลายวัน · ล่วงหน้าได้ไม่เกิน 9 วัน', 'Grey: past · Crossed: not yet available':'สีเทา: ผ่านแล้ว · กากบาท: ยังจองไม่ได้',
    'Close guest form':'ปิดแบบฟอร์ม', 'Social accounts':'บัญชีโซเชียล', 'Opening guest list':'กำลังเปิดแบบฟอร์ม', 'Choose available dates':'เลือกวันที่สะดวก', 'Available dates':'วันที่เลือกได้', 'Previous month':'เดือนก่อน', 'Next month':'เดือนถัดไป', 'Venue invitations':'คำเชิญจากสถานที่'
  };
  function translate(s) {
    if(pairs[s])return pairs[s];
    let m;
    if((m=s.match(/^Book (.+)$/)))return 'จอง '+m[1];
    if((m=s.match(/^(.+), tonight\.$/)))return m[1]+' คืนนี้';
    if((m=s.match(/^(.+) application$/)))return 'คำขอเข้าร่วม '+m[1];
    if((m=s.match(/^Show (.+) details$/)))return 'ดูรายละเอียด '+m[1];
    if((m=s.match(/^(.+) guest list$/)))return 'ลงชื่อเข้าร่วม '+m[1];
    if((m=s.match(/^(\d{2}:\d{2}) start · stay three hours$/)))return 'เริ่ม '+m[1]+' · อยู่ร่วมงาน 3 ชั่วโมง';
    if((m=s.match(/^Scan in by (.+)$/)))return 'สแกนเข้าภายใน '+m[1];
    if((m=s.match(/^Add your (.+) to continue\.$/)))return 'กรอก'+(pairs[m[1]]||m[1])+'เพื่อดำเนินการต่อ';
    return s;
  }
  let lang='en';try{if(localStorage.getItem('nightlights-language')==='th')lang='th'}catch{}
  const control=document.createElement('div');control.className='language-switch';control.setAttribute('role','group');control.setAttribute('aria-label','Language / ภาษา');
  control.innerHTML='<span aria-hidden="true"></span><button type="button" lang="th" data-lang="th">ไทย</button><button type="button" lang="en" data-lang="en">English</button>';
  document.body.prepend(control);
  const originals=new WeakMap(), attributes=new WeakMap();
  function update(root=document.body){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
    while((n=walker.nextNode())){
      if(n.parentElement.closest('script,style,svg,.language-switch,.reuse-summary'))continue;
      let record=originals.get(n);if(!record||n.nodeValue!==record.last)record={original:n.nodeValue};
      const trimmed=record.original.trim();const next=lang==='th'?record.original.replace(trimmed,translate(trimmed)):record.original;
      if(n.nodeValue!==next)n.nodeValue=next;record.last=next;originals.set(n,record);
    }
    root.querySelectorAll('[placeholder],[aria-label]').forEach(el=>{
      if(el.closest('.language-switch')||el.classList.contains('calendar-day'))return;
      const records=attributes.get(el)||{};
      for(const attr of ['placeholder','aria-label']){if(!el.hasAttribute(attr))continue;let r=records[attr];const val=el.getAttribute(attr);if(!r||val!==r.last)r={original:val};const next=lang==='th'?translate(r.original):r.original;if(val!==next)el.setAttribute(attr,next);r.last=next;records[attr]=r;}
      attributes.set(el,records);
    });
  }
  const observer=new MutationObserver(()=>{observer.disconnect();update();observe()});
  function observe(){observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label']})}
  function setLanguage(next){lang=next;document.documentElement.lang=lang;control.style.setProperty('--language',lang==='en'?1:0);control.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));try{localStorage.setItem('nightlights-language',lang)}catch{}observer.disconnect();update();document.dispatchEvent(new Event('nightlights-language'));update();observe();}
  control.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
  control.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=['ArrowLeft','Home'].includes(e.key)?'th':'en';setLanguage(next);control.querySelector(`[data-lang="${next}"]`).focus()});
  let start=null;control.addEventListener('pointerdown',e=>{start=e.clientX});control.addEventListener('pointerup',e=>{if(start!==null&&Math.abs(e.clientX-start)>12)setLanguage(e.clientX>start?'en':'th');start=null});control.addEventListener('pointercancel',()=>start=null);
  setLanguage(lang);
})();
