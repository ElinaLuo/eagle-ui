import React,{ PropTypes, Component } from 'react';
import classnames from 'classnames';
import ClassNameMixin from './utils/ClassNameMixin.js';

/**
 * 分页组件
 * @class Paging
 * @constructor
 * @module ui
 * @extends Component
 * @requires React classnames
 * @demo #/paging|paging.js
 * @show true
 * @author min.xiao@dianping.com
 * */
@ClassNameMixin
export default class Paging extends Component{

    static propTypes = {
        /**
         * 总页数
         * @property currentPage
         * @type Integer
         * @default 1
         * */
        currentPage: PropTypes.number.isRequired,
        /**
         * 每页显示多少条数据
         * @property pageSize
         * @type Integer
         * @default 20
         * */
        pageSize: PropTypes.number.isRequired,
        /**
         * 数据总数
         * @property total
         * @type Integer
         * */
        total: PropTypes.number.isRequired,
        /**
         * 点击分页回调
         * @event  pageCallback
         * @param {Integer} pageNum 用户点击的页码
         * @default function(){}
         * */
        pageCallback: PropTypes.func,
        /**
         *
         * @property activeClass
         * @type String
         * @default active
         * */
        activeClass: PropTypes.string,
        classPrefix: PropTypes.string,
        componentTag: PropTypes.string,
        /**
         * 开启选择每页显示数量选项
         * @property showItemsNumber
         * @type Boolean
         * */
        showItemsNumber:PropTypes.bool,
        /**
         * 自定义每页显示数量数组,需为非空数组。默认为[]
         * @property choosePageSize
         * @type array
         * @default []
         * */
        choosePageSize:PropTypes.array
    };
    static defaultProps = {
        activeClass:'active',
        currentPage:1,
        pageSize:20,
        classPrefix:'paging',
        componentTag:'div',
        chooseMaxPageSize:0,
        /**
         * 默认每页显示数量为［］
         * */
        choosePageSize:[],
        /**
         * 跟showItemsNumber一起使用 arguments{pageSize}
         * @property loadPageCallback
         * */
        loadPageCallback:function(){
            console.warn('Is not defined loadPageCallback');
        }
    };

    /**
     * @constructor
     * @param props {Object}
     * @param context {Object}
     * */
    constructor(props, context) {
        super(props, context);

        /**
         * @type Integer
         * @default
         * */
        this.pages=this.getPages();

        this.index = 0;

        this.number = 5;

        /**
         * @type Boolean
         * @default false
         * */
        this.init = false;
        //总数：this.total


        this.state = {
            /**
             * 当前页
             * @type Integer
             * */
            currentPage:this.props.currentPage,
            defaultNumber:this.props.pageSize
        };
    }

    prev(){
        this.gotoPage(this.props.currentPage-1 );
    }

    next(){
        this.gotoPage(this.props.currentPage+1);
    }


    getPages(){
        return Math.ceil(this.props.total/this.props.pageSize);
    }


    goto(page = this.state.currentPage){

        this.pages=this.getPages();
        if(page <=1){
            page = 1;
        }
        if(page >= this.pages){
            page = this.pages;
        }

        /*if(this.init){
            this.setState({
                currentPage:page
            });
            this.init = false;
        }*/

        return this.generate();
    }

    /**
     * 跳转至N页
     * */
    gotoPage(index){
        this.init=true;
        this.props.pageCallback && this.props.pageCallback(index );
        return this.goto(index);
    }
    /**
     * 生成页码
     * */
    generate(){
        const {currentPage,activeClass} = this.props;
        let i=1,
            htmlList = [],
            distance = 4,
            len = currentPage+distance;


        i =currentPage<=6 ? i:currentPage-distance;
        i = i<=1?1:i;

        len = len>this.pages ? this.pages : len;

        if(currentPage>1){
            htmlList.push(<a href="javascript:void(0);" key="上一页" className="" onClick={::this.prev}>上一页</a>);
        }

        //9     ....4....|.
        if(currentPage>=7){
            htmlList.push(<a href="javascript:void(0);" key={1} onClick={::this.gotoPage.bind(this,1)}>{1}</a>);
            htmlList.push(<a href="javascript:void(0);" key="...上一页">...</a>);
            //i+=1;
        }

        for(;i<=len;i++){
            htmlList.push(<a href="javascript:void(0);" key={i} onClick={this.gotoPage.bind(this,i)} className={classnames({
              [this.getClassName(activeClass) ]:  i==currentPage
            } ) } >{i}</a> );
        }
        //pages-currentPage =
        let bt = this.pages-currentPage;
        if(bt>=7 ){
            htmlList.push(<a href="javascript:void(0);" key="...下一页">...</a>);
            htmlList.push(<a href="javascript:void(0);" key={this.pages} onClick={::this.gotoPage.bind(this,this.pages)}>{this.pages}</a>);
        }

        if(this.pages>1 && currentPage!=this.pages){
            htmlList.push(<a href="javascript:void(0);" key="下一页"  onClick={::this.next}>下一页</a>);

        }

        return htmlList;

    }

    changePageSizeHandler(e){
        let val = e.target.value;
        //this.setState({
        //    defaultNumber:val*1
        //});
        let {loadPageCallback} = this.props;

        loadPageCallback && (loadPageCallback(val) );

        this.setState({
            defaultNumber:val
        });
    }

    accordingNumber(){
        let opts = [],num=10,choosePageSize = this.props.choosePageSize,chooseMaxPageSize = this.props.chooseMaxPageSize || 100;
        /**
         * if 提供自定义数组 且非空。
         * */
        if(choosePageSize instanceof Array && choosePageSize.length > 0){
            choosePageSize.forEach((i)=>{
                opts.push(<option value={i}  key={i}>{i}</option>);
            })
        }else{
            for(let i=1,n;i<11;i++){
                n=num*i;
                if(n<=chooseMaxPageSize){

                    opts.push(<option value={n}  key={n}>{n}</option>);
                }else{
                    break;
                }

            }
        }

        return (
            <span style={{
                marginRight:'20px'
            }}>
                每页显示&nbsp;&nbsp;
                <select defaultValue={this.props.pageSize} onChange={::this.changePageSizeHandler}>
                    {
                        opts
                    }
                </select>
                &nbsp;&nbsp;条
            </span>
        );
    }

    render(){

        const {componentTag:Component,activeClass,showItemsNumber} = this.props;

        return (

            <Component className={classnames(this.getClassName('container')) }>
                {showItemsNumber ? this.accordingNumber():null}
                {this.goto() }
                <span className='info'>
                    <span className={classnames(this.getClassName(activeClass)) }>
                        {this.props.currentPage}
                    </span>/{this.getPages()}，共{this.props.total}条
                </span>
            </Component>
        );

    }
}