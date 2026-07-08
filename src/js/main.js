(function () {
  const scrollRoot = document.querySelector(".site-main");

  function observeVideos() {
    const videos = document.querySelectorAll("video");
    if (!videos.length) return;

    if (!("IntersectionObserver" in window)) {
      videos.forEach((video) => {
        if (video.dataset.src) {
          video.src = video.dataset.src;
        }
        video.play().catch(() => {});
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            if (video.dataset.src && !video.dataset.loaded) {
              video.src = video.dataset.src;
              video.dataset.loaded = "true";
              video.load();
            }
            video.play().catch(() => {});
            return;
          }

          video.pause();
        });
      },
      {
        root: scrollRoot,
        rootMargin: "300px 0px",
        threshold: 0.01,
      }
    );

    videos.forEach((video) => observer.observe(video));
  }

  function initScrollIndicator() {
    const indicator = document.querySelector(".scroll-indicator");
    if (!indicator) return;

    const onScroll = () => {
      const scrollTop = scrollRoot ? scrollRoot.scrollTop : window.scrollY;
      const scrollHeight = scrollRoot
        ? scrollRoot.scrollHeight - scrollRoot.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      const maxMove = window.innerHeight - indicator.offsetHeight;
      indicator.style.transform = `translateY(${progress * maxMove}px)`;
    };

    (scrollRoot || window).addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  observeVideos();
  initScrollIndicator();
})();
