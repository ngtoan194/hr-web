import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CountUp from 'react-countup';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      totalEmployees:100,
      totalDepartment:100,
      totalSpecial:100,
      totalContract:100,
    };
  }
  componentWillMount() {
    var logedin = localStorage.getItem('isofh')
    if (!logedin) {
      this.props.history.push("/login");
    }
  }
  handleDelete() {
    alert('You clicked the delete icon. ');
  }
  render() {
    const { classes } = this.props;
    const { totalEmployees, totalDepartment, totalSpecial, totalContract} = this.state;
    return (
      <div className="animated fadeIn">
        <Grid container spacing={16}>
          <Grid item xs={3} md={3}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom> Tổng số nhân viên </Typography>
                <CountUp
                  start={0}
                  end={totalEmployees}
                  duration={2.75}
                  onEnd={() => console.log('Ended! 👏')}
                  onStart={() => console.log('Started! 💨')}
                />
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3} md={3}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom> Tổng số phòng ban </Typography>
                <CountUp
                  start={0}
                  end={totalDepartment}
                  duration={2.75}
                  onEnd={() => console.log('Ended! 👏')}
                  onStart={() => console.log('Started! 💨')}
                />
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3} md={3}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom> Tổng số chuyên môn </Typography>
                <CountUp
                  start={0}
                  end={totalSpecial}
                  duration={2.75}
                  onEnd={() => console.log('Ended! 👏')}
                  onStart={() => console.log('Started! 💨')}
                />
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={3} md={3}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom> Tổng số hợp đồng </Typography>
                <CountUp
                  start={0}
                  end={totalContract}
                  duration={2.75}
                  onEnd={() => console.log('Ended! 👏')}
                  onStart={() => console.log('Started! 💨')}
                />
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        {/* <Link to="/calendar/ExportTimeKeeping">asdasdsad</Link> */}
      </div>
    );
  }
}

const styles = theme => ({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
