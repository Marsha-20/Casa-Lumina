document.addEventListener('DOMContentLoaded', function () {

    // Search Bar Functionality
    const searchInput = document.querySelector('.search-input');
    const listings = document.querySelectorAll('.listing');
    
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchQuery = searchInput.value.toLowerCase();
            
            listings.forEach(function (listing) {
                const title = listing.querySelector('h3').textContent.toLowerCase();
                const description = listing.querySelector('p').textContent.toLowerCase();
                
                listing.style.display = (title.includes(searchQuery) || description.includes(searchQuery)) ? 'block' : 'none';
            });
        });
    }

    // Smooth Scrolling Navigation (Consolidated)
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            window.scrollTo({
                top: targetElement.offsetTop - 100, 
                behavior: 'smooth'
            });
        });
    });
    
    // Dynamic Property Listings
    const properties = [
        { title: 'Property 1', image: 'property1.jpg', details: 'Details about property 1', link: 'property-details.html' },
        { title: 'Property 2', image: 'property2.jpg', details: 'Details about property 2', link: 'property-details.html' },
    ];

    function renderProperties(properties) {
        const listingsContainer = document.querySelector('.listing-grid');
        listingsContainer.innerHTML = ''; // Clear existing listings

        properties.forEach(property => {
            const listing = document.createElement('div');
            listing.classList.add('listing');
            listing.innerHTML = `
                <img src="${property.image}" alt="${property.title}">
                <h3>${property.title}</h3>
                <p>${property.details}</p>
                <a href="${property.link}" class="details">View Details</a>
            `;
            listingsContainer.appendChild(listing);
        });
    }
    renderProperties(properties);

    // Form Validation for Contact Form
    document.querySelector('form')?.addEventListener('submit', function (e) {
        const name = document.querySelector('#name');
        const email = document.querySelector('#email');
        const message = document.querySelector('#message');
        
        if (!name?.value || !email?.value || !message?.value) {
            e.preventDefault();
            alert('Please fill out all fields');
        } else if (!validateEmail(email.value)) {
            e.preventDefault();
            alert('Please enter a valid email address');
        }
    });

    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    // Dark Mode Toggle
    const darkModeButton = document.querySelector('#dark-mode-button');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', function () {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
    }

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Toggle Navigation Menu for Mobile View
    function toggleMenu() {
        const nav = document.getElementById("navbar");
        if (nav) {
            nav.style.display = (nav.style.display === "block" ? "none" : "block");
        }
    }

    // Show/Hide Elements Based on Scroll
    window.addEventListener("scroll", function() {
        const section = document.getElementById("scrollSection");
        if (section) {
            const position = section.getBoundingClientRect();
            section.style.opacity = position.top < window.innerHeight && position.bottom >= 0 ? 1 : 0;
        }

        // Toggle "Back to Top" Button
        const button = document.getElementById('backToTop');
        if (button) {
            button.style.display = (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) ? "block" : "none";
        }
    });

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Image Carousel (Hero Section)
    let currentIndex = 0;
    const slides = document.querySelectorAll(".carousel-slide");

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = (i === index) ? "block" : "none";
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    setInterval(nextSlide, 3000); // Change slide every 3 seconds
    showSlide(currentIndex);

    // Load More Properties (Dynamic Content)
    let listingsCount = 2; // Initial number of listings
    const totalListings = 10; // Total listings available (simulated)

    document.getElementById("load-more-button")?.addEventListener("click", function () {
        const listingsContainer = document.querySelector(".listing-grid");
        for (let i = listingsCount + 1; i <= Math.min(listingsCount + 2, totalListings); i++) {
            const newListing = document.createElement("div");
            newListing.classList.add("listing");
            newListing.innerHTML = `
                <img src="property-placeholder.jpg" alt="Property Image">
                <h3>Property Title ${i}</h3>
                <form action="submit_property_details.php" method="post">
                    <label for="property-title-${i}">Title:</label>
                    <input type="text" id="property-title-${i}" name="property-title-${i}" required>
                    <label for="property-details-${i}">Details:</label>
                    <textarea id="property-details-${i}" name="property-details-${i}" rows="4" required></textarea>
                    <label for="property-image-${i}">Image URL:</label>
                    <input type="text" id="property-image-${i}" name="property-image-${i}" required>
                    <button type="submit" class="save-button">Save</button>
                </form>
            `;
            listingsContainer.appendChild(newListing);
        }
        listingsCount += 2;
        if (listingsCount >= totalListings) {
            document.getElementById("load-more-button").style.display = "none";
        }
    });

    // Submit Property Form via AJAX
    document.getElementById("propertyForm")?.addEventListener("submit", function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const images = document.getElementById("images").files;

        if (!images.length) {
            alert("Please upload at least one image.");
            return;
        }

        Array.from(images).forEach(image => formData.append("images", image));

        fetch("/submit-property/", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
            }
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes('successfully')) {
                alert("Property submitted successfully!");
                document.getElementById("propertyForm").reset();
                const successMessage = document.createElement('div');
                successMessage.innerHTML = `
                    <p>Your property was submitted successfully!</p>
                    <button onclick="window.location.href='/services';" class="back-to-services">
                        Back to Services
                    </button>
                `;
                document.body.appendChild(successMessage);
            } else {
                alert("There was an error submitting your property.");
            }
        })
        .catch(error => {
            alert("An error occurred. Please try again later.");
            console.error("Error:", error);
        });
    });

});
