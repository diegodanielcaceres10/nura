(() => {
  const ANALYTICS_ID = 'G-J84FF4THZQ';
  const STORAGE_KEY = 'analytics_opt_in';
  const STORAGE_ACCEPTED = 'accepted';

  const dntSignals = [navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack];
  if (dntSignals.includes('1') || dntSignals.includes('yes')) {
    return;
  }

  if (!('localStorage' in window)) {
    return;
  }

  let isLoaded = false;
  const loadAnalytics = () => {
    if (isLoaded) return;
    isLoaded = true;
    const gtagScript = document.createElement('script');
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    const bootstrapGtag = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', ANALYTICS_ID, { send_page_view: true });
    };

    if (gtagScript.addEventListener) {
      gtagScript.addEventListener('load', bootstrapGtag, { once: true });
    } else {
      gtagScript.onload = bootstrapGtag;
    }
  };

  const persistOptIn = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, STORAGE_ACCEPTED);
    } catch {
      /* no-op */
    }
  };

  const status = window.localStorage.getItem(STORAGE_KEY);
  if (status === STORAGE_ACCEPTED) {
    loadAnalytics();
    return;
  }

  const triggerEvents = ['pointerdown', 'keydown', 'scroll', 'visibilitychange'];
  const listenerOpts = { once: true, passive: true };
  const getTarget = (event) => (event === 'visibilitychange' ? document : window);
  const removeListeners = () => {
    triggerEvents.forEach((event) => {
      getTarget(event).removeEventListener(event, onFirstInteraction, listenerOpts);
    });
  };

  const onFirstInteraction = () => {
    removeListeners();
    persistOptIn();
    loadAnalytics();
  };

  triggerEvents.forEach((event) => {
    getTarget(event).addEventListener(event, onFirstInteraction, listenerOpts);
  });
})();
