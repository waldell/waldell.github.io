/*jslint plusplus: true */
(function () {
    'use strict';
    var ga;
    function createPager() {
        var sections, pager, pagerItems, pagerItem, i, j;

        sections    = document.querySelectorAll('section');
        pager       = document.querySelector('#pager');
        pagerItems  = [];

        function click(e) {
            var self = e.currentTarget;
            for (j = 0; j < pagerItems.length; j++) {
                pagerItems[j].classList.remove('active');
            }
            self.classList.add('active');

            ga('send', 'event', 'index', self.href);
        }

        for (i = 0; i < sections.length; i++) {
            pagerItem = document.createElement('a');
            pagerItem.innerHTML = '.';
            pagerItem.href = '#' + sections[i].id;
            pagerItem.addEventListener('click', click);
            pager.appendChild(pagerItem);
        }

        pagerItems = pager.querySelectorAll('a');
        if (pagerItems.length > 0) {
            pagerItems[0].click();
        }
    }
    function createGa() {
        (function (i, s, o, g, r, a, m) {
            i.GoogleAnalyticsObject = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments);
            };
            i[r].l = new Date().getTime();
            a = s.createElement(o);
            m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        }(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga'));
        ga('create', 'UA-59751543-1', 'auto');
        ga('send', 'pageview');
    }

    function init() {
        createGa();
        createPager();
    }

    document.addEventListener('DOMContentLoaded', function (e) {
        init();
    });


}());
