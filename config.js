define([
	'gridx/tests/support/stores/Memory',
	'gridx/tests/support/data/TestData'
], function(Memory, dataSource){
	var routines = [
		// 'pagination.gotoPage': {
		// {
			// forced: ['pagination', 'paginationBar'],
			// mod: 'pagination',
			// func: 'gotoPage',
			// parameter: function(){
				// var c = this.pagination.pageCount();
				// return Math.floor(Math.random()*100) % c;
			// }
		// },
		// {
			// forced: ['pagination', 'paginationBar'],
			// mod: 'pagination',
			// func: 'setPageSize',
			// parameter: function(){
				// var c = this.pagination.pageCount();
				// return Math.floor(Math.random()*100);
			// }
		// },		
		// {
			// forced: ['vScroller'],
			// mod: 'vScroller',
			// func: 'scrollToRow',
			// deferred: true,
			// parameter: function(){
				// var c = this.view.visualCount;
				// return Math.floor(Math.random()*100) % c;
			// }
		// },
		{
			forced: [],
			mod: '',
			func: 'resize',
			parameter: function(){
				var h = Math.floor(Math.random() * 800);
				var w = Math.floor(Math.random() * 800);
				return {h: h, w: w};
				//return Math.floor(Math.random()*100) % c;
			}
		},
		{
			forced: [],
			mod: '',
			func: 'setStore',
			parameter: function(){
				var count = Math.floor(Math.random() * 500);
				var store = new Memory({
					dataSource: dataSource,
					size: count				
				});
				return store;
			}
		}					
	];
	
	return {
		routines: routines
	};
});
