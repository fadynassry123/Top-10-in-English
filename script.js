document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const modeToggle = document.getElementById('mode-toggle');
    const body = document.body;
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const motivationalQuote = document.getElementById('motivational-quote');
    const quoteAuthor = document.getElementById('quote-author');

    // --- 1. Dark/Light Mode Toggle ---
    modeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
        modeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Load saved mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
        modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // --- 2. Sticky Navbar & Active Link Highlighting ---
    const options = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Highlight when the section hits the middle of the viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add 'active' to the link corresponding to the current section
                const targetId = entry.target.id;
                const activeLink = document.querySelector(`.nav-menu a[href="#${targetId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Sticky header
    window.addEventListener('scroll', () => {
        header.classList.toggle('sticky', window.scrollY > 0);
    });
    
    // --- 3. Mobile Navigation Toggle ---
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
            }
        });
    });

    // --- 4. Motivation of the Week Quote ---
    const quotes = [
        { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
        { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { quote: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" }
    ];

    // Select a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    motivationalQuote.textContent = `"${randomQuote.quote}"`;
    quoteAuthor.textContent = randomQuote.author;


    // --- 5. Contact Form Submission (Formspree) ---
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // --- ⚠️ IMPORTANT: Replace "YOUR_FORMSPREE_CODE" in index.html with your actual code. ---
        // This handles the form submission via AJAX.
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = 'Message sent successfully! I will contact you shortly.';
                formStatus.classList.remove('error');
                formStatus.classList.add('success', 'visible');
                form.reset();
            } else {
                formStatus.textContent = 'Oops! There was an error sending your message. Please try again or contact me on WhatsApp.';
                formStatus.classList.remove('success');
                formStatus.classList.add('error', 'visible');
            }
        } catch (error) {
            formStatus.textContent = 'Network error. Please check your connection or contact me on WhatsApp.';
            formStatus.classList.remove('success');
            formStatus.classList.add('error', 'visible');
        }

        setTimeout(() => {
            formStatus.classList.remove('visible');
        }, 8000); // Hide status after 8 seconds
    });
});