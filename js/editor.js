// ===================================================
// KARTU UCAPAN - Editor Module
// Handles modal, real-time card preview, download
// ===================================================

let currentCard = null;
let currentMessageIndex = 0;
let userLogoDataUrl = null;
let captionMessageIndex = 0;

// ── Open Editor ────────────────────────────────────
function openEditor(card) {
  currentCard = card;
  currentMessageIndex = 0;
  captionMessageIndex = 0;

  // Set default form values
  const pesan = document.getElementById('inputPesan');
  const dari = document.getElementById('inputDari');
  const untuk = document.getElementById('inputUntuk');

  pesan.value = card.messages[0];
  dari.value = '';
  untuk.value = '';

  // Clear logo
  userLogoDataUrl = null;
  document.getElementById('logoPreviewContainer').style.display = 'none';
  document.getElementById('uploadContent').style.display = 'flex';
  document.getElementById('logoPreviewImg').src = '';

  renderCardPreview();

  const modal = document.getElementById('editorModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Sesuaikan tinggi textarea begitu modal terbuka
  setTimeout(autoResizePesan, 10);
}

// ── Close Editor ───────────────────────────────────
function closeEditor() {
  document.getElementById('editorModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ── Build Card HTML ────────────────────────────────
function buildCardHTML(card, opts = {}) {
  const {
    pesan = card.messages[0],
    dari = '',
    untuk = '',
    logoUrl = null,
    forExport = false,
  } = opts;

  const cssFilter = CARD_CSS_FILTERS && CARD_CSS_FILTERS[card.id]
    ? `filter:${CARD_CSS_FILTERS[card.id]};`
    : '';

  const imgPath = opts.bgImageDataUrl || card.bgImage;



  const userLogoHTML = logoUrl
    ? `<img class="card-render-user-logo" src="${logoUrl}" alt="Logo">`
    : '';

  const dariHtml = dari
    ? `<div class="card-render-from-name">${escapeHtml(dari)}</div>`
    : `<div class="card-render-from-name" style="color:#ccc;font-style:italic">Nama Pengirim</div>`;

  const untukHtml = untuk
    ? `<div class="card-render-untuk">Untuk ${escapeHtml(untuk)}</div>`
    : '';

  return `
    <div class="card-render" id="cardRenderEl">
      <div class="card-render-image">
        <img src="${imgPath}" alt="${card.bigText}" style="${cssFilter}">
        <div class="card-render-image-overlay overlay-${card.overlayType}"></div>
        <div class="card-render-text-top">
          <div class="card-render-title">${escapeHtml(card.title)}</div>
          <div class="card-render-big" style="color:${card.titleColor}">${escapeHtml(card.bigText)}</div>
          <div class="card-render-date-line">${escapeHtml(card.islamicDate)}</div>
        </div>
      </div>
      <div class="card-render-white">
        <div class="card-render-message">${escapeHtml(pesan)}</div>
        <div class="card-render-bottom">
          <div class="card-render-from-to">
            <div class="card-render-from-label">Dari</div>
            ${dariHtml}
            ${untukHtml}
          </div>
          <div class="card-render-logos">
            <div class="card-render-watermark">
              <div>
                <div class="watermark-badge">Oleh</div>
                <div class="watermark-name">Lentera Sunnah Karimun</div>
              </div>
            </div>
            ${userLogoHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Render Preview ─────────────────────────────────
function renderCardPreview() {
  if (!currentCard) return;
  const preview = document.getElementById('cardPreview');
  preview.innerHTML = buildCardHTML(currentCard, getFormValues());
}

// ── Get Form Values ────────────────────────────────
function getFormValues() {
  return {
    pesan: document.getElementById('inputPesan').value,
    dari: document.getElementById('inputDari').value,
    untuk: document.getElementById('inputUntuk').value,
    logoUrl: userLogoDataUrl,
  };
}

async function downloadCard() {
  if (!currentCard) return;
  showSpinner('Membuat gambar...');

  try {
    // Wait for all Google Fonts to be fully loaded
    await document.fonts.ready;

    // Build a full-size off-screen card for export with fixed pixels
    const exportSize = 1080;
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: -9999px;
      z-index: -9999;
      width: ${exportSize}px;
      height: auto;
      overflow: hidden;
      border-radius: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
      visibility: hidden;
    `;

    // Convert background image to data URL to avoid CORS/file:// issues
    const bgDataUrl = await imageToDataUrl(currentCard.bgImage);

    // Build HTML and apply .export-mode
    container.innerHTML = buildCardHTML(currentCard, { ...getFormValues(), forExport: true, bgImageDataUrl: bgDataUrl });
    container.firstElementChild.classList.add('export-mode');

    document.body.appendChild(container);

    // Wait for all images inside the container to fully load
    const images = container.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    // Extra safety delay for rendering to settle
    await new Promise(r => setTimeout(r, 300));

    // Make visible right before capture (hidden was to prevent flash)
    container.style.visibility = 'visible';

    const canvas = await html2canvas(container.firstElementChild, {
      scale: 1, // Already 1080px, no need to scale up
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    document.body.removeChild(container);

    const imgPreview = document.createElement('img');
    imgPreview.src = canvas.toDataURL('image/png');
    imgPreview.style.width = '100%';
    imgPreview.style.height = 'auto';
    imgPreview.style.display = 'block';

    const previewContainer = document.getElementById('downloadPreviewImageContainer');
    previewContainer.innerHTML = '';
    previewContainer.appendChild(imgPreview);

    const previewModal = document.getElementById('downloadPreviewModal');
    previewModal.classList.add('active');

    // Remove old listeners to avoid multiple downloads
    const btnConfirm = document.getElementById('btnConfirmDownload');
    const newBtnConfirm = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtnConfirm, btnConfirm);

    newBtnConfirm.addEventListener('click', () => {
      const link = document.createElement('a');
      const fileName = `kartu-${currentCard.category}-${Date.now()}.png`;
      link.download = fileName;
      link.href = imgPreview.src;
      link.click();
      previewModal.classList.remove('active');
    });

    // Remove old listeners for cancel too
    const btnCancel = document.getElementById('btnCancelDownload');
    const newBtnCancel = btnCancel.cloneNode(true);
    btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

    newBtnCancel.addEventListener('click', () => {
      previewModal.classList.remove('active');
    });

    hideSpinner();
    showToast('✅ Kartu siap diunduh!');
  } catch (err) {
    console.error(err);
    hideSpinner();
    showToast('❌ Gagal mengunduh. Akses diblokir browser. Coba via Live Server atau deploy ke Vercel/Render.');
  }
}

// ── Share Card ─────────────────────────────────────
async function shareCard() {
  const caption = buildCaptionText();
  if (navigator.share) {
    try {
      await navigator.share({ title: `Kartu ${currentCard.bigText}`, text: caption });
    } catch (e) {
      if (e.name !== 'AbortError') copyToClipboard(caption, 'Teks berhasil disalin untuk dibagikan!');
    }
  } else {
    copyToClipboard(caption, 'Teks berhasil disalin!');
  }
}

// ── Copy Caption ───────────────────────────────────
function copyCaptionText() {
  copyToClipboard(buildCaptionText(), '📋 Caption berhasil disalin!');
}

function buildCaptionText() {
  const vals = getFormValues();
  const parts = [vals.pesan || ''];
  const meta = [
    vals.dari ? `Dari: ${vals.dari}` : null,
    vals.untuk ? `Untuk: ${vals.untuk}` : null,
  ].filter(Boolean);
  if (meta.length) parts.push('', ...meta);
  return parts.join('\n').trim();
}

function copyToClipboard(text, msg = 'Disalin!') {
  navigator.clipboard.writeText(text).then(() => showToast(msg)).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(msg);
  });
}

// ── Change Message ─────────────────────────────────
function changeCaption() {
  if (!currentCard) return;
  captionMessageIndex = (captionMessageIndex + 1) % currentCard.messages.length;
  document.getElementById('inputPesan').value = currentCard.messages[captionMessageIndex];
  renderCardPreview();
}

// ── Logo Upload ────────────────────────────────────
function setupLogoUpload() {
  const area = document.getElementById('logoUploadArea');
  const input = document.getElementById('inputLogo');
  const preview = document.getElementById('logoPreviewContainer');
  const previewImg = document.getElementById('logoPreviewImg');
  const content = document.getElementById('uploadContent');
  const removeBtn = document.getElementById('logoRemove');

  area.addEventListener('click', () => input.click());

  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleLogoFile(file);
  });

  input.addEventListener('change', () => {
    if (input.files[0]) handleLogoFile(input.files[0]);
  });

  removeBtn.addEventListener('click', e => {
    e.stopPropagation();
    userLogoDataUrl = null;
    previewImg.src = '';
    preview.style.display = 'none';
    content.style.display = 'flex';
    input.value = '';
    renderCardPreview();
  });

  function handleLogoFile(file) {
    if (file.size > 5 * 1024 * 1024) { showToast('File terlalu besar (max 5MB)'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      userLogoDataUrl = e.target.result;
      previewImg.src = userLogoDataUrl;
      preview.style.display = 'flex';
      content.style.display = 'none';
      renderCardPreview();
    };
    reader.readAsDataURL(file);
  }
}

// ── Convert Image to Data URL ──────────────────────
function imageToDataUrl(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      try {
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        // If tainted canvas, fall back to original src
        resolve(src);
      }
    };
    img.onerror = () => resolve(src); // Fall back to original on error
    img.src = src;
  });
}

// ── Utilities ──────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

let spinnerEl = null;
function showSpinner(text = 'Memproses...') {
  if (spinnerEl) return;
  spinnerEl = document.createElement('div');
  spinnerEl.className = 'spinner-overlay';
  spinnerEl.innerHTML = `<div class="spinner"></div><div class="spinner-text">${text}</div>`;
  document.body.appendChild(spinnerEl);
}
function hideSpinner() {
  if (spinnerEl) { spinnerEl.remove(); spinnerEl = null; }
}

// ── Auto Resize Textarea ───────────────────────────
function autoResizePesan() {
  const pesanInput = document.getElementById('inputPesan');
  pesanInput.style.height = 'auto'; // Reset dulu agar bisa mengecil
  pesanInput.style.height = (pesanInput.scrollHeight) + 'px'; // Setel tinggi sesuai teks
}

// ── Init Editor ────────────────────────────────────
function initEditor() {
  // Close button
  document.getElementById('modalClose').addEventListener('click', closeEditor);

  // Overlay click (outside modal)
  document.getElementById('editorModal').addEventListener('click', e => {
    if (e.target === document.getElementById('editorModal')) closeEditor();
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeEditor();
  });

  // Real-time preview
  ['inputPesan', 'inputDari', 'inputUntuk'].forEach(id => {
    document.getElementById(id).addEventListener('input', renderCardPreview);
  });

  // Listener tambahan untuk auto-resize pada textarea pesan
  document.getElementById('inputPesan').addEventListener('input', autoResizePesan);

  // Actions
  document.getElementById('btnDownload').addEventListener('click', downloadCard);
  document.getElementById('btnShare').addEventListener('click', shareCard);
  document.getElementById('btnCopy').addEventListener('click', copyCaptionText);
  document.getElementById('btnChangeCaption').addEventListener('click', changeCaption);

  // Logo upload
  setupLogoUpload();
}

document.addEventListener('DOMContentLoaded', initEditor);
