// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})();

/* eslint-env browser */
window.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        // We use getAttribute('href') to get the exact string in the HTML
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});

// for tax-switch
let taxSwitch = document.getElementById("flexSwitchCheckDefault");

if (taxSwitch) {
    // 🛠️ Function to apply tax rendering logic across the DOM
    const updateTaxDisplay = (displaysTax) => {
        let priceDisplays = document.getElementsByClassName("listing-price-display");
        let taxInfoBadges = document.getElementsByClassName("tax-info");

        for (let i = 0; i < priceDisplays.length; i++) {
            let priceSpan = priceDisplays[i];
            let basePrice = parseFloat(priceSpan.getAttribute("data-base-price"));

            if (displaysTax) {
                let totalPrice = basePrice * 1.18; // 18% GST calculation
                priceSpan.innerText = Math.round(totalPrice).toLocaleString("en-IN");

                if (taxInfoBadges[i]) {
                    taxInfoBadges[i].classList.remove("d-none");
                    taxInfoBadges[i].classList.add("d-inline");
                }
            } else {
                priceSpan.innerText = basePrice.toLocaleString("en-IN");

                if (taxInfoBadges[i]) {
                    taxInfoBadges[i].classList.add("d-none");
                    taxInfoBadges[i].classList.remove("d-inline");
                }
            }
        }
    };

    // 1. 🔁 ON PAGE LOAD: Check if tax was previously turned on during this session
    let savedTaxState = sessionStorage.getItem("taxDisplayState");

    if (savedTaxState === "enabled") {
        taxSwitch.checked = true; // Visually flip the toggle back to ON
        updateTaxDisplay(true);   // Re-apply tax prices on the newly loaded listings
    }

    // 2. ⚡ ON TOGGLE CLICK: Update the storage state immediately
    taxSwitch.addEventListener("click", () => {
        let displaysTax = taxSwitch.checked;

        if (displaysTax) {
            sessionStorage.setItem("taxDisplayState", "enabled");
        } else {
            sessionStorage.setItem("taxDisplayState", "disabled");
        }

        updateTaxDisplay(displaysTax);
    });
}

// for showing selected category
document.addEventListener("DOMContentLoaded", () => {
    const categoryBtn = document.getElementById("categoryBtn");
    const hiddenInput = document.getElementById("selectedCategory");
    const dropdownItems = document.querySelectorAll(".category-item");

    if (categoryBtn && hiddenInput) {
        dropdownItems.forEach(item => {
            item.addEventListener("click", function (e) {
                e.preventDefault();

                // Set the text inside the toggle button and the value of your database form entry
                categoryBtn.innerHTML = this.innerHTML.trim();
                hiddenInput.value = this.getAttribute("data-value");

                // Dispatches standard change tracking for framework validations
                hiddenInput.dispatchEvent(new Event('change'));
            });
        });
    }
});

// for suggestions on search bar
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("navSearchInput");
    const suggestionsWrapper = document.getElementById("searchSuggestionsWrapper");
    const suggestionsInner = document.getElementById("suggestionsInnerScroll");

    if (searchInput && suggestionsWrapper && suggestionsInner) {

        searchInput.addEventListener("input", async function () {
            const query = this.value.trim();

            if (query.length < 2) {
                suggestionsInner.innerHTML = "";
                suggestionsWrapper.style.display = "none";
                return;
            }

            try {
                const response = await fetch(`/listings/suggestions?q=${encodeURIComponent(query)}`);
                const suggestions = await response.json();

                if (suggestions.length === 0) {
                    suggestionsInner.innerHTML = `<div class="dropdown-item text-muted small py-2 px-4">No results found...</div>`;
                } else {
                    suggestionsInner.innerHTML = suggestions.map(item => {
                        let icon = "fa-location-dot";
                        if (item.text.startsWith("Category:")) icon = "fa-layer-group";
                        if (item.text.startsWith("Host:")) icon = "fa-user";

                        // ✅ MODIFIED: Removed 'text-truncate' and wrapped item.text inside the scrollable span
                        return `
 <a href="#" class="dropdown-item suggestion-item fw-normal text-secondary py-2" 
       data-id="${item.id}" 
       data-text="${item.text}">
        <i class="fa-solid ${icon} me-2 text-muted small"></i>${item.text}
    </a>
`;
                    }).join("");
                }

                suggestionsWrapper.style.display = "block";

            } catch (err) {
                console.error("Suggestions API failed:", err);
            }
        });

        /* ==========================================================================
           UPDATED CLICK HANDLER WITH SMART CONDITION-BASED ROUTING
           ========================================================================== */
        suggestionsWrapper.addEventListener("click", function (e) {
            const clickedItem = e.target.closest(".suggestion-item");
            if (clickedItem) {
                e.preventDefault();

                const listingId = clickedItem.getAttribute("data-id");
                const rawText = clickedItem.getAttribute("data-text") || "";

                // 1. Check if the item clicked belongs to a Category grouping
                if (rawText.startsWith("Category:")) {
                    const categoryName = rawText.replace("Category:", "").trim();
                    window.location.href = `/listings?category=${encodeURIComponent(categoryName)}`;
                }

                // 2. Check if the item clicked belongs to an Owner/Host grouping
                else if (rawText.startsWith("Host:")) {
                    window.location.href = `/listings?owner=${encodeURIComponent(listingId)}`;
                }

                // 3. Fallback: Normal listing title match -> Route directly to individual show details profile
                else if (listingId) {
                    window.location.href = `/listings/${listingId}`;
                }

                // Final safety text query input submission
                else {
                    let cleanValue = clickedItem.innerText.trim();
                    if (cleanValue.includes(",")) cleanValue = cleanValue.split(",")[0].trim();
                    searchInput.value = cleanValue;
                    suggestionsWrapper.style.display = "none";
                    searchInput.closest("form").submit();
                }
            }
        });

        document.addEventListener("click", function (e) {
            if (e.target !== searchInput && e.target !== suggestionsWrapper && !suggestionsInner.contains(e.target)) {
                suggestionsWrapper.style.display = "none";
            }
        });
    }
});

