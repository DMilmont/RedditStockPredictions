import React, { Component } from 'react';
import axios from 'axios';
import { Pane, Tablist, Tab } from 'evergreen-ui';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class CustomizedXAxisTick extends Component {
    render () {
      const {x, y, stroke, payload} = this.props;
          
         return (
          <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={16} textAnchor="end" fontSize={10} fill="#666" transform="rotate(-35)">{payload.value}</text>
        </g>
      );
    }
};

class CustomizedYAxisTick extends Component {
    render () {
      const {x, y, stroke, payload} = this.props;
          
         return (
          <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={16} textAnchor="end" fontSize={10} fill="#666">{payload.value}</text>
        </g>
      );
    }
};

class ChartComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            ticker: this.props.ticker,
            selectedTabIndex: 0,
            tabs: ['Historical Price', 'Sentiment Score', 'Number of Posts', 'Prediction vs actual']
        }
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            ticker: newProps.ticker
        });
        this.initiateFetchStockData(newProps.ticker);
    }

    componentDidMount() {
        this.initiateFetchStockData(this.state.ticker);
    }

    initiateFetchStockData(ticker) {
        this.fetchJSONData(ticker, jsonData => {
          this.setState({
            data: jsonData.data
          })
        });
        
    }

    fetchJSONData(ticker, callback) {
        //axios.get('http://104.248.113.19:8000/info/' + ticker)
        axios.get('http://localhost:8000/info/' + ticker)
          .then(function(response) {
            callback(response);
            });
    }

    render() {
        const ChartView = [
            (<LineChart width={600} height={300} data={this.state.data} margin={{top: 5, right: 10, left: 10, bottom: 25}}>
                <XAxis dataKey="date" height={60} tick={<CustomizedXAxisTick/>} label="Price"/>
                <YAxis tick={<CustomizedYAxisTick/>} />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dot={false} dataKey="close" stroke="#8884d8" activeDot={{r: 8}}/>
            </LineChart>),
            (<LineChart width={600} height={300} data={this.state.data} margin={{top: 5, right: 10, left: 10, bottom: 25}}>
                <XAxis dataKey="date" height={60} tick={<CustomizedXAxisTick/>}/>
                <YAxis tick={<CustomizedYAxisTick/>} />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dot={false} dataKey="sumCompound" stroke="#8884d8" activeDot={{r: 8}}/>
            </LineChart>),
            (<LineChart width={600} height={300} data={this.state.data} margin={{top: 5, right: 10, left: 10, bottom: 25}}>
                <XAxis dataKey="date" height={60} tick={<CustomizedXAxisTick/>}/>
                <YAxis tick={<CustomizedYAxisTick/>} />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dot={false} dataKey="count" stroke="#8884d8" activeDot={{r: 8}}/>
            </LineChart>),
            (<LineChart width={600} height={300} data={this.state.data} margin={{top: 5, right: 10, left: 10, bottom: 25}}>
                <XAxis dataKey="date" height={60} tick={<CustomizedXAxisTick/>}/>
                <YAxis tick={<CustomizedYAxisTick/>} />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dot={false} dataKey="pred" stroke="#8884d8" activeDot={{r: 8}}/>
                <Line type="monotone" dot={false} dataKey="pct2" stroke="#82ca9d" activeDot={{r: 8}}/>
            </LineChart>)
        ];
        return (
            <Pane height={400}>
                <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
                {this.state.tabs.map((tab, index) => (
                    <Tab
                    key={tab}
                    id={tab}
                    onSelect={() => this.setState({ selectedTabIndex: index })}
                    isSelected={index === this.state.selectedTabIndex}
                    aria-controls={`panel-${tab}`}
                    >
                    {tab}
                    </Tab>
                ))}
                </Tablist>
                <Pane padding={2} background="tint1" flex="1">
                    {this.state.tabs.map((tab, tabIndex) => (
                        <Pane
                        key={tab}
                        id={`panel-${tab}`}
                        role="tabpanel"
                        aria-labelledby={tab}
                        aria-hidden={tabIndex !== this.state.selectedTabIndex}
                        display={tabIndex === this.state.selectedTabIndex ? 'block' : 'none'}
                        >
                        <Pane>
                            {this.state.data !== null && this.state.data !== undefined ? (ChartView[this.state.selectedTabIndex]) : null}
                        </Pane>
                    </Pane>
                ))}
                </Pane>
            </Pane> 
        )
    }
}

export default ChartComponent;


