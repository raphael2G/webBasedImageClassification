import ReactApexChart from "react-apexcharts";
import { useStateContext } from "../context";

function ApexChartz(props) {
  const { classNames } = useStateContext();
  const series = [
    {
      data: props.data[0],
    },
  ];
  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: classNames,
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
        width={"100%"}
      />
    </div>
  );
}

export default ApexChartz;
