require([
	'dojo/on',
	'dojo/dom',
	'dojo/_base/lang',
	'dojo/_base/array',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'gridx/Grid',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/data/TestData',
	'dojo/_base/Deferred',
	'./config.js'			
], function(on, dom, lang, array, cache, modules, Grid, Memory, dataSource, Deferred, config){
	var _interval;
	var _pause = false;
	var _next;
	var _routine;
	var consoleNode = document.getElementById('console');
	var _mode  = 'single';
	var _startIndex = 18;
	
	on(document.getElementById('startButton'), 'click', function(){
		// _pause = false;
		start();
	});
	
	on(document.getElementById('stopButton'), 'click', function(){
		stop();
	});
	
	on(document.getElementById('pauseButton'), 'click', function(){
		togglePause();
	});

	on(document.getElementById('nextButton'), 'click', function(){
		nextRoutine();
	});

	var jsonMemoryStore = new Memory({
		dataSource: dataSource,
		size: 1000			
	});
	
	var columns = [
		{id: 'id', field: 'id', name: 'Identity', width: 'auto', dataType: 'number', decorator: function(cellData){
			return parseInt(cellData, 10) + 'name';
		}},
		{id: 'number', field: 'number', name: 'Number', width: 'auto', dataType: 'number'},
		{id: 'string', field: 'string', name: 'String', width: 'auto', dataType: 'string'},
		{id: 'date', field: 'date', name: 'Date', width: 'auto', dataType: 'date'},
		{id: 'time', field: 'time', name: 'Time', width: 'auto', dataType: 'time'},
		{id: 'bool', field: 'bool', name: 'Boolean', dataType: 'boolean'}
	];	
	
	var createGrid = function(config){
		var d = new Deferred();
		var dc = {			//default config
			cacheClass: cache,
			store: jsonMemoryStore,
			structure: columns,
			modules: [
				'gridx/modules/Pagination',
				'gridx/modules/pagination/PaginationBar',
				'gridx/modules/VirtualVScroller',
				'gridx/modules/RowHeader',
				'gridx/modules/SingleSort',
				'gridx/modules/extendedSelect/Row',
				'gridx/modules/IndirectSelect',
				'gridx/modules/Filter',
				'gridx/modules/filter/FilterBar'
			],
			paginationInitialPageSize: 10
		};

		if(config) dc = lang.mixin(dc, config);
		
		grid = new Grid(dc);
		grid.connect(grid, 'onModulesLoaded', function(){
			d.callback();
		});
		grid.placeAt('gridContainer');
		grid.startup();
		return d;
	
	};
	
	
	//	buttons related functions
	var stop = function(){
		if(_interval){
			console.log(clearInterval(_interval)); 
		}
		if(_routine){ 
			_routine = undefined; 
		}
	};
	
	var togglePause = function(){
		_pause = !_pause;
	};
	
	var runCase = function(routine){
		var r = routine;
		if(r.needRecreate){		//some pressure test case may need to destroy the grid to see
								//if all the resources have been destroyed
			grid.destroy();
			createGrid();
		}	
		var mod = _getMod(r.mod),
			func = typeof r.func == 'string' ? mod[r.func] : r.func;
		if(!_pause){
			if(r.before && typeof r.before == 'function'){
				r.before.apply(grid, []);
			}
			func.apply(mod, r.parameter.apply(grid, [])); 
			
			if(r.after && typeof r.after == 'function'){
				setTimeout(function(){
					r.after.apply(grid, []);
				}, 200);
			}
			// _log(r);
		}
	};
	
	
	var runSingle, 
		nextRoutine;
	nextRoutine = function(){
		_routine = config.routines.shift();
		
		grid.destroy();
		createGrid(_routine.config);
		
		_log(_routine);
		return _routine;
	};
	
	runSingle = function(){
		// stop();
		config.routines = config.routines.slice(_startIndex);
		var routines = config.routines.slice(_startIndex);
		_routine = _routine? _routine : nextRoutine();
		
		if(_routine){
			var t = _routine.timeout? _routine.timeout : 200;
			_interval = setInterval(function(){
				runCase(_routine);
			}, t);
		}
		
	};
	
	var runChaos = function(){
		var routines = config.routines;
		
		function nextRoutine(){
			var index = Math.floor(Math.random() * routines.length);
			return routines[index];
		}		
		setInterval(function(){
			var r = nextRoutine();
			runCase(r);
			_log(r);
		}, 300);
	};
	
	var run = function(){
		var routines = config.routines;
		if(_mode == 'single'){
			runSingle();
		}else{
			runChaos();
		}
	};
	
	var start = function(){
		var select = document.getElementById('mode');
		_mode = select.value;
		console.log('mode is:', _mode);
		run();
	};
	
	function _getMod(mod){
		if(!mod){
			return grid;
		}
		var paths = mod.split('.');

		mod = grid;
		array.forEach(paths, function(path){
			mod = mod[path]? mod[path]: mod;
		});
		return mod;
	}
	
	function _log(r){
		var msg;
		if(r.description){
			msg = r.description;
		}else{
			msg = (r.mod? r.mod : 'grid') + '.' + (typeof r.func == 'string'? r.func : '');
		}
		var msgNode = "<div><p>" + msg + "</p></div>";
		consoleNode.innerHTML += msgNode;		
	}
	
	createGrid();
	
	
	// setInterval(function(){
		// setTimeout(function(){
			// grid.destroy();
		// }, 500);
	// }, 1000);
	
	
});
