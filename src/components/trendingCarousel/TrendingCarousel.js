/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../utils";
import "react-multi-carousel/lib/styles.css";
import { Image } from "semantic-ui-react";
import { NetworkIcon } from "../../utils/icons";
import CarouselSkeletonLoader from "../Loader/CarouselSkeletonLoader";
import Style from "./TrendingCarousel.styles";
import MovieSidebar from "../movieSidebar/MovieSidebar";
import { DownloadIcon } from "../../utils/icons";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2
  }
};

class TrendingCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trending_api: API_ENDPOINTS.ocena,
      trending: [],
      error: false,
      currentmovie: { name: "" },
      isLoading: true,
      showMovieSidebar: false
    };
  }

  componentDidMount() {
    const options = {
      method: "post",
      url: `${this.state.trending_api}/download/highest/`,
      data: {
        filter_by: "weeks",
        filter_num: 4,
        top: 10
      }
    };

    axios(options)
      .then((res) => {
        console.log(res);
        this.setState({
          trending: res.data,
          isLoading: false
        });
      })
      .catch((err) => {
        if (err) {
          this.setState({
            error: true,
            isLoading: false
          });
        }
      });
  }

  addDownload = (trendingMovie) => {
    console.log(trendingMovie, this.props.ip_address);
    axios
      .post(this.state.trending_api + "/download/", {
        ip_address: this.props.ip_address,
        referral_id: trendingMovie.referral_id
      })
      .then(() => {
        console.log(`added ${trendingMovie.name} to downloads on ocena`);
      });
  };

  openModal = (id) => {
    this.setState({
      showMovieSidebar: {
        [id]: !this.state.showMovieSidebar
      }
    });

    if (
      this.state.showMovieSidebar[id] === false ||
      this.state.showMovieSidebar[id] === undefined
    ) {
      this.setState({
        showMovieSidebar: {
          [id]: true
        }
      });
    }
    console.log(id, this.state.showMovieSidebar[id]);
  };

  render() {
    return (
      <div className="mleft">
        <h2 className="gophie-page-title mtop">Trending Movies</h2>
        <Style.TrendingMainCarousel
          responsive={responsive}
          deviceType={this.props.deviceType}
          keyBoardControl={true}
          infinite={true}
          ssr={true}
          autoPlay={this.props.deviceType !== "mobile" ? true : false}
          transitionDuration={800}
          containerClass="carousel-container"
        >
          {this.state.trending.map((trendingMovie, i) => {
            if (trendingMovie.name.endsWith("Tags")) {
              trendingMovie.name = trendingMovie.name.substr(
                0,
                trendingMovie.name.length - 4
              );
            }

            return (
              <div
                key={trendingMovie.referral_id}
                className="trending-carousal-image__container"
              >
                <Image
                  className="img-fluid trending-carousal-image"
                  onKeyDown={() => {
                    this.openModal(trendingMovie.referral_id);
                  }}
                  onClick={() => {
                    this.openModal(trendingMovie.referral_id);
                  }}
                  alt={trendingMovie.name}
                  onError={(e) => (
                    // eslint-disable-next-line
                    (e.target.onerror = null),
                    (e.target.src =
                      "https://raw.githubusercontent.com/Go-phie/gophie-web/master/public/no-pic.png")
                  )}
                  src={
                    trendingMovie.cover_photo_link
                      ? trendingMovie.cover_photo_link
                      : "https://raw.githubusercontent.com/Go-phie/gophie-web/master/public/no-pic.png"
                  }
                />
                <div className="carousal-image-detail">
                  <a
                    className="download-btn carousal-download-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={trendingMovie.download_link}
                    onClick={() => this.addDownload(trendingMovie)}
                    data-tour="my-eight-step"
                  >
                    <DownloadIcon />
                  </a>
                  <p>{trendingMovie.name}</p>
                </div>
                {this.state.showMovieSidebar[trendingMovie.referral_id] ? (
                  <MovieSidebar
                    toggle={() => this.openModal(trendingMovie.referral_id)}
                    movie={trendingMovie}
                  />
                ) : null}
              </div>
            );
          })}
        </Style.TrendingMainCarousel>
        {!this.state.isLoading ? null : (
          <Style.TrendingLoaderContainer className="w-100 d-flex">
            <CarouselSkeletonLoader />
            <CarouselSkeletonLoader />
            <CarouselSkeletonLoader />
            <CarouselSkeletonLoader />
          </Style.TrendingLoaderContainer>
        )}

        {!this.state.error ? null : (
          <div className="error">
            <p className="error-text">
              <NetworkIcon />
              <p>Try Again</p>
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default TrendingCarousel;
