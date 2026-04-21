  const indicator = document.querySelector('.scroll-indicator');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollTop / docHeight;

    const maxMove = window.innerHeight - indicator.offsetHeight;

    indicator.style.transform = `translateY(${progress * maxMove}px)`;
  });