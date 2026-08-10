/* 冠群建築師事務所 — 共用腳本
   規則見 AGENTS.md：純靜態，不引入未經指定的第三方套件。
   目前只做一件事：依網址標記目前所在的選單項目。 */

(function () {
  'use strict';

  var path = window.location.pathname;

  document.querySelectorAll('.site-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;

    var target = new URL(href, window.location.href).pathname;

    var isCurrent =
      target === path ||
      (target !== '/' && target.length > 1 && path.indexOf(target) === 0);

    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
