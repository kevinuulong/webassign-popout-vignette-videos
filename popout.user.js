// ==UserScript==
// @name         iframe Popout
// @namespace    https://kevinuulong.com/
// @version      1.0.0
// @description  Popout the interactive videos from WebAssign.
// @author       kevinuulong
// @match        https://www.webassign.net/web/Student/Assignment-Responses/*
// @icon         https://www.google.com/s2/favicons?domain=webassign.net
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    if (document.readyState !== "loading") {
        console.log("Not ready yet!")
        setTimeout(loadCustom, 1500);
    } else {
        document.addEventListener("DOMContentLoaded", loadCustom);
    }

    let popoutWidth, popoutHeight;

    if (window.outerWidth > 1200 && window.outerHeight > 780) {
        popoutWidth = 1200, popoutHeight = 780;
    } else if (window.outerWidth >= window.outerHeight) {
        popoutWidth = window.outerHeight / 0.65, popoutHeight = window.outerHeight;
    } else {
        popoutHeight = window.outerWidth / 0.65, popoutWidth = window.outerWidth;
    }

    let css = `
        .fab {
            width: 48px;
            height: 48px;
            background-color: #f5e1da;
            color: #d7886d;
            border-radius: 16px;
            cursor: pointer;
            position: absolute;
            align-items: center;
            justify-content: center;
            display: flex;
        }

        .wa1given {
            margin: 0 0 1em 0 !important;
        }

        .qContent.standard {
            position: static !important;
        }
        
        .waQBox>.qUtility {
            position: static !important;
        }

        .popout {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99;
            height: ${popoutHeight}px;
            width: ${popoutWidth}px;
        }

        .shadowbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 98;
            background-color: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: none;
        }

        .noScroll {
            overflow: hidden;
        }

        .closePopout {
            position: fixed;
            top: 9px;
            right: 9px;
            z-index: 100;
        }
    `;

    console.log(popoutHeight, popoutWidth)

    GM_addStyle(css);

    let shadowbox = document.createElement('div');
    shadowbox.classList.add('shadowbox');

    let close = document.createElement('div');
    close.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#d7886d"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/></svg>';
    close.classList.add('fab');
    close.classList.add('closePopout');

    close.addEventListener('click', () => {
        document.querySelector('.popout').classList.toggle('popout');
        document.querySelector('.shadowbox').style.display = 'none';
        document.body.classList.remove('noScroll');
    })

    shadowbox.appendChild(close);

    document.body.appendChild(shadowbox);

    function loadCustom() {
        document.querySelectorAll('iframe').forEach((el) => {
            let button = document.createElement('div');
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#d7886d"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V3h-6c-.55 0-1 .45-1 1z"/></svg>';
            button.classList.add('fab');
            let clientRect = el.getBoundingClientRect();
            let pad = 3;
            button.style.top = `${clientRect.top + window.scrollY + pad}px`;
            button.style.left = `${clientRect.right + window.scrollX - pad - 48}px`;

            button.addEventListener('click', () => {
                el.classList.toggle('popout');
                document.querySelector('.shadowbox').style.display = 'block';
                document.body.classList.add('noScroll');
            })
            el.parentNode.appendChild(button);
        })
    }

})();
