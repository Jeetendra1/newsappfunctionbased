import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [pages, setpages] = useState(1);
  const [loading, setloading] = useState(true);
  const [totalResults, settotalResults] = useState(0);

  const capitalizedFirstLater = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // document.title = props.category;

  const updateNews = async () => {
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=6b83216f791f43acb31f2d64554dcb5b&page=${pages}&pageSize=${props.pageSize}`;
    setloading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(60);
    setArticles(parsedData.articles);
    // setpages(pages);
    setloading(false);
    settotalResults(parsedData.totalResults);
    props.setProgress(100);
  }
  useEffect(() => {
    updateNews();
  }, [])

  const clickOnPreviousPages = async () => {
    setpages(pages - 1);
    updateNews();
  };
  const clickOnNextPages = async () => {
    setpages(pages + 1);
    updateNews();
  };

   const fetchMoreData = async () => {
    setpages(pages + 1);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=6b83216f791f43acb31f2d64554dcb5b&page=${pages}&pageSize=${props.pageSize}`;
    setloading(true);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
    settotalResults(parsedData.totalResults);
    setloading(false);
  };
  return (
    <>
      <div className="container my-3">
        <h2> New Monkey- {capitalizedFirstLater(props.category)} Top Headlines</h2>
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={ <Spinner />}
        >
          <div className="container">
            <div className="row">
              {/* {loading && <Spinner />} */}

              {articles.map((element, index) => {
                return (
                  <div key={index} className="col-md-4">
                    <NewsItem
                      title={element.title}
                      description={element.description}
                      imageUrl={element.urlToImage}
                      newsURL={element.url}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </div>
      {/* <div className="container d-flex justify-content-between">
        <button
          disabled={pages <= 1}
          type="button"
          className="btn btn-dark"
          onClick={clickOnPreviousPages}
        >
          Previous
        </button>
        <button
          disabled={
            pages + 1 >
            Math.ceil(this.state.totalResults / props.pageSize)
          }
          type="button"
          className="btn btn-dark"
          onClick={clickOnNextPages}
        >
          Next
        </button>
      </div> */}
    </>
  );
}

News.defaultProps = {
  country: "in",
  pageSize: "6",
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.string,
  category: PropTypes.string,
};

export default News;
