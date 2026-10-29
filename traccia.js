/* ---------- statistiche anonime verso il CRM (Supabase, tabella eventi): niente cookie, niente dati personali ----------
   Usato dal link in bio e dalle pagine dei servizi. chiave = la chiave "publishable" del pannello admin; vuota = statistiche spente.
   ?s=codice nell'indirizzo indica da dove arriva la visita (storia, DM, bio...), come nel CRM, e passa da una pagina all'altra. */
const CRM={url:'https://wtsozmowwzroaftqyclg.supabase.co',chiave:'sb_publishable_FUXQMU6PoS_mTAOKNwp1TA_piYa8iV5'};
const SRC=(new URLSearchParams(location.search).get('s')||'').toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,20);
function track(tipo,dettaglio){if(!CRM.url||!CRM.chiave)return;
  const u=CRM.url+'/rest/v1/rpc/registra_evento?apikey='+encodeURIComponent(CRM.chiave),b=JSON.stringify({tipo,dettaglio:dettaglio||null,s:SRC||null});
  try{navigator.sendBeacon?navigator.sendBeacon(u,new Blob([b],{type:'text/plain'})):fetch(u,{method:'POST',body:b,keepalive:true,headers:{'Content-Type':'text/plain'}})}catch(e){}}
/* ---------- bot Telegram: porta d'ingresso di tutti i pulsanti (il contatto entra da solo nel CRM) ----------
   BOT = username del bot senza @ (es. IniziaOraLoreBot). Vuoto = i pulsanti usano i link diretti di prima. */
const BOT='IniziaOraLoreBot';
/* link al bot: ?start=servizio[-progetto]__provenienza (max 64 caratteri, solo lettere, numeri, - e _) */
function botURL(servizio){return BOT?'https://t.me/'+BOT+'?start='+(servizio+(SRC?'__'+SRC:'')).slice(0,64):''}
/* codice di riferimento in coda ai messaggi già scritti: servizio del CRM e provenienza; incollando il messaggio nel pannello
   ("+ Nuovo contatto") servizio e provenienza si compilano da soli */
function rif(servizio){return ' (rif. '+servizio+(SRC?' · '+SRC:'')+')'}
/* pagine dei servizi (<body data-pagina="...">): apertura della pagina, pulsanti con data-cta, link interni che tengono ?s= */
(()=>{const p=document.body&&document.body.dataset.pagina;if(!p)return;
  track('scheda','pagina/'+p);
  const BOTK={telegram:'community',salaPro:'salapro',formazione:'formazione',diario:'diario',strumenti:'strumenti','lista-attesa':'copy'};
  if(BOT)document.querySelectorAll('a[data-cta]').forEach(a=>{const k=BOTK[a.dataset.cta];if(k)a.href=botURL(k)});
  const sv=BOT?'':{formazione:'formazione',diario:'diario',strumenti:'strumenti','copy-trading':'copy'}[p];
  if(sv)document.querySelectorAll('a[data-cta][href*="?text="]').forEach(a=>{a.href=a.getAttribute('href')+encodeURIComponent(rif(sv))});
  if(location.search)document.querySelectorAll('a[href$=".html"],a[href="./"]').forEach(a=>{a.href=a.getAttribute('href')+location.search});
  document.addEventListener('click',e=>{const a=e.target.closest('a[data-cta]');if(a)track('click',p+'/'+a.dataset.cta)},true)})();
