// PostHog Analytics
!function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="Ji Yi init fn mn Hr pn bn cn capture calculateEventProperties Sn register register_once register_for_session unregister unregister_for_session Tn getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync Mn identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty Cn xn createPersonProfile setInternalOrTestUser In hn Pn opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing debug Ur Rt getPageViewId captureTraceFeedback captureTraceMetric an".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_ruJvhjjZzzXjlxjnVvLueu02UjVJWcI8EJiR5pcjtur', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-05-30',
    person_profiles: 'identified_only',
})

// pearse&co site controller
// Handles: mobile menu toggle, contact modal, partner card selection
// Form submission is handled by @formspree/ajax

class PearseController {
  constructor() {
    this.menuOpen = false;
    this.modalOpen = false;
    this.activePerson = null;

    this.init();
  }

  init() {
    this.cacheElements();
    this.attachListeners();
  }

  cacheElements() {
    // Menu
    this.menuButton = document.querySelector('.mobile-menu-button');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
    this.menuLinks = this.mobileMenu.querySelectorAll('.mobile-menu-link');
    this.menuContactBtn = this.mobileMenu.querySelector('.mobile-menu-contact');

    // Modal
    this.modalOverlay = document.querySelector('.modal-overlay');
    this.modalContent = document.querySelector('.modal-content');
    this.modalCloseBtn = this.modalContent.querySelector('.modal-close');
    this.modalForm = this.modalContent.querySelector('.modal-form');
    this.modalSuccess = this.modalContent.querySelector('.modal-success');
    this.modalHeader = this.modalContent.querySelector('.modal-header');
    this.modalSuccessClose = this.modalSuccess?.querySelector('.modal-success-close');

    // Contact buttons
    this.navContactBtn = document.querySelector('.nav-button');
    this.heroCtaBtn = document.querySelector('.hero-cta');
    this.closingCtaBtn = document.querySelector('.closing-cta button');

    // People cards
    this.edwinaCard = document.querySelector('[data-person="edwina"]');
    this.drewCard = document.querySelector('[data-person="drew"]');
    this.resetBtn = document.querySelector('.reset-button');
    this.edwinaSpecs = document.querySelector('[data-specs="edwina"]');
    this.drewSpecs = document.querySelector('[data-specs="drew"]');
  }

  attachListeners() {
    // Menu
    if (this.menuButton) {
      this.menuButton.addEventListener('click', () => this.toggleMenu());
    }
    if (this.mobileMenuBackdrop) {
      this.mobileMenuBackdrop.addEventListener('click', () => this.closeMenu());
    }
    if (this.menuContactBtn) {
      this.menuContactBtn.addEventListener('click', () => {
        this.closeMenu();
        this.openModal();
      });
    }

    // Modal
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) {
          this.closeModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalOpen) {
        this.closeModal();
      }
    });

    // Contact buttons
    if (this.navContactBtn) {
      this.navContactBtn.addEventListener('click', () => this.openModal());
    }
    if (this.heroCtaBtn) {
      this.heroCtaBtn.addEventListener('click', () => this.openModal());
    }
    if (this.closingCtaBtn) {
      this.closingCtaBtn.addEventListener('click', () => this.openModal());
    }

    // Success close button
    if (this.modalSuccessClose) {
      this.modalSuccessClose.addEventListener('click', () => this.closeModal());
    }

    // Form validation
    if (this.modalForm) {
      this.modalForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
      this.modalForm.addEventListener('formspree:submit', () => this.handleFormspreeSubmit());
      this.modalForm.addEventListener('formspree:errors', () => this.handleFormspreeErrors());

      // Watch for Formspree inline style changes on error container
      this.watchErrorContainerStyles();
    }

    // People cards
    if (this.edwinaCard) {
      this.edwinaCard.addEventListener('click', () => this.selectPerson('edwina'));
    }
    if (this.drewCard) {
      this.drewCard.addEventListener('click', () => this.selectPerson('drew'));
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetPerson());
    }
  }

  // ==================== MENU ====================

  toggleMenu() {
    this.menuOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.menuOpen = true;
    this.menuButton.classList.add('open');
    this.mobileMenu.classList.add('open');
    if (this.mobileMenuBackdrop) {
      this.mobileMenuBackdrop.classList.add('open');
    }
  }

  closeMenu() {
    this.menuOpen = false;
    this.menuButton.classList.remove('open');
    this.mobileMenu.classList.remove('open');
    if (this.mobileMenuBackdrop) {
      this.mobileMenuBackdrop.classList.remove('open');
    }
  }

  // ==================== MODAL ====================

  openModal() {
    this.modalOpen = true;
    this.modalOverlay.classList.add('open');
    this.modalHeader.style.display = 'block';
    this.modalForm.style.display = 'flex';
    this.modalSuccess.style.display = 'none';
    document.body.classList.add('scroll-locked');
    // Reset form
    const inputs = this.modalForm.querySelectorAll('input, textarea');
    inputs.forEach(input => input.value = '');
    // Clear field errors
    const errorSpans = this.modalForm.querySelectorAll('[data-fs-error]');
    errorSpans.forEach(span => span.textContent = '');
    const errorContainer = this.modalForm.querySelector('[data-fs-error=""]');
    if (errorContainer) errorContainer.textContent = '';
    // Focus trap: focus first input
    setTimeout(() => {
      const firstInput = this.modalForm.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  closeModal() {
    this.modalOpen = false;
    this.modalOverlay.classList.remove('open');
    document.body.classList.remove('scroll-locked');
  }

  // ==================== FORM ====================

  handleFormSubmit(e) {
    const nameInput = this.modalForm.querySelector('#form-name');
    const emailInput = this.modalForm.querySelector('#form-email');
    const messageInput = this.modalForm.querySelector('#form-message');

    const isValid = this.validateForm(nameInput, emailInput, messageInput);

    if (!isValid) {
      e.preventDefault();
    }
  }

  validateForm(nameInput, emailInput, messageInput) {
    let isValid = true;

    if (!nameInput.value.trim()) {
      nameInput.setAttribute('aria-invalid', 'true');
      const nameError = this.modalForm.querySelector('[data-fs-error="name"]');
      nameError.textContent = 'Please enter your name';
      isValid = false;
    } else {
      nameInput.removeAttribute('aria-invalid');
      const nameError = this.modalForm.querySelector('[data-fs-error="name"]');
      nameError.textContent = '';
    }

    if (!emailInput.value.trim()) {
      emailInput.setAttribute('aria-invalid', 'true');
      const emailError = this.modalForm.querySelector('[data-fs-error="email"]');
      emailError.textContent = 'Please enter your email address';
      isValid = false;
    } else {
      emailInput.removeAttribute('aria-invalid');
      const emailError = this.modalForm.querySelector('[data-fs-error="email"]');
      emailError.textContent = '';
    }

    if (!messageInput.value.trim()) {
      messageInput.setAttribute('aria-invalid', 'true');
      const messageError = this.modalForm.querySelector('[data-fs-error="message"]');
      messageError.textContent = 'Please tell us what\'s in your way';
      isValid = false;
    } else {
      messageInput.removeAttribute('aria-invalid');
      const messageError = this.modalForm.querySelector('[data-fs-error="message"]');
      messageError.textContent = '';
    }

    return isValid;
  }

  handleFormspreeSubmit() {
    this.modalHeader.style.display = 'none';
    this.modalForm.style.display = 'none';
    this.modalSuccess.style.display = 'flex';
  }

  handleFormspreeErrors() {
    this.modalHeader.style.display = 'block';
    this.modalForm.style.display = 'flex';
    this.modalSuccess.style.display = 'none';

    // Remove inline styles from Formspree error container to apply our CSS
    this.cleanErrorContainerStyles();
  }

  cleanErrorContainerStyles() {
    const errorContainer = this.modalForm.querySelector('[data-fs-error=""]');
    if (errorContainer && errorContainer.getAttribute('style')) {
      // Remove all inline styles
      errorContainer.removeAttribute('style');
    }
  }

  watchErrorContainerStyles() {
    const errorContainer = this.modalForm.querySelector('[data-fs-error=""]');
    if (!errorContainer) return;

    // Use MutationObserver to watch for inline style changes by Formspree
    const observer = new MutationObserver(() => {
      this.cleanErrorContainerStyles();
    });

    observer.observe(errorContainer, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: false
    });
  }

  // ==================== PEOPLE CARDS ====================

  selectPerson(name) {
    if (this.activePerson === name) return;
    this.activePerson = name;
    this.updatePersonUI();
  }

  resetPerson() {
    this.activePerson = null;
    this.updatePersonUI();
  }

  updatePersonUI() {
    const isEdwina = this.activePerson === 'edwina';
    const isDrew = this.activePerson === 'drew';

    if (this.edwinaCard) {
      this.edwinaCard.classList.toggle('hidden', isEdwina);
    }
    if (this.drewCard) {
      this.drewCard.classList.toggle('hidden', isDrew);
    }
    if (this.edwinaSpecs) {
      this.edwinaSpecs.classList.toggle('visible', isEdwina);
    }
    if (this.drewSpecs) {
      this.drewSpecs.classList.toggle('visible', isDrew);
    }
    if (this.resetBtn) {
      this.resetBtn.classList.toggle('visible', this.activePerson !== null);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PearseController();
  });
} else {
  new PearseController();
}
