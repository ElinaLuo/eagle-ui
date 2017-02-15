/**
 * Created by mac on 15/11/4.
 */
import React,{Component} from 'react';
import {Tab,Tabset} from 'eagle-ui';
import Code from './Code.js';
import {getFile} from './Code.js';

let Demo = class Demo extends Component{

    constructor(props,context){
        super(props,context);

        this.state={
            tabIndex:2
        };
    }
    componentDidMount(){
        let _this=this;
        setTimeout(()=>{
            _this.setState({
                tabIndex:3
            })
        },2000)
    }
    callback(index){
        console.log('i',index);
        if(this.state.tabIndex!==index){
            this.setState({
                tabIndex:index
            });
        }
    }

    tab3(){
        if(this.state.tabIndex==2){
            return (<div>tab3</div>);
        }
    }
    tab2(){
        if(this.state.tabIndex==1){
            return (<div>tab2</div>);
        }
    }
    tab1(){
        if(this.state.tabIndex==0){
            return (<div>tab1</div>);
        }
    }


    render(){
        return (
            <div>
                <Code code={getFile('tab')}>
                </Code>
                <Code code={getFile('paging')}>
                </Code>
                <Tabset disableHoverAnimation activeTab={this.state.tabIndex} tabCallback={::this.callback}>
                    <Tab>
                        {::this.tab1()}
                    </Tab>
                    <Tab heading='tab2'>
                        {::this.tab2()}
                    </Tab>
                    <Tab heading='tabasjdfnl;adfnaf;adlkf3'>
                        {::this.tab3()}
                    </Tab>
                    <Tab heading='tabasjdfnl;adfnaf;adlkf3'>
                        nadkfnpasknfsaknf
                    </Tab>
                    <Tab heading='tabasjdfnl;adfnaf;adlkf3'>
                        nadkfnpasknfsaknf
                    </Tab>
                </Tabset>
            </div>
        );
    }
}

export default Demo;