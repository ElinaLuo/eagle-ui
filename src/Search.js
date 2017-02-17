import React,{Component, PropTypes} from 'react';
import ReactDom from 'react/lib/ReactDOM';
import classnames from 'classnames';

import Suggestion from './Suggestion';
/**
 * 搜索按钮组件
 * 参数： id/callBack/placeholder 均可不传
 * @class Search
 * @module ui
 * @constructor
 * @demo star.js {UI展示}
 * @demo suggestion.js {源码}
 * @show true
 * */
export default class Search extends Suggestion {
    constructor(props, context) {
        super(props, context);
    }

}