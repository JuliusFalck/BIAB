

let N = 36;

let n = 4;

let k = n;

let growth = 0.0;

let growth_acumulator = 0.0;

let tree_len = 25.0;

let history = [];

let history_counts = [];

let times = [];

let grid_width = 0;

let grid_height = 0;

let max_N = 1;

let cells = [];

const branch_thickness = 0.2;


const box = document.querySelector('.box');

const tree = document.querySelector('.tree');

const currentLine = document.querySelector('.current-line')

const graph = document.querySelector('.graph');

const TSlider = document.querySelector('.slider');

const ticks = document.querySelector('.ticks');

const NVLabel = document.querySelector('#N-v-label');

const nVLabel = document.querySelector('#n-v-label');

const GVLabel = document.querySelector('#G-v-label');

const kVLabel = document.querySelector('#k-v-label');

const TVLabel = document.querySelector('#t-v-label');

const NTVLabel = document.querySelector('#n-t-v-label');

var slider = document.querySelector(".slider");

var scaled = false;


run();

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
	TVLabel.innerHTML = this.value;
  	set_state(this.value-1);
}


  // add event listener for buttons

  document.querySelector('.run-button').addEventListener('click', event => {
    run();
  });

  document.querySelector('#scaledCheckbox').addEventListener('click', event => {
	scaled = !scaled;
	make_tree();
  })

function set_N(new_N){
	N = new_N
	if (N < 4){
		N = 4
	}
	grid_width = parseInt(Math.sqrt(N))
	grid_height = N/grid_width
}

function run(){
	set_N(NVLabel.value);
	n = nVLabel.value;
	growth = GVLabel.value;
	// reset variables
	history = [];
	history_counts = [];
	times = [];
	k = n;
	max_N = N;
	
	// set labels
	kVLabel.text = toString(n);
	nVLabel.value = n;
	NVLabel.value = N;

	
	
	create_box();

	populate();

	simulate();
	
	set_state(0);


	make_graph();

	slider.value = 1;
	slider.min = 1;
	slider.max = history.length;
	let p = 10;

	// remove ticks
	ticks.replaceChildren();
    // add ticks
	for (let i = 0; i < times.length+1; i++) {
		let new_tick = document.createElement('div');
		new_tick.classList.add('branch');
		ticks.appendChild(new_tick);
		new_tick.style.left = p + 'vw';
		p += 80*times[i]/(history.length);
		new_tick.style.height = '3vh';
	}

}



function create_box(){
	
    // clear box

	box.replaceChildren();

	// add N squares
	cells = [];
	let w = 36/Math.ceil(N/Math.floor(Math.sqrt(N))) + "vw";
	let h = w
	for (let i = 0; i < N; i++) {
		let new_cell = document.createElement('img'); 
		new_cell.classList.add('cell');
		new_cell.src = "square.svg";
		
		new_cell.style.width = w;
		new_cell.style.height = h;
		box.appendChild(new_cell);
		cells.push(new_cell);
	}
}
	
function populate(){
	// set new bug positions
	let empty_squares = Array.from(cells);
	
	for (let i = 0; i < k; i++) {
		let selected = empty_squares[Math.floor(Math.random()*empty_squares.length)];
		
		selected.src = "bug.svg";
		empty_squares.splice(empty_squares.indexOf(selected), 1); 
		
	}

			
	k = 0;
	let state = [];
	cells.forEach((cell)=>{
		if (cell.src.includes("bug.svg")){
			state.push(cells.indexOf(cell));
			k += 1;
		}
	})

	history.push([state, N]);
	history_counts.push(k);
	grow();
	
}


function step(){
	// reset box
	cells.forEach((cell)=>{
		cell.src = "square.svg";
	})
	
	// set new bug positions
	let empty_squares = Array.from(cells);
	for (let i = 0; i < k; i++) {
		let selected = empty_squares[Math.floor(Math.random()*empty_squares.length)];
		selected.src = "bug.svg";
		
	}
		
			
	k = 0;
	let state = [];
	cells.forEach((cell)=>{
		if (cell.src.includes("bug.svg")){
			state.push(cells.indexOf(cell));
			k += 1;
		}
	})
	history.push([state, N]);
	history_counts.push(k);
	
	grow();
}

function grow(){
	if (growth != 0){
		growth_acumulator -= growth;
		if (Math.abs(growth_acumulator) >= 1){
			set_N(parseInt(N) + parseInt(Math.floor(growth_acumulator)));
			
			growth_acumulator -= Math.floor(growth_acumulator);
			create_box();
			if (N > max_N){
				max_N = N;
			}
		}
	}
}


function simulate(){
	while(true) {
		
		step();
		if (k === 1){
			break;
		}
	}
	read_times();
	make_tree();
}

function read_times(){
	for (let i = n; i > 1; i--) {
		times.push(count(history_counts, i));
	}
}


function set_state(t){
	set_N(history[t][1]); 
	create_box();
	history[t][0].forEach((i)=>{
		cells[i].src = "bug.svg";
		
	})
	if (scaled){
		currentLine.style.bottom = tree_len * t/(history.length) + 5 + "vw";
	}
	else{
		currentLine.style.bottom = tree_len * t/100 + 5 + "vw";
	}
	
	kVLabel.innerHTML = history_counts[t];
	TVLabel.innerHTML = t+1 + "/" + history.length;
	NTVLabel.innerHTML = N;
}


function make_tree(){
	tree.replaceChildren();
	let h = 5;
	let w = times.length;
	let pos = [];
	let pos1 = [];
	for (let i = 0; i < w; i++) {
		pos = pos1;
		pos1 = [];
		for (let j = 0; j < w-i+1; j++){
			let new_branch = document.createElement('div'); 
			new_branch.classList.add('branch');
			tree.appendChild(new_branch);
			let p = 30 *j/w + 60;
			if (i > 0){
				if (j == 0){
					p = (pos[0] + pos[1])/2.0;
					// side branch
					let side_branch = document.createElement('div');
					side_branch.classList.add('branch');
					tree.appendChild(side_branch);
					side_branch.style.bottom = h + 'vw';
					side_branch.style.left = pos[0] + 'vw';
					side_branch.style.width = pos[1]-pos[0]+branch_thickness + 'vw';
				}
				else{
					p = pos[j+1];
				}
			}
			new_branch.style.left = p + 'vw';
			new_branch.style.bottom = h + 'vw';
			pos1.push(p)
			tf = times[i]/100;
			if (scaled){
				tf = times[i]/history.length;
			}
			new_branch.style.height = tree_len * tf + 'vw';
		}
		tf = times[i]/100;
			if (scaled){
				tf = times[i]/history.length;
			}	
		h += tree_len*tf;


	}
	let side_branch = document.createElement('div');
	side_branch.classList.add('branch');
	tree.appendChild(side_branch);
	side_branch.style.bottom = h + 'vw';
	side_branch.style.left = pos1[0] + 'vw';
	side_branch.style.width = pos1[1]-pos1[0]+branch_thickness + 'vw';
	
	//add root
	let root = document.createElement('div');
	root.classList.add('branch');
	tree.appendChild(root);
	root.style.left = pos[0]+(pos[1]-pos[0]) + 'vw';
	root.style.bottom = h + 'vw';
	root.style.height = '2vw';

}

function make_graph(){
	let polygon = "0," + 0.1 * window.innerHeight + " ";
	let p = 0;
	for (let i = 0; i < history.length; i++) {
		polygon += p + ", " + ( (1-history[i][1]/max_N) * window.innerHeight * 0.06) + " ";
		p = window.innerWidth * 0.8 * i/(history.length);
		
	}
	p = window.innerWidth * 0.8;
	console.log(history[history.length-1][1]);
	polygon += p + ", " + ( (1-history[history.length-1][1]/max_N) * window.innerHeight * 0.06) + " ";
	polygon += p  + ", " + 0.1 * window.innerHeight + " ";
	graph.setAttribute("points", polygon);
}


function sum(a){
	let s = 0;
	a.forEach((i)=>{
		s += i;
	})
		
	return s;

}

function count(arr, element){
	return arr.filter((ele) => ele == element).length;
}