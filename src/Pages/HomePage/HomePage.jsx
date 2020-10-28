import React ,{Component} from 'react';
import {CrudGird} from "../../Components/CrudGird/CrudGird";
import axios from "axios";


class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            combo:[]
        }

    }
    componentDidMount() {
        axios({
            method: 'post',
            url:'http://172.16.1.102:6060/api/v1/getdata',
            data:{
                fun_name:"FU_DOC_COMPONENT_TYPES",
                param_name:[],
                param_value:[]
            }

        })
            .then(response => {
                console.log(response.data.Table)
                this.setState({combo: response.data.Table})

            })
            .catch(error => console.error('timeout exceeded'))
        axios({
            method: 'post',
            url:'http://172.16.1.102:6060/api/v1/getdata',
            data:{
                fun_name:"FU_DOC_SCREEN_COMPONENT2",
                param_name:["P_SCREEN_ID"],
                param_value:["3"]
            }

        })
            .then(response => {
                console.log(response.data.Table)
                this.setState({data: response.data.Table})

            })
            .catch(error => console.error('timeout exceeded'))
    }
    render() {
        return (
            <div>
                <CrudGird data = {this.state.data} combo={this.state.combo}/>
            </div>
        );
    }

}

export default HomePage;