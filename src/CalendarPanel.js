import React,{ PropTypes, Component } from 'react';
import ReactDom from 'react/lib/ReactDOM';
import classnames from 'classnames';
import ClassNameMixin from './utils/ClassNameMixin.js';

import Input from './Input.js';
import Calendar from './Calendar.js';

/**
 * CalendarPanel组件<br>
 * 接受Calendar的所有属性接口，额外增加一个getValueCallback方法
 *
 * 主要属性接口:
 * <ul>
 *     <li>getValueCallback参数为<code>格式化后的string</code></li>
 *     <li style='color:red'><a href='./Calendar.html'>其他属性定义请参照Calendar组件</a></li>
 * </ul>
 *
 * @class CalendarPanel
 * @module ui
 * @extends Component
 * @constructor
 * @demo  empty.html {UI展示}
 * @demo  src/modules/calendar.js {源码}
 * @show true
 * */
@ClassNameMixin
export default class CalendarPanel extends Component{

    static propTypes = {
        showCallback:PropTypes.func,
        hideCallback:PropTypes.func,
        componentTag:PropTypes.string,
        /**
         * 通过传入此函数获取日期值
         * @event  getValueCallback
         * @param {string} date 日期
         * */
        getValueCallback:PropTypes.func
    };

    static defaultProps = {
        classPrefix:'calendar',
        componentTag:'Input',
        getValueCallback:function(date){
            console.warn('通过向CalendarPanel传入回调函数"getValueCallback"可以获取到当前选取的日期值，当前选取的日期为：'+date);
        }
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            isShow:false,
            value:'',
            windowType:0
        };
    }

    doSetCapture(input){
        if(input.setCapture){
            this.doReleaseCapture();
            input.setCapture();
            this.ctObj = input;
        }
    }

    doReleaseCapture(){
        if (this.ctObj && this.ctObj.releaseCapture) {
            this.ctObj.releaseCapture();
            this.ctObj = null;
        }
    }

    componentDidMount(){

    }

    inputBlurHandler(){
        this.doReleaseCapture();
        this.close();
    }

    inputMouseUpHandler(){
        this.doReleaseCapture();
    }

    inputFocusHandler(e){

        let container = ReactDom.findDOMNode(this),
            _this = this,
            calendar = container.querySelector(`.${this.getClassName('container')}`),
            input = e.target;

        calendar.onmousedown = function (e) {
            _this.doSetCapture(input);
            return false;
        };
        this.input = input;
        this.setState({
            isShow:true,
            windowType:0
        });
    }

    inputChangeHandler(e){
        let target = e.target;

        this.setState({
            value:target.value
        });
    }

    selectCallback(date){
        this.props.getValueCallback(date);
        this.setState({
            value:date
        });
    }

    setWindowType(type){
        this.setState({
            windowType:type
        });
    }

    close(){
        this.setState({
            isShow:false
        });
        this.input &&(
            this.input.blur()
        );
    }

    render(){

        let {componentTag:Component} = this.props,
            _this = this;
        let options = React.Children.map(this.props.children,(option)=>{

            return <Input {...option.props}
                onBlur={::_this.inputBlurHandler}
                onMouseUp={::_this.inputMouseUpHandler}
                onFocus={::_this.inputFocusHandler}
                value={_this.state.value}
                onChange={::_this.inputChangeHandler}
                icon={option.props.icon}
                />;

        },this);

        return (
            <div className={
                classnames(this.getClassName('panel') )
            }>
                {options}
                <Calendar
                    {...this.props}
                    show={this.state.isShow}
                    selectCallback={::this.selectCallback}
                    windowType={this.state.windowType}
                    closeCallback={::this.close}
                    setWindowType={::this.setWindowType} />
            </div>
        );
    }
}