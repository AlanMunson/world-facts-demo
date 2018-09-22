import React, { Component } from "react";
import request from "superagent";
import "bootstrap";
import "./styles/app.css";
import SpinnerImage from "./images/spinner.svg";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: null,
      selectedCountryCode: "",
      countryData: null
    };
    this.getCountryData.bind(this);
  }

  async componentDidMount() {
    if (!this.state.countries) {
      const response = await request.get("/api/countries").accept("JSON");
      this.setState({ countries: response.body || null });
    }
  }

  async getCountryData() {
    const { selectedCountryCode } = this.state;
    if (selectedCountryCode && selectedCountryCode.length >= 2) {
      const response = await request
        .get(`/api/country/${selectedCountryCode.substring(0, 2)}`)
        .accept("JSON");
      this.setState({ countryData: response.body });
    }
  }

  countryCodeOnChange = e => {
    this.setState({ selectedCountryCode: e.currentTarget.value });
  };

  onSelectCountry = e => {
    this.getCountryData();
  };

  countryName = () =>
    this.state.countryData
      ? this.state.countryData.Government["Country name"][
          "conventional short form"
        ].text
      : "";

  countryBackground = () =>
    this.state.countryData
      ? this.state.countryData.Introduction.Background.text
      : "";

  render() {
    const { countries, countryData, selectedCountryCode } = this.state;
    const countriesLoaded = countries && countries.length;
    const message = countriesLoaded
      ? `Data is available for ${(countries || []).length} countries!`
      : "Loading country data...";
    return (
      <div className="container app">
        <div className="app-header row">
          <h1>World Facts Demo</h1>
          <div>{message}</div>
        </div>
        {!countriesLoaded ? (
          <Spinner show={!countriesLoaded} />
        ) : (
          <div className="app-body row">
            <form className="form-inline">
              <div className="form-group">
                <label for="country-code" className="country-code-label">
                  Enter country code
                </label>
                <input
                  id="country-code"
                  name="country-code"
                  type="text"
                  className="form-control country-code"
                  placeholder="Enter two-digit country code"
                  value={selectedCountryCode}
                  onChange={this.countryCodeOnChange}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-select-country"
                  onClick={this.onSelectCountry}
                >
                  Select
                </button>
              </div>
              <div className="form-group">
                <h3>{this.countryName()}</h3>
                <h4>{this.countryBackground()}</h4>
                {/* <textarea rows={10} value={JSON.stringify(countryData)} /> */}
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
}

const Spinner = () => (
  <div className="spinner">
    <img src={SpinnerImage} className="spinner-image" />
  </div>
);

export default App;
