// === main.js — interactive logic for the evaluation site ===

const D = window.EVAL_DATA;

// === Charts ===
function getCss(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

const palette = {
  text: getCss('--text') || '#e4e8f1',
  textDim: getCss('--text-dim') || '#97a0bd',
  border: getCss('--border') || '#2a3458',
  accent: getCss('--accent') || '#5ee0c4',
  accent2: getCss('--accent-2') || '#3a8df2',
  warn: getCss('--warn') || '#ffb347',
  danger: getCss('--danger') || '#ff6b6b'
};

Chart.defaults.color = palette.textDim;
Chart.defaults.borderColor = palette.border;
Chart.defaults.font.family = "Inter, system-ui, sans-serif";

// Bucket bar chart
(function() {
  const ctx = document.getElementById('bucketChart');
  if (!ctx) return;
  const labels = Object.keys(D.buckets);
  const data = labels.map(k => D.buckets[k].avg);
  const names = labels.map(k => D.buckets[k].name);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map((k, i) => k + ' · ' + names[i].split(' ')[0]),
      datasets: [{
        data,
        backgroundColor: data.map(v => v < 4 ? palette.warn : v >= 4.6 ? palette.accent : palette.accent2),
        borderRadius: 6,
        barThickness: 28
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => names[items[0].dataIndex],
            label: (item) => 'Avg score: ' + item.parsed.x.toFixed(2) + '/5'
          },
          backgroundColor: '#1a2138',
          borderColor: palette.border,
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        x: { min: 0, max: 5, grid: { color: palette.border }, ticks: { stepSize: 1 } },
        y: { grid: { display: false } }
      }
    }
  });
})();

// Trap pie
(function() {
  const ctx = document.getElementById('trapChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Handled correctly (7)', 'Hallucinated (1 — J-001)'],
      datasets: [{
        data: [7, 1],
        backgroundColor: [palette.accent, palette.danger],
        borderColor: '#0a0e1a',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '64%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 14, font: { size: 12 } } },
        tooltip: { backgroundColor: '#1a2138', borderColor: palette.border, borderWidth: 1 }
      }
    }
  });
})();

// Response depth chart
(function() {
  const ctx = document.getElementById('depthChart');
  if (!ctx) return;
  const labels = Object.keys(D.responseDepth);
  const data = labels.map(k => Math.round(D.responseDepth[k] / 1000));
  new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: palette.accent2, borderRadius: 4 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: (item) => '~' + item.parsed.y + 'K chars avg' },
          backgroundColor: '#1a2138', borderColor: palette.border, borderWidth: 1
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: palette.border }, ticks: { callback: (v) => v + 'K' } }
      }
    }
  });
})();

// Trust bars
(function() {
  const host = document.getElementById('trustBars');
  if (!host) return;
  for (const item of D.trustByUseCase) {
    const pct = (item.score / 5) * 100;
    const row = document.createElement('div');
    row.className = 'trust-bar-row';
    row.innerHTML = `
      <div class="label">${item.label}</div>
      <div class="score">${item.score.toFixed(1)} / 5</div>
      <div class="trust-bar-track"><div class="trust-bar-fill" style="width:${pct}%"></div></div>
    `;
    host.appendChild(row);
  }
})();

// === Bucket panel ===
function scoreClass(s) { return s >= 4.6 ? 'high' : s >= 4.0 ? 'mid' : 'low'; }

function renderBucket(letter) {
  const b = D.buckets[letter];
  const panel = document.getElementById('bucketPanel');
  panel.innerHTML = `
    <div class="bucket-panel-header">
      <div class="bucket-panel-info">
        <h3>Bucket ${letter} — ${b.name}</h3>
        <p>${b.desc}</p>
      </div>
      <div class="bucket-panel-score">
        <div class="val">${b.avg.toFixed(2)}</div>
        <div class="lbl">avg score · ${b.tests.length} tests</div>
      </div>
    </div>
    <div class="bucket-tests">
      ${b.tests.map(t => {
        const idClean = t.id.replace('-','');
        const shotFile = `test-${idClean}-top.png`;
        return `
          <div class="bucket-test-row">
            <div class="tid">${t.id}</div>
            <div class="tprompt">${t.prompt}</div>
            <div class="tscore ${scoreClass(t.score)}">${t.score.toFixed(2)}</div>
            <div class="tlinks">
              <a class="tlink" href="screenshots/${shotFile}" data-lightbox="${t.id}" data-label="${t.id} — score ${t.score.toFixed(2)}">📷 Screenshot</a>
              <a class="tlink" href="https://github.com/cpgenaicopilot/ai-assist-evaluation/blob/main/transcripts/03-bucket-${letter}-${slug(b.name)}.md#${idClean.toLowerCase()}" target="_blank" rel="noopener">📝 Transcript</a>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  // Wire screenshots to lightbox
  panel.querySelectorAll('[data-lightbox]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(a.getAttribute('href'), a.getAttribute('data-label'));
    });
  });
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

document.querySelectorAll('.bucket-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.bucket-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderBucket(btn.dataset.bucket);
  });
});
renderBucket('A');

// === Conversations grid ===
(function() {
  const host = document.getElementById('convGrid');
  if (!host) return;
  for (const c of D.conversations) {
    const card = document.createElement('div');
    card.className = 'conv-card' + (c.highlight ? ' conv-highlight' : '');
    card.innerHTML = `
      <span class="conv-id">${c.id}</span>
      <h4>${c.title}</h4>
      <p class="conv-desc">${c.desc}</p>
      <div class="conv-meta">
        <span>${c.turns} turn${c.turns === 1 ? '' : 's'}</span>
        <span class="conv-score">${c.score.toFixed(2)} / 5</span>
      </div>
    `;
    host.appendChild(card);
  }
})();

// === Gallery ===
const galleryHost = document.getElementById('gallery');
const galleryHeader = document.getElementById('galleryHeader');
let galleryFilter = 'highlights';

const galleryDescs = {
  highlights: { title: '⭐ Curated Highlights', desc: 'The 15 most important screenshots — start here if you want to see the standout moments.' },
  J: { title: '🪤 Trap Tests (Bucket J)', desc: 'Eight deliberately wrong, ambiguous, or impossible prompts. 7 handled correctly. J-001 (Tokyo-DataCenter) is the one failure.' },
  MULTI: { title: '🧠 MULTI-001 — Cumulative Multi-Step', desc: 'Gold-standard multi-step behavior. The AI tracked analysis state across 6 turns and refused to overreach in T4/T5.' },
  SLOPPY: { title: '💬 Sloppy-Prompt Tests', desc: 'SLOPPY-001 (6-turn lazy-prompt workflow) + 3 single sloppy prompts. Tests whether AI handles abbreviations and vague references.' },
  CONV: { title: '💭 Multi-Turn Conversations (CONV-002 — CONV-011)', desc: '40 turns across 10 admin workflows. 100% pass rate on conversational memory.' },
  A: { title: 'Bucket A — Posture & Inventory', desc: D.buckets.A.desc },
  B: { title: 'Bucket B — Rulebase Analysis & Hygiene', desc: D.buckets.B.desc },
  C: { title: 'Bucket C — Object & Group Hygiene', desc: D.buckets.C.desc },
  D: { title: 'Bucket D — Threat Prevention Quality', desc: D.buckets.D.desc },
  E: { title: 'Bucket E — Day-to-Day Operations', desc: D.buckets.E.desc },
  F: { title: 'Bucket F — Troubleshooting', desc: D.buckets.F.desc },
  G: { title: 'Bucket G — Compliance, Audit & Evidence', desc: D.buckets.G.desc },
  H: { title: 'Bucket H — VPN & Connectivity', desc: D.buckets.H.desc },
  I: { title: 'Bucket I — Migration, Upgrade & Capacity', desc: D.buckets.I.desc },
  K: { title: 'Bucket K — Complex Multi-Step Workflows', desc: D.buckets.K.desc }
};

function scoreBadge(score) {
  if (score == null) return '';
  let cls = 'badge-mid';
  if (score >= 4.6) cls = 'badge-high';
  else if (score < 4.0) cls = 'badge-low';
  return `<span class="card-score-badge ${cls}">${score.toFixed(2)}</span>`;
}

function bucketTag(letter) {
  return letter ? `<span class="card-bucket-tag bucket-${letter}">${letter}</span>` : '';
}

function renderGallery() {
  if (!galleryHost) return;
  galleryHost.innerHTML = '';
  const meta = galleryDescs[galleryFilter] || { title: 'Screenshots', desc: '' };
  galleryHeader.innerHTML = `<h3>${meta.title}</h3><p>${meta.desc}</p>`;

  let items = [];
  if (galleryFilter === 'highlights') {
    items = D.highlightScreenshots.map(h => ({ ...h, bucket: bucketOf(h.id) }));
  } else if (galleryFilter === 'MULTI') {
    items = [
      { file: 'test-MULTI-001-T1-top.png', id: 'MULTI-001-T1', label: 'T1 — find 5 worst rules' },
      { file: 'test-MULTI-001-T2-top.png', id: 'MULTI-001-T2', label: 'T2 — impact of deleting rule #1' },
      { file: 'test-MULTI-001-T3-top.png', id: 'MULTI-001-T3', label: 'T3 — impact of deleting rule #2' },
      { file: 'test-MULTI-001-T4-top.png', id: 'MULTI-001-T4', label: 'T4 — refused to extrapolate', score: 5.0 },
      { file: 'test-MULTI-001-T5-top.png', id: 'MULTI-001-T5', label: 'T5 — refused to fabricate ticket', score: 5.0 },
      { file: 'test-MULTI-001-T6-top.png', id: 'MULTI-001-T6', label: 'T6 — synthesis preserving state' }
    ];
  } else if (galleryFilter === 'SLOPPY') {
    items = [
      { file: 'test-SLOPPY-001-T1-top.png', id: 'SLOPPY-001-T1', label: '"audit my fws"' },
      { file: 'test-SLOPPY-001-T2-top.png', id: 'SLOPPY-001-T2', label: '"wat about the worst one"' },
      { file: 'test-SLOPPY-001-T3-top.png', id: 'SLOPPY-001-T3', label: '"fix it"' },
      { file: 'test-SLOPPY-001-T4-top.png', id: 'SLOPPY-001-T4', label: '"and the others"' },
      { file: 'test-SLOPPY-001-T5-top.png', id: 'SLOPPY-001-T5', label: '"ok will any of that break stuff"' },
      { file: 'test-SLOPPY-001-T6-top.png', id: 'SLOPPY-001-T6', label: '"k summarize for jira"' },
      { file: 'test-SLOPPY-S1-top.png', id: 'SLOPPY-S1', label: '"is my fw ok"' },
      { file: 'test-SLOPPY-S2-top.png', id: 'SLOPPY-S2', label: '"we got hackd?"' },
      { file: 'test-SLOPPY-S3-top.png', id: 'SLOPPY-S3', label: '"rdp" → 5-option clarification' }
    ];
  } else if (galleryFilter === 'CONV') {
    items = buildConvGallery();
  } else if (D.buckets[galleryFilter]) {
    items = D.buckets[galleryFilter].tests.map(t => ({
      file: `test-${t.id.replace('-','')}-top.png`,
      id: t.id, label: t.diff, score: t.score, bucket: galleryFilter
    }));
  }

  for (const item of items) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
      <div class="gallery-img-wrap">
        <img src="screenshots/${item.file}" alt="${item.label || item.id}" loading="lazy" onerror="this.parentElement.parentElement.style.display='none'">
      </div>
      <div class="gallery-card-body">
        <div class="gallery-card-top">
          ${bucketTag(item.bucket)}
          <span class="gallery-card-id">${item.id}</span>
          ${scoreBadge(item.score)}
        </div>
        ${item.label ? `<div class="gallery-card-label">${item.label}</div>` : ''}
      </div>
    `;
    div.addEventListener('click', () => openLightbox('screenshots/' + item.file, item.id + (item.label ? ' — ' + item.label : '')));
    galleryHost.appendChild(div);
  }
}

function bucketOf(testId) {
  if (!testId) return null;
  const m = testId.match(/^([A-K])/);
  return m ? m[1] : null;
}

function buildConvGallery() {
  const out = [];
  const convScores = {};
  for (const c of D.conversations) {
    convScores[c.id.replace('CONV-', 'CONV')] = c.score;
    convScores[c.id] = c.score;
  }
  // CONV-001 (the original R80.40 conversation) has transcripts but no screenshots captured
  for (let n = 2; n <= 11; n++) {
    const id = 'CONV0' + (n < 10 ? '0' + n : n);
    const score = D.conversations.find(c => c.id === 'CONV-0' + (n < 10 ? '0' + n : n))?.score;
    const title = D.conversations.find(c => c.id === 'CONV-0' + (n < 10 ? '0' + n : n))?.title || '';
    for (let t = 1; t <= 4; t++) out.push({ file: `test-${id}-T${t}-top.png`, id: `${id}-T${t}`, label: title, score: t === 4 ? score : null });
  }
  return out;
}

document.querySelectorAll('.gallery-cat').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gallery-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    galleryFilter = btn.dataset.cat;
    renderGallery();
  });
});
renderGallery();

// Contrast images also open in lightbox
document.querySelectorAll('.contrast-screenshot').forEach(el => {
  el.addEventListener('click', () => {
    const img = el.querySelector('img');
    if (img) openLightbox(img.src, img.alt);
  });
});

// === Lightbox ===
function openLightbox(src, caption) {
  const box = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxCaption').textContent = caption || '';
  box.classList.add('open');
}

// === Back to top ===
(function() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// === Example questions: copy on click ===
document.querySelectorAll('.example-q').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.textContent.replace(/^["']|["']$/g, '');
    try {
      await navigator.clipboard.writeText(text);
      const original = btn.textContent;
      btn.textContent = '✓ Copied to clipboard!';
      btn.style.borderColor = palette.accent;
      btn.style.color = palette.accent;
      setTimeout(() => { btn.textContent = original; btn.style.borderColor = ''; btn.style.color = ''; }, 1500);
    } catch (e) {
      console.log('clipboard failed', e);
    }
  });
});

