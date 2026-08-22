(function() {
    // ==================== DOM ELEMENTS ====================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navbarNav = document.getElementById('navbarNav');
    const siteHeader = document.getElementById('siteHeader');
    const langSwitcher = document.getElementById('langSwitcher');
    const langOptions = langSwitcher.querySelectorAll('.lang-switcher__option');
    const packageTabs = document.querySelectorAll('.package-tab');
    const hajjGrid = document.getElementById('hajjGrid');
    const umrahGrid = document.getElementById('umrahGrid');
    const copyrightYearSpan = document.getElementById('copyrightYear');
    const allNavLinks = navbarNav.querySelectorAll('a');
    const flightSearchForm = document.getElementById('flightSearchForm');

    // Set current year
    if (copyrightYearSpan) {
        copyrightYearSpan.textContent = new Date().getFullYear();
    }

    // ==================== MOBILE MENU TOGGLE ====================
    function closeMobileMenu() {
        navbarNav.classList.remove('open');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }

    function openMobileMenu() {
        navbarNav.classList.add('open');
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }

    mobileMenuToggle.addEventListener('click', function() {
        if (navbarNav.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close mobile menu when a nav link is clicked
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarNav.classList.contains('open')) {
                closeMobileMenu();
            }
            // Update active link visually
            allNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navbarNav.classList.contains('open') &&
            !navbarNav.contains(e.target) &&
            !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarNav.classList.contains('open')) {
            closeMobileMenu();
            mobileMenuToggle.focus();
        }
    });

    // ==================== STICKY HEADER SHADOW ON SCROLL ====================
    function updateHeaderShadow() {
        if (window.scrollY > 10) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateHeaderShadow, { passive: true });
    updateHeaderShadow();

    // ==================== LANGUAGE SWITCHER ====================
    let currentLang = 'en';

    function switchLanguage(lang) {
        currentLang = lang;
        // Update all translatable elements
        const translatableElements = document.querySelectorAll('[data-lang-en][data-lang-bn]');
        translatableElements.forEach(el => {
            const text = el.getAttribute(`data-lang-${lang}`);
            if (text !== null && text !== undefined) {
                el.textContent = text;
            }
        });

        // Update lang switcher button states
        langOptions.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === lang) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });

        document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
        updateFlightFormPlaceholders(lang);
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    function updateFlightFormPlaceholders(lang) {
        const fromSelect = document.getElementById('departureFrom');
        const toSelect = document.getElementById('arrivalTo');
        const travelersSelect = document.getElementById('travelersClass');

        if (lang === 'bn') {
            if (fromSelect && fromSelect.options[0]) fromSelect.options[0].textContent = 'শহর নির্বাচন করুন';
            if (toSelect && toSelect.options[0]) toSelect.options[0].textContent = 'শহর নির্বাচন করুন';
            if (travelersSelect && travelersSelect.options[0]) travelersSelect.options[0].textContent = 'নির্বাচন করুন';
        } else {
            if (fromSelect && fromSelect.options[0]) fromSelect.options[0].textContent = 'Select city';
            if (toSelect && toSelect.options[0]) toSelect.options[0].textContent = 'Select city';
            if (travelersSelect && travelersSelect.options[0]) travelersSelect.options[0].textContent = 'Select';
        }
    }

    langOptions.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            if (lang && lang !== currentLang) {
                switchLanguage(lang);
            }
        });
    });

    // Keyboard accessibility for language switcher
    langSwitcher.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const newLang = currentLang === 'en' ? 'bn' : 'en';
            switchLanguage(newLang);
            const activeBtn = langSwitcher.querySelector(`[data-lang="${newLang}"]`);
            if (activeBtn) activeBtn.focus();
        }
    });

    // ==================== PACKAGE TAB SWITCHING ====================
    function switchPackageTab(tabName) {
        packageTabs.forEach(tab => {
            const tabValue = tab.getAttribute('data-tab');
            if (tabValue === tabName) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        if (tabName === 'hajj') {
            umrahGrid.classList.add('fade-out');
            setTimeout(() => {
                umrahGrid.classList.add('hidden');
                umrahGrid.classList.remove('fade-out');
                hajjGrid.classList.remove('hidden');
                void hajjGrid.offsetWidth;
                hajjGrid.style.opacity = '1';
                hajjGrid.style.transform = 'translateY(0)';
            }, 200);
            hajjGrid.style.opacity = '0';
            hajjGrid.style.transform = 'translateY(10px)';
            setTimeout(() => {
                hajjGrid.style.opacity = '1';
                hajjGrid.style.transform = 'translateY(0)';
            }, 220);
        } else if (tabName === 'umrah') {
            hajjGrid.classList.add('fade-out');
            setTimeout(() => {
                hajjGrid.classList.add('hidden');
                hajjGrid.classList.remove('fade-out');
                umrahGrid.classList.remove('hidden');
                void umrahGrid.offsetWidth;
                umrahGrid.style.opacity = '1';
                umrahGrid.style.transform = 'translateY(0)';
            }, 200);
            umrahGrid.style.opacity = '0';
            umrahGrid.style.transform = 'translateY(10px)';
            setTimeout(() => {
                umrahGrid.style.opacity = '1';
                umrahGrid.style.transform = 'translateY(0)';
            }, 220);
        }
    }

    packageTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            if (tabName) {
                switchPackageTab(tabName);
            }
        });
    });

    // Initialize: Hajj grid visible, Umrah hidden
    hajjGrid.classList.remove('hidden');
    umrahGrid.classList.add('hidden');
    hajjGrid.style.opacity = '1';
    hajjGrid.style.transform = 'translateY(0)';

    // ==================== FLIGHT SEARCH FORM HANDLER ====================
    flightSearchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const from = document.getElementById('departureFrom').value;
        const to = document.getElementById('arrivalTo').value;
        const departDate = document.getElementById('departDate').value;
        const returnDate = document.getElementById('returnDate').value;
        const travelersClass = document.getElementById('travelersClass').value;

        if (!from || !to || !departDate || !returnDate || !travelersClass) {
            alert(currentLang === 'bn' ?
                'অনুগ্রহ করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন।' :
                'Please fill in all required fields.');
            return;
        }

        const depart = new Date(departDate);
        const returnD = new Date(returnDate);
        if (returnD <= depart) {
            alert(currentLang === 'bn' ?
                'ফেরার তারিখ অবশ্যই departure তারিখের পরে হতে হবে।' :
                'Return date must be after the departure date.');
            return;
        }

        // Mock search result
        const message = currentLang === 'bn' ?
            `ফ্লাইট অনুসন্ধান শুরু হচ্ছে...\n${from} → ${to}\nযাত্রা: ${departDate} | ফেরা: ${returnDate}` :
            `Searching flights...\n${from} → ${to}\nDepart: ${departDate} | Return: ${returnDate}`;

        alert(message + '\n\n' + (currentLang === 'bn' ?
            '(এটি একটি ডেমো প্রদর্শনী — প্রকৃত বুকিং সিস্টেম শীঘ্রই আসছে)' :
            '(This is a demo showcase — real booking system coming soon)'));
    });

    // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = siteHeader.offsetHeight + 16;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== ACTIVE NAV LINK ON SCROLL ====================
    function updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + siteHeader.offsetHeight + 60;

        let currentSectionId = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.replace('#', '') === currentSectionId) {
                link.classList.add('active');
            }
        });

        if (window.scrollY < 100) {
            allNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });
    updateActiveNavOnScroll();

    // ==================== INITIALIZATION LOG ====================
    console.log('%c🕋 Noor Al-Iman Travels %cReady',
        'font-weight:bold;color:#0B5345;font-size:1.1rem;',
        'color:#D4AF37;font-weight:bold;');
    console.log('%cPremium Hajj & Umrah Agency — All systems initialized',
        'color:#6B7280;font-style:italic;');
})();