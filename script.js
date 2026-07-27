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
    // Note: the error container is a sibling of the form, not inside it
    this.errorContainer = this.modalContent.querySelector('.modal-error-container');

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
      // Validate in the capture phase on document so an invalid submit is
      // stopped before Formspree's own submit listener (which clears our
      // aria-invalid markers and would fire a doomed request) can run
      document.addEventListener('submit', (e) => {
        if (e.target === this.modalForm) this.handleFormSubmit(e);
      }, true);
      this.modalForm.addEventListener('formspree:submit', () => this.handleFormspreeSubmit());
      this.modalForm.addEventListener('formspree:errors', () => this.handleFormspreeErrors());

      // Add input listeners to clear errors as user types
      const inputs = this.modalForm.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('input', () => this.clearFieldError(input));
      });
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

    // Reset form and clear all error states
    this.resetFormState();

    // Focus trap: focus first input
    setTimeout(() => {
      const firstInput = this.modalForm.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  resetFormState() {
    // Clear input values
    const inputs = this.modalForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.value = '';
      input.removeAttribute('aria-invalid');
    });

    // Clear field error messages
    const errorSpans = this.modalForm.querySelectorAll('.field-error');
    errorSpans.forEach(span => {
      span.textContent = '';
      span.classList.remove('visible');
    });

    this.hideErrorContainer();
  }

  hideErrorContainer() {
    if (!this.errorContainer) return;
    this.errorContainer.textContent = '';
    this.errorContainer.classList.remove('visible');
    // Drop any inline styles the Formspree script may have injected
    this.errorContainer.removeAttribute('style');
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
      e.stopPropagation();
    }
  }

  validateForm(nameInput, emailInput, messageInput) {
    let isValid = true;

    this.hideErrorContainer();

    // Validate name
    if (!nameInput.value.trim()) {
      this.setFieldError(nameInput, 'name', 'Please enter your name');
      isValid = false;
    } else {
      this.clearFieldError(nameInput);
    }

    // Validate email
    if (!emailInput.value.trim()) {
      this.setFieldError(emailInput, 'email', 'Please enter your email address');
      isValid = false;
    } else if (!this.isValidEmail(emailInput.value)) {
      this.setFieldError(emailInput, 'email', 'Please enter a valid email address');
      isValid = false;
    } else {
      this.clearFieldError(emailInput);
    }

    // Validate message
    if (!messageInput.value.trim()) {
      this.setFieldError(messageInput, 'message', 'Please tell us what\'s in your way');
      isValid = false;
    } else {
      this.clearFieldError(messageInput);
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  setFieldError(input, fieldName, message) {
    input.setAttribute('aria-invalid', 'true');
    const errorSpan = this.modalForm.querySelector(`[data-fs-error="${fieldName}"]`);
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.classList.add('visible');
    }
  }

  clearFieldError(input) {
    const fieldName = input.getAttribute('name');
    input.removeAttribute('aria-invalid');
    const errorSpan = this.modalForm.querySelector(`[data-fs-error="${fieldName}"]`);
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.classList.remove('visible');
    }
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

    // Formspree has written a server error into the container; show it with
    // our styling instead of whatever inline styles the library injected
    if (this.errorContainer && this.errorContainer.textContent.trim()) {
      this.errorContainer.removeAttribute('style');
      this.errorContainer.classList.add('visible');
    }
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
