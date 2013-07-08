define([
	'dojo/_base/query',
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/data/TestData'
], function(query, Memory, dataSource){

	/**
	 *
	 * 	pressure test case structure
	 * {
	 * 		mod: 'pagination',			//string:
	 * 									//		the name of the module where functions will be called on
	 * 									//		if is '', means functions will be called on gridx
	 * 		func: 'gotoPage',			//string:
	 * 									//		the name of the function that will be called
	 * 									//function:
	 * 									//		the self-defined function to be called
	 * 		parameter: function(){		//function:
	 * 			return [];				//		return the parameter that will be applied to the func
	 * 		}	
	 * 		deferred: true || false		//bool:
	 * 									//		indicate if the test case if an async process,
	 * 									//		also means that the func will return a deferred object
	 * 		needRecreate: true || fasle	//bool:
	 * 									//		indicate if the test case will need to create a new gridx
	 * 									//		everytime it runs
	 * 
	 * }
	 *  
	 */
	
	var routines = [
		// {
			// forced: ['pagination', 'paginationBar'],
			// mod: 'pagination',
			// func: 'gotoPage',
			// parameter: function(){
				// var c = this.pagination.pageCount();
				// return [Math.floor(Math.random()*100) % c];
			// }
		// },
		// {
			// forced: ['pagination', 'paginationBar'],
			// mod: 'pagination',
			// func: 'setPageSize',
			// parameter: function(){
				// var c = this.pagination.pageCount();
				// return [Math.floor(Math.random()*100)];
			// }
		// },		
		// {
			// forced: ['vScroller'],
			// mod: 'vScroller',
			// func: 'scrollToRow',
			// deferred: true,
			// parameter: function(){
				// var c = this.view.visualCount;
				// return [Math.floor(Math.random()*100) % c];
			// }
		// },
		// {
			// forced: [],
			// mod: '',
			// func: 'resize',
			// parameter: function(){
				// var h = Math.floor(Math.random() * 800);
				// var w = Math.floor(Math.random() * 800);
				// return [{h: h, w: w}];
			// }
		// },
		// {
			// forced: [],
			// mod: '',
			// func: 'setStore',
			// parameter: function(){
				// var count = Math.floor(Math.random() * 500);
				// var store = new Memory({
					// dataSource: dataSource,
					// size: count				
				// });
				// return [store];
			// }
		// },
		// {
			// forced: [],
			// mod: '',
			// func: 'setColumns',
			// parameter: function(){
				// var count = dataSource.layouts.length;
				// var columns =dataSource.layouts[Math.floor(Math.random() * count)];
				// return [columns];
			// }
		// },
		// {
			// forced: [],
			// mod: 'body',
			// // deferred: true,
			// func: 'refresh',
			// parameter: function(){
				// var c = this.view.visualCount;
				// return [Math.floor(Math.random()*100) % c];
			// }
		// },
		// {
			// forced: [],
			// mod: 'paginationBar',
			// // deferred: true,
			// func: 'refresh',
			// parameter: function(){
				// // var c = this.view.visualCount;
				// // return [Math.floor(Math.random()*100) % c];
			// }
		// },
		// {
			// forced: [],
			// mod: 'sort',
			// // deferred: true,
			// func: 'sort',
			// parameter: function(){
				// var colId = grid._columns[Math.floor(Math.random() * grid._columns.length)].id;
				// var isDescending = new Date().getTime() % 2;
				// console.log(colId, isDescending);
				// return [colId, isDescending];
			// }
		// },
		// {
			// forced: [],
			// mod: 'select.row',
			// // deferred: true,
			// needRecreate: true,
			// func: 'selectById',
			// parameter: function(){
				// var count = grid.model.size();
				// var rowId = Math.floor(Math.random() * count);
				// return [rowId];
			// }
		// },
		{
			forced: [],
			mod: 'select.row',
			// deferred: true,
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
			forced: [],
			mod: 'select.row',
			// deferred: true,
			// needRecreate: true,
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
			forced: [],
			mod: 'select.row',
			// deferred: true,
			// needRecreate: true,
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
		{
			forced: [],
			mod: 'filterBar',
			needRecreate: true,
			func: 'showFilterDialog',
			parameter: function(){
				return [];
			},
			after: function(){
				this.filterBar._filterDialog.hide();
			}
		},
		{
			forced: [],
			mod: 'filterBar',
			func: 'refresh',
			parameter: function(){
				console.log('filter bar refersh');
				return [];
			}
		},		
		{
			forced: [],
			mod: '',		//if mod is empty, will be replaced by the grid object
			needRecreate: true,
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
		}																								
	];
	
	return {
		routines: routines
	};
});
