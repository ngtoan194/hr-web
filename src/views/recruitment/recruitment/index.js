import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import EnhancedTableToolbar from '../../../components/table-toolbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TablePaginationActions from '../../../components/pagination/pagination'
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';

import ModalAddUpdate from './add_recruitment'
import recruitmentProvider from '../../../data-access/recruitment';
import ConfirmDialog from '../../../components/confirm/'

class Recruitment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 10,
            name: '',
            webSite: '',
            address: '',
            phoneNumber: '',
            contact: '',
            price: -1,
            numberEmployee: -1,
            recruitmentSources: [],
            total: 0,
            selected: [],
            progress: true,
            modalAdd: false,
            confirmDialog: false,
        }
        this.renderChirenToolbar = this.renderChirenToolbar.bind(this)
    }

    addNew() {
        console.log("add new")
    }

    callbackDelete(text) {

        toast("Custom Style Notification with css class!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar'
        });
    }

    getData() {
        this.setState({ progress: true })

        let params = {
            page: this.state.page + 1,
            size: this.state.size,
            name: this.state.name,
            webSite: this.state.webSite,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            contact: this.state.contact,
            price: this.state.price,
            numberEmployee: this.state.numberEmployee,
        }

        recruitmentProvider.search(params, (s, e) => {
            console.log(s, e)
            if (s && s.data) {
                console.log(s.data)
                this.setState({
                    recruitmentSources: s.data.data,
                    total: s.data.total
                })
            } else {
                toast.error("Không lấy được dữ liệu !", {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            }
            this.setState({ progress: false })
        })

        this.progress();
    }

    progress = () => {
        const { completed } = this.state;
        if (completed > 100) {
            this.setState({ completed: 0, buffer: 10 });
        } else {
            const diff = Math.random() * 10;
            const diff2 = Math.random() * 10;
            this.setState({ completed: completed + diff, buffer: completed + diff + diff2 });
        }
    };

    componentWillMount() {
        this.getData();
    }

    modalCreateUpdate(item) {
        if (item) {
            this.setState({
                modalAdd: true,
                dataUpdate: item,
            })
        } else {
            this.setState({
                modalAdd: true,
                dataUpdate: {}
            })
        }

    }

    closeModal() {
        this.getData();
        this.setState({ modalAdd: false });
    }

    delete(item) {
        debugger
        this.setState({ confirmDialog: true, tempDelete: item })
    }

    cbDialog(type) {
        debugger
        this.setState({ confirmDialog: false })
        if (type == 1) {
            let param = {};
            recruitmentProvider.delete(param, this.state.tempDelete.id, (s, e) => {
                if (s && s.data) {
                    toast.success("Xóa tuyển dụng thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.getData();
                    this.setState({ tempDelete: {} });
                } else {
                    toast.error(s.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            })
        }
    }

    handleChangePage = (event, action) => {
        this.setState({
            page: action,
            selected: []
        }, () => {
            console.log(this.state.page)
            this.getData()
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ size: event.target.value }, () => {
            this.getData()
        });
    };

    handleChangeFilter(event, type) {
        switch (type) {
            case 1:
                this.setState({
                    page: 0,
                    name: event.target.value
                }, () => {
                    if (this.xxx) {
                        try {
                            clearTimeout(this.xxx);
                        } catch (error) {
                        }
                    }
                    this.xxx = setTimeout(() => {
                        this.getData()
                    }, 500)
                })
                break;
            case 2:
                this.setState({
                    page: 0,
                    webSite: event.target.value
                }, () => {
                    if (this.xxx) {
                        try {
                            clearTimeout(this.xxx);
                        } catch (error) {
                        }
                    }
                    this.xxx = setTimeout(() => {
                        this.getData()
                    }, 500)
                })
                break;
            case 3:
                this.setState({
                    page: 0,
                    phoneNumber: event.target.value
                }, () => {
                    if (this.xxx) {
                        try {
                            clearTimeout(this.xxx);
                        } catch (error) {
                        }
                    }
                    this.xxx = setTimeout(() => {
                        this.getData()
                    }, 500)
                })
                break;
            case 4:
                this.setState({
                    page: 0,
                    contact: event.target.value
                }, () => {
                    if (this.xxx) {
                        try {
                            clearTimeout(this.xxx);
                        } catch (error) { 
                        }
                    }
                    this.xxx = setTimeout(() => {
                        this.getData()
                    }, 500)
                })
                break;
        }


    }

    renderChirenToolbar() {
        const { classes } = this.props;
        return (
            <div>
                <TextField
                    style={{
                        marginTop: 0,
                        marginLeft: 20
                    }}
                    id="standard-name"
                    label="Tìm kiếm họ và tên"
                    className={classes.textField}
                    value={this.state.name}
                    onChange={(event) => this.handleChangeFilter(event, 1)}
                    margin="normal"
                />
                <TextField
                    style={{
                        marginTop: 0,
                        marginLeft: 20
                    }}
                    id="standard-web"
                    label="Tìm kiếm website"
                    className={classes.textField}
                    value={this.state.webSite}
                    onChange={(event) => this.handleChangeFilter(event, 2)}
                    margin="normal"
                />
                <TextField
                    style={{
                        marginTop: 0,
                        marginLeft: 20
                    }}
                    id="standard-phone"
                    label="Tìm kiếm số điện thoại"
                    className={classes.textField}
                    value={this.state.phoneNumber}
                    onChange={(event) => this.handleChangeFilter(event, 3)}
                    margin="normal"
                />
                <TextField
                    style={{
                        marginTop: 0,
                        marginLeft: 20
                    }}
                    id="standard-contact"
                    label="Tìm kiếm người liên hệ"
                    className={classes.textField}
                    value={this.state.contact}
                    onChange={(event) => this.handleChangeFilter(event, 4)}
                    margin="normal"
                />

                <Button variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} style={{ marginLeft: 20 }}>Thêm mới</Button>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { recruitmentSources, page, size, total, progress, dataUpdate, confirmDialog } = this.state;
        return (
            <div>
                <ToastContainer autoClose={3000} />
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <EnhancedTableToolbar
                            title="Danh sách nguồn tuyển dụng"
                            numSelected={0}
                            actionsChiren={
                                this.renderChirenToolbar()
                            }
                        />
                        {progress ? <LinearProgress /> : null}
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên nguồn tuyển dụng</TableCell>
                                    <TableCell>Website</TableCell>
                                    <TableCell>Địa chỉ</TableCell>
                                    <TableCell>Số điện thoại</TableCell>
                                    <TableCell>Người liên hệ</TableCell>
                                    <TableCell>Tiền</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    recruitmentSources && recruitmentSources.length ? recruitmentSources.map(item => {
                                        return (
                                            <TableRow
                                                hover
                                                key={item.recruitmentSources.id}
                                                tabIndex={-1}>
                                                <TableCell>{item.recruitmentSources.name}</TableCell>
                                                <TableCell><a target='blank' href='{item.recruitmentSources.webSite}'>{item.recruitmentSources.webSite}</a></TableCell>
                                                <TableCell>{item.recruitmentSources.address}</TableCell>
                                                <TableCell>{item.recruitmentSources.phoneNumber}</TableCell>
                                                <TableCell>{item.recruitmentSources.contact}</TableCell>
                                                <TableCell>{item.recruitmentSources.price ? item.recruitmentSources.price.formatPrice() + ' ₫' : ''}</TableCell>
                                                <TableCell>{item.recruitmentSources.numberEmployee}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => this.modalCreateUpdate(item)} color="primary" className={classes.button} aria-label="Edit">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={this.delete.bind(this, item.recruitmentSources)} color="secondary" className={classes.button} aria-label="Edit">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                        :
                                        <TableRow>
                                            <TableCell>Danh sách trống</TableCell>
                                        </TableRow>
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        labelRowsPerPage="Số dòng trên trang"
                                        rowsPerPageOptions={[10, 20, 50, 100]}
                                        colSpan={3}
                                        count={total}
                                        rowsPerPage={size}
                                        page={page}
                                        onChangePage={this.handleChangePage}
                                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </Paper>
                {confirmDialog && <ConfirmDialog title="Xác nhận" content="Bạn có chắc chắn muốn xóa tuyển dụng này?" btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.cbDialog.bind(this)} />}
                {this.state.modalAdd && <ModalAddUpdate data={dataUpdate} callbackOff={this.closeModal.bind(this)} />}
            </div>
        )
    }
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1600,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

Recruitment.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Recruitment);