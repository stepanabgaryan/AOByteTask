import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";
import data from "./Data/data";
import ItemtoCompare from "./Component/Card";

const styles = ((theme) => ({
  root: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
    borderWidth: '2px',
    borderColor: 'black',
    borderStyle: 'dotted',
    display: 'inline-block'
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  nested2: {
    paddingLeft: theme.spacing(8),
  },
  black: {
    color: 'black'
  },
  green: {
    color: 'green'
  },
  red: {
    color: 'red'
  },
  divtocompare: {
    borderWidth: '2px',
    borderColor: 'black',
    borderStyle: 'dotted',
    minWidth: '275px',
    minHeight: '250px',
    display: 'inline-block',
    verticalAlign: 'top',
    marginLeft: '15px'
  }
}));

class SoccerAnalyzer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openLeague: [true, false],
      openFC: [[true, true], [true, true]],
      PS: [],
      checkTeam: true,
      checkPlayer: true,
      checkPlDisable: [false, false, false, false, false, false, false, false],
      checkTLDisable: [false, false, false, false]
    };
  }

  handleClickLeague = (itemindex) => {
    const { openLeague } = this.state;

    this.setState({
      openLeague: [
        ...openLeague.slice(0, itemindex),
        !openLeague[itemindex],
        ...openLeague.slice(itemindex + 1)
      ]
    })
  }

  handleClickFC = (itemindex, teamindex) => {
    const { openFC } = this.state;
    const itemToCheck = openFC.find((item, index) => index === itemindex);

    this.setState({
      openFC: [
        ...openFC.slice(0, itemindex),
        [
          ...itemToCheck.slice(0, teamindex),
          !itemToCheck[teamindex],
          ...itemToCheck.slice(teamindex + 1)
        ],
        ...openFC.slice(itemindex + 1)
      ]
    })
  }

  handleDragFC = (player, a, b, c) => {
    let { PS, checkPlDisable, checkPlayer } = this.state;
    let index = this.handleGetIndex(a, b, c);
    let lastIndex = null;

    if (!checkPlayer) return false;

    if (PS.length > 1) {
      data.forEach((item, itemindex) => {
        item.FC.forEach((team, teamindex) => {
          team.players.forEach((player, playerindex) => {
            if (PS.slice(0, 1)[0].name === player.name) {
              lastIndex = this.handleGetIndex(itemindex, teamindex, playerindex);
            }
          });
        });
      });
      checkPlDisable = [
        ...checkPlDisable.slice(0, lastIndex),
        !checkPlDisable[lastIndex],
        ...checkPlDisable.slice(lastIndex + 1)
      ]
      this.setState({
        PS: [
          ...PS.slice(1),
          player
        ],
        checkTeam: false,
        checkPlDisable: [
          ...checkPlDisable.slice(0, index),
          !checkPlDisable[index],
          ...checkPlDisable.slice(index + 1)
        ]
      })
    } else {
      this.setState({
        PS: [...PS, player],
        checkTeam: false,
        checkPlDisable: [
          ...checkPlDisable.slice(0, index),
          !checkPlDisable[index],
          ...checkPlDisable.slice(index + 1)
        ]
      })
    }
  }

  handlePSChanged = (PS, check) => {
    let a = PS.length === 0 ? [] : [PS];
    let lastIndex = null;
    let checkPlDisable = [false, false, false, false, false, false, false, false];
    let checkTLDisable = [false, false, false, false];
    let { checkTeam, checkPlayer } = this.state;
    if (a.length === 0) { checkTeam = true; checkPlayer = true }

    if (a.length !== 0) {
      if (check === 'Player') {
        data.forEach((item, itemindex) => {
          item.FC.forEach((team, teamindex) => {
            team.players.forEach((player, playerindex) => {
              if (PS.name === player.name) {
                lastIndex = this.handleGetIndex(itemindex, teamindex, playerindex);
              }
            });
          });
        });
        checkPlDisable = [
          ...checkPlDisable.slice(0, lastIndex),
          !checkPlDisable[lastIndex],
          ...checkPlDisable.slice(lastIndex + 1)
        ]
      } else {
        data.forEach((item, itemindex) => {
          item.FC.forEach((team, teamindex) => {
            if (PS.name === team.name) {
              lastIndex = this.handleGetIndex(0, itemindex, teamindex);
            }
          });
        });
        checkTLDisable = [
          ...checkTLDisable.slice(0, lastIndex),
          !checkTLDisable[lastIndex],
          ...checkTLDisable.slice(lastIndex + 1)
        ]
      }
    }
    this.setState({
      PS: a,
      checkPlDisable: checkPlDisable,
      checkTLDisable: checkTLDisable,
      checkTeam: checkTeam,
      checkPlayer: checkPlayer
    })
  }

  handleGetIndex = (a, b, c) => {
    return a * Math.pow(2, 2) + b * Math.pow(2, 1) + c * Math.pow(2, 0);
  }

  handleDragFT = (team, a, b) => {
    let { PS, checkTLDisable, checkTeam } = this.state;
    let index = this.handleGetIndex(0, a, b);
    let lastIndex = null;
    let Goals = 0;
    let Appearances = 0;
    let Tackle = 0;

    team.players.forEach((player) => {
      Goals += player.skills.Goals;
      Appearances += player.skills.Appearances;
      Tackle += player.skills.Tackle;
    })

    let obj = {
      name: team.name,
      skills: {
        Goals: Goals,
        Appearances: Appearances,
        Tackle: Tackle
      }
    }

    if (!checkTeam) return false;

    if (PS.length > 1) {
      data.forEach((item, itemindex) => {
        item.FC.forEach((teamfc, teamindex) => {
          if (PS.slice(0, 1)[0].name === teamfc.name) {
            lastIndex = this.handleGetIndex(0, itemindex, teamindex);
          }
        });
      });
      checkTLDisable = [
        ...checkTLDisable.slice(0, lastIndex),
        !checkTLDisable[lastIndex],
        ...checkTLDisable.slice(lastIndex + 1)
      ]
      this.setState({
        PS: [
          ...PS.slice(1),
          obj
        ],
        checkPlayer: false,
        checkTLDisable: [
          ...checkTLDisable.slice(0, index),
          !checkTLDisable[index],
          ...checkTLDisable.slice(index + 1)
        ]
      })
    } else {
      this.setState({
        PS: [...PS, obj],
        checkPlayer: false,
        checkTLDisable: [
          ...checkTLDisable.slice(0, index),
          !checkTLDisable[index],
          ...checkTLDisable.slice(index + 1)
        ]
      })
    }
  }

  handleDrag1 = (ev, player, a, b, c, TP) => {
    const { checkPlayer } = this.state;
    if (!checkPlayer) ev.preventDefault();

    ev.dataTransfer.setData("player", JSON.stringify(player));
    ev.dataTransfer.setData("a", a);
    ev.dataTransfer.setData("b", b);
    ev.dataTransfer.setData("c", c);
    ev.dataTransfer.setData("TP", TP);
  }

  handleDrag2 = (ev, team, a, b, c, TP) => {
    const { checkTeam } = this.state;
    if (!checkTeam) ev.preventDefault();

    ev.dataTransfer.setData("player", JSON.stringify(team));
    ev.dataTransfer.setData("a", a);
    ev.dataTransfer.setData("b", b);
    ev.dataTransfer.setData("c", c);
    ev.dataTransfer.setData("TP", TP);
  }

  onDragOver = (ev) => {
    ev.preventDefault();
  }

  onDrop = (ev) => {
    var id = ev.dataTransfer.getData("player");
    var a = ev.dataTransfer.getData("a");
    var b = ev.dataTransfer.getData("b");
    var c = ev.dataTransfer.getData("c");
    var TP = ev.dataTransfer.getData("TP");

    TP === 'Player' ? this.handleDragFC(JSON.parse(id), a, b, c) : this.handleDragFT(JSON.parse(id), a, b);
  }

  render() {
    const { classes } = this.props;
    const { openLeague, openFC, PS, checkTeam, checkPlayer, checkPlDisable, checkTLDisable } = this.state;

    return (
      <>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          className={classes.root}
        >
          {data.map((item, itemindex) =>
            <>
              <ListItem button onClick={(e) => this.handleClickLeague(itemindex)}>
                {openLeague[itemindex] ? <FaCaretDown /> : <FaCaretRight />}
                <ListItemText primary={item.League} className={classes.black} />
              </ListItem>
              <Collapse in={openLeague[itemindex]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.FC.map((team, teamindex) =>
                    <>
                      <ListItem draggable onDragStart={(e) => this.handleDrag2(e, team, itemindex, teamindex, 0, 'Team')} button className={classes.nested} disabled={checkTLDisable[this.handleGetIndex(0, itemindex, teamindex)]} onClick={(e) => this.handleClickFC(itemindex, teamindex)}>
                        {openFC[itemindex][teamindex] ? <FaCaretDown /> : <FaCaretRight />}
                        <ListItemText className={checkTeam ? classes.green : classes.red} primary={team.name} />
                      </ListItem>
                      <Collapse in={openFC[itemindex][teamindex]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {team.players.map((player, playerindex) =>
                            <ListItem draggable onDragStart={(e) => this.handleDrag1(e, player, itemindex, teamindex, playerindex, 'Player')} key={player.name} button className={classes.nested2} disabled={checkPlDisable[this.handleGetIndex(itemindex, teamindex, playerindex)]}>
                              <ListItemText className={checkPlayer ? classes.green : classes.red} primary={player.name} />
                            </ListItem>
                          )}
                        </List>
                      </Collapse>
                    </>
                  )}
                </List>
              </Collapse>
            </>
          )}
        </List>
        <div className={classes.divtocompare} onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => { this.onDrop(e) }}>
          <ItemtoCompare value={PS} onCheck={this.handlePSChanged} compare={checkTeam ? 'Team' : 'Player'} />
        </div>
      </>
    );
  }
}
SoccerAnalyzer.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    nested: PropTypes.string,
    nested2: PropTypes.string,
    black: PropTypes.string,
    green: PropTypes.string,
    red: PropTypes.string,
    divtocompare: PropTypes.string
  })
};

export default withStyles(styles)(SoccerAnalyzer);