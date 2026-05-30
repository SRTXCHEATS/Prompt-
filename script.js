let slideInterval;





// 1. Open Popup and Start Auto-Slider
function openPopup(card) {
    const popup = document.getElementById('popup');
    const popImg1 = document.getElementById('popImg1');
    const popImg2 = document.getElementById('popImg2');
    const labelDisplay = document.getElementById('labelDisplay');

    // Pull image links from card data attributes
    popImg1.src = card.getAttribute('data-img1');
    popImg2.src = card.getAttribute('data-img2');
    
    // Show popup
    popup.classList.remove('hidden');

    // Reset view to original first when opening
    popImg1.classList.add('active');
    popImg2.classList.remove('active');
    labelDisplay.innerText = "Original";

    // 2-second auto-swipe logic
    clearInterval(slideInterval); // Clear any loose intervals
    slideInterval = setInterval(() => {
        if (popImg1.classList.contains('active')) {
            popImg1.classList.remove('active');
            popImg2.classList.add('active');
            labelDisplay.innerText = "AI Enhanced";
        } else {
            popImg2.classList.remove('active');
            popImg1.classList.add('active');
            labelDisplay.innerText = "Original";
        }
    }, 2000);

    // Save current prompt data
    window.currentPrompt = card.getAttribute('data-prompt');
}

// 2. Generate Prompt Logic (With realistic loader delay)
// २. प्रम्प्ट जेनेरेट गर्ने र आफै तल स्क्रोल हुने लोजिक
function startGeneration() {
    const genBtn = document.getElementById('genBtn');
    const loader = document.getElementById('loader');
    const typewriter = document.getElementById('typewriter');
    const copyBtn = document.getElementById('copyBtn');

    genBtn.classList.add('hidden');
    loader.classList.remove('hidden');
    typewriter.classList.add('hidden');
    typewriter.innerText = "";

    setTimeout(() => {
        loader.classList.add('hidden');
        typewriter.classList.remove('hidden');
        
        // टाइपराइटर इफेक्ट सुरु
        let i = 0;
        const text = window.currentPrompt;
        
        function type() {
            if (i < text.length) {
                typewriter.innerHTML += text.charAt(i);
                i++;
                
                // 🔥 फिक्स अटो स्क्रोल: यसले स्क्रोलबारलाई जहिले पनि नयाँ अक्षरको सिधै तल पुर्‍याउँछ
                typewriter.scrollTop = typewriter.scrollHeight + 40;
                
                setTimeout(type, 20); // २०ms ले गर्दा प्रम्प्ट छिटो र प्रिमियम तरिकाले टाइप हुन्छ
            } else {
                copyBtn.classList.remove('hidden');
                
                // टाइप भइसकेपछि अन्तिम पटक सुरक्षित तरिकाले स्क्रोल तल झार्ने
                setTimeout(() => {
                    typewriter.scrollTop = typewriter.scrollHeight + 40;
                }, 50);
            }
        }
        type();
    }, 20000); // १.२ सेकेन्ड लोडर घुम्ने समय (हल्का रियालिस्टिक देखाउन)
}


// 3. Close Popup
function closePopup() {
    clearInterval(slideInterval); 
    document.getElementById('popup').classList.add('hidden');
    document.getElementById('genBtn').classList.remove('hidden');
    document.getElementById('copyBtn').classList.add('hidden');
    document.getElementById('typewriter').classList.add('hidden');
}

// 4. Copy Code Function
function copyCode() {
    const text = document.getElementById('typewriter').innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast("Prompt Copied Successfully! 📋"); 
    });
}

// Fixed: Toast message timeout changed from 0ms to 2500ms so it stays visible
function showToast(message) {
    // Remove any existing toast first
    const oldToast = document.querySelector(".toast-message");
    if(oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.innerText = message;
    toast.className = "toast-message";
    document.body.appendChild(toast);
    
    setTimeout(() => { 
        toast.style.animation = "fadeIn 0.3s reverse"; // Smooth fade out
        setTimeout(() => { toast.remove(); }, 300);
    }, 8000);
}

// ==========================================
// 🔥 AUTO LOADER — closes when ALL images loaded
// ==========================================
let globalLoaderFinished = false;
let poorInternetTimer;

window.addEventListener('DOMContentLoaded', () => {
    const progressBar  = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const poorNetBox   = document.getElementById('poorNetBox');

    // Collect ONLY the gallery card images (data-img1 / data-img2 src attrs)
    // These are the postimg.cc images that matter for "ready"
    const cards = document.querySelectorAll('.card[data-img1]');
    const imgUrls = [];
    cards.forEach(card => {
        imgUrls.push(card.getAttribute('data-img1'));
        imgUrls.push(card.getAttribute('data-img2'));
    });

    // Also grab any visible <img> tags in the gallery
    const visibleImgs = document.querySelectorAll('.image-slider img');
    visibleImgs.forEach(img => {
        if (img.src && !imgUrls.includes(img.src)) imgUrls.push(img.src);
    });

    const totalAssets = imgUrls.length;
    let loadedAssets  = 0;

    // Slow connection alert after 6 seconds
    poorInternetTimer = setTimeout(() => {
        if (!globalLoaderFinished) {
            poorNetBox.classList.remove('hidden');
        }
    }, 6000);

    function updateProgress(value) {
        const clamped = Math.min(100, value);
        if (progressBar)  progressBar.style.width = clamped + '%';
        if (progressText) progressText.innerText  = clamped + '%';
    }

    function onAssetDone() {
        if (globalLoaderFinished) return;
        loadedAssets++;
        const pct = Math.round((loadedAssets / totalAssets) * 100);
        updateProgress(pct);

        if (loadedAssets >= totalAssets) {
            // All images loaded — show brand then close
            showSRTBrandAnimation();
        }
    }

    if (totalAssets === 0) {
        // No images to track — close after minimal 1.5s
        setTimeout(showSRTBrandAnimation, 1500);
        return;
    }

    // Pre-load every image via Image() objects so we get load/error events
    imgUrls.forEach(url => {
        const img = new Image();
        img.onload  = onAssetDone;
        img.onerror = onAssetDone; // count errors too so we never get stuck
        img.src     = url;
    });
});

// Show SRT brand logo for 2s then dismiss the loader
function showSRTBrandAnimation() {
    if (globalLoaderFinished) return;
    globalLoaderFinished = true;

    clearTimeout(poorInternetTimer);

    const loaderTitle    = document.getElementById('loaderTitle');
    const loaderSubText  = document.getElementById('loaderSubText');
    const srtBrandBox    = document.getElementById('srtBrandBox');
    const poorNetBox     = document.getElementById('poorNetBox');
    const forceOpenBtn   = document.getElementById('forceOpenBtn');
    const aiDotsContainer= document.getElementById('aiDotsContainer');
    const progressBar    = document.getElementById('progressBar');
    const progressText   = document.getElementById('progressText');

    if (poorNetBox)      poorNetBox.classList.add('hidden');
    if (forceOpenBtn)    forceOpenBtn.classList.add('hidden');
    if (aiDotsContainer) aiDotsContainer.classList.add('hidden');
    if (progressBar)     progressBar.style.width = '100%';
    if (progressText)    progressText.innerText  = '100%';

    loaderTitle.innerText  = "ACCESS GRANTED";
    loaderSubText.innerText = "Welcome to SRT Store";

    if (srtBrandBox) {
        srtBrandBox.classList.remove('hidden');
        // Show brand animation for 2 seconds then fade out
        setTimeout(() => {
            document.getElementById('advancedLoader').classList.add('fade-out');
        }, 2000);
    }
}

// Skip button still works
function forceSkipLoading() {
    showSRTBrandAnimation();
}


// ==========================================
// 🔎 SEARCH / FILTER LOGIC
// ==========================================
function filterCards(query) {
  const clearBtn = document.getElementById('clearBtn');
  const countEl  = document.getElementById('searchCount');
  const cards    = document.querySelectorAll('#gallery .card');
  const q        = query.trim().toLowerCase();

  // show/hide clear button
  clearBtn.classList.toggle('hidden', q === '');

  let visible = 0;

  // remove old empty state
  const oldEmpty = document.getElementById('emptyState');
  if (oldEmpty) oldEmpty.remove();

  cards.forEach(card => {
    const title  = card.querySelector('h3')?.innerText.toLowerCase() || '';
    const badge  = card.querySelector('.card-badge')?.innerText.toLowerCase() || '';
    const prompt = (card.getAttribute('data-prompt') || '').toLowerCase();

    const match = q === '' || title.includes(q) || badge.includes(q) || prompt.includes(q);

    if (match) {
      card.classList.remove('hidden-card');
      visible++;
    } else {
      card.classList.add('hidden-card');
    }
  });

  // count label
  if (q === '') {
    countEl.innerHTML = '';
  } else {
    countEl.innerHTML = `<span>${visible}</span> template${visible !== 1 ? 's' : ''} found`;
  }

  // empty state
  if (visible === 0 && q !== '') {
    const empty = document.createElement('div');
    empty.id = 'emptyState';
    empty.className = 'gallery-empty';
    empty.innerHTML = `<span class="empty-icon">🔍</span><p>No templates found for "<strong>${query}</strong>"</p>`;
    document.getElementById('gallery').appendChild(empty);
  }
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  input.value = '';
  filterCards('');
  input.focus();
}
