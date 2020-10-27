import React ,{Component} from 'react';
import {CrudGird} from "../../Components/CrudGird/CrudGird";
import axios from "axios";


class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[]
        }

    }
    componentDidMount() {
        axios({
            method: 'get',
            url:'http://dtcdashboard.pythonanywhere.com/api/v1/employee/',

        })
            .then(response => {
                console.log(response.data)
                this.setState({data: response.data})

            })
            .catch(error => console.error('timeout exceeded'))
        //this.productService.getProducts().then(data => this.setState({ products: data }));
    }
    render() {
        return (
            <div>
                <CrudGird data = {this.state.data}/>
            </div>
        );
    }

}

export default HomePage;