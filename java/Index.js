document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // 1. MOBILE MENU HANDLING LOGIC
    // ===================================
    
    const menuToggle = document.getElementById('menuToggle');
    const menuWrapper = document.getElementById('menuWrapper');
    const menuItems = document.querySelectorAll('.menu-list > li');
    
    if (menuToggle && menuWrapper && menuItems.length > 0) {
        // Toggle mobile menu
        menuToggle.addEventListener('click', function() {
            menuWrapper.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Toggle submenus on mobile
        menuItems.forEach(item => {
            if (item.querySelector('.submenu')) {
                item.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        this.classList.toggle('active');
                    }
                });
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !menuToggle.contains(e.target) && 
                !menuWrapper.contains(e.target) &&
                menuWrapper.classList.contains('active')) {
                menuWrapper.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                menuWrapper.classList.remove('active');
                menuToggle.classList.remove('active');
                
                // Reset active classes on menu items
                menuItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    }


    //slideshow

   const slideTrack = document.getElementById('slideTrack'); 
    if (!slideTrack) return;

    const originalSlides = slideTrack.querySelectorAll('.slide-item');
    const numSlides = originalSlides.length; // Number of original slides (e.g., 4)

    // 1. CLONE THE FIRST SLIDE to the end of the track
    const firstSlideClone = originalSlides[0].cloneNode(true);
    slideTrack.appendChild(firstSlideClone);

    // Total items in the track now includes the clone (e.g., 5)
    const totalItems = numSlides + 1; 
    const slideShiftPercentage = 100 / totalItems; // Each item is now (e.g., 20%) wide

    let currentSlide = 0; // Tracks the index of the item (0 to 4)

    // 2. Add listener to handle the seamless reset
    slideTrack.addEventListener('transitionend', () => {
        // Check if we just finished sliding onto the cloned slide (the last item)
        if (currentSlide === numSlides) {
            // A. Disable the CSS transition for an instant jump
            slideTrack.style.transition = 'none';
            
            // B. Instantly jump back to the actual first slide (index 0)
            currentSlide = 0;
            slideTrack.style.transform = `translateX(0%)`;
            
            // C. Re-enable the CSS transition for the next cycle
            // Using requestAnimationFrame ensures the transition reset happens before the next slide command
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    slideTrack.style.transition = 'transform 1s ease-in-out';
                });
            });
        }
    });


    function nextSlide() {
        currentSlide++;
        
        // We only need to check if we've gone past the clone on the transitionend event.
        // Here, we just ensure we don't go past the clone's index.
        if (currentSlide > numSlides) {
            currentSlide = 0; // Should be handled by transitionend, but this is a safety.
        }

        // Calculate the required horizontal shift based on the new item percentage
        const shiftAmount = -currentSlide * slideShiftPercentage;

        slideTrack.style.transform = `translateX(${shiftAmount}%)`;
    }

    const intervalTime = 2500;
    // Note: The total time per slide should be intervalTime + transition time (e.g., 2500ms + 1000ms = 3500ms) 
    // for the smoothest experience, but we'll stick to 2500ms for the direct edit.
    setInterval(nextSlide, intervalTime);
});