import{f as v,a as b,b as P,P as j,c as O}from"./razorpay-mock.3rWHtbsc.js";import"./hoisted.BTgJGwRc.js";import"./schema.C5v6fmKx.js";const g={"MBA-BF":"MBA · B&F",MMS:"MMS",BMS:"BMS",PHD:"Ph.D."},C={"auth.login.success":"signed in","auth.login.failed":"failed sign-in","auth.login.invalid_input":"invalid sign-in attempt","auth.logout":"signed out","enquiry.received":"enquiry received","enquiry.status_changed":"enquiry status updated","application.submitted":"application submitted","application.status_changed":"application status updated","content.updated":"content updated","demo.seed":"demo data seeded"};async function l(e,a){const n=await fetch(e,{credentials:"same-origin",...a});if(n.status===401)throw window.location.href="/admin/login",new Error("unauthenticated");if(!n.ok)throw new Error(`${e} → ${n.status}`);return n.json()}const R=document.querySelectorAll(".cms-tab"),A=document.querySelectorAll("[data-tab]"),M={dashboard:"Overview",applications:"Applications",enquiries:"Enquiries",students:"Students",pages:"Pages",programs:"Programmes",faculty:"Faculty",events:"Events",testimonials:"Testimonials",payments:"Payments",settings:"Settings"};function E(e){R.forEach(n=>n.classList.toggle("is-active",n.dataset.tab===e)),A.forEach(n=>n.classList.toggle("is-active",n.dataset.tab===e));const a=document.getElementById("cmsTitle");a&&(a.textContent=M[e]??"Overview"),history.replaceState&&history.replaceState(null,"","#"+e)}A.forEach(e=>e.addEventListener("click",a=>{a.preventDefault(),E(e.dataset.tab??"dashboard")}));document.querySelectorAll("[data-tab-link]").forEach(e=>e.addEventListener("click",a=>{a.preventDefault(),E(e.dataset.tabLink??"dashboard")}));location.hash&&M[location.hash.slice(1)]&&E(location.hash.slice(1));document.getElementById("seedDemo")?.addEventListener("click",async e=>{const a=e.currentTarget;a.disabled=!0,a.textContent="Seeding…";try{await l("/api/admin/seed-demo",{method:"POST"}),await h()}finally{a.disabled=!1,a.textContent="Seed demo data"}});document.getElementById("signOut")?.addEventListener("click",async()=>{await fetch("/api/auth/logout",{method:"POST",credentials:"same-origin"}),window.location.href="/admin/login"});function r(e,a){const n=document.getElementById(e);n&&(n.textContent=a)}function s(e){return String(e??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}async function h(){const e=document.getElementById("filterProg")?.value??"",a=document.getElementById("filterStatus")?.value??"",n=new URLSearchParams;e&&n.set("programme",e),a&&n.set("status",a);const[u,y,c]=await Promise.all([l(`/api/admin/applications?${n.toString()}`),l("/api/admin/enquiries"),l("/api/admin/audit?limit=20").catch(()=>({entries:[]}))]),i=u.applications,m=y.enquiries,d=u.stats;r("kpiApps",String(d.total)),r("kpiEnq",String(m.length)),r("appCountBadge",String(d.total)),r("enqCountBadge",String(m.length)),r("kpiRevenue",v(d.revenuePaise/100));const _=Math.max(...Object.values(d.byProgramme),1),$=document.getElementById("progBars");$&&($.innerHTML=Object.keys(g).map(t=>{const o=d.byProgramme[t]??0;return`
        <div class="prog-bar">
          <div class="prog-bar__label"><span>${g[t]}</span><strong>${o}</strong></div>
          <div class="prog-bar__track"><div class="prog-bar__fill" style="width:${o/_*100}%"></div></div>
        </div>`}).join(""));const S=i.slice(0,5),B=document.getElementById("recentApps");B&&(B.innerHTML=S.length===0?'<li class="recent-list__empty">No applications yet.</li>':S.map(t=>`
        <li class="recent-list__item">
          <div>
            <strong>${s(t.personal.firstName)} ${s(t.personal.lastName)}</strong>
            <small>${g[t.programme]} · ${s(t.personal.email)}</small>
          </div>
          <time>${b(t.submittedAt)}</time>
        </li>`).join(""));const f=document.getElementById("appsTable");f&&(f.innerHTML=i.length===0?'<tr><td colspan="7" class="cms-empty">No applications match the current filter.</td></tr>':i.map(t=>`
        <tr data-app-id="${s(t.id)}">
          <td><code>${s(t.id)}</code></td>
          <td><strong>${s(t.personal.firstName)} ${s(t.personal.lastName)}</strong><br><small>${s(t.personal.email)}</small></td>
          <td>${g[t.programme]}</td>
          <td>${P(t.submittedAt)}</td>
          <td>${s(t.amount)}</td>
          <td>
            <select class="status-select" data-app-id="${s(t.id)}" aria-label="Change status">
              ${["submitted","shortlisted","interviewed","offered","rejected"].map(o=>`<option value="${o}"${o===t.status?" selected":""}>${o}</option>`).join("")}
            </select>
          </td>
          <td><a class="link-underline" href="mailto:${s(t.personal.email)}">Email</a></td>
        </tr>`).join(""),f.querySelectorAll(".status-select").forEach(t=>{t.addEventListener("change",async()=>{const o=t.dataset.appId,p=t.value;if(o)try{await l(`/api/admin/applications?id=${encodeURIComponent(o)}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({status:p})}),await h()}catch(T){console.error("status update failed",T),t.value=t.dataset.previous??t.value}})}));const L=document.getElementById("enqTable");L&&(L.innerHTML=m.length===0?'<tr><td colspan="6" class="cms-empty">No enquiries yet.</td></tr>':m.map(t=>`
        <tr>
          <td>${b(t.received)}</td>
          <td>${s(t.name)}</td>
          <td>${s(t.email)}</td>
          <td>${s(t.programme)}</td>
          <td><small>${s((t.message??"").slice(0,80))}${(t.message??"").length>80?"…":""}</small></td>
          <td><button class="btn btn--ghost btn--small">Reply</button></td>
        </tr>`).join("")),r("payToday",v(d.todayPaise/100)),r("payMonth",v(d.revenuePaise/100));const w=document.getElementById("payTable");w&&(w.innerHTML=i.length===0?'<tr><td colspan="6" class="cms-empty">No payments yet.</td></tr>':i.map(t=>`
        <tr>
          <td><code>${s(t.payment.id)}</code></td>
          <td>${s(t.id)}</td>
          <td>${j[t.payMethod]}</td>
          <td>${s(t.amount)}</td>
          <td><span class="status-pill status-pill--enrolled">Captured</span></td>
          <td>${P(t.submittedAt)}</td>
        </tr>`).join(""));const I=document.getElementById("auditList");if(I){const t=c.entries;I.innerHTML=t.length===0?'<li class="recent-list__empty">No audit entries yet.</li>':t.map(o=>{const p=new Date(o.createdAt),q=p.toDateString()===new Date().toDateString()?p.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}):b(p),k=o.actorEmail??"public",D=C[o.action]??o.action,N=o.targetId?` · <code>${s(o.targetId)}</code>`:"";return`<li><time>${s(q)}</time><span><strong>${s(k)}</strong> ${s(D)}${N}</span></li>`}).join("")}}["filterProg","filterStatus"].forEach(e=>document.getElementById(e)?.addEventListener("change",h));document.getElementById("exportCsv")?.addEventListener("click",async()=>{const e=await l("/api/admin/applications");if(!e.applications.length){alert("No applications to export.");return}const n=[["ID","First name","Last name","Email","Phone","Programme","Status","Amount","Submitted at"]];e.applications.forEach(i=>n.push([i.id,i.personal.firstName,i.personal.lastName,i.personal.email,i.personal.phone,O[i.programme],i.status,i.amount,i.submittedAt]));const u=n.map(i=>i.map(m=>`"${(m??"").toString().replace(/"/g,'""')}"`).join(",")).join(`
`),y=new Blob([u],{type:"text/csv"}),c=document.createElement("a");c.href=URL.createObjectURL(y),c.download="mmbgims-applications-"+new Date().toISOString().slice(0,10)+".csv",c.click(),URL.revokeObjectURL(c.href)});document.getElementById("saveContent")?.addEventListener("click",async()=>{const e={eyebrow:document.getElementById("edit-eyebrow")?.value??"",h1:document.getElementById("edit-h1")?.value??"",lede:document.getElementById("edit-lede")?.value??""},a=document.getElementById("saveMsg");try{await l("/api/admin/content?key=home_hero",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(e)}),a&&(a.hidden=!1,a.textContent="✓ Saved",setTimeout(()=>a.hidden=!0,3500))}catch(n){a&&(a.hidden=!1,a.textContent="⚠ Save failed"),console.error(n)}});h();
