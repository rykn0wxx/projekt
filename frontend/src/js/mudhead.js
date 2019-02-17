function zrun() {
	if (!window.self.loaded) {
		window.self.loaded = false
	}
	function _run() {
		window.self.loaded = true
	}
	if (document.readyState != 'loading') _run()
	else if (document.addEventListener) document.addEventListener('DOMContentLoaded', _run)
	else
		document.attachEvent('onreadystatechange', function() {
			if (document.readyState == 'complete') _run()
		})
}
class Mudhead {
	constructor() {
		this.afterPageLoadedFunctions = []
		zrun()
	}
	init() {
		let delay = 0
		const _this = this
		if (!window.self.loaded) delay = 100
		setTimeout(_this.runAfterPageLoadedEvents(), delay)
		// setTimeout(() => { _this.runAfterPageLoadedEvents() }, delay);
	}
	addAfterPageLoadedEvent(func) {
		if (window.self.loaded) {
			setTimeout(func, 0)
			return
		}
		this.afterPageLoadedFunctions.push(func)
	}
	runAfterPageLoadedEvents() {
		// console.log('after page loaded starting');
		for (let i = 0; i < this.afterPageLoadedFunctions.length; i++) {
			let f = this.afterPageLoadedFunctions[i]
			f.call()
		}
		// console.log('after page loaded complete, functions called: ' + this.afterPageLoadedFunctions.length);
		this.afterPageLoadedFunctions = []
	}
}

// const mudhead = new Mudhead();

export default new Mudhead()
