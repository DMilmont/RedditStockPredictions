import React, { Component } from 'react';
import { Pane, Tablist, Tab, Paragraph, Table } from 'evergreen-ui';
import axios from 'axios';

class StreamComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticker: this.props.ticker,
            posts: [],
            selectedIndex: 0,
            tabs: ['Reddit']
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            ticker: newProps.ticker
        })
        this.initiateFetchPosts(newProps.ticker);
    }

    componentDidMount() {
        this.initiateFetchPosts(this.props.ticker);
    }

    initiateFetchPosts(ticker) {
        this.fetchPosts(ticker, posts => {
            this.setState({
                posts: posts
            })
        });
    }

    fetchPosts(ticker, cb) {
        axios.get('http://104.248.113.19:8000/posts/' + ticker)
        //axios.get('http://localhost:8000/posts/' + ticker)
            .then(function(response) {
                cb(response.data)
            });
    }

    render() {
        return (
            <Pane height={120}>
                <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
                    {this.state.tabs.map((tab, index) => (
                        <Tab
                            key={tab}
                            id={tab}
                            onSelect={() => this.setState({ selectedIndex: index })}
                            isSelected={index === this.state.selectedIndex}
                            aria-controls={`panel-${tab}`}
                        >
                            {tab}
                        </Tab>
                    ))}
                </Tablist>
                <Pane padding={16} background="tint1" flex="1">
                {this.state.tabs.map((tab, index) => (
                    <Pane
                        key={tab}
                        id={`panel-${tab}`}
                        role="tabpanel"
                        aria-labelledby={tab}
                        aria-hidden={index !== this.state.selectedIndex}
                        display={index === this.state.selectedIndex ? 'block' : 'none'}
                    >
                        <Pane  border height="60vh" display="flex" flexGrow={0}>
                            <Table flex={1} display="flex" flexDirection="column">
                                <Table.VirtualBody flex={1} allowAutoHeight>
                                    {this.state.posts.length > 0 ? (this.state.posts.map(post => {
                                        let intent = 'none';
                                        if (post.compound < 0) {
                                            intent = "danger";
                                        } else if (post.compound > 0) {
                                            intent = "success";
                                        }
                                        return (
                                        <Table.Row
                                            key={post.id}
                                            isSelectable
                                            intent={intent}
                                        >
                                            <Table.TextCell>
                                                <Paragraph>{post.title} </Paragraph>
                                            </Table.TextCell>
                                        </Table.Row>
                                        )
                                    })) : null}                               
                                </Table.VirtualBody>
                            </Table>
                        </Pane>
                    </Pane>
                    ))}
                </Pane>
            </Pane>
        );
    }
}

export default StreamComponent;