// Navigation utility to handle hash links from any page
export const scrollToSection = (sectionId: string) => {
  // Remove # if present
  const id = sectionId.replace('#', '');
  
  // If we're not on the home page, navigate to home first
  if (window.location.pathname !== '/') {
    sessionStorage.setItem('scroll_to_hash', id);
    window.location.href = `/#${id}`;
    return;
  }
  
  // If we're on the home page, scroll to the section
  scrollToElement(id);
};

// Internal helper to scroll with navbar offset
export const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const navbarHeight = 85;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
    return true;
  }
  return false;
};

// Handle hash navigation on page load or after data fetching
export const handleHashNavigation = () => {
  const hash = window.location.hash.replace('#', '') || sessionStorage.getItem('scroll_to_hash');
  
  if (hash) {
    sessionStorage.removeItem('scroll_to_hash');

    // Retry scrolling a few times to account for dynamic property rendering & image loading
    let attempts = 0;
    const maxAttempts = 6;
    
    const interval = setInterval(() => {
      attempts++;
      const scrolled = scrollToElement(hash);
      if (scrolled || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 200);
  }
};
