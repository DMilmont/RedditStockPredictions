import React, { Component } from 'react';
import { Pane, Heading, Autocomplete, TextInput } from 'evergreen-ui';
import StreamComponent from './stream';
import Fundamentals from './fundamentals';
import ChartComponent from './chart';
import HistoricalPrice from './historicalPrice';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: 'AAPL',
      labels: null,
      open: null,
      high: null,
      low: null,
      close: null,
      volume: null
    }
  }

  componentDidMount() {
    this.initiateFetchStockData(this.state.ticker);
  }

  initiateFetchStockData(ticker) {
    this.fetchCSVData(ticker, csvData => {
      this.setState({
          ticker: ticker,
          labels: csvData.getCol(0).slice(1),
          open: csvData.getCol(1).slice(1),
          high: csvData.getCol(2).slice(1),
          low: csvData.getCol(3).slice(1),
          close: csvData.getCol(4).slice(1),
          volume: csvData.getCol(5).slice(1)
      });
    });
  }

  fetchCSVData(ticker, callback) {
      return window.RGraph.CSV('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + ticker + '&apikey=79J8kCW1CDCDLV4N&datatype=csv', function(csv) {
          return callback(csv);
      });
  }

  render() {
    return (
      <div className="App">
        <Pane display="flex" padding={16} background="tint2"  elevation={1}>
          <Pane flex={1} alignItems="center" display="flex">
            <Heading size={600}>Liztd</Heading>
          </Pane>
          <Pane flex={1}>
            <Autocomplete
              title="Custom title"
              onChange={changedItem => {
                this.initiateFetchStockData(changedItem);
              }}

              items={['AMD', 'AAPL', 'AMZN', 'ADBE', 'A']}
            >
              {({
                key,
                getInputProps,
                getButtonProps,
                getRef,
                inputValue,
                openMenu,
                toggleMenu
              }) => (
                <Pane
                  key={key}
                  innerRef={getRef}
                  display="flex"
                >
                  <TextInput
                    flex="1"
                    placeholder="search symbol..."
                    value={inputValue}
                    onFocus={openMenu}
                    {...getInputProps()}
                  />
                </Pane>
              )}
            </Autocomplete>
          </Pane>
        </Pane>
        <Pane display="flex">
          <Pane 
            flex={1}
            padding={16}
          >
            <ChartComponent 
              ticker={this.state.ticker}
            />
            <HistoricalPrice 
              labels={this.state.labels}
              open={this.state.open}
              high={this.state.high}
              low={this.state.low}
              close={this.state.close}
              volume={this.state.volume}
            />
          </Pane>
          <Pane 
            flex={1}
            padding={16}
          >
            <Fundamentals 
              ticker={this.state.ticker}
              high={this.state.high ? this.state.high[this.state.high.length - 1] : '$0.0'}
              low={this.state.low ? this.state.low[this.state.low.length - 1] : '$0.0'}
              close={this.state.close ? this.state.close[this.state.close.length - 1] : '$0.0'}
            />
            <StreamComponent ticker={this.state.ticker} />
          </Pane>
        </Pane>
      </div>
    );
  }
}

export default App;
