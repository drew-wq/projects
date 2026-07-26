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
  }

  closeMenu() {
    this.menuOpen = false;
    this.menuButton.classList.remove('open');
    this.mobileMenu.classList.remove('open');
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
  // Form submission is handled by @formspree/ajax library
  // No manual submission logic needed

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
