define([
	
], function(){
	var routines = [
		// 'pagination.gotoPage': {
		{
			forced: ['pagination', 'paginationBar'],
			mod: 'pagination',
			func: 'gotoPage',
			parameter: function(){
				var c = this.pagination.pageCount();
				return Math.floor(Math.random()*100) % c;
			}
		},
		{
			forced: ['pagination', 'paginationBar'],
			mod: 'pagination',
			func: 'setPageSize',
			parameter: function(){
				var c = this.pagination.pageCount();
				return Math.floor(Math.random()*100);
			}
		},		
		{
			forced: ['vScroller'],
			mod: 'vScroller',
			func: 'scrollToRow',
			deferred: true,
			parameter: function(){
				var c = this.view.visualCount;
				return Math.floor(Math.random()*100) % c;
			}
		},
		{
			forced: ['vScroller'],
			mod: '',
			func: 'scrollToRow',
			parameter: function(){
				var c = this.view.visualCount;
				return Math.floor(Math.random()*100) % c;
			}
		}		
	];
	
	return {
		routines: routines
	};
});
