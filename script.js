/* =========================================
   MVA - Missionary Ventures Australia
   Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // Navbar Scroll Effect
    // =========================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // =========================================
    // Mobile Navigation
    // =========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // =========================================
    // Scroll Animations
    // =========================================
    const animateElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.dataset.delay) || 0;
                setTimeout(() => {
                    el.classList.add('animated');
                }, delay);
                animateObserver.unobserve(el);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => animateObserver.observe(el));

    // =========================================
    // Counter Animation
    // =========================================
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        el.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                };
                updateCounter();
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    // =========================================
    // Donation Amount Buttons
    // =========================================
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmount = document.getElementById('customAmount');

    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (customAmount) {
                customAmount.value = btn.dataset.amount;
            }
        });
    });

    // =========================================
    // Contact Form
    // =========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = '#28a745';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // =========================================
    // Smooth Scroll for Anchors
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // =========================================
    // Chatbot
    // =========================================
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatbotMessages');
    const chatSuggestions = document.getElementById('chatSuggestions');

    // Knowledge base for the chatbot
    const knowledge = {
        about: {
            keywords: ['about', 'who', 'what is', 'organisation', 'organization', 'mva', 'missionary ventures', 'history'],
            response: 'Missionary Ventures Australia (MVA) is an interdenominational Christian organisation and part of Missionary Ventures International, headquartered in Orlando, Florida, USA. We are a family of Christians bound together by our love for God and others, sharing the common goal of reaching the world with the love of Jesus Christ and the Gospel of the Kingdom. MVA focuses on equipping and supporting indigenous Churches and Christian organisations within the Asia/Pacific region.'
        },
        mission: {
            keywords: ['mission', 'purpose', 'goal', 'vision', 'values', 'core'],
            response: 'Our core mission is equipping people to impact others for Christ and developing sustainable partnerships that help mobilize Christian communities to make disciples who will see lives transformed across the Asia/Pacific region. Our values include: serving the Church, being motivated by love, maintaining absolute accountability, prioritizing God\'s Kingdom, and raising up national Christian leaders.'
        },
        trips: {
            keywords: ['trip', 'trips', 'mission trip', 'team trip', 'join', 'volunteer', 'go', 'travel', 'participate'],
            response: 'MVA offers mission team trips across the Asia Pacific region! Here are the key details:\n\n- Duration: 10-14 days (flexible, up to 3 months available)\n- Team Size: 5-12 people\n- Planning: Begin at least 6 months before departure\n- Who: Youth to older adults welcome\n- Destinations: Philippines, East Malaysia, Indonesia, Cambodia, Thailand, Fiji, and Vanuatu\n- Includes: Airfares, transport, food, accommodation, visas, insurance, and comprehensive team training\n\nTo enquire, contact us at office@mvaustralia.org or call 0492 983 607.'
        },
        donate: {
            keywords: ['donate', 'donation', 'give', 'giving', 'money', 'financial', 'support', 'fund', 'contribute'],
            response: 'Thank you for your interest in donating! You can make a lasting impact through:\n\n- Online: Visit our Donate page with options of $20, $50, $100, $500 or custom amounts\n- Bank Transfer: Missionary Ventures Australia, BSB: 063812, A/C: 10028994 (SWIFT: CTBAAU2SXXX)\n- Monthly recurring donations available\n\nYou can designate your gift to: MVA General Fund, Thailand Flood Relief, Myanmar Earthquake Relief, Timor Water, or other projects. MVA is an ACNC Registered Charity.'
        },
        countries: {
            keywords: ['countries', 'country', 'where', 'work', 'region', 'asia', 'pacific', 'location'],
            response: 'MVA works across 9 countries in the Asia-Pacific region:\n\n1. Cambodia - Ps Plang Samreth\n2. Fiji - National Partners\n3. Indonesia - Ps Ledianus Gulu\n4. Laos - National Partners\n5. Malaysia - Ps Gedion Lamangis\n6. Myanmar - National Partners\n7. Thailand - Ps Supol Phaengtan\n8. Timor Leste - Ps Artama Vakalalabure\n9. Vanuatu - National Partners\n\nWe partner with dynamic national leaders who have strong relationships with local churches and Christian organisations.'
        },
        contact: {
            keywords: ['contact', 'phone', 'email', 'address', 'reach', 'call', 'office', 'hours'],
            response: 'You can reach us at:\n\n- Phone: 0492 983 607\n- Email: office@mvaustralia.org\n- Address: PO Box 396, Ocean Grove, Victoria 3226, Australia\n- Office Hours: Tuesday to Friday, 9am - 4pm\n\nYou can also fill out the contact form on our website and we\'ll get back to you!'
        },
        relief: {
            keywords: ['relief', 'flood', 'thailand', 'emergency', 'disaster', 'myanmar', 'earthquake', 'help', 'urgent'],
            response: 'We currently have urgent appeals:\n\n- Thailand Flood Relief: Communities in Southern Thailand need support following devastating floods. Please mark donations "THAILAND".\n- Myanmar Earthquake Relief: Supporting communities affected by the earthquake.\n\nTo donate, use bank transfer to: Missionary Ventures Australia, BSB: 063812, A/C: 10028994. Or donate online through our Donate page.'
        },
        team: {
            keywords: ['team', 'staff', 'people', 'leader', 'leadership', 'board', 'director', 'who runs'],
            response: 'Our team includes:\n\nLeadership:\n- Lynda Serpell (MVA General Manager)\n- April Riggins (Website Manager)\n\nBoard Members:\n- Phil Plowman (Chairman)\n- Stefanos Irwanto\n- Lynda Serpell\n- John F. Williams\n\nMV ASEAN Directors:\n- Phil Plowman (Director, Melbourne)\n- Chan Weng Seng (Deputy Director, KL, Malaysia)\n- Eng Kor Ooi & Chee Suan Bee (Associate Directors, Langkawi, Malaysia)'
        },
        worldwide: {
            keywords: ['worldwide', 'global', 'international', 'other countries', 'offices', 'usa', 'america', 'uk', 'new zealand', 'south africa'],
            response: 'Missionary Ventures operates globally through affiliated entities:\n\n- MV United States (Headquarters) - mvi.org\n- MV Australia - mvaustralia.org\n- MV New Zealand - motivate.nz\n- MV South Africa - mvsouthafrica.org\n- MV United Kingdom - mvgb.org.uk\n\nAll offices share the common mission of reaching the world with the Gospel of Jesus Christ.'
        },
        involved: {
            keywords: ['involved', 'get involved', 'help', 'serve', 'partner', 'partnership', 'how can i'],
            response: 'There are several ways to get involved with MVA:\n\n1. Join a Mission Trip - Experience hands-on mission work (10-14 day trips available)\n2. Donate - Support our core mission or specific projects financially\n3. Pray - Partner with us in prayer for the work across Asia-Pacific\n4. Volunteer - Help with administration, communications, or events\n5. Church Partnership - Connect your church with our mission programs\n\nContact us at office@mvaustralia.org to learn more!'
        }
    };

    function findResponse(message) {
        const lower = message.toLowerCase();
        let bestMatch = null;
        let bestScore = 0;

        for (const [key, data] of Object.entries(knowledge)) {
            let score = 0;
            for (const keyword of data.keywords) {
                if (lower.includes(keyword)) {
                    score += keyword.length;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestMatch = data.response;
            }
        }

        if (bestScore > 0) return bestMatch;

        // Default responses
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'g\'day'];
        if (greetings.some(g => lower.includes(g))) {
            return 'Hello! Welcome to Missionary Ventures Australia. I can help you learn about our mission, team trips, donation options, where we work, our team, or how to get involved. What would you like to know?';
        }

        const thanks = ['thank', 'thanks', 'cheers', 'appreciate'];
        if (thanks.some(t => lower.includes(t))) {
            return 'You\'re welcome! If you have any other questions about MVA, feel free to ask. God bless!';
        }

        return 'Thanks for your question! I can help with information about:\n\n- About MVA\n- Our mission and values\n- Mission team trips\n- How to donate\n- Countries we work in\n- Our team\n- Contact details\n- Current relief efforts\n- How to get involved\n\nTry asking about any of these topics, or contact us directly at office@mvaustralia.org for more specific enquiries.';
    }

    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';

        // Format text: convert \n to <br> and simple markdown-like lists
        const formatted = text
            .split('\n')
            .map(line => {
                line = line.trim();
                if (!line) return '';
                // Numbered list items
                if (/^\d+\.\s/.test(line)) {
                    return '<div class="chat-list-item">' + line + '</div>';
                }
                // Bullet list items (- prefix)
                if (line.startsWith('- ')) {
                    return '<div class="chat-list-item chat-bullet">' + line.substring(2) + '</div>';
                }
                // Bold text between **
                line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return '<p>' + line + '</p>';
            })
            .filter(l => l)
            .join('');

        bubble.innerHTML = formatted || text.replace(/\n/g, '<br>');

        msgDiv.appendChild(bubble);
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleChat() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        chatInput.value = '';

        // Hide suggestions after first message
        if (chatSuggestions) {
            chatSuggestions.style.display = 'none';
        }

        // Typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot';
        typingDiv.innerHTML = '<div class="chat-bubble" style="opacity:0.6">Typing...</div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            chatMessages.removeChild(typingDiv);
            const response = findResponse(message);
            addMessage(response);
        }, 600 + Math.random() * 400);
    }

    // Chatbot toggle
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('open');
    });
    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('open');
    });

    // Send message
    chatSend.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // Quick suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.dataset.query;
            const messages = {
                about: 'Tell me about MVA',
                trips: 'How can I join a mission trip?',
                donate: 'How can I donate?',
                countries: 'Where does MVA work?',
                contact: 'How do I contact MVA?',
                relief: 'Tell me about the Thailand relief effort'
            };
            chatInput.value = messages[query] || query;
            handleChat();
        });
    });

    // =========================================
    // Parallax Effect
    // =========================================
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        document.querySelectorAll('.parallax-bg').forEach(bg => {
            const parent = bg.closest('section, .mission-bg, .impact-bg, .donate-bg');
            if (parent) {
                const rect = parent.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const speed = 0.3;
                    bg.style.transform = `translateY(${rect.top * speed}px)`;
                }
            }
        });
    }, { passive: true });
});
