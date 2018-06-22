'use strict';

var PT = {
	isBlushDark:     function (h,s,v) { return (h > 280 || h < 30) && s < .6 && s > .2 && v > .5; },
	renderedOutline: function (h,s,v) { return [h, s, .625 * v]; },
	computedOutline: function (h,s,v) { return [h, Math.min(1.3 * s, 1), .7 * v]; },
	shadow:          function (h,s,v) { return [h, s, .8 * v]; },
	outlineToRender: function (h,s,v) { return [h, s, Math.min(v/.625, 1)]; }
};

function $m (condition) {
	return condition ? 'addClass' : 'removeClass';
}

function l (chr) {
	if (typeof chr == 'string') chr = chroma(chr);
	return 1 - (0.299 * (chr = chr.rgb())[0] + 0.587 * chr[1] + 0.114 * chr[2])/255 < .5;
}

function initColorPreview (a) {
	return $(a).each(function (i,el) { (el = $(el)).css('background', (el = chroma(el.text())).hex())[$m(!l(el))]('dark'); });
}
function renderColorPreview (selector, chr) {
	if (typeof chr == 'string') chr = chroma(chr);
	return $(selector).css('background', selector = chr.hex()).text(selector.substr(1))[$m(!l(chr))]('dark');
}

initColorPreview('[id^="blush-"]');
new Clipboard('code.color', { target: trigger => trigger }).on('success', function (e) {
	let el = $(e.trigger);
	el.addClass('copied');
	setTimeout(() => el.removeClass('copied'), 1500);
});

var CP = {
	coat: new ColorWheel(function (state) {
		if (state == 1) $('#coatColor').val(chroma.hsv(...this.HSV).name()).trigger('input');
	}, 200),
	grad: new ColorWheel(function (state) {
		if (state == 1) $(CP.gradCur).val(chroma.hsv(...this.HSV).name()).trigger('input', [false, true]);
	}, 200),
	gradCur: '#none'
};
$('#cp-coat').append(CP.coat.canvas);
$('#cp-grad').append(CP.grad.canvas);

$('#coatColor').on('input', function (e, first) {
	try {
		let chr = chroma(this.value),
		hsv = chr.hsv(),
		
		compOut = PT.computedOutline(...hsv),
		shadow  = PT.shadow(...hsv),
		noOut   = PT.outlineToRender(...hsv),
		asShad  = PT.outlineToRender(...shadow);
		
		$(this).css('background', chr.hex())[$m(!l(chr))]('dark');
		
		if (!e.isTrigger || first) CP.coat.setHSV(...hsv);
		
		$('[id^="blush-"]').removeClass('current');
		$('#blush-' + (PT.isBlushDark(...hsv) ? 'dark' : 'light')).addClass('current');
		renderColorPreview('#rendered-outline', chroma.hsv(...PT.renderedOutline(...hsv)));
		renderColorPreview('#rendered-computed-outline', chroma.hsv(...PT.renderedOutline(...compOut)));
		renderColorPreview('#computed-outline', chroma.hsv(...compOut));
		renderColorPreview('#shadow', chroma.hsv(...shadow));
		renderColorPreview('#no-outline', chroma.hsv(...noOut));
		renderColorPreview('#shadow-outline', chroma.hsv(...asShad));
		$('#no-outline-warning')[$m(hsv[2] == PT.renderedOutline(...noOut)[2])]('hidden');
		$('#shadow-outline-warning')[$m(shadow[2] == PT.renderedOutline(...asShad)[2])]('hidden');
	} catch (e) {}
}).trigger('input', [true]);

let $grads = {
	base:   $('#grad-base'),
	noOut:  $('#grad-noOut'),
	shadow: $('#grad-shade'),
	all:    $('[id^="grad-"]')
};
function genGrad () {
	let
	grad   = [],
	middle = $('#gradMiddle').val();
	
	grad.push($('#gradStart').val());
	if (middle) grad.push(middle);
	grad.push($('#gradEnd').val());
	
	try {
		genPalette(chroma.scale(grad).mode($('#gradMode').val().toLowerCase()).colors(+$('#gradCount').val()));
	} catch (e) {}
}
function genGradPiece (chr, hsvToDisplay, computedHSV) {
	let elem = renderColorPreview($('<code>').addClass('color').css('background',chr),chr);
	if (hsvToDisplay && computedHSV && hsvToDisplay[2] != PT.renderedOutline(...computedHSV)[2]) elem.addClass('wrong');
	return elem;
}
function genPalette (colors = []) {
	$grads.all.empty();
	colors = colors.map(hex => chroma(hex));
	colors.forEach(chr => $grads.base.append(genGradPiece(chr)));
	
	let
	noOuts = colors.map(chr => PT.outlineToRender(...chr.hsv())),
	shadows = colors.map(chr => PT.shadow(...chr.hsv()));
	
	noOuts
		.map(hsv => chroma.hsv(hsv))
		.forEach((chr, index) => $grads.noOut.append(genGradPiece(chr, colors[index].hsv(), noOuts[index])));
	shadows
		.map(hsv => PT.outlineToRender(...hsv))
		.forEach((hsv, index) => $grads.shadow.append(genGradPiece(chroma.hsv(hsv), shadows[index], hsv)));
}

$('#gradCount').on('input', function (e, first) {
	$('#gradCountPrev').text(this.value);
	if (!first) genGrad();
}).trigger('input', [true]);
$('#gradMode').change(genGrad);
$('#gradStart, #gradMiddle, #gradEnd').on('input', function (e, first, fromWheel) {
	try {
		let chr = chroma(this.value);
		renderColorPreview('#' + this.id, chr);
		if ('#' + this.id == CP.gradCur && !fromWheel) CP.grad.setHSV(...chr.hsv());
	}
	catch (e) { if (this.id == 'gradMiddle') this.style.background = ''; }
	if (!first) genGrad();
}).on('focus', function () {
	CP.gradCur = '#' + this.id;
	try {
		CP.grad.setHSV(...chroma(this.value).hsv());
	} catch (e) {}
}).trigger('input', [true]);
genGrad();


function initLang (hash, first) {
	let lang = hash || location.hash.toLowerCase();
	lang = lang == '#ru' ? 'ru' : lang != '#' ? 'en' : localStorage.getItem('language');
	if (lang == 'ru') {
		localStorage.setItem('language', 'ru');
		$('body').addClass('ru');
		$('#color-calc').text('Вычисления цвета');
		$('#cp-coat').attr('placeholder', 'Цвет (имя или HEX-код)');
		$('#l-blush').text('Румянец');
		$('#l-render').text('Отрендеренный контур');
		$('#l-computed').text('Вычисленный контур');
		$('#l-shadow').text('Тень');
		$('#l-remove').text('Цвет для удаления контура');
		$('#l-shade').text('Сделать цвет контура цветом тени');
		$('#no-outline-warning, #shadow-outline-warning').text('Не сработает');
		$('#gradienter').text('Генератор градиента');
		$('#l-grad-warn').text('Полупрозрачные цвета не будут работать');
		$('#l-grad-base').text('Оригинал');
		$('#l-grad-noOut').text('Удалить контур');
		$('#l-grad-shade').text('Сделать контур тенью');
		$('#l-grad-count').text('Количество цветов');
		$('#l-grad-mode').text('Режим градиента');
		$('#l-grad-start').text('Начальный цвет');
		$('#l-grad-middle').text('Средний цвет');
		$('#gradMiddle').attr('placeholder', 'Можно оставить пустым');
		$('#l-grad-end').text('Конечный цвет');
		$('#change-lang').attr({
			'href': '#en',
			'title': 'Переключить язык на английский'
		}).text('Change language to english');
	} else if (!first) {
		localStorage.removeItem('language');
		$('body').removeClass('ru');
		$('#color-calc').text('Color calculations');
		$('#cp-coat').attr('placeholder', 'Enter color (name or hex)');
		$('#l-blush').text('Blush');
		$('#l-render').text('Rendered outline');
		$('#l-computed').text('Computed outline');
		$('#l-shadow').text('Shadow');
		$('#l-remove').text('Color for removing outline');
		$('#l-shade').text('Make outline color as shadow color');
		$('#no-outline-warning, #shadow-outline-warning').text('Won\'t work');
		$('#gradienter').text('Gradient generator');
		$('#l-grad-warn').text('Faded colors won\'t work');
		$('#l-grad-base').text('Original');
		$('#l-grad-noOut').text('Remove outline');
		$('#l-grad-shade').text('Make outline as shadow');
		$('#l-grad-count').text('Colors count');
		$('#l-grad-mode').text('Gradient mode');
		$('#l-grad-start').text('Start color');
		$('#l-grad-middle').text('Middle color');
		$('#gradMiddle').attr('placeholder', 'May be kept empty');
		$('#l-grad-end').text('End color');
		$('#change-lang').attr({
			'href': '#ru',
			'title': 'Change language to russian'
		}).text('Переключить язык на русский');
	}
}
$('#change-lang').click(function (e) {
	e.preventDefault();
	location.hash = '';
	initLang(this.getAttribute('href'));
});
initLang(undefined, true);