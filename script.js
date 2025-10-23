document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // تعطيل التنبيهات الافتراضية
  window.alert = function () {};

  // التحقق من صحة النماذج
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        showAlert('error', 'خطأ في الإدخال', 'يرجى ملء جميع الحقول بشكل صحيح.');
      }
      form.classList.add('was-validated');
    }, false);
  });

  // تنظيف إدخال حقل الاسم
  document.querySelectorAll('#name').forEach(input => {
    input.addEventListener('input', function () {
      this.value = this.value.replace(/[^A-Za-z\u0600-\u06FF\s\-']/g, '');
    });
  });

  // وظيفة "قريبًا" للنسخة الإنجليزية
  window.showLanguageComingSoon = event => {
    event.preventDefault();
    showAlert('info', 'نعتذر لعدم توفر الخدمة! 😊', 'سيتم توفير موقع باللغة الإنجليزية قريبًا. انتظرنا!');
  };

  // زر العودة للأعلى
  const backToTopButton = document.getElementById('backToTop');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      backToTopButton.classList.toggle('visible', window.scrollY > 300);
    });
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // معالجة نموذج الاتصال باستخدام AJAX
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }

      const submitBtn = document.getElementById('submitBtn');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

      const formData = new FormData(this);

      fetch('https://formspree.io/f/mzzanwoy', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
        .then(response => {
          if (!response.ok) throw new Error(`خطأ HTTP! الحالة: ${response.status} ${response.statusText}`);
          return response.json();
        })
        .then(data => {
          if (data.ok) {
            showAlert('success', 'تم الإرسال بنجاح!', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.');
            this.reset();
            this.classList.remove('was-validated');
          } else {
            throw new Error(data.error || 'فشل إرسال الرسالة.');
          }
        })
        .catch(error => {
          showAlert('error', 'خطأ', `حدث خطأ أثناء إرسال الرسالة: ${error.message}. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.`, true);
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        });
    });
  }

  // تهيئة Swiper للـ Hero
  const heroSwiper = new Swiper('.hero-swiper', {
    direction: 'horizontal',
    loop: true,
    autoplay: { delay: 6000, disableOnInteraction: false },
    speed: 1000,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  });

  // تهيئة Swiper للفريق
  const teamSwiperEl = document.querySelector('.team-swiper');
  if (teamSwiperEl) {
    new Swiper('.team-swiper', {
      direction: 'horizontal',
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      speed: 800,
      slidesPerView: 1,
      spaceBetween: 30,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }

  // تأثيرات التمرير للشريط التنقل
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 100);
    });
  }

  // قائمة الجوال
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    let isMenuOpen = false;
    
    const toggleMenu = (event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      isMenuOpen = !isMenuOpen;
      menuToggle.classList.toggle('active', isMenuOpen);
      navLinks.classList.toggle('active', isMenuOpen);
      menuToggle.setAttribute('aria-expanded', isMenuOpen);
    };

    menuToggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    });

    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', (event) => {
        event.stopPropagation();
        isMenuOpen = false;
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (event) => {
      if (isMenuOpen && !menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
        isMenuOpen = false;
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // تفعيل الخطوات التفاعلية
  const processSteps = document.querySelectorAll('.process-step');
  
  function activateStepsOnScroll() {
    processSteps.forEach((step, index) => {
      const stepTop = step.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (stepTop < windowHeight * 0.75) {
        setTimeout(() => {
          step.classList.add('active');
        }, index * 200);
      }
    });
  }

  window.addEventListener('scroll', activateStepsOnScroll);
  activateStepsOnScroll();

  // JavaScript خاص بقسم المسح
  const scanSection = document.getElementById('scan-manuscript');
  if (scanSection) {
    const uploadZone = scanSection.querySelector('#uploadZone');
    const fileInput = scanSection.querySelector('#fileInput');
    const uploadPreview = scanSection.querySelector('#uploadPreview');
    const previewGrid = scanSection.querySelector('#previewGrid');
    const tabBtns = scanSection.querySelectorAll('.tab-btn');
    const startScanningBtn = scanSection.querySelector('#startScanning');
    const copyBtn = scanSection.querySelector('.copy-btn');
    
    if (uploadZone) {
      uploadZone.addEventListener('click', () => fileInput.click());
      
      uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#10b981';
        uploadZone.style.background = 'rgba(16, 185, 129, 0.05)';
      });
      
      uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '#cbd5e1';
        uploadZone.style.background = 'white';
      });
      
      uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#cbd5e1';
        uploadZone.style.background = 'white';
        const files = e.dataTransfer.files;
        handleFiles(files);
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
      });
    }
    
    function handleFiles(files) {
      if (files.length > 0 && uploadPreview && previewGrid) {
        uploadPreview.style.display = 'block';
        previewGrid.innerHTML = '';
        
        Array.from(files).forEach(file => {
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const previewItem = document.createElement('div');
              previewItem.style.cssText = 'position: relative; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);';
              previewItem.innerHTML = `<img src="${e.target.result}" alt="${file.name}" style="width: 100%; height: 100px; object-fit: cover;">`;
              previewGrid.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
          }
        });
        
        simulateProcessing();
      }
    }
    
    function simulateProcessing() {
      const processingSteps = scanSection.querySelectorAll('.processing-step');
      let currentStep = 0;
      
      const processInterval = setInterval(() => {
        if (currentStep > 0) {
          processingSteps[currentStep - 1].classList.remove('active');
          processingSteps[currentStep - 1].querySelector('i').className = 'fas fa-check-circle step-icon';
        }
        
        if (currentStep < processingSteps.length) {
          processingSteps[currentStep].classList.add('active');
          processingSteps[currentStep].querySelector('i').className = 'fas fa-spinner fa-spin step-icon';
          currentStep++;
        } else {
          clearInterval(processInterval);
        }
      }, 1500);
    }
    
    if (tabBtns.length > 0) {
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTab = btn.getAttribute('data-tab');
          
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          scanSection.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
          });
          
          const targetPane = scanSection.querySelector(`#${targetTab}`);
          if (targetPane) {
            targetPane.classList.add('active');
          }
        });
      });
    }
    
    if (startScanningBtn) {
      startScanningBtn.addEventListener('click', () => {
        if (fileInput) {
          fileInput.click();
        }
      });
    }
    
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const textToCopy = scanSection.querySelector('.text-sample').textContent;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showAlert('success', 'تم النسخ!', 'تم نسخ النص إلى الحافظة', false);
          });
        }
      });
    }
  }

  // JavaScript خاص بقسم المخطوطات المحفوظة
  const preservedSection = document.getElementById('preserved-manuscripts');
  if (preservedSection) {
    const filterBtns = preservedSection.querySelectorAll('.filter-btn');
    const manuscriptCards = preservedSection.querySelectorAll('.manuscript-card');
    const loadMoreBtn = preservedSection.querySelector('.load-more-btn');

    // تصفية المخطوطات
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        manuscriptCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 100);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    // تحميل المزيد من المخطوطات
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
        this.disabled = true;
        
        setTimeout(() => {
          showAlert('success', 'تم التحميل!', 'تم تحميل 6 مخطوطات إضافية', false);
          
          this.innerHTML = '<i class="fas fa-plus"></i> عرض المزيد من المخطوطات';
          this.disabled = false;
        }, 2000);
      });
    }

    // تأثيرات hover للبطاقات
    manuscriptCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  }
});

// دالة مساعدة لعرض التنبيهات
function showAlert(icon, title, text, showConfirmButton = false) {
  if (typeof Swal !== 'undefined') {
    const config = {
      icon: icon,
      title: title,
      text: text,
      background: icon === 'error' ? '#fff4f4' : 
                 icon === 'success' ? '#f4f9ff' : 
                 'linear-gradient(135deg, #ffffff, #f8f9fa)',
      iconColor: icon === 'error' ? '#dc3545' : 
                 icon === 'success' ? '#28a745' : 
                 '#11A7A5',
      timer: showConfirmButton ? null : 3000,
      timerProgressBar: !showConfirmButton,
      showConfirmButton: showConfirmButton,
      position: 'center',
      customClass: {
        popup: 'animated-swal',
        title: 'swal-title',
        content: 'swal-text',
        confirmButton: 'swal-button',
      },
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' },
    };

    if (showConfirmButton) {
      config.confirmButtonText = 'موافق';
    }

    Swal.fire(config);
  }
}