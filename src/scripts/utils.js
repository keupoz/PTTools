import chroma from 'chroma-js'

function hsv2hex (hsv) {
	return chroma.hsv.apply(chroma, hsv).hex();
}

function prepareToRender (hsv) {
	return [ hsv[0], hsv[1], Math.min(hsv[2] / 0.625, 1) ];
}

function renderOutline (hsv) {
	return [ hsv[0], hsv[1], 0.625 * hsv[2] ];
}


function computeOutline (hsv) {
	return [ hsv[0], Math.min(1.3 * hsv[1], 1), 0.7 * hsv[2] ];
}

function shadow (hsv) {
	return [ hsv[0], hsv[1], 0.8 * hsv[2] ];
}

function check (toRender, original) {
	return renderOutline(toRender).every((c,i) => c == original[i]);
}

export { hsv2hex, prepareToRender, renderOutline, computeOutline, shadow, check }
