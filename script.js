function heuristic(start, end, h) {
	if (h == 1) {
		var tiles_out = 0
		for (var i = 0; i < start.length; i++) {
			if (start[i] != end[i] && start[i] !== '0') tiles_out++
		}
		return tiles_out
	} else if (h == 2) {
		var man = 0
		for (var i = 0; i < start.length; i++) {
			if (start.substring(i, i + 1) !== '0')
				man += Math.abs(i - end.indexOf(start.substring(i, i + 1)))
		}
		return man
	}
}
function successors(n, e, h) {
	var suc = []
	for (var i = 0; i < n[0].length - 1; i++) {
		let tmp = n[0].substring(i, i + 1)
		let child = n[0].substring(0, i) + n[0].substring(i + 1, i + 2) + tmp + n[0].substring(i + 2)
		suc.push([child, heuristic(child, e, h), inc()])
	}
	return suc
}

function move(text, position, dir) {
	switch (dir) {
		case 'l':
			return text.substring(0, position - 1) + '0' + text.substring(position - 1, position) + text.substring(position + 1);
		case 'u':
			return text.substring(0, position - 3) + '0' + text.substring(position - 2, position) + text.substring(position - 3, position - 2) + text.substring(position + 1)
		case 'r':
			return text.substring(0, position) + text.substring(position + 1, position + 2) + '0' + text.substring(position + 2);
		case 'd':
			return text.substring(0, position) + text.substring(position + 3, position + 4) + text.substring(position + 1, position + 3) + '0' + text.substring(position + 4);
	}
	return text;
}

function Beamsuccessors(n, e, h) {
	var suc = [];
	let text = n[0];
	let result = '';
	let position = text.search('0'); //usar ceros para los espacios vacios

	switch (position) {
		case 0:
			//rigth
			result = move(text, position, 'd')
			suc.push([result, heuristic(result, e, h), inc()]);
			result = move(text, position, 'r')
			suc.push([result, heuristic(result, e, h), inc()]);
			break;
		case 1:
			//left
			result = move(text, position, 'l');
			suc.push([result, heuristic(result, e, h), inc()]);
			//down
			result = move(text, position, 'd')
			suc.push([result, heuristic(result, e, h), inc()]);
			//rigth
			result = move(text, position, 'r')
			suc.push([result, heuristic(result, e, h), inc()]);
			break;
		case 2:
			result = move(text, position, 'l');
			suc.push([result, heuristic(result, e, h), inc()]);

			result = move(text, position, 'd')
			suc.push([result, heuristic(result, e, h), inc()]);

			break;
		case 3:
			result = move(text, position, 'd')
			suc.push([result, heuristic(result, e, h), inc()]);

			result = move(text, position, 'r')
			suc.push([result, heuristic(result, e, h), inc()]);
			result = move(text, position, 'u')
			suc.push([result, heuristic(result, e, h), inc()]);
			break;
		case 4:
			result = move(text, position, 'l');
			suc.push([result, heuristic(result, e, h), inc()]);
			result = move(text, position, 'd')
			suc.push([result, heuristic(result, e, h), inc()]);
			result = move(text, position, 'r')
			suc.push([result, heuristic(result, e, h), inc()]);
			result = move(text, position, 'u')
			suc.push([result, heuristic(result, e, h), inc()]);
			break;
		case 5:
			result = move(text, position, 'l');
			suc.push([result, heuristic(result, e, h), inc()]);
			result = move(text, position, 'd')
			suc.push([result, heuristic(result, e, h), inc()]);
			result = move(text, position, 'u')
			suc.push([result, heuristic(result, e, h), inc()]);
			break;
		case 6:
			result = move(text, position, 'r')
			suc.push([result, heuristic(result, e, h), inc()]);
			result = move(text, position, 'u')
			suc.push([result, heuristic(result, e, h), inc()]);
			break;
		case 7:
			result = move(text, position, 'l');
			suc.push([result, heuristic(result, e, h), inc()]);
			result = move(text, position, 'r')
			suc.push([result, heuristic(result, e, h), inc()]);
			result = move(text, position, 'u')
			suc.push([result, heuristic(result, e, h), inc()]);
			break;
		case 8:
			result = move(text, position, 'l');
			suc.push([result, heuristic(result, e, h), inc()]);
			result = move(text, position, 'u')
			suc.push([result, heuristic(result, e, h), inc()]);
			break;
	}
	suc = suc.sort((a, b) => a[1] - b[1])
	return [suc[0], suc[1]]
}

function Beam2(start, end, h) {
	var cont = 0
	var dot = '{'
	var list = [[start, heuristic(start, end, h), inc()]];
	dot += list[0][2] + ' [label="' + list[0][0] + '"];'
	while (list.length > 0) {
		var current = list.shift();
		if (current[0] == end) {
			dot += '}'
			return dot
		}
		var temp = Beamsuccessors(current, end, h);
		temp.forEach(val => dot += val[2] + ' [label="' + val[0] + '"];' + current[2] + '--' + val[2] + ' [label="' + val[1] + '"] ;')
		list = list.concat(temp);
		list = list.sort(function (a, b) { return a[1] - b[1] });
		cont++
		if (cont > 100) {
			alert("La cantidad hizo que se enciclara")
			dot += '}'
			return dot
		}
	}
	dot += '}'
	return dot
}
var id = 1
function inc() {
	return id++
}
function puzzle(nodes) {
	if (nodes == null || nodes == '') nodes = '023156478-2';
	nodes = nodes.split('-')
	return Beam2(nodes[0], '123456780', nodes[1])
}