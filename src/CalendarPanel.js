import React,{ PropTypes } from 'react';
import ReactDom from 'react/lib/ReactDOM';
import classnames from 'classnames';
import ClassNameMixin from './utils/ClassNameMixin.js';
import Component from './utils/Component';

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
 * @demo #/calendar|calendar.js
 * @show true
 * */
@ClassNameMixin
export default class CalendarPanel extends Component{

    static propTypes = {
        showCallback:PropTypes.func,
        hideCallback:PropTypes.func,
        componentTag:PropTypes.string,
        /**
         * 日历位置
         * @property direction
         * @type String
         * @default auto 自动根据当前位置切换 上/下，
         * */
        direction: PropTypes.string,
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
        calendarType:'date',
        direction: 'auto',
        getValueCallback:function(date){
            console.warn('通过向CalendarPanel传入回调函数"getValueCallback"可以获取到当前选取的日期值，当前选取的日期为：'+date);
        }
    };
    getFormat(){
        let formatMap={
                date:this.props.format||'yyyy-MM-dd',
                month:this.props.monthFormat || 'MM',
                year:this.props.yearFormat || 'yyyy',
                yearMonth:this.props.yearMonthFormat || 'yyyy-MM'
            };
        return formatMap[this.props.calendarType]
    }
    getWindowType(){
        let typeMap={
            date:0,
            month:1,
            year:2,
            yearMonth:1
        },
        windowType= typeMap[this.props.calendarType]?typeMap[this.props.calendarType]:0
        return windowType;
    }
    constructor(props, context) {
        super(props, context);
        this.calendarContainer = this.uniqueId();
        this.inputId = this.uniqueId();
        this.state = {
            posStyle: {},
            isShow:false,
            value:this.props.defaultDate || '',
            windowType:this.getWindowType()
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.defaultDate
        });
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

    componentDidMount() {
        this.updateDirection()
    }
    componentDidUpdate() {
        this.updateDirection();
    }

    inputBlurHandler(){
        this.doReleaseCapture();
        this.close();
    }

    inputMouseUpHandler(){
        this.doReleaseCapture();
    }

    inputFocusHandler(e){
        let container = ReactDom.findDOMNode(this.refs[this.calendarContainer]),
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
            windowType:this.getWindowType()
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
    dateChange(d){
        this.refs[this.calendarContainer+'calendar'].dateChange(d);
        this.setState({
            value:d
        });
    }
    // update calendar direction
    updateDirection() {
        let dir = this.props.direction;
        let [inputNode, panelNode] = [
            ReactDom.findDOMNode(this.refs[this.inputId]),
            ReactDom.findDOMNode(this.refs[this.calendarContainer + 'calendar']).children[0]];
        //bottom height left right top width
        const inputPos = inputNode.getBoundingClientRect();
        const panelPos = panelNode.getBoundingClientRect();
        const bodyPos = document.body.getBoundingClientRect();
        // if dir auto then rename dir
        // detach direction
        // body - input VS panel
        if (dir === 'auto') {
            const isDown = bodyPos.height - inputNode.offsetTop + inputPos.height - panelPos.height > 10;
            dir = isDown ? 'down' : 'top';
        }
        console.log('direction', dir)
        const style = {}
        switch (dir) {
            case 'down':
                style.top = inputPos.height + 'px';
                style.left = 0;
                break;
            case 'top':
                style.top = '-' + (panelPos.height + 10) + 'px';
                style.left = 0;
                break;
            case 'left':
                style.left = '-' + (panelPos.width + 5) + 'px';
                style.top = 0;
                break;
            case 'right':
                style.left = inputPos.width + 5 + 'px';
                style.top = 0;
                break;
            default :
                break;
        }
        this.refs[this.calendarContainer + 'calendar'].updateDirection(style);
        return style;
    }
    render(){
        let {componentTag:Component} = this.props,
            _this = this;
        let options = React.Children.map(this.props.children,(option)=>{
            return <Input {...option.props}
                ref={this.inputId}
                onBlur={::_this.inputBlurHandler}
                onMouseUp={::_this.inputMouseUpHandler}
                onFocus={::_this.inputFocusHandler}
                value={_this.state.value}
                onChange={::_this.inputChangeHandler}
                icon={option.props.icon}
                iconClickCallback={function(){
                    ReactDom.findDOMNode(this.refs[this.inputId]).getElementsByTagName('input')[0].focus();
                }.bind(this) }
                />;
        },this);
        return (
            <div className={
                classnames(this.getClassName('panel') )
            } ref={this.calendarContainer} style={{'position': 'relative'}}>
                {options}
                <Calendar
                    format={this.getFormat()}
                    {...this.props}
                    ref={this.calendarContainer+'calendar'}
                    show={this.state.isShow}
                    selectCallback={::this.selectCallback}
                    windowType={this.state.windowType}
                    closeCallback={::this.close}
                    setWindowType={::this.setWindowType} />
            </div>
        );
    }
}