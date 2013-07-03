require([
	'dojo/on',
	'dojo/dom',
	'dojo/_base/lang',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'gridx/Grid',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/data/TestData',
	'dojo/_base/Deferred',
	'./config.js'			
], function(on, dom, lang, cache, modules, Grid, Memory, dataSource, Deferred, config){
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
		var d = new Deferred();

		grid = new Grid({
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
			paginationInitialPageSize: 100
		});
		grid.connect(grid, 'onModulesLoaded', function(){
			d.callback();
		});
		grid.placeAt('gridContainer');
		grid.startup();
		return d;
	
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
			var needRecreate = r.needRecreate;
				
			if(r.deferred){
				console.log('r deferred is:', r);
				_routine = function(){
					if(!_pause){
						console.log('in not pause');
						func.apply(mod, r.parameter.apply(grid, [])).then(function(){
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
					if(needRecreate){		//some pressure test case may need to destroy the grid to see
											//if all the resources have been destroyed
						grid.destroy();
						createGrid();
					}	
					var mod = r.mod? (r.mod.indexOf('.') >= 0? grid[r.mod.split('.')[0]][r.mod.split('.')[1]] : grid[r.mod]) : grid,
						func = typeof r.func == 'string' ? mod[r.func] : r.func;							
					if(!_pause){
						func.apply(mod, r.parameter.apply(grid, [])); 
	
						if(r.after && typeof r.after == 'function'){
							setTimeout(function(){
								r.after.apply(grid, []);
							}, 100);
						}
					}
				}, 1000);
			}
			
		}
	};
	
	var run = function(){
		var routines = config.routines;
		nextRoutine();
	};
	
	// setInterval(function(){
		// setTimeout(function(){
			// grid.destroy();
		// }, 500);
	// }, 1000);
	createGrid();
	run();
	
	console.log('config is', config);
	
});
