define([
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/data/TestData'
], function(Memory, dataSource){
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
				// return columns;
			// }
		// },
		// {
			// forced: [],
			// mod: 'body',
			// // deferred: true,
			// func: 'refresh',
			// parameter: function(){
				// var c = this.view.visualCount;
				// return [Math.floor(Math.random()*100) % c;]
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
			// func: 'selectById',
			// parameter: function(){
				// var count = grid.model.size();
				// var rowId = Math.floor(Math.random() * count);
				// return [rowId];
			// },
			// callback: function(){
// 				
			// }
		// },
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
			// callback: function(){
// 				
			// }
		}																					
	];
	
	return {
		routines: routines
	};
});
