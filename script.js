/* ====================================================
   MOGU MOGU — INTERACTIVE SCRIPT
   Vanilla JS · No dependencies
   ==================================================== */

(function () {
    'use strict';

    /* ----- Loading Screen ----- */
    var loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(function () {
            loadingScreen.style.pointerEvents = 'none';
        }, 3000);
        loadingScreen.addEventListener('animationend', function (e) {
            if (e.animationName === 'loadingFadeOut') {
                loadingScreen.style.display = 'none';
            }
        });
    }

    /* ----- Navbar: solid on scroll ----- */
    var navbar = document.querySelector('.navbar');
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    /* ----- Mobile Menu (JS-driven) ----- */
    var hamburger = document.getElementById('hamburger-btn');

    function closeMobileMenu() {
        navbar.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    function toggleMobileMenu() {
        var isOpen = navbar.classList.toggle('menu-open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    /* Close mobile menu when clicking a nav link */
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navbar.classList.contains('menu-open')) {
                closeMobileMenu();
            }
        });
    });

    /* ----- Flavors Dropdown ----- */
    var dropdown = document.querySelector('.nav-dropdown');
    var dropdownToggle = document.querySelector('.dropdown-toggle');

    function toggleDropdown() {
        var isOpen = dropdown.classList.toggle('open');
        dropdownToggle.setAttribute('aria-expanded', String(isOpen));
    }

    function closeDropdown() {
        dropdown.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
    }

    dropdownToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleDropdown();
    });

    /* Close dropdown when clicking outside */
    document.addEventListener('click', function (e) {
        if (!dropdown.contains(e.target)) {
            closeDropdown();
        }
    });

    /* Close dropdown on Escape */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeDropdown();
            closeMobileMenu();
            closeFlavorModal();
        }
    });

    /* ----- Flavor Modal ----- */
    var modal = document.getElementById('flavor-modal');
    var modalImage = document.getElementById('modal-flavor-image');
    var modalName = document.getElementById('modal-flavor-name');
    var modalDesc = document.getElementById('modal-flavor-description');
    var flavorItems = document.querySelectorAll('.flavor-item[data-name]');
    var allFlavorItems = document.querySelectorAll('.flavor-item');
    var totalFlavors = allFlavorItems.length;
    var flavorWrapper = document.querySelector('.flavor-wrapper');

    function openFlavorModal(el) {
        var name = el.getAttribute('data-name');
        var img = el.getAttribute('data-img');
        var desc = el.getAttribute('data-desc');
        modalImage.src = img;
        modalImage.alt = 'Mogu Mogu ' + name;
        modalName.textContent = name;
        modalDesc.textContent = desc;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function closeFlavorModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
    }

    flavorItems.forEach(function (item) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function () {
            openFlavorModal(item);
        });
    });

    /* Close modal via backdrop or close button */
    var closeButtons = modal.querySelectorAll('[data-modal-close]');
    closeButtons.forEach(function (btn) {
        btn.addEventListener('click', closeFlavorModal);
    });

    /* ----- Dropdown → scroll to correct flavor ----- */
    var dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var index = Number(item.getAttribute('data-index'));
            var targetItem = allFlavorItems[index];
            if (targetItem && flavorWrapper) {
                flavorWrapper.scrollTo({
                    left: targetItem.offsetLeft - (flavorWrapper.clientWidth - targetItem.offsetWidth) / 2,
                    behavior: 'smooth'
                });
            }
            closeDropdown();
            if (navbar.classList.contains('menu-open')) {
                closeMobileMenu();
            }
        });
    });

    /* ----- Flavor Counter Update on Scroll ----- */
    var flavorCounter = document.querySelector('.flavors-counter');

    if (flavorWrapper && flavorCounter) {
        flavorWrapper.addEventListener('scroll', function () {
            var scrollLeft = flavorWrapper.scrollLeft;
            var wrapperWidth = flavorWrapper.clientWidth;
            var scrollCenter = scrollLeft + wrapperWidth / 2;
            var activeIndex = 0;

            allFlavorItems.forEach(function (item, index) {
                var itemCenter = item.offsetLeft + item.offsetWidth / 2;
                if (scrollCenter >= item.offsetLeft && scrollCenter <= item.offsetLeft + item.offsetWidth) {
                    activeIndex = index;
                }
            });

            var num = String(activeIndex + 1).padStart(2, '0');
            var total = String(totalFlavors).padStart(2, '0');
            flavorCounter.textContent = num + ' / ' + total;
        }, { passive: true });
    }

    /* ----- Scroll Reveal (IntersectionObserver) ----- */
    var revealElements = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window && revealElements.length) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    /* ----- Country Code Picker ----- */
    var countryPicker = document.querySelector('.country-picker');
    var countryToggle = document.querySelector('.country-toggle');
    var countryOptions = document.querySelectorAll('.country-option');
    var countrySearch = document.querySelector('.country-search');
    var countryList = document.querySelector('.country-list');

    if (countryPicker && countryToggle) {
        countryToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = countryPicker.classList.toggle('open');
            countryToggle.setAttribute('aria-expanded', String(isOpen));
            if (isOpen && countrySearch) {
                countrySearch.value = '';
                filterCountries('');
                setTimeout(function () { countrySearch.focus(); }, 100);
            }
        });

        countryOptions.forEach(function (option) {
            option.addEventListener('click', function () {
                var flag = option.getAttribute('data-flag');
                var code = option.getAttribute('data-code');
                var selectedFlagEl = countryPicker.querySelector('.selected-flag');

                /* Use image for supplied flags, emoji for other countries */
                if (/\.(png|jpg|jpeg|webp|svg)$/i.test(flag)) {
                    selectedFlagEl.innerHTML = '<img src="' + flag + '" alt="flag" class="flag-img">';
                } else {
                    selectedFlagEl.textContent = flag;
                }

                countryPicker.querySelector('.selected-code').textContent = code;

                /* Update selected state */
                countryOptions.forEach(function (o) { o.classList.remove('selected'); });
                option.classList.add('selected');

                countryPicker.classList.remove('open');
                countryToggle.setAttribute('aria-expanded', 'false');
            });
        });

        /* Search filter */
        if (countrySearch) {
            countrySearch.addEventListener('input', function () {
                filterCountries(countrySearch.value.toLowerCase());
            });
        }

        function filterCountries(query) {
            countryOptions.forEach(function (option) {
                var name = option.getAttribute('data-country').toLowerCase();
                var code = option.getAttribute('data-code');
                var match = !query || name.indexOf(query) !== -1 || code.indexOf(query) !== -1;
                option.style.display = match ? '' : 'none';
            });
        }

        /* Close on outside click */
        document.addEventListener('click', function (e) {
            if (!countryPicker.contains(e.target)) {
                countryPicker.classList.remove('open');
                countryToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }


    /* ----- Form Validation ----- */
    var form = document.querySelector('.preorder-form');
    var formSuccess = document.getElementById('form-success');

    function showError(inputEl, message) {
        var group = inputEl.closest('.form-group');
        group.classList.add('error');
        var errorEl = group.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    function clearError(inputEl) {
        var group = inputEl.closest('.form-group');
        group.classList.remove('error');
    }

    function validateName(inputEl) {
        var val = inputEl.value.trim();
        if (!val) {
            showError(inputEl, 'Please enter your name.');
            return false;
        }
        clearError(inputEl);
        return true;
    }

    function validateEmail(inputEl) {
        var val = inputEl.value.trim();
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val) {
            showError(inputEl, 'Please enter your email.');
            return false;
        }
        if (!emailPattern.test(val)) {
            showError(inputEl, 'Please enter a valid email.');
            return false;
        }
        clearError(inputEl);
        return true;
    }

    function validateMessage(inputEl) {
        var val = inputEl.value.trim();
        if (val.length < 10) {
            showError(inputEl, 'Message must be at least 10 characters.');
            return false;
        }
        clearError(inputEl);
        return true;
    }

    function validatePhone(inputEl) {
        var val = inputEl.value.replace(/\D/g, '');
        if (val.length < 6) {
            showError(inputEl, 'Please enter a valid phone number.');
            return false;
        }
        clearError(inputEl);
        return true;
    }

    if (form) {
        var nameInput = form.querySelector('#po-name');
        var emailInput = form.querySelector('#po-email');
        var phoneInput = form.querySelector('#po-phone');
        var messageInput = form.querySelector('#po-address');

        /* Validate on blur */
        nameInput.addEventListener('blur', function () { validateName(nameInput); });
        emailInput.addEventListener('blur', function () { validateEmail(emailInput); });
        if (phoneInput) {
            phoneInput.addEventListener('blur', function () { validatePhone(phoneInput); });
        }
        if (messageInput) {
            messageInput.addEventListener('blur', function () { validateMessage(messageInput); });
        }

        /* Clear error on input */
        nameInput.addEventListener('input', function () {
            if (nameInput.value.trim()) clearError(nameInput);
        });
        emailInput.addEventListener('input', function () {
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) clearError(emailInput);
        });
        if (phoneInput) {
            phoneInput.addEventListener('input', function () {
                if (phoneInput.value.replace(/\D/g, '').length >= 6) clearError(phoneInput);
            });
        }
        if (messageInput) {
            messageInput.addEventListener('input', function () {
                if (messageInput.value.trim().length >= 10) clearError(messageInput);
            });
        }

        /* Validate on submit */
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var valid = true;
            if (!validateName(nameInput)) valid = false;
            if (!validateEmail(emailInput)) valid = false;
            if (phoneInput && !validatePhone(phoneInput)) valid = false;
            if (messageInput && !validateMessage(messageInput)) valid = false;

            if (valid) {
                form.reset();
                formSuccess.hidden = false;
                setTimeout(function () {
                    formSuccess.hidden = true;
                }, 5000);
            }
        });
    }

})();
