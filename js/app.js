(function (window, Vue,undefined) {

	// 创建数据list
	var list = [
		{
			id: 1,
			content: 'abc',
			isFinish: false
		},
		{
			id: 2,
			content: 'def',
			isFinish: true
		},
		{
			id: 3,
			content: 'dgr',
			isFinish: true
		}
	]
	 

	// 实例化Vue
	new Vue({
		el: '#app',
		data: {
			// 不用服务器所以从缓存中去拿
			dataList: JSON.parse(window.localStorage.getItem('dataList')) || [],
			newTodo:'',
			abc: false,
			beforeUpdate: null,
			activeBtn: 1,
			showArr: []
		},
		methods: {
			// 添加数据
			addTodo (){
				//判断
				if(!this.newTodo.trim()){
					return
				}
				this.dataList.push({
					content: this.newTodo.trim(),
					isFinish: false,
					id: this.dataList.length ?this.dataList.sort((a, b) => a.id - b.id)[this.dataList.length - 1]['id'] + 1 : 1
				})
				this.newTodo = ''
			},
			//删除一个数据
			delTodo (index) {
				this.dataList.splice(index, 1)
			},
			delAll (){
				this.dataList = this.dataList.filter(item => !item.isFinish)
			},
			//添加编辑
			showEdit (index){
				this.$refs.show.forEach(item=>{
					item.classList.remove('editing')
				})
				this.$refs.show[index].classList.add('editing')
				this.beforeUpdate = JSON.parse(JSON.stringify(this.dataList[index]))
			},
			updateTodo(index){
				if (!this.dataList[index].content.trim()){
					this.dataList.splice(index,1)
				}
				if(this.dataList[index].content !== this.beforeUpdate.content){
					this.dataList[index].isFinish = false
				}
				this.$refs.show[index].classList.remove('editing')
				//优化
				this.beforeUpdate = {}
			},
			//还原数据
			backTodo(index){
				this.dataList[index].content=this.beforeUpdate.content
				this.$refs.show[index].classList.remove('editing')
				this.beforeUpdate = {}
			},
			
			// 地址栏变化事件
			hashchange(){
				switch (window.location.hash) {
					case '':
					case '#/':
						this.showAll()
						this.activeBtn = 1	
						break
					case '#/active':
						this.activeAll(false)
						this.activeBtn = 2	
						break	
					case '#/completed':
						this.activeAll(true)
						this.activeBtn = 3	
						break
				}
			},
			showAll(){
				this.showArr = this.dataList.map( () => true)
			},
			activeAll (boo){
				this.showArr = this.dataList.map( item => item.isFinish === boo)
				if (this.dataList.every(item => item.isFinish === !boo)) return window.location.hash = '#/'
			}
		},
		// 监听，当数组的数据变化就存回去
		watch: {
			dataList: {
				handler (newArr) {
					window.localStorage.setItem('dataList', JSON.stringify(newArr))
					this.hashchange()
				},
				//深度监听
				deep: true
			}
			
		},
		//自定义属性 获取光标焦点autofocus
		directives: {
			autofocus: {
				inserted (el) {
					el.focus()
				}
			}
		},
		//计算剩余的item
		computed: {
			activeNum (){
				return this.dataList.filter(item => !item.isFinish).length
			},
			//全选
			toggleAll:{
				//every()是只要有一个是true 就是true  
				get(){
					return this.dataList.every(item => item.isFinish)
				},
				set(val){
					this.dataList.forEach(item => item.isFinish = val)
				}
			}
		},
		created (){
			this.hashchange()
			window.onhashchange = () => {
				this.hashchange()
			}
		}
	})

})(window, Vue);
