import React, { PureComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import style from "../common/style";

import { splitString } from "../common/helper";
import { getRequest } from "../common/api.js";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#c41823"];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const styleChartCard = {
  border: `1px solid ${style.greyLight}`,
  height: "450px",
  marginRight: "10px",
  display: "flex",
  alignItems: "center",
};

export default class Example extends PureComponent {
  static jsfiddleUrl = "https://jsfiddle.net/alidingling/pb1jwdt1/";
  constructor(props) {
    super(props);
    this.state = { areaStats: { percent: [], count: [] } };
  }

  componentDidMount() {
    let userId = localStorage.getItem("userId");
    getRequest(`Users/area/stats/${userId}`).then((resp) => {
      let newPercent = [];
      let newCount = [];
      let percentObj = resp.data["area_stats"].percent;
      let percentCount = resp.data["area_stats"].count;
      for (let key in percentObj) {
        newPercent.push({
          name: splitString(key),
          value: percentObj[key],
        });
      }
      for (let key in percentCount) {
        newCount.push({
          name: splitString(key),
          count: percentCount[key],
        });
      }
      this.setState({
        areaStats: {
          percent: newPercent,
          count: newCount,
        },
      });
    });
  }

  render() {
    return (
      <div>
        <div style={{ padding: "20px 5px 20px 10px", fontSize: "1.5em" }}>
          Area Statistics
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={styleChartCard}>
            <PieChart width={400} height={400}>
              <Legend />
              <Pie
                data={this.state.areaStats.percent}
                cx={200}
                cy={200}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={140}
                fill="#8884d8"
                dataKey="value"
              >
                {this.state.areaStats.percent.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div style={styleChartCard}>
            <BarChart
              width={600}
              height={400}
              data={this.state.areaStats.count}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill={"#FACF5A"} />
            </BarChart>
          </div>
        </div>
      </div>
    );
  }
}
