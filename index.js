/*jslint plusplus: true */
document.addEventListener("DOMContentLoaded", function (e) {
    'use strict';

    var sections, pager, pagerItem, i;

    sections    = document.querySelectorAll('section');
    pager       = document.querySelector('#pager');

    for (i = 0; i < sections.length; i++) {
        pagerItem = document.createElement('a');
        pagerItem.innerHTML = '.';
        pagerItem.href = '#' + sections[i].id;
        pager.appendChild(pagerItem);
    }

});
