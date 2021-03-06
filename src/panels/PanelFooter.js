import React,{ PropTypes, Component } from 'react';
import classnames from 'classnames';
import ClassNameMixin from '../utils/ClassNameMixin.js';

/**
 * PanelFooter定义底部区域
 * <div><a target="_blank" href="http://future-team.github.io/eagle-ui/examples/index.html#/panel">demo展示</a></div>
 * <div><a target="_blank" href="https://github.com/future-team/eagle-ui/blob/master/src/panels/PanelFooter.js">查看源码</a></div>
 * @class PanelFooter
 * @constructor
 * @module panel(面板)
 * @extends Component
 * @demo #/panel|panel.js
 * @show true
 * */
@ClassNameMixin
export default class PanelFooter extends Component{


    static propTypes = {
        /**
         * 是否为panelFooter中的内容添加padding，默认true
         * @property padding
         * @type bool
         * @default true
         * */
        padding:PropTypes.bool
    };

    static defaultProps = {
        classPrefix:'panel',
        padding:true
    };
    render(){
        return (
            <div className={
                classnames(
                    this.getClassName('footer')
                    ,this.props.padding?this.getClassName('padding'):''
                )}>
                {this.props.children}
            </div>
        );

    }
}