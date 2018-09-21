import React, { Component } from "react";
import request from "superagent";
import "./App.css";

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
    const message =
      countries && countries.length
        ? `Countries fetched: ${(countries || []).length}`
        : "Loading...";
    return (
      <div className="App">
        <h3>World Facts Demo</h3>
        <div>{message}</div>
        <div>
          <label htmlFor="country-code">Enter country code</label>
          <input
            id="country-code"
            name="country-code"
            value={selectedCountryCode}
            onChange={this.countryCodeOnChange}
          />
          <button onClick={this.onSelectCountry}>Select</button>
        </div>
        <div>
          <div>{this.countryName()}</div>
          <div>{this.countryBackground()}</div>
          {/* <textarea rows={10} value={JSON.stringify(countryData)} /> */}
        </div>
      </div>
    );
  }
}

export default App;
