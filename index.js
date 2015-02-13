/*jslint plusplus: true */
(function () {
    'use strict';

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

    function init() {
        createPager();
    }

    document.addEventListener('DOMContentLoaded', function (e) {
        init();
    });


}());
