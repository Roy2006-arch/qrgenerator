document.addEventListener('DOMContentLoaded', () => {
    // Selectors
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const generateBtn = document.getElementById('generate-btn');
    const qrPlaceholder = document.getElementById('qr-placeholder');
    const qrResult = document.getElementById('qr-result');
    const qrActions = document.getElementById('qr-actions');
    const qrCard = document.getElementById('qr-card');
    const historyList = document.getElementById('history-list');

    // Inputs
    const upiIdInput = document.getElementById('upi-id');
    const nameInput = document.getElementById('name');
    const amountInput = document.getElementById('amount');
    const noteInput = document.getElementById('note');

    // Modals
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalCancel = document.getElementById('modal-cancel');
    const modalConfirm = document.getElementById('modal-confirm');

    // Action Buttons
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const resetAllBtn = document.getElementById('reset-all-btn');

    let modalAction = null;

    // Tab Switching
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabContents.forEach(content => {
                gsap.killTweensOf(content);
                content.classList.remove('active', 'tab-active-flex');
                content.style.display = 'none';

                if (content.id === `tab-${target}`) {
                    content.classList.add('active', 'tab-active-flex');
                    content.style.display = 'flex';
                    gsap.fromTo(content, 
                        { opacity: 0, y: 30 }, 
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                    );
                }
            });

            if (target === 'history') {
                renderHistory();
            }
        });
    });

    // Generate QR
    generateBtn.addEventListener('click', async () => {
        const upiId = upiIdInput.value.trim();
        const name = nameInput.value.trim() || 'User';
        const amount = amountInput.value.trim();
        const note = noteInput.value.trim() || 'Payment';

        if (!upiId || !amount || amount <= 0) {
            showToast('Please enter a valid UPI ID and amount', 'error');
            return;
        }

        // Processing State
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span>Generating...</span><i data-lucide="loader" class="spin"></i>';
        lucide.createIcons();
        
        gsap.to(qrCard, { rotateY: 180, duration: 0.6, ease: "back.inOut" });

        // Artificial delay for premium feel
        await new Promise(r => setTimeout(r, 1000));

        try {
            const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name).replace(/\+/g, '%20')}&am=${parseFloat(amount).toFixed(2)}&tn=${encodeURIComponent(note).replace(/\+/g, '%20')}&cu=INR`;
            
            renderQR(upiUrl, amount, upiId, name, note);
            saveToHistory({ 
                id: Date.now(),
                amount, 
                upiId, 
                name, 
                note, 
                date: new Date().toLocaleString() 
            });
            showToast('QR Code Generated!', 'success');

        } catch (error) {
            console.error(error);
            showToast('Error generating QR code', 'error');
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span>Generate Secure QR</span><i data-lucide="arrow-right"></i>';
            lucide.createIcons();
            gsap.to(qrCard, { rotateY: 0, duration: 0.6, ease: "back.inOut" });
        }
    });

    function renderQR(data, amount, upiId, name, note) {
        qrPlaceholder.classList.add('hidden');
        qrResult.classList.remove('hidden');
        qrActions.classList.remove('hidden');
        
        qrResult.innerHTML = '';
        
        new QRCode(qrResult, {
            text: data,
            width: 300,
            height: 300,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        
        gsap.from("#qr-result canvas, #qr-result img", { scale: 0.2, opacity: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
        gsap.from(".qr-actions", { opacity: 0, y: 20, stagger: 0.1, delay: 0.5 });
    }

    // --- HISTORY MGT ---
    function saveToHistory(item) {
        const history = JSON.parse(localStorage.getItem('np_history') || '[]');
        history.unshift(item);
        localStorage.setItem('np_history', JSON.stringify(history.slice(0, 20)));
        
        if (document.getElementById('setting-autosave').checked) {
            localStorage.setItem('np_last_upi', item.upiId);
            localStorage.setItem('np_last_name', item.name);
        }
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('np_history') || '[]');
        if (history.length === 0) {
            historyList.innerHTML = '<div class="empty-state"><i data-lucide="folder-open"></i><p>No history found yet</p></div>';
            lucide.createIcons();
            return;
        }

        historyList.innerHTML = history.map((item) => `
            <div class="history-card" onclick="reRunHistory(${item.id || `'${item.upiId}'`})">
                <div class="history-icon" onclick="event.stopPropagation(); deleteItem(${item.id || `'${item.upiId}'`})">
                    <i data-lucide="trash-2" class="delete-icon"></i>
                </div>
                <div class="history-info">
                    <h4>${item.name}</h4>
                    <p>${item.date}</p>
                    <span class="history-note">${item.note || 'Payment Note'}</span>
                </div>
                <div class="history-amount">₹${item.amount}</div>
            </div>
        `).join('');
        lucide.createIcons();
    }

    window.deleteItem = (id) => {
        const history = JSON.parse(localStorage.getItem('np_history') || '[]');
        const filtered = history.filter(item => item.id !== id);
        localStorage.setItem('np_history', JSON.stringify(filtered));
        renderHistory();
        showToast('Item deleted from history', 'info');
    };

    window.reRunHistory = (id) => {
        const history = JSON.parse(localStorage.getItem('np_history') || '[]');
        const item = history.find(i => i.id === id || i.upiId === id); // fallback search
        if (!item) return;
        
        upiIdInput.value = item.upiId;
        nameInput.value = item.name;
        amountInput.value = item.amount;
        noteInput.value = item.note;

        document.querySelector('[data-tab="generate"]').click();
        
        // Auto-generate for premium feel
        setTimeout(() => {
            generateBtn.click();
            showToast('Regenerating from history...', 'success');
        }, 100);
    }

    // --- SETTINGS MGT ---
    resetAllBtn.addEventListener('click', () => {
        showModal(
            'Reset All Data?', 
            'This will clear your history, saved UPI ID, and reset all settings. This cannot be undone.', 
            () => {
                localStorage.clear();
                window.location.reload();
            }
        );
    });

    clearHistoryBtn.addEventListener('click', () => {
        showModal(
            'Clear History?', 
            'Are you sure you want to delete all transaction history?', 
            () => {
                localStorage.setItem('np_history', '[]');
                renderHistory();
                showToast('History cleared successfully', 'success');
            }
        );
    });

    // Handle Setting Toggles
    const settings = ['autosave', 'simulate'];
    settings.forEach(key => {
        const el = document.getElementById(`setting-${key}`);
        // Load saved state
        const saved = localStorage.getItem(`np_setting_${key}`);
        if (saved !== null) el.checked = saved === 'true';

        el.addEventListener('change', () => {
            localStorage.setItem(`np_setting_${key}`, el.checked);
            showToast(`Setting updated: ${key}`, 'info');
        });
    });

    // --- MODAL CONTROLLER ---
    function showModal(title, desc, onConfirm) {
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalOverlay.classList.add('active');
        modalAction = onConfirm;
    }

    function hideModal() {
        modalOverlay.classList.remove('active');
        modalAction = null;
    }

    modalCancel.addEventListener('click', hideModal);
    modalConfirm.addEventListener('click', () => {
        if (modalAction) modalAction();
        hideModal();
    });

    // Extra Features
    document.getElementById('download-btn').addEventListener('click', () => {
        const canvas = qrResult.querySelector('canvas');
        if (!canvas) return;
        
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");
        link.download = `NexPay_QR_${Date.now()}.png`;
        link.click();
        showToast('Saving to downloads...', 'success');
    });

    document.getElementById('verify-payment-btn').addEventListener('click', () => {
        if (!document.getElementById('setting-simulate').checked) {
            showToast('Simulation is disabled in settings', 'error');
            return;
        }
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f2ff', '#bf00ff', '#ffffff']
        });
        showToast('Processing your payment...', 'info');
        setTimeout(() => {
            showToast('Payment Verified Successfully!', 'success');
        }, 2000);
    });

    // Toast Notification System
    function showToast(message, type) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Load saved details
    const savedUpi = localStorage.getItem('np_last_upi');
    const savedName = localStorage.getItem('np_last_name');
    if (savedUpi) upiIdInput.value = savedUpi;
    if (savedName) nameInput.value = savedName;

    // Entry Animations
    gsap.from(".glass-nav", { y: -100, opacity: 0, duration: 1, ease: "power4.out" });
    gsap.from(".form-container", { x: -100, opacity: 0, duration: 1.2, delay: 0.3, ease: "power4.out" });
    gsap.from(".qr-display-container", { x: 100, opacity: 0, duration: 1.2, delay: 0.5, ease: "power4.out" });

});
