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
              <a class="tlink" href="transcripts/03-bucket-${letter}-${slug(b.name)}.md#${idClean.toLowerCase()}" target="_blank">📝 Transcript</a>
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
let galleryFilter = 'highlights';

function renderGallery() {
  if (!galleryHost) return;
  galleryHost.innerHTML = '';

  let items = [];
  if (galleryFilter === 'highlights') {
    items = D.highlightScreenshots;
  } else if (galleryFilter === 'all') {
    items = buildAllGalleryItems();
  } else if (galleryFilter === 'J') {
    items = buildBucketGallery('J');
  } else if (galleryFilter === 'MULTI') {
    items = [
      { file: 'test-MULTI-001-T1-top.png', id: 'MULTI-001-T1', label: 'T1 — find 5 worst rules' },
      { file: 'test-MULTI-001-T2-top.png', id: 'MULTI-001-T2', label: 'T2 — impact of deleting rule #1' },
      { file: 'test-MULTI-001-T3-top.png', id: 'MULTI-001-T3', label: 'T3 — impact of deleting rule #2' },
      { file: 'test-MULTI-001-T4-top.png', id: 'MULTI-001-T4', label: 'T4 — refused to extrapolate' },
      { file: 'test-MULTI-001-T5-top.png', id: 'MULTI-001-T5', label: 'T5 — refused to fabricate ticket' },
      { file: 'test-MULTI-001-T6-top.png', id: 'MULTI-001-T6', label: 'T6 — synthesis preserving state' }
    ];
  } else if (galleryFilter === 'CONV') {
    items = buildConvGallery();
  }

  for (const item of items) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
      <img src="screenshots/${item.file}" alt="${item.label}" loading="lazy" onerror="this.parentElement.style.display='none'">
      <div class="gallery-label">${item.id} — ${item.label || ''}</div>
    `;
    div.addEventListener('click', () => openLightbox('screenshots/' + item.file, item.id + (item.label ? ' — ' + item.label : '')));
    galleryHost.appendChild(div);
  }
}

function buildAllGalleryItems() {
  const all = [];
  // Bucket tests
  for (const [letter, b] of Object.entries(D.buckets)) {
    for (const t of b.tests) {
      const fileId = t.id.replace('-','');
      all.push({ file: `test-${fileId}-top.png`, id: t.id, label: t.diff });
    }
  }
  // Conversations
  for (const conv of D.conversations) {
    if (conv.files) {
      for (const f of conv.files) {
        all.push({ file: `test-${f}-top.png`, id: f, label: conv.title });
      }
    } else if (conv.id.startsWith('CONV') && conv.id !== 'CONV-001') {
      const num = conv.id.replace('CONV-', '');
      const max = typeof conv.turns === 'number' ? conv.turns : 4;
      for (let i = 1; i <= max; i++) {
        all.push({ file: `test-CONV${num}-T${i}-top.png`, id: `${conv.id}-T${i}`, label: conv.title });
      }
    } else if (conv.id === 'SLOPPY-001') {
      for (let i = 1; i <= 6; i++) all.push({ file: `test-SLOPPY-001-T${i}-top.png`, id: `SLOPPY-001-T${i}`, label: 'Sloppy multi-turn' });
    } else if (conv.id === 'MULTI-001') {
      for (let i = 1; i <= 6; i++) all.push({ file: `test-MULTI-001-T${i}-top.png`, id: `MULTI-001-T${i}`, label: 'Cumulative multi-step' });
    }
  }
  // Sloppy singles
  for (const i of ['S1','S2','S3']) {
    all.push({ file: `test-SLOPPY-${i}-top.png`, id: `SLOPPY-${i}`, label: 'Sloppy single' });
  }
  return all;
}
function buildBucketGallery(letter) {
  return D.buckets[letter].tests.map(t => ({
    file: `test-${t.id.replace('-','')}-top.png`,
    id: t.id, label: t.diff
  }));
}
function buildConvGallery() {
  const out = [];
  for (let i = 1; i <= 4; i++) out.push({ file: `test-CONV-T${i}-top.png`, id: `CONV-001-T${i}`, label: 'R80.40 upgrade' });
  for (let n = 2; n <= 11; n++) {
    const id = 'CONV0' + (n < 10 ? '0' + n : n);
    for (let t = 1; t <= 4; t++) out.push({ file: `test-${id}-T${t}-top.png`, id: `${id}-T${t}`, label: '' });
  }
  return out;
}

document.querySelectorAll('.gallery-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gallery-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    galleryFilter = btn.dataset.filter;
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

// === Open Claude project link ===
document.getElementById('openClaudeProject')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.open('https://claude.ai/projects', '_blank', 'noopener');
});
