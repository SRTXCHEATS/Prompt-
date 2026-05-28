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
    }, 8000); // १.२ सेकेन्ड लोडर घुम्ने समय (हल्का रियालिस्टिक देखाउन)
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
    }, 2500);
}

// ==========================================
// 🔥 SRT BRAND REAL PERCENTAGE LOADER LOGIC
// ==========================================
let globalLoaderFinished = false;
let poorInternetTimer;

window.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const poorNetBox = document.getElementById('poorNetBox');

    let totalAssets = 0;
    let loadedAssets = 0;
    let minimumTimePassed = false;
    let imageTrackingComplete = false;

    // स्लो इन्टरनेट अलर्ट टिमर (७ सेकेन्ड)
    poorInternetTimer = setTimeout(() => {
        if (!imageTrackingComplete && !globalLoaderFinished) {
            poorNetBox.classList.remove('hidden');
        }
    }, 7000);

    // ३ सेकेन्ड सम्म "Security Fetching" होल्ड गर्ने
    setTimeout(() => {
        minimumTimePassed = true;
        checkPreloaderConditions();
    }, 10000);

    // इमेज ट्र्याकिङ लोजिक
    const allImgs = document.querySelectorAll('img');
    totalAssets = allImgs.length;

    if (totalAssets === 0) {
        updateProgress(100);
        imageTrackingComplete = true;
        checkPreloaderConditions();
    } else {
        allImgs.forEach((img) => {
            if (img.complete) {
                assetLoadedSuccess();
            } else {
                img.addEventListener('load', assetLoadedSuccess);
                img.addEventListener('error', assetLoadedSuccess);
            }
        });
    }

    function assetLoadedSuccess() {
        if (globalLoaderFinished) return;
        loadedAssets++;
        
        let percentage = Math.round((loadedAssets / totalAssets) * 100);
        updateProgress(percentage);

        if (loadedAssets >= totalAssets) {
            imageTrackingComplete = true;
            checkPreloaderConditions();
        }
    }

    function updateProgress(value) {
        if (progressBar && progressText) {
            progressBar.style.width = value + '%';
            progressText.innerText = value + '%';
        }
    }

    function checkPreloaderConditions() {
        if (imageTrackingComplete && minimumTimePassed) {
            showSRTBrandAnimation();
        }
    }
});

// 🔥 काउन्टडाउन हटाएर नयाँ SRT एनिमेसन देखाउने र ३ सेकेन्डपछि होमपेज खोल्ने फंक्शन
function showSRTBrandAnimation() {
    if (globalLoaderFinished) return;
    globalLoaderFinished = true;

    clearTimeout(poorInternetTimer);

    const loaderTitle = document.getElementById('loaderTitle');
    const loaderSubText = document.getElementById('loaderSubText');
    const srtBrandBox = document.getElementById('srtBrandBox');
    const poorNetBox = document.getElementById('poorNetBox');
    const forceOpenBtn = document.getElementById('forceOpenBtn');
    const aiDotsContainer = document.getElementById('aiDotsContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    // लोडिङ र थ्री-डट्स हटाउने
    if(poorNetBox) poorNetBox.classList.add('hidden');
    if(forceOpenBtn) forceOpenBtn.classList.add('hidden');
    if(aiDotsContainer) aiDotsContainer.classList.add('hidden');
    
    if(progressBar) progressBar.style.width = '100%';
    if(progressText) progressText.innerText = '100%';

    // ब्रान्ड टाइटल अपडेट
    loaderTitle.innerText = "ACCESS GRANTED";
    loaderSubText.innerText = "Welcome to SRT Store";
    
    // SRT बक्स शो गर्ने (CSS ले आफै एनिमेसन र बाउन्स गराउँछ)
    if (srtBrandBox) {
        srtBrandBox.classList.remove('hidden');

        // ठ्याक्कै ३ सेकेन्ड (3000ms) सम्म SRT उफ्रेको देखाएर वेबसाइट भित्र छिराउने
        setTimeout(() => {
            document.getElementById('advancedLoader').classList.add('fade-out');
        }, 3000);
    }
}

// बिना लोडिङ डाइरेक्ट स्किप फंक्शन
function forceSkipLoading() {
    showSRTBrandAnimation();
}
