import React, { Component } from 'react';
import classNames from 'classnames';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
//import { RadioButton } from 'primereact/radiobutton';
//import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import './CrudGird.css';

export class CrudGird extends Component {

    emptyEmployee = {
        name: "",
        age: null,
        phone: "",
        address: "",
        status: null,
        email: "",
        picture: null,
        birth_date: null,
        isbn: null,
        date_hired: null,
        specialization: "",
        university: ""
    };

    constructor(props) {
        super(props);

        this.state = {
            employees: props.data,
            EmployeeDialog: false,
            deleteEmployeeDialog: false,
            deleteEmployeesDialog: false,
            employee: this.emptyEmployee,
            selectedEmployees: null,
            submitted: false,
            globalFilter: null
        };

       // this.productService = new ProductService();

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

    // formatCurrency = (value) => {
    //     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    // }

    openNew = () =>  {
        this.setState({
            employee: this.emptyEmployee,
            submitted: false,
            employeeDialog: true
        });
    }

    hideDialog = ()=> {
        this.setState({
            submitted: false,
            employeeDialog: false
        });
    }

    hideDeleteEmployeeDialog = ()=> {
        this.setState({ deleteEmployeeDialog: false });
    }

    hideDeleteEmployeesDialog = () =>  {
        this.setState({ deleteEmployeesDialog: false });
    }

    saveEmployee = () =>  {
        let state = { submitted: true };

        if (this.state.employee.name.trim()) {
            let employees = [...this.state.employees];
            let employee = {...this.state.employee};
            if (this.state.product.id) {
                const index = this.findIndexById(this.state.employee.id);

                employees[index] = employee;
                this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            }
            else {
                employee.id = this.createId();
                employee.picture = 'product-placeholder.svg';
                employees.push(employee);
                this.toast.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            state = {
                ...state,
                employees,
                productDialog: false,
                product: this.emptyEmployee
            };
        }

        this.setState(state);
    }

    editEmployee = (employee) => {
        this.setState({
            employee: { ...employee },
            employeeDialog: true
        });
    }

    confirmDeleteEmployee = (employee) => {
        this.setState({
            employee,
            deleteEmployeeDialog: true
        });
    }

    deleteEmployee = () => {
        let employees = this.state.employees.filter(val => val.id !== this.state.employee.id);
        this.setState({
            employees,
            deleteEmployeeDialog: false,
            employee: this.emptyEmployee
        });
        this.toast.show({ severity: 'success', summary: 'Successful', detail: 'employee Deleted', life: 3000 });
    }

    findIndexById = (id)=> {
        let index = -1;
        for (let i = 0; i < this.state.employees.length; i++) {
            if (this.state.employees[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    exportCSV = () =>{
        this.dt.exportCSV();
    }

    confirmDeleteSelected = () => {
        this.setState({ deleteEmployeesDialog: true });
    }

    deleteSelectedEmployees = () => {
        let employees = this.state.employees.filter(val => !this.state.selectedEmployees.includes(val));
        this.setState({
            employees,
            deleteEmployeesDialog: false,
            selectedEmployees: null
        });
        this.toast.show({ severity: 'success', summary: 'Successful', detail: 'employees Deleted', life: 3000 });
    }

    onCategoryChange =  (e) => {
        let employee = {...this.state.employee};
        employee['isbn'] = e.value;
        this.setState({ employee });
    }

    onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let employee = {...this.state.employee};
        employee[`${name}`] = val;

        this.setState({ employee });
    }

    onInputNumberChange =(e, name) => {
        const val = e.value || 0;
        let employee = {...this.state.employee};
        employee[`${name}`] = val;

        this.setState({ employee });
    }

    leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={this.openNew} />
            </React.Fragment>
        )
    }



    imageBodyTemplate = (rowData) => {
        return <img src={`${rowData.picture}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.picture} className="product-image" />
    }






    actionBodyTemplate = (rowData) =>  {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => this.editEmployee(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => this.confirmDeleteEmployee(rowData)} />
            </React.Fragment>
        );
    }

    render() {
        const header = (
            <div className="table-header">
                <h5 className="p-m-0">Manage Employees</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search..." />
                </span>
            </div>
        );
        const employeeDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={this.hideDialog} />
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={this.saveEmployee} />
            </React.Fragment>
        );
        const deleteEmployeeDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteEmployeeDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteEmployee} />
            </React.Fragment>
        );
        const deleteEmployeesDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteEmployeeDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteSelectedEmployees} />
            </React.Fragment>
        );

        return (
            <div className="datatable-crud-demo">
                <Toast ref={(el) => this.toast = el} />

                <div className="card">
                    <Toolbar className="p-mb-4" left={this.leftToolbarTemplate} ></Toolbar>

                    <DataTable ref={(el) => this.dt = el} value={this.props.data} selection={this.state.selectedEmployees} onSelectionChange={(e) => this.setState({ selectedEmployee: e.value })}
                               dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                               globalFilter={this.state.globalFilter}
                               header={header}>

                        <Column field="id" header="ID" sortable></Column>
                        <Column field="name" header="Name" sortable></Column>
                        <Column header="picture" body={this.imageBodyTemplate}></Column>
                        <Column field="manager" header="Manager"  sortable></Column>
                        <Column field="address" header="Address" sortable></Column>
                        <Column field="email" header="Email"  sortable></Column>
                        <Column field="phone" header="Phone"  sortable></Column>
                        <Column body={this.actionBodyTemplate}></Column>
                    </DataTable>
                </div>

                <Dialog visible={this.state.employeeDialog} style={{ width: '450px' }} header="Employee Details" modal className="p-fluid" footer={employeeDialogFooter} onHide={this.hideDialog}>
                    {this.state.employee.picture && <img src={`showcase/demo/images/product/${this.state.employee.picture}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={this.state.product.image} className="product-image" />}
                    <div className="p-field">
                        <label htmlFor="name">Name</label>
                        <InputText id="name" value={this.state.employee.name} onChange={(e) => this.onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': this.state.submitted && !this.state.employee.name })} />
                        {this.state.submitted && !this.state.employee.name && <small className="p-invalid">Name is required.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="description">address</label>
                        <InputTextarea id="description" value={this.state.employee.address} onChange={(e) => this.onInputChange(e, 'address')} required rows={3} cols={20} />
                    </div>

                    {/*<div className="p-field">*/}
                    {/*    <label className="p-mb-3">Skills</label>*/}
                    {/*    <div className="p-formgrid p-grid">*/}
                    {/*        <div className="p-field-radiobutton p-col-6">*/}
                    {/*            <RadioButton inputId="category1" name="category" value="Accessories" onChange={this.onCategoryChange} checked={this.state.product.category === 'Accessories'} />*/}
                    {/*            <label htmlFor="category1">Accessories</label>*/}
                    {/*        </div>*/}
                    {/*        <div className="p-field-radiobutton p-col-6">*/}
                    {/*            <RadioButton inputId="category2" name="category" value="Clothing" onChange={this.onCategoryChange} checked={this.state.product.category === 'Clothing'} />*/}
                    {/*            <label htmlFor="category2">Clothing</label>*/}
                    {/*        </div>*/}
                    {/*        <div className="p-field-radiobutton p-col-6">*/}
                    {/*            <RadioButton inputId="category3" name="category" value="Electronics" onChange={this.onCategoryChange} checked={this.state.product.category === 'Electronics'} />*/}
                    {/*            <label htmlFor="category3">Electronics</label>*/}
                    {/*        </div>*/}
                    {/*        <div className="p-field-radiobutton p-col-6">*/}
                    {/*            <RadioButton inputId="category4" name="category" value="Fitness" onChange={this.onCategoryChange} checked={this.state.product.category === 'Fitness'} />*/}
                    {/*            <label htmlFor="category4">Fitness</label>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                </Dialog>

                <Dialog visible={this.state.deleteEmployeeDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmployeeDialogFooter} onHide={this.hideDeleteEmployeeDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {this.state.product && <span>Are you sure you want to delete <b>{this.state.product.name}</b>?</span>}
                    </div>
                </Dialog>

                <Dialog visible={this.state.deleteEmployeesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmployeesDialogFooter} onHide={this.hideDeleteEmployeesDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {this.state.employee && <span>Are you sure you want to delete the selected products?</span>}
                    </div>
                </Dialog>
            </div>
        );
    }
}