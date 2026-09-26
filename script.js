/* case-file expand/collapse */
document.querySelectorAll('[data-case]').forEach(c=>{
  c.querySelector('.chead').addEventListener('click',()=>{
    const willOpen=!c.classList.contains('open');
    document.querySelectorAll('[data-case]').forEach(x=>x.classList.remove('open'));
    if(willOpen)c.classList.add('open');
  });
});

const main = document.getElementById('main');
const slides = [...document.querySelectorAll('[data-slide]')];
const railLinks = document.querySelectorAll('.railnav a');
const dots = document.querySelectorAll('.dotnav button');
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* which slide is active — drives the zoom-in and both nav states */
function setActive(id){
  slides.forEach(s=>s.classList.toggle('in-view', s.id===id || (id==='hero' && s.classList.contains('hero'))));
  railLinks.forEach(a=>a.classList.toggle('on', a.getAttribute('href')==='#'+id));
  dots.forEach(d=>d.classList.toggle('on', d.dataset.to===id));
}

if (main && 'IntersectionObserver' in window && !RM){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting && en.intersectionRatio > 0.45){
        setActive(en.target.id || 'hero');
      }
    });
  }, {root: main, threshold: [0, .45, .6, 1]});
  slides.forEach(s=>io.observe(s));
  setActive('hero');
} else {
  slides.forEach(s=>s.classList.add('in-view'));
}

/* dot nav — jump straight to a slide, it zooms into place on arrival */
dots.forEach(d=>{
  d.addEventListener('click', ()=>{
    const target = d.dataset.to === 'hero'
      ? slides.find(s=>s.classList.contains('hero'))
      : document.getElementById(d.dataset.to);
    if(target) target.scrollIntoView({behavior: RM ? 'auto' : 'smooth', block:'start'});
  });
});

/* left rail links target the internal scroll container, not the window */
railLinks.forEach(a=>{
  a.addEventListener('click', ev=>{
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(target){
      ev.preventDefault();
      target.scrollIntoView({behavior: RM ? 'auto' : 'smooth', block:'start'});
    }
  });
});

/* gentle cursor-reactive tilt on the hero diagnostic panel */
const strip = document.querySelector('.stripbox');
if (strip && !RM && matchMedia('(hover:hover)').matches){
  strip.addEventListener('mousemove', e=>{
    const r = strip.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - .5;
    const py = (e.clientY - r.top)/r.height - .5;
    strip.style.transform = `perspective(900px) rotateX(${(-py*3).toFixed(2)}deg) rotateY(${(px*3).toFixed(2)}deg)`;
  });
  strip.addEventListener('mouseleave', ()=>{ strip.style.transform=''; });
}