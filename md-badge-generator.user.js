// ==UserScript==
// @name         Badge Markdown Generator
// @namespace    https://github.com/Blackman99/md-badge-generator/raw/main/md-badge-generator.user.js
// @version      0.0.2
// @description  A user script to add markdown badges generator form to your github page by using [Shields](https://shields.io/)
// @author       Dongsheng Zhao
// @match        https://github.com/**/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const CSS = `
#badge-form {
  position: fixed;
  top: 30vh;
  left: 1rem;
  z-index: 99999;
  box-shadow: 1px 1px 4px var(--color-border-muted);
  border: 1px solid var(--color-border-muted);
  backdrop-filter: saturate(50%) blur(4px);
}
#badge-form.badge-form--animating {
  border-color: var(--color-fg-default);
}
#badge-form:not(.badge-form--animating):not(.badge-form--animated) {
  width: 280px;
  padding: 12px;
  border-radius: 4px;
}

#badge-form.badge-form--animated {
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  font-size: 24px;
  align-items: center;
  justify-content: center;
  border-color: var(--color-fg-default);
  cursor: pointer;
}

#badge-form.badge-form--animated:active {
  cursor: grab;
}

#badge-form .badge-form--close-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 18px;
  padding: 2px;
  border-radius: 50%;
  cursor: pointer;
}
#badge-form .badge-form--close-icon:hover {
  background-color:
}
#badge-form svg {
  height: 1em;
  width: 1em;
}
#badge-form .badge-form-item {
  margin-bottom: 1rem;
}
#badge-form .badge-form-item:last-child {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
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
}`

   const MAIN_HTML = `
<div class="badge-form--close-icon">
  <svg viewBox="0 0 20 20"><path fill="currentColor" d="m4.3 2.9l12.8 12.8l-1.4 1.4L2.9 4.3z"/><path fill="currentColor" d="M17.1 4.3L4.3 17.1l-1.4-1.4L15.7 2.9z"/></svg>
</div>
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

   const COPID_HTML = `<svg class="octicon octicon-check mx-auto d-block color-fg-success" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
   <path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
 </svg>
 Copied`

   const RESTORE_ICON_HTML = `<svg viewBox="0 0 400 488">
     <path fill="currentColor" d="M160 37Q206 2 272 2q49 0 87 19q10 5 10 17v5q-3 9-11 12q-2 1-7 1q-6 0-8-2q-25-12-54-15q-20-4-47-4q-56 0-104 23q14-14 22-21zm232 297q0-9-8-15q-4-3-10-3q-11 0-15 7q-15 21-31 31q-5 3-14 9t-14 10l-6 4q-8 5-8 15v24l-57-24q-2-1-7-1h-14q-47 0-87.5-18.5T58 323h-1h1q-1 0-3-2q-18-27-18-56q0-52 50-89t120-37q51 0 95 22h1q19 9 33 27q12 15 12 34q0 30-30 52q-33 24-82 24q-16 0-23-1h-1q-34-6-60-21q-55-33-55-84v-7q-20 15-33 35q13 55 70 88l1 1q33 18 72 24h1q18 2 28 2q61 0 103-31q46-34 46-82q0-61-66-94l-1-1q-52-25-111-25q-84 0-144 46Q0 196 0 265q0 42 26 79l3 3q28 38 76 59.5T208 428h11l78 33q2 1 7 1q6 0 10-3q9-5 9-15v-42l1-1q4-3 25-16q20-13 40-40q3-6 3-11zm-150-80v3v-3q18 2 25 2q33 0 62-12q7-12 7-22q0-8-5-20q-28 17-64 17q-7 0-19-2q-68-9-93-58q-17 4-34 12q14 32 46 54t75 29zm158-99q0-54-58-83l-2-1q-46-22-98-22q-75 0-127 40q-17 14-29 29q53-27 119-29q24-4 37-4q43 0 83 19l1 1q25 14 33 34q23 20 34 48q7-17 7-32z"/>
</svg>`

  // The route that need to show badge form
  const ROUTE_MATHER = /https:\/\/github\.com\/\S+\/(pull\/[0-9]+)|(edit\/\S+\.md)|(issues\/\S+)|(compare\/\S+)/

  function addBadgeForm() {
      if(document.querySelector('#badge-form')) {
          return
      }
      const badgeStyle = document.createElement('style')
      badgeStyle.textContent = CSS
      const container = document.createElement('form')
      container.id = 'badge-form'

      document.head.append(badgeStyle)
      document.body.append(container)


      function __copyBadgeMd () {
          const form = document.querySelector('#badge-form')
          const fd = new FormData(form)
          const label = fd.get('badge-label')
          const title = fd.get('badge-title')
          const link = fd.get('badge-link')
          const color = fd.get('badge-color')
          const shieldsLink = `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(title)}-${encodeURIComponent(color)}`
      navigator.clipboard.writeText(`[![](${shieldsLink})](${link})`)
        const originText = this.innerHTML
        this.innerHTML = COPID_HTML
        setTimeout(() => {
            this.innerHTML = originText
        }, 2000)
    }

      function __reset () {
          container.innerHTML = MAIN_HTML
          container.onclick = null
          const INITIAL_WIDTH = `${container.offsetWidth}px`
        const INITIAL_HEIGHT = `${container.offsetHeight}px`
        container.classList.remove()
        container.removeEventListener('click', __reset)
        document.querySelector('#badge-form-copy-btn').onclick = __copyBadgeMd
        document.querySelector('#badge-form .badge-form--close-icon').onclick = function () {
            container.animate(
                [
                    { width: INITIAL_WIDTH, height: INITIAL_HEIGHT },
                    { width: '48px', height: '48px', borderRadius: '50%', opacity: 0.3 }
                ],
                {
                    duration: 300,
                    iterations: 1,
                }
            )
            container.classList.add('badge-form--animating')
            container.innerHTML = ''
            Promise.all(
                container.getAnimations().map(animation => animation.finished)
            ).then(() => {
                container.innerHTML = RESTORE_ICON_HTML
                container.classList.remove('badge-form--animating')
                container.classList.add('badge-form--animated')

                container.onclick = () => {
                    container.animate(
                        [
                            { width: '48px', height: '48px', borderRadius: '50%' },
                            { width: INITIAL_WIDTH, height: INITIAL_HEIGHT, borderRadius: '4px', opacity: 0.3 },
                        ],
                        {
                            duration: 300,
                            iterations: 1,
                        }
                    )
                    container.classList.add('badge-form--animating')
                    container.innerHTML = ''

                    Promise.all(
                        container.getAnimations().map(animation => animation.finished)
                    ).then(() => {
                        container.classList.remove('badge-form--animating')
                        container.classList.remove('badge-form--animated')
                        __reset()
                    })
                }
            })
        }
    }

      __reset()
  }

    function removeBadgeForm () {
        const form = document.querySelector('#badge-form')
        if(form) {
            form.remove()
        }
    }


    function reset () {
        if (ROUTE_MATHER.test(location.href)) {
            addBadgeForm()
        } else {
            removeBadgeForm()
        }
    }

    // For SPA route change
    const originPushState = history.pushState
    history.pushState = (...args) => {
        requestAnimationFrame(reset)
        return originPushState(...args)
    }

    reset()
})();
