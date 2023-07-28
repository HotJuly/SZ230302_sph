<template>
	<div class="outer">
		<div class="main">
			<div class="py-container">
				<!--面包屑导航-->
				<div class="bread">
					<ul class="fl sui-breadcrumb">
						<li>
							<span href="#">全部结果</span>
						</li>
					</ul>
					<ul class="fl sui-tag">
						<li class="with-x" v-show="searchParams.keyword">
							关键字:{{ searchParams.keyword }}
							<i @click="removeKeyword">×</i>
						</li>
						<li class="with-x" v-show="searchParams.categoryName">
							分类:{{ searchParams.categoryName }}
							<i @click="removeCategory">×</i>
						</li>
						<li class="with-x" v-show="searchParams.trademark">
							品牌:{{ searchParams.trademark.split(':')[1] }}
							<i @click="removeTrademark">×</i>
						</li>
						<li class="with-x" v-for="(attr, index) in searchParams.props" :key="attr">
							{{ attr.split(':')[2] }}:{{ attr.split(':')[1] }}
							<i @click="removeAttr(index)">×</i>
						</li>
					</ul>
				</div>

				<!-- 搜索器 -->
				<SearchSelector :attrsList="attrsList" :trademarkList="trademarkList" @getTrademark="saveTrademark"
					@getAttr="saveAttr" />

				<!--商品展示区-->
				<div class="details clearfix">
					<!-- 列表操作区 -->
					<div class="sui-navbar">
						<div class="navbar-inner filter">
							<ul class="sui-nav">
								<li class="active">
									<a href="#">综合</a>
								</li>
								<li>
									<a href="#">销量</a>
								</li>
								<li>
									<a href="#">新品</a>
								</li>
								<li>
									<a href="#">评价</a>
								</li>
								<li>
									<a href="#">价格⬆</a>
								</li>
								<li>
									<a href="#">价格⬇</a>
								</li>
							</ul>
						</div>
					</div>
					<!-- 商品列表 -->
					<div class="goods-list">
						<ul class="yui3-g">
							<li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
								<div class="list-wrap">
									<div class="p-img">
										<a href="item.html" target="_blank">
											<img :src="good.defaultImg" /></a>
									</div>
									<div class="price">
										<strong>
											<em>¥ </em>
											<i>{{ good.price }}</i>
										</strong>
									</div>
									<div class="attr">
										<router-link to="/detail">
											{{ good.title }}</router-link>
									</div>
									<div class="commit">
										<i class="command">已有<span>2000</span>人评价</i>
									</div>
									<div class="operate">
										<a href="success-cart.html" target="_blank"
											class="sui-btn btn-bordered btn-danger">加入购物车</a>
										<a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<!-- 分页器 -->
					<!-- <Pagination 
					:total="total" 
					:totalPages="totalPages"
					:pageNo="searchParams.pageNo"
					:continues="5"
					@changePageNo="changePageNo"
					/> -->
					<Pagination 
					:total="total" 
					:totalPages="totalPages"
					:pageNo.sync="searchParams.pageNo"
					:continues="5"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import SearchSelector from './components/SearchSelector'
import Pagination from './components/Pagination'
export default {
	name: 'Search',
	data() {
		return {
			// 存储当前符合条件的商品列表
			goodsList: [],

			// 存储当前商品可筛选的属性列表
			attrsList: [],

			// 存储当前可选择的商品品牌列表
			trademarkList: [],

			// 用于存储当前一共具有多少条数据
			total: 0,

			// 用于存储当前一共具有多少页数据
			totalPages: 0,

			// 专门用于收集搜索请求相关的所有参数
			searchParams: {
				category1Id: undefined,
				category2Id: undefined,
				category3Id: undefined,
				categoryName: undefined,
				keyword: undefined,

				// 用于收集当前用户选中的商品属性
				props: [],

				// 用于收集当前用户选中的品牌信息
				trademark: "",

				// 控制请求当前页数
				pageNo: 1,
				// 控制当前页面显示数据条数
				pageSize: 10
			}
		}
	},
	async mounted() {

		// this.searchParams = {
		// 	...this.searchParams,
		// 	...this.$route.query
		// }

		// const { goodsList, trademarkList, attrsList } = await this.$API.search.reqList(this.searchParams);
		// // console.log(result)

		// // 存储当前符合条件的商品列表
		// this.goodsList = goodsList;

		// this.trademarkList = trademarkList;
		// this.attrsList = attrsList;
	},
	watch: {
		"$route.query": {
			// 让watch函数会在初始化阶段也立即执行
			immediate: true,
			async handler(newVal) {
				// Vue和React不同
				// Vue更新数据一定是同步更新,而React更新数据是异步更新

				// this.searchParams = {
				// 	...this.searchParams,
				// 	...this.$route.query
				// }

				// assign方法可以传入无数个对象
				// 他会将第二个对象开始的所有属性,全部传入第一个对象中
				// console.log('query',this.$route.query)

				// 第二个对象是空对象的作用,是用于清空searchParams中,与query相关所有数据
				// 然后第三个对象就是当前最新的query数据,将其注入到searchParams中
				Object.assign(this.searchParams, {
					category1Id: undefined,
					category2Id: undefined,
					category3Id: undefined,
					categoryName: undefined,
					keyword: undefined
				}, this.$route.query);
			}
		},
		// watch本身是浅监视,他只会监视某个属性值有没有变化
		// 例如searchParams,他的属性值是一个对象的地址值
		// 只要不更换该对象,那么这个watch就不会重新执行
		searchParams: {
			deep: true,
			immediate: true,
			handler() {
				this.reqSearchInfo();
			}
		}
	},
	methods: {
		removeKeyword() {
			// this.searchParams.keyword = undefined;

			this.$bus.$emit('clearKeyword');

			this.$router.push({
				path: '/search',
				query: {
					// 获取到跳转之前的参数
					// 因为参数如果还没有解析结束,那么push函数是没办法执行内部代码的
					// 所以这里获取query对象的时候,其实路由还没有跳转
					...this.$route.query,
					keyword: undefined
				}
			})
		},
		removeCategory() {
			// this.searchParams.categoryName=undefined;

			// Object.assign(this.searchParams, {
			// 	category1Id: undefined,
			// 	category2Id: undefined,
			// 	category3Id: undefined,
			// 	categoryName: undefined
			// })

			this.$router.push({
				path: '/search',
				query: {
					keyword: this.$route.query.keyword
				}
			});

		},
		removeTrademark() {
			this.searchParams.trademark = '';
		},
		removeAttr(index) {
			// console.log(1)
			// 注意,在Vue中,不要直接通过数组的下标修改内部的数据
			// 因为这样的操作没有响应式效果
			// Vue也知道自己有这样的问题,所以他对数组的7个方法进行了重写
			// push,pop,shift,unshift,sort,reverse,splice
			// 重写:它具有原先的效果,同时还增加了响应式的效果
			// this.searchParams.props[index]=undefined;
			this.searchParams.props.splice(index, 1);
		},
		async reqSearchInfo() {
			const { goodsList, trademarkList, attrsList, total, totalPages } = await this.$API.search.reqList(this.searchParams);
			// console.log(result)

			// 存储当前符合条件的商品列表
			this.goodsList = goodsList;

			this.trademarkList = trademarkList;

			this.attrsList = attrsList;

			this.total = total;

			this.totalPages = totalPages;
		},
		saveTrademark(tm) {
			this.searchParams.trademark = `${tm.tmId}:${tm.tmName}`
		},
		saveAttr(attr, attrValue) {
			// console.log('Search',attr,attrValue)
			// 1.根据现有数据,拼接处服务器想要的数据
			// 注意!!!!此处要求的格式是 ID:属性值:属性名
			const str = `${attr.attrId}:${attrValue}:${attr.attrName}`;
			// console.log(str)

			// 2.将数据推入searchParams对象的props数组中
			// 延伸效果:如果本次需要推入的数据已经存在,就不推入该数据(保证数据不重复)
			// 已存在的意思:str的数据,在props数组中,已经具有相同的内容
			// 想知道数组内部是否存在某个东西:find,indexOf,includes,some,every
			// find->会返回符合条件的内容
			// indexOf->返回符合条件的内容的下标
			// includes->返回布尔值,true代表存在,false代表不存在
			// some->数组里面的东西,至少有一个满足条件,就返回true
			// evety->数组里面的东西,所有内容都满足条件,就返回true

			const result = this.searchParams.props.includes(str);

			// 如果有存在,就不推入数据
			if (result) return;

			this.searchParams.props.push(str);
		},
		changePageNo(data){
			// console.log('Search的changePageNo',data)

			this.searchParams.pageNo = data;
		}
	},
	components: {
		SearchSelector,
		Pagination
	}
}
</script>

<style lang="less" scoped>
.main {
	margin: 10px 0;

	.py-container {
		width: 1200px;
		margin: 0 auto;

		.bread {
			margin-bottom: 5px;
			overflow: hidden;

			.sui-breadcrumb {
				padding: 3px 15px;
				margin: 0;
				font-weight: 400;
				border-radius: 3px;
				float: left;

				li {
					display: inline-block;
					line-height: 18px;

					a {
						color: #666;
						text-decoration: none;

						&:hover {
							color: #4cb9fc;
						}
					}
				}
			}

			.sui-tag {
				margin-top: -5px;
				list-style: none;
				font-size: 0;
				line-height: 0;
				padding: 5px 0 0;
				margin-bottom: 18px;
				float: left;

				.with-x {
					font-size: 12px;
					margin: 0 5px 5px 0;
					display: inline-block;
					overflow: hidden;
					color: #000;
					background: #f7f7f7;
					padding: 0 7px;
					height: 20px;
					line-height: 20px;
					border: 1px solid #dedede;
					white-space: nowrap;
					transition: color 400ms;
					cursor: pointer;

					i {
						margin-left: 10px;
						cursor: pointer;
						font: 400 14px tahoma;
						display: inline-block;
						height: 100%;
						vertical-align: middle;
					}

					&:hover {
						color: #28a3ef;
					}
				}
			}
		}

		.details {
			margin-bottom: 5px;

			.sui-navbar {
				overflow: visible;
				margin-bottom: 0;

				.filter {
					min-height: 40px;
					padding-right: 20px;
					background: #fbfbfb;
					border: 1px solid #e2e2e2;
					padding-left: 0;
					border-radius: 0;
					box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

					.sui-nav {
						position: relative;
						left: 0;
						display: block;
						float: left;
						margin: 0 10px 0 0;

						li {
							float: left;
							line-height: 18px;

							a {
								display: block;
								cursor: pointer;
								padding: 11px 15px;
								color: #777;
								text-decoration: none;
							}

							&.active {
								a {
									background: #e1251b;
									color: #fff;
								}
							}
						}
					}
				}
			}

			.goods-list {
				margin: 20px 0;

				ul {
					display: flex;
					flex-wrap: wrap;

					li {
						height: 100%;
						width: 20%;
						margin-top: 10px;
						line-height: 28px;

						.list-wrap {
							.p-img {
								padding-left: 15px;
								width: 215px;
								height: 255px;

								a {
									color: #666;

									img {
										max-width: 100%;
										height: auto;
										vertical-align: middle;
									}
								}
							}

							.price {
								padding-left: 15px;
								font-size: 18px;
								color: #c81623;

								strong {
									font-weight: 700;

									i {
										margin-left: -5px;
									}
								}
							}

							.attr {
								padding-left: 15px;
								width: 85%;
								overflow: hidden;
								margin-bottom: 8px;
								min-height: 38px;
								cursor: pointer;
								line-height: 1.8;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;

								a {
									color: #333;
									text-decoration: none;
								}
							}

							.commit {
								padding-left: 15px;
								height: 22px;
								font-size: 13px;
								color: #a7a7a7;

								span {
									font-weight: 700;
									color: #646fb0;
								}
							}

							.operate {
								padding: 12px 15px;

								.sui-btn {
									display: inline-block;
									padding: 2px 14px;
									box-sizing: border-box;
									margin-bottom: 0;
									font-size: 12px;
									line-height: 18px;
									text-align: center;
									vertical-align: middle;
									cursor: pointer;
									border-radius: 0;
									background-color: transparent;
									margin-right: 15px;
								}

								.btn-bordered {
									min-width: 85px;
									background-color: transparent;
									border: 1px solid #8c8c8c;
									color: #8c8c8c;

									&:hover {
										border: 1px solid #666;
										color: #fff !important;
										background-color: #666;
										text-decoration: none;
									}
								}

								.btn-danger {
									border: 1px solid #e1251b;
									color: #e1251b;

									&:hover {
										border: 1px solid #e1251b;
										background-color: #e1251b;
										color: white !important;
										text-decoration: none;
									}
								}
							}
						}
					}
				}
			}

			.page {
				width: 733px;
				height: 66px;
				overflow: hidden;
				float: right;

				.sui-pagination {
					margin: 18px 0;

					ul {
						margin-left: 0;
						margin-bottom: 0;
						vertical-align: middle;
						width: 490px;
						float: left;

						li {
							line-height: 18px;
							display: inline-block;

							a {
								position: relative;
								float: left;
								line-height: 18px;
								text-decoration: none;
								background-color: #fff;
								border: 1px solid #e0e9ee;
								margin-left: -1px;
								font-size: 14px;
								padding: 9px 18px;
								color: #333;
							}

							&.active {
								a {
									background-color: #fff;
									color: #e1251b;
									border-color: #fff;
									cursor: default;
								}
							}

							&.prev {
								a {
									background-color: #fafafa;
								}
							}

							&.disabled {
								a {
									color: #999;
									cursor: default;
								}
							}

							&.dotted {
								span {
									margin-left: -1px;
									position: relative;
									float: left;
									line-height: 18px;
									text-decoration: none;
									background-color: #fff;
									font-size: 14px;
									border: 0;
									padding: 9px 18px;
									color: #333;
								}
							}

							&.next {
								a {
									background-color: #fafafa;
								}
							}
						}
					}

					div {
						color: #333;
						font-size: 14px;
						float: right;
						width: 241px;
					}
				}
			}
		}
	}
}
</style>