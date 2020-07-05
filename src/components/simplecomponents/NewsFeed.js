import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import { NewsfeedApi } from "../../services";
import Title from "./Title";

const useStyles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    transform: "translateZ(0)",
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  icon: {
    color: "white",
  },
});

class NewsFeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      news: [],
    };
  }

  componentDidMount() {
    this.fetchNews();
    this.refresh = setInterval(this.fetchNews.bind(this), 1000 * 60 * 15);
  }

  componentWillUnmount() {
    clearInterval(this.refresh);
  }

  async fetchNews() {
    const data = await NewsfeedApi.callRoute();
    this.setState({
      news: [...data],
    });
  }

  render() {
    const { classes } = this.props;
    const news = this.state.news;
    return (
      <React.Fragment>
        <Title>Recent News</Title>
        {news && (
          <GridList
            spacing={1}
            className={classes.gridList}
            cols={1}
            cellHeight={300}
            style={{ height: "100%" }}
          >
            {news.map((n) => {
              const newsDt = new Date(n.datetime * 1000);
              const title = `${n.headline} - ${newsDt.toLocaleString()}`;
              return (
                <GridListTile
                  key={n.id}
                  component="a"
                  href={n.url}
                  target="_blank"
                >
                  <img src={n.image} alt={title} />
                  <GridListTileBar title={title} subtitle={n.summary} />
                </GridListTile>
              );
            })}
          </GridList>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(NewsFeed);
