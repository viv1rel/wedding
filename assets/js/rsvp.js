(function () {
  const form = document.getElementById('rsvp-form');
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('modal-close');
  if (!form || !modal) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const submitBtnLabel = submitBtn?.textContent;

  const nameInput = form.querySelector('input[name="name"]');
  const attendInputs = form.querySelectorAll('input[name="attend"]');
  const plusOnesInput = form.querySelector('input[name="plus_ones"]');
  const trackInput = form.querySelector('input[name="track"]');
  const wishesInput = form.querySelector('textarea[name="wishes"]');
  const websiteInput = form.querySelector('input[name="website"]');
  const extrasBlock = document.getElementById('rsvp-extras');

  const errorEls = {
    name:   form.querySelector('[data-error="name"]'),
    attend: form.querySelector('[data-error="attend"]'),
  };

  const messages = {
    nameRequired:   'Пожалуйста, укажите ваше имя',
    attendRequired: 'Пожалуйста, выберите один из вариантов',
    sendError:      'Не удалось доставить ответ. Пожалуйста, включите VPN или напишите нам в Telegram напрямую.',
  };

  const GOOGLE_PROXY_URL = 'https://script.google.com/macros/s/AKfycbyyzKWnQ84JIbz17gXRwXNtagOMa_PofspbJWkSb82GP2BmNoZtHC6mYO25kdbGFZrX1Q/exec';

  const modalContent = {
    yes: { title: 'Спасибо!', text: 'Мы получили ваш ответ и ждём встречи с вами 14 августа.' },
    no:  { title: 'Спасибо за ответ', text: 'Жаль, что не получится встретиться. Будем мысленно с вами в этот день.' },
  };

  const showError = (key, text) => {
    const el = errorEls[key];
    if (el) { el.textContent = text; el.classList.remove('hidden'); }
  };
  const clearError = (key) => {
    const el = errorEls[key];
    if (el) { el.textContent = ''; el.classList.add('hidden'); }
  };

  const selectRadioCard = (card) => {
    const input = card.querySelector('input');
    if (!input) return;
    document.querySelectorAll(`.radio-card input[name="${input.name}"]`)
        .forEach((i) => {
          const c = i.closest('.radio-card');
          c.classList.remove('selected');
          c.setAttribute('aria-checked', 'false');
        });
    card.classList.add('selected');
    card.setAttribute('aria-checked', 'true');
    input.checked = true;
    if (input.name === 'attend') {
      clearError('attend');
      if (extrasBlock) {
        extrasBlock.classList.toggle('visible', input.value === 'yes');
      }
    }
  };

  document.querySelectorAll('.radio-card').forEach((card) => {
    card.addEventListener('click', () => selectRadioCard(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectRadioCard(card);
      }
    });
  });

  const openModal = (attendValue) => {
    const data = modalContent[attendValue] || modalContent.yes;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-text').textContent = data.text;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.setAttribute('aria-hidden', 'false');
  };
  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    modal.setAttribute('aria-hidden', 'true');
  };

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  function sendInBackground(payload) {
    return fetch(GOOGLE_PROXY_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      keepalive: true,
      redirect: 'follow'
    })
      .then((response) => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json().catch(() => null);
      })
      .then((json) => {
        if (json && json.status && json.status !== 'success') {
          throw new Error(json.error || 'Server error');
        }
        return true;
      });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!nameInput.value.trim()) {
      showError('name', messages.nameRequired);
      return;
    }
    const attendValue = Array.from(attendInputs).find((i) => i.checked)?.value;
    if (!attendValue) {
      showError('attend', messages.attendRequired);
      return;
    }

    if (websiteInput && websiteInput.value.trim()) {
      openModal(attendValue);
      form.reset();
      return;
    }

    const data = {
      name: nameInput.value.trim(),
      attendValue: attendValue,
      plusOnes: plusOnesInput?.value.trim() || '',
      track: trackInput?.value.trim() || '',
      wishes: wishesInput?.value.trim() || '',
      ts: Date.now()
    };

    openModal(attendValue);
    form.reset();
    document.querySelectorAll('.radio-card').forEach((c) => {
      c.classList.remove('selected');
      c.setAttribute('aria-checked', 'false');
    });
    extrasBlock?.classList.remove('visible');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправлено';
    }

    sendInBackground(data)
      .catch((err) => {
        console.error('RSVP send error:', err);
        const titleEl = document.getElementById('modal-title');
        const textEl = document.getElementById('modal-text');
        if (titleEl && textEl) {
          titleEl.textContent = 'Что-то пошло не так';
          textEl.textContent = messages.sendError;
        }
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtnLabel;
        }
      });
  });

  closeBtn?.addEventListener('click', closeModal);
})();
