/* Запись24: «Сообщить об ошибке». Самодостаточный виджет внизу страницы.
   Форма шлёт почту посетителя и текст на ru.zapis24bot.ru (сервер в России). Адрес получателя на странице не показывается. */
(function () {
  var API = 'https://ru.zapis24bot.ru/feedback/submit';
  var css = '' +
    '.rp-bar{max-width:1100px;margin:0 auto;padding:18px 20px 34px;font:15px/1.5 -apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#5a4650;text-align:center}' +
    '.rp-open{background:none;border:0;padding:0;font:inherit;color:#8a1f4f;text-decoration:underline;text-underline-offset:3px;cursor:pointer}' +
    '.rp-open:hover{color:#5e1235}' +
    '.rp-form{display:none;max-width:520px;margin:16px auto 0;text-align:left;background:#fffdfa;border:1px solid #eadfd6;border-radius:16px;padding:20px}' +
    '.rp-form.on{display:block}' +
    '.rp-form h3{margin:0 0 4px;font-size:18px;color:#2a1722}' +
    '.rp-form p{margin:0 0 14px;font-size:14px;color:#6f5f68}' +
    '.rp-form label{display:block;font-size:14px;font-weight:600;color:#2a1722;margin:12px 0 5px}' +
    '.rp-form input[type=email],.rp-form textarea{width:100%;box-sizing:border-box;border:1px solid #d9cabf;border-radius:10px;padding:10px 12px;font:16px/1.4 inherit;font-family:inherit;color:#2a1722;background:#fff}' +
    '.rp-form textarea{min-height:110px;resize:vertical}' +
    '.rp-form input:focus,.rp-form textarea:focus{outline:2px solid #8a1f4f33;border-color:#8a1f4f}' +
    '.rp-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}' +
    '.rp-send{margin-top:14px;background:#8a1f4f;color:#fff;border:0;border-radius:999px;padding:11px 24px;font:600 15px inherit;font-family:inherit;cursor:pointer}' +
    '.rp-send:disabled{opacity:.6;cursor:default}' +
    '.rp-msg{margin-top:12px;font-size:14px}.rp-msg.err{color:#b3261e}.rp-msg.ok{color:#1b6b3a}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var bar = document.createElement('div'); bar.className = 'rp-bar';
  bar.innerHTML =
    '<button type="button" class="rp-open" aria-expanded="false">Сообщить об ошибке</button>' +
    '<form class="rp-form" novalidate>' +
      '<h3>Сообщить об ошибке</h3>' +
      '<p>Что-то не работает или написано неверно? Опишите, мы разберёмся и ответим на вашу почту.</p>' +
      '<label for="rp-email">Ваша почта (для ответа)</label>' +
      '<input id="rp-email" name="email" type="email" autocomplete="email" placeholder="name@example.ru" maxlength="320" required>' +
      '<label for="rp-text">Что случилось</label>' +
      '<textarea id="rp-text" name="message" maxlength="4000" placeholder="Что вы делали и что пошло не так" required></textarea>' +
      '<input class="rp-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button class="rp-send" type="submit">Отправить</button>' +
      '<div class="rp-msg" role="status"></div>' +
    '</form>';
  document.body.appendChild(bar);

  var open = bar.querySelector('.rp-open'), form = bar.querySelector('.rp-form'), msg = bar.querySelector('.rp-msg'),
      send = bar.querySelector('.rp-send');
  function openForm() { if (form.style.display !== 'block' && form.style.display !== 'flex') open.click(); bar.scrollIntoView({behavior: 'smooth', block: 'center'}); var f = bar.querySelector('#rp-email'); if (f) setTimeout(function () { f.focus(); }, 300); }
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('[data-rp-open]'); if (a) { e.preventDefault(); openForm(); } });
  if (location.hash === '#report') setTimeout(openForm, 400);
  open.addEventListener('click', function () {
    var on = form.classList.toggle('on');
    open.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on) { form.querySelector('input[name=email]').focus(); form.scrollIntoView({behavior: 'smooth', block: 'nearest'}); }
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.className = 'rp-msg'; msg.textContent = '';
    var email = form.email.value.trim(), text = form.message.value.trim();
    if (!email) { msg.className = 'rp-msg err'; msg.textContent = 'Укажите почту, на которую нам ответить.'; form.email.focus(); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s.]{2,}$/.test(email)) { msg.className = 'rp-msg err'; msg.textContent = 'Проверьте почту: она должна выглядеть как name@example.ru'; form.email.focus(); return; }
    if (text.length < 5) { msg.className = 'rp-msg err'; msg.textContent = 'Опишите, что случилось (хотя бы пару слов).'; return; }
    var fd = new FormData(form); fd.append('page', location.pathname + location.hash);
    send.disabled = true; send.textContent = 'Отправляем…';
    fetch(API, {method: 'POST', body: fd}).then(function (r) { return r.json().catch(function () { return {ok: false}; }); })
      .then(function (j) {
        if (j.ok) { form.reset(); msg.className = 'rp-msg ok'; msg.textContent = 'Спасибо! Сообщение отправлено, ответим на указанную почту.'; }
        else { msg.className = 'rp-msg err'; msg.textContent = j.error || 'Не получилось отправить. Напишите нам в Telegram @zapis_24.'; }
      })
      .catch(function () { msg.className = 'rp-msg err'; msg.textContent = 'Не получилось отправить. Напишите нам в Telegram @zapis_24.'; })
      .then(function () { send.disabled = false; send.textContent = 'Отправить'; });
  });
})();
