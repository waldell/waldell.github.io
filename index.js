/*jslint plusplus: true */
(function () {
    'use strict';

    function createPager() {
        var sections, pager, pagerItem, i;

        sections    = document.querySelectorAll('section');
        pager       = document.querySelector('#pager');

        for (i = 0; i < sections.length; i++) {
            pagerItem = document.createElement('a');
            pagerItem.innerHTML = '.';
            pagerItem.href = '#' + sections[i].id;
            pager.appendChild(pagerItem);
        }
    }

    function init() {
        createPager();
    }

    document.addEventListener("DOMContentLoaded", function (e) {
        init();
    });


}());
