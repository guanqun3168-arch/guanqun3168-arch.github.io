/* 冠群建築師事務所 — 共用腳本
   規則見 AGENTS.md：純靜態，不引入未經指定的第三方套件。
   全部功能在關閉 JavaScript 時都要能降級使用。 */

(function () {
  'use strict';

  /* ---------- 1. 標記目前所在的選單項目 ---------- */

  var path = window.location.pathname;

  document.querySelectorAll('.site-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var target = new URL(href, window.location.href).pathname;
    var isCurrent =
      target === path ||
      (target !== '/' && target.length > 1 && path.indexOf(target) === 0);
    if (isCurrent) link.setAttribute('aria-current', 'page');
  });

  /* ---------- 2. 橫向輪播 ----------
     沒有 JS 時仍可用手指或觸控板左右滑動，只是沒有按鈕。 */

  document.querySelectorAll('.rail').forEach(function (rail) {
    var track = rail.querySelector('.rail-track');
    if (!track) return;

    var items = track.children;
    if (items.length < 2) {
      var ctrlEmpty = rail.querySelector('.rail-ctrl');
      if (ctrlEmpty) ctrlEmpty.hidden = true;
      return;
    }

    var prev = rail.querySelector('[data-rail="prev"]');
    var next = rail.querySelector('[data-rail="next"]');
    var dots = rail.querySelector('.rail-dots');

    if (dots) {
      for (var i = 0; i < items.length; i++) {
        dots.appendChild(document.createElement('span'));
      }
    }

    function step() {
      return items[0].getBoundingClientRect().width + 16;
    }

    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;

      if (dots) {
        var idx = Math.round(track.scrollLeft / step());
        for (var i = 0; i < dots.children.length; i++) {
          if (i === idx) dots.children[i].setAttribute('data-on', '');
          else dots.children[i].removeAttribute('data-on');
        }
      }
    }

    if (prev) prev.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    });

    if (next) next.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- 3. 站內搜尋 ----------
     索引在 assets/js/search-index.js。沒有 JS 時搜尋按鈕不會出現。 */

  var toggle = document.querySelector('.search-toggle');
  var panel = document.getElementById('search-panel');

  if (toggle && panel && window.SITE_INDEX) {
    var input = panel.querySelector('input');
    var results = panel.querySelector('.search-results');
    var note = panel.querySelector('.search-note');
    var depth = (panel.getAttribute('data-depth') || '').trim();

    toggle.hidden = false;

    toggle.addEventListener('click', function () {
      panel.hidden = !panel.hidden;
      toggle.setAttribute('aria-expanded', String(!panel.hidden));
      if (!panel.hidden) input.focus();
    });

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      results.innerHTML = '';

      if (!q) {
        note.textContent = '';
        return;
      }

      var hits = window.SITE_INDEX.filter(function (item) {
        return (item.title + ' ' + item.keywords).toLowerCase().indexOf(q) > -1;
      });

      if (!hits.length) {
        note.textContent = '找不到「' + input.value.trim() + '」相關的頁面。';
        return;
      }

      note.textContent = '找到 ' + hits.length + ' 個頁面。';

      hits.forEach(function (item) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = depth + item.path;
        a.textContent = item.title;
        li.appendChild(a);
        results.appendChild(li);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) {
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }
})();
