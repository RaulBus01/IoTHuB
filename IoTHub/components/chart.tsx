import { View, Text } from 'react-native'
import React from 'react'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme,VictoryTooltip, VictoryVoronoiContainer,VictoryPortal } from "victory-native";

const Chart = (props:any) => {
  return (
    <View>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={10}
        containerComponent={<VictoryVoronoiContainer />}
        >
        <VictoryAxis
            tickValues={props.chartData.map((point:any) => point.x)}
            tickFormat={props.chartData.map((point:any) => `Quarter ${point.x}`)}
        />
        <VictoryAxis
            dependentAxis
            tickFormat={(x) => (`$${x / 1000}k`)}
        />
        <VictoryBar
            data={props.chartData}  
            labels={({ datum }) => `Quarter ${datum.x}: $${datum.y}`}
            labelComponent={<VictoryTooltip renderInPortal={false} />}
        />
        </VictoryChart>
    </View>
  )
}

export default Chart