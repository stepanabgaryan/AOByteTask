import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { FaTimes } from "react-icons/fa";

const styles = ( (theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    borderWidth: '2px',
    borderColor: 'black',
    borderStyle: 'dotted',
  },
  card: {
    minWidth: 275,
    minHeight: '250px',
    display: 'inline-block',
    textAlign: 'center',
    margin: 15,
    position: 'relative'
  },
  title: {
    fontSize: 18,
  },
  pos: {
    marginBottom: 12,
  },
  green: {
    color: 'green'
  },
  orange: {
    color: 'orange'
  },
  red: {
    color: 'red'
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 24,
    cursor: 'pointer'
  }
}));

class ItemtoCompare extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tocompare: [],
      check: ''
    };
  }

  componentDidUpdate = () => {
    this.setState({
      tocompare: this.props.value,
      check: this.props.compare
    })
  }

  checkTheColor = (a, b) => {
    if(a > b) {
      return 'green';
    } else if(a < b) {
      return 'red';
    }
    return 'orange';   
  }

  handleRemovePlayer = (index) => {
    const {tocompare, check} = this.state;
    const {onCheck} = this.props;
    onCheck(tocompare.length === 1 ? [] : tocompare[1 - index], check);
  }

  render() {
    const { classes } = this.props;
    const { tocompare } = this.state;
    return (
      tocompare.map((items, index) => 
        <>
          <Card className={classes.card} key={index}>
          <CardContent>
            <FaTimes className={classes.close} onClick={(e) => this.handleRemovePlayer(index)}/>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {items.name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              Stats
            </Typography>
            <Typography variant="body2" component="p">
            { tocompare.length === 1 && <>
              <p>Goals: <span className={classes.orange}>{tocompare[0].skills.Goals}</span></p>
              <p>Appearances: <span className={classes.orange}>{tocompare[0].skills.Appearances}</span></p>
              <p>Tackle: <span className={classes.orange}>{tocompare[0].skills.Tackle}</span></p>
              </>}
            { tocompare.length === 2 && <>
              <p>Goals: <span className={classes[this.checkTheColor(tocompare[index].skills.Goals, tocompare[1-index].skills.Goals)]}>{tocompare[index].skills.Goals}</span></p>
              <p>Appearances: <span className={classes[this.checkTheColor(tocompare[index].skills.Appearances, tocompare[1-index].skills.Appearances)]}>{tocompare[index].skills.Appearances}</span></p>
              <p>Tackle: <span className={classes[this.checkTheColor(tocompare[index].skills.Tackle, tocompare[1-index].skills.Tackle)]}>{tocompare[index].skills.Tackle}</span></p>
              </>
            }
            </Typography>
          </CardContent>
        </Card>
        </>
      )
    );
  }
}
ItemtoCompare.propTypes = { 
  classes: PropTypes.shape({
    root: PropTypes.string,
  })
};

export default withStyles(styles)(ItemtoCompare);