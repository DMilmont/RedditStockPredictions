import React, { Component } from 'react';
import {
    Pane,
    Text
} from "evergreen-ui";

class Fundamentals extends Component {
    render() {
        return (
            <Pane display="flex">
                <Pane 
                    flex={1}
                    display="flex"
                    margin={16}
                    height={120}
                    background="tint2"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text>
                        {this.props.ticker}
                    </Text>
                </Pane>
                <Pane 
                    flex={1}
                    display="flex"
                    margin={16}
                    height={120}
                    background="tint2"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text>
                        Price: {this.props.close}
                    </Text>
                </Pane>
                <Pane 
                    flex={1}
                    display="flex"
                    margin={16}
                    height={120}
                    background="tint2"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text>
                        High: {this.props.high}
                    </Text>
                </Pane>
                <Pane 
                    flex={1}
                    display="flex"
                    margin={16}
                    height={120}
                    background="tint2"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text>
                        Low: {this.props.low}
                    </Text>
                </Pane>         
            </Pane>
        );
    }
}

export default Fundamentals;