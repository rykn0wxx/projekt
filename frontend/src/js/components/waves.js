;(function(root, factory) {
	'use strict'

	if (typeof define === 'function' && define.amd) {
		define([], factory(root))
	} else if (typeof exports === 'object') {
		module.exports = factory(root)
	} else {
		root.Waves = factory(root)
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function(root) {
	'use strict'
	let waves = {}
	const $$ = document.querySelectorAll.bind(document)

	let isWindow = (obj) => {
		return obj !== null && obj === obj.window
	}
	let getWindow = (elem) => {
		return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView
	}
	let offset = (elem) => {
		let box = { top: 0, left: 0 }
		let doc = elem && elem.ownerDocument
		let docElem = doc.documentElement
		let win = getWindow(doc)

		if (typeof elem.getBoundingClientRect !== typeof undefined) {
			box = elem.getBoundingClientRect()
		}
		win = getWindow(doc)
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		}
	}
	let convertStyle = (obj) => {
		let style = ''
		for (var a in obj) {
			if (obj.hasOwnProperty(a)) {
				style += a + ':' + obj[a] + ''
			}
		}
		return style
	}

	let Effect = {
		duration: 750,
		show: (e, element) => {
			if (e.button === 2) {
				return false
			}
			let el = element || this
			let ripple = document.createElement('div')
			ripple.className = 'waves-ripple'
			el.appendChild(ripple)

			let pos = offset(el)
			let relativeY = e.pageY - pos.top
			let relativeX = e.pageX - pos.left
			let scale = 'scale(' + el.clientWidth / 100 * 10 + ')'

			if ('touches' in e) {
				relativeY = e.touches[0].pageY - pos.top
				relativeX = e.touches[0].pageX - pos.left
			}

			ripple.setAttribute('data-hold', Date.now())
			ripple.setAttribute('data-scale', scale)
			ripple.setAttribute('data-x', relativeX)
			ripple.setAttribute('data-y', relativeY)

			let rippleStyle = {
				top: relativeY + 'px',
				left: relativeX + 'px'
			}

			ripple.className = ripple.className + ' waves-notransition'
			ripple.setAttribute('style', convertStyle(rippleStyle))
			ripple.className = ripple.className.replace('waves-notransition', '')

			rippleStyle['-webkit-transform'] = scale
			rippleStyle['-moz-transform'] = scale
			rippleStyle['-ms-transform'] = scale
			rippleStyle['-o-transform'] = scale
			rippleStyle.transform = scale
			rippleStyle.opacity = '1'

			rippleStyle['-webkit-transition-duration'] = Effect.duration + 'ms'
			rippleStyle['-moz-transition-duration'] = Effect.duration + 'ms'
			rippleStyle['-o-transition-duration'] = Effect.duration + 'ms'
			rippleStyle['transition-duration'] = Effect.duration + 'ms'

			rippleStyle['-webkit-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)'
			rippleStyle['-moz-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)'
			rippleStyle['-o-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)'
			rippleStyle['transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)'

			ripple.setAttribute('style', convertStyle(rippleStyle))
		},

		hide: (e) => {
			TouchHandler.touchup(e)
			let el = e.target
			let width = el.clientWidth * 1.4

			let ripple = null
			let ripples = el.getElementsByClassName('waves-ripple')
			if (ripples.length > 0) {
				ripple = ripples[ripples.length - 1]
			} else {
				return false
			}

			let relativeX = ripple.getAttribute('data-x')
			let relativeY = ripple.getAttribute('data-y')
			let scale = ripple.getAttribute('data-scale')

			let diff = Date.now() - Number(ripple.getAttribute('data-hold'))
			let delay = 350 - diff
			if (delay < 0) delay = 0

			setTimeout(() => {
				let style = {
					top: relativeY + 'px',
					left: relativeX + 'px',
					opacity: '0',

					// Duration
					'-webkit-transition-duration': Effect.duration + 'ms',
					'-moz-transition-duration': Effect.duration + 'ms',
					'-o-transition-duration': Effect.duration + 'ms',
					'transition-duration': Effect.duration + 'ms',
					'-webkit-transform': scale,
					'-moz-transform': scale,
					'-ms-transform': scale,
					'-o-transform': scale,
					transform: scale
				}
				ripple.setAttribute('style', convertStyle(style))

				setTimeout(() => {
					try {
						el.removeChild(ripple)
						el.blur()
					} catch (e) {
						return false
					}
				}, Effect.duration)
			}, delay)
		},

		wrapInput: (elements) => {
			for (var a = 0; a < elements.length; a++) {
				let el = elements[a]
				if (el.tagName.toLowerCase() === 'input') {
					let parent = el.parentNode
					if (parent.tagName.toLowerCase() === 'i' && parent.className.indexOf('waves-effect') !== -1) {
						continue
					}
					let wrapper = document.createElement('i')
					wrapper.className = el.className + ' waves-input-wrapper'

					let elementStyle = el.getAttribute('style')
					if (!elementStyle) {
						elementStyle = ''
					}
					wrapper.setAttribute('style', elementStyle)

					el.className = 'waves-button-input'
					el.removeAttribute('style')

					parent.replaceChild(wrapper, el)
					wrapper.appendChild(el)
				}
			}
		}
	}

	let TouchHandler = {
		touches: 0,
		allowEvent: (e) => {
			let allow = true
			if (e.type === 'touchstart') {
				TouchHandler.touches += 1 //push
			} else if (e.type === 'touchend' || e.type === 'touchcancel') {
				setTimeout(() => {
					if (TouchHandler.touches > 0) TouchHandler.touches -= 1
				}, 500)
			} else if (e.type === 'mousedown' && TouchHandler.touches > 0) {
				allow = false
			}
			return allow
		},

		touchup: (e) => {
			TouchHandler.allowEvent(e)
		}
	}

	let getWavesEffectElement = (e) => {
		if (TouchHandler.allowEvent(e) === false) return null
		let element = null
		let target = e.target || e.srcElement
		while (target.parentNode !== null) {
			if (!(target instanceof SVGElement) && target.className.indexOf('waves-effect') !== -1) {
				element = target
				break
			}
			target = target.parentNode
		}

		return element
	}

	let showEffect = (e) => {
		let element = getWavesEffectElement(e)
		if (element !== null) {
			Effect.show(e, element)
			if ('ontouchstart' in window) {
				element.addEventListener('touchend', Effect.hide, false)
				element.addEventListener('touchcancel', Effect.hide, false)
			}
			element.addEventListener('mouseup', Effect.hide, false)
			element.addEventListener('mouseleave', Effect.hide, false)
			element.addEventListener('dragend', Effect.hide, false)
		}
	}

	waves.displayEffect = (options) => {
		options = options || {}
		if ('duration' in options) Effect.duration = options.duration
		Effect.wrapInput($$('.waves-effect'))

		let btns = document.querySelectorAll('.md-button')

		btns.forEach((btn) => {
			if (!btn.classList.contains('waves-effect')) btn.classList.add('waves-effect')
		})

		if ('ontouchstart' in window) document.body.addEventListener('touchstart', showEffect, false)

		document.body.addEventListener('mousedown', showEffect, false)
	}

	waves.attach = (element) => {
		if (element.tagName.toLowerCase() === 'input') {
			Effect.wrapInput([ element ])
			element = element.parentNode
		}
		if ('ontouchstart' in window) element.addEventListener('touchstart', showEffect, false)

		element.addEventListener('mousedown', showEffect, false)
	}

	if (document.readyState != 'loading') waves.displayEffect()
	else if (document.addEventListener) document.addEventListener('DOMContentLoaded', waves.displayEffect, false)
	else
		document.attachEvent('onreadystatechange', function() {
			if (document.readyState == 'complete') waves.displayEffect()
		})

	// document.addEventListener('DOMContentLoaded', () => {
	// 	waves.displayEffect()
	// }, false)

	// console.log(root.Waves)
	return waves
})
