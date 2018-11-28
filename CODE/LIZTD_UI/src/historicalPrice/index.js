import React, { Component } from 'react';
import {Table, Text} from 'evergreen-ui';

class HistoricalPrice extends Component {
    render() {
        return(
                <Table>
                    <Table.Head>
                        <Table.TextHeaderCell>
                            Date
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            Open
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            High
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            Low
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            Close
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            Volume
                        </Table.TextHeaderCell>
                    </Table.Head>
                    <Table.VirtualBody height={300}>
                        {this.props.labels ? this.props.labels.map((label, index) => {
                            //console.log(this.props.high[index]);
                            return (
                                <Table.Row key={"historical_price_value_row_" + index}>
                                    <Table.TextCell>
                                        <Text>{label}</Text>
                                    </Table.TextCell>
                                    <Table.TextCell isNumber>
                                        <Text>{this.props.open[index]}</Text>
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        {this.props.high[index]}
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        {this.props.low[index]}
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        {this.props.close[index]}
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        {this.props.volume[index]}
                                    </Table.TextCell>
                                </Table.Row>
                            )
                        }) : null}
                    </Table.VirtualBody>
                </Table>
        )
    }
}

export default HistoricalPrice;