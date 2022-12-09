// ==UserScript==
// @name         Badge Markdown Generator
// @namespace    https://github.com/Blackman99/md-badge-generator/raw/main/md-badge-generator.user.js
// @version      0.0.1
// @description  A user script to add markdown badges generator form to your github page by using [Shields](https://shields.io/)
// @author       Dongsheng Zhao
// @match        https://github.com/**/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  // Your code here...
  const routeMather = /https:\/\/github\.com\/\S+\/(pull\/[0-9]+)|(edit\/\S+\.md)|(issues\/\S+)|(compare\/\S+)/

  function addBadgeForm() {
    if(document.querySelector('#badge-form')) {
      return
    }
    const badgeStyle = document.createElement('style')
    badgeStyle.textContent = `
#badge-form {
  position: fixed;
  top: 30vh;
  left: 1rem;
  width: 280px;
}
#badge-form .badge-form-item {
  margin-bottom: 1rem;
}
#badge-form .badge-form-item:last-child {
  display: flex;
  justify-content: flex-end;
}
#badge-form label {
  display: block;
  margin-bottom: 8px;
}
#badge-form input,
#badge-form textarea{
  width: 100%;
}
#badge-form-copy-btn {
  display: flex;
  align-items: center;
}
    `
    const container = document.createElement('form')
    container.id = 'badge-form'
    container.innerHTML = `
<div class="badge-form-item">
  <label>Badge label</label>
  <input id="badge-label" value="" name="badge-label" />
</div>
<div class="badge-form-item">
  <label>Badge title</label>
  <input id="badge-title" value="" name="badge-title" />
</div>
<div class="badge-form-item">
  <label>Badge link</label>
  <textarea id="badge-link" name="badge-link"></textarea>
</div>
<div class="badge-form-item">
  <label>Badge color</label>
  <input type="color" name="badge-color" value="#007ec6" />
</div>
<div class="badge-form-item">
  <button type="button" class="btn btn-sm" id="badge-form-copy-btn">Copy markdown badge</button>
</div>`


    document.head.append(badgeStyle)
    document.body.append(container)


    function __copyBadgeMd() {
      const form = document.querySelector('#badge-form')
      const fd = new FormData(form)
      const label = fd.get('badge-label')
      const title = fd.get('badge-title')
      const link = fd.get('badge-link')
      const color = fd.get('badge-color')
      const shieldsLink = `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(title)}-${encodeURIComponent(color)}`
      navigator.clipboard.writeText(`[![](${shieldsLink})](${link})`)
      const originText = this.innerHTML
      this.innerHTML = `
 <svg class="octicon octicon-check mx-auto d-block color-fg-success" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
   <path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
 </svg>
 Copied`
      setTimeout(() => {
        this.innerHTML = originText
      }, 2000)
    }

    document.querySelector('#badge-form-copy-btn').onclick = __copyBadgeMd
  }

  function removeBadgeForm () {
    const form = document.querySelector('#badge-form')
    if(form) {
      form.remove()
    }
  }


  function reset () {
    if (routeMather.test(location.href)) {
      addBadgeForm()
    } else {
      removeBadgeForm()
    }
  }
  
  const originPushState = history.pushState
  history.pushState = (...args) => {
    requestAnimationFrame(reset)
    return originPushState(...args)
  }

  reset()
})();
