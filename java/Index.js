document.addEventListener('DOMContentLoaded', function() { 
    const menuToggle = document.getElementById('menuToggle');
    // CRITICAL FIX: Changed 'menuWrapper' to 'menu-wrapper' to match HTML ID
    const menuWrapper = document.getElementById('menu-wrapper'); 
    const menuItems = document.querySelectorAll('.menu-list > li');
    
    
    if (menuToggle && menuWrapper && menuItems.length > 0) {
        
        // Toggle mobile menu
        menuToggle.addEventListener('click', function() {
            menuWrapper.classList.toggle('active');
            this.classList.toggle('active'); // Use for hamburger icon animation
        });
        
        // Toggle submenus on mobile
        menuItems.forEach(item => {
            const submenu = item.querySelector('.submenu'); // Get the submenu
            
            // Only attach listener if a submenu exists for this item
            if (submenu) {
                item.addEventListener('click', function(e) {
                    // Only apply toggle logic on mobile/tablet screen sizes
                    if (window.innerWidth <= 768) {
                        // Prevent the link from navigating if it has a submenu
                        e.preventDefault();
                        this.classList.toggle('active');
                        // Optional: Toggle the submenu's own class if needed for smooth transition
                        // submenu.classList.toggle('visible'); 
                    }
                });
            }
        });
        
        // Close menu when clicking outside (on mobile)
        document.addEventListener('click', function(e) {
            // Check if outside the toggle or the wrapper
            const isOutside = !menuToggle.contains(e.target) && !menuWrapper.contains(e.target);
            
            if (window.innerWidth <= 768 && isOutside && menuWrapper.classList.contains('active')) {
                menuWrapper.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
        
        // Handle window resize (desktop -> mobile or vice-versa)
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                // Remove active classes to ensure menu is hidden on desktop
                menuWrapper.classList.remove('active');
                menuToggle.classList.remove('active');
                
                // Reset active classes on menu items (for open submenus)
                menuItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    }
    
    const slideTrack = document.getElementById('slideTrack'); 
    if (!slideTrack) return; // Exit if slideshow elements aren't on this page

    const originalSlides = slideTrack.querySelectorAll('.slide-item');
    const numSlides = originalSlides.length; 

    // CLONE THE FIRST SLIDE
    const firstSlideClone = originalSlides[0].cloneNode(true);
    slideTrack.appendChild(firstSlideClone);

    const totalItems = numSlides + 1; 
    const slideShiftPercentage = 100 / totalItems; 

    let currentSlide = 0; 


    slideTrack.addEventListener('transitionend', () => {
        if (currentSlide === numSlides) {
            slideTrack.style.transition = 'none';
            currentSlide = 0;
            slideTrack.style.transform = `translateX(0%)`;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    slideTrack.style.transition = 'transform 1s ease-in-out';
                });
            });
        }
    });

    function nextSlide() {
        currentSlide++; 
        const shiftAmount = -currentSlide * slideShiftPercentage;
        slideTrack.style.transform = `translateX(${shiftAmount}%)`;
    }

    const intervalTime = 2500;
    setInterval(nextSlide, intervalTime); 
});