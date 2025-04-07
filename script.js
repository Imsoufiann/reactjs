// Loading Animation
window.addEventListener('load', () => {
    // Smooth transition for loader
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
        }, 500);
    }, 1500);
    
    // Initialize animations after page load
    initializeAnimations();
});

// Custom Cursor with enhanced interactivity
function initializeCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const links = document.querySelectorAll('a, button, .social-links a, .theme-toggle label, .skill-category, .timeline-content, .education-card, .certification-card');
    
    // Optimization: Use a single event listener with throttling
    let cursorX = 0;
    let cursorY = 0;
    let ticking = false;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                cursorDot.style.opacity = '1';
                cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
    
    document.addEventListener('mouseout', () => {
        cursorDot.style.opacity = '0';
    });
    
    // Enhanced hover effects for different elements
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1.5)`;
            cursorDot.style.mixBlendMode = 'difference';
            
            // Add element-specific cursor effects
            if (link.classList.contains('skill-category')) {
                cursorDot.style.borderRadius = '8px';
            } else if (link.classList.contains('timeline-content')) {
                cursorDot.style.borderRadius = '5px';
                cursorDot.style.opacity = '0.8';
            } else {
                cursorDot.style.borderRadius = '50%';
            }
        });
        
        link.addEventListener('mouseleave', () => {
            cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
            cursorDot.style.mixBlendMode = 'normal';
            cursorDot.style.borderRadius = '50%';
            cursorDot.style.opacity = '1';
        });
    });
}

// Improved Theme Toggle with smooth transitions
function initializeThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    const htmlElement = document.documentElement;
    
    // Add custom transition class
    function toggleThemeWithTransition(theme) {
        document.body.classList.add('theme-transition');
        
        if (theme === 'light') {
            htmlElement.setAttribute('data-theme', 'light');
            themeSwitch.checked = true;
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            themeSwitch.checked = false;
        }
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 1000);
    }
    
    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            toggleThemeWithTransition('light');
            localStorage.setItem('theme', 'light');
        } else {
            toggleThemeWithTransition('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        toggleThemeWithTransition(savedTheme);
    } else {
        // Check user's system preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        toggleThemeWithTransition(prefersDarkScheme ? 'dark' : 'light');
    }
}

// Enhanced Smooth Scrolling and Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.side-nav a');
    const sections = document.querySelectorAll('.section');
    const navIndicator = document.querySelector('.nav-indicator');
    
    // Helper function for smooth scrolling
    function smoothScrollTo(target, duration) {
        const targetPosition = target.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = progress => --progress * progress * progress + 1; // Cubic easing out
            
            window.scrollTo(0, startPosition + distance * ease(progress));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active class
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Update indicator position with animation
            if (window.innerWidth > 768) {
                const linkPosition = link.getBoundingClientRect();
                navIndicator.style.opacity = '1';
                navIndicator.style.transform = `translateY(${linkPosition.top - navIndicator.parentElement.getBoundingClientRect().top}px)`;
            }
            
            // Hide all sections with fade out effect
            sections.forEach(section => {
                if (section.classList.contains('active')) {
                    section.classList.add('fade-out');
                    setTimeout(() => {
                        section.classList.remove('active');
                        section.classList.remove('fade-out');
                    }, 300);
                } else {
                    section.classList.remove('active');
                }
            });
            
            // Show target section with a slight delay for better transition
            const targetSection = document.querySelector(link.getAttribute('href'));
            setTimeout(() => {
                targetSection.classList.add('active');
                targetSection.classList.add('fade-in');
                
                // Remove fade-in class after animation completes
                setTimeout(() => {
                    targetSection.classList.remove('fade-in');
                }, 500);
                
                // Animate section elements
                animateSectionElements(targetSection);
            }, 400);
            
            // Smooth scroll only on mobile
            if (window.innerWidth <= 768) {
                smoothScrollTo(targetSection, 800);
            }
        });
    });
    
    // Improved initial active state with animations
    function setInitialActiveState() {
        const scrollPosition = window.scrollY;
        let activeSection = sections[0];
        
        if (window.innerWidth <= 768) {
            sections.forEach(section => {
                if (section.offsetTop <= scrollPosition + 200) {
                    activeSection = section;
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const sectionId = link.getAttribute('href');
                if (sectionId === `#${activeSection.id}`) {
                    link.classList.add('active');
                }
            });
        } else {
            // Default to first section for desktop with animation
            navLinks[0].classList.add('active');
            sections[0].classList.add('active');
            sections[0].classList.add('fade-in');
            
            setTimeout(() => {
                sections[0].classList.remove('fade-in');
            }, 500);
            
            // Set initial indicator position with animation
            const activeLinkPosition = navLinks[0].getBoundingClientRect();
            navIndicator.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
            setTimeout(() => {
                navIndicator.style.opacity = '1';
                navIndicator.style.transform = `translateY(${activeLinkPosition.top - navIndicator.parentElement.getBoundingClientRect().top}px)`;
            }, 500);
            
            animateSectionElements(sections[0]);
        }
    }
    
    setInitialActiveState();
}

// Enhanced Typing Animation with multi-text rotation
function initializeTypingAnimation() {
    const typingElement = document.querySelector('.typing');
    const texts = [
        "Specialist in network and cloud computing infrastructure.",
        "Expert in IT support and technical troubleshooting.",
        "Passionate about technology and problem-solving."
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Deleting text
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Delete faster
        } else {
            // Typing text
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Type at normal speed
        }
        
        // If word is completed
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at the end of a phrase
        } 
        // If deletion is completed
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length; // Loop through texts
            typingSpeed = 500; // Pause before typing next text
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing animation
    setTimeout(() => {
        typingElement.textContent = '';
        typeEffect();
    }, 1000);
}

// Enhanced Particle.js Background with interactive elements
function initializeParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#5d5dff'
            },
            shape: {
                type: ['circle', 'triangle', 'polygon'],
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 6
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#5d5dff',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// Enhanced Skill Bars Animation with staggered effect
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width') + '%';
            bar.style.width = width;
            
            // Add pulsing effect after animation completes
            setTimeout(() => {
                bar.classList.add('pulse');
            }, 1500);
        }, index * 100); // Staggered animation
    });
}

// Enhanced Terminal Interface
function initializeTerminalCursor() {
    const terminalCursor = document.querySelector('.cursor');
    const terminalCommands = [
        { prompt: "soufiane@mikdam:~$", command: "whoami" },
        { prompt: "soufiane@mikdam:~$", command: "cat skills.txt" },
        { prompt: "soufiane@mikdam:~$", command: "location" },
        { prompt: "soufiane@mikdam:~$", command: "python -c 'print(\"Hello, visitor!\")'", output: "Hello, visitor! Welcome to my portfolio." },
        { prompt: "soufiane@mikdam:~$", command: "_" }
    ];
    const terminalBody = document.querySelector('.terminal-body');
    
    if (terminalCursor) {
        setInterval(() => {
            terminalCursor.style.opacity = terminalCursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
    
    // Make terminal interactive
    terminalBody.addEventListener('click', () => {
        const currentCommands = terminalBody.querySelectorAll('.cmd-line');
        const lastCommand = currentCommands[currentCommands.length - 1];
        
        // If the last command has the cursor, simulate typing a new command
        if (lastCommand && lastCommand.querySelector('.cursor')) {
            const randomCommandIndex = Math.floor(Math.random() * (terminalCommands.length - 1)); // Exclude the last one with cursor
            const newCommand = terminalCommands[randomCommandIndex];
            
            // Remove cursor from last command
            lastCommand.innerHTML = `<span class="prompt">${lastCommand.querySelector('.prompt').textContent}</span><span class="command">ls -la</span>`;
            
            // Add output for previous command (simulating 'ls -la')
            const lsOutput = document.createElement('div');
            lsOutput.className = 'cmd-output';
            lsOutput.textContent = "total 16K\ndrwxr-xr-x 2 soufiane users 4.0K Apr 7 10:23 .\ndrwxr-xr-x 6 soufiane users 4.0K Apr 7 09:45 ..\n-rw-r--r-- 1 soufiane users  220 Apr 7 09:45 .bash_profile\n-rw-r--r-- 1 soufiane users  240 Apr 7 09:45 skills.txt";
            terminalBody.insertBefore(lsOutput, terminalBody.lastElementChild.nextSibling);
            
            // Add new command line
            const newCommandLine = document.createElement('div');
            newCommandLine.className = 'cmd-line';
            newCommandLine.innerHTML = `<span class="prompt">${newCommand.prompt}</span><span class="command">${newCommand.command}</span>`;
            terminalBody.appendChild(newCommandLine);
            
            // Add output for new command if it exists
            if (newCommand.output) {
                const newOutput = document.createElement('div');
                newOutput.className = 'cmd-output';
                newOutput.textContent = newCommand.output;
                terminalBody.appendChild(newOutput);
            }
            
            // Add final command line with cursor
            const finalCommandLine = document.createElement('div');
            finalCommandLine.className = 'cmd-line';
            finalCommandLine.innerHTML = `<span class="prompt">soufiane@mikdam:~$</span><span class="command">_</span><span class="cursor"></span>`;
            terminalBody.appendChild(finalCommandLine);
            
            // Reset terminal cursor blinking
            initializeTerminalCursor();
            
            // Scroll to bottom of terminal
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}

// Enhanced animation for section elements with staggered timing
function animateSectionElements(section) {
    // Reset animation for skill bars if skills section
    if (section.id === 'skills') {
        const skillBars = section.querySelectorAll('.skill-progress-bar');
        const skillCategories = section.querySelectorAll('.skill-category');
        
        // Reset skill bars
        skillBars.forEach(bar => {
            bar.style.width = '0';
            bar.classList.remove('pulse');
        });
        
        // Animate skill categories with staggered entrance
        skillCategories.forEach((category, index) => {
            category.style.opacity = '0';
            category.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                category.style.opacity = '1';
                category.style.transform = 'translateY(0)';
            }, 200 + (index * 150));
        });
        
        // Delay skill bars animation
        setTimeout(() => {
            animateSkillBars();
        }, 800);
    }
    
    // Enhanced timeline items animation
    if (section.id === 'experience') {
        const timelineItems = section.querySelectorAll('.timeline-item');
        
        // Enhance timeline line with growing animation
        const timeline = section.querySelector('.timeline');
        const timelineLine = document.createElement('div');
        timelineLine.className = 'timeline-line-animated';
        timeline.appendChild(timelineLine);
        
        setTimeout(() => {
            timelineLine.style.height = '100%';
        }, 300);
        
        // Animate timeline items with cascade effect
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 500 + (index * 300));
        });
    }
    
    // Enhanced education cards animation
    if (section.id === 'education') {
        const educationCards = section.querySelectorAll('.education-card');
        
        educationCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) rotateX(10deg)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) rotateX(0)';
                
                // Add a slight hover animation after the card appears
                setTimeout(() => {
                    card.style.transform = 'translateY(-5px)';
                    setTimeout(() => {
                        card.style.transform = 'translateY(0)';
                    }, 200);
                }, 700);
            }, 400 + (index * 300));
        });
    }
    
    // Enhanced certification cards animation
    if (section.id === 'certifications') {
        const certCards = section.querySelectorAll('.certification-card');
        
        certCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8) translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.opacity = '1';
                card.style.transform = 'scale(1) translateY(0)';
            }, 300 + (index * 250));
            
            // Animate the certification icon with a spin
            const icon = card.querySelector('.certification-icon i');
            icon.style.opacity = '0';
            icon.style.transform = 'rotate(-45deg)';
            
            setTimeout(() => {
                icon.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                icon.style.opacity = '1';
                icon.style.transform = 'rotate(0)';
            }, 700 + (index * 250));
        });
    }
    
    // Enhanced about section animation
    if (section.id === 'about') {
        const profilePic = section.querySelector('.profile-pic');
        const aboutInfo = section.querySelector('.about-info');
        const socialLinks = section.querySelector('.social-links');
        
        // Profile picture animation
        if (profilePic) {
            profilePic.style.opacity = '0';
            profilePic.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                profilePic.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                profilePic.style.opacity = '1';
                profilePic.style.transform = 'translateX(0)';
            }, 300);
        }
        
        // About info paragraphs animation
        if (aboutInfo) {
            const paragraphs = aboutInfo.querySelectorAll('p');
            paragraphs.forEach((paragraph, index) => {
                paragraph.style.opacity = '0';
                paragraph.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    paragraph.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    paragraph.style.opacity = '1';
                    paragraph.style.transform = 'translateY(0)';
                }, 600 + (index * 200));
            });
        }
        
        // Terminal animation
        const terminal = section.querySelector('.terminal');
        if (terminal) {
            terminal.style.opacity = '0';
            terminal.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                terminal.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                terminal.style.opacity = '1';
                terminal.style.transform = 'translateY(0)';
            }, 1000);
        }
        
        // Social links animation
        if (socialLinks) {
            const links = socialLinks.querySelectorAll('a');
            links.forEach((link, index) => {
                link.style.opacity = '0';
                link.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                }, 1500 + (index * 150));
            });
        }
    }
    
    // Add floating animation for home section
    if (section.id === 'home') {
        const nameText = section.querySelector('.name-text');
        if (nameText) {
            nameText.classList.add('floating-animation');
        }
    }
}

// Mobile Navigation with improved scroll tracking
function initializeMobileNavigation() {
    if (window.innerWidth <= 768) {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.side-nav a');
        
        sections.forEach(section => {
            section.classList.add('active');
        });
        
        // Optimized scroll handler with throttling
        let isScrolling = false;
        
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const scrollPosition = window.scrollY + (window.innerHeight / 3);
                    
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.offsetHeight;
                        
                        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                            navLinks.forEach(link => {
                                link.classList.remove('active');
                                if (link.getAttribute('href') === `#${section.id}`) {
                                    link.classList.add('active');
                                }
                            });
                        }
                    });
                    
                    isScrolling = false;
                });
                
                isScrolling = true;
            }
        });
    }
}

// Dynamic background effects
function initializeDynamicBackground() {
    // Create random digital glitch effects
    const glitchContainer = document.createElement('div');
    glitchContainer.className = 'glitch-container';
    document.body.appendChild(glitchContainer);
    
    function createGlitchElement() {
        if (document.documentElement.getAttribute('data-theme') === 'light') {
            return; // Don't show glitches in light mode
        }
        
        const glitch = document.createElement('div');
        glitch.className = 'glitch-element';
        
        // Random positioning
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        glitch.style.left = `${posX}%`;
        glitch.style.top = `${posY}%`;
        
        // Random size
        const width = 50 + Math.random() * 150;
        const height = 2 + Math.random() * 5;
        glitch.style.width = `${width}px`;
        glitch.style.height = `${height}px`;
        
        // Random color
        const hue = 230 + Math.random() * 30; // Blue-violet range
        const saturation = 70 + Math.random() * 30;
        const lightness = 50 + Math.random() * 20;
        glitch.style.backgroundColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`;
        
        // Add to container
        glitchContainer.appendChild(glitch);
        
        // Remove after animation
        setTimeout(() => {
            glitch.remove();
        }, 700);
    }
    
    // Create glitches periodically
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance to create a glitch
            createGlitchElement();
        }
    }, 3000);
}

// Initialize parallax effects
function initializeParallaxEffects() {
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Apply parallax to name text in home section
        const nameText = document.querySelector('.name-text');
        if (nameText) {
            nameText.style.transform = `translate(${mouseX * 20 - 10}px, ${mouseY * 20 - 10}px)`;
        }
        
        // Apply subtle parallax to particles
        const particles = document.getElementById('particles-js');
        if (particles) {
            particles.style.transform = `translate(${mouseX * 10 - 5}px, ${mouseY * 10 - 5}px)`;
        }
    });
}

// Initialize audio feedback (subtle)
function initializeAudioFeedback() {
    // Create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
    // Create audio elements for different interactions
    function createClickSound() {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }
    
    // Add click sound to navigation items
    const navLinks = document.querySelectorAll('.side-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            createClickSound();
        });
    });
    
    // Add sound to theme toggle
    const themeToggle = document.querySelector('.theme-toggle label');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            createClickSound();
        });
    }
}

// Add 3D tilt effect to cards
function initialize3DCardEffects() {
    const cards = document.querySelectorAll('.skill-category, .timeline-content, .education-card, .certification-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            // Calculate rotation angles (limited to small values)
            const rotateY = mouseX * 0.02;
            const rotateX = -mouseY * 0.02;
            
            // Apply the 3D rotation and add a subtle shadow
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.boxShadow = `0 10px 30px rgba(93, 93, 255, 0.2), 
                                   ${-rotateY/2}px ${-rotateX/2}px 20px rgba(93, 93, 255, 0.1)`;
            
            // Animate card content for enhanced depth effect
            const cardContent = card.querySelector('h3, .skill-header, .timeline-content h3, .certification-icon');
            if (cardContent) {
                cardContent.style.transform = `translateZ(20px)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transforms and shadows on mouse leave
            card.style.transform = '';
            card.style.boxShadow = '';
            
            const cardContent = card.querySelector('h3, .skill-header, .timeline-content h3, .certification-icon');
            if (cardContent) {
                cardContent.style.transform = '';
            }
        });
    });
}

// Add interactive skill level visualization
function initializeInteractiveSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const skillName = item.querySelector('.skill-info span:first-child').textContent;
        const skillLevel = parseInt(item.querySelector('.skill-info span:last-child').textContent);
        const progressBar = item.querySelector('.skill-progress-bar');
        
        // Add click event to show detailed skill info
        item.addEventListener('click', () => {
            // Create or find skill detail element
            let skillDetail = item.querySelector('.skill-detail');
            
            if (!skillDetail) {
                skillDetail = document.createElement('div');
                skillDetail.className = 'skill-detail';
                
                // Create skill visualization based on level
                let visualization = '';
                const blocks = Math.round(skillLevel / 10); // 10% per block
                
                for (let i = 0; i < 10; i++) {
                    if (i < blocks) {
                        visualization += '<span class="skill-block active"></span>';
                    } else {
                        visualization += '<span class="skill-block"></span>';
                    }
                }
                
                // Add description based on skill level
                let description = '';
                if (skillLevel >= 90) {
                    description = `Expert level proficiency with ${skillName}`;
                } else if (skillLevel >= 75) {
                    description = `Advanced knowledge and experience with ${skillName}`;
                } else if (skillLevel >= 60) {
                    description = `Solid working knowledge of ${skillName}`;
                } else {
                    description = `Fundamental understanding of ${skillName}`;
                }
                
                skillDetail.innerHTML = `
                    <div class="skill-visualization">${visualization}</div>
                    <p class="skill-description">${description}</p>
                `;
                
                item.appendChild(skillDetail);
                
                // Animate skill detail entrance
                setTimeout(() => {
                    skillDetail.style.maxHeight = '200px';
                    skillDetail.style.opacity = '1';
                }, 50);
            } else {
                // Toggle existing skill detail
                if (skillDetail.style.maxHeight !== '0px') {
                    skillDetail.style.maxHeight = '0px';
                    skillDetail.style.opacity = '0';
                    
                    // Remove after animation
                    setTimeout(() => {
                        skillDetail.remove();
                    }, 300);
                } else {
                    skillDetail.style.maxHeight = '200px';
                    skillDetail.style.opacity = '1';
                }
            }
        });
    });
}

// Easter egg interactive elements
function initializeEasterEggs() {
    // Konami code easter egg (up, up, down, down, left, right, left, right, b, a)
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        // Check if the key matches the current expected key in the sequence
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            // If the full sequence is entered
            if (konamiIndex === konamiCode.length) {
                activateMatrixMode();
                konamiIndex = 0; // Reset for next time
            }
        } else {
            konamiIndex = 0; // Reset if wrong key
        }
    });
    
    // Matrix mode easter egg
    function activateMatrixMode() {
        // Create matrix background
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'matrix-container';
        document.body.appendChild(matrixContainer);
        
        // Create falling characters
        for (let i = 0; i < 100; i++) {
            createMatrixColumn(matrixContainer);
        }
        
        // Show message
        const message = document.createElement('div');
        message.className = 'matrix-message';
        message.textContent = 'MATRIX MODE ACTIVATED';
        document.body.appendChild(message);
        
        // Deactivate after a few seconds
        setTimeout(() => {
            matrixContainer.style.opacity = '0';
            message.style.opacity = '0';
            
            setTimeout(() => {
                matrixContainer.remove();
                message.remove();
            }, 1000);
        }, 5000);
    }
    
    function createMatrixColumn(container) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = `${Math.random() * 100}%`;
        column.style.animationDuration = `${3 + Math.random() * 5}s`;
        
        const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        const length = 10 + Math.floor(Math.random() * 15);
        
        for (let i = 0; i < length; i++) {
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
            char.style.animationDelay = `${Math.random() * 2}s`;
            column.appendChild(char);
        }
        
        container.appendChild(column);
    }
    
    // Hidden terminal command easter egg
    let typedCommand = '';
    
    document.addEventListener('keypress', (e) => {
        // Check if not in an input field
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            typedCommand += e.key;
            
            // Check for specific commands
            if (typedCommand.includes('hacker')) {
                activateHackerMode();
                typedCommand = '';
            } else if (typedCommand.length > 20) {
                // Reset if command gets too long
                typedCommand = '';
            }
        }
    });
    
    function activateHackerMode() {
        // Add hacker-themed effects
        document.body.classList.add('hacker-mode');
        
        // Create typing animation
        const hackDisplay = document.createElement('div');
        hackDisplay.className = 'hack-display';
        document.body.appendChild(hackDisplay);
        
        const hackMessages = [
            'Initializing hack sequence...',
            'Bypassing security protocols...',
            'Accessing mainframe...',
            'Downloading classified files...',
            'Covering tracks...',
            'Hack complete!'
        ];
        
        let messageIndex = 0;
        
        function typeHackMessage() {
            if (messageIndex < hackMessages.length) {
                const message = hackMessages[messageIndex];
                hackDisplay.textContent = '';
                
                let charIndex = 0;
                const typingInterval = setInterval(() => {
                    if (charIndex < message.length) {
                        hackDisplay.textContent += message.charAt(charIndex);
                        charIndex++;
                    } else {
                        clearInterval(typingInterval);
                        messageIndex++;
                        
                        setTimeout(() => {
                            typeHackMessage();
                        }, 800);
                    }
                }, 50);
            } else {
                // End hack mode
                setTimeout(() => {
                    hackDisplay.style.opacity = '0';
                    
                    setTimeout(() => {
                        document.body.classList.remove('hacker-mode');
                        hackDisplay.remove();
                    }, 500);
                }, 1000);
            }
        }
        
        typeHackMessage();
    }
}

// Add animation to portfolio logo/name
function animatePortfolioName() {
    const nameText = document.querySelector('.name-text');
    if (!nameText) return;
    
    // Create glow effect that follows mouse
    nameText.addEventListener('mousemove', (e) => {
        const rect = nameText.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Update CSS variable for glow position
        nameText.style.setProperty('--glow-x', `${mouseX}px`);
        nameText.style.setProperty('--glow-y', `${mouseY}px`);
        nameText.classList.add('name-glow');
    });
    
    nameText.addEventListener('mouseleave', () => {
        nameText.classList.remove('name-glow');
    });
}

// Initialize All Animations with Improved Performance
function initializeAnimations() {
    // Core functionality (always initialize)
    initializeThemeToggle();
    initializeNavigation();
    initializeTypingAnimation();
    
    // Create a performance flag based on device capability
    const isHighPerformanceDevice = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    // Initialize based on device capability
    if (isHighPerformanceDevice) {
        // Full experience for high-performance devices
        initializeCustomCursor();
        initializeParticles();
        initializeTerminalCursor();
        initializeDynamicBackground();
        initializeParallaxEffects();
        initialize3DCardEffects();
        initializeInteractiveSkills();
        initializeEasterEggs();
        initializeAudioFeedback();
        animatePortfolioName();
    } else {
        // Reduced features for lower-performance devices
        console.log("Detected lower-performance device, optimizing animations");
        // Still initialize particles but with reduced count
        particlesJS('particles-js', {
            particles: {
                number: { value: 30 }, // Reduced particle count
                // Other settings simplified/reduced...
            }
        });
        
        // Still initialize terminal cursor but skip other intensive effects
        initializeTerminalCursor();
    }
    
    // Always initialize mobile navigation for responsive support
    initializeMobileNavigation();
    
    // Initialize first section animations
    const firstSection = document.querySelector('.section.active');
    if (firstSection) {
        animateSectionElements(firstSection);
    }
}

// Call initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // This ensures that all elements are loaded before initialization
    if (document.readyState === 'complete') {
        initializeAnimations();
    }
});

// Add resize handler to adapt to window size changes
window.addEventListener('resize', () => {
    // Delay execution to avoid performance issues during resize
    if (window.resizeTimeout) {
        clearTimeout(window.resizeTimeout);
    }
    
    window.resizeTimeout = setTimeout(() => {
        // Re-initialize appropriate functions based on new window size
        if (window.innerWidth <= 768) {
            initializeMobileNavigation();
        }
    }, 250);
});

// Initialize Back to Top Button
function initializeBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize Form Validation and Handling
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Add placeholders to form fields
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.setAttribute('placeholder', ' ');
        });
        
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'contact-form-success';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for reaching out. I'll get back to you soon.</p>
        `;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Simulate form submission (would be replaced with actual API call)
            const submitButton = contactForm.querySelector('.submit-btn');
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate network delay
            setTimeout(() => {
                // Success state
                submitButton.innerHTML = '<span>Sent!</span> <i class="fas fa-check"></i>';
                submitButton.classList.add('success');
                
                // Clear form
                contactForm.reset();
                
                // Show success message
                if (!document.querySelector('.contact-form-success')) {
                    contactForm.parentNode.appendChild(successMessage);
                    successMessage.classList.add('show');
                }
                
                // Reset button after delay
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
                    submitButton.classList.remove('success');
                    
                    // Hide success message after a while
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 5000);
                }, 2000);
            }, 1500);
        });
    }
}

// Enhanced Skill Interaction
function enhanceSkillInteraction() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        // Create progress animation
        const progressBar = item.querySelector('.skill-progress-bar');
        const progressValue = progressBar.getAttribute('data-width');
        
        // Add visual feedback on hover
        item.addEventListener('mouseenter', () => {
            // Create animation
            progressBar.style.boxShadow = `0 0 10px var(--accent-primary)`;
        });
        
        item.addEventListener('mouseleave', () => {
            progressBar.style.boxShadow = `none`;
        });
        
        // Make skill details interactive
        item.addEventListener('click', () => {
            const skillName = item.querySelector('.skill-info span:first-child').textContent;
            const skillLevel = parseInt(item.querySelector('.skill-info span:last-child').textContent);
            
            // Create or update skill detail
            let skillDetail = item.querySelector('.skill-detail');
            
            if (!skillDetail) {
                skillDetail = document.createElement('div');
                skillDetail.className = 'skill-detail';
                
                // Create skill visualization
                const blocks = Math.round(skillLevel / 10); // 10% per block
                let visualization = '';
                
                for (let i = 0; i < 10; i++) {
                    if (i < blocks) {
                        visualization += '<span class="skill-block active"></span>';
                    } else {
                        visualization += '<span class="skill-block"></span>';
                    }
                }
                
                // Add description based on skill level
                let description = '';
                if (skillLevel >= 90) {
                    description = `Expert level proficiency with ${skillName}`;
                } else if (skillLevel >= 75) {
                    description = `Advanced knowledge and experience with ${skillName}`;
                } else if (skillLevel >= 60) {
                    description = `Solid working knowledge of ${skillName}`;
                } else {
                    description = `Fundamental understanding of ${skillName}`;
                }
                
                skillDetail.innerHTML = `
                    <div class="skill-visualization">${visualization}</div>
                    <p class="skill-description">${description}</p>
                `;
                
                item.appendChild(skillDetail);
                
                // Animate skill detail entrance
                setTimeout(() => {
                    skillDetail.style.maxHeight = '200px';
                    skillDetail.style.opacity = '1';
                }, 50);
            } else {
                // Toggle existing skill detail
                if (skillDetail.style.maxHeight !== '0px') {
                    skillDetail.style.maxHeight = '0px';
                    skillDetail.style.opacity = '0';
                    
                    // Remove after animation
                    setTimeout(() => {
                        skillDetail.remove();
                    }, 300);
                } else {
                    skillDetail.style.maxHeight = '200px';
                    skillDetail.style.opacity = '1';
                }
            }
        });
    });
}

// Simulate Notifications
function simulateNotifications() {
    const navItems = document.querySelectorAll('.side-nav a');
    
    // Randomly show notification badges on navigation items
    setTimeout(() => {
        // Add notification to contact link
        const contactLink = document.querySelector('.side-nav a[href="#contact"]');
        if (contactLink) {
            // Create notification badge if it doesn't exist
            if (!contactLink.querySelector('.notification-badge')) {
                const badge = document.createElement('div');
                badge.className = 'notification-badge';
                badge.textContent = '1';
                contactLink.appendChild(badge);
                
                // Show the badge with animation
                setTimeout(() => {
                    badge.classList.add('show');
                }, 300);
                
                // Remove badge when clicked
                contactLink.addEventListener('click', () => {
                    badge.classList.remove('show');
                    setTimeout(() => {
                        badge.remove();
                    }, 300);
                });
            }
        }
    }, 5000);
}

// Interactive sections with intersection observer
function initializeIntersectionObserver() {
    if ('IntersectionObserver' in window) {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.side-nav a');
        
        // Options for the observer
        const options = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.3 // 30% of the section visible
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentSection = entry.target;
                    
                    // Only update nav if not in desktop mode (where we use tab-style navigation)
                    if (window.innerWidth <= 768) {
                        // Update active class
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${currentSection.id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                    
                    // Trigger animations for the section
                    animateSectionElements(currentSection);
                }
            });
        }, options);
        
        // Observe each section
        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

// Function to create random tech-inspired particles in the background
function createTechParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'tech-particles';
    document.body.appendChild(particlesContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'tech-particle';
        
        // Random particle type
        const particleTypes = ['circle', 'square', 'triangle', 'dot'];
        const particleType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        particle.classList.add(`particle-${particleType}`);
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Random size
        const size = 5 + Math.random() * 15;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random opacity
        particle.style.opacity = 0.1 + Math.random() * 0.3;
        
        // Random animation duration
        const duration = 10 + Math.random() * 20;
        particle.style.animationDuration = `${duration}s`;
        
        // Random animation delay
        const delay = Math.random() * 5;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            particle.remove();
        }, (duration + delay) * 1000);
    }
    
    // Create initial particles
    for (let i = 0; i < 20; i++) {
        createParticle();
    }
    
    // Continue creating particles
    setInterval(createParticle, 3000);
}

// Add these new functions to initializeAnimations
function initializeAdditionalFeatures() {
    initializeBackToTop();
    initializeContactForm();
    enhanceSkillInteraction();
    simulateNotifications();
    initializeIntersectionObserver();
    
    // Only initialize these on high-performance devices
    const isHighPerformanceDevice = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    if (isHighPerformanceDevice) {
        createTechParticles();
    }
}

// Add this to our main initialization function
document.addEventListener('DOMContentLoaded', () => {
    if (document.readyState === 'complete') {
        initializeAnimations();
        initializeAdditionalFeatures();
    }
});