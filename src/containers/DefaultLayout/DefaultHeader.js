import React from 'react';
import { AppSidebarToggler } from '@coreui/react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import withRoot from '../../withRoot';
import userProvider from '../../data-access/user'

class PrimarySearchAppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
    };
  }


  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handlelogOut = event => {
    let param = JSON.parse(localStorage.getItem('isofh'))
    userProvider.logout(param.employees, (s, e) => {
      if (s && s.code === 0) {
        localStorage.clear()
        // window.location.reload()
        window.location.href = '/';
        // var logedin = localStorage.getItem('isofh')
        // if(!logedin) {
        //   this.props.history.push("/login");
        // }
      } else {
        alert(s.message)
      }
    })
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
        <MenuItem onClick={this.handlelogOut}>Đăng xuất</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
        <MenuItem onClick={this.handlelogOut}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Đăng xuất</p>
        </MenuItem>
      </Menu>
    );

    return (
      <React.Fragment>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <AppSidebarToggler
                className="d-lg-none"
                display="md"
                mobile
                children={
                  // <IconButton className={classes.button} aria-label="Delete">
                  <MenuIcon className={classes.menubutton} />
                  // </IconButton>
                } />
              <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                <div className={classes.box_menu}>
                  <img src="assets/logo.png" width={160} style={{ marginTop: 11 }} />
                </div>
              </Typography>
              <AppSidebarToggler
                className="d-md-down-none"
                children={
                  // <IconButton className={classes.button} aria-label="Delete">
                  <MenuIcon className={classes.menubutton} />
                  // </IconButton>
                }
                display="lg" />
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton color="inherit">
                  <Badge badgeContent={17} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                  <MoreIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          {renderMenu}
          {renderMobileMenu}
        </div>
      </React.Fragment>
    );
  }
}

PrimarySearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    color: '#fff'
  },
  menubutton: {
    color: '#fff'
  },
  box_menu: {
    width: 175,
    height: 55,
    textAlign: 'center'
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

export default withRoot(withStyles(styles)(PrimarySearchAppBar));