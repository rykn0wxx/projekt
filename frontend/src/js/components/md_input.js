const MdInput = {
	selector: 'body .md-field-input',
	classes: {
		focus: 'md-input-focused',
		invalid: 'md-input-invalid',
		filled: 'md-input-has-value'
	},
	activate: () => {
		const o = MdInput
		const inputElem = $(o.selector)
		inputElem.on('focus blur', (i) => {
			const curElem = i.target
			const fldGroup = $(curElem).parents('.md-field-group')
			fldGroup
				.toggleClass(o.classes.focus, i.type === 'focus')
				.toggleClass(o.classes.filled, !curElem.validity.valueMissing)
				.toggleClass(o.classes.invalid, curElem.required && !curElem.checkValidity() && i.type === 'blur')
		})
	}
}

export default MdInput
