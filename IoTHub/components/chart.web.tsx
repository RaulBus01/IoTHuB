import { View, Text,StyleSheet } from 'react-native'
import { Style, VictoryAxis, VictoryBar, VictoryChart, VictoryTheme,VictoryTooltip } from "victory";
import React from 'react'

const Chart = (props :any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '',
            alignItems: 'center',
      
        },
        chartView: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: 300,
          height: 500,
        },
      });
      
  return (
    <View style={styles.chartView}>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={10}
            width={400}
            height={500} // adjust as needed
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
              labelComponent={<VictoryTooltip />}
              
              
/>
          </VictoryChart>
        </View>
  )
  
}

export default Chart