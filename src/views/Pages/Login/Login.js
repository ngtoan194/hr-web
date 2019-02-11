import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { Container, Col, Row } from 'reactstrap';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { ToastContainer, toast } from 'react-toastify';
import classNames from 'classnames';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import userProvider from '../../../data-access/user'
import clientUtils from '../../../utils/client-utils';

const MyLink = props => <Link to="/" {...props} />

class Login extends Component {
  constructor(prop) {
    super(prop)
    this.state = {
      isofhMail: '',
      password:'',
      // isofhMail: 'phuong.ht@gmail.com',
      // password: '123456',
      showPassword: false,
    };
  }
  componentWillMount() {
    if (!localStorage.getItem('isofh')) {

    } else {
      console.log("ádsdsadada")
    }
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  validateData(isofhMail, password) {
    let msg = '';
    if (!isofhMail) {
      msg = msg + "Email không được để trống \n"
    }
    if (!password) {
      msg = msg + "Mật khẩu không được để trống "
    }
    return msg;
  }
  login = () => {
    console.log("adsas")
    const { isofhMail, password } = this.state;
    if (this.validateData(isofhMail, password) === '') {
      userProvider.login(isofhMail, password, (s, e) => {
        console.log(s, e)
        if (s && s.code === 0) {
          toast.success("Đăng nhập thành công!", {
            position: toast.POSITION.TOP_CENTER
          });
          localStorage.setItem('isofh', JSON.stringify(s.data))
          clientUtils.auth= s.data && s.data.employees ? s.data.employees.loginToken : '';
          this.props.history.push("/");
          window.location.reload();
        } else {
          toast.error("Đăng nhập không thành công hoặc tài khoản không có quyền truy cập! ", {
            position: toast.POSITION.TOP_CENTER
          });
        }
      })
    } else {
      console.log("cccc")
      toast.error(this.validateData(isofhMail, password), {
        position: toast.POSITION.TOP_CENTER
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { isofhMail, password, showPassword } = this.state;
    return (
      <div id="loginPage" className="app flex-row align-items-center">
        <ToastContainer autoClose={3000} />
        <Container>
          <Row className="justify-content-center">
            <Col md="3" sm="12">
              <Card className={classes.card}>
                <CardContent>
                  <div style={{ textAlign: 'center', padding: 24 }}>
                    <img src="../assets/logo.png" width={160} />
                  </div>
                  <TextField
                    id="standard-uncontrolled"
                    label="UserName"
                    className={classes.textField}
                    value={isofhMail}
                    onChange={(event) => this.setState({ isofhMail: event.target.value })}
                    style={{ marginLeft: 0, marginRight: 0 }}
                  />
                  <FormControl className={classNames(classes.margin, classes.textField)} style={{ marginLeft: 0, marginRight: 0, marginTop: 30 }}>
                    <InputLabel htmlFor="adornment-password">Password</InputLabel>
                    <Input
                      id="adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={this.handleChange('password')}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={this.handleClickShowPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <Button onClick={this.login} variant="contained" component="span" color="primary" style={{ marginTop: 54, width: '100%' }}> Đăng nhập </Button>
                </CardContent>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
});
Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
