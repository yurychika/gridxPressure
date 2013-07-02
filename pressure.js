require([
	'dojo/on',
	'dojo/dom',
	'dojo/_base/lang',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'gridx/Grid',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/data/TestData',
	'./config.js'			
], function(on, dom, lang, cache, modules, Grid, Memory, dataSource, config){
	var _interval;
	var _pause = false;
	var _next;
	var _routine;
	
	on(document.getElementById('startButton'), 'click', function(){
		_pause = false;
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
		size: 200				
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
	
	var createGrid = function(){
		grid = new Grid({
			cacheClass: cache,
			store: jsonMemoryStore,
			structure: columns,
			modules: [
				'gridx/modules/Pagination',
				'gridx/modules/pagination/PaginationBar',
				'gridx/modules/VirtualVScroller'
			],
			paginationInitialPageSize: 100
		});
		
		grid.placeAt('gridContainer');
		grid.startup();
	
	};
	
	
	//	buttons related functions
	var stop = function(){
		if(_interval){ console.log(clearInterval(_interval)); }
		if(_routine){ _routine = undefined; }
	};
	
	var togglePause = function(){
		_pause = !_pause;
	};
	
	var nextRoutine = function(){
		stop();
		console.log('routines is: ', config.routines);
		var routines = config.routines,
			r = routines.shift();
			
		if(r){
			var mod = r.mod? grid[r.mod] : grid,
				func = mod[r.func];
				
			if(r.deferred){
				console.log('r deferred is:', r);
				_routine = function(){
					if(!_pause){
						console.log('in not pause');
						func.apply(mod, [r.parameter.apply(grid, [])]).then(function(){
							if(typeof _routine == 'function'){ 
								_routine(); 
							}else{ 
								return; 
							}
						});
					}else{
						setTimeout(function(){
							console.log('in pause');
							_routine();
						}, 500);
					}
				};
				_routine();
			}else{
				_interval = setInterval(function(){
					if(!_pause){ func.apply(mod, [r.parameter.apply(grid, [])]); }
				}, 100);
			}
			
		}
	};
	
	var run = function(){
		var routines = config.routines;
		nextRoutine();
	};
	
	
	createGrid();
	run();
	
	console.log('config is', config);
	
});
