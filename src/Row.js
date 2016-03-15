import React,{ PropTypes } from 'react';
import classnames from 'classnames';

import Component from './utils/Component';

/**
 * 定义栅格中的一行，配合Col组件使用
 * <h5>提供的UI接口:</h5>
 * <ul>
 *     <li>end:是否显示下边框</li>
 * </ul>
 * @class Row
 * @module grid(布局)
 * @extends Component
 * @constructor
 * @demo star.js {UI展示}
 * @demo Demo1.js {源码}
 * @show true
 * */
export default class Row extends Component{
    static propTypes={
        /**
         * 样式前缀
         * @property classPrefix
         * @type String
         * @default row
         * */
        classPrefix:PropTypes.string,
        /**
         * 是否显示下划线
         * @property bottom
         * @type boolean
         * @default undefined
         * */
        bottom:PropTypes.bool
    };

    static defaultProps = {
        classPrefix:'row'
    };

    render(){

        return (
            <div {...this.props} className={classnames(
                this.getProperty(),
                'clearfix',
                this.props.className
            )} style={this.getStyles(this.props.style)}>
                {this.props.children}
            </div>
        );
    }
}