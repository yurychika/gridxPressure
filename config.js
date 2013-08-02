define([
	'dojo/_base/query',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/data/TestData',
	'gridx/allModules'
], function(query, Memory, dataSource, allMods){

/**
 *
 *	pressure test case structure
 *	{
 * 	
 * 		
 *		mod: 'pagination',			//string:
 *									//		the name of the module where functions will be called on
 *									//		if is '', means functions will be called on gridx
 * 		func: 'gotoPage',			//string:
 * 									//		the name of the function that will be called
 * 									//function:
 * 									//		the self-defined function to be called
 * 		parameter: function()		//function:
 * 		{		
 * 			return [];				//		return the parameter that will be applied to the func
 * 		}	
 * 		deferred: true || false		//bool:
 * 									//		indicate if the test case if an async process,
 * 									//		also means that the func will return a deferred object
 * 		needRecreate: true || fasle	//bool:
 * 									//		indicate if the test case will need to create a new gridx
 * 									//		everytime it runs
 * 
 *	}
 *  
 */
	var smallMemoryStore = new Memory({
			dataSource: dataSource,
			size: 100			
		}),
		mediumMemoryStore = new Memory({
			dataSource: dataSource,
			size: 10000			
		}),
		largeMemoryStore = new Memory({
			dataSource: dataSource,
			size: 50000		
		});	
		
	
	
	var routines = [
		// ============================ pagination ============================
		{
			config: {
				modules: [allMods.Pagination, allMods.PaginationBar],
				store: smallMemoryStore
			},
			mod: 'pagination',
			func: 'gotoPage',
			parameter: function(){
				var c = this.pagination.pageCount();
				return [Math.floor(Math.random()*100) % c];
			}
		},
		{
			config: {
				modules: [allMods.Pagination, allMods.PaginationBar],
				store: smallMemoryStore
			},		
			mod: 'pagination',
			func: 'setPageSize',
			parameter: function(){
				var c = this.pagination.pageCount();
				return [Math.floor(Math.random()*100)];
			}
		},		
		{
			config: {
				modules: [allMods.VirtualVScroller],
				store: mediumMemoryStore
			},		
			mod: 'vScroller',
			func: 'scrollToRow',
			deferred: true,
			parameter: function(){
				var c = this.view.visualCount;
				return [Math.floor(Math.random() * c)];
			}
		},
		{
			mod: '',
			func: 'resize',
			parameter: function(){
				var h = Math.floor(Math.random() * 800);
				var w = Math.floor(Math.random() * 800);
				return [{h: h, w: w}];
			}
		},
		{
			mod: '',
			func: 'setStore',
			parameter: function(){
				var count = Math.floor(Math.random() * 10000);
				var store = new Memory({
					dataSource: dataSource,
					size: count				
				});
				return [store];
			}
		},
		{
			mod: '',
			func: 'setColumns',
			parameter: function(){
				var count = dataSource.layouts.length;
				var columns =dataSource.layouts[Math.floor(Math.random() * count)];
				return [columns];
			}
		},
		{
			mod: 'body',
			// deferred: true,
			func: 'refresh',
			parameter: function(){
				var c = this.view.visualCount;
				return [Math.floor(Math.random()*100) % c];
			}
		},
		{
			config: {
				modules: [allMods.Pagination, allMods.PaginationBar],
				store: smallMemoryStore
			},			
			mod: 'paginationBar',
			func: 'refresh',
			parameter: function(){
				return [];
				// var c = this.view.visualCount;
				// return [Math.floor(Math.random()*100) % c];
			}
		},
		{
			config: {
				modules: [allMods.SingleSort],
				store: smallMemoryStore
			},				
			mod: 'sort',
			// deferred: true,
			func: 'sort',
			parameter: function(){
				var colId = grid._columns[Math.floor(Math.random() * grid._columns.length)].id;
				var isDescending = new Date().getTime() % 2;
				console.log(colId, isDescending);
				return [colId, isDescending];
			}
		},
		// ============================ select.row ===============================
		{
			config: {
				modules: [	allMods.ExtendedSelectRow, 
							allMods.RowHeader, 
							allMods.IndirectSelect, 
							allMods.SummaryBar,
							allMods.VirtualVScroller],
			},				
			mod: 'select.row',
			func: 'selectById',
			parameter: function(){
				var count = grid.model.size();
				var rowId = Math.floor(Math.random() * count);
				return [rowId];
			}
		},
		{
			config: {
				modules: [	allMods.ExtendedSelectRow, 
							allMods.RowHeader, 
							allMods.IndirectSelect, 
							allMods.SummaryBar,
							allMods.VirtualVScroller],
			},				
			mod: 'select.row',
			func: 'deselectById',
			before: function(){
				var count = grid.model.size();
				var rowId = Math.floor(Math.random() * count);
				rowId = 2;
				this.select.row.selectById(rowId);
				this._tempt = rowId;
			
			},
			parameter: function(){
				var _t = this._tempt;
				delete this._tempt;
				return [_t];
			}
		},				
		{
			config: {
				modules: [	allMods.ExtendedSelectRow, 
							allMods.RowHeader, 
							allMods.IndirectSelect, 
							allMods.SummaryBar,
							allMods.VirtualVScroller],
			},				
			mod: 'select.row',
			func: 'selectByIndex',
			parameter: function(){
				var count = this.view.visualCount;
				var index1 = Math.floor(Math.random() * count);
				var index2 = Math.floor(Math.random() * count);
				return index1 < index2 ? [[index1, index2]] : [[index2, index1]];
			},
			after: function(){
				this.select.row.clear();
			}
		},	
		{
			config: {
				modules: [	allMods.ExtendedSelectRow, 
							allMods.RowHeader, 
							allMods.IndirectSelect, 
							allMods.SummaryBar,
							allMods.VirtualVScroller],
			},				
			mod: 'select.row',
			func: 'deselectByIndex',
			before: function(){
				var count = this.view.visualCount;
				var index1 = Math.floor(Math.random() * count);
				var index2 = Math.floor(Math.random() * count);				
				this._tempt = index1 < index2 ? [[index1, index2]] : [[index2, index1]]; 
				return this._tempt;
			},
			parameter: function(){
				return [this._tempt];
			},
			after: function(){
				delete this._tempt;
			}
		},	
		
		//======================= filter bar ===========================			
		{
			mod: 'filterBar',
			// needRecreate: true,
			func: 'showFilterDialog',
			parameter: function(){
				return [];
			},
			after: function(){
				this.filterBar._filterDialog.hide();
			},
			timeout: 700
		},
		{
			mod: 'filterBar',
			func: 'refresh',
			parameter: function(){
				console.log('filter bar refersh');
				return [];
			}
		},	
		{
			mod: 'filterBar',
			func: 'show',
			parameter: function(){
				return [];
			},
			after: function(){
				this.filterBar.hide();
			}
		},		
		{
			mod: 'filterBar',
			func: 'hide',
			before: function(){
				this.filterBar.show();
			},
			parameter: function(){
				return [];
			}
		},
		//==================== pagination ===========================				
		{
			mod: '',		//if mod is empty, will be replaced by the grid object
			description: 'gotoBtn._showGotoDialog',
			func: function(){
				var gotoBtn = dijit.byNode(dojo.query('.gridxPagerGotoBtn', this.domNode)[0]);
				if(gotoBtn){
					gotoBtn._showGotoDialog();
				}
			},
			parameter: function(){
				return [];
			},
			after: function(){
				var gotoBtn = dijit.byNode(dojo.query('.gridxPagerGotoBtn', this.domNode)[0]);
				if(gotoBtn){
					gotoBtn._gotoDialog.hide();
				}
			}
		},
		//==================== hiddenColumns ===========================				
		{
			config:{
				modules:[	allMods.HiddenColumns, 
							// allMods.VirtualVScroller
						],
				store: smallMemoryStore
			},
			mod: 'hiddenColumns',		//if mod is empty, will be replaced by the grid object
			func: 'add',
			parameter: function(){
				var count = grid._columns.length;
				var colId = grid._columns[Math.floor(Math.random() * count)];
				return [colId];
			},
			after: function(){
				if(!this._columns.length){
					this.hiddenColumns.clear();
				}
			}
		},	
		//==================== hScroller ===========================		
		{
			mod: 'hScroller',		//if mod is empty, will be replaced by the grid object
			func: 'scrollToColumn',
			parameter: function(){
				var count = grid._columns.length;
				var colId = grid._columns[Math.floor(Math.random() * count)].id;
				return [colId];
			}
		},	
		{
			mod: 'hScroller',		//if mod is empty, will be replaced by the grid object
			func: 'refresh',
			parameter: function(){
				return [];
			}
		},
		//==================== columnLock ===========================				
		{	//21
			config:{
				modules: [allMods.ColumnLock],
				store: smallMemoryStore
			},
			mod: 'columnLock',		//if mod is empty, will be replaced by the grid object
			func: 'lock',
			parameter: function(){
				var count = this._columns.length;
				var lockCount = Math.ceil(Math.random() * count / 2);
				return [lockCount];		
			}
		},
		{
			config:{
				modules: [allMods.ColumnLock],
				store: smallMemoryStore
			},
			before: function(){
				var count = this._columns.length;
				var lockCount = Math.ceil(Math.random() * count / 2);
				this.columnLock.lock(lockCount);
			},
			mod: 'columnLock',		//if mod is empty, will be replaced by the grid object
			func: 'unlock',
			parameter: function(){
				return [];
			}
		},		
		{
			config:{
				modules: [allMods.ColumnResizer],
				store: smallMemoryStore
			},
			mod: 'columnResizer',		//if mod is empty, will be replaced by the grid object
			func: 'setWidth',
			parameter: function(){
				var count = this._columns.length;
				var colId = this._columns[Math.floor(Math.random() * count)].id;
				var width = Math.floor(Math.random() * 140 + 60);
				return [colId, width];
			}
		},												
	];
	
	return {
		routines: routines
	};
});
