import { Chart, registerables } from "chart.js";
// eslint-disable-next-line
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables, ChartDataLabels);
export function BarChart({ chartData, chartQuestion }) {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "left", margin: "10px 0px 0px 10px" }}>
        {chartQuestion}
      </h2>
      <Bar
        style={{ padding: "30px" }}
        data={chartData}
        options={{
          lineWidth: 0,
          responsive: true,
          plugins: {
            datalabels: {
              display: true,
              color: "black",
              formatter: Math.round,
              anchor: "end",
              offset: -20,
              align: "start",
            },
            legend: {
              display: false,
            },
            title: {
              display: false,
              text: "Results",
            },
          },
          scales: {
            // to remove the labels
            x: {
              ticks: {
                display: true,
              },

              // to remove the x-axis grid
              grid: {
                drawBorder: false,
                display: false,
              },
            },
            // to remove the y-axis labels
            y: {
              beginAtZero: true,
              display: false,
              grace: "10%",
            },
          },
        }}
      />
    </div>
  );
}
