import React,{ PropTypes, Component } from 'react';
import classnames from 'classnames';
import ClassNameMixin from '../utils/ClassNameMixin.js';

/**
 * 表格组件
 * @class Td
 * @constructor
 * @module table
 * @extends Component
 * @requires React classnames
 * @since 0.1.0
 * @demo docDemo/module/table.html {UI展示}
 * @demo docDemo/table.js {源码}
 * @show true
 * */
@ClassNameMixin
export default class Td extends Component{

    static propTypes = {

    };

    static defaultProps = {

    };



    /**
     * @method render
     * @return {ReactElement}
     * */
    render(){
        return (
            <td {...this.props}>
                {this.props.children}
                {classnames(
                    this.getClassNames(this.props))===''
                    ? null:
                    <span className={
                        classnames(
                            this.getClassNames(this.props)
                        )}>
                    </span>
                }
            </td>
        );

    }
}