import React, { Component } from 'react';
import axios from 'axios';
import { Pane, Tablist, Tab } from 'evergreen-ui';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

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
        //window.RGraph.reset(document.getElementById('chart-container-0'));
        //window.RGraph.reset(document.getElementById('chart-container-1'));
        //window.RGraph.reset(document.getElementById('chart-container-2'));
        // this.drawPriceChart();
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
        axios.get('http://localhost:8080/info/' + ticker)
          .then(function(response) {
            callback(response);
            });
    }

    render() {
        const ChartView = [
            (<LineChart width={700} height={300} data={this.state.data} margin={{top: 5, right: 30, left: 10, bottom: 25}}>
                <XAxis dataKey="date" angle={-45}  textAnchor="end"/>
                <YAxis />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend />
                <Line type="monotone" dot={false} dataKey="close" stroke="#8884d8" activeDot={{r: 8}}/>
            </LineChart>),
            (<LineChart width={700} height={300} data={this.state.data} margin={{top: 5, right: 30, left: 10, bottom: 25}}>
                <XAxis dataKey="date" angle={-45}  textAnchor="end"/>
                <YAxis />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend />
                <Line type="monotone" dot={false} dataKey="sumCompound" stroke="#8884d8" activeDot={{r: 8}}/>
            </LineChart>),
            (<LineChart width={700} height={300} data={this.state.data} margin={{top: 5, right: 30, left: 10, bottom: 25}}>
                <XAxis dataKey="date" angle={-45}  textAnchor="end"/>
                <YAxis />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend />
                <Line type="monotone" dot={false} dataKey="count" stroke="#8884d8" activeDot={{r: 8}}/>
            </LineChart>),
            (<LineChart width={700} height={300} data={this.state.data} margin={{top: 5, right: 30, left: 10, bottom: 25}}>
                <XAxis dataKey="date" angle={-45}  textAnchor="end"/>
                <YAxis />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend />
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
                <Pane padding={16} background="tint1" flex="1">
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

    drawPriceChart() {
        if(document.getElementById("chart-container-0") !== null) {
            console.log('container is present', document.getElementById("chart-container-0").getContext("2d"));
            new window.RGraph.Line({
                id: 'chart-container-0',
                price: this.state.price,
                options: {
                    backgroundGridVlines: false,
                    backgroundGridHlines: false,
                    backgroundGridBorder: false,
                    //key: ['Richard','Charlie'],
                    
                    gutterTop: 55,
                    
                    linewidth: 1,
                    hmargin: 0,
                    
                    title: 'Historical Price',
                    
                    gutterLeft: 50,
                    gutterBottom: 50,
                    yaxisDecimals: 2,
                    
                    tickmarksStyle: 'endcircle',
                    tickmarksFill: 'white',
                    tickmarksLinewidth: 3,
                    tickmarksSize: 10,
                    
                    spline: false,
                    xaxis: true,
                    yaxis: true,
                    xaxisLabels: this.state.labels,
                    shadow: false
                }
            }).draw();
            
        }
    }
}

export default ChartComponent;


