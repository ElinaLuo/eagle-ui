/**
 * Created by mac on 15/9/7.
 */
import React,{PropTypes} from 'react';
import classnames from 'classnames';
//import ReactDom from 'react-dom';
import ReactDom from 'react/lib/ReactDOM';
import Label from './Label.js';
import Component from './utils/Component';

/**
 * 标签组<br />
 * <div><a target="_blank" href="http://future-team.github.io/eagle-ui/examples/index.html#/label">demo展示</a></div>
 * <div><a target="_blank" href="https://github.com/future-team/eagle-ui/blob/master/src/Label.js">查看源码</a></div>
 * @class LabelGroup
 * @module ui
 * @extends Component
 * @constructor
 * @demo #/label|label.js
 * @show true
 * */
export default class LabelGroup extends Component{
    static propTypes = {
        /**
         * 标签组左侧标题
         * @property title
         * @type String
         * */
        title:PropTypes.string,
        /**
         * 标签组展现形式{form|simple|default}
         * @property egType
         * @type String
         * @default default
         * */
        egType:PropTypes.oneOf(['simple', 'form','default']),
        /**
         * 点击后触发的回调，所有label会被继承
         * @property activeCallback
         * @type Function
         * */
        activeCallback:PropTypes.func,
        /**
         * 默认选中的项，取值为选中标签的文案
         * @property defaultChecked
         * @type String Integer
         * */
        defaultChecked:PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        /**
         * 间距，label集合与左边title的间距
         * @property spacing
         * @type Integer
         * */
        spacing:PropTypes.number
    };
    static defaultProps = {
        classPrefix:'label-group',
        simple:false
    };
    constructor(props, context) {
        super(props, context);

        this.setDefaultState({
            checked:this.props.defaultChecked,
            itemStyle:{
                marginLeft:this.props.spacing+'px'
            }
        });

        this.isInit = true;

        this.titleObj = this.uniqueId();
        this.itemObj = this.uniqueId();
    }

    activeHandler(callback,value,text,target,active){
        //debugger;

        if(this.state.checked!=target.innerHTML ){
            this.setState({
                checked:text
            });
            callback && callback(value,text,target,active);
        }
    }

    renderTitle(){
        let {title} = this.props,
            html = [];

        if(title){
            html.push(
                <div className="title" key={title} ref={this.titleObj}>{title}</div>
            );
        }

        return html;
    }

    loadedCallback(){

        let offsetV = ReactDom.findDOMNode(this.refs[this.titleObj] ),
            itemStyle = {};

        if(offsetV && !this.props.spacing){
            let cssStr = `margin-left:${offsetV.offsetWidth+30}px;`;
            ReactDom.findDOMNode(this.refs[this.itemObj] ).style.cssText = cssStr;
        }
    }
    componentWillReceiveProps(nextProps) {
        let checkedText=nextProps.defaultChecked;
        if(this.state.checked!==checkedText){
            this.setState({
                checked:checkedText
            });
        }
    }
    render(){
        let _this = this;
        /**
         * key 重复，使用component生成唯一key
         * */
        let options = React.Children.map(this.props.children,(option,index)=>{
            let {
                activeCallback,
                url,
                children,
                value,
                ...other,
                } = option.props;
            return <Label
                {...other}
                //key={children+index}
                key={_this.uniqueId()}
                url={url ? url:_this.props.url}
                value = {value?value:children}
                activeCallback={_this.activeHandler.bind(_this,activeCallback ? activeCallback:_this.props.activeCallback)}
                active={this.props.egType?false:children === _this.state.checked}>{children}</Label>;

        },this);

        return (
            <div className={classnames(
                this.getProperty(),
                'clearfix'
            )}>
                {this.renderTitle()}
                <div className="item-box clearfix" ref={this.itemObj} style={this.state.itemStyle}>
                    <div className="item-list">{options}</div>
                </div>
            </div>
        );
    }
}